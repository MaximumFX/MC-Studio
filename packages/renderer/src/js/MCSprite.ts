import type { BiomeSpriteType } from '../../assets/data/MCSprite/BiomeSprite';
import type { BlockSpriteType } from '../../assets/data/MCSprite/BlockSprite';
import type { InvSpriteType } from '../../assets/data/MCSprite/InvSprite';
import { BiomeSprite } from '../../assets/data/MCSprite/BiomeSprite';
import { BlockSprite } from '../../assets/data/MCSprite/BlockSprite';
import { InvSprite } from '../../assets/data/MCSprite/InvSprite';

const SpriteJson: {[key: string]: never} = {
	Biome: BiomeSprite,
	Block: BlockSprite,
	Inv: InvSprite,
}

export type Icon = BiomeSpriteType | BlockSpriteType | InvSpriteType

export default class MCSprite {
	type: MCSpriteType
	icon: Icon

	constructor(id: string | MCSpriteType, icon?: Icon) {
		if (icon) {
			this.type = id as MCSpriteType
			this.icon = icon
		}
		else {
			const split = id.split(':')
			this.type = split[0] as MCSpriteType
			this.icon = split[1] as Icon
		}
	}

	getPos = () => {
		const json = SpriteJson[this.type]
		if (json) {
			const size = json.settings.size ?? 16
			const icon = json.ids[this.icon]
			const width = json.settings.sheetsize / size
			if (icon) {
				const left = (icon.pos - 1) % width * size
				const top = Math.floor((icon.pos - 1) / width) * size
				return { x: left / 16, y: top / 16 }
			}

			// const left = (json.settings.pos - 1) % width * size
			// const top = Math.floor((json.settings.pos - 1) / width) * size
			// return { x: left / 16, y: top / 16 }
		}
		return { x: 0, y: 0 }
	}
	getSize = () => {
		const json = SpriteJson[this.type]
		if (json) {
			const size = json.settings.size ?? 16
			const width = json.settings.sheetsize / size
			const height =  json.settings.pos / width
			return { size, width, height }
		}
		return {}
	}
	getImage = () => `@/data/MCSprite/${SpriteJson[this.type].settings.image}`

	toJSON = () => this.type + ':' + this.icon
}

export enum MCSpriteType {
	BIOME = 'Biome',
	BLOCK = 'Block',
	// EFFECT = 'Effect',
	// ENTITY = 'Entity',
	// ITEM = 'Item',
	INV = 'Inv',
	// SCHEMATIC = 'Schematic',
	// SLOT = 'Slot',
	// ACHIEVEMENT = 'Achievement',
	// NEW_ACHIEVEMENT = 'NewAchievement',
}
