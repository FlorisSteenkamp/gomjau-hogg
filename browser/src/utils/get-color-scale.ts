import * as d3ScaleChromatic from 'd3-scale-chromatic';


type ColorScale =
    | 'Plain'
    | 'Plasma'
    | 'Preshape Theme'
    | 'RdPu'
    | 'Spectral'
    | 'Viridis'
    | 'YlGnBu';


const colorScales: ColorScale[] = [
    'Plain',
    'Plasma',
    'Preshape Theme',
    'RdPu',
    'Spectral',
    'Viridis',
    'YlGnBu',
] as const;


function getColorScale(
        scale: ColorScale | undefined): ((t: number) => string) | undefined {

    switch (scale) {
        case 'Plain': return undefined;
        case 'Plasma': return d3ScaleChromatic.interpolatePlasma;
        case 'RdPu': return d3ScaleChromatic.interpolateRdBu;
        case 'Spectral': return d3ScaleChromatic.interpolateSpectral;
        case 'Viridis': return d3ScaleChromatic.interpolateViridis;
        case 'YlGnBu': return d3ScaleChromatic.interpolateYlGnBu;
        case 'Preshape Theme':
        default: return d3ScaleChromatic.interpolatePlasma;
    }
};


export { colorScales, getColorScale, ColorScale }
