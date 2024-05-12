const { PI, cos, sin } = Math;
function reflectVector(θm, v, p) {
    const cx = v[0];
    const cy = v[1];
    const vx = p[0] - cx;
    const vy = p[1] - cy;
    const cosθ = cos(θm * PI / 12);
    const sinθ = sin(θm * PI / 12);
    return [
        cosθ * vx + sinθ * vy + cx,
        sinθ * vx - cosθ * vy + cy
    ];
}
export { reflectVector };
//# sourceMappingURL=reflect-vector.js.map