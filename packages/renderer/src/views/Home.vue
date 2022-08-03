<template>
	<main class="no-select">
		<navbar>
			<h5 class="m-0">
				<img src="@asset/images/icon_16x16@2x.png" alt="" width="32" height="32" class="inline-block mr-1">
				MC Studio
			</h5>
			<router-link to="/settings" class="ml-auto">
				<icon icon="settings" fill/>
			</router-link>
		</navbar>
		<section class="p-4">
			<div class="grid grid-cols-3 xl:grid-cols-4 gap-4">
				<div
					v-for="(el, index) in items"
					:key="index"
					class="col-4"
				>
					<card class="h-full relative">
						<div
							class="card-thumbnail aspect-video"
							:style="{'background-image': `url('${el.backgroundImage}')`}"
						/>
						<card-body :class="[el.link && el.enabled ? '' : 'text-muted']">
							<h5 class="card-title">
								<router-link v-if="el.link && el.enabled" :to="el.link" class="stretched-link text-decoration-none text-white">
									{{ el.name }}
								</router-link>
								<span v-else>{{ el.name }}</span>
							</h5>
							<p class="mb-0 mt-2">{{ el.status }}</p>
						</card-body>
					</card>
				</div>
			</div>
			<hr>
			<h3 class="mb-4">Upcoming</h3>
			<div class="grid grid-cols-3 xl:grid-cols-4 gap-4">
				<div
					v-for="(el, index) in upcoming"
					:key="index"
					class="col-4"
				>
					<card color="gray" class="h-full relative">
						<card-body>
							<h5 class="card-title mb-0">
								{{ el.name }}
							</h5>
						</card-body>
					</card>
				</div>
			</div>
		</section>
<!--		<footer class="flex bg-mcs-secondary px-4 py-3">-->
<!--			<p>Made by MaximumFX</p>-->
<!--			<p class="ml-auto">v0.0.1</p>-->
<!--		</footer>-->
	</main>
</template>

<script>
import Card from '@/components/core/cards/Card';
import CardBody from '@/components/core/cards/CardBody';
import Icon from '@/components/core/Icon';
import Navbar from '@/components/core/Navbar';

export default {
	name: 'Home',
	components: {Navbar, Icon, CardBody, Card},
	data() {
		return {
			items: [
				{
					name: 'World Viewer',
					backgroundImage: this.$image('@/images/worldviewer.png'),
					link: '/world-viewer',
					status: '75% Finished',
					enabled: true,
				},
				{
					name: 'Minecraft Assets',
					backgroundImage: this.$image('@/images/mc-assets.png'),
					link: '/mc-assets',
					status: '75% Finished',
					enabled: true,
				},
				{
					name: 'Schematic Viewer',
					backgroundImage: this.$image('@/images/schematic.png'),//'https://ephtracy.github.io/image/snap2016-03-07-02-53-23.png',
					link: '/schematic-viewer',
					status: '70% Finished',
					enabled: true,
				},
			],
			upcoming: [
				{
					name: 'OpenStreetMap Exporter',
					backgroundImage: this.$image('@/images/osm.png'),
					link: '/osm-exporter',
					status: '70% Finished',
					enabled: true,
				},
				{
					name: 'NBT Editor',
					backgroundImage: this.$image('@/images/nbt-editor.png'),
					link: '/nbt-editor',
					status: '70% Finished',
					enabled: true,
				},
				{
					name: 'Superflat Generator',
					backgroundImage: this.$image('@/images/osm.png'),
					link: '/superflat-generator',
					status: '',
					enabled: true,
				},
				{
					name: 'Title Generator',
					backgroundImage: 'https://cdn.discordapp.com/attachments/563986314207297537/584004038425706496/MC_Letters.png',
					link: '/title-generator',
					status: '0% Finished',
					enabled: true,
				},
				{
					name: 'Unicode Painter',
				},
				{
					name: 'Block Gradients',
				},
				{
					name: 'Terracotta Tiler',
				},
				{
					name: 'Tellraw generator',
				},
				{
					name: 'Resource Pack Builder',
				},
				{
					name: 'Recipe Builder',
				},
				{
					name: 'Worldgen',
					backgroundImage: this.$image('@/images/worldgen.png'),
					link: '/custom-terrain',
					status: '35% Finished',
					enabled: true,
				},
				{
					name: 'Schematic placer (+ Jigsaw)',
				},
				{
					name: '3D to Minecraft World',
				},
			],
		}
	},
}
</script>

<style scoped>
.navbar .navbar-brand {
	line-height: 1;
}
</style>
