const { PI, SQRT1_2 } = Math;


const SQRT3_2 = Math.sqrt(3)/2;

const accurateCosSin = {
    [0]: [1,0],
    [5*PI/8]: [-0.3826834323650897,0.9238795325112867],  // used in `seedShapes` only
    [7*PI/12]: [-0.25881904510252063,0.9659258262890683],  // used in `seedShapes` only
    [3*PI/4]: [-SQRT1_2,SQRT1_2],
    [PI]: [-1,0],
    [PI/2]: [0,1],
    [-PI/2]: [0,-1],
    [PI/3]: [0.5,SQRT3_2],
    [-PI/3]: [0.5,-SQRT3_2],
    [PI/4]: [SQRT1_2,SQRT1_2],
    [-PI/4]: [SQRT1_2,-SQRT1_2],
    [PI/6]: [SQRT3_2,0.5],
    [-PI/6]: [SQRT3_2,-0.5],

    [2*(PI/3)]: [-0.5,SQRT3_2],
    [-2*(PI/3)]: [-0.5,-SQRT3_2],
    [5*(PI/4)]: [-SQRT1_2,SQRT3_2],
    [-5*(PI/4)]: [-SQRT1_2,-SQRT1_2]
}


export { accurateCosSin }
