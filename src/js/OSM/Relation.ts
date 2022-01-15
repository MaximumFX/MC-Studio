import Member from "@/js/OSM/Member";
import OSM from "@/js/OSM/OSM";

export default class Relation {
	id: string
	user: string
	uid: string
	visible: string
	version: string
	changeset: string
	timestamp: string

	members: Member[]
	tags: any

	constructor(options: any = {}) {
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

	static fromXML(xml: any) {
		const options: any = {
			members: [],
			tags: OSM.getTagsObj(xml.getElementsByTagName('tag')),
		};
		const member = xml.getElementsByTagName('member')
		for (let i = 0; i < member.length; i++) {
			options.members.push(Member.fromXML(member[i]))
		}
		// OSM Info
		for (let i = 0; i < xml.attributes.length; i++) {
			const attr = xml.attributes[i]
			options[attr.name] = attr.value
		}
		return new Relation(options)
	}
}
