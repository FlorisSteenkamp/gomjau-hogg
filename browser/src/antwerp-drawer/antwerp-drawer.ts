import { AntwerpData } from '../../../src/types/antwerp-data';
import { colorDarkShade1 } from '../preshape/colors';
import { getShapeFill } from './get-shape-fill';
import { DrawOptions } from './draw-options';
import { TransformPoint } from '../../../src/types/transform-point';
import { Shape } from '../../../src/shape/shape';
import { fromCentroidAndAngle } from '../../../src/shape/from-centroid-and-angle';

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

    const { shapes, transformPointsMaps } = data;

    for (let i=0; i<shapes.length; i++) {
        drawShape(shapes[i], shapeSize, svg);
    }

    const transformPointss = transformPointsMaps.map(m => Array.from(m.values()));
    const ii = 0;
    if (showVertices && transformPointss[ii]) {
        drawTransformPoints(transformPointss[ii])
    }
   
    function drawTransformPoints(
            vertices: TransformPoint[]) {

        for (const vertex of vertices) {
            const { pointType: pt, v: [x,y], index } = vertex;

            const text = document.createElementNS(ns, 'text');
            text.setAttributeNS(null, 'x', x.toString());
            text.setAttributeNS(null, 'y', (-y).toString());
            text.setAttributeNS(null, 'alignment', 'middle');
            text.setAttributeNS(null, 'fill',  'white');
            text.textContent = `${pt}${index}`;
            svg.appendChild(text);
        }
    }


    function drawShape(
            shape: Shape,
            shapeSize: number,
            svg: SVGSVGElement) {

        const { c, θm, sides } = shape;

        const ps = fromCentroidAndAngle(c, θm, sides, shapeSize);

        const points = ps
            .map(p => [p[0], -p[1]])
            .flat()
            .map(c => c.toString())
            .join(' ');

        const poly = document.createElementNS(ns, 'polygon');
        poly.setAttributeNS(null, 'points', points);
        poly.setAttributeNS(null, 'fill',  getShapeFill(shape, data, opts));
        poly.setAttributeNS(null, 'stroke', colorDarkShade1);
        svg.appendChild(poly);
    }
}

export { drawShapes }
