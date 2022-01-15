<template>
	<div class="card card-interactive card-body" v-if="file">
		<h5 class="text-break text-wrap m-0">
			<router-link :to="{name: 'CTEConfiguredCarver', params:{cteId: id, namespace: namespaceId, fileId: configuredCarver.uuid}}" class="hidden-link stretched-link">
				{{configuredCarver.name}}
			</router-link>
		</h5>
		<p class="small m-0">{{ file.type }}</p>
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
	name: "ConfiguredCarver",
	components: {Loader, MCIcon},
	props: {
		configuredCarver: CTFile,
	},
	data() {
		return {
			id: this.$route.params.cteId,
			namespaceId: this.$route.params.namespace,
			file: undefined,
		}
	},
	async created() {
		await this.configuredCarver.load()
		this.file = this.configuredCarver.file
	},
}
</script>

<style scoped>
</style>
