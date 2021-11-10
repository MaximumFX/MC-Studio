<template>
	<div class="card">
		<div class="card-header">
			<div class="row align-items-center">
				<div class="col">
					<h6 class="text-capitalize m-0">{{ val.key.replace(/_/g, ' ') }}</h6>
				</div>
				<div class="col-auto">
					<button
						type="button" @click="toggle" :aria-expanded="!collapsed"
						class="btn btn-secondary btn-collapse btn-sm" title="Collapse"
					><i class="far fa-chevron-down" aria-hidden="true"></i></button>
				</div>
			</div>
		</div>
		<div class="card-body collapse show" ref="collapse">
			<FormBuilderG :form="val.elements"/>
		</div>
	</div>
</template>

<script>
import {ValidationType} from "@/js/CustomTerrain/Validation.ts";
import {Collapse} from 'bootstrap'

export default {
	name: "FormSection",
	props: {
		val: Object
	},
	data() {
		return {
			vdt: ValidationType,

			collapse: undefined,
			collapsed: false
		}
	},
	mounted() {
		this.collapse = new Collapse(this.$refs.collapse, {
			toggle: false
		})
	},
	methods: {
		toggle() {
			this.collapse.toggle()
			this.collapsed = !this.collapsed
		}
	}
}
</script>

<style scoped>
</style>