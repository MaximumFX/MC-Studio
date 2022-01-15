<template>
	<main>
		<nav class="navbar navbar-dark bg-mcs-secondary">
			<div class="container-fluid">
			<span class="navbar-brand mb-0 fw-bold">
				<img src="@/assets/images/icon_16x16@2x.png" alt="" width="32" height="32" class="me-1">
				MC Studio
			</span>
			</div>
		</nav>
		<section class="container-fluid py-3">
			<div class="row g-3">
				<div
					v-for="(el, index) in items"
					:key="index"
					class="col-4"
				>
					<div class="card h-100 position-relative">
						<div
							class="card-thumbnail ratio ratio-16x9"
							:style="{'background-image': `url('${el.backgroundImage}')`}"
						></div>
						<div :class="['card-body', el.link ? '' : 'text-muted']">
							<h5 class="card-title">
								<router-link v-if="el.link" :to="el.link" class="stretched-link text-decoration-none text-white">
									{{ el.name }}
								</router-link>
								<span v-else>{{ el.name }}</span>
							</h5>
							<p class="m-0">{{ el.status }}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!--	<footer class="bg-mcs-secondary py-3">-->
		<!--		<div class="container-fluid">-->
		<!--			<div class="row">-->
		<!--				<div class="col">-->
		<!--					<p class="m-0">Made by MaximumFX</p>-->
		<!--				</div>-->
		<!--				<div class="col text-end">-->
		<!--					<p class="m-0">v0.0.1</p>-->
		<!--				</div>-->
		<!--			</div>-->
		<!--		</div>-->
		<!--	</footer>-->
	</main>
</template>

<script>
export default {
	name: "Home",
	data() {
		return {
			items: [
				{
					name: 'OpenStreetMap Exporter',
					backgroundImage: require('@/assets/images/osm.png'),
					link: '/osm-exporter',
					status: '70% Finished',
					enabled: true,
				},
				{
					name: 'NBT Editor',
					backgroundImage: require('@/assets/images/nbt-editor.png'),
					link: '/nbt-editor',
					status: '70% Finished',
					enabled: true,
				},
				{
					name: 'Schematic viewer',
					backgroundImage: require('@/assets/images/schematic.png'),//'https://ephtracy.github.io/image/snap2016-03-07-02-53-23.png',
					link: '/schematic-viewer',
					status: '40% Finished',
					enabled: isDevelopment,
				},
				{
					name: 'Worldgen',
					backgroundImage: 'https://external-preview.redd.it/hq0k-wDNgFKDTYqpNu_LyYMUADru8V_Ms7aLL3WeMJ4.jpg?auto=webp&s=b5f39df155e057432de3878710787b54f99f2d11',
					link: '/custom-terrain',
					status: '50% Finished'
				},
				{
					name: 'NBT Editor',//TODO NBT Explorer?
					backgroundImage: 'https://cmsminecraftshop.com/promo/NBTExplorer.png',
					link: '/nbt-explorer',
					status: '70% Finished'
				},
				{
					name: 'Schematic viewer',
					backgroundImage: 'https://ephtracy.github.io/image/snap2016-03-07-02-53-23.png',
					link: '/schematic-viewer',
					status: '40% Finished'
				},
				{
					name: 'OpenStreetMap Exporter',
					backgroundImage: 'https://miro.medium.com/max/1400/1*cX1Ve9_YQ2fQwjgA04yZ-g.png',
					link: '/osm-exporter',
					status: '50% Finished'
				},
			]
		}
	},
}
</script>

<style scoped>
.navbar .navbar-brand {
	line-height: 1;
}
</style>
