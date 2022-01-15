<template>
	<div class="container-fluid pt-3" ref="top">
		<h1>
<!--			<a href="#" class="small"><i class="far fa-chevron-left"></i></a>-->
			{{ namespace.name }}
		</h1>

		<div class="row">
			<div class="col-9">
				<div class="card mb-3">
					<div class="card-header pb-0">
						<nav class="nav nav-select" ref="tabNav">
							<a class="nav-link active" href="#nav-dimensions">Dimensions</a>
							<a class="nav-link" href="#nav-dimension-types">Dimension types</a>

							<div class="dropdown">
								<a ref="dropdown" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">Worldgen</a>
								<ul class="dropdown-menu">
									<li><a class="dropdown-item" href="#nav-biomes">Biomes</a></li>
									<li><a class="dropdown-item" href="#nav-carvers">Carvers</a></li>
									<li><a class="dropdown-item" href="#nav-features">Features</a></li>
									<li><a class="dropdown-item" href="#nav-structure-features">Structure features</a></li>
									<li><a class="dropdown-item" href="#nav-noise">Noise</a></li>
									<li><a class="dropdown-item" href="#nav-noise-settings">Noise settings</a></li>
									<li><a class="dropdown-item" href="#nav-processor-list">Processor list</a></li>
									<li><a class="dropdown-item" href="#nav-template-pools">Template pools</a></li>
								</ul>
							</div>
						</nav>
					</div>
					<div v-if="customTerrain" class="card-body">
						<div class="tab-content" id="nav-tabContent">

							<!-- DIMENSIONS -->
							<div class="tab-pane fade show active" id="nav-dimensions" role="tabpanel" aria-labelledby="nav-dimensions-tab">
								<div class="row">
									<div class="col">
										<div class="btn-group mb-3">
											<button type="button" class="btn btn-success"><i class="far fa-plus" aria-hidden="true"></i> Add dimension</button>
											<button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
												<span class="visually-hidden">Toggle Dropdown</span>
											</button>
											<ul class="dropdown-menu">
												<li><a class="dropdown-item" href="#">Overworld</a></li>
												<li><a class="dropdown-item" href="#">The End</a></li>
												<li><a class="dropdown-item" href="#">The Nether</a></li>
											</ul>
										</div>
									</div>
									<div class="col-auto">
										<input type="text" class="form-control" placeholder="Search..." v-model="search.dimension">
									</div>
								</div>
								<div v-if="filtered.dimension.length" class="row g-3">
									<div class="col-6" v-for="item in filtered.dimension" :key="item.id">
										<Dimension :dimension="item" class="h-100"/>
									</div>
								</div>
								<div v-else class="card card-body">No dimensions</div>
							</div>

							<!-- DIMENSION TYPES -->
							<div class="tab-pane fade" id="nav-dimension-types" role="tabpanel" aria-labelledby="nav-dimension-types-tab">
								<div class="row">
									<div class="col">
										<div class="btn-group mb-3">
											<button type="button" class="btn btn-success"><i class="far fa-plus" aria-hidden="true"></i> Add dimension type</button>
											<button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
												<span class="visually-hidden">Toggle Dropdown</span>
											</button>
											<ul class="dropdown-menu">
												<li><a class="dropdown-item" href="#">Overworld</a></li>
												<li><a class="dropdown-item" href="#">Overworld caves</a></li>
												<li><a class="dropdown-item" href="#">The End</a></li>
												<li><a class="dropdown-item" href="#">The Nether</a></li>
											</ul>
										</div>
									</div>
									<div class="col-auto">
										<input type="text" class="form-control" placeholder="Search..." v-model="search.dimension_type">
									</div>
								</div>
								<div v-if="filtered.dimension_type.length" class="row g-3">
									<div class="col-6" v-for="item in filtered.dimension_type" :key="item.id">
										<DimensionType :dimension-type="item" class="h-100"/>
									</div>
								</div>
								<div v-else class="card card-body">No dimension types</div>
							</div>

							<!-- BIOMES -->
							<div class="tab-pane fade" id="nav-biomes" role="tabpanel" aria-labelledby="nav-biomes-tab">
								<div class="row">
									<div class="col">
										<div class="btn-group mb-3">
											<button type="button" class="btn btn-success"><i class="far fa-plus" aria-hidden="true"></i> Add biome</button>
											<button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
												<span class="visually-hidden">Toggle Dropdown</span>
											</button>
											<ul class="dropdown-menu">
												<li><a class="dropdown-item" href="#">TODO</a></li>
											</ul>
										</div>
									</div>
									<div class="col-auto">
										<input type="text" class="form-control" placeholder="Search..." v-model="search.biome">
									</div>
								</div>
								<div v-if="filtered.biome.length" class="row g-3">
									<div class="col-6" v-for="item in filtered.biome" :key="item.id">
										<Biome :biome="item" class="h-100"/>
									</div>
								</div>
								<div v-else class="card card-body">No biomes</div>
							</div>

							<!-- CONFIGURED CARVERS -->
							<div class="tab-pane fade" id="nav-carvers" role="tabpanel" aria-labelledby="nav-carvers-tab">
								<div class="row">
									<div class="col">
										<div class="btn-group mb-3">
											<button type="button" class="btn btn-success"><i class="far fa-plus" aria-hidden="true"></i> Add carver</button>
											<button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
												<span class="visually-hidden">Toggle Dropdown</span>
											</button>
											<ul class="dropdown-menu">
												<li><a class="dropdown-item" href="#">TODO</a></li>
											</ul>
										</div>
									</div>
									<div class="col-auto">
										<input type="text" class="form-control" placeholder="Search..." v-model="search.configured_carver">
									</div>
								</div>
								<div v-if="filtered.configured_carver.length" class="row g-3">
									<div class="col-4" v-for="item in filtered.configured_carver" :key="item.id">
										<ConfiguredCarver :configured-carver="item" class="h-100"/>
									</div>
								</div>
								<div v-else class="card card-body">No carvers</div>
							</div>

							<!-- CONFIGURED FEATURES -->
							<div class="tab-pane fade" id="nav-features" role="tabpanel" aria-labelledby="nav-features-tab">
								Features
							</div>

							<!-- CONFIGURED STRUCTURE FEATURES -->
							<div class="tab-pane fade" id="nav-structure-features" role="tabpanel" aria-labelledby="nav-structure-features-tab">
								Structure features
							</div>

							<!-- NOISE -->
							<div class="tab-pane fade" id="nav-noise" role="tabpanel" aria-labelledby="nav-noise-tab">
								<div class="row">
									<div class="col">
										<div class="btn-group mb-3">
											<button type="button" class="btn btn-success"><i class="far fa-plus" aria-hidden="true"></i> Add noise</button>
											<button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
												<span class="visually-hidden">Toggle Dropdown</span>
											</button>
											<ul class="dropdown-menu">
												<li><a class="dropdown-item" href="#">TODO</a></li>
											</ul>
										</div>
									</div>
									<div class="col-auto">
										<input type="text" class="form-control" placeholder="Search..." v-model="search.noise">
									</div>
								</div>
								<div v-if="filtered.noise.length" class="row g-3">
									<div class="col-6" v-for="item in filtered.noise" :key="item.id">
										<Noise :file="item" class="h-100"/>
									</div>
								</div>
								<div v-else class="card card-body">No noise</div>
							</div>

							<!-- NOISE SETTINGS -->
							<div class="tab-pane fade" id="nav-noise-settings" role="tabpanel" aria-labelledby="nav-noise-settings-tab">
								Noise settings
							</div>

							<!-- PROCESSOR LIST -->
							<div class="tab-pane fade" id="nav-processor-list" role="tabpanel" aria-labelledby="nav-processor-list-tab">
								Processor list
							</div>

							<!-- TEMPLATE POOL -->
							<div class="tab-pane fade" id="nav-template-pools" role="tabpanel" aria-labelledby="nav-template-pools-tab">
								Template pools
							</div>


						</div>
					</div>
					<div v-else class="card-body"><Loader class="mx-auto"/></div>
				</div>
			</div>
			<div class="col position-relative">
				<div v-if="customTerrain" class="sticky-top card card-body">
					<p class="mb-1">Dimensions: <code>{{namespace.data.dimension.length}}</code></p>
					<p>Dimension types: <code>{{namespace.data.dimension_type.length}}</code></p>
					<h5>Worldgen</h5>
					<p class="mb-1">Biomes: <code>{{namespace.data.worldgen.biome.length}}</code></p>
					<p class="mb-1">Carvers: <code>{{namespace.data.worldgen.configured_carver.length}}</code></p>
					<p class="mb-1">Features: <code>{{namespace.data.worldgen.configured_feature.length}}</code></p>
					<p class="mb-1">Structure Features: <code>{{namespace.data.worldgen.configured_structure_feature.length}}</code></p>
					<p class="mb-1">Noise: <code>{{namespace.data.worldgen.noise.length}}</code></p>
					<p class="mb-1">Noise Settings: <code>{{namespace.data.worldgen.noise_settings.length}}</code></p>
					<p class="mb-1">Placed Features: <code>{{namespace.data.worldgen.placed_feature.length}}</code></p>
					<p class="mb-1">Processor List: <code>{{namespace.data.worldgen.processor_list.length}}</code></p>
					<p class="m-0">Template Pool: <code>{{namespace.data.worldgen.template_pool.length}}</code></p>
				</div>
				<div v-else class="card card-body"><Loader class="mx-auto"/></div>
				<button class="btn btn-secondary fixed-bottom" @click="$refs.top.scrollIntoView({behavior: 'smooth'})"><i class="fas fa-arrow-up"></i></button>
			</div>
		</div>
	</div>
</template>

<script>
import {Tab} from 'bootstrap'
import DimensionType from "@/components/CustomTerrain/namespace/DimensionType";
import Dimension from "@/components/CustomTerrain/namespace/Dimension";
import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum.ts";
import Loader from "@/components/Loader";
import Biome from "@/components/CustomTerrain/namespace/worldgen/Biome";
import ConfiguredCarver from "@/components/CustomTerrain/namespace/worldgen/ConfiguredCarver";
import Namespaced from "@/mixins/CustomTerrain/Namespaced";
import Noise from "@/components/CustomTerrain/namespace/worldgen/Noise";

// todo touchbar support

export default {
	name: "CTENamespace",
	components: {Noise, ConfiguredCarver, Biome, Loader, Dimension, DimensionType},
	mixins: [Namespaced],
	data() {
		return {
			activePage: 'dimensions',

			show: true,
			basePath: '/custom-terrain/editor/' + this.$route.params.cteId + '/' + this.$route.params.namespace,

			search: {
				dimension: '',
				dimension_type: '',
				biome: '',
				configured_carver: '',
				configured_feature: '',
				configured_structure_feature: '',
				noise: '',
				noise_settings: '',
				placed_feature: '',
				processor_list: '',
				template_pool: '',
			},
		}
	},
	created() {
		this.$store.commit('setTitle', `[${this.namespace.name}] Namespace`)
		this.$store.commit('custom_terrain/setNamespace', this.namespace)
	},
	mounted() {
		const vue = this
		const triggerTabList = [].slice.call(this.$refs.tabNav.querySelectorAll('a:not([role="button"])'))
		triggerTabList.forEach(function (triggerEl) {
			const tabTrigger = new Tab(triggerEl)

			triggerEl.addEventListener('click', function (event) {
				event.preventDefault()

				triggerTabList.forEach(el => {
					el.classList.remove('active')
				})

				tabTrigger.show()

				if (this.classList.contains('dropdown-item'))
					vue.$refs.dropdown.classList.add('active')
				else
					vue.$refs.dropdown.classList.remove('active')
			})
		})
	},
	computed: {
		dimensionTypes() {
			return this.customTerrain.getAllOfType(CTFileType.DimensionType, true)
		},
		filtered() {
			const filtered = {};
			['dimension', 'dimension_type'].forEach(a => {
				filtered[a] = this.namespace.data[a].filter(b => b.name.includes(this.search[a]))
			});
			[
				'biome', 'configured_carver', 'configured_feature', 'configured_structure_feature', 'noise', 'noise_settings',
				'placed_feature', 'processor_list', 'template_pool'
			].forEach(a => {
				filtered[a] = this.namespace.data.worldgen[a].filter(b => b.name.includes(this.search[a]))
			})
			return filtered
		}
	},
	methods: {
		routerLink(name) {
			return {name: name, params:{cteId: this.customTerrain.id, namespace: this.namespace.id}}
		},
		isActive(name) {
			if (Array.isArray(name))
				return name.includes(this.$route.name) ? 'active' : ''
			return this.$route.name === name ? 'active' : ''
		}
	}
}
</script>

<style scoped>
.sticky-top {
	top: 1rem;
}
.fixed-bottom {
	left: auto;
	right: 1.5rem;
	bottom: 1rem;
	box-shadow: var(--shadow);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
