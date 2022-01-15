<template>
	<div class="row align-items-center">
		<label class="col-auto col-form-label text-capitalize">{{ name }}{{ val.validation.optional ? '' : '*'}}</label>
		<div :class="[range ? 'col-auto' : 'col']">
			<input
				type="number" class="form-control" :placeholder="val.key" :aria-label="val.key" :aria-describedby="val.key"
				v-model="value"
				:min="val.validation.options.minSize" :max="val.validation.options.maxSize"
				:step="val.validation.options.multipleOf"
			>
		</div>
		<div v-if="range" class="col">
			<input
				v-model="value" type="range" class="form-range"
				:min="val.validation.options.minSize" :max="val.validation.options.maxSize"
				:step="val.validation.options.multipleOf"
			>
		</div>
	</div>
</template>

<script>

import FormItem from "@/mixins/CustomTerrain/FormItem";

export default {
	name: "FormInt",
	mixins: [FormItem],
	computed: {
		range() {
			return this.val.validation.options.minSize !== undefined && this.val.validation.options.maxSize !== undefined
		}
	}
}
</script>

<style scoped>
label {
	color: var(--syntax-int);
}
</style>
