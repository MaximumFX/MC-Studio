<template>
	<div v-show="progress >= 0" class="progress-modal">
		<div class="container h-100">
			<div class="row align-items-center justify-content-center h-100">
				<div class="col-6">
					<div class="progress mb-2">
						<div class="progress-bar bg-success" role="progressbar" :style="{width: progress * 100 + '%'}"></div>
					</div>
					<h5 class="m-0">Loading...</h5>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "AppProgress",
	computed: {
		progress() {
			return this.$store.state.progress
		}
	}
}
</script>

<style scoped>
.progress-modal {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, .64);
	z-index: 2000;
}
</style>
