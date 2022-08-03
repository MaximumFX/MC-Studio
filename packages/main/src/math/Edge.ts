
//https://github.com/EngineHub/WorldEdit/blob/bb3245e3a08f1c801e0d43768800d472ef0896a2/worldedit-core/src/main/java/com/sk89q/worldedit/regions/polyhedron/Edge.java
import type Vector3 from '@/math/Vector3';
import Triangle from '@/math/Triangle';

export default class Edge {
	start: Vector3
	end: Vector3

	constructor(start: Vector3, end: Vector3) {
		this.start = start;
		this.end = end;
	}

	equals = (other: Edge) => {
		if (this.start.equals(other.end) && this.end.equals(other.start)) {
			return true;
		}

		return this.end.equals(other.end) && this.start.equals(other.start)
	}

	/**
	 * Create a triangle from { this.start, this.end, vertex }
	 *
	 * @param vertex the 3rd vertex for the triangle
	 * @return a triangle
	 */
	createTriangle = (vertex: Vector3) => new Triangle(this.start, this.end, vertex)

	/**
	 * Create a triangle from { this.start, vertex, this.end }.
	 *
	 * @param vertex the second vertex
	 * @return a new triangle
	 */
	createTriangle2 = (vertex: Vector3) => new Triangle(this.start, vertex, this.end)
}
