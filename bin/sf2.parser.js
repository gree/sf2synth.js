(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["parser"] = factory();
	else
		root["parser"] = factory();
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
/**
 * @enum {number}
 */
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

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__src_Parser_ts___default.a);

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA0MzVmZjY5MzkyMGExNDc3ZWI4NCIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmlmZlBhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3RydWN0cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhZFN0cmluZy50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUM3REE7SUFJRSxnQkFBWSxJQUFJLEVBQUUsTUFBTTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUk7UUFDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNO0lBQ2xCLENBQUM7SUFFRCwyQkFBVSxHQUFWLFVBQVcsSUFBWTtRQUNyQixJQUFNLEdBQUcsR0FBRyxN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QUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQztJQUNwQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUc7QUFDWixDQUFDO0FBUEQsZ0NBT0M7Ozs7Ozs7Ozs7O0FDUEQ7QUFDQSwrREFBZSxzREFBZixFIiwiZmlsZSI6InNmMi5wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJwYXJzZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wicGFyc2VyXCJdID0gZmFjdG9yeSgpO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0MzVmZjY5MzkyMGExNDc3ZWI4NCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XHJcbiAgcHJpdmF0ZSBkYXRhOiBVaW50OEFycmF5XHJcbiAgaXA6IG51bWJlclxyXG5cclxuICBjb25zdHJ1Y3RvcihkYXRhLCBvZmZzZXQpIHtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGFcclxuICAgIHRoaXMuaXAgPSBvZmZzZXRcclxuICB9XHJcblxyXG4gIHJlYWRTdHJpbmcoc2l6ZTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0ciA9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgdGhpcy5kYXRhLnN1YmFycmF5KHRoaXMuaXAsIHRoaXMuaXAgKz0gc2l6ZSkpXHJcbiAgICBjb25zdCBudWxsTG9jYXRpb24gPSBzdHIuaW5kZXhPZihcIlxcdTAwMDBcIilcclxuICAgIGlmIChudWxsTG9jYXRpb24gPiAwKSB7XHJcbiAgICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIG51bGxMb2NhdGlvbilcclxuICAgIH1cclxuICAgIHJldHVybiBzdHJcclxuICB9XHJcblxyXG4gIHJlYWRXT1JEKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXArK10gfCAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOClcclxuICB9XHJcblxyXG4gIHJlYWREV09SRChiaWdFbmRpYW46IGJvb2xlYW4gPSBmYWxzZSk6IG51bWJlciB7XHJcbiAgICBpZiAoYmlnRW5kaWFuKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMjR8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAxNikgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOCkgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10pXHJcbiAgICAgICkgPj4+IDBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5kYXRhW3RoaXMuaXArK10gfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOCkgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMTYpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDI0KVxyXG4gICAgICApID4+PiAwXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWFkQnl0ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCsrXVxyXG4gIH1cclxuXHJcbiAgcmVhZEF0KG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXAgKyBvZmZzZXRdXHJcbiAgfVxyXG5cclxuICAvKiBoZWxwZXIgKi9cclxuXHJcbiAgcmVhZFVJbnQ4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZEJ5dGUoKVxyXG4gIH1cclxuICBcclxuICByZWFkSW50OCgpIHtcclxuICAgIHJldHVybiAodGhpcy5yZWFkQnl0ZSgpIDw8IDI0KSA+PiAyNFxyXG4gIH1cclxuICBcclxuICByZWFkVUludDE2KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZFdPUkQoKVxyXG4gIH1cclxuXHJcbiAgcmVhZEludDE2KCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnJlYWRXT1JEKCkgPDwgMTYpID4+IDE2XHJcbiAgfVxyXG5cclxuICByZWFkVUludDMyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZERXT1JEKClcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N0cmVhbS50cyIsImV4cG9ydCBjb25zdCBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgPSBbXHJcbiAgJ3N0YXJ0QWRkcnNPZmZzZXQnLFxyXG4gICdlbmRBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kbG9vcEFkZHJzT2Zmc2V0JyxcclxuICAnc3RhcnRBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ21vZExmb1RvUGl0Y2gnLFxyXG4gICd2aWJMZm9Ub1BpdGNoJyxcclxuICAnbW9kRW52VG9QaXRjaCcsXHJcbiAgJ2luaXRpYWxGaWx0ZXJGYycsXHJcbiAgJ2luaXRpYWxGaWx0ZXJRJyxcclxuICAnbW9kTGZvVG9GaWx0ZXJGYycsXHJcbiAgJ21vZEVudlRvRmlsdGVyRmMnLFxyXG4gICdlbmRBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ21vZExmb1RvVm9sdW1lJyxcclxuICB1bmRlZmluZWQsIC8vIDE0XHJcbiAgJ2Nob3J1c0VmZmVjdHNTZW5kJyxcclxuICAncmV2ZXJiRWZmZWN0c1NlbmQnLFxyXG4gICdwYW4nLFxyXG4gIHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLCAvLyAxOCwxOSwyMFxyXG4gICdkZWxheU1vZExGTycsXHJcbiAgJ2ZyZXFNb2RMRk8nLFxyXG4gICdkZWxheVZpYkxGTycsXHJcbiAgJ2ZyZXFWaWJMRk8nLFxyXG4gICdkZWxheU1vZEVudicsXHJcbiAgJ2F0dGFja01vZEVudicsXHJcbiAgJ2hvbGRNb2RFbnYnLFxyXG4gICdkZWNheU1vZEVudicsXHJcbiAgJ3N1c3RhaW5Nb2RFbnYnLFxyXG4gICdyZWxlYXNlTW9kRW52JyxcclxuICAna2V5bnVtVG9Nb2RFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Nb2RFbnZEZWNheScsXHJcbiAgJ2RlbGF5Vm9sRW52JyxcclxuICAnYXR0YWNrVm9sRW52JyxcclxuICAnaG9sZFZvbEVudicsXHJcbiAgJ2RlY2F5Vm9sRW52JyxcclxuICAnc3VzdGFpblZvbEVudicsXHJcbiAgJ3JlbGVhc2VWb2xFbnYnLFxyXG4gICdrZXludW1Ub1ZvbEVudkhvbGQnLFxyXG4gICdrZXludW1Ub1ZvbEVudkRlY2F5JyxcclxuICAnaW5zdHJ1bWVudCcsXHJcbiAgdW5kZWZpbmVkLCAvLyA0MlxyXG4gICdrZXlSYW5nZScsXHJcbiAgJ3ZlbFJhbmdlJyxcclxuICAnc3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdrZXludW0nLFxyXG4gICd2ZWxvY2l0eScsXHJcbiAgJ2luaXRpYWxBdHRlbnVhdGlvbicsXHJcbiAgdW5kZWZpbmVkLCAvLyA0OVxyXG4gICdlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdjb2Fyc2VUdW5lJyxcclxuICAnZmluZVR1bmUnLFxyXG4gICdzYW1wbGVJRCcsXHJcbiAgJ3NhbXBsZU1vZGVzJyxcclxuICB1bmRlZmluZWQsIC8vIDU1XHJcbiAgJ3NjYWxlVHVuaW5nJyxcclxuICAnZXhjbHVzaXZlQ2xhc3MnLFxyXG4gICdvdmVycmlkaW5nUm9vdEtleSdcclxuXVxyXG5cclxuZXhwb3J0IGNvbnN0IEluZm9OYW1lVGFibGUgPSB7XHJcbiAgSUNNVDogXCJjb21tZW50XCIsXHJcbiAgSUNPUDogXCJjb3B5cmlnaHRcIixcclxuICBJQ1JEOiBcImNyZWF0aW9uX2RhdGVcIixcclxuICBJRU5HOiBcImVuZ2luZWVyXCIsXHJcbiAgSU5BTTogXCJuYW1lXCIsXHJcbiAgSVBSRDogXCJwcm9kdWN0XCIsXHJcbiAgSVNGVDogXCJzb2Z0d2FyZVwiLFxyXG4gIGlmaWw6IFwidmVyc2lvblwiLFxyXG4gIGlzbmc6IFwic291bmRfZW5naW5lXCIsXHJcbiAgaXJvbTogXCJyb21fbmFtZVwiLFxyXG4gIGl2ZXI6IFwicm9tX3ZlcnNpb25cIlxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Db25zdGFudHMudHMiLCJpbXBvcnQgeyBwYXJzZVJpZmYsIENodW5rLCBPcHRpb25zIGFzIFJpZmZQYXJzZXJPcHRpb25zIH0gZnJvbSBcIi4vUmlmZlBhcnNlclwiXHJcbmltcG9ydCB7IFByZXNldEhlYWRlciwgU2FtcGxlLCBQcmVzZXRCYWcsIEluc3RydW1lbnQsIEluc3RydW1lbnRCYWcsIE1vZHVsYXRvckxpc3QsIEdlbmVyYXRvckxpc3QgfSBmcm9tIFwiLi9TdHJ1Y3RzXCJcclxuaW1wb3J0IHsgcmVhZFN0cmluZyB9IGZyb20gXCIuL3JlYWRTdHJpbmdcIlxyXG5pbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcbmltcG9ydCB7IEluZm9OYW1lVGFibGUgfSBmcm9tIFwiLi9Db25zdGFudHNcIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQYXJzZVJlc3VsdCB7XHJcbiAgcHJlc2V0SGVhZGVyOiBQcmVzZXRIZWFkZXJbXVxyXG4gIHByZXNldFpvbmU6IFByZXNldEJhZ1tdXHJcbiAgcHJlc2V0Wm9uZU1vZHVsYXRvcjogTW9kdWxhdG9yTGlzdFtdXHJcbiAgcHJlc2V0Wm9uZUdlbmVyYXRvcjogTW9kdWxhdG9yTGlzdFtdXHJcbiAgaW5zdHJ1bWVudDogSW5zdHJ1bWVudFtdXHJcbiAgaW5zdHJ1bWVudFpvbmU6IEluc3RydW1lbnRCYWdbXVxyXG4gIGluc3RydW1lbnRab25lTW9kdWxhdG9yOiBNb2R1bGF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50Wm9uZUdlbmVyYXRvcjogTW9kdWxhdG9yTGlzdFtdXHJcbiAgc2FtcGxlSGVhZGVyOiBTYW1wbGVbXVxyXG4gIHNhbXBsZTogSW50MTZBcnJheVtdXHJcbiAgc2FtcGxpbmdEYXRhOiBDaHVua1xyXG4gIGluZm86IHt9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlKGlucHV0OiBVaW50OEFycmF5LCBvcHRpb246IFJpZmZQYXJzZXJPcHRpb25zID0ge30pOiBQYXJzZVJlc3VsdCB7XHJcblxyXG4gIC8vIHBhcnNlIFJJRkYgY2h1bmtcclxuICBjb25zdCBjaHVua0xpc3QgPSBwYXJzZVJpZmYoaW5wdXQsIDAsIGlucHV0Lmxlbmd0aCwgb3B0aW9uKVxyXG5cclxuICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBjaHVuayBsZW5ndGgnKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2h1bmsgPSBjaHVua0xpc3RbMF1cclxuICBpZiAoY2h1bmsgPT09IG51bGwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignY2h1bmsgbm90IGZvdW5kJylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlUmlmZkNodW5rKGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gICAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIlJJRkZcIiwgXCJzZmJrXCIpXHJcblxyXG4gICAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDMpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNmYmsgc3RydWN0dXJlJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAvLyBJTkZPLWxpc3RcclxuICAgICAgaW5mbzogcGFyc2VJbmZvTGlzdChjaHVua0xpc3RbMF0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gc2R0YS1saXN0XHJcbiAgICAgIHNhbXBsaW5nRGF0YTogcGFyc2VTZHRhTGlzdChjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gcGR0YS1saXN0XHJcbiAgICAgIC4uLnBhcnNlUGR0YUxpc3QoY2h1bmtMaXN0WzJdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VQZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwicGR0YVwiKVxyXG5cclxuICAgIC8vIGNoZWNrIG51bWJlciBvZiBjaHVua3NcclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSA5KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwZHRhIGNodW5rJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwcmVzZXRIZWFkZXI6IHBhcnNlUGhkcihjaHVua0xpc3RbMF0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRab25lOiBwYXJzZVBiYWcoY2h1bmtMaXN0WzFdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0Wm9uZU1vZHVsYXRvcjogcGFyc2VQbW9kKGNodW5rTGlzdFsyXSwgZGF0YSksXHJcbiAgICAgIHByZXNldFpvbmVHZW5lcmF0b3I6IHBhcnNlUGdlbihjaHVua0xpc3RbM10sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50OiBwYXJzZUluc3QoY2h1bmtMaXN0WzRdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudFpvbmU6IHBhcnNlSWJhZyhjaHVua0xpc3RbNV0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50Wm9uZU1vZHVsYXRvcjogcGFyc2VJbW9kKGNodW5rTGlzdFs2XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRab25lR2VuZXJhdG9yOiBwYXJzZUlnZW4oY2h1bmtMaXN0WzddLCBkYXRhKSxcclxuICAgICAgc2FtcGxlSGVhZGVyOiBwYXJzZVNoZHIoY2h1bmtMaXN0WzhdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVzdWx0ID0gcGFyc2VSaWZmQ2h1bmsoY2h1bmssIGlucHV0KVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgLi4ucmVzdWx0LFxyXG4gICAgc2FtcGxlOiBsb2FkU2FtcGxlKHJlc3VsdC5zYW1wbGVIZWFkZXIsIHJlc3VsdC5zYW1wbGluZ0RhdGEub2Zmc2V0LCBpbnB1dClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgZXhwZWN0ZWRUeXBlLCBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSBleHBlY3RlZFR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcblxyXG4gIC8vIGNoZWNrIHNpZ25hdHVyZVxyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgaWYgKHNpZ25hdHVyZSAhPT0gZXhwZWN0ZWRTaWduYXR1cmUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaWduYXR1cmU6JyArIHNpZ25hdHVyZSlcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcmV0dXJuIHBhcnNlUmlmZihkYXRhLCBzdHJlYW0uaXAsIGNodW5rLnNpemUgLSA0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUluZm9MaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSk6IHt9IHtcclxuICBjb25zdCBpbmZvID0ge31cclxuICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcIklORk9cIilcclxuXHJcbiAgZm9yIChsZXQgcCBvZiBjaHVua0xpc3QpIHtcclxuICAgIGNvbnN0IHsgb2Zmc2V0LCBzaXplLCB0eXBlIH0gPSBwXHJcbiAgICBjb25zdCBuYW1lID0gSW5mb05hbWVUYWJsZVt0eXBlXSB8fCB0eXBlXHJcbiAgICBpbmZvW25hbWVdID0gcmVhZFN0cmluZyhkYXRhLCBvZmZzZXQsIG9mZnNldCArIHNpemUpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW5mb1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNkdGFMaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSk6IENodW5rIHtcclxuICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcInNkdGFcIilcclxuXHJcbiAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVE9ETycpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2h1bmtMaXN0WzBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQ2h1bms8VD4oY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5LCB0eXBlOiBzdHJpbmcsIGZhY3Rvcnk6IChTdHJlYW0pID0+IFQpOiBUW10ge1xyXG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW11cclxuXHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IHR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgICsgY2h1bmsudHlwZSlcclxuICB9XHJcbiAgXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcbiAgY29uc3Qgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemVcclxuICBcclxuICB3aGlsZSAoc3RyZWFtLmlwIDwgc2l6ZSkge1xyXG4gICAgcmVzdWx0LnB1c2goZmFjdG9yeShzdHJlYW0pKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5jb25zdCBwYXJzZVBoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGhkclwiLCBzdHJlYW0gPT4gUHJlc2V0SGVhZGVyLnBhcnNlKHN0cmVhbSkpLmZpbHRlcihwID0+IHAucHJlc2V0TmFtZSAhPT0gXCJFT1BcIilcclxuY29uc3QgcGFyc2VQYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBiYWdcIiwgc3RyZWFtID0+IFByZXNldEJhZy5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZUluc3QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW5zdFwiLCBzdHJlYW0gPT4gSW5zdHJ1bWVudC5wYXJzZShzdHJlYW0pKS5maWx0ZXIoaSA9PiBpLmluc3RydW1lbnROYW1lICE9PSBcIkVPSVwiKVxyXG5jb25zdCBwYXJzZUliYWcgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaWJhZ1wiLCBzdHJlYW0gPT4gSW5zdHJ1bWVudEJhZy5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZVBtb2QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicG1vZFwiLCBzdHJlYW0gPT4gTW9kdWxhdG9yTGlzdC5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZUltb2QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW1vZFwiLCBzdHJlYW0gPT4gTW9kdWxhdG9yTGlzdC5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZVBnZW4gPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGdlblwiLCBzdHJlYW0gPT4gR2VuZXJhdG9yTGlzdC5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZUlnZW4gPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaWdlblwiLCBzdHJlYW0gPT4gR2VuZXJhdG9yTGlzdC5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZVNoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwic2hkclwiLCBzdHJlYW0gPT4gU2FtcGxlLnBhcnNlKHN0cmVhbSkpLmZpbHRlcihzID0+IHMuc2FtcGxlTmFtZSAhPT0gXCJFT1NcIilcclxuXHJcbmZ1bmN0aW9uIGFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBzYW1wbGVSYXRlKSB7XHJcbiAgbGV0IG11bHRpcGx5ID0gMVxyXG5cclxuICAvLyBidWZmZXJcclxuICB3aGlsZSAoc2FtcGxlUmF0ZSA8IDIyMDUwKSB7XHJcbiAgICBjb25zdCBuZXdTYW1wbGUgPSBuZXcgSW50MTZBcnJheShzYW1wbGUubGVuZ3RoICogMilcclxuICAgIGZvciAobGV0IGkgPSAwLCBqID0gMCwgaWwgPSBzYW1wbGUubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgICBuZXdTYW1wbGVbaisrXSA9IHNhbXBsZVtpXVxyXG4gICAgICBuZXdTYW1wbGVbaisrXSA9IHNhbXBsZVtpXVxyXG4gICAgfVxyXG4gICAgc2FtcGxlID0gbmV3U2FtcGxlXHJcbiAgICBtdWx0aXBseSAqPSAyXHJcbiAgICBzYW1wbGVSYXRlICo9IDJcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzYW1wbGUsXHJcbiAgICBtdWx0aXBseVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFNhbXBsZShzYW1wbGVIZWFkZXI6IFNhbXBsZVtdLCBzYW1wbGluZ0RhdGFPZmZzZXQ6IG51bWJlciwgZGF0YTogVWludDhBcnJheSk6IEludDE2QXJyYXlbXSB7XHJcbiAgcmV0dXJuIHNhbXBsZUhlYWRlci5tYXAoaGVhZGVyID0+IHtcclxuICAgIGxldCBzYW1wbGUgPSBuZXcgSW50MTZBcnJheShuZXcgVWludDhBcnJheShkYXRhLnN1YmFycmF5KFxyXG4gICAgICBzYW1wbGluZ0RhdGFPZmZzZXQgKyBoZWFkZXIuc3RhcnQgKiAyLFxyXG4gICAgICBzYW1wbGluZ0RhdGFPZmZzZXQgKyBoZWFkZXIuZW5kICAgKiAyXHJcbiAgICApKS5idWZmZXIpXHJcbiAgICBpZiAoaGVhZGVyLnNhbXBsZVJhdGUgPiAwKSB7XHJcbiAgICAgIGNvbnN0IGFkanVzdCA9IGFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBoZWFkZXIuc2FtcGxlUmF0ZSlcclxuICAgICAgc2FtcGxlID0gYWRqdXN0LnNhbXBsZVxyXG4gICAgICBoZWFkZXIuc2FtcGxlUmF0ZSAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgICAgaGVhZGVyLnN0YXJ0TG9vcCAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgICAgaGVhZGVyLmVuZExvb3AgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2FtcGxlXHJcbiAgfSlcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QYXJzZXIudHMiLCJpbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rKGlucHV0OiBVaW50OEFycmF5LCBpcDogbnVtYmVyLCBiaWdFbmRpYW46IGJvb2xlYW4pOiBDaHVuayB7XHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShpbnB1dCwgaXApXHJcbiAgY29uc3QgdHlwZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgY29uc3Qgc2l6ZSA9IHN0cmVhbS5yZWFkRFdPUkQoYmlnRW5kaWFuKVxyXG4gIHJldHVybiBuZXcgQ2h1bmsodHlwZSwgc2l6ZSwgc3RyZWFtLmlwKVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnMge1xyXG4gIHBhZGRpbmc/OiBib29sZWFuLFxyXG4gIGJpZ0VuZGlhbj86IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmlmZihpbnB1dDogVWludDhBcnJheSwgaW5kZXg6IG51bWJlciA9IDAsIGxlbmd0aDogbnVtYmVyLCB7IHBhZGRpbmcgPSB0cnVlLCBiaWdFbmRpYW4gPSBmYWxzZSB9OiBPcHRpb25zID0ge30pIHtcclxuICBjb25zdCBjaHVua0xpc3Q6IENodW5rW10gPSBbXVxyXG4gIGNvbnN0IGVuZCA9IGxlbmd0aCArIGluZGV4XHJcbiAgbGV0IGlwID0gaW5kZXhcclxuXHJcbiAgd2hpbGUgKGlwIDwgZW5kKSB7XHJcbiAgICBjb25zdCBjaHVuayA9IHBhcnNlQ2h1bmsoaW5wdXQsIGlwLCBiaWdFbmRpYW4pXHJcbiAgICBpcCA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemVcclxuICAgIFxyXG4gICAgLy8gcGFkZGluZ1xyXG4gICAgaWYgKHBhZGRpbmcgJiYgKChpcCAtIGluZGV4KSAmIDEpID09PSAxKSB7XHJcbiAgICAgIGlwKytcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2h1bmtMaXN0LnB1c2goY2h1bmspXHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2h1bmtMaXN0XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaHVuayB7XHJcbiAgdHlwZTogc3RyaW5nXHJcbiAgc2l6ZTogbnVtYmVyXHJcbiAgb2Zmc2V0OiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgICB0aGlzLnNpemUgPSBzaXplXHJcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldFxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmlmZlBhcnNlci50cyIsImltcG9ydCB7IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZSB9IGZyb20gXCIuL0NvbnN0YW50c1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJzaW9uVGFnIHtcclxuICBtYWpvcjogbnVtYmVyXHJcbiAgbWlub3I6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlc2V0SGVhZGVyIHtcclxuICBwcmVzZXROYW1lOiBzdHJpbmdcclxuICBwcmVzZXQ6IG51bWJlclxyXG4gIGJhbms6IG51bWJlclxyXG4gIHByZXNldEJhZ0luZGV4OiBudW1iZXJcclxuICBsaWJyYXJ5OiBudW1iZXJcclxuICBnZW5yZTogbnVtYmVyXHJcbiAgbW9ycGhvbG9neTogbnVtYmVyXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBQcmVzZXRIZWFkZXIoKVxyXG4gICAgcC5wcmVzZXROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICBwLnByZXNldCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLmJhbmsgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLmxpYnJhcnkgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHAuZ2VucmUgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHAubW9ycGhvbG9neSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcmV0dXJuIHBcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcmVzZXRCYWcge1xyXG4gIHByZXNldEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBwcmVzZXRNb2R1bGF0b3JJbmRleDogbnVtYmVyXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBQcmVzZXRCYWcoKVxyXG4gICAgcC5wcmVzZXRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLnByZXNldE1vZHVsYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFtb3VudFZhbHVlIHtcclxuICBjb2RlPzogbnVtYmVyXHJcbiAgYW1vdW50OiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSYW5nZVZhbHVlIHtcclxuICBsbzogbnVtYmVyXHJcbiAgaGk6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kdWxhdG9yTGlzdCB7XHJcbiAgc291cmNlT3BlcjogbnVtYmVyXHJcbiAgZGVzdGluYXRpb25PcGVyOiBudW1iZXJcclxuICB2YWx1ZTogQW1vdW50VmFsdWV8UmFuZ2VWYWx1ZVxyXG4gIGFtb3VudFNvdXJjZU9wZXI6IG51bWJlclxyXG4gIHRyYW5zT3BlcjogbnVtYmVyXHJcbiAgdHlwZTogc3RyaW5nXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBNb2R1bGF0b3JMaXN0KClcclxuXHJcbiAgICB0LnNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgY29uc3QgY29kZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0LmRlc3RpbmF0aW9uT3BlciA9IGNvZGVcclxuICAgIFxyXG4gICAgY29uc3Qga2V5ID0gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW2NvZGVdXHJcbiAgICB0LnR5cGUgPSBrZXkhXHJcblxyXG4gICAgaWYgKGtleSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIC8vIEFtb3VudFxyXG4gICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgIGNvZGU6IGNvZGUsXHJcbiAgICAgICAgYW1vdW50OiBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gQW1vdW50XHJcbiAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgY2FzZSAna2V5UmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICdrZXludW0nOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGxvOiBzdHJlYW0ucmVhZEJ5dGUoKSxcclxuICAgICAgICAgICAgaGk6IHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgICAgICBhbW91bnQ6IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0LmFtb3VudFNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC50cmFuc09wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yTGlzdCB7XHJcbiAgdHlwZTogc3RyaW5nXHJcbiAgdmFsdWU6IEFtb3VudFZhbHVlfFJhbmdlVmFsdWVcclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IE1vZHVsYXRvckxpc3QoKVxyXG4gICAgXHJcbiAgICBjb25zdCBjb2RlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIGNvbnN0IGtleSA9IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZVtjb2RlXVxyXG4gICAgdC50eXBlID0ga2V5IVxyXG5cclxuICAgIGlmIChrZXkgPT09IHZvaWQgMCkge1xyXG4gICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgIGNvZGUsXHJcbiAgICAgICAgYW1vdW50OiBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICBjYXNlICdrZXludW0nOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ2tleVJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICd2ZWxSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICAgICAgbG86IHN0cmVhbS5yZWFkQnl0ZSgpLFxyXG4gICAgICAgICAgICBoaTogc3RyZWFtLnJlYWRCeXRlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGFtb3VudDogc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbnN0cnVtZW50IHtcclxuICBpbnN0cnVtZW50TmFtZTogc3RyaW5nXHJcbiAgaW5zdHJ1bWVudEJhZ0luZGV4OiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudCgpXHJcbiAgICB0Lmluc3RydW1lbnROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICB0Lmluc3RydW1lbnRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnRCYWcge1xyXG4gIGluc3RydW1lbnRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4OiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudEJhZygpXHJcbiAgICB0Lmluc3RydW1lbnRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0Lmluc3RydW1lbnRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNhbXBsZSB7XHJcbiAgc2FtcGxlTmFtZTogc3RyaW5nXHJcbiAgc3RhcnQ6IG51bWJlclxyXG4gIGVuZDogbnVtYmVyXHJcbiAgc3RhcnRMb29wOiBudW1iZXJcclxuICBlbmRMb29wOiBudW1iZXJcclxuICBzYW1wbGVSYXRlOiBudW1iZXJcclxuICBvcmlnaW5hbFBpdGNoOiBudW1iZXJcclxuICBwaXRjaENvcnJlY3Rpb246IG51bWJlclxyXG4gIHNhbXBsZUxpbms6IG51bWJlclxyXG4gIHNhbXBsZVR5cGU6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHMgPSBuZXcgU2FtcGxlKClcclxuXHJcbiAgICBzLnNhbXBsZU5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHMuc3RhcnQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuZW5kID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLnN0YXJ0TG9vcCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5lbmRMb29wID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLnNhbXBsZVJhdGUgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMub3JpZ2luYWxQaXRjaCA9IHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICBzLnBpdGNoQ29ycmVjdGlvbiA9IHN0cmVhbS5yZWFkSW50OCgpXHJcbiAgICBzLnNhbXBsZUxpbmsgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcy5zYW1wbGVUeXBlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzLnN0YXJ0TG9vcCAtPSBzLnN0YXJ0XHJcbiAgICBzLmVuZExvb3AgLT0gcy5zdGFydFxyXG5cclxuICAgIHJldHVybiBzXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVudW0ge251bWJlcn1cclxuICovXHJcbmV4cG9ydCBjb25zdCBTYW1wbGVMaW5rID0ge1xyXG4gIG1vbm9TYW1wbGU6IDEsXHJcbiAgcmlnaHRTYW1wbGU6IDIsXHJcbiAgbGVmdFNhbXBsZTogNCxcclxuICBsaW5rZWRTYW1wbGU6IDgsXHJcbiAgUm9tTW9ub1NhbXBsZTogMHg4MDAxLFxyXG4gIFJvbVJpZ2h0U2FtcGxlOiAweDgwMDIsXHJcbiAgUm9tTGVmdFNhbXBsZTogMHg4MDA0LFxyXG4gIFJvbUxpbmtlZFNhbXBsZTogMHg4MDA4XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N0cnVjdHMudHMiLCJleHBvcnQgZnVuY3Rpb24gcmVhZFN0cmluZyhkYXRhOiBVaW50OEFycmF5LCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgY29uc3Qgc3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBkYXRhLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxyXG4gIGNvbnN0IG51bGxMb2NhdGlvbiA9IHN0ci5pbmRleE9mKFwiXFx1MDAwMFwiKVxyXG4gIGlmIChudWxsTG9jYXRpb24gPiAwKSB7XHJcbiAgICByZXR1cm4gc3RyLnN1YnN0cigwLCBudWxsTG9jYXRpb24pXHJcbiAgfVxyXG4gIHJldHVybiBzdHJcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmVhZFN0cmluZy50cyIsImltcG9ydCBQYXJzZXIgZnJvbSBcIi4uL3NyYy9QYXJzZXIudHNcIlxyXG5leHBvcnQgZGVmYXVsdCBQYXJzZXJcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXhwb3J0L3BhcnNlci5qcyJdLCJzb3VyY2VSb290IjoiIn0=