<template>
	<div v-for="(elem, i) in form" :key="i" :class="{'mb-3': i < form.length-1}">
		<component
			v-bind:is="components[i]"
			v-bind="{ val: elem }"
			v-on="{
				'update:value': changeValue,
			}"
		/>
<!--		<FormSection v-if="elem.hasOwnProperty('elements')" :val="elem"/>-->
<!--		<FormString v-else-if="elem.validation.type === vdt.STRING" :val="elem"/>-->
<!--		<FormBoolean v-else-if="elem.validation.type === vdt.BOOLEAN" :val="elem"/>-->
<!--		<FormInt-->
<!--			v-else-if="elem.validation.type === vdt.INT" :val="elem"-->
<!--			v-on="{-->
<!--            'update:value': value => {-->
<!--              console.log(value)-->
<!--            },-->
<!--          }"-->
<!--		/>-->
<!--		<FormFloat v-else-if="elem.validation.type === vdt.FLOAT" :val="elem"/>-->
<!--		<FormSelect v-else-if="elem.validation.type === vdt.SELECT" :val="elem"/>-->
<!--		<FormDynamicSelect v-else-if="elem.validation.type === vdt.DYNAMIC_SELECT" :val="elem"/>-->
<!--		<FormEnum v-else-if="elem.validation.type === vdt.ENUM" :val="elem"/>-->
<!--		<FormColor v-else-if="elem.validation.type === vdt.COLOR" :val="elem"/>-->
<!--		<FormChoice v-else-if="elem.validation.type === vdt.CHOICE" :val="elem"/>-->
<!--		<div v-else-if="elem.validation.type === vdt.CHOICE_VALUE"></div>-->
<!--		<FormArray v-else-if="elem.validation.type === vdt.ARRAY" :val="elem"/>-->
<!--		<div class="card card-body" v-else>{{elem}}</div>-->
	</div>
</template>

<script>
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
	name: "FormBuilder",
	components: {
		FormDynamicSelect,
		FormColor, FormEnum, FormArray, FormChoice, FormChoiceValue, FormFloat, FormSelect, FormInt, FormBoolean, FormString, FormSection},
	props: {
		form: Array,
	},
	data() {
		return {
			// vdt: ValidationType
		}
	},
	computed: {
		components() {
			return this.form.map(elem => FormBuilder.getComponentName(elem))
		}
	},
	methods: {
		changeValue(value) {
			console.log('[FormBuilder changeValue]', this.form, {...value})
		}
	}
}
</script>

<style scoped>

</style>
