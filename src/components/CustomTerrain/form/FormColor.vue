<template>
	<div class="row">
		<label class="col col-form-label text-capitalize">
			{{ name }}{{ val.validation.optional ? '' : '*' }}
		</label>
		<div class="col-auto">
			<input type="color" class="form-control form-control-color" :value="value.getHex()" :title="val.key.replace(/_/g, ' ')">
		</div>
		<div class="col">
			<div class="input-group mb-3">
				<span class="input-group-text">#</span>
				<input type="text" class="form-control" placeholder="000000" v-model="value.hex">
			</div>
		</div>
		<div class="col">
			<input type="number" class="form-control" placeholder="0" v-model="value.decimal">
		</div>
	</div>
</template>

<script>
import FormItem from "@/mixins/CustomTerrain/FormItem";

export default {
	name: "FormColor",
	mixins: [FormItem],
}
</script>

<style scoped>
</style>
