/**
 * @module preload
 */
import type { FileFilter } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import EventList from '#main/events/EventList';
import type { RouteLocationNormalized } from 'vue-router';
import { versions } from './versions';
import type { Recents } from '#main/storage/Recents';
import { getUUID } from './uuid';
import type { ProgressItem, ProgressReturn } from '#main/models/Progress';
import { joinPaths } from './path';
import { Question, SaveFile } from '#main/electron/Dialogs';

contextBridge.exposeInMainWorld('api', {
	info: {
		getMinecraftPath: () => ipcRenderer.sendSync(EventList.INFO.getMinecraftPath),
		getAppVersion: () => ipcRenderer.sendSync(EventList.INFO.appVersion),
	},

	onboarding: {
		getMinecraftResources: (mcDir: string, dirIsJar = false) => ipcRenderer.invoke(EventList.ONBOARDING.getMinecraftResources, mcDir, dirIsJar),
		buildData: () => ipcRenderer.invoke(EventList.ONBOARDING.buildData),
		setFinishedOnboarding: (finishedOnboarding: boolean) => ipcRenderer.invoke(EventList.ONBOARDING.setFinishedOnboarding, finishedOnboarding),
	},

	files: {
		selectFile: (buttonLabel?: string, filters: FileFilter[] = [], defaultPath?: string) => ipcRenderer.invoke(EventList.FILES.SELECT_FILE, buttonLabel, filters, defaultPath),
		openFolder: (buttonLabel?: string, defaultPath?: string) => ipcRenderer.invoke(EventList.FILES.OPEN_FOLDER, buttonLabel, defaultPath),

		getImage: (filePath: string) => ipcRenderer.invoke(EventList.FILES.GET_IMAGE, filePath),

		saveFile: (data: never, encoding: BufferEncoding, buttonLabel?: string, filters: FileFilter[] = [], defaultName?: string, defaultPath?: string) =>
			ipcRenderer.invoke(EventList.FILES.SAVE_FILE, data, encoding, buttonLabel, filters, defaultName, defaultPath),
	},

	config: {
		getRecents: (section: Recents) => ipcRenderer.invoke(EventList.CONFIG.GET_RECENTS, section),
		addToRecents: (section: Recents, file: string, name: string) => ipcRenderer.invoke(EventList.CONFIG.ADD_RECENT, section, file, name),
	},

	mc: {
		getNBT: (filePath: string) => ipcRenderer.invoke(EventList.MC.getNBT, filePath),

		getAssets: (version: string, dir: string[] | string = []) => ipcRenderer.invoke(EventList.MC.GET_ASSETS, version, dir),
		getAsset: (version: string, file: string) => ipcRenderer.invoke(EventList.MC.GET_ASSET, version, file),
	},

	worldViewer: {
		getRegions: (filePath: string) => ipcRenderer.invoke(EventList.WORLD_VIEWER.GET_REGIONS, filePath),
		getMap: (uuid: string, filePath: string) => ipcRenderer.invoke(EventList.WORLD_VIEWER.GET_MAP, uuid, filePath),
		createMap: (uuid: string, levelPath: string, filePath: string) => ipcRenderer.invoke(EventList.WORLD_VIEWER.CREATE_MAP, uuid, levelPath, filePath),

		calcMaps: (filePath: string) => ipcRenderer.invoke(EventList.WORLD_VIEWER.CALC_MAPS, filePath),
	},

	progress: {
		createSimple: (key: string, status: string, total: number) => ipcRenderer.invoke(EventList.PROGRESS.CREATE, key, {status, total}),
		createAdvanced: (key: string, status: string) => ipcRenderer.invoke(EventList.PROGRESS.CREATE, key, {status}, true),
		setStatus: (key: string, status: string, index?: number) => ipcRenderer.invoke(EventList.PROGRESS.SET_STATUS, key, status, index),
		setTotal: (key: string, total: number, index?: number) => ipcRenderer.invoke(EventList.PROGRESS.SET_TOTAL, key, total, index),
		count: (key: string, index?: number) => ipcRenderer.invoke(EventList.PROGRESS.COUNT, key, index),
		addItems: (key: string, items: ProgressItem[]) => ipcRenderer.invoke(EventList.PROGRESS.ADD_ITEMS, key, items),
	},

	setActivePage: (to: RouteLocationNormalized) => ipcRenderer.invoke(EventList.setActivePage, to.path as string, to.meta.page as string),

	dialog: (dialog: Question | SaveFile) => ipcRenderer.invoke(EventList.dialog, dialog),

	setSaved: (saved = false) => ipcRenderer.send(EventList.setSaved, saved),
	isSaved: () => ipcRenderer.send(EventList.isSaved),
	setProgressBar: (stage = -1) => ipcRenderer.invoke(EventList.setProgressBar, stage),
})

contextBridge.exposeInMainWorld('callback', {
	progressUpdate: (callback: () => ProgressReturn) => ipcRenderer.on(EventList.PROGRESS.UPDATE, callback),
})

contextBridge.exposeInMainWorld('vars', {
	BASE_URL: process.env.BASE_URL,
	IS_DEV: import.meta.env.DEV || process.argv.includes('--dev'),
	VERSIONS: versions,
})

contextBridge.exposeInMainWorld('getUUID', getUUID)
contextBridge.exposeInMainWorld('joinPaths', joinPaths)
