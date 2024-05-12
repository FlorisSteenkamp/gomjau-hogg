/******/ var __webpack_modules__ = ({

/***/ "./src/hash/ceate-buckets.ts":
/*!***********************************!*\
  !*** ./src/hash/ceate-buckets.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBuckets: () => (/* binding */ createBuckets)
/* harmony export */ });
const INITIAL_NUM_BUCKETS_PER_COORD_EXP = 8;
const INITIAL_NUM_BUCKETS_PER_COORD = 2 ** INITIAL_NUM_BUCKETS_PER_COORD_EXP;
/** Returns an array of 4 buckets ordered by quadrant */
function createBuckets() {
    const arrLen = (INITIAL_NUM_BUCKETS_PER_COORD ** 2) / 32;
    return [new Uint32Array(arrLen)];
}



/***/ }),

/***/ "./src/hash/get-coordinate-buckets.ts":
/*!********************************************!*\
  !*** ./src/hash/get-coordinate-buckets.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCoordinateBuckets: () => (/* binding */ getCoordinateBuckets)
/* harmony export */ });
const { SQRT2, round, abs, log2, sqrt, ceil } = Math;
const SQRT3 = sqrt(3);
/** Number of buckets per unit */
const NUM_BUCKETS_PER_UNIT = ceil(log2(1 / (SQRT3 / 6 / SQRT2)));
// Must be smaller than half the minimum distance (divided by sqrt(2)) between
// any two shape centroids i,e smaller than
// `(SQRT3/6)/SQRT2 === 0.20412414523193148 and a power of 2
const BUCKET_SIZE = 2 ** -NUM_BUCKETS_PER_UNIT;
/**
 * Guessed maximum floating point error after all transformations.
 * * A high value was chosen to be sure but it is possible to calculate it
 * exactly though the calculation would be very tedious.
 */
const MAX_ABS_ERROR = 2 ** -16;
/**
 * Perform a location sensitive hash (called buckets)
 *
 * * points close to zero are automatically put into bucket 0
 *
 * @param v
 */
function getCoordinateBuckets(c) {
    const buckets = [];
    const c_ = abs(c);
    const c__ = c_ / BUCKET_SIZE;
    const b1 = round(c__);
    buckets.push(b1); // usually there's only one bucket per coordinate
    const d = abs(c__ - b1);
    if (d >= 0.5 - MAX_ABS_ERROR) { // too close to call - put into two buckets
        const b2 = c__ > b1
            ? b1 + 1 // we rounded down
            : b1 - 1; // we rounded up
        buckets.push(b2);
    }
    return buckets;
}



/***/ }),

/***/ "./src/hash/get-transform-point-buckets.ts":
/*!*************************************************!*\
  !*** ./src/hash/get-transform-point-buckets.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTransformPointBuckets: () => (/* binding */ getTransformPointBuckets)
/* harmony export */ });
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
function getTransformPointBuckets(p) {
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



/***/ }),

/***/ "./src/hash/is-bucket-zero.ts":
/*!************************************!*\
  !*** ./src/hash/is-bucket-zero.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBucketZero: () => (/* binding */ isBucketZero)
/* harmony export */ });
function isBucketZero(hashes) {
    return hashes.length === 1 && hashes[0] === 0;
}



/***/ }),

/***/ "./src/shape/from-centroid-and-angle.ts":
/*!**********************************************!*\
  !*** ./src/shape/from-centroid-and-angle.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromCentroidAndAngle: () => (/* binding */ fromCentroidAndAngle)
/* harmony export */ });
/* harmony import */ var _to_shapes_get_seed_shape__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../to-shapes/get-seed-shape */ "./src/to-shapes/get-seed-shape.ts");
/* harmony import */ var _vector_zero_vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vector/zero-vector */ "./src/vector/zero-vector.ts");
/* harmony import */ var _vector_rotate_vector_around__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../vector/rotate-vector-around */ "./src/vector/rotate-vector-around.ts");
/* harmony import */ var _vector_add_vector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../vector/add-vector */ "./src/vector/add-vector.ts");
/* harmony import */ var _vector_scale__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../vector/scale */ "./src/vector/scale.ts");





function fromCentroidAndAngle(c, θm, sides, scaleFactor) {
    const { ps, θm: sθm } = _to_shapes_get_seed_shape__WEBPACK_IMPORTED_MODULE_0__.seedShapes[sides];
    const ps_ = ps
        .map(p => (0,_vector_rotate_vector_around__WEBPACK_IMPORTED_MODULE_2__.rotateVectorAround)(θm + sθm, _vector_zero_vector__WEBPACK_IMPORTED_MODULE_1__.zeroVector, p))
        .map(p => (0,_vector_scale__WEBPACK_IMPORTED_MODULE_4__.scaleVector)(scaleFactor)(p))
        .map(p => (0,_vector_add_vector__WEBPACK_IMPORTED_MODULE_3__.addVector)(p, c));
    return ps_;
}



/***/ }),

/***/ "./src/shape/from-line-segment.ts":
/*!****************************************!*\
  !*** ./src/shape/from-line-segment.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromLineSegment: () => (/* binding */ fromLineSegment)
/* harmony export */ });
/* harmony import */ var _vector_add_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/add-vector */ "./src/vector/add-vector.ts");
/* harmony import */ var _vector_distance_between__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vector/distance-between */ "./src/vector/distance-between.ts");
/* harmony import */ var _vector_subtract_vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../vector/subtract-vector */ "./src/vector/subtract-vector.ts");
/* harmony import */ var _get_centroid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./get-centroid */ "./src/shape/get-centroid.ts");




const { PI, cos, sin, atan2, round } = Math;
function fromLineSegment(sides, ls, stagePlacement) {
    const [v1, v2] = ls;
    const l = (0,_vector_distance_between__WEBPACK_IMPORTED_MODULE_1__.distanceBetween)(v1, v2);
    const v = (0,_vector_subtract_vector__WEBPACK_IMPORTED_MODULE_2__.subtractVector)(v2, v1);
    let θ = atan2(v[1], v[0]) + (2 * PI) / sides;
    const ps = [v1, v2];
    for (let i = 2; i < sides; i++) {
        ps.push((0,_vector_add_vector__WEBPACK_IMPORTED_MODULE_0__.addVector)([cos(θ) * l, sin(θ) * l], ps[i - 1]));
        θ += 2 * PI / sides;
    }
    const ps_ = ps.slice(1).reverse();
    const c = (0,_get_centroid__WEBPACK_IMPORTED_MODULE_3__.getCentroid)([ps[0], ...ps_]);
    return {
        stage: 0,
        stagePlacement,
        c,
        θm: round(θ / PI * 12),
        sides
    };
}



/***/ }),

/***/ "./src/shape/from-sides.ts":
/*!*********************************!*\
  !*** ./src/shape/from-sides.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromSides: () => (/* binding */ fromSides)
/* harmony export */ });
/* harmony import */ var _vector_scale__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/scale */ "./src/vector/scale.ts");
/* harmony import */ var _side_length_div_circumradius__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./side-length-div-circumradius */ "./src/shape/side-length-div-circumradius.ts");


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
    const s = _side_length_div_circumradius__WEBPACK_IMPORTED_MODULE_1__.sidelength_div_circumradius[sides];
    return ps.map((0,_vector_scale__WEBPACK_IMPORTED_MODULE_0__.scaleVector)(1 / s));
}



/***/ }),

/***/ "./src/shape/get-centroid.ts":
/*!***********************************!*\
  !*** ./src/shape/get-centroid.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCentroid: () => (/* binding */ getCentroid)
/* harmony export */ });
function getCentroid(ps) {
    let totalX = 0;
    let totalY = 0;
    const len = ps.length;
    for (let i = 0; i < len; i++) {
        totalX += ps[i][0];
        totalY += ps[i][1];
    }
    return [totalX / len, totalY / len];
}



/***/ }),

/***/ "./src/shape/get-shape-edges.ts":
/*!**************************************!*\
  !*** ./src/shape/get-shape-edges.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getShapeEdges: () => (/* binding */ getShapeEdges)
/* harmony export */ });
function getShapeEdges(ps) {
    return ps.map((p, i) => [p, ps[(i + 1) % ps.length]]);
}



/***/ }),

/***/ "./src/shape/rotate-shape.ts":
/*!***********************************!*\
  !*** ./src/shape/rotate-shape.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rotateShape: () => (/* binding */ rotateShape)
/* harmony export */ });
/* harmony import */ var _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/zero-vector */ "./src/vector/zero-vector.ts");
/* harmony import */ var _vector_rotate_vector_around__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vector/rotate-vector-around */ "./src/vector/rotate-vector-around.ts");


/**
 *
 * @param θ
 * @param v
 * @param shape
 * @returns
 */
function rotateShape(θm, ps) {
    return ps.map(p => (0,_vector_rotate_vector_around__WEBPACK_IMPORTED_MODULE_1__.rotateVectorAround)(θm, _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__.zeroVector, p));
}



/***/ }),

/***/ "./src/shape/side-length-div-circumradius.ts":
/*!***************************************************!*\
  !*** ./src/shape/side-length-div-circumradius.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sidelength_div_circumradius: () => (/* binding */ sidelength_div_circumradius)
/* harmony export */ });
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



/***/ }),

/***/ "./src/shapes/compare-points.ts":
/*!**************************************!*\
  !*** ./src/shapes/compare-points.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   comparePoints: () => (/* binding */ comparePoints)
/* harmony export */ });
/* harmony import */ var _vector_angle_equals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/angle-equals */ "./src/vector/angle-equals.ts");
/* harmony import */ var _vector_get_angle_clockwise_from_y_axis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vector/get-angle-clockwise-from-y-axis */ "./src/vector/get-angle-clockwise-from-y-axis.ts");


const { PI, hypot } = Math;
const ANGLE_PRECISION = 2 ** -10;
function comparePoints(a, b) {
    const _θa = (0,_vector_get_angle_clockwise_from_y_axis__WEBPACK_IMPORTED_MODULE_1__.getAngleClockwiseFromYAxis)(a);
    const _θb = (0,_vector_get_angle_clockwise_from_y_axis__WEBPACK_IMPORTED_MODULE_1__.getAngleClockwiseFromYAxis)(b);
    const θa = _θa > 2 * PI - ANGLE_PRECISION ? 0 : _θa;
    const θb = _θb > 2 * PI - ANGLE_PRECISION ? 0 : _θb;
    if ((0,_vector_angle_equals__WEBPACK_IMPORTED_MODULE_0__.angleEquals)(θa, θb)) {
        return hypot(...a) - hypot(...b);
    }
    return θa - θb;
}



/***/ }),

/***/ "./src/shapes/get-new-shapes.ts":
/*!**************************************!*\
  !*** ./src/shapes/get-new-shapes.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getNewShapes: () => (/* binding */ getNewShapes)
/* harmony export */ });
/* harmony import */ var _hash_get_coordinate_buckets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hash/get-coordinate-buckets */ "./src/hash/get-coordinate-buckets.ts");

const { max, sign } = Math;
/**
 *
 * @param buckets Set holding hashes of existing shapes
 * @param shapes new shapes to add
 */
function getNewShapes(buckets, shapes) {
    let buckets_ = buckets[0];
    const shapes_ = [];
    for (const shape of shapes) {
        const x = shape.c[0];
        const y = shape.c[1];
        // We pack the buckets into a square around the origin
        const xBuckets = (0,_hash_get_coordinate_buckets__WEBPACK_IMPORTED_MODULE_0__.getCoordinateBuckets)(x);
        const yBuckets = (0,_hash_get_coordinate_buckets__WEBPACK_IMPORTED_MODULE_0__.getCoordinateBuckets)(y);
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
    const a = sign(max(x - y + 1, 0)); // lower half (including diagonal)
    const b = a * (y + x ** 2);
    const c = sign(max(y - x, 0)); // upper half
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


/***/ }),

/***/ "./src/shapes/get-transform-points.ts":
/*!********************************************!*\
  !*** ./src/shapes/get-transform-points.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTransformPoints: () => (/* binding */ getTransformPoints)
/* harmony export */ });
/* harmony import */ var _shape_get_centroid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shape/get-centroid */ "./src/shape/get-centroid.ts");
/* harmony import */ var _hash_get_transform_point_buckets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hash/get-transform-point-buckets */ "./src/hash/get-transform-point-buckets.ts");
/* harmony import */ var _hash_is_bucket_zero__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hash/is-bucket-zero */ "./src/hash/is-bucket-zero.ts");
/* harmony import */ var _shape_get_shape_edges__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shape/get-shape-edges */ "./src/shape/get-shape-edges.ts");
/* harmony import */ var _shape_from_centroid_and_angle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shape/from-centroid-and-angle */ "./src/shape/from-centroid-and-angle.ts");
/* harmony import */ var _vector_add_vector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../vector/add-vector */ "./src/vector/add-vector.ts");
/* harmony import */ var _vector_subtract_vector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../vector/subtract-vector */ "./src/vector/subtract-vector.ts");
/* harmony import */ var _compare_points__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./compare-points */ "./src/shapes/compare-points.ts");








const { PI, round, atan2 } = Math;
function getTransformPoints(shapes) {
    const transformPoints = [];
    // --------------
    // Centroids (c)
    // --------------
    for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];
        const { c, θm, sides } = s;
        const ps = (0,_shape_from_centroid_and_angle__WEBPACK_IMPORTED_MODULE_4__.fromCentroidAndAngle)(c, θm, sides, 1);
        const v = (0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_0__.getCentroid)(ps);
        const θ2 = round(2 * atan2(v[0], -v[1]) / PI * 12);
        transformPoints.push({ v, θ2, pointType: 'c', index: 0 });
    }
    // -------------------------------
    // Vertices (v) and Midpoints (h)
    // -------------------------------
    const edges = shapes.map(shape => {
        const { c, θm, sides } = shape;
        const ps = (0,_shape_from_centroid_and_angle__WEBPACK_IMPORTED_MODULE_4__.fromCentroidAndAngle)(c, θm, sides, 1);
        return (0,_shape_get_shape_edges__WEBPACK_IMPORTED_MODULE_3__.getShapeEdges)(ps);
    }).flat();
    for (const ls of edges) {
        {
            const v = ls[0];
            const c = (0,_vector_subtract_vector__WEBPACK_IMPORTED_MODULE_6__.subtractVector)((0,_vector_add_vector__WEBPACK_IMPORTED_MODULE_5__.addVector)(v, [-v[1], v[0]]), v);
            const θ2 = round(atan2(c[1], c[0]) / PI * 12);
            transformPoints.push({
                v, θ2,
                pointType: 'v',
                index: 0
            });
        }
        {
            const v = (0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_0__.getCentroid)(ls);
            const c = (0,_vector_subtract_vector__WEBPACK_IMPORTED_MODULE_6__.subtractVector)(ls[1], v);
            const θ2 = round(2 * atan2(c[1], c[0]) / PI * 12);
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
        .sort((a, b) => (0,_compare_points__WEBPACK_IMPORTED_MODULE_7__.comparePoints)(a.v, b.v))
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
        const hashes = (0,_hash_get_transform_point_buckets__WEBPACK_IMPORTED_MODULE_1__.getTransformPointBuckets)(vertex.v);
        if ((0,_hash_is_bucket_zero__WEBPACK_IMPORTED_MODULE_2__.isBucketZero)(hashes)) {
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



/***/ }),

/***/ "./src/shapes/reflect-shapes.ts":
/*!**************************************!*\
  !*** ./src/shapes/reflect-shapes.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reflectShapes: () => (/* binding */ reflectShapes)
/* harmony export */ });
/* harmony import */ var _vector_reflect_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/reflect-vector */ "./src/vector/reflect-vector.ts");

function reflectShapes(θ2, v, shapes) {
    const shapes_ = [];
    const stage = shapes[0].stage + 1;
    for (const shape of shapes) {
        const c_ = (0,_vector_reflect_vector__WEBPACK_IMPORTED_MODULE_0__.reflectVector)(θ2, v, shape.c);
        const θm = (θ2 - shape.θm + 12) % 24;
        const { sides, stagePlacement } = shape;
        shapes_.push({
            sides, stage, stagePlacement,
            c: c_,
            θm
        });
    }
    return shapes_;
}



/***/ }),

/***/ "./src/shapes/rotate-shapes.ts":
/*!*************************************!*\
  !*** ./src/shapes/rotate-shapes.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rotateShapesAround: () => (/* binding */ rotateShapesAround)
/* harmony export */ });
/* harmony import */ var _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/zero-vector */ "./src/vector/zero-vector.ts");
/* harmony import */ var _vector_rotate_vector_around__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vector/rotate-vector-around */ "./src/vector/rotate-vector-around.ts");


function rotateShapesAround(θm, v = _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__.zeroVector, shapes) {
    const stage = shapes[0].stage + 1;
    const shapes_ = [];
    for (const shape of shapes) {
        const c_ = (0,_vector_rotate_vector_around__WEBPACK_IMPORTED_MODULE_1__.rotateVectorAround)(θm, v, shape.c);
        const { sides, stagePlacement } = shape;
        shapes_.push({
            sides, stage, stagePlacement,
            c: c_,
            θm: (θm + shape.θm) % 24,
        });
    }
    return shapes_;
}



/***/ }),

/***/ "./src/to-entities.ts":
/*!****************************!*\
  !*** ./src/to-entities.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toEntities: () => (/* binding */ toEntities)
/* harmony export */ });
function to15DegIntervals(s) {
    switch (s) {
        case '30': return 2;
        case '45': return 3;
        case '60': return 4;
        case '90': return 6;
        case '180': return 12;
    }
}
function toEntities(configuration) {
    // E.g: '3-4-3,3/m30/m(4)'
    // E.g: '3-4-3,3/m30/m(h2)'
    const [shapes, ...transformsStr] = configuration.split('/');
    // shapes === '3-4-3,3'
    // transforms === ['m30','m(4)']
    const shapes_ = shapes
        .split('-')
        .map(group => group
        .split(',')
        .map(shape => Number.parseInt(shape)));
    // shapes_ === [[3],[4],[3,3]]
    ensureShapeGroupsCorrect(configuration, shapes_);
    const [[seedShapeType], ...shapeGroups] = shapes_;
    // shapeSeed === 3
    // shapeGroups === [[4],[3,3]]
    const transforms = transformsStr
        .map(toTransform)
        .filter(Boolean);
    // transformEntities === [{
    //     action: "m",
    //     actionAngle: 0.5235987755982988,
    //     pointIndex: 0,
    //     string: "m30"
    // }, {
    //     action: "m",
    //     pointIndex: 4,
    //     point: {
    //         "v": { "x": -5.684341886080802e-14, "y": -89.59244838580928 },
    //         "θ": 0,
    //         "pt": "l"
    //     },
    //     string: "m(4)",
    // }]
    return { seedShapeType, shapeGroups, transforms };
}
/**
 * Returns a `Transform` given a string (e.g. 'm45' or 'r(h1)')
 * @param transform
 * @returns
 */
function toTransform(transform) {
    const match = /([mr])([\d.]*)?\(?([cvh\d]+)?\)?/i.exec(transform);
    // E.g. 'm'
    // E.g. 'm45'
    // E.g. 'r(v15)'
    if (match) {
        const [, transformType, angleStr = '180', pointIndex,] = match;
        if (angleStr !== '30' && angleStr !== '45' && angleStr !== '60' &&
            angleStr !== '90' && angleStr !== '180') {
            throw new Error(`Angle must be 30,45,60,90 or 180 degrees, but found ${angleStr}`);
        }
        return {
            transformType,
            angle: pointIndex ? undefined : to15DegIntervals(angleStr),
            origin: undefined,
            pointIndex: pointIndex ? pointIndex : '',
            string: transform,
        };
    }
}
function ensureShapeGroupsCorrect(configuration, shapeGroups) {
    for (const shapeGroup of shapeGroups) {
        for (const shape of shapeGroup) {
            if (shape !== 0 &&
                shape !== 3 && shape !== 4 && shape !== 6 &&
                shape !== 8 && shape !== 12) {
                throw new Error(`Shape must be 0,3,4,6,8 or 12, but found ${shape} - ${configuration}`);
            }
        }
    }
}



/***/ }),

/***/ "./src/to-shapes/errors.ts":
/*!*********************************!*\
  !*** ./src/to-shapes/errors.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorInvalidShape: () => (/* binding */ ErrorInvalidShape),
/* harmony export */   ErrorSeed: () => (/* binding */ ErrorSeed),
/* harmony export */   ErrorTransformAngleZero: () => (/* binding */ ErrorTransformAngleZero),
/* harmony export */   ErrorTransformNoChange: () => (/* binding */ ErrorTransformNoChange),
/* harmony export */   ErrorTransformNoIntersectionPoint: () => (/* binding */ ErrorTransformNoIntersectionPoint)
/* harmony export */ });
const ErrorSeed = () => ({
    code: 'ErrorSeed',
    type: 'Seed Shape',
    message: 'The seed shape must be one of 3, 4, 6, 8 or 12, directly followed by a `-` to indicate the start of the next shape group.',
});
const ErrorInvalidShape = () => ({
    code: 'ErrorShape',
    type: 'Invalid Shape',
    message: 'Shapes must only be one of 3, 4, 6, 8, or 12.',
});
const ErrorTransformAngleZero = (transform) => ({
    code: 'ErrorTransformAngle',
    type: 'Transform Angle',
    message: `The angle of the "${transform}" transform must be greater than 0.`,
});
const ErrorTransformNoChange = () => ({
    code: 'ErrorTransformNoChange',
    type: 'Repeated Transform',
    message: 'The covered area did not increase when the tile was repeated. ' +
        'This is likely caused by one or more incorrect transforms.'
});
const ErrorTransformNoIntersectionPoint = (transform) => ({
    code: 'ErrorTransformNoIntersectionPoint',
    type: 'Transform Intersection Point',
    message: `No intersection point found for the "${transform}" transform.`,
});



/***/ }),

/***/ "./src/to-shapes/get-seed-shape.ts":
/*!*****************************************!*\
  !*** ./src/to-shapes/get-seed-shape.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSeedShape: () => (/* binding */ getSeedShape),
/* harmony export */   seedShapes: () => (/* binding */ seedShapes)
/* harmony export */ });
/* harmony import */ var _shape_from_sides__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shape/from-sides */ "./src/shape/from-sides.ts");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors */ "./src/to-shapes/errors.ts");
/* harmony import */ var _shape_rotate_shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shape/rotate-shape */ "./src/shape/rotate-shape.ts");



const { sqrt } = Math;
const SQRT3 = sqrt(3);
const seedShapes = {
    3: { ps: (0,_shape_rotate_shape__WEBPACK_IMPORTED_MODULE_2__.rotateShape)(-2, (0,_shape_from_sides__WEBPACK_IMPORTED_MODULE_0__.fromSides)(3)), θm: 0 },
    4: { ps: (0,_shape_rotate_shape__WEBPACK_IMPORTED_MODULE_2__.rotateShape)(9, (0,_shape_from_sides__WEBPACK_IMPORTED_MODULE_0__.fromSides)(4)), θm: 0 },
    6: { ps: (0,_shape_rotate_shape__WEBPACK_IMPORTED_MODULE_2__.rotateShape)(6, (0,_shape_from_sides__WEBPACK_IMPORTED_MODULE_0__.fromSides)(6)), θm: -6 },
    8: { ps: (0,_shape_rotate_shape__WEBPACK_IMPORTED_MODULE_2__.rotateShape)(7.5, (0,_shape_from_sides__WEBPACK_IMPORTED_MODULE_0__.fromSides)(8)), θm: 0 },
    12: { ps: (0,_shape_rotate_shape__WEBPACK_IMPORTED_MODULE_2__.rotateShape)(7, (0,_shape_from_sides__WEBPACK_IMPORTED_MODULE_0__.fromSides)(12)), θm: 0 }
};
/**
 * Returns a seed shape based on the given number of sides.
 *
 * * the side length of the returned shapes === 1
 */
function getSeedShape(sides) {
    if (sides !== 3 && sides !== 4 && sides !== 6 && sides !== 8 && sides !== 12) {
        throw (0,_errors__WEBPACK_IMPORTED_MODULE_1__.ErrorSeed)();
    }
    return {
        sides,
        // c: sides === 3 ? [0.5, SQRT3/2] : [0,0],
        c: sides === 3 ? [SQRT3 / 6, 0.5] : [0, 0],
        θm: sides === 3 ? 2 : sides === 6 ? -6 : 0,
        stage: 0,
        stagePlacement: 1
    };
}



/***/ }),

/***/ "./src/to-shapes/get-seed-shapes.ts":
/*!******************************************!*\
  !*** ./src/to-shapes/get-seed-shapes.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSeedShapes: () => (/* binding */ getSeedShapes)
/* harmony export */ });
/* harmony import */ var _to_entities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../to-entities */ "./src/to-entities.ts");
/* harmony import */ var _get_seed_shape__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get-seed-shape */ "./src/to-shapes/get-seed-shape.ts");
/* harmony import */ var _shape_from_line_segment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shape/from-line-segment */ "./src/shape/from-line-segment.ts");
/* harmony import */ var _hash_get_transform_point_buckets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hash/get-transform-point-buckets */ "./src/hash/get-transform-point-buckets.ts");
/* harmony import */ var _shape_get_centroid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shape/get-centroid */ "./src/shape/get-centroid.ts");
/* harmony import */ var _shape_get_shape_edges__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shape/get-shape-edges */ "./src/shape/get-shape-edges.ts");
/* harmony import */ var _shape_from_centroid_and_angle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shape/from-centroid-and-angle */ "./src/shape/from-centroid-and-angle.ts");
/* harmony import */ var _shapes_compare_points__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shapes/compare-points */ "./src/shapes/compare-points.ts");








const { abs, max } = Math;
const TOL = 2 ** -10;
// E.g. 12-4,6-3
// -------------
// 1. Place seed shape (12)
// 2. Shape groups === 4,6-3
// 3. Place 4 on first open polygon edge
// 4. Place 6 on next polygon edge (of same shape)
// 5. Place 3 on first open polygon edge of polygons in previous phase
function getSeedShapes(configuration) {
    const { seedShapeType, shapeGroups } = (0,_to_entities__WEBPACK_IMPORTED_MODULE_0__.toEntities)(configuration);
    const seedShape = (0,_get_seed_shape__WEBPACK_IMPORTED_MODULE_1__.getSeedShape)(seedShapeType);
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
            const ps = (0,_shape_from_centroid_and_angle__WEBPACK_IMPORTED_MODULE_6__.fromCentroidAndAngle)(c, θm, sides, 1);
            return (0,_shape_get_shape_edges__WEBPACK_IMPORTED_MODULE_5__.getShapeEdges)(ps);
        })
            .flat()
            .sort((a, b) => {
            if (abs(a[0][0]) < TOL && abs(a[1][0]) < TOL) {
                // vertical line segment passing through origin
                return 1;
            }
            if (abs(b[0][0]) < TOL && abs(b[1][0]) < TOL) {
                // vertical line segment passing through origin
                return -1;
            }
            const ca = (0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_4__.getCentroid)(a);
            const cb = (0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_4__.getCentroid)(b);
            return (0,_shapes_compare_points__WEBPACK_IMPORTED_MODULE_7__.comparePoints)(ca, cb);
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
            const shape = (0,_shape_from_line_segment__WEBPACK_IMPORTED_MODULE_2__.fromLineSegment)(sides, ls, stagePlacement);
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
    const edgeHashes = (0,_hash_get_transform_point_buckets__WEBPACK_IMPORTED_MODULE_3__.getTransformPointBuckets)((0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_4__.getCentroid)(ls));
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
    const ps = (0,_shape_from_centroid_and_angle__WEBPACK_IMPORTED_MODULE_6__.fromCentroidAndAngle)(c, θm, sides, 1);
    const edges = (0,_shape_get_shape_edges__WEBPACK_IMPORTED_MODULE_5__.getShapeEdges)(ps);
    const edgeHashess = edges
        .map(ls => (0,_hash_get_transform_point_buckets__WEBPACK_IMPORTED_MODULE_3__.getTransformPointBuckets)((0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_4__.getCentroid)(ls)));
    for (const edgeHashes of edgeHashess) {
        for (const h of edgeHashes) {
            const n = connections.get(h) || 0;
            connections.set(h, n + 1);
        }
    }
}



/***/ }),

/***/ "./src/to-shapes/scale-transform-points-map.ts":
/*!*****************************************************!*\
  !*** ./src/to-shapes/scale-transform-points-map.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scaleTransformPointsMaps: () => (/* binding */ scaleTransformPointsMaps)
/* harmony export */ });
/* harmony import */ var _vector_scale__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/scale */ "./src/vector/scale.ts");

function scaleTransformPointsMaps(shapeSize, transformPointsMaps) {
    const maps = [];
    for (const m of transformPointsMaps) {
        const map = new Map();
        for (const [k, pt] of m) {
            map.set(k, {
                ...pt,
                v: (0,_vector_scale__WEBPACK_IMPORTED_MODULE_0__.scaleVector)(shapeSize)(pt.v)
            });
        }
        maps.push(map);
    }
    return maps;
}



/***/ }),

/***/ "./src/to-shapes/to-shapes.ts":
/*!************************************!*\
  !*** ./src/to-shapes/to-shapes.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toShapes: () => (/* binding */ toShapes)
/* harmony export */ });
/* harmony import */ var _to_entities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../to-entities */ "./src/to-entities.ts");
/* harmony import */ var _shapes_get_transform_points__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shapes/get-transform-points */ "./src/shapes/get-transform-points.ts");
/* harmony import */ var _get_seed_shapes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./get-seed-shapes */ "./src/to-shapes/get-seed-shapes.ts");
/* harmony import */ var _scale_transform_points_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scale-transform-points-map */ "./src/to-shapes/scale-transform-points-map.ts");
/* harmony import */ var _hash_ceate_buckets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hash/ceate-buckets */ "./src/hash/ceate-buckets.ts");
/* harmony import */ var _shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shapes/get-new-shapes */ "./src/shapes/get-new-shapes.ts");
/* harmony import */ var _transform_using_transform_point__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transform-using-transform-point */ "./src/to-shapes/transform-using-transform-point.ts");
/* harmony import */ var _transform_using_origin__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./transform-using-origin */ "./src/to-shapes/transform-using-origin.ts");
/* harmony import */ var _vector_scale__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../vector/scale */ "./src/vector/scale.ts");









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
    const buckets = (0,_hash_ceate_buckets__WEBPACK_IMPORTED_MODULE_4__.createBuckets)();
    const { transforms } = (0,_to_entities__WEBPACK_IMPORTED_MODULE_0__.toEntities)(configuration);
    let { shapes, maxStagePlacement } = (0,_get_seed_shapes__WEBPACK_IMPORTED_MODULE_2__.getSeedShapes)(configuration);
    shapes = [(0,_shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_5__.getNewShapes)(buckets, shapes.flat())];
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
                transformPoints = (0,_shapes_get_transform_points__WEBPACK_IMPORTED_MODULE_1__.getTransformPoints)(shapes.flat());
                transformPointsMaps.push(transformPoints);
            }
            else {
                transformPoints = transformPointsMaps[j];
            }
            const { pointIndex, angle } = transform;
            const addedShapes = !!pointIndex
                ? (0,_transform_using_transform_point__WEBPACK_IMPORTED_MODULE_6__.transformUsingTransformPoint)(buckets, newShapesFill, transform, transformPoints)
                : (0,_transform_using_origin__WEBPACK_IMPORTED_MODULE_7__.transformUsingOrigin)(buckets, newShapesGrow, transform);
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
            c: (0,_vector_scale__WEBPACK_IMPORTED_MODULE_8__.scaleVector)(shapeSize)(c)
        };
    });
    const lastShapes = shapes[shapes.length - 1];
    const lastShape = lastShapes[lastShapes.length - 1];
    const maxStage = lastShape ? lastShape.stage : 0;
    const transformPointsMaps_ = (0,_scale_transform_points_map__WEBPACK_IMPORTED_MODULE_3__.scaleTransformPointsMaps)(shapeSize, transformPointsMaps);
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


/***/ }),

/***/ "./src/to-shapes/transform-using-origin.ts":
/*!*************************************************!*\
  !*** ./src/to-shapes/transform-using-origin.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   transformUsingOrigin: () => (/* binding */ transformUsingOrigin)
/* harmony export */ });
/* harmony import */ var _shapes_rotate_shapes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shapes/rotate-shapes */ "./src/shapes/rotate-shapes.ts");
/* harmony import */ var _vector_zero_vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vector/zero-vector */ "./src/vector/zero-vector.ts");
/* harmony import */ var _shapes_reflect_shapes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shapes/reflect-shapes */ "./src/shapes/reflect-shapes.ts");
/* harmony import */ var _shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shapes/get-new-shapes */ "./src/shapes/get-new-shapes.ts");




const { round } = Math;
function transformUsingOrigin(buckets, newShapesGrow, transform) {
    const { angle, transformType } = transform;
    const relevantShapes = newShapesGrow.slice();
    const addedShapes = [];
    const θm = round(angle);
    for (let θ = θm; θ <= 24; θ *= 2) {
        const θ2 = -(θ - 6);
        const shapesToAdd = transformType === 'm'
            ? (0,_shapes_reflect_shapes__WEBPACK_IMPORTED_MODULE_2__.reflectShapes)(2 * θ2, _vector_zero_vector__WEBPACK_IMPORTED_MODULE_1__.zeroVector, relevantShapes)
            : (0,_shapes_rotate_shapes__WEBPACK_IMPORTED_MODULE_0__.rotateShapesAround)(θ, _vector_zero_vector__WEBPACK_IMPORTED_MODULE_1__.zeroVector, relevantShapes);
        const newShapes = (0,_shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_3__.getNewShapes)(buckets, shapesToAdd);
        for (const s of newShapes) {
            addedShapes.push(s);
            relevantShapes.push(s);
        }
        ;
    }
    return addedShapes;
}



/***/ }),

/***/ "./src/to-shapes/transform-using-transform-point.ts":
/*!**********************************************************!*\
  !*** ./src/to-shapes/transform-using-transform-point.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   transformUsingTransformPoint: () => (/* binding */ transformUsingTransformPoint)
/* harmony export */ });
/* harmony import */ var _shapes_rotate_shapes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shapes/rotate-shapes */ "./src/shapes/rotate-shapes.ts");
/* harmony import */ var _shapes_reflect_shapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shapes/reflect-shapes */ "./src/shapes/reflect-shapes.ts");
/* harmony import */ var _shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shapes/get-new-shapes */ "./src/shapes/get-new-shapes.ts");



function transformUsingTransformPoint(buckets, newShapesFill, transform, transformPoints) {
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
        ? (0,_shapes_reflect_shapes__WEBPACK_IMPORTED_MODULE_1__.reflectShapes)(θ2, v, newShapesFill)
        : (0,_shapes_rotate_shapes__WEBPACK_IMPORTED_MODULE_0__.rotateShapesAround)(12, v, newShapesFill);
    return (0,_shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_2__.getNewShapes)(buckets, shapesToAdd);
}



/***/ }),

/***/ "./src/vector/add-vector.ts":
/*!**********************************!*\
  !*** ./src/vector/add-vector.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addVector: () => (/* binding */ addVector)
/* harmony export */ });
function addVector(v1, v2) {
    return [
        v1[0] + v2[0],
        v1[1] + v2[1]
    ];
}



/***/ }),

/***/ "./src/vector/angle-equals.ts":
/*!************************************!*\
  !*** ./src/vector/angle-equals.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   angleEquals: () => (/* binding */ angleEquals)
/* harmony export */ });
const { PI, abs } = Math;
const ANGLE_PRECISION = 2 ** -10;
function angleEquals(θa, θb) {
    let d = abs(θa - θb);
    d = d < PI ? d : abs(2 * PI - d);
    return d <= ANGLE_PRECISION;
}



/***/ }),

/***/ "./src/vector/distance-between.ts":
/*!****************************************!*\
  !*** ./src/vector/distance-between.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   distanceBetween: () => (/* binding */ distanceBetween)
/* harmony export */ });
/* harmony import */ var _zero_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./zero-vector */ "./src/vector/zero-vector.ts");

const { hypot } = Math;
function distanceBetween(v1, v2 = _zero_vector__WEBPACK_IMPORTED_MODULE_0__.zeroVector) {
    return hypot(v1[0] - v2[0], v1[1] - v2[1]);
}



/***/ }),

/***/ "./src/vector/get-angle-clockwise-from-y-axis.ts":
/*!*******************************************************!*\
  !*** ./src/vector/get-angle-clockwise-from-y-axis.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAngleClockwiseFromYAxis: () => (/* binding */ getAngleClockwiseFromYAxis)
/* harmony export */ });
const { PI, atan2 } = Math;
function getAngleClockwiseFromYAxis(v) {
    const [x, y] = v;
    const θ = (2 * PI) - (atan2(y, x) - PI / 2 + 2 * PI) % (2 * PI);
    return θ;
}



/***/ }),

/***/ "./src/vector/reflect-vector.ts":
/*!**************************************!*\
  !*** ./src/vector/reflect-vector.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reflectVector: () => (/* binding */ reflectVector)
/* harmony export */ });
const { PI, cos, sin } = Math;
function reflectVector(θm, v, p) {
    const cx = v[0];
    const cy = v[1];
    const vx = p[0] - cx;
    const vy = p[1] - cy;
    const cosθ = cos(θm * PI / 12);
    const sinθ = sin(θm * PI / 12);
    return [
        cosθ * vx + sinθ * vy + cx,
        sinθ * vx - cosθ * vy + cy
    ];
}



/***/ }),

/***/ "./src/vector/rotate-vector-around.ts":
/*!********************************************!*\
  !*** ./src/vector/rotate-vector-around.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rotateVectorAround: () => (/* binding */ rotateVectorAround)
/* harmony export */ });
/* harmony import */ var _zero_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./zero-vector */ "./src/vector/zero-vector.ts");

const { PI, sin, cos } = Math;
/**
 * Returns the result of rotating a vector around a specified point.
 *
 * @param θ angle
 * @param c center of rotation
 */
function rotateVectorAround(θm, c = _zero_vector__WEBPACK_IMPORTED_MODULE_0__.zeroVector, v) {
    const x = v[0];
    const y = v[1];
    const θ = θm * PI / 12;
    const cosθ = cos(θ);
    const sinθ = sin(θ);
    const [cx, cy] = c;
    const vx = x - cx;
    const vy = y - cy;
    return [
        cosθ * vx - sinθ * vy + cx,
        sinθ * vx + cosθ * vy + cy
    ];
}



/***/ }),

/***/ "./src/vector/scale.ts":
/*!*****************************!*\
  !*** ./src/vector/scale.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scaleVector: () => (/* binding */ scaleVector)
/* harmony export */ });
function scaleVector(s) {
    return (v) => {
        return [s * v[0], s * v[1]];
    };
}



/***/ }),

/***/ "./src/vector/subtract-vector.ts":
/*!***************************************!*\
  !*** ./src/vector/subtract-vector.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   subtractVector: () => (/* binding */ subtractVector)
/* harmony export */ });
/**
 * Returns `v1 - v2`.
 */
function subtractVector(v1, v2) {
    return [
        v1[0] - v2[0],
        v1[1] - v2[1]
    ];
}



/***/ }),

/***/ "./src/vector/zero-vector.ts":
/*!***********************************!*\
  !*** ./src/vector/zero-vector.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   zeroVector: () => (/* binding */ zeroVector)
/* harmony export */ });
const zeroVector = [0, 0];



/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromCentroidAndAngle: () => (/* reexport safe */ _shape_from_centroid_and_angle__WEBPACK_IMPORTED_MODULE_1__.fromCentroidAndAngle),
/* harmony export */   toShapes: () => (/* reexport safe */ _to_shapes_to_shapes__WEBPACK_IMPORTED_MODULE_0__.toShapes)
/* harmony export */ });
/* harmony import */ var _to_shapes_to_shapes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./to-shapes/to-shapes */ "./src/to-shapes/to-shapes.ts");
/* harmony import */ var _shape_from_centroid_and_angle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shape/from-centroid-and-angle */ "./src/shape/from-centroid-and-angle.ts");




})();


//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Qjs7Ozs7Ozs7Ozs7Ozs7O0FDUHRCOztHQUVHO0FBQ0gsU0FBUyxjQUFjLENBQUMsRUFBWSxFQUFFLEVBQVk7SUFDOUMsT0FBTztRQUNILEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDaEIsQ0FBQztBQUNOLENBQUM7QUFHd0I7Ozs7Ozs7Ozs7Ozs7OztBQ1h6QixNQUFNLFVBQVUsR0FBYSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztBQUdkOzs7Ozs7O1NDSnJCO1NBQ0E7O1NBRUE7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7O1NBRUE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05pRDtBQU1zQjtBQVd0RSIsInNvdXJjZXMiOlsid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL2hhc2gvY2VhdGUtYnVja2V0cy50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy8uL3NyYy9oYXNoL2dldC1jb29yZGluYXRlLWJ1Y2tldHMudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvaGFzaC9nZXQtdHJhbnNmb3JtLXBvaW50LWJ1Y2tldHMudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvaGFzaC9pcy1idWNrZXQtemVyby50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy8uL3NyYy9zaGFwZS9mcm9tLWNlbnRyb2lkLWFuZC1hbmdsZS50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy8uL3NyYy9zaGFwZS9mcm9tLWxpbmUtc2VnbWVudC50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy8uL3NyYy9zaGFwZS9mcm9tLXNpZGVzLnRzIiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL3NoYXBlL2dldC1jZW50cm9pZC50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy8uL3NyYy9zaGFwZS9nZXQtc2hhcGUtZWRnZXMudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvc2hhcGUvcm90YXRlLXNoYXBlLnRzIiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL3NoYXBlL3NpZGUtbGVuZ3RoLWRpdi1jaXJjdW1yYWRpdXMudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvc2hhcGVzL2NvbXBhcmUtcG9pbnRzLnRzIiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL3NoYXBlcy9nZXQtbmV3LXNoYXBlcy50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy8uL3NyYy9zaGFwZXMvZ2V0LXRyYW5zZm9ybS1wb2ludHMudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvc2hhcGVzL3JlZmxlY3Qtc2hhcGVzLnRzIiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL3NoYXBlcy9yb3RhdGUtc2hhcGVzLnRzIiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL3RvLWVudGl0aWVzLnRzIiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL3RvLXNoYXBlcy9lcnJvcnMudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvdG8tc2hhcGVzL2dldC1zZWVkLXNoYXBlLnRzIiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL3RvLXNoYXBlcy9nZXQtc2VlZC1zaGFwZXMudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvdG8tc2hhcGVzL3NjYWxlLXRyYW5zZm9ybS1wb2ludHMtbWFwLnRzIiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL3RvLXNoYXBlcy90by1zaGFwZXMudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvdG8tc2hhcGVzL3RyYW5zZm9ybS11c2luZy1vcmlnaW4udHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvdG8tc2hhcGVzL3RyYW5zZm9ybS11c2luZy10cmFuc2Zvcm0tcG9pbnQudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvdmVjdG9yL2FkZC12ZWN0b3IudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvdmVjdG9yL2FuZ2xlLWVxdWFscy50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy8uL3NyYy92ZWN0b3IvZGlzdGFuY2UtYmV0d2Vlbi50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy8uL3NyYy92ZWN0b3IvZ2V0LWFuZ2xlLWNsb2Nrd2lzZS1mcm9tLXktYXhpcy50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy8uL3NyYy92ZWN0b3IvcmVmbGVjdC12ZWN0b3IudHMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvLi9zcmMvdmVjdG9yL3JvdGF0ZS12ZWN0b3ItYXJvdW5kLnRzIiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL3ZlY3Rvci9zY2FsZS50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy8uL3NyYy92ZWN0b3Ivc3VidHJhY3QtdmVjdG9yLnRzIiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL3ZlY3Rvci96ZXJvLXZlY3Rvci50cyIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZ29tamF1LWhvZ2cvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9nb21qYXUtaG9nZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2dvbWphdS1ob2dnLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5jb25zdCBJTklUSUFMX05VTV9CVUNLRVRTX1BFUl9DT09SRF9FWFAgPSA4O1xyXG5jb25zdCBJTklUSUFMX05VTV9CVUNLRVRTX1BFUl9DT09SRCA9IDIqKklOSVRJQUxfTlVNX0JVQ0tFVFNfUEVSX0NPT1JEX0VYUDtcclxuXHJcblxyXG4vKiogUmV0dXJucyBhbiBhcnJheSBvZiA0IGJ1Y2tldHMgb3JkZXJlZCBieSBxdWFkcmFudCAqL1xyXG5mdW5jdGlvbiBjcmVhdGVCdWNrZXRzKCk6IFtVaW50MzJBcnJheV0ge1xyXG4gICAgY29uc3QgYXJyTGVuID0gKElOSVRJQUxfTlVNX0JVQ0tFVFNfUEVSX0NPT1JEKioyKS8zMjtcclxuXHJcbiAgICByZXR1cm4gW25ldyBVaW50MzJBcnJheShhcnJMZW4pXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGNyZWF0ZUJ1Y2tldHMgfVxyXG4iLCJcclxuY29uc3QgeyBTUVJUMiwgcm91bmQsIGFicywgbG9nMiwgc3FydCwgY2VpbCB9ID0gTWF0aDtcclxuXHJcblxyXG5jb25zdCBTUVJUMyA9IHNxcnQoMyk7XHJcblxyXG4vKiogTnVtYmVyIG9mIGJ1Y2tldHMgcGVyIHVuaXQgKi9cclxuY29uc3QgTlVNX0JVQ0tFVFNfUEVSX1VOSVQgPSBjZWlsKGxvZzIoMS8oU1FSVDMvNi9TUVJUMikpKTtcclxuLy8gTXVzdCBiZSBzbWFsbGVyIHRoYW4gaGFsZiB0aGUgbWluaW11bSBkaXN0YW5jZSAoZGl2aWRlZCBieSBzcXJ0KDIpKSBiZXR3ZWVuXHJcbi8vIGFueSB0d28gc2hhcGUgY2VudHJvaWRzIGksZSBzbWFsbGVyIHRoYW5cclxuLy8gYChTUVJUMy82KS9TUVJUMiA9PT0gMC4yMDQxMjQxNDUyMzE5MzE0OCBhbmQgYSBwb3dlciBvZiAyXHJcbmNvbnN0IEJVQ0tFVF9TSVpFID0gMioqLU5VTV9CVUNLRVRTX1BFUl9VTklUO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBHdWVzc2VkIG1heGltdW0gZmxvYXRpbmcgcG9pbnQgZXJyb3IgYWZ0ZXIgYWxsIHRyYW5zZm9ybWF0aW9ucy5cclxuICogKiBBIGhpZ2ggdmFsdWUgd2FzIGNob3NlbiB0byBiZSBzdXJlIGJ1dCBpdCBpcyBwb3NzaWJsZSB0byBjYWxjdWxhdGUgaXRcclxuICogZXhhY3RseSB0aG91Z2ggdGhlIGNhbGN1bGF0aW9uIHdvdWxkIGJlIHZlcnkgdGVkaW91cy5cclxuICovXHJcbmNvbnN0IE1BWF9BQlNfRVJST1IgPSAyKiotMTY7XHJcblxyXG5cclxuLyoqXHJcbiAqIFBlcmZvcm0gYSBsb2NhdGlvbiBzZW5zaXRpdmUgaGFzaCAoY2FsbGVkIGJ1Y2tldHMpXHJcbiAqIFxyXG4gKiAqIHBvaW50cyBjbG9zZSB0byB6ZXJvIGFyZSBhdXRvbWF0aWNhbGx5IHB1dCBpbnRvIGJ1Y2tldCAwXHJcbiAqXHJcbiAqIEBwYXJhbSB2IFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZUJ1Y2tldHMoXHJcbiAgICAgICAgYzogbnVtYmVyKTogbnVtYmVyW10ge1xyXG5cclxuICAgIGNvbnN0IGJ1Y2tldHM6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgY29uc3QgY18gPSBhYnMoYyk7XHJcbiAgICBjb25zdCBjX18gPSBjXy9CVUNLRVRfU0laRTtcclxuXHJcbiAgICBjb25zdCBiMSA9IHJvdW5kKGNfXyk7XHJcblxyXG4gICAgYnVja2V0cy5wdXNoKGIxKTsgIC8vIHVzdWFsbHkgdGhlcmUncyBvbmx5IG9uZSBidWNrZXQgcGVyIGNvb3JkaW5hdGVcclxuXHJcbiAgICBjb25zdCBkID0gYWJzKGNfXyAtIGIxKTtcclxuXHJcbiAgICBpZiAoZCA+PSAwLjUgLSBNQVhfQUJTX0VSUk9SKSB7ICAvLyB0b28gY2xvc2UgdG8gY2FsbCAtIHB1dCBpbnRvIHR3byBidWNrZXRzXHJcbiAgICAgICAgY29uc3QgYjIgPSBjX18gPiBiMVxyXG4gICAgICAgICAgICA/IGIxICsgMSAgIC8vIHdlIHJvdW5kZWQgZG93blxyXG4gICAgICAgICAgICA6IGIxIC0gMTsgIC8vIHdlIHJvdW5kZWQgdXBcclxuXHJcbiAgICAgICAgYnVja2V0cy5wdXNoKGIyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnVja2V0cztcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGdldENvb3JkaW5hdGVCdWNrZXRzIH1cclxuIiwiXHJcbmNvbnN0IHsgbG9nMiwgcm91bmQsIGFicyB9ID0gTWF0aDtcclxuXHJcblxyXG4vLyBNdXN0IGJlIHNtYWxsZXIgdGhhbiBtaW4gZGlzdGFuY2UgYmV0d2VlbiBhbnkgdHdvIHRyYW5zZm9ybSBwb2ludHNcclxuY29uc3QgQlVDS0VUX1NJWkUgPSAyKiotNDtcclxuXHJcbi8qKiBudW1iZXIgb2YgYnVja2V0cyBwZXIgdW5pdCAqL1xyXG5jb25zdCBOID0gbG9nMigxL0JVQ0tFVF9TSVpFKTtcclxuXHJcbmNvbnN0IE1BWF9DT09SRCA9IDIqKjg7XHJcblxyXG4vKiogVGhlIG51bWJlciBvZiBidWNrZXRzIHBlciBjb29yZGluYXRlICovXHJcbmNvbnN0IE5VTV9CVUNLRVRTID0gTUFYX0NPT1JEKigyKipOKTtcclxuXHJcbi8qKlxyXG4gKiBHdWVzc2VkIG1heGltdW0gZmxvYXRpbmcgcG9pbnQgZXJyb3IgYWZ0ZXIgYWxsIHRyYW5zZm9ybWF0aW9ucy5cclxuICogKiBBIGhpZ2ggdmFsdWUgd2FzIGNob3NlbiB0byBiZSBzdXJlIGJ1dCBpdCBpcyBwb3NzaWJsZSB0byBjYWxjdWxhdGUgaXRcclxuICogZXhhY3RseSB0aG91Z2ggdGhlIGNhbGN1bGF0aW9uIHdvdWxkIGJlIHZlcnkgdGVkaW91cy5cclxuICovXHJcbmNvbnN0IE1BWF9BQlNfRVJST1IgPSAyKiotMTA7XHJcblxyXG4vKiogTWF4IHNoaWZ0IGFsbG93ZWQgYmVmb3JlIHRocm93aW5nIHBvaW50IGludG8gdHdvIGJ1Y2tldHMgKi9cclxuY29uc3QgQUxMT1dFRF9TSElGVCA9IEJVQ0tFVF9TSVpFLzIgLSBNQVhfQUJTX0VSUk9SOyBcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRUcmFuc2Zvcm1Qb2ludEJ1Y2tldHMocDogbnVtYmVyW10pIHtcclxuICAgIGNvbnN0IFt4LHldID0gcDtcclxuXHJcbiAgICAvLyBXZSBwYWNrIHRoZSBidWNrZXRzIGludG8gb25lIGZsb2F0IGJ5IHNoaWZ0aW5nIGJ5IGFyb3VuZCAyMiBiaXRzXHJcbiAgICAvLyBOb3RlIHRoaXMgYWxsb3dzIGJ1Y2tldCBwb2ludHMgdG8gYmUgY29tcGFyZWQgZWFzaWx5XHJcbiAgICAvLyB1c2luZyB0aGUgdXN1YWwgPT09LD4sPj0gZXRjLiBvcGVyYXRvcnNcclxuICAgIGNvbnN0IHhCdWNrZXRzID0gZ2V0VHJhbnNmb3JtUG9pbnRDb29yZGluYXRlQnVja2V0cyh4KS5tYXAoYiA9PiBiKk5VTV9CVUNLRVRTKjIqKjIpO1xyXG4gICAgY29uc3QgeUJ1Y2tldHMgPSBnZXRUcmFuc2Zvcm1Qb2ludENvb3JkaW5hdGVCdWNrZXRzKHkpO1xyXG5cclxuICAgIC8vIFBhY2sgYnVja2V0c1xyXG4gICAgY29uc3QgYnVja2V0czogbnVtYmVyW10gPSBbXTtcclxuICAgIGZvciAobGV0IGk9MDsgaTx4QnVja2V0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGo9MDsgajx5QnVja2V0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBidWNrZXRzLnB1c2goeEJ1Y2tldHNbaV0gKyB5QnVja2V0c1tqXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBidWNrZXRzO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFBlcmZvcm0gYSBsb2NhdGlvbiBzZW5zaXRpdmUgaGFzaCAoY2FsbGVkIGJ1Y2tldHMpXHJcbiAqIFxyXG4gKiAqIHBvaW50cyBjbG9zZSB0byB6ZXJvIGFyZSBhdXRvbWF0aWNhbGx5IHB1dCBpbnRvIGJ1Y2tldCAwXHJcbiAqXHJcbiAqIEBwYXJhbSB2IFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0VHJhbnNmb3JtUG9pbnRDb29yZGluYXRlQnVja2V0cyh2OiBudW1iZXIpOiBudW1iZXJbXSB7XHJcbiAgICBjb25zdCBidWNrZXRzOiBudW1iZXJbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0IGIxID0gcm91bmQodi9CVUNLRVRfU0laRSkqQlVDS0VUX1NJWkU7XHJcbiAgICBidWNrZXRzLnB1c2goYjEpOyAgLy8gdXN1YWxseSB0aGVyZSdzIG9ubHkgb25lIGJ1Y2tldCBwZXIgY29vcmRpbmF0ZVxyXG5cclxuICAgIGNvbnN0IGQgPSBhYnModiAtIGIxKTsgXHJcblxyXG4gICAgaWYgKGQgPj0gQUxMT1dFRF9TSElGVCkgeyAgLy8gdG9vIGNsb3NlIHRvIGNhbGwgLSBwdXQgaW50byB0d28gYnVja2V0c1xyXG4gICAgICAgIGNvbnN0IGIyID0gdiA+IGIxXHJcbiAgICAgICAgICAgID8gYjEgKyBCVUNLRVRfU0laRSAgIC8vIHdlIHJvdW5kZWQgZG93blxyXG4gICAgICAgICAgICA6IGIxIC0gQlVDS0VUX1NJWkU7ICAvLyB3ZSByb3VuZGVkIHVwXHJcblxyXG4gICAgICAgIGJ1Y2tldHMucHVzaChiMik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1Y2tldHM7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBnZXRUcmFuc2Zvcm1Qb2ludEJ1Y2tldHMgfVxyXG4iLCJcclxuZnVuY3Rpb24gaXNCdWNrZXRaZXJvKGhhc2hlczogbnVtYmVyW10pIHtcclxuICAgIHJldHVybiBoYXNoZXMubGVuZ3RoID09PSAxICYmIGhhc2hlc1swXSA9PT0gMDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGlzQnVja2V0WmVybyB9XHJcbiIsImltcG9ydCB7IHNlZWRTaGFwZXMgfSBmcm9tIFwiLi4vdG8tc2hhcGVzL2dldC1zZWVkLXNoYXBlXCI7XHJcbmltcG9ydCB7IHplcm9WZWN0b3IgfSBmcm9tIFwiLi4vdmVjdG9yL3plcm8tdmVjdG9yXCI7XHJcbmltcG9ydCB7IHJvdGF0ZVZlY3RvckFyb3VuZCB9IGZyb20gXCIuLi92ZWN0b3Ivcm90YXRlLXZlY3Rvci1hcm91bmRcIjtcclxuaW1wb3J0IHsgYWRkVmVjdG9yIH0gZnJvbSBcIi4uL3ZlY3Rvci9hZGQtdmVjdG9yXCI7XHJcbmltcG9ydCB7IHNjYWxlVmVjdG9yIH0gZnJvbSBcIi4uL3ZlY3Rvci9zY2FsZVwiO1xyXG5pbXBvcnQgeyBTaGFwZVR5cGUgfSBmcm9tIFwiLi4vdHlwZXMvc2hhcGUtdHlwZVwiO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGZyb21DZW50cm9pZEFuZEFuZ2xlKFxyXG4gICAgYzogbnVtYmVyW10sXHJcbiAgICDOuG06IG51bWJlcixcclxuICAgIHNpZGVzOiBTaGFwZVR5cGUsXHJcbiAgICBzY2FsZUZhY3RvcjogbnVtYmVyKTogbnVtYmVyW11bXSB7XHJcblxyXG4gICAgY29uc3QgeyBwcywgzrhtOiBzzrhtIH0gPSBzZWVkU2hhcGVzW3NpZGVzXTtcclxuXHJcbiAgICBjb25zdCBwc18gPSBwc1xyXG4gICAgICAgIC5tYXAocCA9PiByb3RhdGVWZWN0b3JBcm91bmQozrhtICsgc864bSwgemVyb1ZlY3RvciwgcCkpXHJcbiAgICAgICAgLm1hcChwID0+IHNjYWxlVmVjdG9yKHNjYWxlRmFjdG9yKShwKSlcclxuICAgICAgICAubWFwKHAgPT4gYWRkVmVjdG9yKHAsYykpO1xyXG5cclxuICAgIHJldHVybiBwc187XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBmcm9tQ2VudHJvaWRBbmRBbmdsZSB9XHJcbiIsImltcG9ydCB7IGFkZFZlY3RvciB9IGZyb20gXCIuLi92ZWN0b3IvYWRkLXZlY3RvclwiO1xyXG5pbXBvcnQgeyBkaXN0YW5jZUJldHdlZW4gfSBmcm9tIFwiLi4vdmVjdG9yL2Rpc3RhbmNlLWJldHdlZW5cIjtcclxuaW1wb3J0IHsgc3VidHJhY3RWZWN0b3IgIH0gZnJvbSBcIi4uL3ZlY3Rvci9zdWJ0cmFjdC12ZWN0b3JcIjtcclxuaW1wb3J0IHsgU2hhcGUgfSBmcm9tIFwiLi9zaGFwZVwiO1xyXG5pbXBvcnQgeyBnZXRDZW50cm9pZCB9IGZyb20gXCIuL2dldC1jZW50cm9pZFwiO1xyXG5pbXBvcnQgeyBTaGFwZVR5cGUgfSBmcm9tIFwiLi4vdHlwZXMvc2hhcGUtdHlwZVwiO1xyXG5cclxuY29uc3QgeyBQSSwgY29zLCBzaW4sIGF0YW4yLCByb3VuZCB9ID0gTWF0aDtcclxuXHJcblxyXG5mdW5jdGlvbiBmcm9tTGluZVNlZ21lbnQoXHJcbiAgICAgICAgc2lkZXM6IFNoYXBlVHlwZSxcclxuICAgICAgICBsczogbnVtYmVyW11bXSxcclxuICAgICAgICBzdGFnZVBsYWNlbWVudDogbnVtYmVyKTogU2hhcGUge1xyXG5cclxuICAgIGNvbnN0IFt2MSx2Ml0gPSBscztcclxuXHJcbiAgICBjb25zdCBsID0gZGlzdGFuY2VCZXR3ZWVuKHYxLHYyKTtcclxuICAgIGNvbnN0IHYgPSBzdWJ0cmFjdFZlY3Rvcih2Mix2MSk7XHJcbiAgICBsZXQgzrggPSBhdGFuMih2WzFdLHZbMF0pICsgKDIqUEkpL3NpZGVzO1xyXG5cclxuICAgIGNvbnN0IHBzID0gW3YxLHYyXTtcclxuICAgIFxyXG4gICAgZm9yIChsZXQgaT0yOyBpPHNpZGVzOyBpKyspIHtcclxuICAgICAgICBwcy5wdXNoKFxyXG4gICAgICAgICAgICBhZGRWZWN0b3IoW2NvcyjOuCkqbCwgc2luKM64KSpsXSxcclxuICAgICAgICAgICAgcHNbaSAtIDFdXHJcbiAgICAgICAgKSk7XHJcblxyXG4gICAgICAgIM64ICs9IDIqUEkvc2lkZXM7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHNfID0gcHMuc2xpY2UoMSkucmV2ZXJzZSgpO1xyXG5cclxuICAgIGNvbnN0IGMgPSBnZXRDZW50cm9pZChbcHNbMF0sIC4uLnBzX10pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc3RhZ2U6IDAsXHJcbiAgICAgICAgc3RhZ2VQbGFjZW1lbnQsXHJcbiAgICAgICAgYyxcclxuICAgICAgICDOuG06IHJvdW5kKM64L1BJKjEyKSxcclxuICAgICAgICBzaWRlc1xyXG4gICAgfTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGZyb21MaW5lU2VnbWVudCB9XHJcbiIsImltcG9ydCB7IFNoYXBlVHlwZSB9IGZyb20gXCIuLi90eXBlcy9zaGFwZS10eXBlXCI7XHJcbmltcG9ydCB7IHNjYWxlVmVjdG9yIH0gZnJvbSBcIi4uL3ZlY3Rvci9zY2FsZVwiO1xyXG5pbXBvcnQgeyBzaWRlbGVuZ3RoX2Rpdl9jaXJjdW1yYWRpdXMgfSBmcm9tIFwiLi9zaWRlLWxlbmd0aC1kaXYtY2lyY3VtcmFkaXVzXCI7XHJcblxyXG5jb25zdCB7IGNvcywgc2luLCBQSSB9ID0gTWF0aDtcclxuXHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIHNoYXBlIHJlcHJzZW50ZWQgYnkgaXRzIHZlcnRpY2VzLlxyXG4gKiBcclxuICogQHBhcmFtIHNpZGVzIHRoZSBudW1iZXIgb2Ygc2lkZXMgb2YgdGhlIHNoYXBlOiAzLDQsNiw4IG9yIDEyLlxyXG4gKi9cclxuZnVuY3Rpb24gZnJvbVNpZGVzKFxyXG4gICAgICAgIHNpZGVzOiBTaGFwZVR5cGUpOiBudW1iZXJbXVtdIHtcclxuXHJcbiAgICBjb25zdCBwcyA9IEFycmF5LmZyb20obmV3IEFycmF5KHNpZGVzKSlcclxuICAgIC5tYXAoKHYsaSkgPT4gW1xyXG4gICAgICAgIGNvcygtaSooMipQSSkvc2lkZXMpLFxyXG4gICAgICAgIHNpbigtaSooMipQSSkvc2lkZXMpLFxyXG4gICAgXSk7XHJcblxyXG4gICAgY29uc3QgcyA9IHNpZGVsZW5ndGhfZGl2X2NpcmN1bXJhZGl1c1tzaWRlc107XHJcblxyXG4gICAgcmV0dXJuIHBzLm1hcChzY2FsZVZlY3RvcigxL3MpKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGZyb21TaWRlcyB9XHJcbiIsIlxyXG5mdW5jdGlvbiBnZXRDZW50cm9pZChwczogbnVtYmVyW11bXSk6IG51bWJlcltdIHtcclxuICAgIGxldCB0b3RhbFggPSAwO1xyXG4gICAgbGV0IHRvdGFsWSA9IDA7XHJcbiAgICBjb25zdCBsZW4gPSBwcy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpPTA7IGk8bGVuOyBpKyspIHtcclxuICAgICAgICB0b3RhbFggKz0gcHNbaV1bMF07XHJcbiAgICAgICAgdG90YWxZICs9IHBzW2ldWzFdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbdG90YWxYL2xlbiwgdG90YWxZL2xlbl07XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBnZXRDZW50cm9pZCB9XHJcbiIsImltcG9ydCB7IFNoYXBlIH0gZnJvbSBcIi4vc2hhcGVcIjtcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTaGFwZUVkZ2VzKHBzOiBudW1iZXJbXVtdKSB7XHJcbiAgICByZXR1cm4gcHMubWFwKChwLCBpKSA9PiBbcCwgcHNbKGkgKyAxKSVwcy5sZW5ndGhdXSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBnZXRTaGFwZUVkZ2VzIH1cclxuIiwiaW1wb3J0IHsgemVyb1ZlY3RvciB9IGZyb20gXCIuLi92ZWN0b3IvemVyby12ZWN0b3JcIjtcclxuaW1wb3J0IHsgcm90YXRlVmVjdG9yQXJvdW5kIH0gZnJvbSBcIi4uL3ZlY3Rvci9yb3RhdGUtdmVjdG9yLWFyb3VuZFwiO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIM64IFxyXG4gKiBAcGFyYW0gdiBcclxuICogQHBhcmFtIHNoYXBlIFxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmZ1bmN0aW9uIHJvdGF0ZVNoYXBlKFxyXG4gICAgICAgIM64bTogbnVtYmVyLFxyXG4gICAgICAgIHBzOiBudW1iZXJbXVtdKSB7XHJcblxyXG4gICAgcmV0dXJuIHBzLm1hcChwID0+IHJvdGF0ZVZlY3RvckFyb3VuZCjOuG0sIHplcm9WZWN0b3IscCkpXHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyByb3RhdGVTaGFwZSB9XHJcbiIsIlxyXG5jb25zdCB7IHNxcnQsIFNRUlQyIH0gPSBNYXRoO1xyXG5jb25zdCBTUVJUMyA9IHNxcnQoMyk7XHJcblxyXG5cclxuLyoqIFNpZGUgbGVuZ3RoIC8gY2lyY3VtcmFkaXVzICovXHJcbmNvbnN0IHNpZGVsZW5ndGhfZGl2X2NpcmN1bXJhZGl1czogeyBbazpudW1iZXJdOiBudW1iZXIgfSA9IHtcclxuICAgIDM6ICBTUVJUMyxcclxuICAgIDQ6ICBTUVJUMixcclxuICAgIDY6ICAxLFxyXG4gICAgODogIHNxcnQoMiAtIFNRUlQyKSxcclxuICAgIDEyOiBzcXJ0KDIgLSBTUVJUMylcclxufTtcclxuXHJcblxyXG5leHBvcnQgeyBzaWRlbGVuZ3RoX2Rpdl9jaXJjdW1yYWRpdXMgfVxyXG4iLCJpbXBvcnQgeyBhbmdsZUVxdWFscyB9IGZyb20gXCIuLi92ZWN0b3IvYW5nbGUtZXF1YWxzXCI7XHJcbmltcG9ydCB7IGdldEFuZ2xlQ2xvY2t3aXNlRnJvbVlBeGlzIH0gZnJvbSBcIi4uL3ZlY3Rvci9nZXQtYW5nbGUtY2xvY2t3aXNlLWZyb20teS1heGlzXCI7XHJcblxyXG5jb25zdCB7IFBJLCBoeXBvdCB9ID0gTWF0aDtcclxuXHJcblxyXG5jb25zdCBBTkdMRV9QUkVDSVNJT04gPSAyKiotMTA7XHJcblxyXG5cclxuZnVuY3Rpb24gY29tcGFyZVBvaW50cyhcclxuICAgICAgICBhOiBudW1iZXJbXSxcclxuICAgICAgICBiOiBudW1iZXJbXSkge1xyXG5cclxuICAgIGNvbnN0IF/OuGEgPSBnZXRBbmdsZUNsb2Nrd2lzZUZyb21ZQXhpcyhhKTtcclxuICAgIGNvbnN0IF/OuGIgPSBnZXRBbmdsZUNsb2Nrd2lzZUZyb21ZQXhpcyhiKTtcclxuXHJcbiAgICBjb25zdCDOuGEgPSBfzrhhID4gMipQSSAtIEFOR0xFX1BSRUNJU0lPTiA/IDAgOiBfzrhhO1xyXG4gICAgY29uc3QgzrhiID0gX864YiA+IDIqUEkgLSBBTkdMRV9QUkVDSVNJT04gPyAwIDogX864YjtcclxuXHJcbiAgICBpZiAoYW5nbGVFcXVhbHMozrhhLM64YikpIHtcclxuICAgICAgICByZXR1cm4gaHlwb3QoLi4uYSkgLSBoeXBvdCguLi5iKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gzrhhIC0gzrhiO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgY29tcGFyZVBvaW50cyB9XHJcbiIsImltcG9ydCB7IFNoYXBlIH0gZnJvbSBcIi4uL3NoYXBlL3NoYXBlXCI7XHJcbmltcG9ydCB7IGdldENvb3JkaW5hdGVCdWNrZXRzIH0gZnJvbSBcIi4uL2hhc2gvZ2V0LWNvb3JkaW5hdGUtYnVja2V0c1wiO1xyXG5cclxuY29uc3QgeyBtYXgsIHNpZ24gfSA9IE1hdGg7XHJcblxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBAcGFyYW0gYnVja2V0cyBTZXQgaG9sZGluZyBoYXNoZXMgb2YgZXhpc3Rpbmcgc2hhcGVzXHJcbiAqIEBwYXJhbSBzaGFwZXMgbmV3IHNoYXBlcyB0byBhZGRcclxuICovXHJcbmZ1bmN0aW9uIGdldE5ld1NoYXBlcyhcclxuICAgICAgICBidWNrZXRzOiBbVWludDMyQXJyYXldLFxyXG4gICAgICAgIHNoYXBlczogU2hhcGVbXSkge1xyXG5cclxuICAgIGxldCBidWNrZXRzXyA9IGJ1Y2tldHNbMF07XHJcbiAgICBjb25zdCBzaGFwZXNfOiBTaGFwZVtdID0gW107XHJcbiAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHNoYXBlcykge1xyXG4gICAgICAgIGNvbnN0IHggPSBzaGFwZS5jWzBdO1xyXG4gICAgICAgIGNvbnN0IHkgPSBzaGFwZS5jWzFdO1xyXG5cclxuICAgICAgICAvLyBXZSBwYWNrIHRoZSBidWNrZXRzIGludG8gYSBzcXVhcmUgYXJvdW5kIHRoZSBvcmlnaW5cclxuICAgICAgICBjb25zdCB4QnVja2V0cyA9IGdldENvb3JkaW5hdGVCdWNrZXRzKHgpO1xyXG4gICAgICAgIGNvbnN0IHlCdWNrZXRzID0gZ2V0Q29vcmRpbmF0ZUJ1Y2tldHMoeSk7XHJcblxyXG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8eEJ1Y2tldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wOyBqPHlCdWNrZXRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBfaWR4ID0gZ2V0SWR4KHhCdWNrZXRzW2ldLCB5QnVja2V0c1tqXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gNCpfaWR4ICsgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgeCA+PSAwXHJcbiAgICAgICAgICAgICAgICAgICAgPyB5ID49IDAgPyAwIDogM1xyXG4gICAgICAgICAgICAgICAgICAgIDogeSA+PSAwID8gMSA6IDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJpdCA9IGlkeCUzMjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmQgPSAoaWR4IC0gYml0KSA+PiA1O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWFzayA9ICgxIDw8IGJpdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHdvcmQgPiBidWNrZXRzXy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkQnVmZmVyID0gYnVja2V0c187XHJcbiAgICAgICAgICAgICAgICAgICAgYnVja2V0c1swXSA9IG5ldyBVaW50MzJBcnJheSg0Km9sZEJ1ZmZlci5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldHNbMF0uc2V0KG9sZEJ1ZmZlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldHNfID0gYnVja2V0c1swXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGJ1Y2tldHNfW3dvcmRdICYgbWFzaykgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJ1Y2tldHNfW3dvcmRdIHw9IG1hc2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZm91bmQpIHsgc2hhcGVzXy5wdXNoKHNoYXBlKTsgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzaGFwZXNfO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0SWR4KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBhID0gc2lnbihtYXgoeCAtIHkgKyAxLCAwKSk7ICAvLyBsb3dlciBoYWxmIChpbmNsdWRpbmcgZGlhZ29uYWwpXHJcbiAgICBjb25zdCBiID0gYSooeSArIHgqKjIpO1xyXG5cclxuICAgIGNvbnN0IGMgPSBzaWduKG1heCh5IC0geCwgMCkpOyAgLy8gdXBwZXIgaGFsZlxyXG4gICAgY29uc3QgZCA9IGMqKHkqKHkgKyAyKSAtIHgpO1xyXG5cclxuICAgIHJldHVybiBiICsgZDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGdldE5ld1NoYXBlcyB9XHJcblxyXG5cclxuLy8gZ2V0SWR4KDAsMCk7Ly8/XHJcbi8vIGdldElkeCgxLDApOy8vP1xyXG4vLyBnZXRJZHgoMiwwKTsvLz9cclxuLy8gZ2V0SWR4KDMsMCk7Ly8/XHJcbi8vIGdldElkeCg0LDApOy8vP1xyXG5cclxuLy8gZ2V0SWR4KDAsMSk7Ly8/XHJcbi8vIGdldElkeCgxLDEpOy8vP1xyXG4vLyBnZXRJZHgoMiwxKTsvLz9cclxuLy8gZ2V0SWR4KDMsMSk7Ly8/XHJcbi8vIGdldElkeCg0LDEpOy8vP1xyXG5cclxuLy8gZ2V0SWR4KDAsMik7Ly8/XHJcbi8vIGdldElkeCgxLDIpOy8vP1xyXG4vLyBnZXRJZHgoMiwyKTsvLz9cclxuLy8gZ2V0SWR4KDMsMik7Ly8/XHJcbi8vIGdldElkeCg0LDIpOy8vP1xyXG5cclxuLy8gZ2V0SWR4KDAsMyk7Ly8/XHJcbi8vIGdldElkeCgxLDMpOy8vP1xyXG4vLyBnZXRJZHgoMiwzKTsvLz9cclxuLy8gZ2V0SWR4KDMsMyk7Ly8/XHJcbi8vIGdldElkeCg0LDMpOy8vP1xyXG5cclxuLy8gZ2V0SWR4KDAsNCk7Ly8/XHJcbi8vIGdldElkeCgxLDQpOy8vP1xyXG4vLyBnZXRJZHgoMiw0KTsvLz9cclxuLy8gZ2V0SWR4KDMsNCk7Ly8/XHJcbi8vIGdldElkeCg0LDQpOy8vP1xyXG4iLCJpbXBvcnQgeyBUcmFuc2Zvcm1Qb2ludCB9IGZyb20gJy4uL3R5cGVzL3RyYW5zZm9ybS1wb2ludCc7XHJcbmltcG9ydCB7IGdldENlbnRyb2lkIH0gZnJvbSAnLi4vc2hhcGUvZ2V0LWNlbnRyb2lkJztcclxuaW1wb3J0IHsgU2hhcGUgfSBmcm9tICcuLi9zaGFwZS9zaGFwZSc7XHJcbmltcG9ydCB7IGdldFRyYW5zZm9ybVBvaW50QnVja2V0cyB9IGZyb20gJy4uL2hhc2gvZ2V0LXRyYW5zZm9ybS1wb2ludC1idWNrZXRzJztcclxuaW1wb3J0IHsgaXNCdWNrZXRaZXJvIH0gZnJvbSAnLi4vaGFzaC9pcy1idWNrZXQtemVybyc7XHJcbmltcG9ydCB7IGdldFNoYXBlRWRnZXMgfSBmcm9tICcuLi9zaGFwZS9nZXQtc2hhcGUtZWRnZXMnO1xyXG5pbXBvcnQgeyBmcm9tQ2VudHJvaWRBbmRBbmdsZSB9IGZyb20gJy4uL3NoYXBlL2Zyb20tY2VudHJvaWQtYW5kLWFuZ2xlJztcclxuaW1wb3J0IHsgYWRkVmVjdG9yIH0gZnJvbSAnLi4vdmVjdG9yL2FkZC12ZWN0b3InO1xyXG5pbXBvcnQgeyBzdWJ0cmFjdFZlY3RvciB9IGZyb20gJy4uL3ZlY3Rvci9zdWJ0cmFjdC12ZWN0b3InO1xyXG5pbXBvcnQgeyBjb21wYXJlUG9pbnRzIH0gZnJvbSAnLi9jb21wYXJlLXBvaW50cyc7XHJcblxyXG5jb25zdCB7IFBJLCByb3VuZCwgYXRhbjIgfSA9IE1hdGg7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0VHJhbnNmb3JtUG9pbnRzKFxyXG4gICAgICAgIHNoYXBlczogU2hhcGVbXSk6IE1hcDxzdHJpbmcsVHJhbnNmb3JtUG9pbnQ+IHtcclxuXHJcbiAgICBjb25zdCB0cmFuc2Zvcm1Qb2ludHM6IFRyYW5zZm9ybVBvaW50W10gPSBbXTtcclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gQ2VudHJvaWRzIChjKVxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS1cclxuICAgIGZvciAobGV0IGk9MDsgaTxzaGFwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBzID0gc2hhcGVzW2ldO1xyXG4gICAgICAgIGNvbnN0IHsgYywgzrhtLCBzaWRlcyB9ID0gcztcclxuXHJcbiAgICAgICAgY29uc3QgcHMgPSBmcm9tQ2VudHJvaWRBbmRBbmdsZShjLCDOuG0sIHNpZGVzLCAxKTtcclxuICAgICAgICBjb25zdCB2ID0gZ2V0Q2VudHJvaWQocHMpO1xyXG4gICAgICAgIGNvbnN0IM64MiA9IHJvdW5kKDIqYXRhbjIodlswXSwtdlsxXSkvUEkqMTIpO1xyXG5cclxuICAgICAgICB0cmFuc2Zvcm1Qb2ludHMucHVzaCh7IHYsIM64MiwgcG9pbnRUeXBlOiAnYycsIGluZGV4OiAwIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFZlcnRpY2VzICh2KSBhbmQgTWlkcG9pbnRzIChoKVxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgY29uc3QgZWRnZXMgPSBzaGFwZXMubWFwKHNoYXBlID0+IHtcclxuICAgICAgICBjb25zdCB7IGMsIM64bSwgc2lkZXMgfSA9IHNoYXBlO1xyXG4gICAgICAgIGNvbnN0IHBzID0gZnJvbUNlbnRyb2lkQW5kQW5nbGUoYywgzrhtLCBzaWRlcywgMSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFNoYXBlRWRnZXMocHMpXHJcbiAgICB9KS5mbGF0KCk7XHJcbiAgICBmb3IgKGNvbnN0IGxzIG9mIGVkZ2VzKSB7XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCB2ID0gbHNbMF07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjID0gc3VidHJhY3RWZWN0b3IoYWRkVmVjdG9yKHYsWy12WzFdLHZbMF1dKSx2KTtcclxuICAgICAgICAgICAgY29uc3QgzrgyID0gcm91bmQoYXRhbjIoY1sxXSwgY1swXSkvUEkqMTIpO1xyXG5cclxuICAgICAgICAgICAgdHJhbnNmb3JtUG9pbnRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdiwgzrgyLFxyXG4gICAgICAgICAgICAgICAgcG9pbnRUeXBlOiAndicsXHJcbiAgICAgICAgICAgICAgICBpbmRleDogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCB2ID0gZ2V0Q2VudHJvaWQobHMpO1xyXG4gICAgICAgICAgICBjb25zdCBjID0gc3VidHJhY3RWZWN0b3IobHNbMV0sdik7XHJcbiAgICAgICAgICAgIGNvbnN0IM64MiA9IHJvdW5kKDIqYXRhbjIoY1sxXSwgY1swXSkvUEkqMTIpO1xyXG5cclxuICAgICAgICAgICAgdHJhbnNmb3JtUG9pbnRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdiwgzrgyLFxyXG4gICAgICAgICAgICAgICAgcG9pbnRUeXBlOiAnaCcsXHJcbiAgICAgICAgICAgICAgICBpbmRleDogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNjID0gMDtcclxuICAgIGxldCB2diA9IDBcclxuICAgIGxldCBoaCA9IDA7XHJcbiAgICBjb25zdCB0cmFuc2Zvcm1Qb2ludHNfID0gZ2V0VW5pcXVlVmVydGljZXNOb3RaZXJvKHRyYW5zZm9ybVBvaW50cylcclxuICAgICAgICAuc29ydCgoYSxiKSA9PiBjb21wYXJlUG9pbnRzKGEudixiLnYpKVxyXG4gICAgICAgIC5tYXAodHAgPT4gKHtcclxuICAgICAgICAgICAgICAgIC4uLnRwLFxyXG4gICAgICAgICAgICAgICAgaW5kZXg6ICh0cC5wb2ludFR5cGUgPT09ICdjJyAmJiArK2NjKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICh0cC5wb2ludFR5cGUgPT09ICd2JyAmJiArK3Z2KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICh0cC5wb2ludFR5cGUgPT09ICdoJyAmJiArK2hoKSB8fCAwLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgY29uc3QgdHJhbnNmb3JtUG9pbnRNYXA6IE1hcDxzdHJpbmcsVHJhbnNmb3JtUG9pbnQ+ID0gbmV3IE1hcChcclxuICAgICAgICB0cmFuc2Zvcm1Qb2ludHNfXHJcbiAgICAgICAgLm1hcCh2ID0+IFt2LnBvaW50VHlwZSArIHYuaW5kZXgsIHZdKVxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gdHJhbnNmb3JtUG9pbnRNYXA7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRVbmlxdWVWZXJ0aWNlc05vdFplcm8oXHJcbiAgICAgICAgdmVydGljZXM6IFRyYW5zZm9ybVBvaW50W10pIHtcclxuXHJcbiAgICBjb25zdCB2ZXJ0ZXhTZXQ6IFNldDxudW1iZXI+ID0gbmV3IFNldCgpO1xyXG4gICAgY29uc3QgdmVydGljZXNfOiBUcmFuc2Zvcm1Qb2ludFtdID0gW107XHJcbiAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiB2ZXJ0aWNlcykge1xyXG4gICAgICAgIGNvbnN0IGhhc2hlcyA9IGdldFRyYW5zZm9ybVBvaW50QnVja2V0cyh2ZXJ0ZXgudik7XHJcblxyXG4gICAgICAgIGlmIChpc0J1Y2tldFplcm8oaGFzaGVzKSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTsgIC8vIG5vIG9yaWdpbnMgYWxsb3dlZFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKGxldCBqPTA7IGo8aGFzaGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGggPSBoYXNoZXNbal07XHJcbiAgICAgICAgICAgIGlmICh2ZXJ0ZXhTZXQuaGFzKGgpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZm91bmQpIHsgY29udGludWU7IH1cclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBoIG9mIGhhc2hlcykge1xyXG4gICAgICAgICAgICB2ZXJ0ZXhTZXQuYWRkKGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmVydGljZXNfLnB1c2godmVydGV4KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmVydGljZXNfO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgZ2V0VHJhbnNmb3JtUG9pbnRzIH1cclxuIiwiaW1wb3J0IHsgU2hhcGUgfSBmcm9tIFwiLi4vc2hhcGUvc2hhcGVcIjtcclxuaW1wb3J0IHsgcmVmbGVjdFZlY3RvciB9IGZyb20gXCIuLi92ZWN0b3IvcmVmbGVjdC12ZWN0b3JcIjtcclxuXHJcblxyXG5mdW5jdGlvbiByZWZsZWN0U2hhcGVzKFxyXG4gICAgICAgIM64MjogbnVtYmVyLFxyXG4gICAgICAgIHY6IG51bWJlcltdLFxyXG4gICAgICAgIHNoYXBlczogU2hhcGVbXSk6IFNoYXBlW10ge1xyXG5cclxuICAgIGNvbnN0IHNoYXBlc186IFNoYXBlW10gPSBbXTtcclxuXHJcbiAgICBjb25zdCBzdGFnZSA9IHNoYXBlc1swXS5zdGFnZSArIDE7XHJcbiAgICBmb3IgKGNvbnN0IHNoYXBlIG9mIHNoYXBlcykge1xyXG4gICAgICAgIGNvbnN0IGNfID0gcmVmbGVjdFZlY3RvcijOuDIsIHYsIHNoYXBlLmMpO1xyXG5cclxuICAgICAgICBjb25zdCDOuG0gPSAozrgyIC0gc2hhcGUuzrhtICsgMTIpJTI0O1xyXG5cclxuICAgICAgICBjb25zdCB7IHNpZGVzLCBzdGFnZVBsYWNlbWVudCB9ID0gc2hhcGU7XHJcbiAgICAgICAgc2hhcGVzXy5wdXNoKHtcclxuICAgICAgICAgICAgc2lkZXMsIHN0YWdlLCBzdGFnZVBsYWNlbWVudCxcclxuICAgICAgICAgICAgYzogY18sXHJcbiAgICAgICAgICAgIM64bVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzaGFwZXNfO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgcmVmbGVjdFNoYXBlcyB9XHJcbiIsImltcG9ydCB7IHplcm9WZWN0b3IgfSBmcm9tIFwiLi4vdmVjdG9yL3plcm8tdmVjdG9yXCI7XHJcbmltcG9ydCB7IFNoYXBlIH0gZnJvbSBcIi4uL3NoYXBlL3NoYXBlXCI7XHJcbmltcG9ydCB7IHJvdGF0ZVZlY3RvckFyb3VuZCB9IGZyb20gXCIuLi92ZWN0b3Ivcm90YXRlLXZlY3Rvci1hcm91bmRcIjtcclxuXHJcblxyXG5mdW5jdGlvbiByb3RhdGVTaGFwZXNBcm91bmQoXHJcbiAgICAgICAgzrhtOiBudW1iZXIsXHJcbiAgICAgICAgdiA9IHplcm9WZWN0b3IsXHJcbiAgICAgICAgc2hhcGVzOiBTaGFwZVtdKTogU2hhcGVbXSB7XHJcblxyXG4gICAgY29uc3Qgc3RhZ2UgPSBzaGFwZXNbMF0uc3RhZ2UgKyAxO1xyXG4gICAgY29uc3Qgc2hhcGVzXzogU2hhcGVbXSA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBzaGFwZSBvZiBzaGFwZXMpIHtcclxuICAgICAgICBjb25zdCBjXyA9IHJvdGF0ZVZlY3RvckFyb3VuZCjOuG0sIHYsIHNoYXBlLmMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHsgc2lkZXMsIHN0YWdlUGxhY2VtZW50IH0gPSBzaGFwZTtcclxuICAgICAgICBzaGFwZXNfLnB1c2goe1xyXG4gICAgICAgICAgICBzaWRlcywgc3RhZ2UsIHN0YWdlUGxhY2VtZW50LFxyXG4gICAgICAgICAgICBjOiBjXyxcclxuICAgICAgICAgICAgzrhtOiAozrhtICsgc2hhcGUuzrhtKSUyNCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2hhcGVzXztcclxufSBcclxuXHJcblxyXG5leHBvcnQgeyByb3RhdGVTaGFwZXNBcm91bmQgfVxyXG4iLCJpbXBvcnQgeyBUcmFuc2Zvcm1UeXBlIH0gZnJvbSAnLi90eXBlcy90cmFuc2Zvcm0tdHlwZSc7XG5pbXBvcnQgeyBFbnRpdGllcyB9IGZyb20gJy4vdHlwZXMvZW50aXRpZXMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSAnLi90eXBlcy90cmFuc2Zvcm0nO1xuXG5cbmZ1bmN0aW9uIHRvMTVEZWdJbnRlcnZhbHMoczogJzMwJ3wnNDUnfCc2MCd8JzkwJ3wnMTgwJyk6IDJ8M3w0fDZ8MTIge1xuICAgIHN3aXRjaCAocykge1xuICAgICAgICBjYXNlICczMCc6IHJldHVybiAyO1xuICAgICAgICBjYXNlICc0NSc6IHJldHVybiAzO1xuICAgICAgICBjYXNlICc2MCc6IHJldHVybiA0O1xuICAgICAgICBjYXNlICc5MCc6IHJldHVybiA2O1xuICAgICAgICBjYXNlICcxODAnOiByZXR1cm4gMTI7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIHRvRW50aXRpZXMoY29uZmlndXJhdGlvbjogc3RyaW5nKTogRW50aXRpZXMge1xuICAgIC8vIEUuZzogJzMtNC0zLDMvbTMwL20oNCknXG4gICAgLy8gRS5nOiAnMy00LTMsMy9tMzAvbShoMiknXG4gICAgY29uc3QgW3NoYXBlcywgLi4udHJhbnNmb3Jtc1N0cl0gPVxuICAgICAgICBjb25maWd1cmF0aW9uLnNwbGl0KCcvJyk7XG5cbiAgICAvLyBzaGFwZXMgPT09ICczLTQtMywzJ1xuICAgIC8vIHRyYW5zZm9ybXMgPT09IFsnbTMwJywnbSg0KSddXG5cbiAgICBjb25zdCBzaGFwZXNfID1cbiAgICAgICAgc2hhcGVzXG4gICAgICAgIC5zcGxpdCgnLScpXG4gICAgICAgIC5tYXAoZ3JvdXAgPT4gZ3JvdXBcbiAgICAgICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgICAgICAubWFwKHNoYXBlID0+IE51bWJlci5wYXJzZUludChzaGFwZSkpKTtcblxuICAgIC8vIHNoYXBlc18gPT09IFtbM10sWzRdLFszLDNdXVxuXG4gICAgZW5zdXJlU2hhcGVHcm91cHNDb3JyZWN0KGNvbmZpZ3VyYXRpb24sIHNoYXBlc18pO1xuXG4gICAgY29uc3QgW1tzZWVkU2hhcGVUeXBlXSwgLi4uc2hhcGVHcm91cHNdID0gc2hhcGVzXztcblxuICAgIC8vIHNoYXBlU2VlZCA9PT0gM1xuICAgIC8vIHNoYXBlR3JvdXBzID09PSBbWzRdLFszLDNdXVxuXG4gICAgY29uc3QgdHJhbnNmb3JtcyA9IHRyYW5zZm9ybXNTdHJcbiAgICAgICAgLm1hcCh0b1RyYW5zZm9ybSlcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICAgIC8vIHRyYW5zZm9ybUVudGl0aWVzID09PSBbe1xuICAgIC8vICAgICBhY3Rpb246IFwibVwiLFxuICAgIC8vICAgICBhY3Rpb25BbmdsZTogMC41MjM1OTg3NzU1OTgyOTg4LFxuICAgIC8vICAgICBwb2ludEluZGV4OiAwLFxuICAgIC8vICAgICBzdHJpbmc6IFwibTMwXCJcbiAgICAvLyB9LCB7XG4gICAgLy8gICAgIGFjdGlvbjogXCJtXCIsXG4gICAgLy8gICAgIHBvaW50SW5kZXg6IDQsXG4gICAgLy8gICAgIHBvaW50OiB7XG4gICAgLy8gICAgICAgICBcInZcIjogeyBcInhcIjogLTUuNjg0MzQxODg2MDgwODAyZS0xNCwgXCJ5XCI6IC04OS41OTI0NDgzODU4MDkyOCB9LFxuICAgIC8vICAgICAgICAgXCLOuFwiOiAwLFxuICAgIC8vICAgICAgICAgXCJwdFwiOiBcImxcIlxuICAgIC8vICAgICB9LFxuICAgIC8vICAgICBzdHJpbmc6IFwibSg0KVwiLFxuICAgIC8vIH1dXG5cbiAgICByZXR1cm4geyBzZWVkU2hhcGVUeXBlLCBzaGFwZUdyb3VwcywgdHJhbnNmb3JtcyB9IGFzIEVudGl0aWVzO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyBhIGBUcmFuc2Zvcm1gIGdpdmVuIGEgc3RyaW5nIChlLmcuICdtNDUnIG9yICdyKGgxKScpXG4gKiBAcGFyYW0gdHJhbnNmb3JtIFxuICogQHJldHVybnMgXG4gKi9cbmZ1bmN0aW9uIHRvVHJhbnNmb3JtKFxuICAgICAgICB0cmFuc2Zvcm06IHN0cmluZyk6IFRyYW5zZm9ybSB8IHVuZGVmaW5lZCB7XG5cbiAgICBjb25zdCBtYXRjaCA9IC8oW21yXSkoW1xcZC5dKik/XFwoPyhbY3ZoXFxkXSspP1xcKT8vaS5leGVjKHRyYW5zZm9ybSk7XG5cbiAgICAvLyBFLmcuICdtJ1xuICAgIC8vIEUuZy4gJ200NSdcbiAgICAvLyBFLmcuICdyKHYxNSknXG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgY29uc3QgW1xuICAgICAgICAgICAgLFxuICAgICAgICAgICAgdHJhbnNmb3JtVHlwZSxcbiAgICAgICAgICAgIGFuZ2xlU3RyID0gJzE4MCcsXG4gICAgICAgICAgICBwb2ludEluZGV4LFxuICAgICAgICBdID0gbWF0Y2ggYXMgdW5rbm93biBhcyBbXG4gICAgICAgICAgICBzdHJpbmcsXG4gICAgICAgICAgICBUcmFuc2Zvcm1UeXBlLCAgICAgICAvLyAnbSd8J3InXG4gICAgICAgICAgICBzdHJpbmcgfCB1bmRlZmluZWQsICAvLyBhbmdsZSAoZGVmYXVsdHMgdG8gMTgwKVxuICAgICAgICAgICAgc3RyaW5nIHwgdW5kZWZpbmVkICAgLy8gZS5nLiAndjEnLCAnaDIxJywgJ2MzJywgZXRjLlxuICAgICAgICBdO1xuXG4gICAgICAgIGlmIChhbmdsZVN0ciAhPT0gJzMwJyAmJiBhbmdsZVN0ciAhPT0gJzQ1JyAmJiBhbmdsZVN0ciAhPT0gJzYwJyAmJlxuICAgICAgICAgICAgYW5nbGVTdHIgIT09ICc5MCcgJiYgYW5nbGVTdHIgIT09ICcxODAnKSB7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQW5nbGUgbXVzdCBiZSAzMCw0NSw2MCw5MCBvciAxODAgZGVncmVlcywgYnV0IGZvdW5kICR7YW5nbGVTdHJ9YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHJhbnNmb3JtVHlwZSxcbiAgICAgICAgICAgIGFuZ2xlOiBwb2ludEluZGV4ID8gdW5kZWZpbmVkIDogdG8xNURlZ0ludGVydmFscyhhbmdsZVN0ciksXG4gICAgICAgICAgICBvcmlnaW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBvaW50SW5kZXg6IHBvaW50SW5kZXggPyBwb2ludEluZGV4IDogJycsXG4gICAgICAgICAgICBzdHJpbmc6IHRyYW5zZm9ybSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gZW5zdXJlU2hhcGVHcm91cHNDb3JyZWN0KFxuICAgICAgICBjb25maWd1cmF0aW9uOiBzdHJpbmcsXG4gICAgICAgIHNoYXBlR3JvdXBzOiBudW1iZXJbXVtdKSB7XG5cbiAgICBmb3IgKGNvbnN0IHNoYXBlR3JvdXAgb2Ygc2hhcGVHcm91cHMpIHtcbiAgICAgICAgZm9yIChjb25zdCBzaGFwZSBvZiBzaGFwZUdyb3VwKSB7XG4gICAgICAgICAgICBpZiAoc2hhcGUgIT09IDAgJiZcbiAgICAgICAgICAgICAgICBzaGFwZSAhPT0gMyAmJiBzaGFwZSAhPT0gNCAmJiBzaGFwZSAhPT0gNiAmJlxuICAgICAgICAgICAgICAgIHNoYXBlICE9PSA4ICYmIHNoYXBlICE9PSAxMikge1xuICAgICAgICBcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNoYXBlIG11c3QgYmUgMCwzLDQsNiw4IG9yIDEyLCBidXQgZm91bmQgJHtzaGFwZX0gLSAke2NvbmZpZ3VyYXRpb259YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IHsgdG9FbnRpdGllcyB9XG4iLCJcclxuY29uc3QgRXJyb3JTZWVkID0gKCkgPT4gKHtcclxuICAgIGNvZGU6ICdFcnJvclNlZWQnLFxyXG4gICAgdHlwZTogJ1NlZWQgU2hhcGUnLFxyXG4gICAgbWVzc2FnZTogJ1RoZSBzZWVkIHNoYXBlIG11c3QgYmUgb25lIG9mIDMsIDQsIDYsIDggb3IgMTIsIGRpcmVjdGx5IGZvbGxvd2VkIGJ5IGEgYC1gIHRvIGluZGljYXRlIHRoZSBzdGFydCBvZiB0aGUgbmV4dCBzaGFwZSBncm91cC4nLFxyXG59KTtcclxuXHJcbmNvbnN0IEVycm9ySW52YWxpZFNoYXBlID0gKCkgPT4gKHtcclxuICAgIGNvZGU6ICdFcnJvclNoYXBlJyxcclxuICAgIHR5cGU6ICdJbnZhbGlkIFNoYXBlJyxcclxuICAgIG1lc3NhZ2U6ICdTaGFwZXMgbXVzdCBvbmx5IGJlIG9uZSBvZiAzLCA0LCA2LCA4LCBvciAxMi4nLFxyXG59KTtcclxuXHJcbmNvbnN0IEVycm9yVHJhbnNmb3JtQW5nbGVaZXJvID0gKHRyYW5zZm9ybTogc3RyaW5nKSA9PiAoe1xyXG4gICAgY29kZTogJ0Vycm9yVHJhbnNmb3JtQW5nbGUnLFxyXG4gICAgdHlwZTogJ1RyYW5zZm9ybSBBbmdsZScsXHJcbiAgICBtZXNzYWdlOiBgVGhlIGFuZ2xlIG9mIHRoZSBcIiR7dHJhbnNmb3JtfVwiIHRyYW5zZm9ybSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwLmAsXHJcbn0pO1xyXG5cclxuY29uc3QgRXJyb3JUcmFuc2Zvcm1Ob0NoYW5nZSA9ICgpID0+ICh7XHJcbiAgICBjb2RlOiAnRXJyb3JUcmFuc2Zvcm1Ob0NoYW5nZScsXHJcbiAgICB0eXBlOiAnUmVwZWF0ZWQgVHJhbnNmb3JtJyxcclxuICAgIG1lc3NhZ2U6ICdUaGUgY292ZXJlZCBhcmVhIGRpZCBub3QgaW5jcmVhc2Ugd2hlbiB0aGUgdGlsZSB3YXMgcmVwZWF0ZWQuICcgK1xyXG4gICAgICAgICAgICAgJ1RoaXMgaXMgbGlrZWx5IGNhdXNlZCBieSBvbmUgb3IgbW9yZSBpbmNvcnJlY3QgdHJhbnNmb3Jtcy4nXHJcbn0pO1xyXG5cclxuY29uc3QgRXJyb3JUcmFuc2Zvcm1Ob0ludGVyc2VjdGlvblBvaW50ID0gKHRyYW5zZm9ybTogc3RyaW5nKSA9PiAoe1xyXG4gICAgY29kZTogJ0Vycm9yVHJhbnNmb3JtTm9JbnRlcnNlY3Rpb25Qb2ludCcsXHJcbiAgICB0eXBlOiAnVHJhbnNmb3JtIEludGVyc2VjdGlvbiBQb2ludCcsXHJcbiAgICBtZXNzYWdlOiBgTm8gaW50ZXJzZWN0aW9uIHBvaW50IGZvdW5kIGZvciB0aGUgXCIke3RyYW5zZm9ybX1cIiB0cmFuc2Zvcm0uYCxcclxufSk7XHJcblxyXG5cclxuZXhwb3J0IHsgXHJcbiAgICBFcnJvclNlZWQsXHJcbiAgICBFcnJvckludmFsaWRTaGFwZSxcclxuICAgIEVycm9yVHJhbnNmb3JtQW5nbGVaZXJvLFxyXG4gICAgRXJyb3JUcmFuc2Zvcm1Ob0NoYW5nZSxcclxuICAgIEVycm9yVHJhbnNmb3JtTm9JbnRlcnNlY3Rpb25Qb2ludFxyXG59IiwiaW1wb3J0IHsgZnJvbVNpZGVzIH0gZnJvbSAnLi4vc2hhcGUvZnJvbS1zaWRlcyc7XHJcbmltcG9ydCB7IFNoYXBlIH0gZnJvbSAnLi4vc2hhcGUvc2hhcGUnO1xyXG5pbXBvcnQgeyBFcnJvclNlZWQgfSBmcm9tICcuL2Vycm9ycyc7XHJcbmltcG9ydCB7IHJvdGF0ZVNoYXBlIH0gZnJvbSAnLi4vc2hhcGUvcm90YXRlLXNoYXBlJztcclxuaW1wb3J0IHsgU2hhcGVUeXBlIH0gZnJvbSAnLi4vdHlwZXMvc2hhcGUtdHlwZSc7XHJcblxyXG5jb25zdCB7IHNxcnQgfSA9IE1hdGg7XHJcbmNvbnN0IFNRUlQzID0gc3FydCgzKTtcclxuXHJcblxyXG5jb25zdCBzZWVkU2hhcGVzID0ge1xyXG4gICAgMzogIHsgcHM6IHJvdGF0ZVNoYXBlKC0yLCAgZnJvbVNpZGVzKDMpKSwgIM64bTogMCB9LFxyXG4gICAgNDogIHsgcHM6IHJvdGF0ZVNoYXBlKDksICAgZnJvbVNpZGVzKDQpKSwgIM64bTogMCB9LFxyXG4gICAgNjogIHsgcHM6IHJvdGF0ZVNoYXBlKDYsICAgZnJvbVNpZGVzKDYpKSwgIM64bTogLTYgfSxcclxuICAgIDg6ICB7IHBzOiByb3RhdGVTaGFwZSg3LjUsIGZyb21TaWRlcyg4KSksICDOuG06IDAgfSxcclxuICAgIDEyOiB7IHBzOiByb3RhdGVTaGFwZSg3LCAgIGZyb21TaWRlcygxMikpLCDOuG06IDAgfVxyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBzZWVkIHNoYXBlIGJhc2VkIG9uIHRoZSBnaXZlbiBudW1iZXIgb2Ygc2lkZXMuXHJcbiAqIFxyXG4gKiAqIHRoZSBzaWRlIGxlbmd0aCBvZiB0aGUgcmV0dXJuZWQgc2hhcGVzID09PSAxXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTZWVkU2hhcGUoc2lkZXM6IFNoYXBlVHlwZSk6IFNoYXBlIHtcclxuICAgIGlmIChzaWRlcyAhPT0gMyAmJiBzaWRlcyAhPT0gNCAmJiBzaWRlcyAhPT0gNiAmJiBzaWRlcyAhPT0gOCAmJiBzaWRlcyAhPT0gMTIpIHtcclxuICAgICAgICB0aHJvdyBFcnJvclNlZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHNpZGVzLFxyXG4gICAgICAgIC8vIGM6IHNpZGVzID09PSAzID8gWzAuNSwgU1FSVDMvMl0gOiBbMCwwXSxcclxuICAgICAgICBjOiBzaWRlcyA9PT0gMyA/IFtTUVJUMy82LCAwLjVdIDogWzAsMF0sXHJcbiAgICAgICAgzrhtOiBzaWRlcyA9PT0gMyA/IDIgOiBzaWRlcyA9PT0gNiA/IC02IDogMCxcclxuICAgICAgICBzdGFnZTogMCxcclxuICAgICAgICBzdGFnZVBsYWNlbWVudDogMVxyXG4gICAgfTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGdldFNlZWRTaGFwZSwgc2VlZFNoYXBlcyB9XHJcbiIsImltcG9ydCB7IHRvRW50aXRpZXMgfSBmcm9tICcuLi90by1lbnRpdGllcyc7XHJcbmltcG9ydCB7IFNoYXBlIH0gZnJvbSAnLi4vc2hhcGUvc2hhcGUnO1xyXG5pbXBvcnQgeyBnZXRTZWVkU2hhcGUgfSBmcm9tICcuL2dldC1zZWVkLXNoYXBlJztcclxuaW1wb3J0IHsgZnJvbUxpbmVTZWdtZW50IH0gZnJvbSAnLi4vc2hhcGUvZnJvbS1saW5lLXNlZ21lbnQnO1xyXG5pbXBvcnQgeyBnZXRUcmFuc2Zvcm1Qb2ludEJ1Y2tldHMgfSBmcm9tICcuLi9oYXNoL2dldC10cmFuc2Zvcm0tcG9pbnQtYnVja2V0cyc7XHJcbmltcG9ydCB7IGdldENlbnRyb2lkIH0gZnJvbSAnLi4vc2hhcGUvZ2V0LWNlbnRyb2lkJztcclxuaW1wb3J0IHsgZ2V0U2hhcGVFZGdlcyB9IGZyb20gJy4uL3NoYXBlL2dldC1zaGFwZS1lZGdlcyc7XHJcbmltcG9ydCB7IGZyb21DZW50cm9pZEFuZEFuZ2xlIH0gZnJvbSAnLi4vc2hhcGUvZnJvbS1jZW50cm9pZC1hbmQtYW5nbGUnO1xyXG5pbXBvcnQgeyBjb21wYXJlUG9pbnRzIH0gZnJvbSAnLi4vc2hhcGVzL2NvbXBhcmUtcG9pbnRzJztcclxuXHJcbmNvbnN0IHsgYWJzLCBtYXggfSA9IE1hdGg7XHJcbmNvbnN0IFRPTCA9IDIqKi0xMDtcclxuXHJcbi8vIEUuZy4gMTItNCw2LTNcclxuLy8gLS0tLS0tLS0tLS0tLVxyXG4vLyAxLiBQbGFjZSBzZWVkIHNoYXBlICgxMilcclxuLy8gMi4gU2hhcGUgZ3JvdXBzID09PSA0LDYtM1xyXG4vLyAzLiBQbGFjZSA0IG9uIGZpcnN0IG9wZW4gcG9seWdvbiBlZGdlXHJcbi8vIDQuIFBsYWNlIDYgb24gbmV4dCBwb2x5Z29uIGVkZ2UgKG9mIHNhbWUgc2hhcGUpXHJcbi8vIDUuIFBsYWNlIDMgb24gZmlyc3Qgb3BlbiBwb2x5Z29uIGVkZ2Ugb2YgcG9seWdvbnMgaW4gcHJldmlvdXMgcGhhc2VcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTZWVkU2hhcGVzKFxyXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHN0cmluZykge1xyXG5cclxuICAgIGNvbnN0IHsgc2VlZFNoYXBlVHlwZSwgc2hhcGVHcm91cHMgfSA9IHRvRW50aXRpZXMoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgY29uc3Qgc2VlZFNoYXBlID0gZ2V0U2VlZFNoYXBlKHNlZWRTaGFwZVR5cGUpO1xyXG5cclxuICAgIGxldCBzaGFwZXMgPSBbc2VlZFNoYXBlXTtcclxuXHJcbiAgICBsZXQgc3RhZ2VQbGFjZW1lbnQgPSAxO1xyXG5cclxuICAgIC8qKiBNYXAgZnJvbSBsaW5lIHNlZ21lbnQgaGFzaCB0byBudW1iZXIgb2YgbGluZSBzZWdtZW50cyBhZGRlZCAqL1xyXG4gICAgY29uc3QgY29ubmVjdGlvbnMgPSBuZXcgTWFwPG51bWJlcixudW1iZXI+KCk7XHJcbiAgICBhZGRDb25uZWN0aW9ucyhjb25uZWN0aW9ucywgc2VlZFNoYXBlKTtcclxuXHJcbiAgICBsZXQgcHJldlNoYXBlcyA9IFtzZWVkU2hhcGVdO1xyXG4gICAgZm9yIChjb25zdCBzaGFwZUdyb3VwIG9mIHNoYXBlR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3Qgc2hhcGVzRWRnZXMgPSBwcmV2U2hhcGVzXHJcbiAgICAgICAgICAgIC5tYXAocyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IGMsIM64bSwgc2lkZXMgfSA9IHM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcyA9IGZyb21DZW50cm9pZEFuZEFuZ2xlKGMsIM64bSwgc2lkZXMsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRTaGFwZUVkZ2VzKHBzKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZsYXQoKVxyXG4gICAgICAgICAgICAuc29ydCgoYSxiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWJzKGFbMF1bMF0pIDwgVE9MICYmIGFicyhhWzFdWzBdKSA8IFRPTCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZlcnRpY2FsIGxpbmUgc2VnbWVudCBwYXNzaW5nIHRocm91Z2ggb3JpZ2luXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYWJzKGJbMF1bMF0pIDwgVE9MICYmIGFicyhiWzFdWzBdKSA8IFRPTCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZlcnRpY2FsIGxpbmUgc2VnbWVudCBwYXNzaW5nIHRocm91Z2ggb3JpZ2luXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgY2EgPSBnZXRDZW50cm9pZChhKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNiID0gZ2V0Q2VudHJvaWQoYik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFyZVBvaW50cyhjYSxjYik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwcmV2U2hhcGVzID0gW107XHJcbiAgICAgICAgbGV0IGlkeCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHNoYXBlc0VkZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpZGVzID0gc2hhcGVHcm91cFtpZHhdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbHMgPSBzaGFwZXNFZGdlc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgbiA9IGdldE51bWJlck9mQ29ubmVjdGlvbnMoY29ubmVjdGlvbnMsIGxzKTtcclxuICAgICAgICAgICAgaWYgKG4gPiAxKSB7IGNvbnRpbnVlOyB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2lkZXMgPT09IDApIHsgaWR4Kys7IGNvbnRpbnVlOyB9XHJcblxyXG4gICAgICAgICAgICBzdGFnZVBsYWNlbWVudCsrO1xyXG4gICAgICAgICAgICBjb25zdCBzaGFwZSA9IGZyb21MaW5lU2VnbWVudChzaWRlcywgbHMsIHN0YWdlUGxhY2VtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHNoYXBlcy5wdXNoKHNoYXBlKTtcclxuICAgICAgICAgICAgcHJldlNoYXBlcy5wdXNoKHNoYXBlKTtcclxuXHJcbiAgICAgICAgICAgIGFkZENvbm5lY3Rpb25zKGNvbm5lY3Rpb25zLCBzaGFwZSk7XHJcblxyXG4gICAgICAgICAgICBpZHgrKztcclxuXHJcbiAgICAgICAgICAgIGlmIChpZHggPj0gc2hhcGVHcm91cC5sZW5ndGgpIHsgYnJlYWs7IH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzaGFwZXM6IFtzaGFwZXNdLFxyXG4gICAgICAgIG1heFN0YWdlUGxhY2VtZW50OiBzdGFnZVBsYWNlbWVudFxyXG4gICAgfTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE51bWJlck9mQ29ubmVjdGlvbnMoXHJcbiAgICAgICAgY29ubmVjdGlvbnM6IE1hcDxudW1iZXIsbnVtYmVyPixcclxuICAgICAgICBsczogbnVtYmVyW11bXSkge1xyXG5cclxuICAgIGNvbnN0IGVkZ2VIYXNoZXMgPSBnZXRUcmFuc2Zvcm1Qb2ludEJ1Y2tldHMoZ2V0Q2VudHJvaWQobHMpKTtcclxuXHJcbiAgICBjb25zdCBocyA9IGVkZ2VIYXNoZXNcclxuICAgICAgICAubWFwKGggPT4gY29ubmVjdGlvbnMuZ2V0KGgpKVxyXG4gICAgICAgIC5maWx0ZXIoaCA9PiBoICE9PSB1bmRlZmluZWQpIGFzIG51bWJlcltdO1xyXG5cclxuICAgIGlmIChocy5sZW5ndGggPT09IDApIHsgcmV0dXJuIDA7IH1cclxuXHJcbiAgICByZXR1cm4gbWF4KC4uLmhzKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGFkZENvbm5lY3Rpb25zKFxyXG4gICAgICAgIGNvbm5lY3Rpb25zOiBNYXA8bnVtYmVyLG51bWJlcj4sXHJcbiAgICAgICAgc2hhcGU6IFNoYXBlKSB7XHJcblxyXG4gICAgY29uc3QgeyBjLCDOuG0sIHNpZGVzIH0gPSBzaGFwZTtcclxuICAgIGNvbnN0IHBzID0gZnJvbUNlbnRyb2lkQW5kQW5nbGUoYywgzrhtLCBzaWRlcywgMSk7XHJcbiAgICBjb25zdCBlZGdlcyA9IGdldFNoYXBlRWRnZXMocHMpO1xyXG4gICAgY29uc3QgZWRnZUhhc2hlc3MgPSBlZGdlc1xyXG4gICAgLm1hcChscyA9PiBnZXRUcmFuc2Zvcm1Qb2ludEJ1Y2tldHMoZ2V0Q2VudHJvaWQobHMpKSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBlZGdlSGFzaGVzIG9mIGVkZ2VIYXNoZXNzKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBoIG9mIGVkZ2VIYXNoZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbiA9IGNvbm5lY3Rpb25zLmdldChoKSB8fCAwO1xyXG4gICAgICAgICAgICBjb25uZWN0aW9ucy5zZXQoaCwgbiArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGdldFNlZWRTaGFwZXMgfVxyXG4iLCJpbXBvcnQgeyBUcmFuc2Zvcm1Qb2ludCB9IGZyb20gXCIuLi90eXBlcy90cmFuc2Zvcm0tcG9pbnRcIjtcclxuaW1wb3J0IHsgc2NhbGVWZWN0b3IgfSBmcm9tIFwiLi4vdmVjdG9yL3NjYWxlXCI7XHJcblxyXG5cclxuZnVuY3Rpb24gc2NhbGVUcmFuc2Zvcm1Qb2ludHNNYXBzKFxyXG4gICAgICAgIHNoYXBlU2l6ZTogbnVtYmVyLFxyXG4gICAgICAgIHRyYW5zZm9ybVBvaW50c01hcHM6IE1hcDxzdHJpbmcsIFRyYW5zZm9ybVBvaW50PltdKSB7XHJcblxyXG4gICAgY29uc3QgbWFwczogTWFwPHN0cmluZywgVHJhbnNmb3JtUG9pbnQ+W10gPSBbXTtcclxuICAgIGZvciAoY29uc3QgbSBvZiB0cmFuc2Zvcm1Qb2ludHNNYXBzKSB7XHJcbiAgICAgICAgY29uc3QgbWFwOiBNYXA8c3RyaW5nLCBUcmFuc2Zvcm1Qb2ludD4gPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBbayxwdF0gb2YgbSkge1xyXG4gICAgICAgICAgICBtYXAuc2V0KGssIHtcclxuICAgICAgICAgICAgICAgIC4uLnB0LFxyXG4gICAgICAgICAgICAgICAgdjogc2NhbGVWZWN0b3Ioc2hhcGVTaXplKShwdC52KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFwcy5wdXNoKG1hcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcHM7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBzY2FsZVRyYW5zZm9ybVBvaW50c01hcHMgfVxyXG4iLCJpbXBvcnQgeyBBbnR3ZXJwRGF0YSB9IGZyb20gJy4uL3R5cGVzL2FudHdlcnAtZGF0YSc7XG5pbXBvcnQgeyB0b0VudGl0aWVzIH0gZnJvbSAnLi4vdG8tZW50aXRpZXMnO1xuaW1wb3J0IHsgZ2V0VHJhbnNmb3JtUG9pbnRzIH0gZnJvbSAnLi4vc2hhcGVzL2dldC10cmFuc2Zvcm0tcG9pbnRzJztcbmltcG9ydCB7IGdldFNlZWRTaGFwZXMgfSBmcm9tICcuL2dldC1zZWVkLXNoYXBlcyc7XG5pbXBvcnQgeyBUcmFuc2Zvcm1Qb2ludCB9IGZyb20gJy4uL3R5cGVzL3RyYW5zZm9ybS1wb2ludCc7XG5pbXBvcnQgeyBzY2FsZVRyYW5zZm9ybVBvaW50c01hcHMgfSBmcm9tICcuL3NjYWxlLXRyYW5zZm9ybS1wb2ludHMtbWFwJztcbmltcG9ydCB7IGNyZWF0ZUJ1Y2tldHMgfSBmcm9tICcuLi9oYXNoL2NlYXRlLWJ1Y2tldHMnO1xuaW1wb3J0IHsgZ2V0TmV3U2hhcGVzIH0gZnJvbSAnLi4vc2hhcGVzL2dldC1uZXctc2hhcGVzJztcbmltcG9ydCB7IHRyYW5zZm9ybVVzaW5nVHJhbnNmb3JtUG9pbnQgfSBmcm9tICcuL3RyYW5zZm9ybS11c2luZy10cmFuc2Zvcm0tcG9pbnQnO1xuaW1wb3J0IHsgdHJhbnNmb3JtVXNpbmdPcmlnaW4gfSBmcm9tICcuL3RyYW5zZm9ybS11c2luZy1vcmlnaW4nO1xuaW1wb3J0IHsgc2NhbGVWZWN0b3IgfSBmcm9tICcuLi92ZWN0b3Ivc2NhbGUnO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIHJlZ3VsYXIgcG9seWdvbiB0ZXNzZWxhdGlvbiBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIEdvbUphdUhvZ2dcbiAqIG5vdGF0aW9uLlxuICogXG4gKiBUaGUgcmV0dXJuIHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqICogYHNoYXBlc2AgLSB0aGUgcmV0dXJuZWQgc2hhcGUgb2JqZWN0IGFycmF5LCBlYWNoIGhhdmluZyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiAgICogYGNgIC0+IGNlbnRyb2lkIG9mIHNoYXBlIGdpdmVuIGFzIGBbeCx5XWBcbiAqICAgKiBgzrhtYCAtPiBhbmdsZSBzaGFwZSBzaXRzIGF0IGdpdmVuIGFzIGDOuG0gPT09IM64KjEyL1BJYCB3aGVyZSDOuCBpcyBpbiByYWRpYW5zXG4gKiAgICogYHNpZGVzYCAtPiBudW1iZXIgb2Ygc2lkZXMgKDMsNCw2LDggb3IgMTIpXG4gKiAgICogYHN0YWdlYCAtPiB0aGUgdHJhbnNmb3JtYXRpb24gc3RhZ2VcbiAqICAgKiBgc3RhZ2VQbGFjZW1lbnRgIC0+IHBsYWNlbWVudCBzdGFnZSBhcyBkZXRlcm1pbmVkIGJ5IHNlZWQgc2hhcGVzXG4gKiAqIGBtYXhTdGFnZWAgLT4gY2FuIGJlIHVzZWQgdG8gY29sb3Igc2hhcGVzXG4gKiAqIGBtYXhTdGFnZVBsYWNlbWVudGAgLT4gY2FuIGJlIHVzZWQgdG8gY29sb3Igc2hhcGVzXG4gKiAqIGB0cmFuc2Zvcm1Qb2ludHNNYXBzYCAtPiBjYW4gYmUgdXNlZCB0byBkaXNwbGF5IHRyYW5zZm9ybWF0aW9uIHBvaW50c1xuICogXG4gKiBAcGFyYW0gb3B0aW9ucyBhbiBvYmplY3Qgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBgY29uZmlndXJhdGlvbmAgd2hpY2ggaXMgYVxuICogc3RyaW5nIGluIHRoZSBHb21KYXVIb2dnIG5vdGF0aW9uIChlLmcuIGA2LTQtMywzL20zMC9yKGgxKWApLCBgcmVwZWF0Q291bnRgXG4gKiB3aGljaCBpcyB0aGUgbnVtYmVyIG9mIHRpbWVzIHRyYW5zZm9ybXMgd2lsbCBiZSByZXBlYXRlZCAoZS5nLiAxMCk7IHRoZSBudW1iZXJcbiAqIG9mIHNoYXBlcyBncm93IGFzIHRoZSBzcXVhcmUgb2YgdGhpcyBudW1iZXIgYW5kIGZpbmFsbHkgYHNoYXBlU2l6ZWAgcmVwcmVzZW50aW5nXG4gKiB0aGUgbGVuZ3RoIG9mIGVhY2ggc2hhcGUncyBlZGdlLlxuICovXG5mdW5jdGlvbiB0b1NoYXBlcyhcbiAgICAgICAgY29uZmlndXJhdGlvbjogc3RyaW5nLFxuICAgICAgICByZXBlYXRDb3VudDogbnVtYmVyLFxuICAgICAgICBzaGFwZVNpemU6IG51bWJlcik6IEFudHdlcnBEYXRhIHtcblxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3QgYnVja2V0cyA9IGNyZWF0ZUJ1Y2tldHMoKTtcblxuICAgIGNvbnN0IHsgdHJhbnNmb3JtcyB9ID0gdG9FbnRpdGllcyhjb25maWd1cmF0aW9uKTtcblxuICAgIGxldCB7IHNoYXBlcywgbWF4U3RhZ2VQbGFjZW1lbnQgfSA9IGdldFNlZWRTaGFwZXMoY29uZmlndXJhdGlvbik7XG5cbiAgICBzaGFwZXMgPSBbZ2V0TmV3U2hhcGVzKGJ1Y2tldHMsIHNoYXBlcy5mbGF0KCkpXTtcbiAgICBjb25zdCB0cmFuc2Zvcm1Qb2ludHNNYXBzOiBNYXA8c3RyaW5nLCBUcmFuc2Zvcm1Qb2ludD5bXSA9IFtdO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmVwZWF0aW5nIHRoZSBUcmFuc2Zvcm1hdGlvbnNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgdHJhbnNmb3JtUG9pbnRzOiBNYXA8c3RyaW5nLCBUcmFuc2Zvcm1Qb2ludD4gPSBuZXcgTWFwKCk7XG4gICAgbGV0IG5ld1NoYXBlc0dyb3cgPSBzaGFwZXMuZmxhdCgpLnNsaWNlKCk7XG4gICAgbGV0IG5ld1NoYXBlc0ZpbGwgPSBzaGFwZXMuZmxhdCgpLnNsaWNlKCk7XG4gICAgbGV0IHByZXZXYXNGaWxsID0gdHJ1ZTtcbiAgICBsZXQgcHJldldhc0dyb3cgPSB0cnVlO1xuICAgIGZvciAobGV0IGk9MDsgaTxyZXBlYXRDb3VudDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajx0cmFuc2Zvcm1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm1zW2pdO1xuICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1Qb2ludHMgPSBnZXRUcmFuc2Zvcm1Qb2ludHMoc2hhcGVzLmZsYXQoKSk7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtUG9pbnRzTWFwcy5wdXNoKHRyYW5zZm9ybVBvaW50cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVBvaW50cyA9IHRyYW5zZm9ybVBvaW50c01hcHNbal07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHsgcG9pbnRJbmRleCwgYW5nbGUgfSA9IHRyYW5zZm9ybTtcblxuICAgICAgICAgICAgY29uc3QgYWRkZWRTaGFwZXMgPSAhIXBvaW50SW5kZXhcbiAgICAgICAgICAgICAgICA/IHRyYW5zZm9ybVVzaW5nVHJhbnNmb3JtUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldHMsIG5ld1NoYXBlc0ZpbGwsIHRyYW5zZm9ybSwgdHJhbnNmb3JtUG9pbnRzXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIDogdHJhbnNmb3JtVXNpbmdPcmlnaW4oXG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldHMsIG5ld1NoYXBlc0dyb3csIHRyYW5zZm9ybVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzR3JvdyA9ICEhcG9pbnRJbmRleCB8fCBhbmdsZSA9PT0gMTI7XG5cbiAgICAgICAgICAgIGlmICghcHJldldhc0ZpbGwgJiYgIWlzR3Jvdykge1xuICAgICAgICAgICAgICAgIG5ld1NoYXBlc0ZpbGwgPSBhZGRlZFNoYXBlcy5zbGljZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHMgb2YgYWRkZWRTaGFwZXMpIHsgbmV3U2hhcGVzRmlsbC5wdXNoKHMpOyB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcHJldldhc0dyb3cgJiYgaXNHcm93KSB7XG4gICAgICAgICAgICAgICAgbmV3U2hhcGVzR3JvdyA9IGFkZGVkU2hhcGVzLnNsaWNlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiBhZGRlZFNoYXBlcykgeyBuZXdTaGFwZXNHcm93LnB1c2gocyk7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2hhcGVzLnB1c2goYWRkZWRTaGFwZXMpO1xuXG4gICAgICAgICAgICBwcmV2V2FzRmlsbCA9ICFpc0dyb3c7XG4gICAgICAgICAgICBwcmV2V2FzR3JvdyA9IGlzR3JvdztcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgY29uc3Qgc2hhcGVzXyA9IHNoYXBlc1xuICAgIC5mbGF0KCkubWFwKHNoYXBlID0+IHtcbiAgICAgICAgY29uc3QgeyBjLCBzaWRlcywgc3RhZ2UsIHN0YWdlUGxhY2VtZW50LCDOuG0gfSA9IHNoYXBlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2lkZXMsIHN0YWdlLCBzdGFnZVBsYWNlbWVudCwgzrhtLFxuICAgICAgICAgICAgYzogc2NhbGVWZWN0b3Ioc2hhcGVTaXplKShjKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBsYXN0U2hhcGVzID0gc2hhcGVzW3NoYXBlcy5sZW5ndGgtMV07XG4gICAgY29uc3QgbGFzdFNoYXBlID0gbGFzdFNoYXBlc1tsYXN0U2hhcGVzLmxlbmd0aC0xXTtcbiAgICBjb25zdCBtYXhTdGFnZSA9IGxhc3RTaGFwZSA/IGxhc3RTaGFwZS5zdGFnZSA6IDA7XG5cbiAgICBjb25zdCB0cmFuc2Zvcm1Qb2ludHNNYXBzXyA9IHNjYWxlVHJhbnNmb3JtUG9pbnRzTWFwcyhcbiAgICAgICAgc2hhcGVTaXplLFxuICAgICAgICB0cmFuc2Zvcm1Qb2ludHNNYXBzXG4gICAgKTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBjb25zdCBlbmRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgLy8gY29uc29sZS5sb2coJ2wnLCBzaGFwZXNfLmxlbmd0aCk7XG4gICAgLy8gY29uc29sZS5sb2coKChlbmRUaW1lIC0gc3RhcnRUaW1lKSkudG9GaXhlZCgxKSArICcgbXMnKVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGNvbnN0IHIgPSB7XG4gICAgICAgIHNoYXBlczogc2hhcGVzXyxcbiAgICAgICAgbWF4U3RhZ2UsXG4gICAgICAgIG1heFN0YWdlUGxhY2VtZW50LFxuICAgICAgICB0cmFuc2Zvcm1Qb2ludHNNYXBzOiB0cmFuc2Zvcm1Qb2ludHNNYXBzX1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKHIpXG5cbiAgICByZXR1cm4gcjtcbn1cblxuXG5leHBvcnQgeyB0b1NoYXBlcyB9XG5cblxuLy8gUmVjb3JkZWQgdGltaW5nc1xuLy8gPT09PT09PT09PT09PT09PVxuLy8gNi00LTMsMy9tMzAvcihoMSlcbi8vIC0tLS0tLS0tLS0tLS0tLS0tXG4vLyByZXBlYXRDb3VudDogMSAgIC0+IHRpbWU6IDAuNSBtcyAgIC0+ICNzaGFwZXM6IDM2XG4vLyByZXBlYXRDb3VudDogNCAgIC0+IHRpbWU6IDAuNyBtcyAgIC0+ICNzaGFwZXM6IDY5NlxuLy8gcmVwZWF0Q291bnQ6IDE2ICAtPiB0aW1lOiA4LjEgbXMgICAtPiAjc2hhcGVzOiAxMTQ0NVxuLy8gcmVwZWF0Q291bnQ6IDI1ICAtPiB0aW1lOiAxNy43IG1zICAtPiAjc2hhcGVzOiAyODAxNFxuLy8gcmVwZWF0Q291bnQ6IDY0ICAtPiB0aW1lOiAxMTEuNyBtcyAtPiAjc2hhcGVzOiAxODQwMzhcbi8vIHJlcGVhdENvdW50OiAxMDAgLT4gdGltZTogMzE4IG1zICAgLT4gI3NoYXBlczogNDQ5NTcwXG4vLyByZXBlYXRDb3VudDogMTI4IC0+IHRpbWU6IDQ3Ny41IG1zIC0+ICNzaGFwZXM6IDczNjczNlxuLy8gcmVwZWF0Q291bnQ6IDE1MCAtPiB0aW1lOiA3NTEgbXMgICAtPiAjc2hhcGVzOiAxMDExODY0XG4vLyByZXBlYXRDb3VudDogMjAwIC0+IHRpbWU6IDEzOTUgbXMgIC0+ICNzaGFwZXM6IDE3OTkxNjJcbi8vIHJlcGVhdENvdW50OiAyNTYgLT4gdGltZTogMjEwMCBtcyAgLT4gI3NoYXBlczogMjk0ODA1NFxuXG4vLyBUaGlzIHNob3dzIHRoYXQgZm9yIGBuID09PSByZXBlYXRDb3VudGAgdGhlIG51bWJlciBvZiBzaGFwZXMgZ3JvdyBhcyBgTyhuXjIpYFxuLy8gYW5kIHRoZSB0aW1lIGdyb3dzIGFzIGBPKG5eMilgIGFzIHdlbGwgc28gdGhhdDpcbi8vIFRoZSBhbGdvcml0aG0gaXMgbGluZWFyIGluIHRoZSBudW1iZXIgb2Ygc2hhcGVzLCBpLmUuIGB0b1NoYXBlcyB+IE8obilgXG4iLCJpbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tICcuLi90eXBlcy90cmFuc2Zvcm0nO1xyXG5pbXBvcnQgeyByb3RhdGVTaGFwZXNBcm91bmQgfSBmcm9tICcuLi9zaGFwZXMvcm90YXRlLXNoYXBlcyc7XHJcbmltcG9ydCB7IHplcm9WZWN0b3IgfSBmcm9tICcuLi92ZWN0b3IvemVyby12ZWN0b3InO1xyXG5pbXBvcnQgeyBTaGFwZSB9IGZyb20gJy4uL3NoYXBlL3NoYXBlJztcclxuaW1wb3J0IHsgcmVmbGVjdFNoYXBlcyB9IGZyb20gJy4uL3NoYXBlcy9yZWZsZWN0LXNoYXBlcyc7XHJcbmltcG9ydCB7IGdldE5ld1NoYXBlcyB9IGZyb20gJy4uL3NoYXBlcy9nZXQtbmV3LXNoYXBlcyc7XHJcblxyXG5jb25zdCB7IHJvdW5kIH0gPSBNYXRoO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHRyYW5zZm9ybVVzaW5nT3JpZ2luKFxyXG4gICAgICAgIGJ1Y2tldHM6IFtVaW50MzJBcnJheV0sXHJcbiAgICAgICAgbmV3U2hhcGVzR3JvdzogU2hhcGVbXSxcclxuICAgICAgICB0cmFuc2Zvcm06IFRyYW5zZm9ybSkge1xyXG5cclxuICAgIGNvbnN0IHsgYW5nbGUsIHRyYW5zZm9ybVR5cGUgfSA9IHRyYW5zZm9ybTtcclxuXHJcbiAgICBjb25zdCByZWxldmFudFNoYXBlcyA9IG5ld1NoYXBlc0dyb3cuc2xpY2UoKTtcclxuICAgIGNvbnN0IGFkZGVkU2hhcGVzOiBTaGFwZVtdID0gW107XHJcbiAgICBjb25zdCDOuG0gPSByb3VuZChhbmdsZSEpO1xyXG5cclxuICAgIGZvciAobGV0IM64Pc64bTsgzrg8PTI0OyDOuCo9Mikge1xyXG4gICAgICAgIGNvbnN0IM64MiA9IC0ozrggLSA2KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hhcGVzVG9BZGQgPSB0cmFuc2Zvcm1UeXBlID09PSAnbSdcclxuICAgICAgICAgICAgPyByZWZsZWN0U2hhcGVzKDIqzrgyLCB6ZXJvVmVjdG9yLCByZWxldmFudFNoYXBlcylcclxuICAgICAgICAgICAgOiByb3RhdGVTaGFwZXNBcm91bmQozrgsIHplcm9WZWN0b3IsIHJlbGV2YW50U2hhcGVzKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0gZ2V0TmV3U2hhcGVzKGJ1Y2tldHMsIHNoYXBlc1RvQWRkKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHMgb2YgbmV3U2hhcGVzKSB7XHJcbiAgICAgICAgICAgIGFkZGVkU2hhcGVzLnB1c2gocyk7XHJcbiAgICAgICAgICAgIHJlbGV2YW50U2hhcGVzLnB1c2gocyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYWRkZWRTaGFwZXM7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyB0cmFuc2Zvcm1Vc2luZ09yaWdpbiB9XHJcbiIsImltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gJy4uL3R5cGVzL3RyYW5zZm9ybSc7XHJcbmltcG9ydCB7IHJvdGF0ZVNoYXBlc0Fyb3VuZCB9IGZyb20gJy4uL3NoYXBlcy9yb3RhdGUtc2hhcGVzJztcclxuaW1wb3J0IHsgcmVmbGVjdFNoYXBlcyB9IGZyb20gJy4uL3NoYXBlcy9yZWZsZWN0LXNoYXBlcyc7XHJcbmltcG9ydCB7IFNoYXBlIH0gZnJvbSAnLi4vc2hhcGUvc2hhcGUnO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm1Qb2ludCB9IGZyb20gJy4uL3R5cGVzL3RyYW5zZm9ybS1wb2ludCc7XHJcbmltcG9ydCB7IGdldE5ld1NoYXBlcyB9IGZyb20gJy4uL3NoYXBlcy9nZXQtbmV3LXNoYXBlcyc7XHJcblxyXG5cclxuZnVuY3Rpb24gdHJhbnNmb3JtVXNpbmdUcmFuc2Zvcm1Qb2ludChcclxuICAgICAgICBidWNrZXRzOiBbVWludDMyQXJyYXldLFxyXG4gICAgICAgIG5ld1NoYXBlc0ZpbGw6IFNoYXBlW10sXHJcbiAgICAgICAgdHJhbnNmb3JtOiBUcmFuc2Zvcm0sXHJcbiAgICAgICAgdHJhbnNmb3JtUG9pbnRzOiBNYXA8c3RyaW5nLCBUcmFuc2Zvcm1Qb2ludD4pIHtcclxuXHJcbiAgICBjb25zdCB7IHBvaW50SW5kZXgsIHRyYW5zZm9ybVR5cGUgfSA9IHRyYW5zZm9ybTtcclxuICAgIGNvbnN0IHRyYW5zZm9ybVBvaW50ID0gdHJhbnNmb3JtUG9pbnRzLmdldChwb2ludEluZGV4KSE7XHJcbiAgICBjb25zdCB7IHYsIM64MiB9ID0gdHJhbnNmb3JtUG9pbnQ7XHJcblxyXG4gICAgLy8gaHR0cHM6Ly93d3cubWRwaS5jb20vMjA3My04OTk0LzEzLzEyLzIzNzZcclxuICAgIC8vIFwiV2hlbiBzcGVjaWZ5aW5nIHRoZSB2ZXJ0ZXggb2YgYSBwb2x5Z29u4oCZcyBjZW50cm9pZCAoRmlndXJlIDExKSBvclxyXG4gICAgLy8gdmVydGV4IChGaWd1cmUgMTIpLCB0aGUgYW5nbGUgdGhhdCBpcyB1c2VkIGZvciB0aGUgdHJhbnNmb3JtYXRpb24gaXNcclxuICAgIC8vIGluZmVycmVkIGZyb20gdGhlIGFuZ2xlIG9mIHRoYXQgdmVydGV4IHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIgb2YgdGhlXHJcbiAgICAvLyBjb29yZGluYXRlIHN5c3RlbS4gSG93ZXZlciwgd2hlbiB1c2luZyB0aGUgbWlkcG9pbnQgb2YgYSBsaW5lIHNlZ21lbnRcclxuICAgIC8vICh0aGUgcG9seWdvbuKAmXMgZWRnZSwgYXMgc2hvd24gaW4gRmlndXJlIDEwLCByaWdodCksIHRoZSBhbmdsZSBmb3IgdGhlXHJcbiAgICAvLyB0cmFuc2Zvcm0gaXMgaW5mZXJyZWQgZnJvbSB0aGUgYW5nbGUgb2YgdGhhdCBlZGdlLi4uXCJcclxuXHJcbiAgICBjb25zdCBzaGFwZXNUb0FkZCA9IHRyYW5zZm9ybVR5cGUgPT09ICdtJ1xyXG4gICAgICAgID8gcmVmbGVjdFNoYXBlcyjOuDIsIHYsIG5ld1NoYXBlc0ZpbGwpXHJcbiAgICAgICAgOiByb3RhdGVTaGFwZXNBcm91bmQoMTIsIHYsIG5ld1NoYXBlc0ZpbGwpO1xyXG5cclxuICAgIHJldHVybiBnZXROZXdTaGFwZXMoYnVja2V0cywgc2hhcGVzVG9BZGQpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgdHJhbnNmb3JtVXNpbmdUcmFuc2Zvcm1Qb2ludCB9XHJcbiIsIlxyXG5mdW5jdGlvbiBhZGRWZWN0b3IodjE6IG51bWJlcltdLCB2MjogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIHYxWzBdICsgdjJbMF0sXHJcbiAgICAgICAgdjFbMV0gKyB2MlsxXVxyXG4gICAgXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGFkZFZlY3RvciB9XHJcbiIsIlxyXG5jb25zdCB7IFBJLCBhYnMgfSA9IE1hdGg7XHJcblxyXG5cclxuY29uc3QgQU5HTEVfUFJFQ0lTSU9OID0gMioqLTEwO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGFuZ2xlRXF1YWxzKM64YTogbnVtYmVyLCDOuGI6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgbGV0IGQgPSBhYnMozrhhIC0gzrhiKTtcclxuICAgIGQgPSBkIDwgUEkgPyBkIDogYWJzKDIqUEkgLSBkKTtcclxuXHJcbiAgICByZXR1cm4gZCA8PSBBTkdMRV9QUkVDSVNJT047XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBhbmdsZUVxdWFscyB9XHJcbiIsIlxyXG5pbXBvcnQgeyB6ZXJvVmVjdG9yIH0gZnJvbSAnLi96ZXJvLXZlY3Rvcic7XHJcblxyXG5jb25zdCB7IGh5cG90IH0gPSBNYXRoO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRpc3RhbmNlQmV0d2VlbihcclxuICAgICAgICB2MTogbnVtYmVyW10sXHJcbiAgICAgICAgdjIgPSB6ZXJvVmVjdG9yKTogbnVtYmVyIHtcclxuXHJcbiAgICByZXR1cm4gaHlwb3QodjFbMF0gLSB2MlswXSwgdjFbMV0gLSB2MlsxXSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBkaXN0YW5jZUJldHdlZW4gfVxyXG4iLCJcclxuY29uc3QgeyBQSSwgYXRhbjIgfSA9IE1hdGg7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0QW5nbGVDbG9ja3dpc2VGcm9tWUF4aXModjogbnVtYmVyW10pIHtcclxuICAgIGNvbnN0IFt4LHldID0gdjtcclxuICAgIGNvbnN0IM64ID0gKDIqUEkpIC0gKGF0YW4yKHkseCkgLSBQSS8yICsgMipQSSklKDIqUEkpO1xyXG5cclxuICAgIHJldHVybiDOuDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBnZXRBbmdsZUNsb2Nrd2lzZUZyb21ZQXhpc1xyXG59XHJcbiIsIlxyXG5jb25zdCB7IFBJLCBjb3MsIHNpbiB9ID0gTWF0aDtcclxuXHJcblxyXG5mdW5jdGlvbiByZWZsZWN0VmVjdG9yKFxyXG4gICAgICAgIM64bTogbnVtYmVyLFxyXG4gICAgICAgIHY6IG51bWJlcltdLFxyXG4gICAgICAgIHA6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG5cclxuICAgIGNvbnN0IGN4ID0gdlswXTtcclxuICAgIGNvbnN0IGN5ID0gdlsxXTtcclxuXHJcbiAgICBjb25zdCB2eCA9IHBbMF0gLSBjeDtcclxuICAgIGNvbnN0IHZ5ID0gcFsxXSAtIGN5O1xyXG5cclxuICAgIGNvbnN0IGNvc864ID0gY29zKM64bSpQSS8xMik7XHJcbiAgICBjb25zdCBzaW7OuCA9IHNpbijOuG0qUEkvMTIpO1xyXG5cclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgY29zzrgqdnggKyBzaW7OuCp2eSArIGN4LFxyXG4gICAgICAgIHNpbs64KnZ4IC0gY29zzrgqdnkgKyBjeVxyXG4gICAgXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IHJlZmxlY3RWZWN0b3IgfVxyXG4iLCJpbXBvcnQgeyB6ZXJvVmVjdG9yIH0gZnJvbSBcIi4vemVyby12ZWN0b3JcIjtcclxuXHJcbmNvbnN0IHsgUEksIHNpbiwgY29zIH0gPSBNYXRoO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSByZXN1bHQgb2Ygcm90YXRpbmcgYSB2ZWN0b3IgYXJvdW5kIGEgc3BlY2lmaWVkIHBvaW50LlxyXG4gKiBcclxuICogQHBhcmFtIM64IGFuZ2xlXHJcbiAqIEBwYXJhbSBjIGNlbnRlciBvZiByb3RhdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gcm90YXRlVmVjdG9yQXJvdW5kKFxyXG4gICAgICAgIM64bTogbnVtYmVyLFxyXG4gICAgICAgIGMgPSB6ZXJvVmVjdG9yLFxyXG4gICAgICAgIHY6IG51bWJlcltdKSB7XHJcblxyXG4gICAgY29uc3QgeCA9IHZbMF07XHJcbiAgICBjb25zdCB5ID0gdlsxXTtcclxuXHJcbiAgICBjb25zdCDOuCA9IM64bSpQSS8xMjtcclxuICAgIGNvbnN0IGNvc864ID0gY29zKM64KTtcclxuICAgIGNvbnN0IHNpbs64ID0gc2luKM64KTtcclxuXHJcbiAgICBjb25zdCBbY3gsY3ldID0gYztcclxuICAgIGNvbnN0IHZ4ID0geCAtIGN4O1xyXG4gICAgY29uc3QgdnkgPSB5IC0gY3k7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBjb3POuCp2eCAtIHNpbs64KnZ5ICsgY3gsXHJcbiAgICAgICAgc2luzrgqdnggKyBjb3POuCp2eSArIGN5XHJcbiAgICBdO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgcm90YXRlVmVjdG9yQXJvdW5kIH1cclxuIiwiXHJcbmZ1bmN0aW9uIHNjYWxlVmVjdG9yKHM6IG51bWJlcikge1xyXG4gICAgcmV0dXJuICh2OiBudW1iZXJbXSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBbcyp2WzBdLHMqdlsxXV07XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBzY2FsZVZlY3RvciB9XHJcbiIsIlxyXG4vKipcclxuICogUmV0dXJucyBgdjEgLSB2MmAuXHJcbiAqL1xyXG5mdW5jdGlvbiBzdWJ0cmFjdFZlY3Rvcih2MTogbnVtYmVyW10sIHYyOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgdjFbMF0gLSB2MlswXSxcclxuICAgICAgICB2MVsxXSAtIHYyWzFdXHJcbiAgICBdO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgc3VidHJhY3RWZWN0b3IgfVxyXG4iLCJcclxuY29uc3QgemVyb1ZlY3RvcjogbnVtYmVyW10gPSBbMCwwXTtcclxuXHJcblxyXG5leHBvcnQgeyB6ZXJvVmVjdG9yIH1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyB0b1NoYXBlcyB9IGZyb20gJy4vdG8tc2hhcGVzL3RvLXNoYXBlcyc7XHJcbmltcG9ydCB7IFNoYXBlIH0gZnJvbSAnLi9zaGFwZS9zaGFwZSc7XHJcbmltcG9ydCB7IEFudHdlcnBEYXRhIH0gZnJvbSAnLi90eXBlcy9hbnR3ZXJwLWRhdGEnO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tICcuL3R5cGVzL3RyYW5zZm9ybSc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybVBvaW50IH0gZnJvbSAnLi90eXBlcy90cmFuc2Zvcm0tcG9pbnQnO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm1UeXBlIH0gZnJvbSAnLi90eXBlcy90cmFuc2Zvcm0tdHlwZSc7XHJcbmltcG9ydCB7IGZyb21DZW50cm9pZEFuZEFuZ2xlIH0gZnJvbSAnLi9zaGFwZS9mcm9tLWNlbnRyb2lkLWFuZC1hbmdsZSc7XHJcblxyXG5cclxuZXhwb3J0IHtcclxuICAgIHRvU2hhcGVzLFxyXG4gICAgZnJvbUNlbnRyb2lkQW5kQW5nbGUsXHJcbiAgICBTaGFwZSxcclxuICAgIEFudHdlcnBEYXRhLFxyXG4gICAgVHJhbnNmb3JtLFxyXG4gICAgVHJhbnNmb3JtUG9pbnQsXHJcbiAgICBUcmFuc2Zvcm1UeXBlXHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9