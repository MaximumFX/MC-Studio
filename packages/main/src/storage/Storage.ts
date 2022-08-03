import {app, ipcRenderer} from 'electron'
import EventList from '@/events/EventList';
import fs from 'fs';
import Settings from '@/Settings';
import path from 'path';

const getUserData = () => {
	if (process && process.type === 'renderer')
		return ipcRenderer.sendSync(EventList.INFO.getPath, 'userData')
	return app.getPath('userData')
}

export class ConfigManager {
	settings: CustomConfig

	worldViewer: CustomConfig
	mcAssets: CustomConfig
	schematics: CustomConfig

	// customTerrain: CustomConfig
	// nbtEditor: CustomConfig
	// titleGenerator: CustomConfig

	constructor() {
		// const userDataPath = getUserData()

		// Settings
		this.settings = new CustomConfig('settings', new Settings())

		// Config files
		this.worldViewer = new CustomConfig('worldViewer', {
			recent: [],
		})
		this.mcAssets = new CustomConfig('mcAssets', {
			recent: [],
		})
		this.schematics = new CustomConfig('schematics', {
			recent: [],
		})
		// Custom Terrain
		// this.customTerrain = new CustomConfig('config', {
		// 	datapacks: [],
		// }, 'custom_terrain')
		// this.nbtEditor = new CustomConfig('nbtEditor', {
		// 	recent: [],
		// })
		// this.titleGenerator = new CustomConfig('titleGenerator', {
		// 	titles: [],
		// })
		//
		// const packsPath = path.join(userDataPath, 'Data', 'custom_terrain/packs')
		// if (!fs.existsSync(packsPath)) {
		// 	fs.mkdir(packsPath, { recursive: true }, (err) => {
		// 		if (err) console.error('Error while creating directory', err)
		// 	})
		// }
	}
}

export class CustomConfig {
	#name
	readonly #defaults
	readonly #path
	readonly #filePath
	#data

	constructor(name = 'config', defaults = {}, configPath?: string) {
		this.#name = name
		this.#defaults = defaults

		const userDataPath = getUserData()

		this.#path = configPath ? path.join(userDataPath, 'Data', configPath) : path.join(userDataPath, 'Data')
		this.#filePath = path.join(this.#path, name + '.json')

		if (!fs.existsSync(this.#filePath)) {
			fs.mkdir(this.#path, { recursive: true }, (err) => {
				if (err) console.error('Error while creating config directory', err)
				else fs.writeFileSync(this.#filePath, JSON.stringify(defaults), 'utf8')
			})
		}

		this.#data = parseDataFile(this.#filePath, defaults)
	}

	get = (key: string) => this.#data[key]

	set = (key: string, val: never) =>	this.#data[key] = val

	add = (key: string, val: any) => this.#data[key].push(val)

	save = () => fs.writeFileSync(this.#filePath, JSON.stringify(this.#data), 'utf8')
	saveAsync = () => fs.promises.writeFile(this.#filePath, JSON.stringify(this.#data), 'utf8')
	reload = () => {
		// console.log('[Reload config]', this.#name)
		this.#data = parseDataFile(this.#filePath, this.#defaults)
	}

	getJSON = () => this.#data
	setJSON = (json: object) => this.#data = json
}

function parseDataFile(filePath: string, defaults: object | never[]) {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'utf8'))
	} catch(error) {
		return defaults
	}
}
