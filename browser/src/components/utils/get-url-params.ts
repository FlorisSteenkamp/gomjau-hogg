import { URLState } from '../url-state.js';
import { ColorScale, colorScales } from '../../utils/get-color-scale.js';
import { defaults } from '../../defaults.js';


function getUrlParams(
        searchParamsStr: string): URLState {

    const searchParams = new URLSearchParams(searchParamsStr);

    const {
        getConfiguration, getColorMethod, getColorScale: getColorScale_,
        getRepeatCountAndInRadius, getShowTransforms, getShapeSize, getShowAxis15,
        getShowAxis90, getShowVertices
    } = urlParamGetters;

    const configuration = getConfiguration(searchParams.get('configuration'));
    const colorMethod = getColorMethod(searchParams.get('colorMethod'));
    const colorScale = getColorScale_(searchParams.get('colorScale'));
    const { repeatCount, inRadius } = getRepeatCountAndInRadius(
        searchParams.get('repeatCount'),
        searchParams.get('inRadius')
    );
    const shapeSize = getShapeSize(searchParams.get('shapeSize'));
    const showTransforms = getShowTransforms(searchParams.get('showTransforms'));
    const showAxis15 = getShowAxis15(searchParams.get('showAxis15'));
    const showAxis90 = getShowAxis90(searchParams.get('showAxis90'));
    const showVertices = getShowVertices(searchParams.get('showVertices'));

    return {
        configuration, colorMethod, colorScale, repeatCount, inRadius,
        shapeSize, showTransforms, showAxis15, showAxis90, showVertices
    }
}


const urlParamGetters = {
    getConfiguration: function(v: string | null): string {
        if (v === null || v === undefined || v === '') {
            return defaults.configuration;
        }

        return v;
    },
    getColorMethod: function(v: string | null): 'placement' | 'transform' {
        if (v === 'placement' || v === 'transform') {
            return v;
        }

        return 'placement';
    },
    getColorScale: function (v: string | null): ColorScale {
        if (colorScales.includes(v as ColorScale)) {
            return v as ColorScale;
        }

        return colorScales[1];
    },
    getRepeatCountAndInRadius: (rStr: string | null, iStr: string | null) => {
        const defaultRepeatCount = 6;
        const defaultInRadius = 100;

        if (rStr !== null && rStr !== undefined) {
            const _r = Number.parseInt(rStr!);
            const r = Number.isFinite(_r) && _r >= 0
                ? _r : defaultRepeatCount;

            return { repeatCount: r, inRadius: undefined };
        }

        const _i = Number.parseInt(iStr!);
        const i = Number.isFinite(_i) && _i >= 0
            ? _i : defaultInRadius;

        return { repeatCount: undefined, inRadius: i };
    },
    getShowTransforms: getBooleanParam(false),
    getShapeSize: (vStr: string | null) => {
        const defaultShapeSize = 15;
        if (vStr === null || vStr === undefined) {
            return defaultShapeSize;
        }
        const v = Number.parseInt(vStr);

        return Number.isFinite(v) && v >= 2 && v <= 500
            ? v : defaultShapeSize
    },
    getShowAxis15: getBooleanParam(false),
    getShowAxis90: getBooleanParam(false),
    getShowVertices: getBooleanParam(false),
};


function getBooleanParam(defaultsTo: boolean) {
    return (v: string | null): boolean => {
        if (v === 'true') {
            return true;
        }
        if (v === 'false') {
            return false;
        }

        return defaultsTo;
    }
}


export { getUrlParams }
