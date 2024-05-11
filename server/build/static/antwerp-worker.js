import { toShapes } from './antwerp.js';


global.onmessage = (({ data }) => {
    try {
        postMessage(toShapes(data));
    } catch (error) {
        postMessage({
            error: error,
            shapes: [],
            stages: 0,
            transforms: [],
        });
    }
});
