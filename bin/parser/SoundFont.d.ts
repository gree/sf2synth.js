import { ParseResult } from "./Parser";
import { RangeValue, GeneratorList } from "./Structs";
/**
 * Parser で読み込んだサウンドフォントのデータを
 * Synthesizer から利用しやすい形にするクラス
 */
export default class SoundFont {
    private parsed;
    constructor(parsed: ParseResult);
    getPresetZone(presetHeaderIndex: number): GeneratorList[];
    getInstrumentZone(instrumentZoneIndex: number): {
        keyRange: RangeValue | undefined;
        velRange: RangeValue | undefined;
        sampleID: number | undefined;
        volAttack: number | undefined;
        volDecay: number | undefined;
        volDelay: number | undefined;
        volSustain: number | undefined;
        volRelease: number | undefined;
        modAttack: number | undefined;
        modDecay: number | undefined;
        modDelay: number | undefined;
        modSustain: number | undefined;
        modRelease: number | undefined;
        modEnvToPitch: number | undefined;
        modEnvToFilterFc: number | undefined;
        coarseTune: number | undefined;
        fineTune: number | undefined;
        scaleTuning: number | undefined;
        freqVibLFO: number | undefined;
        startAddrsOffset: number | undefined;
        startAddrsCoarseOffset: number | undefined;
        endAddrsOffset: number | undefined;
        endAddrsCoarseOffset: number | undefined;
        startloopAddrsOffset: number | undefined;
        startloopAddrsCoarseOffset: number | undefined;
        endloopAddrsOffset: number | undefined;
        initialAttenuation: number | undefined;
        endloopAddrsCoarseOffset: number | undefined;
        overridingRootKey: number | undefined;
        initialFilterQ: number | undefined;
        initialFilterFc: number | undefined;
        sampleModes: number | undefined;
        pan: number | undefined;
    };
    getInstrumentZoneIndexes(instrumentID: number): number[];
    getInstrumentKey(bankNumber: any, instrumentNumber: any, key: any, velocity?: number): NoteInfo | null;
    getPresetNames(): {
        [index: number]: {
            [index: number]: string;
        };
    };
}
export declare function convertTime(value: any): number;
export interface NoteInfo {
    sample: Int16Array;
    sampleRate: number;
    sampleName: string;
    sampleModes: number;
    playbackRate: Function;
    modEnvToPitch: number;
    scaleTuning: number;
    start: number;
    end: number;
    loopStart: number;
    loopEnd: number;
    volDelay: number;
    volAttack: number;
    volHold: number;
    volDecay: number;
    volSustain: number;
    volRelease: number;
    modDelay: number;
    modAttack: number;
    modHold: number;
    modDecay: number;
    modSustain: number;
    modRelease: number;
    initialFilterFc: number;
    modEnvToFilterFc: number;
    initialFilterQ: number;
    initialAttenuation: number;
    freqVibLFO: number | undefined;
    mute: boolean;
    releaseTime: number;
    pan: number | undefined;
    keyRange: RangeValue;
    velRange: RangeValue | undefined;
}
