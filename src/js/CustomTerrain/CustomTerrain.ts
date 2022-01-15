import {v4 as uuidv4} from 'uuid';
import {getFilename, loadZip, removeComments} from "@/js/helper";
import Dimension from "@/js/CustomTerrain/Dimension/Dimension";
import DimensionType from "@/js/CustomTerrain/Dimension/DimensionType";
import fs from "fs";
import path from "path";
import {ipcRenderer} from "electron";
import {EventList} from "@/js/events";
import {JSZipObject} from "jszip";
import Namespace, {NamespaceJSON} from "@/js/CustomTerrain/Namespace";
import CTFile from "@/js/CustomTerrain/CTFile";
import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum";
import Biome from "@/js/CustomTerrain/WorldGen/Biome";
import ConfiguredCarver from "@/js/CustomTerrain/WorldGen/ConfiguredCarver";
import Noise from "@/js/CustomTerrain/WorldGen/Noise";
import store from "@/store";

interface MCMeta {
	pack: {
		pack_format: number,
		description: string
	}
}
interface FileInterface {
	key: string
	value: JSZipObject
}

export default class CustomTerrain {
	id: string
	name: string
	icon: string
	description: string
	pack_format: number
	namespaces: Namespace[]
	constructor(name = 'Unnamed', icon: string, description = '', packFormat = 7, namespace: Namespace[] = [], id = uuidv4()) {
		this.id = id
		this.name = name
		this.icon = icon
		this.description = description
		this.pack_format = packFormat
		this.namespaces = namespace
	}

	getNamespaces = (): Namespace[] => Object.values(this.namespaces)
	getNamespace = (uuid: string): Namespace | undefined => this.namespaces.find(n => n.id === uuid)

	getAllOfType = (type: CTFileType, namespaced = false) => {// todo add mc defaults
		let items: any[] = []
		const vanillaWorldgen = require('../../assets/minecraft/1.18-pre5/vanilla_worldgen.json')
		for (const ns of this.namespaces) {
			let list: any[] = []
			const location = CTFile.getLocation(type)
			if (location.length === 1) {
				list = [// @ts-ignore todo fix ts-ignore
					...ns.data[location[0]],
					// ...(ns.name === 'minecraft' ? vanillaWorldgen.data[location[0]].map((a: string) => ({name: a})) : [])
				]
			}
			else if (location.length === 2) {
				list = [// @ts-ignore todo fix ts-ignore
					...ns.data[location[0]][location[1]],
					// ...(ns.name === 'minecraft' ? vanillaWorldgen.data[location[0]][location[1]].map((a: string) => ({name: a})) : [])
				]
			}

			if (namespaced) items.push({
				id: ns.id,
				name: ns.name,
				items: list
			})
			else items = items.concat(list)
		}
		if (!this.namespaces.some(a => a.name === 'minecraft')) {
			let list = []
			const location = CTFile.getLocation(type)
			if (location.length === 1) {
				list = vanillaWorldgen.data[location[0]].map((a: string) => ({name: a}))
			}
			else if (location.length === 2) {
				list = vanillaWorldgen.data[location[0]][location[1]].map((a: string) => ({name: a}))
			}

			if (namespaced) items.push({
				id: 'minecraft',
				name: 'minecraft',
				items: list
			})
			else items = items.concat(list)
		}
		return items
	}
	static getAllOfType = async (packId: string, type: CTFileType, namespaced = false) => {
		const ct = await CustomTerrain.load(packId)
		if (ct) return ct.getAllOfType(type, namespaced)
		else console.error('[CustomTerrain s getAllOfType] Failed to load CustomTerrain.', packId)
		return []
	}

	// Import
	static fromDatapack = async (path: string, id = uuidv4()): Promise<CustomTerrain | null> => {
		const zip = await loadZip(path)

		console.log('[CustomTerrain: fromDatapack]', getFilename(path), id)

		const mcmetaZip = zip.file('pack.mcmeta')
		if (mcmetaZip) {
			let icon: any = zip.file('pack.png')
			if (icon) icon = await icon.async('base64')
			else icon = ''

			const mcmeta = JSON.parse(await mcmetaZip.async('string'))

			const namespaces: Namespace[] = []
			const customTerrain = new CustomTerrain(getFilename(path), icon, mcmeta.pack.description, mcmeta.pack.pack_format, namespaces, id)
			await customTerrain.save()

			const data = zip.folder('data')
			if (data) {
				const totalFiles = data.filter((a, b) => !b.dir).length
				let finishedFiles = 0
				const addFile = () => {
					finishedFiles++
					store.commit('setProgressBar', finishedFiles / totalFiles)
				}

				const ns = data.filter((relativePath, file) =>
					file.dir && (file.name.match(/\//g) || []).length === 2
				)

				// Create empty namespaces
				const process = []
				for (const namespace of ns) {
					const newNS = new Namespace(namespace.name.split('/')[1])
					namespaces.push(newNS)
					customTerrain.namespaces = namespaces
					await customTerrain.save()
					process.push({
						zip: namespace,
						ns: newNS
					})
				}

				// Fill namespaces
				for (const namespace of process) {
					const getItemsInFolder = (name: string): FileInterface[] => {
						const folder = zip.folder(namespace.zip.name + name)
						const list: FileInterface[] = []
						if (folder) {
							folder.forEach((relativePath, file) => {
								if (relativePath.endsWith('.json')) {
									list.push({
										key: getFilename(relativePath),
										value: file
									})
								}
							})
						}
						else console.error(`[CustomTerrain: createFromZip] No ${name} folder`)
						return list
					}

					// Dimension
					const dimension: CTFile[] = []
					for (const file of getItemsInFolder('dimension')) {
						const json = JSON.parse(await file.value.async('string'))
						dimension.push(await Dimension.save(id, namespace.ns.id, file.key, json))
						addFile()
					}
					console.log('Dimensions:', dimension)

					// Dimension type
					const dimension_type: CTFile[] = []
					for (const file of getItemsInFolder('dimension_type')) {
						const json = JSON.parse(await file.value.async('string'))
						dimension_type.push(await DimensionType.save(id, namespace.ns.id, file.key, json))
						addFile()
					}
					console.log('Dimension types:', dimension)

					const biome: CTFile[] = []
					const configured_carver: CTFile[] = []
					const configured_feature: CTFile[] = []
					const configured_structure_feature: CTFile[] = []
					const placed_feature: CTFile[] = []
					const noise: CTFile[] = []
					const noise_settings: CTFile[] = []
					const processor_list: CTFile[] = []
					const template_pool: CTFile[] = []

					const worldgen = zip.folder(namespace.zip.name + 'worldgen')
					if (worldgen) {
						// todo is this really necessary?
						const features = worldgen.filter((relativePath, file) =>
								// @ts-ignore
							file.dir && file.name.match(/\//g).length === worldgen.root.match(/\//g).length + 1
							// @ts-ignore
						).map(a => a.name.replace(worldgen.root, '').replace('/', ''))
						console.log('features', features)

						// Biome
						const biomeColors = require('@/assets/external/misode/biomeColors.json')
						if (features.includes('biome')) {
							for (const file of getItemsInFolder('worldgen/biome')) {
								const json = JSON.parse(removeComments(await file.value.async('string')))
								biome.push(
									await Biome.save(id, namespace.ns.id, file.key, json, undefined,
										biomeColors[namespace.ns.name + ':' + file.key] ??
										[Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)]
									)
								)
								addFile()
							}
							console.log('Biomes:', biome)
						}

						// Configured Carver
						if (features.includes('configured_carver')) {
							for (const file of getItemsInFolder('worldgen/configured_carver')) {
								const json = JSON.parse(removeComments(await file.value.async('string')))
								configured_carver.push(await ConfiguredCarver.save(id, namespace.ns.id, file.key, json))
								addFile()
							}
							console.log('Configured carvers:', configured_carver)
						}

						//todo

						// Noise
						if (features.includes('noise')) {
							for (const file of getItemsInFolder('worldgen/noise')) {
								const json = JSON.parse(removeComments(await file.value.async('string')))
								noise.push(await Noise.save(id, namespace.ns.id, file.key, json))
								addFile()
							}
							console.log('Noise:', noise)
						}

						//todo
					}

					const index = customTerrain.namespaces.findIndex(i => i.id === namespace.ns.id)
					if (index !== -1) {
						customTerrain.namespaces[index].data = {
							dimension,
							dimension_type,
							worldgen: {
								biome,
								configured_carver,
								configured_feature,
								configured_structure_feature,
								placed_feature,
								noise,
								noise_settings,
								processor_list,
								template_pool
							}
						}
						await customTerrain.save()
					}
					else console.error('[CustomTerrain: fromDatapack] Couldn\'t find namespace in new CustomTerrain')
				}
			}
			else console.error('[CustomTerrain: fromDatapack] No data folder')

			store.commit('setProgressBar', -1)
			return customTerrain
		}
		return null
	}

	static load = async (uuid: string): Promise<CustomTerrain | null> => {
		console.log('[CustomTerrain load]',uuid)
		const packPath = path.join(await CustomTerrain.getPath(uuid), 'pack.json')
		if (fs.existsSync(packPath)) {
			try {
				const json = JSON.parse(fs.readFileSync(packPath, 'utf8'))

				const namespaces = (json.namespaces as NamespaceJSON[]).map(ns => Namespace.fromJSON(uuid, ns))

				return new CustomTerrain(json.name, json.icon, json.description, json.pack_format, namespaces, uuid)
			} catch (error) {
				console.error('Error while loading CustomTerrain from storage', error)
				return null
			}
		}
		else console.error(`[CustomTerrain load] Couldn't find CustomTerrain "${uuid}"!`)
		return null
	}

	save = async () => {
		const packPath = await CustomTerrain.getPath(this.id)
		await fs.promises.mkdir(packPath, { recursive: true })
		await fs.promises.writeFile(path.join(packPath, 'pack.json'), JSON.stringify(this))
		console.log('[CustomTerrain: save] Saved CustomTerrain:', this)
	}

	//Export
	getMCMeta = (): MCMeta => ({
		pack: {
			pack_format: this.pack_format,
			description: this.description,
		}
	})


	// Helper functions
	static getPath = async (uuid: string): Promise<string> => {
		const userData = await ipcRenderer.invoke(EventList.getPath, 'userData')
		return path.join(userData, 'Data', 'custom_terrain', 'packs', uuid)
	}
}
