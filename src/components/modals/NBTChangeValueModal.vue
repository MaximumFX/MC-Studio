<template>
	<div class="modal" id="nbtChangeValue" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="nbtChangeValueLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content bg-mcs-bg" v-if="nbtChangeValue">
				<div class="modal-body">
					<h5 class="modal-title mb-2" id="nbtChangeValueLabel">Change the value of <b>{{ nbtChangeValue.name }}</b> (<code>{{ nbtChangeValue.type }}</code>)</h5>
					<input type="text" class="form-control" v-model="value">
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="btn.disabled">Cancel</button>
					<button type="button" class="btn btn-primary" @click="saveChanges" v-html="btn.value" :disabled="btn.disabled"></button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getModalsVal } from "@/js/state"

export default {
	name: "NBTChangeValueModal",
	data() {
		return {
			nbtChangeValue: getModalsVal('nbtChangeValue'),
			value: '',
			btn: {disabled: false, value: 'Save changes'},
		}
	},
	created() {
		this.btn = {disabled: false, value: 'Save changes'}
	},
	watch: {
		nbtChangeValue() {
			this.value = this.nbtChangeValue.value
		}
	},
	methods: {
		saveChanges() {
			console.log(this.value)
			this.btn.disabled = true
			this.btn.value = '<i class="fas fa-circle-notch fa-spin"></i>'
			this.$emit('edit', this.value)
		}
	}
}
</script>

<style scoped>
.modal {
	user-select: none;
}
</style>
