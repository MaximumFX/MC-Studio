<template>
	<div class="container-fluid my-3">
		<div class="card" v-if="json">
			<div class="card-header">
				<div class="row g-3 mb-3 align-items-center">
					<div class="col">
						<div class="input-group">
							<span class="input-group-text" id="dimension_name">{{ namespace.name }}:</span>
							<input type="text" class="form-control" placeholder="noise_name" v-model="json.name">
						</div>
					</div>
					<div class="col-auto">
						<button type="button" class="btn btn-info"><i class="far fa-info-circle"></i></button>
					</div>
					<div class="col-auto">
						<button type="button" class="btn btn-danger" title="Remove noise"><i class="far fa-trash-alt"></i></button>
					</div>
				</div>
			</div>
			<div class="card-body collapse show">
				<div class="row">
					<div class="col">
						<ValidatedForm v-model:data="json" :structure="validation"/>
					</div>
				</div>
			</div>
		</div>
		<Loader v-else class="mx-auto my-5"/>
	</div>
</template>

<script>
import Namespaced from "@/mixins/CustomTerrain/Namespaced";
import NamespacedFile from "@/mixins/CustomTerrain/NamespacedFile";
import ValidatedForm from "@/components/CustomTerrain/form/ValidatedForm";
import Loader from "@/components/Loader";

export default {
	name: "CTENoise",
	components: {Loader, ValidatedForm},
	mixins: [Namespaced, NamespacedFile],
}
</script>

<style scoped>

</style>
