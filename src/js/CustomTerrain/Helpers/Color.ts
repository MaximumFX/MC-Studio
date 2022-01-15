interface ColorInterface {
	decimal: number | undefined
	hex: string | undefined
}

export default class Color {
	decimal: number | undefined
	hex: string | undefined
	constructor(options: ColorInterface = {decimal: undefined, hex: undefined}) {
		this.decimal = options.decimal
		this.hex = options.hex?.padStart(6, '0')
	}

	getHex = () => '#' + this.hex

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

	// Formatting
	toJSON = () => this.decimal
}
