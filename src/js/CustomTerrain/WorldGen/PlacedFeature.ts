import Validation from "@/js/CustomTerrain/Validation";
import {v4 as uuidv4} from "uuid";
import CTFile from "@/js/CustomTerrain/CTFile";
import {CarvingMask, CTFileType} from "@/js/CustomTerrain/Helpers/Enum";
import fs from "fs";

interface PlacementJSON {
	type: string
}

export default class PlacedFeature {
	name: string

	feature: string
	placement: PlacementJSON[]

	BIOME: boolean
	IN_SQUARE: boolean
	CARVING_MASK?: CarvingMask

	constructor(name: string = 'unnamed', json: any = {}) {
		this.name = name

		this.feature = json.feature ?? ''
		this.placement = json.placement ?? [1]

		this.BIOME = json.placement.some((a: PlacementJSON) => a.type === 'minecraft:biome')
		this.IN_SQUARE = json.placement.some((a: PlacementJSON) => a.type === 'minecraft:in_square')
		this.CARVING_MASK = json.placement.find((a: PlacementJSON) => a.type === 'minecraft:carving_mask')?.step
	}


	static getStructure = () => ({
		feature: Validation.dynamicSelect(false, CTFileType.ConfiguredFeature),
	})
	getStructure = () => PlacedFeature.getStructure()

	static save = (packId: string, namespaceId: string, name: string, json: PlacedFeature, uuid: string = uuidv4()) => {
		return CTFile.save(packId, namespaceId, name, json, CTFileType.PlacedFeature, uuid)
	}
	static load = async (packId: string, namespaceId: string, uuid: string) => {
		const paths = await CTFile.getPaths(packId, namespaceId, uuid, CTFileType.PlacedFeature)
		const json = JSON.parse(await fs.promises.readFile(paths.filePath, 'utf8'))
		return new PlacedFeature(json.name, json.json)
	}
}
