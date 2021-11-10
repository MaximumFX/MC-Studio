interface ColorInterface {
	decimal: number
	hex: string
}

export default class Color {
	decimal: number
	hex: string
	constructor(options: ColorInterface) {
		this.decimal = options.decimal
		this.hex = options.hex.padStart(6, '0')
	}

	static fromDecimal(decimal: number) {
		return new Color({
			decimal,
			hex: decimal.toString(16)
		})
	}

	static fromHex(hex: string) {
		return new Color({
			hex,
			decimal: parseInt(hex, 16)
		})
	}
}