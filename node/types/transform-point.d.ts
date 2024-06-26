import { PointType } from "./point-type.js";
interface TransformPoint {
    /** Vector to transform point (from origin) */
    readonly v: number[];
    readonly θ2: number;
    readonly pointType: PointType;
    readonly index: number;
}
export { TransformPoint };
