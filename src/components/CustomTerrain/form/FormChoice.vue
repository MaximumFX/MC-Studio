<template>
	<div class="card">
		<div class="card-header p-0">
			<div class="px-3 pt-2 pb-3">
				<div class="row align-items-center">
					<div class="col">
						<h6 class="text-capitalize m-0">{{ val.key.replace(/_/g, ' ') }}{{ val.validation.optional ? '' : '*'}}</h6>
					</div>
					<div class="col-auto">
						<button
							type="button" @click="toggle" aria-expanded="true"
							class="btn btn-secondary btn-collapse btn-sm" title="Collapse"
						><i class="far fa-chevron-down" aria-hidden="true"></i></button>
					</div>
				</div>
			</div>
			<div class="nav nav-tabs">
				<div v-for="choice in val.validation.getChoices()" :key="choice.key" class="nav-item">
					<div :class="['nav-link cursor-pointer', val.value[val.validation.options.key] === choice.key ? 'active': '']">
						<div class="form-check">
							<input class="form-check-input" type="radio" :name="'choice-'+val.key" :id="choice.key" :value="val.value[val.validation.options.key]" :checked="val.value[val.validation.options.key] === choice.key">
							<label class="form-check-label cursor-pointer" :for="choice.key">{{choice.name}}</label>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="card-body collapse show" ref="collapse">
<!--			{{ selectedChoice.elements }}-->
<!--			<div class="mb-1" v-for="e in selectedChoice.elements" :key="e.key">-->
<!--				{{ e }}<br><br>-->
<!--			</div>-->
			<FormBuilder :form="selectedChoice.elements"/>
		</div>
	</div>
</template>

<script>
import Validation, {ValidationType} from "@/js/CustomTerrain/Validation.ts";
import {Collapse} from "bootstrap";

export default {
	name: "FormChoice",
	props: {
		val: {
			key: String,
			value: Object,
			validation: Validation
		}
	},
	created() {
		console.log(this.val)
	},
	data() {
		return {
			vdt: ValidationType,

			collapse: undefined,
		}
	},
	computed: {
		selectedChoice() {
			return this.val.validation.getChoices()
				.find(choice => this.val.value[this.val.validation.options.key] === choice.key).value
		}
	},
	mounted() {
		this.collapse = new Collapse(this.$refs.collapse, {
			toggle: false
		})
	},
	methods: {
		toggle() {
			this.collapse.toggle()
		}
	}
}
</script>

<style scoped>

</style>
