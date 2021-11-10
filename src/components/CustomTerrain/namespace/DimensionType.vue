<template>
	<div class="card">
		<div class="card-header">
			<div class="row">
				<div class="col">
					<div class="input-group">
						<span class="input-group-text" id="dimension_type_name" data-mc-type="namespace">{{ namespace }}:</span>
						<input type="text" class="form-control" placeholder="dimension_type_name" aria-label="dimension_type_name" aria-describedby="dimension_type_name" value="overworld">
					</div>
				</div>
				<div class="col-auto">
					<a href="#" class="btn btn-danger" title="Remove dimension type"><i class="far fa-trash-alt" aria-hidden="true"></i></a>
				</div>
			</div>
		</div>
		<div class="card-body">
			<div class="row">
				<div class="col">
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-has_raids" checked="" onchange="valueChange(this)" data-mc-path="has_raids">
						<label class="form-check-label" for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-has_raids">Has raids</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-has_raids_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">has_raids</small>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-piglin_safe" onchange="valueChange(this)" data-mc-path="piglin_safe">
						<label class="form-check-label" for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-piglin_safe">Piglin safe</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-piglin_safe_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">piglin_safe</small>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-bed_works" checked="" onchange="valueChange(this)" data-mc-path="bed_works">
						<label class="form-check-label" for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-bed_works">Bed works</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-bed_works_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">bed_works</small>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-respawn_anchor_works" onchange="valueChange(this)" data-mc-path="respawn_anchor_works">
						<label class="form-check-label" for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-respawn_anchor_works">Respawn anchor works</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-respawn_anchor_works_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">respawn_anchor_works</small>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-ultrawarm" onchange="valueChange(this)" data-mc-path="ultrawarm">
						<label class="form-check-label" for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-ultrawarm">Ultrawarm</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-ultrawarm_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">ultrawarm</small>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-natural" checked="" onchange="valueChange(this)" data-mc-path="natural">
						<label class="form-check-label" for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-natural">Natural</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-natural_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">natural</small>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-shrunk" onchange="valueChange(this)" data-mc-path="shrunk">
						<label class="form-check-label" for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-shrunk">Shrunk</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-shrunk_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">shrunk</small>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-has_skylight" checked="" onchange="valueChange(this)" data-mc-path="has_skylight">
						<label class="form-check-label" for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-has_skylight">Has skylight</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-has_skylight_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">has_skylight</small>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-has_ceiling" onchange="valueChange(this)" data-mc-path="has_ceiling">
						<label class="form-check-label" for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-has_ceiling">Has ceiling</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-has_ceiling_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">has_ceiling</small>
					</div>
				</div>
				<div class="col">
					<div class="mb-3">
						<label for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-logical_height" class="form-label">Logical height*</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-logical_height_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">logical_height</small>
						<input type="number" class="form-control" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-logical_height" placeholder="logical_height" value="256" onchange="valueChange(this)" data-mc-path="logical_height">
					</div>
					<div class="mb-3">
						<label for="infiniburn" class="form-label">Infiniburn*</label>
						<small id="infiniburn_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">infiniburn</small>
						<select class="form-select" id="infiniburn" data-mc-content="datalist" data-mc-data="infiniburn_datalist" onchange="valueChange(this)" data-mc-path="infiniburn">
							<option v-for="inf in infiniburn" :key="inf.key" :value="inf.value">{{ inf.name }}</option>
						</select>
					</div>
					<div class="mb-3">
						<label for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-ambient_light" class="form-label">Ambient light*</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-ambient_light_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">ambient_light</small>
						<input type="number" class="form-control" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-ambient_light" placeholder="ambient_light" value="0" onchange="valueChange(this)" data-mc-path="ambient_light">
					</div>
					<div class="mb-3">
						<label for="0f70ed60-3c36-4ae2-b01a-1bccd6413568-fixed_time" class="form-label">Fixed time</label>
						<small id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-fixed_time_help" class="form-text text-muted" data-mc-content="value-name" style="display: none;">fixed_time</small>
						<input type="number" class="form-control" id="0f70ed60-3c36-4ae2-b01a-1bccd6413568-fixed_time" placeholder="fixed_time" value="null" onchange="valueChange(this)" data-mc-path="fixed_time">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import capitalize from 'capitalize'

import DimensionType from "@/js/CustomTerrain/Dimension/DimensionType";
import {Infiniburn} from "@/js/CustomTerrain/Helpers/Enum";

export default {
	name: "DimensionType",
	props: {
		data: DimensionType
	},
	data() {
		return {
			id: this.$route.params.cteId,
			namespace: this.$route.params.namespace,

			dp: undefined,

			infiniburn: Object.entries(Infiniburn).map(e => ({key: e[0], value: e[1], name: capitalize.words(e[0].replace(/_/g, ' '))}))
		}
	},
	created() {
		if (this.data && this.dp === undefined)
			this.dp = this.data
	},
	watch: {
		data() {
			if (this.dp === undefined)
				this.dp = this.data
		},
		dp: {
			handler(val) {
				this.$emit('update:data', val)
			},
			deep: true
		}
	},
}
</script>

<style scoped>

</style>