import {v4 as uuidv4} from 'uuid';
import {
	DebugGenerator,
	DimensionGenerator,
	FlatGenerator,
	FlatGeneratorSettings,
	NoiseGenerator
} from "@/js/CustomTerrain/Dimension/DimensionGenerators";
import CTFile from "@/js/CustomTerrain/CTFile";
import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum";
import fs from "fs";
import NoiseSettings from "@/js/CustomTerrain/WorldGen/NoiseSettings";
import Validation, {Choice} from "@/js/CustomTerrain/Validation";

interface DimensionJSON {
	type: string
	generator: {
		type: string
		settings: NoiseSettings | FlatGeneratorSettings
	}
}

export default class Dimension {
	name: string
	type: string
	generator: DimensionGenerator

	constructor(name = 'unnamed', json: DimensionJSON = {type: 'minecraft:noise', generator: {type: '', settings: new NoiseSettings()}}) {
		this.name = name
		this.type = json.type
		if (!this.type.includes(':')) this.type = 'minecraft:' + this.type

		if (json.generator.type === 'minecraft:noise')
			this.generator = new NoiseGenerator(json.generator)
		else if (json.generator.type === 'minecraft:flat')// @ts-ignore
			this.generator = new FlatGenerator(json.generator.settings)//todo
		else if (json.generator.type === 'minecraft:debug')
			this.generator = new DebugGenerator()
		else throw new Error('[Dimension] Undefined Dimension generator type')
	}

	static getStructure = () => ({
		type: Validation.dynamicSelect(false, CTFileType.DimensionType),
		generator: Validation.choice(false, [
			new Choice('minecraft:noise', 'Noise', NoiseGenerator.getStructure()),
			new Choice('minecraft:flat', 'Flat', FlatGenerator.getStructure()),
			new Choice('minecraft:debug', 'Debug', DebugGenerator.getStructure()),
		], 'type')
	})
	getStructure = () => Dimension.getStructure()

	static save = (packId: string, namespaceId: string, name: string, json: DimensionJSON, uuid: string = uuidv4()) => {
		return CTFile.save(packId, namespaceId, name, json, CTFileType.Dimension, uuid)
	}
	static load = async (packId: string, namespaceId: string, uuid: string) => {
		const paths = await CTFile.getPaths(packId, namespaceId, uuid, CTFileType.Dimension)
		const json = JSON.parse(await fs.promises.readFile(paths.filePath, 'utf8'))
		return new Dimension(json.name, json.json)
	}
}
