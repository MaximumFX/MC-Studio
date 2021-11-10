import Validation from "@/js/CustomTerrain/Validation";
import {DynamicSelectType} from "@/js/CustomTerrain/Helpers/Enum";

interface BiomeJSON {
	biome: string
	parameters: BiomeParameters
}
interface BiomeParameters {
	offset: number
	altitude: number
	weirdness: number
	temperature: number
	humidity: number
}

export default class Biome {
	biome: string
	parameters: BiomeParameters

	constructor(json: BiomeJSON) {
		this.biome = json.biome
		this.parameters = {
			offset: json.parameters.offset >= 0.0 ? (json.parameters.offset <= 1.0 ? json.parameters.offset : 1.0) : 0.0,

			altitude: json.parameters.altitude >= -2.0 ? (json.parameters.altitude <= 2.0 ? json.parameters.altitude : 2.0) : -2.0,
			weirdness: json.parameters.weirdness >= -2.0 ? (json.parameters.weirdness <= 2.0 ? json.parameters.weirdness : 2.0) : -2.0,
			temperature: json.parameters.temperature >= -2.0 ? (json.parameters.temperature <= 2.0 ? json.parameters.temperature : 2.0) : -2.0,
			humidity: json.parameters.humidity >= -2.0 ? (json.parameters.humidity <= 2.0 ? json.parameters.humidity : 2.0) : -2.0,
		}
	}
}

export const ValidateBiome = {
	biome: Validation.select(false, DynamicSelectType.BIOME),//todo select
	parameters: {
		offset: Validation.float(false, 0.0, 1.0),
		altitude: Validation.float(false, -2.0, 2.0),
		weirdness: Validation.float(false, -2.0, 2.0),
		temperature: Validation.float(false, -2.0, 2.0),
		humidity: Validation.float(false, -2.0, 2.0),
	}
}