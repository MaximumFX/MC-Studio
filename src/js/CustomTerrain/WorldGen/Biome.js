import {
	BiomeCategory,
	BiomeGrassColorModifier,
	BiomePrecipitation,
	BiomeTemperatureModifier
} from "@/js/CustomTerrain/Helpers/Enum";
import Color from "@/js/CustomTerrain/Helpers/Color";
import Spawner from "@/js/CustomTerrain/WorldGen/Spawner";

export default class Biome {
	constructor(path = '', name = 'unnamed', json = {}) {
		this.path = path
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
			VEGETAL_DECORATION: json.features[8],
			TOP_LAYER_MODIFICATION: json.features[9],
		}

		// SPAWNERS
		this.spawners = {}
		if (json.spawners.hasOwnProperty('monster')) this.spawners.monster = json.spawners.monster.map(s => new Spawner(s))
		if (json.spawners.hasOwnProperty('creature')) this.spawners.creature = json.spawners.creature.map(s => new Spawner(s))
		if (json.spawners.hasOwnProperty('ambient')) this.spawners.ambient = json.spawners.ambient.map(s => new Spawner(s))
		if (json.spawners.hasOwnProperty('water_creature')) this.spawners.water_creature = json.spawners.water_creature.map(s => new Spawner(s))
		if (json.spawners.hasOwnProperty('water_ambient')) this.spawners.water_ambient = json.spawners.water_ambient.map(s => new Spawner(s))
		if (json.spawners.hasOwnProperty('misc')) this.spawners.misc = json.spawners.misc.map(s => new Spawner(s))

		// EFFECTS
		this.effects = {
			fog_color: Color.fromDecimal(json.effects.fog_color) ?? new Color(),
			foliage_color: json.effects.foliage_color ? Color.fromDecimal(json.effects.foliage_color) : undefined,
			grass_color: json.effects.grass_color ? Color.fromDecimal(json.effects.grass_color) : undefined,
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
}