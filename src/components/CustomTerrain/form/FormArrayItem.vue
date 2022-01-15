<template>
	<div class="card">
		<div class="card-header">
			<div class="row g-3 align-items-center">
				<div class="col">
					<h6 v-if="child.length > 1" class="text-capitalize m-0">{{ val.validation.options.objectName.replace(/_/g, ' ') }}</h6>
					<component
						v-bind:is="type"
						v-bind="{ val: child[0] }"
						v-on="{
				'update:value': changeValue,
			}"
					/>
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
			<FormBuilder :form="child"/>
		</div>
	</div>
</template>

<script>
import Validation, {ValidationType} from "@/js/CustomTerrain/Validation.ts";
import {Collapse} from 'bootstrap'
import FormSection from "@/components/CustomTerrain/form/FormSection";
import FormString from "@/components/CustomTerrain/form/FormString";
import FormBoolean from "@/components/CustomTerrain/form/FormBoolean";
import FormInt from "@/components/CustomTerrain/form/FormInt";
import FormSelect from "@/components/CustomTerrain/form/FormSelect";
import FormFloat from "@/components/CustomTerrain/form/FormFloat";
import FormChoice from "@/components/CustomTerrain/form/FormChoice";
import FormChoiceValue from "@/components/CustomTerrain/form/FormChoiceValue";
import FormArray from "@/components/CustomTerrain/form/FormArray";
import FormEnum from "@/components/CustomTerrain/form/FormEnum";
import FormColor from "@/components/CustomTerrain/form/FormColor";
import FormDynamicSelect from "@/components/CustomTerrain/form/FormDynamicSelect";
import FormBuilder from "@/js/CustomTerrain/FormBuilder";

export default {
	name: "FormArrayItem",
	components: {
		FormDynamicSelect,
		FormColor, FormEnum, FormArray, FormChoice, FormChoiceValue, FormFloat, FormSelect, FormInt, FormBoolean, FormString, FormSection},
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
		},
		changeValue(value) {
			console.log('[FormArrayItem changeValue]', this.form.find(a => a.key === value.key), value)
		}
	},
	computed: {
		type() {
			return FormBuilder.getComponentName(this.child[0])
		},
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
