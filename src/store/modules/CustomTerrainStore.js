export default {
	namespaced: true,
	state: {
		customTerrain: null,
		namespace: null,
		ctFile: null,
	},
	mutations: {
		setCustomTerrain(state, ct) {
			state.customTerrain = ct
		},
		setNamespace(state, namespace) {
			state.namespace = namespace
		},
		setCTFile(state, ctFile) {
			state.ctFile = ctFile
		},
	}
}
