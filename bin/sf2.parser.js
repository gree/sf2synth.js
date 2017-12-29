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
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Parser", function() { return __WEBPACK_IMPORTED_MODULE_0__src_Parser_ts__["a"]; });



/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxMmYwMTM3N2UzMWUyOTE4ZTJlMCIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9TdHJ1Y3RzLnRzIiwid2VicGFjazovLy8uL3NyYy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JpZmZQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDN0RjO0lBSVosWUFBWSxJQUFJLEVBQUUsTUFBTTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUk7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNO0lBQ2xCLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBWTtRQUNyQixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFB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QUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDREQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzVGLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLCtEQUFhLENBQUM7QUFDakYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsOERBQVksRUFBRSxDQUFDLENBQUMsRUFB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QUFVO0lBQ1YsVUFBVTtJQUNWLDRCQUE0QjtJQUM1QixRQUFRO0lBQ1IsVUFBVTtJQUNWLG9CQUFvQjtJQUNwQixTQUFTO0lBQ1QsMEJBQTBCO0lBQzFCLFlBQVk7SUFDWixVQUFVO0lBQ1YsVUFBVTtJQUNWLGFBQWE7SUFDYixTQUFTO0lBQ1QsYUFBYTtJQUNiLGdCQUFnQjtJQUNoQixtQkFBbUI7Q0FDcEI7QUFBQTtBQUFBOzs7Ozs7Ozs7OztBQzFERCIsImZpbGUiOiJzZjIucGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTJmMDEzNzdlMzFlMjkxOGUyZTAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xyXG4gIHByaXZhdGUgZGF0YTogVWludDhBcnJheVxyXG4gIGlwOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IoZGF0YSwgb2Zmc2V0KSB7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhXHJcbiAgICB0aGlzLmlwID0gb2Zmc2V0XHJcbiAgfVxyXG5cclxuICByZWFkU3RyaW5nKHNpemU6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHRoaXMuZGF0YS5zdWJhcnJheSh0aGlzLmlwLCB0aGlzLmlwICs9IHNpemUpKVxyXG4gICAgY29uc3QgbnVsbExvY2F0aW9uID0gc3RyLmluZGV4T2YoXCJcXHUwMDAwXCIpXHJcbiAgICBpZiAobnVsbExvY2F0aW9uID4gMCkge1xyXG4gICAgICByZXR1cm4gc3RyLnN1YnN0cigwLCBudWxsTG9jYXRpb24pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RyXHJcbiAgfVxyXG5cclxuICByZWFkV09SRCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwKytdIHwgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpXHJcbiAgfVxyXG5cclxuICByZWFkRFdPUkQoYmlnRW5kaWFuOiBib29sZWFuID0gZmFsc2UpOiBudW1iZXIge1xyXG4gICAgaWYgKGJpZ0VuZGlhbikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDI0fCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMTYpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdKVxyXG4gICAgICApID4+PiAwXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuZGF0YVt0aGlzLmlwKytdIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDE2KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAyNClcclxuICAgICAgKSA+Pj4gMFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVhZEJ5dGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXArK11cclxuICB9XHJcblxyXG4gIHJlYWRBdChvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwICsgb2Zmc2V0XVxyXG4gIH1cclxuXHJcbiAgLyogaGVscGVyICovXHJcblxyXG4gIHJlYWRVSW50OCgpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWRCeXRlKClcclxuICB9XHJcbiAgXHJcbiAgcmVhZEludDgoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMucmVhZEJ5dGUoKSA8PCAyNCkgPj4gMjRcclxuICB9XHJcbiAgXHJcbiAgcmVhZFVJbnQxNigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWRXT1JEKClcclxuICB9XHJcblxyXG4gIHJlYWRJbnQxNigpIHtcclxuICAgIHJldHVybiAodGhpcy5yZWFkV09SRCgpIDw8IDE2KSA+PiAxNlxyXG4gIH1cclxuXHJcbiAgcmVhZFVJbnQzMigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWREV09SRCgpXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TdHJlYW0udHMiLCJpbXBvcnQgeyBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgfSBmcm9tIFwiLi9Db25zdGFudHNcIlxyXG5pbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcbmltcG9ydCB7IENodW5rIH0gZnJvbSBcIi4vUmlmZlBhcnNlclwiXHJcblxyXG5leHBvcnQgY2xhc3MgVmVyc2lvblRhZyB7XHJcbiAgbWFqb3I6IG51bWJlclxyXG4gIG1pbm9yOiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHYgPSBuZXcgVmVyc2lvblRhZygpXHJcbiAgICB2Lm1ham9yID0gc3RyZWFtLnJlYWRJbnQ4KClcclxuICAgIHYubWlub3IgPSBzdHJlYW0ucmVhZEludDgoKVxyXG4gICAgcmV0dXJuIHZcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmZvIHtcclxuICBjb21tZW50OiBzdHJpbmd8bnVsbFxyXG4gIGNvcHlyaWdodDogc3RyaW5nfG51bGxcclxuICBjcmVhdGlvbkRhdGU6IHN0cmluZ3xudWxsXHJcbiAgZW5naW5lZXI6IHN0cmluZ3xudWxsXHJcbiAgbmFtZTogc3RyaW5nXHJcbiAgcHJvZHVjdDogc3RyaW5nfG51bGxcclxuICBzb2Z0d2FyZTogc3RyaW5nfG51bGxcclxuICB2ZXJzaW9uOiBWZXJzaW9uVGFnXHJcbiAgc291bmRFbmdpbmU6IHN0cmluZ3xudWxsXHJcbiAgcm9tTmFtZTogc3RyaW5nfG51bGxcclxuICByb21WZXJzaW9uOiBWZXJzaW9uVGFnfG51bGxcclxuXHJcbiAgLy8gTElTVCAtIElORk8g44Gu5YWo44Gm44GuIGNodW5rXHJcbiAgc3RhdGljIHBhcnNlKGRhdGE6IFVpbnQ4QXJyYXksIGNodW5rczogQ2h1bmtbXSkge1xyXG4gICAgZnVuY3Rpb24gZ2V0Q2h1bmsodHlwZSkge1xyXG4gICAgICByZXR1cm4gY2h1bmtzLmZpbmQoYyA9PiBjLnR5cGUgPT09IHR5cGUpIFxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvU3RyZWFtKGNodW5rKSB7XHJcbiAgICAgIHJldHVybiBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWFkU3RyaW5nKHR5cGUpIHtcclxuICAgICAgY29uc3QgY2h1bmsgPSBnZXRDaHVuayh0eXBlKVxyXG4gICAgICBpZiAoIWNodW5rKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdG9TdHJlYW0oY2h1bmspIS5yZWFkU3RyaW5nKGNodW5rLnNpemUpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVhZFZlcnNpb25UYWcodHlwZSkge1xyXG4gICAgICBjb25zdCBjaHVuayA9IGdldENodW5rKHR5cGUpXHJcbiAgICAgIGlmICghY2h1bmspIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBWZXJzaW9uVGFnLnBhcnNlKHRvU3RyZWFtKGNodW5rKSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgaW5mbyA9IG5ldyBJbmZvKClcclxuICAgIGluZm8uY29tbWVudCA9IHJlYWRTdHJpbmcoXCJJQ01UXCIpXHJcbiAgICBpbmZvLmNvcHlyaWdodCA9IHJlYWRTdHJpbmcoXCJJQ09QXCIpXHJcbiAgICBpbmZvLmNyZWF0aW9uRGF0ZSA9IHJlYWRTdHJpbmcoXCJJQ1JEXCIpXHJcbiAgICBpbmZvLmVuZ2luZWVyID0gcmVhZFN0cmluZyhcIklFTkdcIilcclxuICAgIGluZm8ubmFtZSA9IHJlYWRTdHJpbmcoXCJJTkFNXCIpIVxyXG4gICAgaW5mby5wcm9kdWN0ID0gcmVhZFN0cmluZyhcIklQUkRcIilcclxuICAgIGluZm8uc29mdHdhcmUgPSByZWFkU3RyaW5nKFwiSVNGVFwiKVxyXG4gICAgaW5mby52ZXJzaW9uID0gcmVhZFZlcnNpb25UYWcoXCJpZmlsXCIpIVxyXG4gICAgaW5mby5zb3VuZEVuZ2luZSA9IHJlYWRTdHJpbmcoXCJpc25nXCIpXHJcbiAgICBpbmZvLnJvbU5hbWUgPSByZWFkU3RyaW5nKFwiaXJvbVwiKVxyXG4gICAgaW5mby5yb21WZXJzaW9uID0gcmVhZFZlcnNpb25UYWcoXCJpdmVyXCIpXHJcbiAgICByZXR1cm4gaW5mb1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByZXNldEhlYWRlciB7XHJcbiAgcHJlc2V0TmFtZTogc3RyaW5nXHJcbiAgcHJlc2V0OiBudW1iZXJcclxuICBiYW5rOiBudW1iZXJcclxuICBwcmVzZXRCYWdJbmRleDogbnVtYmVyXHJcbiAgbGlicmFyeTogbnVtYmVyXHJcbiAgZ2VucmU6IG51bWJlclxyXG4gIG1vcnBob2xvZ3k6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcmVzZXROYW1lID09PSBcIkVPUFwiXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0SGVhZGVyKClcclxuICAgIHAucHJlc2V0TmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcC5wcmVzZXQgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5iYW5rID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAucHJlc2V0QmFnSW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5saWJyYXJ5ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLmdlbnJlID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLm1vcnBob2xvZ3kgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlc2V0QmFnIHtcclxuICBwcmVzZXRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgcHJlc2V0TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0QmFnKClcclxuICAgIHAucHJlc2V0R2VuZXJhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gcFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJhbmdlVmFsdWUge1xyXG4gIGxvOiBudW1iZXJcclxuICBoaTogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKGxvOiBudW1iZXIsIGhpOiBudW1iZXIpIHtcclxuICAgIHRoaXMubG8gPSBsb1xyXG4gICAgdGhpcy5oaSA9IGhpXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIHJldHVybiBuZXcgUmFuZ2VWYWx1ZShcclxuICAgICAgc3RyZWFtLnJlYWRCeXRlKCksIFxyXG4gICAgICBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vZHVsYXRvckxpc3Qge1xyXG4gIHNvdXJjZU9wZXI6IG51bWJlclxyXG4gIGRlc3RpbmF0aW9uT3BlcjogbnVtYmVyXHJcbiAgdmFsdWU6IG51bWJlcnxSYW5nZVZhbHVlXHJcbiAgYW1vdW50U291cmNlT3BlcjogbnVtYmVyXHJcbiAgdHJhbnNPcGVyOiBudW1iZXJcclxuXHJcbiAgZ2V0IHR5cGUoKSB7XHJcbiAgICByZXR1cm4gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW3RoaXMuZGVzdGluYXRpb25PcGVyXVxyXG4gIH1cclxuXHJcbiAgZ2V0IGlzRW5kKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlT3BlciA9PT0gMCAmJiBcclxuICAgICAgdGhpcy5kZXN0aW5hdGlvbk9wZXIgPT09IDAgJiZcclxuICAgICAgdGhpcy52YWx1ZSA9PT0gMCAmJlxyXG4gICAgICB0aGlzLmFtb3VudFNvdXJjZU9wZXIgPT09IDAgJiZcclxuICAgICAgdGhpcy4gdHJhbnNPcGVyID09PSAwXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgTW9kdWxhdG9yTGlzdCgpXHJcblxyXG4gICAgdC5zb3VyY2VPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQuZGVzdGluYXRpb25PcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzd2l0Y2ggKHQudHlwZSkge1xyXG4gICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgIHQudmFsdWUgPSBSYW5nZVZhbHVlLnBhcnNlKHN0cmVhbSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHQudmFsdWUgPSBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0LmFtb3VudFNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC50cmFuc09wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yTGlzdCB7XHJcbiAgY29kZTogbnVtYmVyXHJcbiAgdmFsdWU6IG51bWJlcnxSYW5nZVZhbHVlXHJcblxyXG4gIGdldCB0eXBlKCkge1xyXG4gICAgcmV0dXJuIEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZVt0aGlzLmNvZGVdXHJcbiAgfVxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb2RlID09PSAwICYmXHJcbiAgICAgIHRoaXMudmFsdWUgPT09IDBcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBHZW5lcmF0b3JMaXN0KClcclxuICAgIHQuY29kZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgc3dpdGNoICh0LnR5cGUpIHtcclxuICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAna2V5UmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICd2ZWxSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICB0LnZhbHVlID0gUmFuZ2VWYWx1ZS5wYXJzZShzdHJlYW0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0LnZhbHVlID0gc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnQge1xyXG4gIGluc3RydW1lbnROYW1lOiBzdHJpbmdcclxuICBpbnN0cnVtZW50QmFnSW5kZXg6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnN0cnVtZW50TmFtZSA9PT0gXCJFT0lcIlxyXG4gIH1cclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudCgpXHJcbiAgICB0Lmluc3RydW1lbnROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICB0Lmluc3RydW1lbnRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnRCYWcge1xyXG4gIGluc3RydW1lbnRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4OiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudEJhZygpXHJcbiAgICB0Lmluc3RydW1lbnRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0Lmluc3RydW1lbnRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNhbXBsZUhlYWRlciB7XHJcbiAgc2FtcGxlTmFtZTogc3RyaW5nXHJcbiAgc3RhcnQ6IG51bWJlclxyXG4gIGVuZDogbnVtYmVyXHJcbiAgbG9vcFN0YXJ0OiBudW1iZXJcclxuICBsb29wRW5kOiBudW1iZXJcclxuICBzYW1wbGVSYXRlOiBudW1iZXJcclxuICBvcmlnaW5hbFBpdGNoOiBudW1iZXJcclxuICBwaXRjaENvcnJlY3Rpb246IG51bWJlclxyXG4gIHNhbXBsZUxpbms6IG51bWJlclxyXG4gIHNhbXBsZVR5cGU6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zYW1wbGVOYW1lID09PSBcIkVPU1wiXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHMgPSBuZXcgU2FtcGxlSGVhZGVyKClcclxuXHJcbiAgICBzLnNhbXBsZU5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHMuc3RhcnQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuZW5kID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmxvb3BTdGFydCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5sb29wRW5kID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLnNhbXBsZVJhdGUgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMub3JpZ2luYWxQaXRjaCA9IHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICBzLnBpdGNoQ29ycmVjdGlvbiA9IHN0cmVhbS5yZWFkSW50OCgpXHJcbiAgICBzLnNhbXBsZUxpbmsgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcy5zYW1wbGVUeXBlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzLmxvb3BTdGFydCAtPSBzLnN0YXJ0XHJcbiAgICBzLmxvb3BFbmQgLT0gcy5zdGFydFxyXG5cclxuICAgIHJldHVybiBzXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgU2FtcGxlTGluayA9IHtcclxuICBtb25vU2FtcGxlOiAxLFxyXG4gIHJpZ2h0U2FtcGxlOiAyLFxyXG4gIGxlZnRTYW1wbGU6IDQsXHJcbiAgbGlua2VkU2FtcGxlOiA4LFxyXG4gIFJvbU1vbm9TYW1wbGU6IDB4ODAwMSxcclxuICBSb21SaWdodFNhbXBsZTogMHg4MDAyLFxyXG4gIFJvbUxlZnRTYW1wbGU6IDB4ODAwNCxcclxuICBSb21MaW5rZWRTYW1wbGU6IDB4ODAwOFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TdHJ1Y3RzLnRzIiwiaW1wb3J0IHsgcGFyc2VSaWZmLCBDaHVuaywgT3B0aW9ucyBhcyBSaWZmUGFyc2VyT3B0aW9ucyB9IGZyb20gXCIuL1JpZmZQYXJzZXJcIlxyXG5pbXBvcnQgeyBQcmVzZXRIZWFkZXIsIFNhbXBsZUhlYWRlciwgUHJlc2V0QmFnLCBJbnN0cnVtZW50LCBJbnN0cnVtZW50QmFnLCBNb2R1bGF0b3JMaXN0LCBHZW5lcmF0b3JMaXN0LCBJbmZvIH0gZnJvbSBcIi4vU3RydWN0c1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VSZXN1bHQge1xyXG4gIHByZXNldEhlYWRlcnM6IFByZXNldEhlYWRlcltdXHJcbiAgcHJlc2V0Wm9uZTogUHJlc2V0QmFnW11cclxuICBwcmVzZXRNb2R1bGF0b3JzOiBNb2R1bGF0b3JMaXN0W11cclxuICBwcmVzZXRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50czogSW5zdHJ1bWVudFtdXHJcbiAgaW5zdHJ1bWVudFpvbmU6IEluc3RydW1lbnRCYWdbXVxyXG4gIGluc3RydW1lbnRNb2R1bGF0b3JzOiBNb2R1bGF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50R2VuZXJhdG9yczogR2VuZXJhdG9yTGlzdFtdXHJcbiAgc2FtcGxlSGVhZGVyczogU2FtcGxlSGVhZGVyW11cclxuICBzYW1wbGVzOiBJbnQxNkFycmF5W11cclxuICBzYW1wbGluZ0RhdGE6IENodW5rXHJcbiAgaW5mbzogSW5mb1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZShpbnB1dDogVWludDhBcnJheSwgb3B0aW9uOiBSaWZmUGFyc2VyT3B0aW9ucyA9IHt9KTogUGFyc2VSZXN1bHQge1xyXG5cclxuICAvLyBwYXJzZSBSSUZGIGNodW5rXHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gcGFyc2VSaWZmKGlucHV0LCAwLCBpbnB1dC5sZW5ndGgsIG9wdGlvbilcclxuXHJcbiAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignd3JvbmcgY2h1bmsgbGVuZ3RoJylcclxuICB9XHJcblxyXG4gIGNvbnN0IGNodW5rID0gY2h1bmtMaXN0WzBdXHJcbiAgaWYgKGNodW5rID09PSBudWxsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NodW5rIG5vdCBmb3VuZCcpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZVJpZmZDaHVuayhjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJSSUZGXCIsIFwic2Zia1wiKVxyXG5cclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzZmJrIHN0cnVjdHVyZScpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gSU5GTy1saXN0XHJcbiAgICAgIGluZm86IHBhcnNlSW5mb0xpc3QoY2h1bmtMaXN0WzBdLCBkYXRhKSxcclxuXHJcbiAgICAgIC8vIHNkdGEtbGlzdFxyXG4gICAgICBzYW1wbGluZ0RhdGE6IHBhcnNlU2R0YUxpc3QoY2h1bmtMaXN0WzFdLCBkYXRhKSxcclxuXHJcbiAgICAgIC8vIHBkdGEtbGlzdFxyXG4gICAgICAuLi5wYXJzZVBkdGFMaXN0KGNodW5rTGlzdFsyXSwgZGF0YSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlUGR0YUxpc3QoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcInBkdGFcIilcclxuXHJcbiAgICAvLyBjaGVjayBudW1iZXIgb2YgY2h1bmtzXHJcbiAgICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gOSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGR0YSBjaHVuaycpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcHJlc2V0SGVhZGVyczogcGFyc2VQaGRyKGNodW5rTGlzdFswXSwgZGF0YSksXHJcbiAgICAgIHByZXNldFpvbmU6IHBhcnNlUGJhZyhjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRNb2R1bGF0b3JzOiBwYXJzZVBtb2QoY2h1bmtMaXN0WzJdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0R2VuZXJhdG9yczogcGFyc2VQZ2VuKGNodW5rTGlzdFszXSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRzOiBwYXJzZUluc3QoY2h1bmtMaXN0WzRdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudFpvbmU6IHBhcnNlSWJhZyhjaHVua0xpc3RbNV0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50TW9kdWxhdG9yczogcGFyc2VJbW9kKGNodW5rTGlzdFs2XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRHZW5lcmF0b3JzOiBwYXJzZUlnZW4oY2h1bmtMaXN0WzddLCBkYXRhKSxcclxuICAgICAgc2FtcGxlSGVhZGVyczogcGFyc2VTaGRyKGNodW5rTGlzdFs4XSwgZGF0YSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmlmZkNodW5rKGNodW5rLCBpbnB1dClcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIC4uLnJlc3VsdCxcclxuICAgIHNhbXBsZXM6IGxvYWRTYW1wbGUocmVzdWx0LnNhbXBsZUhlYWRlcnMsIHJlc3VsdC5zYW1wbGluZ0RhdGEub2Zmc2V0LCBpbnB1dClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgZXhwZWN0ZWRUeXBlLCBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSBleHBlY3RlZFR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcblxyXG4gIC8vIGNoZWNrIHNpZ25hdHVyZVxyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgaWYgKHNpZ25hdHVyZSAhPT0gZXhwZWN0ZWRTaWduYXR1cmUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaWduYXR1cmU6JyArIHNpZ25hdHVyZSlcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcmV0dXJuIHBhcnNlUmlmZihkYXRhLCBzdHJlYW0uaXAsIGNodW5rLnNpemUgLSA0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUluZm9MaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwiSU5GT1wiKVxyXG4gIHJldHVybiBJbmZvLnBhcnNlKGRhdGEsIGNodW5rTGlzdClcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpOiBDaHVuayB7XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJzZHRhXCIpXHJcblxyXG4gIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAxKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RPRE8nKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFswXVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rPFQ+KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSwgdHlwZTogc3RyaW5nLCBjbGF6ejogeyBwYXJzZTogKHN0cmVhbTogU3RyZWFtKSA9PiBUIH0sIHRlcm1pbmF0ZT86IChvYmo6IFQpID0+IGJvb2xlYW4pOiBUW10ge1xyXG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW11cclxuXHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IHR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgICsgY2h1bmsudHlwZSlcclxuICB9XHJcbiAgXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcbiAgY29uc3Qgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemVcclxuICBcclxuICB3aGlsZSAoc3RyZWFtLmlwIDwgc2l6ZSkge1xyXG4gICAgY29uc3Qgb2JqID0gY2xhenoucGFyc2Uoc3RyZWFtKVxyXG4gICAgaWYgKHRlcm1pbmF0ZSAmJiB0ZXJtaW5hdGUob2JqKSkge1xyXG4gICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgcmVzdWx0LnB1c2gob2JqKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5jb25zdCBwYXJzZVBoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGhkclwiLCBQcmVzZXRIZWFkZXIsIHAgPT4gcC5pc0VuZClcclxuY29uc3QgcGFyc2VQYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBiYWdcIiwgUHJlc2V0QmFnKVxyXG5jb25zdCBwYXJzZUluc3QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW5zdFwiLCBJbnN0cnVtZW50LCBpID0+IGkuaXNFbmQpXHJcbmNvbnN0IHBhcnNlSWJhZyA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpYmFnXCIsIEluc3RydW1lbnRCYWcpXHJcbmNvbnN0IHBhcnNlUG1vZCA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwbW9kXCIsIE1vZHVsYXRvckxpc3QsIG0gPT4gbS5pc0VuZClcclxuY29uc3QgcGFyc2VJbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImltb2RcIiwgTW9kdWxhdG9yTGlzdCwgbSA9PiBtLmlzRW5kKVxyXG5jb25zdCBwYXJzZVBnZW4gPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGdlblwiLCBHZW5lcmF0b3JMaXN0LCBnID0+IGcuaXNFbmQpXHJcbmNvbnN0IHBhcnNlSWdlbiA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpZ2VuXCIsIEdlbmVyYXRvckxpc3QsIGcgPT4gZy5pc0VuZClcclxuY29uc3QgcGFyc2VTaGRyID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInNoZHJcIiwgU2FtcGxlSGVhZGVyLCBzID0+IHMuaXNFbmQpXHJcblxyXG5mdW5jdGlvbiBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgc2FtcGxlUmF0ZSkge1xyXG4gIGxldCBtdWx0aXBseSA9IDFcclxuXHJcbiAgLy8gYnVmZmVyXHJcbiAgd2hpbGUgKHNhbXBsZVJhdGUgPCAyMjA1MCkge1xyXG4gICAgY29uc3QgbmV3U2FtcGxlID0gbmV3IEludDE2QXJyYXkoc2FtcGxlLmxlbmd0aCAqIDIpXHJcbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDAsIGlsID0gc2FtcGxlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgIH1cclxuICAgIHNhbXBsZSA9IG5ld1NhbXBsZVxyXG4gICAgbXVsdGlwbHkgKj0gMlxyXG4gICAgc2FtcGxlUmF0ZSAqPSAyXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2FtcGxlLFxyXG4gICAgbXVsdGlwbHlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTYW1wbGUoc2FtcGxlSGVhZGVyOiBTYW1wbGVIZWFkZXJbXSwgc2FtcGxpbmdEYXRhT2Zmc2V0OiBudW1iZXIsIGRhdGE6IFVpbnQ4QXJyYXkpOiBJbnQxNkFycmF5W10ge1xyXG4gIHJldHVybiBzYW1wbGVIZWFkZXIubWFwKGhlYWRlciA9PiB7XHJcbiAgICBsZXQgc2FtcGxlID0gbmV3IEludDE2QXJyYXkobmV3IFVpbnQ4QXJyYXkoZGF0YS5zdWJhcnJheShcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLnN0YXJ0ICogMixcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLmVuZCAgICogMlxyXG4gICAgKSkuYnVmZmVyKVxyXG4gICAgaWYgKGhlYWRlci5zYW1wbGVSYXRlID4gMCkge1xyXG4gICAgICBjb25zdCBhZGp1c3QgPSBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgaGVhZGVyLnNhbXBsZVJhdGUpXHJcbiAgICAgIHNhbXBsZSA9IGFkanVzdC5zYW1wbGVcclxuICAgICAgaGVhZGVyLnNhbXBsZVJhdGUgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5sb29wU3RhcnQgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5sb29wRW5kICo9IGFkanVzdC5tdWx0aXBseVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNhbXBsZVxyXG4gIH0pXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGFyc2VyLnRzIiwiaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9TdHJlYW1cIlxyXG5cclxuZnVuY3Rpb24gcGFyc2VDaHVuayhpbnB1dDogVWludDhBcnJheSwgaXA6IG51bWJlciwgYmlnRW5kaWFuOiBib29sZWFuKTogQ2h1bmsge1xyXG4gIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oaW5wdXQsIGlwKVxyXG4gIGNvbnN0IHR5cGUgPSBzdHJlYW0ucmVhZFN0cmluZyg0KVxyXG4gIGNvbnN0IHNpemUgPSBzdHJlYW0ucmVhZERXT1JEKGJpZ0VuZGlhbilcclxuICByZXR1cm4gbmV3IENodW5rKHR5cGUsIHNpemUsIHN0cmVhbS5pcClcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcclxuICBwYWRkaW5nPzogYm9vbGVhbixcclxuICBiaWdFbmRpYW4/OiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJpZmYoaW5wdXQ6IFVpbnQ4QXJyYXksIGluZGV4OiBudW1iZXIgPSAwLCBsZW5ndGg6IG51bWJlciwgeyBwYWRkaW5nID0gdHJ1ZSwgYmlnRW5kaWFuID0gZmFsc2UgfTogT3B0aW9ucyA9IHt9KSB7XHJcbiAgY29uc3QgY2h1bmtMaXN0OiBDaHVua1tdID0gW11cclxuICBjb25zdCBlbmQgPSBsZW5ndGggKyBpbmRleFxyXG4gIGxldCBpcCA9IGluZGV4XHJcblxyXG4gIHdoaWxlIChpcCA8IGVuZCkge1xyXG4gICAgY29uc3QgY2h1bmsgPSBwYXJzZUNodW5rKGlucHV0LCBpcCwgYmlnRW5kaWFuKVxyXG4gICAgaXAgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplXHJcbiAgICBcclxuICAgIC8vIHBhZGRpbmdcclxuICAgIGlmIChwYWRkaW5nICYmICgoaXAgLSBpbmRleCkgJiAxKSA9PT0gMSkge1xyXG4gICAgICBpcCsrXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNodW5rTGlzdC5wdXNoKGNodW5rKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2h1bmsge1xyXG4gIHR5cGU6IHN0cmluZ1xyXG4gIHNpemU6IG51bWJlclxyXG4gIG9mZnNldDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgdGhpcy5zaXplID0gc2l6ZVxyXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JpZmZQYXJzZXIudHMiLCJleHBvcnQgY29uc3QgR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlID0gW1xyXG4gICdzdGFydEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kQWRkcnNPZmZzZXQnLFxyXG4gICdzdGFydGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ2VuZGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1BpdGNoJyxcclxuICAndmliTGZvVG9QaXRjaCcsXHJcbiAgJ21vZEVudlRvUGl0Y2gnLFxyXG4gICdpbml0aWFsRmlsdGVyRmMnLFxyXG4gICdpbml0aWFsRmlsdGVyUScsXHJcbiAgJ21vZExmb1RvRmlsdGVyRmMnLFxyXG4gICdtb2RFbnZUb0ZpbHRlckZjJyxcclxuICAnZW5kQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1ZvbHVtZScsXHJcbiAgdW5kZWZpbmVkLCAvLyAxNFxyXG4gICdjaG9ydXNFZmZlY3RzU2VuZCcsXHJcbiAgJ3JldmVyYkVmZmVjdHNTZW5kJyxcclxuICAncGFuJyxcclxuICB1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCwgLy8gMTgsMTksMjBcclxuICAnZGVsYXlNb2RMRk8nLFxyXG4gICdmcmVxTW9kTEZPJyxcclxuICAnZGVsYXlWaWJMRk8nLFxyXG4gICdmcmVxVmliTEZPJyxcclxuICAnZGVsYXlNb2RFbnYnLFxyXG4gICdhdHRhY2tNb2RFbnYnLFxyXG4gICdob2xkTW9kRW52JyxcclxuICAnZGVjYXlNb2RFbnYnLFxyXG4gICdzdXN0YWluTW9kRW52JyxcclxuICAncmVsZWFzZU1vZEVudicsXHJcbiAgJ2tleW51bVRvTW9kRW52SG9sZCcsXHJcbiAgJ2tleW51bVRvTW9kRW52RGVjYXknLFxyXG4gICdkZWxheVZvbEVudicsXHJcbiAgJ2F0dGFja1ZvbEVudicsXHJcbiAgJ2hvbGRWb2xFbnYnLFxyXG4gICdkZWNheVZvbEVudicsXHJcbiAgJ3N1c3RhaW5Wb2xFbnYnLFxyXG4gICdyZWxlYXNlVm9sRW52JyxcclxuICAna2V5bnVtVG9Wb2xFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Wb2xFbnZEZWNheScsXHJcbiAgJ2luc3RydW1lbnQnLFxyXG4gIHVuZGVmaW5lZCwgLy8gNDJcclxuICAna2V5UmFuZ2UnLFxyXG4gICd2ZWxSYW5nZScsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAna2V5bnVtJyxcclxuICAndmVsb2NpdHknLFxyXG4gICdpbml0aWFsQXR0ZW51YXRpb24nLFxyXG4gIHVuZGVmaW5lZCwgLy8gNDlcclxuICAnZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnY29hcnNlVHVuZScsXHJcbiAgJ2ZpbmVUdW5lJyxcclxuICAnc2FtcGxlSUQnLFxyXG4gICdzYW1wbGVNb2RlcycsXHJcbiAgdW5kZWZpbmVkLCAvLyA1NVxyXG4gICdzY2FsZVR1bmluZycsXHJcbiAgJ2V4Y2x1c2l2ZUNsYXNzJyxcclxuICAnb3ZlcnJpZGluZ1Jvb3RLZXknXHJcbl1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbnN0YW50cy50cyIsImltcG9ydCBQYXJzZXIgZnJvbSBcIi4uL3NyYy9QYXJzZXIudHNcIlxyXG5leHBvcnQge1xyXG4gIFBhcnNlclxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2V4cG9ydC9wYXJzZXIuanMiXSwic291cmNlUm9vdCI6IiJ9