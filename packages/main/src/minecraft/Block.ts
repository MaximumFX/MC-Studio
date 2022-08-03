export interface MCBlockInterface {
	Name: string
	Properties?: {
		[key: string]: any
	}
}

export default class MCBlock {
	Name: string
	Properties?: object

	constructor(json: MCBlockInterface) {
		this.Name = json.Name
		if (json.hasOwnProperty('Properties'))
			this.Properties = json.Properties
	}
}
