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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_Parser_ts__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_SoundFont_ts__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return __WEBPACK_IMPORTED_MODULE_0__src_Parser_ts__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SoundFont", function() { return __WEBPACK_IMPORTED_MODULE_1__src_SoundFont_ts__["a"]; });





/***/ }),
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
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


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5NjEyNTdiYzRkYWE3YzNkZmJjNiIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9TdHJ1Y3RzLnRzIiwid2VicGFjazovLy8uL3NyYy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JpZmZQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvcGFyc2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9Tb3VuZEZvbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3RGM7SUFJWixZQUFZLElBQUksRUFBRSxNQUFNO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSTtRQUNoQixJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU07SUFDbEIsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFZO1FBQ3JCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUM7UUFDekYsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDMUMsRUFBRSxDQUFDLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQztRQUNwQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUc7SUFDWixDQUFDO0lBRUQsUUFBUTtRQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELFNBQVMsQ0FBQyxZQUFxQixLQUFLO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZCxNQUFNLENBQUMsQ0FDTCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUU7Z0JBQzFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUN2QixLQUFLLENBQUM7UUFDVCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsQ0FDTCxJQUFJLENBQUMsSUFBSSxDQUFDLElB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LEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsNERBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDNUYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsQ0FBQztBQUNqRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwrREFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMvRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwrREFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMvRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwrREFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMvRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwrREFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMvRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1B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aEIsVUFBVSxFQUFFLENBQUM7SUFDYixVQUFVLEVBQUUsQ0FBQztJQUNiLGFBQWEsRUFBRSxDQUFDO0lBQ2hCLGdCQUFnQixFQUFFLENBQUM7SUFDbkIsVUFBVSxFQUFFLENBQUM7SUFDYixRQUFRLEVBQUUsQ0FBQztJQUNYLFdBQVcsRUFBRSxHQUFHO0lBQ2hCLFVBQVUsRUFBRSxDQUFDO0lBQ2IsZ0JBQWdCLEVBQUUsQ0FBQztJQUNuQixzQkFBc0IsRUFBRSxDQUFDO0lBQ3pCLGNBQWMsRUFBRSxDQUFDO0lBQ2pCLG9CQUFvQixFQUFFLENBQUM7SUFDdkIsb0JBQW9CLEVBQUUsQ0FBQztJQUN2QiwwQkFBMEIsRUFBRSxDQUFDO0lBQzdCLGtCQUFrQixFQUFFLENBQUM7SUFDckIsd0JBQXdCLEVBQUUsQ0FBQztJQUMzQixpQkFBaUIsRUFBRSxTQUFTO0lBQzVCLGNBQWMsRUFBRSxDQUFDO0lBQ2pCLGVBQWUsRUFBRSxLQUFLO0NBQ3ZCIiwiZmlsZSI6InNmMi5wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5NjEyNTdiYzRkYWE3YzNkZmJjNiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XHJcbiAgcHJpdmF0ZSBkYXRhOiBVaW50OEFycmF5XHJcbiAgaXA6IG51bWJlclxyXG5cclxuICBjb25zdHJ1Y3RvcihkYXRhLCBvZmZzZXQpIHtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGFcclxuICAgIHRoaXMuaXAgPSBvZmZzZXRcclxuICB9XHJcblxyXG4gIHJlYWRTdHJpbmcoc2l6ZTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0ciA9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgdGhpcy5kYXRhLnN1YmFycmF5KHRoaXMuaXAsIHRoaXMuaXAgKz0gc2l6ZSkpXHJcbiAgICBjb25zdCBudWxsTG9jYXRpb24gPSBzdHIuaW5kZXhPZihcIlxcdTAwMDBcIilcclxuICAgIGlmIChudWxsTG9jYXRpb24gPiAwKSB7XHJcbiAgICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIG51bGxMb2NhdGlvbilcclxuICAgIH1cclxuICAgIHJldHVybiBzdHJcclxuICB9XHJcblxyXG4gIHJlYWRXT1JEKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXArK10gfCAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOClcclxuICB9XHJcblxyXG4gIHJlYWREV09SRChiaWdFbmRpYW46IGJvb2xlYW4gPSBmYWxzZSk6IG51bWJlciB7XHJcbiAgICBpZiAoYmlnRW5kaWFuKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMjR8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAxNikgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOCkgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10pXHJcbiAgICAgICkgPj4+IDBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5kYXRhW3RoaXMuaXArK10gfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOCkgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMTYpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDI0KVxyXG4gICAgICApID4+PiAwXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWFkQnl0ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCsrXVxyXG4gIH1cclxuXHJcbiAgcmVhZEF0KG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXAgKyBvZmZzZXRdXHJcbiAgfVxyXG5cclxuICAvKiBoZWxwZXIgKi9cclxuXHJcbiAgcmVhZFVJbnQ4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZEJ5dGUoKVxyXG4gIH1cclxuICBcclxuICByZWFkSW50OCgpIHtcclxuICAgIHJldHVybiAodGhpcy5yZWFkQnl0ZSgpIDw8IDI0KSA+PiAyNFxyXG4gIH1cclxuICBcclxuICByZWFkVUludDE2KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZFdPUkQoKVxyXG4gIH1cclxuXHJcbiAgcmVhZEludDE2KCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnJlYWRXT1JEKCkgPDwgMTYpID4+IDE2XHJcbiAgfVxyXG5cclxuICByZWFkVUludDMyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZERXT1JEKClcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N0cmVhbS50cyIsImltcG9ydCB7IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZSB9IGZyb20gXCIuL0NvbnN0YW50c1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuaW1wb3J0IHsgQ2h1bmsgfSBmcm9tIFwiLi9SaWZmUGFyc2VyXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJzaW9uVGFnIHtcclxuICBtYWpvcjogbnVtYmVyXHJcbiAgbWlub3I6IG51bWJlclxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdiA9IG5ldyBWZXJzaW9uVGFnKClcclxuICAgIHYubWFqb3IgPSBzdHJlYW0ucmVhZEludDgoKVxyXG4gICAgdi5taW5vciA9IHN0cmVhbS5yZWFkSW50OCgpXHJcbiAgICByZXR1cm4gdlxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluZm8ge1xyXG4gIGNvbW1lbnQ6IHN0cmluZ3xudWxsXHJcbiAgY29weXJpZ2h0OiBzdHJpbmd8bnVsbFxyXG4gIGNyZWF0aW9uRGF0ZTogc3RyaW5nfG51bGxcclxuICBlbmdpbmVlcjogc3RyaW5nfG51bGxcclxuICBuYW1lOiBzdHJpbmdcclxuICBwcm9kdWN0OiBzdHJpbmd8bnVsbFxyXG4gIHNvZnR3YXJlOiBzdHJpbmd8bnVsbFxyXG4gIHZlcnNpb246IFZlcnNpb25UYWdcclxuICBzb3VuZEVuZ2luZTogc3RyaW5nfG51bGxcclxuICByb21OYW1lOiBzdHJpbmd8bnVsbFxyXG4gIHJvbVZlcnNpb246IFZlcnNpb25UYWd8bnVsbFxyXG5cclxuICAvLyBMSVNUIC0gSU5GTyDjga7lhajjgabjga4gY2h1bmtcclxuICBzdGF0aWMgcGFyc2UoZGF0YTogVWludDhBcnJheSwgY2h1bmtzOiBDaHVua1tdKSB7XHJcbiAgICBmdW5jdGlvbiBnZXRDaHVuayh0eXBlKSB7XHJcbiAgICAgIHJldHVybiBjaHVua3MuZmluZChjID0+IGMudHlwZSA9PT0gdHlwZSkgXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9TdHJlYW0oY2h1bmspIHtcclxuICAgICAgcmV0dXJuIG5ldyBTdHJlYW0oZGF0YSwgY2h1bmsub2Zmc2V0KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlYWRTdHJpbmcodHlwZSkge1xyXG4gICAgICBjb25zdCBjaHVuayA9IGdldENodW5rKHR5cGUpXHJcbiAgICAgIGlmICghY2h1bmspIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0b1N0cmVhbShjaHVuaykhLnJlYWRTdHJpbmcoY2h1bmsuc2l6ZSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWFkVmVyc2lvblRhZyh0eXBlKSB7XHJcbiAgICAgIGNvbnN0IGNodW5rID0gZ2V0Q2h1bmsodHlwZSlcclxuICAgICAgaWYgKCFjaHVuaykge1xyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFZlcnNpb25UYWcucGFyc2UodG9TdHJlYW0oY2h1bmspKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBpbmZvID0gbmV3IEluZm8oKVxyXG4gICAgaW5mby5jb21tZW50ID0gcmVhZFN0cmluZyhcIklDTVRcIilcclxuICAgIGluZm8uY29weXJpZ2h0ID0gcmVhZFN0cmluZyhcIklDT1BcIilcclxuICAgIGluZm8uY3JlYXRpb25EYXRlID0gcmVhZFN0cmluZyhcIklDUkRcIilcclxuICAgIGluZm8uZW5naW5lZXIgPSByZWFkU3RyaW5nKFwiSUVOR1wiKVxyXG4gICAgaW5mby5uYW1lID0gcmVhZFN0cmluZyhcIklOQU1cIikhXHJcbiAgICBpbmZvLnByb2R1Y3QgPSByZWFkU3RyaW5nKFwiSVBSRFwiKVxyXG4gICAgaW5mby5zb2Z0d2FyZSA9IHJlYWRTdHJpbmcoXCJJU0ZUXCIpXHJcbiAgICBpbmZvLnZlcnNpb24gPSByZWFkVmVyc2lvblRhZyhcImlmaWxcIikhXHJcbiAgICBpbmZvLnNvdW5kRW5naW5lID0gcmVhZFN0cmluZyhcImlzbmdcIilcclxuICAgIGluZm8ucm9tTmFtZSA9IHJlYWRTdHJpbmcoXCJpcm9tXCIpXHJcbiAgICBpbmZvLnJvbVZlcnNpb24gPSByZWFkVmVyc2lvblRhZyhcIml2ZXJcIilcclxuICAgIHJldHVybiBpbmZvXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlc2V0SGVhZGVyIHtcclxuICBwcmVzZXROYW1lOiBzdHJpbmdcclxuICBwcmVzZXQ6IG51bWJlclxyXG4gIGJhbms6IG51bWJlclxyXG4gIHByZXNldEJhZ0luZGV4OiBudW1iZXJcclxuICBsaWJyYXJ5OiBudW1iZXJcclxuICBnZW5yZTogbnVtYmVyXHJcbiAgbW9ycGhvbG9neTogbnVtYmVyXHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnByZXNldE5hbWUgPT09IFwiRU9QXCJcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBQcmVzZXRIZWFkZXIoKVxyXG4gICAgcC5wcmVzZXROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICBwLnByZXNldCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLmJhbmsgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLmxpYnJhcnkgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHAuZ2VucmUgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHAubW9ycGhvbG9neSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcmV0dXJuIHBcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcmVzZXRCYWcge1xyXG4gIHByZXNldEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBwcmVzZXRNb2R1bGF0b3JJbmRleDogbnVtYmVyXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBQcmVzZXRCYWcoKVxyXG4gICAgcC5wcmVzZXRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLnByZXNldE1vZHVsYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmFuZ2VWYWx1ZSB7XHJcbiAgbG86IG51bWJlclxyXG4gIGhpOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IobG86IG51bWJlciwgaGk6IG51bWJlcikge1xyXG4gICAgdGhpcy5sbyA9IGxvXHJcbiAgICB0aGlzLmhpID0gaGlcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgcmV0dXJuIG5ldyBSYW5nZVZhbHVlKFxyXG4gICAgICBzdHJlYW0ucmVhZEJ5dGUoKSwgXHJcbiAgICAgIHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kdWxhdG9yTGlzdCB7XHJcbiAgc291cmNlT3BlcjogbnVtYmVyXHJcbiAgZGVzdGluYXRpb25PcGVyOiBudW1iZXJcclxuICB2YWx1ZTogbnVtYmVyfFJhbmdlVmFsdWVcclxuICBhbW91bnRTb3VyY2VPcGVyOiBudW1iZXJcclxuICB0cmFuc09wZXI6IG51bWJlclxyXG5cclxuICBnZXQgdHlwZSgpIHtcclxuICAgIHJldHVybiBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGVbdGhpcy5kZXN0aW5hdGlvbk9wZXJdXHJcbiAgfVxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2VPcGVyID09PSAwICYmIFxyXG4gICAgICB0aGlzLmRlc3RpbmF0aW9uT3BlciA9PT0gMCAmJlxyXG4gICAgICB0aGlzLnZhbHVlID09PSAwICYmXHJcbiAgICAgIHRoaXMuYW1vdW50U291cmNlT3BlciA9PT0gMCAmJlxyXG4gICAgICB0aGlzLiB0cmFuc09wZXIgPT09IDBcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBNb2R1bGF0b3JMaXN0KClcclxuXHJcbiAgICB0LnNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC5kZXN0aW5hdGlvbk9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHN3aXRjaCAodC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ2tleVJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAndmVsUmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICdrZXludW0nOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICd2ZWxvY2l0eSc6XHJcbiAgICAgICAgdC52YWx1ZSA9IFJhbmdlVmFsdWUucGFyc2Uoc3RyZWFtKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdC52YWx1ZSA9IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHQuYW1vdW50U291cmNlT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0LnRyYW5zT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHZW5lcmF0b3JMaXN0IHtcclxuICBjb2RlOiBudW1iZXJcclxuICB2YWx1ZTogbnVtYmVyfFJhbmdlVmFsdWVcclxuXHJcbiAgZ2V0IHR5cGUoKSB7XHJcbiAgICByZXR1cm4gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW3RoaXMuY29kZV1cclxuICB9XHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmNvZGUgPT09IDAgJiZcclxuICAgICAgdGhpcy52YWx1ZSA9PT0gMFxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IEdlbmVyYXRvckxpc3QoKVxyXG4gICAgdC5jb2RlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzd2l0Y2ggKHQudHlwZSkge1xyXG4gICAgICBjYXNlICdrZXludW0nOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgIHQudmFsdWUgPSBSYW5nZVZhbHVlLnBhcnNlKHN0cmVhbSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHQudmFsdWUgPSBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudCB7XHJcbiAgaW5zdHJ1bWVudE5hbWU6IHN0cmluZ1xyXG4gIGluc3RydW1lbnRCYWdJbmRleDogbnVtYmVyXHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmluc3RydW1lbnROYW1lID09PSBcIkVPSVwiXHJcbiAgfVxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBJbnN0cnVtZW50KClcclxuICAgIHQuaW5zdHJ1bWVudE5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHQuaW5zdHJ1bWVudEJhZ0luZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudEJhZyB7XHJcbiAgaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBpbnN0cnVtZW50TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBJbnN0cnVtZW50QmFnKClcclxuICAgIHQuaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQuaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2FtcGxlSGVhZGVyIHtcclxuICBzYW1wbGVOYW1lOiBzdHJpbmdcclxuICBzdGFydDogbnVtYmVyXHJcbiAgZW5kOiBudW1iZXJcclxuICBsb29wU3RhcnQ6IG51bWJlclxyXG4gIGxvb3BFbmQ6IG51bWJlclxyXG4gIHNhbXBsZVJhdGU6IG51bWJlclxyXG4gIG9yaWdpbmFsUGl0Y2g6IG51bWJlclxyXG4gIHBpdGNoQ29ycmVjdGlvbjogbnVtYmVyXHJcbiAgc2FtcGxlTGluazogbnVtYmVyXHJcbiAgc2FtcGxlVHlwZTogbnVtYmVyXHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnNhbXBsZU5hbWUgPT09IFwiRU9TXCJcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcyA9IG5ldyBTYW1wbGVIZWFkZXIoKVxyXG5cclxuICAgIHMuc2FtcGxlTmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcy5zdGFydCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5lbmQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMubG9vcFN0YXJ0ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmxvb3BFbmQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuc2FtcGxlUmF0ZSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5vcmlnaW5hbFBpdGNoID0gc3RyZWFtLnJlYWRCeXRlKClcclxuICAgIHMucGl0Y2hDb3JyZWN0aW9uID0gc3RyZWFtLnJlYWRJbnQ4KClcclxuICAgIHMuc2FtcGxlTGluayA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBzLnNhbXBsZVR5cGUgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHMubG9vcFN0YXJ0IC09IHMuc3RhcnRcclxuICAgIHMubG9vcEVuZCAtPSBzLnN0YXJ0XHJcblxyXG4gICAgcmV0dXJuIHNcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBTYW1wbGVMaW5rID0ge1xyXG4gIG1vbm9TYW1wbGU6IDEsXHJcbiAgcmlnaHRTYW1wbGU6IDIsXHJcbiAgbGVmdFNhbXBsZTogNCxcclxuICBsaW5rZWRTYW1wbGU6IDgsXHJcbiAgUm9tTW9ub1NhbXBsZTogMHg4MDAxLFxyXG4gIFJvbVJpZ2h0U2FtcGxlOiAweDgwMDIsXHJcbiAgUm9tTGVmdFNhbXBsZTogMHg4MDA0LFxyXG4gIFJvbUxpbmtlZFNhbXBsZTogMHg4MDA4XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N0cnVjdHMudHMiLCJpbXBvcnQgeyBwYXJzZVJpZmYsIENodW5rLCBPcHRpb25zIGFzIFJpZmZQYXJzZXJPcHRpb25zIH0gZnJvbSBcIi4vUmlmZlBhcnNlclwiXHJcbmltcG9ydCB7IFByZXNldEhlYWRlciwgU2FtcGxlSGVhZGVyLCBQcmVzZXRCYWcsIEluc3RydW1lbnQsIEluc3RydW1lbnRCYWcsIE1vZHVsYXRvckxpc3QsIEdlbmVyYXRvckxpc3QsIEluZm8gfSBmcm9tIFwiLi9TdHJ1Y3RzXCJcclxuaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9TdHJlYW1cIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQYXJzZVJlc3VsdCB7XHJcbiAgcHJlc2V0SGVhZGVyczogUHJlc2V0SGVhZGVyW11cclxuICBwcmVzZXRab25lOiBQcmVzZXRCYWdbXVxyXG4gIHByZXNldE1vZHVsYXRvcnM6IE1vZHVsYXRvckxpc3RbXVxyXG4gIHByZXNldEdlbmVyYXRvcnM6IEdlbmVyYXRvckxpc3RbXVxyXG4gIGluc3RydW1lbnRzOiBJbnN0cnVtZW50W11cclxuICBpbnN0cnVtZW50Wm9uZTogSW5zdHJ1bWVudEJhZ1tdXHJcbiAgaW5zdHJ1bWVudE1vZHVsYXRvcnM6IE1vZHVsYXRvckxpc3RbXVxyXG4gIGluc3RydW1lbnRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W11cclxuICBzYW1wbGVIZWFkZXJzOiBTYW1wbGVIZWFkZXJbXVxyXG4gIHNhbXBsZXM6IEludDE2QXJyYXlbXVxyXG4gIHNhbXBsaW5nRGF0YTogQ2h1bmtcclxuICBpbmZvOiBJbmZvXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlKGlucHV0OiBVaW50OEFycmF5LCBvcHRpb246IFJpZmZQYXJzZXJPcHRpb25zID0ge30pOiBQYXJzZVJlc3VsdCB7XHJcblxyXG4gIC8vIHBhcnNlIFJJRkYgY2h1bmtcclxuICBjb25zdCBjaHVua0xpc3QgPSBwYXJzZVJpZmYoaW5wdXQsIDAsIGlucHV0Lmxlbmd0aCwgb3B0aW9uKVxyXG5cclxuICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBjaHVuayBsZW5ndGgnKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2h1bmsgPSBjaHVua0xpc3RbMF1cclxuICBpZiAoY2h1bmsgPT09IG51bGwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignY2h1bmsgbm90IGZvdW5kJylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlUmlmZkNodW5rKGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gICAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIlJJRkZcIiwgXCJzZmJrXCIpXHJcblxyXG4gICAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDMpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNmYmsgc3RydWN0dXJlJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAvLyBJTkZPLWxpc3RcclxuICAgICAgaW5mbzogcGFyc2VJbmZvTGlzdChjaHVua0xpc3RbMF0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gc2R0YS1saXN0XHJcbiAgICAgIHNhbXBsaW5nRGF0YTogcGFyc2VTZHRhTGlzdChjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gcGR0YS1saXN0XHJcbiAgICAgIC4uLnBhcnNlUGR0YUxpc3QoY2h1bmtMaXN0WzJdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VQZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwicGR0YVwiKVxyXG5cclxuICAgIC8vIGNoZWNrIG51bWJlciBvZiBjaHVua3NcclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSA5KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwZHRhIGNodW5rJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwcmVzZXRIZWFkZXJzOiBwYXJzZVBoZHIoY2h1bmtMaXN0WzBdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0Wm9uZTogcGFyc2VQYmFnKGNodW5rTGlzdFsxXSwgZGF0YSksXHJcbiAgICAgIHByZXNldE1vZHVsYXRvcnM6IHBhcnNlUG1vZChjaHVua0xpc3RbMl0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRHZW5lcmF0b3JzOiBwYXJzZVBnZW4oY2h1bmtMaXN0WzNdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudHM6IHBhcnNlSW5zdChjaHVua0xpc3RbNF0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50Wm9uZTogcGFyc2VJYmFnKGNodW5rTGlzdFs1XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRNb2R1bGF0b3JzOiBwYXJzZUltb2QoY2h1bmtMaXN0WzZdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudEdlbmVyYXRvcnM6IHBhcnNlSWdlbihjaHVua0xpc3RbN10sIGRhdGEpLFxyXG4gICAgICBzYW1wbGVIZWFkZXJzOiBwYXJzZVNoZHIoY2h1bmtMaXN0WzhdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVzdWx0ID0gcGFyc2VSaWZmQ2h1bmsoY2h1bmssIGlucHV0KVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgLi4ucmVzdWx0LFxyXG4gICAgc2FtcGxlczogbG9hZFNhbXBsZShyZXN1bHQuc2FtcGxlSGVhZGVycywgcmVzdWx0LnNhbXBsaW5nRGF0YS5vZmZzZXQsIGlucHV0KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBleHBlY3RlZFR5cGUsIGV4cGVjdGVkU2lnbmF0dXJlKSB7XHJcbiAgLy8gY2hlY2sgcGFyc2UgdGFyZ2V0XHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyArIGNodW5rLnR5cGUpXHJcbiAgfVxyXG5cclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuXHJcbiAgLy8gY2hlY2sgc2lnbmF0dXJlXHJcbiAgY29uc3Qgc2lnbmF0dXJlID0gc3RyZWFtLnJlYWRTdHJpbmcoNClcclxuICBpZiAoc2lnbmF0dXJlICE9PSBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKVxyXG4gIH1cclxuXHJcbiAgLy8gcmVhZCBzdHJ1Y3R1cmVcclxuICByZXR1cm4gcGFyc2VSaWZmKGRhdGEsIHN0cmVhbS5pcCwgY2h1bmsuc2l6ZSAtIDQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlSW5mb0xpc3QoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJJTkZPXCIpXHJcbiAgcmV0dXJuIEluZm8ucGFyc2UoZGF0YSwgY2h1bmtMaXN0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNkdGFMaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSk6IENodW5rIHtcclxuICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcInNkdGFcIilcclxuXHJcbiAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVE9ETycpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2h1bmtMaXN0WzBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQ2h1bms8VD4oY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5LCB0eXBlOiBzdHJpbmcsIGNsYXp6OiB7IHBhcnNlOiAoc3RyZWFtOiBTdHJlYW0pID0+IFQgfSwgdGVybWluYXRlPzogKG9iajogVCkgPT4gYm9vbGVhbik6IFRbXSB7XHJcbiAgY29uc3QgcmVzdWx0OiBUW10gPSBbXVxyXG5cclxuICBpZiAoY2h1bmsudHlwZSAhPT0gdHlwZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyAgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuICBcclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuICBjb25zdCBzaXplID0gY2h1bmsub2Zmc2V0ICsgY2h1bmsuc2l6ZVxyXG4gIFxyXG4gIHdoaWxlIChzdHJlYW0uaXAgPCBzaXplKSB7XHJcbiAgICBjb25zdCBvYmogPSBjbGF6ei5wYXJzZShzdHJlYW0pXHJcbiAgICBpZiAodGVybWluYXRlICYmIHRlcm1pbmF0ZShvYmopKSB7XHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXN1bHQucHVzaChvYmopXHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmNvbnN0IHBhcnNlUGhkciA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwaGRyXCIsIFByZXNldEhlYWRlciwgcCA9PiBwLmlzRW5kKVxyXG5jb25zdCBwYXJzZVBiYWcgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGJhZ1wiLCBQcmVzZXRCYWcpXHJcbmNvbnN0IHBhcnNlSW5zdCA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpbnN0XCIsIEluc3RydW1lbnQsIGkgPT4gaS5pc0VuZClcclxuY29uc3QgcGFyc2VJYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImliYWdcIiwgSW5zdHJ1bWVudEJhZylcclxuY29uc3QgcGFyc2VQbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBtb2RcIiwgTW9kdWxhdG9yTGlzdCwgbSA9PiBtLmlzRW5kKVxyXG5jb25zdCBwYXJzZUltb2QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW1vZFwiLCBNb2R1bGF0b3JMaXN0LCBtID0+IG0uaXNFbmQpXHJcbmNvbnN0IHBhcnNlUGdlbiA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwZ2VuXCIsIEdlbmVyYXRvckxpc3QsIGcgPT4gZy5pc0VuZClcclxuY29uc3QgcGFyc2VJZ2VuID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImlnZW5cIiwgR2VuZXJhdG9yTGlzdCwgZyA9PiBnLmlzRW5kKVxyXG5jb25zdCBwYXJzZVNoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwic2hkclwiLCBTYW1wbGVIZWFkZXIsIHMgPT4gcy5pc0VuZClcclxuXHJcbmZ1bmN0aW9uIGFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBzYW1wbGVSYXRlKSB7XHJcbiAgbGV0IG11bHRpcGx5ID0gMVxyXG5cclxuICAvLyBidWZmZXJcclxuICB3aGlsZSAoc2FtcGxlUmF0ZSA8IDIyMDUwKSB7XHJcbiAgICBjb25zdCBuZXdTYW1wbGUgPSBuZXcgSW50MTZBcnJheShzYW1wbGUubGVuZ3RoICogMilcclxuICAgIGZvciAobGV0IGkgPSAwLCBqID0gMCwgaWwgPSBzYW1wbGUubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgICBuZXdTYW1wbGVbaisrXSA9IHNhbXBsZVtpXVxyXG4gICAgICBuZXdTYW1wbGVbaisrXSA9IHNhbXBsZVtpXVxyXG4gICAgfVxyXG4gICAgc2FtcGxlID0gbmV3U2FtcGxlXHJcbiAgICBtdWx0aXBseSAqPSAyXHJcbiAgICBzYW1wbGVSYXRlICo9IDJcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzYW1wbGUsXHJcbiAgICBtdWx0aXBseVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFNhbXBsZShzYW1wbGVIZWFkZXI6IFNhbXBsZUhlYWRlcltdLCBzYW1wbGluZ0RhdGFPZmZzZXQ6IG51bWJlciwgZGF0YTogVWludDhBcnJheSk6IEludDE2QXJyYXlbXSB7XHJcbiAgcmV0dXJuIHNhbXBsZUhlYWRlci5tYXAoaGVhZGVyID0+IHtcclxuICAgIGxldCBzYW1wbGUgPSBuZXcgSW50MTZBcnJheShuZXcgVWludDhBcnJheShkYXRhLnN1YmFycmF5KFxyXG4gICAgICBzYW1wbGluZ0RhdGFPZmZzZXQgKyBoZWFkZXIuc3RhcnQgKiAyLFxyXG4gICAgICBzYW1wbGluZ0RhdGFPZmZzZXQgKyBoZWFkZXIuZW5kICAgKiAyXHJcbiAgICApKS5idWZmZXIpXHJcbiAgICBpZiAoaGVhZGVyLnNhbXBsZVJhdGUgPiAwKSB7XHJcbiAgICAgIGNvbnN0IGFkanVzdCA9IGFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBoZWFkZXIuc2FtcGxlUmF0ZSlcclxuICAgICAgc2FtcGxlID0gYWRqdXN0LnNhbXBsZVxyXG4gICAgICBoZWFkZXIuc2FtcGxlUmF0ZSAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgICAgaGVhZGVyLmxvb3BTdGFydCAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgICAgaGVhZGVyLmxvb3BFbmQgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2FtcGxlXHJcbiAgfSlcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QYXJzZXIudHMiLCJpbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rKGlucHV0OiBVaW50OEFycmF5LCBpcDogbnVtYmVyLCBiaWdFbmRpYW46IGJvb2xlYW4pOiBDaHVuayB7XHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShpbnB1dCwgaXApXHJcbiAgY29uc3QgdHlwZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgY29uc3Qgc2l6ZSA9IHN0cmVhbS5yZWFkRFdPUkQoYmlnRW5kaWFuKVxyXG4gIHJldHVybiBuZXcgQ2h1bmsodHlwZSwgc2l6ZSwgc3RyZWFtLmlwKVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnMge1xyXG4gIHBhZGRpbmc/OiBib29sZWFuLFxyXG4gIGJpZ0VuZGlhbj86IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmlmZihpbnB1dDogVWludDhBcnJheSwgaW5kZXg6IG51bWJlciA9IDAsIGxlbmd0aDogbnVtYmVyLCB7IHBhZGRpbmcgPSB0cnVlLCBiaWdFbmRpYW4gPSBmYWxzZSB9OiBPcHRpb25zID0ge30pIHtcclxuICBjb25zdCBjaHVua0xpc3Q6IENodW5rW10gPSBbXVxyXG4gIGNvbnN0IGVuZCA9IGxlbmd0aCArIGluZGV4XHJcbiAgbGV0IGlwID0gaW5kZXhcclxuXHJcbiAgd2hpbGUgKGlwIDwgZW5kKSB7XHJcbiAgICBjb25zdCBjaHVuayA9IHBhcnNlQ2h1bmsoaW5wdXQsIGlwLCBiaWdFbmRpYW4pXHJcbiAgICBpcCA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemVcclxuICAgIFxyXG4gICAgLy8gcGFkZGluZ1xyXG4gICAgaWYgKHBhZGRpbmcgJiYgKChpcCAtIGluZGV4KSAmIDEpID09PSAxKSB7XHJcbiAgICAgIGlwKytcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2h1bmtMaXN0LnB1c2goY2h1bmspXHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2h1bmtMaXN0XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaHVuayB7XHJcbiAgdHlwZTogc3RyaW5nXHJcbiAgc2l6ZTogbnVtYmVyXHJcbiAgb2Zmc2V0OiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgICB0aGlzLnNpemUgPSBzaXplXHJcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldFxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmlmZlBhcnNlci50cyIsImV4cG9ydCBjb25zdCBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgPSBbXHJcbiAgJ3N0YXJ0QWRkcnNPZmZzZXQnLFxyXG4gICdlbmRBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kbG9vcEFkZHJzT2Zmc2V0JyxcclxuICAnc3RhcnRBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ21vZExmb1RvUGl0Y2gnLFxyXG4gICd2aWJMZm9Ub1BpdGNoJyxcclxuICAnbW9kRW52VG9QaXRjaCcsXHJcbiAgJ2luaXRpYWxGaWx0ZXJGYycsXHJcbiAgJ2luaXRpYWxGaWx0ZXJRJyxcclxuICAnbW9kTGZvVG9GaWx0ZXJGYycsXHJcbiAgJ21vZEVudlRvRmlsdGVyRmMnLFxyXG4gICdlbmRBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ21vZExmb1RvVm9sdW1lJyxcclxuICB1bmRlZmluZWQsIC8vIDE0XHJcbiAgJ2Nob3J1c0VmZmVjdHNTZW5kJyxcclxuICAncmV2ZXJiRWZmZWN0c1NlbmQnLFxyXG4gICdwYW4nLFxyXG4gIHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLCAvLyAxOCwxOSwyMFxyXG4gICdkZWxheU1vZExGTycsXHJcbiAgJ2ZyZXFNb2RMRk8nLFxyXG4gICdkZWxheVZpYkxGTycsXHJcbiAgJ2ZyZXFWaWJMRk8nLFxyXG4gICdkZWxheU1vZEVudicsXHJcbiAgJ2F0dGFja01vZEVudicsXHJcbiAgJ2hvbGRNb2RFbnYnLFxyXG4gICdkZWNheU1vZEVudicsXHJcbiAgJ3N1c3RhaW5Nb2RFbnYnLFxyXG4gICdyZWxlYXNlTW9kRW52JyxcclxuICAna2V5bnVtVG9Nb2RFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Nb2RFbnZEZWNheScsXHJcbiAgJ2RlbGF5Vm9sRW52JyxcclxuICAnYXR0YWNrVm9sRW52JyxcclxuICAnaG9sZFZvbEVudicsXHJcbiAgJ2RlY2F5Vm9sRW52JyxcclxuICAnc3VzdGFpblZvbEVudicsXHJcbiAgJ3JlbGVhc2VWb2xFbnYnLFxyXG4gICdrZXludW1Ub1ZvbEVudkhvbGQnLFxyXG4gICdrZXludW1Ub1ZvbEVudkRlY2F5JyxcclxuICAnaW5zdHJ1bWVudCcsXHJcbiAgdW5kZWZpbmVkLCAvLyA0MlxyXG4gICdrZXlSYW5nZScsXHJcbiAgJ3ZlbFJhbmdlJyxcclxuICAnc3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdrZXludW0nLFxyXG4gICd2ZWxvY2l0eScsXHJcbiAgJ2luaXRpYWxBdHRlbnVhdGlvbicsXHJcbiAgdW5kZWZpbmVkLCAvLyA0OVxyXG4gICdlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdjb2Fyc2VUdW5lJyxcclxuICAnZmluZVR1bmUnLFxyXG4gICdzYW1wbGVJRCcsXHJcbiAgJ3NhbXBsZU1vZGVzJyxcclxuICB1bmRlZmluZWQsIC8vIDU1XHJcbiAgJ3NjYWxlVHVuaW5nJyxcclxuICAnZXhjbHVzaXZlQ2xhc3MnLFxyXG4gICdvdmVycmlkaW5nUm9vdEtleSdcclxuXVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQ29uc3RhbnRzLnRzIiwiaW1wb3J0IHBhcnNlIGZyb20gXCIuLi9zcmMvUGFyc2VyLnRzXCJcclxuaW1wb3J0IFNvdW5kRm9udCBmcm9tIFwiLi4vc3JjL1NvdW5kRm9udC50c1wiXHJcblxyXG5leHBvcnQge1xyXG4gIHBhcnNlLFxyXG4gIFNvdW5kRm9udFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2V4cG9ydC9wYXJzZXIuanMiLCJpbXBvcnQgeyBQYXJzZVJlc3VsdCB9IGZyb20gXCIuL1BhcnNlclwiXHJcbmltcG9ydCB7IFJhbmdlVmFsdWUsIEdlbmVyYXRvckxpc3QgfSBmcm9tIFwiLi9TdHJ1Y3RzXCJcclxuXHJcbi8qKlxyXG4gKiBQYXJzZXIg44Gn6Kqt44G/6L6844KT44Gg44K144Km44Oz44OJ44OV44Kp44Oz44OI44Gu44OH44O844K/44KSXHJcbiAqIFN5bnRoZXNpemVyIOOBi+OCieWIqeeUqOOBl+OChOOBmeOBhOW9ouOBq+OBmeOCi+OCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291bmRGb250IHtcclxuICBwcml2YXRlIHBhcnNlZDogUGFyc2VSZXN1bHRcclxuXHJcbiAgY29uc3RydWN0b3IocGFyc2VkOiBQYXJzZVJlc3VsdCkge1xyXG4gICAgdGhpcy5wYXJzZWQgPSBwYXJzZWRcclxuICB9XHJcblxyXG4gIGdldFByZXNldFpvbmUocHJlc2V0SGVhZGVySW5kZXg6IG51bWJlcikge1xyXG4gICAgbGV0IHByZXNldEdlbmVyYXRvcnM6IEdlbmVyYXRvckxpc3RbXVxyXG4gICAgY29uc3QgcHJlc2V0SGVhZGVyID0gdGhpcy5wYXJzZWQucHJlc2V0SGVhZGVyc1twcmVzZXRIZWFkZXJJbmRleF1cclxuICAgIGNvbnN0IHByZXNldEJhZyA9IHRoaXMucGFyc2VkLnByZXNldFpvbmVbcHJlc2V0SGVhZGVyLnByZXNldEJhZ0luZGV4XVxyXG5cclxuICAgIGNvbnN0IG5leHRQcmVzZXRIZWFkZXJJbmRleCA9IHByZXNldEhlYWRlckluZGV4ICsgMVxyXG4gICAgaWYgKG5leHRQcmVzZXRIZWFkZXJJbmRleCA8IHRoaXMucGFyc2VkLnByZXNldEhlYWRlcnMubGVuZ3RoKSB7XHJcbiAgICAgIC8vIOasoeOBriBwcmVzZXQg44G+44Gn44Gu44GZ44G544Gm44GuIGdlbmVyYXRvciDjgpLlj5blvpfjgZnjgotcclxuICAgICAgY29uc3QgbmV4dFByZXNldEhlYWRlciA9IHRoaXMucGFyc2VkLnByZXNldEhlYWRlcnNbbmV4dFByZXNldEhlYWRlckluZGV4XVxyXG4gICAgICBjb25zdCBuZXh0UHJlc2V0QmFnID0gdGhpcy5wYXJzZWQucHJlc2V0Wm9uZVtuZXh0UHJlc2V0SGVhZGVyLnByZXNldEJhZ0luZGV4XVxyXG4gICAgICBwcmVzZXRHZW5lcmF0b3JzID0gdGhpcy5wYXJzZWQucHJlc2V0R2VuZXJhdG9ycy5zbGljZShwcmVzZXRCYWcucHJlc2V0R2VuZXJhdG9ySW5kZXgsIG5leHRQcmVzZXRCYWcucHJlc2V0R2VuZXJhdG9ySW5kZXgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyDmnIDlvozjga4gcHJlc2V0IOOBoOOBo+OBn+WgtOWQiOOBr+acgOW+jOOBvuOBp+WPluW+l+OBmeOCi1xyXG4gICAgICBwcmVzZXRHZW5lcmF0b3JzID0gdGhpcy5wYXJzZWQucHJlc2V0R2VuZXJhdG9ycy5zbGljZShwcmVzZXRCYWcucHJlc2V0R2VuZXJhdG9ySW5kZXgsIHRoaXMucGFyc2VkLnByZXNldEdlbmVyYXRvcnMubGVuZ3RoKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwcmVzZXRHZW5lcmF0b3JzXHJcbiAgfVxyXG5cclxuICBnZXRJbnN0cnVtZW50Wm9uZShpbnN0cnVtZW50Wm9uZUluZGV4OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGluc3RydW1lbnRCYWcgPSB0aGlzLnBhcnNlZC5pbnN0cnVtZW50Wm9uZVtpbnN0cnVtZW50Wm9uZUluZGV4XVxyXG4gICAgY29uc3QgbmV4dEluc3RydW1lbnRCYWcgPSB0aGlzLnBhcnNlZC5pbnN0cnVtZW50Wm9uZVtpbnN0cnVtZW50Wm9uZUluZGV4ICsgMV1cclxuICAgIGNvbnN0IGdlbmVyYXRvckluZGV4ID0gaW5zdHJ1bWVudEJhZy5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXhcclxuICAgIGNvbnN0IG5leHRHZW5lcmF0b3JJbmRleCA9IG5leHRJbnN0cnVtZW50QmFnID8gbmV4dEluc3RydW1lbnRCYWcuaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4IDogdGhpcy5wYXJzZWQuaW5zdHJ1bWVudEdlbmVyYXRvcnMubGVuZ3RoXHJcbiAgICBjb25zdCBnZW5lcmF0b3JzID0gdGhpcy5wYXJzZWQuaW5zdHJ1bWVudEdlbmVyYXRvcnMuc2xpY2UoZ2VuZXJhdG9ySW5kZXgsIG5leHRHZW5lcmF0b3JJbmRleClcclxuICAgIHJldHVybiBjcmVhdGVJbnN0cnVtZW50Wm9uZShnZW5lcmF0b3JzKVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5zdHJ1bWVudFpvbmVJbmRleGVzKGluc3RydW1lbnRJRDogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgY29uc3QgaW5zdHJ1bWVudCA9IHRoaXMucGFyc2VkLmluc3RydW1lbnRzW2luc3RydW1lbnRJRF1cclxuICAgIGNvbnN0IG5leHRJbnN0cnVtZW50ID0gdGhpcy5wYXJzZWQuaW5zdHJ1bWVudHNbaW5zdHJ1bWVudElEICsgMV1cclxuICAgIHJldHVybiBhcnJheVJhbmdlKGluc3RydW1lbnQuaW5zdHJ1bWVudEJhZ0luZGV4LCBuZXh0SW5zdHJ1bWVudCA/IG5leHRJbnN0cnVtZW50Lmluc3RydW1lbnRCYWdJbmRleCA6IHRoaXMucGFyc2VkLmluc3RydW1lbnRab25lLmxlbmd0aClcclxuICB9XHJcblxyXG4gIGdldEluc3RydW1lbnRLZXkoYmFua051bWJlciwgaW5zdHJ1bWVudE51bWJlciwga2V5LCB2ZWxvY2l0eSA9IDEwMCk6IE5vdGVJbmZvfG51bGwge1xyXG4gICAgY29uc3QgcHJlc2V0SGVhZGVySW5kZXggPSB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzLmZpbmRJbmRleChwID0+IHAucHJlc2V0ID09PSBpbnN0cnVtZW50TnVtYmVyICYmIHAuYmFuayA9PT0gYmFua051bWJlcilcclxuICAgIFxyXG4gICAgaWYgKHByZXNldEhlYWRlckluZGV4IDwgMCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXCJwcmVzZXQgbm90IGZvdW5kOiBiYW5rPSVzIGluc3RydW1lbnQ9JXNcIiwgYmFua051bWJlciwgaW5zdHJ1bWVudE51bWJlcilcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwcmVzZXRHZW5lcmF0b3JzID0gdGhpcy5nZXRQcmVzZXRab25lKHByZXNldEhlYWRlckluZGV4KVxyXG5cclxuICAgIC8vIExhc3QgUHJlc2V0IEdlbmVyYXRvciBtdXN0IGJlIGluc3RydW1lbnRcclxuICAgIGNvbnN0IGxhc3RQcmVzZXRHZW5lcnRvciA9IHByZXNldEdlbmVyYXRvcnNbcHJlc2V0R2VuZXJhdG9ycy5sZW5ndGggLSAxXVxyXG4gICAgaWYgKGxhc3RQcmVzZXRHZW5lcnRvci50eXBlICE9PSBcImluc3RydW1lbnRcIiB8fCBOdW1iZXIobGFzdFByZXNldEdlbmVydG9yLnZhbHVlKSA9PT0gTmFOKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiBpbnZhbGlkIHByZXNldCBnZW5lcmF0b3I6IGV4cGVjdCBpbnN0cnVtZW50XCIpXHJcbiAgICB9XHJcbiAgICBjb25zdCBpbnN0cnVtZW50SUQgPSBsYXN0UHJlc2V0R2VuZXJ0b3IudmFsdWUgYXMgbnVtYmVyXHJcbiAgICBjb25zdCBpbnN0cnVtZW50Wm9uZXMgPSB0aGlzLmdldEluc3RydW1lbnRab25lSW5kZXhlcyhpbnN0cnVtZW50SUQpLm1hcChpID0+IHRoaXMuZ2V0SW5zdHJ1bWVudFpvbmUoaSkpXHJcblxyXG4gICAgLy8g5pyA5Yid44Gu44K+44O844Oz44GMc2FtcGxlSUQg44KS5oyB44Gf44Gq44GR44KM44GwIGdsb2JhbCBpbnN0cnVtZW50IHpvbmVcclxuICAgIGxldCBnbG9iYWxJbnN0cnVtZW50Wm9uZTogYW55fHVuZGVmaW5lZFxyXG4gICAgY29uc3QgZmlyc3RJbnN0cnVtZW50Wm9uZSA9IGluc3RydW1lbnRab25lc1swXVxyXG4gICAgaWYgKGZpcnN0SW5zdHJ1bWVudFpvbmUuc2FtcGxlSUQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBnbG9iYWxJbnN0cnVtZW50Wm9uZSA9IGluc3RydW1lbnRab25lc1swXVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGtleVJhbmdlIOOBqCB2ZWxSYW5nZSDjgYzjg57jg4Pjg4HjgZfjgabjgYTjgosgR2VuZXJhdG9yIOOCkuaOouOBmVxyXG4gICAgY29uc3QgaW5zdHJ1bWVudFpvbmUgPSBpbnN0cnVtZW50Wm9uZXMuZmluZChpID0+IHtcclxuICAgICAgaWYgKGkgPT09IGdsb2JhbEluc3RydW1lbnRab25lKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlIC8vIGdsb2JhbCB6b25lIOOCkumZpOWkllxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgaXNJbktleVJhbmdlID0gZmFsc2VcclxuICAgICAgaWYgKGkua2V5UmFuZ2UpIHtcclxuICAgICAgICBpc0luS2V5UmFuZ2UgPSBrZXkgPj0gaS5rZXlSYW5nZS5sbyAmJiBrZXkgPD0gaS5rZXlSYW5nZS5oaVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgaXNJblZlbFJhbmdlID0gdHJ1ZVxyXG4gICAgICBpZiAoaS52ZWxSYW5nZSkge1xyXG4gICAgICAgIGlzSW5WZWxSYW5nZSA9IHZlbG9jaXR5ID49IGkudmVsUmFuZ2UubG8gJiYgdmVsb2NpdHkgPD0gaS52ZWxSYW5nZS5oaVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaXNJbktleVJhbmdlICYmIGlzSW5WZWxSYW5nZVxyXG4gICAgfSlcclxuICAgIFxyXG4gICAgaWYgKCFpbnN0cnVtZW50Wm9uZSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXCJpbnN0cnVtZW50IG5vdCBmb3VuZDogYmFuaz0lcyBpbnN0cnVtZW50PSVzXCIsIGJhbmtOdW1iZXIsIGluc3RydW1lbnROdW1iZXIpXHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGluc3RydW1lbnRab25lLnNhbXBsZUlEID09PSB1bmRlZmluZWQpIHsgXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiBzYW1wbGVJRCBub3QgZm91bmRcIilcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgZ2VuID0gey4uLmRlZmF1bHRJbnN0cnVtZW50Wm9uZSwgLi4ucmVtb3ZlVW5kZWZpbmVkKGdsb2JhbEluc3RydW1lbnRab25lIHx8IHt9KSwgLi4ucmVtb3ZlVW5kZWZpbmVkKGluc3RydW1lbnRab25lKX1cclxuXHJcbiAgICBjb25zdCBzYW1wbGUgPSB0aGlzLnBhcnNlZC5zYW1wbGVzW2dlbi5zYW1wbGVJRCFdXHJcbiAgICBjb25zdCBzYW1wbGVIZWFkZXIgPSB0aGlzLnBhcnNlZC5zYW1wbGVIZWFkZXJzW2dlbi5zYW1wbGVJRCFdXHJcbiAgICBjb25zdCB0dW5lID0gZ2VuLmNvYXJzZVR1bmUgKyBnZW4uZmluZVR1bmUgLyAxMDBcclxuICAgIGNvbnN0IGJhc2VQaXRjaCA9IHR1bmUgKyAoc2FtcGxlSGVhZGVyLnBpdGNoQ29ycmVjdGlvbiAvIDEwMCkgLSAoZ2VuLm92ZXJyaWRpbmdSb290S2V5IHx8IHNhbXBsZUhlYWRlci5vcmlnaW5hbFBpdGNoKVxyXG4gICAgY29uc3Qgc2NhbGVUdW5pbmcgPSBnZW4uc2NhbGVUdW5pbmcgLyAxMDBcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzYW1wbGUsXHJcbiAgICAgIHNhbXBsZVJhdGU6IHNhbXBsZUhlYWRlci5zYW1wbGVSYXRlLFxyXG4gICAgICBzYW1wbGVOYW1lOiBzYW1wbGVIZWFkZXIuc2FtcGxlTmFtZSxcclxuICAgICAgc2NhbGVUdW5pbmcsXHJcbiAgICAgIHBsYXliYWNrUmF0ZTogKGtleSkgPT4gTWF0aC5wb3coTWF0aC5wb3coMiwgMSAvIDEyKSwgKGtleSArIGJhc2VQaXRjaCkgKiBzY2FsZVR1bmluZyksXHJcbiAgICAgIGtleVJhbmdlOiBnZW4ua2V5UmFuZ2UsXHJcbiAgICAgIHZlbFJhbmdlOiBnZW4udmVsUmFuZ2UsXHJcbiAgICAgIHZvbEF0dGFjazogY29udmVydFRpbWUoZ2VuLnZvbEF0dGFjayksXHJcbiAgICAgIHZvbERlY2F5OiBjb252ZXJ0VGltZShnZW4udm9sRGVjYXkpLFxyXG4gICAgICB2b2xTdXN0YWluOiBnZW4udm9sU3VzdGFpbiAvIDEwMDAsXHJcbiAgICAgIHZvbFJlbGVhc2U6IGNvbnZlcnRUaW1lKGdlbi52b2xSZWxlYXNlKSxcclxuICAgICAgbW9kQXR0YWNrOiBjb252ZXJ0VGltZShnZW4ubW9kQXR0YWNrKSxcclxuICAgICAgbW9kRGVjYXk6IGNvbnZlcnRUaW1lKGdlbi5tb2REZWNheSksXHJcbiAgICAgIG1vZFN1c3RhaW46IGdlbi5tb2RTdXN0YWluIC8gMTAwMCxcclxuICAgICAgbW9kUmVsZWFzZTogY29udmVydFRpbWUoZ2VuLm1vZFJlbGVhc2UpLFxyXG4gICAgICBtb2RFbnZUb1BpdGNoOiBnZW4ubW9kRW52VG9QaXRjaCAvIDEwMCwgLy8gY2VudFxyXG4gICAgICBtb2RFbnZUb0ZpbHRlckZjOiBnZW4ubW9kRW52VG9GaWx0ZXJGYywgLy8gc2VtaXRvbmUgKDEwMCBjZW50KVxyXG4gICAgICBpbml0aWFsRmlsdGVyUTogZ2VuLmluaXRpYWxGaWx0ZXJRLFxyXG4gICAgICBpbml0aWFsRmlsdGVyRmM6IGdlbi5pbml0aWFsRmlsdGVyRmMsXHJcbiAgICAgIGZyZXFWaWJMRk86IGdlbi5mcmVxVmliTEZPID8gY29udmVydFRpbWUoZ2VuLmZyZXFWaWJMRk8pICogOC4xNzYgOiB1bmRlZmluZWQsXHJcbiAgICAgIHN0YXJ0OiBnZW4uc3RhcnRBZGRyc0NvYXJzZU9mZnNldCAqIDMyNzY4ICsgZ2VuLnN0YXJ0QWRkcnNPZmZzZXQsXHJcbiAgICAgIGVuZDogZ2VuLmVuZEFkZHJzQ29hcnNlT2Zmc2V0ICogMzI3NjggKyBnZW4uZW5kQWRkcnNPZmZzZXQsXHJcbiAgICAgIGxvb3BTdGFydDogKFxyXG4gICAgICAgIHNhbXBsZUhlYWRlci5sb29wU3RhcnQgK1xyXG4gICAgICAgIGdlbi5zdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldCAqIDMyNzY4ICtcclxuICAgICAgICBnZW4uc3RhcnRsb29wQWRkcnNPZmZzZXRcclxuICAgICAgKSxcclxuICAgICAgbG9vcEVuZDogKFxyXG4gICAgICAgIHNhbXBsZUhlYWRlci5sb29wRW5kICtcclxuICAgICAgICBnZW4uZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0ICogMzI3NjggK1xyXG4gICAgICAgIGdlbi5lbmRsb29wQWRkcnNPZmZzZXRcclxuICAgICAgKSxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHByZXNldE5hbWVzW2JhbmtOdW1iZXJdW3ByZXNldE51bWJlcl0gPSBwcmVzZXROYW1lXHJcbiAgZ2V0UHJlc2V0TmFtZXMoKSB7XHJcbiAgICBjb25zdCBiYW5rOiB7W2luZGV4OiBudW1iZXJdOiB7W2luZGV4OiBudW1iZXJdOiBzdHJpbmd9fSA9IHt9XHJcbiAgICB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzLmZvckVhY2gocHJlc2V0ID0+IHtcclxuICAgICAgaWYgKCFiYW5rW3ByZXNldC5iYW5rXSkge1xyXG4gICAgICAgIGJhbmtbcHJlc2V0LmJhbmtdID0ge31cclxuICAgICAgfVxyXG4gICAgICBiYW5rW3ByZXNldC5iYW5rXVtwcmVzZXQucHJlc2V0XSA9IHByZXNldC5wcmVzZXROYW1lXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGJhbmtcclxuICB9XHJcbn1cclxuXHJcbi8vIHZhbHVlID0gMTIwMGxvZzIoc2VjKSDjgafooajjgZXjgozjgovmmYLplpPjgpLnp5LljZjkvY3jgavlpInmj5vjgZnjgotcclxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUaW1lKHZhbHVlKSB7XHJcbiAgcmV0dXJuIE1hdGgucG93KDIsIHZhbHVlIC8gMTIwMClcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlVW5kZWZpbmVkKG9iaikge1xyXG4gIGNvbnN0IHJlc3VsdCA9IHt9XHJcbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICBpZiAob2JqW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldXHJcbiAgICB9XHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFycmF5UmFuZ2Uoc3RhcnQsIGVuZCkge1xyXG4gIHJldHVybiBBcnJheS5mcm9tKHtsZW5ndGg6IGVuZCAtIHN0YXJ0fSwgKF8sIGspID0+IGsgKyBzdGFydCk7XHJcbn1cclxuXHJcbi8vIOOBsuOBqOOBpOOBriBpbnN0cnVtZW50IOOBq+WvvuW/nOOBmeOCiyBHZW5lcmF0b3Ig44Gu6YWN5YiX44GL44KJ5L2/44GE44KE44GZ44GP44GX44Gf44Kq44OW44K444Kn44Kv44OI44KS6L+U44GZXHJcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRab25lKGluc3RydW1lbnRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W10pIHtcclxuICBmdW5jdGlvbiBnZXRWYWx1ZSh0eXBlOiBzdHJpbmcpOiBudW1iZXJ8dW5kZWZpbmVkIHtcclxuICAgIGNvbnN0IGdlbmVyYXRvciA9IGluc3RydW1lbnRHZW5lcmF0b3JzLmZpbmQoZyA9PiBnLnR5cGUgPT09IHR5cGUpXHJcbiAgICBpZiAoIWdlbmVyYXRvcikge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICB9XHJcbiAgICBpZiAoTnVtYmVyKGdlbmVyYXRvci52YWx1ZSkgPT09IE5hTikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzb21ldGhpbmcgd3JvbmdcIilcclxuICAgIH1cclxuICAgIHJldHVybiBnZW5lcmF0b3IudmFsdWUgYXMgbnVtYmVyXHJcbiAgfVxyXG4gIFxyXG4gIC8vIEZpcnN0IEluc3RydW1lbnQgR2VuZXJhdG9yIG11c3QgYmUga2V5UmFuZ2VcclxuICBjb25zdCBmaXJzdEluc3RydW1lbnRHZW5lcmF0b3IgPSBpbnN0cnVtZW50R2VuZXJhdG9yc1swXVxyXG4gIGxldCBrZXlSYW5nZTogUmFuZ2VWYWx1ZXx1bmRlZmluZWRcclxuICBpZiAoZmlyc3RJbnN0cnVtZW50R2VuZXJhdG9yICYmIGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvci50eXBlID09PSBcImtleVJhbmdlXCIpIHtcclxuICAgIGlmICghKGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSBpbnN0YW5jZW9mIFJhbmdlVmFsdWUpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiBrZXlSYW5nZSBpcyBub3QgcmFuZ2VkIHZhbHVlXCIpXHJcbiAgICB9XHJcbiAgICBrZXlSYW5nZSA9IGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSBhcyBSYW5nZVZhbHVlXHJcbiAgfVxyXG5cclxuICAvLyBTZWNvbmQgSW5zdHJ1bWVudCBHZW5lcmF0b3IgY291bGQgYmUgdmVsUmFuZ2VcclxuICBjb25zdCBzZWNvbmRJbnN0cnVtZW50R2VuZXJhdG9yID0gaW5zdHJ1bWVudEdlbmVyYXRvcnNbMV1cclxuICBsZXQgdmVsUmFuZ2U6IFJhbmdlVmFsdWV8dW5kZWZpbmVkXHJcbiAgaWYgKHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IgJiYgc2Vjb25kSW5zdHJ1bWVudEdlbmVyYXRvci50eXBlID09PSBcInZlbFJhbmdlXCIpIHtcclxuICAgIGlmICghKHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUgaW5zdGFuY2VvZiBSYW5nZVZhbHVlKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNvdW5kRm9udDogdmVsUmFuZ2UgaXMgbm90IHJhbmdlZCB2YWx1ZVwiKVxyXG4gICAgfVxyXG4gICAgdmVsUmFuZ2UgPSBzZWNvbmRJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGFzIFJhbmdlVmFsdWVcclxuICB9XHJcblxyXG4gIC8vIExhc3QgSW5zdHJ1bWVudCBHZW5lcmF0b3IgbXVzdCBiZSBzYW1wbGVJRFxyXG4gIGNvbnN0IGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yID0gaW5zdHJ1bWVudEdlbmVyYXRvcnNbaW5zdHJ1bWVudEdlbmVyYXRvcnMubGVuZ3RoIC0gMV1cclxuICBsZXQgc2FtcGxlSUQ6IG51bWJlcnx1bmRlZmluZWRcclxuICBpZiAobGFzdEluc3RydW1lbnRHZW5lcmF0b3IgJiYgbGFzdEluc3RydW1lbnRHZW5lcmF0b3IudHlwZSA9PT0gXCJzYW1wbGVJRFwiKSB7XHJcbiAgICBpZiAoTnVtYmVyKGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlKSA9PT0gTmFOKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiBzYW1wbGVJRCBpcyBub3QgbnVtYmVyXCIpXHJcbiAgICB9XHJcbiAgICBzYW1wbGVJRCA9IGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGFzIG51bWJlclxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGtleVJhbmdlLCAvLyDjgYLjgovjga/jgZrjgaDjgYwgZ2xvYmFsIHpvbmUg44Gr44Gv54Sh44GE44GL44KC44GX44KM44Gq44GEXHJcbiAgICB2ZWxSYW5nZSwgLy8gb3B0aW9uYWxcclxuICAgIHNhbXBsZUlELCAvLyBnbG9iYWwgem9uZSDjga7loLTlkIjjgaDjgZHjgarjgYRcclxuICAgIHZvbEF0dGFjazogZ2V0VmFsdWUoXCJhdHRhY2tWb2xFbnZcIiksXHJcbiAgICB2b2xEZWNheTogZ2V0VmFsdWUoXCJkZWNheVZvbEVudlwiKSxcclxuICAgIHZvbFN1c3RhaW46IGdldFZhbHVlKFwic3VzdGFpblZvbEVudlwiKSxcclxuICAgIHZvbFJlbGVhc2U6IGdldFZhbHVlKFwicmVsZWFzZVZvbEVudlwiKSxcclxuICAgIG1vZEF0dGFjazogZ2V0VmFsdWUoXCJhdHRhY2tNb2RFbnZcIiksXHJcbiAgICBtb2REZWNheTogZ2V0VmFsdWUoXCJkZWNheU1vZEVudlwiKSxcclxuICAgIG1vZFN1c3RhaW46IGdldFZhbHVlKFwic3VzdGFpbk1vZEVudlwiKSxcclxuICAgIG1vZFJlbGVhc2U6IGdldFZhbHVlKFwicmVsZWFzZU1vZEVudlwiKSxcclxuICAgIG1vZEVudlRvUGl0Y2g6IGdldFZhbHVlKFwibW9kRW52VG9QaXRjaFwiKSxcclxuICAgIG1vZEVudlRvRmlsdGVyRmM6IGdldFZhbHVlKFwibW9kRW52VG9GaWx0ZXJGY1wiKSxcclxuICAgIGNvYXJzZVR1bmU6IGdldFZhbHVlKFwiY29hcnNlVHVuZVwiKSxcclxuICAgIGZpbmVUdW5lOiBnZXRWYWx1ZShcImZpbmVUdW5lXCIpLFxyXG4gICAgc2NhbGVUdW5pbmc6IGdldFZhbHVlKFwic2NhbGVUdW5pbmdcIiksXHJcbiAgICBmcmVxVmliTEZPOiBnZXRWYWx1ZShcImZyZXFWaWJMRk9cIiksXHJcbiAgICBzdGFydEFkZHJzT2Zmc2V0OiBnZXRWYWx1ZShcInN0YXJ0QWRkcnNPZmZzZXRcIiksXHJcbiAgICBzdGFydEFkZHJzQ29hcnNlT2Zmc2V0OiBnZXRWYWx1ZShcInN0YXJ0QWRkcnNDb2Fyc2VPZmZzZXRcIiksXHJcbiAgICBlbmRBZGRyc09mZnNldDogZ2V0VmFsdWUoXCJlbmRBZGRyc09mZnNldFwiKSxcclxuICAgIGVuZEFkZHJzQ29hcnNlT2Zmc2V0OiBnZXRWYWx1ZShcImVuZEFkZHJzQ29hcnNlT2Zmc2V0XCIpLFxyXG4gICAgc3RhcnRsb29wQWRkcnNPZmZzZXQ6IGdldFZhbHVlKFwic3RhcnRsb29wQWRkcnNPZmZzZXRcIiksXHJcbiAgICBzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldDogZ2V0VmFsdWUoXCJzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldFwiKSxcclxuICAgIGVuZGxvb3BBZGRyc09mZnNldDogZ2V0VmFsdWUoXCJlbmRsb29wQWRkcnNPZmZzZXRcIiksXHJcbiAgICBlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQ6IGdldFZhbHVlKFwiZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0XCIpLFxyXG4gICAgb3ZlcnJpZGluZ1Jvb3RLZXk6IGdldFZhbHVlKFwib3ZlcnJpZGluZ1Jvb3RLZXlcIiksXHJcbiAgICBpbml0aWFsRmlsdGVyUTogZ2V0VmFsdWUoXCJpbml0aWFsRmlsdGVyUVwiKSxcclxuICAgIGluaXRpYWxGaWx0ZXJGYzogZ2V0VmFsdWUoXCJpbml0aWFsRmlsdGVyRmNcIiksXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBkZWZhdWx0SW5zdHJ1bWVudFpvbmUgPSB7XHJcbiAga2V5UmFuZ2U6IG5ldyBSYW5nZVZhbHVlKDAsIDEyNyksXHJcbiAgdmVsUmFuZ2U6IG5ldyBSYW5nZVZhbHVlKDAsIDEyNyksXHJcbiAgc2FtcGxlSUQ6IHVuZGVmaW5lZCxcclxuICB2b2xBdHRhY2s6IC0xMjAwMCxcclxuICB2b2xEZWNheTogLTEyMDAwLFxyXG4gIHZvbFN1c3RhaW46IDAsXHJcbiAgdm9sUmVsZWFzZTogLTEyMDAwLFxyXG4gIG1vZEF0dGFjazogLTEyMDAwLFxyXG4gIG1vZERlY2F5OiAtMTIwMDAsXHJcbiAgbW9kU3VzdGFpbjogMCxcclxuICBtb2RSZWxlYXNlOiAwLFxyXG4gIG1vZEVudlRvUGl0Y2g6IDAsXHJcbiAgbW9kRW52VG9GaWx0ZXJGYzogMCxcclxuICBjb2Fyc2VUdW5lOiAwLFxyXG4gIGZpbmVUdW5lOiAwLFxyXG4gIHNjYWxlVHVuaW5nOiAxMDAsXHJcbiAgZnJlcVZpYkxGTzogMCxcclxuICBzdGFydEFkZHJzT2Zmc2V0OiAwLFxyXG4gIHN0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQ6IDAsXHJcbiAgZW5kQWRkcnNPZmZzZXQ6IDAsXHJcbiAgZW5kQWRkcnNDb2Fyc2VPZmZzZXQ6IDAsXHJcbiAgc3RhcnRsb29wQWRkcnNPZmZzZXQ6IDAsXHJcbiAgc3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXQ6IDAsXHJcbiAgZW5kbG9vcEFkZHJzT2Zmc2V0OiAwLFxyXG4gIGVuZGxvb3BBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBvdmVycmlkaW5nUm9vdEtleTogdW5kZWZpbmVkLFxyXG4gIGluaXRpYWxGaWx0ZXJROiAxLFxyXG4gIGluaXRpYWxGaWx0ZXJGYzogMTM1MDAsXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTm90ZUluZm8ge1xyXG4gIHNhbXBsZTogSW50MTZBcnJheVxyXG4gIHNhbXBsZVJhdGU6IG51bWJlclxyXG4gIHNhbXBsZU5hbWU6IHN0cmluZ1xyXG4gIHN0YXJ0OiBudW1iZXJcclxuICBlbmQ6IG51bWJlclxyXG4gIHNjYWxlVHVuaW5nOiBudW1iZXJcclxuICBwbGF5YmFja1JhdGU6IEZ1bmN0aW9uXHJcbiAgbG9vcFN0YXJ0OiBudW1iZXJcclxuICBsb29wRW5kOiBudW1iZXJcclxuICB2b2xBdHRhY2s6IG51bWJlclxyXG4gIHZvbERlY2F5OiBudW1iZXJcclxuICB2b2xTdXN0YWluOiBudW1iZXJcclxuICB2b2xSZWxlYXNlOiBudW1iZXJcclxuICBtb2RBdHRhY2s6IG51bWJlclxyXG4gIG1vZERlY2F5OiBudW1iZXJcclxuICBtb2RTdXN0YWluOiBudW1iZXJcclxuICBtb2RSZWxlYXNlOiBudW1iZXJcclxuICBtb2RFbnZUb1BpdGNoOiBudW1iZXJcclxuICBtb2RFbnZUb0ZpbHRlckZjOiBudW1iZXJcclxuICBpbml0aWFsRmlsdGVyRmM6IG51bWJlclxyXG4gIGluaXRpYWxGaWx0ZXJROiBudW1iZXJcclxuICBmcmVxVmliTEZPOiBudW1iZXJ8dW5kZWZpbmVkXHJcbiAga2V5UmFuZ2U6IFJhbmdlVmFsdWVcclxuICB2ZWxSYW5nZTogUmFuZ2VWYWx1ZXx1bmRlZmluZWRcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU291bmRGb250LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==