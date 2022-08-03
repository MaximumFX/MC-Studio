<template>
	<main class="no-select">
		<navbar>
			<div class="w-1/3">
				<router-link to="/schematic-viewer" class="nav-link active"><icon icon="arrow_back" em-sizing :optical-size="24"/> Close</router-link>
			</div>
			<div class="w-1/3 text-center">
				<h6 v-if="title" class="m-0">{{ title }}</h6>
			</div>
		</navbar>
		<section>
			<div v-if="error" class="flex items-center justify-center h-full">
				<card color="red" class="w-1/2 h-auto">
					<card-header>Error</card-header>
					<card-body>{{ error }}</card-body>
				</card>
			</div>

			<div v-else-if="file === null" class="p-3">No model available for preview</div>
			<div v-else-if="file === undefined" class="p-3">Loading model...</div>
			<structure-viewer v-else :model="file" :name="title" @error="onError"/>
		</section>
	</main>
</template>

<script>
import Navbar from '@/components/core/Navbar';
import Icon from '@/components/core/Icon';
import Card from '@/components/core/cards/Card';
import CardHeader from '@/components/core/cards/CardHeader';
import CardBody from '@/components/core/cards/CardBody';
import StructureViewer from '@/components/3d/StructureViewer';
import { useStore } from '@/store';
import { Recents } from '#main/storage/Recents';
import Schematic from '#main/minecraft/Schematic';

export default {
	name: 'SchematicViewer',
	components: {StructureViewer, CardBody, CardHeader, Card, Icon, Navbar},
	data() {
		return {
			title: 'Loading...',
			error: undefined,

			file: undefined,
		}
	},
	async created() {
		if (this.$route.query.hasOwnProperty('file')) {
			console.log('Load file from route:', this.$route.query.file)

			let title = this.$route.query.file.replace(/^.*[\\/]|\.[^/.]+$/g, '')

			const store = useStore()
			store.setTitle('[' + title + '] Schematic Viewer')
			this.title = title

			await window.api.config.addToRecents(Recents.schematics, this.$route.query.file, title)

			let file = await window.api.mc.getNBT(this.$route.query.file)

			console.log('schem', this.$route.query.file, file);
			if (this.$route.query.file.endsWith('.schem')) {
				console.log('Converting schematic to structure...');
				file = new Schematic(file).asStructure()
				console.log('Converted.');
			}
			this.file = file
		}
		else {
			console.error('no file');
			this.error = 'No file was found. Please try again'
		}
	},
	methods: {
		onError(e) {
			if (e === 'no_blocks') e = 'There are no blocks in this schematic'
			this.error = e
		},
	},
};
</script>

<style scoped>

</style>
