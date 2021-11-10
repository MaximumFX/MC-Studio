<template>
	<div class="container-fluid mt-3" v-if="datapack && dp">
		<div class="row g-3 align-items-center mb-4">
			<div class="col-auto text-center">
				<EditableImage :base64="datapack.icon" alt="Pack icon" class="img-fluid" width="128"/>
			</div>
			<div class="col">
				<h1 title="Name"><EditableText v-model:text="dp.name"/></h1>
				<p title="Description" class="mb-2"><EditableText v-model:text="dp.description"/></p>
				<p class="m-0">Pack format: <EditableText v-model:number="dp.pack_format"/></p>
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
		<Namespace v-for="data in datapack.getNamespaces()" :key="data.namespace" :data="data" :base-path="basePath" class="mb-3"/>
	</div>
	<div v-else class="container-fluid mt-3 loader">
		<h3>Loading...</h3>
	</div>
</template>

<script>
import DataPack from "@/js/CustomTerrain/DataPack.ts";
import EditableText from "@/components/EditableText";
import EditableImage from "@/components/EditableImage";
import Namespace from "@/components/CustomTerrain/Namespace";

export default {
	name: "CTEHome",
	components: {Namespace, EditableImage, EditableText},
	props: {
		datapack: DataPack
	},
	data() {
		return {
			id: this.$route.params.cteId,
			dp: undefined,

			basePath: this.$route.path
		}
	},
	created() {
		if (this.datapack && this.dp === undefined)
			this.dp = this.datapack
	},
	watch: {
		datapack() {
			if (this.dp === undefined)
				this.dp = this.datapack
		},
		dp: {
			handler(val) {
				this.$emit('update:datapack', val)
			},
			deep: true
		}
	},
}
</script>

<style scoped>
</style>