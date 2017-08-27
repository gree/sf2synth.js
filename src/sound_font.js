/**
 * Parser で読み込んだサウンドフォントのデータを
 * Synthesizer から利用しやすい形にするクラス
 */ 
export default class SoundFont {
  constructor(parser) {
    /** @type {Array.<Array.<Object>>} */
    this.bankSet = createAllInstruments(parser)
  }

  getInstrumentKey(bankNumber, instrumentNumber, key) {
    const bank = this.bankSet[bankNumber]
    if (!bank) {
      console.warn(
        "bank not found: bank=%s instrument=%s",
        bankNumber,
        instrumentNumber
      )
      return null
    }

    const instrument = bank[instrumentNumber]
    if (!instrument) {
      // TODO
      console.warn(
        "instrument not found: bank=%s instrument=%s",
        bankNumber,
        instrumentNumber
      )
      return null
    }

    const instrumentKey = instrument[key]
    if (!instrumentKey) {
      // TODO
      console.warn(
        "instrument not found: bank=%s instrument=%s key=%s",
        bankNumber,
        instrumentNumber,
        key
      )
      return null
    }

    return instrumentKey
  }
}

function createInstrument({ instrument, instrumentZone, instrumentZoneGenerator, instrumentZoneModulator }) {
  /** @type {Array.<Object>} */
  const zone = instrumentZone
  /** @type {Array.<Object>} */
  const output = []

  // instrument -> instrument bag -> generator / modulator
  for (let i = 0; i < instrument.length; ++i) {
    const bagIndex    = instrument[i].instrumentBagIndex
    const bagIndexEnd = instrument[i+1] ? instrument[i+1].instrumentBagIndex : zone.length
    const zoneInfo = []

    // instrument bag
    for (let j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
      const instrumentGenerator = createInstrumentGenerator(zone, j, instrumentZoneGenerator)
      const instrumentModulator = createInstrumentModulator(zone, j, instrumentZoneModulator)

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

function createPreset({ presetHeader, presetZone, presetZoneGenerator, presetZoneModulator }) {
  /** @type {Array.<Object>} */
  const preset = presetHeader
  /** @type {Array.<Object>} */
  const zone = presetZone
  /** @type {Array.<Object>} */
  const output = []
  /** @type {number} */
  let instrument

  // preset -> preset bag -> generator / modulator
  for (let i = 0; i < preset.length; ++i) {
    const bagIndex    = preset[i].presetBagIndex
    const bagIndexEnd = preset[i+1] ? preset[i+1].presetBagIndex : zone.length
    const zoneInfo = []

    // preset bag
    for (let j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
      const presetGenerator = createPresetGenerator(zone, j, presetZoneGenerator)
      const presetModulator = createPresetModulator(zone, j, presetZoneModulator)

      zoneInfo.push({
        generator: presetGenerator.generator,
        generatorSequence: presetGenerator.generatorInfo,
        modulator: presetModulator.modulator,
        modulatorSequence: presetModulator.modulatorInfo
      })

      instrument =
        presetGenerator.generator.instrument !== undefined ?
          presetGenerator.generator.instrument.amount :
        presetModulator.modulator.instrument !== undefined ?
          presetModulator.modulator.instrument.amount :
        null
    }

    output.push({
      name: preset[i].presetName,
      info: zoneInfo,
      header: preset[i],
      instrument
    })
  }

  return output
}

function createAllInstruments(parser) {
  const presets = createPreset(parser)
  const instruments = createInstrument(parser)
  const banks = []

  for (let preset of presets) {
    const bankNumber = preset.header.bank
    const presetNumber = preset.header.preset

    if (typeof preset.instrument !== 'number') {
      continue
    }

    /** @type {Object} */
    const instrument = instruments[preset.instrument]
    if (instrument.name.replace(/\0*$/, '') === 'EOI') {
      continue
    }

    const notes = instrument.info
      .map(info => createNoteInfo(parser, info))
      .reduce((a, b) => Object.assign({}, a, b)) // merge objects

    // select bank
    if (banks[bankNumber] === undefined) {
      banks[bankNumber] = []
    }

    const bank = banks[bankNumber]
    bank[presetNumber] = {
      ...notes,
      name: preset.name
    }
  }

  return banks
}

function createNoteInfo(parser, info) {
  const { generator } = info

  if (generator['keyRange'] === undefined || generator['sampleID'] === undefined) {
    return
  }

  const volAttack  = getModGenAmount(generator, 'attackVolEnv',  -12000)
  const volDecay   = getModGenAmount(generator, 'decayVolEnv',   -12000)
  const volSustain = getModGenAmount(generator, 'sustainVolEnv')
  const volRelease = getModGenAmount(generator, 'releaseVolEnv', -12000)
  const modAttack  = getModGenAmount(generator, 'attackModEnv',  -12000)
  const modDecay   = getModGenAmount(generator, 'decayModEnv',   -12000)
  const modSustain = getModGenAmount(generator, 'sustainModEnv')
  const modRelease = getModGenAmount(generator, 'releaseModEnv', -12000)

  const tune = (
    getModGenAmount(generator, 'coarseTune') +
    getModGenAmount(generator, 'fineTune') / 100
  )
  const scale = getModGenAmount(generator, 'scaleTuning', 100) / 100
  const freqVibLFO = getModGenAmount(generator, 'freqVibLFO')
  const sampleId = getModGenAmount(generator, 'sampleID')
  const sampleHeader = parser.sampleHeader[sampleId]
  const basePitch = tune + (sampleHeader.pitchCorrection / 100) - getModGenAmount(generator, 'overridingRootKey', sampleHeader.originalPitch)

  const baseObj = {
    sample: parser.sample[sampleId],
    sampleRate: sampleHeader.sampleRate,
    sampleName: sampleHeader.sampleName,
    modEnvToPitch: getModGenAmount(generator, 'modEnvToPitch') / 100,
    scaleTuning: scale,
    start:
      getModGenAmount(generator, 'startAddrsCoarseOffset') * 32768 +
        getModGenAmount(generator, 'startAddrsOffset'),
    end:
      getModGenAmount(generator, 'endAddrsCoarseOffset') * 32768 +
        getModGenAmount(generator, 'endAddrsOffset'),
    loopStart: (
      //(sampleHeader.startLoop - sampleHeader.start) +
      (sampleHeader.startLoop) +
        getModGenAmount(generator, 'startloopAddrsCoarseOffset') * 32768 +
        getModGenAmount(generator, 'startloopAddrsOffset')
      ),
    loopEnd: (
      //(sampleHeader.endLoop - sampleHeader.start) +
      (sampleHeader.endLoop) +
        getModGenAmount(generator, 'endloopAddrsCoarseOffset') * 32768 +
        getModGenAmount(generator, 'endloopAddrsOffset')
      ),
    volAttack:  Math.pow(2, volAttack / 1200),
    volDecay:   Math.pow(2, volDecay / 1200),
    volSustain: volSustain / 1000,
    volRelease: Math.pow(2, volRelease / 1200),
    modAttack:  Math.pow(2, modAttack / 1200),
    modDecay:   Math.pow(2, modDecay / 1200),
    modSustain: modSustain / 1000,
    modRelease: Math.pow(2, modRelease / 1200),
    initialFilterFc: getModGenAmount(generator, 'initialFilterFc', 13500),
    modEnvToFilterFc: getModGenAmount(generator, 'modEnvToFilterFc'),
    initialFilterQ: getModGenAmount(generator, 'initialFilterQ'),
    freqVibLFO: freqVibLFO ? Math.pow(2, freqVibLFO / 1200) * 8.176 : undefined
  }

  const preset = {}

  for (let i = generator['keyRange'].lo; i <= generator['keyRange'].hi; ++i)  {
    preset[i] = {
      ...baseObj,
      basePlaybackRate: Math.pow(Math.pow(2, 1/12), (i + basePitch) * scale)
    }
  }

  return preset
}

/**
 * @param {Object} generator
 * @param {string} enumeratorType
 * @param {number=} opt_default
 * @returns {number}
 */
function getModGenAmount(generator, enumeratorType, opt_default = 0) {
  return generator[enumeratorType] ? generator[enumeratorType].amount : opt_default
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

  for (let i = indexStart; i < indexEnd; ++i) {
    const info = zoneModGen[i]
    modgenInfo.push(info)

    if (info.type === 'unknown') {
      modgen.unknown.push(info.value)
    } else {
      modgen[info.type] = info.value
    }
  }

  return { modgen, modgenInfo }
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