<template>
	<div v-for="(elem, i) in form" :key="i" :class="{'mb-3': i < form.length-1}">
		<FormSection v-if="elem.hasOwnProperty('elements')" :val="elem"/>
		<FormString v-else-if="elem.validation.type === vdt.STRING" :val="elem"/>
		<FormBoolean v-else-if="elem.validation.type === vdt.BOOLEAN" :val="elem"/>
		<FormInt v-else-if="elem.validation.type === vdt.INT" :val="elem" @change-value="changeValue"/>
		<FormFloat v-else-if="elem.validation.type === vdt.FLOAT" :val="elem"/>
		<FormSelect v-else-if="elem.validation.type === vdt.SELECT" :val="elem"/>
		<FormChoice v-else-if="elem.validation.type === vdt.CHOICE" :val="elem"/>
		<div v-else-if="elem.validation.type === vdt.CHOICE_VALUE"></div>
		<FormArray v-else-if="elem.validation.type === vdt.ARRAY" :val="elem"/>
		<div class="card card-body" v-else>{{elem}}</div>
	</div>
</template>

<script>
import {ValidationType} from "@/js/CustomTerrain/Validation.ts";
import FormSection from "@/components/CustomTerrain/form/FormSection";
import FormString from "@/components/CustomTerrain/form/FormString";
import FormBoolean from "@/components/CustomTerrain/form/FormBoolean";
import FormInt from "@/components/CustomTerrain/form/FormInt";
import FormSelect from "@/components/CustomTerrain/form/FormSelect";
import FormFloat from "@/components/CustomTerrain/form/FormFloat";
import FormChoice from "@/components/CustomTerrain/form/FormChoice";
import FormArray from "@/components/CustomTerrain/form/FormArray";

export default {
	name: "FormBuilder",
	components: {FormArray, FormChoice, FormFloat, FormSelect, FormInt, FormBoolean, FormString, FormSection},
	props: {
		form: Array,
	},
	data() {
		return {
			vdt: ValidationType
		}
	},
	methods: {
		changeValue(value) {
			console.log('ello', this.form.find(a => a.key === value.key), value)
		}
	}
}
</script>

<style scoped>

</style>