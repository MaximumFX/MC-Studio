import {CTFileType, DimensionEffects, Infiniburn} from "@/js/CustomTerrain/Helpers/Enum";
import {v4 as uuidv4} from "uuid";
import CTFile from "@/js/CustomTerrain/CTFile";
import fs from "fs";
import Validation from "@/js/CustomTerrain/Validation";

/** Version 1.18-pre7 */
export default class DimensionType {
	name: string

	logical_height: number
	infiniburn: Infiniburn
	effects: DimensionEffects
	ambient_light: number
	respawn_anchor_works: boolean
	has_raids: boolean
	min_y: number
	height: number
	natural: boolean
	coordinate_scale: number
	piglin_safe: boolean
	bed_works: boolean
	has_skylight: boolean
	has_ceiling: boolean
	ultrawarm: boolean
	fixed_time?: number

	constructor(name = 'unnamed', json: DimensionType) {
		this.name = name

		this.logical_height = json.logical_height ?? 384
		this.infiniburn = json.infiniburn ?? Infiniburn.OVERWORLD
		this.effects = json.effects ?? DimensionEffects.OVERWORLD
		this.ambient_light = json.ambient_light ?? 0.0
		this.respawn_anchor_works = json.respawn_anchor_works ?? false
		this.has_raids = json.has_raids ?? true
		this.min_y = json.min_y ?? -64//todo check ranges min_y
		this.height = json.height ?? 384//todo check ranges height
		this.natural = json.natural ?? true
		this.coordinate_scale = json.coordinate_scale ?? 1.0
		this.piglin_safe = json.piglin_safe ?? false
		this.bed_works = json.bed_works ?? true
		this.has_skylight = json.has_skylight ?? true
		this.has_ceiling = json.has_ceiling ?? false
		this.ultrawarm = json.ultrawarm ?? false

		if (json.hasOwnProperty('fixed_time'))
			this.fixed_time = json.fixed_time
	}

	static getPresets = () => ({
		overworld: new DimensionType('overworld', require('@/assets/minecraft/1.18-pre6/vanilla_worldgen/dimension_type/overworld.json')),
		overworld_caves: new DimensionType('overworld_caves', require('@/assets/minecraft/1.18-pre6/vanilla_worldgen/dimension_type/overworld_caves.json')),
		the_nether: new DimensionType('the_nether', require('@/assets/minecraft/1.18-pre6/vanilla_worldgen/dimension_type/the_nether.json')),
		the_end: new DimensionType('the_end', require('@/assets/minecraft/1.18-pre6/vanilla_worldgen/dimension_type/the_end.json'))
	})

	static getStructure = () => ({
		logical_height: Validation.int(false, undefined, 'height', 16),
		infiniburn: Validation.enum(false, Infiniburn),
		effects: Validation.enum(false, DimensionEffects),
		ambient_light: Validation.float(),
		respawn_anchor_works: Validation.boolean(),
		has_raids: Validation.boolean(),
		min_y: Validation.int(false, -2048, 2031, 16),
		height: Validation.int(false, 0, 4064, 16),
		natural: Validation.boolean(),
		coordinate_scale: Validation.float(),
		piglin_safe: Validation.boolean(),
		bed_works: Validation.boolean(),
		has_skylight: Validation.boolean(),
		has_ceiling: Validation.boolean(),
		ultrawarm: Validation.boolean(),
		fixed_time: Validation.int(true)
	})
	getStructure = () => DimensionType.getStructure()

	static save = (packId: string, namespaceId: string, name: string, json: DimensionType, uuid: string = uuidv4()) => {
		return CTFile.save(packId, namespaceId, name, json, CTFileType.DimensionType, uuid)
	}
	static load = async (packId: string, namespaceId: string, uuid: string) => {
		const paths = await CTFile.getPaths(packId, namespaceId, uuid, CTFileType.DimensionType)
		const json = JSON.parse(await fs.promises.readFile(paths.filePath, 'utf8'))
		return new DimensionType(json.name, json.json)
	}
}
