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
export { getCoordinateBuckets };
//# sourceMappingURL=get-coordinate-buckets.js.map