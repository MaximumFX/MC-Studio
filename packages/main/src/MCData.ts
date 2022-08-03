import { promises as fs } from 'fs';
import path from 'path';
import { getAverageColor } from 'fast-average-color-node';
import { Paths } from '@/Path';
import Vector3 from '@/math/Vector3';
import { getPixels } from '@/Helper';
import PNGReader from '@/models/PNGReader';
import Color from '@/minecraft/Color';
import Math2 from '@/math/Math2';
import type { BiomeColor, BiomeColors } from '@/resources/BiomeColors';
import Biomes, { BiomeColorType } from '@/resources/BiomeColors';

export interface BlockColors {
	[key: string]: {
		rgba: number[],
		tint: boolean
	}
}
export interface BlockIds {
	[key: string]: number
}

const biomes = new Biomes()

export default class MCData {
	static biomeColorTypes = {
		grass: [
			'grass_block',
			'grass',
			'fern',
			'tall_fern',
			'sugar_cane',
		],
		foliage: [
			'oak_leaves',
			'birch_leaves',
			'spruce_leaves',
			'jungle_leaves',
			'acacia_leaves',
			'dark_oak_leaves',
			'vines',
		],
		water: [
			'water',
		],
	}


	static air = [
		'minecraft:air',
		'minecraft:cave_air',
		'minecraft:void_air',
		// 'minecraft:bubble_column',//todo water
	]

	static wood = [
		'oak',
		'birch',
		'spruce',
		'jungle',
		'dark_oak',
		'acacia',
		'mangrove',
		'crimson',
		'warped',
	]

	static getGenericName = (name: string) => {
		if (name.endsWith('_slab')) {
			if (MCData.wood.some(a => name.includes(a)))
				name = name.replace('_slab', '_wood');
			else if (name.includes('brick'))
				name = name.replace('_slab', 's');
			else
				name = name.replace('_slab', '');
		}
		if (name.endsWith('_stairs')) {
			if (MCData.wood.some(a => name.includes(a)))
				name = name.replace('_stairs', '_wood');
			else if (name.includes('brick'))
				name = name.replace('_stairs', 's');
			else
				name = name.replace('_stairs', '');
		}
		if (name.endsWith('_fence'))
			name = name.replace('_fence', '_planks')
		if (name.endsWith('_fence_gate'))
			name = name.replace('_fence_gate', '_planks')
		if (name.startsWith('wall_'))
			name = name.replace('wall_', '')
		if (name.endsWith('_wall'))
			name = name.replace('_wall', '')
		if (name.startsWith('potted_'))
			name = name.replace('potted_', '')
		if (name === 'bubble_column') name = 'water'
		if (name.endsWith('_wood'))
			name = name.replace('wood', 'log_top')

		if (['stones', 'granites', 'cobblestones', 'mossy_cobblestones'].includes(name)) name = name.slice(0, -1)

		if (['bamboo', 'beetroots', 'carrots', 'cocoa', 'nether_wart', 'potatoes', 'sweet_berry_bush', 'wheat'].includes(name)) name += '_stage0'

		if (['cactus', 'hopper'].includes(name)) name += '_top'

		if (name === 'smooth_sandstone') name = 'sandstone_top'

		return name
	}

	static getBiomeColored = (color: number[], biome: string, type: BiomeColorType) => {
		const colors = biomes.getBiomeColor(biome, type)

		return Vector3.fromArray(color).multiply(colors.asVector()).divide(255).asArray()
	}
	// Not namespaced name
	static getBiomeColoredByName = (color: number[], name: string, biome: string) => {
		let type = BiomeColorType.GRASS_COLOR
		if (MCData.biomeColorTypes.grass.includes(name)) type = BiomeColorType.GRASS_COLOR
		else if (MCData.biomeColorTypes.foliage.includes(name)) type = BiomeColorType.FOLIAGE_COLOR
		else if (MCData.biomeColorTypes.water.includes(name)) type = BiomeColorType.WATER_COLOR

		let colors = biomes.getBiomeColor(biome, type)

		if (name === 'birch_leaves') colors = new Color(128, 167, 85)
		else if (name === 'spruce_leaves') colors = new Color(97, 153, 97)
		else if (name === 'lily_pad') colors = new Color(32, 128, 48)

		return Vector3.fromArray(color).multiply(colors.asVector()).divide(255).asArray()
	}

	static buildBlockColors = async () => {
		const basePath = path.join(Paths.MC_DIR(), '1.19', 'assets', 'minecraft')
		const bsPath = path.join(basePath, 'blockstates')
		const blocks = await fs.readdir(bsPath)

		const colors: BlockColors = {}
		const blockIds: BlockIds = {}
		let curId = 1

		const getModel = (obj: {
			model?: object | []
			apply?: {
				model?: object
			}
		}) => {
			if (obj.model) return obj.model

			if (obj.apply) {
				if (Array.isArray(obj.apply))
					return obj.apply[0].model
				else return obj.apply.model
			}
		}

		for (const block of blocks) {
			const json = JSON.parse(await fs.readFile(path.join(bsPath, block), 'utf8'))

			let modelPath: string | undefined
			if (json.variants) {
				const variant = Object.values(json.variants)[0]
				if (Array.isArray(variant))
					modelPath = getModel(variant[0])
				else modelPath = getModel(variant)
			}
			else if (json.multipart) {
				modelPath = getModel(json.multipart[0])
			}

			if (modelPath) {
				modelPath = modelPath.replace('minecraft:', '')
				const model: any = JSON.parse(await fs.readFile(path.resolve(basePath, 'models', modelPath + '.json'), 'utf8'));

				let rgba = [0, 0, 0, 0]
				let tint = false
				if (model.textures) {
					let texture: string
					if (model.textures.top)
						texture = model.textures.top
					else texture = Object.values(model.textures)[0] as string

					texture = texture.replace('minecraft:', '')

					rgba = (await getAverageColor(path.resolve(basePath, 'textures', texture + '.png'))).value

					tint = ['grass_', 'fern', 'vine'].some(a => texture.includes(a)) ||
						texture.includes('leaves') && !texture.includes('azalea') && !texture.includes('bamboo') ||
						texture === 'block/grass'
				}

				const name = path.basename(block, path.extname(block))
				colors[name] = { rgba, tint }
				blockIds[name] = curId

				curId++
			}
		}
		await fs.writeFile(path.join(Paths.DATA(), 'colors.json'), JSON.stringify(colors), 'utf8')
		await fs.writeFile(path.join(Paths.DATA(), 'blockIds.json'), JSON.stringify(blockIds), 'utf8')

		return colors
	}
	static getBlockColors = async (): Promise<BlockColors> =>
		JSON.parse(await fs.readFile(path.join(Paths.DATA(), 'colors.json'), 'utf8'))
	static getBlockIds = async (): Promise<BlockIds> =>
		JSON.parse(await fs.readFile(path.join(Paths.DATA(), 'blockIds.json'), 'utf8'))

	static buildBiomeColors = async () => {
		const basePath = path.resolve(__dirname, '../src/resources/vanilla_worldgen-1.19-pre1/worldgen/biome')
		const biomes = await fs.readdir(basePath)

		const foliage = new PNGReader((await getPixels(path.join(Paths.MC_DIR(), '1.19', 'assets', 'minecraft', 'textures', 'colormap', 'foliage.png'))).data)
		const grass = new PNGReader((await getPixels(path.join(Paths.MC_DIR(), '1.19', 'assets', 'minecraft', 'textures', 'colormap', 'grass.png'))).data)

		const biomeColors: BiomeColors = {}
		for (const biome of biomes) {
			const json: any = JSON.parse(await fs.readFile(path.resolve(basePath, biome), 'utf8'));

			if (json.effects) {
				const color: BiomeColor = {
					fog_color: json.effects.fog_color,
					grass_color: json.effects.grass_color,
					sky_color: json.effects.sky_color,
					water_color: json.effects.water_color,
					water_fog_color: json.effects.water_fog_color,
				}

				if (json.effects.foliage_color)
					color.foliage_color = json.effects.foliage_color
				else {
					color.temperature = json.temperature
					color.downfall = json.downfall
				}

				if (json.effects.grass_color)
					color.grass_color = json.effects.grass_color
				else {
					color.temperature = json.temperature
					color.downfall = json.downfall
				}

				if (!json.effects.foliage_color || !json.effects.grass_color) {
					const temp = Math2.clamp(json.temperature, 0, 1)
					const down = Math2.clamp(json.downfall, 0, 1) * temp
					color.calculated = {
						foliage_color: Color.fromArray(foliage.getPixel(1 - temp, 1 - down, true)).asInt(),
						grass_color: Color.fromArray(grass.getPixel(1 - temp, 1 - down, true)).asInt(),
					}
				}

				biomeColors[path.basename(biome, path.extname(biome))] = color
			}
		}

		await fs.writeFile(path.resolve(__dirname, '../src/resources/biomeColors.json'), JSON.stringify(biomeColors), 'utf8')
	}
}
