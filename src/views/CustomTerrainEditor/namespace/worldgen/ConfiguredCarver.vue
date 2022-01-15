<template>
	<div class="container-fluid my-3">
		<div class="card" v-if="json">
			<div class="card-header">
				<div class="row g-3 mb-3">
					<div class="col">
						<div class="input-group">
							<span class="input-group-text" id="dimension_name">{{ namespace.name }}:</span>
							<input type="text" class="form-control" placeholder="dimension_name" aria-label="dimension_name" aria-describedby="dimension_name" :value="json.name">
						</div>
					</div>
					<div class="col-auto">
						<button type="button" class="btn btn-info"><i class="far fa-info-circle"></i></button>
					</div>
					<div class="col-auto">
						<button type="button" class="btn btn-danger" title="Remove dimension"><i class="far fa-trash-alt"></i></button>
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
		<pre class="my-3"><code>{{json}}</code></pre>
	</div>
</template>

<script>
import ValidatedForm from "@/components/CustomTerrain/form/ValidatedForm";
import Loader from "@/components/Loader";
import Namespaced from "@/mixins/CustomTerrain/Namespaced";
import NamespacedFile from "@/mixins/CustomTerrain/NamespacedFile";

export default {
	name: "CTEConfiguredCarver",
	components: {Loader, ValidatedForm},
	mixins: [Namespaced, NamespacedFile],
}
</script>

<style scoped>

</style>
