import { Transform } from '../types/transform.js';
import { Shape } from '../shape/shape.js';
declare function transformUsingOrigin(buckets: [Uint32Array], newShapesGrow: Shape[], transform: Transform): Shape[];
export { transformUsingOrigin };
