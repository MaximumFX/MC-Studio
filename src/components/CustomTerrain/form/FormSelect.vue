<template>
	<div class="row">
		<label class="col-auto col-form-label text-capitalize">{{ val.key.replace(/_/g, ' ') }}{{ val.validation.optional ? '' : '*'}}</label>
		<div class="col">
			<select class="form-select" :aria-label="val.key">
				<option v-for="opt in val.validation.getChoices()" :key="opt" :value="opt" :selected="opt === val.value">{{ opt }}</option>
			</select>
		</div>
	</div>
</template>

<script>
import Validation from "@/js/CustomTerrain/Validation.ts";

export default {
	name: "FormSelect",
	props: {
		val: {
			key: String,
			value: String,
			validation: Validation
		}
	}
}
</script>

<style scoped>

</style>
