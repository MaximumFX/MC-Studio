import Math2 from '@/math/Math2';

export default class PNGReader {
	data: Uint8Array | Uint16Array
	alpha: boolean
	width: number
	height: number

	constructor(data: Uint8Array | Uint16Array, alpha = true, width?: number, height?: number) {
		this.data = data
		this.alpha = alpha

		if (width && height) {
			this.width = width
			this.height = height
		}
		else {
			this.width = this.height = Math.round(Math.sqrt(data.length / (alpha ? 4 : 3)))
		}
	}

	getPixel = (x: number, y: number, relative = false) => {
		if (relative) {
			x = Math.round(x * this.width)
			y = Math.round(y * this.height)
		}
		const i = (Math2.clamp(x, 0, this.width - 1) + Math2.clamp(y, 0, this.height - 1) * this.height) * (this.alpha ? 4 : 3)
		return [
			this.data[i],
			this.data[i + 1],
			this.data[i + 2],
			...this.alpha ? [this.data[i + 3]] : [],
		]
	}
}
