// @ts-ignore
import Biome, {ValidateBiome} from "@/js/CustomTerrain/Dimension/Biome";
import {BiomeSourceType} from "@/js/CustomTerrain/Helpers/Enum";
import Validation, {Choice} from "@/js/CustomTerrain/Validation";

export class DimensionGenerator {
	public type: string
	constructor(type: string) {
		this.type = type
	}

	getNew = (type: string): NoiseGenerator | FlatGenerator | DebugGenerator => {
		if (type === 'minecraft:noise')
			return new NoiseGenerator()
		else if (type === 'minecraft:flat')
			return new FlatGenerator()
		else if (type === 'minecraft:debug')
			return new DebugGenerator()
		else throw new Error('[Dimension] Undefined Dimension generator type')
	}
}

interface BiomeSource {//todo
	seed: number
	type: BiomeSourceType
}
const ValidateBiomeSource = {
	seed: Validation.int(),
	type: Validation.choiceValue(),
}
interface BiomeSourceVanillaLayered extends BiomeSource {//todo
	large_biomes: boolean
	legacy_biome_init_layer?: boolean
}
const ValidateBiomeSourceVanillaLayered = {
	...ValidateBiomeSource,
	large_biomes: Validation.boolean(),
	legacy_biome_init_layer: Validation.string(true),
}
interface BiomeSourceMultiNoise extends BiomeSource {//todo
	biomes: Biome[]
	altitude_noise: {
		firstOctave: number,
		amplitudes: number[]
	}
	weirdness_noise: {
		firstOctave: number,
		amplitudes: number[]
	}
	temperature_noise: {
		firstOctave: number,
		amplitudes: number[]
	}
	humidity_noise: {
		firstOctave: number,
		amplitudes: number[]
	}
	preset?: any
}
const ValidateBiomeSourceMultiNoise = {
	...ValidateBiomeSource,
	biomes: Validation.array(false, ValidateBiome, 'Biome'),
	altitude_noise: {
		firstOctave: Validation.float(),
		amplitudes: Validation.array(false, Validation.float(), 'Amplitude')
	},
	weirdness_noise: {
		firstOctave: Validation.float(),
		amplitudes: Validation.array(false, Validation.float(), 'Amplitude')
	},
	temperature_noise: {
		firstOctave: Validation.float(),
		amplitudes: Validation.array(false, Validation.float(), 'Amplitude')
	},
	humidity_noise: {
		firstOctave: Validation.float(),
		amplitudes: Validation.array(false, Validation.float(), 'Amplitude')
	},
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
	biomes: Validation.array(false, ValidateBiome, 'Biome'),
	scale: Validation.float(),//todo
}

export class NoiseGenerator extends DimensionGenerator {//todo
	seed: number
	settings: object
	biome_source: BiomeSourceVanillaLayered | BiomeSourceMultiNoise | BiomeSourceFixed | BiomeSourceCheckerboard

	constructor(json: any = {
		seed: 0,
		biome_source: {
			seed: 0,
			type: Object.values(BiomeSourceType)[0]
		}
	}) {
		super(NoiseGenerator.getType())
		this.seed = json.seed ?? 0
		this.settings = json.settings
		const biome_source: any = {
			seed: json.biome_source.seed,
			type: json.biome_source.type,
		}

		if (json.biome_source.type === BiomeSourceType.VANILLA_LAYERED) {
			biome_source.large_biomes = json.biome_source.large_biomes
			if (json.biome_source.hasOwnProperty('legacy_biome_init_layer'))
				biome_source.legacy_biome_init_layer = json.biome_source.legacy_biome_init_layer
		}

		else if (json.biome_source.type === BiomeSourceType.MULTI_NOISE) {
			if (json.biome_source.hasOwnProperty('biomes')) {
				biome_source.biomes = json.biome_source.biomes as Biome[]
				biome_source.altitude_noise = {
					fistOctave: json.biome_source.altitude_noise.fistOctave ?? -7,
					amplitudes: json.biome_source.altitude_noise.amplitudes ?? [1.0, 1.0],
				}
				biome_source.weirdness_noise = {
					fistOctave: json.biome_source.weirdness_noise.fistOctave ?? -7,
					amplitudes: json.biome_source.weirdness_noise.amplitudes ?? [1.0, 1.0],
				}
				biome_source.temperature_noise = {
					fistOctave: json.biome_source.temperature_noise.fistOctave ?? -7,
					amplitudes: json.biome_source.temperature_noise.amplitudes ?? [1.0, 1.0],
				}
				biome_source.humidity_noise = {
					fistOctave: json.biome_source.humidity_noise.fistOctave ?? -7,
					amplitudes: json.biome_source.humidity_noise.amplitudes ?? [1.0, 1.0],
				}
			}
			else if (json.biome_source.hasOwnProperty('preset'))
				biome_source.preset = json.biome_source.preset
		}

		else if (json.biome_source.type === BiomeSourceType.FIXED) {
			biome_source.biome = json.biome_source.biome
		}

		else if (json.biome_source.type === BiomeSourceType.CHECKERBOARD) {
			biome_source.biomes = json.biome_source.biomes as Biome[]
			biome_source.scale = json.biome_source.scale
		}

		this.biome_source = biome_source
	}

	static getType = () => 'minecraft:noise'
	static getStructure = () => ({
		seed: Validation.int(),
		settings: Validation.select(false, [
			'minecraft:overworld', 'minecraft:nether', 'minecraft:end'
		]),
		biome_source: Validation.choice(false, [
			new Choice(BiomeSourceType.VANILLA_LAYERED, 'Vanilla Layered', ValidateBiomeSourceVanillaLayered),
			new Choice(BiomeSourceType.MULTI_NOISE, 'Multi Noise', ValidateBiomeSourceMultiNoise),
			new Choice(BiomeSourceType.FIXED, 'Fixed', ValidateBiomeSourceFixed),
			new Choice(BiomeSourceType.CHECKERBOARD, 'Checkerboard', ValidateBiomeSourceCheckerboard),
		], 'type')
	})
	getStructure = () => NoiseGenerator.getStructure()
}

interface FlatGeneratorSettings {//todo
	layers: []
	biome?: string
	structures: {
		stronghold: {
			distance: number,
			count: number,
			spread: number,
		},
		structures: any,
	}
	lakes?: boolean
	features?: boolean
}

export class FlatGenerator extends DimensionGenerator {
	settings: FlatGeneratorSettings

	constructor(settings: FlatGeneratorSettings = {
		layers: [],
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
		settings: {
			layers: Validation.array(false, undefined, 'Layer'),//todo
			biome: Validation.string(true),
			structures: {
				stronghold: {
					distance: Validation.float(),
					count: Validation.float(),
					spread: Validation.float(),
				},
				structures: Validation.object(false, undefined),//todo
			},
			lakes: Validation.boolean(),
			features: Validation.boolean(),
		}
	})
	getStructure = () => FlatGenerator.getStructure()
}

export class DebugGenerator extends DimensionGenerator {
	constructor() {
		super(DebugGenerator.getType())
	}

	static getType = () => 'minecraft:debug'
	static getStructure = () => null
	getStructure = () => DebugGenerator.getStructure()
}

export const DimensionGenerators = [
	NoiseGenerator, FlatGenerator, DebugGenerator
]