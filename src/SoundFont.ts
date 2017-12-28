import { ParseResult } from "./Parser"
import { RangeValue, GeneratorList } from "./Structs"

/**
 * Parser で読み込んだサウンドフォントのデータを
 * Synthesizer から利用しやすい形にするクラス
 */
export default class SoundFont {
  private parsed: ParseResult

  constructor(parsed: ParseResult) {
    this.parsed = parsed
  }

  getInstrumentKey(bankNumber, instrumentNumber, key, velocity = 100): NoteInfo|null {
    const presetHeader = this.parsed.presetHeaders.find(p => p.preset === instrumentNumber && p.bank === bankNumber)
    
    if (!presetHeader) {
      console.warn("preset not found: bank=%s instrument=%s", bankNumber, instrumentNumber)
      return null
    }

    let presetGenerators: GeneratorList[]
    const presetBag = this.parsed.presetZone[presetHeader.presetBagIndex]

    const nextPresetHeaderIndex = this.parsed.presetHeaders.indexOf(presetHeader) + 1
    if (nextPresetHeaderIndex < this.parsed.presetHeaders.length) {
      // 次の preset までのすべての generator を取得する
      const nextPresetHeader = this.parsed.presetHeaders[nextPresetHeaderIndex]
      const nextPresetBag = this.parsed.presetZone[nextPresetHeader.presetBagIndex]
      presetGenerators = this.parsed.presetGenerators.slice(presetBag.presetGeneratorIndex, nextPresetBag.presetGeneratorIndex)
    } else {
      // 最後の preset だった場合は一つだけ使う
      presetGenerators = [this.parsed.presetGenerators[presetBag.presetGeneratorIndex]]
    }

    // Last Preset Generator must be instrument
    const lastPresetGenertor = presetGenerators[presetGenerators.length - 1]
    if (lastPresetGenertor.type !== "instrument" || Number(lastPresetGenertor.value) === NaN) {
      throw new Error("invalid preset generator: expect instrument")
    }
    const instrumentID = lastPresetGenertor.value as number
    const instrument = this.parsed.instruments[instrumentID]
    const nextInstrument = this.parsed.instruments[instrumentID + 1]

    // instrument がもつ全ての Generator を使いやすい形式にまとめる
    const generatorValuesList = arrayRange(instrument.instrumentBagIndex, nextInstrument.instrumentBagIndex)
      .map(i => {
        const instrumentBag = this.parsed.instrumentZone[i]
        const nextInstrumentBag = this.parsed.instrumentZone[i + 1]
        const generators = this.parsed.instrumentGenerators.slice(instrumentBag.instrumentGeneratorIndex, nextInstrumentBag.instrumentGeneratorIndex)
        return getInstrumentGeneratorValues(generators)
      })

    // keyRange と velRange がマッチしている Generator を探す
    const generatorValues = generatorValuesList.find(i => {
      let isInKeyRange = key >= i.keyRange.lo && key <= i.keyRange.hi

      let isInVelRange = true
      if (i.velRange) {
        isInVelRange = velocity >= i.velRange.lo && velocity <= i.velRange.hi
      }

      return isInKeyRange && isInVelRange
    })
    
    if (!generatorValues) {
      console.warn("instrument not found: bank=%s instrument=%s", bankNumber, instrumentNumber)
      return null
    }

    const gen = generatorValues

    const sampleHeader = this.parsed.sampleHeaders[gen.sampleID]
    const tune = gen.coarseTune + gen.fineTune / 100
    const basePitch = tune + (sampleHeader.pitchCorrection / 100) - (gen.overridingRootKey || sampleHeader.originalPitch)
    const scaleTuning = gen.scaleTuning / 100

    return {
      sample: this.parsed.samples[gen.sampleID],
      sampleRate: sampleHeader.sampleRate,
      sampleName: sampleHeader.sampleName,
      scaleTuning,
      playbackRate: (key) => Math.pow(Math.pow(2, 1 / 12), (key + basePitch) * scaleTuning),
      keyRange: gen.keyRange,
      velRange: gen.velRange,
      volAttack: Math.pow(2, gen.volAttack / 1200),
      volDecay: Math.pow(2, gen.volDecay / 1200),
      volSustain: gen.volSustain / 1000,
      volRelease: Math.pow(2, gen.volRelease / 1200),
      modAttack: Math.pow(2, gen.modAttack / 1200),
      modDecay: Math.pow(2, gen.modDecay / 1200),
      modSustain: gen.modSustain / 1000,
      modRelease: Math.pow(2, gen.modRelease / 1200),
      modEnvToPitch: gen.modEnvToPitch / 100,
      modEnvToFilterFc: gen.modEnvToFilterFc,
      initialFilterQ: gen.initialFilterQ,
      initialFilterFc: gen.initialFilterFc,
      freqVibLFO: gen.freqVibLFO ? Math.pow(2, gen.freqVibLFO / 1200) * 8.176 : undefined,
      start: gen.startAddrsCoarseOffset * 32768 + gen.startAddrsOffset,
      end: gen.endAddrsCoarseOffset * 32768 + gen.endAddrsOffset,
      loopStart: (
        sampleHeader.loopStart +
        gen.startloopAddrsCoarseOffset * 32768 +
        gen.startloopAddrsOffset
      ),
      loopEnd: (
        sampleHeader.loopEnd +
        gen.endloopAddrsCoarseOffset * 32768 +
        gen.endloopAddrsOffset
      ),
    }
  }

  // presetNames[bankNumber][presetNumber] = presetName
  getPresetNames() {
    const bank: {[index: number]: {[index: number]: string}} = {}
    this.parsed.presetHeaders.forEach(preset => {
      if (!bank[preset.bank]) {
        bank[preset.bank] = {}
      }
      bank[preset.bank][preset.preset] = preset.presetName
    })
    return bank
  }
}

function arrayRange(start, end) {
  return Array.from({length: end - start}, (_, k) => k + start);
}

// ひとつの instrument に対応する Generator の配列から使いやすくしたオブジェクトを返す
function getInstrumentGeneratorValues(instrumentGenerators: GeneratorList[]) {
  function getValue(type: string, defaultValue: number = 0): number {
    const generator = instrumentGenerators.find(g => g.type === type)
    if (!generator) {
      return defaultValue
    }
    if (Number(generator.value) === NaN) {
      return defaultValue
    }
    return generator.value as number
  }
  
  // First Instrument Generator must be keyRange
  const firstInstrumentGenerator = instrumentGenerators[0]
  if (firstInstrumentGenerator.type !== "keyRange" || !(firstInstrumentGenerator.value instanceof RangeValue)) {
    throw new Error("invalid first instrument generator: expect keyRange")
  }
  const keyRange = firstInstrumentGenerator.value

  // Second Instrument Generator could be velRange
  const secondInstrumentGenerator = instrumentGenerators[1]
  let velRange: RangeValue|undefined
  if (secondInstrumentGenerator && secondInstrumentGenerator.type === "velRange") {
    velRange = secondInstrumentGenerator.value as RangeValue
  }

  // Last Instrument Generator must be sampleID
  const lastInstrumentGenerator = instrumentGenerators[instrumentGenerators.length - 1]
  if (lastInstrumentGenerator.type !== "sampleID" || Number(lastInstrumentGenerator.value) === NaN) {
    throw new Error("invalid last instrument generator: expect sampleID")
  }
  const sampleID = lastInstrumentGenerator.value as number

  // Other generators

  return {
    keyRange,
    velRange, // optional
    sampleID,
    volAttack: getValue("attackVolEnv", -12000),
    volDecay: getValue("decayVolEnv", -12000),
    volSustain: getValue("sustainVolEnv"),
    volRelease: getValue("releaseVolEnv", -12000),
    modAttack: getValue("attackModEnv", -12000),
    modDecay: getValue("decayModEnv", -12000),
    modSustain: getValue("sustainModEnv"),
    modRelease: getValue("releaseModEnv", -12000),
    modEnvToPitch: getValue("modEnvToPitch"),
    modEnvToFilterFc: getValue("modEnvToFilterFc"),
    coarseTune: getValue("coarseTune"),
    fineTune: getValue("fineTune"),
    scaleTuning: getValue("scaleTuning", 100),
    freqVibLFO: getValue("freqVibLFO"),
    startAddrsOffset: getValue("startAddrsOffset"),
    startAddrsCoarseOffset: getValue("startAddrsCoarseOffset"),
    endAddrsOffset: getValue("endAddrsOffset"),
    endAddrsCoarseOffset: getValue("endAddrsCoarseOffset"),
    startloopAddrsOffset: getValue("startloopAddrsOffset"),
    startloopAddrsCoarseOffset: getValue("startloopAddrsCoarseOffset"),
    endloopAddrsOffset: getValue("endloopAddrsOffset"),
    endloopAddrsCoarseOffset: getValue("endloopAddrsCoarseOffset"),
    overridingRootKey: getValue("overridingRootKey", undefined),
    initialFilterQ: getValue("initialFilterQ", 1),
    initialFilterFc: getValue("initialFilterFc", 13500),
  }
}

export interface NoteInfo {
  sample: Int16Array
  sampleRate: number
  sampleName: string
  start: number
  end: number
  scaleTuning: number
  playbackRate: Function
  loopStart: number
  loopEnd: number
  volAttack: number
  volDecay: number
  volSustain: number
  volRelease: number
  modAttack: number
  modDecay: number
  modSustain: number
  modRelease: number
  modEnvToPitch: number
  modEnvToFilterFc: number
  initialFilterFc: number
  initialFilterQ: number
  freqVibLFO: number|undefined
  keyRange: RangeValue
  velRange: RangeValue|undefined
}
