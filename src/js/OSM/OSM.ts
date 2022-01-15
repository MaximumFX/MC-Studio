import Relation from "@/js/OSM/Relation";
import Way from "@/js/OSM/Way";
import OSMNode from "@/js/OSM/Node";
import { DOMParser as Parser } from "xmldom";

interface OSMOptions {
	version: string
	generator: string
	copyright: string
	attribution: string
	license: string

	bounds: {
		minlat: string
		maxlat: string
		minlon: string
		maxlon: string
	}

	nodes: OSMNode[]
	ways: Way[]
	relations: Relation[]
}

export default class OSM {
	attribution: string
	bounds: {
		minlat: number
		maxlat: number
		minlon: number
		maxlon: number
	}
	copyright: string
	generator: string
	license: string
	nodes: OSMNode[]
	relations: Relation[]
	version: string
	ways: Way[]

	constructor(options: OSMOptions) {
		this.version = options.version
		this.generator = options.generator
		this.copyright = options.copyright
		this.attribution = options.attribution
		this.license = options.license

		this.bounds = {
			minlat: parseFloat(options.bounds.minlat),
			maxlat: parseFloat(options.bounds.maxlat),
			minlon: parseFloat(options.bounds.minlon),
			maxlon: parseFloat(options.bounds.maxlon)
		}

		this.nodes = options.nodes ?? []
		this.ways = options.ways ?? []
		this.relations = options.relations ?? []
	}

	// Create OSM from exported .osm (xml) file
	static fromString(string: string) {
		const parser = new Parser()
		const xml = parser.parseFromString(string, "application/xml")

		const nodes: OSMNode[] = [], ways: Way[] = [], relations: Relation[] = []

		for (let i = 0; i < xml.getElementsByTagName('node').length; i++) {
			nodes.push(OSMNode.fromXML(xml.getElementsByTagName('node')[i]))
		}
		for (let i = 0; i < xml.getElementsByTagName('way').length; i++) {
			ways.push(Way.fromXML(xml.getElementsByTagName('way')[i]))
		}
		for (let i = 0; i < xml.getElementsByTagName('relation').length; i++) {
			relations.push(Relation.fromXML(xml.getElementsByTagName('relation')[i]))
		}

		const options: any = {
			bounds: {
				minlat: null, maxlat: null, minlon: null, maxlon: null
			},
			nodes, ways, relations
		}

		// OSM Info
		for (let i = 0; i < xml.getElementsByTagName('osm')[0].attributes.length; i++) {
			const attr = xml.getElementsByTagName('osm')[0].attributes[i]
			options[attr.name] = attr.value
		}
		// Bounds
		for (let i = 0; i < xml.getElementsByTagName('bounds')[0].attributes.length; i++) {
			const attr = xml.getElementsByTagName('bounds')[0].attributes[i]
			options.bounds[attr.name] = parseFloat(attr.value)
		}

		return new OSM(options)
	}

	// Create OSM from exported .osm (xml) file
	static fromXML(xml: XMLDocument) {
		const options: any = {
			bounds: {
				//@ts-ignore
				minlat: undefined, maxlat: undefined, minlon: undefined, maxlon: undefined
			},
			nodes: [...xml.getElementsByTagName('node')].map(node => OSMNode.fromXML(node)),
			ways: [...xml.getElementsByTagName('way')].map(node => Way.fromXML(node)),
			relations: [...xml.getElementsByTagName('relation')].map(node => Relation.fromXML(node)),
		}

		// OSM Info
		for (let i = 0; i < xml.getElementsByTagName('osm')[0].attributes.length; i++) {
			const attr = xml.getElementsByTagName('osm')[0].attributes[i]
			options[attr.name] = attr.value
		}
		// Bounds
		for (let i = 0; i < xml.getElementsByTagName('bounds')[0].attributes.length; i++) {
			const attr = xml.getElementsByTagName('bounds')[0].attributes[i]
			options.bounds[attr.name] = parseFloat(attr.value)
		}

		return new OSM(options)
	}

	getNode(id: string) {
		const node = this.nodes.find(node => node.id == id)
		if (!node) return null
		return node
	}

	getWay(id: string) {
		const way = this.ways.find(way => way.id == id)
		if (!way) return null
		// way.nodes = this.nodes.filter(node => way.refs.includes(node.id))
		const nodes = way.refs.map((ref: string) => this.nodes.find(a => ref == a.id))
		way.setNodes(nodes)
		return way
	}

	getRelation(id: string) {
		const relation = this.relations.find(relation => relation.id == id)
		if (!relation) return null
		return relation
	}

	// Helper functions
	static getTagsObj(tags: any) {
		const tmp = []
		for (let i = 0; i < tags.length; i++) {
			tmp.push(tags[i])
		}
		return [...tmp].reduce((obj, item) =>
			Object.assign(obj, { [item.getAttribute('k')]: item.getAttribute('v') }), {}
		)
	}
}
