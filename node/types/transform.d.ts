import { TransformPoint } from "./transform-point.js";
import { TransformType } from "./transform-type.js";
interface Transform {
    readonly transformType: TransformType;
    /**
     * Angle in 15 degree intervals, e.g. 45 degrees -> 3
     * * if not specified defaults to 12
     */
    readonly angle: 2 | 3 | 4 | 6 | 12 | undefined;
    /**
     * When not specified defaults to the center of the coordinate system else
     * uses `pointIndex`
     */
    origin: TransformPoint | undefined;
    readonly pointIndex: string;
    readonly string: string;
}
export { Transform };
