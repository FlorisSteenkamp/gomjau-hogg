import * as React from 'react';
import { useSearch } from 'wouter';
import { Antwerp } from '../antwerp.js';
import { Box } from '../preshape/box/box.js';
import { Text } from '../preshape/Text/Text.js';
import { Configuration } from './configuration.js';
import { getUrlParams } from './utils/get-url-params.js';


interface Props extends Configuration {
    active: boolean;
    onClick: (configuration: string) => void;
}


function LibraryEntry(props: Props) {
    const {
        active, cundyRollett, gomJauHogg, onClick, vertices, wallpaper,
        ...rest
    } = props;

    const searchParamsStr = useSearch();
    const { colorMethod, colorScale } = getUrlParams(searchParamsStr);

    return (
        <Box {...rest}
            // active={active}
            // borderSize="x1"
            style={{
                display: "block", textDecoration: 'none', border: '2px solid gray',
                cursor: 'pointer', padding: '5px'
            }}
            key={gomJauHogg}
            // minWidth="0"
            onClick={() => onClick(gomJauHogg)}
            href=""
            // padding="x3"
        >
            <Box margin="x3">
                <Antwerp
                    colorMethod={colorMethod}
                    colorScale={colorScale}
                    configuration={gomJauHogg}
                    height="200px"
                    inRadius={150}
                    shapeSize={15}
                    showTransforms={false}
                    showVertices={false}
                />
            </Box>

            <Text style={{ textDecoration: 'none' }} ellipsis size="x3" strong>
                {cundyRollett}
            </Text><br/>
            <Text ellipsis size="x3" strong>{gomJauHogg}</Text>
            <Text ellipsis size="x3" strong={false}>{vertices}</Text>
            <Text ellipsis size="x3">{wallpaper}</Text>
        </Box>
    );
}


export { LibraryEntry }
