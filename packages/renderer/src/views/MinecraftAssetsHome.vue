<template>
	<homepage
		name="Minecraft Assets" open-type="version" text-date="Created"
		:recent="recent" :todo="['NBT Viewer','Sound preview','Schematic preview','Fix uv rotation','Fix rotation rescale']"
		:item-click="itemClick" :new-item="newItem"
	/>
</template>

<script>
import Homepage from '../components/Homepage';
import { Recents } from '#main/storage/Recents';
export default {
	name: 'MinecraftAssetsHome',
	components: {Homepage},
	data() {
		return {
			recent: undefined,
		}
	},
	async created() {
		this.recent = await window.api.config.getRecents(Recents.mcAssets)
	},
	methods: {
		itemClick(item) {
			this.$router.push({ path: '/mc-assets/version', query: { file: item.file } })
		},
		async newItem() {
			try {
				const mcPath = window.joinPaths(await window.api.info.getMinecraftPath(), 'versions')
				const file = await window.api.files.selectFile('Open version', [{name: 'Version', extensions: ['.jar']}], mcPath)

				await this.$router.push({ path: '/mc-assets/version', query: { file } })
			} catch (e) {
				console.warn(e);
			}
		},
	},
};
</script>

<style scoped>

</style>
