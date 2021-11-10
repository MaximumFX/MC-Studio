import {
	// @ts-ignore
	// TODO
	DimensionGenerator,
	DebugGenerator,
	FlatGenerator,
	NoiseGenerator
} from "@/js/CustomTerrain/Dimension/DimensionGenerators";

export default class Dimension {
	name: string
	type: string
	generator: DimensionGenerator

	constructor(name = 'unnamed', json = {type: '', generator: {type: '', settings: undefined}}) {
		this.name = name
		this.type = json.type
		if (!this.type.includes(':')) this.type = 'minecraft:' + this.type

		if (json.generator.type === 'minecraft:noise')
			this.generator = new NoiseGenerator(json.generator)
		else if (json.generator.type === 'minecraft:flat')
			this.generator = new FlatGenerator(json.generator.settings)
		else if (json.generator.type === 'minecraft:debug')
			this.generator = new DebugGenerator()
		else throw new Error('[Dimension] Undefined Dimension generator type')
	}
}