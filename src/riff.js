export class Parser {
  /**
  * @param {ByteArray} input input buffer.
  * @param {Object=} opt_params option parameters.
  * @constructor
  */
  constructor(input, opt_params = {}) {
    /** @type {ByteArray} */
    this.input = input
    /** @type {number} */
    this.ip = opt_params['index'] || 0
    /** @type {number} */
    this.length = opt_params['length'] || input.length - this.ip
    /** @type {Array.<Chunk>} */
    this.chunkList = []
    /** @type {number} */
    this.offset = this.ip
    /** @type {boolean} */
    this.padding =
      opt_params['padding'] !== void 0 ? opt_params['padding'] : true
    /** @type {boolean} */
    this.bigEndian =
      opt_params['bigEndian'] !== void 0 ? opt_params['bigEndian'] : false
  }
  
  parse() {
    /** @type {number} */
    var length = this.length + this.offset

    this.chunkList = []

    while (this.ip < length) {
      this.parseChunk()
    }
  }

  parseChunk() {
    /** @type {ByteArray} */
    var input = this.input
    /** @type {number} */
    var ip = this.ip
    /** @type {number} */
    var size

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

  /**
   * @param {number} index chunk index.
   * @return {Chunk}
   */
  getChunk(index) {
    /** @type {Chunk} */
    var chunk = this.chunkList[index]

    if (chunk === void 0) {
      return null
    }

    return chunk
  }

  /**
   * @return {number}
   */
  getNumberOfChunks() {
    return this.chunkList.length
  }
}

export class Chunk {
  /**
   * @param {string} type
   * @param {number} size
   * @param {number} offset
   * @constructor
   */
  constructor(type, size, offset) {
    /** @type {string} */
    this.type = type
    /** @type {number} */
    this.size = size
    /** @type {number} */
    this.offset = offset
  }
}
