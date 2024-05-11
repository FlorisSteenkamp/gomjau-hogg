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
const { ceil, log2 } = Math;
function createBuckets(maxRepeat) {
    // TODO2 - base this and the 16 on `seedShapes`
    // must be a multiple of 32
    const CC = 32;
    const len = 2 * CC * maxRepeat;
    const nextPowerOf2 = (2 ** ceil(log2(len)));
    const arrLen = (nextPowerOf2 ** 2) / 32;
    return new Uint32Array(arrLen);
}



/***/ }),

/***/ "./src/hash/get-buckets.ts":
/*!*********************************!*\
  !*** ./src/hash/get-buckets.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBuckets: () => (/* binding */ getBuckets)
/* harmony export */ });
/* harmony import */ var _get_coordinate_buckets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-coordinate-buckets */ "./src/hash/get-coordinate-buckets.ts");
/* harmony import */ var _hash_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hash-constants */ "./src/hash/hash-constants.ts");


function getBuckets(p) {
    const [x, y] = p;
    // We pack the buckets into one float by shifting by around 22 bits
    // Note this allows bucket points to be compared easily
    // using the usual ===,>,>= etc. operators
    const xBuckets = (0,_get_coordinate_buckets__WEBPACK_IMPORTED_MODULE_0__.getCoordinateBuckets)(x).map(b => b * _hash_constants__WEBPACK_IMPORTED_MODULE_1__.NUM_BUCKETS * 2 ** 2);
    const yBuckets = (0,_get_coordinate_buckets__WEBPACK_IMPORTED_MODULE_0__.getCoordinateBuckets)(y);
    // Pack buckets
    const buckets = [];
    for (let i = 0; i < xBuckets.length; i++) {
        for (let j = 0; j < yBuckets.length; j++) {
            buckets.push(xBuckets[i] + yBuckets[j]);
        }
    }
    return buckets;
}



/***/ }),

/***/ "./src/hash/get-buckets2.ts":
/*!**********************************!*\
  !*** ./src/hash/get-buckets2.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBuckets2: () => (/* binding */ getBuckets2)
/* harmony export */ });
/* harmony import */ var _get_coordinate_buckets2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-coordinate-buckets2 */ "./src/hash/get-coordinate-buckets2.ts");
/* harmony import */ var _hash_constants2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hash-constants2 */ "./src/hash/hash-constants2.ts");


function getBuckets2(p, maxRepeat) {
    const [x, y] = p;
    const CC = 32;
    // We pack the buckets into one float by shifting by around 22 bits
    // Note this allows bucket points to be compared easily
    // using the usual ===,>,>= etc. operators
    const xBuckets = (0,_get_coordinate_buckets2__WEBPACK_IMPORTED_MODULE_0__.getCoordinateBuckets2)(x);
    const yBuckets = (0,_get_coordinate_buckets2__WEBPACK_IMPORTED_MODULE_0__.getCoordinateBuckets2)(y);
    const NN = 2 ** _hash_constants2__WEBPACK_IMPORTED_MODULE_1__.N;
    // Pack buckets
    const buckets = [];
    for (let i = 0; i < xBuckets.length; i++) {
        for (let j = 0; j < yBuckets.length; j++) {
            buckets.push([
                xBuckets[i] * NN + CC * maxRepeat,
                yBuckets[j] * NN + CC * maxRepeat
            ]);
        }
    }
    return buckets;
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
/* harmony import */ var _hash_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hash-constants */ "./src/hash/hash-constants.ts");

const { round, abs } = Math;
/**
 * Perform a location sensitive hash (called buckets)
 *
 * * points close to zero are automatically put into bucket 0
 *
 * @param v
 */
function getCoordinateBuckets(v) {
    const buckets = [];
    const b1 = round(v / _hash_constants__WEBPACK_IMPORTED_MODULE_0__.BUCKET_SIZE) * _hash_constants__WEBPACK_IMPORTED_MODULE_0__.BUCKET_SIZE;
    buckets.push(b1); // usually there's only one bucket per coordinate
    const d = abs(v - b1);
    if (d >= _hash_constants__WEBPACK_IMPORTED_MODULE_0__.ALLOWED_SHIFT) { // too close to call - put into two buckets
        const b2 = v > b1
            ? b1 + _hash_constants__WEBPACK_IMPORTED_MODULE_0__.BUCKET_SIZE // we rounded down
            : b1 - _hash_constants__WEBPACK_IMPORTED_MODULE_0__.BUCKET_SIZE; // we rounded up
        buckets.push(b2);
    }
    return buckets;
}



/***/ }),

/***/ "./src/hash/get-coordinate-buckets2.ts":
/*!*********************************************!*\
  !*** ./src/hash/get-coordinate-buckets2.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCoordinateBuckets2: () => (/* binding */ getCoordinateBuckets2)
/* harmony export */ });
/* harmony import */ var _hash_constants2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hash-constants2 */ "./src/hash/hash-constants2.ts");

const { round, abs } = Math;
/**
 * Perform a location sensitive hash (called buckets)
 *
 * * points close to zero are automatically put into bucket 0
 *
 * @param v
 */
function getCoordinateBuckets2(v) {
    const buckets = [];
    const b1 = round(v / _hash_constants2__WEBPACK_IMPORTED_MODULE_0__.BUCKET_SIZE) * _hash_constants2__WEBPACK_IMPORTED_MODULE_0__.BUCKET_SIZE;
    buckets.push(b1); // usually there's only one bucket per coordinate
    const d = abs(v - b1);
    if (d >= _hash_constants2__WEBPACK_IMPORTED_MODULE_0__.ALLOWED_SHIFT) { // too close to call - put into two buckets
        const b2 = v > b1
            ? b1 + _hash_constants2__WEBPACK_IMPORTED_MODULE_0__.BUCKET_SIZE // we rounded down
            : b1 - _hash_constants2__WEBPACK_IMPORTED_MODULE_0__.BUCKET_SIZE; // we rounded up
        buckets.push(b2);
    }
    return buckets;
}



/***/ }),

/***/ "./src/hash/hash-constants.ts":
/*!************************************!*\
  !*** ./src/hash/hash-constants.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALLOWED_SHIFT: () => (/* binding */ ALLOWED_SHIFT),
/* harmony export */   BUCKET_SIZE: () => (/* binding */ BUCKET_SIZE),
/* harmony export */   MAX_ABS_ERROR: () => (/* binding */ MAX_ABS_ERROR),
/* harmony export */   MAX_COORD: () => (/* binding */ MAX_COORD),
/* harmony export */   N: () => (/* binding */ N),
/* harmony export */   NUM_BUCKETS: () => (/* binding */ NUM_BUCKETS)
/* harmony export */ });
const { log2 } = Math;
// Must be smaller than min distance between any two shape centroids
const BUCKET_SIZE = 2 ** -4;
/** number of buckets per unit */
const N = log2(1 / BUCKET_SIZE);
/**
 * 65536 max shapes per coordinate (roughly; for square shapes),
 * i.e. 2**32 max tiles total
 */
const MAX_COORD = 2 ** 16;
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



/***/ }),

/***/ "./src/hash/hash-constants2.ts":
/*!*************************************!*\
  !*** ./src/hash/hash-constants2.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALLOWED_SHIFT: () => (/* binding */ ALLOWED_SHIFT),
/* harmony export */   BUCKET_SIZE: () => (/* binding */ BUCKET_SIZE),
/* harmony export */   MAX_ABS_ERROR: () => (/* binding */ MAX_ABS_ERROR),
/* harmony export */   MAX_COORD: () => (/* binding */ MAX_COORD),
/* harmony export */   N: () => (/* binding */ N),
/* harmony export */   NUM_BUCKETS: () => (/* binding */ NUM_BUCKETS)
/* harmony export */ });
const { log2 } = Math;
// Must be smaller than min distance between any two shape centroids
const BUCKET_SIZE = 2 ** -2;
/** number of buckets per unit */
const N = log2(1 / BUCKET_SIZE);
/**
 * 65536 max shapes per coordinate (roughly; for square shapes),
 * i.e. 2**32 max tiles total
 */
const MAX_COORD = 2 ** 16;
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

/***/ "./src/shape/from-line-segment.ts":
/*!****************************************!*\
  !*** ./src/shape/from-line-segment.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromEdge: () => (/* binding */ fromEdge)
/* harmony export */ });
/* harmony import */ var _vector_get_angle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/get-angle */ "./src/vector/get-angle.ts");
/* harmony import */ var _vector_add_vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vector/add-vector */ "./src/vector/add-vector.ts");
/* harmony import */ var _vector_distance_between__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../vector/distance-between */ "./src/vector/distance-between.ts");
/* harmony import */ var _vector_subtract_vector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../vector/subtract-vector */ "./src/vector/subtract-vector.ts");




const { PI, cos, sin } = Math;
function fromEdge(sides, edge, stagePlacement) {
    const [v1, v2] = edge;
    const l = (0,_vector_distance_between__WEBPACK_IMPORTED_MODULE_2__.distanceBetween)(v1, v2);
    let θ = (0,_vector_get_angle__WEBPACK_IMPORTED_MODULE_0__.getAngle)((0,_vector_subtract_vector__WEBPACK_IMPORTED_MODULE_3__.subtractVector)(v2, v1)) + (2 * PI) / sides;
    const ps = [v1, v2];
    for (let i = ps.length; i < sides; i++) {
        ps.push((0,_vector_add_vector__WEBPACK_IMPORTED_MODULE_1__.addVector)([cos(θ) * l, sin(θ) * l], ps[i - 1]));
        θ += (2 * PI) / sides;
    }
    const ps_ = ps.slice(1).reverse();
    const ps__ = [ps[0], ...ps_];
    return { ps: ps__, stage: 0, stagePlacement };
}



/***/ }),

/***/ "./src/shape/from-radius.ts":
/*!**********************************!*\
  !*** ./src/shape/from-radius.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromRadius: () => (/* binding */ fromRadius)
/* harmony export */ });
const { cos, sin, PI } = Math;
function fromRadius(sides) {
    const ps = Array.from(Array(sides))
        .map((v, i) => [
        cos(-i * (2 * PI) / sides),
        sin(-i * (2 * PI) / sides),
    ]);
    return {
        ps,
        stage: 0,
        stagePlacement: 1
    };
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

/***/ "./src/shape/get-shape-hashes.ts":
/*!***************************************!*\
  !*** ./src/shape/get-shape-hashes.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getShapeHashes: () => (/* binding */ getShapeHashes)
/* harmony export */ });
/* harmony import */ var _get_centroid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-centroid */ "./src/shape/get-centroid.ts");
/* harmony import */ var _hash_get_buckets2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hash/get-buckets2 */ "./src/hash/get-buckets2.ts");


function getShapeHashes(s, maxRepeat) {
    return (0,_hash_get_buckets2__WEBPACK_IMPORTED_MODULE_1__.getBuckets2)((0,_get_centroid__WEBPACK_IMPORTED_MODULE_0__.getCentroid)(s.ps), maxRepeat);
}



/***/ }),

/***/ "./src/shape/shape.ts":
/*!****************************!*\
  !*** ./src/shape/shape.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getShapeEdges: () => (/* binding */ getShapeEdges),
/* harmony export */   rotateShapeAround: () => (/* binding */ rotateShapeAround),
/* harmony export */   translateShape: () => (/* binding */ translateShape)
/* harmony export */ });
/* harmony import */ var _vector_rotate_vector_around__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/rotate-vector-around */ "./src/vector/rotate-vector-around.ts");
/* harmony import */ var _vector_translate_vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vector/translate-vector */ "./src/vector/translate-vector.ts");


function getShapeEdges(s) {
    const { ps } = s;
    return ps.map((p, i) => ([
        p,
        ps[(i + 1) % ps.length]
    ]));
}
/**
 *
 * @param θ
 * @param v
 * @param shape
 * @returns
 */
function rotateShapeAround(θ, v, shape) {
    const ps = shape.ps.map(p => (0,_vector_rotate_vector_around__WEBPACK_IMPORTED_MODULE_0__.rotateVectorAround)(θ, v, p));
    return { ...shape, ps };
}
function translateShape(x, y) {
    return function _translateShape(s) {
        const ps = s.ps.map((0,_vector_translate_vector__WEBPACK_IMPORTED_MODULE_1__.translateVector)(x, y));
        return { ...s, ps };
    };
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
/* harmony import */ var _shape_get_shape_hashes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shape/get-shape-hashes */ "./src/shape/get-shape-hashes.ts");

const { sqrt, trunc } = Math;
/**
 *
 * @param shapeSet Set holding hashes of existing shapes
 * @param shapes new shapes to add
 */
function getNewShapes(shapeSet, shapes, maxRepeat) {
    const shapes_ = [];
    for (const s of shapes) {
        const hashes = (0,_shape_get_shape_hashes__WEBPACK_IMPORTED_MODULE_0__.getShapeHashes)(s, maxRepeat);
        let found = false;
        for (let j = 0; j < hashes.length; j++) {
            const h = hashes[j];
            const h0 = h[0];
            const h1 = h[1];
            const bitLength = 32 * shapeSet.length;
            const l = sqrt(bitLength); // exact
            const bitIdx = l * h0 + h1;
            const b1 = trunc(bitIdx / 32);
            const b2 = bitIdx % 32;
            if ((shapeSet[b1] & 2 ** b2) !== 0) {
                found = true;
            }
            shapeSet[b1] |= 2 ** b2;
        }
        if (!found) {
            shapes_.push(s);
        }
    }
    return shapes_;
}



/***/ }),

/***/ "./src/shapes/get-transform-points.ts":
/*!********************************************!*\
  !*** ./src/shapes/get-transform-points.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   comparePoints: () => (/* binding */ comparePoints),
/* harmony export */   getTransformPoints: () => (/* binding */ getTransformPoints)
/* harmony export */ });
/* harmony import */ var _vector_angle_equals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/angle-equals */ "./src/vector/angle-equals.ts");
/* harmony import */ var _shape_get_centroid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shape/get-centroid */ "./src/shape/get-centroid.ts");
/* harmony import */ var _shape_shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shape/shape */ "./src/shape/shape.ts");
/* harmony import */ var _hash_get_buckets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hash/get-buckets */ "./src/hash/get-buckets.ts");
/* harmony import */ var _hash_is_bucket_zero__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hash/is-bucket-zero */ "./src/hash/is-bucket-zero.ts");
/* harmony import */ var _vector_get_angle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../vector/get-angle */ "./src/vector/get-angle.ts");






const { hypot, PI } = Math;
function getTransformPoints(shapes) {
    const transformPoints1 = [];
    // Centroids (c)
    for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];
        const { ps } = s;
        const v = (0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_1__.getCentroid)(ps);
        transformPoints1.push({ v, pointType: 'c', index: 0 });
    }
    // Vertices (v) and Midpoints (h)
    const edges = shapes.map(_shape_shape__WEBPACK_IMPORTED_MODULE_2__.getShapeEdges).flat();
    for (const ls of edges) {
        const [v1, v2] = ls;
        transformPoints1.push({
            v: v1,
            pointType: 'v',
            index: 0
        }, {
            v: (0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_1__.getCentroid)(ls),
            vs: [v1, v2],
            pointType: 'h',
            index: 0
        });
    }
    const transformPoints2 = getUniqueVerticesNotZero(transformPoints1);
    let cc = 0;
    let vv = 0;
    let hh = 0;
    const transformPoints3 = transformPoints2
        .sort((a, b) => comparePoints(a.v, b.v))
        .map(tp => ({
        ...tp,
        index: (tp.pointType === 'c' && ++cc) ||
            (tp.pointType === 'v' && ++vv) ||
            (tp.pointType === 'h' && ++hh) || 0,
    }));
    const transformPointMap = new Map(transformPoints3
        .map(v => [v.pointType + v.index, v]));
    return transformPointMap;
}
function comparePoints(a, b) {
    const _θa = (0,_vector_get_angle__WEBPACK_IMPORTED_MODULE_5__.getAngleClockwiseFromYAxis)(a);
    const _θb = (0,_vector_get_angle__WEBPACK_IMPORTED_MODULE_5__.getAngleClockwiseFromYAxis)(b);
    const θa = _θa > 2 * PI - _vector_get_angle__WEBPACK_IMPORTED_MODULE_5__.ANGLE_PRECISION ? 0 : _θa;
    const θb = _θb > 2 * PI - _vector_get_angle__WEBPACK_IMPORTED_MODULE_5__.ANGLE_PRECISION ? 0 : _θb;
    if ((0,_vector_angle_equals__WEBPACK_IMPORTED_MODULE_0__.angleEquals)(θa, θb)) {
        return hypot(...a) - hypot(...b);
    }
    return θa - θb;
}
function getUniqueVerticesNotZero(vertices) {
    const vertexSet = new Set();
    const vertices_ = [];
    for (const vertex of vertices) {
        const hashes = (0,_hash_get_buckets__WEBPACK_IMPORTED_MODULE_3__.getBuckets)(vertex.v);
        if ((0,_hash_is_bucket_zero__WEBPACK_IMPORTED_MODULE_4__.isBucketZero)(hashes)) {
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

// function reflectShapes(
//         ls: number[][],
//         shapes: Shape[]): Shape[] {
//     return shapes.map(s => {
//         const ps = s.ps.map(reflectVector(ls));
//         return { ...s, ps };
//     });
// }
function reflectShapes(ls, shapes) {
    const shapes_ = [];
    for (let i = 0; i < shapes.length; i++) {
        const s = shapes[i];
        const _ps = s.ps;
        let ps = [];
        for (let j = 0; j < _ps.length; j++) {
            ps.push((0,_vector_reflect_vector__WEBPACK_IMPORTED_MODULE_0__.reflectVector)(ls, _ps[j]));
        }
        shapes_.push({
            stage: s.stage,
            stagePlacement: s.stagePlacement,
            ps
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
/* harmony export */   rotateShapes: () => (/* binding */ rotateShapes)
/* harmony export */ });
/* harmony import */ var _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/zero-vector */ "./src/vector/zero-vector.ts");
/* harmony import */ var _shape_shape__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shape/shape */ "./src/shape/shape.ts");


function rotateShapes(θ, v = _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__.zeroVector, shapes) {
    return shapes.map(shape => {
        const ps = (0,_shape_shape__WEBPACK_IMPORTED_MODULE_1__.rotateShapeAround)(θ, v, shape).ps;
        return { ...shape, ps };
    });
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
function toRadians(n) {
    return (n * (Math.PI / 180));
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
        const angle = Number.parseInt(angleStr);
        if (angle !== 30 && angle !== 45 && angle !== 60 &&
            angle !== 90 && angle !== 180) {
            throw new Error(`Angle must be 30,45,60,90 or 180 degrees, but found ${angleStr}`);
        }
        return {
            transformType,
            angle: pointIndex ? undefined : toRadians(angle),
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

/***/ "./src/to-shapes/apply-transform.ts":
/*!******************************************!*\
  !*** ./src/to-shapes/apply-transform.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyTransform: () => (/* binding */ applyTransform)
/* harmony export */ });
/* harmony import */ var _transform_using_origin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./transform-using-origin */ "./src/to-shapes/transform-using-origin.ts");
/* harmony import */ var _transform_using_transform_point__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transform-using-transform-point */ "./src/to-shapes/transform-using-transform-point.ts");


/**
 * * **modifies** `newShapesFill`, `newShapesGrow`, `shapeSet` and `shapes`
 *
 * @param shapeSet
 * @param shapes
 * @param transformPoints
 * @param transform
 * @param newShapesGrow
 */
function applyTransform(shapeSet, newShapesGrow, newShapesFill, shapes, transformPoints, transform, maxRepeat) {
    const { pointIndex } = transform;
    const addedShapes = !!pointIndex
        ? (0,_transform_using_transform_point__WEBPACK_IMPORTED_MODULE_1__.transformUsingTransformPoint)(shapeSet, newShapesFill, transform, maxRepeat, transformPoints)
        : (0,_transform_using_origin__WEBPACK_IMPORTED_MODULE_0__.transformUsingOrigin)(shapeSet, newShapesGrow, transform, maxRepeat);
    newShapesFill.push(...addedShapes);
    newShapesGrow.push(...addedShapes);
    shapes.push(...addedShapes);
}



/***/ }),

/***/ "./src/to-shapes/degs.ts":
/*!*******************************!*\
  !*** ./src/to-shapes/degs.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEG_180: () => (/* binding */ DEG_180),
/* harmony export */   DEG_360: () => (/* binding */ DEG_360),
/* harmony export */   DEG_90: () => (/* binding */ DEG_90)
/* harmony export */ });
const { PI } = Math;
const DEG_90 = PI / 2;
const DEG_180 = PI;
const DEG_360 = PI * 2;



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
/* harmony export */   getSeedShape: () => (/* binding */ getSeedShape)
/* harmony export */ });
/* harmony import */ var _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/zero-vector */ "./src/vector/zero-vector.ts");
/* harmony import */ var _shape_from_radius__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shape/from-radius */ "./src/shape/from-radius.ts");
/* harmony import */ var _shape_shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shape/shape */ "./src/shape/shape.ts");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./errors */ "./src/to-shapes/errors.ts");




const { PI, sqrt } = Math;
const shapes = {
    3: { ps: [[0, 1], [sqrt(3) / 2, 0.5], [0, 0]], stage: 0, stagePlacement: 1 },
    4: (0,_shape_shape__WEBPACK_IMPORTED_MODULE_2__.rotateShapeAround)(3 * PI / 4, _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__.zeroVector, (0,_shape_from_radius__WEBPACK_IMPORTED_MODULE_1__.fromRadius)(4)),
    6: (0,_shape_shape__WEBPACK_IMPORTED_MODULE_2__.rotateShapeAround)(3 * PI / 6, _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__.zeroVector, (0,_shape_from_radius__WEBPACK_IMPORTED_MODULE_1__.fromRadius)(6)),
    8: (0,_shape_shape__WEBPACK_IMPORTED_MODULE_2__.rotateShapeAround)(5 * PI / 8, _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__.zeroVector, (0,_shape_from_radius__WEBPACK_IMPORTED_MODULE_1__.fromRadius)(8)),
    12: (0,_shape_shape__WEBPACK_IMPORTED_MODULE_2__.rotateShapeAround)(7 * PI / 12, _vector_zero_vector__WEBPACK_IMPORTED_MODULE_0__.zeroVector, (0,_shape_from_radius__WEBPACK_IMPORTED_MODULE_1__.fromRadius)(12))
};
function getSeedShape(n) {
    const shape = shapes[n];
    if (shape === undefined) {
        throw (0,_errors__WEBPACK_IMPORTED_MODULE_3__.ErrorSeed)();
    }
    return shape;
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
/* harmony import */ var _shape_shape__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shape/shape */ "./src/shape/shape.ts");
/* harmony import */ var _get_seed_shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./get-seed-shape */ "./src/to-shapes/get-seed-shape.ts");
/* harmony import */ var _shape_from_line_segment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shape/from-line-segment */ "./src/shape/from-line-segment.ts");
/* harmony import */ var _hash_get_buckets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hash/get-buckets */ "./src/hash/get-buckets.ts");
/* harmony import */ var _shape_get_centroid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shape/get-centroid */ "./src/shape/get-centroid.ts");
/* harmony import */ var _shapes_get_transform_points__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shapes/get-transform-points */ "./src/shapes/get-transform-points.ts");







const { abs, max } = Math;
const TOL = 2 ** -10; // TODO2
// E.g. 12-4,6-3
// -------------
// 1. Place seed shape (12)
// 2. Shape groups === 4,6-3
// 3. Place 4 on first open polygon edge
// 4. Place 6 on next polygon edge (of same shape)
// 5. Place 3 on first open polygon edge of polygons in previous phase
function getSeedShapes(configuration) {
    const { seedShapeType, shapeGroups } = (0,_to_entities__WEBPACK_IMPORTED_MODULE_0__.toEntities)(configuration);
    const seedShape = (0,_get_seed_shape__WEBPACK_IMPORTED_MODULE_2__.getSeedShape)(seedShapeType);
    let shapes = [seedShape];
    let stagePlacement = 1;
    /** Map from line segment hash to number of line segments added */
    const connections = new Set();
    addConnections(connections, seedShape);
    let prevShapes = [seedShape];
    for (const shapeGroup of shapeGroups) {
        const shapesEdges = prevShapes
            .map(_shape_shape__WEBPACK_IMPORTED_MODULE_1__.getShapeEdges)
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
            const ca = (0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_5__.getCentroid)(a);
            const cb = (0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_5__.getCentroid)(b);
            return (0,_shapes_get_transform_points__WEBPACK_IMPORTED_MODULE_6__.comparePoints)(ca, cb);
        });
        prevShapes = [];
        let idx = 0;
        for (let i = 0; i < shapesEdges.length; i++) {
            const shapeType = shapeGroup[idx];
            const ls = shapesEdges[i];
            const n = getNumberOfConnections(connections, ls);
            if (n > 1) {
                console.log('a');
                continue;
            }
            if (shapeType === 0) {
                idx++;
                continue;
            }
            stagePlacement++;
            const shape = (0,_shape_from_line_segment__WEBPACK_IMPORTED_MODULE_3__.fromEdge)(shapeType, ls, stagePlacement);
            shapes.push(shape);
            prevShapes.push(shape);
            addConnections(connections, shape);
            idx++;
            if (idx >= shapeGroup.length) {
                break;
            }
        }
    }
    return { shapes, stagePlacement };
}
function getNumberOfConnections(connections, ls) {
    const edgeHashes = (0,_hash_get_buckets__WEBPACK_IMPORTED_MODULE_4__.getBuckets)((0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_5__.getCentroid)(ls));
    const hs = edgeHashes
        .map(h => connections.has(h) ? 1 : 0);
    if (hs.length === 0) {
        return 0;
    }
    return max(...hs);
}
function addConnections(connections, shape) {
    const edges = (0,_shape_shape__WEBPACK_IMPORTED_MODULE_1__.getShapeEdges)(shape);
    const edgeHashess = edges.map(ls => (0,_hash_get_buckets__WEBPACK_IMPORTED_MODULE_4__.getBuckets)((0,_shape_get_centroid__WEBPACK_IMPORTED_MODULE_5__.getCentroid)(ls)));
    for (const edgeHashes of edgeHashess) {
        for (const h of edgeHashes) {
            connections.add(h);
        }
    }
}



/***/ }),

/***/ "./src/to-shapes/scale-shapes.ts":
/*!***************************************!*\
  !*** ./src/to-shapes/scale-shapes.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scaleShapes: () => (/* binding */ scaleShapes)
/* harmony export */ });
/* harmony import */ var _vector_scale__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector/scale */ "./src/vector/scale.ts");

function scaleShapes(scaleFactor, shapes) {
    return shapes.map(shape => {
        return {
            ...shape,
            ps: shape.ps.map((0,_vector_scale__WEBPACK_IMPORTED_MODULE_0__.scaleVector)(scaleFactor))
        };
    });
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
/* harmony import */ var _apply_transform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./apply-transform */ "./src/to-shapes/apply-transform.ts");
/* harmony import */ var _shapes_get_transform_points__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shapes/get-transform-points */ "./src/shapes/get-transform-points.ts");
/* harmony import */ var _get_seed_shapes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./get-seed-shapes */ "./src/to-shapes/get-seed-shapes.ts");
/* harmony import */ var _scale_transform_points_map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scale-transform-points-map */ "./src/to-shapes/scale-transform-points-map.ts");
/* harmony import */ var _scale_shapes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scale-shapes */ "./src/to-shapes/scale-shapes.ts");
/* harmony import */ var _degs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./degs */ "./src/to-shapes/degs.ts");
/* harmony import */ var _hash_ceate_buckets__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../hash/ceate-buckets */ "./src/hash/ceate-buckets.ts");
/* harmony import */ var _shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../shapes/get-new-shapes */ "./src/shapes/get-new-shapes.ts");









function toShapes(props) {
    // cold run
    let t;
    for (let ii = 0; ii < 2; ii++) {
        t = toShapesT(props);
    }
    // // hot run
    const startTime = performance.now();
    for (let ii = 0; ii < 10; ii++) {
        t = toShapesT(props);
    }
    // const t = toShapesT(props);
    const endTime = performance.now();
    console.log(((endTime - startTime)).toFixed(0) + ' ms');
    return t;
}
function toShapesT(props) {
    const { configuration, maxRepeat, shapeSize } = props;
    const { transforms } = (0,_to_entities__WEBPACK_IMPORTED_MODULE_0__.toEntities)(configuration);
    let { shapes, stagePlacement } = (0,_get_seed_shapes__WEBPACK_IMPORTED_MODULE_3__.getSeedShapes)(configuration);
    const shapeSet = (0,_hash_ceate_buckets__WEBPACK_IMPORTED_MODULE_7__.createBuckets)(maxRepeat);
    (0,_shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_8__.getNewShapes)(shapeSet, shapes, maxRepeat);
    const transformPointsMaps = [];
    // ------------------------------
    // Repeating the Transformations
    // ------------------------------
    let stage = 0;
    let transformPoints = new Map();
    let newShapesGrow = [...shapes];
    let newShapesFill = [...shapes];
    let prevWasFill = true;
    let prevWasGrow = true;
    for (let i = 0; i < maxRepeat; i++) {
        for (let j = 0; j < transforms.length; j++) {
            let transform = transforms[j];
            if (i === 0) {
                transformPoints = (0,_shapes_get_transform_points__WEBPACK_IMPORTED_MODULE_2__.getTransformPoints)(shapes);
                transformPointsMaps.push(transformPoints);
            }
            else {
                transformPoints = transformPointsMaps[j];
            }
            const isGrow = !!transform.pointIndex || transform.angle === _degs__WEBPACK_IMPORTED_MODULE_6__.DEG_180;
            if (!prevWasFill && !isGrow) {
                newShapesFill.length = 0;
            }
            if (!prevWasGrow && isGrow) {
                newShapesGrow.length = 0;
            }
            prevWasFill = !isGrow;
            prevWasGrow = isGrow;
            (0,_apply_transform__WEBPACK_IMPORTED_MODULE_1__.applyTransform)(shapeSet, newShapesGrow, newShapesFill, shapes, transformPoints, transform, maxRepeat);
            stage++;
            for (let i = 0; i < shapes.length; i++) {
                shapes[i].stage = stage;
            }
        }
    }
    ///////////////////
    // console.log(shapes.length)
    ///////////////////
    return {
        shapes: (0,_scale_shapes__WEBPACK_IMPORTED_MODULE_5__.scaleShapes)(shapeSize / 2, shapes),
        stage, stagePlacement,
        transformPointsMaps: (0,_scale_transform_points_map__WEBPACK_IMPORTED_MODULE_4__.scaleTransformPointsMaps)(shapeSize / 2, transformPointsMaps)
    };
}



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
/* harmony import */ var _degs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./degs */ "./src/to-shapes/degs.ts");
/* harmony import */ var _shapes_rotate_shapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shapes/rotate-shapes */ "./src/shapes/rotate-shapes.ts");
/* harmony import */ var _vector_zero_vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../vector/zero-vector */ "./src/vector/zero-vector.ts");
/* harmony import */ var _vector_get_angle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../vector/get-angle */ "./src/vector/get-angle.ts");
/* harmony import */ var _shapes_reflect_shapes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shapes/reflect-shapes */ "./src/shapes/reflect-shapes.ts");
/* harmony import */ var _shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shapes/get-new-shapes */ "./src/shapes/get-new-shapes.ts");






const { cos, sin } = Math;
function transformUsingOrigin(shapeSet, newShapesGrow, transform, maxRepeat) {
    const { angle, transformType } = transform;
    let relevantShapes = newShapesGrow.slice();
    let addedShapes = [];
    for (let θ = angle; θ < _degs__WEBPACK_IMPORTED_MODULE_0__.DEG_360 - _vector_get_angle__WEBPACK_IMPORTED_MODULE_3__.ANGLE_PRECISION; θ *= 2) {
        const θ2 = θ - _degs__WEBPACK_IMPORTED_MODULE_0__.DEG_90;
        const shapesToAdd = transformType === 'm'
            ? (0,_shapes_reflect_shapes__WEBPACK_IMPORTED_MODULE_4__.reflectShapes)([_vector_zero_vector__WEBPACK_IMPORTED_MODULE_2__.zeroVector, [cos(θ2), sin(θ2)]], relevantShapes)
            : (0,_shapes_rotate_shapes__WEBPACK_IMPORTED_MODULE_1__.rotateShapes)(θ, _vector_zero_vector__WEBPACK_IMPORTED_MODULE_2__.zeroVector, relevantShapes);
        const newShapes = (0,_shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_5__.getNewShapes)(shapeSet, shapesToAdd, maxRepeat);
        addedShapes.push(...newShapes);
        relevantShapes.push(...newShapes);
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
/* harmony import */ var _degs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./degs */ "./src/to-shapes/degs.ts");
/* harmony import */ var _shapes_rotate_shapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shapes/rotate-shapes */ "./src/shapes/rotate-shapes.ts");
/* harmony import */ var _vector_add_vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../vector/add-vector */ "./src/vector/add-vector.ts");
/* harmony import */ var _vector_subtract_vector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../vector/subtract-vector */ "./src/vector/subtract-vector.ts");
/* harmony import */ var _shapes_reflect_shapes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shapes/reflect-shapes */ "./src/shapes/reflect-shapes.ts");
/* harmony import */ var _vector_get_angle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../vector/get-angle */ "./src/vector/get-angle.ts");
/* harmony import */ var _shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shapes/get-new-shapes */ "./src/shapes/get-new-shapes.ts");







const { PI, cos, sin } = Math;
function transformUsingTransformPoint(shapeSet, newShapesFill, transform, maxRepeat, transformPoints) {
    const { pointIndex, transformType } = transform;
    const transformPoint = transformPoints.get(pointIndex);
    const { v } = transformPoint;
    // https://www.mdpi.com/2073-8994/13/12/2376
    // "When specifying the vertex of a polygon’s centroid (Figure 11) or
    // vertex (Figure 12), the angle that is used for the transformation is
    // inferred from the angle of that vertex relative to the center of the
    // coordinate system. However, when using the midpoint of a line segment
    // (the polygon’s edge, as shown in Figure 10, right), the angle for the
    // transform is inferred from the angle of that edge..."
    const shapesToAdd = transformType === 'r'
        ? (0,_shapes_rotate_shapes__WEBPACK_IMPORTED_MODULE_1__.rotateShapes)(_degs__WEBPACK_IMPORTED_MODULE_0__.DEG_180, v, newShapesFill)
        : (0,_shapes_reflect_shapes__WEBPACK_IMPORTED_MODULE_4__.reflectShapes)(getMirrorVectors(transformPoint), newShapesFill);
    return (0,_shapes_get_new_shapes__WEBPACK_IMPORTED_MODULE_6__.getNewShapes)(shapeSet, shapesToAdd, maxRepeat);
}
function getMirrorVectors(transformPoint) {
    const { pointType, v, vs } = transformPoint;
    const θ = pointType === 'h'
        ? (0,_vector_get_angle__WEBPACK_IMPORTED_MODULE_5__.getAngle)((0,_vector_subtract_vector__WEBPACK_IMPORTED_MODULE_3__.subtractVector)(vs[1], vs[0]))
        : (0,_vector_get_angle__WEBPACK_IMPORTED_MODULE_5__.getAngle)(v) - PI / 2;
    const θ2 = θ - _degs__WEBPACK_IMPORTED_MODULE_0__.DEG_180;
    const v1 = (0,_vector_add_vector__WEBPACK_IMPORTED_MODULE_2__.addVector)(v, [cos(θ2), sin(θ2)]);
    const v2 = (0,_vector_add_vector__WEBPACK_IMPORTED_MODULE_2__.addVector)(v, [cos(θ), sin(θ)]);
    return [v1, v2];
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
const { PI, abs, hypot, sin, cos } = Math;
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

/***/ "./src/vector/get-angle.ts":
/*!*********************************!*\
  !*** ./src/vector/get-angle.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANGLE_PRECISION: () => (/* binding */ ANGLE_PRECISION),
/* harmony export */   getAngle: () => (/* binding */ getAngle),
/* harmony export */   getAngleAntiClockwiseFromYAxis: () => (/* binding */ getAngleAntiClockwiseFromYAxis),
/* harmony export */   getAngleClockwiseFromYAxis: () => (/* binding */ getAngleClockwiseFromYAxis)
/* harmony export */ });
const { PI, atan2 } = Math;
const ANGLE_PRECISION = 2 ** -10;
function getAngleClockwiseFromYAxis(v) {
    const [x, y] = v;
    const θ = (2 * PI) - (atan2(y, x) - PI / 2 + 2 * PI) % (2 * PI);
    return θ;
}
function getAngleAntiClockwiseFromYAxis(v) {
    const [x, y] = v;
    const θ = (atan2(y, x) - PI / 2 + 2 * PI) % (2 * PI);
    return θ;
}
function getAngle(v) {
    const [x, y] = v;
    const θ = (atan2(y, x) + 2 * PI) % (2 * PI);
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
function reflectVector(edge, v) {
    const e0 = edge[0];
    const e1 = edge[1];
    const x1 = e0[0];
    const y1 = e0[1];
    const x2 = e1[0];
    const y2 = e1[1];
    const x = v[0];
    const y = v[1];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const a = (dx * dx - dy * dy) / (dx * dx + dy * dy);
    const b = 2 * dx * dy / (dx * dx + dy * dy);
    return [
        a * (x - x1) + b * (y - y1) + x1,
        b * (x - x1) - a * (y - y1) + y1
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

const { PI, SQRT1_2, sin, cos } = Math;
/**
 * Returns the result of rotating a vector around a specified point.
 *
 * @param θ angle
 * @param c center of rotation
 */
const SQRT3_2 = Math.sqrt(3) / 2;
const accurateCosSin = {
    [PI]: [-1, 0],
    [-PI]: [-1, 0],
    [PI / 2]: [0, 1],
    [-PI / 2]: [0, -1],
    [PI / 3]: [0.5, SQRT3_2],
    [-PI / 3]: [0.5, -SQRT3_2],
    [PI / 4]: [SQRT1_2, SQRT1_2],
    [-PI / 4]: [SQRT1_2, -SQRT1_2],
    [PI / 6]: [SQRT3_2, 0.5],
    [-PI / 6]: [SQRT3_2, -0.5],
    [2 * (PI / 3)]: [-0.5, SQRT3_2],
    [-2 * (PI / 3)]: [-0.5, -SQRT3_2],
    [5 * (PI / 4)]: [-SQRT1_2, SQRT3_2],
    [-5 * (PI / 4)]: [-SQRT1_2, -SQRT1_2],
};
function rotateVectorAround(θ, c = _zero_vector__WEBPACK_IMPORTED_MODULE_0__.zeroVector, v) {
    const x = v[0];
    const y = v[1];
    if (θ / (2 * PI) % 1 === 0) {
        return v;
    }
    const [cosθ, sinθ] = accurateCosSin[θ] || [cos(θ), sin(θ)];
    const [cx, cy] = c;
    const vx = x - cx;
    const vy = y - cy;
    return [
        cosθ * vx - sinθ * vy + cx,
        cosθ * vy + sinθ * vx + cy
    ];
}

// rotation matrix: [[cos, -sin], [sin,cos]]
// const a = -3*PI/4;
// cos(a);//?
// sin(a);//?


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

/***/ "./src/vector/translate-vector.ts":
/*!****************************************!*\
  !*** ./src/vector/translate-vector.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   translateVector: () => (/* binding */ translateVector)
/* harmony export */ });
function translateVector(x, y) {
    return function _translateVector(v) {
        return [
            v[0] + x,
            v[1] + y
        ];
    };
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
/* harmony export */   toShapes: () => (/* reexport safe */ _to_shapes_to_shapes__WEBPACK_IMPORTED_MODULE_0__.toShapes)
/* harmony export */ });
/* harmony import */ var _to_shapes_to_shapes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./to-shapes/to-shapes */ "./src/to-shapes/to-shapes.ts");



})();


//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakIsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFZixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ25CLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUMsRUFBRSxHQUFHLEVBQUUsR0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsR0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBQyxFQUFFLEdBQUMsRUFBRSxHQUFDLENBQUMsRUFBRSxHQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUMsRUFBRSxDQUFDLENBQUM7SUFFbEMsT0FBTztRQUNILENBQUMsR0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRTtRQUM1QixDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUU7S0FDL0IsQ0FBQztBQUNOLENBQUM7QUFHdUI7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQm1CO0FBRTNDLE1BQU0sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFB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REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ0xpRDtBQWlCaEQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaGFzaC9jZWF0ZS1idWNrZXRzLnRzIiwid2VicGFjazovLy8uL3NyYy9oYXNoL2dldC1idWNrZXRzLnRzIiwid2VicGFjazovLy8uL3NyYy9oYXNoL2dldC1idWNrZXRzMi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaGFzaC9nZXQtY29vcmRpbmF0ZS1idWNrZXRzLnRzIiwid2VicGFjazovLy8uL3NyYy9oYXNoL2dldC1jb29yZGluYXRlLWJ1Y2tldHMyLnRzIiwid2VicGFjazovLy8uL3NyYy9oYXNoL2hhc2gtY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9oYXNoL2hhc2gtY29uc3RhbnRzMi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaGFzaC9pcy1idWNrZXQtemVyby50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcGUvZnJvbS1saW5lLXNlZ21lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXBlL2Zyb20tcmFkaXVzLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFwZS9nZXQtY2VudHJvaWQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXBlL2dldC1zaGFwZS1oYXNoZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXBlL3NoYXBlLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFwZXMvZ2V0LW5ldy1zaGFwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXBlcy9nZXQtdHJhbnNmb3JtLXBvaW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcGVzL3JlZmxlY3Qtc2hhcGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFwZXMvcm90YXRlLXNoYXBlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdG8tZW50aXRpZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RvLXNoYXBlcy9hcHBseS10cmFuc2Zvcm0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RvLXNoYXBlcy9kZWdzLnRzIiwid2VicGFjazovLy8uL3NyYy90by1zaGFwZXMvZXJyb3JzLnRzIiwid2VicGFjazovLy8uL3NyYy90by1zaGFwZXMvZ2V0LXNlZWQtc2hhcGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RvLXNoYXBlcy9nZXQtc2VlZC1zaGFwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RvLXNoYXBlcy9zY2FsZS1zaGFwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RvLXNoYXBlcy9zY2FsZS10cmFuc2Zvcm0tcG9pbnRzLW1hcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdG8tc2hhcGVzL3RvLXNoYXBlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdG8tc2hhcGVzL3RyYW5zZm9ybS11c2luZy1vcmlnaW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RvLXNoYXBlcy90cmFuc2Zvcm0tdXNpbmctdHJhbnNmb3JtLXBvaW50LnRzIiwid2VicGFjazovLy8uL3NyYy92ZWN0b3IvYWRkLXZlY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yL2FuZ2xlLWVxdWFscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yL2Rpc3RhbmNlLWJldHdlZW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci9nZXQtYW5nbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci9yZWZsZWN0LXZlY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdmVjdG9yL3JvdGF0ZS12ZWN0b3ItYXJvdW5kLnRzIiwid2VicGFjazovLy8uL3NyYy92ZWN0b3Ivc2NhbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci9zdWJ0cmFjdC12ZWN0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci90cmFuc2xhdGUtdmVjdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy92ZWN0b3IvemVyby12ZWN0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5jb25zdCB7IGNlaWwsIGxvZzIgfSA9IE1hdGg7XHJcblxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQnVja2V0cyhcclxuICAgICAgICBtYXhSZXBlYXQ6IG51bWJlcikge1xyXG5cclxuICAgIC8vIFRPRE8yIC0gYmFzZSB0aGlzIGFuZCB0aGUgMTYgb24gYHNlZWRTaGFwZXNgXHJcbiAgICAvLyBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzJcclxuICAgIGNvbnN0IENDID0gMzI7XHJcbiAgICBjb25zdCBsZW4gPSAyKkNDKm1heFJlcGVhdDtcclxuICAgIGNvbnN0IG5leHRQb3dlck9mMiA9ICgyKipjZWlsKGxvZzIobGVuKSkpO1xyXG4gICAgY29uc3QgYXJyTGVuID0gKG5leHRQb3dlck9mMioqMikvMzI7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBVaW50MzJBcnJheShhcnJMZW4pO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgY3JlYXRlQnVja2V0cyB9XHJcbiIsImltcG9ydCB7IGdldENvb3JkaW5hdGVCdWNrZXRzIH0gZnJvbSBcIi4vZ2V0LWNvb3JkaW5hdGUtYnVja2V0c1wiO1xyXG5pbXBvcnQgeyBOVU1fQlVDS0VUUyB9IGZyb20gXCIuL2hhc2gtY29uc3RhbnRzXCI7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0QnVja2V0cyhwOiBudW1iZXJbXSkge1xyXG4gICAgY29uc3QgW3gseV0gPSBwO1xyXG5cclxuICAgIC8vIFdlIHBhY2sgdGhlIGJ1Y2tldHMgaW50byBvbmUgZmxvYXQgYnkgc2hpZnRpbmcgYnkgYXJvdW5kIDIyIGJpdHNcclxuICAgIC8vIE5vdGUgdGhpcyBhbGxvd3MgYnVja2V0IHBvaW50cyB0byBiZSBjb21wYXJlZCBlYXNpbHlcclxuICAgIC8vIHVzaW5nIHRoZSB1c3VhbCA9PT0sPiw+PSBldGMuIG9wZXJhdG9yc1xyXG4gICAgY29uc3QgeEJ1Y2tldHMgPSBnZXRDb29yZGluYXRlQnVja2V0cyh4KS5tYXAoYiA9PiBiKk5VTV9CVUNLRVRTKjIqKjIpO1xyXG4gICAgY29uc3QgeUJ1Y2tldHMgPSBnZXRDb29yZGluYXRlQnVja2V0cyh5KTtcclxuXHJcbiAgICAvLyBQYWNrIGJ1Y2tldHNcclxuICAgIGNvbnN0IGJ1Y2tldHM6IG51bWJlcltdID0gW107XHJcbiAgICBmb3IgKGxldCBpPTA7IGk8eEJ1Y2tldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqPTA7IGo8eUJ1Y2tldHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgYnVja2V0cy5wdXNoKHhCdWNrZXRzW2ldICsgeUJ1Y2tldHNbal0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnVja2V0cztcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGdldEJ1Y2tldHMgfVxyXG4iLCJpbXBvcnQgeyBnZXRDb29yZGluYXRlQnVja2V0czIgfSBmcm9tIFwiLi9nZXQtY29vcmRpbmF0ZS1idWNrZXRzMlwiO1xyXG5pbXBvcnQgeyBOIH0gZnJvbSBcIi4vaGFzaC1jb25zdGFudHMyXCI7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0QnVja2V0czIoXHJcbiAgICAgICAgcDogbnVtYmVyW10sXHJcbiAgICAgICAgbWF4UmVwZWF0OiBudW1iZXIpOiBudW1iZXJbXVtdIHtcclxuXHJcbiAgICBjb25zdCBbeCx5XSA9IHA7XHJcbiAgICBjb25zdCBDQyA9IDMyO1xyXG5cclxuICAgIC8vIFdlIHBhY2sgdGhlIGJ1Y2tldHMgaW50byBvbmUgZmxvYXQgYnkgc2hpZnRpbmcgYnkgYXJvdW5kIDIyIGJpdHNcclxuICAgIC8vIE5vdGUgdGhpcyBhbGxvd3MgYnVja2V0IHBvaW50cyB0byBiZSBjb21wYXJlZCBlYXNpbHlcclxuICAgIC8vIHVzaW5nIHRoZSB1c3VhbCA9PT0sPiw+PSBldGMuIG9wZXJhdG9yc1xyXG4gICAgY29uc3QgeEJ1Y2tldHMgPSBnZXRDb29yZGluYXRlQnVja2V0czIoeCk7XHJcbiAgICBjb25zdCB5QnVja2V0cyA9IGdldENvb3JkaW5hdGVCdWNrZXRzMih5KTtcclxuICAgIGNvbnN0IE5OID0gMioqTjtcclxuXHJcbiAgICAvLyBQYWNrIGJ1Y2tldHNcclxuICAgIGNvbnN0IGJ1Y2tldHM6IG51bWJlcltdW10gPSBbXTtcclxuICAgIGZvciAobGV0IGk9MDsgaTx4QnVja2V0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGo9MDsgajx5QnVja2V0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBidWNrZXRzLnB1c2goW1xyXG4gICAgICAgICAgICAgICAgeEJ1Y2tldHNbaV0qTk4gKyBDQyptYXhSZXBlYXQsXHJcbiAgICAgICAgICAgICAgICB5QnVja2V0c1tqXSpOTiArIENDKm1heFJlcGVhdFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1Y2tldHM7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBnZXRCdWNrZXRzMiB9XHJcbiIsImltcG9ydCB7IEFMTE9XRURfU0hJRlQsIEJVQ0tFVF9TSVpFIH0gZnJvbSBcIi4vaGFzaC1jb25zdGFudHNcIjtcclxuXHJcbmNvbnN0IHsgcm91bmQsIGFicyB9ID0gTWF0aDtcclxuXHJcblxyXG4vKipcclxuICogUGVyZm9ybSBhIGxvY2F0aW9uIHNlbnNpdGl2ZSBoYXNoIChjYWxsZWQgYnVja2V0cylcclxuICogXHJcbiAqICogcG9pbnRzIGNsb3NlIHRvIHplcm8gYXJlIGF1dG9tYXRpY2FsbHkgcHV0IGludG8gYnVja2V0IDBcclxuICpcclxuICogQHBhcmFtIHYgXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRDb29yZGluYXRlQnVja2V0cyh2OiBudW1iZXIpOiBudW1iZXJbXSB7XHJcbiAgICBjb25zdCBidWNrZXRzOiBudW1iZXJbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0IGIxID0gcm91bmQodi9CVUNLRVRfU0laRSkqQlVDS0VUX1NJWkU7XHJcbiAgICBidWNrZXRzLnB1c2goYjEpOyAgLy8gdXN1YWxseSB0aGVyZSdzIG9ubHkgb25lIGJ1Y2tldCBwZXIgY29vcmRpbmF0ZVxyXG5cclxuICAgIGNvbnN0IGQgPSBhYnModiAtIGIxKTsgXHJcblxyXG4gICAgaWYgKGQgPj0gQUxMT1dFRF9TSElGVCkgeyAgLy8gdG9vIGNsb3NlIHRvIGNhbGwgLSBwdXQgaW50byB0d28gYnVja2V0c1xyXG4gICAgICAgIGNvbnN0IGIyID0gdiA+IGIxXHJcbiAgICAgICAgICAgID8gYjEgKyBCVUNLRVRfU0laRSAgIC8vIHdlIHJvdW5kZWQgZG93blxyXG4gICAgICAgICAgICA6IGIxIC0gQlVDS0VUX1NJWkU7ICAvLyB3ZSByb3VuZGVkIHVwXHJcblxyXG4gICAgICAgIGJ1Y2tldHMucHVzaChiMik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1Y2tldHM7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBnZXRDb29yZGluYXRlQnVja2V0cyB9XHJcbiIsImltcG9ydCB7IEFMTE9XRURfU0hJRlQsIEJVQ0tFVF9TSVpFIH0gZnJvbSBcIi4vaGFzaC1jb25zdGFudHMyXCI7XHJcblxyXG5jb25zdCB7IHJvdW5kLCBhYnMgfSA9IE1hdGg7XHJcblxyXG5cclxuLyoqXHJcbiAqIFBlcmZvcm0gYSBsb2NhdGlvbiBzZW5zaXRpdmUgaGFzaCAoY2FsbGVkIGJ1Y2tldHMpXHJcbiAqIFxyXG4gKiAqIHBvaW50cyBjbG9zZSB0byB6ZXJvIGFyZSBhdXRvbWF0aWNhbGx5IHB1dCBpbnRvIGJ1Y2tldCAwXHJcbiAqXHJcbiAqIEBwYXJhbSB2IFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZUJ1Y2tldHMyKHY6IG51bWJlcik6IG51bWJlcltdIHtcclxuICAgIGNvbnN0IGJ1Y2tldHM6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgY29uc3QgYjEgPSByb3VuZCh2L0JVQ0tFVF9TSVpFKSpCVUNLRVRfU0laRTtcclxuICAgIGJ1Y2tldHMucHVzaChiMSk7ICAvLyB1c3VhbGx5IHRoZXJlJ3Mgb25seSBvbmUgYnVja2V0IHBlciBjb29yZGluYXRlXHJcblxyXG4gICAgY29uc3QgZCA9IGFicyh2IC0gYjEpOyBcclxuXHJcbiAgICBpZiAoZCA+PSBBTExPV0VEX1NISUZUKSB7ICAvLyB0b28gY2xvc2UgdG8gY2FsbCAtIHB1dCBpbnRvIHR3byBidWNrZXRzXHJcbiAgICAgICAgY29uc3QgYjIgPSB2ID4gYjFcclxuICAgICAgICAgICAgPyBiMSArIEJVQ0tFVF9TSVpFICAgLy8gd2Ugcm91bmRlZCBkb3duXHJcbiAgICAgICAgICAgIDogYjEgLSBCVUNLRVRfU0laRTsgIC8vIHdlIHJvdW5kZWQgdXBcclxuXHJcbiAgICAgICAgYnVja2V0cy5wdXNoKGIyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnVja2V0cztcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGdldENvb3JkaW5hdGVCdWNrZXRzMiB9XHJcbiIsIlxyXG5jb25zdCB7IGxvZzIgfSA9IE1hdGg7XHJcblxyXG5cclxuLy8gTXVzdCBiZSBzbWFsbGVyIHRoYW4gbWluIGRpc3RhbmNlIGJldHdlZW4gYW55IHR3byBzaGFwZSBjZW50cm9pZHNcclxuY29uc3QgQlVDS0VUX1NJWkUgPSAyKiotNDtcclxuXHJcbi8qKiBudW1iZXIgb2YgYnVja2V0cyBwZXIgdW5pdCAqL1xyXG5jb25zdCBOID0gbG9nMigxL0JVQ0tFVF9TSVpFKTtcclxuXHJcbi8qKlxyXG4gKiA2NTUzNiBtYXggc2hhcGVzIHBlciBjb29yZGluYXRlIChyb3VnaGx5OyBmb3Igc3F1YXJlIHNoYXBlcyksXHJcbiAqIGkuZS4gMioqMzIgbWF4IHRpbGVzIHRvdGFsXHJcbiAqL1xyXG5jb25zdCBNQVhfQ09PUkQgPSAyKioxNjtcclxuXHJcbi8qKiBUaGUgbnVtYmVyIG9mIGJ1Y2tldHMgcGVyIGNvb3JkaW5hdGUgKi9cclxuY29uc3QgTlVNX0JVQ0tFVFMgPSBNQVhfQ09PUkQqKDIqKk4pO1xyXG5cclxuLyoqXHJcbiAqIEd1ZXNzZWQgbWF4aW11bSBmbG9hdGluZyBwb2ludCBlcnJvciBhZnRlciBhbGwgdHJhbnNmb3JtYXRpb25zLlxyXG4gKiAqIEEgaGlnaCB2YWx1ZSB3YXMgY2hvc2VuIHRvIGJlIHN1cmUgYnV0IGl0IGlzIHBvc3NpYmxlIHRvIGNhbGN1bGF0ZSBpdFxyXG4gKiBleGFjdGx5IHRob3VnaCB0aGUgY2FsY3VsYXRpb24gd291bGQgYmUgdmVyeSB0ZWRpb3VzLlxyXG4gKi9cclxuY29uc3QgTUFYX0FCU19FUlJPUiA9IDIqKi0xMDtcclxuXHJcbi8qKiBNYXggc2hpZnQgYWxsb3dlZCBiZWZvcmUgdGhyb3dpbmcgcG9pbnQgaW50byB0d28gYnVja2V0cyAqL1xyXG5jb25zdCBBTExPV0VEX1NISUZUID0gQlVDS0VUX1NJWkUvMiAtIE1BWF9BQlNfRVJST1I7IFxyXG5cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBCVUNLRVRfU0laRSxcclxuICAgIE4sXHJcbiAgICBNQVhfQ09PUkQsXHJcbiAgICBOVU1fQlVDS0VUUyxcclxuICAgIE1BWF9BQlNfRVJST1IsXHJcbiAgICBBTExPV0VEX1NISUZUXHJcbn1cclxuIiwiXHJcbmNvbnN0IHsgbG9nMiB9ID0gTWF0aDtcclxuXHJcblxyXG4vLyBNdXN0IGJlIHNtYWxsZXIgdGhhbiBtaW4gZGlzdGFuY2UgYmV0d2VlbiBhbnkgdHdvIHNoYXBlIGNlbnRyb2lkc1xyXG5jb25zdCBCVUNLRVRfU0laRSA9IDIqKi0yO1xyXG5cclxuLyoqIG51bWJlciBvZiBidWNrZXRzIHBlciB1bml0ICovXHJcbmNvbnN0IE4gPSBsb2cyKDEvQlVDS0VUX1NJWkUpO1xyXG5cclxuLyoqXHJcbiAqIDY1NTM2IG1heCBzaGFwZXMgcGVyIGNvb3JkaW5hdGUgKHJvdWdobHk7IGZvciBzcXVhcmUgc2hhcGVzKSxcclxuICogaS5lLiAyKiozMiBtYXggdGlsZXMgdG90YWxcclxuICovXHJcbmNvbnN0IE1BWF9DT09SRCA9IDIqKjE2O1xyXG5cclxuLyoqIFRoZSBudW1iZXIgb2YgYnVja2V0cyBwZXIgY29vcmRpbmF0ZSAqL1xyXG5jb25zdCBOVU1fQlVDS0VUUyA9IE1BWF9DT09SRCooMioqTik7XHJcblxyXG4vKipcclxuICogR3Vlc3NlZCBtYXhpbXVtIGZsb2F0aW5nIHBvaW50IGVycm9yIGFmdGVyIGFsbCB0cmFuc2Zvcm1hdGlvbnMuXHJcbiAqICogQSBoaWdoIHZhbHVlIHdhcyBjaG9zZW4gdG8gYmUgc3VyZSBidXQgaXQgaXMgcG9zc2libGUgdG8gY2FsY3VsYXRlIGl0XHJcbiAqIGV4YWN0bHkgdGhvdWdoIHRoZSBjYWxjdWxhdGlvbiB3b3VsZCBiZSB2ZXJ5IHRlZGlvdXMuXHJcbiAqL1xyXG5jb25zdCBNQVhfQUJTX0VSUk9SID0gMioqLTEwO1xyXG5cclxuLyoqIE1heCBzaGlmdCBhbGxvd2VkIGJlZm9yZSB0aHJvd2luZyBwb2ludCBpbnRvIHR3byBidWNrZXRzICovXHJcbmNvbnN0IEFMTE9XRURfU0hJRlQgPSBCVUNLRVRfU0laRS8yIC0gTUFYX0FCU19FUlJPUjsgXHJcblxyXG5cclxuZXhwb3J0IHtcclxuICAgIEJVQ0tFVF9TSVpFLFxyXG4gICAgTixcclxuICAgIE1BWF9DT09SRCxcclxuICAgIE5VTV9CVUNLRVRTLFxyXG4gICAgTUFYX0FCU19FUlJPUixcclxuICAgIEFMTE9XRURfU0hJRlRcclxufVxyXG4iLCJcclxuZnVuY3Rpb24gaXNCdWNrZXRaZXJvKGhhc2hlczogbnVtYmVyW10pIHtcclxuICAgIHJldHVybiBoYXNoZXMubGVuZ3RoID09PSAxICYmIGhhc2hlc1swXSA9PT0gMDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGlzQnVja2V0WmVybyB9XHJcbiIsImltcG9ydCB7IGdldEFuZ2xlIH0gZnJvbSBcIi4uL3ZlY3Rvci9nZXQtYW5nbGVcIjtcclxuaW1wb3J0IHsgYWRkVmVjdG9yIH0gZnJvbSBcIi4uL3ZlY3Rvci9hZGQtdmVjdG9yXCI7XHJcbmltcG9ydCB7IGRpc3RhbmNlQmV0d2VlbiB9IGZyb20gXCIuLi92ZWN0b3IvZGlzdGFuY2UtYmV0d2VlblwiO1xyXG5pbXBvcnQgeyBzdWJ0cmFjdFZlY3RvciAgfSBmcm9tIFwiLi4vdmVjdG9yL3N1YnRyYWN0LXZlY3RvclwiO1xyXG5pbXBvcnQgeyBTaGFwZSB9IGZyb20gXCIuL3NoYXBlXCI7XHJcblxyXG5jb25zdCB7IFBJLCBjb3MsIHNpbiB9ID0gTWF0aDtcclxuXHJcblxyXG5mdW5jdGlvbiBmcm9tRWRnZShcclxuICAgICAgICBzaWRlczogbnVtYmVyLFxyXG4gICAgICAgIGVkZ2U6IG51bWJlcltdW10sXHJcbiAgICAgICAgc3RhZ2VQbGFjZW1lbnQ6IG51bWJlcik6IFNoYXBlIHtcclxuXHJcbiAgICBjb25zdCBbdjEsdjJdID0gZWRnZTtcclxuXHJcbiAgICBjb25zdCBsID0gZGlzdGFuY2VCZXR3ZWVuKHYxLHYyKTtcclxuICAgIGxldCDOuCA9IGdldEFuZ2xlKHN1YnRyYWN0VmVjdG9yKHYyLHYxKSkgKyAoMipQSSkvc2lkZXM7XHJcblxyXG4gICAgY29uc3QgcHMgPSBbdjEsdjJdO1xyXG5cclxuICAgIGZvciAobGV0IGk9cHMubGVuZ3RoOyBpPHNpZGVzOyBpKyspIHtcclxuICAgICAgICBwcy5wdXNoKFxyXG4gICAgICAgICAgICBhZGRWZWN0b3IoW2NvcyjOuCkqbCwgc2luKM64KSpsXSxcclxuICAgICAgICAgICAgcHNbaSAtIDFdXHJcbiAgICAgICAgKSk7XHJcblxyXG4gICAgICAgIM64ICs9ICgyKlBJKS9zaWRlcztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwc18gPSBwcy5zbGljZSgxKS5yZXZlcnNlKCk7XHJcbiAgICBjb25zdCBwc19fID0gW3BzWzBdLCAuLi5wc19dO1xyXG5cclxuICAgIHJldHVybiB7IHBzOiBwc19fLCBzdGFnZTogMCwgc3RhZ2VQbGFjZW1lbnQgfTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGZyb21FZGdlIH1cclxuIiwiaW1wb3J0IHsgU2hhcGUgfSBmcm9tIFwiLi9zaGFwZVwiO1xyXG5cclxuY29uc3QgeyBjb3MsIHNpbiwgUEkgfSA9IE1hdGg7XHJcblxyXG5cclxuZnVuY3Rpb24gZnJvbVJhZGl1cyhcclxuICAgICAgICBzaWRlczogbnVtYmVyKTogU2hhcGUge1xyXG5cclxuICAgIGNvbnN0IHBzID0gQXJyYXkuZnJvbShBcnJheShzaWRlcykpXHJcbiAgICAubWFwKCh2LGkpID0+IFtcclxuICAgICAgICBjb3MoLWkqKDIqUEkpL3NpZGVzKSxcclxuICAgICAgICBzaW4oLWkqKDIqUEkpL3NpZGVzKSxcclxuICAgIF0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcHMsXHJcbiAgICAgICAgc3RhZ2U6IDAsXHJcbiAgICAgICAgc3RhZ2VQbGFjZW1lbnQ6IDFcclxuICAgIH07XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBmcm9tUmFkaXVzIH1cclxuIiwiXHJcbmZ1bmN0aW9uIGdldENlbnRyb2lkKHBzOiBudW1iZXJbXVtdKTogbnVtYmVyW10ge1xyXG4gICAgbGV0IHRvdGFsWCA9IDA7XHJcbiAgICBsZXQgdG90YWxZID0gMDtcclxuICAgIGNvbnN0IGxlbiA9IHBzLmxlbmd0aDtcclxuICAgIGZvciAobGV0IGk9MDsgaTxsZW47IGkrKykge1xyXG4gICAgICAgIHRvdGFsWCArPSBwc1tpXVswXTtcclxuICAgICAgICB0b3RhbFkgKz0gcHNbaV1bMV07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFt0b3RhbFgvbGVuLCB0b3RhbFkvbGVuXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGdldENlbnRyb2lkIH1cclxuIiwiaW1wb3J0IHsgU2hhcGUgfSBmcm9tIFwiLi9zaGFwZVwiO1xyXG5pbXBvcnQgeyBnZXRDZW50cm9pZCB9IGZyb20gXCIuL2dldC1jZW50cm9pZFwiO1xyXG5pbXBvcnQgeyBnZXRCdWNrZXRzMiB9IGZyb20gXCIuLi9oYXNoL2dldC1idWNrZXRzMlwiO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNoYXBlSGFzaGVzKFxyXG4gICAgICAgIHM6IFNoYXBlLFxyXG4gICAgICAgIG1heFJlcGVhdDogbnVtYmVyKTogbnVtYmVyW11bXSB7XHJcblxyXG4gICAgcmV0dXJuIGdldEJ1Y2tldHMyKGdldENlbnRyb2lkKHMucHMpLCBtYXhSZXBlYXQpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCB7IGdldFNoYXBlSGFzaGVzIH1cclxuIiwiaW1wb3J0IHsgcm90YXRlVmVjdG9yQXJvdW5kIH0gZnJvbSAnLi4vdmVjdG9yL3JvdGF0ZS12ZWN0b3ItYXJvdW5kJztcbmltcG9ydCB7IHRyYW5zbGF0ZVZlY3RvciB9IGZyb20gJy4uL3ZlY3Rvci90cmFuc2xhdGUtdmVjdG9yJztcblxuXG5pbnRlcmZhY2UgU2hhcGUge1xuICAgIHJlYWRvbmx5IHBzOiBudW1iZXJbXVtdO1xuICAgIC8vIHJlYWRvbmx5IHN0YWdlOiBudW1iZXI7ICAvLyByZWFkb25seSByZW1vdmVkIHRvIHJlZHVjZSBHQ1xuICAgIHN0YWdlOiBudW1iZXI7XG4gICAgcmVhZG9ubHkgc3RhZ2VQbGFjZW1lbnQ6IG51bWJlcjtcbn1cblxuXG5mdW5jdGlvbiBnZXRTaGFwZUVkZ2VzKHM6IFNoYXBlKSB7XG4gICAgY29uc3QgeyBwcyB9ID0gcztcblxuICAgIHJldHVybiBwcy5tYXAoKHAsIGkpOiBudW1iZXJbXVtdID0+IChbXG4gICAgICAgIHAsXG4gICAgICAgIHBzWyhpICsgMSklcHMubGVuZ3RoXVxuICAgIF0pKTtcbn1cblxuXG4vKipcbiAqIFxuICogQHBhcmFtIM64IFxuICogQHBhcmFtIHYgXG4gKiBAcGFyYW0gc2hhcGUgXG4gKiBAcmV0dXJucyBcbiAqL1xuZnVuY3Rpb24gcm90YXRlU2hhcGVBcm91bmQoXG4gICAgICAgIM64OiBudW1iZXIsXG4gICAgICAgIHY6IG51bWJlcltdLFxuICAgICAgICBzaGFwZTogU2hhcGUpIHtcblxuICAgIGNvbnN0IHBzID0gc2hhcGUucHMubWFwKHAgPT4gcm90YXRlVmVjdG9yQXJvdW5kKM64LHYscCkpXG4gICAgcmV0dXJuIHsgLi4uc2hhcGUsIHBzIH07XG59XG5cblxuZnVuY3Rpb24gdHJhbnNsYXRlU2hhcGUoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gX3RyYW5zbGF0ZVNoYXBlKHM6IFNoYXBlKTogU2hhcGUge1xuICAgICAgICBjb25zdCBwcyA9IHMucHMubWFwKHRyYW5zbGF0ZVZlY3Rvcih4LHkpKVxuXG4gICAgICAgIHJldHVybiB7IC4uLnMsIHBzIH07XG4gICAgfVxufVxuXG5cbmV4cG9ydCB7XG4gICAgU2hhcGUsXG4gICAgZ2V0U2hhcGVFZGdlcyxcbiAgICByb3RhdGVTaGFwZUFyb3VuZCxcbiAgICB0cmFuc2xhdGVTaGFwZVxufVxuIiwiaW1wb3J0IHsgU2hhcGUgfSBmcm9tIFwiLi4vc2hhcGUvc2hhcGVcIjtcclxuaW1wb3J0IHsgZ2V0U2hhcGVIYXNoZXMgfSBmcm9tIFwiLi4vc2hhcGUvZ2V0LXNoYXBlLWhhc2hlc1wiO1xyXG5cclxuY29uc3QgeyBzcXJ0LCB0cnVuYyB9ID0gTWF0aDtcclxuXHJcblxyXG4vKipcclxuICogXHJcbiAqIEBwYXJhbSBzaGFwZVNldCBTZXQgaG9sZGluZyBoYXNoZXMgb2YgZXhpc3Rpbmcgc2hhcGVzXHJcbiAqIEBwYXJhbSBzaGFwZXMgbmV3IHNoYXBlcyB0byBhZGRcclxuICovXHJcbmZ1bmN0aW9uIGdldE5ld1NoYXBlcyhcclxuICAgICAgICBzaGFwZVNldDogVWludDMyQXJyYXksXHJcbiAgICAgICAgc2hhcGVzOiBTaGFwZVtdLFxyXG4gICAgICAgIG1heFJlcGVhdDogbnVtYmVyKSB7XHJcblxyXG4gICAgY29uc3Qgc2hhcGVzXzogU2hhcGVbXSA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBzIG9mIHNoYXBlcykge1xyXG4gICAgICAgIGNvbnN0IGhhc2hlcyA9IGdldFNoYXBlSGFzaGVzKHMsIG1heFJlcGVhdCk7XHJcblxyXG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAobGV0IGo9MDsgajxoYXNoZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgY29uc3QgaCA9IGhhc2hlc1tqXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGgwID0gaFswXTtcclxuICAgICAgICAgICAgY29uc3QgaDEgPSBoWzFdO1xyXG4gICAgICAgICAgICBjb25zdCBiaXRMZW5ndGggPSAzMipzaGFwZVNldC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGwgPSBzcXJ0KGJpdExlbmd0aCk7ICAvLyBleGFjdFxyXG4gICAgICAgICAgICBjb25zdCBiaXRJZHggPSBsKmgwICsgaDE7XHJcbiAgICAgICAgICAgIGNvbnN0IGIxID0gdHJ1bmMoYml0SWR4LzMyKTtcclxuICAgICAgICAgICAgY29uc3QgYjIgPSBiaXRJZHglMzI7XHJcblxyXG4gICAgICAgICAgICBpZiAoKHNoYXBlU2V0W2IxXSAmIDIqKmIyKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNoYXBlU2V0W2IxXSB8PSAyKipiMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZm91bmQpIHsgc2hhcGVzXy5wdXNoKHMpOyB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNoYXBlc187XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBnZXROZXdTaGFwZXMgfVxyXG4iLCJpbXBvcnQgeyBUcmFuc2Zvcm1Qb2ludCB9IGZyb20gJy4uL3R5cGVzL3RyYW5zZm9ybS1wb2ludCc7XHJcbmltcG9ydCB7IGFuZ2xlRXF1YWxzIH0gZnJvbSAnLi4vdmVjdG9yL2FuZ2xlLWVxdWFscyc7XHJcbmltcG9ydCB7IGdldENlbnRyb2lkIH0gZnJvbSAnLi4vc2hhcGUvZ2V0LWNlbnRyb2lkJztcclxuaW1wb3J0IHsgU2hhcGUsIGdldFNoYXBlRWRnZXMgfSBmcm9tICcuLi9zaGFwZS9zaGFwZSc7XHJcbmltcG9ydCB7IGdldEJ1Y2tldHMgfSBmcm9tICcuLi9oYXNoL2dldC1idWNrZXRzJztcclxuaW1wb3J0IHsgaXNCdWNrZXRaZXJvIH0gZnJvbSAnLi4vaGFzaC9pcy1idWNrZXQtemVybyc7XHJcbmltcG9ydCB7IEFOR0xFX1BSRUNJU0lPTiwgZ2V0QW5nbGVDbG9ja3dpc2VGcm9tWUF4aXMgfSBmcm9tICcuLi92ZWN0b3IvZ2V0LWFuZ2xlJztcclxuXHJcbmNvbnN0IHsgaHlwb3QsIFBJIH0gPSBNYXRoO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFRyYW5zZm9ybVBvaW50cyhzaGFwZXM6IFNoYXBlW10pOiBNYXA8c3RyaW5nLFRyYW5zZm9ybVBvaW50PiB7XHJcbiAgICBjb25zdCB0cmFuc2Zvcm1Qb2ludHMxOiBUcmFuc2Zvcm1Qb2ludFtdID0gW107XHJcblxyXG4gICAgLy8gQ2VudHJvaWRzIChjKVxyXG4gICAgZm9yIChsZXQgaT0wOyBpPHNoYXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHMgPSBzaGFwZXNbaV07XHJcblxyXG4gICAgICAgIGNvbnN0IHsgcHMgfSA9IHM7XHJcbiAgICAgICAgY29uc3QgdiA9IGdldENlbnRyb2lkKHBzKTtcclxuXHJcbiAgICAgICAgdHJhbnNmb3JtUG9pbnRzMS5wdXNoKHsgdiwgcG9pbnRUeXBlOiAnYycsIGluZGV4OiAwIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFZlcnRpY2VzICh2KSBhbmQgTWlkcG9pbnRzIChoKVxyXG4gICAgY29uc3QgZWRnZXMgPSBzaGFwZXMubWFwKGdldFNoYXBlRWRnZXMpLmZsYXQoKTtcclxuICAgIGZvciAoY29uc3QgbHMgb2YgZWRnZXMpIHtcclxuICAgICAgICBjb25zdCBbdjEsdjJdID0gbHM7XHJcblxyXG4gICAgICAgIHRyYW5zZm9ybVBvaW50czEucHVzaChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdjogdjEsXHJcbiAgICAgICAgICAgICAgICBwb2ludFR5cGU6ICd2JyxcclxuICAgICAgICAgICAgICAgIGluZGV4OiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHY6IGdldENlbnRyb2lkKGxzKSxcclxuICAgICAgICAgICAgICAgIHZzOiBbdjEsdjJdLFxyXG4gICAgICAgICAgICAgICAgcG9pbnRUeXBlOiAnaCcsXHJcbiAgICAgICAgICAgICAgICBpbmRleDogMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmFuc2Zvcm1Qb2ludHMyID0gZ2V0VW5pcXVlVmVydGljZXNOb3RaZXJvKHRyYW5zZm9ybVBvaW50czEpO1xyXG5cclxuICAgIGxldCBjYyA9IDA7XHJcbiAgICBsZXQgdnYgPSAwXHJcbiAgICBsZXQgaGggPSAwO1xyXG4gICAgY29uc3QgdHJhbnNmb3JtUG9pbnRzMyA9IHRyYW5zZm9ybVBvaW50czJcclxuICAgICAgICAuc29ydCgoYSxiKSA9PiBjb21wYXJlUG9pbnRzKGEudixiLnYpKVxyXG4gICAgICAgIC5tYXAodHAgPT4gKHtcclxuICAgICAgICAgICAgICAgIC4uLnRwLFxyXG4gICAgICAgICAgICAgICAgaW5kZXg6ICh0cC5wb2ludFR5cGUgPT09ICdjJyAmJiArK2NjKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICh0cC5wb2ludFR5cGUgPT09ICd2JyAmJiArK3Z2KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICh0cC5wb2ludFR5cGUgPT09ICdoJyAmJiArK2hoKSB8fCAwLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgY29uc3QgdHJhbnNmb3JtUG9pbnRNYXA6IE1hcDxzdHJpbmcsVHJhbnNmb3JtUG9pbnQ+ID0gbmV3IE1hcChcclxuICAgICAgICB0cmFuc2Zvcm1Qb2ludHMzXHJcbiAgICAgICAgLm1hcCh2ID0+IFt2LnBvaW50VHlwZSArIHYuaW5kZXgsIHZdKVxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gdHJhbnNmb3JtUG9pbnRNYXA7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjb21wYXJlUG9pbnRzKFxyXG4gICAgICAgIGE6IG51bWJlcltdLFxyXG4gICAgICAgIGI6IG51bWJlcltdKSB7XHJcblxyXG4gICAgY29uc3QgX864YSA9IGdldEFuZ2xlQ2xvY2t3aXNlRnJvbVlBeGlzKGEpO1xyXG4gICAgY29uc3QgX864YiA9IGdldEFuZ2xlQ2xvY2t3aXNlRnJvbVlBeGlzKGIpO1xyXG5cclxuICAgIGNvbnN0IM64YSA9IF/OuGEgPiAyKlBJIC0gQU5HTEVfUFJFQ0lTSU9OID8gMCA6IF/OuGE7XHJcbiAgICBjb25zdCDOuGIgPSBfzrhiID4gMipQSSAtIEFOR0xFX1BSRUNJU0lPTiA/IDAgOiBfzrhiO1xyXG5cclxuICAgIGlmIChhbmdsZUVxdWFscyjOuGEszrhiKSkge1xyXG4gICAgICAgIHJldHVybiBoeXBvdCguLi5hKSAtIGh5cG90KC4uLmIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiDOuGEgLSDOuGI7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRVbmlxdWVWZXJ0aWNlc05vdFplcm8oXHJcbiAgICAgICAgdmVydGljZXM6IFRyYW5zZm9ybVBvaW50W10pIHtcclxuXHJcbiAgICBjb25zdCB2ZXJ0ZXhTZXQ6IFNldDxudW1iZXI+ID0gbmV3IFNldCgpO1xyXG4gICAgY29uc3QgdmVydGljZXNfOiBUcmFuc2Zvcm1Qb2ludFtdID0gW107XHJcbiAgICBmb3IgKGNvbnN0IHZlcnRleCBvZiB2ZXJ0aWNlcykge1xyXG4gICAgICAgIGNvbnN0IGhhc2hlcyA9IGdldEJ1Y2tldHModmVydGV4LnYpO1xyXG5cclxuICAgICAgICBpZiAoaXNCdWNrZXRaZXJvKGhhc2hlcykpIHtcclxuICAgICAgICAgICAgY29udGludWU7ICAvLyBubyBvcmlnaW5zIGFsbG93ZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPGhhc2hlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBjb25zdCBoID0gaGFzaGVzW2pdO1xyXG4gICAgICAgICAgICBpZiAodmVydGV4U2V0LmhhcyhoKSkge1xyXG4gICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZvdW5kKSB7IGNvbnRpbnVlOyB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgaCBvZiBoYXNoZXMpIHtcclxuICAgICAgICAgICAgdmVydGV4U2V0LmFkZChoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZlcnRpY2VzXy5wdXNoKHZlcnRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZlcnRpY2VzXztcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IGdldFRyYW5zZm9ybVBvaW50cywgY29tcGFyZVBvaW50cyB9XHJcbiIsImltcG9ydCB7IFNoYXBlIH0gZnJvbSBcIi4uL3NoYXBlL3NoYXBlXCI7XHJcbmltcG9ydCB7IHJlZmxlY3RWZWN0b3IgfSBmcm9tIFwiLi4vdmVjdG9yL3JlZmxlY3QtdmVjdG9yXCI7XHJcblxyXG5cclxuLy8gZnVuY3Rpb24gcmVmbGVjdFNoYXBlcyhcclxuLy8gICAgICAgICBsczogbnVtYmVyW11bXSxcclxuLy8gICAgICAgICBzaGFwZXM6IFNoYXBlW10pOiBTaGFwZVtdIHtcclxuXHJcbi8vICAgICByZXR1cm4gc2hhcGVzLm1hcChzID0+IHtcclxuLy8gICAgICAgICBjb25zdCBwcyA9IHMucHMubWFwKHJlZmxlY3RWZWN0b3IobHMpKTtcclxuLy8gICAgICAgICByZXR1cm4geyAuLi5zLCBwcyB9O1xyXG4vLyAgICAgfSk7XHJcbi8vIH1cclxuXHJcblxyXG5mdW5jdGlvbiByZWZsZWN0U2hhcGVzKFxyXG4gICAgICAgIGxzOiBudW1iZXJbXVtdLFxyXG4gICAgICAgIHNoYXBlczogU2hhcGVbXSk6IFNoYXBlW10ge1xyXG5cclxuICAgIGNvbnN0IHNoYXBlc186IFNoYXBlW10gPSBbXTtcclxuICAgIGZvciAobGV0IGk9MDsgaTxzaGFwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBzID0gc2hhcGVzW2ldO1xyXG4gICAgICAgIGNvbnN0IF9wcyA9IHMucHM7XHJcbiAgICAgICAgbGV0IHBzOiBudW1iZXJbXVtdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPF9wcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBwcy5wdXNoKHJlZmxlY3RWZWN0b3IobHMsX3BzW2pdKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzaGFwZXNfLnB1c2goe1xyXG4gICAgICAgICAgICBzdGFnZTogcy5zdGFnZSxcclxuICAgICAgICAgICAgc3RhZ2VQbGFjZW1lbnQ6IHMuc3RhZ2VQbGFjZW1lbnQsXHJcbiAgICAgICAgICAgIHBzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNoYXBlc187XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyByZWZsZWN0U2hhcGVzIH1cclxuIiwiaW1wb3J0IHsgemVyb1ZlY3RvciB9IGZyb20gXCIuLi92ZWN0b3IvemVyby12ZWN0b3JcIjtcclxuaW1wb3J0IHsgU2hhcGUsIHJvdGF0ZVNoYXBlQXJvdW5kIH0gZnJvbSBcIi4uL3NoYXBlL3NoYXBlXCI7XHJcblxyXG5cclxuZnVuY3Rpb24gcm90YXRlU2hhcGVzKFxyXG4gICAgICAgIM64OiBudW1iZXIsXHJcbiAgICAgICAgdiA9IHplcm9WZWN0b3IsXHJcbiAgICAgICAgc2hhcGVzOiBTaGFwZVtdKTogU2hhcGVbXSB7XHJcblxyXG4gICAgcmV0dXJuIHNoYXBlcy5tYXAoc2hhcGUgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBzID0gcm90YXRlU2hhcGVBcm91bmQozrgsdixzaGFwZSkucHM7XHJcbiAgICAgICAgcmV0dXJuIHsgLi4uc2hhcGUsIHBzIH07XHJcbiAgICB9KTtcclxufSBcclxuXHJcblxyXG5leHBvcnQgeyByb3RhdGVTaGFwZXMgfVxyXG4iLCJpbXBvcnQgeyBUcmFuc2Zvcm1UeXBlIH0gZnJvbSAnLi90eXBlcy90cmFuc2Zvcm0tdHlwZSc7XG5pbXBvcnQgeyBFbnRpdGllcyB9IGZyb20gJy4vdHlwZXMvZW50aXRpZXMnO1xuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSAnLi90eXBlcy90cmFuc2Zvcm0nO1xuXG5cbmZ1bmN0aW9uIHRvUmFkaWFucyhuOiBudW1iZXIpIHtcbiAgICByZXR1cm4gKG4qKE1hdGguUEkvMTgwKSk7XG59XG5cblxuZnVuY3Rpb24gdG9FbnRpdGllcyhjb25maWd1cmF0aW9uOiBzdHJpbmcpOiBFbnRpdGllcyB7XG4gICAgLy8gRS5nOiAnMy00LTMsMy9tMzAvbSg0KSdcbiAgICAvLyBFLmc6ICczLTQtMywzL20zMC9tKGgyKSdcbiAgICBjb25zdCBbc2hhcGVzLCAuLi50cmFuc2Zvcm1zU3RyXSA9XG4gICAgICAgIGNvbmZpZ3VyYXRpb24uc3BsaXQoJy8nKTtcblxuICAgIC8vIHNoYXBlcyA9PT0gJzMtNC0zLDMnXG4gICAgLy8gdHJhbnNmb3JtcyA9PT0gWydtMzAnLCdtKDQpJ11cblxuICAgIGNvbnN0IHNoYXBlc18gPVxuICAgICAgICBzaGFwZXNcbiAgICAgICAgLnNwbGl0KCctJylcbiAgICAgICAgLm1hcChncm91cCA9PiBncm91cFxuICAgICAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgICAgIC5tYXAoc2hhcGUgPT4gTnVtYmVyLnBhcnNlSW50KHNoYXBlKSkpO1xuXG4gICAgLy8gc2hhcGVzXyA9PT0gW1szXSxbNF0sWzMsM11dXG5cbiAgICBlbnN1cmVTaGFwZUdyb3Vwc0NvcnJlY3QoY29uZmlndXJhdGlvbiwgc2hhcGVzXyk7XG5cbiAgICBjb25zdCBbW3NlZWRTaGFwZVR5cGVdLCAuLi5zaGFwZUdyb3Vwc10gPSBzaGFwZXNfO1xuXG4gICAgLy8gc2hhcGVTZWVkID09PSAzXG4gICAgLy8gc2hhcGVHcm91cHMgPT09IFtbNF0sWzMsM11dXG5cbiAgICBjb25zdCB0cmFuc2Zvcm1zID0gdHJhbnNmb3Jtc1N0clxuICAgICAgICAubWFwKHRvVHJhbnNmb3JtKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgLy8gdHJhbnNmb3JtRW50aXRpZXMgPT09IFt7XG4gICAgLy8gICAgIGFjdGlvbjogXCJtXCIsXG4gICAgLy8gICAgIGFjdGlvbkFuZ2xlOiAwLjUyMzU5ODc3NTU5ODI5ODgsXG4gICAgLy8gICAgIHBvaW50SW5kZXg6IDAsXG4gICAgLy8gICAgIHN0cmluZzogXCJtMzBcIlxuICAgIC8vIH0sIHtcbiAgICAvLyAgICAgYWN0aW9uOiBcIm1cIixcbiAgICAvLyAgICAgcG9pbnRJbmRleDogNCxcbiAgICAvLyAgICAgcG9pbnQ6IHtcbiAgICAvLyAgICAgICAgIFwidlwiOiB7IFwieFwiOiAtNS42ODQzNDE4ODYwODA4MDJlLTE0LCBcInlcIjogLTg5LjU5MjQ0ODM4NTgwOTI4IH0sXG4gICAgLy8gICAgICAgICBcIs64XCI6IDAsXG4gICAgLy8gICAgICAgICBcInB0XCI6IFwibFwiXG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgIHN0cmluZzogXCJtKDQpXCIsXG4gICAgLy8gfV1cblxuICAgIHJldHVybiB7IHNlZWRTaGFwZVR5cGUsIHNoYXBlR3JvdXBzLCB0cmFuc2Zvcm1zIH0gYXMgRW50aXRpZXM7XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgYFRyYW5zZm9ybWAgZ2l2ZW4gYSBzdHJpbmcgKGUuZy4gJ200NScgb3IgJ3IoaDEpJylcbiAqIEBwYXJhbSB0cmFuc2Zvcm0gXG4gKiBAcmV0dXJucyBcbiAqL1xuZnVuY3Rpb24gdG9UcmFuc2Zvcm0oXG4gICAgICAgIHRyYW5zZm9ybTogc3RyaW5nKTogVHJhbnNmb3JtIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IG1hdGNoID0gLyhbbXJdKShbXFxkLl0qKT9cXCg/KFtjdmhcXGRdKyk/XFwpPy9pLmV4ZWModHJhbnNmb3JtKTtcblxuICAgIC8vIEUuZy4gJ20nXG4gICAgLy8gRS5nLiAnbTQ1J1xuICAgIC8vIEUuZy4gJ3IodjE1KSdcblxuICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCBbXG4gICAgICAgICAgICAsXG4gICAgICAgICAgICB0cmFuc2Zvcm1UeXBlLFxuICAgICAgICAgICAgYW5nbGVTdHIgPSAnMTgwJyxcbiAgICAgICAgICAgIHBvaW50SW5kZXgsXG4gICAgICAgIF0gPSBtYXRjaCBhcyB1bmtub3duIGFzIFtcbiAgICAgICAgICAgIHN0cmluZyxcbiAgICAgICAgICAgIFRyYW5zZm9ybVR5cGUsICAgICAgIC8vICdtJ3wncidcbiAgICAgICAgICAgIHN0cmluZyB8IHVuZGVmaW5lZCwgIC8vIGFuZ2xlIChkZWZhdWx0cyB0byAxODApXG4gICAgICAgICAgICBzdHJpbmcgfCB1bmRlZmluZWQgICAvLyBlLmcuICd2MScsICdoMjEnLCAnYzMnLCBldGMuXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgYW5nbGUgPSBOdW1iZXIucGFyc2VJbnQoYW5nbGVTdHIpO1xuXG4gICAgICAgIGlmIChhbmdsZSAhPT0gMzAgJiYgYW5nbGUgIT09IDQ1ICYmIGFuZ2xlICE9PSA2MCAmJlxuICAgICAgICAgICAgYW5nbGUgIT09IDkwICYmIGFuZ2xlICE9PSAxODApIHtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbmdsZSBtdXN0IGJlIDMwLDQ1LDYwLDkwIG9yIDE4MCBkZWdyZWVzLCBidXQgZm91bmQgJHthbmdsZVN0cn1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1UeXBlLFxuICAgICAgICAgICAgYW5nbGU6IHBvaW50SW5kZXggPyB1bmRlZmluZWQgOiB0b1JhZGlhbnMoYW5nbGUpLFxuICAgICAgICAgICAgb3JpZ2luOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBwb2ludEluZGV4OiBwb2ludEluZGV4ID8gcG9pbnRJbmRleCA6ICcnLFxuICAgICAgICAgICAgc3RyaW5nOiB0cmFuc2Zvcm0sXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGVuc3VyZVNoYXBlR3JvdXBzQ29ycmVjdChcbiAgICAgICAgY29uZmlndXJhdGlvbjogc3RyaW5nLFxuICAgICAgICBzaGFwZUdyb3VwczogbnVtYmVyW11bXSkge1xuXG4gICAgZm9yIChjb25zdCBzaGFwZUdyb3VwIG9mIHNoYXBlR3JvdXBzKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc2hhcGUgb2Ygc2hhcGVHcm91cCkge1xuICAgICAgICAgICAgaWYgKHNoYXBlICE9PSAwICYmXG4gICAgICAgICAgICAgICAgc2hhcGUgIT09IDMgJiYgc2hhcGUgIT09IDQgJiYgc2hhcGUgIT09IDYgJiZcbiAgICAgICAgICAgICAgICBzaGFwZSAhPT0gOCAmJiBzaGFwZSAhPT0gMTIpIHtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaGFwZSBtdXN0IGJlIDAsMyw0LDYsOCBvciAxMiwgYnV0IGZvdW5kICR7c2hhcGV9IC0gJHtjb25maWd1cmF0aW9ufWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCB7IHRvRW50aXRpZXMgfVxuIiwiaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSAnLi4vdHlwZXMvdHJhbnNmb3JtJztcclxuaW1wb3J0IHsgdHJhbnNmb3JtVXNpbmdPcmlnaW4gfSBmcm9tICcuL3RyYW5zZm9ybS11c2luZy1vcmlnaW4nO1xyXG5pbXBvcnQgeyB0cmFuc2Zvcm1Vc2luZ1RyYW5zZm9ybVBvaW50IH0gZnJvbSAnLi90cmFuc2Zvcm0tdXNpbmctdHJhbnNmb3JtLXBvaW50JztcclxuaW1wb3J0IHsgU2hhcGUgfSBmcm9tICcuLi9zaGFwZS9zaGFwZSc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybVBvaW50IH0gZnJvbSAnLi4vdHlwZXMvdHJhbnNmb3JtLXBvaW50JztcclxuXHJcblxyXG4vKipcclxuICogKiAqKm1vZGlmaWVzKiogYG5ld1NoYXBlc0ZpbGxgLCBgbmV3U2hhcGVzR3Jvd2AsIGBzaGFwZVNldGAgYW5kIGBzaGFwZXNgXHJcbiAqIFxyXG4gKiBAcGFyYW0gc2hhcGVTZXQgXHJcbiAqIEBwYXJhbSBzaGFwZXMgXHJcbiAqIEBwYXJhbSB0cmFuc2Zvcm1Qb2ludHMgXHJcbiAqIEBwYXJhbSB0cmFuc2Zvcm0gXHJcbiAqIEBwYXJhbSBuZXdTaGFwZXNHcm93IFxyXG4gKi9cclxuZnVuY3Rpb24gYXBwbHlUcmFuc2Zvcm0oXHJcbiAgICAgICAgc2hhcGVTZXQ6IFVpbnQzMkFycmF5LCBcclxuICAgICAgICBuZXdTaGFwZXNHcm93OiBTaGFwZVtdLFxyXG4gICAgICAgIG5ld1NoYXBlc0ZpbGw6IFNoYXBlW10sXHJcbiAgICAgICAgc2hhcGVzOiBTaGFwZVtdLFxyXG4gICAgICAgIHRyYW5zZm9ybVBvaW50czogTWFwPHN0cmluZywgVHJhbnNmb3JtUG9pbnQ+LFxyXG4gICAgICAgIHRyYW5zZm9ybTogVHJhbnNmb3JtLFxyXG4gICAgICAgIG1heFJlcGVhdDogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgY29uc3QgeyBwb2ludEluZGV4IH0gPSB0cmFuc2Zvcm07XHJcblxyXG4gICAgY29uc3QgYWRkZWRTaGFwZXMgPSAhIXBvaW50SW5kZXhcclxuICAgICAgICA/IHRyYW5zZm9ybVVzaW5nVHJhbnNmb3JtUG9pbnQoXHJcbiAgICAgICAgICAgIHNoYXBlU2V0LCBuZXdTaGFwZXNGaWxsLCB0cmFuc2Zvcm0sIG1heFJlcGVhdCwgdHJhbnNmb3JtUG9pbnRzXHJcbiAgICAgICAgKVxyXG4gICAgICAgIDogdHJhbnNmb3JtVXNpbmdPcmlnaW4oXHJcbiAgICAgICAgICAgIHNoYXBlU2V0LCBuZXdTaGFwZXNHcm93LCB0cmFuc2Zvcm0sIG1heFJlcGVhdFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgbmV3U2hhcGVzRmlsbC5wdXNoKC4uLmFkZGVkU2hhcGVzKTtcclxuICAgIG5ld1NoYXBlc0dyb3cucHVzaCguLi5hZGRlZFNoYXBlcyk7XHJcbiAgICBzaGFwZXMucHVzaCguLi5hZGRlZFNoYXBlcyk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBhcHBseVRyYW5zZm9ybSB9XHJcbiIsImNvbnN0IHsgUEkgfSA9IE1hdGg7XHJcblxyXG5jb25zdCBERUdfOTAgPSBQSS8yO1xyXG5jb25zdCBERUdfMTgwID0gUEk7XHJcbmNvbnN0IERFR18zNjAgPSBQSSoyO1xyXG5cclxuXHJcbmV4cG9ydCB7IERFR185MCwgREVHXzE4MCwgREVHXzM2MCB9XHJcbiIsIlxyXG5jb25zdCBFcnJvclNlZWQgPSAoKSA9PiAoe1xyXG4gICAgY29kZTogJ0Vycm9yU2VlZCcsXHJcbiAgICB0eXBlOiAnU2VlZCBTaGFwZScsXHJcbiAgICBtZXNzYWdlOiAnVGhlIHNlZWQgc2hhcGUgbXVzdCBiZSBvbmUgb2YgMywgNCwgNiwgOCBvciAxMiwgZGlyZWN0bHkgZm9sbG93ZWQgYnkgYSBgLWAgdG8gaW5kaWNhdGUgdGhlIHN0YXJ0IG9mIHRoZSBuZXh0IHNoYXBlIGdyb3VwLicsXHJcbn0pO1xyXG5cclxuY29uc3QgRXJyb3JJbnZhbGlkU2hhcGUgPSAoKSA9PiAoe1xyXG4gICAgY29kZTogJ0Vycm9yU2hhcGUnLFxyXG4gICAgdHlwZTogJ0ludmFsaWQgU2hhcGUnLFxyXG4gICAgbWVzc2FnZTogJ1NoYXBlcyBtdXN0IG9ubHkgYmUgb25lIG9mIDMsIDQsIDYsIDgsIG9yIDEyLicsXHJcbn0pO1xyXG5cclxuY29uc3QgRXJyb3JUcmFuc2Zvcm1BbmdsZVplcm8gPSAodHJhbnNmb3JtOiBzdHJpbmcpID0+ICh7XHJcbiAgICBjb2RlOiAnRXJyb3JUcmFuc2Zvcm1BbmdsZScsXHJcbiAgICB0eXBlOiAnVHJhbnNmb3JtIEFuZ2xlJyxcclxuICAgIG1lc3NhZ2U6IGBUaGUgYW5nbGUgb2YgdGhlIFwiJHt0cmFuc2Zvcm19XCIgdHJhbnNmb3JtIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAuYCxcclxufSk7XHJcblxyXG5jb25zdCBFcnJvclRyYW5zZm9ybU5vQ2hhbmdlID0gKCkgPT4gKHtcclxuICAgIGNvZGU6ICdFcnJvclRyYW5zZm9ybU5vQ2hhbmdlJyxcclxuICAgIHR5cGU6ICdSZXBlYXRlZCBUcmFuc2Zvcm0nLFxyXG4gICAgbWVzc2FnZTogJ1RoZSBjb3ZlcmVkIGFyZWEgZGlkIG5vdCBpbmNyZWFzZSB3aGVuIHRoZSB0aWxlIHdhcyByZXBlYXRlZC4gJyArXHJcbiAgICAgICAgICAgICAnVGhpcyBpcyBsaWtlbHkgY2F1c2VkIGJ5IG9uZSBvciBtb3JlIGluY29ycmVjdCB0cmFuc2Zvcm1zLidcclxufSk7XHJcblxyXG5jb25zdCBFcnJvclRyYW5zZm9ybU5vSW50ZXJzZWN0aW9uUG9pbnQgPSAodHJhbnNmb3JtOiBzdHJpbmcpID0+ICh7XHJcbiAgICBjb2RlOiAnRXJyb3JUcmFuc2Zvcm1Ob0ludGVyc2VjdGlvblBvaW50JyxcclxuICAgIHR5cGU6ICdUcmFuc2Zvcm0gSW50ZXJzZWN0aW9uIFBvaW50JyxcclxuICAgIG1lc3NhZ2U6IGBObyBpbnRlcnNlY3Rpb24gcG9pbnQgZm91bmQgZm9yIHRoZSBcIiR7dHJhbnNmb3JtfVwiIHRyYW5zZm9ybS5gLFxyXG59KTtcclxuXHJcblxyXG5leHBvcnQgeyBcclxuICAgIEVycm9yU2VlZCxcclxuICAgIEVycm9ySW52YWxpZFNoYXBlLFxyXG4gICAgRXJyb3JUcmFuc2Zvcm1BbmdsZVplcm8sXHJcbiAgICBFcnJvclRyYW5zZm9ybU5vQ2hhbmdlLFxyXG4gICAgRXJyb3JUcmFuc2Zvcm1Ob0ludGVyc2VjdGlvblBvaW50XHJcbn0iLCJpbXBvcnQgeyB6ZXJvVmVjdG9yIH0gZnJvbSAnLi4vdmVjdG9yL3plcm8tdmVjdG9yJztcclxuaW1wb3J0IHsgZnJvbVJhZGl1cyB9IGZyb20gJy4uL3NoYXBlL2Zyb20tcmFkaXVzJztcclxuaW1wb3J0IHsgU2hhcGUsIHJvdGF0ZVNoYXBlQXJvdW5kIH0gZnJvbSAnLi4vc2hhcGUvc2hhcGUnO1xyXG5pbXBvcnQgeyBFcnJvclNlZWQgfSBmcm9tICcuL2Vycm9ycyc7XHJcblxyXG5jb25zdCB7IFBJLCBzcXJ0IH0gPSBNYXRoO1xyXG5cclxuXHJcbmNvbnN0IHNoYXBlcyA9IHtcclxuICAgIDM6IHsgcHM6IFtbMCwxXSwgW3NxcnQoMykvMiwgMC41XSwgWzAsMF1dLCBzdGFnZTogMCwgc3RhZ2VQbGFjZW1lbnQ6IDEgfSxcclxuICAgIDQ6ICByb3RhdGVTaGFwZUFyb3VuZCgzKlBJLzQsICB6ZXJvVmVjdG9yLCBmcm9tUmFkaXVzKDQpKSxcclxuICAgIDY6ICByb3RhdGVTaGFwZUFyb3VuZCgzKlBJLzYsICB6ZXJvVmVjdG9yLCBmcm9tUmFkaXVzKDYpKSxcclxuICAgIDg6ICByb3RhdGVTaGFwZUFyb3VuZCg1KlBJLzgsICB6ZXJvVmVjdG9yLCBmcm9tUmFkaXVzKDgpKSxcclxuICAgIDEyOiByb3RhdGVTaGFwZUFyb3VuZCg3KlBJLzEyLCB6ZXJvVmVjdG9yLCBmcm9tUmFkaXVzKDEyKSlcclxufTtcclxuXHJcbmZ1bmN0aW9uIGdldFNlZWRTaGFwZShuOiBudW1iZXIpOiBTaGFwZSB7XHJcbiAgICBjb25zdCBzaGFwZSA9IHNoYXBlc1tuIGFzIDN8NHw2fDh8MTJdO1xyXG5cclxuICAgIGlmIChzaGFwZSA9PT0gdW5kZWZpbmVkKSB7IHRocm93IEVycm9yU2VlZCgpOyB9XHJcblxyXG4gICAgcmV0dXJuIHNoYXBlO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgZ2V0U2VlZFNoYXBlIH1cclxuIiwiaW1wb3J0IHsgdG9FbnRpdGllcyB9IGZyb20gJy4uL3RvLWVudGl0aWVzJztcclxuaW1wb3J0IHsgU2hhcGUsIGdldFNoYXBlRWRnZXMgfSBmcm9tICcuLi9zaGFwZS9zaGFwZSc7XHJcbmltcG9ydCB7IGdldFNlZWRTaGFwZSB9IGZyb20gJy4vZ2V0LXNlZWQtc2hhcGUnO1xyXG5pbXBvcnQgeyBmcm9tRWRnZSB9IGZyb20gJy4uL3NoYXBlL2Zyb20tbGluZS1zZWdtZW50JztcclxuaW1wb3J0IHsgZ2V0QnVja2V0cyB9IGZyb20gJy4uL2hhc2gvZ2V0LWJ1Y2tldHMnO1xyXG5pbXBvcnQgeyBnZXRDZW50cm9pZCB9IGZyb20gJy4uL3NoYXBlL2dldC1jZW50cm9pZCc7XHJcbmltcG9ydCB7IGNvbXBhcmVQb2ludHMgfSBmcm9tICcuLi9zaGFwZXMvZ2V0LXRyYW5zZm9ybS1wb2ludHMnO1xyXG5cclxuY29uc3QgeyBhYnMsIG1heCB9ID0gTWF0aDtcclxuY29uc3QgVE9MID0gMioqLTEwOyAgLy8gVE9ETzJcclxuXHJcbi8vIEUuZy4gMTItNCw2LTNcclxuLy8gLS0tLS0tLS0tLS0tLVxyXG4vLyAxLiBQbGFjZSBzZWVkIHNoYXBlICgxMilcclxuLy8gMi4gU2hhcGUgZ3JvdXBzID09PSA0LDYtM1xyXG4vLyAzLiBQbGFjZSA0IG9uIGZpcnN0IG9wZW4gcG9seWdvbiBlZGdlXHJcbi8vIDQuIFBsYWNlIDYgb24gbmV4dCBwb2x5Z29uIGVkZ2UgKG9mIHNhbWUgc2hhcGUpXHJcbi8vIDUuIFBsYWNlIDMgb24gZmlyc3Qgb3BlbiBwb2x5Z29uIGVkZ2Ugb2YgcG9seWdvbnMgaW4gcHJldmlvdXMgcGhhc2VcclxuXHJcblxyXG5mdW5jdGlvbiBnZXRTZWVkU2hhcGVzKFxyXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHN0cmluZykge1xyXG5cclxuICAgIGNvbnN0IHsgc2VlZFNoYXBlVHlwZSwgc2hhcGVHcm91cHMgfSA9IHRvRW50aXRpZXMoY29uZmlndXJhdGlvbik7XHJcblxyXG4gICAgY29uc3Qgc2VlZFNoYXBlID0gZ2V0U2VlZFNoYXBlKHNlZWRTaGFwZVR5cGUpO1xyXG5cclxuICAgIGxldCBzaGFwZXMgPSBbc2VlZFNoYXBlXTtcclxuXHJcbiAgICBsZXQgc3RhZ2VQbGFjZW1lbnQgPSAxO1xyXG5cclxuICAgIC8qKiBNYXAgZnJvbSBsaW5lIHNlZ21lbnQgaGFzaCB0byBudW1iZXIgb2YgbGluZSBzZWdtZW50cyBhZGRlZCAqL1xyXG4gICAgY29uc3QgY29ubmVjdGlvbnMgPSBuZXcgU2V0PG51bWJlcj4oKTtcclxuICAgIGFkZENvbm5lY3Rpb25zKGNvbm5lY3Rpb25zLCBzZWVkU2hhcGUpO1xyXG5cclxuICAgIGxldCBwcmV2U2hhcGVzID0gW3NlZWRTaGFwZV07XHJcbiAgICBmb3IgKGNvbnN0IHNoYXBlR3JvdXAgb2Ygc2hhcGVHcm91cHMpIHtcclxuICAgICAgICBjb25zdCBzaGFwZXNFZGdlcyA9IHByZXZTaGFwZXNcclxuICAgICAgICAgICAgLm1hcChnZXRTaGFwZUVkZ2VzKVxyXG4gICAgICAgICAgICAuZmxhdCgpXHJcbiAgICAgICAgICAgIC5zb3J0KChhLGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhYnMoYVswXVswXSkgPCBUT0wgJiYgYWJzKGFbMV1bMF0pIDwgVE9MKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmVydGljYWwgbGluZSBzZWdtZW50IHBhc3NpbmcgdGhyb3VnaCBvcmlnaW5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhYnMoYlswXVswXSkgPCBUT0wgJiYgYWJzKGJbMV1bMF0pIDwgVE9MKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmVydGljYWwgbGluZSBzZWdtZW50IHBhc3NpbmcgdGhyb3VnaCBvcmlnaW5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYSA9IGdldENlbnRyb2lkKGEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2IgPSBnZXRDZW50cm9pZChiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wYXJlUG9pbnRzKGNhLGNiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHByZXZTaGFwZXMgPSBbXTtcclxuICAgICAgICBsZXQgaWR4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8c2hhcGVzRWRnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgc2hhcGVUeXBlID0gc2hhcGVHcm91cFtpZHhdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbHMgPSBzaGFwZXNFZGdlc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgbiA9IGdldE51bWJlck9mQ29ubmVjdGlvbnMoY29ubmVjdGlvbnMsIGxzKTtcclxuICAgICAgICAgICAgaWYgKG4gPiAxKSB7IGNvbnNvbGUubG9nKCdhJyk7Y29udGludWU7IH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzaGFwZVR5cGUgPT09IDApIHsgaWR4Kys7IGNvbnRpbnVlOyB9XHJcblxyXG4gICAgICAgICAgICBzdGFnZVBsYWNlbWVudCsrO1xyXG4gICAgICAgICAgICBjb25zdCBzaGFwZSA9IGZyb21FZGdlKHNoYXBlVHlwZSwgbHMsIHN0YWdlUGxhY2VtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHNoYXBlcy5wdXNoKHNoYXBlKTtcclxuICAgICAgICAgICAgcHJldlNoYXBlcy5wdXNoKHNoYXBlKTtcclxuXHJcbiAgICAgICAgICAgIGFkZENvbm5lY3Rpb25zKGNvbm5lY3Rpb25zLCBzaGFwZSk7XHJcblxyXG4gICAgICAgICAgICBpZHgrKztcclxuXHJcbiAgICAgICAgICAgIGlmIChpZHggPj0gc2hhcGVHcm91cC5sZW5ndGgpIHsgYnJlYWs7IH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsgc2hhcGVzLCBzdGFnZVBsYWNlbWVudCB9O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TnVtYmVyT2ZDb25uZWN0aW9ucyhcclxuICAgICAgICBjb25uZWN0aW9uczogU2V0PG51bWJlcj4sXHJcbiAgICAgICAgbHM6IG51bWJlcltdW10pIHtcclxuXHJcbiAgICBjb25zdCBlZGdlSGFzaGVzID0gZ2V0QnVja2V0cyhnZXRDZW50cm9pZChscykpO1xyXG5cclxuICAgIGNvbnN0IGhzID0gZWRnZUhhc2hlc1xyXG4gICAgICAgIC5tYXAoaCA9PiBjb25uZWN0aW9ucy5oYXMoaCkgPyAxIDogMCk7XHJcblxyXG4gICAgaWYgKGhzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gMDsgfVxyXG5cclxuICAgIHJldHVybiBtYXgoLi4uaHMpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gYWRkQ29ubmVjdGlvbnMoXHJcbiAgICAgICAgY29ubmVjdGlvbnM6IFNldDxudW1iZXI+LFxyXG4gICAgICAgIHNoYXBlOiBTaGFwZSkge1xyXG5cclxuICAgIGNvbnN0IGVkZ2VzID0gZ2V0U2hhcGVFZGdlcyhzaGFwZSk7XHJcbiAgICBjb25zdCBlZGdlSGFzaGVzcyA9IGVkZ2VzLm1hcChscyA9PiBnZXRCdWNrZXRzKGdldENlbnRyb2lkKGxzKSkpO1xyXG5cclxuICAgIGZvciAoY29uc3QgZWRnZUhhc2hlcyBvZiBlZGdlSGFzaGVzcykge1xyXG4gICAgICAgIGZvciAoY29uc3QgaCBvZiBlZGdlSGFzaGVzKSB7XHJcbiAgICAgICAgICAgIGNvbm5lY3Rpb25zLmFkZChoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBnZXRTZWVkU2hhcGVzIH1cclxuIiwiaW1wb3J0IHsgU2hhcGUgfSBmcm9tIFwiLi4vc2hhcGUvc2hhcGVcIjtcclxuaW1wb3J0IHsgc2NhbGVWZWN0b3IgfSBmcm9tIFwiLi4vdmVjdG9yL3NjYWxlXCI7XHJcblxyXG5cclxuZnVuY3Rpb24gc2NhbGVTaGFwZXMoXHJcbiAgICAgICAgc2NhbGVGYWN0b3I6IG51bWJlcixcclxuICAgICAgICBzaGFwZXM6IFNoYXBlW10pIHtcclxuXHJcbiAgICByZXR1cm4gc2hhcGVzLm1hcChzaGFwZSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLi4uc2hhcGUsXHJcbiAgICAgICAgICAgIHBzOiBzaGFwZS5wcy5tYXAoc2NhbGVWZWN0b3Ioc2NhbGVGYWN0b3IpKVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgc2NhbGVTaGFwZXMgfVxyXG4iLCJpbXBvcnQgeyBUcmFuc2Zvcm1Qb2ludCB9IGZyb20gXCIuLi90eXBlcy90cmFuc2Zvcm0tcG9pbnRcIjtcclxuaW1wb3J0IHsgc2NhbGVWZWN0b3IgfSBmcm9tIFwiLi4vdmVjdG9yL3NjYWxlXCI7XHJcblxyXG5cclxuZnVuY3Rpb24gc2NhbGVUcmFuc2Zvcm1Qb2ludHNNYXBzKFxyXG4gICAgICAgIHNoYXBlU2l6ZTogbnVtYmVyLFxyXG4gICAgICAgIHRyYW5zZm9ybVBvaW50c01hcHM6IE1hcDxzdHJpbmcsIFRyYW5zZm9ybVBvaW50PltdKSB7XHJcblxyXG4gICAgY29uc3QgbWFwczogTWFwPHN0cmluZywgVHJhbnNmb3JtUG9pbnQ+W10gPSBbXTtcclxuICAgIGZvciAoY29uc3QgbSBvZiB0cmFuc2Zvcm1Qb2ludHNNYXBzKSB7XHJcbiAgICAgICAgY29uc3QgbWFwOiBNYXA8c3RyaW5nLCBUcmFuc2Zvcm1Qb2ludD4gPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBbayxwdF0gb2YgbSkge1xyXG4gICAgICAgICAgICBtYXAuc2V0KGssIHtcclxuICAgICAgICAgICAgICAgIC4uLnB0LFxyXG4gICAgICAgICAgICAgICAgdjogc2NhbGVWZWN0b3Ioc2hhcGVTaXplKShwdC52KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFwcy5wdXNoKG1hcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcHM7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBzY2FsZVRyYW5zZm9ybVBvaW50c01hcHMgfVxyXG4iLCJpbXBvcnQgeyBBbnR3ZXJwRGF0YSB9IGZyb20gJy4uL3R5cGVzL2FudHdlcnAtZGF0YSc7XG5pbXBvcnQgeyBBbnR3ZXJwT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL2FudHdlcnAtb3B0aW9ucyc7XG5pbXBvcnQgeyB0b0VudGl0aWVzIH0gZnJvbSAnLi4vdG8tZW50aXRpZXMnO1xuaW1wb3J0IHsgYXBwbHlUcmFuc2Zvcm0gfSBmcm9tICcuL2FwcGx5LXRyYW5zZm9ybSc7XG5pbXBvcnQgeyBnZXRUcmFuc2Zvcm1Qb2ludHMgfSBmcm9tICcuLi9zaGFwZXMvZ2V0LXRyYW5zZm9ybS1wb2ludHMnO1xuaW1wb3J0IHsgZ2V0U2VlZFNoYXBlcyB9IGZyb20gJy4vZ2V0LXNlZWQtc2hhcGVzJztcbmltcG9ydCB7IFRyYW5zZm9ybVBvaW50IH0gZnJvbSAnLi4vdHlwZXMvdHJhbnNmb3JtLXBvaW50JztcbmltcG9ydCB7IHNjYWxlVHJhbnNmb3JtUG9pbnRzTWFwcyB9IGZyb20gJy4vc2NhbGUtdHJhbnNmb3JtLXBvaW50cy1tYXAnO1xuaW1wb3J0IHsgc2NhbGVTaGFwZXMgfSBmcm9tICcuL3NjYWxlLXNoYXBlcyc7XG5pbXBvcnQgeyBERUdfMTgwIH0gZnJvbSAnLi9kZWdzJztcbmltcG9ydCB7IGNyZWF0ZUJ1Y2tldHMgfSBmcm9tICcuLi9oYXNoL2NlYXRlLWJ1Y2tldHMnO1xuaW1wb3J0IHsgZ2V0TmV3U2hhcGVzIH0gZnJvbSAnLi4vc2hhcGVzL2dldC1uZXctc2hhcGVzJztcblxuXG5mdW5jdGlvbiB0b1NoYXBlcyhwcm9wczogQW50d2VycE9wdGlvbnMpIHtcbiAgICAvLyBjb2xkIHJ1blxuICAgIGxldCB0OiBBbnR3ZXJwRGF0YTtcbiAgICBmb3IgKGxldCBpaT0wOyBpaTwyOyBpaSsrKSB7XG4gICAgICAgIHQgPSB0b1NoYXBlc1QocHJvcHMpO1xuICAgIH1cblxuICAgIC8vIC8vIGhvdCBydW5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBmb3IgKGxldCBpaT0wOyBpaTwxMDsgaWkrKykge1xuICAgICAgICB0ID0gdG9TaGFwZXNUKHByb3BzKVxuICAgIH1cbiAgICAvLyBjb25zdCB0ID0gdG9TaGFwZXNUKHByb3BzKTtcbiAgICBjb25zdCBlbmRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgY29uc29sZS5sb2coKChlbmRUaW1lIC0gc3RhcnRUaW1lKSkudG9GaXhlZCgwKSArICcgbXMnKVxuXG4gICAgcmV0dXJuIHQhO1xufVxuXG5cbmZ1bmN0aW9uIHRvU2hhcGVzVChwcm9wczogQW50d2VycE9wdGlvbnMpOiBBbnR3ZXJwRGF0YSB7XG5cbiAgICBjb25zdCB7IGNvbmZpZ3VyYXRpb24sIG1heFJlcGVhdCwgc2hhcGVTaXplIH0gPSBwcm9wcztcbiAgICBjb25zdCB7IHRyYW5zZm9ybXMgfSA9IHRvRW50aXRpZXMoY29uZmlndXJhdGlvbik7XG5cbiAgICBsZXQgeyBzaGFwZXMsIHN0YWdlUGxhY2VtZW50IH0gPSBnZXRTZWVkU2hhcGVzKGNvbmZpZ3VyYXRpb24pO1xuXG4gICAgY29uc3Qgc2hhcGVTZXQgPSBjcmVhdGVCdWNrZXRzKG1heFJlcGVhdCk7XG4gICAgZ2V0TmV3U2hhcGVzKHNoYXBlU2V0LCBzaGFwZXMsIG1heFJlcGVhdCk7XG4gICAgY29uc3QgdHJhbnNmb3JtUG9pbnRzTWFwczogTWFwPHN0cmluZywgVHJhbnNmb3JtUG9pbnQ+W10gPSBbXTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJlcGVhdGluZyB0aGUgVHJhbnNmb3JtYXRpb25zXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGV0IHN0YWdlID0gMDtcbiAgICBsZXQgdHJhbnNmb3JtUG9pbnRzOiBNYXA8c3RyaW5nLCBUcmFuc2Zvcm1Qb2ludD4gPSBuZXcgTWFwKCk7XG4gICAgbGV0IG5ld1NoYXBlc0dyb3cgPSBbLi4uc2hhcGVzXTtcbiAgICBsZXQgbmV3U2hhcGVzRmlsbCA9IFsuLi5zaGFwZXNdO1xuICAgIGxldCBwcmV2V2FzRmlsbCA9IHRydWU7XG4gICAgbGV0IHByZXZXYXNHcm93ID0gdHJ1ZTtcbiAgICBmb3IgKGxldCBpPTA7IGk8bWF4UmVwZWF0OyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPHRyYW5zZm9ybXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm1zW2pdXG4gICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVBvaW50cyA9IGdldFRyYW5zZm9ybVBvaW50cyhzaGFwZXMpO1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVBvaW50c01hcHMucHVzaCh0cmFuc2Zvcm1Qb2ludHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1Qb2ludHMgPSB0cmFuc2Zvcm1Qb2ludHNNYXBzW2pdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpc0dyb3cgPSAhIXRyYW5zZm9ybS5wb2ludEluZGV4IHx8IHRyYW5zZm9ybS5hbmdsZSA9PT0gREVHXzE4MDtcblxuICAgICAgICAgICAgaWYgKCFwcmV2V2FzRmlsbCAmJiAhaXNHcm93KSB7IG5ld1NoYXBlc0ZpbGwubGVuZ3RoID0gMDsgfVxuICAgICAgICAgICAgaWYgKCFwcmV2V2FzR3JvdyAmJiBpc0dyb3cpIHsgbmV3U2hhcGVzR3Jvdy5sZW5ndGggPSAwOyB9XG5cbiAgICAgICAgICAgIHByZXZXYXNGaWxsID0gIWlzR3JvdztcbiAgICAgICAgICAgIHByZXZXYXNHcm93ID0gaXNHcm93O1xuXG4gICAgICAgICAgICBhcHBseVRyYW5zZm9ybShcbiAgICAgICAgICAgICAgICBzaGFwZVNldCwgbmV3U2hhcGVzR3JvdywgbmV3U2hhcGVzRmlsbCxcbiAgICAgICAgICAgICAgICBzaGFwZXMsIHRyYW5zZm9ybVBvaW50cywgdHJhbnNmb3JtLCBtYXhSZXBlYXRcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHN0YWdlKys7XG4gICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8c2hhcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2hhcGVzW2ldLnN0YWdlID0gc3RhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBjb25zb2xlLmxvZyhzaGFwZXMubGVuZ3RoKVxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIHJldHVybiB7XG4gICAgICAgIHNoYXBlczogc2NhbGVTaGFwZXMoc2hhcGVTaXplLzIsIHNoYXBlcyksXG4gICAgICAgIHN0YWdlLCBzdGFnZVBsYWNlbWVudCxcbiAgICAgICAgdHJhbnNmb3JtUG9pbnRzTWFwczogc2NhbGVUcmFuc2Zvcm1Qb2ludHNNYXBzKFxuICAgICAgICAgICAgc2hhcGVTaXplLzIsXG4gICAgICAgICAgICB0cmFuc2Zvcm1Qb2ludHNNYXBzXG4gICAgICAgIClcbiAgICB9O1xufVxuXG5cbmV4cG9ydCB7IHRvU2hhcGVzIH1cbiIsImltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gJy4uL3R5cGVzL3RyYW5zZm9ybSc7XHJcbmltcG9ydCB7IERFR18zNjAsIERFR185MCB9IGZyb20gJy4vZGVncyc7XHJcbmltcG9ydCB7IHJvdGF0ZVNoYXBlcyB9IGZyb20gJy4uL3NoYXBlcy9yb3RhdGUtc2hhcGVzJztcclxuaW1wb3J0IHsgemVyb1ZlY3RvciB9IGZyb20gJy4uL3ZlY3Rvci96ZXJvLXZlY3Rvcic7XHJcbmltcG9ydCB7IFNoYXBlIH0gZnJvbSAnLi4vc2hhcGUvc2hhcGUnO1xyXG5pbXBvcnQgeyBBTkdMRV9QUkVDSVNJT04gfSBmcm9tICcuLi92ZWN0b3IvZ2V0LWFuZ2xlJztcclxuaW1wb3J0IHsgcmVmbGVjdFNoYXBlcyB9IGZyb20gJy4uL3NoYXBlcy9yZWZsZWN0LXNoYXBlcyc7XHJcbmltcG9ydCB7IGdldE5ld1NoYXBlcyB9IGZyb20gJy4uL3NoYXBlcy9nZXQtbmV3LXNoYXBlcyc7XHJcblxyXG5jb25zdCB7IGNvcywgc2luIH0gPSBNYXRoO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHRyYW5zZm9ybVVzaW5nT3JpZ2luKFxyXG4gICAgICAgIHNoYXBlU2V0OiBVaW50MzJBcnJheSxcclxuICAgICAgICBuZXdTaGFwZXNHcm93OiBTaGFwZVtdLFxyXG4gICAgICAgIHRyYW5zZm9ybTogVHJhbnNmb3JtLFxyXG4gICAgICAgIG1heFJlcGVhdDogbnVtYmVyKSB7XHJcblxyXG4gICAgY29uc3QgeyBhbmdsZSwgdHJhbnNmb3JtVHlwZSB9ID0gdHJhbnNmb3JtO1xyXG5cclxuICAgIGxldCByZWxldmFudFNoYXBlcyA9IG5ld1NoYXBlc0dyb3cuc2xpY2UoKTtcclxuICAgIGxldCBhZGRlZFNoYXBlczogU2hhcGVbXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgzrg9YW5nbGUhOyDOuCA8IERFR18zNjAgLSBBTkdMRV9QUkVDSVNJT047IM64ICo9IDIpIHtcclxuICAgICAgICBjb25zdCDOuDIgPSDOuCAtIERFR185MDtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hhcGVzVG9BZGQgPSB0cmFuc2Zvcm1UeXBlID09PSAnbSdcclxuICAgICAgICAgICAgPyByZWZsZWN0U2hhcGVzKFt6ZXJvVmVjdG9yLCBbY29zKM64MiksIHNpbijOuDIpXV0sIHJlbGV2YW50U2hhcGVzKVxyXG4gICAgICAgICAgICA6IHJvdGF0ZVNoYXBlcyjOuCwgemVyb1ZlY3RvciwgcmVsZXZhbnRTaGFwZXMpO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdTaGFwZXMgPSBnZXROZXdTaGFwZXMoc2hhcGVTZXQsIHNoYXBlc1RvQWRkLCBtYXhSZXBlYXQpO1xyXG4gICAgICAgIGFkZGVkU2hhcGVzLnB1c2goLi4ubmV3U2hhcGVzKTtcclxuICAgICAgICByZWxldmFudFNoYXBlcy5wdXNoKC4uLm5ld1NoYXBlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFkZGVkU2hhcGVzO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgdHJhbnNmb3JtVXNpbmdPcmlnaW4gfVxyXG4iLCJpbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tICcuLi90eXBlcy90cmFuc2Zvcm0nO1xyXG5pbXBvcnQgeyBERUdfMTgwIH0gZnJvbSAnLi9kZWdzJztcclxuaW1wb3J0IHsgcm90YXRlU2hhcGVzIH0gZnJvbSAnLi4vc2hhcGVzL3JvdGF0ZS1zaGFwZXMnO1xyXG5pbXBvcnQgeyBhZGRWZWN0b3IgfSBmcm9tICcuLi92ZWN0b3IvYWRkLXZlY3Rvcic7XHJcbmltcG9ydCB7IHN1YnRyYWN0VmVjdG9yIH0gZnJvbSAnLi4vdmVjdG9yL3N1YnRyYWN0LXZlY3Rvcic7XHJcbmltcG9ydCB7IHJlZmxlY3RTaGFwZXMgfSBmcm9tICcuLi9zaGFwZXMvcmVmbGVjdC1zaGFwZXMnO1xyXG5pbXBvcnQgeyBTaGFwZSB9IGZyb20gJy4uL3NoYXBlL3NoYXBlJztcclxuaW1wb3J0IHsgZ2V0QW5nbGUgfSBmcm9tICcuLi92ZWN0b3IvZ2V0LWFuZ2xlJztcclxuaW1wb3J0IHsgVHJhbnNmb3JtUG9pbnQgfSBmcm9tICcuLi90eXBlcy90cmFuc2Zvcm0tcG9pbnQnO1xyXG5pbXBvcnQgeyBnZXROZXdTaGFwZXMgfSBmcm9tICcuLi9zaGFwZXMvZ2V0LW5ldy1zaGFwZXMnO1xyXG5cclxuXHJcbmNvbnN0IHsgUEksIGNvcywgc2luIH0gPSBNYXRoO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHRyYW5zZm9ybVVzaW5nVHJhbnNmb3JtUG9pbnQoXHJcbiAgICAgICAgc2hhcGVTZXQ6IFVpbnQzMkFycmF5LFxyXG4gICAgICAgIG5ld1NoYXBlc0ZpbGw6IFNoYXBlW10sXHJcbiAgICAgICAgdHJhbnNmb3JtOiBUcmFuc2Zvcm0sXHJcbiAgICAgICAgbWF4UmVwZWF0OiBudW1iZXIsXHJcbiAgICAgICAgdHJhbnNmb3JtUG9pbnRzOiBNYXA8c3RyaW5nLCBUcmFuc2Zvcm1Qb2ludD4pIHtcclxuXHJcbiAgICBjb25zdCB7IHBvaW50SW5kZXgsIHRyYW5zZm9ybVR5cGUgfSA9IHRyYW5zZm9ybTtcclxuICAgIGNvbnN0IHRyYW5zZm9ybVBvaW50ID0gdHJhbnNmb3JtUG9pbnRzLmdldChwb2ludEluZGV4KSE7XHJcbiAgICBjb25zdCB7IHYgfSA9IHRyYW5zZm9ybVBvaW50O1xyXG5cclxuICAgIC8vIGh0dHBzOi8vd3d3Lm1kcGkuY29tLzIwNzMtODk5NC8xMy8xMi8yMzc2XHJcbiAgICAvLyBcIldoZW4gc3BlY2lmeWluZyB0aGUgdmVydGV4IG9mIGEgcG9seWdvbuKAmXMgY2VudHJvaWQgKEZpZ3VyZSAxMSkgb3JcclxuICAgIC8vIHZlcnRleCAoRmlndXJlIDEyKSwgdGhlIGFuZ2xlIHRoYXQgaXMgdXNlZCBmb3IgdGhlIHRyYW5zZm9ybWF0aW9uIGlzXHJcbiAgICAvLyBpbmZlcnJlZCBmcm9tIHRoZSBhbmdsZSBvZiB0aGF0IHZlcnRleCByZWxhdGl2ZSB0byB0aGUgY2VudGVyIG9mIHRoZVxyXG4gICAgLy8gY29vcmRpbmF0ZSBzeXN0ZW0uIEhvd2V2ZXIsIHdoZW4gdXNpbmcgdGhlIG1pZHBvaW50IG9mIGEgbGluZSBzZWdtZW50XHJcbiAgICAvLyAodGhlIHBvbHlnb27igJlzIGVkZ2UsIGFzIHNob3duIGluIEZpZ3VyZSAxMCwgcmlnaHQpLCB0aGUgYW5nbGUgZm9yIHRoZVxyXG4gICAgLy8gdHJhbnNmb3JtIGlzIGluZmVycmVkIGZyb20gdGhlIGFuZ2xlIG9mIHRoYXQgZWRnZS4uLlwiXHJcblxyXG4gICAgY29uc3Qgc2hhcGVzVG9BZGQgPSB0cmFuc2Zvcm1UeXBlID09PSAncidcclxuICAgICAgICA/IHJvdGF0ZVNoYXBlcyhERUdfMTgwLCB2LCBuZXdTaGFwZXNGaWxsKVxyXG4gICAgICAgIDogcmVmbGVjdFNoYXBlcyhnZXRNaXJyb3JWZWN0b3JzKHRyYW5zZm9ybVBvaW50KSwgbmV3U2hhcGVzRmlsbCk7XHJcblxyXG4gICAgcmV0dXJuIGdldE5ld1NoYXBlcyhzaGFwZVNldCwgc2hhcGVzVG9BZGQsIG1heFJlcGVhdCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRNaXJyb3JWZWN0b3JzKFxyXG4gICAgICAgIHRyYW5zZm9ybVBvaW50OiBUcmFuc2Zvcm1Qb2ludCkge1xyXG5cclxuICAgIGNvbnN0IHsgcG9pbnRUeXBlLCB2LCB2cyB9ID0gdHJhbnNmb3JtUG9pbnQ7XHJcblxyXG4gICAgY29uc3QgzrggPSBwb2ludFR5cGUgPT09ICdoJ1xyXG4gICAgICAgID8gZ2V0QW5nbGUoc3VidHJhY3RWZWN0b3IodnMhWzFdLHZzIVswXSkpXHJcbiAgICAgICAgOiBnZXRBbmdsZSh2KSAtIFBJLzI7XHJcblxyXG4gICAgY29uc3QgzrgyID0gzrggLSBERUdfMTgwO1xyXG4gICAgY29uc3QgdjEgPSBhZGRWZWN0b3IodiwgW2NvcyjOuDIpLCBzaW4ozrgyKV0pO1xyXG4gICAgY29uc3QgdjIgPSBhZGRWZWN0b3IodiwgW2NvcyjOuCksIHNpbijOuCldKTtcclxuXHJcbiAgICByZXR1cm4gW3YxLHYyXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IHRyYW5zZm9ybVVzaW5nVHJhbnNmb3JtUG9pbnQgfVxyXG4iLCJcclxuZnVuY3Rpb24gYWRkVmVjdG9yKHYxOiBudW1iZXJbXSwgdjI6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICB2MVswXSArIHYyWzBdLFxyXG4gICAgICAgIHYxWzFdICsgdjJbMV1cclxuICAgIF07XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBhZGRWZWN0b3IgfVxyXG4iLCJcclxuY29uc3QgeyBQSSwgYWJzLCBoeXBvdCwgc2luLCBjb3MgfSA9IE1hdGg7XHJcblxyXG5cclxuY29uc3QgQU5HTEVfUFJFQ0lTSU9OID0gMioqLTEwO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGFuZ2xlRXF1YWxzKM64YTogbnVtYmVyLCDOuGI6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgbGV0IGQgPSBhYnMozrhhIC0gzrhiKTtcclxuICAgIGQgPSBkIDwgUEkgPyBkIDogYWJzKDIqUEkgLSBkKTtcclxuXHJcbiAgICByZXR1cm4gZCA8PSBBTkdMRV9QUkVDSVNJT047XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBhbmdsZUVxdWFscyB9XHJcbiIsIlxyXG5pbXBvcnQgeyB6ZXJvVmVjdG9yIH0gZnJvbSAnLi96ZXJvLXZlY3Rvcic7XHJcblxyXG5jb25zdCB7IGh5cG90IH0gPSBNYXRoO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRpc3RhbmNlQmV0d2VlbihcclxuICAgICAgICB2MTogbnVtYmVyW10sXHJcbiAgICAgICAgdjIgPSB6ZXJvVmVjdG9yKTogbnVtYmVyIHtcclxuXHJcbiAgICByZXR1cm4gaHlwb3QodjFbMF0gLSB2MlswXSwgdjFbMV0gLSB2MlsxXSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgeyBkaXN0YW5jZUJldHdlZW4gfVxyXG4iLCJcclxuY29uc3QgeyBQSSwgYXRhbjIgfSA9IE1hdGg7XHJcblxyXG5cclxuY29uc3QgQU5HTEVfUFJFQ0lTSU9OID0gMioqLTEwO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEFuZ2xlQ2xvY2t3aXNlRnJvbVlBeGlzKHY6IG51bWJlcltdKSB7XHJcbiAgICBjb25zdCBbeCx5XSA9IHY7XHJcbiAgICBjb25zdCDOuCA9ICgyKlBJKSAtIChhdGFuMih5LHgpIC0gUEkvMiArIDIqUEkpJSgyKlBJKTtcclxuXHJcbiAgICByZXR1cm4gzrg7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRBbmdsZUFudGlDbG9ja3dpc2VGcm9tWUF4aXModjogbnVtYmVyW10pIHtcclxuICAgIGNvbnN0IFt4LHldID0gdjtcclxuICAgIGNvbnN0IM64ID0gKGF0YW4yKHkseCkgLSBQSS8yICsgMipQSSklKDIqUEkpO1xyXG5cclxuICAgIHJldHVybiDOuDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEFuZ2xlKHY6IG51bWJlcltdKSB7XHJcbiAgICBjb25zdCBbeCx5XSA9IHY7XHJcbiAgICBjb25zdCDOuCA9IChhdGFuMih5LHgpICsgMipQSSklKDIqUEkpO1xyXG5cclxuICAgIHJldHVybiDOuDtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBBTkdMRV9QUkVDSVNJT04sXHJcbiAgICBnZXRBbmdsZSxcclxuICAgIGdldEFuZ2xlQ2xvY2t3aXNlRnJvbVlBeGlzLCBnZXRBbmdsZUFudGlDbG9ja3dpc2VGcm9tWUF4aXNcclxufVxyXG4iLCJcclxuZnVuY3Rpb24gcmVmbGVjdFZlY3RvcihcclxuICAgICAgICBlZGdlOiBudW1iZXJbXVtdLFxyXG4gICAgICAgIHY6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG5cclxuICAgIGNvbnN0IGUwID0gZWRnZVswXTtcclxuICAgIGNvbnN0IGUxID0gZWRnZVsxXTtcclxuICAgIGNvbnN0IHgxID0gZTBbMF07XHJcbiAgICBjb25zdCB5MSA9IGUwWzFdO1xyXG4gICAgY29uc3QgeDIgPSBlMVswXTtcclxuICAgIGNvbnN0IHkyID0gZTFbMV07XHJcblxyXG4gICAgY29uc3QgeCA9IHZbMF07XHJcbiAgICBjb25zdCB5ID0gdlsxXTtcclxuXHJcbiAgICBjb25zdCBkeCA9IHgyIC0geDE7XHJcbiAgICBjb25zdCBkeSA9IHkyIC0geTE7XHJcbiAgICBjb25zdCBhID0gKGR4KmR4IC0gZHkqZHkpLyhkeCpkeCArIGR5KmR5KTtcclxuICAgIGNvbnN0IGIgPSAyKmR4KmR5LyhkeCpkeCArIGR5KmR5KTtcclxuXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIGEqKHggLSB4MSkgKyBiKih5IC0geTEpICsgeDEsXHJcbiAgICAgICAgYiooeCAtIHgxKSAtIGEqKHkgLSB5MSkgKyB5MVxyXG4gICAgXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IHJlZmxlY3RWZWN0b3IgfVxyXG4iLCJpbXBvcnQgeyB6ZXJvVmVjdG9yIH0gZnJvbSBcIi4vemVyby12ZWN0b3JcIjtcclxuXHJcbmNvbnN0IHsgUEksIFNRUlQxXzIsIHNpbiwgY29zIH0gPSBNYXRoO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSByZXN1bHQgb2Ygcm90YXRpbmcgYSB2ZWN0b3IgYXJvdW5kIGEgc3BlY2lmaWVkIHBvaW50LlxyXG4gKiBcclxuICogQHBhcmFtIM64IGFuZ2xlXHJcbiAqIEBwYXJhbSBjIGNlbnRlciBvZiByb3RhdGlvblxyXG4gKi9cclxuY29uc3QgU1FSVDNfMiA9IE1hdGguc3FydCgzKS8yO1xyXG5jb25zdCBhY2N1cmF0ZUNvc1NpbiA9IHtcclxuICAgIFtQSV06IFstMSwwXSxcclxuICAgIFstUEldOiBbLTEsMF0sXHJcbiAgICBbUEkvMl06IFswLDFdLFxyXG4gICAgWy1QSS8yXTogWzAsLTFdLFxyXG4gICAgW1BJLzNdOiBbMC41LFNRUlQzXzJdLFxyXG4gICAgWy1QSS8zXTogWzAuNSwtU1FSVDNfMl0sXHJcbiAgICBbUEkvNF06IFtTUVJUMV8yLFNRUlQxXzJdLFxyXG4gICAgWy1QSS80XTogW1NRUlQxXzIsLVNRUlQxXzJdLFxyXG4gICAgW1BJLzZdOiBbU1FSVDNfMiwwLjVdLFxyXG4gICAgWy1QSS82XTogW1NRUlQzXzIsLTAuNV0sXHJcblxyXG4gICAgWzIqKFBJLzMpXTogWy0wLjUsU1FSVDNfMl0sXHJcbiAgICBbLTIqKFBJLzMpXTogWy0wLjUsLVNRUlQzXzJdLFxyXG4gICAgWzUqKFBJLzQpXTogWy1TUVJUMV8yLFNRUlQzXzJdLFxyXG4gICAgWy01KihQSS80KV06IFstU1FSVDFfMiwtU1FSVDFfMl0sXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByb3RhdGVWZWN0b3JBcm91bmQoXHJcbiAgICAgICAgzrg6IG51bWJlcixcclxuICAgICAgICBjID0gemVyb1ZlY3RvcixcclxuICAgICAgICB2OiBudW1iZXJbXSkge1xyXG5cclxuICAgIGNvbnN0IHggPSB2WzBdO1xyXG4gICAgY29uc3QgeSA9IHZbMV07XHJcblxyXG4gICAgaWYgKM64LygyKlBJKSUxID09PSAwKSB7IHJldHVybiB2OyB9XHJcbiAgICBcclxuICAgIGNvbnN0IFtjb3POuCxzaW7OuF0gPSBhY2N1cmF0ZUNvc1NpblvOuF0gfHwgW2NvcyjOuCksc2luKM64KV07XHJcblxyXG4gICAgY29uc3QgW2N4LGN5XSA9IGM7XHJcbiAgICBjb25zdCB2eCA9IHggLSBjeDtcclxuICAgIGNvbnN0IHZ5ID0geSAtIGN5O1xyXG5cclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgY29zzrgqdnggLSBzaW7OuCp2eSArIGN4LFxyXG4gICAgICAgIGNvc864KnZ5ICsgc2luzrgqdnggKyBjeVxyXG4gICAgXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IHJvdGF0ZVZlY3RvckFyb3VuZCB9XHJcblxyXG5cclxuLy8gcm90YXRpb24gbWF0cml4OiBbW2NvcywgLXNpbl0sIFtzaW4sY29zXV1cclxuLy8gY29uc3QgYSA9IC0zKlBJLzQ7XHJcbi8vIGNvcyhhKTsvLz9cclxuLy8gc2luKGEpOy8vPyIsIlxyXG5mdW5jdGlvbiBzY2FsZVZlY3RvcihzOiBudW1iZXIpIHtcclxuICAgIHJldHVybiAodjogbnVtYmVyW10pID0+IHtcclxuICAgICAgICByZXR1cm4gW3MqdlswXSxzKnZbMV1dO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IHsgc2NhbGVWZWN0b3IgfVxyXG4iLCJcclxuLyoqXHJcbiAqIFJldHVybnMgYHYxIC0gdjJgLlxyXG4gKi9cclxuZnVuY3Rpb24gc3VidHJhY3RWZWN0b3IodjE6IG51bWJlcltdLCB2MjogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIHYxWzBdIC0gdjJbMF0sXHJcbiAgICAgICAgdjFbMV0gLSB2MlsxXVxyXG4gICAgXTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IHN1YnRyYWN0VmVjdG9yIH1cclxuIiwiXHJcbmZ1bmN0aW9uIHRyYW5zbGF0ZVZlY3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIF90cmFuc2xhdGVWZWN0b3IodjogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgdlswXSArIHgsXHJcbiAgICAgICAgICAgIHZbMV0gKyB5XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IHRyYW5zbGF0ZVZlY3RvciB9XHJcbiIsIlxyXG5jb25zdCB6ZXJvVmVjdG9yOiBudW1iZXJbXSA9IFswLDBdO1xyXG5cclxuXHJcbmV4cG9ydCB7IHplcm9WZWN0b3IgfVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIlxyXG5pbXBvcnQgeyB0b1NoYXBlcyB9IGZyb20gJy4vdG8tc2hhcGVzL3RvLXNoYXBlcyc7XHJcbmltcG9ydCB7IFNoYXBlIH0gZnJvbSAnLi9zaGFwZS9zaGFwZSc7XHJcbmltcG9ydCB7IEFudHdlcnBEYXRhIH0gZnJvbSAnLi90eXBlcy9hbnR3ZXJwLWRhdGEnO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tICcuL3R5cGVzL3RyYW5zZm9ybSc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybVBvaW50IH0gZnJvbSAnLi90eXBlcy90cmFuc2Zvcm0tcG9pbnQnO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm1UeXBlIH0gZnJvbSAnLi90eXBlcy90cmFuc2Zvcm0tdHlwZSc7XHJcbmltcG9ydCB7IEFudHdlcnBPcHRpb25zIH0gZnJvbSAnLi90eXBlcy9hbnR3ZXJwLW9wdGlvbnMnO1xyXG5cclxuXHJcbmV4cG9ydCB7XHJcbiAgICB0b1NoYXBlcyxcclxuICAgIFNoYXBlLFxyXG4gICAgQW50d2VycERhdGEsXHJcbiAgICBUcmFuc2Zvcm0sXHJcbiAgICBUcmFuc2Zvcm1Qb2ludCxcclxuICAgIFRyYW5zZm9ybVR5cGUsXHJcbiAgICBBbnR3ZXJwT3B0aW9uc1xyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==