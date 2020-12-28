export default class Stream {
    private data;
    ip: number;
    constructor(data: any, offset: any);
    readString(size: number): string;
    readWORD(): number;
    readDWORD(bigEndian?: boolean): number;
    readByte(): number;
    readAt(offset: number): number;
    readUInt8(): number;
    readInt8(): number;
    readUInt16(): number;
    readInt16(): number;
    readUInt32(): number;
}
