<template>
	<div class="row">
		<label class="col-auto col-form-label text-capitalize">{{ name }}{{ val.validation.optional ? '' : '*'}}</label>
		<div class="col">
			<input
				type="number" class="form-control" :placeholder="val.key"
				:value="value" :min="val.validation.options.minSize" :max="val.validation.options.maxSize"
				step="0.1"
			>
		</div>
	</div>
</template>

<script>
import FormItem from "@/mixins/CustomTerrain/FormItem";

export default {
	name: "FormFloat",
	mixins: [FormItem],
}
</script>

<style scoped>
label {
	color: var(--syntax-float);
}
</style>
