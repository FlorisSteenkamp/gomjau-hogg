import { Shape } from "../shape/shape.js";
import { reflectVector } from "../vector/reflect-vector.js";


function reflectShapes(
        θ2: number,
        v: number[],
        shapes: Shape[]): Shape[] {

    const shapes_: Shape[] = [];

    const stage = shapes[0].stage + 1;
    for (const shape of shapes) {
        const c_ = reflectVector(θ2, v, shape.c);

        const θm = (θ2 - shape.θm + 12)%24;

        const { sides, stagePlacement } = shape;
        shapes_.push({
            sides, stage, stagePlacement,
            c: c_,
            θm
        });
    }

    return shapes_;
}


export { reflectShapes }
