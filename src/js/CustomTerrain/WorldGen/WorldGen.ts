import {getFilename, getFolder, removeComments} from "@/js/helper";
import Biome from "@/js/CustomTerrain/WorldGen/Biome";
import ConfiguredCarver from "@/js/CustomTerrain/WorldGen/ConfiguredCarver";
import ConfiguredFeature from "@/js/CustomTerrain/WorldGen/ConfiguredFeature";
import ConfiguredSurfaceBuilder from "@/js/CustomTerrain/WorldGen/ConfiguredSurfaceBuilder";
import ConfiguredStructureFeature from "@/js/CustomTerrain/WorldGen/ConfiguredStructureFeature";
import NoiseSettings from "@/js/CustomTerrain/WorldGen/NoiseSettings";
import JSZip from "jszip";

interface WorldGenOptions {
	biome: Biome[]
	configured_carver: ConfiguredCarver[]
	configured_feature: ConfiguredFeature[]
	configured_structure_feature: ConfiguredStructureFeature[]
	configured_surface_builder: ConfiguredSurfaceBuilder[]
	noise_settings: NoiseSettings[]
	// processor_list: []
	// template_pool: []
}

interface JsonFile {
	path: string
	name: string,
	file: any
}

export default class WorldGen {
	biome: Biome[]
	configured_carver: ConfiguredCarver[]
	configured_feature: ConfiguredFeature[]
	configured_structure_feature: ConfiguredStructureFeature[]
	configured_surface_builder: ConfiguredSurfaceBuilder[]
	noise_settings: NoiseSettings[]
	processor_list: []
	template_pool: []


	constructor(options?: WorldGenOptions)
	constructor(options: any) {
			this.biome = options.biome ?? []
			this.configured_carver = options.configured_carver ?? []
			this.configured_feature = options.configured_feature ?? []
			this.configured_structure_feature = options.configured_structure_feature ?? []
			this.configured_surface_builder = options.configured_surface_builder ?? []
			this.noise_settings = options.noise_settings ?? []
			this.processor_list = []
			this.template_pool = []
			// this.processor_list = options.processor_list ?? []//TODO
			// this.template_pool = options.template_pool ?? []//TODO
	}

	static async fromZip(folder: JSZip | null, namespace: string) {
		if (folder) {
			const features = folder.filter((relativePath, file) =>
					// @ts-ignore
				file.dir && file.name.match(/\//g).length === folder.root.match(/\//g).length + 1
				// @ts-ignore
			).map(a => a.name.replace(folder.root, '').replace('/', ''))
			console.log('Features', features)

			const loadFiles = (array: any[], relativePath: string, file: any) => {
				if (relativePath.endsWith('.json')) {
					const tmp = {
						path: '',
						name: getFilename(relativePath),
						file: file
					}
					// @ts-ignore
					if (file.name.match(/\//g).length !== folder.root.match(/\//g).length + 1)
						tmp.path = getFolder(relativePath)
					array.push(tmp)
				}
			}

			// Biomes
			const biomes: JsonFile[] = [],
				biome = []
			if (features.includes('biome')) {
				// @ts-ignore
				folder.folder('biome')
					.forEach((relativePath, file) => loadFiles(biomes, relativePath, file))
				for (const bio of biomes) {
					const json = removeComments(await bio.file.async('string'))
					biome.push(new Biome(bio.path, bio.name, JSON.parse(json)))
				}
				console.log('Biomes:', biome)
			}

			// Configured Carvers
			const carvers: JsonFile[] = [],
				configured_carver = []
			if (features.includes('configured_carver')) {
				// @ts-ignore
				folder.folder('configured_carver')
					.forEach((relativePath, file) => loadFiles(carvers, relativePath, file))
				for (const cvr of carvers) {
					const json = removeComments(await cvr.file.async('string'))
					configured_carver.push(new ConfiguredCarver(cvr.path, cvr.name, JSON.parse(json)))
				}
				console.log('Configured Carvers:', configured_carver)
			}

			// Configured Features
			const feature: JsonFile[] = [],
				configured_feature = []
			if (features.includes('configured_feature')) {
				// @ts-ignore
				folder.folder('configured_feature')
					.forEach((relativePath, file) => loadFiles(feature, relativePath, file))
				for (const ftr of feature) {
					const json = removeComments(await ftr.file.async('string'))
					configured_feature.push(new ConfiguredFeature(ftr.path, ftr.name, JSON.parse(json)))
				}
				console.log('Configured Features:', configured_feature)
			}

			// Configured Surface Builders
			const surfaceBuilders: JsonFile[] = [],
				configured_surface_builder = []
			if (features.includes('configured_surface_builder')) {
				// @ts-ignore
				folder.folder('configured_surface_builder')
					.forEach((relativePath, file) => loadFiles(surfaceBuilders, relativePath, file))
				for (const cvr of surfaceBuilders) {
					const json = removeComments(await cvr.file.async('string'))
					configured_surface_builder.push(new ConfiguredSurfaceBuilder(cvr.path, cvr.name, JSON.parse(json)))
				}
				console.log('Configured Surface Builders:', configured_surface_builder)
			}

			// Configured Features
			const structureFeature: JsonFile[] = [],
				configured_structure_feature = []
			if (features.includes('configured_structure_feature')) {
				// @ts-ignore
				folder.folder('configured_structure_feature')
					.forEach((relativePath, file) => loadFiles(structureFeature, relativePath, file))
				for (const ftr of structureFeature) {
					const json = removeComments(await ftr.file.async('string'))
					configured_structure_feature.push(new ConfiguredStructureFeature(ftr.path, ftr.name, JSON.parse(json)))
				}
				console.log('Configured Structure Features:', configured_structure_feature)
			}

			// Noise Settings
			const noiseSettings: JsonFile[] = [],
				noise_settings = []
			if (features.includes('noise_settings')) {
				// @ts-ignore
				folder.folder('noise_settings')
					.forEach((relativePath, file) => loadFiles(noiseSettings, relativePath, file))
				for (const ftr of noiseSettings) {
					const json = removeComments(await ftr.file.async('string'))
					noise_settings.push(new NoiseSettings(ftr.path, ftr.name, JSON.parse(json)))
				}
				console.log('Noise Settings:', noise_settings)
			}

			return new WorldGen({
				biome,
				configured_carver,
				configured_feature,
				configured_surface_builder,
				configured_structure_feature,
				noise_settings
			})
		}
		else throw new Error('[WorldGen: fromZip] Folder not found.')
	}
}