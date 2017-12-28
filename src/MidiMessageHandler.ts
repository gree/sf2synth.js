import Synthesizer from "./Synthesizer"

export default class MidiMessageHandler {
  private RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  private RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  synth: Synthesizer

  processMidiMessage(message: number[]) {
    const channel = message[0] & 0x0f
    const { synth } = this

    if (!synth) {
      return
    }

    switch (message[0] & 0xf0) {
      case 0x80: // NoteOff: 8n kk vv
        synth.noteOff(channel, message[1], message[2])
        break
      case 0x90: // NoteOn: 9n kk vv
        if (message[2] > 0) {
          synth.noteOn(channel, message[1], message[2])
        } else {
          synth.noteOff(channel, message[1], 0)
        }
        break
      case 0xB0: // Control Change: Bn cc dd
        switch (message[1]) {
          case 0x06: // Data Entry: Bn 06 dd
            switch (this.RpnMsb[channel]) {
              case 0:
                switch (this.RpnLsb[channel]) {
                  case 0: // Pitch Bend Sensitivity
                    synth.pitchBendSensitivity(channel, message[2])
                    break
                  default: 
                    break
                }
                break
              default: 
                break
            }
            break
          case 0x07: // Volume Change: Bn 07 dd
            synth.volumeChange(channel, message[2])
            break
          case 0x0A: // Panpot Change: Bn 0A dd
            synth.panpotChange(channel, message[2])
            break
          case 0x78: // All Sound Off: Bn 78 00
            synth.allSoundOff(channel)
            break
          case 0x79: // Reset All Control: Bn 79 00
            synth.resetAllControl(channel)
            break
          case 0x20: // BankSelect
            //console.log("bankselect:", channel, message[2])
            break
          case 0x64: // RPN MSB
            this.RpnMsb[channel] = message[2]
            break
          case 0x65: // RPN LSB
            this.RpnLsb[channel] = message[2]
            break
          default:
          // not supported
        }
        break
      case 0xC0: // Program Change: Cn pp
        synth.programChange(channel, message[1])
        break
      case 0xE0: // Pitch Bend
        synth.pitchBend(channel, message[1], message[2])
        break
      case 0xf0: // System Exclusive Message
        // ID number
        switch (message[1]) {
          case 0x7e: // non-realtime
            // TODO
            break
          case 0x7f: // realtime
            // const device = message[2]
            // sub ID 1
            switch (message[3]) {
              case 0x04: // device control
                // sub ID 2
                switch (message[4]) {
                  case 0x01: { // master volume
                    const volume = message[5] + (message[6] << 7)
                    const MAX_VOLUME = 0x4000 - 1
                    synth.setMasterVolume(volume / MAX_VOLUME)
                    break
                  }
                  default: 
                    break
                }
                break
              default: 
                break
            }
            break
          default: 
            break
        }
        break
      default: // not supported
        break
    }
  }
}
