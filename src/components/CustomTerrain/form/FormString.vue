<template>
	<div class="row">
		<label class="col-auto col-form-label text-capitalize">{{ val.key.replace(/_/g, ' ') }}{{ val.validation.optional ? '' : '*'}}</label>
		<div class="col">
			<input type="text" class="form-control" :placeholder="val.key" :aria-label="val.key" :aria-describedby="val.key" :value="value">
		</div>
	</div>
</template>

<script>
import FormItem from "@/mixins/CustomTerrain/FormItem";

export default {
	name: "FormString",
	mixins: [FormItem],
}
</script>

<style scoped>
label {
	color: var(--syntax-string);
}
</style>
