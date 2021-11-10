<template>
	<ol class="breadcrumb m-0">
		<li v-for="(item, i) in path" :key="i" :class="['breadcrumb-item', i === path.length - 1 ? 'active' : '']">
			<router-link v-if="i !== path.length - 1" :to="item.path">{{ item.name }}</router-link>
			<span v-else>{{ item.name }}</span>
		</li>
	</ol>
</template>

<script>
import DataPack from "@/js/CustomTerrain/DataPack.ts";

export default {
	name: "Breadcrumbs",
	props: {
		datapack: DataPack
	},
	computed: {
		path() {
			const par = this.$route.params
			const path = [{
				path: `/custom-terrain/editor/${par.cteId}`,
				name: this.datapack.name
			}]
			if (par.hasOwnProperty('namespace'))
				path.push({
					path: `/custom-terrain/editor/${par.cteId}/${par.namespace}`,
					name: par.namespace
				})
			return path
		}
	}
}
</script>

<style scoped>

</style>