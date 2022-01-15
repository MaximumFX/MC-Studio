import {v4 as uuidv4} from 'uuid';
import CTFile, {CTFileJSON} from "@/js/CustomTerrain/CTFile";
import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum";

export interface NamespaceJSON {
    id: string
    name: string,
    data: {
        dimension: CTFileJSON[]
        dimension_type: CTFileJSON[]
        worldgen: {
            biome: CTFileJSON[]
            configured_carver: CTFileJSON[]
            configured_feature: CTFileJSON[]
            configured_structure_feature: CTFileJSON[]
            placed_feature: CTFileJSON[]
            noise: CTFileJSON[]
            noise_settings: CTFileJSON[]
            processor_list: CTFileJSON[]
            template_pool: CTFileJSON[]
        }
    }
}

interface NamespaceInterface {
    dimension: CTFile[]
    dimension_type: CTFile[]
    worldgen: {
        biome: CTFile[]
        configured_carver: CTFile[]
        configured_feature: CTFile[]
        configured_structure_feature: CTFile[]
        placed_feature: CTFile[]
        noise: CTFile[]
        noise_settings: CTFile[]
        processor_list: CTFile[]
        template_pool: CTFile[]
    }
}
const dataDefault = {
    dimension: [],
    dimension_type: [],
    worldgen: {
        biome: [],
        configured_carver: [],
        configured_feature: [],
        configured_structure_feature: [],
        placed_feature: [],
        noise: [],
        noise_settings: [],
        processor_list: [],
        template_pool: []
    }
}

export default class Namespace {
    id: string
    name: string
    data: NamespaceInterface
    constructor(name = 'unnamed', data: NamespaceInterface = dataDefault, id = uuidv4()) {
        this.id = id
        this.name = name
        this.data = data
    }

    static fromJSON = (packId: string, json: NamespaceJSON) => {
        const data = {
            dimension: json.data.dimension.map(a => new CTFile(packId, json.id, a, CTFileType.Dimension)),
            dimension_type: json.data.dimension_type.map(a => new CTFile(packId, json.id, a, CTFileType.DimensionType)),
            worldgen: {
                biome: json.data.worldgen.biome.map(a => new CTFile(packId, json.id, a, CTFileType.Biome)),
                configured_carver: json.data.worldgen.configured_carver.map(a => new CTFile(packId, json.id, a, CTFileType.ConfiguredCarver)),
                configured_feature: json.data.worldgen.configured_feature.map(a => new CTFile(packId, json.id, a, CTFileType.ConfiguredFeature)),
                configured_structure_feature: json.data.worldgen.configured_structure_feature.map(a => new CTFile(packId, json.id, a, CTFileType.ConfiguredStructureFeature)),
                placed_feature: json.data.worldgen.placed_feature.map(a => new CTFile(packId, json.id, a, CTFileType.PlacedFeature)),
                noise: json.data.worldgen.noise.map(a => new CTFile(packId, json.id, a, CTFileType.Noise)),
                noise_settings: json.data.worldgen.noise_settings.map(a => new CTFile(packId, json.id, a, CTFileType.NoiseSettings)),
                processor_list: json.data.worldgen.processor_list.map(a => new CTFile(packId, json.id, a, CTFileType.ProcessorList)),
                template_pool: json.data.worldgen.template_pool.map(a => new CTFile(packId, json.id, a, CTFileType.TemplatePool))
            }
        }
        return new Namespace(json.name, data, json.id)
    }

    getFile = (uuid: string) => {
        const sum = [
            ...this.data.dimension,
            ...this.data.dimension_type,
            ...this.data.worldgen.biome,
            ...this.data.worldgen.configured_carver,
            ...this.data.worldgen.configured_feature,
            ...this.data.worldgen.configured_structure_feature,
            ...this.data.worldgen.placed_feature,
            ...this.data.worldgen.noise,
            ...this.data.worldgen.noise_settings,
            ...this.data.worldgen.processor_list,
            ...this.data.worldgen.template_pool,
        ]
        return sum.find(a => a.uuid === uuid)
    }
}
