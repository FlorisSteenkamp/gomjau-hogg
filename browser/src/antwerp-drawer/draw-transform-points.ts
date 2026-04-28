import { TransformPoint } from "../../../src/types/transform-point";

const ns = 'http://www.w3.org/2000/svg';


function drawTransformPoints(
        vertices: TransformPoint[],
        svg: SVGSVGElement) {

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


export { drawTransformPoints }
