import Member from "@/js/OSM/Member";
import OSM from "@/js/OSM/OSM";

export default class Relation {
	constructor(options = {}) {
		this.id = options.id
		this.user = options.user
		this.uid = options.uid
		this.visible = options.visible
		this.version = options.version
		this.changeset = options.changeset
		this.timestamp = options.timestamp

		this.members = options.members
		this.tags = options.tags
	}

	static fromXML(xml) {
		const options = {
			members: [...xml.getElementsByTagName('member')].map(node => Member.fromXML(node)),
			tags: OSM.getTagsObj(xml.getElementsByTagName('tag')),
		};
		// OSM Info
		[...xml.attributes].forEach(attr => options[attr.name] = attr.value);

		return new Relation(options)
	}
}