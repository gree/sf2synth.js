import { Chunk, Parser } from "./riff"
import { PresetHeader, Sample, PresetBag, Instrument, InstrumentBag, ModulatorList, GeneratorList } from "./sf2_data"
import { readString } from "./helper"
import Stream from "./stream"

export default class {
  /**
   * @param {ByteArray} input
   * @param {Object=} opt_params
   * @constructor
   */
  constructor(input, opt_params = {}) {
    /** @type {ByteArray} */
    this.input = input
    /** @type {(Object|undefined)} */
    this.parserOption = opt_params.parserOption

    /** @type {Array.<Object>} */
    this.presetHeader
    /** @type {Array.<Object>} */
    this.presetZone
    /** @type {Array.<Object>} */
    this.presetZoneModulator
    /** @type {Array.<Object>} */
    this.presetZoneGenerator
    /** @type {Array.<Object>} */
    this.instrument
    /** @type {Array.<Object>} */
    this.instrumentZone
    /** @type {Array.<Object>} */
    this.instrumentZoneModulator
    /** @type {Array.<Object>} */
    this.instrumentZoneGenerator
    /** @type {Array.<Object>} */
    this.sampleHeader
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
    let ip = chunk.offset

    // check parse target
    if (chunk.type !== 'RIFF') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    // check signature
    const signature = readString(data, ip, ip += 4)
    if (signature !== 'sfbk') {
      throw new Error('invalid signature:' + signature)
    }

    // read structure
    const parser = new Parser(data, {'index': ip, 'length': chunk.size - 4})
    parser.parse()
    if (parser.getNumberOfChunks() !== 3) {
      throw new Error('invalid sfbk structure')
    }

    // INFO-list
    this.info = parseInfoList(parser.getChunk(0), data)

    // sdta-list
    this.samplingData = parseSdtaList(parser.getChunk(1), data)

    // pdta-list
    this.parsePdtaList(parser.getChunk(2), data)
  }

  /**
   * @param {Chunk} chunk
   * @param {ByteArray} data
   */
  parsePdtaList(chunk, data) {
    let ip = chunk.offset

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    // check signature
    const signature = readString(data, ip, ip += 4)
    if (signature !== 'pdta') {
      throw new Error('invalid signature:' + signature)
    }

    // read structure
    const parser = new Parser(data, {'index': ip, 'length': chunk.size - 4})
    parser.parse()

    // check number of chunks
    if (parser.getNumberOfChunks() !== 9) {
      throw new Error('invalid pdta chunk')
    }

    this.presetHeader = parsePhdr(parser.getChunk(0), data)
    this.presetZone = parsePbag(parser.getChunk(1), data)
    this.presetZoneModulator = parsePmod(parser.getChunk(2), data)
    this.presetZoneGenerator = parsePgen(parser.getChunk(3), data)
    this.instrument = parseInst(parser.getChunk(4), data)
    this.instrumentZone = parseIbag(parser.getChunk(5), data)
    this.instrumentZoneModulator = parseImod(parser.getChunk(6), data)
    this.instrumentZoneGenerator = parseIgen(parser.getChunk(7), data)
    this.parseShdr(parser.getChunk(8), data)
  }

  /**
   * @param {Chunk} chunk
   */
  parseShdr(chunk, data) {
    /** @type {Array.<Object>} */
    const samples = this.sample = []
    /** @type {Array.<Object>} */
    const sampleHeader = this.sampleHeader = []

    let ip = chunk.offset
    const size = chunk.offset + chunk.size

    // check parse target
    if (chunk.type !== 'shdr') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    while (ip < size) {
      let header = Sample.parse(data, ip)
      ip += header.size
  
      let sample = new Int16Array(new Uint8Array(data.subarray(
        this.samplingData.offset + header.start * 2,
        this.samplingData.offset + header.end   * 2
      )).buffer)

      if (header.sampleRate > 0) {
        const adjust = adjustSampleData(sample, header.sampleRate)
        sample = adjust.sample
        header.sampleRate *= adjust.multiply
        header.startLoop *= adjust.multiply
        header.endLoop *= adjust.multiply
      }

      samples.push(sample)
      sampleHeader.push(header)
    }
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

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Object}
 */
function parseInfoList(chunk, data) {
  /** @type {number} */
  let ip = chunk.offset

  // check parse target
  if (chunk.type !== 'LIST') {
    throw new Error('invalid chunk type:' + chunk.type)
  }

  // check signature
  const signature = readString(data, ip, ip += 4)
  if (signature !== 'INFO') {
    throw new Error('invalid signature:' + signature)
  }

  // read structure
  const parser = new Parser(data, {'index': ip, 'length': chunk.size - 4})
  parser.parse()
  const list = parser.chunkList
  const info = {}
  for (let p of parser.chunkList) {
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
  /** @type {number} */
  let ip = chunk.offset

  // check parse target
  if (chunk.type !== 'LIST') {
    throw new Error('invalid chunk type:' + chunk.type)
  }

  // check signature
  const signature = readString(data, ip, ip += 4)
  if (signature !== 'sdta') {
    throw new Error('invalid signature:' + signature)
  }

  // read structure
  const parser = new Parser(data, {'index': ip, 'length': chunk.size - 4})
  parser.parse()
  if (parser.chunkList.length !== 1) {
    throw new Error('TODO')
  }

  return parser.getChunk(0)
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Array.<Object>}
 */
function parsePhdr(chunk, data) {
  const presetHeader = []
  const stream = new Stream(data, chunk.offset)
  const size = chunk.offset + chunk.size

  // check parse target
  if (chunk.type !== 'phdr') {
    throw new Error('invalid chunk type:' + chunk.type)
  }

  while (stream.ip < size) {
    presetHeader.push(PresetHeader.parse(stream))
  }

  return presetHeader
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Array.<Object>}
 */
function parsePbag(chunk, data) {
  /** @type {Array.<Object>} */
  const presetZone = []
  const stream = new Stream(data, chunk.offset)
  const size = chunk.offset + chunk.size

  // check parse target
  if (chunk.type !== 'pbag') {
    throw new Error('invalid chunk type:'  + chunk.type)
  }

  while (stream.ip < size) {
    presetZone.push(PresetBag.parse(stream))
  }

  return presetZone
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Array.<Object>}
 */
function parsePmod(chunk, data) {
  // check parse target
  if (chunk.type !== 'pmod') {
    throw new Error('invalid chunk type:' + chunk.type)
  }

  return parseModulator(chunk, data)
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Array.<Object>}
 */
function parsePgen(chunk, data) {
  // check parse target
  if (chunk.type !== 'pgen') {
    throw new Error('invalid chunk type:' + chunk.type)
  }
  return parseGenerator(chunk, data)
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Array.<Object>}
 */
function parseModulator(chunk, data) {
  /** @type {Array.<Object>} */
  const output = []
  const stream = new Stream(data, chunk.offset)
  const size = chunk.offset + chunk.size

  while (stream.ip < size) {
    output.push(ModulatorList.parse(stream))
  }

  return output
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Array.<Object>}
 */
function parseInst(chunk, data) {
  /** @type {Array.<Object>} */
  const instrument = []
  const stream = new Stream(data, chunk.offset)
  const size = chunk.offset + chunk.size

  // check parse target
  if (chunk.type !== 'inst') {
    throw new Error('invalid chunk type:' + chunk.type)
  }

  while (stream.ip < size) {
    instrument.push(Instrument.parse(stream))
  }

  return instrument
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Array.<Object>}
 */
function parseIbag(chunk, data) {
  /** @type {Array.<Object>} */
  const instrumentZone = []
  const stream = new Stream(data, chunk.offset)
  const size = chunk.offset + chunk.size

  // check parse target
  if (chunk.type !== 'ibag') {
    throw new Error('invalid chunk type:' + chunk.type)
  }


  while (stream.ip < size) {
    instrumentZone.push(InstrumentBag.parse(stream))
  }

  return instrumentZone
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Array.<Object>}
 */
function parseImod(chunk, data) {
  // check parse target
  if (chunk.type !== 'imod') {
    throw new Error('invalid chunk type:' + chunk.type)
  }

  return parseModulator(chunk, data)
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Array.<Object>}
 */
function parseIgen(chunk, data) {
  // check parse target
  if (chunk.type !== 'igen') {
    throw new Error('invalid chunk type:' + chunk.type)
  }

  return parseGenerator(chunk, data)
}

/**
 * @param {Chunk} chunk
 * @param {ByteArray} data
 * @return {Array.<Object>}
 */
function parseGenerator(chunk, data) {
  /** @type {Array.<Object>} */
  const output = []
  const stream = new Stream(data, chunk.offset)
  const size = chunk.offset + chunk.size

  while (stream.ip < size) {
    output.push(GeneratorList.parse(stream))
  }

  return output
}

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