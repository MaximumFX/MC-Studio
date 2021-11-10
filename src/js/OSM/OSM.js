import Relation from "@/js/OSM/Relation";
import Way from "@/js/OSM/Way";
import OSMNode from "@/js/OSM/Node";
import { DOMParser as Parser } from "xmldom";

export default class OSM {
	constructor(options = {bounds: [], nodes: [], ways: [], relations: []}) {
		this.version = options.version
		this.generator = options.generator
		this.copyright = options.copyright
		this.attribution = options.attribution
		this.license = options.license

		this.bounds = options.bounds

		this.nodes = options.nodes
		this.ways = options.ways
		this.relations = options.relations
	}

	// Create OSM from exported .osm (xml) file
	static fromString(string) {
		const parser = new Parser()
		const xml = parser.parseFromString(string, "application/xml")
		console.log(xml.getElementsByTagName('osm')[0].attributes)
		let nodes = [], ways = [], relations = []
		for (let i = 0; i < xml.getElementsByTagName('nodes').length; i++) {
			nodes.push(OSMNode.fromXML(xml.getElementsByTagName('nodes')[i]))
		}
		for (let i = 0; i < xml.getElementsByTagName('way').length; i++) {
			ways.push(Way.fromXML(xml.getElementsByTagName('way')[i]))
		}
		for (let i = 0; i < xml.getElementsByTagName('relation').length; i++) {
			relations.push(Relation.fromXML(xml.getElementsByTagName('relation')[i]))
		}
		const options = {
			bounds: {
				minlat: null, maxlat: null, minlon: null, maxlon: null
			},
			nodes, ways, relations
		};

		// OSM Info
		[...xml.firstChild.attributes].forEach(attr => options[attr.name] = attr.value);
		// Bounds
		[...xml.getElementsByTagName('bounds')[0].attributes].forEach(attr => options.bounds[attr.name] = attr.value);

		return new OSM(options)
	}

	// Create OSM from exported .osm (xml) file
	static fromXML(xml) {
		const options = {
			bounds: {
				minlat: null, maxlat: null, minlon: null, maxlon: null
			},
			nodes: [...xml.getElementsByTagName('node')].map(node => OSMNode.fromXML(node)),
			ways: [...xml.getElementsByTagName('way')].map(node => Way.fromXML(node)),
			relations: [...xml.getElementsByTagName('relation')].map(node => Relation.fromXML(node))
		};

		// OSM Info
		[...xml.firstChild.attributes].forEach(attr => options[attr.name] = attr.value);
		// Bounds
		[...xml.getElementsByTagName('bounds')[0].attributes].forEach(attr => options.bounds[attr.name] = attr.value);

		return new OSM(options)
	}

	getNode(id) {
		const node = this.nodes.find(node => node.id == id)
		if (!node) return null
		return node
	}

	getWay(id) {
		const way = this.ways.find(way => way.id == id)
		if (!way) return null
		// way.nodes = this.nodes.filter(node => way.refs.includes(node.id))
		way.nodes = way.refs.map(ref => this.nodes.find(a => ref == a.id))
		return way
	}

	getRelation(id) {
		const relation = this.relations.find(relation => relation.id == id)
		if (!relation) return null
		return relation
	}

	// Helper functions
	static getTagsObj(tags) {
		return [...tags].reduce(
			(obj, item) => Object.assign(obj, { [item.getAttribute('k')]: item.getAttribute('v') }), {})
	}
}