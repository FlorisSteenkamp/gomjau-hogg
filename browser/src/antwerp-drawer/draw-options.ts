
interface DrawOptions {
    readonly colorMethod?: 'placement' | 'transform';
    readonly colorScale?: (t: number) => string;
}


export { DrawOptions }
