const fs = require("fs");

const get = async () => {
	const path = './src/assets/minecraft/1.18/vanilla_worldgen/worldgen/biome'
	const data = [
		[], [], [], [], [], [], [], [], [], [], [],
	]
	const categories = []

	const dir = await fs.promises.readdir(path)
	for (const file of dir) {
		const json = JSON.parse(await fs.promises.readFile(path + '/' + file))
		for (let i = 0; i < json.features.length; i++) {
			json.features[i].forEach(a => {
				if (!data[i].includes(a)) data[i].push(a)
			})
		}
		if (!categories.includes(json.category)) categories.push(json.category)
	}
	console.log(data)
	console.log(categories.sort().map(a => `${a.toUpperCase()} = '${a}'`).join(', '))
}
get()

/*
[
	['minecraft:end_island_decorated'],//raw
	['minecraft:lake_lava_underground', 'minecraft:lake_lava_surface'],//lakes
	[
		'minecraft:amethyst_geode',
		'minecraft:iceberg_packed',
		'minecraft:iceberg_blue',
		'minecraft:large_dripstone',
		'minecraft:forest_rock',
		'minecraft:basalt_pillar'
	],//local
	[
		'minecraft:monster_room',
		'minecraft:monster_room_deep',
		'minecraft:fossil_upper',
		'minecraft:fossil_lower'
	],//underground structures
	[
		'minecraft:delta',
		'minecraft:small_basalt_columns',
		'minecraft:large_basalt_columns',
		'minecraft:blue_ice',
		'minecraft:desert_well',
		'minecraft:end_gateway_return',
		'minecraft:ice_spike',
		'minecraft:ice_patch',
		'minecraft:end_spike'
	],//surface
	[],//empty strongholds?
	[
		'minecraft:ore_dirt',
		'minecraft:ore_gravel',
		'minecraft:ore_granite_upper',
		'minecraft:ore_granite_lower',
		'minecraft:ore_diorite_upper',
		'minecraft:ore_diorite_lower',
		'minecraft:ore_andesite_upper',
		'minecraft:ore_andesite_lower',
		'minecraft:ore_tuff',
		'minecraft:ore_coal_upper',
		'minecraft:ore_coal_lower',
		'minecraft:ore_iron_upper',
		'minecraft:ore_iron_middle',
		'minecraft:ore_iron_small',
		'minecraft:ore_gold',
		'minecraft:ore_gold_lower',
		'minecraft:ore_redstone',
		'minecraft:ore_redstone_lower',
		'minecraft:ore_diamond',
		'minecraft:ore_diamond_large',
		'minecraft:ore_diamond_buried',
		'minecraft:ore_lapis',
		'minecraft:ore_lapis_buried',
		'minecraft:ore_copper',
		'minecraft:underwater_magma',
		'minecraft:ore_gold_extra',
		'minecraft:disk_sand',
		'minecraft:disk_clay',
		'minecraft:disk_gravel',
		'minecraft:ore_copper_large',
		'minecraft:ore_emerald',
		'minecraft:ore_clay'
	],//ores
	[
		'minecraft:basalt_blobs',
		'minecraft:blackstone_blobs',
		'minecraft:spring_delta',
		'minecraft:patch_fire',
		'minecraft:patch_soul_fire',
		'minecraft:glowstone_extra',
		'minecraft:glowstone',
		'minecraft:brown_mushroom_nether',
		'minecraft:red_mushroom_nether',
		'minecraft:ore_magma',
		'minecraft:spring_closed_double',
		'minecraft:ore_gold_deltas',
		'minecraft:ore_quartz_deltas',
		'minecraft:ore_ancient_debris_large',
		'minecraft:ore_debris_small',
		'minecraft:spring_open',
		'minecraft:spring_closed',
		'minecraft:ore_gravel_nether',
		'minecraft:ore_blackstone',
		'minecraft:ore_gold_nether',
		'minecraft:ore_quartz_nether',
		'minecraft:dripstone_cluster',
		'minecraft:pointed_dripstone',
		'minecraft:ore_infested',
		'minecraft:patch_crimson_roots',
		'minecraft:ore_soul_sand'
	],//underground decoration
	[
		'minecraft:spring_water',
		'minecraft:spring_lava',
		'minecraft:spring_lava_frozen'
	],//springs
	[
		'minecraft:glow_lichen',
		'minecraft:patch_grass_badlands',
		'minecraft:patch_dead_bush_badlands',
		'minecraft:brown_mushroom_normal',
		'minecraft:red_mushroom_normal',
		'minecraft:patch_sugar_cane_badlands',
		'minecraft:patch_pumpkin',
		'minecraft:patch_cactus_decorated',
		'minecraft:bamboo',
		'minecraft:bamboo_vegetation',
		'minecraft:flower_warm',
		'minecraft:patch_grass_jungle',
		'minecraft:patch_sugar_cane',
		'minecraft:patch_melon',
		'minecraft:vines',
		'minecraft:flower_default',
		'minecraft:forest_flowers',
		'minecraft:trees_birch',
		'minecraft:patch_grass_forest',
		'minecraft:trees_water',
		'minecraft:seagrass_cold',
		'minecraft:seagrass_simple',
		'minecraft:kelp_cold',
		'minecraft:spring_lava',
		'minecraft:weeping_vines',
		'minecraft:crimson_fungi',
		'minecraft:crimson_forest_vegetation',
		'minecraft:dark_forest_vegetation',
		'minecraft:seagrass_deep_cold',
		'minecraft:seagrass_deep_warm',
		'minecraft:kelp_warm',
		'minecraft:seagrass_deep',
		'minecraft:patch_dead_bush_2',
		'minecraft:patch_sugar_cane_desert',
		'minecraft:patch_cactus_desert',
		'minecraft:patch_tall_grass_2',
		'minecraft:trees_plains',
		'minecraft:flower_plains',
		'minecraft:patch_grass_plain',
		'minecraft:chorus_plant',
		'minecraft:flower_forest_flowers',
		'minecraft:trees_flower_forest',
		'minecraft:flower_flower_forest',
		'minecraft:trees_birch_and_oak',
		'minecraft:trees_grove',
		'minecraft:trees_snowy',
		'minecraft:bamboo_light',
		'minecraft:trees_jungle',
		'minecraft:seagrass_warm',
		'minecraft:lush_caves_ceiling_vegetation',
		'minecraft:cave_vines',
		'minecraft:lush_caves_clay',
		'minecraft:lush_caves_vegetation',
		'minecraft:rooted_azalea_tree',
		'minecraft:spore_blossom',
		'minecraft:classic_vines_cave_feature',
		'minecraft:flower_meadow',
		'minecraft:trees_meadow',
		'minecraft:mushroom_island_vegetation',
		'minecraft:brown_mushroom_taiga',
		'minecraft:red_mushroom_taiga',
		'minecraft:seagrass_normal',
		'minecraft:birch_tall',
		'minecraft:patch_large_fern',
		'minecraft:trees_old_growth_pine_taiga',
		'minecraft:patch_grass_taiga',
		'minecraft:patch_dead_bush',
		'minecraft:brown_mushroom_old_growth',
		'minecraft:red_mushroom_old_growth',
		'minecraft:patch_berry_common',
		'minecraft:trees_old_growth_spruce_taiga',
		'minecraft:seagrass_river',
		'minecraft:patch_tall_grass',
		'minecraft:trees_savanna',
		'minecraft:patch_grass_savanna',
		'minecraft:trees_taiga',
		'minecraft:patch_grass_taiga_2',
		'minecraft:patch_berry_rare',
		'minecraft:trees_sparse_jungle',
		'minecraft:patch_sunflower',
		'minecraft:trees_swamp',
		'minecraft:flower_swamp',
		'minecraft:patch_grass_normal',
		'minecraft:patch_waterlily',
		'minecraft:brown_mushroom_swamp',
		'minecraft:red_mushroom_swamp',
		'minecraft:patch_sugar_cane_swamp',
		'minecraft:seagrass_swamp',
		'minecraft:warm_ocean_vegetation',
		'minecraft:sea_pickle',
		'minecraft:warped_fungi',
		'minecraft:warped_forest_vegetation',
		'minecraft:nether_sprouts',
		'minecraft:twisting_vines',
		'minecraft:trees_windswept_forest',
		'minecraft:trees_windswept_hills',
		'minecraft:trees_windswept_savanna',
		'minecraft:trees_badlands'
	],//vegetal decoration
	['minecraft:freeze_top_layer', 'minecraft:void_start_platform']//toplayer
]
*/
