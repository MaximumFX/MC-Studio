<template>
	<main>
		<navbar>
			<div class="w-1/3">
				<router-link to="/world-viewer" class="nav-link active"><icon icon="arrow_back" em-sizing :optical-size="24"/> Close</router-link>
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
			<div v-else-if="tiles" class="h-full">
				<WorldMap :base-path="basePath" :tiles="tiles"/>
			</div>
			<div v-else-if="$route.query.hasOwnProperty('file')" class="flex justify-center items-center h-full">
				<div class="col-auto">
					<Loader/>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
import Loader from '@/components/core/Loader';
import WorldMap from '@/components/WorldViewer/WorldMap';
import Navbar from '@/components/core/Navbar';
import Icon from '@/components/core/Icon';
import { useStore } from '@/store';
import { Recents } from '#main/storage/Recents';
import { ProgressItem, ProgressType } from '#main/models/Progress';
import Card from '@/components/core/cards/Card';
import CardBody from '@/components/core/cards/CardBody';
import CardHeader from '@/components/core/cards/CardHeader';

export default {
	name: 'WorldViewer',
	components: {
		CardHeader,
		CardBody,
		Card,
		Icon,
		Navbar,
		WorldMap,
		Loader,
	},
	data() {
		return {
			file: undefined,
			region: undefined,
			data: undefined,
			tiles: undefined,
			basePath: undefined,

			title: undefined,
			error: undefined,
		}
	},
	async created() {
		if (this.$route.query.hasOwnProperty('file')) {
			console.log('Load file from route:', this.$route.query.file)

			const data = await window.api.mc.getNBT(this.$route.query.file)

			console.log(data.Data.Version);
			if (data.Data.Version.Id >= 2860) {
				const store = useStore()
				store.setTitle('[' + data.Data.LevelName + '] World Viewer')
				this.title = data.Data.LevelName

				this.file = await window.api.config.addToRecents(Recents.worldViewer, this.$route.query.file, data.Data.LevelName)

				await this.parseFile(this.$route.query.file)
			}
			else {
				console.error('below 1.18', data.Data.Version);
				this.error = `The world you selected is from a version below 1.18 (${data.Data.Version.Name}) and is not supported yet. Please upgrade the world to use the viewer.`
			}
		}
		else {
			console.error('no file');
			this.error = 'No file was found. Please try again'
		}
	},
	methods: {
		async parseFile(file) {
			window.api.progress.createAdvanced(ProgressType.WORLD_VIEWER, 'Finding regions')
			this.tiles = (await window.api.worldViewer.getRegions(file)).map(t => ({...t, status: 'Loading'}))
			console.log('tiles', this.tiles)

			window.api.progress.setStatus(ProgressType.WORLD_VIEWER, 'Loading regions')
			window.api.progress.addItems(ProgressType.WORLD_VIEWER, [...this.tiles].map(t =>
				new ProgressItem(t.path,'Loading image for ' + t.path, 1),
			))

			for (const tile of this.tiles) {
				let img = await window.api.worldViewer.getMap(this.file.uuid, tile.path)
				if (!img) {
					console.log('Create tile ', tile.path)
					await window.api.worldViewer.createMap(this.file.uuid, file, tile.path)
					img = await window.api.worldViewer.getMap(this.file.uuid, tile.path)
				}
				tile.img = img
			}
		},
	},
}
</script>

<style scoped>
main {
	user-select: none;
}
</style>
