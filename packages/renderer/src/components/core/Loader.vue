<template>
	<div :class="['loader', inline ? 'inline-block' : 'block']">
		<div
			v-for="(item, i) in items" :key="i"
			:class="`loader-block bg-${color}`"
			:style="{
				'animation-delay': (i/items.length) + 's',
				left: item.x + 'em',
				top: item.y + 'em',
				width: size/pixels + 'em',
				height: size/pixels + 'em'
			}"
		/>
	</div>
</template>

<script>
export default {
	name: 'Loader',
	props: {
		inline: Boolean,
		color: {
			type: String,
			default: 'green-700',
		},
	},
	data() {
		const pixels = 7
		const size = 2
		return {
			pixels,
			size,
			items: [
				{ x: 3 /pixels*size, y: 0 /pixels*size },
				{ x: 4 /pixels*size, y: 0 /pixels*size },
				{ x: 5 /pixels*size, y: 1 /pixels*size },
				{ x: 6 /pixels*size, y: 2 /pixels*size },
				{ x: 6 /pixels*size, y: 3 /pixels*size },
				{ x: 6 /pixels*size, y: 4 /pixels*size },
				{ x: 5 /pixels*size, y: 5 /pixels*size },
				{ x: 4 /pixels*size, y: 6 /pixels*size },
				{ x: 3 /pixels*size, y: 6 /pixels*size },
				{ x: 2 /pixels*size, y: 6 /pixels*size },
				{ x: 1 /pixels*size, y: 5 /pixels*size },
				{ x: 1 /pixels*size, y: 5 /pixels*size },
				{ x: 0 /pixels*size, y: 4 /pixels*size },
				{ x: 0 /pixels*size, y: 3 /pixels*size },
				{ x: 0 /pixels*size, y: 2 /pixels*size },
				{ x: 1 /pixels*size, y: 1 /pixels*size },
				{ x: 2 /pixels*size, y: 0 /pixels*size },
			],
		}
	},
}
</script>

<style scoped>
.loader {
	align-items: center;
	position: relative;
	width: 2em;
	height: 2em;
	vertical-align: middle;
}
.loader-block {
	position: absolute;
	opacity: 0;
	animation: spin 1s ease-in infinite;
}
@keyframes spin {
	0% {
		opacity: 1;
	}
	75% {
		opacity: 0;
	}
	100% {
		opacity: 0;
	}
}
</style>
