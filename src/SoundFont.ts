import Parser, { InstrumentZone } from "./Parser"

/**
 * Parser で読み込んだサウンドフォントのデータを
 * Synthesizer から利用しやすい形にするクラス
 */
export default class SoundFont {
  bankSet: Object[]

  constructor(parser) {
    this.bankSet = createAllInstruments(parser)
  }

  getInstrumentKey(bankNumber, instrumentNumber, key, velocity = 100) {
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

    const instrumentKey = instrument.notes.filter(i => {
      let isInKeyRange = false
      if (i.keyRange) {
        isInKeyRange = key >= i.keyRange.lo && key <= i.keyRange.hi
      }

      let isInVelRange = true
      if (i.velRange) {
        isInVelRange = velocity >= i.velRange.lo && velocity <= i.velRange.hi
      }

      return isInKeyRange && isInVelRange
    })[0]

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

function createInstrument({ instrument, instrumentZone, instrumentZoneGenerator, instrumentZoneModulator }: 
  { instrument: { instrumentName: string, instrumentBagIndex: number }[], 
    instrumentZone: InstrumentZone[], 
    instrumentZoneGenerator: {}[], 
    instrumentZoneModulator: {}[] 
  }): 
  { name: string, info: { generator: { sampleID: number, keyRange: { hi: number, lo: number } } }[] }[] {
  const zone = instrumentZone
  const output = []

  // instrument -> instrument bag -> generator / modulator
  for (let i = 0; i < instrument.length; ++i) {
    const bagIndex = instrument[i].instrumentBagIndex
    const bagIndexEnd = instrument[i + 1] ? instrument[i + 1].instrumentBagIndex : zone.length
    const zoneInfo = []

    // instrument bag
    for (let j = bagIndex; j < bagIndexEnd; ++j) {
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

function createPreset({ presetHeader, presetZone, presetZoneGenerator, presetZoneModulator }): {
  info: { presetGenerator: { generator: { instrument: { amount: number } } } }[], 
  header: { bank: number, preset: number, presetName: string } 
}[] {
  // preset -> preset bag -> generator / modulator
  return presetHeader.map((preset, i) => {
    const nextPreset = presetHeader[i + 1]
    const bagIndex = preset.presetBagIndex
    const bagIndexEnd = nextPreset ? nextPreset.presetBagIndex : presetZone.length
    const zoneInfo = []

    // preset bag
    for (let j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
      zoneInfo.push({
        presetGenerator: createPresetGenerator(presetZone, j, presetZoneGenerator),
        presetModulator: createPresetModulator(presetZone, j, presetZoneModulator)
      })
    }

    return {
      info: zoneInfo,
      header: preset
    }
  })
}

function createAllInstruments(parser: Parser): {}[] {
  const presets = createPreset(parser)
  const instruments = createInstrument(parser)
  const banks: {}[] = []

  for (let preset of presets) {
    const bankNumber = preset.header.bank
    const presetNumber = preset.header.preset

    const notes = preset.info
      .map(info => info.presetGenerator.generator)
      .map(generator => {
        if (generator.instrument === undefined) {
          return null
        }
        const instrumentNumber = generator.instrument.amount
        const instrument = instruments[instrumentNumber]

        // use the first generator in the zone as the default value
        let baseGenerator
        if (instrument.info[0].generator) {
          const generator = instrument.info[0].generator
          if (generator.sampleID === undefined && generator.keyRange.lo === 0 && generator.keyRange.hi === 127) {
            baseGenerator = generator
          }
        }
        return instrument.info
          .map(info => createNoteInfo(parser, info.generator, baseGenerator))
          .filter(x => x) // remove null
      })
      .filter(x => x) // remove null
      .reduce((a, b) => a.concat(b), []) // flatten

    // select bank
    if (banks[bankNumber] === undefined) {
      banks[bankNumber] = []
    }

    const bank = banks[bankNumber]
    bank[presetNumber] = {
      notes,
      name: preset.header.presetName
    }
  }

  return banks
}

function createNoteInfo(parser: Parser, targetGenerator: {}, baseGenerator: {}) {
  const generator = { ...baseGenerator, ...targetGenerator }

  const { keyRange, sampleID, velRange } = generator as any
  if (keyRange === undefined || sampleID === undefined) {
    return null
  }

  const volAttack = getModGenAmount(generator, 'attackVolEnv', -12000)
  const volDecay = getModGenAmount(generator, 'decayVolEnv', -12000)
  const volSustain = getModGenAmount(generator, 'sustainVolEnv')
  const volRelease = getModGenAmount(generator, 'releaseVolEnv', -12000)
  const modAttack = getModGenAmount(generator, 'attackModEnv', -12000)
  const modDecay = getModGenAmount(generator, 'decayModEnv', -12000)
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

  return {
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
    volAttack: Math.pow(2, volAttack / 1200),
    volDecay: Math.pow(2, volDecay / 1200),
    volSustain: volSustain / 1000,
    volRelease: Math.pow(2, volRelease / 1200),
    modAttack: Math.pow(2, modAttack / 1200),
    modDecay: Math.pow(2, modDecay / 1200),
    modSustain: modSustain / 1000,
    modRelease: Math.pow(2, modRelease / 1200),
    initialFilterFc: getModGenAmount(generator, 'initialFilterFc', 13500),
    modEnvToFilterFc: getModGenAmount(generator, 'modEnvToFilterFc'),
    initialFilterQ: getModGenAmount(generator, 'initialFilterQ', 1),
    freqVibLFO: freqVibLFO ? Math.pow(2, freqVibLFO / 1200) * 8.176 : undefined,
    playbackRate: (key) => Math.pow(Math.pow(2, 1 / 12), (key + basePitch) * scale),
    keyRange,
    velRange
  }
}

function getModGenAmount(generator: {}, enumeratorType: string, opt_default: number = 0): number {
  return generator[enumeratorType] ? generator[enumeratorType].amount : opt_default
}

function createBagModGen(zone: {}[], indexStart: number, indexEnd: number, zoneModGen: {}): {modgen: {}, modgenInfo: {}[]}  {
  const modgenInfo = []
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

function createInstrumentGenerator(zone: {instrumentGeneratorIndex: number}[], index: number, instrumentZoneGenerator: {}[]) {
  const modgen = createBagModGen(
    zone,
    zone[index].instrumentGeneratorIndex,
    zone[index + 1] ? zone[index + 1].instrumentGeneratorIndex : instrumentZoneGenerator.length,
    instrumentZoneGenerator
  )

  return {
    generator: modgen.modgen,
    generatorInfo: modgen.modgenInfo
  }
}

function createInstrumentModulator(zone: {instrumentModulatorIndex: number, presetModulatorIndex: number}[], index: number, instrumentZoneModulator: {}[]) {
  const modgen = createBagModGen(
    zone,
    zone[index].presetModulatorIndex,
    zone[index + 1] ? zone[index + 1].instrumentModulatorIndex : instrumentZoneModulator.length,
    instrumentZoneModulator
  )

  return {
    modulator: modgen.modgen,
    modulatorInfo: modgen.modgenInfo
  }
}

function createPresetGenerator(zone: {presetGeneratorIndex: number}[], index: number, presetZoneGenerator: {}[]): {generator: Object, generatorInfo: Object[]} {
  const modgen = createBagModGen(
    zone,
    zone[index].presetGeneratorIndex,
    zone[index + 1] ? zone[index + 1].presetGeneratorIndex : presetZoneGenerator.length,
    presetZoneGenerator
  )

  return {
    generator: modgen.modgen,
    generatorInfo: modgen.modgenInfo
  }
}

function createPresetModulator(zone: {presetModulatorIndex: number}[], index: number, presetZoneModulator: {}[]) {
  const modgen = createBagModGen(
    zone,
    zone[index].presetModulatorIndex,
    zone[index + 1] ? zone[index + 1].presetModulatorIndex : presetZoneModulator.length,
    presetZoneModulator
  )

  return {
    modulator: modgen.modgen,
    modulatorInfo: modgen.modgenInfo
  }
}