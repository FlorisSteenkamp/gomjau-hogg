
function getCentroid(ps: number[][]): number[] {
    let totalX = 0;
    let totalY = 0;
    const len = ps.length;
    for (let i=0; i<len; i++) {
        totalX += ps[i][0];
        totalY += ps[i][1];
    }

    return [totalX/len, totalY/len];
}


export { getCentroid }
