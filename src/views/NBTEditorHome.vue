<template>
	<main>
		<nav class="navbar navbar-expand-lg navbar-dark bg-mcs-secondary">
			<div class="container-fluid justify-content-start">
				<div class="navbar-expand" id="navbarNav">
					<ul class="navbar-nav">
						<li class="nav-item">
							<router-link to="/" class="nav-link active"><i class="fas fa-chevron-left"></i> Back</router-link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		<section>
			<div class="container-fluid h-100">
				<div class="row h-100">
					<div class="col-3 py-3 bg-mcs-secondary">
						<h3 class="mb-3">NBT Editor</h3>
						<button class="btn btn-outline-success d-block w-100" type="button" disabled>New</button>
<!--						todo add template-->
						<p class="text-muted text-center"><small>Coming soon</small></p>
						<button class="btn btn-success d-block w-100" type="button" @click="openFile">Open</button>
						<hr>
						<h4 class="text-warning"><i class="far fa-construction"></i> Todo</h4>
						<ul>
							<li>Edit values</li>
							<li>Save edited files</li>
							<li>Create new file</li>
						</ul>
					</div>
					<div class="col-9 h-100 overflow-y-auto">
						<div v-if="recent.length" class="py-3">
							<h4>Recent</h4>
							<table class="table mb-0 table-dark table-hover">
								<colgroup>
									<col span="1" style="width: 50%;">
									<col span="1" style="width: 25%;">
									<col span="1" style="width: 20%;">
<!--									<col span="1" style="width: auto;">-->
								</colgroup>

								<thead>
									<tr>
										<th scope="col">Name</th>
										<th scope="col">Last opened</th>
										<th scope="col">Size</th>
<!--										<th scope="col"></th>-->
									</tr>
								</thead>
								<tbody>
									<tr v-for="(file, i) in recent" :key="i" @click="$router.push({ path: '/nbt-editor/editor', query: { file: file.path } })">
										<td>
											<p class="mb-1">{{ file.name }}</p>
											<p class="m-0 text-truncate text-muted small" :title="file.path">{{ file.path }}</p>
										</td>
										<td>{{ file.lastOpened }}</td>
										<td>{{ file.size }}</td>
<!--										<td>...</td>-->
									</tr>
								</tbody>
							</table>
						</div>

						<div v-else class="d-flex flex-column align-items-center justify-content-center h-100">
							<h6 class="display-6">You don't have any recent files</h6>
							<img src="https://static.wikia.nocookie.net/minecraft-computer/images/1/1f/Dead_Bush.png" alt="Dead bush" width="128" class="mb-3">
							<button class="btn btn-success" type="button" @click="openFile">Open file</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
import { ipcRenderer } from 'electron'
import fileSize from 'filesize'
import dateFormat from 'dateformat'
import {config} from "@/js/state";
import path from "path";
import fs from "fs";

export default {
	name: "NBTEditorHome",
	data() {
		return {
			recent: []
		}
	},
	methods: {
		async openFile() {
			ipcRenderer.invoke('openFileDialog').then(async result => {
				if (result.canceled !== true) {
					console.log('res',result)
					this.$router.push({ path: '/nbt-editor/editor', query: { file: result.filePaths[0] } })
				}
			}).catch(err => {
				console.error(err)
			})
		},
	},
	created() {
		const recent = (config.value.nbtEditor.get('recent') ?? []).filter(r => fs.existsSync(r))
		config.value.nbtEditor.set('recent', recent)
		config.value.nbtEditor.save()
		this.recent = recent.map(r => {
			const stats = fs.statSync(r)
			return {
				path: r,
				name: path.basename(r),
				lastOpened: dateFormat(new Date(stats.mtime), "d mmmm yyyy HH:MM:ss"),
				size: fileSize(stats.size)
			}
		}).reverse()
	}
}
</script>

<style scoped>
table {
	table-layout: fixed;
}
tr {
	cursor: pointer;
}
</style>
