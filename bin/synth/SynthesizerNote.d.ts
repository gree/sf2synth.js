import { NoteInfo } from "../parser/SoundFont";
export interface InstrumentState {
    channel: number;
    key: number;
    volume: number;
    panpot: number;
    velocity: number;
    pitchBend: number;
    pitchBendSensitivity: number;
}
export default class SynthesizerNote {
    audioBuffer: AudioBuffer;
    bufferSource: AudioBufferSourceNode;
    panner: PannerNode;
    gainOutput: GainNode;
    ctx: AudioContext;
    destination: AudioNode;
    filter: BiquadFilterNode;
    noteInfo: NoteInfo;
    instrument: InstrumentState;
    channel: number;
    key: number;
    velocity: number;
    playbackRate: number;
    volume: number;
    panpot: number;
    pitchBend: number;
    pitchBendSensitivity: number;
    startTime: number;
    computedPlaybackRate: number;
    constructor(ctx: AudioContext, destination: AudioNode, noteInfo: NoteInfo, instrument: InstrumentState);
    noteOn(): void;
    noteOff(): void;
    disconnect(): void;
    schedulePlaybackRate(): void;
    updatePitchBend(pitchBend: number): void;
}
