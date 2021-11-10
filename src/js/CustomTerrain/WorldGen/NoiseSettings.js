import Block from "@/js/CustomTerrain/Helpers/Block";

export default class NoiseSettings {
	constructor(path = '', name = 'unnamed', json = {}) {
		this.path = path
		this.name = name

		this.bedrock_roof_position = json.bedrock_roof_position
		this.bedrock_floor_position = json.bedrock_floor_position
		this.sea_level = json.sea_level
		this.min_surface_level = json.min_surface_level
		this.disable_mob_generation = json.disable_mob_generation
		this.noise_caves_enabled = json.noise_caves_enabled
		this.noodle_caves_enabled = json.noodle_caves_enabled
		this.deepslate_enabled = json.deepslate_enabled
		this.ore_veins_enabled = json.ore_veins_enabled
		this.aquifers_enabled = json.aquifers_enabled
		this.default_block = new Block(json.default_block)
		this.default_fluid = new Block(json.default_fluid)
		this.structures = {
			stronghold: {
				distance: json.structures.stronghold.distance,
				count: json.structures.stronghold.count,
				spread: json.structures.stronghold.spread,
			},
			structures: json.structures.structures,
		}
		this.noise = {
			min_y: json.noise.min_y,
			height: json.noise.height,
			size_horizontal: json.noise.size_horizontal,
			size_vertical: json.noise.size_vertical,
			density_factor: json.noise.density_factor,
			density_offset: json.noise.density_offset,
			simplex_surface_noise: json.noise.simplex_surface_noise,
			sampling: {
				xz_scale: json.noise.sampling.xz_scale,
				xz_factor: json.noise.sampling.xz_factor,
				y_scale: json.noise.sampling.y_scale,
				y_factor: json.noise.sampling.y_factor,
			},
			top_slide: {
				target: json.noise.top_slide.target,
				size: json.noise.top_slide.size,
				offset: json.noise.top_slide.offset,
			},
			bottom_slide: {
				target: json.noise.bottom_slide.target,
				size: json.noise.bottom_slide.size,
				offset: json.noise.bottom_slide.offset,
			},
		}
		if (json.noise.hasOwnProperty('random_density_offset'))
			this.noise.random_density_offset = json.noise.random_density_offset
		if (json.noise.hasOwnProperty('island_noise_override'))
			this.noise.island_noise_override = json.noise.island_noise_override
		if (json.noise.hasOwnProperty('amplified'))
			this.noise.amplified = json.noise.amplified
	}
}