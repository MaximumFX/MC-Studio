<template>
	<div ref="parent" class="relative h-full">
		<div v-if="!loaded" class="absolute w-full h-full flex items-center justify-center bg-black/80"><loader/></div>
		<t-button v-else class="absolute top-0 right-0" @click="exportModel">Export model</t-button>
		<canvas ref="canvas" class=""/>
	</div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import TButton from '@/components/core/TButton';
import MinecraftModel from '@/js/MinecraftModel';
import envTex from '@asset/textures/equirectangular/mc_sky_day.png'
import Loader from '@/components/core/Loader';

export default {
	name: 'StructureViewer',
	components: {Loader, TButton},
	props: {
		version: {
			type: String,
			default: '1.19',
		},
		model: {
			type: Object,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		namespace: {
			type: String,
			default: 'minecraft',
		},
	},
emits: ['error'],
	data() {
		return {
			loaded: false,
			renderer: undefined,
			scene: undefined,
			camera: undefined,
			controls: undefined,

			schematic: undefined,
			grid: undefined,
		}
	},
	watch: {
		name() {
			if (this.scene) {
				this.scene.remove(this.schematic, this.grid)
				this.applyModel()
			}
		},
	},
	async mounted() {
		const size = { width: this.$refs.parent.clientWidth, height: this.$refs.parent.clientHeight }

		const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.$refs.canvas, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(size.width, size.height);
		renderer.shadowMap.enabled = true

		const camera = new THREE.PerspectiveCamera(70, size.width / size.height, 0.01, 512);
		camera.position.set(this.model.size[0] + 2, this.model.size[1]/2 + 2, this.model.size[2] + 2)
		const controls = new OrbitControls(camera, this.$refs.canvas);
		controls.target.set(0, this.model.size[1] / 4 + 0.5, 0);
		controls.update();

		const scene = new THREE.Scene();

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
		// {
		// 	const groundGeo = new THREE.PlaneGeometry(10000, 10000)
		// 	const groundMat = new THREE.ShadowMaterial()
		// 	groundMat.opacity = 0.5
		// 	// const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff })
		// 	// groundMat.color.setHSL(0.095, 1, 0.75)
		//
		// 	const ground = new THREE.Mesh(groundGeo, groundMat)
		// 	// ground.position.y = -.05
		// 	ground.rotation.x = -Math.PI / 2
		// 	ground.receiveShadow = true
		// 	scene.add(ground)
		// }

		// ENVIRONMENT
		const loader = new THREE.TextureLoader()
		const texture = loader.load(
			envTex,
			() => {
				const rt = new THREE.WebGLCubeRenderTarget(texture.image.height)
				rt.fromEquirectangularTexture(renderer, texture)
				scene.environment = rt.texture
				scene.background = rt.texture
			},
		)

		renderer.setAnimationLoop(animation);

		function animation() {
			renderer.render(scene, camera);
		}

		this.renderer = renderer
		this.scene = scene
		this.camera = camera
		this.controls = controls

		window.addEventListener('resize', this.resize)

		await this.applyModel()
	},
	unmounted() {
		this.renderer = undefined
		this.scene = undefined
		this.camera = undefined
		this.controls = undefined
		this.schematic = undefined
		window.removeEventListener('resize', this.resize)
	},
	methods: {
		resize() {
			const size = { width: this.$refs.parent.clientWidth, height: this.$refs.parent.clientHeight }
			this.camera.aspect = size.width / size.height
			this.camera.updateProjectionMatrix()
			this.renderer.setSize(size.width, size.height)
		},
		async applyModel() {
			console.log(this.model);
			try {
				const gridSize = Math.max(this.model.size[0], this.model.size[2])
				const gridHelper = new THREE.GridHelper(gridSize, gridSize);
				if (gridSize % 2 === 0)
					gridHelper.position.set(-.5, 0, -.5)
				this.scene.add(gridHelper);
				this.grid = gridHelper

				// const axis = new THREE.AxesHelper(Math.min(this.model.size[0], this.model.size[1], this.model.size[2]))
				// const axisPos = {
				// 	x: -this.model.size[0] / 2,
				// 	z: -this.model.size[2] / 2,
				// }
				// console.log(axisPos);
				// if (gridSize % 2 === 0) {
				// 	axisPos.x -= .5
				// 	axisPos.z -= .5
				// }
				// else {
				// 	if (axisPos.x % 2 !== 0) axisPos.x -= .5
				// 	if (axisPos.z % 2 !== 0) axisPos.z -= .5
				// }
				// console.log(axisPos);
				// axis.position.set(axisPos.x, 0, axisPos.z)
				// this.scene.add(axis)

				const schematic = await MinecraftModel.buildStructure(this.version, this.namespace, this.name, this.model)
				console.log('schematic', schematic);
				this.scene.add(schematic)
				this.schematic = schematic

				this.loaded = true
			} catch (e) {
				console.error(e)
				this.$emit('error', e)
			}
		},
		async exportModel() {
			const build = new THREE.Group()
			build.name = this.schematic.name

			for (const insMesh of this.schematic.children) {
				for (const child of insMesh.children) {
					for (let i = 0; i < child.count; i++) {
						const local = new THREE.Mesh(child.geometry, child.material)
						child.getMatrixAt(i, local.matrix)
						build.add(local)
					}
				}
			}

			const exporter = new GLTFExporter();
			exporter.parse(build,
				(gltf) => {
					console.log(gltf);
					try {
						window.api.files.saveFile(JSON.stringify(gltf), 'utf8', 'Save model', [{
							name: 'Model',
							extensions: ['gltf'],
						}], this.name + '.gltf')
					} catch (e) {
						console.log(e);
					}
				},
				(error) => {
					console.error('An error happened', error);
				});
		},
	},
};
</script>

<style scoped>
canvas {
	width: 100%;
	height: 100%;
}
</style>
