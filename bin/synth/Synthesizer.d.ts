import SynthesizerNote from "./SynthesizerNote";
import SoundFont from "../parser/SoundFont";
import { Listener } from "./MidiMessageHandler";
declare class Channel {
    instrument: number;
    volume: number;
    pitchBend: number;
    pitchBendSensitivity: number;
    panpot: number;
    currentNoteOn: SynthesizerNote[];
}
export default class Synthesizer implements Listener {
    bank: number;
    bufferSize: number;
    ctx: AudioContext;
    gainMaster: GainNode;
    channels: Channel[];
    masterVolume: number;
    soundFont: SoundFont;
    constructor(ctx: any);
    init(): void;
    loadSoundFont(input: Uint8Array): void;
    connect(destination: AudioNode): void;
    setMasterVolume(volume: number): void;
    noteOn(channelNumber: number, key: number, velocity: number): void;
    noteOff(channelNumber: number, key: number, _velocity: number): void;
    programChange(channelNumber: number, instrument: number): void;
    volumeChange(channelNumber: number, volume: number): void;
    panpotChange(channelNumber: number, panpot: number): void;
    pitchBend(channelNumber: number, pitchBend: number): void;
    pitchBendSensitivity(channelNumber: number, sensitivity: number): void;
    allSoundOff(channelNumber: number): void;
    resetAllControl(channelNumber: number): void;
}
export {};
