<template>
	<div class="container-fluid my-3">
		<div class="card" v-if="json">
			<div class="card-header">
				<div class="row">
					<div class="col">
						<div class="input-group">
							<span class="input-group-text" id="dimension_type_name">{{ namespace.name }}:</span>
							<input type="text" class="form-control" placeholder="dimension_type_name" v-model="name">
						</div>
					</div>
					<div class="col-auto">
						<button type="button" class="btn btn-info"><i class="far fa-info-circle"></i></button>
					</div>
					<div class="col-auto">
						<a href="#" class="btn btn-danger" title="Remove dimension type"><i class="far fa-trash-alt"></i></a>
					</div>
				</div>
			</div>
			<div class="card-body">
				<ValidatedForm v-model:data="json" :structure="validation"/>
			</div>
			<hr>
			<div class="card-body">
				<div class="row">
					<div class="col">
						<FormInt :val="val('logical_height')" class="mb-3"/>
						<FormInt :val="val('height')" class="mb-3"/>
						<FormInt :val="val('min_y')" class="mb-3"/>
						<FormInt :val="val('coordinate_scale')" class="mb-3"/>
						<FormBoolean :val="val('has_skylight')" class="mb-3"/>
						<FormBoolean :val="val('has_ceiling')" class="mb-3"/>
						<FormBoolean :val="val('natural')" class="mb-3"/>
						<FormBoolean :val="val('ultrawarm')" class="mb-3"/>
					</div>
					<div class="col">
						<FormEnum :val="val('infiniburn')" class="mb-3"/>
						<FormEnum :val="val('effects')" class="mb-3"/>
						<FormFloat :val="val('ambient_light')" class="mb-3"/>
						<FormInt :val="val('fixed_time')" class="mb-3"/>
						<FormBoolean :val="val('respawn_anchor_works')" class="mb-3"/>
						<FormBoolean :val="val('piglin_safe')" class="mb-3"/>
						<FormBoolean :val="val('bed_works')" class="mb-3"/>
						<FormBoolean :val="val('has_raids')"/>
					</div>
				</div>
			</div>
		</div>
		<Loader v-else class="mx-auto my-5"/>
		<pre><code>{{json}}</code></pre>
	</div>
</template>

<script>
import capitalize from 'capitalize'
import {Infiniburn} from "@/js/CustomTerrain/Helpers/Enum";
import Loader from "@/components/Loader";
import Namespaced from "@/mixins/CustomTerrain/Namespaced";
import NamespacedFile from "@/mixins/CustomTerrain/NamespacedFile";
import FormInt from "@/components/CustomTerrain/form/FormInt";
import FormEnum from "@/components/CustomTerrain/form/FormEnum";
import FormBoolean from "@/components/CustomTerrain/form/FormBoolean";
import FormFloat from "@/components/CustomTerrain/form/FormFloat";
import ValidatedForm from "@/components/CustomTerrain/form/ValidatedForm";

export default {
	name: "CTEDimensionType",
	mixins: [Namespaced, NamespacedFile],
	components: {ValidatedForm, FormFloat, FormBoolean, FormEnum, FormInt, Loader},
	data() {
		return {
			infiniburn: Object.entries(Infiniburn).map(e => ({key: e[0], value: e[1], name: capitalize.words(e[0].replace(/_/g, ' '))}))
		}
	},
	methods: {
		val(name) {
			return {key: name, value: this.json[name], validation: this.validation[name]}
		}
	}
}
</script>

<style scoped>

</style>
