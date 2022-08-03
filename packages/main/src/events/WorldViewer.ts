import path from 'path';
import fs from 'fs';
import type { BrowserWindow } from 'electron';
import { app } from 'electron';
import type { BitDepth, PNGOptions } from 'pngjs';
import { PNG } from 'pngjs';
import RegionParser from '@/mcregion/RegionParser';
import type Section from '@/mcregion/Section';
import { Block } from '@/mcregion/Section';
import MCData from '@/MCData';
import { ChunkStatus } from '@/minecraft/ChunkStatus';
import { getPixels } from '@/Helper';
import Vector3 from '@/math/Vector3';
import { Heightmap } from '#type/WorldViewer/ChunkData';
import Math2 from '@/math/Math2';
import type { TopBlock } from '@/mcregion/Chunk';
import Biomes from '@/resources/BiomeColors';
import Color from '@/minecraft/Color';
import type { AdvancedProgress } from '@/models/Progress';

export enum MapChannel {
	HEIGHT,
	ID,
	WATER,
	BIOME
}

const biomeColors = new Biomes()

export const createMap = async (mainWindow: BrowserWindow, uuid: string, levelPath: string, filePath: string, progress?: AdvancedProgress) => {
	const file = path.join(path.dirname(levelPath), 'region', filePath)
	const regionName = path.basename(file, path.extname(file))

	if (progress) {
		progress.setTotal(filePath, 4 + 1024)
		progress.setItemStatus('Loading region', filePath)
	}
	console.log('Create map for region', file, uuid)

	const fileBuffer = await fs.promises.readFile(file)

	const texturePath = path.join(app.getPath('userData'), 'Data', 'Images', 'WorldViewer', uuid)

	if (!fs.existsSync(texturePath))
		await fs.promises.mkdir(texturePath, { recursive: true })

	if (progress) progress.count(filePath)

	// Image
	const mainBuffer = Buffer.alloc(2 * 512 * 512 * 4)
	const main = new Uint16Array(mainBuffer.buffer)

	// const heightBuffer = Buffer.alloc(2 * 512 * 512 * 4)
	// const height = new Uint16Array(heightBuffer.buffer)

	if (fileBuffer.length) {
		if (progress) {
			progress.setItemStatus('Parsing region', filePath)
		}
		const region = await RegionParser.parse(fileBuffer)
		const list: Block[] = []
		const waterList: Block[] = []
		const biomes: {
			x: number, z: number, biome: string
		}[] = []

		// const heights: {
		// 	x: number, z: number
		// 	MOTION_BLOCKING: number
		// 	MOTION_BLOCKING_NO_LEAVES: number
		// 	OCEAN_FLOOR: number
		// 	WORLD_SURFACE: number
		// }[] = []
		const total = region.chunkCount()
		let i = 0

		if (progress) {
			progress.setTotal(filePath, total + 4)
			progress.setItemStatus('Processing region', filePath)
		}

		for (const chunk of region.getChunks()) {
			if (chunk && !chunk.empty && chunk.data?.Status === ChunkStatus.FULL && !chunk.data.sections.every((s: Section) => s.isEmpty && !s.block_states)) {
				const chunkPos = {
					x: chunk.data.xPos * 16,
					z: chunk.data.zPos * 16,
				}
				await chunk.loadAllSections()
				await chunk.loadHeightmaps()

				// if (chunk.heightmaps) {//todo tmp?
				// 	for (let x = 0; x < 16; x++) {
				// 		for (let z = 0; z < 16; z++) {
				// 			const i = z * 16 + x
				// 			heights.push({
				// 				x: x + chunkPos.x,
				// 				z: z + chunkPos.z,
				// 				MOTION_BLOCKING: chunk.heightmaps.MOTION_BLOCKING[i],
				// 				MOTION_BLOCKING_NO_LEAVES: chunk.heightmaps.MOTION_BLOCKING_NO_LEAVES[i],
				// 				OCEAN_FLOOR: chunk.heightmaps.OCEAN_FLOOR[i],
				// 				WORLD_SURFACE: chunk.heightmaps.WORLD_SURFACE[i],
				// 			})
				// 		}
				// 	}
				// }

				let blocks = await chunk.getTopBlocks()
				let water = await chunk.getTopBlocks(Heightmap.MOTION_BLOCKING)

				for (let x = 0; x < 16; x++) {
					for (let z = 0; z < 16; z++) {
						const i = z * 16 + x
						biomes.push({
							x: x + chunkPos.x,
							z: z + chunkPos.z,
							biome: water[i].biome,
						})

						if (water[i].block.y - blocks[i].block.y > 0 && water[i].block.material === 'minecraft:water')
							water[i].block.y = water[i].block.y - blocks[i].block.y
						else
							water[i].block = new Block(x, 0, z, 'minecraft:air', {from:'noWater'})
					}
				}

				blocks = blocks.map((b: TopBlock) => {
					b.block.x += chunkPos.x
					b.block.z += chunkPos.z
					return b
				})
				water = water.map((b: TopBlock) => {
					b.block.x += chunkPos.x
					b.block.z += chunkPos.z
					return b
				})
				list.push(...blocks.map(a => a.block))
				waterList.push(...water.map(a => a.block))
			}
			else {
				const chunkLoc = [
					i % 32 + parseInt(regionName.split('.')[1]) * 32,
					Math.floor(i / 32) + parseInt(regionName.split('.')[2]) * 32,
				]
				for (let x = 0; x < 16; x++) {
					for (let z = 0; z < 16; z++) {
						const pos = {
							x: x + chunkLoc[0] * 16,
							z: z + chunkLoc[1] * 16,
						}
						list.push(new Block(pos.x, 0, pos.z, 'minecraft:air', {from:'emptyChunk'}))
						waterList.push(new Block(pos.x, 65535, pos.z, 'minecraft:air', {from:'emptyChunk'}))
						biomes.push({ ...pos, biome: 'minecraft:plains' })
					}
				}
			}

			if (progress) progress.count(filePath)
			// mainWindow.setProgressBar((i + 1) / total)
			i++
		}

		list.sort((a, b) => a.z - b.z || a.x - b.x)
		waterList.sort((a, b) => a.z - b.z || a.x - b.x)
		biomes.sort((a, b) => a.z - b.z || a.x - b.x)
		// heights.sort((a, b) => a.z - b.z || a.x - b.x)

		if (progress) progress.setItemStatus('Loading blocks', filePath)

		const blocks = await MCData.getBlockIds()

		if (progress) {
			progress.count(filePath)
			progress.setItemStatus('Processing blocks', filePath)
		}

		for (let x = 0; x < 512; x++) {
			for (let y = 0; y < 512; y++) {
				const i = x * 512 + y
				const j = i * 4
				if (list[i]) {
					if (list[i].material !== 'minecraft:air') {
						main[j + MapChannel.HEIGHT] = list[i].y//heights[i].OCEAN_FLOOR;

						main[j + MapChannel.WATER] = waterList[i].y;

						const data = blocks[list[i].material.split(':')[1]];
						if (data)
							main[j + MapChannel.ID] = data;

						main[j + MapChannel.BIOME] = biomeColors.getBiomeId(biomes[i].biome)
					}
				}

				// height[j] = heights[i].MOTION_BLOCKING
				// height[j + 1] = heights[i].MOTION_BLOCKING_NO_LEAVES
				// height[j + 2] = heights[i].OCEAN_FLOOR
				// height[j + 3] = heights[i].WORLD_SURFACE
			}
		}
		if (progress) progress.count(filePath)
	}

	if (progress) progress.setItemStatus('Saving data', filePath)

	const opt: PNGOptions = {
		width: 512,
		height: 512,
		bitDepth: 16,
		colorType: 6,
		inputColorType: 6,
		inputHasAlpha: true,
	}
	const mainPng = new PNG(opt)
	// const png = new PNG(opt)


	// const allHeight = fs.createWriteStream(path.join(texturePath, regionName + '_heightmaps.png'));
	// png.data = heightBuffer;
	// png.pack().pipe(allHeight)
	// 	.on('close', () => {
	const all = fs.createWriteStream(path.join(texturePath, regionName + '.png'));
	mainPng.data = mainBuffer
	mainPng.pack().pipe(all)
		.on('close', () => {
			if (progress) progress.finish(filePath)
			// mainWindow.setProgressBar(-1)
			return path.join(filePath, regionName + '.png')
		})
		// })
}

export const calcMaps = async (filePath: string, progress?: AdvancedProgress) => {
	const filePaths = ['color', 'normal', 'height', 'waterColor', 'waterFogColor'].map(name =>
		({
			name,
			path: path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + `_${name}.png`),
		}),
	)

	const key = path.basename(filePath).replace('.png', '.mca')

	if (progress) {
		progress.setTotal(key, 5)
		progress.setItemStatus('Finding rendered tiles', key)
	}

	// If rendered, return passes
	if (filePaths.every(p => fs.existsSync(p.path))) {
		const images: {[key: string]: Uint8Array | Uint16Array} = {}
		try {
			for (const p of filePaths) {
				images[p.name] = (await getPixels(p.path, p.name === 'height' ? 16 : 8)).data.filter((a, i) => p.name === 'height' ? i % 4 === 0 : 1)
			}
			if (progress) progress.finish(key)
			return images
		} catch (e) {
			console.error('error while loading rendered tile', key, e)
		}
	}
	if (progress) {
		progress.count(key)
		// progress.setTotal(key, 5)// + 512^2
		progress.setItemStatus('Loading data', key)
	}

	const img = await getPixels(filePath, 16)

	if (progress) {
		progress.count(key)
		progress.setItemStatus('Loading block data', key)
	}

	const color: number[] = []
	const height: number[] = []
	const normal: number[] = []
	const waterColor: number[] = []
	const waterFogColor: number[] = []

	const heightBuffer = Buffer.alloc(2 * 512 * 512 * 4)
	const heightImg = new Uint16Array(heightBuffer.buffer)

	const blockColors = await MCData.getBlockColors()
	const blockIds = Object.entries(await MCData.getBlockIds());
	const missing: (string | number)[] = []

	if (progress) {
		progress.count(key)
		progress.setItemStatus('Processing blocks', key)
	}

	for (let x = 0; x < 512; x++) {
		for (let y = 0; y < 512; y++) {
			const i = x * 512 + y
			const j = i * 4

			height[i] = heightImg[j] = img.data[j + MapChannel.HEIGHT]
			heightImg[j + 1] = img.data[j + MapChannel.WATER]
			heightImg[j + 2] = img.data[j + MapChannel.BIOME]
			heightImg[j + 3] = 65535

			let c: { rgba: number[]; tint: boolean, name?: string } = { rgba: [255, 0, 255, 255], tint: false }

			const blockId = img.data[j + MapChannel.ID]
			const block = blockIds.find(b => b[1] === blockId)
			if (blockId === 0) {
				c = { rgba: [0, 0, 0, 0], tint: false }
			}
			else if (block) {
				const name = block[0]
				if (blockColors[name]) {
					c = {...blockColors[name], name}
				}
				else if (!missing.includes(name)) missing.push(name)
			}
			else if (!missing.includes(blockId)) missing.push(blockId)

			const biome = biomeColors.getBiomeById(img.data[j + MapChannel.BIOME])
			if (c.tint && c.name) {
				c.rgba = MCData.getBiomeColoredByName(c.rgba, c.name, biome)
			}

			color[j] = c.rgba[0]
			color[j + 1] = c.rgba[1]
			color[j + 2] = c.rgba[2]
			color[j + 3] = 255

			const colors = biomeColors.getBiomeColors(biome)
			if (colors) {
				const h = [
					Math2.clamp(img.data[j + MapChannel.WATER], 0, 255),
					img.data[j + MapChannel.WATER] > 255 ? img.data[j + MapChannel.WATER] - 255 : 0,
				]
				const waterC = Color.fromInt(colors.water_color).multiply(Color.fromArray(blockColors.water.rgba))
				waterColor[j] = waterC.r
				waterColor[j + 1] = waterC.g
				waterColor[j + 2] = waterC.b
				waterColor[j + 3] = h[0]
				const waterFogC = Color.fromInt(colors.water_fog_color)
				waterFogColor[j] = waterFogC.r
				waterFogColor[j + 1] = waterFogC.g
				waterFogColor[j + 2] = waterFogC.b
				waterFogColor[j + 3] = h[1]
			}
			else waterColor[j] = waterColor[j + 1] = waterColor[j + 2] = waterColor[j + 3] =
					waterFogColor[j] = waterFogColor[j + 1] = waterFogColor[j + 2] = waterFogColor[j + 3] = 0;

			// if (progress) progress.count(key)
		}
	}

	if (missing.length)
		console.log('Missing blocks', missing);

	if (progress) {
		progress.setItemStatus('Creating normal map', key)
	}

	// Normal Map
	for (let x = 0; x < 512; x++) {
		for (let y = 0; y < 512; y++) {
			const pixel = (x: number, y: number) => (Math2.clamp(x, 0, 511) * 512 + Math2.clamp(y, 0, 511)) //* 4

			// const p0 = height[pixel(x, y)]
			// const px = height[pixel(x + 1, y)]
			// const py = height[pixel(x, y + 1)]
			//
			// const pixelScale = 1
			// const dx = new Vector3(pixelScale, 0, px - p0)
			// const dy = new Vector3(0, pixelScale, py - p0)
			//
			// const n = dx.cross(dy).normalize().multiply(.5).add(.5).multiply(255)

			const gradientLeft = new Vector3(
				-1 / 511,
				0,
				height[pixel(x - 1, y)] - height[pixel(x, y)],
			)
			const gradientRight = new Vector3(
				1 / 511,
				0,
				height[pixel(x + 1, y)] - height[pixel(x, y)],
			)
			const gradientBottom = new Vector3(
				0,
				-1 / 511,
				height[pixel(x, y - 1)] - height[pixel(x, y)],
			)
			const gradientTop = new Vector3(
				0,
				1 / 511,
				height[pixel(x, y + 1)] - height[pixel(x, y)],
			)

			const vectorProduct = (a: Vector3, b: Vector3) => new Vector3(
				(a.y * b.z) - (b.y * a.z),
				-((a.x * b.z) - (b.x * a.z)),
				(a.x * b.y) - (b.x * a.y),
			)
			const left = vectorProduct(gradientLeft, gradientBottom)
			const right = vectorProduct(gradientRight, gradientTop)
			const bottom = vectorProduct(gradientRight, gradientBottom)
			const top = vectorProduct(gradientRight, gradientTop)

			const blend = left.add(right).add(bottom).add(top)
			const length = Math.sqrt(Math.pow(blend.x, 2) + Math.pow(blend.y, 2) + Math.pow(blend.z, 2))
			const n = blend.divide(length).multiply(new Vector3(-1, 1, 1)).multiply(.5).add(.5).multiply(255)

			const i = x * 512 + y
			const j = i * 4
			normal[j] = n.x
			normal[j + 1] = n.y
			normal[j + 2] = n.z
			normal[j + 3] = 255
		}
	}

	if (progress) {
		progress.count(key)
		progress.setItemStatus('Saving maps', key)
	}

	// const heightPng = new PNG({
	// 	width: 512,
	// 	height: 512,
	// 	bitDepth: 16,
	// 	colorType: 6,
	// 	inputColorType: 6,
	// 	inputHasAlpha: true,
	// })
	// const allHeight = fs.createWriteStream(path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + '_height.png'));
	// heightPng.data = heightBuffer;
	// heightPng.pack().pipe(allHeight)
	//
	const savePNG = (name: string, buffer: number[] | Buffer, bitDepth: BitDepth = 8) => {
		const imgPath = fs.createWriteStream(path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + `_${name}.png`));
		const img = new PNG({
			width: 512,
			height: 512,
			bitDepth,
			colorType: 6,
			inputColorType: 6,
			inputHasAlpha: true,
		})
		img.data = Buffer.from(buffer)
		img.pack().pipe(imgPath)
	}

	savePNG('color', color)
	savePNG('normal', normal)
	savePNG('height', heightBuffer, 16)
	savePNG('waterColor', waterColor)
	savePNG('waterFogColor', waterFogColor)

	if (progress) progress.count(key)

	return {
		color, height: heightImg, normal, waterColor, waterFogColor,
	}

	// const heightmap = chroma.scale('Spectral')
	// const blocks = minecraftData('1.18.2').blocks
	// const missing = []
	// const lighting = this.lighting ? await Fake3D.heightmapLight(d, 0, new Vector(-15, 75)) : []
	// // const copy = [...lighting].sort((a, b) => a - b)
	// // console.log(copy[0], copy[copy.length - copy.length/2], copy[copy.length - 1])
	//
	// for (let x = 0; x < 512; x++) {
	// 	for (let y = 0; y < 512; y++) {
	// 		const i = x * 512 + y
	// 		const j = i * 4
	// 		let color = [255, 0, 255]
	// 		if (this.type === 'heightmap') {
	// 			color = heightmap(d[j] / 255).rgb()
	// 		}
	// 		else if (this.type === 'blocks') {
	// 			const blockId = d[j + 1] * 256 + d[j + 2]
	// 			const block = blocks[blockId]
	// 			if (block) {
	// 				const name = MCData.getGenericName(block.name)
	// 				if (MCData.blockColors[name]) {
	// 					color = MCData.blockColors[name]
	// 				}
	// 				else if (!missing.includes(name)) {
	// 					missing.push(name)
	// 				}
	// 			}
	// 			else
	// 				missing.push(blockId)
	// 		}
	//
	// 		const light = [0, 0, 0]
	// 		if (this.lighting) {
	// 			const highlightMult = .5
	// 			const shadowMult = .3
	//
	// 			if (lighting[i].x > 0)
	// 				light[0] = lighting[i].x * 255 * highlightMult
	// 			else if (!isNaN(lighting[i].x)) {
	// 				light[0] = lighting[i].x * 255 * shadowMult
	// 			}
	// 			if (lighting[i].y > 0)
	// 				light[1] = lighting[i].y * 255 * highlightMult
	// 			else if (!isNaN(lighting[i].y))
	// 				light[1] = lighting[i].y * 255 * shadowMult
	//
	// 			if (lighting[i].z > 0)
	// 				light[2] = lighting[i].z * 255 * highlightMult
	// 			else if (!isNaN(lighting[i].z))
	// 				light[2] = lighting[i].z * 255 * shadowMult
	// 		}
	//
	// 		d[j] = color[0] + light[0]
	// 		d[j + 1] = color[1] + light[1]
	// 		d[j + 2] = color[2] + light[2]
	// 	}
	// }
	//
	// if (missing.length)
	// 	console.log(missing)
	//
	// ctx.putImageData(data, 0, 0)
}
