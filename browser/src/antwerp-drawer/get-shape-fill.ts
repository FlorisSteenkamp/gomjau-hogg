import { AntwerpData } from '../../../src/types/antwerp-data';
import { colorLightShade1 } from '../preshape/colors';
import { DrawOptions } from './draw-options';
import { Shape } from '../../../src/shape/shape';


function getShapeFill(
        shape: Shape,
        data: AntwerpData,
        opts: DrawOptions): string {

    const { colorScale, colorMethod } = opts;

    if (!colorScale) {
        return colorLightShade1;
    }

    return colorMethod === 'transform'
        ? colorScale((1 - (shape.stage / data.maxStage)) || 0)
        : colorScale((1 - (shape.stagePlacement / data.maxStagePlacement)) || 0);
}


export { getShapeFill }
