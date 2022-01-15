const fs = require("fs");

const get = async () => {
	const path = './src/assets/minecraft/1.18-pre5/vanilla_worldgen/worldgen/configured_feature'
	const data = []
	const feat = []

	const dir = await fs.promises.readdir(path)
	for (const file of dir) {
		const json = JSON.parse(await fs.promises.readFile(path + '/' + file))
		if (!data.includes(json.type) && Object.keys(json.config).length !== 0) data.push(json)
		if (json.type === 'minecraft:block_pile') feat.push(json)
	}
	// console.log(data.sort())
	console.log(JSON.stringify(feat, null, 2))
}
get()

/*
[
  'minecraft:bamboo',
  'minecraft:basalt_columns',
  'minecraft:basalt_pillar',
  'minecraft:block_column',
  'minecraft:block_pile',
  'minecraft:blue_ice',
  'minecraft:bonus_chest',
  'minecraft:chorus_plant',
  'minecraft:delta_feature',
  'minecraft:desert_well',
  'minecraft:disk',
  'minecraft:dripstone_cluster',
  'minecraft:end_gateway',
  'minecraft:end_island',
  'minecraft:end_spike',
  'minecraft:flower',
  'minecraft:forest_rock',
  'minecraft:fossil',
  'minecraft:freeze_top_layer',
  'minecraft:geode',
  'minecraft:glow_lichen',
  'minecraft:glowstone_blob',
  'minecraft:huge_brown_mushroom',
  'minecraft:huge_fungus',
  'minecraft:huge_red_mushroom',
  'minecraft:ice_patch',
  'minecraft:ice_spike',
  'minecraft:iceberg',
  'minecraft:kelp',
  'minecraft:lake',
  'minecraft:large_dripstone',
  'minecraft:monster_room',
  'minecraft:nether_forest_vegetation',
  'minecraft:netherrack_replace_blobs',
  'minecraft:ore',
  'minecraft:random_boolean_selector',
  'minecraft:random_patch',
  'minecraft:random_selector',
  'minecraft:root_system',
  'minecraft:scattered_ore',
  'minecraft:sea_pickle',
  'minecraft:seagrass',
  'minecraft:simple_block',
  'minecraft:simple_random_selector',
  'minecraft:spring_feature',
  'minecraft:tree',
  'minecraft:twisting_vines',
  'minecraft:underwater_magma',
  'minecraft:vegetation_patch',
  'minecraft:vines',
  'minecraft:void_start_platform',
  'minecraft:waterlogged_vegetation_patch',
  'minecraft:weeping_vines'
] 53
 */
