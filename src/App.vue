<template>
	<router-view/>
</template>

<script>
import {ipcRenderer} from "electron"
import path from "path";
import {ConfigManager} from "@/js/storage";
import {config, setConfigManager} from "@/js/state";
import {EventList} from "@/js/events";
import DataPack from "@/js/CustomTerrain/DataPack";
import fs from "fs";
import {getRouteForFile} from "@/js/path";

export default {
	name: 'App',
	data() {
		return {
			ready: false
		}
	},
	async created() {
		console.log('== INITIALIZE ==')

		setConfigManager(new ConfigManager())

		ipcRenderer.on('setPage', async (event, file) => {
			const isSaved = await ipcRenderer.invoke(EventList.isSaved)
			console.log('setPage', isSaved, file)
			const route = getRouteForFile(file)
			if (isSaved) {
				this.$route.push({ path: route, query: { file } })
			}
			else {
				console.log('todo dialog save changes')
				this.$route.push({ path: route, query: { file } })
			}
		})

		ipcRenderer.on('accelerator', async (evt, type) => {
			if (this.$route.meta.page === 'custom-terrain') {
				if (type === 'import') {
					const zipPath = await ipcRenderer.invoke(EventList.SELECT_FILE, 'Open datapack')
					const datapack = await DataPack.createFromZip(zipPath)
					config.value.customTerrain.add('datapacks', datapack.getWithoutData())
					config.value.customTerrain.save()
					const userData = await ipcRenderer.invoke(EventList.getPath, 'userData')
					const filePath = path.join(userData, 'Data', 'custom_terrain/packs', datapack.id + '.datapack')
					fs.writeFileSync(filePath, JSON.stringify(datapack), 'utf8')
				}
			}
		})

		this.ready = true
	}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap');

:root {
	--text: #fff;
	--border: #888;
	--bg: #333;
	--secondary: #292929;
	--tertiary: #4f4f4f;
	--foreground: #121212;
	--foreground-lighter: #1c1c1c;

	/* Primary */
	--secondary-primary: #1c2129;
	--foreground-lighter-primary: #13171c;

	/* Warning */
	--secondary-warning: #29261c;
	--foreground-lighter-warning: #1c1a13;

	/* Info */
	--secondary-info: #1c2729;
	--foreground-lighter-info: #131b1c;

	--green: var(--bs-success);

	--shadow: 0 .25rem .25rem rgba(0, 0, 0, .32);
}

body {
	font-family: 'Open Sans', sans-serif;
	background-color: var(--bg);
	color: var(--text);
	-webkit-font-smoothing: antialiased;
	-webkit-overflow-scrolling: touch;
}

h1, h2, h3, h4, h5, h6 {
	font-weight: 700;
}

/* Scroll bars */
::-webkit-scrollbar {
	width: .75rem;
	height: .75rem;
}
::-webkit-scrollbar-thumb {
	background: var(--tertiary);
	border-radius: 0;
	border: 0;
}
::-webkit-scrollbar-thumb:hover {
	background: var(--tertiary);
}
::-webkit-scrollbar-track {
	background: var(--secondary);
	border-radius: 0;
}
::-webkit-scrollbar-corner {
	background: var(--secondary);
}

/* Page Scrolling */
main {
	height: 100vh;
	display: flex;
	flex-direction: column;
}
section {
	flex: 1;
	overflow-y: auto;
}

.container-fluid {
	--bs-gutter-x: 1rem;
	--bs-gutter-y: 1rem;
}

/* Cursors */
.cursor-pointer {
	cursor: pointer;
}

/* Colors */
.bg-mcs-bg {
	background-color: var(--bg) !important;
}
.bg-mcs-secondary {
	background-color: var(--secondary) !important;
}
.bg-mcs-foreground {
	background-color: var(--foreground) !important;
}
.text-muted {
	color: #8f8f8f !important;
}

/* Dark backgrounds */
.card, .card-header, .card-body, .card-footer {
	border-radius: 0 !important;
	border: 0;
}
.card {
	--card-bg: var(--foreground);
	--card-header: var(--secondary);
	background-color: var(--card-bg);
	box-shadow: var(--shadow);
}
.card .card {
	--card-bg: var(--foreground-lighter);
	border: 2px solid var(--card-header);
}
.card-interactive:hover,
.card-header {
	background-color: var(--card-header);
}
.card-thumbnail {
	background-size: cover;
	background-position: center;
}

.table-dark {
	--bs-table-bg: var(--foreground);
	--bs-table-striped-bg: #2c3034;
	--bs-table-striped-color: #fff;
	--bs-table-active-bg: #373b3e;
	--bs-table-active-color: #fff;
	--bs-table-hover-bg: var(--tertiary);
	--bs-table-hover-color: #fff;
	color: #fff;
	border-color: #373b3e;
}
.table>tbody>tr>* {
	background-color: var(--secondary);
}

/* Card Colors */
.card .card-primary,
.card .card-primary .card:not([class*=card-]) {
	--card-bg: var(--foreground-lighter-primary);
	--card-header: var(--secondary-primary);
}
.card .card-warning,
.card .card-warning .card:not([class*=card-]) {
	--card-bg: var(--foreground-lighter-warning);
	--card-header: var(--secondary-warning);
}
.card .card-info,
.card .card-info .card:not([class*=card-]) {
	--card-bg: var(--foreground-lighter-info);
	--card-header: var(--secondary-info);
}

/* Nav */
.navbar {
	box-shadow: var(--shadow);
	z-index: 1000;
}

.nav-select {
	/*flex-wrap: nowrap;*/
	/*overflow-x: auto;*/
}
.nav-select .nav-link {
	color: var(--border);
	position: relative;
	padding-bottom: 1rem;
	white-space: nowrap;
	cursor: pointer;
}
.nav-select .nav-link::before {
	content: "";
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	height: .25rem;
	width: 1.5rem;
}
.nav-select .nav-link:hover,
.nav-select .nav-link.active,
.nav-select .nav-link:active {
	color: var(--text);
}
.nav-select .nav-link.active::before,
.nav-select .nav-link:active::before {
	background-color: var(--green);
}

/* Nav tabs */
.nav-tabs {
	border: none;
}
.nav-tabs .nav-link {
	border-radius: 0;
	border: none;
}
.nav-tabs .nav-item.show .nav-link,
.nav-tabs .nav-link.active {
	color: var(--text);
	background-color: var(--foreground-lighter);
}


/* Dropdown */
.dropdown-menu {
	border-radius: 0;
	background-color: var(--foreground);
	border: 2px solid var(--secondary);
}
.dropdown-menu .dropdown-item {
	color: var(--text);
}
.dropdown-menu .dropdown-item:hover {
	background-color: var(--foreground-lighter);
}
.dropdown-menu .dropdown-item:focus,
.dropdown-menu .dropdown-item.active,
.dropdown-menu .dropdown-item:active {
	background-color: var(--green);
}

/* Collapse */
.btn-collapse i {
	transition: .35s ease;
}
.btn-collapse[aria-expanded=false] i {
	transform: rotate(-90deg);
}

/* Buttons */
.btn {
	border-radius: 0;
}

/* FORMS */
.input-group-text,
.form-control,
.form-select {
	border-radius: 0;
}
.form-control,
.form-select {
	background-color: transparent;
	border-color: var(--border);
	color: var(--text);
}
.form-control:focus {
	background-color: transparent;
	color: var(--text);
}
.input-group-text {
	background-color: var(--bg);
	border-color: var(--border);
	color: var(--text);
}
.form-check-input {
	cursor: pointer;
	border-radius: 0 !important;
	background-color: transparent;
	border-color: var(--border);
}
.form-check-input:focus {
	outline: none;
	box-shadow: none;
}
.form-check-input:checked {
	background-color: var(--bs-success);
	border-color: var(--bs-success);
}
.form-check-input:checked[type=radio] {
	background-color: var(--text);
	box-shadow: inset 0 0 0 .2rem var(--bs-success);
}


/* UTILITIES */
.overflow-y-auto {
	overflow-y: auto;
}
</style>
