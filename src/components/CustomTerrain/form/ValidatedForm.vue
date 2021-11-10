<template>
	<div v-if="structure == null">No options</div>
	<div v-else-if="form">
		<FormBuilderG :form="form.elements"/>
	</div>
	<div v-else>
		Loading...
		{{structure}}
	</div>
</template>

<script>
import Validation, {ValidationType} from "@/js/CustomTerrain/Validation.ts";
import FormBuilder from "@/components/CustomTerrain/form/FormBuilder";

export default {
	name: "ValidatedForm",
	components: {FormBuilder},
	props: {
		data: Object,
		structure: Object
	},
	data() {
		return {
			tsdata: undefined,
			form: undefined,

			vdt: ValidationType
		}
	},
	created() {
		if (this.data && this.tsdata === undefined)
			this.tsdata = this.data
		console.log('[ValidatedForm]', this.tsdata)
		this.build()
	},
	watch: {
		structure() {
			this.tsdata = this.data
			this.build()
		},
		data() {
			if (this.tsdata === undefined)
				this.tsdata = this.data
		},
		tsdata: {
			handler(val) {
				this.$emit('update:data', val)
			},
			deep: true
		}
	},
	methods: {
		build() {
			console.log('[ValidatedForm] Building...', this.structure, this.tsdata)
			let structure = this.structure

			if (structure) {
				if (structure instanceof Array) structure = {structure}

				this.form = {
					elements: Validation.getElements(structure, this.tsdata)
				}
				console.log('[ValidatedForm] Built', this.form)
			}
		},
	}
}
</script>

<style scoped>
</style>