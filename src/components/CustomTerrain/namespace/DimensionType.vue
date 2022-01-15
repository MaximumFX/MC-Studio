<template>
	<div class="card card-interactive card-body" v-if="dimensionType">
		<div class="row g-3 align-items-center h-100">
			<div class="col-auto">
				<MCIcon type="biome" icon="jungle" class="fs-1"/>
			</div>
			<div class="col">
				<h4 class="text-break text-wrap m-0">
					<router-link :to="{name: 'CTEDimensionType', params:{cteId: id, namespace: namespaceId, fileId: dimensionType.uuid}}" class="hidden-link stretched-link">
						{{dimensionType.name}}
					</router-link>
				</h4>
			</div>
		</div>
	</div>
	<div v-else class="card loader">
		<Loader/>
	</div>
</template>

<script>
import CTFile from "@/js/CustomTerrain/CTFile.ts";
import MCIcon from "@/components/MCIcon";
import Loader from "@/components/Loader";

export default {
	name: "DimensionType",
	components: {Loader, MCIcon},
	props: {
		dimensionType: CTFile,
	},
	data() {
		return {
			id: this.$route.params.cteId,
			namespaceId: this.$route.params.namespace,
			file: undefined,
		}
	},
	async created() {
		await this.dimensionType.load()
		this.file = this.dimensionType.file
	},
}
</script>

<style scoped>
</style>
