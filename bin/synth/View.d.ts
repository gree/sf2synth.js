import Synthesizer from "./Synthesizer";
import { Listener } from "./MidiMessageHandler";
export default class View implements Listener {
    isXG: boolean;
    isGS: boolean;
    private element;
    private drag;
    draw(synth: Synthesizer): Element;
    remove(): void;
    private getInstrumentElement;
    private getKeyElement;
    private findInstrumentElement;
    noteOn(channel: number, key: number, _velocity: number): void;
    noteOff(channel: number, key: number, _velocity: number): void;
    programChange(channel: number, instrument: number): void;
    volumeChange(channel: number, volume: number): void;
    panpotChange(channel: number, panpot: number): void;
    pitchBend(channel: number, pitchBend: number): void;
    pitchBendSensitivity(channel: number, sensitivity: number): void;
    allSoundOff(_channelNumber: number): void;
    setMasterVolume(_volume: number): void;
    resetAllControl(_channelNumber: number): void;
    init(): void;
    expression(_value: number): void;
    setPercussionPart(_channelNumber: number, _sw: boolean): void;
    hold(_channelNumber: number, _sw: boolean): void;
    setReverbDepth(_channelNumber: number, _depth: number): void;
    releaseTime(_channelNumber: number, _value: number): void;
}
