import { GeneratorEnumeratorTable } from "./constants"

export class VersionTag {
  /** @type {number} */
  major
  /** @type {number} */
  minor
}

export class PresetHeader {
  /** @type {string} */
  presetName
  /** @type {number} */
  preset
  /** @type {number} */
  bank
  /** @type {number} */
  presetBagIndex
  /** @type {number} */
  library
  /** @type {number} */
  genre
  /** @type {number} */
  morphology

  static parse(stream) {
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
  /** @type {number} */
  presetGeneratorIndex
  /** @type {number} */
  presetModulatorIndex

  static parse(stream) {
    const p = new PresetBag()
    p.presetGeneratorIndex = stream.readWORD()
    p.presetModulatorIndex = stream.readWORD()
    return p
  }
}

export class ModulatorList {
  /** @type {Modulator} */
  sourceOper
  /** @type {Generator} */
  destinationOper
  /** @type {Object} */
  value
  /** @type {Modulator} */
  amountSourceOper
  /** @type {Generator} */
  transOper

  static parse(stream) {
    const t = new ModulatorList()

    t.sourceOper = stream.readWORD()
    const code = stream.readWORD()
    t.destinationOper = code
    
    const key = GeneratorEnumeratorTable[code]
    t.type = key

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
  /** @type {string} */
  type
  /** @type {Object} */
  value

  static parse(stream) {
    const t = new ModulatorList()
    
    const code = stream.readWORD()
    const key = GeneratorEnumeratorTable[code]
    t.type = key

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
  /** @type {string} */
  instrumentName
  /** @type {number} */
  instrumentBagIndex
  
  static parse(stream) {
    const t = new Instrument()
    t.instrumentName = stream.readString(20)
    t.instrumentBagIndex = stream.readWORD()
    return t
  }
}

export class InstrumentBag {
  /** @type {number} */
  instrumentGeneratorIndex
  /** @type {number} */
  instrumentModulatorIndex
  
  static parse(stream) {
    const t = new InstrumentBag()
    t.instrumentGeneratorIndex = stream.readWORD()
    t.instrumentModulatorIndex = stream.readWORD()
    return t
  }
}

export class Sample {
  /** @type {string} */
  sampleName
  /** @type {number} */
  start
  /** @type {number} */
  end
  /** @type {number} */
  startLoop
  /** @type {number} */
  endLoop
  /** @type {number} */
  sampleRate
  /** @type {number} */
  originalPitch
  /** @type {number} */
  pitchCorrection
  /** @type {number} */
  sampleLink
  /** @type {SampleLink} */
  sampleType

  static parse(stream) {
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

/**
 * @enum {number}
 */
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
