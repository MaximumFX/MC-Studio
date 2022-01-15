import Validation from "@/js/CustomTerrain/Validation";
import {v4 as uuidv4} from "uuid";
import CTFile from "@/js/CustomTerrain/CTFile";
import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum";
import fs from "fs";

export default class Noise {
	name: string

	firstOctave: number
	amplitudes: number[]

	constructor(name: string = 'unnamed', json: any = {}) {
		this.name = name

		this.firstOctave = json.firstOctave ?? 0
		this.amplitudes = json.amplitudes ?? [1]
	}


	static getStructure = () => ({
		firstOctave: Validation.int(),
		amplitudes: Validation.array(false, Validation.float(), 'Amplitude'),
	})
	getStructure = () => Noise.getStructure()

	static save = (packId: string, namespaceId: string, name: string, json: Noise, uuid: string = uuidv4()) => {
		return CTFile.save(packId, namespaceId, name, json, CTFileType.Noise, uuid)
	}
	static load = async (packId: string, namespaceId: string, uuid: string) => {
		const paths = await CTFile.getPaths(packId, namespaceId, uuid, CTFileType.Noise)
		const json = JSON.parse(await fs.promises.readFile(paths.filePath, 'utf8'))
		return new Noise(json.name, json.json)
	}
}
