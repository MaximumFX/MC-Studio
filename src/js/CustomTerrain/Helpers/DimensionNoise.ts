// @ts-ignore
import PerlinNoise3d from 'perlin-noise-3d'

export default class DimensionNoise {
	noise: any[]

	constructor(size = 32, seed = 0) {
		const c = new PerlinNoise3d()
		const e = new PerlinNoise3d()
		const t = new PerlinNoise3d()
		const h = new PerlinNoise3d()
		const w = new PerlinNoise3d()
		const o = new PerlinNoise3d()
		const d = new PerlinNoise3d()
		c.noiseSeed(seed)
		e.noiseSeed(seed + 10000)
		t.noiseSeed(seed + 20000)
		h.noiseSeed(seed + 30000)
		w.noiseSeed(seed + 40000)
		o.noiseSeed(seed + 50000)
		d.noiseSeed(seed + 60000)

		const output = []
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				output.push({
					x: x, y: y,
					c: (c.get(x/10, y/10) * 2) - 1,// Continetalness
					e: (e.get(x/10, y/10) * 2) - 1,// Erosion
					t: (t.get(x/10, y/10) * 2) - 1,// Temperature
					h: (h.get(x/10, y/10) * 2) - 1,// Humidity
					w: (w.get(x/10, y/10) * 2) - 1,// Weirdness
					o: (o.get(x/10, y/10) * 2) - 1,// Offset
					d: (d.get(x/10, y/10) * 2) - 1,// Depth
				})
			}
		}
		this.noise = output
	}
}
