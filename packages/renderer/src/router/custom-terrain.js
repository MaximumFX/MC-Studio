import CustomTerrain from "@/views/CustomTerrain";
import CustomTerrainEditor from "@/views/CustomTerrainEditor";
import CTEHome from "@/views/CustomTerrainEditor/Home";
import CTENamespace from "@/views/CustomTerrainEditor/Namespace";
import CTEDimension from "@/views/CustomTerrainEditor/namespace/Dimension";
import CTEDimensionType from "@/views/CustomTerrainEditor/namespace/DimensionType";
import CTEBiome from "@/views/CustomTerrainEditor/namespace/worldgen/Biome";
import CTEConfiguredCarver from "@/views/CustomTerrainEditor/namespace/worldgen/ConfiguredCarver";
import CTEConfiguredFeature from "@/views/CustomTerrainEditor/namespace/worldgen/ConfiguredFeature";
import CTEConfiguredStructureFeature from "@/views/CustomTerrainEditor/namespace/worldgen/ConfiguredStructureFeature";
import CTEPlacedFeature from "@/views/CustomTerrainEditor/namespace/worldgen/PlacedFeature";
import CTENoise from "@/views/CustomTerrainEditor/namespace/worldgen/Noise";
import CTENoiseSetting from "@/views/CustomTerrainEditor/namespace/worldgen/NoiseSetting";
import CTEProcessorList from "@/views/CustomTerrainEditor/namespace/worldgen/ProcessorList";
import CTETemplatePool from "@/views/CustomTerrainEditor/namespace/worldgen/TemplatePool";

const customTerrainRouter = [
	{
		path: '/custom-terrain',
		name: 'Worldgen',
		component: CustomTerrain,
		meta: {
			page: 'custom-terrain'
		}
	},
	{
		path: '/custom-terrain/editor/:cteId',
		name: 'Worldgen Editor',
		component: CustomTerrainEditor,
		meta: {
			page: 'custom-terrain'
		},
		children: [
			{ path: '', name: 'Custom Terrain', component: CTEHome },
			{ path: ':namespace', name: 'CTENamespace', component: CTENamespace },

			{ path: ':namespace/dimension/:fileId', name: 'CTEDimension', component: CTEDimension },
			{ path: ':namespace/dimension-type/:fileId', name: 'CTEDimensionType', component: CTEDimensionType },
			{ path: ':namespace/biome/:fileId', name: 'CTEBiome', component: CTEBiome },
			{ path: ':namespace/carver/:fileId', name: 'CTEConfiguredCarver', component: CTEConfiguredCarver },
			{ path: ':namespace/feature/:fileId', name: 'CTEConfiguredFeature', component: CTEConfiguredFeature },
			{ path: ':namespace/structure-feature/:fileId', name: 'CTEConfiguredStructureFeature', component: CTEConfiguredStructureFeature },
			{ path: ':namespace/placed-feature/:fileId', name: 'CTEPlacedFeature', component: CTEPlacedFeature },
			{ path: ':namespace/noise/:fileId', name: 'CTENoise', component: CTENoise },
			{ path: ':namespace/noise-setting/:fileId', name: 'CTENoiseSetting', component: CTENoiseSetting },
			{ path: ':namespace/processor-list/:fileId', name: 'CTEProcessorList', component: CTEProcessorList },
			{ path: ':namespace/template-pool/:fileId', name: 'CTETemplatePool', component: CTETemplatePool },
		].map(a => (
			{
				...a,
				meta: {
					page: 'custom-terrain' + (a.path.endsWith(':fileId') ? '/file' : ''),
					name: a.name.replace('CTE', '')
				}
			}))
	},
]
export default customTerrainRouter
