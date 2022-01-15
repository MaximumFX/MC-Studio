export default class Member {
	type: string
	ref: string
	role: string

	constructor(options: any = {}) {
		this.type = options.type
		this.ref = options.ref
		this.role = options.role
	}

	static fromXML(xml: any) {
		const options: any = {
			role: ''
		}
		// OSM Info
		for (let i = 0; i < xml.attributes.length; i++) {
			const attr = xml.attributes[i]
			options[attr.name] = attr.value
		}

		return new Member(options)
	}
}
