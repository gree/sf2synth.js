import SynthesizerNote from "./SynthesizerNote";
import parse from "../parser/Parser";
import SoundFont from "../parser/SoundFont";
const BASE_VOLUME = 0.4;
class Channel {
    constructor() {
        this.instrument = 0;
        this.volume = 0;
        this.pitchBend = 0;
        this.pitchBendSensitivity = 0;
        this.panpot = 0;
        this.expression = 0;
        this.releaseTime = 0;
        this.reverb = 0;
        this.currentNoteOn = [];
        this.hold = false;
        this.bankMsb = 0;
        this.bankLsb = 0;
        this.isPercussionPart = false;
        this.harmonicContent = 0;
        this.cutOffFrequency = 0;
        this.mute = false;
    }
}
export default class Synthesizer {
    constructor(ctx) {
        this.bufferSize = 1024;
        this.channels = [];
        this.masterVolume = 1.0;
        this.ctx = ctx;
        this.gainMaster = this.ctx.createGain();
        this.setMasterVolume(this.masterVolume);
        this.init();
    }
    init() {
        this.channels = [];
        for (let i = 0; i < 16; ++i) {
            this.channels.push(new Channel());
            this.programChange(i, 0x00);
            this.volumeChange(i, 0x64);
            this.panpotChange(i, 0x40);
            this.pitchBend(i, 0);
            this.pitchBendSensitivity(i, 2);
            this.hold(i, false);
            this.expression(i, 0x7f);
            this.bankSelectMsb(i, i === 9 ? 0x80 : 0x00);
            this.bankSelectLsb(i, 0x00);
            this.setPercussionPart(i, i === 9);
            this.releaseTime(i, 0x40);
            this.setReverbDepth(i, 0x28);
        }
    }
    loadSoundFont(input) {
        const parser = parse(input);
        this.soundFont = new SoundFont(parser);
    }
    connect(destination) {
        this.gainMaster.connect(destination);
    }
    setMasterVolume(volume) {
        const vol = BASE_VOLUME * volume / 0x8000;
        this.masterVolume = volume;
        if (vol) {
            //this.gainMaster.gain.value = BASE_VOLUME * volume / 0x8000
            this.gainMaster.gain.setTargetAtTime(BASE_VOLUME * volume / 0x8000, this.ctx.currentTime, 0.015);
        }
    }
    noteOn(channelNumber, key, velocity) {
        if (!this.soundFont) {
            return;
        }
        const bankNumber = this.getBank(channelNumber);
        const channel = this.channels[channelNumber];
        if (channel === undefined) {
            return;
        }
        const noteInfo = this.soundFont.getInstrumentKey(bankNumber, channel.instrument, key, velocity);
        if (!noteInfo) {
            return;
        }
        let panpot = channel.panpot - 64;
        panpot /= panpot < 0 ? 64 : 63;
        // create note information
        const instrumentKey = {
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
        };
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
        const note = new SynthesizerNote(this.ctx, this.gainMaster, noteInfo, instrumentKey);
        note.noteOn();
        this.channels[channelNumber].currentNoteOn.push(note);
    }
    noteOff(channelNumber, key, _velocity) {
        if (!this.soundFont) {
            return;
        }
        const bankNumber = this.getBank(channelNumber);
        const channel = this.channels[channelNumber];
        if (channel === undefined) {
            return;
        }
        const instrumentKey = this.soundFont.getInstrumentKey(bankNumber, channel.instrument, key);
        if (!instrumentKey) {
            return;
        }
        const currentNoteOn = channel.currentNoteOn;
        for (let i = 0, il = currentNoteOn.length; i < il; ++i) {
            const note = currentNoteOn[i];
            if (note.key === key) {
                note.noteOff();
                currentNoteOn.splice(i, 1);
                --i;
                --il;
            }
        }
    }
    hold(channelNumber, value) {
        this.channels[channelNumber].hold = value;
    }
    bankSelectMsb(channelNumber, value) {
        this.channels[channelNumber].bankMsb = value;
    }
    bankSelectLsb(channelNumber, value) {
        this.channels[channelNumber].bankLsb = value;
    }
    programChange(channelNumber, instrument) {
        this.channels[channelNumber].instrument = instrument;
    }
    volumeChange(channelNumber, volume) {
        this.channels[channelNumber].volume = volume;
    }
    expression(channelNumber, expression) {
        const currentNoteOn = this.channels[channelNumber].currentNoteOn;
        for (let i = 0, il = currentNoteOn.length; i < il; ++i) {
            currentNoteOn[i].updateExpression(expression);
        }
        this.channels[channelNumber].expression = expression;
    }
    ;
    panpotChange(channelNumber, panpot) {
        this.channels[channelNumber].panpot = panpot;
    }
    pitchBend(channelNumber, pitchBend) {
        pitchBend -= 0x2000;
        const channel = this.channels[channelNumber];
        for (let note of channel.currentNoteOn) {
            note.updatePitchBend(pitchBend);
        }
        channel.pitchBend = pitchBend;
    }
    pitchBendSensitivity(channelNumber, sensitivity) {
        this.channels[channelNumber].pitchBendSensitivity = sensitivity;
    }
    releaseTime(channelNumber, releaseTime) {
        this.channels[channelNumber].releaseTime = releaseTime;
    }
    allSoundOff(channelNumber) {
        const currentNoteOn = this.channels[channelNumber].currentNoteOn;
        while (currentNoteOn.length > 0) {
            this.noteOff(channelNumber, currentNoteOn[0].key, 0);
        }
    }
    resetAllControl(channelNumber) {
        this.pitchBend(channelNumber, 0);
    }
    setReverbDepth(channelNumber, depth) {
        this.channels[channelNumber].reverb = depth;
    }
    getBank(channelNumber) {
        let bankIndex = 0;
        const channel = this.channels[channelNumber];
        if (channel === undefined) {
            return 0;
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
            }
            else if (channel.bankMsb === 126 || channel.bankMsb === 127) {
                // Bank Select MSB #126 (Voice Type: Drum)
                // Bank Select MSB #127 (Voice Type: Drum)
                bankIndex = channel.bankMsb;
            }
            else {
                // Bank Select MSB #0 (Voice Type: Normal)
                // TODO:本来こちらが正しいが、バンクに存在しない楽器の処理ができていないためコメントアウト
                //bankIndex = this.channelBankLsb[channel];  
                bankIndex = 0;
            }
        }
        else if (this.isGS) {
            // GS音源
            bankIndex = 0;
            if (channel.isPercussionPart) {
                // http://www.roland.co.jp/support/by_product/sd-20/knowledge_base/1826700/
                bankIndex = 128;
            }
            else {
                // TODO: XG音源前提なんで・・・
                //bankIndex = this.channelBankMsb[channel];
            }
        }
        else {
            // GM音源の場合バンクセレクト無効化
            bankIndex = 0;
        }
        //if (this.percussionPart[channel] && SoundFont.Instruments.PercussionProgramName[this.channelInstrument[channel]] === void 0) {
        // パーカッションチャンネルで、GM に存在しないドラムセットが呼び出された時は、Standard Setを呼び出す。
        //this.channelInstrument[channel] = 0;
        //}
        return bankIndex;
    }
    setPercussionPart(channelNumber, sw) {
        this.channels[channelNumber].isPercussionPart = sw;
    }
}
//# sourceMappingURL=Synthesizer.js.map