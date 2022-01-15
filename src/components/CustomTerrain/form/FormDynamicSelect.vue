<template>
	<div class="row">
		<label class="col-auto col-form-label text-capitalize">{{ name }}{{ val.validation.optional ? '' : '*'}}</label>
		<div class="col">
			<select class="form-select" :aria-label="val.key" v-model="value">
				<optgroup v-for="ns in choices" :key="ns.id" :label="ns.name">
					<option v-for="type in ns.items" :key="`${ns.name}:${type.name}`" :value="`${ns.name}:${type.name}`">{{ ns.name }}:{{ type.name }}</option>
				</optgroup>
			</select>
		</div>
	</div>
</template>

<script>
import FormItem from "@/mixins/CustomTerrain/FormItem";

export default {
	name: "FormDynamicSelect",
	mixins: [FormItem],
	data() {
		return {
			choices: []
		}
	},
	created() {
		this.choices = this.val.validation.getChoices(this.$store.state.custom_terrain.customTerrain)
	}
}
</script>

<style scoped>

</style>
