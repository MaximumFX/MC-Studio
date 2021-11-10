import { app, ipcRenderer } from 'electron'
import path from "path";
import {EventList} from "@/js/events";
import fs from "fs";

const getUserData = () => {
	let userDataPath
	if (process && process.type === 'renderer')
		userDataPath = ipcRenderer.sendSync(EventList.getPath, 'userData')
	else userDataPath = app.getPath('userData')
	return userDataPath
}

export class ConfigManager {
	constructor() {
		let userDataPath = getUserData()

		// Custom Terrain
		this.customTerrain = new CustomConfig('config', {
			datapacks: []
		}, 'custom_terrain')
		this.nbtEditor = new CustomConfig('nbtEditor', {
			recent: []
		})

		let packsPath = path.join(userDataPath, 'Data', 'custom_terrain/packs')
		if (!fs.existsSync(packsPath)) {
			fs.mkdir(packsPath, { recursive: true }, (err) => {
				if (err) console.error('Error while creating directory', err)
			})
		}
	}
}

export class CustomConfig {
	#name
	#defaults
	#path
	#filePath
	#data

	constructor(name = 'config', defaults = {}, configPath) {
		this.#name = name
		this.#defaults = defaults

		let userDataPath = getUserData()

		this.#path = configPath ? path.join(userDataPath, 'Data', configPath) : path.join(userDataPath, 'Data')
		this.#filePath = path.join(this.#path, name + '.json')

		if (!fs.existsSync(this.#filePath)) {
			fs.mkdir(this.#path, { recursive: true }, (err) => {
				if (err) console.error('Error while creating config directory', err)
				else fs.writeFileSync(this.#filePath, JSON.stringify(defaults))
			})
		}

		this.#data = parseDataFile(this.#filePath, defaults)
	}

	get = key => this.#data[key]

	set = (key, val) =>	this.#data[key] = val

	add = (key, val) => {
		this.#data[key].push(val)
		console.log(this.#data)
	}

	save = () => fs.writeFileSync(this.#filePath, JSON.stringify(this.#data))
	reload = () => {
		// console.log('[Reload config]', this.#name)
		this.#data = parseDataFile(this.#filePath, this.#defaults)
	}
}

function parseDataFile(filePath, defaults) {
	try {
		return JSON.parse(fs.readFileSync(filePath))
	} catch(error) {
		return defaults
	}
}
