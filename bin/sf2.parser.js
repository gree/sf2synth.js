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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Stream = /** @class */ (function () {
    function Stream(data, offset) {
        this.data = data;
        this.ip = offset;
    }
    Stream.prototype.readString = function (size) {
        var str = String.fromCharCode.apply(null, this.data.subarray(this.ip, this.ip += size));
        var nullLocation = str.indexOf("\u0000");
        if (nullLocation > 0) {
            return str.substr(0, nullLocation);
        }
        return str;
    };
    Stream.prototype.readWORD = function () {
        return this.data[this.ip++] | (this.data[this.ip++] << 8);
    };
    Stream.prototype.readDWORD = function (bigEndian) {
        if (bigEndian === void 0) { bigEndian = false; }
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
    };
    Stream.prototype.readByte = function () {
        return this.data[this.ip++];
    };
    Stream.prototype.readAt = function (offset) {
        return this.data[this.ip + offset];
    };
    /* helper */
    Stream.prototype.readUInt8 = function () {
        return this.readByte();
    };
    Stream.prototype.readInt8 = function () {
        return (this.readByte() << 24) >> 24;
    };
    Stream.prototype.readUInt16 = function () {
        return this.readWORD();
    };
    Stream.prototype.readInt16 = function () {
        return (this.readWORD() << 16) >> 16;
    };
    Stream.prototype.readUInt32 = function () {
        return this.readDWORD();
    };
    return Stream;
}());
exports["default"] = Stream;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.GeneratorEnumeratorTable = [
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
exports.InfoNameTable = {
    ICMT: "comment",
    ICOP: "copyright",
    ICRD: "creation_date",
    IENG: "engineer",
    INAM: "name",
    IPRD: "product",
    ISFT: "software",
    ifil: "version",
    isng: "sound_engine",
    irom: "rom_name",
    iver: "rom_version"
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var RiffParser_1 = __webpack_require__(3);
var Structs_1 = __webpack_require__(4);
var readString_1 = __webpack_require__(5);
var Stream_1 = __webpack_require__(0);
var Constants_1 = __webpack_require__(1);
function parse(input, option) {
    if (option === void 0) { option = {}; }
    // parse RIFF chunk
    var chunkList = RiffParser_1.parseRiff(input, 0, input.length, option);
    if (chunkList.length !== 1) {
        throw new Error('wrong chunk length');
    }
    var chunk = chunkList[0];
    if (chunk === null) {
        throw new Error('chunk not found');
    }
    function parseRiffChunk(chunk, data) {
        var chunkList = getChunkList(chunk, data, "RIFF", "sfbk");
        if (chunkList.length !== 3) {
            throw new Error('invalid sfbk structure');
        }
        return __assign({ 
            // INFO-list
            info: parseInfoList(chunkList[0], data), 
            // sdta-list
            samplingData: parseSdtaList(chunkList[1], data) }, parsePdtaList(chunkList[2], data));
    }
    function parsePdtaList(chunk, data) {
        var chunkList = getChunkList(chunk, data, "LIST", "pdta");
        // check number of chunks
        if (chunkList.length !== 9) {
            throw new Error('invalid pdta chunk');
        }
        return {
            presetHeader: parsePhdr(chunkList[0], data),
            presetZone: parsePbag(chunkList[1], data),
            presetZoneModulator: parsePmod(chunkList[2], data),
            presetZoneGenerator: parsePgen(chunkList[3], data),
            instrument: parseInst(chunkList[4], data),
            instrumentZone: parseIbag(chunkList[5], data),
            instrumentZoneModulator: parseImod(chunkList[6], data),
            instrumentZoneGenerator: parseIgen(chunkList[7], data),
            sampleHeader: parseShdr(chunkList[8], data)
        };
    }
    var result = parseRiffChunk(chunk, input);
    return __assign({}, result, { sample: loadSample(result.sampleHeader, result.samplingData.offset, input) });
}
exports["default"] = parse;
function getChunkList(chunk, data, expectedType, expectedSignature) {
    // check parse target
    if (chunk.type !== expectedType) {
        throw new Error('invalid chunk type:' + chunk.type);
    }
    var stream = new Stream_1["default"](data, chunk.offset);
    // check signature
    var signature = stream.readString(4);
    if (signature !== expectedSignature) {
        throw new Error('invalid signature:' + signature);
    }
    // read structure
    return RiffParser_1.parseRiff(data, stream.ip, chunk.size - 4);
}
function parseInfoList(chunk, data) {
    var info = {};
    var chunkList = getChunkList(chunk, data, "LIST", "INFO");
    for (var _i = 0, chunkList_1 = chunkList; _i < chunkList_1.length; _i++) {
        var p = chunkList_1[_i];
        var offset = p.offset, size = p.size, type = p.type;
        var name_1 = Constants_1.InfoNameTable[type] || type;
        info[name_1] = readString_1.readString(data, offset, offset + size);
    }
    return info;
}
function parseSdtaList(chunk, data) {
    var chunkList = getChunkList(chunk, data, "LIST", "sdta");
    if (chunkList.length !== 1) {
        throw new Error('TODO');
    }
    return chunkList[0];
}
function parseChunk(chunk, data, type, factory) {
    var result = [];
    if (chunk.type !== type) {
        throw new Error('invalid chunk type:' + chunk.type);
    }
    var stream = new Stream_1["default"](data, chunk.offset);
    var size = chunk.offset + chunk.size;
    while (stream.ip < size) {
        result.push(factory(stream));
    }
    return result;
}
var parsePhdr = function (chunk, data) { return parseChunk(chunk, data, "phdr", function (stream) { return Structs_1.PresetHeader.parse(stream); }).filter(function (p) { return p.presetName !== "EOP"; }); };
var parsePbag = function (chunk, data) { return parseChunk(chunk, data, "pbag", function (stream) { return Structs_1.PresetBag.parse(stream); }); };
var parseInst = function (chunk, data) { return parseChunk(chunk, data, "inst", function (stream) { return Structs_1.Instrument.parse(stream); }).filter(function (i) { return i.instrumentName !== "EOI"; }); };
var parseIbag = function (chunk, data) { return parseChunk(chunk, data, "ibag", function (stream) { return Structs_1.InstrumentBag.parse(stream); }); };
var parsePmod = function (chunk, data) { return parseChunk(chunk, data, "pmod", function (stream) { return Structs_1.ModulatorList.parse(stream); }); };
var parseImod = function (chunk, data) { return parseChunk(chunk, data, "imod", function (stream) { return Structs_1.ModulatorList.parse(stream); }); };
var parsePgen = function (chunk, data) { return parseChunk(chunk, data, "pgen", function (stream) { return Structs_1.GeneratorList.parse(stream); }); };
var parseIgen = function (chunk, data) { return parseChunk(chunk, data, "igen", function (stream) { return Structs_1.GeneratorList.parse(stream); }); };
var parseShdr = function (chunk, data) { return parseChunk(chunk, data, "shdr", function (stream) { return Structs_1.Sample.parse(stream); }).filter(function (s) { return s.sampleName !== "EOS"; }); };
function adjustSampleData(sample, sampleRate) {
    var multiply = 1;
    // buffer
    while (sampleRate < 22050) {
        var newSample = new Int16Array(sample.length * 2);
        for (var i = 0, j = 0, il = sample.length; i < il; ++i) {
            newSample[j++] = sample[i];
            newSample[j++] = sample[i];
        }
        sample = newSample;
        multiply *= 2;
        sampleRate *= 2;
    }
    return {
        sample: sample,
        multiply: multiply
    };
}
function loadSample(sampleHeader, samplingDataOffset, data) {
    return sampleHeader.map(function (header) {
        var sample = new Int16Array(new Uint8Array(data.subarray(samplingDataOffset + header.start * 2, samplingDataOffset + header.end * 2)).buffer);
        if (header.sampleRate > 0) {
            var adjust = adjustSampleData(sample, header.sampleRate);
            sample = adjust.sample;
            header.sampleRate *= adjust.multiply;
            header.startLoop *= adjust.multiply;
            header.endLoop *= adjust.multiply;
        }
        return sample;
    });
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Stream_1 = __webpack_require__(0);
function parseChunk(input, ip, bigEndian) {
    var stream = new Stream_1["default"](input, ip);
    var type = stream.readString(4);
    var size = stream.readDWORD(bigEndian);
    return new Chunk(type, size, stream.ip);
}
function parseRiff(input, index, length, _a) {
    if (index === void 0) { index = 0; }
    var _b = _a === void 0 ? {} : _a, _c = _b.padding, padding = _c === void 0 ? true : _c, _d = _b.bigEndian, bigEndian = _d === void 0 ? false : _d;
    var chunkList = [];
    var end = length + index;
    var ip = index;
    while (ip < end) {
        var chunk = parseChunk(input, ip, bigEndian);
        ip = chunk.offset + chunk.size;
        // padding
        if (padding && ((ip - index) & 1) === 1) {
            ip++;
        }
        chunkList.push(chunk);
    }
    return chunkList;
}
exports.parseRiff = parseRiff;
var Chunk = /** @class */ (function () {
    function Chunk(type, size, offset) {
        this.type = type;
        this.size = size;
        this.offset = offset;
    }
    return Chunk;
}());
exports.Chunk = Chunk;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Constants_1 = __webpack_require__(1);
var VersionTag = /** @class */ (function () {
    function VersionTag() {
    }
    return VersionTag;
}());
exports.VersionTag = VersionTag;
var PresetHeader = /** @class */ (function () {
    function PresetHeader() {
    }
    PresetHeader.parse = function (stream) {
        var p = new PresetHeader();
        p.presetName = stream.readString(20);
        p.preset = stream.readWORD();
        p.bank = stream.readWORD();
        p.presetBagIndex = stream.readWORD();
        p.library = stream.readDWORD();
        p.genre = stream.readDWORD();
        p.morphology = stream.readDWORD();
        return p;
    };
    return PresetHeader;
}());
exports.PresetHeader = PresetHeader;
var PresetBag = /** @class */ (function () {
    function PresetBag() {
    }
    PresetBag.parse = function (stream) {
        var p = new PresetBag();
        p.presetGeneratorIndex = stream.readWORD();
        p.presetModulatorIndex = stream.readWORD();
        return p;
    };
    return PresetBag;
}());
exports.PresetBag = PresetBag;
var ModulatorList = /** @class */ (function () {
    function ModulatorList() {
    }
    ModulatorList.parse = function (stream) {
        var t = new ModulatorList();
        t.sourceOper = stream.readWORD();
        var code = stream.readWORD();
        t.destinationOper = code;
        var key = Constants_1.GeneratorEnumeratorTable[code];
        t.type = key;
        if (key === void 0) {
            // Amount
            t.value = {
                code: code,
                amount: stream.readInt16()
            };
        }
        else {
            // Amount
            switch (key) {
                case 'keyRange': /* FALLTHROUGH */
                case 'velRange': /* FALLTHROUGH */
                case 'keynum': /* FALLTHROUGH */
                case 'velocity':
                    t.value = {
                        lo: stream.readByte(),
                        hi: stream.readByte()
                    };
                    break;
                default:
                    t.value = {
                        amount: stream.readInt16()
                    };
                    break;
            }
        }
        t.amountSourceOper = stream.readWORD();
        t.transOper = stream.readWORD();
        return t;
    };
    return ModulatorList;
}());
exports.ModulatorList = ModulatorList;
var GeneratorList = /** @class */ (function () {
    function GeneratorList() {
    }
    GeneratorList.parse = function (stream) {
        var t = new ModulatorList();
        var code = stream.readWORD();
        var key = Constants_1.GeneratorEnumeratorTable[code];
        t.type = key;
        if (key === void 0) {
            t.value = {
                code: code,
                amount: stream.readInt16()
            };
        }
        else {
            switch (key) {
                case 'keynum': /* FALLTHROUGH */
                case 'keyRange': /* FALLTHROUGH */
                case 'velRange': /* FALLTHROUGH */
                case 'velocity':
                    t.value = {
                        lo: stream.readByte(),
                        hi: stream.readByte()
                    };
                    break;
                default:
                    t.value = {
                        amount: stream.readInt16()
                    };
                    break;
            }
        }
        return t;
    };
    return GeneratorList;
}());
exports.GeneratorList = GeneratorList;
var Instrument = /** @class */ (function () {
    function Instrument() {
    }
    Instrument.parse = function (stream) {
        var t = new Instrument();
        t.instrumentName = stream.readString(20);
        t.instrumentBagIndex = stream.readWORD();
        return t;
    };
    return Instrument;
}());
exports.Instrument = Instrument;
var InstrumentBag = /** @class */ (function () {
    function InstrumentBag() {
    }
    InstrumentBag.parse = function (stream) {
        var t = new InstrumentBag();
        t.instrumentGeneratorIndex = stream.readWORD();
        t.instrumentModulatorIndex = stream.readWORD();
        return t;
    };
    return InstrumentBag;
}());
exports.InstrumentBag = InstrumentBag;
var Sample = /** @class */ (function () {
    function Sample() {
    }
    Sample.parse = function (stream) {
        var s = new Sample();
        s.sampleName = stream.readString(20);
        s.start = stream.readDWORD();
        s.end = stream.readDWORD();
        s.startLoop = stream.readDWORD();
        s.endLoop = stream.readDWORD();
        s.sampleRate = stream.readDWORD();
        s.originalPitch = stream.readByte();
        s.pitchCorrection = stream.readInt8();
        s.sampleLink = stream.readWORD();
        s.sampleType = stream.readWORD();
        s.startLoop -= s.start;
        s.endLoop -= s.start;
        return s;
    };
    return Sample;
}());
exports.Sample = Sample;
exports.SampleLink = {
    monoSample: 1,
    rightSample: 2,
    leftSample: 4,
    linkedSample: 8,
    RomMonoSample: 0x8001,
    RomRightSample: 0x8002,
    RomLeftSample: 0x8004,
    RomLinkedSample: 0x8008
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
function readString(data, start, end) {
    var str = String.fromCharCode.apply(null, data.subarray(start, end));
    var nullLocation = str.indexOf("\u0000");
    if (nullLocation > 0) {
        return str.substr(0, nullLocation);
    }
    return str;
}
exports.readString = readString;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_Parser_ts__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_Parser_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__src_Parser_ts__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "Parser", function() { return __WEBPACK_IMPORTED_MODULE_0__src_Parser_ts___default.a; });



/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5YjJlZmVhNDRiMGFlMDlhZTg4ZSIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmlmZlBhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3RydWN0cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhZFN0cmluZy50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUM3REE7SUFJRSxnQkFBWSxJQUFJLEVBQUUsTUFBTTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUk7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNO0lBQ2xCLENBQUM7SUFFRCwyQkFBVSxHQUFWLFVBQVcsSUFBWTtRQUNyQixJQUFNLEdBQUcsR0FBRyxN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QU0sQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDO0lBQ3BDLENBQUM7SUFDRCxNQUFNLENBQUMsR0FBRztBQUNaLENBQUM7QUFQRCxnQ0FPQzs7Ozs7Ozs7Ozs7O0FDUEQiLCJmaWxlIjoic2YyLnBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDliMmVmZWE0NGIwYWUwOWFlODhlIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcclxuICBwcml2YXRlIGRhdGE6IFVpbnQ4QXJyYXlcclxuICBpcDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9mZnNldCkge1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YVxyXG4gICAgdGhpcy5pcCA9IG9mZnNldFxyXG4gIH1cclxuXHJcbiAgcmVhZFN0cmluZyhzaXplOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCB0aGlzLmRhdGEuc3ViYXJyYXkodGhpcy5pcCwgdGhpcy5pcCArPSBzaXplKSlcclxuICAgIGNvbnN0IG51bGxMb2NhdGlvbiA9IHN0ci5pbmRleE9mKFwiXFx1MDAwMFwiKVxyXG4gICAgaWYgKG51bGxMb2NhdGlvbiA+IDApIHtcclxuICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMCwgbnVsbExvY2F0aW9uKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0clxyXG4gIH1cclxuXHJcbiAgcmVhZFdPUkQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCsrXSB8ICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KVxyXG4gIH1cclxuXHJcbiAgcmVhZERXT1JEKGJpZ0VuZGlhbjogYm9vbGVhbiA9IGZhbHNlKTogbnVtYmVyIHtcclxuICAgIGlmIChiaWdFbmRpYW4pIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICB0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAyNHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDE2KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSlcclxuICAgICAgKSA+Pj4gMFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICB0aGlzLmRhdGFbdGhpcy5pcCsrXSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAxNikgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMjQpXHJcbiAgICAgICkgPj4+IDBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlYWRCeXRlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwKytdXHJcbiAgfVxyXG5cclxuICByZWFkQXQob2Zmc2V0OiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCArIG9mZnNldF1cclxuICB9XHJcblxyXG4gIC8qIGhlbHBlciAqL1xyXG5cclxuICByZWFkVUludDgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkQnl0ZSgpXHJcbiAgfVxyXG4gIFxyXG4gIHJlYWRJbnQ4KCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnJlYWRCeXRlKCkgPDwgMjQpID4+IDI0XHJcbiAgfVxyXG4gIFxyXG4gIHJlYWRVSW50MTYoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkV09SRCgpXHJcbiAgfVxyXG5cclxuICByZWFkSW50MTYoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMucmVhZFdPUkQoKSA8PCAxNikgPj4gMTZcclxuICB9XHJcblxyXG4gIHJlYWRVSW50MzIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkRFdPUkQoKVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3RyZWFtLnRzIiwiZXhwb3J0IGNvbnN0IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZSA9IFtcclxuICAnc3RhcnRBZGRyc09mZnNldCcsXHJcbiAgJ2VuZEFkZHJzT2Zmc2V0JyxcclxuICAnc3RhcnRsb29wQWRkcnNPZmZzZXQnLFxyXG4gICdlbmRsb29wQWRkcnNPZmZzZXQnLFxyXG4gICdzdGFydEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnbW9kTGZvVG9QaXRjaCcsXHJcbiAgJ3ZpYkxmb1RvUGl0Y2gnLFxyXG4gICdtb2RFbnZUb1BpdGNoJyxcclxuICAnaW5pdGlhbEZpbHRlckZjJyxcclxuICAnaW5pdGlhbEZpbHRlclEnLFxyXG4gICdtb2RMZm9Ub0ZpbHRlckZjJyxcclxuICAnbW9kRW52VG9GaWx0ZXJGYycsXHJcbiAgJ2VuZEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnbW9kTGZvVG9Wb2x1bWUnLFxyXG4gIHVuZGVmaW5lZCwgLy8gMTRcclxuICAnY2hvcnVzRWZmZWN0c1NlbmQnLFxyXG4gICdyZXZlcmJFZmZlY3RzU2VuZCcsXHJcbiAgJ3BhbicsXHJcbiAgdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsIC8vIDE4LDE5LDIwXHJcbiAgJ2RlbGF5TW9kTEZPJyxcclxuICAnZnJlcU1vZExGTycsXHJcbiAgJ2RlbGF5VmliTEZPJyxcclxuICAnZnJlcVZpYkxGTycsXHJcbiAgJ2RlbGF5TW9kRW52JyxcclxuICAnYXR0YWNrTW9kRW52JyxcclxuICAnaG9sZE1vZEVudicsXHJcbiAgJ2RlY2F5TW9kRW52JyxcclxuICAnc3VzdGFpbk1vZEVudicsXHJcbiAgJ3JlbGVhc2VNb2RFbnYnLFxyXG4gICdrZXludW1Ub01vZEVudkhvbGQnLFxyXG4gICdrZXludW1Ub01vZEVudkRlY2F5JyxcclxuICAnZGVsYXlWb2xFbnYnLFxyXG4gICdhdHRhY2tWb2xFbnYnLFxyXG4gICdob2xkVm9sRW52JyxcclxuICAnZGVjYXlWb2xFbnYnLFxyXG4gICdzdXN0YWluVm9sRW52JyxcclxuICAncmVsZWFzZVZvbEVudicsXHJcbiAgJ2tleW51bVRvVm9sRW52SG9sZCcsXHJcbiAgJ2tleW51bVRvVm9sRW52RGVjYXknLFxyXG4gICdpbnN0cnVtZW50JyxcclxuICB1bmRlZmluZWQsIC8vIDQyXHJcbiAgJ2tleVJhbmdlJyxcclxuICAndmVsUmFuZ2UnLFxyXG4gICdzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ2tleW51bScsXHJcbiAgJ3ZlbG9jaXR5JyxcclxuICAnaW5pdGlhbEF0dGVudWF0aW9uJyxcclxuICB1bmRlZmluZWQsIC8vIDQ5XHJcbiAgJ2VuZGxvb3BBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ2NvYXJzZVR1bmUnLFxyXG4gICdmaW5lVHVuZScsXHJcbiAgJ3NhbXBsZUlEJyxcclxuICAnc2FtcGxlTW9kZXMnLFxyXG4gIHVuZGVmaW5lZCwgLy8gNTVcclxuICAnc2NhbGVUdW5pbmcnLFxyXG4gICdleGNsdXNpdmVDbGFzcycsXHJcbiAgJ292ZXJyaWRpbmdSb290S2V5J1xyXG5dXHJcblxyXG5leHBvcnQgY29uc3QgSW5mb05hbWVUYWJsZSA9IHtcclxuICBJQ01UOiBcImNvbW1lbnRcIixcclxuICBJQ09QOiBcImNvcHlyaWdodFwiLFxyXG4gIElDUkQ6IFwiY3JlYXRpb25fZGF0ZVwiLFxyXG4gIElFTkc6IFwiZW5naW5lZXJcIixcclxuICBJTkFNOiBcIm5hbWVcIixcclxuICBJUFJEOiBcInByb2R1Y3RcIixcclxuICBJU0ZUOiBcInNvZnR3YXJlXCIsXHJcbiAgaWZpbDogXCJ2ZXJzaW9uXCIsXHJcbiAgaXNuZzogXCJzb3VuZF9lbmdpbmVcIixcclxuICBpcm9tOiBcInJvbV9uYW1lXCIsXHJcbiAgaXZlcjogXCJyb21fdmVyc2lvblwiXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbnN0YW50cy50cyIsImltcG9ydCB7IHBhcnNlUmlmZiwgQ2h1bmssIE9wdGlvbnMgYXMgUmlmZlBhcnNlck9wdGlvbnMgfSBmcm9tIFwiLi9SaWZmUGFyc2VyXCJcclxuaW1wb3J0IHsgUHJlc2V0SGVhZGVyLCBTYW1wbGUsIFByZXNldEJhZywgSW5zdHJ1bWVudCwgSW5zdHJ1bWVudEJhZywgTW9kdWxhdG9yTGlzdCwgR2VuZXJhdG9yTGlzdCB9IGZyb20gXCIuL1N0cnVjdHNcIlxyXG5pbXBvcnQgeyByZWFkU3RyaW5nIH0gZnJvbSBcIi4vcmVhZFN0cmluZ1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuaW1wb3J0IHsgSW5mb05hbWVUYWJsZSB9IGZyb20gXCIuL0NvbnN0YW50c1wiXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlUmVzdWx0IHtcclxuICBwcmVzZXRIZWFkZXI6IFByZXNldEhlYWRlcltdXHJcbiAgcHJlc2V0Wm9uZTogUHJlc2V0QmFnW11cclxuICBwcmVzZXRab25lTW9kdWxhdG9yOiBNb2R1bGF0b3JMaXN0W11cclxuICBwcmVzZXRab25lR2VuZXJhdG9yOiBNb2R1bGF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50OiBJbnN0cnVtZW50W11cclxuICBpbnN0cnVtZW50Wm9uZTogSW5zdHJ1bWVudEJhZ1tdXHJcbiAgaW5zdHJ1bWVudFpvbmVNb2R1bGF0b3I6IE1vZHVsYXRvckxpc3RbXVxyXG4gIGluc3RydW1lbnRab25lR2VuZXJhdG9yOiBNb2R1bGF0b3JMaXN0W11cclxuICBzYW1wbGVIZWFkZXI6IFNhbXBsZVtdXHJcbiAgc2FtcGxlOiBJbnQxNkFycmF5W11cclxuICBzYW1wbGluZ0RhdGE6IENodW5rXHJcbiAgaW5mbzogeyBbaW5kZXg6IHN0cmluZ106IHN0cmluZyB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlKGlucHV0OiBVaW50OEFycmF5LCBvcHRpb246IFJpZmZQYXJzZXJPcHRpb25zID0ge30pOiBQYXJzZVJlc3VsdCB7XHJcblxyXG4gIC8vIHBhcnNlIFJJRkYgY2h1bmtcclxuICBjb25zdCBjaHVua0xpc3QgPSBwYXJzZVJpZmYoaW5wdXQsIDAsIGlucHV0Lmxlbmd0aCwgb3B0aW9uKVxyXG5cclxuICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBjaHVuayBsZW5ndGgnKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2h1bmsgPSBjaHVua0xpc3RbMF1cclxuICBpZiAoY2h1bmsgPT09IG51bGwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignY2h1bmsgbm90IGZvdW5kJylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlUmlmZkNodW5rKGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gICAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIlJJRkZcIiwgXCJzZmJrXCIpXHJcblxyXG4gICAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDMpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNmYmsgc3RydWN0dXJlJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAvLyBJTkZPLWxpc3RcclxuICAgICAgaW5mbzogcGFyc2VJbmZvTGlzdChjaHVua0xpc3RbMF0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gc2R0YS1saXN0XHJcbiAgICAgIHNhbXBsaW5nRGF0YTogcGFyc2VTZHRhTGlzdChjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gcGR0YS1saXN0XHJcbiAgICAgIC4uLnBhcnNlUGR0YUxpc3QoY2h1bmtMaXN0WzJdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VQZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwicGR0YVwiKVxyXG5cclxuICAgIC8vIGNoZWNrIG51bWJlciBvZiBjaHVua3NcclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSA5KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwZHRhIGNodW5rJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwcmVzZXRIZWFkZXI6IHBhcnNlUGhkcihjaHVua0xpc3RbMF0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRab25lOiBwYXJzZVBiYWcoY2h1bmtMaXN0WzFdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0Wm9uZU1vZHVsYXRvcjogcGFyc2VQbW9kKGNodW5rTGlzdFsyXSwgZGF0YSksXHJcbiAgICAgIHByZXNldFpvbmVHZW5lcmF0b3I6IHBhcnNlUGdlbihjaHVua0xpc3RbM10sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50OiBwYXJzZUluc3QoY2h1bmtMaXN0WzRdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudFpvbmU6IHBhcnNlSWJhZyhjaHVua0xpc3RbNV0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50Wm9uZU1vZHVsYXRvcjogcGFyc2VJbW9kKGNodW5rTGlzdFs2XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRab25lR2VuZXJhdG9yOiBwYXJzZUlnZW4oY2h1bmtMaXN0WzddLCBkYXRhKSxcclxuICAgICAgc2FtcGxlSGVhZGVyOiBwYXJzZVNoZHIoY2h1bmtMaXN0WzhdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVzdWx0ID0gcGFyc2VSaWZmQ2h1bmsoY2h1bmssIGlucHV0KVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgLi4ucmVzdWx0LFxyXG4gICAgc2FtcGxlOiBsb2FkU2FtcGxlKHJlc3VsdC5zYW1wbGVIZWFkZXIsIHJlc3VsdC5zYW1wbGluZ0RhdGEub2Zmc2V0LCBpbnB1dClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgZXhwZWN0ZWRUeXBlLCBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSBleHBlY3RlZFR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcblxyXG4gIC8vIGNoZWNrIHNpZ25hdHVyZVxyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgaWYgKHNpZ25hdHVyZSAhPT0gZXhwZWN0ZWRTaWduYXR1cmUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaWduYXR1cmU6JyArIHNpZ25hdHVyZSlcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcmV0dXJuIHBhcnNlUmlmZihkYXRhLCBzdHJlYW0uaXAsIGNodW5rLnNpemUgLSA0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUluZm9MaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gIGNvbnN0IGluZm86IHsgW2luZGV4OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJJTkZPXCIpXHJcblxyXG4gIGZvciAobGV0IHAgb2YgY2h1bmtMaXN0KSB7XHJcbiAgICBjb25zdCB7IG9mZnNldCwgc2l6ZSwgdHlwZSB9ID0gcFxyXG4gICAgY29uc3QgbmFtZSA9IEluZm9OYW1lVGFibGVbdHlwZV0gfHwgdHlwZVxyXG4gICAgaW5mb1tuYW1lXSA9IHJlYWRTdHJpbmcoZGF0YSwgb2Zmc2V0LCBvZmZzZXQgKyBzaXplKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGluZm9cclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpOiBDaHVuayB7XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJzZHRhXCIpXHJcblxyXG4gIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAxKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RPRE8nKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFswXVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rPFQ+KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSwgdHlwZTogc3RyaW5nLCBmYWN0b3J5OiAoU3RyZWFtKSA9PiBUKTogVFtdIHtcclxuICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdXHJcblxyXG4gIGlmIChjaHVuay50eXBlICE9PSB0eXBlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICArIGNodW5rLnR5cGUpXHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oZGF0YSwgY2h1bmsub2Zmc2V0KVxyXG4gIGNvbnN0IHNpemUgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplXHJcbiAgXHJcbiAgd2hpbGUgKHN0cmVhbS5pcCA8IHNpemUpIHtcclxuICAgIHJlc3VsdC5wdXNoKGZhY3Rvcnkoc3RyZWFtKSlcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuY29uc3QgcGFyc2VQaGRyID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBoZHJcIiwgc3RyZWFtID0+IFByZXNldEhlYWRlci5wYXJzZShzdHJlYW0pKS5maWx0ZXIocCA9PiBwLnByZXNldE5hbWUgIT09IFwiRU9QXCIpXHJcbmNvbnN0IHBhcnNlUGJhZyA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwYmFnXCIsIHN0cmVhbSA9PiBQcmVzZXRCYWcucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VJbnN0ID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImluc3RcIiwgc3RyZWFtID0+IEluc3RydW1lbnQucGFyc2Uoc3RyZWFtKSkuZmlsdGVyKGkgPT4gaS5pbnN0cnVtZW50TmFtZSAhPT0gXCJFT0lcIilcclxuY29uc3QgcGFyc2VJYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImliYWdcIiwgc3RyZWFtID0+IEluc3RydW1lbnRCYWcucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VQbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBtb2RcIiwgc3RyZWFtID0+IE1vZHVsYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VJbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImltb2RcIiwgc3RyZWFtID0+IE1vZHVsYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VQZ2VuID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBnZW5cIiwgc3RyZWFtID0+IEdlbmVyYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VJZ2VuID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImlnZW5cIiwgc3RyZWFtID0+IEdlbmVyYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VTaGRyID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInNoZHJcIiwgc3RyZWFtID0+IFNhbXBsZS5wYXJzZShzdHJlYW0pKS5maWx0ZXIocyA9PiBzLnNhbXBsZU5hbWUgIT09IFwiRU9TXCIpXHJcblxyXG5mdW5jdGlvbiBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgc2FtcGxlUmF0ZSkge1xyXG4gIGxldCBtdWx0aXBseSA9IDFcclxuXHJcbiAgLy8gYnVmZmVyXHJcbiAgd2hpbGUgKHNhbXBsZVJhdGUgPCAyMjA1MCkge1xyXG4gICAgY29uc3QgbmV3U2FtcGxlID0gbmV3IEludDE2QXJyYXkoc2FtcGxlLmxlbmd0aCAqIDIpXHJcbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDAsIGlsID0gc2FtcGxlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgIH1cclxuICAgIHNhbXBsZSA9IG5ld1NhbXBsZVxyXG4gICAgbXVsdGlwbHkgKj0gMlxyXG4gICAgc2FtcGxlUmF0ZSAqPSAyXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2FtcGxlLFxyXG4gICAgbXVsdGlwbHlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTYW1wbGUoc2FtcGxlSGVhZGVyOiBTYW1wbGVbXSwgc2FtcGxpbmdEYXRhT2Zmc2V0OiBudW1iZXIsIGRhdGE6IFVpbnQ4QXJyYXkpOiBJbnQxNkFycmF5W10ge1xyXG4gIHJldHVybiBzYW1wbGVIZWFkZXIubWFwKGhlYWRlciA9PiB7XHJcbiAgICBsZXQgc2FtcGxlID0gbmV3IEludDE2QXJyYXkobmV3IFVpbnQ4QXJyYXkoZGF0YS5zdWJhcnJheShcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLnN0YXJ0ICogMixcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLmVuZCAgICogMlxyXG4gICAgKSkuYnVmZmVyKVxyXG4gICAgaWYgKGhlYWRlci5zYW1wbGVSYXRlID4gMCkge1xyXG4gICAgICBjb25zdCBhZGp1c3QgPSBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgaGVhZGVyLnNhbXBsZVJhdGUpXHJcbiAgICAgIHNhbXBsZSA9IGFkanVzdC5zYW1wbGVcclxuICAgICAgaGVhZGVyLnNhbXBsZVJhdGUgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5zdGFydExvb3AgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5lbmRMb29wICo9IGFkanVzdC5tdWx0aXBseVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNhbXBsZVxyXG4gIH0pXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGFyc2VyLnRzIiwiaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9TdHJlYW1cIlxyXG5cclxuZnVuY3Rpb24gcGFyc2VDaHVuayhpbnB1dDogVWludDhBcnJheSwgaXA6IG51bWJlciwgYmlnRW5kaWFuOiBib29sZWFuKTogQ2h1bmsge1xyXG4gIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oaW5wdXQsIGlwKVxyXG4gIGNvbnN0IHR5cGUgPSBzdHJlYW0ucmVhZFN0cmluZyg0KVxyXG4gIGNvbnN0IHNpemUgPSBzdHJlYW0ucmVhZERXT1JEKGJpZ0VuZGlhbilcclxuICByZXR1cm4gbmV3IENodW5rKHR5cGUsIHNpemUsIHN0cmVhbS5pcClcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcclxuICBwYWRkaW5nPzogYm9vbGVhbixcclxuICBiaWdFbmRpYW4/OiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJpZmYoaW5wdXQ6IFVpbnQ4QXJyYXksIGluZGV4OiBudW1iZXIgPSAwLCBsZW5ndGg6IG51bWJlciwgeyBwYWRkaW5nID0gdHJ1ZSwgYmlnRW5kaWFuID0gZmFsc2UgfTogT3B0aW9ucyA9IHt9KSB7XHJcbiAgY29uc3QgY2h1bmtMaXN0OiBDaHVua1tdID0gW11cclxuICBjb25zdCBlbmQgPSBsZW5ndGggKyBpbmRleFxyXG4gIGxldCBpcCA9IGluZGV4XHJcblxyXG4gIHdoaWxlIChpcCA8IGVuZCkge1xyXG4gICAgY29uc3QgY2h1bmsgPSBwYXJzZUNodW5rKGlucHV0LCBpcCwgYmlnRW5kaWFuKVxyXG4gICAgaXAgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplXHJcbiAgICBcclxuICAgIC8vIHBhZGRpbmdcclxuICAgIGlmIChwYWRkaW5nICYmICgoaXAgLSBpbmRleCkgJiAxKSA9PT0gMSkge1xyXG4gICAgICBpcCsrXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNodW5rTGlzdC5wdXNoKGNodW5rKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2h1bmsge1xyXG4gIHR5cGU6IHN0cmluZ1xyXG4gIHNpemU6IG51bWJlclxyXG4gIG9mZnNldDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgdGhpcy5zaXplID0gc2l6ZVxyXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JpZmZQYXJzZXIudHMiLCJpbXBvcnQgeyBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgfSBmcm9tIFwiLi9Db25zdGFudHNcIlxyXG5pbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcblxyXG5leHBvcnQgY2xhc3MgVmVyc2lvblRhZyB7XHJcbiAgbWFqb3I6IG51bWJlclxyXG4gIG1pbm9yOiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByZXNldEhlYWRlciB7XHJcbiAgcHJlc2V0TmFtZTogc3RyaW5nXHJcbiAgcHJlc2V0OiBudW1iZXJcclxuICBiYW5rOiBudW1iZXJcclxuICBwcmVzZXRCYWdJbmRleDogbnVtYmVyXHJcbiAgbGlicmFyeTogbnVtYmVyXHJcbiAgZ2VucmU6IG51bWJlclxyXG4gIG1vcnBob2xvZ3k6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0SGVhZGVyKClcclxuICAgIHAucHJlc2V0TmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcC5wcmVzZXQgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5iYW5rID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAucHJlc2V0QmFnSW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5saWJyYXJ5ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLmdlbnJlID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLm1vcnBob2xvZ3kgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlc2V0QmFnIHtcclxuICBwcmVzZXRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgcHJlc2V0TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0QmFnKClcclxuICAgIHAucHJlc2V0R2VuZXJhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gcFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBbW91bnRWYWx1ZSB7XHJcbiAgY29kZT86IG51bWJlclxyXG4gIGFtb3VudDogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmFuZ2VWYWx1ZSB7XHJcbiAgbG86IG51bWJlclxyXG4gIGhpOiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vZHVsYXRvckxpc3Qge1xyXG4gIHNvdXJjZU9wZXI6IG51bWJlclxyXG4gIGRlc3RpbmF0aW9uT3BlcjogbnVtYmVyXHJcbiAgdmFsdWU6IEFtb3VudFZhbHVlfFJhbmdlVmFsdWVcclxuICBhbW91bnRTb3VyY2VPcGVyOiBudW1iZXJcclxuICB0cmFuc09wZXI6IG51bWJlclxyXG4gIHR5cGU6IHN0cmluZ1xyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgTW9kdWxhdG9yTGlzdCgpXHJcblxyXG4gICAgdC5zb3VyY2VPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIGNvbnN0IGNvZGUgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC5kZXN0aW5hdGlvbk9wZXIgPSBjb2RlXHJcbiAgICBcclxuICAgIGNvbnN0IGtleSA9IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZVtjb2RlXVxyXG4gICAgdC50eXBlID0ga2V5IVxyXG5cclxuICAgIGlmIChrZXkgPT09IHZvaWQgMCkge1xyXG4gICAgICAvLyBBbW91bnRcclxuICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICBjb2RlOiBjb2RlLFxyXG4gICAgICAgIGFtb3VudDogc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEFtb3VudFxyXG4gICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgIGNhc2UgJ2tleVJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICd2ZWxSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICd2ZWxvY2l0eSc6XHJcbiAgICAgICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgICAgICBsbzogc3RyZWFtLnJlYWRCeXRlKCksXHJcbiAgICAgICAgICAgIGhpOiBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICAgICAgYW1vdW50OiBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgdC5hbW91bnRTb3VyY2VPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQudHJhbnNPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdlbmVyYXRvckxpc3Qge1xyXG4gIHR5cGU6IHN0cmluZ1xyXG4gIHZhbHVlOiBBbW91bnRWYWx1ZXxSYW5nZVZhbHVlXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBNb2R1bGF0b3JMaXN0KClcclxuICAgIFxyXG4gICAgY29uc3QgY29kZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBjb25zdCBrZXkgPSBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGVbY29kZV1cclxuICAgIHQudHlwZSA9IGtleSFcclxuXHJcbiAgICBpZiAoa2V5ID09PSB2b2lkIDApIHtcclxuICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICBjb2RlLFxyXG4gICAgICAgIGFtb3VudDogc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsUmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGxvOiBzdHJlYW0ucmVhZEJ5dGUoKSxcclxuICAgICAgICAgICAgaGk6IHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgICAgICBhbW91bnQ6IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudCB7XHJcbiAgaW5zdHJ1bWVudE5hbWU6IHN0cmluZ1xyXG4gIGluc3RydW1lbnRCYWdJbmRleDogbnVtYmVyXHJcbiAgXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IEluc3RydW1lbnQoKVxyXG4gICAgdC5pbnN0cnVtZW50TmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgdC5pbnN0cnVtZW50QmFnSW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbnN0cnVtZW50QmFnIHtcclxuICBpbnN0cnVtZW50R2VuZXJhdG9ySW5kZXg6IG51bWJlclxyXG4gIGluc3RydW1lbnRNb2R1bGF0b3JJbmRleDogbnVtYmVyXHJcbiAgXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IEluc3RydW1lbnRCYWcoKVxyXG4gICAgdC5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC5pbnN0cnVtZW50TW9kdWxhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTYW1wbGUge1xyXG4gIHNhbXBsZU5hbWU6IHN0cmluZ1xyXG4gIHN0YXJ0OiBudW1iZXJcclxuICBlbmQ6IG51bWJlclxyXG4gIHN0YXJ0TG9vcDogbnVtYmVyXHJcbiAgZW5kTG9vcDogbnVtYmVyXHJcbiAgc2FtcGxlUmF0ZTogbnVtYmVyXHJcbiAgb3JpZ2luYWxQaXRjaDogbnVtYmVyXHJcbiAgcGl0Y2hDb3JyZWN0aW9uOiBudW1iZXJcclxuICBzYW1wbGVMaW5rOiBudW1iZXJcclxuICBzYW1wbGVUeXBlOiBudW1iZXJcclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCBzID0gbmV3IFNhbXBsZSgpXHJcblxyXG4gICAgcy5zYW1wbGVOYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICBzLnN0YXJ0ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmVuZCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5zdGFydExvb3AgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuZW5kTG9vcCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5zYW1wbGVSYXRlID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLm9yaWdpbmFsUGl0Y2ggPSBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgcy5waXRjaENvcnJlY3Rpb24gPSBzdHJlYW0ucmVhZEludDgoKVxyXG4gICAgcy5zYW1wbGVMaW5rID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHMuc2FtcGxlVHlwZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgcy5zdGFydExvb3AgLT0gcy5zdGFydFxyXG4gICAgcy5lbmRMb29wIC09IHMuc3RhcnRcclxuXHJcbiAgICByZXR1cm4gc1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFNhbXBsZUxpbmsgPSB7XHJcbiAgbW9ub1NhbXBsZTogMSxcclxuICByaWdodFNhbXBsZTogMixcclxuICBsZWZ0U2FtcGxlOiA0LFxyXG4gIGxpbmtlZFNhbXBsZTogOCxcclxuICBSb21Nb25vU2FtcGxlOiAweDgwMDEsXHJcbiAgUm9tUmlnaHRTYW1wbGU6IDB4ODAwMixcclxuICBSb21MZWZ0U2FtcGxlOiAweDgwMDQsXHJcbiAgUm9tTGlua2VkU2FtcGxlOiAweDgwMDhcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3RydWN0cy50cyIsImV4cG9ydCBmdW5jdGlvbiByZWFkU3RyaW5nKGRhdGE6IFVpbnQ4QXJyYXksIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogc3RyaW5nIHtcclxuICBjb25zdCBzdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGRhdGEuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXHJcbiAgY29uc3QgbnVsbExvY2F0aW9uID0gc3RyLmluZGV4T2YoXCJcXHUwMDAwXCIpXHJcbiAgaWYgKG51bGxMb2NhdGlvbiA+IDApIHtcclxuICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIG51bGxMb2NhdGlvbilcclxuICB9XHJcbiAgcmV0dXJuIHN0clxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZWFkU3RyaW5nLnRzIiwiaW1wb3J0IFBhcnNlciBmcm9tIFwiLi4vc3JjL1BhcnNlci50c1wiXHJcbmV4cG9ydCB7XHJcbiAgUGFyc2VyXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXhwb3J0L3BhcnNlci5qcyJdLCJzb3VyY2VSb290IjoiIn0=