<template>
	<span
		ref="preview"
		contenteditable="true" spellcheck="false"
		class="text-preview"
		@blur="onEdit"
		@keydown.enter="endEdit">
		{{ value }}
		<span class="edit-icon"><i class="far fa-pencil"></i></span>
	</span>
</template>

<script>
export default {
	name: "EditableText",
	props: {
		text: String,
		number: Number,
	},
	data() {
		return {
			value: this.text ?? this.number,
			type: this.text ? String : Number
		}
	},
	methods:{
		onEdit(evt) {
			//todo validate
			this.value = evt.target.innerText

			if (this.type === String)
				this.$emit('update:text', this.value)
			else if (this.type === Number)
				this.$emit('update:number', parseFloat(this.value))
		},
		endEdit() {
			this.$refs.preview.blur()
		}
	}
}
</script>

<style scoped>
.text-preview {
	cursor: text;
	position: relative;
}
.text-preview:hover:not(:focus) {
	text-decoration: underline;
}
.edit-icon {
	opacity: 0;
	position: absolute;
	right: -1.5em;
	/*top: 0;*/
	/*bottom: 0;*/
}
.text-preview:hover:not(:focus) .edit-icon {
	opacity: 1;
}

</style>