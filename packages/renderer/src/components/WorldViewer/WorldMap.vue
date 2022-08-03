<template>
	<div ref="container" class="map">
		<div class="map-controls">
			<div class="absolute right-0 top-0 bg-black bg-opacity-60 border-l border-b border-white/20 p-2 flex flex-col w-1/5 shadow-lg">
				<t-button class="mb-2" @click="exportMap">Export map</t-button>
				<t-button color="yellow" class="mb-2" @click="reset">Reset</t-button>
				<div class="flex flex-col mb-3">
					<h6 class="m-0">Sun</h6>
					<label for="altitude">Altitude ({{ sunR.altitude }}&deg;)</label>
					<input id="altitude" v-model="sunR.altitude" type="range" min="0" max="180" step="1">
					<label for="azimuth">Azimuth ({{ sunR.azimuth }}&deg;)</label>
					<input id="azimuth" v-model="sunR.azimuth" type="range" min="0" max="360" step="1">
				</div>
				<div class="">
					<h6 class="m-0">Colors</h6>
					<div class="flex justify-between mb-2">
						<label for="highlight">Highlight</label>
						<input id="highlight" v-model="colors.highlight" type="color">
					</div>
					<div class="flex justify-between mb-2">
						<label for="shadow">Shadow</label>
						<input id="shadow" v-model="colors.shadow" type="color">
					</div>
				</div>
			</div>
			<div class="absolute right-0 bottom-0 bg-black bg-opacity-75 text-right p-2">
				<h5 class="m-0">{{ scale.toFixed(2) }}x</h5>
<!--				<h6 class="m-0">{{ (x - center.x).toFixed() }} {{ (y - center.y).toFixed() }}</h6>-->
			</div>
		</div>
		<div class="tiles-container">
			<div ref="map" class="tiles">
				<Tile
					v-for="tile of tiles" :key="tile.path"
					:tile="tile" :show-grid="scale > 1.5"
					:style="{left: tile.x * 512 + 'px', top: tile.z * 512 + 'px'}"
					:sun="sunRot"
					:colors="colors"
					class="tile"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import createPanZoom from 'panzoom'
import Tile from '@/components/WorldViewer/Tile';
import TButton from '@/components/core/TButton';

export default {
	name: 'WorldMap',
	components: {TButton, Tile},
	props: {
		tiles: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			panzoom: undefined,
			x: 0, y: 0, scale: 1,
			center: { x: 0, y: 0 },

			startX: 0,
			startY: 0,

			down: false,
			downX: 0,
			downY: 0,


			sun: [1, 1, 1],
			sunR: {
				altitude: 45,
				azimuth: 45,
			},
			colors: {
				highlight: '#ffe3c6',
				shadow: '#272e33',
			},
		}
	},
	computed: {
		sunRot() {
			const altitude = (this.sunR.altitude) / 180 * Math.PI
			const azimuth = (this.sunR.azimuth) / 180 * Math.PI
			return {
				raw: [
					this.sunR.altitude,
					this.sunR.azimuth,
				],
				vector: [
					Math.sin(azimuth),
					Math.cos(altitude) * Math.cos(azimuth),
					Math.sin(altitude) * Math.cos(azimuth),
				],
			}
		},
	},
	mounted() {
		const minMax = [...this.tiles].sort((a, b) => a.x - b.x || a.z - b.z);
		const center = {
			x: this.$refs.container.clientWidth / 2 - (minMax[0].x + minMax[minMax.length - 1].x) / 2 * 512 - 256,
			y: this.$refs.container.clientHeight / 2 - (minMax[0].z + minMax[minMax.length - 1].z) / 2 * 512 - 256,
		}
		this.center = center
		this.panzoom = createPanZoom(this.$refs.map)
		this.panzoom.moveTo(center.x, center.y)
		this.panzoom.on('transform', e => {
			const t = e.getTransform()
			this.scale = t.scale
			this.x = t.x
			this.y = t.y
		})
	},
	methods: {
		exportMap() {
			console.log('export')
		},
		reset() {
			console.log('reset', this.panzoom)
			this.panzoom.moveTo(0, 0)
			this.panzoom.zoomTo(0, 0, 1)
			this.sunR = { altitude: 45, azimuth: 45 }
			this.colors = {
				highlight: '#ffe3c6',
				shadow: '#272e33',
			}
		},
	},
}
</script>

<style scoped>
.map,
.map-controls,
.tiles-container {
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
}
.map-controls {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	pointer-events: none;
}
.map-controls > * {
	pointer-events: all;
}
.tiles {
	position: relative;
}
</style>
