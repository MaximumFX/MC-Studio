<template>
	<div class="container-fluid my-3">
		<div class="row">
			<div class="col">
				<div class="card" v-if="json">
					<div class="card-header p-0">
						<div class="p-3">
							<div class="row g-3 mb-3">
								<div class="col">
									<div class="input-group">
										<span class="input-group-text" id="dimension_name">{{ namespace.name }}:</span>
										<input type="text" class="form-control" placeholder="dimension_name" aria-label="dimension_name" aria-describedby="dimension_name" v-model="json.name">
									</div>
								</div>
								<div class="col-auto">
									<button type="button" class="btn btn-info"><i class="far fa-info-circle"></i></button>
								</div>
								<div class="col-auto">
									<button type="button" class="btn btn-danger" title="Remove dimension"><i class="far fa-trash-alt"></i></button>
								</div>
							</div>

							<div class="row g-3 align-items-center">
								<div class="col-auto">
									<label for="dimension_type" class="form-label mb-0">Dimension Type*</label>
								</div>
								<div class="col">
									<select class="form-select" id="dimension_type" :value="json.type">
										<optgroup v-for="ns in dimensionTypes" :key="ns.id" :label="ns.name">
											<option v-for="type in ns.items" :key="`${ns.name}:${type.name}`" :value="`${ns.name}:${type.name}`">{{ ns.name }}:{{ type.name }}</option>
										</optgroup>
									</select>
								</div>
							</div>
						</div>
						<div class="nav nav-tabs">
							<div v-for="dg in dimensionGenerators" :key="dg.name" class="nav-item">
								<div v-if="json" :class="['nav-link cursor-pointer', json.generator.type === dg.getType() ? 'active': '']" @click="json.generator = json.generator.getNew(dg.getType())">
									<div class="form-check">
										<input class="form-check-input" type="radio" name="dimensionGenerators" :id="dg.name" :value="dg.getType()" :checked="json.generator.type === dg.getType()">
										<label class="form-check-label cursor-pointer" :for="dg.name">{{dg.name.replace('Generator','')}}</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="card-body collapse show">
						<div class="row">
							<div class="col">
<!--								<ValidatedForm v-model:data="json" :structure="validation"/>-->
							</div>
						</div>
					</div>
				</div>
				<Loader v-else class="mx-auto my-5"/>
			</div>
			<div class="col-4">
				<div class="card card-body">
					<h4>Biome preview <span class="fw-normal">(y=64)</span></h4>
					<DimensionVisualizer :json="json"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {DimensionGenerators} from "@/js/CustomTerrain/Dimension/DimensionGenerators.ts";
import Loader from "@/components/Loader";
import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum.ts";
import Namespaced from "@/mixins/CustomTerrain/Namespaced";
import NamespacedFile from "@/mixins/CustomTerrain/NamespacedFile";
import DimensionVisualizer from "@/components/CustomTerrain/visualizer/DimensionVisualizer";

export default {
	name: "CTEDimension",
	components: {DimensionVisualizer, Loader},
	mixins: [Namespaced, NamespacedFile],
	data() {
		return {
			dimensionTypes: [],
			dimensionGenerators: DimensionGenerators,
		}
	},
	async created() {
		this.dimensionTypes = this.customTerrain.getAllOfType(CTFileType.DimensionType, true)
	},
	methods: {
		ready() {
			// const dim = new DimensionNoise(64)
			// console.log(this.json)
			//
			// const canvas = this.$refs.canvas
			// const context = canvas.getContext('2d')
			//
			// let uniqueBiomes = [...new Set([...this.json.generator.biome_source.biomes].map(a => a.biome))]
			// uniqueBiomes = uniqueBiomes.map((a, i) => ({
			// 	biome: a,
			// 	color: `hsl(${ Math.round(i / uniqueBiomes.length * 360) }deg, 100%, 50%)`
			// }))
			// let i = 0
			//
			// const getParameter = (obj, name) => {
			// 	return Array.isArray(obj.parameters[name]) ? (obj.parameters[name][0] + obj.parameters[name][1])/2 : obj.parameters[name]// todo min max
			// }
			// const biomes = []
			//
			// dim.noise.forEach(noise => {
			// 	const biome = [...this.json.generator.biome_source.biomes]
			// 		.sort((a, b) =>
			// 			Math.abs(noise.c - getParameter(a, 'continentalness')) - Math.abs(noise.c - getParameter(b, 'continentalness')) ||
			// 			Math.abs(noise.e - getParameter(a, 'erosion')) - Math.abs(noise.e - getParameter(b, 'erosion')) ||
			// 			Math.abs(noise.t - getParameter(a, 'temperature')) - Math.abs(noise.t - getParameter(b, 'temperature')) ||
			// 			Math.abs(noise.h - getParameter(a, 'humidity')) - Math.abs(noise.h - getParameter(b, 'humidity'))
			// 		)[0]
			// 	// 	.sort((a, b) => {
			// 	// 	if (Math.abs(noise.c - a.parameters.continentalness) < Math.abs(noise.c - b.parameters.continentalness) ||
			// 	// 		Math.abs(noise.e - a.parameters.erosion) < Math.abs(noise.e - b.parameters.erosion) ||
			// 	// 		Math.abs(noise.t - a.parameters.temperature) < Math.abs(noise.t - b.parameters.temperature) ||
			// 	// 		Math.abs(noise.h - a.parameters.humidity) < Math.abs(noise.h - b.parameters.humidity) ||
			// 	// 		Math.abs(noise.w - a.parameters.weirdness) < Math.abs(noise.w - b.parameters.weirdness) ||
			// 	// 		Math.abs(noise.o - a.parameters.offset) < Math.abs(noise.o - b.parameters.offset) ||
			// 	// 		Math.abs(noise.d - a.parameters.depth) < Math.abs(noise.d - b.parameters.depth)
			// 	// 	)
			// 	// 		return biome
			// 	// 	return b
			// 	// })
			// 	console.log(i, dim.noise.length, (i + 1) / dim.noise.length * 100)
			// 	biomes.push({
			// 		x: noise.x,
			// 		y: noise.y,
			// 		biome: biome.biome
			// 	})
			// 	i++
			// })
			//
			// biomes.forEach(biome => {
			// 	const id = uniqueBiomes.find(a => a.biome === biome.biome)
			// 	// const rgb = pickHex([255, 0, 0], [0, 0, 255], id.color)
			// 	drawPixel(context, biome.x, biome.y, id.color)//`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`)
			// })
			//
			// console.log(uniqueBiomes)
			//
			// function drawPixel(context, x, y, color, size = 4) {
			// 	const roundedX = Math.round(x) * size
			// 	const roundedY = Math.round(y) * size
			//
			// 	context.beginPath()
			// 	context.fillStyle = color || '#000'
			// 	context.fillRect(roundedX, roundedY, size, size)
			// 	context.fill()
			// }
			// function pickHex(color1, color2, weight) {
			// 	var w1 = weight;
			// 	var w2 = 1 - w1;
			// 	var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
			// 		Math.round(color1[1] * w1 + color2[1] * w2),
			// 		Math.round(color1[2] * w1 + color2[2] * w2)];
			// 	return rgb;
			// }
		}
	}
}
</script>

<style scoped>
</style>
