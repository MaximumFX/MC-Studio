<template>
	<div class="row">
		<label class="col-auto col-form-label text-capitalize">{{ val.key.replace(/_/g, ' ') }}{{ val.validation.optional ? '' : '*'}}</label>
		<div class="col">
			<input
				@change="change" ref="input"
				type="number" class="form-control"
				:placeholder="val.key" :aria-label="val.key" :aria-describedby="val.key" :value="val.value"
				:min="val.validation.options.minSize" :max="val.validation.options.maxSize"
			>
		</div>
	</div>
</template>

<script>
import Validation from "@/js/CustomTerrain/Validation.ts";

export default {
	name: "FormInt",
	props: {
		val: {
			key: String,
			value: Number,
			validation: Validation
		}
	},
	methods: {
		change(e) {
			const returnVal = this.val
			const value = parseInt(e.target.value)
			returnVal.validation.value = value
			if (returnVal.validation.check()) {
				returnVal.value = value
				this.$emit('changeValue', returnVal)
			}
			else {
				console.error('[FormInt] Value failed validation:', e.target.value)
				this.$refs.input.value = returnVal.value.toString()
				e.preventDefault()
			}
		}
	}
}
</script>

<style scoped>

</style>