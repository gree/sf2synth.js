import Synthesizer from "./Synthesizer";
import View from "./View";
import MidiMessageHandler from "./MidiMessageHandler";
export default class WebMidiLink {
    loadCallback: (ArrayBuffer: any) => void;
    midiMessageHandler: MidiMessageHandler;
    ready: boolean;
    synth: Synthesizer;
    view: View;
    constructor();
    setup(url: any): void;
    load(url: any): void;
    onload(response: ArrayBuffer): void;
    loadSoundFont(input: Uint8Array): void;
    onmessage(ev: MessageEvent): void;
    setLoadCallback(callback: (ArrayBuffer: any) => void): void;
}
