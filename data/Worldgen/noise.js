const fs = require("fs");

const get = async () => {
	const path = './src/assets/minecraft/1.18-pre5/vanilla_worldgen/worldgen/noise'
	const data = {
		firstOctave: {min: 0, max: 0},
		amplitudes: {min: 0, max: 0},
	}
	const dir = await fs.promises.readdir(path)
	for (const file of dir) {
		const json = JSON.parse(await fs.promises.readFile(path + '/' + file))
		console.log(json)
		if (json.firstOctave < data.firstOctave.min) data.firstOctave.min = json.firstOctave
		if (json.firstOctave > data.firstOctave.max) data.firstOctave.max = json.firstOctave

		if (Math.min(...json.amplitudes) < data.amplitudes.min) data.amplitudes.min = Math.min(...json.amplitudes)
		if (Math.max(...json.amplitudes) > data.amplitudes.max) data.amplitudes.max = Math.max(...json.amplitudes)
	}
	console.log(data)
}
get()
//{ firstOctave: { min: -16, max: 0 }, amplitudes: { min: 0, max: 2 } }
