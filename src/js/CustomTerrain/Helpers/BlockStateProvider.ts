import Block, {BlockInterface} from "@/js/CustomTerrain/Helpers/Block";
import {BlockStateProviderType} from "@/js/CustomTerrain/Helpers/Enum";

interface BlockStateProviderInterface {
	type: BlockStateProviderType
	state: BlockInterface | undefined
	entries: {
		data: object,
		weight: number
	}[] | undefined;
}

export default class BlockStateProvider {
	type: BlockStateProviderType
	state: Block | undefined
	entries: WeightedStateProvider[] | undefined;

	constructor(json: BlockStateProviderInterface) {
		this.type = json.type

		if ((this.type === BlockStateProviderType.SIMPLE_STATE || this.type === BlockStateProviderType.ROTATED_BLOCK) && json.state) {
			this.state = new Block(json.state)
		}
		else if (this.type === BlockStateProviderType.WEIGHTED_STATE && json.entries) {
			this.entries = json.entries.map(e => new WeightedStateProvider(new Block(e.data as BlockInterface), e.weight))//todo
		}
	}
}

class WeightedStateProvider {
	data: Block
	weight: number

	constructor(data: Block, weight: number) {
		this.data = data
		this.weight = weight
	}
}