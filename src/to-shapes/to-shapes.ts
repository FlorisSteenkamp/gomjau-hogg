import { AntwerpData } from '../types/antwerp-data.js';
import { toEntities } from '../to-entities.js';
import { getTransformPoints } from '../shapes/get-transform-points.js';
import { getSeedShapes } from './get-seed-shapes.js';
import { TransformPoint } from '../types/transform-point.js';
import { scaleTransformPointsMaps } from './scale-transform-points-map.js';
import { createBuckets } from '../hash/ceate-buckets.js';
import { getNewShapes } from '../shapes/get-new-shapes.js';
import { transformUsingTransformPoint } from './transform-using-transform-point.js';
import { transformUsingOrigin } from './transform-using-origin.js';
import { scaleVector } from '../vector/scale.js';
import { grahamScan } from 'flo-graham-scan';
import { closestPointOnBezier } from 'flo-bezier3';


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
function toShapes(
        configuration: string,
        repeatCount: number | undefined,
        shapeSize: number,
        inRadius?: number | undefined): AntwerpData {

    const startTime = performance.now();

    if (repeatCount === undefined && inRadius === undefined) {
        throw new Error('Both `repeatCount` and `inRadius` cannot be zero.')
    }

    const buckets = createBuckets();

    const { transforms } = toEntities(configuration);

    const { seedShapes, maxStagePlacement } = getSeedShapes(configuration);

    const shapes = [getNewShapes(buckets, seedShapes)];
    const transformPointsMaps: Map<string, TransformPoint>[] = [];

    const hulls: number[][][] = [];

    // ------------------------------
    // Repeating the Transformations
    // ------------------------------
    let transformPoints: Map<string, TransformPoint> = new Map();
    let newShapesGrow = shapes.flat().slice();
    let newShapesFill = shapes.flat().slice();
    let prevWasFill = true;
    let prevWasGrow = true;
    let minHull = grahamScan(seedShapes.map(s => s.c), true)!;
    hulls.push(minHull);
    let i=0
    while (true) {
        let minD = Number.POSITIVE_INFINITY;
        const len = minHull.length;
        for (let j=0; j<len; j++) {
            const j_ = (j + 1)%len;
            const p = minHull[j];
            const p_ = minHull[j_];

            const l = [p,p_];
            const { d } = closestPointOnBezier(l, [0,0])

            if (d < minD) { minD = d; }
        }

        if (inRadius === undefined) {
            if (i >= repeatCount!) { break; }
        } else {
            if (minD*shapeSize >= inRadius) { break; }
        }

        for (let j=0; j<transforms.length; j++) {
            const transform = transforms[j];
            if (i === 0) {
                transformPoints = getTransformPoints(shapes.flat());
                transformPointsMaps.push(transformPoints);
            } else {
                transformPoints = transformPointsMaps[j];
            }

            const { pointIndex, angle } = transform;

            const addedShapes = !!pointIndex
                ? transformUsingTransformPoint(
                    buckets, newShapesFill, transform, transformPoints
                )
                : transformUsingOrigin(
                    buckets, newShapesGrow, transform
                );

            const isGrow = !!pointIndex || angle === 12;

            if (!prevWasFill && !isGrow) {
                newShapesFill = addedShapes.slice();
            } else {
                for (const s of addedShapes) { newShapesFill.push(s); }
            }

            if (!prevWasGrow && isGrow) {
                newShapesGrow = addedShapes.slice();
            } else {
                for (const s of addedShapes) { newShapesGrow.push(s); }
            }

            shapes.push(addedShapes);

            prevWasFill = !isGrow;
            prevWasGrow = isGrow;

            const ps = [...minHull, ...addedShapes.map(s => s.c)];
            minHull = grahamScan(ps, false)!;
            hulls.push(minHull);
        }

        i++;
    }


    const shapes_ = shapes
    .flat().map(shape => {
        const { c, sides, stage, stagePlacement, θm } = shape;
        return {
            sides, stage, stagePlacement, θm,
            c: scaleVector(shapeSize)(c)
        }
    });

    const lastShapes = shapes[shapes.length-1];
    const lastShape = lastShapes[lastShapes.length-1];
    const maxStage = lastShape ? lastShape.stage : 0;

    const transformPointsMaps_ = scaleTransformPointsMaps(
        shapeSize,
        transformPointsMaps
    );


    ///////////////////
    const endTime = performance.now();
    // console.log('l', shapes_.length);
    // console.log(((endTime - startTime)).toFixed(1) + ' ms')
    ///////////////////

    const r = {
        shapes: shapes_,
        seedShapes,
        maxStage,
        maxStagePlacement,
        transformPointsMaps: transformPointsMaps_,
        hulls
    }

    // console.log(r)

    return r;
}


export { toShapes }


// Recorded timings
// ================
// 6-4-3,3/m30/r(h1)
// -----------------
// repeatCount: 1   -> time: 0.5 ms   -> #shapes: 36
// repeatCount: 4   -> time: 0.7 ms   -> #shapes: 696
// repeatCount: 16  -> time: 8.1 ms   -> #shapes: 11445
// repeatCount: 25  -> time: 17.7 ms  -> #shapes: 28014
// repeatCount: 64  -> time: 111.7 ms -> #shapes: 184038
// repeatCount: 100 -> time: 318 ms   -> #shapes: 449570
// repeatCount: 128 -> time: 477.5 ms -> #shapes: 736736
// repeatCount: 150 -> time: 751 ms   -> #shapes: 1011864
// repeatCount: 200 -> time: 1395 ms  -> #shapes: 1799162
// repeatCount: 256 -> time: 2100 ms  -> #shapes: 2948054

// This shows that for `n === repeatCount` the number of shapes grow as `O(n^2)`
// and the time grows as `O(n^2)` as well so that:
// The algorithm is linear in the number of shapes, i.e. `toShapes ~ O(n)`
