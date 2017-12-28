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
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "WebMidiLink", function() { return __WEBPACK_IMPORTED_MODULE_0__src_WebMidiLink_ts___default.a; });



/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Synthesizer_1 = __webpack_require__(9);
var View_1 = __webpack_require__(12);
var MidiMessageHandler_1 = __webpack_require__(14);
var WebMidiLink = /** @class */ (function () {
    function WebMidiLink() {
        this.ready = false;
        this.midiMessageHandler = new MidiMessageHandler_1["default"]();
        window.addEventListener('DOMContentLoaded', function () {
            this.ready = true;
        }.bind(this), false);
    }
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
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', function (ev) {
            var xhr = ev.target;
            this.onload(xhr.response);
            if (typeof this.loadCallback === 'function') {
                this.loadCallback(xhr.response);
            }
        }.bind(this), false);
        xhr.send();
    };
    WebMidiLink.prototype.onload = function (response) {
        var input = new Uint8Array(response);
        this.loadSoundFont(input);
    };
    WebMidiLink.prototype.loadSoundFont = function (input) {
        var synth;
        if (!this.synth) {
            var ctx = new AudioContext();
            synth = this.synth = new Synthesizer_1["default"](ctx);
            synth.init();
            synth.refreshInstruments(input);
            synth.connect(ctx.destination);
            var view = this.view = new View_1["default"]();
            document.body.querySelector(".synth").appendChild(view.draw(synth));
            this.midiMessageHandler.synth = synth;
            window.addEventListener('message', this.onmessage.bind(this), false);
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
    WebMidiLink.prototype.onmessage = function (ev) {
        var msg = ev.data.split(',');
        var type = msg.shift();
        switch (type) {
            case 'midi':
                this.midiMessageHandler.processMidiMessage(msg.map(function (hex) {
                    return parseInt(hex, 16);
                }));
                break;
            case 'link':
                var command = msg.shift();
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
    WebMidiLink.prototype.setLoadCallback = function (callback) {
        this.loadCallback = callback;
    };
    return WebMidiLink;
}());
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
            banks[bankNumber] = {};
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
function objectMap(o, func) {
    var result = {};
    Object.keys(o).forEach(function (key) {
        result[key] = func(o[key]);
    });
    return result;
}
function programNamesFromBankSet(bankSet) {
    return objectMap(bankSet, function (bank) { return objectMap(bank, function (s) { return s.name; }); });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5YjJlZmVhNDRiMGFlMDlhZTg4ZSIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9Db25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmlmZlBhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3RydWN0cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhZFN0cmluZy50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvc3ludGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYk1pZGlMaW5rLnRzIiwid2VicGFjazovLy8uL3NyYy9TeW50aGVzaXplci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ludGhlc2l6ZXJOb3RlLnRzIiwid2VicGFjazovLy8uL3NyYy9Tb3VuZEZvbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZpZXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Byb2dyYW1OYW1lcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWlkaU1lc3NhZ2VIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2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Q0Q7d0NBQ0UsS0FBSztnQ0FDVCxDQUFDO2dDQUNELEtBQUs7NEJBQ1A7Z0NBQ0UsS0FBSzt3QkFDVCxDQUFDO3dCQUNELEtBQUs7b0JBQ1A7d0JBQ0UsS0FBSztnQkFDVCxDQUFDO2dCQUNELEtBQUs7WUFDUCxRQUFTLGdCQUFnQjtnQkFDdkIsS0FBSztRQUNULENBQUM7SUFDSCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDIiwiZmlsZSI6InNmMi5zeW50aC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDliMmVmZWE0NGIwYWUwOWFlODhlIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtIHtcclxuICBwcml2YXRlIGRhdGE6IFVpbnQ4QXJyYXlcclxuICBpcDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9mZnNldCkge1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YVxyXG4gICAgdGhpcy5pcCA9IG9mZnNldFxyXG4gIH1cclxuXHJcbiAgcmVhZFN0cmluZyhzaXplOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCB0aGlzLmRhdGEuc3ViYXJyYXkodGhpcy5pcCwgdGhpcy5pcCArPSBzaXplKSlcclxuICAgIGNvbnN0IG51bGxMb2NhdGlvbiA9IHN0ci5pbmRleE9mKFwiXFx1MDAwMFwiKVxyXG4gICAgaWYgKG51bGxMb2NhdGlvbiA+IDApIHtcclxuICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMCwgbnVsbExvY2F0aW9uKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0clxyXG4gIH1cclxuXHJcbiAgcmVhZFdPUkQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCsrXSB8ICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KVxyXG4gIH1cclxuXHJcbiAgcmVhZERXT1JEKGJpZ0VuZGlhbjogYm9vbGVhbiA9IGZhbHNlKTogbnVtYmVyIHtcclxuICAgIGlmIChiaWdFbmRpYW4pIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICB0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAyNHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDE2KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSlcclxuICAgICAgKSA+Pj4gMFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICB0aGlzLmRhdGFbdGhpcy5pcCsrXSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCA4KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAxNikgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMjQpXHJcbiAgICAgICkgPj4+IDBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlYWRCeXRlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwKytdXHJcbiAgfVxyXG5cclxuICByZWFkQXQob2Zmc2V0OiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCArIG9mZnNldF1cclxuICB9XHJcblxyXG4gIC8qIGhlbHBlciAqL1xyXG5cclxuICByZWFkVUludDgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkQnl0ZSgpXHJcbiAgfVxyXG4gIFxyXG4gIHJlYWRJbnQ4KCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnJlYWRCeXRlKCkgPDwgMjQpID4+IDI0XHJcbiAgfVxyXG4gIFxyXG4gIHJlYWRVSW50MTYoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkV09SRCgpXHJcbiAgfVxyXG5cclxuICByZWFkSW50MTYoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMucmVhZFdPUkQoKSA8PCAxNikgPj4gMTZcclxuICB9XHJcblxyXG4gIHJlYWRVSW50MzIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkRFdPUkQoKVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3RyZWFtLnRzIiwiZXhwb3J0IGNvbnN0IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZSA9IFtcclxuICAnc3RhcnRBZGRyc09mZnNldCcsXHJcbiAgJ2VuZEFkZHJzT2Zmc2V0JyxcclxuICAnc3RhcnRsb29wQWRkcnNPZmZzZXQnLFxyXG4gICdlbmRsb29wQWRkcnNPZmZzZXQnLFxyXG4gICdzdGFydEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnbW9kTGZvVG9QaXRjaCcsXHJcbiAgJ3ZpYkxmb1RvUGl0Y2gnLFxyXG4gICdtb2RFbnZUb1BpdGNoJyxcclxuICAnaW5pdGlhbEZpbHRlckZjJyxcclxuICAnaW5pdGlhbEZpbHRlclEnLFxyXG4gICdtb2RMZm9Ub0ZpbHRlckZjJyxcclxuICAnbW9kRW52VG9GaWx0ZXJGYycsXHJcbiAgJ2VuZEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnbW9kTGZvVG9Wb2x1bWUnLFxyXG4gIHVuZGVmaW5lZCwgLy8gMTRcclxuICAnY2hvcnVzRWZmZWN0c1NlbmQnLFxyXG4gICdyZXZlcmJFZmZlY3RzU2VuZCcsXHJcbiAgJ3BhbicsXHJcbiAgdW5kZWZpbmVkLHVuZGVmaW5lZCx1bmRlZmluZWQsIC8vIDE4LDE5LDIwXHJcbiAgJ2RlbGF5TW9kTEZPJyxcclxuICAnZnJlcU1vZExGTycsXHJcbiAgJ2RlbGF5VmliTEZPJyxcclxuICAnZnJlcVZpYkxGTycsXHJcbiAgJ2RlbGF5TW9kRW52JyxcclxuICAnYXR0YWNrTW9kRW52JyxcclxuICAnaG9sZE1vZEVudicsXHJcbiAgJ2RlY2F5TW9kRW52JyxcclxuICAnc3VzdGFpbk1vZEVudicsXHJcbiAgJ3JlbGVhc2VNb2RFbnYnLFxyXG4gICdrZXludW1Ub01vZEVudkhvbGQnLFxyXG4gICdrZXludW1Ub01vZEVudkRlY2F5JyxcclxuICAnZGVsYXlWb2xFbnYnLFxyXG4gICdhdHRhY2tWb2xFbnYnLFxyXG4gICdob2xkVm9sRW52JyxcclxuICAnZGVjYXlWb2xFbnYnLFxyXG4gICdzdXN0YWluVm9sRW52JyxcclxuICAncmVsZWFzZVZvbEVudicsXHJcbiAgJ2tleW51bVRvVm9sRW52SG9sZCcsXHJcbiAgJ2tleW51bVRvVm9sRW52RGVjYXknLFxyXG4gICdpbnN0cnVtZW50JyxcclxuICB1bmRlZmluZWQsIC8vIDQyXHJcbiAgJ2tleVJhbmdlJyxcclxuICAndmVsUmFuZ2UnLFxyXG4gICdzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ2tleW51bScsXHJcbiAgJ3ZlbG9jaXR5JyxcclxuICAnaW5pdGlhbEF0dGVudWF0aW9uJyxcclxuICB1bmRlZmluZWQsIC8vIDQ5XHJcbiAgJ2VuZGxvb3BBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ2NvYXJzZVR1bmUnLFxyXG4gICdmaW5lVHVuZScsXHJcbiAgJ3NhbXBsZUlEJyxcclxuICAnc2FtcGxlTW9kZXMnLFxyXG4gIHVuZGVmaW5lZCwgLy8gNTVcclxuICAnc2NhbGVUdW5pbmcnLFxyXG4gICdleGNsdXNpdmVDbGFzcycsXHJcbiAgJ292ZXJyaWRpbmdSb290S2V5J1xyXG5dXHJcblxyXG5leHBvcnQgY29uc3QgSW5mb05hbWVUYWJsZSA9IHtcclxuICBJQ01UOiBcImNvbW1lbnRcIixcclxuICBJQ09QOiBcImNvcHlyaWdodFwiLFxyXG4gIElDUkQ6IFwiY3JlYXRpb25fZGF0ZVwiLFxyXG4gIElFTkc6IFwiZW5naW5lZXJcIixcclxuICBJTkFNOiBcIm5hbWVcIixcclxuICBJUFJEOiBcInByb2R1Y3RcIixcclxuICBJU0ZUOiBcInNvZnR3YXJlXCIsXHJcbiAgaWZpbDogXCJ2ZXJzaW9uXCIsXHJcbiAgaXNuZzogXCJzb3VuZF9lbmdpbmVcIixcclxuICBpcm9tOiBcInJvbV9uYW1lXCIsXHJcbiAgaXZlcjogXCJyb21fdmVyc2lvblwiXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbnN0YW50cy50cyIsImltcG9ydCB7IHBhcnNlUmlmZiwgQ2h1bmssIE9wdGlvbnMgYXMgUmlmZlBhcnNlck9wdGlvbnMgfSBmcm9tIFwiLi9SaWZmUGFyc2VyXCJcclxuaW1wb3J0IHsgUHJlc2V0SGVhZGVyLCBTYW1wbGUsIFByZXNldEJhZywgSW5zdHJ1bWVudCwgSW5zdHJ1bWVudEJhZywgTW9kdWxhdG9yTGlzdCwgR2VuZXJhdG9yTGlzdCB9IGZyb20gXCIuL1N0cnVjdHNcIlxyXG5pbXBvcnQgeyByZWFkU3RyaW5nIH0gZnJvbSBcIi4vcmVhZFN0cmluZ1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuaW1wb3J0IHsgSW5mb05hbWVUYWJsZSB9IGZyb20gXCIuL0NvbnN0YW50c1wiXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlUmVzdWx0IHtcclxuICBwcmVzZXRIZWFkZXI6IFByZXNldEhlYWRlcltdXHJcbiAgcHJlc2V0Wm9uZTogUHJlc2V0QmFnW11cclxuICBwcmVzZXRab25lTW9kdWxhdG9yOiBNb2R1bGF0b3JMaXN0W11cclxuICBwcmVzZXRab25lR2VuZXJhdG9yOiBNb2R1bGF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50OiBJbnN0cnVtZW50W11cclxuICBpbnN0cnVtZW50Wm9uZTogSW5zdHJ1bWVudEJhZ1tdXHJcbiAgaW5zdHJ1bWVudFpvbmVNb2R1bGF0b3I6IE1vZHVsYXRvckxpc3RbXVxyXG4gIGluc3RydW1lbnRab25lR2VuZXJhdG9yOiBNb2R1bGF0b3JMaXN0W11cclxuICBzYW1wbGVIZWFkZXI6IFNhbXBsZVtdXHJcbiAgc2FtcGxlOiBJbnQxNkFycmF5W11cclxuICBzYW1wbGluZ0RhdGE6IENodW5rXHJcbiAgaW5mbzogeyBbaW5kZXg6IHN0cmluZ106IHN0cmluZyB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlKGlucHV0OiBVaW50OEFycmF5LCBvcHRpb246IFJpZmZQYXJzZXJPcHRpb25zID0ge30pOiBQYXJzZVJlc3VsdCB7XHJcblxyXG4gIC8vIHBhcnNlIFJJRkYgY2h1bmtcclxuICBjb25zdCBjaHVua0xpc3QgPSBwYXJzZVJpZmYoaW5wdXQsIDAsIGlucHV0Lmxlbmd0aCwgb3B0aW9uKVxyXG5cclxuICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBjaHVuayBsZW5ndGgnKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2h1bmsgPSBjaHVua0xpc3RbMF1cclxuICBpZiAoY2h1bmsgPT09IG51bGwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignY2h1bmsgbm90IGZvdW5kJylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlUmlmZkNodW5rKGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gICAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIlJJRkZcIiwgXCJzZmJrXCIpXHJcblxyXG4gICAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDMpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNmYmsgc3RydWN0dXJlJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAvLyBJTkZPLWxpc3RcclxuICAgICAgaW5mbzogcGFyc2VJbmZvTGlzdChjaHVua0xpc3RbMF0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gc2R0YS1saXN0XHJcbiAgICAgIHNhbXBsaW5nRGF0YTogcGFyc2VTZHRhTGlzdChjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gcGR0YS1saXN0XHJcbiAgICAgIC4uLnBhcnNlUGR0YUxpc3QoY2h1bmtMaXN0WzJdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VQZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwicGR0YVwiKVxyXG5cclxuICAgIC8vIGNoZWNrIG51bWJlciBvZiBjaHVua3NcclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSA5KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwZHRhIGNodW5rJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwcmVzZXRIZWFkZXI6IHBhcnNlUGhkcihjaHVua0xpc3RbMF0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRab25lOiBwYXJzZVBiYWcoY2h1bmtMaXN0WzFdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0Wm9uZU1vZHVsYXRvcjogcGFyc2VQbW9kKGNodW5rTGlzdFsyXSwgZGF0YSksXHJcbiAgICAgIHByZXNldFpvbmVHZW5lcmF0b3I6IHBhcnNlUGdlbihjaHVua0xpc3RbM10sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50OiBwYXJzZUluc3QoY2h1bmtMaXN0WzRdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudFpvbmU6IHBhcnNlSWJhZyhjaHVua0xpc3RbNV0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50Wm9uZU1vZHVsYXRvcjogcGFyc2VJbW9kKGNodW5rTGlzdFs2XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRab25lR2VuZXJhdG9yOiBwYXJzZUlnZW4oY2h1bmtMaXN0WzddLCBkYXRhKSxcclxuICAgICAgc2FtcGxlSGVhZGVyOiBwYXJzZVNoZHIoY2h1bmtMaXN0WzhdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVzdWx0ID0gcGFyc2VSaWZmQ2h1bmsoY2h1bmssIGlucHV0KVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgLi4ucmVzdWx0LFxyXG4gICAgc2FtcGxlOiBsb2FkU2FtcGxlKHJlc3VsdC5zYW1wbGVIZWFkZXIsIHJlc3VsdC5zYW1wbGluZ0RhdGEub2Zmc2V0LCBpbnB1dClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgZXhwZWN0ZWRUeXBlLCBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSBleHBlY3RlZFR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcblxyXG4gIC8vIGNoZWNrIHNpZ25hdHVyZVxyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgaWYgKHNpZ25hdHVyZSAhPT0gZXhwZWN0ZWRTaWduYXR1cmUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaWduYXR1cmU6JyArIHNpZ25hdHVyZSlcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcmV0dXJuIHBhcnNlUmlmZihkYXRhLCBzdHJlYW0uaXAsIGNodW5rLnNpemUgLSA0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUluZm9MaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gIGNvbnN0IGluZm86IHsgW2luZGV4OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJJTkZPXCIpXHJcblxyXG4gIGZvciAobGV0IHAgb2YgY2h1bmtMaXN0KSB7XHJcbiAgICBjb25zdCB7IG9mZnNldCwgc2l6ZSwgdHlwZSB9ID0gcFxyXG4gICAgY29uc3QgbmFtZSA9IEluZm9OYW1lVGFibGVbdHlwZV0gfHwgdHlwZVxyXG4gICAgaW5mb1tuYW1lXSA9IHJlYWRTdHJpbmcoZGF0YSwgb2Zmc2V0LCBvZmZzZXQgKyBzaXplKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGluZm9cclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpOiBDaHVuayB7XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJzZHRhXCIpXHJcblxyXG4gIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAxKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RPRE8nKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFswXVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rPFQ+KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSwgdHlwZTogc3RyaW5nLCBmYWN0b3J5OiAoU3RyZWFtKSA9PiBUKTogVFtdIHtcclxuICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdXHJcblxyXG4gIGlmIChjaHVuay50eXBlICE9PSB0eXBlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICArIGNodW5rLnR5cGUpXHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oZGF0YSwgY2h1bmsub2Zmc2V0KVxyXG4gIGNvbnN0IHNpemUgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplXHJcbiAgXHJcbiAgd2hpbGUgKHN0cmVhbS5pcCA8IHNpemUpIHtcclxuICAgIHJlc3VsdC5wdXNoKGZhY3Rvcnkoc3RyZWFtKSlcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuY29uc3QgcGFyc2VQaGRyID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBoZHJcIiwgc3RyZWFtID0+IFByZXNldEhlYWRlci5wYXJzZShzdHJlYW0pKS5maWx0ZXIocCA9PiBwLnByZXNldE5hbWUgIT09IFwiRU9QXCIpXHJcbmNvbnN0IHBhcnNlUGJhZyA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwYmFnXCIsIHN0cmVhbSA9PiBQcmVzZXRCYWcucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VJbnN0ID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImluc3RcIiwgc3RyZWFtID0+IEluc3RydW1lbnQucGFyc2Uoc3RyZWFtKSkuZmlsdGVyKGkgPT4gaS5pbnN0cnVtZW50TmFtZSAhPT0gXCJFT0lcIilcclxuY29uc3QgcGFyc2VJYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImliYWdcIiwgc3RyZWFtID0+IEluc3RydW1lbnRCYWcucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VQbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBtb2RcIiwgc3RyZWFtID0+IE1vZHVsYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VJbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImltb2RcIiwgc3RyZWFtID0+IE1vZHVsYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VQZ2VuID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBnZW5cIiwgc3RyZWFtID0+IEdlbmVyYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VJZ2VuID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImlnZW5cIiwgc3RyZWFtID0+IEdlbmVyYXRvckxpc3QucGFyc2Uoc3RyZWFtKSlcclxuY29uc3QgcGFyc2VTaGRyID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInNoZHJcIiwgc3RyZWFtID0+IFNhbXBsZS5wYXJzZShzdHJlYW0pKS5maWx0ZXIocyA9PiBzLnNhbXBsZU5hbWUgIT09IFwiRU9TXCIpXHJcblxyXG5mdW5jdGlvbiBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgc2FtcGxlUmF0ZSkge1xyXG4gIGxldCBtdWx0aXBseSA9IDFcclxuXHJcbiAgLy8gYnVmZmVyXHJcbiAgd2hpbGUgKHNhbXBsZVJhdGUgPCAyMjA1MCkge1xyXG4gICAgY29uc3QgbmV3U2FtcGxlID0gbmV3IEludDE2QXJyYXkoc2FtcGxlLmxlbmd0aCAqIDIpXHJcbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDAsIGlsID0gc2FtcGxlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgIH1cclxuICAgIHNhbXBsZSA9IG5ld1NhbXBsZVxyXG4gICAgbXVsdGlwbHkgKj0gMlxyXG4gICAgc2FtcGxlUmF0ZSAqPSAyXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2FtcGxlLFxyXG4gICAgbXVsdGlwbHlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTYW1wbGUoc2FtcGxlSGVhZGVyOiBTYW1wbGVbXSwgc2FtcGxpbmdEYXRhT2Zmc2V0OiBudW1iZXIsIGRhdGE6IFVpbnQ4QXJyYXkpOiBJbnQxNkFycmF5W10ge1xyXG4gIHJldHVybiBzYW1wbGVIZWFkZXIubWFwKGhlYWRlciA9PiB7XHJcbiAgICBsZXQgc2FtcGxlID0gbmV3IEludDE2QXJyYXkobmV3IFVpbnQ4QXJyYXkoZGF0YS5zdWJhcnJheShcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLnN0YXJ0ICogMixcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLmVuZCAgICogMlxyXG4gICAgKSkuYnVmZmVyKVxyXG4gICAgaWYgKGhlYWRlci5zYW1wbGVSYXRlID4gMCkge1xyXG4gICAgICBjb25zdCBhZGp1c3QgPSBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgaGVhZGVyLnNhbXBsZVJhdGUpXHJcbiAgICAgIHNhbXBsZSA9IGFkanVzdC5zYW1wbGVcclxuICAgICAgaGVhZGVyLnNhbXBsZVJhdGUgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5zdGFydExvb3AgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5lbmRMb29wICo9IGFkanVzdC5tdWx0aXBseVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNhbXBsZVxyXG4gIH0pXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGFyc2VyLnRzIiwiaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9TdHJlYW1cIlxyXG5cclxuZnVuY3Rpb24gcGFyc2VDaHVuayhpbnB1dDogVWludDhBcnJheSwgaXA6IG51bWJlciwgYmlnRW5kaWFuOiBib29sZWFuKTogQ2h1bmsge1xyXG4gIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oaW5wdXQsIGlwKVxyXG4gIGNvbnN0IHR5cGUgPSBzdHJlYW0ucmVhZFN0cmluZyg0KVxyXG4gIGNvbnN0IHNpemUgPSBzdHJlYW0ucmVhZERXT1JEKGJpZ0VuZGlhbilcclxuICByZXR1cm4gbmV3IENodW5rKHR5cGUsIHNpemUsIHN0cmVhbS5pcClcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcclxuICBwYWRkaW5nPzogYm9vbGVhbixcclxuICBiaWdFbmRpYW4/OiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJpZmYoaW5wdXQ6IFVpbnQ4QXJyYXksIGluZGV4OiBudW1iZXIgPSAwLCBsZW5ndGg6IG51bWJlciwgeyBwYWRkaW5nID0gdHJ1ZSwgYmlnRW5kaWFuID0gZmFsc2UgfTogT3B0aW9ucyA9IHt9KSB7XHJcbiAgY29uc3QgY2h1bmtMaXN0OiBDaHVua1tdID0gW11cclxuICBjb25zdCBlbmQgPSBsZW5ndGggKyBpbmRleFxyXG4gIGxldCBpcCA9IGluZGV4XHJcblxyXG4gIHdoaWxlIChpcCA8IGVuZCkge1xyXG4gICAgY29uc3QgY2h1bmsgPSBwYXJzZUNodW5rKGlucHV0LCBpcCwgYmlnRW5kaWFuKVxyXG4gICAgaXAgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplXHJcbiAgICBcclxuICAgIC8vIHBhZGRpbmdcclxuICAgIGlmIChwYWRkaW5nICYmICgoaXAgLSBpbmRleCkgJiAxKSA9PT0gMSkge1xyXG4gICAgICBpcCsrXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNodW5rTGlzdC5wdXNoKGNodW5rKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2h1bmsge1xyXG4gIHR5cGU6IHN0cmluZ1xyXG4gIHNpemU6IG51bWJlclxyXG4gIG9mZnNldDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgdGhpcy5zaXplID0gc2l6ZVxyXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JpZmZQYXJzZXIudHMiLCJpbXBvcnQgeyBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgfSBmcm9tIFwiLi9Db25zdGFudHNcIlxyXG5pbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcblxyXG5leHBvcnQgY2xhc3MgVmVyc2lvblRhZyB7XHJcbiAgbWFqb3I6IG51bWJlclxyXG4gIG1pbm9yOiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByZXNldEhlYWRlciB7XHJcbiAgcHJlc2V0TmFtZTogc3RyaW5nXHJcbiAgcHJlc2V0OiBudW1iZXJcclxuICBiYW5rOiBudW1iZXJcclxuICBwcmVzZXRCYWdJbmRleDogbnVtYmVyXHJcbiAgbGlicmFyeTogbnVtYmVyXHJcbiAgZ2VucmU6IG51bWJlclxyXG4gIG1vcnBob2xvZ3k6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0SGVhZGVyKClcclxuICAgIHAucHJlc2V0TmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcC5wcmVzZXQgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5iYW5rID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAucHJlc2V0QmFnSW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5saWJyYXJ5ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLmdlbnJlID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLm1vcnBob2xvZ3kgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlc2V0QmFnIHtcclxuICBwcmVzZXRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgcHJlc2V0TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0QmFnKClcclxuICAgIHAucHJlc2V0R2VuZXJhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gcFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBbW91bnRWYWx1ZSB7XHJcbiAgY29kZT86IG51bWJlclxyXG4gIGFtb3VudDogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmFuZ2VWYWx1ZSB7XHJcbiAgbG86IG51bWJlclxyXG4gIGhpOiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vZHVsYXRvckxpc3Qge1xyXG4gIHNvdXJjZU9wZXI6IG51bWJlclxyXG4gIGRlc3RpbmF0aW9uT3BlcjogbnVtYmVyXHJcbiAgdmFsdWU6IEFtb3VudFZhbHVlfFJhbmdlVmFsdWVcclxuICBhbW91bnRTb3VyY2VPcGVyOiBudW1iZXJcclxuICB0cmFuc09wZXI6IG51bWJlclxyXG4gIHR5cGU6IHN0cmluZ1xyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgTW9kdWxhdG9yTGlzdCgpXHJcblxyXG4gICAgdC5zb3VyY2VPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIGNvbnN0IGNvZGUgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC5kZXN0aW5hdGlvbk9wZXIgPSBjb2RlXHJcbiAgICBcclxuICAgIGNvbnN0IGtleSA9IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZVtjb2RlXVxyXG4gICAgdC50eXBlID0ga2V5IVxyXG5cclxuICAgIGlmIChrZXkgPT09IHZvaWQgMCkge1xyXG4gICAgICAvLyBBbW91bnRcclxuICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICBjb2RlOiBjb2RlLFxyXG4gICAgICAgIGFtb3VudDogc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEFtb3VudFxyXG4gICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgIGNhc2UgJ2tleVJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICd2ZWxSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICd2ZWxvY2l0eSc6XHJcbiAgICAgICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgICAgICBsbzogc3RyZWFtLnJlYWRCeXRlKCksXHJcbiAgICAgICAgICAgIGhpOiBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICAgICAgYW1vdW50OiBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgdC5hbW91bnRTb3VyY2VPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQudHJhbnNPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdlbmVyYXRvckxpc3Qge1xyXG4gIHR5cGU6IHN0cmluZ1xyXG4gIHZhbHVlOiBBbW91bnRWYWx1ZXxSYW5nZVZhbHVlXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBNb2R1bGF0b3JMaXN0KClcclxuICAgIFxyXG4gICAgY29uc3QgY29kZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBjb25zdCBrZXkgPSBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGVbY29kZV1cclxuICAgIHQudHlwZSA9IGtleSFcclxuXHJcbiAgICBpZiAoa2V5ID09PSB2b2lkIDApIHtcclxuICAgICAgdC52YWx1ZSA9IHtcclxuICAgICAgICBjb2RlLFxyXG4gICAgICAgIGFtb3VudDogc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsUmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICAgIHQudmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGxvOiBzdHJlYW0ucmVhZEJ5dGUoKSxcclxuICAgICAgICAgICAgaGk6IHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICB0LnZhbHVlID0ge1xyXG4gICAgICAgICAgICBhbW91bnQ6IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudCB7XHJcbiAgaW5zdHJ1bWVudE5hbWU6IHN0cmluZ1xyXG4gIGluc3RydW1lbnRCYWdJbmRleDogbnVtYmVyXHJcbiAgXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IEluc3RydW1lbnQoKVxyXG4gICAgdC5pbnN0cnVtZW50TmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgdC5pbnN0cnVtZW50QmFnSW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbnN0cnVtZW50QmFnIHtcclxuICBpbnN0cnVtZW50R2VuZXJhdG9ySW5kZXg6IG51bWJlclxyXG4gIGluc3RydW1lbnRNb2R1bGF0b3JJbmRleDogbnVtYmVyXHJcbiAgXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IEluc3RydW1lbnRCYWcoKVxyXG4gICAgdC5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC5pbnN0cnVtZW50TW9kdWxhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTYW1wbGUge1xyXG4gIHNhbXBsZU5hbWU6IHN0cmluZ1xyXG4gIHN0YXJ0OiBudW1iZXJcclxuICBlbmQ6IG51bWJlclxyXG4gIHN0YXJ0TG9vcDogbnVtYmVyXHJcbiAgZW5kTG9vcDogbnVtYmVyXHJcbiAgc2FtcGxlUmF0ZTogbnVtYmVyXHJcbiAgb3JpZ2luYWxQaXRjaDogbnVtYmVyXHJcbiAgcGl0Y2hDb3JyZWN0aW9uOiBudW1iZXJcclxuICBzYW1wbGVMaW5rOiBudW1iZXJcclxuICBzYW1wbGVUeXBlOiBudW1iZXJcclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCBzID0gbmV3IFNhbXBsZSgpXHJcblxyXG4gICAgcy5zYW1wbGVOYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICBzLnN0YXJ0ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmVuZCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5zdGFydExvb3AgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuZW5kTG9vcCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5zYW1wbGVSYXRlID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLm9yaWdpbmFsUGl0Y2ggPSBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgcy5waXRjaENvcnJlY3Rpb24gPSBzdHJlYW0ucmVhZEludDgoKVxyXG4gICAgcy5zYW1wbGVMaW5rID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHMuc2FtcGxlVHlwZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgcy5zdGFydExvb3AgLT0gcy5zdGFydFxyXG4gICAgcy5lbmRMb29wIC09IHMuc3RhcnRcclxuXHJcbiAgICByZXR1cm4gc1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFNhbXBsZUxpbmsgPSB7XHJcbiAgbW9ub1NhbXBsZTogMSxcclxuICByaWdodFNhbXBsZTogMixcclxuICBsZWZ0U2FtcGxlOiA0LFxyXG4gIGxpbmtlZFNhbXBsZTogOCxcclxuICBSb21Nb25vU2FtcGxlOiAweDgwMDEsXHJcbiAgUm9tUmlnaHRTYW1wbGU6IDB4ODAwMixcclxuICBSb21MZWZ0U2FtcGxlOiAweDgwMDQsXHJcbiAgUm9tTGlua2VkU2FtcGxlOiAweDgwMDhcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3RydWN0cy50cyIsImV4cG9ydCBmdW5jdGlvbiByZWFkU3RyaW5nKGRhdGE6IFVpbnQ4QXJyYXksIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKTogc3RyaW5nIHtcclxuICBjb25zdCBzdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGRhdGEuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXHJcbiAgY29uc3QgbnVsbExvY2F0aW9uID0gc3RyLmluZGV4T2YoXCJcXHUwMDAwXCIpXHJcbiAgaWYgKG51bGxMb2NhdGlvbiA+IDApIHtcclxuICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIG51bGxMb2NhdGlvbilcclxuICB9XHJcbiAgcmV0dXJuIHN0clxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZWFkU3RyaW5nLnRzIiwiaW1wb3J0IFdlYk1pZGlMaW5rIGZyb20gXCIuLi9zcmMvV2ViTWlkaUxpbmsudHNcIlxyXG5leHBvcnQge1xyXG4gIFdlYk1pZGlMaW5rXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXhwb3J0L3N5bnRoLmpzIiwiaW1wb3J0IFN5bnRoZXNpemVyIGZyb20gXCIuL1N5bnRoZXNpemVyXCJcclxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vVmlld1wiXHJcbmltcG9ydCBNaWRpTWVzc2FnZUhhbmRsZXIgZnJvbSBcIi4vTWlkaU1lc3NhZ2VIYW5kbGVyXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYk1pZGlMaW5rIHtcclxuICBsb2FkQ2FsbGJhY2s6IChBcnJheUJ1ZmZlcikgPT4gdm9pZFxyXG4gIG1pZGlNZXNzYWdlSGFuZGxlcjogTWlkaU1lc3NhZ2VIYW5kbGVyXHJcbiAgcmVhZHk6IGJvb2xlYW4gPSBmYWxzZVxyXG4gIHN5bnRoOiBTeW50aGVzaXplclxyXG4gIHZpZXc6IFZpZXdcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLm1pZGlNZXNzYWdlSGFuZGxlciA9IG5ldyBNaWRpTWVzc2FnZUhhbmRsZXIoKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMucmVhZHkgPSB0cnVlXHJcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKVxyXG4gIH1cclxuXHJcbiAgc2V0dXAodXJsKSB7XHJcbiAgICBpZiAoIXRoaXMucmVhZHkpIHtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiBvbmxvYWQoKSB7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBvbmxvYWQsIGZhbHNlKVxyXG4gICAgICAgIHRoaXMubG9hZCh1cmwpXHJcbiAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxvYWQodXJsKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZCh1cmwpIHtcclxuICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcblxyXG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSlcclxuICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInXHJcblxyXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihldikge1xyXG4gICAgICBjb25zdCB4aHIgPSBldi50YXJnZXQgYXMgWE1MSHR0cFJlcXVlc3RcclxuXHJcbiAgICAgIHRoaXMub25sb2FkKHhoci5yZXNwb25zZSlcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmxvYWRDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRoaXMubG9hZENhbGxiYWNrKHhoci5yZXNwb25zZSlcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSlcclxuXHJcbiAgICB4aHIuc2VuZCgpXHJcbiAgfVxyXG5cclxuICBvbmxvYWQocmVzcG9uc2U6IEFycmF5QnVmZmVyKSB7XHJcbiAgICBjb25zdCBpbnB1dCA9IG5ldyBVaW50OEFycmF5KHJlc3BvbnNlKVxyXG4gICAgdGhpcy5sb2FkU291bmRGb250KGlucHV0KVxyXG4gIH1cclxuXHJcbiAgbG9hZFNvdW5kRm9udChpbnB1dDogVWludDhBcnJheSkge1xyXG4gICAgbGV0IHN5bnRoOiBTeW50aGVzaXplclxyXG5cclxuICAgIGlmICghdGhpcy5zeW50aCkge1xyXG4gICAgICBjb25zdCBjdHggPSBuZXcgQXVkaW9Db250ZXh0KClcclxuICAgICAgc3ludGggPSB0aGlzLnN5bnRoID0gbmV3IFN5bnRoZXNpemVyKGN0eClcclxuICAgICAgc3ludGguaW5pdCgpXHJcbiAgICAgIHN5bnRoLnJlZnJlc2hJbnN0cnVtZW50cyhpbnB1dClcclxuICAgICAgc3ludGguY29ubmVjdChjdHguZGVzdGluYXRpb24pXHJcbiAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnZpZXcgPSBuZXcgVmlldygpXHJcbiAgICAgIGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihcIi5zeW50aFwiKSEuYXBwZW5kQ2hpbGQodmlldy5kcmF3KHN5bnRoKSlcclxuICAgICAgdGhpcy5taWRpTWVzc2FnZUhhbmRsZXIuc3ludGggPSBzeW50aFxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMub25tZXNzYWdlLmJpbmQodGhpcyksIGZhbHNlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3ludGggPSB0aGlzLnN5bnRoXHJcbiAgICAgIHN5bnRoLnJlZnJlc2hJbnN0cnVtZW50cyhpbnB1dClcclxuICAgIH1cclxuXHJcbiAgICAvLyBsaW5rIHJlYWR5XHJcbiAgICBpZiAod2luZG93Lm9wZW5lcikge1xyXG4gICAgICB3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKFwibGluayxyZWFkeVwiLCAnKicpXHJcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5wYXJlbnQgIT09IHdpbmRvdykge1xyXG4gICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKFwibGluayxyZWFkeVwiLCAnKicpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbm1lc3NhZ2UoZXY6IE1lc3NhZ2VFdmVudCkge1xyXG4gICAgY29uc3QgbXNnID0gZXYuZGF0YS5zcGxpdCgnLCcpXHJcbiAgICBjb25zdCB0eXBlID0gbXNnLnNoaWZ0KClcclxuXHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgY2FzZSAnbWlkaSc6XHJcbiAgICAgICAgdGhpcy5taWRpTWVzc2FnZUhhbmRsZXIucHJvY2Vzc01pZGlNZXNzYWdlKFxyXG4gICAgICAgICAgbXNnLm1hcChmdW5jdGlvbihoZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGhleCwgMTYpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIClcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdsaW5rJzpcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gbXNnLnNoaWZ0KClcclxuICAgICAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcclxuICAgICAgICAgIGNhc2UgJ3JlcXBhdGNoJzpcclxuICAgICAgICAgICAgLy8gVE9ETzogZHVtbXkgZGF0YVxyXG4gICAgICAgICAgICBpZiAod2luZG93Lm9wZW5lcikge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5vcGVuZXIucG9zdE1lc3NhZ2UoXCJsaW5rLHBhdGNoXCIsICcqJylcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKFwibGluayxwYXRjaFwiLCAnKicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgJ3NldHBhdGNoJzpcclxuICAgICAgICAgICAgLy8gVE9ETzogTk9QXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCd1bmtub3duIGxpbmsgbWVzc2FnZTonLCBjb21tYW5kKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ3Vua25vd24gbWVzc2FnZSB0eXBlJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldExvYWRDYWxsYmFjayhjYWxsYmFjazogKEFycmF5QnVmZmVyKSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmxvYWRDYWxsYmFjayA9IGNhbGxiYWNrXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9XZWJNaWRpTGluay50cyIsImltcG9ydCBTeW50aGVzaXplck5vdGUgZnJvbSBcIi4vU3ludGhlc2l6ZXJOb3RlXCJcclxuaW1wb3J0IHBhcnNlIGZyb20gXCIuL1BhcnNlclwiXHJcbmltcG9ydCBTb3VuZEZvbnQgZnJvbSBcIi4vU291bmRGb250XCJcclxuaW1wb3J0IHsgSW5zdHJ1bWVudFN0YXRlIH0gZnJvbSBcIi4vU3ludGhlc2l6ZXJOb3RlXCJcclxuXHJcbmNvbnN0IEJBU0VfVk9MVU1FID0gMC40XHJcblxyXG5jbGFzcyBDaGFubmVsIHtcclxuICBpbnN0cnVtZW50ID0gMFxyXG4gIHZvbHVtZSA9IDBcclxuICBwaXRjaEJlbmQgPSAwXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPSAwXHJcbiAgcGFucG90ID0gMFxyXG4gIGN1cnJlbnROb3RlT246IFN5bnRoZXNpemVyTm90ZVtdID0gW11cclxufVxyXG5cclxuaW50ZXJmYWNlIFZpZXcge1xyXG4gIGRyYXcoKVxyXG4gIHJlbW92ZSgpXHJcbiAgZ2V0SW5zdHJ1bWVudEVsZW1lbnQoKVxyXG4gIGdldEtleUVsZW1lbnQoKVxyXG4gIG5vdGVPbihjaGFubmVsTnVtYmVyOiBudW1iZXIsIGtleTogbnVtYmVyKVxyXG4gIG5vdGVPZmYoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlcilcclxuICBwcm9ncmFtQ2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgaW5zdHJ1bWVudDogbnVtYmVyKVxyXG4gIHZvbHVtZUNoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHZvbHVtZTogbnVtYmVyKVxyXG4gIHBhbnBvdENoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHBhbnBvdDogbnVtYmVyKVxyXG4gIHBpdGNoQmVuZChjaGFubmVsTnVtYmVyOiBudW1iZXIsIHBpdGNoQmVuZDogbnVtYmVyKVxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWxOdW1iZXI6IG51bWJlciwgc2Vuc2l0aXZpdHk6IG51bWJlcilcclxufVxyXG5cclxuY2xhc3MgRHVtbXlWaWV3IGltcGxlbWVudHMgVmlldyB7XHJcbiAgZHJhdygpIHsgfVxyXG4gIHJlbW92ZSgpIHsgfVxyXG4gIGdldEluc3RydW1lbnRFbGVtZW50KCkgeyB9XHJcbiAgZ2V0S2V5RWxlbWVudCgpIHsgfVxyXG4gIG5vdGVPbigpIHsgfVxyXG4gIG5vdGVPZmYoKSB7IH1cclxuICBwcm9ncmFtQ2hhbmdlKCkgeyB9XHJcbiAgdm9sdW1lQ2hhbmdlKCkgeyB9XHJcbiAgcGFucG90Q2hhbmdlKCkgeyB9XHJcbiAgcGl0Y2hCZW5kKCkgeyB9XHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoKSB7IH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ludGhlc2l6ZXIge1xyXG4gIGJhbms6IG51bWJlciA9IDBcclxuICBidWZmZXJTaXplOiBudW1iZXIgPSAxMDI0XHJcbiAgY3R4OiBBdWRpb0NvbnRleHRcclxuICBnYWluTWFzdGVyOiBHYWluTm9kZVxyXG4gIGNoYW5uZWxzOiBDaGFubmVsW10gPSBbXVxyXG4gIG1hc3RlclZvbHVtZTogbnVtYmVyID0gMS4wXHJcbiAgdmlldzogVmlldyA9IG5ldyBEdW1teVZpZXcoKVxyXG4gIHNvdW5kRm9udDogU291bmRGb250XHJcblxyXG4gIGNvbnN0cnVjdG9yKGN0eCkge1xyXG4gICAgdGhpcy5jdHggPSBjdHhcclxuICAgIHRoaXMuZ2Fpbk1hc3RlciA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKVxyXG4gICAgdGhpcy5zZXRNYXN0ZXJWb2x1bWUodGhpcy5tYXN0ZXJWb2x1bWUpXHJcbiAgICB0aGlzLmluaXQoKVxyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xyXG4gICAgICB0aGlzLmNoYW5uZWxzLnB1c2gobmV3IENoYW5uZWwoKSlcclxuICAgICAgdGhpcy5wcm9ncmFtQ2hhbmdlKGksIGkgIT09IDkgPyBpIDogMClcclxuICAgICAgdGhpcy52b2x1bWVDaGFuZ2UoaSwgMHg2NClcclxuICAgICAgdGhpcy5wYW5wb3RDaGFuZ2UoaSwgMHg0MClcclxuICAgICAgdGhpcy5waXRjaEJlbmQoaSwgMHgwMCwgMHg0MCk7IC8vIDgxOTJcclxuICAgICAgdGhpcy5waXRjaEJlbmRTZW5zaXRpdml0eShpLCAyKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVmcmVzaEluc3RydW1lbnRzKGlucHV0OiBVaW50OEFycmF5KSB7XHJcbiAgICBjb25zdCBwYXJzZXIgPSBwYXJzZShpbnB1dClcclxuICAgIHRoaXMuc291bmRGb250ID0gbmV3IFNvdW5kRm9udChwYXJzZXIpXHJcbiAgfVxyXG5cclxuICBjb25uZWN0KGRlc3RpbmF0aW9uKSB7XHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIuY29ubmVjdChkZXN0aW5hdGlvbilcclxuICB9XHJcblxyXG4gIHNldE1hc3RlclZvbHVtZSh2b2x1bWUpIHtcclxuICAgIHRoaXMubWFzdGVyVm9sdW1lID0gdm9sdW1lXHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIuZ2Fpbi52YWx1ZSA9IEJBU0VfVk9MVU1FICogdm9sdW1lIC8gMHg4MDAwXHJcbiAgfVxyXG5cclxuICBub3RlT24oY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnNvdW5kRm9udCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBjaGFubmVsTnVtYmVyID09PSA5ID8gMTI4IDogdGhpcy5iYW5rXHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGNvbnN0IG5vdGVJbmZvID0gdGhpcy5zb3VuZEZvbnQuZ2V0SW5zdHJ1bWVudEtleShiYW5rTnVtYmVyLCBjaGFubmVsLmluc3RydW1lbnQsIGtleSwgdmVsb2NpdHkpXHJcblxyXG4gICAgaWYgKCFub3RlSW5mbykge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFucG90ID0gY2hhbm5lbC5wYW5wb3QgLSA2NFxyXG4gICAgcGFucG90IC89IHBhbnBvdCA8IDAgPyA2NCA6IDYzXHJcblxyXG4gICAgLy8gY3JlYXRlIG5vdGUgaW5mb3JtYXRpb25cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXk6IEluc3RydW1lbnRTdGF0ZSA9IHtcclxuICAgICAgY2hhbm5lbDogY2hhbm5lbE51bWJlcixcclxuICAgICAga2V5OiBrZXksXHJcbiAgICAgIHZlbG9jaXR5OiB2ZWxvY2l0eSxcclxuICAgICAgcGFucG90OiBwYW5wb3QsXHJcbiAgICAgIHZvbHVtZTogY2hhbm5lbC52b2x1bWUgLyAxMjcsXHJcbiAgICAgIHBpdGNoQmVuZDogY2hhbm5lbC5waXRjaEJlbmQgLSAweDIwMDAsXHJcbiAgICAgIHBpdGNoQmVuZFNlbnNpdGl2aXR5OiBjaGFubmVsLnBpdGNoQmVuZFNlbnNpdGl2aXR5XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbm90ZSBvblxyXG4gICAgY29uc3Qgbm90ZSA9IG5ldyBTeW50aGVzaXplck5vdGUodGhpcy5jdHgsIHRoaXMuZ2Fpbk1hc3Rlciwgbm90ZUluZm8sIGluc3RydW1lbnRLZXkpXHJcbiAgICBub3RlLm5vdGVPbigpXHJcbiAgICBjaGFubmVsLmN1cnJlbnROb3RlT24ucHVzaChub3RlKVxyXG5cclxuICAgIHRoaXMudmlldy5ub3RlT24oY2hhbm5lbE51bWJlciwga2V5KVxyXG4gIH1cclxuXHJcbiAgbm90ZU9mZihjaGFubmVsTnVtYmVyOiBudW1iZXIsIGtleTogbnVtYmVyLCBfdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnNvdW5kRm9udCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBjaGFubmVsTnVtYmVyID09PSA5ID8gMTI4IDogdGhpcy5iYW5rXHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXkgPSB0aGlzLnNvdW5kRm9udC5nZXRJbnN0cnVtZW50S2V5KGJhbmtOdW1iZXIsIGNoYW5uZWwuaW5zdHJ1bWVudCwga2V5KVxyXG5cclxuICAgIGlmICghaW5zdHJ1bWVudEtleSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjdXJyZW50Tm90ZU9uID0gY2hhbm5lbC5jdXJyZW50Tm90ZU9uXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gY3VycmVudE5vdGVPbi5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XHJcbiAgICAgIGNvbnN0IG5vdGUgPSBjdXJyZW50Tm90ZU9uW2ldXHJcbiAgICAgIGlmIChub3RlLmtleSA9PT0ga2V5KSB7XHJcbiAgICAgICAgbm90ZS5ub3RlT2ZmKClcclxuICAgICAgICBjdXJyZW50Tm90ZU9uLnNwbGljZShpLCAxKVxyXG4gICAgICAgIC0taVxyXG4gICAgICAgIC0taWxcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlldy5ub3RlT2ZmKGNoYW5uZWxOdW1iZXIsIGtleSlcclxuICB9XHJcblxyXG4gIHByb2dyYW1DaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBpbnN0cnVtZW50OiBudW1iZXIpIHtcclxuICAgIHRoaXMudmlldy5wcm9ncmFtQ2hhbmdlKGNoYW5uZWxOdW1iZXIsIGluc3RydW1lbnQpXHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLmluc3RydW1lbnQgPSBpbnN0cnVtZW50XHJcbiAgfVxyXG5cclxuICB2b2x1bWVDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCB2b2x1bWU6IG51bWJlcikge1xyXG4gICAgdGhpcy52aWV3LnZvbHVtZUNoYW5nZShjaGFubmVsTnVtYmVyLCB2b2x1bWUpXHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLnZvbHVtZSA9IHZvbHVtZVxyXG4gIH1cclxuXHJcbiAgcGFucG90Q2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgcGFucG90OiBudW1iZXIpIHtcclxuICAgIHRoaXMudmlldy5wYW5wb3RDaGFuZ2UoY2hhbm5lbE51bWJlciwgcGFucG90KVxyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS5wYW5wb3QgPSBwYW5wb3RcclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZChjaGFubmVsTnVtYmVyOiBudW1iZXIsIGxvd2VyQnl0ZTogbnVtYmVyLCBoaWdoZXJCeXRlOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGJlbmQgPSAobG93ZXJCeXRlICYgMHg3ZikgfCAoKGhpZ2hlckJ5dGUgJiAweDdmKSA8PCA3KVxyXG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl1cclxuICAgIGNvbnN0IGN1cnJlbnROb3RlT24gPSBjaGFubmVsLmN1cnJlbnROb3RlT25cclxuICAgIGNvbnN0IGNhbGN1bGF0ZWQgPSBiZW5kIC0gMHgyMDAwXHJcblxyXG4gICAgdGhpcy52aWV3LnBpdGNoQmVuZChjaGFubmVsTnVtYmVyLCBjYWxjdWxhdGVkKVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGN1cnJlbnROb3RlT24ubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgICBjdXJyZW50Tm90ZU9uW2ldLnVwZGF0ZVBpdGNoQmVuZChjYWxjdWxhdGVkKVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5uZWwucGl0Y2hCZW5kID0gYmVuZFxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBzZW5zaXRpdml0eTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnZpZXcucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbE51bWJlciwgc2Vuc2l0aXZpdHkpXHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLnBpdGNoQmVuZFNlbnNpdGl2aXR5ID0gc2Vuc2l0aXZpdHlcclxuICB9XHJcblxyXG4gIGFsbFNvdW5kT2ZmKGNoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gICAgY29uc3QgY3VycmVudE5vdGVPbiA9IHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl0uY3VycmVudE5vdGVPblxyXG5cclxuICAgIHdoaWxlIChjdXJyZW50Tm90ZU9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5ub3RlT2ZmKGNoYW5uZWxOdW1iZXIsIGN1cnJlbnROb3RlT25bMF0ua2V5LCAwKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzZXRBbGxDb250cm9sKGNoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gICAgdGhpcy5waXRjaEJlbmQoY2hhbm5lbE51bWJlciwgMHgwMCwgMHg0MCk7IC8vIDgxOTJcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N5bnRoZXNpemVyLnRzIiwiaW1wb3J0IHsgTm90ZUluZm8gfSBmcm9tIFwiLi9Tb3VuZEZvbnRcIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnN0cnVtZW50U3RhdGUge1xyXG4gIGNoYW5uZWw6IG51bWJlclxyXG4gIGtleTogbnVtYmVyXHJcbiAgdm9sdW1lOiBudW1iZXJcclxuICBwYW5wb3Q6IG51bWJlclxyXG4gIHZlbG9jaXR5OiBudW1iZXJcclxuICBwaXRjaEJlbmQ6IG51bWJlclxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5OiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ludGhlc2l6ZXJOb3RlIHtcclxuXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAvLyBhdWRpbyBub2RlXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgYXVkaW9CdWZmZXI6IEF1ZGlvQnVmZmVyXHJcbiAgYnVmZmVyU291cmNlOiBBdWRpb0J1ZmZlclNvdXJjZU5vZGVcclxuICBwYW5uZXI6IFBhbm5lck5vZGVcclxuICBnYWluT3V0cHV0OiBHYWluTm9kZVxyXG4gIGN0eDogQXVkaW9Db250ZXh0XHJcbiAgZGVzdGluYXRpb246IEF1ZGlvTm9kZVxyXG4gIGZpbHRlcjogQmlxdWFkRmlsdGVyTm9kZVxyXG4gIG5vdGVJbmZvOiBOb3RlSW5mb1xyXG4gIGluc3RydW1lbnQ6IEluc3RydW1lbnRTdGF0ZVxyXG4gIGNoYW5uZWw6IG51bWJlclxyXG4gIGtleTogbnVtYmVyXHJcbiAgdmVsb2NpdHk6IG51bWJlclxyXG4gIHBsYXliYWNrUmF0ZTogbnVtYmVyXHJcbiAgdm9sdW1lOiBudW1iZXJcclxuICBwYW5wb3Q6IG51bWJlclxyXG4gIHBpdGNoQmVuZDogbnVtYmVyXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHk6IG51bWJlclxyXG5cclxuICAvLyBzdGF0ZVxyXG4gIHN0YXJ0VGltZTogbnVtYmVyXHJcbiAgY29tcHV0ZWRQbGF5YmFja1JhdGU6IG51bWJlclxyXG5cclxuICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCwgZGVzdGluYXRpb246IEF1ZGlvTm9kZSwgbm90ZUluZm86IE5vdGVJbmZvLCBpbnN0cnVtZW50OiBJbnN0cnVtZW50U3RhdGUpIHtcclxuICAgIHRoaXMuY3R4ID0gY3R4XHJcbiAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb25cclxuICAgIHRoaXMubm90ZUluZm8gPSBub3RlSW5mb1xyXG4gICAgdGhpcy5wbGF5YmFja1JhdGUgPSBub3RlSW5mby5wbGF5YmFja1JhdGUoaW5zdHJ1bWVudC5rZXkpXHJcbiAgICB0aGlzLmluc3RydW1lbnQgPSBpbnN0cnVtZW50XHJcbiAgICB0aGlzLmNoYW5uZWwgPSBpbnN0cnVtZW50LmNoYW5uZWxcclxuICAgIHRoaXMua2V5ID0gaW5zdHJ1bWVudC5rZXlcclxuICAgIHRoaXMudmVsb2NpdHkgPSBpbnN0cnVtZW50LnZlbG9jaXR5XHJcbiAgICB0aGlzLnZvbHVtZSA9IGluc3RydW1lbnQudm9sdW1lXHJcbiAgICB0aGlzLnBhbnBvdCA9IGluc3RydW1lbnQucGFucG90XHJcbiAgICB0aGlzLnBpdGNoQmVuZCA9IGluc3RydW1lbnQucGl0Y2hCZW5kXHJcbiAgICB0aGlzLnBpdGNoQmVuZFNlbnNpdGl2aXR5ID0gaW5zdHJ1bWVudC5waXRjaEJlbmRTZW5zaXRpdml0eVxyXG4gICAgdGhpcy5zdGFydFRpbWUgPSBjdHguY3VycmVudFRpbWVcclxuICAgIHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUgPSB0aGlzLnBsYXliYWNrUmF0ZVxyXG4gIH1cclxuXHJcbiAgbm90ZU9uKCkge1xyXG4gICAgY29uc3QgeyBjdHgsIG5vdGVJbmZvIH0gPSB0aGlzXHJcblxyXG4gICAgY29uc3Qgc2FtcGxlID0gbm90ZUluZm8uc2FtcGxlLnN1YmFycmF5KDAsIG5vdGVJbmZvLnNhbXBsZS5sZW5ndGggKyBub3RlSW5mby5lbmQpXHJcbiAgICB0aGlzLmF1ZGlvQnVmZmVyID0gY3R4LmNyZWF0ZUJ1ZmZlcigxLCBzYW1wbGUubGVuZ3RoLCBub3RlSW5mby5zYW1wbGVSYXRlKVxyXG5cclxuICAgIGNvbnN0IGNoYW5uZWxEYXRhID0gdGhpcy5hdWRpb0J1ZmZlci5nZXRDaGFubmVsRGF0YSgwKVxyXG4gICAgY2hhbm5lbERhdGEuc2V0KHNhbXBsZSlcclxuXHJcbiAgICAvLyBidWZmZXIgc291cmNlXHJcbiAgICBjb25zdCBidWZmZXJTb3VyY2UgPSBjdHguY3JlYXRlQnVmZmVyU291cmNlKClcclxuICAgIGJ1ZmZlclNvdXJjZS5idWZmZXIgPSB0aGlzLmF1ZGlvQnVmZmVyXHJcbiAgICBidWZmZXJTb3VyY2UubG9vcCA9ICh0aGlzLmNoYW5uZWwgIT09IDkpXHJcbiAgICBidWZmZXJTb3VyY2UubG9vcFN0YXJ0ID0gbm90ZUluZm8ubG9vcFN0YXJ0IC8gbm90ZUluZm8uc2FtcGxlUmF0ZVxyXG4gICAgYnVmZmVyU291cmNlLmxvb3BFbmQgPSBub3RlSW5mby5sb29wRW5kIC8gbm90ZUluZm8uc2FtcGxlUmF0ZVxyXG4gICAgYnVmZmVyU291cmNlLm9uZW5kZWQgPSAoKSA9PiB0aGlzLmRpc2Nvbm5lY3QoKVxyXG4gICAgdGhpcy5idWZmZXJTb3VyY2UgPSBidWZmZXJTb3VyY2VcclxuICAgIHRoaXMudXBkYXRlUGl0Y2hCZW5kKHRoaXMucGl0Y2hCZW5kKVxyXG5cclxuICAgIC8vIGF1ZGlvIG5vZGVcclxuICAgIGNvbnN0IHBhbm5lciA9IHRoaXMucGFubmVyID0gY3R4LmNyZWF0ZVBhbm5lcigpXHJcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmdhaW5PdXRwdXQgPSBjdHguY3JlYXRlR2FpbigpXHJcbiAgICBjb25zdCBvdXRwdXRHYWluID0gb3V0cHV0LmdhaW5cclxuXHJcbiAgICAvLyBmaWx0ZXJcclxuICAgIGNvbnN0IGZpbHRlciA9IGN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKVxyXG4gICAgZmlsdGVyLnR5cGUgPSBcImxvd3Bhc3NcIlxyXG4gICAgdGhpcy5maWx0ZXIgPSBmaWx0ZXJcclxuXHJcbiAgICAvLyBwYW5wb3RcclxuICAgIHBhbm5lci5wYW5uaW5nTW9kZWwgPSBcImVxdWFscG93ZXJcIlxyXG4gICAgcGFubmVyLnNldFBvc2l0aW9uKFxyXG4gICAgICBNYXRoLnNpbih0aGlzLnBhbnBvdCAqIE1hdGguUEkgLyAyKSxcclxuICAgICAgMCxcclxuICAgICAgTWF0aC5jb3ModGhpcy5wYW5wb3QgKiBNYXRoLlBJIC8gMilcclxuICAgIClcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gQXR0YWNrLCBEZWNheSwgU3VzdGFpblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGNvbnN0IG5vdyA9IHRoaXMuY3R4LmN1cnJlbnRUaW1lXHJcbiAgICBjb25zdCB2b2xBdHRhY2tUaW1lID0gbm93ICsgbm90ZUluZm8udm9sQXR0YWNrXHJcbiAgICBjb25zdCBtb2RBdHRhY2tUaW1lID0gbm93ICsgbm90ZUluZm8ubW9kQXR0YWNrXHJcbiAgICBjb25zdCB2b2xEZWNheSA9IHZvbEF0dGFja1RpbWUgKyBub3RlSW5mby52b2xEZWNheVxyXG4gICAgY29uc3QgbW9kRGVjYXkgPSBtb2RBdHRhY2tUaW1lICsgbm90ZUluZm8ubW9kRGVjYXlcclxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5vdGVJbmZvLnN0YXJ0IC8gbm90ZUluZm8uc2FtcGxlUmF0ZVxyXG5cclxuICAgIGNvbnN0IGF0dGFja1ZvbHVtZSA9IHRoaXMudm9sdW1lICogKHRoaXMudmVsb2NpdHkgLyAxMjcpXHJcbiAgICBvdXRwdXRHYWluLnNldFZhbHVlQXRUaW1lKDAsIG5vdylcclxuICAgIG91dHB1dEdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoYXR0YWNrVm9sdW1lLCB2b2xBdHRhY2tUaW1lKVxyXG4gICAgb3V0cHV0R2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShhdHRhY2tWb2x1bWUgKiAoMSAtIG5vdGVJbmZvLnZvbFN1c3RhaW4pLCB2b2xEZWNheSlcclxuXHJcbiAgICBmaWx0ZXIuUS5zZXRWYWx1ZUF0VGltZShub3RlSW5mby5pbml0aWFsRmlsdGVyUSAvIDEwLCBub3cpXHJcbiAgICBjb25zdCBiYXNlRnJlcSA9IGFtb3VudFRvRnJlcShub3RlSW5mby5pbml0aWFsRmlsdGVyRmMpXHJcbiAgICBjb25zdCBwZWVrRnJlcSA9IGFtb3VudFRvRnJlcShub3RlSW5mby5pbml0aWFsRmlsdGVyRmMgKyBub3RlSW5mby5tb2RFbnZUb0ZpbHRlckZjKVxyXG4gICAgY29uc3Qgc3VzdGFpbkZyZXEgPSBiYXNlRnJlcSArIChwZWVrRnJlcSAtIGJhc2VGcmVxKSAqICgxIC0gbm90ZUluZm8ubW9kU3VzdGFpbilcclxuICAgIGZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoYmFzZUZyZXEsIG5vdylcclxuICAgIGZpbHRlci5mcmVxdWVuY3kubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUocGVla0ZyZXEsIG1vZEF0dGFja1RpbWUpXHJcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHN1c3RhaW5GcmVxLCBtb2REZWNheSlcclxuXHJcbiAgICBmdW5jdGlvbiBhbW91bnRUb0ZyZXEodmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gTWF0aC5wb3coMiwgKHZhbCAtIDY5MDApIC8gMTIwMCkgKiA0NDBcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25uZWN0XHJcbiAgICBidWZmZXJTb3VyY2UuY29ubmVjdChmaWx0ZXIpXHJcbiAgICBmaWx0ZXIuY29ubmVjdChwYW5uZXIpXHJcbiAgICBwYW5uZXIuY29ubmVjdChvdXRwdXQpXHJcbiAgICBvdXRwdXQuY29ubmVjdCh0aGlzLmRlc3RpbmF0aW9uKVxyXG5cclxuICAgIC8vIGZpcmVcclxuICAgIGJ1ZmZlclNvdXJjZS5zdGFydCgwLCBzdGFydFRpbWUpXHJcbiAgfVxyXG5cclxuICBub3RlT2ZmKCkge1xyXG4gICAgY29uc3QgeyBub3RlSW5mbywgYnVmZmVyU291cmNlIH0gPSB0aGlzXHJcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmdhaW5PdXRwdXRcclxuICAgIGNvbnN0IG5vdyA9IHRoaXMuY3R4LmN1cnJlbnRUaW1lXHJcbiAgICBjb25zdCB2b2xFbmRUaW1lID0gbm93ICsgbm90ZUluZm8udm9sUmVsZWFzZVxyXG4gICAgY29uc3QgbW9kRW5kVGltZSA9IG5vdyArIG5vdGVJbmZvLm1vZFJlbGVhc2VcclxuXHJcbiAgICBpZiAoIXRoaXMuYXVkaW9CdWZmZXIpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWdub3JlIG5vdGUgb2ZmIGZvciByaHl0aG0gdHJhY2tcclxuICAgIGlmICh0aGlzLmNoYW5uZWwgPT09IDkpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFJlbGVhc2VcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBvdXRwdXQuZ2Fpbi5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoMClcclxuICAgIG91dHB1dC5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIHZvbEVuZFRpbWUpXHJcbiAgICBidWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLmNhbmNlbFNjaGVkdWxlZFZhbHVlcygwKVxyXG4gICAgYnVmZmVyU291cmNlLnBsYXliYWNrUmF0ZS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSh0aGlzLmNvbXB1dGVkUGxheWJhY2tSYXRlLCBtb2RFbmRUaW1lKVxyXG5cclxuICAgIGJ1ZmZlclNvdXJjZS5sb29wID0gZmFsc2VcclxuICAgIGJ1ZmZlclNvdXJjZS5zdG9wKHZvbEVuZFRpbWUpXHJcbiAgfVxyXG5cclxuICBkaXNjb25uZWN0KCkge1xyXG4gICAgdGhpcy5idWZmZXJTb3VyY2UuZGlzY29ubmVjdCgwKVxyXG4gICAgdGhpcy5wYW5uZXIuZGlzY29ubmVjdCgwKVxyXG4gICAgdGhpcy5nYWluT3V0cHV0LmRpc2Nvbm5lY3QoMClcclxuICB9XHJcblxyXG4gIHNjaGVkdWxlUGxheWJhY2tSYXRlKCkge1xyXG4gICAgY29uc3QgeyBub3RlSW5mbyB9ID0gdGhpc1xyXG4gICAgY29uc3QgcGxheWJhY2tSYXRlID0gdGhpcy5idWZmZXJTb3VyY2UucGxheWJhY2tSYXRlXHJcbiAgICBjb25zdCBjb21wdXRlZCA9IHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGVcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGFydFRpbWVcclxuICAgIGNvbnN0IG1vZEF0dGFjayA9IHN0YXJ0ICsgbm90ZUluZm8ubW9kQXR0YWNrXHJcbiAgICBjb25zdCBtb2REZWNheSA9IG1vZEF0dGFjayArIG5vdGVJbmZvLm1vZERlY2F5XHJcbiAgICBjb25zdCBwZWVrUGl0Y2ggPSBjb21wdXRlZCAqIE1hdGgucG93KFxyXG4gICAgICBNYXRoLnBvdygyLCAxIC8gMTIpLFxyXG4gICAgICBub3RlSW5mby5tb2RFbnZUb1BpdGNoICogbm90ZUluZm8uc2NhbGVUdW5pbmdcclxuICAgIClcclxuXHJcbiAgICBwbGF5YmFja1JhdGUuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKDApXHJcbiAgICBwbGF5YmFja1JhdGUuc2V0VmFsdWVBdFRpbWUoY29tcHV0ZWQsIHN0YXJ0KVxyXG4gICAgcGxheWJhY2tSYXRlLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHBlZWtQaXRjaCwgbW9kQXR0YWNrKVxyXG4gICAgcGxheWJhY2tSYXRlLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGNvbXB1dGVkICsgKHBlZWtQaXRjaCAtIGNvbXB1dGVkKSAqICgxIC0gbm90ZUluZm8ubW9kU3VzdGFpbiksIG1vZERlY2F5KVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUGl0Y2hCZW5kKHBpdGNoQmVuZDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNvbXB1dGVkUGxheWJhY2tSYXRlID0gdGhpcy5wbGF5YmFja1JhdGUgKiBNYXRoLnBvdyhcclxuICAgICAgTWF0aC5wb3coMiwgMSAvIDEyKSxcclxuICAgICAgKFxyXG4gICAgICAgIHRoaXMucGl0Y2hCZW5kU2Vuc2l0aXZpdHkgKiAoXHJcbiAgICAgICAgICBwaXRjaEJlbmQgLyAocGl0Y2hCZW5kIDwgMCA/IDgxOTIgOiA4MTkxKVxyXG4gICAgICAgIClcclxuICAgICAgKSAqIHRoaXMubm90ZUluZm8uc2NhbGVUdW5pbmdcclxuICAgIClcclxuICAgIHRoaXMuc2NoZWR1bGVQbGF5YmFja1JhdGUoKVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3ludGhlc2l6ZXJOb3RlLnRzIiwiaW1wb3J0IHsgUGFyc2VSZXN1bHQgfSBmcm9tIFwiLi9QYXJzZXJcIlxyXG5pbXBvcnQgeyBJbnN0cnVtZW50QmFnLCBQcmVzZXRCYWcsIEluc3RydW1lbnQsIE1vZHVsYXRvckxpc3QsIFByZXNldEhlYWRlciwgUmFuZ2VWYWx1ZSwgQW1vdW50VmFsdWUgfSBmcm9tIFwiLi9TdHJ1Y3RzXCJcclxuXHJcbi8qKlxyXG4gKiBQYXJzZXIg44Gn6Kqt44G/6L6844KT44Gg44K144Km44Oz44OJ44OV44Kp44Oz44OI44Gu44OH44O844K/44KSXHJcbiAqIFN5bnRoZXNpemVyIOOBi+OCieWIqeeUqOOBl+OChOOBmeOBhOW9ouOBq+OBmeOCi+OCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291bmRGb250IHtcclxuICBiYW5rU2V0OiB7IFtpbmRleDogbnVtYmVyXTogQmFuayB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBhcnNlcikge1xyXG4gICAgdGhpcy5iYW5rU2V0ID0gY3JlYXRlQWxsSW5zdHJ1bWVudHMocGFyc2VyKVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5zdHJ1bWVudEtleShiYW5rTnVtYmVyLCBpbnN0cnVtZW50TnVtYmVyLCBrZXksIHZlbG9jaXR5ID0gMTAwKSB7XHJcbiAgICBjb25zdCBiYW5rID0gdGhpcy5iYW5rU2V0W2JhbmtOdW1iZXJdXHJcbiAgICBpZiAoIWJhbmspIHtcclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgIFwiYmFuayBub3QgZm91bmQ6IGJhbms9JXMgaW5zdHJ1bWVudD0lc1wiLFxyXG4gICAgICAgIGJhbmtOdW1iZXIsXHJcbiAgICAgICAgaW5zdHJ1bWVudE51bWJlclxyXG4gICAgICApXHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaW5zdHJ1bWVudCA9IGJhbmtbaW5zdHJ1bWVudE51bWJlcl1cclxuICAgIGlmICghaW5zdHJ1bWVudCkge1xyXG4gICAgICAvLyBUT0RPXHJcbiAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICBcImluc3RydW1lbnQgbm90IGZvdW5kOiBiYW5rPSVzIGluc3RydW1lbnQ9JXNcIixcclxuICAgICAgICBiYW5rTnVtYmVyLFxyXG4gICAgICAgIGluc3RydW1lbnROdW1iZXJcclxuICAgICAgKVxyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXkgPSBpbnN0cnVtZW50Lm5vdGVzLmZpbHRlcihpID0+IHtcclxuICAgICAgbGV0IGlzSW5LZXlSYW5nZSA9IGZhbHNlXHJcbiAgICAgIGlmIChpLmtleVJhbmdlKSB7XHJcbiAgICAgICAgaXNJbktleVJhbmdlID0ga2V5ID49IGkua2V5UmFuZ2UubG8gJiYga2V5IDw9IGkua2V5UmFuZ2UuaGlcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGlzSW5WZWxSYW5nZSA9IHRydWVcclxuICAgICAgaWYgKGkudmVsUmFuZ2UpIHtcclxuICAgICAgICBpc0luVmVsUmFuZ2UgPSB2ZWxvY2l0eSA+PSBpLnZlbFJhbmdlLmxvICYmIHZlbG9jaXR5IDw9IGkudmVsUmFuZ2UuaGlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGlzSW5LZXlSYW5nZSAmJiBpc0luVmVsUmFuZ2VcclxuICAgIH0pWzBdXHJcblxyXG4gICAgaWYgKCFpbnN0cnVtZW50S2V5KSB7XHJcbiAgICAgIC8vIFRPRE9cclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgIFwiaW5zdHJ1bWVudCBub3QgZm91bmQ6IGJhbms9JXMgaW5zdHJ1bWVudD0lcyBrZXk9JXNcIixcclxuICAgICAgICBiYW5rTnVtYmVyLFxyXG4gICAgICAgIGluc3RydW1lbnROdW1iZXIsXHJcbiAgICAgICAga2V5XHJcbiAgICAgIClcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaW5zdHJ1bWVudEtleVxyXG4gIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIFpvbmVJbmZvIHtcclxuICBnZW5lcmF0b3I6IE1vZEdlblxyXG4gIGdlbmVyYXRvclNlcXVlbmNlOiBNb2R1bGF0b3JMaXN0W11cclxuICBtb2R1bGF0b3I6IE1vZEdlbixcclxuICBtb2R1bGF0b3JTZXF1ZW5jZTogTW9kdWxhdG9yTGlzdFtdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnQoeyBpbnN0cnVtZW50LCBpbnN0cnVtZW50Wm9uZSwgaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3IsIGluc3RydW1lbnRab25lTW9kdWxhdG9yIH06IFxyXG4gIHsgaW5zdHJ1bWVudDogSW5zdHJ1bWVudFtdLCBcclxuICAgIGluc3RydW1lbnRab25lOiBJbnN0cnVtZW50QmFnW10sIFxyXG4gICAgaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3I6IE1vZHVsYXRvckxpc3RbXSwgXHJcbiAgICBpbnN0cnVtZW50Wm9uZU1vZHVsYXRvcjogTW9kdWxhdG9yTGlzdFtdIFxyXG4gIH0pIHtcclxuICBjb25zdCB6b25lID0gaW5zdHJ1bWVudFpvbmVcclxuICBjb25zdCBvdXRwdXQ6IHsgbmFtZTogc3RyaW5nLCBpbmZvOiBab25lSW5mb1tdIH1bXSA9IFtdXHJcblxyXG4gIC8vIGluc3RydW1lbnQgLT4gaW5zdHJ1bWVudCBiYWcgLT4gZ2VuZXJhdG9yIC8gbW9kdWxhdG9yXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnN0cnVtZW50Lmxlbmd0aDsgKytpKSB7XHJcbiAgICBjb25zdCBiYWdJbmRleCA9IGluc3RydW1lbnRbaV0uaW5zdHJ1bWVudEJhZ0luZGV4XHJcbiAgICBjb25zdCBiYWdJbmRleEVuZCA9IGluc3RydW1lbnRbaSArIDFdID8gaW5zdHJ1bWVudFtpICsgMV0uaW5zdHJ1bWVudEJhZ0luZGV4IDogem9uZS5sZW5ndGhcclxuICAgIGNvbnN0IHpvbmVJbmZvOiBab25lSW5mb1tdID0gW11cclxuXHJcbiAgICAvLyBpbnN0cnVtZW50IGJhZ1xyXG4gICAgZm9yIChsZXQgaiA9IGJhZ0luZGV4OyBqIDwgYmFnSW5kZXhFbmQ7ICsraikge1xyXG4gICAgICBjb25zdCBpbnN0cnVtZW50R2VuZXJhdG9yID0gY3JlYXRlSW5zdHJ1bWVudEdlbmVyYXRvcih6b25lLCBqLCBpbnN0cnVtZW50Wm9uZUdlbmVyYXRvcilcclxuICAgICAgY29uc3QgaW5zdHJ1bWVudE1vZHVsYXRvciA9IGNyZWF0ZUluc3RydW1lbnRNb2R1bGF0b3Ioem9uZSwgaiwgaW5zdHJ1bWVudFpvbmVNb2R1bGF0b3IpXHJcblxyXG4gICAgICB6b25lSW5mby5wdXNoKHtcclxuICAgICAgICBnZW5lcmF0b3I6IGluc3RydW1lbnRHZW5lcmF0b3IuZ2VuZXJhdG9yLFxyXG4gICAgICAgIGdlbmVyYXRvclNlcXVlbmNlOiBpbnN0cnVtZW50R2VuZXJhdG9yLmdlbmVyYXRvckluZm8sXHJcbiAgICAgICAgbW9kdWxhdG9yOiBpbnN0cnVtZW50TW9kdWxhdG9yLm1vZHVsYXRvcixcclxuICAgICAgICBtb2R1bGF0b3JTZXF1ZW5jZTogaW5zdHJ1bWVudE1vZHVsYXRvci5tb2R1bGF0b3JJbmZvXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0LnB1c2goe1xyXG4gICAgICBuYW1lOiBpbnN0cnVtZW50W2ldLmluc3RydW1lbnROYW1lLFxyXG4gICAgICBpbmZvOiB6b25lSW5mb1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHJldHVybiBvdXRwdXRcclxufVxyXG5cclxuaW50ZXJmYWNlIFByZXNldEluZm8ge1xyXG4gIHByZXNldEdlbmVyYXRvcjogeyBnZW5lcmF0b3I6IE1vZEdlbiwgZ2VuZXJhdG9ySW5mbzogTW9kdWxhdG9yTGlzdFtdIH1cclxuICBwcmVzZXRNb2R1bGF0b3I6IHsgbW9kdWxhdG9yOiBNb2RHZW4sIG1vZHVsYXRvckluZm86IE1vZHVsYXRvckxpc3RbXSB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVByZXNldCh7IHByZXNldEhlYWRlciwgcHJlc2V0Wm9uZSwgcHJlc2V0Wm9uZUdlbmVyYXRvciwgcHJlc2V0Wm9uZU1vZHVsYXRvciB9OiB7XHJcbiAgcHJlc2V0SGVhZGVyOiBQcmVzZXRIZWFkZXJbXSxcclxuICBwcmVzZXRab25lOiBQcmVzZXRCYWdbXSxcclxuICBwcmVzZXRab25lR2VuZXJhdG9yOiBNb2R1bGF0b3JMaXN0W10sXHJcbiAgcHJlc2V0Wm9uZU1vZHVsYXRvcjogTW9kdWxhdG9yTGlzdFtdXHJcbn0pOiB7XHJcbiAgaW5mbzogUHJlc2V0SW5mb1tdLCBcclxuICBoZWFkZXI6IFByZXNldEhlYWRlclxyXG59W10ge1xyXG4gIC8vIHByZXNldCAtPiBwcmVzZXQgYmFnIC0+IGdlbmVyYXRvciAvIG1vZHVsYXRvclxyXG4gIHJldHVybiBwcmVzZXRIZWFkZXIubWFwKChwcmVzZXQsIGkpID0+IHtcclxuICAgIGNvbnN0IG5leHRQcmVzZXQgPSBwcmVzZXRIZWFkZXJbaSArIDFdXHJcbiAgICBjb25zdCBiYWdJbmRleCA9IHByZXNldC5wcmVzZXRCYWdJbmRleFxyXG4gICAgY29uc3QgYmFnSW5kZXhFbmQgPSBuZXh0UHJlc2V0ID8gbmV4dFByZXNldC5wcmVzZXRCYWdJbmRleCA6IHByZXNldFpvbmUubGVuZ3RoXHJcbiAgICBjb25zdCB6b25lSW5mbzogUHJlc2V0SW5mb1tdID0gW11cclxuXHJcbiAgICAvLyBwcmVzZXQgYmFnXHJcbiAgICBmb3IgKGxldCBqID0gYmFnSW5kZXgsIGpsID0gYmFnSW5kZXhFbmQ7IGogPCBqbDsgKytqKSB7XHJcbiAgICAgIHpvbmVJbmZvLnB1c2goe1xyXG4gICAgICAgIHByZXNldEdlbmVyYXRvcjogY3JlYXRlUHJlc2V0R2VuZXJhdG9yKHByZXNldFpvbmUsIGosIHByZXNldFpvbmVHZW5lcmF0b3IpLFxyXG4gICAgICAgIHByZXNldE1vZHVsYXRvcjogY3JlYXRlUHJlc2V0TW9kdWxhdG9yKHByZXNldFpvbmUsIGosIHByZXNldFpvbmVNb2R1bGF0b3IpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaW5mbzogem9uZUluZm8sXHJcbiAgICAgIGhlYWRlcjogcHJlc2V0XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuaW50ZXJmYWNlIEJhbmsge1xyXG4gIFtpbmRleDogbnVtYmVyXToge1xyXG4gICAgbm90ZXM6IE5vdGVJbmZvW11cclxuICAgIG5hbWU6IHN0cmluZ1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQWxsSW5zdHJ1bWVudHMocGFyc2VyOiBQYXJzZVJlc3VsdCk6IHsgW2luZGV4OiBudW1iZXJdOiBCYW5rIH0ge1xyXG4gIGNvbnN0IHByZXNldHMgPSBjcmVhdGVQcmVzZXQocGFyc2VyKVxyXG4gIGNvbnN0IGluc3RydW1lbnRzID0gY3JlYXRlSW5zdHJ1bWVudChwYXJzZXIpXHJcbiAgY29uc3QgYmFua3M6IHsgW2luZGV4OiBudW1iZXJdOiBCYW5rIH0gPSB7fVxyXG5cclxuICBmb3IgKGxldCBwcmVzZXQgb2YgcHJlc2V0cykge1xyXG4gICAgY29uc3QgYmFua051bWJlciA9IHByZXNldC5oZWFkZXIuYmFua1xyXG4gICAgY29uc3QgcHJlc2V0TnVtYmVyID0gcHJlc2V0LmhlYWRlci5wcmVzZXRcclxuXHJcbiAgICBjb25zdCBub3RlczogTm90ZUluZm9bXSA9IHByZXNldC5pbmZvXHJcbiAgICAgIC5tYXAoaW5mbyA9PiBpbmZvLnByZXNldEdlbmVyYXRvci5nZW5lcmF0b3IpXHJcbiAgICAgIC5tYXAoZ2VuZXJhdG9yID0+IHtcclxuICAgICAgICBpZiAoKGdlbmVyYXRvciBhcyBhbnkpLmluc3RydW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaW5zdHJ1bWVudE51bWJlciA9IChnZW5lcmF0b3IgYXMgYW55KS5pbnN0cnVtZW50LmFtb3VudFxyXG4gICAgICAgIGNvbnN0IGluc3RydW1lbnQgPSBpbnN0cnVtZW50c1tpbnN0cnVtZW50TnVtYmVyXVxyXG5cclxuICAgICAgICAvLyB1c2UgdGhlIGZpcnN0IGdlbmVyYXRvciBpbiB0aGUgem9uZSBhcyB0aGUgZGVmYXVsdCB2YWx1ZVxyXG4gICAgICAgIGxldCBiYXNlR2VuZXJhdG9yOiBNb2RHZW5cclxuICAgICAgICBpZiAoaW5zdHJ1bWVudC5pbmZvWzBdLmdlbmVyYXRvcikge1xyXG4gICAgICAgICAgY29uc3QgZ2VuZXJhdG9yID0gaW5zdHJ1bWVudC5pbmZvWzBdLmdlbmVyYXRvclxyXG4gICAgICAgICAgaWYgKChnZW5lcmF0b3IgYXMgYW55KS5zYW1wbGVJRCA9PT0gdW5kZWZpbmVkICYmIGdlbmVyYXRvci5rZXlSYW5nZS5sbyA9PT0gMCAmJiBnZW5lcmF0b3Iua2V5UmFuZ2UuaGkgPT09IDEyNykge1xyXG4gICAgICAgICAgICBiYXNlR2VuZXJhdG9yID0gZ2VuZXJhdG9yXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0cnVtZW50LmluZm9cclxuICAgICAgICAgIC5tYXAoaW5mbyA9PiBjcmVhdGVOb3RlSW5mbyhwYXJzZXIsIGluZm8uZ2VuZXJhdG9yLCBiYXNlR2VuZXJhdG9yKSlcclxuICAgICAgICAgIC5maWx0ZXIoeCA9PiB4KSBhcyBOb3RlSW5mb1tdIC8vIHJlbW92ZSBudWxsXHJcbiAgICAgIH0pXHJcbiAgICAgIC5maWx0ZXIoeCA9PiB4KSAvLyByZW1vdmUgbnVsbFxyXG4gICAgICAucmVkdWNlKChhLCBiKSA9PiBhIS5jb25jYXQoYiEpLCBbXSkgYXMgTm90ZUluZm9bXSAvLyBmbGF0dGVuXHJcblxyXG4gICAgLy8gc2VsZWN0IGJhbmtcclxuICAgIGlmIChiYW5rc1tiYW5rTnVtYmVyXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGJhbmtzW2JhbmtOdW1iZXJdID0ge31cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBiYW5rID0gYmFua3NbYmFua051bWJlcl1cclxuICAgIGJhbmtbcHJlc2V0TnVtYmVyXSA9IHtcclxuICAgICAgbm90ZXMsXHJcbiAgICAgIG5hbWU6IHByZXNldC5oZWFkZXIucHJlc2V0TmFtZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGJhbmtzXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTm90ZUluZm8ge1xyXG4gIHNhbXBsZTogSW50MTZBcnJheVxyXG4gIHNhbXBsZVJhdGU6IG51bWJlclxyXG4gIHNhbXBsZU5hbWU6IHN0cmluZ1xyXG4gIHBsYXliYWNrUmF0ZTogRnVuY3Rpb25cclxuICBzdGFydDogbnVtYmVyXHJcbiAgZW5kOiBudW1iZXJcclxuICBsb29wU3RhcnQ6IG51bWJlclxyXG4gIGxvb3BFbmQ6IG51bWJlclxyXG4gIHZvbEF0dGFjazogbnVtYmVyXHJcbiAgbW9kQXR0YWNrOiBudW1iZXJcclxuICBtb2RFbnZUb1BpdGNoOiBudW1iZXJcclxuICBtb2RFbnZUb0ZpbHRlckZjOiBudW1iZXJcclxuICBpbml0aWFsRmlsdGVyRmM6IG51bWJlclxyXG4gIGluaXRpYWxGaWx0ZXJROiBudW1iZXJcclxuICBmcmVxVmliTEZPOiBudW1iZXJ8dW5kZWZpbmVkXHJcbiAgdm9sRGVjYXk6IG51bWJlclxyXG4gIHZvbFN1c3RhaW46IG51bWJlclxyXG4gIHZvbFJlbGVhc2U6IG51bWJlclxyXG4gIG1vZERlY2F5OiBudW1iZXJcclxuICBtb2RTdXN0YWluOiBudW1iZXJcclxuICBtb2RSZWxlYXNlOiBudW1iZXJcclxuICBzY2FsZVR1bmluZzogbnVtYmVyXHJcbiAga2V5UmFuZ2U6IFJhbmdlVmFsdWVcclxuICB2ZWxSYW5nZTogUmFuZ2VWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVOb3RlSW5mbyhwYXJzZXI6IFBhcnNlUmVzdWx0LCB0YXJnZXRHZW5lcmF0b3I6IE1vZEdlbiwgYmFzZUdlbmVyYXRvcjogTW9kR2VuKTogTm90ZUluZm98bnVsbCB7XHJcbiAgY29uc3QgZ2VuZXJhdG9yID0geyAuLi5iYXNlR2VuZXJhdG9yLCAuLi50YXJnZXRHZW5lcmF0b3IgfVxyXG5cclxuICBjb25zdCB7IGtleVJhbmdlLCBzYW1wbGVJRCwgdmVsUmFuZ2UgfSA9IGdlbmVyYXRvciBhcyBhbnlcclxuICBpZiAoa2V5UmFuZ2UgPT09IHVuZGVmaW5lZCB8fCBzYW1wbGVJRCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH1cclxuXHJcbiAgY29uc3Qgdm9sQXR0YWNrID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2F0dGFja1ZvbEVudicsIC0xMjAwMClcclxuICBjb25zdCB2b2xEZWNheSA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdkZWNheVZvbEVudicsIC0xMjAwMClcclxuICBjb25zdCB2b2xTdXN0YWluID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3N1c3RhaW5Wb2xFbnYnKVxyXG4gIGNvbnN0IHZvbFJlbGVhc2UgPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAncmVsZWFzZVZvbEVudicsIC0xMjAwMClcclxuICBjb25zdCBtb2RBdHRhY2sgPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnYXR0YWNrTW9kRW52JywgLTEyMDAwKVxyXG4gIGNvbnN0IG1vZERlY2F5ID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2RlY2F5TW9kRW52JywgLTEyMDAwKVxyXG4gIGNvbnN0IG1vZFN1c3RhaW4gPSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnc3VzdGFpbk1vZEVudicpXHJcbiAgY29uc3QgbW9kUmVsZWFzZSA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdyZWxlYXNlTW9kRW52JywgLTEyMDAwKVxyXG5cclxuICBjb25zdCB0dW5lID0gKFxyXG4gICAgZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2NvYXJzZVR1bmUnKSArXHJcbiAgICBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZmluZVR1bmUnKSAvIDEwMFxyXG4gIClcclxuICBjb25zdCBzY2FsZSA9IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzY2FsZVR1bmluZycsIDEwMCkgLyAxMDBcclxuICBjb25zdCBmcmVxVmliTEZPID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2ZyZXFWaWJMRk8nKVxyXG4gIGNvbnN0IHNhbXBsZUlkID0gZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3NhbXBsZUlEJylcclxuICBjb25zdCBzYW1wbGVIZWFkZXIgPSBwYXJzZXIuc2FtcGxlSGVhZGVyW3NhbXBsZUlkXVxyXG4gIGNvbnN0IGJhc2VQaXRjaCA9IHR1bmUgKyAoc2FtcGxlSGVhZGVyLnBpdGNoQ29ycmVjdGlvbiAvIDEwMCkgLSBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnb3ZlcnJpZGluZ1Jvb3RLZXknLCBzYW1wbGVIZWFkZXIub3JpZ2luYWxQaXRjaClcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNhbXBsZTogcGFyc2VyLnNhbXBsZVtzYW1wbGVJZF0sXHJcbiAgICBzYW1wbGVSYXRlOiBzYW1wbGVIZWFkZXIuc2FtcGxlUmF0ZSxcclxuICAgIHNhbXBsZU5hbWU6IHNhbXBsZUhlYWRlci5zYW1wbGVOYW1lLFxyXG4gICAgbW9kRW52VG9QaXRjaDogZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ21vZEVudlRvUGl0Y2gnKSAvIDEwMCxcclxuICAgIHNjYWxlVHVuaW5nOiBzY2FsZSxcclxuICAgIHN0YXJ0OlxyXG4gICAgICBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnc3RhcnRBZGRyc0NvYXJzZU9mZnNldCcpICogMzI3NjggK1xyXG4gICAgICBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnc3RhcnRBZGRyc09mZnNldCcpLFxyXG4gICAgZW5kOlxyXG4gICAgICBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZW5kQWRkcnNDb2Fyc2VPZmZzZXQnKSAqIDMyNzY4ICtcclxuICAgICAgZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2VuZEFkZHJzT2Zmc2V0JyksXHJcbiAgICBsb29wU3RhcnQ6IChcclxuICAgICAgLy8oc2FtcGxlSGVhZGVyLnN0YXJ0TG9vcCAtIHNhbXBsZUhlYWRlci5zdGFydCkgK1xyXG4gICAgICAoc2FtcGxlSGVhZGVyLnN0YXJ0TG9vcCkgK1xyXG4gICAgICBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnc3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnKSAqIDMyNzY4ICtcclxuICAgICAgZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3N0YXJ0bG9vcEFkZHJzT2Zmc2V0JylcclxuICAgICksXHJcbiAgICBsb29wRW5kOiAoXHJcbiAgICAgIC8vKHNhbXBsZUhlYWRlci5lbmRMb29wIC0gc2FtcGxlSGVhZGVyLnN0YXJ0KSArXHJcbiAgICAgIChzYW1wbGVIZWFkZXIuZW5kTG9vcCkgK1xyXG4gICAgICBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0JykgKiAzMjc2OCArXHJcbiAgICAgIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdlbmRsb29wQWRkcnNPZmZzZXQnKVxyXG4gICAgKSxcclxuICAgIHZvbEF0dGFjazogTWF0aC5wb3coMiwgdm9sQXR0YWNrIC8gMTIwMCksXHJcbiAgICB2b2xEZWNheTogTWF0aC5wb3coMiwgdm9sRGVjYXkgLyAxMjAwKSxcclxuICAgIHZvbFN1c3RhaW46IHZvbFN1c3RhaW4gLyAxMDAwLFxyXG4gICAgdm9sUmVsZWFzZTogTWF0aC5wb3coMiwgdm9sUmVsZWFzZSAvIDEyMDApLFxyXG4gICAgbW9kQXR0YWNrOiBNYXRoLnBvdygyLCBtb2RBdHRhY2sgLyAxMjAwKSxcclxuICAgIG1vZERlY2F5OiBNYXRoLnBvdygyLCBtb2REZWNheSAvIDEyMDApLFxyXG4gICAgbW9kU3VzdGFpbjogbW9kU3VzdGFpbiAvIDEwMDAsXHJcbiAgICBtb2RSZWxlYXNlOiBNYXRoLnBvdygyLCBtb2RSZWxlYXNlIC8gMTIwMCksXHJcbiAgICBpbml0aWFsRmlsdGVyRmM6IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdpbml0aWFsRmlsdGVyRmMnLCAxMzUwMCksXHJcbiAgICBtb2RFbnZUb0ZpbHRlckZjOiBnZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnbW9kRW52VG9GaWx0ZXJGYycpLFxyXG4gICAgaW5pdGlhbEZpbHRlclE6IGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdpbml0aWFsRmlsdGVyUScsIDEpLFxyXG4gICAgZnJlcVZpYkxGTzogZnJlcVZpYkxGTyA/IE1hdGgucG93KDIsIGZyZXFWaWJMRk8gLyAxMjAwKSAqIDguMTc2IDogdW5kZWZpbmVkLFxyXG4gICAgcGxheWJhY2tSYXRlOiAoa2V5KSA9PiBNYXRoLnBvdyhNYXRoLnBvdygyLCAxIC8gMTIpLCAoa2V5ICsgYmFzZVBpdGNoKSAqIHNjYWxlKSxcclxuICAgIGtleVJhbmdlLFxyXG4gICAgdmVsUmFuZ2VcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE1vZEdlbkFtb3VudChnZW5lcmF0b3I6IE1vZEdlbiwgZW51bWVyYXRvclR5cGU6IHN0cmluZywgb3B0X2RlZmF1bHQ6IG51bWJlciA9IDApOiBudW1iZXIge1xyXG4gIHJldHVybiBnZW5lcmF0b3JbZW51bWVyYXRvclR5cGVdID8gZ2VuZXJhdG9yW2VudW1lcmF0b3JUeXBlXS5hbW91bnQgOiBvcHRfZGVmYXVsdFxyXG59XHJcblxyXG5pbnRlcmZhY2UgTW9kR2VuIHtcclxuICB1bmtub3duOiAoQW1vdW50VmFsdWV8UmFuZ2VWYWx1ZSlbXSxcclxuICBrZXlSYW5nZTogUmFuZ2VWYWx1ZVxyXG4gIC8vIEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZSDjgavjgYLjgovjgoLjga7jgYzlhaXjgotcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQmFnTW9kR2VuKGluZGV4U3RhcnQ6IG51bWJlciwgaW5kZXhFbmQ6IG51bWJlciwgem9uZU1vZEdlbjogTW9kdWxhdG9yTGlzdFtdKSB7XHJcbiAgY29uc3QgbW9kZ2VuSW5mbzogTW9kdWxhdG9yTGlzdFtdID0gW11cclxuICBjb25zdCBtb2RnZW46IE1vZEdlbiA9IHtcclxuICAgIHVua25vd246IFtdLFxyXG4gICAgJ2tleVJhbmdlJzoge1xyXG4gICAgICBoaTogMTI3LFxyXG4gICAgICBsbzogMFxyXG4gICAgfVxyXG4gIH07IC8vIFRPRE9cclxuXHJcbiAgZm9yIChsZXQgaSA9IGluZGV4U3RhcnQ7IGkgPCBpbmRleEVuZDsgKytpKSB7XHJcbiAgICBjb25zdCBpbmZvID0gem9uZU1vZEdlbltpXVxyXG4gICAgbW9kZ2VuSW5mby5wdXNoKGluZm8pXHJcblxyXG4gICAgaWYgKGluZm8udHlwZSA9PT0gJ3Vua25vd24nKSB7XHJcbiAgICAgIG1vZGdlbi51bmtub3duLnB1c2goaW5mby52YWx1ZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1vZGdlbltpbmZvLnR5cGVdID0gaW5mby52YWx1ZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgbW9kZ2VuLCBtb2RnZW5JbmZvIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlSW5zdHJ1bWVudEdlbmVyYXRvcih6b25lOiBJbnN0cnVtZW50QmFnW10sIGluZGV4OiBudW1iZXIsIGluc3RydW1lbnRab25lR2VuZXJhdG9yOiBNb2R1bGF0b3JMaXN0W10pIHtcclxuICBjb25zdCBtb2RnZW4gPSBjcmVhdGVCYWdNb2RHZW4oXHJcbiAgICB6b25lW2luZGV4XS5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXgsXHJcbiAgICB6b25lW2luZGV4ICsgMV0gPyB6b25lW2luZGV4ICsgMV0uaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4IDogaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3IubGVuZ3RoLFxyXG4gICAgaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3JcclxuICApXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZW5lcmF0b3I6IG1vZGdlbi5tb2RnZW4sXHJcbiAgICBnZW5lcmF0b3JJbmZvOiBtb2RnZW4ubW9kZ2VuSW5mb1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlSW5zdHJ1bWVudE1vZHVsYXRvcih6b25lOiBJbnN0cnVtZW50QmFnW10sIGluZGV4OiBudW1iZXIsIGluc3RydW1lbnRab25lTW9kdWxhdG9yOiBNb2R1bGF0b3JMaXN0W10pIHtcclxuICBjb25zdCBtb2RnZW4gPSBjcmVhdGVCYWdNb2RHZW4oXHJcbiAgICB6b25lW2luZGV4XS5pbnN0cnVtZW50TW9kdWxhdG9ySW5kZXgsXHJcbiAgICB6b25lW2luZGV4ICsgMV0gPyB6b25lW2luZGV4ICsgMV0uaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4IDogaW5zdHJ1bWVudFpvbmVNb2R1bGF0b3IubGVuZ3RoLFxyXG4gICAgaW5zdHJ1bWVudFpvbmVNb2R1bGF0b3JcclxuICApXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBtb2R1bGF0b3I6IG1vZGdlbi5tb2RnZW4sXHJcbiAgICBtb2R1bGF0b3JJbmZvOiBtb2RnZW4ubW9kZ2VuSW5mb1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUHJlc2V0R2VuZXJhdG9yKHpvbmU6IFByZXNldEJhZ1tdLCBpbmRleDogbnVtYmVyLCBwcmVzZXRab25lR2VuZXJhdG9yOiBNb2R1bGF0b3JMaXN0W10pIHtcclxuICBjb25zdCBtb2RnZW4gPSBjcmVhdGVCYWdNb2RHZW4oXHJcbiAgICB6b25lW2luZGV4XS5wcmVzZXRHZW5lcmF0b3JJbmRleCxcclxuICAgIHpvbmVbaW5kZXggKyAxXSA/IHpvbmVbaW5kZXggKyAxXS5wcmVzZXRHZW5lcmF0b3JJbmRleCA6IHByZXNldFpvbmVHZW5lcmF0b3IubGVuZ3RoLFxyXG4gICAgcHJlc2V0Wm9uZUdlbmVyYXRvclxyXG4gIClcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGdlbmVyYXRvcjogbW9kZ2VuLm1vZGdlbixcclxuICAgIGdlbmVyYXRvckluZm86IG1vZGdlbi5tb2RnZW5JbmZvXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQcmVzZXRNb2R1bGF0b3Ioem9uZTogUHJlc2V0QmFnW10sIGluZGV4OiBudW1iZXIsIHByZXNldFpvbmVNb2R1bGF0b3I6IE1vZHVsYXRvckxpc3RbXSkge1xyXG4gIGNvbnN0IG1vZGdlbiA9IGNyZWF0ZUJhZ01vZEdlbihcclxuICAgIHpvbmVbaW5kZXhdLnByZXNldE1vZHVsYXRvckluZGV4LFxyXG4gICAgem9uZVtpbmRleCArIDFdID8gem9uZVtpbmRleCArIDFdLnByZXNldE1vZHVsYXRvckluZGV4IDogcHJlc2V0Wm9uZU1vZHVsYXRvci5sZW5ndGgsXHJcbiAgICBwcmVzZXRab25lTW9kdWxhdG9yXHJcbiAgKVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbW9kdWxhdG9yOiBtb2RnZW4ubW9kZ2VuLFxyXG4gICAgbW9kdWxhdG9ySW5mbzogbW9kZ2VuLm1vZGdlbkluZm9cclxuICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU291bmRGb250LnRzIiwiaW1wb3J0IFN5bnRoZXNpemVyIGZyb20gXCIuL1N5bnRoZXNpemVyXCJcclxuaW1wb3J0IFByb2dyYW1OYW1lcyBmcm9tIFwiLi9Qcm9ncmFtTmFtZXNcIlxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKHN0cjogc3RyaW5nKTogRWxlbWVudCB7XHJcbiAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICB3cmFwcGVyLmlubmVySFRNTCA9IHN0ci5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpXHJcbiAgcmV0dXJuIHdyYXBwZXIuZmlyc3RFbGVtZW50Q2hpbGQhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcktleXMoKTogc3RyaW5nIHtcclxuICBsZXQgaHRtbCA9IFwiXCJcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IDEyODsgaSsrKSB7XHJcbiAgICBjb25zdCBuID0gaSAlIDEyXHJcbiAgICBjb25zdCBpc0JsYWNrID0gWzEsIDMsIDYsIDgsIDEwXS5pbmNsdWRlcyhuKVxyXG4gICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cImtleSAke2lzQmxhY2sgPyBcImJsYWNrXCIgOiBcIndoaXRlXCJ9XCI+PC9kaXY+YFxyXG4gIH1cclxuICByZXR1cm4gaHRtbFxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJQcm9ncmFtT3B0aW9ucyhwcm9ncmFtTmFtZXM6IHsgW2luZGV4OiBudW1iZXJdOiBzdHJpbmdbXSB9LCBiYW5rOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gIGxldCBodG1sID0gXCJcIlxyXG4gIGNvbnN0IG5hbWVzID0gcHJvZ3JhbU5hbWVzW2JhbmtdXHJcbiAgZm9yIChsZXQgaSBpbiBuYW1lcykge1xyXG4gICAgY29uc3QgbmFtZSA9IG5hbWVzW2ldXHJcbiAgICBodG1sICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtpfVwiPiR7aX06ICR7bmFtZX08L29wdGlvbj5gXHJcbiAgfVxyXG4gIHJldHVybiBgPHNlbGVjdD4ke2h0bWx9PC9zZWxlY3Q+YFxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJJbnN0cnVtZW50KHByb2dyYW0pOiBFbGVtZW50IHtcclxuICByZXR1cm4gcmVuZGVyKGBcclxuICAgIDxkaXYgY2xhc3M9XCJpbnN0cnVtZW50XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmFtXCI+JHtwcm9ncmFtfTwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwidm9sdW1lXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwYW5wb3RcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBpdGNoQmVuZFwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGl0Y2hCZW5kU2Vuc2l0aXZpdHlcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImtleXNcIj4ke3JlbmRlcktleXMoKX08L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIGApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9iamVjdE1hcChvLCBmdW5jKSB7XHJcbiAgY29uc3QgcmVzdWx0ID0ge31cclxuICBPYmplY3Qua2V5cyhvKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICByZXN1bHRba2V5XSA9IGZ1bmMob1trZXldKVxyXG4gIH0pXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9ncmFtTmFtZXNGcm9tQmFua1NldChiYW5rU2V0KSB7XHJcbiAgcmV0dXJuIG9iamVjdE1hcChiYW5rU2V0LCBiYW5rID0+IG9iamVjdE1hcChiYW5rLCBzID0+IHMubmFtZSkpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1lcmdlUHJvZ3JhbU5hbWVzKGxlZnQ6IHtbaW5kZXg6IG51bWJlcl06IHN0cmluZ1tdfSwgcmlnaHQ6IHtbaW5kZXg6IG51bWJlcl06IHN0cmluZ1tdfSkge1xyXG4gIGZ1bmN0aW9uIG1lcmdlZEtleXMoYSwgYikge1xyXG4gICAgcmV0dXJuIG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGEpLCAuLi5PYmplY3Qua2V5cyhiKV0pXHJcbiAgfVxyXG4gIGNvbnN0IGJhbmtzID0gbWVyZ2VkS2V5cyhsZWZ0LCByaWdodClcclxuICBjb25zdCByZXN1bHQgPSB7fVxyXG4gIGJhbmtzLmZvckVhY2goYmFuayA9PiB7XHJcbiAgICBjb25zdCBsID0gbGVmdFtiYW5rXSB8fCBbXVxyXG4gICAgY29uc3QgciA9IHJpZ2h0W2JhbmtdIHx8IFtdXHJcbiAgICBjb25zdCBsaXN0OiB7IFtpbmRleDogbnVtYmVyXTogc3RyaW5nfSA9IHt9XHJcbiAgICBjb25zdCBwcm9ncmFtcyA9IG1lcmdlZEtleXMobCwgcilcclxuICAgIHByb2dyYW1zLmZvckVhY2gocCA9PiB7XHJcbiAgICAgIGxpc3RbcF0gPSBgJHtsW3BdIHx8IFwiTm9uZVwifSAoJHtyW3BdIHx8IFwiTm9uZVwifSlgXHJcbiAgICB9KVxyXG4gICAgcmVzdWx0W2JhbmtdID0gbGlzdFxyXG4gIH0pXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcclxuICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnR8bnVsbFxyXG4gIHByaXZhdGUgZHJhZzogYm9vbGVhbiA9IGZhbHNlXHJcblxyXG4gIGRyYXcoc3ludGg6IFN5bnRoZXNpemVyKTogRWxlbWVudCB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50ID0gcmVuZGVyKGA8ZGl2IC8+YClcclxuICAgIGNvbnN0IHByb2dyYW1OYW1lcyA9IG1lcmdlUHJvZ3JhbU5hbWVzKHByb2dyYW1OYW1lc0Zyb21CYW5rU2V0KHN5bnRoLnNvdW5kRm9udC5iYW5rU2V0KSwgUHJvZ3JhbU5hbWVzKVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xyXG4gICAgICBjb25zdCBiYW5rID0gaSAhPT0gOSA/IDAgOiAxMjhcclxuICAgICAgY29uc3QgcHJvZ3JhbSA9IHJlbmRlclByb2dyYW1PcHRpb25zKHByb2dyYW1OYW1lcywgYmFuaylcclxuICAgICAgY29uc3QgaXRlbSA9IHJlbmRlckluc3RydW1lbnQocHJvZ3JhbSlcclxuXHJcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBpXHJcbiAgICAgIGNvbnN0IHNlbGVjdCA9IGl0ZW0ucXVlcnlTZWxlY3Rvcignc2VsZWN0JylcclxuICAgICAgaWYgKHNlbGVjdCkge1xyXG4gICAgICAgIHNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnRcclxuICAgICAgICAgIHN5bnRoLnByb2dyYW1DaGFuZ2UoY2hhbm5lbCwgcGFyc2VJbnQodGFyZ2V0LnZhbHVlLCAxMCkpXHJcbiAgICAgICAgfSwgZmFsc2UpXHJcbiAgICAgICAgc2VsZWN0LnNlbGVjdGVkSW5kZXggPSBzeW50aC5jaGFubmVsc1tpXS5pbnN0cnVtZW50XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG5vdGVzID0gaXRlbS5xdWVyeVNlbGVjdG9yQWxsKFwiLmtleVwiKVxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEyODsgKytqKSB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0galxyXG5cclxuICAgICAgICBub3Rlc1tqXS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICB0aGlzLmRyYWcgPSB0cnVlXHJcbiAgICAgICAgICBzeW50aC5ub3RlT24oY2hhbm5lbCwga2V5LCAxMjcpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBub3Rlc1tqXS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICBpZiAodGhpcy5kcmFnKSB7XHJcbiAgICAgICAgICAgIHN5bnRoLm5vdGVPbihjaGFubmVsLCBrZXksIDEyNylcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgc3ludGgubm90ZU9mZihjaGFubmVsLCBrZXksIDApXHJcbiAgICAgICAgfSlcclxuICAgICAgICBub3Rlc1tqXS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgdGhpcy5kcmFnID0gZmFsc2VcclxuICAgICAgICAgIHN5bnRoLm5vdGVPZmYoY2hhbm5lbCwga2V5LCAwKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoaXRlbSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZWxlbWVudFxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlKCkge1xyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LnBhcmVudE5vZGUhLnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcclxuICAgIHRoaXMuZWxlbWVudCA9IG51bGxcclxuICB9XHJcblxyXG4gIGdldEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWw6IG51bWJlcik6IEVsZW1lbnR8bnVsbCB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmluc3RydW1lbnRcIilbY2hhbm5lbF1cclxuICB9XHJcblxyXG4gIGdldEtleUVsZW1lbnQoY2hhbm5lbDogbnVtYmVyLCBrZXk6IG51bWJlcik6IEVsZW1lbnR8bnVsbCB7XHJcbiAgICBjb25zdCBlbGVtID0gdGhpcy5nZXRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsKVxyXG4gICAgaWYgKCFlbGVtKSB7XHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKFwiLmtleVwiKVtrZXldXHJcbiAgfVxyXG5cclxuICBmaW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbDogbnVtYmVyLCBxdWVyeTogc3RyaW5nKTogRWxlbWVudHxudWxsIHtcclxuICAgIGNvbnN0IGVsZW0gPSB0aGlzLmdldEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwpXHJcbiAgICBpZiAoIWVsZW0pIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuICAgIHJldHVybiBlbGVtLnF1ZXJ5U2VsZWN0b3IocXVlcnkpXHJcbiAgfVxyXG5cclxuICBub3RlT24oY2hhbm5lbDogbnVtYmVyLCBrZXk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZ2V0S2V5RWxlbWVudChjaGFubmVsLCBrZXkpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ25vdGUtb24nKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbm90ZU9mZihjaGFubmVsOiBudW1iZXIsIGtleTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5nZXRLZXlFbGVtZW50KGNoYW5uZWwsIGtleSlcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZS1vbicpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm9ncmFtQ2hhbmdlKGNoYW5uZWw6IG51bWJlciwgaW5zdHJ1bWVudCkge1xyXG4gICAgY29uc3Qgc2VsZWN0ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIucHJvZ3JhbSBzZWxlY3RcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnR8dW5kZWZpbmVkXHJcbiAgICBpZiAoc2VsZWN0KSB7XHJcbiAgICAgIHNlbGVjdC52YWx1ZSA9IGluc3RydW1lbnRcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZvbHVtZUNoYW5nZShjaGFubmVsOiBudW1iZXIsIHZvbHVtZSkge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZmluZEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwsIFwiLnZvbHVtZVwiKVxyXG4gICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IHZvbHVtZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGFucG90Q2hhbmdlKGNoYW5uZWw6IG51bWJlciwgcGFucG90OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi5wYW5wb3RcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBwYW5wb3RcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZChjaGFubmVsOiBudW1iZXIsIGNhbGN1bGF0ZWRQaXRjaDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIucGl0Y2hCZW5kXCIpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gY2FsY3VsYXRlZFBpdGNoXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwaXRjaEJlbmRTZW5zaXRpdml0eShjaGFubmVsOiBudW1iZXIsIHNlbnNpdGl2aXR5OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi5waXRjaEJlbmRTZW5zaXRpdml0eVwiKVxyXG4gICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IHNlbnNpdGl2aXR5XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9WaWV3LnRzIiwiY29uc3QgUHJvZ3JhbU5hbWVzOiB7IFtpbmRleDogbnVtYmVyXTogc3RyaW5nW10gfSA9IHtcclxuICAwOiBbXHJcbiAgICBcIkFjb3VzdGljIFBpYW5vXCIsXHJcbiAgICBcIkJyaWdodCBQaWFub1wiLFxyXG4gICAgXCJFbGVjdHJpYyBHcmFuZCBQaWFub1wiLFxyXG4gICAgXCJIb25reS10b25rIFBpYW5vXCIsXHJcbiAgICBcIkVsZWN0cmljIFBpYW5vXCIsXHJcbiAgICBcIkVsZWN0cmljIFBpYW5vIDJcIixcclxuICAgIFwiSGFycHNpY2hvcmRcIixcclxuICAgIFwiQ2xhdmlcIixcclxuICAgIFwiQ2VsZXN0YVwiLFxyXG4gICAgXCJHbG9ja2Vuc3BpZWxcIixcclxuICAgIFwiTXVzaWNhbCBib3hcIixcclxuICAgIFwiVmlicmFwaG9uZVwiLFxyXG4gICAgXCJNYXJpbWJhXCIsXHJcbiAgICBcIlh5bG9waG9uZVwiLFxyXG4gICAgXCJUdWJ1bGFyIEJlbGxcIixcclxuICAgIFwiRHVsY2ltZXJcIixcclxuICAgIFwiRHJhd2JhciBPcmdhblwiLFxyXG4gICAgXCJQZXJjdXNzaXZlIE9yZ2FuXCIsXHJcbiAgICBcIlJvY2sgT3JnYW5cIixcclxuICAgIFwiQ2h1cmNoIG9yZ2FuXCIsXHJcbiAgICBcIlJlZWQgb3JnYW5cIixcclxuICAgIFwiQWNjb3JkaW9uXCIsXHJcbiAgICBcIkhhcm1vbmljYVwiLFxyXG4gICAgXCJUYW5nbyBBY2NvcmRpb25cIixcclxuICAgIFwiQWNvdXN0aWMgR3VpdGFyIChueWxvbilcIixcclxuICAgIFwiQWNvdXN0aWMgR3VpdGFyIChzdGVlbClcIixcclxuICAgIFwiRWxlY3RyaWMgR3VpdGFyIChqYXp6KVwiLFxyXG4gICAgXCJFbGVjdHJpYyBHdWl0YXIgKGNsZWFuKVwiLFxyXG4gICAgXCJFbGVjdHJpYyBHdWl0YXIgKG11dGVkKVwiLFxyXG4gICAgXCJPdmVyZHJpdmVuIEd1aXRhclwiLFxyXG4gICAgXCJEaXN0b3J0aW9uIEd1aXRhclwiLFxyXG4gICAgXCJHdWl0YXIgaGFybW9uaWNzXCIsXHJcbiAgICBcIkFjb3VzdGljIEJhc3NcIixcclxuICAgIFwiRWxlY3RyaWMgQmFzcyAoZmluZ2VyKVwiLFxyXG4gICAgXCJFbGVjdHJpYyBCYXNzIChwaWNrKVwiLFxyXG4gICAgXCJGcmV0bGVzcyBCYXNzXCIsXHJcbiAgICBcIlNsYXAgQmFzcyAxXCIsXHJcbiAgICBcIlNsYXAgQmFzcyAyXCIsXHJcbiAgICBcIlN5bnRoIEJhc3MgMVwiLFxyXG4gICAgXCJTeW50aCBCYXNzIDJcIixcclxuICAgIFwiVmlvbGluXCIsXHJcbiAgICBcIlZpb2xhXCIsXHJcbiAgICBcIkNlbGxvXCIsXHJcbiAgICBcIkRvdWJsZSBiYXNzXCIsXHJcbiAgICBcIlRyZW1vbG8gU3RyaW5nc1wiLFxyXG4gICAgXCJQaXp6aWNhdG8gU3RyaW5nc1wiLFxyXG4gICAgXCJPcmNoZXN0cmFsIEhhcnBcIixcclxuICAgIFwiVGltcGFuaVwiLFxyXG4gICAgXCJTdHJpbmcgRW5zZW1ibGUgMVwiLFxyXG4gICAgXCJTdHJpbmcgRW5zZW1ibGUgMlwiLFxyXG4gICAgXCJTeW50aCBTdHJpbmdzIDFcIixcclxuICAgIFwiU3ludGggU3RyaW5ncyAyXCIsXHJcbiAgICBcIlZvaWNlIEFhaHNcIixcclxuICAgIFwiVm9pY2UgT29oc1wiLFxyXG4gICAgXCJTeW50aCBWb2ljZVwiLFxyXG4gICAgXCJPcmNoZXN0cmEgSGl0XCIsXHJcbiAgICBcIlRydW1wZXRcIixcclxuICAgIFwiVHJvbWJvbmVcIixcclxuICAgIFwiVHViYVwiLFxyXG4gICAgXCJNdXRlZCBUcnVtcGV0XCIsXHJcbiAgICBcIkZyZW5jaCBob3JuXCIsXHJcbiAgICBcIkJyYXNzIFNlY3Rpb25cIixcclxuICAgIFwiU3ludGggQnJhc3MgMVwiLFxyXG4gICAgXCJTeW50aCBCcmFzcyAyXCIsXHJcbiAgICBcIlNvcHJhbm8gU2F4XCIsXHJcbiAgICBcIkFsdG8gU2F4XCIsXHJcbiAgICBcIlRlbm9yIFNheFwiLFxyXG4gICAgXCJCYXJpdG9uZSBTYXhcIixcclxuICAgIFwiT2JvZVwiLFxyXG4gICAgXCJFbmdsaXNoIEhvcm5cIixcclxuICAgIFwiQmFzc29vblwiLFxyXG4gICAgXCJDbGFyaW5ldFwiLFxyXG4gICAgXCJQaWNjb2xvXCIsXHJcbiAgICBcIkZsdXRlXCIsXHJcbiAgICBcIlJlY29yZGVyXCIsXHJcbiAgICBcIlBhbiBGbHV0ZVwiLFxyXG4gICAgXCJCbG93biBCb3R0bGVcIixcclxuICAgIFwiU2hha3VoYWNoaVwiLFxyXG4gICAgXCJXaGlzdGxlXCIsXHJcbiAgICBcIk9jYXJpbmFcIixcclxuICAgIFwiTGVhZCAxIChzcXVhcmUpXCIsXHJcbiAgICBcIkxlYWQgMiAoc2F3dG9vdGgpXCIsXHJcbiAgICBcIkxlYWQgMyAoY2FsbGlvcGUpXCIsXHJcbiAgICBcIkxlYWQgNCAoY2hpZmYpXCIsXHJcbiAgICBcIkxlYWQgNSAoY2hhcmFuZylcIixcclxuICAgIFwiTGVhZCA2ICh2b2ljZSlcIixcclxuICAgIFwiTGVhZCA3IChmaWZ0aHMpXCIsXHJcbiAgICBcIkxlYWQgOCAoYmFzcyArIGxlYWQpXCIsXHJcbiAgICBcIlBhZCAxIChGYW50YXNpYSlcIixcclxuICAgIFwiUGFkIDIgKHdhcm0pXCIsXHJcbiAgICBcIlBhZCAzIChwb2x5c3ludGgpXCIsXHJcbiAgICBcIlBhZCA0IChjaG9pcilcIixcclxuICAgIFwiUGFkIDUgKGJvd2VkKVwiLFxyXG4gICAgXCJQYWQgNiAobWV0YWxsaWMpXCIsXHJcbiAgICBcIlBhZCA3IChoYWxvKVwiLFxyXG4gICAgXCJQYWQgOCAoc3dlZXApXCIsXHJcbiAgICBcIkZYIDEgKHJhaW4pXCIsXHJcbiAgICBcIkZYIDIgKHNvdW5kdHJhY2spXCIsXHJcbiAgICBcIkZYIDMgKGNyeXN0YWwpXCIsXHJcbiAgICBcIkZYIDQgKGF0bW9zcGhlcmUpXCIsXHJcbiAgICBcIkZYIDUgKGJyaWdodG5lc3MpXCIsXHJcbiAgICBcIkZYIDYgKGdvYmxpbnMpXCIsXHJcbiAgICBcIkZYIDcgKGVjaG9lcylcIixcclxuICAgIFwiRlggOCAoc2NpLWZpKVwiLFxyXG4gICAgXCJTaXRhclwiLFxyXG4gICAgXCJCYW5qb1wiLFxyXG4gICAgXCJTaGFtaXNlblwiLFxyXG4gICAgXCJLb3RvXCIsXHJcbiAgICBcIkthbGltYmFcIixcclxuICAgIFwiQmFncGlwZVwiLFxyXG4gICAgXCJGaWRkbGVcIixcclxuICAgIFwiU2hhbmFpXCIsXHJcbiAgICBcIlRpbmtsZSBCZWxsXCIsXHJcbiAgICBcIkFnb2dvXCIsXHJcbiAgICBcIlN0ZWVsIERydW1zXCIsXHJcbiAgICBcIldvb2RibG9ja1wiLFxyXG4gICAgXCJUYWlrbyBEcnVtXCIsXHJcbiAgICBcIk1lbG9kaWMgVG9tXCIsXHJcbiAgICBcIlN5bnRoIERydW1cIixcclxuICAgIFwiUmV2ZXJzZSBDeW1iYWxcIixcclxuICAgIFwiR3VpdGFyIEZyZXQgTm9pc2VcIixcclxuICAgIFwiQnJlYXRoIE5vaXNlXCIsXHJcbiAgICBcIlNlYXNob3JlXCIsXHJcbiAgICBcIkJpcmQgVHdlZXRcIixcclxuICAgIFwiVGVsZXBob25lIFJpbmdcIixcclxuICAgIFwiSGVsaWNvcHRlclwiLFxyXG4gICAgXCJBcHBsYXVzZVwiLFxyXG4gICAgXCJHdW5zaG90XCJcclxuICBdLCAxMjg6IFtcIlJoeXRobSBUcmFja1wiXVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9ncmFtTmFtZXNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUHJvZ3JhbU5hbWVzLnRzIiwiaW1wb3J0IFN5bnRoZXNpemVyIGZyb20gXCIuL1N5bnRoZXNpemVyXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pZGlNZXNzYWdlSGFuZGxlciB7XHJcbiAgcHJpdmF0ZSBScG5Nc2IgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cclxuICBwcml2YXRlIFJwbkxzYiA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXVxyXG4gIHN5bnRoOiBTeW50aGVzaXplclxyXG5cclxuICBwcm9jZXNzTWlkaU1lc3NhZ2UobWVzc2FnZTogbnVtYmVyW10pIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBtZXNzYWdlWzBdICYgMHgwZlxyXG4gICAgY29uc3QgeyBzeW50aCB9ID0gdGhpc1xyXG5cclxuICAgIGlmICghc3ludGgpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChtZXNzYWdlWzBdICYgMHhmMCkge1xyXG4gICAgICBjYXNlIDB4ODA6IC8vIE5vdGVPZmY6IDhuIGtrIHZ2XHJcbiAgICAgICAgc3ludGgubm90ZU9mZihjaGFubmVsLCBtZXNzYWdlWzFdLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMHg5MDogLy8gTm90ZU9uOiA5biBrayB2dlxyXG4gICAgICAgIGlmIChtZXNzYWdlWzJdID4gMCkge1xyXG4gICAgICAgICAgc3ludGgubm90ZU9uKGNoYW5uZWwsIG1lc3NhZ2VbMV0sIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN5bnRoLm5vdGVPZmYoY2hhbm5lbCwgbWVzc2FnZVsxXSwgMClcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAweEIwOiAvLyBDb250cm9sIENoYW5nZTogQm4gY2MgZGRcclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbMV0pIHtcclxuICAgICAgICAgIGNhc2UgMHgwNjogLy8gRGF0YSBFbnRyeTogQm4gMDYgZGRcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLlJwbk1zYltjaGFubmVsXSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5ScG5Mc2JbY2hhbm5lbF0pIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAwOiAvLyBQaXRjaCBCZW5kIFNlbnNpdGl2aXR5XHJcbiAgICAgICAgICAgICAgICAgICAgc3ludGgucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbCwgbWVzc2FnZVsyXSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHgwNzogLy8gVm9sdW1lIENoYW5nZTogQm4gMDcgZGRcclxuICAgICAgICAgICAgc3ludGgudm9sdW1lQ2hhbmdlKGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4MEE6IC8vIFBhbnBvdCBDaGFuZ2U6IEJuIDBBIGRkXHJcbiAgICAgICAgICAgIHN5bnRoLnBhbnBvdENoYW5nZShjaGFubmVsLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDc4OiAvLyBBbGwgU291bmQgT2ZmOiBCbiA3OCAwMFxyXG4gICAgICAgICAgICBzeW50aC5hbGxTb3VuZE9mZihjaGFubmVsKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDc5OiAvLyBSZXNldCBBbGwgQ29udHJvbDogQm4gNzkgMDBcclxuICAgICAgICAgICAgc3ludGgucmVzZXRBbGxDb250cm9sKGNoYW5uZWwpXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4MjA6IC8vIEJhbmtTZWxlY3RcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImJhbmtzZWxlY3Q6XCIsIGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4NjQ6IC8vIFJQTiBNU0JcclxuICAgICAgICAgICAgdGhpcy5ScG5Nc2JbY2hhbm5lbF0gPSBtZXNzYWdlWzJdXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4NjU6IC8vIFJQTiBMU0JcclxuICAgICAgICAgICAgdGhpcy5ScG5Mc2JbY2hhbm5lbF0gPSBtZXNzYWdlWzJdXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgLy8gbm90IHN1cHBvcnRlZFxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4QzA6IC8vIFByb2dyYW0gQ2hhbmdlOiBDbiBwcFxyXG4gICAgICAgIHN5bnRoLnByb2dyYW1DaGFuZ2UoY2hhbm5lbCwgbWVzc2FnZVsxXSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4RTA6IC8vIFBpdGNoIEJlbmRcclxuICAgICAgICBzeW50aC5waXRjaEJlbmQoY2hhbm5lbCwgbWVzc2FnZVsxXSwgbWVzc2FnZVsyXSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4ZjA6IC8vIFN5c3RlbSBFeGNsdXNpdmUgTWVzc2FnZVxyXG4gICAgICAgIC8vIElEIG51bWJlclxyXG4gICAgICAgIHN3aXRjaCAobWVzc2FnZVsxXSkge1xyXG4gICAgICAgICAgY2FzZSAweDdlOiAvLyBub24tcmVhbHRpbWVcclxuICAgICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDdmOiAvLyByZWFsdGltZVxyXG4gICAgICAgICAgICAvLyBjb25zdCBkZXZpY2UgPSBtZXNzYWdlWzJdXHJcbiAgICAgICAgICAgIC8vIHN1YiBJRCAxXHJcbiAgICAgICAgICAgIHN3aXRjaCAobWVzc2FnZVszXSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgMHgwNDogLy8gZGV2aWNlIGNvbnRyb2xcclxuICAgICAgICAgICAgICAgIC8vIHN1YiBJRCAyXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbNF0pIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAweDAxOiB7IC8vIG1hc3RlciB2b2x1bWVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2b2x1bWUgPSBtZXNzYWdlWzVdICsgKG1lc3NhZ2VbNl0gPDwgNylcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBNQVhfVk9MVU1FID0gMHg0MDAwIC0gMVxyXG4gICAgICAgICAgICAgICAgICAgIHN5bnRoLnNldE1hc3RlclZvbHVtZSh2b2x1bWUgLyBNQVhfVk9MVU1FKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDogLy8gbm90IHN1cHBvcnRlZFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9NaWRpTWVzc2FnZUhhbmRsZXIudHMiXSwic291cmNlUm9vdCI6IiJ9