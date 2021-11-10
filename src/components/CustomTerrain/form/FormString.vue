<template>
	<div class="row">
		<label class="col-auto col-form-label text-capitalize">{{ val.key.replace(/_/g, ' ') }}{{ val.validation.optional ? '' : '*'}}</label>
		<div class="col">
			<input type="text" class="form-control" :placeholder="val.key" :aria-label="val.key" :aria-describedby="val.key" :value="val.value">
		</div>
	</div>
</template>

<script>
import Validation from "@/js/CustomTerrain/Validation.ts";

export default {
	name: "FormString",
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