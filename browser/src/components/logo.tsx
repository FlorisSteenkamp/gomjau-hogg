import * as React from 'react';
import { LogoNightSvg } from './assets/logo-night.js';


interface Props extends React.SVGAttributes<SVGSVGElement> {}

function Logo(props: Props) {
    // const { theme } = React.useContext(RootContext);
    const theme: 'day'|'night' = 'night';

    // return theme === 'day'
    //   ? <LogoDaySvg { ...props } />
    //   : <LogoNightSvg { ...props } />;
    return <LogoNightSvg { ...props } />;
}


export { Logo }
