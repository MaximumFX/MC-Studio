<template>
	<div class="card" v-if="dim && dimension">
		<div class="card-header p-0">
			<div class="px-3 pt-2 pb-3">
				<div class="row g-3 mb-3">
					<div class="col">
						<div class="input-group">
							<span class="input-group-text" id="dimension_name" data-mc-type="namespace">{{ namespace }}:</span>
							<input type="text" class="form-control" placeholder="dimension_name" aria-label="dimension_name" aria-describedby="dimension_name" :value="dimension.name">
						</div>
					</div>
					<div class="col-auto">
						<button type="button" class="btn btn-danger" title="Remove dimension"><i class="far fa-trash-alt" aria-hidden="true"></i></button>
					</div>
					<div class="col-auto">
						<button
							type="button" @click="toggle" :aria-expanded="!collapsed"
							class="btn btn-secondary btn-collapse" title="Collapse"
						><i class="far fa-chevron-down" aria-hidden="true"></i></button>
					</div>
				</div>

				<div class="row g-3 align-items-center">
					<div class="col-auto">
						<label for="dimension_type" class="form-label mb-0">Dimension Type*</label>
					</div>
					<div class="col">
						<select class="form-select" id="dimension_type">
							<optgroup v-for="ns in dimensionTypes" :key="ns.namespace" :label="ns.namespace">
								<option v-for="type in ns.dimension_type" :key="`${ns.namespace}:${type.name}`" :value="`${ns.namespace}:${type.name}`">{{ ns.namespace}}:{{ type.name }}</option>
							</optgroup>
						</select>
					</div>
				</div>
			</div>
			<div class="nav nav-tabs">
				<div v-for="dg in dimensionGenerators" :key="dg.name" class="nav-item">
					<div :class="['nav-link cursor-pointer', dim.generator.type === dg.getType() ? 'active': '']" @click="dim.generator = dim.generator.getNew(dg.getType())">
						<div class="form-check">
							<input class="form-check-input" type="radio" name="dimensionGenerators" :id="dg.name" :value="dg.getType()" :checked="dim.generator.type === dg.getType()">
							<label class="form-check-label cursor-pointer" :for="dg.name">{{dg.name.replace('Generator','')}}</label>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="card-body collapse show" ref="collapse">
			<div class="row">
				<div class="col">
					<ValidatedForm v-model:data="dim.generator" :structure="dim.generator.getStructure()"/>
				</div>
			</div>
		</div>
	</div>
	<div v-else class="card loader">
		<h3>Loading...</h3>
	</div>
</template>

<script>
import Dimension from "@/js/CustomTerrain/Dimension/Dimension.ts";
import {DimensionGenerators} from "@/js/CustomTerrain/Dimension/DimensionGenerators.ts";
import ValidatedForm from "@/components/CustomTerrain/form/ValidatedForm";
import {Collapse} from "bootstrap";

export default {
	name: "Dimension",
	components: {ValidatedForm},
	props: {
		dimension: Dimension,
		dimensionTypes: Array
	},
	data() {
		return {
			id: this.$route.params.cteId,
			namespace: this.$route.params.namespace,

			dim: undefined,
			collapse: undefined,
			collapsed: false,

			dimensionGenerators: DimensionGenerators,
		}
	},
	created() {
		if (this.dimension && this.dim === undefined)
			this.dim = this.dimension
		console.log(this.dim)
	},
	mounted() {
		this.collapse = new Collapse(this.$refs.collapse, {
			toggle: false
		})
	},
	watch: {
		data() {
			if (this.dim === undefined)
				this.dim = this.dimension
		},
		dim: {
			handler(val) {
				this.$emit('update:dimension', val)
			},
			deep: true
		}
	},
	methods: {
		toggle() {
			this.collapse.toggle()
			this.collapsed = !this.collapsed
		}
	},
}
</script>

<style scoped>
</style>