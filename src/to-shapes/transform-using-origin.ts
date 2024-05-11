import { Transform } from '../types/transform';
import { rotateShapesAround } from '../shapes/rotate-shapes';
import { zeroVector } from '../vector/zero-vector';
import { Shape } from '../shape/shape';
import { reflectShapes } from '../shapes/reflect-shapes';
import { getNewShapes } from '../shapes/get-new-shapes';

const { round } = Math;


function transformUsingOrigin(
        buckets: [Uint32Array],
        newShapesGrow: Shape[],
        transform: Transform) {

    const { angle, transformType } = transform;

    const relevantShapes = newShapesGrow.slice();
    const addedShapes: Shape[] = [];
    const θm = round(angle!);

    for (let θ=θm; θ<=24; θ*=2) {
        const θ2 = -(θ - 6);

        const shapesToAdd = transformType === 'm'
            ? reflectShapes(2*θ2, zeroVector, relevantShapes)
            : rotateShapesAround(θ, zeroVector, relevantShapes);

        const newShapes = getNewShapes(buckets, shapesToAdd);
        for (const s of newShapes) {
            addedShapes.push(s);
            relevantShapes.push(s);
        };
    }

    return addedShapes;
}


export { transformUsingOrigin }
