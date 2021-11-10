interface SpawnerJSON {
	type: string
	weight: number
	minCount: number
	maxCount: number
}

export default class Spawner implements SpawnerJSON {
	type: string
	weight: number
	minCount: number
	maxCount: number

	constructor(json: SpawnerJSON) {
		this.type = json.type
		this.weight = json.weight
		this.minCount = json.minCount
		this.maxCount = json.maxCount
	}
}