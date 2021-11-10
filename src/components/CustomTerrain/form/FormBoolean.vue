<template>
	<div class="form-check">
		<input class="form-check-input" type="checkbox" :value="val.value" :id="val.key">
		<label class="form-check-label text-capitalize" :for="val.key">
			{{ val.key.replace(/_/g, ' ') }}{{ val.validation.optional ? '' : '*' }}
		</label>
	</div>
</template>

<script>
import Validation from "@/js/CustomTerrain/Validation.ts";

export default {
	name: "FormBoolean",
	props: {
		val: {
			key: String,
			value: Boolean,
			validation: Validation
		}
	}
}
</script>

<style scoped>

</style>