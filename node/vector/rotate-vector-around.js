import { zeroVector } from "./zero-vector.js";
const { PI, sin, cos } = Math;
/**
 * Returns the result of rotating a vector around a specified point.
 *
 * @param θ angle
 * @param c center of rotation
 */
function rotateVectorAround(θm, c = zeroVector, v) {
    const x = v[0];
    const y = v[1];
    const θ = θm * PI / 12;
    const cosθ = cos(θ);
    const sinθ = sin(θ);
    const [cx, cy] = c;
    const vx = x - cx;
    const vy = y - cy;
    return [
        cosθ * vx - sinθ * vy + cx,
        sinθ * vx + cosθ * vy + cy
    ];
}
export { rotateVectorAround };
//# sourceMappingURL=rotate-vector-around.js.map