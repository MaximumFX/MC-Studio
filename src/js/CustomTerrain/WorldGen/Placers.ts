export class Placer {
	constructor() {}
}

interface BlockPlacerJSON {
	type: string
	min_size?: number
	extra_size?: number
}
export class BlockPlacer extends Placer implements BlockPlacerJSON {
	type: string
	min_size?: number
	extra_size?: number

	constructor(json: BlockPlacerJSON) {
		super()
		this.type = json.type

		if (this.type.includes('column_placer')) {
			this.min_size = json.min_size
			this.extra_size = json.extra_size
		}
	}
}