
function scaleVector(s: number) {
    return (v: number[]) => {
        return [s*v[0],s*v[1]];
    }
}


export { scaleVector }
