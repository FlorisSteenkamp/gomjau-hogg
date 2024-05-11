
function areHashesEqual(
        hs1: number[],
        hs2: number[]) {

    if (hs1.length !== hs2.length) { return false; }

    for (let i=0; i<hs1.length; i++) {
        if (hs1[i] !== hs2[i]) { return false; }
    }

    return true;
}


export { areHashesEqual }
