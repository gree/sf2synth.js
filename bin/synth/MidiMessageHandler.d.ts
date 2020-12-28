export interface Listener {
    init(): any;
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
    expression(channelNumber: number, expression: number): any;
    setPercussionPart(channelNumber: number, sw: boolean): any;
    hold(channelNumber: number, sw: boolean): any;
    setReverbDepth(channelNumber: number, depth: number): any;
    releaseTime(channelNumber: number, value: number): any;
    isXG: boolean;
    isGS: boolean;
}
export default class MidiMessageHandler {
    private RpnMsb;
    private RpnLsb;
    listener: Listener;
    processMidiMessage(message: number[]): void;
}
