<template>
	<main>
		<navbar>
			<router-link to="/" class="nav-link active"><icon icon="arrow_back" em-sizing :optical-size="24"/> Back</router-link>
		</navbar>
		<section>
			<div class="flex h-full">
				<div class="w-1/4 p-4 bg-mcs-secondary">
					<h3 class="mb-3">World Viewer</h3>
					<t-button class="w-full" @click="openFile">Open file</t-button>
					<hr>
					<h4 class="text-yellow-400"><i class="fa-regular fa-construction"/> Todo</h4>
					<ul>
						<li>Export map</li>
						<li>Import resource pack for map</li>
						<li>Export 3D model</li>
						<li>Datapack's biomes</li>
						<li>Mod's blocks & biomes</li>
						<li>Right click menu to rerender</li>
						<li>Load only specific regions/chunks</li>
						<li>Fix holes in water</li>
					</ul>
				</div>
				<div class="w-3/4 h-full overflow-y-auto">
					<div v-if="recent.length" class="p-4">
						<h4>Recent</h4>
						<table class="w-full">
							<colgroup>
								<col span="1" style="width: 50%;">
								<col span="1" style="width: 30%;">
								<col span="1" style="width: 15%;">
								<!--									<col span="1" style="width: auto;">-->
							</colgroup>

							<thead class="text-left">
								<tr>
									<th scope="col">Name</th>
									<th scope="col">Last opened</th>
									<th scope="col">Size</th>
									<!--										<th scope="col"></th>-->
								</tr>
							</thead>
							<tbody>
								<tr v-for="(file, i) in recent" :key="i" @click="$router.push({ path: '/world-viewer/viewer', query: { file: file.file } })">
									<td>
										<p class="mb-1">{{ file.name }}</p>
										<p class="truncate text-muted text-sm" :title="file.path">{{ file.file }}</p>
										<p v-if="isDev" class="truncate text-muted text-sm" :title="file.uuid">{{ file.uuid }}</p>
									</td>
									<td>{{ file.lastOpened }}</td>
									<td>{{ file.size }}</td>
									<!--										<td>...</td>-->
								</tr>
							</tbody>
						</table>
					</div>

					<div v-else class="flex flex-col items-center justify-center h-full">
						<h6 class="display-6">You don't have any recent files</h6>
						<img src="https://static.wikia.nocookie.net/minecraft-computer/images/1/1f/Dead_Bush.png" alt="Dead bush" width="128" class="mb-3">
						<!--todo local deadbush -->
						<t-button @click="openFile">Open file</t-button>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
import { Recents } from '#main/storage/Recents';
import Navbar from '@/components/core/Navbar';
import Icon from '@/components/core/Icon';
import TButton from '@/components/core/TButton';

export default {
	name: 'WorldViewerHome',
	components: {TButton, Icon, Navbar},
	data() {
		return {
			recent: [],
			isDev: window.vars.IS_DEV,
		}
	},
	async created() {
		this.recent = await window.api.config.getRecents(Recents.worldViewer)
	},
	methods: {
		async openFile() {
			try {
				const file = await window.api.files.selectFile('Open level', [{name: 'Level', extensions: ['.dat']}])

				await this.$router.push({ path: '/world-viewer/viewer', query: { file } })
			} catch (e) {
				console.warn(e);
			}
		},
	},
}
</script>

<style scoped>
table {
	table-layout: fixed;
}
tbody tr {
	cursor: pointer;
	@apply hover:bg-gray-700
}
</style>
