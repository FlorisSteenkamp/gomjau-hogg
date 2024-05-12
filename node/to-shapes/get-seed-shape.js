import { fromSides } from '../shape/from-sides';
import { ErrorSeed } from './errors';
import { rotateShape } from '../shape/rotate-shape';
const { sqrt } = Math;
const SQRT3 = sqrt(3);
const seedShapes = {
    3: { ps: rotateShape(-2, fromSides(3)), θm: 0 },
    4: { ps: rotateShape(9, fromSides(4)), θm: 0 },
    6: { ps: rotateShape(6, fromSides(6)), θm: -6 },
    8: { ps: rotateShape(7.5, fromSides(8)), θm: 0 },
    12: { ps: rotateShape(7, fromSides(12)), θm: 0 }
};
/**
 * Returns a seed shape based on the given number of sides.
 *
 * * the side length of the returned shapes === 1
 */
function getSeedShape(sides) {
    if (sides !== 3 && sides !== 4 && sides !== 6 && sides !== 8 && sides !== 12) {
        throw ErrorSeed();
    }
    return {
        sides,
        // c: sides === 3 ? [0.5, SQRT3/2] : [0,0],
        c: sides === 3 ? [SQRT3 / 6, 0.5] : [0, 0],
        θm: sides === 3 ? 2 : sides === 6 ? -6 : 0,
        stage: 0,
        stagePlacement: 1
    };
}
export { getSeedShape, seedShapes };
//# sourceMappingURL=get-seed-shape.js.map