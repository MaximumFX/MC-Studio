export default {
	data() {
		return {
			cdeId: this.$route.params.cteId,
			namespaceId: this.$route.params.namespace,
		}
	},
	computed: {
		customTerrain() {
			return this.$store.state.custom_terrain.customTerrain
		},
		namespace() {
			return this.customTerrain.getNamespace(this.namespaceId)
		},
	},
}
