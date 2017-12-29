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
class DummyView {
    draw() { }
    remove() { }
    getInstrumentElement() { }
    getKeyElement() { }
    noteOn() { }
    noteOff() { }
    programChange() { }
    volumeChange() { }
    panpotChange() { }
    pitchBend() { }
    pitchBendSensitivity() { }
}
class Synthesizer {
    constructor(ctx) {
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
    init() {
        for (let i = 0; i < 16; ++i) {
            this.channels.push(new Channel());
            this.programChange(i, i !== 9 ? i : 0);
            this.volumeChange(i, 0x64);
            this.panpotChange(i, 0x40);
            this.pitchBend(i, 0x00, 0x40); // 8192
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
        this.view.noteOn(channelNumber, key);
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
        this.view.noteOff(channelNumber, key);
    }
    programChange(channelNumber, instrument) {
        this.view.programChange(channelNumber, instrument);
        this.channels[channelNumber].instrument = instrument;
    }
    volumeChange(channelNumber, volume) {
        this.view.volumeChange(channelNumber, volume);
        this.channels[channelNumber].volume = volume;
    }
    panpotChange(channelNumber, panpot) {
        this.view.panpotChange(channelNumber, panpot);
        this.channels[channelNumber].panpot = panpot;
    }
    pitchBend(channelNumber, lowerByte, higherByte) {
        const bend = (lowerByte & 0x7f) | ((higherByte & 0x7f) << 7);
        const channel = this.channels[channelNumber];
        const currentNoteOn = channel.currentNoteOn;
        const calculated = bend - 0x2000;
        this.view.pitchBend(channelNumber, calculated);
        for (let i = 0, il = currentNoteOn.length; i < il; ++i) {
            currentNoteOn[i].updatePitchBend(calculated);
        }
        channel.pitchBend = bend;
    }
    pitchBendSensitivity(channelNumber, sensitivity) {
        this.view.pitchBendSensitivity(channelNumber, sensitivity);
        this.channels[channelNumber].pitchBendSensitivity = sensitivity;
    }
    allSoundOff(channelNumber) {
        const currentNoteOn = this.channels[channelNumber].currentNoteOn;
        while (currentNoteOn.length > 0) {
            this.noteOff(channelNumber, currentNoteOn[0].key, 0);
        }
    }
    resetAllControl(channelNumber) {
        this.pitchBend(channelNumber, 0x00, 0x40); // 8192
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
            volSustain: Math.pow(10, gen.volSustain / 10 / 20),
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
                    synth.programChange(channel, parseInt(target.value, 10));
                }, false);
                select.selectedIndex = synth.channels[i].instrument;
            }
            const notes = item.querySelectorAll(".key");
            for (let j = 0; j < 128; ++j) {
                const key = j;
                notes[j].addEventListener('mousedown', event => {
                    event.preventDefault();
                    this.drag = true;
                    synth.noteOn(channel, key, 127);
                });
                notes[j].addEventListener('mouseover', event => {
                    event.preventDefault();
                    if (this.drag) {
                        synth.noteOn(channel, key, 127);
                    }
                });
                notes[j].addEventListener('mouseout', event => {
                    event.preventDefault();
                    synth.noteOff(channel, key, 0);
                });
                notes[j].addEventListener('mouseup', event => {
                    event.preventDefault();
                    this.drag = false;
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
    noteOn(channel, key) {
        const element = this.getKeyElement(channel, key);
        if (element) {
            element.classList.add('note-on');
        }
    }
    noteOff(channel, key) {
        const element = this.getKeyElement(channel, key);
        if (element) {
            element.classList.remove('note-on');
        }
    }
    programChange(channel, instrument) {
        const select = this.findInstrumentElement(channel, ".program select");
        if (select) {
            select.value = instrument;
        }
    }
    volumeChange(channel, volume) {
        const element = this.findInstrumentElement(channel, ".volume");
        if (element) {
            element.textContent = volume;
        }
    }
    panpotChange(channel, panpot) {
        const element = this.findInstrumentElement(channel, ".panpot");
        if (element) {
            element.textContent = panpot;
        }
    }
    pitchBend(channel, calculatedPitch) {
        const element = this.findInstrumentElement(channel, ".pitchBend");
        if (element) {
            element.textContent = calculatedPitch;
        }
    }
    pitchBendSensitivity(channel, sensitivity) {
        const element = this.findInstrumentElement(channel, ".pitchBendSensitivity");
        if (element) {
            element.textContent = sensitivity;
        }
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
        const { synth } = this;
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
                                        const volume = message[5] + (message[6] << 7);
                                        const MAX_VOLUME = 0x4000 - 1;
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
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MidiMessageHandler;



/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxMmYwMTM3N2UzMWUyOTE4ZTJlMCIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9TdHJ1Y3RzLnRzIiwid2VicGFjazovLy8uL3NyYy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JpZmZQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvc3ludGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYk1pZGlMaW5rLnRzIiwid2VicGFjazovLy8uL3NyYy9TeW50aGVzaXplci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ludGhlc2l6ZXJOb3RlLnRzIiwid2VicGFjazovLy8uL3NyYy9Tb3VuZEZvbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZpZXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Byb2dyYW1OYW1lcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWlkaU1lc3NhZ2VIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FB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SUFBSSxFQUFFLE1BQU0sRUFBRSw4REFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM5RixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwyREFBUyxDQUFDO0FBQzdFLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDREQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzVGLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLCtEQUFhLENBQUM7QUFDakYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxL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LENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkIsS0FBSyxJQUFJLENBQUUsaUJBQWlCO2dDQUMxQixXQUFXO2dDQUNYLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ25CLEtBQUssSUFBSSxFQUFFLENBQUM7d0NBQ1YsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3Q0FDN0MsTUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUM7d0NBQzdCLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQzt3Q0FDMUMsS0FBSztvQ0FDUCxDQUFDO29DQUNEO3dDQUNFLEtBQUs7Z0NBQ1QsQ0FBQztnQ0FDRCxLQUFLOzRCQUNQO2dDQUNFLEtBQUs7d0JBQ1QsQ0FBQzt3QkFDRCxLQUFLO29CQUNQO3dCQUNFLEtBQUs7Z0JBQ1QsQ0FBQztnQkFDRCxLQUFLO1lBQ1AsUUFBUyxnQkFBZ0I7Z0JBQ3ZCLEtBQUs7UUFDVCxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBQUE7QUFBQSIsImZpbGUiOiJzZjIuc3ludGguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxMmYwMTM3N2UzMWUyOTE4ZTJlMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbSB7XHJcbiAgcHJpdmF0ZSBkYXRhOiBVaW50OEFycmF5XHJcbiAgaXA6IG51bWJlclxyXG5cclxuICBjb25zdHJ1Y3RvcihkYXRhLCBvZmZzZXQpIHtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGFcclxuICAgIHRoaXMuaXAgPSBvZmZzZXRcclxuICB9XHJcblxyXG4gIHJlYWRTdHJpbmcoc2l6ZTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0ciA9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgdGhpcy5kYXRhLnN1YmFycmF5KHRoaXMuaXAsIHRoaXMuaXAgKz0gc2l6ZSkpXHJcbiAgICBjb25zdCBudWxsTG9jYXRpb24gPSBzdHIuaW5kZXhPZihcIlxcdTAwMDBcIilcclxuICAgIGlmIChudWxsTG9jYXRpb24gPiAwKSB7XHJcbiAgICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIG51bGxMb2NhdGlvbilcclxuICAgIH1cclxuICAgIHJldHVybiBzdHJcclxuICB9XHJcblxyXG4gIHJlYWRXT1JEKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXArK10gfCAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOClcclxuICB9XHJcblxyXG4gIHJlYWREV09SRChiaWdFbmRpYW46IGJvb2xlYW4gPSBmYWxzZSk6IG51bWJlciB7XHJcbiAgICBpZiAoYmlnRW5kaWFuKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMjR8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAxNikgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOCkgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10pXHJcbiAgICAgICkgPj4+IDBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5kYXRhW3RoaXMuaXArK10gfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgOCkgfCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMTYpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDI0KVxyXG4gICAgICApID4+PiAwXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWFkQnl0ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5pcCsrXVxyXG4gIH1cclxuXHJcbiAgcmVhZEF0KG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXAgKyBvZmZzZXRdXHJcbiAgfVxyXG5cclxuICAvKiBoZWxwZXIgKi9cclxuXHJcbiAgcmVhZFVJbnQ4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZEJ5dGUoKVxyXG4gIH1cclxuICBcclxuICByZWFkSW50OCgpIHtcclxuICAgIHJldHVybiAodGhpcy5yZWFkQnl0ZSgpIDw8IDI0KSA+PiAyNFxyXG4gIH1cclxuICBcclxuICByZWFkVUludDE2KCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZFdPUkQoKVxyXG4gIH1cclxuXHJcbiAgcmVhZEludDE2KCkge1xyXG4gICAgcmV0dXJuICh0aGlzLnJlYWRXT1JEKCkgPDwgMTYpID4+IDE2XHJcbiAgfVxyXG5cclxuICByZWFkVUludDMyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZERXT1JEKClcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N0cmVhbS50cyIsImltcG9ydCB7IEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZSB9IGZyb20gXCIuL0NvbnN0YW50c1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuaW1wb3J0IHsgQ2h1bmsgfSBmcm9tIFwiLi9SaWZmUGFyc2VyXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJzaW9uVGFnIHtcclxuICBtYWpvcjogbnVtYmVyXHJcbiAgbWlub3I6IG51bWJlclxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdiA9IG5ldyBWZXJzaW9uVGFnKClcclxuICAgIHYubWFqb3IgPSBzdHJlYW0ucmVhZEludDgoKVxyXG4gICAgdi5taW5vciA9IHN0cmVhbS5yZWFkSW50OCgpXHJcbiAgICByZXR1cm4gdlxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluZm8ge1xyXG4gIGNvbW1lbnQ6IHN0cmluZ3xudWxsXHJcbiAgY29weXJpZ2h0OiBzdHJpbmd8bnVsbFxyXG4gIGNyZWF0aW9uRGF0ZTogc3RyaW5nfG51bGxcclxuICBlbmdpbmVlcjogc3RyaW5nfG51bGxcclxuICBuYW1lOiBzdHJpbmdcclxuICBwcm9kdWN0OiBzdHJpbmd8bnVsbFxyXG4gIHNvZnR3YXJlOiBzdHJpbmd8bnVsbFxyXG4gIHZlcnNpb246IFZlcnNpb25UYWdcclxuICBzb3VuZEVuZ2luZTogc3RyaW5nfG51bGxcclxuICByb21OYW1lOiBzdHJpbmd8bnVsbFxyXG4gIHJvbVZlcnNpb246IFZlcnNpb25UYWd8bnVsbFxyXG5cclxuICAvLyBMSVNUIC0gSU5GTyDjga7lhajjgabjga4gY2h1bmtcclxuICBzdGF0aWMgcGFyc2UoZGF0YTogVWludDhBcnJheSwgY2h1bmtzOiBDaHVua1tdKSB7XHJcbiAgICBmdW5jdGlvbiBnZXRDaHVuayh0eXBlKSB7XHJcbiAgICAgIHJldHVybiBjaHVua3MuZmluZChjID0+IGMudHlwZSA9PT0gdHlwZSkgXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9TdHJlYW0oY2h1bmspIHtcclxuICAgICAgcmV0dXJuIG5ldyBTdHJlYW0oZGF0YSwgY2h1bmsub2Zmc2V0KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlYWRTdHJpbmcodHlwZSkge1xyXG4gICAgICBjb25zdCBjaHVuayA9IGdldENodW5rKHR5cGUpXHJcbiAgICAgIGlmICghY2h1bmspIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0b1N0cmVhbShjaHVuaykhLnJlYWRTdHJpbmcoY2h1bmsuc2l6ZSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWFkVmVyc2lvblRhZyh0eXBlKSB7XHJcbiAgICAgIGNvbnN0IGNodW5rID0gZ2V0Q2h1bmsodHlwZSlcclxuICAgICAgaWYgKCFjaHVuaykge1xyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFZlcnNpb25UYWcucGFyc2UodG9TdHJlYW0oY2h1bmspKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBpbmZvID0gbmV3IEluZm8oKVxyXG4gICAgaW5mby5jb21tZW50ID0gcmVhZFN0cmluZyhcIklDTVRcIilcclxuICAgIGluZm8uY29weXJpZ2h0ID0gcmVhZFN0cmluZyhcIklDT1BcIilcclxuICAgIGluZm8uY3JlYXRpb25EYXRlID0gcmVhZFN0cmluZyhcIklDUkRcIilcclxuICAgIGluZm8uZW5naW5lZXIgPSByZWFkU3RyaW5nKFwiSUVOR1wiKVxyXG4gICAgaW5mby5uYW1lID0gcmVhZFN0cmluZyhcIklOQU1cIikhXHJcbiAgICBpbmZvLnByb2R1Y3QgPSByZWFkU3RyaW5nKFwiSVBSRFwiKVxyXG4gICAgaW5mby5zb2Z0d2FyZSA9IHJlYWRTdHJpbmcoXCJJU0ZUXCIpXHJcbiAgICBpbmZvLnZlcnNpb24gPSByZWFkVmVyc2lvblRhZyhcImlmaWxcIikhXHJcbiAgICBpbmZvLnNvdW5kRW5naW5lID0gcmVhZFN0cmluZyhcImlzbmdcIilcclxuICAgIGluZm8ucm9tTmFtZSA9IHJlYWRTdHJpbmcoXCJpcm9tXCIpXHJcbiAgICBpbmZvLnJvbVZlcnNpb24gPSByZWFkVmVyc2lvblRhZyhcIml2ZXJcIilcclxuICAgIHJldHVybiBpbmZvXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlc2V0SGVhZGVyIHtcclxuICBwcmVzZXROYW1lOiBzdHJpbmdcclxuICBwcmVzZXQ6IG51bWJlclxyXG4gIGJhbms6IG51bWJlclxyXG4gIHByZXNldEJhZ0luZGV4OiBudW1iZXJcclxuICBsaWJyYXJ5OiBudW1iZXJcclxuICBnZW5yZTogbnVtYmVyXHJcbiAgbW9ycGhvbG9neTogbnVtYmVyXHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnByZXNldE5hbWUgPT09IFwiRU9QXCJcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBQcmVzZXRIZWFkZXIoKVxyXG4gICAgcC5wcmVzZXROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICBwLnByZXNldCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLmJhbmsgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLmxpYnJhcnkgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHAuZ2VucmUgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHAubW9ycGhvbG9neSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcmV0dXJuIHBcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcmVzZXRCYWcge1xyXG4gIHByZXNldEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBwcmVzZXRNb2R1bGF0b3JJbmRleDogbnVtYmVyXHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcCA9IG5ldyBQcmVzZXRCYWcoKVxyXG4gICAgcC5wcmVzZXRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBwLnByZXNldE1vZHVsYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmFuZ2VWYWx1ZSB7XHJcbiAgbG86IG51bWJlclxyXG4gIGhpOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IobG86IG51bWJlciwgaGk6IG51bWJlcikge1xyXG4gICAgdGhpcy5sbyA9IGxvXHJcbiAgICB0aGlzLmhpID0gaGlcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgcmV0dXJuIG5ldyBSYW5nZVZhbHVlKFxyXG4gICAgICBzdHJlYW0ucmVhZEJ5dGUoKSwgXHJcbiAgICAgIHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW9kdWxhdG9yTGlzdCB7XHJcbiAgc291cmNlT3BlcjogbnVtYmVyXHJcbiAgZGVzdGluYXRpb25PcGVyOiBudW1iZXJcclxuICB2YWx1ZTogbnVtYmVyfFJhbmdlVmFsdWVcclxuICBhbW91bnRTb3VyY2VPcGVyOiBudW1iZXJcclxuICB0cmFuc09wZXI6IG51bWJlclxyXG5cclxuICBnZXQgdHlwZSgpIHtcclxuICAgIHJldHVybiBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGVbdGhpcy5kZXN0aW5hdGlvbk9wZXJdXHJcbiAgfVxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2VPcGVyID09PSAwICYmIFxyXG4gICAgICB0aGlzLmRlc3RpbmF0aW9uT3BlciA9PT0gMCAmJlxyXG4gICAgICB0aGlzLnZhbHVlID09PSAwICYmXHJcbiAgICAgIHRoaXMuYW1vdW50U291cmNlT3BlciA9PT0gMCAmJlxyXG4gICAgICB0aGlzLiB0cmFuc09wZXIgPT09IDBcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBNb2R1bGF0b3JMaXN0KClcclxuXHJcbiAgICB0LnNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC5kZXN0aW5hdGlvbk9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHN3aXRjaCAodC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ2tleVJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAndmVsUmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICdrZXludW0nOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICd2ZWxvY2l0eSc6XHJcbiAgICAgICAgdC52YWx1ZSA9IFJhbmdlVmFsdWUucGFyc2Uoc3RyZWFtKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdC52YWx1ZSA9IHN0cmVhbS5yZWFkSW50MTYoKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHQuYW1vdW50U291cmNlT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0LnRyYW5zT3BlciA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgcmV0dXJuIHRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHZW5lcmF0b3JMaXN0IHtcclxuICBjb2RlOiBudW1iZXJcclxuICB2YWx1ZTogbnVtYmVyfFJhbmdlVmFsdWVcclxuXHJcbiAgZ2V0IHR5cGUoKSB7XHJcbiAgICByZXR1cm4gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW3RoaXMuY29kZV1cclxuICB9XHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmNvZGUgPT09IDAgJiZcclxuICAgICAgdGhpcy52YWx1ZSA9PT0gMFxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHBhcnNlKHN0cmVhbTogU3RyZWFtKSB7XHJcbiAgICBjb25zdCB0ID0gbmV3IEdlbmVyYXRvckxpc3QoKVxyXG4gICAgdC5jb2RlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzd2l0Y2ggKHQudHlwZSkge1xyXG4gICAgICBjYXNlICdrZXludW0nOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgIHQudmFsdWUgPSBSYW5nZVZhbHVlLnBhcnNlKHN0cmVhbSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHQudmFsdWUgPSBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudCB7XHJcbiAgaW5zdHJ1bWVudE5hbWU6IHN0cmluZ1xyXG4gIGluc3RydW1lbnRCYWdJbmRleDogbnVtYmVyXHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmluc3RydW1lbnROYW1lID09PSBcIkVPSVwiXHJcbiAgfVxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBJbnN0cnVtZW50KClcclxuICAgIHQuaW5zdHJ1bWVudE5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHQuaW5zdHJ1bWVudEJhZ0luZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudEJhZyB7XHJcbiAgaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4OiBudW1iZXJcclxuICBpbnN0cnVtZW50TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG4gIFxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBJbnN0cnVtZW50QmFnKClcclxuICAgIHQuaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQuaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4ID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2FtcGxlSGVhZGVyIHtcclxuICBzYW1wbGVOYW1lOiBzdHJpbmdcclxuICBzdGFydDogbnVtYmVyXHJcbiAgZW5kOiBudW1iZXJcclxuICBsb29wU3RhcnQ6IG51bWJlclxyXG4gIGxvb3BFbmQ6IG51bWJlclxyXG4gIHNhbXBsZVJhdGU6IG51bWJlclxyXG4gIG9yaWdpbmFsUGl0Y2g6IG51bWJlclxyXG4gIHBpdGNoQ29ycmVjdGlvbjogbnVtYmVyXHJcbiAgc2FtcGxlTGluazogbnVtYmVyXHJcbiAgc2FtcGxlVHlwZTogbnVtYmVyXHJcblxyXG4gIGdldCBpc0VuZCgpIHtcclxuICAgIHJldHVybiB0aGlzLnNhbXBsZU5hbWUgPT09IFwiRU9TXCJcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgcyA9IG5ldyBTYW1wbGVIZWFkZXIoKVxyXG5cclxuICAgIHMuc2FtcGxlTmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcy5zdGFydCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5lbmQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMubG9vcFN0YXJ0ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmxvb3BFbmQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuc2FtcGxlUmF0ZSA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5vcmlnaW5hbFBpdGNoID0gc3RyZWFtLnJlYWRCeXRlKClcclxuICAgIHMucGl0Y2hDb3JyZWN0aW9uID0gc3RyZWFtLnJlYWRJbnQ4KClcclxuICAgIHMuc2FtcGxlTGluayA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICBzLnNhbXBsZVR5cGUgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHMubG9vcFN0YXJ0IC09IHMuc3RhcnRcclxuICAgIHMubG9vcEVuZCAtPSBzLnN0YXJ0XHJcblxyXG4gICAgcmV0dXJuIHNcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBTYW1wbGVMaW5rID0ge1xyXG4gIG1vbm9TYW1wbGU6IDEsXHJcbiAgcmlnaHRTYW1wbGU6IDIsXHJcbiAgbGVmdFNhbXBsZTogNCxcclxuICBsaW5rZWRTYW1wbGU6IDgsXHJcbiAgUm9tTW9ub1NhbXBsZTogMHg4MDAxLFxyXG4gIFJvbVJpZ2h0U2FtcGxlOiAweDgwMDIsXHJcbiAgUm9tTGVmdFNhbXBsZTogMHg4MDA0LFxyXG4gIFJvbUxpbmtlZFNhbXBsZTogMHg4MDA4XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N0cnVjdHMudHMiLCJpbXBvcnQgeyBwYXJzZVJpZmYsIENodW5rLCBPcHRpb25zIGFzIFJpZmZQYXJzZXJPcHRpb25zIH0gZnJvbSBcIi4vUmlmZlBhcnNlclwiXHJcbmltcG9ydCB7IFByZXNldEhlYWRlciwgU2FtcGxlSGVhZGVyLCBQcmVzZXRCYWcsIEluc3RydW1lbnQsIEluc3RydW1lbnRCYWcsIE1vZHVsYXRvckxpc3QsIEdlbmVyYXRvckxpc3QsIEluZm8gfSBmcm9tIFwiLi9TdHJ1Y3RzXCJcclxuaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9TdHJlYW1cIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQYXJzZVJlc3VsdCB7XHJcbiAgcHJlc2V0SGVhZGVyczogUHJlc2V0SGVhZGVyW11cclxuICBwcmVzZXRab25lOiBQcmVzZXRCYWdbXVxyXG4gIHByZXNldE1vZHVsYXRvcnM6IE1vZHVsYXRvckxpc3RbXVxyXG4gIHByZXNldEdlbmVyYXRvcnM6IEdlbmVyYXRvckxpc3RbXVxyXG4gIGluc3RydW1lbnRzOiBJbnN0cnVtZW50W11cclxuICBpbnN0cnVtZW50Wm9uZTogSW5zdHJ1bWVudEJhZ1tdXHJcbiAgaW5zdHJ1bWVudE1vZHVsYXRvcnM6IE1vZHVsYXRvckxpc3RbXVxyXG4gIGluc3RydW1lbnRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W11cclxuICBzYW1wbGVIZWFkZXJzOiBTYW1wbGVIZWFkZXJbXVxyXG4gIHNhbXBsZXM6IEludDE2QXJyYXlbXVxyXG4gIHNhbXBsaW5nRGF0YTogQ2h1bmtcclxuICBpbmZvOiBJbmZvXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlKGlucHV0OiBVaW50OEFycmF5LCBvcHRpb246IFJpZmZQYXJzZXJPcHRpb25zID0ge30pOiBQYXJzZVJlc3VsdCB7XHJcblxyXG4gIC8vIHBhcnNlIFJJRkYgY2h1bmtcclxuICBjb25zdCBjaHVua0xpc3QgPSBwYXJzZVJpZmYoaW5wdXQsIDAsIGlucHV0Lmxlbmd0aCwgb3B0aW9uKVxyXG5cclxuICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBjaHVuayBsZW5ndGgnKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2h1bmsgPSBjaHVua0xpc3RbMF1cclxuICBpZiAoY2h1bmsgPT09IG51bGwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignY2h1bmsgbm90IGZvdW5kJylcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlUmlmZkNodW5rKGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gICAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIlJJRkZcIiwgXCJzZmJrXCIpXHJcblxyXG4gICAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDMpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNmYmsgc3RydWN0dXJlJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAvLyBJTkZPLWxpc3RcclxuICAgICAgaW5mbzogcGFyc2VJbmZvTGlzdChjaHVua0xpc3RbMF0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gc2R0YS1saXN0XHJcbiAgICAgIHNhbXBsaW5nRGF0YTogcGFyc2VTZHRhTGlzdChjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG5cclxuICAgICAgLy8gcGR0YS1saXN0XHJcbiAgICAgIC4uLnBhcnNlUGR0YUxpc3QoY2h1bmtMaXN0WzJdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VQZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwicGR0YVwiKVxyXG5cclxuICAgIC8vIGNoZWNrIG51bWJlciBvZiBjaHVua3NcclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSA5KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwZHRhIGNodW5rJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwcmVzZXRIZWFkZXJzOiBwYXJzZVBoZHIoY2h1bmtMaXN0WzBdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0Wm9uZTogcGFyc2VQYmFnKGNodW5rTGlzdFsxXSwgZGF0YSksXHJcbiAgICAgIHByZXNldE1vZHVsYXRvcnM6IHBhcnNlUG1vZChjaHVua0xpc3RbMl0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRHZW5lcmF0b3JzOiBwYXJzZVBnZW4oY2h1bmtMaXN0WzNdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudHM6IHBhcnNlSW5zdChjaHVua0xpc3RbNF0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50Wm9uZTogcGFyc2VJYmFnKGNodW5rTGlzdFs1XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRNb2R1bGF0b3JzOiBwYXJzZUltb2QoY2h1bmtMaXN0WzZdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudEdlbmVyYXRvcnM6IHBhcnNlSWdlbihjaHVua0xpc3RbN10sIGRhdGEpLFxyXG4gICAgICBzYW1wbGVIZWFkZXJzOiBwYXJzZVNoZHIoY2h1bmtMaXN0WzhdLCBkYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVzdWx0ID0gcGFyc2VSaWZmQ2h1bmsoY2h1bmssIGlucHV0KVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgLi4ucmVzdWx0LFxyXG4gICAgc2FtcGxlczogbG9hZFNhbXBsZShyZXN1bHQuc2FtcGxlSGVhZGVycywgcmVzdWx0LnNhbXBsaW5nRGF0YS5vZmZzZXQsIGlucHV0KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBleHBlY3RlZFR5cGUsIGV4cGVjdGVkU2lnbmF0dXJlKSB7XHJcbiAgLy8gY2hlY2sgcGFyc2UgdGFyZ2V0XHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyArIGNodW5rLnR5cGUpXHJcbiAgfVxyXG5cclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuXHJcbiAgLy8gY2hlY2sgc2lnbmF0dXJlXHJcbiAgY29uc3Qgc2lnbmF0dXJlID0gc3RyZWFtLnJlYWRTdHJpbmcoNClcclxuICBpZiAoc2lnbmF0dXJlICE9PSBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKVxyXG4gIH1cclxuXHJcbiAgLy8gcmVhZCBzdHJ1Y3R1cmVcclxuICByZXR1cm4gcGFyc2VSaWZmKGRhdGEsIHN0cmVhbS5pcCwgY2h1bmsuc2l6ZSAtIDQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlSW5mb0xpc3QoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJJTkZPXCIpXHJcbiAgcmV0dXJuIEluZm8ucGFyc2UoZGF0YSwgY2h1bmtMaXN0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNkdGFMaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSk6IENodW5rIHtcclxuICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcInNkdGFcIilcclxuXHJcbiAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVE9ETycpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2h1bmtMaXN0WzBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQ2h1bms8VD4oY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5LCB0eXBlOiBzdHJpbmcsIGNsYXp6OiB7IHBhcnNlOiAoc3RyZWFtOiBTdHJlYW0pID0+IFQgfSwgdGVybWluYXRlPzogKG9iajogVCkgPT4gYm9vbGVhbik6IFRbXSB7XHJcbiAgY29uc3QgcmVzdWx0OiBUW10gPSBbXVxyXG5cclxuICBpZiAoY2h1bmsudHlwZSAhPT0gdHlwZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyAgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuICBcclxuICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuICBjb25zdCBzaXplID0gY2h1bmsub2Zmc2V0ICsgY2h1bmsuc2l6ZVxyXG4gIFxyXG4gIHdoaWxlIChzdHJlYW0uaXAgPCBzaXplKSB7XHJcbiAgICBjb25zdCBvYmogPSBjbGF6ei5wYXJzZShzdHJlYW0pXHJcbiAgICBpZiAodGVybWluYXRlICYmIHRlcm1pbmF0ZShvYmopKSB7XHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXN1bHQucHVzaChvYmopXHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmNvbnN0IHBhcnNlUGhkciA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwaGRyXCIsIFByZXNldEhlYWRlciwgcCA9PiBwLmlzRW5kKVxyXG5jb25zdCBwYXJzZVBiYWcgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGJhZ1wiLCBQcmVzZXRCYWcpXHJcbmNvbnN0IHBhcnNlSW5zdCA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpbnN0XCIsIEluc3RydW1lbnQsIGkgPT4gaS5pc0VuZClcclxuY29uc3QgcGFyc2VJYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImliYWdcIiwgSW5zdHJ1bWVudEJhZylcclxuY29uc3QgcGFyc2VQbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBtb2RcIiwgTW9kdWxhdG9yTGlzdCwgbSA9PiBtLmlzRW5kKVxyXG5jb25zdCBwYXJzZUltb2QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW1vZFwiLCBNb2R1bGF0b3JMaXN0LCBtID0+IG0uaXNFbmQpXHJcbmNvbnN0IHBhcnNlUGdlbiA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwZ2VuXCIsIEdlbmVyYXRvckxpc3QsIGcgPT4gZy5pc0VuZClcclxuY29uc3QgcGFyc2VJZ2VuID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImlnZW5cIiwgR2VuZXJhdG9yTGlzdCwgZyA9PiBnLmlzRW5kKVxyXG5jb25zdCBwYXJzZVNoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwic2hkclwiLCBTYW1wbGVIZWFkZXIsIHMgPT4gcy5pc0VuZClcclxuXHJcbmZ1bmN0aW9uIGFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBzYW1wbGVSYXRlKSB7XHJcbiAgbGV0IG11bHRpcGx5ID0gMVxyXG5cclxuICAvLyBidWZmZXJcclxuICB3aGlsZSAoc2FtcGxlUmF0ZSA8IDIyMDUwKSB7XHJcbiAgICBjb25zdCBuZXdTYW1wbGUgPSBuZXcgSW50MTZBcnJheShzYW1wbGUubGVuZ3RoICogMilcclxuICAgIGZvciAobGV0IGkgPSAwLCBqID0gMCwgaWwgPSBzYW1wbGUubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgICBuZXdTYW1wbGVbaisrXSA9IHNhbXBsZVtpXVxyXG4gICAgICBuZXdTYW1wbGVbaisrXSA9IHNhbXBsZVtpXVxyXG4gICAgfVxyXG4gICAgc2FtcGxlID0gbmV3U2FtcGxlXHJcbiAgICBtdWx0aXBseSAqPSAyXHJcbiAgICBzYW1wbGVSYXRlICo9IDJcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzYW1wbGUsXHJcbiAgICBtdWx0aXBseVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZFNhbXBsZShzYW1wbGVIZWFkZXI6IFNhbXBsZUhlYWRlcltdLCBzYW1wbGluZ0RhdGFPZmZzZXQ6IG51bWJlciwgZGF0YTogVWludDhBcnJheSk6IEludDE2QXJyYXlbXSB7XHJcbiAgcmV0dXJuIHNhbXBsZUhlYWRlci5tYXAoaGVhZGVyID0+IHtcclxuICAgIGxldCBzYW1wbGUgPSBuZXcgSW50MTZBcnJheShuZXcgVWludDhBcnJheShkYXRhLnN1YmFycmF5KFxyXG4gICAgICBzYW1wbGluZ0RhdGFPZmZzZXQgKyBoZWFkZXIuc3RhcnQgKiAyLFxyXG4gICAgICBzYW1wbGluZ0RhdGFPZmZzZXQgKyBoZWFkZXIuZW5kICAgKiAyXHJcbiAgICApKS5idWZmZXIpXHJcbiAgICBpZiAoaGVhZGVyLnNhbXBsZVJhdGUgPiAwKSB7XHJcbiAgICAgIGNvbnN0IGFkanVzdCA9IGFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBoZWFkZXIuc2FtcGxlUmF0ZSlcclxuICAgICAgc2FtcGxlID0gYWRqdXN0LnNhbXBsZVxyXG4gICAgICBoZWFkZXIuc2FtcGxlUmF0ZSAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgICAgaGVhZGVyLmxvb3BTdGFydCAqPSBhZGp1c3QubXVsdGlwbHlcclxuICAgICAgaGVhZGVyLmxvb3BFbmQgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2FtcGxlXHJcbiAgfSlcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QYXJzZXIudHMiLCJpbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rKGlucHV0OiBVaW50OEFycmF5LCBpcDogbnVtYmVyLCBiaWdFbmRpYW46IGJvb2xlYW4pOiBDaHVuayB7XHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShpbnB1dCwgaXApXHJcbiAgY29uc3QgdHlwZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgY29uc3Qgc2l6ZSA9IHN0cmVhbS5yZWFkRFdPUkQoYmlnRW5kaWFuKVxyXG4gIHJldHVybiBuZXcgQ2h1bmsodHlwZSwgc2l6ZSwgc3RyZWFtLmlwKVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnMge1xyXG4gIHBhZGRpbmc/OiBib29sZWFuLFxyXG4gIGJpZ0VuZGlhbj86IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmlmZihpbnB1dDogVWludDhBcnJheSwgaW5kZXg6IG51bWJlciA9IDAsIGxlbmd0aDogbnVtYmVyLCB7IHBhZGRpbmcgPSB0cnVlLCBiaWdFbmRpYW4gPSBmYWxzZSB9OiBPcHRpb25zID0ge30pIHtcclxuICBjb25zdCBjaHVua0xpc3Q6IENodW5rW10gPSBbXVxyXG4gIGNvbnN0IGVuZCA9IGxlbmd0aCArIGluZGV4XHJcbiAgbGV0IGlwID0gaW5kZXhcclxuXHJcbiAgd2hpbGUgKGlwIDwgZW5kKSB7XHJcbiAgICBjb25zdCBjaHVuayA9IHBhcnNlQ2h1bmsoaW5wdXQsIGlwLCBiaWdFbmRpYW4pXHJcbiAgICBpcCA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemVcclxuICAgIFxyXG4gICAgLy8gcGFkZGluZ1xyXG4gICAgaWYgKHBhZGRpbmcgJiYgKChpcCAtIGluZGV4KSAmIDEpID09PSAxKSB7XHJcbiAgICAgIGlwKytcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2h1bmtMaXN0LnB1c2goY2h1bmspXHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2h1bmtMaXN0XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDaHVuayB7XHJcbiAgdHlwZTogc3RyaW5nXHJcbiAgc2l6ZTogbnVtYmVyXHJcbiAgb2Zmc2V0OiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgICB0aGlzLnNpemUgPSBzaXplXHJcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldFxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmlmZlBhcnNlci50cyIsImV4cG9ydCBjb25zdCBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgPSBbXHJcbiAgJ3N0YXJ0QWRkcnNPZmZzZXQnLFxyXG4gICdlbmRBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kbG9vcEFkZHJzT2Zmc2V0JyxcclxuICAnc3RhcnRBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ21vZExmb1RvUGl0Y2gnLFxyXG4gICd2aWJMZm9Ub1BpdGNoJyxcclxuICAnbW9kRW52VG9QaXRjaCcsXHJcbiAgJ2luaXRpYWxGaWx0ZXJGYycsXHJcbiAgJ2luaXRpYWxGaWx0ZXJRJyxcclxuICAnbW9kTGZvVG9GaWx0ZXJGYycsXHJcbiAgJ21vZEVudlRvRmlsdGVyRmMnLFxyXG4gICdlbmRBZGRyc0NvYXJzZU9mZnNldCcsXHJcbiAgJ21vZExmb1RvVm9sdW1lJyxcclxuICB1bmRlZmluZWQsIC8vIDE0XHJcbiAgJ2Nob3J1c0VmZmVjdHNTZW5kJyxcclxuICAncmV2ZXJiRWZmZWN0c1NlbmQnLFxyXG4gICdwYW4nLFxyXG4gIHVuZGVmaW5lZCx1bmRlZmluZWQsdW5kZWZpbmVkLCAvLyAxOCwxOSwyMFxyXG4gICdkZWxheU1vZExGTycsXHJcbiAgJ2ZyZXFNb2RMRk8nLFxyXG4gICdkZWxheVZpYkxGTycsXHJcbiAgJ2ZyZXFWaWJMRk8nLFxyXG4gICdkZWxheU1vZEVudicsXHJcbiAgJ2F0dGFja01vZEVudicsXHJcbiAgJ2hvbGRNb2RFbnYnLFxyXG4gICdkZWNheU1vZEVudicsXHJcbiAgJ3N1c3RhaW5Nb2RFbnYnLFxyXG4gICdyZWxlYXNlTW9kRW52JyxcclxuICAna2V5bnVtVG9Nb2RFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Nb2RFbnZEZWNheScsXHJcbiAgJ2RlbGF5Vm9sRW52JyxcclxuICAnYXR0YWNrVm9sRW52JyxcclxuICAnaG9sZFZvbEVudicsXHJcbiAgJ2RlY2F5Vm9sRW52JyxcclxuICAnc3VzdGFpblZvbEVudicsXHJcbiAgJ3JlbGVhc2VWb2xFbnYnLFxyXG4gICdrZXludW1Ub1ZvbEVudkhvbGQnLFxyXG4gICdrZXludW1Ub1ZvbEVudkRlY2F5JyxcclxuICAnaW5zdHJ1bWVudCcsXHJcbiAgdW5kZWZpbmVkLCAvLyA0MlxyXG4gICdrZXlSYW5nZScsXHJcbiAgJ3ZlbFJhbmdlJyxcclxuICAnc3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdrZXludW0nLFxyXG4gICd2ZWxvY2l0eScsXHJcbiAgJ2luaXRpYWxBdHRlbnVhdGlvbicsXHJcbiAgdW5kZWZpbmVkLCAvLyA0OVxyXG4gICdlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdjb2Fyc2VUdW5lJyxcclxuICAnZmluZVR1bmUnLFxyXG4gICdzYW1wbGVJRCcsXHJcbiAgJ3NhbXBsZU1vZGVzJyxcclxuICB1bmRlZmluZWQsIC8vIDU1XHJcbiAgJ3NjYWxlVHVuaW5nJyxcclxuICAnZXhjbHVzaXZlQ2xhc3MnLFxyXG4gICdvdmVycmlkaW5nUm9vdEtleSdcclxuXVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQ29uc3RhbnRzLnRzIiwiaW1wb3J0IFdlYk1pZGlMaW5rIGZyb20gXCIuLi9zcmMvV2ViTWlkaUxpbmsudHNcIlxyXG5leHBvcnQge1xyXG4gIFdlYk1pZGlMaW5rXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZXhwb3J0L3N5bnRoLmpzIiwiaW1wb3J0IFN5bnRoZXNpemVyIGZyb20gXCIuL1N5bnRoZXNpemVyXCJcclxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vVmlld1wiXHJcbmltcG9ydCBNaWRpTWVzc2FnZUhhbmRsZXIgZnJvbSBcIi4vTWlkaU1lc3NhZ2VIYW5kbGVyXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYk1pZGlMaW5rIHtcclxuICBsb2FkQ2FsbGJhY2s6IChBcnJheUJ1ZmZlcikgPT4gdm9pZFxyXG4gIG1pZGlNZXNzYWdlSGFuZGxlcjogTWlkaU1lc3NhZ2VIYW5kbGVyXHJcbiAgcmVhZHk6IGJvb2xlYW4gPSBmYWxzZVxyXG4gIHN5bnRoOiBTeW50aGVzaXplclxyXG4gIHZpZXc6IFZpZXdcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLm1pZGlNZXNzYWdlSGFuZGxlciA9IG5ldyBNaWRpTWVzc2FnZUhhbmRsZXIoKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMucmVhZHkgPSB0cnVlXHJcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKVxyXG4gIH1cclxuXHJcbiAgc2V0dXAodXJsKSB7XHJcbiAgICBpZiAoIXRoaXMucmVhZHkpIHtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiBvbmxvYWQoKSB7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBvbmxvYWQsIGZhbHNlKVxyXG4gICAgICAgIHRoaXMubG9hZCh1cmwpXHJcbiAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxvYWQodXJsKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZCh1cmwpIHtcclxuICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcblxyXG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSlcclxuICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInXHJcblxyXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihldikge1xyXG4gICAgICBjb25zdCB4aHIgPSBldi50YXJnZXQgYXMgWE1MSHR0cFJlcXVlc3RcclxuXHJcbiAgICAgIHRoaXMub25sb2FkKHhoci5yZXNwb25zZSlcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmxvYWRDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRoaXMubG9hZENhbGxiYWNrKHhoci5yZXNwb25zZSlcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSlcclxuXHJcbiAgICB4aHIuc2VuZCgpXHJcbiAgfVxyXG5cclxuICBvbmxvYWQocmVzcG9uc2U6IEFycmF5QnVmZmVyKSB7XHJcbiAgICBjb25zdCBpbnB1dCA9IG5ldyBVaW50OEFycmF5KHJlc3BvbnNlKVxyXG4gICAgdGhpcy5sb2FkU291bmRGb250KGlucHV0KVxyXG4gIH1cclxuXHJcbiAgbG9hZFNvdW5kRm9udChpbnB1dDogVWludDhBcnJheSkge1xyXG4gICAgbGV0IHN5bnRoOiBTeW50aGVzaXplclxyXG5cclxuICAgIGlmICghdGhpcy5zeW50aCkge1xyXG4gICAgICBjb25zdCBjdHggPSBuZXcgQXVkaW9Db250ZXh0KClcclxuICAgICAgc3ludGggPSB0aGlzLnN5bnRoID0gbmV3IFN5bnRoZXNpemVyKGN0eClcclxuICAgICAgc3ludGguaW5pdCgpXHJcbiAgICAgIHN5bnRoLnJlZnJlc2hJbnN0cnVtZW50cyhpbnB1dClcclxuICAgICAgc3ludGguY29ubmVjdChjdHguZGVzdGluYXRpb24pXHJcbiAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnZpZXcgPSBuZXcgVmlldygpXHJcbiAgICAgIGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihcIi5zeW50aFwiKSEuYXBwZW5kQ2hpbGQodmlldy5kcmF3KHN5bnRoKSlcclxuICAgICAgdGhpcy5taWRpTWVzc2FnZUhhbmRsZXIuc3ludGggPSBzeW50aFxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMub25tZXNzYWdlLmJpbmQodGhpcyksIGZhbHNlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3ludGggPSB0aGlzLnN5bnRoXHJcbiAgICAgIHN5bnRoLnJlZnJlc2hJbnN0cnVtZW50cyhpbnB1dClcclxuICAgIH1cclxuXHJcbiAgICAvLyBsaW5rIHJlYWR5XHJcbiAgICBpZiAod2luZG93Lm9wZW5lcikge1xyXG4gICAgICB3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKFwibGluayxyZWFkeVwiLCAnKicpXHJcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5wYXJlbnQgIT09IHdpbmRvdykge1xyXG4gICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKFwibGluayxyZWFkeVwiLCAnKicpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbm1lc3NhZ2UoZXY6IE1lc3NhZ2VFdmVudCkge1xyXG4gICAgY29uc3QgbXNnID0gZXYuZGF0YS5zcGxpdCgnLCcpXHJcbiAgICBjb25zdCB0eXBlID0gbXNnLnNoaWZ0KClcclxuXHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgY2FzZSAnbWlkaSc6XHJcbiAgICAgICAgdGhpcy5taWRpTWVzc2FnZUhhbmRsZXIucHJvY2Vzc01pZGlNZXNzYWdlKFxyXG4gICAgICAgICAgbXNnLm1hcChmdW5jdGlvbihoZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGhleCwgMTYpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIClcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdsaW5rJzpcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gbXNnLnNoaWZ0KClcclxuICAgICAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcclxuICAgICAgICAgIGNhc2UgJ3JlcXBhdGNoJzpcclxuICAgICAgICAgICAgLy8gVE9ETzogZHVtbXkgZGF0YVxyXG4gICAgICAgICAgICBpZiAod2luZG93Lm9wZW5lcikge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5vcGVuZXIucG9zdE1lc3NhZ2UoXCJsaW5rLHBhdGNoXCIsICcqJylcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKFwibGluayxwYXRjaFwiLCAnKicpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgJ3NldHBhdGNoJzpcclxuICAgICAgICAgICAgLy8gVE9ETzogTk9QXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCd1bmtub3duIGxpbmsgbWVzc2FnZTonLCBjb21tYW5kKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ3Vua25vd24gbWVzc2FnZSB0eXBlJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldExvYWRDYWxsYmFjayhjYWxsYmFjazogKEFycmF5QnVmZmVyKSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmxvYWRDYWxsYmFjayA9IGNhbGxiYWNrXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9XZWJNaWRpTGluay50cyIsImltcG9ydCBTeW50aGVzaXplck5vdGUgZnJvbSBcIi4vU3ludGhlc2l6ZXJOb3RlXCJcclxuaW1wb3J0IHBhcnNlIGZyb20gXCIuL1BhcnNlclwiXHJcbmltcG9ydCBTb3VuZEZvbnQgZnJvbSBcIi4vU291bmRGb250XCJcclxuaW1wb3J0IHsgSW5zdHJ1bWVudFN0YXRlIH0gZnJvbSBcIi4vU3ludGhlc2l6ZXJOb3RlXCJcclxuXHJcbmNvbnN0IEJBU0VfVk9MVU1FID0gMC40XHJcblxyXG5jbGFzcyBDaGFubmVsIHtcclxuICBpbnN0cnVtZW50ID0gMFxyXG4gIHZvbHVtZSA9IDBcclxuICBwaXRjaEJlbmQgPSAwXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPSAwXHJcbiAgcGFucG90ID0gMFxyXG4gIGN1cnJlbnROb3RlT246IFN5bnRoZXNpemVyTm90ZVtdID0gW11cclxufVxyXG5cclxuaW50ZXJmYWNlIFZpZXcge1xyXG4gIGRyYXcoKVxyXG4gIHJlbW92ZSgpXHJcbiAgZ2V0SW5zdHJ1bWVudEVsZW1lbnQoKVxyXG4gIGdldEtleUVsZW1lbnQoKVxyXG4gIG5vdGVPbihjaGFubmVsTnVtYmVyOiBudW1iZXIsIGtleTogbnVtYmVyKVxyXG4gIG5vdGVPZmYoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlcilcclxuICBwcm9ncmFtQ2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgaW5zdHJ1bWVudDogbnVtYmVyKVxyXG4gIHZvbHVtZUNoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHZvbHVtZTogbnVtYmVyKVxyXG4gIHBhbnBvdENoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIHBhbnBvdDogbnVtYmVyKVxyXG4gIHBpdGNoQmVuZChjaGFubmVsTnVtYmVyOiBudW1iZXIsIHBpdGNoQmVuZDogbnVtYmVyKVxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWxOdW1iZXI6IG51bWJlciwgc2Vuc2l0aXZpdHk6IG51bWJlcilcclxufVxyXG5cclxuY2xhc3MgRHVtbXlWaWV3IGltcGxlbWVudHMgVmlldyB7XHJcbiAgZHJhdygpIHsgfVxyXG4gIHJlbW92ZSgpIHsgfVxyXG4gIGdldEluc3RydW1lbnRFbGVtZW50KCkgeyB9XHJcbiAgZ2V0S2V5RWxlbWVudCgpIHsgfVxyXG4gIG5vdGVPbigpIHsgfVxyXG4gIG5vdGVPZmYoKSB7IH1cclxuICBwcm9ncmFtQ2hhbmdlKCkgeyB9XHJcbiAgdm9sdW1lQ2hhbmdlKCkgeyB9XHJcbiAgcGFucG90Q2hhbmdlKCkgeyB9XHJcbiAgcGl0Y2hCZW5kKCkgeyB9XHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoKSB7IH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ludGhlc2l6ZXIge1xyXG4gIGJhbms6IG51bWJlciA9IDBcclxuICBidWZmZXJTaXplOiBudW1iZXIgPSAxMDI0XHJcbiAgY3R4OiBBdWRpb0NvbnRleHRcclxuICBnYWluTWFzdGVyOiBHYWluTm9kZVxyXG4gIGNoYW5uZWxzOiBDaGFubmVsW10gPSBbXVxyXG4gIG1hc3RlclZvbHVtZTogbnVtYmVyID0gMS4wXHJcbiAgdmlldzogVmlldyA9IG5ldyBEdW1teVZpZXcoKVxyXG4gIHNvdW5kRm9udDogU291bmRGb250XHJcblxyXG4gIGNvbnN0cnVjdG9yKGN0eCkge1xyXG4gICAgdGhpcy5jdHggPSBjdHhcclxuICAgIHRoaXMuZ2Fpbk1hc3RlciA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKVxyXG4gICAgdGhpcy5zZXRNYXN0ZXJWb2x1bWUodGhpcy5tYXN0ZXJWb2x1bWUpXHJcbiAgICB0aGlzLmluaXQoKVxyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xyXG4gICAgICB0aGlzLmNoYW5uZWxzLnB1c2gobmV3IENoYW5uZWwoKSlcclxuICAgICAgdGhpcy5wcm9ncmFtQ2hhbmdlKGksIGkgIT09IDkgPyBpIDogMClcclxuICAgICAgdGhpcy52b2x1bWVDaGFuZ2UoaSwgMHg2NClcclxuICAgICAgdGhpcy5wYW5wb3RDaGFuZ2UoaSwgMHg0MClcclxuICAgICAgdGhpcy5waXRjaEJlbmQoaSwgMHgwMCwgMHg0MCk7IC8vIDgxOTJcclxuICAgICAgdGhpcy5waXRjaEJlbmRTZW5zaXRpdml0eShpLCAyKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVmcmVzaEluc3RydW1lbnRzKGlucHV0OiBVaW50OEFycmF5KSB7XHJcbiAgICBjb25zdCBwYXJzZXIgPSBwYXJzZShpbnB1dClcclxuICAgIHRoaXMuc291bmRGb250ID0gbmV3IFNvdW5kRm9udChwYXJzZXIpXHJcbiAgfVxyXG5cclxuICBjb25uZWN0KGRlc3RpbmF0aW9uKSB7XHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIuY29ubmVjdChkZXN0aW5hdGlvbilcclxuICB9XHJcblxyXG4gIHNldE1hc3RlclZvbHVtZSh2b2x1bWUpIHtcclxuICAgIHRoaXMubWFzdGVyVm9sdW1lID0gdm9sdW1lXHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIuZ2Fpbi52YWx1ZSA9IEJBU0VfVk9MVU1FICogdm9sdW1lIC8gMHg4MDAwXHJcbiAgfVxyXG5cclxuICBub3RlT24oY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnNvdW5kRm9udCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBjaGFubmVsTnVtYmVyID09PSA5ID8gMTI4IDogdGhpcy5iYW5rXHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGNvbnN0IG5vdGVJbmZvID0gdGhpcy5zb3VuZEZvbnQuZ2V0SW5zdHJ1bWVudEtleShiYW5rTnVtYmVyLCBjaGFubmVsLmluc3RydW1lbnQsIGtleSwgdmVsb2NpdHkpXHJcblxyXG4gICAgaWYgKCFub3RlSW5mbykge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFucG90ID0gY2hhbm5lbC5wYW5wb3QgLSA2NFxyXG4gICAgcGFucG90IC89IHBhbnBvdCA8IDAgPyA2NCA6IDYzXHJcblxyXG4gICAgLy8gY3JlYXRlIG5vdGUgaW5mb3JtYXRpb25cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXk6IEluc3RydW1lbnRTdGF0ZSA9IHtcclxuICAgICAgY2hhbm5lbDogY2hhbm5lbE51bWJlcixcclxuICAgICAga2V5OiBrZXksXHJcbiAgICAgIHZlbG9jaXR5OiB2ZWxvY2l0eSxcclxuICAgICAgcGFucG90OiBwYW5wb3QsXHJcbiAgICAgIHZvbHVtZTogY2hhbm5lbC52b2x1bWUgLyAxMjcsXHJcbiAgICAgIHBpdGNoQmVuZDogY2hhbm5lbC5waXRjaEJlbmQgLSAweDIwMDAsXHJcbiAgICAgIHBpdGNoQmVuZFNlbnNpdGl2aXR5OiBjaGFubmVsLnBpdGNoQmVuZFNlbnNpdGl2aXR5XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbm90ZSBvblxyXG4gICAgY29uc3Qgbm90ZSA9IG5ldyBTeW50aGVzaXplck5vdGUodGhpcy5jdHgsIHRoaXMuZ2Fpbk1hc3Rlciwgbm90ZUluZm8sIGluc3RydW1lbnRLZXkpXHJcbiAgICBub3RlLm5vdGVPbigpXHJcbiAgICBjaGFubmVsLmN1cnJlbnROb3RlT24ucHVzaChub3RlKVxyXG5cclxuICAgIHRoaXMudmlldy5ub3RlT24oY2hhbm5lbE51bWJlciwga2V5KVxyXG4gIH1cclxuXHJcbiAgbm90ZU9mZihjaGFubmVsTnVtYmVyOiBudW1iZXIsIGtleTogbnVtYmVyLCBfdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnNvdW5kRm9udCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBjaGFubmVsTnVtYmVyID09PSA5ID8gMTI4IDogdGhpcy5iYW5rXHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXkgPSB0aGlzLnNvdW5kRm9udC5nZXRJbnN0cnVtZW50S2V5KGJhbmtOdW1iZXIsIGNoYW5uZWwuaW5zdHJ1bWVudCwga2V5KVxyXG5cclxuICAgIGlmICghaW5zdHJ1bWVudEtleSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjdXJyZW50Tm90ZU9uID0gY2hhbm5lbC5jdXJyZW50Tm90ZU9uXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gY3VycmVudE5vdGVPbi5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XHJcbiAgICAgIGNvbnN0IG5vdGUgPSBjdXJyZW50Tm90ZU9uW2ldXHJcbiAgICAgIGlmIChub3RlLmtleSA9PT0ga2V5KSB7XHJcbiAgICAgICAgbm90ZS5ub3RlT2ZmKClcclxuICAgICAgICBjdXJyZW50Tm90ZU9uLnNwbGljZShpLCAxKVxyXG4gICAgICAgIC0taVxyXG4gICAgICAgIC0taWxcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlldy5ub3RlT2ZmKGNoYW5uZWxOdW1iZXIsIGtleSlcclxuICB9XHJcblxyXG4gIHByb2dyYW1DaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBpbnN0cnVtZW50OiBudW1iZXIpIHtcclxuICAgIHRoaXMudmlldy5wcm9ncmFtQ2hhbmdlKGNoYW5uZWxOdW1iZXIsIGluc3RydW1lbnQpXHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLmluc3RydW1lbnQgPSBpbnN0cnVtZW50XHJcbiAgfVxyXG5cclxuICB2b2x1bWVDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCB2b2x1bWU6IG51bWJlcikge1xyXG4gICAgdGhpcy52aWV3LnZvbHVtZUNoYW5nZShjaGFubmVsTnVtYmVyLCB2b2x1bWUpXHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLnZvbHVtZSA9IHZvbHVtZVxyXG4gIH1cclxuXHJcbiAgcGFucG90Q2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgcGFucG90OiBudW1iZXIpIHtcclxuICAgIHRoaXMudmlldy5wYW5wb3RDaGFuZ2UoY2hhbm5lbE51bWJlciwgcGFucG90KVxyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS5wYW5wb3QgPSBwYW5wb3RcclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZChjaGFubmVsTnVtYmVyOiBudW1iZXIsIGxvd2VyQnl0ZTogbnVtYmVyLCBoaWdoZXJCeXRlOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGJlbmQgPSAobG93ZXJCeXRlICYgMHg3ZikgfCAoKGhpZ2hlckJ5dGUgJiAweDdmKSA8PCA3KVxyXG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl1cclxuICAgIGNvbnN0IGN1cnJlbnROb3RlT24gPSBjaGFubmVsLmN1cnJlbnROb3RlT25cclxuICAgIGNvbnN0IGNhbGN1bGF0ZWQgPSBiZW5kIC0gMHgyMDAwXHJcblxyXG4gICAgdGhpcy52aWV3LnBpdGNoQmVuZChjaGFubmVsTnVtYmVyLCBjYWxjdWxhdGVkKVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBpbCA9IGN1cnJlbnROb3RlT24ubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgICBjdXJyZW50Tm90ZU9uW2ldLnVwZGF0ZVBpdGNoQmVuZChjYWxjdWxhdGVkKVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5uZWwucGl0Y2hCZW5kID0gYmVuZFxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBzZW5zaXRpdml0eTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnZpZXcucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbE51bWJlciwgc2Vuc2l0aXZpdHkpXHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLnBpdGNoQmVuZFNlbnNpdGl2aXR5ID0gc2Vuc2l0aXZpdHlcclxuICB9XHJcblxyXG4gIGFsbFNvdW5kT2ZmKGNoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gICAgY29uc3QgY3VycmVudE5vdGVPbiA9IHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl0uY3VycmVudE5vdGVPblxyXG5cclxuICAgIHdoaWxlIChjdXJyZW50Tm90ZU9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5ub3RlT2ZmKGNoYW5uZWxOdW1iZXIsIGN1cnJlbnROb3RlT25bMF0ua2V5LCAwKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzZXRBbGxDb250cm9sKGNoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gICAgdGhpcy5waXRjaEJlbmQoY2hhbm5lbE51bWJlciwgMHgwMCwgMHg0MCk7IC8vIDgxOTJcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N5bnRoZXNpemVyLnRzIiwiaW1wb3J0IHsgTm90ZUluZm8gfSBmcm9tIFwiLi9Tb3VuZEZvbnRcIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnN0cnVtZW50U3RhdGUge1xyXG4gIGNoYW5uZWw6IG51bWJlclxyXG4gIGtleTogbnVtYmVyXHJcbiAgdm9sdW1lOiBudW1iZXJcclxuICBwYW5wb3Q6IG51bWJlclxyXG4gIHZlbG9jaXR5OiBudW1iZXJcclxuICBwaXRjaEJlbmQ6IG51bWJlclxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5OiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ludGhlc2l6ZXJOb3RlIHtcclxuXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAvLyBhdWRpbyBub2RlXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgYXVkaW9CdWZmZXI6IEF1ZGlvQnVmZmVyXHJcbiAgYnVmZmVyU291cmNlOiBBdWRpb0J1ZmZlclNvdXJjZU5vZGVcclxuICBwYW5uZXI6IFBhbm5lck5vZGVcclxuICBnYWluT3V0cHV0OiBHYWluTm9kZVxyXG4gIGN0eDogQXVkaW9Db250ZXh0XHJcbiAgZGVzdGluYXRpb246IEF1ZGlvTm9kZVxyXG4gIGZpbHRlcjogQmlxdWFkRmlsdGVyTm9kZVxyXG4gIG5vdGVJbmZvOiBOb3RlSW5mb1xyXG4gIGluc3RydW1lbnQ6IEluc3RydW1lbnRTdGF0ZVxyXG4gIGNoYW5uZWw6IG51bWJlclxyXG4gIGtleTogbnVtYmVyXHJcbiAgdmVsb2NpdHk6IG51bWJlclxyXG4gIHBsYXliYWNrUmF0ZTogbnVtYmVyXHJcbiAgdm9sdW1lOiBudW1iZXJcclxuICBwYW5wb3Q6IG51bWJlclxyXG4gIHBpdGNoQmVuZDogbnVtYmVyXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHk6IG51bWJlclxyXG5cclxuICAvLyBzdGF0ZVxyXG4gIHN0YXJ0VGltZTogbnVtYmVyXHJcbiAgY29tcHV0ZWRQbGF5YmFja1JhdGU6IG51bWJlclxyXG5cclxuICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCwgZGVzdGluYXRpb246IEF1ZGlvTm9kZSwgbm90ZUluZm86IE5vdGVJbmZvLCBpbnN0cnVtZW50OiBJbnN0cnVtZW50U3RhdGUpIHtcclxuICAgIHRoaXMuY3R4ID0gY3R4XHJcbiAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb25cclxuICAgIHRoaXMubm90ZUluZm8gPSBub3RlSW5mb1xyXG4gICAgdGhpcy5wbGF5YmFja1JhdGUgPSBub3RlSW5mby5wbGF5YmFja1JhdGUoaW5zdHJ1bWVudC5rZXkpXHJcbiAgICB0aGlzLmluc3RydW1lbnQgPSBpbnN0cnVtZW50XHJcbiAgICB0aGlzLmNoYW5uZWwgPSBpbnN0cnVtZW50LmNoYW5uZWxcclxuICAgIHRoaXMua2V5ID0gaW5zdHJ1bWVudC5rZXlcclxuICAgIHRoaXMudmVsb2NpdHkgPSBpbnN0cnVtZW50LnZlbG9jaXR5XHJcbiAgICB0aGlzLnZvbHVtZSA9IGluc3RydW1lbnQudm9sdW1lXHJcbiAgICB0aGlzLnBhbnBvdCA9IGluc3RydW1lbnQucGFucG90XHJcbiAgICB0aGlzLnBpdGNoQmVuZCA9IGluc3RydW1lbnQucGl0Y2hCZW5kXHJcbiAgICB0aGlzLnBpdGNoQmVuZFNlbnNpdGl2aXR5ID0gaW5zdHJ1bWVudC5waXRjaEJlbmRTZW5zaXRpdml0eVxyXG4gICAgdGhpcy5zdGFydFRpbWUgPSBjdHguY3VycmVudFRpbWVcclxuICAgIHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUgPSB0aGlzLnBsYXliYWNrUmF0ZVxyXG4gIH1cclxuXHJcbiAgbm90ZU9uKCkge1xyXG4gICAgY29uc3QgeyBjdHgsIG5vdGVJbmZvIH0gPSB0aGlzXHJcblxyXG4gICAgY29uc3Qgc2FtcGxlID0gbm90ZUluZm8uc2FtcGxlLnN1YmFycmF5KDAsIG5vdGVJbmZvLnNhbXBsZS5sZW5ndGggKyBub3RlSW5mby5lbmQpXHJcbiAgICB0aGlzLmF1ZGlvQnVmZmVyID0gY3R4LmNyZWF0ZUJ1ZmZlcigxLCBzYW1wbGUubGVuZ3RoLCBub3RlSW5mby5zYW1wbGVSYXRlKVxyXG5cclxuICAgIGNvbnN0IGNoYW5uZWxEYXRhID0gdGhpcy5hdWRpb0J1ZmZlci5nZXRDaGFubmVsRGF0YSgwKVxyXG4gICAgY2hhbm5lbERhdGEuc2V0KHNhbXBsZSlcclxuXHJcbiAgICAvLyBidWZmZXIgc291cmNlXHJcbiAgICBjb25zdCBidWZmZXJTb3VyY2UgPSBjdHguY3JlYXRlQnVmZmVyU291cmNlKClcclxuICAgIGJ1ZmZlclNvdXJjZS5idWZmZXIgPSB0aGlzLmF1ZGlvQnVmZmVyXHJcbiAgICBidWZmZXJTb3VyY2UubG9vcCA9ICh0aGlzLmNoYW5uZWwgIT09IDkpXHJcbiAgICBidWZmZXJTb3VyY2UubG9vcFN0YXJ0ID0gbm90ZUluZm8ubG9vcFN0YXJ0IC8gbm90ZUluZm8uc2FtcGxlUmF0ZVxyXG4gICAgYnVmZmVyU291cmNlLmxvb3BFbmQgPSBub3RlSW5mby5sb29wRW5kIC8gbm90ZUluZm8uc2FtcGxlUmF0ZVxyXG4gICAgYnVmZmVyU291cmNlLm9uZW5kZWQgPSAoKSA9PiB0aGlzLmRpc2Nvbm5lY3QoKVxyXG4gICAgdGhpcy5idWZmZXJTb3VyY2UgPSBidWZmZXJTb3VyY2VcclxuICAgIHRoaXMudXBkYXRlUGl0Y2hCZW5kKHRoaXMucGl0Y2hCZW5kKVxyXG5cclxuICAgIC8vIGF1ZGlvIG5vZGVcclxuICAgIGNvbnN0IHBhbm5lciA9IHRoaXMucGFubmVyID0gY3R4LmNyZWF0ZVBhbm5lcigpXHJcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmdhaW5PdXRwdXQgPSBjdHguY3JlYXRlR2FpbigpXHJcbiAgICBjb25zdCBvdXRwdXRHYWluID0gb3V0cHV0LmdhaW5cclxuXHJcbiAgICAvLyBmaWx0ZXJcclxuICAgIGNvbnN0IGZpbHRlciA9IGN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKVxyXG4gICAgZmlsdGVyLnR5cGUgPSBcImxvd3Bhc3NcIlxyXG4gICAgdGhpcy5maWx0ZXIgPSBmaWx0ZXJcclxuXHJcbiAgICAvLyBwYW5wb3RcclxuICAgIHBhbm5lci5wYW5uaW5nTW9kZWwgPSBcImVxdWFscG93ZXJcIlxyXG4gICAgcGFubmVyLnNldFBvc2l0aW9uKFxyXG4gICAgICBNYXRoLnNpbih0aGlzLnBhbnBvdCAqIE1hdGguUEkgLyAyKSxcclxuICAgICAgMCxcclxuICAgICAgTWF0aC5jb3ModGhpcy5wYW5wb3QgKiBNYXRoLlBJIC8gMilcclxuICAgIClcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gQXR0YWNrLCBEZWNheSwgU3VzdGFpblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGNvbnN0IG5vdyA9IHRoaXMuY3R4LmN1cnJlbnRUaW1lXHJcbiAgICBjb25zdCB2b2xBdHRhY2tUaW1lID0gbm93ICsgbm90ZUluZm8udm9sQXR0YWNrXHJcbiAgICBjb25zdCBtb2RBdHRhY2tUaW1lID0gbm93ICsgbm90ZUluZm8ubW9kQXR0YWNrXHJcbiAgICBjb25zdCB2b2xEZWNheSA9IHZvbEF0dGFja1RpbWUgKyBub3RlSW5mby52b2xEZWNheVxyXG4gICAgY29uc3QgbW9kRGVjYXkgPSBtb2RBdHRhY2tUaW1lICsgbm90ZUluZm8ubW9kRGVjYXlcclxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5vdGVJbmZvLnN0YXJ0IC8gbm90ZUluZm8uc2FtcGxlUmF0ZVxyXG5cclxuICAgIGNvbnN0IGF0dGFja1ZvbHVtZSA9IHRoaXMudm9sdW1lICogKHRoaXMudmVsb2NpdHkgLyAxMjcpXHJcbiAgICBvdXRwdXRHYWluLnNldFZhbHVlQXRUaW1lKDAsIG5vdylcclxuICAgIG91dHB1dEdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoYXR0YWNrVm9sdW1lLCB2b2xBdHRhY2tUaW1lKVxyXG4gICAgb3V0cHV0R2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShhdHRhY2tWb2x1bWUgKiAoMSAtIG5vdGVJbmZvLnZvbFN1c3RhaW4pLCB2b2xEZWNheSlcclxuXHJcbiAgICBmaWx0ZXIuUS5zZXRWYWx1ZUF0VGltZShub3RlSW5mby5pbml0aWFsRmlsdGVyUSAvIDEwLCBub3cpXHJcbiAgICBjb25zdCBiYXNlRnJlcSA9IGFtb3VudFRvRnJlcShub3RlSW5mby5pbml0aWFsRmlsdGVyRmMpXHJcbiAgICBjb25zdCBwZWVrRnJlcSA9IGFtb3VudFRvRnJlcShub3RlSW5mby5pbml0aWFsRmlsdGVyRmMgKyBub3RlSW5mby5tb2RFbnZUb0ZpbHRlckZjKVxyXG4gICAgY29uc3Qgc3VzdGFpbkZyZXEgPSBiYXNlRnJlcSArIChwZWVrRnJlcSAtIGJhc2VGcmVxKSAqICgxIC0gbm90ZUluZm8ubW9kU3VzdGFpbilcclxuICAgIGZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoYmFzZUZyZXEsIG5vdylcclxuICAgIGZpbHRlci5mcmVxdWVuY3kubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUocGVla0ZyZXEsIG1vZEF0dGFja1RpbWUpXHJcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHN1c3RhaW5GcmVxLCBtb2REZWNheSlcclxuXHJcbiAgICBmdW5jdGlvbiBhbW91bnRUb0ZyZXEodmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gTWF0aC5wb3coMiwgKHZhbCAtIDY5MDApIC8gMTIwMCkgKiA0NDBcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25uZWN0XHJcbiAgICBidWZmZXJTb3VyY2UuY29ubmVjdChmaWx0ZXIpXHJcbiAgICBmaWx0ZXIuY29ubmVjdChwYW5uZXIpXHJcbiAgICBwYW5uZXIuY29ubmVjdChvdXRwdXQpXHJcbiAgICBvdXRwdXQuY29ubmVjdCh0aGlzLmRlc3RpbmF0aW9uKVxyXG5cclxuICAgIC8vIGZpcmVcclxuICAgIGJ1ZmZlclNvdXJjZS5zdGFydCgwLCBzdGFydFRpbWUpXHJcbiAgfVxyXG5cclxuICBub3RlT2ZmKCkge1xyXG4gICAgY29uc3QgeyBub3RlSW5mbywgYnVmZmVyU291cmNlIH0gPSB0aGlzXHJcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmdhaW5PdXRwdXRcclxuICAgIGNvbnN0IG5vdyA9IHRoaXMuY3R4LmN1cnJlbnRUaW1lXHJcbiAgICBjb25zdCB2b2xFbmRUaW1lID0gbm93ICsgbm90ZUluZm8udm9sUmVsZWFzZVxyXG4gICAgY29uc3QgbW9kRW5kVGltZSA9IG5vdyArIG5vdGVJbmZvLm1vZFJlbGVhc2VcclxuXHJcbiAgICBpZiAoIXRoaXMuYXVkaW9CdWZmZXIpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWdub3JlIG5vdGUgb2ZmIGZvciByaHl0aG0gdHJhY2tcclxuICAgIGlmICh0aGlzLmNoYW5uZWwgPT09IDkpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFJlbGVhc2VcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBvdXRwdXQuZ2Fpbi5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoMClcclxuICAgIG91dHB1dC5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIHZvbEVuZFRpbWUpXHJcbiAgICBidWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLmNhbmNlbFNjaGVkdWxlZFZhbHVlcygwKVxyXG4gICAgYnVmZmVyU291cmNlLnBsYXliYWNrUmF0ZS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSh0aGlzLmNvbXB1dGVkUGxheWJhY2tSYXRlLCBtb2RFbmRUaW1lKVxyXG5cclxuICAgIGJ1ZmZlclNvdXJjZS5sb29wID0gZmFsc2VcclxuICAgIGJ1ZmZlclNvdXJjZS5zdG9wKHZvbEVuZFRpbWUpXHJcbiAgfVxyXG5cclxuICBkaXNjb25uZWN0KCkge1xyXG4gICAgdGhpcy5idWZmZXJTb3VyY2UuZGlzY29ubmVjdCgwKVxyXG4gICAgdGhpcy5wYW5uZXIuZGlzY29ubmVjdCgwKVxyXG4gICAgdGhpcy5nYWluT3V0cHV0LmRpc2Nvbm5lY3QoMClcclxuICB9XHJcblxyXG4gIHNjaGVkdWxlUGxheWJhY2tSYXRlKCkge1xyXG4gICAgY29uc3QgeyBub3RlSW5mbyB9ID0gdGhpc1xyXG4gICAgY29uc3QgcGxheWJhY2tSYXRlID0gdGhpcy5idWZmZXJTb3VyY2UucGxheWJhY2tSYXRlXHJcbiAgICBjb25zdCBjb21wdXRlZCA9IHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGVcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGFydFRpbWVcclxuICAgIGNvbnN0IG1vZEF0dGFjayA9IHN0YXJ0ICsgbm90ZUluZm8ubW9kQXR0YWNrXHJcbiAgICBjb25zdCBtb2REZWNheSA9IG1vZEF0dGFjayArIG5vdGVJbmZvLm1vZERlY2F5XHJcbiAgICBjb25zdCBwZWVrUGl0Y2ggPSBjb21wdXRlZCAqIE1hdGgucG93KFxyXG4gICAgICBNYXRoLnBvdygyLCAxIC8gMTIpLFxyXG4gICAgICBub3RlSW5mby5tb2RFbnZUb1BpdGNoICogbm90ZUluZm8uc2NhbGVUdW5pbmdcclxuICAgIClcclxuXHJcbiAgICBwbGF5YmFja1JhdGUuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKDApXHJcbiAgICBwbGF5YmFja1JhdGUuc2V0VmFsdWVBdFRpbWUoY29tcHV0ZWQsIHN0YXJ0KVxyXG4gICAgcGxheWJhY2tSYXRlLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHBlZWtQaXRjaCwgbW9kQXR0YWNrKVxyXG4gICAgcGxheWJhY2tSYXRlLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGNvbXB1dGVkICsgKHBlZWtQaXRjaCAtIGNvbXB1dGVkKSAqICgxIC0gbm90ZUluZm8ubW9kU3VzdGFpbiksIG1vZERlY2F5KVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUGl0Y2hCZW5kKHBpdGNoQmVuZDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNvbXB1dGVkUGxheWJhY2tSYXRlID0gdGhpcy5wbGF5YmFja1JhdGUgKiBNYXRoLnBvdyhcclxuICAgICAgTWF0aC5wb3coMiwgMSAvIDEyKSxcclxuICAgICAgKFxyXG4gICAgICAgIHRoaXMucGl0Y2hCZW5kU2Vuc2l0aXZpdHkgKiAoXHJcbiAgICAgICAgICBwaXRjaEJlbmQgLyAocGl0Y2hCZW5kIDwgMCA/IDgxOTIgOiA4MTkxKVxyXG4gICAgICAgIClcclxuICAgICAgKSAqIHRoaXMubm90ZUluZm8uc2NhbGVUdW5pbmdcclxuICAgIClcclxuICAgIHRoaXMuc2NoZWR1bGVQbGF5YmFja1JhdGUoKVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3ludGhlc2l6ZXJOb3RlLnRzIiwiaW1wb3J0IHsgUGFyc2VSZXN1bHQgfSBmcm9tIFwiLi9QYXJzZXJcIlxyXG5pbXBvcnQgeyBSYW5nZVZhbHVlLCBHZW5lcmF0b3JMaXN0IH0gZnJvbSBcIi4vU3RydWN0c1wiXHJcblxyXG4vKipcclxuICogUGFyc2VyIOOBp+iqreOBv+i+vOOCk+OBoOOCteOCpuODs+ODieODleOCqeODs+ODiOOBruODh+ODvOOCv+OCklxyXG4gKiBTeW50aGVzaXplciDjgYvjgonliKnnlKjjgZfjgoTjgZnjgYTlvaLjgavjgZnjgovjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdW5kRm9udCB7XHJcbiAgcHJpdmF0ZSBwYXJzZWQ6IFBhcnNlUmVzdWx0XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBhcnNlZDogUGFyc2VSZXN1bHQpIHtcclxuICAgIHRoaXMucGFyc2VkID0gcGFyc2VkXHJcbiAgfVxyXG5cclxuICBnZXRQcmVzZXRab25lKHByZXNldEhlYWRlckluZGV4OiBudW1iZXIpIHtcclxuICAgIGxldCBwcmVzZXRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W11cclxuICAgIGNvbnN0IHByZXNldEhlYWRlciA9IHRoaXMucGFyc2VkLnByZXNldEhlYWRlcnNbcHJlc2V0SGVhZGVySW5kZXhdXHJcbiAgICBjb25zdCBwcmVzZXRCYWcgPSB0aGlzLnBhcnNlZC5wcmVzZXRab25lW3ByZXNldEhlYWRlci5wcmVzZXRCYWdJbmRleF1cclxuXHJcbiAgICBjb25zdCBuZXh0UHJlc2V0SGVhZGVySW5kZXggPSBwcmVzZXRIZWFkZXJJbmRleCArIDFcclxuICAgIGlmIChuZXh0UHJlc2V0SGVhZGVySW5kZXggPCB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzLmxlbmd0aCkge1xyXG4gICAgICAvLyDmrKHjga4gcHJlc2V0IOOBvuOBp+OBruOBmeOBueOBpuOBriBnZW5lcmF0b3Ig44KS5Y+W5b6X44GZ44KLXHJcbiAgICAgIGNvbnN0IG5leHRQcmVzZXRIZWFkZXIgPSB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzW25leHRQcmVzZXRIZWFkZXJJbmRleF1cclxuICAgICAgY29uc3QgbmV4dFByZXNldEJhZyA9IHRoaXMucGFyc2VkLnByZXNldFpvbmVbbmV4dFByZXNldEhlYWRlci5wcmVzZXRCYWdJbmRleF1cclxuICAgICAgcHJlc2V0R2VuZXJhdG9ycyA9IHRoaXMucGFyc2VkLnByZXNldEdlbmVyYXRvcnMuc2xpY2UocHJlc2V0QmFnLnByZXNldEdlbmVyYXRvckluZGV4LCBuZXh0UHJlc2V0QmFnLnByZXNldEdlbmVyYXRvckluZGV4KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8g5pyA5b6M44GuIHByZXNldCDjgaDjgaPjgZ/loLTlkIjjga/mnIDlvozjgb7jgaflj5blvpfjgZnjgotcclxuICAgICAgcHJlc2V0R2VuZXJhdG9ycyA9IHRoaXMucGFyc2VkLnByZXNldEdlbmVyYXRvcnMuc2xpY2UocHJlc2V0QmFnLnByZXNldEdlbmVyYXRvckluZGV4LCB0aGlzLnBhcnNlZC5wcmVzZXRHZW5lcmF0b3JzLmxlbmd0aClcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJlc2V0R2VuZXJhdG9yc1xyXG4gIH1cclxuXHJcbiAgZ2V0SW5zdHJ1bWVudFpvbmUoaW5zdHJ1bWVudFpvbmVJbmRleDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBpbnN0cnVtZW50QmFnID0gdGhpcy5wYXJzZWQuaW5zdHJ1bWVudFpvbmVbaW5zdHJ1bWVudFpvbmVJbmRleF1cclxuICAgIGNvbnN0IG5leHRJbnN0cnVtZW50QmFnID0gdGhpcy5wYXJzZWQuaW5zdHJ1bWVudFpvbmVbaW5zdHJ1bWVudFpvbmVJbmRleCArIDFdXHJcbiAgICBjb25zdCBnZW5lcmF0b3JJbmRleCA9IGluc3RydW1lbnRCYWcuaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4XHJcbiAgICBjb25zdCBuZXh0R2VuZXJhdG9ySW5kZXggPSBuZXh0SW5zdHJ1bWVudEJhZyA/IG5leHRJbnN0cnVtZW50QmFnLmluc3RydW1lbnRHZW5lcmF0b3JJbmRleCA6IHRoaXMucGFyc2VkLmluc3RydW1lbnRHZW5lcmF0b3JzLmxlbmd0aFxyXG4gICAgY29uc3QgZ2VuZXJhdG9ycyA9IHRoaXMucGFyc2VkLmluc3RydW1lbnRHZW5lcmF0b3JzLnNsaWNlKGdlbmVyYXRvckluZGV4LCBuZXh0R2VuZXJhdG9ySW5kZXgpXHJcbiAgICByZXR1cm4gY3JlYXRlSW5zdHJ1bWVudFpvbmUoZ2VuZXJhdG9ycylcclxuICB9XHJcblxyXG4gIGdldEluc3RydW1lbnRab25lSW5kZXhlcyhpbnN0cnVtZW50SUQ6IG51bWJlcik6IG51bWJlcltdIHtcclxuICAgIGNvbnN0IGluc3RydW1lbnQgPSB0aGlzLnBhcnNlZC5pbnN0cnVtZW50c1tpbnN0cnVtZW50SURdXHJcbiAgICBjb25zdCBuZXh0SW5zdHJ1bWVudCA9IHRoaXMucGFyc2VkLmluc3RydW1lbnRzW2luc3RydW1lbnRJRCArIDFdXHJcbiAgICByZXR1cm4gYXJyYXlSYW5nZShpbnN0cnVtZW50Lmluc3RydW1lbnRCYWdJbmRleCwgbmV4dEluc3RydW1lbnQgPyBuZXh0SW5zdHJ1bWVudC5pbnN0cnVtZW50QmFnSW5kZXggOiB0aGlzLnBhcnNlZC5pbnN0cnVtZW50Wm9uZS5sZW5ndGgpXHJcbiAgfVxyXG5cclxuICBnZXRJbnN0cnVtZW50S2V5KGJhbmtOdW1iZXIsIGluc3RydW1lbnROdW1iZXIsIGtleSwgdmVsb2NpdHkgPSAxMDApOiBOb3RlSW5mb3xudWxsIHtcclxuICAgIGNvbnN0IHByZXNldEhlYWRlckluZGV4ID0gdGhpcy5wYXJzZWQucHJlc2V0SGVhZGVycy5maW5kSW5kZXgocCA9PiBwLnByZXNldCA9PT0gaW5zdHJ1bWVudE51bWJlciAmJiBwLmJhbmsgPT09IGJhbmtOdW1iZXIpXHJcbiAgICBcclxuICAgIGlmIChwcmVzZXRIZWFkZXJJbmRleCA8IDApIHtcclxuICAgICAgY29uc29sZS53YXJuKFwicHJlc2V0IG5vdCBmb3VuZDogYmFuaz0lcyBpbnN0cnVtZW50PSVzXCIsIGJhbmtOdW1iZXIsIGluc3RydW1lbnROdW1iZXIpXHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJlc2V0R2VuZXJhdG9ycyA9IHRoaXMuZ2V0UHJlc2V0Wm9uZShwcmVzZXRIZWFkZXJJbmRleClcclxuXHJcbiAgICAvLyBMYXN0IFByZXNldCBHZW5lcmF0b3IgbXVzdCBiZSBpbnN0cnVtZW50XHJcbiAgICBjb25zdCBsYXN0UHJlc2V0R2VuZXJ0b3IgPSBwcmVzZXRHZW5lcmF0b3JzW3ByZXNldEdlbmVyYXRvcnMubGVuZ3RoIC0gMV1cclxuICAgIGlmIChsYXN0UHJlc2V0R2VuZXJ0b3IudHlwZSAhPT0gXCJpbnN0cnVtZW50XCIgfHwgTnVtYmVyKGxhc3RQcmVzZXRHZW5lcnRvci52YWx1ZSkgPT09IE5hTikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNvdW5kRm9udDogaW52YWxpZCBwcmVzZXQgZ2VuZXJhdG9yOiBleHBlY3QgaW5zdHJ1bWVudFwiKVxyXG4gICAgfVxyXG4gICAgY29uc3QgaW5zdHJ1bWVudElEID0gbGFzdFByZXNldEdlbmVydG9yLnZhbHVlIGFzIG51bWJlclxyXG4gICAgY29uc3QgaW5zdHJ1bWVudFpvbmVzID0gdGhpcy5nZXRJbnN0cnVtZW50Wm9uZUluZGV4ZXMoaW5zdHJ1bWVudElEKS5tYXAoaSA9PiB0aGlzLmdldEluc3RydW1lbnRab25lKGkpKVxyXG5cclxuICAgIC8vIOacgOWIneOBruOCvuODvOODs+OBjHNhbXBsZUlEIOOCkuaMgeOBn+OBquOBkeOCjOOBsCBnbG9iYWwgaW5zdHJ1bWVudCB6b25lXHJcbiAgICBsZXQgZ2xvYmFsSW5zdHJ1bWVudFpvbmU6IGFueXx1bmRlZmluZWRcclxuICAgIGNvbnN0IGZpcnN0SW5zdHJ1bWVudFpvbmUgPSBpbnN0cnVtZW50Wm9uZXNbMF1cclxuICAgIGlmIChmaXJzdEluc3RydW1lbnRab25lLnNhbXBsZUlEID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgZ2xvYmFsSW5zdHJ1bWVudFpvbmUgPSBpbnN0cnVtZW50Wm9uZXNbMF1cclxuICAgIH1cclxuXHJcbiAgICAvLyBrZXlSYW5nZSDjgaggdmVsUmFuZ2Ug44GM44Oe44OD44OB44GX44Gm44GE44KLIEdlbmVyYXRvciDjgpLmjqLjgZlcclxuICAgIGNvbnN0IGluc3RydW1lbnRab25lID0gaW5zdHJ1bWVudFpvbmVzLmZpbmQoaSA9PiB7XHJcbiAgICAgIGlmIChpID09PSBnbG9iYWxJbnN0cnVtZW50Wm9uZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZSAvLyBnbG9iYWwgem9uZSDjgpLpmaTlpJZcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGlzSW5LZXlSYW5nZSA9IGZhbHNlXHJcbiAgICAgIGlmIChpLmtleVJhbmdlKSB7XHJcbiAgICAgICAgaXNJbktleVJhbmdlID0ga2V5ID49IGkua2V5UmFuZ2UubG8gJiYga2V5IDw9IGkua2V5UmFuZ2UuaGlcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGlzSW5WZWxSYW5nZSA9IHRydWVcclxuICAgICAgaWYgKGkudmVsUmFuZ2UpIHtcclxuICAgICAgICBpc0luVmVsUmFuZ2UgPSB2ZWxvY2l0eSA+PSBpLnZlbFJhbmdlLmxvICYmIHZlbG9jaXR5IDw9IGkudmVsUmFuZ2UuaGlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGlzSW5LZXlSYW5nZSAmJiBpc0luVmVsUmFuZ2VcclxuICAgIH0pXHJcbiAgICBcclxuICAgIGlmICghaW5zdHJ1bWVudFpvbmUpIHtcclxuICAgICAgY29uc29sZS53YXJuKFwiaW5zdHJ1bWVudCBub3QgZm91bmQ6IGJhbms9JXMgaW5zdHJ1bWVudD0lc1wiLCBiYW5rTnVtYmVyLCBpbnN0cnVtZW50TnVtYmVyKVxyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpbnN0cnVtZW50Wm9uZS5zYW1wbGVJRCA9PT0gdW5kZWZpbmVkKSB7IFxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNvdW5kRm9udDogc2FtcGxlSUQgbm90IGZvdW5kXCIpXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0IGdlbiA9IHsuLi5kZWZhdWx0SW5zdHJ1bWVudFpvbmUsIC4uLnJlbW92ZVVuZGVmaW5lZChnbG9iYWxJbnN0cnVtZW50Wm9uZSB8fCB7fSksIC4uLnJlbW92ZVVuZGVmaW5lZChpbnN0cnVtZW50Wm9uZSl9XHJcblxyXG4gICAgY29uc3Qgc2FtcGxlID0gdGhpcy5wYXJzZWQuc2FtcGxlc1tnZW4uc2FtcGxlSUQhXVxyXG4gICAgY29uc3Qgc2FtcGxlSGVhZGVyID0gdGhpcy5wYXJzZWQuc2FtcGxlSGVhZGVyc1tnZW4uc2FtcGxlSUQhXVxyXG4gICAgY29uc3QgdHVuZSA9IGdlbi5jb2Fyc2VUdW5lICsgZ2VuLmZpbmVUdW5lIC8gMTAwXHJcbiAgICBjb25zdCBiYXNlUGl0Y2ggPSB0dW5lICsgKHNhbXBsZUhlYWRlci5waXRjaENvcnJlY3Rpb24gLyAxMDApIC0gKGdlbi5vdmVycmlkaW5nUm9vdEtleSB8fCBzYW1wbGVIZWFkZXIub3JpZ2luYWxQaXRjaClcclxuICAgIGNvbnN0IHNjYWxlVHVuaW5nID0gZ2VuLnNjYWxlVHVuaW5nIC8gMTAwXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2FtcGxlLFxyXG4gICAgICBzYW1wbGVSYXRlOiBzYW1wbGVIZWFkZXIuc2FtcGxlUmF0ZSxcclxuICAgICAgc2FtcGxlTmFtZTogc2FtcGxlSGVhZGVyLnNhbXBsZU5hbWUsXHJcbiAgICAgIHNjYWxlVHVuaW5nLFxyXG4gICAgICBwbGF5YmFja1JhdGU6IChrZXkpID0+IE1hdGgucG93KE1hdGgucG93KDIsIDEgLyAxMiksIChrZXkgKyBiYXNlUGl0Y2gpICogc2NhbGVUdW5pbmcpLFxyXG4gICAgICBrZXlSYW5nZTogZ2VuLmtleVJhbmdlLFxyXG4gICAgICB2ZWxSYW5nZTogZ2VuLnZlbFJhbmdlLFxyXG4gICAgICB2b2xBdHRhY2s6IGNvbnZlcnRUaW1lKGdlbi52b2xBdHRhY2spLFxyXG4gICAgICB2b2xEZWNheTogY29udmVydFRpbWUoZ2VuLnZvbERlY2F5KSxcclxuICAgICAgdm9sU3VzdGFpbjogTWF0aC5wb3coMTAsIGdlbi52b2xTdXN0YWluIC8gMTAgLyAyMCksXHJcbiAgICAgIHZvbFJlbGVhc2U6IGNvbnZlcnRUaW1lKGdlbi52b2xSZWxlYXNlKSxcclxuICAgICAgbW9kQXR0YWNrOiBjb252ZXJ0VGltZShnZW4ubW9kQXR0YWNrKSxcclxuICAgICAgbW9kRGVjYXk6IGNvbnZlcnRUaW1lKGdlbi5tb2REZWNheSksXHJcbiAgICAgIG1vZFN1c3RhaW46IGdlbi5tb2RTdXN0YWluIC8gMTAwMCxcclxuICAgICAgbW9kUmVsZWFzZTogY29udmVydFRpbWUoZ2VuLm1vZFJlbGVhc2UpLFxyXG4gICAgICBtb2RFbnZUb1BpdGNoOiBnZW4ubW9kRW52VG9QaXRjaCAvIDEwMCwgLy8gY2VudFxyXG4gICAgICBtb2RFbnZUb0ZpbHRlckZjOiBnZW4ubW9kRW52VG9GaWx0ZXJGYywgLy8gc2VtaXRvbmUgKDEwMCBjZW50KVxyXG4gICAgICBpbml0aWFsRmlsdGVyUTogZ2VuLmluaXRpYWxGaWx0ZXJRLFxyXG4gICAgICBpbml0aWFsRmlsdGVyRmM6IGdlbi5pbml0aWFsRmlsdGVyRmMsXHJcbiAgICAgIGZyZXFWaWJMRk86IGdlbi5mcmVxVmliTEZPID8gY29udmVydFRpbWUoZ2VuLmZyZXFWaWJMRk8pICogOC4xNzYgOiB1bmRlZmluZWQsXHJcbiAgICAgIHN0YXJ0OiBnZW4uc3RhcnRBZGRyc0NvYXJzZU9mZnNldCAqIDMyNzY4ICsgZ2VuLnN0YXJ0QWRkcnNPZmZzZXQsXHJcbiAgICAgIGVuZDogZ2VuLmVuZEFkZHJzQ29hcnNlT2Zmc2V0ICogMzI3NjggKyBnZW4uZW5kQWRkcnNPZmZzZXQsXHJcbiAgICAgIGxvb3BTdGFydDogKFxyXG4gICAgICAgIHNhbXBsZUhlYWRlci5sb29wU3RhcnQgK1xyXG4gICAgICAgIGdlbi5zdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldCAqIDMyNzY4ICtcclxuICAgICAgICBnZW4uc3RhcnRsb29wQWRkcnNPZmZzZXRcclxuICAgICAgKSxcclxuICAgICAgbG9vcEVuZDogKFxyXG4gICAgICAgIHNhbXBsZUhlYWRlci5sb29wRW5kICtcclxuICAgICAgICBnZW4uZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0ICogMzI3NjggK1xyXG4gICAgICAgIGdlbi5lbmRsb29wQWRkcnNPZmZzZXRcclxuICAgICAgKSxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHByZXNldE5hbWVzW2JhbmtOdW1iZXJdW3ByZXNldE51bWJlcl0gPSBwcmVzZXROYW1lXHJcbiAgZ2V0UHJlc2V0TmFtZXMoKSB7XHJcbiAgICBjb25zdCBiYW5rOiB7W2luZGV4OiBudW1iZXJdOiB7W2luZGV4OiBudW1iZXJdOiBzdHJpbmd9fSA9IHt9XHJcbiAgICB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzLmZvckVhY2gocHJlc2V0ID0+IHtcclxuICAgICAgaWYgKCFiYW5rW3ByZXNldC5iYW5rXSkge1xyXG4gICAgICAgIGJhbmtbcHJlc2V0LmJhbmtdID0ge31cclxuICAgICAgfVxyXG4gICAgICBiYW5rW3ByZXNldC5iYW5rXVtwcmVzZXQucHJlc2V0XSA9IHByZXNldC5wcmVzZXROYW1lXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGJhbmtcclxuICB9XHJcbn1cclxuXHJcbi8vIHZhbHVlID0gMTIwMGxvZzIoc2VjKSDjgafooajjgZXjgozjgovmmYLplpPjgpLnp5LljZjkvY3jgavlpInmj5vjgZnjgotcclxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUaW1lKHZhbHVlKSB7XHJcbiAgcmV0dXJuIE1hdGgucG93KDIsIHZhbHVlIC8gMTIwMClcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlVW5kZWZpbmVkKG9iaikge1xyXG4gIGNvbnN0IHJlc3VsdCA9IHt9XHJcbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICBpZiAob2JqW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldXHJcbiAgICB9XHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFycmF5UmFuZ2Uoc3RhcnQsIGVuZCkge1xyXG4gIHJldHVybiBBcnJheS5mcm9tKHtsZW5ndGg6IGVuZCAtIHN0YXJ0fSwgKF8sIGspID0+IGsgKyBzdGFydCk7XHJcbn1cclxuXHJcbi8vIOOBsuOBqOOBpOOBriBpbnN0cnVtZW50IOOBq+WvvuW/nOOBmeOCiyBHZW5lcmF0b3Ig44Gu6YWN5YiX44GL44KJ5L2/44GE44KE44GZ44GP44GX44Gf44Kq44OW44K444Kn44Kv44OI44KS6L+U44GZXHJcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRab25lKGluc3RydW1lbnRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W10pIHtcclxuICBmdW5jdGlvbiBnZXRWYWx1ZSh0eXBlOiBzdHJpbmcpOiBudW1iZXJ8dW5kZWZpbmVkIHtcclxuICAgIGNvbnN0IGdlbmVyYXRvciA9IGluc3RydW1lbnRHZW5lcmF0b3JzLmZpbmQoZyA9PiBnLnR5cGUgPT09IHR5cGUpXHJcbiAgICBpZiAoIWdlbmVyYXRvcikge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICB9XHJcbiAgICBpZiAoTnVtYmVyKGdlbmVyYXRvci52YWx1ZSkgPT09IE5hTikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzb21ldGhpbmcgd3JvbmdcIilcclxuICAgIH1cclxuICAgIHJldHVybiBnZW5lcmF0b3IudmFsdWUgYXMgbnVtYmVyXHJcbiAgfVxyXG4gIFxyXG4gIC8vIEZpcnN0IEluc3RydW1lbnQgR2VuZXJhdG9yIG11c3QgYmUga2V5UmFuZ2VcclxuICBjb25zdCBmaXJzdEluc3RydW1lbnRHZW5lcmF0b3IgPSBpbnN0cnVtZW50R2VuZXJhdG9yc1swXVxyXG4gIGxldCBrZXlSYW5nZTogUmFuZ2VWYWx1ZXx1bmRlZmluZWRcclxuICBpZiAoZmlyc3RJbnN0cnVtZW50R2VuZXJhdG9yICYmIGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvci50eXBlID09PSBcImtleVJhbmdlXCIpIHtcclxuICAgIGlmICghKGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSBpbnN0YW5jZW9mIFJhbmdlVmFsdWUpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiBrZXlSYW5nZSBpcyBub3QgcmFuZ2VkIHZhbHVlXCIpXHJcbiAgICB9XHJcbiAgICBrZXlSYW5nZSA9IGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSBhcyBSYW5nZVZhbHVlXHJcbiAgfVxyXG5cclxuICAvLyBTZWNvbmQgSW5zdHJ1bWVudCBHZW5lcmF0b3IgY291bGQgYmUgdmVsUmFuZ2VcclxuICBjb25zdCBzZWNvbmRJbnN0cnVtZW50R2VuZXJhdG9yID0gaW5zdHJ1bWVudEdlbmVyYXRvcnNbMV1cclxuICBsZXQgdmVsUmFuZ2U6IFJhbmdlVmFsdWV8dW5kZWZpbmVkXHJcbiAgaWYgKHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IgJiYgc2Vjb25kSW5zdHJ1bWVudEdlbmVyYXRvci50eXBlID09PSBcInZlbFJhbmdlXCIpIHtcclxuICAgIGlmICghKHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUgaW5zdGFuY2VvZiBSYW5nZVZhbHVlKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNvdW5kRm9udDogdmVsUmFuZ2UgaXMgbm90IHJhbmdlZCB2YWx1ZVwiKVxyXG4gICAgfVxyXG4gICAgdmVsUmFuZ2UgPSBzZWNvbmRJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGFzIFJhbmdlVmFsdWVcclxuICB9XHJcblxyXG4gIC8vIExhc3QgSW5zdHJ1bWVudCBHZW5lcmF0b3IgbXVzdCBiZSBzYW1wbGVJRFxyXG4gIGNvbnN0IGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yID0gaW5zdHJ1bWVudEdlbmVyYXRvcnNbaW5zdHJ1bWVudEdlbmVyYXRvcnMubGVuZ3RoIC0gMV1cclxuICBsZXQgc2FtcGxlSUQ6IG51bWJlcnx1bmRlZmluZWRcclxuICBpZiAobGFzdEluc3RydW1lbnRHZW5lcmF0b3IgJiYgbGFzdEluc3RydW1lbnRHZW5lcmF0b3IudHlwZSA9PT0gXCJzYW1wbGVJRFwiKSB7XHJcbiAgICBpZiAoTnVtYmVyKGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlKSA9PT0gTmFOKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgU291bmRGb250OiBzYW1wbGVJRCBpcyBub3QgbnVtYmVyXCIpXHJcbiAgICB9XHJcbiAgICBzYW1wbGVJRCA9IGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGFzIG51bWJlclxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGtleVJhbmdlLCAvLyDjgYLjgovjga/jgZrjgaDjgYwgZ2xvYmFsIHpvbmUg44Gr44Gv54Sh44GE44GL44KC44GX44KM44Gq44GEXHJcbiAgICB2ZWxSYW5nZSwgLy8gb3B0aW9uYWxcclxuICAgIHNhbXBsZUlELCAvLyBnbG9iYWwgem9uZSDjga7loLTlkIjjgaDjgZHjgarjgYRcclxuICAgIHZvbEF0dGFjazogZ2V0VmFsdWUoXCJhdHRhY2tWb2xFbnZcIiksXHJcbiAgICB2b2xEZWNheTogZ2V0VmFsdWUoXCJkZWNheVZvbEVudlwiKSxcclxuICAgIHZvbFN1c3RhaW46IGdldFZhbHVlKFwic3VzdGFpblZvbEVudlwiKSwgLy8gMTBkQlxyXG4gICAgdm9sUmVsZWFzZTogZ2V0VmFsdWUoXCJyZWxlYXNlVm9sRW52XCIpLFxyXG4gICAgbW9kQXR0YWNrOiBnZXRWYWx1ZShcImF0dGFja01vZEVudlwiKSxcclxuICAgIG1vZERlY2F5OiBnZXRWYWx1ZShcImRlY2F5TW9kRW52XCIpLFxyXG4gICAgbW9kU3VzdGFpbjogZ2V0VmFsdWUoXCJzdXN0YWluTW9kRW52XCIpLFxyXG4gICAgbW9kUmVsZWFzZTogZ2V0VmFsdWUoXCJyZWxlYXNlTW9kRW52XCIpLFxyXG4gICAgbW9kRW52VG9QaXRjaDogZ2V0VmFsdWUoXCJtb2RFbnZUb1BpdGNoXCIpLFxyXG4gICAgbW9kRW52VG9GaWx0ZXJGYzogZ2V0VmFsdWUoXCJtb2RFbnZUb0ZpbHRlckZjXCIpLFxyXG4gICAgY29hcnNlVHVuZTogZ2V0VmFsdWUoXCJjb2Fyc2VUdW5lXCIpLFxyXG4gICAgZmluZVR1bmU6IGdldFZhbHVlKFwiZmluZVR1bmVcIiksXHJcbiAgICBzY2FsZVR1bmluZzogZ2V0VmFsdWUoXCJzY2FsZVR1bmluZ1wiKSxcclxuICAgIGZyZXFWaWJMRk86IGdldFZhbHVlKFwiZnJlcVZpYkxGT1wiKSxcclxuICAgIHN0YXJ0QWRkcnNPZmZzZXQ6IGdldFZhbHVlKFwic3RhcnRBZGRyc09mZnNldFwiKSxcclxuICAgIHN0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQ6IGdldFZhbHVlKFwic3RhcnRBZGRyc0NvYXJzZU9mZnNldFwiKSxcclxuICAgIGVuZEFkZHJzT2Zmc2V0OiBnZXRWYWx1ZShcImVuZEFkZHJzT2Zmc2V0XCIpLFxyXG4gICAgZW5kQWRkcnNDb2Fyc2VPZmZzZXQ6IGdldFZhbHVlKFwiZW5kQWRkcnNDb2Fyc2VPZmZzZXRcIiksXHJcbiAgICBzdGFydGxvb3BBZGRyc09mZnNldDogZ2V0VmFsdWUoXCJzdGFydGxvb3BBZGRyc09mZnNldFwiKSxcclxuICAgIHN0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0OiBnZXRWYWx1ZShcInN0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0XCIpLFxyXG4gICAgZW5kbG9vcEFkZHJzT2Zmc2V0OiBnZXRWYWx1ZShcImVuZGxvb3BBZGRyc09mZnNldFwiKSxcclxuICAgIGVuZGxvb3BBZGRyc0NvYXJzZU9mZnNldDogZ2V0VmFsdWUoXCJlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXRcIiksXHJcbiAgICBvdmVycmlkaW5nUm9vdEtleTogZ2V0VmFsdWUoXCJvdmVycmlkaW5nUm9vdEtleVwiKSxcclxuICAgIGluaXRpYWxGaWx0ZXJROiBnZXRWYWx1ZShcImluaXRpYWxGaWx0ZXJRXCIpLFxyXG4gICAgaW5pdGlhbEZpbHRlckZjOiBnZXRWYWx1ZShcImluaXRpYWxGaWx0ZXJGY1wiKSxcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRJbnN0cnVtZW50Wm9uZSA9IHtcclxuICBrZXlSYW5nZTogbmV3IFJhbmdlVmFsdWUoMCwgMTI3KSxcclxuICB2ZWxSYW5nZTogbmV3IFJhbmdlVmFsdWUoMCwgMTI3KSxcclxuICBzYW1wbGVJRDogdW5kZWZpbmVkLFxyXG4gIHZvbEF0dGFjazogLTEyMDAwLFxyXG4gIHZvbERlY2F5OiAtMTIwMDAsXHJcbiAgdm9sU3VzdGFpbjogMCxcclxuICB2b2xSZWxlYXNlOiAtMTIwMDAsXHJcbiAgbW9kQXR0YWNrOiAtMTIwMDAsXHJcbiAgbW9kRGVjYXk6IC0xMjAwMCxcclxuICBtb2RTdXN0YWluOiAwLFxyXG4gIG1vZFJlbGVhc2U6IDAsXHJcbiAgbW9kRW52VG9QaXRjaDogMCxcclxuICBtb2RFbnZUb0ZpbHRlckZjOiAwLFxyXG4gIGNvYXJzZVR1bmU6IDAsXHJcbiAgZmluZVR1bmU6IDAsXHJcbiAgc2NhbGVUdW5pbmc6IDEwMCxcclxuICBmcmVxVmliTEZPOiAwLFxyXG4gIHN0YXJ0QWRkcnNPZmZzZXQ6IDAsXHJcbiAgc3RhcnRBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBlbmRBZGRyc09mZnNldDogMCxcclxuICBlbmRBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBzdGFydGxvb3BBZGRyc09mZnNldDogMCxcclxuICBzdGFydGxvb3BBZGRyc0NvYXJzZU9mZnNldDogMCxcclxuICBlbmRsb29wQWRkcnNPZmZzZXQ6IDAsXHJcbiAgZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0OiAwLFxyXG4gIG92ZXJyaWRpbmdSb290S2V5OiB1bmRlZmluZWQsXHJcbiAgaW5pdGlhbEZpbHRlclE6IDEsXHJcbiAgaW5pdGlhbEZpbHRlckZjOiAxMzUwMCxcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOb3RlSW5mbyB7XHJcbiAgc2FtcGxlOiBJbnQxNkFycmF5XHJcbiAgc2FtcGxlUmF0ZTogbnVtYmVyXHJcbiAgc2FtcGxlTmFtZTogc3RyaW5nXHJcbiAgc3RhcnQ6IG51bWJlclxyXG4gIGVuZDogbnVtYmVyXHJcbiAgc2NhbGVUdW5pbmc6IG51bWJlclxyXG4gIHBsYXliYWNrUmF0ZTogRnVuY3Rpb25cclxuICBsb29wU3RhcnQ6IG51bWJlclxyXG4gIGxvb3BFbmQ6IG51bWJlclxyXG4gIHZvbEF0dGFjazogbnVtYmVyXHJcbiAgdm9sRGVjYXk6IG51bWJlclxyXG4gIHZvbFN1c3RhaW46IG51bWJlclxyXG4gIHZvbFJlbGVhc2U6IG51bWJlclxyXG4gIG1vZEF0dGFjazogbnVtYmVyXHJcbiAgbW9kRGVjYXk6IG51bWJlclxyXG4gIG1vZFN1c3RhaW46IG51bWJlclxyXG4gIG1vZFJlbGVhc2U6IG51bWJlclxyXG4gIG1vZEVudlRvUGl0Y2g6IG51bWJlclxyXG4gIG1vZEVudlRvRmlsdGVyRmM6IG51bWJlclxyXG4gIGluaXRpYWxGaWx0ZXJGYzogbnVtYmVyXHJcbiAgaW5pdGlhbEZpbHRlclE6IG51bWJlclxyXG4gIGZyZXFWaWJMRk86IG51bWJlcnx1bmRlZmluZWRcclxuICBrZXlSYW5nZTogUmFuZ2VWYWx1ZVxyXG4gIHZlbFJhbmdlOiBSYW5nZVZhbHVlfHVuZGVmaW5lZFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Tb3VuZEZvbnQudHMiLCJpbXBvcnQgU3ludGhlc2l6ZXIgZnJvbSBcIi4vU3ludGhlc2l6ZXJcIlxyXG5pbXBvcnQgUHJvZ3JhbU5hbWVzIGZyb20gXCIuL1Byb2dyYW1OYW1lc1wiXHJcblxyXG5mdW5jdGlvbiByZW5kZXIoc3RyOiBzdHJpbmcpOiBFbGVtZW50IHtcclxuICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gIHdyYXBwZXIuaW5uZXJIVE1MID0gc3RyLnJlcGxhY2UoL15cXHMrLywgXCJcIilcclxuICByZXR1cm4gd3JhcHBlci5maXJzdEVsZW1lbnRDaGlsZCFcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyS2V5cygpOiBzdHJpbmcge1xyXG4gIGxldCBodG1sID0gXCJcIlxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTI4OyBpKyspIHtcclxuICAgIGNvbnN0IG4gPSBpICUgMTJcclxuICAgIGNvbnN0IGlzQmxhY2sgPSBbMSwgMywgNiwgOCwgMTBdLmluY2x1ZGVzKG4pXHJcbiAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwia2V5ICR7aXNCbGFjayA/IFwiYmxhY2tcIiA6IFwid2hpdGVcIn1cIj48L2Rpdj5gXHJcbiAgfVxyXG4gIHJldHVybiBodG1sXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlclByb2dyYW1PcHRpb25zKHByb2dyYW1OYW1lczogeyBbaW5kZXg6IG51bWJlcl06IHN0cmluZ1tdIH0sIGJhbms6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgbGV0IGh0bWwgPSBcIlwiXHJcbiAgY29uc3QgbmFtZXMgPSBwcm9ncmFtTmFtZXNbYmFua11cclxuICBmb3IgKGxldCBpIGluIG5hbWVzKSB7XHJcbiAgICBjb25zdCBuYW1lID0gbmFtZXNbaV1cclxuICAgIGh0bWwgKz0gYDxvcHRpb24gdmFsdWU9XCIke2l9XCI+JHtpfTogJHtuYW1lfTwvb3B0aW9uPmBcclxuICB9XHJcbiAgcmV0dXJuIGA8c2VsZWN0PiR7aHRtbH08L3NlbGVjdD5gXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckluc3RydW1lbnQocHJvZ3JhbSk6IEVsZW1lbnQge1xyXG4gIHJldHVybiByZW5kZXIoYFxyXG4gICAgPGRpdiBjbGFzcz1cImluc3RydW1lbnRcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyYW1cIj4ke3Byb2dyYW19PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJ2b2x1bWVcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBhbnBvdFwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGl0Y2hCZW5kXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwaXRjaEJlbmRTZW5zaXRpdml0eVwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwia2V5c1wiPiR7cmVuZGVyS2V5cygpfTwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgYClcclxufVxyXG5cclxuZnVuY3Rpb24gb2JqZWN0TWFwKG8sIGZ1bmMpIHtcclxuICBjb25zdCByZXN1bHQgPSB7fVxyXG4gIE9iamVjdC5rZXlzKG8pLmZvckVhY2goa2V5ID0+IHtcclxuICAgIHJlc3VsdFtrZXldID0gZnVuYyhvW2tleV0pXHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByb2dyYW1OYW1lc0Zyb21CYW5rU2V0KGJhbmtTZXQpIHtcclxuICByZXR1cm4gb2JqZWN0TWFwKGJhbmtTZXQsIGJhbmsgPT4gb2JqZWN0TWFwKGJhbmssIHMgPT4gcy5uYW1lKSlcclxufVxyXG5cclxuZnVuY3Rpb24gbWVyZ2VQcm9ncmFtTmFtZXMobGVmdDoge1tpbmRleDogbnVtYmVyXTogc3RyaW5nW119LCByaWdodDoge1tpbmRleDogbnVtYmVyXTogc3RyaW5nW119KSB7XHJcbiAgZnVuY3Rpb24gbWVyZ2VkS2V5cyhhLCBiKSB7XHJcbiAgICByZXR1cm4gbmV3IFNldChbLi4uT2JqZWN0LmtleXMoYSksIC4uLk9iamVjdC5rZXlzKGIpXSlcclxuICB9XHJcbiAgY29uc3QgYmFua3MgPSBtZXJnZWRLZXlzKGxlZnQsIHJpZ2h0KVxyXG4gIGNvbnN0IHJlc3VsdCA9IHt9XHJcbiAgYmFua3MuZm9yRWFjaChiYW5rID0+IHtcclxuICAgIGNvbnN0IGwgPSBsZWZ0W2JhbmtdIHx8IFtdXHJcbiAgICBjb25zdCByID0gcmlnaHRbYmFua10gfHwgW11cclxuICAgIGNvbnN0IGxpc3Q6IHsgW2luZGV4OiBudW1iZXJdOiBzdHJpbmd9ID0ge31cclxuICAgIGNvbnN0IHByb2dyYW1zID0gbWVyZ2VkS2V5cyhsLCByKVxyXG4gICAgcHJvZ3JhbXMuZm9yRWFjaChwID0+IHtcclxuICAgICAgbGlzdFtwXSA9IGAke2xbcF0gfHwgXCJOb25lXCJ9ICgke3JbcF0gfHwgXCJOb25lXCJ9KWBcclxuICAgIH0pXHJcbiAgICByZXN1bHRbYmFua10gPSBsaXN0XHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xyXG4gIHByaXZhdGUgZWxlbWVudDogRWxlbWVudHxudWxsXHJcbiAgcHJpdmF0ZSBkcmFnOiBib29sZWFuID0gZmFsc2VcclxuXHJcbiAgZHJhdyhzeW50aDogU3ludGhlc2l6ZXIpOiBFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQgPSByZW5kZXIoYDxkaXYgLz5gKVxyXG4gICAgY29uc3QgcHJvZ3JhbU5hbWVzID0gbWVyZ2VQcm9ncmFtTmFtZXMocHJvZ3JhbU5hbWVzRnJvbUJhbmtTZXQoc3ludGguc291bmRGb250LmdldFByZXNldE5hbWVzKCkpLCBQcm9ncmFtTmFtZXMpXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XHJcbiAgICAgIGNvbnN0IGJhbmsgPSBpICE9PSA5ID8gMCA6IDEyOFxyXG4gICAgICBjb25zdCBwcm9ncmFtID0gcmVuZGVyUHJvZ3JhbU9wdGlvbnMocHJvZ3JhbU5hbWVzLCBiYW5rKVxyXG4gICAgICBjb25zdCBpdGVtID0gcmVuZGVySW5zdHJ1bWVudChwcm9ncmFtKVxyXG5cclxuICAgICAgY29uc3QgY2hhbm5lbCA9IGlcclxuICAgICAgY29uc3Qgc2VsZWN0ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKVxyXG4gICAgICBpZiAoc2VsZWN0KSB7XHJcbiAgICAgICAgc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGV2ZW50ID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudFxyXG4gICAgICAgICAgc3ludGgucHJvZ3JhbUNoYW5nZShjaGFubmVsLCBwYXJzZUludCh0YXJnZXQudmFsdWUsIDEwKSlcclxuICAgICAgICB9LCBmYWxzZSlcclxuICAgICAgICBzZWxlY3Quc2VsZWN0ZWRJbmRleCA9IHN5bnRoLmNoYW5uZWxzW2ldLmluc3RydW1lbnRcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgbm90ZXMgPSBpdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoXCIua2V5XCIpXHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTI4OyArK2opIHtcclxuICAgICAgICBjb25zdCBrZXkgPSBqXHJcblxyXG4gICAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+IHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgIHRoaXMuZHJhZyA9IHRydWVcclxuICAgICAgICAgIHN5bnRoLm5vdGVPbihjaGFubmVsLCBrZXksIDEyNylcclxuICAgICAgICB9KVxyXG4gICAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGV2ZW50ID0+IHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgIGlmICh0aGlzLmRyYWcpIHtcclxuICAgICAgICAgICAgc3ludGgubm90ZU9uKGNoYW5uZWwsIGtleSwgMTI3KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbm90ZXNbal0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICBzeW50aC5ub3RlT2ZmKGNoYW5uZWwsIGtleSwgMClcclxuICAgICAgICB9KVxyXG4gICAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICB0aGlzLmRyYWcgPSBmYWxzZVxyXG4gICAgICAgICAgc3ludGgubm90ZU9mZihjaGFubmVsLCBrZXksIDApXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChpdGVtKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbGVtZW50XHJcbiAgfVxyXG5cclxuICByZW1vdmUoKSB7XHJcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxyXG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbFxyXG4gIH1cclxuXHJcbiAgZ2V0SW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbDogbnVtYmVyKTogRWxlbWVudHxudWxsIHtcclxuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaW5zdHJ1bWVudFwiKVtjaGFubmVsXVxyXG4gIH1cclxuXHJcbiAgZ2V0S2V5RWxlbWVudChjaGFubmVsOiBudW1iZXIsIGtleTogbnVtYmVyKTogRWxlbWVudHxudWxsIHtcclxuICAgIGNvbnN0IGVsZW0gPSB0aGlzLmdldEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwpXHJcbiAgICBpZiAoIWVsZW0pIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuICAgIHJldHVybiBlbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoXCIua2V5XCIpW2tleV1cclxuICB9XHJcblxyXG4gIGZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsOiBudW1iZXIsIHF1ZXJ5OiBzdHJpbmcpOiBFbGVtZW50fG51bGwge1xyXG4gICAgY29uc3QgZWxlbSA9IHRoaXMuZ2V0SW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbClcclxuICAgIGlmICghZWxlbSkge1xyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsZW0ucXVlcnlTZWxlY3RvcihxdWVyeSlcclxuICB9XHJcblxyXG4gIG5vdGVPbihjaGFubmVsOiBudW1iZXIsIGtleTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5nZXRLZXlFbGVtZW50KGNoYW5uZWwsIGtleSlcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbm90ZS1vbicpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBub3RlT2ZmKGNoYW5uZWw6IG51bWJlciwga2V5OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmdldEtleUVsZW1lbnQoY2hhbm5lbCwga2V5KVxyXG4gICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdub3RlLW9uJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb2dyYW1DaGFuZ2UoY2hhbm5lbDogbnVtYmVyLCBpbnN0cnVtZW50KSB7XHJcbiAgICBjb25zdCBzZWxlY3QgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi5wcm9ncmFtIHNlbGVjdFwiKSBhcyBIVE1MU2VsZWN0RWxlbWVudHx1bmRlZmluZWRcclxuICAgIGlmIChzZWxlY3QpIHtcclxuICAgICAgc2VsZWN0LnZhbHVlID0gaW5zdHJ1bWVudFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdm9sdW1lQ2hhbmdlKGNoYW5uZWw6IG51bWJlciwgdm9sdW1lKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIudm9sdW1lXCIpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gdm9sdW1lXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwYW5wb3RDaGFuZ2UoY2hhbm5lbDogbnVtYmVyLCBwYW5wb3Q6IHN0cmluZykge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZmluZEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwsIFwiLnBhbnBvdFwiKVxyXG4gICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IHBhbnBvdFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kKGNoYW5uZWw6IG51bWJlciwgY2FsY3VsYXRlZFBpdGNoOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmZpbmRJbnN0cnVtZW50RWxlbWVudChjaGFubmVsLCBcIi5waXRjaEJlbmRcIilcclxuICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBjYWxjdWxhdGVkUGl0Y2hcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWw6IG51bWJlciwgc2Vuc2l0aXZpdHk6IHN0cmluZykge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZmluZEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwsIFwiLnBpdGNoQmVuZFNlbnNpdGl2aXR5XCIpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gc2Vuc2l0aXZpdHlcclxuICAgIH1cclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1ZpZXcudHMiLCJjb25zdCBQcm9ncmFtTmFtZXM6IHsgW2luZGV4OiBudW1iZXJdOiBzdHJpbmdbXSB9ID0ge1xyXG4gIDA6IFtcclxuICAgIFwiQWNvdXN0aWMgUGlhbm9cIixcclxuICAgIFwiQnJpZ2h0IFBpYW5vXCIsXHJcbiAgICBcIkVsZWN0cmljIEdyYW5kIFBpYW5vXCIsXHJcbiAgICBcIkhvbmt5LXRvbmsgUGlhbm9cIixcclxuICAgIFwiRWxlY3RyaWMgUGlhbm9cIixcclxuICAgIFwiRWxlY3RyaWMgUGlhbm8gMlwiLFxyXG4gICAgXCJIYXJwc2ljaG9yZFwiLFxyXG4gICAgXCJDbGF2aVwiLFxyXG4gICAgXCJDZWxlc3RhXCIsXHJcbiAgICBcIkdsb2NrZW5zcGllbFwiLFxyXG4gICAgXCJNdXNpY2FsIGJveFwiLFxyXG4gICAgXCJWaWJyYXBob25lXCIsXHJcbiAgICBcIk1hcmltYmFcIixcclxuICAgIFwiWHlsb3Bob25lXCIsXHJcbiAgICBcIlR1YnVsYXIgQmVsbFwiLFxyXG4gICAgXCJEdWxjaW1lclwiLFxyXG4gICAgXCJEcmF3YmFyIE9yZ2FuXCIsXHJcbiAgICBcIlBlcmN1c3NpdmUgT3JnYW5cIixcclxuICAgIFwiUm9jayBPcmdhblwiLFxyXG4gICAgXCJDaHVyY2ggb3JnYW5cIixcclxuICAgIFwiUmVlZCBvcmdhblwiLFxyXG4gICAgXCJBY2NvcmRpb25cIixcclxuICAgIFwiSGFybW9uaWNhXCIsXHJcbiAgICBcIlRhbmdvIEFjY29yZGlvblwiLFxyXG4gICAgXCJBY291c3RpYyBHdWl0YXIgKG55bG9uKVwiLFxyXG4gICAgXCJBY291c3RpYyBHdWl0YXIgKHN0ZWVsKVwiLFxyXG4gICAgXCJFbGVjdHJpYyBHdWl0YXIgKGphenopXCIsXHJcbiAgICBcIkVsZWN0cmljIEd1aXRhciAoY2xlYW4pXCIsXHJcbiAgICBcIkVsZWN0cmljIEd1aXRhciAobXV0ZWQpXCIsXHJcbiAgICBcIk92ZXJkcml2ZW4gR3VpdGFyXCIsXHJcbiAgICBcIkRpc3RvcnRpb24gR3VpdGFyXCIsXHJcbiAgICBcIkd1aXRhciBoYXJtb25pY3NcIixcclxuICAgIFwiQWNvdXN0aWMgQmFzc1wiLFxyXG4gICAgXCJFbGVjdHJpYyBCYXNzIChmaW5nZXIpXCIsXHJcbiAgICBcIkVsZWN0cmljIEJhc3MgKHBpY2spXCIsXHJcbiAgICBcIkZyZXRsZXNzIEJhc3NcIixcclxuICAgIFwiU2xhcCBCYXNzIDFcIixcclxuICAgIFwiU2xhcCBCYXNzIDJcIixcclxuICAgIFwiU3ludGggQmFzcyAxXCIsXHJcbiAgICBcIlN5bnRoIEJhc3MgMlwiLFxyXG4gICAgXCJWaW9saW5cIixcclxuICAgIFwiVmlvbGFcIixcclxuICAgIFwiQ2VsbG9cIixcclxuICAgIFwiRG91YmxlIGJhc3NcIixcclxuICAgIFwiVHJlbW9sbyBTdHJpbmdzXCIsXHJcbiAgICBcIlBpenppY2F0byBTdHJpbmdzXCIsXHJcbiAgICBcIk9yY2hlc3RyYWwgSGFycFwiLFxyXG4gICAgXCJUaW1wYW5pXCIsXHJcbiAgICBcIlN0cmluZyBFbnNlbWJsZSAxXCIsXHJcbiAgICBcIlN0cmluZyBFbnNlbWJsZSAyXCIsXHJcbiAgICBcIlN5bnRoIFN0cmluZ3MgMVwiLFxyXG4gICAgXCJTeW50aCBTdHJpbmdzIDJcIixcclxuICAgIFwiVm9pY2UgQWFoc1wiLFxyXG4gICAgXCJWb2ljZSBPb2hzXCIsXHJcbiAgICBcIlN5bnRoIFZvaWNlXCIsXHJcbiAgICBcIk9yY2hlc3RyYSBIaXRcIixcclxuICAgIFwiVHJ1bXBldFwiLFxyXG4gICAgXCJUcm9tYm9uZVwiLFxyXG4gICAgXCJUdWJhXCIsXHJcbiAgICBcIk11dGVkIFRydW1wZXRcIixcclxuICAgIFwiRnJlbmNoIGhvcm5cIixcclxuICAgIFwiQnJhc3MgU2VjdGlvblwiLFxyXG4gICAgXCJTeW50aCBCcmFzcyAxXCIsXHJcbiAgICBcIlN5bnRoIEJyYXNzIDJcIixcclxuICAgIFwiU29wcmFubyBTYXhcIixcclxuICAgIFwiQWx0byBTYXhcIixcclxuICAgIFwiVGVub3IgU2F4XCIsXHJcbiAgICBcIkJhcml0b25lIFNheFwiLFxyXG4gICAgXCJPYm9lXCIsXHJcbiAgICBcIkVuZ2xpc2ggSG9yblwiLFxyXG4gICAgXCJCYXNzb29uXCIsXHJcbiAgICBcIkNsYXJpbmV0XCIsXHJcbiAgICBcIlBpY2NvbG9cIixcclxuICAgIFwiRmx1dGVcIixcclxuICAgIFwiUmVjb3JkZXJcIixcclxuICAgIFwiUGFuIEZsdXRlXCIsXHJcbiAgICBcIkJsb3duIEJvdHRsZVwiLFxyXG4gICAgXCJTaGFrdWhhY2hpXCIsXHJcbiAgICBcIldoaXN0bGVcIixcclxuICAgIFwiT2NhcmluYVwiLFxyXG4gICAgXCJMZWFkIDEgKHNxdWFyZSlcIixcclxuICAgIFwiTGVhZCAyIChzYXd0b290aClcIixcclxuICAgIFwiTGVhZCAzIChjYWxsaW9wZSlcIixcclxuICAgIFwiTGVhZCA0IChjaGlmZilcIixcclxuICAgIFwiTGVhZCA1IChjaGFyYW5nKVwiLFxyXG4gICAgXCJMZWFkIDYgKHZvaWNlKVwiLFxyXG4gICAgXCJMZWFkIDcgKGZpZnRocylcIixcclxuICAgIFwiTGVhZCA4IChiYXNzICsgbGVhZClcIixcclxuICAgIFwiUGFkIDEgKEZhbnRhc2lhKVwiLFxyXG4gICAgXCJQYWQgMiAod2FybSlcIixcclxuICAgIFwiUGFkIDMgKHBvbHlzeW50aClcIixcclxuICAgIFwiUGFkIDQgKGNob2lyKVwiLFxyXG4gICAgXCJQYWQgNSAoYm93ZWQpXCIsXHJcbiAgICBcIlBhZCA2IChtZXRhbGxpYylcIixcclxuICAgIFwiUGFkIDcgKGhhbG8pXCIsXHJcbiAgICBcIlBhZCA4IChzd2VlcClcIixcclxuICAgIFwiRlggMSAocmFpbilcIixcclxuICAgIFwiRlggMiAoc291bmR0cmFjaylcIixcclxuICAgIFwiRlggMyAoY3J5c3RhbClcIixcclxuICAgIFwiRlggNCAoYXRtb3NwaGVyZSlcIixcclxuICAgIFwiRlggNSAoYnJpZ2h0bmVzcylcIixcclxuICAgIFwiRlggNiAoZ29ibGlucylcIixcclxuICAgIFwiRlggNyAoZWNob2VzKVwiLFxyXG4gICAgXCJGWCA4IChzY2ktZmkpXCIsXHJcbiAgICBcIlNpdGFyXCIsXHJcbiAgICBcIkJhbmpvXCIsXHJcbiAgICBcIlNoYW1pc2VuXCIsXHJcbiAgICBcIktvdG9cIixcclxuICAgIFwiS2FsaW1iYVwiLFxyXG4gICAgXCJCYWdwaXBlXCIsXHJcbiAgICBcIkZpZGRsZVwiLFxyXG4gICAgXCJTaGFuYWlcIixcclxuICAgIFwiVGlua2xlIEJlbGxcIixcclxuICAgIFwiQWdvZ29cIixcclxuICAgIFwiU3RlZWwgRHJ1bXNcIixcclxuICAgIFwiV29vZGJsb2NrXCIsXHJcbiAgICBcIlRhaWtvIERydW1cIixcclxuICAgIFwiTWVsb2RpYyBUb21cIixcclxuICAgIFwiU3ludGggRHJ1bVwiLFxyXG4gICAgXCJSZXZlcnNlIEN5bWJhbFwiLFxyXG4gICAgXCJHdWl0YXIgRnJldCBOb2lzZVwiLFxyXG4gICAgXCJCcmVhdGggTm9pc2VcIixcclxuICAgIFwiU2Vhc2hvcmVcIixcclxuICAgIFwiQmlyZCBUd2VldFwiLFxyXG4gICAgXCJUZWxlcGhvbmUgUmluZ1wiLFxyXG4gICAgXCJIZWxpY29wdGVyXCIsXHJcbiAgICBcIkFwcGxhdXNlXCIsXHJcbiAgICBcIkd1bnNob3RcIlxyXG4gIF0sIDEyODogW1wiUmh5dGhtIFRyYWNrXCJdXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2dyYW1OYW1lc1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Qcm9ncmFtTmFtZXMudHMiLCJpbXBvcnQgU3ludGhlc2l6ZXIgZnJvbSBcIi4vU3ludGhlc2l6ZXJcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlkaU1lc3NhZ2VIYW5kbGVyIHtcclxuICBwcml2YXRlIFJwbk1zYiA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXVxyXG4gIHByaXZhdGUgUnBuTHNiID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdXHJcbiAgc3ludGg6IFN5bnRoZXNpemVyXHJcblxyXG4gIHByb2Nlc3NNaWRpTWVzc2FnZShtZXNzYWdlOiBudW1iZXJbXSkge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IG1lc3NhZ2VbMF0gJiAweDBmXHJcbiAgICBjb25zdCB7IHN5bnRoIH0gPSB0aGlzXHJcblxyXG4gICAgaWYgKCFzeW50aCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKG1lc3NhZ2VbMF0gJiAweGYwKSB7XHJcbiAgICAgIGNhc2UgMHg4MDogLy8gTm90ZU9mZjogOG4ga2sgdnZcclxuICAgICAgICBzeW50aC5ub3RlT2ZmKGNoYW5uZWwsIG1lc3NhZ2VbMV0sIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAweDkwOiAvLyBOb3RlT246IDluIGtrIHZ2XHJcbiAgICAgICAgaWYgKG1lc3NhZ2VbMl0gPiAwKSB7XHJcbiAgICAgICAgICBzeW50aC5ub3RlT24oY2hhbm5lbCwgbWVzc2FnZVsxXSwgbWVzc2FnZVsyXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3ludGgubm90ZU9mZihjaGFubmVsLCBtZXNzYWdlWzFdLCAwKVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4QjA6IC8vIENvbnRyb2wgQ2hhbmdlOiBCbiBjYyBkZFxyXG4gICAgICAgIHN3aXRjaCAobWVzc2FnZVsxXSkge1xyXG4gICAgICAgICAgY2FzZSAweDA2OiAvLyBEYXRhIEVudHJ5OiBCbiAwNiBkZFxyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuUnBuTXNiW2NoYW5uZWxdKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLlJwbkxzYltjaGFubmVsXSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIDA6IC8vIFBpdGNoIEJlbmQgU2Vuc2l0aXZpdHlcclxuICAgICAgICAgICAgICAgICAgICBzeW50aC5waXRjaEJlbmRTZW5zaXRpdml0eShjaGFubmVsLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDA3OiAvLyBWb2x1bWUgQ2hhbmdlOiBCbiAwNyBkZFxyXG4gICAgICAgICAgICBzeW50aC52b2x1bWVDaGFuZ2UoY2hhbm5lbCwgbWVzc2FnZVsyXSlcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHgwQTogLy8gUGFucG90IENoYW5nZTogQm4gMEEgZGRcclxuICAgICAgICAgICAgc3ludGgucGFucG90Q2hhbmdlKGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4Nzg6IC8vIEFsbCBTb3VuZCBPZmY6IEJuIDc4IDAwXHJcbiAgICAgICAgICAgIHN5bnRoLmFsbFNvdW5kT2ZmKGNoYW5uZWwpXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4Nzk6IC8vIFJlc2V0IEFsbCBDb250cm9sOiBCbiA3OSAwMFxyXG4gICAgICAgICAgICBzeW50aC5yZXNldEFsbENvbnRyb2woY2hhbm5lbClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHgyMDogLy8gQmFua1NlbGVjdFxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYmFua3NlbGVjdDpcIiwgY2hhbm5lbCwgbWVzc2FnZVsyXSlcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHg2NDogLy8gUlBOIE1TQlxyXG4gICAgICAgICAgICB0aGlzLlJwbk1zYltjaGFubmVsXSA9IG1lc3NhZ2VbMl1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHg2NTogLy8gUlBOIExTQlxyXG4gICAgICAgICAgICB0aGlzLlJwbkxzYltjaGFubmVsXSA9IG1lc3NhZ2VbMl1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAvLyBub3Qgc3VwcG9ydGVkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMHhDMDogLy8gUHJvZ3JhbSBDaGFuZ2U6IENuIHBwXHJcbiAgICAgICAgc3ludGgucHJvZ3JhbUNoYW5nZShjaGFubmVsLCBtZXNzYWdlWzFdKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMHhFMDogLy8gUGl0Y2ggQmVuZFxyXG4gICAgICAgIHN5bnRoLnBpdGNoQmVuZChjaGFubmVsLCBtZXNzYWdlWzFdLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMHhmMDogLy8gU3lzdGVtIEV4Y2x1c2l2ZSBNZXNzYWdlXHJcbiAgICAgICAgLy8gSUQgbnVtYmVyXHJcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlWzFdKSB7XHJcbiAgICAgICAgICBjYXNlIDB4N2U6IC8vIG5vbi1yZWFsdGltZVxyXG4gICAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4N2Y6IC8vIHJlYWx0aW1lXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGRldmljZSA9IG1lc3NhZ2VbMl1cclxuICAgICAgICAgICAgLy8gc3ViIElEIDFcclxuICAgICAgICAgICAgc3dpdGNoIChtZXNzYWdlWzNdKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSAweDA0OiAvLyBkZXZpY2UgY29udHJvbFxyXG4gICAgICAgICAgICAgICAgLy8gc3ViIElEIDJcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobWVzc2FnZVs0XSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIDB4MDE6IHsgLy8gbWFzdGVyIHZvbHVtZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZvbHVtZSA9IG1lc3NhZ2VbNV0gKyAobWVzc2FnZVs2XSA8PCA3KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IE1BWF9WT0xVTUUgPSAweDQwMDAgLSAxXHJcbiAgICAgICAgICAgICAgICAgICAgc3ludGguc2V0TWFzdGVyVm9sdW1lKHZvbHVtZSAvIE1BWF9WT0xVTUUpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OiAvLyBub3Qgc3VwcG9ydGVkXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01pZGlNZXNzYWdlSGFuZGxlci50cyJdLCJzb3VyY2VSb290IjoiIn0=