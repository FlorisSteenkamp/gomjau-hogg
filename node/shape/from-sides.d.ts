import { ShapeType } from "../types/shape-type";
/**
 * Returns a shape reprsented by its vertices.
 *
 * @param sides the number of sides of the shape: 3,4,6,8 or 12.
 */
declare function fromSides(sides: ShapeType): number[][];
export { fromSides };
