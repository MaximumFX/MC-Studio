export default class MCSprite {
	type: MCSpriteType
	icon: MCSpriteBiome

	constructor(id: string | MCSpriteType, icon?: MCSpriteBiome) {
		if (icon) {
			this.type = id as MCSpriteType
			this.icon = icon
		}
		else {
			const split = id.split(':')
			this.type = split[0] as MCSpriteType
			this.icon = split[1] as MCSpriteBiome
		}
	}

	getPos = () => {
		const json = require(`@/assets/minecraft/MCSprite/${this.type}.json`)
		if (json) {
			const size = json.settings.size ?? 16
			const icon = json.ids[this.icon]
			const width = json.settings.sheetsize / size
			if (icon) {
				const left = (icon.pos - 1) % width * size
				const top = Math.floor((icon.pos - 1) / width) * size
				return { x: left / 16, y: top / 16 }
			}

			const left = (json.settings.pos - 1) % width * size
			const top = Math.floor((json.settings.pos - 1) / width) * size
			return { x: left / 16, y: top / 16 }
		}
		return { x: 0, y: 0 }
	}
	getSize = () => {
		const json = require(`@/assets/minecraft/MCSprite/${this.type}.json`)
		if (json) {
			const size = json.settings.size ?? 16
			const width = json.settings.sheetsize / size
			const height =  json.settings.pos / width
			return { size, width, height, }
		}
		return {}
	}
	getImage = () => require(`@/assets/minecraft/MCSprite/${this.type}.png`)

	toJSON = () => this.type + ':' + this.icon
}

export enum MCSpriteType {
	BIOME = 'Biome',
	BLOCK = 'Block',
	EFFECT = 'Effect',
	ENTITY = 'Entity',
	ITEM = 'Item',
	INV = 'Inv',
	SCHEMATIC = 'Schematic',
	SLOT = 'Slot',
	ACHIEVEMENT = 'Achievement',
	NEW_ACHIEVEMENT = 'NewAchievement',
}

export enum MCSpriteBiome {
	BADLANDS = 'badlands',
	BADLANDS_PLATEAU = 'badlands-plateau',
	BAMBOO_JUNGLE = 'bamboo-jungle',
	BAMBOO_JUNGLE_HILLS = 'bamboo-jungle-hills',
	BASALT_DELTAS = 'basalt-deltas',
	BEACH = 'beach',
	BIRCH_FOREST = 'birch-forest',
	BIRCH_FOREST_HILLS = 'birch-forest-hills',
	COLD_OCEAN = 'cold-ocean',
	CRIMSON_FOREST = 'crimson-forest',
	DARK_FOREST = 'dark-forest',
	DARK_FOREST_HILLS = 'dark-forest-hills',
	DEEP_COLD_OCEAN = 'deep-cold-ocean',
	DEEP_FROZEN_OCEAN = 'deep-frozen-ocean',
	DEEP_LUKEWARM_OCEAN = 'deep-lukewarm-ocean',
	DEEP_OCEAN = 'deep-ocean',
	DEEP_WARM_OCEAN = 'deep-warm-ocean',
	DESERT = 'desert',
	DESERT_HILLS = 'desert-hills',
	DESERT_LAKES = 'desert-lakes',
	DRIPSTONE_CAVES = 'dripstone-caves',
	END_BARRENS = 'end-barrens',
	END_HIGHLANDS = 'end-highlands',
	END_MIDLANDS = 'end-midlands',
	ERODED_BADLANDS = 'eroded-badlands',
	FLOWER_FOREST = 'flower-forest',
	FOREST = 'forest',
	FROZEN_OCEAN = 'frozen-ocean',
	FROZEN_PEAKS = 'frozen-peaks',
	FROZEN_RIVER = 'frozen-river',
	GIANT_SPRUCE_TAIGA = 'giant-spruce-taiga',
	GIANT_SPRUCE_TAIGA_HILLS = 'giant-spruce-taiga-hills',
	GIANT_TREE_TAIGA = 'giant-tree-taiga',
	GIANT_TREE_TAIGA_HILLS = 'giant-tree-taiga-hills',
	GRAVELLY_MOUNTAINS = 'gravelly-mountains',
	'GRAVELLY_MOUNTAINS+' = 'gravelly-mountains+',
	GRAVELLY_MOUNTAINS_PLUS = 'gravelly-mountains-plus',
	ICE_DESERT = 'ice-desert',
	ICE_SPIKES = 'ice-spikes',
	JAGGED_PEAKS = 'jagged-peaks',
	JUNGLE = 'jungle',
	JUNGLE_EDGE = 'jungle-edge',
	JUNGLE_HILLS = 'jungle-hills',
	LEGACY_FROZEN_OCEAN = 'legacy-frozen-ocean',
	LOFTY_PEAKS = 'lofty-peaks',
	LUKEWARM_OCEAN = 'lukewarm-ocean',
	LUSH_CAVES = 'lush-caves',
	MODIFIED_BADLANDS_PLATEAU = 'modified-badlands-plateau',
	MODIFIED_GRAVELLY_MOUNTAINS = 'modified-gravelly-mountains',
	MODIFIED_JUNGLE = 'modified-jungle',
	MODIFIED_JUNGLE_EDGE = 'modified-jungle-edge',
	MODIFIED_WOODED_BADLANDS_PLATEAU = 'modified-wooded-badlands-plateau',
	MOUNTAIN_EDGE = 'mountain-edge',
	MOUNTAIN_GROVE = 'mountain-grove',
	GROVE = 'grove',
	MOUNTAIN_MEADOW = 'mountain-meadow',
	MEADOW = 'meadow',
	MOUNTAINS = 'mountains',
	MUSHROOM_FIELD_SHORE = 'mushroom-field-shore',
	MUSHROOM_FIELDS = 'mushroom-fields',
	NETHER = 'nether',
	NETHER_WASTES = 'nether-wastes',
	OCEAN = 'ocean',
	OLD_GROWTH_BIRCH_FOREST = 'old-growth-birch-forest',
	OLD_GROWTH_PINE_TAIGA = 'old-growth-pine-taiga',
	OLD_GROWTH_SPRUCE_TAIGA = 'old-growth-spruce-taiga',
	PLAINS = 'plains',
	RAIN_FOREST = 'rain-forest',
	RIVER = 'river',
	SAVANNA = 'savanna',
	SAVANNA_PLATEAU = 'savanna-plateau',
	SEASONAL_FOREST = 'seasonal-forest',
	SHATTERED_SAVANNA = 'shattered-savanna',
	SHATTERED_SAVANNA_PLATEAU = 'shattered-savanna-plateau',
	SHRUBLAND = 'shrubland',
	SKY = 'sky',
	SKY_EDGE = 'sky-edge',
	SMALL_END_ISLANDS = 'small-end-islands',
	SNOW_CAPPED_PEAKS = 'snow-capped-peaks',
	SNOWY_BEACH = 'snowy-beach',
	SNOWY_MOUNTAINS = 'snowy-mountains',
	SNOWY_PLAINS = 'snowy-plains',
	SNOWY_SLOPES = 'snowy-slopes',
	SNOWY_TAIGA = 'snowy-taiga',
	SNOWY_TAIGA_HILLS = 'snowy-taiga-hills',
	SNOWY_TAIGA_MOUNTAINS = 'snowy-taiga-mountains',
	SNOWY_TUNDRA = 'snowy-tundra',
	SOUL_SAND_VALLEY = 'soul-sand-valley',
	SPARSE_JUNGLE = 'sparse-jungle',
	STONE_SHORE = 'stone-shore',
	STONY_SHORE = 'stony-shore',
	STONY_PEAKS = 'stony-peaks',
	SUNFLOWER_PLAINS = 'sunflower-plains',
	SWAMP = 'swamp',
	SWAMP_HILLS = 'swamp-hills',
	TAIGA = 'taiga',
	TAIGA_HILLS = 'taiga-hills',
	TAIGA_MOUNTAINS = 'taiga-mountains',
	TALL_BIRCH_FOREST = 'tall-birch-forest',
	TALL_BIRCH_HILLS = 'tall-birch-hills',
	THE_END = 'the-end',
	THE_VOID = 'the-void',
	TUNDRA = 'tundra',
	WARM_OCEAN = 'warm-ocean',
	WARPED_FOREST = 'warped-forest',
	WINDSWEPT_FOREST = 'windswept-forest',
	WINDSWEPT_GRAVELLY_HILLS = 'windswept-gravelly-hills',
	WINDSWEPT_HILLS = 'windswept-hills',
	WINDSWEPT_SAVANNA = 'windswept-savanna',
	WOODED_BADLANDS = 'wooded-badlands',
	WOODED_BADLANDS_PLATEAU = 'wooded-badlands-plateau',
	WOODED_HILLS = 'wooded-hills',
	WOODED_MOUNTAINS = 'wooded-mountains'
}
