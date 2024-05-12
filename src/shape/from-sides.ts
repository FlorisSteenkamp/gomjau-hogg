import { ShapeType } from "../types/shape-type.js";
import { scaleVector } from "../vector/scale.js";
import { sidelength_div_circumradius } from "./side-length-div-circumradius.js";

const { cos, sin, PI } = Math;


/**
 * Returns a shape reprsented by its vertices.
 * 
 * @param sides the number of sides of the shape: 3,4,6,8 or 12.
 */
function fromSides(
        sides: ShapeType): number[][] {

    const ps = Array.from(new Array(sides))
    .map((v,i) => [
        cos(-i*(2*PI)/sides),
        sin(-i*(2*PI)/sides),
    ]);

    const s = sidelength_div_circumradius[sides];

    return ps.map(scaleVector(1/s));
}


export { fromSides }
