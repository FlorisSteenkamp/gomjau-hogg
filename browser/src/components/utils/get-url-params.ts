import { URLState } from '../url-state';
import { ColorScale, colorScales } from "../../utils/get-color-scale";
import { defaults } from '../../defaults';


function getUrlParams(
        searchParamsStr: string): URLState {

    const searchParams = new URLSearchParams(searchParamsStr);

    const {
        getConfiguration, getColorMethod, getColorScale: getColorScale_,
        getRepeatCount, getShowTransforms, getShapeSize, getShowAxis15,
        getShowAxis90, getShowVertices
    } = urlParamGetters;

    const configuration = getConfiguration(searchParams.get('configuration'));
    const colorMethod = getColorMethod(searchParams.get('colorMethod'));
    const colorScale = getColorScale_(searchParams.get('colorScale'));
    const repeatCount = getRepeatCount(searchParams.get('repeatCount'));
    const shapeSize = getShapeSize(searchParams.get('shapeSize'));
    const showTransforms = getShowTransforms(searchParams.get('showTransforms'));
    const showAxis15 = getShowAxis15(searchParams.get('showAxis15'));
    const showAxis90 = getShowAxis90(searchParams.get('showAxis90'));
    const showVertices = getShowVertices(searchParams.get('showVertices'));

    return {
        configuration, colorMethod, colorScale, repeatCount: repeatCount, shapeSize,
        showTransforms, showAxis15, showAxis90, showVertices
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
    getRepeatCount: (vStr: string | null) => {
        const defaultRepeatCount = 6;
        if (vStr === null || vStr === undefined) {
            return defaultRepeatCount;
        }
        const v = Number.parseInt(vStr);

        return Number.isFinite(v) && v >= 0
            ? v : defaultRepeatCount;
    },
    getShowTransforms: getBooleanParam(false),
    getShapeSize: (vStr: string | null) => {
        const defaultShapeSize = 15;
        if (vStr === null || vStr === undefined) {
            return defaultShapeSize;
        }
        const v = Number.parseInt(vStr);

        return Number.isFinite(v) && v >= 3 && v <= 500
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
