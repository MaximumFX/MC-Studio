<template>
	<div class="relative h-100">
		<t-button class="absolute top-0 right-0" @click="exportModel">Export model</t-button>
		<canvas ref="canvas" class=""/>
	</div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import TButton from '@/components/core/TButton';
import MinecraftModel from '@/js/MinecraftModel';

export default {
	name: 'ModelViewer',
	components: {TButton},
	props: {
		version: {
			type: String,
			required: true,
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
			required: true,
		},
	},
	data() {
		return {
			renderer: undefined,
			scene: undefined,
			camera: undefined,
			controls: undefined,

			block: undefined,
		}
	},
	async mounted() {
		const size = { width: this.$refs.canvas.clientWidth, height: this.$refs.canvas.clientHeight }

		const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.$refs.canvas, alpha: true });
		renderer.setSize(size.width, size.height);

		const camera = new THREE.PerspectiveCamera(70, size.width / size.height, 0.01, 50);
		camera.position.set(3, 3, 3)
		const controls = new OrbitControls(camera, this.$refs.canvas);
		controls.target.set(0, 0.5, 0);
		controls.update();

		const scene = new THREE.Scene();

		const gridHelper = new THREE.GridHelper(3, 3);
		scene.add(gridHelper);

		const light = new THREE.AmbientLight(0xffffff); // soft white light
		scene.add(light);

		renderer.setAnimationLoop(animation);

		function animation() {
			renderer.render(scene, camera);
		}

		this.renderer = renderer
		this.scene = scene
		this.camera = camera
		this.controls = controls

		await this.applyModel()
	},
	methods: {
		async applyModel() {
			console.log(this.model);
			try {
				const block = await MinecraftModel.build(this.version, this.namespace, this.name, this.model)
				this.scene.add(block)
				this.block = block
			} catch (e) {
				console.error(e)
			}
		},
		async exportModel() {
			const exporter = new GLTFExporter();
			exporter.parse(this.block,
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
				// called when there is an error in the generation
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
