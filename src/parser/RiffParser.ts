import Stream from "./Stream"

function parseChunk(input: Uint8Array, ip: number, bigEndian: boolean): Chunk {
  const stream = new Stream(input, ip)
  const type = stream.readString(4)
  const size = stream.readDWORD(bigEndian)
  return new Chunk(type, size, stream.ip)
}

export interface Options {
  padding?: boolean
  bigEndian?: boolean
}

export function parseRiff(
  input: Uint8Array,
  index: number = 0,
  length: number,
  { padding = true, bigEndian = false }: Options = {}
) {
  const chunkList: Chunk[] = []
  const end = length + index
  let ip = index

  while (ip < end) {
    const chunk = parseChunk(input, ip, bigEndian)
    ip = chunk.offset + chunk.size

    // padding
    if (padding && ((ip - index) & 1) === 1) {
      ip++
    }

    chunkList.push(chunk)
  }

  return chunkList
}

export class Chunk {
  type: string
  size: number
  offset: number

  constructor(type: string, size: number, offset: number) {
    this.type = type
    this.size = size
    this.offset = offset
  }
}
