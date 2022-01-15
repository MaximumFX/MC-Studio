const fs = require("fs");

const get = async () => {
	const path = './src/assets/minecraft/1.18/vanilla_worldgen/dimension'
	const data = {
		erosion: {min: 0, max: 0},
		depth: {min: 0, max: 0},
		weirdness: {min: 0, max: 0},
		offset: {min: 0, max: 0},
		temperature: {min: 0, max: 0},
		humidity: {min: 0, max: 0},
		continentalness: {min: 0, max: 0}
	}

	const find = (biome, name) => {
		if (Array.isArray(biome.parameters[name])) {
			if (Math.min(...biome.parameters[name]) < data[name].min) data[name].min = Math.min(...biome.parameters[name])
			if (Math.max(...biome.parameters[name]) > data[name].max) data[name].max = Math.max(...biome.parameters[name])
		}
		else {
			if (biome.parameters[name] < data[name].min) data[name].min = biome.parameters[name]
			if (biome.parameters[name] > data[name].max) data[name].max = biome.parameters[name]
		}
	}

	const dir = await fs.promises.readdir(path)
	for (const file of dir) {
		const json = JSON.parse(await fs.promises.readFile(path + '/' + file))
		if (json.generator.biome_source.type === 'minecraft:multi_noise') {
			json.generator.biome_source.biomes.forEach(biome => {
				find(biome, 'erosion')
				find(biome, 'depth')
				find(biome, 'weirdness')
				find(biome, 'offset')
				find(biome, 'temperature')
				find(biome, 'humidity')
				find(biome, 'continentalness')
			})
		}
	}
	console.log(data)
}
get()
/*
{
  erosion: { min: -1, max: 1 },
  depth: { min: 0, max: 1 },
  weirdness: { min: -1, max: 1 },
  offset: { min: 0, max: 0.375 },
  temperature: { min: -1, max: 1 },
  humidity: { min: -1, max: 1 },
  continentalness: { min: -1.2, max: 1 }
}
 */
