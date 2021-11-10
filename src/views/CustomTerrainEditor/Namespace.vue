<template>
	<div class="container-fluid pt-3" ref="top">
		<h1>{{ namespace }}</h1>

		<div class="row">
			<div class="col-9">
				<div class="card mb-3">
					<div class="card-header pb-0">
						<nav class="nav nav-select" ref="tabNav">
							<a class="nav-link active" href="#nav-home">Dimensions</a>
							<a class="nav-link" href="#nav-profile">Dimension types</a>

							<div class="dropdown">
								<a ref="dropdown" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">Worldgen</a>
								<ul class="dropdown-menu">
									<li><a class="dropdown-item" href="#nav-biomes">Biomes</a></li>
									<li><a class="dropdown-item" href="#nav-carvers">Carvers</a></li>
									<li><a class="dropdown-item" href="#nav-features">Features</a></li>
									<li><a class="dropdown-item" href="#nav-structure-features">Structure features</a></li>
									<li><a class="dropdown-item" href="#nav-surface-builders">Surface builders</a></li>
									<li><a class="dropdown-item" href="#nav-noise-settings">Noise settings</a></li>
									<li><a class="dropdown-item" href="#nav-processor-list">Processor list</a></li>
									<li><a class="dropdown-item" href="#nav-template-pools">Template pools</a></li>
								</ul>
							</div>
<!--							<a class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact">Biomes</a>-->
<!--							<a class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact">Carvers</a>-->
<!--							<a class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact">Features</a>-->
<!--							<a class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact">Structure features</a>-->
<!--							<a class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact">Surface builders</a>-->
<!--							<a class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact">Noise settings</a>-->
<!--							<a class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact">Processor list</a>-->
<!--							<a class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact">Template pool</a>-->
						</nav>
					</div>
					<div v-if="datapack && dp" class="card-body">
						<div class="tab-content" id="nav-tabContent">
							<div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
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
									<div class="col text-end">
										<button type="button" class="btn btn-info" data-toggle="modal" data-target="#dimension-types-modal"><i class="far fa-info-circle" aria-hidden="true"></i></button>
									</div>
								</div>
								<div id="dimensions">
									<Dimension
										v-for="(dim, i) in data.dimension" :key="dim.name"
										:dimension="dim"
										:dimension-types="Object.entries(dp.data).map(e => ({namespace: e[0], dimension_type: e[1].dimension_type}))"
										:class="{'mb-3': i < data.dimension.length-1}"
									/>
								</div>
							</div>
							<div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
								<div class="row">
									<div class="col">
										<div class="btn-group mb-3">
											<button type="button" class="btn btn-success"><i class="far fa-plus" aria-hidden="true"></i> Add dimension type</button>
											<button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
												<span class="visually-hidden">Toggle Dropdown</span>
											</button>
											<ul class="dropdown-menu">
<!--												<li><a class="dropdown-item" href="#">Empty</a></li>-->
<!--												<li><hr class="dropdown-divider"></li>-->
												<li><a class="dropdown-item" href="#">Overworld</a></li>
												<li><a class="dropdown-item" href="#">Overworld caves</a></li>
												<li><a class="dropdown-item" href="#">The End</a></li>
												<li><a class="dropdown-item" href="#">The Nether</a></li>
											</ul>
										</div>
									</div>
									<div class="col text-end">
										<button type="button" class="btn btn-info" data-toggle="modal" data-target="#dimension-types-modal"><i class="far fa-info-circle" aria-hidden="true"></i></button>
									</div>
								</div>
								<div id="dimension-types">
									<DimensionType
										v-for="type in data.dimension_type" :key="type.name"
										:data="type"
										class="mb-3"
									/>
								</div>
							</div>
							<div class="tab-pane fade" id="nav-biomes" role="tabpanel" aria-labelledby="nav-biomes-tab">
								Biomes
							</div>
							<div class="tab-pane fade" id="nav-carvers" role="tabpanel" aria-labelledby="nav-carvers-tab">
								Carvers
							</div>
							<div class="tab-pane fade" id="nav-features" role="tabpanel" aria-labelledby="nav-features-tab">
								Features
							</div>
							<div class="tab-pane fade" id="nav-structure-features" role="tabpanel" aria-labelledby="nav-structure-features-tab">
								Structure featurs
							</div>
							<div class="tab-pane fade" id="nav-surface-builders" role="tabpanel" aria-labelledby="nav-surface-builders-tab">
								Surface builders
							</div>
							<div class="tab-pane fade" id="nav-noise-settings" role="tabpanel" aria-labelledby="nav-noise-settings-tab">
								Noise settings
							</div>
							<div class="tab-pane fade" id="nav-processor-list" role="tabpanel" aria-labelledby="nav-processor-list-tab">
								Processor list
							</div>
							<div class="tab-pane fade" id="nav-template-pools" role="tabpanel" aria-labelledby="nav-template-pools-tab">
								Template pools
							</div>
						</div>
					</div>
					<div v-else class="card-body">Loading...</div>
				</div>
			</div>
			<div class="col position-relative">
				<div v-if="datapack && dp" class="sticky-top card card-body">
					<p class="mb-1">Dimensions: <code>{{data.dimension.length ? data.dimension.map(d => d.name).join(', ') : 'None'}}</code></p>
					<p>Dimension types: <code>{{data.dimension_type.length ? data.dimension_type.map(d => d.name).join(', ') : 'None'}}</code></p>
					<h5>Worldgen</h5>
					<p class="mb-1">Biomes: <code>{{data.worldgen.biome.length}}</code></p>
					<p class="mb-1">Carvers: <code>{{data.worldgen.configured_carver.length}}</code></p>
					<p class="mb-1">Features: <code>{{data.worldgen.configured_feature.length}}</code></p>
					<p class="mb-1">Structure Features: <code>{{data.worldgen.configured_structure_feature.length}}</code></p>
					<p class="mb-1">Surface Builders: <code>{{data.worldgen.configured_surface_builder.length}}</code></p>
					<p class="mb-1">Noise Settings: <code>{{data.worldgen.noise_settings.length}}</code></p>
					<p class="mb-1">Processor List: <code>{{data.worldgen.processor_list.length}}</code></p>
					<p class="m-0">Template Pool: <code>{{data.worldgen.template_pool.length}}</code></p>
				</div>
				<div v-else class="card card-body">Loading...</div>
				<button class="btn btn-secondary fixed-bottom" @click="$refs.top.scrollIntoView({behavior: 'smooth'})"><i class="fas fa-arrow-up"></i></button>
			</div>
		</div>
	</div>
</template>

<script>
import { Tab } from 'bootstrap'
import DataPack from "@/js/CustomTerrain/DataPack.ts";
import DimensionType from "@/components/CustomTerrain/namespace/DimensionType";
import Dimension from "@/components/CustomTerrain/namespace/Dimension";

//todo touchbar support

export default {
	name: "CTENamespace",
	components: {Dimension, DimensionType},
	props: {
		datapack: DataPack
	},
	data() {
		return {
			id: this.$route.params.cteId,
			namespace: this.$route.params.namespace,

			activePage: 'dimensions',
			dp: undefined,

			show: true,
		}
	},
	created() {
		if (this.datapack && this.dp === undefined)
			this.dp = this.datapack
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
	watch: {
		datapack() {
			if (this.dp === undefined)
				this.dp = this.datapack
		},
		dp: {
			handler(val) {
				this.$emit('update:datapack', val)
			},
			deep: true
		}
	},
	computed: {
		data() {
			return this.dp.data[this.namespace]
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
