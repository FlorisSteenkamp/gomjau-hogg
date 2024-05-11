import { useEffect, useState, Ref } from 'react';


type Size = {
    width: number;
    height: number;
}


function useResizeObserver<T extends Element = Element>(): [Size, Ref<T>, T | null] {
    const [node, setNode] = useState<T | null>(null);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
        if (entries.length) {
            setSize({
            width: entries[0].contentRect.width,
            height: entries[0].contentRect.height,
            });
        }
        });

        if (node) {
        observer.observe(node);
        }

        return () => {
        if (node) {
            observer.unobserve(node);
        }

        observer.disconnect();
        };
    }, [node]);

    return [size, setNode, node];
}


export { useResizeObserver }
