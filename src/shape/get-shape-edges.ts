import { Shape } from "./shape";


function getShapeEdges(ps: number[][]) {
    return ps.map((p, i) => [p, ps[(i + 1)%ps.length]]);
}


export { getShapeEdges }
