import OSMSchematic from "@/js/OSM/OSMSchematic";
import OSM from "@/js/OSM/OSM";
import { app, ipcMain, dialog, Menu } from 'electron'
import {getMenu} from "@/js/menu";

export default class Events  {
	#mainWindow
	constructor(mainWindow) {
		this.#mainWindow = mainWindow
		this.activePath = '/'
		this.activePage = 'home'
		this.saved = true

		// Get file paths from renderer
		ipcMain.handle(EventList.getPath, (event, arg) =>	arg === 'appPath' ? app.getAppPath() : app.getPath(arg))
		ipcMain.on(EventList.getPath, (event, arg) => event.returnValue =	arg === 'appPath' ? app.getAppPath() : app.getPath(arg))

		// Saved
		ipcMain.handle(EventList.setSaved, (event, saved = false) => {
			this.saved = saved
			mainWindow.setDocumentEdited(!saved)
		})
		ipcMain.handle(EventList.isSaved, () => this.saved)

		// Menu
		ipcMain.handle(EventList.setActivePage, (event, path, page) => {
			this.activePath = path
			this.activePage = page
			Menu.setApplicationMenu(getMenu(path, page, this))
		})

		// Dialogs
		ipcMain.handle('openFileDialog', () => dialog.showOpenDialog(mainWindow, {
			properties: [
				'openFile'
			]
		}))
		ipcMain.handle(EventList.SELECT_FILE, (event, msg = 'Open') => new Promise((res, rej) => {
			dialog.showOpenDialog(mainWindow, {
				buttonLabel: msg,
				properties: [
					'openFile',
				]
			}).catch(e => rej(e)).then(result => {
				if (result.filePaths[0] != null) {
					res(result.filePaths[0])
				}
				else rej(new Error('no-file-selected'))
			})
		}))
		ipcMain.handle(EventList.OPEN_FOLDER, (event, msg = 'Open') => new Promise((res, rej) => {
			dialog.showOpenDialog(mainWindow, {
				buttonLabel: msg,
				properties: [
					'openDirectory',
				]
			}).catch(e => rej(e)).then(result => {
				if (result.filePaths[0] != null) {
					res(result.filePaths[0])
				}
				else rej(new Error('no-folder-selected'))
			})
		}))

		ipcMain.handle(EventList.dialog, (event, dia) => {
			if (dia.type === 'saveFile') {
				if (dia.defaultPath)
					dia.defaultPath = path.join(dia.defaultPath, dia.defaultName)
				else {
					dia.defaultPath = path.join(app.getPath('downloads'), dia.defaultName)
				}
				return dialog.showSaveDialog(dia)
			}
			return dialog.showMessageBox(mainWindow, dia)
		})

		// Progress Bar
		ipcMain.handle(EventList.setProgressBar, (event, stage = 0) => {
			mainWindow.setProgressBar(stage)
		})

		// OSM
		ipcMain.handle(EventList.CREATE_OSM_SCHEMATIC, (event, arg) => {
			const osm = OSM.fromString(arg)
			return new OSMSchematic(osm).createSchematic()
		})

		// CustomTerrain
	}

	send = (channel, ...args) => {
		this.#mainWindow.webContents.send(channel, ...args)
	}

	setSaved = val => this.saved = val
}

export const EventList = {
	getPath: 'getPath',
	setActivePage: 'setActivePage',

	SELECT_FILE: 'selectFile',
	OPEN_FOLDER: 'openFolder',
	dialogQuestion: 'dialogQuestion',
	setSaved: 'setSaved',
	isSaved: 'isSaved',

	setProgressBar: 'setProgressBar',

	CREATE_OSM_SCHEMATIC: 'createOSMSchematic',

}
