import OSM from "@/js/OSM/OSM";

export default class Way {
	constructor(options = {}) {
		this.id = options.id
		this.user = options.user
		this.uid = options.uid
		this.visible = options.visible
		this.version = options.version
		this.changeset = options.changeset
		this.timestamp = options.timestamp

		this.refs = options.refs
		this.tags = options.tags
	}

	static fromXML(xml) {
		const options = {
			refs: [...xml.getElementsByTagName('nd')].map(nd => nd.getAttribute('ref')),
			tags: OSM.getTagsObj(xml.getElementsByTagName('tag'))
		};
		// OSM Info
		[...xml.attributes].forEach(attr => options[attr.name] = attr.value);

		return new Way(options)
	}
}