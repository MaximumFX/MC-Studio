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
			<div class="row gx-3">
				<div class="col">
					<h2>Datapacks <small class="fw-normal text-muted">({{ config.get('datapacks').length }})</small></h2>
				</div>
				<div class="col-auto">
					<button class="btn btn-outline-success" type="button" disabled>New</button>
				</div>
				<div class="col-auto">
					<button class="btn btn-success" type="button" @click="importDP">Import</button>
				</div>
				<div class="col-12">
					<p v-if="config.get('datapacks').length === 0">You haven't created or imported any datapacks.</p>
					<div v-else class="row g-3">
						<div v-for="datapack in config.get('datapacks')" :key="datapack" class="col-6">
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
import {ipcRenderer} from "electron";
import {EventList} from "@/js/events";
import CustomTerrain from "@/js/CustomTerrain/CustomTerrain.ts";

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
	methods: {
		async importDP() {
			const zipPath = await ipcRenderer.invoke(EventList.SELECT_FILE, 'Open datapack')
			const datapack = await CustomTerrain.fromDatapack(zipPath)
			console.log('imported', datapack)
			config.value.customTerrain.add('datapacks', datapack.id)
			config.value.customTerrain.save()

			this.config.reload()
		}
	}
}
</script>

<style scoped>
main {
	user-select: none;
}
</style>
