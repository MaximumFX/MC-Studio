<template>
	<main>
		<nav class="navbar navbar-expand-lg navbar-dark bg-mcs-secondary">
			<div class="container-fluid justify-content-start">
<!--				<div class="navbar-expand">-->
<!--					<ul class="navbar-nav">-->
<!--						<li class="nav-item">-->
<!--							<a title="Save changes" href="#" :class="['nav-link','active', saved ? 'disabled text-muted' : 'text-success']" @click="save"><i class="fas fa-save"></i></a>-->
<!--						</li>-->
<!--					</ul>-->
<!--				</div>-->
				<nav class="navbar-nav ms-2 me-auto" aria-label="breadcrumb">
					<Breadcrumbs v-if="customTerrain" :ct="customTerrain"/>
				</nav>
				<div class="navbar-expand">
					<ul class="navbar-nav">
						<li class="nav-item">
							<router-link
								to="/custom-terrain"
								title="Exit editor"
								:class="['nav-link','active', $store.state.saved ? '' : 'disabled text-muted']"
							><i class="fas fa-sign-out"></i></router-link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		<section>
			<router-view v-if="customTerrain"></router-view>
			<Loader v-else class="mx-auto"/>
		</section>
	</main>
</template>

<script>
import CustomTerrain from "@/js/CustomTerrain/CustomTerrain.ts";
import Breadcrumbs from "@/components/CustomTerrain/Breadcrumbs";
import Loader from "@/components/Loader";

export default {
	name: "CustomTerrainEditor",
	components: {Loader, Breadcrumbs},
	data() {
		return {
			id: this.$route.params.cteId,
			saved: true,
		}
	},
	computed: {
		customTerrain() {
			return this.$store.state.custom_terrain.customTerrain
		}
	},
	async created() {
		const customTerrain = await CustomTerrain.load(this.id)
		if (customTerrain) {
			this.$store.commit('custom_terrain/setCustomTerrain', customTerrain)
			this.$store.commit('setTitle', customTerrain.name)
			console.log('Loaded CustomTerrain', customTerrain)
		}
		else {
			console.error('nooo couldnt find customterrain')
			this.$router.push('/custom-terrain/')// todo update page
		}
	},
}
</script>

<style scoped>
main {
	user-select: none;
}
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
