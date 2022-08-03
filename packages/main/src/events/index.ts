import type { BrowserWindow, FileFilter } from 'electron';
import { app, dialog, ipcMain, Menu } from 'electron';
import path from 'path';
import fs, { promises as fsp } from 'fs';
import unzipper from 'unzipper';
import fileSize from 'filesize';
import dateFormat from '@/external/dateformat';
import nbt from 'prismarine-nbt';
import mime from 'mime';

import { getMenu } from '@/Menu';
import { config, settings } from '@/index';
import EventList from './EventList';
import type { RecentFile, RecentFileExtended } from '#type/RecentFile';
import { Recents } from '@/storage/Recents';
import { deconstructNBT, getDirectories, getFolderSize } from '@/Helper';
import { calcMaps, createMap } from '@/events/WorldViewer';
import { getUUID } from '../../../preload/src/uuid';
import { Paths } from '@/Path';
import MCData from '@/MCData';
import type { ProgressItem } from '@/models/Progress';
import type Progress from '@/models/Progress';
import { AdvancedProgress, ProgressType, SimpleProgress } from '@/models/Progress';
import { Question, SaveFile } from '@/electron/Dialogs';

export default class Index {
	activePath: string
	activePage: string
	saved: boolean

	#mainWindow: BrowserWindow

	progress: {[key: string]: Progress} = {}
	oldProgressStatus = ''

	constructor(mainWindow: BrowserWindow) {
		this.#mainWindow = mainWindow
		this.activePath = '/'
		this.activePage = 'home'
		this.saved = true

		// INFO
		ipcMain.on(EventList.INFO.getMinecraftPath, event => {
			if (process.platform === 'darwin') {
				if (!process.env.HOME) throw 'no_home'
				event.returnValue = path.join(process.env.HOME, 'Library/Application Support/minecraft')
			}
			else if (process.platform === 'win32') {
				if (!process.env.APPDATA) throw 'no_appdata'
				event.returnValue = path.join(process.env.APPDATA, '.minecraft')
			}
			else throw 'unsupported_platform'
		})
		ipcMain.on(EventList.INFO.appVersion, event => event.returnValue = app.getVersion())

		// Get file paths from renderer
		ipcMain.handle(EventList.INFO.getPath, (event, arg) => arg === 'appPath' ? app.getAppPath() : app.getPath(arg))
		ipcMain.on(EventList.INFO.getPath, (event, arg) => event.returnValue = arg === 'appPath' ? app.getAppPath() : app.getPath(arg))



		// ONBOARDING
		ipcMain.handle(EventList.ONBOARDING.getMinecraftResources, async (event, mcDir = '', dirIsJar = false) => {
			const jarPath = dirIsJar ? mcDir : path.join(mcDir, 'versions', '1.19', '1.19.jar')
			if (!mcDir.length || !fs.existsSync(jarPath)) throw 'no_dir'

			const version = path.basename(jarPath, path.extname(jarPath))
			const mcData = path.join(Paths.MC_DIR(), version)

			if (fs.existsSync(mcData)) return version//todo proper file checking

			config.mcAssets.add('recents', {
				file: jarPath,
				uuid: getUUID(),
				name: version,
			})
			config.mcAssets.save()

			const key = EventList.ONBOARDING.getMinecraftResources
			this.progressBar.create(key, { status: 'Loading jar', total: 1})
			const directory = await unzipper.Open.file(jarPath);
			this.progressBar.setTotal(key, directory.files.length + 2);
			this.progressBar.setStatus(key, 'Creating files')
			this.progressBar.count(key)

			try {
				const zip = fs.createReadStream(jarPath).pipe(unzipper.Parse({forceStream: true}))
				for await (const entry of zip) {
					const fileName = entry.path

					console.log(entry.type);
					if (entry.type === 'File' && !fileName.endsWith('.class') && !fileName.startsWith('META-INF') &&
						!['flightrecorder-config.jfc', 'log4j2.xml'].includes(fileName)) {//fileName.startsWith('assets') || fileName === 'version.json'
						const filePath = path.join(mcData, path.dirname(fileName))
						if (!fs.existsSync(filePath))
							await fsp.mkdir(filePath, { recursive: true })
						entry.pipe(fs.createWriteStream(path.join(mcData, fileName)))
					}
					else entry.autodrain()
					this.progressBar.count(key)
				}

				if (!dirIsJar) {
					settings.minecraftPath = mcDir
					config.settings.setJSON(settings)
					await config.settings.saveAsync()
				}
				this.progressBar.count(key)

				return version
			} catch (e) {
				console.error(e)
				throw e
			}
		})
		ipcMain.handle(EventList.ONBOARDING.buildData, async () => {
			await MCData.buildBlockColors()
		})
		ipcMain.handle(EventList.ONBOARDING.setFinishedOnboarding, async (event, finishedOnboarding: boolean) => {
			settings.finishedOnboarding = finishedOnboarding
			config.settings.setJSON(settings)
			return await config.settings.saveAsync()
		})



		// FILES
		ipcMain.handle(EventList.FILES.SELECT_FILE, (event, buttonLabel = 'Open', filters: FileFilter[] = [], defaultPath?: string) => new Promise((res, rej) => {
			dialog.showOpenDialog(mainWindow, {
				buttonLabel,
				defaultPath,
				filters,
				properties: [
					'openFile',
				],
			}).catch(e => rej(e)).then(result => {
				if (result && result.filePaths[0] != null) {
					res(result.filePaths[0])
				}
				else rej(new Error('no-file-selected'))
			})
		}))
		ipcMain.handle(EventList.FILES.OPEN_FOLDER, (event, buttonLabel = 'Open', defaultPath?: string) => new Promise((res, rej) => {
			dialog.showOpenDialog(mainWindow, {
				buttonLabel,
				defaultPath,
				properties: [
					'openDirectory',
				],
			}).catch(e => rej(e)).then(result => {
				if (result && result.filePaths[0] != null) {
					res(result.filePaths[0])
				}
				else rej(new Error('no-folder-selected'))
			})
		}))
		ipcMain.handle(EventList.FILES.SAVE_FILE, (event, data: any, encoding: BufferEncoding, buttonLabel = 'Save', filters: FileFilter[] = [], defaultName?: string, defaultPath?: string) => new Promise((res, rej) => {
			if (defaultName && !defaultPath)
				defaultPath = path.join(app.getPath('documents'), defaultName)

			dialog.showSaveDialog(mainWindow, {
				buttonLabel,
				defaultPath,
				filters,
			}).catch(e => rej(e)).then(async result => {
				console.log(result)
				if (result && result.filePath != null && result.filePath.length) {
					try {
						await fsp.writeFile(result.filePath, data, encoding)
						res(result.filePath)
					} catch (e) {
						rej(e)
					}
				}
				else rej(new Error('no-file-selected'))
			})
		}))

		ipcMain.handle(EventList.FILES.GET_IMAGE, (event, fileName: string) => fs.promises.readFile(fileName, 'base64'))



		// CONFIG
		ipcMain.handle(EventList.CONFIG.GET_RECENTS, async (event, section: Recents): Promise<RecentFileExtended[]> => {
			const recent = (config[section].get('recent') ?? []).filter((r: RecentFile) => fs.existsSync(r.file))
			config[section].set('recent', recent)
			config[section].save()

			const newRecent = []
			for (const r of recent) {
				const stats = fs.statSync(r.file)
				let size = stats.size
				let date = stats.mtime
				if (section === Recents.mcAssets) {
					const dir = path.join(Paths.MC_DIR(), r.name)
					if (fs.existsSync(dir)) {
						date = fs.statSync(dir).mtime
						const tmp = await getFolderSize(dir)
						if (tmp !== undefined) size = tmp
					}
				}
				newRecent.push({
					...r,
					name: r.name ?? path.basename(r.file),
					lastOpened: dateFormat(new Date(date), 'd mmmm yyyy HH:MM:ss'),
					size: fileSize(size),
				})
			}


			return newRecent.reverse()
		})
		ipcMain.handle(EventList.CONFIG.ADD_RECENT, (event, section: Recents, file: string, name: string) => {
			// Add to recent
			let uuid = getUUID()
			let recent: RecentFile[] = (config[section].get('recent') ?? []).filter((r: RecentFile) => fs.existsSync(r.file))
			const recentFile = recent.find(a => a.file === file)
			if (recentFile) {
				uuid = recentFile.uuid
				recent = recent.filter(a => a.file !== file)
				recent.push({file, uuid, name })
			}
			else recent.push({file, uuid, name })
			config[section].set('recent', recent)
			config[section].save()
			return { file, uuid, name }
		})



		// MC
		ipcMain.handle(EventList.MC.getNBT, async (event, filePath: string) => {
			const buffer = await fs.readFileSync(filePath)
			const { parsed } = await nbt.parse(buffer)
			return deconstructNBT(parsed)
		})
		ipcMain.handle(EventList.MC.GET_ASSETS, async (event, version: string, dir: string[] | string = []) => {
			if (typeof dir === 'string') dir = [dir]
			return await getDirectories(path.join(Paths.MC_DIR(), version, ...dir), false, dir.length > 0)
		})
		ipcMain.handle(EventList.MC.GET_ASSET, async (event, version: string, file: string, includeMCMeta = false) => {
			const filePath = path.join(Paths.MC_DIR(), version, file)
			const mimeType = mime.getType(path.extname(file))
			let encoding: BufferEncoding = 'utf8'
			if (mimeType && mimeType.startsWith('image')) encoding = 'base64'
			let data
			if (!fs.existsSync(filePath)) {
				console.warn('No asset found', version, file);
				throw 'no_asset'
			}
			if (path.extname(file) === '.nbt') {
				const buffer = await fsp.readFile(filePath)
				const { parsed } = await nbt.parse(buffer)
				const nbtData = deconstructNBT(parsed)
				data = JSON.stringify(nbtData, null, 4)
			}
			else data = await fsp.readFile(filePath, encoding)

			if (includeMCMeta && fs.existsSync(filePath + '.mcmeta')) {
				return {
					path: filePath,
					relativePath: file,
					mime: mimeType,
					data,
					mcmeta: JSON.parse(await fsp.readFile(filePath + '.mcmeta', 'utf8')),
				}
			}

			return {
				path: filePath,
				relativePath: file,
				mime: mimeType,
				data,
			}
		})



		// WORLD VIEWER
		ipcMain.handle(EventList.WORLD_VIEWER.GET_REGIONS, async (event, file) => {
			const dir = await fs.promises.readdir(path.join(path.dirname(file), 'region'))
			const files = []
			for (const f of dir) {
				if ((await fs.promises.stat(path.join(path.dirname(file), 'region', f))).size > 0)
					files.push({
						path: f,
						x: parseInt(f.split('.')[1]),
						z: parseInt(f.split('.')[2]),
					})
			}
			return files
			// return dir.map(f => ({
			// 	path: f,
			// 	x: parseInt(f.split('.')[1]),
			// 	z: parseInt(f.split('.')[2])
			// }))
		})
		ipcMain.handle(EventList.WORLD_VIEWER.GET_MAP, async (event, uuid, file) => {
			const dir = path.join(app.getPath('userData'), 'Data', 'Images', 'WorldViewer', uuid, path.basename(file, path.extname(file)) + '.png')

			if (fs.existsSync(dir)) return dir
			return null
		})
		ipcMain.handle(EventList.WORLD_VIEWER.CREATE_MAP, (event, uuid: string, levelPath: string, filePath: string) =>
			createMap(mainWindow, uuid, levelPath, filePath, this.progress[ProgressType.WORLD_VIEWER] as AdvancedProgress))
		ipcMain.handle(EventList.WORLD_VIEWER.CALC_MAPS, async (event, filePath: string) =>
			calcMaps(filePath, this.progress[ProgressType.WORLD_VIEWER] as AdvancedProgress))



		// Saved
		ipcMain.on(EventList.setSaved, (event, saved = false) => {
			this.saved = saved
			if (process.platform === 'darwin')
				mainWindow.setDocumentEdited(!saved)
		})
		ipcMain.on(EventList.isSaved, () => this.saved)



		// Menu
		ipcMain.handle(EventList.setActivePage, (event, path, page) => {
			this.activePath = path
			this.activePage = page
			Menu.setApplicationMenu(getMenu(path, page, this))
		})



		// Dialogs
		ipcMain.handle(EventList.dialog, (event, dia: Question | SaveFile) => {
			if (dia instanceof SaveFile) {
				if (dia.defaultPath)
					dia.defaultPath = path.join(dia.defaultPath, dia.defaultName)
				else {
					dia.defaultPath = path.join(app.getPath('downloads'), dia.defaultName)
				}
				return dialog.showSaveDialog(dia)
			}
			return dialog.showMessageBox(mainWindow, dia)
		})



		// PROGRESS BAR
		ipcMain.handle(EventList.PROGRESS.CREATE, (event, key: string, props: {status: string, total?: number}, advanced = false) =>
			this.progressBar.create(key, props, advanced))

		ipcMain.handle(EventList.PROGRESS.COUNT, (event, key: string, index?: number) =>
			this.progressBar.count(key, index))

		ipcMain.handle(EventList.PROGRESS.SET_STATUS, (event, key: string, status: string, index?: number) =>
			this.progressBar.setStatus(key, status, index))

		ipcMain.handle(EventList.PROGRESS.SET_TOTAL, (event, key: string, total: number, index?: number) =>
			this.progressBar.setTotal(key, total, index))

		ipcMain.handle(EventList.PROGRESS.ADD_ITEMS, (event, key: string, items: ProgressItem[]) =>
			this.progressBar.addItems(key, items))

		ipcMain.handle(EventList.setProgressBar, (event, stage = 0) => {
			mainWindow.setProgressBar(stage)
		})



		// OSM
		// ipcMain.handle(EventList.CREATE_OSM_SCHEMATIC, async (event, arg) => {
		// 	const buffer = await fs.promises.readFile(arg, 'utf8')
		// 	// const parser = new DOMParser()
		// 	// const dom = parser.parseFromString(buffer, "application/xml")
		// 	// const osm = OSM.fromXML(dom)
		// 	const osm = OSM.fromString(buffer)
		// 	return new OSMSchematic(osm).createSchematic()
		// })
	}

	send = (channel: string, ...args: any[]) => {
		if (!this.#mainWindow.isDestroyed())
			this.#mainWindow.webContents.send(channel, ...args)
	}

	setSaved = (val: boolean) => this.saved = val

	setWindow = (window: BrowserWindow) => this.#mainWindow = window

	private progressBar = {
		create: (key: string, props: {status: string, total?: number}, advanced = false) => {
			if (!advanced && !props.total) throw 'SimpleProgress requires a total number'
			const pro = advanced ? new AdvancedProgress(props.status) : new SimpleProgress(props.status, props.total)
			pro.onUpdate((status, stage, items, activeItem, activeStatus) => {
				this.send(EventList.PROGRESS.UPDATE, { status, stage, items, activeItem, activeStatus })
				if (this.oldProgressStatus !== status + activeStatus) {
					console.log('Update status', key, status, stage, items, activeItem, activeStatus)
					this.oldProgressStatus = status + activeStatus
				}

				if (stage === 1) delete this.progress[key]
			})
			this.progress[key] = pro
			console.log('[Events progressBar.create] Created progress bar named', key);
		},
		count: (key: string, index?: number) => {
			const pr = this.progress[key]
			if (pr instanceof SimpleProgress)
				pr.count()
			else if (pr instanceof AdvancedProgress) {
				if (index != undefined)
					pr.count(index)
				else throw 'no_index'
			}
			return pr.getUpdate()
		},
		finish: (key: string, index?: number) => {
			const pr = this.progress[key]
			if (pr instanceof SimpleProgress)
				pr.finish()
			else if (pr instanceof AdvancedProgress) {
				if (index != undefined)
					pr.finish(index)
				else throw 'no_index'
			}
			return pr.getUpdate()
		},
		setStatus: (key: string, status: string, index?: number) => {
			const pr = this.progress[key]
			if (pr instanceof SimpleProgress)
				pr.setStatus(status)
			else if (pr instanceof AdvancedProgress) {
				if (index != undefined)
					pr.setItemStatus(status, index)
				else pr.setStatus(status)
			}
			return pr.getUpdate()
		},
		setTotal: (key: string, total: number, index?: number) => {
			const pr = this.progress[key]
			if (pr instanceof SimpleProgress)
				pr.setTotal(total)
			else if (pr instanceof AdvancedProgress) {
				if (index != undefined)
					pr.setTotal(total, index)
				else throw 'no_index'
			}
			return pr.getUpdate()
		},
		addItems: (key: string, items: ProgressItem[]) => {
			const pr = this.progress[key]
			if (pr instanceof AdvancedProgress)
				pr.addItems(...items)
			return pr.getUpdate()
		},
	}
}
