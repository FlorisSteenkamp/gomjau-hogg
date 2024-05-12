var __webpack_exports__ = {};

// UNUSED EXPORTS: fromCentroidAndAngle, toShapes

;// CONCATENATED MODULE: ./src/hash/get-transform-point-buckets.ts
const { log2, round, abs } = Math;
// Must be smaller than min distance between any two transform points
const BUCKET_SIZE = 2 ** -4;
/** number of buckets per unit */
const N = log2(1 / BUCKET_SIZE);
const MAX_COORD = 2 ** 8;
/** The number of buckets per coordinate */
const NUM_BUCKETS = MAX_COORD * (2 ** N);
/**
 * Guessed maximum floating point error after all transformations.
 * * A high value was chosen to be sure but it is possible to calculate it
 * exactly though the calculation would be very tedious.
 */
const MAX_ABS_ERROR = 2 ** -10;
/** Max shift allowed before throwing point into two buckets */
const ALLOWED_SHIFT = BUCKET_SIZE / 2 - MAX_ABS_ERROR;
function get_transform_point_buckets_getTransformPointBuckets(p) {
    const [x, y] = p;
    // We pack the buckets into one float by shifting by around 22 bits
    // Note this allows bucket points to be compared easily
    // using the usual ===,>,>= etc. operators
    const xBuckets = getTransformPointCoordinateBuckets(x).map(b => b * NUM_BUCKETS * 2 ** 2);
    const yBuckets = getTransformPointCoordinateBuckets(y);
    // Pack buckets
    const buckets = [];
    for (let i = 0; i < xBuckets.length; i++) {
        for (let j = 0; j < yBuckets.length; j++) {
            buckets.push(xBuckets[i] + yBuckets[j]);
        }
    }
    return buckets;
}
/**
 * Perform a location sensitive hash (called buckets)
 *
 * * points close to zero are automatically put into bucket 0
 *
 * @param v
 */
function getTransformPointCoordinateBuckets(v) {
    const buckets = [];
    const b1 = round(v / BUCKET_SIZE) * BUCKET_SIZE;
    buckets.push(b1); // usually there's only one bucket per coordinate
    const d = abs(v - b1);
    if (d >= ALLOWED_SHIFT) { // too close to call - put into two buckets
        const b2 = v > b1
            ? b1 + BUCKET_SIZE // we rounded down
            : b1 - BUCKET_SIZE; // we rounded up
        buckets.push(b2);
    }
    return buckets;
}


;// CONCATENATED MODULE: ./src/vector/scale.ts
function scale_scaleVector(s) {
    return (v) => {
        return [s * v[0], s * v[1]];
    };
}


;// CONCATENATED MODULE: ./src/shape/side-length-div-circumradius.ts
const { sqrt, SQRT2 } = Math;
const SQRT3 = sqrt(3);
/** Side length / circumradius */
const sidelength_div_circumradius = {
    3: SQRT3,
    4: SQRT2,
    6: 1,
    8: sqrt(2 - SQRT2),
    12: sqrt(2 - SQRT3)
};


;// CONCATENATED MODULE: ./src/shape/from-sides.ts


const { cos, sin, PI } = Math;
/**
 * Returns a shape reprsented by its vertices.
 *
 * @param sides the number of sides of the shape: 3,4,6,8 or 12.
 */
function fromSides(sides) {
    const ps = Array.from(new Array(sides))
        .map((v, i) => [
        cos(-i * (2 * PI) / sides),
        sin(-i * (2 * PI) / sides),
    ]);
    const s = sidelength_div_circumradius[sides];
    return ps.map(scale_scaleVector(1 / s));
}


;// CONCATENATED MODULE: ./src/vector/zero-vector.ts
const zero_vector_zeroVector = [0, 0];


;// CONCATENATED MODULE: ./src/vector/rotate-vector-around.ts

const { PI: rotate_vector_around_PI, sin: rotate_vector_around_sin, cos: rotate_vector_around_cos } = Math;
/**
 * Returns the result of rotating a vector around a specified point.
 *
 * @param θ angle
 * @param c center of rotation
 */
function rotate_vector_around_rotateVectorAround(θm, c = zero_vector_zeroVector, v) {
    const x = v[0];
    const y = v[1];
    const θ = θm * rotate_vector_around_PI / 12;
    const cosθ = rotate_vector_around_cos(θ);
    const sinθ = rotate_vector_around_sin(θ);
    const [cx, cy] = c;
    const vx = x - cx;
    const vy = y - cy;
    return [
        cosθ * vx - sinθ * vy + cx,
        sinθ * vx + cosθ * vy + cy
    ];
}


;// CONCATENATED MODULE: ./src/shape/rotate-shape.ts


/**
 *
 * @param θ
 * @param v
 * @param shape
 * @returns
 */
function rotateShape(θm, ps) {
    return ps.map(p => rotate_vector_around_rotateVectorAround(θm, zero_vector_zeroVector, p));
}


;// CONCATENATED MODULE: ./src/to-shapes/get-seed-shape.ts



const { sqrt: get_seed_shape_sqrt } = Math;
const get_seed_shape_SQRT3 = get_seed_shape_sqrt(3);
const get_seed_shape_seedShapes = {
    3: { ps: rotateShape(-2, fromSides(3)), θm: 0 },
    4: { ps: rotateShape(9, fromSides(4)), θm: 0 },
    6: { ps: rotateShape(6, fromSides(6)), θm: -6 },
    8: { ps: rotateShape(7.5, fromSides(8)), θm: 0 },
    12: { ps: rotateShape(7, fromSides(12)), θm: 0 }
};
/**
 * Returns a seed shape based on the given number of sides.
 *
 * * the side length of the returned shapes === 1
 */
function get_seed_shape_getSeedShape(sides) {
    if (sides !== 3 && sides !== 4 && sides !== 6 && sides !== 8 && sides !== 12) {
        throw ErrorSeed();
    }
    return {
        sides,
        // c: sides === 3 ? [0.5, SQRT3/2] : [0,0],
        c: sides === 3 ? [get_seed_shape_SQRT3 / 6, 0.5] : [0, 0],
        θm: sides === 3 ? 2 : sides === 6 ? -6 : 0,
        stage: 0,
        stagePlacement: 1
    };
}


;// CONCATENATED MODULE: ./src/shape/from-centroid-and-angle.ts





function from_centroid_and_angle_fromCentroidAndAngle(c, θm, sides, scaleFactor) {
    const { ps, θm: sθm } = seedShapes[sides];
    const ps_ = ps
        .map(p => rotateVectorAround(θm + sθm, zeroVector, p))
        .map(p => scaleVector(scaleFactor)(p))
        .map(p => addVector(p, c));
    return ps_;
}


;// CONCATENATED MODULE: ./src/shapes/get-transform-points.ts








const { PI: get_transform_points_PI, round: get_transform_points_round, atan2 } = Math;
function get_transform_points_getTransformPoints(shapes) {
    const transformPoints = [];
    // --------------
    // Centroids (c)
    // --------------
    for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];
        const { c, θm, sides } = s;
        const ps = fromCentroidAndAngle(c, θm, sides, 1);
        const v = getCentroid(ps);
        const θ2 = get_transform_points_round(2 * atan2(v[0], -v[1]) / get_transform_points_PI * 12);
        transformPoints.push({ v, θ2, pointType: 'c', index: 0 });
    }
    // -------------------------------
    // Vertices (v) and Midpoints (h)
    // -------------------------------
    const edges = shapes.map(shape => {
        const { c, θm, sides } = shape;
        const ps = fromCentroidAndAngle(c, θm, sides, 1);
        return getShapeEdges(ps);
    }).flat();
    for (const ls of edges) {
        {
            const v = ls[0];
            const c = subtractVector(addVector(v, [-v[1], v[0]]), v);
            const θ2 = get_transform_points_round(atan2(c[1], c[0]) / get_transform_points_PI * 12);
            transformPoints.push({
                v, θ2,
                pointType: 'v',
                index: 0
            });
        }
        {
            const v = getCentroid(ls);
            const c = subtractVector(ls[1], v);
            const θ2 = get_transform_points_round(2 * atan2(c[1], c[0]) / get_transform_points_PI * 12);
            transformPoints.push({
                v, θ2,
                pointType: 'h',
                index: 0
            });
        }
    }
    let cc = 0;
    let vv = 0;
    let hh = 0;
    const transformPoints_ = getUniqueVerticesNotZero(transformPoints)
        .sort((a, b) => comparePoints(a.v, b.v))
        .map(tp => ({
        ...tp,
        index: (tp.pointType === 'c' && ++cc) ||
            (tp.pointType === 'v' && ++vv) ||
            (tp.pointType === 'h' && ++hh) || 0,
    }));
    const transformPointMap = new Map(transformPoints_
        .map(v => [v.pointType + v.index, v]));
    return transformPointMap;
}
function getUniqueVerticesNotZero(vertices) {
    const vertexSet = new Set();
    const vertices_ = [];
    for (const vertex of vertices) {
        const hashes = getTransformPointBuckets(vertex.v);
        if (isBucketZero(hashes)) {
            continue; // no origins allowed
        }
        let found = false;
        for (let j = 0; j < hashes.length; j++) {
            const h = hashes[j];
            if (vertexSet.has(h)) {
                found = true;
                break;
            }
        }
        if (found) {
            continue;
        }
        for (const h of hashes) {
            vertexSet.add(h);
        }
        vertices_.push(vertex);
    }
    return vertices_;
}


;// CONCATENATED MODULE: ./src/to-shapes/get-seed-shapes.ts








const { abs: get_seed_shapes_abs, max } = Math;
const TOL = (/* unused pure expression or super */ null && (2 ** -10));
// E.g. 12-4,6-3
// -------------
// 1. Place seed shape (12)
// 2. Shape groups === 4,6-3
// 3. Place 4 on first open polygon edge
// 4. Place 6 on next polygon edge (of same shape)
// 5. Place 3 on first open polygon edge of polygons in previous phase
function get_seed_shapes_getSeedShapes(configuration) {
    const { seedShapeType, shapeGroups } = toEntities(configuration);
    const seedShape = getSeedShape(seedShapeType);
    let shapes = [seedShape];
    let stagePlacement = 1;
    /** Map from line segment hash to number of line segments added */
    const connections = new Map();
    addConnections(connections, seedShape);
    let prevShapes = [seedShape];
    for (const shapeGroup of shapeGroups) {
        const shapesEdges = prevShapes
            .map(s => {
            const { c, θm, sides } = s;
            const ps = fromCentroidAndAngle(c, θm, sides, 1);
            return getShapeEdges(ps);
        })
            .flat()
            .sort((a, b) => {
            if (get_seed_shapes_abs(a[0][0]) < TOL && get_seed_shapes_abs(a[1][0]) < TOL) {
                // vertical line segment passing through origin
                return 1;
            }
            if (get_seed_shapes_abs(b[0][0]) < TOL && get_seed_shapes_abs(b[1][0]) < TOL) {
                // vertical line segment passing through origin
                return -1;
            }
            const ca = getCentroid(a);
            const cb = getCentroid(b);
            return comparePoints(ca, cb);
        });
        prevShapes = [];
        let idx = 0;
        for (let i = 0; i < shapesEdges.length; i++) {
            const sides = shapeGroup[idx];
            const ls = shapesEdges[i];
            const n = getNumberOfConnections(connections, ls);
            if (n > 1) {
                continue;
            }
            if (sides === 0) {
                idx++;
                continue;
            }
            stagePlacement++;
            const shape = fromLineSegment(sides, ls, stagePlacement);
            shapes.push(shape);
            prevShapes.push(shape);
            addConnections(connections, shape);
            idx++;
            if (idx >= shapeGroup.length) {
                break;
            }
        }
    }
    return {
        shapes: [shapes],
        maxStagePlacement: stagePlacement
    };
}
function getNumberOfConnections(connections, ls) {
    const edgeHashes = getTransformPointBuckets(getCentroid(ls));
    const hs = edgeHashes
        .map(h => connections.get(h))
        .filter(h => h !== undefined);
    if (hs.length === 0) {
        return 0;
    }
    return max(...hs);
}
function addConnections(connections, shape) {
    const { c, θm, sides } = shape;
    const ps = fromCentroidAndAngle(c, θm, sides, 1);
    const edges = getShapeEdges(ps);
    const edgeHashess = edges
        .map(ls => getTransformPointBuckets(getCentroid(ls)));
    for (const edgeHashes of edgeHashess) {
        for (const h of edgeHashes) {
            const n = connections.get(h) || 0;
            connections.set(h, n + 1);
        }
    }
}


;// CONCATENATED MODULE: ./src/hash/ceate-buckets.ts
const INITIAL_NUM_BUCKETS_PER_COORD_EXP = 8;
const INITIAL_NUM_BUCKETS_PER_COORD = 2 ** INITIAL_NUM_BUCKETS_PER_COORD_EXP;
/** Returns an array of 4 buckets ordered by quadrant */
function ceate_buckets_createBuckets() {
    const arrLen = (INITIAL_NUM_BUCKETS_PER_COORD ** 2) / 32;
    return [new Uint32Array(arrLen)];
}


;// CONCATENATED MODULE: ./src/hash/get-coordinate-buckets.ts
const { SQRT2: get_coordinate_buckets_SQRT2, round: get_coordinate_buckets_round, abs: get_coordinate_buckets_abs, log2: get_coordinate_buckets_log2, sqrt: get_coordinate_buckets_sqrt, ceil } = Math;
const get_coordinate_buckets_SQRT3 = get_coordinate_buckets_sqrt(3);
/** Number of buckets per unit */
const NUM_BUCKETS_PER_UNIT = ceil(get_coordinate_buckets_log2(1 / (get_coordinate_buckets_SQRT3 / 6 / get_coordinate_buckets_SQRT2)));
// Must be smaller than half the minimum distance (divided by sqrt(2)) between
// any two shape centroids i,e smaller than
// `(SQRT3/6)/SQRT2 === 0.20412414523193148 and a power of 2
const get_coordinate_buckets_BUCKET_SIZE = 2 ** -NUM_BUCKETS_PER_UNIT;
/**
 * Guessed maximum floating point error after all transformations.
 * * A high value was chosen to be sure but it is possible to calculate it
 * exactly though the calculation would be very tedious.
 */
const get_coordinate_buckets_MAX_ABS_ERROR = (/* unused pure expression or super */ null && (2 ** -16));
/**
 * Perform a location sensitive hash (called buckets)
 *
 * * points close to zero are automatically put into bucket 0
 *
 * @param v
 */
function get_coordinate_buckets_getCoordinateBuckets(c) {
    const buckets = [];
    const c_ = get_coordinate_buckets_abs(c);
    const c__ = c_ / get_coordinate_buckets_BUCKET_SIZE;
    const b1 = get_coordinate_buckets_round(c__);
    buckets.push(b1); // usually there's only one bucket per coordinate
    const d = get_coordinate_buckets_abs(c__ - b1);
    if (d >= 0.5 - get_coordinate_buckets_MAX_ABS_ERROR) { // too close to call - put into two buckets
        const b2 = c__ > b1
            ? b1 + 1 // we rounded down
            : b1 - 1; // we rounded up
        buckets.push(b2);
    }
    return buckets;
}


;// CONCATENATED MODULE: ./src/shapes/get-new-shapes.ts

const { max: get_new_shapes_max, sign } = Math;
/**
 *
 * @param buckets Set holding hashes of existing shapes
 * @param shapes new shapes to add
 */
function get_new_shapes_getNewShapes(buckets, shapes) {
    let buckets_ = buckets[0];
    const shapes_ = [];
    for (const shape of shapes) {
        const x = shape.c[0];
        const y = shape.c[1];
        // We pack the buckets into a square around the origin
        const xBuckets = getCoordinateBuckets(x);
        const yBuckets = getCoordinateBuckets(y);
        let found = false;
        for (let i = 0; i < xBuckets.length; i++) {
            for (let j = 0; j < yBuckets.length; j++) {
                const _idx = getIdx(xBuckets[i], yBuckets[j]);
                const idx = 4 * _idx + (x >= 0
                    ? y >= 0 ? 0 : 3
                    : y >= 0 ? 1 : 2);
                const bit = idx % 32;
                const word = (idx - bit) >> 5;
                const mask = (1 << bit);
                if (word > buckets_.length - 1) {
                    const oldBuffer = buckets_;
                    buckets[0] = new Uint32Array(4 * oldBuffer.length);
                    buckets[0].set(oldBuffer);
                    buckets_ = buckets[0];
                }
                else if ((buckets_[word] & mask) !== 0) {
                    found = true;
                }
                buckets_[word] |= mask;
            }
        }
        if (!found) {
            shapes_.push(shape);
        }
    }
    return shapes_;
}
function getIdx(x, y) {
    const a = sign(get_new_shapes_max(x - y + 1, 0)); // lower half (including diagonal)
    const b = a * (y + x ** 2);
    const c = sign(get_new_shapes_max(y - x, 0)); // upper half
    const d = c * (y * (y + 2) - x);
    return b + d;
}

// getIdx(0,0);//?
// getIdx(1,0);//?
// getIdx(2,0);//?
// getIdx(3,0);//?
// getIdx(4,0);//?
// getIdx(0,1);//?
// getIdx(1,1);//?
// getIdx(2,1);//?
// getIdx(3,1);//?
// getIdx(4,1);//?
// getIdx(0,2);//?
// getIdx(1,2);//?
// getIdx(2,2);//?
// getIdx(3,2);//?
// getIdx(4,2);//?
// getIdx(0,3);//?
// getIdx(1,3);//?
// getIdx(2,3);//?
// getIdx(3,3);//?
// getIdx(4,3);//?
// getIdx(0,4);//?
// getIdx(1,4);//?
// getIdx(2,4);//?
// getIdx(3,4);//?
// getIdx(4,4);//?

;// CONCATENATED MODULE: ./src/to-shapes/transform-using-transform-point.ts



function transform_using_transform_point_transformUsingTransformPoint(buckets, newShapesFill, transform, transformPoints) {
    const { pointIndex, transformType } = transform;
    const transformPoint = transformPoints.get(pointIndex);
    const { v, θ2 } = transformPoint;
    // https://www.mdpi.com/2073-8994/13/12/2376
    // "When specifying the vertex of a polygon’s centroid (Figure 11) or
    // vertex (Figure 12), the angle that is used for the transformation is
    // inferred from the angle of that vertex relative to the center of the
    // coordinate system. However, when using the midpoint of a line segment
    // (the polygon’s edge, as shown in Figure 10, right), the angle for the
    // transform is inferred from the angle of that edge..."
    const shapesToAdd = transformType === 'm'
        ? reflectShapes(θ2, v, newShapesFill)
        : rotateShapesAround(12, v, newShapesFill);
    return getNewShapes(buckets, shapesToAdd);
}


;// CONCATENATED MODULE: ./src/to-shapes/transform-using-origin.ts




const { round: transform_using_origin_round } = Math;
function transform_using_origin_transformUsingOrigin(buckets, newShapesGrow, transform) {
    const { angle, transformType } = transform;
    const relevantShapes = newShapesGrow.slice();
    const addedShapes = [];
    const θm = transform_using_origin_round(angle);
    for (let θ = θm; θ <= 24; θ *= 2) {
        const θ2 = -(θ - 6);
        const shapesToAdd = transformType === 'm'
            ? reflectShapes(2 * θ2, zeroVector, relevantShapes)
            : rotateShapesAround(θ, zeroVector, relevantShapes);
        const newShapes = getNewShapes(buckets, shapesToAdd);
        for (const s of newShapes) {
            addedShapes.push(s);
            relevantShapes.push(s);
        }
        ;
    }
    return addedShapes;
}


;// CONCATENATED MODULE: ./src/to-shapes/to-shapes.ts









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
 * @param options an object with the properties of `configuration` which is a
 * string in the GomJauHogg notation (e.g. `6-4-3,3/m30/r(h1)`), `repeatCount`
 * which is the number of times transforms will be repeated (e.g. 10); the number
 * of shapes grow as the square of this number and finally `shapeSize` representing
 * the length of each shape's edge.
 */
function toShapes(configuration, repeatCount, shapeSize) {
    const startTime = performance.now();
    const buckets = createBuckets();
    const { transforms } = toEntities(configuration);
    let { shapes, maxStagePlacement } = getSeedShapes(configuration);
    shapes = [getNewShapes(buckets, shapes.flat())];
    const transformPointsMaps = [];
    // ------------------------------
    // Repeating the Transformations
    // ------------------------------
    let transformPoints = new Map();
    let newShapesGrow = shapes.flat().slice();
    let newShapesFill = shapes.flat().slice();
    let prevWasFill = true;
    let prevWasGrow = true;
    for (let i = 0; i < repeatCount; i++) {
        for (let j = 0; j < transforms.length; j++) {
            const transform = transforms[j];
            if (i === 0) {
                transformPoints = getTransformPoints(shapes.flat());
                transformPointsMaps.push(transformPoints);
            }
            else {
                transformPoints = transformPointsMaps[j];
            }
            const { pointIndex, angle } = transform;
            const addedShapes = !!pointIndex
                ? transformUsingTransformPoint(buckets, newShapesFill, transform, transformPoints)
                : transformUsingOrigin(buckets, newShapesGrow, transform);
            const isGrow = !!pointIndex || angle === 12;
            if (!prevWasFill && !isGrow) {
                newShapesFill = addedShapes.slice();
            }
            else {
                for (const s of addedShapes) {
                    newShapesFill.push(s);
                }
            }
            if (!prevWasGrow && isGrow) {
                newShapesGrow = addedShapes.slice();
            }
            else {
                for (const s of addedShapes) {
                    newShapesGrow.push(s);
                }
            }
            shapes.push(addedShapes);
            prevWasFill = !isGrow;
            prevWasGrow = isGrow;
        }
    }
    const shapes_ = shapes
        .flat().map(shape => {
        const { c, sides, stage, stagePlacement, θm } = shape;
        return {
            sides, stage, stagePlacement, θm,
            c: scaleVector(shapeSize)(c)
        };
    });
    const lastShapes = shapes[shapes.length - 1];
    const lastShape = lastShapes[lastShapes.length - 1];
    const maxStage = lastShape ? lastShape.stage : 0;
    const transformPointsMaps_ = scaleTransformPointsMaps(shapeSize, transformPointsMaps);
    ///////////////////
    const endTime = performance.now();
    // console.log('l', shapes_.length);
    // console.log(((endTime - startTime)).toFixed(1) + ' ms')
    ///////////////////
    const r = {
        shapes: shapes_,
        maxStage,
        maxStagePlacement,
        transformPointsMaps: transformPointsMaps_
    };
    // console.log(r)
    return r;
}

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

;// CONCATENATED MODULE: ./src/index.ts




