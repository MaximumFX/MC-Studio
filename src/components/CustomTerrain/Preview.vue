<template>
	<div class="card card-interactive" @click="$router.push(`/custom-terrain/editor/${datapack}`)">
		<div v-if="dp" class="row g-0 align-items-center">
			<div class="col-sm-4 col-md-3">
				<img v-if="dp.icon.length" :src="`data:image/png;base64, ` + dp.icon" class="img-fluid w-100" alt="Pack icon">
				<MCIcon v-else class="fs-1 mx-auto d-block"/>
			</div>
			<div class="col-sm-8 col-md-9">
				<div class="card-body">
					<h5 class="card-title fw-bold text-truncate" :title="dp.name">
						{{ dp.name }}
<!--						<a href="#"><i class="far fa-ellipsis-v float-end"></i></a>-->
					</h5>
					<p class="card-text mb-1 text-truncate" :title="dp.description">{{ dp.description }}</p>
					<p class="card-text m-0"><small class="text-muted">Pack format: {{ dp.pack_format }}</small></p>
				</div>
			</div>
		</div>
		<div v-else class="row align-items-center justify-content-center">
			<div class="col-auto">
				<Loader/>
			</div>
		</div>
	</div>
</template>

<script>
import CustomTerrain from "@/js/CustomTerrain/CustomTerrain.ts";
import Loader from "@/components/Loader";
import MCIcon from "@/components/MCIcon";

export default {
	name: "Preview",
	components: {MCIcon, Loader},
	props: {
		datapack: String
	},
	data() {
		return {
			dp: undefined
		}
	},
	async created() {
		const ct = await CustomTerrain.load(this.datapack)
		if (ct) this.dp = ct
	}
}
</script>

<style scoped>
.card {
	cursor: pointer;
}
</style>
