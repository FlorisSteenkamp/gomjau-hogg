import { zeroVector } from "../vector/zero-vector";
import { Shape } from "../shape/shape";
import { rotateVectorAround } from "../vector/rotate-vector-around";


function rotateShapesAround(
        θm: number,
        v = zeroVector,
        shapes: Shape[]): Shape[] {

    const stage = shapes[0].stage + 1;
    const shapes_: Shape[] = [];
    for (const shape of shapes) {
        const c_ = rotateVectorAround(θm, v, shape.c);
        
        const { sides, stagePlacement } = shape;
        shapes_.push({
            sides, stage, stagePlacement,
            c: c_,
            θm: (θm + shape.θm)%24,
        });
    }

    return shapes_;
} 


export { rotateShapesAround }
