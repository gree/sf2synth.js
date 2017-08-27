import { readString } from "./helper"
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

  static parse(data, offset) {
    const p = new PresetHeader()
    let ip = offset
    p.presetName = readString(data, ip, ip += 20)
    p.preset = data[ip++] | (data[ip++] << 8)
    p.bank = data[ip++] | (data[ip++] << 8)
    p.presetBagIndex = data[ip++] | (data[ip++] << 8)
    p.library = (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0
    p.genre = (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0
    p.morphology = (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0
    p.size = ip - offset
    return p
  }
}

export class PresetBag {
  /** @type {number} */
  presetGeneratorIndex
  /** @type {number} */
  presetModulatorIndex

  static parse(data, offset) {
    const p = new PresetBag()
    let ip = offset
    p.presetGeneratorIndex = data[ip++] | (data[ip++] << 8)
    p.presetModulatorIndex = data[ip++] | (data[ip++] << 8)
    p.size = ip - offset
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

  static parse(data, offset) {
    const t = new ModulatorList
    let ip = offset

    t.sourceOper += data[ip++] | (data[ip++] << 8)
    const code = data[ip++] | (data[ip++] << 8)
    t.destinationOper = code
    
    const key = GeneratorEnumeratorTable[code]
    t.type = key

    if (key === void 0) {
      // Amount
      t.value = {
        code: code,
        amount: data[ip] | (data[ip+1] << 8) << 16 >> 16,
        lo: data[ip++],
        hi: data[ip++]
      }
    } else {
      // Amount
      switch (key) {
        case 'keyRange': /* FALLTHROUGH */
        case 'velRange': /* FALLTHROUGH */
        case 'keynum': /* FALLTHROUGH */
        case 'velocity':
          t.value = {
            lo: data[ip++],
            hi: data[ip++]
          }
          break
        default:
          t.value = {
            amount: data[ip++] | (data[ip++] << 8) << 16 >> 16
          }
          break
      }
    }
    
    t.amountSourceOper = data[ip++] | (data[ip++] << 8)
    t.transOper = data[ip++] | (data[ip++] << 8)

    t.size = ip - offset
    return t
  }
}

export class GeneratorList {
  /** @type {string} */
  type
  /** @type {Object} */
  value

  static parse(data, offset) {
    const t = new ModulatorList
    let ip = offset
    
    const code = data[ip++] | (data[ip++] << 8)
    const key = GeneratorEnumeratorTable[code]
    t.type = key

    if (key === void 0) {
      t.value = {
        code,
        amount: data[ip] | (data[ip+1] << 8) << 16 >> 16,
        lo: data[ip++],
        hi: data[ip++]
      }
    } else {
      switch (key) {
        case 'keynum': /* FALLTHROUGH */
        case 'keyRange': /* FALLTHROUGH */
        case 'velRange': /* FALLTHROUGH */
        case 'velocity':
          t.value = {
            lo: data[ip++],
            hi: data[ip++]
          }
          break
        default:
          t.value = {
            amount: data[ip++] | (data[ip++] << 8) << 16 >> 16
          }
          break
      }
    }

    t.size = ip - offset
    return t
  }
}

export class Instrument {
  /** @type {string} */
  instrumentName
  /** @type {number} */
  instrumentBagIndex
  
  static parse(data, offset) {
    const t = new Instrument()
    let ip = offset
    t.instrumentName = readString(data, ip, ip += 20)
    t.instrumentBagIndex = data[ip++] | (data[ip++] << 8)
    t.size = ip - offset
    return t
  }
}

export class InstrumentBag {
  /** @type {number} */
  instrumentGeneratorIndex
  /** @type {number} */
  instrumentModulatorIndex
  
  static parse(data, offset) {
    const t = new InstrumentBag()
    let ip = offset
    t.instrumentGeneratorIndex = data[ip++] | (data[ip++] << 8)
    t.instrumentModulatorIndex = data[ip++] | (data[ip++] << 8)
    t.size = ip - offset
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

  static parse(data, offset) {
    const s = new Sample()
    let ip = offset
    s.sampleName = readString(data, ip, ip += 20)
    s.start = (
      (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
    ) >>> 0
    s.end = (
      (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
    ) >>> 0
    s.startLoop = (
      (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
    ) >>> 0
    s.endLoop =  (
      (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
    ) >>> 0
    s.sampleRate = (
      (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
    ) >>> 0
    s.originalPitch = data[ip++]
    s.pitchCorrection = (data[ip++] << 24) >> 24
    s.sampleLink = data[ip++] | (data[ip++] << 8)
    s.sampleType = data[ip++] | (data[ip++] << 8)

    s.startLoop -= s.start
    s.endLoop -= s.start

    s.size = ip - offset
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
