import { ipcRenderer } from "electron"
import {createRouter, createWebHistory, createWebHashHistory} from "vue-router"
import {EventList} from "@/js/events";

import Home from "@/views/Home"
import SchematicViewer from "@/views/SchematicViewer"
import OSMExporter from "@/views/OSMExporter"
import CustomTerrain from "@/views/CustomTerrain"
import CustomTerrainEditor from "@/views/CustomTerrainEditor";
import CTEHome from "@/views/CustomTerrainEditor/Home";
import CTENamespace from "@/views/CustomTerrainEditor/Namespace";
import NBTExplorerHome from "@/views/NBTExplorerHome";
import NBTExplorer from "@/views/NBTExplorer"

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
		path: '/nbt-explorer',
		name: 'NBT Editor',
		component: NBTExplorerHome,
		meta: {
			page: 'nbt-explorer'
		}
	},
	{
		path: '/nbt-explorer/editor',
		name: 'NBT Explorer Editor',
		component: NBTExplorer,
		meta: {
			page: 'nbt-explorer',
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
	{
		path: '/custom-terrain',
		name: 'Worldgen',
		component: CustomTerrain,
		meta: {
			page: 'custom-terrain'
		}
	},
	{
		path: '/custom-terrain/editor/:cteId',
		name: 'Worldgen Editor',
		component: CustomTerrainEditor,
		meta: {
			page: 'custom-terrain'
		},
		children: [
			{ path: '', component: CTEHome },
			{ path: ':namespace', component: CTENamespace },
		]
	},
]

const router = createRouter({
	history: process.env.IS_ELECTRON ? createWebHashHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL),
	routes
})

router.beforeEach((to, from, next) => {
	const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
	const nearestWithName = to.matched.slice().reverse().find(r => r.name)
	const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.title)
	if (nearestWithTitle) {
		document.title = nearestWithTitle.meta.title
	}
	else if (nearestWithName) {
		document.title = nearestWithName.name + (nearestWithName.name === 'MC Studio' ? '' : ' - MC Studio')
	}
	else if (previousNearestWithMeta) {
		document.title = previousNearestWithMeta.meta.title
	}

	ipcRenderer.invoke(EventList.setActivePage, to.path, to.meta.page)

	next()
})

export default router
