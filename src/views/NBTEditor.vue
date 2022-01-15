<template>
	<main>
		<nav class="navbar navbar-expand-lg navbar-dark bg-mcs-secondary">
			<div class="container-fluid justify-content-start">
				<div class="navbar-expand" id="navbarNav">
					<ul class="navbar-nav">
						<li class="nav-item">
							<router-link to="/nbt-editor" class="nav-link active"><i class="fas fa-chevron-left"></i> Close</router-link>
						</li>
					</ul>
				</div>
				<form class="d-flex ms-auto">
					<div class="form-check">
						<input v-model="showRaw" class="form-check-input" type="checkbox" value="" id="showRaw">
						<label class="form-check-label" for="showRaw">
							Show compiled JSON
						</label>
					</div>
				</form>
			</div>
		</nav>
		<section>
			<div class="container-fluid g-0 h-100">
				<div v-if="data" class="row g-0 h-100">
					<div class="col p-3 h-100 overflow-y-auto">
						<NBTView :data="data" class="data"/>
					</div>
					<div class="col-5 h-100" v-show="showRaw">
						<SyntaxHighlight :data="data" class="h-100 overflow-y-auto"/>
					</div>
				</div>
				<div v-else-if="$route.query.hasOwnProperty('file')" class="row justify-content-center align-items-center h-100">
					<div class="col-auto">
						<Loader/>
					</div>
				</div>
			</div>
		</section>
	</main>
	<NBTChangeValueModal @edit="changeVal"/>
</template>

<script>
import { ipcRenderer } from 'electron'
import fs from 'fs'
import { parse } from 'prismarine-nbt'
import NBTView from "@/components/NBTView"
import NBTChangeValueModal from "@/components/modals/NBTChangeValueModal"
import {config, setState} from "@/js/state"
import path from "path";
import {EventList} from "@/js/events";
import SyntaxHighlight from "@/components/SyntaxHighlight";
import Loader from "@/components/Loader";

export default {
	name: "NBTEditor",
	components: {
		Loader,
		SyntaxHighlight,
		NBTChangeValueModal,
		NBTView
	},
	data() {
		return {
			data: null,
			showRaw: false,
		}
	},
	methods: {
		async parseFile(file) {
			const buffer = await fs.readFileSync(file)
			const { parsed, type } = await parse(buffer)
			this.data = parsed

			setState('nbtOpenFile', { parsed, type })
			this.$store.commit('setTitle', '[' + path.basename(file) + '] NBT Editor')
			console.log('JSON serialized:', parsed, type)

			// Add to recent
			let recent = config.value.nbtEditor.get('recent') ?? []
			if (recent.includes(file)) {
				recent = recent.filter(a => a !== file)
				recent.push(file)
			}
			else recent.push(file)
			config.value.nbtEditor.set('recent', recent)
			config.value.nbtEditor.save()
		},

		changeVal(val) {
			console.log('[changeVal]', val)
			ipcRenderer.invoke(EventList.setSaved, false)
		}
	},
	created() {
		if (this.$route.query.hasOwnProperty('file')) {
			console.log('Load file from route:', this.$route.query.file)
			this.parseFile(this.$route.query.file)
		}
	}
}
</script>

<style scoped>
main {
	user-select: none;
}
section .container-fluid {
	--bs-gutter-x: 0;
	--bs-gutter-y: 0;
}
</style>
