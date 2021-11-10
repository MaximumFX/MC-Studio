import OSM from "@/js/OSM/OSM";

export default class OSMNode {
	constructor(options = {}) {
		this.id = options.id
		this.user = options.user
		this.uid = options.uid
		this.visible = options.visible
		this.version = options.version
		this.changeset = options.changeset
		this.timestamp = options.timestamp

		this.lat = options.lat
		this.lon = options.lon

		this.tags = options.tags
	}

	static fromXML(xml) {
		const options = {
			tags: OSM.getTagsObj(xml.getElementsByTagName('tag'))
		};
		// OSM Info
		[...xml.attributes].forEach(attr => options[attr.name] = attr.value);

		return new OSMNode(options)
	}
}