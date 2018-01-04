import SynthesizerNote from "./SynthesizerNote"
import parse from "./Parser"
import SoundFont from "./SoundFont"
import { InstrumentState } from "./SynthesizerNote"
import { Listener } from "./MidiMessageHandler"

const BASE_VOLUME = 0.4

class Channel {
  instrument = 0
  volume = 0
  pitchBend = 0
  pitchBendSensitivity = 0
  panpot = 0
  expression = 0
  releaseTime = 0
  reverb = 0
  currentNoteOn: SynthesizerNote[] = []
  hold = false
  bankMsb = 0
  bankLsb = 0
  isPercussionPart = false
  harmonicContent = 0
  cutOffFrequency = 0
  mute = false
}

export default class Synthesizer implements Listener {
  bufferSize: number = 1024
  ctx: AudioContext
  gainMaster: GainNode
  channels: Channel[] = []
  masterVolume: number = 1.0
  soundFont: SoundFont

  isXG: boolean
  isGS: boolean

  constructor(ctx) {
    this.ctx = ctx
    this.gainMaster = this.ctx.createGain()
    this.setMasterVolume(this.masterVolume)
    this.init()
  }

  init() {
    this.channels = [];
    for (let i = 0; i < 16; ++i) {
      this.channels.push(new Channel())
      this.programChange(i, 0x00)
      this.volumeChange(i, 0x64)
      this.panpotChange(i, 0x40)
      this.pitchBend(i, 0)
      this.pitchBendSensitivity(i, 2)
      this.hold(i, false)
      this.expression(i, 0x7f)
      this.bankSelectMsb(i, i === 9 ? 0x80 : 0x00)
      this.bankSelectLsb(i, 0x00)
      this.setPercussionPart(i, i === 9)
      this.releaseTime(i, 0x40)
      this.setReverbDepth(i, 0x28)
    }
  }

  loadSoundFont(input: Uint8Array) {
    const parser = parse(input)
    this.soundFont = new SoundFont(parser)
  }

  connect(destination: AudioNode) {
    this.gainMaster.connect(destination)
  }

  setMasterVolume(volume: number) {
    const vol = BASE_VOLUME * volume / 0x8000;
    this.masterVolume = volume
    if (vol) {
      //this.gainMaster.gain.value = BASE_VOLUME * volume / 0x8000
      this.gainMaster.gain.setTargetAtTime(BASE_VOLUME * volume / 0x8000, this.ctx.currentTime, 0.015);
    }
  }

  noteOn(channelNumber: number, key: number, velocity: number) {
    if (!this.soundFont) {
      return
    }
    const bankNumber = this.getBank(channelNumber);
    const channel = this.channels[channelNumber]

    if (channel === undefined) {
      return;
    }

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
      pitchBend: channel.pitchBend,
      expression: channel.expression,
      pitchBendSensitivity: channel.pitchBendSensitivity,
      mute: channel.mute,
      releaseTime: channel.releaseTime,
      cutOffFrequency: channel.cutOffFrequency,
      harmonicContent: channel.harmonicContent
    }

    // percussion
    if (channel.isPercussionPart) {
      if (key === 42 || key === 44) {
        // 42: Closed Hi-Hat
        // 44: Pedal Hi-Hat
        // 46: Open Hi-Hat
        this.noteOff(channelNumber, 46, 0);
      }
      if (key === 80) {
        // 80: Mute Triangle
        // 81: Open Triangle
        this.noteOff(channelNumber, 81, 0);
      }
    }

    // note on
    const note = new SynthesizerNote(this.ctx, this.gainMaster, noteInfo, instrumentKey)
    note.noteOn()
    this.channels[channelNumber].currentNoteOn.push(note)
  }

  noteOff(channelNumber: number, key: number, _velocity: number) {
    if (!this.soundFont) {
      return
    }
    const bankNumber = this.getBank(channelNumber);
    const channel = this.channels[channelNumber]

    if (channel === undefined) {
      return;
    }

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
  }

  hold(channelNumber: number, value: boolean) {
    this.channels[channelNumber].hold = value;
  }

  bankSelectMsb(channelNumber: number, value: number) {
    this.channels[channelNumber].bankMsb = value;
  }

  bankSelectLsb(channelNumber: number, value: number) {
    this.channels[channelNumber].bankLsb = value;
  }

  programChange(channelNumber: number, instrument: number) {
    this.channels[channelNumber].instrument = instrument
  }

  volumeChange(channelNumber: number, volume: number) {
    this.channels[channelNumber].volume = volume
  }

  expression(channelNumber: number, expression: number) {
    const currentNoteOn = this.channels[channelNumber].currentNoteOn
    for (let i = 0, il = currentNoteOn.length; i < il; ++i) {
      currentNoteOn[i].updateExpression(expression);
    }

    this.channels[channelNumber].expression = expression;
  };

  panpotChange(channelNumber: number, panpot: number) {
    this.channels[channelNumber].panpot = panpot
  }

  pitchBend(channelNumber: number, pitchBend: number) {
    pitchBend -= 0x2000
    const channel = this.channels[channelNumber]

    for (let note of channel.currentNoteOn) {
      note.updatePitchBend(pitchBend)
    }

    channel.pitchBend = pitchBend
  }

  pitchBendSensitivity(channelNumber: number, sensitivity: number) {
    this.channels[channelNumber].pitchBendSensitivity = sensitivity
  }

  releaseTime(channelNumber: number, releaseTime: number) {
    this.channels[channelNumber].releaseTime = releaseTime;
  }

  allSoundOff(channelNumber: number) {
    const currentNoteOn = this.channels[channelNumber].currentNoteOn

    while (currentNoteOn.length > 0) {
      this.noteOff(channelNumber, currentNoteOn[0].key, 0)
    }
  }

  resetAllControl(channelNumber: number) {
    this.pitchBend(channelNumber, 0)
  }

  setReverbDepth(channelNumber: number, depth: number) {
    this.channels[channelNumber].reverb = depth
  }

  private getBank(channelNumber: number) {
    let bankIndex = 0;
    const channel = this.channels[channelNumber];

    if (channel === undefined) {
      return;
    }

    if (channelNumber === 9) {
      this.setPercussionPart(9, true);
      return this.isXG ? 127 : 128;
    }

    if (this.isXG) {
      // XG音源は、MSB→LSBの優先順でバンクセレクトをする。
      if (channel.bankMsb === 64) {
        // Bank Select MSB #64 (Voice Type: SFX)
        bankIndex = 125;
      } else if (channel.bankMsb === 126 || channel.bankMsb === 127) {
        // Bank Select MSB #126 (Voice Type: Drum)
        // Bank Select MSB #127 (Voice Type: Drum)
        bankIndex = channel.bankMsb;
      } else {
        // Bank Select MSB #0 (Voice Type: Normal)
        // TODO:本来こちらが正しいが、バンクに存在しない楽器の処理ができていないためコメントアウト
        //bankIndex = this.channelBankLsb[channel];  
        bankIndex = 0;
      }
    } else if (this.isGS) {
      // GS音源
      bankIndex = 0;

      if (channel.isPercussionPart) {
        // http://www.roland.co.jp/support/by_product/sd-20/knowledge_base/1826700/
        bankIndex = 128;
      } else {
        // TODO: XG音源前提なんで・・・
        //bankIndex = this.channelBankMsb[channel];
      }
    } else {
      // GM音源の場合バンクセレクト無効化
      bankIndex = 0;
    }
    //if (this.percussionPart[channel] && SoundFont.Instruments.PercussionProgramName[this.channelInstrument[channel]] === void 0) {
    // パーカッションチャンネルで、GM に存在しないドラムセットが呼び出された時は、Standard Setを呼び出す。
    //this.channelInstrument[channel] = 0;
    //}
    return bankIndex;
  }
  setPercussionPart(channelNumber: number, sw: boolean) {
    this.channels[channelNumber].isPercussionPart = sw;
  }
}
