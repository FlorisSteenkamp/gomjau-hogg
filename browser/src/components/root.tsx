import * as React from 'react';
import { Route, Switch, useSearch, Link } from 'wouter';
import { Box } from '../preshape/box/box.js';
import { Editor } from './editor.js';
import { Menu } from './menu.js';
import { Library } from './library.js';
import { Logo } from './logo.js';
import useMatchMedia from '../preshape/hooks/use-match-media.js';
import { Text } from '../preshape/Text/Text.js';


function Root() {
    const match = useMatchMedia(['600px']);

    const searchParamsStr = useSearch();

    return (
        <Box style={{ flexGrow: 1 }} backgroundColor="text-shade-1" flex="vertical" gap="x1" grow>
            <Box
                alignChildrenVertical="middle"
                backgroundColor="background-shade-1"
                flex="horizontal"
                gap="x6"
                paddingHorizontal="x6"
                paddingVertical="x2"
            >
                <Box flex="horizontal" grow>
                    <Link
                        style={{ display: "block", textDecoration: 'none' }}
                        href={`/?${searchParamsStr}`
                    }>
                        <Box
                            alignChildrenVertical="middle"
                            flex="horizontal"
                            gap="x4"
                            grow
                        >
                            <Logo/>
                            {match('600px') &&
                            <Text
                                style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}
                            >
                                ANTWERP
                            </Text>}
                        </Box>
                    </Link>
                </Box>

                <Menu/>
            </Box>

            <Box
                id="box1"
                backgroundColor="background-shade-1"
                flex="vertical"
                grow
            >
                <Switch>
                    <Route component={Library} path={`/library`} />
                    <Route component={Editor} path="/" />
                    <Route component={Editor} path="/index.html" />
                </Switch>
            </Box>
        </Box>
    );
}


export { Root }

