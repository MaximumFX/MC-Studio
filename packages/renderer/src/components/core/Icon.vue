<template>
	<i
		:class="`material-symbols-${iconStyle}`"
		:style="`font-variation-settings: 'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize};` + (emSizing ? 'font-size:1em;' : '')"
	>{{ icon }}</i>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue'
export enum IconStyle {
	outlined = 'outlined',
	rounded = 'rounded',
	sharp = 'sharp'
}

export default defineComponent({
	name: 'Icon',
	props: {
		iconStyle: {
			type: String as PropType<IconStyle>,
			default: IconStyle.sharp,
		},
		icon: {
			type: String,
			required: true,
		},
		emSizing: Boolean,

		weight: {
			type: Number,
			default: 400,
		},
		opticalSize: {
			type: Number,
			default: 48,
		},
		grade: {
			type: Number,
			default: 0,
		},
		fill: {
			type: Boolean,
			default: false,
		},
	},
})
</script>

<style scoped>
i {
	vertical-align: middle;
}
</style>
