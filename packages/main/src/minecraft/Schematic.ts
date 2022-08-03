import Structure from './Structure';
import type { MCBlockInterface } from './Block';
import MCBlock from './Block';

export default class Schematic {
	BlockData: number[]
	BlockEntities: any[]
	DataVersion: number
	Height: number
	Length: number
	Metadata?: {
		WEOffsetX?: number
		WEOffsetY?: number
		WEOffsetZ?: number
	}
	Offset: [number, number, number]
	Palette: {
		[key: string]: number
	}
	PaletteMax: number
	Version: number
	Width: number

	constructor(data: Schematic) {
		this.BlockData = data.BlockData
		this.BlockEntities = data.BlockEntities
		this.DataVersion = data.DataVersion
		this.Height = data.Height
		this.Length = data.Length
		this.Metadata = data.Metadata
		this.Offset = data.Offset
		this.Palette = data.Palette
		this.PaletteMax = data.PaletteMax
		this.Version = data.Version
		this.Width = data.Width
	}

	asStructure = () => {
		console.log('asStructure', this);
		const blocks: {
			pos: [number, number, number]
			state: number
		}[] = []
		const palette: MCBlock[] = new Array(this.PaletteMax)

		Object.entries(this.Palette).forEach(p => {
			if (p[0].includes('[')) {
				const block: MCBlockInterface = {
					Name: p[0].split('[')[0],
					Properties: {},
				}
				const properties = p[0].split('[')[1].slice(0, -1).split(',')
				for (const property of properties) {
					const prop = property.split('=')
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					block.Properties[prop[0]] = prop[1]
				}
				palette[p[1]] = new MCBlock(block)
			}
			else palette[p[1]] = new MCBlock({ Name: p[0] })
		})

		for (let x = 0; x < this.Width; x++) {
			for (let y = 0; y < this.Height; y++) {
				for (let z = 0; z < this.Length; z++) {
					let state = this.BlockData[((y * this.Length) + z) * this.Width + x]
					if (state < 0) state += palette.length
					blocks.push({
						pos: [x, y, z],
						state,
					})
				}
			}
		}

		return new Structure({
			DataVersion: this.DataVersion,
			blocks,
			entities: [],//todo support entities
			palette,
			size: [ this.Width, this.Height, this.Length ],
		})
	}
}
