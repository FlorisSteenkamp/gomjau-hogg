import { TransformPoint } from '../types/transform-point';
import { getCentroid } from '../shape/get-centroid';
import { Shape } from '../shape/shape';
import { getTransformPointBuckets } from '../hash/get-transform-point-buckets';
import { isBucketZero } from '../hash/is-bucket-zero';
import { getShapeEdges } from '../shape/get-shape-edges';
import { fromCentroidAndAngle } from '../shape/from-centroid-and-angle';
import { addVector } from '../vector/add-vector';
import { subtractVector } from '../vector/subtract-vector';
import { comparePoints } from './compare-points';

const { PI, round, atan2 } = Math;


function getTransformPoints(
        shapes: Shape[]): Map<string,TransformPoint> {

    const transformPoints: TransformPoint[] = [];

    // --------------
    // Centroids (c)
    // --------------
    for (let i=0; i<shapes.length; i++) {
        const s = shapes[i];
        const { c, θm, sides } = s;

        const ps = fromCentroidAndAngle(c, θm, sides, 1);
        const v = getCentroid(ps);
        const θ2 = round(2*atan2(v[0],-v[1])/PI*12);

        transformPoints.push({ v, θ2, pointType: 'c', index: 0 });
    }

    // -------------------------------
    // Vertices (v) and Midpoints (h)
    // -------------------------------
    const edges = shapes.map(shape => {
        const { c, θm, sides } = shape;
        const ps = fromCentroidAndAngle(c, θm, sides, 1);
        return getShapeEdges(ps)
    }).flat();
    for (const ls of edges) {
        {
            const v = ls[0];

            const c = subtractVector(addVector(v,[-v[1],v[0]]),v);
            const θ2 = round(atan2(c[1], c[0])/PI*12);

            transformPoints.push({
                v, θ2,
                pointType: 'v',
                index: 0
            });
        }
        {
            const v = getCentroid(ls);
            const c = subtractVector(ls[1],v);
            const θ2 = round(2*atan2(c[1], c[0])/PI*12);

            transformPoints.push({
                v, θ2,
                pointType: 'h',
                index: 0
            });
        }
    }

    let cc = 0;
    let vv = 0
    let hh = 0;
    const transformPoints_ = getUniqueVerticesNotZero(transformPoints)
        .sort((a,b) => comparePoints(a.v,b.v))
        .map(tp => ({
                ...tp,
                index: (tp.pointType === 'c' && ++cc) ||
                       (tp.pointType === 'v' && ++vv) ||
                       (tp.pointType === 'h' && ++hh) || 0,
            })
        );

    const transformPointMap: Map<string,TransformPoint> = new Map(
        transformPoints_
        .map(v => [v.pointType + v.index, v])
    );

    return transformPointMap;
}


function getUniqueVerticesNotZero(
        vertices: TransformPoint[]) {

    const vertexSet: Set<number> = new Set();
    const vertices_: TransformPoint[] = [];
    for (const vertex of vertices) {
        const hashes = getTransformPointBuckets(vertex.v);

        if (isBucketZero(hashes)) {
            continue;  // no origins allowed
        }
        
        let found = false;
        for (let j=0; j<hashes.length; j++) {
            const h = hashes[j];
            if (vertexSet.has(h)) {
                found = true;
                break;
            }
        }
        if (found) { continue; }

        for (const h of hashes) {
            vertexSet.add(h);
        }

        vertices_.push(vertex);
    }

    return vertices_;
}


export { getTransformPoints }
