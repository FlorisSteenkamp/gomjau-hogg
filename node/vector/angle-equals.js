const { PI, abs } = Math;
const ANGLE_PRECISION = 2 ** -10;
function angleEquals(θa, θb) {
    let d = abs(θa - θb);
    d = d < PI ? d : abs(2 * PI - d);
    return d <= ANGLE_PRECISION;
}
export { angleEquals };
//# sourceMappingURL=angle-equals.js.map