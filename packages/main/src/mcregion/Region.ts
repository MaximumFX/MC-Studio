import Chunk from './Chunk';

/**
 * Original by XadillaX created at 2014-12-23 17:46:27
 *
 * Copyright (c) 2014 XadillaX' Gensokyo, all rights
 * reserved
 */

const SECTOR_SIZE = 4096;
const TIMESTAMP_BASE_OFFSET = 4096;

export default class Region {
	private buffer: any
	readonly chunkInformation: any[]

	constructor(buffer: Buffer) {
		this.buffer = buffer
		this.chunkInformation = []

		// ## Chunk Location
		//
		// from 0 ~ 4095
		//
		// Location information for a chunk consists of four bytes split into two fields:
		// the first three bytes are a (big-endian) offset in 4KiB sectors from the start
		// of the file, and a remaining byte which gives the length of the chunk (also in
		// 4KiB sectors, rounded up). Chunks will always be less than 1MiB in size. If a
		// chunk isn't present in the region file (e.g. because it hasn't been generated
		// or migrated yet), both fields will be zero.
		//
		// | byte        | 0 | 1 | 2 | 3            |
		// |-------------|-----------|--------------|
		// | description | offset    | sector count |
		//
		// A chunk with an offset of 2 will begin right after the timestamps table.
		for (let i = 0; i < 4096; i += 4) {
			const sectorOffset = (this.buffer.readUInt8(i) << 16) +
				(this.buffer.readUInt8(i + 1) << 8) +
				this.buffer.readUInt8(i + 2)
			const sectorCount = this.buffer.readUInt8(i + 3)

			this.chunkInformation.push({sectorOffset: sectorOffset, sectorCount: sectorCount})
		}

		// ## Chunk Timestamps
		//
		// from 4096 ~ 8191
		//
		// The entries in the timestamp table are individual four-byte big-endian integers,
		// representing the last modification time of a chunk.
		//
		// | byte        | 0 | 1 | 2 | 3 |
		// |-------------|---------------|
		// | description | timestamp     |
		for (let x = 4096; x < 8192; x += 4) {
			const timestamp = this.buffer.readUInt32BE(x)
			const idx = (x - TIMESTAMP_BASE_OFFSET) / 4
			this.chunkInformation[idx].timestamp = timestamp
		}
	}

	/**
	 * get the chunk count
	 * @return {Number}
	 */
	chunkCount = () => this.chunkInformation.length

	/**
	 * get an ith chunk
	 * @param {Number} idx get the ith chunk
	 * @return {Chunk} the chunk object
	 */
	chunkAt = (idx: number): Chunk | null | undefined => {
		if (idx < 0 || idx >= this.chunkInformation.length) {
			return undefined
		}

		const chunk = this.chunkInformation[idx].chunk;
		if (!chunk || (chunk instanceof Error)) {
			return null
		}

		return chunk
	}

	getChunks = (): Chunk[] => this.chunkInformation.map(i => i.chunk)

	/**
	 * initialize chunks
	 */
	initializeChunks = async (): Promise<void> => {
		// ## Chunk Data
		//
		// from 8192 ~ ...
		//
		// Chunk data begins with a (big-endian) four-byte length field which indicates the
		// exact length of the remaining chunk data in bytes. The following byte indicates
		// the compression scheme used for chunk data, and the remaining (length-1) bytes
		// are the compressed chunk data.
		//
		// Minecraft always pads the last chunk's data to be a multiple-of-4096B in length (
		// so that the entire file has a size that is a multiple of 4KiB). Minecraft will not
		// accept files in which the last chunk is not padded. Note that this padding is not
		// included in the length field.
		for (const information of this.chunkInformation) {
			const sectorOffset = information.sectorOffset
			const sectorCount = information.sectorCount
			const start = sectorOffset * SECTOR_SIZE
			const end = (sectorOffset + sectorCount) * SECTOR_SIZE

			information.originalData = this.buffer.slice(start, end)

			const chunk = new Chunk(information.originalData)
			await chunk.parse()
			information.chunk = chunk
		}

		for (let i = 0; i < this.chunkInformation.length; i++) {
			if (!(this.chunkInformation[i].chunk instanceof Chunk)) {
				throw new Error(`Broken chunk at ${i}: ${this.chunkInformation[i].chunk.message}.`)
			}
		}

		return
	}
}
