import SynthesizerNote from "./SynthesizerNote"
import parse from "./Parser"
import SoundFont from "./SoundFont"
import { InstrumentState } from "./SynthesizerNote"

const BASE_VOLUME = 0.4

class Channel {
  instrument = 0
  volume = 0
  pitchBend = 0
  pitchBendSensitivity = 0
  panpot = 0
  currentNoteOn: SynthesizerNote[] = []
}

interface View {
  draw()
  remove()
  getInstrumentElement()
  getKeyElement()
  noteOn(channelNumber: number, key: number)
  noteOff(channelNumber: number, key: number)
  programChange(channelNumber: number, instrument: number)
  volumeChange(channelNumber: number, volume: number)
  panpotChange(channelNumber: number, panpot: number)
  pitchBend(channelNumber: number, pitchBend: number)
  pitchBendSensitivity(channelNumber: number, sensitivity: number)
}

class DummyView implements View {
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

export default class Synthesizer {
  bank: number = 0
  bufferSize: number = 1024
  ctx: AudioContext
  gainMaster: GainNode
  channels: Channel[] = []
  masterVolume: number = 1.0
  view: View = new DummyView()
  soundFont: SoundFont

  constructor(ctx) {
    this.ctx = ctx
    this.gainMaster = this.ctx.createGain()
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

  refreshInstruments(input: Uint8Array) {
    const parser = parse(input)
    this.soundFont = new SoundFont(parser)
  }

  connect(destination) {
    this.gainMaster.connect(destination)
  }

  setMasterVolume(volume) {
    this.masterVolume = volume
    this.gainMaster.gain.value = BASE_VOLUME * volume / 0x8000
  }

  noteOn(channelNumber: number, key: number, velocity: number) {
    if (!this.soundFont) {
      return
    }
    const bankNumber = channelNumber === 9 ? 128 : this.bank
    const channel = this.channels[channelNumber]

    const noteInfo = this.soundFont.getInstrumentKey(bankNumber, channel.instrument, key, velocity)

    if (!noteInfo) {
      return
    }

    let panpot = channel.panpot - 64
    panpot /= panpot < 0 ? 64 : 63

    // create note information
    const instrumentKey: InstrumentState = {
      channel: channelNumber,
      key: key,
      velocity: velocity,
      panpot: panpot,
      volume: channel.volume / 127,
      pitchBend: channel.pitchBend - 0x2000,
      pitchBendSensitivity: channel.pitchBendSensitivity
    }

    // note on
    const note = new SynthesizerNote(this.ctx, this.gainMaster, noteInfo, instrumentKey)
    note.noteOn()
    channel.currentNoteOn.push(note)

    this.view.noteOn(channelNumber, key)
  }

  noteOff(channelNumber: number, key: number, _velocity: number) {
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

  programChange(channelNumber: number, instrument: number) {
    this.view.programChange(channelNumber, instrument)
    this.channels[channelNumber].instrument = instrument
  }

  volumeChange(channelNumber: number, volume: number) {
    this.view.volumeChange(channelNumber, volume)
    this.channels[channelNumber].volume = volume
  }

  panpotChange(channelNumber: number, panpot: number) {
    this.view.panpotChange(channelNumber, panpot)
    this.channels[channelNumber].panpot = panpot
  }

  pitchBend(channelNumber: number, lowerByte: number, higherByte: number) {
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

  pitchBendSensitivity(channelNumber: number, sensitivity: number) {
    this.view.pitchBendSensitivity(channelNumber, sensitivity)
    this.channels[channelNumber].pitchBendSensitivity = sensitivity
  }

  allSoundOff(channelNumber: number) {
    const currentNoteOn = this.channels[channelNumber].currentNoteOn

    while (currentNoteOn.length > 0) {
      this.noteOff(channelNumber, currentNoteOn[0].key, 0)
    }
  }

  resetAllControl(channelNumber: number) {
    this.pitchBend(channelNumber, 0x00, 0x40); // 8192
  }
}
