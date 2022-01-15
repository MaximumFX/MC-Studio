const fs = require("fs");

const get = async () => {
	const path = './src/assets/minecraft/1.18/vanilla_worldgen/worldgen/placed_feature'
	const data = []

	const dir = await fs.promises.readdir(path)
	for (const file of dir) {
		const json = JSON.parse(await fs.promises.readFile(path + '/' + file))
		json.placement.forEach(p => {
			if (!data.some(a => a === p.type)) data.push(p.type)
			if (p.type === 'minecraft:carving_mask')
				console.log(p)
		})
		// const tmp = json.placement.map(a => a.type)
		// if (tmp.some((item, idx) => tmp.indexOf(item) !== idx)) {
		// 	console.log('dupe', json)
		// }
	}
	console.log(data.sort())
}
get()

/*
Types:
[
  'minecraft:biome',
  'minecraft:block_predicate_filter',
  'minecraft:carving_mask',
  'minecraft:count',
  'minecraft:count_on_every_layer',
  'minecraft:environment_scan',
  'minecraft:height_range',
  'minecraft:heightmap',
  'minecraft:in_square',
  'minecraft:noise_based_count',
  'minecraft:noise_threshold_count',
  'minecraft:random_offset',
  'minecraft:rarity_filter',
  'minecraft:surface_relative_threshold_filter',
  'minecraft:surface_water_depth_filter'
]
 */
