<template>
	<input
		class="
			shadow appearance-none border w-full py-2 px-3
			text-white leading-tight bg-transparent border-gray-400
			focus:outline-none focus:border-green-700 focus:ring focus:ring-green-800 focus:ring-opacity-50
			disabled:text-gray-400 disabled:bg-gray-800 disabled:border-gray-600
		"
		:value="modelValue" @input="updateValue"
	>
</template>

<script>
export default {
	name: 'FormControl',
	props: {
		modelValue: {
			type: String,
			default: '',
		},
	},
	emits: ['update:modelValue'],
	methods: {
		updateValue(event) {
			this.$emit('update:modelValue', event.target.value);
		},
	},
}
</script>

<style scoped>
</style>
