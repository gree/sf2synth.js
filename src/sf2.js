import { Chunk, Parser } from "./riff"
import { PresetHeader, Sample, PresetBag, Instrument, InstrumentBag, ModulatorList, GeneratorList } from "./sf2_data"
import { readString } from "./helper"
import Stream from "./stream"

export default class {
  /** @type {ByteArray} */
  input
  /** @type {(Object|undefined)} */
  parserOption
  /** @type {Array.<Object>} */
  presetHeader
  /** @type {Array.<Object>} */
  presetZone
  /** @type {Array.<Object>} */
  presetZoneModulator
  /** @type {Array.<Object>} */
  presetZoneGenerator
  /** @type {Array.<Object>} */
  instrument
  /** @type {Array.<Object>} */
  instrumentZone
  /** @type {Array.<Object>} */
  instrumentZoneModulator
  /** @type {Array.<Object>} */
  instrumentZoneGenerator
  /** @type {Array.<Object>} */
  sampleHeader

  /**
   * @param {ByteArray} input
   * @param {Object=} opt_params
   * @constructor
   */
  constructor(input, opt_params = {}) {
    this.input = input
    this.parserOption = opt_params.parserOption
  }

  parse() {
    /** @type {Parser} */
    const parser = new Parser(this.input, this.parserOption)

    // parse RIFF chunk
    parser.parse()
    if (parser.chunkList.length !== 1) {
      throw new Error('wrong chunk length')
    }

    /** @type {?Chunk} */
    const chunk = parser.getChunk(0)
    if (chunk === null) {
      throw new Error('chunk not found')
    }

    this.parseRiffChunk(chunk, this.input)
    this.input = null
  }

  /**
   * @param {Chunk} chunk
   * @param {ByteArray} data
   */
  parseRiffChunk(chunk, data) {
    const chunkList = getChunkList(chunk, data, "RIFF", "sfbk")

    if (chunkList.length !== 3) {
      throw new Error('invalid sfbk structure')
    }

    // INFO-list
    this.info = parseInfoList(chunkList[0], data)

    // sdta-list
    this.samplingData = parseSdtaList(chunkList[1], data)

    // pdta-list
    this.parsePdtaList(chunkList[2], data)
  }

  /**
   * @param {Chunk} chunk
   * @param {ByteArray} data
   */
  parsePdtaList(chunk, data) {
    const chunkList = getChunkList(chunk, data, "LIST", "pdta")

    // check number of chunks
    if (chunkList.length !== 9) {
      throw new Error('invalid pdta chunk')
    }

    this.presetHeader = parsePhdr(chunkList[0], data)
    this.presetZone = parsePbag(chunkList[1], data)
    this.presetZoneModulator = parsePmod(chunkList[2], data)
    this.presetZoneGenerator = parsePgen(chunkList[3], data)
    this.instrument = parseInst(chunkList[4], data)
    this.instrumentZone = parseIbag(chunkList[5], data)
    this.instrumentZoneModulator = parseImod(chunkList[6], data)
    this.instrumentZoneGenerator = parseIgen(chunkList[7], data)
    this.sampleHeader = parseShdr(chunkList[8], data)
    this.sample = loadSample(this.sampleHeader, this.samplingData.offset, data)
  }

  createInstrument() {
    /** @type {Array.<Object>} */
    const instrument = this.instrument
    /** @type {Array.<Object>} */
    const zone = this.instrumentZone
    /** @type {Array.<Object>} */
    const output = []

    // instrument -> instrument bag -> generator / modulator
    for (let i = 0, il = instrument.length; i < il; ++i) {
      const bagIndex    = instrument[i].instrumentBagIndex
      const bagIndexEnd = instrument[i+1] ? instrument[i+1].instrumentBagIndex : zone.length
      const zoneInfo = []

      // instrument bag
      for (let j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
        const instrumentGenerator = createInstrumentGenerator(zone, j, this.instrumentZoneGenerator)
        const instrumentModulator = createInstrumentModulator(zone, j, this.instrumentZoneModulator)

        zoneInfo.push({
          generator: instrumentGenerator.generator,
          generatorSequence: instrumentGenerator.generatorInfo,
          modulator: instrumentModulator.modulator,
          modulatorSequence: instrumentModulator.modulatorInfo
        })
      }

      output.push({
        name: instrument[i].instrumentName,
        info: zoneInfo
      })
    }

    return output
  }

  createPreset() {
    /** @type {Array.<Object>} */
    const preset = this.presetHeader
    /** @type {Array.<Object>} */
    const zone = this.presetZone
    /** @type {Array.<Object>} */
    const output = []
    /** @type {number} */
    let instrument

    // preset -> preset bag -> generator / modulator
    for (let i = 0, il = preset.length; i < il; ++i) {
      const bagIndex    = preset[i].presetBagIndex
      const bagIndexEnd = preset[i+1] ? preset[i+1].presetBagIndex : zone.length
      const zoneInfo = []

      // preset bag
      for (let j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
        const presetGenerator = createPresetGenerator(zone, j, this.presetZoneGenerator)
        const presetModulator = createPresetModulator(zone, j, this.presetZoneModulator)

        zoneInfo.push({
          generator: presetGenerator.generator,
          generatorSequence: presetGenerator.generatorInfo,
          modulator: presetModulator.modulator,
          modulatorSequence: presetModulator.modulatorInfo
        })

        instrument =
          presetGenerator.generator.instrument !== void 0 ?
            presetGenerator.generator.instrument.amount :
          presetModulator.modulator.instrument !== void 0 ?
            presetModulator.modulator.instrument.amount :
          null
      }

      output.push({
        name: preset[i].presetName,
        info: zoneInfo,
        header: preset[i],
        instrument: instrument
      })
    }

    return output
  }
}

const InfoNameTable = {
  ICMT: "comment",
  ICOP: "copyright",
  ICRD: "creation_date",
  IENG: "engineer",
  INAM: "name",
  IPRD: "product",
  ISFT: "software",
  ifil: "version",
  isng: "sound_engine",
  irom: "rom_name",
  iver: "rom_version"
}

function getChunkList(chunk, data, expectedType, expectedSignature) {
  // check parse target
  if (chunk.type !== expectedType) {
    throw new Error('invalid chunk type:' + chunk.type)
  }

  const stream = new Stream(data, chunk.offset)

  // check signature
  const signature = stream.readString(4)
  if (signature !== expectedSignature) {
    throw new Error('invalid signature:' + signature)
  }

  // read structure
  const parser = new Parser(data, {'index': stream.ip, 'length': chunk.size - 4})
  parser.parse()

  return parser.chunkList
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Object}
 */
function parseInfoList(chunk, data) {
  const info = {}
  const chunkList = getChunkList(chunk, data, "LIST", "INFO")

  for (let p of chunkList) {
    const { offset, size, type } = p
    const name = InfoNameTable[type] || type
    info[name] = readString(data, offset, offset + size)
  }

  return info
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Chunk}
 */
function parseSdtaList(chunk, data) {
  const chunkList = getChunkList(chunk, data, "LIST", "sdta")

  if (chunkList.length !== 1) {
    throw new Error('TODO')
  }

  return chunkList[0]
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @param {string} type
 * @return {Array.<Object>}
 */
function parseChunk(chunk, data, type, factory) {
  const result = []

  if (chunk.type !== type) {
    throw new Error('invalid chunk type:'  + chunk.type)
  }
  
  const stream = new Stream(data, chunk.offset)
  const size = chunk.offset + chunk.size
  
  while (stream.ip < size) {
    result.push(factory(stream))
  }

  return result
}

const parsePhdr = (chunk, data) => parseChunk(chunk, data, "phdr", stream => PresetHeader.parse(stream))
const parsePbag = (chunk, data) => parseChunk(chunk, data, "pbag", stream => PresetBag.parse(stream))
const parseInst = (chunk, data) => parseChunk(chunk, data, "inst", stream => Instrument.parse(stream))
const parseIbag = (chunk, data) => parseChunk(chunk, data, "ibag", stream => InstrumentBag.parse(stream))
const parsePmod = (chunk, data) => parseChunk(chunk, data, "pmod", stream => ModulatorList.parse(stream))
const parseImod = (chunk, data) => parseChunk(chunk, data, "imod", stream => ModulatorList.parse(stream))
const parsePgen = (chunk, data) => parseChunk(chunk, data, "pgen", stream => GeneratorList.parse(stream))
const parseIgen = (chunk, data) => parseChunk(chunk, data, "igen", stream => GeneratorList.parse(stream))
const parseShdr = (chunk, data) => parseChunk(chunk, data, "shdr", stream => Sample.parse(stream))

function adjustSampleData(sample, sampleRate) {
  let multiply = 1

  // buffer
  while (sampleRate < 22050) {
    const newSample = new Int16Array(sample.length * 2)
    for (let i = 0, j = 0, il = sample.length; i < il; ++i) {
      newSample[j++] = sample[i]
      newSample[j++] = sample[i]
    }
    sample = newSample
    multiply *= 2
    sampleRate *= 2
  }

  return {
    sample,
    multiply
  }
}

/**
 * @param {Array.<Object>} zone
 * @param {number} indexStart
 * @param {number} indexEnd
 * @param zoneModGen
 * @returns {{modgen: Object, modgenInfo: Array.<Object>}}
 */
function createBagModGen(zone, indexStart, indexEnd, zoneModGen) {
  /** @type {Array.<Object>} */
  const modgenInfo = []
  /** @type {Object} */
  const modgen = {
    unknown: [],
    'keyRange': {
      hi: 127,
      lo: 0
    }
  }; // TODO

  for (let i = indexStart, il = indexEnd; i < il; ++i) {
    const info = zoneModGen[i]
    modgenInfo.push(info)

    if (info.type === 'unknown') {
      modgen.unknown.push(info.value)
    } else {
      modgen[info.type] = info.value
    }
  }

  return {
    modgen: modgen,
    modgenInfo: modgenInfo
  }
}

/**
 * @param {Array.<Object>} zone
 * @param {number} index
 * @returns {{generator: Object, generatorInfo: Array.<Object>}}
 */
function createInstrumentGenerator(zone, index, instrumentZoneGenerator) {
  const modgen = createBagModGen(
    zone,
    zone[index].instrumentGeneratorIndex,
    zone[index+1] ? zone[index+1].instrumentGeneratorIndex: instrumentZoneGenerator.length,
    instrumentZoneGenerator
  )

  return {
    generator: modgen.modgen,
    generatorInfo: modgen.modgenInfo
  }
}

/**
 * @param {Array.<Object>} zone
 * @param {number} index
 * @returns {{modulator: Object, modulatorInfo: Array.<Object>}}
 */
function createInstrumentModulator(zone, index, instrumentZoneModulator) {
  const modgen = createBagModGen(
    zone,
    zone[index].presetModulatorIndex,
    zone[index+1] ? zone[index+1].instrumentModulatorIndex: instrumentZoneModulator.length,
    instrumentZoneModulator
  )

  return {
    modulator: modgen.modgen,
    modulatorInfo: modgen.modgenInfo
  }
}

/**
 * @param {Array.<Object>} zone
 * @param {number} index
 * @returns {{generator: Object, generatorInfo: Array.<Object>}}
 */
function createPresetGenerator(zone, index, presetZoneGenerator) {
  const modgen = createBagModGen(
    zone,
    zone[index].presetGeneratorIndex,
    zone[index+1] ? zone[index+1].presetGeneratorIndex : presetZoneGenerator.length,
    presetZoneGenerator
  )

  return {
    generator: modgen.modgen,
    generatorInfo: modgen.modgenInfo
  }
}

/**
 * @param {Array.<Object>} zone
 * @param {number} index
 * @returns {{modulator: Object, modulatorInfo: Array.<Object>}}
 */
function createPresetModulator(zone, index, presetZoneModulator) {
  /** @type {{modgen: Object, modgenInfo: Array.<Object>}} */
  const modgen = createBagModGen(
    zone,
    zone[index].presetModulatorIndex,
    zone[index+1] ? zone[index+1].presetModulatorIndex : presetZoneModulator.length,
    presetZoneModulator
  )

  return {
    modulator: modgen.modgen,
    modulatorInfo: modgen.modgenInfo
  }
}

function loadSample(sampleHeader, samplingDataOffset, data) {
  const samples = []
  for (let header of sampleHeader) {
    let sample = new Int16Array(new Uint8Array(data.subarray(
      samplingDataOffset + header.start * 2,
      samplingDataOffset + header.end   * 2
    )).buffer)
    if (header.sampleRate > 0) {
      const adjust = adjustSampleData(sample, header.sampleRate)
      sample = adjust.sample
      header.sampleRate *= adjust.multiply
      header.startLoop *= adjust.multiply
      header.endLoop *= adjust.multiply
    }
    samples.push(sample)
  }
  return samples
}