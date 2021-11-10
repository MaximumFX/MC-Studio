import {getPreciseDistance} from "geolib";
import BlockVector3 from "@/js/OSM/BlockVector3";
import Triangle from "@/js/OSM/Triangle";

export default class OSMSchematic {
	constructor(osm) {
		this.osm = osm
		this.schematic = null
		this.statusMessage = {
			message: '',
		}
	}

	createSchematic = () => new Promise(resolve => {
		this.setStatusMessage('Calculating schematic size')
		let blocks = []
		const size = {
			width: getPreciseDistance({
				lat: parseFloat(this.osm.bounds.minlat),
				lon: parseFloat(this.osm.bounds.minlon)
			}, {
				lat: parseFloat(this.osm.bounds.minlat),
				lon: parseFloat(this.osm.bounds.maxlon)
			}),
			height: getPreciseDistance({
				lat: parseFloat(this.osm.bounds.minlat),
				lon: parseFloat(this.osm.bounds.minlon)
			}, {
				lat: parseFloat(this.osm.bounds.maxlat),
				lon: parseFloat(this.osm.bounds.minlon)
			})
		}
		console.log('Schematic size', size)

		this.setStatusMessage('Creating schematic base')
		for (let x = 0; x < size.width; x++) {
			for (let z = 0; z < size.height; z++) {
				// if (!blocks.some(a => a.x === x && a.y === 0 && a.z === z))
				blocks.push({x, y: 0, z, material:'minecraft:black_stained_glass'})
			}
		}

		this.setStatusMessage('Loading ways', 1, this.osm.ways.length)
		const materials = [
			'white_wool',
			'orange_wool',
			'magenta_wool',
			'light_blue_wool',
			'yellow_wool',
			'lime_wool',
			'pink_wool',
			'gray_wool',
			'light_gray_wool',
			'cyan_wool',
			'purple_wool',
			'blue_wool',
			'brown_wool',
			'green_wool',
			'red_wool',
			'black_wool',
		]
		let matIndex = 0
		let maxHeight = 1
		const ways = this.osm.ways
			.filter(way => way.visible)
			.map(way => this.osm.getWay(way.id))
		ways.forEach(way => {
			this.countStatusMessageItem()
			let coords = way.nodes.map(node => ({
				lat: parseFloat(node.lat),
				lon: parseFloat(node.lon),
			}))
				.map(coord => {
					let x = getPreciseDistance(coord, {
						lat: parseFloat(coord.lat),
						lon: parseFloat(this.osm.bounds.maxlon)
					}, 0.01)
					if (coord.lon < this.osm.bounds.minlon)
						x += size.width
					else if (coord.lon > this.osm.bounds.maxlon)
						x = -x

					let z = getPreciseDistance(coord, {
						lat: parseFloat(this.osm.bounds.maxlat),
						lon: parseFloat(coord.lon)
					}, 0.01)
					if (coord.lat < this.osm.bounds.minlat)
						z += size.height
					else if (coord.lat > this.osm.bounds.maxlat)
						z = -z

					let y = 1
					if (way.tags.hasOwnProperty('landuse') || way.tags.hasOwnProperty('natural'))
						y = 0
					if (way.tags.hasOwnProperty('layer'))
						y = parseInt(way.tags.layer)

					return ({
						...coord,
						x: Math.round(x),
						y: Math.round(y),
						z: Math.round(z)
					})
				})

			let mat = 'minecraft:' + materials[matIndex]
			let filled = false
			if (way.tags.hasOwnProperty('landuse')) {
				if (['allotments','farmland','farmyard','flowerbed','forest','meadow','orchard','vineyard',
					'grass','greenfield','greenfield_horticulture','plant_nursery','village_green'].includes(way.tags.landuse))
					mat = 'minecraft:lime_terracotta'
				else if (['basin','reservoir','salt_pond'].includes(way.tags.landuse))
					mat = 'minecraft:light_blue_terracotta'
				filled = true
			}
			if (way.tags.hasOwnProperty('natural')) {
				if (['wood','tree_row','scrub','heath','grassland','tundra'].includes(way.tags.natural))
					mat = 'minecraft:green_terracotta'
				else if (['water','wetland','glacies','bay','strait','reef','spring','hot_spring','geyser'].includes(way.tags.natural))
					mat = 'minecraft:blue_terracotta'
				else if (['sand'].includes(way.tags.natural))
					mat = 'minecraft:white_terracotta'
				else if (['bare_rock'].includes(way.tags.natural))
					mat = 'minecraft:cyan_terracotta'
				filled = true
			}
			const buildBlocks = getBlocks(coords, filled).map(c => ({
				x: size.width - Math.round(c.x),
				y: Math.round(c.y),
				z: Math.round(c.z),
				material: mat,
			})).reduce((acc, current) =>
					!acc.find(item =>
						item.x === current.x && item.y === current.y && item.z === current.z
					) ? acc.concat([current]) : acc
				, [])
			blocks.push(...buildBlocks)

			blocks = blocks.filter(b => b.x >= 0 && b.x <= size.width && b.z >= 0 && b.z <= size.height)

			if (way.tags.hasOwnProperty('height')) {
				const height = Math.round(way.tags.height)
				for (let h = 0; h < height; h++) {
					blocks.push(...buildBlocks.map(a => {
						if (a.y + h + 1 > maxHeight) maxHeight = a.y + h + 1
						return {
							...a,
							y: a.y + h + 1
						}
					}))
				}
			}
			matIndex++
			if (matIndex >= materials.length) matIndex = 0
		})

		this.setStatusMessage('Creating palette', 1, [...new Set(blocks.map(b => b.material))].length)
		let palette = {
			'minecraft:air': {"type": "int", "value": 0}
		}
		blocks.forEach(b => {
			if (!palette.hasOwnProperty(b.material)) {
				palette[b.material] = {"type": "int", "value": Object.keys(palette).length}
				this.countStatusMessageItem()
			}
		})

		this.setStatusMessage('Filling schematic with blocks', 1, blocks.length)
		const schematic = {
			"type": "compound",
			"name": "Schematic",
			"value": {
				"Version": {"type": "int", "value": 2},
				"PaletteMax": {"type": "int", "value": Object.keys(palette).length},
				"Palette": {
					"type": "compound", "value": palette
				},
				"Length": {"type": "short", "value": size.height},
				"Height": {"type": "short", "value": maxHeight + 1},
				"Width": {"type": "short", "value": size.width},
				"DataVersion": {"type": "int", "value": 2580},
				"BlockData": {
					"type": "byteArray",
					"value": Array(size.width * (maxHeight + 1) * size.height).fill(palette['minecraft:air'])
				},
			}
		}

		blocks.forEach(b => {
			schematic.value.BlockData.value[(b.y * size.height + b.z) * size.width + b.x] = palette[b.material].value
			this.countStatusMessageItem()
		})
		this.setStatusMessage('Created schematic')
		console.log('Schematic', schematic)
		this.schematic = schematic
		resolve(schematic)
	})

	setStatusMessage = (message, item = null, total = null) => {
		this.statusMessage = {message, item, total}
	}
	setStatusMessageItem = item => {
		this.setStatusMessage(this.statusMessage.message, item, this.statusMessage.total)
	}
	countStatusMessageItem = () => {
		this.setStatusMessage(this.statusMessage.message, this.statusMessage.item + 1, this.statusMessage.total)
	}
}


function getBlocks(vectors, filled = false) {
	let vset = []

	for (let i = 0; vectors.length !== 0 && i < vectors.length - 1; i++) {
		let pos1 = vectors[i];
		let pos2 = vectors[i + 1];

		let x1 = pos1.x;
		let y1 = pos1.y;
		let z1 = pos1.z;
		let x2 = pos2.x;
		let y2 = pos2.y;
		let z2 = pos2.z;
		let tipx = x1;
		let tipy = y1;
		let tipz = z1;
		let dx = Math.abs(x2 - x1);
		let dy = Math.abs(y2 - y1);
		let dz = Math.abs(z2 - z1);

		if (dx + dy + dz == 0) {
			vset.push({x: tipx, y: tipy, z: tipz});
			continue;
		}

		let dMax = Math.max(Math.max(dx, dy), dz);
		if (dMax == dx) {
			for (let domstep = 0; domstep <= dx; domstep++) {
				tipx = x1 + domstep * (x2 - x1 > 0 ? 1 : -1);
				tipy = Math.round(y1 + domstep * (dy) / (dx) * (y2 - y1 > 0 ? 1 : -1));
				tipz = Math.round(z1 + domstep * (dz) / (dx) * (z2 - z1 > 0 ? 1 : -1));

				vset.push({x: tipx, y: tipy, z: tipz});
			}
		}
		else if (dMax == dy) {
			for (let domstep = 0; domstep <= dy; domstep++) {
				tipy = y1 + domstep * (y2 - y1 > 0 ? 1 : -1);
				tipx = Math.round(x1 + domstep * (dx) / (dy) * (x2 - x1 > 0 ? 1 : -1));
				tipz = Math.round(z1 + domstep * (dz) / (dy) * (z2 - z1 > 0 ? 1 : -1));

				vset.push({x: tipx, y: tipy, z: tipz});
			}
		}
		else /* if (dMax == dz) */ {
			for (let domstep = 0; domstep <= dz; domstep++) {
				tipz = z1 + domstep * (z2 - z1 > 0 ? 1 : -1);
				tipy = Math.round(y1 + domstep * (dy) / (dz) * (y2 - y1 > 0 ? 1 : -1));
				tipx = Math.round(x1 + domstep * (dx) / (dz) * (x2 - x1 > 0 ? 1 : -1));

				vset.push({x: tipx, y: tipy, z: tipz});
			}
		}
	}

	if (filled) {
		vset = getFilled2D(vset)
	}

	return vset
}
function getFilled2D(vset) {
	let vertices = []
	let triangles = []
	let vertexBacklog = []
	let centerAccum = new BlockVector3(0, 0, 0)
	let minimumPoint
	let maximumPoint
	let lastTriangle



	// vset.forEach(v => addVertex(new BlockVector3(v.x, v.y, v.z)))

	// let returnset = [...vset, ...[...vertices, ...vertexBacklog].map(v => ({x: v.x, y: v.y, z: v.z}))]
	let returnset = [...vset]
	let minx = vset.sort((a, b) => a.x - b.x)[0].x
	let maxx = vset.sort((a, b) => b.x - a.x)[0].x
	let miny = vset.sort((a, b) => a.y - b.y)[0].y
	let maxy = vset.sort((a, b) => b.y - a.y)[0].y
	let minz = vset.sort((a, b) => a.z - b.z)[0].z
	let maxz = vset.sort((a, b) => b.z - a.z)[0].z
	for (let x = minx; x <= maxx; x++) {
		for (let z = minz; z < maxz; z++) {
			if (contains(vset, miny, maxy, new BlockVector3(x, miny, z)))
				returnset.push({x, y: miny, z})
		}
	}
	// console.log('filled',vset.length, returnset)

	// eslint-disable-next-line no-unused-vars
	function addVertex(vertex) {
		if (!vertex) return false

		lastTriangle = null // Probably not necessary

		if (containsVertex(vertices, vertex)) return false

		let vertexD = vertex.toVector3()

		if (vertices.length === 3) {
			if (containsVertex(vertexBacklog, vertex)) return false

			if (containsRaw(vertex))
				return vertexBacklog.push(vertexD)
		}

		vertices.push(vertex)

		centerAccum = centerAccum.add(vertex)

		if (minimumPoint == null) {
			minimumPoint = maximumPoint = vertex;
		}
		else {
			minimumPoint = minimumPoint.getMinimum(vertex)
			maximumPoint = maximumPoint.getMaximum(vertex)
		}


		switch (vertices.length) {
			case 0:
			case 1:
			case 2:
				// Incomplete, can't make a mesh yet
				return true

			case 3:
				// Generate minimal mesh to start from
				triangles.push(new Triangle(vertices[0].toVector3(), vertices[1].toVector3(), vertices[2].toVector3()))
				triangles.push(new Triangle(vertices[0].toVector3(), vertices[2].toVector3(), vertices[1].toVector3()))
				return true

			default:
				break;
		}

		// Look for triangles that face the vertex and remove them
		const borderEdges = []
		triangles = triangles.filter(t => {
			// If the triangle can't be seen, it's not relevant
			if (!t.above(vertexD)) {
				return true
			}

			for (let i = 0; i < 3; ++i) {
				const edge = t.getEdge(i);
				if (borderEdges.filter(e => !e.equals(edge))) {
					// Remove the triangle from the mesh
					return false
				}

				// ...and remember its edges
				borderEdges.push(edge)
			}
			// Remove the triangle from the mesh
			return false
		})
		// let i = triangles.length
		// while (i--) {
		// 	const triangle = triangles[0];
		//
		// 	// If the triangle can't be seen, it's not relevant
		// 	if (!triangle.above(vertexD)) {
		// 		continue;
		// 	}
		//
		// 	// Remove the triangle from the mesh
		// 	triangle.splice(i, 1)
		//
		// 	// ...and remember its edges
		// 	for (let i = 0; i < 3; ++i) {
		// 		const edge = triangle.getEdge(i);
		// 		if (borderEdges.filter(e => !e.equals(edge))) {
		// 			continue
		// 		}
		//
		// 		borderEdges.push(edge)
		// 	}
		// }

		// Add triangles between the remembered edges and the new vertex.
		for (let edge of borderEdges) {
			triangles.push(edge.createTriangle(vertexD))
		}

		if (vertexBacklog.length > 0) {
			// Remove the new vertex
			vertices = vertices.filter(v => !v.equals(vertex))

			// Clone, clear and work through the backlog
			const vertexBacklog2 = [...vertexBacklog]
			vertexBacklog = []
			for (let vertex2 of vertexBacklog2) {
				addVertex(vertex2)
			}

			// Re-add the new vertex after the backlog.
			vertices.push(vertex)
		}

		return true;
	}
	function containsRaw(pt) {
		if (lastTriangle != null && lastTriangle.above(pt)) {
			return false;
		}

		for (const triangle of triangles) {
			if (lastTriangle === triangle) {
				continue;
			}

			if (triangle.above(pt)) {
				lastTriangle = triangle;
				return false;
			}
		}

		return true;
	}

	return returnset
}

function contains(points, minY, maxY, pt) {
	if (points.length < 3) return false

	let targetX = pt.x //wide
	let targetY = pt.y //height
	let targetZ = pt.z //depth

	if (targetY < minY || targetY > maxY) return false

	let inside = false;
	let npoints = points.length;
	let xNew;
	let zNew;
	let x1;
	let z1;
	let x2;
	let z2;
	let crossproduct;
	let i;

	let xOld = points[npoints - 1].x;
	let zOld = points[npoints - 1].z;

	for (i = 0; i < npoints; ++i) {
		xNew = points[i].x;
		zNew = points[i].z;
		//Check for corner
		if (xNew === targetX && zNew === targetZ) {
			return true;
		}
		if (xNew > xOld) {
			x1 = xOld;
			x2 = xNew;
			z1 = zOld;
			z2 = zNew;
		}
		else {
			x1 = xNew;
			x2 = xOld;
			z1 = zNew;
			z2 = zOld;
		}
		if (x1 <= targetX && targetX <= x2) {
			crossproduct = (targetZ - z1) * (x2 - x1)
				- (z2 - z1) * (targetX - x1);
			if (crossproduct === 0) {
				if ((z1 <= targetZ) === (targetZ <= z2)) {
					return true; //on edge
				}
			}
			else if (crossproduct < 0 && (x1 !== targetX)) {
				inside = !inside;
			}
		}
		xOld = xNew;
		zOld = zNew;
	}

	return inside;
}

function containsVertex(array, v) {
	return array.some(a => a.x === v.x && a.y === v.y && a.z === v.z)
}