import type MCBlock from '@/minecraft/Block';
import type { MCSection } from '#type/WorldViewer/ChunkData';

export interface ChunkBiome {
	x: number
	y: number
	z: number
	biome: string
}

export default class Section {
	Y: number
	block_states?: {
		palette: MCBlock[]
		data?: bigint[]
	}
	biomes: {
		palette: string[]
		data?: bigint[]
	}
	BlockLight?: number[]
	SkyLight?: number[]

	isEmpty: boolean

	private blocks: Block[] = []
	private chunkBiomes: ChunkBiome[] = []

	constructor(props: MCSection) {
		this.Y = props.Y ?? -4
		this.block_states = props.block_states
		this.biomes = props.biomes
		this.BlockLight = props.BlockLight
		this.SkyLight = props.SkyLight

		this.isEmpty = !props.hasOwnProperty('block_states') || !props.block_states.hasOwnProperty('data')
	}

	/**
	 * Converts an array of Blockstate Longs to Palette indices
	 * @param blockstates: A list of Longs
	 * @type blockstates: list
	 * @return: A list of Palette indices
	 * @rtype: list
	 * @source: https://gist.github.com/Podshot/537e5e8f12fd580bdf1f705eb2b19119
	 */
	loadBlocks = () => new Promise(resolve => {
		const return_value = []

		const yOffset = this.Y * 16 //- minY

		if (this.block_states) {
			const palette = this.block_states.palette ?? []
			const blockStates = this.block_states.data

			if (blockStates && palette.length) {
				const bits = Math.max(4, Math.ceil(Math.log2(palette.length)))
				const bitMask = BigInt(Math.pow(2, bits) - 1)
				const perLong = Math.floor(64 / bits)

				let i = 0
				let data = BigInt(0)
				for (let j = 0; j < 4096; j ++) {
					if (j % perLong === 0) {
						data = blockStates[i]
						i += 1
					}
					const index = Number((data >> BigInt(bits * (j % perLong))) & bitMask)
					const state = palette[index]
					if (state) {
						const pos: [number, number, number] = [j & 0xF, yOffset + (j >> 8), (j >> 4) & 0xF]
						return_value.push(new Block(pos[0], pos[1], pos[2], state.Name, state.Properties))
					}
				}
			}
			else
				for (let yi = 0; yi < 16; yi++) {
					for (let zi = 0; zi < 16; zi++) {
						for (let xi = 0; xi < 16; xi++) {
							let block: MCBlock = { Name: 'minecraft:air' }
							if (palette.length) block = palette[0]
							return_value.push(new Block(xi, yi + yOffset, zi, block.Name, block.Properties))
						}
					}
				}
		}
		this.blocks = return_value
		resolve(return_value)
	})

	loadBiomes = () => new Promise(resolve => {
		const return_value: ChunkBiome[] = []

		const yOffset = this.Y * 16 //- minY

		if (this.biomes) {
			const palette = this.biomes.palette ?? []
			const biomes = this.biomes.data

			if (biomes && palette.length > 1) {
				const bits = Math.ceil(Math.log2(palette.length))
				const bitMask = BigInt(Math.pow(2, bits) - 1)
				const perLong = Math.floor(64 / bits)

				let i = 0
				let data = BigInt(0)
				for (let j = 0; j < 64; j++) {
					if (j % perLong === 0) {
						data = biomes[i]
						i += 1
					}
					const index = Number((data >> BigInt(bits * (j % perLong))) & bitMask)
					const biome = palette[index]
					if (biome) {
						// const pos: [number, number, number] = [j & 0xF, yOffset + (j >> 8), (j >> 4) & 0xF]
						const pos = [Math.round(j / 8), 0, j % 8]
						return_value.push({
							x: pos[0], y: pos[1], z: pos[2], biome,
						})
					}
				}
			}
			else
			// 	for (let yi = 0; yi < 16; yi++) {
					for (let zi = 0; zi < 16; zi++) {
						for (let xi = 0; xi < 16; xi++) {
							let biome = 'minecraft:plains'
							if (palette.length) biome = palette[0]
							return_value.push({
								x: xi, y: yOffset, z: zi, biome,
							});
						}
					}
				// }
		}

		this.chunkBiomes = return_value
		resolve(return_value)
	})

	getBlock = (x: number, y: number, z: number): Block | undefined => this.blocks.find(b => b.x === x && b.y === y && b.z === z)
	getBiome = (x: number, y: number, z: number): ChunkBiome | undefined => this.chunkBiomes.find(b => b.x === Math.floor(x / 2) && b.z === Math.floor(z / 2))
}

export class Block {
	x: number
	y: number
	z: number
	material: string
	state?: any

	constructor(x: number, y: number, z: number, material: string, state?: any) {
		this.x = x
		this.y = y
		this.z = z
		this.material = material
		this.state = state
	}

}
