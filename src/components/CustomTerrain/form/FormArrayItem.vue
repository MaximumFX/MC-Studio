<template>
	<div class="card card-warning">
		<div class="card-header">
			<div class="row g-3 align-items-center">
				<div class="col">
					<h6 v-if="child.length > 1" class="text-capitalize m-0">{{ val.validation.options.objectName.replace(/_/g, ' ') }}</h6>
					<FormString v-else-if="child[0].validation.type === vdt.STRING" :val="child[0]"/>
					<FormBoolean v-else-if="child[0].validation.type === vdt.BOOLEAN" :val="child[0]"/>
					<FormInt v-else-if="child[0].validation.type === vdt.INT" :val="child[0]"/>
					<FormFloat v-else-if="child[0].validation.type === vdt.FLOAT" :val="child[0]"/>
					<FormSelect v-else-if="child[0].validation.type === vdt.SELECT" :val="child[0]"/>
				</div>

				<div class="col-auto">
					<button
						type="button"
						class="btn btn-danger btn-sm" :title="`Remove ` + val.validation.options.objectName.replace(/_/g, ' ')"
					><i class="far fa-plus" aria-hidden="true"></i></button>
				</div>
				<div class="col-auto" v-if="child.length > 1">
					<button
						type="button" @click="toggle" :aria-expanded="!collapsed"
						class="btn btn-secondary btn-collapse btn-sm" title="Collapse"
					><i class="far fa-chevron-down" aria-hidden="true"></i></button>
				</div>
			</div>
		</div>
		<div class="card-body collapse" v-if="child.length > 1" ref="collapse">
			<FormBuilderG :form="child"/>
		</div>
	</div>
</template>

<script>
import Validation, {ValidationType} from "@/js/CustomTerrain/Validation.ts";
import {Collapse} from 'bootstrap'
import FormString from "@/components/CustomTerrain/form/FormString";
import FormBoolean from "@/components/CustomTerrain/form/FormBoolean";
import FormInt from "@/components/CustomTerrain/form/FormInt";
import FormFloat from "@/components/CustomTerrain/form/FormFloat";
import FormSelect from "@/components/CustomTerrain/form/FormSelect";

export default {
	name: "FormArrayItem",
	components: {FormSelect, FormFloat, FormInt, FormBoolean, FormString},
	props: {
		val: {
			// key: String,//todo key toevoegen
			value: Object,
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
		if (this.child.length > 1)
			this.collapse = new Collapse(this.$refs.collapse, {
				toggle: false
			})
	},
	methods: {
		toggle() {
			this.collapse.toggle()
			this.collapsed = !this.collapsed
		}
	},
	computed: {
		child() {
			const tmp = {
				obj: this.val.validation.options.arrayObject,
				val: this.val.value
			}
			if (!(tmp.obj instanceof Validation)) {
				return Validation.getElements(tmp.obj, tmp.val)
			}
			return [{
				key: this.val.validation.options.objectName,
				value: tmp.val,
				validation: tmp.obj
			}]
		}
	}
}
</script>

<style scoped>
</style>