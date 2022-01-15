var parser = require('luaparse')

const biome = `return {
	settings = {
		image = 'BiomeCSS.png',
		pos = 96,
		sheetsize = 128,
		url = require( [[Module:Sprite]] ).getUrl( 'BiomeCSS.png', 'version=1608009132529', '' ),
	},
	sections = {
		{ name = 'Snowy Biomes', id = 1 },
		{ name = 'Cold Biomes', id = 2 },
		{ name = 'Medium Biomes', id = 3 },
		{ name = 'Warm Biomes', id = 4 },
		{ name = 'Aquatic Biomes', id = 5 },
		{ name = 'Nether Biomes', id = 10 },
		{ name = 'End Biomes', id = 11 },
		{ name = 'Unused Biomes', id = 6 },
		{ name = 'Other Biomes', id = 7 },
		{ name = 'Removed Biomes', id = 8 },
		{ name = 'Unimplemented Biomes', id = 9 },
	},
	ids = {
		badlands = { pos = 12, section = 4 },
		['badlands-plateau'] = { pos = 50, section = 4 },
		['bamboo-jungle'] = { pos = 70, section = 3 },
		['bamboo-jungle-hills'] = { pos = 71, section = 3 },
		['basalt-deltas'] = { pos = 83, section = 10 },
		beach = { pos = 16, section = 3 },
		['birch-forest'] = { pos = 22, section = 3 },
		['birch-forest-hills'] = { pos = 54, section = 3 },
		['cold-ocean'] = { pos = 64, section = 5 },
		['crimson-forest'] = { pos = 80, section = 10 },
		['dark-forest'] = { pos = 24, section = 3 },
		['dark-forest-hills'] = { pos = 45, section = 3 },
		['deep-cold-ocean'] = { pos = 65, section = 5 },
		['deep-frozen-ocean'] = { pos = 57, section = 5 },
		['deep-lukewarm-ocean'] = { pos = 66, section = 5 },
		['deep-ocean'] = { pos = 27, section = 5 },
		['deep-warm-ocean'] = { pos = 68, section = 6 },
		desert = { pos = 2, section = 4 },
		['desert-hills'] = { pos = 58, section = 4 },
		['desert-lakes'] = { pos = 36, section = 4 },
		['dripstone-caves'] = { pos = 84, section = 3 },
		['end-barrens'] = { pos = 63, section = 11 },
		['end-highlands'] = { pos = 60, section = 11 },
		['end-midlands'] = { pos = 62, section = 11 },
		['eroded-badlands'] = { pos = 40, section = 4 },
		['flower-forest'] = { pos = 34, section = 3 },
		forest = { pos = 1, section = 3 },
		['frozen-ocean'] = { pos = 19, section = 5 },
		['frozen-peaks'] = { pos = 89, section = 1 },
		['frozen-river'] = { pos = 15, section = 1 },
		['giant-spruce-taiga'] = { pos = 32, section = 2 },
		['giant-spruce-taiga-hills'] = { pos = 32, section = 2 },
		['giant-tree-taiga'] = { pos = 13, section = 2 },
		['giant-tree-taiga-hills'] = { pos = 56, section = 2 },
		['gravelly-mountains'] = { pos = 44, section = 2 },
		['gravelly-mountains+'] = { pos = 29, section = 2 },
		['gravelly-mountains-plus'] = { pos = 29, section = 2 },
		['ice-desert'] = { pos = 73, section = 8 },
		['ice-spikes'] = { pos = 41, section = 1 },
		['jagged-peaks'] = { pos = 88, section = 1 },
		jungle = { pos = 5, section = 3 },
		['jungle-edge'] = { pos = 37, section = 3 },
		['jungle-hills'] = { pos = 47, section = 3 },
		['legacy-frozen-ocean'] = { pos = 72, section = 6 },
		['lofty-peaks'] = { pos = 88, section = 1 },
		['lukewarm-ocean'] = { pos = 67, section = 5 },
		['lush-caves'] = { pos = 90, section = 3},
		['modified-badlands-plateau'] = { pos = 52, section = 4 },
		['modified-gravelly-mountains'] = { pos = 29, section = 2 },
		['modified-jungle'] = { pos = 47, section = 3 },
		['modified-jungle-edge'] = { pos = 48, section = 3 },
		['modified-wooded-badlands-plateau'] = { pos = 49, section = 4 },
		['mountain-edge'] = { pos = 20, section = 6 },
		['mountain-grove'] = { pos = 86, section = 1 },
		['grove'] = { pos = 86, section = 1 },
		['mountain-meadow'] = { pos = 85, section = 2 },
		['meadow'] = { pos = 85, section = 2 },
		mountains = { pos = 8, section = 2 },
		['mushroom-field-shore'] = { pos = 17, section = 3 },
		['mushroom-fields'] = { pos = 9, section = 3 },
		nether = { pos = 10, section = 10 },
		['nether-wastes'] = { pos = 10, section = 10 },
		ocean = { pos = 18, section = 5 },
		['old-growth-birch-forest'] = { pos = 35, section = 3 },
		['old-growth-pine-taiga'] = { pos = 13, section = 2 },
		['old-growth-spruce-taiga'] = { pos = 32, section = 2 },
		plains = { pos = 3, section = 3 },
		['rain-forest'] = { pos = 77, section = 8 },
		river = { pos = 14, section = 3 },
		savanna = { pos = 23, section = 4 },
		['savanna-plateau'] = { pos = 51, section = 4 },
		['seasonal-forest'] = { pos = 76, section = 8 },
		['shattered-savanna'] = { pos = 38, section = 4 },
		['shattered-savanna-plateau'] = { pos = 53, section = 4 },
		shrubland = { pos = 74, section = 8 },
		sky = { pos = 78, section = 9 },
		['sky-edge'] = { pos = 79, section = 9 },
		['small-end-islands'] = { pos = 61, section = 11 },
		['snow-capped-peaks'] = { pos = 89, section = 1 },
		['snowy-beach'] = { pos = 26, section = 1 },
		['snowy-mountains'] = { pos = 59, section = 1 },
		['snowy-plains'] = { pos = 6, section = 1 },
		['snowy-slopes'] = { pos = 87, section = 1 },
		['snowy-taiga'] = { pos = 7, section = 1 },
		['snowy-taiga-hills'] = { pos = 42, section = 1 },
		['snowy-taiga-mountains'] = { pos = 42, section = 1 },
		['snowy-tundra'] = { pos = 6, section = 1 },
		['soul-sand-valley'] = { pos = 82, section = 10 },
		['sparse-jungle'] = { pos = 37, section = 3 },
		['stone-shore'] = { pos = 25, section = 2 },
		['stony-shore'] = { pos = 25, section = 2 },
		['stony-peaks'] = { pos = 91, section = 2 },
		['sunflower-plains'] = { pos = 33, section = 3 },
		swamp = { pos = 4, section = 3 },
		['swamp-hills'] = { pos = 46, section = 3 },
		taiga = { pos = 31, section = 2 },
		['taiga-hills'] = { pos = 43, section = 2 },
		['taiga-mountains'] = { pos = 43, section = 2 },
		['tall-birch-forest'] = { pos = 35, section = 3 },
		['tall-birch-hills'] = { pos = 55, section = 3 },
		['the-end'] = { pos = 11, section = 11 },
		['the-void'] = { pos = 28, section = 7 },
		tundra = { pos = 75, section = 8 },
		['warm-ocean'] = { pos = 69, section = 5 },
		['warped-forest'] = { pos = 81, section = 10 },
		['windswept-forest'] = { pos = 30, section = 2 },
		['windswept-gravelly-hills'] = { pos = 44, section = 2 },
		['windswept-hills'] = { pos = 8, section = 2 },
		['windswept-savanna'] = { pos = 38, section = 4 },
		['wooded-badlands'] = { pos = 39, section = 4 },
		['wooded-badlands-plateau'] = { pos = 39, section = 4 },
		['wooded-hills'] = { pos = 21, section = 3 },
		['wooded-mountains'] = { pos = 30, section = 2 },
	},
}
`

const map = fields => {
	const obj = {}
	let arr = []
	fields.forEach(field => {
		if (field.type === 'TableKeyString') {
			if (field.value.fields)
				obj[field.key.name] = map(field.value.fields)
			else
				obj[field.key.name] = field.value.value
		}
		else if (field.type === 'TableValue') {
			arr.push(map(field.value.fields))
		}
		else if (field.type === 'TableKey') {
			obj[field.key.value] = map(field.value.fields)
		}
		else {
			console.log(field)
		}
	})
	return arr.length ? arr : obj
}
const parse = lua => map(parser.parse(lua).body[0].arguments[0].fields)

const json = parse(biome)
console.log(json, JSON.stringify(json))

const enumObj = {}
Object.keys(json.ids).forEach(a => {
	enumObj[a.replace(/-/g, '_').toUpperCase()] = a
})
console.log(enumObj)
