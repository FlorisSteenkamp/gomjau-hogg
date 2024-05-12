import { TransformPoint } from '../types/transform-point';
import { Shape } from '../shape/shape';
declare function getTransformPoints(shapes: Shape[]): Map<string, TransformPoint>;
export { getTransformPoints };
