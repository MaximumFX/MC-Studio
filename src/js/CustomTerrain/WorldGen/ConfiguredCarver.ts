import IntProvider from "@/js/CustomTerrain/Helpers/IntProvider";
import {v4 as uuidv4} from "uuid";
import CTFile from "@/js/CustomTerrain/CTFile";
import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum";
import fs from "fs";
import Validation, {Choice, ValidationType} from "@/js/CustomTerrain/Validation";

interface ConfiguredCarverConfigJSON {
	type: string
	config: object
}
export default class ConfiguredCarver {
	name: string
	type: string
	config?: Carver

	constructor(name = 'unnamed', json: ConfiguredCarverConfigJSON) {
		this.name = name
		this.type = json.type

		if (!this.type.includes(':')) this.type = 'minecraft:' + this.type

		if (this.type === 'minecraft:canyon') {
			this.config = new Canyon(json.config)
		}
		else if (this.type === 'minecraft:underwater_canyon') {
			this.config = new UnderwaterCanyon(json.config)
		}
		else if (this.type === 'minecraft:cave') {
			this.config = new Cave(json.config)
		}
		else if (this.type === 'minecraft:underwater_cave') {
			this.config = new UnderwaterCave(json.config)
		}
		else if (this.type === 'minecraft:nether_cave') {
			this.config = new NetherCave(json.config)
		}
		else console.error('Undefined ConfiguredCarver type:', this.type)
	}

	static getStructure = () => ({
		type: Validation.choiceValue(),
		config: Validation.choice(false, [
			new Choice('minecraft:canyon', 'Canyon', ValidateCanyon),
			new Choice('minecraft:underwater_canyon', 'Underwater canyon', ValidateCanyon),
			new Choice('minecraft:cave', 'Cave', ValidateCanyon),
			new Choice('minecraft:underwater_cave', 'Underwater cave', ValidateCanyon),
			new Choice('minecraft:nether_cave', 'Nether cave', ValidateCanyon),
		], 'type')
	})
	getStructure = () => ConfiguredCarver.getStructure()

	static save = (packId: string, namespaceId: string, name: string, json: ConfiguredCarver, uuid: string = uuidv4()) => {
		return CTFile.save(packId, namespaceId, name, json, CTFileType.ConfiguredCarver, uuid)
	}
	static load = async (packId: string, namespaceId: string, uuid: string) => {
		const paths = await CTFile.getPaths(packId, namespaceId, uuid, CTFileType.ConfiguredCarver)
		const json = JSON.parse(await fs.promises.readFile(paths.filePath, 'utf8'))
		return new ConfiguredCarver(json.name, json.json)
	}
}

interface CarverJSON {//todo
	lava_level: number
	aquifers_enabled: boolean
	probability: number
	y: IntProvider | number
	yScale: number
	debug_settings?: any
}

const ValidateCarver = {
	lava_level: Validation.int(),
	aquifers_enabled: Validation.boolean(),
	probability: Validation.float(),
	yScale: Validation.float()
}
export class Carver {//todo
	public type: string//TODO remove in json

	lava_level: number
	aquifers_enabled: boolean
	probability: number
	y: IntProvider | number
	yScale: number
	debug_settings?: any

	constructor(json: CarverJSON, type: string) {
		this.type = type

		this.lava_level = json.lava_level
		this.aquifers_enabled = json.aquifers_enabled
		this.probability = json.probability
		this.y = json.y
		this.yScale = json.yScale
		if (json.hasOwnProperty('debug_settings'))
			this.debug_settings = json.debug_settings
	}
}
const ValidateCanyon = {
	...ValidateCarver,
}
export class Canyon extends Carver {//todo
	vertical_rotation: any
	shape: any
	constructor(json: any, type: string = Canyon.getType()) {
		super(json, type)
		this.vertical_rotation = json.vertical_rotation
		this.shape = json.shape
	}

	static getType = () => 'minecraft:canyon'
	static getStructure = () => ({
	})
	getStructure = () => ConfiguredCarver.getStructure()
}
export class UnderwaterCanyon extends Canyon {
	constructor(json: any) {
		super(json, UnderwaterCanyon.getType())
	}

	static getType = () => 'minecraft:underwater_canyon'
	static getStructure = () => ({
	})
	getStructure = () => ConfiguredCarver.getStructure()
}

export class Cave extends Carver {
	horizontal_radius_multiplier: number
	vertical_radius_multiplier: number
	floor_level: number

	constructor(json: any, type: string = Cave.getType()) {
		super(json, type)
		this.horizontal_radius_multiplier = json.horizontal_radius_multiplier
		this.vertical_radius_multiplier = json.vertical_radius_multiplier
		this.floor_level = json.floor_level
	}

	static getType = () => 'minecraft:cave'
	static getStructure = () => ({
	})
	getStructure = () => ConfiguredCarver.getStructure()
}
export class UnderwaterCave extends Cave {
	constructor(json: any) {
		super(json, UnderwaterCave.getType())
	}

	static getType = () => 'minecraft:underwater_cave'
	static getStructure = () => ({
	})
	getStructure = () => ConfiguredCarver.getStructure()
}
export class NetherCave extends Cave {
	constructor(json: any) {
		super(json, NetherCave.getType())
	}

	static getType = () => 'minecraft:nether_cave'
	static getStructure = () => ({
	})
	getStructure = () => ConfiguredCarver.getStructure()
}
