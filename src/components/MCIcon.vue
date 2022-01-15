<template>
	<span :class="['sprite', 'sprite-' + type, inventory?'sprite-inv':'']" :style="['background-position: '+bgPos]"></span>
</template>

<script>
import blockJson from '@/assets/minecraft/BlocksCSS.json';
import biomeJson from '@/assets/minecraft/BiomeCSS.json';

export default {
	name: "MCIcon",
	props: {
		icon: String,
		type: {
			type: String,
			default: 'biome'
		},
		inventory: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		bgPos() {
			const json = this[this.type+'Json']
			if (json) {
				const icon = json.ids[this.icon]
				const tiles = json.settings.sheetsize / json.settings.size
				if (icon) {
					const left = (icon.pos - 1) % tiles * json.settings.size
					const top = Math.floor((icon.pos - 1) / tiles) * json.settings.size
					return `-${left / 16}em -${top / 16}em`
				}

				const left = (json.settings.pos - 1) % tiles * json.settings.size
				const top = Math.floor((json.settings.pos - 1) / tiles) * json.settings.size
				return `-${left / 16}em -${top / 16}em`
			}
			return ''
		}
	},
	data() {
		return {
			blockJson,
			biomeJson
		}
	}
}
</script>

<style scoped>
.pixel-image,
.invslot-item-image,
.sprite {
	display: inline-block;
	vertical-align: text-top;
	transform-origin: top left;
	background-repeat: no-repeat;

	image-rendering: optimizeSpeed;
	image-rendering: -webkit-optimize-contrast;
	image-rendering: optimize-contrast;
	image-rendering: -moz-crisp-edges;
	image-rendering: -o-crisp-edges;
	image-rendering: crisp-edges;
	image-rendering: pixelated;
	-ms-interpolation-mode: nearest-neighbor;
}

.sprite-block {
	height: 16px;
	width: 16px;
	background-image: url('../assets/minecraft/BlockCSS.png');
	background-size: 384px 1520px;
}
.sprite-biome {
	height: 1em;
	width: 1em;
	background-image: url('../assets/minecraft/BiomeCSS.png');
	background-size: calc(1em * 8) calc(1em * 12);
}

.sprite-inv,
.slot-sprite {
	width: 32px;
	height: 32px;
	background-image: url('https://gamepedia.cursecdn.com/minecraft_gamepedia/4/44/InvSprite.png?version=1472e9fb4ac3210a4dff29991d6fb12a');
	background-repeat: no-repeat;
	background-size: 1024px 3648px;
	vertical-align: middle;
}

.sprite:not(.sprite-inv).sprite-bedrock {
	background-position: -320px -816px;
}

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

.invslot::before, .invslot::after {
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

.invslot-item, .invslot-item > a:first-child {
	position: relative;
	display: block;
	width: 32px;
	height: 32px;
}

.invslot-item-image > a.new:first-child {
	background: url('https://minecraft.gamepedia.com/media/4/44/InvSprite.png') no-repeat content-box;
	width: 32px;
	height: 32px;
	text-indent: -9999px;
	overflow: hidden
}

.invslot-stacksize {
	position: absolute;
	right: 0;
	bottom: 0;
	font-family: Minecraft, sans-serif !important;
	font-weight: normal !important;
	color: #FFF !important;
	text-shadow: 2px 2px 0 #3F3F3F;
	filter: dropshadow(color = #3F3F3F, offx = 2, offy = 2);
	z-index: 2
}

.invslot-plain {
	background-color: transparent;
	border: 0
}

.invslot-plain::before, .invslot-plain::after {
	content: none
}

.invslot-plain > .invslot-item, .invslot-plain > .invslot-item > a:first-child {
	margin: 0;
	padding: 0
}

.crafting {
	padding: 6px;
	display: inline-block;
	background-color: #C6C6C6;
	border: 2px solid;
	border-color: #DBDBDB #5B5B5B #5B5B5B #DBDBDB;
}

.crafting-custom {
	background-color: #8FC4DC;
	border-color: #C0DEEB #1A536E #1A536E #C0DEEB;
}

.crafting-recipe > * {
	vertical-align: middle;
	display: inline-block;
}

.invgrid {
	border-collapse: collapse;
	display: inline-block;
}

.crafting-arrow {
	background: url(https://minecraft.gamepedia.com/media/8/86/Grid_layout_Arrow_%28small%29.png) no-repeat;
}

.crafting-custom .crafting-arrow {
	background: url(https://wiki.gm4.co/images/b/b7/Custom_Crafting_arrow.png);
}

.crafting-arrow {
	width: 32px;
	height: 32px;
}

.inv-grid {
	width: 108px;
	font-size: 0;
}

</style>
