import SynthesizerNote from "./sound_font_synth_note"
import Parser from "./sf2"
import SoundFont from "./sound_font"

const BASE_VOLUME = 0.4

class Channel {
  instrument = 0
  volume = 0
  pitchBend = 0
  pitchBendSensitivity = 0
  /** @type {<Array.<SynthesizerNote>} */
  currentNoteOn = []
}

class DummyView {
  draw() { }
  remove() { }
  getInstrumentElement() { }
  getKeyElement() { }
  noteOn() { }
  noteOff() { }
  programChange() { }
  volumeChange() { }
  panpotChange() { }
  pitchBend() { }
  pitchBendSensitivity() { }
}

/**
 * @constructor
 */
export default class Synthesizer {
  constructor(ctx) {
    /** @type {Uint8Array} */
    this.input = null
    /** @type {number} */
    this.bank = 0
    /** @type {number} */
    this.bufferSize = 1024
    /** @type {AudioContext} */
    this.ctx = ctx
    /** @type {AudioGainNode} */
    this.gainMaster = this.ctx.createGain()
    /** @type {Array.<Channel>} */
    this.channels = []
    /** @type {number} */
    this.masterVolume = 1.0
    /** @type {View} */
    this.view = new DummyView()

    this.setMasterVolume(this.masterVolume)

    this.init()
  }

  init() {
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
    parser.parse()
    this.soundFont = new SoundFont(parser)
  }

  connect(destination) {
    this.gainMaster.connect(destination)
  }

  setMasterVolume(volume) {
    this.masterVolume = volume
    this.gainMaster.gain.value = BASE_VOLUME * volume / 0x8000
  }

  /**
   * @param {number} channelNumber NoteOn するチャンネル.
   * @param {number} key NoteOn するキー.
   * @param {number} velocity 強さ.
   */
  noteOn(channelNumber, key, velocity) {
    if (!this.soundFont) {
      return
    }
    const bankNumber = channelNumber === 9 ? 128 : this.bank
    const channel = this.channels[channelNumber]

    const instrumentKey = this.soundFont.getInstrumentKey(bankNumber, channel.instrument, key, velocity)

    if (!instrumentKey) {
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
    instrumentKey['pitchBend'] = channel.pitchBend - 0x2000
    instrumentKey['pitchBendSensitivity'] = channel.pitchBendSensitivity

    // note on
    const note = new SynthesizerNote(this.ctx, this.gainMaster, instrumentKey)
    note.noteOn()
    channel.currentNoteOn.push(note)

    this.view.noteOn(channelNumber, key)
  }

  /**
   * @param {number} channelNumber NoteOff するチャンネル.
   * @param {number} key NoteOff するキー.
   * @param {number} velocity 強さ.
   */
  noteOff(channelNumber, key, velocity) {
    if (!this.soundFont) {
      return
    }
    const bankNumber = channelNumber === 9 ? 128 : this.bank
    const channel = this.channels[channelNumber]

    const instrumentKey = this.soundFont.getInstrumentKey(bankNumber, channel.instrument, key)

    if (!instrumentKey) {
      return
    }

    const currentNoteOn = channel.currentNoteOn

    for (let i = 0, il = currentNoteOn.length; i < il; ++i) {
      const note = currentNoteOn[i]
      if (note.key === key) {
        note.noteOff()
        currentNoteOn.splice(i, 1)
        --i
        --il
      }
    }

    this.view.noteOff(channelNumber, key)
  }

  /**
   * @param {number} channelNumber 音色を変更するチャンネル.
   * @param {number} instrument 音色番号.
   */
  programChange(channelNumber, instrument) {
    this.view.programChange(channelNumber, instrument)
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
    const calculated = bend - 0x2000

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
