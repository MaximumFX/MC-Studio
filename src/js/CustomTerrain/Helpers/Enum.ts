// BACKEND
export enum DynamicSelectType {
	BIOME
}


// DIMENSION
export enum DimensionEffects {
	OVERWORLD = 'minecraft:overworld',
	THE_NETHER = 'minecraft:the_nether',
	THE_END = 'minecraft:the_end',
}
export enum Infiniburn {
	OVERWORLD = 'minecraft:infiniburn_overworld',
	THE_NETHER = 'minecraft:infiniburn_nether',
	THE_END = 'minecraft:infiniburn_end',
}

// BIOME
export enum BiomeSourceType {//TODO add the_end
	VANILLA_LAYERED = 'minecraft:vanilla_layered',
	MULTI_NOISE = 'minecraft:multi_noise',
	FIXED = 'minecraft:fixed',
	CHECKERBOARD = 'minecraft:checkerboard'
}
export enum BiomePrecipitation {
	NONE = 'none',
	RAIN = 'rain',
	SNOW = 'snow',
}
export enum BiomeTemperatureModifier {
	NONE = 'none',
	FROZEN = 'frozen'
}
export enum BiomeCategory {
	NONE = 'none',
	TAIGA = 'taiga',
	EXTREME_HILLS = 'extreme_hills',
	JUNGLE = 'jungle',
	MESA = 'mesa',
	PLAINS = 'plains',
	SAVANNA = 'savanna',
	ICY = 'icy',
	BEACH = 'beach',
	FOREST = 'forest',
	OCEAN = 'ocean',
	DESERT = 'desert',
	RIVER = 'river',
	SWAMP = 'swamp',
	MUSHROOM = 'mushroom',
	THE_END = 'the_end',
	NETHER = 'nether',
}
export enum BiomeGrassColorModifier {
	NONE = 'none',
	DARK_FOREST = 'dark_forest',
	SWAMP = 'swamp'
}

// PROVIDERS
export enum BlockStateProviderType {
	SIMPLE_STATE = 'simple_state_provider',
	ROTATED_BLOCK = 'rotated_block_provider',
	WEIGHTED_STATE = 'weighted_state_provider'
}
export enum FloatProviderType {
	CONSTANT = 'constant',
	UNIFORM = 'uniform',
	CLAMPED_NORMAL = 'clamped_normal',
	TRAPEZOID = 'trapezoid',
}
export enum HeightProviderType {
	CONSTANT = 'constant',
	UNIFORM = 'uniform',
	BIASED_TO_BOTTOM = 'biased_to_bottom',
	VERY_BIASED_TO_BOTTOM = 'very_biased_to_bottom',
	TRAPEZOID = 'trapezoid',
}
export enum IntProviderType {
	CONSTANT = 'constant',
	UNIFORM = 'uniform',
	CLAMPED = 'clamped',
	BIASED_TO_BOTTOM = 'biased_to_bottom',
}

// STRUCTURES
export enum RuinedPortalType {
	STANDARD = 'standard',
	DESERT = 'desert',
	JUNGLE = 'jungle',
	SWAMP = 'swamp',
	MOUNTAIN = 'mountain',
	OCEAN = 'ocean',
	NETHER = 'nether'
}