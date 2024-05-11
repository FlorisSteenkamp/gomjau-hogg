
/**
 * Returns `v1 - v2`.
 */
function subtractVector(v1: number[], v2: number[]): number[] {
    return [
        v1[0] - v2[0],
        v1[1] - v2[1]
    ];
}


export { subtractVector }
