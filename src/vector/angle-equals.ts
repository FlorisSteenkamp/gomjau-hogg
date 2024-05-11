
const { PI, abs } = Math;


const ANGLE_PRECISION = 2**-10;


function angleEquals(θa: number, θb: number): boolean {
    let d = abs(θa - θb);
    d = d < PI ? d : abs(2*PI - d);

    return d <= ANGLE_PRECISION;
}


export { angleEquals }
