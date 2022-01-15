import * as THREE from 'three'

function JsonModel(name, rawModel, texturesReference, clipUVs) {
	// set default clip value to true
	if (clipUVs === undefined) {
		clipUVs = true
	}

	// parent constructor
	THREE.Object3D.call(this)

	// set modelName
	this.modelName = name

	// track animation
	this.animationLoop = true

	// parse model or throw an error if parsing fails
	let model
	if (typeof rawModel === 'object' && rawModel !== null)
		model = rawModel
	else {
		try {
			model = JSON.parse(rawModel)
		} catch (e) {
			throw new Error('Couldn\'t parse json model. ' + e.message + '.')
		}
	}


	// get textures and handle animated textures
	const textures = {}
	const references = []

	const animated = []
	const animations = []

	if (model.hasOwnProperty('textures')) {
		Object.keys(model.textures).forEach(key => {
			// get texture reference value
			const temp = model.textures[key].split('/')
			const textureName = temp[temp.length - 1]

			// look for this value in the textures passed in parameter
			let reference = texturesReference.find(a => a.name === key)

			if (reference.hasOwnProperty('ref'))
				reference = texturesReference.find(a => a.name === reference.ref.replace('#', ''))

			// register the texture or throw an error if the name wasn't in the textures passed in parameter
			let frame;
			if (reference) {
				references.push(key)

				// handle animated textures
				if (reference.hasOwnProperty('mcmeta')) {
					let mcmeta
					// parse mcmeta
					if (typeof reference.mcmeta === 'object' && reference.mcmeta !== null)
						mcmeta = rawModel
					else {
						try {
							mcmeta = JSON.parse(reference.mcmeta)
						} catch (e) {
							throw new Error('Couldn\'t parse mcmeta for texture "' + textureName + '". ' + e.message + '.')
						}
					}

					// check property
					if (!mcmeta.hasOwnProperty('animation'))
						throw new Error('Couldn\'t find the "animation" property in mcmeta for texture "' + textureName + '"')

					// image buffer to access width and height from dataURL
					const imageBuffer = new Image()
					imageBuffer.src = reference.texture

					const width = imageBuffer.width;
					const height = imageBuffer.height;

					// check if dimensions are valid
					if (height % width !== 0)
						throw new Error('Image dimensions are invalid for texture "' + textureName + '".')

					// get frames from mcmeta or generate them
					let frames = [];

					if (mcmeta.animation.hasOwnProperty('frames'))
						frames = mcmeta.animation.frames
					else
						for (let k = 0; k < height / width; k++) frames.push(k)


					// default value for frametime
					const frametime = mcmeta.animation.frametime || 1;

					// uniform animation frames
					const animation = [];

					for (let i = 0; i < frames.length; i++) {
						frame = frames[i]
						if (typeof frame == 'number') {
							animation.push({index: frame, time: frametime})
						} else {
							if (!frame.hasOwnProperty('index'))
								throw new Error('Invalid animation frame at index "' + i + '" in mcmeta for texture "' + textureName + '".')
							animation.push({index: frame.index, time: frame.time || frametime})
						}
					}

					// number of vertical frames
					const numberOfImages = height / width;

					// register animation
					animations.push({height: numberOfImages, frames: animation, currentFrame: 0})
					animated.push(references.length - 1)

					// split frames
					const images = [];

					for (let i = 0; i < height / width; i++) {
						// workspace
						const canvas = document.createElement('canvas');
						canvas.width = width
						canvas.height = height

						const ctx = canvas.getContext('2d');
						ctx.drawImage(imageBuffer, 0, -i * width)

						images.push(canvas.toDataURL('image/png'))

					}
					// register textures
					textures[key] = images
				} else
					// register texture
					textures[key] = reference.texture
			}
			else throw new Error('Couldn\'t find matching texture for texture reference "' + textureName + '".')
		})
	}
	else throw new Error('Couldn\'t find "textures" property.')

	// access this.animationLoop
	let self = this;

	// generate material
	const materials = []

	// final material is made of several different materials, one for each texture
	references.forEach(function (ref, index) {
		// if animated texture, get the first frame
		const image = textures[ref] instanceof Array ? textures[ref][0] : textures[ref];

		// create three js texture from image
		const loader = new THREE.TextureLoader();
		const texture = loader.load(image);

		// sharp pixels and smooth edges
		texture.magFilter = THREE.NearestFilter
		texture.minFilter = THREE.LinearFilter

		// map texture to material, keep transparency and fix transparent z-fighting
		const mat = new THREE.MeshLambertMaterial({map: texture, transparent: true, alphaTest: 0.5});

		materials.push(mat)

		// if animated texture
		if (textures[ref] instanceof Array) {

			// get texture array and animation frames
			const images = textures[ref];
			const animation = animations[animated.indexOf(index)]
				// keep scope
			;(function (material, images, animation) {
				// recursively called with a setTimeout
				const animateTexture = function () {
					const frame = animation.frames[animation.currentFrame];
					// Prevent crashing with big animated textures
					try {
						material.map.image.src = images[frame.index]
						animation.currentFrame = animation.currentFrame < animation.frames.length - 1 ? animation.currentFrame + 1 : 0
					} catch (e) {
						console.log(e.message)
					}

					window.setTimeout(function () {
						if (self.animationLoop)
							window.requestAnimationFrame(animateTexture)
					}, frame.time * 50) // multiplied by the length of a minecraft game tick (50ms)

				}
				// initialize recursion
				window.requestAnimationFrame(animateTexture)
			})(mat, images, animation)
		}
	})

	// extra transparent material for hidden faces
	const transparentMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, alphaTest: 0.5})
	materials.push(transparentMaterial)

	const missingMaterial = new THREE.MeshLambertMaterial({color: 0xFF00FF})
	materials.push(missingMaterial)

	// big material list from all the other materials
	// const material = new THREE.MultiMaterial(materials)

	// create geometry
	// get elements or throw an error if the "elements" property can't be found
	let elements;
	if (model.hasOwnProperty('elements')) elements = model.elements
	else throw new Error('Couldn\'t find "elements" property')

	// generate mesh
	const group = new THREE.Group()
	elements.forEach((element, index) => {
		let i;
		let map;
		let pivot;
		// check properties
		if (!element.hasOwnProperty('from'))
			throw new Error('Couldn\'t find "from" property for element "' + index + '".')
		if (!(element['from'].length === 3))
			throw new Error('"from" property for element "' + index + '" is invalid.')

		if (!element.hasOwnProperty('to'))
			throw new Error('Couldn\'t find "to" property for element "' + index + '".')
		if (!(element['to'].length === 3))
			throw new Error('"to" property for element "' + index + '" is invalid.')

		for (i = 0; i < 3; i++) {
			const f = element['from'][i];
			const t = element['to'][i];
			if (typeof f != 'number' || f < -16)
				throw new Error('"from" property for element "' + index + '" is invalid (got "' + f + '" for coordinate "' + ['x', 'y', 'z'][i] + '").')
			if (typeof t != 'number' || t > 32)
				throw new Error('"to" property for element "' + index + '" is invalid (got "' + t + '" for coordinate "' + ['x', 'y', 'z'][i] + '").')
			if (t - f < 0)
				throw new Error('"from" property is bigger than "to" property for coordinate "' + ['x', 'y', 'z'][i] + '" in element "' + index + '".')
		}


		// get dimensions and origin
		const width = element['to'][0] - element['from'][0];
		const height = element['to'][1] - element['from'][1];
		const length = element['to'][2] - element['from'][2];

		const origin = {
			x: (element['to'][0] + element['from'][0]) / 2 - 8,
			y: (element['to'][1] + element['from'][1]) / 2 - 8,
			z: (element['to'][2] + element['from'][2]) / 2 - 8
		};

		// create geometry
		const vertices = [
			// front
			{ pos: [0, 0, length], norm: [ 0,  0,  1], uv: [0, 0], },           // 0
			{ pos: [width, 0, length], norm: [ 0,  0,  1], uv: [1, 0], },       // 1
			{ pos: [0, height, length], norm: [ 0,  0,  1], uv: [0, 1], },      // 2
			{ pos: [width, height, length], norm: [ 0,  0,  1], uv: [1, 1], },  // 3
			// right
			{ pos: [width, 0, length], norm: [ 1,  0,  0], uv: [0, 0], },       // 4
			{ pos: [width, 0, 0], norm: [ 1,  0,  0], uv: [1, 0], },            // 5
			{ pos: [width, height, length], norm: [ 1,  0,  0], uv: [0, 1], },  // 6
			{ pos: [width, height, 0], norm: [ 1,  0,  0], uv: [1, 1], },       // 7
			// back
			{ pos: [width, 0, 0], norm: [ 0,  0, -1], uv: [0, 0], },            // 8
			{ pos: [0, 0, 0], norm: [ 0,  0, -1], uv: [1, 0], },                // 9
			{ pos: [width, height, 0], norm: [ 0,  0, -1], uv: [0, 1], },       // 10
			{ pos: [0, height, 0], norm: [ 0,  0, -1], uv: [1, 1], },           // 11
			// left
			{ pos: [0, 0, 0], norm: [-1,  0,  0], uv: [0, 0], },                // 12
			{ pos: [0, 0, length], norm: [-1,  0,  0], uv: [1, 0], },           // 13
			{ pos: [0, height, 0], norm: [-1,  0,  0], uv: [0, 1], },           // 14
			{ pos: [0, height, length], norm: [-1,  0,  0], uv: [1, 1], },      // 15
			// top
			{ pos: [width, height, 0], norm: [ 0,  1,  0], uv: [0, 0], },       // 16
			{ pos: [0, height, 0], norm: [ 0,  1,  0], uv: [1, 0], },           // 17
			{ pos: [width, height, length], norm: [ 0,  1,  0], uv: [0, 1], },  // 18
			{ pos: [0, height, length], norm: [ 0,  1,  0], uv: [1, 1], },      // 19
			// bottom
			{ pos: [width, 0, length], norm: [ 0, -1,  0], uv: [0, 0], },       // 20
			{ pos: [0, 0, length], norm: [ 0, -1,  0], uv: [1, 0], },           // 21
			{ pos: [width, 0, 0], norm: [ 0, -1,  0], uv: [0, 1], },            // 22
			{ pos: [0, 0, 0], norm: [ 0, -1,  0], uv: [1, 1], },                // 23
		]
		const positions = []
		const normals = []
		const uvs = []
		for (const vertex of vertices) {
			positions.push(...vertex.pos)
			normals.push(...vertex.norm)
			uvs.push(...vertex.uv)
		}

		const geometry = new THREE.BufferGeometry()
		const positionNumComponents = 3
		const normalNumComponents = 3
		const uvNumComponents = 2
		geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents))
		geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents))
		geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents))
		geometry.setIndex([
			0,   1,  2,  2,  1,  3,
			4,   5,  6,  6,  5,  7,
			8,   9, 10, 10,  9, 11,
			12, 13, 14, 14, 13, 15,
			16, 17, 18, 18, 17, 19,
			20, 21, 22, 22, 21, 23,
		])

		geometry.clearGroups()

		// assign materials
		if (element.hasOwnProperty('faces')) {
			const faces = ['east', 'west', 'up', 'down', 'south', 'north'];
			let uvs = []

			for (i = 0; i < 6; i++) {
				const face = faces[i]

				if (element.faces.hasOwnProperty(face)) {
					// check properties
					if (!element.faces[face].hasOwnProperty('texture'))
						throw new Error('Couldn\'t find "texture" property for "' + face + '" face in element "' + index + '".')
					if (!element.faces[face].hasOwnProperty('uv')) {
						console.warn('Couldn\'t find "uv" property for "' + face + '" face in element "' + index + '".')
						element.faces[face].uv = [0, 0, 16, 16]//TODO worldspace?
					}
					if (element.faces[face].uv.length !== 4)
						throw new Error(`The "uv" property for "${face}" face in element "${index}" is invalid (got "${element.faces[face].uv}").`)

					// get texture index
					const ref = element.faces[face].texture
					const textureIndex = references.indexOf(ref[0] === '#' ? ref.substring(1) : ref)

					// check if texture has been registered
					let missingTexture = false
					if (textureIndex < 0)
						if (ref === '#missing') {
							console.error(`The "texture" property for "${face}" face in element "${index}" is invalid (got "${ref}").`)
							missingTexture = true
						}
						else throw new Error('The "texture" property for "' + face + '" face in element "' + index + '" is invalid (got "' + ref + '").')

					geometry.addGroup(12 * i, 12 * (i + 1), missingTexture ? materials.length - 1 : textureIndex)

					// uv map
					let uv = element.faces[face].uv

					// check
					if (clipUVs) {
						uv.forEach((e, pos) => {
							if (typeof e != 'number')
								throw new Error('The "uv" property for "' + face + '" face in element "' + index + '" is invalid (got "' + e + '" at index "' + pos + '").')
						})
						uv.map(e => {
							if (e + 0.00001 < 0) return 0
							else if (e - 0.00001 > 16) return 16
							else return e
						})
					}
					else {
						uv.forEach((e, pos) =>{
							if (typeof e != 'number' || e + 0.00001 < 0 || e - 0.00001 > 16)
								throw new Error('The "uv" property for "' + face + '" face in element "' + index + '" is invalid (got "' + e + '" at index "' + pos + '").')
						})
					}

					uv = uv.map(a => a / 16)

					// fix edges
					uv[0] += 0.0005
					uv[1] += 0.0005
					uv[2] -= 0.0005
					uv[3] -= 0.0005

					map = [
						new THREE.Vector2(uv[0], 1 - uv[1]),
						new THREE.Vector2(uv[0], 1 - uv[3]),
						new THREE.Vector2(uv[2], 1 - uv[3]),
						new THREE.Vector2(uv[2], 1 - uv[1])
					]

					if (element.faces[face].hasOwnProperty('rotation')) {
						const amount = element.faces[face].rotation;

						// check property
						if (!([0, 90, 180, 270].indexOf(amount) >= 0))
							throw new Error('The "rotation" property for "' + face + '" face in element "' + index + '" is invalid (got "' + amount + '").')

						// rotate map
						for (let j = 0; j < amount / 90; j++) {
							map = [map[1], map[2], map[3], map[0]]
						}
					}

					//TODO uv
					uvs.push([map[1], map[2], map[0], map[3]])
				}
				else {
					// transparent material
					geometry.addGroup(12 * i, 12 * (i + 1), references.length)

					map = [
						new THREE.Vector2(0, 0),
						new THREE.Vector2(1, 0),
						new THREE.Vector2(1, 1),
						new THREE.Vector2(0, 1)
					];

					uvs.push([map[3], map[2], map[0], map[1]])
				}
			}
			uvs = [uvs[4], uvs[5], uvs[0], uvs[1], uvs[2], uvs[3]]
			uvs = uvs.flat().flatMap(a => [a.x, a.y])
			geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents))
		}

		// create mesh
		const mesh = new THREE.Mesh(geometry, materials);
		mesh.castShadow = true
		mesh.receiveShadow = true
		mesh.position.x = origin.x - width/2
		mesh.position.y = origin.y - height/2
		mesh.position.z = origin.z - length/2

		// rotate if "rotation" property is defined
		if (element.hasOwnProperty('rotation')) {
			// check properties
			if (!element.rotation.hasOwnProperty('origin'))
				throw new Error('Couldn\'t find "origin" property in "rotation" for element "' + index + '".')
			if (!(element.rotation.origin.length === 3))
				throw new Error('"origin" property in "rotation" for element "' + index + '" is invalid.')

			if (!element.rotation.hasOwnProperty('axis'))
				throw new Error('Couldn\'t find "axis" property in "rotation" for element "' + index + '".')
			if (!((['x', 'y', 'z']).indexOf(element.rotation.axis) >= 0))
				throw new Error('"axis" property in "rotation" for element "' + index + '" is invalid.')

			if (!element.rotation.hasOwnProperty('angle'))
				throw new Error('Couldn\'t find "angle" property in "rotation" for element "' + index + '".')
			if (!(([45, 22.5, 0, -22.5, -45]).indexOf(element.rotation.angle) >= 0))
				throw new Error('"angle" property in "rotation" for element "' + index + '" is invalid.')

			// get origin, axis and angle
			const rotationOrigin = {
				x: element.rotation.origin[0] - 8,
				y: element.rotation.origin[1] - 8,
				z: element.rotation.origin[2] - 8
			};

			const axis = element.rotation.axis;
			const angle = element.rotation.angle;


			// create pivot
			pivot = new THREE.Group();
			pivot.position.x = rotationOrigin.x
			pivot.position.y = rotationOrigin.y
			pivot.position.z = rotationOrigin.z

			pivot.add(mesh)

			// adjust mesh coordinates
			mesh.position.x -= rotationOrigin.x
			mesh.position.y -= rotationOrigin.y
			mesh.position.z -= rotationOrigin.z

			// rotate pivot
			if (axis === 'x')
				pivot.rotateX(angle * Math.PI / 180)
			else if (axis === 'y')
				pivot.rotateY(angle * Math.PI / 180)
			else if (axis === 'z')
				pivot.rotateZ(angle * Math.PI / 180)

			// add pivot
			group.add(pivot)
		}
		else {
			pivot = new THREE.Group();
			pivot.add(mesh)

			// add pivot
			group.add(pivot)
		}
	})

	// add group
	this.add(group)

	// register display options
	const keys = ['thirdperson_righthand', 'thirdperson_lefthand', 'firstperson_righthand', 'firstperson_lefthand', 'gui', 'head', 'ground', 'fixed'];

	this.displayOptions = {}

	for (let i = 0; i < keys.length; i++) {
		this.displayOptions[keys[i]] = {rotation: [0, 0, 0], translation: [0, 0, 0], scale: [1, 1, 1]}
	}

	this.displayOptions.firstperson = this.displayOptions.firstperson_righthand
	this.displayOptions.thirdperson = this.displayOptions.thirdperson_righthand

	if (model.hasOwnProperty('display')) {
		const display = model.display;

		for (const option in display) {
			if (this.displayOptions.hasOwnProperty(option)) {
				const fields = display[option];

				for (const name in fields) {
					if (this.displayOptions[option].hasOwnProperty(name)) {
						const field = fields[name];

						// check value
						if (field.length != 3 || typeof field[0] != 'number' || typeof field[1] != 'number' || typeof field[2] != 'number')
							throw new Error('"' + name + '" property is invalid for display option "' + option + '".')

						this.displayOptions[option][name] = field
					}
				}

			}
		}

	}

	// methods
	self = this;

	// getCenter
	this.getCenter = function () {
		const group = self.children[0]

		// compute absolute bounding box
		const box = new THREE.Box3().setFromObject(group)
		// const box = {
		// 	minx: 0, miny: 0, minz: 0,
		// 	maxx: 0, maxy: 0, maxz: 0
		// }
		// for (let i = 0; i < group.children.length; i++) {
		// 	const pivot = group.children[i]
		// 	const mesh = pivot.children[0]
		//
		// 	for (let j = 0; j < mesh.geometry.vertices.length; j++) {
		// 		// convert vertex coordinates to world coordinates
		// 		const vertex = mesh.geometry.vertices[j].clone();
		// 		const abs = mesh.localToWorld(vertex);
		//
		// 		// update bounding box
		// 		if (abs.x < box.minx) box.minx = abs.x
		// 		if (abs.y < box.miny) box.miny = abs.y
		// 		if (abs.z < box.minz) box.minz = abs.z
		//
		// 		if (abs.x > box.maxx) box.maxx = abs.x
		// 		if (abs.y > box.maxy) box.maxy = abs.y
		// 		if (abs.z > box.maxz) box.maxz = abs.z
		//
		// 	}
		//
		// }
		// return the center of the bounding box
		return new THREE.Vector3(
			(box.min.x + box.max.x) / 2,
			(box.min.y + box.max.y) / 2,
			(box.min.z + box.max.z) / 2
		)

	}

	this.getBBox = () => new THREE.Box3().setFromObject(self.children[0])

	// applyDisplay
	this.applyDisplay = function (option) {
		const group = self.children[0];

		if (option === 'block') {
			// reset transformations
			group.rotation.set(0, 0, 0)
			group.position.set(0, 0, 0)
			group.scale.set(1, 1, 1)
		}
		else {
			if (!self.displayOptions.hasOwnProperty(option))
				throw new Error('Display option is invalid.')

			const options = self.displayOptions[option];

			const rot = options.rotation;
			const pos = options.translation;
			const scale = options.scale;

			// apply transformations
			group.rotation.set(rot[0] * Math.PI / 180, rot[1] * Math.PI / 180, rot[2] * Math.PI / 180)
			group.position.set(pos[0], pos[1], pos[2])
			group.scale.set(scale[0] === 0 ? 0.00001 : scale[0], scale[1] === 0 ? 0.00001 : scale[1], scale[2] === 0 ? 0.00001 : scale[2])
		}
	}
}

JsonModel.prototype = Object.create(THREE.Object3D.prototype)
JsonModel.prototype.constructor = JsonModel


export {JsonModel}
