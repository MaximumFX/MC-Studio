<template>
	<nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-mcs-secondary">
		<div class="container-fluid justify-content-start">
			<div class="navbar-expand" id="navbarNav">
				<ul class="navbar-nav">
					<li class="nav-item">
						<router-link to="/" class="nav-link active"><i class="fas fa-chevron-left"></i> Back</router-link>
					</li>
				</ul>
			</div>
			<form class="d-flex">
				<button class="btn btn-success" type="button" @click="openFile">Open file</button>
			</form>
		</div>
	</nav>
	<main>
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
	</main>

</template>

<script>
import { writeUncompressed } from 'prismarine-nbt'
import { gzip } from 'node-gzip'
import { ipcRenderer } from 'electron'
import fs from 'fs'

import OSM from "@/js/OSM/OSM"
// import OSMSchematic from "@/js/OSM/OSMSchematic"

let osmOff = null

export default {
	name: "NBTExplorer",
	components: {
	},
	data() {
		return {
			data: null,
			osm: null,
			loading: false,
		}
	},
	methods: {
		async openFile() {
			ipcRenderer.invoke('openFileDialog').then(async result => {
				if (result.canceled !== true) {
					console.log('res',result)
					const buffer = await fs.readFileSync(result.filePaths[0], 'utf8')
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
			const schematic = await ipcRenderer.invoke('createOSMSchematic', osmOff)
			// const schematic = await new OSMSchematic(this.osm).create()
			const outBuffer = fs.createWriteStream('galaxysedgeV27.schem')
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
</script>

<style scoped>
main {
	padding-top: 3.5rem;
	height: 100vh;
}
main > .container-fluid {
	padding-top: .5rem;
	height: 100%;
	overflow-y: auto;
}
</style>