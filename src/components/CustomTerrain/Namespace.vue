<template>
	<div class="card card-body">
		<div class="row">
			<div class="col">
				<h3 class="card-title">{{ data.namespace }}</h3>
			</div>
			<div class="col-auto">
				<router-link :to="`${basePath}/${data.namespace}`" class="btn btn-success me-2"><i class="far fa-pencil"></i></router-link>
				<button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<p class="mb-1">Dimensions: <code>{{data.dimension.length ? data.dimension.map(d => d.name).join(', ') : 'None'}}</code></p>
				<p class="mb-1">Dimension types: <code>{{data.dimension_type.length ? data.dimension_type.map(d => d.name).join(', ') : 'None'}}</code></p>
				<p class="mb-1">Biomes: <code>{{data.worldgen.biome.length}}</code></p>
				<p class="mb-1">Carvers: <code>{{data.worldgen.configured_carver.length}}</code></p>
				<p class="mb-1">Features: <code>{{data.worldgen.configured_feature.length}}</code></p>
			</div>
			<div class="col">
				<p class="mb-1">Structure Features: <code>{{data.worldgen.configured_structure_feature.length}}</code></p>
				<p class="mb-1">Surface Builders: <code>{{data.worldgen.configured_surface_builder.length}}</code></p>
				<p class="mb-1">Noise Settings: <code>{{data.worldgen.noise_settings.length}}</code></p>
				<p class="mb-1">Processor List: <code>{{data.worldgen.processor_list.length}}</code></p>
				<p class="mb-1">Template Pool: <code>{{data.worldgen.template_pool.length}}</code></p>
			</div>
		</div>
	</div>
</template>

<script>
import Data from "@/js/CustomTerrain/Data.ts";

export default {
	name: "Namespace",
	props: {
		data: Data,
		basePath: String
	}
}
</script>

<style scoped>

</style>