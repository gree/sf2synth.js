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
/* 5 */,
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_WebMidiLink_ts__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "WebMidiLink", function() { return __WEBPACK_IMPORTED_MODULE_0__src_WebMidiLink_ts__["a"]; });



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Synthesizer__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__View__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__MidiMessageHandler__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__delegateProxy__ = __webpack_require__(14);




class WebMidiLink {
    constructor() {
        this.ready = false;
        this.midiMessageHandler = new __WEBPACK_IMPORTED_MODULE_2__MidiMessageHandler__["a" /* default */]();
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
            synth.init();
            synth.refreshInstruments(input);
            synth.connect(ctx.destination);
            const view = this.view = new __WEBPACK_IMPORTED_MODULE_1__View__["a" /* default */]();
            document.body.querySelector(".synth").appendChild(view.draw(synth));
            this.midiMessageHandler.listener = Object(__WEBPACK_IMPORTED_MODULE_3__delegateProxy__["a" /* default */])([synth, view]);
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SynthesizerNote__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Parser__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SoundFont__ = __webpack_require__(10);



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
    refreshInstruments(input) {
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
/* 9 */
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


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ProgramNames__ = __webpack_require__(12);

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
/* 12 */
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


/***/ }),
/* 13 */
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
                const bend = ((message[1] & 0x7f) | ((message[2] & 0x7f) << 7)) - 0x2000;
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
/* harmony export (immutable) */ __webpack_exports__["a"] = MidiMessageHandler;



/***/ }),
/* 14 */
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


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2YTc4ZDA1Zjk3N2EwNjk2ODYwYiIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9TdHJ1Y3RzLnRzIiwid2VicGFjazovLy8uL3NyYy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JpZmZQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvc3ludGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYk1pZGlMaW5rLnRzIiwid2VicGFjazovLy8uL3NyYy9TeW50aGVzaXplci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ludGhlc2l6ZXJOb3RlLnRzIiwid2VicGFjazovLy8uL3NyYy9Tb3VuZEZvbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZpZXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Byb2dyYW1OYW1lcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWlkaU1lc3NhZ2VIYW5kbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9kZWxlZ2F0ZVByb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtB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LEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSw4REFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM5RixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwyREFBUyxDQUFDO0FBQzdFLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDREQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzVGLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLCtEQUFhLENBQUM7QUFDakYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxL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R0FBRyxDQUFDO3dDQUM3QixRQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7d0NBQzdDLEtBQUs7b0NBQ1AsQ0FBQztvQ0FDRDt3Q0FDRSxLQUFLO2dDQUNULENBQUM7Z0NBQ0QsS0FBSzs0QkFDUDtnQ0FDRSxLQUFLO3dCQUNULENBQUM7d0JBQ0QsS0FBSztvQkFDUDt3QkFDRSxLQUFLO2dCQUNULENBQUM7Z0JBQ0QsS0FBSztZQUNQLFFBQVMsZ0JBQWdCO2dCQUN2QixLQUFLO1FBQ1QsQ0FBQztJQUNILENBQUM7Q0FDRjtBQUFBO0FBQUE7Ozs7Ozs7O0FDMUhEO0FBQUEsNkNBQTZDO0FBQy9CLHVCQUEwQyxPQUFZO0lBQ2xFLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDM0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUztZQUM1QixNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLE9BQU87cUJBQ0osR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDakMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7WUFDbEMsQ0FBQztRQUNILENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQyIsImZpbGUiOiJzZjIuc3ludGguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2YTc4ZDA1Zjk3N2EwNjk2ODYwYiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XHJcbiAgcHJpdmF0ZSBkYXRhOiBVaW50OEFycmF5XHJcbiAgaXA6IG51bWJlclxyXG5cclxuICBjb25zdHJ1Y3RvcihkYXRhLCBvZmZzZXQpIHtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGFcclxuICAgIHRoaXMuaXAgPSBvZmZzZXRcclxuICB9XHJcblxyXG4gIHJlYWRTdHJpbmcoc2l6ZTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0ciA9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgdGhpcy5kYXRhLnN1YmFycmF5KHRoaXMuaXAsIHRoaXMuaXAgKz0gc2l6ZSkpXHJcbiAgICBjb25zdCBudWxsTG9jYXRpb24gPSBzdHIuaW5kZXhPZihcIlxcdTAwMDBcIilcclxuICAgIGlmIChudWxsTG9jYXRpb24gPiAwKSB7XHJcbiAgICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIG51bGxMb2NhdGlvbilcclxuICAgIH1cclxuICAgIHJldHVybiBzdHJcclxuICB9XHJcblxyXG4gIHJlYWRXT1JEKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXArK10gfCAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOClcclxuICB9XHJcblxyXG4gIHJlYWREV09SRChiaWdFbmRpYW46IGJvb2xlYW4gPSBmYWxzZSk6IG51bWJlciB7XHJcbiAgICBpZiAoYmlnRW5kaWFuKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMjR8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAxNikgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOCkgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10pXHJcbiAgICAgICkgPj4+IDBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5kYXRhW3RoaXMuaXArK10gfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOCkgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMTYpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDI0KVxyXG4gICAgICApID4+PiAwXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWFkQnl0ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCsrXVxyXG4gIH1cclxuXHJcbiAgcmVhZEF0KG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXAgKyBvZmZzZXRdXHJcbiAgfVxyXG5cclxuICAvKiBoZWxwZXIgKi9cclxuXHJcbiAgcmVhZFVJbnQ4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZEJ5dGUoKVxyXG4gIH1cclxuICBcclxuICByZWFkSW50OCgpIHtcclxuICAgIHJldHVybiAodGhpcy5yZWFkQnl0ZSgpIDw8IDI0KSA+PiAyNFxyXG4gIH1cclxuICBcclxuICByZWFkVUludDE2KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZFdPUkQoKVxyXG4gIH1cclxuXHJcbiAgcmVhZEludDE2KCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnJlYWRXT1JEKCkgPDwgMTYpID4+IDE2XHJcbiAgfVxyXG5cclxuICByZWFkVUludDMyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZERXT1JEKClcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N0cmVhbS50cyIsImltcG9ydCB7IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZSB9IGZyb20gXCIuL0NvbnN0YW50c1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuaW1wb3J0IHsgQ2h1bmsgfSBmcm9tIFwiLi9SaWZmUGFyc2VyXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJzaW9uVGFnIHtcclxuICBtYWpvcjogbnVtYmVyXHJcbiAgbWlub3I6IG51bWJlclxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdiA9IG5ldyBWZXJzaW9uVGFnKClcclxuICAgIHYubWFqb3IgPSBzdHJlYW0ucmVhZEludDgoKVxyXG4gICAgdi5taW5vciA9IHN0cmVhbS5yZWFkSW50OCgpXHJcbiAgICByZXR1cm4gdlxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluZm8ge1xyXG4gIGNvbW1lbnQ6IHN0cmluZ3xudWxsXHJcbiAgY29weXJpZ2h0OiBzdHJpbmd8bnVsbFxyXG4gIGNyZWF0aW9uRGF0ZTogc3RyaW5nfG51bGxcclxuICBlbmdpbmVlcjogc3RyaW5nfG51bGxcclxuICBuYW1lOiBzdHJpbmdcclxuICBwcm9kdWN0OiBzdHJpbmd8bnVsbFxyXG4gIHNvZnR3YXJlOiBzdHJpbmd8bnVsbFxyXG4gIHZlcnNpb246IFZlcnNpb25UYWdcclxuICBzb3VuZEVuZ2luZTogc3RyaW5nfG51bGxcclxuICByb21OYW1lOiBzdHJpbmd8bnVsbFxyXG4gIHJvbVZlcnNpb246IFZlcnNpb25UYWd8bnVsbFxyXG5cclxuICAvLyBMSVNUIC0gSU5GTyDjga7lhajjgabjga4gY2h1bmtcclxuICBzdGF0aWMgcGFyc2UoZGF0YTogVWludDhBcnJheSwgY2h1bmtzOiBDaHVua1tdKSB7XHJcbiAgICBmdW5jdGlvbiBnZXRDaHVuayh0eXBlKSB7XHJcbiAgICAgIHJldHVybiBjaHVua3MuZmluZChjID0+IGMudHlwZSA9PT0gdHlwZSkgXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9TdHJlYW0oY2h1bmspIHtcclxuICAgICAgcmV0dXJuIG5ldyBTdHJlYW0oZGF0YSwgY2h1bmsub2Zmc2V0KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlYWRTdHJpbmcodHlwZSkge1xyXG4gICAgICBjb25zdCBjaHVuayA9IGdldENodW5rKHR5cGUpXHJcbiAgICAgIGlmICghY2h1bmspIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0b1N0cmVhbShjaHVuaykhLnJlYWRTdHJpbmcoY2h1bmsuc2l6ZSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWFkVmVyc2lvblRhZyh0eXBlKSB7XHJcbiAgICAgIGNvbnN0IGNodW5rID0gZ2V0Q2h1bmsodHlwZSlcclxuICAgICAgaWYgKCFjaHVuaykge1xyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFZlcnNpb25UYWcucGFyc2UodG9TdHJlYW0oY2h1bmspKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBpbmZvID0gbmV3IEluZm8oKVxyXG4gICAgaW5mby5jb21tZW50ID0gcmVhZFN0cmluZyhcIklDTVRcIilcclxuICAgIGluZm8uY29weXJpZ2h0ID0gcmVhZFN0cmluZyhcIklDT1BcIilcclxuICAgIGluZm8uY3JlYXRpb25EYXRlID0gcmVhZFN0cmluZyhcIklDUkRcIilcclxuICAgIGluZm8uZW5naW5lZXIgPSByZWFkU3RyaW5nKFwiSUVOR1wiKVxyXG4gICAgaW5mby5uYW1lID0gcmVhZFN0cmluZyhcIklOQU1cIikhXHJcbiAgICBpbmZvLnByb2R1Y3QgPSByZWFkU3RyaW5nKFwiSVBSRFwiKVxyXG4gICAgaW5mby5zb2Z0d2FyZSA9IHJlYWRTdHJpbmcoXCJJU0ZUXCIpXHJcbiAgICBpbmZvLnZlcnNpb24gPSByZWFkVmVyc2lvblRhZyhcImlmaWxcIikhXHJcbiAgICBpbmZvLnNvdW5kRW5naW5lID0gcmVhZFN0cmluZyhcImlzbmdcIilcclxuICAgIGluZm8ucm9tTmFtZSA9IHJlYWRTdHJpbmcoXCJpcm9tXCIpXHJcbiAgICBpbmZvLnJvbVZlcnNpb24gPSByZWFkVmVyc2lvblRhZyhcIml2ZXJcIilcclxuICAgIHJldHVybiBpbmZvXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlc2V0SGVhZGVyIHtcclxuICBwcmVzZXROYW1lOiBzdHJpbmdcclxuICBwcmVzZXQ6IG51bWJlclxyXG4gIGJhbms6IG51bWJlclxyXG4gIHByZXNldEJhZ0luZGV4OiBudW1iZXJcclxuICBsaWJyYXJ5OiBudW1iZXJcclxuICBnZW5yZTogbnVtYmVyXHJcbiAgbW9ycGhvbG9neTogbnVtYmVyXHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnByZXNldE5hbWUgPT09IFwiRU9QXCJcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBQcmVzZXRIZWFkZXIoKVxyXG4gICAgcC5wcmVzZXROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICBwLnByZXNldCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLmJhbmsgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLmxpYnJhcnkgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHAuZ2VucmUgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHAubW9ycGhvbG9neSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcmV0dXJuIHBcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcmVzZXRCYWcge1xyXG4gIHByZXNldEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBwcmVzZXRNb2R1bGF0b3JJbmRleDogbnVtYmVyXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBQcmVzZXRCYWcoKVxyXG4gICAgcC5wcmVzZXRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLnByZXNldE1vZHVsYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmFuZ2VWYWx1ZSB7XHJcbiAgbG86IG51bWJlclxyXG4gIGhpOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IobG86IG51bWJlciwgaGk6IG51bWJlcikge1xyXG4gICAgdGhpcy5sbyA9IGxvXHJcbiAgICB0aGlzLmhpID0gaGlcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgcmV0dXJuIG5ldyBSYW5nZVZhbHVlKFxyXG4gICAgICBzdHJlYW0ucmVhZEJ5dGUoKSwgXHJcbiAgICAgIHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kdWxhdG9yTGlzdCB7XHJcbiAgc291cmNlT3BlcjogbnVtYmVyXHJcbiAgZGVzdGluYXRpb25PcGVyOiBudW1iZXJcclxuICB2YWx1ZTogbnVtYmVyfFJhbmdlVmFsdWVcclxuICBhbW91bnRTb3VyY2VPcGVyOiBudW1iZXJcclxuICB0cmFuc09wZXI6IG51bWJlclxyXG5cclxuICBnZXQgdHlwZSgpIHtcclxuICAgIHJldHVybiBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGVbdGhpcy5kZXN0aW5hdGlvbk9wZXJdXHJcbiAgfVxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2VPcGVyID09PSAwICYmIFxyXG4gICAgICB0aGlzLmRlc3RpbmF0aW9uT3BlciA9PT0gMCAmJlxyXG4gICAgICB0aGlzLnZhbHVlID09PSAwICYmXHJcbiAgICAgIHRoaXMuYW1vdW50U291cmNlT3BlciA9PT0gMCAmJlxyXG4gICAgICB0aGlzLiB0cmFuc09wZXIgPT09IDBcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBNb2R1bGF0b3JMaXN0KClcclxuXHJcbiAgICB0LnNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC5kZXN0aW5hdGlvbk9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHN3aXRjaCAodC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ2tleVJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAndmVsUmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICdrZXludW0nOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICd2ZWxvY2l0eSc6XHJcbiAgICAgICAgdC52YWx1ZSA9IFJhbmdlVmFsdWUucGFyc2Uoc3RyZWFtKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdC52YWx1ZSA9IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHQuYW1vdW50U291cmNlT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0LnRyYW5zT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHZW5lcmF0b3JMaXN0IHtcclxuICBjb2RlOiBudW1iZXJcclxuICB2YWx1ZTogbnVtYmVyfFJhbmdlVmFsdWVcclxuXHJcbiAgZ2V0IHR5cGUoKSB7XHJcbiAgICByZXR1cm4gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW3RoaXMuY29kZV1cclxuICB9XHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmNvZGUgPT09IDAgJiZcclxuICAgICAgdGhpcy52YWx1ZSA9PT0gMFxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IEdlbmVyYXRvckxpc3QoKVxyXG4gICAgdC5jb2RlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzd2l0Y2ggKHQudHlwZSkge1xyXG4gICAgICBjYXNlICdrZXludW0nOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgIHQudmFsdWUgPSBSYW5nZVZhbHVlLnBhcnNlKHN0cmVhbSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHQudmFsdWUgPSBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudCB7XHJcbiAgaW5zdHJ1bWVudE5hbWU6IHN0cmluZ1xyXG4gIGluc3RydW1lbnRCYWdJbmRleDogbnVtYmVyXHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmluc3RydW1lbnROYW1lID09PSBcIkVPSVwiXHJcbiAgfVxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBJbnN0cnVtZW50KClcclxuICAgIHQuaW5zdHJ1bWVudE5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHQuaW5zdHJ1bWVudEJhZ0luZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudEJhZyB7XHJcbiAgaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBpbnN0cnVtZW50TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBJbnN0cnVtZW50QmFnKClcclxuICAgIHQuaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQuaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2FtcGxlSGVhZGVyIHtcclxuICBzYW1wbGVOYW1lOiBzdHJpbmdcclxuICBzdGFydDogbnVtYmVyXHJcbiAgZW5kOiBudW1iZXJcclxuICBsb29wU3RhcnQ6IG51bWJlclxyXG4gIGxvb3BFbmQ6IG51bWJlclxyXG4gIHNhbXBsZVJhdGU6IG51bWJlclxyXG4gIG9yaWdpbmFsUGl0Y2g6IG51bWJlclxyXG4gIHBpdGNoQ29ycmVjdGlvbjogbnVtYmVyXHJcbiAgc2FtcGxlTGluazogbnVtYmVyXHJcbiAgc2FtcGxlVHlwZTogbnVtYmVyXHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnNhbXBsZU5hbWUgPT09IFwiRU9TXCJcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcyA9IG5ldyBTYW1wbGVIZWFkZXIoKVxyXG5cclxuICAgIHMuc2FtcGxlTmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcy5zdGFydCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5lbmQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMubG9vcFN0YXJ0ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmxvb3BFbmQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuc2FtcGxlUmF0ZSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5vcmlnaW5hbFBpdGNoID0gc3RyZWFtLnJlYWRCeXRlKClcclxuICAgIHMucGl0Y2hDb3JyZWN0aW9uID0gc3RyZWFtLnJlYWRJbnQ4KClcclxuICAgIHMuc2FtcGxlTGluayA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBzLnNhbXBsZVR5cGUgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHMubG9vcFN0YXJ0IC09IHMuc3RhcnRcclxuICAgIHMubG9vcEVuZCAtPSBzLnN0YXJ0XHJcblxyXG4gICAgcmV0dXJuIHNcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBTYW1wbGVMaW5rID0ge1xyXG4gIG1vbm9TYW1wbGU6IDEsXHJcbiAgcmlnaHRTYW1wbGU6IDIsXHJcbiAgbGVmdFNhbXBsZTogNCxcclxuICBsaW5rZWRTYW1wbGU6IDgsXHJcbiAgUm9tTW9ub1NhbXBsZTogMHg4MDAxLFxyXG4gIFJvbVJpZ2h0U2FtcGxlOiAweDgwMDIsXHJcbiAgUm9tTGVmdFNhbXBsZTogMHg4MDA0LFxyXG4gIFJvbUxpbmtlZFNhbXBsZTogMHg4MDA4XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N0cnVjdHMudHMiLCJpbXBvcnQgeyBwYXJzZVJpZmYsIENodW5rLCBPcHRpb25zIGFzIFJpZmZQYXJzZXJPcHRpb25zIH0gZnJvbSBcIi4vUmlmZlBhcnNlclwiXHJcbmltcG9ydCB7IFByZXNldEhlYWRlciwgU2FtcGxlSGVhZGVyLCBQcmVzZXRCYWcsIEluc3RydW1lbnQsIEluc3RydW1lbnRCYWcsIE1vZHVsYXRvckxpc3QsIEdlbmVyYXRvckxpc3QsIEluZm8gfSBmcm9tIFwiLi9TdHJ1Y3RzXCJcclxuaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9TdHJlYW1cIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQYXJzZVJlc3VsdCB7XHJcbiAgcHJlc2V0SGVhZGVyczogUHJlc2V0SGVhZGVyW11cclxuICBwcmVzZXRab25lOiBQcmVzZXRCYWdbXVxyXG4gIHByZXNldE1vZHVsYXRvcnM6IE1vZHVsYXRvckxpc3RbXVxyXG4gIHByZXNldEdlbmVyYXRvcnM6IEdlbmVyYXRvckxpc3RbXVxyXG4gIGluc3RydW1lbnRzOiBJbnN0cnVtZW50W11cclxuICBpbnN0cnVtZW50Wm9uZTogSW5zdHJ1bWVudEJhZ1tdXHJcbiAgaW5zdHJ1bWVudE1vZHVsYXRvcnM6IE1vZHVsYXRvckxpc3RbXVxyXG4gIGluc3RydW1lbnRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W11cclxuICBzYW1wbGVIZWFkZXJzOiBTYW1wbGVIZWFkZXJbXVxyXG4gIHNhbXBsZXM6IEludDE2QXJyYXlbXVxyXG4gIHNhbXBsaW5nRGF0YTogQ2h1bmtcclxuICBpbmZvOiBJbmZvXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlKGlucHV0OiBVaW50OEFycmF5LCBvcHRpb246IFJpZmZQYXJzZXJPcHRpb25zID0ge30pOiBQYXJzZVJlc3VsdCB7XHJcblxyXG4gIC8vIHBhcnNlIFJJRkYgY2h1bmtcclxuICBjb25zdCBjaHVua0xpc3QgPSBwYXJzZVJpZmYoaW5wdXQsIDAsIGlucHV0Lmxlbmd0aCwgb3B0aW9uKVxyXG5cclxuICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBjaHVuayBsZW5ndGgnKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2h1bmsgPSBjaHVua0xpc3RbMF1cclxuICBpZiAoY2h1bmsgPT09IG51bGwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignY2h1bmsgbm90IGZvdW5kJylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlUmlmZkNodW5rKGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gICAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIlJJRkZcIiwgXCJzZmJrXCIpXHJcblxyXG4gICAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDMpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNmYmsgc3RydWN0dXJlJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAvLyBJTkZPLWxpc3RcclxuICAgICAgaW5mbzogcGFyc2VJbmZvTGlzdChjaHVua0xpc3RbMF0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gc2R0YS1saXN0XHJcbiAgICAgIHNhbXBsaW5nRGF0YTogcGFyc2VTZHRhTGlzdChjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gcGR0YS1saXN0XHJcbiAgICAgIC4uLnBhcnNlUGR0YUxpc3QoY2h1bmtMaXN0WzJdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VQZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwicGR0YVwiKVxyXG5cclxuICAgIC8vIGNoZWNrIG51bWJlciBvZiBjaHVua3NcclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSA5KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwZHRhIGNodW5rJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwcmVzZXRIZWFkZXJzOiBwYXJzZVBoZHIoY2h1bmtMaXN0WzBdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0Wm9uZTogcGFyc2VQYmFnKGNodW5rTGlzdFsxXSwgZGF0YSksXHJcbiAgICAgIHByZXNldE1vZHVsYXRvcnM6IHBhcnNlUG1vZChjaHVua0xpc3RbMl0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRHZW5lcmF0b3JzOiBwYXJzZVBnZW4oY2h1bmtMaXN0WzNdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudHM6IHBhcnNlSW5zdChjaHVua0xpc3RbNF0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50Wm9uZTogcGFyc2VJYmFnKGNodW5rTGlzdFs1XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRNb2R1bGF0b3JzOiBwYXJzZUltb2QoY2h1bmtMaXN0WzZdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudEdlbmVyYXRvcnM6IHBhcnNlSWdlbihjaHVua0xpc3RbN10sIGRhdGEpLFxyXG4gICAgICBzYW1wbGVIZWFkZXJzOiBwYXJzZVNoZHIoY2h1bmtMaXN0WzhdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVzdWx0ID0gcGFyc2VSaWZmQ2h1bmsoY2h1bmssIGlucHV0KVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgLi4ucmVzdWx0LFxyXG4gICAgc2FtcGxlczogbG9hZFNhbXBsZShyZXN1bHQuc2FtcGxlSGVhZGVycywgcmVzdWx0LnNhbXBsaW5nRGF0YS5vZmZzZXQsIGlucHV0KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBleHBlY3RlZFR5cGUsIGV4cGVjdGVkU2lnbmF0dXJlKSB7XHJcbiAgLy8gY2hlY2sgcGFyc2UgdGFyZ2V0XHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyArIGNodW5rLnR5cGUpXHJcbiAgfVxyXG5cclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuXHJcbiAgLy8gY2hlY2sgc2lnbmF0dXJlXHJcbiAgY29uc3Qgc2lnbmF0dXJlID0gc3RyZWFtLnJlYWRTdHJpbmcoNClcclxuICBpZiAoc2lnbmF0dXJlICE9PSBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKVxyXG4gIH1cclxuXHJcbiAgLy8gcmVhZCBzdHJ1Y3R1cmVcclxuICByZXR1cm4gcGFyc2VSaWZmKGRhdGEsIHN0cmVhbS5pcCwgY2h1bmsuc2l6ZSAtIDQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlSW5mb0xpc3QoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJJTkZPXCIpXHJcbiAgcmV0dXJuIEluZm8ucGFyc2UoZGF0YSwgY2h1bmtMaXN0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNkdGFMaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSk6IENodW5rIHtcclxuICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcInNkdGFcIilcclxuXHJcbiAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVE9ETycpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2h1bmtMaXN0WzBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQ2h1bms8VD4oY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5LCB0eXBlOiBzdHJpbmcsIGNsYXp6OiB7IHBhcnNlOiAoc3RyZWFtOiBTdHJlYW0pID0+IFQgfSwgdGVybWluYXRlPzogKG9iajogVCkgPT4gYm9vbGVhbik6IFRbXSB7XHJcbiAgY29uc3QgcmVzdWx0OiBUW10gPSBbXVxyXG5cclxuICBpZiAoY2h1bmsudHlwZSAhPT0gdHlwZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyAgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuICBcclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuICBjb25zdCBzaXplID0gY2h1bmsub2Zmc2V0ICsgY2h1bmsuc2l6ZVxyXG4gIFxyXG4gIHdoaWxlIChzdHJlYW0uaXAgPCBzaXplKSB7XHJcbiAgICBjb25zdCBvYmogPSBjbGF6ei5wYXJzZShzdHJlYW0pXHJcbiAgICBpZiAodGVybWluYXRlICYmIHRlcm1pbmF0ZShvYmopKSB7XHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXN1bHQucHVzaChvYmopXHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmNvbnN0IHBhcnNlUGhkciA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwaGRyXCIsIFByZXNldEhlYWRlciwgcCA9PiBwLmlzRW5kKVxyXG5jb25zdCBwYXJzZVBiYWcgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGJhZ1wiLCBQcmVzZXRCYWcpXHJcbmNvbnN0IHBhcnNlSW5zdCA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpbnN0XCIsIEluc3RydW1lbnQsIGkgPT4gaS5pc0VuZClcclxuY29uc3QgcGFyc2VJYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImliYWdcIiwgSW5zdHJ1bWVudEJhZylcclxuY29uc3QgcGFyc2VQbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBtb2RcIiwgTW9kdWxhdG9yTGlzdCwgbSA9PiBtLmlzRW5kKVxyXG5jb25zdCBwYXJzZUltb2QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW1vZFwiLCBNb2R1bGF0b3JMaXN0LCBtID0+IG0uaXNFbmQpXHJcbmNvbnN0IHBhcnNlUGdlbiA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwZ2VuXCIsIEdlbmVyYXRvckxpc3QsIGcgPT4gZy5pc0VuZClcclxuY29uc3QgcGFyc2VJZ2VuID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImlnZW5cIiwgR2VuZXJhdG9yTGlzdCwgZyA9PiBnLmlzRW5kKVxyXG5jb25zdCBwYXJzZVNoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwic2hkclwiLCBTYW1wbGVIZWFkZXIsIHMgPT4gcy5pc0VuZClcclxuXHJcbmZ1bmN0aW9uIGFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBzYW1wbGVSYXRlKSB7XHJcbiAgbGV0IG11bHRpcGx5ID0gMVxyXG5cclxuICAvLyBidWZmZXJcclxuICB3aGlsZSAoc2FtcGxlUmF0ZSA8IDIyMDUwKSB7XHJcbiAgICBjb25zdCBuZXdTYW1wbGUgPSBuZXcgSW50MTZBcnJheShzYW1wbGUubGVuZ3RoICogMilcclxuICAgIGZvciAobGV0IGkgPSAwLCBqID0gMCwgaWwgPSBzYW1wbGUubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgICBuZXdTYW1wbGVbaisrXSA9IHNhbXBsZVtpXVxyXG4gICAgICBuZXdTYW1wbGVbaisrXSA9IHNhbXBsZVtpXVxyXG4gICAgfVxyXG4gICAgc2FtcGxlID0gbmV3U2FtcGxlXHJcbiAgICBtdWx0aXBseSAqPSAyXHJcbiAgICBzYW1wbGVSYXRlICo9IDJcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzYW1wbGUsXHJcbiAgICBtdWx0aXBseVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFNhbXBsZShzYW1wbGVIZWFkZXI6IFNhbXBsZUhlYWRlcltdLCBzYW1wbGluZ0RhdGFPZmZzZXQ6IG51bWJlciwgZGF0YTogVWludDhBcnJheSk6IEludDE2QXJyYXlbXSB7XHJcbiAgcmV0dXJuIHNhbXBsZUhlYWRlci5tYXAoaGVhZGVyID0+IHtcclxuICAgIGxldCBzYW1wbGUgPSBuZXcgSW50MTZBcnJheShuZXcgVWludDhBcnJheShkYXRhLnN1YmFycmF5KFxyXG4gICAgICBzYW1wbGluZ0RhdGFPZmZzZXQgKyBoZWFkZXIuc3RhcnQgKiAyLFxyXG4gICAgICBzYW1wbGluZ0RhdGFPZmZzZXQgKyBoZWFkZXIuZW5kICAgKiAyXHJcbiAgICApKS5idWZmZXIpXHJcbiAgICBpZiAoaGVhZGVyLnNhbXBsZVJhdGUgPiAwKSB7XHJcbiAgICAgIGNvbnN0IGFkanVzdCA9IGFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBoZWFkZXIuc2FtcGxlUmF0ZSlcclxuICAgICAgc2FtcGxlID0gYWRqdXN0LnNhbXBsZVxyXG4gICAgICBoZWFkZXIuc2FtcGxlUmF0ZSAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgICAgaGVhZGVyLmxvb3BTdGFydCAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgICAgaGVhZGVyLmxvb3BFbmQgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2FtcGxlXHJcbiAgfSlcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QYXJzZXIudHMiLCJpbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rKGlucHV0OiBVaW50OEFycmF5LCBpcDogbnVtYmVyLCBiaWdFbmRpYW46IGJvb2xlYW4pOiBDaHVuayB7XHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShpbnB1dCwgaXApXHJcbiAgY29uc3QgdHlwZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgY29uc3Qgc2l6ZSA9IHN0cmVhbS5yZWFkRFdPUkQoYmlnRW5kaWFuKVxyXG4gIHJldHVybiBuZXcgQ2h1bmsodHlwZSwgc2l6ZSwgc3RyZWFtLmlwKVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnMge1xyXG4gIHBhZGRpbmc/OiBib29sZWFuLFxyXG4gIGJpZ0VuZGlhbj86IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmlmZihpbnB1dDogVWludDhBcnJheSwgaW5kZXg6IG51bWJlciA9IDAsIGxlbmd0aDogbnVtYmVyLCB7IHBhZGRpbmcgPSB0cnVlLCBiaWdFbmRpYW4gPSBmYWxzZSB9OiBPcHRpb25zID0ge30pIHtcclxuICBjb25zdCBjaHVua0xpc3Q6IENodW5rW10gPSBbXVxyXG4gIGNvbnN0IGVuZCA9IGxlbmd0aCArIGluZGV4XHJcbiAgbGV0IGlwID0gaW5kZXhcclxuXHJcbiAgd2hpbGUgKGlwIDwgZW5kKSB7XHJcbiAgICBjb25zdCBjaHVuayA9IHBhcnNlQ2h1bmsoaW5wdXQsIGlwLCBiaWdFbmRpYW4pXHJcbiAgICBpcCA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemVcclxuICAgIFxyXG4gICAgLy8gcGFkZGluZ1xyXG4gICAgaWYgKHBhZGRpbmcgJiYgKChpcCAtIGluZGV4KSAmIDEpID09PSAxKSB7XHJcbiAgICAgIGlwKytcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2h1bmtMaXN0LnB1c2goY2h1bmspXHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2h1bmtMaXN0XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaHVuayB7XHJcbiAgdHlwZTogc3RyaW5nXHJcbiAgc2l6ZTogbnVtYmVyXHJcbiAgb2Zmc2V0OiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgICB0aGlzLnNpemUgPSBzaXplXHJcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldFxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmlmZlBhcnNlci50cyIsImV4cG9ydCBjb25zdCBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgPSBbXHJcbiAgJ3N0YXJ0QWRkcnNPZmZzZXQnLFxyXG4gICdlbmRBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kbG9vcEFkZHJzT2Zmc2V0JyxcclxuICAnc3RhcnRBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ21vZExmb1RvUGl0Y2gnLFxyXG4gICd2aWJMZm9Ub1BpdGNoJyxcclxuICAnbW9kRW52VG9QaXRjaCcsXHJcbiAgJ2luaXRpYWxGaWx0ZXJGYycsXHJcbiAgJ2luaXRpYWxGaWx0ZXJRJyxcclxuICAnbW9kTGZvVG9GaWx0ZXJGYycsXHJcbiAgJ21vZEVudlRvRmlsdGVyRmMnLFxyXG4gICdlbmRBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ21vZExmb1RvVm9sdW1lJyxcclxuICB1bmRlZmluZWQsIC8vIDE0XHJcbiAgJ2Nob3J1c0VmZmVjdHNTZW5kJyxcclxuICAncmV2ZXJiRWZmZWN0c1NlbmQnLFxyXG4gICdwYW4nLFxyXG4gIHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLCAvLyAxOCwxOSwyMFxyXG4gICdkZWxheU1vZExGTycsXHJcbiAgJ2ZyZXFNb2RMRk8nLFxyXG4gICdkZWxheVZpYkxGTycsXHJcbiAgJ2ZyZXFWaWJMRk8nLFxyXG4gICdkZWxheU1vZEVudicsXHJcbiAgJ2F0dGFja01vZEVudicsXHJcbiAgJ2hvbGRNb2RFbnYnLFxyXG4gICdkZWNheU1vZEVudicsXHJcbiAgJ3N1c3RhaW5Nb2RFbnYnLFxyXG4gICdyZWxlYXNlTW9kRW52JyxcclxuICAna2V5bnVtVG9Nb2RFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Nb2RFbnZEZWNheScsXHJcbiAgJ2RlbGF5Vm9sRW52JyxcclxuICAnYXR0YWNrVm9sRW52JyxcclxuICAnaG9sZFZvbEVudicsXHJcbiAgJ2RlY2F5Vm9sRW52JyxcclxuICAnc3VzdGFpblZvbEVudicsXHJcbiAgJ3JlbGVhc2VWb2xFbnYnLFxyXG4gICdrZXludW1Ub1ZvbEVudkhvbGQnLFxyXG4gICdrZXludW1Ub1ZvbEVudkRlY2F5JyxcclxuICAnaW5zdHJ1bWVudCcsXHJcbiAgdW5kZWZpbmVkLCAvLyA0MlxyXG4gICdrZXlSYW5nZScsXHJcbiAgJ3ZlbFJhbmdlJyxcclxuICAnc3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdrZXludW0nLFxyXG4gICd2ZWxvY2l0eScsXHJcbiAgJ2luaXRpYWxBdHRlbnVhdGlvbicsXHJcbiAgdW5kZWZpbmVkLCAvLyA0OVxyXG4gICdlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdjb2Fyc2VUdW5lJyxcclxuICAnZmluZVR1bmUnLFxyXG4gICdzYW1wbGVJRCcsXHJcbiAgJ3NhbXBsZU1vZGVzJyxcclxuICB1bmRlZmluZWQsIC8vIDU1XHJcbiAgJ3NjYWxlVHVuaW5nJyxcclxuICAnZXhjbHVzaXZlQ2xhc3MnLFxyXG4gICdvdmVycmlkaW5nUm9vdEtleSdcclxuXVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQ29uc3RhbnRzLnRzIiwiaW1wb3J0IFdlYk1pZGlMaW5rIGZyb20gXCIuLi9zcmMvV2ViTWlkaUxpbmsudHNcIlxyXG5leHBvcnQge1xyXG4gIFdlYk1pZGlMaW5rXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXhwb3J0L3N5bnRoLmpzIiwiaW1wb3J0IFN5bnRoZXNpemVyIGZyb20gXCIuL1N5bnRoZXNpemVyXCJcclxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vVmlld1wiXHJcbmltcG9ydCBNaWRpTWVzc2FnZUhhbmRsZXIsIHsgTGlzdGVuZXIgfSBmcm9tIFwiLi9NaWRpTWVzc2FnZUhhbmRsZXJcIlxyXG5pbXBvcnQgZGVsZWdhdGVQcm94eSBmcm9tIFwiLi9kZWxlZ2F0ZVByb3h5XCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYk1pZGlMaW5rIHtcclxuICBsb2FkQ2FsbGJhY2s6IChBcnJheUJ1ZmZlcikgPT4gdm9pZFxyXG4gIG1pZGlNZXNzYWdlSGFuZGxlcjogTWlkaU1lc3NhZ2VIYW5kbGVyXHJcbiAgcmVhZHk6IGJvb2xlYW4gPSBmYWxzZVxyXG4gIHN5bnRoOiBTeW50aGVzaXplclxyXG4gIHZpZXc6IFZpZXdcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLm1pZGlNZXNzYWdlSGFuZGxlciA9IG5ldyBNaWRpTWVzc2FnZUhhbmRsZXIoKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMucmVhZHkgPSB0cnVlXHJcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKVxyXG4gIH1cclxuXHJcbiAgc2V0dXAodXJsKSB7XHJcbiAgICBpZiAoIXRoaXMucmVhZHkpIHtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiBvbmxvYWQoKSB7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBvbmxvYWQsIGZhbHNlKVxyXG4gICAgICAgIHRoaXMubG9hZCh1cmwpXHJcbiAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxvYWQodXJsKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZCh1cmwpIHtcclxuICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcblxyXG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSlcclxuICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInXHJcblxyXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihldikge1xyXG4gICAgICBjb25zdCB4aHIgPSBldi50YXJnZXQgYXMgWE1MSHR0cFJlcXVlc3RcclxuXHJcbiAgICAgIHRoaXMub25sb2FkKHhoci5yZXNwb25zZSlcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmxvYWRDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRoaXMubG9hZENhbGxiYWNrKHhoci5yZXNwb25zZSlcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSlcclxuXHJcbiAgICB4aHIuc2VuZCgpXHJcbiAgfVxyXG5cclxuICBvbmxvYWQocmVzcG9uc2U6IEFycmF5QnVmZmVyKSB7XHJcbiAgICBjb25zdCBpbnB1dCA9IG5ldyBVaW50OEFycmF5KHJlc3BvbnNlKVxyXG4gICAgdGhpcy5sb2FkU291bmRGb250KGlucHV0KVxyXG4gIH1cclxuXHJcbiAgbG9hZFNvdW5kRm9udChpbnB1dDogVWludDhBcnJheSkge1xyXG4gICAgbGV0IHN5bnRoOiBTeW50aGVzaXplclxyXG5cclxuICAgIGlmICghdGhpcy5zeW50aCkge1xyXG4gICAgICBjb25zdCBjdHggPSBuZXcgQXVkaW9Db250ZXh0KClcclxuICAgICAgc3ludGggPSB0aGlzLnN5bnRoID0gbmV3IFN5bnRoZXNpemVyKGN0eClcclxuICAgICAgc3ludGguaW5pdCgpXHJcbiAgICAgIHN5bnRoLnJlZnJlc2hJbnN0cnVtZW50cyhpbnB1dClcclxuICAgICAgc3ludGguY29ubmVjdChjdHguZGVzdGluYXRpb24pXHJcbiAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnZpZXcgPSBuZXcgVmlldygpXHJcbiAgICAgIGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihcIi5zeW50aFwiKSEuYXBwZW5kQ2hpbGQodmlldy5kcmF3KHN5bnRoKSlcclxuICAgICAgdGhpcy5taWRpTWVzc2FnZUhhbmRsZXIubGlzdGVuZXIgPSBkZWxlZ2F0ZVByb3h5PExpc3RlbmVyPihbc3ludGgsIHZpZXddKSBcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLm9ubWVzc2FnZS5iaW5kKHRoaXMpLCBmYWxzZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN5bnRoID0gdGhpcy5zeW50aFxyXG4gICAgICBzeW50aC5yZWZyZXNoSW5zdHJ1bWVudHMoaW5wdXQpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gbGluayByZWFkeVxyXG4gICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcclxuICAgICAgd2luZG93Lm9wZW5lci5wb3N0TWVzc2FnZShcImxpbmsscmVhZHlcIiwgJyonKVxyXG4gICAgfSBlbHNlIGlmICh3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShcImxpbmsscmVhZHlcIiwgJyonKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25tZXNzYWdlKGV2OiBNZXNzYWdlRXZlbnQpIHtcclxuICAgIGNvbnN0IG1zZyA9IGV2LmRhdGEuc3BsaXQoJywnKVxyXG4gICAgY29uc3QgdHlwZSA9IG1zZy5zaGlmdCgpXHJcblxyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgJ21pZGknOlxyXG4gICAgICAgIHRoaXMubWlkaU1lc3NhZ2VIYW5kbGVyLnByb2Nlc3NNaWRpTWVzc2FnZShcclxuICAgICAgICAgIG1zZy5tYXAoZnVuY3Rpb24oaGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChoZXgsIDE2KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnbGluayc6XHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG1zZy5zaGlmdCgpXHJcbiAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XHJcbiAgICAgICAgICBjYXNlICdyZXFwYXRjaCc6XHJcbiAgICAgICAgICAgIC8vIFRPRE86IGR1bW15IGRhdGFcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcclxuICAgICAgICAgICAgICB3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKFwibGluayxwYXRjaFwiLCAnKicpXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LnBhcmVudCAhPT0gd2luZG93KSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShcImxpbmsscGF0Y2hcIiwgJyonKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlICdzZXRwYXRjaCc6XHJcbiAgICAgICAgICAgIC8vIFRPRE86IE5PUFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcigndW5rbm93biBsaW5rIG1lc3NhZ2U6JywgY29tbWFuZClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zb2xlLmVycm9yKCd1bmtub3duIG1lc3NhZ2UgdHlwZScpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRMb2FkQ2FsbGJhY2soY2FsbGJhY2s6IChBcnJheUJ1ZmZlcikgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5sb2FkQ2FsbGJhY2sgPSBjYWxsYmFja1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvV2ViTWlkaUxpbmsudHMiLCJpbXBvcnQgU3ludGhlc2l6ZXJOb3RlIGZyb20gXCIuL1N5bnRoZXNpemVyTm90ZVwiXHJcbmltcG9ydCBwYXJzZSBmcm9tIFwiLi9QYXJzZXJcIlxyXG5pbXBvcnQgU291bmRGb250IGZyb20gXCIuL1NvdW5kRm9udFwiXHJcbmltcG9ydCB7IEluc3RydW1lbnRTdGF0ZSB9IGZyb20gXCIuL1N5bnRoZXNpemVyTm90ZVwiXHJcbmltcG9ydCB7IExpc3RlbmVyIH0gZnJvbSBcIi4vTWlkaU1lc3NhZ2VIYW5kbGVyXCJcclxuXHJcbmNvbnN0IEJBU0VfVk9MVU1FID0gMC40XHJcblxyXG5jbGFzcyBDaGFubmVsIHtcclxuICBpbnN0cnVtZW50ID0gMFxyXG4gIHZvbHVtZSA9IDBcclxuICBwaXRjaEJlbmQgPSAwXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPSAwXHJcbiAgcGFucG90ID0gMFxyXG4gIGN1cnJlbnROb3RlT246IFN5bnRoZXNpemVyTm90ZVtdID0gW11cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ludGhlc2l6ZXIgaW1wbGVtZW50cyBMaXN0ZW5lciB7XHJcbiAgYmFuazogbnVtYmVyID0gMFxyXG4gIGJ1ZmZlclNpemU6IG51bWJlciA9IDEwMjRcclxuICBjdHg6IEF1ZGlvQ29udGV4dFxyXG4gIGdhaW5NYXN0ZXI6IEdhaW5Ob2RlXHJcbiAgY2hhbm5lbHM6IENoYW5uZWxbXSA9IFtdXHJcbiAgbWFzdGVyVm9sdW1lOiBudW1iZXIgPSAxLjBcclxuICBzb3VuZEZvbnQ6IFNvdW5kRm9udFxyXG5cclxuICBjb25zdHJ1Y3RvcihjdHgpIHtcclxuICAgIHRoaXMuY3R4ID0gY3R4XHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIgPSB0aGlzLmN0eC5jcmVhdGVHYWluKClcclxuICAgIHRoaXMuc2V0TWFzdGVyVm9sdW1lKHRoaXMubWFzdGVyVm9sdW1lKVxyXG4gICAgdGhpcy5pbml0KClcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcclxuICAgICAgdGhpcy5jaGFubmVscy5wdXNoKG5ldyBDaGFubmVsKCkpXHJcbiAgICAgIHRoaXMucHJvZ3JhbUNoYW5nZShpLCBpICE9PSA5ID8gaSA6IDApXHJcbiAgICAgIHRoaXMudm9sdW1lQ2hhbmdlKGksIDB4NjQpXHJcbiAgICAgIHRoaXMucGFucG90Q2hhbmdlKGksIDB4NDApXHJcbiAgICAgIHRoaXMucGl0Y2hCZW5kKGksIDApXHJcbiAgICAgIHRoaXMucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoaSwgMilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlZnJlc2hJbnN0cnVtZW50cyhpbnB1dDogVWludDhBcnJheSkge1xyXG4gICAgY29uc3QgcGFyc2VyID0gcGFyc2UoaW5wdXQpXHJcbiAgICB0aGlzLnNvdW5kRm9udCA9IG5ldyBTb3VuZEZvbnQocGFyc2VyKVxyXG4gIH1cclxuXHJcbiAgY29ubmVjdChkZXN0aW5hdGlvbjogQXVkaW9Ob2RlKSB7XHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIuY29ubmVjdChkZXN0aW5hdGlvbilcclxuICB9XHJcblxyXG4gIHNldE1hc3RlclZvbHVtZSh2b2x1bWU6IG51bWJlcikge1xyXG4gICAgdGhpcy5tYXN0ZXJWb2x1bWUgPSB2b2x1bWVcclxuICAgIHRoaXMuZ2Fpbk1hc3Rlci5nYWluLnZhbHVlID0gQkFTRV9WT0xVTUUgKiB2b2x1bWUgLyAweDgwMDBcclxuICB9XHJcblxyXG4gIG5vdGVPbihjaGFubmVsTnVtYmVyOiBudW1iZXIsIGtleTogbnVtYmVyLCB2ZWxvY2l0eTogbnVtYmVyKSB7XHJcbiAgICBpZiAoIXRoaXMuc291bmRGb250KSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgY29uc3QgYmFua051bWJlciA9IGNoYW5uZWxOdW1iZXIgPT09IDkgPyAxMjggOiB0aGlzLmJhbmtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdXHJcblxyXG4gICAgY29uc3Qgbm90ZUluZm8gPSB0aGlzLnNvdW5kRm9udC5nZXRJbnN0cnVtZW50S2V5KGJhbmtOdW1iZXIsIGNoYW5uZWwuaW5zdHJ1bWVudCwga2V5LCB2ZWxvY2l0eSlcclxuXHJcbiAgICBpZiAoIW5vdGVJbmZvKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGxldCBwYW5wb3QgPSBjaGFubmVsLnBhbnBvdCAtIDY0XHJcbiAgICBwYW5wb3QgLz0gcGFucG90IDwgMCA/IDY0IDogNjNcclxuXHJcbiAgICAvLyBjcmVhdGUgbm90ZSBpbmZvcm1hdGlvblxyXG4gICAgY29uc3QgaW5zdHJ1bWVudEtleTogSW5zdHJ1bWVudFN0YXRlID0ge1xyXG4gICAgICBjaGFubmVsOiBjaGFubmVsTnVtYmVyLFxyXG4gICAgICBrZXk6IGtleSxcclxuICAgICAgdmVsb2NpdHk6IHZlbG9jaXR5LFxyXG4gICAgICBwYW5wb3Q6IHBhbnBvdCxcclxuICAgICAgdm9sdW1lOiBjaGFubmVsLnZvbHVtZSAvIDEyNyxcclxuICAgICAgcGl0Y2hCZW5kOiBjaGFubmVsLnBpdGNoQmVuZCAtIDB4MjAwMCxcclxuICAgICAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHk6IGNoYW5uZWwucGl0Y2hCZW5kU2Vuc2l0aXZpdHlcclxuICAgIH1cclxuXHJcbiAgICAvLyBub3RlIG9uXHJcbiAgICBjb25zdCBub3RlID0gbmV3IFN5bnRoZXNpemVyTm90ZSh0aGlzLmN0eCwgdGhpcy5nYWluTWFzdGVyLCBub3RlSW5mbywgaW5zdHJ1bWVudEtleSlcclxuICAgIG5vdGUubm90ZU9uKClcclxuICAgIGNoYW5uZWwuY3VycmVudE5vdGVPbi5wdXNoKG5vdGUpXHJcbiAgfVxyXG5cclxuICBub3RlT2ZmKGNoYW5uZWxOdW1iZXI6IG51bWJlciwga2V5OiBudW1iZXIsIF92ZWxvY2l0eTogbnVtYmVyKSB7XHJcbiAgICBpZiAoIXRoaXMuc291bmRGb250KSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgY29uc3QgYmFua051bWJlciA9IGNoYW5uZWxOdW1iZXIgPT09IDkgPyAxMjggOiB0aGlzLmJhbmtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdXHJcblxyXG4gICAgY29uc3QgaW5zdHJ1bWVudEtleSA9IHRoaXMuc291bmRGb250LmdldEluc3RydW1lbnRLZXkoYmFua051bWJlciwgY2hhbm5lbC5pbnN0cnVtZW50LCBrZXkpXHJcblxyXG4gICAgaWYgKCFpbnN0cnVtZW50S2V5KSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGN1cnJlbnROb3RlT24gPSBjaGFubmVsLmN1cnJlbnROb3RlT25cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMCwgaWwgPSBjdXJyZW50Tm90ZU9uLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgY29uc3Qgbm90ZSA9IGN1cnJlbnROb3RlT25baV1cclxuICAgICAgaWYgKG5vdGUua2V5ID09PSBrZXkpIHtcclxuICAgICAgICBub3RlLm5vdGVPZmYoKVxyXG4gICAgICAgIGN1cnJlbnROb3RlT24uc3BsaWNlKGksIDEpXHJcbiAgICAgICAgLS1pXHJcbiAgICAgICAgLS1pbFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm9ncmFtQ2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgaW5zdHJ1bWVudDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLmluc3RydW1lbnQgPSBpbnN0cnVtZW50XHJcbiAgfVxyXG5cclxuICB2b2x1bWVDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCB2b2x1bWU6IG51bWJlcikge1xyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS52b2x1bWUgPSB2b2x1bWVcclxuICB9XHJcblxyXG4gIHBhbnBvdENoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHBhbnBvdDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLnBhbnBvdCA9IHBhbnBvdFxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgcGl0Y2hCZW5kOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdXHJcblxyXG4gICAgZm9yIChsZXQgbm90ZSBvZiBjaGFubmVsLmN1cnJlbnROb3RlT24pIHtcclxuICAgICAgbm90ZS51cGRhdGVQaXRjaEJlbmQocGl0Y2hCZW5kKVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5uZWwucGl0Y2hCZW5kID0gcGl0Y2hCZW5kXHJcbiAgfVxyXG5cclxuICBwaXRjaEJlbmRTZW5zaXRpdml0eShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHNlbnNpdGl2aXR5OiBudW1iZXIpIHtcclxuICAgIHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl0ucGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPSBzZW5zaXRpdml0eVxyXG4gIH1cclxuXHJcbiAgYWxsU291bmRPZmYoY2hhbm5lbE51bWJlcjogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBjdXJyZW50Tm90ZU9uID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS5jdXJyZW50Tm90ZU9uXHJcblxyXG4gICAgd2hpbGUgKGN1cnJlbnROb3RlT24ubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLm5vdGVPZmYoY2hhbm5lbE51bWJlciwgY3VycmVudE5vdGVPblswXS5rZXksIDApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXNldEFsbENvbnRyb2woY2hhbm5lbE51bWJlcjogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnBpdGNoQmVuZChjaGFubmVsTnVtYmVyLCAwKVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3ludGhlc2l6ZXIudHMiLCJpbXBvcnQgeyBOb3RlSW5mbyB9IGZyb20gXCIuL1NvdW5kRm9udFwiXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEluc3RydW1lbnRTdGF0ZSB7XHJcbiAgY2hhbm5lbDogbnVtYmVyXHJcbiAga2V5OiBudW1iZXJcclxuICB2b2x1bWU6IG51bWJlclxyXG4gIHBhbnBvdDogbnVtYmVyXHJcbiAgdmVsb2NpdHk6IG51bWJlclxyXG4gIHBpdGNoQmVuZDogbnVtYmVyXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHk6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeW50aGVzaXplck5vdGUge1xyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIGF1ZGlvIG5vZGVcclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBhdWRpb0J1ZmZlcjogQXVkaW9CdWZmZXJcclxuICBidWZmZXJTb3VyY2U6IEF1ZGlvQnVmZmVyU291cmNlTm9kZVxyXG4gIHBhbm5lcjogUGFubmVyTm9kZVxyXG4gIGdhaW5PdXRwdXQ6IEdhaW5Ob2RlXHJcbiAgY3R4OiBBdWRpb0NvbnRleHRcclxuICBkZXN0aW5hdGlvbjogQXVkaW9Ob2RlXHJcbiAgZmlsdGVyOiBCaXF1YWRGaWx0ZXJOb2RlXHJcbiAgbm90ZUluZm86IE5vdGVJbmZvXHJcbiAgaW5zdHJ1bWVudDogSW5zdHJ1bWVudFN0YXRlXHJcbiAgY2hhbm5lbDogbnVtYmVyXHJcbiAga2V5OiBudW1iZXJcclxuICB2ZWxvY2l0eTogbnVtYmVyXHJcbiAgcGxheWJhY2tSYXRlOiBudW1iZXJcclxuICB2b2x1bWU6IG51bWJlclxyXG4gIHBhbnBvdDogbnVtYmVyXHJcbiAgcGl0Y2hCZW5kOiBudW1iZXJcclxuICBwaXRjaEJlbmRTZW5zaXRpdml0eTogbnVtYmVyXHJcblxyXG4gIC8vIHN0YXRlXHJcbiAgc3RhcnRUaW1lOiBudW1iZXJcclxuICBjb21wdXRlZFBsYXliYWNrUmF0ZTogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKGN0eDogQXVkaW9Db250ZXh0LCBkZXN0aW5hdGlvbjogQXVkaW9Ob2RlLCBub3RlSW5mbzogTm90ZUluZm8sIGluc3RydW1lbnQ6IEluc3RydW1lbnRTdGF0ZSkge1xyXG4gICAgdGhpcy5jdHggPSBjdHhcclxuICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvblxyXG4gICAgdGhpcy5ub3RlSW5mbyA9IG5vdGVJbmZvXHJcbiAgICB0aGlzLnBsYXliYWNrUmF0ZSA9IG5vdGVJbmZvLnBsYXliYWNrUmF0ZShpbnN0cnVtZW50LmtleSlcclxuICAgIHRoaXMuaW5zdHJ1bWVudCA9IGluc3RydW1lbnRcclxuICAgIHRoaXMuY2hhbm5lbCA9IGluc3RydW1lbnQuY2hhbm5lbFxyXG4gICAgdGhpcy5rZXkgPSBpbnN0cnVtZW50LmtleVxyXG4gICAgdGhpcy52ZWxvY2l0eSA9IGluc3RydW1lbnQudmVsb2NpdHlcclxuICAgIHRoaXMudm9sdW1lID0gaW5zdHJ1bWVudC52b2x1bWVcclxuICAgIHRoaXMucGFucG90ID0gaW5zdHJ1bWVudC5wYW5wb3RcclxuICAgIHRoaXMucGl0Y2hCZW5kID0gaW5zdHJ1bWVudC5waXRjaEJlbmRcclxuICAgIHRoaXMucGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPSBpbnN0cnVtZW50LnBpdGNoQmVuZFNlbnNpdGl2aXR5XHJcbiAgICB0aGlzLnN0YXJ0VGltZSA9IGN0eC5jdXJyZW50VGltZVxyXG4gICAgdGhpcy5jb21wdXRlZFBsYXliYWNrUmF0ZSA9IHRoaXMucGxheWJhY2tSYXRlXHJcbiAgfVxyXG5cclxuICBub3RlT24oKSB7XHJcbiAgICBjb25zdCB7IGN0eCwgbm90ZUluZm8gfSA9IHRoaXNcclxuXHJcbiAgICBjb25zdCBzYW1wbGUgPSBub3RlSW5mby5zYW1wbGUuc3ViYXJyYXkoMCwgbm90ZUluZm8uc2FtcGxlLmxlbmd0aCArIG5vdGVJbmZvLmVuZClcclxuICAgIHRoaXMuYXVkaW9CdWZmZXIgPSBjdHguY3JlYXRlQnVmZmVyKDEsIHNhbXBsZS5sZW5ndGgsIG5vdGVJbmZvLnNhbXBsZVJhdGUpXHJcblxyXG4gICAgY29uc3QgY2hhbm5lbERhdGEgPSB0aGlzLmF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKDApXHJcbiAgICBjaGFubmVsRGF0YS5zZXQoc2FtcGxlKVxyXG5cclxuICAgIC8vIGJ1ZmZlciBzb3VyY2VcclxuICAgIGNvbnN0IGJ1ZmZlclNvdXJjZSA9IGN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxyXG4gICAgYnVmZmVyU291cmNlLmJ1ZmZlciA9IHRoaXMuYXVkaW9CdWZmZXJcclxuICAgIGJ1ZmZlclNvdXJjZS5sb29wID0gKHRoaXMuY2hhbm5lbCAhPT0gOSlcclxuICAgIGJ1ZmZlclNvdXJjZS5sb29wU3RhcnQgPSBub3RlSW5mby5sb29wU3RhcnQgLyBub3RlSW5mby5zYW1wbGVSYXRlXHJcbiAgICBidWZmZXJTb3VyY2UubG9vcEVuZCA9IG5vdGVJbmZvLmxvb3BFbmQgLyBub3RlSW5mby5zYW1wbGVSYXRlXHJcbiAgICBidWZmZXJTb3VyY2Uub25lbmRlZCA9ICgpID0+IHRoaXMuZGlzY29ubmVjdCgpXHJcbiAgICB0aGlzLmJ1ZmZlclNvdXJjZSA9IGJ1ZmZlclNvdXJjZVxyXG4gICAgdGhpcy51cGRhdGVQaXRjaEJlbmQodGhpcy5waXRjaEJlbmQpXHJcblxyXG4gICAgLy8gYXVkaW8gbm9kZVxyXG4gICAgY29uc3QgcGFubmVyID0gdGhpcy5wYW5uZXIgPSBjdHguY3JlYXRlUGFubmVyKClcclxuICAgIGNvbnN0IG91dHB1dCA9IHRoaXMuZ2Fpbk91dHB1dCA9IGN0eC5jcmVhdGVHYWluKClcclxuICAgIGNvbnN0IG91dHB1dEdhaW4gPSBvdXRwdXQuZ2FpblxyXG5cclxuICAgIC8vIGZpbHRlclxyXG4gICAgY29uc3QgZmlsdGVyID0gY3R4LmNyZWF0ZUJpcXVhZEZpbHRlcigpXHJcbiAgICBmaWx0ZXIudHlwZSA9IFwibG93cGFzc1wiXHJcbiAgICB0aGlzLmZpbHRlciA9IGZpbHRlclxyXG5cclxuICAgIC8vIHBhbnBvdFxyXG4gICAgcGFubmVyLnBhbm5pbmdNb2RlbCA9IFwiZXF1YWxwb3dlclwiXHJcbiAgICBwYW5uZXIuc2V0UG9zaXRpb24oXHJcbiAgICAgIE1hdGguc2luKHRoaXMucGFucG90ICogTWF0aC5QSSAvIDIpLFxyXG4gICAgICAwLFxyXG4gICAgICBNYXRoLmNvcyh0aGlzLnBhbnBvdCAqIE1hdGguUEkgLyAyKVxyXG4gICAgKVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBBdHRhY2ssIERlY2F5LCBTdXN0YWluXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdHguY3VycmVudFRpbWVcclxuICAgIGNvbnN0IHZvbEF0dGFja1RpbWUgPSBub3cgKyBub3RlSW5mby52b2xBdHRhY2tcclxuICAgIGNvbnN0IG1vZEF0dGFja1RpbWUgPSBub3cgKyBub3RlSW5mby5tb2RBdHRhY2tcclxuICAgIGNvbnN0IHZvbERlY2F5ID0gdm9sQXR0YWNrVGltZSArIG5vdGVJbmZvLnZvbERlY2F5XHJcbiAgICBjb25zdCBtb2REZWNheSA9IG1vZEF0dGFja1RpbWUgKyBub3RlSW5mby5tb2REZWNheVxyXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gbm90ZUluZm8uc3RhcnQgLyBub3RlSW5mby5zYW1wbGVSYXRlXHJcblxyXG4gICAgY29uc3QgYXR0YWNrVm9sdW1lID0gdGhpcy52b2x1bWUgKiAodGhpcy52ZWxvY2l0eSAvIDEyNylcclxuICAgIG91dHB1dEdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgbm93KVxyXG4gICAgb3V0cHV0R2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShhdHRhY2tWb2x1bWUsIHZvbEF0dGFja1RpbWUpXHJcbiAgICBvdXRwdXRHYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGF0dGFja1ZvbHVtZSAqICgxIC0gbm90ZUluZm8udm9sU3VzdGFpbiksIHZvbERlY2F5KVxyXG5cclxuICAgIGZpbHRlci5RLnNldFZhbHVlQXRUaW1lKG5vdGVJbmZvLmluaXRpYWxGaWx0ZXJRIC8gMTAsIG5vdylcclxuICAgIGNvbnN0IGJhc2VGcmVxID0gYW1vdW50VG9GcmVxKG5vdGVJbmZvLmluaXRpYWxGaWx0ZXJGYylcclxuICAgIGNvbnN0IHBlZWtGcmVxID0gYW1vdW50VG9GcmVxKG5vdGVJbmZvLmluaXRpYWxGaWx0ZXJGYyArIG5vdGVJbmZvLm1vZEVudlRvRmlsdGVyRmMpXHJcbiAgICBjb25zdCBzdXN0YWluRnJlcSA9IGJhc2VGcmVxICsgKHBlZWtGcmVxIC0gYmFzZUZyZXEpICogKDEgLSBub3RlSW5mby5tb2RTdXN0YWluKVxyXG4gICAgZmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShiYXNlRnJlcSwgbm93KVxyXG4gICAgZmlsdGVyLmZyZXF1ZW5jeS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShwZWVrRnJlcSwgbW9kQXR0YWNrVGltZSlcclxuICAgIGZpbHRlci5mcmVxdWVuY3kubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoc3VzdGFpbkZyZXEsIG1vZERlY2F5KVxyXG5cclxuICAgIGZ1bmN0aW9uIGFtb3VudFRvRnJlcSh2YWw6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiBNYXRoLnBvdygyLCAodmFsIC0gNjkwMCkgLyAxMjAwKSAqIDQ0MFxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbm5lY3RcclxuICAgIGJ1ZmZlclNvdXJjZS5jb25uZWN0KGZpbHRlcilcclxuICAgIGZpbHRlci5jb25uZWN0KHBhbm5lcilcclxuICAgIHBhbm5lci5jb25uZWN0KG91dHB1dClcclxuICAgIG91dHB1dC5jb25uZWN0KHRoaXMuZGVzdGluYXRpb24pXHJcblxyXG4gICAgLy8gZmlyZVxyXG4gICAgYnVmZmVyU291cmNlLnN0YXJ0KDAsIHN0YXJ0VGltZSlcclxuICB9XHJcblxyXG4gIG5vdGVPZmYoKSB7XHJcbiAgICBjb25zdCB7IG5vdGVJbmZvLCBidWZmZXJTb3VyY2UgfSA9IHRoaXNcclxuICAgIGNvbnN0IG91dHB1dCA9IHRoaXMuZ2Fpbk91dHB1dFxyXG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdHguY3VycmVudFRpbWVcclxuICAgIGNvbnN0IHZvbEVuZFRpbWUgPSBub3cgKyBub3RlSW5mby52b2xSZWxlYXNlXHJcbiAgICBjb25zdCBtb2RFbmRUaW1lID0gbm93ICsgbm90ZUluZm8ubW9kUmVsZWFzZVxyXG5cclxuICAgIGlmICghdGhpcy5hdWRpb0J1ZmZlcikge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICAvLyBpZ25vcmUgbm90ZSBvZmYgZm9yIHJoeXRobSB0cmFja1xyXG4gICAgaWYgKHRoaXMuY2hhbm5lbCA9PT0gOSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gUmVsZWFzZVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIG91dHB1dC5nYWluLmNhbmNlbFNjaGVkdWxlZFZhbHVlcygwKVxyXG4gICAgb3V0cHV0LmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgdm9sRW5kVGltZSlcclxuICAgIGJ1ZmZlclNvdXJjZS5wbGF5YmFja1JhdGUuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKDApXHJcbiAgICBidWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUsIG1vZEVuZFRpbWUpXHJcblxyXG4gICAgYnVmZmVyU291cmNlLmxvb3AgPSBmYWxzZVxyXG4gICAgYnVmZmVyU291cmNlLnN0b3Aodm9sRW5kVGltZSlcclxuICB9XHJcblxyXG4gIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICB0aGlzLmJ1ZmZlclNvdXJjZS5kaXNjb25uZWN0KDApXHJcbiAgICB0aGlzLnBhbm5lci5kaXNjb25uZWN0KDApXHJcbiAgICB0aGlzLmdhaW5PdXRwdXQuZGlzY29ubmVjdCgwKVxyXG4gIH1cclxuXHJcbiAgc2NoZWR1bGVQbGF5YmFja1JhdGUoKSB7XHJcbiAgICBjb25zdCB7IG5vdGVJbmZvIH0gPSB0aGlzXHJcbiAgICBjb25zdCBwbGF5YmFja1JhdGUgPSB0aGlzLmJ1ZmZlclNvdXJjZS5wbGF5YmFja1JhdGVcclxuICAgIGNvbnN0IGNvbXB1dGVkID0gdGhpcy5jb21wdXRlZFBsYXliYWNrUmF0ZVxyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0VGltZVxyXG4gICAgY29uc3QgbW9kQXR0YWNrID0gc3RhcnQgKyBub3RlSW5mby5tb2RBdHRhY2tcclxuICAgIGNvbnN0IG1vZERlY2F5ID0gbW9kQXR0YWNrICsgbm90ZUluZm8ubW9kRGVjYXlcclxuICAgIGNvbnN0IHBlZWtQaXRjaCA9IGNvbXB1dGVkICogTWF0aC5wb3coXHJcbiAgICAgIE1hdGgucG93KDIsIDEgLyAxMiksXHJcbiAgICAgIG5vdGVJbmZvLm1vZEVudlRvUGl0Y2ggKiBub3RlSW5mby5zY2FsZVR1bmluZ1xyXG4gICAgKVxyXG5cclxuICAgIHBsYXliYWNrUmF0ZS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoMClcclxuICAgIHBsYXliYWNrUmF0ZS5zZXRWYWx1ZUF0VGltZShjb21wdXRlZCwgc3RhcnQpXHJcbiAgICBwbGF5YmFja1JhdGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUocGVla1BpdGNoLCBtb2RBdHRhY2spXHJcbiAgICBwbGF5YmFja1JhdGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoY29tcHV0ZWQgKyAocGVla1BpdGNoIC0gY29tcHV0ZWQpICogKDEgLSBub3RlSW5mby5tb2RTdXN0YWluKSwgbW9kRGVjYXkpXHJcbiAgfVxyXG5cclxuICB1cGRhdGVQaXRjaEJlbmQocGl0Y2hCZW5kOiBudW1iZXIpIHtcclxuICAgIHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUgPSB0aGlzLnBsYXliYWNrUmF0ZSAqIE1hdGgucG93KFxyXG4gICAgICBNYXRoLnBvdygyLCAxIC8gMTIpLFxyXG4gICAgICAoXHJcbiAgICAgICAgdGhpcy5waXRjaEJlbmRTZW5zaXRpdml0eSAqIChcclxuICAgICAgICAgIHBpdGNoQmVuZCAvIChwaXRjaEJlbmQgPCAwID8gODE5MiA6IDgxOTEpXHJcbiAgICAgICAgKVxyXG4gICAgICApICogdGhpcy5ub3RlSW5mby5zY2FsZVR1bmluZ1xyXG4gICAgKVxyXG4gICAgdGhpcy5zY2hlZHVsZVBsYXliYWNrUmF0ZSgpXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TeW50aGVzaXplck5vdGUudHMiLCJpbXBvcnQgeyBQYXJzZVJlc3VsdCB9IGZyb20gXCIuL1BhcnNlclwiXHJcbmltcG9ydCB7IFJhbmdlVmFsdWUsIEdlbmVyYXRvckxpc3QgfSBmcm9tIFwiLi9TdHJ1Y3RzXCJcclxuXHJcbi8qKlxyXG4gKiBQYXJzZXIg44Gn6Kqt44G/6L6844KT44Gg44K144Km44Oz44OJ44OV44Kp44Oz44OI44Gu44OH44O844K/44KSXHJcbiAqIFN5bnRoZXNpemVyIOOBi+OCieWIqeeUqOOBl+OChOOBmeOBhOW9ouOBq+OBmeOCi+OCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU291bmRGb250IHtcclxuICBwcml2YXRlIHBhcnNlZDogUGFyc2VSZXN1bHRcclxuXHJcbiAgY29uc3RydWN0b3IocGFyc2VkOiBQYXJzZVJlc3VsdCkge1xyXG4gICAgdGhpcy5wYXJzZWQgPSBwYXJzZWRcclxuICB9XHJcblxyXG4gIGdldFByZXNldFpvbmUocHJlc2V0SGVhZGVySW5kZXg6IG51bWJlcikge1xyXG4gICAgbGV0IHByZXNldEdlbmVyYXRvcnM6IEdlbmVyYXRvckxpc3RbXVxyXG4gICAgY29uc3QgcHJlc2V0SGVhZGVyID0gdGhpcy5wYXJzZWQucHJlc2V0SGVhZGVyc1twcmVzZXRIZWFkZXJJbmRleF1cclxuICAgIGNvbnN0IHByZXNldEJhZyA9IHRoaXMucGFyc2VkLnByZXNldFpvbmVbcHJlc2V0SGVhZGVyLnByZXNldEJhZ0luZGV4XVxyXG5cclxuICAgIGNvbnN0IG5leHRQcmVzZXRIZWFkZXJJbmRleCA9IHByZXNldEhlYWRlckluZGV4ICsgMVxyXG4gICAgaWYgKG5leHRQcmVzZXRIZWFkZXJJbmRleCA8IHRoaXMucGFyc2VkLnByZXNldEhlYWRlcnMubGVuZ3RoKSB7XHJcbiAgICAgIC8vIOasoeOBriBwcmVzZXQg44G+44Gn44Gu44GZ44G544Gm44GuIGdlbmVyYXRvciDjgpLlj5blvpfjgZnjgotcclxuICAgICAgY29uc3QgbmV4dFByZXNldEhlYWRlciA9IHRoaXMucGFyc2VkLnByZXNldEhlYWRlcnNbbmV4dFByZXNldEhlYWRlckluZGV4XVxyXG4gICAgICBjb25zdCBuZXh0UHJlc2V0QmFnID0gdGhpcy5wYXJzZWQucHJlc2V0Wm9uZVtuZXh0UHJlc2V0SGVhZGVyLnByZXNldEJhZ0luZGV4XVxyXG4gICAgICBwcmVzZXRHZW5lcmF0b3JzID0gdGhpcy5wYXJzZWQucHJlc2V0R2VuZXJhdG9ycy5zbGljZShwcmVzZXRCYWcucHJlc2V0R2VuZXJhdG9ySW5kZXgsIG5leHRQcmVzZXRCYWcucHJlc2V0R2VuZXJhdG9ySW5kZXgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyDmnIDlvozjga4gcHJlc2V0IOOBoOOBo+OBn+WgtOWQiOOBr+acgOW+jOOBvuOBp+WPluW+l+OBmeOCi1xyXG4gICAgICBwcmVzZXRHZW5lcmF0b3JzID0gdGhpcy5wYXJzZWQucHJlc2V0R2VuZXJhdG9ycy5zbGljZShwcmVzZXRCYWcucHJlc2V0R2VuZXJhdG9ySW5kZXgsIHRoaXMucGFyc2VkLnByZXNldEdlbmVyYXRvcnMubGVuZ3RoKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwcmVzZXRHZW5lcmF0b3JzXHJcbiAgfVxyXG5cclxuICBnZXRJbnN0cnVtZW50Wm9uZShpbnN0cnVtZW50Wm9uZUluZGV4OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGluc3RydW1lbnRCYWcgPSB0aGlzLnBhcnNlZC5pbnN0cnVtZW50Wm9uZVtpbnN0cnVtZW50Wm9uZUluZGV4XVxyXG4gICAgY29uc3QgbmV4dEluc3RydW1lbnRCYWcgPSB0aGlzLnBhcnNlZC5pbnN0cnVtZW50Wm9uZVtpbnN0cnVtZW50Wm9uZUluZGV4ICsgMV1cclxuICAgIGNvbnN0IGdlbmVyYXRvckluZGV4ID0gaW5zdHJ1bWVudEJhZy5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXhcclxuICAgIGNvbnN0IG5leHRHZW5lcmF0b3JJbmRleCA9IG5leHRJbnN0cnVtZW50QmFnID8gbmV4dEluc3RydW1lbnRCYWcuaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4IDogdGhpcy5wYXJzZWQuaW5zdHJ1bWVudEdlbmVyYXRvcnMubGVuZ3RoXHJcbiAgICBjb25zdCBnZW5lcmF0b3JzID0gdGhpcy5wYXJzZWQuaW5zdHJ1bWVudEdlbmVyYXRvcnMuc2xpY2UoZ2VuZXJhdG9ySW5kZXgsIG5leHRHZW5lcmF0b3JJbmRleClcclxuICAgIHJldHVybiBjcmVhdGVJbnN0cnVtZW50Wm9uZShnZW5lcmF0b3JzKVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5zdHJ1bWVudFpvbmVJbmRleGVzKGluc3RydW1lbnRJRDogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgY29uc3QgaW5zdHJ1bWVudCA9IHRoaXMucGFyc2VkLmluc3RydW1lbnRzW2luc3RydW1lbnRJRF1cclxuICAgIGNvbnN0IG5leHRJbnN0cnVtZW50ID0gdGhpcy5wYXJzZWQuaW5zdHJ1bWVudHNbaW5zdHJ1bWVudElEICsgMV1cclxuICAgIHJldHVybiBhcnJheVJhbmdlKGluc3RydW1lbnQuaW5zdHJ1bWVudEJhZ0luZGV4LCBuZXh0SW5zdHJ1bWVudCA/IG5leHRJbnN0cnVtZW50Lmluc3RydW1lbnRCYWdJbmRleCA6IHRoaXMucGFyc2VkLmluc3RydW1lbnRab25lLmxlbmd0aClcclxuICB9XHJcblxyXG4gIGdldEluc3RydW1lbnRLZXkoYmFua051bWJlciwgaW5zdHJ1bWVudE51bWJlciwga2V5LCB2ZWxvY2l0eSA9IDEwMCk6IE5vdGVJbmZvfG51bGwge1xyXG4gICAgY29uc3QgcHJlc2V0SGVhZGVySW5kZXggPSB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzLmZpbmRJbmRleChwID0+IHAucHJlc2V0ID09PSBpbnN0cnVtZW50TnVtYmVyICYmIHAuYmFuayA9PT0gYmFua051bWJlcilcclxuICAgIFxyXG4gICAgaWYgKHByZXNldEhlYWRlckluZGV4IDwgMCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXCJwcmVzZXQgbm90IGZvdW5kOiBiYW5rPSVzIGluc3RydW1lbnQ9JXNcIiwgYmFua051bWJlciwgaW5zdHJ1bWVudE51bWJlcilcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwcmVzZXRHZW5lcmF0b3JzID0gdGhpcy5nZXRQcmVzZXRab25lKHByZXNldEhlYWRlckluZGV4KVxyXG5cclxuICAgIC8vIExhc3QgUHJlc2V0IEdlbmVyYXRvciBtdXN0IGJlIGluc3RydW1lbnRcclxuICAgIGNvbnN0IGxhc3RQcmVzZXRHZW5lcnRvciA9IHByZXNldEdlbmVyYXRvcnNbcHJlc2V0R2VuZXJhdG9ycy5sZW5ndGggLSAxXVxyXG4gICAgaWYgKGxhc3RQcmVzZXRHZW5lcnRvci50eXBlICE9PSBcImluc3RydW1lbnRcIiB8fCBOdW1iZXIobGFzdFByZXNldEdlbmVydG9yLnZhbHVlKSA9PT0gTmFOKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiBpbnZhbGlkIHByZXNldCBnZW5lcmF0b3I6IGV4cGVjdCBpbnN0cnVtZW50XCIpXHJcbiAgICB9XHJcbiAgICBjb25zdCBpbnN0cnVtZW50SUQgPSBsYXN0UHJlc2V0R2VuZXJ0b3IudmFsdWUgYXMgbnVtYmVyXHJcbiAgICBjb25zdCBpbnN0cnVtZW50Wm9uZXMgPSB0aGlzLmdldEluc3RydW1lbnRab25lSW5kZXhlcyhpbnN0cnVtZW50SUQpLm1hcChpID0+IHRoaXMuZ2V0SW5zdHJ1bWVudFpvbmUoaSkpXHJcblxyXG4gICAgLy8g5pyA5Yid44Gu44K+44O844Oz44GMc2FtcGxlSUQg44KS5oyB44Gf44Gq44GR44KM44GwIGdsb2JhbCBpbnN0cnVtZW50IHpvbmVcclxuICAgIGxldCBnbG9iYWxJbnN0cnVtZW50Wm9uZTogYW55fHVuZGVmaW5lZFxyXG4gICAgY29uc3QgZmlyc3RJbnN0cnVtZW50Wm9uZSA9IGluc3RydW1lbnRab25lc1swXVxyXG4gICAgaWYgKGZpcnN0SW5zdHJ1bWVudFpvbmUuc2FtcGxlSUQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBnbG9iYWxJbnN0cnVtZW50Wm9uZSA9IGluc3RydW1lbnRab25lc1swXVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGtleVJhbmdlIOOBqCB2ZWxSYW5nZSDjgYzjg57jg4Pjg4HjgZfjgabjgYTjgosgR2VuZXJhdG9yIOOCkuaOouOBmVxyXG4gICAgY29uc3QgaW5zdHJ1bWVudFpvbmUgPSBpbnN0cnVtZW50Wm9uZXMuZmluZChpID0+IHtcclxuICAgICAgaWYgKGkgPT09IGdsb2JhbEluc3RydW1lbnRab25lKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlIC8vIGdsb2JhbCB6b25lIOOCkumZpOWkllxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgaXNJbktleVJhbmdlID0gZmFsc2VcclxuICAgICAgaWYgKGkua2V5UmFuZ2UpIHtcclxuICAgICAgICBpc0luS2V5UmFuZ2UgPSBrZXkgPj0gaS5rZXlSYW5nZS5sbyAmJiBrZXkgPD0gaS5rZXlSYW5nZS5oaVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgaXNJblZlbFJhbmdlID0gdHJ1ZVxyXG4gICAgICBpZiAoaS52ZWxSYW5nZSkge1xyXG4gICAgICAgIGlzSW5WZWxSYW5nZSA9IHZlbG9jaXR5ID49IGkudmVsUmFuZ2UubG8gJiYgdmVsb2NpdHkgPD0gaS52ZWxSYW5nZS5oaVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaXNJbktleVJhbmdlICYmIGlzSW5WZWxSYW5nZVxyXG4gICAgfSlcclxuICAgIFxyXG4gICAgaWYgKCFpbnN0cnVtZW50Wm9uZSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXCJpbnN0cnVtZW50IG5vdCBmb3VuZDogYmFuaz0lcyBpbnN0cnVtZW50PSVzXCIsIGJhbmtOdW1iZXIsIGluc3RydW1lbnROdW1iZXIpXHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGluc3RydW1lbnRab25lLnNhbXBsZUlEID09PSB1bmRlZmluZWQpIHsgXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiBzYW1wbGVJRCBub3QgZm91bmRcIilcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgZ2VuID0gey4uLmRlZmF1bHRJbnN0cnVtZW50Wm9uZSwgLi4ucmVtb3ZlVW5kZWZpbmVkKGdsb2JhbEluc3RydW1lbnRab25lIHx8IHt9KSwgLi4ucmVtb3ZlVW5kZWZpbmVkKGluc3RydW1lbnRab25lKX1cclxuXHJcbiAgICBjb25zdCBzYW1wbGUgPSB0aGlzLnBhcnNlZC5zYW1wbGVzW2dlbi5zYW1wbGVJRCFdXHJcbiAgICBjb25zdCBzYW1wbGVIZWFkZXIgPSB0aGlzLnBhcnNlZC5zYW1wbGVIZWFkZXJzW2dlbi5zYW1wbGVJRCFdXHJcbiAgICBjb25zdCB0dW5lID0gZ2VuLmNvYXJzZVR1bmUgKyBnZW4uZmluZVR1bmUgLyAxMDBcclxuICAgIGNvbnN0IGJhc2VQaXRjaCA9IHR1bmUgKyAoc2FtcGxlSGVhZGVyLnBpdGNoQ29ycmVjdGlvbiAvIDEwMCkgLSAoZ2VuLm92ZXJyaWRpbmdSb290S2V5IHx8IHNhbXBsZUhlYWRlci5vcmlnaW5hbFBpdGNoKVxyXG4gICAgY29uc3Qgc2NhbGVUdW5pbmcgPSBnZW4uc2NhbGVUdW5pbmcgLyAxMDBcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzYW1wbGUsXHJcbiAgICAgIHNhbXBsZVJhdGU6IHNhbXBsZUhlYWRlci5zYW1wbGVSYXRlLFxyXG4gICAgICBzYW1wbGVOYW1lOiBzYW1wbGVIZWFkZXIuc2FtcGxlTmFtZSxcclxuICAgICAgc2NhbGVUdW5pbmcsXHJcbiAgICAgIHBsYXliYWNrUmF0ZTogKGtleSkgPT4gTWF0aC5wb3coTWF0aC5wb3coMiwgMSAvIDEyKSwgKGtleSArIGJhc2VQaXRjaCkgKiBzY2FsZVR1bmluZyksXHJcbiAgICAgIGtleVJhbmdlOiBnZW4ua2V5UmFuZ2UsXHJcbiAgICAgIHZlbFJhbmdlOiBnZW4udmVsUmFuZ2UsXHJcbiAgICAgIHZvbEF0dGFjazogY29udmVydFRpbWUoZ2VuLnZvbEF0dGFjayksXHJcbiAgICAgIHZvbERlY2F5OiBjb252ZXJ0VGltZShnZW4udm9sRGVjYXkpLFxyXG4gICAgICB2b2xTdXN0YWluOiBnZW4udm9sU3VzdGFpbiAvIDEwMDAsXHJcbiAgICAgIHZvbFJlbGVhc2U6IGNvbnZlcnRUaW1lKGdlbi52b2xSZWxlYXNlKSxcclxuICAgICAgbW9kQXR0YWNrOiBjb252ZXJ0VGltZShnZW4ubW9kQXR0YWNrKSxcclxuICAgICAgbW9kRGVjYXk6IGNvbnZlcnRUaW1lKGdlbi5tb2REZWNheSksXHJcbiAgICAgIG1vZFN1c3RhaW46IGdlbi5tb2RTdXN0YWluIC8gMTAwMCxcclxuICAgICAgbW9kUmVsZWFzZTogY29udmVydFRpbWUoZ2VuLm1vZFJlbGVhc2UpLFxyXG4gICAgICBtb2RFbnZUb1BpdGNoOiBnZW4ubW9kRW52VG9QaXRjaCAvIDEwMCwgLy8gY2VudFxyXG4gICAgICBtb2RFbnZUb0ZpbHRlckZjOiBnZW4ubW9kRW52VG9GaWx0ZXJGYywgLy8gc2VtaXRvbmUgKDEwMCBjZW50KVxyXG4gICAgICBpbml0aWFsRmlsdGVyUTogZ2VuLmluaXRpYWxGaWx0ZXJRLFxyXG4gICAgICBpbml0aWFsRmlsdGVyRmM6IGdlbi5pbml0aWFsRmlsdGVyRmMsXHJcbiAgICAgIGZyZXFWaWJMRk86IGdlbi5mcmVxVmliTEZPID8gY29udmVydFRpbWUoZ2VuLmZyZXFWaWJMRk8pICogOC4xNzYgOiB1bmRlZmluZWQsXHJcbiAgICAgIHN0YXJ0OiBnZW4uc3RhcnRBZGRyc0NvYXJzZU9mZnNldCAqIDMyNzY4ICsgZ2VuLnN0YXJ0QWRkcnNPZmZzZXQsXHJcbiAgICAgIGVuZDogZ2VuLmVuZEFkZHJzQ29hcnNlT2Zmc2V0ICogMzI3NjggKyBnZW4uZW5kQWRkcnNPZmZzZXQsXHJcbiAgICAgIGxvb3BTdGFydDogKFxyXG4gICAgICAgIHNhbXBsZUhlYWRlci5sb29wU3RhcnQgK1xyXG4gICAgICAgIGdlbi5zdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldCAqIDMyNzY4ICtcclxuICAgICAgICBnZW4uc3RhcnRsb29wQWRkcnNPZmZzZXRcclxuICAgICAgKSxcclxuICAgICAgbG9vcEVuZDogKFxyXG4gICAgICAgIHNhbXBsZUhlYWRlci5sb29wRW5kICtcclxuICAgICAgICBnZW4uZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0ICogMzI3NjggK1xyXG4gICAgICAgIGdlbi5lbmRsb29wQWRkcnNPZmZzZXRcclxuICAgICAgKSxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHByZXNldE5hbWVzW2JhbmtOdW1iZXJdW3ByZXNldE51bWJlcl0gPSBwcmVzZXROYW1lXHJcbiAgZ2V0UHJlc2V0TmFtZXMoKSB7XHJcbiAgICBjb25zdCBiYW5rOiB7W2luZGV4OiBudW1iZXJdOiB7W2luZGV4OiBudW1iZXJdOiBzdHJpbmd9fSA9IHt9XHJcbiAgICB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzLmZvckVhY2gocHJlc2V0ID0+IHtcclxuICAgICAgaWYgKCFiYW5rW3ByZXNldC5iYW5rXSkge1xyXG4gICAgICAgIGJhbmtbcHJlc2V0LmJhbmtdID0ge31cclxuICAgICAgfVxyXG4gICAgICBiYW5rW3ByZXNldC5iYW5rXVtwcmVzZXQucHJlc2V0XSA9IHByZXNldC5wcmVzZXROYW1lXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGJhbmtcclxuICB9XHJcbn1cclxuXHJcbi8vIHZhbHVlID0gMTIwMGxvZzIoc2VjKSDjgafooajjgZXjgozjgovmmYLplpPjgpLnp5LljZjkvY3jgavlpInmj5vjgZnjgotcclxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUaW1lKHZhbHVlKSB7XHJcbiAgcmV0dXJuIE1hdGgucG93KDIsIHZhbHVlIC8gMTIwMClcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlVW5kZWZpbmVkKG9iaikge1xyXG4gIGNvbnN0IHJlc3VsdCA9IHt9XHJcbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICBpZiAob2JqW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldXHJcbiAgICB9XHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFycmF5UmFuZ2Uoc3RhcnQsIGVuZCkge1xyXG4gIHJldHVybiBBcnJheS5mcm9tKHtsZW5ndGg6IGVuZCAtIHN0YXJ0fSwgKF8sIGspID0+IGsgKyBzdGFydCk7XHJcbn1cclxuXHJcbi8vIOOBsuOBqOOBpOOBriBpbnN0cnVtZW50IOOBq+WvvuW/nOOBmeOCiyBHZW5lcmF0b3Ig44Gu6YWN5YiX44GL44KJ5L2/44GE44KE44GZ44GP44GX44Gf44Kq44OW44K444Kn44Kv44OI44KS6L+U44GZXHJcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRab25lKGluc3RydW1lbnRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W10pIHtcclxuICBmdW5jdGlvbiBnZXRWYWx1ZSh0eXBlOiBzdHJpbmcpOiBudW1iZXJ8dW5kZWZpbmVkIHtcclxuICAgIGNvbnN0IGdlbmVyYXRvciA9IGluc3RydW1lbnRHZW5lcmF0b3JzLmZpbmQoZyA9PiBnLnR5cGUgPT09IHR5cGUpXHJcbiAgICBpZiAoIWdlbmVyYXRvcikge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICB9XHJcbiAgICBpZiAoTnVtYmVyKGdlbmVyYXRvci52YWx1ZSkgPT09IE5hTikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzb21ldGhpbmcgd3JvbmdcIilcclxuICAgIH1cclxuICAgIHJldHVybiBnZW5lcmF0b3IudmFsdWUgYXMgbnVtYmVyXHJcbiAgfVxyXG4gIFxyXG4gIC8vIEZpcnN0IEluc3RydW1lbnQgR2VuZXJhdG9yIG11c3QgYmUga2V5UmFuZ2VcclxuICBjb25zdCBmaXJzdEluc3RydW1lbnRHZW5lcmF0b3IgPSBpbnN0cnVtZW50R2VuZXJhdG9yc1swXVxyXG4gIGxldCBrZXlSYW5nZTogUmFuZ2VWYWx1ZXx1bmRlZmluZWRcclxuICBpZiAoZmlyc3RJbnN0cnVtZW50R2VuZXJhdG9yICYmIGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvci50eXBlID09PSBcImtleVJhbmdlXCIpIHtcclxuICAgIGlmICghKGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSBpbnN0YW5jZW9mIFJhbmdlVmFsdWUpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiBrZXlSYW5nZSBpcyBub3QgcmFuZ2VkIHZhbHVlXCIpXHJcbiAgICB9XHJcbiAgICBrZXlSYW5nZSA9IGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSBhcyBSYW5nZVZhbHVlXHJcbiAgfVxyXG5cclxuICAvLyBTZWNvbmQgSW5zdHJ1bWVudCBHZW5lcmF0b3IgY291bGQgYmUgdmVsUmFuZ2VcclxuICBjb25zdCBzZWNvbmRJbnN0cnVtZW50R2VuZXJhdG9yID0gaW5zdHJ1bWVudEdlbmVyYXRvcnNbMV1cclxuICBsZXQgdmVsUmFuZ2U6IFJhbmdlVmFsdWV8dW5kZWZpbmVkXHJcbiAgaWYgKHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IgJiYgc2Vjb25kSW5zdHJ1bWVudEdlbmVyYXRvci50eXBlID09PSBcInZlbFJhbmdlXCIpIHtcclxuICAgIGlmICghKHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUgaW5zdGFuY2VvZiBSYW5nZVZhbHVlKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNvdW5kRm9udDogdmVsUmFuZ2UgaXMgbm90IHJhbmdlZCB2YWx1ZVwiKVxyXG4gICAgfVxyXG4gICAgdmVsUmFuZ2UgPSBzZWNvbmRJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGFzIFJhbmdlVmFsdWVcclxuICB9XHJcblxyXG4gIC8vIExhc3QgSW5zdHJ1bWVudCBHZW5lcmF0b3IgbXVzdCBiZSBzYW1wbGVJRFxyXG4gIGNvbnN0IGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yID0gaW5zdHJ1bWVudEdlbmVyYXRvcnNbaW5zdHJ1bWVudEdlbmVyYXRvcnMubGVuZ3RoIC0gMV1cclxuICBsZXQgc2FtcGxlSUQ6IG51bWJlcnx1bmRlZmluZWRcclxuICBpZiAobGFzdEluc3RydW1lbnRHZW5lcmF0b3IgJiYgbGFzdEluc3RydW1lbnRHZW5lcmF0b3IudHlwZSA9PT0gXCJzYW1wbGVJRFwiKSB7XHJcbiAgICBpZiAoTnVtYmVyKGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlKSA9PT0gTmFOKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiBzYW1wbGVJRCBpcyBub3QgbnVtYmVyXCIpXHJcbiAgICB9XHJcbiAgICBzYW1wbGVJRCA9IGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGFzIG51bWJlclxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGtleVJhbmdlLCAvLyDjgYLjgovjga/jgZrjgaDjgYwgZ2xvYmFsIHpvbmUg44Gr44Gv54Sh44GE44GL44KC44GX44KM44Gq44GEXHJcbiAgICB2ZWxSYW5nZSwgLy8gb3B0aW9uYWxcclxuICAgIHNhbXBsZUlELCAvLyBnbG9iYWwgem9uZSDjga7loLTlkIjjgaDjgZHjgarjgYRcclxuICAgIHZvbEF0dGFjazogZ2V0VmFsdWUoXCJhdHRhY2tWb2xFbnZcIiksXHJcbiAgICB2b2xEZWNheTogZ2V0VmFsdWUoXCJkZWNheVZvbEVudlwiKSxcclxuICAgIHZvbFN1c3RhaW46IGdldFZhbHVlKFwic3VzdGFpblZvbEVudlwiKSxcclxuICAgIHZvbFJlbGVhc2U6IGdldFZhbHVlKFwicmVsZWFzZVZvbEVudlwiKSxcclxuICAgIG1vZEF0dGFjazogZ2V0VmFsdWUoXCJhdHRhY2tNb2RFbnZcIiksXHJcbiAgICBtb2REZWNheTogZ2V0VmFsdWUoXCJkZWNheU1vZEVudlwiKSxcclxuICAgIG1vZFN1c3RhaW46IGdldFZhbHVlKFwic3VzdGFpbk1vZEVudlwiKSxcclxuICAgIG1vZFJlbGVhc2U6IGdldFZhbHVlKFwicmVsZWFzZU1vZEVudlwiKSxcclxuICAgIG1vZEVudlRvUGl0Y2g6IGdldFZhbHVlKFwibW9kRW52VG9QaXRjaFwiKSxcclxuICAgIG1vZEVudlRvRmlsdGVyRmM6IGdldFZhbHVlKFwibW9kRW52VG9GaWx0ZXJGY1wiKSxcclxuICAgIGNvYXJzZVR1bmU6IGdldFZhbHVlKFwiY29hcnNlVHVuZVwiKSxcclxuICAgIGZpbmVUdW5lOiBnZXRWYWx1ZShcImZpbmVUdW5lXCIpLFxyXG4gICAgc2NhbGVUdW5pbmc6IGdldFZhbHVlKFwic2NhbGVUdW5pbmdcIiksXHJcbiAgICBmcmVxVmliTEZPOiBnZXRWYWx1ZShcImZyZXFWaWJMRk9cIiksXHJcbiAgICBzdGFydEFkZHJzT2Zmc2V0OiBnZXRWYWx1ZShcInN0YXJ0QWRkcnNPZmZzZXRcIiksXHJcbiAgICBzdGFydEFkZHJzQ29hcnNlT2Zmc2V0OiBnZXRWYWx1ZShcInN0YXJ0QWRkcnNDb2Fyc2VPZmZzZXRcIiksXHJcbiAgICBlbmRBZGRyc09mZnNldDogZ2V0VmFsdWUoXCJlbmRBZGRyc09mZnNldFwiKSxcclxuICAgIGVuZEFkZHJzQ29hcnNlT2Zmc2V0OiBnZXRWYWx1ZShcImVuZEFkZHJzQ29hcnNlT2Zmc2V0XCIpLFxyXG4gICAgc3RhcnRsb29wQWRkcnNPZmZzZXQ6IGdldFZhbHVlKFwic3RhcnRsb29wQWRkcnNPZmZzZXRcIiksXHJcbiAgICBzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldDogZ2V0VmFsdWUoXCJzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldFwiKSxcclxuICAgIGVuZGxvb3BBZGRyc09mZnNldDogZ2V0VmFsdWUoXCJlbmRsb29wQWRkcnNPZmZzZXRcIiksXHJcbiAgICBlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQ6IGdldFZhbHVlKFwiZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0XCIpLFxyXG4gICAgb3ZlcnJpZGluZ1Jvb3RLZXk6IGdldFZhbHVlKFwib3ZlcnJpZGluZ1Jvb3RLZXlcIiksXHJcbiAgICBpbml0aWFsRmlsdGVyUTogZ2V0VmFsdWUoXCJpbml0aWFsRmlsdGVyUVwiKSxcclxuICAgIGluaXRpYWxGaWx0ZXJGYzogZ2V0VmFsdWUoXCJpbml0aWFsRmlsdGVyRmNcIiksXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBkZWZhdWx0SW5zdHJ1bWVudFpvbmUgPSB7XHJcbiAga2V5UmFuZ2U6IG5ldyBSYW5nZVZhbHVlKDAsIDEyNyksXHJcbiAgdmVsUmFuZ2U6IG5ldyBSYW5nZVZhbHVlKDAsIDEyNyksXHJcbiAgc2FtcGxlSUQ6IHVuZGVmaW5lZCxcclxuICB2b2xBdHRhY2s6IC0xMjAwMCxcclxuICB2b2xEZWNheTogLTEyMDAwLFxyXG4gIHZvbFN1c3RhaW46IDAsXHJcbiAgdm9sUmVsZWFzZTogLTEyMDAwLFxyXG4gIG1vZEF0dGFjazogLTEyMDAwLFxyXG4gIG1vZERlY2F5OiAtMTIwMDAsXHJcbiAgbW9kU3VzdGFpbjogMCxcclxuICBtb2RSZWxlYXNlOiAwLFxyXG4gIG1vZEVudlRvUGl0Y2g6IDAsXHJcbiAgbW9kRW52VG9GaWx0ZXJGYzogMCxcclxuICBjb2Fyc2VUdW5lOiAwLFxyXG4gIGZpbmVUdW5lOiAwLFxyXG4gIHNjYWxlVHVuaW5nOiAxMDAsXHJcbiAgZnJlcVZpYkxGTzogMCxcclxuICBzdGFydEFkZHJzT2Zmc2V0OiAwLFxyXG4gIHN0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQ6IDAsXHJcbiAgZW5kQWRkcnNPZmZzZXQ6IDAsXHJcbiAgZW5kQWRkcnNDb2Fyc2VPZmZzZXQ6IDAsXHJcbiAgc3RhcnRsb29wQWRkcnNPZmZzZXQ6IDAsXHJcbiAgc3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXQ6IDAsXHJcbiAgZW5kbG9vcEFkZHJzT2Zmc2V0OiAwLFxyXG4gIGVuZGxvb3BBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBvdmVycmlkaW5nUm9vdEtleTogdW5kZWZpbmVkLFxyXG4gIGluaXRpYWxGaWx0ZXJROiAxLFxyXG4gIGluaXRpYWxGaWx0ZXJGYzogMTM1MDAsXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTm90ZUluZm8ge1xyXG4gIHNhbXBsZTogSW50MTZBcnJheVxyXG4gIHNhbXBsZVJhdGU6IG51bWJlclxyXG4gIHNhbXBsZU5hbWU6IHN0cmluZ1xyXG4gIHN0YXJ0OiBudW1iZXJcclxuICBlbmQ6IG51bWJlclxyXG4gIHNjYWxlVHVuaW5nOiBudW1iZXJcclxuICBwbGF5YmFja1JhdGU6IEZ1bmN0aW9uXHJcbiAgbG9vcFN0YXJ0OiBudW1iZXJcclxuICBsb29wRW5kOiBudW1iZXJcclxuICB2b2xBdHRhY2s6IG51bWJlclxyXG4gIHZvbERlY2F5OiBudW1iZXJcclxuICB2b2xTdXN0YWluOiBudW1iZXJcclxuICB2b2xSZWxlYXNlOiBudW1iZXJcclxuICBtb2RBdHRhY2s6IG51bWJlclxyXG4gIG1vZERlY2F5OiBudW1iZXJcclxuICBtb2RTdXN0YWluOiBudW1iZXJcclxuICBtb2RSZWxlYXNlOiBudW1iZXJcclxuICBtb2RFbnZUb1BpdGNoOiBudW1iZXJcclxuICBtb2RFbnZUb0ZpbHRlckZjOiBudW1iZXJcclxuICBpbml0aWFsRmlsdGVyRmM6IG51bWJlclxyXG4gIGluaXRpYWxGaWx0ZXJROiBudW1iZXJcclxuICBmcmVxVmliTEZPOiBudW1iZXJ8dW5kZWZpbmVkXHJcbiAga2V5UmFuZ2U6IFJhbmdlVmFsdWVcclxuICB2ZWxSYW5nZTogUmFuZ2VWYWx1ZXx1bmRlZmluZWRcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU291bmRGb250LnRzIiwiaW1wb3J0IFN5bnRoZXNpemVyIGZyb20gXCIuL1N5bnRoZXNpemVyXCJcclxuaW1wb3J0IFByb2dyYW1OYW1lcyBmcm9tIFwiLi9Qcm9ncmFtTmFtZXNcIlxyXG5pbXBvcnQgeyBMaXN0ZW5lciB9IGZyb20gXCIuL01pZGlNZXNzYWdlSGFuZGxlclwiXHJcblxyXG5mdW5jdGlvbiByZW5kZXIoc3RyOiBzdHJpbmcpOiBFbGVtZW50IHtcclxuICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gIHdyYXBwZXIuaW5uZXJIVE1MID0gc3RyLnJlcGxhY2UoL15cXHMrLywgXCJcIilcclxuICByZXR1cm4gd3JhcHBlci5maXJzdEVsZW1lbnRDaGlsZCFcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyS2V5cygpOiBzdHJpbmcge1xyXG4gIGxldCBodG1sID0gXCJcIlxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTI4OyBpKyspIHtcclxuICAgIGNvbnN0IG4gPSBpICUgMTJcclxuICAgIGNvbnN0IGlzQmxhY2sgPSBbMSwgMywgNiwgOCwgMTBdLmluY2x1ZGVzKG4pXHJcbiAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwia2V5ICR7aXNCbGFjayA/IFwiYmxhY2tcIiA6IFwid2hpdGVcIn1cIj48L2Rpdj5gXHJcbiAgfVxyXG4gIHJldHVybiBodG1sXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlclByb2dyYW1PcHRpb25zKHByb2dyYW1OYW1lczogeyBbaW5kZXg6IG51bWJlcl06IHN0cmluZ1tdIH0sIGJhbms6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgbGV0IGh0bWwgPSBcIlwiXHJcbiAgY29uc3QgbmFtZXMgPSBwcm9ncmFtTmFtZXNbYmFua11cclxuICBmb3IgKGxldCBpIGluIG5hbWVzKSB7XHJcbiAgICBjb25zdCBuYW1lID0gbmFtZXNbaV1cclxuICAgIGh0bWwgKz0gYDxvcHRpb24gdmFsdWU9XCIke2l9XCI+JHtpfTogJHtuYW1lfTwvb3B0aW9uPmBcclxuICB9XHJcbiAgcmV0dXJuIGA8c2VsZWN0PiR7aHRtbH08L3NlbGVjdD5gXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckluc3RydW1lbnQocHJvZ3JhbSk6IEVsZW1lbnQge1xyXG4gIHJldHVybiByZW5kZXIoYFxyXG4gICAgPGRpdiBjbGFzcz1cImluc3RydW1lbnRcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyYW1cIj4ke3Byb2dyYW19PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJ2b2x1bWVcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBhbnBvdFwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGl0Y2hCZW5kXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwaXRjaEJlbmRTZW5zaXRpdml0eVwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwia2V5c1wiPiR7cmVuZGVyS2V5cygpfTwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgYClcclxufVxyXG5cclxuZnVuY3Rpb24gb2JqZWN0TWFwKG8sIGZ1bmMpIHtcclxuICBjb25zdCByZXN1bHQgPSB7fVxyXG4gIE9iamVjdC5rZXlzKG8pLmZvckVhY2goa2V5ID0+IHtcclxuICAgIHJlc3VsdFtrZXldID0gZnVuYyhvW2tleV0pXHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2dyYW1OYW1lc0Zyb21CYW5rU2V0KGJhbmtTZXQpIHtcclxuICByZXR1cm4gb2JqZWN0TWFwKGJhbmtTZXQsIGJhbmsgPT4gb2JqZWN0TWFwKGJhbmssIHMgPT4gcy5uYW1lKSlcclxufVxyXG5cclxuZnVuY3Rpb24gbWVyZ2VQcm9ncmFtTmFtZXMobGVmdDoge1tpbmRleDogbnVtYmVyXTogc3RyaW5nW119LCByaWdodDoge1tpbmRleDogbnVtYmVyXTogc3RyaW5nW119KSB7XHJcbiAgZnVuY3Rpb24gbWVyZ2VkS2V5cyhhLCBiKSB7XHJcbiAgICByZXR1cm4gbmV3IFNldChbLi4uT2JqZWN0LmtleXMoYSksIC4uLk9iamVjdC5rZXlzKGIpXSlcclxuICB9XHJcbiAgY29uc3QgYmFua3MgPSBtZXJnZWRLZXlzKGxlZnQsIHJpZ2h0KVxyXG4gIGNvbnN0IHJlc3VsdCA9IHt9XHJcbiAgYmFua3MuZm9yRWFjaChiYW5rID0+IHtcclxuICAgIGNvbnN0IGwgPSBsZWZ0W2JhbmtdIHx8IFtdXHJcbiAgICBjb25zdCByID0gcmlnaHRbYmFua10gfHwgW11cclxuICAgIGNvbnN0IGxpc3Q6IHsgW2luZGV4OiBudW1iZXJdOiBzdHJpbmd9ID0ge31cclxuICAgIGNvbnN0IHByb2dyYW1zID0gbWVyZ2VkS2V5cyhsLCByKVxyXG4gICAgcHJvZ3JhbXMuZm9yRWFjaChwID0+IHtcclxuICAgICAgbGlzdFtwXSA9IGAke2xbcF0gfHwgXCJOb25lXCJ9ICgke3JbcF0gfHwgXCJOb25lXCJ9KWBcclxuICAgIH0pXHJcbiAgICByZXN1bHRbYmFua10gPSBsaXN0XHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcgaW1wbGVtZW50cyBMaXN0ZW5lciB7XHJcbiAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50fG51bGxcclxuICBwcml2YXRlIGRyYWc6IGJvb2xlYW4gPSBmYWxzZVxyXG5cclxuICBkcmF3KHN5bnRoOiBTeW50aGVzaXplcik6IEVsZW1lbnQge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudCA9IHJlbmRlcihgPGRpdiAvPmApXHJcbiAgICBjb25zdCBwcm9ncmFtTmFtZXMgPSBtZXJnZVByb2dyYW1OYW1lcyhwcm9ncmFtTmFtZXNGcm9tQmFua1NldChzeW50aC5zb3VuZEZvbnQuZ2V0UHJlc2V0TmFtZXMoKSksIFByb2dyYW1OYW1lcylcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcclxuICAgICAgY29uc3QgYmFuayA9IGkgIT09IDkgPyAwIDogMTI4XHJcbiAgICAgIGNvbnN0IHByb2dyYW0gPSByZW5kZXJQcm9ncmFtT3B0aW9ucyhwcm9ncmFtTmFtZXMsIGJhbmspXHJcbiAgICAgIGNvbnN0IGl0ZW0gPSByZW5kZXJJbnN0cnVtZW50KHByb2dyYW0pXHJcblxyXG4gICAgICBjb25zdCBjaGFubmVsID0gaVxyXG4gICAgICBjb25zdCBzZWxlY3QgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpXHJcbiAgICAgIGlmIChzZWxlY3QpIHtcclxuICAgICAgICBzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxTZWxlY3RFbGVtZW50XHJcbiAgICAgICAgICBjb25zdCBwcm9ncmFtID0gcGFyc2VJbnQodGFyZ2V0LnZhbHVlLCAxMClcclxuICAgICAgICAgIHRoaXMucHJvZ3JhbUNoYW5nZShjaGFubmVsLCBwcm9ncmFtKVxyXG4gICAgICAgICAgc3ludGgucHJvZ3JhbUNoYW5nZShjaGFubmVsLCBwcm9ncmFtKVxyXG4gICAgICAgIH0sIGZhbHNlKVxyXG4gICAgICAgIHNlbGVjdC5zZWxlY3RlZEluZGV4ID0gc3ludGguY2hhbm5lbHNbaV0uaW5zdHJ1bWVudFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBub3RlcyA9IGl0ZW0ucXVlcnlTZWxlY3RvckFsbChcIi5rZXlcIilcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMjg7ICsraikge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGpcclxuXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgdGhpcy5kcmFnID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5ub3RlT24oY2hhbm5lbCwga2V5LCAxMjcpXHJcbiAgICAgICAgICBzeW50aC5ub3RlT24oY2hhbm5lbCwga2V5LCAxMjcpXHJcblxyXG4gICAgICAgICAgY29uc3Qgb25Nb3VzZVVwID0gZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKVxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIHRoaXMuZHJhZyA9IGZhbHNlXHJcbiAgICAgICAgICAgIHRoaXMubm90ZU9mZihjaGFubmVsLCBrZXksIDApXHJcbiAgICAgICAgICAgIHN5bnRoLm5vdGVPZmYoY2hhbm5lbCwga2V5LCAwKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgaWYgKHRoaXMuZHJhZykge1xyXG4gICAgICAgICAgICB0aGlzLm5vdGVPbihjaGFubmVsLCBrZXksIDEyNylcclxuICAgICAgICAgICAgc3ludGgubm90ZU9uKGNoYW5uZWwsIGtleSwgMTI3KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICB0aGlzLm5vdGVPZmYoY2hhbm5lbCwga2V5LCAwKVxyXG4gICAgICAgICAgc3ludGgubm90ZU9mZihjaGFubmVsLCBrZXksIDApXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChpdGVtKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbGVtZW50XHJcbiAgfVxyXG5cclxuICByZW1vdmUoKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxyXG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbFxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsOiBudW1iZXIpOiBFbGVtZW50fG51bGwge1xyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pbnN0cnVtZW50XCIpW2NoYW5uZWxdXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEtleUVsZW1lbnQoY2hhbm5lbDogbnVtYmVyLCBrZXk6IG51bWJlcik6IEVsZW1lbnR8bnVsbCB7XHJcbiAgICBjb25zdCBlbGVtID0gdGhpcy5nZXRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsKVxyXG4gICAgaWYgKCFlbGVtKSB7XHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKFwiLmtleVwiKVtrZXldXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsOiBudW1iZXIsIHF1ZXJ5OiBzdHJpbmcpOiBFbGVtZW50fG51bGwge1xyXG4gICAgY29uc3QgZWxlbSA9IHRoaXMuZ2V0SW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbClcclxuICAgIGlmICghZWxlbSkge1xyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsZW0ucXVlcnlTZWxlY3RvcihxdWVyeSlcclxuICB9XHJcblxyXG4gIG5vdGVPbihjaGFubmVsOiBudW1iZXIsIGtleTogbnVtYmVyLCBfdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZ2V0S2V5RWxlbWVudChjaGFubmVsLCBrZXkpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ25vdGUtb24nKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbm90ZU9mZihjaGFubmVsOiBudW1iZXIsIGtleTogbnVtYmVyLCBfdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZ2V0S2V5RWxlbWVudChjaGFubmVsLCBrZXkpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGUtb24nKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvZ3JhbUNoYW5nZShjaGFubmVsOiBudW1iZXIsIGluc3RydW1lbnQ6IG51bWJlcikge1xyXG4gICAgY29uc3Qgc2VsZWN0ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIucHJvZ3JhbSBzZWxlY3RcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnR8dW5kZWZpbmVkXHJcbiAgICBpZiAoc2VsZWN0KSB7XHJcbiAgICAgIHNlbGVjdC52YWx1ZSA9IGAke2luc3RydW1lbnR9YFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdm9sdW1lQ2hhbmdlKGNoYW5uZWw6IG51bWJlciwgdm9sdW1lOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi52b2x1bWVcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHt2b2x1bWV9YFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGFucG90Q2hhbmdlKGNoYW5uZWw6IG51bWJlciwgcGFucG90OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi5wYW5wb3RcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHtwYW5wb3R9YFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kKGNoYW5uZWw6IG51bWJlciwgcGl0Y2hCZW5kOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi5waXRjaEJlbmRcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHtwaXRjaEJlbmR9YFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbDogbnVtYmVyLCBzZW5zaXRpdml0eTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIucGl0Y2hCZW5kU2Vuc2l0aXZpdHlcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHtzZW5zaXRpdml0eX1gXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhbGxTb3VuZE9mZihfY2hhbm5lbE51bWJlcjogbnVtYmVyKSB7XHJcbiAgfVxyXG5cclxuICBzZXRNYXN0ZXJWb2x1bWUoX3ZvbHVtZTogbnVtYmVyKSB7XHJcbiAgfVxyXG5cclxuICByZXNldEFsbENvbnRyb2woX2NoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvVmlldy50cyIsImNvbnN0IFByb2dyYW1OYW1lczogeyBbaW5kZXg6IG51bWJlcl06IHN0cmluZ1tdIH0gPSB7XHJcbiAgMDogW1xyXG4gICAgXCJBY291c3RpYyBQaWFub1wiLFxyXG4gICAgXCJCcmlnaHQgUGlhbm9cIixcclxuICAgIFwiRWxlY3RyaWMgR3JhbmQgUGlhbm9cIixcclxuICAgIFwiSG9ua3ktdG9uayBQaWFub1wiLFxyXG4gICAgXCJFbGVjdHJpYyBQaWFub1wiLFxyXG4gICAgXCJFbGVjdHJpYyBQaWFubyAyXCIsXHJcbiAgICBcIkhhcnBzaWNob3JkXCIsXHJcbiAgICBcIkNsYXZpXCIsXHJcbiAgICBcIkNlbGVzdGFcIixcclxuICAgIFwiR2xvY2tlbnNwaWVsXCIsXHJcbiAgICBcIk11c2ljYWwgYm94XCIsXHJcbiAgICBcIlZpYnJhcGhvbmVcIixcclxuICAgIFwiTWFyaW1iYVwiLFxyXG4gICAgXCJYeWxvcGhvbmVcIixcclxuICAgIFwiVHVidWxhciBCZWxsXCIsXHJcbiAgICBcIkR1bGNpbWVyXCIsXHJcbiAgICBcIkRyYXdiYXIgT3JnYW5cIixcclxuICAgIFwiUGVyY3Vzc2l2ZSBPcmdhblwiLFxyXG4gICAgXCJSb2NrIE9yZ2FuXCIsXHJcbiAgICBcIkNodXJjaCBvcmdhblwiLFxyXG4gICAgXCJSZWVkIG9yZ2FuXCIsXHJcbiAgICBcIkFjY29yZGlvblwiLFxyXG4gICAgXCJIYXJtb25pY2FcIixcclxuICAgIFwiVGFuZ28gQWNjb3JkaW9uXCIsXHJcbiAgICBcIkFjb3VzdGljIEd1aXRhciAobnlsb24pXCIsXHJcbiAgICBcIkFjb3VzdGljIEd1aXRhciAoc3RlZWwpXCIsXHJcbiAgICBcIkVsZWN0cmljIEd1aXRhciAoamF6eilcIixcclxuICAgIFwiRWxlY3RyaWMgR3VpdGFyIChjbGVhbilcIixcclxuICAgIFwiRWxlY3RyaWMgR3VpdGFyIChtdXRlZClcIixcclxuICAgIFwiT3ZlcmRyaXZlbiBHdWl0YXJcIixcclxuICAgIFwiRGlzdG9ydGlvbiBHdWl0YXJcIixcclxuICAgIFwiR3VpdGFyIGhhcm1vbmljc1wiLFxyXG4gICAgXCJBY291c3RpYyBCYXNzXCIsXHJcbiAgICBcIkVsZWN0cmljIEJhc3MgKGZpbmdlcilcIixcclxuICAgIFwiRWxlY3RyaWMgQmFzcyAocGljaylcIixcclxuICAgIFwiRnJldGxlc3MgQmFzc1wiLFxyXG4gICAgXCJTbGFwIEJhc3MgMVwiLFxyXG4gICAgXCJTbGFwIEJhc3MgMlwiLFxyXG4gICAgXCJTeW50aCBCYXNzIDFcIixcclxuICAgIFwiU3ludGggQmFzcyAyXCIsXHJcbiAgICBcIlZpb2xpblwiLFxyXG4gICAgXCJWaW9sYVwiLFxyXG4gICAgXCJDZWxsb1wiLFxyXG4gICAgXCJEb3VibGUgYmFzc1wiLFxyXG4gICAgXCJUcmVtb2xvIFN0cmluZ3NcIixcclxuICAgIFwiUGl6emljYXRvIFN0cmluZ3NcIixcclxuICAgIFwiT3JjaGVzdHJhbCBIYXJwXCIsXHJcbiAgICBcIlRpbXBhbmlcIixcclxuICAgIFwiU3RyaW5nIEVuc2VtYmxlIDFcIixcclxuICAgIFwiU3RyaW5nIEVuc2VtYmxlIDJcIixcclxuICAgIFwiU3ludGggU3RyaW5ncyAxXCIsXHJcbiAgICBcIlN5bnRoIFN0cmluZ3MgMlwiLFxyXG4gICAgXCJWb2ljZSBBYWhzXCIsXHJcbiAgICBcIlZvaWNlIE9vaHNcIixcclxuICAgIFwiU3ludGggVm9pY2VcIixcclxuICAgIFwiT3JjaGVzdHJhIEhpdFwiLFxyXG4gICAgXCJUcnVtcGV0XCIsXHJcbiAgICBcIlRyb21ib25lXCIsXHJcbiAgICBcIlR1YmFcIixcclxuICAgIFwiTXV0ZWQgVHJ1bXBldFwiLFxyXG4gICAgXCJGcmVuY2ggaG9yblwiLFxyXG4gICAgXCJCcmFzcyBTZWN0aW9uXCIsXHJcbiAgICBcIlN5bnRoIEJyYXNzIDFcIixcclxuICAgIFwiU3ludGggQnJhc3MgMlwiLFxyXG4gICAgXCJTb3ByYW5vIFNheFwiLFxyXG4gICAgXCJBbHRvIFNheFwiLFxyXG4gICAgXCJUZW5vciBTYXhcIixcclxuICAgIFwiQmFyaXRvbmUgU2F4XCIsXHJcbiAgICBcIk9ib2VcIixcclxuICAgIFwiRW5nbGlzaCBIb3JuXCIsXHJcbiAgICBcIkJhc3Nvb25cIixcclxuICAgIFwiQ2xhcmluZXRcIixcclxuICAgIFwiUGljY29sb1wiLFxyXG4gICAgXCJGbHV0ZVwiLFxyXG4gICAgXCJSZWNvcmRlclwiLFxyXG4gICAgXCJQYW4gRmx1dGVcIixcclxuICAgIFwiQmxvd24gQm90dGxlXCIsXHJcbiAgICBcIlNoYWt1aGFjaGlcIixcclxuICAgIFwiV2hpc3RsZVwiLFxyXG4gICAgXCJPY2FyaW5hXCIsXHJcbiAgICBcIkxlYWQgMSAoc3F1YXJlKVwiLFxyXG4gICAgXCJMZWFkIDIgKHNhd3Rvb3RoKVwiLFxyXG4gICAgXCJMZWFkIDMgKGNhbGxpb3BlKVwiLFxyXG4gICAgXCJMZWFkIDQgKGNoaWZmKVwiLFxyXG4gICAgXCJMZWFkIDUgKGNoYXJhbmcpXCIsXHJcbiAgICBcIkxlYWQgNiAodm9pY2UpXCIsXHJcbiAgICBcIkxlYWQgNyAoZmlmdGhzKVwiLFxyXG4gICAgXCJMZWFkIDggKGJhc3MgKyBsZWFkKVwiLFxyXG4gICAgXCJQYWQgMSAoRmFudGFzaWEpXCIsXHJcbiAgICBcIlBhZCAyICh3YXJtKVwiLFxyXG4gICAgXCJQYWQgMyAocG9seXN5bnRoKVwiLFxyXG4gICAgXCJQYWQgNCAoY2hvaXIpXCIsXHJcbiAgICBcIlBhZCA1IChib3dlZClcIixcclxuICAgIFwiUGFkIDYgKG1ldGFsbGljKVwiLFxyXG4gICAgXCJQYWQgNyAoaGFsbylcIixcclxuICAgIFwiUGFkIDggKHN3ZWVwKVwiLFxyXG4gICAgXCJGWCAxIChyYWluKVwiLFxyXG4gICAgXCJGWCAyIChzb3VuZHRyYWNrKVwiLFxyXG4gICAgXCJGWCAzIChjcnlzdGFsKVwiLFxyXG4gICAgXCJGWCA0IChhdG1vc3BoZXJlKVwiLFxyXG4gICAgXCJGWCA1IChicmlnaHRuZXNzKVwiLFxyXG4gICAgXCJGWCA2IChnb2JsaW5zKVwiLFxyXG4gICAgXCJGWCA3IChlY2hvZXMpXCIsXHJcbiAgICBcIkZYIDggKHNjaS1maSlcIixcclxuICAgIFwiU2l0YXJcIixcclxuICAgIFwiQmFuam9cIixcclxuICAgIFwiU2hhbWlzZW5cIixcclxuICAgIFwiS290b1wiLFxyXG4gICAgXCJLYWxpbWJhXCIsXHJcbiAgICBcIkJhZ3BpcGVcIixcclxuICAgIFwiRmlkZGxlXCIsXHJcbiAgICBcIlNoYW5haVwiLFxyXG4gICAgXCJUaW5rbGUgQmVsbFwiLFxyXG4gICAgXCJBZ29nb1wiLFxyXG4gICAgXCJTdGVlbCBEcnVtc1wiLFxyXG4gICAgXCJXb29kYmxvY2tcIixcclxuICAgIFwiVGFpa28gRHJ1bVwiLFxyXG4gICAgXCJNZWxvZGljIFRvbVwiLFxyXG4gICAgXCJTeW50aCBEcnVtXCIsXHJcbiAgICBcIlJldmVyc2UgQ3ltYmFsXCIsXHJcbiAgICBcIkd1aXRhciBGcmV0IE5vaXNlXCIsXHJcbiAgICBcIkJyZWF0aCBOb2lzZVwiLFxyXG4gICAgXCJTZWFzaG9yZVwiLFxyXG4gICAgXCJCaXJkIFR3ZWV0XCIsXHJcbiAgICBcIlRlbGVwaG9uZSBSaW5nXCIsXHJcbiAgICBcIkhlbGljb3B0ZXJcIixcclxuICAgIFwiQXBwbGF1c2VcIixcclxuICAgIFwiR3Vuc2hvdFwiXHJcbiAgXSwgMTI4OiBbXCJSaHl0aG0gVHJhY2tcIl1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZ3JhbU5hbWVzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1Byb2dyYW1OYW1lcy50cyIsImV4cG9ydCBpbnRlcmZhY2UgTGlzdGVuZXIge1xyXG4gIG5vdGVPbihjaGFubmVsOiBudW1iZXIsIGtleTogbnVtYmVyLCB2ZWxvY2l0eTogbnVtYmVyKVxyXG4gIG5vdGVPZmYoY2hhbm5lbDogbnVtYmVyLCBrZXk6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcilcclxuICBzZXRNYXN0ZXJWb2x1bWUodm9sdW1lOiBudW1iZXIpXHJcbiAgcHJvZ3JhbUNoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIGluc3RydW1lbnQ6IG51bWJlcilcclxuICB2b2x1bWVDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCB2b2x1bWU6IG51bWJlcilcclxuICBwYW5wb3RDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBwYW5wb3Q6IG51bWJlcilcclxuICBwaXRjaEJlbmQoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBwaXRjaEJlbmQ6IG51bWJlcilcclxuICBwaXRjaEJlbmRTZW5zaXRpdml0eShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHNlbnNpdGl2aXR5OiBudW1iZXIpXHJcbiAgYWxsU291bmRPZmYoY2hhbm5lbE51bWJlcjogbnVtYmVyKVxyXG4gIHJlc2V0QWxsQ29udHJvbChjaGFubmVsTnVtYmVyOiBudW1iZXIpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pZGlNZXNzYWdlSGFuZGxlciB7XHJcbiAgcHJpdmF0ZSBScG5Nc2IgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cclxuICBwcml2YXRlIFJwbkxzYiA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXVxyXG4gIGxpc3RlbmVyOiBMaXN0ZW5lclxyXG5cclxuICBwcm9jZXNzTWlkaU1lc3NhZ2UobWVzc2FnZTogbnVtYmVyW10pIHtcclxuICAgIGNvbnN0IGNoYW5uZWwgPSBtZXNzYWdlWzBdICYgMHgwZlxyXG4gICAgY29uc3QgeyBsaXN0ZW5lciB9ID0gdGhpc1xyXG5cclxuICAgIGlmICghbGlzdGVuZXIpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChtZXNzYWdlWzBdICYgMHhmMCkge1xyXG4gICAgICBjYXNlIDB4ODA6IC8vIE5vdGVPZmY6IDhuIGtrIHZ2XHJcbiAgICAgICAgbGlzdGVuZXIubm90ZU9mZihjaGFubmVsLCBtZXNzYWdlWzFdLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMHg5MDogLy8gTm90ZU9uOiA5biBrayB2dlxyXG4gICAgICAgIGlmIChtZXNzYWdlWzJdID4gMCkge1xyXG4gICAgICAgICAgbGlzdGVuZXIubm90ZU9uKGNoYW5uZWwsIG1lc3NhZ2VbMV0sIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxpc3RlbmVyLm5vdGVPZmYoY2hhbm5lbCwgbWVzc2FnZVsxXSwgMClcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAweEIwOiAvLyBDb250cm9sIENoYW5nZTogQm4gY2MgZGRcclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbMV0pIHtcclxuICAgICAgICAgIGNhc2UgMHgwNjogLy8gRGF0YSBFbnRyeTogQm4gMDYgZGRcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLlJwbk1zYltjaGFubmVsXSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAodGhpcy5ScG5Mc2JbY2hhbm5lbF0pIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAwOiAvLyBQaXRjaCBCZW5kIFNlbnNpdGl2aXR5XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbCwgbWVzc2FnZVsyXSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHgwNzogLy8gVm9sdW1lIENoYW5nZTogQm4gMDcgZGRcclxuICAgICAgICAgICAgbGlzdGVuZXIudm9sdW1lQ2hhbmdlKGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4MEE6IC8vIFBhbnBvdCBDaGFuZ2U6IEJuIDBBIGRkXHJcbiAgICAgICAgICAgIGxpc3RlbmVyLnBhbnBvdENoYW5nZShjaGFubmVsLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDc4OiAvLyBBbGwgU291bmQgT2ZmOiBCbiA3OCAwMFxyXG4gICAgICAgICAgICBsaXN0ZW5lci5hbGxTb3VuZE9mZihjaGFubmVsKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDc5OiAvLyBSZXNldCBBbGwgQ29udHJvbDogQm4gNzkgMDBcclxuICAgICAgICAgICAgbGlzdGVuZXIucmVzZXRBbGxDb250cm9sKGNoYW5uZWwpXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4MjA6IC8vIEJhbmtTZWxlY3RcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImJhbmtzZWxlY3Q6XCIsIGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4NjQ6IC8vIFJQTiBNU0JcclxuICAgICAgICAgICAgdGhpcy5ScG5Nc2JbY2hhbm5lbF0gPSBtZXNzYWdlWzJdXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4NjU6IC8vIFJQTiBMU0JcclxuICAgICAgICAgICAgdGhpcy5ScG5Mc2JbY2hhbm5lbF0gPSBtZXNzYWdlWzJdXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgLy8gbm90IHN1cHBvcnRlZFxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4QzA6IC8vIFByb2dyYW0gQ2hhbmdlOiBDbiBwcFxyXG4gICAgICAgIGxpc3RlbmVyLnByb2dyYW1DaGFuZ2UoY2hhbm5lbCwgbWVzc2FnZVsxXSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4RTA6IHsgLy8gUGl0Y2ggQmVuZFxyXG4gICAgICAgIGNvbnN0IGJlbmQgPSAoKG1lc3NhZ2VbMV0gJiAweDdmKSB8ICgobWVzc2FnZVsyXSAmIDB4N2YpIDw8IDcpKSAtIDB4MjAwMFxyXG4gICAgICAgIGxpc3RlbmVyLnBpdGNoQmVuZChjaGFubmVsLCBiZW5kKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAweGYwOiAvLyBTeXN0ZW0gRXhjbHVzaXZlIE1lc3NhZ2VcclxuICAgICAgICAvLyBJRCBudW1iZXJcclxuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbMV0pIHtcclxuICAgICAgICAgIGNhc2UgMHg3ZTogLy8gbm9uLXJlYWx0aW1lXHJcbiAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHg3ZjogLy8gcmVhbHRpbWVcclxuICAgICAgICAgICAgLy8gY29uc3QgZGV2aWNlID0gbWVzc2FnZVsyXVxyXG4gICAgICAgICAgICAvLyBzdWIgSUQgMVxyXG4gICAgICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbM10pIHtcclxuICAgICAgICAgICAgICBjYXNlIDB4MDQ6IC8vIGRldmljZSBjb250cm9sXHJcbiAgICAgICAgICAgICAgICAvLyBzdWIgSUQgMlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtZXNzYWdlWzRdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgMHgwMTogeyAvLyBtYXN0ZXIgdm9sdW1lXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm9sdW1lID0gbWVzc2FnZVs1XSArIChtZXNzYWdlWzZdIDw8IDcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgTUFYX1ZPTFVNRSA9IDB4NDAwMCAtIDFcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5zZXRNYXN0ZXJWb2x1bWUodm9sdW1lIC8gTUFYX1ZPTFVNRSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGRlZmF1bHQ6IC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWlkaU1lc3NhZ2VIYW5kbGVyLnRzIiwiLy8gZGVsZWdhdGVzIG1ldGhvZCBjYWxscyB0byBtdWx0aXBsZSB0YXJnZXRzXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlbGVnYXRlUHJveHk8VCBleHRlbmRzIE9iamVjdD4odGFyZ2V0czogVFtdKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXRzWzBdLCB7XHJcbiAgICBnZXQodGFyZ2V0LCBwcm9wS2V5LCBfcmVjZWl2ZXIpIHtcclxuICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICB0YXJnZXRzXHJcbiAgICAgICAgICAubWFwKHQgPT4gdFtwcm9wS2V5XS5iaW5kKHRhcmdldCkpXHJcbiAgICAgICAgICAuZm9yRWFjaChmID0+IGYoLi4uYXJndW1lbnRzKSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2RlbGVnYXRlUHJveHkudHMiXSwic291cmNlUm9vdCI6IiJ9