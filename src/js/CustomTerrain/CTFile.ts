import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum";
import Dimension from "@/js/CustomTerrain/Dimension/Dimension";
import {v4 as uuidv4} from "uuid";
import {ipcRenderer} from "electron";
import {EventList} from "@/js/events";
import path from "path";
import fs from "fs";
import {NamespaceJSON} from "@/js/CustomTerrain/Namespace";
import DimensionType from "@/js/CustomTerrain/Dimension/DimensionType";
import Biome from "@/js/CustomTerrain/WorldGen/Biome";
import ConfiguredCarver from "@/js/CustomTerrain/WorldGen/ConfiguredCarver";
import Noise from "@/js/CustomTerrain/WorldGen/Noise";
import MCSprite from "@/js/MCSprite";

export interface CTFileJSON {
	uuid: string
	name: string
	color?: number[]
	sprite?: string | MCSprite
}

export default class CTFile {
	packId: string
	namespaceId: string
	uuid: string
	name: string
	fileType: CTFileType
	file: any

	color?: number[]
	sprite?: MCSprite

	constructor(packId: string, namespaceId: string, json: CTFileJSON, type: CTFileType) {
		this.packId = packId
		this.namespaceId = namespaceId
		//@ts-ignore
		this.uuid = json.uuid ?? json.id //todo deprecated
		this.name = json.name
		this.fileType = type

		this.color = json.color
		this.sprite = json.sprite ? json.sprite instanceof MCSprite ? json.sprite : new MCSprite(json.sprite) : undefined
	}

	static getLocation = (type: CTFileType) => {
		switch (type) {
			case CTFileType.Dimension:
				return ['dimension']
			case CTFileType.DimensionType:
				return ['dimension_type']
			case CTFileType.Biome:
				return ['worldgen', 'biome']
			case CTFileType.ConfiguredCarver:
				return ['worldgen', 'configured_carver']
			case CTFileType.ConfiguredFeature:
				return ['worldgen', 'configured_feature']
			case CTFileType.ConfiguredStructureFeature:
				return ['worldgen', 'configured_structure_feature']
			case CTFileType.PlacedFeature:
				return ['worldgen', 'placed_feature']
			case CTFileType.Noise:
				return ['worldgen', 'noise']
			case CTFileType.NoiseSettings:
				return ['worldgen', 'noise_settings']
			case CTFileType.ProcessorList:
				return ['worldgen', 'processor_list']
			case CTFileType.TemplatePool:
				return ['worldgen', 'template_pool']
		}
		return []
	}
	static getPaths = async (packId: string, namespaceId: string, uuid: string | undefined, type: CTFileType) => {
		const userData = await ipcRenderer.invoke(EventList.getPath, 'userData')
		const basePath = path.join(userData, 'Data', 'custom_terrain', 'packs', packId)

		const location: string[] = CTFile.getLocation(type)
		const fileLoc = path.join(basePath, namespaceId, ...location)
		return {
			location, basePath, fileLoc,
			filePath: uuid ? path.join(fileLoc, uuid + '.json') : ''
		}
	}
	static save = async (packId: string, namespaceId: string, name: string, json: any, type: CTFileType, uuid: string = uuidv4(), color?: number[], sprite?: MCSprite) => {
		const paths = await CTFile.getPaths(packId, namespaceId, uuid, type)

		json = {
			uuid,
			name,
			color,
			sprite,
			saved: new Date(),
			json
		}

		// Write file
		await fs.promises.mkdir(paths.fileLoc, { recursive: true })
		await fs.promises.writeFile(paths.filePath, JSON.stringify(json))

		// Add to pack.json
		const packPath = path.join(paths.basePath, 'pack.json')
		if (fs.existsSync(packPath)) {
			const pack = JSON.parse(await fs.promises.readFile(packPath, 'utf8'))
			const i = (pack.namespaces as NamespaceJSON[]).findIndex(ns => ns.id === namespaceId)
			if (i !== -1) {
				if (paths.location.length === 1) {
					if (!pack.namespaces[i].data[paths.location[0]].some((a: any) => a.uuid === uuid)) {
						pack.namespaces[i].data[paths.location[0]].push({uuid, name, color, sprite})
						await fs.promises.writeFile(packPath, JSON.stringify(pack))
					}
					else console.log('[CTFile getPaths] UUID already added to pack.')
				}
				else if (paths.location.length === 2) {
					if (!pack.namespaces[i].data[paths.location[0]][paths.location[1]].some((a: any) => a.uuid === uuid)) {
						pack.namespaces[i].data[paths.location[0]][paths.location[1]].push({uuid, name, color, sprite})
						await fs.promises.writeFile(packPath, JSON.stringify(pack))
					}
					else console.log('[CTFile getPaths] UUID already added to pack.')
				}
				else console.error('[CTFile getPaths] paths location out of bounds!', paths.location)
			}
			else console.error(`[CTFile getPaths] Namespace "${namespaceId}" not found!`)
		}
		else console.error(`Couldn't find pack.json for "${packId}"!`)

		return new CTFile(packId, namespaceId,{uuid, name, color, sprite}, type)
	}

	save = async (json: any = this.file) => CTFile.save(this.packId, this.namespaceId, this.name, json, this.fileType, this.uuid, this.color, this.sprite)
	load = async () => {
		const paths = await CTFile.getPaths(this.packId, this.namespaceId, this.uuid, this.fileType)
		if (fs.existsSync(paths.filePath)) {
			const {size} = fs.statSync(paths.filePath)
			if (size > 512000) console.warn('[CTFile load] Size', this.fileType, size)
		}
		else console.log('[CTFile load] not found', this, paths)
		switch (this.fileType) {
			case CTFileType.Dimension:
				this.file = await Dimension.load(this.packId, this.namespaceId, this.uuid)
				break
			case CTFileType.DimensionType:
				this.file = await DimensionType.load(this.packId, this.namespaceId, this.uuid)
				break
			case CTFileType.Biome:
				this.file = await Biome.load(this.packId, this.namespaceId, this.uuid)
				break
			case CTFileType.ConfiguredCarver:
				this.file = await ConfiguredCarver.load(this.packId, this.namespaceId, this.uuid)
				break
			case CTFileType.Noise:
				this.file = await Noise.load(this.packId, this.namespaceId, this.uuid)
				break
		}
		return this
	}

	// Formatting
	toJSON = () => ({
		uuid: this.uuid,
		name: this.name,
		color: this.color,
		sprite: this.sprite
	})
}
