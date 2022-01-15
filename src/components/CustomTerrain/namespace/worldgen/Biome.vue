<template>
	<div class="card card-interactive card-body" v-if="biome">
		<div class="row g-3 align-items-center h-100">
			<div class="col-auto">
				<MCSprite :sprite="sprite" class="fs-3"/>
			</div>
			<div class="col">
				<h6 class="text-break text-wrap m-0">
					<router-link :to="{name: 'CTEBiome', params:{cteId: id, namespace: namespaceId, fileId: biome.uuid}}" class="hidden-link stretched-link">
						{{biome.name}}
					</router-link>
				</h6>
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
import MCSpriteComp from "@/components/MCSprite";
import MCSprite, {MCSpriteType} from "@/js/MCSprite";

export default {
	name: "Biome",
	components: {MCSprite: MCSpriteComp, Loader, MCIcon},
	props: {
		biome: CTFile,
	},
	data() {
		return {
			id: this.$route.params.cteId,
			namespaceId: this.$route.params.namespace,
			file: undefined,
		}
	},
	async created() {
		await this.biome.load()
		this.file = this.biome.file
	},
	computed: {
		sprite() {
			return this.biome.sprite ?? new MCSprite(MCSpriteType.BIOME, this.biome.name.replace(/_/g, '-'))
		}
	}
}
</script>

<style scoped>
</style>
