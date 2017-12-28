import { GeneratorEnumeratorTable } from "./Constants"
import Stream from "./Stream"

export class VersionTag {
  major: number
  minor: number
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

export interface AmountValue {
  code?: number
  amount: number
}

export interface RangeValue {
  lo: number
  hi: number
}

export class ModulatorList {
  sourceOper: number
  destinationOper: number
  value: AmountValue|RangeValue
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

    if (key === void 0) {
      // Amount
      t.value = {
        code: code,
        amount: stream.readInt16()
      }
    } else {
      // Amount
      switch (key) {
        case 'keyRange': /* FALLTHROUGH */
        case 'velRange': /* FALLTHROUGH */
        case 'keynum': /* FALLTHROUGH */
        case 'velocity':
          t.value = {
            lo: stream.readByte(),
            hi: stream.readByte()
          }
          break
        default:
          t.value = {
            amount: stream.readInt16()
          }
          break
      }
    }
    
    t.amountSourceOper = stream.readWORD()
    t.transOper = stream.readWORD()

    return t
  }
}

export class GeneratorList {
  type: string
  value: AmountValue|RangeValue

  static parse(stream: Stream) {
    const t = new ModulatorList()
    
    const code = stream.readWORD()
    const key = GeneratorEnumeratorTable[code]
    t.type = key!

    if (key === void 0) {
      t.value = {
        code,
        amount: stream.readInt16()
      }
    } else {
      switch (key) {
        case 'keynum': /* FALLTHROUGH */
        case 'keyRange': /* FALLTHROUGH */
        case 'velRange': /* FALLTHROUGH */
        case 'velocity':
          t.value = {
            lo: stream.readByte(),
            hi: stream.readByte()
          }
          break
        default:
          t.value = {
            amount: stream.readInt16()
          }
          break
      }
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

export class Sample {
  sampleName: string
  start: number
  end: number
  startLoop: number
  endLoop: number
  sampleRate: number
  originalPitch: number
  pitchCorrection: number
  sampleLink: number
  sampleType: number

  static parse(stream: Stream) {
    const s = new Sample()

    s.sampleName = stream.readString(20)
    s.start = stream.readDWORD()
    s.end = stream.readDWORD()
    s.startLoop = stream.readDWORD()
    s.endLoop = stream.readDWORD()
    s.sampleRate = stream.readDWORD()
    s.originalPitch = stream.readByte()
    s.pitchCorrection = stream.readInt8()
    s.sampleLink = stream.readWORD()
    s.sampleType = stream.readWORD()

    s.startLoop -= s.start
    s.endLoop -= s.start

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
