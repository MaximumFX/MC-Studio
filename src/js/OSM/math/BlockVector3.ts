import Vector3 from "@/js/OSM/math/Vector3"

//https://github.com/EngineHub/WorldEdit/blob/bb3245e3a08f1c801e0d43768800d472ef0896a2/worldedit-core/src/main/java/com/sk89q/worldedit/math/BlockVector3.java#L35
export default class BlockVector3 {
	x: number
	y: number
	z: number

	constructor(x: number, y: number, z: number) {
		this.x = Math.round(x)
		this.y = Math.round(y)
		this.z = Math.round(z)
	}

	at = (x: number, y: number, z: number) => new BlockVector3(Math.floor(x), Math.floor(y), Math.floor(z))

	toVector3 = () => new Vector3(this.x, this.y, this.z)

	equals = (v2: BlockVector3) => this.x === v2.x && this.y === v2.y && this.z === v2.z

	/**
	 * Gets the minimum components of two vectors.
	 *
	 * @param v2 the second vector
	 * @return BlockVector3
	 */
	getMinimum = (v2: BlockVector3) => new BlockVector3(
		Math.min(this.x, v2.x),
		Math.min(this.y, v2.y),
		Math.min(this.z, v2.z)
	)

	/**
	 * Gets the maximum components of two vectors.
	 *
	 * @param v2 the second vector
	 * @return BlockVector3
	 */
	getMaximum = (v2: BlockVector3) => new BlockVector3(
		Math.max(this.x, v2.x),
		Math.max(this.y, v2.y),
		Math.max(this.z, v2.z)
	)

	/**
	 * Add another vector to this vector and return the result as a new vector.
	 *
	 * @param other the other vector
	 * @return a new vector
	 */
	add = (other: BlockVector3) => new BlockVector3(this.x + other.x, this.y + other.y, this.z + other.z)
}
