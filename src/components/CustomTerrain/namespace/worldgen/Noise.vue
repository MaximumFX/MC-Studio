<template>
	<div class="card card-interactive card-body" v-if="json">
		<h5 class="text-break text-wrap m-0">
			<router-link :to="{name: 'CTENoise', params:{cteId: id, namespace: namespaceId, fileId: file.uuid}}" class="hidden-link stretched-link">
				{{file.name}}
			</router-link>
		</h5>
<!--		<p class="small m-0"><b>First octave:</b> {{ json.firstOctave }}</p>-->
<!--		<p class="small m-0"><b>Amplitudes:</b> {{ json.amplitudes }}</p>-->
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
	name: "Noise",
	components: {Loader, MCIcon},
	props: {
		file: CTFile,
	},
	data() {
		return {
			id: this.$route.params.cteId,
			namespaceId: this.$route.params.namespace,
			json: undefined,
		}
	},
	async created() {
		await this.file.load()
		this.json = this.file.file
	},
}
</script>

<style scoped>
</style>
