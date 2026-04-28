import * as React from 'react';
import { BoxProps, Box } from './preshape/box/box.js';
import { useResizeObserver } from './preshape/hooks/use-resize-observer.js';
import { AntwerpData } from '../../src/types/antwerp-data.js';
import { toShapes } from '../../src/to-shapes/to-shapes.js';
import { ColorScale, getColorScale } from './utils/get-color-scale.js';
import { drawShapes } from './antwerp-drawer/antwerp-drawer.js';



interface Props extends BoxProps {
    readonly colorMethod: 'placement' | 'transform';
    readonly colorScale?: ColorScale;
    readonly configuration: string;
    readonly repeatCount?: number | undefined;
    readonly inRadius?: number | undefined;
    readonly shapeSize: number;
    readonly showTransforms: boolean;
    readonly showVertices: boolean;
}


function Antwerp(props: Props) {
    const {
        colorMethod, colorScale, configuration, repeatCount, inRadius,
        shapeSize, showTransforms, showVertices,
        ...rest
    } = props;

    const [{height,width}, refSize, sizeNode] = useResizeObserver<HTMLDivElement>();
    const [data, setData] = React.useState<AntwerpData | null>();

    const svgRef = React.useRef<SVGSVGElement>(null);

    React.useEffect(() => {
        if (height && width) {
            setData(toShapes(configuration, repeatCount, shapeSize, inRadius));
        }
    }, [configuration, repeatCount, inRadius, shapeSize, height, width]);


    React.useEffect(
        () => {
            if (!data) { return; }

            const svg = svgRef.current!;
            svg.setAttributeNS(null, 'viewBox', `${-width/2} ${-height/2} ${width} ${height}`)
            
            drawShapes(
                svg,
                data,
                {
                    colorMethod,
                    colorScale: getColorScale(colorScale)
                },
                showTransforms,
                showVertices,
                shapeSize
            );
        },
        [colorMethod, colorScale, data, height, width]
    );


    return (
        <Box {...rest} id="antwerp" grow container>
            <Box
                absolute="edge-to-edge"
                backgroundColor="background-shade-3"
                ref={refSize}
            />
                <svg 
                    ref={svgRef}
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    id="svg"
                    x="0px" 
                    y="0px"
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        left: '0px',
                        right: '0px',
                        top: '0px',
                        bottom: '0px',
                        overflow: 'hidden'
                    }}
                >
                </svg>
        </Box>
    );
}


export { Antwerp }

