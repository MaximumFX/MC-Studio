<template>
	<div class="container-fluid my-3">
		<div class="card" v-if="json">
			<div class="card-header">
				<div class="row g-3 align-items-center">
					<div class="col">
						<div class="input-group">
							<span class="input-group-text" id="dimension_name">{{ namespace.name }}:</span>
							<input type="text" class="form-control" placeholder="dimension_name" aria-label="dimension_name" aria-describedby="dimension_name" v-model="json.name">
						</div>
					</div>

					<div class="col-auto">
						<input type="color" class="form-control form-control-color" v-model="color">
					</div>
					<div class="col-auto">
						<MCSprite :sprite="sprite" class="fs-1"/>
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
import Loader from "@/components/Loader";
import ValidatedForm from "@/components/CustomTerrain/form/ValidatedForm";
import Namespaced from "@/mixins/CustomTerrain/Namespaced";
import NamespacedFile from "@/mixins/CustomTerrain/NamespacedFile";
import MCIcon from "@/components/MCIcon";
import MCSprite, {MCSpriteType} from "@/js/MCSprite";
import MCSpriteComp from "@/components/MCSprite";

export default {
	name: "CTEBiome",
	components: {MCSprite: MCSpriteComp, MCIcon, ValidatedForm, Loader},
	mixins: [Namespaced, NamespacedFile],
	computed: {
		sprite() {
			return this.ctfile.sprite ?? new MCSprite(MCSpriteType.BIOME, this.json.name.replace(/_/g, '-'))
		}
	}
}
</script>

<style scoped>

</style>
