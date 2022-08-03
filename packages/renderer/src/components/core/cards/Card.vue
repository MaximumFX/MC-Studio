<template>
	<div
		:class="['card flex flex-col break-words drop-shadow-md', color ? `card-${color}` : '']"
	>
		<slot/>
	</div>
</template>

<script>
export default {
	name: 'Card',
	props: {
		color: {
			type: String,
			default: '',
		},
	},
}
</script>

<style>
.card {
	--card-header: var(--foreground-lighter);
	background-color: var(--card-bg, var(--foreground));
}
.card-red {
	--card-bg: theme('colors.red.500');
	--card-header: theme('colors.red.600');
}
.card-gray {
	--card-bg: theme('colors.gray.600');
	--card-header: theme('colors.gray.700');
}
</style>
