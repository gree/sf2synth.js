import { GeneratorEnumeratorTable } from "./Constants"
import Stream from "./Stream"
import { Chunk } from "./RiffParser"

export class VersionTag {
  major: number
  minor: number
}

export class Info {
  comment: string
  copyright: string
  creationDate: string
  engineer: string
  name: string
  product: string
  software: string
  version: string
  soundEngine: string
  romName: string
  romVersion: string

  // LIST - INFO の全ての chunk
  static parse(data: Uint8Array, chunks: Chunk[]) {
    const obj = {}
    for (let chunk of chunks) {
      const stream = new Stream(data, chunk.offset)
      obj[chunk.type] = stream.readString(chunk.size)
    }
    const info = new Info()
    info.comment = obj["ICMT"]
    info.copyright = obj["ICOP"]
    info.creationDate = obj["ICRD"]
    info.engineer = obj["IENG"]
    info.name = obj["INAM"]
    info.product = obj["IPRD"]
    info.software = obj["ISFT"]
    info.version = obj["ifil"]
    info.soundEngine = obj["isng"]
    info.romName = obj["irom"]
    info.romVersion = obj["iver"]
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

  static parse(stream: Stream) {
    const r = new RangeValue()
    r.lo = stream.readByte()
    r.hi = stream.readByte()
    return r
  }
}

export class ModulatorList {
  sourceOper: number
  destinationOper: number
  value: number|RangeValue
  amountSourceOper: number
  transOper: number
  type: string

  static parse(stream: Stream) {
    const t = new ModulatorList()

    t.sourceOper = stream.readWORD()
    const code = stream.readWORD()
    t.destinationOper = code
    
    const key = GeneratorEnumeratorTable[code]
    t.type = key!

    switch (key) {
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
  type: string
  value: number|RangeValue

  static parse(stream: Stream) {
    const t = new GeneratorList()
    
    const code = stream.readWORD()
    const key = GeneratorEnumeratorTable[code]
    t.type = key!

    switch (key) {
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
