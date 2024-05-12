import { Transform } from '../types/transform';
import { Shape } from '../shape/shape';
declare function transformUsingOrigin(buckets: [Uint32Array], newShapesGrow: Shape[], transform: Transform): Shape[];
export { transformUsingOrigin };
