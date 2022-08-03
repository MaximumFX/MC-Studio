<template>
	<span :class="['invslot', large ? 'invslot-large' : '']">
		<span
			class="invslot-item"
			data-minetip-title="${displayName} (${sectionName})"
		>
			<slot/>
		</span>
	</span>
</template>

<script>
//todo title: ${displayName} (${sections.find(s => s.id === id.section).name})
export default {
	name: 'InvSlot',
	props: {
		large: Boolean,
	},
};
</script>

<style scoped>
.invslot {
	position: relative;
	display: inline-block;
	background: #8B8B8B;
	border: 2px solid;
	border-color: #373737 #FFF #FFF #373737;
	/*width: 36px;*/
	/*height: 36px;*/
	font-size: 16px;
	line-height: 1;
	text-align: left;
	vertical-align: middle;
}
.invslot::before,
.invslot::after {
	content: "";
	position: absolute;
	background-color: #8B8B8B;
	height: 2px;
	width: 2px;
	pointer-events: none
}
.invslot::before {
	bottom: -2px;
	left: -2px
}
.invslot::after {
	top: -2px;
	right: -2px
}
.invslot-large {
	padding: 8px
}
.invslot-item {
	position: relative;
	display: block;
	width: 32px;
	height: 32px;
}
.invslot-stacksize {
	position: absolute;
	right: 0;
	bottom: 0;
	font-family: Minecraft,sans-serif !important;
	font-weight: normal !important;
	color: #FFF !important;
	text-shadow: 2px 2px 0 #3F3F3F;
	filter: dropshadow(color = #3F3F3F, offx = 2, offy = 2);
	z-index: 2
}
</style>
