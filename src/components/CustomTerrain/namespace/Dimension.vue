<template>
	<div class="card card-interactive card-body" v-if="dimension">
		<div class="row g-3">
			<div class="col-auto">
				<MCIcon type="biome" icon="jungle" class="fs-1"/>
			</div>
			<div class="col">
				<h4 class="text-break text-wrap">
					<router-link :to="{name: 'CTEDimension', params:{cteId: id, namespace: namespaceId, fileId: dimension.uuid}}" class="hidden-link stretched-link">
						{{dimension.name}}
					</router-link>
				</h4>
				<p v-if="file" class="m-0"><b>Type:</b> {{ file.type }}</p>
				<p v-if="file" class="m-0"><b>Generator:</b> {{ file.generator.type }}</p>
			</div>
		</div>
	</div>
	<div v-else class="card loader">
		<Loader class="mx-auto my-3"/>
	</div>
</template>

<script>
import CTFile from "@/js/CustomTerrain/CTFile.ts";
import MCIcon from "@/components/MCIcon";
import Loader from "@/components/Loader";

export default {
	name: "Dimension",
	components: {Loader, MCIcon},
	props: {
		dimension: CTFile,
	},
	data() {
		return {
			id: this.$route.params.cteId,
			namespaceId: this.$route.params.namespace,
			file: undefined,
		}
	},
	async created() {
		await this.dimension.load()
		this.file = this.dimension.file
	},
}
</script>

<style scoped>
</style>
