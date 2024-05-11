
const { sqrt, SQRT2 } = Math;
const SQRT3 = sqrt(3);


/** Side length / circumradius */
const sidelength_div_circumradius: { [k:number]: number } = {
    3:  SQRT3,
    4:  SQRT2,
    6:  1,
    8:  sqrt(2 - SQRT2),
    12: sqrt(2 - SQRT3)
};


export { sidelength_div_circumradius }
