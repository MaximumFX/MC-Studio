import type MCBlock from '@/minecraft/Block';

export interface MCBlockStateModel  {
	model: string
	x?: number
	y?: number
	uvlock?: boolean
	weight?: number
}
export interface MCBlockStateCaseState {
	[state: string]: string
}
export interface MCBlockStateCaseOR {
	OR: MCBlockStateCaseState[]
}
export interface MCBlockState {
	variants?: {
		[state: string]: MCBlockStateModel | MCBlockStateModel[]
	}
	multipart?: {
		apply: MCBlockStateModel | MCBlockStateModel[]
		when: MCBlockStateCaseOR | MCBlockStateCaseState
	}[]
}

const randomFromArray = (array: any[]) => array[Math.floor(Math.random() * array.length)]
const sortString = (a: string, b: string) => a.localeCompare(b)

export default class Blockstate {
	blockstate: MCBlockState

	constructor(blockstate: MCBlockState) {
		this.blockstate = blockstate
	}

	getModel = (block: MCBlock): MCBlockStateModel | MCBlockStateModel[] | null => {
		const getVariant = (model: MCBlockStateModel | MCBlockStateModel[]) => {
			if (Array.isArray(model))
				return randomFromArray(model)
			else return model
		}
		const state = block.Properties ?
			Object.entries(block.Properties).filter(a => !['waterlogged', 'powered'].includes(a[0]))
				.flatMap(a => `${a[0]}=${a[1]}`).sort(sortString) : []
		const mergedState = state.join(',')
		if (this.blockstate.variants) {
			const sortedVariants: {[key: string]: MCBlockStateModel | MCBlockStateModel[]} = {}

			if (this.blockstate.variants['']) {
				return getVariant(this.blockstate.variants[''])
			}

			for (const variantsKey in this.blockstate.variants) {
				const states = variantsKey.split(',').sort(sortString).join(',')
				sortedVariants[states] = this.blockstate.variants[variantsKey]
			}
			if (sortedVariants[mergedState]) {
				return getVariant(sortedVariants[mergedState])
			}
			else {
				const states = Object.keys(this.blockstate.variants).map(v => v.split('=')[0])
				console.log('else', mergedState, this.blockstate.variants);
			}
		}
		else if (this.blockstate.multipart) {
			const models: MCBlockStateModel[] = this.blockstate.multipart.filter(m => !m.when).map(m => getVariant(m.apply))
			for (const multipartElement of this.blockstate.multipart.filter(m => m.when)) {

				if (multipartElement.when.OR) {
					console.log('OR', multipartElement.when.OR);
				}
				else {
					const partState = Object.entries(multipartElement.when)
						.map(a => {
							if (a[1].includes('|'))
								return a[1].split('|').map((b: string) => ({ key: a[0], value: b }))
							return { key: a[0], value: a[1] }
						})
						.flat()
						.flatMap(a => `${a.key}=${a.value}`)
					if (partState.some(a => state.includes(a))) {
						models.push(getVariant(multipartElement.apply))
					}
					// else console.warn('state', state)
				}
			}
			if (models.length === 0) console.warn('no models', state, this.blockstate);
			return models
		}

		return null
	}
}
