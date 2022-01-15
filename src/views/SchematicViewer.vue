<template>
	<main id="schematic-viewer">
		<nav class="navbar navbar-expand-lg navbar-dark bg-mcs-secondary">
			<div class="container-fluid justify-content-start">
				<div class="navbar-expand" id="navbarNav">
					<ul class="navbar-nav me-2">
						<li class="nav-item">
							<router-link to="/" class="nav-link active"><i class="fas fa-chevron-left"></i> Back</router-link>
						</li>
					</ul>
				</div>
				<form class="ms-auto d-flex">
					<button class="btn btn-success" type="button" @click="openFile">Open file</button>
				</form>
			</div>
		</nav>
		<section ref="container"></section>
	</main>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from 'three/examples/jsm/libs/stats.module';
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
// import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { ipcRenderer } from "electron"
import fs from "fs"
import { parse } from "prismarine-nbt"
import { JsonModel } from '@/minecraft/JsonModel'
import { CompileModel } from '@/minecraft/CompileModel'

const version = '1.18-rc3'

let camera, scene, renderer, stats
let objects = []

export default {
	name: "SchematicViewer",
	data() {
		return {
			camera: null,
			scene: null,
			renderer: null,
			objects: null
		}
	},
	methods: {
		async openFile() {
			ipcRenderer.invoke('openFileDialog').then(async result => {
				if (result.canceled !== true) {
					console.log('res',result)
					const file = result.filePaths[0]
					const buffer = await fs.readFileSync(file)
					const { parsed, type } = await parse(buffer)
					this.data = parsed
					console.log('JSON serialized:', parsed, type)

					//Reset workspace
					objects.forEach(obj => {
						scene.remove(obj)
						obj.geometry.dispose()
						obj.material.dispose()
					})
					objects = []

					let size = [0, 0, 0]
					let blocks = []
					// eslint-disable-next-line no-unused-vars
					const block = {
						x: 0, y: 0, z: 0,
						paletteId: '5'
					}
					let palette = []
					// eslint-disable-next-line no-unused-vars
					let paletteItem = {
						id: '0',
						material: 'minecraft:stone_brick_wall',
						state: [
							'waterlogged=false',
							'facing=east'
						]
					}
					let models = []
					let textures = {}

					if (file.endsWith('.nbt')) {
						size = parsed.value.size.value.value

						// BLOCKS
						parsed.value.blocks.value.value.forEach(b => {
							blocks.push({
								x: b.pos.value.value[0],
								y: b.pos.value.value[1],
								z: b.pos.value.value[2],
								paletteId: b.state.value
							})
						})

						// PALETTE
						palette = new Array(parsed.value.palette.value.value.length)
						parsed.value.palette.value.value.forEach((p, index) => {
							let entry = {
								id: index,
								material: p.Name.value,
							}
							if (p.hasOwnProperty('Properties'))
								entry.state = Object.entries(p.Properties.value).map(e => `${e[0]}=${e[1].value}`)
							palette[index] = entry

							// let name = p.Name.value
							// if (name !== 'minecraft:air') {
							// 	let material = name
							// 	if (material.endsWith('_wall')) material = material.replace('_wall', '')
							//
							// 	if (!textures.hasOwnProperty(name)) {
							// 		const texture = new THREE.TextureLoader()
							// 			.load(
							// 				require(`@/assets/minecraft/${version}/assets/${name.split(':')[0]}/textures/block/${material.split(':')[1]}.png`),
							// 				t => this.onLoad(t),
							// 				e => this.onProgress(e),
							// 				e => this.onError(e)
							// 			)
							// 		texture.magFilter = THREE.NearestFilter
							// 		texture.minFilter = THREE.LinearMipMapLinearFilter
							// 		textures[name] = texture
							// 	}
							// }
						})
					}
					else if (file.endsWith('.schem')) {
						size = [parsed.value.Width.value, parsed.value.Height.value, parsed.value.Length.value]

						// BLOCKS
						for (let xi = 0; xi < size[0]; xi++) {
							for (let yi = 0; yi < size[1]; yi++) {
								for (let zi = 0; zi < size[2]; zi++) {
									let i = (yi * size[2] + zi) * size[0] + xi
									let block = Math.abs(parsed.value.BlockData.value[i])
									blocks.push({
										x: xi, y: yi, z: zi,
										paletteId: block,
									})
								}
							}
						}

						// PALETTE
						palette = new Array(parsed.value.PaletteMax.value)
						Object.entries(parsed.value.Palette.value).forEach(p => {
							let entry = {
								id: p[1].value,
								material: p[0].split('[')[0],
							}
							if (p[0].includes('['))
								entry.state = p[0].split('[')[1].slice(0, -1).split(',')
							palette[p[1].value] = entry
						})
					}

					// Filter out air
					const air = palette.find(p => p.material === 'minecraft:air')
					if (air)
						blocks = blocks.filter(b => b.paletteId !== air.id)

					console.log('size', size)
					console.log('blocks', blocks)
					console.log('palette', palette)

					console.groupCollapsed('Models')
					for (const p of palette) {
						let model = await CompileModel(p.material.split(':')[1], p.state, p.material.split(':')[0])
						models.push({
							paletteId: p.id,
							model
						})
						Object.values(model.textures).forEach(e => {
							if (!e.startsWith('#')) {//TODO
								let namespace = e.includes(':') ? e.split(':')[0] : 'minecraft'
								let id = e.includes(':') ? e.split(':')[1] : e
								if (!textures.hasOwnProperty(`${namespace}:${id}`)) {
									let tex = {
										texture: require(`@/assets/minecraft/${version}/assets/${namespace}/textures/${id}.png`)
									}
									if (fs.existsSync(`@/assets/minecraft/${version}/assets/${namespace}/textures/${id}.png.mcmeta`)) {
										tex.mcmeta = fs.readFileSync(`@/assets/minecraft/${version}/assets/${namespace}/textures/${id}.png.mcmeta`)
									}
									textures[`${namespace}:${id}`] = tex
								}
							}
						})
					}
					console.groupEnd()

					console.log('textures', textures)
					console.log('models', models)

					blocks.forEach(b => {
						let model = models.find(m => m.paletteId === b.paletteId)
						if (model) {
							let tex = []
							Object.entries(model.model.textures).forEach(e => {
								if (!e[1].startsWith('#')) {//TODO
									let namespace = e[1].includes(':') ? e[1].split(':')[0] : 'minecraft'
									let id = e[1].includes(':') ? e[1].split(':')[1] : e[1]
									tex.push({
										name: e[0],
										...textures[`${namespace}:${id}`]
									})
								}
								else tex.push({name: e[0], ref: e[1]})
							})
							// console.log('Block', b, model, tex)
							const jsonModel = new JsonModel('name', model.model, tex)
							// console.log(jsonModel)
							const g = new THREE.Group()
							g.add(jsonModel)
							// g.position.y = - jsonModel.getBBox().min.y/16
							g.position.set(
								b.x - Math.floor(size[0] / 2) - .5,
								b.y + .5,
								b.z - Math.floor(size[2] / 2) - .5)
							g.scale.setScalar(1 / 16)
							scene.add(g)
						}
						else console.warn('[SchematicViewer openFile] Couldn\'t find model for block.', b)
					})
					// blocks.filter(b => b.material !== 'minecraft:air').forEach(block => {
					// 	console.log(block)
						// console.log(textures)
						// let geometry = new THREE.BoxGeometry(1, 1, 1)
						//
						// let params = {}
						// if (textures.hasOwnProperty(block.material))
						// 	params = { map: textures[block.material] }
						// // else console.error('no mat', block)
						// let mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(params))
						//
						// mesh.position.set(
						// 	block.x - Math.floor(size[0]/2) - .5,
						// 	block.y + .5,
						// 	block.z - Math.floor(size[2]/2) - .5)
						// mesh.castShadow = true
						// mesh.receiveShadow = true
						//
						// scene.add(mesh)
					// })
				}
			}).catch(err => {
				console.error(err)
			})
		},
		init() {
			let container = this.$refs.container

			renderer = new THREE.WebGLRenderer({ antialias: true })
			renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setSize(container.clientWidth, container.clientHeight)
			// renderer.outputEncoding = THREE.sRGBEncoding
			renderer.shadowMap.enabled = true
			container.appendChild(renderer.domElement)

			stats = new Stats()
			stats.dom.style.position = 'absolute'
			container.appendChild(stats.dom)

			camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
			camera.position.set(20, 20, 25)

			scene = new THREE.Scene()
			// scene.background = new THREE.Color().setHSL(0.6, 0, 1)
			// scene.fog = new THREE.Fog(scene.background, 1, 5000)

			const controls = new OrbitControls(camera, renderer.domElement)
			controls.target.set(0, 5, 0)
			controls.maxDistance = 500
			controls.update()

			// GRID
			const gridHelper = new THREE.GridHelper(48, 48)
			scene.add(gridHelper)

			// AXIS
			const axesHelper = new THREE.AxesHelper(24)
			scene.add(axesHelper)

			// LIGHTS
			const hemiLight = new THREE.HemisphereLight(0x87A5F8, 0xBFD3FB, .6)
			hemiLight.position.set(0, 50, 0)
			scene.add(hemiLight)

			const dirLight = new THREE.DirectionalLight(0xffffff, 1)
			dirLight.color.setHSL(.1, 1, .95)
			dirLight.position.set(1, 1.75, 0)
			dirLight.position.multiplyScalar(30)
			scene.add(dirLight)

			dirLight.castShadow = true

			dirLight.shadow.mapSize.width = 2048
			dirLight.shadow.mapSize.height = 2048

			const d = 50

			dirLight.shadow.camera.left = - d
			dirLight.shadow.camera.right = d
			dirLight.shadow.camera.top = d
			dirLight.shadow.camera.bottom = - d

			dirLight.shadow.camera.far = 3500
			dirLight.shadow.bias = - 0.0001


			// GROUND
			{
				const groundGeo = new THREE.PlaneGeometry(10000, 10000)
				const groundMat = new THREE.ShadowMaterial()
				groundMat.opacity = 0.5
				// const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff })
				// groundMat.color.setHSL(0.095, 1, 0.75)

				const ground = new THREE.Mesh(groundGeo, groundMat)
				// ground.position.y = -.05
				ground.rotation.x = -Math.PI / 2
				ground.receiveShadow = true
				scene.add(ground)
			}
			// SKYDOME
// 			const vertexShader = document.createElement('script')
// 			vertexShader.type = 'x-shader/x-vertex'
// 			vertexShader.text = `varying vec3 vWorldPosition;
// void main() {
// 	vec4 worldPosition = modelMatrix * vec4(position, 1.0);
// 	vWorldPosition = worldPosition.xyz;
//
// 	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }`
// 			const fragmentShader = document.createElement('script')
// 			fragmentShader.type = 'x-shader/x-fragment'
// 			fragmentShader.text = `uniform vec3 topColor;
// uniform vec3 bottomColor;
// uniform float offset;
// uniform float exponent;
//
// varying vec3 vWorldPosition;
//
// void main() {
// 	float h = normalize(vWorldPosition + offset).y;
// 	gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h , 0.0), exponent), 0.0)), 1.0);
// }`
// 			console.log(vertexShader.textContent)
// 			console.log(fragmentShader.textContent)

			// const uniforms = {
			// 	"topColor": { value: new THREE.Color(0x0077ff) },
			// 	"bottomColor": { value: new THREE.Color(0xffffff) },
			// 	"offset": { value: 33 },
			// 	"exponent": { value: 0.6 }
			// }
			// uniforms[ "topColor" ].value.copy(hemiLight.color)
			//
			// scene.fog.color.copy(uniforms[ "bottomColor" ].value)
			//
			// const skyGeo = new THREE.SphereGeometry(4000, 32, 15)
			// const skyMat = new THREE.ShaderMaterial({
			// 	uniforms: uniforms,
			// 	vertexShader: vertexShader.textContent,
			// 	fragmentShader: fragmentShader.textContent,
			// 	side: THREE.BackSide
			// })
			//
			// const sky = new THREE.Mesh(skyGeo, skyMat)
			// scene.add(sky)

			// SKY
			// const sky = new Sky()
			// sky.scale.setScalar(10000)
			// scene.add(sky)
			//
			// const effectController = {
			// 	turbidity: 10,//10
			// 	rayleigh: 1,//2
			// 	mieCoefficient: 0.001,
			// 	mieDirectionalG: 0.8,
			// 	inclination: 0.3, // elevation / inclination
			// 	azimuth: 0.205, // Facing front,
			// }
			//
			// const sun = new THREE.Vector3()
			//
			// const uniforms = sky.material.uniforms
			// uniforms[ "turbidity" ].value = effectController.turbidity
			// uniforms[ "rayleigh" ].value = effectController.rayleigh
			// uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient
			// uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG
			//
			// const theta = Math.PI * (effectController.inclination - 0.5)
			// const phi = 2 * Math.PI * (effectController.azimuth - 0.5)
			//
			// sun.x = Math.cos(phi)
			// sun.y = Math.sin(phi) * Math.sin(theta)
			// sun.z = Math.sin(phi) * Math.cos(theta)
			//
			// uniforms[ "sunPosition" ].value.copy(sun)
			// dirLight.position.copy(sun)
			//
			// console.log(sky.material.uniforms)
			//
			// const pmremGenerator = new THREE.PMREMGenerator(renderer)
			// scene.environment = pmremGenerator.fromScene(sky).texture
			const loader = new THREE.TextureLoader()
			const texture = loader.load(
				require('@/assets/textures/equirectangular/mc_sky_day.png'),
				() => {
					const rt = new THREE.WebGLCubeRenderTarget(texture.image.height)
					rt.fromEquirectangularTexture(renderer, texture)
					scene.environment = rt.texture
					scene.background = rt.texture
				}
			)

			this.camera = camera
			this.scene = scene
			this.objects = objects
			this.renderer = renderer
		},
		animate() {
			requestAnimationFrame(this.animate)
			renderer.render(scene, camera)
			stats.update()
		}
	},
	mounted() {
		this.init()
		this.animate()

		// const models = [
		// 	{
		// 		"__comment": "Designed by MaximumFX for MysticalParks - https://maximumfx.nl/",
		// 		"textures": {
		// 			"particle": "block/blast_furnace_top",
		// 			"blast_side": "block/blast_furnace_side",
		// 			"blast_top": "block/blast_furnace_top",
		// 			"smoker_top": "block/smoker_top",
		// 			"coal": "block/coal_block",
		// 			"magma": "block/magma"
		// 		},
		// 		"elements": [
		// 			{
		// 				"__comment": "Box1",
		// 				"from": [ 0, 0, 0 ],
		// 				"to": [ 16, 3, 16 ],
		// 				"faces": {
		// 					"down": { "uv": [ 0, 0, 16, 16 ], "texture": "#blast_top" },
		// 					"up": { "uv": [ 0, 0, 16, 16 ], "texture": "#blast_top" },
		// 					"north": { "uv": [ 0, 13, 16, 16 ], "texture": "#blast_side" },
		// 					"south": { "uv": [ 0, 13, 16, 16 ], "texture": "#blast_side" },
		// 					"west": { "uv": [ 0, 13, 16, 16 ], "texture": "#blast_side" },
		// 					"east": { "uv": [ 0, 13, 16, 16 ], "texture": "#blast_side" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box2",
		// 				"from": [ 2, 3, 2 ],
		// 				"to": [ 14, 9, 13.5 ],
		// 				"faces": {
		// 					"down": { "uv": [ 2, 2.5, 14, 14 ], "texture": "#blast_top" },
		// 					"up": { "uv": [ 2, 2, 14, 13.5 ], "texture": "#blast_top" },
		// 					"north": { "uv": [ 2, 7, 14, 13 ], "texture": "#blast_top" },
		// 					"south": { "uv": [ 2, 7, 14, 13 ], "texture": "#blast_top" },
		// 					"west": { "uv": [ 2, 7, 13.5, 13 ], "texture": "#blast_top" },
		// 					"east": { "uv": [ 2.5, 7, 14, 13 ], "texture": "#blast_top" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box3",
		// 				"from": [ 0, 9, 0 ],
		// 				"to": [ 16, 11, 16 ],
		// 				"faces": {
		// 					"down": { "uv": [ 0, 0, 16, 16 ], "texture": "#blast_top" },
		// 					"up": { "uv": [ 0, 0, 16, 16 ], "texture": "#smoker_top" },
		// 					"north": { "uv": [ 0, 7, 16, 9 ], "texture": "#blast_top" },
		// 					"south": { "uv": [ 0, 7, 16, 9 ], "texture": "#blast_top" },
		// 					"west": { "uv": [ 0, 7, 16, 9 ], "texture": "#blast_top" },
		// 					"east": { "uv": [ 0, 7, 16, 9 ], "texture": "#blast_top" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box4",
		// 				"from": [ 0, 11, 14 ],
		// 				"to": [ 2, 18, 16 ],
		// 				"faces": {
		// 					"down": { "uv": [ 0, 0, 2, 2 ], "texture": "#smoker_top" },
		// 					"up": { "uv": [ 1, 1, 3, 3 ], "texture": "#blast_side" },
		// 					"north": { "uv": [ 14, 0, 16, 7 ], "texture": "#blast_top" },
		// 					"south": { "uv": [ 0, 0, 2, 7 ], "texture": "#blast_top" },
		// 					"west": { "uv": [ 14, 0, 16, 7 ], "texture": "#blast_top" },
		// 					"east": { "uv": [ 0, 0, 2, 7 ], "texture": "#blast_top" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box4",
		// 				"from": [ 0, 11, 0 ],
		// 				"to": [ 2, 18, 2 ],
		// 				"faces": {
		// 					"down": { "uv": [ 0, 14, 2, 16 ], "texture": "#smoker_top" },
		// 					"up": { "uv": [ 1, 1, 3, 3 ], "texture": "#blast_side" },
		// 					"north": { "uv": [ 14, 0, 16, 7 ], "texture": "#blast_top" },
		// 					"south": { "uv": [ 0, 0, 2, 7 ], "texture": "#blast_top" },
		// 					"west": { "uv": [ 0, 0, 2, 7 ], "texture": "#blast_top" },
		// 					"east": { "uv": [ 14, 0, 16, 7 ], "texture": "#blast_top" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box4",
		// 				"from": [ 14, 11, 14 ],
		// 				"to": [ 16, 18, 16 ],
		// 				"faces": {
		// 					"down": { "uv": [ 14, 0, 16, 2 ], "texture": "#smoker_top" },
		// 					"up": { "uv": [ 13, 1, 15, 3 ], "texture": "#blast_side" },
		// 					"north": { "uv": [ 0, 0, 2, 7 ], "texture": "#blast_top" },
		// 					"south": { "uv": [ 14, 0, 16, 7 ], "texture": "#blast_top" },
		// 					"west": { "uv": [ 14, 0, 16, 7 ], "texture": "#blast_top" },
		// 					"east": { "uv": [ 0, 0, 2, 7 ], "texture": "#blast_top" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box4",
		// 				"from": [ 14, 11, 0 ],
		// 				"to": [ 16, 18, 2 ],
		// 				"faces": {
		// 					"down": { "uv": [ 14, 14, 16, 16 ], "texture": "#smoker_top" },
		// 					"up": { "uv": [ 13, 1, 15, 3 ], "texture": "#blast_side" },
		// 					"north": { "uv": [ 0, 0, 2, 7 ], "texture": "#blast_top" },
		// 					"south": { "uv": [ 14, 0, 16, 7 ], "texture": "#blast_top" },
		// 					"west": { "uv": [ 0, 0, 2, 7 ], "texture": "#blast_top" },
		// 					"east": { "uv": [ 14, 0, 16, 7 ], "texture": "#blast_top" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box8",
		// 				"from": [ 0, 11, 2 ],
		// 				"to": [ 2, 15, 14 ],
		// 				"faces": {
		// 					"down": { "uv": [ 0, 2, 2, 14 ], "texture": "#smoker_top" },
		// 					"up": { "uv": [ 0, 2, 2, 14 ], "texture": "#smoker_top" },
		// 					"north": { "uv": [ 14, 2, 16, 6 ], "texture": "#blast_top" },
		// 					"south": { "uv": [ 0, 2, 2, 6 ], "texture": "#blast_top" },
		// 					"west": { "uv": [ 2, 2, 14, 6 ], "texture": "#blast_top" },
		// 					"east": { "uv": [ 2, 2, 14, 6 ], "texture": "#blast_top" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box9",
		// 				"from": [ 2, 11, 0 ],
		// 				"to": [ 14, 15, 2 ],
		// 				"faces": {
		// 					"down": { "uv": [ 2, 14, 14, 16 ], "texture": "#smoker_top" },
		// 					"up": { "uv": [ 2, 0, 14, 2 ], "texture": "#smoker_top" },
		// 					"north": { "uv": [ 2, 2, 14, 6 ], "texture": "#blast_top" },
		// 					"south": { "uv": [ 2, 2, 14, 6 ], "texture": "#blast_top" },
		// 					"west": { "uv": [ 0, 2, 2, 6 ], "texture": "#blast_top" },
		// 					"east": { "uv": [ 14, 2, 16, 6 ], "texture": "#blast_top" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box10",
		// 				"from": [ 2, 11, 14 ],
		// 				"to": [ 14, 15, 16 ],
		// 				"faces": {
		// 					"down": { "uv": [ 2, 0, 14, 2 ], "texture": "#smoker_top" },
		// 					"up": { "uv": [ 2, 14, 14, 16 ], "texture": "#smoker_top" },
		// 					"north": { "uv": [ 2, 3, 14, 7 ], "texture": "#blast_top" },
		// 					"south": { "uv": [ 2, 3, 14, 7 ], "texture": "#blast_top" },
		// 					"west": { "uv": [ 14, 3, 16, 7 ], "texture": "#blast_top" },
		// 					"east": { "uv": [ 0, 3, 2, 7 ], "texture": "#blast_top" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box11",
		// 				"from": [ 14, 11, 2 ],
		// 				"to": [ 16, 15, 14 ],
		// 				"faces": {
		// 					"down": { "uv": [ 14, 2, 16, 14 ], "texture": "#smoker_top" },
		// 					"up": { "uv": [ 14, 2, 16, 14 ], "texture": "#smoker_top" },
		// 					"north": { "uv": [ 0, 2, 2, 6 ], "texture": "#blast_top" },
		// 					"south": { "uv": [ 14, 2, 16, 6 ], "texture": "#blast_top" },
		// 					"west": { "uv": [ 2, 2, 14, 6 ], "texture": "#blast_top" },
		// 					"east": { "uv": [ 2, 2, 14, 6 ], "texture": "#blast_top" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box12",
		// 				"from": [ 3, 11, 3 ],
		// 				"to": [ 12, 12, 10 ],
		// 				"faces": {
		// 					"down": { "uv": [ 3, 6, 12, 13 ], "texture": "#coal" },
		// 					"up": { "uv": [ 3, 3, 12, 10 ], "texture": "#coal" },
		// 					"north": { "uv": [ 4, 4, 13, 5 ], "texture": "#coal" },
		// 					"south": { "uv": [ 3, 4, 12, 5 ], "texture": "#coal" },
		// 					"west": { "uv": [ 3, 4, 10, 5 ], "texture": "#coal" },
		// 					"east": { "uv": [ 6, 4, 13, 5 ], "texture": "#coal" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box13",
		// 				"from": [ 11.5, 12, 7.5 ],
		// 				"to": [ 13.5, 13, 10.5 ],
		// 				"rotation": { "origin": [ 11.5, 12, 10.5 ], "axis": "z", "angle": -22.5 },
		// 				"faces": {
		// 					"down": { "uv": [ 9.5, 4.5, 12.5, 6.5 ], "texture": "#magma", "rotation": 90 },
		// 					"up": { "uv": [ 9, 9, 12, 11 ], "texture": "#magma", "rotation": 270 },
		// 					"north": { "uv": [ 4.5, 3, 6.5, 4 ], "texture": "#magma" },
		// 					"south": { "uv": [ 9.5, 3, 11.5, 4 ], "texture": "#magma" },
		// 					"west": { "uv": [ 3.5, 3, 6.5, 4 ], "texture": "#magma" },
		// 					"east": { "uv": [ 9.5, 3, 12.5, 4 ], "texture": "#magma" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box14",
		// 				"from": [ 3.5, 11, 9 ],
		// 				"to": [ 6, 12.5, 11.5 ],
		// 				"rotation": { "origin": [ 3.5, 11, 9 ], "axis": "z", "angle": 22.5 },
		// 				"faces": {
		// 					"down": { "uv": [ 3.5, 4.5, 6, 7 ], "texture": "#magma" },
		// 					"up": { "uv": [ 3, 9, 6, 12 ], "texture": "#magma" },
		// 					"north": { "uv": [ 10, 3.5, 12.5, 5 ], "texture": "#magma" },
		// 					"south": { "uv": [ 3.5, 3.5, 6, 5 ], "texture": "#magma" },
		// 					"west": { "uv": [ 9, 3.5, 11.5, 5 ], "texture": "#magma" },
		// 					"east": { "uv": [ 4.5, 3.5, 7, 5 ], "texture": "#magma" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box15",
		// 				"from": [ 8.5, 12, 9 ],
		// 				"to": [ 10, 13, 11.5 ],
		// 				"rotation": { "origin": [ 8.5, 12, 9 ], "axis": "x", "angle": 22.5 },
		// 				"faces": {
		// 					"down": { "uv": [ 7.5, 5, 9, 7.5 ], "texture": "#magma" },
		// 					"up": { "uv": [ 8, 8.5, 10, 11 ], "texture": "#magma" },
		// 					"north": { "uv": [ 7, 3, 8.5, 4 ], "texture": "#magma" },
		// 					"south": { "uv": [ 7.5, 3, 9, 4 ], "texture": "#magma" },
		// 					"west": { "uv": [ 8.5, 3, 11, 4 ], "texture": "#magma" },
		// 					"east": { "uv": [ 5, 3, 7.5, 4 ], "texture": "#magma" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box16",
		// 				"from": [ 5.5, 12, 3.5 ],
		// 				"to": [ 7.5, 13, 6 ],
		// 				"rotation": { "origin": [ 5.5, 12, 3.5 ], "axis": "y", "angle": -45 },
		// 				"faces": {
		// 					"down": { "uv": [ 5.5, 9.5, 7.5, 12 ], "texture": "#magma" },
		// 					"up": { "uv": [ 5, 4, 7, 7 ], "texture": "#magma" },
		// 					"north": { "uv": [ 8.5, 3, 10.5, 4 ], "texture": "#magma" },
		// 					"south": { "uv": [ 5.5, 3, 7.5, 4 ], "texture": "#magma" },
		// 					"west": { "uv": [ 4, 3, 6.5, 4 ], "texture": "#magma" },
		// 					"east": { "uv": [ 9.5, 3, 12, 4 ], "texture": "#magma" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box17",
		// 				"from": [ 5, 12, 5 ],
		// 				"to": [ 9.5, 12.5, 10 ],
		// 				"rotation": { "origin": [ 5, 12, 5 ], "axis": "y", "angle": 22.5 },
		// 				"faces": {
		// 					"down": { "uv": [ 7, 7.5, 10.5, 11.5 ], "texture": "#coal" },
		// 					"up": { "uv": [ 7, 4.5, 10.5, 8.5 ], "texture": "#coal" },
		// 					"north": { "uv": [ 5.5, 3.5, 9, 4 ], "texture": "#coal" },
		// 					"south": { "uv": [ 7, 3.5, 10.5, 4 ], "texture": "#coal" },
		// 					"west": { "uv": [ 4.5, 3.5, 8.5, 4 ], "texture": "#coal" },
		// 					"east": { "uv": [ 7.5, 3.5, 11.5, 4 ], "texture": "#coal" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box18",
		// 				"from": [ 5.5, 11, 7.5 ],
		// 				"to": [ 9.5, 11.5, 11.5 ],
		// 				"rotation": { "origin": [ 5.5, 11, 7.5 ], "axis": "y", "angle": -22.5 },
		// 				"faces": {
		// 					"down": { "uv": [ 5, 4, 9, 8 ], "texture": "#magma" },
		// 					"up": { "uv": [ 5, 8, 9, 12 ], "texture": "#magma" },
		// 					"north": { "uv": [ 7, 4.5, 11, 5 ], "texture": "#magma" },
		// 					"south": { "uv": [ 5, 4.5, 9, 5 ], "texture": "#magma" },
		// 					"west": { "uv": [ 8, 4.5, 12, 5 ], "texture": "#magma" },
		// 					"east": { "uv": [ 4, 4.5, 8, 5 ], "texture": "#magma" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box19",
		// 				"from": [ 8.5, 11.5, 2.5 ],
		// 				"to": [ 12.5, 13, 4.5 ],
		// 				"rotation": { "origin": [ 8.5, 11.5, 2.5 ], "axis": "x", "angle": -22.5 },
		// 				"faces": {
		// 					"down": { "uv": [ 9.5, 12, 13.5, 14 ], "texture": "#magma" },
		// 					"up": { "uv": [ 9, 5, 13, 7 ], "texture": "#magma" },
		// 					"north": { "uv": [ 2.5, 2.5, 6.5, 4 ], "texture": "#magma" },
		// 					"south": { "uv": [ 9.5, 2.5, 13.5, 4 ], "texture": "#magma" },
		// 					"west": { "uv": [ 2, 2.5, 4, 4 ], "texture": "#magma" },
		// 					"east": { "uv": [ 12, 2.5, 14, 4 ], "texture": "#magma" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box20",
		// 				"from": [ 4, 12, 6.5 ],
		// 				"to": [ 6.5, 13, 9 ],
		// 				"rotation": { "origin": [ 4, 12, 6.5 ], "axis": "x", "angle": 22.5 },
		// 				"faces": {
		// 					"down": { "uv": [ 4.5, 7, 7, 9.5 ], "texture": "#magma" },
		// 					"up": { "uv": [ 5, 7, 8, 9 ], "texture": "#magma" },
		// 					"north": { "uv": [ 9, 3, 11.5, 4 ], "texture": "#magma" },
		// 					"south": { "uv": [ 4.5, 3, 7, 4 ], "texture": "#magma" },
		// 					"west": { "uv": [ 6.5, 3, 9, 4 ], "texture": "#magma" },
		// 					"east": { "uv": [ 7, 3, 9.5, 4 ], "texture": "#magma" }
		// 				}
		// 			},
		// 			{
		// 				"__comment": "Box21",
		// 				"from": [ 7.5, 13, 5 ],
		// 				"to": [ 11.5, 14, 8 ],
		// 				"rotation": { "origin": [ 7.5, 13, 5 ], "axis": "z", "angle": -22.5 },
		// 				"faces": {
		// 					"down": { "uv": [ 7.5, 8, 11.5, 11 ], "texture": "#magma" },
		// 					"up": { "uv": [ 9, 5, 13, 8 ], "texture": "#magma" },
		// 					"north": { "uv": [ 4.5, 2, 8.5, 3 ], "texture": "#magma" },
		// 					"south": { "uv": [ 7.5, 2, 11.5, 3 ], "texture": "#magma" },
		// 					"west": { "uv": [ 5, 2, 8, 3 ], "texture": "#magma" },
		// 					"east": { "uv": [ 8, 2, 11, 3 ], "texture": "#magma" }
		// 				}
		// 			}
		// 		],
		// 		"display": {
		// 			"thirdperson_righthand": {
		// 				"rotation":  [ 75, 45, 0 ],
		// 				"translation":  [ 0, 2.5, 0 ],
		// 				"scale":  [ 0.375, 0.375, 0.375 ]
		// 			},
		// 			"thirdperson_lefthand": {
		// 				"rotation":  [ 75, 45, 0 ],
		// 				"translation":  [ 0, 2.5, 0 ],
		// 				"scale":  [ 0.375, 0.375, 0.375 ]
		// 			},
		// 			"firstperson_righthand": {
		// 				"rotation":  [ 0, 45, 0 ],
		// 				"scale":  [ 0.4, 0.4, 0.4 ]
		// 			},
		// 			"firstperson_lefthand": {
		// 				"rotation":  [ 0, 45, 0 ],
		// 				"scale":  [ 0.4, 0.4, 0.4 ]
		// 			},
		// 			"gui": {
		// 				"rotation":  [ 30, 225, 0 ],
		// 				"scale":  [ 0.625, 0.625, 0.625 ]
		// 			},
		// 			"ground": {
		// 				"translation":  [ 0, 3, 0 ],
		// 				"scale":  [ 0.25, 0.25, 0.25 ]
		// 			},
		// 			"fixed": {
		// 				"rotation":  [ -90, 0, 0 ],
		// 				"translation":  [ 0, 0, -16 ],
		// 				"scale":  [ 2, 2, 2 ]
		// 			}
		// 		}
		// 	},
		// ]
		//
		// const json = models[0]
		// console.log('Block', json)
		// let textures = Object.entries(json.textures).map(a => {
		// 	let tex = {
		// 		name: a[0],
		// 		texture: require(`@/assets/minecraft/${version}/assets/minecraft/textures/${a[1]}.png`)
		// 	}
		// 	if (fs.existsSync(`@/assets/minecraft/${version}/assets/minecraft/textures/${a[1]}.png.mcmeta`)) {
		// 		tex.mcmeta = fs.readFileSync(`@/assets/minecraft/${version}/assets/minecraft/textures/${a[1]}.png.mcmeta`)
		// 	}
		// 	return tex
		// })
		// console.log(textures)
		// const jsonModel = new JsonModel('name', json, textures)
		// console.log(jsonModel)
		// const g = new THREE.Group()
		// g.add(jsonModel)
		// g.position.y = - jsonModel.getBBox().min.y/16
		// g.position.x = .5
		// g.position.z =  .5
		// g.scale.setScalar(1/16)
		// scene.add(g)
	}
}

</script>

<style scoped>
section {
	position: relative;
}
</style>
