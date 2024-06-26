import { rotateShapesAround } from '../shapes/rotate-shapes.js';
import { reflectShapes } from '../shapes/reflect-shapes.js';
import { getNewShapes } from '../shapes/get-new-shapes.js';
function transformUsingTransformPoint(buckets, newShapesFill, transform, transformPoints) {
    const { pointIndex, transformType } = transform;
    const transformPoint = transformPoints.get(pointIndex);
    const { v, θ2 } = transformPoint;
    // https://www.mdpi.com/2073-8994/13/12/2376
    // "When specifying the vertex of a polygon’s centroid (Figure 11) or
    // vertex (Figure 12), the angle that is used for the transformation is
    // inferred from the angle of that vertex relative to the center of the
    // coordinate system. However, when using the midpoint of a line segment
    // (the polygon’s edge, as shown in Figure 10, right), the angle for the
    // transform is inferred from the angle of that edge..."
    const shapesToAdd = transformType === 'm'
        ? reflectShapes(θ2, v, newShapesFill)
        : rotateShapesAround(12, v, newShapesFill);
    return getNewShapes(buckets, shapesToAdd);
}
export { transformUsingTransformPoint };
//# sourceMappingURL=transform-using-transform-point.js.map