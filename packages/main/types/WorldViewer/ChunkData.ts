import type Block from '@/minecraft/Block';
import type Section from '@/mcregion/Section';
import type { ChunkStatus } from '@/minecraft/ChunkStatus';

export interface MCSection {
	block_states: {
		palette: Block[]
		data?: bigint[]
	},
	biomes: {
		palette: string[]
		data?: bigint[]
	},
	Y: number

	SkyLight?: number[]
	BlockLight?: number[]
}

interface Chunk {
	Status: ChunkStatus,
	zPos: number,
	block_entities: any[],
	yPos: number,
	LastUpdate: bigint,
	structures: {
		References: object,
		starts: object
	},
	InhabitedTime: bigint,
	xPos: number,
	Heightmaps: {
		OCEAN_FLOOR: bigint[],
		MOTION_BLOCKING_NO_LEAVES: bigint[],
		MOTION_BLOCKING: bigint[],
		WORLD_SURFACE: bigint[],
	},

	isLightOn: number,
	block_ticks: any[],
	PostProcessing: {
		type: string,
		value: []
	}[]
	DataVersion: number,
	fluid_ticks: []
}

export interface MCChunkData extends Chunk {
	sections: MCSection[]
}
export interface ChunkData extends Chunk {
	sections: Section[]
}

export enum Heightmap {
	OCEAN_FLOOR = 'OCEAN_FLOOR',
	MOTION_BLOCKING_NO_LEAVES = 'MOTION_BLOCKING_NO_LEAVES',
	MOTION_BLOCKING = 'MOTION_BLOCKING',
	WORLD_SURFACE = 'WORLD_SURFACE',
}
