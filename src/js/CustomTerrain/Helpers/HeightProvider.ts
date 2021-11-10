import {HeightProviderType} from "@/js/CustomTerrain/Helpers/Enum";

export default class HeightProvider {
	type: string

	constructor(type: string) {
		this.type = type
	}

	static getOrInt = (val: any) => {
		if (Number.isInteger(val)) return val as number
		else switch (val.type) {
			case HeightProviderType.CONSTANT:
				return new ConstantHeightProvider(val.value)
			case HeightProviderType.UNIFORM:
				return new UniformHeightProvider(val.value.min_inclusive, val.value.max_inclusive)
			case HeightProviderType.BIASED_TO_BOTTOM:
				return new BiasedToBottomHeightProvider(val.value.min_inclusive, val.value.max_inclusive, val.value.inner ?? 1)
			case HeightProviderType.VERY_BIASED_TO_BOTTOM:
				return new VeryBiasedToBottomHeightProvider(val.value.min_inclusive, val.value.max_inclusive, val.value.inner ?? 1)
			case HeightProviderType.TRAPEZOID:
				return new TrapezoidHeightProvider(val.value.min_inclusive, val.value.max_inclusive, val.value.plateau ?? 0)

			default:
				throw new Error('Undefined HeightProvider type: ' + val)
		}
	}

	static uniform = (min_inclusive: number, max_inclusive: number) => new UniformHeightProvider(min_inclusive, max_inclusive)
}

export class ConstantHeightProvider extends HeightProvider {
	value: VerticalAnchor | number
	constructor(value: number) {
		super(HeightProviderType.CONSTANT)
		this.value = VerticalAnchor.getOrInt(value)
	}
}
export class UniformHeightProvider extends HeightProvider {
	value: {
		min_inclusive: VerticalAnchor | number,
		max_inclusive: VerticalAnchor | number,
	}
	constructor(min_inclusive: number, max_inclusive: number) {
		super(HeightProviderType.UNIFORM)
		this.value = {
			min_inclusive: VerticalAnchor.getOrInt(min_inclusive),
			max_inclusive: VerticalAnchor.getOrInt(max_inclusive),
		}
	}
}
export class BiasedToBottomHeightProvider extends HeightProvider {
	value: {
		min_inclusive: VerticalAnchor | number,
		max_inclusive: VerticalAnchor | number,
		inner: number
	}
	constructor(min_inclusive: number, max_inclusive: number, inner: number) {
		super(HeightProviderType.BIASED_TO_BOTTOM)
		this.value = {
			min_inclusive: VerticalAnchor.getOrInt(min_inclusive),
			max_inclusive: VerticalAnchor.getOrInt(max_inclusive),
			inner: inner
		}
	}
}
export class VeryBiasedToBottomHeightProvider extends HeightProvider {
	value: {
		min_inclusive: VerticalAnchor | number,
		max_inclusive: VerticalAnchor | number,
		inner: number
	}
	constructor(min_inclusive: number, max_inclusive: number, inner: number) {
		super(HeightProviderType.VERY_BIASED_TO_BOTTOM)
		this.value = {
			min_inclusive: VerticalAnchor.getOrInt(min_inclusive),
			max_inclusive: VerticalAnchor.getOrInt(max_inclusive),
			inner: inner
		}
	}
}
export class TrapezoidHeightProvider extends HeightProvider {
	value: {
		min_inclusive: VerticalAnchor | number,
		max_inclusive: VerticalAnchor | number,
		plateau: number,
	}
	constructor(min_inclusive: number, max_inclusive: number, plateau: number) {
		super(HeightProviderType.TRAPEZOID)
		this.value = {
			min_inclusive: VerticalAnchor.getOrInt(min_inclusive),
			max_inclusive: VerticalAnchor.getOrInt(max_inclusive),
			plateau: plateau,
		}
	}
}

export class VerticalAnchor {//todo
	type: string
	value: any
	
	constructor(json: any) {
		if (json.hasOwnProperty('absolute')) {
			this.type = 'absolute'
			this.value = json.absolute
		}
		else if (json.hasOwnProperty('above_bottom')) {
			this.type = 'above_bottom'
			this.value = json.above_bottom
		}
		else if (json.hasOwnProperty('below_top')) {
			this.type = 'below_top'
			this.value = json.below_top
		}
		else throw new Error('Undefined VerticalAnchor type: ' + json)
	// 	if (json.hasOwnProperty('absolute'))
	// 		this.absolute = json.absolute
	// 	else if (json.hasOwnProperty('above_bottom'))
	// 		this.above_bottom = json.above_bottom
	// 	else if (json.hasOwnProperty('below_top'))
	// 		this.below_top = json.below_top
	}

	static getOrInt = (val: any) => Number.isInteger(val) ? val as number : new VerticalAnchor(val)
}