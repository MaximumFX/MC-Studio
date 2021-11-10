import {RuinedPortalType} from "@/js/CustomTerrain/Helpers/Enum";

interface ConfiguredStructureFeatureJSON {
	type: string
	config: object
}

export default class ConfiguredStructureFeature {
	path: string
	name: string
	type: string
	config?: StructureFeature

	constructor(path = '', name = 'unnamed', json: ConfiguredStructureFeatureJSON) {
		this.path = path
		this.name = name
		this.type = json.type

		if (!this.type.includes(':')) this.type = 'minecraft:' + this.type

		if (this.type === 'minecraft:bastion_remnant') {
			this.config = new BastionRemnant(json.config)
		}
		else if (this.type === 'minecraft:buried_treasure') {
			this.config = new BuriedTreasure(json.config)
		}
		else if (this.type === 'minecraft:mineshaft') {
			this.config = new Mineshaft(json.config)
		}
		else if (this.type === 'minecraft:ocean_ruin') {
			this.config = new OceanRuin(json.config)
		}
		else if (this.type === 'minecraft:pillager_outpost') {
			this.config = new PillagerOutpost(json.config)
		}
		else if (this.type === 'minecraft:ruined_portal') {
			this.config = new RuinedPortal(json.config)
		}
		else if (this.type === 'minecraft:shipwreck') {
			this.config = new Shipwreck(json.config)
		}
		else if (this.type === 'minecraft:village') {
			this.config = new Village(json.config)
		}
		else if (![
			'minecraft:desert_pyramid', 'minecraft:endcity', 'minecraft:fortress', 'minecraft:igloo', 'minecraft:jungle_pyramid',
			'minecraft:mansion', 'minecraft:monument', 'minecraft:nether_fossil', 'minecraft:stronghold', 'minecraft:swamp_hut'
		].includes(this.type))
			console.error('Undefined ConfiguredStructureFeature type:', this.type)
	}
}

export class StructureFeature {
	constructor() {}
}

export class BastionRemnant extends StructureFeature {//todo
	start_pool: any
	size: number

	constructor(json: any) {
		super()
		this.start_pool = json.start_pool
		this.size = json.size // Range: [0,7]
	}
}
export class BuriedTreasure extends StructureFeature {
	probability: number

	constructor(json: any) {
		super()
		this.probability = json.probability // Range: [0.0, 1.0]
	}
}
export class Mineshaft extends StructureFeature {
	type: string
	probability: number

	constructor(json: any) {
		super()
		this.type = json.type
		this.probability = json.probability
	}
}
export class OceanRuin extends StructureFeature {
	biome_temp: string
	large_probability: number
	cluster_probability: number

	constructor(json: any) {//todo
		super()
		this.biome_temp = json.biome_temp // 'warm' || 'cold'
		this.large_probability = json.large_probability // Range: [0.0, 1.0]
		this.cluster_probability = json.cluster_probability // Range: [0.0, 1.0]
	}
}
export class PillagerOutpost extends StructureFeature {//todo
	start_pool: any
	size: number

	constructor(json: any) {
		super()
		this.start_pool = json.start_pool
		this.size = json.size // Range: [0,7]
	}
}
export class RuinedPortal extends StructureFeature {
	portal_type: RuinedPortalType

	constructor(json: any) {
		super()
		this.portal_type = json.portal_type as RuinedPortalType
	}
}
export class Shipwreck extends StructureFeature {
	is_beached: boolean

	constructor(json:any) {
		super()
		this.is_beached = json.is_beached ?? false
	}
}
export class Village extends StructureFeature {//todo
	start_pool: any
	size: number

	constructor(json: any) {
		super()
		this.start_pool = json.start_pool
		this.size = json.size // Range: [0,7]
	}
}