import { toEntities } from '../to-entities.js';
import { Shape } from '../shape/shape.js';
import { getSeedShape } from './get-seed-shape.js';
import { fromLineSegment } from '../shape/from-line-segment.js';
import { getTransformPointBuckets } from '../hash/get-transform-point-buckets.js';
import { getCentroid } from '../shape/get-centroid.js';
import { getShapeEdges } from '../shape/get-shape-edges.js';
import { fromCentroidAndAngle } from '../shape/from-centroid-and-angle.js';
import { comparePoints } from '../shapes/compare-points.js';

const { abs, max } = Math;
const TOL = 2**-10;

// E.g. 12-4,6-3
// -------------
// 1. Place seed shape (12)
// 2. Shape groups === 4,6-3
// 3. Place 4 on first open polygon edge
// 4. Place 6 on next polygon edge (of same shape)
// 5. Place 3 on first open polygon edge of polygons in previous phase


function getSeedShapes(
        configuration: string) {

    const { seedShapeType, shapeGroups } = toEntities(configuration);

    const seedShape = getSeedShape(seedShapeType);

    let shapes = [seedShape];

    let stagePlacement = 1;

    /** Map from line segment hash to number of line segments added */
    const connections = new Map<number,number>();
    addConnections(connections, seedShape);

    let prevShapes = [seedShape];
    for (const shapeGroup of shapeGroups) {
        const shapesEdges = prevShapes
            .map(s => {
                const { c, θm, sides } = s;
                const ps = fromCentroidAndAngle(c, θm, sides, 1);

                return getShapeEdges(ps);
            })
            .flat()
            .sort((a,b) => {
                if (abs(a[0][0]) < TOL && abs(a[1][0]) < TOL) {
                    // vertical line segment passing through origin
                    return 1;
                }
                if (abs(b[0][0]) < TOL && abs(b[1][0]) < TOL) {
                    // vertical line segment passing through origin
                    return -1;
                }
                const ca = getCentroid(a);
                const cb = getCentroid(b);
                return comparePoints(ca,cb);
            });

        prevShapes = [];
        let idx = 0;
        for (let i=0; i<shapesEdges.length; i++) {
            const sides = shapeGroup[idx];

            const ls = shapesEdges[i];
            const n = getNumberOfConnections(connections, ls);
            if (n > 1) { continue; }

            if (sides === 0) { idx++; continue; }

            stagePlacement++;
            const shape = fromLineSegment(sides, ls, stagePlacement);

            shapes.push(shape);
            prevShapes.push(shape);

            addConnections(connections, shape);

            idx++;

            if (idx >= shapeGroup.length) { break; }
        }
    }

    return {
        shapes: [shapes],
        maxStagePlacement: stagePlacement
    };
}


function getNumberOfConnections(
        connections: Map<number,number>,
        ls: number[][]) {

    const edgeHashes = getTransformPointBuckets(getCentroid(ls));

    const hs = edgeHashes
        .map(h => connections.get(h))
        .filter(h => h !== undefined) as number[];

    if (hs.length === 0) { return 0; }

    return max(...hs);
}


function addConnections(
        connections: Map<number,number>,
        shape: Shape) {

    const { c, θm, sides } = shape;
    const ps = fromCentroidAndAngle(c, θm, sides, 1);
    const edges = getShapeEdges(ps);
    const edgeHashess = edges
    .map(ls => getTransformPointBuckets(getCentroid(ls)));

    for (const edgeHashes of edgeHashess) {
        for (const h of edgeHashes) {
            const n = connections.get(h) || 0;
            connections.set(h, n + 1);
        }
    }
}


export { getSeedShapes }
