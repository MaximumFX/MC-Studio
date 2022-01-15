<template>
	<div class="position-relative">
		<div class="overlay d-flex align-items-center justify-content-center">
			<h3><i class="far fa-pencil"></i></h3>
		</div>
		<img v-if="base64" :src="`data:image/png;base64, ` + base64" :alt="alt" class="img-fluid" :width="width">
		<div v-else :style="{width: width + 'px'}">
			<MCIcon class="fs-1 mx-auto d-block"/>
		</div>
	</div>
</template>

<script>
import MCIcon from "@/components/MCIcon";
export default {
	name: "EditableImage",
	components: {MCIcon},
	props: {
		base64: String,
		alt: {
			type: String,
			default: ''
		},
		width: {
			type: String,
			default: ''
		},
	},
}
</script>

<style scoped>
.overlay {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	opacity: 0;
	z-index: 1;
	cursor: pointer;
}
.overlay::after {
	content: "";
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: var(--secondary);
	opacity: .4;
	z-index: -1;
}
.overlay:hover {
	opacity: 1;
}
</style>
