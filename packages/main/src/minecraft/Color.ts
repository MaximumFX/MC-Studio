import Vector3 from '@/math/Vector3';

export default class Color {
	r: number
	g: number
	b: number

	constructor(r = 0, g = 0, b = 0) {
		this.r = r
		this.g = g
		this.b = b
	}

	static fromInt = (color: number) => {
		const red = (color >> 16) & 0xFF
		const green = (color >> 8) & 0xFF
		const blue = color & 0xFF

		return new Color(red, green, blue)
	}
	asInt = () => ((this.r & 0x0ff) << 16) | ((this.g & 0x0ff) << 8) | (this.b & 0x0ff)

	static fromArray = (color: number[]) => new Color(color[0], color[1], color[2])
	asArray = (withAlpha = false) => [this.r, this.g, this.b, ...withAlpha ? [255] : []]

	asVector = () => new Vector3(this.r, this.g, this.b)

	static fromHex = (hex: string) => {
		const res = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,
			(m, r, g, b) => '#' + r + r + g + g + b + b)
		if (res !== null) {
			const color = res.substring(1).match(/.{2}/g)?.map(x => parseInt(x, 16)) ?? [0, 0, 0]
			return new Color(color[0], color[1], color[2])
		}
		return null
	}
	asHex = () => '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)

	multiply = (other: Color | number) => {
		if (other instanceof Color)
			return new Color(this.r * other.r / 255, this.g * other.g / 255, this.b * other.b / 255)
		else
			return new Color(this.r * other / 255, this.g * other / 255, this.b * other / 255)
	}
}
