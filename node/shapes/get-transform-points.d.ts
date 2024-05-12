import { TransformPoint } from '../types/transform-point.js';
import { Shape } from '../shape/shape.js';
declare function getTransformPoints(shapes: Shape[]): Map<string, TransformPoint>;
export { getTransformPoints };
