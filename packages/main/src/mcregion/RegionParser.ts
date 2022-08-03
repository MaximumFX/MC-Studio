import fs from 'fs';
import Region from './Region';

export default class RegionParser {
	static parse = async (filename: string | Buffer): Promise<Region> => {
		/**
		 * if it's not a buffer, then call this function
		 * rescursively
		 */
		if (!Buffer.isBuffer(filename)) {
			const data = await fs.promises.readFile(filename)

			return await RegionParser.parse(data)
		}
		else {
			const region = new Region(filename)
			await region.initializeChunks()
			return region
		}
	}
}
