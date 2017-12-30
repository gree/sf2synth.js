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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
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
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_Parser_ts__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_SoundFont_ts__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return __WEBPACK_IMPORTED_MODULE_0__src_Parser_ts__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SoundFont", function() { return __WEBPACK_IMPORTED_MODULE_1__src_SoundFont_ts__["a"]; });





/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNGE5ZDAzM2EwZDU1MDc2OGM0NSIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9TdHJ1Y3RzLnRzIiwid2VicGFjazovLy8uL3NyYy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JpZmZQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU291bmRGb250LnRzIiwid2VicGFjazovLy8uL2V4cG9ydC9wYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3RGM7SUFJWixZQUFZLElBQUksRUFBRSxNQUFNO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSTtRQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU07SUFDbEIsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFZO1FBQ3JCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUM7UUFDekYsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDMUMsRUFBRSxDQUFDLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQztRQUNwQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUc7SUFDWixDQUFDO0lBRUQsUUFBUTtRQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELFNBQVMsQ0FBQyxZQUFxQixLQUFLO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZCxNQUFNLENBQUMsQ0FDTCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUU7Z0JBQzFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUN2QixLQUFLLENBQUM7UUFDVCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsQ0FDTCxJQUFJLENBQUMsSUFBSSxDQUFDLElB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LEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsNERBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDNUYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsQ0FBQztBQUNqRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwrREFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMvRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwrREFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMvRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwrREFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMvRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwrREFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMvRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1B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LEVBQUUsQ0FBQztJQUNiLGFBQWEsRUFBRSxDQUFDO0lBQ2hCLGdCQUFnQixFQUFFLENBQUM7SUFDbkIsVUFBVSxFQUFFLENBQUM7SUFDYixRQUFRLEVBQUUsQ0FBQztJQUNYLFdBQVcsRUFBRSxHQUFHO0lBQ2hCLFVBQVUsRUFBRSxDQUFDO0lBQ2IsZ0JBQWdCLEVBQUUsQ0FBQztJQUNuQixzQkFBc0IsRUFBRSxDQUFDO0lBQ3pCLGNBQWMsRUFBRSxDQUFDO0lBQ2pCLG9CQUFvQixFQUFFLENBQUM7SUFDdkIsb0JBQW9CLEVBQUUsQ0FBQztJQUN2QiwwQkFBMEIsRUFBRSxDQUFDO0lBQzdCLGtCQUFrQixFQUFFLENBQUM7SUFDckIsd0JBQXdCLEVBQUUsQ0FBQztJQUMzQixpQkFBaUIsRUFBRSxTQUFTO0lBQzVCLGNBQWMsRUFBRSxDQUFDO0lBQ2pCLGVBQWUsRUFBRSxLQUFLO0NBQ3ZCOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3pSRDtBQUNBIiwiZmlsZSI6InNmMi5wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTRhOWQwMzNhMGQ1NTA3NjhjNDUiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xyXG4gIHByaXZhdGUgZGF0YTogVWludDhBcnJheVxyXG4gIGlwOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IoZGF0YSwgb2Zmc2V0KSB7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhXHJcbiAgICB0aGlzLmlwID0gb2Zmc2V0XHJcbiAgfVxyXG5cclxuICByZWFkU3RyaW5nKHNpemU6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHRoaXMuZGF0YS5zdWJhcnJheSh0aGlzLmlwLCB0aGlzLmlwICs9IHNpemUpKVxyXG4gICAgY29uc3QgbnVsbExvY2F0aW9uID0gc3RyLmluZGV4T2YoXCJcXHUwMDAwXCIpXHJcbiAgICBpZiAobnVsbExvY2F0aW9uID4gMCkge1xyXG4gICAgICByZXR1cm4gc3RyLnN1YnN0cigwLCBudWxsTG9jYXRpb24pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RyXHJcbiAgfVxyXG5cclxuICByZWFkV09SRCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwKytdIHwgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpXHJcbiAgfVxyXG5cclxuICByZWFkRFdPUkQoYmlnRW5kaWFuOiBib29sZWFuID0gZmFsc2UpOiBudW1iZXIge1xyXG4gICAgaWYgKGJpZ0VuZGlhbikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDI0fCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMTYpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdKVxyXG4gICAgICApID4+PiAwXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuZGF0YVt0aGlzLmlwKytdIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDE2KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAyNClcclxuICAgICAgKSA+Pj4gMFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVhZEJ5dGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXArK11cclxuICB9XHJcblxyXG4gIHJlYWRBdChvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwICsgb2Zmc2V0XVxyXG4gIH1cclxuXHJcbiAgLyogaGVscGVyICovXHJcblxyXG4gIHJlYWRVSW50OCgpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWRCeXRlKClcclxuICB9XHJcbiAgXHJcbiAgcmVhZEludDgoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMucmVhZEJ5dGUoKSA8PCAyNCkgPj4gMjRcclxuICB9XHJcbiAgXHJcbiAgcmVhZFVJbnQxNigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWRXT1JEKClcclxuICB9XHJcblxyXG4gIHJlYWRJbnQxNigpIHtcclxuICAgIHJldHVybiAodGhpcy5yZWFkV09SRCgpIDw8IDE2KSA+PiAxNlxyXG4gIH1cclxuXHJcbiAgcmVhZFVJbnQzMigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWREV09SRCgpXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TdHJlYW0udHMiLCJpbXBvcnQgeyBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgfSBmcm9tIFwiLi9Db25zdGFudHNcIlxyXG5pbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcbmltcG9ydCB7IENodW5rIH0gZnJvbSBcIi4vUmlmZlBhcnNlclwiXHJcblxyXG5leHBvcnQgY2xhc3MgVmVyc2lvblRhZyB7XHJcbiAgbWFqb3I6IG51bWJlclxyXG4gIG1pbm9yOiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHYgPSBuZXcgVmVyc2lvblRhZygpXHJcbiAgICB2Lm1ham9yID0gc3RyZWFtLnJlYWRJbnQ4KClcclxuICAgIHYubWlub3IgPSBzdHJlYW0ucmVhZEludDgoKVxyXG4gICAgcmV0dXJuIHZcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmZvIHtcclxuICBjb21tZW50OiBzdHJpbmd8bnVsbFxyXG4gIGNvcHlyaWdodDogc3RyaW5nfG51bGxcclxuICBjcmVhdGlvbkRhdGU6IHN0cmluZ3xudWxsXHJcbiAgZW5naW5lZXI6IHN0cmluZ3xudWxsXHJcbiAgbmFtZTogc3RyaW5nXHJcbiAgcHJvZHVjdDogc3RyaW5nfG51bGxcclxuICBzb2Z0d2FyZTogc3RyaW5nfG51bGxcclxuICB2ZXJzaW9uOiBWZXJzaW9uVGFnXHJcbiAgc291bmRFbmdpbmU6IHN0cmluZ3xudWxsXHJcbiAgcm9tTmFtZTogc3RyaW5nfG51bGxcclxuICByb21WZXJzaW9uOiBWZXJzaW9uVGFnfG51bGxcclxuXHJcbiAgLy8gTElTVCAtIElORk8g44Gu5YWo44Gm44GuIGNodW5rXHJcbiAgc3RhdGljIHBhcnNlKGRhdGE6IFVpbnQ4QXJyYXksIGNodW5rczogQ2h1bmtbXSkge1xyXG4gICAgZnVuY3Rpb24gZ2V0Q2h1bmsodHlwZSkge1xyXG4gICAgICByZXR1cm4gY2h1bmtzLmZpbmQoYyA9PiBjLnR5cGUgPT09IHR5cGUpIFxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvU3RyZWFtKGNodW5rKSB7XHJcbiAgICAgIHJldHVybiBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWFkU3RyaW5nKHR5cGUpIHtcclxuICAgICAgY29uc3QgY2h1bmsgPSBnZXRDaHVuayh0eXBlKVxyXG4gICAgICBpZiAoIWNodW5rKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdG9TdHJlYW0oY2h1bmspIS5yZWFkU3RyaW5nKGNodW5rLnNpemUpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVhZFZlcnNpb25UYWcodHlwZSkge1xyXG4gICAgICBjb25zdCBjaHVuayA9IGdldENodW5rKHR5cGUpXHJcbiAgICAgIGlmICghY2h1bmspIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBWZXJzaW9uVGFnLnBhcnNlKHRvU3RyZWFtKGNodW5rKSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgaW5mbyA9IG5ldyBJbmZvKClcclxuICAgIGluZm8uY29tbWVudCA9IHJlYWRTdHJpbmcoXCJJQ01UXCIpXHJcbiAgICBpbmZvLmNvcHlyaWdodCA9IHJlYWRTdHJpbmcoXCJJQ09QXCIpXHJcbiAgICBpbmZvLmNyZWF0aW9uRGF0ZSA9IHJlYWRTdHJpbmcoXCJJQ1JEXCIpXHJcbiAgICBpbmZvLmVuZ2luZWVyID0gcmVhZFN0cmluZyhcIklFTkdcIilcclxuICAgIGluZm8ubmFtZSA9IHJlYWRTdHJpbmcoXCJJTkFNXCIpIVxyXG4gICAgaW5mby5wcm9kdWN0ID0gcmVhZFN0cmluZyhcIklQUkRcIilcclxuICAgIGluZm8uc29mdHdhcmUgPSByZWFkU3RyaW5nKFwiSVNGVFwiKVxyXG4gICAgaW5mby52ZXJzaW9uID0gcmVhZFZlcnNpb25UYWcoXCJpZmlsXCIpIVxyXG4gICAgaW5mby5zb3VuZEVuZ2luZSA9IHJlYWRTdHJpbmcoXCJpc25nXCIpXHJcbiAgICBpbmZvLnJvbU5hbWUgPSByZWFkU3RyaW5nKFwiaXJvbVwiKVxyXG4gICAgaW5mby5yb21WZXJzaW9uID0gcmVhZFZlcnNpb25UYWcoXCJpdmVyXCIpXHJcbiAgICByZXR1cm4gaW5mb1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByZXNldEhlYWRlciB7XHJcbiAgcHJlc2V0TmFtZTogc3RyaW5nXHJcbiAgcHJlc2V0OiBudW1iZXJcclxuICBiYW5rOiBudW1iZXJcclxuICBwcmVzZXRCYWdJbmRleDogbnVtYmVyXHJcbiAgbGlicmFyeTogbnVtYmVyXHJcbiAgZ2VucmU6IG51bWJlclxyXG4gIG1vcnBob2xvZ3k6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcmVzZXROYW1lID09PSBcIkVPUFwiXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0SGVhZGVyKClcclxuICAgIHAucHJlc2V0TmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcC5wcmVzZXQgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5iYW5rID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAucHJlc2V0QmFnSW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5saWJyYXJ5ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLmdlbnJlID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLm1vcnBob2xvZ3kgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlc2V0QmFnIHtcclxuICBwcmVzZXRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgcHJlc2V0TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0QmFnKClcclxuICAgIHAucHJlc2V0R2VuZXJhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gcFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJhbmdlVmFsdWUge1xyXG4gIGxvOiBudW1iZXJcclxuICBoaTogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKGxvOiBudW1iZXIsIGhpOiBudW1iZXIpIHtcclxuICAgIHRoaXMubG8gPSBsb1xyXG4gICAgdGhpcy5oaSA9IGhpXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIHJldHVybiBuZXcgUmFuZ2VWYWx1ZShcclxuICAgICAgc3RyZWFtLnJlYWRCeXRlKCksIFxyXG4gICAgICBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vZHVsYXRvckxpc3Qge1xyXG4gIHNvdXJjZU9wZXI6IG51bWJlclxyXG4gIGRlc3RpbmF0aW9uT3BlcjogbnVtYmVyXHJcbiAgdmFsdWU6IG51bWJlcnxSYW5nZVZhbHVlXHJcbiAgYW1vdW50U291cmNlT3BlcjogbnVtYmVyXHJcbiAgdHJhbnNPcGVyOiBudW1iZXJcclxuXHJcbiAgZ2V0IHR5cGUoKSB7XHJcbiAgICByZXR1cm4gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW3RoaXMuZGVzdGluYXRpb25PcGVyXVxyXG4gIH1cclxuXHJcbiAgZ2V0IGlzRW5kKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlT3BlciA9PT0gMCAmJiBcclxuICAgICAgdGhpcy5kZXN0aW5hdGlvbk9wZXIgPT09IDAgJiZcclxuICAgICAgdGhpcy52YWx1ZSA9PT0gMCAmJlxyXG4gICAgICB0aGlzLmFtb3VudFNvdXJjZU9wZXIgPT09IDAgJiZcclxuICAgICAgdGhpcy4gdHJhbnNPcGVyID09PSAwXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgTW9kdWxhdG9yTGlzdCgpXHJcblxyXG4gICAgdC5zb3VyY2VPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQuZGVzdGluYXRpb25PcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzd2l0Y2ggKHQudHlwZSkge1xyXG4gICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgIHQudmFsdWUgPSBSYW5nZVZhbHVlLnBhcnNlKHN0cmVhbSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHQudmFsdWUgPSBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0LmFtb3VudFNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC50cmFuc09wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yTGlzdCB7XHJcbiAgY29kZTogbnVtYmVyXHJcbiAgdmFsdWU6IG51bWJlcnxSYW5nZVZhbHVlXHJcblxyXG4gIGdldCB0eXBlKCkge1xyXG4gICAgcmV0dXJuIEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZVt0aGlzLmNvZGVdXHJcbiAgfVxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb2RlID09PSAwICYmXHJcbiAgICAgIHRoaXMudmFsdWUgPT09IDBcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBHZW5lcmF0b3JMaXN0KClcclxuICAgIHQuY29kZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgc3dpdGNoICh0LnR5cGUpIHtcclxuICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAna2V5UmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICd2ZWxSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICB0LnZhbHVlID0gUmFuZ2VWYWx1ZS5wYXJzZShzdHJlYW0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0LnZhbHVlID0gc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnQge1xyXG4gIGluc3RydW1lbnROYW1lOiBzdHJpbmdcclxuICBpbnN0cnVtZW50QmFnSW5kZXg6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnN0cnVtZW50TmFtZSA9PT0gXCJFT0lcIlxyXG4gIH1cclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudCgpXHJcbiAgICB0Lmluc3RydW1lbnROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICB0Lmluc3RydW1lbnRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnRCYWcge1xyXG4gIGluc3RydW1lbnRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4OiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudEJhZygpXHJcbiAgICB0Lmluc3RydW1lbnRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0Lmluc3RydW1lbnRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNhbXBsZUhlYWRlciB7XHJcbiAgc2FtcGxlTmFtZTogc3RyaW5nXHJcbiAgc3RhcnQ6IG51bWJlclxyXG4gIGVuZDogbnVtYmVyXHJcbiAgbG9vcFN0YXJ0OiBudW1iZXJcclxuICBsb29wRW5kOiBudW1iZXJcclxuICBzYW1wbGVSYXRlOiBudW1iZXJcclxuICBvcmlnaW5hbFBpdGNoOiBudW1iZXJcclxuICBwaXRjaENvcnJlY3Rpb246IG51bWJlclxyXG4gIHNhbXBsZUxpbms6IG51bWJlclxyXG4gIHNhbXBsZVR5cGU6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zYW1wbGVOYW1lID09PSBcIkVPU1wiXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHMgPSBuZXcgU2FtcGxlSGVhZGVyKClcclxuXHJcbiAgICBzLnNhbXBsZU5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHMuc3RhcnQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuZW5kID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmxvb3BTdGFydCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5sb29wRW5kID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLnNhbXBsZVJhdGUgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMub3JpZ2luYWxQaXRjaCA9IHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICBzLnBpdGNoQ29ycmVjdGlvbiA9IHN0cmVhbS5yZWFkSW50OCgpXHJcbiAgICBzLnNhbXBsZUxpbmsgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcy5zYW1wbGVUeXBlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzLmxvb3BTdGFydCAtPSBzLnN0YXJ0XHJcbiAgICBzLmxvb3BFbmQgLT0gcy5zdGFydFxyXG5cclxuICAgIHJldHVybiBzXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgU2FtcGxlTGluayA9IHtcclxuICBtb25vU2FtcGxlOiAxLFxyXG4gIHJpZ2h0U2FtcGxlOiAyLFxyXG4gIGxlZnRTYW1wbGU6IDQsXHJcbiAgbGlua2VkU2FtcGxlOiA4LFxyXG4gIFJvbU1vbm9TYW1wbGU6IDB4ODAwMSxcclxuICBSb21SaWdodFNhbXBsZTogMHg4MDAyLFxyXG4gIFJvbUxlZnRTYW1wbGU6IDB4ODAwNCxcclxuICBSb21MaW5rZWRTYW1wbGU6IDB4ODAwOFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TdHJ1Y3RzLnRzIiwiaW1wb3J0IHsgcGFyc2VSaWZmLCBDaHVuaywgT3B0aW9ucyBhcyBSaWZmUGFyc2VyT3B0aW9ucyB9IGZyb20gXCIuL1JpZmZQYXJzZXJcIlxyXG5pbXBvcnQgeyBQcmVzZXRIZWFkZXIsIFNhbXBsZUhlYWRlciwgUHJlc2V0QmFnLCBJbnN0cnVtZW50LCBJbnN0cnVtZW50QmFnLCBNb2R1bGF0b3JMaXN0LCBHZW5lcmF0b3JMaXN0LCBJbmZvIH0gZnJvbSBcIi4vU3RydWN0c1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VSZXN1bHQge1xyXG4gIHByZXNldEhlYWRlcnM6IFByZXNldEhlYWRlcltdXHJcbiAgcHJlc2V0Wm9uZTogUHJlc2V0QmFnW11cclxuICBwcmVzZXRNb2R1bGF0b3JzOiBNb2R1bGF0b3JMaXN0W11cclxuICBwcmVzZXRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50czogSW5zdHJ1bWVudFtdXHJcbiAgaW5zdHJ1bWVudFpvbmU6IEluc3RydW1lbnRCYWdbXVxyXG4gIGluc3RydW1lbnRNb2R1bGF0b3JzOiBNb2R1bGF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50R2VuZXJhdG9yczogR2VuZXJhdG9yTGlzdFtdXHJcbiAgc2FtcGxlSGVhZGVyczogU2FtcGxlSGVhZGVyW11cclxuICBzYW1wbGVzOiBJbnQxNkFycmF5W11cclxuICBzYW1wbGluZ0RhdGE6IENodW5rXHJcbiAgaW5mbzogSW5mb1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZShpbnB1dDogVWludDhBcnJheSwgb3B0aW9uOiBSaWZmUGFyc2VyT3B0aW9ucyA9IHt9KTogUGFyc2VSZXN1bHQge1xyXG5cclxuICAvLyBwYXJzZSBSSUZGIGNodW5rXHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gcGFyc2VSaWZmKGlucHV0LCAwLCBpbnB1dC5sZW5ndGgsIG9wdGlvbilcclxuXHJcbiAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignd3JvbmcgY2h1bmsgbGVuZ3RoJylcclxuICB9XHJcblxyXG4gIGNvbnN0IGNodW5rID0gY2h1bmtMaXN0WzBdXHJcbiAgaWYgKGNodW5rID09PSBudWxsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NodW5rIG5vdCBmb3VuZCcpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZVJpZmZDaHVuayhjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJSSUZGXCIsIFwic2Zia1wiKVxyXG5cclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzZmJrIHN0cnVjdHVyZScpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gSU5GTy1saXN0XHJcbiAgICAgIGluZm86IHBhcnNlSW5mb0xpc3QoY2h1bmtMaXN0WzBdLCBkYXRhKSxcclxuXHJcbiAgICAgIC8vIHNkdGEtbGlzdFxyXG4gICAgICBzYW1wbGluZ0RhdGE6IHBhcnNlU2R0YUxpc3QoY2h1bmtMaXN0WzFdLCBkYXRhKSxcclxuXHJcbiAgICAgIC8vIHBkdGEtbGlzdFxyXG4gICAgICAuLi5wYXJzZVBkdGFMaXN0KGNodW5rTGlzdFsyXSwgZGF0YSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlUGR0YUxpc3QoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcInBkdGFcIilcclxuXHJcbiAgICAvLyBjaGVjayBudW1iZXIgb2YgY2h1bmtzXHJcbiAgICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gOSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGR0YSBjaHVuaycpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcHJlc2V0SGVhZGVyczogcGFyc2VQaGRyKGNodW5rTGlzdFswXSwgZGF0YSksXHJcbiAgICAgIHByZXNldFpvbmU6IHBhcnNlUGJhZyhjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRNb2R1bGF0b3JzOiBwYXJzZVBtb2QoY2h1bmtMaXN0WzJdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0R2VuZXJhdG9yczogcGFyc2VQZ2VuKGNodW5rTGlzdFszXSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRzOiBwYXJzZUluc3QoY2h1bmtMaXN0WzRdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudFpvbmU6IHBhcnNlSWJhZyhjaHVua0xpc3RbNV0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50TW9kdWxhdG9yczogcGFyc2VJbW9kKGNodW5rTGlzdFs2XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRHZW5lcmF0b3JzOiBwYXJzZUlnZW4oY2h1bmtMaXN0WzddLCBkYXRhKSxcclxuICAgICAgc2FtcGxlSGVhZGVyczogcGFyc2VTaGRyKGNodW5rTGlzdFs4XSwgZGF0YSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmlmZkNodW5rKGNodW5rLCBpbnB1dClcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIC4uLnJlc3VsdCxcclxuICAgIHNhbXBsZXM6IGxvYWRTYW1wbGUocmVzdWx0LnNhbXBsZUhlYWRlcnMsIHJlc3VsdC5zYW1wbGluZ0RhdGEub2Zmc2V0LCBpbnB1dClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgZXhwZWN0ZWRUeXBlLCBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSBleHBlY3RlZFR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcblxyXG4gIC8vIGNoZWNrIHNpZ25hdHVyZVxyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgaWYgKHNpZ25hdHVyZSAhPT0gZXhwZWN0ZWRTaWduYXR1cmUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaWduYXR1cmU6JyArIHNpZ25hdHVyZSlcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcmV0dXJuIHBhcnNlUmlmZihkYXRhLCBzdHJlYW0uaXAsIGNodW5rLnNpemUgLSA0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUluZm9MaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwiSU5GT1wiKVxyXG4gIHJldHVybiBJbmZvLnBhcnNlKGRhdGEsIGNodW5rTGlzdClcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpOiBDaHVuayB7XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJzZHRhXCIpXHJcblxyXG4gIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAxKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RPRE8nKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFswXVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rPFQ+KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSwgdHlwZTogc3RyaW5nLCBjbGF6ejogeyBwYXJzZTogKHN0cmVhbTogU3RyZWFtKSA9PiBUIH0sIHRlcm1pbmF0ZT86IChvYmo6IFQpID0+IGJvb2xlYW4pOiBUW10ge1xyXG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW11cclxuXHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IHR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgICsgY2h1bmsudHlwZSlcclxuICB9XHJcbiAgXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcbiAgY29uc3Qgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemVcclxuICBcclxuICB3aGlsZSAoc3RyZWFtLmlwIDwgc2l6ZSkge1xyXG4gICAgY29uc3Qgb2JqID0gY2xhenoucGFyc2Uoc3RyZWFtKVxyXG4gICAgaWYgKHRlcm1pbmF0ZSAmJiB0ZXJtaW5hdGUob2JqKSkge1xyXG4gICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgcmVzdWx0LnB1c2gob2JqKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5jb25zdCBwYXJzZVBoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGhkclwiLCBQcmVzZXRIZWFkZXIsIHAgPT4gcC5pc0VuZClcclxuY29uc3QgcGFyc2VQYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBiYWdcIiwgUHJlc2V0QmFnKVxyXG5jb25zdCBwYXJzZUluc3QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW5zdFwiLCBJbnN0cnVtZW50LCBpID0+IGkuaXNFbmQpXHJcbmNvbnN0IHBhcnNlSWJhZyA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpYmFnXCIsIEluc3RydW1lbnRCYWcpXHJcbmNvbnN0IHBhcnNlUG1vZCA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwbW9kXCIsIE1vZHVsYXRvckxpc3QsIG0gPT4gbS5pc0VuZClcclxuY29uc3QgcGFyc2VJbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImltb2RcIiwgTW9kdWxhdG9yTGlzdCwgbSA9PiBtLmlzRW5kKVxyXG5jb25zdCBwYXJzZVBnZW4gPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGdlblwiLCBHZW5lcmF0b3JMaXN0LCBnID0+IGcuaXNFbmQpXHJcbmNvbnN0IHBhcnNlSWdlbiA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpZ2VuXCIsIEdlbmVyYXRvckxpc3QsIGcgPT4gZy5pc0VuZClcclxuY29uc3QgcGFyc2VTaGRyID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInNoZHJcIiwgU2FtcGxlSGVhZGVyLCBzID0+IHMuaXNFbmQpXHJcblxyXG5mdW5jdGlvbiBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgc2FtcGxlUmF0ZSkge1xyXG4gIGxldCBtdWx0aXBseSA9IDFcclxuXHJcbiAgLy8gYnVmZmVyXHJcbiAgd2hpbGUgKHNhbXBsZVJhdGUgPCAyMjA1MCkge1xyXG4gICAgY29uc3QgbmV3U2FtcGxlID0gbmV3IEludDE2QXJyYXkoc2FtcGxlLmxlbmd0aCAqIDIpXHJcbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDAsIGlsID0gc2FtcGxlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgIH1cclxuICAgIHNhbXBsZSA9IG5ld1NhbXBsZVxyXG4gICAgbXVsdGlwbHkgKj0gMlxyXG4gICAgc2FtcGxlUmF0ZSAqPSAyXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2FtcGxlLFxyXG4gICAgbXVsdGlwbHlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTYW1wbGUoc2FtcGxlSGVhZGVyOiBTYW1wbGVIZWFkZXJbXSwgc2FtcGxpbmdEYXRhT2Zmc2V0OiBudW1iZXIsIGRhdGE6IFVpbnQ4QXJyYXkpOiBJbnQxNkFycmF5W10ge1xyXG4gIHJldHVybiBzYW1wbGVIZWFkZXIubWFwKGhlYWRlciA9PiB7XHJcbiAgICBsZXQgc2FtcGxlID0gbmV3IEludDE2QXJyYXkobmV3IFVpbnQ4QXJyYXkoZGF0YS5zdWJhcnJheShcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLnN0YXJ0ICogMixcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLmVuZCAgICogMlxyXG4gICAgKSkuYnVmZmVyKVxyXG4gICAgaWYgKGhlYWRlci5zYW1wbGVSYXRlID4gMCkge1xyXG4gICAgICBjb25zdCBhZGp1c3QgPSBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgaGVhZGVyLnNhbXBsZVJhdGUpXHJcbiAgICAgIHNhbXBsZSA9IGFkanVzdC5zYW1wbGVcclxuICAgICAgaGVhZGVyLnNhbXBsZVJhdGUgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5sb29wU3RhcnQgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5sb29wRW5kICo9IGFkanVzdC5tdWx0aXBseVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNhbXBsZVxyXG4gIH0pXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGFyc2VyLnRzIiwiaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9TdHJlYW1cIlxyXG5cclxuZnVuY3Rpb24gcGFyc2VDaHVuayhpbnB1dDogVWludDhBcnJheSwgaXA6IG51bWJlciwgYmlnRW5kaWFuOiBib29sZWFuKTogQ2h1bmsge1xyXG4gIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oaW5wdXQsIGlwKVxyXG4gIGNvbnN0IHR5cGUgPSBzdHJlYW0ucmVhZFN0cmluZyg0KVxyXG4gIGNvbnN0IHNpemUgPSBzdHJlYW0ucmVhZERXT1JEKGJpZ0VuZGlhbilcclxuICByZXR1cm4gbmV3IENodW5rKHR5cGUsIHNpemUsIHN0cmVhbS5pcClcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcclxuICBwYWRkaW5nPzogYm9vbGVhbixcclxuICBiaWdFbmRpYW4/OiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJpZmYoaW5wdXQ6IFVpbnQ4QXJyYXksIGluZGV4OiBudW1iZXIgPSAwLCBsZW5ndGg6IG51bWJlciwgeyBwYWRkaW5nID0gdHJ1ZSwgYmlnRW5kaWFuID0gZmFsc2UgfTogT3B0aW9ucyA9IHt9KSB7XHJcbiAgY29uc3QgY2h1bmtMaXN0OiBDaHVua1tdID0gW11cclxuICBjb25zdCBlbmQgPSBsZW5ndGggKyBpbmRleFxyXG4gIGxldCBpcCA9IGluZGV4XHJcblxyXG4gIHdoaWxlIChpcCA8IGVuZCkge1xyXG4gICAgY29uc3QgY2h1bmsgPSBwYXJzZUNodW5rKGlucHV0LCBpcCwgYmlnRW5kaWFuKVxyXG4gICAgaXAgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplXHJcbiAgICBcclxuICAgIC8vIHBhZGRpbmdcclxuICAgIGlmIChwYWRkaW5nICYmICgoaXAgLSBpbmRleCkgJiAxKSA9PT0gMSkge1xyXG4gICAgICBpcCsrXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNodW5rTGlzdC5wdXNoKGNodW5rKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2h1bmsge1xyXG4gIHR5cGU6IHN0cmluZ1xyXG4gIHNpemU6IG51bWJlclxyXG4gIG9mZnNldDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgdGhpcy5zaXplID0gc2l6ZVxyXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JpZmZQYXJzZXIudHMiLCJleHBvcnQgY29uc3QgR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlID0gW1xyXG4gICdzdGFydEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kQWRkcnNPZmZzZXQnLFxyXG4gICdzdGFydGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ2VuZGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1BpdGNoJyxcclxuICAndmliTGZvVG9QaXRjaCcsXHJcbiAgJ21vZEVudlRvUGl0Y2gnLFxyXG4gICdpbml0aWFsRmlsdGVyRmMnLFxyXG4gICdpbml0aWFsRmlsdGVyUScsXHJcbiAgJ21vZExmb1RvRmlsdGVyRmMnLFxyXG4gICdtb2RFbnZUb0ZpbHRlckZjJyxcclxuICAnZW5kQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1ZvbHVtZScsXHJcbiAgdW5kZWZpbmVkLCAvLyAxNFxyXG4gICdjaG9ydXNFZmZlY3RzU2VuZCcsXHJcbiAgJ3JldmVyYkVmZmVjdHNTZW5kJyxcclxuICAncGFuJyxcclxuICB1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCwgLy8gMTgsMTksMjBcclxuICAnZGVsYXlNb2RMRk8nLFxyXG4gICdmcmVxTW9kTEZPJyxcclxuICAnZGVsYXlWaWJMRk8nLFxyXG4gICdmcmVxVmliTEZPJyxcclxuICAnZGVsYXlNb2RFbnYnLFxyXG4gICdhdHRhY2tNb2RFbnYnLFxyXG4gICdob2xkTW9kRW52JyxcclxuICAnZGVjYXlNb2RFbnYnLFxyXG4gICdzdXN0YWluTW9kRW52JyxcclxuICAncmVsZWFzZU1vZEVudicsXHJcbiAgJ2tleW51bVRvTW9kRW52SG9sZCcsXHJcbiAgJ2tleW51bVRvTW9kRW52RGVjYXknLFxyXG4gICdkZWxheVZvbEVudicsXHJcbiAgJ2F0dGFja1ZvbEVudicsXHJcbiAgJ2hvbGRWb2xFbnYnLFxyXG4gICdkZWNheVZvbEVudicsXHJcbiAgJ3N1c3RhaW5Wb2xFbnYnLFxyXG4gICdyZWxlYXNlVm9sRW52JyxcclxuICAna2V5bnVtVG9Wb2xFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Wb2xFbnZEZWNheScsXHJcbiAgJ2luc3RydW1lbnQnLFxyXG4gIHVuZGVmaW5lZCwgLy8gNDJcclxuICAna2V5UmFuZ2UnLFxyXG4gICd2ZWxSYW5nZScsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAna2V5bnVtJyxcclxuICAndmVsb2NpdHknLFxyXG4gICdpbml0aWFsQXR0ZW51YXRpb24nLFxyXG4gIHVuZGVmaW5lZCwgLy8gNDlcclxuICAnZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnY29hcnNlVHVuZScsXHJcbiAgJ2ZpbmVUdW5lJyxcclxuICAnc2FtcGxlSUQnLFxyXG4gICdzYW1wbGVNb2RlcycsXHJcbiAgdW5kZWZpbmVkLCAvLyA1NVxyXG4gICdzY2FsZVR1bmluZycsXHJcbiAgJ2V4Y2x1c2l2ZUNsYXNzJyxcclxuICAnb3ZlcnJpZGluZ1Jvb3RLZXknXHJcbl1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbnN0YW50cy50cyIsImltcG9ydCB7IFBhcnNlUmVzdWx0IH0gZnJvbSBcIi4vUGFyc2VyXCJcclxuaW1wb3J0IHsgUmFuZ2VWYWx1ZSwgR2VuZXJhdG9yTGlzdCB9IGZyb20gXCIuL1N0cnVjdHNcIlxyXG5cclxuLyoqXHJcbiAqIFBhcnNlciDjgafoqq3jgb/ovrzjgpPjgaDjgrXjgqbjg7Pjg4njg5Xjgqnjg7Pjg4jjga7jg4fjg7zjgr/jgpJcclxuICogU3ludGhlc2l6ZXIg44GL44KJ5Yip55So44GX44KE44GZ44GE5b2i44Gr44GZ44KL44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb3VuZEZvbnQge1xyXG4gIHByaXZhdGUgcGFyc2VkOiBQYXJzZVJlc3VsdFxyXG5cclxuICBjb25zdHJ1Y3RvcihwYXJzZWQ6IFBhcnNlUmVzdWx0KSB7XHJcbiAgICB0aGlzLnBhcnNlZCA9IHBhcnNlZFxyXG4gIH1cclxuXHJcbiAgZ2V0UHJlc2V0Wm9uZShwcmVzZXRIZWFkZXJJbmRleDogbnVtYmVyKSB7XHJcbiAgICBsZXQgcHJlc2V0R2VuZXJhdG9yczogR2VuZXJhdG9yTGlzdFtdXHJcbiAgICBjb25zdCBwcmVzZXRIZWFkZXIgPSB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzW3ByZXNldEhlYWRlckluZGV4XVxyXG4gICAgY29uc3QgcHJlc2V0QmFnID0gdGhpcy5wYXJzZWQucHJlc2V0Wm9uZVtwcmVzZXRIZWFkZXIucHJlc2V0QmFnSW5kZXhdXHJcblxyXG4gICAgY29uc3QgbmV4dFByZXNldEhlYWRlckluZGV4ID0gcHJlc2V0SGVhZGVySW5kZXggKyAxXHJcbiAgICBpZiAobmV4dFByZXNldEhlYWRlckluZGV4IDwgdGhpcy5wYXJzZWQucHJlc2V0SGVhZGVycy5sZW5ndGgpIHtcclxuICAgICAgLy8g5qyh44GuIHByZXNldCDjgb7jgafjga7jgZnjgbnjgabjga4gZ2VuZXJhdG9yIOOCkuWPluW+l+OBmeOCi1xyXG4gICAgICBjb25zdCBuZXh0UHJlc2V0SGVhZGVyID0gdGhpcy5wYXJzZWQucHJlc2V0SGVhZGVyc1tuZXh0UHJlc2V0SGVhZGVySW5kZXhdXHJcbiAgICAgIGNvbnN0IG5leHRQcmVzZXRCYWcgPSB0aGlzLnBhcnNlZC5wcmVzZXRab25lW25leHRQcmVzZXRIZWFkZXIucHJlc2V0QmFnSW5kZXhdXHJcbiAgICAgIHByZXNldEdlbmVyYXRvcnMgPSB0aGlzLnBhcnNlZC5wcmVzZXRHZW5lcmF0b3JzLnNsaWNlKHByZXNldEJhZy5wcmVzZXRHZW5lcmF0b3JJbmRleCwgbmV4dFByZXNldEJhZy5wcmVzZXRHZW5lcmF0b3JJbmRleClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIOacgOW+jOOBriBwcmVzZXQg44Gg44Gj44Gf5aC05ZCI44Gv5pyA5b6M44G+44Gn5Y+W5b6X44GZ44KLXHJcbiAgICAgIHByZXNldEdlbmVyYXRvcnMgPSB0aGlzLnBhcnNlZC5wcmVzZXRHZW5lcmF0b3JzLnNsaWNlKHByZXNldEJhZy5wcmVzZXRHZW5lcmF0b3JJbmRleCwgdGhpcy5wYXJzZWQucHJlc2V0R2VuZXJhdG9ycy5sZW5ndGgpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHByZXNldEdlbmVyYXRvcnNcclxuICB9XHJcblxyXG4gIGdldEluc3RydW1lbnRab25lKGluc3RydW1lbnRab25lSW5kZXg6IG51bWJlcikge1xyXG4gICAgY29uc3QgaW5zdHJ1bWVudEJhZyA9IHRoaXMucGFyc2VkLmluc3RydW1lbnRab25lW2luc3RydW1lbnRab25lSW5kZXhdXHJcbiAgICBjb25zdCBuZXh0SW5zdHJ1bWVudEJhZyA9IHRoaXMucGFyc2VkLmluc3RydW1lbnRab25lW2luc3RydW1lbnRab25lSW5kZXggKyAxXVxyXG4gICAgY29uc3QgZ2VuZXJhdG9ySW5kZXggPSBpbnN0cnVtZW50QmFnLmluc3RydW1lbnRHZW5lcmF0b3JJbmRleFxyXG4gICAgY29uc3QgbmV4dEdlbmVyYXRvckluZGV4ID0gbmV4dEluc3RydW1lbnRCYWcgPyBuZXh0SW5zdHJ1bWVudEJhZy5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXggOiB0aGlzLnBhcnNlZC5pbnN0cnVtZW50R2VuZXJhdG9ycy5sZW5ndGhcclxuICAgIGNvbnN0IGdlbmVyYXRvcnMgPSB0aGlzLnBhcnNlZC5pbnN0cnVtZW50R2VuZXJhdG9ycy5zbGljZShnZW5lcmF0b3JJbmRleCwgbmV4dEdlbmVyYXRvckluZGV4KVxyXG4gICAgcmV0dXJuIGNyZWF0ZUluc3RydW1lbnRab25lKGdlbmVyYXRvcnMpXHJcbiAgfVxyXG5cclxuICBnZXRJbnN0cnVtZW50Wm9uZUluZGV4ZXMoaW5zdHJ1bWVudElEOiBudW1iZXIpOiBudW1iZXJbXSB7XHJcbiAgICBjb25zdCBpbnN0cnVtZW50ID0gdGhpcy5wYXJzZWQuaW5zdHJ1bWVudHNbaW5zdHJ1bWVudElEXVxyXG4gICAgY29uc3QgbmV4dEluc3RydW1lbnQgPSB0aGlzLnBhcnNlZC5pbnN0cnVtZW50c1tpbnN0cnVtZW50SUQgKyAxXVxyXG4gICAgcmV0dXJuIGFycmF5UmFuZ2UoaW5zdHJ1bWVudC5pbnN0cnVtZW50QmFnSW5kZXgsIG5leHRJbnN0cnVtZW50ID8gbmV4dEluc3RydW1lbnQuaW5zdHJ1bWVudEJhZ0luZGV4IDogdGhpcy5wYXJzZWQuaW5zdHJ1bWVudFpvbmUubGVuZ3RoKVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5zdHJ1bWVudEtleShiYW5rTnVtYmVyLCBpbnN0cnVtZW50TnVtYmVyLCBrZXksIHZlbG9jaXR5ID0gMTAwKTogTm90ZUluZm98bnVsbCB7XHJcbiAgICBjb25zdCBwcmVzZXRIZWFkZXJJbmRleCA9IHRoaXMucGFyc2VkLnByZXNldEhlYWRlcnMuZmluZEluZGV4KHAgPT4gcC5wcmVzZXQgPT09IGluc3RydW1lbnROdW1iZXIgJiYgcC5iYW5rID09PSBiYW5rTnVtYmVyKVxyXG4gICAgXHJcbiAgICBpZiAocHJlc2V0SGVhZGVySW5kZXggPCAwKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcInByZXNldCBub3QgZm91bmQ6IGJhbms9JXMgaW5zdHJ1bWVudD0lc1wiLCBiYW5rTnVtYmVyLCBpbnN0cnVtZW50TnVtYmVyKVxyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByZXNldEdlbmVyYXRvcnMgPSB0aGlzLmdldFByZXNldFpvbmUocHJlc2V0SGVhZGVySW5kZXgpXHJcblxyXG4gICAgLy8gTGFzdCBQcmVzZXQgR2VuZXJhdG9yIG11c3QgYmUgaW5zdHJ1bWVudFxyXG4gICAgY29uc3QgbGFzdFByZXNldEdlbmVydG9yID0gcHJlc2V0R2VuZXJhdG9yc1twcmVzZXRHZW5lcmF0b3JzLmxlbmd0aCAtIDFdXHJcbiAgICBpZiAobGFzdFByZXNldEdlbmVydG9yLnR5cGUgIT09IFwiaW5zdHJ1bWVudFwiIHx8IE51bWJlcihsYXN0UHJlc2V0R2VuZXJ0b3IudmFsdWUpID09PSBOYU4pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTb3VuZEZvbnQ6IGludmFsaWQgcHJlc2V0IGdlbmVyYXRvcjogZXhwZWN0IGluc3RydW1lbnRcIilcclxuICAgIH1cclxuICAgIGNvbnN0IGluc3RydW1lbnRJRCA9IGxhc3RQcmVzZXRHZW5lcnRvci52YWx1ZSBhcyBudW1iZXJcclxuICAgIGNvbnN0IGluc3RydW1lbnRab25lcyA9IHRoaXMuZ2V0SW5zdHJ1bWVudFpvbmVJbmRleGVzKGluc3RydW1lbnRJRCkubWFwKGkgPT4gdGhpcy5nZXRJbnN0cnVtZW50Wm9uZShpKSlcclxuXHJcbiAgICAvLyDmnIDliJ3jga7jgr7jg7zjg7PjgYxzYW1wbGVJRCDjgpLmjIHjgZ/jgarjgZHjgozjgbAgZ2xvYmFsIGluc3RydW1lbnQgem9uZVxyXG4gICAgbGV0IGdsb2JhbEluc3RydW1lbnRab25lOiBhbnl8dW5kZWZpbmVkXHJcbiAgICBjb25zdCBmaXJzdEluc3RydW1lbnRab25lID0gaW5zdHJ1bWVudFpvbmVzWzBdXHJcbiAgICBpZiAoZmlyc3RJbnN0cnVtZW50Wm9uZS5zYW1wbGVJRCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGdsb2JhbEluc3RydW1lbnRab25lID0gaW5zdHJ1bWVudFpvbmVzWzBdXHJcbiAgICB9XHJcblxyXG4gICAgLy8ga2V5UmFuZ2Ug44GoIHZlbFJhbmdlIOOBjOODnuODg+ODgeOBl+OBpuOBhOOCiyBHZW5lcmF0b3Ig44KS5o6i44GZXHJcbiAgICBjb25zdCBpbnN0cnVtZW50Wm9uZSA9IGluc3RydW1lbnRab25lcy5maW5kKGkgPT4ge1xyXG4gICAgICBpZiAoaSA9PT0gZ2xvYmFsSW5zdHJ1bWVudFpvbmUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2UgLy8gZ2xvYmFsIHpvbmUg44KS6Zmk5aSWXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBpc0luS2V5UmFuZ2UgPSBmYWxzZVxyXG4gICAgICBpZiAoaS5rZXlSYW5nZSkge1xyXG4gICAgICAgIGlzSW5LZXlSYW5nZSA9IGtleSA+PSBpLmtleVJhbmdlLmxvICYmIGtleSA8PSBpLmtleVJhbmdlLmhpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBpc0luVmVsUmFuZ2UgPSB0cnVlXHJcbiAgICAgIGlmIChpLnZlbFJhbmdlKSB7XHJcbiAgICAgICAgaXNJblZlbFJhbmdlID0gdmVsb2NpdHkgPj0gaS52ZWxSYW5nZS5sbyAmJiB2ZWxvY2l0eSA8PSBpLnZlbFJhbmdlLmhpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBpc0luS2V5UmFuZ2UgJiYgaXNJblZlbFJhbmdlXHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICBpZiAoIWluc3RydW1lbnRab25lKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcImluc3RydW1lbnQgbm90IGZvdW5kOiBiYW5rPSVzIGluc3RydW1lbnQ9JXNcIiwgYmFua051bWJlciwgaW5zdHJ1bWVudE51bWJlcilcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW5zdHJ1bWVudFpvbmUuc2FtcGxlSUQgPT09IHVuZGVmaW5lZCkgeyBcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTb3VuZEZvbnQ6IHNhbXBsZUlEIG5vdCBmb3VuZFwiKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBnZW4gPSB7Li4uZGVmYXVsdEluc3RydW1lbnRab25lLCAuLi5yZW1vdmVVbmRlZmluZWQoZ2xvYmFsSW5zdHJ1bWVudFpvbmUgfHwge30pLCAuLi5yZW1vdmVVbmRlZmluZWQoaW5zdHJ1bWVudFpvbmUpfVxyXG5cclxuICAgIGNvbnN0IHNhbXBsZSA9IHRoaXMucGFyc2VkLnNhbXBsZXNbZ2VuLnNhbXBsZUlEIV1cclxuICAgIGNvbnN0IHNhbXBsZUhlYWRlciA9IHRoaXMucGFyc2VkLnNhbXBsZUhlYWRlcnNbZ2VuLnNhbXBsZUlEIV1cclxuICAgIGNvbnN0IHR1bmUgPSBnZW4uY29hcnNlVHVuZSArIGdlbi5maW5lVHVuZSAvIDEwMFxyXG4gICAgY29uc3QgYmFzZVBpdGNoID0gdHVuZSArIChzYW1wbGVIZWFkZXIucGl0Y2hDb3JyZWN0aW9uIC8gMTAwKSAtIChnZW4ub3ZlcnJpZGluZ1Jvb3RLZXkgfHwgc2FtcGxlSGVhZGVyLm9yaWdpbmFsUGl0Y2gpXHJcbiAgICBjb25zdCBzY2FsZVR1bmluZyA9IGdlbi5zY2FsZVR1bmluZyAvIDEwMFxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNhbXBsZSxcclxuICAgICAgc2FtcGxlUmF0ZTogc2FtcGxlSGVhZGVyLnNhbXBsZVJhdGUsXHJcbiAgICAgIHNhbXBsZU5hbWU6IHNhbXBsZUhlYWRlci5zYW1wbGVOYW1lLFxyXG4gICAgICBzY2FsZVR1bmluZyxcclxuICAgICAgcGxheWJhY2tSYXRlOiAoa2V5KSA9PiBNYXRoLnBvdyhNYXRoLnBvdygyLCAxIC8gMTIpLCAoa2V5ICsgYmFzZVBpdGNoKSAqIHNjYWxlVHVuaW5nKSxcclxuICAgICAga2V5UmFuZ2U6IGdlbi5rZXlSYW5nZSxcclxuICAgICAgdmVsUmFuZ2U6IGdlbi52ZWxSYW5nZSxcclxuICAgICAgdm9sQXR0YWNrOiBjb252ZXJ0VGltZShnZW4udm9sQXR0YWNrKSxcclxuICAgICAgdm9sRGVjYXk6IGNvbnZlcnRUaW1lKGdlbi52b2xEZWNheSksXHJcbiAgICAgIHZvbFN1c3RhaW46IGdlbi52b2xTdXN0YWluIC8gMTAwMCxcclxuICAgICAgdm9sUmVsZWFzZTogY29udmVydFRpbWUoZ2VuLnZvbFJlbGVhc2UpLFxyXG4gICAgICBtb2RBdHRhY2s6IGNvbnZlcnRUaW1lKGdlbi5tb2RBdHRhY2spLFxyXG4gICAgICBtb2REZWNheTogY29udmVydFRpbWUoZ2VuLm1vZERlY2F5KSxcclxuICAgICAgbW9kU3VzdGFpbjogZ2VuLm1vZFN1c3RhaW4gLyAxMDAwLFxyXG4gICAgICBtb2RSZWxlYXNlOiBjb252ZXJ0VGltZShnZW4ubW9kUmVsZWFzZSksXHJcbiAgICAgIG1vZEVudlRvUGl0Y2g6IGdlbi5tb2RFbnZUb1BpdGNoIC8gMTAwLCAvLyBjZW50XHJcbiAgICAgIG1vZEVudlRvRmlsdGVyRmM6IGdlbi5tb2RFbnZUb0ZpbHRlckZjLCAvLyBzZW1pdG9uZSAoMTAwIGNlbnQpXHJcbiAgICAgIGluaXRpYWxGaWx0ZXJROiBnZW4uaW5pdGlhbEZpbHRlclEsXHJcbiAgICAgIGluaXRpYWxGaWx0ZXJGYzogZ2VuLmluaXRpYWxGaWx0ZXJGYyxcclxuICAgICAgZnJlcVZpYkxGTzogZ2VuLmZyZXFWaWJMRk8gPyBjb252ZXJ0VGltZShnZW4uZnJlcVZpYkxGTykgKiA4LjE3NiA6IHVuZGVmaW5lZCxcclxuICAgICAgc3RhcnQ6IGdlbi5zdGFydEFkZHJzQ29hcnNlT2Zmc2V0ICogMzI3NjggKyBnZW4uc3RhcnRBZGRyc09mZnNldCxcclxuICAgICAgZW5kOiBnZW4uZW5kQWRkcnNDb2Fyc2VPZmZzZXQgKiAzMjc2OCArIGdlbi5lbmRBZGRyc09mZnNldCxcclxuICAgICAgbG9vcFN0YXJ0OiAoXHJcbiAgICAgICAgc2FtcGxlSGVhZGVyLmxvb3BTdGFydCArXHJcbiAgICAgICAgZ2VuLnN0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0ICogMzI3NjggK1xyXG4gICAgICAgIGdlbi5zdGFydGxvb3BBZGRyc09mZnNldFxyXG4gICAgICApLFxyXG4gICAgICBsb29wRW5kOiAoXHJcbiAgICAgICAgc2FtcGxlSGVhZGVyLmxvb3BFbmQgK1xyXG4gICAgICAgIGdlbi5lbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQgKiAzMjc2OCArXHJcbiAgICAgICAgZ2VuLmVuZGxvb3BBZGRyc09mZnNldFxyXG4gICAgICApLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gcHJlc2V0TmFtZXNbYmFua051bWJlcl1bcHJlc2V0TnVtYmVyXSA9IHByZXNldE5hbWVcclxuICBnZXRQcmVzZXROYW1lcygpIHtcclxuICAgIGNvbnN0IGJhbms6IHtbaW5kZXg6IG51bWJlcl06IHtbaW5kZXg6IG51bWJlcl06IHN0cmluZ319ID0ge31cclxuICAgIHRoaXMucGFyc2VkLnByZXNldEhlYWRlcnMuZm9yRWFjaChwcmVzZXQgPT4ge1xyXG4gICAgICBpZiAoIWJhbmtbcHJlc2V0LmJhbmtdKSB7XHJcbiAgICAgICAgYmFua1twcmVzZXQuYmFua10gPSB7fVxyXG4gICAgICB9XHJcbiAgICAgIGJhbmtbcHJlc2V0LmJhbmtdW3ByZXNldC5wcmVzZXRdID0gcHJlc2V0LnByZXNldE5hbWVcclxuICAgIH0pXHJcbiAgICByZXR1cm4gYmFua1xyXG4gIH1cclxufVxyXG5cclxuLy8gdmFsdWUgPSAxMjAwbG9nMihzZWMpIOOBp+ihqOOBleOCjOOCi+aZgumWk+OCkuenkuWNmOS9jeOBq+WkieaPm+OBmeOCi1xyXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRpbWUodmFsdWUpIHtcclxuICByZXR1cm4gTWF0aC5wb3coMiwgdmFsdWUgLyAxMjAwKVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVVbmRlZmluZWQob2JqKSB7XHJcbiAgY29uc3QgcmVzdWx0ID0ge31cclxuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcclxuICAgIGlmIChvYmpba2V5XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlc3VsdFtrZXldID0gb2JqW2tleV1cclxuICAgIH1cclxuICB9KVxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuZnVuY3Rpb24gYXJyYXlSYW5nZShzdGFydCwgZW5kKSB7XHJcbiAgcmV0dXJuIEFycmF5LmZyb20oe2xlbmd0aDogZW5kIC0gc3RhcnR9LCAoXywgaykgPT4gayArIHN0YXJ0KTtcclxufVxyXG5cclxuLy8g44Gy44Go44Gk44GuIGluc3RydW1lbnQg44Gr5a++5b+c44GZ44KLIEdlbmVyYXRvciDjga7phY3liJfjgYvjgonkvb/jgYTjgoTjgZnjgY/jgZfjgZ/jgqrjg5bjgrjjgqfjgq/jg4jjgpLov5TjgZlcclxuZnVuY3Rpb24gY3JlYXRlSW5zdHJ1bWVudFpvbmUoaW5zdHJ1bWVudEdlbmVyYXRvcnM6IEdlbmVyYXRvckxpc3RbXSkge1xyXG4gIGZ1bmN0aW9uIGdldFZhbHVlKHR5cGU6IHN0cmluZyk6IG51bWJlcnx1bmRlZmluZWQge1xyXG4gICAgY29uc3QgZ2VuZXJhdG9yID0gaW5zdHJ1bWVudEdlbmVyYXRvcnMuZmluZChnID0+IGcudHlwZSA9PT0gdHlwZSlcclxuICAgIGlmICghZ2VuZXJhdG9yKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWRcclxuICAgIH1cclxuICAgIGlmIChOdW1iZXIoZ2VuZXJhdG9yLnZhbHVlKSA9PT0gTmFOKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInNvbWV0aGluZyB3cm9uZ1wiKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGdlbmVyYXRvci52YWx1ZSBhcyBudW1iZXJcclxuICB9XHJcbiAgXHJcbiAgLy8gRmlyc3QgSW5zdHJ1bWVudCBHZW5lcmF0b3IgbXVzdCBiZSBrZXlSYW5nZVxyXG4gIGNvbnN0IGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvciA9IGluc3RydW1lbnRHZW5lcmF0b3JzWzBdXHJcbiAgbGV0IGtleVJhbmdlOiBSYW5nZVZhbHVlfHVuZGVmaW5lZFxyXG4gIGlmIChmaXJzdEluc3RydW1lbnRHZW5lcmF0b3IgJiYgZmlyc3RJbnN0cnVtZW50R2VuZXJhdG9yLnR5cGUgPT09IFwia2V5UmFuZ2VcIikge1xyXG4gICAgaWYgKCEoZmlyc3RJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGluc3RhbmNlb2YgUmFuZ2VWYWx1ZSkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTb3VuZEZvbnQ6IGtleVJhbmdlIGlzIG5vdCByYW5nZWQgdmFsdWVcIilcclxuICAgIH1cclxuICAgIGtleVJhbmdlID0gZmlyc3RJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGFzIFJhbmdlVmFsdWVcclxuICB9XHJcblxyXG4gIC8vIFNlY29uZCBJbnN0cnVtZW50IEdlbmVyYXRvciBjb3VsZCBiZSB2ZWxSYW5nZVxyXG4gIGNvbnN0IHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IgPSBpbnN0cnVtZW50R2VuZXJhdG9yc1sxXVxyXG4gIGxldCB2ZWxSYW5nZTogUmFuZ2VWYWx1ZXx1bmRlZmluZWRcclxuICBpZiAoc2Vjb25kSW5zdHJ1bWVudEdlbmVyYXRvciAmJiBzZWNvbmRJbnN0cnVtZW50R2VuZXJhdG9yLnR5cGUgPT09IFwidmVsUmFuZ2VcIikge1xyXG4gICAgaWYgKCEoc2Vjb25kSW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSBpbnN0YW5jZW9mIFJhbmdlVmFsdWUpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiB2ZWxSYW5nZSBpcyBub3QgcmFuZ2VkIHZhbHVlXCIpXHJcbiAgICB9XHJcbiAgICB2ZWxSYW5nZSA9IHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUgYXMgUmFuZ2VWYWx1ZVxyXG4gIH1cclxuXHJcbiAgLy8gTGFzdCBJbnN0cnVtZW50IEdlbmVyYXRvciBtdXN0IGJlIHNhbXBsZUlEXHJcbiAgY29uc3QgbGFzdEluc3RydW1lbnRHZW5lcmF0b3IgPSBpbnN0cnVtZW50R2VuZXJhdG9yc1tpbnN0cnVtZW50R2VuZXJhdG9ycy5sZW5ndGggLSAxXVxyXG4gIGxldCBzYW1wbGVJRDogbnVtYmVyfHVuZGVmaW5lZFxyXG4gIGlmIChsYXN0SW5zdHJ1bWVudEdlbmVyYXRvciAmJiBsYXN0SW5zdHJ1bWVudEdlbmVyYXRvci50eXBlID09PSBcInNhbXBsZUlEXCIpIHtcclxuICAgIGlmIChOdW1iZXIobGFzdEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUpID09PSBOYU4pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTb3VuZEZvbnQ6IHNhbXBsZUlEIGlzIG5vdCBudW1iZXJcIilcclxuICAgIH1cclxuICAgIHNhbXBsZUlEID0gbGFzdEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUgYXMgbnVtYmVyXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAga2V5UmFuZ2UsIC8vIOOBguOCi+OBr+OBmuOBoOOBjCBnbG9iYWwgem9uZSDjgavjga/nhKHjgYTjgYvjgoLjgZfjgozjgarjgYRcclxuICAgIHZlbFJhbmdlLCAvLyBvcHRpb25hbFxyXG4gICAgc2FtcGxlSUQsIC8vIGdsb2JhbCB6b25lIOOBruWgtOWQiOOBoOOBkeOBquOBhFxyXG4gICAgdm9sQXR0YWNrOiBnZXRWYWx1ZShcImF0dGFja1ZvbEVudlwiKSxcclxuICAgIHZvbERlY2F5OiBnZXRWYWx1ZShcImRlY2F5Vm9sRW52XCIpLFxyXG4gICAgdm9sU3VzdGFpbjogZ2V0VmFsdWUoXCJzdXN0YWluVm9sRW52XCIpLFxyXG4gICAgdm9sUmVsZWFzZTogZ2V0VmFsdWUoXCJyZWxlYXNlVm9sRW52XCIpLFxyXG4gICAgbW9kQXR0YWNrOiBnZXRWYWx1ZShcImF0dGFja01vZEVudlwiKSxcclxuICAgIG1vZERlY2F5OiBnZXRWYWx1ZShcImRlY2F5TW9kRW52XCIpLFxyXG4gICAgbW9kU3VzdGFpbjogZ2V0VmFsdWUoXCJzdXN0YWluTW9kRW52XCIpLFxyXG4gICAgbW9kUmVsZWFzZTogZ2V0VmFsdWUoXCJyZWxlYXNlTW9kRW52XCIpLFxyXG4gICAgbW9kRW52VG9QaXRjaDogZ2V0VmFsdWUoXCJtb2RFbnZUb1BpdGNoXCIpLFxyXG4gICAgbW9kRW52VG9GaWx0ZXJGYzogZ2V0VmFsdWUoXCJtb2RFbnZUb0ZpbHRlckZjXCIpLFxyXG4gICAgY29hcnNlVHVuZTogZ2V0VmFsdWUoXCJjb2Fyc2VUdW5lXCIpLFxyXG4gICAgZmluZVR1bmU6IGdldFZhbHVlKFwiZmluZVR1bmVcIiksXHJcbiAgICBzY2FsZVR1bmluZzogZ2V0VmFsdWUoXCJzY2FsZVR1bmluZ1wiKSxcclxuICAgIGZyZXFWaWJMRk86IGdldFZhbHVlKFwiZnJlcVZpYkxGT1wiKSxcclxuICAgIHN0YXJ0QWRkcnNPZmZzZXQ6IGdldFZhbHVlKFwic3RhcnRBZGRyc09mZnNldFwiKSxcclxuICAgIHN0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQ6IGdldFZhbHVlKFwic3RhcnRBZGRyc0NvYXJzZU9mZnNldFwiKSxcclxuICAgIGVuZEFkZHJzT2Zmc2V0OiBnZXRWYWx1ZShcImVuZEFkZHJzT2Zmc2V0XCIpLFxyXG4gICAgZW5kQWRkcnNDb2Fyc2VPZmZzZXQ6IGdldFZhbHVlKFwiZW5kQWRkcnNDb2Fyc2VPZmZzZXRcIiksXHJcbiAgICBzdGFydGxvb3BBZGRyc09mZnNldDogZ2V0VmFsdWUoXCJzdGFydGxvb3BBZGRyc09mZnNldFwiKSxcclxuICAgIHN0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0OiBnZXRWYWx1ZShcInN0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0XCIpLFxyXG4gICAgZW5kbG9vcEFkZHJzT2Zmc2V0OiBnZXRWYWx1ZShcImVuZGxvb3BBZGRyc09mZnNldFwiKSxcclxuICAgIGVuZGxvb3BBZGRyc0NvYXJzZU9mZnNldDogZ2V0VmFsdWUoXCJlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXRcIiksXHJcbiAgICBvdmVycmlkaW5nUm9vdEtleTogZ2V0VmFsdWUoXCJvdmVycmlkaW5nUm9vdEtleVwiKSxcclxuICAgIGluaXRpYWxGaWx0ZXJROiBnZXRWYWx1ZShcImluaXRpYWxGaWx0ZXJRXCIpLFxyXG4gICAgaW5pdGlhbEZpbHRlckZjOiBnZXRWYWx1ZShcImluaXRpYWxGaWx0ZXJGY1wiKSxcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRJbnN0cnVtZW50Wm9uZSA9IHtcclxuICBrZXlSYW5nZTogbmV3IFJhbmdlVmFsdWUoMCwgMTI3KSxcclxuICB2ZWxSYW5nZTogbmV3IFJhbmdlVmFsdWUoMCwgMTI3KSxcclxuICBzYW1wbGVJRDogdW5kZWZpbmVkLFxyXG4gIHZvbEF0dGFjazogLTEyMDAwLFxyXG4gIHZvbERlY2F5OiAtMTIwMDAsXHJcbiAgdm9sU3VzdGFpbjogMCxcclxuICB2b2xSZWxlYXNlOiAtMTIwMDAsXHJcbiAgbW9kQXR0YWNrOiAtMTIwMDAsXHJcbiAgbW9kRGVjYXk6IC0xMjAwMCxcclxuICBtb2RTdXN0YWluOiAwLFxyXG4gIG1vZFJlbGVhc2U6IDAsXHJcbiAgbW9kRW52VG9QaXRjaDogMCxcclxuICBtb2RFbnZUb0ZpbHRlckZjOiAwLFxyXG4gIGNvYXJzZVR1bmU6IDAsXHJcbiAgZmluZVR1bmU6IDAsXHJcbiAgc2NhbGVUdW5pbmc6IDEwMCxcclxuICBmcmVxVmliTEZPOiAwLFxyXG4gIHN0YXJ0QWRkcnNPZmZzZXQ6IDAsXHJcbiAgc3RhcnRBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBlbmRBZGRyc09mZnNldDogMCxcclxuICBlbmRBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBzdGFydGxvb3BBZGRyc09mZnNldDogMCxcclxuICBzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBlbmRsb29wQWRkcnNPZmZzZXQ6IDAsXHJcbiAgZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0OiAwLFxyXG4gIG92ZXJyaWRpbmdSb290S2V5OiB1bmRlZmluZWQsXHJcbiAgaW5pdGlhbEZpbHRlclE6IDEsXHJcbiAgaW5pdGlhbEZpbHRlckZjOiAxMzUwMCxcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOb3RlSW5mbyB7XHJcbiAgc2FtcGxlOiBJbnQxNkFycmF5XHJcbiAgc2FtcGxlUmF0ZTogbnVtYmVyXHJcbiAgc2FtcGxlTmFtZTogc3RyaW5nXHJcbiAgc3RhcnQ6IG51bWJlclxyXG4gIGVuZDogbnVtYmVyXHJcbiAgc2NhbGVUdW5pbmc6IG51bWJlclxyXG4gIHBsYXliYWNrUmF0ZTogRnVuY3Rpb25cclxuICBsb29wU3RhcnQ6IG51bWJlclxyXG4gIGxvb3BFbmQ6IG51bWJlclxyXG4gIHZvbEF0dGFjazogbnVtYmVyXHJcbiAgdm9sRGVjYXk6IG51bWJlclxyXG4gIHZvbFN1c3RhaW46IG51bWJlclxyXG4gIHZvbFJlbGVhc2U6IG51bWJlclxyXG4gIG1vZEF0dGFjazogbnVtYmVyXHJcbiAgbW9kRGVjYXk6IG51bWJlclxyXG4gIG1vZFN1c3RhaW46IG51bWJlclxyXG4gIG1vZFJlbGVhc2U6IG51bWJlclxyXG4gIG1vZEVudlRvUGl0Y2g6IG51bWJlclxyXG4gIG1vZEVudlRvRmlsdGVyRmM6IG51bWJlclxyXG4gIGluaXRpYWxGaWx0ZXJGYzogbnVtYmVyXHJcbiAgaW5pdGlhbEZpbHRlclE6IG51bWJlclxyXG4gIGZyZXFWaWJMRk86IG51bWJlcnx1bmRlZmluZWRcclxuICBrZXlSYW5nZTogUmFuZ2VWYWx1ZVxyXG4gIHZlbFJhbmdlOiBSYW5nZVZhbHVlfHVuZGVmaW5lZFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Tb3VuZEZvbnQudHMiLCJpbXBvcnQgcGFyc2UgZnJvbSBcIi4uL3NyYy9QYXJzZXIudHNcIlxyXG5pbXBvcnQgU291bmRGb250IGZyb20gXCIuLi9zcmMvU291bmRGb250LnRzXCJcclxuXHJcbmV4cG9ydCB7XHJcbiAgcGFyc2UsXHJcbiAgU291bmRGb250XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXhwb3J0L3BhcnNlci5qcyJdLCJzb3VyY2VSb290IjoiIn0=