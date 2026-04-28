import { ColorScale } from '../utils/get-color-scale.js';


interface URLState {
    readonly configuration: string;
    readonly colorMethod: 'placement' | 'transform';
    readonly colorScale: ColorScale ;
    readonly repeatCount?: number | undefined;
    readonly inRadius?: number | undefined;
    readonly shapeSize: number;
    readonly showTransforms: boolean;
    readonly showAxis15: boolean;
    readonly showAxis90: boolean;
    readonly showVertices: boolean;
}


export { URLState }
