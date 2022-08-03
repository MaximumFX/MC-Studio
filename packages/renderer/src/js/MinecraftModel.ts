import type { Group, MeshStandardMaterial } from 'three';
import * as THREE from 'three';
import InstancedGroupMesh from 'three-instanced-group-mesh';
import type { MCBlockStateModel } from '#main/minecraft/Blockstate';
import Blockstate from '#main/minecraft/Blockstate';
import type Structure from '#main/minecraft/Structure';

export interface ModelDisplay {
	rotation: [number, number, number]
	scale: [number, number, number]
	translation: [number, number, number]
}
export interface ModelFace {
	uv: [number, number, number, number],
	texture: string
	tintindex: number,
	cullface: string
}
export interface ModelElement {
	faces: {
		down: ModelFace
		east: ModelFace
		north: ModelFace
		south: ModelFace
		up: ModelFace
		west: ModelFace
	}
	rotation?: {
		axis: string
		origin: [number, number, number]
		angle: number
		rescale?: boolean
	}
	from: [number, number, number]
	to: [number, number, number]
}
export interface MCModel {
	textures?: {
		[key: string]: string
	}
	parent?: string
	ambientocclusion?: boolean
	elements?: ModelElement[]
	gui_light?: string
	display?: {
		firstperson_lefthand?: ModelDisplay
		firstperson_righthand?: ModelDisplay
		thirdperson_righthand?: ModelDisplay
		fixed?: ModelDisplay
		ground?: ModelDisplay
		gui?: ModelDisplay
	}
}

export default class MinecraftModel {
	static load = async (version: string, namespace: string, model: MCModel, minecraftVersion = '1.19') => {
		const build: MCModel = { ...model }

		if (model.parent) {
			const mergeModels = (child: MCModel, parent: MCModel) => {
				for (const parentKey in parent) {
					if (parentKey === 'parent') continue;

					if (!child[parentKey]) child[parentKey] = parent[parentKey]

					else if (Array.isArray(child[parentKey])) child[parentKey] = [
						...parent[parentKey],
						...child[parentKey],
					]
					else if (typeof child[parentKey] === 'object') child[parentKey] = {
						...parent[parentKey],
						...child[parentKey],
					}
					else console.warn(parentKey, child[parentKey], parent[parentKey]);
				}
			}
			const getParent = async (parent: string): Promise<MCModel> => {
				if (parent.includes('builtin')) {
					console.error('[MinecraftModel load] Tried to get builtin parent model')
					throw 'builtin_model'
				}
				let returnObj: MCModel = {}

				let id = parent.split(':')
				if (id.length === 1) id = ['minecraft', ...id]

				let parentVersion = version
				if (namespace !== 'minecraft' && id[0] === 'minecraft')
					parentVersion = minecraftVersion

				const { data } = await window.api.mc.getAsset(parentVersion, window.joinPaths('assets', id[0], 'models', id[1] + '.json'))
				if (data) {
					returnObj = JSON.parse(data)
					if (returnObj.parent) {
						mergeModels(returnObj, await getParent(returnObj.parent))
					}
				}
				return returnObj
			}

			mergeModels(build, await getParent(model.parent))

			delete build.parent
		}

		if (build.textures) {
			const getRelTexture = (key: string, textures: { [key: string]: string }): string => {
				if (textures[key.substring(1)].startsWith('#')) return getRelTexture(textures[key.substring(1)], textures)
				return textures[key.substring(1)]
			}
			const usedTextures: string[] = []
			if (build.elements && build.elements.length) {
				for (const element of build.elements) {
					if (element.faces) {
						for (const faceKey in element.faces) {
							const ref = element.faces[faceKey].texture
							if (!usedTextures.includes(ref))
								usedTextures.push(ref)
						}
					}
				}
			}

			for (const texture in build.textures) {
				const ref = build.textures[texture]

				if (ref.startsWith('#'))
					build.textures[texture] = getRelTexture(ref, build.textures)

				if (!build.textures[texture].includes(':')) build.textures[texture] = 'minecraft:' + build.textures[texture]
			}
		}

		return build
	}

	static build = async (version: string, namespace: string, name: string, model: MCModel, minecraftVersion = '1.19') => {
		if (!model.elements) throw 'no_elements'

		const materials: { [key: string]: MeshStandardMaterial } = {}
		const mcMetas: {
			[key: string]: {
				frameCount: number,
				mcmeta: any
			}
		} = {}

		const missingMaterial = new THREE.MeshStandardMaterial({
			color: 0xFF00FF,
			transparent: false,
			opacity: 0,
			alphaTest: 0.5,
		})

		for (const texturesKey in model.textures) {
			let id = model.textures[texturesKey].split(':')
			if (id.length === 1) id = ['minecraft', ...id]

			let parentVersion = version
			if (namespace !== 'minecraft' && id[0] === 'minecraft')
				parentVersion = minecraftVersion

			const texture = new THREE.Texture();
			const img = new Image();
			const asset = await window.api.mc.getAsset(parentVersion, window.joinPaths('assets', id[0], 'textures', id[1] + '.png'), true)
			img.src = `data:${asset.mime};base64,` + asset.data
			texture.image = img;
			let frameCount = 1
			img.onload = () => {
				texture.needsUpdate = true;
				frameCount = img.height / img.width
			};
			texture.minFilter = THREE.NearestFilter;
			texture.magFilter = THREE.NearestFilter;

			if (asset.mcmeta) {
				mcMetas[texturesKey] = {
					frameCount,
					mcmeta: asset.mcmeta,
				}
			}

			materials[texturesKey] = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				map: texture,
				transparent: true,
				opacity: 1,
				alphaTest: 0.1,
			})
		}

		const block = new THREE.Group();
		block.name = this.name

		for (const element of model.elements) {
			const size = {
				x: Math.abs(element.from[0] - element.to[0]) / 16,
				y: Math.abs(element.from[1] - element.to[1]) / 16,
				z: Math.abs(element.from[2] - element.to[2]) / 16,
			}
			const center = {
				x: ((element.from[0] + element.to[0]) / 2) / 16 - .5,
				y: ((element.from[1] + element.to[1]) / 2) / 16,
				z: ((element.from[2] + element.to[2]) / 2) / 16 - .5,
			}

			const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);

			// Texture
			const textures: { [key: string]: MeshStandardMaterial } = {}
			const textureSizes: { [key: string]: number } = {}
			for (const facesKey in element.faces) {
				textures[facesKey] = materials[element.faces[facesKey].texture.substring(1)]
				textureSizes[facesKey] = mcMetas[element.faces[facesKey].texture.substring(1)]?.frameCount
			}

			// UVs
			for (let i = 0; i < 6; i++) {
				const face = ['east', 'west', 'up', 'down', 'south', 'north'][i]
				if (element.faces[face]) {
					const a = i * 8

					// let mapping = {x1: 0, y1: 1, x2: 2, y2: 3}
					let mapping = [
						{ x: 0, y: 1 },
						{ x: 2, y: 1 },
						{ x: 0, y: 3 },
						{ x: 2, y: 3 },
					]

					let uv = [0, 0, 16, 16]
					if (element.faces[face].uv) uv = [...element.faces[face].uv]
					else {
						if (face === 'north' || face === 'south') uv = [element.from[0], 16 - element.to[1], element.to[0], 16 - element.from[1]]
						else if (face === 'up' || face === 'down') uv = [element.from[0], element.from[2], element.to[0], element.to[2]]
						else if (face === 'east' || face === 'west') uv = [element.from[2], 16 - element.to[1], element.to[2], 16 - element.from[1]]
					}
					uv = uv.map(a => a / 16)

					// Fix edges
					uv[0] += 0.0005
					uv[1] += 0.0005
					uv[2] -= 0.0005
					uv[3] -= 0.0005

					// let map = [
					// 	new THREE.Vector2(uv[0], uv[1]),
					// 	new THREE.Vector2(uv[2], uv[1]),
					// 	new THREE.Vector2(uv[0], uv[3]),
					// 	new THREE.Vector2(uv[2], uv[3]),
					// ]
					const amount = element.faces[face].rotation;
					if (amount) {
						// check property
						if (![0, 90, 180, 270].includes(amount))
							throw new Error('The "rotation" property for "' + face + '" face in element is invalid (got "' + amount + '").')

						// rotate map
						if (amount === 90) mapping = [mapping[3], mapping[1], mapping[2], mapping[0]]
						if (amount === 180) mapping = [mapping[2], mapping[3], mapping[0], mapping[1]]
						if (amount === 270) mapping = [mapping[1], mapping[3], mapping[0], mapping[2]]

						// let map = Object.values(mapping)
						// if (amount === 90) map = [map[3], map[0], map[1], map[2]]
						// if (amount === 180) map = [map[2], map[3], map[0], map[1]]
						// if (amount === 270) map = [map[0], map[3], map[2], map[1]]
						// for (let j = 0; j < amount / 90; j++) {
						// 	map = [map[1], map[2], map[3], map[0]]
						// }
						// mapping = {x1: map[0], y1: map[1], x2: map[2], y2: map[3]}
						// console.log(amount, map);
						// console.log(amount, map.flatMap(a => [a.x, a.y]));
					}

					const yOffset = 1
					let yScale = 1
					if (textureSizes[face]) {
						yScale /= textureSizes[face]
					}
					// if (amount === 90 || amount === 270) {
					// 	yScale *= -1
					// 	yOffset = 0
					// }

					// geometry.attributes.uv.array[a] = map[0].x
					// geometry.attributes.uv.array[a + 1] = yOffset - map[0].y * yScale
					// geometry.attributes.uv.array[a + 2] = map[1].x
					// geometry.attributes.uv.array[a + 3] = yOffset - map[1].y * yScale
					// geometry.attributes.uv.array[a + 4] = map[2].x
					// geometry.attributes.uv.array[a + 5] = yOffset - map[2].y * yScale
					// geometry.attributes.uv.array[a + 6] = map[3].x
					// geometry.attributes.uv.array[a + 7] = yOffset - map[3].y * yScale

					geometry.attributes.uv.array[a] = uv[mapping[0].x]
					geometry.attributes.uv.array[a + 1] = yOffset - uv[mapping[0].y] * yScale
					geometry.attributes.uv.array[a + 2] = uv[mapping[1].x]
					geometry.attributes.uv.array[a + 3] = yOffset - uv[mapping[1].y] * yScale
					geometry.attributes.uv.array[a + 4] = uv[mapping[2].x]
					geometry.attributes.uv.array[a + 5] = yOffset - uv[mapping[2].y] * yScale
					geometry.attributes.uv.array[a + 6] = uv[mapping[3].x]
					geometry.attributes.uv.array[a + 7] = yOffset - uv[mapping[3].y] * yScale

					// geometry.attributes.uv.array[a] = uv[mapping.x1]
					// geometry.attributes.uv.array[a + 1] = yOffset - uv[mapping.y1] * yScale
					// geometry.attributes.uv.array[a + 2] = uv[mapping.x2]
					// geometry.attributes.uv.array[a + 3] = yOffset - uv[mapping.y1] * yScale
					// geometry.attributes.uv.array[a + 4] = uv[mapping.x1]
					// geometry.attributes.uv.array[a + 5] = yOffset - uv[mapping.y2] * yScale
					// geometry.attributes.uv.array[a + 6] = uv[mapping.x2]
					// geometry.attributes.uv.array[a + 7] = yOffset - uv[mapping.y2] * yScale

					geometry.attributes.uv.needsUpdate = true;
				}
			}

			const materialList = [
				textures.east ?? missingMaterial,
				textures.west ?? missingMaterial,
				textures.up ?? missingMaterial,
				textures.down ?? missingMaterial,
				textures.south ?? missingMaterial,
				textures.north ?? missingMaterial,
			]

			const mesh = new THREE.Mesh(geometry, materialList);
			mesh.castShadow = true
			mesh.receiveShadow = true

			const pivot = new THREE.Group();
			pivot.add(mesh);

			mesh.position.set(center.x, center.y, center.z)
			if (element.rotation) {
				const { axis, angle, rescale } = element.rotation
				let { origin } = element.rotation
				const axisB = { x: axis === 'x' ? 1 : 0, y: axis === 'y' ? 1 : 0, z: axis === 'z' ? 1 : 0 }
				origin = [origin[0] - 8, origin[1], origin[2] - 8].map(o => o / 16)
				pivot.position.set(origin[0], origin[1], origin[2])
				mesh.position.add(new THREE.Vector3(-origin[0], -origin[1], -origin[2]))
				pivot.setRotationFromAxisAngle(new THREE.Vector3(axisB.x, axisB.y, axisB.z), angle / 180 * Math.PI)

				if (rescale) {
					const bbox = new THREE.Box3().setFromObject(pivot);
					const edges = {
						x: Math.max(Math.abs(bbox.min.x), Math.abs(bbox.max.x)),
						y: Math.max(Math.abs(bbox.min.y), Math.abs(bbox.max.y)),
						z: Math.max(Math.abs(bbox.min.z), Math.abs(bbox.max.z)),
					}
					const scale = Math.max(axisB.x ? 0 : edges.x, axisB.y ? 0 : edges.y, axisB.z ? 0 : edges.z) + .5
					// const scale = (axisB.x ? edges.x : 0) + (axisB.y ? edges.y : 0) + (axisB.z ? edges.z : 0) + .5
					// const scale = new THREE.Vector3(1 / (bbox.max.x - bbox.min.x), 1 / (bbox.max.y - bbox.min.y), 1 / (bbox.max.z - bbox.min.z))
					mesh.scale.set(axisB.x ? 1 : 1 / scale, axisB.y ? 1 : 1 / scale, axisB.z ? 1 : 1 / scale)
				}
			}
			block.add(pivot)
		}

		return block
	}

	static buildStructure = async (version: string, namespace: string, name: string, model: Structure, minecraftVersion = '1.19') => {
		if (!model.blocks.length) throw 'no_blocks'
		if (model.palettes) {
			model.palette = model.palettes[Math.floor(Math.random() * model.palettes.length)]
		}
		if (!model.palette?.length) throw 'no_palette'

		const blockstates: {[key: string]: Blockstate} = {}
		const palette: (MCBlockStateModel | MCBlockStateModel[] | null)[] = new Array(model.palette.length)
		const paletteCount: number[] = new Array(model.palette.length).fill(0)
		// const uniqueModels: {[key: string]: number} = {}
		const models: {[key: string]: Group} = {}
		const instances: {[key: string]: InstancedGroupMesh} = {}

		const parent = new THREE.Group()
		parent.name = name
		parent.position.set(Math.ceil(-model.size[0]/2), 0, Math.ceil(-model.size[2]/2))

		for (const block of model.blocks) {
			paletteCount[block.state]++
		}

		// Load blockstates
		for (const mcBlock of model.palette) {
			if (!blockstates[mcBlock.Name]) {
				let id = mcBlock.Name.split(':')
				if (id.length === 1) id = ['minecraft', ...id]

				let parentVersion = version
				if (namespace !== 'minecraft' && id[0] === 'minecraft')
					parentVersion = minecraftVersion

				const path = window.joinPaths('assets', id[0], 'blockstates', id[1] + '.json')
				try {
					const { data } = await window.api.mc.getAsset(parentVersion, path)

					blockstates[mcBlock.Name] = new Blockstate(JSON.parse(data))
				} catch (e) {
					console.error(e, parentVersion, path);
				}
			}
		}

		// Populate palette
		// for (let i = 0; i < model.palette.length; i++) {
		// 	const mcBlock = model.palette[i]
		// 	const m = blockstates[mcBlock.Name].getModel(mcBlock)
		// 	palette[i] = m
		// 	if (m) {
		// 		if (uniqueModels.hasOwnProperty(i)) uniqueModels[i] += paletteCount[i]
		// 		else uniqueModels[i] = paletteCount[i]
		// 	}
		// }

		for (let i = 0; i < model.palette.length; i++) {
			const mcBlock = model.palette[i]
			const mergedModel = new THREE.Group()
			if (blockstates[mcBlock.Name]) {
				const m = blockstates[mcBlock.Name].getModel(mcBlock)
				palette[i] = m

				const modelData: { model: MCModel, namespace: string }[] = []
				const loadModel = async (m: MCBlockStateModel) => {
					const modelName = m.model
					let id = modelName.split(':')
					if (id.length === 1) id = ['minecraft', ...id]

					let parentVersion = version
					if (namespace !== 'minecraft' && id[0] === 'minecraft')
						parentVersion = minecraftVersion

					const path = window.joinPaths('assets', id[0], 'models', id[1] + '.json')
					try {
						const { data } = await window.api.mc.getAsset(parentVersion, path)
						modelData.push({
							model: JSON.parse(data),
							namespace: id[0],
						})
					} catch (e) {
						console.error(e, parentVersion, path);
					}
				}

				if (Array.isArray(m)) {
					for (const mcBlockStateModel of m) {
						await loadModel(mcBlockStateModel)
					}
				}
				else if (m) await loadModel(m)

				for (const modelD of modelData) {

					let parentVersion = version
					if (namespace !== 'minecraft' && modelD.namespace === 'minecraft')
						parentVersion = minecraftVersion

					const jsonModel = await MinecraftModel.load(parentVersion, modelD.namespace, modelD.model)
					if (jsonModel.elements && jsonModel.elements.length) {
						mergedModel.add(await MinecraftModel.build(parentVersion, modelD.namespace, mcBlock.Name, jsonModel))
					}
				}
			}
			else {
				const mesh = new THREE.Mesh(
					new THREE.BoxGeometry(1, 1, 1),
					new THREE.MeshStandardMaterial({
						color: 0xFF00FF,
					}),
				);
				mesh.castShadow = true
				mesh.receiveShadow = true
				mergedModel.add(mesh)
				console.log('no blockstate', mergedModel);
			}
			models[i] = mergedModel
			instances[i] = new InstancedGroupMesh(mergedModel, paletteCount[i])
			instances[i].castShadow = true
			instances[i].receiveShadow = true
		}

		const dummy = new THREE.Group()
		const modelCount: {[key: number]: number} = {}
		for (const block of model.blocks) {
			const p = palette[block.state]
			if (p && instances[block.state]) {
				dummy.position.set(block.pos[0], block.pos[1], block.pos[2])

				const rotEl = Array.isArray(p) ? p[0] : p
				if (!rotEl) console.log(p);
				if (rotEl.x) {
					dummy.setRotationFromAxisAngle(
						new THREE.Vector3(1, 0, 0),
						(rotEl.x-180) / 180 * Math.PI,
					)
				}
				if (rotEl.y) {
					dummy.setRotationFromAxisAngle(
						new THREE.Vector3(0, 1, 0),
						(rotEl.y-180) / 180 * Math.PI,
					)
				}

				dummy.updateMatrix()
				if (!modelCount[block.state]) modelCount[block.state] = 0

				instances[block.state].setMatrixAt(modelCount[block.state], dummy.matrix)

				modelCount[block.state]++
			}
		}

		for (const instanceKey in instances) {
			parent.add(instances[instanceKey])
		}

		return parent
	}
}
