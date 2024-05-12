import { seedShapes } from "../to-shapes/get-seed-shape.js";
import { zeroVector } from "../vector/zero-vector.js";
import { rotateVectorAround } from "../vector/rotate-vector-around.js";
import { addVector } from "../vector/add-vector.js";
import { scaleVector } from "../vector/scale.js";
import { ShapeType } from "../types/shape-type.js";


function fromCentroidAndAngle(
    c: number[],
    θm: number,
    sides: ShapeType,
    scaleFactor: number): number[][] {

    const { ps, θm: sθm } = seedShapes[sides];

    const ps_ = ps
        .map(p => rotateVectorAround(θm + sθm, zeroVector, p))
        .map(p => scaleVector(scaleFactor)(p))
        .map(p => addVector(p,c));

    return ps_;
}


export { fromCentroidAndAngle }
