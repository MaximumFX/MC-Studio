import Triangle from "@/js/OSM/Triangle";

//https://github.com/EngineHub/WorldEdit/blob/bb3245e3a08f1c801e0d43768800d472ef0896a2/worldedit-core/src/main/java/com/sk89q/worldedit/regions/polyhedron/Edge.java
export default class Edge {
	constructor(start, end) {
		this.start = start;
		this.end = end;
	}

	equals(other) {
		if (!(other instanceof Edge)) {
			return false;
		}

		let otherEdge = other;
		if (this.start.equals(otherEdge.end) && this.end.equals(otherEdge.start)) {
			return true;
		}

		return this.end.equals(otherEdge.end) && this.start.equals(otherEdge.start)
	}

	/**
	 * Create a triangle from { this.start, this.end, vertex }
	 *
	 * @param vertex the 3rd vertex for the triangle
	 * @return a triangle
	 */
	createTriangle = (vertex) => new Triangle(this.start, this.end, vertex)

	/**
	 * Create a triangle from { this.start, vertex, this.end }.
	 *
	 * @param vertex the second vertex
	 * @return a new triangle
	 */
	createTriangle2 = (vertex) => new Triangle(this.start, vertex, this.end)
}