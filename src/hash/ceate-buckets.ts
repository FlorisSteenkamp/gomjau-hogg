
const INITIAL_NUM_BUCKETS_PER_COORD_EXP = 8;
const INITIAL_NUM_BUCKETS_PER_COORD = 2**INITIAL_NUM_BUCKETS_PER_COORD_EXP;


/** Returns an array of 4 buckets ordered by quadrant */
function createBuckets(): [Uint32Array] {
    const arrLen = (INITIAL_NUM_BUCKETS_PER_COORD**2)/32;

    return [new Uint32Array(arrLen)];
}


export { createBuckets }
