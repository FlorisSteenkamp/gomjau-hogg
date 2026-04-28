import { fromCentroidAndAngle } from "../../../src/shape/from-centroid-and-angle";
import { Shape } from "../../../src/shape/shape";
import { AntwerpData } from "../../../src/types/antwerp-data";
import { DrawOptions } from "./draw-options";
import { getShapeFill } from "./get-shape-fill";
import { colorDarkShade1 } from '../preshape/colors.js';

const ns = 'http://www.w3.org/2000/svg';


function drawShape(
        data: AntwerpData,
        opts: DrawOptions,
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


export { drawShape }
