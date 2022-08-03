<template>
	<span class="relative block h-full">
		<span :class="['sprite', inventory ? 'sprite-inv' : '']" :style="css"/>
		<span v-if="count" class="invslot-stacksize absolute right-0 bottom-0">{{ count }}</span>
	</span>
</template>

<script>
import MCSprite from '@/js/MCSprite';



export default {
	name: 'MCSprite',
	props: {
		sprite: MCSprite,
		inventory: Boolean,
		count: {
			type: Number,
			default: undefined,
		},
	},
	computed: {
		css() {
			const pos = this.sprite.getPos()
			console.log(this.sprite);
			const size = this.sprite.getSize()
			return {
				backgroundPosition: `-${pos.x}em -${pos.y}em`,
				backgroundImage: `url('${this.$image(this.sprite.getImage())}')`,
				backgroundSize: `calc(1em * ${size.width * size.size / 16}) calc(1em * ${size.height * size.size / 16})`,
			}
		},
	},
}
</script>

<style scoped>
.pixel-image,
.invslot-item-image,
.sprite {
	display: inline-block;
	height: 1em;
	width: 1em;
	vertical-align: text-top;
	transform-origin: top left;
	background-repeat: no-repeat;

	image-rendering: pixelated;
}

.sprite-inv,
.slot-sprite {
	width: 32px;
	height: 32px;
	background-repeat: no-repeat;
	background-size: 1024px 3648px;
	vertical-align: middle;
}

.invslot-stacksize {
	position: absolute;
	right: 0;
	bottom: 0;
	font-family: Minecraft, sans-serif !important;
	font-weight: normal !important;
	color: #FFF !important;
	text-shadow: 2px 2px 0 #3F3F3F;
	z-index: 2;
}
</style>
