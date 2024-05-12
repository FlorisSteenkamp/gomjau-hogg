import { TransformPoint } from "../types/transform-point.js";
import { scaleVector } from "../vector/scale.js";


function scaleTransformPointsMaps(
        shapeSize: number,
        transformPointsMaps: Map<string, TransformPoint>[]) {

    const maps: Map<string, TransformPoint>[] = [];
    for (const m of transformPointsMaps) {
        const map: Map<string, TransformPoint> = new Map();
        for (const [k,pt] of m) {
            map.set(k, {
                ...pt,
                v: scaleVector(shapeSize)(pt.v)
            });
        }
        maps.push(map);
    }

    return maps;
}


export { scaleTransformPointsMaps }
