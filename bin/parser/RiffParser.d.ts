export interface Options {
    padding?: boolean;
    bigEndian?: boolean;
}
export declare function parseRiff(input: Uint8Array, index: number | undefined, length: number, { padding, bigEndian }?: Options): Chunk[];
export declare class Chunk {
    type: string;
    size: number;
    offset: number;
    constructor(type: string, size: number, offset: number);
}
