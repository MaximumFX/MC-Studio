export interface BlockInterface {
	Name: string
	Properties?: object
}

export default class Block {
	Name: string
	Properties?: object
	constructor(json: BlockInterface) {
		this.Name = json.Name
		if (json.hasOwnProperty('Properties'))
			this.Properties = json.Properties
	}
}