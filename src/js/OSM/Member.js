export default class Member {
	constructor(options = {}) {
		this.type = options.type
		this.ref = options.ref
		this.role = options.role
	}

	static fromXML(xml) {
		const options = {role:''};
		// OSM Info
		[...xml.attributes].forEach(attr => options[attr.name] = attr.value);

		return new Member(options)
	}
}