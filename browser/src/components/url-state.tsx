import { ColorScale } from '../utils/get-color-scale';


interface URLState {
    readonly configuration: string;
    readonly colorMethod: 'placement' | 'transform';
    readonly colorScale: ColorScale ;
    readonly repeatCount: number;
    readonly shapeSize: number;
    readonly showTransforms: boolean;
    readonly showAxis15: boolean;
    readonly showAxis90: boolean;
    readonly showVertices: boolean;
}


export { URLState }
