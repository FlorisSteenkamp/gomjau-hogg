
const { log2, round, abs } = Math;


// Must be smaller than min distance between any two transform points
const BUCKET_SIZE = 2**-4;

/** number of buckets per unit */
const N = log2(1/BUCKET_SIZE);

const MAX_COORD = 2**8;

/** The number of buckets per coordinate */
const NUM_BUCKETS = MAX_COORD*(2**N);

/**
 * Guessed maximum floating point error after all transformations.
 * * A high value was chosen to be sure but it is possible to calculate it
 * exactly though the calculation would be very tedious.
 */
const MAX_ABS_ERROR = 2**-10;

/** Max shift allowed before throwing point into two buckets */
const ALLOWED_SHIFT = BUCKET_SIZE/2 - MAX_ABS_ERROR; 


function getTransformPointBuckets(p: number[]) {
    const [x,y] = p;

    // We pack the buckets into one float by shifting by around 22 bits
    // Note this allows bucket points to be compared easily
    // using the usual ===,>,>= etc. operators
    const xBuckets = getTransformPointCoordinateBuckets(x).map(b => b*NUM_BUCKETS*2**2);
    const yBuckets = getTransformPointCoordinateBuckets(y);

    // Pack buckets
    const buckets: number[] = [];
    for (let i=0; i<xBuckets.length; i++) {
        for (let j=0; j<yBuckets.length; j++) {
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
function getTransformPointCoordinateBuckets(v: number): number[] {
    const buckets: number[] = [];

    const b1 = round(v/BUCKET_SIZE)*BUCKET_SIZE;
    buckets.push(b1);  // usually there's only one bucket per coordinate

    const d = abs(v - b1); 

    if (d >= ALLOWED_SHIFT) {  // too close to call - put into two buckets
        const b2 = v > b1
            ? b1 + BUCKET_SIZE   // we rounded down
            : b1 - BUCKET_SIZE;  // we rounded up

        buckets.push(b2);
    }

    return buckets;
}


export { getTransformPointBuckets }
