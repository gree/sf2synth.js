(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["synth"] = factory();
	else
		root["synth"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
/* 6 */,
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_wml_ts__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_wml_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__src_wml_ts__);

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__src_wml_ts___default.a);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var sound_font_synth_ts_1 = __webpack_require__(9);
var synth_view_ts_1 = __webpack_require__(12);
var midi_message_handler_ts_1 = __webpack_require__(14);
/**
 * @constructor
 */
var WebMidiLink = function () {
    /** @type {function(ArrayBuffer)} */
    this.loadCallback;
    /** @type {Function} */
    this.messageHandler = this.onmessage.bind(this);
    this.midiMessageHandler = new midi_message_handler_ts_1["default"]();
    window.addEventListener('DOMContentLoaded', function () {
        this.ready = true;
    }.bind(this), false);
};
WebMidiLink.prototype.setup = function (url) {
    if (!this.ready) {
        window.addEventListener('DOMContentLoaded', function onload() {
            window.removeEventListener('DOMContentLoaded', onload, false);
            this.load(url);
        }.bind(this), false);
    }
    else {
        this.load(url);
    }
};
WebMidiLink.prototype.load = function (url) {
    /** @type {XMLHttpRequest} */
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('load', function (ev) {
        /** @type {XMLHttpRequest} */
        var xhr = ev.target;
        this.onload(xhr.response);
        if (typeof this.loadCallback === 'function') {
            this.loadCallback(xhr.response);
        }
    }.bind(this), false);
    xhr.send();
};
/**
 * @param {ArrayBuffer} response
 */
WebMidiLink.prototype.onload = function (response) {
    /** @type {Uint8Array} */
    var input = new Uint8Array(response);
    this.loadSoundFont(input);
};
/**
 * @param {Uint8Array} input
 */
WebMidiLink.prototype.loadSoundFont = function (input) {
    /** @type {Synthesizer} */
    var synth;
    if (!this.synth) {
        synth = this.synth = new sound_font_synth_ts_1["default"](input);
        var view = this.view = new synth_view_ts_1["default"]();
        document.body.appendChild(view.draw(synth));
        this.midiMessageHandler.synth = synth;
        synth.init();
        synth.start();
        window.addEventListener('message', this.messageHandler, false);
    }
    else {
        synth = this.synth;
        synth.refreshInstruments(input);
    }
    // link ready
    if (window.opener) {
        window.opener.postMessage("link,ready", '*');
    }
    else if (window.parent !== window) {
        window.parent.postMessage("link,ready", '*');
    }
};
/**
 * @param {Event} ev
 */
WebMidiLink.prototype.onmessage = function (ev) {
    var msg = ev.data.split(',');
    var type = msg.shift();
    var command;
    switch (type) {
        case 'midi':
            this.midiMessageHandler.processMidiMessage(msg.map(function (hex) {
                return parseInt(hex, 16);
            }));
            break;
        case 'link':
            command = msg.shift();
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
};
/**
 * @param {function(ArrayBuffer)} callback
 */
WebMidiLink.prototype.setLoadCallback = function (callback) {
    this.loadCallback = callback;
};
exports["default"] = WebMidiLink;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var sound_font_synth_note_ts_1 = __webpack_require__(10);
var sf2_ts_1 = __webpack_require__(1);
var sound_font_ts_1 = __webpack_require__(11);
var BASE_VOLUME = 0.4;
var Channel = /** @class */ (function () {
    function Channel() {
        this.instrument = 0;
        this.volume = 0;
        this.pitchBend = 0;
        this.pitchBendSensitivity = 0;
        this.panpot = 0;
        this.currentNoteOn = [];
    }
    return Channel;
}());
var DummyView = /** @class */ (function () {
    function DummyView() {
    }
    DummyView.prototype.draw = function () { };
    DummyView.prototype.remove = function () { };
    DummyView.prototype.getInstrumentElement = function () { };
    DummyView.prototype.getKeyElement = function () { };
    DummyView.prototype.noteOn = function () { };
    DummyView.prototype.noteOff = function () { };
    DummyView.prototype.programChange = function () { };
    DummyView.prototype.volumeChange = function () { };
    DummyView.prototype.panpotChange = function () { };
    DummyView.prototype.pitchBend = function () { };
    DummyView.prototype.pitchBendSensitivity = function () { };
    return DummyView;
}());
var Synthesizer = /** @class */ (function () {
    function Synthesizer(ctx) {
        this.input = null;
        this.bank = 0;
        this.bufferSize = 1024;
        this.channels = [];
        this.masterVolume = 1.0;
        this.view = new DummyView();
        this.ctx = ctx;
        this.gainMaster = this.ctx.createGain();
        this.setMasterVolume(this.masterVolume);
        this.init();
    }
    Synthesizer.prototype.init = function () {
        for (var i = 0; i < 16; ++i) {
            this.channels.push(new Channel());
            this.programChange(i, i !== 9 ? i : 0);
            this.volumeChange(i, 0x64);
            this.panpotChange(i, 0x40);
            this.pitchBend(i, 0x00, 0x40); // 8192
            this.pitchBendSensitivity(i, 2);
        }
    };
    Synthesizer.prototype.refreshInstruments = function (input) {
        this.input = input;
        var parser = new sf2_ts_1["default"](input);
        parser.parse();
        this.soundFont = new sound_font_ts_1["default"](parser);
    };
    Synthesizer.prototype.connect = function (destination) {
        this.gainMaster.connect(destination);
    };
    Synthesizer.prototype.setMasterVolume = function (volume) {
        this.masterVolume = volume;
        this.gainMaster.gain.value = BASE_VOLUME * volume / 0x8000;
    };
    Synthesizer.prototype.noteOn = function (channelNumber, key, velocity) {
        if (!this.soundFont) {
            return;
        }
        var bankNumber = channelNumber === 9 ? 128 : this.bank;
        var channel = this.channels[channelNumber];
        var instrumentKey = this.soundFont.getInstrumentKey(bankNumber, channel.instrument, key, velocity);
        if (!instrumentKey) {
            return;
        }
        var panpot = channel.panpot - 64;
        panpot /= panpot < 0 ? 64 : 63;
        // create note information
        instrumentKey['channel'] = channelNumber;
        instrumentKey['key'] = key;
        instrumentKey['velocity'] = velocity;
        instrumentKey['panpot'] = panpot;
        instrumentKey['volume'] = channel.volume / 127;
        instrumentKey['pitchBend'] = channel.pitchBend - 0x2000;
        instrumentKey['pitchBendSensitivity'] = channel.pitchBendSensitivity;
        // note on
        var note = new sound_font_synth_note_ts_1["default"](this.ctx, this.gainMaster, instrumentKey);
        note.noteOn();
        channel.currentNoteOn.push(note);
        this.view.noteOn(channelNumber, key);
    };
    Synthesizer.prototype.noteOff = function (channelNumber, key, velocity) {
        if (!this.soundFont) {
            return;
        }
        var bankNumber = channelNumber === 9 ? 128 : this.bank;
        var channel = this.channels[channelNumber];
        var instrumentKey = this.soundFont.getInstrumentKey(bankNumber, channel.instrument, key);
        if (!instrumentKey) {
            return;
        }
        var currentNoteOn = channel.currentNoteOn;
        for (var i = 0, il = currentNoteOn.length; i < il; ++i) {
            var note = currentNoteOn[i];
            if (note.key === key) {
                note.noteOff();
                currentNoteOn.splice(i, 1);
                --i;
                --il;
            }
        }
        this.view.noteOff(channelNumber, key);
    };
    Synthesizer.prototype.programChange = function (channelNumber, instrument) {
        this.view.programChange(channelNumber, instrument);
        this.channels[channelNumber].instrument = instrument;
    };
    Synthesizer.prototype.volumeChange = function (channelNumber, volume) {
        this.view.volumeChange(channelNumber, volume);
        this.channels[channelNumber].volume = volume;
    };
    Synthesizer.prototype.panpotChange = function (channelNumber, panpot) {
        this.view.panpotChange(channelNumber, panpot);
        this.channels[channelNumber].panpot = panpot;
    };
    Synthesizer.prototype.pitchBend = function (channelNumber, lowerByte, higherByte) {
        var bend = (lowerByte & 0x7f) | ((higherByte & 0x7f) << 7);
        var channel = this.channels[channelNumber];
        var currentNoteOn = channel.currentNoteOn;
        var calculated = bend - 0x2000;
        this.view.pitchBend(channelNumber, calculated);
        for (var i = 0, il = currentNoteOn.length; i < il; ++i) {
            currentNoteOn[i].updatePitchBend(calculated);
        }
        channel.pitchBend = bend;
    };
    Synthesizer.prototype.pitchBendSensitivity = function (channelNumber, sensitivity) {
        this.view.pitchBendSensitivity(channelNumber, sensitivity);
        this.channels[channelNumber].pitchBendSensitivity = sensitivity;
    };
    Synthesizer.prototype.allSoundOff = function (channelNumber) {
        var currentNoteOn = this.channels[channelNumber].currentNoteOn;
        while (currentNoteOn.length > 0) {
            this.noteOff(channelNumber, currentNoteOn[0].key, 0);
        }
    };
    Synthesizer.prototype.resetAllControl = function (channelNumber) {
        this.pitchBend(channelNumber, 0x00, 0x40); // 8192
    };
    return Synthesizer;
}());
exports["default"] = Synthesizer;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var SynthesizerNote = /** @class */ (function () {
    function SynthesizerNote(ctx, destination, instrument) {
        this.ctx = ctx;
        this.destination = destination;
        this.instrument = instrument;
        this.channel = instrument.channel;
        this.key = instrument.key;
        this.velocity = instrument.velocity;
        this.buffer = instrument.sample;
        this.playbackRate = instrument.playbackRate(instrument.key);
        this.sampleRate = instrument.sampleRate;
        this.volume = instrument.volume;
        this.panpot = instrument.panpot;
        this.pitchBend = instrument.pitchBend;
        this.pitchBendSensitivity = instrument.pitchBendSensitivity;
        this.modEnvToPitch = instrument.modEnvToPitch;
        this.startTime = ctx.currentTime;
        this.computedPlaybackRate = this.playbackRate;
    }
    SynthesizerNote.prototype.noteOn = function () {
        var _this = this;
        var _a = this, ctx = _a.ctx, instrument = _a.instrument, buffer = _a.buffer;
        var sample = buffer.subarray(0, buffer.length + instrument.end);
        this.audioBuffer = ctx.createBuffer(1, sample.length, this.sampleRate);
        var channelData = this.audioBuffer.getChannelData(0);
        channelData.set(sample);
        // buffer source
        var bufferSource = ctx.createBufferSource();
        bufferSource.buffer = this.audioBuffer;
        bufferSource.loop = (this.channel !== 9);
        bufferSource.loopStart = instrument.loopStart / this.sampleRate;
        bufferSource.loopEnd = instrument.loopEnd / this.sampleRate;
        bufferSource.onended = function () { return _this.disconnect(); };
        this.bufferSource = bufferSource;
        this.updatePitchBend(this.pitchBend);
        // audio node
        var panner = this.panner = ctx.createPanner();
        var output = this.gainOutput = ctx.createGain();
        var outputGain = output.gain;
        // filter
        var filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        this.filter = filter;
        // panpot
        panner.panningModel = "equalpower";
        panner.setPosition(Math.sin(this.panpot * Math.PI / 2), 0, Math.cos(this.panpot * Math.PI / 2));
        //---------------------------------------------------------------------------
        // Attack, Decay, Sustain
        //---------------------------------------------------------------------------
        var now = this.ctx.currentTime;
        var volAttackTime = now + instrument.volAttack;
        var modAttackTime = now + instrument.modAttack;
        var volDecay = volAttackTime + instrument.volDecay;
        var modDecay = modAttackTime + instrument.modDecay;
        var startTime = instrument.start / this.sampleRate;
        var attackVolume = this.volume * (this.velocity / 127);
        outputGain.setValueAtTime(0, now);
        outputGain.linearRampToValueAtTime(attackVolume, volAttackTime);
        outputGain.linearRampToValueAtTime(attackVolume * (1 - instrument.volSustain), volDecay);
        filter.Q.setValueAtTime(instrument.initialFilterQ / 10, now);
        var baseFreq = amountToFreq(instrument.initialFilterFc);
        var peekFreq = amountToFreq(instrument.initialFilterFc + instrument.modEnvToFilterFc);
        var sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - instrument.modSustain);
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
    };
    SynthesizerNote.prototype.noteOff = function () {
        var _a = this, instrument = _a.instrument, bufferSource = _a.bufferSource;
        var output = this.gainOutput;
        var now = this.ctx.currentTime;
        var volEndTime = now + instrument.volRelease;
        var modEndTime = now + instrument.modRelease;
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
    };
    SynthesizerNote.prototype.disconnect = function () {
        this.bufferSource.disconnect(0);
        this.panner.disconnect(0);
        this.gainOutput.disconnect(0);
    };
    SynthesizerNote.prototype.schedulePlaybackRate = function () {
        var playbackRate = this.bufferSource.playbackRate;
        var computed = this.computedPlaybackRate;
        var start = this.startTime;
        var instrument = this.instrument;
        var modAttack = start + instrument.modAttack;
        var modDecay = modAttack + instrument.modDecay;
        var peekPitch = computed * Math.pow(Math.pow(2, 1 / 12), this.modEnvToPitch * this.instrument.scaleTuning);
        playbackRate.cancelScheduledValues(0);
        playbackRate.setValueAtTime(computed, start);
        playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
        playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - instrument.modSustain), modDecay);
    };
    SynthesizerNote.prototype.updatePitchBend = function (pitchBend) {
        this.computedPlaybackRate = this.playbackRate * Math.pow(Math.pow(2, 1 / 12), (this.pitchBendSensitivity * (pitchBend / (pitchBend < 0 ? 8192 : 8191))) * this.instrument.scaleTuning);
        this.schedulePlaybackRate();
    };
    return SynthesizerNote;
}());
exports["default"] = SynthesizerNote;


/***/ }),
/* 11 */
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
/**
 * Parser で読み込んだサウンドフォントのデータを
 * Synthesizer から利用しやすい形にするクラス
 */
var SoundFont = /** @class */ (function () {
    function SoundFont(parser) {
        this.bankSet = createAllInstruments(parser);
    }
    SoundFont.prototype.getInstrumentKey = function (bankNumber, instrumentNumber, key, velocity) {
        if (velocity === void 0) { velocity = 100; }
        var bank = this.bankSet[bankNumber];
        if (!bank) {
            console.warn("bank not found: bank=%s instrument=%s", bankNumber, instrumentNumber);
            return null;
        }
        var instrument = bank[instrumentNumber];
        if (!instrument) {
            // TODO
            console.warn("instrument not found: bank=%s instrument=%s", bankNumber, instrumentNumber);
            return null;
        }
        var instrumentKey = instrument.notes.filter(function (i) {
            var isInKeyRange = false;
            if (i.keyRange) {
                isInKeyRange = key >= i.keyRange.lo && key <= i.keyRange.hi;
            }
            var isInVelRange = true;
            if (i.velRange) {
                isInVelRange = velocity >= i.velRange.lo && velocity <= i.velRange.hi;
            }
            return isInKeyRange && isInVelRange;
        })[0];
        if (!instrumentKey) {
            // TODO
            console.warn("instrument not found: bank=%s instrument=%s key=%s", bankNumber, instrumentNumber, key);
            return null;
        }
        return instrumentKey;
    };
    return SoundFont;
}());
exports["default"] = SoundFont;
function createInstrument(_a) {
    var instrument = _a.instrument, instrumentZone = _a.instrumentZone, instrumentZoneGenerator = _a.instrumentZoneGenerator, instrumentZoneModulator = _a.instrumentZoneModulator;
    var zone = instrumentZone;
    var output = [];
    // instrument -> instrument bag -> generator / modulator
    for (var i = 0; i < instrument.length; ++i) {
        var bagIndex = instrument[i].instrumentBagIndex;
        var bagIndexEnd = instrument[i + 1] ? instrument[i + 1].instrumentBagIndex : zone.length;
        var zoneInfo = [];
        // instrument bag
        for (var j = bagIndex; j < bagIndexEnd; ++j) {
            var instrumentGenerator = createInstrumentGenerator(zone, j, instrumentZoneGenerator);
            var instrumentModulator = createInstrumentModulator(zone, j, instrumentZoneModulator);
            zoneInfo.push({
                generator: instrumentGenerator.generator,
                generatorSequence: instrumentGenerator.generatorInfo,
                modulator: instrumentModulator.modulator,
                modulatorSequence: instrumentModulator.modulatorInfo
            });
        }
        output.push({
            name: instrument[i].instrumentName,
            info: zoneInfo
        });
    }
    return output;
}
function createPreset(_a) {
    var presetHeader = _a.presetHeader, presetZone = _a.presetZone, presetZoneGenerator = _a.presetZoneGenerator, presetZoneModulator = _a.presetZoneModulator;
    // preset -> preset bag -> generator / modulator
    return presetHeader.map(function (preset, i) {
        var nextPreset = presetHeader[i + 1];
        var bagIndex = preset.presetBagIndex;
        var bagIndexEnd = nextPreset ? nextPreset.presetBagIndex : presetZone.length;
        var zoneInfo = [];
        // preset bag
        for (var j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
            zoneInfo.push({
                presetGenerator: createPresetGenerator(presetZone, j, presetZoneGenerator),
                presetModulator: createPresetModulator(presetZone, j, presetZoneModulator)
            });
        }
        return {
            info: zoneInfo,
            header: preset
        };
    });
}
function createAllInstruments(parser) {
    var presets = createPreset(parser);
    var instruments = createInstrument(parser);
    var banks = [];
    for (var _i = 0, presets_1 = presets; _i < presets_1.length; _i++) {
        var preset = presets_1[_i];
        var bankNumber = preset.header.bank;
        var presetNumber = preset.header.preset;
        var notes = preset.info
            .map(function (info) { return info.presetGenerator.generator; })
            .map(function (generator) {
            if (generator.instrument === undefined) {
                return null;
            }
            var instrumentNumber = generator.instrument.amount;
            var instrument = instruments[instrumentNumber];
            // use the first generator in the zone as the default value
            var baseGenerator;
            if (instrument.info[0].generator) {
                var generator_1 = instrument.info[0].generator;
                if (generator_1.sampleID === undefined && generator_1.keyRange.lo === 0 && generator_1.keyRange.hi === 127) {
                    baseGenerator = generator_1;
                }
            }
            return instrument.info
                .map(function (info) { return createNoteInfo(parser, info.generator, baseGenerator); })
                .filter(function (x) { return x; }); // remove null
        })
            .filter(function (x) { return x; }) // remove null
            .reduce(function (a, b) { return a.concat(b); }, []); // flatten
        // select bank
        if (banks[bankNumber] === undefined) {
            banks[bankNumber] = [];
        }
        var bank = banks[bankNumber];
        bank[presetNumber] = {
            notes: notes,
            name: preset.header.presetName
        };
    }
    return banks;
}
function createNoteInfo(parser, targetGenerator, baseGenerator) {
    var generator = __assign({}, baseGenerator, targetGenerator);
    var _a = generator, keyRange = _a.keyRange, sampleID = _a.sampleID, velRange = _a.velRange;
    if (keyRange === undefined || sampleID === undefined) {
        return null;
    }
    var volAttack = getModGenAmount(generator, 'attackVolEnv', -12000);
    var volDecay = getModGenAmount(generator, 'decayVolEnv', -12000);
    var volSustain = getModGenAmount(generator, 'sustainVolEnv');
    var volRelease = getModGenAmount(generator, 'releaseVolEnv', -12000);
    var modAttack = getModGenAmount(generator, 'attackModEnv', -12000);
    var modDecay = getModGenAmount(generator, 'decayModEnv', -12000);
    var modSustain = getModGenAmount(generator, 'sustainModEnv');
    var modRelease = getModGenAmount(generator, 'releaseModEnv', -12000);
    var tune = (getModGenAmount(generator, 'coarseTune') +
        getModGenAmount(generator, 'fineTune') / 100);
    var scale = getModGenAmount(generator, 'scaleTuning', 100) / 100;
    var freqVibLFO = getModGenAmount(generator, 'freqVibLFO');
    var sampleId = getModGenAmount(generator, 'sampleID');
    var sampleHeader = parser.sampleHeader[sampleId];
    var basePitch = tune + (sampleHeader.pitchCorrection / 100) - getModGenAmount(generator, 'overridingRootKey', sampleHeader.originalPitch);
    return {
        sample: parser.sample[sampleId],
        sampleRate: sampleHeader.sampleRate,
        sampleName: sampleHeader.sampleName,
        modEnvToPitch: getModGenAmount(generator, 'modEnvToPitch') / 100,
        scaleTuning: scale,
        start: getModGenAmount(generator, 'startAddrsCoarseOffset') * 32768 +
            getModGenAmount(generator, 'startAddrsOffset'),
        end: getModGenAmount(generator, 'endAddrsCoarseOffset') * 32768 +
            getModGenAmount(generator, 'endAddrsOffset'),
        loopStart: (
        //(sampleHeader.startLoop - sampleHeader.start) +
        (sampleHeader.startLoop) +
            getModGenAmount(generator, 'startloopAddrsCoarseOffset') * 32768 +
            getModGenAmount(generator, 'startloopAddrsOffset')),
        loopEnd: (
        //(sampleHeader.endLoop - sampleHeader.start) +
        (sampleHeader.endLoop) +
            getModGenAmount(generator, 'endloopAddrsCoarseOffset') * 32768 +
            getModGenAmount(generator, 'endloopAddrsOffset')),
        volAttack: Math.pow(2, volAttack / 1200),
        volDecay: Math.pow(2, volDecay / 1200),
        volSustain: volSustain / 1000,
        volRelease: Math.pow(2, volRelease / 1200),
        modAttack: Math.pow(2, modAttack / 1200),
        modDecay: Math.pow(2, modDecay / 1200),
        modSustain: modSustain / 1000,
        modRelease: Math.pow(2, modRelease / 1200),
        initialFilterFc: getModGenAmount(generator, 'initialFilterFc', 13500),
        modEnvToFilterFc: getModGenAmount(generator, 'modEnvToFilterFc'),
        initialFilterQ: getModGenAmount(generator, 'initialFilterQ', 1),
        freqVibLFO: freqVibLFO ? Math.pow(2, freqVibLFO / 1200) * 8.176 : undefined,
        playbackRate: function (key) { return Math.pow(Math.pow(2, 1 / 12), (key + basePitch) * scale); },
        keyRange: keyRange,
        velRange: velRange
    };
}
function getModGenAmount(generator, enumeratorType, opt_default) {
    if (opt_default === void 0) { opt_default = 0; }
    return generator[enumeratorType] ? generator[enumeratorType].amount : opt_default;
}
function createBagModGen(zone, indexStart, indexEnd, zoneModGen) {
    var modgenInfo = [];
    var modgen = {
        unknown: [],
        'keyRange': {
            hi: 127,
            lo: 0
        }
    }; // TODO
    for (var i = indexStart; i < indexEnd; ++i) {
        var info = zoneModGen[i];
        modgenInfo.push(info);
        if (info.type === 'unknown') {
            modgen.unknown.push(info.value);
        }
        else {
            modgen[info.type] = info.value;
        }
    }
    return { modgen: modgen, modgenInfo: modgenInfo };
}
function createInstrumentGenerator(zone, index, instrumentZoneGenerator) {
    var modgen = createBagModGen(zone, zone[index].instrumentGeneratorIndex, zone[index + 1] ? zone[index + 1].instrumentGeneratorIndex : instrumentZoneGenerator.length, instrumentZoneGenerator);
    return {
        generator: modgen.modgen,
        generatorInfo: modgen.modgenInfo
    };
}
function createInstrumentModulator(zone, index, instrumentZoneModulator) {
    var modgen = createBagModGen(zone, zone[index].presetModulatorIndex, zone[index + 1] ? zone[index + 1].instrumentModulatorIndex : instrumentZoneModulator.length, instrumentZoneModulator);
    return {
        modulator: modgen.modgen,
        modulatorInfo: modgen.modgenInfo
    };
}
function createPresetGenerator(zone, index, presetZoneGenerator) {
    var modgen = createBagModGen(zone, zone[index].presetGeneratorIndex, zone[index + 1] ? zone[index + 1].presetGeneratorIndex : presetZoneGenerator.length, presetZoneGenerator);
    return {
        generator: modgen.modgen,
        generatorInfo: modgen.modgenInfo
    };
}
function createPresetModulator(zone, index, presetZoneModulator) {
    var modgen = createBagModGen(zone, zone[index].presetModulatorIndex, zone[index + 1] ? zone[index + 1].presetModulatorIndex : presetZoneModulator.length, presetZoneModulator);
    return {
        modulator: modgen.modgen,
        modulatorInfo: modgen.modgenInfo
    };
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var program_names_ts_1 = __webpack_require__(13);
function render(str) {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = str.replace(/^\s+/, "");
    return wrapper.firstElementChild;
}
function renderKeys() {
    var html = "";
    for (var i = 0; i < 128; i++) {
        var n = i % 12;
        var isBlack = [1, 3, 6, 8, 10].includes(n);
        html += "<div class=\"key " + (isBlack ? "black" : "white") + "\"></div>";
    }
    return html;
}
function renderProgramOptions(programNames, bank) {
    var html = "";
    var names = programNames[bank];
    for (var i in names) {
        var name_1 = names[i];
        html += "<option value=\"" + i + "\">" + i + ": " + name_1 + "</option>";
    }
    return "<select>" + html + "</select>";
}
function renderInstrument(program) {
    return render("\n    <div class=\"instrument\">\n      <div class=\"program\">" + program + "</div>\n      <div class=\"volume\"></div>\n      <div class=\"panpot\"></div>\n      <div class=\"pitchBend\"></div>\n      <div class=\"pitchBendSensitivity\"></div>\n      <div class=\"keys\">" + renderKeys() + "</div>\n    </div>\n  ");
}
function programNamesFromBankSet(bankSet) {
    return bankSet.map(function (bank) { return bank.map(function (s) { return s.name; }); });
}
function mergeProgramNames(left, right) {
    function mergedKeys(a, b) {
        return new Set(Object.keys(a).concat(Object.keys(b)));
    }
    var banks = mergedKeys(left, right);
    var result = {};
    banks.forEach(function (bank) {
        var l = left[bank] || [];
        var r = right[bank] || [];
        var list = {};
        var programs = mergedKeys(l, r);
        programs.forEach(function (p) {
            list[p] = (l[p] || "None") + " (" + (r[p] || "None") + ")";
        });
        result[bank] = list;
    });
    return result;
}
var View = /** @class */ (function () {
    function View() {
        this.drag = false;
    }
    View.prototype.draw = function (synth) {
        var _this = this;
        var element = this.element = render("<div />");
        var programNames = mergeProgramNames(programNamesFromBankSet(synth.soundFont.bankSet), program_names_ts_1["default"]);
        var _loop_1 = function (i) {
            var bank = i !== 9 ? 0 : 128;
            var program = renderProgramOptions(programNames, bank);
            var item = renderInstrument(program);
            var channel = i;
            var select = item.querySelector('select');
            if (select) {
                select.addEventListener('change', function (event) {
                    var target = event.target;
                    synth.programChange(channel, parseInt(target.value, 10));
                }, false);
                select.selectedIndex = synth.channels[i].instrument;
            }
            var notes = item.querySelectorAll(".key");
            var _loop_2 = function (j) {
                var key = j;
                notes[j].addEventListener('mousedown', function (event) {
                    event.preventDefault();
                    _this.drag = true;
                    synth.noteOn(channel, key, 127);
                });
                notes[j].addEventListener('mouseover', function (event) {
                    event.preventDefault();
                    if (_this.drag) {
                        synth.noteOn(channel, key, 127);
                    }
                });
                notes[j].addEventListener('mouseout', function (event) {
                    event.preventDefault();
                    synth.noteOff(channel, key, 0);
                });
                notes[j].addEventListener('mouseup', function (event) {
                    event.preventDefault();
                    _this.drag = false;
                    synth.noteOff(channel, key, 0);
                });
            };
            for (var j = 0; j < 128; ++j) {
                _loop_2(j);
            }
            element.appendChild(item);
        };
        for (var i = 0; i < 16; ++i) {
            _loop_1(i);
        }
        return element;
    };
    View.prototype.remove = function () {
        if (!this.element) {
            return;
        }
        this.element.parentNode.removeChild(this.element);
        this.element = null;
    };
    View.prototype.getInstrumentElement = function (channel) {
        return this.element.querySelectorAll(".instrument")[channel];
    };
    View.prototype.getKeyElement = function (channel, key) {
        return this.getInstrumentElement(channel).querySelectorAll(".key")[key];
    };
    View.prototype.noteOn = function (channel, key) {
        if (!this.element) {
            return;
        }
        this.getKeyElement(channel, key).classList.add('note-on');
    };
    View.prototype.noteOff = function (channel, key) {
        if (!this.element) {
            return;
        }
        this.getKeyElement(channel, key).classList.remove('note-on');
    };
    View.prototype.programChange = function (channel, instrument) {
        if (!this.element) {
            return;
        }
        var select = this.getInstrumentElement(channel).querySelector(".program select");
        if (select) {
            select.value = instrument;
        }
    };
    View.prototype.volumeChange = function (channel, volume) {
        if (!this.element) {
            return;
        }
        this.getInstrumentElement(channel).querySelector(".volume").textContent = volume;
    };
    View.prototype.panpotChange = function (channel, panpot) {
        if (!this.element) {
            return;
        }
        this.getInstrumentElement(channel).querySelector(".panpot").textContent = panpot;
    };
    View.prototype.pitchBend = function (channel, calculatedPitch) {
        if (!this.element) {
            return;
        }
        this.getInstrumentElement(channel).querySelector(".pitchBend").textContent = calculatedPitch;
    };
    View.prototype.pitchBendSensitivity = function (channel, sensitivity) {
        if (!this.element) {
            return;
        }
        this.getInstrumentElement(channel).querySelector(".pitchBendSensitivity").textContent = sensitivity;
    };
    return View;
}());
exports["default"] = View;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var ProgramNames = {
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
exports["default"] = ProgramNames;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var MidiMessageHandler = /** @class */ (function () {
    function MidiMessageHandler() {
        this.RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    MidiMessageHandler.prototype.processMidiMessage = function (message) {
        var channel = message[0] & 0x0f;
        var synth = this.synth;
        if (!synth) {
            return;
        }
        switch (message[0] & 0xf0) {
            case 0x80:// NoteOff: 8n kk vv
                synth.noteOff(channel, message[1], message[2]);
                break;
            case 0x90:// NoteOn: 9n kk vv
                if (message[2] > 0) {
                    synth.noteOn(channel, message[1], message[2]);
                }
                else {
                    synth.noteOff(channel, message[1], 0);
                }
                break;
            case 0xB0:// Control Change: Bn cc dd
                switch (message[1]) {
                    case 0x06:// Data Entry: Bn 06 dd
                        switch (this.RpnMsb[channel]) {
                            case 0:
                                switch (this.RpnLsb[channel]) {
                                    case 0:// Pitch Bend Sensitivity
                                        synth.pitchBendSensitivity(channel, message[2]);
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
                        synth.volumeChange(channel, message[2]);
                        break;
                    case 0x0A:// Panpot Change: Bn 0A dd
                        synth.panpotChange(channel, message[2]);
                        break;
                    case 0x78:// All Sound Off: Bn 78 00
                        synth.allSoundOff(channel);
                        break;
                    case 0x79:// Reset All Control: Bn 79 00
                        synth.resetAllControl(channel);
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
                synth.programChange(channel, message[1]);
                break;
            case 0xE0:// Pitch Bend
                synth.pitchBend(channel, message[1], message[2]);
                break;
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
                                        var volume = message[5] + (message[6] << 7);
                                        var MAX_VOLUME = 0x4000 - 1;
                                        synth.setMasterVolume(volume / MAX_VOLUME);
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
    };
    return MidiMessageHandler;
}());
exports["default"] = MidiMessageHandler;


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBlMjk4YjliNTJjYWJlODJhNzhjYSIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9zZjIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JpZmYudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NmMl9kYXRhLnRzIiwid2VicGFjazovLy8uL3NyYy9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0cmVhbS50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvc3ludGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dtbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc291bmRfZm9udF9zeW50aC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc291bmRfZm9udF9zeW50aF9ub3RlLnRzIiwid2VicGFjazovLy8uL3NyYy9zb3VuZF9mb250LnRzIiwid2VicGFjazovLy8uL3NyYy9zeW50aF92aWV3LnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9ncmFtX25hbWVzLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRpX21lc3NhZ2VfaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFD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QU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxLQUFLO1lBQ1AsS0FBSyxJQUFJLENBQUUsMkJBQTJCO2dCQUNwQyxZQUFZO2dCQUNaLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLEtBQUssSUFBSSxDQUFFLGVBQWU7d0JBQ3hCLE9BQU87d0JBQ1AsS0FBSztvQkFDUCxLQUFLLElBQUksQ0FBRSxXQUFXO3dCQUNwQiw0QkFBNEI7d0JBQzVCLFdBQVc7d0JBQ1gsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkIsS0FBSyxJQUFJLENBQUUsaUJBQWlCO2dDQUMxQixXQUFXO2dDQUNYLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ25CLEtBQUssSUFBSSxFQUFFLENBQUM7d0NBQ1YsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3Q0FDN0MsSUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUM7d0NBQzdCLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQzt3Q0FDMUMsS0FBSztvQ0FDUCxDQUFDO29DQUNEO3dDQUNFLEtBQUs7Z0NBQ1QsQ0FBQztnQ0FDRCxLQUFLOzRCQUNQO2dDQUNFLEtBQUs7d0JBQ1QsQ0FBQzt3QkFDRCxLQUFLO29CQUNQO3dCQUNFLEtBQUs7Z0JBQ1QsQ0FBQztnQkFDRCxLQUFLO1lBQ1AsUUFBUyxnQkFBZ0I7Z0JBQ3ZCLEtBQUs7UUFDVCxDQUFDO0lBQ0gsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyIsImZpbGUiOiJzZjIuc3ludGguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJzeW50aFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJzeW50aFwiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTI5OGI5YjUyY2FiZTgyYTc4Y2EiLCJleHBvcnQgY29uc3QgR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlID0gW1xyXG4gICdzdGFydEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kQWRkcnNPZmZzZXQnLFxyXG4gICdzdGFydGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ2VuZGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1BpdGNoJyxcclxuICAndmliTGZvVG9QaXRjaCcsXHJcbiAgJ21vZEVudlRvUGl0Y2gnLFxyXG4gICdpbml0aWFsRmlsdGVyRmMnLFxyXG4gICdpbml0aWFsRmlsdGVyUScsXHJcbiAgJ21vZExmb1RvRmlsdGVyRmMnLFxyXG4gICdtb2RFbnZUb0ZpbHRlckZjJyxcclxuICAnZW5kQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1ZvbHVtZScsXHJcbiAgdW5kZWZpbmVkLCAvLyAxNFxyXG4gICdjaG9ydXNFZmZlY3RzU2VuZCcsXHJcbiAgJ3JldmVyYkVmZmVjdHNTZW5kJyxcclxuICAncGFuJyxcclxuICB1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCwgLy8gMTgsMTksMjBcclxuICAnZGVsYXlNb2RMRk8nLFxyXG4gICdmcmVxTW9kTEZPJyxcclxuICAnZGVsYXlWaWJMRk8nLFxyXG4gICdmcmVxVmliTEZPJyxcclxuICAnZGVsYXlNb2RFbnYnLFxyXG4gICdhdHRhY2tNb2RFbnYnLFxyXG4gICdob2xkTW9kRW52JyxcclxuICAnZGVjYXlNb2RFbnYnLFxyXG4gICdzdXN0YWluTW9kRW52JyxcclxuICAncmVsZWFzZU1vZEVudicsXHJcbiAgJ2tleW51bVRvTW9kRW52SG9sZCcsXHJcbiAgJ2tleW51bVRvTW9kRW52RGVjYXknLFxyXG4gICdkZWxheVZvbEVudicsXHJcbiAgJ2F0dGFja1ZvbEVudicsXHJcbiAgJ2hvbGRWb2xFbnYnLFxyXG4gICdkZWNheVZvbEVudicsXHJcbiAgJ3N1c3RhaW5Wb2xFbnYnLFxyXG4gICdyZWxlYXNlVm9sRW52JyxcclxuICAna2V5bnVtVG9Wb2xFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Wb2xFbnZEZWNheScsXHJcbiAgJ2luc3RydW1lbnQnLFxyXG4gIHVuZGVmaW5lZCwgLy8gNDJcclxuICAna2V5UmFuZ2UnLFxyXG4gICd2ZWxSYW5nZScsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAna2V5bnVtJyxcclxuICAndmVsb2NpdHknLFxyXG4gICdpbml0aWFsQXR0ZW51YXRpb24nLFxyXG4gIHVuZGVmaW5lZCwgLy8gNDlcclxuICAnZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnY29hcnNlVHVuZScsXHJcbiAgJ2ZpbmVUdW5lJyxcclxuICAnc2FtcGxlSUQnLFxyXG4gICdzYW1wbGVNb2RlcycsXHJcbiAgdW5kZWZpbmVkLCAvLyA1NVxyXG4gICdzY2FsZVR1bmluZycsXHJcbiAgJ2V4Y2x1c2l2ZUNsYXNzJyxcclxuICAnb3ZlcnJpZGluZ1Jvb3RLZXknXHJcbl1cclxuXHJcbmV4cG9ydCBjb25zdCBJbmZvTmFtZVRhYmxlID0ge1xyXG4gIElDTVQ6IFwiY29tbWVudFwiLFxyXG4gIElDT1A6IFwiY29weXJpZ2h0XCIsXHJcbiAgSUNSRDogXCJjcmVhdGlvbl9kYXRlXCIsXHJcbiAgSUVORzogXCJlbmdpbmVlclwiLFxyXG4gIElOQU06IFwibmFtZVwiLFxyXG4gIElQUkQ6IFwicHJvZHVjdFwiLFxyXG4gIElTRlQ6IFwic29mdHdhcmVcIixcclxuICBpZmlsOiBcInZlcnNpb25cIixcclxuICBpc25nOiBcInNvdW5kX2VuZ2luZVwiLFxyXG4gIGlyb206IFwicm9tX25hbWVcIixcclxuICBpdmVyOiBcInJvbV92ZXJzaW9uXCJcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29uc3RhbnRzLnRzIiwiaW1wb3J0IHsgUGFyc2VyLCBDaHVuayB9IGZyb20gXCIuL3JpZmYudHNcIlxyXG5pbXBvcnQgeyBQcmVzZXRIZWFkZXIsIFNhbXBsZSwgUHJlc2V0QmFnLCBJbnN0cnVtZW50LCBJbnN0cnVtZW50QmFnLCBNb2R1bGF0b3JMaXN0LCBHZW5lcmF0b3JMaXN0IH0gZnJvbSBcIi4vc2YyX2RhdGEudHNcIlxyXG5pbXBvcnQgeyByZWFkU3RyaW5nIH0gZnJvbSBcIi4vaGVscGVyLnRzXCJcclxuaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9zdHJlYW0udHNcIlxyXG5pbXBvcnQgeyBJbmZvTmFtZVRhYmxlIH0gZnJvbSBcIi4vY29uc3RhbnRzLnRzXCJcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2FtcGxlSGVhZGVyIHtcclxuICBzYW1wbGVSYXRlOiBudW1iZXJcclxuICBzYW1wbGVOYW1lOiBudW1iZXJcclxuICBwaXRjaENvcnJlY3Rpb246IG51bWJlclxyXG4gIHN0YXJ0TG9vcDogbnVtYmVyXHJcbiAgZW5kTG9vcDogbnVtYmVyXHJcbiAgb3JpZ2luYWxQaXRjaDogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW5zdHJ1bWVudFpvbmUge1xyXG4gIGluc3RydW1lbnRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4OiBudW1iZXJcclxuICBwcmVzZXRNb2R1bGF0b3JJbmRleDogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICBpbnB1dDogVWludDhBcnJheVxyXG4gIHBhcnNlck9wdGlvbjoge30gfCB1bmRlZmluZWRcclxuICBwcmVzZXRIZWFkZXI6IHt9W11cclxuICBwcmVzZXRab25lOiB7fVtdXHJcbiAgcHJlc2V0Wm9uZU1vZHVsYXRvcjoge31bXVxyXG4gIHByZXNldFpvbmVHZW5lcmF0b3I6IHt9W11cclxuICBpbnN0cnVtZW50OiB7IGluc3RydW1lbnROYW1lOiBzdHJpbmcsIGluc3RydW1lbnRCYWdJbmRleDogbnVtYmVyIH1bXVxyXG4gIGluc3RydW1lbnRab25lOiBJbnN0cnVtZW50Wm9uZVtdXHJcbiAgaW5zdHJ1bWVudFpvbmVNb2R1bGF0b3I6IHt9W11cclxuICBpbnN0cnVtZW50Wm9uZUdlbmVyYXRvcjoge31bXVxyXG4gIHNhbXBsZUhlYWRlcjogU2FtcGxlSGVhZGVyW11cclxuICBzYW1wbGU6IEludDE2QXJyYXlbXVxyXG4gIHNhbXBsaW5nRGF0YTogQ2h1bmtcclxuICBpbmZvOiB7fVxyXG5cclxuICBjb25zdHJ1Y3RvcihpbnB1dDogVWludDhBcnJheSwgb3B0X3BhcmFtczogeyBwYXJzZXJPcHRpb24/OiB7fSB9ID0ge30pIHtcclxuICAgIHRoaXMuaW5wdXQgPSBpbnB1dFxyXG4gICAgdGhpcy5wYXJzZXJPcHRpb24gPSBvcHRfcGFyYW1zLnBhcnNlck9wdGlvblxyXG4gIH1cclxuXHJcbiAgcGFyc2UoKSB7XHJcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKHRoaXMuaW5wdXQsIHRoaXMucGFyc2VyT3B0aW9uKVxyXG5cclxuICAgIC8vIHBhcnNlIFJJRkYgY2h1bmtcclxuICAgIHBhcnNlci5wYXJzZSgpXHJcbiAgICBpZiAocGFyc2VyLmNodW5rTGlzdC5sZW5ndGggIT09IDEpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBjaHVuayBsZW5ndGgnKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNodW5rID0gcGFyc2VyLmdldENodW5rKDApXHJcbiAgICBpZiAoY2h1bmsgPT09IG51bGwpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjaHVuayBub3QgZm91bmQnKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucGFyc2VSaWZmQ2h1bmsoY2h1bmssIHRoaXMuaW5wdXQpXHJcbiAgICB0aGlzLmlucHV0ID0gbnVsbFxyXG4gIH1cclxuXHJcbiAgcGFyc2VSaWZmQ2h1bmsoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiUklGRlwiLCBcInNmYmtcIilcclxuXHJcbiAgICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgc2ZiayBzdHJ1Y3R1cmUnKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIElORk8tbGlzdFxyXG4gICAgdGhpcy5pbmZvID0gcGFyc2VJbmZvTGlzdChjaHVua0xpc3RbMF0sIGRhdGEpXHJcblxyXG4gICAgLy8gc2R0YS1saXN0XHJcbiAgICB0aGlzLnNhbXBsaW5nRGF0YSA9IHBhcnNlU2R0YUxpc3QoY2h1bmtMaXN0WzFdLCBkYXRhKVxyXG5cclxuICAgIC8vIHBkdGEtbGlzdFxyXG4gICAgdGhpcy5wYXJzZVBkdGFMaXN0KGNodW5rTGlzdFsyXSwgZGF0YSlcclxuICB9XHJcblxyXG4gIHBhcnNlUGR0YUxpc3QoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcInBkdGFcIilcclxuXHJcbiAgICAvLyBjaGVjayBudW1iZXIgb2YgY2h1bmtzXHJcbiAgICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gOSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGR0YSBjaHVuaycpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wcmVzZXRIZWFkZXIgPSBwYXJzZVBoZHIoY2h1bmtMaXN0WzBdLCBkYXRhKVxyXG4gICAgdGhpcy5wcmVzZXRab25lID0gcGFyc2VQYmFnKGNodW5rTGlzdFsxXSwgZGF0YSlcclxuICAgIHRoaXMucHJlc2V0Wm9uZU1vZHVsYXRvciA9IHBhcnNlUG1vZChjaHVua0xpc3RbMl0sIGRhdGEpXHJcbiAgICB0aGlzLnByZXNldFpvbmVHZW5lcmF0b3IgPSBwYXJzZVBnZW4oY2h1bmtMaXN0WzNdLCBkYXRhKVxyXG4gICAgdGhpcy5pbnN0cnVtZW50ID0gcGFyc2VJbnN0KGNodW5rTGlzdFs0XSwgZGF0YSkgYXMgYW55XHJcbiAgICB0aGlzLmluc3RydW1lbnRab25lID0gcGFyc2VJYmFnKGNodW5rTGlzdFs1XSwgZGF0YSkgYXMgSW5zdHJ1bWVudFpvbmVbXVxyXG4gICAgdGhpcy5pbnN0cnVtZW50Wm9uZU1vZHVsYXRvciA9IHBhcnNlSW1vZChjaHVua0xpc3RbNl0sIGRhdGEpXHJcbiAgICB0aGlzLmluc3RydW1lbnRab25lR2VuZXJhdG9yID0gcGFyc2VJZ2VuKGNodW5rTGlzdFs3XSwgZGF0YSlcclxuICAgIHRoaXMuc2FtcGxlSGVhZGVyID0gcGFyc2VTaGRyKGNodW5rTGlzdFs4XSwgZGF0YSkgYXMgU2FtcGxlSGVhZGVyW11cclxuICAgIHRoaXMuc2FtcGxlID0gbG9hZFNhbXBsZSh0aGlzLnNhbXBsZUhlYWRlciwgdGhpcy5zYW1wbGluZ0RhdGEub2Zmc2V0LCBkYXRhKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBleHBlY3RlZFR5cGUsIGV4cGVjdGVkU2lnbmF0dXJlKSB7XHJcbiAgLy8gY2hlY2sgcGFyc2UgdGFyZ2V0XHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyArIGNodW5rLnR5cGUpXHJcbiAgfVxyXG5cclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuXHJcbiAgLy8gY2hlY2sgc2lnbmF0dXJlXHJcbiAgY29uc3Qgc2lnbmF0dXJlID0gc3RyZWFtLnJlYWRTdHJpbmcoNClcclxuICBpZiAoc2lnbmF0dXJlICE9PSBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKVxyXG4gIH1cclxuXHJcbiAgLy8gcmVhZCBzdHJ1Y3R1cmVcclxuICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKGRhdGEsIHsnaW5kZXgnOiBzdHJlYW0uaXAsICdsZW5ndGgnOiBjaHVuay5zaXplIC0gNH0pXHJcbiAgcGFyc2VyLnBhcnNlKClcclxuXHJcbiAgcmV0dXJuIHBhcnNlci5jaHVua0xpc3RcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VJbmZvTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpOiB7fSB7XHJcbiAgY29uc3QgaW5mbyA9IHt9XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJJTkZPXCIpXHJcblxyXG4gIGZvciAobGV0IHAgb2YgY2h1bmtMaXN0KSB7XHJcbiAgICBjb25zdCB7IG9mZnNldCwgc2l6ZSwgdHlwZSB9ID0gcFxyXG4gICAgY29uc3QgbmFtZSA9IEluZm9OYW1lVGFibGVbdHlwZV0gfHwgdHlwZVxyXG4gICAgaW5mb1tuYW1lXSA9IHJlYWRTdHJpbmcoZGF0YSwgb2Zmc2V0LCBvZmZzZXQgKyBzaXplKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGluZm9cclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpOiBDaHVuayB7XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJzZHRhXCIpXHJcblxyXG4gIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAxKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RPRE8nKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFswXVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rKGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSwgdHlwZTogc3RyaW5nLCBmYWN0b3J5KToge31bXSB7XHJcbiAgY29uc3QgcmVzdWx0ID0gW11cclxuXHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IHR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgICsgY2h1bmsudHlwZSlcclxuICB9XHJcbiAgXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcbiAgY29uc3Qgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemVcclxuICBcclxuICB3aGlsZSAoc3RyZWFtLmlwIDwgc2l6ZSkge1xyXG4gICAgcmVzdWx0LnB1c2goZmFjdG9yeShzdHJlYW0pKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5jb25zdCBwYXJzZVBoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGhkclwiLCBzdHJlYW0gPT4gUHJlc2V0SGVhZGVyLnBhcnNlKHN0cmVhbSkpXHJcbmNvbnN0IHBhcnNlUGJhZyA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwYmFnXCIsIHN0cmVhbSA9PiBQcmVzZXRCYWcucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VJbnN0ID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImluc3RcIiwgc3RyZWFtID0+IEluc3RydW1lbnQucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VJYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImliYWdcIiwgc3RyZWFtID0+IEluc3RydW1lbnRCYWcucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VQbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBtb2RcIiwgc3RyZWFtID0+IE1vZHVsYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VJbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImltb2RcIiwgc3RyZWFtID0+IE1vZHVsYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VQZ2VuID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBnZW5cIiwgc3RyZWFtID0+IEdlbmVyYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VJZ2VuID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImlnZW5cIiwgc3RyZWFtID0+IEdlbmVyYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VTaGRyID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInNoZHJcIiwgc3RyZWFtID0+IFNhbXBsZS5wYXJzZShzdHJlYW0pKVxyXG5cclxuZnVuY3Rpb24gYWRqdXN0U2FtcGxlRGF0YShzYW1wbGUsIHNhbXBsZVJhdGUpIHtcclxuICBsZXQgbXVsdGlwbHkgPSAxXHJcblxyXG4gIC8vIGJ1ZmZlclxyXG4gIHdoaWxlIChzYW1wbGVSYXRlIDwgMjIwNTApIHtcclxuICAgIGNvbnN0IG5ld1NhbXBsZSA9IG5ldyBJbnQxNkFycmF5KHNhbXBsZS5sZW5ndGggKiAyKVxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGogPSAwLCBpbCA9IHNhbXBsZS5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XHJcbiAgICAgIG5ld1NhbXBsZVtqKytdID0gc2FtcGxlW2ldXHJcbiAgICAgIG5ld1NhbXBsZVtqKytdID0gc2FtcGxlW2ldXHJcbiAgICB9XHJcbiAgICBzYW1wbGUgPSBuZXdTYW1wbGVcclxuICAgIG11bHRpcGx5ICo9IDJcclxuICAgIHNhbXBsZVJhdGUgKj0gMlxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNhbXBsZSxcclxuICAgIG11bHRpcGx5XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU2FtcGxlKHNhbXBsZUhlYWRlciwgc2FtcGxpbmdEYXRhT2Zmc2V0LCBkYXRhKTogSW50MTZBcnJheVtdIHtcclxuICBjb25zdCBzYW1wbGVzID0gW11cclxuICBmb3IgKGxldCBoZWFkZXIgb2Ygc2FtcGxlSGVhZGVyKSB7XHJcbiAgICBsZXQgc2FtcGxlID0gbmV3IEludDE2QXJyYXkobmV3IFVpbnQ4QXJyYXkoZGF0YS5zdWJhcnJheShcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLnN0YXJ0ICogMixcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLmVuZCAgICogMlxyXG4gICAgKSkuYnVmZmVyKVxyXG4gICAgaWYgKGhlYWRlci5zYW1wbGVSYXRlID4gMCkge1xyXG4gICAgICBjb25zdCBhZGp1c3QgPSBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgaGVhZGVyLnNhbXBsZVJhdGUpXHJcbiAgICAgIHNhbXBsZSA9IGFkanVzdC5zYW1wbGVcclxuICAgICAgaGVhZGVyLnNhbXBsZVJhdGUgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5zdGFydExvb3AgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5lbmRMb29wICo9IGFkanVzdC5tdWx0aXBseVxyXG4gICAgfVxyXG4gICAgc2FtcGxlcy5wdXNoKHNhbXBsZSlcclxuICB9XHJcbiAgcmV0dXJuIHNhbXBsZXNcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZjIudHMiLCJleHBvcnQgY2xhc3MgUGFyc2VyIHtcclxuICBjaHVua0xpc3Q6IENodW5rW10gPSBbXVxyXG4gIFxyXG4gIHByaXZhdGUgaW5wdXQ6IFVpbnQ4QXJyYXlcclxuICBwcml2YXRlIGlwOiBudW1iZXJcclxuICBwcml2YXRlIGxlbmd0aDogbnVtYmVyXHJcbiAgcHJpdmF0ZSBvZmZzZXQ6IG51bWJlclxyXG4gIHByaXZhdGUgcGFkZGluZzogYm9vbGVhblxyXG4gIHByaXZhdGUgYmlnRW5kaWFuOiBib29sZWFuXHJcblxyXG4gIGNvbnN0cnVjdG9yKGlucHV0OiBVaW50OEFycmF5LCBvcHRfcGFyYW1zOiB7fSA9IHt9KSB7XHJcbiAgICB0aGlzLmlucHV0ID0gaW5wdXRcclxuICAgIHRoaXMuaXAgPSBvcHRfcGFyYW1zWydpbmRleCddIHx8IDBcclxuICAgIHRoaXMubGVuZ3RoID0gb3B0X3BhcmFtc1snbGVuZ3RoJ10gfHwgaW5wdXQubGVuZ3RoIC0gdGhpcy5pcFxyXG4gICAgdGhpcy5jaHVua0xpc3QgPSBbXVxyXG4gICAgdGhpcy5vZmZzZXQgPSB0aGlzLmlwXHJcbiAgICB0aGlzLnBhZGRpbmcgPVxyXG4gICAgICBvcHRfcGFyYW1zWydwYWRkaW5nJ10gIT09IHZvaWQgMCA/IG9wdF9wYXJhbXNbJ3BhZGRpbmcnXSA6IHRydWVcclxuICAgIHRoaXMuYmlnRW5kaWFuID1cclxuICAgICAgb3B0X3BhcmFtc1snYmlnRW5kaWFuJ10gIT09IHZvaWQgMCA/IG9wdF9wYXJhbXNbJ2JpZ0VuZGlhbiddIDogZmFsc2VcclxuICB9XHJcbiAgXHJcbiAgcGFyc2UoKSB7XHJcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aCArIHRoaXMub2Zmc2V0XHJcblxyXG4gICAgdGhpcy5jaHVua0xpc3QgPSBbXVxyXG5cclxuICAgIHdoaWxlICh0aGlzLmlwIDwgbGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMucGFyc2VDaHVuaygpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwYXJzZUNodW5rKCkge1xyXG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmlucHV0XHJcbiAgICBsZXQgaXAgPSB0aGlzLmlwXHJcbiAgICBsZXQgc2l6ZVxyXG5cclxuICAgIHRoaXMuY2h1bmtMaXN0LnB1c2gobmV3IENodW5rKFxyXG4gICAgICBTdHJpbmcuZnJvbUNoYXJDb2RlKGlucHV0W2lwKytdLCBpbnB1dFtpcCsrXSwgaW5wdXRbaXArK10sIGlucHV0W2lwKytdKSxcclxuICAgICAgKHNpemUgPSB0aGlzLmJpZ0VuZGlhbiA/XHJcbiAgICAgICAgKChpbnB1dFtpcCsrXSA8PCAyNCkgfCAoaW5wdXRbaXArK10gPDwgMTYpIHxcclxuICAgICAgICAgIChpbnB1dFtpcCsrXSA8PCAgOCkgfCAoaW5wdXRbaXArK10gICAgICApKSA+Pj4gMCA6XHJcbiAgICAgICAgKChpbnB1dFtpcCsrXSAgICAgICkgfCAoaW5wdXRbaXArK10gPDwgIDgpIHxcclxuICAgICAgICAgIChpbnB1dFtpcCsrXSA8PCAxNikgfCAoaW5wdXRbaXArK10gPDwgMjQpKSA+Pj4gMFxyXG4gICAgICApLFxyXG4gICAgICBpcFxyXG4gICAgKSlcclxuXHJcbiAgICBpcCArPSBzaXplXHJcblxyXG4gICAgLy8gcGFkZGluZ1xyXG4gICAgaWYgKHRoaXMucGFkZGluZyAmJiAoKGlwIC0gdGhpcy5vZmZzZXQpICYgMSkgPT09IDEpIHtcclxuICAgICAgaXArK1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaXAgPSBpcFxyXG4gIH1cclxuXHJcbiAgZ2V0Q2h1bmsoaW5kZXg6IG51bWJlcikge1xyXG4gICAgY29uc3QgY2h1bmsgPSB0aGlzLmNodW5rTGlzdFtpbmRleF1cclxuXHJcbiAgICBpZiAoY2h1bmsgPT09IHZvaWQgMCkge1xyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjaHVua1xyXG4gIH1cclxuXHJcbiAgZ2V0TnVtYmVyT2ZDaHVua3MoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jaHVua0xpc3QubGVuZ3RoXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2h1bmsge1xyXG4gIHR5cGU6IHN0cmluZ1xyXG4gIHNpemU6IG51bWJlclxyXG4gIG9mZnNldDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgdGhpcy5zaXplID0gc2l6ZVxyXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3JpZmYudHMiLCJpbXBvcnQgeyBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgfSBmcm9tIFwiLi9jb25zdGFudHMudHNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIFZlcnNpb25UYWcge1xyXG4gIG1ham9yOiBudW1iZXJcclxuICBtaW5vcjogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcmVzZXRIZWFkZXIge1xyXG4gIHByZXNldE5hbWU6IHN0cmluZ1xyXG4gIHByZXNldDogbnVtYmVyXHJcbiAgYmFuazogbnVtYmVyXHJcbiAgcHJlc2V0QmFnSW5kZXg6IG51bWJlclxyXG4gIGxpYnJhcnk6IG51bWJlclxyXG4gIGdlbnJlOiBudW1iZXJcclxuICBtb3JwaG9sb2d5OiBudW1iZXJcclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbSkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBQcmVzZXRIZWFkZXIoKVxyXG4gICAgcC5wcmVzZXROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICBwLnByZXNldCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLmJhbmsgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLmxpYnJhcnkgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHAuZ2VucmUgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHAubW9ycGhvbG9neSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcmV0dXJuIHBcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcmVzZXRCYWcge1xyXG4gIHByZXNldEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBwcmVzZXRNb2R1bGF0b3JJbmRleDogbnVtYmVyXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0QmFnKClcclxuICAgIHAucHJlc2V0R2VuZXJhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gcFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vZHVsYXRvckxpc3Qge1xyXG4gIHNvdXJjZU9wZXI6IG51bWJlclxyXG4gIGRlc3RpbmF0aW9uT3BlcjogR2VuZXJhdG9yXHJcbiAgdmFsdWU6IE9iamVjdFxyXG4gIGFtb3VudFNvdXJjZU9wZXI6IG51bWJlclxyXG4gIHRyYW5zT3BlcjogR2VuZXJhdG9yXHJcbiAgdHlwZTogc3RyaW5nXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgTW9kdWxhdG9yTGlzdCgpXHJcblxyXG4gICAgdC5zb3VyY2VPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIGNvbnN0IGNvZGUgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC5kZXN0aW5hdGlvbk9wZXIgPSBjb2RlXHJcbiAgICBcclxuICAgIGNvbnN0IGtleSA9IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZVtjb2RlXVxyXG4gICAgdC50eXBlID0ga2V5XHJcblxyXG4gICAgaWYgKGtleSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIC8vIEFtb3VudFxyXG4gICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgIGNvZGU6IGNvZGUsXHJcbiAgICAgICAgYW1vdW50OiBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gQW1vdW50XHJcbiAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgY2FzZSAna2V5UmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICdrZXludW0nOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGxvOiBzdHJlYW0ucmVhZEJ5dGUoKSxcclxuICAgICAgICAgICAgaGk6IHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgICAgICBhbW91bnQ6IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0LmFtb3VudFNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC50cmFuc09wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yTGlzdCB7XHJcbiAgdHlwZTogc3RyaW5nXHJcbiAgdmFsdWU6IE9iamVjdFxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IE1vZHVsYXRvckxpc3QoKVxyXG4gICAgXHJcbiAgICBjb25zdCBjb2RlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIGNvbnN0IGtleSA9IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZVtjb2RlXVxyXG4gICAgdC50eXBlID0ga2V5XHJcblxyXG4gICAgaWYgKGtleSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgY29kZSxcclxuICAgICAgICBhbW91bnQ6IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgIGNhc2UgJ2tleW51bSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAna2V5UmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICd2ZWxvY2l0eSc6XHJcbiAgICAgICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgICAgICBsbzogc3RyZWFtLnJlYWRCeXRlKCksXHJcbiAgICAgICAgICAgIGhpOiBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICAgICAgYW1vdW50OiBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnQge1xyXG4gIGluc3RydW1lbnROYW1lOiBzdHJpbmdcclxuICBpbnN0cnVtZW50QmFnSW5kZXg6IG51bWJlclxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudCgpXHJcbiAgICB0Lmluc3RydW1lbnROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICB0Lmluc3RydW1lbnRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnRCYWcge1xyXG4gIGluc3RydW1lbnRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4OiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IEluc3RydW1lbnRCYWcoKVxyXG4gICAgdC5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC5pbnN0cnVtZW50TW9kdWxhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTYW1wbGUge1xyXG4gIHNhbXBsZU5hbWU6IHN0cmluZ1xyXG4gIHN0YXJ0OiBudW1iZXJcclxuICBlbmQ6IG51bWJlclxyXG4gIHN0YXJ0TG9vcDogbnVtYmVyXHJcbiAgZW5kTG9vcDogbnVtYmVyXHJcbiAgc2FtcGxlUmF0ZTogbnVtYmVyXHJcbiAgb3JpZ2luYWxQaXRjaDogbnVtYmVyXHJcbiAgcGl0Y2hDb3JyZWN0aW9uOiBudW1iZXJcclxuICBzYW1wbGVMaW5rOiBudW1iZXJcclxuICBzYW1wbGVUeXBlOiBudW1iZXJcclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbSkge1xyXG4gICAgY29uc3QgcyA9IG5ldyBTYW1wbGUoKVxyXG5cclxuICAgIHMuc2FtcGxlTmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcy5zdGFydCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5lbmQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuc3RhcnRMb29wID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmVuZExvb3AgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuc2FtcGxlUmF0ZSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5vcmlnaW5hbFBpdGNoID0gc3RyZWFtLnJlYWRCeXRlKClcclxuICAgIHMucGl0Y2hDb3JyZWN0aW9uID0gc3RyZWFtLnJlYWRJbnQ4KClcclxuICAgIHMuc2FtcGxlTGluayA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBzLnNhbXBsZVR5cGUgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHMuc3RhcnRMb29wIC09IHMuc3RhcnRcclxuICAgIHMuZW5kTG9vcCAtPSBzLnN0YXJ0XHJcblxyXG4gICAgcmV0dXJuIHNcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW51bSB7bnVtYmVyfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFNhbXBsZUxpbmsgPSB7XHJcbiAgbW9ub1NhbXBsZTogMSxcclxuICByaWdodFNhbXBsZTogMixcclxuICBsZWZ0U2FtcGxlOiA0LFxyXG4gIGxpbmtlZFNhbXBsZTogOCxcclxuICBSb21Nb25vU2FtcGxlOiAweDgwMDEsXHJcbiAgUm9tUmlnaHRTYW1wbGU6IDB4ODAwMixcclxuICBSb21MZWZ0U2FtcGxlOiAweDgwMDQsXHJcbiAgUm9tTGlua2VkU2FtcGxlOiAweDgwMDhcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2YyX2RhdGEudHMiLCJleHBvcnQgZnVuY3Rpb24gcmVhZFN0cmluZyhkYXRhOiBVaW50OEFycmF5LCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgY29uc3Qgc3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBkYXRhLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxyXG4gIGNvbnN0IG51bGxMb2NhdGlvbiA9IHN0ci5pbmRleE9mKFwiXFx1MDAwMFwiKVxyXG4gIGlmIChudWxsTG9jYXRpb24gPiAwKSB7XHJcbiAgICByZXR1cm4gc3RyLnN1YnN0cigwLCBudWxsTG9jYXRpb24pXHJcbiAgfVxyXG4gIHJldHVybiBzdHJcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaGVscGVyLnRzIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcclxuICBwcml2YXRlIGRhdGE6IFVpbnQ4QXJyYXlcclxuICBpcDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9mZnNldCkge1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YVxyXG4gICAgdGhpcy5pcCA9IG9mZnNldFxyXG4gIH1cclxuXHJcbiAgcmVhZFN0cmluZyhzaXplOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCB0aGlzLmRhdGEuc3ViYXJyYXkodGhpcy5pcCwgdGhpcy5pcCArPSBzaXplKSlcclxuICAgIGNvbnN0IG51bGxMb2NhdGlvbiA9IHN0ci5pbmRleE9mKFwiXFx1MDAwMFwiKVxyXG4gICAgaWYgKG51bGxMb2NhdGlvbiA+IDApIHtcclxuICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMCwgbnVsbExvY2F0aW9uKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0clxyXG4gIH1cclxuXHJcbiAgcmVhZFdPUkQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCsrXSB8ICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KVxyXG4gIH1cclxuXHJcbiAgcmVhZERXT1JEKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB0aGlzLmRhdGFbdGhpcy5pcCsrXSB8IFxyXG4gICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOCkgfCBcclxuICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDE2KSB8IFxyXG4gICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMjQpXHJcbiAgICApID4+PiAwXHJcbiAgfVxyXG5cclxuICByZWFkQnl0ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCsrXVxyXG4gIH1cclxuXHJcbiAgcmVhZEF0KG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXAgKyBvZmZzZXRdXHJcbiAgfVxyXG5cclxuICAvKiBoZWxwZXIgKi9cclxuXHJcbiAgcmVhZFVJbnQ4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZEJ5dGUoKVxyXG4gIH1cclxuICBcclxuICByZWFkSW50OCgpIHtcclxuICAgIHJldHVybiAodGhpcy5yZWFkQnl0ZSgpIDw8IDI0KSA+PiAyNFxyXG4gIH1cclxuICBcclxuICByZWFkVUludDE2KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZFdPUkQoKVxyXG4gIH1cclxuXHJcbiAgcmVhZEludDE2KCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnJlYWRXT1JEKCkgPDwgMTYpID4+IDE2XHJcbiAgfVxyXG5cclxuICByZWFkVUludDMyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZERXT1JEKClcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N0cmVhbS50cyIsImltcG9ydCBXZWJNaWRpTGluayBmcm9tIFwiLi4vc3JjL3dtbC50c1wiXHJcbmV4cG9ydCBkZWZhdWx0IFdlYk1pZGlMaW5rXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2V4cG9ydC9zeW50aC5qcyIsImltcG9ydCBTeW50aGVzaXplciBmcm9tIFwiLi9zb3VuZF9mb250X3N5bnRoLnRzXCJcclxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vc3ludGhfdmlldy50c1wiXHJcbmltcG9ydCBNaWRpTWVzc2FnZUhhbmRsZXIgZnJvbSBcIi4vbWlkaV9tZXNzYWdlX2hhbmRsZXIudHNcIlxyXG5cclxuLyoqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuY29uc3QgV2ViTWlkaUxpbmsgPSBmdW5jdGlvbigpIHtcclxuICAvKiogQHR5cGUge2Z1bmN0aW9uKEFycmF5QnVmZmVyKX0gKi9cclxuICB0aGlzLmxvYWRDYWxsYmFjaztcclxuICAvKiogQHR5cGUge0Z1bmN0aW9ufSAqL1xyXG4gIHRoaXMubWVzc2FnZUhhbmRsZXIgPSB0aGlzLm9ubWVzc2FnZS5iaW5kKHRoaXMpO1xyXG5cclxuICB0aGlzLm1pZGlNZXNzYWdlSGFuZGxlciA9IG5ldyBNaWRpTWVzc2FnZUhhbmRsZXIoKTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMucmVhZHkgPSB0cnVlO1xyXG4gIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xyXG59O1xyXG5cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24odXJsKSB7XHJcbiAgaWYgKCF0aGlzLnJlYWR5KSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uIG9ubG9hZCgpIHtcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBvbmxvYWQsIGZhbHNlKTtcclxuICAgICAgdGhpcy5sb2FkKHVybCk7XHJcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5sb2FkKHVybCk7XHJcbiAgfVxyXG59O1xyXG5cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbih1cmwpIHtcclxuICAvKiogQHR5cGUge1hNTEh0dHBSZXF1ZXN0fSAqL1xyXG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcbiAgeGhyLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XHJcblxyXG4gIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oZXYpIHtcclxuICAgIC8qKiBAdHlwZSB7WE1MSHR0cFJlcXVlc3R9ICovXHJcbiAgICB2YXIgeGhyID0gZXYudGFyZ2V0O1xyXG5cclxuICAgIHRoaXMub25sb2FkKHhoci5yZXNwb25zZSk7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMubG9hZENhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHRoaXMubG9hZENhbGxiYWNrKHhoci5yZXNwb25zZSk7XHJcbiAgICB9XHJcbiAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XHJcblxyXG4gIHhoci5zZW5kKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gcmVzcG9uc2VcclxuICovXHJcbldlYk1pZGlMaW5rLnByb3RvdHlwZS5vbmxvYWQgPSBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gIC8qKiBAdHlwZSB7VWludDhBcnJheX0gKi9cclxuICB2YXIgaW5wdXQgPSBuZXcgVWludDhBcnJheShyZXNwb25zZSk7XHJcblxyXG4gIHRoaXMubG9hZFNvdW5kRm9udChpbnB1dCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtVaW50OEFycmF5fSBpbnB1dFxyXG4gKi9cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLmxvYWRTb3VuZEZvbnQgPSBmdW5jdGlvbihpbnB1dCkge1xyXG4gIC8qKiBAdHlwZSB7U3ludGhlc2l6ZXJ9ICovXHJcbiAgdmFyIHN5bnRoO1xyXG5cclxuICBpZiAoIXRoaXMuc3ludGgpIHtcclxuICAgIHN5bnRoID0gdGhpcy5zeW50aCA9IG5ldyBTeW50aGVzaXplcihpbnB1dCk7XHJcbiAgICB2YXIgdmlldyA9IHRoaXMudmlldyA9IG5ldyBWaWV3KClcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlldy5kcmF3KHN5bnRoKSk7XHJcbiAgICB0aGlzLm1pZGlNZXNzYWdlSGFuZGxlci5zeW50aCA9IHN5bnRoO1xyXG4gICAgc3ludGguaW5pdCgpO1xyXG4gICAgc3ludGguc3RhcnQoKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5tZXNzYWdlSGFuZGxlciwgZmFsc2UpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzeW50aCA9IHRoaXMuc3ludGg7XHJcbiAgICBzeW50aC5yZWZyZXNoSW5zdHJ1bWVudHMoaW5wdXQpO1xyXG4gIH1cclxuXHJcbiAgLy8gbGluayByZWFkeVxyXG4gIGlmICh3aW5kb3cub3BlbmVyKSB7XHJcbiAgICB3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKFwibGluayxyZWFkeVwiLCAnKicpO1xyXG4gIH0gZWxzZSBpZiAod2luZG93LnBhcmVudCAhPT0gd2luZG93KSB7XHJcbiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKFwibGluayxyZWFkeVwiLCAnKicpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0V2ZW50fSBldlxyXG4gKi9cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2KSB7XHJcbiAgdmFyIG1zZyA9IGV2LmRhdGEuc3BsaXQoJywnKTtcclxuICB2YXIgdHlwZSA9IG1zZy5zaGlmdCgpO1xyXG4gIHZhciBjb21tYW5kO1xyXG5cclxuICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgIGNhc2UgJ21pZGknOlxyXG4gICAgICB0aGlzLm1pZGlNZXNzYWdlSGFuZGxlci5wcm9jZXNzTWlkaU1lc3NhZ2UoXHJcbiAgICAgICAgbXNnLm1hcChmdW5jdGlvbihoZXgpIHtcclxuICAgICAgICAgIHJldHVybiBwYXJzZUludChoZXgsIDE2KTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2xpbmsnOlxyXG4gICAgICBjb21tYW5kID0gbXNnLnNoaWZ0KCk7XHJcbiAgICAgIHN3aXRjaCAoY29tbWFuZCkge1xyXG4gICAgICAgIGNhc2UgJ3JlcXBhdGNoJzpcclxuICAgICAgICAgIC8vIFRPRE86IGR1bW15IGRhdGFcclxuICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuZXIucG9zdE1lc3NhZ2UoXCJsaW5rLHBhdGNoXCIsICcqJyk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5wYXJlbnQgIT09IHdpbmRvdykge1xyXG4gICAgICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKFwibGluayxwYXRjaFwiLCAnKicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2V0cGF0Y2gnOlxyXG4gICAgICAgICAgLy8gVE9ETzogTk9QXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgY29uc29sZS5lcnJvcigndW5rbm93biBsaW5rIG1lc3NhZ2U6JywgY29tbWFuZCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ3Vua25vd24gbWVzc2FnZSB0eXBlJyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oQXJyYXlCdWZmZXIpfSBjYWxsYmFja1xyXG4gKi9cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLnNldExvYWRDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdGhpcy5sb2FkQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdlYk1pZGlMaW5rXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy93bWwudHMiLCJpbXBvcnQgU3ludGhlc2l6ZXJOb3RlIGZyb20gXCIuL3NvdW5kX2ZvbnRfc3ludGhfbm90ZS50c1wiXHJcbmltcG9ydCBQYXJzZXIgZnJvbSBcIi4vc2YyLnRzXCJcclxuaW1wb3J0IFNvdW5kRm9udCBmcm9tIFwiLi9zb3VuZF9mb250LnRzXCJcclxuXHJcbmNvbnN0IEJBU0VfVk9MVU1FID0gMC40XHJcblxyXG5jbGFzcyBDaGFubmVsIHtcclxuICBpbnN0cnVtZW50ID0gMFxyXG4gIHZvbHVtZSA9IDBcclxuICBwaXRjaEJlbmQgPSAwXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPSAwXHJcbiAgcGFucG90ID0gMFxyXG4gIGN1cnJlbnROb3RlT246IFN5bnRoZXNpemVyTm90ZVtdID0gW11cclxufVxyXG5cclxuaW50ZXJmYWNlIFZpZXcge1xyXG4gIGRyYXcoKVxyXG4gIHJlbW92ZSgpXHJcbiAgZ2V0SW5zdHJ1bWVudEVsZW1lbnQoKVxyXG4gIGdldEtleUVsZW1lbnQoKVxyXG4gIG5vdGVPbihjaGFubmVsTnVtYmVyOiBudW1iZXIsIGtleTogbnVtYmVyKVxyXG4gIG5vdGVPZmYoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlcilcclxuICBwcm9ncmFtQ2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgaW5zdHJ1bWVudDogbnVtYmVyKVxyXG4gIHZvbHVtZUNoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHZvbHVtZTogbnVtYmVyKVxyXG4gIHBhbnBvdENoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHBhbnBvdDogbnVtYmVyKVxyXG4gIHBpdGNoQmVuZChjaGFubmVsTnVtYmVyOiBudW1iZXIsIHBpdGNoQmVuZDogbnVtYmVyKVxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWxOdW1iZXI6IG51bWJlciwgc2Vuc2l0aXZpdHk6IG51bWJlcilcclxufVxyXG5cclxuY2xhc3MgRHVtbXlWaWV3IGltcGxlbWVudHMgVmlldyB7XHJcbiAgZHJhdygpIHsgfVxyXG4gIHJlbW92ZSgpIHsgfVxyXG4gIGdldEluc3RydW1lbnRFbGVtZW50KCkgeyB9XHJcbiAgZ2V0S2V5RWxlbWVudCgpIHsgfVxyXG4gIG5vdGVPbigpIHsgfVxyXG4gIG5vdGVPZmYoKSB7IH1cclxuICBwcm9ncmFtQ2hhbmdlKCkgeyB9XHJcbiAgdm9sdW1lQ2hhbmdlKCkgeyB9XHJcbiAgcGFucG90Q2hhbmdlKCkgeyB9XHJcbiAgcGl0Y2hCZW5kKCkgeyB9XHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoKSB7IH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ludGhlc2l6ZXIge1xyXG4gIGlucHV0OiBVaW50OEFycmF5ID0gbnVsbFxyXG4gIGJhbms6IG51bWJlciA9IDBcclxuICBidWZmZXJTaXplOiBudW1iZXIgPSAxMDI0XHJcbiAgY3R4OiBBdWRpb0NvbnRleHRcclxuICBnYWluTWFzdGVyOiBHYWluTm9kZVxyXG4gIGNoYW5uZWxzOiBDaGFubmVsW10gPSBbXVxyXG4gIG1hc3RlclZvbHVtZTogbnVtYmVyID0gMS4wXHJcbiAgdmlldzogVmlldyA9IG5ldyBEdW1teVZpZXcoKVxyXG4gIHNvdW5kRm9udDogU291bmRGb250XHJcblxyXG4gIGNvbnN0cnVjdG9yKGN0eCkge1xyXG4gICAgdGhpcy5jdHggPSBjdHhcclxuICAgIHRoaXMuZ2Fpbk1hc3RlciA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKVxyXG4gICAgdGhpcy5zZXRNYXN0ZXJWb2x1bWUodGhpcy5tYXN0ZXJWb2x1bWUpXHJcbiAgICB0aGlzLmluaXQoKVxyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xyXG4gICAgICB0aGlzLmNoYW5uZWxzLnB1c2gobmV3IENoYW5uZWwoKSlcclxuICAgICAgdGhpcy5wcm9ncmFtQ2hhbmdlKGksIGkgIT09IDkgPyBpIDogMClcclxuICAgICAgdGhpcy52b2x1bWVDaGFuZ2UoaSwgMHg2NClcclxuICAgICAgdGhpcy5wYW5wb3RDaGFuZ2UoaSwgMHg0MClcclxuICAgICAgdGhpcy5waXRjaEJlbmQoaSwgMHgwMCwgMHg0MCk7IC8vIDgxOTJcclxuICAgICAgdGhpcy5waXRjaEJlbmRTZW5zaXRpdml0eShpLCAyKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVmcmVzaEluc3RydW1lbnRzKGlucHV0OiBVaW50OEFycmF5KSB7XHJcbiAgICB0aGlzLmlucHV0ID0gaW5wdXRcclxuXHJcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKGlucHV0KVxyXG4gICAgcGFyc2VyLnBhcnNlKClcclxuICAgIHRoaXMuc291bmRGb250ID0gbmV3IFNvdW5kRm9udChwYXJzZXIpXHJcbiAgfVxyXG5cclxuICBjb25uZWN0KGRlc3RpbmF0aW9uKSB7XHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIuY29ubmVjdChkZXN0aW5hdGlvbilcclxuICB9XHJcblxyXG4gIHNldE1hc3RlclZvbHVtZSh2b2x1bWUpIHtcclxuICAgIHRoaXMubWFzdGVyVm9sdW1lID0gdm9sdW1lXHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIuZ2Fpbi52YWx1ZSA9IEJBU0VfVk9MVU1FICogdm9sdW1lIC8gMHg4MDAwXHJcbiAgfVxyXG5cclxuICBub3RlT24oY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnNvdW5kRm9udCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBjaGFubmVsTnVtYmVyID09PSA5ID8gMTI4IDogdGhpcy5iYW5rXHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXkgPSB0aGlzLnNvdW5kRm9udC5nZXRJbnN0cnVtZW50S2V5KGJhbmtOdW1iZXIsIGNoYW5uZWwuaW5zdHJ1bWVudCwga2V5LCB2ZWxvY2l0eSlcclxuXHJcbiAgICBpZiAoIWluc3RydW1lbnRLZXkpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHBhbnBvdCA9IGNoYW5uZWwucGFucG90IC0gNjRcclxuICAgIHBhbnBvdCAvPSBwYW5wb3QgPCAwID8gNjQgOiA2M1xyXG5cclxuICAgIC8vIGNyZWF0ZSBub3RlIGluZm9ybWF0aW9uXHJcbiAgICBpbnN0cnVtZW50S2V5WydjaGFubmVsJ10gPSBjaGFubmVsTnVtYmVyXHJcbiAgICBpbnN0cnVtZW50S2V5WydrZXknXSA9IGtleVxyXG4gICAgaW5zdHJ1bWVudEtleVsndmVsb2NpdHknXSA9IHZlbG9jaXR5XHJcbiAgICBpbnN0cnVtZW50S2V5WydwYW5wb3QnXSA9IHBhbnBvdFxyXG4gICAgaW5zdHJ1bWVudEtleVsndm9sdW1lJ10gPSBjaGFubmVsLnZvbHVtZSAvIDEyN1xyXG4gICAgaW5zdHJ1bWVudEtleVsncGl0Y2hCZW5kJ10gPSBjaGFubmVsLnBpdGNoQmVuZCAtIDB4MjAwMFxyXG4gICAgaW5zdHJ1bWVudEtleVsncGl0Y2hCZW5kU2Vuc2l0aXZpdHknXSA9IGNoYW5uZWwucGl0Y2hCZW5kU2Vuc2l0aXZpdHlcclxuXHJcbiAgICAvLyBub3RlIG9uXHJcbiAgICBjb25zdCBub3RlID0gbmV3IFN5bnRoZXNpemVyTm90ZSh0aGlzLmN0eCwgdGhpcy5nYWluTWFzdGVyLCBpbnN0cnVtZW50S2V5KVxyXG4gICAgbm90ZS5ub3RlT24oKVxyXG4gICAgY2hhbm5lbC5jdXJyZW50Tm90ZU9uLnB1c2gobm90ZSlcclxuXHJcbiAgICB0aGlzLnZpZXcubm90ZU9uKGNoYW5uZWxOdW1iZXIsIGtleSlcclxuICB9XHJcblxyXG4gIG5vdGVPZmYoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnNvdW5kRm9udCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBjaGFubmVsTnVtYmVyID09PSA5ID8gMTI4IDogdGhpcy5iYW5rXHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXkgPSB0aGlzLnNvdW5kRm9udC5nZXRJbnN0cnVtZW50S2V5KGJhbmtOdW1iZXIsIGNoYW5uZWwuaW5zdHJ1bWVudCwga2V5KVxyXG5cclxuICAgIGlmICghaW5zdHJ1bWVudEtleSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjdXJyZW50Tm90ZU9uID0gY2hhbm5lbC5jdXJyZW50Tm90ZU9uXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gY3VycmVudE5vdGVPbi5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XHJcbiAgICAgIGNvbnN0IG5vdGUgPSBjdXJyZW50Tm90ZU9uW2ldXHJcbiAgICAgIGlmIChub3RlLmtleSA9PT0ga2V5KSB7XHJcbiAgICAgICAgbm90ZS5ub3RlT2ZmKClcclxuICAgICAgICBjdXJyZW50Tm90ZU9uLnNwbGljZShpLCAxKVxyXG4gICAgICAgIC0taVxyXG4gICAgICAgIC0taWxcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlldy5ub3RlT2ZmKGNoYW5uZWxOdW1iZXIsIGtleSlcclxuICB9XHJcblxyXG4gIHByb2dyYW1DaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBpbnN0cnVtZW50OiBudW1iZXIpIHtcclxuICAgIHRoaXMudmlldy5wcm9ncmFtQ2hhbmdlKGNoYW5uZWxOdW1iZXIsIGluc3RydW1lbnQpXHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLmluc3RydW1lbnQgPSBpbnN0cnVtZW50XHJcbiAgfVxyXG5cclxuICB2b2x1bWVDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCB2b2x1bWU6IG51bWJlcikge1xyXG4gICAgdGhpcy52aWV3LnZvbHVtZUNoYW5nZShjaGFubmVsTnVtYmVyLCB2b2x1bWUpXHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLnZvbHVtZSA9IHZvbHVtZVxyXG4gIH1cclxuXHJcbiAgcGFucG90Q2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgcGFucG90OiBudW1iZXIpIHtcclxuICAgIHRoaXMudmlldy5wYW5wb3RDaGFuZ2UoY2hhbm5lbE51bWJlciwgcGFucG90KVxyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS5wYW5wb3QgPSBwYW5wb3RcclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZChjaGFubmVsTnVtYmVyOiBudW1iZXIsIGxvd2VyQnl0ZTogbnVtYmVyLCBoaWdoZXJCeXRlOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGJlbmQgPSAobG93ZXJCeXRlICYgMHg3ZikgfCAoKGhpZ2hlckJ5dGUgJiAweDdmKSA8PCA3KVxyXG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl1cclxuICAgIGNvbnN0IGN1cnJlbnROb3RlT24gPSBjaGFubmVsLmN1cnJlbnROb3RlT25cclxuICAgIGNvbnN0IGNhbGN1bGF0ZWQgPSBiZW5kIC0gMHgyMDAwXHJcblxyXG4gICAgdGhpcy52aWV3LnBpdGNoQmVuZChjaGFubmVsTnVtYmVyLCBjYWxjdWxhdGVkKVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGN1cnJlbnROb3RlT24ubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgICBjdXJyZW50Tm90ZU9uW2ldLnVwZGF0ZVBpdGNoQmVuZChjYWxjdWxhdGVkKVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5uZWwucGl0Y2hCZW5kID0gYmVuZFxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBzZW5zaXRpdml0eTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnZpZXcucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbE51bWJlciwgc2Vuc2l0aXZpdHkpXHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLnBpdGNoQmVuZFNlbnNpdGl2aXR5ID0gc2Vuc2l0aXZpdHlcclxuICB9XHJcblxyXG4gIGFsbFNvdW5kT2ZmKGNoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gICAgY29uc3QgY3VycmVudE5vdGVPbiA9IHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl0uY3VycmVudE5vdGVPblxyXG5cclxuICAgIHdoaWxlIChjdXJyZW50Tm90ZU9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5ub3RlT2ZmKGNoYW5uZWxOdW1iZXIsIGN1cnJlbnROb3RlT25bMF0ua2V5LCAwKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzZXRBbGxDb250cm9sKGNoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gICAgdGhpcy5waXRjaEJlbmQoY2hhbm5lbE51bWJlciwgMHgwMCwgMHg0MCk7IC8vIDgxOTJcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NvdW5kX2ZvbnRfc3ludGgudHMiLCJpbXBvcnQgeyBJbnN0cnVtZW50IH0gZnJvbSBcIi4vc2YyX2RhdGFcIjtcclxuXHJcbmludGVyZmFjZSBJbnN0cnVtZW50U3RhdGUge1xyXG4gIGNoYW5uZWw6IG51bWJlclxyXG4gIGtleTogbnVtYmVyXHJcbiAgc2FtcGxlOiBVaW50OEFycmF5XHJcbiAgc2FtcGxlUmF0ZTogbnVtYmVyXHJcbiAgcGxheWJhY2tSYXRlOiBGdW5jdGlvblxyXG4gIHN0YXJ0OiBudW1iZXJcclxuICBlbmQ6IG51bWJlclxyXG4gIGxvb3BTdGFydDogbnVtYmVyXHJcbiAgbG9vcEVuZDogbnVtYmVyXHJcbiAgdm9sdW1lOiBudW1iZXJcclxuICBwYW5wb3Q6IG51bWJlclxyXG4gIHZvbEF0dGFjazogbnVtYmVyXHJcbiAgbW9kQXR0YWNrOiBudW1iZXJcclxuICB2ZWxvY2l0eTogbnVtYmVyXHJcbiAgcGl0Y2hCZW5kOiBudW1iZXJcclxuICBwaXRjaEJlbmRTZW5zaXRpdml0eTogbnVtYmVyXHJcbiAgbW9kRW52VG9QaXRjaDogbnVtYmVyXHJcbiAgbW9kRW52VG9GaWx0ZXJGYzogbnVtYmVyXHJcbiAgaW5pdGlhbEZpbHRlckZjOiBudW1iZXJcclxuICBpbml0aWFsRmlsdGVyUTogbnVtYmVyXHJcbiAgdm9sRGVjYXk6IG51bWJlclxyXG4gIHZvbFN1c3RhaW46IG51bWJlclxyXG4gIHZvbFJlbGVhc2U6IG51bWJlclxyXG4gIG1vZERlY2F5OiBudW1iZXJcclxuICBtb2RTdXN0YWluOiBudW1iZXJcclxuICBtb2RSZWxlYXNlOiBudW1iZXJcclxuICBzY2FsZVR1bmluZzogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bnRoZXNpemVyTm90ZSB7XHJcblxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgLy8gYXVkaW8gbm9kZVxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIGF1ZGlvQnVmZmVyOiBBdWRpb0J1ZmZlclxyXG4gIGJ1ZmZlclNvdXJjZTogQXVkaW9CdWZmZXJTb3VyY2VOb2RlXHJcbiAgcGFubmVyOiBQYW5uZXJOb2RlXHJcbiAgZ2Fpbk91dHB1dDogR2Fpbk5vZGVcclxuICBjdHg6IEF1ZGlvQ29udGV4dFxyXG4gIGRlc3RpbmF0aW9uOiBBdWRpb05vZGVcclxuICBmaWx0ZXI6IEJpcXVhZEZpbHRlck5vZGVcclxuICBpbnN0cnVtZW50OiBJbnN0cnVtZW50U3RhdGVcclxuICBjaGFubmVsOiBudW1iZXJcclxuICBrZXk6IG51bWJlclxyXG4gIHZlbG9jaXR5OiBudW1iZXJcclxuICBidWZmZXI6IFVpbnQ4QXJyYXlcclxuICBwbGF5YmFja1JhdGU6IG51bWJlclxyXG4gIHNhbXBsZVJhdGU6IG51bWJlclxyXG4gIHZvbHVtZTogbnVtYmVyXHJcbiAgcGFucG90OiBudW1iZXJcclxuICBwaXRjaEJlbmQ6IG51bWJlclxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5OiBudW1iZXJcclxuICBtb2RFbnZUb1BpdGNoOiBudW1iZXJcclxuXHJcbiAgLy8gc3RhdGVcclxuICBzdGFydFRpbWU6IG51bWJlclxyXG4gIGNvbXB1dGVkUGxheWJhY2tSYXRlOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IoY3R4OiBBdWRpb0NvbnRleHQsIGRlc3RpbmF0aW9uOiBBdWRpb05vZGUsIGluc3RydW1lbnQ6IEluc3RydW1lbnRTdGF0ZSkge1xyXG4gICAgdGhpcy5jdHggPSBjdHhcclxuICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvblxyXG4gICAgdGhpcy5pbnN0cnVtZW50ID0gaW5zdHJ1bWVudFxyXG4gICAgdGhpcy5jaGFubmVsID0gaW5zdHJ1bWVudC5jaGFubmVsXHJcbiAgICB0aGlzLmtleSA9IGluc3RydW1lbnQua2V5XHJcbiAgICB0aGlzLnZlbG9jaXR5ID0gaW5zdHJ1bWVudC52ZWxvY2l0eVxyXG4gICAgdGhpcy5idWZmZXIgPSBpbnN0cnVtZW50LnNhbXBsZVxyXG4gICAgdGhpcy5wbGF5YmFja1JhdGUgPSBpbnN0cnVtZW50LnBsYXliYWNrUmF0ZShpbnN0cnVtZW50LmtleSlcclxuICAgIHRoaXMuc2FtcGxlUmF0ZSA9IGluc3RydW1lbnQuc2FtcGxlUmF0ZVxyXG4gICAgdGhpcy52b2x1bWUgPSBpbnN0cnVtZW50LnZvbHVtZVxyXG4gICAgdGhpcy5wYW5wb3QgPSBpbnN0cnVtZW50LnBhbnBvdFxyXG4gICAgdGhpcy5waXRjaEJlbmQgPSBpbnN0cnVtZW50LnBpdGNoQmVuZFxyXG4gICAgdGhpcy5waXRjaEJlbmRTZW5zaXRpdml0eSA9IGluc3RydW1lbnQucGl0Y2hCZW5kU2Vuc2l0aXZpdHlcclxuICAgIHRoaXMubW9kRW52VG9QaXRjaCA9IGluc3RydW1lbnQubW9kRW52VG9QaXRjaFxyXG4gICAgdGhpcy5zdGFydFRpbWUgPSBjdHguY3VycmVudFRpbWVcclxuICAgIHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUgPSB0aGlzLnBsYXliYWNrUmF0ZVxyXG4gIH1cclxuXHJcbiAgbm90ZU9uKCkge1xyXG4gICAgY29uc3QgeyBjdHgsIGluc3RydW1lbnQsIGJ1ZmZlciB9ID0gdGhpc1xyXG5cclxuICAgIGNvbnN0IHNhbXBsZSA9IGJ1ZmZlci5zdWJhcnJheSgwLCBidWZmZXIubGVuZ3RoICsgaW5zdHJ1bWVudC5lbmQpXHJcbiAgICB0aGlzLmF1ZGlvQnVmZmVyID0gY3R4LmNyZWF0ZUJ1ZmZlcigxLCBzYW1wbGUubGVuZ3RoLCB0aGlzLnNhbXBsZVJhdGUpXHJcblxyXG4gICAgY29uc3QgY2hhbm5lbERhdGEgPSB0aGlzLmF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKDApXHJcbiAgICBjaGFubmVsRGF0YS5zZXQoc2FtcGxlKVxyXG5cclxuICAgIC8vIGJ1ZmZlciBzb3VyY2VcclxuICAgIGNvbnN0IGJ1ZmZlclNvdXJjZSA9IGN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxyXG4gICAgYnVmZmVyU291cmNlLmJ1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXJcclxuICAgIGJ1ZmZlclNvdXJjZS5sb29wID0gKHRoaXMuY2hhbm5lbCAhPT0gOSlcclxuICAgIGJ1ZmZlclNvdXJjZS5sb29wU3RhcnQgPSBpbnN0cnVtZW50Lmxvb3BTdGFydCAvIHRoaXMuc2FtcGxlUmF0ZVxyXG4gICAgYnVmZmVyU291cmNlLmxvb3BFbmQgPSBpbnN0cnVtZW50Lmxvb3BFbmQgLyB0aGlzLnNhbXBsZVJhdGVcclxuICAgIGJ1ZmZlclNvdXJjZS5vbmVuZGVkID0gKCkgPT4gdGhpcy5kaXNjb25uZWN0KClcclxuICAgIHRoaXMuYnVmZmVyU291cmNlID0gYnVmZmVyU291cmNlXHJcbiAgICB0aGlzLnVwZGF0ZVBpdGNoQmVuZCh0aGlzLnBpdGNoQmVuZClcclxuXHJcbiAgICAvLyBhdWRpbyBub2RlXHJcbiAgICBjb25zdCBwYW5uZXIgPSB0aGlzLnBhbm5lciA9IGN0eC5jcmVhdGVQYW5uZXIoKVxyXG4gICAgY29uc3Qgb3V0cHV0ID0gdGhpcy5nYWluT3V0cHV0ID0gY3R4LmNyZWF0ZUdhaW4oKVxyXG4gICAgY29uc3Qgb3V0cHV0R2FpbiA9IG91dHB1dC5nYWluXHJcblxyXG4gICAgLy8gZmlsdGVyXHJcbiAgICBjb25zdCBmaWx0ZXIgPSBjdHguY3JlYXRlQmlxdWFkRmlsdGVyKClcclxuICAgIGZpbHRlci50eXBlID0gXCJsb3dwYXNzXCJcclxuICAgIHRoaXMuZmlsdGVyID0gZmlsdGVyXHJcblxyXG4gICAgLy8gcGFucG90XHJcbiAgICBwYW5uZXIucGFubmluZ01vZGVsID0gXCJlcXVhbHBvd2VyXCJcclxuICAgIHBhbm5lci5zZXRQb3NpdGlvbihcclxuICAgICAgTWF0aC5zaW4odGhpcy5wYW5wb3QgKiBNYXRoLlBJIC8gMiksXHJcbiAgICAgIDAsXHJcbiAgICAgIE1hdGguY29zKHRoaXMucGFucG90ICogTWF0aC5QSSAvIDIpXHJcbiAgICApXHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIEF0dGFjaywgRGVjYXksIFN1c3RhaW5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBjb25zdCBub3cgPSB0aGlzLmN0eC5jdXJyZW50VGltZVxyXG4gICAgY29uc3Qgdm9sQXR0YWNrVGltZSA9IG5vdyArIGluc3RydW1lbnQudm9sQXR0YWNrXHJcbiAgICBjb25zdCBtb2RBdHRhY2tUaW1lID0gbm93ICsgaW5zdHJ1bWVudC5tb2RBdHRhY2tcclxuICAgIGNvbnN0IHZvbERlY2F5ID0gdm9sQXR0YWNrVGltZSArIGluc3RydW1lbnQudm9sRGVjYXlcclxuICAgIGNvbnN0IG1vZERlY2F5ID0gbW9kQXR0YWNrVGltZSArIGluc3RydW1lbnQubW9kRGVjYXlcclxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IGluc3RydW1lbnQuc3RhcnQgLyB0aGlzLnNhbXBsZVJhdGVcclxuXHJcbiAgICBjb25zdCBhdHRhY2tWb2x1bWUgPSB0aGlzLnZvbHVtZSAqICh0aGlzLnZlbG9jaXR5IC8gMTI3KVxyXG4gICAgb3V0cHV0R2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCBub3cpXHJcbiAgICBvdXRwdXRHYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGF0dGFja1ZvbHVtZSwgdm9sQXR0YWNrVGltZSlcclxuICAgIG91dHB1dEdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoYXR0YWNrVm9sdW1lICogKDEgLSBpbnN0cnVtZW50LnZvbFN1c3RhaW4pLCB2b2xEZWNheSlcclxuXHJcbiAgICBmaWx0ZXIuUS5zZXRWYWx1ZUF0VGltZShpbnN0cnVtZW50LmluaXRpYWxGaWx0ZXJRIC8gMTAsIG5vdylcclxuICAgIGNvbnN0IGJhc2VGcmVxID0gYW1vdW50VG9GcmVxKGluc3RydW1lbnQuaW5pdGlhbEZpbHRlckZjKVxyXG4gICAgY29uc3QgcGVla0ZyZXEgPSBhbW91bnRUb0ZyZXEoaW5zdHJ1bWVudC5pbml0aWFsRmlsdGVyRmMgKyBpbnN0cnVtZW50Lm1vZEVudlRvRmlsdGVyRmMpXHJcbiAgICBjb25zdCBzdXN0YWluRnJlcSA9IGJhc2VGcmVxICsgKHBlZWtGcmVxIC0gYmFzZUZyZXEpICogKDEgLSBpbnN0cnVtZW50Lm1vZFN1c3RhaW4pXHJcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGJhc2VGcmVxLCBub3cpXHJcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHBlZWtGcmVxLCBtb2RBdHRhY2tUaW1lKVxyXG4gICAgZmlsdGVyLmZyZXF1ZW5jeS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShzdXN0YWluRnJlcSwgbW9kRGVjYXkpXHJcblxyXG4gICAgZnVuY3Rpb24gYW1vdW50VG9GcmVxKHZhbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIE1hdGgucG93KDIsICh2YWwgLSA2OTAwKSAvIDEyMDApICogNDQwXHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29ubmVjdFxyXG4gICAgYnVmZmVyU291cmNlLmNvbm5lY3QoZmlsdGVyKVxyXG4gICAgZmlsdGVyLmNvbm5lY3QocGFubmVyKVxyXG4gICAgcGFubmVyLmNvbm5lY3Qob3V0cHV0KVxyXG4gICAgb3V0cHV0LmNvbm5lY3QodGhpcy5kZXN0aW5hdGlvbilcclxuXHJcbiAgICAvLyBmaXJlXHJcbiAgICBidWZmZXJTb3VyY2Uuc3RhcnQoMCwgc3RhcnRUaW1lKVxyXG4gIH1cclxuXHJcbiAgbm90ZU9mZigpIHtcclxuICAgIGNvbnN0IHsgaW5zdHJ1bWVudCwgYnVmZmVyU291cmNlIH0gPSB0aGlzXHJcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmdhaW5PdXRwdXRcclxuICAgIGNvbnN0IG5vdyA9IHRoaXMuY3R4LmN1cnJlbnRUaW1lXHJcbiAgICBjb25zdCB2b2xFbmRUaW1lID0gbm93ICsgaW5zdHJ1bWVudC52b2xSZWxlYXNlXHJcbiAgICBjb25zdCBtb2RFbmRUaW1lID0gbm93ICsgaW5zdHJ1bWVudC5tb2RSZWxlYXNlXHJcblxyXG4gICAgaWYgKCF0aGlzLmF1ZGlvQnVmZmVyKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8vIGlnbm9yZSBub3RlIG9mZiBmb3Igcmh5dGhtIHRyYWNrXHJcbiAgICBpZiAodGhpcy5jaGFubmVsID09PSA5KSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBSZWxlYXNlXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgb3V0cHV0LmdhaW4uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKDApXHJcbiAgICBvdXRwdXQuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCB2b2xFbmRUaW1lKVxyXG4gICAgYnVmZmVyU291cmNlLnBsYXliYWNrUmF0ZS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoMClcclxuICAgIGJ1ZmZlclNvdXJjZS5wbGF5YmFja1JhdGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodGhpcy5jb21wdXRlZFBsYXliYWNrUmF0ZSwgbW9kRW5kVGltZSlcclxuXHJcbiAgICBidWZmZXJTb3VyY2UubG9vcCA9IGZhbHNlXHJcbiAgICBidWZmZXJTb3VyY2Uuc3RvcCh2b2xFbmRUaW1lKVxyXG4gIH1cclxuXHJcbiAgZGlzY29ubmVjdCgpIHtcclxuICAgIHRoaXMuYnVmZmVyU291cmNlLmRpc2Nvbm5lY3QoMClcclxuICAgIHRoaXMucGFubmVyLmRpc2Nvbm5lY3QoMClcclxuICAgIHRoaXMuZ2Fpbk91dHB1dC5kaXNjb25uZWN0KDApXHJcbiAgfVxyXG5cclxuICBzY2hlZHVsZVBsYXliYWNrUmF0ZSgpIHtcclxuICAgIGNvbnN0IHBsYXliYWNrUmF0ZSA9IHRoaXMuYnVmZmVyU291cmNlLnBsYXliYWNrUmF0ZVxyXG4gICAgY29uc3QgY29tcHV0ZWQgPSB0aGlzLmNvbXB1dGVkUGxheWJhY2tSYXRlXHJcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhcnRUaW1lXHJcbiAgICBjb25zdCBpbnN0cnVtZW50ID0gdGhpcy5pbnN0cnVtZW50XHJcbiAgICBjb25zdCBtb2RBdHRhY2sgPSBzdGFydCArIGluc3RydW1lbnQubW9kQXR0YWNrXHJcbiAgICBjb25zdCBtb2REZWNheSA9IG1vZEF0dGFjayArIGluc3RydW1lbnQubW9kRGVjYXlcclxuICAgIGNvbnN0IHBlZWtQaXRjaCA9IGNvbXB1dGVkICogTWF0aC5wb3coXHJcbiAgICAgIE1hdGgucG93KDIsIDEgLyAxMiksXHJcbiAgICAgIHRoaXMubW9kRW52VG9QaXRjaCAqIHRoaXMuaW5zdHJ1bWVudC5zY2FsZVR1bmluZ1xyXG4gICAgKVxyXG5cclxuICAgIHBsYXliYWNrUmF0ZS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoMClcclxuICAgIHBsYXliYWNrUmF0ZS5zZXRWYWx1ZUF0VGltZShjb21wdXRlZCwgc3RhcnQpXHJcbiAgICBwbGF5YmFja1JhdGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUocGVla1BpdGNoLCBtb2RBdHRhY2spXHJcbiAgICBwbGF5YmFja1JhdGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoY29tcHV0ZWQgKyAocGVla1BpdGNoIC0gY29tcHV0ZWQpICogKDEgLSBpbnN0cnVtZW50Lm1vZFN1c3RhaW4pLCBtb2REZWNheSlcclxuICB9XHJcblxyXG4gIHVwZGF0ZVBpdGNoQmVuZChwaXRjaEJlbmQ6IG51bWJlcikge1xyXG4gICAgdGhpcy5jb21wdXRlZFBsYXliYWNrUmF0ZSA9IHRoaXMucGxheWJhY2tSYXRlICogTWF0aC5wb3coXHJcbiAgICAgIE1hdGgucG93KDIsIDEgLyAxMiksXHJcbiAgICAgIChcclxuICAgICAgICB0aGlzLnBpdGNoQmVuZFNlbnNpdGl2aXR5ICogKFxyXG4gICAgICAgICAgcGl0Y2hCZW5kIC8gKHBpdGNoQmVuZCA8IDAgPyA4MTkyIDogODE5MSlcclxuICAgICAgICApXHJcbiAgICAgICkgKiB0aGlzLmluc3RydW1lbnQuc2NhbGVUdW5pbmdcclxuICAgIClcclxuICAgIHRoaXMuc2NoZWR1bGVQbGF5YmFja1JhdGUoKVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc291bmRfZm9udF9zeW50aF9ub3RlLnRzIiwiaW1wb3J0IFBhcnNlciwgeyBJbnN0cnVtZW50Wm9uZSB9IGZyb20gXCIuL3NmMlwiXHJcblxyXG4vKipcclxuICogUGFyc2VyIOOBp+iqreOBv+i+vOOCk+OBoOOCteOCpuODs+ODieODleOCqeODs+ODiOOBruODh+ODvOOCv+OCklxyXG4gKiBTeW50aGVzaXplciDjgYvjgonliKnnlKjjgZfjgoTjgZnjgYTlvaLjgavjgZnjgovjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdW5kRm9udCB7XHJcbiAgYmFua1NldDogT2JqZWN0W11cclxuXHJcbiAgY29uc3RydWN0b3IocGFyc2VyKSB7XHJcbiAgICB0aGlzLmJhbmtTZXQgPSBjcmVhdGVBbGxJbnN0cnVtZW50cyhwYXJzZXIpXHJcbiAgfVxyXG5cclxuICBnZXRJbnN0cnVtZW50S2V5KGJhbmtOdW1iZXIsIGluc3RydW1lbnROdW1iZXIsIGtleSwgdmVsb2NpdHkgPSAxMDApIHtcclxuICAgIGNvbnN0IGJhbmsgPSB0aGlzLmJhbmtTZXRbYmFua051bWJlcl1cclxuICAgIGlmICghYmFuaykge1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgXCJiYW5rIG5vdCBmb3VuZDogYmFuaz0lcyBpbnN0cnVtZW50PSVzXCIsXHJcbiAgICAgICAgYmFua051bWJlcixcclxuICAgICAgICBpbnN0cnVtZW50TnVtYmVyXHJcbiAgICAgIClcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbnN0cnVtZW50ID0gYmFua1tpbnN0cnVtZW50TnVtYmVyXVxyXG4gICAgaWYgKCFpbnN0cnVtZW50KSB7XHJcbiAgICAgIC8vIFRPRE9cclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgIFwiaW5zdHJ1bWVudCBub3QgZm91bmQ6IGJhbms9JXMgaW5zdHJ1bWVudD0lc1wiLFxyXG4gICAgICAgIGJhbmtOdW1iZXIsXHJcbiAgICAgICAgaW5zdHJ1bWVudE51bWJlclxyXG4gICAgICApXHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaW5zdHJ1bWVudEtleSA9IGluc3RydW1lbnQubm90ZXMuZmlsdGVyKGkgPT4ge1xyXG4gICAgICBsZXQgaXNJbktleVJhbmdlID0gZmFsc2VcclxuICAgICAgaWYgKGkua2V5UmFuZ2UpIHtcclxuICAgICAgICBpc0luS2V5UmFuZ2UgPSBrZXkgPj0gaS5rZXlSYW5nZS5sbyAmJiBrZXkgPD0gaS5rZXlSYW5nZS5oaVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgaXNJblZlbFJhbmdlID0gdHJ1ZVxyXG4gICAgICBpZiAoaS52ZWxSYW5nZSkge1xyXG4gICAgICAgIGlzSW5WZWxSYW5nZSA9IHZlbG9jaXR5ID49IGkudmVsUmFuZ2UubG8gJiYgdmVsb2NpdHkgPD0gaS52ZWxSYW5nZS5oaVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaXNJbktleVJhbmdlICYmIGlzSW5WZWxSYW5nZVxyXG4gICAgfSlbMF1cclxuXHJcbiAgICBpZiAoIWluc3RydW1lbnRLZXkpIHtcclxuICAgICAgLy8gVE9ET1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgXCJpbnN0cnVtZW50IG5vdCBmb3VuZDogYmFuaz0lcyBpbnN0cnVtZW50PSVzIGtleT0lc1wiLFxyXG4gICAgICAgIGJhbmtOdW1iZXIsXHJcbiAgICAgICAgaW5zdHJ1bWVudE51bWJlcixcclxuICAgICAgICBrZXlcclxuICAgICAgKVxyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpbnN0cnVtZW50S2V5XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVJbnN0cnVtZW50KHsgaW5zdHJ1bWVudCwgaW5zdHJ1bWVudFpvbmUsIGluc3RydW1lbnRab25lR2VuZXJhdG9yLCBpbnN0cnVtZW50Wm9uZU1vZHVsYXRvciB9OiBcclxuICB7IGluc3RydW1lbnQ6IHsgaW5zdHJ1bWVudE5hbWU6IHN0cmluZywgaW5zdHJ1bWVudEJhZ0luZGV4OiBudW1iZXIgfVtdLCBcclxuICAgIGluc3RydW1lbnRab25lOiBJbnN0cnVtZW50Wm9uZVtdLCBcclxuICAgIGluc3RydW1lbnRab25lR2VuZXJhdG9yOiB7fVtdLCBcclxuICAgIGluc3RydW1lbnRab25lTW9kdWxhdG9yOiB7fVtdIFxyXG4gIH0pOiBcclxuICB7IG5hbWU6IHN0cmluZywgaW5mbzogeyBnZW5lcmF0b3I6IHsgc2FtcGxlSUQ6IG51bWJlciwga2V5UmFuZ2U6IHsgaGk6IG51bWJlciwgbG86IG51bWJlciB9IH0gfVtdIH1bXSB7XHJcbiAgY29uc3Qgem9uZSA9IGluc3RydW1lbnRab25lXHJcbiAgY29uc3Qgb3V0cHV0ID0gW11cclxuXHJcbiAgLy8gaW5zdHJ1bWVudCAtPiBpbnN0cnVtZW50IGJhZyAtPiBnZW5lcmF0b3IgLyBtb2R1bGF0b3JcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGluc3RydW1lbnQubGVuZ3RoOyArK2kpIHtcclxuICAgIGNvbnN0IGJhZ0luZGV4ID0gaW5zdHJ1bWVudFtpXS5pbnN0cnVtZW50QmFnSW5kZXhcclxuICAgIGNvbnN0IGJhZ0luZGV4RW5kID0gaW5zdHJ1bWVudFtpICsgMV0gPyBpbnN0cnVtZW50W2kgKyAxXS5pbnN0cnVtZW50QmFnSW5kZXggOiB6b25lLmxlbmd0aFxyXG4gICAgY29uc3Qgem9uZUluZm8gPSBbXVxyXG5cclxuICAgIC8vIGluc3RydW1lbnQgYmFnXHJcbiAgICBmb3IgKGxldCBqID0gYmFnSW5kZXg7IGogPCBiYWdJbmRleEVuZDsgKytqKSB7XHJcbiAgICAgIGNvbnN0IGluc3RydW1lbnRHZW5lcmF0b3IgPSBjcmVhdGVJbnN0cnVtZW50R2VuZXJhdG9yKHpvbmUsIGosIGluc3RydW1lbnRab25lR2VuZXJhdG9yKVxyXG4gICAgICBjb25zdCBpbnN0cnVtZW50TW9kdWxhdG9yID0gY3JlYXRlSW5zdHJ1bWVudE1vZHVsYXRvcih6b25lLCBqLCBpbnN0cnVtZW50Wm9uZU1vZHVsYXRvcilcclxuXHJcbiAgICAgIHpvbmVJbmZvLnB1c2goe1xyXG4gICAgICAgIGdlbmVyYXRvcjogaW5zdHJ1bWVudEdlbmVyYXRvci5nZW5lcmF0b3IsXHJcbiAgICAgICAgZ2VuZXJhdG9yU2VxdWVuY2U6IGluc3RydW1lbnRHZW5lcmF0b3IuZ2VuZXJhdG9ySW5mbyxcclxuICAgICAgICBtb2R1bGF0b3I6IGluc3RydW1lbnRNb2R1bGF0b3IubW9kdWxhdG9yLFxyXG4gICAgICAgIG1vZHVsYXRvclNlcXVlbmNlOiBpbnN0cnVtZW50TW9kdWxhdG9yLm1vZHVsYXRvckluZm9cclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXQucHVzaCh7XHJcbiAgICAgIG5hbWU6IGluc3RydW1lbnRbaV0uaW5zdHJ1bWVudE5hbWUsXHJcbiAgICAgIGluZm86IHpvbmVJbmZvXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dHB1dFxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQcmVzZXQoeyBwcmVzZXRIZWFkZXIsIHByZXNldFpvbmUsIHByZXNldFpvbmVHZW5lcmF0b3IsIHByZXNldFpvbmVNb2R1bGF0b3IgfSk6IHtcclxuICBpbmZvOiB7IHByZXNldEdlbmVyYXRvcjogeyBnZW5lcmF0b3I6IHsgaW5zdHJ1bWVudDogeyBhbW91bnQ6IG51bWJlciB9IH0gfSB9W10sIFxyXG4gIGhlYWRlcjogeyBiYW5rOiBudW1iZXIsIHByZXNldDogbnVtYmVyLCBwcmVzZXROYW1lOiBzdHJpbmcgfSBcclxufVtdIHtcclxuICAvLyBwcmVzZXQgLT4gcHJlc2V0IGJhZyAtPiBnZW5lcmF0b3IgLyBtb2R1bGF0b3JcclxuICByZXR1cm4gcHJlc2V0SGVhZGVyLm1hcCgocHJlc2V0LCBpKSA9PiB7XHJcbiAgICBjb25zdCBuZXh0UHJlc2V0ID0gcHJlc2V0SGVhZGVyW2kgKyAxXVxyXG4gICAgY29uc3QgYmFnSW5kZXggPSBwcmVzZXQucHJlc2V0QmFnSW5kZXhcclxuICAgIGNvbnN0IGJhZ0luZGV4RW5kID0gbmV4dFByZXNldCA/IG5leHRQcmVzZXQucHJlc2V0QmFnSW5kZXggOiBwcmVzZXRab25lLmxlbmd0aFxyXG4gICAgY29uc3Qgem9uZUluZm8gPSBbXVxyXG5cclxuICAgIC8vIHByZXNldCBiYWdcclxuICAgIGZvciAobGV0IGogPSBiYWdJbmRleCwgamwgPSBiYWdJbmRleEVuZDsgaiA8IGpsOyArK2opIHtcclxuICAgICAgem9uZUluZm8ucHVzaCh7XHJcbiAgICAgICAgcHJlc2V0R2VuZXJhdG9yOiBjcmVhdGVQcmVzZXRHZW5lcmF0b3IocHJlc2V0Wm9uZSwgaiwgcHJlc2V0Wm9uZUdlbmVyYXRvciksXHJcbiAgICAgICAgcHJlc2V0TW9kdWxhdG9yOiBjcmVhdGVQcmVzZXRNb2R1bGF0b3IocHJlc2V0Wm9uZSwgaiwgcHJlc2V0Wm9uZU1vZHVsYXRvcilcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpbmZvOiB6b25lSW5mbyxcclxuICAgICAgaGVhZGVyOiBwcmVzZXRcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVBbGxJbnN0cnVtZW50cyhwYXJzZXI6IFBhcnNlcik6IHt9W10ge1xyXG4gIGNvbnN0IHByZXNldHMgPSBjcmVhdGVQcmVzZXQocGFyc2VyKVxyXG4gIGNvbnN0IGluc3RydW1lbnRzID0gY3JlYXRlSW5zdHJ1bWVudChwYXJzZXIpXHJcbiAgY29uc3QgYmFua3M6IHt9W10gPSBbXVxyXG5cclxuICBmb3IgKGxldCBwcmVzZXQgb2YgcHJlc2V0cykge1xyXG4gICAgY29uc3QgYmFua051bWJlciA9IHByZXNldC5oZWFkZXIuYmFua1xyXG4gICAgY29uc3QgcHJlc2V0TnVtYmVyID0gcHJlc2V0LmhlYWRlci5wcmVzZXRcclxuXHJcbiAgICBjb25zdCBub3RlcyA9IHByZXNldC5pbmZvXHJcbiAgICAgIC5tYXAoaW5mbyA9PiBpbmZvLnByZXNldEdlbmVyYXRvci5nZW5lcmF0b3IpXHJcbiAgICAgIC5tYXAoZ2VuZXJhdG9yID0+IHtcclxuICAgICAgICBpZiAoZ2VuZXJhdG9yLmluc3RydW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaW5zdHJ1bWVudE51bWJlciA9IGdlbmVyYXRvci5pbnN0cnVtZW50LmFtb3VudFxyXG4gICAgICAgIGNvbnN0IGluc3RydW1lbnQgPSBpbnN0cnVtZW50c1tpbnN0cnVtZW50TnVtYmVyXVxyXG5cclxuICAgICAgICAvLyB1c2UgdGhlIGZpcnN0IGdlbmVyYXRvciBpbiB0aGUgem9uZSBhcyB0aGUgZGVmYXVsdCB2YWx1ZVxyXG4gICAgICAgIGxldCBiYXNlR2VuZXJhdG9yXHJcbiAgICAgICAgaWYgKGluc3RydW1lbnQuaW5mb1swXS5nZW5lcmF0b3IpIHtcclxuICAgICAgICAgIGNvbnN0IGdlbmVyYXRvciA9IGluc3RydW1lbnQuaW5mb1swXS5nZW5lcmF0b3JcclxuICAgICAgICAgIGlmIChnZW5lcmF0b3Iuc2FtcGxlSUQgPT09IHVuZGVmaW5lZCAmJiBnZW5lcmF0b3Iua2V5UmFuZ2UubG8gPT09IDAgJiYgZ2VuZXJhdG9yLmtleVJhbmdlLmhpID09PSAxMjcpIHtcclxuICAgICAgICAgICAgYmFzZUdlbmVyYXRvciA9IGdlbmVyYXRvclxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudC5pbmZvXHJcbiAgICAgICAgICAubWFwKGluZm8gPT4gY3JlYXRlTm90ZUluZm8ocGFyc2VyLCBpbmZvLmdlbmVyYXRvciwgYmFzZUdlbmVyYXRvcikpXHJcbiAgICAgICAgICAuZmlsdGVyKHggPT4geCkgLy8gcmVtb3ZlIG51bGxcclxuICAgICAgfSlcclxuICAgICAgLmZpbHRlcih4ID0+IHgpIC8vIHJlbW92ZSBudWxsXHJcbiAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSkgLy8gZmxhdHRlblxyXG5cclxuICAgIC8vIHNlbGVjdCBiYW5rXHJcbiAgICBpZiAoYmFua3NbYmFua051bWJlcl0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBiYW5rc1tiYW5rTnVtYmVyXSA9IFtdXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYmFuayA9IGJhbmtzW2JhbmtOdW1iZXJdXHJcbiAgICBiYW5rW3ByZXNldE51bWJlcl0gPSB7XHJcbiAgICAgIG5vdGVzLFxyXG4gICAgICBuYW1lOiBwcmVzZXQuaGVhZGVyLnByZXNldE5hbWVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBiYW5rc1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVOb3RlSW5mbyhwYXJzZXI6IFBhcnNlciwgdGFyZ2V0R2VuZXJhdG9yOiB7fSwgYmFzZUdlbmVyYXRvcjoge30pIHtcclxuICBjb25zdCBnZW5lcmF0b3IgPSB7IC4uLmJhc2VHZW5lcmF0b3IsIC4uLnRhcmdldEdlbmVyYXRvciB9XHJcblxyXG4gIGNvbnN0IHsga2V5UmFuZ2UsIHNhbXBsZUlELCB2ZWxSYW5nZSB9ID0gZ2VuZXJhdG9yIGFzIGFueVxyXG4gIGlmIChrZXlSYW5nZSA9PT0gdW5kZWZpbmVkIHx8IHNhbXBsZUlEID09PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiBudWxsXHJcbiAgfVxyXG5cclxuICBjb25zdCB2b2xBdHRhY2sgPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnYXR0YWNrVm9sRW52JywgLTEyMDAwKVxyXG4gIGNvbnN0IHZvbERlY2F5ID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2RlY2F5Vm9sRW52JywgLTEyMDAwKVxyXG4gIGNvbnN0IHZvbFN1c3RhaW4gPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnc3VzdGFpblZvbEVudicpXHJcbiAgY29uc3Qgdm9sUmVsZWFzZSA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdyZWxlYXNlVm9sRW52JywgLTEyMDAwKVxyXG4gIGNvbnN0IG1vZEF0dGFjayA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdhdHRhY2tNb2RFbnYnLCAtMTIwMDApXHJcbiAgY29uc3QgbW9kRGVjYXkgPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZGVjYXlNb2RFbnYnLCAtMTIwMDApXHJcbiAgY29uc3QgbW9kU3VzdGFpbiA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzdXN0YWluTW9kRW52JylcclxuICBjb25zdCBtb2RSZWxlYXNlID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3JlbGVhc2VNb2RFbnYnLCAtMTIwMDApXHJcblxyXG4gIGNvbnN0IHR1bmUgPSAoXHJcbiAgICBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnY29hcnNlVHVuZScpICtcclxuICAgIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdmaW5lVHVuZScpIC8gMTAwXHJcbiAgKVxyXG4gIGNvbnN0IHNjYWxlID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3NjYWxlVHVuaW5nJywgMTAwKSAvIDEwMFxyXG4gIGNvbnN0IGZyZXFWaWJMRk8gPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZnJlcVZpYkxGTycpXHJcbiAgY29uc3Qgc2FtcGxlSWQgPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnc2FtcGxlSUQnKVxyXG4gIGNvbnN0IHNhbXBsZUhlYWRlciA9IHBhcnNlci5zYW1wbGVIZWFkZXJbc2FtcGxlSWRdXHJcbiAgY29uc3QgYmFzZVBpdGNoID0gdHVuZSArIChzYW1wbGVIZWFkZXIucGl0Y2hDb3JyZWN0aW9uIC8gMTAwKSAtIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdvdmVycmlkaW5nUm9vdEtleScsIHNhbXBsZUhlYWRlci5vcmlnaW5hbFBpdGNoKVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2FtcGxlOiBwYXJzZXIuc2FtcGxlW3NhbXBsZUlkXSxcclxuICAgIHNhbXBsZVJhdGU6IHNhbXBsZUhlYWRlci5zYW1wbGVSYXRlLFxyXG4gICAgc2FtcGxlTmFtZTogc2FtcGxlSGVhZGVyLnNhbXBsZU5hbWUsXHJcbiAgICBtb2RFbnZUb1BpdGNoOiBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnbW9kRW52VG9QaXRjaCcpIC8gMTAwLFxyXG4gICAgc2NhbGVUdW5pbmc6IHNjYWxlLFxyXG4gICAgc3RhcnQ6XHJcbiAgICAgIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzdGFydEFkZHJzQ29hcnNlT2Zmc2V0JykgKiAzMjc2OCArXHJcbiAgICAgIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzdGFydEFkZHJzT2Zmc2V0JyksXHJcbiAgICBlbmQ6XHJcbiAgICAgIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdlbmRBZGRyc0NvYXJzZU9mZnNldCcpICogMzI3NjggK1xyXG4gICAgICBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZW5kQWRkcnNPZmZzZXQnKSxcclxuICAgIGxvb3BTdGFydDogKFxyXG4gICAgICAvLyhzYW1wbGVIZWFkZXIuc3RhcnRMb29wIC0gc2FtcGxlSGVhZGVyLnN0YXJ0KSArXHJcbiAgICAgIChzYW1wbGVIZWFkZXIuc3RhcnRMb29wKSArXHJcbiAgICAgIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldCcpICogMzI3NjggK1xyXG4gICAgICBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnc3RhcnRsb29wQWRkcnNPZmZzZXQnKVxyXG4gICAgKSxcclxuICAgIGxvb3BFbmQ6IChcclxuICAgICAgLy8oc2FtcGxlSGVhZGVyLmVuZExvb3AgLSBzYW1wbGVIZWFkZXIuc3RhcnQpICtcclxuICAgICAgKHNhbXBsZUhlYWRlci5lbmRMb29wKSArXHJcbiAgICAgIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnKSAqIDMyNzY4ICtcclxuICAgICAgZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2VuZGxvb3BBZGRyc09mZnNldCcpXHJcbiAgICApLFxyXG4gICAgdm9sQXR0YWNrOiBNYXRoLnBvdygyLCB2b2xBdHRhY2sgLyAxMjAwKSxcclxuICAgIHZvbERlY2F5OiBNYXRoLnBvdygyLCB2b2xEZWNheSAvIDEyMDApLFxyXG4gICAgdm9sU3VzdGFpbjogdm9sU3VzdGFpbiAvIDEwMDAsXHJcbiAgICB2b2xSZWxlYXNlOiBNYXRoLnBvdygyLCB2b2xSZWxlYXNlIC8gMTIwMCksXHJcbiAgICBtb2RBdHRhY2s6IE1hdGgucG93KDIsIG1vZEF0dGFjayAvIDEyMDApLFxyXG4gICAgbW9kRGVjYXk6IE1hdGgucG93KDIsIG1vZERlY2F5IC8gMTIwMCksXHJcbiAgICBtb2RTdXN0YWluOiBtb2RTdXN0YWluIC8gMTAwMCxcclxuICAgIG1vZFJlbGVhc2U6IE1hdGgucG93KDIsIG1vZFJlbGVhc2UgLyAxMjAwKSxcclxuICAgIGluaXRpYWxGaWx0ZXJGYzogZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2luaXRpYWxGaWx0ZXJGYycsIDEzNTAwKSxcclxuICAgIG1vZEVudlRvRmlsdGVyRmM6IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdtb2RFbnZUb0ZpbHRlckZjJyksXHJcbiAgICBpbml0aWFsRmlsdGVyUTogZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2luaXRpYWxGaWx0ZXJRJywgMSksXHJcbiAgICBmcmVxVmliTEZPOiBmcmVxVmliTEZPID8gTWF0aC5wb3coMiwgZnJlcVZpYkxGTyAvIDEyMDApICogOC4xNzYgOiB1bmRlZmluZWQsXHJcbiAgICBwbGF5YmFja1JhdGU6IChrZXkpID0+IE1hdGgucG93KE1hdGgucG93KDIsIDEgLyAxMiksIChrZXkgKyBiYXNlUGl0Y2gpICogc2NhbGUpLFxyXG4gICAga2V5UmFuZ2UsXHJcbiAgICB2ZWxSYW5nZVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvcjoge30sIGVudW1lcmF0b3JUeXBlOiBzdHJpbmcsIG9wdF9kZWZhdWx0OiBudW1iZXIgPSAwKTogbnVtYmVyIHtcclxuICByZXR1cm4gZ2VuZXJhdG9yW2VudW1lcmF0b3JUeXBlXSA/IGdlbmVyYXRvcltlbnVtZXJhdG9yVHlwZV0uYW1vdW50IDogb3B0X2RlZmF1bHRcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQmFnTW9kR2VuKHpvbmU6IHt9W10sIGluZGV4U3RhcnQ6IG51bWJlciwgaW5kZXhFbmQ6IG51bWJlciwgem9uZU1vZEdlbjoge30pOiB7bW9kZ2VuOiB7fSwgbW9kZ2VuSW5mbzoge31bXX0gIHtcclxuICBjb25zdCBtb2RnZW5JbmZvID0gW11cclxuICBjb25zdCBtb2RnZW4gPSB7XHJcbiAgICB1bmtub3duOiBbXSxcclxuICAgICdrZXlSYW5nZSc6IHtcclxuICAgICAgaGk6IDEyNyxcclxuICAgICAgbG86IDBcclxuICAgIH1cclxuICB9OyAvLyBUT0RPXHJcblxyXG4gIGZvciAobGV0IGkgPSBpbmRleFN0YXJ0OyBpIDwgaW5kZXhFbmQ7ICsraSkge1xyXG4gICAgY29uc3QgaW5mbyA9IHpvbmVNb2RHZW5baV1cclxuICAgIG1vZGdlbkluZm8ucHVzaChpbmZvKVxyXG5cclxuICAgIGlmIChpbmZvLnR5cGUgPT09ICd1bmtub3duJykge1xyXG4gICAgICBtb2RnZW4udW5rbm93bi5wdXNoKGluZm8udmFsdWUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtb2RnZW5baW5mby50eXBlXSA9IGluZm8udmFsdWVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IG1vZGdlbiwgbW9kZ2VuSW5mbyB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRHZW5lcmF0b3Ioem9uZToge2luc3RydW1lbnRHZW5lcmF0b3JJbmRleDogbnVtYmVyfVtdLCBpbmRleDogbnVtYmVyLCBpbnN0cnVtZW50Wm9uZUdlbmVyYXRvcjoge31bXSkge1xyXG4gIGNvbnN0IG1vZGdlbiA9IGNyZWF0ZUJhZ01vZEdlbihcclxuICAgIHpvbmUsXHJcbiAgICB6b25lW2luZGV4XS5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXgsXHJcbiAgICB6b25lW2luZGV4ICsgMV0gPyB6b25lW2luZGV4ICsgMV0uaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4IDogaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3IubGVuZ3RoLFxyXG4gICAgaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3JcclxuICApXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZW5lcmF0b3I6IG1vZGdlbi5tb2RnZW4sXHJcbiAgICBnZW5lcmF0b3JJbmZvOiBtb2RnZW4ubW9kZ2VuSW5mb1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlSW5zdHJ1bWVudE1vZHVsYXRvcih6b25lOiB7aW5zdHJ1bWVudE1vZHVsYXRvckluZGV4OiBudW1iZXIsIHByZXNldE1vZHVsYXRvckluZGV4OiBudW1iZXJ9W10sIGluZGV4OiBudW1iZXIsIGluc3RydW1lbnRab25lTW9kdWxhdG9yOiB7fVtdKSB7XHJcbiAgY29uc3QgbW9kZ2VuID0gY3JlYXRlQmFnTW9kR2VuKFxyXG4gICAgem9uZSxcclxuICAgIHpvbmVbaW5kZXhdLnByZXNldE1vZHVsYXRvckluZGV4LFxyXG4gICAgem9uZVtpbmRleCArIDFdID8gem9uZVtpbmRleCArIDFdLmluc3RydW1lbnRNb2R1bGF0b3JJbmRleCA6IGluc3RydW1lbnRab25lTW9kdWxhdG9yLmxlbmd0aCxcclxuICAgIGluc3RydW1lbnRab25lTW9kdWxhdG9yXHJcbiAgKVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbW9kdWxhdG9yOiBtb2RnZW4ubW9kZ2VuLFxyXG4gICAgbW9kdWxhdG9ySW5mbzogbW9kZ2VuLm1vZGdlbkluZm9cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVByZXNldEdlbmVyYXRvcih6b25lOiB7cHJlc2V0R2VuZXJhdG9ySW5kZXg6IG51bWJlcn1bXSwgaW5kZXg6IG51bWJlciwgcHJlc2V0Wm9uZUdlbmVyYXRvcjoge31bXSk6IHtnZW5lcmF0b3I6IE9iamVjdCwgZ2VuZXJhdG9ySW5mbzogT2JqZWN0W119IHtcclxuICBjb25zdCBtb2RnZW4gPSBjcmVhdGVCYWdNb2RHZW4oXHJcbiAgICB6b25lLFxyXG4gICAgem9uZVtpbmRleF0ucHJlc2V0R2VuZXJhdG9ySW5kZXgsXHJcbiAgICB6b25lW2luZGV4ICsgMV0gPyB6b25lW2luZGV4ICsgMV0ucHJlc2V0R2VuZXJhdG9ySW5kZXggOiBwcmVzZXRab25lR2VuZXJhdG9yLmxlbmd0aCxcclxuICAgIHByZXNldFpvbmVHZW5lcmF0b3JcclxuICApXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZW5lcmF0b3I6IG1vZGdlbi5tb2RnZW4sXHJcbiAgICBnZW5lcmF0b3JJbmZvOiBtb2RnZW4ubW9kZ2VuSW5mb1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUHJlc2V0TW9kdWxhdG9yKHpvbmU6IHtwcmVzZXRNb2R1bGF0b3JJbmRleDogbnVtYmVyfVtdLCBpbmRleDogbnVtYmVyLCBwcmVzZXRab25lTW9kdWxhdG9yOiB7fVtdKSB7XHJcbiAgY29uc3QgbW9kZ2VuID0gY3JlYXRlQmFnTW9kR2VuKFxyXG4gICAgem9uZSxcclxuICAgIHpvbmVbaW5kZXhdLnByZXNldE1vZHVsYXRvckluZGV4LFxyXG4gICAgem9uZVtpbmRleCArIDFdID8gem9uZVtpbmRleCArIDFdLnByZXNldE1vZHVsYXRvckluZGV4IDogcHJlc2V0Wm9uZU1vZHVsYXRvci5sZW5ndGgsXHJcbiAgICBwcmVzZXRab25lTW9kdWxhdG9yXHJcbiAgKVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbW9kdWxhdG9yOiBtb2RnZW4ubW9kZ2VuLFxyXG4gICAgbW9kdWxhdG9ySW5mbzogbW9kZ2VuLm1vZGdlbkluZm9cclxuICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc291bmRfZm9udC50cyIsImltcG9ydCBTeW50aGVzaXplciBmcm9tIFwiLi9zb3VuZF9mb250X3N5bnRoLnRzXCJcclxuaW1wb3J0IFByb2dyYW1OYW1lcyBmcm9tIFwiLi9wcm9ncmFtX25hbWVzLnRzXCJcclxuaW1wb3J0IHsgRE9NRWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyKHN0cikge1xyXG4gIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIHdyYXBwZXIuaW5uZXJIVE1MID0gc3RyLnJlcGxhY2UoL15cXHMrLywgXCJcIik7XHJcbiAgcmV0dXJuIHdyYXBwZXIuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcktleXMoKSB7XHJcbiAgbGV0IGh0bWwgPSBcIlwiO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTI4OyBpKyspIHtcclxuICAgIGNvbnN0IG4gPSBpICUgMTI7XHJcbiAgICBjb25zdCBpc0JsYWNrID0gWzEsIDMsIDYsIDgsIDEwXS5pbmNsdWRlcyhuKTtcclxuICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9XCJrZXkgJHtpc0JsYWNrID8gXCJibGFja1wiIDogXCJ3aGl0ZVwifVwiPjwvZGl2PmA7XHJcbiAgfVxyXG4gIHJldHVybiBodG1sXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlclByb2dyYW1PcHRpb25zKHByb2dyYW1OYW1lcywgYmFuaykge1xyXG4gIGxldCBodG1sID0gXCJcIlxyXG4gIGNvbnN0IG5hbWVzID0gcHJvZ3JhbU5hbWVzW2JhbmtdXHJcbiAgZm9yIChsZXQgaSBpbiBuYW1lcykge1xyXG4gICAgY29uc3QgbmFtZSA9IG5hbWVzW2ldXHJcbiAgICBodG1sICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtpfVwiPiR7aX06ICR7bmFtZX08L29wdGlvbj5gXHJcbiAgfVxyXG4gIHJldHVybiBgPHNlbGVjdD4ke2h0bWx9PC9zZWxlY3Q+YDtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVySW5zdHJ1bWVudChwcm9ncmFtKSB7XHJcbiAgcmV0dXJuIHJlbmRlcihgXHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5zdHJ1bWVudFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicHJvZ3JhbVwiPiR7cHJvZ3JhbX08L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInZvbHVtZVwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGFucG90XCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwaXRjaEJlbmRcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBpdGNoQmVuZFNlbnNpdGl2aXR5XCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJrZXlzXCI+JHtyZW5kZXJLZXlzKCl9PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICBgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9ncmFtTmFtZXNGcm9tQmFua1NldChiYW5rU2V0KSB7XHJcbiAgcmV0dXJuIGJhbmtTZXQubWFwKGJhbmsgPT4gYmFuay5tYXAocyA9PiBzLm5hbWUpKVxyXG59XHJcblxyXG5mdW5jdGlvbiBtZXJnZVByb2dyYW1OYW1lcyhsZWZ0OiB7W2luZGV4OiBudW1iZXJdOiBzdHJpbmdbXX0sIHJpZ2h0OiB7W2luZGV4OiBudW1iZXJdOiBzdHJpbmdbXX0pIHtcclxuICBmdW5jdGlvbiBtZXJnZWRLZXlzKGEsIGIpIHtcclxuICAgIHJldHVybiBuZXcgU2V0KFsuLi5PYmplY3Qua2V5cyhhKSwgLi4uT2JqZWN0LmtleXMoYildKVxyXG4gIH1cclxuICBjb25zdCBiYW5rcyA9IG1lcmdlZEtleXMobGVmdCwgcmlnaHQpXHJcbiAgY29uc3QgcmVzdWx0ID0ge31cclxuICBiYW5rcy5mb3JFYWNoKGJhbmsgPT4ge1xyXG4gICAgY29uc3QgbCA9IGxlZnRbYmFua10gfHwgW11cclxuICAgIGNvbnN0IHIgPSByaWdodFtiYW5rXSB8fCBbXVxyXG4gICAgY29uc3QgbGlzdDogeyBbaW5kZXg6IG51bWJlcl06IHN0cmluZ30gPSB7fVxyXG4gICAgY29uc3QgcHJvZ3JhbXMgPSBtZXJnZWRLZXlzKGwsIHIpXHJcbiAgICBwcm9ncmFtcy5mb3JFYWNoKHAgPT4ge1xyXG4gICAgICBsaXN0W3BdID0gYCR7bFtwXSB8fCBcIk5vbmVcIn0gKCR7cltwXSB8fCBcIk5vbmVcIn0pYFxyXG4gICAgfSlcclxuICAgIHJlc3VsdFtiYW5rXSA9IGxpc3RcclxuICB9KVxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XHJcbiAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50XHJcbiAgcHJpdmF0ZSBkcmFnOiBib29sZWFuID0gZmFsc2VcclxuXHJcbiAgZHJhdyhzeW50aDogU3ludGhlc2l6ZXIpOiBFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQgPSByZW5kZXIoYDxkaXYgLz5gKTtcclxuICAgIGNvbnN0IHByb2dyYW1OYW1lcyA9IG1lcmdlUHJvZ3JhbU5hbWVzKHByb2dyYW1OYW1lc0Zyb21CYW5rU2V0KHN5bnRoLnNvdW5kRm9udC5iYW5rU2V0KSwgUHJvZ3JhbU5hbWVzKVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xyXG4gICAgICBjb25zdCBiYW5rID0gaSAhPT0gOSA/IDAgOiAxMjhcclxuICAgICAgY29uc3QgcHJvZ3JhbSA9IHJlbmRlclByb2dyYW1PcHRpb25zKHByb2dyYW1OYW1lcywgYmFuaylcclxuICAgICAgY29uc3QgaXRlbSA9IHJlbmRlckluc3RydW1lbnQocHJvZ3JhbSlcclxuXHJcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBpO1xyXG4gICAgICBjb25zdCBzZWxlY3QgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpO1xyXG4gICAgICBpZiAoc2VsZWN0KSB7XHJcbiAgICAgICAgc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGV2ZW50ID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudFxyXG4gICAgICAgICAgc3ludGgucHJvZ3JhbUNoYW5nZShjaGFubmVsLCBwYXJzZUludCh0YXJnZXQudmFsdWUsIDEwKSk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIHNlbGVjdC5zZWxlY3RlZEluZGV4ID0gc3ludGguY2hhbm5lbHNbaV0uaW5zdHJ1bWVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgbm90ZXMgPSBpdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoXCIua2V5XCIpO1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEyODsgKytqKSB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0gajtcclxuXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIHRoaXMuZHJhZyA9IHRydWU7XHJcbiAgICAgICAgICBzeW50aC5ub3RlT24oY2hhbm5lbCwga2V5LCAxMjcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGV2ZW50ID0+IHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5kcmFnKSB7XHJcbiAgICAgICAgICAgIHN5bnRoLm5vdGVPbihjaGFubmVsLCBrZXksIDEyNyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgc3ludGgubm90ZU9mZihjaGFubmVsLCBrZXksIDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgdGhpcy5kcmFnID0gZmFsc2U7XHJcbiAgICAgICAgICBzeW50aC5ub3RlT2ZmKGNoYW5uZWwsIGtleSwgMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoaXRlbSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZWxlbWVudDtcclxuICB9XHJcblxyXG4gIHJlbW92ZSgpIHtcclxuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICB9XHJcblxyXG4gIGdldEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwpIHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pbnN0cnVtZW50XCIpW2NoYW5uZWxdXHJcbiAgfVxyXG5cclxuICBnZXRLZXlFbGVtZW50KGNoYW5uZWwsIGtleSkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0SW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCkucXVlcnlTZWxlY3RvckFsbChcIi5rZXlcIilba2V5XVxyXG4gIH1cclxuXHJcbiAgbm90ZU9uKGNoYW5uZWwsIGtleSkge1xyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0S2V5RWxlbWVudChjaGFubmVsLCBrZXkpLmNsYXNzTGlzdC5hZGQoJ25vdGUtb24nKTtcclxuICB9XHJcblxyXG4gIG5vdGVPZmYoY2hhbm5lbCwga2V5KSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRLZXlFbGVtZW50KGNoYW5uZWwsIGtleSkuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZS1vbicpO1xyXG4gIH1cclxuXHJcbiAgcHJvZ3JhbUNoYW5nZShjaGFubmVsLCBpbnN0cnVtZW50KSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IHRoaXMuZ2V0SW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCkucXVlcnlTZWxlY3RvcihcIi5wcm9ncmFtIHNlbGVjdFwiKVxyXG5cclxuICAgIGlmIChzZWxlY3QpIHtcclxuICAgICAgc2VsZWN0LnZhbHVlID0gaW5zdHJ1bWVudDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZvbHVtZUNoYW5nZShjaGFubmVsLCB2b2x1bWUpIHtcclxuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdldEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwpLnF1ZXJ5U2VsZWN0b3IoXCIudm9sdW1lXCIpLnRleHRDb250ZW50ID0gdm9sdW1lO1xyXG4gIH1cclxuXHJcbiAgcGFucG90Q2hhbmdlKGNoYW5uZWwsIHBhbnBvdCkge1xyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0SW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCkucXVlcnlTZWxlY3RvcihcIi5wYW5wb3RcIikudGV4dENvbnRlbnQgPSBwYW5wb3Q7XHJcbiAgfVxyXG5cclxuICBwaXRjaEJlbmQoY2hhbm5lbCwgY2FsY3VsYXRlZFBpdGNoKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsKS5xdWVyeVNlbGVjdG9yKFwiLnBpdGNoQmVuZFwiKS50ZXh0Q29udGVudCA9IGNhbGN1bGF0ZWRQaXRjaDtcclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWwsIHNlbnNpdGl2aXR5KSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsKS5xdWVyeVNlbGVjdG9yKFwiLnBpdGNoQmVuZFNlbnNpdGl2aXR5XCIpLnRleHRDb250ZW50ID0gc2Vuc2l0aXZpdHk7XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zeW50aF92aWV3LnRzIiwiY29uc3QgUHJvZ3JhbU5hbWVzOiB7IFtpbmRleDogbnVtYmVyXTogc3RyaW5nW10gfSA9IHtcclxuICAwOiBbXHJcbiAgICBcIkFjb3VzdGljIFBpYW5vXCIsXHJcbiAgICBcIkJyaWdodCBQaWFub1wiLFxyXG4gICAgXCJFbGVjdHJpYyBHcmFuZCBQaWFub1wiLFxyXG4gICAgXCJIb25reS10b25rIFBpYW5vXCIsXHJcbiAgICBcIkVsZWN0cmljIFBpYW5vXCIsXHJcbiAgICBcIkVsZWN0cmljIFBpYW5vIDJcIixcclxuICAgIFwiSGFycHNpY2hvcmRcIixcclxuICAgIFwiQ2xhdmlcIixcclxuICAgIFwiQ2VsZXN0YVwiLFxyXG4gICAgXCJHbG9ja2Vuc3BpZWxcIixcclxuICAgIFwiTXVzaWNhbCBib3hcIixcclxuICAgIFwiVmlicmFwaG9uZVwiLFxyXG4gICAgXCJNYXJpbWJhXCIsXHJcbiAgICBcIlh5bG9waG9uZVwiLFxyXG4gICAgXCJUdWJ1bGFyIEJlbGxcIixcclxuICAgIFwiRHVsY2ltZXJcIixcclxuICAgIFwiRHJhd2JhciBPcmdhblwiLFxyXG4gICAgXCJQZXJjdXNzaXZlIE9yZ2FuXCIsXHJcbiAgICBcIlJvY2sgT3JnYW5cIixcclxuICAgIFwiQ2h1cmNoIG9yZ2FuXCIsXHJcbiAgICBcIlJlZWQgb3JnYW5cIixcclxuICAgIFwiQWNjb3JkaW9uXCIsXHJcbiAgICBcIkhhcm1vbmljYVwiLFxyXG4gICAgXCJUYW5nbyBBY2NvcmRpb25cIixcclxuICAgIFwiQWNvdXN0aWMgR3VpdGFyIChueWxvbilcIixcclxuICAgIFwiQWNvdXN0aWMgR3VpdGFyIChzdGVlbClcIixcclxuICAgIFwiRWxlY3RyaWMgR3VpdGFyIChqYXp6KVwiLFxyXG4gICAgXCJFbGVjdHJpYyBHdWl0YXIgKGNsZWFuKVwiLFxyXG4gICAgXCJFbGVjdHJpYyBHdWl0YXIgKG11dGVkKVwiLFxyXG4gICAgXCJPdmVyZHJpdmVuIEd1aXRhclwiLFxyXG4gICAgXCJEaXN0b3J0aW9uIEd1aXRhclwiLFxyXG4gICAgXCJHdWl0YXIgaGFybW9uaWNzXCIsXHJcbiAgICBcIkFjb3VzdGljIEJhc3NcIixcclxuICAgIFwiRWxlY3RyaWMgQmFzcyAoZmluZ2VyKVwiLFxyXG4gICAgXCJFbGVjdHJpYyBCYXNzIChwaWNrKVwiLFxyXG4gICAgXCJGcmV0bGVzcyBCYXNzXCIsXHJcbiAgICBcIlNsYXAgQmFzcyAxXCIsXHJcbiAgICBcIlNsYXAgQmFzcyAyXCIsXHJcbiAgICBcIlN5bnRoIEJhc3MgMVwiLFxyXG4gICAgXCJTeW50aCBCYXNzIDJcIixcclxuICAgIFwiVmlvbGluXCIsXHJcbiAgICBcIlZpb2xhXCIsXHJcbiAgICBcIkNlbGxvXCIsXHJcbiAgICBcIkRvdWJsZSBiYXNzXCIsXHJcbiAgICBcIlRyZW1vbG8gU3RyaW5nc1wiLFxyXG4gICAgXCJQaXp6aWNhdG8gU3RyaW5nc1wiLFxyXG4gICAgXCJPcmNoZXN0cmFsIEhhcnBcIixcclxuICAgIFwiVGltcGFuaVwiLFxyXG4gICAgXCJTdHJpbmcgRW5zZW1ibGUgMVwiLFxyXG4gICAgXCJTdHJpbmcgRW5zZW1ibGUgMlwiLFxyXG4gICAgXCJTeW50aCBTdHJpbmdzIDFcIixcclxuICAgIFwiU3ludGggU3RyaW5ncyAyXCIsXHJcbiAgICBcIlZvaWNlIEFhaHNcIixcclxuICAgIFwiVm9pY2UgT29oc1wiLFxyXG4gICAgXCJTeW50aCBWb2ljZVwiLFxyXG4gICAgXCJPcmNoZXN0cmEgSGl0XCIsXHJcbiAgICBcIlRydW1wZXRcIixcclxuICAgIFwiVHJvbWJvbmVcIixcclxuICAgIFwiVHViYVwiLFxyXG4gICAgXCJNdXRlZCBUcnVtcGV0XCIsXHJcbiAgICBcIkZyZW5jaCBob3JuXCIsXHJcbiAgICBcIkJyYXNzIFNlY3Rpb25cIixcclxuICAgIFwiU3ludGggQnJhc3MgMVwiLFxyXG4gICAgXCJTeW50aCBCcmFzcyAyXCIsXHJcbiAgICBcIlNvcHJhbm8gU2F4XCIsXHJcbiAgICBcIkFsdG8gU2F4XCIsXHJcbiAgICBcIlRlbm9yIFNheFwiLFxyXG4gICAgXCJCYXJpdG9uZSBTYXhcIixcclxuICAgIFwiT2JvZVwiLFxyXG4gICAgXCJFbmdsaXNoIEhvcm5cIixcclxuICAgIFwiQmFzc29vblwiLFxyXG4gICAgXCJDbGFyaW5ldFwiLFxyXG4gICAgXCJQaWNjb2xvXCIsXHJcbiAgICBcIkZsdXRlXCIsXHJcbiAgICBcIlJlY29yZGVyXCIsXHJcbiAgICBcIlBhbiBGbHV0ZVwiLFxyXG4gICAgXCJCbG93biBCb3R0bGVcIixcclxuICAgIFwiU2hha3VoYWNoaVwiLFxyXG4gICAgXCJXaGlzdGxlXCIsXHJcbiAgICBcIk9jYXJpbmFcIixcclxuICAgIFwiTGVhZCAxIChzcXVhcmUpXCIsXHJcbiAgICBcIkxlYWQgMiAoc2F3dG9vdGgpXCIsXHJcbiAgICBcIkxlYWQgMyAoY2FsbGlvcGUpXCIsXHJcbiAgICBcIkxlYWQgNCAoY2hpZmYpXCIsXHJcbiAgICBcIkxlYWQgNSAoY2hhcmFuZylcIixcclxuICAgIFwiTGVhZCA2ICh2b2ljZSlcIixcclxuICAgIFwiTGVhZCA3IChmaWZ0aHMpXCIsXHJcbiAgICBcIkxlYWQgOCAoYmFzcyArIGxlYWQpXCIsXHJcbiAgICBcIlBhZCAxIChGYW50YXNpYSlcIixcclxuICAgIFwiUGFkIDIgKHdhcm0pXCIsXHJcbiAgICBcIlBhZCAzIChwb2x5c3ludGgpXCIsXHJcbiAgICBcIlBhZCA0IChjaG9pcilcIixcclxuICAgIFwiUGFkIDUgKGJvd2VkKVwiLFxyXG4gICAgXCJQYWQgNiAobWV0YWxsaWMpXCIsXHJcbiAgICBcIlBhZCA3IChoYWxvKVwiLFxyXG4gICAgXCJQYWQgOCAoc3dlZXApXCIsXHJcbiAgICBcIkZYIDEgKHJhaW4pXCIsXHJcbiAgICBcIkZYIDIgKHNvdW5kdHJhY2spXCIsXHJcbiAgICBcIkZYIDMgKGNyeXN0YWwpXCIsXHJcbiAgICBcIkZYIDQgKGF0bW9zcGhlcmUpXCIsXHJcbiAgICBcIkZYIDUgKGJyaWdodG5lc3MpXCIsXHJcbiAgICBcIkZYIDYgKGdvYmxpbnMpXCIsXHJcbiAgICBcIkZYIDcgKGVjaG9lcylcIixcclxuICAgIFwiRlggOCAoc2NpLWZpKVwiLFxyXG4gICAgXCJTaXRhclwiLFxyXG4gICAgXCJCYW5qb1wiLFxyXG4gICAgXCJTaGFtaXNlblwiLFxyXG4gICAgXCJLb3RvXCIsXHJcbiAgICBcIkthbGltYmFcIixcclxuICAgIFwiQmFncGlwZVwiLFxyXG4gICAgXCJGaWRkbGVcIixcclxuICAgIFwiU2hhbmFpXCIsXHJcbiAgICBcIlRpbmtsZSBCZWxsXCIsXHJcbiAgICBcIkFnb2dvXCIsXHJcbiAgICBcIlN0ZWVsIERydW1zXCIsXHJcbiAgICBcIldvb2RibG9ja1wiLFxyXG4gICAgXCJUYWlrbyBEcnVtXCIsXHJcbiAgICBcIk1lbG9kaWMgVG9tXCIsXHJcbiAgICBcIlN5bnRoIERydW1cIixcclxuICAgIFwiUmV2ZXJzZSBDeW1iYWxcIixcclxuICAgIFwiR3VpdGFyIEZyZXQgTm9pc2VcIixcclxuICAgIFwiQnJlYXRoIE5vaXNlXCIsXHJcbiAgICBcIlNlYXNob3JlXCIsXHJcbiAgICBcIkJpcmQgVHdlZXRcIixcclxuICAgIFwiVGVsZXBob25lIFJpbmdcIixcclxuICAgIFwiSGVsaWNvcHRlclwiLFxyXG4gICAgXCJBcHBsYXVzZVwiLFxyXG4gICAgXCJHdW5zaG90XCJcclxuICBdLCAxMjg6IFtcIlJoeXRobSBUcmFja1wiXVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9ncmFtTmFtZXNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvZ3JhbV9uYW1lcy50cyIsImltcG9ydCBTeW50aGVzaXplciBmcm9tIFwiLi9zb3VuZF9mb250X3N5bnRoXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pZGlNZXNzYWdlSGFuZGxlciB7XHJcbiAgcHJpdmF0ZSBScG5Nc2IgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cclxuICBwcml2YXRlIFJwbkxzYiA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXVxyXG4gIHN5bnRoOiBTeW50aGVzaXplclxyXG5cclxuICBwcm9jZXNzTWlkaU1lc3NhZ2UobWVzc2FnZTogbnVtYmVyW10pIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBtZXNzYWdlWzBdICYgMHgwZlxyXG4gICAgY29uc3QgeyBzeW50aCB9ID0gdGhpc1xyXG5cclxuICAgIGlmICghc3ludGgpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChtZXNzYWdlWzBdICYgMHhmMCkge1xyXG4gICAgICBjYXNlIDB4ODA6IC8vIE5vdGVPZmY6IDhuIGtrIHZ2XHJcbiAgICAgICAgc3ludGgubm90ZU9mZihjaGFubmVsLCBtZXNzYWdlWzFdLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMHg5MDogLy8gTm90ZU9uOiA5biBrayB2dlxyXG4gICAgICAgIGlmIChtZXNzYWdlWzJdID4gMCkge1xyXG4gICAgICAgICAgc3ludGgubm90ZU9uKGNoYW5uZWwsIG1lc3NhZ2VbMV0sIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN5bnRoLm5vdGVPZmYoY2hhbm5lbCwgbWVzc2FnZVsxXSwgMClcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAweEIwOiAvLyBDb250cm9sIENoYW5nZTogQm4gY2MgZGRcclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbMV0pIHtcclxuICAgICAgICAgIGNhc2UgMHgwNjogLy8gRGF0YSBFbnRyeTogQm4gMDYgZGRcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLlJwbk1zYltjaGFubmVsXSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5ScG5Mc2JbY2hhbm5lbF0pIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAwOiAvLyBQaXRjaCBCZW5kIFNlbnNpdGl2aXR5XHJcbiAgICAgICAgICAgICAgICAgICAgc3ludGgucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbCwgbWVzc2FnZVsyXSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHgwNzogLy8gVm9sdW1lIENoYW5nZTogQm4gMDcgZGRcclxuICAgICAgICAgICAgc3ludGgudm9sdW1lQ2hhbmdlKGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4MEE6IC8vIFBhbnBvdCBDaGFuZ2U6IEJuIDBBIGRkXHJcbiAgICAgICAgICAgIHN5bnRoLnBhbnBvdENoYW5nZShjaGFubmVsLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDc4OiAvLyBBbGwgU291bmQgT2ZmOiBCbiA3OCAwMFxyXG4gICAgICAgICAgICBzeW50aC5hbGxTb3VuZE9mZihjaGFubmVsKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDc5OiAvLyBSZXNldCBBbGwgQ29udHJvbDogQm4gNzkgMDBcclxuICAgICAgICAgICAgc3ludGgucmVzZXRBbGxDb250cm9sKGNoYW5uZWwpXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4MjA6IC8vIEJhbmtTZWxlY3RcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImJhbmtzZWxlY3Q6XCIsIGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4NjQ6IC8vIFJQTiBNU0JcclxuICAgICAgICAgICAgdGhpcy5ScG5Nc2JbY2hhbm5lbF0gPSBtZXNzYWdlWzJdXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4NjU6IC8vIFJQTiBMU0JcclxuICAgICAgICAgICAgdGhpcy5ScG5Mc2JbY2hhbm5lbF0gPSBtZXNzYWdlWzJdXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgLy8gbm90IHN1cHBvcnRlZFxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4QzA6IC8vIFByb2dyYW0gQ2hhbmdlOiBDbiBwcFxyXG4gICAgICAgIHN5bnRoLnByb2dyYW1DaGFuZ2UoY2hhbm5lbCwgbWVzc2FnZVsxXSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4RTA6IC8vIFBpdGNoIEJlbmRcclxuICAgICAgICBzeW50aC5waXRjaEJlbmQoY2hhbm5lbCwgbWVzc2FnZVsxXSwgbWVzc2FnZVsyXSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4ZjA6IC8vIFN5c3RlbSBFeGNsdXNpdmUgTWVzc2FnZVxyXG4gICAgICAgIC8vIElEIG51bWJlclxyXG4gICAgICAgIHN3aXRjaCAobWVzc2FnZVsxXSkge1xyXG4gICAgICAgICAgY2FzZSAweDdlOiAvLyBub24tcmVhbHRpbWVcclxuICAgICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDdmOiAvLyByZWFsdGltZVxyXG4gICAgICAgICAgICAvLyBjb25zdCBkZXZpY2UgPSBtZXNzYWdlWzJdXHJcbiAgICAgICAgICAgIC8vIHN1YiBJRCAxXHJcbiAgICAgICAgICAgIHN3aXRjaCAobWVzc2FnZVszXSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgMHgwNDogLy8gZGV2aWNlIGNvbnRyb2xcclxuICAgICAgICAgICAgICAgIC8vIHN1YiBJRCAyXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbNF0pIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAweDAxOiB7IC8vIG1hc3RlciB2b2x1bWVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2b2x1bWUgPSBtZXNzYWdlWzVdICsgKG1lc3NhZ2VbNl0gPDwgNylcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBNQVhfVk9MVU1FID0gMHg0MDAwIC0gMVxyXG4gICAgICAgICAgICAgICAgICAgIHN5bnRoLnNldE1hc3RlclZvbHVtZSh2b2x1bWUgLyBNQVhfVk9MVU1FKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDogLy8gbm90IHN1cHBvcnRlZFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9taWRpX21lc3NhZ2VfaGFuZGxlci50cyJdLCJzb3VyY2VSb290IjoiIn0=