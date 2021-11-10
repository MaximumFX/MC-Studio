import { reactive, computed } from 'vue'

const state = reactive({
	config: undefined,
	modals: {
		nbtChangeValue: undefined
	},
	nbtOpenFile: undefined,
})

export const setConfigManager = config => state.config = config
export const config = computed(() => state.config)

export const getModals = computed(() => state.modals)
export const getModalsVal = key => computed(() => state.modals[key])
export const setModals = newVal => state.modals = newVal
export const setModalsVal = (key, newVal) => state.modals[key] = newVal

export const getState = key => computed(() => state[key])
export const setState = (key, val) => state[key] = val
