import { zeroVector } from "../vector/zero-vector";
import { rotateVectorAround } from "../vector/rotate-vector-around";


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
