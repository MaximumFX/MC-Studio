<template>
	<div class="row">
		<label class="col-auto col-form-label text-capitalize">{{ val.key.replace(/_/g, ' ') }}{{ val.validation.optional ? '' : '*'}}</label>
		<div class="col">
			<input type="number" class="form-control" :placeholder="val.key" :aria-label="val.key" :aria-describedby="val.key" :value="value">
		</div>
	</div>
</template>

<script>
import Validation from "@/js/CustomTerrain/Validation.ts";

export default {
	name: "FormFloat",
	props: {
		val: {
			key: String,
			value: Number,
			validation: Validation
		}
	},
	computed: {
		value() {
			return this.val.value ?? 0
		}
	}
}
</script>

<style scoped>

</style>