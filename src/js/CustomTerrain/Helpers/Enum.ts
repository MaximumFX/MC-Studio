// BACKEND
export enum CTFileType {
	Dimension = 'Dimension',
	DimensionType = 'DimensionType',
	Biome = 'Biome',
	ConfiguredCarver = 'ConfiguredCarver',
	ConfiguredFeature = 'ConfiguredFeature',
	ConfiguredStructureFeature = 'ConfiguredStructureFeature',
	PlacedFeature = 'PlacedFeature',
	Noise = 'Noise',
	NoiseSettings = 'NoiseSettings',
	ProcessorList = 'ProcessorList',
	TemplatePool = 'TemplatePool'
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
export enum BiomeSourceType {
	VANILLA_LAYERED = 'minecraft:vanilla_layered',
	MULTI_NOISE = 'minecraft:multi_noise',
	THE_END = 'minecraft:the_end',
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
	BEACH = 'beach',
	DESERT = 'desert',
	EXTREME_HILLS = 'extreme_hills',
	FOREST = 'forest',
	ICY = 'icy',
	JUNGLE = 'jungle',
	MESA = 'mesa',
	MOUNTAIN = 'mountain',
	MUSHROOM = 'mushroom',
	NETHER = 'nether',
	OCEAN = 'ocean',
	PLAINS = 'plains',
	RIVER = 'river',
	SAVANNA = 'savanna',
	SWAMP = 'swamp',
	TAIGA = 'taiga',
	THE_END = 'the_end',
	UNDERGROUND = 'underground'
}
export enum BiomeGrassColorModifier {
	NONE = 'none',
	DARK_FOREST = 'dark_forest',
	SWAMP = 'swamp'
}

// Configured Features
export enum FeatureType {
	BAMBOO = 'Bamboo',
	BASALT_COLUMNS = 'BasaltColumns',
	BLOCK_COLUMN = 'BlockColumn',
	BLOCK_PILE = 'BlockPile',
}

// Placed Features
export enum CarvingMask {
	NONE = 'none',
	LIQUID = 'liquid',
	AIR = 'air'
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
