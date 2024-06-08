import { Shape } from "../shape/shape.js";
import { getCoordinateBuckets } from "../hash/get-coordinate-buckets.js";

const { abs, max, sign } = Math;


/**
 * 
 * @param buckets Set holding hashes of existing shapes
 * @param shapes new shapes to add
 */
function getNewShapes(
        buckets: [Uint32Array],
        shapes: Shape[]) {

    let buckets_ = buckets[0];
    const shapes_: Shape[] = [];
    for (const shape of shapes) {
        const x = shape.c[0];
        const y = shape.c[1];

        // We pack the buckets into a square around the origin
        const xBuckets = getCoordinateBuckets(x);
        const yBuckets = getCoordinateBuckets(y);

        let found = false;

        for (let i=0; i<xBuckets.length; i++) {
            for (let j=0; j<yBuckets.length; j++) {
                const xBucket = xBuckets[i];
                const yBucket = yBuckets[i];

                const _idx = getIdx(xBucket, yBucket);

                // console.log(x,xBucket)
                // console.log(y,yBucket)

                const idx = 4*_idx + (
                      xBucket >= 0
                    ? yBucket >= 0 ? 0 : 3
                    : yBucket >= 0 ? 1 : 2);

                const bit = idx%32;
                const word = (idx - bit) >> 5;
                const mask = (1 << bit);

                if (word > buckets_.length - 1) {
                    const oldBuffer = buckets_;
                    buckets[0] = new Uint32Array(4*oldBuffer.length);
                    buckets[0].set(oldBuffer);

                    buckets_ = buckets[0];
                } else if ((buckets_[word] & mask) !== 0) {
                    found = true;
                }
                
                buckets_[word] |= mask;
            }
        }

        if (!found) { shapes_.push(shape); }
    }

    return shapes_;
}


function getIdx(x: number, y: number) {
    const x_ = abs(x);
    const y_ = abs(y);

    const a = sign(max(x_ - y_ + 1, 0));  // lower half (including diagonal)
    const b = a*(y_ + x_**2);

    const c = sign(max(y_ - x_, 0));  // upper half
    const d = c*(y_*(y_ + 2) - x_);

    return b + d;
}


export { getNewShapes }


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
