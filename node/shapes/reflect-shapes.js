import { reflectVector } from "../vector/reflect-vector";
function reflectShapes(θ2, v, shapes) {
    const shapes_ = [];
    const stage = shapes[0].stage + 1;
    for (const shape of shapes) {
        const c_ = reflectVector(θ2, v, shape.c);
        const θm = (θ2 - shape.θm + 12) % 24;
        const { sides, stagePlacement } = shape;
        shapes_.push({
            sides, stage, stagePlacement,
            c: c_,
            θm
        });
    }
    return shapes_;
}
export { reflectShapes };
//# sourceMappingURL=reflect-shapes.js.map