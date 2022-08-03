<template>
	<button
		:disabled="disabled"
		:class="`
		block px-4 py-2 transition duration-100 ease-in-out
		text-${values.text} bg-${color}-${values.base} border border-transparent shadow
		hover:bg-${color}-${values.hover}
		focus:border-${color}-${values.base} focus:ring-2 focus:ring-${color}-${values.base} focus:outline-none focus:ring-opacity-50
		disabled:text-white/50 disabled:bg-${color}-${values.base} disabled:bg-opacity-30`"
	>
		<slot/>
	</button>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
export enum Color {
	green = 'green',
	yellow = 'yellow',
}

export default defineComponent({
	name: 'TButton',
	props: {
		color: {
			type: String as PropType<Color>,
			default: Color.green,
		},
		disabled: Boolean,
	},
	computed: {
		values() {
			if (this.color === Color.yellow)
				return { base: 400, hover: 500, text: 'black' }
			return { base: 700, hover: 800, text: 'white' }
		},
	},
})
</script>

<style scoped>

</style>
