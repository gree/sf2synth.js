export default class MidiMessageHandler {
    constructor() {
        this.RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    processMidiMessage(message) {
        const channel = message[0] & 0x0f;
        const { listener } = this;
        if (listener === undefined) {
            return;
        }
        switch (message[0] & 0xf0) {
            case 0x80: // NoteOff: 8n kk vv
                listener.noteOff(channel, message[1], message[2]);
                break;
            case 0x90: // NoteOn: 9n kk vv
                if (message[2] > 0) {
                    listener.noteOn(channel, message[1], message[2]);
                }
                else {
                    listener.noteOff(channel, message[1], 0);
                }
                break;
            case 0xB0: // Control Change: Bn cc dd
                switch (message[1]) {
                    case 0x06: // Data Entry: Bn 06 dd
                        switch (this.RpnMsb[channel]) {
                            case 0:
                                switch (this.RpnLsb[channel]) {
                                    case 0: // Pitch Bend Sensitivity
                                        listener.pitchBendSensitivity(channel, message[2]);
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                    case 0x07: // Volume Change: Bn 07 dd
                        listener.volumeChange(channel, message[2]);
                        break;
                    case 0x0A: // Panpot Change: Bn 0A dd
                        listener.panpotChange(channel, message[2]);
                        break;
                    case 0x78: // All Sound Off: Bn 78 00
                        listener.allSoundOff(channel);
                        break;
                    case 0x79: // Reset All Control: Bn 79 00
                        listener.resetAllControl(channel);
                        break;
                    case 0x20: // BankSelect
                        //console.log("bankselect:", channel, message[2])
                        break;
                    case 0x64: // RPN MSB
                        this.RpnMsb[channel] = message[2];
                        break;
                    case 0x65: // RPN LSB
                        this.RpnLsb[channel] = message[2];
                        break;
                    case 0x40: // Hold
                        listener.hold(channel, message[2] !== 0);
                        break;
                    case 0x0b: // Expression
                        listener.expression(channel, message[2]);
                        break;
                    case 0x47: // Cutoff Fequency (Brightness)
                        // listener.cutOffFrequency[channel] = message[2];
                        break;
                    case 0x48: // DecayTyme
                        // synth.decayTime[channel] = value;
                        break;
                    case 0x49: // ReleaseTime
                        listener.releaseTime(channel, message[2]);
                        break;
                    case 0x4A: // Hermonic Content (Resonance)
                        // listener.harmonicContent[channel] = message[2];
                        break;
                    case 0x5B: // Effect1 Depth（Reverb Send Level）
                        listener.setReverbDepth(channel, message[2]);
                        break;
                    default:
                    // not supported
                }
                break;
            case 0xC0: // Program Change: Cn pp
                listener.programChange(channel, message[1]);
                break;
            case 0xE0: { // Pitch Bend
                const bend = ((message[1] & 0x7f) | ((message[2] & 0x7f) << 7));
                listener.pitchBend(channel, bend);
                break;
            }
            case 0xf0: // System Exclusive Message
                // ID number
                switch (message[1]) {
                    case 0x7e: // non-realtime
                        // GM Reset: F0 7E 7F 09 01 F7
                        if (message[2] === 0x7f && message[3] === 0x09 && message[4] === 0x01) {
                            listener.isXG = false;
                            listener.isGS = false;
                            listener.init();
                        }
                        break;
                    case 0x7f: // realtime
                        // const device = message[2]
                        // sub ID 1
                        switch (message[3]) {
                            case 0x04: // device control
                                // sub ID 2
                                switch (message[4]) {
                                    case 0x01: { // master volume
                                        const volume = message[5] + (message[6] << 7);
                                        const MAX_VOLUME = 0x4000 - 1;
                                        listener.setMasterVolume(volume / MAX_VOLUME);
                                        break;
                                    }
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
                // Vendor
                switch (message[2]) {
                    case 0x43: // Yamaha XG
                        if (message[5] === 0x08) {
                            // XG Dram Part: F0 43 [dev] 4C 08 [partNum] 07 [map] F7
                            // but there is no file to use much this parameter...
                            if (message[7] !== 0x00) { // [map]
                                listener.setPercussionPart(message[6], true);
                            }
                            else {
                                listener.setPercussionPart(message[6], false);
                            }
                            //goog.global.console.log(message);
                        }
                        switch (message[7]) {
                            case 0x04:
                                // XG Master Volume: F0 43 [dev] 4C 00 00 04 [value] F7
                                listener.setMasterVolume((message[8] << 7) * 2);
                                //console.log(message[8] << 7);
                                break;
                            case 0x7E:
                                // XG Reset: F0 43 [dev] 4C 00 00 7E 00 F7
                                listener.init();
                                listener.isXG = true;
                                break;
                        }
                        break;
                    case 0x41: // Roland GS / TG300B Mode
                        // TODO
                        switch (message[8]) {
                            case 0x04:
                                // GS Master Volume: F0 41 [dev] 42 12 40 00 04 [value] 58 F7
                                listener.setMasterVolume(message[9] << 7);
                                break;
                            case 0x7F:
                                // GS Reset: F0 41 [dev] 42 12 40 00 7F 00 41 F7
                                listener.init();
                                listener.isGS = true;
                                break;
                            case 0x15:
                                // GS Dram part: F0 41 [dev] 42 12 40 1[part no] [Map] [sum] F7
                                // Notice: [sum] is ignroe in this program.
                                // http://www.ssw.co.jp/dtm/drums/drsetup.htm
                                // http://www.roland.co.jp/support/by_product/sd-20/knowledge_base/1826700/
                                var part = message[7] - 0x0F;
                                var map = message[8];
                                if (part === 0) {
                                    // 10 Ch.
                                    if (map !== 0x00) {
                                        listener.setPercussionPart(9, true);
                                    }
                                    else {
                                        listener.setPercussionPart(9, false);
                                    }
                                }
                                else if (part >= 10) {
                                    // 1~9 Ch.
                                    if (map !== 0x00) {
                                        listener.setPercussionPart(part - 1, true);
                                    }
                                    else {
                                        listener.setPercussionPart(part - 1, false);
                                    }
                                }
                                else {
                                    // 11~16 Ch.
                                    if (map !== 0x00) {
                                        listener.setPercussionPart(part, true);
                                    }
                                    else {
                                        listener.setPercussionPart(part, false);
                                    }
                                }
                                break;
                        }
                        break;
                }
                break;
            default: // not supported
                break;
        }
    }
}
//# sourceMappingURL=MidiMessageHandler.js.map