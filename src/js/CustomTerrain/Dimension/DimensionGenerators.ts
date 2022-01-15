// @ts-ignore
import Biome, {ValidateBiome} from "@/js/CustomTerrain/Dimension/Biome";
import {BiomeSourceType, CTFileType} from "@/js/CustomTerrain/Helpers/Enum";
import Validation, {Choice} from "@/js/CustomTerrain/Validation";
import MinecraftData from "@/js/CustomTerrain/Helpers/MinecraftData";

export class DimensionGenerator {
	public type: string
	constructor(type: string) {
		this.type = type
	}

	// static getNew = (type: string): NoiseGenerator | FlatGenerator | DebugGenerator => {
	// 	if (type === 'minecraft:noise')
	// 		return new NoiseGenerator()
	// 	else if (type === 'minecraft:flat')
	// 		return new FlatGenerator()
	// 	else if (type === 'minecraft:debug')
	// 		return new DebugGenerator()
	// 	else throw new Error('[Dimension] Undefined Dimension generator type')
	// }
}

interface BiomeSource {
	seed: number
	type: BiomeSourceType
}
const ValidateBiomeSource = {
	seed: Validation.int(),
	type: Validation.choiceValue(),
}
interface BiomeSourceVanillaLayered extends BiomeSource {
	large_biomes: boolean
}
const ValidateBiomeSourceVanillaLayered = {
	...ValidateBiomeSource,
	large_biomes: Validation.boolean(),
}
interface BiomeSourceMultiNoise extends BiomeSource {//todo
	biomes: Biome[]
}
const ValidateBiomeSourceMultiNoise = {
	...ValidateBiomeSource,
	biomes: Validation.array(false, ValidateBiome, 'Biome'),
}
interface BiomeSourceFixed extends BiomeSource {//todo
	biome: any
}
const ValidateBiomeSourceFixed = {
	...ValidateBiomeSource,
	biome: Validation.string(),
}
interface BiomeSourceCheckerboard extends BiomeSource {
	biomes: Biome[]
	scale: number
}
const ValidateBiomeSourceCheckerboard = {
	...ValidateBiomeSource,
	biomes: Validation.array(false, Validation.dynamicSelect(false, CTFileType.Biome), 'Biome'),
	scale: Validation.float(false, 0, 62)
}

export class NoiseGenerator extends DimensionGenerator {
	seed: number
	settings: string //Noise Setting ID
	biome_source: BiomeSourceVanillaLayered | BiomeSourceMultiNoise | BiomeSourceFixed | BiomeSourceCheckerboard

	constructor(json: any = {}) {
		super(NoiseGenerator.getType())
		this.seed = json.seed ?? 0
		this.settings = json.settings ?? 'minecraft:overworld'
		const biome_source: any = {
			seed: json.biome_source.seed ?? 0,
			type: json.biome_source.type ?? 'minecraft:multi_noise',
		}

		if (json.biome_source.type === BiomeSourceType.VANILLA_LAYERED) {
			biome_source.large_biomes = json.biome_source.large_biomes ?? false
			biome_source.biomes = json.biome_source.biomes ?? []
		}

		else if (json.biome_source.type === BiomeSourceType.MULTI_NOISE) {
			biome_source.biomes = json.biome_source.biomes as Biome[] ?? []
		}

		else if (json.biome_source.type === BiomeSourceType.FIXED) {
			biome_source.biome = json.biome_source.biome ?? 'minecraft:plains'
		}

		else if (json.biome_source.type === BiomeSourceType.CHECKERBOARD) {
			biome_source.biomes = json.biome_source.biomes as Biome[] ?? []
			biome_source.scale = json.biome_source.scale ?? 1
		}

		this.biome_source = biome_source
	}

	static getType = () => 'minecraft:noise'
	static getStructure = () => ({
		type: Validation.choiceValue(),
		seed: Validation.int(),
		settings: Validation.dynamicSelect(false, CTFileType.NoiseSettings),
		biome_source: Validation.choice(false, [
			new Choice(BiomeSourceType.VANILLA_LAYERED, 'Vanilla Layered', ValidateBiomeSourceVanillaLayered),
			new Choice(BiomeSourceType.MULTI_NOISE, 'Multi Noise', ValidateBiomeSourceMultiNoise),
			new Choice(BiomeSourceType.FIXED, 'Fixed', ValidateBiomeSourceFixed),
			new Choice(BiomeSourceType.THE_END, 'The End', null),
			new Choice(BiomeSourceType.CHECKERBOARD, 'Checkerboard', ValidateBiomeSourceCheckerboard),
		], 'type')
	})
	getStructure = () => NoiseGenerator.getStructure()
}

export interface FlatGeneratorSettings {//todo
	layers: {
		height: number
		block: string
	}[]
	biome?: string
	structures: {
		stronghold: {
			distance: number
			count: number
			spread: number
		},
		structures: {
			[key: string]: {
				spacing: number
				separation: number
				salt: number
			}
		},
	}
	lakes?: boolean
	features?: boolean
}

const ValidateFlatBiome = {
	height: Validation.int(),
	block: Validation.string(),//todo block dynamic select
}
const ValidateFlatStructure = {
	spacing: Validation.int(),
	separation: Validation.int(),
	salt: Validation.int(),
}

export class FlatGenerator extends DimensionGenerator {
	settings: FlatGeneratorSettings

	constructor(settings: FlatGeneratorSettings = {
		layers: [
			{ height: 1, block: 'minecraft:bedrock'},
			{ height: 3, block: 'minecraft:stone'},
			{ height: 1, block: 'minecraft:grass_block'},
		],
		structures: {
			stronghold: {
				distance: 0,
				spread: 0,
				count: 1
			},
			structures: {}
		}
	}) {
		super(FlatGenerator.getType())
		this.settings = {
			layers: settings.layers,
			biome: settings.biome,
			structures: {
				stronghold: {
					distance: settings.structures.stronghold.distance,
					count: settings.structures.stronghold.count,
					spread: settings.structures.stronghold.spread,
				},
				structures: settings.structures.structures,
			},
		}
		if (settings.hasOwnProperty('lakes'))
			this.settings.lakes = settings.lakes
		if (settings.hasOwnProperty('features'))
			this.settings.features = settings.features
	}

	static getType = () => 'minecraft:flat'
	static getStructure = () => ({
		type: Validation.choiceValue(),
		settings: {
			layers: Validation.array(false, ValidateFlatBiome, 'Layer'),
			biome: Validation.dynamicSelect(false, CTFileType.Biome),
			structures: {
				stronghold: {
					distance: Validation.int(),
					count: Validation.int(),
					spread: Validation.int(),
				},
				structures: Validation.object(false, ValidateFlatStructure, Validation.select(false, MinecraftData.Structures)),//todo
			},
			lakes: Validation.boolean(true),
			features: Validation.boolean(true),
		}
	})
	getStructure = () => FlatGenerator.getStructure()
}

export class DebugGenerator extends DimensionGenerator {
	constructor() {
		super(DebugGenerator.getType())
	}

	static getType = () => 'minecraft:debug'
	static getStructure = () => ({
		type: Validation.choiceValue()
	})
	getStructure = () => DebugGenerator.getStructure()
}

export const DimensionGenerators = [
	NoiseGenerator, FlatGenerator, DebugGenerator
]
