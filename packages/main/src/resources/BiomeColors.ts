import fs from 'fs';
import Color from '@/minecraft/Color';
import path from 'path';

export interface BiomeColor {
	fog_color: number
	foliage_color?: number
	grass_color?: number
	sky_color: number
	water_color: number
	water_fog_color: number

	downfall?: number
	temperature?: number
	calculated?: {
		foliage_color: number
		grass_color: number
	}
}
export interface BiomeColors {
	[key: string]: BiomeColor
}

export enum BiomeColorType {
	FOG_COLOR = 'fog_color',
	FOLIAGE_COLOR = 'foliage_color',
	GRASS_COLOR = 'grass_color',
	SKY_COLOR = 'sky_color',
	WATER_COLOR = 'water_color',
	WATER_FOG_COLOR = 'water_fog_color'
}

export default class Biomes {
	readonly #data: BiomeColors
	readonly #biomes: string[]

	constructor() {
		this.#data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/resources/biomeColors.json'), 'utf8'))
		this.#biomes = Object.keys(this.#data).map(b => `minecraft:${b}`)
	}

	getBiomeId = (name: string) => this.#biomes.findIndex(s => s === name)
	getBiomeById = (id: number) => this.#biomes[id]
	getBiomeColors = (name: string): BiomeColor | null => {
		name = (name ?? '').replace('minecraft:', '')
		if (!this.#data[name]) return null
		return this.#data[name];
	}
	getBiomeColor = (name: string, type: BiomeColorType) => {
		const biome = this.getBiomeColors(name)

		if (!biome) return new Color()

		const color = biome[type]
		if (color) return Color.fromInt(color)

		if (biome.calculated && (type === BiomeColorType.FOLIAGE_COLOR || type === BiomeColorType.GRASS_COLOR)) {
			const color = biome.calculated[type]
			if (color) return Color.fromInt(color)
		}
		return new Color()
	}
}
