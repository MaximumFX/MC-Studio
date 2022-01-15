<template>
	<div class="container-fluid mt-3" v-if="customTerrain">
		<div class="row g-3 align-items-center mb-4">
			<div class="col-auto text-center">
				<EditableImage :base64="customTerrain.icon" alt="Pack icon" class="img-fluid" width="128"/>
			</div>
			<div class="col">
				<h1 title="Name">
					<EditableText v-model:text="customTerrain.name"/>
				</h1>
				<p title="Description" class="mb-2">
					<EditableText v-model:text="customTerrain.description"/>
				</p>
				<p class="m-0">Pack format:
					<EditableText v-model:number="customTerrain.pack_format"/>
				</p>
			</div>
		</div>
		<div class="row align-items-center">
			<div class="col">
				<h2 class="m-0">Namespaces</h2>
			</div>
			<div class="col-auto">
				<button class="btn btn-success"><i class="fas fa-plus"></i></button>
			</div>
			<div class="col-12">
				<hr>
			</div>
		</div>
		<Namespace v-for="data in customTerrain.getNamespaces()" :key="data.id" :custom-terrain="customTerrain" :namespace="data" :base-path="basePath" class="mb-3"/>
	</div>
	<Loader v-else class="mx-auto mt-3"/>
</template>

<script>
import EditableText from "@/components/EditableText";
import EditableImage from "@/components/EditableImage";
import Namespace from "@/components/CustomTerrain/Namespace";
import Loader from "@/components/Loader";

export default {
	name: "customTerrainEHome",
	components: {Loader, Namespace, EditableImage, EditableText},
	data() {
		return {
			id: this.$route.params.customTerraineId,

			basePath: this.$route.path
		}
	},
	computed: {
		customTerrain() {
			return this.$store.state.custom_terrain.customTerrain
		},
	}
}
</script>

<style scoped>
</style>
