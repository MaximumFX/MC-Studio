import {createStore} from "vuex";
import CustomTerrainStore from "@/store/modules/CustomTerrainStore";
import {ipcRenderer} from "electron";
import {EventList} from "@/js/events";

export default createStore({
	modules: {
		custom_terrain: CustomTerrainStore
	},
	state: {
		title: 'MC Studio',
		saved: true,
		progress: -1,
	},
	mutations: {
		setTitle(state, title = '') {
			state.title = title.length && title !== 'MC Studio' ? title + ' - MC Studio' : 'MC Studio'
		},
		setSaved(state, saved = false) {
			state.saved = saved
			ipcRenderer.invoke(EventList.setSaved, saved)
		},
		setProgressBar(state, stage = -1) {
			state.progress = stage
			ipcRenderer.invoke(EventList.setProgressBar, stage)
		},
	}
})
