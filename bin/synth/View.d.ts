import Synthesizer from "./Synthesizer";
import { Listener } from "./MidiMessageHandler";
export default class View implements Listener {
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
}
