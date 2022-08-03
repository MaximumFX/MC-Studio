<template>
	<div v-show="progress.stage < 1" class="progress-modal">
		<div class="flex items-center justify-center h-full">
			<div class="w-1/2">
				<h5>{{ progress.status }} ({{ (progress.stage * 100).toFixed(1) }}%)</h5>
				<div v-if="progress.activeItem">
					<h6>{{ progress.activeStatus }} ({{ progress.activeItem }} / {{ progress.items }})</h6>
				</div>
				<progress-bar class="mb-3" :stage="progress.stage"/>
			</div>
		</div>
	</div>
</template>

<script>
// import { mapState } from 'pinia';
// import { useStore } from '@/store';

import ProgressBar from '@/components/core/ProgressBar';
export default {
	name: 'AppProgress',
	components: {ProgressBar},
	data() {
		return {
			progress: {
				status: '',
				stage: 1,
				items: 0,
				activeItem: 0,
				activeStatus: '',
			},
		}
	},
	computed: {
		// ...mapState(useStore, ['progress']),
	},
	mounted() {
		window.callback.progressUpdate((event, progress) => this.progress = progress)
	},
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
