import { addVector } from "../vector/add-vector";
import { distanceBetween } from "../vector/distance-between";
import { subtractVector  } from "../vector/subtract-vector";
import { Shape } from "./shape";
import { getCentroid } from "./get-centroid";
import { ShapeType } from "../types/shape-type";

const { PI, cos, sin, atan2, round } = Math;


function fromLineSegment(
        sides: ShapeType,
        ls: number[][],
        stagePlacement: number): Shape {

    const [v1,v2] = ls;

    const l = distanceBetween(v1,v2);
    const v = subtractVector(v2,v1);
    let θ = atan2(v[1],v[0]) + (2*PI)/sides;

    const ps = [v1,v2];
    
    for (let i=2; i<sides; i++) {
        ps.push(
            addVector([cos(θ)*l, sin(θ)*l],
            ps[i - 1]
        ));

        θ += 2*PI/sides;
    }

    const ps_ = ps.slice(1).reverse();

    const c = getCentroid([ps[0], ...ps_]);

    return {
        stage: 0,
        stagePlacement,
        c,
        θm: round(θ/PI*12),
        sides
    };
}


export { fromLineSegment }
