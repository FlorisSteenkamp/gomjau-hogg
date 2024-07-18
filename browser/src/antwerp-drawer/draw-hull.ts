
const ns = 'http://www.w3.org/2000/svg';


function drawHull(
        hull: number[][],
        shapeSize: number,
        svg: SVGSVGElement) {

    const points = hull
        .map(p => [shapeSize*p[0], -shapeSize*p[1]])
        .flat()
        .map(c => c.toString())
        .join(' ');

    const poly = document.createElementNS(ns, 'polygon');
    poly.setAttributeNS(null, 'points', points);
    poly.setAttributeNS(null, 'fill',  '#0000');
    poly.setAttributeNS(null, 'stroke', '#d00');
    svg.appendChild(poly);

    for (const p of hull) {
        const circle = document.createElementNS(ns, 'circle');

        circle.setAttributeNS(null, 'cx', (shapeSize*p[0]).toString());
        circle.setAttributeNS(null, 'cy', (shapeSize*-p[1]).toString());
        circle.setAttributeNS(null, 'r', '3');
        // circle.setAttributeNS(null, 'stroke', '#0a0');
        circle.setAttributeNS(null, 'fill', '#0d0');
        svg.appendChild(circle);
    }
}


export { drawHull }
