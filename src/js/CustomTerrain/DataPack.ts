// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { getFilename, loadZip, memorySizeOf } from "@/js/helper";
import Dimension from "@/js/CustomTerrain/Dimension/Dimension";
import DimensionType from "@/js/CustomTerrain/Dimension/DimensionType";
import WorldGen from "@/js/CustomTerrain/WorldGen/WorldGen";
import Data from "@/js/CustomTerrain/Data";
import fs from "fs";
import path from "path";
import {ipcRenderer} from "electron";
import {EventList} from "@/js/events";
import { JSZipObject } from "jszip";

interface DataInterface {
	[index: string]: Data
}
interface MCMeta {
	pack: {
		pack_format: number,
		description: string
	}
}
interface DimensionTypeInterface {
	key: string
	value: JSZipObject
}

export default class DataPack {
	id: string
	name: string
	icon: string
	description: string
	pack_format: number
	data: DataInterface
	constructor(name = 'Unnamed', icon: string, mcmeta: MCMeta = {pack:{pack_format: 7,description: ''}}, data = {}, id = uuidv4()) {
		this.id = id
		this.name = name
		this.icon = icon
		this.description = mcmeta.pack.description ?? ''
		this.pack_format = mcmeta.pack.pack_format ?? 7
		this.data = data
	}

	getNamespaces = (): Data[] => Object.values(this.data)
	getNamespace = (namespace: string): Data => this.data[namespace]

	//Export
	getMCMeta = (): MCMeta => ({
		pack: {
			pack_format: this.pack_format,
			description: this.description,
		}
	})
	getWithoutData = (): object => ({
		id: this.id,
		name: this.name,
		icon: this.icon,
		pack_format: this.pack_format,
		description: this.description,
	})

	// Static
	static getPath = async (id: string): Promise<string> => {
		const userData = await ipcRenderer.invoke(EventList.getPath, 'userData')
		return path.join(userData, 'Data', 'custom_terrain/packs', id + '.datapack')
	}

	static createFromZip = async (path: string): Promise<DataPack | null> => {
		const zip = await loadZip(path)

		console.log(getFilename(path))

		const mcmetaZip = zip.file('pack.mcmeta')
		if (mcmetaZip) {
			let icon: any = zip.file('pack.png')
			if (icon) icon = await icon.async('base64')
			else icon = ''

			const mcmeta = JSON.parse(await mcmetaZip.async('string'))
			const datapack = new DataPack(getFilename(path), icon, mcmeta)

			const data = zip.folder('data')
			let namespaces: JSZipObject[] = []
			if (data) {
				namespaces = data.filter(
					(relativePath, file) => file.dir && (file.name.match(/\//g) || []).length === 2
				)
			}
			else {
				console.error('[DataPack: createFromZip] No data folder')
			}

			for (const folder of namespaces) {
				const namespace = folder.name.split('/')[1]
				console.group('Namespace:', namespace)

				// Dimension
				const dimensions: DimensionTypeInterface[] = [], dimension = []
				const dim = zip.folder(folder.name + 'dimension')
				if (dim)
					dim.forEach((relativePath, file) => {
						if (relativePath.endsWith('.json')) {
							dimensions.push({
								key: getFilename(relativePath),
								value: file
							})
						}
					})
				else console.error('[DataPack: createFromZip] No dimension folder')
				for (const dim of dimensions) {
					const json = JSON.parse(await dim.value.async('string'))
					dimension.push(new Dimension(dim.key, json))
				}
				console.log('Dimensions:', dimension)

				// Dimension type
				const dimension_types: DimensionTypeInterface[] = [], dimension_type = []
				const dimType = zip.folder(folder.name + 'dimension_type')
				if (dimType)
					dimType.forEach((relativePath, file) => {
						if (relativePath.endsWith('.json')) {
							dimension_types.push({
								key: getFilename(relativePath),
								value: file
							})
						}
					})
				else console.error('[DataPack: createFromZip] No dimension type folder')
				for (const dim of dimension_types) {
					const json = JSON.parse(await dim.value.async('string'))
					dimension_type.push(new DimensionType(dim.key, json))
				}
				console.log('Dimension types:', dimension_type)

				// Worldgen
				const worldgen = await WorldGen.fromZip(zip.folder(folder.name + 'worldgen'), namespace)

				datapack.data[namespace] = new Data(namespace, {
					dimension, dimension_type, worldgen, tags: []
				})

				console.groupEnd()
			}

			console.log(datapack)
			console.log('Size:', memorySizeOf(datapack))
			return datapack
		}
		else {
			console.error('No pack.mcmeta found')
			return null
		}
	}

	static load = async (id: string): Promise<DataPack | null> => {
		console.log(id)
		const packPath = await DataPack.getPath(id)
		if (fs.existsSync(packPath)) {
			try {
				const json = JSON.parse(fs.readFileSync(packPath, 'utf8'))
				console.log('[DataPack: load] json:', json)

				const data: DataInterface = {}
				Object.entries(json.data).forEach(e => {
					const val = e[1] as { dimension: [], dimension_type: [], worldgen: {}, tags: [] }
					data[e[0]] = new Data(e[0], {
						dimension: val.dimension.map((d: any) => new Dimension(d.name, d)),
						dimension_type: val.dimension_type.map((d: any) => new DimensionType(d.name, d)),
						worldgen: val.worldgen as WorldGen,
						tags: val.tags
					})
				})

				console.log('data', data)
				return new DataPack(json.name, json.icon, {
					pack: {
						description: json.description,
						pack_format: json.pack_format
					}
				}, data, json.id)
			} catch (error) {
				console.error('Error while loading DataPack from storage', error)
				return null
			}
		}
		return null
	}
}
