export default class Stream {
  constructor(data, offset) {
    this.data = data
    this.ip = offset
  }

  /**
   * @param {string} data 
   * @param {number} start 
   * @param {number} end 
   * @return {string}
   */
  readString(size) {
    const str = String.fromCharCode.apply(null, this.data.subarray(this.ip, this.ip += size))
    const nullLocation = str.indexOf("\u0000")
    if (nullLocation > 0) {
      return str.substr(0, nullLocation)
    }
    return str
  }

  readWORD() {
    return this.data[this.ip++] | (this.data[this.ip++] << 8)
  }

  readDWORD() {
    return (
      this.data[this.ip++] | 
      (this.data[this.ip++] << 8) | 
      (this.data[this.ip++] << 16) | 
      (this.data[this.ip++] << 24)
    ) >>> 0
  }

  readByte() {
    return this.data[this.ip++]
  }

  readAt(offset) {
    return this.data[this.ip + offset]
  }

  /* helper */

  readUInt8() {
    return this.readByte()
  }
  
  readInt8() {
    return (this.readByte() << 24) >> 24
  }
  
  readUInt16() {
    return this.readWORD()
  }

  readInt16() {
    return (this.readWORD() << 16) >> 16
  }

  readUInt32() {
    return this.readDWORD()
  }
}
