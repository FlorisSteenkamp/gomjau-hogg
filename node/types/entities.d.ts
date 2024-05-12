import { ShapeType } from "./shape-type";
import { Transform } from "./transform";
interface Entities {
    readonly seedShapeType: ShapeType;
    readonly shapeGroups: (0 | ShapeType)[][];
    readonly transforms: Transform[];
}
export { Entities };
