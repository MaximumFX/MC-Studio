import OSM from "@/js/OSM/OSM";

export default class Way {
	nodes

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

	setNodes = nodes => {
		this.nodes = nodes
	}

	static fromXML(xml) {
		const options = {
			refs: [],
			tags: OSM.getTagsObj(xml.getElementsByTagName('tag'))
		}
		const nd = xml.getElementsByTagName('nd')
		for (let i = 0; i < nd.length; i++) {
			options.refs.push(nd[i].getAttribute('ref'))
		}
		// OSM Info
		for (let i = 0; i < xml.attributes.length; i++) {
			const attr = xml.attributes[i]
			options[attr.name] = attr.value
		}
		// [...xml.attributes].forEach(attr => options[attr.name] = attr.value)
		return new Way(options)
	}
}
