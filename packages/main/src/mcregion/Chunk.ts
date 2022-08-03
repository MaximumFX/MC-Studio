import zlib from 'zlib';
import { parse } from 'prismarine-nbt';
import { deconstructNBT } from '@/Helper';
import Section, { Block } from './Section';
import MCData from '@/MCData';
import type { ChunkData, MCChunkData, MCSection } from '#type/WorldViewer/ChunkData';
import { Heightmap } from '#type/WorldViewer/ChunkData';
import { ChunkStatus } from '@/minecraft/ChunkStatus';

export interface TopBlock {
	block: Block
	biome: string
}
/**
 * Chunk Class
 * @param {Buffer} buffer the original chunk buffer data
 * @constructor
 * @refer http://minecraft.gamepedia.com/Chunk_format
 */
export default class Chunk {
	empty: boolean
	chunkTags: any
	data?: ChunkData

	heightmaps?: {
		MOTION_BLOCKING: number[]
		MOTION_BLOCKING_NO_LEAVES: number[]
		OCEAN_FLOOR: number[]
		WORLD_SURFACE: number[]
	}

	#buffer?: Buffer
	#original: {
		buffer: Buffer
		dataLength: number
		compressionType: number
	}

	constructor(buffer: Buffer) {
		// ## Original Buffer Structure
		//
		// | byte        | 0  | 1  | 2  | 3  | 4                | 5                                  |
		// |-------------|-------------------|------------------|------------------------------------|
		// | description | length (in bytes) | compression type | compressed data (length - 1 bytes) |
		//
		// There are currently two defined compression schemes:
		//
		// | value | method                               |
		// |-------|--------------------------------------|
		// | 1     | GZip (RFC1952) (unused in practice ) |
		// | 2     | Zlib (RFC1950)                       |
		//
		// The uncompressed data is in NBT format and follows the information detailed on the
		// Chunk format article; if compressed with compression scheme 1, the compressed data
		// would be the same as the on-disk content of an Alpha chunk file. Note that chunks
		// will always be saved using compression scheme 2 by the official client.
		this.#original = {
			buffer: buffer,
			dataLength: buffer.length ? buffer.readUInt32BE(0) : 0,
			compressionType: buffer.length ? buffer.readUInt8(4) : 0,
		}

		this.empty = !buffer.length
		this.chunkTags = null
	}


	/**
	 * get NBT
	 * @return {NBT} nbt object
	 */
	getNBT = () => this.chunkTags


	loadAllSections = async () => {
		if (this.data && this.data.Status === ChunkStatus.FULL) {
			for (const s of this.data.sections) {
				await s.loadBlocks()
				await s.loadBiomes()
			}
		}
	}

	loadHeightmaps = async () => {
		if (this.data) {
			const maps: {
				MOTION_BLOCKING: number[]
				MOTION_BLOCKING_NO_LEAVES: number[]
				OCEAN_FLOOR: number[]
				WORLD_SURFACE: number[]
			} = {
				MOTION_BLOCKING: [],
				MOTION_BLOCKING_NO_LEAVES: [],
				OCEAN_FLOOR: [],
				WORLD_SURFACE: [],
			}

			const bits = 9
			const bitMask = BigInt(Math.pow(2, bits) - 1)
			const perLong = 7

			Object.keys(maps).forEach(map => {
				let i = 0
				let data = BigInt(0)
				for (let j = 0; j < 256; j += 1) {
					if (j % perLong === 0) {
						data = (this.data.Heightmaps[map][i])
						i += 1
					}
					maps[map][j] = Number((data >> BigInt(bits * (j % perLong))) & bitMask)
				}
			})

			this.heightmaps = maps
		}
	}

	getTopBlocks = (heightmap = Heightmap.OCEAN_FLOOR): Promise<TopBlock[]> => new Promise((resolve, reject) => {
		if (this.data) {
			const topBlocks = new Array(256).fill(null)
			// let found = 0;

			if (this.data.sections && this.heightmaps) {
				const map = this.heightmaps[heightmap]

				for (let x = 0; x < 16; x++) {
					for (let z = 0; z < 16; z++) {
						const i = z * 16 + x
						const y = map[i] - 65
						const sectionY = Math.floor(y / 16)
						const section = this.data.sections.find(s => s.Y === sectionY)
						if (section) {
							if (section.getBiome(x, y, z)) console.log(x, z, section.getBiome(x, y, z));
							topBlocks[i] = {
								block: section.getBlock(x, y, z),
								biome: section.getBiome(x, y, z)?.biome ?? 'minecraft:the_void',
							}
						}
						else
							topBlocks[i] = {
								block: new Block(x, y, z, 'minecraft:bedrock', {from:'noBlockFound'}),
								biome: 'minecraft:the_void',
							}
					}
				}
				resolve(topBlocks)
				return
			}
			else reject('missing_data')

			// if (this.data.sections && this.data.sections.every((s: Section) => s.isEmpty)) {
			// 	for (let x = 0; x < 16; x++) {
			// 		for (let z = 0; z < 16; z++) {
			// 			const i = x * 16 + z
			// 			topBlocks[i] = new Block(x, 0, z, 'minecraft:air', {from:'emptySection'})
			// 		}
			// 	}
			// 	resolve(topBlocks)
			// 	return
			// }

			// if (this.data.sections.length === 0) {
			// 	for (let x = 0; x < 16; x++) {
			// 		for (let z = 0; z < 16; z++) {
			// 			const i = x * 16 + z
			// 			topBlocks[i] = new Block(x, 0, z, 'minecraft:air', {from:'emptySection'})
			// 		}
			// 	}
			// 	resolve(topBlocks)
			// 	return
			// }
			// else [...this.data.sections].sort((a, b) => b.Y - a.Y).forEach(section => {
			// 	if (!section.isEmpty) {
			// 		const yOffset = section.Y * 16 //- minY
			// 		for (let x = 0; x < 16; x++) {
			// 			for (let y = 0; y < 16; y++) {
			// 				for (let z = 0; z < 16; z++) {
			// 					const b = section.getBlock(x, yOffset + (16 - y), z)
			// 					if (b) {
			// 						const i = x * 16 + z
			// 						if (topBlocks[i] === null && !MCData.air.includes(b.material)) {
			// 							topBlocks[i] = b
			// 							found++
			// 						}
			// 					}
			// 					if (found === 256) {
			// 						resolve(topBlocks)
			// 						return
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// 	// else {
			// 	// 	for (let x = 0; x < 16; x++) {
			// 	// 		for (let z = 0; z < 16; z++) {
			// 	// 			const i = x * 16 + z
			// 	// 			topBlocks[i] = new Block(x, 0, z, 'minecraft:air', {from:'emptySection'})
			// 	// 			found++
			// 	// 			if (found === 256) {
			// 	// 				resolve(topBlocks)
			// 	// 				return
			// 	// 			}
			// 	// 		}
			// 	// 	}
			// 	// }
			// })
		}
		else {
			console.error('getTopBlocks with no data')
			reject('getTopBlocks with no data')
		}
	})


	/**
	 * parse this chunk
	 * @param {Function} callback the callback function
	 */
	parse = (): Promise<void> => new Promise((resolve, reject) => {
		if (this.empty) resolve()

		if (this.#original.compressionType !== 2) {
			reject('This compression type is unused in practice yet.')
		}

		// unzip first...
		const body = this.#original.buffer.slice(5)
		zlib.unzip(body, (err, buffer) => {
			if (err) return reject(err)
			this.#buffer = buffer
			this.parseBody().then(() => resolve())
		})
	})

	/**
	 * parse chunk body (private)
	 * @param {Function} callback the callback function
	 */
	private parseBody = (): Promise<void> => new Promise((resolve, reject) => {
		if (this.#buffer)
			parse(this.#buffer)
				.catch(e => reject(e))
				.then(res => {
					if (res) {
						this.chunkTags = res.parsed

						let decon = deconstructNBT(res.parsed)
						if (decon.hasOwnProperty('Level')) {
							const tmp = {
								...decon.Level,
								sections: decon.Level.Sections,
								structures: {
									References: decon.Level.Structures.References,
									starts: decon.Level.Structures.Starts,
								},
							}
							delete tmp.Sections
							delete tmp.Structures

							decon = tmp
						}

						const data = decon as MCChunkData

						let sections: Section[] = []
						if (data.sections)
							sections = data.sections.map((s: MCSection) => new Section(s))

						this.data = {
							...data,
							sections,
						}

						resolve()
					}
					else reject()
				})
		else reject()
	})
}
