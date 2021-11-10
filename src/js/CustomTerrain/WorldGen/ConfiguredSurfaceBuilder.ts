import Block from "@/js/CustomTerrain/Helpers/Block";

interface ConfiguredSurfaceBuilderJSON {
	type: string
	config: ConfiguredSurfaceBuilderConfig
}
interface ConfiguredSurfaceBuilderConfig {
	top_material: Block
	under_material: Block
	underwater_material: Block
}

export default class ConfiguredSurfaceBuilder {
	path: string
	name: string
	type: string
	config: ConfiguredSurfaceBuilderConfig

	constructor(path = '', name = 'unnamed', json: ConfiguredSurfaceBuilderJSON) {
		this.path = path
		this.name = name
		this.type = json.type

		this.config = {
			top_material: new Block(json.config.top_material),
			under_material: new Block(json.config.under_material),
			underwater_material: new Block(json.config.underwater_material),
		}
	}
}