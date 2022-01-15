<template>
	<div class="form-check">
		<input class="form-check-input" type="checkbox" v-model="value" :id="val.key">
		<label class="form-check-label text-capitalize" :for="val.key">
			{{ val.key.replace(/_/g, ' ') }}{{ val.validation.optional ? '' : '*' }}
		</label>
	</div>
</template>

<script>
import FormItem from "@/mixins/CustomTerrain/FormItem";

export default {
	name: "FormBoolean",
	mixins: [FormItem],
}
</script>

<style scoped>

</style>
