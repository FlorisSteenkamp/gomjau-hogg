import { AntwerpData } from '../../../src/types/antwerp-data.js';
import { colorDarkShade1 } from '../preshape/colors.js';
import { getShapeFill } from './get-shape-fill.js';
import { DrawOptions } from './draw-options.js';
import { TransformPoint } from '../../../src/types/transform-point.js';
import { Shape } from '../../../src/shape/shape.js';
import { fromCentroidAndAngle } from '../../../src/shape/from-centroid-and-angle.js';
import { drawShape } from './draw-shape.js';
import { drawTransformPoints } from './draw-transform-points.js';
import { seedShapes } from '../../../src/to-shapes/get-seed-shape.js';
import { ShapeType } from '../../../src/types/shape-type.js';
import { zeroVector } from '../../../src/vector/zero-vector.js';
import { rotateVectorAround } from '../../../src/vector/rotate-vector-around.js';
import { scaleVector } from '../../../src/vector/scale.js';
import { addVector } from '../../../src/vector/add-vector.js';
import { drawOrigin } from './draw-origin.js';
import { drawHull } from './draw-hull.js';

const ns = 'http://www.w3.org/2000/svg';


function drawShapes(
        svg: SVGSVGElement,
        data: AntwerpData,
        opts: DrawOptions,
        showTransforms: boolean,
        showVertices: boolean,
        shapeSize: number) {

    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }

    const { shapes, transformPointsMaps, hulls } = data;

    for (const shape of shapes) {
        drawShape(data, opts, shape, shapeSize, svg);
    }
    for (const shape of shapes) {
        // drawOrientation(data, shape, shapeSize, svg);
    }
    

    const transformPointss = transformPointsMaps.map(m => Array.from(m.values()));
    const ii = 1;
    if (showVertices && transformPointss[ii]) {
        drawTransformPoints(transformPointss[ii], svg)
    }

    drawOrigin(svg);

    drawHull(hulls[hulls.length-1], shapeSize, svg);
}


function drawOrientation(
        data: AntwerpData,
        shape: Shape,
        shapeSize: number,
        svg: SVGSVGElement) {

    const { c, θm, sides } = shape;

    const ps = arrowFromCentroidAndAngle(c,θm,sides);

    const points = ps
        .map(p => [p[0], -p[1]])
        .flat()
        .map(c => c.toString())
        .join(' ');

    const poly = document.createElementNS(ns, 'polygon');
    poly.setAttributeNS(null, 'points', points);
    // poly.setAttributeNS(null, 'fill',  getShapeFill(shape, data, opts));
    poly.setAttributeNS(null, 'stroke', colorDarkShade1);
    svg.appendChild(poly);
}


function arrowFromCentroidAndAngle(
    c: number[],
    θm: number,
    sides: ShapeType): number[][] {

    let { θm: sθm } = seedShapes[sides];
    sθm += 
          sides === 3
        ? -4
        : sides === 4
        ? 12
        : sides === 6
        ? -2
        : sides === 12
        ? 12
        : 0;

    const ps = [[-0.5,0],[0.5,0],[0,-2]];

    let ps_ = ps
        .map(p => rotateVectorAround(θm + sθm, zeroVector, p))
        .map(p => scaleVector(10)(p))
        .map(p => addVector(p,c));

    return ps_;
}


export { drawShapes }
