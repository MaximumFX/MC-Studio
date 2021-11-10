import {FloatProviderType} from "@/js/CustomTerrain/Helpers/Enum";

export default class FloatProvider {
	type: string

	constructor(type: string) {
		this.type = type
	}

	static getOrFloat = (val: any) => {
		if (Number.isInteger(val)) return val as number
		else if (val.type === FloatProviderType.CONSTANT) {
			return new ConstantFloatProvider(val.value)
		}
		else if (val.type === FloatProviderType.UNIFORM) {
			return new UniformFloatProvider(val.value.min_inclusive, val.value.max_inclusive)
		}
		else if (val.type === FloatProviderType.CLAMPED_NORMAL) {
			return new ClampedNormalFloatProvider(val)
		}
		else if (val.type === FloatProviderType.TRAPEZOID) {
			return new TrapezoidFloatProvider(val)
		}
		else throw new Error('Undefined FloatProvider type: ' + val)
	}
}

export class ConstantFloatProvider extends FloatProvider {
	value: number
	constructor(value: number) {
		super(FloatProviderType.CONSTANT)
		this.value = value
	}
}
export class UniformFloatProvider extends FloatProvider {
	value: {
		min_inclusive: number,
		max_inclusive: number,
	}
	constructor(min_inclusive: number, max_inclusive: number) {
		super(FloatProviderType.UNIFORM)
		this.value = {
			min_inclusive: min_inclusive,//TODO obj with absolute or above_bottom or below_top
			max_inclusive: max_inclusive,
		}
	}
}
export class ClampedNormalFloatProvider extends FloatProvider {
	value: {
		mean: number,
		deviation: number,
		min: number,
		max: number,
	}
	constructor(json: ClampedNormalFloatProvider) {
		super(FloatProviderType.CLAMPED_NORMAL)
		this.value = {
			mean: json.value.mean,
			deviation: json.value.deviation,
			min: json.value.min,
			max: json.value.max,
		}
	}
}
export class TrapezoidFloatProvider extends FloatProvider {
	value: {
		min: number,
		max: number,
		plateau: number,
	}
	constructor(json: TrapezoidFloatProvider) {
		super(FloatProviderType.TRAPEZOID)
		this.value = {
			min: json.value.min,
			max: json.value.max,
			plateau: json.value.plateau,
		}
	}
}