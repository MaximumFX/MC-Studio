import Validation from "@/js/CustomTerrain/Validation";
import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum";

/** Version 1.18-pre7 */
interface BiomeJSON {
	biome: string
	parameters: BiomeParameters
}
interface BiomeParameters {
	offset: number
	erosion: number
	depth: number
	weirdness: number
	temperature: number
	humidity: number
	continentalness: number
}

export default class Biome {
	biome: string
	parameters: BiomeParameters

	constructor(json: BiomeJSON) {
		this.biome = json.biome
		this.parameters = {
			offset: json.parameters.offset ?? 0,

			erosion: json.parameters.erosion ?? 0,
			depth: json.parameters.depth ?? 0,
			weirdness: json.parameters.weirdness ?? 0,
			temperature: json.parameters.temperature ?? 0,
			humidity: json.parameters.humidity ?? 0,
			continentalness: json.parameters.continentalness ?? 0,
		}
	}
}

export const ValidateBiome = {
	biome: Validation.dynamicSelect(false, CTFileType.Biome),
	parameters: {
		offset: Validation.float(false, 0.0, 1.0),
		erosion: Validation.float(false, -2.0, 2.0),//todo check range for parameters
		depth: Validation.float(false, -2.0, 2.0),
		weirdness: Validation.float(false, -2.0, 2.0),
		humidity: Validation.float(false, -2.0, 2.0),
		continentalness: Validation.float(false, -2.0, 2.0),
	}
}
