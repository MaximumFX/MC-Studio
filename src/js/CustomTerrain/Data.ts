import WorldGen from "@/js/CustomTerrain/WorldGen/WorldGen";
import Dimension from "@/js/CustomTerrain/Dimension/Dimension";
// @ts-ignore
import DimensionType from "@/js/CustomTerrain/Dimension/DimensionType";

interface Options {
	dimension: Dimension[]
	dimension_type: DimensionType[]
	worldgen: WorldGen
	tags: string[]
}

export default class Data {
	namespace: string
	dimension: Dimension[]
	dimension_type: DimensionType[]
	worldgen: WorldGen
	tags: string[]
	constructor(namespace = 'minecraft', options: Options) {
		this.namespace = namespace
		this.dimension = options.dimension ?? []
		this.dimension_type = options.dimension_type ?? []
		this.worldgen = options.worldgen ?? new WorldGen()
		this.tags = options.tags
	}
}