export interface Listener {
    noteOn(channel: number, key: number, velocity: number): any;
    noteOff(channel: number, key: number, velocity: number): any;
    setMasterVolume(volume: number): any;
    programChange(channelNumber: number, instrument: number): any;
    volumeChange(channelNumber: number, volume: number): any;
    panpotChange(channelNumber: number, panpot: number): any;
    pitchBend(channelNumber: number, pitchBend: number): any;
    pitchBendSensitivity(channelNumber: number, sensitivity: number): any;
    allSoundOff(channelNumber: number): any;
    resetAllControl(channelNumber: number): any;
}
export default class MidiMessageHandler {
    private RpnMsb;
    private RpnLsb;
    listener: Listener;
    processMidiMessage(message: number[]): void;
}
