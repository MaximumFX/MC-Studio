<template>
	<div class="card card-body">
		<div class="row">
			<div class="col">
				<h3 class="card-title">{{ namespace.name }}</h3>
			</div>
			<div class="col-auto">
				<router-link :to="{name: 'CTENamespace', params:{cteId: customTerrain.id, namespace: namespace.id}}" class="btn btn-success me-2"><i class="far fa-pencil"></i></router-link>
				<button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<p class="mb-1">Dimensions: <code>{{ namespace.data.dimension.length ? namespace.data.dimension.map(d => d.name).join(', ') : 'None' }}</code></p>
				<p class="mb-1">Dimension types: <code>{{ namespace.data.dimension_type.length ? namespace.data.dimension_type.map(d => d.name).join(', ') : 'None' }}</code></p>
				<p class="mb-1">Biomes: <code>{{ namespace.data.worldgen.biome.length }}</code></p>
				<p class="mb-1">Carvers: <code>{{ namespace.data.worldgen.configured_carver.length }}</code></p>
				<p class="mb-1">Features: <code>{{ namespace.data.worldgen.configured_feature.length }}</code></p>
				<p class="mb-1">Structure Features: <code>{{ namespace.data.worldgen.configured_structure_feature.length }}</code></p>
			</div>
			<div class="col">
				<p class="mb-1">Placed Features: <code>{{ namespace.data.worldgen.placed_feature.length }}</code></p>
				<p class="mb-1">Noise: <code>{{ namespace.data.worldgen.noise.length }}</code></p>
				<p class="mb-1">Noise Settings: <code>{{ namespace.data.worldgen.noise_settings.length }}</code></p>
				<p class="mb-1">Processor List: <code>{{ namespace.data.worldgen.processor_list.length }}</code></p>
				<p class="mb-1">Template Pool: <code>{{ namespace.data.worldgen.template_pool.length }}</code></p>
			</div>
		</div>
	</div>
</template>

<script>
import Namespace from "@/js/CustomTerrain/Namespace.ts";
import CustomTerrain from "@/js/CustomTerrain/CustomTerrain.ts";

export default {
	name: "Namespace",
	props: {
		customTerrain: CustomTerrain,
		namespace: Namespace,
		basePath: String
	},
	created() {
		console.log(this.namespace)
	}
}
</script>

<style scoped>

</style>
