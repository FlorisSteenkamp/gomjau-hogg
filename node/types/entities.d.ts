import { ShapeType } from "./shape-type.js";
import { Transform } from "./transform.js";
interface Entities {
    readonly seedShapeType: ShapeType;
    readonly shapeGroups: (0 | ShapeType)[][];
    readonly transforms: Transform[];
}
export { Entities };
