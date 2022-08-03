import type MCBlock from '@/minecraft/Block';

export default class Structure {
	DataVersion: number
	blocks: {
		pos: [number, number, number]
		state: number
	}[]
	entities: []
	palette?: MCBlock[]
	palettes?: MCBlock[][]
	size: [number, number, number]

	constructor(data: Structure) {
		this.DataVersion = data.DataVersion
		this.blocks = data.blocks
		this.entities = data.entities
		this.palette = data.palette
		this.palettes = data.palettes
		this.size = data.size
	}
}
