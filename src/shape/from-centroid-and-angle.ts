import { seedShapes } from "../to-shapes/get-seed-shape.js";
import { zeroVector } from "../vector/zero-vector.js";
import { rotateVectorAround } from "../vector/rotate-vector-around.js";
import { addVector } from "../vector/add-vector.js";
import { scaleVector } from "../vector/scale.js";
import { ShapeType } from "../types/shape-type.js";
import { vectorLength } from '../vector/vector-length.js';


function fromCentroidAndAngle(
    c: number[],
    θm: number,
    sides: ShapeType,
    scaleFactor: number,
    linearScale = 0): number[][] {

    const { ps, θm: sθm } = seedShapes[sides];

    let ps_ = ps
        .map(p => rotateVectorAround(θm + sθm, zeroVector, p));

    if (linearScale !== 0) {
        ps_ = ps_.map(p => {
            const l = vectorLength(p);

            const [x,y] = p;

            return [x + linearScale*x/l, y + linearScale*y/l];
        })
    }

    ps_ = ps_
        .map(p => scaleVector(scaleFactor)(p))
        .map(p => addVector(p,c));

    return ps_;
}


export { fromCentroidAndAngle }
