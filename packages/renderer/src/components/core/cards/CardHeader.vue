<template>
	<div class="flex-auto p-4">
		<slot/>
	</div>
</template>

<script>
export default {
	name: 'CardHeader',
}
</script>

<style scoped>
div {
	background-color: var(--card-header);
}
</style>
