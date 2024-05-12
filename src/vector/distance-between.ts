
import { zeroVector } from './zero-vector.js';

const { hypot } = Math;


function distanceBetween(
        v1: number[],
        v2 = zeroVector): number {

    return hypot(v1[0] - v2[0], v1[1] - v2[1]);
}


export { distanceBetween }
