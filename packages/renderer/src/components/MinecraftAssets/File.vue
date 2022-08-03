<template>
	<p class="truncate" :title="name">
		<a :class="{active}" @click="$emit('openFile', file)">
			<badge v-if="file.ext.length" class="mr-1">{{ file.ext }}</badge>{{ name }}
		</a>
	</p>
</template>

<script>
import Badge from '@/components/core/Badge';
export default {
	name: 'File',
	components: {Badge},
	props: {
		file: {
			type: Object,
			required: true,
		},
		selectedFile: {
			type: Object,
			default: () => ({
				name: '',
			}),
		},
	},
	emits: ['openFile'],
	computed: {
		active() {
			return this.selectedFile.name === this.file.name && this.selectedFile.ext === this.file.ext
		},
		name() {
			return this.file.ext === 'mcmeta' ? this.file.name.replace('.png', '') : this.file.name
		}
	},
};
</script>

<style scoped>

</style>
