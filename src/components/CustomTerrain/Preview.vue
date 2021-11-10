<template>
	<div class="card card-interactive" @click="$router.push(`/custom-terrain/editor/${datapack.id}`)">
		<div class="row g-0 align-items-center">
			<div class="col-sm-4 col-md-3">
				<img :src="`data:image/png;base64, ` + datapack.icon" class="img-fluid w-100" alt="Pack icon">
			</div>
			<div class="col-sm-8 col-md-9">
				<div class="card-body">
					<h5 class="card-title fw-bold text-truncate" :title="datapack.name">
						{{ datapack.name }}
<!--						<a href="#"><i class="far fa-ellipsis-v float-end"></i></a>-->
					</h5>
					<p class="card-text mb-1 text-truncate" :title="datapack.description">{{ datapack.description }}</p>
					<p class="card-text m-0"><small class="text-muted">Pack format: {{ datapack.pack_format }}</small></p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Preview",
	props: {
		datapack: Object
	}
}
</script>

<style scoped>
.card {
	cursor: pointer;
}
</style>