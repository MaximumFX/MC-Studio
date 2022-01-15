import {Feature, FeatureJSON} from "@/js/CustomTerrain/WorldGen/Features";
import Validation, {Choice} from "@/js/CustomTerrain/Validation";
import {CTFileType, FeatureType} from "@/js/CustomTerrain/Helpers/Enum";
import {v4 as uuidv4} from "uuid";
import CTFile from "@/js/CustomTerrain/CTFile";
import fs from "fs";

export default class ConfiguredFeature {
	name: string
	type: string
	config?: Feature

	constructor(name = 'unnamed', json: FeatureJSON) {
		this.name = name
		this.type = json.type
		if (json.hasOwnProperty('config'))
			this.config = Feature.getFeature(json)
	}

	static getStructure = () => ({
		type: Validation.choiceValue(),
		config: Validation.choice(false, [
			new Choice(FeatureType.BAMBOO, 'Bamboo', {probability: Validation.float()}),
		], 'type'),
	})
	getStructure = () => ConfiguredFeature.getStructure()

	static save = (packId: string, namespaceId: string, name: string, json: ConfiguredFeature, uuid: string = uuidv4()) => {
		return CTFile.save(packId, namespaceId, name, json, CTFileType.ConfiguredFeature, uuid)
	}
	static load = async (packId: string, namespaceId: string, uuid: string) => {
		const paths = await CTFile.getPaths(packId, namespaceId, uuid, CTFileType.ConfiguredFeature)
		const json = JSON.parse(await fs.promises.readFile(paths.filePath, 'utf8'))
		return new ConfiguredFeature(json.name, json.json)
	}
}
