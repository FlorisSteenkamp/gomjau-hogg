import { Shape } from "../shape/shape.js";
/**
 *
 * @param buckets Set holding hashes of existing shapes
 * @param shapes new shapes to add
 */
declare function getNewShapes(buckets: [Uint32Array], shapes: Shape[]): Shape[];
export { getNewShapes };
