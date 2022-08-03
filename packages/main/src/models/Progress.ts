export interface ProgressReturn {
	status: string,
	stage: number,
	items?: number,
	activeItem?: number,
	activeStatus?: string
}

export default class Progress {
	private callback?: (status: string, stage: number, items?: number, activeItem?: number, activeStatus?: string) => void

	onUpdate = (callback: (status: string, stage: number, items?: number, activeItem?: number, activeStatus?: string) => void) => this.callback = callback
	protected update = (status: string, stage: number, items?: number, activeItem?: number, activeStatus?: string) => this.callback ? this.callback(status, stage, items, activeItem, activeStatus) : undefined
	getUpdate = (): ProgressReturn => ({ status: '', stage: 0 })
}

export class SimpleProgress extends Progress {
	status: string
	item = 0
	total: number

	constructor(status = '', total = 0) {
		super()
		this.status = status
		this.total = total
	}

	count = () => {
		this.item++
		this.sendUpdate()
	}
	finish = () => {
		this.item = this.total
		this.sendUpdate()
	}
	setTotal = (total: number) => {
		this.total = total
		this.sendUpdate()
	}

	setStatus = (status: string) => {
		this.status = status
		this.sendUpdate()
	}

	sendUpdate = () => this.update(this.status, this.item / this.total)
	getUpdate = (): ProgressReturn => ({
		status: this.status,
		stage: this.item / this.total,
	})
}

export class ProgressItem {
	key: string
	status: string
	item = 0
	total: number

	constructor(key: string, status = '', total = 0) {
		this.key = key
		this.status = status
		this.total = total
	}
}
export class AdvancedProgress extends Progress {
	status: string
	items: ProgressItem[] = []
	activeItem = 0

	constructor(status = '', items: ProgressItem[] = []) {
		super()
		this.status = status
		this.items = items
	}

	addItems = (...items: ProgressItem[]) => {
		this.items.push(...items)
		this.sendUpdate()
	}
	setTotal = (index: number | string, total: number) => {
		if (typeof index === 'number')
			this.items[index].total = total
		else {
			const item = this.items.find(i => i.key === index)
			if (item) item.total = total
			else {
				console.error('no_item_by_key setTotal', index, total)
				throw 'no_item_by_key'
			}
		}
		this.sendUpdate()
	}

	count = (index: number | string) => {
		if (typeof index === 'number') {
			this.activeItem = index
			this.items[index].item++
		}
		else {
			const findIndex = this.items.findIndex(i => i.key === index)
			this.activeItem = findIndex
			if (findIndex != -1) this.items[findIndex].item++
			else {
				console.error('no_item_by_key count', index)
				throw 'no_item_by_key'
			}
		}
		this.sendUpdate()
	}
	finish = (index: number | string) => {
		if (typeof index === 'number') {
			this.activeItem = index
			this.items[index].item = this.items[index].total
		}
		else {
			const findIndex = this.items.findIndex(i => i.key === index)
			this.activeItem = findIndex
			if (findIndex != -1) this.items[findIndex].item = this.items[findIndex].total
			else {
				console.error('no_item_by_key count', index)
				throw 'no_item_by_key'
			}
		}
		this.sendUpdate()
	}

	setStatus = (status: string) => {
		this.status = status
		this.sendUpdate()
	}

	setItemStatus = (status: string, index: number | string = this.activeItem) => {
		if (typeof index === 'number')
			this.items[index].status = status
		else {
			const item = this.items.find(i => i.key === index)
			if (item) item.status = status
			else {
				console.error('no_item_by_key setItemStatus', index, status)
				throw 'no_item_by_key'
			}
		}
		this.sendUpdate()
	}

	sendUpdate = () => this.update(
		this.status,
		this.items.reduce((acc, item) => acc + item.item, 0) /
		this.items.reduce((acc, item) => acc + item.total, 0),
		this.items.length,
		this.activeItem,
		this.items[this.activeItem]?.status ?? '',
	)
	getUpdate = (): ProgressReturn => ({
		status: this.status,
		stage: this.items.reduce((acc, item) => acc + item.item, 0) /
			this.items.reduce((acc, item) => acc + item.total, 0),
		items: this.items.length,
		activeItem: this.activeItem,
		activeStatus: this.items[this.activeItem]?.status ?? '',
	})
}

export enum ProgressType {
	WORLD_VIEWER = 'worldViewer'
}
