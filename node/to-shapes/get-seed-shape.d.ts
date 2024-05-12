import { Shape } from '../shape/shape';
import { ShapeType } from '../types/shape-type';
declare const seedShapes: {
    3: {
        ps: number[][];
        θm: number;
    };
    4: {
        ps: number[][];
        θm: number;
    };
    6: {
        ps: number[][];
        θm: number;
    };
    8: {
        ps: number[][];
        θm: number;
    };
    12: {
        ps: number[][];
        θm: number;
    };
};
/**
 * Returns a seed shape based on the given number of sides.
 *
 * * the side length of the returned shapes === 1
 */
declare function getSeedShape(sides: ShapeType): Shape;
export { getSeedShape, seedShapes };
