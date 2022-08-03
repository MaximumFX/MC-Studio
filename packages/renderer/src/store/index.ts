import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
	state: () => ({
		title: 'MC Studio',
		saved: true,
		progress: -1,
		isDev: window.vars.IS_DEV,
	}),
	actions: {
		setTitle(title = '') {
			this.title = title.length && title !== 'MC Studio' ? title + ' - MC Studio' : 'MC Studio'
		},
		setSaved(saved = false) {
			this.saved = saved
			window.api.setSaved(saved)
		},
		setProgressBar(stage = -1) {
			this.progress = stage
			window.api.setProgressBar(stage)
		},
	},
})

interface CustomTerrainState {
	customTerrain: null | never
	namespace: null | string
	ctFile: null | File
}
export const customTerrainStore = defineStore('custom_terrain', {
	state: (): CustomTerrainState => ({
		customTerrain: null,
		namespace: null,
		ctFile: null,
	}),
	actions: {
		setCustomTerrain(ct: never) {
			this.customTerrain = ct
		},
		setNamespace(namespace: string) {
			this.namespace = namespace
		},
		setCTFile(ctFile: File) {
			this.ctFile = ctFile
		},
	},
})
