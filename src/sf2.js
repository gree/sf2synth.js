import { Chunk, Parser } from "./riff"

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

    this.parseRiffChunk(chunk)
  //console.log(this.sampleHeader)
    this.input = null
  }

  /**
   * @param {Chunk} chunk
   */
  parseRiffChunk(chunk) {
    /** @type {ByteArray} */
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset

    // check parse target
    if (chunk.type !== 'RIFF') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    // check signature
    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++])
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
    this.parseInfoList(/** @type {!Chunk} */(parser.getChunk(0)))

    // sdta-list
    this.parseSdtaList(/** @type {!Chunk} */(parser.getChunk(1)))

    // pdta-list
    this.parsePdtaList(/** @type {!Chunk} */(parser.getChunk(2)))
  }

  /**
   * @param {Chunk} chunk
   */
  parseInfoList(chunk) {
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    // check signature
    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++])
    if (signature !== 'INFO') {
      throw new Error('invalid signature:' + signature)
    }

    // read structure
    const parser = new Parser(data, {'index': ip, 'length': chunk.size - 4})
    parser.parse()
  }

  /**
   * @param {Chunk} chunk
   */
  parseSdtaList(chunk) {
    /** @type {ByteArray} */
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    // check signature
    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++])
    if (signature !== 'sdta') {
      throw new Error('invalid signature:' + signature)
    }

    // read structure
    const parser = new Parser(data, {'index': ip, 'length': chunk.size - 4})
    parser.parse()
    if (parser.chunkList.length !== 1) {
      throw new Error('TODO')
    }
    this.samplingData =
      /** @type {{type: string, size: number, offset: number}} */
      (parser.getChunk(0))
  }

  /**
   * @param {Chunk} chunk
   */
  parsePdtaList(chunk) {
    /** @type {ByteArray} */
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    // check signature
    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++])
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

    this.parsePhdr(/** @type {Chunk} */(parser.getChunk(0)))
    this.parsePbag(/** @type {Chunk} */(parser.getChunk(1)))
    this.parsePmod(/** @type {Chunk} */(parser.getChunk(2)))
    this.parsePgen(/** @type {Chunk} */(parser.getChunk(3)))
    this.parseInst(/** @type {Chunk} */(parser.getChunk(4)))
    this.parseIbag(/** @type {Chunk} */(parser.getChunk(5)))
    this.parseImod(/** @type {Chunk} */(parser.getChunk(6)))
    this.parseIgen(/** @type {Chunk} */(parser.getChunk(7)))
    this.parseShdr(/** @type {Chunk} */(parser.getChunk(8)))
  }

  /**
   * @param {Chunk} chunk
   */
  parsePhdr(chunk) {
    /** @type {ByteArray} */
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset
    /** @type {Array.<Object>} */
    const presetHeader = this.presetHeader = []
    /** @type {number} */
    const size = chunk.offset + chunk.size

    // check parse target
    if (chunk.type !== 'phdr') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    while (ip < size) {
      presetHeader.push({
        presetName: String.fromCharCode.apply(null, data.subarray(ip, ip += 20)),
        preset: data[ip++] | (data[ip++] << 8),
        bank: data[ip++] | (data[ip++] << 8),
        presetBagIndex: data[ip++] | (data[ip++] << 8),
        library: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0,
        genre: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0,
        morphology: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0
      })
    }
  }

  /**
   * @param {Chunk} chunk
   */
  parsePbag(chunk) {
    /** @type {ByteArray} */
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset
    /** @type {Array.<Object>} */
    const presetZone = this.presetZone = []
    /** @type {number} */
    const size = chunk.offset + chunk.size

    // check parse target
    if (chunk.type !== 'pbag') {
      throw new Error('invalid chunk type:'  + chunk.type)
    }

    while (ip < size) {
      presetZone.push({
        presetGeneratorIndex: data[ip++] | (data[ip++] << 8),
        presetModulatorIndex: data[ip++] | (data[ip++] << 8)
      })
    }
  }

  /**
   * @param {Chunk} chunk
   */
  parsePmod(chunk) {
    // check parse target
    if (chunk.type !== 'pmod') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    this.presetZoneModulator = this.parseModulator(chunk)
  }

  /**
   * @param {Chunk} chunk
   */
  parsePgen(chunk) {
    // check parse target
    if (chunk.type !== 'pgen') {
      throw new Error('invalid chunk type:' + chunk.type)
    }
    this.presetZoneGenerator = this.parseGenerator(chunk)
  }

  /**
   * @param {Chunk} chunk
   */
  parseInst(chunk) {
    /** @type {ByteArray} */
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset
    /** @type {Array.<Object>} */
    const instrument = this.instrument = []
    /** @type {number} */
    const size = chunk.offset + chunk.size

    // check parse target
    if (chunk.type !== 'inst') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    while (ip < size) {
      instrument.push({
        instrumentName: String.fromCharCode.apply(null, data.subarray(ip, ip += 20)),
        instrumentBagIndex: data[ip++] | (data[ip++] << 8)
      })
    }
  }

  /**
   * @param {Chunk} chunk
   */
  parseIbag(chunk) {
    /** @type {ByteArray} */
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset
    /** @type {Array.<Object>} */
    const instrumentZone = this.instrumentZone = []
    /** @type {number} */
    const size = chunk.offset + chunk.size

    // check parse target
    if (chunk.type !== 'ibag') {
      throw new Error('invalid chunk type:' + chunk.type)
    }


    while (ip < size) {
      instrumentZone.push({
        instrumentGeneratorIndex: data[ip++] | (data[ip++] << 8),
        instrumentModulatorIndex: data[ip++] | (data[ip++] << 8)
      })
    }
  }

  /**
   * @param {Chunk} chunk
   */
  parseImod(chunk) {
    // check parse target
    if (chunk.type !== 'imod') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    this.instrumentZoneModulator = this.parseModulator(chunk)
  }


  /**
   * @param {Chunk} chunk
   */
  parseIgen(chunk) {
    // check parse target
    if (chunk.type !== 'igen') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    this.instrumentZoneGenerator = this.parseGenerator(chunk)
  }

  /**
   * @param {Chunk} chunk
   */
  parseShdr(chunk) {
    /** @type {ByteArray} */
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset
    /** @type {Array.<Object>} */
    const samples = this.sample = []
    /** @type {Array.<Object>} */
    const sampleHeader = this.sampleHeader = []
    /** @type {number} */
    const size = chunk.offset + chunk.size

    // check parse target
    if (chunk.type !== 'shdr') {
      throw new Error('invalid chunk type:' + chunk.type)
    }

    while (ip < size) {
      const sampleName = String.fromCharCode.apply(null, data.subarray(ip, ip += 20))
      const start = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0
      const end = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0
      let startLoop = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0
      let endLoop =  (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0
      let sampleRate = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0
      const originalPitch = data[ip++]
      const pitchCorrection = (data[ip++] << 24) >> 24
      const sampleLink = data[ip++] | (data[ip++] << 8)
      const sampleType = data[ip++] | (data[ip++] << 8)

      //*
      let sample = new Int16Array(new Uint8Array(data.subarray(
        this.samplingData.offset + start * 2,
        this.samplingData.offset + end   * 2
      )).buffer)

      startLoop -= start
      endLoop -= start

      if (sampleRate > 0) {
        console.log(sample.length)
        const adjust = this.adjustSampleData(sample, sampleRate)
        sample = adjust.sample
        sampleRate *= adjust.multiply
        startLoop *= adjust.multiply
        endLoop *= adjust.multiply
      }

      samples.push(sample)
      //*/

      sampleHeader.push({
        sampleName,
        /*
        start: start,
        end: end,
        */
        startLoop,
        endLoop,
        sampleRate,
        originalPitch,
        pitchCorrection,
        sampleLink,
        sampleType
      })
    }
  }

  adjustSampleData(sample, sampleRate) {
    /** @type {number} */
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
   * @param {Chunk} chunk
   * @return {Array.<Object>}
   */
  parseModulator(chunk) {
    /** @type {ByteArray} */
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset
    /** @type {number} */
    const size = chunk.offset + chunk.size
    /** @type {Array.<Object>} */
    const output = []

    while (ip < size) {
      // Src  Oper
      // TODO
      ip += 2

      // Dest Oper
      const code = data[ip++] | (data[ip++] << 8)
      const key = GeneratorEnumeratorTable[code]
      if (key === void 0) {
        // Amount
        output.push({
          type: key,
          value: {
            code: code,
            amount: data[ip] | (data[ip+1] << 8) << 16 >> 16,
            lo: data[ip++],
            hi: data[ip++]
          }
        })
      } else {
        // Amount
        switch (key) {
          case 'keyRange': /* FALLTHROUGH */
          case 'velRange': /* FALLTHROUGH */
          case 'keynum': /* FALLTHROUGH */
          case 'velocity':
            output.push({
              type: key,
              value: {
                lo: data[ip++],
                hi: data[ip++]
              }
            })
            break
          default:
            output.push({
              type: key,
              value: {
                amount: data[ip++] | (data[ip++] << 8) << 16 >> 16
              }
            })
            break
        }
      }

      // AmtSrcOper
      // TODO
      ip += 2

      // Trans Oper
      // TODO
      ip += 2
    }

    return output
  }

  /**
   * @param {Chunk} chunk
   * @return {Array.<Object>}
   */
  parseGenerator(chunk) {
    /** @type {ByteArray} */
    const data = this.input
    /** @type {number} */
    let ip = chunk.offset
    /** @type {number} */
    const size = chunk.offset + chunk.size
    /** @type {Array.<Object>} */
    const output = []

    while (ip < size) {
      const code = data[ip++] | (data[ip++] << 8)
      const key = GeneratorEnumeratorTable[code]
      if (key === void 0) {
        output.push({
          type: key,
          value: {
            code,
            amount: data[ip] | (data[ip+1] << 8) << 16 >> 16,
            lo: data[ip++],
            hi: data[ip++]
          }
        })
        continue
      }

      switch (key) {
        case 'keynum': /* FALLTHROUGH */
        case 'keyRange': /* FALLTHROUGH */
        case 'velRange': /* FALLTHROUGH */
        case 'velocity':
          output.push({
            type: key,
            value: {
              lo: data[ip++],
              hi: data[ip++]
            }
          })
          break
        default:
          output.push({
            type: key,
            value: {
              amount: data[ip++] | (data[ip++] << 8) << 16 >> 16
            }
          })
          break
      }
    }

    return output
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
        const instrumentGenerator = this.createInstrumentGenerator_(zone, j)
        const instrumentModulator = this.createInstrumentModulator_(zone, j)

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
    const preset   = this.presetHeader
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
        const presetGenerator = this.createPresetGenerator_(zone, j)
        const presetModulator = this.createPresetModulator_(zone, j)

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

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @returns {{generator: Object, generatorInfo: Array.<Object>}}
   * @private
   */
  createInstrumentGenerator_(zone, index) {
    const modgen = this.createBagModGen_(
      zone,
      zone[index].instrumentGeneratorIndex,
      zone[index+1] ? zone[index+1].instrumentGeneratorIndex: this.instrumentZoneGenerator.length,
      this.instrumentZoneGenerator
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
   * @private
   */
  createInstrumentModulator_(zone, index) {
    const modgen = this.createBagModGen_(
      zone,
      zone[index].presetModulatorIndex,
      zone[index+1] ? zone[index+1].instrumentModulatorIndex: this.instrumentZoneModulator.length,
      this.instrumentZoneModulator
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
   * @private
   */
  createPresetGenerator_(zone, index) {
    const modgen = this.createBagModGen_(
      zone,
      zone[index].presetGeneratorIndex,
      zone[index+1] ? zone[index+1].presetGeneratorIndex : this.presetZoneGenerator.length,
      this.presetZoneGenerator
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
     * @private
     */
  createPresetModulator_(zone, index) {
    /** @type {{modgen: Object, modgenInfo: Array.<Object>}} */
    const modgen = this.createBagModGen_(
      zone,
      zone[index].presetModulatorIndex,
      zone[index+1] ? zone[index+1].presetModulatorIndex : this.presetZoneModulator.length,
      this.presetZoneModulator
    )

    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo
    }
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} indexStart
   * @param {number} indexEnd
   * @param zoneModGen
   * @returns {{modgen: Object, modgenInfo: Array.<Object>}}
   * @private
   */
  createBagModGen_(zone, indexStart, indexEnd, zoneModGen) {
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
}

const GeneratorEnumeratorTable = [
  'startAddrsOffset',
  'endAddrsOffset',
  'startloopAddrsOffset',
  'endloopAddrsOffset',
  'startAddrsCoarseOffset',
  'modLfoToPitch',
  'vibLfoToPitch',
  'modEnvToPitch',
  'initialFilterFc',
  'initialFilterQ',
  'modLfoToFilterFc',
  'modEnvToFilterFc',
  'endAddrsCoarseOffset',
  'modLfoToVolume',
  , // 14
  'chorusEffectsSend',
  'reverbEffectsSend',
  'pan',
  ,,, // 18,19,20
  'delayModLFO',
  'freqModLFO',
  'delayVibLFO',
  'freqVibLFO',
  'delayModEnv',
  'attackModEnv',
  'holdModEnv',
  'decayModEnv',
  'sustainModEnv',
  'releaseModEnv',
  'keynumToModEnvHold',
  'keynumToModEnvDecay',
  'delayVolEnv',
  'attackVolEnv',
  'holdVolEnv',
  'decayVolEnv',
  'sustainVolEnv',
  'releaseVolEnv',
  'keynumToVolEnvHold',
  'keynumToVolEnvDecay',
  'instrument',
  , // 42
  'keyRange',
  'velRange',
  'startloopAddrsCoarseOffset',
  'keynum',
  'velocity',
  'initialAttenuation',
  , // 49
  'endloopAddrsCoarseOffset',
  'coarseTune',
  'fineTune',
  'sampleID',
  'sampleModes',
  , // 55
  'scaleTuning',
  'exclusiveClass',
  'overridingRootKey'
]
