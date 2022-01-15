<template>
	<nav class="container-fluid">
		<div class="row g-0 control-bar align-items-center justify-content-center h-100">
			<div class="col-auto">
				<p class="m-0">{{ $store.state.title }} <span v-if="dev">| {{ path }}</span></p>
			</div>
		</div>
	</nav>
</template>

<script>
export default {
	name: "ControlBar",
	computed: {
		path() {
			if (this.$route.matched.length === 0) return ''
			return this.$route.matched.at(-1).path
		},
		dev() {
			return process.env.NODE_ENV !== 'production'
		}
	}
}
</script>

<style scoped>
nav {
	grid-area: header;
	height: var(--title-bar-height);
	background-color: var(--secondary);
	-webkit-app-region: drag;
	overflow: hidden;
}

p {
	font-size: .8rem;
	font-weight: 700;
	color: var(--border);
}
</style>
