import IntProvider from "@/js/CustomTerrain/Helpers/IntProvider";
import FloatProvider from "@/js/CustomTerrain/Helpers/FloatProvider";
import {Decorator} from "@/js/CustomTerrain/WorldGen/Decorators";
import Block from "@/js/CustomTerrain/Helpers/Block";
import {BlockPlacer} from "@/js/CustomTerrain/WorldGen/Placers";
import BlockStateProvider from "@/js/CustomTerrain/Helpers/BlockStateProvider";
import {FeatureType} from "@/js/CustomTerrain/Helpers/Enum";
import Validation, {Choice} from "@/js/CustomTerrain/Validation";
import MinecraftData from "@/js/CustomTerrain/Helpers/MinecraftData";

export interface FeatureJSON {
	type: string
	config: object
}

export class Feature {
	type: string
	constructor(type: string) {
		this.type = type
	}

	static getFeature(json: FeatureJSON) {
		if (!json.type.includes(':')) json.type = 'minecraft:' + json.type

		if (json.type === 'minecraft:bamboo') {
			return new Bamboo(json.config)
		}
		else if (json.type === 'minecraft:basalt_columns') {
			return new BasaltColumns(json.config)
		}
		else if (json.type === 'minecraft:block_column') {
			return new BlockColumn(json.config)
		}
		else if (json.type === 'minecraft:block_pile') {
			return new BlockPile(json.config)
		}
		else if (json.type === 'minecraft:delta_feature') {
			return new DeltaFeature(json.config)
		}
		else if (json.type === 'minecraft:disk') {
			return new Disk(json.config)
		}
		else if (json.type === 'minecraft:dripstone_cluster') {
			return new DripstoneCluster(json.config)
		}
		else if (json.type === 'minecraft:end_gateway') {
			return new EndGateway(json.config)
		}
		else if(json.type === 'minecraft:end_spike') {
			return new EndSpike(json.config)
		}
		else if (json.type === 'minecraft:flower') {
			return new Flower(json.config)
		}
		else if (json.type === 'minecraft:forest_rock') {
			return new ForestRock(json.config)
		}
		else if (json.type === 'minecraft:fossil') {
			return new Fossil(json.config)
		}
		else if (json.type === 'minecraft:geode') {
			return new Geode(json.config)
		}
		else if (json.type === 'minecraft:glow_lichen') {
			return new GlowLichen(json.config)
		}
		else if (json.type === 'minecraft:huge_brown_mushroom') {
			return new HugeBrownMushroom(json.config)
		}
		else if (json.type === 'minecraft:huge_fungus') {
			return new HugeFungus(json.config)
		}
		else if (json.type === 'minecraft:huge_red_mushroom') {
			return new HugeRedMushroom(json.config)
		}
		else if (json.type === 'minecraft:ice_patch') {
			return new IcePatch(json.config)
		}
		else if (json.type === 'minecraft:iceberg') {
			return new Iceberg(json.config)
		}
		else if (json.type === 'minecraft:lake') {
			return new Lake(json.config)
		}
		else if (json.type === 'minecraft:large_dripstone') {
			return new LargeDripstone(json.config)
		}
		else if (json.type === 'minecraft:nether_forest_vegetation') {
			return new NetherForestVegetation(json.config)
		}
		else if (json.type === 'minecraft:netherrack_replace_blobs') {
			return new NetherrackReplaceBlobs(json.config)
		}
		else if (json.type === 'minecraft:ore') {
			return new Ore(json.config)
		}
		else if (json.type === 'minecraft:random_boolean_selector') {
			return new RandomBooleanSelector(json.config)
		}
		else if (json.type === 'minecraft:random_patch') {
			return new RandomPatch(json.config)
		}
		else if (json.type === 'minecraft:random_selector') {
			return new RandomSelector(json.config)
		}
		else if (json.type === 'minecraft:root_system') {
			return new RootSystem(json.config)
		}
		else if (json.type === 'minecraft:scattered_ore') {
			return new ScatteredOre(json.config)
		}
		else if (json.type === 'minecraft:sea_pickle') {
			return new SeaPickle(json.config)
		}
		else if (json.type === 'minecraft:seagrass') {
			return new Seagrass(json.config)
		}
		else if (json.type === 'minecraft:simple_block') {
			return new SimpleBlock(json.config)
		}
		else if (json.type === 'minecraft:simple_random_selector') {
			return new SimpleRandomSelector(json.config)
		}
		else if (json.type === 'minecraft:spring_feature') {
			return new SpringFeature(json.config)
		}
		else if (json.type === 'minecraft:tree') {
			return new Tree(json.config)
		}
		else if (json.type === 'minecraft:twisting_vines') {
			return new TwistingVines(json.config)
		}
		else if (json.type === 'minecraft:underwater_magma') {
			return new UnderwaterMagma(json.config)
		}
		else if (json.type === 'minecraft:vegetation_patch') {
			return new VegetationPatch(json.config)
		}
		else if (json.type === 'minecraft:waterlogged_vegetation_patch') {
			return new WaterloggedVegetationPatch(json.config)
		}
		else if (![
			'minecraft:basalt_pillar', 'minecraft:blue_ice', 'minecraft:bonus_chest', 'minecraft:chorus_plant',
			'minecraft:desert_well', 'minecraft:end_island', 'minecraft:freeze_top_layer', 'minecraft:glowstone_blob',
			'minecraft:ice_spike', 'minecraft:kelp', 'minecraft:monster_room', 'minecraft:vines', 'minecraft:void_start_platform',
			'minecraft:weeping_vines'
		].includes(json.type)) console.error('Undefined ConfiguredFeature type:', json)
		return new Feature('minecraft:undefined')
	}

	static getStructure = () => ([
		new Choice(FeatureType.BAMBOO, 'Bamboo', {probability: Validation.float()}),
		new Choice(FeatureType.BASALT_COLUMNS, 'Basalt columns', {
			reach: Validation.intProvider(false, true, 0, 3),
			height: Validation.intProvider(false, true, 1, 10),
		}),
		new Choice(FeatureType.BLOCK_COLUMN, 'Block column', {//todo block column
			reach: Validation.intProvider(false, true, 0, 3),
			height: Validation.intProvider(false, true, 1, 10),
		}),
		new Choice(FeatureType.BLOCK_PILE, 'Block pile', {
			height: Validation.object(false, BlockStateProvider.getStructure(), Validation.select(false, MinecraftData.Structures)),
		}),
	])
}

interface BlockTargets {
	target: any
	block: Block
}

export class Bamboo extends Feature {
	probability: number
	constructor(json: any) {
		super('minecraft:bamboo')
		this.probability = json.probability
	}
}
export class BasaltColumns extends Feature {
	reach: IntProvider | number
	height: IntProvider | number
	constructor(json: any) {
		super('minecraft:basalt_columns')
		this.reach = IntProvider.getOrInt(json.reach)//between 0 and 3
		this.height = IntProvider.getOrInt(json.height)//between 1 and 10
	}
}
export class BlockColumn extends Feature {//todo
	constructor(json: any) {
		super('minecraft:block_column')
	}
}
export class BlockPile extends Feature {
	height: BlockStateProvider
	constructor(json: any) {
		super('minecraft:block_pile')
		this.height = new BlockStateProvider(json.height)
	}
}
export class Decorated extends Feature {
	decorator: Decorator
	feature: Feature
	constructor(json: any) {
		super('minecraft:decorated')
		this.decorator = Decorator.getDecorator(json.decorator)
		this.feature = Feature.getFeature(json.feature)
	}
}
export class DeltaFeature extends Feature {
	contents: Block
	rim: Block
	size: IntProvider | number
	rim_size: IntProvider | number
	constructor(json: any) {
		super('minecraft:delta_feature')
		this.contents = new Block(json.contents)
		this.rim = new Block(json.rim)
		this.size = IntProvider.getOrInt(json.size)
		this.rim_size = IntProvider.getOrInt(json.rim_size)
	}
}
export class Disk extends Feature {
	state: Block
	radius: IntProvider | number
	half_height: number
	targets: Block[]
	constructor(json: any) {
		super(json.type)
		this.state = new Block(json.state)
		this.radius = IntProvider.getOrInt(json.radius)
		this.half_height = json.half_height
		this.targets = json.targets as Block[]
	}
}
export class DripstoneCluster extends Feature {//tddo
	floor_to_ceiling_search_range: any
	height: IntProvider | number
	radius: IntProvider | number
	max_stalagmite_stalactite_height_diff: any
	height_deviation: any
	dripstone_block_layer_thickness: IntProvider | number
	density: FloatProvider | number
	wetness: FloatProvider | number
	chance_of_dripstone_column_at_max_distance_from_center: any
	max_distance_from_edge_affecting_chance_of_dripstone_column: any
	max_distance_from_center_affecting_height_bias: any

	constructor(json: any) {
		super('minecraft:dripstone_cluster')
		this.floor_to_ceiling_search_range = json.floor_to_ceiling_search_range
		this.height = IntProvider.getOrInt(json.height)
		this.radius = IntProvider.getOrInt(json.radius)
		this.max_stalagmite_stalactite_height_diff = json.max_stalagmite_stalactite_height_diff
		this.height_deviation = json.height_deviation
		this.dripstone_block_layer_thickness = IntProvider.getOrInt(json.dripstone_block_layer_thickness)
		this.density = FloatProvider.getOrFloat(json.density)
		this.wetness = FloatProvider.getOrFloat(json.wetness)
		this.chance_of_dripstone_column_at_max_distance_from_center = json.chance_of_dripstone_column_at_max_distance_from_center
		this.max_distance_from_edge_affecting_chance_of_dripstone_column = json.max_distance_from_edge_affecting_chance_of_dripstone_column
		this.max_distance_from_center_affecting_height_bias = json.max_distance_from_center_affecting_height_bias
	}
}
export class EndGateway extends Feature {//todo
	exact: any
	exit?: any
	constructor(json: any) {
		super('minecraft:end_gateway')
		this.exact = json.exact
		if (json.hasOwnProperty('exit'))
			this.exit = json.exit
	}
}
export class EndSpike extends Feature {//todo
	crystal_invulnerable?: any
	crystal_beam_target?: any
	spikes: any

	constructor(json: any) {
		super('minecraft:end_spike')
		if (json.hasOwnProperty('crystal_invulnerable'))
			this.crystal_invulnerable = json.crystal_invulnerable
		if (json.hasOwnProperty('crystal_beam_target'))
			this.crystal_beam_target = json.crystal_beam_target
		this.spikes = json.spikes
	}
}
export class FillLayer extends Feature {//todo
	state: Block
	height: any

	constructor(json: any) {
		super('minecraft:fill_layer')
		this.state = new Block(json.state)
		this.height = json.height
	}
}
export class RandomPatch extends Feature {
	can_replace?: boolean
	project?: boolean
	xspread?: number
	yspread?: number
	zspread?: number
	tries?: number
	state_provider: Block
	block_placer: BlockPlacer
	whitelist: Block[]
	blacklist: Block[]

	constructor(json: any) {
		super(json.type ?? 'minecraft:random_patch')
		if (json.hasOwnProperty('can_replace'))
			this.can_replace = json.can_replace ?? false
		if (json.hasOwnProperty('project'))
			this.project = json.project ?? true
		if (json.hasOwnProperty('xspread'))
			this.xspread = json.xspread ?? 7
		if (json.hasOwnProperty('yspread'))
			this.yspread = json.yspread ?? 3
		if (json.hasOwnProperty('zspread'))
			this.zspread = json.zspread ?? 7
		if (json.hasOwnProperty('tries'))
			this.tries = json.tries ?? 128
		this.state_provider = new Block(json.state_provider)
		this.block_placer = new BlockPlacer(json.block_placer)
		this.whitelist = json.whitelist as Block[]
		this.blacklist = json.blacklist as Block[]
	}
}
export class Flower extends RandomPatch {
	constructor(json: any) {
		super(json)
	}
}
export class ForestRock extends Feature {
	state: Block

	constructor(json: any) {
		super('minecraft:forest_rock')
		this.state = new Block(json.state)
	}
}
export class Fossil extends Feature {//todo
	fossil_structures: any
	overlay_structures: any
	fossil_processors: any
	overlay_processors: any
	max_empty_corners_allowed: any

	constructor(json: any) {
		super('minecraft:fossil')
		this.fossil_structures = json.fossil_structures
		this.overlay_structures = json.overlay_structures
		this.fossil_processors = json.fossil_processors
		this.overlay_processors = json.overlay_processors
		this.max_empty_corners_allowed = json.max_empty_corners_allowed
	}
}
export class Geode extends Feature {//todo
	blocks: {
		filling_provider: BlockStateProvider,
		inner_layer_provider: BlockStateProvider,
		alternate_inner_layer_provider: BlockStateProvider,
		middle_layer_provider: BlockStateProvider,
		outer_layer_provider: BlockStateProvider,
		inner_placements: Block[],
		cannot_replace: any,
		invalid_blocks: any
	}
	layers: {
		filling: number,
		inner_layer: number,
		middle_layer: number,
		outer_layer: number
	}
	crack: {
		generate_crack_chance: number,
		base_crack_size: number,
		crack_point_offset: number,
	}
	noise_multiplier: number
	use_potential_placements_chance: number
	use_alternate_layer0_chance: number
	placements_require_layer0_alternate: boolean
	outer_wall_distance: IntProvider | number
	distribution_points: IntProvider | number
	point_offset: IntProvider | number
	min_gen_offset: number
	max_gen_offset: number

	constructor(json: any) {
		super('minecraft:geode')
		this.blocks = {
			filling_provider: new BlockStateProvider(json.blocks.filling_provider),
			inner_layer_provider: new BlockStateProvider(json.blocks.inner_layer_provider),
			alternate_inner_layer_provider: new BlockStateProvider(json.blocks.alternate_inner_layer_provider),
			middle_layer_provider: new BlockStateProvider(json.blocks.middle_layer_provider),
			outer_layer_provider: new BlockStateProvider(json.blocks.outer_layer_provider),
			inner_placements: json.blocks.inner_placements as Block[],
			cannot_replace: json.blocks.cannot_replace,
			invalid_blocks: json.blocks.invalid_blocks,
		}
		this.layers = {
			filling: json.layers.filling ?? 1.7,
			inner_layer: json.layers.inner_layer ?? 2.2,
			middle_layer: json.layers.middle_layer ?? 3.2,
			outer_layer: json.layers.outer_layer ?? 4.2,
		}
		this.crack = {
			generate_crack_chance: json.crack.generate_crack_chance ?? 1,
			base_crack_size: json.crack.base_crack_size ?? 2,
			crack_point_offset: json.crack.crack_point_offset ?? 2,
		}
		this.noise_multiplier = json.noise_multiplier ?? 0.05
		this.use_potential_placements_chance = json.use_potential_placements_chance ?? 0.35
		this.use_alternate_layer0_chance = json.use_alternate_layer0_chance ?? 0.35
		this.placements_require_layer0_alternate = json.placements_require_layer0_alternate ?? true

		if (json.hasOwnProperty('outer_wall_distance'))
			this.outer_wall_distance = IntProvider.getOrInt(json.outer_wall_distance)
		else this.outer_wall_distance = IntProvider.uniform(4, 5)

		if (json.hasOwnProperty('distribution_points'))
			this.distribution_points = IntProvider.getOrInt(json.distribution_points)
		else this.distribution_points = IntProvider.uniform(3, 4)

		if (json.hasOwnProperty('point_offset'))
			this.point_offset = IntProvider.getOrInt(json.point_offset)
		else this.point_offset = IntProvider.uniform(1, 2)

		this.min_gen_offset = json.min_gen_offset ?? -16
		this.max_gen_offset = json.max_gen_offset ?? 16
	}
}
export class GlowLichen extends Feature {
	search_range: number
	chance_of_spreading: number
	can_place_on_floor: boolean
	can_place_on_ceiling: boolean
	can_place_on_wall: boolean
	can_be_placed_on: Block[]

	constructor(json: any) {
		super('minecraft:glow_lichen')
		this.search_range = json.search_range ?? 10
		this.chance_of_spreading = json.chance_of_spreading ?? 0.5
		this.can_place_on_floor = json.can_place_on_floor ?? false
		this.can_place_on_ceiling = json.can_place_on_ceiling ?? false
		this.can_place_on_wall = json.can_place_on_wall ?? false
		this.can_be_placed_on = json.can_be_placed_on as Block[]
	}
}
export class GrowingPlant extends Feature {//todo
	direction: any
	allow_water: any
	height_distribution: {
		weight: any,
		data: IntProvider | number
	}[]
	body_provider: BlockStateProvider
	head_provider: BlockStateProvider

	constructor(json: any) {
		super('minecraft:growing_plant')
		this.direction = json.direction
		this.allow_water = json.allow_water
		this.height_distribution = json.height_distribution.map((h: any) => ({
			weight: h.weight,
			data: IntProvider.getOrInt(h.data)
		}))
		this.body_provider = new BlockStateProvider(json.body_provider)
		this.head_provider = new BlockStateProvider(json.head_provider)
	}
}
export class HugeBrownMushroom extends Feature {
	cap_provider: BlockStateProvider
	stem_provider: BlockStateProvider
	foliage_radius: number

	constructor(json: any) {
		super(json.type ?? 'minecraft:huge_brown_mushroom')
		this.cap_provider = new BlockStateProvider(json.cap_provider)
		this.stem_provider = new BlockStateProvider(json.stem_provider)
		this.foliage_radius = json.foliage_radius ?? 2
	}
}
export class HugeFungus extends Feature {
	hat_state: Block
	decor_state: Block
	stem_provider: Block
	valid_base_block: Block
	planted: boolean

	constructor(json: any) {
		super('minecraft:huge_fungus')
		this.hat_state = new Block(json.hat_state)
		this.decor_state = new Block(json.decor_state)
		this.stem_provider = new Block(json.stem_provider)
		this.valid_base_block = new Block(json.valid_base_block)
		this.planted = json.planted ?? false
	}
}
export class HugeRedMushroom extends HugeBrownMushroom {
	constructor(json: any) {
		super(json)
	}
}
export class IcePatch extends Disk {
	constructor(json: any) {
		super(json)
	}
}
export class Iceberg extends Feature {
	state: Block

	constructor(json: any) {
		super('minecraft:iceberg')
		this.state = new Block(json.state)
	}
}
export class Lake extends Feature {
	state: Block

	constructor(json: any) {
		super('minecraft:lake')
		this.state = new Block(json.state)
	}
}
export class LargeDripstone extends Feature {//TODO
	floor_to_ceiling_search_range: number
	column_radius: IntProvider | number
	height_scale: FloatProvider | number
	max_column_radius_to_cave_height_ratio: any
	stalactite_bluntness: FloatProvider | number
	stalagmite_bluntness: FloatProvider | number
	wind_speed: FloatProvider | number
	min_radius_for_wind: any
	min_bluntness_for_wind: any


	constructor(json: any) {
		super('minecraft:large_dripstone')
		this.floor_to_ceiling_search_range = json.floor_to_ceiling_search_range ?? 30
		this.column_radius = IntProvider.getOrInt(json.column_radius)
		this.height_scale = FloatProvider.getOrFloat(json.height_scale)
		this.max_column_radius_to_cave_height_ratio = json.max_column_radius_to_cave_height_ratio
		this.stalactite_bluntness = FloatProvider.getOrFloat(json.stalactite_bluntness)
		this.stalagmite_bluntness = FloatProvider.getOrFloat(json.stalagmite_bluntness)
		this.wind_speed = FloatProvider.getOrFloat(json.wind_speed)
		this.min_radius_for_wind = json.min_radius_for_wind
		this.min_bluntness_for_wind = json.min_bluntness_for_wind
	}
}
export class NetherForestVegetation extends Feature {
	state_provider: BlockStateProvider

	constructor(json: any) {
		super('minecraft:nether_forest_vegetation')
		this.state_provider = new BlockStateProvider(json.state_provider)
	}
}
export class NetherrackReplaceBlobs extends Feature {
	state: Block
	target: Block
	radius: IntProvider | number

	constructor(json: any) {
		super('minecraft:netherrack_replace_blobs')
		this.state = new Block(json.state)
		this.target = new Block(json.target)
		this.radius = IntProvider.getOrInt(json.radius)
	}
}
export class NoBonemealFlower extends RandomPatch {
	constructor(json: any) {
		super(json)
	}
}
export class NoOp extends Feature {
	constructor() {
		super('')
	}
}
export class Ore extends Feature {//todo
	size: number
	discard_chance_on_air_exposure: any
	targets: BlockTargets[]

	constructor(json: any) {
		super(json.type ?? 'minecraft:ore')
		this.size = json.size
		this.discard_chance_on_air_exposure = json.discard_chance_on_air_exposure
		this.targets = json.targets.map((t: any) => ({
			target: t.target,//TODO Rule test
			state: new Block(t.state)
		}))
	}
}
export class RandomBooleanSelector extends Feature {//todo
	feature_false: any
	feature_true: any

	constructor(json: any) {
		super('minecraft:random_boolean_selector')
		this.feature_false = json.feature_false
		this.feature_true = json.feature_true
	}
}
export class RandomSelector extends Feature {//todo
	features: any
	default: any

	constructor(json: any) {
		super('minecraft:random_selector')
		this.features = json.features
		this.default = json.default
	}
}
export class ReplaceSingleBlock extends Feature {
	targets: BlockTargets[]

	constructor(json: any) {
		super('minecraft:replace_single_block')
		this.targets = json.targets.map((t: any) => ({
			target: t.target,
			state: new Block(t.state)
		}))
	}
}
export class RootSystem extends Feature {//todo
	required_vertical_space_for_tree: any
	root_radius: any
	root_placement_attempts: any
	root_column_max_height: any
	hanging_root_radius: any
	hanging_roots_vertical_span: any
	hanging_root_placement_attempts: any
	allowed_vertical_water_for_tree: any
	root_replaceable: any
	root_state_provider: BlockStateProvider
	hanging_root_state_provider: BlockStateProvider
	feature: any

	constructor(json: any) {
		super('minecraft:root_system')
		this.required_vertical_space_for_tree = json.required_vertical_space_for_tree
		this.root_radius = json.root_radius
		this.root_placement_attempts = json.root_placement_attempts
		this.root_column_max_height = json.root_column_max_height
		this.hanging_root_radius = json.hanging_root_radius
		this.hanging_roots_vertical_span = json.hanging_roots_vertical_span
		this.hanging_root_placement_attempts = json.hanging_root_placement_attempts
		this.allowed_vertical_water_for_tree = json.allowed_vertical_water_for_tree
		this.root_replaceable = json.root_replaceable
		this.root_state_provider = new BlockStateProvider(json.root_state_provider)
		this.hanging_root_state_provider = new BlockStateProvider(json.hanging_root_state_provider)
		this.feature = json.feature
	}
}
export class ScatteredOre extends Ore {
	constructor(json: any) {
		super(json)
	}
}
export class SeaPickle extends Feature {
	count: IntProvider | number

	constructor(json: any) {
		super('minecraft:sea_pickle')
		this.count = IntProvider.getOrInt(json.count)
	}
}
export class Seagrass extends Feature {//todo
	probability: any

	constructor(json: any) {
		super('minecraft:seagrass')
		this.probability = json.probability
	}
}
export class SimpleBlock extends Feature {
	to_place: BlockStateProvider
	place_on: Block[]
	place_in: Block[]
	place_under: Block[]

	constructor(json: any) {
		super('minecraft:simple_block')
		this.to_place = new BlockStateProvider(json.to_place)
		this.place_on = json.place_on as Block[]
		this.place_in = json.place_in as Block[]
		this.place_under = json.place_under as Block[]
	}
}
export class SimpleRandomSelector extends Feature {//todo
	features: any

	constructor(json: any) {
		super('minecraft:simple_random_selector')
		this.features = json.features
	}
}
export class SmallDripstone extends Feature {
	max_placements: number
	empty_space_search_radius: number
	max_offset_from_origin: number
	chance_of_taller_dripstone: number

	constructor(json: any) {
		super('minecraft:small_dripstone')
		this.max_placements = json.max_placements ?? 5
		this.empty_space_search_radius = json.empty_space_search_radius ?? 10
		this.max_offset_from_origin = json.max_offset_from_origin ?? 2
		this.chance_of_taller_dripstone = json.chance_of_taller_dripstone ?? 0.2
	}
}
export class SpringFeature extends Feature {//todo
	state: Block
	rock_count: number
	hole_count: number
	requires_block_below: boolean
	valid_blocks: any

	constructor(json: any) {
		super('minecraft:spring_feature')
		this.state = new Block(json.state)
		this.rock_count = json.rock_count ?? 4
		this.hole_count = json.hole_count ?? 1
		this.requires_block_below = json.requires_block_below ?? true
		this.valid_blocks = json.valid_blocks
	}
}

interface TreeMinimumSize {
	type: string
	min_clipped_height?: number
	limit?: number
	lower_size?: number
	upper_size?: number
	upper_limit?: number
	middle_size?: number
}
interface TreeFoliagePlacer {
	type: string
	height?: IntProvider | number
	radius?: IntProvider | number
	offset?: IntProvider | number
	trunk_height?: IntProvider | number
	crown_height?: IntProvider | number
	foliage_height?: IntProvider | number
	leaf_placement_attempts?: number
}
export class Tree extends Feature {
	ignore_vines: boolean
	force_dirt: boolean
	minimum_size: TreeMinimumSize
	dirt_provider: BlockStateProvider
	sapling_provider: BlockStateProvider
	trunk_provider: BlockStateProvider
	foliage_provider: BlockStateProvider
	trunk_placer: {
		type: any,
		base_height: any,
		height_rand_a: any,
		height_rand_b: any,
		bend_length?: IntProvider | number
		min_height_for_leaves?: number
	}
	foliage_placer: TreeFoliagePlacer
	decorators: any[]

	constructor(json: any) {
		super('minecraft:tree')
		this.ignore_vines = json.ignore_vines ?? false
		this.force_dirt = json.force_dirt ?? false

		this.minimum_size = { type: json.minimum_size.type }
		if (json.minimum_size.hasOwnProperty('min_clipped_height'))
			this.minimum_size.min_clipped_height = json.minimum_size.min_clipped_height

		if (json.minimum_size.type === 'minecraft:two_layers_feature_size') {
			this.minimum_size.limit = json.minimum_size.limit ?? 1
			this.minimum_size.lower_size = json.minimum_size.lower_size ?? 0
			this.minimum_size.upper_size = json.minimum_size.upper_size ?? 1
		}
		else if (json.minimum_size.type === 'minecraft:three_layers_feature_size') {
			this.minimum_size.limit = json.minimum_size.limit ?? 1
			this.minimum_size.upper_limit = json.minimum_size.upper_limit ?? 1
			this.minimum_size.lower_size = json.minimum_size.lower_size ?? 0
			this.minimum_size.middle_size = json.minimum_size.middle_size ?? 1
			this.minimum_size.upper_size = json.minimum_size.upper_size ?? 1
		}
		else console.error('Wrong minimum_size type for Tree feature', this.minimum_size.type)

		this.dirt_provider = new BlockStateProvider(json.dirt_provider)
		this.sapling_provider = new BlockStateProvider(json.sapling_provider)
		this.trunk_provider = new BlockStateProvider(json.trunk_provider)
		this.foliage_provider = new BlockStateProvider(json.foliage_provider)

		this.trunk_placer = {
			type: json.trunk_placer.type,
			base_height: json.trunk_placer.base_height,
			height_rand_a: json.trunk_placer.height_rand_a,
			height_rand_b: json.trunk_placer.height_rand_b,
		}
		if (this.trunk_placer.type === 'bending_trunk_placer') {
			this.trunk_placer.bend_length = IntProvider.getOrInt(json.bend_length)
			this.trunk_placer.min_height_for_leaves = json.trunk_placer.min_height_for_leaves ?? 1
		}

		this.foliage_placer = {type: json.foliage_placer.type,}
		if (['blob_foliage_placer','bush_foliage_placer','fancy_foliage_placer','jungle_foliage_placer'].includes(this.foliage_placer.type)) {
			this.foliage_placer.height = json.foliage_placer.height
			this.foliage_placer.radius = json.foliage_placer.radius
			this.foliage_placer.offset = json.foliage_placer.offset
		}
		if (this.foliage_placer.type === 'spruce_foliage_placer') {
			this.foliage_placer.trunk_height = IntProvider.getOrInt(json.foliage_placer.trunk_height)
		}
		if (this.foliage_placer.type === 'pine_foliage_placer') {
			this.foliage_placer.height = IntProvider.getOrInt(json.foliage_placer.height)
		}
		if (this.foliage_placer.type === 'mega_pine_foliage_placer') {
			this.foliage_placer.crown_height = IntProvider.getOrInt(json.foliage_placer.crown_height)
		}
		if (this.foliage_placer.type === 'random_spread_foliage_placer') {
			this.foliage_placer.foliage_height = IntProvider.getOrInt(json.foliage_placer.foliage_height)
			this.foliage_placer.leaf_placement_attempts = json.foliage_placer.leaf_placement_attempts
		}

		this.decorators = json.decorators.map((d: any) => {//todo
			if (d.type === 'alter_ground')
				d.provider = new BlockStateProvider(d.provider)
			return d
		})
	}
}
export class UnderwaterMagma extends Feature {//todo
	floor_search_range: any
	placement_radius_around_floor: any
	placement_probability_per_valid_position: any

	constructor(json: any) {
		super('minecraft:underwater_magma')
		this.floor_search_range = json.floor_search_range
		this.placement_radius_around_floor = json.placement_radius_around_floor
		this.placement_probability_per_valid_position = json.placement_probability_per_valid_position
	}
}
export class VegetationPatch extends Feature {//todo
	surface: any
	depth: IntProvider | number
	vertical_range: any
	extra_bottom_block_chance: any
	extra_edge_column_chance: any
	vegetation_chance: any
	xz_radius: IntProvider | number
	replaceable: any
	ground_state: BlockStateProvider

	constructor(json: any) {
		super(json.type ?? 'minecraft:vegetation_patch')
		this.surface = json.surface
		this.depth = IntProvider.getOrInt(json.depth)
		this.vertical_range = json.vertical_range
		this.extra_bottom_block_chance = json.extra_bottom_block_chance
		this.extra_edge_column_chance = json.extra_edge_column_chance
		this.vegetation_chance = json.vegetation_chance
		this.xz_radius = IntProvider.getOrInt(json.xz_radius)
		this.replaceable = json.replaceable
		this.ground_state = new BlockStateProvider(json.ground_state)
	}
}
export class WaterloggedVegetationPatch extends VegetationPatch {
	constructor(json: any) {
		super(json)
	}
}
