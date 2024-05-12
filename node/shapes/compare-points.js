import { angleEquals } from "../vector/angle-equals.js";
import { getAngleClockwiseFromYAxis } from "../vector/get-angle-clockwise-from-y-axis.js";
const { PI, hypot } = Math;
const ANGLE_PRECISION = 2 ** -10;
function comparePoints(a, b) {
    const _θa = getAngleClockwiseFromYAxis(a);
    const _θb = getAngleClockwiseFromYAxis(b);
    const θa = _θa > 2 * PI - ANGLE_PRECISION ? 0 : _θa;
    const θb = _θb > 2 * PI - ANGLE_PRECISION ? 0 : _θb;
    if (angleEquals(θa, θb)) {
        return hypot(...a) - hypot(...b);
    }
    return θa - θb;
}
export { comparePoints };
//# sourceMappingURL=compare-points.js.map