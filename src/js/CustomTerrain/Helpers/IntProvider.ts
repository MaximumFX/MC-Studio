import {IntProviderType} from "@/js/CustomTerrain/Helpers/Enum";

//todo type is IntProvider | number

export default class IntProvider {
	type: IntProviderType

	constructor(type: IntProviderType) {
		this.type = type
	}

	static getOrInt = (val: any) => {
		if (Number.isInteger(val)) return val as number
		else if (val.type === IntProviderType.CONSTANT) {
			return new ConstantIntProvider(val.value)
		}
		else if (val.type === IntProviderType.UNIFORM) {
			return new UniformIntProvider(val.value.min_inclusive, val.value.max_inclusive)
		}
		else if (val.type === IntProviderType.BIASED_TO_BOTTOM) {
			return new BiasedToBottomIntProvider(val.value.min_inclusive, val.value.max_inclusive)
		}
		else if (val.type === IntProviderType.CLAMPED) {
			return new ClampedIntProvider(val.value.min_inclusive, val.value.max_inclusive, new IntProvider(val.value.source))
		}
		else throw new Error('Undefined IntProvider type: ' + val)
	}

	static uniform = (min_inclusive: number, max_inclusive: number) => new UniformIntProvider(min_inclusive, max_inclusive)
}

export class ConstantIntProvider extends IntProvider {
	value: number
	constructor(value: number) {
		super(IntProviderType.CONSTANT)
		this.value = value
	}
}
export class UniformIntProvider extends IntProvider {
	value: {
		min_inclusive: number,
		max_inclusive: number,
	}
	constructor(min_inclusive: number, max_inclusive: number) {
		super(IntProviderType.UNIFORM)
		this.value = {
			min_inclusive: min_inclusive,
			max_inclusive: max_inclusive,
		}
	}
}
export class BiasedToBottomIntProvider extends IntProvider {
	value: {
		min_inclusive: number,
		max_inclusive: number,
	}
	constructor(min_inclusive: number, max_inclusive: number) {
		super(IntProviderType.BIASED_TO_BOTTOM)
		this.value = {
			min_inclusive: min_inclusive,
			max_inclusive: max_inclusive,
		}
	}
}
export class ClampedIntProvider extends IntProvider {
	value: {
		min_inclusive: number,
		max_inclusive: number,
		source: IntProvider,
	}
	constructor(min_inclusive: number, max_inclusive: number, source: IntProvider) {
		super(IntProviderType.CLAMPED)
		this.value = {
			min_inclusive: min_inclusive,
			max_inclusive: max_inclusive,
			source: source,
		}
	}
}