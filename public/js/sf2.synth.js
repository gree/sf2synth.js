(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.SoundFont = {})));
}(this, (function (exports) { 'use strict';

const __assign = Object.assign || function (target) {
    for (var source, i = 1; i < arguments.length; i++) {
        source = arguments[i];
        for (var prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
                target[prop] = source[prop];
            }
        }
    }
    return target;
};

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
        this.expression = instrument.expression;
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
        bufferSource.loop = this.sampleModes !== 0;
        bufferSource.loopStart = noteInfo.loopStart / noteInfo.sampleRate;
        bufferSource.loopEnd = noteInfo.loopEnd / noteInfo.sampleRate;
        bufferSource.onended = function () { return _this.disconnect(); };
        this.bufferSource = bufferSource;
        this.updatePitchBend(this.pitchBend);
        // audio node
        var output = this.gainOutput = ctx.createGain();
        var outputGain = output.gain;
        // expression
        this.expressionGain = ctx.createGain();
        //this.expressionGain.gain.value = this.expression / 127;
        this.expressionGain.gain.setTargetAtTime(this.expression / 127, this.ctx.currentTime, 0.015);
        // Modulator
        var modulator = this.modulator = ctx.createBiquadFilter();
        // filter
        var filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        this.filter = filter;
        // panpot
        var pan = noteInfo.panpot !== void 0 ? noteInfo.panpot : this.panpot;
        var panner = this.panner = ctx.createPanner();
        panner.panningModel = "equalpower";
        panner.setPosition(Math.sin(pan * Math.PI / 2), 0, Math.cos(pan * Math.PI / 2));
        //---------------------------------------------------------------------------
        // Delay, Attack, Hold, Decay, Sustain
        //---------------------------------------------------------------------------
        var attackVolume = this.volume * (this.velocity / 127) * (1 - noteInfo.initialAttenuation / 1000);
        if (attackVolume < 0) {
            attackVolume = 0;
        }
        var now = this.ctx.currentTime;
        var volDelay = now + noteInfo.volDelay;
        var volAttack = volDelay + noteInfo.volAttack;
        var volHold = volAttack + noteInfo.volHold;
        var volDecay = volHold + noteInfo.volDecay;
        var modDelay = now + noteInfo.modDelay;
        var modAttack = volDelay + noteInfo.modAttack;
        var modHold = modAttack + noteInfo.modHold;
        var modDecay = modHold + noteInfo.modDecay;
        var startTime = noteInfo.start / noteInfo.sampleRate;
        // volume envelope
        outputGain
            .setValueAtTime(0, now)
            .setValueAtTime(0, volDelay)
            .setTargetAtTime(attackVolume, volDelay, noteInfo.volAttack)
            .setValueAtTime(attackVolume, volHold)
            .linearRampToValueAtTime(attackVolume * (1 - noteInfo.volSustain), volDecay);
        // modulation envelope
        var baseFreq = this.amountToFreq(noteInfo.initialFilterFc);
        var peekFreq = this.amountToFreq(noteInfo.initialFilterFc + noteInfo.modEnvToFilterFc);
        var sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - noteInfo.modSustain);
        modulator.Q.setValueAtTime(Math.pow(10, noteInfo.initialFilterQ / 200), now);
        //modulator.frequency.value = baseFreq;
        modulator.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.015);
        modulator.type = 'lowpass';
        modulator.frequency
            .setValueAtTime(baseFreq, now)
            .setValueAtTime(baseFreq, modDelay)
            .setTargetAtTime(peekFreq, modDelay, noteInfo.modAttack++) // For FireFox fix
            .setValueAtTime(peekFreq, modHold)
            .linearRampToValueAtTime(sustainFreq, modDecay);
        // connect
        bufferSource.connect(modulator);
        modulator.connect(panner);
        panner.connect(this.expressionGain);
        this.expressionGain.connect(output);
        if (!noteInfo.mute) {
            this.gainOutput.connect(this.destination);
        }
        // fire
        bufferSource.start(0, startTime);
    };
    SynthesizerNote.prototype.amountToFreq = function (val) {
        return Math.pow(2, (val - 6900) / 1200) * 440;
    };
    SynthesizerNote.prototype.noteOff = function () {
        var _a = this, noteInfo = _a.noteInfo, bufferSource = _a.bufferSource;
        var output = this.gainOutput;
        var now = this.ctx.currentTime;
        var release = 64;
        //---------------------------------------------------------------------------
        // volume release time
        //---------------------------------------------------------------------------
        var volEndTimeTmp = noteInfo.volRelease * output.gain.value;
        var volEndTime = now + (volEndTimeTmp * (1 + release / (release < 0 ? 64 : 63)));
        //---------------------------------------------------------------------------
        // modulation release time
        //---------------------------------------------------------------------------
        var modulator = this.modulator;
        var baseFreq = this.amountToFreq(noteInfo.initialFilterFc);
        var peekFreq = this.amountToFreq(noteInfo.initialFilterFc + noteInfo.modEnvToFilterFc);
        var modEndTime = now + noteInfo.modRelease *
            (baseFreq === peekFreq ?
                1 :
                (modulator.frequency.value - baseFreq) / (peekFreq - baseFreq));
        //---------------------------------------------------------------------------
        // Release
        //---------------------------------------------------------------------------
        switch (noteInfo.sampleModes) {
            case 0:
                break;
            case 1:
                output.gain.cancelScheduledValues(0);
                output.gain.setValueAtTime(output.gain.value, now);
                output.gain.linearRampToValueAtTime(0, volEndTime);
                modulator.frequency.cancelScheduledValues(0);
                modulator.frequency.setValueAtTime(modulator.frequency.value, now);
                modulator.frequency.linearRampToValueAtTime(baseFreq, modEndTime);
                bufferSource.playbackRate.cancelScheduledValues(0);
                bufferSource.playbackRate.setValueAtTime(bufferSource.playbackRate.value, now);
                bufferSource.playbackRate.linearRampToValueAtTime(this.computedPlaybackRate, modEndTime);
                bufferSource.stop(volEndTime);
                break;
            case 2:
                console.log('detect unused sampleModes');
                break;
            case 3:
                bufferSource.loop = false;
                break;
        }
    };
    SynthesizerNote.prototype.disconnect = function () {
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
    SynthesizerNote.prototype.updateExpression = function (expression) {
        this.expressionGain.gain.value = (this.expression = expression) / 127;
    };
    
    SynthesizerNote.prototype.updatePitchBend = function (pitchBend) {
        this.computedPlaybackRate = this.playbackRate * Math.pow(Math.pow(2, 1 / 12), (this.pitchBendSensitivity * (pitchBend / (pitchBend < 0 ? 8192 : 8191))) * this.noteInfo.scaleTuning);
        this.schedulePlaybackRate();
    };
    return SynthesizerNote;
}());

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
            return ((this.data[this.ip++] << 24) |
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

function parseChunk$1(input, ip, bigEndian) {
    var stream = new Stream(input, ip);
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
        var chunk = parseChunk$1(input, ip, bigEndian);
        ip = chunk.offset + chunk.size;
        // padding
        if (padding && ((ip - index) & 1) === 1) {
            ip++;
        }
        chunkList.push(chunk);
    }
    return chunkList;
}
var Chunk = /** @class */ (function () {
    function Chunk(type, size, offset) {
        this.type = type;
        this.size = size;
        this.offset = offset;
    }
    return Chunk;
}());

var GeneratorEnumeratorTable = [
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
//# sourceMappingURL=Constants.js.map

var VersionTag = /** @class */ (function () {
    function VersionTag() {
    }
    VersionTag.parse = function (stream) {
        var v = new VersionTag();
        v.major = stream.readInt8();
        v.minor = stream.readInt8();
        return v;
    };
    return VersionTag;
}());
var Info = /** @class */ (function () {
    function Info() {
    }
    // LIST - INFO の全ての chunk
    Info.parse = function (data, chunks) {
        function getChunk(type) {
            return chunks.find(function (c) { return c.type === type; });
        }
        function toStream(chunk) {
            return new Stream(data, chunk.offset);
        }
        function readString(type) {
            var chunk = getChunk(type);
            if (!chunk) {
                return null;
            }
            return toStream(chunk).readString(chunk.size);
        }
        function readVersionTag(type) {
            var chunk = getChunk(type);
            if (!chunk) {
                return null;
            }
            return VersionTag.parse(toStream(chunk));
        }
        var info = new Info();
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
    };
    return Info;
}());
var PresetHeader = /** @class */ (function () {
    function PresetHeader() {
    }
    Object.defineProperty(PresetHeader.prototype, "isEnd", {
        get: function () {
            return this.presetName === "EOP";
        },
        enumerable: true,
        configurable: true
    });
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
var RangeValue = /** @class */ (function () {
    function RangeValue(lo, hi) {
        this.lo = lo;
        this.hi = hi;
    }
    RangeValue.parse = function (stream) {
        return new RangeValue(stream.readByte(), stream.readByte());
    };
    return RangeValue;
}());
var ModulatorList = /** @class */ (function () {
    function ModulatorList() {
    }
    Object.defineProperty(ModulatorList.prototype, "type", {
        get: function () {
            return GeneratorEnumeratorTable[this.destinationOper];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModulatorList.prototype, "isEnd", {
        get: function () {
            return this.sourceOper === 0 &&
                this.destinationOper === 0 &&
                this.value === 0 &&
                this.amountSourceOper === 0 &&
                this.transOper === 0;
        },
        enumerable: true,
        configurable: true
    });
    ModulatorList.parse = function (stream) {
        var t = new ModulatorList();
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
    };
    return ModulatorList;
}());
var GeneratorList = /** @class */ (function () {
    function GeneratorList() {
    }
    Object.defineProperty(GeneratorList.prototype, "type", {
        get: function () {
            return GeneratorEnumeratorTable[this.code];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GeneratorList.prototype, "isEnd", {
        get: function () {
            return this.code === 0 &&
                this.value === 0;
        },
        enumerable: true,
        configurable: true
    });
    GeneratorList.parse = function (stream) {
        var t = new GeneratorList();
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
    };
    return GeneratorList;
}());
var Instrument = /** @class */ (function () {
    function Instrument() {
    }
    Object.defineProperty(Instrument.prototype, "isEnd", {
        get: function () {
            return this.instrumentName === "EOI";
        },
        enumerable: true,
        configurable: true
    });
    Instrument.parse = function (stream) {
        var t = new Instrument();
        t.instrumentName = stream.readString(20);
        t.instrumentBagIndex = stream.readWORD();
        return t;
    };
    return Instrument;
}());
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
var SampleHeader = /** @class */ (function () {
    function SampleHeader() {
    }
    Object.defineProperty(SampleHeader.prototype, "isEnd", {
        get: function () {
            return this.sampleName === "EOS";
        },
        enumerable: true,
        configurable: true
    });
    SampleHeader.parse = function (stream) {
        var s = new SampleHeader();
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
    };
    return SampleHeader;
}());

function parse(input, option) {
    if (option === void 0) { option = {}; }
    // parse RIFF chunk
    var chunkList = parseRiff(input, 0, input.length, option);
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
    var result = parseRiffChunk(chunk, input);
    return __assign({}, result, { samples: loadSample(result.sampleHeaders, result.samplingData.offset, input) });
}
function getChunkList(chunk, data, expectedType, expectedSignature) {
    // check parse target
    if (chunk.type !== expectedType) {
        throw new Error('invalid chunk type:' + chunk.type);
    }
    var stream = new Stream(data, chunk.offset);
    // check signature
    var signature = stream.readString(4);
    if (signature !== expectedSignature) {
        throw new Error('invalid signature:' + signature);
    }
    // read structure
    return parseRiff(data, stream.ip, chunk.size - 4);
}
function parseInfoList(chunk, data) {
    var chunkList = getChunkList(chunk, data, "LIST", "INFO");
    return Info.parse(data, chunkList);
}
function parseSdtaList(chunk, data) {
    var chunkList = getChunkList(chunk, data, "LIST", "sdta");
    if (chunkList.length !== 1) {
        throw new Error('TODO');
    }
    return chunkList[0];
}
function parseChunk(chunk, data, type, clazz, terminate) {
    var result = [];
    if (chunk.type !== type) {
        throw new Error('invalid chunk type:' + chunk.type);
    }
    var stream = new Stream(data, chunk.offset);
    var size = chunk.offset + chunk.size;
    while (stream.ip < size) {
        var obj = clazz.parse(stream);
        if (terminate && terminate(obj)) {
            break;
        }
        result.push(obj);
    }
    return result;
}
var parsePhdr = function (chunk, data) { return parseChunk(chunk, data, "phdr", PresetHeader, function (p) { return p.isEnd; }); };
var parsePbag = function (chunk, data) { return parseChunk(chunk, data, "pbag", PresetBag); };
var parseInst = function (chunk, data) { return parseChunk(chunk, data, "inst", Instrument, function (i) { return i.isEnd; }); };
var parseIbag = function (chunk, data) { return parseChunk(chunk, data, "ibag", InstrumentBag); };
var parsePmod = function (chunk, data) { return parseChunk(chunk, data, "pmod", ModulatorList, function (m) { return m.isEnd; }); };
var parseImod = function (chunk, data) { return parseChunk(chunk, data, "imod", ModulatorList, function (m) { return m.isEnd; }); };
var parsePgen = function (chunk, data) { return parseChunk(chunk, data, "pgen", GeneratorList, function (g) { return g.isEnd; }); };
var parseIgen = function (chunk, data) { return parseChunk(chunk, data, "igen", GeneratorList, function (g) { return g.isEnd; }); };
var parseShdr = function (chunk, data) { return parseChunk(chunk, data, "shdr", SampleHeader, function (s) { return s.isEnd; }); };
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
            header.loopStart *= adjust.multiply;
            header.loopEnd *= adjust.multiply;
        }
        return sample;
    });
}
//# sourceMappingURL=Parser.js.map

var SoundFont = /** @class */ (function () {
    function SoundFont(parsed) {
        this.parsed = parsed;
    }
    SoundFont.prototype.getPresetZone = function (presetHeaderIndex) {
        var presetGenerators;
        var presetHeader = this.parsed.presetHeaders[presetHeaderIndex];
        var presetBag = this.parsed.presetZone[presetHeader.presetBagIndex];
        var nextPresetHeaderIndex = presetHeaderIndex + 1;
        if (nextPresetHeaderIndex < this.parsed.presetHeaders.length) {
            // 次の preset までのすべての generator を取得する
            var nextPresetHeader = this.parsed.presetHeaders[nextPresetHeaderIndex];
            var nextPresetBag = this.parsed.presetZone[nextPresetHeader.presetBagIndex];
            presetGenerators = this.parsed.presetGenerators.slice(presetBag.presetGeneratorIndex, nextPresetBag.presetGeneratorIndex);
        }
        else {
            // 最後の preset だった場合は最後まで取得する
            presetGenerators = this.parsed.presetGenerators.slice(presetBag.presetGeneratorIndex, this.parsed.presetGenerators.length);
        }
        return presetGenerators;
    };
    SoundFont.prototype.getInstrumentZone = function (instrumentZoneIndex) {
        var instrumentBag = this.parsed.instrumentZone[instrumentZoneIndex];
        var nextInstrumentBag = this.parsed.instrumentZone[instrumentZoneIndex + 1];
        var generatorIndex = instrumentBag.instrumentGeneratorIndex;
        var nextGeneratorIndex = nextInstrumentBag ? nextInstrumentBag.instrumentGeneratorIndex : this.parsed.instrumentGenerators.length;
        var generators = this.parsed.instrumentGenerators.slice(generatorIndex, nextGeneratorIndex);
        return createInstrumentZone(generators);
    };
    SoundFont.prototype.getInstrumentZoneIndexes = function (instrumentID) {
        var instrument = this.parsed.instruments[instrumentID];
        var nextInstrument = this.parsed.instruments[instrumentID + 1];
        return arrayRange(instrument.instrumentBagIndex, nextInstrument ? nextInstrument.instrumentBagIndex : this.parsed.instrumentZone.length);
    };
    SoundFont.prototype.getInstrumentKey = function (bankNumber, instrumentNumber, key, velocity) {
        var _this = this;
        if (velocity === void 0) { velocity = 100; }
        var presetHeaderIndex = this.parsed.presetHeaders.findIndex(function (p) { return p.preset === instrumentNumber && p.bank === bankNumber; });
        if (presetHeaderIndex < 0) {
            console.warn("preset not found: bank=%s instrument=%s", bankNumber, instrumentNumber);
            return null;
        }
        var presetGenerators = this.getPresetZone(presetHeaderIndex);
        // Last Preset Generator must be instrument
        var lastPresetGenertor = presetGenerators[presetGenerators.length - 1];
        if (lastPresetGenertor.type !== "instrument" || isNaN(Number(lastPresetGenertor.value))) {
            throw new Error("Invalid SoundFont: invalid preset generator: expect instrument");
        }
        var instrumentID = lastPresetGenertor.value;
        var instrumentZones = this.getInstrumentZoneIndexes(instrumentID).map(function (i) { return _this.getInstrumentZone(i); });
        // 最初のゾーンがsampleID を持たなければ global instrument zone
        var globalInstrumentZone;
        var firstInstrumentZone = instrumentZones[0];
        if (firstInstrumentZone.sampleID === undefined) {
            globalInstrumentZone = instrumentZones[0];
        }
        // keyRange と velRange がマッチしている Generator を探す
        var instrumentZone = instrumentZones.find(function (i) {
            if (i === globalInstrumentZone) {
                return false; // global zone を除外
            }
            var isInKeyRange = false;
            if (i.keyRange) {
                isInKeyRange = key >= i.keyRange.lo && key <= i.keyRange.hi;
            }
            var isInVelRange = true;
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
        var gen = __assign({}, defaultInstrumentZone, removeUndefined(globalInstrumentZone || {}), removeUndefined(instrumentZone));
        var sample = this.parsed.samples[gen.sampleID];
        var sampleHeader = this.parsed.sampleHeaders[gen.sampleID];
        var tune = gen.coarseTune + gen.fineTune / 100;
        var basePitch = tune + (sampleHeader.pitchCorrection / 100) - (gen.overridingRootKey || sampleHeader.originalPitch);
        var scaleTuning = gen.scaleTuning / 100;
        return {
            sample: sample,
            sampleRate: sampleHeader.sampleRate,
            sampleName: sampleHeader.sampleName,
            sampleModes: gen.sampleModes,
            playbackRate: function (key) { return Math.pow(Math.pow(2, 1 / 12), (key + basePitch) * scaleTuning); },
            modEnvToPitch: gen.modEnvToPitch / 100,
            scaleTuning: scaleTuning,
            start: gen.startAddrsCoarseOffset * 32768 + gen.startAddrsOffset,
            end: gen.endAddrsCoarseOffset * 32768 + gen.endAddrsOffset,
            loopStart: (sampleHeader.loopStart +
                gen.startloopAddrsCoarseOffset * 32768 +
                gen.startloopAddrsOffset),
            loopEnd: (sampleHeader.loopEnd +
                gen.endloopAddrsCoarseOffset * 32768 +
                gen.endloopAddrsOffset),
            volDelay: convertTime(gen.volDelay),
            volAttack: convertTime(gen.volAttack),
            volHold: convertTime(gen.volHold),
            volDecay: convertTime(gen.volDecay),
            volSustain: gen.volSustain / 1000,
            volRelease: convertTime(gen.volRelease),
            modDelay: convertTime(gen.modDelay),
            modAttack: convertTime(gen.modAttack),
            modHold: convertTime(gen.modHold),
            modDecay: convertTime(gen.modDecay),
            modSustain: gen.modSustain / 1000,
            modRelease: convertTime(gen.modRelease),
            keyRange: gen.keyRange,
            velRange: gen.velRange,
            initialFilterFc: gen.initialFilterFc,
            modEnvToFilterFc: gen.modEnvToFilterFc,
            initialFilterQ: gen.initialFilterQ,
            initialAttenuation: gen.initialAttenuation,
            freqVibLFO: gen.freqVibLFO ? convertTime(gen.freqVibLFO) * 8.176 : undefined,
            panpot: gen.panpot,
            mute: false
        };
    };
    // presetNames[bankNumber][presetNumber] = presetName
    SoundFont.prototype.getPresetNames = function () {
        var bank = {};
        this.parsed.presetHeaders.forEach(function (preset) {
            if (!bank[preset.bank]) {
                bank[preset.bank] = {};
            }
            bank[preset.bank][preset.preset] = preset.presetName;
        });
        return bank;
    };
    return SoundFont;
}());
// value = 1200log2(sec) で表される時間を秒単位に変換する
function convertTime(value) {
    return Math.pow(2, value / 1200);
}
function removeUndefined(obj) {
    var result = {};
    Object.keys(obj).forEach(function (key) {
        if (obj[key] !== undefined) {
            result[key] = obj[key];
        }
    });
    return result;
}
function arrayRange(start, end) {
    return Array.from({ length: end - start }, function (_, k) { return k + start; });
}
// ひとつの instrument に対応する Generator の配列から使いやすくしたオブジェクトを返す
function createInstrumentZone(instrumentGenerators) {
    function getValue(type) {
        var generator = instrumentGenerators.find(function (g) { return g.type === type; });
        if (!generator) {
            return undefined;
        }
        if (isNaN(Number(generator.value))) {
            throw new Error("something wrong");
        }
        return generator.value;
    }
    // First Instrument Generator must be keyRange
    var firstInstrumentGenerator = instrumentGenerators[0];
    var keyRange;
    if (firstInstrumentGenerator && firstInstrumentGenerator.type === "keyRange") {
        if (!(firstInstrumentGenerator.value instanceof RangeValue)) {
            throw new Error("Invalid SoundFont: keyRange is not ranged value");
        }
        keyRange = firstInstrumentGenerator.value;
    }
    // Second Instrument Generator could be velRange
    var secondInstrumentGenerator = instrumentGenerators[1];
    var velRange;
    if (secondInstrumentGenerator && secondInstrumentGenerator.type === "velRange") {
        if (!(secondInstrumentGenerator.value instanceof RangeValue)) {
            throw new Error("Invalid SoundFont: velRange is not ranged value");
        }
        velRange = secondInstrumentGenerator.value;
    }
    // Last Instrument Generator must be sampleID
    var lastInstrumentGenerator = instrumentGenerators[instrumentGenerators.length - 1];
    var sampleID;
    if (lastInstrumentGenerator && lastInstrumentGenerator.type === "sampleID") {
        if (isNaN(Number(lastInstrumentGenerator.value))) {
            throw new Error("Invalid SoundFont: sampleID is not number");
        }
        sampleID = lastInstrumentGenerator.value;
    }
    return {
        keyRange: keyRange,
        velRange: velRange,
        sampleID: sampleID,
        volAttack: getValue("attackVolEnv"),
        volDecay: getValue("decayVolEnv"),
        volDelay: getValue("delayVolEnv"),
        volSustain: getValue("sustainVolEnv"),
        volRelease: getValue("releaseVolEnv"),
        modAttack: getValue("attackModEnv"),
        modDecay: getValue("decayModEnv"),
        modDelay: getValue("delayModEnv"),
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
        initialAttenuation: getValue("initialAttenuation"),
        endloopAddrsCoarseOffset: getValue("endloopAddrsCoarseOffset"),
        overridingRootKey: getValue("overridingRootKey"),
        initialFilterQ: getValue("initialFilterQ"),
        initialFilterFc: getValue("initialFilterFc"),
        sampleModes: getValue("sampleModes")
    };
}
var defaultInstrumentZone = {
    keyRange: new RangeValue(0, 127),
    velRange: new RangeValue(0, 127),
    sampleID: undefined,
    volDelay: -12000,
    volAttack: -12000,
    volDecay: -12000,
    volHold: -12000,
    volSustain: 0,
    volRelease: -12000,
    modDelay: -12000,
    modAttack: -12000,
    modHold: -12000,
    modDecay: -12000,
    modSustain: 0,
    modRelease: -12000,
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
    initialAttenuation: 0,
    endloopAddrsOffset: 0,
    endloopAddrsCoarseOffset: 0,
    overridingRootKey: undefined,
    initialFilterQ: 1,
    initialFilterFc: 13500,
    sampleModes: 0,
    panpot: 64,
    mute: false,
    releaseTime: 0
};

var BASE_VOLUME = 0.4;
var Channel = /** @class */ (function () {
    function Channel() {
        this.instrument = 0;
        this.volume = 0;
        this.pitchBend = 0;
        this.pitchBendSensitivity = 0;
        this.panpot = 0;
        this.expression = 0;
        this.releaseTime = 0;
        this.reverb = 0;
        this.currentNoteOn = [];
        this.hold = false;
        this.bankMsb = 0;
        this.bankLsb = 0;
        this.isPercussionPart = false;
        this.harmonicContent = 0;
        this.cutOffFrequency = 0;
        this.mute = false;
    }
    return Channel;
}());
var Synthesizer = /** @class */ (function () {
    function Synthesizer(ctx) {
        this.bank = 0;
        this.bufferSize = 1024;
        this.channels = [];
        this.masterVolume = 1.0;
        this.releaseTime = function (channel, releaseTime) {
            this.channelRelease[channel] = releaseTime;
        };
        /**
         * @param {number} channel TODO:ドラムパートとしてセットするチャンネル
         * @param {boolean} sw ドラムか通常かのスイッチ
         */
        this.setPercussionPart = function (channelNumber, sw) {
            this.channels[channelNumber].isPercussionPart = sw;
        };
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
            this.pitchBend(i, 0);
            this.pitchBendSensitivity(i, 2);
            this.hold(i, false);
            this.expression(i, 127);
            this.bankSelectMsb(i, i === 9 ? 128 : 0x00);
            this.bankSelectLsb(i, 0x00);
            this.setPercussionPart(i, i === 9);
            this.setReverbDepth(i, 40);
        }
    };
    Synthesizer.prototype.loadSoundFont = function (input) {
        var parser = parse(input);
        this.soundFont = new SoundFont(parser);
    };
    Synthesizer.prototype.connect = function (destination) {
        this.gainMaster.connect(destination);
    };
    Synthesizer.prototype.setMasterVolume = function (volume) {
        this.masterVolume = volume;
        //this.gainMaster.gain.value = BASE_VOLUME * volume / 0x8000
        this.gainMaster.gain.setTargetAtTime(BASE_VOLUME * volume / 0x8000, this.ctx.currentTime, 0.015);
    };
    Synthesizer.prototype.noteOn = function (channelNumber, key, velocity) {
        if (!this.soundFont) {
            console.warn('could not load sound.');
            return;
        }
        var bankNumber = this.getBank(channelNumber);
        var channel = this.channels[channelNumber];
        var noteInfo = this.soundFont.getInstrumentKey(bankNumber, channel.instrument, key, velocity);
        if (!noteInfo) {
            console.warn('note is not found');
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
            pitchBend: channel.pitchBend,
            expression: channel.expression,
            pitchBendSensitivity: channel.pitchBendSensitivity,
            mute: channel.mute,
            releaseTime: channel.releaseTime,
            cutOffFrequency: channel.cutOffFrequency,
            harmonicContent: channel.harmonicContent
        };
        // percussion
        if (channel.isPercussionPart) {
            if (key === 42 || key === 44) {
                // 42: Closed Hi-Hat
                // 44: Pedal Hi-Hat
                // 46: Open Hi-Hat
                this.noteOff(channelNumber, 46, 0);
            }
            if (key === 80) {
                // 80: Mute Triangle
                // 81: Open Triangle
                this.noteOff(channelNumber, 81, 0);
            }
        }
        // note on
        var note = new SynthesizerNote(this.ctx, this.gainMaster, noteInfo, instrumentKey);
        note.noteOn();
        channel.currentNoteOn.push(note);
    };
    Synthesizer.prototype.noteOff = function (channelNumber, key, _velocity) {
        if (!this.soundFont) {
            return;
        }
        var bankNumber = this.getBank(channelNumber);
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
    };
    Synthesizer.prototype.hold = function (channelNumber, value) {
        this.channels[channelNumber].hold = value;
    };
    Synthesizer.prototype.bankSelectMsb = function (channelNumber, value) {
        this.channels[channelNumber].bankMsb = value;
    };
    Synthesizer.prototype.bankSelectLsb = function (channelNumber, value) {
        this.channels[channelNumber].bankLsb = value;
    };
    Synthesizer.prototype.programChange = function (channelNumber, instrument) {
        this.channels[channelNumber].instrument = instrument;
    };
    Synthesizer.prototype.volumeChange = function (channelNumber, volume) {
        this.channels[channelNumber].volume = volume;
    };
    Synthesizer.prototype.expression = function (channelNumber, expression) {
        var currentNoteOn = this.channels[channelNumber].currentNoteOn;
        for (var i = 0, il = currentNoteOn.length; i < il; ++i) {
            currentNoteOn[i].updateExpression(expression);
        }
        this.channels[channelNumber].expression = expression;
    };
    
    Synthesizer.prototype.panpotChange = function (channelNumber, panpot) {
        this.channels[channelNumber].panpot = panpot;
    };
    Synthesizer.prototype.pitchBend = function (channelNumber, pitchBend) {
        pitchBend -= 0x2000;
        var channel = this.channels[channelNumber];
        for (var _i = 0, _a = channel.currentNoteOn; _i < _a.length; _i++) {
            var note = _a[_i];
            note.updatePitchBend(pitchBend);
        }
        channel.pitchBend = pitchBend;
    };
    Synthesizer.prototype.pitchBendSensitivity = function (channelNumber, sensitivity) {
        this.channels[channelNumber].pitchBendSensitivity = sensitivity;
    };
    Synthesizer.prototype.allSoundOff = function (channelNumber) {
        var currentNoteOn = this.channels[channelNumber].currentNoteOn;
        while (currentNoteOn.length > 0) {
            this.noteOff(channelNumber, currentNoteOn[0].key, 0);
        }
    };
    Synthesizer.prototype.resetAllControl = function (channelNumber) {
        this.pitchBend(channelNumber, 0);
    };
    Synthesizer.prototype.setReverbDepth = function (channelNumber, depth) {
        this.channels[channelNumber].reverb = depth;
    };
    Synthesizer.prototype.getBank = function (channelNumber) {
        var bankIndex = 0;
        if (channelNumber === 9) {
            this.setPercussionPart(9, true);
            return this.isXG ? 127 : 128;
        }
        if (this.isXG) {
            // XG音源は、MSB→LSBの優先順でバンクセレクトをする。
            if (this.channels[channelNumber].bankMsb === 64) {
                // Bank Select MSB #64 (Voice Type: SFX)
                bankIndex = 125;
            }
            else if (this.channels[channelNumber].bankMsb === 126 || this.channels[channelNumber].bankMsb === 127) {
                // Bank Select MSB #126 (Voice Type: Drum)
                // Bank Select MSB #127 (Voice Type: Drum)
                bankIndex = this.channels[channelNumber].bankMsb;
            }
            else {
                // Bank Select MSB #0 (Voice Type: Normal)
                // TODO:本来こちらが正しいが、バンクに存在しない楽器の処理ができていないためコメントアウト
                //bankIndex = this.channelBankLsb[channel];  
                bankIndex = 0;
            }
        }
        else if (this.isGS) {
            // GS音源
            bankIndex = 0;
            if (this.channels[channelNumber].isPercussionPart) {
                // http://www.roland.co.jp/support/by_product/sd-20/knowledge_base/1826700/
                bankIndex = 128;
            }
            else {
                // TODO: XG音源前提なんで・・・
                //bankIndex = this.channelBankMsb[channel];
            }
        }
        else {
            // GM音源の場合バンクセレクト無効化
            bankIndex = 0;
        }
        //if (this.percussionPart[channel] && SoundFont.Instruments.PercussionProgramName[this.channelInstrument[channel]] === void 0) {
        // パーカッションチャンネルで、GM に存在しないドラムセットが呼び出された時は、Standard Setを呼び出す。
        //this.channelInstrument[channel] = 0;
        //}
        return bankIndex;
    };
    
    return Synthesizer;
}());

var ProgramNames = {
    /**
     * GM Synth set
     * http://amei.or.jp/specifications/GM2_japanese.pdf
     */
    0: [
        "Acoustic Piano",
        "Bright Acoustic Piano",
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
        "Guitar Harmonics",
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
        "Pad 1 (new age)",
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
    ],
    /**
     * GM2 Drum Set List
     */
    128: [
        "Standard Set",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "Room Set",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "Power Set",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "Electronic Set",
        "Analog Set",
        null,
        null,
        null,
        null,
        null,
        null,
        "Jazz Set",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "Brush Set",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "Orchestra Set",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "SFX Set",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "(CM-64/CM-32L)"
    ]
};

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
        var name = names[i];
        if (name == "None (None)")
            continue;
        html += "<option value=\"" + i + "\">" + i + ": " + name + "</option>";
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
        var programNames = mergeProgramNames(programNamesFromBankSet(synth.soundFont.getPresetNames()), ProgramNames);
        var _loop_1 = function (i) {
            var bank = i !== 9 ? 0 : 128;
            var program = renderProgramOptions(programNames, bank);
            var item = renderInstrument(program);
            var channel = i;
            var select = item.querySelector('select');
            if (select) {
                select.addEventListener('change', function (event) {
                    var target = event.target;
                    var program = parseInt(target.value, 10);
                    _this.programChange(channel, program);
                    synth.programChange(channel, program);
                }, false);
                select.selectedIndex = synth.channels[i].instrument;
            }
            var notes = item.querySelectorAll(".key");
            var _loop_2 = function (j) {
                var key = j;
                notes[j].addEventListener('mousedown', function (event) {
                    event.preventDefault();
                    _this.drag = true;
                    _this.noteOn(channel, key, 127);
                    synth.noteOn(channel, key, 127);
                    var onMouseUp = function (event) {
                        document.removeEventListener('mouseup', onMouseUp);
                        event.preventDefault();
                        _this.drag = false;
                        _this.noteOff(channel, key, 0);
                        synth.noteOff(channel, key, 0);
                    };
                    document.addEventListener('mouseup', onMouseUp);
                });
                notes[j].addEventListener('mouseover', function (event) {
                    event.preventDefault();
                    if (_this.drag) {
                        _this.noteOn(channel, key, 127);
                        synth.noteOn(channel, key, 127);
                    }
                });
                notes[j].addEventListener('mouseout', function (event) {
                    event.preventDefault();
                    _this.noteOff(channel, key, 0);
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
    View.prototype.noteOn = function (channel, key, _velocity) {
        var element = this.getKeyElement(channel, key);
        if (element) {
            element.classList.add('note-on');
        }
    };
    View.prototype.noteOff = function (channel, key, _velocity) {
        var element = this.getKeyElement(channel, key);
        if (element) {
            element.classList.remove('note-on');
        }
    };
    View.prototype.programChange = function (channel, instrument) {
        var select = this.findInstrumentElement(channel, ".program select");
        if (select) {
            select.value = "" + instrument;
        }
    };
    View.prototype.volumeChange = function (channel, volume) {
        var element = this.findInstrumentElement(channel, ".volume");
        if (element) {
            element.textContent = "" + volume;
        }
    };
    View.prototype.panpotChange = function (channel, panpot) {
        var element = this.findInstrumentElement(channel, ".panpot");
        if (element) {
            element.textContent = "" + panpot;
        }
    };
    View.prototype.pitchBend = function (channel, pitchBend) {
        var element = this.findInstrumentElement(channel, ".pitchBend");
        if (element) {
            element.textContent = "" + pitchBend;
        }
    };
    View.prototype.pitchBendSensitivity = function (channel, sensitivity) {
        var element = this.findInstrumentElement(channel, ".pitchBendSensitivity");
        if (element) {
            element.textContent = "" + sensitivity;
        }
    };
    View.prototype.allSoundOff = function (_channelNumber) {
    };
    View.prototype.setMasterVolume = function (_volume) {
    };
    View.prototype.resetAllControl = function (_channelNumber) {
    };
    return View;
}());

var MidiMessageHandler = /** @class */ (function () {
    function MidiMessageHandler() {
        this.RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    MidiMessageHandler.prototype.processMidiMessage = function (message) {
        var channel = message[0] & 0x0f;
        var listener = this.listener;
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
                    case 0x40:// Hold
                        //listener.hold(channel, message[2]);
                        break;
                    case 0x0b:// Expression
                        listener.expression(channel, message[2]);
                        break;
                    case 0x47:// Cutoff Fequency (Brightness)
                        //listener.cutOffFrequency[channel] = message[2];
                        break;
                    case 0x48:// DecayTyme
                        //          synth.decayTime[channel] = value;
                        break;
                    case 0x49:// ReleaseTime
                        //listener.releaseTime(channel, message[2]);
                        break;
                    case 0x4A:// Hermonic Content (Resonance)
                        //listener.harmonicContent[channel] = message[2];
                        break;
                    case 0x5B:// Effect1 Depth（Reverb Send Level）
                        //listener.reverbDepth[channel] = message[2];
                        break;
                    default:
                }
                break;
            case 0xC0:// Program Change: Cn pp
                listener.programChange(channel, message[1]);
                break;
            case 0xE0: {
                var bend = ((message[1] & 0x7f) | ((message[2] & 0x7f) << 7));
                listener.pitchBend(channel, bend);
                break;
            }
            case 0xf0:// System Exclusive Message
                // ID number
                switch (message[1]) {
                    case 0x7e:// non-realtime
                        // GM Reset: F0 7E 7F 09 01 F7
                        if (message[2] === 0x7f && message[3] === 0x09 && message[4] === 0x01) {
                            listener.isXG = false;
                            listener.isGS = false;
                            listener.init();
                        }
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
                // Vendor
                switch (message[2]) {
                    case 0x43:// Yamaha XG
                        if (message[5] === 0x08) {
                            // XG Dram Part: F0 43 [dev] 4C 08 [partNum] 07 [map] F7
                            // but there is no file to use much this parameter...
                            if (message[7] !== 0x00) {
                                listener.setPercussionPart(message[6], true);
                            }
                            else {
                                listener.setPercussionPart(message[6], false);
                            }
                            //goog.global.console.log(message);
                        }
                        switch (message[7]) {
                            case 0x04:
                                // XG Master Volume: F0 43 [dev] 4C 00 00 04 [value] F7
                                listener.setMasterVolume((message[8] << 7) * 2);
                                //console.log(message[8] << 7);
                                break;
                            case 0x7E:
                                // XG Reset: F0 43 [dev] 4C 00 00 7E 00 F7
                                listener.init();
                                listener.isXG = true;
                                break;
                        }
                        break;
                    case 0x41:// Roland GS / TG300B Mode
                        // TODO
                        switch (message[8]) {
                            case 0x04:
                                // GS Master Volume: F0 41 [dev] 42 12 40 00 04 [value] 58 F7
                                listener.setMasterVolume(message[9] << 7);
                                break;
                            case 0x7F:
                                // GS Reset: F0 41 [dev] 42 12 40 00 7F 00 41 F7
                                listener.init();
                                listener.isGS = true;
                                break;
                            case 0x15:
                                // GS Dram part: F0 41 [dev] 42 12 40 1[part no] [Map] [sum] F7
                                // Notice: [sum] is ignroe in this program.
                                // http://www.ssw.co.jp/dtm/drums/drsetup.htm
                                // http://www.roland.co.jp/support/by_product/sd-20/knowledge_base/1826700/
                                var part = message[7] - 0x0F;
                                var map = message[8];
                                if (part === 0) {
                                    // 10 Ch.
                                    if (map !== 0x00) {
                                        listener.setPercussionPart(9, true);
                                    }
                                    else {
                                        listener.setPercussionPart(9, false);
                                    }
                                }
                                else if (part >= 10) {
                                    // 1~9 Ch.
                                    if (map !== 0x00) {
                                        listener.setPercussionPart(part - 1, true);
                                    }
                                    else {
                                        listener.setPercussionPart(part - 1, false);
                                    }
                                }
                                else {
                                    // 11~16 Ch.
                                    if (map !== 0x00) {
                                        listener.setPercussionPart(part, true);
                                    }
                                    else {
                                        listener.setPercussionPart(part, false);
                                    }
                                }
                                break;
                        }
                        break;
                }
                break;
            default:// not supported
                break;
        }
    };
    return MidiMessageHandler;
}());

// delegates method calls to multiple targets
function delegateProxy(targets) {
    return new Proxy(targets[0], {
        get: function (target, propKey, _receiver) {
            return function () {
                targets
                    .map(function (t) { return t[propKey].bind(target); })
                    .forEach(function (f) { return f.apply(void 0, arguments); });
            };
        }
    });
}
//# sourceMappingURL=delegateProxy.js.map

var WebMidiLink = /** @class */ (function () {
    function WebMidiLink(target) {
        if (target === void 0) { target = ".synth"; }
        this.ready = false;
        this.midiMessageHandler = new MidiMessageHandler();
        this.target = document.body.querySelector(target);
        if (window.opener) {
            this.wml = window.opener;
        }
        else if (window.parent !== window) {
            this.wml = window.parent;
        }
        else {
            this.wml = null;
        }
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
        var progress = this.target.appendChild(document.createElement('progress'));
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', function (ev) {
            var xhr = ev.target;
            this.onload(xhr.response);
            this.target.removeChild(this.target.firstChild);
            if (typeof this.loadCallback === 'function') {
                this.loadCallback(xhr.response);
            }
        }.bind(this), false);
        xhr.addEventListener('progress', function (e) {
            progress.max = e.total;
            progress.value = e.loaded;
            // NOTE: This message is not compliant of WebMidiLink.
            if (this.wml)
                this.wml.postMessage('link,progress,' + e.loaded + ',' + e.total, '*');
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
            synth = this.synth = new Synthesizer(ctx);
            synth.connect(ctx.destination);
            synth.loadSoundFont(input);
            var view = this.view = new View();
            this.target.appendChild(view.draw(synth));
            this.midiMessageHandler.listener = delegateProxy([synth, view]);
            window.addEventListener('message', this.onmessage.bind(this), false);
        }
        else {
            synth = this.synth;
            synth.loadSoundFont(input);
        }
        // link ready
        if (this.wml)
            this.wml.postMessage("link,ready", '*');
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
                        if (this.wml)
                            this.wml.postMessage("link,patch", '*');
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

exports.WebMidiLink = WebMidiLink;
exports.Synthesizer = Synthesizer;
exports.View = View;
exports.MidiMessageHandler = MidiMessageHandler;
exports.delegateProxy = delegateProxy;

Object.defineProperty(exports, '__esModule', { value: true });

})));
