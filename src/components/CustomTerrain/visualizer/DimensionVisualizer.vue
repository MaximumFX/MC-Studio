<template>
	<Plot
		v-if="json && json.generator.biome_source.type === 'minecraft:multi_noise'" class="w-100"
		:width="256"
		:fetcher="() => json"
		:initializer="initializer"
		:sampler="({ source, climate }) => (x, y) => source.getBiome(x, 64, y, climate)"
		:colorizer="colorizer" />
	<div v-else-if="json && json.generator.biome_source.type !== 'minecraft:multi_noise'" class="alert alert-danger mb-0" role="alert">
		Only available for multi-noise ({{json.generator.biome_source.type}})
	</div>
	<div v-else class="w-100 ratio ratio-1x1">
		<Loader class="position-absolute top-50 start-50 translate-middle"/>
	</div>
</template>

<script>
import {MultiNoise, NoiseSampler, NoiseSettings} from "deepslate";
import Plot from "@/components/CustomTerrain/Plot";
import Loader from "@/components/Loader";
import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum";

const overworldOctaves = {
	temperature: {firstOctave: -9, amplitudes: [1.5, 0, 1, 0, 0, 0]},
	humidity: {firstOctave: -7, amplitudes: [1, 1, 0, 0, 0, 0]},
	continentalness: {firstOctave: -9, amplitudes: [1, 1, 2, 2, 2, 1, 1, 1, 1]},
	erosion: {firstOctave: -9, amplitudes: [1, 1, 0, 1, 1]},
	weirdness: {firstOctave: -7, amplitudes: [1, 2, 1, 0, 0, 0]},
	shift: {firstOctave: -3, amplitudes: [1, 1, 1, 0]},
}
const netherOctaves = {
	temperature: {firstOctave: -7, amplitudes: [1, 1]},
	humidity: {firstOctave: -7, amplitudes: [1, 1]},
	continentalness: {firstOctave: -7, amplitudes: [1, 1]},
	erosion: {firstOctave: -7, amplitudes: [1, 1]},
	weirdness: {firstOctave: -7, amplitudes: [1, 1]},
	shift: {firstOctave: 0, amplitudes: [0]},
}

export default {
	name: "DimensionVisualizer",
	components: {Loader, Plot},
	props: {
		json: Object,
	},
	data() {
		const colors = {}
		this.$store.state.custom_terrain.customTerrain.getAllOfType(CTFileType.Biome, true).forEach(ns => {
			console.log(ns)
			ns.items.forEach(biome => {
				if (!biome.color) console.warn(biome)
				colors[ns.name + ':' + biome.name] = biome.color
			})
		})
		console.log(colors)
		return {
			initializer: data => {
				const source = MultiNoise.fromJson(data.generator.biome_source)
				const sampler = new NoiseSampler(
					4, 4, 32,
					NoiseSettings.fromJson(null),
					data.type === 'minecraft:the_nether' ? netherOctaves : overworldOctaves,
					BigInt(1)
				)
				const climate = (x, y, z) => sampler.sample(x, y, z)
				return { source, climate }
			},
			colorizer: id => colors[id] ?? null
		}
	},
}
</script>

<style scoped>

</style>
