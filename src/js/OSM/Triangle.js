import Edge from "@/js/OSM/Edge";

//https://github.com/EngineHub/WorldEdit/blob/bb3245e3a08f1c801e0d43768800d472ef0896a2/worldedit-core/src/main/java/com/sk89q/worldedit/regions/polyhedron/Triangle.java
export default class Triangle {
	constructor(v0, v1, v2) {
		this.v0 = v0
		this.v1 = v1
		this.v2 = v2

		this.vertices = [v0, v1, v2]
		this.normal = v1.subtract(v0).cross(v2.subtract(v0)).normalize()
		this.maxDotProduct = Math.max(this.normal.dot(v0), this.normal.dot(v1), this.normal.dot(v2))
	}

	/**
	 * Returns whether the given point is above the plane the triangle is in.
	 *
	 * @param pt the point to test
	 * @return true if the point is above
	 */
	above = (pt) => this.normal.dot(pt) > this.maxDotProduct

	/**
	 * Returns the triangle's edge with the given index, counter-clockwise.
	 *
	 * @param index Edge index. Valid input: 0..2
	 * @return an edge
	 */
	getEdge = index => {
		if (index === this.vertices.length - 1) {
			return new Edge(this.vertices[index], this.vertices[0]);
		}
		return new Edge(this.vertices[index], this.vertices[index + 1]);
	}
}