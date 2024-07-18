import { fromCentroidAndAngle } from "../../../src/shape/from-centroid-and-angle";
import { Shape } from "../../../src/shape/shape";
import { AntwerpData } from "../../../src/types/antwerp-data";
import { DrawOptions } from "./draw-options";
import { getShapeFill } from "./get-shape-fill";
import { colorDarkShade1 } from '../preshape/colors.js';

const ns = 'http://www.w3.org/2000/svg';


function drawOrigin(
        svg: SVGSVGElement) {

    const circle = document.createElementNS(ns, 'circle');

    circle.setAttributeNS(null, 'cx', '0');
    circle.setAttributeNS(null, 'cy', '0');
    circle.setAttributeNS(null, 'r', '3');
    // circle.setAttributeNS(null, 'stroke', '#0a0');
    circle.setAttributeNS(null, 'fill', '#0d0');
    svg.appendChild(circle);
}


export { drawOrigin }
