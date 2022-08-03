<template>
	<ul v-if="folders.length">
		<Folder
			v-for="folder of folders"
			:key="folder.path"
			class="item"
			:folder="folder"
			:selected-path="selectedPath"
			@select-item="selectItem"
		/>
	</ul>
	<p v-else>No data.</p>
</template>

<script>
import Folder from '@/components/MinecraftAssets/Folder';
export default {
	name: 'FolderView',
	components: {Folder},
	props: {
		folders: {
			type: Array,
			required: true,
		},
	},
	emits: ['change'],
	data() {
		return {
			selectedPath: '',
		}
	},
	created() {
		this.selectedPath = this.folders[0].path
	},
	methods: {
		selectItem(item) {
			this.selectedPath = item.path
			this.$emit('change', item)
		},
	},
};
</script>

<style scoped>

</style>
