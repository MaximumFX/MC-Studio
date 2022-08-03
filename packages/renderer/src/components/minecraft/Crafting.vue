<template>
	<div v-if="type === 'crafting_table'" class="crafting no-select">
		<div class="inv-grid">
			<inv-slot>
				<MCSprite v-if="sprite.items[0]" :sprite="sprite.items[0]" inventory/>
			</inv-slot>
			<inv-slot>
				<MCSprite v-if="sprite.items[1]" :sprite="sprite.items[1]" inventory/>
			</inv-slot>
			<inv-slot>
				<MCSprite v-if="sprite.items[2]" :sprite="sprite.items[2]" inventory/>
			</inv-slot>
			<inv-slot>
				<MCSprite v-if="sprite.items[3]" :sprite="sprite.items[3]" inventory/>
			</inv-slot>
			<inv-slot>
				<MCSprite v-if="sprite.items[4]" :sprite="sprite.items[4]" inventory/>
			</inv-slot>
			<inv-slot>
				<MCSprite v-if="sprite.items[5]" :sprite="sprite.items[5]" inventory/>
			</inv-slot>
			<inv-slot>
				<MCSprite v-if="sprite.items[6]" :sprite="sprite.items[6]" inventory/>
			</inv-slot>
			<inv-slot>
				<MCSprite v-if="sprite.items[7]" :sprite="sprite.items[7]" inventory/>
			</inv-slot>
			<inv-slot>
				<MCSprite v-if="sprite.items[8]" :sprite="sprite.items[8]" inventory/>
			</inv-slot>
		</div>
		<div class="crafting-arrow"/>
		<inv-slot large>
			<MCSprite v-if="sprite.result" :sprite="sprite.result.item" :count="sprite.result.count" inventory/>
		</inv-slot>
	</div>
	<div v-else>No preview available</div>
</template>

<script>
import InvSlot from '@/components/minecraft/InvSlot';
import MCSprite from '@/components/minecraft/MCSprite';
import Sprite, { MCSpriteType } from '@/js/MCSprite';

export default {
	name: 'Crafting',
	components: {MCSprite, InvSlot},
	props: {
		recipe: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		type() {
			if (this.recipe.type && ['crafting_shaped', 'crafting_shapeless'].some(a => this.recipe.type.endsWith(a))) return 'crafting_table'
			return ''
		},
		sprite() {
			const fixName = (name) => {
				let icon = name.replace('minecraft:', '').replace(/_/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())

				if (icon.endsWith(' Block')) icon = 'Block of ' + icon.replace(' Block', '')

				return icon
			}
			let sprites = []
			console.log({...this.recipe});
			let result
			if (this.recipe.type) {
				if (this.recipe.result) {
					if (this.recipe.result.item)
					result = {
						count: this.recipe.result.count,
						item: new Sprite(MCSpriteType.INV, fixName(this.recipe.result.item)),
					}
					else console.warn(this.recipe.result.tag);
				}
				if (this.recipe.type.endsWith('crafting_shaped')) {
					if (this.recipe.key && this.recipe.pattern) {
						sprites = this.recipe.pattern
							.map(a => a.padEnd(3, ' '))
							.join('').split('').map(a => this.recipe.key[a])
					}
				}
				else if (this.recipe.type.endsWith('crafting_shapeless'))
					sprites = this.recipe.ingredients
			}
			sprites = sprites.map(s => {
				if (s) {
					if (s.item) {

						return new Sprite(MCSpriteType.INV, fixName(s.item))
					}
					else {
						return new Sprite(MCSpriteType.INV, '')
					}
				}
				else return s
			})
			return {
				items: sprites,
				result,
			}
		},
	},
};
</script>

<style scoped>
.crafting {
	display: flex;
	grid-template-columns: 108px auto auto;
	gap: 0 4px;
	align-items: center;
	width: fit-content;
	height: fit-content;

	padding: 6px;
	background-color: #C6C6C6;
	border: 2px solid;
	border-color: #DBDBDB #5B5B5B #5B5B5B #DBDBDB;
}
.inv-grid {
	width: 108px;
}
.crafting-arrow {
	background: url("@asset/textures/minecraft/crafting_arrow.png") no-repeat;
	width: 32px;
	height: 26px;
}
</style>
