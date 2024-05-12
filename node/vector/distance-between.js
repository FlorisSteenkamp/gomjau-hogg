import { zeroVector } from './zero-vector';
const { hypot } = Math;
function distanceBetween(v1, v2 = zeroVector) {
    return hypot(v1[0] - v2[0], v1[1] - v2[1]);
}
export { distanceBetween };
//# sourceMappingURL=distance-between.js.map