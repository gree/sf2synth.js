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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_Synthesizer_ts__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_View_ts__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_MidiMessageHandler_ts__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_delegateProxy_ts__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "WebMidiLink", function() { return __WEBPACK_IMPORTED_MODULE_0__src_WebMidiLink_ts__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Synthesizer", function() { return __WEBPACK_IMPORTED_MODULE_1__src_Synthesizer_ts__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "View", function() { return __WEBPACK_IMPORTED_MODULE_2__src_View_ts__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MidiMessageHandler", function() { return __WEBPACK_IMPORTED_MODULE_3__src_MidiMessageHandler_ts__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MidiMessageListener", function() { return __WEBPACK_IMPORTED_MODULE_3__src_MidiMessageHandler_ts__["Listener"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "delegateProxy", function() { return __WEBPACK_IMPORTED_MODULE_4__src_delegateProxy_ts__["a"]; });








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
        this.midiMessageHandler = new __WEBPACK_IMPORTED_MODULE_2__MidiMessageHandler__["b" /* default */]();
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
            synth.connect(ctx.destination);
            const view = this.view = new __WEBPACK_IMPORTED_MODULE_1__View__["a" /* default */]();
            document.body.querySelector(".synth").appendChild(view.draw(synth));
            this.midiMessageHandler.listener = Object(__WEBPACK_IMPORTED_MODULE_3__delegateProxy__["a" /* default */])([synth, view]);
            window.addEventListener('message', this.onmessage.bind(this), false);
        }
        else {
            synth = this.synth;
        }
        synth.loadSoundFont(input);
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
    loadSoundFont(input) {
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
                const bend = ((message[1] & 0x7f) | ((message[2] & 0x7f) << 7));
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
/* harmony export (immutable) */ __webpack_exports__["b"] = MidiMessageHandler;



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjNThlN2UzMTBkZjJkMmRiNjY4YiIsIndlYnBhY2s6Ly8vLi9zcmMvU3RyZWFtLnRzIiwid2VicGFjazovLy8uL3NyYy9TdHJ1Y3RzLnRzIiwid2VicGFjazovLy8uL3NyYy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JpZmZQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9leHBvcnQvc3ludGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYk1pZGlMaW5rLnRzIiwid2VicGFjazovLy8uL3NyYy9TeW50aGVzaXplci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU3ludGhlc2l6ZXJOb3RlLnRzIiwid2VicGFjazovLy8uL3NyYy9Tb3VuZEZvbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZpZXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Byb2dyYW1OYW1lcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWlkaU1lc3NhZ2VIYW5kbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9kZWxlZ2F0ZVByb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtB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LEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSw4REFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM5RixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwyREFBUyxDQUFDO0FBQzdFLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDREQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzVGLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLCtEQUFhLENBQUM7QUFDakYsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDL0YsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsK0RBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxL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VUFBVSxDQUFDO3dDQUM3QyxLQUFLO29DQUNQLENBQUM7b0NBQ0Q7d0NBQ0UsS0FBSztnQ0FDVCxDQUFDO2dDQUNELEtBQUs7NEJBQ1A7Z0NBQ0UsS0FBSzt3QkFDVCxDQUFDO3dCQUNELEtBQUs7b0JBQ1A7d0JBQ0UsS0FBSztnQkFDVCxDQUFDO2dCQUNELEtBQUs7WUFDUCxRQUFTLGdCQUFnQjtnQkFDdkIsS0FBSztRQUNULENBQUM7SUFDSCxDQUFDO0NBQ0Y7QUFBQTtBQUFBOzs7Ozs7OztBQzFIRDtBQUFBLDZDQUE2QztBQUMvQix1QkFBMEMsT0FBWTtJQUNsRSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzNCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVM7WUFDNUIsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDVixPQUFPO3FCQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ2pDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7UUFDSCxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJmaWxlIjoic2YyLnN5bnRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYzU4ZTdlMzEwZGYyZDJkYjY2OGIiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJlYW0ge1xyXG4gIHByaXZhdGUgZGF0YTogVWludDhBcnJheVxyXG4gIGlwOiBudW1iZXJcclxuXHJcbiAgY29uc3RydWN0b3IoZGF0YSwgb2Zmc2V0KSB7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhXHJcbiAgICB0aGlzLmlwID0gb2Zmc2V0XHJcbiAgfVxyXG5cclxuICByZWFkU3RyaW5nKHNpemU6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIHRoaXMuZGF0YS5zdWJhcnJheSh0aGlzLmlwLCB0aGlzLmlwICs9IHNpemUpKVxyXG4gICAgY29uc3QgbnVsbExvY2F0aW9uID0gc3RyLmluZGV4T2YoXCJcXHUwMDAwXCIpXHJcbiAgICBpZiAobnVsbExvY2F0aW9uID4gMCkge1xyXG4gICAgICByZXR1cm4gc3RyLnN1YnN0cigwLCBudWxsTG9jYXRpb24pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RyXHJcbiAgfVxyXG5cclxuICByZWFkV09SRCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwKytdIHwgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpXHJcbiAgfVxyXG5cclxuICByZWFkRFdPUkQoYmlnRW5kaWFuOiBib29sZWFuID0gZmFsc2UpOiBudW1iZXIge1xyXG4gICAgaWYgKGJpZ0VuZGlhbikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDI0fCBcclxuICAgICAgICAodGhpcy5kYXRhW3RoaXMuaXArK10gPDwgMTYpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdKVxyXG4gICAgICApID4+PiAwXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuZGF0YVt0aGlzLmlwKytdIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDgpIHwgXHJcbiAgICAgICAgKHRoaXMuZGF0YVt0aGlzLmlwKytdIDw8IDE2KSB8IFxyXG4gICAgICAgICh0aGlzLmRhdGFbdGhpcy5pcCsrXSA8PCAyNClcclxuICAgICAgKSA+Pj4gMFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVhZEJ5dGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuaXArK11cclxuICB9XHJcblxyXG4gIHJlYWRBdChvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLmlwICsgb2Zmc2V0XVxyXG4gIH1cclxuXHJcbiAgLyogaGVscGVyICovXHJcblxyXG4gIHJlYWRVSW50OCgpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWRCeXRlKClcclxuICB9XHJcbiAgXHJcbiAgcmVhZEludDgoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMucmVhZEJ5dGUoKSA8PCAyNCkgPj4gMjRcclxuICB9XHJcbiAgXHJcbiAgcmVhZFVJbnQxNigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWRXT1JEKClcclxuICB9XHJcblxyXG4gIHJlYWRJbnQxNigpIHtcclxuICAgIHJldHVybiAodGhpcy5yZWFkV09SRCgpIDw8IDE2KSA+PiAxNlxyXG4gIH1cclxuXHJcbiAgcmVhZFVJbnQzMigpIHtcclxuICAgIHJldHVybiB0aGlzLnJlYWREV09SRCgpXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TdHJlYW0udHMiLCJpbXBvcnQgeyBHZW5lcmF0b3JFbnVtZXJhdG9yVGFibGUgfSBmcm9tIFwiLi9Db25zdGFudHNcIlxyXG5pbXBvcnQgU3RyZWFtIGZyb20gXCIuL1N0cmVhbVwiXHJcbmltcG9ydCB7IENodW5rIH0gZnJvbSBcIi4vUmlmZlBhcnNlclwiXHJcblxyXG5leHBvcnQgY2xhc3MgVmVyc2lvblRhZyB7XHJcbiAgbWFqb3I6IG51bWJlclxyXG4gIG1pbm9yOiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHYgPSBuZXcgVmVyc2lvblRhZygpXHJcbiAgICB2Lm1ham9yID0gc3RyZWFtLnJlYWRJbnQ4KClcclxuICAgIHYubWlub3IgPSBzdHJlYW0ucmVhZEludDgoKVxyXG4gICAgcmV0dXJuIHZcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmZvIHtcclxuICBjb21tZW50OiBzdHJpbmd8bnVsbFxyXG4gIGNvcHlyaWdodDogc3RyaW5nfG51bGxcclxuICBjcmVhdGlvbkRhdGU6IHN0cmluZ3xudWxsXHJcbiAgZW5naW5lZXI6IHN0cmluZ3xudWxsXHJcbiAgbmFtZTogc3RyaW5nXHJcbiAgcHJvZHVjdDogc3RyaW5nfG51bGxcclxuICBzb2Z0d2FyZTogc3RyaW5nfG51bGxcclxuICB2ZXJzaW9uOiBWZXJzaW9uVGFnXHJcbiAgc291bmRFbmdpbmU6IHN0cmluZ3xudWxsXHJcbiAgcm9tTmFtZTogc3RyaW5nfG51bGxcclxuICByb21WZXJzaW9uOiBWZXJzaW9uVGFnfG51bGxcclxuXHJcbiAgLy8gTElTVCAtIElORk8g44Gu5YWo44Gm44GuIGNodW5rXHJcbiAgc3RhdGljIHBhcnNlKGRhdGE6IFVpbnQ4QXJyYXksIGNodW5rczogQ2h1bmtbXSkge1xyXG4gICAgZnVuY3Rpb24gZ2V0Q2h1bmsodHlwZSkge1xyXG4gICAgICByZXR1cm4gY2h1bmtzLmZpbmQoYyA9PiBjLnR5cGUgPT09IHR5cGUpIFxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvU3RyZWFtKGNodW5rKSB7XHJcbiAgICAgIHJldHVybiBuZXcgU3RyZWFtKGRhdGEsIGNodW5rLm9mZnNldClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZWFkU3RyaW5nKHR5cGUpIHtcclxuICAgICAgY29uc3QgY2h1bmsgPSBnZXRDaHVuayh0eXBlKVxyXG4gICAgICBpZiAoIWNodW5rKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdG9TdHJlYW0oY2h1bmspIS5yZWFkU3RyaW5nKGNodW5rLnNpemUpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVhZFZlcnNpb25UYWcodHlwZSkge1xyXG4gICAgICBjb25zdCBjaHVuayA9IGdldENodW5rKHR5cGUpXHJcbiAgICAgIGlmICghY2h1bmspIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBWZXJzaW9uVGFnLnBhcnNlKHRvU3RyZWFtKGNodW5rKSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgaW5mbyA9IG5ldyBJbmZvKClcclxuICAgIGluZm8uY29tbWVudCA9IHJlYWRTdHJpbmcoXCJJQ01UXCIpXHJcbiAgICBpbmZvLmNvcHlyaWdodCA9IHJlYWRTdHJpbmcoXCJJQ09QXCIpXHJcbiAgICBpbmZvLmNyZWF0aW9uRGF0ZSA9IHJlYWRTdHJpbmcoXCJJQ1JEXCIpXHJcbiAgICBpbmZvLmVuZ2luZWVyID0gcmVhZFN0cmluZyhcIklFTkdcIilcclxuICAgIGluZm8ubmFtZSA9IHJlYWRTdHJpbmcoXCJJTkFNXCIpIVxyXG4gICAgaW5mby5wcm9kdWN0ID0gcmVhZFN0cmluZyhcIklQUkRcIilcclxuICAgIGluZm8uc29mdHdhcmUgPSByZWFkU3RyaW5nKFwiSVNGVFwiKVxyXG4gICAgaW5mby52ZXJzaW9uID0gcmVhZFZlcnNpb25UYWcoXCJpZmlsXCIpIVxyXG4gICAgaW5mby5zb3VuZEVuZ2luZSA9IHJlYWRTdHJpbmcoXCJpc25nXCIpXHJcbiAgICBpbmZvLnJvbU5hbWUgPSByZWFkU3RyaW5nKFwiaXJvbVwiKVxyXG4gICAgaW5mby5yb21WZXJzaW9uID0gcmVhZFZlcnNpb25UYWcoXCJpdmVyXCIpXHJcbiAgICByZXR1cm4gaW5mb1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByZXNldEhlYWRlciB7XHJcbiAgcHJlc2V0TmFtZTogc3RyaW5nXHJcbiAgcHJlc2V0OiBudW1iZXJcclxuICBiYW5rOiBudW1iZXJcclxuICBwcmVzZXRCYWdJbmRleDogbnVtYmVyXHJcbiAgbGlicmFyeTogbnVtYmVyXHJcbiAgZ2VucmU6IG51bWJlclxyXG4gIG1vcnBob2xvZ3k6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcmVzZXROYW1lID09PSBcIkVPUFwiXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0SGVhZGVyKClcclxuICAgIHAucHJlc2V0TmFtZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDIwKVxyXG4gICAgcC5wcmVzZXQgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5iYW5rID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHAucHJlc2V0QmFnSW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5saWJyYXJ5ID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLmdlbnJlID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBwLm1vcnBob2xvZ3kgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHJldHVybiBwXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlc2V0QmFnIHtcclxuICBwcmVzZXRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgcHJlc2V0TW9kdWxhdG9ySW5kZXg6IG51bWJlclxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHAgPSBuZXcgUHJlc2V0QmFnKClcclxuICAgIHAucHJlc2V0R2VuZXJhdG9ySW5kZXggPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcC5wcmVzZXRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gcFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJhbmdlVmFsdWUge1xyXG4gIGxvOiBudW1iZXJcclxuICBoaTogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKGxvOiBudW1iZXIsIGhpOiBudW1iZXIpIHtcclxuICAgIHRoaXMubG8gPSBsb1xyXG4gICAgdGhpcy5oaSA9IGhpXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIHJldHVybiBuZXcgUmFuZ2VWYWx1ZShcclxuICAgICAgc3RyZWFtLnJlYWRCeXRlKCksIFxyXG4gICAgICBzdHJlYW0ucmVhZEJ5dGUoKVxyXG4gICAgKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1vZHVsYXRvckxpc3Qge1xyXG4gIHNvdXJjZU9wZXI6IG51bWJlclxyXG4gIGRlc3RpbmF0aW9uT3BlcjogbnVtYmVyXHJcbiAgdmFsdWU6IG51bWJlcnxSYW5nZVZhbHVlXHJcbiAgYW1vdW50U291cmNlT3BlcjogbnVtYmVyXHJcbiAgdHJhbnNPcGVyOiBudW1iZXJcclxuXHJcbiAgZ2V0IHR5cGUoKSB7XHJcbiAgICByZXR1cm4gR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW3RoaXMuZGVzdGluYXRpb25PcGVyXVxyXG4gIH1cclxuXHJcbiAgZ2V0IGlzRW5kKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlT3BlciA9PT0gMCAmJiBcclxuICAgICAgdGhpcy5kZXN0aW5hdGlvbk9wZXIgPT09IDAgJiZcclxuICAgICAgdGhpcy52YWx1ZSA9PT0gMCAmJlxyXG4gICAgICB0aGlzLmFtb3VudFNvdXJjZU9wZXIgPT09IDAgJiZcclxuICAgICAgdGhpcy4gdHJhbnNPcGVyID09PSAwXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgTW9kdWxhdG9yTGlzdCgpXHJcblxyXG4gICAgdC5zb3VyY2VPcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuICAgIHQuZGVzdGluYXRpb25PcGVyID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzd2l0Y2ggKHQudHlwZSkge1xyXG4gICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbFJhbmdlJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgIHQudmFsdWUgPSBSYW5nZVZhbHVlLnBhcnNlKHN0cmVhbSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHQudmFsdWUgPSBzdHJlYW0ucmVhZEludDE2KClcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0LmFtb3VudFNvdXJjZU9wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgdC50cmFuc09wZXIgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG5cclxuICAgIHJldHVybiB0XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yTGlzdCB7XHJcbiAgY29kZTogbnVtYmVyXHJcbiAgdmFsdWU6IG51bWJlcnxSYW5nZVZhbHVlXHJcblxyXG4gIGdldCB0eXBlKCkge1xyXG4gICAgcmV0dXJuIEdlbmVyYXRvckVudW1lcmF0b3JUYWJsZVt0aGlzLmNvZGVdXHJcbiAgfVxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb2RlID09PSAwICYmXHJcbiAgICAgIHRoaXMudmFsdWUgPT09IDBcclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXJzZShzdHJlYW06IFN0cmVhbSkge1xyXG4gICAgY29uc3QgdCA9IG5ldyBHZW5lcmF0b3JMaXN0KClcclxuICAgIHQuY29kZSA9IHN0cmVhbS5yZWFkV09SRCgpXHJcblxyXG4gICAgc3dpdGNoICh0LnR5cGUpIHtcclxuICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAna2V5UmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICd2ZWxSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICB0LnZhbHVlID0gUmFuZ2VWYWx1ZS5wYXJzZShzdHJlYW0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0LnZhbHVlID0gc3RyZWFtLnJlYWRJbnQxNigpXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnQge1xyXG4gIGluc3RydW1lbnROYW1lOiBzdHJpbmdcclxuICBpbnN0cnVtZW50QmFnSW5kZXg6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnN0cnVtZW50TmFtZSA9PT0gXCJFT0lcIlxyXG4gIH1cclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudCgpXHJcbiAgICB0Lmluc3RydW1lbnROYW1lID0gc3RyZWFtLnJlYWRTdHJpbmcoMjApXHJcbiAgICB0Lmluc3RydW1lbnRCYWdJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnRCYWcge1xyXG4gIGluc3RydW1lbnRHZW5lcmF0b3JJbmRleDogbnVtYmVyXHJcbiAgaW5zdHJ1bWVudE1vZHVsYXRvckluZGV4OiBudW1iZXJcclxuICBcclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHQgPSBuZXcgSW5zdHJ1bWVudEJhZygpXHJcbiAgICB0Lmluc3RydW1lbnRHZW5lcmF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICB0Lmluc3RydW1lbnRNb2R1bGF0b3JJbmRleCA9IHN0cmVhbS5yZWFkV09SRCgpXHJcbiAgICByZXR1cm4gdFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNhbXBsZUhlYWRlciB7XHJcbiAgc2FtcGxlTmFtZTogc3RyaW5nXHJcbiAgc3RhcnQ6IG51bWJlclxyXG4gIGVuZDogbnVtYmVyXHJcbiAgbG9vcFN0YXJ0OiBudW1iZXJcclxuICBsb29wRW5kOiBudW1iZXJcclxuICBzYW1wbGVSYXRlOiBudW1iZXJcclxuICBvcmlnaW5hbFBpdGNoOiBudW1iZXJcclxuICBwaXRjaENvcnJlY3Rpb246IG51bWJlclxyXG4gIHNhbXBsZUxpbms6IG51bWJlclxyXG4gIHNhbXBsZVR5cGU6IG51bWJlclxyXG5cclxuICBnZXQgaXNFbmQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zYW1wbGVOYW1lID09PSBcIkVPU1wiXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGFyc2Uoc3RyZWFtOiBTdHJlYW0pIHtcclxuICAgIGNvbnN0IHMgPSBuZXcgU2FtcGxlSGVhZGVyKClcclxuXHJcbiAgICBzLnNhbXBsZU5hbWUgPSBzdHJlYW0ucmVhZFN0cmluZygyMClcclxuICAgIHMuc3RhcnQgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMuZW5kID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLmxvb3BTdGFydCA9IHN0cmVhbS5yZWFkRFdPUkQoKVxyXG4gICAgcy5sb29wRW5kID0gc3RyZWFtLnJlYWREV09SRCgpXHJcbiAgICBzLnNhbXBsZVJhdGUgPSBzdHJlYW0ucmVhZERXT1JEKClcclxuICAgIHMub3JpZ2luYWxQaXRjaCA9IHN0cmVhbS5yZWFkQnl0ZSgpXHJcbiAgICBzLnBpdGNoQ29ycmVjdGlvbiA9IHN0cmVhbS5yZWFkSW50OCgpXHJcbiAgICBzLnNhbXBsZUxpbmsgPSBzdHJlYW0ucmVhZFdPUkQoKVxyXG4gICAgcy5zYW1wbGVUeXBlID0gc3RyZWFtLnJlYWRXT1JEKClcclxuXHJcbiAgICBzLmxvb3BTdGFydCAtPSBzLnN0YXJ0XHJcbiAgICBzLmxvb3BFbmQgLT0gcy5zdGFydFxyXG5cclxuICAgIHJldHVybiBzXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgU2FtcGxlTGluayA9IHtcclxuICBtb25vU2FtcGxlOiAxLFxyXG4gIHJpZ2h0U2FtcGxlOiAyLFxyXG4gIGxlZnRTYW1wbGU6IDQsXHJcbiAgbGlua2VkU2FtcGxlOiA4LFxyXG4gIFJvbU1vbm9TYW1wbGU6IDB4ODAwMSxcclxuICBSb21SaWdodFNhbXBsZTogMHg4MDAyLFxyXG4gIFJvbUxlZnRTYW1wbGU6IDB4ODAwNCxcclxuICBSb21MaW5rZWRTYW1wbGU6IDB4ODAwOFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TdHJ1Y3RzLnRzIiwiaW1wb3J0IHsgcGFyc2VSaWZmLCBDaHVuaywgT3B0aW9ucyBhcyBSaWZmUGFyc2VyT3B0aW9ucyB9IGZyb20gXCIuL1JpZmZQYXJzZXJcIlxyXG5pbXBvcnQgeyBQcmVzZXRIZWFkZXIsIFNhbXBsZUhlYWRlciwgUHJlc2V0QmFnLCBJbnN0cnVtZW50LCBJbnN0cnVtZW50QmFnLCBNb2R1bGF0b3JMaXN0LCBHZW5lcmF0b3JMaXN0LCBJbmZvIH0gZnJvbSBcIi4vU3RydWN0c1wiXHJcbmltcG9ydCBTdHJlYW0gZnJvbSBcIi4vU3RyZWFtXCJcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VSZXN1bHQge1xyXG4gIHByZXNldEhlYWRlcnM6IFByZXNldEhlYWRlcltdXHJcbiAgcHJlc2V0Wm9uZTogUHJlc2V0QmFnW11cclxuICBwcmVzZXRNb2R1bGF0b3JzOiBNb2R1bGF0b3JMaXN0W11cclxuICBwcmVzZXRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50czogSW5zdHJ1bWVudFtdXHJcbiAgaW5zdHJ1bWVudFpvbmU6IEluc3RydW1lbnRCYWdbXVxyXG4gIGluc3RydW1lbnRNb2R1bGF0b3JzOiBNb2R1bGF0b3JMaXN0W11cclxuICBpbnN0cnVtZW50R2VuZXJhdG9yczogR2VuZXJhdG9yTGlzdFtdXHJcbiAgc2FtcGxlSGVhZGVyczogU2FtcGxlSGVhZGVyW11cclxuICBzYW1wbGVzOiBJbnQxNkFycmF5W11cclxuICBzYW1wbGluZ0RhdGE6IENodW5rXHJcbiAgaW5mbzogSW5mb1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZShpbnB1dDogVWludDhBcnJheSwgb3B0aW9uOiBSaWZmUGFyc2VyT3B0aW9ucyA9IHt9KTogUGFyc2VSZXN1bHQge1xyXG5cclxuICAvLyBwYXJzZSBSSUZGIGNodW5rXHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gcGFyc2VSaWZmKGlucHV0LCAwLCBpbnB1dC5sZW5ndGgsIG9wdGlvbilcclxuXHJcbiAgaWYgKGNodW5rTGlzdC5sZW5ndGggIT09IDEpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignd3JvbmcgY2h1bmsgbGVuZ3RoJylcclxuICB9XHJcblxyXG4gIGNvbnN0IGNodW5rID0gY2h1bmtMaXN0WzBdXHJcbiAgaWYgKGNodW5rID09PSBudWxsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NodW5rIG5vdCBmb3VuZCcpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZVJpZmZDaHVuayhjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJSSUZGXCIsIFwic2Zia1wiKVxyXG5cclxuICAgIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAzKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzZmJrIHN0cnVjdHVyZScpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gSU5GTy1saXN0XHJcbiAgICAgIGluZm86IHBhcnNlSW5mb0xpc3QoY2h1bmtMaXN0WzBdLCBkYXRhKSxcclxuXHJcbiAgICAgIC8vIHNkdGEtbGlzdFxyXG4gICAgICBzYW1wbGluZ0RhdGE6IHBhcnNlU2R0YUxpc3QoY2h1bmtMaXN0WzFdLCBkYXRhKSxcclxuXHJcbiAgICAgIC8vIHBkdGEtbGlzdFxyXG4gICAgICAuLi5wYXJzZVBkdGFMaXN0KGNodW5rTGlzdFsyXSwgZGF0YSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlUGR0YUxpc3QoY2h1bms6IENodW5rLCBkYXRhOiBVaW50OEFycmF5KSB7XHJcbiAgICBjb25zdCBjaHVua0xpc3QgPSBnZXRDaHVua0xpc3QoY2h1bmssIGRhdGEsIFwiTElTVFwiLCBcInBkdGFcIilcclxuXHJcbiAgICAvLyBjaGVjayBudW1iZXIgb2YgY2h1bmtzXHJcbiAgICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCAhPT0gOSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGR0YSBjaHVuaycpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcHJlc2V0SGVhZGVyczogcGFyc2VQaGRyKGNodW5rTGlzdFswXSwgZGF0YSksXHJcbiAgICAgIHByZXNldFpvbmU6IHBhcnNlUGJhZyhjaHVua0xpc3RbMV0sIGRhdGEpLFxyXG4gICAgICBwcmVzZXRNb2R1bGF0b3JzOiBwYXJzZVBtb2QoY2h1bmtMaXN0WzJdLCBkYXRhKSxcclxuICAgICAgcHJlc2V0R2VuZXJhdG9yczogcGFyc2VQZ2VuKGNodW5rTGlzdFszXSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRzOiBwYXJzZUluc3QoY2h1bmtMaXN0WzRdLCBkYXRhKSxcclxuICAgICAgaW5zdHJ1bWVudFpvbmU6IHBhcnNlSWJhZyhjaHVua0xpc3RbNV0sIGRhdGEpLFxyXG4gICAgICBpbnN0cnVtZW50TW9kdWxhdG9yczogcGFyc2VJbW9kKGNodW5rTGlzdFs2XSwgZGF0YSksXHJcbiAgICAgIGluc3RydW1lbnRHZW5lcmF0b3JzOiBwYXJzZUlnZW4oY2h1bmtMaXN0WzddLCBkYXRhKSxcclxuICAgICAgc2FtcGxlSGVhZGVyczogcGFyc2VTaGRyKGNodW5rTGlzdFs4XSwgZGF0YSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHJlc3VsdCA9IHBhcnNlUmlmZkNodW5rKGNodW5rLCBpbnB1dClcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIC4uLnJlc3VsdCxcclxuICAgIHNhbXBsZXM6IGxvYWRTYW1wbGUocmVzdWx0LnNhbXBsZUhlYWRlcnMsIHJlc3VsdC5zYW1wbGluZ0RhdGEub2Zmc2V0LCBpbnB1dClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgZXhwZWN0ZWRUeXBlLCBleHBlY3RlZFNpZ25hdHVyZSkge1xyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSBleHBlY3RlZFR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcblxyXG4gIC8vIGNoZWNrIHNpZ25hdHVyZVxyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IHN0cmVhbS5yZWFkU3RyaW5nKDQpXHJcbiAgaWYgKHNpZ25hdHVyZSAhPT0gZXhwZWN0ZWRTaWduYXR1cmUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaWduYXR1cmU6JyArIHNpZ25hdHVyZSlcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcmV0dXJuIHBhcnNlUmlmZihkYXRhLCBzdHJlYW0uaXAsIGNodW5rLnNpemUgLSA0KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUluZm9MaXN0KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSkge1xyXG4gIGNvbnN0IGNodW5rTGlzdCA9IGdldENodW5rTGlzdChjaHVuaywgZGF0YSwgXCJMSVNUXCIsIFwiSU5GT1wiKVxyXG4gIHJldHVybiBJbmZvLnBhcnNlKGRhdGEsIGNodW5rTGlzdClcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTZHRhTGlzdChjaHVuazogQ2h1bmssIGRhdGE6IFVpbnQ4QXJyYXkpOiBDaHVuayB7XHJcbiAgY29uc3QgY2h1bmtMaXN0ID0gZ2V0Q2h1bmtMaXN0KGNodW5rLCBkYXRhLCBcIkxJU1RcIiwgXCJzZHRhXCIpXHJcblxyXG4gIGlmIChjaHVua0xpc3QubGVuZ3RoICE9PSAxKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RPRE8nKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFswXVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUNodW5rPFQ+KGNodW5rOiBDaHVuaywgZGF0YTogVWludDhBcnJheSwgdHlwZTogc3RyaW5nLCBjbGF6ejogeyBwYXJzZTogKHN0cmVhbTogU3RyZWFtKSA9PiBUIH0sIHRlcm1pbmF0ZT86IChvYmo6IFQpID0+IGJvb2xlYW4pOiBUW10ge1xyXG4gIGNvbnN0IHJlc3VsdDogVFtdID0gW11cclxuXHJcbiAgaWYgKGNodW5rLnR5cGUgIT09IHR5cGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgICsgY2h1bmsudHlwZSlcclxuICB9XHJcbiAgXHJcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShkYXRhLCBjaHVuay5vZmZzZXQpXHJcbiAgY29uc3Qgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemVcclxuICBcclxuICB3aGlsZSAoc3RyZWFtLmlwIDwgc2l6ZSkge1xyXG4gICAgY29uc3Qgb2JqID0gY2xhenoucGFyc2Uoc3RyZWFtKVxyXG4gICAgaWYgKHRlcm1pbmF0ZSAmJiB0ZXJtaW5hdGUob2JqKSkge1xyXG4gICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgcmVzdWx0LnB1c2gob2JqKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5jb25zdCBwYXJzZVBoZHIgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGhkclwiLCBQcmVzZXRIZWFkZXIsIHAgPT4gcC5pc0VuZClcclxuY29uc3QgcGFyc2VQYmFnID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInBiYWdcIiwgUHJlc2V0QmFnKVxyXG5jb25zdCBwYXJzZUluc3QgPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwiaW5zdFwiLCBJbnN0cnVtZW50LCBpID0+IGkuaXNFbmQpXHJcbmNvbnN0IHBhcnNlSWJhZyA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpYmFnXCIsIEluc3RydW1lbnRCYWcpXHJcbmNvbnN0IHBhcnNlUG1vZCA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJwbW9kXCIsIE1vZHVsYXRvckxpc3QsIG0gPT4gbS5pc0VuZClcclxuY29uc3QgcGFyc2VJbW9kID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcImltb2RcIiwgTW9kdWxhdG9yTGlzdCwgbSA9PiBtLmlzRW5kKVxyXG5jb25zdCBwYXJzZVBnZW4gPSAoY2h1bmssIGRhdGEpID0+IHBhcnNlQ2h1bmsoY2h1bmssIGRhdGEsIFwicGdlblwiLCBHZW5lcmF0b3JMaXN0LCBnID0+IGcuaXNFbmQpXHJcbmNvbnN0IHBhcnNlSWdlbiA9IChjaHVuaywgZGF0YSkgPT4gcGFyc2VDaHVuayhjaHVuaywgZGF0YSwgXCJpZ2VuXCIsIEdlbmVyYXRvckxpc3QsIGcgPT4gZy5pc0VuZClcclxuY29uc3QgcGFyc2VTaGRyID0gKGNodW5rLCBkYXRhKSA9PiBwYXJzZUNodW5rKGNodW5rLCBkYXRhLCBcInNoZHJcIiwgU2FtcGxlSGVhZGVyLCBzID0+IHMuaXNFbmQpXHJcblxyXG5mdW5jdGlvbiBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgc2FtcGxlUmF0ZSkge1xyXG4gIGxldCBtdWx0aXBseSA9IDFcclxuXHJcbiAgLy8gYnVmZmVyXHJcbiAgd2hpbGUgKHNhbXBsZVJhdGUgPCAyMjA1MCkge1xyXG4gICAgY29uc3QgbmV3U2FtcGxlID0gbmV3IEludDE2QXJyYXkoc2FtcGxlLmxlbmd0aCAqIDIpXHJcbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDAsIGlsID0gc2FtcGxlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV1cclxuICAgIH1cclxuICAgIHNhbXBsZSA9IG5ld1NhbXBsZVxyXG4gICAgbXVsdGlwbHkgKj0gMlxyXG4gICAgc2FtcGxlUmF0ZSAqPSAyXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2FtcGxlLFxyXG4gICAgbXVsdGlwbHlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRTYW1wbGUoc2FtcGxlSGVhZGVyOiBTYW1wbGVIZWFkZXJbXSwgc2FtcGxpbmdEYXRhT2Zmc2V0OiBudW1iZXIsIGRhdGE6IFVpbnQ4QXJyYXkpOiBJbnQxNkFycmF5W10ge1xyXG4gIHJldHVybiBzYW1wbGVIZWFkZXIubWFwKGhlYWRlciA9PiB7XHJcbiAgICBsZXQgc2FtcGxlID0gbmV3IEludDE2QXJyYXkobmV3IFVpbnQ4QXJyYXkoZGF0YS5zdWJhcnJheShcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLnN0YXJ0ICogMixcclxuICAgICAgc2FtcGxpbmdEYXRhT2Zmc2V0ICsgaGVhZGVyLmVuZCAgICogMlxyXG4gICAgKSkuYnVmZmVyKVxyXG4gICAgaWYgKGhlYWRlci5zYW1wbGVSYXRlID4gMCkge1xyXG4gICAgICBjb25zdCBhZGp1c3QgPSBhZGp1c3RTYW1wbGVEYXRhKHNhbXBsZSwgaGVhZGVyLnNhbXBsZVJhdGUpXHJcbiAgICAgIHNhbXBsZSA9IGFkanVzdC5zYW1wbGVcclxuICAgICAgaGVhZGVyLnNhbXBsZVJhdGUgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5sb29wU3RhcnQgKj0gYWRqdXN0Lm11bHRpcGx5XHJcbiAgICAgIGhlYWRlci5sb29wRW5kICo9IGFkanVzdC5tdWx0aXBseVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNhbXBsZVxyXG4gIH0pXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGFyc2VyLnRzIiwiaW1wb3J0IFN0cmVhbSBmcm9tIFwiLi9TdHJlYW1cIlxyXG5cclxuZnVuY3Rpb24gcGFyc2VDaHVuayhpbnB1dDogVWludDhBcnJheSwgaXA6IG51bWJlciwgYmlnRW5kaWFuOiBib29sZWFuKTogQ2h1bmsge1xyXG4gIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oaW5wdXQsIGlwKVxyXG4gIGNvbnN0IHR5cGUgPSBzdHJlYW0ucmVhZFN0cmluZyg0KVxyXG4gIGNvbnN0IHNpemUgPSBzdHJlYW0ucmVhZERXT1JEKGJpZ0VuZGlhbilcclxuICByZXR1cm4gbmV3IENodW5rKHR5cGUsIHNpemUsIHN0cmVhbS5pcClcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcclxuICBwYWRkaW5nPzogYm9vbGVhbixcclxuICBiaWdFbmRpYW4/OiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJpZmYoaW5wdXQ6IFVpbnQ4QXJyYXksIGluZGV4OiBudW1iZXIgPSAwLCBsZW5ndGg6IG51bWJlciwgeyBwYWRkaW5nID0gdHJ1ZSwgYmlnRW5kaWFuID0gZmFsc2UgfTogT3B0aW9ucyA9IHt9KSB7XHJcbiAgY29uc3QgY2h1bmtMaXN0OiBDaHVua1tdID0gW11cclxuICBjb25zdCBlbmQgPSBsZW5ndGggKyBpbmRleFxyXG4gIGxldCBpcCA9IGluZGV4XHJcblxyXG4gIHdoaWxlIChpcCA8IGVuZCkge1xyXG4gICAgY29uc3QgY2h1bmsgPSBwYXJzZUNodW5rKGlucHV0LCBpcCwgYmlnRW5kaWFuKVxyXG4gICAgaXAgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplXHJcbiAgICBcclxuICAgIC8vIHBhZGRpbmdcclxuICAgIGlmIChwYWRkaW5nICYmICgoaXAgLSBpbmRleCkgJiAxKSA9PT0gMSkge1xyXG4gICAgICBpcCsrXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNodW5rTGlzdC5wdXNoKGNodW5rKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNodW5rTGlzdFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2h1bmsge1xyXG4gIHR5cGU6IHN0cmluZ1xyXG4gIHNpemU6IG51bWJlclxyXG4gIG9mZnNldDogbnVtYmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgc2l6ZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgdGhpcy5zaXplID0gc2l6ZVxyXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JpZmZQYXJzZXIudHMiLCJleHBvcnQgY29uc3QgR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlID0gW1xyXG4gICdzdGFydEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kQWRkcnNPZmZzZXQnLFxyXG4gICdzdGFydGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ2VuZGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1BpdGNoJyxcclxuICAndmliTGZvVG9QaXRjaCcsXHJcbiAgJ21vZEVudlRvUGl0Y2gnLFxyXG4gICdpbml0aWFsRmlsdGVyRmMnLFxyXG4gICdpbml0aWFsRmlsdGVyUScsXHJcbiAgJ21vZExmb1RvRmlsdGVyRmMnLFxyXG4gICdtb2RFbnZUb0ZpbHRlckZjJyxcclxuICAnZW5kQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1ZvbHVtZScsXHJcbiAgdW5kZWZpbmVkLCAvLyAxNFxyXG4gICdjaG9ydXNFZmZlY3RzU2VuZCcsXHJcbiAgJ3JldmVyYkVmZmVjdHNTZW5kJyxcclxuICAncGFuJyxcclxuICB1bmRlZmluZWQsdW5kZWZpbmVkLHVuZGVmaW5lZCwgLy8gMTgsMTksMjBcclxuICAnZGVsYXlNb2RMRk8nLFxyXG4gICdmcmVxTW9kTEZPJyxcclxuICAnZGVsYXlWaWJMRk8nLFxyXG4gICdmcmVxVmliTEZPJyxcclxuICAnZGVsYXlNb2RFbnYnLFxyXG4gICdhdHRhY2tNb2RFbnYnLFxyXG4gICdob2xkTW9kRW52JyxcclxuICAnZGVjYXlNb2RFbnYnLFxyXG4gICdzdXN0YWluTW9kRW52JyxcclxuICAncmVsZWFzZU1vZEVudicsXHJcbiAgJ2tleW51bVRvTW9kRW52SG9sZCcsXHJcbiAgJ2tleW51bVRvTW9kRW52RGVjYXknLFxyXG4gICdkZWxheVZvbEVudicsXHJcbiAgJ2F0dGFja1ZvbEVudicsXHJcbiAgJ2hvbGRWb2xFbnYnLFxyXG4gICdkZWNheVZvbEVudicsXHJcbiAgJ3N1c3RhaW5Wb2xFbnYnLFxyXG4gICdyZWxlYXNlVm9sRW52JyxcclxuICAna2V5bnVtVG9Wb2xFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Wb2xFbnZEZWNheScsXHJcbiAgJ2luc3RydW1lbnQnLFxyXG4gIHVuZGVmaW5lZCwgLy8gNDJcclxuICAna2V5UmFuZ2UnLFxyXG4gICd2ZWxSYW5nZScsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAna2V5bnVtJyxcclxuICAndmVsb2NpdHknLFxyXG4gICdpbml0aWFsQXR0ZW51YXRpb24nLFxyXG4gIHVuZGVmaW5lZCwgLy8gNDlcclxuICAnZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnY29hcnNlVHVuZScsXHJcbiAgJ2ZpbmVUdW5lJyxcclxuICAnc2FtcGxlSUQnLFxyXG4gICdzYW1wbGVNb2RlcycsXHJcbiAgdW5kZWZpbmVkLCAvLyA1NVxyXG4gICdzY2FsZVR1bmluZycsXHJcbiAgJ2V4Y2x1c2l2ZUNsYXNzJyxcclxuICAnb3ZlcnJpZGluZ1Jvb3RLZXknXHJcbl1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbnN0YW50cy50cyIsImltcG9ydCBXZWJNaWRpTGluayBmcm9tIFwiLi4vc3JjL1dlYk1pZGlMaW5rLnRzXCJcclxuaW1wb3J0IFN5bnRoZXNpemVyIGZyb20gXCIuLi9zcmMvU3ludGhlc2l6ZXIudHNcIlxyXG5pbXBvcnQgVmlldyBmcm9tIFwiLi4vc3JjL1ZpZXcudHNcIlxyXG5pbXBvcnQgTWlkaU1lc3NhZ2VIYW5kbGVyLCB7IExpc3RlbmVyIGFzIE1pZGlNZXNzYWdlTGlzdGVuZXIgfSBmcm9tIFwiLi4vc3JjL01pZGlNZXNzYWdlSGFuZGxlci50c1wiXHJcbmltcG9ydCBkZWxlZ2F0ZVByb3h5IGZyb20gXCIuLi9zcmMvZGVsZWdhdGVQcm94eS50c1wiXHJcblxyXG5leHBvcnQge1xyXG4gIFdlYk1pZGlMaW5rLFxyXG4gIFN5bnRoZXNpemVyLFxyXG4gIFZpZXcsXHJcbiAgTWlkaU1lc3NhZ2VIYW5kbGVyLFxyXG4gIE1pZGlNZXNzYWdlTGlzdGVuZXIsXHJcbiAgZGVsZWdhdGVQcm94eVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2V4cG9ydC9zeW50aC5qcyIsImltcG9ydCBTeW50aGVzaXplciBmcm9tIFwiLi9TeW50aGVzaXplclwiXHJcbmltcG9ydCBWaWV3IGZyb20gXCIuL1ZpZXdcIlxyXG5pbXBvcnQgTWlkaU1lc3NhZ2VIYW5kbGVyLCB7IExpc3RlbmVyIH0gZnJvbSBcIi4vTWlkaU1lc3NhZ2VIYW5kbGVyXCJcclxuaW1wb3J0IGRlbGVnYXRlUHJveHkgZnJvbSBcIi4vZGVsZWdhdGVQcm94eVwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJNaWRpTGluayB7XHJcbiAgbG9hZENhbGxiYWNrOiAoQXJyYXlCdWZmZXIpID0+IHZvaWRcclxuICBtaWRpTWVzc2FnZUhhbmRsZXI6IE1pZGlNZXNzYWdlSGFuZGxlclxyXG4gIHJlYWR5OiBib29sZWFuID0gZmFsc2VcclxuICBzeW50aDogU3ludGhlc2l6ZXJcclxuICB2aWV3OiBWaWV3XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5taWRpTWVzc2FnZUhhbmRsZXIgPSBuZXcgTWlkaU1lc3NhZ2VIYW5kbGVyKClcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLnJlYWR5ID0gdHJ1ZVxyXG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSlcclxuICB9XHJcblxyXG4gIHNldHVwKHVybCkge1xyXG4gICAgaWYgKCF0aGlzLnJlYWR5KSB7XHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gb25sb2FkKCkge1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgb25sb2FkLCBmYWxzZSlcclxuICAgICAgICB0aGlzLmxvYWQodXJsKVxyXG4gICAgICB9LmJpbmQodGhpcyksIGZhbHNlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sb2FkKHVybClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWQodXJsKSB7XHJcbiAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxyXG5cclxuICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpXHJcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJ1xyXG5cclxuICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oZXYpIHtcclxuICAgICAgY29uc3QgeGhyID0gZXYudGFyZ2V0IGFzIFhNTEh0dHBSZXF1ZXN0XHJcblxyXG4gICAgICB0aGlzLm9ubG9hZCh4aHIucmVzcG9uc2UpXHJcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5sb2FkQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0aGlzLmxvYWRDYWxsYmFjayh4aHIucmVzcG9uc2UpXHJcbiAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpXHJcblxyXG4gICAgeGhyLnNlbmQoKVxyXG4gIH1cclxuXHJcbiAgb25sb2FkKHJlc3BvbnNlOiBBcnJheUJ1ZmZlcikge1xyXG4gICAgY29uc3QgaW5wdXQgPSBuZXcgVWludDhBcnJheShyZXNwb25zZSlcclxuICAgIHRoaXMubG9hZFNvdW5kRm9udChpbnB1dClcclxuICB9XHJcblxyXG4gIGxvYWRTb3VuZEZvbnQoaW5wdXQ6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGxldCBzeW50aDogU3ludGhlc2l6ZXJcclxuXHJcbiAgICBpZiAoIXRoaXMuc3ludGgpIHtcclxuICAgICAgY29uc3QgY3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpXHJcbiAgICAgIHN5bnRoID0gdGhpcy5zeW50aCA9IG5ldyBTeW50aGVzaXplcihjdHgpXHJcbiAgICAgIHN5bnRoLmNvbm5lY3QoY3R4LmRlc3RpbmF0aW9uKVxyXG4gICAgICBjb25zdCB2aWV3ID0gdGhpcy52aWV3ID0gbmV3IFZpZXcoKVxyXG4gICAgICBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoXCIuc3ludGhcIikhLmFwcGVuZENoaWxkKHZpZXcuZHJhdyhzeW50aCkpXHJcbiAgICAgIHRoaXMubWlkaU1lc3NhZ2VIYW5kbGVyLmxpc3RlbmVyID0gZGVsZWdhdGVQcm94eTxMaXN0ZW5lcj4oW3N5bnRoLCB2aWV3XSkgXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5vbm1lc3NhZ2UuYmluZCh0aGlzKSwgZmFsc2UpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzeW50aCA9IHRoaXMuc3ludGhcclxuICAgIH1cclxuICAgIHN5bnRoLmxvYWRTb3VuZEZvbnQoaW5wdXQpXHJcblxyXG4gICAgLy8gbGluayByZWFkeVxyXG4gICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcclxuICAgICAgd2luZG93Lm9wZW5lci5wb3N0TWVzc2FnZShcImxpbmsscmVhZHlcIiwgJyonKVxyXG4gICAgfSBlbHNlIGlmICh3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShcImxpbmsscmVhZHlcIiwgJyonKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25tZXNzYWdlKGV2OiBNZXNzYWdlRXZlbnQpIHtcclxuICAgIGNvbnN0IG1zZyA9IGV2LmRhdGEuc3BsaXQoJywnKVxyXG4gICAgY29uc3QgdHlwZSA9IG1zZy5zaGlmdCgpXHJcblxyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgJ21pZGknOlxyXG4gICAgICAgIHRoaXMubWlkaU1lc3NhZ2VIYW5kbGVyLnByb2Nlc3NNaWRpTWVzc2FnZShcclxuICAgICAgICAgIG1zZy5tYXAoZnVuY3Rpb24oaGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChoZXgsIDE2KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnbGluayc6XHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG1zZy5zaGlmdCgpXHJcbiAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XHJcbiAgICAgICAgICBjYXNlICdyZXFwYXRjaCc6XHJcbiAgICAgICAgICAgIC8vIFRPRE86IGR1bW15IGRhdGFcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5vcGVuZXIpIHtcclxuICAgICAgICAgICAgICB3aW5kb3cub3BlbmVyLnBvc3RNZXNzYWdlKFwibGluayxwYXRjaFwiLCAnKicpXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2luZG93LnBhcmVudCAhPT0gd2luZG93KSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShcImxpbmsscGF0Y2hcIiwgJyonKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlICdzZXRwYXRjaCc6XHJcbiAgICAgICAgICAgIC8vIFRPRE86IE5PUFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcigndW5rbm93biBsaW5rIG1lc3NhZ2U6JywgY29tbWFuZClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zb2xlLmVycm9yKCd1bmtub3duIG1lc3NhZ2UgdHlwZScpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRMb2FkQ2FsbGJhY2soY2FsbGJhY2s6IChBcnJheUJ1ZmZlcikgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5sb2FkQ2FsbGJhY2sgPSBjYWxsYmFja1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvV2ViTWlkaUxpbmsudHMiLCJpbXBvcnQgU3ludGhlc2l6ZXJOb3RlIGZyb20gXCIuL1N5bnRoZXNpemVyTm90ZVwiXHJcbmltcG9ydCBwYXJzZSBmcm9tIFwiLi9QYXJzZXJcIlxyXG5pbXBvcnQgU291bmRGb250IGZyb20gXCIuL1NvdW5kRm9udFwiXHJcbmltcG9ydCB7IEluc3RydW1lbnRTdGF0ZSB9IGZyb20gXCIuL1N5bnRoZXNpemVyTm90ZVwiXHJcbmltcG9ydCB7IExpc3RlbmVyIH0gZnJvbSBcIi4vTWlkaU1lc3NhZ2VIYW5kbGVyXCJcclxuXHJcbmNvbnN0IEJBU0VfVk9MVU1FID0gMC40XHJcblxyXG5jbGFzcyBDaGFubmVsIHtcclxuICBpbnN0cnVtZW50ID0gMFxyXG4gIHZvbHVtZSA9IDBcclxuICBwaXRjaEJlbmQgPSAwXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPSAwXHJcbiAgcGFucG90ID0gMFxyXG4gIGN1cnJlbnROb3RlT246IFN5bnRoZXNpemVyTm90ZVtdID0gW11cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ludGhlc2l6ZXIgaW1wbGVtZW50cyBMaXN0ZW5lciB7XHJcbiAgYmFuazogbnVtYmVyID0gMFxyXG4gIGJ1ZmZlclNpemU6IG51bWJlciA9IDEwMjRcclxuICBjdHg6IEF1ZGlvQ29udGV4dFxyXG4gIGdhaW5NYXN0ZXI6IEdhaW5Ob2RlXHJcbiAgY2hhbm5lbHM6IENoYW5uZWxbXSA9IFtdXHJcbiAgbWFzdGVyVm9sdW1lOiBudW1iZXIgPSAxLjBcclxuICBzb3VuZEZvbnQ6IFNvdW5kRm9udFxyXG5cclxuICBjb25zdHJ1Y3RvcihjdHgpIHtcclxuICAgIHRoaXMuY3R4ID0gY3R4XHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIgPSB0aGlzLmN0eC5jcmVhdGVHYWluKClcclxuICAgIHRoaXMuc2V0TWFzdGVyVm9sdW1lKHRoaXMubWFzdGVyVm9sdW1lKVxyXG4gICAgdGhpcy5pbml0KClcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcclxuICAgICAgdGhpcy5jaGFubmVscy5wdXNoKG5ldyBDaGFubmVsKCkpXHJcbiAgICAgIHRoaXMucHJvZ3JhbUNoYW5nZShpLCBpICE9PSA5ID8gaSA6IDApXHJcbiAgICAgIHRoaXMudm9sdW1lQ2hhbmdlKGksIDB4NjQpXHJcbiAgICAgIHRoaXMucGFucG90Q2hhbmdlKGksIDB4NDApXHJcbiAgICAgIHRoaXMucGl0Y2hCZW5kKGksIDApXHJcbiAgICAgIHRoaXMucGl0Y2hCZW5kU2Vuc2l0aXZpdHkoaSwgMilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWRTb3VuZEZvbnQoaW5wdXQ6IFVpbnQ4QXJyYXkpIHtcclxuICAgIGNvbnN0IHBhcnNlciA9IHBhcnNlKGlucHV0KVxyXG4gICAgdGhpcy5zb3VuZEZvbnQgPSBuZXcgU291bmRGb250KHBhcnNlcilcclxuICB9XHJcblxyXG4gIGNvbm5lY3QoZGVzdGluYXRpb246IEF1ZGlvTm9kZSkge1xyXG4gICAgdGhpcy5nYWluTWFzdGVyLmNvbm5lY3QoZGVzdGluYXRpb24pXHJcbiAgfVxyXG5cclxuICBzZXRNYXN0ZXJWb2x1bWUodm9sdW1lOiBudW1iZXIpIHtcclxuICAgIHRoaXMubWFzdGVyVm9sdW1lID0gdm9sdW1lXHJcbiAgICB0aGlzLmdhaW5NYXN0ZXIuZ2Fpbi52YWx1ZSA9IEJBU0VfVk9MVU1FICogdm9sdW1lIC8gMHg4MDAwXHJcbiAgfVxyXG5cclxuICBub3RlT24oY2hhbm5lbE51bWJlcjogbnVtYmVyLCBrZXk6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnNvdW5kRm9udCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBjaGFubmVsTnVtYmVyID09PSA5ID8gMTI4IDogdGhpcy5iYW5rXHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGNvbnN0IG5vdGVJbmZvID0gdGhpcy5zb3VuZEZvbnQuZ2V0SW5zdHJ1bWVudEtleShiYW5rTnVtYmVyLCBjaGFubmVsLmluc3RydW1lbnQsIGtleSwgdmVsb2NpdHkpXHJcblxyXG4gICAgaWYgKCFub3RlSW5mbykge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBsZXQgcGFucG90ID0gY2hhbm5lbC5wYW5wb3QgLSA2NFxyXG4gICAgcGFucG90IC89IHBhbnBvdCA8IDAgPyA2NCA6IDYzXHJcblxyXG4gICAgLy8gY3JlYXRlIG5vdGUgaW5mb3JtYXRpb25cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXk6IEluc3RydW1lbnRTdGF0ZSA9IHtcclxuICAgICAgY2hhbm5lbDogY2hhbm5lbE51bWJlcixcclxuICAgICAga2V5OiBrZXksXHJcbiAgICAgIHZlbG9jaXR5OiB2ZWxvY2l0eSxcclxuICAgICAgcGFucG90OiBwYW5wb3QsXHJcbiAgICAgIHZvbHVtZTogY2hhbm5lbC52b2x1bWUgLyAxMjcsXHJcbiAgICAgIHBpdGNoQmVuZDogY2hhbm5lbC5waXRjaEJlbmQgLSAweDIwMDAsXHJcbiAgICAgIHBpdGNoQmVuZFNlbnNpdGl2aXR5OiBjaGFubmVsLnBpdGNoQmVuZFNlbnNpdGl2aXR5XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbm90ZSBvblxyXG4gICAgY29uc3Qgbm90ZSA9IG5ldyBTeW50aGVzaXplck5vdGUodGhpcy5jdHgsIHRoaXMuZ2Fpbk1hc3Rlciwgbm90ZUluZm8sIGluc3RydW1lbnRLZXkpXHJcbiAgICBub3RlLm5vdGVPbigpXHJcbiAgICBjaGFubmVsLmN1cnJlbnROb3RlT24ucHVzaChub3RlKVxyXG4gIH1cclxuXHJcbiAgbm90ZU9mZihjaGFubmVsTnVtYmVyOiBudW1iZXIsIGtleTogbnVtYmVyLCBfdmVsb2NpdHk6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnNvdW5kRm9udCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGJhbmtOdW1iZXIgPSBjaGFubmVsTnVtYmVyID09PSA5ID8gMTI4IDogdGhpcy5iYW5rXHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGNvbnN0IGluc3RydW1lbnRLZXkgPSB0aGlzLnNvdW5kRm9udC5nZXRJbnN0cnVtZW50S2V5KGJhbmtOdW1iZXIsIGNoYW5uZWwuaW5zdHJ1bWVudCwga2V5KVxyXG5cclxuICAgIGlmICghaW5zdHJ1bWVudEtleSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjdXJyZW50Tm90ZU9uID0gY2hhbm5lbC5jdXJyZW50Tm90ZU9uXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGlsID0gY3VycmVudE5vdGVPbi5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XHJcbiAgICAgIGNvbnN0IG5vdGUgPSBjdXJyZW50Tm90ZU9uW2ldXHJcbiAgICAgIGlmIChub3RlLmtleSA9PT0ga2V5KSB7XHJcbiAgICAgICAgbm90ZS5ub3RlT2ZmKClcclxuICAgICAgICBjdXJyZW50Tm90ZU9uLnNwbGljZShpLCAxKVxyXG4gICAgICAgIC0taVxyXG4gICAgICAgIC0taWxcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvZ3JhbUNoYW5nZShjaGFubmVsTnVtYmVyOiBudW1iZXIsIGluc3RydW1lbnQ6IG51bWJlcikge1xyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS5pbnN0cnVtZW50ID0gaW5zdHJ1bWVudFxyXG4gIH1cclxuXHJcbiAgdm9sdW1lQ2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgdm9sdW1lOiBudW1iZXIpIHtcclxuICAgIHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl0udm9sdW1lID0gdm9sdW1lXHJcbiAgfVxyXG5cclxuICBwYW5wb3RDaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBwYW5wb3Q6IG51bWJlcikge1xyXG4gICAgdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXS5wYW5wb3QgPSBwYW5wb3RcclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZChjaGFubmVsTnVtYmVyOiBudW1iZXIsIHBpdGNoQmVuZDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5jaGFubmVsc1tjaGFubmVsTnVtYmVyXVxyXG5cclxuICAgIGZvciAobGV0IG5vdGUgb2YgY2hhbm5lbC5jdXJyZW50Tm90ZU9uKSB7XHJcbiAgICAgIG5vdGUudXBkYXRlUGl0Y2hCZW5kKHBpdGNoQmVuZClcclxuICAgIH1cclxuXHJcbiAgICBjaGFubmVsLnBpdGNoQmVuZCA9IHBpdGNoQmVuZFxyXG4gIH1cclxuXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBzZW5zaXRpdml0eTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxOdW1iZXJdLnBpdGNoQmVuZFNlbnNpdGl2aXR5ID0gc2Vuc2l0aXZpdHlcclxuICB9XHJcblxyXG4gIGFsbFNvdW5kT2ZmKGNoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gICAgY29uc3QgY3VycmVudE5vdGVPbiA9IHRoaXMuY2hhbm5lbHNbY2hhbm5lbE51bWJlcl0uY3VycmVudE5vdGVPblxyXG5cclxuICAgIHdoaWxlIChjdXJyZW50Tm90ZU9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5ub3RlT2ZmKGNoYW5uZWxOdW1iZXIsIGN1cnJlbnROb3RlT25bMF0ua2V5LCAwKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzZXRBbGxDb250cm9sKGNoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gICAgdGhpcy5waXRjaEJlbmQoY2hhbm5lbE51bWJlciwgMClcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1N5bnRoZXNpemVyLnRzIiwiaW1wb3J0IHsgTm90ZUluZm8gfSBmcm9tIFwiLi9Tb3VuZEZvbnRcIlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnN0cnVtZW50U3RhdGUge1xyXG4gIGNoYW5uZWw6IG51bWJlclxyXG4gIGtleTogbnVtYmVyXHJcbiAgdm9sdW1lOiBudW1iZXJcclxuICBwYW5wb3Q6IG51bWJlclxyXG4gIHZlbG9jaXR5OiBudW1iZXJcclxuICBwaXRjaEJlbmQ6IG51bWJlclxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5OiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ludGhlc2l6ZXJOb3RlIHtcclxuXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAvLyBhdWRpbyBub2RlXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgYXVkaW9CdWZmZXI6IEF1ZGlvQnVmZmVyXHJcbiAgYnVmZmVyU291cmNlOiBBdWRpb0J1ZmZlclNvdXJjZU5vZGVcclxuICBwYW5uZXI6IFBhbm5lck5vZGVcclxuICBnYWluT3V0cHV0OiBHYWluTm9kZVxyXG4gIGN0eDogQXVkaW9Db250ZXh0XHJcbiAgZGVzdGluYXRpb246IEF1ZGlvTm9kZVxyXG4gIGZpbHRlcjogQmlxdWFkRmlsdGVyTm9kZVxyXG4gIG5vdGVJbmZvOiBOb3RlSW5mb1xyXG4gIGluc3RydW1lbnQ6IEluc3RydW1lbnRTdGF0ZVxyXG4gIGNoYW5uZWw6IG51bWJlclxyXG4gIGtleTogbnVtYmVyXHJcbiAgdmVsb2NpdHk6IG51bWJlclxyXG4gIHBsYXliYWNrUmF0ZTogbnVtYmVyXHJcbiAgdm9sdW1lOiBudW1iZXJcclxuICBwYW5wb3Q6IG51bWJlclxyXG4gIHBpdGNoQmVuZDogbnVtYmVyXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHk6IG51bWJlclxyXG5cclxuICAvLyBzdGF0ZVxyXG4gIHN0YXJ0VGltZTogbnVtYmVyXHJcbiAgY29tcHV0ZWRQbGF5YmFja1JhdGU6IG51bWJlclxyXG5cclxuICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCwgZGVzdGluYXRpb246IEF1ZGlvTm9kZSwgbm90ZUluZm86IE5vdGVJbmZvLCBpbnN0cnVtZW50OiBJbnN0cnVtZW50U3RhdGUpIHtcclxuICAgIHRoaXMuY3R4ID0gY3R4XHJcbiAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb25cclxuICAgIHRoaXMubm90ZUluZm8gPSBub3RlSW5mb1xyXG4gICAgdGhpcy5wbGF5YmFja1JhdGUgPSBub3RlSW5mby5wbGF5YmFja1JhdGUoaW5zdHJ1bWVudC5rZXkpXHJcbiAgICB0aGlzLmluc3RydW1lbnQgPSBpbnN0cnVtZW50XHJcbiAgICB0aGlzLmNoYW5uZWwgPSBpbnN0cnVtZW50LmNoYW5uZWxcclxuICAgIHRoaXMua2V5ID0gaW5zdHJ1bWVudC5rZXlcclxuICAgIHRoaXMudmVsb2NpdHkgPSBpbnN0cnVtZW50LnZlbG9jaXR5XHJcbiAgICB0aGlzLnZvbHVtZSA9IGluc3RydW1lbnQudm9sdW1lXHJcbiAgICB0aGlzLnBhbnBvdCA9IGluc3RydW1lbnQucGFucG90XHJcbiAgICB0aGlzLnBpdGNoQmVuZCA9IGluc3RydW1lbnQucGl0Y2hCZW5kXHJcbiAgICB0aGlzLnBpdGNoQmVuZFNlbnNpdGl2aXR5ID0gaW5zdHJ1bWVudC5waXRjaEJlbmRTZW5zaXRpdml0eVxyXG4gICAgdGhpcy5zdGFydFRpbWUgPSBjdHguY3VycmVudFRpbWVcclxuICAgIHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUgPSB0aGlzLnBsYXliYWNrUmF0ZVxyXG4gIH1cclxuXHJcbiAgbm90ZU9uKCkge1xyXG4gICAgY29uc3QgeyBjdHgsIG5vdGVJbmZvIH0gPSB0aGlzXHJcblxyXG4gICAgY29uc3Qgc2FtcGxlID0gbm90ZUluZm8uc2FtcGxlLnN1YmFycmF5KDAsIG5vdGVJbmZvLnNhbXBsZS5sZW5ndGggKyBub3RlSW5mby5lbmQpXHJcbiAgICB0aGlzLmF1ZGlvQnVmZmVyID0gY3R4LmNyZWF0ZUJ1ZmZlcigxLCBzYW1wbGUubGVuZ3RoLCBub3RlSW5mby5zYW1wbGVSYXRlKVxyXG5cclxuICAgIGNvbnN0IGNoYW5uZWxEYXRhID0gdGhpcy5hdWRpb0J1ZmZlci5nZXRDaGFubmVsRGF0YSgwKVxyXG4gICAgY2hhbm5lbERhdGEuc2V0KHNhbXBsZSlcclxuXHJcbiAgICAvLyBidWZmZXIgc291cmNlXHJcbiAgICBjb25zdCBidWZmZXJTb3VyY2UgPSBjdHguY3JlYXRlQnVmZmVyU291cmNlKClcclxuICAgIGJ1ZmZlclNvdXJjZS5idWZmZXIgPSB0aGlzLmF1ZGlvQnVmZmVyXHJcbiAgICBidWZmZXJTb3VyY2UubG9vcCA9ICh0aGlzLmNoYW5uZWwgIT09IDkpXHJcbiAgICBidWZmZXJTb3VyY2UubG9vcFN0YXJ0ID0gbm90ZUluZm8ubG9vcFN0YXJ0IC8gbm90ZUluZm8uc2FtcGxlUmF0ZVxyXG4gICAgYnVmZmVyU291cmNlLmxvb3BFbmQgPSBub3RlSW5mby5sb29wRW5kIC8gbm90ZUluZm8uc2FtcGxlUmF0ZVxyXG4gICAgYnVmZmVyU291cmNlLm9uZW5kZWQgPSAoKSA9PiB0aGlzLmRpc2Nvbm5lY3QoKVxyXG4gICAgdGhpcy5idWZmZXJTb3VyY2UgPSBidWZmZXJTb3VyY2VcclxuICAgIHRoaXMudXBkYXRlUGl0Y2hCZW5kKHRoaXMucGl0Y2hCZW5kKVxyXG5cclxuICAgIC8vIGF1ZGlvIG5vZGVcclxuICAgIGNvbnN0IHBhbm5lciA9IHRoaXMucGFubmVyID0gY3R4LmNyZWF0ZVBhbm5lcigpXHJcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmdhaW5PdXRwdXQgPSBjdHguY3JlYXRlR2FpbigpXHJcbiAgICBjb25zdCBvdXRwdXRHYWluID0gb3V0cHV0LmdhaW5cclxuXHJcbiAgICAvLyBmaWx0ZXJcclxuICAgIGNvbnN0IGZpbHRlciA9IGN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKVxyXG4gICAgZmlsdGVyLnR5cGUgPSBcImxvd3Bhc3NcIlxyXG4gICAgdGhpcy5maWx0ZXIgPSBmaWx0ZXJcclxuXHJcbiAgICAvLyBwYW5wb3RcclxuICAgIHBhbm5lci5wYW5uaW5nTW9kZWwgPSBcImVxdWFscG93ZXJcIlxyXG4gICAgcGFubmVyLnNldFBvc2l0aW9uKFxyXG4gICAgICBNYXRoLnNpbih0aGlzLnBhbnBvdCAqIE1hdGguUEkgLyAyKSxcclxuICAgICAgMCxcclxuICAgICAgTWF0aC5jb3ModGhpcy5wYW5wb3QgKiBNYXRoLlBJIC8gMilcclxuICAgIClcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gQXR0YWNrLCBEZWNheSwgU3VzdGFpblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGNvbnN0IG5vdyA9IHRoaXMuY3R4LmN1cnJlbnRUaW1lXHJcbiAgICBjb25zdCB2b2xBdHRhY2tUaW1lID0gbm93ICsgbm90ZUluZm8udm9sQXR0YWNrXHJcbiAgICBjb25zdCBtb2RBdHRhY2tUaW1lID0gbm93ICsgbm90ZUluZm8ubW9kQXR0YWNrXHJcbiAgICBjb25zdCB2b2xEZWNheSA9IHZvbEF0dGFja1RpbWUgKyBub3RlSW5mby52b2xEZWNheVxyXG4gICAgY29uc3QgbW9kRGVjYXkgPSBtb2RBdHRhY2tUaW1lICsgbm90ZUluZm8ubW9kRGVjYXlcclxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5vdGVJbmZvLnN0YXJ0IC8gbm90ZUluZm8uc2FtcGxlUmF0ZVxyXG5cclxuICAgIGNvbnN0IGF0dGFja1ZvbHVtZSA9IHRoaXMudm9sdW1lICogKHRoaXMudmVsb2NpdHkgLyAxMjcpXHJcbiAgICBvdXRwdXRHYWluLnNldFZhbHVlQXRUaW1lKDAsIG5vdylcclxuICAgIG91dHB1dEdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoYXR0YWNrVm9sdW1lLCB2b2xBdHRhY2tUaW1lKVxyXG4gICAgb3V0cHV0R2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShhdHRhY2tWb2x1bWUgKiAoMSAtIG5vdGVJbmZvLnZvbFN1c3RhaW4pLCB2b2xEZWNheSlcclxuXHJcbiAgICBmaWx0ZXIuUS5zZXRWYWx1ZUF0VGltZShub3RlSW5mby5pbml0aWFsRmlsdGVyUSAvIDEwLCBub3cpXHJcbiAgICBjb25zdCBiYXNlRnJlcSA9IGFtb3VudFRvRnJlcShub3RlSW5mby5pbml0aWFsRmlsdGVyRmMpXHJcbiAgICBjb25zdCBwZWVrRnJlcSA9IGFtb3VudFRvRnJlcShub3RlSW5mby5pbml0aWFsRmlsdGVyRmMgKyBub3RlSW5mby5tb2RFbnZUb0ZpbHRlckZjKVxyXG4gICAgY29uc3Qgc3VzdGFpbkZyZXEgPSBiYXNlRnJlcSArIChwZWVrRnJlcSAtIGJhc2VGcmVxKSAqICgxIC0gbm90ZUluZm8ubW9kU3VzdGFpbilcclxuICAgIGZpbHRlci5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoYmFzZUZyZXEsIG5vdylcclxuICAgIGZpbHRlci5mcmVxdWVuY3kubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUocGVla0ZyZXEsIG1vZEF0dGFja1RpbWUpXHJcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHN1c3RhaW5GcmVxLCBtb2REZWNheSlcclxuXHJcbiAgICBmdW5jdGlvbiBhbW91bnRUb0ZyZXEodmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gTWF0aC5wb3coMiwgKHZhbCAtIDY5MDApIC8gMTIwMCkgKiA0NDBcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25uZWN0XHJcbiAgICBidWZmZXJTb3VyY2UuY29ubmVjdChmaWx0ZXIpXHJcbiAgICBmaWx0ZXIuY29ubmVjdChwYW5uZXIpXHJcbiAgICBwYW5uZXIuY29ubmVjdChvdXRwdXQpXHJcbiAgICBvdXRwdXQuY29ubmVjdCh0aGlzLmRlc3RpbmF0aW9uKVxyXG5cclxuICAgIC8vIGZpcmVcclxuICAgIGJ1ZmZlclNvdXJjZS5zdGFydCgwLCBzdGFydFRpbWUpXHJcbiAgfVxyXG5cclxuICBub3RlT2ZmKCkge1xyXG4gICAgY29uc3QgeyBub3RlSW5mbywgYnVmZmVyU291cmNlIH0gPSB0aGlzXHJcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmdhaW5PdXRwdXRcclxuICAgIGNvbnN0IG5vdyA9IHRoaXMuY3R4LmN1cnJlbnRUaW1lXHJcbiAgICBjb25zdCB2b2xFbmRUaW1lID0gbm93ICsgbm90ZUluZm8udm9sUmVsZWFzZVxyXG4gICAgY29uc3QgbW9kRW5kVGltZSA9IG5vdyArIG5vdGVJbmZvLm1vZFJlbGVhc2VcclxuXHJcbiAgICBpZiAoIXRoaXMuYXVkaW9CdWZmZXIpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWdub3JlIG5vdGUgb2ZmIGZvciByaHl0aG0gdHJhY2tcclxuICAgIGlmICh0aGlzLmNoYW5uZWwgPT09IDkpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFJlbGVhc2VcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBvdXRwdXQuZ2Fpbi5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoMClcclxuICAgIG91dHB1dC5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIHZvbEVuZFRpbWUpXHJcbiAgICBidWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLmNhbmNlbFNjaGVkdWxlZFZhbHVlcygwKVxyXG4gICAgYnVmZmVyU291cmNlLnBsYXliYWNrUmF0ZS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSh0aGlzLmNvbXB1dGVkUGxheWJhY2tSYXRlLCBtb2RFbmRUaW1lKVxyXG5cclxuICAgIGJ1ZmZlclNvdXJjZS5sb29wID0gZmFsc2VcclxuICAgIGJ1ZmZlclNvdXJjZS5zdG9wKHZvbEVuZFRpbWUpXHJcbiAgfVxyXG5cclxuICBkaXNjb25uZWN0KCkge1xyXG4gICAgdGhpcy5idWZmZXJTb3VyY2UuZGlzY29ubmVjdCgwKVxyXG4gICAgdGhpcy5wYW5uZXIuZGlzY29ubmVjdCgwKVxyXG4gICAgdGhpcy5nYWluT3V0cHV0LmRpc2Nvbm5lY3QoMClcclxuICB9XHJcblxyXG4gIHNjaGVkdWxlUGxheWJhY2tSYXRlKCkge1xyXG4gICAgY29uc3QgeyBub3RlSW5mbyB9ID0gdGhpc1xyXG4gICAgY29uc3QgcGxheWJhY2tSYXRlID0gdGhpcy5idWZmZXJTb3VyY2UucGxheWJhY2tSYXRlXHJcbiAgICBjb25zdCBjb21wdXRlZCA9IHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGVcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGFydFRpbWVcclxuICAgIGNvbnN0IG1vZEF0dGFjayA9IHN0YXJ0ICsgbm90ZUluZm8ubW9kQXR0YWNrXHJcbiAgICBjb25zdCBtb2REZWNheSA9IG1vZEF0dGFjayArIG5vdGVJbmZvLm1vZERlY2F5XHJcbiAgICBjb25zdCBwZWVrUGl0Y2ggPSBjb21wdXRlZCAqIE1hdGgucG93KFxyXG4gICAgICBNYXRoLnBvdygyLCAxIC8gMTIpLFxyXG4gICAgICBub3RlSW5mby5tb2RFbnZUb1BpdGNoICogbm90ZUluZm8uc2NhbGVUdW5pbmdcclxuICAgIClcclxuXHJcbiAgICBwbGF5YmFja1JhdGUuY2FuY2VsU2NoZWR1bGVkVmFsdWVzKDApXHJcbiAgICBwbGF5YmFja1JhdGUuc2V0VmFsdWVBdFRpbWUoY29tcHV0ZWQsIHN0YXJ0KVxyXG4gICAgcGxheWJhY2tSYXRlLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHBlZWtQaXRjaCwgbW9kQXR0YWNrKVxyXG4gICAgcGxheWJhY2tSYXRlLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKGNvbXB1dGVkICsgKHBlZWtQaXRjaCAtIGNvbXB1dGVkKSAqICgxIC0gbm90ZUluZm8ubW9kU3VzdGFpbiksIG1vZERlY2F5KVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUGl0Y2hCZW5kKHBpdGNoQmVuZDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNvbXB1dGVkUGxheWJhY2tSYXRlID0gdGhpcy5wbGF5YmFja1JhdGUgKiBNYXRoLnBvdyhcclxuICAgICAgTWF0aC5wb3coMiwgMSAvIDEyKSxcclxuICAgICAgKFxyXG4gICAgICAgIHRoaXMucGl0Y2hCZW5kU2Vuc2l0aXZpdHkgKiAoXHJcbiAgICAgICAgICBwaXRjaEJlbmQgLyAocGl0Y2hCZW5kIDwgMCA/IDgxOTIgOiA4MTkxKVxyXG4gICAgICAgIClcclxuICAgICAgKSAqIHRoaXMubm90ZUluZm8uc2NhbGVUdW5pbmdcclxuICAgIClcclxuICAgIHRoaXMuc2NoZWR1bGVQbGF5YmFja1JhdGUoKVxyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU3ludGhlc2l6ZXJOb3RlLnRzIiwiaW1wb3J0IHsgUGFyc2VSZXN1bHQgfSBmcm9tIFwiLi9QYXJzZXJcIlxyXG5pbXBvcnQgeyBSYW5nZVZhbHVlLCBHZW5lcmF0b3JMaXN0IH0gZnJvbSBcIi4vU3RydWN0c1wiXHJcblxyXG4vKipcclxuICogUGFyc2VyIOOBp+iqreOBv+i+vOOCk+OBoOOCteOCpuODs+ODieODleOCqeODs+ODiOOBruODh+ODvOOCv+OCklxyXG4gKiBTeW50aGVzaXplciDjgYvjgonliKnnlKjjgZfjgoTjgZnjgYTlvaLjgavjgZnjgovjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvdW5kRm9udCB7XHJcbiAgcHJpdmF0ZSBwYXJzZWQ6IFBhcnNlUmVzdWx0XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBhcnNlZDogUGFyc2VSZXN1bHQpIHtcclxuICAgIHRoaXMucGFyc2VkID0gcGFyc2VkXHJcbiAgfVxyXG5cclxuICBnZXRQcmVzZXRab25lKHByZXNldEhlYWRlckluZGV4OiBudW1iZXIpIHtcclxuICAgIGxldCBwcmVzZXRHZW5lcmF0b3JzOiBHZW5lcmF0b3JMaXN0W11cclxuICAgIGNvbnN0IHByZXNldEhlYWRlciA9IHRoaXMucGFyc2VkLnByZXNldEhlYWRlcnNbcHJlc2V0SGVhZGVySW5kZXhdXHJcbiAgICBjb25zdCBwcmVzZXRCYWcgPSB0aGlzLnBhcnNlZC5wcmVzZXRab25lW3ByZXNldEhlYWRlci5wcmVzZXRCYWdJbmRleF1cclxuXHJcbiAgICBjb25zdCBuZXh0UHJlc2V0SGVhZGVySW5kZXggPSBwcmVzZXRIZWFkZXJJbmRleCArIDFcclxuICAgIGlmIChuZXh0UHJlc2V0SGVhZGVySW5kZXggPCB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzLmxlbmd0aCkge1xyXG4gICAgICAvLyDmrKHjga4gcHJlc2V0IOOBvuOBp+OBruOBmeOBueOBpuOBriBnZW5lcmF0b3Ig44KS5Y+W5b6X44GZ44KLXHJcbiAgICAgIGNvbnN0IG5leHRQcmVzZXRIZWFkZXIgPSB0aGlzLnBhcnNlZC5wcmVzZXRIZWFkZXJzW25leHRQcmVzZXRIZWFkZXJJbmRleF1cclxuICAgICAgY29uc3QgbmV4dFByZXNldEJhZyA9IHRoaXMucGFyc2VkLnByZXNldFpvbmVbbmV4dFByZXNldEhlYWRlci5wcmVzZXRCYWdJbmRleF1cclxuICAgICAgcHJlc2V0R2VuZXJhdG9ycyA9IHRoaXMucGFyc2VkLnByZXNldEdlbmVyYXRvcnMuc2xpY2UocHJlc2V0QmFnLnByZXNldEdlbmVyYXRvckluZGV4LCBuZXh0UHJlc2V0QmFnLnByZXNldEdlbmVyYXRvckluZGV4KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8g5pyA5b6M44GuIHByZXNldCDjgaDjgaPjgZ/loLTlkIjjga/mnIDlvozjgb7jgaflj5blvpfjgZnjgotcclxuICAgICAgcHJlc2V0R2VuZXJhdG9ycyA9IHRoaXMucGFyc2VkLnByZXNldEdlbmVyYXRvcnMuc2xpY2UocHJlc2V0QmFnLnByZXNldEdlbmVyYXRvckluZGV4LCB0aGlzLnBhcnNlZC5wcmVzZXRHZW5lcmF0b3JzLmxlbmd0aClcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJlc2V0R2VuZXJhdG9yc1xyXG4gIH1cclxuXHJcbiAgZ2V0SW5zdHJ1bWVudFpvbmUoaW5zdHJ1bWVudFpvbmVJbmRleDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBpbnN0cnVtZW50QmFnID0gdGhpcy5wYXJzZWQuaW5zdHJ1bWVudFpvbmVbaW5zdHJ1bWVudFpvbmVJbmRleF1cclxuICAgIGNvbnN0IG5leHRJbnN0cnVtZW50QmFnID0gdGhpcy5wYXJzZWQuaW5zdHJ1bWVudFpvbmVbaW5zdHJ1bWVudFpvbmVJbmRleCArIDFdXHJcbiAgICBjb25zdCBnZW5lcmF0b3JJbmRleCA9IGluc3RydW1lbnRCYWcuaW5zdHJ1bWVudEdlbmVyYXRvckluZGV4XHJcbiAgICBjb25zdCBuZXh0R2VuZXJhdG9ySW5kZXggPSBuZXh0SW5zdHJ1bWVudEJhZyA/IG5leHRJbnN0cnVtZW50QmFnLmluc3RydW1lbnRHZW5lcmF0b3JJbmRleCA6IHRoaXMucGFyc2VkLmluc3RydW1lbnRHZW5lcmF0b3JzLmxlbmd0aFxyXG4gICAgY29uc3QgZ2VuZXJhdG9ycyA9IHRoaXMucGFyc2VkLmluc3RydW1lbnRHZW5lcmF0b3JzLnNsaWNlKGdlbmVyYXRvckluZGV4LCBuZXh0R2VuZXJhdG9ySW5kZXgpXHJcbiAgICByZXR1cm4gY3JlYXRlSW5zdHJ1bWVudFpvbmUoZ2VuZXJhdG9ycylcclxuICB9XHJcblxyXG4gIGdldEluc3RydW1lbnRab25lSW5kZXhlcyhpbnN0cnVtZW50SUQ6IG51bWJlcik6IG51bWJlcltdIHtcclxuICAgIGNvbnN0IGluc3RydW1lbnQgPSB0aGlzLnBhcnNlZC5pbnN0cnVtZW50c1tpbnN0cnVtZW50SURdXHJcbiAgICBjb25zdCBuZXh0SW5zdHJ1bWVudCA9IHRoaXMucGFyc2VkLmluc3RydW1lbnRzW2luc3RydW1lbnRJRCArIDFdXHJcbiAgICByZXR1cm4gYXJyYXlSYW5nZShpbnN0cnVtZW50Lmluc3RydW1lbnRCYWdJbmRleCwgbmV4dEluc3RydW1lbnQgPyBuZXh0SW5zdHJ1bWVudC5pbnN0cnVtZW50QmFnSW5kZXggOiB0aGlzLnBhcnNlZC5pbnN0cnVtZW50Wm9uZS5sZW5ndGgpXHJcbiAgfVxyXG5cclxuICBnZXRJbnN0cnVtZW50S2V5KGJhbmtOdW1iZXIsIGluc3RydW1lbnROdW1iZXIsIGtleSwgdmVsb2NpdHkgPSAxMDApOiBOb3RlSW5mb3xudWxsIHtcclxuICAgIGNvbnN0IHByZXNldEhlYWRlckluZGV4ID0gdGhpcy5wYXJzZWQucHJlc2V0SGVhZGVycy5maW5kSW5kZXgocCA9PiBwLnByZXNldCA9PT0gaW5zdHJ1bWVudE51bWJlciAmJiBwLmJhbmsgPT09IGJhbmtOdW1iZXIpXHJcbiAgICBcclxuICAgIGlmIChwcmVzZXRIZWFkZXJJbmRleCA8IDApIHtcclxuICAgICAgY29uc29sZS53YXJuKFwicHJlc2V0IG5vdCBmb3VuZDogYmFuaz0lcyBpbnN0cnVtZW50PSVzXCIsIGJhbmtOdW1iZXIsIGluc3RydW1lbnROdW1iZXIpXHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJlc2V0R2VuZXJhdG9ycyA9IHRoaXMuZ2V0UHJlc2V0Wm9uZShwcmVzZXRIZWFkZXJJbmRleClcclxuXHJcbiAgICAvLyBMYXN0IFByZXNldCBHZW5lcmF0b3IgbXVzdCBiZSBpbnN0cnVtZW50XHJcbiAgICBjb25zdCBsYXN0UHJlc2V0R2VuZXJ0b3IgPSBwcmVzZXRHZW5lcmF0b3JzW3ByZXNldEdlbmVyYXRvcnMubGVuZ3RoIC0gMV1cclxuICAgIGlmIChsYXN0UHJlc2V0R2VuZXJ0b3IudHlwZSAhPT0gXCJpbnN0cnVtZW50XCIgfHwgTnVtYmVyKGxhc3RQcmVzZXRHZW5lcnRvci52YWx1ZSkgPT09IE5hTikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNvdW5kRm9udDogaW52YWxpZCBwcmVzZXQgZ2VuZXJhdG9yOiBleHBlY3QgaW5zdHJ1bWVudFwiKVxyXG4gICAgfVxyXG4gICAgY29uc3QgaW5zdHJ1bWVudElEID0gbGFzdFByZXNldEdlbmVydG9yLnZhbHVlIGFzIG51bWJlclxyXG4gICAgY29uc3QgaW5zdHJ1bWVudFpvbmVzID0gdGhpcy5nZXRJbnN0cnVtZW50Wm9uZUluZGV4ZXMoaW5zdHJ1bWVudElEKS5tYXAoaSA9PiB0aGlzLmdldEluc3RydW1lbnRab25lKGkpKVxyXG5cclxuICAgIC8vIOacgOWIneOBruOCvuODvOODs+OBjHNhbXBsZUlEIOOCkuaMgeOBn+OBquOBkeOCjOOBsCBnbG9iYWwgaW5zdHJ1bWVudCB6b25lXHJcbiAgICBsZXQgZ2xvYmFsSW5zdHJ1bWVudFpvbmU6IGFueXx1bmRlZmluZWRcclxuICAgIGNvbnN0IGZpcnN0SW5zdHJ1bWVudFpvbmUgPSBpbnN0cnVtZW50Wm9uZXNbMF1cclxuICAgIGlmIChmaXJzdEluc3RydW1lbnRab25lLnNhbXBsZUlEID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgZ2xvYmFsSW5zdHJ1bWVudFpvbmUgPSBpbnN0cnVtZW50Wm9uZXNbMF1cclxuICAgIH1cclxuXHJcbiAgICAvLyBrZXlSYW5nZSDjgaggdmVsUmFuZ2Ug44GM44Oe44OD44OB44GX44Gm44GE44KLIEdlbmVyYXRvciDjgpLmjqLjgZlcclxuICAgIGNvbnN0IGluc3RydW1lbnRab25lID0gaW5zdHJ1bWVudFpvbmVzLmZpbmQoaSA9PiB7XHJcbiAgICAgIGlmIChpID09PSBnbG9iYWxJbnN0cnVtZW50Wm9uZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZSAvLyBnbG9iYWwgem9uZSDjgpLpmaTlpJZcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGlzSW5LZXlSYW5nZSA9IGZhbHNlXHJcbiAgICAgIGlmIChpLmtleVJhbmdlKSB7XHJcbiAgICAgICAgaXNJbktleVJhbmdlID0ga2V5ID49IGkua2V5UmFuZ2UubG8gJiYga2V5IDw9IGkua2V5UmFuZ2UuaGlcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGlzSW5WZWxSYW5nZSA9IHRydWVcclxuICAgICAgaWYgKGkudmVsUmFuZ2UpIHtcclxuICAgICAgICBpc0luVmVsUmFuZ2UgPSB2ZWxvY2l0eSA+PSBpLnZlbFJhbmdlLmxvICYmIHZlbG9jaXR5IDw9IGkudmVsUmFuZ2UuaGlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGlzSW5LZXlSYW5nZSAmJiBpc0luVmVsUmFuZ2VcclxuICAgIH0pXHJcbiAgICBcclxuICAgIGlmICghaW5zdHJ1bWVudFpvbmUpIHtcclxuICAgICAgY29uc29sZS53YXJuKFwiaW5zdHJ1bWVudCBub3QgZm91bmQ6IGJhbms9JXMgaW5zdHJ1bWVudD0lc1wiLCBiYW5rTnVtYmVyLCBpbnN0cnVtZW50TnVtYmVyKVxyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpbnN0cnVtZW50Wm9uZS5zYW1wbGVJRCA9PT0gdW5kZWZpbmVkKSB7IFxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNvdW5kRm9udDogc2FtcGxlSUQgbm90IGZvdW5kXCIpXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0IGdlbiA9IHsuLi5kZWZhdWx0SW5zdHJ1bWVudFpvbmUsIC4uLnJlbW92ZVVuZGVmaW5lZChnbG9iYWxJbnN0cnVtZW50Wm9uZSB8fCB7fSksIC4uLnJlbW92ZVVuZGVmaW5lZChpbnN0cnVtZW50Wm9uZSl9XHJcblxyXG4gICAgY29uc3Qgc2FtcGxlID0gdGhpcy5wYXJzZWQuc2FtcGxlc1tnZW4uc2FtcGxlSUQhXVxyXG4gICAgY29uc3Qgc2FtcGxlSGVhZGVyID0gdGhpcy5wYXJzZWQuc2FtcGxlSGVhZGVyc1tnZW4uc2FtcGxlSUQhXVxyXG4gICAgY29uc3QgdHVuZSA9IGdlbi5jb2Fyc2VUdW5lICsgZ2VuLmZpbmVUdW5lIC8gMTAwXHJcbiAgICBjb25zdCBiYXNlUGl0Y2ggPSB0dW5lICsgKHNhbXBsZUhlYWRlci5waXRjaENvcnJlY3Rpb24gLyAxMDApIC0gKGdlbi5vdmVycmlkaW5nUm9vdEtleSB8fCBzYW1wbGVIZWFkZXIub3JpZ2luYWxQaXRjaClcclxuICAgIGNvbnN0IHNjYWxlVHVuaW5nID0gZ2VuLnNjYWxlVHVuaW5nIC8gMTAwXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2FtcGxlLFxyXG4gICAgICBzYW1wbGVSYXRlOiBzYW1wbGVIZWFkZXIuc2FtcGxlUmF0ZSxcclxuICAgICAgc2FtcGxlTmFtZTogc2FtcGxlSGVhZGVyLnNhbXBsZU5hbWUsXHJcbiAgICAgIHNjYWxlVHVuaW5nLFxyXG4gICAgICBwbGF5YmFja1JhdGU6IChrZXkpID0+IE1hdGgucG93KE1hdGgucG93KDIsIDEgLyAxMiksIChrZXkgKyBiYXNlUGl0Y2gpICogc2NhbGVUdW5pbmcpLFxyXG4gICAgICBrZXlSYW5nZTogZ2VuLmtleVJhbmdlLFxyXG4gICAgICB2ZWxSYW5nZTogZ2VuLnZlbFJhbmdlLFxyXG4gICAgICB2b2xBdHRhY2s6IGNvbnZlcnRUaW1lKGdlbi52b2xBdHRhY2spLFxyXG4gICAgICB2b2xEZWNheTogY29udmVydFRpbWUoZ2VuLnZvbERlY2F5KSxcclxuICAgICAgdm9sU3VzdGFpbjogZ2VuLnZvbFN1c3RhaW4gLyAxMDAwLFxyXG4gICAgICB2b2xSZWxlYXNlOiBjb252ZXJ0VGltZShnZW4udm9sUmVsZWFzZSksXHJcbiAgICAgIG1vZEF0dGFjazogY29udmVydFRpbWUoZ2VuLm1vZEF0dGFjayksXHJcbiAgICAgIG1vZERlY2F5OiBjb252ZXJ0VGltZShnZW4ubW9kRGVjYXkpLFxyXG4gICAgICBtb2RTdXN0YWluOiBnZW4ubW9kU3VzdGFpbiAvIDEwMDAsXHJcbiAgICAgIG1vZFJlbGVhc2U6IGNvbnZlcnRUaW1lKGdlbi5tb2RSZWxlYXNlKSxcclxuICAgICAgbW9kRW52VG9QaXRjaDogZ2VuLm1vZEVudlRvUGl0Y2ggLyAxMDAsIC8vIGNlbnRcclxuICAgICAgbW9kRW52VG9GaWx0ZXJGYzogZ2VuLm1vZEVudlRvRmlsdGVyRmMsIC8vIHNlbWl0b25lICgxMDAgY2VudClcclxuICAgICAgaW5pdGlhbEZpbHRlclE6IGdlbi5pbml0aWFsRmlsdGVyUSxcclxuICAgICAgaW5pdGlhbEZpbHRlckZjOiBnZW4uaW5pdGlhbEZpbHRlckZjLFxyXG4gICAgICBmcmVxVmliTEZPOiBnZW4uZnJlcVZpYkxGTyA/IGNvbnZlcnRUaW1lKGdlbi5mcmVxVmliTEZPKSAqIDguMTc2IDogdW5kZWZpbmVkLFxyXG4gICAgICBzdGFydDogZ2VuLnN0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQgKiAzMjc2OCArIGdlbi5zdGFydEFkZHJzT2Zmc2V0LFxyXG4gICAgICBlbmQ6IGdlbi5lbmRBZGRyc0NvYXJzZU9mZnNldCAqIDMyNzY4ICsgZ2VuLmVuZEFkZHJzT2Zmc2V0LFxyXG4gICAgICBsb29wU3RhcnQ6IChcclxuICAgICAgICBzYW1wbGVIZWFkZXIubG9vcFN0YXJ0ICtcclxuICAgICAgICBnZW4uc3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXQgKiAzMjc2OCArXHJcbiAgICAgICAgZ2VuLnN0YXJ0bG9vcEFkZHJzT2Zmc2V0XHJcbiAgICAgICksXHJcbiAgICAgIGxvb3BFbmQ6IChcclxuICAgICAgICBzYW1wbGVIZWFkZXIubG9vcEVuZCArXHJcbiAgICAgICAgZ2VuLmVuZGxvb3BBZGRyc0NvYXJzZU9mZnNldCAqIDMyNzY4ICtcclxuICAgICAgICBnZW4uZW5kbG9vcEFkZHJzT2Zmc2V0XHJcbiAgICAgICksXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBwcmVzZXROYW1lc1tiYW5rTnVtYmVyXVtwcmVzZXROdW1iZXJdID0gcHJlc2V0TmFtZVxyXG4gIGdldFByZXNldE5hbWVzKCkge1xyXG4gICAgY29uc3QgYmFuazoge1tpbmRleDogbnVtYmVyXToge1tpbmRleDogbnVtYmVyXTogc3RyaW5nfX0gPSB7fVxyXG4gICAgdGhpcy5wYXJzZWQucHJlc2V0SGVhZGVycy5mb3JFYWNoKHByZXNldCA9PiB7XHJcbiAgICAgIGlmICghYmFua1twcmVzZXQuYmFua10pIHtcclxuICAgICAgICBiYW5rW3ByZXNldC5iYW5rXSA9IHt9XHJcbiAgICAgIH1cclxuICAgICAgYmFua1twcmVzZXQuYmFua11bcHJlc2V0LnByZXNldF0gPSBwcmVzZXQucHJlc2V0TmFtZVxyXG4gICAgfSlcclxuICAgIHJldHVybiBiYW5rXHJcbiAgfVxyXG59XHJcblxyXG4vLyB2YWx1ZSA9IDEyMDBsb2cyKHNlYykg44Gn6KGo44GV44KM44KL5pmC6ZaT44KS56eS5Y2Y5L2N44Gr5aSJ5o+b44GZ44KLXHJcbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VGltZSh2YWx1ZSkge1xyXG4gIHJldHVybiBNYXRoLnBvdygyLCB2YWx1ZSAvIDEyMDApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVVuZGVmaW5lZChvYmopIHtcclxuICBjb25zdCByZXN1bHQgPSB7fVxyXG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgaWYgKG9ialtrZXldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmVzdWx0W2tleV0gPSBvYmpba2V5XVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5mdW5jdGlvbiBhcnJheVJhbmdlKHN0YXJ0LCBlbmQpIHtcclxuICByZXR1cm4gQXJyYXkuZnJvbSh7bGVuZ3RoOiBlbmQgLSBzdGFydH0sIChfLCBrKSA9PiBrICsgc3RhcnQpO1xyXG59XHJcblxyXG4vLyDjgbLjgajjgaTjga4gaW5zdHJ1bWVudCDjgavlr77lv5zjgZnjgosgR2VuZXJhdG9yIOOBrumFjeWIl+OBi+OCieS9v+OBhOOChOOBmeOBj+OBl+OBn+OCquODluOCuOOCp+OCr+ODiOOCkui/lOOBmVxyXG5mdW5jdGlvbiBjcmVhdGVJbnN0cnVtZW50Wm9uZShpbnN0cnVtZW50R2VuZXJhdG9yczogR2VuZXJhdG9yTGlzdFtdKSB7XHJcbiAgZnVuY3Rpb24gZ2V0VmFsdWUodHlwZTogc3RyaW5nKTogbnVtYmVyfHVuZGVmaW5lZCB7XHJcbiAgICBjb25zdCBnZW5lcmF0b3IgPSBpbnN0cnVtZW50R2VuZXJhdG9ycy5maW5kKGcgPT4gZy50eXBlID09PSB0eXBlKVxyXG4gICAgaWYgKCFnZW5lcmF0b3IpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgfVxyXG4gICAgaWYgKE51bWJlcihnZW5lcmF0b3IudmFsdWUpID09PSBOYU4pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwic29tZXRoaW5nIHdyb25nXCIpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZ2VuZXJhdG9yLnZhbHVlIGFzIG51bWJlclxyXG4gIH1cclxuICBcclxuICAvLyBGaXJzdCBJbnN0cnVtZW50IEdlbmVyYXRvciBtdXN0IGJlIGtleVJhbmdlXHJcbiAgY29uc3QgZmlyc3RJbnN0cnVtZW50R2VuZXJhdG9yID0gaW5zdHJ1bWVudEdlbmVyYXRvcnNbMF1cclxuICBsZXQga2V5UmFuZ2U6IFJhbmdlVmFsdWV8dW5kZWZpbmVkXHJcbiAgaWYgKGZpcnN0SW5zdHJ1bWVudEdlbmVyYXRvciAmJiBmaXJzdEluc3RydW1lbnRHZW5lcmF0b3IudHlwZSA9PT0gXCJrZXlSYW5nZVwiKSB7XHJcbiAgICBpZiAoIShmaXJzdEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUgaW5zdGFuY2VvZiBSYW5nZVZhbHVlKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNvdW5kRm9udDoga2V5UmFuZ2UgaXMgbm90IHJhbmdlZCB2YWx1ZVwiKVxyXG4gICAgfVxyXG4gICAga2V5UmFuZ2UgPSBmaXJzdEluc3RydW1lbnRHZW5lcmF0b3IudmFsdWUgYXMgUmFuZ2VWYWx1ZVxyXG4gIH1cclxuXHJcbiAgLy8gU2Vjb25kIEluc3RydW1lbnQgR2VuZXJhdG9yIGNvdWxkIGJlIHZlbFJhbmdlXHJcbiAgY29uc3Qgc2Vjb25kSW5zdHJ1bWVudEdlbmVyYXRvciA9IGluc3RydW1lbnRHZW5lcmF0b3JzWzFdXHJcbiAgbGV0IHZlbFJhbmdlOiBSYW5nZVZhbHVlfHVuZGVmaW5lZFxyXG4gIGlmIChzZWNvbmRJbnN0cnVtZW50R2VuZXJhdG9yICYmIHNlY29uZEluc3RydW1lbnRHZW5lcmF0b3IudHlwZSA9PT0gXCJ2ZWxSYW5nZVwiKSB7XHJcbiAgICBpZiAoIShzZWNvbmRJbnN0cnVtZW50R2VuZXJhdG9yLnZhbHVlIGluc3RhbmNlb2YgUmFuZ2VWYWx1ZSkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBTb3VuZEZvbnQ6IHZlbFJhbmdlIGlzIG5vdCByYW5nZWQgdmFsdWVcIilcclxuICAgIH1cclxuICAgIHZlbFJhbmdlID0gc2Vjb25kSW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSBhcyBSYW5nZVZhbHVlXHJcbiAgfVxyXG5cclxuICAvLyBMYXN0IEluc3RydW1lbnQgR2VuZXJhdG9yIG11c3QgYmUgc2FtcGxlSURcclxuICBjb25zdCBsYXN0SW5zdHJ1bWVudEdlbmVyYXRvciA9IGluc3RydW1lbnRHZW5lcmF0b3JzW2luc3RydW1lbnRHZW5lcmF0b3JzLmxlbmd0aCAtIDFdXHJcbiAgbGV0IHNhbXBsZUlEOiBudW1iZXJ8dW5kZWZpbmVkXHJcbiAgaWYgKGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yICYmIGxhc3RJbnN0cnVtZW50R2VuZXJhdG9yLnR5cGUgPT09IFwic2FtcGxlSURcIikge1xyXG4gICAgaWYgKE51bWJlcihsYXN0SW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSkgPT09IE5hTikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIFNvdW5kRm9udDogc2FtcGxlSUQgaXMgbm90IG51bWJlclwiKVxyXG4gICAgfVxyXG4gICAgc2FtcGxlSUQgPSBsYXN0SW5zdHJ1bWVudEdlbmVyYXRvci52YWx1ZSBhcyBudW1iZXJcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBrZXlSYW5nZSwgLy8g44GC44KL44Gv44Ga44Gg44GMIGdsb2JhbCB6b25lIOOBq+OBr+eEoeOBhOOBi+OCguOBl+OCjOOBquOBhFxyXG4gICAgdmVsUmFuZ2UsIC8vIG9wdGlvbmFsXHJcbiAgICBzYW1wbGVJRCwgLy8gZ2xvYmFsIHpvbmUg44Gu5aC05ZCI44Gg44GR44Gq44GEXHJcbiAgICB2b2xBdHRhY2s6IGdldFZhbHVlKFwiYXR0YWNrVm9sRW52XCIpLFxyXG4gICAgdm9sRGVjYXk6IGdldFZhbHVlKFwiZGVjYXlWb2xFbnZcIiksXHJcbiAgICB2b2xTdXN0YWluOiBnZXRWYWx1ZShcInN1c3RhaW5Wb2xFbnZcIiksXHJcbiAgICB2b2xSZWxlYXNlOiBnZXRWYWx1ZShcInJlbGVhc2VWb2xFbnZcIiksXHJcbiAgICBtb2RBdHRhY2s6IGdldFZhbHVlKFwiYXR0YWNrTW9kRW52XCIpLFxyXG4gICAgbW9kRGVjYXk6IGdldFZhbHVlKFwiZGVjYXlNb2RFbnZcIiksXHJcbiAgICBtb2RTdXN0YWluOiBnZXRWYWx1ZShcInN1c3RhaW5Nb2RFbnZcIiksXHJcbiAgICBtb2RSZWxlYXNlOiBnZXRWYWx1ZShcInJlbGVhc2VNb2RFbnZcIiksXHJcbiAgICBtb2RFbnZUb1BpdGNoOiBnZXRWYWx1ZShcIm1vZEVudlRvUGl0Y2hcIiksXHJcbiAgICBtb2RFbnZUb0ZpbHRlckZjOiBnZXRWYWx1ZShcIm1vZEVudlRvRmlsdGVyRmNcIiksXHJcbiAgICBjb2Fyc2VUdW5lOiBnZXRWYWx1ZShcImNvYXJzZVR1bmVcIiksXHJcbiAgICBmaW5lVHVuZTogZ2V0VmFsdWUoXCJmaW5lVHVuZVwiKSxcclxuICAgIHNjYWxlVHVuaW5nOiBnZXRWYWx1ZShcInNjYWxlVHVuaW5nXCIpLFxyXG4gICAgZnJlcVZpYkxGTzogZ2V0VmFsdWUoXCJmcmVxVmliTEZPXCIpLFxyXG4gICAgc3RhcnRBZGRyc09mZnNldDogZ2V0VmFsdWUoXCJzdGFydEFkZHJzT2Zmc2V0XCIpLFxyXG4gICAgc3RhcnRBZGRyc0NvYXJzZU9mZnNldDogZ2V0VmFsdWUoXCJzdGFydEFkZHJzQ29hcnNlT2Zmc2V0XCIpLFxyXG4gICAgZW5kQWRkcnNPZmZzZXQ6IGdldFZhbHVlKFwiZW5kQWRkcnNPZmZzZXRcIiksXHJcbiAgICBlbmRBZGRyc0NvYXJzZU9mZnNldDogZ2V0VmFsdWUoXCJlbmRBZGRyc0NvYXJzZU9mZnNldFwiKSxcclxuICAgIHN0YXJ0bG9vcEFkZHJzT2Zmc2V0OiBnZXRWYWx1ZShcInN0YXJ0bG9vcEFkZHJzT2Zmc2V0XCIpLFxyXG4gICAgc3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXQ6IGdldFZhbHVlKFwic3RhcnRsb29wQWRkcnNDb2Fyc2VPZmZzZXRcIiksXHJcbiAgICBlbmRsb29wQWRkcnNPZmZzZXQ6IGdldFZhbHVlKFwiZW5kbG9vcEFkZHJzT2Zmc2V0XCIpLFxyXG4gICAgZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0OiBnZXRWYWx1ZShcImVuZGxvb3BBZGRyc0NvYXJzZU9mZnNldFwiKSxcclxuICAgIG92ZXJyaWRpbmdSb290S2V5OiBnZXRWYWx1ZShcIm92ZXJyaWRpbmdSb290S2V5XCIpLFxyXG4gICAgaW5pdGlhbEZpbHRlclE6IGdldFZhbHVlKFwiaW5pdGlhbEZpbHRlclFcIiksXHJcbiAgICBpbml0aWFsRmlsdGVyRmM6IGdldFZhbHVlKFwiaW5pdGlhbEZpbHRlckZjXCIpLFxyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZGVmYXVsdEluc3RydW1lbnRab25lID0ge1xyXG4gIGtleVJhbmdlOiBuZXcgUmFuZ2VWYWx1ZSgwLCAxMjcpLFxyXG4gIHZlbFJhbmdlOiBuZXcgUmFuZ2VWYWx1ZSgwLCAxMjcpLFxyXG4gIHNhbXBsZUlEOiB1bmRlZmluZWQsXHJcbiAgdm9sQXR0YWNrOiAtMTIwMDAsXHJcbiAgdm9sRGVjYXk6IC0xMjAwMCxcclxuICB2b2xTdXN0YWluOiAwLFxyXG4gIHZvbFJlbGVhc2U6IC0xMjAwMCxcclxuICBtb2RBdHRhY2s6IC0xMjAwMCxcclxuICBtb2REZWNheTogLTEyMDAwLFxyXG4gIG1vZFN1c3RhaW46IDAsXHJcbiAgbW9kUmVsZWFzZTogMCxcclxuICBtb2RFbnZUb1BpdGNoOiAwLFxyXG4gIG1vZEVudlRvRmlsdGVyRmM6IDAsXHJcbiAgY29hcnNlVHVuZTogMCxcclxuICBmaW5lVHVuZTogMCxcclxuICBzY2FsZVR1bmluZzogMTAwLFxyXG4gIGZyZXFWaWJMRk86IDAsXHJcbiAgc3RhcnRBZGRyc09mZnNldDogMCxcclxuICBzdGFydEFkZHJzQ29hcnNlT2Zmc2V0OiAwLFxyXG4gIGVuZEFkZHJzT2Zmc2V0OiAwLFxyXG4gIGVuZEFkZHJzQ29hcnNlT2Zmc2V0OiAwLFxyXG4gIHN0YXJ0bG9vcEFkZHJzT2Zmc2V0OiAwLFxyXG4gIHN0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0OiAwLFxyXG4gIGVuZGxvb3BBZGRyc09mZnNldDogMCxcclxuICBlbmRsb29wQWRkcnNDb2Fyc2VPZmZzZXQ6IDAsXHJcbiAgb3ZlcnJpZGluZ1Jvb3RLZXk6IHVuZGVmaW5lZCxcclxuICBpbml0aWFsRmlsdGVyUTogMSxcclxuICBpbml0aWFsRmlsdGVyRmM6IDEzNTAwLFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5vdGVJbmZvIHtcclxuICBzYW1wbGU6IEludDE2QXJyYXlcclxuICBzYW1wbGVSYXRlOiBudW1iZXJcclxuICBzYW1wbGVOYW1lOiBzdHJpbmdcclxuICBzdGFydDogbnVtYmVyXHJcbiAgZW5kOiBudW1iZXJcclxuICBzY2FsZVR1bmluZzogbnVtYmVyXHJcbiAgcGxheWJhY2tSYXRlOiBGdW5jdGlvblxyXG4gIGxvb3BTdGFydDogbnVtYmVyXHJcbiAgbG9vcEVuZDogbnVtYmVyXHJcbiAgdm9sQXR0YWNrOiBudW1iZXJcclxuICB2b2xEZWNheTogbnVtYmVyXHJcbiAgdm9sU3VzdGFpbjogbnVtYmVyXHJcbiAgdm9sUmVsZWFzZTogbnVtYmVyXHJcbiAgbW9kQXR0YWNrOiBudW1iZXJcclxuICBtb2REZWNheTogbnVtYmVyXHJcbiAgbW9kU3VzdGFpbjogbnVtYmVyXHJcbiAgbW9kUmVsZWFzZTogbnVtYmVyXHJcbiAgbW9kRW52VG9QaXRjaDogbnVtYmVyXHJcbiAgbW9kRW52VG9GaWx0ZXJGYzogbnVtYmVyXHJcbiAgaW5pdGlhbEZpbHRlckZjOiBudW1iZXJcclxuICBpbml0aWFsRmlsdGVyUTogbnVtYmVyXHJcbiAgZnJlcVZpYkxGTzogbnVtYmVyfHVuZGVmaW5lZFxyXG4gIGtleVJhbmdlOiBSYW5nZVZhbHVlXHJcbiAgdmVsUmFuZ2U6IFJhbmdlVmFsdWV8dW5kZWZpbmVkXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1NvdW5kRm9udC50cyIsImltcG9ydCBTeW50aGVzaXplciBmcm9tIFwiLi9TeW50aGVzaXplclwiXHJcbmltcG9ydCBQcm9ncmFtTmFtZXMgZnJvbSBcIi4vUHJvZ3JhbU5hbWVzXCJcclxuaW1wb3J0IHsgTGlzdGVuZXIgfSBmcm9tIFwiLi9NaWRpTWVzc2FnZUhhbmRsZXJcIlxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKHN0cjogc3RyaW5nKTogRWxlbWVudCB7XHJcbiAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICB3cmFwcGVyLmlubmVySFRNTCA9IHN0ci5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpXHJcbiAgcmV0dXJuIHdyYXBwZXIuZmlyc3RFbGVtZW50Q2hpbGQhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlcktleXMoKTogc3RyaW5nIHtcclxuICBsZXQgaHRtbCA9IFwiXCJcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IDEyODsgaSsrKSB7XHJcbiAgICBjb25zdCBuID0gaSAlIDEyXHJcbiAgICBjb25zdCBpc0JsYWNrID0gWzEsIDMsIDYsIDgsIDEwXS5pbmNsdWRlcyhuKVxyXG4gICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cImtleSAke2lzQmxhY2sgPyBcImJsYWNrXCIgOiBcIndoaXRlXCJ9XCI+PC9kaXY+YFxyXG4gIH1cclxuICByZXR1cm4gaHRtbFxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJQcm9ncmFtT3B0aW9ucyhwcm9ncmFtTmFtZXM6IHsgW2luZGV4OiBudW1iZXJdOiBzdHJpbmdbXSB9LCBiYW5rOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gIGxldCBodG1sID0gXCJcIlxyXG4gIGNvbnN0IG5hbWVzID0gcHJvZ3JhbU5hbWVzW2JhbmtdXHJcbiAgZm9yIChsZXQgaSBpbiBuYW1lcykge1xyXG4gICAgY29uc3QgbmFtZSA9IG5hbWVzW2ldXHJcbiAgICBodG1sICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtpfVwiPiR7aX06ICR7bmFtZX08L29wdGlvbj5gXHJcbiAgfVxyXG4gIHJldHVybiBgPHNlbGVjdD4ke2h0bWx9PC9zZWxlY3Q+YFxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJJbnN0cnVtZW50KHByb2dyYW0pOiBFbGVtZW50IHtcclxuICByZXR1cm4gcmVuZGVyKGBcclxuICAgIDxkaXYgY2xhc3M9XCJpbnN0cnVtZW50XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmFtXCI+JHtwcm9ncmFtfTwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwidm9sdW1lXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwYW5wb3RcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBpdGNoQmVuZFwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGl0Y2hCZW5kU2Vuc2l0aXZpdHlcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImtleXNcIj4ke3JlbmRlcktleXMoKX08L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIGApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9iamVjdE1hcChvLCBmdW5jKSB7XHJcbiAgY29uc3QgcmVzdWx0ID0ge31cclxuICBPYmplY3Qua2V5cyhvKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICByZXN1bHRba2V5XSA9IGZ1bmMob1trZXldKVxyXG4gIH0pXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9ncmFtTmFtZXNGcm9tQmFua1NldChiYW5rU2V0KSB7XHJcbiAgcmV0dXJuIG9iamVjdE1hcChiYW5rU2V0LCBiYW5rID0+IG9iamVjdE1hcChiYW5rLCBzID0+IHMubmFtZSkpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1lcmdlUHJvZ3JhbU5hbWVzKGxlZnQ6IHtbaW5kZXg6IG51bWJlcl06IHN0cmluZ1tdfSwgcmlnaHQ6IHtbaW5kZXg6IG51bWJlcl06IHN0cmluZ1tdfSkge1xyXG4gIGZ1bmN0aW9uIG1lcmdlZEtleXMoYSwgYikge1xyXG4gICAgcmV0dXJuIG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGEpLCAuLi5PYmplY3Qua2V5cyhiKV0pXHJcbiAgfVxyXG4gIGNvbnN0IGJhbmtzID0gbWVyZ2VkS2V5cyhsZWZ0LCByaWdodClcclxuICBjb25zdCByZXN1bHQgPSB7fVxyXG4gIGJhbmtzLmZvckVhY2goYmFuayA9PiB7XHJcbiAgICBjb25zdCBsID0gbGVmdFtiYW5rXSB8fCBbXVxyXG4gICAgY29uc3QgciA9IHJpZ2h0W2JhbmtdIHx8IFtdXHJcbiAgICBjb25zdCBsaXN0OiB7IFtpbmRleDogbnVtYmVyXTogc3RyaW5nfSA9IHt9XHJcbiAgICBjb25zdCBwcm9ncmFtcyA9IG1lcmdlZEtleXMobCwgcilcclxuICAgIHByb2dyYW1zLmZvckVhY2gocCA9PiB7XHJcbiAgICAgIGxpc3RbcF0gPSBgJHtsW3BdIHx8IFwiTm9uZVwifSAoJHtyW3BdIHx8IFwiTm9uZVwifSlgXHJcbiAgICB9KVxyXG4gICAgcmVzdWx0W2JhbmtdID0gbGlzdFxyXG4gIH0pXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IGltcGxlbWVudHMgTGlzdGVuZXIge1xyXG4gIHByaXZhdGUgZWxlbWVudDogRWxlbWVudHxudWxsXHJcbiAgcHJpdmF0ZSBkcmFnOiBib29sZWFuID0gZmFsc2VcclxuXHJcbiAgZHJhdyhzeW50aDogU3ludGhlc2l6ZXIpOiBFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQgPSByZW5kZXIoYDxkaXYgLz5gKVxyXG4gICAgY29uc3QgcHJvZ3JhbU5hbWVzID0gbWVyZ2VQcm9ncmFtTmFtZXMocHJvZ3JhbU5hbWVzRnJvbUJhbmtTZXQoc3ludGguc291bmRGb250LmdldFByZXNldE5hbWVzKCkpLCBQcm9ncmFtTmFtZXMpXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XHJcbiAgICAgIGNvbnN0IGJhbmsgPSBpICE9PSA5ID8gMCA6IDEyOFxyXG4gICAgICBjb25zdCBwcm9ncmFtID0gcmVuZGVyUHJvZ3JhbU9wdGlvbnMocHJvZ3JhbU5hbWVzLCBiYW5rKVxyXG4gICAgICBjb25zdCBpdGVtID0gcmVuZGVySW5zdHJ1bWVudChwcm9ncmFtKVxyXG5cclxuICAgICAgY29uc3QgY2hhbm5lbCA9IGlcclxuICAgICAgY29uc3Qgc2VsZWN0ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCdzZWxlY3QnKVxyXG4gICAgICBpZiAoc2VsZWN0KSB7XHJcbiAgICAgICAgc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGV2ZW50ID0+IHtcclxuICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudFxyXG4gICAgICAgICAgY29uc3QgcHJvZ3JhbSA9IHBhcnNlSW50KHRhcmdldC52YWx1ZSwgMTApXHJcbiAgICAgICAgICB0aGlzLnByb2dyYW1DaGFuZ2UoY2hhbm5lbCwgcHJvZ3JhbSlcclxuICAgICAgICAgIHN5bnRoLnByb2dyYW1DaGFuZ2UoY2hhbm5lbCwgcHJvZ3JhbSlcclxuICAgICAgICB9LCBmYWxzZSlcclxuICAgICAgICBzZWxlY3Quc2VsZWN0ZWRJbmRleCA9IHN5bnRoLmNoYW5uZWxzW2ldLmluc3RydW1lbnRcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgbm90ZXMgPSBpdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoXCIua2V5XCIpXHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTI4OyArK2opIHtcclxuICAgICAgICBjb25zdCBrZXkgPSBqXHJcblxyXG4gICAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGV2ZW50ID0+IHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgIHRoaXMuZHJhZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMubm90ZU9uKGNoYW5uZWwsIGtleSwgMTI3KVxyXG4gICAgICAgICAgc3ludGgubm90ZU9uKGNoYW5uZWwsIGtleSwgMTI3KVxyXG5cclxuICAgICAgICAgIGNvbnN0IG9uTW91c2VVcCA9IGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcClcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICB0aGlzLmRyYWcgPSBmYWxzZVxyXG4gICAgICAgICAgICB0aGlzLm5vdGVPZmYoY2hhbm5lbCwga2V5LCAwKVxyXG4gICAgICAgICAgICBzeW50aC5ub3RlT2ZmKGNoYW5uZWwsIGtleSwgMClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcClcclxuICAgICAgICB9KVxyXG4gICAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGV2ZW50ID0+IHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgIGlmICh0aGlzLmRyYWcpIHtcclxuICAgICAgICAgICAgdGhpcy5ub3RlT24oY2hhbm5lbCwga2V5LCAxMjcpXHJcbiAgICAgICAgICAgIHN5bnRoLm5vdGVPbihjaGFubmVsLCBrZXksIDEyNylcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgdGhpcy5ub3RlT2ZmKGNoYW5uZWwsIGtleSwgMClcclxuICAgICAgICAgIHN5bnRoLm5vdGVPZmYoY2hhbm5lbCwga2V5LCAwKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoaXRlbSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZWxlbWVudFxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlKCkge1xyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LnBhcmVudE5vZGUhLnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcclxuICAgIHRoaXMuZWxlbWVudCA9IG51bGxcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0SW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbDogbnVtYmVyKTogRWxlbWVudHxudWxsIHtcclxuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaW5zdHJ1bWVudFwiKVtjaGFubmVsXVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRLZXlFbGVtZW50KGNoYW5uZWw6IG51bWJlciwga2V5OiBudW1iZXIpOiBFbGVtZW50fG51bGwge1xyXG4gICAgY29uc3QgZWxlbSA9IHRoaXMuZ2V0SW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbClcclxuICAgIGlmICghZWxlbSkge1xyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVsZW0ucXVlcnlTZWxlY3RvckFsbChcIi5rZXlcIilba2V5XVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBmaW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbDogbnVtYmVyLCBxdWVyeTogc3RyaW5nKTogRWxlbWVudHxudWxsIHtcclxuICAgIGNvbnN0IGVsZW0gPSB0aGlzLmdldEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwpXHJcbiAgICBpZiAoIWVsZW0pIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuICAgIHJldHVybiBlbGVtLnF1ZXJ5U2VsZWN0b3IocXVlcnkpXHJcbiAgfVxyXG5cclxuICBub3RlT24oY2hhbm5lbDogbnVtYmVyLCBrZXk6IG51bWJlciwgX3ZlbG9jaXR5OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmdldEtleUVsZW1lbnQoY2hhbm5lbCwga2V5KVxyXG4gICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdub3RlLW9uJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vdGVPZmYoY2hhbm5lbDogbnVtYmVyLCBrZXk6IG51bWJlciwgX3ZlbG9jaXR5OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmdldEtleUVsZW1lbnQoY2hhbm5lbCwga2V5KVxyXG4gICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdub3RlLW9uJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb2dyYW1DaGFuZ2UoY2hhbm5lbDogbnVtYmVyLCBpbnN0cnVtZW50OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHNlbGVjdCA9IHRoaXMuZmluZEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwsIFwiLnByb2dyYW0gc2VsZWN0XCIpIGFzIEhUTUxTZWxlY3RFbGVtZW50fHVuZGVmaW5lZFxyXG4gICAgaWYgKHNlbGVjdCkge1xyXG4gICAgICBzZWxlY3QudmFsdWUgPSBgJHtpbnN0cnVtZW50fWBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZvbHVtZUNoYW5nZShjaGFubmVsOiBudW1iZXIsIHZvbHVtZTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIudm9sdW1lXCIpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gYCR7dm9sdW1lfWBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHBhbnBvdENoYW5nZShjaGFubmVsOiBudW1iZXIsIHBhbnBvdDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIucGFucG90XCIpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gYCR7cGFucG90fWBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZChjaGFubmVsOiBudW1iZXIsIHBpdGNoQmVuZDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5maW5kSW5zdHJ1bWVudEVsZW1lbnQoY2hhbm5lbCwgXCIucGl0Y2hCZW5kXCIpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gYCR7cGl0Y2hCZW5kfWBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWw6IG51bWJlciwgc2Vuc2l0aXZpdHk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZmluZEluc3RydW1lbnRFbGVtZW50KGNoYW5uZWwsIFwiLnBpdGNoQmVuZFNlbnNpdGl2aXR5XCIpXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gYCR7c2Vuc2l0aXZpdHl9YFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWxsU291bmRPZmYoX2NoYW5uZWxOdW1iZXI6IG51bWJlcikge1xyXG4gIH1cclxuXHJcbiAgc2V0TWFzdGVyVm9sdW1lKF92b2x1bWU6IG51bWJlcikge1xyXG4gIH1cclxuXHJcbiAgcmVzZXRBbGxDb250cm9sKF9jaGFubmVsTnVtYmVyOiBudW1iZXIpIHtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1ZpZXcudHMiLCJjb25zdCBQcm9ncmFtTmFtZXM6IHsgW2luZGV4OiBudW1iZXJdOiBzdHJpbmdbXSB9ID0ge1xyXG4gIDA6IFtcclxuICAgIFwiQWNvdXN0aWMgUGlhbm9cIixcclxuICAgIFwiQnJpZ2h0IFBpYW5vXCIsXHJcbiAgICBcIkVsZWN0cmljIEdyYW5kIFBpYW5vXCIsXHJcbiAgICBcIkhvbmt5LXRvbmsgUGlhbm9cIixcclxuICAgIFwiRWxlY3RyaWMgUGlhbm9cIixcclxuICAgIFwiRWxlY3RyaWMgUGlhbm8gMlwiLFxyXG4gICAgXCJIYXJwc2ljaG9yZFwiLFxyXG4gICAgXCJDbGF2aVwiLFxyXG4gICAgXCJDZWxlc3RhXCIsXHJcbiAgICBcIkdsb2NrZW5zcGllbFwiLFxyXG4gICAgXCJNdXNpY2FsIGJveFwiLFxyXG4gICAgXCJWaWJyYXBob25lXCIsXHJcbiAgICBcIk1hcmltYmFcIixcclxuICAgIFwiWHlsb3Bob25lXCIsXHJcbiAgICBcIlR1YnVsYXIgQmVsbFwiLFxyXG4gICAgXCJEdWxjaW1lclwiLFxyXG4gICAgXCJEcmF3YmFyIE9yZ2FuXCIsXHJcbiAgICBcIlBlcmN1c3NpdmUgT3JnYW5cIixcclxuICAgIFwiUm9jayBPcmdhblwiLFxyXG4gICAgXCJDaHVyY2ggb3JnYW5cIixcclxuICAgIFwiUmVlZCBvcmdhblwiLFxyXG4gICAgXCJBY2NvcmRpb25cIixcclxuICAgIFwiSGFybW9uaWNhXCIsXHJcbiAgICBcIlRhbmdvIEFjY29yZGlvblwiLFxyXG4gICAgXCJBY291c3RpYyBHdWl0YXIgKG55bG9uKVwiLFxyXG4gICAgXCJBY291c3RpYyBHdWl0YXIgKHN0ZWVsKVwiLFxyXG4gICAgXCJFbGVjdHJpYyBHdWl0YXIgKGphenopXCIsXHJcbiAgICBcIkVsZWN0cmljIEd1aXRhciAoY2xlYW4pXCIsXHJcbiAgICBcIkVsZWN0cmljIEd1aXRhciAobXV0ZWQpXCIsXHJcbiAgICBcIk92ZXJkcml2ZW4gR3VpdGFyXCIsXHJcbiAgICBcIkRpc3RvcnRpb24gR3VpdGFyXCIsXHJcbiAgICBcIkd1aXRhciBoYXJtb25pY3NcIixcclxuICAgIFwiQWNvdXN0aWMgQmFzc1wiLFxyXG4gICAgXCJFbGVjdHJpYyBCYXNzIChmaW5nZXIpXCIsXHJcbiAgICBcIkVsZWN0cmljIEJhc3MgKHBpY2spXCIsXHJcbiAgICBcIkZyZXRsZXNzIEJhc3NcIixcclxuICAgIFwiU2xhcCBCYXNzIDFcIixcclxuICAgIFwiU2xhcCBCYXNzIDJcIixcclxuICAgIFwiU3ludGggQmFzcyAxXCIsXHJcbiAgICBcIlN5bnRoIEJhc3MgMlwiLFxyXG4gICAgXCJWaW9saW5cIixcclxuICAgIFwiVmlvbGFcIixcclxuICAgIFwiQ2VsbG9cIixcclxuICAgIFwiRG91YmxlIGJhc3NcIixcclxuICAgIFwiVHJlbW9sbyBTdHJpbmdzXCIsXHJcbiAgICBcIlBpenppY2F0byBTdHJpbmdzXCIsXHJcbiAgICBcIk9yY2hlc3RyYWwgSGFycFwiLFxyXG4gICAgXCJUaW1wYW5pXCIsXHJcbiAgICBcIlN0cmluZyBFbnNlbWJsZSAxXCIsXHJcbiAgICBcIlN0cmluZyBFbnNlbWJsZSAyXCIsXHJcbiAgICBcIlN5bnRoIFN0cmluZ3MgMVwiLFxyXG4gICAgXCJTeW50aCBTdHJpbmdzIDJcIixcclxuICAgIFwiVm9pY2UgQWFoc1wiLFxyXG4gICAgXCJWb2ljZSBPb2hzXCIsXHJcbiAgICBcIlN5bnRoIFZvaWNlXCIsXHJcbiAgICBcIk9yY2hlc3RyYSBIaXRcIixcclxuICAgIFwiVHJ1bXBldFwiLFxyXG4gICAgXCJUcm9tYm9uZVwiLFxyXG4gICAgXCJUdWJhXCIsXHJcbiAgICBcIk11dGVkIFRydW1wZXRcIixcclxuICAgIFwiRnJlbmNoIGhvcm5cIixcclxuICAgIFwiQnJhc3MgU2VjdGlvblwiLFxyXG4gICAgXCJTeW50aCBCcmFzcyAxXCIsXHJcbiAgICBcIlN5bnRoIEJyYXNzIDJcIixcclxuICAgIFwiU29wcmFubyBTYXhcIixcclxuICAgIFwiQWx0byBTYXhcIixcclxuICAgIFwiVGVub3IgU2F4XCIsXHJcbiAgICBcIkJhcml0b25lIFNheFwiLFxyXG4gICAgXCJPYm9lXCIsXHJcbiAgICBcIkVuZ2xpc2ggSG9yblwiLFxyXG4gICAgXCJCYXNzb29uXCIsXHJcbiAgICBcIkNsYXJpbmV0XCIsXHJcbiAgICBcIlBpY2NvbG9cIixcclxuICAgIFwiRmx1dGVcIixcclxuICAgIFwiUmVjb3JkZXJcIixcclxuICAgIFwiUGFuIEZsdXRlXCIsXHJcbiAgICBcIkJsb3duIEJvdHRsZVwiLFxyXG4gICAgXCJTaGFrdWhhY2hpXCIsXHJcbiAgICBcIldoaXN0bGVcIixcclxuICAgIFwiT2NhcmluYVwiLFxyXG4gICAgXCJMZWFkIDEgKHNxdWFyZSlcIixcclxuICAgIFwiTGVhZCAyIChzYXd0b290aClcIixcclxuICAgIFwiTGVhZCAzIChjYWxsaW9wZSlcIixcclxuICAgIFwiTGVhZCA0IChjaGlmZilcIixcclxuICAgIFwiTGVhZCA1IChjaGFyYW5nKVwiLFxyXG4gICAgXCJMZWFkIDYgKHZvaWNlKVwiLFxyXG4gICAgXCJMZWFkIDcgKGZpZnRocylcIixcclxuICAgIFwiTGVhZCA4IChiYXNzICsgbGVhZClcIixcclxuICAgIFwiUGFkIDEgKEZhbnRhc2lhKVwiLFxyXG4gICAgXCJQYWQgMiAod2FybSlcIixcclxuICAgIFwiUGFkIDMgKHBvbHlzeW50aClcIixcclxuICAgIFwiUGFkIDQgKGNob2lyKVwiLFxyXG4gICAgXCJQYWQgNSAoYm93ZWQpXCIsXHJcbiAgICBcIlBhZCA2IChtZXRhbGxpYylcIixcclxuICAgIFwiUGFkIDcgKGhhbG8pXCIsXHJcbiAgICBcIlBhZCA4IChzd2VlcClcIixcclxuICAgIFwiRlggMSAocmFpbilcIixcclxuICAgIFwiRlggMiAoc291bmR0cmFjaylcIixcclxuICAgIFwiRlggMyAoY3J5c3RhbClcIixcclxuICAgIFwiRlggNCAoYXRtb3NwaGVyZSlcIixcclxuICAgIFwiRlggNSAoYnJpZ2h0bmVzcylcIixcclxuICAgIFwiRlggNiAoZ29ibGlucylcIixcclxuICAgIFwiRlggNyAoZWNob2VzKVwiLFxyXG4gICAgXCJGWCA4IChzY2ktZmkpXCIsXHJcbiAgICBcIlNpdGFyXCIsXHJcbiAgICBcIkJhbmpvXCIsXHJcbiAgICBcIlNoYW1pc2VuXCIsXHJcbiAgICBcIktvdG9cIixcclxuICAgIFwiS2FsaW1iYVwiLFxyXG4gICAgXCJCYWdwaXBlXCIsXHJcbiAgICBcIkZpZGRsZVwiLFxyXG4gICAgXCJTaGFuYWlcIixcclxuICAgIFwiVGlua2xlIEJlbGxcIixcclxuICAgIFwiQWdvZ29cIixcclxuICAgIFwiU3RlZWwgRHJ1bXNcIixcclxuICAgIFwiV29vZGJsb2NrXCIsXHJcbiAgICBcIlRhaWtvIERydW1cIixcclxuICAgIFwiTWVsb2RpYyBUb21cIixcclxuICAgIFwiU3ludGggRHJ1bVwiLFxyXG4gICAgXCJSZXZlcnNlIEN5bWJhbFwiLFxyXG4gICAgXCJHdWl0YXIgRnJldCBOb2lzZVwiLFxyXG4gICAgXCJCcmVhdGggTm9pc2VcIixcclxuICAgIFwiU2Vhc2hvcmVcIixcclxuICAgIFwiQmlyZCBUd2VldFwiLFxyXG4gICAgXCJUZWxlcGhvbmUgUmluZ1wiLFxyXG4gICAgXCJIZWxpY29wdGVyXCIsXHJcbiAgICBcIkFwcGxhdXNlXCIsXHJcbiAgICBcIkd1bnNob3RcIlxyXG4gIF0sIDEyODogW1wiUmh5dGhtIFRyYWNrXCJdXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2dyYW1OYW1lc1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Qcm9ncmFtTmFtZXMudHMiLCJleHBvcnQgaW50ZXJmYWNlIExpc3RlbmVyIHtcclxuICBub3RlT24oY2hhbm5lbDogbnVtYmVyLCBrZXk6IG51bWJlciwgdmVsb2NpdHk6IG51bWJlcilcclxuICBub3RlT2ZmKGNoYW5uZWw6IG51bWJlciwga2V5OiBudW1iZXIsIHZlbG9jaXR5OiBudW1iZXIpXHJcbiAgc2V0TWFzdGVyVm9sdW1lKHZvbHVtZTogbnVtYmVyKVxyXG4gIHByb2dyYW1DaGFuZ2UoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBpbnN0cnVtZW50OiBudW1iZXIpXHJcbiAgdm9sdW1lQ2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgdm9sdW1lOiBudW1iZXIpXHJcbiAgcGFucG90Q2hhbmdlKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgcGFucG90OiBudW1iZXIpXHJcbiAgcGl0Y2hCZW5kKGNoYW5uZWxOdW1iZXI6IG51bWJlciwgcGl0Y2hCZW5kOiBudW1iZXIpXHJcbiAgcGl0Y2hCZW5kU2Vuc2l0aXZpdHkoY2hhbm5lbE51bWJlcjogbnVtYmVyLCBzZW5zaXRpdml0eTogbnVtYmVyKVxyXG4gIGFsbFNvdW5kT2ZmKGNoYW5uZWxOdW1iZXI6IG51bWJlcilcclxuICByZXNldEFsbENvbnRyb2woY2hhbm5lbE51bWJlcjogbnVtYmVyKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaWRpTWVzc2FnZUhhbmRsZXIge1xyXG4gIHByaXZhdGUgUnBuTXNiID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdXHJcbiAgcHJpdmF0ZSBScG5Mc2IgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF1cclxuICBsaXN0ZW5lcjogTGlzdGVuZXJcclxuXHJcbiAgcHJvY2Vzc01pZGlNZXNzYWdlKG1lc3NhZ2U6IG51bWJlcltdKSB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gbWVzc2FnZVswXSAmIDB4MGZcclxuICAgIGNvbnN0IHsgbGlzdGVuZXIgfSA9IHRoaXNcclxuXHJcbiAgICBpZiAoIWxpc3RlbmVyKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCAobWVzc2FnZVswXSAmIDB4ZjApIHtcclxuICAgICAgY2FzZSAweDgwOiAvLyBOb3RlT2ZmOiA4biBrayB2dlxyXG4gICAgICAgIGxpc3RlbmVyLm5vdGVPZmYoY2hhbm5lbCwgbWVzc2FnZVsxXSwgbWVzc2FnZVsyXSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDB4OTA6IC8vIE5vdGVPbjogOW4ga2sgdnZcclxuICAgICAgICBpZiAobWVzc2FnZVsyXSA+IDApIHtcclxuICAgICAgICAgIGxpc3RlbmVyLm5vdGVPbihjaGFubmVsLCBtZXNzYWdlWzFdLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsaXN0ZW5lci5ub3RlT2ZmKGNoYW5uZWwsIG1lc3NhZ2VbMV0sIDApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMHhCMDogLy8gQ29udHJvbCBDaGFuZ2U6IEJuIGNjIGRkXHJcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlWzFdKSB7XHJcbiAgICAgICAgICBjYXNlIDB4MDY6IC8vIERhdGEgRW50cnk6IEJuIDA2IGRkXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5ScG5Nc2JbY2hhbm5lbF0pIHtcclxuICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuUnBuTHNiW2NoYW5uZWxdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgMDogLy8gUGl0Y2ggQmVuZCBTZW5zaXRpdml0eVxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLnBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWwsIG1lc3NhZ2VbMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4MDc6IC8vIFZvbHVtZSBDaGFuZ2U6IEJuIDA3IGRkXHJcbiAgICAgICAgICAgIGxpc3RlbmVyLnZvbHVtZUNoYW5nZShjaGFubmVsLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDBBOiAvLyBQYW5wb3QgQ2hhbmdlOiBCbiAwQSBkZFxyXG4gICAgICAgICAgICBsaXN0ZW5lci5wYW5wb3RDaGFuZ2UoY2hhbm5lbCwgbWVzc2FnZVsyXSlcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHg3ODogLy8gQWxsIFNvdW5kIE9mZjogQm4gNzggMDBcclxuICAgICAgICAgICAgbGlzdGVuZXIuYWxsU291bmRPZmYoY2hhbm5lbClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMHg3OTogLy8gUmVzZXQgQWxsIENvbnRyb2w6IEJuIDc5IDAwXHJcbiAgICAgICAgICAgIGxpc3RlbmVyLnJlc2V0QWxsQ29udHJvbChjaGFubmVsKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDIwOiAvLyBCYW5rU2VsZWN0XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJiYW5rc2VsZWN0OlwiLCBjaGFubmVsLCBtZXNzYWdlWzJdKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDY0OiAvLyBSUE4gTVNCXHJcbiAgICAgICAgICAgIHRoaXMuUnBuTXNiW2NoYW5uZWxdID0gbWVzc2FnZVsyXVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAweDY1OiAvLyBSUE4gTFNCXHJcbiAgICAgICAgICAgIHRoaXMuUnBuTHNiW2NoYW5uZWxdID0gbWVzc2FnZVsyXVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAweEMwOiAvLyBQcm9ncmFtIENoYW5nZTogQ24gcHBcclxuICAgICAgICBsaXN0ZW5lci5wcm9ncmFtQ2hhbmdlKGNoYW5uZWwsIG1lc3NhZ2VbMV0pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAweEUwOiB7IC8vIFBpdGNoIEJlbmRcclxuICAgICAgICBjb25zdCBiZW5kID0gKChtZXNzYWdlWzFdICYgMHg3ZikgfCAoKG1lc3NhZ2VbMl0gJiAweDdmKSA8PCA3KSlcclxuICAgICAgICBsaXN0ZW5lci5waXRjaEJlbmQoY2hhbm5lbCwgYmVuZClcclxuICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgMHhmMDogLy8gU3lzdGVtIEV4Y2x1c2l2ZSBNZXNzYWdlXHJcbiAgICAgICAgLy8gSUQgbnVtYmVyXHJcbiAgICAgICAgc3dpdGNoIChtZXNzYWdlWzFdKSB7XHJcbiAgICAgICAgICBjYXNlIDB4N2U6IC8vIG5vbi1yZWFsdGltZVxyXG4gICAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDB4N2Y6IC8vIHJlYWx0aW1lXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGRldmljZSA9IG1lc3NhZ2VbMl1cclxuICAgICAgICAgICAgLy8gc3ViIElEIDFcclxuICAgICAgICAgICAgc3dpdGNoIChtZXNzYWdlWzNdKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSAweDA0OiAvLyBkZXZpY2UgY29udHJvbFxyXG4gICAgICAgICAgICAgICAgLy8gc3ViIElEIDJcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobWVzc2FnZVs0XSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIDB4MDE6IHsgLy8gbWFzdGVyIHZvbHVtZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZvbHVtZSA9IG1lc3NhZ2VbNV0gKyAobWVzc2FnZVs2XSA8PCA3KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IE1BWF9WT0xVTUUgPSAweDQwMDAgLSAxXHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuc2V0TWFzdGVyVm9sdW1lKHZvbHVtZSAvIE1BWF9WT0xVTUUpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OiAvLyBub3Qgc3VwcG9ydGVkXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01pZGlNZXNzYWdlSGFuZGxlci50cyIsIi8vIGRlbGVnYXRlcyBtZXRob2QgY2FsbHMgdG8gbXVsdGlwbGUgdGFyZ2V0c1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWxlZ2F0ZVByb3h5PFQgZXh0ZW5kcyBPYmplY3Q+KHRhcmdldHM6IFRbXSkge1xyXG4gIHJldHVybiBuZXcgUHJveHkodGFyZ2V0c1swXSwge1xyXG4gICAgZ2V0KHRhcmdldCwgcHJvcEtleSwgX3JlY2VpdmVyKSB7XHJcbiAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgdGFyZ2V0c1xyXG4gICAgICAgICAgLm1hcCh0ID0+IHRbcHJvcEtleV0uYmluZCh0YXJnZXQpKVxyXG4gICAgICAgICAgLmZvckVhY2goZiA9PiBmKC4uLmFyZ3VtZW50cykpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9kZWxlZ2F0ZVByb3h5LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==