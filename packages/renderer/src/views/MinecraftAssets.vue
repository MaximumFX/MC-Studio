<template>
	<main>
		<navbar>
			<div class="w-1/3">
				<router-link to="/mc-assets" class="nav-link active"><icon icon="arrow_back" em-sizing :optical-size="24"/> Close</router-link>
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
			<div v-else-if="folders" class="flex h-full">
				<div class="w-1/5 p-3 h-full overflow-auto bg-gray-700 no-select">
					<folder-view :folders="folders" @change="selectFolder"/>
				</div>
				<div class="w-1/5 h-full bg-gray-800 no-select">
					<p v-if="!selectedFolder" class="p-3">No folder selected</p>
					<p v-else-if="!fileCache[selectedFolder.path]" class="p-3">Loading items<dot-loader/></p>
					<p v-else-if="fileCache[selectedFolder.path].length === 0" class="p-3">No items in this folder</p>
					<div v-else class="h-full grid grid-rows-[auto_1fr]">
						<form-control v-model="search" placeholder="Search..."/>
						<div class="p-3 overflow-auto">
							<file
								v-for="file of files" :key="file.name"
								:file="file"
								:selected-file="selectedFile"
								@open-file="openFile"
							/>
						</div>
					</div>
				</div>
				<div class="w-3/5 h-full bg-gray-900">
					<p v-if="!selectedFile" class="p-3">No file selected</p>
					<div v-else-if="assetType === 'image'" class="flex p-3 h-full w-full items-center justify-center">
						<img :src="`data:${selectedFile.mime};base64,${selectedFile.data}`" alt="" class="pixelated w-2/3 h-2/3 object-contain">
					</div>

					<div v-else-if="assetType === 'model'" class="grid grid-rows-2 h-full">
						<div v-if="selectedJSON === null" class="p-3">No model available for preview</div>
						<div v-else-if="selectedJSON === undefined" class="p-3">Loading model...</div>
						<model-viewer v-else :version="title" :model="selectedJSON" :name="selectedFile.name" :namespace="namespace"/>
						<div class="overflow-auto border-t border-gray-700">
							<syntax-highlight :data="selectedFile.data" language="json" class="min-h-full"/>
						</div>
					</div>

					<div v-else-if="assetType === 'schematic'" class="grid h-full">
						<div v-if="selectedJSON === null" class="p-3">No model available for preview</div>
						<div v-else-if="selectedJSON === undefined" class="p-3">Loading model...</div>
						<structure-viewer v-else :version="title" :model="selectedJSON" :name="selectedFile.name" :namespace="namespace"/>
<!--						<div class="overflow-auto border-t border-gray-700">-->
<!--							Todo nbt explorer-->
<!--							<syntax-highlight :data="selectedFile.data" language="json" class="min-h-full"/>-->
<!--						</div>-->
					</div>

					<div v-else-if="assetType === 'recipe'" class="grid grid-rows-2 h-full">
						<div class="flex items-center justify-center h-full">
							<div v-if="selectedJSON === null" class="p-3">No recipe available for preview</div>
							<div v-else-if="selectedJSON === undefined" class="p-3">Loading recipe...</div>
							<crafting v-else :recipe="selectedJSON"/>
						</div>
						<div class="overflow-auto border-t border-gray-700">
							<syntax-highlight :data="selectedFile.data" language="json" class="min-h-full"/>
						</div>
					</div>

					<div v-else-if="assetType === 'code'" class="h-full w-full overflow-auto">
						<syntax-highlight :data="selectedFile.data" :language="language" class="min-h-full"/>
					</div>
				</div>
			</div>
			<div v-else-if="$route.query.hasOwnProperty('file')" class="flex justify-center items-center h-full">
				<div class="col-auto">
					<loader/>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
import Navbar from '@/components/core/Navbar';
import Icon from '@/components/core/Icon';
import { useStore } from '@/store';
import Card from '@/components/core/cards/Card';
import CardHeader from '@/components/core/cards/CardHeader';
import CardBody from '@/components/core/cards/CardBody';
import Loader from '@/components/core/Loader';
import FolderView from '@/components/MinecraftAssets/FolderView';
import DotLoader from '@/components/core/DotLoader';
import File from '@/components/MinecraftAssets/File';
import SyntaxHighlight from '@/components/SyntaxHighlight';
import { Recents } from '#main/storage/Recents';
import FormControl from '@/components/core/forms/FormControl';
import MinecraftModel from '@/js/MinecraftModel';
import ModelViewer from '@/components/3d/ModelViewer';
import StructureViewer from '@/components/3d/StructureViewer';
import Crafting from '@/components/minecraft/Crafting';

export default {
	name: 'MinecraftAssets',
	components: {
		Crafting,
		StructureViewer, ModelViewer, FormControl, SyntaxHighlight, File, DotLoader, FolderView, Loader, CardBody, CardHeader, Card, Icon, Navbar,
	},
	data() {
		return {
			title: '',
			error: undefined,

			folders: undefined,

			selectedFolder: undefined,
			selectedFile: undefined,
			selectedJSON: undefined,
			namespace: 'minecraft',
			search: '',

			fileCache: {},
		}
	},
	computed: {
		files() {
			return this.fileCache[this.selectedFolder.path].filter(f => f.name.includes(this.search) && f.name !== '.mcassetsroot')
		},
		assetType() {
			if (this.selectedFile.mime && this.selectedFile.mime.startsWith('image'))
				return 'image'
			if (['nbt', 'schematic'].includes(this.selectedFile.ext))
				return 'schematic'
			if (this.selectedFile.relativePath.includes('models'))
				return 'model'
			if (this.selectedFile.relativePath.includes('recipes'))
				return 'recipe'
			if (['txt', 'json', 'mcmeta', 'nbt', 'glsl', 'fsh', 'vsh', 'frag', 'vert', 'properties'].includes(this.selectedFile.ext))
				return 'code'
			return 'text'
		},
		isCode() {
			return ['txt', 'json', 'mcmeta', 'nbt', 'glsl', 'fsh', 'vsh', 'frag', 'vert', 'properties'].includes(this.selectedFile.ext)
		},
		language() {
			if (this.selectedFile) {
				if (['json', 'mcmeta', 'nbt'].includes(this.selectedFile.ext)) return 'json'
				if (['properties'].includes(this.selectedFile.ext)) return 'properties'
				if (['glsl', 'fsh', 'vsh', 'vert', 'frag'].includes(this.selectedFile.ext)) return 'glsl'
			}
			return 'text'
		},
	},
	async created() {
		if (this.$route.query.hasOwnProperty('file')) {
			console.log('Load file from route:', this.$route.query.file)

			let version = this.$route.query.file.replace(/^.*[\\/]|\.[^/.]+$/g, '')

			const store = useStore()
			store.setTitle('[' + version + '] Minecraft Assets')
			this.title = version

			this.file = await window.api.config.addToRecents(Recents.mcAssets, this.$route.query.file, version)

			this.title = await window.api.onboarding.getMinecraftResources(this.$route.query.file, true)

			this.folders = [{
				name: this.title,
				path: '',
				items: await window.api.mc.getAssets(this.title),
			}]
			await this.selectFolder(this.folders[0])
		}
		else {
			console.error('no file');
			this.error = 'No file was found. Please try again'
		}
	},
	methods: {
		async selectFolder(folder) {
			this.selectedFolder = folder
			this.fileCache[folder.path] = await window.api.mc.getAssets(this.title, folder.path)
		},
		async openFile(file) {
			this.selectedFile = {
				...await window.api.mc.getAsset(this.title, window.joinPaths(this.selectedFolder.path, file.path)),
				name: file.name,
				ext: file.ext,
			}
			this.selectedJSON = undefined
			this.namespace = this.selectedFile.relativePath.split('/')[1]
			if (this.assetType === 'model') {
				try {
					const model = await MinecraftModel.load(this.title, this.namespace, JSON.parse(this.selectedFile.data))
					if (model.elements && model.elements.length)
						this.selectedJSON = model
					else this.selectedJSON = null
				} catch (e) {
					console.log(e)
					this.selectedJSON = null
				}
			}
			else if (this.assetType === 'schematic' || this.assetType === 'recipe') {
				setTimeout(() => this.selectedJSON = JSON.parse(this.selectedFile.data), 500)
			}
		},
	},
};
</script>

<style>
section a:hover,
section a.active {
	@apply text-green-500;
}
</style>
