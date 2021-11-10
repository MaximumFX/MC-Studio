// import * as THREE from 'three'

export const CompileModel = async (id, state, namespace = 'minecraft') => {
	let blockState = require(`@/assets/minecraft/1.16.4/assets/${namespace}/blockstates/${id}.json`)
	let selection = []
	if (blockState.hasOwnProperty('variants')) {
		let variants = Object.entries(blockState.variants)
		if (variants.length === 1) { // Doesn't have different states
			selection.push(variants[0][1])
		}
		else {// Has different states
			variants = variants.map(a => [a[0].split(','), a[1]])
				.sort((a, b) => {//Sort and get most matching
					let aCount = 0, bCount = 0
					a[0].forEach(aState => {
						if (state.includes(aState)) aCount++
					})
					b[0].forEach(bState => {
						if (state.includes(bState)) bCount++
					})
					return bCount - aCount
				})
			selection.push(variants[0][1])
		}
	}
	else if (blockState.hasOwnProperty('multipart')) {
		const parts = blockState.multipart
		parts.forEach(part => {
			if (part.hasOwnProperty('when')) {
				if (part.when.hasOwnProperty('OR')) {
					if (matchesCase(state, part.when.OR))
						selection.push(part.apply)
				}
				else if (matchesCase(state, part.when))
					selection.push(part.apply)
			}
			else selection.push(part.apply)
		})
	}

	console.groupCollapsed(id)
	console.log(id, state, namespace)
	console.log('blockState', blockState)
	selection.map(s => {
		if (Array.isArray(s)) {
			console.log('isArray', s.length)
			return s[Math.floor(Math.random() * s.length)]//TODO support weighted
		}
		else return s
	})
	console.log('selection', selection)

	let model = {
		elements: [],
		textures: {},
		display: {},
		ambientocclusion: true
	}

	// eslint-disable-next-line no-async-promise-executor
	const loadParent = (m, transform) => new Promise(async resolve => {
		let parent = {}
		if (m.parent.includes(':'))
			parent = require(`@/assets/minecraft/1.16.4/assets/${m.parent.split(':')[0]}/models/${m.parent.split(':')[1]}.json`)
		else if (!m.parent.startsWith('builtin'))
			parent = require(`@/assets/minecraft/1.16.4/assets/minecraft/models/${m.parent}.json`)

		if (parent.hasOwnProperty('parent')) await loadParent(parent, transform)

		if (parent.hasOwnProperty('display'))
			for (const d in parent.display) model.display[d] = parent.display[d]

		if (parent.hasOwnProperty('textures'))
			for (const t in parent.textures) model.textures[t] = parent.textures[t]

		if (parent.hasOwnProperty('elements'))
			model.elements = transformElements(parent.elements, transform)

		if (parent.hasOwnProperty('ambientocclusion'))
			model.ambientocclusion = parent.ambientocclusion

		resolve()
	})
	let parentHasElements = model.elements.length
	let looped = false
	for (const m of selection) {
		let json = require(`@/assets/minecraft/1.16.4/assets/${m.model.split(':')[0]}/models/${m.model.split(':')[1]}.json`)
		console.log('json', m, json)

		if (m.hasOwnProperty('x'))
			console.log('Rotate x:', m.x)
		if (m.hasOwnProperty('y'))
			console.log('Rotate y:', m.y)
		if (m.hasOwnProperty('uvlock'))
			console.log('UV lock:', m.uvlock)
		let transform = {
			x: m.hasOwnProperty('x') ? m.x : 0,
			y: m.hasOwnProperty('y') ? m.y : 0,
			uvlock: m.hasOwnProperty('uvlock') ? m.uvlock : false
		}

		if (json.hasOwnProperty('parent')) await loadParent(json, transform)

		if (json.hasOwnProperty('display'))
			for (const d in json.display) model.display[d] = json.display[d]

		if (json.hasOwnProperty('textures'))
			for (const t in json.textures) model.textures[t] = json.textures[t]

		if (json.hasOwnProperty('elements')) {
			if (!looped && parentHasElements) model.elements = []
			model.elements.push(...transformElements(json.elements, transform))
		}

		if (json.hasOwnProperty('ambientocclusion'))
			model.ambientocclusion = json.ambientocclusion

		looped = true
	}

	console.log('MODEL', model)

	console.groupEnd()
	return model
}

const matchesCase = (state, conditions) => {
	if (!Array.isArray(conditions)) conditions = [conditions]
	if (!state) return false

	let matches = false
	conditions.forEach(c => {//if one matches, true
		if (!matches) matches = Object.entries(c).map(e => {//if all match
			let res = false
			e[1].split('|').forEach(a => {
				if (!res) res = state.includes(`${e[0]}=${a}`)
			})
			return res
		}).every(a => a)
	})
	return matches
}

const transformElements = (elements, transform) => {
	console.log([...elements], transform)
	if (![0, 90, 180, 270].includes(transform.x)) {
		console.error('The "rotation" property for "x" is invalid (got "' + transform.x + '").')
		transform.x = 0
	}
	if (![0, 90, 180, 270].includes(transform.y)) {
		console.error('The "rotation" property for "y" is invalid (got "' + transform.y + '").')
		transform.y = 0
	}
	if (![true, false].includes(transform.uvlock)) {
		console.error('The "rotation" property for "uvlock" is invalid (got "' + transform.uvlock + '").')
		transform.uvlock = false
	}

	let newElements = [];

	[...elements].forEach(el => {
		const from = el.from, to = el.to

		console.log('from', from.join(', '))
		console.log('to', to.join(', '))
		// const center = [
		// 	(from[0] + to[0]) / 2,
		// 	(from[1] + to[1]) / 2,
		// 	(from[2] + to[2]) / 2
		// ]
		// console.log('center', center.join(', '))
		//
		// const cube = new THREE.BoxGeometry(
		// 	Math.abs(from[0] - to[0]),
		// 	Math.abs(from[1] - to[1]),
		// 	Math.abs(from[2] - to[2]),
		// )
		// const mesh = new THREE.Mesh(cube)
		// mesh.position.set(-8, -8, -8)
		// const pivot = new THREE.Object3D()
		// pivot.add(mesh)
		// pivot.rotation.set(transform.x/180*Math.PI, transform.y/180*Math.PI, 0)
		// pivot.position.set(8, 8, 8)
		// const box = new THREE.Box3().setFromObject(pivot)
		// console.log(`[${box.min.x}, ${box.min.y}, ${box.min.z}], [${box.max.x}, ${box.max.y}, ${box.max.z}]`)

		let x = [from[0], to[0]]
		let y = [from[1], to[1]]
		let z = [from[2], to[2]]

		if (transform.y === 90) {
			x = x.map(a => a)
			z = z.map(a => 16 - a)
		}
		else if (transform.y === 180) {
			x = x.map(a => 16 - a)
			z = z.map(a => 16 - a)
		}
		else if (transform.y === 270) {
			x = x.map(a => 16 - a)
			z = z.map(a => a)
		}
		if (transform.x === 90) {
			x = x.map(a => 16 - a)
			y = y.map(a => a)
		}
		else if (transform.x === 180) {
			x = x.map(a => a)
			y = y.map(a => 16 - a)
		}
		else if (transform.x === 270) {
			x = x.map(a => 16 - a)
			y = y.map(a => 16 - a)
		}

		x = x.sort((a, b) => a - b)
		y = y.sort((a, b) => a - b)
		z = z.sort((a, b) => a - b)

		const newEl = {...el}
		newEl.from = [ x[0], y[0], z[0] ]
		newEl.to = [ x[1], y[1], z[1] ]

		// TODO uv

		// rotate
		// const angle = transform.x * Math.PI / 180.0
		// const rot = {
		// 	x: [
		// 		Math.cos(angle) * (from[0]-origin) - Math.sin(angle) * (from[2]-origin) + origin,
		// 		Math.sin(angle) * (to[0]-origin) + Math.cos(angle) * (to[2]-origin) + origin
		// 	].sort().map(a => Math.ceil(a * 100000)/100000),//todo ceil floor round?
		// 	z: [
		// 		Math.cos(angle) * (to[0]-origin) - Math.sin(angle) * (to[2]-origin) + origin,
		// 		Math.sin(angle) * (from[0]-origin) + Math.cos(angle) * (from[2]-origin) + origin
		// 	].sort().map(a => Math.ceil(a * 100000)/100000)//todo ceil floor round?
		// }
		// console.log('ROTAS', angle, rot, from, to)
		// el.from = [rot.x[0], from[1], rot.z[0]]
		// el.to = [rot.x[1], to[1], rot.z[1]]

		// for (let j = 0; j < transform.x / 90; j++) {
		// 	let from = el.from, to = el.to
		// 	el.from = [from[2], from[1], from[0]]
		// 	el.to =   [  to[2],   to[1],   to[0]]
		// }
		// for (let j = 0; j < transform.y / 90; j++) {
		// 	let from = el.from
		// 	el.from = [el.to[0], el.to[1], el.to[2]]
		// 	el.to =   [ from[0],  from[1],  from[2]]
		// }
		newElements.push(newEl)
	})
	return newElements
}