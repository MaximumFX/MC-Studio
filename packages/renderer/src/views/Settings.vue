<template>
	<main>
		<navbar>
			<router-link to="/">
				<icon icon="arrow_back" em-sizing :optical-size="24"/> Back
			</router-link>
			<!--			<a href="#" @click="$router.go(-1)">-->
			<!--				<icon icon="arrow_back" em-sizing :optical-size="24"/> Back-->
			<!--			</a>-->
		</navbar>
		<section class="flex justify-center py-4">
			<div class="w-1/2">
				<h4>Storage</h4>
				<label for="mcDir" class="mb-2">Minecraft Directory</label>
				<div class="flex mb-4">
					<form-control id="mcDir" v-model="mcDir" placeholder="Minecraft Directory"/>
					<t-button class="flex !p-2" @click="selectMCDir"><icon icon="folder"/></t-button>
				</div>
				<hr class="my-6">
				<h4>Resource packs</h4>
				<p>Coming soon</p>
				<hr class="my-6">
				<h4>Mods</h4>
				<p>Coming soon</p>
				<hr class="my-6">
				<t-button :disabled="saved" @click="save">Save</t-button>
			</div>
		</section>
		<footer class="flex bg-mcs-secondary px-4 py-3">
			<p>
				Made by <strong><a href="https://maximumfx.nl/" target="_blank">MaximumFX</a></strong> |
				<a href="https://github.com/MaximumFX/MC-Studio/" target="_blank" class="mr-2"><i class="fa-brands fa-github"/></a>
				<a href="https://discord.gg/ym2D4zHjYS" target="_blank" class="mr-2"><i class="fa-brands fa-discord"/></a>
				<a href="https://twitter.com/MCStudioApp" target="_blank" class="mr-2"><i class="fa-brands fa-twitter"/></a>
			</p>
			<p class="ml-auto">v{{ version }}</p>
		</footer>
	</main>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useStore } from '@/store'
import Navbar from '../components/core/Navbar';
import Icon from '../components/core/Icon';
import FormControl from '@/components/core/forms/FormControl';
import TButton from '@/components/core/TButton';

export default {
	name: 'Settings',
	components: {TButton, FormControl, Icon, Navbar},
	data() {
		window.api.info.getMinecraftPath
		return {
			version: window.api.info.getAppVersion(),
			mcDir: window.api.info.getMinecraftPath(),//TODO
		}
	},
	computed: {
		...mapState(useStore, ['saved']),
	},
	watch: {
		mcDir() {
			this.edit()
		},
	},
	methods: {
		async selectMCDir() {
			try {
				const dir = await window.api.files.openFolder('Select Minecraft directory', this.mcDir)
				if (dir !== this.mcDir) {
					this.mcDir = dir
				}
			} catch (e) {
				console.log(e)
			}
		},
		edit() {
			this.setSaved(false)
		},
		save() {
			this.setSaved(true)
			console.log('saved')
		},
		...mapActions(useStore, ['setSaved']),
	},
};
</script>

<style scoped>

</style>
