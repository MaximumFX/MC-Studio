<template>
	<div v-if="structure == null">No options</div>
	<div v-else-if="form">
		<FormBuilder :form="form.elements"/>
	</div>
	<div v-else>
		<Loader class="mx-auto"/>
		{{structure}}
	</div>
</template>

<script>
import Validation, {ValidationType} from "@/js/CustomTerrain/Validation.ts";
import FormBuilder from "@/components/CustomTerrain/form/FormBuilder";
import Loader from "@/components/Loader";

export default {
	name: "ValidatedForm",
	components: {Loader, FormBuilder},
	props: {
		data: Object,
		structure: Object
	},
	data() {
		return {
			tsdata: undefined,
			form: undefined,

			isBuilt: false,
			vdt: ValidationType
		}
	},
	created() {
		this.isBuilt = false
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
		// tsdata: {
		// 	handler(val) {
		// 		this.$emit('update:data', val)
		// 	},
		// 	deep: true
		// },
		form: {
			handler(value) {
				if (this.isBuilt) {
					const data = {}
					value.elements.forEach(e => data[e.key] = e.value)
					this.$emit('update:data', data)
					console.log('[Validatedform form]', data)
				}
			},
			deep: true
		},
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
				this.isBuilt = true
			}
		},
	}
}
</script>

<style scoped>
</style>
