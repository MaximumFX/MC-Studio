import {
	BiomeCategory,
	BiomeGrassColorModifier,
	BiomePrecipitation,
	BiomeTemperatureModifier,
	CTFileType
} from "@/js/CustomTerrain/Helpers/Enum";
import Color from "@/js/CustomTerrain/Helpers/Color";
import Spawner, {SpawnerJSON} from "@/js/CustomTerrain/WorldGen/Spawner";
import {v4 as uuidv4} from "uuid";
import CTFile from "@/js/CustomTerrain/CTFile";
import fs from "fs";
import Validation from "@/js/CustomTerrain/Validation";
import MCSprite from "@/js/MCSprite";

interface BiomeFeatures {//todo
	RAW_GENERATION: string[]
	LAKES: string[]
	LOCAL_MODIFICATIONS: string[]
	UNDERGROUND_STRUCTURES: string[]
	SURFACE_STRUCTURES: string[]
	STRONGHOLDS: string[]
	UNDERGROUND_ORES:string[]
	UNDERGROUND_DECORATION: string[]
	SPRINGS: string[]
	VEGETAL_DECORATION: string[]
	TOP_LAYER_MODIFICATION: string[]
}
export default class Biome {
	name: string

	depth: number = 0
	scale: number = 0
	precipitation: BiomePrecipitation = BiomePrecipitation.NONE
	category: BiomeCategory = BiomeCategory.NONE
	temperature: number = 0
	temperature_modifier: BiomeTemperatureModifier = BiomeTemperatureModifier.NONE
	downfall: number = 0
	player_spawn_friendly: boolean = false
	creature_spawn_probability: number = 0

	surface_builder: string = ''
	carvers: any = {}
	starts: any[] = []
	spawn_costs: any = {}
	features: BiomeFeatures
	spawners: any = {}
	effects: any = {}
	constructor(name = 'unnamed', json: any = {}) {
		this.name = name

		this.depth = json.depth ?? 0
		this.scale = json.scale ?? 0
		this.precipitation = json.precipitation ?? BiomePrecipitation.NONE
		this.category = json.category ?? BiomeCategory.NONE
		this.temperature = json.temperature ?? 0
		this.temperature_modifier = json.temperature_modifier ?? BiomeTemperatureModifier.NONE
		this.downfall = json.downfall ?? 0
		this.player_spawn_friendly = json.player_spawn_friendly ?? false
		this.creature_spawn_probability = json.creature_spawn_probability ?? 0

		this.surface_builder = json.surface_builder ?? ''
		this.carvers = json.carvers ?? {}
		this.starts = json.starts ?? []
		this.spawn_costs = json.spawn_costs ?? {}

		this.features = {
			RAW_GENERATION: json.features[0],
			LAKES: json.features[1],
			LOCAL_MODIFICATIONS: json.features[2],
			UNDERGROUND_STRUCTURES: json.features[3],
			SURFACE_STRUCTURES: json.features[4],
			STRONGHOLDS: json.features[5],
			UNDERGROUND_ORES: json.features[6],
			UNDERGROUND_DECORATION: json.features[7],
			SPRINGS: json.features[8],
			VEGETAL_DECORATION: json.features[9],
			TOP_LAYER_MODIFICATION: json.features[10],
		}

		// SPAWNERS
		this.spawners = {}
		if (json.spawners.hasOwnProperty('monster')) this.spawners.monster = json.spawners.monster.map((s: SpawnerJSON) => new Spawner(s))
		if (json.spawners.hasOwnProperty('creature')) this.spawners.creature = json.spawners.creature.map((s: SpawnerJSON) => new Spawner(s))
		if (json.spawners.hasOwnProperty('ambient')) this.spawners.ambient = json.spawners.ambient.map((s: SpawnerJSON) => new Spawner(s))
		if (json.spawners.hasOwnProperty('water_creature')) this.spawners.water_creature = json.spawners.water_creature.map((s: SpawnerJSON) => new Spawner(s))
		if (json.spawners.hasOwnProperty('water_ambient')) this.spawners.water_ambient = json.spawners.water_ambient.map((s: SpawnerJSON) => new Spawner(s))
		if (json.spawners.hasOwnProperty('misc')) this.spawners.misc = json.spawners.misc.map((s: SpawnerJSON) => new Spawner(s))

		// EFFECTS
		this.effects = {
			fog_color: Color.fromDecimal(json.effects.fog_color) ?? new Color(),
			foliage_color: json.effects.foliage_color ? Color.fromDecimal(json.effects.foliage_color) : new Color(),
			grass_color: json.effects.grass_color ? Color.fromDecimal(json.effects.grass_color) : new Color(),
			sky_color: Color.fromDecimal(json.effects.sky_color) ?? new Color(),
			water_color: Color.fromDecimal(json.effects.water_color) ?? new Color(),
			water_fog_color: Color.fromDecimal(json.effects.water_fog_color) ?? new Color(),
			grass_color_modifier: json.effects.grass_color_modifier ?? BiomeGrassColorModifier.NONE,
		}
		if (json.effects.hasOwnProperty('particle')) {
			this.effects.particle = {
				probability: json.effects.particle.probability,
				options: {},
			}
			if (json.effects.particle.options.type === 'block' || json.effects.particle.options.type === 'falling_dust') {
				this.effects.particle.options = {
					type: json.effects.particle.options.type,
					Name: json.effects.particle.options.Name,
					Properties: json.effects.particle.options.Properties,
				}
			}
			else if (json.effects.particle.options.type === 'dust') {
				this.effects.particle.options = {
					type: json.effects.particle.options.type,
					r: json.effects.particle.options.r,
					g: json.effects.particle.options.g,
					b: json.effects.particle.options.b,
					scale: json.effects.particle.options.scale,
				}
			}
			else if (json.effects.particle.options.type === 'item') {
				this.effects.particle.options = {
					type: json.effects.particle.options.type,
					id: json.effects.particle.options.id,
					Count: json.effects.particle.options.Count,
					tag: json.effects.particle.options.tag,
				}
			}
		}
		if (json.effects.hasOwnProperty('ambient_sound')) {
			this.effects.ambient_sound = json.effects.ambient_sound
		}
		if (json.effects.hasOwnProperty('mood_sound')) {
			this.effects.mood_sound = json.effects.mood_sound
		}
		if (json.effects.hasOwnProperty('additions_sound')) {
			this.effects.additions_sound = json.effects.additions_sound
		}
		if (json.effects.hasOwnProperty('music')) {
			this.effects.music = json.effects.music
		}
	}

	static getStructure = () => ({
		depth: Validation.float(),
		scale: Validation.float(),
		precipitation: Validation.enum(false, BiomePrecipitation),
		category: Validation.enum(false, BiomeCategory),
		temperature: Validation.float(),
		// temperature_modifier: Validation.enum(false, BiomeTemperatureModifier),
		downfall: Validation.float(),
		player_spawn_friendly: Validation.boolean(),
		effects: {
			fog_color: Validation.color(),
			foliage_color: Validation.color(true),
			grass_color: Validation.color(true),
			sky_color: Validation.color(),
			water_color: Validation.color(),
			water_fog_color: Validation.color(),
			grass_color_modifier: Validation.enum(false, BiomeGrassColorModifier),
		},
		features: {
			RAW_GENERATION: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Raw generation'),
			LAKES: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Lake'),
			LOCAL_MODIFICATIONS: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Local modification'),
			UNDERGROUND_STRUCTURES: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Underground structure'),
			SURFACE_STRUCTURES: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Surface structure'),
			STRONGHOLDS: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Stronghold'),
			UNDERGROUND_ORES: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Underground ore'),
			UNDERGROUND_DECORATION: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Underground decoration'),
			SPRINGS: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Springs'),
			VEGETAL_DECORATION: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Vegetal decoration'),
			TOP_LAYER_MODIFICATION: Validation.array(false, Validation.dynamicSelect(false, CTFileType.ConfiguredFeature), 'Top layer modification'),
		},
	})
	getStructure = () => Biome.getStructure()

	static save = (packId: string, namespaceId: string, name: string, json: Biome, uuid: string = uuidv4(), color?: number[], sprite?: MCSprite) => {
		return CTFile.save(packId, namespaceId, name, json, CTFileType.Biome, uuid, color, sprite)
	}
	static load = async (packId: string, namespaceId: string, uuid: string) => {
		const paths = await CTFile.getPaths(packId, namespaceId, uuid, CTFileType.Biome)
		const json = JSON.parse(await fs.promises.readFile(paths.filePath, 'utf8'))
		return new Biome(json.name, json.json)
	}

	toJSON = () => ({
		...this,
		features: [
			this.features.RAW_GENERATION,
			this.features.LAKES,
			this.features.LOCAL_MODIFICATIONS,
			this.features.UNDERGROUND_STRUCTURES,
			this.features.SURFACE_STRUCTURES,
			this.features.STRONGHOLDS,
			this.features.UNDERGROUND_ORES,
			this.features.UNDERGROUND_DECORATION,
			this.features.SPRINGS,
			this.features.VEGETAL_DECORATION,
			this.features.TOP_LAYER_MODIFICATION,
		]
	})
}
