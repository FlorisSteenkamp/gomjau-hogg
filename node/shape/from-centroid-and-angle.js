import { seedShapes } from "../to-shapes/get-seed-shape";
import { zeroVector } from "../vector/zero-vector";
import { rotateVectorAround } from "../vector/rotate-vector-around";
import { addVector } from "../vector/add-vector";
import { scaleVector } from "../vector/scale";
function fromCentroidAndAngle(c, θm, sides, scaleFactor) {
    const { ps, θm: sθm } = seedShapes[sides];
    const ps_ = ps
        .map(p => rotateVectorAround(θm + sθm, zeroVector, p))
        .map(p => scaleVector(scaleFactor)(p))
        .map(p => addVector(p, c));
    return ps_;
}
export { fromCentroidAndAngle };
//# sourceMappingURL=from-centroid-and-angle.js.map