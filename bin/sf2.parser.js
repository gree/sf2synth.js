/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "static";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _sf = __webpack_require__(1);
	
	Object.keys(_sf).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _sf[key];
	    }
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _riff = __webpack_require__(2);
	
	var _riff2 = _interopRequireDefault(_riff);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @param {ByteArray} input
	 * @param {Object=} opt_params
	 * @constructor
	 */
	var Parser = function Parser(input, opt_params) {
	  opt_params = opt_params || {};
	  /** @type {ByteArray} */
	  this.input = input;
	  /** @type {(Object|undefined)} */
	  this.parserOption = opt_params['parserOption'];
	
	  /** @type {Array.<Object>} */
	  this.presetHeader;
	  /** @type {Array.<Object>} */
	  this.presetZone;
	  /** @type {Array.<Object>} */
	  this.presetZoneModulator;
	  /** @type {Array.<Object>} */
	  this.presetZoneGenerator;
	  /** @type {Array.<Object>} */
	  this.instrument;
	  /** @type {Array.<Object>} */
	  this.instrumentZone;
	  /** @type {Array.<Object>} */
	  this.instrumentZoneModulator;
	  /** @type {Array.<Object>} */
	  this.instrumentZoneGenerator;
	  /** @type {Array.<Object>} */
	  this.sampleHeader;
	};
	
	Parser.prototype.parse = function () {
	  /** @type {Riff.Parser} */
	  var parser = new _riff2.default.Parser(this.input, this.parserOption);
	  /** @type {?Riff.Chunk} */
	  var chunk;
	
	  // parse RIFF chunk
	  parser.parse();
	  if (parser.chunkList.length !== 1) {
	    throw new Error('wrong chunk length');
	  }
	
	  chunk = parser.getChunk(0);
	  if (chunk === null) {
	    throw new Error('chunk not found');
	  }
	
	  this.parseRiffChunk(chunk);
	  //console.log(this.sampleHeader);
	  this.input = null;
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parseRiffChunk = function (chunk) {
	  /** @type {Riff.Parser} */
	  var parser;
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {string} */
	  var signature;
	
	  // check parse target
	  if (chunk.type !== 'RIFF') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  // check signature
	  signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);
	  if (signature !== 'sfbk') {
	    throw new Error('invalid signature:' + signature);
	  }
	
	  // read structure
	  parser = new _riff2.default.Parser(data, { 'index': ip, 'length': chunk.size - 4 });
	  parser.parse();
	  if (parser.getNumberOfChunks() !== 3) {
	    throw new Error('invalid sfbk structure');
	  }
	
	  // INFO-list
	  this.parseInfoList( /** @type {!Riff.Chunk} */parser.getChunk(0));
	
	  // sdta-list
	  this.parseSdtaList( /** @type {!Riff.Chunk} */parser.getChunk(1));
	
	  // pdta-list
	  this.parsePdtaList( /** @type {!Riff.Chunk} */parser.getChunk(2));
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parseInfoList = function (chunk) {
	  /** @type {Riff.Parser} */
	  var parser;
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {string} */
	  var signature;
	
	  // check parse target
	  if (chunk.type !== 'LIST') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  // check signature
	  signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);
	  if (signature !== 'INFO') {
	    throw new Error('invalid signature:' + signature);
	  }
	
	  // read structure
	  parser = new _riff2.default.Parser(data, { 'index': ip, 'length': chunk.size - 4 });
	  parser.parse();
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parseSdtaList = function (chunk) {
	  /** @type {Riff.Parser} */
	  var parser;
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {string} */
	  var signature;
	
	  // check parse target
	  if (chunk.type !== 'LIST') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  // check signature
	  signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);
	  if (signature !== 'sdta') {
	    throw new Error('invalid signature:' + signature);
	  }
	
	  // read structure
	  parser = new _riff2.default.Parser(data, { 'index': ip, 'length': chunk.size - 4 });
	  parser.parse();
	  if (parser.chunkList.length !== 1) {
	    throw new Error('TODO');
	  }
	  this.samplingData =
	  /** @type {{type: string, size: number, offset: number}} */
	  parser.getChunk(0);
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parsePdtaList = function (chunk) {
	  /** @type {Riff.Parser} */
	  var parser;
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {string} */
	  var signature;
	
	  // check parse target
	  if (chunk.type !== 'LIST') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  // check signature
	  signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);
	  if (signature !== 'pdta') {
	    throw new Error('invalid signature:' + signature);
	  }
	
	  // read structure
	  parser = new _riff2.default.Parser(data, { 'index': ip, 'length': chunk.size - 4 });
	  parser.parse();
	
	  // check number of chunks
	  if (parser.getNumberOfChunks() !== 9) {
	    throw new Error('invalid pdta chunk');
	  }
	
	  this.parsePhdr( /** @type {Riff.Chunk} */parser.getChunk(0));
	  this.parsePbag( /** @type {Riff.Chunk} */parser.getChunk(1));
	  this.parsePmod( /** @type {Riff.Chunk} */parser.getChunk(2));
	  this.parsePgen( /** @type {Riff.Chunk} */parser.getChunk(3));
	  this.parseInst( /** @type {Riff.Chunk} */parser.getChunk(4));
	  this.parseIbag( /** @type {Riff.Chunk} */parser.getChunk(5));
	  this.parseImod( /** @type {Riff.Chunk} */parser.getChunk(6));
	  this.parseIgen( /** @type {Riff.Chunk} */parser.getChunk(7));
	  this.parseShdr( /** @type {Riff.Chunk} */parser.getChunk(8));
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parsePhdr = function (chunk) {
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {Array.<Object>} */
	  var presetHeader = this.presetHeader = [];
	  /** @type {number} */
	  var size = chunk.offset + chunk.size;
	
	  // check parse target
	  if (chunk.type !== 'phdr') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  while (ip < size) {
	    presetHeader.push({
	      presetName: String.fromCharCode.apply(null, data.subarray(ip, ip += 20)),
	      preset: data[ip++] | data[ip++] << 8,
	      bank: data[ip++] | data[ip++] << 8,
	      presetBagIndex: data[ip++] | data[ip++] << 8,
	      library: (data[ip++] | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0,
	      genre: (data[ip++] | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0,
	      morphology: (data[ip++] | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0
	    });
	  }
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parsePbag = function (chunk) {
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {Array.<Object>} */
	  var presetZone = this.presetZone = [];
	  /** @type {number} */
	  var size = chunk.offset + chunk.size;
	
	  // check parse target
	  if (chunk.type !== 'pbag') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  while (ip < size) {
	    presetZone.push({
	      presetGeneratorIndex: data[ip++] | data[ip++] << 8,
	      presetModulatorIndex: data[ip++] | data[ip++] << 8
	    });
	  }
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parsePmod = function (chunk) {
	  // check parse target
	  if (chunk.type !== 'pmod') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  this.presetZoneModulator = this.parseModulator(chunk);
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parsePgen = function (chunk) {
	  // check parse target
	  if (chunk.type !== 'pgen') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	  this.presetZoneGenerator = this.parseGenerator(chunk);
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parseInst = function (chunk) {
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {Array.<Object>} */
	  var instrument = this.instrument = [];
	  /** @type {number} */
	  var size = chunk.offset + chunk.size;
	
	  // check parse target
	  if (chunk.type !== 'inst') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  while (ip < size) {
	    instrument.push({
	      instrumentName: String.fromCharCode.apply(null, data.subarray(ip, ip += 20)),
	      instrumentBagIndex: data[ip++] | data[ip++] << 8
	    });
	  }
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parseIbag = function (chunk) {
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {Array.<Object>} */
	  var instrumentZone = this.instrumentZone = [];
	  /** @type {number} */
	  var size = chunk.offset + chunk.size;
	
	  // check parse target
	  if (chunk.type !== 'ibag') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  while (ip < size) {
	    instrumentZone.push({
	      instrumentGeneratorIndex: data[ip++] | data[ip++] << 8,
	      instrumentModulatorIndex: data[ip++] | data[ip++] << 8
	    });
	  }
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parseImod = function (chunk) {
	  // check parse target
	  if (chunk.type !== 'imod') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  this.instrumentZoneModulator = this.parseModulator(chunk);
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parseIgen = function (chunk) {
	  // check parse target
	  if (chunk.type !== 'igen') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  this.instrumentZoneGenerator = this.parseGenerator(chunk);
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 */
	Parser.prototype.parseShdr = function (chunk) {
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {Array.<Object>} */
	  var samples = this.sample = [];
	  /** @type {Array.<Object>} */
	  var sampleHeader = this.sampleHeader = [];
	  /** @type {number} */
	  var size = chunk.offset + chunk.size;
	  /** @type {string} */
	  var sampleName;
	  /** @type {number} */
	  var start;
	  /** @type {number} */
	  var end;
	  /** @type {number} */
	  var startLoop;
	  /** @type {number} */
	  var endLoop;
	  /** @type {number} */
	  var sampleRate;
	  /** @type {number} */
	  var originalPitch;
	  /** @type {number} */
	  var pitchCorrection;
	  /** @type {number} */
	  var sampleLink;
	  /** @type {number} */
	  var sampleType;
	
	  // check parse target
	  if (chunk.type !== 'shdr') {
	    throw new Error('invalid chunk type:' + chunk.type);
	  }
	
	  while (ip < size) {
	    sampleName = String.fromCharCode.apply(null, data.subarray(ip, ip += 20));
	    start = (data[ip++] << 0 | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0;
	    end = (data[ip++] << 0 | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0;
	    startLoop = (data[ip++] << 0 | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0;
	    endLoop = (data[ip++] << 0 | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0;
	    sampleRate = (data[ip++] << 0 | data[ip++] << 8 | data[ip++] << 16 | data[ip++] << 24) >>> 0;
	    originalPitch = data[ip++];
	    pitchCorrection = data[ip++] << 24 >> 24;
	    sampleLink = data[ip++] | data[ip++] << 8;
	    sampleType = data[ip++] | data[ip++] << 8;
	
	    //*
	    var sample = new Int16Array(new Uint8Array(data.subarray(this.samplingData.offset + start * 2, this.samplingData.offset + end * 2)).buffer);
	
	    startLoop -= start;
	    endLoop -= start;
	
	    if (sampleRate > 0) {
	      var adjust = this.adjustSampleData(sample, sampleRate);
	      sample = adjust.sample;
	      sampleRate *= adjust.multiply;
	      startLoop *= adjust.multiply;
	      endLoop *= adjust.multiply;
	    }
	
	    samples.push(sample);
	    //*/
	
	    sampleHeader.push({
	      sampleName: sampleName,
	      /*
	      start: start,
	      end: end,
	      */
	      startLoop: startLoop,
	      endLoop: endLoop,
	      sampleRate: sampleRate,
	      originalPitch: originalPitch,
	      pitchCorrection: pitchCorrection,
	      sampleLink: sampleLink,
	      sampleType: sampleType
	    });
	  }
	};
	
	Parser.prototype.adjustSampleData = function (sample, sampleRate) {
	  /** @type {Int16Array} */
	  var newSample;
	  /** @type {number} */
	  var i;
	  /** @type {number} */
	  var il;
	  /** @type {number} */
	  var j;
	  /** @type {number} */
	  var multiply = 1;
	
	  // buffer
	  while (sampleRate < 22050) {
	    newSample = new Int16Array(sample.length * 2);
	    for (i = j = 0, il = sample.length; i < il; ++i) {
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
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 * @return {Array.<Object>}
	 */
	Parser.prototype.parseModulator = function (chunk) {
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {number} */
	  var size = chunk.offset + chunk.size;
	  /** @type {number} */
	  var code;
	  /** @type {string} */
	  var key;
	  /** @type {Array.<Object>} */
	  var output = [];
	
	  while (ip < size) {
	    // Src  Oper
	    // TODO
	    ip += 2;
	
	    // Dest Oper
	    code = data[ip++] | data[ip++] << 8;
	    key = Parser.GeneratorEnumeratorTable[code];
	    if (key === void 0) {
	      // Amount
	      output.push({
	        type: key,
	        value: {
	          code: code,
	          amount: data[ip] | data[ip + 1] << 8 << 16 >> 16,
	          lo: data[ip++],
	          hi: data[ip++]
	        }
	      });
	    } else {
	      // Amount
	      switch (key) {
	        case 'keyRange': /* FALLTHROUGH */
	        case 'velRange': /* FALLTHROUGH */
	        case 'keynum': /* FALLTHROUGH */
	        case 'velocity':
	          output.push({
	            type: key,
	            value: {
	              lo: data[ip++],
	              hi: data[ip++]
	            }
	          });
	          break;
	        default:
	          output.push({
	            type: key,
	            value: {
	              amount: data[ip++] | data[ip++] << 8 << 16 >> 16
	            }
	          });
	          break;
	      }
	    }
	
	    // AmtSrcOper
	    // TODO
	    ip += 2;
	
	    // Trans Oper
	    // TODO
	    ip += 2;
	  }
	
	  return output;
	};
	
	/**
	 * @param {Riff.Chunk} chunk
	 * @return {Array.<Object>}
	 */
	Parser.prototype.parseGenerator = function (chunk) {
	  /** @type {ByteArray} */
	  var data = this.input;
	  /** @type {number} */
	  var ip = chunk.offset;
	  /** @type {number} */
	  var size = chunk.offset + chunk.size;
	  /** @type {number} */
	  var code;
	  /** @type {string} */
	  var key;
	  /** @type {Array.<Object>} */
	  var output = [];
	
	  while (ip < size) {
	    code = data[ip++] | data[ip++] << 8;
	    key = Parser.GeneratorEnumeratorTable[code];
	    if (key === void 0) {
	      output.push({
	        type: key,
	        value: {
	          code: code,
	          amount: data[ip] | data[ip + 1] << 8 << 16 >> 16,
	          lo: data[ip++],
	          hi: data[ip++]
	        }
	      });
	      continue;
	    }
	
	    switch (key) {
	      case 'keynum': /* FALLTHROUGH */
	      case 'keyRange': /* FALLTHROUGH */
	      case 'velRange': /* FALLTHROUGH */
	      case 'velocity':
	        output.push({
	          type: key,
	          value: {
	            lo: data[ip++],
	            hi: data[ip++]
	          }
	        });
	        break;
	      default:
	        output.push({
	          type: key,
	          value: {
	            amount: data[ip++] | data[ip++] << 8 << 16 >> 16
	          }
	        });
	        break;
	    }
	  }
	
	  return output;
	};
	
	Parser.prototype.createInstrument = function () {
	  /** @type {Array.<Object>} */
	  var instrument = this.instrument;
	  /** @type {Array.<Object>} */
	  var zone = this.instrumentZone;
	  /** @type {Array.<Object>} */
	  var output = [];
	  /** @type {number} */
	  var bagIndex;
	  /** @type {number} */
	  var bagIndexEnd;
	  /** @type {Array.<Object>} */
	  var zoneInfo;
	  /** @type {{generator: Object, generatorInfo: Array.<Object>}} */
	  var instrumentGenerator;
	  /** @type {{modulator: Object, modulatorInfo: Array.<Object>}} */
	  var instrumentModulator;
	  /** @type {number} */
	  var i;
	  /** @type {number} */
	  var il;
	  /** @type {number} */
	  var j;
	  /** @type {number} */
	  var jl;
	
	  // instrument -> instrument bag -> generator / modulator
	  for (i = 0, il = instrument.length; i < il; ++i) {
	    bagIndex = instrument[i].instrumentBagIndex;
	    bagIndexEnd = instrument[i + 1] ? instrument[i + 1].instrumentBagIndex : zone.length;
	    zoneInfo = [];
	
	    // instrument bag
	    for (j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
	      instrumentGenerator = this.createInstrumentGenerator_(zone, j);
	      instrumentModulator = this.createInstrumentModulator_(zone, j);
	
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
	};
	
	Parser.prototype.createPreset = function () {
	  /** @type {Array.<Object>} */
	  var preset = this.presetHeader;
	  /** @type {Array.<Object>} */
	  var zone = this.presetZone;
	  /** @type {Array.<Object>} */
	  var output = [];
	  /** @type {number} */
	  var bagIndex;
	  /** @type {number} */
	  var bagIndexEnd;
	  /** @type {Array.<Object>} */
	  var zoneInfo;
	  /** @type {number} */
	  var instrument;
	  /** @type {{generator: Object, generatorInfo: Array.<Object>}} */
	  var presetGenerator;
	  /** @type {{modulator: Object, modulatorInfo: Array.<Object>}} */
	  var presetModulator;
	  /** @type {number} */
	  var i;
	  /** @type {number} */
	  var il;
	  /** @type {number} */
	  var j;
	  /** @type {number} */
	  var jl;
	
	  // preset -> preset bag -> generator / modulator
	  for (i = 0, il = preset.length; i < il; ++i) {
	    bagIndex = preset[i].presetBagIndex;
	    bagIndexEnd = preset[i + 1] ? preset[i + 1].presetBagIndex : zone.length;
	    zoneInfo = [];
	
	    // preset bag
	    for (j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
	      presetGenerator = this.createPresetGenerator_(zone, j);
	      presetModulator = this.createPresetModulator_(zone, j);
	
	      zoneInfo.push({
	        generator: presetGenerator.generator,
	        generatorSequence: presetGenerator.generatorInfo,
	        modulator: presetModulator.modulator,
	        modulatorSequence: presetModulator.modulatorInfo
	      });
	
	      instrument = presetGenerator.generator['instrument'] !== void 0 ? presetGenerator.generator['instrument'].amount : presetModulator.modulator['instrument'] !== void 0 ? presetModulator.modulator['instrument'].amount : null;
	    }
	
	    output.push({
	      name: preset[i].presetName,
	      info: zoneInfo,
	      header: preset[i],
	      instrument: instrument
	    });
	  }
	
	  return output;
	};
	
	/**
	 * @param {Array.<Object>} zone
	 * @param {number} index
	 * @returns {{generator: Object, generatorInfo: Array.<Object>}}
	 * @private
	 */
	Parser.prototype.createInstrumentGenerator_ = function (zone, index) {
	  var modgen = this.createBagModGen_(zone, zone[index].instrumentGeneratorIndex, zone[index + 1] ? zone[index + 1].instrumentGeneratorIndex : this.instrumentZoneGenerator.length, this.instrumentZoneGenerator);
	
	  return {
	    generator: modgen.modgen,
	    generatorInfo: modgen.modgenInfo
	  };
	};
	
	/**
	 * @param {Array.<Object>} zone
	 * @param {number} index
	 * @returns {{modulator: Object, modulatorInfo: Array.<Object>}}
	 * @private
	 */
	Parser.prototype.createInstrumentModulator_ = function (zone, index) {
	  var modgen = this.createBagModGen_(zone, zone[index].presetModulatorIndex, zone[index + 1] ? zone[index + 1].instrumentModulatorIndex : this.instrumentZoneModulator.length, this.instrumentZoneModulator);
	
	  return {
	    modulator: modgen.modgen,
	    modulatorInfo: modgen.modgenInfo
	  };
	};
	
	/**
	 * @param {Array.<Object>} zone
	 * @param {number} index
	 * @returns {{generator: Object, generatorInfo: Array.<Object>}}
	 * @private
	 */
	Parser.prototype.createPresetGenerator_ = function (zone, index) {
	  var modgen = this.createBagModGen_(zone, zone[index].presetGeneratorIndex, zone[index + 1] ? zone[index + 1].presetGeneratorIndex : this.presetZoneGenerator.length, this.presetZoneGenerator);
	
	  return {
	    generator: modgen.modgen,
	    generatorInfo: modgen.modgenInfo
	  };
	};
	
	/**
	 * @param {Array.<Object>} zone
	 * @param {number} index
	 * @returns {{modulator: Object, modulatorInfo: Array.<Object>}}
	 * @private
	 */
	Parser.prototype.createPresetModulator_ = function (zone, index) {
	  /** @type {{modgen: Object, modgenInfo: Array.<Object>}} */
	  var modgen = this.createBagModGen_(zone, zone[index].presetModulatorIndex, zone[index + 1] ? zone[index + 1].presetModulatorIndex : this.presetZoneModulator.length, this.presetZoneModulator);
	
	  return {
	    modulator: modgen.modgen,
	    modulatorInfo: modgen.modgenInfo
	  };
	};
	
	/**
	 * @param {Array.<Object>} zone
	 * @param {number} indexStart
	 * @param {number} indexEnd
	 * @param zoneModGen
	 * @returns {{modgen: Object, modgenInfo: Array.<Object>}}
	 * @private
	 */
	Parser.prototype.createBagModGen_ = function (zone, indexStart, indexEnd, zoneModGen) {
	  /** @type {Array.<Object>} */
	  var modgenInfo = [];
	  /** @type {Object} */
	  var modgen = {
	    unknown: [],
	    'keyRange': {
	      hi: 127,
	      lo: 0
	    }
	  }; // TODO
	  /** @type {Object} */
	  var info;
	  /** @type {number} */
	  var i;
	  /** @type {number} */
	  var il;
	
	  for (i = indexStart, il = indexEnd; i < il; ++i) {
	    info = zoneModGen[i];
	    modgenInfo.push(info);
	
	    if (info.type === 'unknown') {
	      modgen.unknown.push(info.value);
	    } else {
	      modgen[info.type] = info.value;
	    }
	  }
	
	  return {
	    modgen: modgen,
	    modgenInfo: modgenInfo
	  };
	};
	
	/**
	 * @type {Array.<string>}
	 * @const
	 */
	Parser.GeneratorEnumeratorTable = ['startAddrsOffset', 'endAddrsOffset', 'startloopAddrsOffset', 'endloopAddrsOffset', 'startAddrsCoarseOffset', 'modLfoToPitch', 'vibLfoToPitch', 'modEnvToPitch', 'initialFilterFc', 'initialFilterQ', 'modLfoToFilterFc', 'modEnvToFilterFc', 'endAddrsCoarseOffset', 'modLfoToVolume',, // 14
	'chorusEffectsSend', 'reverbEffectsSend', 'pan',,,, // 18,19,20
	'delayModLFO', 'freqModLFO', 'delayVibLFO', 'freqVibLFO', 'delayModEnv', 'attackModEnv', 'holdModEnv', 'decayModEnv', 'sustainModEnv', 'releaseModEnv', 'keynumToModEnvHold', 'keynumToModEnvDecay', 'delayVolEnv', 'attackVolEnv', 'holdVolEnv', 'decayVolEnv', 'sustainVolEnv', 'releaseVolEnv', 'keynumToVolEnvHold', 'keynumToVolEnvDecay', 'instrument',, // 42
	'keyRange', 'velRange', 'startloopAddrsCoarseOffset', 'keynum', 'velocity', 'initialAttenuation',, // 49
	'endloopAddrsCoarseOffset', 'coarseTune', 'fineTune', 'sampleID', 'sampleModes',, // 55
	'scaleTuning', 'exclusiveClass', 'overridingRootKey'];
	
	exports.default = Parser;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Riff = {};
	
	/**
	 * @param {ByteArray} input input buffer.
	 * @param {Object=} opt_params option parameters.
	 * @constructor
	 */
	Riff.Parser = function (input, opt_params) {
	  opt_params = opt_params || {};
	  /** @type {ByteArray} */
	  this.input = input;
	  /** @type {number} */
	  this.ip = opt_params['index'] || 0;
	  /** @type {number} */
	  this.length = opt_params['length'] || input.length - this.ip;
	  /** @type {Array.<Riff.Chunk>} */
	  this.chunkList;
	  /** @type {number} */
	  this.offset = this.ip;
	  /** @type {boolean} */
	  this.padding = opt_params['padding'] !== void 0 ? opt_params['padding'] : true;
	  /** @type {boolean} */
	  this.bigEndian = opt_params['bigEndian'] !== void 0 ? opt_params['bigEndian'] : false;
	};
	
	/**
	 * @param {string} type
	 * @param {number} size
	 * @param {number} offset
	 * @constructor
	 */
	Riff.Chunk = function (type, size, offset) {
	  /** @type {string} */
	  this.type = type;
	  /** @type {number} */
	  this.size = size;
	  /** @type {number} */
	  this.offset = offset;
	};
	
	Riff.Parser.prototype.parse = function () {
	  /** @type {number} */
	  var length = this.length + this.offset;
	
	  this.chunkList = [];
	
	  while (this.ip < length) {
	    this.parseChunk();
	  }
	};
	
	Riff.Parser.prototype.parseChunk = function () {
	  /** @type {ByteArray} */
	  var input = this.input;
	  /** @type {number} */
	  var ip = this.ip;
	  /** @type {number} */
	  var size;
	
	  this.chunkList.push(new Riff.Chunk(String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]), size = this.bigEndian ? (input[ip++] << 24 | input[ip++] << 16 | input[ip++] << 8 | input[ip++]) >>> 0 : (input[ip++] | input[ip++] << 8 | input[ip++] << 16 | input[ip++] << 24) >>> 0, ip));
	
	  ip += size;
	
	  // padding
	  if (this.padding && (ip - this.offset & 1) === 1) {
	    ip++;
	  }
	
	  this.ip = ip;
	};
	
	/**
	 * @param {number} index chunk index.
	 * @return {?Riff.Chunk}
	 */
	Riff.Parser.prototype.getChunk = function (index) {
	  /** @type {Riff.Chunk} */
	  var chunk = this.chunkList[index];
	
	  if (chunk === void 0) {
	    return null;
	  }
	
	  return chunk;
	};
	
	/**
	 * @return {number}
	 */
	Riff.Parser.prototype.getNumberOfChunks = function () {
	  return this.chunkList.length;
	};
	
	exports.default = Riff;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2E3YTZiZGVkYmY2M2VlNWI1ZWQiLCJ3ZWJwYWNrOi8vLy4vZXhwb3J0L3BhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2YyLmpzIiwid2VicGFjazovLy8uL3NyYy9yaWZmLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEk7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7QUFFQTs7Ozs7QUFLQSxLQUFNLFNBQVMsU0FBVCxNQUFTLENBQVMsS0FBVCxFQUFnQixVQUFoQixFQUE0QjtBQUN6QyxnQkFBYSxjQUFjLEVBQTNCO0FBQ0E7QUFDQSxRQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0E7QUFDQSxRQUFLLFlBQUwsR0FBb0IsV0FBVyxjQUFYLENBQXBCOztBQUVBO0FBQ0EsUUFBSyxZQUFMO0FBQ0E7QUFDQSxRQUFLLFVBQUw7QUFDQTtBQUNBLFFBQUssbUJBQUw7QUFDQTtBQUNBLFFBQUssbUJBQUw7QUFDQTtBQUNBLFFBQUssVUFBTDtBQUNBO0FBQ0EsUUFBSyxjQUFMO0FBQ0E7QUFDQSxRQUFLLHVCQUFMO0FBQ0E7QUFDQSxRQUFLLHVCQUFMO0FBQ0E7QUFDQSxRQUFLLFlBQUw7QUFDRCxFQXpCRDs7QUEyQkEsUUFBTyxTQUFQLENBQWlCLEtBQWpCLEdBQXlCLFlBQVc7QUFDbEM7QUFDQSxPQUFJLFNBQVMsSUFBSSxlQUFLLE1BQVQsQ0FBZ0IsS0FBSyxLQUFyQixFQUE0QixLQUFLLFlBQWpDLENBQWI7QUFDQTtB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QVksU0FBWixDQUFzQixRQUF0QixHQUFpQyxVQUFTLEtBQVQsRUFBZ0I7QUFDL0M7QUFDQSxPQUFJLFFBQVEsS0FBSyxTQUFMLENBQWUsS0FBZixDQUFaOztBQUVBLE9BQUksVUFBVSxLQUFLLENBQW5CLEVBQXNCO0FBQ3BCLFlBQU8sSUFBUDtBQUNEOztBQUVELFVBQU8sS0FBUDtBQUNELEVBVEQ7O0FBV0E7OztBQUdBLE1BQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsaUJBQXRCLEdBQTBDLFlBQVc7QUFDbkQsVUFBTyxLQUFLLFNBQUwsQ0FBZSxNQUF0QjtBQUNELEVBRkQ7O21CQUllLEkiLCJmaWxlIjoic2YyLnBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcInN0YXRpY1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgM2E3YTZiZGVkYmY2M2VlNWI1ZWRcbiAqKi8iLCJleHBvcnQgKiBmcm9tIFwiLi4vc3JjL3NmMlwiXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vZXhwb3J0L3BhcnNlci5qc1xuICoqLyIsImltcG9ydCBSaWZmIGZyb20gXCIuL3JpZmZcIlxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7Qnl0ZUFycmF5fSBpbnB1dFxyXG4gKiBAcGFyYW0ge09iamVjdD19IG9wdF9wYXJhbXNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5jb25zdCBQYXJzZXIgPSBmdW5jdGlvbihpbnB1dCwgb3B0X3BhcmFtcykge1xyXG4gIG9wdF9wYXJhbXMgPSBvcHRfcGFyYW1zIHx8IHt9O1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICAvKiogQHR5cGUgeyhPYmplY3R8dW5kZWZpbmVkKX0gKi9cclxuICB0aGlzLnBhcnNlck9wdGlvbiA9IG9wdF9wYXJhbXNbJ3BhcnNlck9wdGlvbiddO1xyXG5cclxuICAvKiogQHR5cGUge0FycmF5LjxPYmplY3Q+fSAqL1xyXG4gIHRoaXMucHJlc2V0SGVhZGVyO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5wcmVzZXRab25lO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5wcmVzZXRab25lTW9kdWxhdG9yO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5wcmVzZXRab25lR2VuZXJhdG9yO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5pbnN0cnVtZW50O1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5pbnN0cnVtZW50Wm9uZTtcclxuICAvKiogQHR5cGUge0FycmF5LjxPYmplY3Q+fSAqL1xyXG4gIHRoaXMuaW5zdHJ1bWVudFpvbmVNb2R1bGF0b3I7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB0aGlzLmluc3RydW1lbnRab25lR2VuZXJhdG9yO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5zYW1wbGVIZWFkZXI7XHJcbn07XHJcblxyXG5QYXJzZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oKSB7XHJcbiAgLyoqIEB0eXBlIHtSaWZmLlBhcnNlcn0gKi9cclxuICB2YXIgcGFyc2VyID0gbmV3IFJpZmYuUGFyc2VyKHRoaXMuaW5wdXQsIHRoaXMucGFyc2VyT3B0aW9uKTtcclxuICAvKiogQHR5cGUgez9SaWZmLkNodW5rfSAqL1xyXG4gIHZhciBjaHVuaztcclxuXHJcbiAgLy8gcGFyc2UgUklGRiBjaHVua1xyXG4gIHBhcnNlci5wYXJzZSgpO1xyXG4gIGlmIChwYXJzZXIuY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBjaHVuayBsZW5ndGgnKTtcclxuICB9XHJcblxyXG4gIGNodW5rID0gcGFyc2VyLmdldENodW5rKDApO1xyXG4gIGlmIChjaHVuayA9PT0gbnVsbCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjaHVuayBub3QgZm91bmQnKTtcclxuICB9XHJcblxyXG4gIHRoaXMucGFyc2VSaWZmQ2h1bmsoY2h1bmspO1xyXG4vL2NvbnNvbGUubG9nKHRoaXMuc2FtcGxlSGVhZGVyKTtcclxuICB0aGlzLmlucHV0ID0gbnVsbDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge1JpZmYuQ2h1bmt9IGNodW5rXHJcbiAqL1xyXG5QYXJzZXIucHJvdG90eXBlLnBhcnNlUmlmZkNodW5rID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvKiogQHR5cGUge1JpZmYuUGFyc2VyfSAqL1xyXG4gIHZhciBwYXJzZXI7XHJcbiAgLyoqIEB0eXBlIHtCeXRlQXJyYXl9ICovXHJcbiAgdmFyIGRhdGEgPSB0aGlzLmlucHV0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpcCA9IGNodW5rLm9mZnNldDtcclxuICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICB2YXIgc2lnbmF0dXJlO1xyXG5cclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ1JJRkYnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBzaWduYXR1cmVcclxuICBzaWduYXR1cmUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10pO1xyXG4gIGlmIChzaWduYXR1cmUgIT09ICdzZmJrJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKTtcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcGFyc2VyID0gbmV3IFJpZmYuUGFyc2VyKGRhdGEsIHsnaW5kZXgnOiBpcCwgJ2xlbmd0aCc6IGNodW5rLnNpemUgLSA0fSk7XHJcbiAgcGFyc2VyLnBhcnNlKCk7XHJcbiAgaWYgKHBhcnNlci5nZXROdW1iZXJPZkNodW5rcygpICE9PSAzKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgc2ZiayBzdHJ1Y3R1cmUnKTtcclxuICB9XHJcblxyXG4gIC8vIElORk8tbGlzdFxyXG4gIHRoaXMucGFyc2VJbmZvTGlzdCgvKiogQHR5cGUgeyFSaWZmLkNodW5rfSAqLyhwYXJzZXIuZ2V0Q2h1bmsoMCkpKTtcclxuXHJcbiAgLy8gc2R0YS1saXN0XHJcbiAgdGhpcy5wYXJzZVNkdGFMaXN0KC8qKiBAdHlwZSB7IVJpZmYuQ2h1bmt9ICovKHBhcnNlci5nZXRDaHVuaygxKSkpO1xyXG5cclxuICAvLyBwZHRhLWxpc3RcclxuICB0aGlzLnBhcnNlUGR0YUxpc3QoLyoqIEB0eXBlIHshUmlmZi5DaHVua30gKi8ocGFyc2VyLmdldENodW5rKDIpKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZUluZm9MaXN0ID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvKiogQHR5cGUge1JpZmYuUGFyc2VyfSAqL1xyXG4gIHZhciBwYXJzZXI7XHJcbiAgLyoqIEB0eXBlIHtCeXRlQXJyYXl9ICovXHJcbiAgdmFyIGRhdGEgPSB0aGlzLmlucHV0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpcCA9IGNodW5rLm9mZnNldDtcclxuICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICB2YXIgc2lnbmF0dXJlO1xyXG5cclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ0xJU1QnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBzaWduYXR1cmVcclxuICBzaWduYXR1cmUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10pO1xyXG4gIGlmIChzaWduYXR1cmUgIT09ICdJTkZPJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKTtcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcGFyc2VyID0gbmV3IFJpZmYuUGFyc2VyKGRhdGEsIHsnaW5kZXgnOiBpcCwgJ2xlbmd0aCc6IGNodW5rLnNpemUgLSA0fSk7XHJcbiAgcGFyc2VyLnBhcnNlKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVNkdGFMaXN0ID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvKiogQHR5cGUge1JpZmYuUGFyc2VyfSAqL1xyXG4gIHZhciBwYXJzZXI7XHJcbiAgLyoqIEB0eXBlIHtCeXRlQXJyYXl9ICovXHJcbiAgdmFyIGRhdGEgPSB0aGlzLmlucHV0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpcCA9IGNodW5rLm9mZnNldDtcclxuICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICB2YXIgc2lnbmF0dXJlO1xyXG5cclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ0xJU1QnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBzaWduYXR1cmVcclxuICBzaWduYXR1cmUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10pO1xyXG4gIGlmIChzaWduYXR1cmUgIT09ICdzZHRhJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKTtcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcGFyc2VyID0gbmV3IFJpZmYuUGFyc2VyKGRhdGEsIHsnaW5kZXgnOiBpcCwgJ2xlbmd0aCc6IGNodW5rLnNpemUgLSA0fSk7XHJcbiAgcGFyc2VyLnBhcnNlKCk7XHJcbiAgaWYgKHBhcnNlci5jaHVua0xpc3QubGVuZ3RoICE9PSAxKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RPRE8nKTtcclxuICB9XHJcbiAgdGhpcy5zYW1wbGluZ0RhdGEgPVxyXG4gICAgLyoqIEB0eXBlIHt7dHlwZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIG9mZnNldDogbnVtYmVyfX0gKi9cclxuICAgIChwYXJzZXIuZ2V0Q2h1bmsoMCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VQZHRhTGlzdCA9IGZ1bmN0aW9uKGNodW5rKSB7XHJcbiAgLyoqIEB0eXBlIHtSaWZmLlBhcnNlcn0gKi9cclxuICB2YXIgcGFyc2VyO1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXHJcbiAgdmFyIHNpZ25hdHVyZTtcclxuXHJcbiAgLy8gY2hlY2sgcGFyc2UgdGFyZ2V0XHJcbiAgaWYgKGNodW5rLnR5cGUgIT09ICdMSVNUJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyArIGNodW5rLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgc2lnbmF0dXJlXHJcbiAgc2lnbmF0dXJlID0gU3RyaW5nLmZyb21DaGFyQ29kZShkYXRhW2lwKytdLCBkYXRhW2lwKytdLCBkYXRhW2lwKytdLCBkYXRhW2lwKytdKTtcclxuICBpZiAoc2lnbmF0dXJlICE9PSAncGR0YScpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaWduYXR1cmU6JyArIHNpZ25hdHVyZSk7XHJcbiAgfVxyXG5cclxuICAvLyByZWFkIHN0cnVjdHVyZVxyXG4gIHBhcnNlciA9IG5ldyBSaWZmLlBhcnNlcihkYXRhLCB7J2luZGV4JzogaXAsICdsZW5ndGgnOiBjaHVuay5zaXplIC0gNH0pO1xyXG4gIHBhcnNlci5wYXJzZSgpO1xyXG5cclxuICAvLyBjaGVjayBudW1iZXIgb2YgY2h1bmtzXHJcbiAgaWYgKHBhcnNlci5nZXROdW1iZXJPZkNodW5rcygpICE9PSA5KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGR0YSBjaHVuaycpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5wYXJzZVBoZHIoLyoqIEB0eXBlIHtSaWZmLkNodW5rfSAqLyhwYXJzZXIuZ2V0Q2h1bmsoMCkpKTtcclxuICB0aGlzLnBhcnNlUGJhZygvKiogQHR5cGUge1JpZmYuQ2h1bmt9ICovKHBhcnNlci5nZXRDaHVuaygxKSkpO1xyXG4gIHRoaXMucGFyc2VQbW9kKC8qKiBAdHlwZSB7UmlmZi5DaHVua30gKi8ocGFyc2VyLmdldENodW5rKDIpKSk7XHJcbiAgdGhpcy5wYXJzZVBnZW4oLyoqIEB0eXBlIHtSaWZmLkNodW5rfSAqLyhwYXJzZXIuZ2V0Q2h1bmsoMykpKTtcclxuICB0aGlzLnBhcnNlSW5zdCgvKiogQHR5cGUge1JpZmYuQ2h1bmt9ICovKHBhcnNlci5nZXRDaHVuayg0KSkpO1xyXG4gIHRoaXMucGFyc2VJYmFnKC8qKiBAdHlwZSB7UmlmZi5DaHVua30gKi8ocGFyc2VyLmdldENodW5rKDUpKSk7XHJcbiAgdGhpcy5wYXJzZUltb2QoLyoqIEB0eXBlIHtSaWZmLkNodW5rfSAqLyhwYXJzZXIuZ2V0Q2h1bmsoNikpKTtcclxuICB0aGlzLnBhcnNlSWdlbigvKiogQHR5cGUge1JpZmYuQ2h1bmt9ICovKHBhcnNlci5nZXRDaHVuayg3KSkpO1xyXG4gIHRoaXMucGFyc2VTaGRyKC8qKiBAdHlwZSB7UmlmZi5DaHVua30gKi8ocGFyc2VyLmdldENodW5rKDgpKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVBoZHIgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgcHJlc2V0SGVhZGVyID0gdGhpcy5wcmVzZXRIZWFkZXIgPSBbXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemU7XHJcblxyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSAncGhkcicpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKTtcclxuICB9XHJcblxyXG4gIHdoaWxlIChpcCA8IHNpemUpIHtcclxuICAgIHByZXNldEhlYWRlci5wdXNoKHtcclxuICAgICAgcHJlc2V0TmFtZTogU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBkYXRhLnN1YmFycmF5KGlwLCBpcCArPSAyMCkpLFxyXG4gICAgICBwcmVzZXQ6IGRhdGFbaXArK10gfCAoZGF0YVtpcCsrXSA8PCA4KSxcclxuICAgICAgYmFuazogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpLFxyXG4gICAgICBwcmVzZXRCYWdJbmRleDogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpLFxyXG4gICAgICBsaWJyYXJ5OiAoZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpIHwgKGRhdGFbaXArK10gPDwgMTYpIHwgKGRhdGFbaXArK10gPDwgMjQpKSA+Pj4gMCxcclxuICAgICAgZ2VucmU6IChkYXRhW2lwKytdIHwgKGRhdGFbaXArK10gPDwgOCkgfCAoZGF0YVtpcCsrXSA8PCAxNikgfCAoZGF0YVtpcCsrXSA8PCAyNCkpID4+PiAwLFxyXG4gICAgICBtb3JwaG9sb2d5OiAoZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpIHwgKGRhdGFbaXArK10gPDwgMTYpIHwgKGRhdGFbaXArK10gPDwgMjQpKSA+Pj4gMFxyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VQYmFnID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvKiogQHR5cGUge0J5dGVBcnJheX0gKi9cclxuICB2YXIgZGF0YSA9IHRoaXMuaW5wdXQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGlwID0gY2h1bmsub2Zmc2V0O1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdmFyIHByZXNldFpvbmUgPSB0aGlzLnByZXNldFpvbmUgPSBbXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemU7XHJcblxyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSAncGJhZycpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICB3aGlsZSAoaXAgPCBzaXplKSB7XHJcbiAgICBwcmVzZXRab25lLnB1c2goe1xyXG4gICAgICBwcmVzZXRHZW5lcmF0b3JJbmRleDogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpLFxyXG4gICAgICBwcmVzZXRNb2R1bGF0b3JJbmRleDogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVBtb2QgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSAncG1vZCcpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKTtcclxuICB9XHJcblxyXG4gIHRoaXMucHJlc2V0Wm9uZU1vZHVsYXRvciA9IHRoaXMucGFyc2VNb2R1bGF0b3IoY2h1bmspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VQZ2VuID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ3BnZW4nKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG4gIHRoaXMucHJlc2V0Wm9uZUdlbmVyYXRvciA9IHRoaXMucGFyc2VHZW5lcmF0b3IoY2h1bmspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VJbnN0ID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvKiogQHR5cGUge0J5dGVBcnJheX0gKi9cclxuICB2YXIgZGF0YSA9IHRoaXMuaW5wdXQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGlwID0gY2h1bmsub2Zmc2V0O1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdmFyIGluc3RydW1lbnQgPSB0aGlzLmluc3RydW1lbnQgPSBbXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemU7XHJcblxyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSAnaW5zdCcpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKTtcclxuICB9XHJcblxyXG4gIHdoaWxlIChpcCA8IHNpemUpIHtcclxuICAgIGluc3RydW1lbnQucHVzaCh7XHJcbiAgICAgIGluc3RydW1lbnROYW1lOiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGRhdGEuc3ViYXJyYXkoaXAsIGlwICs9IDIwKSksXHJcbiAgICAgIGluc3RydW1lbnRCYWdJbmRleDogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZUliYWcgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgaW5zdHJ1bWVudFpvbmUgPSB0aGlzLmluc3RydW1lbnRab25lID0gW107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHNpemUgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplO1xyXG5cclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ2liYWcnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgd2hpbGUgKGlwIDwgc2l6ZSkge1xyXG4gICAgaW5zdHJ1bWVudFpvbmUucHVzaCh7XHJcbiAgICAgIGluc3RydW1lbnRHZW5lcmF0b3JJbmRleDogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpLFxyXG4gICAgICBpbnN0cnVtZW50TW9kdWxhdG9ySW5kZXg6IGRhdGFbaXArK10gfCAoZGF0YVtpcCsrXSA8PCA4KVxyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VJbW9kID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ2ltb2QnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICB0aGlzLmluc3RydW1lbnRab25lTW9kdWxhdG9yID0gdGhpcy5wYXJzZU1vZHVsYXRvcihjaHVuayk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VJZ2VuID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ2lnZW4nKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICB0aGlzLmluc3RydW1lbnRab25lR2VuZXJhdG9yID0gdGhpcy5wYXJzZUdlbmVyYXRvcihjaHVuayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVNoZHIgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgc2FtcGxlcyA9IHRoaXMuc2FtcGxlID0gW107XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgc2FtcGxlSGVhZGVyID0gdGhpcy5zYW1wbGVIZWFkZXIgPSBbXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemU7XHJcbiAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXHJcbiAgdmFyIHNhbXBsZU5hbWU7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHN0YXJ0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBlbmQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHN0YXJ0TG9vcDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgZW5kTG9vcDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc2FtcGxlUmF0ZTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgb3JpZ2luYWxQaXRjaDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgcGl0Y2hDb3JyZWN0aW9uO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBzYW1wbGVMaW5rO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBzYW1wbGVUeXBlO1xyXG5cclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ3NoZHInKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICB3aGlsZSAoaXAgPCBzaXplKSB7XHJcbiAgICBzYW1wbGVOYW1lID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBkYXRhLnN1YmFycmF5KGlwLCBpcCArPSAyMCkpO1xyXG4gICAgc3RhcnQgPSAoXHJcbiAgICAgIChkYXRhW2lwKytdIDw8IDApIHwgKGRhdGFbaXArK10gPDwgOCkgfCAoZGF0YVtpcCsrXSA8PCAxNikgfCAoZGF0YVtpcCsrXSA8PCAyNClcclxuICAgICkgPj4+IDA7XHJcbiAgICBlbmQgPSAoXHJcbiAgICAgIChkYXRhW2lwKytdIDw8IDApIHwgKGRhdGFbaXArK10gPDwgOCkgfCAoZGF0YVtpcCsrXSA8PCAxNikgfCAoZGF0YVtpcCsrXSA8PCAyNClcclxuICAgICkgPj4+IDA7XHJcbiAgICBzdGFydExvb3AgPSAoXHJcbiAgICAgIChkYXRhW2lwKytdIDw8IDApIHwgKGRhdGFbaXArK10gPDwgOCkgfCAoZGF0YVtpcCsrXSA8PCAxNikgfCAoZGF0YVtpcCsrXSA8PCAyNClcclxuICAgICkgPj4+IDA7XHJcbiAgICBlbmRMb29wID0gIChcclxuICAgICAgKGRhdGFbaXArK10gPDwgMCkgfCAoZGF0YVtpcCsrXSA8PCA4KSB8IChkYXRhW2lwKytdIDw8IDE2KSB8IChkYXRhW2lwKytdIDw8IDI0KVxyXG4gICAgKSA+Pj4gMDtcclxuICAgIHNhbXBsZVJhdGUgPSAoXHJcbiAgICAgIChkYXRhW2lwKytdIDw8IDApIHwgKGRhdGFbaXArK10gPDwgOCkgfCAoZGF0YVtpcCsrXSA8PCAxNikgfCAoZGF0YVtpcCsrXSA8PCAyNClcclxuICAgICkgPj4+IDA7XHJcbiAgICBvcmlnaW5hbFBpdGNoID0gZGF0YVtpcCsrXTtcclxuICAgIHBpdGNoQ29ycmVjdGlvbiA9IChkYXRhW2lwKytdIDw8IDI0KSA+PiAyNDtcclxuICAgIHNhbXBsZUxpbmsgPSBkYXRhW2lwKytdIHwgKGRhdGFbaXArK10gPDwgOCk7XHJcbiAgICBzYW1wbGVUeXBlID0gZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpO1xyXG5cclxuICAgIC8vKlxyXG4gICAgdmFyIHNhbXBsZSA9IG5ldyBJbnQxNkFycmF5KG5ldyBVaW50OEFycmF5KGRhdGEuc3ViYXJyYXkoXHJcbiAgICAgIHRoaXMuc2FtcGxpbmdEYXRhLm9mZnNldCArIHN0YXJ0ICogMixcclxuICAgICAgdGhpcy5zYW1wbGluZ0RhdGEub2Zmc2V0ICsgZW5kICAgKiAyXHJcbiAgICApKS5idWZmZXIpO1xyXG5cclxuICAgIHN0YXJ0TG9vcCAtPSBzdGFydDtcclxuICAgIGVuZExvb3AgLT0gc3RhcnQ7XHJcblxyXG4gICAgaWYgKHNhbXBsZVJhdGUgPiAwKSB7XHJcbiAgICAgIHZhciBhZGp1c3QgPSB0aGlzLmFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBzYW1wbGVSYXRlKTtcclxuICAgICAgc2FtcGxlID0gYWRqdXN0LnNhbXBsZTtcclxuICAgICAgc2FtcGxlUmF0ZSAqPSBhZGp1c3QubXVsdGlwbHk7XHJcbiAgICAgIHN0YXJ0TG9vcCAqPSBhZGp1c3QubXVsdGlwbHk7XHJcbiAgICAgIGVuZExvb3AgKj0gYWRqdXN0Lm11bHRpcGx5O1xyXG4gICAgfVxyXG5cclxuICAgIHNhbXBsZXMucHVzaChzYW1wbGUpO1xyXG4gICAgLy8qL1xyXG5cclxuICAgIHNhbXBsZUhlYWRlci5wdXNoKHtcclxuICAgICAgc2FtcGxlTmFtZTogc2FtcGxlTmFtZSxcclxuICAgICAgLypcclxuICAgICAgc3RhcnQ6IHN0YXJ0LFxyXG4gICAgICBlbmQ6IGVuZCxcclxuICAgICAgKi9cclxuICAgICAgc3RhcnRMb29wOiBzdGFydExvb3AsXHJcbiAgICAgIGVuZExvb3A6IGVuZExvb3AsXHJcbiAgICAgIHNhbXBsZVJhdGU6IHNhbXBsZVJhdGUsXHJcbiAgICAgIG9yaWdpbmFsUGl0Y2g6IG9yaWdpbmFsUGl0Y2gsXHJcbiAgICAgIHBpdGNoQ29ycmVjdGlvbjogcGl0Y2hDb3JyZWN0aW9uLFxyXG4gICAgICBzYW1wbGVMaW5rOiBzYW1wbGVMaW5rLFxyXG4gICAgICBzYW1wbGVUeXBlOiBzYW1wbGVUeXBlXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5QYXJzZXIucHJvdG90eXBlLmFkanVzdFNhbXBsZURhdGEgPSBmdW5jdGlvbihzYW1wbGUsIHNhbXBsZVJhdGUpIHtcclxuICAvKiogQHR5cGUge0ludDE2QXJyYXl9ICovXHJcbiAgdmFyIG5ld1NhbXBsZTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaWw7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGo7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIG11bHRpcGx5ID0gMTtcclxuXHJcbiAgLy8gYnVmZmVyXHJcbiAgd2hpbGUgKHNhbXBsZVJhdGUgPCAyMjA1MCkge1xyXG4gICAgbmV3U2FtcGxlID0gbmV3IEludDE2QXJyYXkoc2FtcGxlLmxlbmd0aCAqIDIpO1xyXG4gICAgZm9yIChpID0gaiA9IDAsIGlsID0gc2FtcGxlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV07XHJcbiAgICAgIG5ld1NhbXBsZVtqKytdID0gc2FtcGxlW2ldO1xyXG4gICAgfVxyXG4gICAgc2FtcGxlID0gbmV3U2FtcGxlO1xyXG4gICAgbXVsdGlwbHkgKj0gMjtcclxuICAgIHNhbXBsZVJhdGUgKj0gMjtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzYW1wbGU6IHNhbXBsZSxcclxuICAgIG11bHRpcGx5OiBtdWx0aXBseVxyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VNb2R1bGF0b3IgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHNpemUgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBjb2RlO1xyXG4gIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xyXG4gIHZhciBrZXk7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgb3V0cHV0ID0gW107XHJcblxyXG4gIHdoaWxlIChpcCA8IHNpemUpIHtcclxuICAgIC8vIFNyYyAgT3BlclxyXG4gICAgLy8gVE9ET1xyXG4gICAgaXAgKz0gMjtcclxuXHJcbiAgICAvLyBEZXN0IE9wZXJcclxuICAgIGNvZGUgPSBkYXRhW2lwKytdIHwgKGRhdGFbaXArK10gPDwgOCk7XHJcbiAgICBrZXkgPSBQYXJzZXIuR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW2NvZGVdO1xyXG4gICAgaWYgKGtleSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIC8vIEFtb3VudFxyXG4gICAgICBvdXRwdXQucHVzaCh7XHJcbiAgICAgICAgdHlwZToga2V5LFxyXG4gICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICBjb2RlOiBjb2RlLFxyXG4gICAgICAgICAgYW1vdW50OiBkYXRhW2lwXSB8IChkYXRhW2lwKzFdIDw8IDgpIDw8IDE2ID4+IDE2LFxyXG4gICAgICAgICAgbG86IGRhdGFbaXArK10sXHJcbiAgICAgICAgICBoaTogZGF0YVtpcCsrXVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBBbW91bnRcclxuICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsUmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ2tleW51bSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgICAgb3V0cHV0LnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBrZXksXHJcbiAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgbG86IGRhdGFbaXArK10sXHJcbiAgICAgICAgICAgICAgaGk6IGRhdGFbaXArK11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgb3V0cHV0LnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBrZXksXHJcbiAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgYW1vdW50OiBkYXRhW2lwKytdIHwgKGRhdGFbaXArK10gPDwgOCkgPDwgMTYgPj4gMTZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFtdFNyY09wZXJcclxuICAgIC8vIFRPRE9cclxuICAgIGlwICs9IDI7XHJcblxyXG4gICAgLy8gVHJhbnMgT3BlclxyXG4gICAgLy8gVE9ET1xyXG4gICAgaXAgKz0gMjtcclxuICB9XHJcblxyXG4gIHJldHVybiBvdXRwdXQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VHZW5lcmF0b3IgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHNpemUgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBjb2RlO1xyXG4gIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xyXG4gIHZhciBrZXk7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgb3V0cHV0ID0gW107XHJcblxyXG4gIHdoaWxlIChpcCA8IHNpemUpIHtcclxuICAgIGNvZGUgPSBkYXRhW2lwKytdIHwgKGRhdGFbaXArK10gPDwgOCk7XHJcbiAgICBrZXkgPSBQYXJzZXIuR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW2NvZGVdO1xyXG4gICAgaWYgKGtleSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIG91dHB1dC5wdXNoKHtcclxuICAgICAgICB0eXBlOiBrZXksXHJcbiAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgIGNvZGU6IGNvZGUsXHJcbiAgICAgICAgICBhbW91bnQ6IGRhdGFbaXBdIHwgKGRhdGFbaXArMV0gPDwgOCkgPDwgMTYgPj4gMTYsXHJcbiAgICAgICAgICBsbzogZGF0YVtpcCsrXSxcclxuICAgICAgICAgIGhpOiBkYXRhW2lwKytdXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAna2V5UmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICd2ZWxSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICBvdXRwdXQucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiBrZXksXHJcbiAgICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgICBsbzogZGF0YVtpcCsrXSxcclxuICAgICAgICAgICAgaGk6IGRhdGFbaXArK11cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBvdXRwdXQucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiBrZXksXHJcbiAgICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgICBhbW91bnQ6IGRhdGFbaXArK10gfCAoZGF0YVtpcCsrXSA8PCA4KSA8PCAxNiA+PiAxNlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dHB1dDtcclxufTtcclxuXHJcblBhcnNlci5wcm90b3R5cGUuY3JlYXRlSW5zdHJ1bWVudCA9IGZ1bmN0aW9uKCkge1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdmFyIGluc3RydW1lbnQgPSB0aGlzLmluc3RydW1lbnQ7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgem9uZSA9IHRoaXMuaW5zdHJ1bWVudFpvbmU7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgb3V0cHV0ID0gW107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGJhZ0luZGV4O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBiYWdJbmRleEVuZDtcclxuICAvKiogQHR5cGUge0FycmF5LjxPYmplY3Q+fSAqL1xyXG4gIHZhciB6b25lSW5mbztcclxuICAvKiogQHR5cGUge3tnZW5lcmF0b3I6IE9iamVjdCwgZ2VuZXJhdG9ySW5mbzogQXJyYXkuPE9iamVjdD59fSAqL1xyXG4gIHZhciBpbnN0cnVtZW50R2VuZXJhdG9yO1xyXG4gIC8qKiBAdHlwZSB7e21vZHVsYXRvcjogT2JqZWN0LCBtb2R1bGF0b3JJbmZvOiBBcnJheS48T2JqZWN0Pn19ICovXHJcbiAgdmFyIGluc3RydW1lbnRNb2R1bGF0b3I7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGk7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGlsO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBqO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBqbDtcclxuXHJcbiAgLy8gaW5zdHJ1bWVudCAtPiBpbnN0cnVtZW50IGJhZyAtPiBnZW5lcmF0b3IgLyBtb2R1bGF0b3JcclxuICBmb3IgKGkgPSAwLCBpbCA9IGluc3RydW1lbnQubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgYmFnSW5kZXggICAgPSBpbnN0cnVtZW50W2ldLmluc3RydW1lbnRCYWdJbmRleDtcclxuICAgIGJhZ0luZGV4RW5kID0gaW5zdHJ1bWVudFtpKzFdID8gaW5zdHJ1bWVudFtpKzFdLmluc3RydW1lbnRCYWdJbmRleCA6IHpvbmUubGVuZ3RoO1xyXG4gICAgem9uZUluZm8gPSBbXTtcclxuXHJcbiAgICAvLyBpbnN0cnVtZW50IGJhZ1xyXG4gICAgZm9yIChqID0gYmFnSW5kZXgsIGpsID0gYmFnSW5kZXhFbmQ7IGogPCBqbDsgKytqKSB7XHJcbiAgICAgIGluc3RydW1lbnRHZW5lcmF0b3IgPSB0aGlzLmNyZWF0ZUluc3RydW1lbnRHZW5lcmF0b3JfKHpvbmUsIGopO1xyXG4gICAgICBpbnN0cnVtZW50TW9kdWxhdG9yID0gdGhpcy5jcmVhdGVJbnN0cnVtZW50TW9kdWxhdG9yXyh6b25lLCBqKTtcclxuXHJcbiAgICAgIHpvbmVJbmZvLnB1c2goe1xyXG4gICAgICAgIGdlbmVyYXRvcjogaW5zdHJ1bWVudEdlbmVyYXRvci5nZW5lcmF0b3IsXHJcbiAgICAgICAgZ2VuZXJhdG9yU2VxdWVuY2U6IGluc3RydW1lbnRHZW5lcmF0b3IuZ2VuZXJhdG9ySW5mbyxcclxuICAgICAgICBtb2R1bGF0b3I6IGluc3RydW1lbnRNb2R1bGF0b3IubW9kdWxhdG9yLFxyXG4gICAgICAgIG1vZHVsYXRvclNlcXVlbmNlOiBpbnN0cnVtZW50TW9kdWxhdG9yLm1vZHVsYXRvckluZm9cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0LnB1c2goe1xyXG4gICAgICBuYW1lOiBpbnN0cnVtZW50W2ldLmluc3RydW1lbnROYW1lLFxyXG4gICAgICBpbmZvOiB6b25lSW5mb1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0cHV0O1xyXG59O1xyXG5cclxuUGFyc2VyLnByb3RvdHlwZS5jcmVhdGVQcmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAvKiogQHR5cGUge0FycmF5LjxPYmplY3Q+fSAqL1xyXG4gIHZhciBwcmVzZXQgICA9IHRoaXMucHJlc2V0SGVhZGVyO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdmFyIHpvbmUgPSB0aGlzLnByZXNldFpvbmU7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgb3V0cHV0ID0gW107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGJhZ0luZGV4O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBiYWdJbmRleEVuZDtcclxuICAvKiogQHR5cGUge0FycmF5LjxPYmplY3Q+fSAqL1xyXG4gIHZhciB6b25lSW5mbztcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaW5zdHJ1bWVudDtcclxuICAvKiogQHR5cGUge3tnZW5lcmF0b3I6IE9iamVjdCwgZ2VuZXJhdG9ySW5mbzogQXJyYXkuPE9iamVjdD59fSAqL1xyXG4gIHZhciBwcmVzZXRHZW5lcmF0b3I7XHJcbiAgLyoqIEB0eXBlIHt7bW9kdWxhdG9yOiBPYmplY3QsIG1vZHVsYXRvckluZm86IEFycmF5LjxPYmplY3Q+fX0gKi9cclxuICB2YXIgcHJlc2V0TW9kdWxhdG9yO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpbDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgajtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgamw7XHJcblxyXG4gIC8vIHByZXNldCAtPiBwcmVzZXQgYmFnIC0+IGdlbmVyYXRvciAvIG1vZHVsYXRvclxyXG4gIGZvciAoaSA9IDAsIGlsID0gcHJlc2V0Lmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgIGJhZ0luZGV4ICAgID0gcHJlc2V0W2ldLnByZXNldEJhZ0luZGV4O1xyXG4gICAgYmFnSW5kZXhFbmQgPSBwcmVzZXRbaSsxXSA/IHByZXNldFtpKzFdLnByZXNldEJhZ0luZGV4IDogem9uZS5sZW5ndGg7XHJcbiAgICB6b25lSW5mbyA9IFtdO1xyXG5cclxuICAgIC8vIHByZXNldCBiYWdcclxuICAgIGZvciAoaiA9IGJhZ0luZGV4LCBqbCA9IGJhZ0luZGV4RW5kOyBqIDwgamw7ICsraikge1xyXG4gICAgICBwcmVzZXRHZW5lcmF0b3IgPSB0aGlzLmNyZWF0ZVByZXNldEdlbmVyYXRvcl8oem9uZSwgaik7XHJcbiAgICAgIHByZXNldE1vZHVsYXRvciA9IHRoaXMuY3JlYXRlUHJlc2V0TW9kdWxhdG9yXyh6b25lLCBqKTtcclxuXHJcbiAgICAgIHpvbmVJbmZvLnB1c2goe1xyXG4gICAgICAgIGdlbmVyYXRvcjogcHJlc2V0R2VuZXJhdG9yLmdlbmVyYXRvcixcclxuICAgICAgICBnZW5lcmF0b3JTZXF1ZW5jZTogcHJlc2V0R2VuZXJhdG9yLmdlbmVyYXRvckluZm8sXHJcbiAgICAgICAgbW9kdWxhdG9yOiBwcmVzZXRNb2R1bGF0b3IubW9kdWxhdG9yLFxyXG4gICAgICAgIG1vZHVsYXRvclNlcXVlbmNlOiBwcmVzZXRNb2R1bGF0b3IubW9kdWxhdG9ySW5mb1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGluc3RydW1lbnQgPVxyXG4gICAgICAgIHByZXNldEdlbmVyYXRvci5nZW5lcmF0b3JbJ2luc3RydW1lbnQnXSAhPT0gdm9pZCAwID9cclxuICAgICAgICAgIHByZXNldEdlbmVyYXRvci5nZW5lcmF0b3JbJ2luc3RydW1lbnQnXS5hbW91bnQgOlxyXG4gICAgICAgIHByZXNldE1vZHVsYXRvci5tb2R1bGF0b3JbJ2luc3RydW1lbnQnXSAhPT0gdm9pZCAwID9cclxuICAgICAgICAgIHByZXNldE1vZHVsYXRvci5tb2R1bGF0b3JbJ2luc3RydW1lbnQnXS5hbW91bnQgOlxyXG4gICAgICAgIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0LnB1c2goe1xyXG4gICAgICBuYW1lOiBwcmVzZXRbaV0ucHJlc2V0TmFtZSxcclxuICAgICAgaW5mbzogem9uZUluZm8sXHJcbiAgICAgIGhlYWRlcjogcHJlc2V0W2ldLFxyXG4gICAgICBpbnN0cnVtZW50OiBpbnN0cnVtZW50XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvdXRwdXQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gem9uZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICogQHJldHVybnMge3tnZW5lcmF0b3I6IE9iamVjdCwgZ2VuZXJhdG9ySW5mbzogQXJyYXkuPE9iamVjdD59fVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5jcmVhdGVJbnN0cnVtZW50R2VuZXJhdG9yXyA9IGZ1bmN0aW9uKHpvbmUsIGluZGV4KSB7XHJcbiAgdmFyIG1vZGdlbiA9IHRoaXMuY3JlYXRlQmFnTW9kR2VuXyhcclxuICAgIHpvbmUsXHJcbiAgICB6b25lW2luZGV4XS5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXgsXHJcbiAgICB6b25lW2luZGV4KzFdID8gem9uZVtpbmRleCsxXS5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXg6IHRoaXMuaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3IubGVuZ3RoLFxyXG4gICAgdGhpcy5pbnN0cnVtZW50Wm9uZUdlbmVyYXRvclxyXG4gICk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZW5lcmF0b3I6IG1vZGdlbi5tb2RnZW4sXHJcbiAgICBnZW5lcmF0b3JJbmZvOiBtb2RnZW4ubW9kZ2VuSW5mb1xyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gem9uZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICogQHJldHVybnMge3ttb2R1bGF0b3I6IE9iamVjdCwgbW9kdWxhdG9ySW5mbzogQXJyYXkuPE9iamVjdD59fVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5jcmVhdGVJbnN0cnVtZW50TW9kdWxhdG9yXyA9IGZ1bmN0aW9uKHpvbmUsIGluZGV4KSB7XHJcbiAgdmFyIG1vZGdlbiA9IHRoaXMuY3JlYXRlQmFnTW9kR2VuXyhcclxuICAgIHpvbmUsXHJcbiAgICB6b25lW2luZGV4XS5wcmVzZXRNb2R1bGF0b3JJbmRleCxcclxuICAgIHpvbmVbaW5kZXgrMV0gPyB6b25lW2luZGV4KzFdLmluc3RydW1lbnRNb2R1bGF0b3JJbmRleDogdGhpcy5pbnN0cnVtZW50Wm9uZU1vZHVsYXRvci5sZW5ndGgsXHJcbiAgICB0aGlzLmluc3RydW1lbnRab25lTW9kdWxhdG9yXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1vZHVsYXRvcjogbW9kZ2VuLm1vZGdlbixcclxuICAgIG1vZHVsYXRvckluZm86IG1vZGdlbi5tb2RnZW5JbmZvXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSB6b25lXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxyXG4gKiBAcmV0dXJucyB7e2dlbmVyYXRvcjogT2JqZWN0LCBnZW5lcmF0b3JJbmZvOiBBcnJheS48T2JqZWN0Pn19XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5QYXJzZXIucHJvdG90eXBlLmNyZWF0ZVByZXNldEdlbmVyYXRvcl8gPSBmdW5jdGlvbih6b25lLCBpbmRleCkge1xyXG4gIHZhciBtb2RnZW4gPSB0aGlzLmNyZWF0ZUJhZ01vZEdlbl8oXHJcbiAgICB6b25lLFxyXG4gICAgem9uZVtpbmRleF0ucHJlc2V0R2VuZXJhdG9ySW5kZXgsXHJcbiAgICB6b25lW2luZGV4KzFdID8gem9uZVtpbmRleCsxXS5wcmVzZXRHZW5lcmF0b3JJbmRleCA6IHRoaXMucHJlc2V0Wm9uZUdlbmVyYXRvci5sZW5ndGgsXHJcbiAgICB0aGlzLnByZXNldFpvbmVHZW5lcmF0b3JcclxuICApO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZ2VuZXJhdG9yOiBtb2RnZW4ubW9kZ2VuLFxyXG4gICAgZ2VuZXJhdG9ySW5mbzogbW9kZ2VuLm1vZGdlbkluZm9cclxuICB9O1xyXG59O1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSB6b25lXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAgICogQHJldHVybnMge3ttb2R1bGF0b3I6IE9iamVjdCwgbW9kdWxhdG9ySW5mbzogQXJyYXkuPE9iamVjdD59fVxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcblBhcnNlci5wcm90b3R5cGUuY3JlYXRlUHJlc2V0TW9kdWxhdG9yXyA9IGZ1bmN0aW9uKHpvbmUsIGluZGV4KSB7XHJcbiAgLyoqIEB0eXBlIHt7bW9kZ2VuOiBPYmplY3QsIG1vZGdlbkluZm86IEFycmF5LjxPYmplY3Q+fX0gKi9cclxuICB2YXIgbW9kZ2VuID0gdGhpcy5jcmVhdGVCYWdNb2RHZW5fKFxyXG4gICAgem9uZSxcclxuICAgIHpvbmVbaW5kZXhdLnByZXNldE1vZHVsYXRvckluZGV4LFxyXG4gICAgem9uZVtpbmRleCsxXSA/IHpvbmVbaW5kZXgrMV0ucHJlc2V0TW9kdWxhdG9ySW5kZXggOiB0aGlzLnByZXNldFpvbmVNb2R1bGF0b3IubGVuZ3RoLFxyXG4gICAgdGhpcy5wcmVzZXRab25lTW9kdWxhdG9yXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1vZHVsYXRvcjogbW9kZ2VuLm1vZGdlbixcclxuICAgIG1vZHVsYXRvckluZm86IG1vZGdlbi5tb2RnZW5JbmZvXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSB6b25lXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFN0YXJ0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleEVuZFxyXG4gKiBAcGFyYW0gem9uZU1vZEdlblxyXG4gKiBAcmV0dXJucyB7e21vZGdlbjogT2JqZWN0LCBtb2RnZW5JbmZvOiBBcnJheS48T2JqZWN0Pn19XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5QYXJzZXIucHJvdG90eXBlLmNyZWF0ZUJhZ01vZEdlbl8gPSBmdW5jdGlvbih6b25lLCBpbmRleFN0YXJ0LCBpbmRleEVuZCwgem9uZU1vZEdlbikge1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdmFyIG1vZGdlbkluZm8gPSBbXTtcclxuICAvKiogQHR5cGUge09iamVjdH0gKi9cclxuICB2YXIgbW9kZ2VuID0ge1xyXG4gICAgdW5rbm93bjogW10sXHJcbiAgICAna2V5UmFuZ2UnOiB7XHJcbiAgICAgIGhpOiAxMjcsXHJcbiAgICAgIGxvOiAwXHJcbiAgICB9XHJcbiAgfTsgLy8gVE9ET1xyXG4gIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG4gIHZhciBpbmZvO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpbDtcclxuXHJcbiAgZm9yIChpID0gaW5kZXhTdGFydCwgaWwgPSBpbmRleEVuZDsgaSA8IGlsOyArK2kpIHtcclxuICAgIGluZm8gPSB6b25lTW9kR2VuW2ldO1xyXG4gICAgbW9kZ2VuSW5mby5wdXNoKGluZm8pO1xyXG5cclxuICAgIGlmIChpbmZvLnR5cGUgPT09ICd1bmtub3duJykge1xyXG4gICAgICBtb2RnZW4udW5rbm93bi5wdXNoKGluZm8udmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbW9kZ2VuW2luZm8udHlwZV0gPSBpbmZvLnZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1vZGdlbjogbW9kZ2VuLFxyXG4gICAgbW9kZ2VuSW5mbzogbW9kZ2VuSW5mb1xyXG4gIH07XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cclxuICogQGNvbnN0XHJcbiAqL1xyXG5QYXJzZXIuR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlID0gW1xyXG4gICdzdGFydEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kQWRkcnNPZmZzZXQnLFxyXG4gICdzdGFydGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ2VuZGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1BpdGNoJyxcclxuICAndmliTGZvVG9QaXRjaCcsXHJcbiAgJ21vZEVudlRvUGl0Y2gnLFxyXG4gICdpbml0aWFsRmlsdGVyRmMnLFxyXG4gICdpbml0aWFsRmlsdGVyUScsXHJcbiAgJ21vZExmb1RvRmlsdGVyRmMnLFxyXG4gICdtb2RFbnZUb0ZpbHRlckZjJyxcclxuICAnZW5kQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1ZvbHVtZScsXHJcbiAgLCAvLyAxNFxyXG4gICdjaG9ydXNFZmZlY3RzU2VuZCcsXHJcbiAgJ3JldmVyYkVmZmVjdHNTZW5kJyxcclxuICAncGFuJyxcclxuICAsLCwgLy8gMTgsMTksMjBcclxuICAnZGVsYXlNb2RMRk8nLFxyXG4gICdmcmVxTW9kTEZPJyxcclxuICAnZGVsYXlWaWJMRk8nLFxyXG4gICdmcmVxVmliTEZPJyxcclxuICAnZGVsYXlNb2RFbnYnLFxyXG4gICdhdHRhY2tNb2RFbnYnLFxyXG4gICdob2xkTW9kRW52JyxcclxuICAnZGVjYXlNb2RFbnYnLFxyXG4gICdzdXN0YWluTW9kRW52JyxcclxuICAncmVsZWFzZU1vZEVudicsXHJcbiAgJ2tleW51bVRvTW9kRW52SG9sZCcsXHJcbiAgJ2tleW51bVRvTW9kRW52RGVjYXknLFxyXG4gICdkZWxheVZvbEVudicsXHJcbiAgJ2F0dGFja1ZvbEVudicsXHJcbiAgJ2hvbGRWb2xFbnYnLFxyXG4gICdkZWNheVZvbEVudicsXHJcbiAgJ3N1c3RhaW5Wb2xFbnYnLFxyXG4gICdyZWxlYXNlVm9sRW52JyxcclxuICAna2V5bnVtVG9Wb2xFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Wb2xFbnZEZWNheScsXHJcbiAgJ2luc3RydW1lbnQnLFxyXG4gICwgLy8gNDJcclxuICAna2V5UmFuZ2UnLFxyXG4gICd2ZWxSYW5nZScsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAna2V5bnVtJyxcclxuICAndmVsb2NpdHknLFxyXG4gICdpbml0aWFsQXR0ZW51YXRpb24nLFxyXG4gICwgLy8gNDlcclxuICAnZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnY29hcnNlVHVuZScsXHJcbiAgJ2ZpbmVUdW5lJyxcclxuICAnc2FtcGxlSUQnLFxyXG4gICdzYW1wbGVNb2RlcycsXHJcbiAgLCAvLyA1NVxyXG4gICdzY2FsZVR1bmluZycsXHJcbiAgJ2V4Y2x1c2l2ZUNsYXNzJyxcclxuICAnb3ZlcnJpZGluZ1Jvb3RLZXknXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQYXJzZXJcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2YyLmpzXG4gKiovIiwiY29uc3QgUmlmZiA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7Qnl0ZUFycmF5fSBpbnB1dCBpbnB1dCBidWZmZXIuXHJcbiAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3BhcmFtcyBvcHRpb24gcGFyYW1ldGVycy5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5SaWZmLlBhcnNlciA9IGZ1bmN0aW9uKGlucHV0LCBvcHRfcGFyYW1zKSB7XHJcbiAgb3B0X3BhcmFtcyA9IG9wdF9wYXJhbXMgfHwge307XHJcbiAgLyoqIEB0eXBlIHtCeXRlQXJyYXl9ICovXHJcbiAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMuaXAgPSBvcHRfcGFyYW1zWydpbmRleCddIHx8IDA7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdGhpcy5sZW5ndGggPSBvcHRfcGFyYW1zWydsZW5ndGgnXSB8fCBpbnB1dC5sZW5ndGggLSB0aGlzLmlwO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPFJpZmYuQ2h1bms+fSAqL1xyXG4gIHRoaXMuY2h1bmtMaXN0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMub2Zmc2V0ID0gdGhpcy5pcDtcclxuICAvKiogQHR5cGUge2Jvb2xlYW59ICovXHJcbiAgdGhpcy5wYWRkaW5nID1cclxuICAgIG9wdF9wYXJhbXNbJ3BhZGRpbmcnXSAhPT0gdm9pZCAwID8gb3B0X3BhcmFtc1sncGFkZGluZyddIDogdHJ1ZTtcclxuICAvKiogQHR5cGUge2Jvb2xlYW59ICovXHJcbiAgdGhpcy5iaWdFbmRpYW4gPVxyXG4gICAgb3B0X3BhcmFtc1snYmlnRW5kaWFuJ10gIT09IHZvaWQgMCA/IG9wdF9wYXJhbXNbJ2JpZ0VuZGlhbiddIDogZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICogQHBhcmFtIHtudW1iZXJ9IHNpemVcclxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldFxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcblJpZmYuQ2h1bmsgPSBmdW5jdGlvbih0eXBlLCBzaXplLCBvZmZzZXQpIHtcclxuICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcbn07XHJcblxyXG5SaWZmLlBhcnNlci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbigpIHtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggKyB0aGlzLm9mZnNldDtcclxuXHJcbiAgdGhpcy5jaHVua0xpc3QgPSBbXTtcclxuXHJcbiAgd2hpbGUgKHRoaXMuaXAgPCBsZW5ndGgpIHtcclxuICAgIHRoaXMucGFyc2VDaHVuaygpO1xyXG4gIH1cclxufTtcclxuXHJcblJpZmYuUGFyc2VyLnByb3RvdHlwZS5wYXJzZUNodW5rID0gZnVuY3Rpb24oKSB7XHJcbiAgLyoqIEB0eXBlIHtCeXRlQXJyYXl9ICovXHJcbiAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSB0aGlzLmlwO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBzaXplO1xyXG5cclxuICB0aGlzLmNodW5rTGlzdC5wdXNoKG5ldyBSaWZmLkNodW5rKFxyXG4gICAgU3RyaW5nLmZyb21DaGFyQ29kZShpbnB1dFtpcCsrXSwgaW5wdXRbaXArK10sIGlucHV0W2lwKytdLCBpbnB1dFtpcCsrXSksXHJcbiAgICAoc2l6ZSA9IHRoaXMuYmlnRW5kaWFuID9cclxuICAgICAgICgoaW5wdXRbaXArK10gPDwgMjQpIHwgKGlucHV0W2lwKytdIDw8IDE2KSB8XHJcbiAgICAgICAgKGlucHV0W2lwKytdIDw8ICA4KSB8IChpbnB1dFtpcCsrXSAgICAgICkpID4+PiAwIDpcclxuICAgICAgICgoaW5wdXRbaXArK10gICAgICApIHwgKGlucHV0W2lwKytdIDw8ICA4KSB8XHJcbiAgICAgICAgKGlucHV0W2lwKytdIDw8IDE2KSB8IChpbnB1dFtpcCsrXSA8PCAyNCkpID4+PiAwXHJcbiAgICApLFxyXG4gICAgaXBcclxuICApKTtcclxuXHJcbiAgaXAgKz0gc2l6ZTtcclxuXHJcbiAgLy8gcGFkZGluZ1xyXG4gIGlmICh0aGlzLnBhZGRpbmcgJiYgKChpcCAtIHRoaXMub2Zmc2V0KSAmIDEpID09PSAxKSB7XHJcbiAgICBpcCsrO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5pcCA9IGlwO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBjaHVuayBpbmRleC5cclxuICogQHJldHVybiB7P1JpZmYuQ2h1bmt9XHJcbiAqL1xyXG5SaWZmLlBhcnNlci5wcm90b3R5cGUuZ2V0Q2h1bmsgPSBmdW5jdGlvbihpbmRleCkge1xyXG4gIC8qKiBAdHlwZSB7UmlmZi5DaHVua30gKi9cclxuICB2YXIgY2h1bmsgPSB0aGlzLmNodW5rTGlzdFtpbmRleF07XHJcblxyXG4gIGlmIChjaHVuayA9PT0gdm9pZCAwKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHJldHVybiBjaHVuaztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAqL1xyXG5SaWZmLlBhcnNlci5wcm90b3R5cGUuZ2V0TnVtYmVyT2ZDaHVua3MgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5jaHVua0xpc3QubGVuZ3RoO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSaWZmXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JpZmYuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9