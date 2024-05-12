import { scaleVector } from "../vector/scale.js";
function scaleTransformPointsMaps(shapeSize, transformPointsMaps) {
    const maps = [];
    for (const m of transformPointsMaps) {
        const map = new Map();
        for (const [k, pt] of m) {
            map.set(k, {
                ...pt,
                v: scaleVector(shapeSize)(pt.v)
            });
        }
        maps.push(map);
    }
    return maps;
}
export { scaleTransformPointsMaps };
//# sourceMappingURL=scale-transform-points-map.js.map