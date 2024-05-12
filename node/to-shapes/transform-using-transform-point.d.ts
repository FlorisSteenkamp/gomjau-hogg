import { Transform } from '../types/transform.js';
import { Shape } from '../shape/shape.js';
import { TransformPoint } from '../types/transform-point.js';
declare function transformUsingTransformPoint(buckets: [Uint32Array], newShapesFill: Shape[], transform: Transform, transformPoints: Map<string, TransformPoint>): Shape[];
export { transformUsingTransformPoint };
