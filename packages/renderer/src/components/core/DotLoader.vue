<template>
	<span>{{ dots }}</span>
</template>

<script>
export default {
	name: 'DotLoader',
	data() {
		return {
			dots: '...',
			interval: setInterval(() => {
				if (this.dots.length === 3) this.dots = '.'
				else this.dots += '.'
			}, 400),
		}
	},
	deactivated() {
		clearInterval(this.interval)
	},
};
</script>

<style scoped>

</style>
