<template>
	<div class="card card-primary">
		<div class="card-header">
			<div class="row g-3 align-items-center">
				<div class="col">
					<h6 class="text-capitalize m-0">{{ val.key.replace(/_/g, ' ') }}{{ val.validation.optional ? '' : '*'}}</h6>
				</div>
				<div class="col-auto">
					<button
						type="button" @click="toggle"
						class="btn btn-success btn-sm" title="Add item"
					><i class="far fa-plus" aria-hidden="true"></i> Add {{ val.validation.options.objectName }}</button>
				</div>
				<div class="col-auto">
					<button
						type="button" @click="toggle" :aria-expanded="!collapsed"
						class="btn btn-secondary btn-collapse btn-sm" title="Collapse"
					><i class="far fa-chevron-down" aria-hidden="true"></i></button>
				</div>
			</div>
		</div>
		<div class="card-body collapse" ref="collapse">
			<FormArrayItem v-for="(item, i) in items" :key="i" :val="item" :class="{'mb-3': i < items.length-1}"/>
		</div>
	</div>
</template>

<script>
import Validation, {ValidationType} from "@/js/CustomTerrain/Validation.ts";
import {Collapse} from 'bootstrap'
import FormArrayItem from "@/components/CustomTerrain/form/FormArrayItem";
export default {
	name: "FormArray",
	components: {FormArrayItem},
	props: {
		val: {
			key: String,
			value: Array,
			validation: Validation
		}
	},
	data() {
		return {
			vdt: ValidationType,

			collapse: undefined,
			collapsed: true,
		}
	},
	mounted() {
		this.collapse = new Collapse(this.$refs.collapse, {
			toggle: false
		})
	},
	computed: {
		items() {
			return this.val.value.map(a => ({
				value: a,
				validation: this.val.validation
			}))
		}
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