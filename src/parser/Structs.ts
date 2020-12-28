import { GeneratorEnumeratorTable } from "./Constants"
import Stream from "./Stream"
import { Chunk } from "./RiffParser"

export class VersionTag {
  major: number
  minor: number
  
  static parse(stream: Stream) {
    const v = new VersionTag()
    v.major = stream.readInt8()
    v.minor = stream.readInt8()
    return v
  }
}

export class Info {
  comment: string|null
  copyright: string|null
  creationDate: string|null
  engineer: string|null
  name: string
  product: string|null
  software: string|null
  version: VersionTag
  soundEngine: string|null
  romName: string|null
  romVersion: VersionTag|null

  // LIST - INFO の全ての chunk
  static parse(data: Uint8Array, chunks: Chunk[]) {
    function getChunk(type) {
      return chunks.find(c => c.type === type) 
    }

    function toStream(chunk) {
      return new Stream(data, chunk.offset)
    }

    function readString(type) {
      const chunk = getChunk(type)
      if (!chunk) {
        return null
      }
      return toStream(chunk)!.readString(chunk.size)
    }

    function readVersionTag(type) {
      const chunk = getChunk(type)
      if (!chunk) {
        return null
      }
      return VersionTag.parse(toStream(chunk))
    }
    
    const info = new Info()
    info.comment = readString("ICMT")
    info.copyright = readString("ICOP")
    info.creationDate = readString("ICRD")
    info.engineer = readString("IENG")
    info.name = readString("INAM")!
    info.product = readString("IPRD")
    info.software = readString("ISFT")
    info.version = readVersionTag("ifil")!
    info.soundEngine = readString("isng")
    info.romName = readString("irom")
    info.romVersion = readVersionTag("iver")
    return info
  }
}

export class PresetHeader {
  presetName: string
  preset: number
  bank: number
  presetBagIndex: number
  library: number
  genre: number
  morphology: number

  get isEnd() {
    return this.presetName === "EOP"
  }

  static parse(stream: Stream) {
    const p = new PresetHeader()
    p.presetName = stream.readString(20)
    p.preset = stream.readWORD()
    p.bank = stream.readWORD()
    p.presetBagIndex = stream.readWORD()
    p.library = stream.readDWORD()
    p.genre = stream.readDWORD()
    p.morphology = stream.readDWORD()
    return p
  }
}

export class PresetBag {
  presetGeneratorIndex: number
  presetModulatorIndex: number

  static parse(stream: Stream) {
    const p = new PresetBag()
    p.presetGeneratorIndex = stream.readWORD()
    p.presetModulatorIndex = stream.readWORD()
    return p
  }
}

export class RangeValue {
  lo: number
  hi: number

  constructor(lo: number, hi: number) {
    this.lo = lo
    this.hi = hi
  }

  static parse(stream: Stream) {
    return new RangeValue(
      stream.readByte(), 
      stream.readByte()
    )
  }
}

export class ModulatorList {
  sourceOper: number
  destinationOper: number
  value: number|RangeValue
  amountSourceOper: number
  transOper: number

  get type() {
    return GeneratorEnumeratorTable[this.destinationOper]
  }

  get isEnd() {
    return this.sourceOper === 0 && 
      this.destinationOper === 0 &&
      this.value === 0 &&
      this.amountSourceOper === 0 &&
      this. transOper === 0
  }

  static parse(stream: Stream) {
    const t = new ModulatorList()

    t.sourceOper = stream.readWORD()
    t.destinationOper = stream.readWORD()

    switch (t.type) {
      case 'keyRange': /* FALLTHROUGH */
      case 'velRange': /* FALLTHROUGH */
      case 'keynum': /* FALLTHROUGH */
      case 'velocity':
        t.value = RangeValue.parse(stream)
        break
      default:
        t.value = stream.readInt16()
        break
    }
    
    t.amountSourceOper = stream.readWORD()
    t.transOper = stream.readWORD()

    return t
  }
}

export class GeneratorList {
  code: number
  value: number|RangeValue

  get type() {
    return GeneratorEnumeratorTable[this.code]
  }

  get isEnd() {
    return this.code === 0 &&
      this.value === 0
  }

  static parse(stream: Stream) {
    const t = new GeneratorList()
    t.code = stream.readWORD()

    switch (t.type) {
      case 'keynum': /* FALLTHROUGH */
      case 'keyRange': /* FALLTHROUGH */
      case 'velRange': /* FALLTHROUGH */
      case 'velocity':
        t.value = RangeValue.parse(stream)
        break
      default:
        t.value = stream.readInt16()
        break
    }

    return t
  }
}

export class Instrument {
  instrumentName: string
  instrumentBagIndex: number

  get isEnd() {
    return this.instrumentName === "EOI"
  }
  
  static parse(stream: Stream) {
    const t = new Instrument()
    t.instrumentName = stream.readString(20)
    t.instrumentBagIndex = stream.readWORD()
    return t
  }
}

export class InstrumentBag {
  instrumentGeneratorIndex: number
  instrumentModulatorIndex: number
  
  static parse(stream: Stream) {
    const t = new InstrumentBag()
    t.instrumentGeneratorIndex = stream.readWORD()
    t.instrumentModulatorIndex = stream.readWORD()
    return t
  }
}

export class SampleHeader {
  sampleName: string
  start: number
  end: number
  loopStart: number
  loopEnd: number
  sampleRate: number
  originalPitch: number
  pitchCorrection: number
  sampleLink: number
  sampleType: number

  get isEnd() {
    return this.sampleName === "EOS"
  }

  static parse(stream: Stream) {
    const s = new SampleHeader()

    s.sampleName = stream.readString(20)
    s.start = stream.readDWORD()
    s.end = stream.readDWORD()
    s.loopStart = stream.readDWORD()
    s.loopEnd = stream.readDWORD()
    s.sampleRate = stream.readDWORD()
    s.originalPitch = stream.readByte()
    s.pitchCorrection = stream.readInt8()
    s.sampleLink = stream.readWORD()
    s.sampleType = stream.readWORD()

    s.loopStart -= s.start
    s.loopEnd -= s.start

    return s
  }
}

export const SampleLink = {
  monoSample: 1,
  rightSample: 2,
  leftSample: 4,
  linkedSample: 8,
  RomMonoSample: 0x8001,
  RomRightSample: 0x8002,
  RomLeftSample: 0x8004,
  RomLinkedSample: 0x8008
}
