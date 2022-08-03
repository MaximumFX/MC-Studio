<template>
	<li>
		<a :class="{active, capitalize: true}" @click="$emit('select-item', folder)">{{ folder.name.replace(/_/g, ' ') }}</a>
		<ul v-show="selectedPath.startsWith(folder.path)" v-if="folder.hasOwnProperty('items') && folder.items.length">
			<Folder
				v-for="(item, i) in folder.items"
				:key="i"
				class="item"
				:folder="item"
				:selected-path="selectedPath"
				@select-item="selectItem"
			/>
		</ul>
	</li>
</template>

<script>
export default {
	name: 'Folder',
	props: {
		folder: {
			type: Object,
			required: true,
		},
		selectedPath: {
			type: String,
			required: true,
		},
	},
	emits: ['select-item'],
	computed: {
		active() {
			return this.folder.path === this.selectedPath &&
				(// If has item that is selected or has no items
					this.folder.hasOwnProperty('items') && !this.folder.items.some(c => c.path === this.selectedPath) ||
					!this.folder.hasOwnProperty('items')
				)
		},
	},
	methods: {
		selectItem(item) {
			this.$emit('select-item', item)
		},
	},
};
</script>

<style scoped>
ul {
	list-style-type: none;
	padding-left: .5rem;
	margin-bottom: .25rem;
	position: relative;
	overflow: hidden;
	border-left: .125rem solid var(--border);
}

</style>
