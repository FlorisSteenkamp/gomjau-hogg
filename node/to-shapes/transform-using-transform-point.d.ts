import { Transform } from '../types/transform';
import { Shape } from '../shape/shape';
import { TransformPoint } from '../types/transform-point';
declare function transformUsingTransformPoint(buckets: [Uint32Array], newShapesFill: Shape[], transform: Transform, transformPoints: Map<string, TransformPoint>): Shape[];
export { transformUsingTransformPoint };
