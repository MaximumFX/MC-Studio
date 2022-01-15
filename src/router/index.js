import { ipcRenderer } from "electron"
import {createRouter, createWebHistory, createWebHashHistory} from "vue-router"
import {EventList} from "@/js/events";
import store from "@/store";

import Home from "@/views/Home"
import SchematicViewer from "@/views/SchematicViewer"
import OSMExporter from "@/views/OSMExporter"
import NBTEditorHome from "@/views/NBTEditorHome";
import NBTEditor from "@/views/NBTEditor"
import customTerrainRouter from "@/router/custom-terrain";

const routes = [
	{
		path: '/',
		name: 'MC Studio',
		component: Home,
		meta: {
			page: 'home'
		}
	},
	{
		path: '/nbt-editor',
		name: 'NBT Editor Home',
		component: NBTEditorHome,
		meta: {
			page: 'nbt-editor',
			name: 'NBT Editor'
		}
	},
	{
		path: '/nbt-editor/editor',
		name: 'NBT Editor',
		component: NBTEditor,
		meta: {
			page: 'nbt-editor',
			name: 'NBT Editor'
		}
	},
	{
		path: '/schematic-viewer',
		name: 'Schematic Viewer',
		component: SchematicViewer,
		meta: {
			page: 'schematic-viewer'
		}
	},
	{
		path: '/osm-exporter',
		name: 'OpenStreetMap Exporter',
		component: OSMExporter,
		meta: {
			page: 'osm-exporter'
		}
	},
	...customTerrainRouter,
]

const router = createRouter({
	history: process.env.IS_ELECTRON ? createWebHashHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL),
	routes
})

router.beforeEach((to, from, next) => {
	const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
	const nearestWithName = to.matched.slice().reverse().find(r => r.name)
	const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.title)
	let title = 'MC Studio'
	if (nearestWithTitle) {
		title = nearestWithTitle.meta.title
	}
	else if (nearestWithName) {
		title = nearestWithName.name
	}
	else if (previousNearestWithMeta) {
		title = previousNearestWithMeta.meta.title
	}
	store.commit('setTitle', title)

	ipcRenderer.invoke(EventList.setActivePage, to.path, to.meta.page)

	next()
})

export default router
