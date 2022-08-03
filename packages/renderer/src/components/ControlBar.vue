<template>
	<nav :class="[hidden ? 'hide-bar absolute inset-x-0 top-0' : '', 'w-100 flex justify-center items-center']">
		<p v-show="!hidden">{{ title }} <span v-if="isDev">| {{ path }}</span></p>
	</nav>
</template>

<script>
import { mapState } from 'pinia'
import { useStore } from '@/store'

export default {
	name: 'ControlBar',
	computed: {
		...mapState(useStore, ['title', 'isDev']),
		path() {
			if (this.$route.matched.length === 0) return ''
			return this.$route.matched.at(-1).path
		},
		hidden() {
			return this.path === '/onboarding'
		},
	},
}
</script>

<style scoped>
nav {
	grid-area: header;
	height: var(--title-bar-height);
	background-color: var(--secondary);
	-webkit-app-region: drag;
	overflow: hidden;
	user-select: none;
	pointer-events: none;
}
.hide-bar {
	background-color: transparent;
}
p {
	font-size: .8rem;
	font-weight: 700;
	color: rgba(255, 255, 255, .58);
}
</style>
