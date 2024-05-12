import { zeroVector } from "../vector/zero-vector";
import { rotateVectorAround } from "../vector/rotate-vector-around";
function rotateShapesAround(θm, v = zeroVector, shapes) {
    const stage = shapes[0].stage + 1;
    const shapes_ = [];
    for (const shape of shapes) {
        const c_ = rotateVectorAround(θm, v, shape.c);
        const { sides, stagePlacement } = shape;
        shapes_.push({
            sides, stage, stagePlacement,
            c: c_,
            θm: (θm + shape.θm) % 24,
        });
    }
    return shapes_;
}
export { rotateShapesAround };
//# sourceMappingURL=rotate-shapes.js.map