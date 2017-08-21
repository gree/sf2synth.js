import SynthesizerNote from "./sound_font_synth_note"
import Parser from "./sf2"
import View from "./synth_view"

class Channel {
  instrument = 0
  volume = 0
  pitchBend = 0
  pitchBendSensitivity = 0
  /** @type {<Array.<SynthesizerNote>} */
  currentNoteOn = []
}

/**
 * @constructor
 */
export default class Synthesizer {
  constructor(input) {
    /** @type {Uint8Array} */
    this.input = input
    /** @type {Parser} */
    this.parser
    /** @type {number} */
    this.bank = 0
    /** @type {Array.<Array.<Object>>} */
    this.bankSet
    /** @type {number} */
    this.bufferSize = 1024
    /** @type {AudioContext} */
    this.ctx = this.getAudioContext()
    /** @type {AudioGainNode} */
    this.gainMaster = this.ctx.createGainNode()
    /** @type {DynamicsCompressorNode} */
    this.compressor = this.ctx.createDynamicsCompressor()
    /** @type {AudioBufferSourceNode} */
    this.bufSrc = this.ctx.createBufferSource()
    /** @type {Array.<Channel>} */
    this.channels = []
    /** @type {number} */
    this.baseVolume = 1 / 0x8000
    /** @type {number} */
    this.masterVolume = 16384
    /** @type {View} */
    this.view = new View()
  }

    /**
   * @returns {AudioContext}
   */
  getAudioContext() {
    /** @type {AudioContext} */
    let ctx

    if (window.AudioContext !== void 0) {
      ctx = new window.AudioContext()
    } else if (window.webkitAudioContext !== void 0) {
      ctx = new window.webkitAudioContext()
    } else if (window.mozAudioContext !== void 0) {
      ctx = new window.mozAudioContext()
    } else {
      throw new Error('Web Audio not supported')
    }

    if (ctx.createGainNode === void 0) {
      ctx.createGainNode = ctx.createGain
    }

    return ctx
  }

  init() {
    const parser = new Parser(this.input)
    this.bankSet = createAllInstruments(parser)

    for (let i = 0; i < 16; ++i) {
      this.channels.push(new Channel())
      this.programChange(i, i !== 9 ? i : 0)
      this.volumeChange(i, 0x64)
      this.panpotChange(i, 0x40)
      this.pitchBend(i, 0x00, 0x40); // 8192
      this.pitchBendSensitivity(i, 2)
    }
  }

  /**
   * @param {Uint8Array} input
   */
  refreshInstruments(input) {
    this.input = input
    const parser = new Parser(input)
    this.bankSet = createAllInstruments(parser)
  }

  start() {
    this.bufSrc.connect(this.gainMaster)
    this.gainMaster.connect(this.ctx.destination)
    this.bufSrc.start(0)

    this.setMasterVolume(16383)
  }

  setMasterVolume(volume) {
    this.masterVolume = volume
    this.gainMaster.gain.value = this.baseVolume * (volume / 16384)
  }

  stop() {
    this.bufSrc.disconnect(0)
    this.gainMaster.disconnect(0)
    this.compressor.disconnect(0)
  }

  drawSynth() {
    return this.view.draw(this)
  }

  removeSynth() {
    this.view.remove()
  }

  /**
   * @param {number} channelNumber NoteOn するチャンネル.
   * @param {number} key NoteOn するキー.
   * @param {number} velocity 強さ.
   */
  noteOn(channelNumber, key, velocity) {
    const bank = this.bankSet[channelNumber === 9 ? 128 : this.bank]
    const channel = this.channels[channelNumber]
    const instrument = bank[channel.instrument]

    this.view.noteOn(channelNumber, key)

    if (!instrument) {
      // TODO
      console.warn(
        "instrument not found: bank=%s instrument=%s channel=%s",
        channelNumber === 9 ? 128 : this.bank,
        channel.instrument,
        channelNumber
      )
      return
    }

    const instrumentKey = instrument[key]

    if (!(instrumentKey)) {
      // TODO
      console.warn(
        "instrument not found: bank=%s instrument=%s channel=%s key=%s",
        channelNumber === 9 ? 128 : this.bank,
        channel.instrument,
        channelNumber,
        key
      )
      return
    }

    let panpot = channel.panpot - 64
    panpot /= panpot < 0 ? 64 : 63

    // create note information
    instrumentKey['channel'] = channelNumber
    instrumentKey['key'] = key
    instrumentKey['velocity'] = velocity
    instrumentKey['panpot'] = panpot
    instrumentKey['volume'] = channel.volume / 127
    instrumentKey['pitchBend'] = channel.pitchBend - 8192
    instrumentKey['pitchBendSensitivity'] = channel.pitchBendSensitivity

    // note on
    const note = new SynthesizerNote(this.ctx, this.gainMaster, instrumentKey)
    note.noteOn()
    channel.currentNoteOn.push(note)
  }

  /**
   * @param {number} channelNumber NoteOff するチャンネル.
   * @param {number} key NoteOff するキー.
   * @param {number} velocity 強さ.
   */
  noteOff(channelNumber, key, velocity) {
    const bank = this.bankSet[channel === 9 ? 128 : this.bank]
    const channel = this.channels[channelNumber]
    const instrument = bank[channel.instrument]
    const currentNoteOn = channel.currentNoteOn

    this.view.noteOff(channelNumber, key)

    if (!instrument) {
      return
    }

    for (let i = 0, il = currentNoteOn.length; i < il; ++i) {
      const note = currentNoteOn[i]
      if (note.key === key) {
        note.noteOff()
        currentNoteOn.splice(i, 1)
        --i
        --il
      }
    }
  }

  /**
   * @param {number} channelNumber 音色を変更するチャンネル.
   * @param {number} instrument 音色番号.
   */
  programChange(channelNumber, instrument) {
    this.view.programChange(channelNumber, instrument)

    // リズムトラックは無視する
    if (channelNumber === 9) {
      return
    }

    this.channels[channelNumber].instrument = instrument
  }

  /**
   * @param {number} channelNumber 音量を変更するチャンネル.
   * @param {number} volume 音量(0-127).
   */
  volumeChange(channelNumber, volume) {
    this.view.volumeChange(channelNumber, volume)
    this.channels[channelNumber].volume = volume
  }

  /**
   * @param {number} channelNumber panpot を変更するチャンネル.
   * @param {number} panpot panpot(0-127).
   */
  panpotChange(channelNumber, panpot) {
    this.view.panpotChange(channelNumber, panpot)
    this.channels[channelNumber].panpot = panpot
  }

  /**
   * @param {number} channelNumber panpot を変更するチャンネル.
   * @param {number} lowerByte
   * @param {number} higherByte
   */
  pitchBend(channelNumber, lowerByte, higherByte) {
    const bend = (lowerByte & 0x7f) | ((higherByte & 0x7f) << 7)
    const channel = this.channels[channelNumber]
    const currentNoteOn = channel.currentNoteOn
    const calculated = bend - 8192

    this.view.pitchBend(channelNumber, calculated)

    for (let i = 0, il = currentNoteOn.length; i < il; ++i) {
      currentNoteOn[i].updatePitchBend(calculated)
    }

    channel.pitchBend = bend
  }

  /**
   * @param {number} channelNumber pitch bend sensitivity を変更するチャンネル.
   * @param {number} sensitivity
   */
  pitchBendSensitivity(channelNumber, sensitivity) {
    this.view.pitchBendSensitivity(channelNumber, sensitivity)
    this.channels[channelNumber].pitchBendSensitivity = sensitivity
  }

  /**
   * @param {number} channelNumber 音を消すチャンネル.
   */
  allSoundOff(channelNumber) {
    const currentNoteOn = this.channels[channelNumber].currentNoteOn

    while (currentNoteOn.length > 0) {
      this.noteOff(channelNumber, currentNoteOn[0].key, 0)
    }
  }

  /**
   * @param {number} channelNumber リセットするチャンネル
   */
  resetAllControl(channelNumber) {
    this.pitchBend(channelNumber, 0x00, 0x40); // 8192
  }
}

function createAllInstruments(parser) {
  parser.parse()
  const presets = parser.createPreset()
  const instruments = parser.createInstrument()
  const banks = []

  for (let i = 0, il = presets.length; i < il; ++i) {
    const preset = presets[i]
    /** @type {number} */
    const presetNumber = preset.header.preset

    if (typeof preset.instrument !== 'number') {
      continue
    }

    /** @type {Object} */
    const instrument = instruments[preset.instrument]
    if (instrument.name.replace(/\0*$/, '') === 'EOI') {
      continue
    }

    // select bank
    if (banks[preset.header.bank] === void 0) {
      banks[preset.header.bank] = []
    }
    const bank = banks[preset.header.bank]
    bank[presetNumber] = []
    bank[presetNumber].name = preset.name

    for (let j = 0, jl = instrument.info.length; j < jl; ++j) {
      createNoteInfo(parser, instrument.info[j], bank[presetNumber])
    }
  }

  return banks
}

function createNoteInfo(parser, info, preset) {
  const { generator } = info

  if (generator['keyRange'] === void 0 || generator['sampleID'] === void 0) {
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

  for (let i = generator['keyRange'].lo, il = generator['keyRange'].hi; i <= il; ++i)  {
    if (preset[i]) {
      continue
    }

    const sampleId = getModGenAmount(generator, 'sampleID')
    const sampleHeader = parser.sampleHeader[sampleId]
    preset[i] = {
      'sample': parser.sample[sampleId],
      'sampleRate': sampleHeader.sampleRate,
      'basePlaybackRate': Math.pow(
        Math.pow(2, 1/12),
        (
          i -
          getModGenAmount(generator, 'overridingRootKey', sampleHeader.originalPitch) +
          tune + (sampleHeader.pitchCorrection / 100)
        ) * scale
      ),
      'modEnvToPitch': getModGenAmount(generator, 'modEnvToPitch') / 100,
      'scaleTuning': scale,
      'start':
        getModGenAmount(generator, 'startAddrsCoarseOffset') * 32768 +
          getModGenAmount(generator, 'startAddrsOffset'),
      'end':
        getModGenAmount(generator, 'endAddrsCoarseOffset') * 32768 +
          getModGenAmount(generator, 'endAddrsOffset'),
      'loopStart': (
        //(sampleHeader.startLoop - sampleHeader.start) +
        (sampleHeader.startLoop) +
          getModGenAmount(generator, 'startloopAddrsCoarseOffset') * 32768 +
          getModGenAmount(generator, 'startloopAddrsOffset')
        ),
      'loopEnd': (
        //(sampleHeader.endLoop - sampleHeader.start) +
        (sampleHeader.endLoop) +
          getModGenAmount(generator, 'endloopAddrsCoarseOffset') * 32768 +
          getModGenAmount(generator, 'endloopAddrsOffset')
        ),
      'volAttack':  Math.pow(2, volAttack / 1200),
      'volDecay':   Math.pow(2, volDecay / 1200),
      'volSustain': volSustain / 1000,
      'volRelease': Math.pow(2, volRelease / 1200),
      'modAttack':  Math.pow(2, modAttack / 1200),
      'modDecay':   Math.pow(2, modDecay / 1200),
      'modSustain': modSustain / 1000,
      'modRelease': Math.pow(2, modRelease / 1200),
      'initialFilterFc': getModGenAmount(generator, 'initialFilterFc', 13500),
      'modEnvToFilterFc': getModGenAmount(generator, 'modEnvToFilterFc'),
      'initialFilterQ': getModGenAmount(generator, 'initialFilterQ'),
      'freqVibLFO': freqVibLFO ? Math.pow(2, freqVibLFO / 1200) * 8.176 : void 0
    }
  }
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
