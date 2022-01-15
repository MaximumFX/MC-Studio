<template>
	<ol class="breadcrumb m-0">
		<li
			v-for="(item, i) in path" :key="i"
			:class="[
				'breadcrumb-item',
				(i === path.length - 1 || !item.hasOwnProperty('to')) ? 'active' : '',
			]"
		>
			<a
				v-if="i !== path.length - 1 && item.hasOwnProperty('to')"
				@click="go(item.to)" :class="['text-decoration-none', i === 0 ? 'fw-bold':'']"
			>
				{{ item.name }}
			</a>
			<span v-else>{{ item.name }}</span>
		</li>
	</ol>
	<p v-show="!saved" class="mb-0 ms-2"><span class="badge bg-secondary">Edited</span></p>
</template>

<script>
import {ipcRenderer} from "electron";
import {EventList} from "@/js/events";
import {Question} from "@/js/electron/Dialogs";
import CustomTerrain from "@/js/CustomTerrain/CustomTerrain";

export default {
	name: "Breadcrumbs",
	props: {
		ct: CustomTerrain
	},
	methods: {
		async go(to) {
			if (this.saved) {
				this.$router.push(to)
			}
			else {
				console.warn('[Breadcumb] Go but isnt saved')
				const res = await ipcRenderer.invoke(EventList.dialog,
					new Question(
						'There are unsaved changes. Do you want to save your changes?',
						'Unsaved changes',
						['Save', 'Discard', 'Cancel'],
						2
					))
				if (res.response === 0) {
					this.$store.state.custom_terrain.ctFile.save()
				}
				if (res.response !== 2) {
					this.$store.commit('setSaved', true)
					this.$router.push(to)
				}
			}
		}
	},
	computed: {
		path() {
			let route = this.$route.matched.at(-1).path.replace('/custom-terrain/editor/', '').split('/')

			const par = this.$route.params
			const namespace = this.ct.getNamespace(par.namespace)
			route = route.map(r => {
				if (!r.includes(':')) return { name: r.replace(/-/g, '_') }
				if (r === ':cteId')
					return {
						name: this.ct.name,
						to: `/custom-terrain/editor/${this.ct.id}`
					}
				else if (r === ':namespace') {
					return {
						name: namespace.name,
						to: `/custom-terrain/editor/${this.ct.id}/${namespace.id}`
					}
				}
				else if (r === ':fileId') {
					const file = namespace.getFile(par.fileId)
					return {
						name: file.name,
						to: {name: 'CTE' + file.fileType, params:{cteId: this.ct.id, namespace: namespace.id, fileId: file.uuid}}
					}
				}
				return { name: r }
			})
			return route
		},
		saved() {
			return this.$store.state.saved
		},
	},
}
</script>

<style scoped>
.disabled:not(.active) {
	cursor: not-allowed;
}
.disabled a {
	pointer-events: none;
	opacity: .5;
}
</style>
