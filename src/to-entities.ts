import { TransformType } from './types/transform-type';
import { Entities } from './types/entities';
import { Transform } from './types/transform';


function to15DegIntervals(s: '30'|'45'|'60'|'90'|'180'): 2|3|4|6|12 {
    switch (s) {
        case '30': return 2;
        case '45': return 3;
        case '60': return 4;
        case '90': return 6;
        case '180': return 12;
    }
}


function toEntities(configuration: string): Entities {
    // E.g: '3-4-3,3/m30/m(4)'
    // E.g: '3-4-3,3/m30/m(h2)'
    const [shapes, ...transformsStr] =
        configuration.split('/');

    // shapes === '3-4-3,3'
    // transforms === ['m30','m(4)']

    const shapes_ =
        shapes
        .split('-')
        .map(group => group
            .split(',')
            .map(shape => Number.parseInt(shape)));

    // shapes_ === [[3],[4],[3,3]]

    ensureShapeGroupsCorrect(configuration, shapes_);

    const [[seedShapeType], ...shapeGroups] = shapes_;

    // shapeSeed === 3
    // shapeGroups === [[4],[3,3]]

    const transforms = transformsStr
        .map(toTransform)
        .filter(Boolean);

    // transformEntities === [{
    //     action: "m",
    //     actionAngle: 0.5235987755982988,
    //     pointIndex: 0,
    //     string: "m30"
    // }, {
    //     action: "m",
    //     pointIndex: 4,
    //     point: {
    //         "v": { "x": -5.684341886080802e-14, "y": -89.59244838580928 },
    //         "θ": 0,
    //         "pt": "l"
    //     },
    //     string: "m(4)",
    // }]

    return { seedShapeType, shapeGroups, transforms } as Entities;
}


/**
 * Returns a `Transform` given a string (e.g. 'm45' or 'r(h1)')
 * @param transform 
 * @returns 
 */
function toTransform(
        transform: string): Transform | undefined {

    const match = /([mr])([\d.]*)?\(?([cvh\d]+)?\)?/i.exec(transform);

    // E.g. 'm'
    // E.g. 'm45'
    // E.g. 'r(v15)'

    if (match) {
        const [
            ,
            transformType,
            angleStr = '180',
            pointIndex,
        ] = match as unknown as [
            string,
            TransformType,       // 'm'|'r'
            string | undefined,  // angle (defaults to 180)
            string | undefined   // e.g. 'v1', 'h21', 'c3', etc.
        ];

        if (angleStr !== '30' && angleStr !== '45' && angleStr !== '60' &&
            angleStr !== '90' && angleStr !== '180') {

            throw new Error(`Angle must be 30,45,60,90 or 180 degrees, but found ${angleStr}`);
        }

        return {
            transformType,
            angle: pointIndex ? undefined : to15DegIntervals(angleStr),
            origin: undefined,
            pointIndex: pointIndex ? pointIndex : '',
            string: transform,
        };
    }
}


function ensureShapeGroupsCorrect(
        configuration: string,
        shapeGroups: number[][]) {

    for (const shapeGroup of shapeGroups) {
        for (const shape of shapeGroup) {
            if (shape !== 0 &&
                shape !== 3 && shape !== 4 && shape !== 6 &&
                shape !== 8 && shape !== 12) {
        
                throw new Error(`Shape must be 0,3,4,6,8 or 12, but found ${shape} - ${configuration}`);
            }
        }
    }
}


export { toEntities }
