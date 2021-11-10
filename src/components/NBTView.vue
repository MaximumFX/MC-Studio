<template>
	<ul v-if="data">
		<NBTViewItem
			class="item"
			:item="data"
			path=""
		></NBTViewItem>
	</ul>
	<p v-else>No file selected.</p>
</template>

<script>
import NBTViewItem from "@/components/NBTViewItem"

export default {
	name: "NBTView",
	components: {
		NBTViewItem
	},
	props: {
		data: Object
	}
}
</script>

<style scoped>
ul {
	list-style-type: none;
	padding-left: 0;
	position: relative;
	overflow: hidden;
}
ul > li::before {
	content: none !important;
}

.item:hover > div {
	background: var(--secondary);
}
</style>
