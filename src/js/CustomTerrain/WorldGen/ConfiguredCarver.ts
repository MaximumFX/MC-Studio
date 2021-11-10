import IntProvider from "@/js/CustomTerrain/Helpers/IntProvider";

interface ConfiguredCarverConfigJSON {
	type: string
	config: object
}
export default class ConfiguredCarver {
	path: string
	name: string
	type: string
	config?: Carver

	constructor(path = '', name = 'unnamed', json: ConfiguredCarverConfigJSON) {
		this.path = path
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
}

interface CarverJSON {//todo
	lava_level: number
	aquifers_enabled: boolean
	probability: number
	y: IntProvider | number
	yScale: number
	debug_settings?: any
}

export class Carver {//todo
	lava_level: number
	aquifers_enabled: boolean
	probability: number
	y: IntProvider | number
	yScale: number
	debug_settings?: any

	constructor(json: CarverJSON) {
		this.lava_level = json.lava_level
		this.aquifers_enabled = json.aquifers_enabled
		this.probability = json.probability
		this.y = json.y
		this.yScale = json.yScale
		if (json.hasOwnProperty('debug_settings'))
			this.debug_settings = json.debug_settings
	}
}

export class Canyon extends Carver {//todo
	vertical_rotation: any
	shape: any
	constructor(json: any) {
		super(json)
		this.vertical_rotation = json.vertical_rotation
		this.shape = json.shape
	}
}
export class UnderwaterCanyon extends Canyon {
	constructor(json: any) {
		super(json)
	}
}

export class Cave extends Carver {
	horizontal_radius_multiplier: number
	vertical_radius_multiplier: number
	floor_level: number

	constructor(json: any) {
		super(json)
		this.horizontal_radius_multiplier = json.horizontal_radius_multiplier
		this.vertical_radius_multiplier = json.vertical_radius_multiplier
		this.floor_level = json.floor_level
	}
}
export class UnderwaterCave extends Cave {
	constructor(json: any) {
		super(json)
	}
}
export class NetherCave extends Cave {
	constructor(json: any) {
		super(json)
	}
}