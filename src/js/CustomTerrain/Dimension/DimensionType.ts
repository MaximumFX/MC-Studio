import {DimensionEffects, Infiniburn} from "@/js/CustomTerrain/Helpers/Enum";

export default class DimensionType {
	name: string
	ultrawarm: boolean
	natural: boolean
	coordinate_scale: number
	has_skylight: boolean
	has_ceiling: boolean
	ambient_light: number
	piglin_safe: boolean
	bed_works: boolean
	respawn_anchor_works: boolean
	has_raids: boolean
	logical_height: number
	min_y: number
	height: number
	infiniburn: Infiniburn //todo
	effects: DimensionEffects //todo
	fixed_time?: number

	constructor(name = 'unnamed', json: DimensionType) {
		this.name = name

		this.ultrawarm = json.ultrawarm ?? false
		this.natural = json.natural ?? true
		this.coordinate_scale = json.coordinate_scale ?? 1.0
		this.has_skylight = json.has_skylight ?? true
		this.has_ceiling = json.has_ceiling ?? false
		this.ambient_light = json.ambient_light ?? 0.0
		this.piglin_safe = json.piglin_safe ?? false
		this.bed_works = json.bed_works ?? true
		this.respawn_anchor_works = json.respawn_anchor_works ?? false
		this.has_raids = json.has_raids ?? true
		this.logical_height = json.logical_height < json.height ? json.logical_height : json.height ?? 256
		this.min_y = json.min_y > -2048 ? (json.min_y < 2031 ? json.min_y : 2031) : -2048 ?? 0
		this.height = json.height > 0 ? (json.height < 4064 ? json.height : 4064) : 0 ?? 256
		this.infiniburn = json.infiniburn ?? Infiniburn.OVERWORLD
		this.effects = json.effects ?? DimensionEffects.OVERWORLD

		if (json.hasOwnProperty('fixed_time'))
			this.fixed_time = json.fixed_time
	}

	getPresets = () => ({
		overworld: new DimensionType('overworld', require('@/assets/minecraft/1.17.1-pre2/vanilla_worldgen/dimension_type/overworld.json')),
		overworld_caves: new DimensionType('overworld_caves', require('@/assets/minecraft/1.17.1-pre2/vanilla_worldgen/dimension_type/overworld_caves.json')),
		the_nether: new DimensionType('the_nether', require('@/assets/minecraft/1.17.1-pre2/vanilla_worldgen/dimension_type/the_nether.json')),
		the_end: new DimensionType('the_end', require('@/assets/minecraft/1.17.1-pre2/vanilla_worldgen/dimension_type/the_end.json'))
	})
}