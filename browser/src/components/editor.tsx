import * as React from 'react';
import { useSearch } from 'wouter';
import { RefreshCcw } from 'lucide-react';
import { Input } from '../preshape/Input/Input.js';
import { Box } from '../preshape/box/box.js';
import { Antwerp } from '../antwerp.js';
import { getUrlParams } from './utils/get-url-params.js';
import { toShapes } from '../../../src/to-shapes/to-shapes.js';


function Editor() {
    const searchParamsStr = useSearch();

    const {
        colorMethod, colorScale, configuration, repeatCount, shapeSize,
        showTransforms, showVertices
    } = getUrlParams(searchParamsStr);


    function handleUpdateConfiguration() {
        toShapes(configuration, shapeSize, repeatCount);
    };

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        handleUpdateConfiguration();
    };

    return (
        <Box
            backgroundColor="text-shade-1"
            flex="vertical"
            gap="x1"
            grow
        >
            <Box
                backgroundColor="background-shade-3"
                flex="vertical"
                grow
            >
                <Antwerp
                    colorMethod={colorMethod}
                    colorScale={colorScale}
                    configuration={configuration}
                    grow
                    repeatCount={repeatCount}
                    shapeSize={shapeSize}
                    showTransforms={showTransforms}
                    showVertices={showVertices}
                />
            </Box>
            <Box
                style={{ borderBottom: '3px solid white' }}
                flex="horizontal"
                gap="x1"
            >
                <Box
                    alignChildrenVertical="middle"
                    backgroundColor="background-shade-1"
                    flex="horizontal"
                    grow
                >
                    <Box basis="0" grow>
                        {/* <Form onSubmit={handleSubmit}> */}
                            <Input
                                // align="middle"
                                // onChange={ (event) => setValue((event.target as HTMLInputElement).value) }
                                paddingHorizontal="x6"
                                paddingVertical="x3"
                                // size="x2"
                                // value={value}
                                value={configuration}
                                readOnly  //TODO2
                            />
                        {/* </Form> */}
                    </Box>
                </Box>

                <Box backgroundColor="background-shade-1"
                        style={{ display: "block", padding: '10px 20px', cursor: 'pointer' }}
                        onClick={handleUpdateConfiguration}
                        href=""
                        // paddingHorizontal="x6"
                        // paddingVertical="x3"
                        // size="x2"
                        // strong
                    >
                        <RefreshCcw size={"1.5rem"} color='white'/>
                </Box>
            </Box>
        </Box>
    );
};


export { Editor }
