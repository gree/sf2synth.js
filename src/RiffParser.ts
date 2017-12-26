export class RiffParser {
  chunkList: Chunk[] = []
  
  private input: Uint8Array
  private ip: number
  private length: number
  private offset: number
  private padding: boolean
  private bigEndian: boolean

  constructor(input: Uint8Array, opt_params: {} = {}) {
    this.input = input
    this.ip = opt_params['index'] || 0
    this.length = opt_params['length'] || input.length - this.ip
    this.chunkList = []
    this.offset = this.ip
    this.padding =
      opt_params['padding'] !== void 0 ? opt_params['padding'] : true
    this.bigEndian =
      opt_params['bigEndian'] !== void 0 ? opt_params['bigEndian'] : false
  }
  
  parse() {
    const length = this.length + this.offset

    this.chunkList = []

    while (this.ip < length) {
      this.parseChunk()
    }
  }

  parseChunk() {
    const input = this.input
    let ip = this.ip
    let size

    this.chunkList.push(new Chunk(
      String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]),
      (size = this.bigEndian ?
        ((input[ip++] << 24) | (input[ip++] << 16) |
          (input[ip++] <<  8) | (input[ip++]      )) >>> 0 :
        ((input[ip++]      ) | (input[ip++] <<  8) |
          (input[ip++] << 16) | (input[ip++] << 24)) >>> 0
      ),
      ip
    ))

    ip += size

    // padding
    if (this.padding && ((ip - this.offset) & 1) === 1) {
      ip++
    }

    this.ip = ip
  }

  getChunk(index: number) {
    const chunk = this.chunkList[index]

    if (chunk === void 0) {
      return null
    }

    return chunk
  }

  getNumberOfChunks() {
    return this.chunkList.length
  }
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
