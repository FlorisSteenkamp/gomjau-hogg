import { AntwerpData } from '../types/antwerp-data.js';
/**
 * Returns a regular polygon tesselation according to the given GomJauHogg
 * notation.
 *
 * The return value is an object with the following properties:
 * * `shapes` - the returned shape object array, each having the following properties:
 *   * `c` -> centroid of shape given as `[x,y]`
 *   * `θm` -> angle shape sits at given as `θm === θ*12/PI` where θ is in radians
 *   * `sides` -> number of sides (3,4,6,8 or 12)
 *   * `stage` -> the transformation stage
 *   * `stagePlacement` -> placement stage as determined by seed shapes
 * * `maxStage` -> can be used to color shapes
 * * `maxStagePlacement` -> can be used to color shapes
 * * `transformPointsMaps` -> can be used to display transformation points
 *
 * @param options an object with the properties of:
 * * `configuration` a string in the GomJauHogg notation (e.g. `6-4-3,3/m30/r(h1)`)
 * * `repeatCount` (if `undefined`, `inRadius` will be used instead) the number
 * of times transforms will be
 * repeated (e.g. 10); the number of shapes grow as the square of this number
 * * `shapeSize` the length of each shape's edge.
 * * `inRadius` (if `undefined` `repeatCount` will be used instead) the tiling
 * grows until the entire tiling fits in a circle centered at the origin with
 * this radius
 */
declare function toShapes(configuration: string, repeatCount: number | undefined, shapeSize: number, inRadius?: number | undefined): AntwerpData;
export { toShapes };
