<template>
	<main>
		<section class="grid grid-cols-2 select-none">
			<div class="bg-gray-800 image">
				<p class="absolute bottom-4 left-4 opacity-60">v{{ version }}</p>
			</div>
			<div class="p-8 flex flex-col justify-between">
				<div class="my-auto">
					<transition
						name="fade"
						mode="out-in"
						:duration="500"
					>
						<div v-if="page === 1">
							<h4 class="font-normal">Welcome to</h4>
							<h2 class="mb-6 leading-none">
								<img src="@asset/images/icon_16x16@2x.png" alt="" width="32" height="32" class="inline-block mr-1">
								MC Studio
							</h2>
							<p>Before you can get started, there are a few things that need to be setup first.</p>
						</div>

						<div v-else-if="page === 2">
							<h2>Minecraft Directory</h2>
							<p class="mb-6">To make use of all the features, we need some resources from Minecraft. <i>Note: this may take a few seconds.</i></p>
							<div class="flex mb-6">
								<form-control v-model="mcDir" placeholder="Minecraft Directory"/>
								<t-button class="flex !p-2" @click="selectMCDir"><icon icon="folder"/></t-button>
							</div>

							<t-button class="inline" :disabled="!mcDir.length || mcResourcesStatus === 'loading' || mcResourcesStatus === 'found'" @click="findResources">
								{{ mcResourcesStatus === 'found' ? 'Found' : 'Get resources' }}
							</t-button>
							<loader v-if="mcResourcesStatus === 'loading'" inline color="white" class="ml-2 text-xs"/>

							<p class="text-gray-300 mt-2"><small>MC Studio requires 1.19 to be installed</small></p>

							<card v-if="mcResourcesError" color="red" class="mt-3">
								<card-body>
									{{ mcResourcesError }}
								</card-body>
							</card>
						</div>

<!--						<div v-else-if="page === 3">-->
<!--							<h2>MC Studio Directory</h2>-->
<!--							<p>Before you can get started, there are a few things that need to be setup first</p>-->
<!--						</div>-->

						<div v-else-if="page === 3">
							<h2><icon icon="beenhere" fill em-sizing class="text-green-500"/> Ready to start</h2>
							<p>We're all set up. Click the Finish button to get started.</p>
						</div>
					</transition>
				</div>
				<div class="flex justify-between items-center">
					<t-button :disabled="page === 1" :class="page > 1 ? '' : '!opacity-0'" @click="previous">Back</t-button>
					<div class="text-center flex-grow">
						<p>{{ page }}/{{ pageCount }}</p>
					</div>
					<t-button :disabled="!canNext" class="ml-auto" @click="next">{{ page === pageCount ? 'Finish' : 'Next' }}</t-button>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
import TButton from '@/components/core/TButton';
import FormControl from '@/components/core/forms/FormControl';
import Icon from '@/components/core/Icon';
import Card from '@/components/core/cards/Card';
import CardBody from '@/components/core/cards/CardBody';
import Loader from '@/components/core/Loader';

export default {
	name: 'Onboarding',
	components: {Loader, CardBody, Card, Icon, FormControl, TButton},
	data() {
		return {
			page: 1,
			pageCount: 3,
			canNext: true,

			mcDir: window.api.info.getMinecraftPath(),
			version: window.api.info.getAppVersion(),
			mcResourcesStatus: 'start',
			mcResourcesError: null,
		}
	},
	watch: {
		mcDir() {
			this.mcResourcesStatus = 'start'
		},
	},
	methods: {
		async next() {
			if (this.page < this.pageCount) {
				this.canNext = false
				this.page++

				// Clear errors
				this.mcResourcesError = null

				// Check if can go to next page
				if (this.page !== 2 || this.mcResourcesStatus === 'found')
					this.canNext = true
			}
			else if (this.page === this.pageCount) {
				await window.api.onboarding.setFinishedOnboarding(true)
				await this.$router.push('/')
			}
		},
		previous() {
			if (this.page > 0) {
				this.page--
				this.canNext = true
			}
		},

		async selectMCDir() {
			try {
				this.mcDir = await window.api.files.openFolder('Select path', this.mcDir)
			} catch (e) {
				console.warn(e)
			}
		},
		async findResources() {
			this.mcResourcesStatus = 'loading'
			try {
				await window.api.onboarding.getMinecraftResources(this.mcDir)

				await window.api.onboarding.buildData()

				this.mcResourcesStatus = 'found'
				this.canNext = true


			} catch (e) {
				console.error(e)
				this.mcResourcesStatus = 'error'
				this.mcResourcesError = 'There was no installed version of 1.19 found at this location. Please check if the location is correct and 1.19 is installed and try again.'
			}
		},
	},
}
</script>

<style scoped>
main {
	height: 100vh;
}
.image {
	background: no-repeat center url("@asset/images/onboarding.png");
	background-size: cover;
}

.fade-enter-active > * {
	animation: fadeIn 200ms;
}
.fade-leave-active > * {
	animation: fadeOut 200ms;
}
.fade-enter-active > *,
.fade-leave-active > * {
	animation-fill-mode: both;
	animation-timing-function: cubic-bezier(0.6, 0.15, 0.35, 0.8);
}
.fade-enter-active > *,
.fade-leave-active > *{
	animation-delay: 200ms;
}
.fade-enter-active > *:nth-child(1),
.fade-leave-active > *:nth-child(1){
	animation-delay: 0ms;
}
.fade-enter-active > *:nth-child(2),
.fade-leave-active > *:nth-child(2){
	animation-delay: 100ms;
}

@keyframes fadeIn {
	0% {
		opacity: 0;
		transform: translateY(40px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
@keyframes fadeOut {
	0% {
		opacity: 1;
		transform: translateY(0);
	}
	100% {
		opacity: 0;
		transform: translateY(-40px);
	}
}
</style>
