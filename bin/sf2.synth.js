(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Stream {
    constructor(data, offset) {
        this.data = data;
        this.ip = offset;
    }
    readString(size) {
        const str = String.fromCharCode.apply(null, this.data.subarray(this.ip, this.ip += size));
        const nullLocation = str.indexOf("\u0000");
        if (nullLocation > 0) {
            return str.substr(0, nullLocation);
        }
        return str;
    }
    readWORD() {
        return this.data[this.ip++] | (this.data[this.ip++] << 8);
    }
    readDWORD(bigEndian = false) {
        if (bigEndian) {
            return (this.data[this.ip++] << 24 |
                (this.data[this.ip++] << 16) |
                (this.data[this.ip++] << 8) |
                (this.data[this.ip++])) >>> 0;
        }
        else {
            return (this.data[this.ip++] |
                (this.data[this.ip++] << 8) |
                (this.data[this.ip++] << 16) |
                (this.data[this.ip++] << 24)) >>> 0;
        }
    }
    readByte() {
        return this.data[this.ip++];
    }
    readAt(offset) {
        return this.data[this.ip + offset];
    }
    /* helper */
    readUInt8() {
        return this.readByte();
    }
    readInt8() {
        return (this.readByte() << 24) >> 24;
    }
    readUInt16() {
        return this.readWORD();
    }
    readInt16() {
        return (this.readWORD() << 16) >> 16;
    }
    readUInt32() {
        return this.readDWORD();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Stream;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Constants__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Stream__ = __webpack_require__(0);


class VersionTag {
    static parse(stream) {
        const v = new VersionTag();
        v.major = stream.readInt8();
        v.minor = stream.readInt8();
        return v;
    }
}
/* unused harmony export VersionTag */

class Info {
    // LIST - INFO の全ての chunk
    static parse(data, chunks) {
        function getChunk(type) {
            return chunks.find(c => c.type === type);
        }
        function toStream(chunk) {
            return new __WEBPACK_IMPORTED_MODULE_1__Stream__["a" /* default */](data, chunk.offset);
        }
        function readString(type) {
            const chunk = getChunk(type);
            if (!chunk) {
                return null;
            }
            return toStream(chunk).readString(chunk.size);
        }
        function readVersionTag(type) {
            const chunk = getChunk(type);
            if (!chunk) {
                return null;
            }
            return VersionTag.parse(toStream(chunk));
        }
        const info = new Info();
        info.comment = readString("ICMT");
        info.copyright = readString("ICOP");
        info.creationDate = readString("ICRD");
        info.engineer = readString("IENG");
        info.name = readString("INAM");
        info.product = readString("IPRD");
        info.software = readString("ISFT");
        info.version = readVersionTag("ifil");
        info.soundEngine = readString("isng");
        info.romName = readString("irom");
        info.romVersion = readVersionTag("iver");
        return info;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Info;

class PresetHeader {
    get isEnd() {
        return this.presetName === "EOP";
    }
    static parse(stream) {
        const p = new PresetHeader();
        p.presetName = stream.readString(20);
        p.preset = stream.readWORD();
        p.bank = stream.readWORD();
        p.presetBagIndex = stream.readWORD();
        p.library = stream.readDWORD();
        p.genre = stream.readDWORD();
        p.morphology = stream.readDWORD();
        return p;
    }
}
/* harmony export (immutable) */ __webpack_exports__["g"] = PresetHeader;

class PresetBag {
    static parse(stream) {
        const p = new PresetBag();
        p.presetGeneratorIndex = stream.readWORD();
        p.presetModulatorIndex = stream.readWORD();
        return p;
    }
}
/* harmony export (immutable) */ __webpack_exports__["f"] = PresetBag;

class RangeValue {
    constructor(lo, hi) {
        this.lo = lo;
        this.hi = hi;
    }
    static parse(stream) {
        return new RangeValue(stream.readByte(), stream.readByte());
    }
}
/* harmony export (immutable) */ __webpack_exports__["h"] = RangeValue;

class ModulatorList {
    get type() {
        return __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* GeneratorEnumeratorTable */][this.destinationOper];
    }
    get isEnd() {
        return this.sourceOper === 0 &&
            this.destinationOper === 0 &&
            this.value === 0 &&
            this.amountSourceOper === 0 &&
            this.transOper === 0;
    }
    static parse(stream) {
        const t = new ModulatorList();
        t.sourceOper = stream.readWORD();
        t.destinationOper = stream.readWORD();
        switch (t.type) {
            case 'keyRange': /* FALLTHROUGH */
            case 'velRange': /* FALLTHROUGH */
            case 'keynum': /* FALLTHROUGH */
            case 'velocity':
                t.value = RangeValue.parse(stream);
                break;
            default:
                t.value = stream.readInt16();
                break;
        }
        t.amountSourceOper = stream.readWORD();
        t.transOper = stream.readWORD();
        return t;
    }
}
/* harmony export (immutable) */ __webpack_exports__["e"] = ModulatorList;

class GeneratorList {
    get type() {
        return __WEBPACK_IMPORTED_MODULE_0__Constants__["a" /* GeneratorEnumeratorTable */][this.code];
    }
    get isEnd() {
        return this.code === 0 &&
            this.value === 0;
    }
    static parse(stream) {
        const t = new GeneratorList();
        t.code = stream.readWORD();
        switch (t.type) {
            case 'keynum': /* FALLTHROUGH */
            case 'keyRange': /* FALLTHROUGH */
            case 'velRange': /* FALLTHROUGH */
            case 'velocity':
                t.value = RangeValue.parse(stream);
                break;
            default:
                t.value = stream.readInt16();
                break;
        }
        return t;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GeneratorList;

class Instrument {
    get isEnd() {
        return this.instrumentName === "EOI";
    }
    static parse(stream) {
        const t = new Instrument();
        t.instrumentName = stream.readString(20);
        t.instrumentBagIndex = stream.readWORD();
        return t;
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = Instrument;

class InstrumentBag {
    static parse(stream) {
        const t = new InstrumentBag();
        t.instrumentGeneratorIndex = stream.readWORD();
        t.instrumentModulatorIndex = stream.readWORD();
        return t;
    }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = InstrumentBag;

class SampleHeader {
    get isEnd() {
        return this.sampleName === "EOS";
    }
    static parse(stream) {
        const s = new SampleHeader();
        s.sampleName = stream.readString(20);
        s.start = stream.readDWORD();
        s.end = stream.readDWORD();
        s.loopStart = stream.readDWORD();
        s.loopEnd = stream.readDWORD();
        s.sampleRate = stream.readDWORD();
        s.originalPitch = stream.readByte();
        s.pitchCorrection = stream.readInt8();
        s.sampleLink = stream.readWORD();
        s.sampleType = stream.readWORD();
        s.loopStart -= s.start;
        s.loopEnd -= s.start;
        return s;
    }
}
/* harmony export (immutable) */ __webpack_exports__["i"] = SampleHeader;

const SampleLink = {
    monoSample: 1,
    rightSample: 2,
    leftSample: 4,
    linkedSample: 8,
    RomMonoSample: 0x8001,
    RomRightSample: 0x8002,
    RomLeftSample: 0x8004,
    RomLinkedSample: 0x8008
};
/* unused harmony export SampleLink */



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parse;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RiffParser__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Structs__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Stream__ = __webpack_require__(0);



function parse(input, option = {}) {
    // parse RIFF chunk
    const chunkList = Object(__WEBPACK_IMPORTED_MODULE_0__RiffParser__["a" /* parseRiff */])(input, 0, input.length, option);
    if (chunkList.length !== 1) {
        throw new Error('wrong chunk length');
    }
    const chunk = chunkList[0];
    if (chunk === null) {
        throw new Error('chunk not found');
    }
    function parseRiffChunk(chunk, data) {
        const chunkList = getChunkList(chunk, data, "RIFF", "sfbk");
        if (chunkList.length !== 3) {
            throw new Error('invalid sfbk structure');
        }
        return Object.assign({ 
            // INFO-list
            info: parseInfoList(chunkList[0], data), 
            // sdta-list
            samplingData: parseSdtaList(chunkList[1], data) }, parsePdtaList(chunkList[2], data));
    }
    function parsePdtaList(chunk, data) {
        const chunkList = getChunkList(chunk, data, "LIST", "pdta");
        // check number of chunks
        if (chunkList.length !== 9) {
            throw new Error('invalid pdta chunk');
        }
        return {
            presetHeaders: parsePhdr(chunkList[0], data),
            presetZone: parsePbag(chunkList[1], data),
            presetModulators: parsePmod(chunkList[2], data),
            presetGenerators: parsePgen(chunkList[3], data),
            instruments: parseInst(chunkList[4], data),
            instrumentZone: parseIbag(chunkList[5], data),
            instrumentModulators: parseImod(chunkList[6], data),
            instrumentGenerators: parseIgen(chunkList[7], data),
            sampleHeaders: parseShdr(chunkList[8], data)
        };
    }
    const result = parseRiffChunk(chunk, input);
    return Object.assign({}, result, { samples: loadSample(result.sampleHeaders, result.samplingData.offset, input) });
}
function getChunkList(chunk, data, expectedType, expectedSignature) {
    // check parse target
    if (chunk.type !== expectedType) {
        throw new Error('invalid chunk type:' + chunk.type);
    }
    const stream = new __WEBPACK_IMPORTED_MODULE_2__Stream__["a" /* default */](data, chunk.offset);
    // check signature
    const signature = stream.readString(4);
    if (signature !== expectedSignature) {
        throw new Error('invalid signature:' + signature);
    }
    // read structure
    return Object(__WEBPACK_IMPORTED_MODULE_0__RiffParser__["a" /* parseRiff */])(data, stream.ip, chunk.size - 4);
}
function parseInfoList(chunk, data) {
    const chunkList = getChunkList(chunk, data, "LIST", "INFO");
    return __WEBPACK_IMPORTED_MODULE_1__Structs__["b" /* Info */].parse(data, chunkList);
}
function parseSdtaList(chunk, data) {
    const chunkList = getChunkList(chunk, data, "LIST", "sdta");
    if (chunkList.length !== 1) {
        throw new Error('TODO');
    }
    return chunkList[0];
}
function parseChunk(chunk, data, type, clazz, terminate) {
    const result = [];
    if (chunk.type !== type) {
        throw new Error('invalid chunk type:' + chunk.type);
    }
    const stream = new __WEBPACK_IMPORTED_MODULE_2__Stream__["a" /* default */](data, chunk.offset);
    const size = chunk.offset + chunk.size;
    while (stream.ip < size) {
        const obj = clazz.parse(stream);
        if (terminate && terminate(obj)) {
            break;
        }
        result.push(obj);
    }
    return result;
}
const parsePhdr = (chunk, data) => parseChunk(chunk, data, "phdr", __WEBPACK_IMPORTED_MODULE_1__Structs__["g" /* PresetHeader */], p => p.isEnd);
const parsePbag = (chunk, data) => parseChunk(chunk, data, "pbag", __WEBPACK_IMPORTED_MODULE_1__Structs__["f" /* PresetBag */]);
const parseInst = (chunk, data) => parseChunk(chunk, data, "inst", __WEBPACK_IMPORTED_MODULE_1__Structs__["c" /* Instrument */], i => i.isEnd);
const parseIbag = (chunk, data) => parseChunk(chunk, data, "ibag", __WEBPACK_IMPORTED_MODULE_1__Structs__["d" /* InstrumentBag */]);
const parsePmod = (chunk, data) => parseChunk(chunk, data, "pmod", __WEBPACK_IMPORTED_MODULE_1__Structs__["e" /* ModulatorList */], m => m.isEnd);
const parseImod = (chunk, data) => parseChunk(chunk, data, "imod", __WEBPACK_IMPORTED_MODULE_1__Structs__["e" /* ModulatorList */], m => m.isEnd);
const parsePgen = (chunk, data) => parseChunk(chunk, data, "pgen", __WEBPACK_IMPORTED_MODULE_1__Structs__["a" /* GeneratorList */], g => g.isEnd);
const parseIgen = (chunk, data) => parseChunk(chunk, data, "igen", __WEBPACK_IMPORTED_MODULE_1__Structs__["a" /* GeneratorList */], g => g.isEnd);
const parseShdr = (chunk, data) => parseChunk(chunk, data, "shdr", __WEBPACK_IMPORTED_MODULE_1__Structs__["i" /* SampleHeader */], s => s.isEnd);
function adjustSampleData(sample, sampleRate) {
    let multiply = 1;
    // buffer
    while (sampleRate < 22050) {
        const newSample = new Int16Array(sample.length * 2);
        for (let i = 0, j = 0, il = sample.length; i < il; ++i) {
            newSample[j++] = sample[i];
            newSample[j++] = sample[i];
        }
        sample = newSample;
        multiply *= 2;
        sampleRate *= 2;
    }
    return {
        sample,
        multiply
    };
}
function loadSample(sampleHeader, samplingDataOffset, data) {
    return sampleHeader.map(header => {
        let sample = new Int16Array(new Uint8Array(data.subarray(samplingDataOffset + header.start * 2, samplingDataOffset + header.end * 2)).buffer);
        if (header.sampleRate > 0) {
            const adjust = adjustSampleData(sample, header.sampleRate);
            sample = adjust.sample;
            header.sampleRate *= adjust.multiply;
            header.loopStart *= adjust.multiply;
            header.loopEnd *= adjust.multiply;
        }
        return sample;
    });
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parseRiff;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);

function parseChunk(input, ip, bigEndian) {
    const stream = new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](input, ip);
    const type = stream.readString(4);
    const size = stream.readDWORD(bigEndian);
    return new Chunk(type, size, stream.ip);
}
function parseRiff(input, index = 0, length, { padding = true, bigEndian = false } = {}) {
    const chunkList = [];
    const end = length + index;
    let ip = index;
    while (ip < end) {
        const chunk = parseChunk(input, ip, bigEndian);
        ip = chunk.offset + chunk.size;
        // padding
        if (padding && ((ip - index) & 1) === 1) {
            ip++;
        }
        chunkList.push(chunk);
    }
    return chunkList;
}
class Chunk {
    constructor(type, size, offset) {
        this.type = type;
        this.size = size;
        this.offset = offset;
    }
}
/* unused harmony export Chunk */



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const GeneratorEnumeratorTable = [
    'startAddrsOffset',
    'endAddrsOffset',
    'startloopAddrsOffset',
    'endloopAddrsOffset',
    'startAddrsCoarseOffset',
    'modLfoToPitch',
    'vibLfoToPitch',
    'modEnvToPitch',
    'initialFilterFc',
    'initialFilterQ',
    'modLfoToFilterFc',
    'modEnvToFilterFc',
    'endAddrsCoarseOffset',
    'modLfoToVolume',
    undefined,
    'chorusEffectsSend',
    'reverbEffectsSend',
    'pan',
    undefined, undefined, undefined,
    'delayModLFO',
    'freqModLFO',
    'delayVibLFO',
    'freqVibLFO',
    'delayModEnv',
    'attackModEnv',
    'holdModEnv',
    'decayModEnv',
    'sustainModEnv',
    'releaseModEnv',
    'keynumToModEnvHold',
    'keynumToModEnvDecay',
    'delayVolEnv',
    'attackVolEnv',
    'holdVolEnv',
    'decayVolEnv',
    'sustainVolEnv',
    'releaseVolEnv',
    'keynumToVolEnvHold',
    'keynumToVolEnvDecay',
    'instrument',
    undefined,
    'keyRange',
    'velRange',
    'startloopAddrsCoarseOffset',
    'keynum',
    'velocity',
    'initialAttenuation',
    undefined,
    'endloopAddrsCoarseOffset',
    'coarseTune',
    'fineTune',
    'sampleID',
    'sampleModes',
    undefined,
    'scaleTuning',
    'exclusiveClass',
    'overridingRootKey'
];
/* harmony export (immutable) */ __webpack_exports__["a"] = GeneratorEnumeratorTable;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export convertTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Structs__ = __webpack_require__(1);

/**
 * Parser で読み込んだサウンドフォントのデータを
 * Synthesizer から利用しやすい形にするクラス
 */
class SoundFont {
    constructor(parsed) {
        this.parsed = parsed;
    }
    getPresetZone(presetHeaderIndex) {
        let presetGenerators;
        const presetHeader = this.parsed.presetHeaders[presetHeaderIndex];
        const presetBag = this.parsed.presetZone[presetHeader.presetBagIndex];
        const nextPresetHeaderIndex = presetHeaderIndex + 1;
        if (nextPresetHeaderIndex < this.parsed.presetHeaders.length) {
            // 次の preset までのすべての generator を取得する
            const nextPresetHeader = this.parsed.presetHeaders[nextPresetHeaderIndex];
            const nextPresetBag = this.parsed.presetZone[nextPresetHeader.presetBagIndex];
            presetGenerators = this.parsed.presetGenerators.slice(presetBag.presetGeneratorIndex, nextPresetBag.presetGeneratorIndex);
        }
        else {
            // 最後の preset だった場合は最後まで取得する
            presetGenerators = this.parsed.presetGenerators.slice(presetBag.presetGeneratorIndex, this.parsed.presetGenerators.length);
        }
        return presetGenerators;
    }
    getInstrumentZone(instrumentZoneIndex) {
        const instrumentBag = this.parsed.instrumentZone[instrumentZoneIndex];
        const nextInstrumentBag = this.parsed.instrumentZone[instrumentZoneIndex + 1];
        const generatorIndex = instrumentBag.instrumentGeneratorIndex;
        const nextGeneratorIndex = nextInstrumentBag ? nextInstrumentBag.instrumentGeneratorIndex : this.parsed.instrumentGenerators.length;
        const generators = this.parsed.instrumentGenerators.slice(generatorIndex, nextGeneratorIndex);
        return createInstrumentZone(generators);
    }
    getInstrumentZoneIndexes(instrumentID) {
        const instrument = this.parsed.instruments[instrumentID];
        const nextInstrument = this.parsed.instruments[instrumentID + 1];
        return arrayRange(instrument.instrumentBagIndex, nextInstrument ? nextInstrument.instrumentBagIndex : this.parsed.instrumentZone.length);
    }
    getInstrumentKey(bankNumber, instrumentNumber, key, velocity = 100) {
        const presetHeaderIndex = this.parsed.presetHeaders.findIndex(p => p.preset === instrumentNumber && p.bank === bankNumber);
        if (presetHeaderIndex < 0) {
            console.warn("preset not found: bank=%s instrument=%s", bankNumber, instrumentNumber);
            return null;
        }
        const presetGenerators = this.getPresetZone(presetHeaderIndex);
        // Last Preset Generator must be instrument
        const lastPresetGenertor = presetGenerators[presetGenerators.length - 1];
        if (lastPresetGenertor.type !== "instrument" || Number(lastPresetGenertor.value) === NaN) {
            throw new Error("Invalid SoundFont: invalid preset generator: expect instrument");
        }
        const instrumentID = lastPresetGenertor.value;
        const instrumentZones = this.getInstrumentZoneIndexes(instrumentID).map(i => this.getInstrumentZone(i));
        // 最初のゾーンがsampleID を持たなければ global instrument zone
        let globalInstrumentZone;
        const firstInstrumentZone = instrumentZones[0];
        if (firstInstrumentZone.sampleID === undefined) {
            globalInstrumentZone = instrumentZones[0];
        }
        // keyRange と velRange がマッチしている Generator を探す
        const instrumentZone = instrumentZones.find(i => {
            if (i === globalInstrumentZone) {
                return false; // global zone を除外
            }
            let isInKeyRange = false;
            if (i.keyRange) {
                isInKeyRange = key >= i.keyRange.lo && key <= i.keyRange.hi;
            }
            let isInVelRange = true;
            if (i.velRange) {
                isInVelRange = velocity >= i.velRange.lo && velocity <= i.velRange.hi;
            }
            return isInKeyRange && isInVelRange;
        });
        if (!instrumentZone) {
            console.warn("instrument not found: bank=%s instrument=%s", bankNumber, instrumentNumber);
            return null;
        }
        if (instrumentZone.sampleID === undefined) {
            throw new Error("Invalid SoundFont: sampleID not found");
        }
        const gen = Object.assign({}, defaultInstrumentZone, removeUndefined(globalInstrumentZone || {}), removeUndefined(instrumentZone));
        const sample = this.parsed.samples[gen.sampleID];
        const sampleHeader = this.parsed.sampleHeaders[gen.sampleID];
        const tune = gen.coarseTune + gen.fineTune / 100;
        const basePitch = tune + (sampleHeader.pitchCorrection / 100) - (gen.overridingRootKey || sampleHeader.originalPitch);
        const scaleTuning = gen.scaleTuning / 100;
        return {
            sample,
            sampleRate: sampleHeader.sampleRate,
            sampleName: sampleHeader.sampleName,
            scaleTuning,
            playbackRate: (key) => Math.pow(Math.pow(2, 1 / 12), (key + basePitch) * scaleTuning),
            keyRange: gen.keyRange,
            velRange: gen.velRange,
            volAttack: convertTime(gen.volAttack),
            volDecay: convertTime(gen.volDecay),
            volSustain: gen.volSustain / 1000,
            volRelease: convertTime(gen.volRelease),
            modAttack: convertTime(gen.modAttack),
            modDecay: convertTime(gen.modDecay),
            modSustain: gen.modSustain / 1000,
            modRelease: convertTime(gen.modRelease),
            modEnvToPitch: gen.modEnvToPitch / 100,
            modEnvToFilterFc: gen.modEnvToFilterFc,
            initialFilterQ: gen.initialFilterQ,
            initialFilterFc: gen.initialFilterFc,
            freqVibLFO: gen.freqVibLFO ? convertTime(gen.freqVibLFO) * 8.176 : undefined,
            start: gen.startAddrsCoarseOffset * 32768 + gen.startAddrsOffset,
            end: gen.endAddrsCoarseOffset * 32768 + gen.endAddrsOffset,
            loopStart: (sampleHeader.loopStart +
                gen.startloopAddrsCoarseOffset * 32768 +
                gen.startloopAddrsOffset),
            loopEnd: (sampleHeader.loopEnd +
                gen.endloopAddrsCoarseOffset * 32768 +
                gen.endloopAddrsOffset),
        };
    }
    // presetNames[bankNumber][presetNumber] = presetName
    getPresetNames() {
        const bank = {};
        this.parsed.presetHeaders.forEach(preset => {
            if (!bank[preset.bank]) {
                bank[preset.bank] = {};
            }
            bank[preset.bank][preset.preset] = preset.presetName;
        });
        return bank;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SoundFont;

// value = 1200log2(sec) で表される時間を秒単位に変換する
function convertTime(value) {
    return Math.pow(2, value / 1200);
}
function removeUndefined(obj) {
    const result = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined) {
            result[key] = obj[key];
        }
    });
    return result;
}
function arrayRange(start, end) {
    return Array.from({ length: end - start }, (_, k) => k + start);
}
// ひとつの instrument に対応する Generator の配列から使いやすくしたオブジェクトを返す
function createInstrumentZone(instrumentGenerators) {
    function getValue(type) {
        const generator = instrumentGenerators.find(g => g.type === type);
        if (!generator) {
            return undefined;
        }
        if (Number(generator.value) === NaN) {
            throw new Error("something wrong");
        }
        return generator.value;
    }
    // First Instrument Generator must be keyRange
    const firstInstrumentGenerator = instrumentGenerators[0];
    let keyRange;
    if (firstInstrumentGenerator && firstInstrumentGenerator.type === "keyRange") {
        if (!(firstInstrumentGenerator.value instanceof __WEBPACK_IMPORTED_MODULE_0__Structs__["h" /* RangeValue */])) {
            throw new Error("Invalid SoundFont: keyRange is not ranged value");
        }
        keyRange = firstInstrumentGenerator.value;
    }
    // Second Instrument Generator could be velRange
    const secondInstrumentGenerator = instrumentGenerators[1];
    let velRange;
    if (secondInstrumentGenerator && secondInstrumentGenerator.type === "velRange") {
        if (!(secondInstrumentGenerator.value instanceof __WEBPACK_IMPORTED_MODULE_0__Structs__["h" /* RangeValue */])) {
            throw new Error("Invalid SoundFont: velRange is not ranged value");
        }
        velRange = secondInstrumentGenerator.value;
    }
    // Last Instrument Generator must be sampleID
    const lastInstrumentGenerator = instrumentGenerators[instrumentGenerators.length - 1];
    let sampleID;
    if (lastInstrumentGenerator && lastInstrumentGenerator.type === "sampleID") {
        if (Number(lastInstrumentGenerator.value) === NaN) {
            throw new Error("Invalid SoundFont: sampleID is not number");
        }
        sampleID = lastInstrumentGenerator.value;
    }
    return {
        keyRange,
        velRange,
        sampleID,
        volAttack: getValue("attackVolEnv"),
        volDecay: getValue("decayVolEnv"),
        volSustain: getValue("sustainVolEnv"),
        volRelease: getValue("releaseVolEnv"),
        modAttack: getValue("attackModEnv"),
        modDecay: getValue("decayModEnv"),
        modSustain: getValue("sustainModEnv"),
        modRelease: getValue("releaseModEnv"),
        modEnvToPitch: getValue("modEnvToPitch"),
        modEnvToFilterFc: getValue("modEnvToFilterFc"),
        coarseTune: getValue("coarseTune"),
        fineTune: getValue("fineTune"),
        scaleTuning: getValue("scaleTuning"),
        freqVibLFO: getValue("freqVibLFO"),
        startAddrsOffset: getValue("startAddrsOffset"),
        startAddrsCoarseOffset: getValue("startAddrsCoarseOffset"),
        endAddrsOffset: getValue("endAddrsOffset"),
        endAddrsCoarseOffset: getValue("endAddrsCoarseOffset"),
        startloopAddrsOffset: getValue("startloopAddrsOffset"),
        startloopAddrsCoarseOffset: getValue("startloopAddrsCoarseOffset"),
        endloopAddrsOffset: getValue("endloopAddrsOffset"),
        endloopAddrsCoarseOffset: getValue("endloopAddrsCoarseOffset"),
        overridingRootKey: getValue("overridingRootKey"),
        initialFilterQ: getValue("initialFilterQ"),
        initialFilterFc: getValue("initialFilterFc"),
    };
}
const defaultInstrumentZone = {
    keyRange: new __WEBPACK_IMPORTED_MODULE_0__Structs__["h" /* RangeValue */](0, 127),
    velRange: new __WEBPACK_IMPORTED_MODULE_0__Structs__["h" /* RangeValue */](0, 127),
    sampleID: undefined,
    volAttack: -12000,
    volDecay: -12000,
    volSustain: 0,
    volRelease: -12000,
    modAttack: -12000,
    modDecay: -12000,
    modSustain: 0,
    modRelease: 0,
    modEnvToPitch: 0,
    modEnvToFilterFc: 0,
    coarseTune: 0,
    fineTune: 0,
    scaleTuning: 100,
    freqVibLFO: 0,
    startAddrsOffset: 0,
    startAddrsCoarseOffset: 0,
    endAddrsOffset: 0,
    endAddrsCoarseOffset: 0,
    startloopAddrsOffset: 0,
    startloopAddrsCoarseOffset: 0,
    endloopAddrsOffset: 0,
    endloopAddrsCoarseOffset: 0,
    overridingRootKey: undefined,
    initialFilterQ: 1,
    initialFilterFc: 13500,
};


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SynthesizerNote__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Parser__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SoundFont__ = __webpack_require__(5);



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
class Synthesizer {
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
        const parser = Object(__WEBPACK_IMPORTED_MODULE_1__Parser__["a" /* default */])(input);
        this.soundFont = new __WEBPACK_IMPORTED_MODULE_2__SoundFont__["a" /* default */](parser);
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
            pitchBend: channel.pitchBend - 0x2000,
            pitchBendSensitivity: channel.pitchBendSensitivity
        };
        // note on
        const note = new __WEBPACK_IMPORTED_MODULE_0__SynthesizerNote__["a" /* default */](this.ctx, this.gainMaster, noteInfo, instrumentKey);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Synthesizer;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ProgramNames__ = __webpack_require__(14);

function render(str) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = str.replace(/^\s+/, "");
    return wrapper.firstElementChild;
}
function renderKeys() {
    let html = "";
    for (let i = 0; i < 128; i++) {
        const n = i % 12;
        const isBlack = [1, 3, 6, 8, 10].includes(n);
        html += `<div class="key ${isBlack ? "black" : "white"}"></div>`;
    }
    return html;
}
function renderProgramOptions(programNames, bank) {
    let html = "";
    const names = programNames[bank];
    for (let i in names) {
        const name = names[i];
        html += `<option value="${i}">${i}: ${name}</option>`;
    }
    return `<select>${html}</select>`;
}
function renderInstrument(program) {
    return render(`
    <div class="instrument">
      <div class="program">${program}</div>
      <div class="volume"></div>
      <div class="panpot"></div>
      <div class="pitchBend"></div>
      <div class="pitchBendSensitivity"></div>
      <div class="keys">${renderKeys()}</div>
    </div>
  `);
}
function objectMap(o, func) {
    const result = {};
    Object.keys(o).forEach(key => {
        result[key] = func(o[key]);
    });
    return result;
}
function programNamesFromBankSet(bankSet) {
    return objectMap(bankSet, bank => objectMap(bank, s => s.name));
}
function mergeProgramNames(left, right) {
    function mergedKeys(a, b) {
        return new Set([...Object.keys(a), ...Object.keys(b)]);
    }
    const banks = mergedKeys(left, right);
    const result = {};
    banks.forEach(bank => {
        const l = left[bank] || [];
        const r = right[bank] || [];
        const list = {};
        const programs = mergedKeys(l, r);
        programs.forEach(p => {
            list[p] = `${l[p] || "None"} (${r[p] || "None"})`;
        });
        result[bank] = list;
    });
    return result;
}
class View {
    constructor() {
        this.drag = false;
    }
    draw(synth) {
        const element = this.element = render(`<div />`);
        const programNames = mergeProgramNames(programNamesFromBankSet(synth.soundFont.getPresetNames()), __WEBPACK_IMPORTED_MODULE_0__ProgramNames__["a" /* default */]);
        for (let i = 0; i < 16; ++i) {
            const bank = i !== 9 ? 0 : 128;
            const program = renderProgramOptions(programNames, bank);
            const item = renderInstrument(program);
            const channel = i;
            const select = item.querySelector('select');
            if (select) {
                select.addEventListener('change', event => {
                    const target = event.target;
                    const program = parseInt(target.value, 10);
                    this.programChange(channel, program);
                    synth.programChange(channel, program);
                }, false);
                select.selectedIndex = synth.channels[i].instrument;
            }
            const notes = item.querySelectorAll(".key");
            for (let j = 0; j < 128; ++j) {
                const key = j;
                notes[j].addEventListener('mousedown', event => {
                    event.preventDefault();
                    this.drag = true;
                    this.noteOn(channel, key, 127);
                    synth.noteOn(channel, key, 127);
                    const onMouseUp = event => {
                        document.removeEventListener('mouseup', onMouseUp);
                        event.preventDefault();
                        this.drag = false;
                        this.noteOff(channel, key, 0);
                        synth.noteOff(channel, key, 0);
                    };
                    document.addEventListener('mouseup', onMouseUp);
                });
                notes[j].addEventListener('mouseover', event => {
                    event.preventDefault();
                    if (this.drag) {
                        this.noteOn(channel, key, 127);
                        synth.noteOn(channel, key, 127);
                    }
                });
                notes[j].addEventListener('mouseout', event => {
                    event.preventDefault();
                    this.noteOff(channel, key, 0);
                    synth.noteOff(channel, key, 0);
                });
            }
            element.appendChild(item);
        }
        return element;
    }
    remove() {
        if (!this.element) {
            return;
        }
        this.element.parentNode.removeChild(this.element);
        this.element = null;
    }
    getInstrumentElement(channel) {
        if (!this.element) {
            return null;
        }
        return this.element.querySelectorAll(".instrument")[channel];
    }
    getKeyElement(channel, key) {
        const elem = this.getInstrumentElement(channel);
        if (!elem) {
            return null;
        }
        return elem.querySelectorAll(".key")[key];
    }
    findInstrumentElement(channel, query) {
        const elem = this.getInstrumentElement(channel);
        if (!elem) {
            return null;
        }
        return elem.querySelector(query);
    }
    noteOn(channel, key, _velocity) {
        const element = this.getKeyElement(channel, key);
        if (element) {
            element.classList.add('note-on');
        }
    }
    noteOff(channel, key, _velocity) {
        const element = this.getKeyElement(channel, key);
        if (element) {
            element.classList.remove('note-on');
        }
    }
    programChange(channel, instrument) {
        const select = this.findInstrumentElement(channel, ".program select");
        if (select) {
            select.value = `${instrument}`;
        }
    }
    volumeChange(channel, volume) {
        const element = this.findInstrumentElement(channel, ".volume");
        if (element) {
            element.textContent = `${volume}`;
        }
    }
    panpotChange(channel, panpot) {
        const element = this.findInstrumentElement(channel, ".panpot");
        if (element) {
            element.textContent = `${panpot}`;
        }
    }
    pitchBend(channel, pitchBend) {
        const element = this.findInstrumentElement(channel, ".pitchBend");
        if (element) {
            element.textContent = `${pitchBend}`;
        }
    }
    pitchBendSensitivity(channel, sensitivity) {
        const element = this.findInstrumentElement(channel, ".pitchBendSensitivity");
        if (element) {
            element.textContent = `${sensitivity}`;
        }
    }
    allSoundOff(_channelNumber) {
    }
    setMasterVolume(_volume) {
    }
    resetAllControl(_channelNumber) {
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = View;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class MidiMessageHandler {
    constructor() {
        this.RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    processMidiMessage(message) {
        const channel = message[0] & 0x0f;
        const { listener } = this;
        if (!listener) {
            return;
        }
        switch (message[0] & 0xf0) {
            case 0x80:// NoteOff: 8n kk vv
                listener.noteOff(channel, message[1], message[2]);
                break;
            case 0x90:// NoteOn: 9n kk vv
                if (message[2] > 0) {
                    listener.noteOn(channel, message[1], message[2]);
                }
                else {
                    listener.noteOff(channel, message[1], 0);
                }
                break;
            case 0xB0:// Control Change: Bn cc dd
                switch (message[1]) {
                    case 0x06:// Data Entry: Bn 06 dd
                        switch (this.RpnMsb[channel]) {
                            case 0:
                                switch (this.RpnLsb[channel]) {
                                    case 0:// Pitch Bend Sensitivity
                                        listener.pitchBendSensitivity(channel, message[2]);
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                    case 0x07:// Volume Change: Bn 07 dd
                        listener.volumeChange(channel, message[2]);
                        break;
                    case 0x0A:// Panpot Change: Bn 0A dd
                        listener.panpotChange(channel, message[2]);
                        break;
                    case 0x78:// All Sound Off: Bn 78 00
                        listener.allSoundOff(channel);
                        break;
                    case 0x79:// Reset All Control: Bn 79 00
                        listener.resetAllControl(channel);
                        break;
                    case 0x20:// BankSelect
                        //console.log("bankselect:", channel, message[2])
                        break;
                    case 0x64:// RPN MSB
                        this.RpnMsb[channel] = message[2];
                        break;
                    case 0x65:// RPN LSB
                        this.RpnLsb[channel] = message[2];
                        break;
                    default:
                }
                break;
            case 0xC0:// Program Change: Cn pp
                listener.programChange(channel, message[1]);
                break;
            case 0xE0: {
                const bend = ((message[1] & 0x7f) | ((message[2] & 0x7f) << 7));
                listener.pitchBend(channel, bend);
                break;
            }
            case 0xf0:// System Exclusive Message
                // ID number
                switch (message[1]) {
                    case 0x7e:// non-realtime
                        // TODO
                        break;
                    case 0x7f:// realtime
                        // const device = message[2]
                        // sub ID 1
                        switch (message[3]) {
                            case 0x04:// device control
                                // sub ID 2
                                switch (message[4]) {
                                    case 0x01: {
                                        const volume = message[5] + (message[6] << 7);
                                        const MAX_VOLUME = 0x4000 - 1;
                                        listener.setMasterVolume(volume / MAX_VOLUME);
                                        break;
                                    }
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
                break;
            default:// not supported
                break;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = MidiMessageHandler;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = delegateProxy;
// delegates method calls to multiple targets
function delegateProxy(targets) {
    return new Proxy(targets[0], {
        get(target, propKey, _receiver) {
            return () => {
                targets
                    .map(t => t[propKey].bind(target))
                    .forEach(f => f(...arguments));
            };
        }
    });
}


/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_WebMidiLink_ts__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_Synthesizer_ts__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_View_ts__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_MidiMessageHandler_ts__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_delegateProxy_ts__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "WebMidiLink", function() { return __WEBPACK_IMPORTED_MODULE_0__src_WebMidiLink_ts__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Synthesizer", function() { return __WEBPACK_IMPORTED_MODULE_1__src_Synthesizer_ts__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "View", function() { return __WEBPACK_IMPORTED_MODULE_2__src_View_ts__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MidiMessageHandler", function() { return __WEBPACK_IMPORTED_MODULE_3__src_MidiMessageHandler_ts__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MidiMessageListener", function() { return __WEBPACK_IMPORTED_MODULE_3__src_MidiMessageHandler_ts__["Listener"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "delegateProxy", function() { return __WEBPACK_IMPORTED_MODULE_4__src_delegateProxy_ts__["a"]; });








/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Synthesizer__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__View__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__MidiMessageHandler__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__delegateProxy__ = __webpack_require__(9);




class WebMidiLink {
    constructor() {
        this.ready = false;
        this.midiMessageHandler = new __WEBPACK_IMPORTED_MODULE_2__MidiMessageHandler__["b" /* default */]();
        window.addEventListener('DOMContentLoaded', function () {
            this.ready = true;
        }.bind(this), false);
    }
    setup(url) {
        if (!this.ready) {
            window.addEventListener('DOMContentLoaded', function onload() {
                window.removeEventListener('DOMContentLoaded', onload, false);
                this.load(url);
            }.bind(this), false);
        }
        else {
            this.load(url);
        }
    }
    load(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', function (ev) {
            const xhr = ev.target;
            this.onload(xhr.response);
            if (typeof this.loadCallback === 'function') {
                this.loadCallback(xhr.response);
            }
        }.bind(this), false);
        xhr.send();
    }
    onload(response) {
        const input = new Uint8Array(response);
        this.loadSoundFont(input);
    }
    loadSoundFont(input) {
        let synth;
        if (!this.synth) {
            const ctx = new AudioContext();
            synth = this.synth = new __WEBPACK_IMPORTED_MODULE_0__Synthesizer__["a" /* default */](ctx);
            synth.connect(ctx.destination);
            synth.loadSoundFont(input);
            const view = this.view = new __WEBPACK_IMPORTED_MODULE_1__View__["a" /* default */]();
            document.body.querySelector(".synth").appendChild(view.draw(synth));
            this.midiMessageHandler.listener = Object(__WEBPACK_IMPORTED_MODULE_3__delegateProxy__["a" /* default */])([synth, view]);
            window.addEventListener('message', this.onmessage.bind(this), false);
        }
        else {
            synth = this.synth;
            synth.loadSoundFont(input);
        }
        // link ready
        if (window.opener) {
            window.opener.postMessage("link,ready", '*');
        }
        else if (window.parent !== window) {
            window.parent.postMessage("link,ready", '*');
        }
    }
    onmessage(ev) {
        const msg = ev.data.split(',');
        const type = msg.shift();
        switch (type) {
            case 'midi':
                this.midiMessageHandler.processMidiMessage(msg.map(function (hex) {
                    return parseInt(hex, 16);
                }));
                break;
            case 'link':
                const command = msg.shift();
                switch (command) {
                    case 'reqpatch':
                        // TODO: dummy data
                        if (window.opener) {
                            window.opener.postMessage("link,patch", '*');
                        }
                        else if (window.parent !== window) {
                            window.parent.postMessage("link,patch", '*');
                        }
                        break;
                    case 'setpatch':
                        // TODO: NOP
                        break;
                    default:
                        console.error('unknown link message:', command);
                        break;
                }
                break;
            default:
                console.error('unknown message type');
        }
    }
    setLoadCallback(callback) {
        this.loadCallback = callback;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WebMidiLink;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class SynthesizerNote {
    constructor(ctx, destination, noteInfo, instrument) {
        this.ctx = ctx;
        this.destination = destination;
        this.noteInfo = noteInfo;
        this.playbackRate = noteInfo.playbackRate(instrument.key);
        this.instrument = instrument;
        this.channel = instrument.channel;
        this.key = instrument.key;
        this.velocity = instrument.velocity;
        this.volume = instrument.volume;
        this.panpot = instrument.panpot;
        this.pitchBend = instrument.pitchBend;
        this.pitchBendSensitivity = instrument.pitchBendSensitivity;
        this.startTime = ctx.currentTime;
        this.computedPlaybackRate = this.playbackRate;
    }
    noteOn() {
        const { ctx, noteInfo } = this;
        const sample = noteInfo.sample.subarray(0, noteInfo.sample.length + noteInfo.end);
        this.audioBuffer = ctx.createBuffer(1, sample.length, noteInfo.sampleRate);
        const channelData = this.audioBuffer.getChannelData(0);
        channelData.set(sample);
        // buffer source
        const bufferSource = ctx.createBufferSource();
        bufferSource.buffer = this.audioBuffer;
        bufferSource.loop = (this.channel !== 9);
        bufferSource.loopStart = noteInfo.loopStart / noteInfo.sampleRate;
        bufferSource.loopEnd = noteInfo.loopEnd / noteInfo.sampleRate;
        bufferSource.onended = () => this.disconnect();
        this.bufferSource = bufferSource;
        this.updatePitchBend(this.pitchBend);
        // audio node
        const panner = this.panner = ctx.createPanner();
        const output = this.gainOutput = ctx.createGain();
        const outputGain = output.gain;
        // filter
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        this.filter = filter;
        // panpot
        panner.panningModel = "equalpower";
        panner.setPosition(Math.sin(this.panpot * Math.PI / 2), 0, Math.cos(this.panpot * Math.PI / 2));
        //---------------------------------------------------------------------------
        // Attack, Decay, Sustain
        //---------------------------------------------------------------------------
        const now = this.ctx.currentTime;
        const volAttackTime = now + noteInfo.volAttack;
        const modAttackTime = now + noteInfo.modAttack;
        const volDecay = volAttackTime + noteInfo.volDecay;
        const modDecay = modAttackTime + noteInfo.modDecay;
        const startTime = noteInfo.start / noteInfo.sampleRate;
        const attackVolume = this.volume * (this.velocity / 127);
        outputGain.setValueAtTime(0, now);
        outputGain.linearRampToValueAtTime(attackVolume, volAttackTime);
        outputGain.linearRampToValueAtTime(attackVolume * (1 - noteInfo.volSustain), volDecay);
        filter.Q.setValueAtTime(noteInfo.initialFilterQ / 10, now);
        const baseFreq = amountToFreq(noteInfo.initialFilterFc);
        const peekFreq = amountToFreq(noteInfo.initialFilterFc + noteInfo.modEnvToFilterFc);
        const sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - noteInfo.modSustain);
        filter.frequency.setValueAtTime(baseFreq, now);
        filter.frequency.linearRampToValueAtTime(peekFreq, modAttackTime);
        filter.frequency.linearRampToValueAtTime(sustainFreq, modDecay);
        function amountToFreq(val) {
            return Math.pow(2, (val - 6900) / 1200) * 440;
        }
        // connect
        bufferSource.connect(filter);
        filter.connect(panner);
        panner.connect(output);
        output.connect(this.destination);
        // fire
        bufferSource.start(0, startTime);
    }
    noteOff() {
        const { noteInfo, bufferSource } = this;
        const output = this.gainOutput;
        const now = this.ctx.currentTime;
        const volEndTime = now + noteInfo.volRelease;
        const modEndTime = now + noteInfo.modRelease;
        if (!this.audioBuffer) {
            return;
        }
        // ignore note off for rhythm track
        if (this.channel === 9) {
            return;
        }
        //---------------------------------------------------------------------------
        // Release
        //---------------------------------------------------------------------------
        output.gain.cancelScheduledValues(0);
        output.gain.linearRampToValueAtTime(0, volEndTime);
        bufferSource.playbackRate.cancelScheduledValues(0);
        bufferSource.playbackRate.linearRampToValueAtTime(this.computedPlaybackRate, modEndTime);
        bufferSource.loop = false;
        bufferSource.stop(volEndTime);
    }
    disconnect() {
        this.bufferSource.disconnect(0);
        this.panner.disconnect(0);
        this.gainOutput.disconnect(0);
    }
    schedulePlaybackRate() {
        const { noteInfo } = this;
        const playbackRate = this.bufferSource.playbackRate;
        const computed = this.computedPlaybackRate;
        const start = this.startTime;
        const modAttack = start + noteInfo.modAttack;
        const modDecay = modAttack + noteInfo.modDecay;
        const peekPitch = computed * Math.pow(Math.pow(2, 1 / 12), noteInfo.modEnvToPitch * noteInfo.scaleTuning);
        playbackRate.cancelScheduledValues(0);
        playbackRate.setValueAtTime(computed, start);
        playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
        playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - noteInfo.modSustain), modDecay);
    }
    updatePitchBend(pitchBend) {
        this.computedPlaybackRate = this.playbackRate * Math.pow(Math.pow(2, 1 / 12), (this.pitchBendSensitivity * (pitchBend / (pitchBend < 0 ? 8192 : 8191))) * this.noteInfo.scaleTuning);
        this.schedulePlaybackRate();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SynthesizerNote;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const ProgramNames = {
    0: [
        "Acoustic Piano",
        "Bright Piano",
        "Electric Grand Piano",
        "Honky-tonk Piano",
        "Electric Piano",
        "Electric Piano 2",
        "Harpsichord",
        "Clavi",
        "Celesta",
        "Glockenspiel",
        "Musical box",
        "Vibraphone",
        "Marimba",
        "Xylophone",
        "Tubular Bell",
        "Dulcimer",
        "Drawbar Organ",
        "Percussive Organ",
        "Rock Organ",
        "Church organ",
        "Reed organ",
        "Accordion",
        "Harmonica",
        "Tango Accordion",
        "Acoustic Guitar (nylon)",
        "Acoustic Guitar (steel)",
        "Electric Guitar (jazz)",
        "Electric Guitar (clean)",
        "Electric Guitar (muted)",
        "Overdriven Guitar",
        "Distortion Guitar",
        "Guitar harmonics",
        "Acoustic Bass",
        "Electric Bass (finger)",
        "Electric Bass (pick)",
        "Fretless Bass",
        "Slap Bass 1",
        "Slap Bass 2",
        "Synth Bass 1",
        "Synth Bass 2",
        "Violin",
        "Viola",
        "Cello",
        "Double bass",
        "Tremolo Strings",
        "Pizzicato Strings",
        "Orchestral Harp",
        "Timpani",
        "String Ensemble 1",
        "String Ensemble 2",
        "Synth Strings 1",
        "Synth Strings 2",
        "Voice Aahs",
        "Voice Oohs",
        "Synth Voice",
        "Orchestra Hit",
        "Trumpet",
        "Trombone",
        "Tuba",
        "Muted Trumpet",
        "French horn",
        "Brass Section",
        "Synth Brass 1",
        "Synth Brass 2",
        "Soprano Sax",
        "Alto Sax",
        "Tenor Sax",
        "Baritone Sax",
        "Oboe",
        "English Horn",
        "Bassoon",
        "Clarinet",
        "Piccolo",
        "Flute",
        "Recorder",
        "Pan Flute",
        "Blown Bottle",
        "Shakuhachi",
        "Whistle",
        "Ocarina",
        "Lead 1 (square)",
        "Lead 2 (sawtooth)",
        "Lead 3 (calliope)",
        "Lead 4 (chiff)",
        "Lead 5 (charang)",
        "Lead 6 (voice)",
        "Lead 7 (fifths)",
        "Lead 8 (bass + lead)",
        "Pad 1 (Fantasia)",
        "Pad 2 (warm)",
        "Pad 3 (polysynth)",
        "Pad 4 (choir)",
        "Pad 5 (bowed)",
        "Pad 6 (metallic)",
        "Pad 7 (halo)",
        "Pad 8 (sweep)",
        "FX 1 (rain)",
        "FX 2 (soundtrack)",
        "FX 3 (crystal)",
        "FX 4 (atmosphere)",
        "FX 5 (brightness)",
        "FX 6 (goblins)",
        "FX 7 (echoes)",
        "FX 8 (sci-fi)",
        "Sitar",
        "Banjo",
        "Shamisen",
        "Koto",
        "Kalimba",
        "Bagpipe",
        "Fiddle",
        "Shanai",
        "Tinkle Bell",
        "Agogo",
        "Steel Drums",
        "Woodblock",
        "Taiko Drum",
        "Melodic Tom",
        "Synth Drum",
        "Reverse Cymbal",
        "Guitar Fret Noise",
        "Breath Noise",
        "Seashore",
        "Bird Tweet",
        "Telephone Ring",
        "Helicopter",
        "Applause",
        "Gunshot"
    ], 128: ["Rhythm Track"]
};
/* harmony default export */ __webpack_exports__["a"] = (ProgramNames);


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNGE5ZDAzM2EwZDU1MDc2OGM0NSIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9TdHJ1Y3RzLnRzIiwid2VicGFjazovLy8uL3NyYy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JpZmZQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU291bmRGb250LnRzIiwid2VicGFjazovLy8uL3NyYy9TeW50aGVzaXplci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVmlldy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWlkaU1lc3NhZ2VIYW5kbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9kZWxlZ2F0ZVByb3h5LnRzIiwid2VicGFjazovLy8uL2V4cG9ydC9zeW50aC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvV2ViTWlkaUxpbmsudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N5bnRoZXNpemVyTm90ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJvZ3JhbU5hbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtB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LEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSw4REFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM5RixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwyREFBUyxDQUFDO0FBQzdFLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDREQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzVGLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLCtEQUFhLENBQUM7QUFDakYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxL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LFlBQVk7UUFDWixTQUFTO1FBQ1QsU0FBUztRQUNULGlCQUFpQjtRQUNqQixtQkFBbUI7UUFDbkIsbUJBQW1CO1FBQ25CLGdCQUFnQjtRQUNoQixrQkFBa0I7UUFDbEIsZ0JBQWdCO1FBQ2hCLGlCQUFpQjtRQUNqQixzQkFBc0I7UUFDdEIsa0JBQWtCO1FBQ2xCLGNBQWM7UUFDZCxtQkFBbUI7UUFDbkIsZUFBZTtRQUNmLGVBQWU7UUFDZixrQkFBa0I7UUFDbEIsY0FBYztRQUNkLGVBQWU7UUFDZixhQUFhO1FBQ2IsbUJBQW1CO1FBQ25CLGdCQUFnQjtRQUNoQixtQkFBbUI7UUFDbkIsbUJBQW1CO1FBQ25CLGdCQUFnQjtRQUNoQixlQUFlO1FBQ2YsZUFBZTtRQUNmLE9BQU87UUFDUCxPQUFPO1FBQ1AsVUFBVTtRQUNWLE1BQU07UUFDTixTQUFTO1FBQ1QsU0FBUztRQUNULFFBQVE7UUFDUixRQUFRO1FBQ1IsYUFBYTtRQUNiLE9BQU87UUFDUCxhQUFhO1FBQ2IsV0FBVztRQUNYLFlBQVk7UUFDWixhQUFhO1FBQ2IsWUFBWTtRQUNaLGdCQUFnQjtRQUNoQixtQkFBbUI7UUFDbkIsY0FBYztRQUNkLFVBQVU7UUFDVixZQUFZO1FBQ1osZ0JBQWdCO1FBQ2hCLFlBQVk7UUFDWixVQUFVO1FBQ1YsU0FBUztLQUNWLEVBQUUsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO0NBQ3pCO0FBRUQseURBQWUsWUFBWSIsImZpbGUiOiJzZjIuc3ludGguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTRhOWQwMzNhMGQ1NTA3NjhjNDUiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xyXG4gIHByaXZhdGUgZGF0YTogVWludDhBcnJheVxyXG4gIGlwOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IoZGF0YSwgb2Zmc2V0KSB7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhXHJcbiAgICB0aGlzLmlwID0gb2Zmc2V0XHJcbiAgfVxyXG5cclxuICByZWFkU3RyaW5nKHNpemU6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHRoaXMuZGF0YS5zdWJhcnJheSh0aGlzLmlwLCB0aGlzLmlwICs9IHNpemUpKVxyXG4gICAgY29uc3QgbnVsbExvY2F0aW9uID0gc3RyLmluZGV4T2YoXCJcXHUwMDAwXCIpXHJcbiAgICBpZiAobnVsbExvY2F0aW9uID4gMCkge1xyXG4gICAgICByZXR1cm4gc3RyLnN1YnN0cigwLCBudWxsTG9jYXRpb24pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RyXHJcbiAgfVxyXG5cclxuICByZWFkV09SRCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwKytdIHwgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpXHJcbiAgfVxyXG5cclxuICByZWFkRFdPUkQoYmlnRW5kaWFuOiBib29sZWFuID0gZmFsc2UpOiBudW1iZXIge1xyXG4gICAgaWYgKGJpZ0VuZGlhbikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDI0fCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMTYpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdKVxyXG4gICAgICApID4+PiAwXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuZGF0YVt0aGlzLmlwKytdIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDE2KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAyNClcclxuICAgICAgKSA+Pj4gMFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVhZEJ5dGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXArK11cclxuICB9XHJcblxyXG4gIHJlYWRBdChvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwICsgb2Zmc2V0XVxyXG4gIH1cclxuXHJcbiAgLyogaGVscGVyICovXHJcblxyXG4gIHJlYWRVSW50OCgpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWRCeXRlKClcclxuICB9XHJcbiAgXHJcbiAgcmVhZEludDgoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMucmVhZEJ5dGUoKSA8PCAyNCkgPj4gMjRcclxuICB9XHJcbiAgXHJcbiAgcmVhZFVJbnQxNigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWRXT1JEKClcclxuICB9XHJcblxyXG4gIHJlYWRJbnQxNigpIHtcclxuICAgIHJldHVybiAodGhpcy5yZWFkV09SRCgpIDw8IDE2KSA+PiAxNlxyXG4gIH1cclxuXHJcbiAgcmVhZFVJbnQzMigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWREV09SRCgpXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TdHJlYW0udHMiLCJpbXBvcnQgeyBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgfSBmcm9tIFwiLi9Db25zdGFudHNcIlxyXG5pbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcbmltcG9ydCB7IENodW5rIH0gZnJvbSBcIi4vUmlmZlBhcnNlclwiXHJcblxyXG5leHBvcnQgY2xhc3MgVmVyc2lvblRhZyB7XHJcbiAgbWFqb3I6IG51bWJlclxyXG4gIG1pbm9yOiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHYgPSBuZXcgVmVyc2lvblRhZygpXHJcbiAgICB2Lm1ham9yID0gc3RyZWFtLnJlYWRJbnQ4KClcclxuICAgIHYubWlub3IgPSBzdHJlYW0ucmVhZEludDgoKVxyXG4gICAgcmV0dXJuIHZcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmZvIHtcclxuICBjb21tZW50OiBzdHJpbmd8bnVsbFxyXG4gIGNvcHlyaWdodDogc3RyaW5nfG51bGxcclxuICBjcmVhdGlvbkRhdGU6IHN0cmluZ3xudWxsXHJcbiAgZW5naW5lZXI6IHN0cmluZ3xudWxsXHJcbiAgbmFtZTogc3RyaW5nXHJcbiAgcHJvZHVjdDogc3RyaW5nfG51bGxcclxuICBzb2Z0d2FyZTogc3RyaW5nfG51bGxcclxuICB2ZXJzaW9uOiBWZXJzaW9uVGFnXHJcbiAgc291bmRFbmdpbmU6IHN0cmluZ3xudWxsXHJcbiAgcm9tTmFtZTogc3RyaW5nfG51bGxcclxuICByb21WZXJzaW9uOiBWZXJzaW9uVGFnfG51bGxcclxuXHJcbiAgLy8gTElTVCAtIElORk8g44Gu5YWo44Gm44GuIGNodW5rXHJcbiAgc3RhdGljIHBhcnNlKGRhdGE6IFVpbnQ4QXJyYXksIGNodW5rczogQ2h1bmtbXSkge1xyXG4gICAgZnVuY3Rpb24gZ2V0Q2h1bmsodHlwZSkge1xyXG4gICAgICByZXR1cm4gY2h1bmtzLmZpbmQoYyA9PiBjLnR5cGUgPT09IHR5cGUpIFxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvU3RyZWFtKGNodW5rKSB7XHJcbiAgICAgIHJldHVybiBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWFkU3RyaW5nKHR5cGUpIHtcclxuICAgICAgY29uc3QgY2h1bmsgPSBnZXRDaHVuayh0eXBlKVxyXG4gICAgICBpZiAoIWNodW5rKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdG9TdHJlYW0oY2h1bmspIS5yZWFkU3RyaW5nKGNodW5rLnNpemUpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVhZFZlcnNpb25UYWcodHlwZSkge1xyXG4gICAgICBjb25zdCBjaHVuayA9IGdldENodW5rKHR5cGUpXHJcbiAgICAgIGlmICghY2h1bmspIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBWZXJzaW9uVGFnLnBhcnNlKHRvU3RyZWFtKGNodW5rKSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgaW5mbyA9IG5ldyBJbmZvKClcclxuICAgIGluZm8uY29tbWVudCA9IHJlYWRTdHJpbmcoXCJJQ01UXCIpXHJcbiAgICBpbmZvLmNvcHlyaWdodCA9IHJlYWRTdHJpbmcoXCJJQ09QXCIpXHJcbiAgICBpbmZvLmNyZWF0aW9uRGF0ZSA9IHJlYWRTdHJpbmcoXCJJQ1JEXCIpXHJcbiAgICBpbmZvLmVuZ2luZWVyID0gcmVhZFN0cmluZyhcIklFTkdcIilcclxuICAgIGluZm8ubmFtZSA9IHJlYWRTdHJpbmcoXCJJTkFNXCIpIVxyXG4gICAgaW5mby5wcm9kdWN0ID0gcmVhZFN0cmluZyhcIklQUkRcIilcclxuICAgIGluZm8uc29mdHdhcmUgPSByZWFkU3RyaW5nKFwiSVNGVFwiKVxyXG4gICAgaW5mby52ZXJzaW9uID0gcmVhZFZlcnNpb25UYWcoXCJpZmlsXCIpIVxyXG4gICAgaW5mby5zb3VuZEVuZ2luZSA9IHJlYWRTdHJpbmcoXCJpc25nXCIpXHJcbiAgICBpbmZvLnJvbU5hbWUgPSByZWFkU3RyaW5nKFwiaXJvbVwiKVxyXG4gICAgaW5mby5yb21WZXJzaW9uID0gcmVhZFZlcnNpb25UYWcoXCJpdmVyXCIpXHJcbiAgICByZXR1cm4gaW5mb1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByZXNldEhlYWRlciB7XHJcbiAgcHJlc2V0TmFtZTogc3RyaW5nXHJcbiAgcHJlc2V0OiBudW1iZXJcclxuICBiYW5rOiBudW1iZXJcclxuICBwcmVzZXRCYWdJbmRleDogbnVtYmVyXHJcbiAgbGlicmFyeTogbnVtYmVyXHJcbiAgZ2VucmU6IG51bWJlclxyXG4gIG1vcnBob2xvZ3k6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcmVzZXROYW1lID09PSBcIkVPUFwiXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0SGVhZGVyKClcclxuICAgIHAucHJlc2V0TmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcC5wcmVzZXQgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5iYW5rID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAucHJlc2V0QmFnSW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5saWJyYXJ5ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLmdlbnJlID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLm1vcnBob2xvZ3kgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlc2V0QmFnIHtcclxuICBwcmVzZXRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgcHJlc2V0TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0QmFnKClcclxuICAgIHAucHJlc2V0R2VuZXJhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gcFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJhbmdlVmFsdWUge1xyXG4gIGxvOiBudW1iZXJcclxuICBoaTogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKGxvOiBudW1iZXIsIGhpOiBudW1iZXIpIHtcclxuICAgIHRoaXMubG8gPSBsb1xyXG4gICAgdGhpcy5oaSA9IGhpXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIHJldHVybiBuZXcgUmFuZ2VWYWx1ZShcclxuICAgICAgc3RyZWFtLnJlYWRCeXRlKCksIFxyXG4gICAgICBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vZHVsYXRvckxpc3Qge1xyXG4gIHNvdXJjZU9wZXI6IG51bWJlclxyXG4gIGRlc3RpbmF0aW9uT3BlcjogbnVtYmVyXHJcbiAgdmFsdWU6IG51bWJlcnxSYW5nZVZhbHVlXHJcbiAgYW1vdW50U291cmNlT3BlcjogbnVtYmVyXHJcbiAgdHJhbnNPcGVyOiBudW1iZXJcclxuXHJcbiAgZ2V0IHR5cGUoKSB7XHJcbiAgICByZXR1cm4gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW3RoaXMuZGVzdGluYXRpb25PcGVyXVxyXG4gIH1cclxuXHJcbiAgZ2V0IGlzRW5kKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlT3BlciA9PT0gMCAmJiBcclxuICAgICAgdGhpcy5kZXN0aW5hdGlvbk9wZXIgPT09IDAgJiZcclxuICAgICAgdGhpcy52YWx1ZSA9PT0gMCAmJlxyXG4gICAgICB0aGlzLmFtb3VudFNvdXJjZU9wZXIgPT09IDAgJiZcclxuICAgICAgdGhpcy4gdHJhbnNPcGVyID09PSAwXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgTW9kdWxhdG9yTGlzdCgpXHJcblxyXG4gICAgdC5zb3VyY2VPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQuZGVzdGluYXRpb25PcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzd2l0Y2ggKHQudHlwZSkge1xyXG4gICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgIHQudmFsdWUgPSBSYW5nZVZhbHVlLnBhcnNlKHN0cmVhbSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHQudmFsdWUgPSBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0LmFtb3VudFNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC50cmFuc09wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yTGlzdCB7XHJcbiAgY29kZTogbnVtYmVyXHJcbiAgdmFsdWU6IG51bWJlcnxSYW5nZVZhbHVlXHJcblxyXG4gIGdldCB0eXBlKCkge1xyXG4gICAgcmV0dXJuIEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZVt0aGlzLmNvZGVdXHJcbiAgfVxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb2RlID09PSAwICYmXHJcbiAgICAgIHRoaXMudmFsdWUgPT09IDBcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBHZW5lcmF0b3JMaXN0KClcclxuICAgIHQuY29kZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgc3dpdGNoICh0LnR5cGUpIHtcclxuICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAna2V5UmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICd2ZWxSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICB0LnZhbHVlID0gUmFuZ2VWYWx1ZS5wYXJzZShzdHJlYW0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0LnZhbHVlID0gc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnQge1xyXG4gIGluc3RydW1lbnROYW1lOiBzdHJpbmdcclxuICBpbnN0cnVtZW50QmFnSW5kZXg6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnN0cnVtZW50TmFtZSA9PT0gXCJFT0lcIlxyXG4gIH1cclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudCgpXHJcbiAgICB0Lmluc3RydW1lbnROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICB0Lmluc3RydW1lbnRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnRCYWcge1xyXG4gIGluc3RydW1lbnRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4OiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudEJhZygpXHJcbiAgICB0Lmluc3RydW1lbnRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0Lmluc3RydW1lbnRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNhbXBsZUhlYWRlciB7XHJcbiAgc2FtcGxlTmFtZTogc3RyaW5nXHJcbiAgc3RhcnQ6IG51bWJlclxyXG4gIGVuZDogbnVtYmVyXHJcbiAgbG9vcFN0YXJ0OiBudW1iZXJcclxuICBsb29wRW5kOiBudW1iZXJcclxuICBzYW1wbGVSYXRlOiBudW1iZXJcclxuICBvcmlnaW5hbFBpdGNoOiBudW1iZXJcclxuICBwaXRjaENvcnJlY3Rpb246IG51bWJlclxyXG4gIHNhbXBsZUxpbms6IG51bWJlclxyXG4gIHNhbXBsZVR5cGU6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zYW1wbGVOYW1lID09PSBcIkVPU1wiXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHMgPSBuZXcgU2FtcGxlSGVhZGVyKClcclxuXHJcbiAgICBzLnNhbXBsZU5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHMuc3RhcnQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuZW5kID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmxvb3BTdGFydCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5sb29wRW5kID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLnNhbXBsZVJhdGUgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMub3JpZ2luYWxQaXRjaCA9IHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICBzLnBpdGNoQ29ycmVjdGlvbiA9IHN0cmVhbS5yZWFkSW50OCgpXHJcbiAgICBzLnNhbXBsZUxpbmsgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcy5zYW1wbGVUeXBlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzLmxvb3BTdGFydCAtPSBzLnN0YXJ0XHJcbiAgICBzLmxvb3BFbmQgLT0gcy5zdGFydFxyXG5cclxuICAgIHJldHVybiBzXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgU2FtcGxlTGluayA9IHtcclxuICBtb25vU2FtcGxlOiAxLFxyXG4gIHJpZ2h0U2FtcGxlOiAyLFxyXG4gIGxlZnRTYW1wbGU6IDQsXHJcbiAgbGlua2VkU2FtcGxlOiA4LFxyXG4gIFJvbU1vbm9TYW1wbGU6IDB4ODAwMSxcclxuICBSb21SaWdodFNhbXBsZTogMHg4MDAyLFxyXG4gIFJvbUxlZnRTYW1wbGU6IDB4ODAwNCxcclxuICBSb21MaW5rZWRTYW1wbGU6IDB4ODAwOFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TdHJ1Y3RzLnRzIiwiaW1wb3J0IHsgcGFyc2VSaWZmLCBDaHVuaywgT3B0aW9ucyBhcyBSaWZmUGFyc2VyT3B0aW9ucyB9IGZyb20gXCIuL1JpZmZQYXJzZXJcIlxyXG5pbXBvcnQgeyBQcmVzZXRIZWFkZXIsIFNhbXBsZUhlYWRlciwgUHJlc2V0QmFnLCBJbnN0cnVtZW50LCBJbnN0cnVtZW50QmFnLCBNb2R1bGF0b3JMaXN0LCBHZW5lcmF0b3JMaXN0LCBJbmZvIH0gZnJvbSBcIi4vU3RydWN0c1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VSZXN1bHQge1xyXG4gIHByZXNldEhlYWRlcnM6IFByZXNldEhlYWRlcltdXHJcbiAgcHJlc2V0Wm9uZTogUHJlc2V0QmFnW11cclxuICBwcmVzZXRNb2R1bGF0b3JzOiBNb2R1bGF0b3JMaXN0W11cclxuICBwcmVzZXRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50czogSW5zdHJ1bWVudFtdXHJcbiAgaW5zdHJ1bWVudFpvbmU6IEluc3RydW1lbnRCYWdbXVxyXG4gIGluc3RydW1lbnRNb2R1bGF0b3JzOiBNb2R1bGF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50R2VuZXJhdG9yczogR2VuZXJhdG9yTGlzdFtdXHJcbiAgc2FtcGxlSGVhZGVyczogU2FtcGxlSGVhZGVyW11cclxuICBzYW1wbGVzOiBJbnQxNkFycmF5W11cclxuICBzYW1wbGluZ0RhdGE6IENodW5rXHJcbiAgaW5mbzogSW5mb1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZShpbnB1dDogVWludDhBcnJheSwgb3B0aW9uOiBSaWZmUGFyc2VyT3B0aW9ucyA9IHt9KTogUGFyc2VSZXN1bHQge1xyXG5cclxuICAvLyBwYXJzZSBSSUZGIGNodW5rXHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gcGFyc2VSaWZmKGlucHV0LCAwLCBpbnB1dC5sZW5ndGgsIG9wdGlvbilcclxuXHJcbiAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignd3JvbmcgY2h1bmsgbGVuZ3RoJylcclxuICB9XHJcblxyXG4gIGNvbnN0IGNodW5rID0gY2h1bmtMaXN0WzBdXHJcbiAgaWYgKGNodW5rID09PSBudWxsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NodW5rIG5vdCBmb3VuZCcpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZVJpZmZDaHVuayhjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJSSUZGXCIsIFwic2Zia1wiKVxyXG5cclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzZmJrIHN0cnVjdHVyZScpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gSU5GTy1saXN0XHJcbiAgICAgIGluZm86IHBhcnNlSW5mb0xpc3QoY2h1bmtMaXN0WzBdLCBkYXRhKSxcclxuXHJcbiAgICAgIC8vIHNkdGEtbGlzdFxyXG4gICAgICBzYW1wbGluZ0RhdGE6IHBhcnNlU2R0YUxpc3QoY2h1bmtMaXN0WzFdLCBkYXRhKSxcclxuXHJcbiAgICAgIC8vIHBkdGEtbGlzdFxyXG4gICAgICAuLi5wYXJzZVBkdGFMaXN0KGNodW5rTGlzdFsyXSwgZGF0YSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlUGR0YUxpc3QoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcInBkdGFcIilcclxuXHJcbiAgICAvLyBjaGVjayBudW1iZXIgb2YgY2h1bmtzXHJcbiAgICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gOSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGR0YSBjaHVuaycpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcHJlc2V0SGVhZGVyczogcGFyc2VQaGRyKGNodW5rTGlzdFswXSwgZGF0YSksXHJcbiAgICAgIHByZXNldFpvbmU6IHBhcnNlUGJhZyhjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRNb2R1bGF0b3JzOiBwYXJzZVBtb2QoY2h1bmtMaXN0WzJdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0R2VuZXJhdG9yczogcGFyc2VQZ2VuKGNodW5rTGlzdFszXSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRzOiBwYXJzZUluc3QoY2h1bmtMaXN0WzRdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudFpvbmU6IHBhcnNlSWJhZyhjaHVua0xpc3RbNV0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50TW9kdWxhdG9yczogcGFyc2VJbW9kKGNodW5rTGlzdFs2XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRHZW5lcmF0b3JzOiBwYXJzZUlnZW4oY2h1bmtMaXN0WzddLCBkYXRhKSxcclxuICAgICAgc2FtcGxlSGVhZGVyczogcGFyc2VTaGRyKGNodW5rTGlzdFs4XSwgZGF0YSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmlmZkNodW5rKGNodW5rLCBpbnB1dClcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIC4uLnJlc3VsdCxcclxuICAgIHNhbXBsZXM6IGxvYWRTYW1wbGUocmVzdWx0LnNhbXBsZUhlYWRlcnMsIHJlc3VsdC5zYW1wbGluZ0RhdGEub2Zmc2V0LCBpbnB1dClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgZXhwZWN0ZWRUeXBlLCBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSBleHBlY3RlZFR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcblxyXG4gIC8vIGNoZWNrIHNpZ25hdHVyZVxyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgaWYgKHNpZ25hdHVyZSAhPT0gZXhwZWN0ZWRTaWduYXR1cmUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaWduYXR1cmU6JyArIHNpZ25hdHVyZSlcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcmV0dXJuIHBhcnNlUmlmZihkYXRhLCBzdHJlYW0uaXAsIGNodW5rLnNpemUgLSA0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUluZm9MaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwiSU5GT1wiKVxyXG4gIHJldHVybiBJbmZvLnBhcnNlKGRhdGEsIGNodW5rTGlzdClcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpOiBDaHVuayB7XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJzZHRhXCIpXHJcblxyXG4gIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAxKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RPRE8nKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFswXVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rPFQ+KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSwgdHlwZTogc3RyaW5nLCBjbGF6ejogeyBwYXJzZTogKHN0cmVhbTogU3RyZWFtKSA9PiBUIH0sIHRlcm1pbmF0ZT86IChvYmo6IFQpID0+IGJvb2xlYW4pOiBUW10ge1xyXG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW11cclxuXHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IHR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgICsgY2h1bmsudHlwZSlcclxuICB9XHJcbiAgXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcbiAgY29uc3Qgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemVcclxuICBcclxuICB3aGlsZSAoc3RyZWFtLmlwIDwgc2l6ZSkge1xyXG4gICAgY29uc3Qgb2JqID0gY2xhenoucGFyc2Uoc3RyZWFtKVxyXG4gICAgaWYgKHRlcm1pbmF0ZSAmJiB0ZXJtaW5hdGUob2JqKSkge1xyXG4gICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgcmVzdWx0LnB1c2gob2JqKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5jb25zdCBwYXJzZVBoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGhkclwiLCBQcmVzZXRIZWFkZXIsIHAgPT4gcC5pc0VuZClcclxuY29uc3QgcGFyc2VQYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBiYWdcIiwgUHJlc2V0QmFnKVxyXG5jb25zdCBwYXJzZUluc3QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW5zdFwiLCBJbnN0cnVtZW50LCBpID0+IGkuaXNFbmQpXHJcbmNvbnN0IHBhcnNlSWJhZyA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpYmFnXCIsIEluc3RydW1lbnRCYWcpXHJcbmNvbnN0IHBhcnNlUG1vZCA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwbW9kXCIsIE1vZHVsYXRvckxpc3QsIG0gPT4gbS5pc0VuZClcclxuY29uc3QgcGFyc2VJbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImltb2RcIiwgTW9kdWxhdG9yTGlzdCwgbSA9PiBtLmlzRW5kKVxyXG5jb25zdCBwYXJzZVBnZW4gPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGdlblwiLCBHZW5lcmF0b3JMaXN0LCBnID0+IGcuaXNFbmQpXHJcbmNvbnN0IHBhcnNlSWdlbiA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpZ2VuXCIsIEdlbmVyYXRvckxpc3QsIGcgPT4gZy5pc0VuZClcclxuY29uc3QgcGFyc2VTaGRyID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInNoZHJcIiwgU2FtcGxlSGVhZGVyLCBzID0+IHMuaXNFbmQpXHJcblxyXG5mdW5jdGlvbiBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgc2FtcGxlUmF0ZSkge1xyXG4gIGxldCBtdWx0aXBseSA9IDFcclxuXHJcbiAgLy8gYnVmZmVyXHJcbiAgd2hpbGUgKHNhbXBsZVJhdGUgPCAyMjA1MCkge1xyXG4gICAgY29uc3QgbmV3U2FtcGxlID0gbmV3IEludDE2QXJyYXkoc2FtcGxlLmxlbmd0aCAqIDIpXHJcbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDAsIGlsID0gc2FtcGxlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgIH1cclxuICAgIHNhbXBsZSA9IG5ld1NhbXBsZVxyXG4gICAgbXVsdGlwbHkgKj0gMlxyXG4gICAgc2FtcGxlUmF0ZSAqPSAyXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2FtcGxlLFxyXG4gICAgbXVsdGlwbHlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTYW1wbGUoc2FtcGxlSGVhZGVyOiBTYW1wbGVIZWFkZXJbXSwgc2FtcGxpbmdEYXRhT2Zmc2V0OiBudW1iZXIsIGRhdGE6IFVpbnQ4QXJyYXkpOiBJbnQxNkFycmF5W10ge1xyXG4gIHJldHVybiBzYW1wbGVIZWFkZXIubWFwKGhlYWRlciA9PiB7XHJcbiAgICBsZXQgc2FtcGxlID0gbmV3IEludDE2QXJyYXkobmV3IFVpbnQ4QXJyYXkoZGF0YS5zdWJhcnJheShcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLnN0YXJ0ICogMixcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLmVuZCAgICogMlxyXG4gICAgKSkuYnVmZmVyKVxyXG4gICAgaWYgKGhlYWRlci5zYW1wbGVSYXRlID4gMCkge1xyXG4gICAgICBjb25zdCBhZGp1c3QgPSBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgaGVhZGVyLnNhbXBsZVJhdGUpXHJcbiAgICAgIHNhbXBsZSA9IGFkanVzdC5zYW1wbGVcclxuICAgICAgaGVhZGVyLnNhbXBsZVJhdGUgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5sb29wU3RhcnQgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5sb29wRW5kICo9IGFkanVzdC5tdWx0aXBseVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNhbXBsZVxyXG4gIH0pXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGFyc2VyLnRzIiwiaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9TdHJlYW1cIlxyXG5cclxuZnVuY3Rpb24gcGFyc2VDaHVuayhpbnB1dDogVWludDhBcnJheSwgaXA6IG51bWJlciwgYmlnRW5kaWFuOiBib29sZWFuKTogQ2h1bmsge1xyXG4gIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oaW5wdXQsIGlwKVxyXG4gIGNvbnN0IHR5cGUgPSBzdHJlYW0ucmVhZFN0cmluZyg0KVxyXG4gIGNvbnN0IHNpemUgPSBzdHJlYW0ucmVhZERXT1JEKGJpZ0VuZGlhbilcclxuICByZXR1cm4gbmV3IENodW5rKHR5cGUsIHNpemUsIHN0cmVhbS5pcClcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcclxuICBwYWRkaW5nPzogYm9vbGVhbixcclxuICBiaWdFbmRpYW4/OiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJpZmYoaW5wdXQ6IFVpbnQ4QXJyYXksIGluZGV4OiBudW1iZXIgPSAwLCBsZW5ndGg6IG51bWJlciwgeyBwYWRkaW5nID0gdHJ1ZSwgYmlnRW5kaWFuID0gZmFsc2UgfTogT3B0aW9ucyA9IHt9KSB7XHJcbiAgY29uc3QgY2h1bmtMaXN0OiBDaHVua1tdID0gW11cclxuICBjb25zdCBlbmQgPSBsZW5ndGggKyBpbmRleFxyXG4gIGxldCBpcCA9IGluZGV4XHJcblxyXG4gIHdoaWxlIChpcCA8IGVuZCkge1xyXG4gICAgY29uc3QgY2h1bmsgPSBwYXJzZUNodW5rKGlucHV0LCBpcCwgYmlnRW5kaWFuKVxyXG4gICAgaXAgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplXHJcbiAgICBcclxuICAgIC8vIHBhZGRpbmdcclxuICAgIGlmIChwYWRkaW5nICYmICgoaXAgLSBpbmRleCkgJiAxKSA9PT0gMSkge1xyXG4gICAgICBpcCsrXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNodW5rTGlzdC5wdXNoKGNodW5rKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2h1bmsge1xyXG4gIHR5cGU6IHN0cmluZ1xyXG4gIHNpemU6IG51bWJlclxyXG4gIG9mZnNldDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgdGhpcy5zaXplID0gc2l6ZVxyXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JpZmZQYXJzZXIudHMiLCJleHBvcnQgY29uc3QgR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlID0gW1xyXG4gICdzdGFydEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kQWRkcnNPZmZzZXQnLFxyXG4gICdzdGFydGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ2VuZGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1BpdGNoJyxcclxuICAndmliTGZvVG9QaXRjaCcsXHJcbiAgJ21vZEVudlRvUGl0Y2gnLFxyXG4gICdpbml0aWFsRmlsdGVyRmMnLFxyXG4gICdpbml0aWFsRmlsdGVyUScsXHJcbiAgJ21vZExmb1RvRmlsdGVyRmMnLFxyXG4gICdtb2RFbnZUb0ZpbHRlckZjJyxcclxuICAnZW5kQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1ZvbHVtZScsXHJcbiAgdW5kZWZpbmVkLCAvLyAxNFxyXG4gICdjaG9ydXNFZmZlY3RzU2VuZCcsXHJcbiAgJ3JldmVyYkVmZmVjdHNTZW5kJyxcclxuICAncGFuJyxcclxuICB1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCwgLy8gMTgsMTksMjBcclxuICAnZGVsYXlNb2RMRk8nLFxyXG4gICdmcmVxTW9kTEZPJyxcclxuICAnZGVsYXlWaWJMRk8nLFxyXG4gICdmcmVxVmliTEZPJyxcclxuICAnZGVsYXlNb2RFbnYnLFxyXG4gICdhdHRhY2tNb2RFbnYnLFxyXG4gICdob2xkTW9kRW52JyxcclxuICAnZGVjYXlNb2RFbnYnLFxyXG4gICdzdXN0YWluTW9kRW52JyxcclxuICAncmVsZWFzZU1vZEVudicsXHJcbiAgJ2tleW51bVRvTW9kRW52SG9sZCcsXHJcbiAgJ2tleW51bVRvTW9kRW52RGVjYXknLFxyXG4gICdkZWxheVZvbEVudicsXHJcbiAgJ2F0dGFja1ZvbEVudicsXHJcbiAgJ2hvbGRWb2xFbnYnLFxyXG4gICdkZWNheVZvbEVudicsXHJcbiAgJ3N1c3RhaW5Wb2xFbnYnLFxyXG4gICdyZWxlYXNlVm9sRW52JyxcclxuICAna2V5bnVtVG9Wb2xFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Wb2xFbnZEZWNheScsXHJcbiAgJ2luc3RydW1lbnQnLFxyXG4gIHVuZGVmaW5lZCwgLy8gNDJcclxuICAna2V5UmFuZ2UnLFxyXG4gICd2ZWxSYW5nZScsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAna2V5bnVtJyxcclxuICAndmVsb2NpdHknLFxyXG4gICdpbml0aWFsQXR0ZW51YXRpb24nLFxyXG4gIHVuZGVmaW5lZCwgLy8gNDlcclxuICAnZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnY29hcnNlVHVuZScsXHJcbiAgJ2ZpbmVUdW5lJyxcclxuICAnc2FtcGxlSUQnLFxyXG4gICdzYW1wbGVNb2RlcycsXHJcbiAgdW5kZWZpbmVkLCAvLyA1NVxyXG4gICdzY2FsZVR1bmluZycsXHJcbiAgJ2V4Y2x1c2l2ZUNsYXNzJyxcclxuICAnb3ZlcnJpZGluZ1Jvb3RLZXknXHJcbl1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbnN0YW50cy50cyIsImltcG9ydCB7IFBhcnNlUmVzdWx0IH0gZnJvbSBcIi4vUGFyc2VyXCJcclxuaW1wb3J0IHsgUmFuZ2VWYWx1ZSwgR2VuZXJhdG9yTGlzdCB9IGZyb20gXCIuL1N0cnVjdHNcIlxyXG5cclxuLyoqXHJcbiAqIFBhcnNlciDjgafoqq3jgb/ovrzjgpPjgaDjgrXjgqbjg7Pjg4njg5Xjgqnjg7Pjg4jjga7jg4fjg7zjgr/jgpJcclxuICogU3ludGhlc2l6ZXIg44GL44KJ5Yip55So44GX44KE44GZ44GE5b2i44Gr44GZ44KL44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VuZEZvbnQge1xyXG4gIHByaXZhdGUgcGFyc2VkOiBQYXJzZVJlc3VsdFxyXG5cclxuICBjb25zdHJ1Y3RvcihwYXJzZWQ6IFBhcnNlUmVzdWx0KSB7XHJcbiAgICB0aGlzLnBhcnNlZCA9IHBhcnNlZFxyXG4gIH1cclxuXHJcbiAgZ2V0UHJlc2V0Wm9uZShwcmVzZXRIZWFkZXJJbmRleDogbnVtYmVyKSB7XHJcbiAgICBsZXQgcHJlc2V0R2VuZXJhdG9yczogR2VuZXJhdG9yTGlzdFtdXHJcbiAgICBjb25zdCBwcmVzZXRIZWFkZXIgPSB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzW3ByZXNldEhlYWRlckluZGV4XVxyXG4gICAgY29uc3QgcHJlc2V0QmFnID0gdGhpcy5wYXJzZWQucHJlc2V0Wm9uZVtwcmVzZXRIZWFkZXIucHJlc2V0QmFnSW5kZXhdXHJcblxyXG4gICAgY29uc3QgbmV4dFByZXNldEhlYWRlckluZGV4ID0gcHJlc2V0SGVhZGVySW5kZXggKyAxXHJcbiAgICBpZiAobmV4dFByZXNldEhlYWRlckluZGV4IDwgdGhpcy5wYXJzZWQucHJlc2V0SGVhZGVycy5sZW5ndGgpIHtcclxuICAgICAgLy8g5qyh44GuIHByZXNldCDjgb7jgafjga7jgZnjgbnjgabjga4gZ2VuZXJhdG9yIOOCkuWPluW+l+OBmeOCi1xyXG4gICAgICBjb25zdCBuZXh0UHJlc2V0SGVhZGVyID0gdGhpcy5wYXJzZWQucHJlc2V0SGVhZGVyc1tuZXh0UHJlc2V0SGVhZGVySW5kZXhdXHJcbiAgICAgIGNvbnN0IG5leHRQcmVzZXRCYWcgPSB0aGlzLnBhcnNlZC5wcmVzZXRab25lW25leHRQcmVzZXRIZWFkZXIucHJlc2V0QmFnSW5kZXhdXHJcbiAgICAgIHByZXNldEdlbmVyYXRvcnMgPSB0aGlzLnBhcnNlZC5wcmVzZXRHZW5lcmF0b3JzLnNsaWNlKHByZXNldEJhZy5wcmVzZXRHZW5lcmF0b3JJbmRleCwgbmV4dFByZXNldEJhZy5wcmVzZXRHZW5lcmF0b3JJbmRleClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIOacgOW+jOOBriBwcmVzZXQg44Gg44Gj44Gf5aC05ZCI44Gv5pyA5b6M44G+44Gn5Y+W5b6X44GZ44KLXHJcbiAgICAgIHByZXNldEdlbmVyYXRvcnMgPSB0aGlzLnBhcnNlZC5wcmVzZXRHZW5lcmF0b3JzLnNsaWNlKHByZXNldEJhZy5wcmVzZXRHZW5lcmF0b3JJbmRleCwgdGhpcy5wYXJzZWQucHJlc2V0R2VuZXJhdG9ycy5sZW5ndGgpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHByZXNldEdlbmVyYXRvcnNcclxuICB9XHJcblxyXG4gIGdldEluc3RydW1lbnRab25lKGluc3RydW1lbnRab25lSW5kZXg6IG51bWJlcikge1xyXG4gICAgY29uc3QgaW5zdHJ1bWVudEJhZyA9IHRoaXMucGFyc2VkLmluc3RydW1lbnRab25lW2luc3RydW1lbnRab25lSW5kZXhdXHJcbiAgICBjb25zdCBuZXh0SW5zdHJ1bWVudEJhZyA9IHRoaXMucGFyc2VkLmluc3RydW1lbnRab25lW2luc3RydW1lbnRab25lSW5kZXggKyAxXVxyXG4gICAgY29uc3QgZ2VuZXJhdG9ySW5kZXggPSBpbnN0cnVtZW50QmFnLmluc3RydW1lbnRHZW5lcmF0b3JJbmRleFxyXG4gICAgY29uc3QgbmV4dEdlbmVyYXRvckluZGV4ID0gbmV4dEluc3RydW1lbnRCYWcgPyBuZXh0SW5zdHJ1bWVudEJhZy5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXggOiB0aGlzLnBhcnNlZC5pbnN0cnVtZW50R2VuZXJhdG9ycy5sZW5ndGhcclxuICAgIGNvbnN0IGdlbmVyYXRvcnMgPSB0aGlzLnBhcnNlZC5pbnN0cnVtZW50R2VuZXJhdG9ycy5zbGljZShnZW5lcmF0b3JJbmRleCwgbmV4dEdlbmVyYXRvckluZGV4KVxyXG4gICAgcmV0dXJuIGNyZWF0ZUluc3RydW1lbnRab25lKGdlbmVyYXRvcnMpXHJcbiAgfVxyXG5cclxuICBnZXRJbnN0cnVtZW50Wm9uZUluZGV4ZXMoaW5zdHJ1bWVudElEOiBudW1iZXIpOiBudW1iZXJbXSB7XHJcbiAgICBjb25zdCBpbnN0cnVtZW50ID0gdGhpcy5wYXJzZWQuaW5zdHJ1bWVudHNbaW5zdHJ1bWVudElEXVxyXG4gICAgY29uc3QgbmV4dEluc3RydW1lbnQgPSB0aGlzLnBhcnNlZC5pbnN0cnVtZW50c1tpbnN0cnVtZW50SUQgKyAxXVxyXG4gICAgcmV0dXJuIGFycmF5UmFuZ2UoaW5zdHJ1bWVudC5pbnN0cnVtZW50QmFnSW5kZXgsIG5leHRJbnN0cnVtZW50ID8gbmV4dEluc3RydW1lbnQuaW5zdHJ1bWVudEJhZ0luZGV4IDogdGhpcy5wYXJzZWQuaW5zdHJ1bWVudFpvbmUubGVuZ3RoKVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5zdHJ1bWVudEtleShiYW5rTnVtYmVyLCBpbnN0cnVtZW50TnVtYmVyLCBrZXksIHZlbG9jaXR5ID0gMTAwKTogTm90ZUluZm98bnVsbCB7XHJcbiAgICBjb25zdCBwcmVzZXRIZWFkZXJJbmRleCA9IHRoaXMucGFyc2VkLnByZXNldEhlYWRlcnMuZmluZEluZGV4KHAgPT4gcC5wcmVzZXQgPT09IGluc3RydW1lbnROdW1iZXIgJiYgcC5iYW5rID09PSBiYW5rTnVtYmVyKVxyXG4gICAgXHJcbiAgICBpZiAocHJlc2V0SGVhZGVySW5kZXggPCAwKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcInByZXNldCBub3QgZm91bmQ6IGJhbms9JXMgaW5zdHJ1bWVudD0lc1wiLCBiYW5rTnVtYmVyLCBpbnN0cnVtZW50TnVtYmVyKVxyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByZXNldEdlbmVyYXRvcnMgPSB0aGlzLmdldFByZXNldFpvbmUocHJlc2V0SGVhZGVySW5kZXgpXHJcblxyXG4gICAgLy8gTGFzdCBQcmVzZXQgR2VuZXJhdG9yIG11c3QgYmUgaW5zdHJ1bWVudFxyXG4gICAgY29uc3QgbGFzdFByZXNldEdlbmVydG9yID0gcHJlc2V0R2VuZXJhdG9yc1twcmVzZXRHZW5lcmF0b3JzLmxlbmd0aCAtIDFdXHJcbiAgICBpZiAobGFzdFByZXNldEdlbmVydG9yLnR5cGUgIT09IFwiaW5zdHJ1bWVudFwiIHx8IE51bWJlcihsYXN0UHJlc2V0R2VuZXJ0b3IudmFsdWUpID09PSBOYU4pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTb3VuZEZvbnQ6IGludmFsaWQgcHJlc2V0IGdlbmVyYXRvcjogZXhwZWN0IGluc3RydW1lbnRcIilcclxuICAgIH1cclxuICAgIGNvbnN0IGluc3RydW1lbnRJRCA9IGxhc3RQcmVzZXRHZW5lcnRvci52YWx1ZSBhcyBudW1iZXJcclxuICAgIGNvbnN0IGluc3RydW1lbnRab25lcyA9IHRoaXMuZ2V0SW5zdHJ1bWVudFpvbmVJbmRleGVzKGluc3RydW1lbnRJRCkubWFwKGkgPT4gdGhpcy5nZXRJbnN0cnVtZW50Wm9uZShpKSlcclxuXHJcbiAgICAvLyDmnIDliJ3jga7jgr7jg7zjg7PjgYxzYW1wbGVJRCDjgpLmjIHjgZ/jgarjgZHjgozjgbAgZ2xvYmFsIGluc3RydW1lbnQgem9uZVxyXG4gICAgbGV0IGdsb2JhbEluc3RydW1lbnRab25lOiBhbnl8dW5kZWZpbmVkXHJcbiAgICBjb25zdCBmaXJzdEluc3RydW1lbnRab25lID0gaW5zdHJ1bWVudFpvbmVzWzBdXHJcbiAgICBpZiAoZmlyc3RJbnN0cnVtZW50Wm9uZS5zYW1wbGVJRCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGdsb2JhbEluc3RydW1lbnRab25lID0gaW5zdHJ1bWVudFpvbmVzWzBdXHJcbiAgICB9XHJcblxyXG4gICAgLy8ga2V5UmFuZ2Ug44GoIHZlbFJhbmdlIOOBjOODnuODg+ODgeOBl+OBpuOBhOOCiyBHZW5lcmF0b3Ig44KS5o6i44GZXHJcbiAgICBjb25zdCBpbnN0cnVtZW50Wm9uZSA9IGluc3RydW1lbnRab25lcy5maW5kKGkgPT4ge1xyXG4gICAgICBpZiAoaSA9PT0gZ2xvYmFsSW5zdHJ1bWVudFpvbmUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2UgLy8gZ2xvYmFsIHpvbmUg44KS6Zmk5aSWXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBpc0luS2V5UmFuZ2UgPSBmYWxzZVxyXG4gICAgICBpZiAoaS5rZXlSYW5nZSkge1xyXG4gICAgICAgIGlzSW5LZXlSYW5nZSA9IGtleSA+PSBpLmtleVJhbmdlLmxvICYmIGtleSA8PSBpLmtleVJhbmdlLmhpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBpc0luVmVsUmFuZ2UgPSB0cnVlXHJcbiAgICAgIGlmIChpLnZlbFJhbmdlKSB7XHJcbiAgICAgICAgaXNJblZlbFJhbmdlID0gdmVsb2NpdHkgPj0gaS52ZWxSYW5nZS5sbyAmJiB2ZWxvY2l0eSA8PSBpLnZlbFJhbmdlLmhpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBpc0luS2V5UmFuZ2UgJiYgaXNJblZlbFJhbmdlXHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICBpZiAoIWluc3RydW1lbnRab25lKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcImluc3RydW1lbnQgbm90IGZvdW5kOiBiYW5rPSVzIGluc3RydW1lbnQ9JXNcIiwgYmFua051bWJlciwgaW5zdHJ1bWVudE51bWJlcilcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW5zdHJ1bWVudFpvbmUuc2FtcGxlSUQgPT09IHVuZGVmaW5lZCkgeyBcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTb3VuZEZvbnQ6IHNhbXBsZUlEIG5vdCBmb3VuZFwiKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBnZW4gPSB7Li4uZGVmYXVsdEluc3RydW1lbnRab25lLCAuLi5yZW1vdmVVbmRlZmluZWQoZ2xvYmFsSW5zdHJ1bWVudFpvbmUgfHwge30pLCAuLi5yZW1vdmVVbmRlZmluZWQoaW5zdHJ1bWVudFpvbmUpfVxyXG5cclxuICAgIGNvbnN0IHNhbXBsZSA9IHRoaXMucGFyc2VkLnNhbXBsZXNbZ2VuLnNhbXBsZUlEIV1cclxuICAgIGNvbnN0IHNhbXBsZUhlYWRlciA9IHRoaXMucGFyc2VkLnNhbXBsZUhlYWRlcnNbZ2VuLnNhbXBsZUlEIV1cclxuICAgIGNvbnN0IHR1bmUgPSBnZW4uY29hcnNlVHVuZSArIGdlbi5maW5lVHVuZSAvIDEwMFxyXG4gICAgY29uc3QgYmFzZVBpdGNoID0gdHVuZSArIChzYW1wbGVIZWFkZXIucGl0Y2hDb3JyZWN0aW9uIC8gMTAwKSAtIChnZW4ub3ZlcnJpZGluZ1Jvb3RLZXkgfHwgc2FtcGxlSGVhZGVyLm9yaWdpbmFsUGl0Y2gpXHJcbiAgICBjb25zdCBzY2FsZVR1bmluZyA9IGdlbi5zY2FsZVR1bmluZyAvIDEwMFxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNhbXBsZSxcclxuICAgICAgc2FtcGxlUmF0ZTogc2FtcGxlSGVhZGVyLnNhbXBsZVJhdGUsXHJcbiAgICAgIHNhbXBsZU5hbWU6IHNhbXBsZUhlYWRlci5zYW1wbGVOYW1lLFxyXG4gICAgICBzY2FsZVR1bmluZyxcclxuICAgICAgcGxheWJhY2tSYXRlOiAoa2V5KSA9PiBNYXRoLnBvdyhNYXRoLnBvdygyLCAxIC8gMTIpLCAoa2V5ICsgYmFzZVBpdGNoKSAqIHNjYWxlVHVuaW5nKSxcclxuICAgICAga2V5UmFuZ2U6IGdlbi5rZXlSYW5nZSxcclxuICAgICAgdmVsUmFuZ2U6IGdlbi52ZWxSYW5nZSxcclxuICAgICAgdm9sQXR0YWNrOiBjb252ZXJ0VGltZShnZW4udm9sQXR0YWNrKSxcclxuICAgICAgdm9sRGVjYXk6IGNvbnZlcnRUaW1lKGdlbi52b2xEZWNheSksXHJcbiAgICAgIHZvbFN1c3RhaW46IGdlbi52b2xTdXN0YWluIC8gMTAwMCxcclxuICAgICAgdm9sUmVsZWFzZTogY29udmVydFRpbWUoZ2VuLnZvbFJlbGVhc2UpLFxyXG4gICAgICBtb2RBdHRhY2s6IGNvbnZlcnRUaW1lKGdlbi5tb2RBdHRhY2spLFxyXG4gICAgICBtb2REZWNheTogY29udmVydFRpbWUoZ2VuLm1vZERlY2F5KSxcclxuICAgICAgbW9kU3VzdGFpbjogZ2VuLm1vZFN1c3RhaW4gLyAxMDAwLFxyXG4gICAgICBtb2RSZWxlYXNlOiBjb252ZXJ0VGltZShnZW4ubW9kUmVsZWFzZSksXHJcbiAgICAgIG1vZEVudlRvUGl0Y2g6IGdlbi5tb2RFbnZUb1BpdGNoIC8gMTAwLCAvLyBjZW50XHJcbiAgICAgIG1vZEVudlRvRmlsdGVyRmM6IGdlbi5tb2RFbnZUb0ZpbHRlckZjLCAvLyBzZW1pdG9uZSAoMTAwIGNlbnQpXHJcbiAgICAgIGluaXRpYWxGaWx0ZXJROiBnZW4uaW5pdGlhbEZpbHRlclEsXHJcbiAgICAgIGluaXRpYWxGaWx0ZXJGYzogZ2VuLmluaXRpYWxGaWx0ZXJGYyxcclxuICAgICAgZnJlcVZpYkxGTzogZ2VuLmZyZXFWaWJMRk8gPyBjb252ZXJ0VGltZShnZW4uZnJlcVZpYkxGTykgKiA4LjE3NiA6IHVuZGVmaW5lZCxcclxuICAgICAgc3RhcnQ6IGdlbi5zdGFydEFkZHJzQ29hcnNlT2Zmc2V0ICogMzI3NjggKyBnZW4uc3RhcnRBZGRyc09mZnNldCxcclxuICAgICAgZW5kOiBnZW4uZW5kQWRkcnNDb2Fyc2VPZmZzZXQgKiAzMjc2OCArIGdlbi5lbmRBZGRyc09mZnNldCxcclxuICAgICAgbG9vcFN0YXJ0OiAoXHJcbiAgICAgICAgc2FtcGxlSGVhZGVyLmxvb3BTdGFydCArXHJcbiAgICAgICAgZ2VuLnN0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0ICogMzI3NjggK1xyXG4gICAgICAgIGdlbi5zdGFydGxvb3BBZGRyc09mZnNldFxyXG4gICAgICApLFxyXG4gICAgICBsb29wRW5kOiAoXHJcbiAgICAgICAgc2FtcGxlSGVhZGVyLmxvb3BFbmQgK1xyXG4gICAgICAgIGdlbi5lbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQgKiAzMjc2OCArXHJcbiAgICAgICAgZ2VuLmVuZGxvb3BBZGRyc09mZnNldFxyXG4gICAgICApLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gcHJlc2V0TmFtZXNbYmFua051bWJlcl1bcHJlc2V0TnVtYmVyXSA9IHByZXNldE5hbWVcclxuICBnZXRQcmVzZXROYW1lcygpIHtcclxuICAgIGNvbnN0IGJhbms6IHtbaW5kZXg6IG51bWJlcl06IHtbaW5kZXg6IG51bWJlcl06IHN0cmluZ319ID0ge31cclxuICAgIHRoaXMucGFyc2VkLnByZXNldEhlYWRlcnMuZm9yRWFjaChwcmVzZXQgPT4ge1xyXG4gICAgICBpZiAoIWJhbmtbcHJlc2V0LmJhbmtdKSB7XHJcbiAgICAgICAgYmFua1twcmVzZXQuYmFua10gPSB7fVxyXG4gICAgICB9XHJcbiAgICAgIGJhbmtbcHJlc2V0LmJhbmtdW3ByZXNldC5wcmVzZXRdID0gcHJlc2V0LnByZXNldE5hbWVcclxuICAgIH0pXHJcbiAgICByZXR1cm4gYmFua1xyXG4gIH1cclxufVxyXG5cclxuLy8gdmFsdWUgPSAxMjAwbG9nMihzZWMpIOOBp+ihqOOBleOCjOOCi+aZgumWk+OCkuenkuWNmOS9jeOBq+WkieaPm+OBmeOCi1xyXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRpbWUodmFsdWUpIHtcclxuICByZXR1cm4gTWF0aC5wb3coMiwgdmFsdWUgLyAxMjAwKVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVVbmRlZmluZWQob2JqKSB7XHJcbiAgY29uc3QgcmVzdWx0ID0ge31cclxuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcclxuICAgIGlmIChvYmpba2V5XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlc3VsdFtrZXldID0gb2JqW2tleV1cclxuICAgIH1cclxuICB9KVxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuZnVuY3Rpb24gYXJyYXlSYW5nZShzdGFydCwgZW5kKSB7XHJcbiAgcmV0dXJuIEFycmF5LmZyb20oe2xlbmd0aDogZW5kIC0gc3RhcnR9LCAoXywgaykgPT4gayArIHN0YXJ0KTtcclxufVxyXG5cclxuLy8g44Gy44Go44Gk44GuIGluc3RydW1lbnQg44Gr5a++5b+c44GZ44KLIEdlbmVyYXRvciDjga7phY3liJfjgYvjgonkvb/jgYTjgoTjgZnjgY/jgZfjgZ/jgqrjg5bjgrjjgqfjgq/jg4jjgpLov5TjgZlcclxuZnVuY3Rpb24gY3JlYXRlSW5zdHJ1bWVudFpvbmUoaW5zdHJ1bWVudEdlbmVyYXRvcnM6IEdlbmVyYXRvckxpc3RbXSkge1xyXG4gIGZ1bmN0aW9uIGdldFZhbHVlKHR5cGU6IHN0cmluZyk6IG51bWJlcnx1bmRlZmluZWQge1xyXG4gICAgY29uc3QgZ2VuZXJhdG9yID0gaW5zdHJ1bWVudEdlbmVyYXRvcnMuZmluZChnID0+IGcudHlwZSA9PT0gdHlwZSlcclxuICAgIGlmICghZ2VuZXJhdG9yKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWRcclxuICAgIH1cclxuICAgIGlmIChOdW1iZXIoZ2VuZXJhdG9yLnZhbHVlKSA9PT0gTmFOKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInNvbWV0aGluZyB3cm9uZ1wiKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGdlbmVyYXRvci52YWx1ZSBhcyBudW1iZXJcclxuICB9XHJcbiAgXHJcbiAgLy8gRmlyc3QgSW5zdHJ1bWVudCBHZW5lcmF0b3IgbXVzdCBiZSBrZXlSYW5nZVxyXG4gIGNvbnN0IGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvciA9IGluc3RydW1lbnRHZW5lcmF0b3JzWzBdXHJcbiAgbGV0IGtleVJhbmdlOiBSYW5nZVZhbHVlfHVuZGVmaW5lZFxyXG4gIGlmIChmaXJzdEluc3RydW1lbnRHZW5lcmF0b3IgJiYgZmlyc3RJbnN0cnVtZW50R2VuZXJhdG9yLnR5cGUgPT09IFwia2V5UmFuZ2VcIikge1xyXG4gICAgaWYgKCEoZmlyc3RJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGluc3RhbmNlb2YgUmFuZ2VWYWx1ZSkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTb3VuZEZvbnQ6IGtleVJhbmdlIGlzIG5vdCByYW5nZWQgdmFsdWVcIilcclxuICAgIH1cclxuICAgIGtleVJhbmdlID0gZmlyc3RJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGFzIFJhbmdlVmFsdWVcclxuICB9XHJcblxyXG4gIC8vIFNlY29uZCBJbnN0cnVtZW50IEdlbmVyYXRvciBjb3VsZCBiZSB2ZWxSYW5nZVxyXG4gIGNvbnN0IHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IgPSBpbnN0cnVtZW50R2VuZXJhdG9yc1sxXVxyXG4gIGxldCB2ZWxSYW5nZTogUmFuZ2VWYWx1ZXx1bmRlZmluZWRcclxuICBpZiAoc2Vjb25kSW5zdHJ1bWVudEdlbmVyYXRvciAmJiBzZWNvbmRJbnN0cnVtZW50R2VuZXJhdG9yLnR5cGUgPT09IFwidmVsUmFuZ2VcIikge1xyXG4gICAgaWYgKCEoc2Vjb25kSW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSBpbnN0YW5jZW9mIFJhbmdlVmFsdWUpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiB2ZWxSYW5nZSBpcyBub3QgcmFuZ2VkIHZhbHVlXCIpXHJcbiAgICB9XHJcbiAgICB2ZWxSYW5nZSA9IHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUgYXMgUmFuZ2VWYWx1ZVxyXG4gIH1cclxuXHJcbiAgLy8gTGFzdCBJbnN0cnVtZW50IEdlbmVyYXRvciBtdXN0IGJlIHNhbXBsZUlEXHJcbiAgY29uc3QgbGFzdEluc3RydW1lbnRHZW5lcmF0b3IgPSBpbnN0cnVtZW50R2VuZXJhdG9yc1tpbnN0cnVtZW50R2VuZXJhdG9ycy5sZW5ndGggLSAxXVxyXG4gIGxldCBzYW1wbGVJRDogbnVtYmVyfHVuZGVmaW5lZFxyXG4gIGlmIChsYXN0SW5zdHJ1bWVudEdlbmVyYXRvciAmJiBsYXN0SW5zdHJ1bWVudEdlbmVyYXRvci50eXBlID09PSBcInNhbXBsZUlEXCIpIHtcclxuICAgIGlmIChOdW1iZXIobGFzdEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUpID09PSBOYU4pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTb3VuZEZvbnQ6IHNhbXBsZUlEIGlzIG5vdCBudW1iZXJcIilcclxuICAgIH1cclxuICAgIHNhbXBsZUlEID0gbGFzdEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUgYXMgbnVtYmVyXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAga2V5UmFuZ2UsIC8vIOOBguOCi+OBr+OBmuOBoOOBjCBnbG9iYWwgem9uZSDjgavjga/nhKHjgYTjgYvjgoLjgZfjgozjgarjgYRcclxuICAgIHZlbFJhbmdlLCAvLyBvcHRpb25hbFxyXG4gICAgc2FtcGxlSUQsIC8vIGdsb2JhbCB6b25lIOOBruWgtOWQiOOBoOOBkeOBquOBhFxyXG4gICAgdm9sQXR0YWNrOiBnZXRWYWx1ZShcImF0dGFja1ZvbEVudlwiKSxcclxuICAgIHZvbERlY2F5OiBnZXRWYWx1ZShcImRlY2F5Vm9sRW52XCIpLFxyXG4gICAgdm9sU3VzdGFpbjogZ2V0VmFsdWUoXCJzdXN0YWluVm9sRW52XCIpLFxyXG4gICAgdm9sUmVsZWFzZTogZ2V0VmFsdWUoXCJyZWxlYXNlVm9sRW52XCIpLFxyXG4gICAgbW9kQXR0YWNrOiBnZXRWYWx1ZShcImF0dGFja01vZEVudlwiKSxcclxuICAgIG1vZERlY2F5OiBnZXRWYWx1ZShcImRlY2F5TW9kRW52XCIpLFxyXG4gICAgbW9kU3VzdGFpbjogZ2V0VmFsdWUoXCJzdXN0YWluTW9kRW52XCIpLFxyXG4gICAgbW9kUmVsZWFzZTogZ2V0VmFsdWUoXCJyZWxlYXNlTW9kRW52XCIpLFxyXG4gICAgbW9kRW52VG9QaXRjaDogZ2V0VmFsdWUoXCJtb2RFbnZUb1BpdGNoXCIpLFxyXG4gICAgbW9kRW52VG9GaWx0ZXJGYzogZ2V0VmFsdWUoXCJtb2RFbnZUb0ZpbHRlckZjXCIpLFxyXG4gICAgY29hcnNlVHVuZTogZ2V0VmFsdWUoXCJjb2Fyc2VUdW5lXCIpLFxyXG4gICAgZmluZVR1bmU6IGdldFZhbHVlKFwiZmluZVR1bmVcIiksXHJcbiAgICBzY2FsZVR1bmluZzogZ2V0VmFsdWUoXCJzY2FsZVR1bmluZ1wiKSxcclxuICAgIGZyZXFWaWJMRk86IGdldFZhbHVlKFwiZnJlcVZpYkxGT1wiKSxcclxuICAgIHN0YXJ0QWRkcnNPZmZzZXQ6IGdldFZhbHVlKFwic3RhcnRBZGRyc09mZnNldFwiKSxcclxuICAgIHN0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQ6IGdldFZhbHVlKFwic3RhcnRBZGRyc0NvYXJzZU9mZnNldFwiKSxcclxuICAgIGVuZEFkZHJzT2Zmc2V0OiBnZXRWYWx1ZShcImVuZEFkZHJzT2Zmc2V0XCIpLFxyXG4gICAgZW5kQWRkcnNDb2Fyc2VPZmZzZXQ6IGdldFZhbHVlKFwiZW5kQWRkcnNDb2Fyc2VPZmZzZXRcIiksXHJcbiAgICBzdGFydGxvb3BBZGRyc09mZnNldDogZ2V0VmFsdWUoXCJzdGFydGxvb3BBZGRyc09mZnNldFwiKSxcclxuICAgIHN0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0OiBnZXRWYWx1ZShcInN0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0XCIpLFxyXG4gICAgZW5kbG9vcEFkZHJzT2Zmc2V0OiBnZXRWYWx1ZShcImVuZGxvb3BBZGRyc09mZnNldFwiKSxcclxuICAgIGVuZGxvb3BBZGRyc0NvYXJzZU9mZnNldDogZ2V0VmFsdWUoXCJlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXRcIiksXHJcbiAgICBvdmVycmlkaW5nUm9vdEtleTogZ2V0VmFsdWUoXCJvdmVycmlkaW5nUm9vdEtleVwiKSxcclxuICAgIGluaXRpYWxGaWx0ZXJROiBnZXRWYWx1ZShcImluaXRpYWxGaWx0ZXJRXCIpLFxyXG4gICAgaW5pdGlhbEZpbHRlckZjOiBnZXRWYWx1ZShcImluaXRpYWxGaWx0ZXJGY1wiKSxcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRJbnN0cnVtZW50Wm9uZSA9IHtcclxuICBrZXlSYW5nZTogbmV3IFJhbmdlVmFsdWUoMCwgMTI3KSxcclxuICB2ZWxSYW5nZTogbmV3IFJhbmdlVmFsdWUoMCwgMTI3KSxcclxuICBzYW1wbGVJRDogdW5kZWZpbmVkLFxyXG4gIHZvbEF0dGFjazogLTEyMDAwLFxyXG4gIHZvbERlY2F5OiAtMTIwMDAsXHJcbiAgdm9sU3VzdGFpbjogMCxcclxuICB2b2xSZWxlYXNlOiAtMTIwMDAsXHJcbiAgbW9kQXR0YWNrOiAtMTIwMDAsXHJcbiAgbW9kRGVjYXk6IC0xMjAwMCxcclxuICBtb2RTdXN0YWluOiAwLFxyXG4gIG1vZFJlbGVhc2U6IDAsXHJcbiAgbW9kRW52VG9QaXRjaDogMCxcclxuICBtb2RFbnZUb0ZpbHRlckZjOiAwLFxyXG4gIGNvYXJzZVR1bmU6IDAsXHJcbiAgZmluZVR1bmU6IDAsXHJcbiAgc2NhbGVUdW5pbmc6IDEwMCxcclxuICBmcmVxVmliTEZPOiAwLFxyXG4gIHN0YXJ0QWRkcnNPZmZzZXQ6IDAsXHJcbiAgc3RhcnRBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBlbmRBZGRyc09mZnNldDogMCxcclxuICBlbmRBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBzdGFydGxvb3BBZGRyc09mZnNldDogMCxcclxuICBzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBlbmRsb29wQWRkcnNPZmZzZXQ6IDAsXHJcbiAgZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0OiAwLFxyXG4gIG92ZXJyaWRpbmdSb290S2V5OiB1bmRlZmluZWQsXHJcbiAgaW5pdGlhbEZpbHRlclE6IDEsXHJcbiAgaW5pdGlhbEZpbHRlckZjOiAxMzUwMCxcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOb3RlSW5mbyB7XHJcbiAgc2FtcGxlOiBJbnQxNkFycmF5XHJcbiAgc2FtcGxlUmF0ZTogbnVtYmVyXHJcbiAgc2FtcGxlTmFtZTogc3RyaW5nXHJcbiAgc3RhcnQ6IG51bWJlclxyXG4gIGVuZDogbnVtYmVyXHJcbiAgc2NhbGVUdW5pbmc6IG51bWJlclxyXG4gIHBsYXliYWNrUmF0ZTogRnVuY3Rpb25cclxuICBsb29wU3RhcnQ6IG51bWJlclxyXG4gIGxvb3BFbmQ6IG51bWJlclxyXG4gIHZvbEF0dGFjazogbnVtYmVyXHJcbiAgdm9sRGVjYXk6IG51bWJlclxyXG4gIHZvbFN1c3RhaW46IG51bWJlclxyXG4gIHZvbFJlbGVhc2U6IG51bWJlclxyXG4gIG1vZEF0dGFjazogbnVtYmVyXHJcbiAgbW9kRGVjYXk6IG51bWJlclxyXG4gIG1vZFN1c3RhaW46IG51bWJlclxyXG4gIG1vZFJlbGVhc2U6IG51bWJlclxyXG4gIG1vZEVudlRvUGl0Y2g6IG51bWJlclxyXG4gIG1vZEVudlRvRmlsdGVyRmM6IG51bWJlclxyXG4gIGluaXRpYWxGaWx0ZXJGYzogbnVtYmVyXHJcbiAgaW5pdGlhbEZpbHRlclE6IG51bWJlclxyXG4gIGZyZXFWaWJMRk86IG51bWJlcnx1bmRlZmluZWRcclxuICBrZXlSYW5nZTogUmFuZ2VWYWx1ZVxyXG4gIHZlbFJhbmdlOiBSYW5nZVZhbHVlfHVuZGVmaW5lZFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Tb3VuZEZvbnQudHMiLCJpbXBvcnQgU3ludGhlc2l6ZXJOb3RlIGZyb20gXCIuL1N5bnRoZXNpemVyTm90ZVwiXHJcbmltcG9ydCBwYXJzZSBmcm9tIFwiLi9QYXJzZXJcIlxyXG5pbXBvcnQgU291bmRGb250IGZyb20gXCIuL1NvdW5kRm9udFwiXHJcbmltcG9ydCB7IEluc3RydW1lbnRTdGF0ZSB9IGZyb20gXCIuL1N5bnRoZXNpemVyTm90ZVwiXHJcbmltcG9ydCB7IExpc3RlbmVyIH0gZnJvbSBcIi4vTWlkaU1lc3NhZ2VIYW5kbGVyXCJcclxuXHJcbmNvbnN0IEJBU0VfVk9MVU1FID0gMC40XHJcblxyXG5jbGFzcyBDaGFubmVsIHtcclxuICBpbnN0cnVtZW50ID0gMFxyXG4gIHZvbHVtZSA9IDBcclxuICBwaXRjaEJlbmQgPSAwXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPSAwXHJcbiAgcGFucG90ID0gMFxyXG4gIGN1cnJlbnROb3RlT246IFN5bnRoZXNpemVyTm90ZVtdID0gW11cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ludGhlc2l6ZXIgaW1wbGVtZW50cyBMaXN0ZW5lciB7XHJcbiAgYmFuazogbnVtYmVyID0gMFxyXG4gIGJ1ZmZlclNpemU6IG51bWJlciA9IDEwMjRcclxuICBjdHg6IEF1ZGlvQ29udGV4dFxyXG4gIGdhaW5NYXN0ZXI6IEdhaW5Ob2RlXHJcbiAgY2hhbm5lbHM6IENoYW5uZWxbXSA9IFtdXHJcbiAgbWFzdGVyVm9sdW1lOiBudW1iZXIgPSAxLjBcclxuICBzb3VuZEZvbnQ6IFNvdW5kRm9udFxyXG5cclxuICBjb25zdHJ1Y3RvcihjdHgpIHtcclxuICAgIHRoaXMuY3R4ID0gY3R4XHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIgPSB0aGlzLmN0eC5jcmVhdGVHYWluKClcclxuICAgIHRoaXMuc2V0TWFzdGVyVm9sdW1lKHRoaXMubWFzdGVyVm9sdW1lKVxyXG4gICAgdGhpcy5pbml0KClcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcclxuICAgICAgdGhpcy5jaGFubmVscy5wdXNoKG5ldyBDaGFubmVsKCkpXHJcbiAgICAgIHRoaXMucHJvZ3JhbUNoYW5nZShpLCBpICE9PSA5ID8gaSA6IDApXHJcbiAgICAgIHRoaXMudm9sdW1lQ2hhbmdlKGksIDB4NjQpXHJcbiAgICAgIHRoaXMucGFucG90Q2hhbmdlKGksIDB4NDApXHJcbiAgICAgIHRoaXMucGl0Y2hCZW5kKGksIDApXHJcbiAgICAgIHRoaXMucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoaSwgMilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWRTb3VuZEZvbnQoaW5wdXQ6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IHBhcnNlciA9IHBhcnNlKGlucHV0KVxyXG4gICAgdGhpcy5zb3VuZEZvbnQgPSBuZXcgU291bmRGb250KHBhcnNlcilcclxuICB9XHJcblxyXG4gIGNvbm5lY3QoZGVzdGluYXRpb246IEF1ZGlvTm9kZSkge1xyXG4gICAgdGhpcy5nYWluTWFzdGVyLmNvbm5lY3QoZGVzdGluYXRpb24pXHJcbiAgfVxyXG5cclxuICBzZXRNYXN0ZXJWb2x1bWUodm9sdW1lOiBudW1iZXIpIHtcclxuICAgIHRoaXMubWFzdGVyVm9sdW1lID0gdm9sdW1lXHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIuZ2Fpbi52YWx1ZSA9IEJBU0VfVk9MVU1FICogdm9sdW1lIC8gMHg4MDAwXHJcbiAgfVxyXG5cclxuICBub3RlT24oY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnNvdW5kRm9udCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBjaGFubmVsTnVtYmVyID09PSA5ID8gMTI4IDogdGhpcy5iYW5rXHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGNvbnN0IG5vdGVJbmZvID0gdGhpcy5zb3VuZEZvbnQuZ2V0SW5zdHJ1bWVudEtleShiYW5rTnVtYmVyLCBjaGFubmVsLmluc3RydW1lbnQsIGtleSwgdmVsb2NpdHkpXHJcblxyXG4gICAgaWYgKCFub3RlSW5mbykge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFucG90ID0gY2hhbm5lbC5wYW5wb3QgLSA2NFxyXG4gICAgcGFucG90IC89IHBhbnBvdCA8IDAgPyA2NCA6IDYzXHJcblxyXG4gICAgLy8gY3JlYXRlIG5vdGUgaW5mb3JtYXRpb25cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXk6IEluc3RydW1lbnRTdGF0ZSA9IHtcclxuICAgICAgY2hhbm5lbDogY2hhbm5lbE51bWJlcixcclxuICAgICAga2V5OiBrZXksXHJcbiAgICAgIHZlbG9jaXR5OiB2ZWxvY2l0eSxcclxuICAgICAgcGFucG90OiBwYW5wb3QsXHJcbiAgICAgIHZvbHVtZTogY2hhbm5lbC52b2x1bWUgLyAxMjcsXHJcbiAgICAgIHBpdGNoQmVuZDogY2hhbm5lbC5waXRjaEJlbmQgLSAweDIwMDAsXHJcbiAgICAgIHBpdGNoQmVuZFNlbnNpdGl2aXR5OiBjaGFubmVsLnBpdGNoQmVuZFNlbnNpdGl2aXR5XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbm90ZSBvblxyXG4gICAgY29uc3Qgbm90ZSA9IG5ldyBTeW50aGVzaXplck5vdGUodGhpcy5jdHgsIHRoaXMuZ2Fpbk1hc3Rlciwgbm90ZUluZm8sIGluc3RydW1lbnRLZXkpXHJcbiAgICBub3RlLm5vdGVPbigpXHJcbiAgICBjaGFubmVsLmN1cnJlbnROb3RlT24ucHVzaChub3RlKVxyXG4gIH1cclxuXHJcbiAgbm90ZU9mZihjaGFubmVsTnVtYmVyOiBudW1iZXIsIGtleTogbnVtYmVyLCBfdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnNvdW5kRm9udCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBjaGFubmVsTnVtYmVyID09PSA5ID8gMTI4IDogdGhpcy5iYW5rXHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXkgPSB0aGlzLnNvdW5kRm9udC5nZXRJbnN0cnVtZW50S2V5KGJhbmtOdW1iZXIsIGNoYW5uZWwuaW5zdHJ1bWVudCwga2V5KVxyXG5cclxuICAgIGlmICghaW5zdHJ1bWVudEtleSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjdXJyZW50Tm90ZU9uID0gY2hhbm5lbC5jdXJyZW50Tm90ZU9uXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gY3VycmVudE5vdGVPbi5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XHJcbiAgICAgIGNvbnN0IG5vdGUgPSBjdXJyZW50Tm90ZU9uW2ldXHJcbiAgICAgIGlmIChub3RlLmtleSA9PT0ga2V5KSB7XHJcbiAgICAgICAgbm90ZS5ub3RlT2ZmKClcclxuICAgICAgICBjdXJyZW50Tm90ZU9uLnNwbGljZShpLCAxKVxyXG4gICAgICAgIC0taVxyXG4gICAgICAgIC0taWxcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvZ3JhbUNoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIGluc3RydW1lbnQ6IG51bWJlcikge1xyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS5pbnN0cnVtZW50ID0gaW5zdHJ1bWVudFxyXG4gIH1cclxuXHJcbiAgdm9sdW1lQ2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgdm9sdW1lOiBudW1iZXIpIHtcclxuICAgIHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl0udm9sdW1lID0gdm9sdW1lXHJcbiAgfVxyXG5cclxuICBwYW5wb3RDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBwYW5wb3Q6IG51bWJlcikge1xyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS5wYW5wb3QgPSBwYW5wb3RcclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZChjaGFubmVsTnVtYmVyOiBudW1iZXIsIHBpdGNoQmVuZDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGZvciAobGV0IG5vdGUgb2YgY2hhbm5lbC5jdXJyZW50Tm90ZU9uKSB7XHJcbiAgICAgIG5vdGUudXBkYXRlUGl0Y2hCZW5kKHBpdGNoQmVuZClcclxuICAgIH1cclxuXHJcbiAgICBjaGFubmVsLnBpdGNoQmVuZCA9IHBpdGNoQmVuZFxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBzZW5zaXRpdml0eTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLnBpdGNoQmVuZFNlbnNpdGl2aXR5ID0gc2Vuc2l0aXZpdHlcclxuICB9XHJcblxyXG4gIGFsbFNvdW5kT2ZmKGNoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gICAgY29uc3QgY3VycmVudE5vdGVPbiA9IHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl0uY3VycmVudE5vdGVPblxyXG5cclxuICAgIHdoaWxlIChjdXJyZW50Tm90ZU9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5ub3RlT2ZmKGNoYW5uZWxOdW1iZXIsIGN1cnJlbnROb3RlT25bMF0ua2V5LCAwKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzZXRBbGxDb250cm9sKGNoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gICAgdGhpcy5waXRjaEJlbmQoY2hhbm5lbE51bWJlciwgMClcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N5bnRoZXNpemVyLnRzIiwiaW1wb3J0IFN5bnRoZXNpemVyIGZyb20gXCIuL1N5bnRoZXNpemVyXCJcclxuaW1wb3J0IFByb2dyYW1OYW1lcyBmcm9tIFwiLi9Qcm9ncmFtTmFtZXNcIlxyXG5pbXBvcnQgeyBMaXN0ZW5lciB9IGZyb20gXCIuL01pZGlNZXNzYWdlSGFuZGxlclwiXHJcblxyXG5mdW5jdGlvbiByZW5kZXIoc3RyOiBzdHJpbmcpOiBFbGVtZW50IHtcclxuICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gIHdyYXBwZXIuaW5uZXJIVE1MID0gc3RyLnJlcGxhY2UoL15cXHMrLywgXCJcIilcclxuICByZXR1cm4gd3JhcHBlci5maXJzdEVsZW1lbnRDaGlsZCFcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyS2V5cygpOiBzdHJpbmcge1xyXG4gIGxldCBodG1sID0gXCJcIlxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTI4OyBpKyspIHtcclxuICAgIGNvbnN0IG4gPSBpICUgMTJcclxuICAgIGNvbnN0IGlzQmxhY2sgPSBbMSwgMywgNiwgOCwgMTBdLmluY2x1ZGVzKG4pXHJcbiAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwia2V5ICR7aXNCbGFjayA/IFwiYmxhY2tcIiA6IFwid2hpdGVcIn1cIj48L2Rpdj5gXHJcbiAgfVxyXG4gIHJldHVybiBodG1sXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlclByb2dyYW1PcHRpb25zKHByb2dyYW1OYW1lczogeyBbaW5kZXg6IG51bWJlcl06IHN0cmluZ1tdIH0sIGJhbms6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgbGV0IGh0bWwgPSBcIlwiXHJcbiAgY29uc3QgbmFtZXMgPSBwcm9ncmFtTmFtZXNbYmFua11cclxuICBmb3IgKGxldCBpIGluIG5hbWVzKSB7XHJcbiAgICBjb25zdCBuYW1lID0gbmFtZXNbaV1cclxuICAgIGh0bWwgKz0gYDxvcHRpb24gdmFsdWU9XCIke2l9XCI+JHtpfTogJHtuYW1lfTwvb3B0aW9uPmBcclxuICB9XHJcbiAgcmV0dXJuIGA8c2VsZWN0PiR7aHRtbH08L3NlbGVjdD5gXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckluc3RydW1lbnQocHJvZ3JhbSk6IEVsZW1lbnQge1xyXG4gIHJldHVybiByZW5kZXIoYFxyXG4gICAgPGRpdiBjbGFzcz1cImluc3RydW1lbnRcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyYW1cIj4ke3Byb2dyYW19PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJ2b2x1bWVcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBhbnBvdFwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGl0Y2hCZW5kXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwaXRjaEJlbmRTZW5zaXRpdml0eVwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwia2V5c1wiPiR7cmVuZGVyS2V5cygpfTwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgYClcclxufVxyXG5cclxuZnVuY3Rpb24gb2JqZWN0TWFwKG8sIGZ1bmMpIHtcclxuICBjb25zdCByZXN1bHQgPSB7fVxyXG4gIE9iamVjdC5rZXlzKG8pLmZvckVhY2goa2V5ID0+IHtcclxuICAgIHJlc3VsdFtrZXldID0gZnVuYyhvW2tleV0pXHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2dyYW1OYW1lc0Zyb21CYW5rU2V0KGJhbmtTZXQpIHtcclxuICByZXR1cm4gb2JqZWN0TWFwKGJhbmtTZXQsIGJhbmsgPT4gb2JqZWN0TWFwKGJhbmssIHMgPT4gcy5uYW1lKSlcclxufVxyXG5cclxuZnVuY3Rpb24gbWVyZ2VQcm9ncmFtTmFtZXMobGVmdDoge1tpbmRleDogbnVtYmVyXTogc3RyaW5nW119LCByaWdodDoge1tpbmRleDogbnVtYmVyXTogc3RyaW5nW119KSB7XHJcbiAgZnVuY3Rpb24gbWVyZ2VkS2V5cyhhLCBiKSB7XHJcbiAgICByZXR1cm4gbmV3IFNldChbLi4uT2JqZWN0LmtleXMoYSksIC4uLk9iamVjdC5rZXlzKGIpXSlcclxuICB9XHJcbiAgY29uc3QgYmFua3MgPSBtZXJnZWRLZXlzKGxlZnQsIHJpZ2h0KVxyXG4gIGNvbnN0IHJlc3VsdCA9IHt9XHJcbiAgYmFua3MuZm9yRWFjaChiYW5rID0+IHtcclxuICAgIGNvbnN0IGwgPSBsZWZ0W2JhbmtdIHx8IFtdXHJcbiAgICBjb25zdCByID0gcmlnaHRbYmFua10gfHwgW11cclxuICAgIGNvbnN0IGxpc3Q6IHsgW2luZGV4OiBudW1iZXJdOiBzdHJpbmd9ID0ge31cclxuICAgIGNvbnN0IHByb2dyYW1zID0gbWVyZ2VkS2V5cyhsLCByKVxyXG4gICAgcHJvZ3JhbXMuZm9yRWFjaChwID0+IHtcclxuICAgICAgbGlzdFtwXSA9IGAke2xbcF0gfHwgXCJOb25lXCJ9ICgke3JbcF0gfHwgXCJOb25lXCJ9KWBcclxuICAgIH0pXHJcbiAgICByZXN1bHRbYmFua10gPSBsaXN0XHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcgaW1wbGVtZW50cyBMaXN0ZW5lciB7XHJcbiAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50fG51bGxcclxuICBwcml2YXRlIGRyYWc6IGJvb2xlYW4gPSBmYWxzZVxyXG5cclxuICBkcmF3KHN5bnRoOiBTeW50aGVzaXplcik6IEVsZW1lbnQge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudCA9IHJlbmRlcihgPGRpdiAvPmApXHJcbiAgICBjb25zdCBwcm9ncmFtTmFtZXMgPSBtZXJnZVByb2dyYW1OYW1lcyhwcm9ncmFtTmFtZXNGcm9tQmFua1NldChzeW50aC5zb3VuZEZvbnQuZ2V0UHJlc2V0TmFtZXMoKSksIFByb2dyYW1OYW1lcylcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcclxuICAgICAgY29uc3QgYmFuayA9IGkgIT09IDkgPyAwIDogMTI4XHJcbiAgICAgIGNvbnN0IHByb2dyYW0gPSByZW5kZXJQcm9ncmFtT3B0aW9ucyhwcm9ncmFtTmFtZXMsIGJhbmspXHJcbiAgICAgIGNvbnN0IGl0ZW0gPSByZW5kZXJJbnN0cnVtZW50KHByb2dyYW0pXHJcblxyXG4gICAgICBjb25zdCBjaGFubmVsID0gaVxyXG4gICAgICBjb25zdCBzZWxlY3QgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpXHJcbiAgICAgIGlmIChzZWxlY3QpIHtcclxuICAgICAgICBzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50XHJcbiAgICAgICAgICBjb25zdCBwcm9ncmFtID0gcGFyc2VJbnQodGFyZ2V0LnZhbHVlLCAxMClcclxuICAgICAgICAgIHRoaXMucHJvZ3JhbUNoYW5nZShjaGFubmVsLCBwcm9ncmFtKVxyXG4gICAgICAgICAgc3ludGgucHJvZ3JhbUNoYW5nZShjaGFubmVsLCBwcm9ncmFtKVxyXG4gICAgICAgIH0sIGZhbHNlKVxyXG4gICAgICAgIHNlbGVjdC5zZWxlY3RlZEluZGV4ID0gc3ludGguY2hhbm5lbHNbaV0uaW5zdHJ1bWVudFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBub3RlcyA9IGl0ZW0ucXVlcnlTZWxlY3RvckFsbChcIi5rZXlcIilcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMjg7ICsraikge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGpcclxuXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgdGhpcy5kcmFnID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5ub3RlT24oY2hhbm5lbCwga2V5LCAxMjcpXHJcbiAgICAgICAgICBzeW50aC5ub3RlT24oY2hhbm5lbCwga2V5LCAxMjcpXHJcblxyXG4gICAgICAgICAgY29uc3Qgb25Nb3VzZVVwID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKVxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIHRoaXMuZHJhZyA9IGZhbHNlXHJcbiAgICAgICAgICAgIHRoaXMubm90ZU9mZihjaGFubmVsLCBrZXksIDApXHJcbiAgICAgICAgICAgIHN5bnRoLm5vdGVPZmYoY2hhbm5lbCwga2V5LCAwKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgaWYgKHRoaXMuZHJhZykge1xyXG4gICAgICAgICAgICB0aGlzLm5vdGVPbihjaGFubmVsLCBrZXksIDEyNylcclxuICAgICAgICAgICAgc3ludGgubm90ZU9uKGNoYW5uZWwsIGtleSwgMTI3KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICB0aGlzLm5vdGVPZmYoY2hhbm5lbCwga2V5LCAwKVxyXG4gICAgICAgICAgc3ludGgubm90ZU9mZihjaGFubmVsLCBrZXksIDApXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChpdGVtKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbGVtZW50XHJcbiAgfVxyXG5cclxuICByZW1vdmUoKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxyXG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbFxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsOiBudW1iZXIpOiBFbGVtZW50fG51bGwge1xyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pbnN0cnVtZW50XCIpW2NoYW5uZWxdXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEtleUVsZW1lbnQoY2hhbm5lbDogbnVtYmVyLCBrZXk6IG51bWJlcik6IEVsZW1lbnR8bnVsbCB7XHJcbiAgICBjb25zdCBlbGVtID0gdGhpcy5nZXRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsKVxyXG4gICAgaWYgKCFlbGVtKSB7XHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKFwiLmtleVwiKVtrZXldXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsOiBudW1iZXIsIHF1ZXJ5OiBzdHJpbmcpOiBFbGVtZW50fG51bGwge1xyXG4gICAgY29uc3QgZWxlbSA9IHRoaXMuZ2V0SW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbClcclxuICAgIGlmICghZWxlbSkge1xyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsZW0ucXVlcnlTZWxlY3RvcihxdWVyeSlcclxuICB9XHJcblxyXG4gIG5vdGVPbihjaGFubmVsOiBudW1iZXIsIGtleTogbnVtYmVyLCBfdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZ2V0S2V5RWxlbWVudChjaGFubmVsLCBrZXkpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ25vdGUtb24nKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbm90ZU9mZihjaGFubmVsOiBudW1iZXIsIGtleTogbnVtYmVyLCBfdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZ2V0S2V5RWxlbWVudChjaGFubmVsLCBrZXkpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGUtb24nKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvZ3JhbUNoYW5nZShjaGFubmVsOiBudW1iZXIsIGluc3RydW1lbnQ6IG51bWJlcikge1xyXG4gICAgY29uc3Qgc2VsZWN0ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIucHJvZ3JhbSBzZWxlY3RcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnR8dW5kZWZpbmVkXHJcbiAgICBpZiAoc2VsZWN0KSB7XHJcbiAgICAgIHNlbGVjdC52YWx1ZSA9IGAke2luc3RydW1lbnR9YFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdm9sdW1lQ2hhbmdlKGNoYW5uZWw6IG51bWJlciwgdm9sdW1lOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi52b2x1bWVcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHt2b2x1bWV9YFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGFucG90Q2hhbmdlKGNoYW5uZWw6IG51bWJlciwgcGFucG90OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi5wYW5wb3RcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHtwYW5wb3R9YFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kKGNoYW5uZWw6IG51bWJlciwgcGl0Y2hCZW5kOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi5waXRjaEJlbmRcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHtwaXRjaEJlbmR9YFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbDogbnVtYmVyLCBzZW5zaXRpdml0eTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIucGl0Y2hCZW5kU2Vuc2l0aXZpdHlcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHtzZW5zaXRpdml0eX1gXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhbGxTb3VuZE9mZihfY2hhbm5lbE51bWJlcjogbnVtYmVyKSB7XHJcbiAgfVxyXG5cclxuICBzZXRNYXN0ZXJWb2x1bWUoX3ZvbHVtZTogbnVtYmVyKSB7XHJcbiAgfVxyXG5cclxuICByZXNldEFsbENvbnRyb2woX2NoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvVmlldy50cyIsImV4cG9ydCBpbnRlcmZhY2UgTGlzdGVuZXIge1xyXG4gIG5vdGVPbihjaGFubmVsOiBudW1iZXIsIGtleTogbnVtYmVyLCB2ZWxvY2l0eTogbnVtYmVyKVxyXG4gIG5vdGVPZmYoY2hhbm5lbDogbnVtYmVyLCBrZXk6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcilcclxuICBzZXRNYXN0ZXJWb2x1bWUodm9sdW1lOiBudW1iZXIpXHJcbiAgcHJvZ3JhbUNoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIGluc3RydW1lbnQ6IG51bWJlcilcclxuICB2b2x1bWVDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCB2b2x1bWU6IG51bWJlcilcclxuICBwYW5wb3RDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBwYW5wb3Q6IG51bWJlcilcclxuICBwaXRjaEJlbmQoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBwaXRjaEJlbmQ6IG51bWJlcilcclxuICBwaXRjaEJlbmRTZW5zaXRpdml0eShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHNlbnNpdGl2aXR5OiBudW1iZXIpXHJcbiAgYWxsU291bmRPZmYoY2hhbm5lbE51bWJlcjogbnVtYmVyKVxyXG4gIHJlc2V0QWxsQ29udHJvbChjaGFubmVsTnVtYmVyOiBudW1iZXIpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pZGlNZXNzYWdlSGFuZGxlciB7XHJcbiAgcHJpdmF0ZSBScG5Nc2IgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cclxuICBwcml2YXRlIFJwbkxzYiA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXVxyXG4gIGxpc3RlbmVyOiBMaXN0ZW5lclxyXG5cclxuICBwcm9jZXNzTWlkaU1lc3NhZ2UobWVzc2FnZTogbnVtYmVyW10pIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBtZXNzYWdlWzBdICYgMHgwZlxyXG4gICAgY29uc3QgeyBsaXN0ZW5lciB9ID0gdGhpc1xyXG5cclxuICAgIGlmICghbGlzdGVuZXIpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChtZXNzYWdlWzBdICYgMHhmMCkge1xyXG4gICAgICBjYXNlIDB4ODA6IC8vIE5vdGVPZmY6IDhuIGtrIHZ2XHJcbiAgICAgICAgbGlzdGVuZXIubm90ZU9mZihjaGFubmVsLCBtZXNzYWdlWzFdLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMHg5MDogLy8gTm90ZU9uOiA5biBrayB2dlxyXG4gICAgICAgIGlmIChtZXNzYWdlWzJdID4gMCkge1xyXG4gICAgICAgICAgbGlzdGVuZXIubm90ZU9uKGNoYW5uZWwsIG1lc3NhZ2VbMV0sIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxpc3RlbmVyLm5vdGVPZmYoY2hhbm5lbCwgbWVzc2FnZVsxXSwgMClcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAweEIwOiAvLyBDb250cm9sIENoYW5nZTogQm4gY2MgZGRcclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbMV0pIHtcclxuICAgICAgICAgIGNhc2UgMHgwNjogLy8gRGF0YSBFbnRyeTogQm4gMDYgZGRcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLlJwbk1zYltjaGFubmVsXSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5ScG5Mc2JbY2hhbm5lbF0pIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAwOiAvLyBQaXRjaCBCZW5kIFNlbnNpdGl2aXR5XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbCwgbWVzc2FnZVsyXSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHgwNzogLy8gVm9sdW1lIENoYW5nZTogQm4gMDcgZGRcclxuICAgICAgICAgICAgbGlzdGVuZXIudm9sdW1lQ2hhbmdlKGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4MEE6IC8vIFBhbnBvdCBDaGFuZ2U6IEJuIDBBIGRkXHJcbiAgICAgICAgICAgIGxpc3RlbmVyLnBhbnBvdENoYW5nZShjaGFubmVsLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDc4OiAvLyBBbGwgU291bmQgT2ZmOiBCbiA3OCAwMFxyXG4gICAgICAgICAgICBsaXN0ZW5lci5hbGxTb3VuZE9mZihjaGFubmVsKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDc5OiAvLyBSZXNldCBBbGwgQ29udHJvbDogQm4gNzkgMDBcclxuICAgICAgICAgICAgbGlzdGVuZXIucmVzZXRBbGxDb250cm9sKGNoYW5uZWwpXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4MjA6IC8vIEJhbmtTZWxlY3RcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImJhbmtzZWxlY3Q6XCIsIGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4NjQ6IC8vIFJQTiBNU0JcclxuICAgICAgICAgICAgdGhpcy5ScG5Nc2JbY2hhbm5lbF0gPSBtZXNzYWdlWzJdXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4NjU6IC8vIFJQTiBMU0JcclxuICAgICAgICAgICAgdGhpcy5ScG5Mc2JbY2hhbm5lbF0gPSBtZXNzYWdlWzJdXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgLy8gbm90IHN1cHBvcnRlZFxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4QzA6IC8vIFByb2dyYW0gQ2hhbmdlOiBDbiBwcFxyXG4gICAgICAgIGxpc3RlbmVyLnByb2dyYW1DaGFuZ2UoY2hhbm5lbCwgbWVzc2FnZVsxXSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4RTA6IHsgLy8gUGl0Y2ggQmVuZFxyXG4gICAgICAgIGNvbnN0IGJlbmQgPSAoKG1lc3NhZ2VbMV0gJiAweDdmKSB8ICgobWVzc2FnZVsyXSAmIDB4N2YpIDw8IDcpKVxyXG4gICAgICAgIGxpc3RlbmVyLnBpdGNoQmVuZChjaGFubmVsLCBiZW5kKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAweGYwOiAvLyBTeXN0ZW0gRXhjbHVzaXZlIE1lc3NhZ2VcclxuICAgICAgICAvLyBJRCBudW1iZXJcclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbMV0pIHtcclxuICAgICAgICAgIGNhc2UgMHg3ZTogLy8gbm9uLXJlYWx0aW1lXHJcbiAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHg3ZjogLy8gcmVhbHRpbWVcclxuICAgICAgICAgICAgLy8gY29uc3QgZGV2aWNlID0gbWVzc2FnZVsyXVxyXG4gICAgICAgICAgICAvLyBzdWIgSUQgMVxyXG4gICAgICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbM10pIHtcclxuICAgICAgICAgICAgICBjYXNlIDB4MDQ6IC8vIGRldmljZSBjb250cm9sXHJcbiAgICAgICAgICAgICAgICAvLyBzdWIgSUQgMlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtZXNzYWdlWzRdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMTogeyAvLyBtYXN0ZXIgdm9sdW1lXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm9sdW1lID0gbWVzc2FnZVs1XSArIChtZXNzYWdlWzZdIDw8IDcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgTUFYX1ZPTFVNRSA9IDB4NDAwMCAtIDFcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5zZXRNYXN0ZXJWb2x1bWUodm9sdW1lIC8gTUFYX1ZPTFVNRSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGRlZmF1bHQ6IC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWlkaU1lc3NhZ2VIYW5kbGVyLnRzIiwiLy8gZGVsZWdhdGVzIG1ldGhvZCBjYWxscyB0byBtdWx0aXBsZSB0YXJnZXRzXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlbGVnYXRlUHJveHk8VCBleHRlbmRzIE9iamVjdD4odGFyZ2V0czogVFtdKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXRzWzBdLCB7XHJcbiAgICBnZXQodGFyZ2V0LCBwcm9wS2V5LCBfcmVjZWl2ZXIpIHtcclxuICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICB0YXJnZXRzXHJcbiAgICAgICAgICAubWFwKHQgPT4gdFtwcm9wS2V5XS5iaW5kKHRhcmdldCkpXHJcbiAgICAgICAgICAuZm9yRWFjaChmID0+IGYoLi4uYXJndW1lbnRzKSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2RlbGVnYXRlUHJveHkudHMiLCJpbXBvcnQgV2ViTWlkaUxpbmsgZnJvbSBcIi4uL3NyYy9XZWJNaWRpTGluay50c1wiXHJcbmltcG9ydCBTeW50aGVzaXplciBmcm9tIFwiLi4vc3JjL1N5bnRoZXNpemVyLnRzXCJcclxuaW1wb3J0IFZpZXcgZnJvbSBcIi4uL3NyYy9WaWV3LnRzXCJcclxuaW1wb3J0IE1pZGlNZXNzYWdlSGFuZGxlciwgeyBMaXN0ZW5lciBhcyBNaWRpTWVzc2FnZUxpc3RlbmVyIH0gZnJvbSBcIi4uL3NyYy9NaWRpTWVzc2FnZUhhbmRsZXIudHNcIlxyXG5pbXBvcnQgZGVsZWdhdGVQcm94eSBmcm9tIFwiLi4vc3JjL2RlbGVnYXRlUHJveHkudHNcIlxyXG5cclxuZXhwb3J0IHtcclxuICBXZWJNaWRpTGluayxcclxuICBTeW50aGVzaXplcixcclxuICBWaWV3LFxyXG4gIE1pZGlNZXNzYWdlSGFuZGxlcixcclxuICBNaWRpTWVzc2FnZUxpc3RlbmVyLFxyXG4gIGRlbGVnYXRlUHJveHlcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9leHBvcnQvc3ludGguanMiLCJpbXBvcnQgU3ludGhlc2l6ZXIgZnJvbSBcIi4vU3ludGhlc2l6ZXJcIlxyXG5pbXBvcnQgVmlldyBmcm9tIFwiLi9WaWV3XCJcclxuaW1wb3J0IE1pZGlNZXNzYWdlSGFuZGxlciwgeyBMaXN0ZW5lciB9IGZyb20gXCIuL01pZGlNZXNzYWdlSGFuZGxlclwiXHJcbmltcG9ydCBkZWxlZ2F0ZVByb3h5IGZyb20gXCIuL2RlbGVnYXRlUHJveHlcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViTWlkaUxpbmsge1xyXG4gIGxvYWRDYWxsYmFjazogKEFycmF5QnVmZmVyKSA9PiB2b2lkXHJcbiAgbWlkaU1lc3NhZ2VIYW5kbGVyOiBNaWRpTWVzc2FnZUhhbmRsZXJcclxuICByZWFkeTogYm9vbGVhbiA9IGZhbHNlXHJcbiAgc3ludGg6IFN5bnRoZXNpemVyXHJcbiAgdmlldzogVmlld1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMubWlkaU1lc3NhZ2VIYW5kbGVyID0gbmV3IE1pZGlNZXNzYWdlSGFuZGxlcigpXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5yZWFkeSA9IHRydWVcclxuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpXHJcbiAgfVxyXG5cclxuICBzZXR1cCh1cmwpIHtcclxuICAgIGlmICghdGhpcy5yZWFkeSkge1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uIG9ubG9hZCgpIHtcclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIG9ubG9hZCwgZmFsc2UpXHJcbiAgICAgICAgdGhpcy5sb2FkKHVybClcclxuICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubG9hZCh1cmwpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2FkKHVybCkge1xyXG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcclxuXHJcbiAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKVxyXG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcidcclxuXHJcbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGV2KSB7XHJcbiAgICAgIGNvbnN0IHhociA9IGV2LnRhcmdldCBhcyBYTUxIdHRwUmVxdWVzdFxyXG5cclxuICAgICAgdGhpcy5vbmxvYWQoeGhyLnJlc3BvbnNlKVxyXG4gICAgICBpZiAodHlwZW9mIHRoaXMubG9hZENhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkQ2FsbGJhY2soeGhyLnJlc3BvbnNlKVxyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKVxyXG5cclxuICAgIHhoci5zZW5kKClcclxuICB9XHJcblxyXG4gIG9ubG9hZChyZXNwb25zZTogQXJyYXlCdWZmZXIpIHtcclxuICAgIGNvbnN0IGlucHV0ID0gbmV3IFVpbnQ4QXJyYXkocmVzcG9uc2UpXHJcbiAgICB0aGlzLmxvYWRTb3VuZEZvbnQoaW5wdXQpXHJcbiAgfVxyXG5cclxuICBsb2FkU291bmRGb250KGlucHV0OiBVaW50OEFycmF5KSB7XHJcbiAgICBsZXQgc3ludGg6IFN5bnRoZXNpemVyXHJcblxyXG4gICAgaWYgKCF0aGlzLnN5bnRoKSB7XHJcbiAgICAgIGNvbnN0IGN0eCA9IG5ldyBBdWRpb0NvbnRleHQoKVxyXG4gICAgICBzeW50aCA9IHRoaXMuc3ludGggPSBuZXcgU3ludGhlc2l6ZXIoY3R4KVxyXG4gICAgICBzeW50aC5jb25uZWN0KGN0eC5kZXN0aW5hdGlvbilcclxuICAgICAgc3ludGgubG9hZFNvdW5kRm9udChpbnB1dClcclxuICAgICAgY29uc3QgdmlldyA9IHRoaXMudmlldyA9IG5ldyBWaWV3KClcclxuICAgICAgZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKFwiLnN5bnRoXCIpIS5hcHBlbmRDaGlsZCh2aWV3LmRyYXcoc3ludGgpKVxyXG4gICAgICB0aGlzLm1pZGlNZXNzYWdlSGFuZGxlci5saXN0ZW5lciA9IGRlbGVnYXRlUHJveHk8TGlzdGVuZXI+KFtzeW50aCwgdmlld10pIFxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMub25tZXNzYWdlLmJpbmQodGhpcyksIGZhbHNlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3ludGggPSB0aGlzLnN5bnRoXHJcbiAgICAgIHN5bnRoLmxvYWRTb3VuZEZvbnQoaW5wdXQpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gbGluayByZWFkeVxyXG4gICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcclxuICAgICAgd2luZG93Lm9wZW5lci5wb3N0TWVzc2FnZShcImxpbmsscmVhZHlcIiwgJyonKVxyXG4gICAgfSBlbHNlIGlmICh3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShcImxpbmsscmVhZHlcIiwgJyonKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25tZXNzYWdlKGV2OiBNZXNzYWdlRXZlbnQpIHtcclxuICAgIGNvbnN0IG1zZyA9IGV2LmRhdGEuc3BsaXQoJywnKVxyXG4gICAgY29uc3QgdHlwZSA9IG1zZy5zaGlmdCgpXHJcblxyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgJ21pZGknOlxyXG4gICAgICAgIHRoaXMubWlkaU1lc3NhZ2VIYW5kbGVyLnByb2Nlc3NNaWRpTWVzc2FnZShcclxuICAgICAgICAgIG1zZy5tYXAoZnVuY3Rpb24oaGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChoZXgsIDE2KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnbGluayc6XHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG1zZy5zaGlmdCgpXHJcbiAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XHJcbiAgICAgICAgICBjYXNlICdyZXFwYXRjaCc6XHJcbiAgICAgICAgICAgIC8vIFRPRE86IGR1bW15IGRhdGFcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcclxuICAgICAgICAgICAgICB3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKFwibGluayxwYXRjaFwiLCAnKicpXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LnBhcmVudCAhPT0gd2luZG93KSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShcImxpbmsscGF0Y2hcIiwgJyonKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlICdzZXRwYXRjaCc6XHJcbiAgICAgICAgICAgIC8vIFRPRE86IE5PUFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcigndW5rbm93biBsaW5rIG1lc3NhZ2U6JywgY29tbWFuZClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zb2xlLmVycm9yKCd1bmtub3duIG1lc3NhZ2UgdHlwZScpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRMb2FkQ2FsbGJhY2soY2FsbGJhY2s6IChBcnJheUJ1ZmZlcikgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5sb2FkQ2FsbGJhY2sgPSBjYWxsYmFja1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvV2ViTWlkaUxpbmsudHMiLCJpbXBvcnQgeyBOb3RlSW5mbyB9IGZyb20gXCIuL1NvdW5kRm9udFwiXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEluc3RydW1lbnRTdGF0ZSB7XHJcbiAgY2hhbm5lbDogbnVtYmVyXHJcbiAga2V5OiBudW1iZXJcclxuICB2b2x1bWU6IG51bWJlclxyXG4gIHBhbnBvdDogbnVtYmVyXHJcbiAgdmVsb2NpdHk6IG51bWJlclxyXG4gIHBpdGNoQmVuZDogbnVtYmVyXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHk6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeW50aGVzaXplck5vdGUge1xyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIGF1ZGlvIG5vZGVcclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBhdWRpb0J1ZmZlcjogQXVkaW9CdWZmZXJcclxuICBidWZmZXJTb3VyY2U6IEF1ZGlvQnVmZmVyU291cmNlTm9kZVxyXG4gIHBhbm5lcjogUGFubmVyTm9kZVxyXG4gIGdhaW5PdXRwdXQ6IEdhaW5Ob2RlXHJcbiAgY3R4OiBBdWRpb0NvbnRleHRcclxuICBkZXN0aW5hdGlvbjogQXVkaW9Ob2RlXHJcbiAgZmlsdGVyOiBCaXF1YWRGaWx0ZXJOb2RlXHJcbiAgbm90ZUluZm86IE5vdGVJbmZvXHJcbiAgaW5zdHJ1bWVudDogSW5zdHJ1bWVudFN0YXRlXHJcbiAgY2hhbm5lbDogbnVtYmVyXHJcbiAga2V5OiBudW1iZXJcclxuICB2ZWxvY2l0eTogbnVtYmVyXHJcbiAgcGxheWJhY2tSYXRlOiBudW1iZXJcclxuICB2b2x1bWU6IG51bWJlclxyXG4gIHBhbnBvdDogbnVtYmVyXHJcbiAgcGl0Y2hCZW5kOiBudW1iZXJcclxuICBwaXRjaEJlbmRTZW5zaXRpdml0eTogbnVtYmVyXHJcblxyXG4gIC8vIHN0YXRlXHJcbiAgc3RhcnRUaW1lOiBudW1iZXJcclxuICBjb21wdXRlZFBsYXliYWNrUmF0ZTogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKGN0eDogQXVkaW9Db250ZXh0LCBkZXN0aW5hdGlvbjogQXVkaW9Ob2RlLCBub3RlSW5mbzogTm90ZUluZm8sIGluc3RydW1lbnQ6IEluc3RydW1lbnRTdGF0ZSkge1xyXG4gICAgdGhpcy5jdHggPSBjdHhcclxuICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvblxyXG4gICAgdGhpcy5ub3RlSW5mbyA9IG5vdGVJbmZvXHJcbiAgICB0aGlzLnBsYXliYWNrUmF0ZSA9IG5vdGVJbmZvLnBsYXliYWNrUmF0ZShpbnN0cnVtZW50LmtleSlcclxuICAgIHRoaXMuaW5zdHJ1bWVudCA9IGluc3RydW1lbnRcclxuICAgIHRoaXMuY2hhbm5lbCA9IGluc3RydW1lbnQuY2hhbm5lbFxyXG4gICAgdGhpcy5rZXkgPSBpbnN0cnVtZW50LmtleVxyXG4gICAgdGhpcy52ZWxvY2l0eSA9IGluc3RydW1lbnQudmVsb2NpdHlcclxuICAgIHRoaXMudm9sdW1lID0gaW5zdHJ1bWVudC52b2x1bWVcclxuICAgIHRoaXMucGFucG90ID0gaW5zdHJ1bWVudC5wYW5wb3RcclxuICAgIHRoaXMucGl0Y2hCZW5kID0gaW5zdHJ1bWVudC5waXRjaEJlbmRcclxuICAgIHRoaXMucGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPSBpbnN0cnVtZW50LnBpdGNoQmVuZFNlbnNpdGl2aXR5XHJcbiAgICB0aGlzLnN0YXJ0VGltZSA9IGN0eC5jdXJyZW50VGltZVxyXG4gICAgdGhpcy5jb21wdXRlZFBsYXliYWNrUmF0ZSA9IHRoaXMucGxheWJhY2tSYXRlXHJcbiAgfVxyXG5cclxuICBub3RlT24oKSB7XHJcbiAgICBjb25zdCB7IGN0eCwgbm90ZUluZm8gfSA9IHRoaXNcclxuXHJcbiAgICBjb25zdCBzYW1wbGUgPSBub3RlSW5mby5zYW1wbGUuc3ViYXJyYXkoMCwgbm90ZUluZm8uc2FtcGxlLmxlbmd0aCArIG5vdGVJbmZvLmVuZClcclxuICAgIHRoaXMuYXVkaW9CdWZmZXIgPSBjdHguY3JlYXRlQnVmZmVyKDEsIHNhbXBsZS5sZW5ndGgsIG5vdGVJbmZvLnNhbXBsZVJhdGUpXHJcblxyXG4gICAgY29uc3QgY2hhbm5lbERhdGEgPSB0aGlzLmF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKDApXHJcbiAgICBjaGFubmVsRGF0YS5zZXQoc2FtcGxlKVxyXG5cclxuICAgIC8vIGJ1ZmZlciBzb3VyY2VcclxuICAgIGNvbnN0IGJ1ZmZlclNvdXJjZSA9IGN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxyXG4gICAgYnVmZmVyU291cmNlLmJ1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXJcclxuICAgIGJ1ZmZlclNvdXJjZS5sb29wID0gKHRoaXMuY2hhbm5lbCAhPT0gOSlcclxuICAgIGJ1ZmZlclNvdXJjZS5sb29wU3RhcnQgPSBub3RlSW5mby5sb29wU3RhcnQgLyBub3RlSW5mby5zYW1wbGVSYXRlXHJcbiAgICBidWZmZXJTb3VyY2UubG9vcEVuZCA9IG5vdGVJbmZvLmxvb3BFbmQgLyBub3RlSW5mby5zYW1wbGVSYXRlXHJcbiAgICBidWZmZXJTb3VyY2Uub25lbmRlZCA9ICgpID0+IHRoaXMuZGlzY29ubmVjdCgpXHJcbiAgICB0aGlzLmJ1ZmZlclNvdXJjZSA9IGJ1ZmZlclNvdXJjZVxyXG4gICAgdGhpcy51cGRhdGVQaXRjaEJlbmQodGhpcy5waXRjaEJlbmQpXHJcblxyXG4gICAgLy8gYXVkaW8gbm9kZVxyXG4gICAgY29uc3QgcGFubmVyID0gdGhpcy5wYW5uZXIgPSBjdHguY3JlYXRlUGFubmVyKClcclxuICAgIGNvbnN0IG91dHB1dCA9IHRoaXMuZ2Fpbk91dHB1dCA9IGN0eC5jcmVhdGVHYWluKClcclxuICAgIGNvbnN0IG91dHB1dEdhaW4gPSBvdXRwdXQuZ2FpblxyXG5cclxuICAgIC8vIGZpbHRlclxyXG4gICAgY29uc3QgZmlsdGVyID0gY3R4LmNyZWF0ZUJpcXVhZEZpbHRlcigpXHJcbiAgICBmaWx0ZXIudHlwZSA9IFwibG93cGFzc1wiXHJcbiAgICB0aGlzLmZpbHRlciA9IGZpbHRlclxyXG5cclxuICAgIC8vIHBhbnBvdFxyXG4gICAgcGFubmVyLnBhbm5pbmdNb2RlbCA9IFwiZXF1YWxwb3dlclwiXHJcbiAgICBwYW5uZXIuc2V0UG9zaXRpb24oXHJcbiAgICAgIE1hdGguc2luKHRoaXMucGFucG90ICogTWF0aC5QSSAvIDIpLFxyXG4gICAgICAwLFxyXG4gICAgICBNYXRoLmNvcyh0aGlzLnBhbnBvdCAqIE1hdGguUEkgLyAyKVxyXG4gICAgKVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBBdHRhY2ssIERlY2F5LCBTdXN0YWluXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdHguY3VycmVudFRpbWVcclxuICAgIGNvbnN0IHZvbEF0dGFja1RpbWUgPSBub3cgKyBub3RlSW5mby52b2xBdHRhY2tcclxuICAgIGNvbnN0IG1vZEF0dGFja1RpbWUgPSBub3cgKyBub3RlSW5mby5tb2RBdHRhY2tcclxuICAgIGNvbnN0IHZvbERlY2F5ID0gdm9sQXR0YWNrVGltZSArIG5vdGVJbmZvLnZvbERlY2F5XHJcbiAgICBjb25zdCBtb2REZWNheSA9IG1vZEF0dGFja1RpbWUgKyBub3RlSW5mby5tb2REZWNheVxyXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gbm90ZUluZm8uc3RhcnQgLyBub3RlSW5mby5zYW1wbGVSYXRlXHJcblxyXG4gICAgY29uc3QgYXR0YWNrVm9sdW1lID0gdGhpcy52b2x1bWUgKiAodGhpcy52ZWxvY2l0eSAvIDEyNylcclxuICAgIG91dHB1dEdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgbm93KVxyXG4gICAgb3V0cHV0R2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShhdHRhY2tWb2x1bWUsIHZvbEF0dGFja1RpbWUpXHJcbiAgICBvdXRwdXRHYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGF0dGFja1ZvbHVtZSAqICgxIC0gbm90ZUluZm8udm9sU3VzdGFpbiksIHZvbERlY2F5KVxyXG5cclxuICAgIGZpbHRlci5RLnNldFZhbHVlQXRUaW1lKG5vdGVJbmZvLmluaXRpYWxGaWx0ZXJRIC8gMTAsIG5vdylcclxuICAgIGNvbnN0IGJhc2VGcmVxID0gYW1vdW50VG9GcmVxKG5vdGVJbmZvLmluaXRpYWxGaWx0ZXJGYylcclxuICAgIGNvbnN0IHBlZWtGcmVxID0gYW1vdW50VG9GcmVxKG5vdGVJbmZvLmluaXRpYWxGaWx0ZXJGYyArIG5vdGVJbmZvLm1vZEVudlRvRmlsdGVyRmMpXHJcbiAgICBjb25zdCBzdXN0YWluRnJlcSA9IGJhc2VGcmVxICsgKHBlZWtGcmVxIC0gYmFzZUZyZXEpICogKDEgLSBub3RlSW5mby5tb2RTdXN0YWluKVxyXG4gICAgZmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShiYXNlRnJlcSwgbm93KVxyXG4gICAgZmlsdGVyLmZyZXF1ZW5jeS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShwZWVrRnJlcSwgbW9kQXR0YWNrVGltZSlcclxuICAgIGZpbHRlci5mcmVxdWVuY3kubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoc3VzdGFpbkZyZXEsIG1vZERlY2F5KVxyXG5cclxuICAgIGZ1bmN0aW9uIGFtb3VudFRvRnJlcSh2YWw6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiBNYXRoLnBvdygyLCAodmFsIC0gNjkwMCkgLyAxMjAwKSAqIDQ0MFxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbm5lY3RcclxuICAgIGJ1ZmZlclNvdXJjZS5jb25uZWN0KGZpbHRlcilcclxuICAgIGZpbHRlci5jb25uZWN0KHBhbm5lcilcclxuICAgIHBhbm5lci5jb25uZWN0KG91dHB1dClcclxuICAgIG91dHB1dC5jb25uZWN0KHRoaXMuZGVzdGluYXRpb24pXHJcblxyXG4gICAgLy8gZmlyZVxyXG4gICAgYnVmZmVyU291cmNlLnN0YXJ0KDAsIHN0YXJ0VGltZSlcclxuICB9XHJcblxyXG4gIG5vdGVPZmYoKSB7XHJcbiAgICBjb25zdCB7IG5vdGVJbmZvLCBidWZmZXJTb3VyY2UgfSA9IHRoaXNcclxuICAgIGNvbnN0IG91dHB1dCA9IHRoaXMuZ2Fpbk91dHB1dFxyXG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdHguY3VycmVudFRpbWVcclxuICAgIGNvbnN0IHZvbEVuZFRpbWUgPSBub3cgKyBub3RlSW5mby52b2xSZWxlYXNlXHJcbiAgICBjb25zdCBtb2RFbmRUaW1lID0gbm93ICsgbm90ZUluZm8ubW9kUmVsZWFzZVxyXG5cclxuICAgIGlmICghdGhpcy5hdWRpb0J1ZmZlcikge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICAvLyBpZ25vcmUgbm90ZSBvZmYgZm9yIHJoeXRobSB0cmFja1xyXG4gICAgaWYgKHRoaXMuY2hhbm5lbCA9PT0gOSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gUmVsZWFzZVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIG91dHB1dC5nYWluLmNhbmNlbFNjaGVkdWxlZFZhbHVlcygwKVxyXG4gICAgb3V0cHV0LmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgdm9sRW5kVGltZSlcclxuICAgIGJ1ZmZlclNvdXJjZS5wbGF5YmFja1JhdGUuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKDApXHJcbiAgICBidWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUsIG1vZEVuZFRpbWUpXHJcblxyXG4gICAgYnVmZmVyU291cmNlLmxvb3AgPSBmYWxzZVxyXG4gICAgYnVmZmVyU291cmNlLnN0b3Aodm9sRW5kVGltZSlcclxuICB9XHJcblxyXG4gIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICB0aGlzLmJ1ZmZlclNvdXJjZS5kaXNjb25uZWN0KDApXHJcbiAgICB0aGlzLnBhbm5lci5kaXNjb25uZWN0KDApXHJcbiAgICB0aGlzLmdhaW5PdXRwdXQuZGlzY29ubmVjdCgwKVxyXG4gIH1cclxuXHJcbiAgc2NoZWR1bGVQbGF5YmFja1JhdGUoKSB7XHJcbiAgICBjb25zdCB7IG5vdGVJbmZvIH0gPSB0aGlzXHJcbiAgICBjb25zdCBwbGF5YmFja1JhdGUgPSB0aGlzLmJ1ZmZlclNvdXJjZS5wbGF5YmFja1JhdGVcclxuICAgIGNvbnN0IGNvbXB1dGVkID0gdGhpcy5jb21wdXRlZFBsYXliYWNrUmF0ZVxyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0VGltZVxyXG4gICAgY29uc3QgbW9kQXR0YWNrID0gc3RhcnQgKyBub3RlSW5mby5tb2RBdHRhY2tcclxuICAgIGNvbnN0IG1vZERlY2F5ID0gbW9kQXR0YWNrICsgbm90ZUluZm8ubW9kRGVjYXlcclxuICAgIGNvbnN0IHBlZWtQaXRjaCA9IGNvbXB1dGVkICogTWF0aC5wb3coXHJcbiAgICAgIE1hdGgucG93KDIsIDEgLyAxMiksXHJcbiAgICAgIG5vdGVJbmZvLm1vZEVudlRvUGl0Y2ggKiBub3RlSW5mby5zY2FsZVR1bmluZ1xyXG4gICAgKVxyXG5cclxuICAgIHBsYXliYWNrUmF0ZS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoMClcclxuICAgIHBsYXliYWNrUmF0ZS5zZXRWYWx1ZUF0VGltZShjb21wdXRlZCwgc3RhcnQpXHJcbiAgICBwbGF5YmFja1JhdGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUocGVla1BpdGNoLCBtb2RBdHRhY2spXHJcbiAgICBwbGF5YmFja1JhdGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoY29tcHV0ZWQgKyAocGVla1BpdGNoIC0gY29tcHV0ZWQpICogKDEgLSBub3RlSW5mby5tb2RTdXN0YWluKSwgbW9kRGVjYXkpXHJcbiAgfVxyXG5cclxuICB1cGRhdGVQaXRjaEJlbmQocGl0Y2hCZW5kOiBudW1iZXIpIHtcclxuICAgIHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUgPSB0aGlzLnBsYXliYWNrUmF0ZSAqIE1hdGgucG93KFxyXG4gICAgICBNYXRoLnBvdygyLCAxIC8gMTIpLFxyXG4gICAgICAoXHJcbiAgICAgICAgdGhpcy5waXRjaEJlbmRTZW5zaXRpdml0eSAqIChcclxuICAgICAgICAgIHBpdGNoQmVuZCAvIChwaXRjaEJlbmQgPCAwID8gODE5MiA6IDgxOTEpXHJcbiAgICAgICAgKVxyXG4gICAgICApICogdGhpcy5ub3RlSW5mby5zY2FsZVR1bmluZ1xyXG4gICAgKVxyXG4gICAgdGhpcy5zY2hlZHVsZVBsYXliYWNrUmF0ZSgpXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TeW50aGVzaXplck5vdGUudHMiLCJjb25zdCBQcm9ncmFtTmFtZXM6IHsgW2luZGV4OiBudW1iZXJdOiBzdHJpbmdbXSB9ID0ge1xyXG4gIDA6IFtcclxuICAgIFwiQWNvdXN0aWMgUGlhbm9cIixcclxuICAgIFwiQnJpZ2h0IFBpYW5vXCIsXHJcbiAgICBcIkVsZWN0cmljIEdyYW5kIFBpYW5vXCIsXHJcbiAgICBcIkhvbmt5LXRvbmsgUGlhbm9cIixcclxuICAgIFwiRWxlY3RyaWMgUGlhbm9cIixcclxuICAgIFwiRWxlY3RyaWMgUGlhbm8gMlwiLFxyXG4gICAgXCJIYXJwc2ljaG9yZFwiLFxyXG4gICAgXCJDbGF2aVwiLFxyXG4gICAgXCJDZWxlc3RhXCIsXHJcbiAgICBcIkdsb2NrZW5zcGllbFwiLFxyXG4gICAgXCJNdXNpY2FsIGJveFwiLFxyXG4gICAgXCJWaWJyYXBob25lXCIsXHJcbiAgICBcIk1hcmltYmFcIixcclxuICAgIFwiWHlsb3Bob25lXCIsXHJcbiAgICBcIlR1YnVsYXIgQmVsbFwiLFxyXG4gICAgXCJEdWxjaW1lclwiLFxyXG4gICAgXCJEcmF3YmFyIE9yZ2FuXCIsXHJcbiAgICBcIlBlcmN1c3NpdmUgT3JnYW5cIixcclxuICAgIFwiUm9jayBPcmdhblwiLFxyXG4gICAgXCJDaHVyY2ggb3JnYW5cIixcclxuICAgIFwiUmVlZCBvcmdhblwiLFxyXG4gICAgXCJBY2NvcmRpb25cIixcclxuICAgIFwiSGFybW9uaWNhXCIsXHJcbiAgICBcIlRhbmdvIEFjY29yZGlvblwiLFxyXG4gICAgXCJBY291c3RpYyBHdWl0YXIgKG55bG9uKVwiLFxyXG4gICAgXCJBY291c3RpYyBHdWl0YXIgKHN0ZWVsKVwiLFxyXG4gICAgXCJFbGVjdHJpYyBHdWl0YXIgKGphenopXCIsXHJcbiAgICBcIkVsZWN0cmljIEd1aXRhciAoY2xlYW4pXCIsXHJcbiAgICBcIkVsZWN0cmljIEd1aXRhciAobXV0ZWQpXCIsXHJcbiAgICBcIk92ZXJkcml2ZW4gR3VpdGFyXCIsXHJcbiAgICBcIkRpc3RvcnRpb24gR3VpdGFyXCIsXHJcbiAgICBcIkd1aXRhciBoYXJtb25pY3NcIixcclxuICAgIFwiQWNvdXN0aWMgQmFzc1wiLFxyXG4gICAgXCJFbGVjdHJpYyBCYXNzIChmaW5nZXIpXCIsXHJcbiAgICBcIkVsZWN0cmljIEJhc3MgKHBpY2spXCIsXHJcbiAgICBcIkZyZXRsZXNzIEJhc3NcIixcclxuICAgIFwiU2xhcCBCYXNzIDFcIixcclxuICAgIFwiU2xhcCBCYXNzIDJcIixcclxuICAgIFwiU3ludGggQmFzcyAxXCIsXHJcbiAgICBcIlN5bnRoIEJhc3MgMlwiLFxyXG4gICAgXCJWaW9saW5cIixcclxuICAgIFwiVmlvbGFcIixcclxuICAgIFwiQ2VsbG9cIixcclxuICAgIFwiRG91YmxlIGJhc3NcIixcclxuICAgIFwiVHJlbW9sbyBTdHJpbmdzXCIsXHJcbiAgICBcIlBpenppY2F0byBTdHJpbmdzXCIsXHJcbiAgICBcIk9yY2hlc3RyYWwgSGFycFwiLFxyXG4gICAgXCJUaW1wYW5pXCIsXHJcbiAgICBcIlN0cmluZyBFbnNlbWJsZSAxXCIsXHJcbiAgICBcIlN0cmluZyBFbnNlbWJsZSAyXCIsXHJcbiAgICBcIlN5bnRoIFN0cmluZ3MgMVwiLFxyXG4gICAgXCJTeW50aCBTdHJpbmdzIDJcIixcclxuICAgIFwiVm9pY2UgQWFoc1wiLFxyXG4gICAgXCJWb2ljZSBPb2hzXCIsXHJcbiAgICBcIlN5bnRoIFZvaWNlXCIsXHJcbiAgICBcIk9yY2hlc3RyYSBIaXRcIixcclxuICAgIFwiVHJ1bXBldFwiLFxyXG4gICAgXCJUcm9tYm9uZVwiLFxyXG4gICAgXCJUdWJhXCIsXHJcbiAgICBcIk11dGVkIFRydW1wZXRcIixcclxuICAgIFwiRnJlbmNoIGhvcm5cIixcclxuICAgIFwiQnJhc3MgU2VjdGlvblwiLFxyXG4gICAgXCJTeW50aCBCcmFzcyAxXCIsXHJcbiAgICBcIlN5bnRoIEJyYXNzIDJcIixcclxuICAgIFwiU29wcmFubyBTYXhcIixcclxuICAgIFwiQWx0byBTYXhcIixcclxuICAgIFwiVGVub3IgU2F4XCIsXHJcbiAgICBcIkJhcml0b25lIFNheFwiLFxyXG4gICAgXCJPYm9lXCIsXHJcbiAgICBcIkVuZ2xpc2ggSG9yblwiLFxyXG4gICAgXCJCYXNzb29uXCIsXHJcbiAgICBcIkNsYXJpbmV0XCIsXHJcbiAgICBcIlBpY2NvbG9cIixcclxuICAgIFwiRmx1dGVcIixcclxuICAgIFwiUmVjb3JkZXJcIixcclxuICAgIFwiUGFuIEZsdXRlXCIsXHJcbiAgICBcIkJsb3duIEJvdHRsZVwiLFxyXG4gICAgXCJTaGFrdWhhY2hpXCIsXHJcbiAgICBcIldoaXN0bGVcIixcclxuICAgIFwiT2NhcmluYVwiLFxyXG4gICAgXCJMZWFkIDEgKHNxdWFyZSlcIixcclxuICAgIFwiTGVhZCAyIChzYXd0b290aClcIixcclxuICAgIFwiTGVhZCAzIChjYWxsaW9wZSlcIixcclxuICAgIFwiTGVhZCA0IChjaGlmZilcIixcclxuICAgIFwiTGVhZCA1IChjaGFyYW5nKVwiLFxyXG4gICAgXCJMZWFkIDYgKHZvaWNlKVwiLFxyXG4gICAgXCJMZWFkIDcgKGZpZnRocylcIixcclxuICAgIFwiTGVhZCA4IChiYXNzICsgbGVhZClcIixcclxuICAgIFwiUGFkIDEgKEZhbnRhc2lhKVwiLFxyXG4gICAgXCJQYWQgMiAod2FybSlcIixcclxuICAgIFwiUGFkIDMgKHBvbHlzeW50aClcIixcclxuICAgIFwiUGFkIDQgKGNob2lyKVwiLFxyXG4gICAgXCJQYWQgNSAoYm93ZWQpXCIsXHJcbiAgICBcIlBhZCA2IChtZXRhbGxpYylcIixcclxuICAgIFwiUGFkIDcgKGhhbG8pXCIsXHJcbiAgICBcIlBhZCA4IChzd2VlcClcIixcclxuICAgIFwiRlggMSAocmFpbilcIixcclxuICAgIFwiRlggMiAoc291bmR0cmFjaylcIixcclxuICAgIFwiRlggMyAoY3J5c3RhbClcIixcclxuICAgIFwiRlggNCAoYXRtb3NwaGVyZSlcIixcclxuICAgIFwiRlggNSAoYnJpZ2h0bmVzcylcIixcclxuICAgIFwiRlggNiAoZ29ibGlucylcIixcclxuICAgIFwiRlggNyAoZWNob2VzKVwiLFxyXG4gICAgXCJGWCA4IChzY2ktZmkpXCIsXHJcbiAgICBcIlNpdGFyXCIsXHJcbiAgICBcIkJhbmpvXCIsXHJcbiAgICBcIlNoYW1pc2VuXCIsXHJcbiAgICBcIktvdG9cIixcclxuICAgIFwiS2FsaW1iYVwiLFxyXG4gICAgXCJCYWdwaXBlXCIsXHJcbiAgICBcIkZpZGRsZVwiLFxyXG4gICAgXCJTaGFuYWlcIixcclxuICAgIFwiVGlua2xlIEJlbGxcIixcclxuICAgIFwiQWdvZ29cIixcclxuICAgIFwiU3RlZWwgRHJ1bXNcIixcclxuICAgIFwiV29vZGJsb2NrXCIsXHJcbiAgICBcIlRhaWtvIERydW1cIixcclxuICAgIFwiTWVsb2RpYyBUb21cIixcclxuICAgIFwiU3ludGggRHJ1bVwiLFxyXG4gICAgXCJSZXZlcnNlIEN5bWJhbFwiLFxyXG4gICAgXCJHdWl0YXIgRnJldCBOb2lzZVwiLFxyXG4gICAgXCJCcmVhdGggTm9pc2VcIixcclxuICAgIFwiU2Vhc2hvcmVcIixcclxuICAgIFwiQmlyZCBUd2VldFwiLFxyXG4gICAgXCJUZWxlcGhvbmUgUmluZ1wiLFxyXG4gICAgXCJIZWxpY29wdGVyXCIsXHJcbiAgICBcIkFwcGxhdXNlXCIsXHJcbiAgICBcIkd1bnNob3RcIlxyXG4gIF0sIDEyODogW1wiUmh5dGhtIFRyYWNrXCJdXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2dyYW1OYW1lc1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Qcm9ncmFtTmFtZXMudHMiXSwic291cmNlUm9vdCI6IiJ9