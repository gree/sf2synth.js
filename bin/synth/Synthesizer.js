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
        this.currentNoteOn = [];
    }
}
export default class Synthesizer {
    constructor(ctx) {
        this.bank = 0;
        this.bufferSize = 1024;
        this.channels = [];
        this.masterVolume = 1.0;
        this.ctx = ctx;
        this.gainMaster = this.ctx.createGain();
        this.setMasterVolume(this.masterVolume);
        this.init();
    }
    init() {
        for (let i = 0; i < 16; ++i) {
            this.channels.push(new Channel());
            this.programChange(i, i !== 9 ? i : 0);
            this.volumeChange(i, 0x64);
            this.panpotChange(i, 0x40);
            this.pitchBend(i, 0);
            this.pitchBendSensitivity(i, 2);
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
        this.masterVolume = volume;
        this.gainMaster.gain.value = BASE_VOLUME * volume / 0x8000;
    }
    noteOn(channelNumber, key, velocity) {
        if (!this.soundFont) {
            return;
        }
        const bankNumber = channelNumber === 9 ? 128 : this.bank;
        const channel = this.channels[channelNumber];
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
            pitchBendSensitivity: channel.pitchBendSensitivity
        };
        // note on
        const note = new SynthesizerNote(this.ctx, this.gainMaster, noteInfo, instrumentKey);
        note.noteOn();
        channel.currentNoteOn.push(note);
    }
    noteOff(channelNumber, key, _velocity) {
        if (!this.soundFont) {
            return;
        }
        const bankNumber = channelNumber === 9 ? 128 : this.bank;
        const channel = this.channels[channelNumber];
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
    programChange(channelNumber, instrument) {
        this.channels[channelNumber].instrument = instrument;
    }
    volumeChange(channelNumber, volume) {
        this.channels[channelNumber].volume = volume;
    }
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
    allSoundOff(channelNumber) {
        const currentNoteOn = this.channels[channelNumber].currentNoteOn;
        while (currentNoteOn.length > 0) {
            this.noteOff(channelNumber, currentNoteOn[0].key, 0);
        }
    }
    resetAllControl(channelNumber) {
        this.pitchBend(channelNumber, 0);
    }
}
//# sourceMappingURL=Synthesizer.js.map