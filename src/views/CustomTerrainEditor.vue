<template>
	<main>
		<nav class="navbar navbar-expand-lg navbar-dark bg-mcs-secondary">
			<div class="container-fluid justify-content-start">
				<div class="navbar-expand">
					<ul class="navbar-nav">
						<li class="nav-item">
							<a title="Save changes" href="#" :class="['nav-link','active', saved ? 'disabled text-muted' : 'text-success']" @click="save"><i class="fas fa-save"></i></a>
						</li>
					</ul>
				</div>
				<nav class="navbar-nav ms-2 me-auto" aria-label="breadcrumb">
					<Breadcrumbs v-if="datapack" :datapack="datapack"/>
				</nav>
				<div class="ms-auto navbar-expand">
					<ul class="navbar-nav">
						<li class="nav-item">
							<router-link to="/custom-terrain" title="Exit editor" :class="['nav-link','active', saved ? '' : 'disabled text-muted']"><i class="fas fa-sign-out"></i></router-link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		<section>
			<router-view v-model:datapack="datapack"></router-view>
		</section>
	</main>
</template>

<script>
import DataPack from "@/js/CustomTerrain/DataPack.ts";
import Breadcrumbs from "@/components/CustomTerrain/Breadcrumbs";

export default {
	name: "CustomTerrainEditor",
	components: {Breadcrumbs},
	data() {
		return {
			id: this.$route.params.cteId,
			datapack: undefined,
			loading: true,
			saved: true,
		}
	},
	async created() {
		const datapack = await DataPack.load(this.id)
		if (datapack) {
			this.datapack = datapack
			console.log('Loaded datapack', datapack)
		}
		else {
			console.log('nooo')//todo
		}
	},
	watch: {
		datapack: {
			handler(val) {
				if (!this.loading) {
					console.log('datapack', val)
					this.saved = false
				}
				else this.loading = false
			},
			deep: true
		}
	},
	methods: {
		save() {
			this.saved = true
		}
	}
}
</script>

<style scoped>
/*section {*/
/*	min-height: 100vh;*/
/*	padding-top: 3.5rem;*/
/*	position: relative;*/
/*	display: flex;*/
/*	flex-direction: column;*/
/*}*/
/*main {*/
/*	flex: 1 0 auto*/
/*}*/

h1, h2, h3, h4, h5, h6, p {
	user-select: none;
}

.breadcrumb-item {
	user-select: none;
}
</style>
