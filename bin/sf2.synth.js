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
/* 6 */,
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_WebMidiLink_ts__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_WebMidiLink_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__src_WebMidiLink_ts__);

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__src_WebMidiLink_ts___default.a);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Synthesizer_1 = __webpack_require__(9);
var View_1 = __webpack_require__(12);
var MidiMessageHandler_1 = __webpack_require__(14);
/**
 * @constructor
 */
var WebMidiLink = function () {
    /** @type {function(ArrayBuffer)} */
    this.loadCallback;
    /** @type {Function} */
    this.messageHandler = this.onmessage.bind(this);
    this.midiMessageHandler = new MidiMessageHandler_1["default"]();
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
        synth = this.synth = new Synthesizer_1["default"](input);
        var view = this.view = new View_1["default"]();
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
var SynthesizerNote_1 = __webpack_require__(10);
var Parser_1 = __webpack_require__(2);
var SoundFont_1 = __webpack_require__(11);
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
        var parser = Parser_1["default"](input);
        this.soundFont = new SoundFont_1["default"](parser);
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
        var noteInfo = this.soundFont.getInstrumentKey(bankNumber, channel.instrument, key, velocity);
        if (!noteInfo) {
            return;
        }
        var panpot = channel.panpot - 64;
        panpot /= panpot < 0 ? 64 : 63;
        // create note information
        var instrumentKey = {
            channel: channelNumber,
            key: key,
            velocity: velocity,
            panpot: panpot,
            volume: channel.volume / 127,
            pitchBend: channel.pitchBend - 0x2000,
            pitchBendSensitivity: channel.pitchBendSensitivity
        };
        // note on
        var note = new SynthesizerNote_1["default"](this.ctx, this.gainMaster, noteInfo, instrumentKey);
        note.noteOn();
        channel.currentNoteOn.push(note);
        this.view.noteOn(channelNumber, key);
    };
    Synthesizer.prototype.noteOff = function (channelNumber, key, _velocity) {
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
    function SynthesizerNote(ctx, destination, noteInfo, instrument) {
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
    SynthesizerNote.prototype.noteOn = function () {
        var _this = this;
        var _a = this, ctx = _a.ctx, noteInfo = _a.noteInfo;
        var sample = noteInfo.sample.subarray(0, noteInfo.sample.length + noteInfo.end);
        this.audioBuffer = ctx.createBuffer(1, sample.length, noteInfo.sampleRate);
        var channelData = this.audioBuffer.getChannelData(0);
        channelData.set(sample);
        // buffer source
        var bufferSource = ctx.createBufferSource();
        bufferSource.buffer = this.audioBuffer;
        bufferSource.loop = (this.channel !== 9);
        bufferSource.loopStart = noteInfo.loopStart / noteInfo.sampleRate;
        bufferSource.loopEnd = noteInfo.loopEnd / noteInfo.sampleRate;
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
        var volAttackTime = now + noteInfo.volAttack;
        var modAttackTime = now + noteInfo.modAttack;
        var volDecay = volAttackTime + noteInfo.volDecay;
        var modDecay = modAttackTime + noteInfo.modDecay;
        var startTime = noteInfo.start / noteInfo.sampleRate;
        var attackVolume = this.volume * (this.velocity / 127);
        outputGain.setValueAtTime(0, now);
        outputGain.linearRampToValueAtTime(attackVolume, volAttackTime);
        outputGain.linearRampToValueAtTime(attackVolume * (1 - noteInfo.volSustain), volDecay);
        filter.Q.setValueAtTime(noteInfo.initialFilterQ / 10, now);
        var baseFreq = amountToFreq(noteInfo.initialFilterFc);
        var peekFreq = amountToFreq(noteInfo.initialFilterFc + noteInfo.modEnvToFilterFc);
        var sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - noteInfo.modSustain);
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
        var _a = this, noteInfo = _a.noteInfo, bufferSource = _a.bufferSource;
        var output = this.gainOutput;
        var now = this.ctx.currentTime;
        var volEndTime = now + noteInfo.volRelease;
        var modEndTime = now + noteInfo.modRelease;
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
        var noteInfo = this.noteInfo;
        var playbackRate = this.bufferSource.playbackRate;
        var computed = this.computedPlaybackRate;
        var start = this.startTime;
        var modAttack = start + noteInfo.modAttack;
        var modDecay = modAttack + noteInfo.modDecay;
        var peekPitch = computed * Math.pow(Math.pow(2, 1 / 12), noteInfo.modEnvToPitch * noteInfo.scaleTuning);
        playbackRate.cancelScheduledValues(0);
        playbackRate.setValueAtTime(computed, start);
        playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
        playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - noteInfo.modSustain), modDecay);
    };
    SynthesizerNote.prototype.updatePitchBend = function (pitchBend) {
        this.computedPlaybackRate = this.playbackRate * Math.pow(Math.pow(2, 1 / 12), (this.pitchBendSensitivity * (pitchBend / (pitchBend < 0 ? 8192 : 8191))) * this.noteInfo.scaleTuning);
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
    var banks = {};
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
function createBagModGen(indexStart, indexEnd, zoneModGen) {
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
    var modgen = createBagModGen(zone[index].instrumentGeneratorIndex, zone[index + 1] ? zone[index + 1].instrumentGeneratorIndex : instrumentZoneGenerator.length, instrumentZoneGenerator);
    return {
        generator: modgen.modgen,
        generatorInfo: modgen.modgenInfo
    };
}
function createInstrumentModulator(zone, index, instrumentZoneModulator) {
    var modgen = createBagModGen(zone[index].instrumentModulatorIndex, zone[index + 1] ? zone[index + 1].instrumentModulatorIndex : instrumentZoneModulator.length, instrumentZoneModulator);
    return {
        modulator: modgen.modgen,
        modulatorInfo: modgen.modgenInfo
    };
}
function createPresetGenerator(zone, index, presetZoneGenerator) {
    var modgen = createBagModGen(zone[index].presetGeneratorIndex, zone[index + 1] ? zone[index + 1].presetGeneratorIndex : presetZoneGenerator.length, presetZoneGenerator);
    return {
        generator: modgen.modgen,
        generatorInfo: modgen.modgenInfo
    };
}
function createPresetModulator(zone, index, presetZoneModulator) {
    var modgen = createBagModGen(zone[index].presetModulatorIndex, zone[index + 1] ? zone[index + 1].presetModulatorIndex : presetZoneModulator.length, presetZoneModulator);
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
var ProgramNames_1 = __webpack_require__(13);
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
        var programNames = mergeProgramNames(programNamesFromBankSet(synth.soundFont.bankSet), ProgramNames_1["default"]);
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
        if (!this.element) {
            return null;
        }
        return this.element.querySelectorAll(".instrument")[channel];
    };
    View.prototype.getKeyElement = function (channel, key) {
        var elem = this.getInstrumentElement(channel);
        if (!elem) {
            return null;
        }
        return elem.querySelectorAll(".key")[key];
    };
    View.prototype.findInstrumentElement = function (channel, query) {
        var elem = this.getInstrumentElement(channel);
        if (!elem) {
            return null;
        }
        return elem.querySelector(query);
    };
    View.prototype.noteOn = function (channel, key) {
        var element = this.getKeyElement(channel, key);
        if (element) {
            element.classList.add('note-on');
        }
    };
    View.prototype.noteOff = function (channel, key) {
        var element = this.getKeyElement(channel, key);
        if (element) {
            element.classList.remove('note-on');
        }
    };
    View.prototype.programChange = function (channel, instrument) {
        var select = this.findInstrumentElement(channel, ".program select");
        if (select) {
            select.value = instrument;
        }
    };
    View.prototype.volumeChange = function (channel, volume) {
        var element = this.findInstrumentElement(channel, ".volume");
        if (element) {
            element.textContent = volume;
        }
    };
    View.prototype.panpotChange = function (channel, panpot) {
        var element = this.findInstrumentElement(channel, ".panpot");
        if (element) {
            element.textContent = panpot;
        }
    };
    View.prototype.pitchBend = function (channel, calculatedPitch) {
        var element = this.findInstrumentElement(channel, ".pitchBend");
        if (element) {
            element.textContent = calculatedPitch;
        }
    };
    View.prototype.pitchBendSensitivity = function (channel, sensitivity) {
        var element = this.findInstrumentElement(channel, ".pitchBendSensitivity");
        if (element) {
            element.textContent = sensitivity;
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA0MzVmZjY5MzkyMGExNDc3ZWI4NCIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmlmZlBhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3RydWN0cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhZFN0cmluZy50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvc3ludGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYk1pZGlMaW5rLnRzIiwid2VicGFjazovLy8uL3NyYy9TeW50aGVzaXplci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ludGhlc2l6ZXJOb3RlLnRzIiwid2VicGFjazovLy8uL3NyYy9Tb3VuZEZvbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZpZXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Byb2dyYW1OYW1lcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWlkaU1lc3NhZ2VIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2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Q0QsS0FBSzs0QkFDUDtnQ0FDRSxLQUFLO3dCQUNULENBQUM7d0JBQ0QsS0FBSztvQkFDUDt3QkFDRSxLQUFLO2dCQUNULENBQUM7Z0JBQ0QsS0FBSztZQUNQLFFBQVMsZ0JBQWdCO2dCQUN2QixLQUFLO1FBQ1QsQ0FBQztJQUNILENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMiLCJmaWxlIjoic2YyLnN5bnRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wic3ludGhcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wic3ludGhcIl0gPSBmYWN0b3J5KCk7XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQzNWZmNjkzOTIwYTE0NzdlYjg0IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcclxuICBwcml2YXRlIGRhdGE6IFVpbnQ4QXJyYXlcclxuICBpcDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9mZnNldCkge1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YVxyXG4gICAgdGhpcy5pcCA9IG9mZnNldFxyXG4gIH1cclxuXHJcbiAgcmVhZFN0cmluZyhzaXplOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCB0aGlzLmRhdGEuc3ViYXJyYXkodGhpcy5pcCwgdGhpcy5pcCArPSBzaXplKSlcclxuICAgIGNvbnN0IG51bGxMb2NhdGlvbiA9IHN0ci5pbmRleE9mKFwiXFx1MDAwMFwiKVxyXG4gICAgaWYgKG51bGxMb2NhdGlvbiA+IDApIHtcclxuICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMCwgbnVsbExvY2F0aW9uKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0clxyXG4gIH1cclxuXHJcbiAgcmVhZFdPUkQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCsrXSB8ICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KVxyXG4gIH1cclxuXHJcbiAgcmVhZERXT1JEKGJpZ0VuZGlhbjogYm9vbGVhbiA9IGZhbHNlKTogbnVtYmVyIHtcclxuICAgIGlmIChiaWdFbmRpYW4pIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICB0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAyNHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDE2KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSlcclxuICAgICAgKSA+Pj4gMFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICB0aGlzLmRhdGFbdGhpcy5pcCsrXSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAxNikgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMjQpXHJcbiAgICAgICkgPj4+IDBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlYWRCeXRlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwKytdXHJcbiAgfVxyXG5cclxuICByZWFkQXQob2Zmc2V0OiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCArIG9mZnNldF1cclxuICB9XHJcblxyXG4gIC8qIGhlbHBlciAqL1xyXG5cclxuICByZWFkVUludDgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkQnl0ZSgpXHJcbiAgfVxyXG4gIFxyXG4gIHJlYWRJbnQ4KCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnJlYWRCeXRlKCkgPDwgMjQpID4+IDI0XHJcbiAgfVxyXG4gIFxyXG4gIHJlYWRVSW50MTYoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkV09SRCgpXHJcbiAgfVxyXG5cclxuICByZWFkSW50MTYoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMucmVhZFdPUkQoKSA8PCAxNikgPj4gMTZcclxuICB9XHJcblxyXG4gIHJlYWRVSW50MzIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkRFdPUkQoKVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3RyZWFtLnRzIiwiZXhwb3J0IGNvbnN0IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZSA9IFtcclxuICAnc3RhcnRBZGRyc09mZnNldCcsXHJcbiAgJ2VuZEFkZHJzT2Zmc2V0JyxcclxuICAnc3RhcnRsb29wQWRkcnNPZmZzZXQnLFxyXG4gICdlbmRsb29wQWRkcnNPZmZzZXQnLFxyXG4gICdzdGFydEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnbW9kTGZvVG9QaXRjaCcsXHJcbiAgJ3ZpYkxmb1RvUGl0Y2gnLFxyXG4gICdtb2RFbnZUb1BpdGNoJyxcclxuICAnaW5pdGlhbEZpbHRlckZjJyxcclxuICAnaW5pdGlhbEZpbHRlclEnLFxyXG4gICdtb2RMZm9Ub0ZpbHRlckZjJyxcclxuICAnbW9kRW52VG9GaWx0ZXJGYycsXHJcbiAgJ2VuZEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnbW9kTGZvVG9Wb2x1bWUnLFxyXG4gIHVuZGVmaW5lZCwgLy8gMTRcclxuICAnY2hvcnVzRWZmZWN0c1NlbmQnLFxyXG4gICdyZXZlcmJFZmZlY3RzU2VuZCcsXHJcbiAgJ3BhbicsXHJcbiAgdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsIC8vIDE4LDE5LDIwXHJcbiAgJ2RlbGF5TW9kTEZPJyxcclxuICAnZnJlcU1vZExGTycsXHJcbiAgJ2RlbGF5VmliTEZPJyxcclxuICAnZnJlcVZpYkxGTycsXHJcbiAgJ2RlbGF5TW9kRW52JyxcclxuICAnYXR0YWNrTW9kRW52JyxcclxuICAnaG9sZE1vZEVudicsXHJcbiAgJ2RlY2F5TW9kRW52JyxcclxuICAnc3VzdGFpbk1vZEVudicsXHJcbiAgJ3JlbGVhc2VNb2RFbnYnLFxyXG4gICdrZXludW1Ub01vZEVudkhvbGQnLFxyXG4gICdrZXludW1Ub01vZEVudkRlY2F5JyxcclxuICAnZGVsYXlWb2xFbnYnLFxyXG4gICdhdHRhY2tWb2xFbnYnLFxyXG4gICdob2xkVm9sRW52JyxcclxuICAnZGVjYXlWb2xFbnYnLFxyXG4gICdzdXN0YWluVm9sRW52JyxcclxuICAncmVsZWFzZVZvbEVudicsXHJcbiAgJ2tleW51bVRvVm9sRW52SG9sZCcsXHJcbiAgJ2tleW51bVRvVm9sRW52RGVjYXknLFxyXG4gICdpbnN0cnVtZW50JyxcclxuICB1bmRlZmluZWQsIC8vIDQyXHJcbiAgJ2tleVJhbmdlJyxcclxuICAndmVsUmFuZ2UnLFxyXG4gICdzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ2tleW51bScsXHJcbiAgJ3ZlbG9jaXR5JyxcclxuICAnaW5pdGlhbEF0dGVudWF0aW9uJyxcclxuICB1bmRlZmluZWQsIC8vIDQ5XHJcbiAgJ2VuZGxvb3BBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ2NvYXJzZVR1bmUnLFxyXG4gICdmaW5lVHVuZScsXHJcbiAgJ3NhbXBsZUlEJyxcclxuICAnc2FtcGxlTW9kZXMnLFxyXG4gIHVuZGVmaW5lZCwgLy8gNTVcclxuICAnc2NhbGVUdW5pbmcnLFxyXG4gICdleGNsdXNpdmVDbGFzcycsXHJcbiAgJ292ZXJyaWRpbmdSb290S2V5J1xyXG5dXHJcblxyXG5leHBvcnQgY29uc3QgSW5mb05hbWVUYWJsZSA9IHtcclxuICBJQ01UOiBcImNvbW1lbnRcIixcclxuICBJQ09QOiBcImNvcHlyaWdodFwiLFxyXG4gIElDUkQ6IFwiY3JlYXRpb25fZGF0ZVwiLFxyXG4gIElFTkc6IFwiZW5naW5lZXJcIixcclxuICBJTkFNOiBcIm5hbWVcIixcclxuICBJUFJEOiBcInByb2R1Y3RcIixcclxuICBJU0ZUOiBcInNvZnR3YXJlXCIsXHJcbiAgaWZpbDogXCJ2ZXJzaW9uXCIsXHJcbiAgaXNuZzogXCJzb3VuZF9lbmdpbmVcIixcclxuICBpcm9tOiBcInJvbV9uYW1lXCIsXHJcbiAgaXZlcjogXCJyb21fdmVyc2lvblwiXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbnN0YW50cy50cyIsImltcG9ydCB7IHBhcnNlUmlmZiwgQ2h1bmssIE9wdGlvbnMgYXMgUmlmZlBhcnNlck9wdGlvbnMgfSBmcm9tIFwiLi9SaWZmUGFyc2VyXCJcclxuaW1wb3J0IHsgUHJlc2V0SGVhZGVyLCBTYW1wbGUsIFByZXNldEJhZywgSW5zdHJ1bWVudCwgSW5zdHJ1bWVudEJhZywgTW9kdWxhdG9yTGlzdCwgR2VuZXJhdG9yTGlzdCB9IGZyb20gXCIuL1N0cnVjdHNcIlxyXG5pbXBvcnQgeyByZWFkU3RyaW5nIH0gZnJvbSBcIi4vcmVhZFN0cmluZ1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuaW1wb3J0IHsgSW5mb05hbWVUYWJsZSB9IGZyb20gXCIuL0NvbnN0YW50c1wiXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlUmVzdWx0IHtcclxuICBwcmVzZXRIZWFkZXI6IFByZXNldEhlYWRlcltdXHJcbiAgcHJlc2V0Wm9uZTogUHJlc2V0QmFnW11cclxuICBwcmVzZXRab25lTW9kdWxhdG9yOiBNb2R1bGF0b3JMaXN0W11cclxuICBwcmVzZXRab25lR2VuZXJhdG9yOiBNb2R1bGF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50OiBJbnN0cnVtZW50W11cclxuICBpbnN0cnVtZW50Wm9uZTogSW5zdHJ1bWVudEJhZ1tdXHJcbiAgaW5zdHJ1bWVudFpvbmVNb2R1bGF0b3I6IE1vZHVsYXRvckxpc3RbXVxyXG4gIGluc3RydW1lbnRab25lR2VuZXJhdG9yOiBNb2R1bGF0b3JMaXN0W11cclxuICBzYW1wbGVIZWFkZXI6IFNhbXBsZVtdXHJcbiAgc2FtcGxlOiBJbnQxNkFycmF5W11cclxuICBzYW1wbGluZ0RhdGE6IENodW5rXHJcbiAgaW5mbzoge31cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2UoaW5wdXQ6IFVpbnQ4QXJyYXksIG9wdGlvbjogUmlmZlBhcnNlck9wdGlvbnMgPSB7fSk6IFBhcnNlUmVzdWx0IHtcclxuXHJcbiAgLy8gcGFyc2UgUklGRiBjaHVua1xyXG4gIGNvbnN0IGNodW5rTGlzdCA9IHBhcnNlUmlmZihpbnB1dCwgMCwgaW5wdXQubGVuZ3RoLCBvcHRpb24pXHJcblxyXG4gIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAxKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIGNodW5rIGxlbmd0aCcpXHJcbiAgfVxyXG5cclxuICBjb25zdCBjaHVuayA9IGNodW5rTGlzdFswXVxyXG4gIGlmIChjaHVuayA9PT0gbnVsbCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjaHVuayBub3QgZm91bmQnKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VSaWZmQ2h1bmsoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiUklGRlwiLCBcInNmYmtcIilcclxuXHJcbiAgICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgc2ZiayBzdHJ1Y3R1cmUnKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIC8vIElORk8tbGlzdFxyXG4gICAgICBpbmZvOiBwYXJzZUluZm9MaXN0KGNodW5rTGlzdFswXSwgZGF0YSksXHJcblxyXG4gICAgICAvLyBzZHRhLWxpc3RcclxuICAgICAgc2FtcGxpbmdEYXRhOiBwYXJzZVNkdGFMaXN0KGNodW5rTGlzdFsxXSwgZGF0YSksXHJcblxyXG4gICAgICAvLyBwZHRhLWxpc3RcclxuICAgICAgLi4ucGFyc2VQZHRhTGlzdChjaHVua0xpc3RbMl0sIGRhdGEpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZVBkdGFMaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gICAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJwZHRhXCIpXHJcblxyXG4gICAgLy8gY2hlY2sgbnVtYmVyIG9mIGNodW5rc1xyXG4gICAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHBkdGEgY2h1bmsnKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHByZXNldEhlYWRlcjogcGFyc2VQaGRyKGNodW5rTGlzdFswXSwgZGF0YSksXHJcbiAgICAgIHByZXNldFpvbmU6IHBhcnNlUGJhZyhjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRab25lTW9kdWxhdG9yOiBwYXJzZVBtb2QoY2h1bmtMaXN0WzJdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0Wm9uZUdlbmVyYXRvcjogcGFyc2VQZ2VuKGNodW5rTGlzdFszXSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnQ6IHBhcnNlSW5zdChjaHVua0xpc3RbNF0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50Wm9uZTogcGFyc2VJYmFnKGNodW5rTGlzdFs1XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRab25lTW9kdWxhdG9yOiBwYXJzZUltb2QoY2h1bmtMaXN0WzZdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3I6IHBhcnNlSWdlbihjaHVua0xpc3RbN10sIGRhdGEpLFxyXG4gICAgICBzYW1wbGVIZWFkZXI6IHBhcnNlU2hkcihjaHVua0xpc3RbOF0sIGRhdGEpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCByZXN1bHQgPSBwYXJzZVJpZmZDaHVuayhjaHVuaywgaW5wdXQpXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAuLi5yZXN1bHQsXHJcbiAgICBzYW1wbGU6IGxvYWRTYW1wbGUocmVzdWx0LnNhbXBsZUhlYWRlciwgcmVzdWx0LnNhbXBsaW5nRGF0YS5vZmZzZXQsIGlucHV0KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBleHBlY3RlZFR5cGUsIGV4cGVjdGVkU2lnbmF0dXJlKSB7XHJcbiAgLy8gY2hlY2sgcGFyc2UgdGFyZ2V0XHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyArIGNodW5rLnR5cGUpXHJcbiAgfVxyXG5cclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuXHJcbiAgLy8gY2hlY2sgc2lnbmF0dXJlXHJcbiAgY29uc3Qgc2lnbmF0dXJlID0gc3RyZWFtLnJlYWRTdHJpbmcoNClcclxuICBpZiAoc2lnbmF0dXJlICE9PSBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKVxyXG4gIH1cclxuXHJcbiAgLy8gcmVhZCBzdHJ1Y3R1cmVcclxuICByZXR1cm4gcGFyc2VSaWZmKGRhdGEsIHN0cmVhbS5pcCwgY2h1bmsuc2l6ZSAtIDQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlSW5mb0xpc3QoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KToge30ge1xyXG4gIGNvbnN0IGluZm8gPSB7fVxyXG4gIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwiSU5GT1wiKVxyXG5cclxuICBmb3IgKGxldCBwIG9mIGNodW5rTGlzdCkge1xyXG4gICAgY29uc3QgeyBvZmZzZXQsIHNpemUsIHR5cGUgfSA9IHBcclxuICAgIGNvbnN0IG5hbWUgPSBJbmZvTmFtZVRhYmxlW3R5cGVdIHx8IHR5cGVcclxuICAgIGluZm9bbmFtZV0gPSByZWFkU3RyaW5nKGRhdGEsIG9mZnNldCwgb2Zmc2V0ICsgc2l6ZSlcclxuICB9XHJcblxyXG4gIHJldHVybiBpbmZvXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlU2R0YUxpc3QoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KTogQ2h1bmsge1xyXG4gIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwic2R0YVwiKVxyXG5cclxuICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUT0RPJylcclxuICB9XHJcblxyXG4gIHJldHVybiBjaHVua0xpc3RbMF1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VDaHVuazxUPihjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXksIHR5cGU6IHN0cmluZywgZmFjdG9yeTogKFN0cmVhbSkgPT4gVCk6IFRbXSB7XHJcbiAgY29uc3QgcmVzdWx0OiBUW10gPSBbXVxyXG5cclxuICBpZiAoY2h1bmsudHlwZSAhPT0gdHlwZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyAgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuICBcclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuICBjb25zdCBzaXplID0gY2h1bmsub2Zmc2V0ICsgY2h1bmsuc2l6ZVxyXG4gIFxyXG4gIHdoaWxlIChzdHJlYW0uaXAgPCBzaXplKSB7XHJcbiAgICByZXN1bHQucHVzaChmYWN0b3J5KHN0cmVhbSkpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmNvbnN0IHBhcnNlUGhkciA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwaGRyXCIsIHN0cmVhbSA9PiBQcmVzZXRIZWFkZXIucGFyc2Uoc3RyZWFtKSkuZmlsdGVyKHAgPT4gcC5wcmVzZXROYW1lICE9PSBcIkVPUFwiKVxyXG5jb25zdCBwYXJzZVBiYWcgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGJhZ1wiLCBzdHJlYW0gPT4gUHJlc2V0QmFnLnBhcnNlKHN0cmVhbSkpXHJcbmNvbnN0IHBhcnNlSW5zdCA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpbnN0XCIsIHN0cmVhbSA9PiBJbnN0cnVtZW50LnBhcnNlKHN0cmVhbSkpLmZpbHRlcihpID0+IGkuaW5zdHJ1bWVudE5hbWUgIT09IFwiRU9JXCIpXHJcbmNvbnN0IHBhcnNlSWJhZyA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpYmFnXCIsIHN0cmVhbSA9PiBJbnN0cnVtZW50QmFnLnBhcnNlKHN0cmVhbSkpXHJcbmNvbnN0IHBhcnNlUG1vZCA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwbW9kXCIsIHN0cmVhbSA9PiBNb2R1bGF0b3JMaXN0LnBhcnNlKHN0cmVhbSkpXHJcbmNvbnN0IHBhcnNlSW1vZCA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpbW9kXCIsIHN0cmVhbSA9PiBNb2R1bGF0b3JMaXN0LnBhcnNlKHN0cmVhbSkpXHJcbmNvbnN0IHBhcnNlUGdlbiA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwZ2VuXCIsIHN0cmVhbSA9PiBHZW5lcmF0b3JMaXN0LnBhcnNlKHN0cmVhbSkpXHJcbmNvbnN0IHBhcnNlSWdlbiA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpZ2VuXCIsIHN0cmVhbSA9PiBHZW5lcmF0b3JMaXN0LnBhcnNlKHN0cmVhbSkpXHJcbmNvbnN0IHBhcnNlU2hkciA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJzaGRyXCIsIHN0cmVhbSA9PiBTYW1wbGUucGFyc2Uoc3RyZWFtKSkuZmlsdGVyKHMgPT4gcy5zYW1wbGVOYW1lICE9PSBcIkVPU1wiKVxyXG5cclxuZnVuY3Rpb24gYWRqdXN0U2FtcGxlRGF0YShzYW1wbGUsIHNhbXBsZVJhdGUpIHtcclxuICBsZXQgbXVsdGlwbHkgPSAxXHJcblxyXG4gIC8vIGJ1ZmZlclxyXG4gIHdoaWxlIChzYW1wbGVSYXRlIDwgMjIwNTApIHtcclxuICAgIGNvbnN0IG5ld1NhbXBsZSA9IG5ldyBJbnQxNkFycmF5KHNhbXBsZS5sZW5ndGggKiAyKVxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGogPSAwLCBpbCA9IHNhbXBsZS5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XHJcbiAgICAgIG5ld1NhbXBsZVtqKytdID0gc2FtcGxlW2ldXHJcbiAgICAgIG5ld1NhbXBsZVtqKytdID0gc2FtcGxlW2ldXHJcbiAgICB9XHJcbiAgICBzYW1wbGUgPSBuZXdTYW1wbGVcclxuICAgIG11bHRpcGx5ICo9IDJcclxuICAgIHNhbXBsZVJhdGUgKj0gMlxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNhbXBsZSxcclxuICAgIG11bHRpcGx5XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU2FtcGxlKHNhbXBsZUhlYWRlcjogU2FtcGxlW10sIHNhbXBsaW5nRGF0YU9mZnNldDogbnVtYmVyLCBkYXRhOiBVaW50OEFycmF5KTogSW50MTZBcnJheVtdIHtcclxuICByZXR1cm4gc2FtcGxlSGVhZGVyLm1hcChoZWFkZXIgPT4ge1xyXG4gICAgbGV0IHNhbXBsZSA9IG5ldyBJbnQxNkFycmF5KG5ldyBVaW50OEFycmF5KGRhdGEuc3ViYXJyYXkoXHJcbiAgICAgIHNhbXBsaW5nRGF0YU9mZnNldCArIGhlYWRlci5zdGFydCAqIDIsXHJcbiAgICAgIHNhbXBsaW5nRGF0YU9mZnNldCArIGhlYWRlci5lbmQgICAqIDJcclxuICAgICkpLmJ1ZmZlcilcclxuICAgIGlmIChoZWFkZXIuc2FtcGxlUmF0ZSA+IDApIHtcclxuICAgICAgY29uc3QgYWRqdXN0ID0gYWRqdXN0U2FtcGxlRGF0YShzYW1wbGUsIGhlYWRlci5zYW1wbGVSYXRlKVxyXG4gICAgICBzYW1wbGUgPSBhZGp1c3Quc2FtcGxlXHJcbiAgICAgIGhlYWRlci5zYW1wbGVSYXRlICo9IGFkanVzdC5tdWx0aXBseVxyXG4gICAgICBoZWFkZXIuc3RhcnRMb29wICo9IGFkanVzdC5tdWx0aXBseVxyXG4gICAgICBoZWFkZXIuZW5kTG9vcCAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgIH1cclxuICAgIHJldHVybiBzYW1wbGVcclxuICB9KVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1BhcnNlci50cyIsImltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuXHJcbmZ1bmN0aW9uIHBhcnNlQ2h1bmsoaW5wdXQ6IFVpbnQ4QXJyYXksIGlwOiBudW1iZXIsIGJpZ0VuZGlhbjogYm9vbGVhbik6IENodW5rIHtcclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGlucHV0LCBpcClcclxuICBjb25zdCB0eXBlID0gc3RyZWFtLnJlYWRTdHJpbmcoNClcclxuICBjb25zdCBzaXplID0gc3RyZWFtLnJlYWREV09SRChiaWdFbmRpYW4pXHJcbiAgcmV0dXJuIG5ldyBDaHVuayh0eXBlLCBzaXplLCBzdHJlYW0uaXApXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9ucyB7XHJcbiAgcGFkZGluZz86IGJvb2xlYW4sXHJcbiAgYmlnRW5kaWFuPzogYm9vbGVhblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSaWZmKGlucHV0OiBVaW50OEFycmF5LCBpbmRleDogbnVtYmVyID0gMCwgbGVuZ3RoOiBudW1iZXIsIHsgcGFkZGluZyA9IHRydWUsIGJpZ0VuZGlhbiA9IGZhbHNlIH06IE9wdGlvbnMgPSB7fSkge1xyXG4gIGNvbnN0IGNodW5rTGlzdDogQ2h1bmtbXSA9IFtdXHJcbiAgY29uc3QgZW5kID0gbGVuZ3RoICsgaW5kZXhcclxuICBsZXQgaXAgPSBpbmRleFxyXG5cclxuICB3aGlsZSAoaXAgPCBlbmQpIHtcclxuICAgIGNvbnN0IGNodW5rID0gcGFyc2VDaHVuayhpbnB1dCwgaXAsIGJpZ0VuZGlhbilcclxuICAgIGlwID0gY2h1bmsub2Zmc2V0ICsgY2h1bmsuc2l6ZVxyXG4gICAgXHJcbiAgICAvLyBwYWRkaW5nXHJcbiAgICBpZiAocGFkZGluZyAmJiAoKGlwIC0gaW5kZXgpICYgMSkgPT09IDEpIHtcclxuICAgICAgaXArK1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaHVua0xpc3QucHVzaChjaHVuaylcclxuICB9XHJcblxyXG4gIHJldHVybiBjaHVua0xpc3RcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENodW5rIHtcclxuICB0eXBlOiBzdHJpbmdcclxuICBzaXplOiBudW1iZXJcclxuICBvZmZzZXQ6IG51bWJlclxyXG5cclxuICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIHNpemU6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpIHtcclxuICAgIHRoaXMudHlwZSA9IHR5cGVcclxuICAgIHRoaXMuc2l6ZSA9IHNpemVcclxuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9SaWZmUGFyc2VyLnRzIiwiaW1wb3J0IHsgR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlIH0gZnJvbSBcIi4vQ29uc3RhbnRzXCJcclxuaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9TdHJlYW1cIlxyXG5cclxuZXhwb3J0IGNsYXNzIFZlcnNpb25UYWcge1xyXG4gIG1ham9yOiBudW1iZXJcclxuICBtaW5vcjogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcmVzZXRIZWFkZXIge1xyXG4gIHByZXNldE5hbWU6IHN0cmluZ1xyXG4gIHByZXNldDogbnVtYmVyXHJcbiAgYmFuazogbnVtYmVyXHJcbiAgcHJlc2V0QmFnSW5kZXg6IG51bWJlclxyXG4gIGxpYnJhcnk6IG51bWJlclxyXG4gIGdlbnJlOiBudW1iZXJcclxuICBtb3JwaG9sb2d5OiBudW1iZXJcclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCBwID0gbmV3IFByZXNldEhlYWRlcigpXHJcbiAgICBwLnByZXNldE5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHAucHJlc2V0ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAuYmFuayA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLnByZXNldEJhZ0luZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAubGlicmFyeSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcC5nZW5yZSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcC5tb3JwaG9sb2d5ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICByZXR1cm4gcFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByZXNldEJhZyB7XHJcbiAgcHJlc2V0R2VuZXJhdG9ySW5kZXg6IG51bWJlclxyXG4gIHByZXNldE1vZHVsYXRvckluZGV4OiBudW1iZXJcclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCBwID0gbmV3IFByZXNldEJhZygpXHJcbiAgICBwLnByZXNldEdlbmVyYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAucHJlc2V0TW9kdWxhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcmV0dXJuIHBcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQW1vdW50VmFsdWUge1xyXG4gIGNvZGU/OiBudW1iZXJcclxuICBhbW91bnQ6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlVmFsdWUge1xyXG4gIGxvOiBudW1iZXJcclxuICBoaTogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNb2R1bGF0b3JMaXN0IHtcclxuICBzb3VyY2VPcGVyOiBudW1iZXJcclxuICBkZXN0aW5hdGlvbk9wZXI6IG51bWJlclxyXG4gIHZhbHVlOiBBbW91bnRWYWx1ZXxSYW5nZVZhbHVlXHJcbiAgYW1vdW50U291cmNlT3BlcjogbnVtYmVyXHJcbiAgdHJhbnNPcGVyOiBudW1iZXJcclxuICB0eXBlOiBzdHJpbmdcclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IE1vZHVsYXRvckxpc3QoKVxyXG5cclxuICAgIHQuc291cmNlT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBjb25zdCBjb2RlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQuZGVzdGluYXRpb25PcGVyID0gY29kZVxyXG4gICAgXHJcbiAgICBjb25zdCBrZXkgPSBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGVbY29kZV1cclxuICAgIHQudHlwZSA9IGtleSFcclxuXHJcbiAgICBpZiAoa2V5ID09PSB2b2lkIDApIHtcclxuICAgICAgLy8gQW1vdW50XHJcbiAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgY29kZTogY29kZSxcclxuICAgICAgICBhbW91bnQ6IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBBbW91bnRcclxuICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsUmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ2tleW51bSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICAgICAgbG86IHN0cmVhbS5yZWFkQnl0ZSgpLFxyXG4gICAgICAgICAgICBoaTogc3RyZWFtLnJlYWRCeXRlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGFtb3VudDogc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHQuYW1vdW50U291cmNlT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0LnRyYW5zT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHZW5lcmF0b3JMaXN0IHtcclxuICB0eXBlOiBzdHJpbmdcclxuICB2YWx1ZTogQW1vdW50VmFsdWV8UmFuZ2VWYWx1ZVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgTW9kdWxhdG9yTGlzdCgpXHJcbiAgICBcclxuICAgIGNvbnN0IGNvZGUgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgY29uc3Qga2V5ID0gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW2NvZGVdXHJcbiAgICB0LnR5cGUgPSBrZXkhXHJcblxyXG4gICAgaWYgKGtleSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgY29kZSxcclxuICAgICAgICBhbW91bnQ6IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgIGNhc2UgJ2tleW51bSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAna2V5UmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICd2ZWxvY2l0eSc6XHJcbiAgICAgICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgICAgICBsbzogc3RyZWFtLnJlYWRCeXRlKCksXHJcbiAgICAgICAgICAgIGhpOiBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICAgICAgYW1vdW50OiBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnQge1xyXG4gIGluc3RydW1lbnROYW1lOiBzdHJpbmdcclxuICBpbnN0cnVtZW50QmFnSW5kZXg6IG51bWJlclxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBJbnN0cnVtZW50KClcclxuICAgIHQuaW5zdHJ1bWVudE5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHQuaW5zdHJ1bWVudEJhZ0luZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudEJhZyB7XHJcbiAgaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBpbnN0cnVtZW50TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBJbnN0cnVtZW50QmFnKClcclxuICAgIHQuaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQuaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2FtcGxlIHtcclxuICBzYW1wbGVOYW1lOiBzdHJpbmdcclxuICBzdGFydDogbnVtYmVyXHJcbiAgZW5kOiBudW1iZXJcclxuICBzdGFydExvb3A6IG51bWJlclxyXG4gIGVuZExvb3A6IG51bWJlclxyXG4gIHNhbXBsZVJhdGU6IG51bWJlclxyXG4gIG9yaWdpbmFsUGl0Y2g6IG51bWJlclxyXG4gIHBpdGNoQ29ycmVjdGlvbjogbnVtYmVyXHJcbiAgc2FtcGxlTGluazogbnVtYmVyXHJcbiAgc2FtcGxlVHlwZTogbnVtYmVyXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcyA9IG5ldyBTYW1wbGUoKVxyXG5cclxuICAgIHMuc2FtcGxlTmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcy5zdGFydCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5lbmQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuc3RhcnRMb29wID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmVuZExvb3AgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuc2FtcGxlUmF0ZSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5vcmlnaW5hbFBpdGNoID0gc3RyZWFtLnJlYWRCeXRlKClcclxuICAgIHMucGl0Y2hDb3JyZWN0aW9uID0gc3RyZWFtLnJlYWRJbnQ4KClcclxuICAgIHMuc2FtcGxlTGluayA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBzLnNhbXBsZVR5cGUgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHMuc3RhcnRMb29wIC09IHMuc3RhcnRcclxuICAgIHMuZW5kTG9vcCAtPSBzLnN0YXJ0XHJcblxyXG4gICAgcmV0dXJuIHNcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW51bSB7bnVtYmVyfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFNhbXBsZUxpbmsgPSB7XHJcbiAgbW9ub1NhbXBsZTogMSxcclxuICByaWdodFNhbXBsZTogMixcclxuICBsZWZ0U2FtcGxlOiA0LFxyXG4gIGxpbmtlZFNhbXBsZTogOCxcclxuICBSb21Nb25vU2FtcGxlOiAweDgwMDEsXHJcbiAgUm9tUmlnaHRTYW1wbGU6IDB4ODAwMixcclxuICBSb21MZWZ0U2FtcGxlOiAweDgwMDQsXHJcbiAgUm9tTGlua2VkU2FtcGxlOiAweDgwMDhcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3RydWN0cy50cyIsImV4cG9ydCBmdW5jdGlvbiByZWFkU3RyaW5nKGRhdGE6IFVpbnQ4QXJyYXksIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogc3RyaW5nIHtcclxuICBjb25zdCBzdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGRhdGEuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXHJcbiAgY29uc3QgbnVsbExvY2F0aW9uID0gc3RyLmluZGV4T2YoXCJcXHUwMDAwXCIpXHJcbiAgaWYgKG51bGxMb2NhdGlvbiA+IDApIHtcclxuICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIG51bGxMb2NhdGlvbilcclxuICB9XHJcbiAgcmV0dXJuIHN0clxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZWFkU3RyaW5nLnRzIiwiaW1wb3J0IFdlYk1pZGlMaW5rIGZyb20gXCIuLi9zcmMvV2ViTWlkaUxpbmsudHNcIlxyXG5leHBvcnQgZGVmYXVsdCBXZWJNaWRpTGlua1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9leHBvcnQvc3ludGguanMiLCJpbXBvcnQgU3ludGhlc2l6ZXIgZnJvbSBcIi4vU3ludGhlc2l6ZXJcIlxyXG5pbXBvcnQgVmlldyBmcm9tIFwiLi9WaWV3XCJcclxuaW1wb3J0IE1pZGlNZXNzYWdlSGFuZGxlciBmcm9tIFwiLi9NaWRpTWVzc2FnZUhhbmRsZXJcIlxyXG5cclxuLyoqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuY29uc3QgV2ViTWlkaUxpbmsgPSBmdW5jdGlvbigpIHtcclxuICAvKiogQHR5cGUge2Z1bmN0aW9uKEFycmF5QnVmZmVyKX0gKi9cclxuICB0aGlzLmxvYWRDYWxsYmFja1xyXG4gIC8qKiBAdHlwZSB7RnVuY3Rpb259ICovXHJcbiAgdGhpcy5tZXNzYWdlSGFuZGxlciA9IHRoaXMub25tZXNzYWdlLmJpbmQodGhpcylcclxuXHJcbiAgdGhpcy5taWRpTWVzc2FnZUhhbmRsZXIgPSBuZXcgTWlkaU1lc3NhZ2VIYW5kbGVyKClcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMucmVhZHkgPSB0cnVlXHJcbiAgfS5iaW5kKHRoaXMpLCBmYWxzZSlcclxufVxyXG5cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24odXJsKSB7XHJcbiAgaWYgKCF0aGlzLnJlYWR5KSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uIG9ubG9hZCgpIHtcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBvbmxvYWQsIGZhbHNlKVxyXG4gICAgICB0aGlzLmxvYWQodXJsKVxyXG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSlcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5sb2FkKHVybClcclxuICB9XHJcbn1cclxuXHJcbldlYk1pZGlMaW5rLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24odXJsKSB7XHJcbiAgLyoqIEB0eXBlIHtYTUxIdHRwUmVxdWVzdH0gKi9cclxuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcclxuXHJcbiAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSlcclxuICB4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJ1xyXG5cclxuICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGV2KSB7XHJcbiAgICAvKiogQHR5cGUge1hNTEh0dHBSZXF1ZXN0fSAqL1xyXG4gICAgdmFyIHhociA9IGV2LnRhcmdldFxyXG5cclxuICAgIHRoaXMub25sb2FkKHhoci5yZXNwb25zZSlcclxuICAgIGlmICh0eXBlb2YgdGhpcy5sb2FkQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy5sb2FkQ2FsbGJhY2soeGhyLnJlc3BvbnNlKVxyXG4gICAgfVxyXG4gIH0uYmluZCh0aGlzKSwgZmFsc2UpXHJcblxyXG4gIHhoci5zZW5kKClcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7QXJyYXlCdWZmZXJ9IHJlc3BvbnNlXHJcbiAqL1xyXG5XZWJNaWRpTGluay5wcm90b3R5cGUub25sb2FkID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAvKiogQHR5cGUge1VpbnQ4QXJyYXl9ICovXHJcbiAgdmFyIGlucHV0ID0gbmV3IFVpbnQ4QXJyYXkocmVzcG9uc2UpXHJcblxyXG4gIHRoaXMubG9hZFNvdW5kRm9udChpbnB1dClcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7VWludDhBcnJheX0gaW5wdXRcclxuICovXHJcbldlYk1pZGlMaW5rLnByb3RvdHlwZS5sb2FkU291bmRGb250ID0gZnVuY3Rpb24oaW5wdXQpIHtcclxuICAvKiogQHR5cGUge1N5bnRoZXNpemVyfSAqL1xyXG4gIHZhciBzeW50aFxyXG5cclxuICBpZiAoIXRoaXMuc3ludGgpIHtcclxuICAgIHN5bnRoID0gdGhpcy5zeW50aCA9IG5ldyBTeW50aGVzaXplcihpbnB1dClcclxuICAgIHZhciB2aWV3ID0gdGhpcy52aWV3ID0gbmV3IFZpZXcoKVxyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3LmRyYXcoc3ludGgpKVxyXG4gICAgdGhpcy5taWRpTWVzc2FnZUhhbmRsZXIuc3ludGggPSBzeW50aFxyXG4gICAgc3ludGguaW5pdCgpXHJcbiAgICBzeW50aC5zdGFydCgpXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMubWVzc2FnZUhhbmRsZXIsIGZhbHNlKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBzeW50aCA9IHRoaXMuc3ludGhcclxuICAgIHN5bnRoLnJlZnJlc2hJbnN0cnVtZW50cyhpbnB1dClcclxuICB9XHJcblxyXG4gIC8vIGxpbmsgcmVhZHlcclxuICBpZiAod2luZG93Lm9wZW5lcikge1xyXG4gICAgd2luZG93Lm9wZW5lci5wb3N0TWVzc2FnZShcImxpbmsscmVhZHlcIiwgJyonKVxyXG4gIH0gZWxzZSBpZiAod2luZG93LnBhcmVudCAhPT0gd2luZG93KSB7XHJcbiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKFwibGluayxyZWFkeVwiLCAnKicpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtFdmVudH0gZXZcclxuICovXHJcbldlYk1pZGlMaW5rLnByb3RvdHlwZS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldikge1xyXG4gIHZhciBtc2cgPSBldi5kYXRhLnNwbGl0KCcsJylcclxuICB2YXIgdHlwZSA9IG1zZy5zaGlmdCgpXHJcbiAgdmFyIGNvbW1hbmRcclxuXHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlICdtaWRpJzpcclxuICAgICAgdGhpcy5taWRpTWVzc2FnZUhhbmRsZXIucHJvY2Vzc01pZGlNZXNzYWdlKFxyXG4gICAgICAgIG1zZy5tYXAoZnVuY3Rpb24oaGV4KSB7XHJcbiAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoaGV4LCAxNilcclxuICAgICAgICB9KVxyXG4gICAgICApXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdsaW5rJzpcclxuICAgICAgY29tbWFuZCA9IG1zZy5zaGlmdCgpXHJcbiAgICAgIHN3aXRjaCAoY29tbWFuZCkge1xyXG4gICAgICAgIGNhc2UgJ3JlcXBhdGNoJzpcclxuICAgICAgICAgIC8vIFRPRE86IGR1bW15IGRhdGFcclxuICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuZXIucG9zdE1lc3NhZ2UoXCJsaW5rLHBhdGNoXCIsICcqJylcclxuICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LnBhcmVudCAhPT0gd2luZG93KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoXCJsaW5rLHBhdGNoXCIsICcqJylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAnc2V0cGF0Y2gnOlxyXG4gICAgICAgICAgLy8gVE9ETzogTk9QXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCd1bmtub3duIGxpbmsgbWVzc2FnZTonLCBjb21tYW5kKVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgICBicmVha1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgY29uc29sZS5lcnJvcigndW5rbm93biBtZXNzYWdlIHR5cGUnKVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oQXJyYXlCdWZmZXIpfSBjYWxsYmFja1xyXG4gKi9cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLnNldExvYWRDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdGhpcy5sb2FkQ2FsbGJhY2sgPSBjYWxsYmFja1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBXZWJNaWRpTGlua1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvV2ViTWlkaUxpbmsudHMiLCJpbXBvcnQgU3ludGhlc2l6ZXJOb3RlIGZyb20gXCIuL1N5bnRoZXNpemVyTm90ZVwiXHJcbmltcG9ydCBwYXJzZSBmcm9tIFwiLi9QYXJzZXJcIlxyXG5pbXBvcnQgU291bmRGb250IGZyb20gXCIuL1NvdW5kRm9udFwiXHJcbmltcG9ydCB7IEluc3RydW1lbnRTdGF0ZSB9IGZyb20gXCIuL1N5bnRoZXNpemVyTm90ZVwiXHJcblxyXG5jb25zdCBCQVNFX1ZPTFVNRSA9IDAuNFxyXG5cclxuY2xhc3MgQ2hhbm5lbCB7XHJcbiAgaW5zdHJ1bWVudCA9IDBcclxuICB2b2x1bWUgPSAwXHJcbiAgcGl0Y2hCZW5kID0gMFxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5ID0gMFxyXG4gIHBhbnBvdCA9IDBcclxuICBjdXJyZW50Tm90ZU9uOiBTeW50aGVzaXplck5vdGVbXSA9IFtdXHJcbn1cclxuXHJcbmludGVyZmFjZSBWaWV3IHtcclxuICBkcmF3KClcclxuICByZW1vdmUoKVxyXG4gIGdldEluc3RydW1lbnRFbGVtZW50KClcclxuICBnZXRLZXlFbGVtZW50KClcclxuICBub3RlT24oY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlcilcclxuICBub3RlT2ZmKGNoYW5uZWxOdW1iZXI6IG51bWJlciwga2V5OiBudW1iZXIpXHJcbiAgcHJvZ3JhbUNoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIGluc3RydW1lbnQ6IG51bWJlcilcclxuICB2b2x1bWVDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCB2b2x1bWU6IG51bWJlcilcclxuICBwYW5wb3RDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBwYW5wb3Q6IG51bWJlcilcclxuICBwaXRjaEJlbmQoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBwaXRjaEJlbmQ6IG51bWJlcilcclxuICBwaXRjaEJlbmRTZW5zaXRpdml0eShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHNlbnNpdGl2aXR5OiBudW1iZXIpXHJcbn1cclxuXHJcbmNsYXNzIER1bW15VmlldyBpbXBsZW1lbnRzIFZpZXcge1xyXG4gIGRyYXcoKSB7IH1cclxuICByZW1vdmUoKSB7IH1cclxuICBnZXRJbnN0cnVtZW50RWxlbWVudCgpIHsgfVxyXG4gIGdldEtleUVsZW1lbnQoKSB7IH1cclxuICBub3RlT24oKSB7IH1cclxuICBub3RlT2ZmKCkgeyB9XHJcbiAgcHJvZ3JhbUNoYW5nZSgpIHsgfVxyXG4gIHZvbHVtZUNoYW5nZSgpIHsgfVxyXG4gIHBhbnBvdENoYW5nZSgpIHsgfVxyXG4gIHBpdGNoQmVuZCgpIHsgfVxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5KCkgeyB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bnRoZXNpemVyIHtcclxuICBiYW5rOiBudW1iZXIgPSAwXHJcbiAgYnVmZmVyU2l6ZTogbnVtYmVyID0gMTAyNFxyXG4gIGN0eDogQXVkaW9Db250ZXh0XHJcbiAgZ2Fpbk1hc3RlcjogR2Fpbk5vZGVcclxuICBjaGFubmVsczogQ2hhbm5lbFtdID0gW11cclxuICBtYXN0ZXJWb2x1bWU6IG51bWJlciA9IDEuMFxyXG4gIHZpZXc6IFZpZXcgPSBuZXcgRHVtbXlWaWV3KClcclxuICBzb3VuZEZvbnQ6IFNvdW5kRm9udFxyXG5cclxuICBjb25zdHJ1Y3RvcihjdHgpIHtcclxuICAgIHRoaXMuY3R4ID0gY3R4XHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIgPSB0aGlzLmN0eC5jcmVhdGVHYWluKClcclxuICAgIHRoaXMuc2V0TWFzdGVyVm9sdW1lKHRoaXMubWFzdGVyVm9sdW1lKVxyXG4gICAgdGhpcy5pbml0KClcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcclxuICAgICAgdGhpcy5jaGFubmVscy5wdXNoKG5ldyBDaGFubmVsKCkpXHJcbiAgICAgIHRoaXMucHJvZ3JhbUNoYW5nZShpLCBpICE9PSA5ID8gaSA6IDApXHJcbiAgICAgIHRoaXMudm9sdW1lQ2hhbmdlKGksIDB4NjQpXHJcbiAgICAgIHRoaXMucGFucG90Q2hhbmdlKGksIDB4NDApXHJcbiAgICAgIHRoaXMucGl0Y2hCZW5kKGksIDB4MDAsIDB4NDApOyAvLyA4MTkyXHJcbiAgICAgIHRoaXMucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoaSwgMilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlZnJlc2hJbnN0cnVtZW50cyhpbnB1dDogVWludDhBcnJheSkge1xyXG4gICAgY29uc3QgcGFyc2VyID0gcGFyc2UoaW5wdXQpXHJcbiAgICB0aGlzLnNvdW5kRm9udCA9IG5ldyBTb3VuZEZvbnQocGFyc2VyKVxyXG4gIH1cclxuXHJcbiAgY29ubmVjdChkZXN0aW5hdGlvbikge1xyXG4gICAgdGhpcy5nYWluTWFzdGVyLmNvbm5lY3QoZGVzdGluYXRpb24pXHJcbiAgfVxyXG5cclxuICBzZXRNYXN0ZXJWb2x1bWUodm9sdW1lKSB7XHJcbiAgICB0aGlzLm1hc3RlclZvbHVtZSA9IHZvbHVtZVxyXG4gICAgdGhpcy5nYWluTWFzdGVyLmdhaW4udmFsdWUgPSBCQVNFX1ZPTFVNRSAqIHZvbHVtZSAvIDB4ODAwMFxyXG4gIH1cclxuXHJcbiAgbm90ZU9uKGNoYW5uZWxOdW1iZXI6IG51bWJlciwga2V5OiBudW1iZXIsIHZlbG9jaXR5OiBudW1iZXIpIHtcclxuICAgIGlmICghdGhpcy5zb3VuZEZvbnQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBjb25zdCBiYW5rTnVtYmVyID0gY2hhbm5lbE51bWJlciA9PT0gOSA/IDEyOCA6IHRoaXMuYmFua1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl1cclxuXHJcbiAgICBjb25zdCBub3RlSW5mbyA9IHRoaXMuc291bmRGb250LmdldEluc3RydW1lbnRLZXkoYmFua051bWJlciwgY2hhbm5lbC5pbnN0cnVtZW50LCBrZXksIHZlbG9jaXR5KVxyXG5cclxuICAgIGlmICghbm90ZUluZm8pIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHBhbnBvdCA9IGNoYW5uZWwucGFucG90IC0gNjRcclxuICAgIHBhbnBvdCAvPSBwYW5wb3QgPCAwID8gNjQgOiA2M1xyXG5cclxuICAgIC8vIGNyZWF0ZSBub3RlIGluZm9ybWF0aW9uXHJcbiAgICBjb25zdCBpbnN0cnVtZW50S2V5OiBJbnN0cnVtZW50U3RhdGUgPSB7XHJcbiAgICAgIGNoYW5uZWw6IGNoYW5uZWxOdW1iZXIsXHJcbiAgICAgIGtleToga2V5LFxyXG4gICAgICB2ZWxvY2l0eTogdmVsb2NpdHksXHJcbiAgICAgIHBhbnBvdDogcGFucG90LFxyXG4gICAgICB2b2x1bWU6IGNoYW5uZWwudm9sdW1lIC8gMTI3LFxyXG4gICAgICBwaXRjaEJlbmQ6IGNoYW5uZWwucGl0Y2hCZW5kIC0gMHgyMDAwLFxyXG4gICAgICBwaXRjaEJlbmRTZW5zaXRpdml0eTogY2hhbm5lbC5waXRjaEJlbmRTZW5zaXRpdml0eVxyXG4gICAgfVxyXG5cclxuICAgIC8vIG5vdGUgb25cclxuICAgIGNvbnN0IG5vdGUgPSBuZXcgU3ludGhlc2l6ZXJOb3RlKHRoaXMuY3R4LCB0aGlzLmdhaW5NYXN0ZXIsIG5vdGVJbmZvLCBpbnN0cnVtZW50S2V5KVxyXG4gICAgbm90ZS5ub3RlT24oKVxyXG4gICAgY2hhbm5lbC5jdXJyZW50Tm90ZU9uLnB1c2gobm90ZSlcclxuXHJcbiAgICB0aGlzLnZpZXcubm90ZU9uKGNoYW5uZWxOdW1iZXIsIGtleSlcclxuICB9XHJcblxyXG4gIG5vdGVPZmYoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlciwgX3ZlbG9jaXR5OiBudW1iZXIpIHtcclxuICAgIGlmICghdGhpcy5zb3VuZEZvbnQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBjb25zdCBiYW5rTnVtYmVyID0gY2hhbm5lbE51bWJlciA9PT0gOSA/IDEyOCA6IHRoaXMuYmFua1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl1cclxuXHJcbiAgICBjb25zdCBpbnN0cnVtZW50S2V5ID0gdGhpcy5zb3VuZEZvbnQuZ2V0SW5zdHJ1bWVudEtleShiYW5rTnVtYmVyLCBjaGFubmVsLmluc3RydW1lbnQsIGtleSlcclxuXHJcbiAgICBpZiAoIWluc3RydW1lbnRLZXkpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3VycmVudE5vdGVPbiA9IGNoYW5uZWwuY3VycmVudE5vdGVPblxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGN1cnJlbnROb3RlT24ubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgICBjb25zdCBub3RlID0gY3VycmVudE5vdGVPbltpXVxyXG4gICAgICBpZiAobm90ZS5rZXkgPT09IGtleSkge1xyXG4gICAgICAgIG5vdGUubm90ZU9mZigpXHJcbiAgICAgICAgY3VycmVudE5vdGVPbi5zcGxpY2UoaSwgMSlcclxuICAgICAgICAtLWlcclxuICAgICAgICAtLWlsXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXcubm90ZU9mZihjaGFubmVsTnVtYmVyLCBrZXkpXHJcbiAgfVxyXG5cclxuICBwcm9ncmFtQ2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgaW5zdHJ1bWVudDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnZpZXcucHJvZ3JhbUNoYW5nZShjaGFubmVsTnVtYmVyLCBpbnN0cnVtZW50KVxyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS5pbnN0cnVtZW50ID0gaW5zdHJ1bWVudFxyXG4gIH1cclxuXHJcbiAgdm9sdW1lQ2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgdm9sdW1lOiBudW1iZXIpIHtcclxuICAgIHRoaXMudmlldy52b2x1bWVDaGFuZ2UoY2hhbm5lbE51bWJlciwgdm9sdW1lKVxyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS52b2x1bWUgPSB2b2x1bWVcclxuICB9XHJcblxyXG4gIHBhbnBvdENoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHBhbnBvdDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnZpZXcucGFucG90Q2hhbmdlKGNoYW5uZWxOdW1iZXIsIHBhbnBvdClcclxuICAgIHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl0ucGFucG90ID0gcGFucG90XHJcbiAgfVxyXG5cclxuICBwaXRjaEJlbmQoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBsb3dlckJ5dGU6IG51bWJlciwgaGlnaGVyQnl0ZTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBiZW5kID0gKGxvd2VyQnl0ZSAmIDB4N2YpIHwgKChoaWdoZXJCeXRlICYgMHg3ZikgPDwgNylcclxuICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdXHJcbiAgICBjb25zdCBjdXJyZW50Tm90ZU9uID0gY2hhbm5lbC5jdXJyZW50Tm90ZU9uXHJcbiAgICBjb25zdCBjYWxjdWxhdGVkID0gYmVuZCAtIDB4MjAwMFxyXG5cclxuICAgIHRoaXMudmlldy5waXRjaEJlbmQoY2hhbm5lbE51bWJlciwgY2FsY3VsYXRlZClcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBjdXJyZW50Tm90ZU9uLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgY3VycmVudE5vdGVPbltpXS51cGRhdGVQaXRjaEJlbmQoY2FsY3VsYXRlZClcclxuICAgIH1cclxuXHJcbiAgICBjaGFubmVsLnBpdGNoQmVuZCA9IGJlbmRcclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWxOdW1iZXI6IG51bWJlciwgc2Vuc2l0aXZpdHk6IG51bWJlcikge1xyXG4gICAgdGhpcy52aWV3LnBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWxOdW1iZXIsIHNlbnNpdGl2aXR5KVxyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS5waXRjaEJlbmRTZW5zaXRpdml0eSA9IHNlbnNpdGl2aXR5XHJcbiAgfVxyXG5cclxuICBhbGxTb3VuZE9mZihjaGFubmVsTnVtYmVyOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGN1cnJlbnROb3RlT24gPSB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLmN1cnJlbnROb3RlT25cclxuXHJcbiAgICB3aGlsZSAoY3VycmVudE5vdGVPbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMubm90ZU9mZihjaGFubmVsTnVtYmVyLCBjdXJyZW50Tm90ZU9uWzBdLmtleSwgMClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlc2V0QWxsQ29udHJvbChjaGFubmVsTnVtYmVyOiBudW1iZXIpIHtcclxuICAgIHRoaXMucGl0Y2hCZW5kKGNoYW5uZWxOdW1iZXIsIDB4MDAsIDB4NDApOyAvLyA4MTkyXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TeW50aGVzaXplci50cyIsImltcG9ydCB7IE5vdGVJbmZvIH0gZnJvbSBcIi4vU291bmRGb250XCJcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSW5zdHJ1bWVudFN0YXRlIHtcclxuICBjaGFubmVsOiBudW1iZXJcclxuICBrZXk6IG51bWJlclxyXG4gIHZvbHVtZTogbnVtYmVyXHJcbiAgcGFucG90OiBudW1iZXJcclxuICB2ZWxvY2l0eTogbnVtYmVyXHJcbiAgcGl0Y2hCZW5kOiBudW1iZXJcclxuICBwaXRjaEJlbmRTZW5zaXRpdml0eTogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bnRoZXNpemVyTm90ZSB7XHJcblxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgLy8gYXVkaW8gbm9kZVxyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIGF1ZGlvQnVmZmVyOiBBdWRpb0J1ZmZlclxyXG4gIGJ1ZmZlclNvdXJjZTogQXVkaW9CdWZmZXJTb3VyY2VOb2RlXHJcbiAgcGFubmVyOiBQYW5uZXJOb2RlXHJcbiAgZ2Fpbk91dHB1dDogR2Fpbk5vZGVcclxuICBjdHg6IEF1ZGlvQ29udGV4dFxyXG4gIGRlc3RpbmF0aW9uOiBBdWRpb05vZGVcclxuICBmaWx0ZXI6IEJpcXVhZEZpbHRlck5vZGVcclxuICBub3RlSW5mbzogTm90ZUluZm9cclxuICBpbnN0cnVtZW50OiBJbnN0cnVtZW50U3RhdGVcclxuICBjaGFubmVsOiBudW1iZXJcclxuICBrZXk6IG51bWJlclxyXG4gIHZlbG9jaXR5OiBudW1iZXJcclxuICBwbGF5YmFja1JhdGU6IG51bWJlclxyXG4gIHZvbHVtZTogbnVtYmVyXHJcbiAgcGFucG90OiBudW1iZXJcclxuICBwaXRjaEJlbmQ6IG51bWJlclxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5OiBudW1iZXJcclxuXHJcbiAgLy8gc3RhdGVcclxuICBzdGFydFRpbWU6IG51bWJlclxyXG4gIGNvbXB1dGVkUGxheWJhY2tSYXRlOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IoY3R4OiBBdWRpb0NvbnRleHQsIGRlc3RpbmF0aW9uOiBBdWRpb05vZGUsIG5vdGVJbmZvOiBOb3RlSW5mbywgaW5zdHJ1bWVudDogSW5zdHJ1bWVudFN0YXRlKSB7XHJcbiAgICB0aGlzLmN0eCA9IGN0eFxyXG4gICAgdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uXHJcbiAgICB0aGlzLm5vdGVJbmZvID0gbm90ZUluZm9cclxuICAgIHRoaXMucGxheWJhY2tSYXRlID0gbm90ZUluZm8ucGxheWJhY2tSYXRlKGluc3RydW1lbnQua2V5KVxyXG4gICAgdGhpcy5pbnN0cnVtZW50ID0gaW5zdHJ1bWVudFxyXG4gICAgdGhpcy5jaGFubmVsID0gaW5zdHJ1bWVudC5jaGFubmVsXHJcbiAgICB0aGlzLmtleSA9IGluc3RydW1lbnQua2V5XHJcbiAgICB0aGlzLnZlbG9jaXR5ID0gaW5zdHJ1bWVudC52ZWxvY2l0eVxyXG4gICAgdGhpcy52b2x1bWUgPSBpbnN0cnVtZW50LnZvbHVtZVxyXG4gICAgdGhpcy5wYW5wb3QgPSBpbnN0cnVtZW50LnBhbnBvdFxyXG4gICAgdGhpcy5waXRjaEJlbmQgPSBpbnN0cnVtZW50LnBpdGNoQmVuZFxyXG4gICAgdGhpcy5waXRjaEJlbmRTZW5zaXRpdml0eSA9IGluc3RydW1lbnQucGl0Y2hCZW5kU2Vuc2l0aXZpdHlcclxuICAgIHRoaXMuc3RhcnRUaW1lID0gY3R4LmN1cnJlbnRUaW1lXHJcbiAgICB0aGlzLmNvbXB1dGVkUGxheWJhY2tSYXRlID0gdGhpcy5wbGF5YmFja1JhdGVcclxuICB9XHJcblxyXG4gIG5vdGVPbigpIHtcclxuICAgIGNvbnN0IHsgY3R4LCBub3RlSW5mbyB9ID0gdGhpc1xyXG5cclxuICAgIGNvbnN0IHNhbXBsZSA9IG5vdGVJbmZvLnNhbXBsZS5zdWJhcnJheSgwLCBub3RlSW5mby5zYW1wbGUubGVuZ3RoICsgbm90ZUluZm8uZW5kKVxyXG4gICAgdGhpcy5hdWRpb0J1ZmZlciA9IGN0eC5jcmVhdGVCdWZmZXIoMSwgc2FtcGxlLmxlbmd0aCwgbm90ZUluZm8uc2FtcGxlUmF0ZSlcclxuXHJcbiAgICBjb25zdCBjaGFubmVsRGF0YSA9IHRoaXMuYXVkaW9CdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMClcclxuICAgIGNoYW5uZWxEYXRhLnNldChzYW1wbGUpXHJcblxyXG4gICAgLy8gYnVmZmVyIHNvdXJjZVxyXG4gICAgY29uc3QgYnVmZmVyU291cmNlID0gY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpXHJcbiAgICBidWZmZXJTb3VyY2UuYnVmZmVyID0gdGhpcy5hdWRpb0J1ZmZlclxyXG4gICAgYnVmZmVyU291cmNlLmxvb3AgPSAodGhpcy5jaGFubmVsICE9PSA5KVxyXG4gICAgYnVmZmVyU291cmNlLmxvb3BTdGFydCA9IG5vdGVJbmZvLmxvb3BTdGFydCAvIG5vdGVJbmZvLnNhbXBsZVJhdGVcclxuICAgIGJ1ZmZlclNvdXJjZS5sb29wRW5kID0gbm90ZUluZm8ubG9vcEVuZCAvIG5vdGVJbmZvLnNhbXBsZVJhdGVcclxuICAgIGJ1ZmZlclNvdXJjZS5vbmVuZGVkID0gKCkgPT4gdGhpcy5kaXNjb25uZWN0KClcclxuICAgIHRoaXMuYnVmZmVyU291cmNlID0gYnVmZmVyU291cmNlXHJcbiAgICB0aGlzLnVwZGF0ZVBpdGNoQmVuZCh0aGlzLnBpdGNoQmVuZClcclxuXHJcbiAgICAvLyBhdWRpbyBub2RlXHJcbiAgICBjb25zdCBwYW5uZXIgPSB0aGlzLnBhbm5lciA9IGN0eC5jcmVhdGVQYW5uZXIoKVxyXG4gICAgY29uc3Qgb3V0cHV0ID0gdGhpcy5nYWluT3V0cHV0ID0gY3R4LmNyZWF0ZUdhaW4oKVxyXG4gICAgY29uc3Qgb3V0cHV0R2FpbiA9IG91dHB1dC5nYWluXHJcblxyXG4gICAgLy8gZmlsdGVyXHJcbiAgICBjb25zdCBmaWx0ZXIgPSBjdHguY3JlYXRlQmlxdWFkRmlsdGVyKClcclxuICAgIGZpbHRlci50eXBlID0gXCJsb3dwYXNzXCJcclxuICAgIHRoaXMuZmlsdGVyID0gZmlsdGVyXHJcblxyXG4gICAgLy8gcGFucG90XHJcbiAgICBwYW5uZXIucGFubmluZ01vZGVsID0gXCJlcXVhbHBvd2VyXCJcclxuICAgIHBhbm5lci5zZXRQb3NpdGlvbihcclxuICAgICAgTWF0aC5zaW4odGhpcy5wYW5wb3QgKiBNYXRoLlBJIC8gMiksXHJcbiAgICAgIDAsXHJcbiAgICAgIE1hdGguY29zKHRoaXMucGFucG90ICogTWF0aC5QSSAvIDIpXHJcbiAgICApXHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIEF0dGFjaywgRGVjYXksIFN1c3RhaW5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBjb25zdCBub3cgPSB0aGlzLmN0eC5jdXJyZW50VGltZVxyXG4gICAgY29uc3Qgdm9sQXR0YWNrVGltZSA9IG5vdyArIG5vdGVJbmZvLnZvbEF0dGFja1xyXG4gICAgY29uc3QgbW9kQXR0YWNrVGltZSA9IG5vdyArIG5vdGVJbmZvLm1vZEF0dGFja1xyXG4gICAgY29uc3Qgdm9sRGVjYXkgPSB2b2xBdHRhY2tUaW1lICsgbm90ZUluZm8udm9sRGVjYXlcclxuICAgIGNvbnN0IG1vZERlY2F5ID0gbW9kQXR0YWNrVGltZSArIG5vdGVJbmZvLm1vZERlY2F5XHJcbiAgICBjb25zdCBzdGFydFRpbWUgPSBub3RlSW5mby5zdGFydCAvIG5vdGVJbmZvLnNhbXBsZVJhdGVcclxuXHJcbiAgICBjb25zdCBhdHRhY2tWb2x1bWUgPSB0aGlzLnZvbHVtZSAqICh0aGlzLnZlbG9jaXR5IC8gMTI3KVxyXG4gICAgb3V0cHV0R2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCBub3cpXHJcbiAgICBvdXRwdXRHYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGF0dGFja1ZvbHVtZSwgdm9sQXR0YWNrVGltZSlcclxuICAgIG91dHB1dEdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoYXR0YWNrVm9sdW1lICogKDEgLSBub3RlSW5mby52b2xTdXN0YWluKSwgdm9sRGVjYXkpXHJcblxyXG4gICAgZmlsdGVyLlEuc2V0VmFsdWVBdFRpbWUobm90ZUluZm8uaW5pdGlhbEZpbHRlclEgLyAxMCwgbm93KVxyXG4gICAgY29uc3QgYmFzZUZyZXEgPSBhbW91bnRUb0ZyZXEobm90ZUluZm8uaW5pdGlhbEZpbHRlckZjKVxyXG4gICAgY29uc3QgcGVla0ZyZXEgPSBhbW91bnRUb0ZyZXEobm90ZUluZm8uaW5pdGlhbEZpbHRlckZjICsgbm90ZUluZm8ubW9kRW52VG9GaWx0ZXJGYylcclxuICAgIGNvbnN0IHN1c3RhaW5GcmVxID0gYmFzZUZyZXEgKyAocGVla0ZyZXEgLSBiYXNlRnJlcSkgKiAoMSAtIG5vdGVJbmZvLm1vZFN1c3RhaW4pXHJcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGJhc2VGcmVxLCBub3cpXHJcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHBlZWtGcmVxLCBtb2RBdHRhY2tUaW1lKVxyXG4gICAgZmlsdGVyLmZyZXF1ZW5jeS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShzdXN0YWluRnJlcSwgbW9kRGVjYXkpXHJcblxyXG4gICAgZnVuY3Rpb24gYW1vdW50VG9GcmVxKHZhbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIE1hdGgucG93KDIsICh2YWwgLSA2OTAwKSAvIDEyMDApICogNDQwXHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29ubmVjdFxyXG4gICAgYnVmZmVyU291cmNlLmNvbm5lY3QoZmlsdGVyKVxyXG4gICAgZmlsdGVyLmNvbm5lY3QocGFubmVyKVxyXG4gICAgcGFubmVyLmNvbm5lY3Qob3V0cHV0KVxyXG4gICAgb3V0cHV0LmNvbm5lY3QodGhpcy5kZXN0aW5hdGlvbilcclxuXHJcbiAgICAvLyBmaXJlXHJcbiAgICBidWZmZXJTb3VyY2Uuc3RhcnQoMCwgc3RhcnRUaW1lKVxyXG4gIH1cclxuXHJcbiAgbm90ZU9mZigpIHtcclxuICAgIGNvbnN0IHsgbm90ZUluZm8sIGJ1ZmZlclNvdXJjZSB9ID0gdGhpc1xyXG4gICAgY29uc3Qgb3V0cHV0ID0gdGhpcy5nYWluT3V0cHV0XHJcbiAgICBjb25zdCBub3cgPSB0aGlzLmN0eC5jdXJyZW50VGltZVxyXG4gICAgY29uc3Qgdm9sRW5kVGltZSA9IG5vdyArIG5vdGVJbmZvLnZvbFJlbGVhc2VcclxuICAgIGNvbnN0IG1vZEVuZFRpbWUgPSBub3cgKyBub3RlSW5mby5tb2RSZWxlYXNlXHJcblxyXG4gICAgaWYgKCF0aGlzLmF1ZGlvQnVmZmVyKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8vIGlnbm9yZSBub3RlIG9mZiBmb3Igcmh5dGhtIHRyYWNrXHJcbiAgICBpZiAodGhpcy5jaGFubmVsID09PSA5KSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBSZWxlYXNlXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgb3V0cHV0LmdhaW4uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKDApXHJcbiAgICBvdXRwdXQuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCB2b2xFbmRUaW1lKVxyXG4gICAgYnVmZmVyU291cmNlLnBsYXliYWNrUmF0ZS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoMClcclxuICAgIGJ1ZmZlclNvdXJjZS5wbGF5YmFja1JhdGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodGhpcy5jb21wdXRlZFBsYXliYWNrUmF0ZSwgbW9kRW5kVGltZSlcclxuXHJcbiAgICBidWZmZXJTb3VyY2UubG9vcCA9IGZhbHNlXHJcbiAgICBidWZmZXJTb3VyY2Uuc3RvcCh2b2xFbmRUaW1lKVxyXG4gIH1cclxuXHJcbiAgZGlzY29ubmVjdCgpIHtcclxuICAgIHRoaXMuYnVmZmVyU291cmNlLmRpc2Nvbm5lY3QoMClcclxuICAgIHRoaXMucGFubmVyLmRpc2Nvbm5lY3QoMClcclxuICAgIHRoaXMuZ2Fpbk91dHB1dC5kaXNjb25uZWN0KDApXHJcbiAgfVxyXG5cclxuICBzY2hlZHVsZVBsYXliYWNrUmF0ZSgpIHtcclxuICAgIGNvbnN0IHsgbm90ZUluZm8gfSA9IHRoaXNcclxuICAgIGNvbnN0IHBsYXliYWNrUmF0ZSA9IHRoaXMuYnVmZmVyU291cmNlLnBsYXliYWNrUmF0ZVxyXG4gICAgY29uc3QgY29tcHV0ZWQgPSB0aGlzLmNvbXB1dGVkUGxheWJhY2tSYXRlXHJcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhcnRUaW1lXHJcbiAgICBjb25zdCBtb2RBdHRhY2sgPSBzdGFydCArIG5vdGVJbmZvLm1vZEF0dGFja1xyXG4gICAgY29uc3QgbW9kRGVjYXkgPSBtb2RBdHRhY2sgKyBub3RlSW5mby5tb2REZWNheVxyXG4gICAgY29uc3QgcGVla1BpdGNoID0gY29tcHV0ZWQgKiBNYXRoLnBvdyhcclxuICAgICAgTWF0aC5wb3coMiwgMSAvIDEyKSxcclxuICAgICAgbm90ZUluZm8ubW9kRW52VG9QaXRjaCAqIG5vdGVJbmZvLnNjYWxlVHVuaW5nXHJcbiAgICApXHJcblxyXG4gICAgcGxheWJhY2tSYXRlLmNhbmNlbFNjaGVkdWxlZFZhbHVlcygwKVxyXG4gICAgcGxheWJhY2tSYXRlLnNldFZhbHVlQXRUaW1lKGNvbXB1dGVkLCBzdGFydClcclxuICAgIHBsYXliYWNrUmF0ZS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShwZWVrUGl0Y2gsIG1vZEF0dGFjaylcclxuICAgIHBsYXliYWNrUmF0ZS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShjb21wdXRlZCArIChwZWVrUGl0Y2ggLSBjb21wdXRlZCkgKiAoMSAtIG5vdGVJbmZvLm1vZFN1c3RhaW4pLCBtb2REZWNheSlcclxuICB9XHJcblxyXG4gIHVwZGF0ZVBpdGNoQmVuZChwaXRjaEJlbmQ6IG51bWJlcikge1xyXG4gICAgdGhpcy5jb21wdXRlZFBsYXliYWNrUmF0ZSA9IHRoaXMucGxheWJhY2tSYXRlICogTWF0aC5wb3coXHJcbiAgICAgIE1hdGgucG93KDIsIDEgLyAxMiksXHJcbiAgICAgIChcclxuICAgICAgICB0aGlzLnBpdGNoQmVuZFNlbnNpdGl2aXR5ICogKFxyXG4gICAgICAgICAgcGl0Y2hCZW5kIC8gKHBpdGNoQmVuZCA8IDAgPyA4MTkyIDogODE5MSlcclxuICAgICAgICApXHJcbiAgICAgICkgKiB0aGlzLm5vdGVJbmZvLnNjYWxlVHVuaW5nXHJcbiAgICApXHJcbiAgICB0aGlzLnNjaGVkdWxlUGxheWJhY2tSYXRlKClcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N5bnRoZXNpemVyTm90ZS50cyIsImltcG9ydCB7IFBhcnNlUmVzdWx0IH0gZnJvbSBcIi4vUGFyc2VyXCJcclxuaW1wb3J0IHsgSW5zdHJ1bWVudEJhZywgUHJlc2V0QmFnLCBJbnN0cnVtZW50LCBNb2R1bGF0b3JMaXN0LCBQcmVzZXRIZWFkZXIsIFJhbmdlVmFsdWUsIEFtb3VudFZhbHVlIH0gZnJvbSBcIi4vU3RydWN0c1wiXHJcblxyXG4vKipcclxuICogUGFyc2VyIOOBp+iqreOBv+i+vOOCk+OBoOOCteOCpuODs+ODieODleOCqeODs+ODiOOBruODh+ODvOOCv+OCklxyXG4gKiBTeW50aGVzaXplciDjgYvjgonliKnnlKjjgZfjgoTjgZnjgYTlvaLjgavjgZnjgovjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdW5kRm9udCB7XHJcbiAgYmFua1NldDogeyBbaW5kZXg6IG51bWJlcl06IEJhbmsgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihwYXJzZXIpIHtcclxuICAgIHRoaXMuYmFua1NldCA9IGNyZWF0ZUFsbEluc3RydW1lbnRzKHBhcnNlcilcclxuICB9XHJcblxyXG4gIGdldEluc3RydW1lbnRLZXkoYmFua051bWJlciwgaW5zdHJ1bWVudE51bWJlciwga2V5LCB2ZWxvY2l0eSA9IDEwMCkge1xyXG4gICAgY29uc3QgYmFuayA9IHRoaXMuYmFua1NldFtiYW5rTnVtYmVyXVxyXG4gICAgaWYgKCFiYW5rKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICBcImJhbmsgbm90IGZvdW5kOiBiYW5rPSVzIGluc3RydW1lbnQ9JXNcIixcclxuICAgICAgICBiYW5rTnVtYmVyLFxyXG4gICAgICAgIGluc3RydW1lbnROdW1iZXJcclxuICAgICAgKVxyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGluc3RydW1lbnQgPSBiYW5rW2luc3RydW1lbnROdW1iZXJdXHJcbiAgICBpZiAoIWluc3RydW1lbnQpIHtcclxuICAgICAgLy8gVE9ET1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgXCJpbnN0cnVtZW50IG5vdCBmb3VuZDogYmFuaz0lcyBpbnN0cnVtZW50PSVzXCIsXHJcbiAgICAgICAgYmFua051bWJlcixcclxuICAgICAgICBpbnN0cnVtZW50TnVtYmVyXHJcbiAgICAgIClcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbnN0cnVtZW50S2V5ID0gaW5zdHJ1bWVudC5ub3Rlcy5maWx0ZXIoaSA9PiB7XHJcbiAgICAgIGxldCBpc0luS2V5UmFuZ2UgPSBmYWxzZVxyXG4gICAgICBpZiAoaS5rZXlSYW5nZSkge1xyXG4gICAgICAgIGlzSW5LZXlSYW5nZSA9IGtleSA+PSBpLmtleVJhbmdlLmxvICYmIGtleSA8PSBpLmtleVJhbmdlLmhpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBpc0luVmVsUmFuZ2UgPSB0cnVlXHJcbiAgICAgIGlmIChpLnZlbFJhbmdlKSB7XHJcbiAgICAgICAgaXNJblZlbFJhbmdlID0gdmVsb2NpdHkgPj0gaS52ZWxSYW5nZS5sbyAmJiB2ZWxvY2l0eSA8PSBpLnZlbFJhbmdlLmhpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBpc0luS2V5UmFuZ2UgJiYgaXNJblZlbFJhbmdlXHJcbiAgICB9KVswXVxyXG5cclxuICAgIGlmICghaW5zdHJ1bWVudEtleSkge1xyXG4gICAgICAvLyBUT0RPXHJcbiAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICBcImluc3RydW1lbnQgbm90IGZvdW5kOiBiYW5rPSVzIGluc3RydW1lbnQ9JXMga2V5PSVzXCIsXHJcbiAgICAgICAgYmFua051bWJlcixcclxuICAgICAgICBpbnN0cnVtZW50TnVtYmVyLFxyXG4gICAgICAgIGtleVxyXG4gICAgICApXHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGluc3RydW1lbnRLZXlcclxuICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBab25lSW5mbyB7XHJcbiAgZ2VuZXJhdG9yOiBNb2RHZW5cclxuICBnZW5lcmF0b3JTZXF1ZW5jZTogTW9kdWxhdG9yTGlzdFtdXHJcbiAgbW9kdWxhdG9yOiBNb2RHZW4sXHJcbiAgbW9kdWxhdG9yU2VxdWVuY2U6IE1vZHVsYXRvckxpc3RbXVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVJbnN0cnVtZW50KHsgaW5zdHJ1bWVudCwgaW5zdHJ1bWVudFpvbmUsIGluc3RydW1lbnRab25lR2VuZXJhdG9yLCBpbnN0cnVtZW50Wm9uZU1vZHVsYXRvciB9OiBcclxuICB7IGluc3RydW1lbnQ6IEluc3RydW1lbnRbXSwgXHJcbiAgICBpbnN0cnVtZW50Wm9uZTogSW5zdHJ1bWVudEJhZ1tdLCBcclxuICAgIGluc3RydW1lbnRab25lR2VuZXJhdG9yOiBNb2R1bGF0b3JMaXN0W10sIFxyXG4gICAgaW5zdHJ1bWVudFpvbmVNb2R1bGF0b3I6IE1vZHVsYXRvckxpc3RbXSBcclxuICB9KSB7XHJcbiAgY29uc3Qgem9uZSA9IGluc3RydW1lbnRab25lXHJcbiAgY29uc3Qgb3V0cHV0OiB7IG5hbWU6IHN0cmluZywgaW5mbzogWm9uZUluZm9bXSB9W10gPSBbXVxyXG5cclxuICAvLyBpbnN0cnVtZW50IC0+IGluc3RydW1lbnQgYmFnIC0+IGdlbmVyYXRvciAvIG1vZHVsYXRvclxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5zdHJ1bWVudC5sZW5ndGg7ICsraSkge1xyXG4gICAgY29uc3QgYmFnSW5kZXggPSBpbnN0cnVtZW50W2ldLmluc3RydW1lbnRCYWdJbmRleFxyXG4gICAgY29uc3QgYmFnSW5kZXhFbmQgPSBpbnN0cnVtZW50W2kgKyAxXSA/IGluc3RydW1lbnRbaSArIDFdLmluc3RydW1lbnRCYWdJbmRleCA6IHpvbmUubGVuZ3RoXHJcbiAgICBjb25zdCB6b25lSW5mbzogWm9uZUluZm9bXSA9IFtdXHJcblxyXG4gICAgLy8gaW5zdHJ1bWVudCBiYWdcclxuICAgIGZvciAobGV0IGogPSBiYWdJbmRleDsgaiA8IGJhZ0luZGV4RW5kOyArK2opIHtcclxuICAgICAgY29uc3QgaW5zdHJ1bWVudEdlbmVyYXRvciA9IGNyZWF0ZUluc3RydW1lbnRHZW5lcmF0b3Ioem9uZSwgaiwgaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3IpXHJcbiAgICAgIGNvbnN0IGluc3RydW1lbnRNb2R1bGF0b3IgPSBjcmVhdGVJbnN0cnVtZW50TW9kdWxhdG9yKHpvbmUsIGosIGluc3RydW1lbnRab25lTW9kdWxhdG9yKVxyXG5cclxuICAgICAgem9uZUluZm8ucHVzaCh7XHJcbiAgICAgICAgZ2VuZXJhdG9yOiBpbnN0cnVtZW50R2VuZXJhdG9yLmdlbmVyYXRvcixcclxuICAgICAgICBnZW5lcmF0b3JTZXF1ZW5jZTogaW5zdHJ1bWVudEdlbmVyYXRvci5nZW5lcmF0b3JJbmZvLFxyXG4gICAgICAgIG1vZHVsYXRvcjogaW5zdHJ1bWVudE1vZHVsYXRvci5tb2R1bGF0b3IsXHJcbiAgICAgICAgbW9kdWxhdG9yU2VxdWVuY2U6IGluc3RydW1lbnRNb2R1bGF0b3IubW9kdWxhdG9ySW5mb1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIG91dHB1dC5wdXNoKHtcclxuICAgICAgbmFtZTogaW5zdHJ1bWVudFtpXS5pbnN0cnVtZW50TmFtZSxcclxuICAgICAgaW5mbzogem9uZUluZm9cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0cHV0XHJcbn1cclxuXHJcbmludGVyZmFjZSBQcmVzZXRJbmZvIHtcclxuICBwcmVzZXRHZW5lcmF0b3I6IHsgZ2VuZXJhdG9yOiBNb2RHZW4sIGdlbmVyYXRvckluZm86IE1vZHVsYXRvckxpc3RbXSB9XHJcbiAgcHJlc2V0TW9kdWxhdG9yOiB7IG1vZHVsYXRvcjogTW9kR2VuLCBtb2R1bGF0b3JJbmZvOiBNb2R1bGF0b3JMaXN0W10gfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQcmVzZXQoeyBwcmVzZXRIZWFkZXIsIHByZXNldFpvbmUsIHByZXNldFpvbmVHZW5lcmF0b3IsIHByZXNldFpvbmVNb2R1bGF0b3IgfToge1xyXG4gIHByZXNldEhlYWRlcjogUHJlc2V0SGVhZGVyW10sXHJcbiAgcHJlc2V0Wm9uZTogUHJlc2V0QmFnW10sXHJcbiAgcHJlc2V0Wm9uZUdlbmVyYXRvcjogTW9kdWxhdG9yTGlzdFtdLFxyXG4gIHByZXNldFpvbmVNb2R1bGF0b3I6IE1vZHVsYXRvckxpc3RbXVxyXG59KToge1xyXG4gIGluZm86IFByZXNldEluZm9bXSwgXHJcbiAgaGVhZGVyOiBQcmVzZXRIZWFkZXJcclxufVtdIHtcclxuICAvLyBwcmVzZXQgLT4gcHJlc2V0IGJhZyAtPiBnZW5lcmF0b3IgLyBtb2R1bGF0b3JcclxuICByZXR1cm4gcHJlc2V0SGVhZGVyLm1hcCgocHJlc2V0LCBpKSA9PiB7XHJcbiAgICBjb25zdCBuZXh0UHJlc2V0ID0gcHJlc2V0SGVhZGVyW2kgKyAxXVxyXG4gICAgY29uc3QgYmFnSW5kZXggPSBwcmVzZXQucHJlc2V0QmFnSW5kZXhcclxuICAgIGNvbnN0IGJhZ0luZGV4RW5kID0gbmV4dFByZXNldCA/IG5leHRQcmVzZXQucHJlc2V0QmFnSW5kZXggOiBwcmVzZXRab25lLmxlbmd0aFxyXG4gICAgY29uc3Qgem9uZUluZm86IFByZXNldEluZm9bXSA9IFtdXHJcblxyXG4gICAgLy8gcHJlc2V0IGJhZ1xyXG4gICAgZm9yIChsZXQgaiA9IGJhZ0luZGV4LCBqbCA9IGJhZ0luZGV4RW5kOyBqIDwgamw7ICsraikge1xyXG4gICAgICB6b25lSW5mby5wdXNoKHtcclxuICAgICAgICBwcmVzZXRHZW5lcmF0b3I6IGNyZWF0ZVByZXNldEdlbmVyYXRvcihwcmVzZXRab25lLCBqLCBwcmVzZXRab25lR2VuZXJhdG9yKSxcclxuICAgICAgICBwcmVzZXRNb2R1bGF0b3I6IGNyZWF0ZVByZXNldE1vZHVsYXRvcihwcmVzZXRab25lLCBqLCBwcmVzZXRab25lTW9kdWxhdG9yKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGluZm86IHpvbmVJbmZvLFxyXG4gICAgICBoZWFkZXI6IHByZXNldFxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmludGVyZmFjZSBCYW5rIHtcclxuICBbaW5kZXg6IG51bWJlcl06IHtcclxuICAgIG5vdGVzOiBOb3RlSW5mb1tdXHJcbiAgICBuYW1lOiBzdHJpbmdcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUFsbEluc3RydW1lbnRzKHBhcnNlcjogUGFyc2VSZXN1bHQpOiB7IFtpbmRleDogbnVtYmVyXTogQmFuayB9IHtcclxuICBjb25zdCBwcmVzZXRzID0gY3JlYXRlUHJlc2V0KHBhcnNlcilcclxuICBjb25zdCBpbnN0cnVtZW50cyA9IGNyZWF0ZUluc3RydW1lbnQocGFyc2VyKVxyXG4gIGNvbnN0IGJhbmtzOiB7IFtpbmRleDogbnVtYmVyXTogQmFuayB9ID0ge31cclxuXHJcbiAgZm9yIChsZXQgcHJlc2V0IG9mIHByZXNldHMpIHtcclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBwcmVzZXQuaGVhZGVyLmJhbmtcclxuICAgIGNvbnN0IHByZXNldE51bWJlciA9IHByZXNldC5oZWFkZXIucHJlc2V0XHJcblxyXG4gICAgY29uc3Qgbm90ZXM6IE5vdGVJbmZvW10gPSBwcmVzZXQuaW5mb1xyXG4gICAgICAubWFwKGluZm8gPT4gaW5mby5wcmVzZXRHZW5lcmF0b3IuZ2VuZXJhdG9yKVxyXG4gICAgICAubWFwKGdlbmVyYXRvciA9PiB7XHJcbiAgICAgICAgaWYgKChnZW5lcmF0b3IgYXMgYW55KS5pbnN0cnVtZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGluc3RydW1lbnROdW1iZXIgPSAoZ2VuZXJhdG9yIGFzIGFueSkuaW5zdHJ1bWVudC5hbW91bnRcclxuICAgICAgICBjb25zdCBpbnN0cnVtZW50ID0gaW5zdHJ1bWVudHNbaW5zdHJ1bWVudE51bWJlcl1cclxuXHJcbiAgICAgICAgLy8gdXNlIHRoZSBmaXJzdCBnZW5lcmF0b3IgaW4gdGhlIHpvbmUgYXMgdGhlIGRlZmF1bHQgdmFsdWVcclxuICAgICAgICBsZXQgYmFzZUdlbmVyYXRvcjogTW9kR2VuXHJcbiAgICAgICAgaWYgKGluc3RydW1lbnQuaW5mb1swXS5nZW5lcmF0b3IpIHtcclxuICAgICAgICAgIGNvbnN0IGdlbmVyYXRvciA9IGluc3RydW1lbnQuaW5mb1swXS5nZW5lcmF0b3JcclxuICAgICAgICAgIGlmICgoZ2VuZXJhdG9yIGFzIGFueSkuc2FtcGxlSUQgPT09IHVuZGVmaW5lZCAmJiBnZW5lcmF0b3Iua2V5UmFuZ2UubG8gPT09IDAgJiYgZ2VuZXJhdG9yLmtleVJhbmdlLmhpID09PSAxMjcpIHtcclxuICAgICAgICAgICAgYmFzZUdlbmVyYXRvciA9IGdlbmVyYXRvclxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdHJ1bWVudC5pbmZvXHJcbiAgICAgICAgICAubWFwKGluZm8gPT4gY3JlYXRlTm90ZUluZm8ocGFyc2VyLCBpbmZvLmdlbmVyYXRvciwgYmFzZUdlbmVyYXRvcikpXHJcbiAgICAgICAgICAuZmlsdGVyKHggPT4geCkgYXMgTm90ZUluZm9bXSAvLyByZW1vdmUgbnVsbFxyXG4gICAgICB9KVxyXG4gICAgICAuZmlsdGVyKHggPT4geCkgLy8gcmVtb3ZlIG51bGxcclxuICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSEuY29uY2F0KGIhKSwgW10pIGFzIE5vdGVJbmZvW10gLy8gZmxhdHRlblxyXG5cclxuICAgIC8vIHNlbGVjdCBiYW5rXHJcbiAgICBpZiAoYmFua3NbYmFua051bWJlcl0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBiYW5rc1tiYW5rTnVtYmVyXSA9IFtdXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYmFuayA9IGJhbmtzW2JhbmtOdW1iZXJdXHJcbiAgICBiYW5rW3ByZXNldE51bWJlcl0gPSB7XHJcbiAgICAgIG5vdGVzLFxyXG4gICAgICBuYW1lOiBwcmVzZXQuaGVhZGVyLnByZXNldE5hbWVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBiYW5rc1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5vdGVJbmZvIHtcclxuICBzYW1wbGU6IEludDE2QXJyYXlcclxuICBzYW1wbGVSYXRlOiBudW1iZXJcclxuICBzYW1wbGVOYW1lOiBzdHJpbmdcclxuICBwbGF5YmFja1JhdGU6IEZ1bmN0aW9uXHJcbiAgc3RhcnQ6IG51bWJlclxyXG4gIGVuZDogbnVtYmVyXHJcbiAgbG9vcFN0YXJ0OiBudW1iZXJcclxuICBsb29wRW5kOiBudW1iZXJcclxuICB2b2xBdHRhY2s6IG51bWJlclxyXG4gIG1vZEF0dGFjazogbnVtYmVyXHJcbiAgbW9kRW52VG9QaXRjaDogbnVtYmVyXHJcbiAgbW9kRW52VG9GaWx0ZXJGYzogbnVtYmVyXHJcbiAgaW5pdGlhbEZpbHRlckZjOiBudW1iZXJcclxuICBpbml0aWFsRmlsdGVyUTogbnVtYmVyXHJcbiAgZnJlcVZpYkxGTzogbnVtYmVyfHVuZGVmaW5lZFxyXG4gIHZvbERlY2F5OiBudW1iZXJcclxuICB2b2xTdXN0YWluOiBudW1iZXJcclxuICB2b2xSZWxlYXNlOiBudW1iZXJcclxuICBtb2REZWNheTogbnVtYmVyXHJcbiAgbW9kU3VzdGFpbjogbnVtYmVyXHJcbiAgbW9kUmVsZWFzZTogbnVtYmVyXHJcbiAgc2NhbGVUdW5pbmc6IG51bWJlclxyXG4gIGtleVJhbmdlOiBSYW5nZVZhbHVlXHJcbiAgdmVsUmFuZ2U6IFJhbmdlVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTm90ZUluZm8ocGFyc2VyOiBQYXJzZVJlc3VsdCwgdGFyZ2V0R2VuZXJhdG9yOiBNb2RHZW4sIGJhc2VHZW5lcmF0b3I6IE1vZEdlbik6IE5vdGVJbmZvfG51bGwge1xyXG4gIGNvbnN0IGdlbmVyYXRvciA9IHsgLi4uYmFzZUdlbmVyYXRvciwgLi4udGFyZ2V0R2VuZXJhdG9yIH1cclxuXHJcbiAgY29uc3QgeyBrZXlSYW5nZSwgc2FtcGxlSUQsIHZlbFJhbmdlIH0gPSBnZW5lcmF0b3IgYXMgYW55XHJcbiAgaWYgKGtleVJhbmdlID09PSB1bmRlZmluZWQgfHwgc2FtcGxlSUQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIGNvbnN0IHZvbEF0dGFjayA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdhdHRhY2tWb2xFbnYnLCAtMTIwMDApXHJcbiAgY29uc3Qgdm9sRGVjYXkgPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZGVjYXlWb2xFbnYnLCAtMTIwMDApXHJcbiAgY29uc3Qgdm9sU3VzdGFpbiA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzdXN0YWluVm9sRW52JylcclxuICBjb25zdCB2b2xSZWxlYXNlID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3JlbGVhc2VWb2xFbnYnLCAtMTIwMDApXHJcbiAgY29uc3QgbW9kQXR0YWNrID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2F0dGFja01vZEVudicsIC0xMjAwMClcclxuICBjb25zdCBtb2REZWNheSA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdkZWNheU1vZEVudicsIC0xMjAwMClcclxuICBjb25zdCBtb2RTdXN0YWluID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3N1c3RhaW5Nb2RFbnYnKVxyXG4gIGNvbnN0IG1vZFJlbGVhc2UgPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAncmVsZWFzZU1vZEVudicsIC0xMjAwMClcclxuXHJcbiAgY29uc3QgdHVuZSA9IChcclxuICAgIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdjb2Fyc2VUdW5lJykgK1xyXG4gICAgZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2ZpbmVUdW5lJykgLyAxMDBcclxuICApXHJcbiAgY29uc3Qgc2NhbGUgPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnc2NhbGVUdW5pbmcnLCAxMDApIC8gMTAwXHJcbiAgY29uc3QgZnJlcVZpYkxGTyA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdmcmVxVmliTEZPJylcclxuICBjb25zdCBzYW1wbGVJZCA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzYW1wbGVJRCcpXHJcbiAgY29uc3Qgc2FtcGxlSGVhZGVyID0gcGFyc2VyLnNhbXBsZUhlYWRlcltzYW1wbGVJZF1cclxuICBjb25zdCBiYXNlUGl0Y2ggPSB0dW5lICsgKHNhbXBsZUhlYWRlci5waXRjaENvcnJlY3Rpb24gLyAxMDApIC0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ292ZXJyaWRpbmdSb290S2V5Jywgc2FtcGxlSGVhZGVyLm9yaWdpbmFsUGl0Y2gpXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzYW1wbGU6IHBhcnNlci5zYW1wbGVbc2FtcGxlSWRdLFxyXG4gICAgc2FtcGxlUmF0ZTogc2FtcGxlSGVhZGVyLnNhbXBsZVJhdGUsXHJcbiAgICBzYW1wbGVOYW1lOiBzYW1wbGVIZWFkZXIuc2FtcGxlTmFtZSxcclxuICAgIG1vZEVudlRvUGl0Y2g6IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdtb2RFbnZUb1BpdGNoJykgLyAxMDAsXHJcbiAgICBzY2FsZVR1bmluZzogc2NhbGUsXHJcbiAgICBzdGFydDpcclxuICAgICAgZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3N0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQnKSAqIDMyNzY4ICtcclxuICAgICAgZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3N0YXJ0QWRkcnNPZmZzZXQnKSxcclxuICAgIGVuZDpcclxuICAgICAgZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2VuZEFkZHJzQ29hcnNlT2Zmc2V0JykgKiAzMjc2OCArXHJcbiAgICAgIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdlbmRBZGRyc09mZnNldCcpLFxyXG4gICAgbG9vcFN0YXJ0OiAoXHJcbiAgICAgIC8vKHNhbXBsZUhlYWRlci5zdGFydExvb3AgLSBzYW1wbGVIZWFkZXIuc3RhcnQpICtcclxuICAgICAgKHNhbXBsZUhlYWRlci5zdGFydExvb3ApICtcclxuICAgICAgZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3N0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0JykgKiAzMjc2OCArXHJcbiAgICAgIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzdGFydGxvb3BBZGRyc09mZnNldCcpXHJcbiAgICApLFxyXG4gICAgbG9vcEVuZDogKFxyXG4gICAgICAvLyhzYW1wbGVIZWFkZXIuZW5kTG9vcCAtIHNhbXBsZUhlYWRlci5zdGFydCkgK1xyXG4gICAgICAoc2FtcGxlSGVhZGVyLmVuZExvb3ApICtcclxuICAgICAgZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2VuZGxvb3BBZGRyc0NvYXJzZU9mZnNldCcpICogMzI3NjggK1xyXG4gICAgICBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZW5kbG9vcEFkZHJzT2Zmc2V0JylcclxuICAgICksXHJcbiAgICB2b2xBdHRhY2s6IE1hdGgucG93KDIsIHZvbEF0dGFjayAvIDEyMDApLFxyXG4gICAgdm9sRGVjYXk6IE1hdGgucG93KDIsIHZvbERlY2F5IC8gMTIwMCksXHJcbiAgICB2b2xTdXN0YWluOiB2b2xTdXN0YWluIC8gMTAwMCxcclxuICAgIHZvbFJlbGVhc2U6IE1hdGgucG93KDIsIHZvbFJlbGVhc2UgLyAxMjAwKSxcclxuICAgIG1vZEF0dGFjazogTWF0aC5wb3coMiwgbW9kQXR0YWNrIC8gMTIwMCksXHJcbiAgICBtb2REZWNheTogTWF0aC5wb3coMiwgbW9kRGVjYXkgLyAxMjAwKSxcclxuICAgIG1vZFN1c3RhaW46IG1vZFN1c3RhaW4gLyAxMDAwLFxyXG4gICAgbW9kUmVsZWFzZTogTWF0aC5wb3coMiwgbW9kUmVsZWFzZSAvIDEyMDApLFxyXG4gICAgaW5pdGlhbEZpbHRlckZjOiBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnaW5pdGlhbEZpbHRlckZjJywgMTM1MDApLFxyXG4gICAgbW9kRW52VG9GaWx0ZXJGYzogZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ21vZEVudlRvRmlsdGVyRmMnKSxcclxuICAgIGluaXRpYWxGaWx0ZXJROiBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnaW5pdGlhbEZpbHRlclEnLCAxKSxcclxuICAgIGZyZXFWaWJMRk86IGZyZXFWaWJMRk8gPyBNYXRoLnBvdygyLCBmcmVxVmliTEZPIC8gMTIwMCkgKiA4LjE3NiA6IHVuZGVmaW5lZCxcclxuICAgIHBsYXliYWNrUmF0ZTogKGtleSkgPT4gTWF0aC5wb3coTWF0aC5wb3coMiwgMSAvIDEyKSwgKGtleSArIGJhc2VQaXRjaCkgKiBzY2FsZSksXHJcbiAgICBrZXlSYW5nZSxcclxuICAgIHZlbFJhbmdlXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yOiBNb2RHZW4sIGVudW1lcmF0b3JUeXBlOiBzdHJpbmcsIG9wdF9kZWZhdWx0OiBudW1iZXIgPSAwKTogbnVtYmVyIHtcclxuICByZXR1cm4gZ2VuZXJhdG9yW2VudW1lcmF0b3JUeXBlXSA/IGdlbmVyYXRvcltlbnVtZXJhdG9yVHlwZV0uYW1vdW50IDogb3B0X2RlZmF1bHRcclxufVxyXG5cclxuaW50ZXJmYWNlIE1vZEdlbiB7XHJcbiAgdW5rbm93bjogKEFtb3VudFZhbHVlfFJhbmdlVmFsdWUpW10sXHJcbiAga2V5UmFuZ2U6IFJhbmdlVmFsdWVcclxuICAvLyBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUg44Gr44GC44KL44KC44Gu44GM5YWl44KLXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUJhZ01vZEdlbihpbmRleFN0YXJ0OiBudW1iZXIsIGluZGV4RW5kOiBudW1iZXIsIHpvbmVNb2RHZW46IE1vZHVsYXRvckxpc3RbXSkge1xyXG4gIGNvbnN0IG1vZGdlbkluZm86IE1vZHVsYXRvckxpc3RbXSA9IFtdXHJcbiAgY29uc3QgbW9kZ2VuOiBNb2RHZW4gPSB7XHJcbiAgICB1bmtub3duOiBbXSxcclxuICAgICdrZXlSYW5nZSc6IHtcclxuICAgICAgaGk6IDEyNyxcclxuICAgICAgbG86IDBcclxuICAgIH1cclxuICB9OyAvLyBUT0RPXHJcblxyXG4gIGZvciAobGV0IGkgPSBpbmRleFN0YXJ0OyBpIDwgaW5kZXhFbmQ7ICsraSkge1xyXG4gICAgY29uc3QgaW5mbyA9IHpvbmVNb2RHZW5baV1cclxuICAgIG1vZGdlbkluZm8ucHVzaChpbmZvKVxyXG5cclxuICAgIGlmIChpbmZvLnR5cGUgPT09ICd1bmtub3duJykge1xyXG4gICAgICBtb2RnZW4udW5rbm93bi5wdXNoKGluZm8udmFsdWUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtb2RnZW5baW5mby50eXBlXSA9IGluZm8udmFsdWVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IG1vZGdlbiwgbW9kZ2VuSW5mbyB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRHZW5lcmF0b3Ioem9uZTogSW5zdHJ1bWVudEJhZ1tdLCBpbmRleDogbnVtYmVyLCBpbnN0cnVtZW50Wm9uZUdlbmVyYXRvcjogTW9kdWxhdG9yTGlzdFtdKSB7XHJcbiAgY29uc3QgbW9kZ2VuID0gY3JlYXRlQmFnTW9kR2VuKFxyXG4gICAgem9uZVtpbmRleF0uaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4LFxyXG4gICAgem9uZVtpbmRleCArIDFdID8gem9uZVtpbmRleCArIDFdLmluc3RydW1lbnRHZW5lcmF0b3JJbmRleCA6IGluc3RydW1lbnRab25lR2VuZXJhdG9yLmxlbmd0aCxcclxuICAgIGluc3RydW1lbnRab25lR2VuZXJhdG9yXHJcbiAgKVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZ2VuZXJhdG9yOiBtb2RnZW4ubW9kZ2VuLFxyXG4gICAgZ2VuZXJhdG9ySW5mbzogbW9kZ2VuLm1vZGdlbkluZm9cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRNb2R1bGF0b3Ioem9uZTogSW5zdHJ1bWVudEJhZ1tdLCBpbmRleDogbnVtYmVyLCBpbnN0cnVtZW50Wm9uZU1vZHVsYXRvcjogTW9kdWxhdG9yTGlzdFtdKSB7XHJcbiAgY29uc3QgbW9kZ2VuID0gY3JlYXRlQmFnTW9kR2VuKFxyXG4gICAgem9uZVtpbmRleF0uaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4LFxyXG4gICAgem9uZVtpbmRleCArIDFdID8gem9uZVtpbmRleCArIDFdLmluc3RydW1lbnRNb2R1bGF0b3JJbmRleCA6IGluc3RydW1lbnRab25lTW9kdWxhdG9yLmxlbmd0aCxcclxuICAgIGluc3RydW1lbnRab25lTW9kdWxhdG9yXHJcbiAgKVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbW9kdWxhdG9yOiBtb2RnZW4ubW9kZ2VuLFxyXG4gICAgbW9kdWxhdG9ySW5mbzogbW9kZ2VuLm1vZGdlbkluZm9cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVByZXNldEdlbmVyYXRvcih6b25lOiBQcmVzZXRCYWdbXSwgaW5kZXg6IG51bWJlciwgcHJlc2V0Wm9uZUdlbmVyYXRvcjogTW9kdWxhdG9yTGlzdFtdKSB7XHJcbiAgY29uc3QgbW9kZ2VuID0gY3JlYXRlQmFnTW9kR2VuKFxyXG4gICAgem9uZVtpbmRleF0ucHJlc2V0R2VuZXJhdG9ySW5kZXgsXHJcbiAgICB6b25lW2luZGV4ICsgMV0gPyB6b25lW2luZGV4ICsgMV0ucHJlc2V0R2VuZXJhdG9ySW5kZXggOiBwcmVzZXRab25lR2VuZXJhdG9yLmxlbmd0aCxcclxuICAgIHByZXNldFpvbmVHZW5lcmF0b3JcclxuICApXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZW5lcmF0b3I6IG1vZGdlbi5tb2RnZW4sXHJcbiAgICBnZW5lcmF0b3JJbmZvOiBtb2RnZW4ubW9kZ2VuSW5mb1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUHJlc2V0TW9kdWxhdG9yKHpvbmU6IFByZXNldEJhZ1tdLCBpbmRleDogbnVtYmVyLCBwcmVzZXRab25lTW9kdWxhdG9yOiBNb2R1bGF0b3JMaXN0W10pIHtcclxuICBjb25zdCBtb2RnZW4gPSBjcmVhdGVCYWdNb2RHZW4oXHJcbiAgICB6b25lW2luZGV4XS5wcmVzZXRNb2R1bGF0b3JJbmRleCxcclxuICAgIHpvbmVbaW5kZXggKyAxXSA/IHpvbmVbaW5kZXggKyAxXS5wcmVzZXRNb2R1bGF0b3JJbmRleCA6IHByZXNldFpvbmVNb2R1bGF0b3IubGVuZ3RoLFxyXG4gICAgcHJlc2V0Wm9uZU1vZHVsYXRvclxyXG4gIClcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1vZHVsYXRvcjogbW9kZ2VuLm1vZGdlbixcclxuICAgIG1vZHVsYXRvckluZm86IG1vZGdlbi5tb2RnZW5JbmZvXHJcbiAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1NvdW5kRm9udC50cyIsImltcG9ydCBTeW50aGVzaXplciBmcm9tIFwiLi9TeW50aGVzaXplclwiXHJcbmltcG9ydCBQcm9ncmFtTmFtZXMgZnJvbSBcIi4vUHJvZ3JhbU5hbWVzXCJcclxuXHJcbmZ1bmN0aW9uIHJlbmRlcihzdHI6IHN0cmluZyk6IEVsZW1lbnQge1xyXG4gIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcbiAgd3JhcHBlci5pbm5lckhUTUwgPSBzdHIucmVwbGFjZSgvXlxccysvLCBcIlwiKVxyXG4gIHJldHVybiB3cmFwcGVyLmZpcnN0RWxlbWVudENoaWxkIVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJLZXlzKCk6IHN0cmluZyB7XHJcbiAgbGV0IGh0bWwgPSBcIlwiXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMjg7IGkrKykge1xyXG4gICAgY29uc3QgbiA9IGkgJSAxMlxyXG4gICAgY29uc3QgaXNCbGFjayA9IFsxLCAzLCA2LCA4LCAxMF0uaW5jbHVkZXMobilcclxuICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9XCJrZXkgJHtpc0JsYWNrID8gXCJibGFja1wiIDogXCJ3aGl0ZVwifVwiPjwvZGl2PmBcclxuICB9XHJcbiAgcmV0dXJuIGh0bWxcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyUHJvZ3JhbU9wdGlvbnMocHJvZ3JhbU5hbWVzOiB7IFtpbmRleDogbnVtYmVyXTogc3RyaW5nW10gfSwgYmFuazogbnVtYmVyKTogc3RyaW5nIHtcclxuICBsZXQgaHRtbCA9IFwiXCJcclxuICBjb25zdCBuYW1lcyA9IHByb2dyYW1OYW1lc1tiYW5rXVxyXG4gIGZvciAobGV0IGkgaW4gbmFtZXMpIHtcclxuICAgIGNvbnN0IG5hbWUgPSBuYW1lc1tpXVxyXG4gICAgaHRtbCArPSBgPG9wdGlvbiB2YWx1ZT1cIiR7aX1cIj4ke2l9OiAke25hbWV9PC9vcHRpb24+YFxyXG4gIH1cclxuICByZXR1cm4gYDxzZWxlY3Q+JHtodG1sfTwvc2VsZWN0PmBcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVySW5zdHJ1bWVudChwcm9ncmFtKTogRWxlbWVudCB7XHJcbiAgcmV0dXJuIHJlbmRlcihgXHJcbiAgICA8ZGl2IGNsYXNzPVwiaW5zdHJ1bWVudFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicHJvZ3JhbVwiPiR7cHJvZ3JhbX08L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInZvbHVtZVwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGFucG90XCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwaXRjaEJlbmRcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBpdGNoQmVuZFNlbnNpdGl2aXR5XCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJrZXlzXCI+JHtyZW5kZXJLZXlzKCl9PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICBgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9ncmFtTmFtZXNGcm9tQmFua1NldChiYW5rU2V0KSB7XHJcbiAgcmV0dXJuIGJhbmtTZXQubWFwKGJhbmsgPT4gYmFuay5tYXAocyA9PiBzLm5hbWUpKVxyXG59XHJcblxyXG5mdW5jdGlvbiBtZXJnZVByb2dyYW1OYW1lcyhsZWZ0OiB7W2luZGV4OiBudW1iZXJdOiBzdHJpbmdbXX0sIHJpZ2h0OiB7W2luZGV4OiBudW1iZXJdOiBzdHJpbmdbXX0pIHtcclxuICBmdW5jdGlvbiBtZXJnZWRLZXlzKGEsIGIpIHtcclxuICAgIHJldHVybiBuZXcgU2V0KFsuLi5PYmplY3Qua2V5cyhhKSwgLi4uT2JqZWN0LmtleXMoYildKVxyXG4gIH1cclxuICBjb25zdCBiYW5rcyA9IG1lcmdlZEtleXMobGVmdCwgcmlnaHQpXHJcbiAgY29uc3QgcmVzdWx0ID0ge31cclxuICBiYW5rcy5mb3JFYWNoKGJhbmsgPT4ge1xyXG4gICAgY29uc3QgbCA9IGxlZnRbYmFua10gfHwgW11cclxuICAgIGNvbnN0IHIgPSByaWdodFtiYW5rXSB8fCBbXVxyXG4gICAgY29uc3QgbGlzdDogeyBbaW5kZXg6IG51bWJlcl06IHN0cmluZ30gPSB7fVxyXG4gICAgY29uc3QgcHJvZ3JhbXMgPSBtZXJnZWRLZXlzKGwsIHIpXHJcbiAgICBwcm9ncmFtcy5mb3JFYWNoKHAgPT4ge1xyXG4gICAgICBsaXN0W3BdID0gYCR7bFtwXSB8fCBcIk5vbmVcIn0gKCR7cltwXSB8fCBcIk5vbmVcIn0pYFxyXG4gICAgfSlcclxuICAgIHJlc3VsdFtiYW5rXSA9IGxpc3RcclxuICB9KVxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XHJcbiAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50fG51bGxcclxuICBwcml2YXRlIGRyYWc6IGJvb2xlYW4gPSBmYWxzZVxyXG5cclxuICBkcmF3KHN5bnRoOiBTeW50aGVzaXplcik6IEVsZW1lbnQge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudCA9IHJlbmRlcihgPGRpdiAvPmApXHJcbiAgICBjb25zdCBwcm9ncmFtTmFtZXMgPSBtZXJnZVByb2dyYW1OYW1lcyhwcm9ncmFtTmFtZXNGcm9tQmFua1NldChzeW50aC5zb3VuZEZvbnQuYmFua1NldCksIFByb2dyYW1OYW1lcylcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcclxuICAgICAgY29uc3QgYmFuayA9IGkgIT09IDkgPyAwIDogMTI4XHJcbiAgICAgIGNvbnN0IHByb2dyYW0gPSByZW5kZXJQcm9ncmFtT3B0aW9ucyhwcm9ncmFtTmFtZXMsIGJhbmspXHJcbiAgICAgIGNvbnN0IGl0ZW0gPSByZW5kZXJJbnN0cnVtZW50KHByb2dyYW0pXHJcblxyXG4gICAgICBjb25zdCBjaGFubmVsID0gaVxyXG4gICAgICBjb25zdCBzZWxlY3QgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpXHJcbiAgICAgIGlmIChzZWxlY3QpIHtcclxuICAgICAgICBzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50XHJcbiAgICAgICAgICBzeW50aC5wcm9ncmFtQ2hhbmdlKGNoYW5uZWwsIHBhcnNlSW50KHRhcmdldC52YWx1ZSwgMTApKVxyXG4gICAgICAgIH0sIGZhbHNlKVxyXG4gICAgICAgIHNlbGVjdC5zZWxlY3RlZEluZGV4ID0gc3ludGguY2hhbm5lbHNbaV0uaW5zdHJ1bWVudFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBub3RlcyA9IGl0ZW0ucXVlcnlTZWxlY3RvckFsbChcIi5rZXlcIilcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMjg7ICsraikge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGpcclxuXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgdGhpcy5kcmFnID0gdHJ1ZVxyXG4gICAgICAgICAgc3ludGgubm90ZU9uKGNoYW5uZWwsIGtleSwgMTI3KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgaWYgKHRoaXMuZHJhZykge1xyXG4gICAgICAgICAgICBzeW50aC5ub3RlT24oY2hhbm5lbCwga2V5LCAxMjcpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBub3Rlc1tqXS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgIHN5bnRoLm5vdGVPZmYoY2hhbm5lbCwga2V5LCAwKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGV2ZW50ID0+IHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgIHRoaXMuZHJhZyA9IGZhbHNlXHJcbiAgICAgICAgICBzeW50aC5ub3RlT2ZmKGNoYW5uZWwsIGtleSwgMClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGl0ZW0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVsZW1lbnRcclxuICB9XHJcblxyXG4gIHJlbW92ZSgpIHtcclxuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZWxlbWVudC5wYXJlbnROb2RlIS5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXHJcbiAgICB0aGlzLmVsZW1lbnQgPSBudWxsXHJcbiAgfVxyXG5cclxuICBnZXRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsOiBudW1iZXIpOiBFbGVtZW50fG51bGwge1xyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pbnN0cnVtZW50XCIpW2NoYW5uZWxdXHJcbiAgfVxyXG5cclxuICBnZXRLZXlFbGVtZW50KGNoYW5uZWw6IG51bWJlciwga2V5OiBudW1iZXIpOiBFbGVtZW50fG51bGwge1xyXG4gICAgY29uc3QgZWxlbSA9IHRoaXMuZ2V0SW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbClcclxuICAgIGlmICghZWxlbSkge1xyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsZW0ucXVlcnlTZWxlY3RvckFsbChcIi5rZXlcIilba2V5XVxyXG4gIH1cclxuXHJcbiAgZmluZEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWw6IG51bWJlciwgcXVlcnk6IHN0cmluZyk6IEVsZW1lbnR8bnVsbCB7XHJcbiAgICBjb25zdCBlbGVtID0gdGhpcy5nZXRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsKVxyXG4gICAgaWYgKCFlbGVtKSB7XHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWxlbS5xdWVyeVNlbGVjdG9yKHF1ZXJ5KVxyXG4gIH1cclxuXHJcbiAgbm90ZU9uKGNoYW5uZWw6IG51bWJlciwga2V5OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmdldEtleUVsZW1lbnQoY2hhbm5lbCwga2V5KVxyXG4gICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdub3RlLW9uJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vdGVPZmYoY2hhbm5lbDogbnVtYmVyLCBrZXk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZ2V0S2V5RWxlbWVudChjaGFubmVsLCBrZXkpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGUtb24nKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvZ3JhbUNoYW5nZShjaGFubmVsOiBudW1iZXIsIGluc3RydW1lbnQpIHtcclxuICAgIGNvbnN0IHNlbGVjdCA9IHRoaXMuZmluZEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwsIFwiLnByb2dyYW0gc2VsZWN0XCIpIGFzIEhUTUxTZWxlY3RFbGVtZW50fHVuZGVmaW5lZFxyXG4gICAgaWYgKHNlbGVjdCkge1xyXG4gICAgICBzZWxlY3QudmFsdWUgPSBpbnN0cnVtZW50XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2b2x1bWVDaGFuZ2UoY2hhbm5lbDogbnVtYmVyLCB2b2x1bWUpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi52b2x1bWVcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSB2b2x1bWVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHBhbnBvdENoYW5nZShjaGFubmVsOiBudW1iZXIsIHBhbnBvdDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIucGFucG90XCIpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gcGFucG90XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwaXRjaEJlbmQoY2hhbm5lbDogbnVtYmVyLCBjYWxjdWxhdGVkUGl0Y2g6IHN0cmluZykge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZmluZEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwsIFwiLnBpdGNoQmVuZFwiKVxyXG4gICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGNhbGN1bGF0ZWRQaXRjaFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbDogbnVtYmVyLCBzZW5zaXRpdml0eTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIucGl0Y2hCZW5kU2Vuc2l0aXZpdHlcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBzZW5zaXRpdml0eVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvVmlldy50cyIsImNvbnN0IFByb2dyYW1OYW1lczogeyBbaW5kZXg6IG51bWJlcl06IHN0cmluZ1tdIH0gPSB7XHJcbiAgMDogW1xyXG4gICAgXCJBY291c3RpYyBQaWFub1wiLFxyXG4gICAgXCJCcmlnaHQgUGlhbm9cIixcclxuICAgIFwiRWxlY3RyaWMgR3JhbmQgUGlhbm9cIixcclxuICAgIFwiSG9ua3ktdG9uayBQaWFub1wiLFxyXG4gICAgXCJFbGVjdHJpYyBQaWFub1wiLFxyXG4gICAgXCJFbGVjdHJpYyBQaWFubyAyXCIsXHJcbiAgICBcIkhhcnBzaWNob3JkXCIsXHJcbiAgICBcIkNsYXZpXCIsXHJcbiAgICBcIkNlbGVzdGFcIixcclxuICAgIFwiR2xvY2tlbnNwaWVsXCIsXHJcbiAgICBcIk11c2ljYWwgYm94XCIsXHJcbiAgICBcIlZpYnJhcGhvbmVcIixcclxuICAgIFwiTWFyaW1iYVwiLFxyXG4gICAgXCJYeWxvcGhvbmVcIixcclxuICAgIFwiVHVidWxhciBCZWxsXCIsXHJcbiAgICBcIkR1bGNpbWVyXCIsXHJcbiAgICBcIkRyYXdiYXIgT3JnYW5cIixcclxuICAgIFwiUGVyY3Vzc2l2ZSBPcmdhblwiLFxyXG4gICAgXCJSb2NrIE9yZ2FuXCIsXHJcbiAgICBcIkNodXJjaCBvcmdhblwiLFxyXG4gICAgXCJSZWVkIG9yZ2FuXCIsXHJcbiAgICBcIkFjY29yZGlvblwiLFxyXG4gICAgXCJIYXJtb25pY2FcIixcclxuICAgIFwiVGFuZ28gQWNjb3JkaW9uXCIsXHJcbiAgICBcIkFjb3VzdGljIEd1aXRhciAobnlsb24pXCIsXHJcbiAgICBcIkFjb3VzdGljIEd1aXRhciAoc3RlZWwpXCIsXHJcbiAgICBcIkVsZWN0cmljIEd1aXRhciAoamF6eilcIixcclxuICAgIFwiRWxlY3RyaWMgR3VpdGFyIChjbGVhbilcIixcclxuICAgIFwiRWxlY3RyaWMgR3VpdGFyIChtdXRlZClcIixcclxuICAgIFwiT3ZlcmRyaXZlbiBHdWl0YXJcIixcclxuICAgIFwiRGlzdG9ydGlvbiBHdWl0YXJcIixcclxuICAgIFwiR3VpdGFyIGhhcm1vbmljc1wiLFxyXG4gICAgXCJBY291c3RpYyBCYXNzXCIsXHJcbiAgICBcIkVsZWN0cmljIEJhc3MgKGZpbmdlcilcIixcclxuICAgIFwiRWxlY3RyaWMgQmFzcyAocGljaylcIixcclxuICAgIFwiRnJldGxlc3MgQmFzc1wiLFxyXG4gICAgXCJTbGFwIEJhc3MgMVwiLFxyXG4gICAgXCJTbGFwIEJhc3MgMlwiLFxyXG4gICAgXCJTeW50aCBCYXNzIDFcIixcclxuICAgIFwiU3ludGggQmFzcyAyXCIsXHJcbiAgICBcIlZpb2xpblwiLFxyXG4gICAgXCJWaW9sYVwiLFxyXG4gICAgXCJDZWxsb1wiLFxyXG4gICAgXCJEb3VibGUgYmFzc1wiLFxyXG4gICAgXCJUcmVtb2xvIFN0cmluZ3NcIixcclxuICAgIFwiUGl6emljYXRvIFN0cmluZ3NcIixcclxuICAgIFwiT3JjaGVzdHJhbCBIYXJwXCIsXHJcbiAgICBcIlRpbXBhbmlcIixcclxuICAgIFwiU3RyaW5nIEVuc2VtYmxlIDFcIixcclxuICAgIFwiU3RyaW5nIEVuc2VtYmxlIDJcIixcclxuICAgIFwiU3ludGggU3RyaW5ncyAxXCIsXHJcbiAgICBcIlN5bnRoIFN0cmluZ3MgMlwiLFxyXG4gICAgXCJWb2ljZSBBYWhzXCIsXHJcbiAgICBcIlZvaWNlIE9vaHNcIixcclxuICAgIFwiU3ludGggVm9pY2VcIixcclxuICAgIFwiT3JjaGVzdHJhIEhpdFwiLFxyXG4gICAgXCJUcnVtcGV0XCIsXHJcbiAgICBcIlRyb21ib25lXCIsXHJcbiAgICBcIlR1YmFcIixcclxuICAgIFwiTXV0ZWQgVHJ1bXBldFwiLFxyXG4gICAgXCJGcmVuY2ggaG9yblwiLFxyXG4gICAgXCJCcmFzcyBTZWN0aW9uXCIsXHJcbiAgICBcIlN5bnRoIEJyYXNzIDFcIixcclxuICAgIFwiU3ludGggQnJhc3MgMlwiLFxyXG4gICAgXCJTb3ByYW5vIFNheFwiLFxyXG4gICAgXCJBbHRvIFNheFwiLFxyXG4gICAgXCJUZW5vciBTYXhcIixcclxuICAgIFwiQmFyaXRvbmUgU2F4XCIsXHJcbiAgICBcIk9ib2VcIixcclxuICAgIFwiRW5nbGlzaCBIb3JuXCIsXHJcbiAgICBcIkJhc3Nvb25cIixcclxuICAgIFwiQ2xhcmluZXRcIixcclxuICAgIFwiUGljY29sb1wiLFxyXG4gICAgXCJGbHV0ZVwiLFxyXG4gICAgXCJSZWNvcmRlclwiLFxyXG4gICAgXCJQYW4gRmx1dGVcIixcclxuICAgIFwiQmxvd24gQm90dGxlXCIsXHJcbiAgICBcIlNoYWt1aGFjaGlcIixcclxuICAgIFwiV2hpc3RsZVwiLFxyXG4gICAgXCJPY2FyaW5hXCIsXHJcbiAgICBcIkxlYWQgMSAoc3F1YXJlKVwiLFxyXG4gICAgXCJMZWFkIDIgKHNhd3Rvb3RoKVwiLFxyXG4gICAgXCJMZWFkIDMgKGNhbGxpb3BlKVwiLFxyXG4gICAgXCJMZWFkIDQgKGNoaWZmKVwiLFxyXG4gICAgXCJMZWFkIDUgKGNoYXJhbmcpXCIsXHJcbiAgICBcIkxlYWQgNiAodm9pY2UpXCIsXHJcbiAgICBcIkxlYWQgNyAoZmlmdGhzKVwiLFxyXG4gICAgXCJMZWFkIDggKGJhc3MgKyBsZWFkKVwiLFxyXG4gICAgXCJQYWQgMSAoRmFudGFzaWEpXCIsXHJcbiAgICBcIlBhZCAyICh3YXJtKVwiLFxyXG4gICAgXCJQYWQgMyAocG9seXN5bnRoKVwiLFxyXG4gICAgXCJQYWQgNCAoY2hvaXIpXCIsXHJcbiAgICBcIlBhZCA1IChib3dlZClcIixcclxuICAgIFwiUGFkIDYgKG1ldGFsbGljKVwiLFxyXG4gICAgXCJQYWQgNyAoaGFsbylcIixcclxuICAgIFwiUGFkIDggKHN3ZWVwKVwiLFxyXG4gICAgXCJGWCAxIChyYWluKVwiLFxyXG4gICAgXCJGWCAyIChzb3VuZHRyYWNrKVwiLFxyXG4gICAgXCJGWCAzIChjcnlzdGFsKVwiLFxyXG4gICAgXCJGWCA0IChhdG1vc3BoZXJlKVwiLFxyXG4gICAgXCJGWCA1IChicmlnaHRuZXNzKVwiLFxyXG4gICAgXCJGWCA2IChnb2JsaW5zKVwiLFxyXG4gICAgXCJGWCA3IChlY2hvZXMpXCIsXHJcbiAgICBcIkZYIDggKHNjaS1maSlcIixcclxuICAgIFwiU2l0YXJcIixcclxuICAgIFwiQmFuam9cIixcclxuICAgIFwiU2hhbWlzZW5cIixcclxuICAgIFwiS290b1wiLFxyXG4gICAgXCJLYWxpbWJhXCIsXHJcbiAgICBcIkJhZ3BpcGVcIixcclxuICAgIFwiRmlkZGxlXCIsXHJcbiAgICBcIlNoYW5haVwiLFxyXG4gICAgXCJUaW5rbGUgQmVsbFwiLFxyXG4gICAgXCJBZ29nb1wiLFxyXG4gICAgXCJTdGVlbCBEcnVtc1wiLFxyXG4gICAgXCJXb29kYmxvY2tcIixcclxuICAgIFwiVGFpa28gRHJ1bVwiLFxyXG4gICAgXCJNZWxvZGljIFRvbVwiLFxyXG4gICAgXCJTeW50aCBEcnVtXCIsXHJcbiAgICBcIlJldmVyc2UgQ3ltYmFsXCIsXHJcbiAgICBcIkd1aXRhciBGcmV0IE5vaXNlXCIsXHJcbiAgICBcIkJyZWF0aCBOb2lzZVwiLFxyXG4gICAgXCJTZWFzaG9yZVwiLFxyXG4gICAgXCJCaXJkIFR3ZWV0XCIsXHJcbiAgICBcIlRlbGVwaG9uZSBSaW5nXCIsXHJcbiAgICBcIkhlbGljb3B0ZXJcIixcclxuICAgIFwiQXBwbGF1c2VcIixcclxuICAgIFwiR3Vuc2hvdFwiXHJcbiAgXSwgMTI4OiBbXCJSaHl0aG0gVHJhY2tcIl1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZ3JhbU5hbWVzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1Byb2dyYW1OYW1lcy50cyIsImltcG9ydCBTeW50aGVzaXplciBmcm9tIFwiLi9TeW50aGVzaXplclwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaWRpTWVzc2FnZUhhbmRsZXIge1xyXG4gIHByaXZhdGUgUnBuTXNiID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdXHJcbiAgcHJpdmF0ZSBScG5Mc2IgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cclxuICBzeW50aDogU3ludGhlc2l6ZXJcclxuXHJcbiAgcHJvY2Vzc01pZGlNZXNzYWdlKG1lc3NhZ2U6IG51bWJlcltdKSB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gbWVzc2FnZVswXSAmIDB4MGZcclxuICAgIGNvbnN0IHsgc3ludGggfSA9IHRoaXNcclxuXHJcbiAgICBpZiAoIXN5bnRoKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCAobWVzc2FnZVswXSAmIDB4ZjApIHtcclxuICAgICAgY2FzZSAweDgwOiAvLyBOb3RlT2ZmOiA4biBrayB2dlxyXG4gICAgICAgIHN5bnRoLm5vdGVPZmYoY2hhbm5lbCwgbWVzc2FnZVsxXSwgbWVzc2FnZVsyXSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4OTA6IC8vIE5vdGVPbjogOW4ga2sgdnZcclxuICAgICAgICBpZiAobWVzc2FnZVsyXSA+IDApIHtcclxuICAgICAgICAgIHN5bnRoLm5vdGVPbihjaGFubmVsLCBtZXNzYWdlWzFdLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzeW50aC5ub3RlT2ZmKGNoYW5uZWwsIG1lc3NhZ2VbMV0sIDApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMHhCMDogLy8gQ29udHJvbCBDaGFuZ2U6IEJuIGNjIGRkXHJcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlWzFdKSB7XHJcbiAgICAgICAgICBjYXNlIDB4MDY6IC8vIERhdGEgRW50cnk6IEJuIDA2IGRkXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5ScG5Nc2JbY2hhbm5lbF0pIHtcclxuICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuUnBuTHNiW2NoYW5uZWxdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgMDogLy8gUGl0Y2ggQmVuZCBTZW5zaXRpdml0eVxyXG4gICAgICAgICAgICAgICAgICAgIHN5bnRoLnBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4MDc6IC8vIFZvbHVtZSBDaGFuZ2U6IEJuIDA3IGRkXHJcbiAgICAgICAgICAgIHN5bnRoLnZvbHVtZUNoYW5nZShjaGFubmVsLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDBBOiAvLyBQYW5wb3QgQ2hhbmdlOiBCbiAwQSBkZFxyXG4gICAgICAgICAgICBzeW50aC5wYW5wb3RDaGFuZ2UoY2hhbm5lbCwgbWVzc2FnZVsyXSlcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHg3ODogLy8gQWxsIFNvdW5kIE9mZjogQm4gNzggMDBcclxuICAgICAgICAgICAgc3ludGguYWxsU291bmRPZmYoY2hhbm5lbClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHg3OTogLy8gUmVzZXQgQWxsIENvbnRyb2w6IEJuIDc5IDAwXHJcbiAgICAgICAgICAgIHN5bnRoLnJlc2V0QWxsQ29udHJvbChjaGFubmVsKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDIwOiAvLyBCYW5rU2VsZWN0XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJiYW5rc2VsZWN0OlwiLCBjaGFubmVsLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDY0OiAvLyBSUE4gTVNCXHJcbiAgICAgICAgICAgIHRoaXMuUnBuTXNiW2NoYW5uZWxdID0gbWVzc2FnZVsyXVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDY1OiAvLyBSUE4gTFNCXHJcbiAgICAgICAgICAgIHRoaXMuUnBuTHNiW2NoYW5uZWxdID0gbWVzc2FnZVsyXVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAweEMwOiAvLyBQcm9ncmFtIENoYW5nZTogQ24gcHBcclxuICAgICAgICBzeW50aC5wcm9ncmFtQ2hhbmdlKGNoYW5uZWwsIG1lc3NhZ2VbMV0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAweEUwOiAvLyBQaXRjaCBCZW5kXHJcbiAgICAgICAgc3ludGgucGl0Y2hCZW5kKGNoYW5uZWwsIG1lc3NhZ2VbMV0sIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAweGYwOiAvLyBTeXN0ZW0gRXhjbHVzaXZlIE1lc3NhZ2VcclxuICAgICAgICAvLyBJRCBudW1iZXJcclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbMV0pIHtcclxuICAgICAgICAgIGNhc2UgMHg3ZTogLy8gbm9uLXJlYWx0aW1lXHJcbiAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHg3ZjogLy8gcmVhbHRpbWVcclxuICAgICAgICAgICAgLy8gY29uc3QgZGV2aWNlID0gbWVzc2FnZVsyXVxyXG4gICAgICAgICAgICAvLyBzdWIgSUQgMVxyXG4gICAgICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbM10pIHtcclxuICAgICAgICAgICAgICBjYXNlIDB4MDQ6IC8vIGRldmljZSBjb250cm9sXHJcbiAgICAgICAgICAgICAgICAvLyBzdWIgSUQgMlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtZXNzYWdlWzRdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMTogeyAvLyBtYXN0ZXIgdm9sdW1lXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm9sdW1lID0gbWVzc2FnZVs1XSArIChtZXNzYWdlWzZdIDw8IDcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgTUFYX1ZPTFVNRSA9IDB4NDAwMCAtIDFcclxuICAgICAgICAgICAgICAgICAgICBzeW50aC5zZXRNYXN0ZXJWb2x1bWUodm9sdW1lIC8gTUFYX1ZPTFVNRSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGRlZmF1bHQ6IC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWlkaU1lc3NhZ2VIYW5kbGVyLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==