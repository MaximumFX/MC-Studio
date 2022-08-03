<template>
	<div class="w-full bg-gray-200 h-2.5 dark:bg-gray-700">
		<div class="bg-green-600 h-2.5" role="progressbar" :style="{width: stage * 100 + '%'}"/>
	</div>
</template>

<script>
export default {
	name: 'ProgressBar',
	props: {
		stage: {
			default: 0,
			type: Number,
		},
	},
}
</script>

<style scoped>

</style>
