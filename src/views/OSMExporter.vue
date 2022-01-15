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
				<form class="ms-auto d-flex">
					<button class="btn btn-success" type="button" @click="openFile">Open file</button>
				</form>
			</div>
		</nav>
		<section>
			<div class="container-fluid" v-if="osm">
				<div class="row">
					<div class="col">
						<p><b>Version</b>: {{ osm.version }}</p>
						<p><b>Generator</b>: {{ osm.generator }}</p>
						<p><b>Copyright</b>: {{ osm.copyright }}</p>
						<p><b>Attribution</b>: {{ osm.attribution }}</p>
						<p><b>License</b>: {{ osm.license }}</p>
						<p><b>Bounds</b>: {{ Object.entries(osm.bounds).map(a => `${a[0]}: ${a[1]}`).join(', ') }}</p>
						<p><b>Nodes</b>: {{ osm.nodes.length }}</p>
						<p><b>Ways</b>: {{ osm.ways.length }}</p>
						<p><b>Relations</b>: {{ osm.relations.length }}</p>

						<!-- TODO map viewer, schematic options -->
						<button class="btn btn-primary" @click="createSchematic" :disabled="loading">{{ loading ? 'Loading...' : 'Create schematic' }}</button>
					</div>
				</div>
			</div>
			<div v-else class="container-fluid">
				<p>Export your selection from OpenStreetMap
					<a href="#" @click="require('electron').shell.openExternal('https://www.openstreetmap.org/export')">here</a>
					and import it using the button above.
				</p>
			</div>
		</section>
	</main>
</template>

<script>
import {writeUncompressed} from 'prismarine-nbt'
import {gzip} from 'node-gzip'
import {ipcRenderer} from 'electron'
import fs from 'fs'

import OSM from "@/js/OSM/OSM"
import {EventList} from "@/js/events";
import {SaveFile} from "@/js/electron/Dialogs";
import path from "path";

let osmOff = null

export default {
	name: "NBTEditor",
	components: {
	},
	data() {
		return {
			data: null,
			osm: null,
			loading: false,

			fileName: undefined
		}
	},
	methods: {
		async openFile() {
			ipcRenderer.invoke('openFileDialog', [{name:'OSM Data', extensions: ['osm']}]).then(async result => {
				if (result.canceled !== true) {
					console.log('res',result)
					const buffer = await fs.readFileSync(result.filePaths[0], 'utf8')
					this.fileName = path.basename(result.filePaths[0], path.extname(result.filePaths[0]))
					const parser = new DOMParser()
					const dom = parser.parseFromString(buffer, "application/xml")
					const osm = OSM.fromXML(dom)
					this.data = dom
					this.osm = osm
					osmOff = buffer
					console.log('OSM:', osm)
				}
			}).catch(err => {
				console.error(err)
			})
		},
		async createSchematic() {
			this.loading = true
			console.log('=== Creating Schematic from OSM ===')
			console.time('schematic')
			const schematic = await ipcRenderer.invoke(EventList.CREATE_OSM_SCHEMATIC, osmOff)
			const res = await ipcRenderer.invoke(EventList.dialog,
				new SaveFile(undefined, undefined, this.fileName, undefined, [{name:'Schematic', extensions: ['schem']}])
			)
			if (!res.canceled) {
				if (schematic) {
					const outBuffer = fs.createWriteStream(res.filePath)
					const newBuf = writeUncompressed(schematic, 'big')
					outBuffer.write(await gzip(newBuf))
					outBuffer.end(() => {
						console.timeEnd('schematic')
						console.log('written!')
						this.loading = false
					})
				}
			}
		}
	}
}
</script>

<style scoped>
section > .container-fluid {
	padding-top: .5rem;
	height: 100%;
	overflow-y: auto;
}
</style>
