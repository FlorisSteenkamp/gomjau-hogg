import * as React from 'react';
import groupBy from 'lodash.groupby';
import { useLocation, useSearch } from 'wouter';
import { Button } from '../preshape/Button/Button.js';
import { Buttons } from '../preshape/Button/Buttons.js';
import { Text } from '../preshape/Text/Text.js';
import { Box } from '../preshape/box/box.js';
import { Grid } from '../preshape/Grid/Grid.js';
import { configurations } from './configurations.js';
import { LibraryEntry } from './library-entry.js';
import { updSearchParams } from '../utils/upd-search-params.js';


function Library() {
    const [group, setGroup] = React.useState<'vertices' | 'wallpaper'>('vertices');
    const groupedConfigurations = groupBy(configurations, group);

    const searchParamsStr = useSearch();
    const [location,setLocation] = useLocation();


    if (groupedConfigurations['']) {
        const group = groupedConfigurations[''];
        delete groupedConfigurations[''];
        groupedConfigurations[''] = group;
    }

    function handleSelect(configuration: string) {
        const searchParamsStr_ = updSearchParams(searchParamsStr, { configuration });

        setLocation(`/gomjau-hogg/?${searchParamsStr_}`);
    };

    return (
        <Box flex="vertical" grow maxWidth="1050px" padding="x6">
            <Box
                alignChildrenVertical="middle"
                flex="horizontal"
                gap="x4"
                margin="x6">
                <Box grow>
                    <Text size="x3" strong>Tiling Library</Text>
                </Box>

                <Box>
                <Buttons>
                    <Buttons alignChildrenHorizontal="end">
                    <Button onPointerUp={() => setGroup(group === 'vertices' ? 'wallpaper' : 'vertices')}>
                        Group by: { group }
                    </Button>
                    </Buttons>
                </Buttons>
                </Box>
            </Box>

            {Object
                .entries(groupedConfigurations)
                .map(([groupKey, configurations]) => (
                    <Box key={ groupKey } margin="x12">
                        <Box margin="x6">
                            <Text strong>
                                { groupKey || 'No Defined Wallpaper Group' }
                            </Text>
                        </Box>

                        <Box>
                            <Grid gap="x6" repeatWidth="224px">
                                {configurations.map((config, index) => (
                                    <LibraryEntry
                                        {...config}
                                        active={false}
                                        key={config.gomJauHogg || config.cundyRollett || index}
                                        onClick={handleSelect} />
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                ))}
        </Box>
    );
}


export { Library }

