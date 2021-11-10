<template>
	<main>
		<nav class="navbar navbar-expand-lg navbar-dark bg-mcs-secondary">
			<div class="container-fluid justify-content-start">
				<div class="navbar-expand" id="navbarNav">
					<ul class="navbar-nav">
						<li class="nav-item">
							<router-link to="/" class="nav-link active"><i class="fas fa-chevron-left"></i> Back</router-link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		<section class="container-fluid py-3">
			<div class="row">
				<div class="col">
					<h2>Datapacks <small class="fw-normal text-muted">({{ config.get('datapacks').length }})</small></h2>
					<p v-if="config.get('datapacks').length === 0">You haven't created or imported any datapacks.</p>
					<div v-else class="row g-3">
						<div v-for="datapack in config.get('datapacks')" :key="datapack.id" class="col-6">
							<Preview :datapack="datapack" class="h-100"/>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
import {config} from "@/js/state";
import Preview from "@/components/CustomTerrain/Preview";

export default {
	name: "CustomTerrain",
	components: {Preview},
	data() {
		return {
			datapack: undefined,
			config: config.value.customTerrain
		}
	},
	async created() {
		this.config.reload()
		console.log(this.config.get('datapacks'))
	},
}
</script>

<style scoped>
</style>