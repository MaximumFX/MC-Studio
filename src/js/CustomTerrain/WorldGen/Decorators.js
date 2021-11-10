import IntProvider from "@/js/CustomTerrain/Helpers/IntProvider";
import HeightProvider from "@/js/CustomTerrain/Helpers/HeightProvider";

export class Decorator {
	constructor(json = {}) {
		this.type = json.type
	}

	static getDecorator(json = {}) {
		if (!(json instanceof Object)) {
			console.error('Decorator is not an object:', json)
			return json
		}

		if (!json.type.includes(':')) json.type = 'minecraft:' + json.type

		if (json.type === 'minecraft:carving_mask') {
			return new CarvingMask(json)
		}
		else if (json.type === 'minecraft:cave_surface') {
			return new CaveSurface(json)
		}
		else if (json.type === 'minecraft:chance') {
			return new Chance(json)
		}
		else if (json.type === 'minecraft:count') {
			return new Count(json)
		}
		else if (json.type === 'minecraft:count_extra') {
			return new CountExtra(json)
		}
		else if (json.type === 'minecraft:count_multilayer') {
			return new CountMultilayer(json)
		}
		else if (json.type === 'minecraft:count_noise') {
			return new CountNoise(json)
		}
		else if (json.type === 'minecraft:count_noise_biased') {
			return new CountNoiseBiased(json)
		}
		else if (json.type === 'minecraft:dark_oak_tree') {
			return new DarkOakTree(json)
		}
		else if (json.type === 'minecraft:decorated') {
			return new Decorated(json)
		}
		else if (json.type === 'minecraft:end_gateway') {
			return new EndGateway(json)
		}
		else if (json.type === 'minecraft:heightmap') {
			return new Heightmap(json)
		}
		else if (json.type === 'minecraft:heightmap_spread_double') {
			return new HeightmapSpreadDouble(json)
		}
		else if (json.type === 'minecraft:iceberg') {
			return new Iceberg(json)
		}
		else if (json.type === 'minecraft:lava_lake') {
			return new LavaLake(json)
		}
		else if (json.type === 'minecraft:nope') {
			return new Nope(json)
		}
		else if (json.type === 'minecraft:range') {
			return new Range(json)
		}
		else if (json.type === 'minecraft:spread_32_above') {
			return new Spread32Above(json)
		}
		else if (json.type === 'minecraft:square') {
			return new Square(json)
		}
		else if (json.type === 'minecraft:water_depth_threshold') {
			return new WaterDepthThreshold(json)
		}
		else console.warn('Undefined Decorator type:', json)
		return new Decorator(json)
	}
}

export class CarvingMask extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			step: json.config.step,
		}
	}
}
export class CaveSurface extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			surface: json.config.surface,
			floor_to_ceiling_search_range: json.config.floor_to_ceiling_search_range,
		}
	}
}
export class Chance extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			chance: json.config.chance,
		}
	}
}
export class Count extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			count: IntProvider.getOrInt(json.config.count),
		}
	}
}
export class CountExtra extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			count: json.config.count,
			extra_count: json.config.extra_count,
			extra_chance: json.config.extra_chance,
		}
	}
}
export class CountMultilayer extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			count: IntProvider.getOrInt(json.config.count),
		}
	}
}
export class CountNoise extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			noise_level: json.config.noise_level,
			below_noise: json.config.below_noise,
			above_noise: json.config.above_noise,
		}
	}
}
export class CountNoiseBiased extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			noise_factor: json.config.noise_factor,
			noise_offset: json.config.noise_offset ?? 0,
			noise_to_count_ratio: json.config.noise_to_count_ratio,
		}
	}
}
export class DarkOakTree extends Decorator {
	constructor(json = {}) {
		super(json)
	}
}
export class Decorated extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			outer: Decorator.getDecorator(json.config.outer),
			inner: Decorator.getDecorator(json.config.inner),
		}
	}
}
export class EndGateway extends Decorator {
	constructor(json = {}) {
		super(json)
	}
}
export class Heightmap extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			heightmap: json.config.heightmap,
		}
	}
}
export class HeightmapSpreadDouble extends Heightmap {
	constructor(json = {}) {
		super(json)
	}
}
export class Iceberg extends Decorator {
	constructor(json = {}) {
		super(json)
	}
}
export class LavaLake extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			count: json.config.count,
		}
	}
}
export class Nope extends Decorator {
	constructor(json = {}) {
		super(json)
	}
}
export class Range extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			height: HeightProvider.getOrInt(json.config.height),
		}
	}
}
export class Spread32Above extends Decorator {
	constructor(json = {}) {
		super(json)
	}
}
export class Square extends Decorator {
	constructor(json = {}) {
		super(json)
	}
}
export class WaterDepthThreshold extends Decorator {
	constructor(json = {}) {
		super(json)
		this.config = {
			max_water_depth: json.config.max_water_depth,
		}
	}
}