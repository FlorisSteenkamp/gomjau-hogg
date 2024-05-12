import { Shape } from '../shape/shape';
import { TransformPoint } from './transform-point';
interface AntwerpData {
    readonly shapes: Shape[];
    readonly maxStage: number;
    readonly maxStagePlacement: number;
    readonly transformPointsMaps: Map<string, TransformPoint>[];
}
export { AntwerpData };
