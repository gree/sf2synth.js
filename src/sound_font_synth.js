import SynthesizerNote from "./sound_font_synth_note"
import Parser from "./sf2"
import View from "./synth_view"

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
    /** @type {Array.<number>} */
    this.channelInstrument =
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 10, 11, 12, 13, 14, 15]
    /** @type {Array.<number>} */
    this.channelVolume =
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    /** @type {Array.<number>} */
    this.channelPanpot =
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    /** @type {Array.<number>} */
    this.channelPitchBend =
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.channelPitchBendSensitivity =
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    /** @type {Array.<Array.<SynthesizerNote>>} */
    this.currentNoteOn = [
      [], [], [], [], [], [], [], [],
      [], [], [], [], [], [], [], []
    ]
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
    this.parser = new Parser(this.input)
    this.bankSet = this.createAllInstruments()

    for (let i = 0; i < 16; ++i) {
      this.programChange(i, i)
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
    this.parser = new Parser(input)
    this.bankSet = this.createAllInstruments()
  }

  createAllInstruments() {
    const { parser } = this
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
        this.createNoteInfo(parser, instrument.info[j], bank[presetNumber])
      }
    }

    return banks
  }

  createNoteInfo(parser, info, preset) {
    const { generator } = info

    if (generator['keyRange'] === void 0 || generator['sampleID'] === void 0) {
      return
    }

    const volAttack  = this.getModGenAmount(generator, 'attackVolEnv',  -12000)
    const volDecay   = this.getModGenAmount(generator, 'decayVolEnv',   -12000)
    const volSustain = this.getModGenAmount(generator, 'sustainVolEnv')
    const volRelease = this.getModGenAmount(generator, 'releaseVolEnv', -12000)
    const modAttack  = this.getModGenAmount(generator, 'attackModEnv',  -12000)
    const modDecay   = this.getModGenAmount(generator, 'decayModEnv',   -12000)
    const modSustain = this.getModGenAmount(generator, 'sustainModEnv')
    const modRelease = this.getModGenAmount(generator, 'releaseModEnv', -12000)

    const tune = (
      this.getModGenAmount(generator, 'coarseTune') +
      this.getModGenAmount(generator, 'fineTune') / 100
    )
    const scale = this.getModGenAmount(generator, 'scaleTuning', 100) / 100
    const freqVibLFO = this.getModGenAmount(generator, 'freqVibLFO')

    for (let i = generator['keyRange'].lo, il = generator['keyRange'].hi; i <= il; ++i)  {
      if (preset[i]) {
        continue
      }

      const sampleId = this.getModGenAmount(generator, 'sampleID')
      const sampleHeader = parser.sampleHeader[sampleId]
      preset[i] = {
        'sample': parser.sample[sampleId],
        'sampleRate': sampleHeader.sampleRate,
        'basePlaybackRate': Math.pow(
          Math.pow(2, 1/12),
          (
            i -
            this.getModGenAmount(generator, 'overridingRootKey', sampleHeader.originalPitch) +
            tune + (sampleHeader.pitchCorrection / 100)
          ) * scale
        ),
        'modEnvToPitch': this.getModGenAmount(generator, 'modEnvToPitch') / 100,
        'scaleTuning': scale,
        'start':
          this.getModGenAmount(generator, 'startAddrsCoarseOffset') * 32768 +
            this.getModGenAmount(generator, 'startAddrsOffset'),
        'end':
          this.getModGenAmount(generator, 'endAddrsCoarseOffset') * 32768 +
            this.getModGenAmount(generator, 'endAddrsOffset'),
        'loopStart': (
          //(sampleHeader.startLoop - sampleHeader.start) +
          (sampleHeader.startLoop) +
            this.getModGenAmount(generator, 'startloopAddrsCoarseOffset') * 32768 +
            this.getModGenAmount(generator, 'startloopAddrsOffset')
          ),
        'loopEnd': (
          //(sampleHeader.endLoop - sampleHeader.start) +
          (sampleHeader.endLoop) +
            this.getModGenAmount(generator, 'endloopAddrsCoarseOffset') * 32768 +
            this.getModGenAmount(generator, 'endloopAddrsOffset')
          ),
        'volAttack':  Math.pow(2, volAttack / 1200),
        'volDecay':   Math.pow(2, volDecay / 1200),
        'volSustain': volSustain / 1000,
        'volRelease': Math.pow(2, volRelease / 1200),
        'modAttack':  Math.pow(2, modAttack / 1200),
        'modDecay':   Math.pow(2, modDecay / 1200),
        'modSustain': modSustain / 1000,
        'modRelease': Math.pow(2, modRelease / 1200),
        'initialFilterFc': this.getModGenAmount(generator, 'initialFilterFc', 13500),
        'modEnvToFilterFc': this.getModGenAmount(generator, 'modEnvToFilterFc'),
        'initialFilterQ': this.getModGenAmount(generator, 'initialFilterQ'),
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
  getModGenAmount(generator, enumeratorType, opt_default = 0) {
    return generator[enumeratorType] ? generator[enumeratorType].amount : opt_default
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
   * @param {number} channel NoteOn するチャンネル.
   * @param {number} key NoteOn するキー.
   * @param {number} velocity 強さ.
   */
  noteOn(channel, key, velocity) {
    const bank = this.bankSet[channel === 9 ? 128 : this.bank]
    const instrument = bank[this.channelInstrument[channel]]

    this.view.noteOn(channel, key)

    if (!instrument) {
      // TODO
      console.warn(
        "instrument not found: bank=%s instrument=%s channel=%s",
        channel === 9 ? 128 : this.bank,
        this.channelInstrument[channel],
        channel
      )
      return
    }

    const instrumentKey = instrument[key]

    if (!(instrumentKey)) {
      // TODO
      console.warn(
        "instrument not found: bank=%s instrument=%s channel=%s key=%s",
        channel === 9 ? 128 : this.bank,
        this.channelInstrument[channel],
        channel,
        key
      )
      return
    }

    let panpot = this.channelPanpot[channel] - 64
    panpot /= panpot < 0 ? 64 : 63

    // create note information
    instrumentKey['channel'] = channel
    instrumentKey['key'] = key
    instrumentKey['velocity'] = velocity
    instrumentKey['panpot'] = panpot
    instrumentKey['volume'] = this.channelVolume[channel] / 127
    instrumentKey['pitchBend'] = this.channelPitchBend[channel] - 8192
    instrumentKey['pitchBendSensitivity'] = this.channelPitchBendSensitivity[channel]

    // note on
    const note = new SynthesizerNote(this.ctx, this.gainMaster, instrumentKey)
    note.noteOn()
    this.currentNoteOn[channel].push(note)
  }

  /**
   * @param {number} channel NoteOff するチャンネル.
   * @param {number} key NoteOff するキー.
   * @param {number} velocity 強さ.
   */
  noteOff(channel, key, velocity) {
    const bank = this.bankSet[channel === 9 ? 128 : this.bank]
    const instrument = bank[this.channelInstrument[channel]]
    const currentNoteOn = this.currentNoteOn[channel]

    this.view.noteOff(channel, key)

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
   * @param {number} channel 音色を変更するチャンネル.
   * @param {number} instrument 音色番号.
   */
  programChange(channel, instrument) {
    this.view.programChange(channel, instrument)

    // リズムトラックは無視する
    if (channel === 9) {
      return
    }

    this.channelInstrument[channel] = instrument
  }

  /**
   * @param {number} channel 音量を変更するチャンネル.
   * @param {number} volume 音量(0-127).
   */
  volumeChange(channel, volume) {
    this.view.volumeChange(channel, volume)
    this.channelVolume[channel] = volume
  }

  /**
   * @param {number} channel panpot を変更するチャンネル.
   * @param {number} panpot panpot(0-127).
   */
  panpotChange(channel, panpot) {
    this.view.panpotChange(channel, panpot)
    this.channelPanpot[channel] = panpot
  }

  /**
   * @param {number} channel panpot を変更するチャンネル.
   * @param {number} lowerByte
   * @param {number} higherByte
   */
  pitchBend(channel, lowerByte, higherByte) {
    const bend = (lowerByte & 0x7f) | ((higherByte & 0x7f) << 7)
    const currentNoteOn = this.currentNoteOn[channel]
    const calculated = bend - 8192

    this.view.pitchBend(channel, calculated)

    for (let i = 0, il = currentNoteOn.length; i < il; ++i) {
      currentNoteOn[i].updatePitchBend(calculated)
    }

    this.channelPitchBend[channel] = bend
  }

  /**
   * @param {number} channel pitch bend sensitivity を変更するチャンネル.
   * @param {number} sensitivity
   */
  pitchBendSensitivity(channel, sensitivity) {
    this.view.pitchBendSensitivity(channel, sensitivity)
    this.channelPitchBendSensitivity[channel] = sensitivity
  }

  /**
   * @param {number} channel 音を消すチャンネル.
   */
  allSoundOff(channel) {
    const currentNoteOn = this.currentNoteOn[channel]

    while (currentNoteOn.length > 0) {
      this.noteOff(channel, currentNoteOn[0].key, 0)
    }
  }

  /**
   * @param {number} channel リセットするチャンネル
   */
  resetAllControl(channel) {
    this.pitchBend(channel, 0x00, 0x40); // 8192
  }
}
