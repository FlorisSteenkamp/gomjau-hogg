import { ShapeType } from "../types/shape-type.js";


interface Shape {
    readonly stage: number;
    readonly stagePlacement: number;

    readonly c: number[];
    /** `=== θ*12/PI` */
    readonly θm: number;
    readonly sides: ShapeType;
}


export { Shape }
