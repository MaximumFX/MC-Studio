import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { useStore } from '@/store';

import Home from '@/views/Home.vue';
import Onboarding from '@/views/Onboarding.vue';
import Settings from '@/views/Settings.vue';
import WorldViewerHome from '@/views/WorldViewerHome.vue';
import WorldViewer from '@/views/WorldViewer.vue';
import MinecraftAssetsHome from '@/views/MinecraftAssetsHome.vue';
import MinecraftAssets from '@/views/MinecraftAssets.vue';
import SchematicViewerHome from '@/views/SchematicViewerHome.vue';
import SchematicViewer from '@/views/SchematicViewer.vue';
// import OSMExporter from '@/views/OSMExporter.vue'
// import NBTEditorHome from '@/views/NBTEditorHome.vue';
// import NBTEditor from '@/views/NBTEditor.vue'
// import customTerrainRouter from '@/router/custom-terrain.vue';
// import TitleGenerator from '../views/TitleGenerator.vue';
// import TitleGeneratorHome from '../views/TitleGeneratorHome.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'MC Studio',
		component: Home,
		meta: {
			page: 'home',
		},
	},
	{
		path: '/onboarding',
		name: 'Onboarding',
		component: Onboarding,
		meta: {
			page: 'onboarding',
		},
	},
	{
		path: '/settings',
		name: 'Settings',
		component: Settings,
		meta: {
			page: 'settings',
		},
	},
	{
		path: '/world-viewer',
		name: 'World Viewer Home',
		component: WorldViewerHome,
		meta: {
			page: 'world-viewer',
			name: 'World Viewer',
		},
	},
	{
		path: '/world-viewer/viewer',
		name: 'World Viewer',
		component: WorldViewer,
		meta: {
			page: 'world-viewer',
			name: 'World Viewer',
		},
	},
	{
		path: '/mc-assets',
		name: 'Minecraft Assets Home',
		component: MinecraftAssetsHome,
		meta: {
			page: 'mc-assets',
			name: 'Minecraft Assets',
		},
	},
	{
		path: '/mc-assets/version',
		name: 'Minecraft Assets',
		component: MinecraftAssets,
		meta: {
			page: 'mc-assets',
			name: 'Minecraft Assets',
		},
	},
	{
		path: '/schematic-viewer',
		name: 'Schematic Viewer Home',
		component: SchematicViewerHome,
		meta: {
			page: 'schematic-viewer',
			name: 'Schematic Viewer',
		},
	},
	{
		path: '/schematic-viewer/viewer',
		name: 'Schematic Viewer',
		component: SchematicViewer,
		meta: {
			page: 'schematic-viewer',
			name: 'Schematic Viewer',
		},
	},
	// {
	// 	path: '/nbt-editor',
	// 	name: 'NBT Editor Home',
	// 	component: NBTEditorHome,
	// 	meta: {
	// 		page: 'nbt-editor',
	// 		name: 'NBT Editor'
	// 	}
	// },
	// {
	// 	path: '/nbt-editor/editor',
	// 	name: 'NBT Editor',
	// 	component: NBTEditor,
	// 	meta: {
	// 		page: 'nbt-editor',
	// 		name: 'NBT Editor'
	// 	}
	// },
	// {
	// 	path: '/title-generator',
	// 	name: 'Title Generator Home',
	// 	component: TitleGeneratorHome,
	// 	meta: {
	// 		page: 'title-generator',
	// 		name: 'Title Generator'
	// 	}
	// },
	// {
	// 	path: '/title-generator/edit',
	// 	name: 'Title Generator',
	// 	component: TitleGenerator,
	// 	meta: {
	// 		page: 'title-generator',
	// 		name: 'Title Generator'
	// 	}
	// },
	// {
	// 	path: '/osm-exporter',
	// 	name: 'OpenStreetMap Exporter',
	// 	component: OSMExporter,
	// 	meta: {
	// 		page: 'osm-exporter'
	// 	}
	// },
	// ...customTerrainRouter,
]

const router = createRouter({
	history: window.vars.IS_DEV ? createWebHashHistory(window.vars.BASE_URL) : createWebHistory(window.vars.BASE_URL),
	routes,
})

router.beforeEach(async (to, from, next) => {
	const store = useStore()

	if (!store.saved) {
		if (!window.confirm('There are unsaved changes. Are you sure you want to leave?')) return next(false)

		store.setSaved(true)
	}

	const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)
	const nearestWithName = to.matched.slice().reverse().find(r => r.name)
	const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.title)
	let title = 'MC Studio'
	if (nearestWithTitle) {
		title = nearestWithTitle.meta.title as string
	}
	else if (nearestWithName) {
		title = nearestWithName.name as string
	}
	else if (previousNearestWithMeta) {
		title = previousNearestWithMeta.meta.title as string
	}
	store.setTitle(title)

	window.api.setActivePage(to)

	next()
})

export default router
