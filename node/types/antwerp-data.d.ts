import { Shape } from '../shape/shape.js';
import { TransformPoint } from './transform-point.js';
interface AntwerpData {
    readonly shapes: Shape[];
    readonly seedShapes: Shape[];
    readonly maxStage: number;
    readonly maxStagePlacement: number;
    readonly transformPointsMaps: Map<string, TransformPoint>[];
    readonly hulls: number[][][];
}
export { AntwerpData };
