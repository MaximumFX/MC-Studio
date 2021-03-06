//https://github.com/EngineHub/WorldEdit/blob/bb3245e3a08f1c801e0d43768800d472ef0896a2/worldedit-core/src/main/java/com/sk89q/worldedit/math/Vector3.java
import BlockVector3 from "@/js/OSM/math/BlockVector3";

export default class Vector3 {
	x: number
	y: number
	z: number

	constructor(x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
	}

	equals = (v2: Vector3) => this.x === v2.x && this.y === v2.y && this.z === v2.z

	/**
	 * Subtract another vector from this vector and return the result
	 * as a new vector.
	 *
	 * @param other the other vector
	 * @return a new vector
	 */
	subtract = (other: Vector3) => new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);

	/**
	 * Divide this vector by another vector on each component.
	 *
	 * @param other the other vector | n the value to divide by
	 * @return a new vector
	 */
	divide = (other: Vector3 | number) => {
		if (other instanceof Vector3)
			return new Vector3(this.x / other.x, this.y / other.y, this.z / other.z)
		else
			return new Vector3(this.x / other, this.y / other, this.z / other)
	}

	/**
	 * Gets the dot product of this and another vector.
	 *
	 * @param other the other vector
	 * @return the dot product of this and the other vector
	 */
	dot = (other: Vector3 | BlockVector3) => this.x * other.x + this.y * other.y + this.z * other.z;

	/**
	 * Gets the cross product of this and another vector.
	 *
	 * @param other the other vector
	 * @return the cross product of this and the other vector
	 */
	cross = (other: Vector3) => new Vector3(
		this.y * other.z - this.z * other.y,
		this.z * other.x - this.x * other.z,
		this.x * other.y - this.y * other.x
	)

	/**
	 * Get the normalized vector, which is the vector divided by its
	 * length, as a new vector.
	 *
	 * @return a new vector
	 */
	normalize = () => this.divide(this.length())

	/**
	 * Get the length of the vector.
	 *
	 * @return number
	 */
	length = () => Math.sqrt(this.lengthSq())

	/**
	 * Get the length, squared, of the vector.
	 *
	 * @return number squared
	 */
	lengthSq = () => Math.hypot(this.x, this.y, this.z)
}
