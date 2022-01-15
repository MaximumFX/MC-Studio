<template>
	<div class="row">
		<label class="col-auto col-form-label text-capitalize">{{ name }}{{ val.validation.optional ? '' : '*'}}</label>
		<div class="col">
			<select class="form-select" :aria-label="val.key" v-model="value">
				<option v-for="opt in val.validation.getChoices()" :key="opt.key" :value="opt.key">{{ formatName(opt.value) }}</option>
			</select>
		</div>
	</div>
</template>

<script>
import capitalize from "capitalize";
import FormItem from "@/mixins/CustomTerrain/FormItem";

export default {
	name: "FormEnum",
	mixins: [FormItem],
	methods: {
		formatName(value) {
			if (value.includes(':')) return value
			return capitalize.words(value.replace(/_/g, ' '))
		}
	}
}
</script>

<style scoped>
label {
	color: var(--syntax-enum);
}
</style>
