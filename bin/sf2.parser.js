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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var riff_ts_1 = __webpack_require__(2);
var sf2_data_ts_1 = __webpack_require__(3);
var helper_ts_1 = __webpack_require__(4);
var stream_ts_1 = __webpack_require__(5);
var constants_ts_1 = __webpack_require__(0);
var default_1 = /** @class */ (function () {
    function default_1(input, opt_params) {
        if (opt_params === void 0) { opt_params = {}; }
        this.input = input;
        this.parserOption = opt_params.parserOption;
    }
    default_1.prototype.parse = function () {
        var parser = new riff_ts_1.Parser(this.input, this.parserOption);
        // parse RIFF chunk
        parser.parse();
        if (parser.chunkList.length !== 1) {
            throw new Error('wrong chunk length');
        }
        var chunk = parser.getChunk(0);
        if (chunk === null) {
            throw new Error('chunk not found');
        }
        this.parseRiffChunk(chunk, this.input);
        this.input = null;
    };
    default_1.prototype.parseRiffChunk = function (chunk, data) {
        var chunkList = getChunkList(chunk, data, "RIFF", "sfbk");
        if (chunkList.length !== 3) {
            throw new Error('invalid sfbk structure');
        }
        // INFO-list
        this.info = parseInfoList(chunkList[0], data);
        // sdta-list
        this.samplingData = parseSdtaList(chunkList[1], data);
        // pdta-list
        this.parsePdtaList(chunkList[2], data);
    };
    default_1.prototype.parsePdtaList = function (chunk, data) {
        var chunkList = getChunkList(chunk, data, "LIST", "pdta");
        // check number of chunks
        if (chunkList.length !== 9) {
            throw new Error('invalid pdta chunk');
        }
        this.presetHeader = parsePhdr(chunkList[0], data);
        this.presetZone = parsePbag(chunkList[1], data);
        this.presetZoneModulator = parsePmod(chunkList[2], data);
        this.presetZoneGenerator = parsePgen(chunkList[3], data);
        this.instrument = parseInst(chunkList[4], data);
        this.instrumentZone = parseIbag(chunkList[5], data);
        this.instrumentZoneModulator = parseImod(chunkList[6], data);
        this.instrumentZoneGenerator = parseIgen(chunkList[7], data);
        this.sampleHeader = parseShdr(chunkList[8], data);
        this.sample = loadSample(this.sampleHeader, this.samplingData.offset, data);
    };
    return default_1;
}());
exports["default"] = default_1;
function getChunkList(chunk, data, expectedType, expectedSignature) {
    // check parse target
    if (chunk.type !== expectedType) {
        throw new Error('invalid chunk type:' + chunk.type);
    }
    var stream = new stream_ts_1["default"](data, chunk.offset);
    // check signature
    var signature = stream.readString(4);
    if (signature !== expectedSignature) {
        throw new Error('invalid signature:' + signature);
    }
    // read structure
    var parser = new riff_ts_1.Parser(data, { 'index': stream.ip, 'length': chunk.size - 4 });
    parser.parse();
    return parser.chunkList;
}
function parseInfoList(chunk, data) {
    var info = {};
    var chunkList = getChunkList(chunk, data, "LIST", "INFO");
    for (var _i = 0, chunkList_1 = chunkList; _i < chunkList_1.length; _i++) {
        var p = chunkList_1[_i];
        var offset = p.offset, size = p.size, type = p.type;
        var name_1 = constants_ts_1.InfoNameTable[type] || type;
        info[name_1] = helper_ts_1.readString(data, offset, offset + size);
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
    var stream = new stream_ts_1["default"](data, chunk.offset);
    var size = chunk.offset + chunk.size;
    while (stream.ip < size) {
        result.push(factory(stream));
    }
    return result;
}
var parsePhdr = function (chunk, data) { return parseChunk(chunk, data, "phdr", function (stream) { return sf2_data_ts_1.PresetHeader.parse(stream); }); };
var parsePbag = function (chunk, data) { return parseChunk(chunk, data, "pbag", function (stream) { return sf2_data_ts_1.PresetBag.parse(stream); }); };
var parseInst = function (chunk, data) { return parseChunk(chunk, data, "inst", function (stream) { return sf2_data_ts_1.Instrument.parse(stream); }); };
var parseIbag = function (chunk, data) { return parseChunk(chunk, data, "ibag", function (stream) { return sf2_data_ts_1.InstrumentBag.parse(stream); }); };
var parsePmod = function (chunk, data) { return parseChunk(chunk, data, "pmod", function (stream) { return sf2_data_ts_1.ModulatorList.parse(stream); }); };
var parseImod = function (chunk, data) { return parseChunk(chunk, data, "imod", function (stream) { return sf2_data_ts_1.ModulatorList.parse(stream); }); };
var parsePgen = function (chunk, data) { return parseChunk(chunk, data, "pgen", function (stream) { return sf2_data_ts_1.GeneratorList.parse(stream); }); };
var parseIgen = function (chunk, data) { return parseChunk(chunk, data, "igen", function (stream) { return sf2_data_ts_1.GeneratorList.parse(stream); }); };
var parseShdr = function (chunk, data) { return parseChunk(chunk, data, "shdr", function (stream) { return sf2_data_ts_1.Sample.parse(stream); }); };
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
    var samples = [];
    for (var _i = 0, sampleHeader_1 = sampleHeader; _i < sampleHeader_1.length; _i++) {
        var header = sampleHeader_1[_i];
        var sample = new Int16Array(new Uint8Array(data.subarray(samplingDataOffset + header.start * 2, samplingDataOffset + header.end * 2)).buffer);
        if (header.sampleRate > 0) {
            var adjust = adjustSampleData(sample, header.sampleRate);
            sample = adjust.sample;
            header.sampleRate *= adjust.multiply;
            header.startLoop *= adjust.multiply;
            header.endLoop *= adjust.multiply;
        }
        samples.push(sample);
    }
    return samples;
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Parser = /** @class */ (function () {
    function Parser(input, opt_params) {
        if (opt_params === void 0) { opt_params = {}; }
        this.chunkList = [];
        this.input = input;
        this.ip = opt_params['index'] || 0;
        this.length = opt_params['length'] || input.length - this.ip;
        this.chunkList = [];
        this.offset = this.ip;
        this.padding =
            opt_params['padding'] !== void 0 ? opt_params['padding'] : true;
        this.bigEndian =
            opt_params['bigEndian'] !== void 0 ? opt_params['bigEndian'] : false;
    }
    Parser.prototype.parse = function () {
        var length = this.length + this.offset;
        this.chunkList = [];
        while (this.ip < length) {
            this.parseChunk();
        }
    };
    Parser.prototype.parseChunk = function () {
        var input = this.input;
        var ip = this.ip;
        var size;
        this.chunkList.push(new Chunk(String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]), (size = this.bigEndian ?
            ((input[ip++] << 24) | (input[ip++] << 16) |
                (input[ip++] << 8) | (input[ip++])) >>> 0 :
            ((input[ip++]) | (input[ip++] << 8) |
                (input[ip++] << 16) | (input[ip++] << 24)) >>> 0), ip));
        ip += size;
        // padding
        if (this.padding && ((ip - this.offset) & 1) === 1) {
            ip++;
        }
        this.ip = ip;
    };
    Parser.prototype.getChunk = function (index) {
        var chunk = this.chunkList[index];
        if (chunk === void 0) {
            return null;
        }
        return chunk;
    };
    Parser.prototype.getNumberOfChunks = function () {
        return this.chunkList.length;
    };
    return Parser;
}());
exports.Parser = Parser;
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var constants_ts_1 = __webpack_require__(0);
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
        var key = constants_ts_1.GeneratorEnumeratorTable[code];
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
        var key = constants_ts_1.GeneratorEnumeratorTable[code];
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
/* 4 */
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
/* 5 */
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
    Stream.prototype.readDWORD = function () {
        return (this.data[this.ip++] |
            (this.data[this.ip++] << 8) |
            (this.data[this.ip++] << 16) |
            (this.data[this.ip++] << 24)) >>> 0;
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_sf2_ts__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_sf2_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__src_sf2_ts__);

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__src_sf2_ts___default.a);

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBlMjk4YjliNTJjYWJlODJhNzhjYSIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9zZjIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JpZmYudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NmMl9kYXRhLnRzIiwid2VicGFjazovLy8uL3NyYy9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0cmVhbS50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUM3RGEsZ0NBQXdCLEdBQUc7SUFDdEMsa0JBQWtCO0lBQ2xCLGdCQUFnQjtJQUNoQixzQkFBc0I7SUFDdEIsb0JBQW9CO0lBQ3BCLHdCQUF3QjtJQUN4QixlQUFlO0lBQ2YsZUFBZTtJQUNmLGVBQWU7SUFDZixpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLGtCQUFrQjtJQUNsQixrQkFBa0I7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QztJQUVELDJCQUFVLEdBQVY7UUFDRSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSztRQUN4QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRTtRQUNoQixJQUFJLElBQUk7UUFFUixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FDM0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUN2RSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN4QyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUssQ0FBQyxDQUFDO2dCQUN4QyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ25ELEVBQ0QsRUFBRSxDQUNILENBQUM7UUFFRixFQUFFLElBQUksSUFBSTtRQUVWLFVBQVU7UUFDVixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxD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QUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtJQUN4QixDQUFDO0lBRUQsMEJBQVMsR0FBVDtRQUNFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFO0lBQ3RDLENBQUM7SUFFRCwyQkFBVSxHQUFWO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7SUFDekIsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7QUM1REQ7QUFDQSwrREFBZSxtREFBZixFIiwiZmlsZSI6InNmMi5wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJwYXJzZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wicGFyc2VyXCJdID0gZmFjdG9yeSgpO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlMjk4YjliNTJjYWJlODJhNzhjYSIsImV4cG9ydCBjb25zdCBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgPSBbXHJcbiAgJ3N0YXJ0QWRkcnNPZmZzZXQnLFxyXG4gICdlbmRBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kbG9vcEFkZHJzT2Zmc2V0JyxcclxuICAnc3RhcnRBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ21vZExmb1RvUGl0Y2gnLFxyXG4gICd2aWJMZm9Ub1BpdGNoJyxcclxuICAnbW9kRW52VG9QaXRjaCcsXHJcbiAgJ2luaXRpYWxGaWx0ZXJGYycsXHJcbiAgJ2luaXRpYWxGaWx0ZXJRJyxcclxuICAnbW9kTGZvVG9GaWx0ZXJGYycsXHJcbiAgJ21vZEVudlRvRmlsdGVyRmMnLFxyXG4gICdlbmRBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ21vZExmb1RvVm9sdW1lJyxcclxuICB1bmRlZmluZWQsIC8vIDE0XHJcbiAgJ2Nob3J1c0VmZmVjdHNTZW5kJyxcclxuICAncmV2ZXJiRWZmZWN0c1NlbmQnLFxyXG4gICdwYW4nLFxyXG4gIHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLCAvLyAxOCwxOSwyMFxyXG4gICdkZWxheU1vZExGTycsXHJcbiAgJ2ZyZXFNb2RMRk8nLFxyXG4gICdkZWxheVZpYkxGTycsXHJcbiAgJ2ZyZXFWaWJMRk8nLFxyXG4gICdkZWxheU1vZEVudicsXHJcbiAgJ2F0dGFja01vZEVudicsXHJcbiAgJ2hvbGRNb2RFbnYnLFxyXG4gICdkZWNheU1vZEVudicsXHJcbiAgJ3N1c3RhaW5Nb2RFbnYnLFxyXG4gICdyZWxlYXNlTW9kRW52JyxcclxuICAna2V5bnVtVG9Nb2RFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Nb2RFbnZEZWNheScsXHJcbiAgJ2RlbGF5Vm9sRW52JyxcclxuICAnYXR0YWNrVm9sRW52JyxcclxuICAnaG9sZFZvbEVudicsXHJcbiAgJ2RlY2F5Vm9sRW52JyxcclxuICAnc3VzdGFpblZvbEVudicsXHJcbiAgJ3JlbGVhc2VWb2xFbnYnLFxyXG4gICdrZXludW1Ub1ZvbEVudkhvbGQnLFxyXG4gICdrZXludW1Ub1ZvbEVudkRlY2F5JyxcclxuICAnaW5zdHJ1bWVudCcsXHJcbiAgdW5kZWZpbmVkLCAvLyA0MlxyXG4gICdrZXlSYW5nZScsXHJcbiAgJ3ZlbFJhbmdlJyxcclxuICAnc3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdrZXludW0nLFxyXG4gICd2ZWxvY2l0eScsXHJcbiAgJ2luaXRpYWxBdHRlbnVhdGlvbicsXHJcbiAgdW5kZWZpbmVkLCAvLyA0OVxyXG4gICdlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdjb2Fyc2VUdW5lJyxcclxuICAnZmluZVR1bmUnLFxyXG4gICdzYW1wbGVJRCcsXHJcbiAgJ3NhbXBsZU1vZGVzJyxcclxuICB1bmRlZmluZWQsIC8vIDU1XHJcbiAgJ3NjYWxlVHVuaW5nJyxcclxuICAnZXhjbHVzaXZlQ2xhc3MnLFxyXG4gICdvdmVycmlkaW5nUm9vdEtleSdcclxuXVxyXG5cclxuZXhwb3J0IGNvbnN0IEluZm9OYW1lVGFibGUgPSB7XHJcbiAgSUNNVDogXCJjb21tZW50XCIsXHJcbiAgSUNPUDogXCJjb3B5cmlnaHRcIixcclxuICBJQ1JEOiBcImNyZWF0aW9uX2RhdGVcIixcclxuICBJRU5HOiBcImVuZ2luZWVyXCIsXHJcbiAgSU5BTTogXCJuYW1lXCIsXHJcbiAgSVBSRDogXCJwcm9kdWN0XCIsXHJcbiAgSVNGVDogXCJzb2Z0d2FyZVwiLFxyXG4gIGlmaWw6IFwidmVyc2lvblwiLFxyXG4gIGlzbmc6IFwic291bmRfZW5naW5lXCIsXHJcbiAgaXJvbTogXCJyb21fbmFtZVwiLFxyXG4gIGl2ZXI6IFwicm9tX3ZlcnNpb25cIlxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb25zdGFudHMudHMiLCJpbXBvcnQgeyBQYXJzZXIsIENodW5rIH0gZnJvbSBcIi4vcmlmZi50c1wiXHJcbmltcG9ydCB7IFByZXNldEhlYWRlciwgU2FtcGxlLCBQcmVzZXRCYWcsIEluc3RydW1lbnQsIEluc3RydW1lbnRCYWcsIE1vZHVsYXRvckxpc3QsIEdlbmVyYXRvckxpc3QgfSBmcm9tIFwiLi9zZjJfZGF0YS50c1wiXHJcbmltcG9ydCB7IHJlYWRTdHJpbmcgfSBmcm9tIFwiLi9oZWxwZXIudHNcIlxyXG5pbXBvcnQgU3RyZWFtIGZyb20gXCIuL3N0cmVhbS50c1wiXHJcbmltcG9ydCB7IEluZm9OYW1lVGFibGUgfSBmcm9tIFwiLi9jb25zdGFudHMudHNcIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTYW1wbGVIZWFkZXIge1xyXG4gIHNhbXBsZVJhdGU6IG51bWJlclxyXG4gIHNhbXBsZU5hbWU6IG51bWJlclxyXG4gIHBpdGNoQ29ycmVjdGlvbjogbnVtYmVyXHJcbiAgc3RhcnRMb29wOiBudW1iZXJcclxuICBlbmRMb29wOiBudW1iZXJcclxuICBvcmlnaW5hbFBpdGNoOiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnN0cnVtZW50Wm9uZSB7XHJcbiAgaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBpbnN0cnVtZW50TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG4gIHByZXNldE1vZHVsYXRvckluZGV4OiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGlucHV0OiBVaW50OEFycmF5XHJcbiAgcGFyc2VyT3B0aW9uOiB7fSB8IHVuZGVmaW5lZFxyXG4gIHByZXNldEhlYWRlcjoge31bXVxyXG4gIHByZXNldFpvbmU6IHt9W11cclxuICBwcmVzZXRab25lTW9kdWxhdG9yOiB7fVtdXHJcbiAgcHJlc2V0Wm9uZUdlbmVyYXRvcjoge31bXVxyXG4gIGluc3RydW1lbnQ6IHsgaW5zdHJ1bWVudE5hbWU6IHN0cmluZywgaW5zdHJ1bWVudEJhZ0luZGV4OiBudW1iZXIgfVtdXHJcbiAgaW5zdHJ1bWVudFpvbmU6IEluc3RydW1lbnRab25lW11cclxuICBpbnN0cnVtZW50Wm9uZU1vZHVsYXRvcjoge31bXVxyXG4gIGluc3RydW1lbnRab25lR2VuZXJhdG9yOiB7fVtdXHJcbiAgc2FtcGxlSGVhZGVyOiBTYW1wbGVIZWFkZXJbXVxyXG4gIHNhbXBsZTogSW50MTZBcnJheVtdXHJcbiAgc2FtcGxpbmdEYXRhOiBDaHVua1xyXG4gIGluZm86IHt9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlucHV0OiBVaW50OEFycmF5LCBvcHRfcGFyYW1zOiB7IHBhcnNlck9wdGlvbj86IHt9IH0gPSB7fSkge1xyXG4gICAgdGhpcy5pbnB1dCA9IGlucHV0XHJcbiAgICB0aGlzLnBhcnNlck9wdGlvbiA9IG9wdF9wYXJhbXMucGFyc2VyT3B0aW9uXHJcbiAgfVxyXG5cclxuICBwYXJzZSgpIHtcclxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIodGhpcy5pbnB1dCwgdGhpcy5wYXJzZXJPcHRpb24pXHJcblxyXG4gICAgLy8gcGFyc2UgUklGRiBjaHVua1xyXG4gICAgcGFyc2VyLnBhcnNlKClcclxuICAgIGlmIChwYXJzZXIuY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIGNodW5rIGxlbmd0aCcpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2h1bmsgPSBwYXJzZXIuZ2V0Q2h1bmsoMClcclxuICAgIGlmIChjaHVuayA9PT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NodW5rIG5vdCBmb3VuZCcpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wYXJzZVJpZmZDaHVuayhjaHVuaywgdGhpcy5pbnB1dClcclxuICAgIHRoaXMuaW5wdXQgPSBudWxsXHJcbiAgfVxyXG5cclxuICBwYXJzZVJpZmZDaHVuayhjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJSSUZGXCIsIFwic2Zia1wiKVxyXG5cclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzZmJrIHN0cnVjdHVyZScpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gSU5GTy1saXN0XHJcbiAgICB0aGlzLmluZm8gPSBwYXJzZUluZm9MaXN0KGNodW5rTGlzdFswXSwgZGF0YSlcclxuXHJcbiAgICAvLyBzZHRhLWxpc3RcclxuICAgIHRoaXMuc2FtcGxpbmdEYXRhID0gcGFyc2VTZHRhTGlzdChjaHVua0xpc3RbMV0sIGRhdGEpXHJcblxyXG4gICAgLy8gcGR0YS1saXN0XHJcbiAgICB0aGlzLnBhcnNlUGR0YUxpc3QoY2h1bmtMaXN0WzJdLCBkYXRhKVxyXG4gIH1cclxuXHJcbiAgcGFyc2VQZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwicGR0YVwiKVxyXG5cclxuICAgIC8vIGNoZWNrIG51bWJlciBvZiBjaHVua3NcclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSA5KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwZHRhIGNodW5rJylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByZXNldEhlYWRlciA9IHBhcnNlUGhkcihjaHVua0xpc3RbMF0sIGRhdGEpXHJcbiAgICB0aGlzLnByZXNldFpvbmUgPSBwYXJzZVBiYWcoY2h1bmtMaXN0WzFdLCBkYXRhKVxyXG4gICAgdGhpcy5wcmVzZXRab25lTW9kdWxhdG9yID0gcGFyc2VQbW9kKGNodW5rTGlzdFsyXSwgZGF0YSlcclxuICAgIHRoaXMucHJlc2V0Wm9uZUdlbmVyYXRvciA9IHBhcnNlUGdlbihjaHVua0xpc3RbM10sIGRhdGEpXHJcbiAgICB0aGlzLmluc3RydW1lbnQgPSBwYXJzZUluc3QoY2h1bmtMaXN0WzRdLCBkYXRhKSBhcyBhbnlcclxuICAgIHRoaXMuaW5zdHJ1bWVudFpvbmUgPSBwYXJzZUliYWcoY2h1bmtMaXN0WzVdLCBkYXRhKSBhcyBJbnN0cnVtZW50Wm9uZVtdXHJcbiAgICB0aGlzLmluc3RydW1lbnRab25lTW9kdWxhdG9yID0gcGFyc2VJbW9kKGNodW5rTGlzdFs2XSwgZGF0YSlcclxuICAgIHRoaXMuaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3IgPSBwYXJzZUlnZW4oY2h1bmtMaXN0WzddLCBkYXRhKVxyXG4gICAgdGhpcy5zYW1wbGVIZWFkZXIgPSBwYXJzZVNoZHIoY2h1bmtMaXN0WzhdLCBkYXRhKSBhcyBTYW1wbGVIZWFkZXJbXVxyXG4gICAgdGhpcy5zYW1wbGUgPSBsb2FkU2FtcGxlKHRoaXMuc2FtcGxlSGVhZGVyLCB0aGlzLnNhbXBsaW5nRGF0YS5vZmZzZXQsIGRhdGEpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIGV4cGVjdGVkVHlwZSwgZXhwZWN0ZWRTaWduYXR1cmUpIHtcclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSlcclxuICB9XHJcblxyXG4gIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oZGF0YSwgY2h1bmsub2Zmc2V0KVxyXG5cclxuICAvLyBjaGVjayBzaWduYXR1cmVcclxuICBjb25zdCBzaWduYXR1cmUgPSBzdHJlYW0ucmVhZFN0cmluZyg0KVxyXG4gIGlmIChzaWduYXR1cmUgIT09IGV4cGVjdGVkU2lnbmF0dXJlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgc2lnbmF0dXJlOicgKyBzaWduYXR1cmUpXHJcbiAgfVxyXG5cclxuICAvLyByZWFkIHN0cnVjdHVyZVxyXG4gIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIoZGF0YSwgeydpbmRleCc6IHN0cmVhbS5pcCwgJ2xlbmd0aCc6IGNodW5rLnNpemUgLSA0fSlcclxuICBwYXJzZXIucGFyc2UoKVxyXG5cclxuICByZXR1cm4gcGFyc2VyLmNodW5rTGlzdFxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUluZm9MaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSk6IHt9IHtcclxuICBjb25zdCBpbmZvID0ge31cclxuICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcIklORk9cIilcclxuXHJcbiAgZm9yIChsZXQgcCBvZiBjaHVua0xpc3QpIHtcclxuICAgIGNvbnN0IHsgb2Zmc2V0LCBzaXplLCB0eXBlIH0gPSBwXHJcbiAgICBjb25zdCBuYW1lID0gSW5mb05hbWVUYWJsZVt0eXBlXSB8fCB0eXBlXHJcbiAgICBpbmZvW25hbWVdID0gcmVhZFN0cmluZyhkYXRhLCBvZmZzZXQsIG9mZnNldCArIHNpemUpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW5mb1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNkdGFMaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSk6IENodW5rIHtcclxuICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcInNkdGFcIilcclxuXHJcbiAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVE9ETycpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2h1bmtMaXN0WzBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQ2h1bmsoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5LCB0eXBlOiBzdHJpbmcsIGZhY3RvcnkpOiB7fVtdIHtcclxuICBjb25zdCByZXN1bHQgPSBbXVxyXG5cclxuICBpZiAoY2h1bmsudHlwZSAhPT0gdHlwZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyAgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuICBcclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuICBjb25zdCBzaXplID0gY2h1bmsub2Zmc2V0ICsgY2h1bmsuc2l6ZVxyXG4gIFxyXG4gIHdoaWxlIChzdHJlYW0uaXAgPCBzaXplKSB7XHJcbiAgICByZXN1bHQucHVzaChmYWN0b3J5KHN0cmVhbSkpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmNvbnN0IHBhcnNlUGhkciA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwaGRyXCIsIHN0cmVhbSA9PiBQcmVzZXRIZWFkZXIucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VQYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBiYWdcIiwgc3RyZWFtID0+IFByZXNldEJhZy5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZUluc3QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW5zdFwiLCBzdHJlYW0gPT4gSW5zdHJ1bWVudC5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZUliYWcgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaWJhZ1wiLCBzdHJlYW0gPT4gSW5zdHJ1bWVudEJhZy5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZVBtb2QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicG1vZFwiLCBzdHJlYW0gPT4gTW9kdWxhdG9yTGlzdC5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZUltb2QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW1vZFwiLCBzdHJlYW0gPT4gTW9kdWxhdG9yTGlzdC5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZVBnZW4gPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGdlblwiLCBzdHJlYW0gPT4gR2VuZXJhdG9yTGlzdC5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZUlnZW4gPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaWdlblwiLCBzdHJlYW0gPT4gR2VuZXJhdG9yTGlzdC5wYXJzZShzdHJlYW0pKVxyXG5jb25zdCBwYXJzZVNoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwic2hkclwiLCBzdHJlYW0gPT4gU2FtcGxlLnBhcnNlKHN0cmVhbSkpXHJcblxyXG5mdW5jdGlvbiBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgc2FtcGxlUmF0ZSkge1xyXG4gIGxldCBtdWx0aXBseSA9IDFcclxuXHJcbiAgLy8gYnVmZmVyXHJcbiAgd2hpbGUgKHNhbXBsZVJhdGUgPCAyMjA1MCkge1xyXG4gICAgY29uc3QgbmV3U2FtcGxlID0gbmV3IEludDE2QXJyYXkoc2FtcGxlLmxlbmd0aCAqIDIpXHJcbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDAsIGlsID0gc2FtcGxlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgIH1cclxuICAgIHNhbXBsZSA9IG5ld1NhbXBsZVxyXG4gICAgbXVsdGlwbHkgKj0gMlxyXG4gICAgc2FtcGxlUmF0ZSAqPSAyXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2FtcGxlLFxyXG4gICAgbXVsdGlwbHlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTYW1wbGUoc2FtcGxlSGVhZGVyLCBzYW1wbGluZ0RhdGFPZmZzZXQsIGRhdGEpOiBJbnQxNkFycmF5W10ge1xyXG4gIGNvbnN0IHNhbXBsZXMgPSBbXVxyXG4gIGZvciAobGV0IGhlYWRlciBvZiBzYW1wbGVIZWFkZXIpIHtcclxuICAgIGxldCBzYW1wbGUgPSBuZXcgSW50MTZBcnJheShuZXcgVWludDhBcnJheShkYXRhLnN1YmFycmF5KFxyXG4gICAgICBzYW1wbGluZ0RhdGFPZmZzZXQgKyBoZWFkZXIuc3RhcnQgKiAyLFxyXG4gICAgICBzYW1wbGluZ0RhdGFPZmZzZXQgKyBoZWFkZXIuZW5kICAgKiAyXHJcbiAgICApKS5idWZmZXIpXHJcbiAgICBpZiAoaGVhZGVyLnNhbXBsZVJhdGUgPiAwKSB7XHJcbiAgICAgIGNvbnN0IGFkanVzdCA9IGFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBoZWFkZXIuc2FtcGxlUmF0ZSlcclxuICAgICAgc2FtcGxlID0gYWRqdXN0LnNhbXBsZVxyXG4gICAgICBoZWFkZXIuc2FtcGxlUmF0ZSAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgICAgaGVhZGVyLnN0YXJ0TG9vcCAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgICAgaGVhZGVyLmVuZExvb3AgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICB9XHJcbiAgICBzYW1wbGVzLnB1c2goc2FtcGxlKVxyXG4gIH1cclxuICByZXR1cm4gc2FtcGxlc1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NmMi50cyIsImV4cG9ydCBjbGFzcyBQYXJzZXIge1xyXG4gIGNodW5rTGlzdDogQ2h1bmtbXSA9IFtdXHJcbiAgXHJcbiAgcHJpdmF0ZSBpbnB1dDogVWludDhBcnJheVxyXG4gIHByaXZhdGUgaXA6IG51bWJlclxyXG4gIHByaXZhdGUgbGVuZ3RoOiBudW1iZXJcclxuICBwcml2YXRlIG9mZnNldDogbnVtYmVyXHJcbiAgcHJpdmF0ZSBwYWRkaW5nOiBib29sZWFuXHJcbiAgcHJpdmF0ZSBiaWdFbmRpYW46IGJvb2xlYW5cclxuXHJcbiAgY29uc3RydWN0b3IoaW5wdXQ6IFVpbnQ4QXJyYXksIG9wdF9wYXJhbXM6IHt9ID0ge30pIHtcclxuICAgIHRoaXMuaW5wdXQgPSBpbnB1dFxyXG4gICAgdGhpcy5pcCA9IG9wdF9wYXJhbXNbJ2luZGV4J10gfHwgMFxyXG4gICAgdGhpcy5sZW5ndGggPSBvcHRfcGFyYW1zWydsZW5ndGgnXSB8fCBpbnB1dC5sZW5ndGggLSB0aGlzLmlwXHJcbiAgICB0aGlzLmNodW5rTGlzdCA9IFtdXHJcbiAgICB0aGlzLm9mZnNldCA9IHRoaXMuaXBcclxuICAgIHRoaXMucGFkZGluZyA9XHJcbiAgICAgIG9wdF9wYXJhbXNbJ3BhZGRpbmcnXSAhPT0gdm9pZCAwID8gb3B0X3BhcmFtc1sncGFkZGluZyddIDogdHJ1ZVxyXG4gICAgdGhpcy5iaWdFbmRpYW4gPVxyXG4gICAgICBvcHRfcGFyYW1zWydiaWdFbmRpYW4nXSAhPT0gdm9pZCAwID8gb3B0X3BhcmFtc1snYmlnRW5kaWFuJ10gOiBmYWxzZVxyXG4gIH1cclxuICBcclxuICBwYXJzZSgpIHtcclxuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoICsgdGhpcy5vZmZzZXRcclxuXHJcbiAgICB0aGlzLmNodW5rTGlzdCA9IFtdXHJcblxyXG4gICAgd2hpbGUgKHRoaXMuaXAgPCBsZW5ndGgpIHtcclxuICAgICAgdGhpcy5wYXJzZUNodW5rKClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHBhcnNlQ2h1bmsoKSB7XHJcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuaW5wdXRcclxuICAgIGxldCBpcCA9IHRoaXMuaXBcclxuICAgIGxldCBzaXplXHJcblxyXG4gICAgdGhpcy5jaHVua0xpc3QucHVzaChuZXcgQ2h1bmsoXHJcbiAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUoaW5wdXRbaXArK10sIGlucHV0W2lwKytdLCBpbnB1dFtpcCsrXSwgaW5wdXRbaXArK10pLFxyXG4gICAgICAoc2l6ZSA9IHRoaXMuYmlnRW5kaWFuID9cclxuICAgICAgICAoKGlucHV0W2lwKytdIDw8IDI0KSB8IChpbnB1dFtpcCsrXSA8PCAxNikgfFxyXG4gICAgICAgICAgKGlucHV0W2lwKytdIDw8ICA4KSB8IChpbnB1dFtpcCsrXSAgICAgICkpID4+PiAwIDpcclxuICAgICAgICAoKGlucHV0W2lwKytdICAgICAgKSB8IChpbnB1dFtpcCsrXSA8PCAgOCkgfFxyXG4gICAgICAgICAgKGlucHV0W2lwKytdIDw8IDE2KSB8IChpbnB1dFtpcCsrXSA8PCAyNCkpID4+PiAwXHJcbiAgICAgICksXHJcbiAgICAgIGlwXHJcbiAgICApKVxyXG5cclxuICAgIGlwICs9IHNpemVcclxuXHJcbiAgICAvLyBwYWRkaW5nXHJcbiAgICBpZiAodGhpcy5wYWRkaW5nICYmICgoaXAgLSB0aGlzLm9mZnNldCkgJiAxKSA9PT0gMSkge1xyXG4gICAgICBpcCsrXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pcCA9IGlwXHJcbiAgfVxyXG5cclxuICBnZXRDaHVuayhpbmRleDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBjaHVuayA9IHRoaXMuY2h1bmtMaXN0W2luZGV4XVxyXG5cclxuICAgIGlmIChjaHVuayA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNodW5rXHJcbiAgfVxyXG5cclxuICBnZXROdW1iZXJPZkNodW5rcygpIHtcclxuICAgIHJldHVybiB0aGlzLmNodW5rTGlzdC5sZW5ndGhcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaHVuayB7XHJcbiAgdHlwZTogc3RyaW5nXHJcbiAgc2l6ZTogbnVtYmVyXHJcbiAgb2Zmc2V0OiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgICB0aGlzLnNpemUgPSBzaXplXHJcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldFxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmlmZi50cyIsImltcG9ydCB7IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZSB9IGZyb20gXCIuL2NvbnN0YW50cy50c1wiXHJcblxyXG5leHBvcnQgY2xhc3MgVmVyc2lvblRhZyB7XHJcbiAgbWFqb3I6IG51bWJlclxyXG4gIG1pbm9yOiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByZXNldEhlYWRlciB7XHJcbiAgcHJlc2V0TmFtZTogc3RyaW5nXHJcbiAgcHJlc2V0OiBudW1iZXJcclxuICBiYW5rOiBudW1iZXJcclxuICBwcmVzZXRCYWdJbmRleDogbnVtYmVyXHJcbiAgbGlicmFyeTogbnVtYmVyXHJcbiAgZ2VucmU6IG51bWJlclxyXG4gIG1vcnBob2xvZ3k6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtKSB7XHJcbiAgICBjb25zdCBwID0gbmV3IFByZXNldEhlYWRlcigpXHJcbiAgICBwLnByZXNldE5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHAucHJlc2V0ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAuYmFuayA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLnByZXNldEJhZ0luZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAubGlicmFyeSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcC5nZW5yZSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcC5tb3JwaG9sb2d5ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICByZXR1cm4gcFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByZXNldEJhZyB7XHJcbiAgcHJlc2V0R2VuZXJhdG9ySW5kZXg6IG51bWJlclxyXG4gIHByZXNldE1vZHVsYXRvckluZGV4OiBudW1iZXJcclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbSkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBQcmVzZXRCYWcoKVxyXG4gICAgcC5wcmVzZXRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLnByZXNldE1vZHVsYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kdWxhdG9yTGlzdCB7XHJcbiAgc291cmNlT3BlcjogbnVtYmVyXHJcbiAgZGVzdGluYXRpb25PcGVyOiBHZW5lcmF0b3JcclxuICB2YWx1ZTogT2JqZWN0XHJcbiAgYW1vdW50U291cmNlT3BlcjogbnVtYmVyXHJcbiAgdHJhbnNPcGVyOiBHZW5lcmF0b3JcclxuICB0eXBlOiBzdHJpbmdcclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBNb2R1bGF0b3JMaXN0KClcclxuXHJcbiAgICB0LnNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgY29uc3QgY29kZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0LmRlc3RpbmF0aW9uT3BlciA9IGNvZGVcclxuICAgIFxyXG4gICAgY29uc3Qga2V5ID0gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW2NvZGVdXHJcbiAgICB0LnR5cGUgPSBrZXlcclxuXHJcbiAgICBpZiAoa2V5ID09PSB2b2lkIDApIHtcclxuICAgICAgLy8gQW1vdW50XHJcbiAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgY29kZTogY29kZSxcclxuICAgICAgICBhbW91bnQ6IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBBbW91bnRcclxuICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsUmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ2tleW51bSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICAgICAgbG86IHN0cmVhbS5yZWFkQnl0ZSgpLFxyXG4gICAgICAgICAgICBoaTogc3RyZWFtLnJlYWRCeXRlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGFtb3VudDogc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHQuYW1vdW50U291cmNlT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0LnRyYW5zT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHZW5lcmF0b3JMaXN0IHtcclxuICB0eXBlOiBzdHJpbmdcclxuICB2YWx1ZTogT2JqZWN0XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgTW9kdWxhdG9yTGlzdCgpXHJcbiAgICBcclxuICAgIGNvbnN0IGNvZGUgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgY29uc3Qga2V5ID0gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW2NvZGVdXHJcbiAgICB0LnR5cGUgPSBrZXlcclxuXHJcbiAgICBpZiAoa2V5ID09PSB2b2lkIDApIHtcclxuICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICBjb2RlLFxyXG4gICAgICAgIGFtb3VudDogc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsUmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGxvOiBzdHJlYW0ucmVhZEJ5dGUoKSxcclxuICAgICAgICAgICAgaGk6IHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgICAgICBhbW91bnQ6IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudCB7XHJcbiAgaW5zdHJ1bWVudE5hbWU6IHN0cmluZ1xyXG4gIGluc3RydW1lbnRCYWdJbmRleDogbnVtYmVyXHJcbiAgXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBJbnN0cnVtZW50KClcclxuICAgIHQuaW5zdHJ1bWVudE5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHQuaW5zdHJ1bWVudEJhZ0luZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudEJhZyB7XHJcbiAgaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBpbnN0cnVtZW50TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudEJhZygpXHJcbiAgICB0Lmluc3RydW1lbnRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0Lmluc3RydW1lbnRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNhbXBsZSB7XHJcbiAgc2FtcGxlTmFtZTogc3RyaW5nXHJcbiAgc3RhcnQ6IG51bWJlclxyXG4gIGVuZDogbnVtYmVyXHJcbiAgc3RhcnRMb29wOiBudW1iZXJcclxuICBlbmRMb29wOiBudW1iZXJcclxuICBzYW1wbGVSYXRlOiBudW1iZXJcclxuICBvcmlnaW5hbFBpdGNoOiBudW1iZXJcclxuICBwaXRjaENvcnJlY3Rpb246IG51bWJlclxyXG4gIHNhbXBsZUxpbms6IG51bWJlclxyXG4gIHNhbXBsZVR5cGU6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtKSB7XHJcbiAgICBjb25zdCBzID0gbmV3IFNhbXBsZSgpXHJcblxyXG4gICAgcy5zYW1wbGVOYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICBzLnN0YXJ0ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmVuZCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5zdGFydExvb3AgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuZW5kTG9vcCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5zYW1wbGVSYXRlID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLm9yaWdpbmFsUGl0Y2ggPSBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgcy5waXRjaENvcnJlY3Rpb24gPSBzdHJlYW0ucmVhZEludDgoKVxyXG4gICAgcy5zYW1wbGVMaW5rID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHMuc2FtcGxlVHlwZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgcy5zdGFydExvb3AgLT0gcy5zdGFydFxyXG4gICAgcy5lbmRMb29wIC09IHMuc3RhcnRcclxuXHJcbiAgICByZXR1cm4gc1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbnVtIHtudW1iZXJ9XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgU2FtcGxlTGluayA9IHtcclxuICBtb25vU2FtcGxlOiAxLFxyXG4gIHJpZ2h0U2FtcGxlOiAyLFxyXG4gIGxlZnRTYW1wbGU6IDQsXHJcbiAgbGlua2VkU2FtcGxlOiA4LFxyXG4gIFJvbU1vbm9TYW1wbGU6IDB4ODAwMSxcclxuICBSb21SaWdodFNhbXBsZTogMHg4MDAyLFxyXG4gIFJvbUxlZnRTYW1wbGU6IDB4ODAwNCxcclxuICBSb21MaW5rZWRTYW1wbGU6IDB4ODAwOFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZjJfZGF0YS50cyIsImV4cG9ydCBmdW5jdGlvbiByZWFkU3RyaW5nKGRhdGE6IFVpbnQ4QXJyYXksIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogc3RyaW5nIHtcclxuICBjb25zdCBzdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGRhdGEuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXHJcbiAgY29uc3QgbnVsbExvY2F0aW9uID0gc3RyLmluZGV4T2YoXCJcXHUwMDAwXCIpXHJcbiAgaWYgKG51bGxMb2NhdGlvbiA+IDApIHtcclxuICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIG51bGxMb2NhdGlvbilcclxuICB9XHJcbiAgcmV0dXJuIHN0clxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9oZWxwZXIudHMiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xyXG4gIHByaXZhdGUgZGF0YTogVWludDhBcnJheVxyXG4gIGlwOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IoZGF0YSwgb2Zmc2V0KSB7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhXHJcbiAgICB0aGlzLmlwID0gb2Zmc2V0XHJcbiAgfVxyXG5cclxuICByZWFkU3RyaW5nKHNpemU6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHRoaXMuZGF0YS5zdWJhcnJheSh0aGlzLmlwLCB0aGlzLmlwICs9IHNpemUpKVxyXG4gICAgY29uc3QgbnVsbExvY2F0aW9uID0gc3RyLmluZGV4T2YoXCJcXHUwMDAwXCIpXHJcbiAgICBpZiAobnVsbExvY2F0aW9uID4gMCkge1xyXG4gICAgICByZXR1cm4gc3RyLnN1YnN0cigwLCBudWxsTG9jYXRpb24pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RyXHJcbiAgfVxyXG5cclxuICByZWFkV09SRCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwKytdIHwgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpXHJcbiAgfVxyXG5cclxuICByZWFkRFdPUkQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIHRoaXMuZGF0YVt0aGlzLmlwKytdIHwgXHJcbiAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KSB8IFxyXG4gICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMTYpIHwgXHJcbiAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAyNClcclxuICAgICkgPj4+IDBcclxuICB9XHJcblxyXG4gIHJlYWRCeXRlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwKytdXHJcbiAgfVxyXG5cclxuICByZWFkQXQob2Zmc2V0OiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCArIG9mZnNldF1cclxuICB9XHJcblxyXG4gIC8qIGhlbHBlciAqL1xyXG5cclxuICByZWFkVUludDgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkQnl0ZSgpXHJcbiAgfVxyXG4gIFxyXG4gIHJlYWRJbnQ4KCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnJlYWRCeXRlKCkgPDwgMjQpID4+IDI0XHJcbiAgfVxyXG4gIFxyXG4gIHJlYWRVSW50MTYoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkV09SRCgpXHJcbiAgfVxyXG5cclxuICByZWFkSW50MTYoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMucmVhZFdPUkQoKSA8PCAxNikgPj4gMTZcclxuICB9XHJcblxyXG4gIHJlYWRVSW50MzIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkRFdPUkQoKVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3RyZWFtLnRzIiwiaW1wb3J0IFBhcnNlciBmcm9tIFwiLi4vc3JjL3NmMi50c1wiXHJcbmV4cG9ydCBkZWZhdWx0IFBhcnNlclxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9leHBvcnQvcGFyc2VyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==