import Validation, {ValidationType} from "@/js/CustomTerrain/Validation";

export default {
	emits: ['update:value'],
	props: {
		val: {
			key: String,
			value: undefined,
			validation: Validation
		}
	},
	computed: {
		value: {
			get() {
				return this.val.value
			},
			set(value) {
				if (value) {
					if (this.val.validation.type === ValidationType.INT || this.val.validation.type === ValidationType.FLOAT)
						value = parseFloat(value)
					if (this.val.validation.type === ValidationType.COLOR) {
						console.log(value)
					}
				}

				const returnVal = this.val
				if (returnVal.validation.check(value)) {
					returnVal.value = value
					this.$emit('update:value', returnVal)
				}
				else {
					console.error('[FormItem] Value failed validation:', value)
					//todo reset value
				}
			}
		},
		name() {
			if (!/[a-z]/.test(this.val.key) && /[A-Z]/.test(this.val.key))
				return this.val.key.toLowerCase().replace(/_/g, ' ')
			return this.val.key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')
		}
	}
}
