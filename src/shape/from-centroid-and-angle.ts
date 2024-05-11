import { seedShapes } from "../to-shapes/get-seed-shape";
import { zeroVector } from "../vector/zero-vector";
import { rotateVectorAround } from "../vector/rotate-vector-around";
import { addVector } from "../vector/add-vector";
import { scaleVector } from "../vector/scale";
import { ShapeType } from "../types/shape-type";


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
