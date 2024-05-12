import { zeroVector } from "../vector/zero-vector.js";
import { rotateVectorAround } from "../vector/rotate-vector-around.js";


/**
 * 
 * @param θ 
 * @param v 
 * @param shape 
 * @returns 
 */
function rotateShape(
        θm: number,
        ps: number[][]) {

    return ps.map(p => rotateVectorAround(θm, zeroVector,p))
}


export { rotateShape }
