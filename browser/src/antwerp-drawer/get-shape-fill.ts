import { AntwerpData } from '../../../src/types/antwerp-data.js';
import { colorLightShade1 } from '../preshape/colors.js';
import { DrawOptions } from './draw-options.js';
import { Shape } from '../../../src/shape/shape.js';


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
