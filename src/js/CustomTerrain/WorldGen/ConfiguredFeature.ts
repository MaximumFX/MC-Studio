import {Feature, FeatureJSON} from "@/js/CustomTerrain/WorldGen/Features";

export default class ConfiguredFeature {
	path: string
	name: string
	type: string
	config?: Feature

	constructor(path = '', name = 'unnamed', json: FeatureJSON) {
		this.path = path
		this.name = name
		this.type = json.type
		if (json.hasOwnProperty('config'))
			this.config = Feature.getFeature(json)
	}
}