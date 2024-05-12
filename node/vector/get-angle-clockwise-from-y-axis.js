const { PI, atan2 } = Math;
function getAngleClockwiseFromYAxis(v) {
    const [x, y] = v;
    const θ = (2 * PI) - (atan2(y, x) - PI / 2 + 2 * PI) % (2 * PI);
    return θ;
}
export { getAngleClockwiseFromYAxis };
//# sourceMappingURL=get-angle-clockwise-from-y-axis.js.map