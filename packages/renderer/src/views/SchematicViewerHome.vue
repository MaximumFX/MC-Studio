<template>
	<homepage
		name="Schematic Viewer"
		description="View and export .nbt and .schem files in 3D"
		open-type="schematic" text-date="Last edited"
		:recent="recent" :todo="['Support .schematic', 'Support .litematic', 'Fix rotation']"
		:item-click="itemClick" :new-item="newItem"
	/>
</template>

<script>
import Homepage from '../components/Homepage';
import { Recents } from '#main/storage/Recents';
export default {
	name: 'SchematicViewerHome',
	components: {Homepage},
	data() {
		return {
			recent: undefined,
		}
	},
	async created() {
		this.recent = await window.api.config.getRecents(Recents.schematics)
	},
	methods: {
		itemClick(item) {
			this.$router.push({ path: '/schematic-viewer/viewer', query: { file: item.file } })
		},
		async newItem() {
			try {
				const file = await window.api.files.selectFile('Open schematic', [{name: 'Structure/Schematic', extensions: ['.nbt', '.schem']}])

				await this.$router.push({ path: '/schematic-viewer/viewer', query: { file } })
			} catch (e) {
				console.warn(e);
			}
		},
	},
};
</script>

<style scoped>

</style>
