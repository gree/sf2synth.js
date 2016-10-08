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
	
	var _wml = __webpack_require__(3);
	
	Object.keys(_wml).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _wml[key];
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _sound_font_synth = __webpack_require__(4);
	
	var _sound_font_synth2 = _interopRequireDefault(_sound_font_synth);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @constructor
	 */
	var WebMidiLink = function WebMidiLink() {
	  /** @type {Array.<number>} */
	  this.RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	  /** @type {Array.<number>} */
	  this.RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	  /** @type {boolean} */
	  this.ready;
	  /** @type {Synthesizer} */
	  this.synth;
	  /** @type {function(ArrayBuffer)} */
	  this.loadCallback;
	  /** @type {Function} */
	  this.messageHandler = this.onmessage.bind(this);
	
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
	  } else {
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
	    synth = this.synth = new _sound_font_synth2.default(input);
	    document.body.appendChild(synth.drawSynth());
	    synth.init();
	    synth.start();
	    window.addEventListener('message', this.messageHandler, false);
	  } else {
	    synth = this.synth;
	    synth.refreshInstruments(input);
	  }
	
	  // link ready
	  if (window.opener) {
	    window.opener.postMessage("link,ready", '*');
	  } else if (window.parent !== window) {
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
	      this.processMidiMessage(msg.map(function (hex) {
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
	          } else if (window.parent !== window) {
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
	
	/**
	 * @param {Array.<number>} message
	 */
	WebMidiLink.prototype.processMidiMessage = function (message) {
	  /** @type {number} */
	  var channel = message[0] & 0x0f;
	  /** @type {Synthesizer} */
	  var synth = this.synth;
	
	  switch (message[0] & 0xf0) {
	    case 0x80:
	      // NoteOff: 8n kk vv
	      synth.noteOff(channel, message[1], message[2]);
	      break;
	    case 0x90:
	      // NoteOn: 9n kk vv
	      if (message[2] > 0) {
	        synth.noteOn(channel, message[1], message[2]);
	      } else {
	        synth.noteOff(channel, message[1], 0);
	      }
	      break;
	    case 0xB0:
	      // Control Change: Bn cc dd
	      switch (message[1]) {
	        case 0x06:
	          // Data Entry: Bn 06 dd
	          switch (this.RpnMsb[channel]) {
	            case 0:
	              switch (this.RpnLsb[channel]) {
	                case 0:
	                  // Pitch Bend Sensitivity
	                  synth.pitchBendSensitivity(channel, message[2]);
	                  break;
	              }
	              break;
	          }
	          break;
	        case 0x07:
	          // Volume Change: Bn 07 dd
	          synth.volumeChange(channel, message[2]);
	          break;
	        case 0x0A:
	          // Panpot Change: Bn 0A dd
	          synth.panpotChange(channel, message[2]);
	          break;
	        case 0x78:
	          // All Sound Off: Bn 78 00
	          synth.allSoundOff(channel);
	          break;
	        case 0x79:
	          // Reset All Control: Bn 79 00
	          synth.resetAllControl(channel);
	          break;
	        case 0x20:
	          // BankSelect
	          //console.log("bankselect:", channel, message[2]);
	          break;
	        case 0x64:
	          // RPN MSB
	          this.RpnMsb[channel] = message[2];
	          break;
	        case 0x65:
	          // RPN LSB
	          this.RpnLsb[channel] = message[2];
	          break;
	        default:
	        // not supported
	      }
	      break;
	    case 0xC0:
	      // Program Change: Cn pp
	      synth.programChange(channel, message[1]);
	      break;
	    case 0xE0:
	      // Pitch Bend
	      synth.pitchBend(channel, message[1], message[2]);
	      break;
	    case 0xf0:
	      // System Exclusive Message
	      // ID number
	      switch (message[1]) {
	        case 0x7e:
	          // non-realtime
	          // TODO
	          break;
	        case 0x7f:
	          // realtime
	          var device = message[2];
	          // sub ID 1
	          switch (message[3]) {
	            case 0x04:
	              // device control
	              // sub ID 2
	              switch (message[4]) {
	                case 0x01:
	                  // master volume
	                  synth.setMasterVolume(message[5] + (message[6] << 7));
	                  break;
	              }
	              break;
	          }
	          break;
	      }
	      break;
	    default:
	      // not supported
	      break;
	  }
	};
	
	exports.default = WebMidiLink;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _sound_font_synth_note = __webpack_require__(5);
	
	var _sound_font_synth_note2 = _interopRequireDefault(_sound_font_synth_note);
	
	var _sf = __webpack_require__(1);
	
	var _sf2 = _interopRequireDefault(_sf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * @constructor
	 */
	var Synthesizer = function Synthesizer(input) {
	  /** @type {Uint8Array} */
	  this.input = input;
	  /** @type {Parser} */
	  this.parser;
	  /** @type {number} */
	  this.bank = 0;
	  /** @type {Array.<Array.<Object>>} */
	  this.bankSet;
	  /** @type {number} */
	  this.bufferSize = 1024;
	  /** @type {AudioContext} */
	  this.ctx = this.getAudioContext();
	  /** @type {AudioGainNode} */
	  this.gainMaster = this.ctx.createGainNode();
	  /** @type {DynamicsCompressorNode} */
	  this.compressor = this.ctx.createDynamicsCompressor();
	  /** @type {AudioBufferSourceNode} */
	  this.bufSrc = this.ctx.createBufferSource();
	  /** @type {Array.<number>} */
	  this.channelInstrument = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 10, 11, 12, 13, 14, 15];
	  /** @type {Array.<number>} */
	  this.channelVolume = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
	  /** @type {Array.<number>} */
	  this.channelPanpot = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	  /** @type {Array.<number>} */
	  this.channelPitchBend = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	  this.channelPitchBendSensitivity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	  /** @type {Array.<Array.<SynthesizerNote>>} */
	  this.currentNoteOn = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
	  /** @type {number} */
	  this.baseVolume = 1 / 0x8000;
	  /** @type {number} */
	  this.masterVolume = 16384;
	
	  /** @type {HTMLTableElement} */
	  this.table;
	};
	/**
	 * @returns {AudioContext}
	 */
	Synthesizer.prototype.getAudioContext = function () {
	  /** @type {AudioContext} */
	  var ctx;
	
	  if (AudioContext !== void 0) {
	    ctx = new AudioContext();
	  } else if (webkitAudioContext !== void 0) {
	    ctx = new webkitAudioContext();
	  } else if (mozAudioContext !== void 0) {
	    ctx = new mozAudioContext();
	  } else {
	    throw new Error('Web Audio not supported');
	  }
	
	  if (ctx.createGainNode === void 0) {
	    ctx.createGainNode = ctx.createGain;
	  }
	
	  return ctx;
	};
	
	/**
	 * @type {Array.<string>}
	 * @const
	 */
	Synthesizer.ProgramNames = ["Acoustic Piano", "Bright Piano", "Electric Grand Piano", "Honky-tonk Piano", "Electric Piano", "Electric Piano 2", "Harpsichord", "Clavi", "Celesta", "Glockenspiel", "Musical box", "Vibraphone", "Marimba", "Xylophone", "Tubular Bell", "Dulcimer", "Drawbar Organ", "Percussive Organ", "Rock Organ", "Church organ", "Reed organ", "Accordion", "Harmonica", "Tango Accordion", "Acoustic Guitar (nylon)", "Acoustic Guitar (steel)", "Electric Guitar (jazz)", "Electric Guitar (clean)", "Electric Guitar (muted)", "Overdriven Guitar", "Distortion Guitar", "Guitar harmonics", "Acoustic Bass", "Electric Bass (finger)", "Electric Bass (pick)", "Fretless Bass", "Slap Bass 1", "Slap Bass 2", "Synth Bass 1", "Synth Bass 2", "Violin", "Viola", "Cello", "Double bass", "Tremolo Strings", "Pizzicato Strings", "Orchestral Harp", "Timpani", "String Ensemble 1", "String Ensemble 2", "Synth Strings 1", "Synth Strings 2", "Voice Aahs", "Voice Oohs", "Synth Voice", "Orchestra Hit", "Trumpet", "Trombone", "Tuba", "Muted Trumpet", "French horn", "Brass Section", "Synth Brass 1", "Synth Brass 2", "Soprano Sax", "Alto Sax", "Tenor Sax", "Baritone Sax", "Oboe", "English Horn", "Bassoon", "Clarinet", "Piccolo", "Flute", "Recorder", "Pan Flute", "Blown Bottle", "Shakuhachi", "Whistle", "Ocarina", "Lead 1 (square)", "Lead 2 (sawtooth)", "Lead 3 (calliope)", "Lead 4 (chiff)", "Lead 5 (charang)", "Lead 6 (voice)", "Lead 7 (fifths)", "Lead 8 (bass + lead)", "Pad 1 (Fantasia)", "Pad 2 (warm)", "Pad 3 (polysynth)", "Pad 4 (choir)", "Pad 5 (bowed)", "Pad 6 (metallic)", "Pad 7 (halo)", "Pad 8 (sweep)", "FX 1 (rain)", "FX 2 (soundtrack)", "FX 3 (crystal)", "FX 4 (atmosphere)", "FX 5 (brightness)", "FX 6 (goblins)", "FX 7 (echoes)", "FX 8 (sci-fi)", "Sitar", "Banjo", "Shamisen", "Koto", "Kalimba", "Bagpipe", "Fiddle", "Shanai", "Tinkle Bell", "Agogo", "Steel Drums", "Woodblock", "Taiko Drum", "Melodic Tom", "Synth Drum", "Reverse Cymbal", "Guitar Fret Noise", "Breath Noise", "Seashore", "Bird Tweet", "Telephone Ring", "Helicopter", "Applause", "Gunshot"];
	
	Synthesizer.prototype.init = function () {
	  /** @type {number} */
	  var i;
	
	  this.parser = new _sf2.default(this.input);
	  this.bankSet = this.createAllInstruments();
	
	  for (i = 0; i < 16; ++i) {
	    this.programChange(i, i);
	    this.volumeChange(i, 0x64);
	    this.panpotChange(i, 0x40);
	    this.pitchBend(i, 0x00, 0x40); // 8192
	    this.pitchBendSensitivity(i, 2);
	  }
	};
	
	/**
	 * @param {Uint8Array} input
	 */
	Synthesizer.prototype.refreshInstruments = function (input) {
	  this.input = input;
	  this.parser = new _sf2.default(input);
	  this.bankSet = this.createAllInstruments();
	};
	
	Synthesizer.prototype.createAllInstruments = function () {
	  /** @type {Parser} */
	  var parser = this.parser;
	  parser.parse();
	  /** @type {Array} TODO */
	  var presets = parser.createPreset();
	  /** @type {Array} TODO */
	  var instruments = parser.createInstrument();
	  /** @type {Object} */
	  var banks = [];
	  /** @type {Array.<Array.<Object>>} */
	  var bank;
	  /** @type {Object} TODO */
	  var preset;
	  /** @type {Object} */
	  var instrument;
	  /** @type {number} */
	  var presetNumber;
	  /** @type {number} */
	  var i;
	  /** @type {number} */
	  var il;
	  /** @type {number} */
	  var j;
	  /** @type {number} */
	  var jl;
	
	  for (i = 0, il = presets.length; i < il; ++i) {
	    preset = presets[i];
	    presetNumber = preset.header.preset;
	
	    if (typeof preset.instrument !== 'number') {
	      continue;
	    }
	
	    instrument = instruments[preset.instrument];
	    if (instrument.name.replace(/\0*$/, '') === 'EOI') {
	      continue;
	    }
	
	    // select bank
	    if (banks[preset.header.bank] === void 0) {
	      banks[preset.header.bank] = [];
	    }
	    bank = banks[preset.header.bank];
	    bank[presetNumber] = [];
	    bank[presetNumber].name = preset.name;
	
	    for (j = 0, jl = instrument.info.length; j < jl; ++j) {
	      this.createNoteInfo(parser, instrument.info[j], bank[presetNumber]);
	    }
	  }
	
	  return banks;
	};
	
	Synthesizer.prototype.createNoteInfo = function (parser, info, preset) {
	  var generator = info.generator;
	  /** @type {number} */
	  var sampleId;
	  /** @type {Object} */
	  var sampleHeader;
	  /** @type {number} */
	  var volAttack;
	  /** @type {number} */
	  var volDecay;
	  /** @type {number} */
	  var volSustain;
	  /** @type {number} */
	  var volRelease;
	  /** @type {number} */
	  var modAttack;
	  /** @type {number} */
	  var modDecay;
	  /** @type {number} */
	  var modSustain;
	  /** @type {number} */
	  var modRelease;
	  /** @type {number} */
	  var tune;
	  /** @type {number} */
	  var scale;
	  /** @type {number} */
	  var freqVibLFO;
	  /** @type {number} */
	  var i;
	  /** @type {number} */
	  var il;
	
	  if (generator['keyRange'] === void 0 || generator['sampleID'] === void 0) {
	    return;
	  }
	
	  volAttack = this.getModGenAmount(generator, 'attackVolEnv', -12000);
	  volDecay = this.getModGenAmount(generator, 'decayVolEnv', -12000);
	  volSustain = this.getModGenAmount(generator, 'sustainVolEnv');
	  volRelease = this.getModGenAmount(generator, 'releaseVolEnv', -12000);
	  modAttack = this.getModGenAmount(generator, 'attackModEnv', -12000);
	  modDecay = this.getModGenAmount(generator, 'decayModEnv', -12000);
	  modSustain = this.getModGenAmount(generator, 'sustainModEnv');
	  modRelease = this.getModGenAmount(generator, 'releaseModEnv', -12000);
	
	  tune = this.getModGenAmount(generator, 'coarseTune') + this.getModGenAmount(generator, 'fineTune') / 100;
	  scale = this.getModGenAmount(generator, 'scaleTuning', 100) / 100;
	  freqVibLFO = this.getModGenAmount(generator, 'freqVibLFO');
	
	  for (i = generator['keyRange'].lo, il = generator['keyRange'].hi; i <= il; ++i) {
	    if (preset[i]) {
	      continue;
	    }
	
	    sampleId = this.getModGenAmount(generator, 'sampleID');
	    sampleHeader = parser.sampleHeader[sampleId];
	    preset[i] = {
	      'sample': parser.sample[sampleId],
	      'sampleRate': sampleHeader.sampleRate,
	      'basePlaybackRate': Math.pow(Math.pow(2, 1 / 12), (i - this.getModGenAmount(generator, 'overridingRootKey', sampleHeader.originalPitch) + tune + sampleHeader.pitchCorrection / 100) * scale),
	      'modEnvToPitch': this.getModGenAmount(generator, 'modEnvToPitch') / 100,
	      'scaleTuning': scale,
	      'start': this.getModGenAmount(generator, 'startAddrsCoarseOffset') * 32768 + this.getModGenAmount(generator, 'startAddrsOffset'),
	      'end': this.getModGenAmount(generator, 'endAddrsCoarseOffset') * 32768 + this.getModGenAmount(generator, 'endAddrsOffset'),
	      'loopStart':
	      //(sampleHeader.startLoop - sampleHeader.start) +
	      sampleHeader.startLoop + this.getModGenAmount(generator, 'startloopAddrsCoarseOffset') * 32768 + this.getModGenAmount(generator, 'startloopAddrsOffset'),
	      'loopEnd':
	      //(sampleHeader.endLoop - sampleHeader.start) +
	      sampleHeader.endLoop + this.getModGenAmount(generator, 'endloopAddrsCoarseOffset') * 32768 + this.getModGenAmount(generator, 'endloopAddrsOffset'),
	      'volAttack': Math.pow(2, volAttack / 1200),
	      'volDecay': Math.pow(2, volDecay / 1200),
	      'volSustain': volSustain / 1000,
	      'volRelease': Math.pow(2, volRelease / 1200),
	      'modAttack': Math.pow(2, modAttack / 1200),
	      'modDecay': Math.pow(2, modDecay / 1200),
	      'modSustain': modSustain / 1000,
	      'modRelease': Math.pow(2, modRelease / 1200),
	      'initialFilterFc': this.getModGenAmount(generator, 'initialFilterFc', 13500),
	      'modEnvToFilterFc': this.getModGenAmount(generator, 'modEnvToFilterFc'),
	      'initialFilterQ': this.getModGenAmount(generator, 'initialFilterQ'),
	      'freqVibLFO': freqVibLFO ? Math.pow(2, freqVibLFO / 1200) * 8.176 : void 0
	    };
	  }
	};
	
	/**
	 * @param {Object} generator
	 * @param {string} enumeratorType
	 * @param {number=} opt_default
	 * @returns {number}
	 */
	Synthesizer.prototype.getModGenAmount = function (generator, enumeratorType, opt_default) {
	  if (opt_default === void 0) {
	    opt_default = 0;
	  }
	
	  return generator[enumeratorType] ? generator[enumeratorType].amount : opt_default;
	};
	
	Synthesizer.prototype.start = function () {
	  this.bufSrc.connect(this.gainMaster);
	  this.gainMaster.connect(this.ctx.destination);
	  this.bufSrc.start(0);
	
	  this.setMasterVolume(16383);
	};
	
	Synthesizer.prototype.setMasterVolume = function (volume) {
	  this.masterVolume = volume;
	  this.gainMaster.gain.value = this.baseVolume * (volume / 16384);
	};
	
	Synthesizer.prototype.stop = function () {
	  this.bufSrc.disconnect(0);
	  this.gainMaster.disconnect(0);
	  this.compressor.disconnect(0);
	};
	
	/**
	 * @type {!Array.<string>}
	 * @const
	 */
	Synthesizer.TableHeader = ['Instrument', 'Vol', 'Pan', 'Bend', 'Range'];
	
	Synthesizer.prototype.drawSynth = function () {
	  /** @type {HTMLTableElement} */
	  var table = this.table =
	  /** @type {HTMLTableElement} */document.createElement('table');
	  /** @type {HTMLTableSectionElement} */
	  var head =
	  /** @type {HTMLTableSectionElement} */document.createElement('thead');
	  /** @type {HTMLTableSectionElement} */
	  var body =
	  /** @type {HTMLTableSectionElement} */
	  document.createElement('tbody');
	  /** @type {HTMLTableRowElement} */
	  var tableLine;
	  /** @type {NodeList} */
	  var notes;
	  /** @type {number} */
	  var i;
	  /** @type {number} */
	  var j;
	
	  head.appendChild(this.createTableLine(Synthesizer.TableHeader, true));
	
	  for (i = 0; i < 16; ++i) {
	    tableLine = this.createTableLine(Synthesizer.TableHeader.length + 128, false);
	    body.appendChild(tableLine);
	
	    if (i !== 9) {
	      var select = document.createElement('select');
	      var option;
	      for (j = 0; j < 128; ++j) {
	        option = document.createElement('option');
	        option.textContent = Synthesizer.ProgramNames[j];
	        select.appendChild(option);
	      }
	      tableLine.querySelector('td:nth-child(1)').appendChild(select);
	      select.addEventListener('change', function (synth, channel) {
	        return function (event) {
	          synth.programChange(channel, event.target.selectedIndex);
	        };
	      }(this, i), false);
	      select.selectedIndex = this.channelInstrument[i];
	    } else {
	      tableLine.querySelector('td:first-child').textContent = '[ RHYTHM TRACK ]';
	    }
	
	    notes = tableLine.querySelectorAll('td:nth-last-child(-n+128)');
	    for (j = 0; j < 128; ++j) {
	      notes[j].addEventListener('mousedown', function (synth, channel, key) {
	        return function (event) {
	          event.preventDefault();
	          synth.drag = true;
	          synth.noteOn(channel, key, 127);
	        };
	      }(this, i, j));
	      notes[j].addEventListener('mouseover', function (synth, channel, key) {
	        return function (event) {
	          event.preventDefault();
	          if (synth.drag) {
	            synth.noteOn(channel, key, 127);
	          }
	        };
	      }(this, i, j));
	      notes[j].addEventListener('mouseout', function (synth, channel, key) {
	        return function (event) {
	          event.preventDefault();
	          synth.noteOff(channel, key, 0);
	        };
	      }(this, i, j));
	      notes[j].addEventListener('mouseup', function (synth, channel, key) {
	        return function (event) {
	          event.preventDefault();
	          synth.drag = false;
	          synth.noteOff(channel, key, 0);
	        };
	      }(this, i, j));
	    }
	  }
	
	  table.appendChild(head);
	  table.appendChild(body);
	
	  return table;
	};
	
	Synthesizer.prototype.removeSynth = function () {
	  var table = this.table;
	
	  if (table) {
	    table.parentNode.removeChild(table);
	    this.table = null;
	  }
	};
	
	/**
	 * @param {!(Array.<string>|number)} array
	 * @param {boolean} isTitleLine
	 * @returns {HTMLTableRowElement}
	 */
	Synthesizer.prototype.createTableLine = function (array, isTitleLine) {
	  /** @type {HTMLTableRowElement} */
	  var tr = /** @type {HTMLTableRowElement} */document.createElement('tr');
	  /** @type {HTMLTableCellElement} */
	  var cell;
	  /** @type {boolean} */
	  var isArray = array instanceof Array;
	  /** @type {number} */
	  var i;
	  /** @type {number} */
	  var il = isArray ? array.length : /** @type {number} */array;
	
	  for (i = 0; i < il; ++i) {
	    cell =
	    /** @type {HTMLTableCellElement} */
	    document.createElement(isTitleLine ? 'th' : 'td');
	    cell.textContent = isArray && array[i] !== void 0 ? array[i] : '';
	    tr.appendChild(cell);
	  }
	
	  return tr;
	};
	
	/**
	 * @param {number} channel NoteOn するチャンネル.
	 * @param {number} key NoteOn するキー.
	 * @param {number} velocity 強さ.
	 */
	Synthesizer.prototype.noteOn = function (channel, key, velocity) {
	  /** @type {Object} */
	  var bank = this.bankSet[channel === 9 ? 128 : this.bank];
	  /** @type {Object} */
	  var instrument = bank[this.channelInstrument[channel]];
	  /** @type {Object} */
	  var instrumentKey;
	  /** @type {SynthesizerNote} */
	  var note;
	
	  if (this.table) {
	    this.table.querySelector('tbody > ' + 'tr:nth-child(' + (channel + 1) + ') > ' + 'td:nth-child(' + (Synthesizer.TableHeader.length + key + 1) + ')').classList.add('note-on');
	  }
	
	  if (!instrument) {
	    // TODO
	    console.warn("instrument not found: bank=%s instrument=%s channel=%s", channel === 9 ? 128 : this.bank, this.channelInstrument[channel], channel);
	    return;
	  }
	
	  instrumentKey = instrument[key];
	
	  if (!instrumentKey) {
	    // TODO
	    console.warn("instrument not found: bank=%s instrument=%s channel=%s key=%s", channel === 9 ? 128 : this.bank, this.channelInstrument[channel], channel, key);
	    return;
	  }
	
	  var panpot = this.channelPanpot[channel] - 64;
	  panpot /= panpot < 0 ? 64 : 63;
	
	  // create note information
	  instrumentKey['channel'] = channel;
	  instrumentKey['key'] = key;
	  instrumentKey['velocity'] = velocity;
	  instrumentKey['panpot'] = panpot;
	  instrumentKey['volume'] = this.channelVolume[channel] / 127;
	  instrumentKey['pitchBend'] = this.channelPitchBend[channel] - 8192;
	  instrumentKey['pitchBendSensitivity'] = this.channelPitchBendSensitivity[channel];
	
	  // note on
	  note = new _sound_font_synth_note2.default(this.ctx, this.gainMaster, instrumentKey);
	  note.noteOn();
	  this.currentNoteOn[channel].push(note);
	};
	
	/**
	 * @param {number} channel NoteOff するチャンネル.
	 * @param {number} key NoteOff するキー.
	 * @param {number} velocity 強さ.
	 */
	Synthesizer.prototype.noteOff = function (channel, key, velocity) {
	  /** @type {Object} */
	  var bank = this.bankSet[channel === 9 ? 128 : this.bank];
	  /** @type {Object} */
	  var instrument = bank[this.channelInstrument[channel]];
	  /** @type {number} */
	  var i;
	  /** @type {number} */
	  var il;
	  /** @type {Array.<SynthesizerNote>} */
	  var currentNoteOn = this.currentNoteOn[channel];
	  /** @type {SynthesizerNote} */
	  var note;
	
	  if (this.table) {
	    this.table.querySelector('tbody > ' + 'tr:nth-child(' + (channel + 1) + ') > ' + 'td:nth-child(' + (key + Synthesizer.TableHeader.length + 1) + ')').classList.remove('note-on');
	  }
	
	  if (!instrument) {
	    return;
	  }
	
	  for (i = 0, il = currentNoteOn.length; i < il; ++i) {
	    note = currentNoteOn[i];
	    if (note.key === key) {
	      note.noteOff();
	      currentNoteOn.splice(i, 1);
	      --i;
	      --il;
	    }
	  }
	};
	
	/**
	 * @param {number} channel 音色を変更するチャンネル.
	 * @param {number} instrument 音色番号.
	 */
	Synthesizer.prototype.programChange = function (channel, instrument) {
	  if (this.table) {
	    if (channel !== 9) {
	      this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:first-child > select').selectedIndex = instrument;
	    }
	  }
	  // リズムトラックは無視する
	  if (channel === 9) {
	    return;
	  }
	
	  this.channelInstrument[channel] = instrument;
	};
	
	/**
	 * @param {number} channel 音量を変更するチャンネル.
	 * @param {number} volume 音量(0-127).
	 */
	Synthesizer.prototype.volumeChange = function (channel, volume) {
	  if (this.table) {
	    this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(2)').textContent = volume;
	  }
	
	  this.channelVolume[channel] = volume;
	};
	
	/**
	 * @param {number} channel panpot を変更するチャンネル.
	 * @param {number} panpot panpot(0-127).
	 */
	Synthesizer.prototype.panpotChange = function (channel, panpot) {
	  if (this.table) {
	    this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(3)').textContent = panpot;
	  }
	
	  this.channelPanpot[channel] = panpot;
	};
	
	/**
	 * @param {number} channel panpot を変更するチャンネル.
	 * @param {number} lowerByte
	 * @param {number} higherByte
	 */
	Synthesizer.prototype.pitchBend = function (channel, lowerByte, higherByte) {
	  /** @type {number} */
	  var bend = lowerByte & 0x7f | (higherByte & 0x7f) << 7;
	  /** @type {number} */
	  var i;
	  /** @type {number} */
	  var il;
	  /** @type {Array.<SynthesizerNote>} */
	  var currentNoteOn = this.currentNoteOn[channel];
	  /** @type {number} */
	  var calculated = bend - 8192;
	
	  if (this.table) {
	    this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(4)').textContent = calculated;
	  }
	
	  for (i = 0, il = currentNoteOn.length; i < il; ++i) {
	    currentNoteOn[i].updatePitchBend(calculated);
	  }
	
	  this.channelPitchBend[channel] = bend;
	};
	
	/**
	 * @param {number} channel pitch bend sensitivity を変更するチャンネル.
	 * @param {number} sensitivity
	 */
	Synthesizer.prototype.pitchBendSensitivity = function (channel, sensitivity) {
	  if (this.table) {
	    this.table.querySelector('tbody > tr:nth-child(' + (channel + 1) + ') > td:nth-child(5)').textContent = sensitivity;
	  }
	
	  this.channelPitchBendSensitivity[channel] = sensitivity;
	};
	
	/**
	 * @param {number} channel 音を消すチャンネル.
	 */
	Synthesizer.prototype.allSoundOff = function (channel) {
	  /** @type {Array.<SynthesizerNote>} */
	  var currentNoteOn = this.currentNoteOn[channel];
	
	  while (currentNoteOn.length > 0) {
	    this.noteOff(channel, currentNoteOn[0].key, 0);
	  }
	};
	
	/**
	 * @param {number} channel リセットするチャンネル
	 */
	Synthesizer.prototype.resetAllControl = function (channel) {
	  this.pitchBend(channel, 0x00, 0x40); // 8192
	};
	
	exports.default = Synthesizer;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * @param {AudioContext} ctx
	 * @param {AudioNode} destination
	 * @param {{
	 *   channel: number,
	 *   key: number,
	 *   sample: Uint8Array,
	 *   basePlaybackRate: number,
	 *   loopStart: number,
	 *   loopEnd: number,
	 *   volume: number,
	 *   panpot: number
	 * }} instrument
	 * @constructor
	 */
	var SynthesizerNote = function SynthesizerNote(ctx, destination, instrument) {
	  /** @type {AudioContext} */
	  this.ctx = ctx;
	  /** @type {AudioNode} */
	  this.destination = destination;
	  /** @type {{
	   *   channel: number,
	   *   key: number,
	   *   sample: Uint8Array,
	   *   basePlaybackRate: number,
	   *   loopStart: number,
	   *   loopEnd: number,
	   *   volume: number,
	   *   panpot: number
	   * }}
	   */
	  this.instrument = instrument;
	  /** @type {number} */
	  this.channel = instrument['channel'];
	  /** @type {number} */
	  this.key = instrument['key'];
	  /** @type {number} */
	  this.velocity = instrument['velocity'];
	  /** @type {Int16Array} */
	  this.buffer = instrument['sample'];
	  /** @type {number} */
	  this.playbackRate = instrument['basePlaybackRate'];
	  /** @type {number} */
	  this.sampleRate = instrument['sampleRate'];
	  /** @type {number} */
	  this.volume = instrument['volume'];
	  /** @type {number} */
	  this.panpot = instrument['panpot'];
	  /** @type {number} */
	  this.pitchBend = instrument['pitchBend'];
	  /** @type {number} */
	  this.pitchBendSensitivity = instrument['pitchBendSensitivity'];
	  /** @type {number} */
	  this.modEnvToPitch = instrument['modEnvToPitch'];
	
	  // state
	  /** @type {number} */
	  this.startTime = ctx.currentTime;
	  /** @type {number} */
	  this.computedPlaybackRate = this.playbackRate;
	
	  //---------------------------------------------------------------------------
	  // audio node
	  //---------------------------------------------------------------------------
	
	  /** @type {AudioBuffer} */
	  this.audioBuffer;
	  /** @type {AudioBufferSourceNode} */
	  this.bufferSource;
	  /** @type {AudioPannerNode} */
	  this.panner;
	  /** @type {AudioGainNode} */
	  this.gainOutput;
	
	  //console.log(instrument['modAttack'], instrument['modDecay'], instrument['modSustain'], instrument['modRelease']);
	};
	
	SynthesizerNote.prototype.noteOn = function () {
	  /** @type {AudioContext} */
	  var ctx = this.ctx;
	  /** @type {{
	   *   channel: number,
	   *   key: number,
	   *   sample: Uint8Array,
	   *   basePlaybackRate: number,
	   *   loopStart: number,
	   *   loopEnd: number,
	   *   volume: number,
	   *   panpot: number
	   * }} */
	  var instrument = this.instrument;
	  /** @type {Int16Array} */
	  var sample = this.buffer;
	  /** @type {AudioBuffer} */
	  var buffer;
	  /** @type {Float32Array} */
	  var channelData;
	  /** @type {AudioBufferSourceNode} */
	  var bufferSource;
	  /** @type {BiquadFilterNode} */
	  var filter;
	  /** @type {AudioPannerNode} */
	  var panner;
	  /** @type {AudioGainNode} */
	  var output;
	  /** @type {AudioGain} */
	  var outputGain;
	  /** @type {number} */
	  var now = this.ctx.currentTime;
	  /** @type {number} */
	  var volAttack = now + instrument['volAttack'];
	  /** @type {number} */
	  var modAttack = now + instrument['modAttack'];
	  /** @type {number} */
	  var volDecay = volAttack + instrument['volDecay'];
	  /** @type {number} */
	  var modDecay = modAttack + instrument['modDecay'];
	  /** @type {number} */
	  var loopStart = instrument['loopStart'] / this.sampleRate;
	  /** @type {number} */
	  var loopEnd = instrument['loopEnd'] / this.sampleRate;
	  /** @type {number} */
	  var startTime = instrument['start'] / this.sampleRate;
	  /** @type {number} */
	  var baseFreq;
	  /** @type {number} */
	  var peekFreq;
	  /** @type {number} */
	  var sustainFreq;
	
	  sample = sample.subarray(0, sample.length + instrument['end']);
	  buffer = this.audioBuffer = ctx.createBuffer(1, sample.length, this.sampleRate);
	  channelData = buffer.getChannelData(0);
	  channelData.set(sample);
	
	  // buffer source
	  bufferSource = this.bufferSource = ctx.createBufferSource();
	  bufferSource.buffer = buffer;
	  bufferSource.loop = this.channel !== 9;
	  bufferSource.loopStart = loopStart;
	  bufferSource.loopEnd = loopEnd;
	  this.updatePitchBend(this.pitchBend);
	
	  // audio node
	  panner = this.panner = ctx.createPanner();
	  output = this.gainOutput = ctx.createGainNode();
	  outputGain = output.gain;
	
	  // filter
	  filter = this.filter = ctx.createBiquadFilter();
	  filter.type = filter.LOWPASS;
	
	  // panpot
	  panner.panningModel = 0;
	  panner.setPosition(Math.sin(this.panpot * Math.PI / 2), 0, Math.cos(this.panpot * Math.PI / 2));
	
	  //---------------------------------------------------------------------------
	  // Attack, Decay, Sustain
	  //---------------------------------------------------------------------------
	  outputGain.setValueAtTime(0, now);
	  outputGain.linearRampToValueAtTime(this.volume * (this.velocity / 127), volAttack);
	  outputGain.linearRampToValueAtTime(this.volume * (1 - instrument['volSustain']), volDecay);
	
	  filter.Q.setValueAtTime(instrument['initialFilterQ'] * Math.pow(10, 200), now);
	  baseFreq = amountToFreq(instrument['initialFilterFc']);
	  peekFreq = amountToFreq(instrument['initialFilterFc'] + instrument['modEnvToFilterFc']);
	  sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - instrument['modSustain']);
	  filter.frequency.setValueAtTime(baseFreq, now);
	  filter.frequency.linearRampToValueAtTime(peekFreq, modAttack);
	  filter.frequency.linearRampToValueAtTime(sustainFreq, modDecay);
	
	  /**
	   * @param {number} val
	   * @returns {number}
	   */
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
	  /** @type {{
	   *   channel: number,
	   *   key: number,
	   *   sample: Uint8Array,
	   *   basePlaybackRate: number,
	   *   loopStart: number,
	   *   loopEnd: number,
	   *   volume: number,
	   *   panpot: number
	   * }} */
	  var instrument = this.instrument;
	  /** @type {AudioBufferSourceNode} */
	  var bufferSource = this.bufferSource;
	  /** @type {AudioGainNode} */
	  var output = this.gainOutput;
	  /** @type {number} */
	  var now = this.ctx.currentTime;
	  /** @type {number} */
	  var volEndTime = now + instrument['volRelease'];
	  /** @type {number} */
	  var modEndTime = now + instrument['modRelease'];
	
	  if (!this.audioBuffer) {
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
	
	  // disconnect
	  //*
	  setTimeout(function (note) {
	    return function () {
	      note.bufferSource.disconnect(0);
	      note.panner.disconnect(0);
	      note.gainOutput.disconnect(0);
	    };
	  }(this), instrument['volRelease'] * 1000);
	  //*/
	};
	
	SynthesizerNote.prototype.schedulePlaybackRate = function () {
	  var playbackRate = this.bufferSource.playbackRate;
	  /** @type {number} */
	  var computed = this.computedPlaybackRate;
	  /** @type {number} */
	  var start = this.startTime;
	  /** @type {Object} */
	  var instrument = this.instrument;
	  /** @type {number} */
	  var modAttack = start + instrument['modAttack'];
	  /** @type {number} */
	  var modDecay = modAttack + instrument['modDecay'];
	  /** @type {number} */
	  var peekPitch = computed * Math.pow(Math.pow(2, 1 / 12), this.modEnvToPitch * this.instrument['scaleTuning']);
	
	  playbackRate.cancelScheduledValues(0);
	  playbackRate.setValueAtTime(computed, start);
	  playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
	  playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - instrument['modSustain']), modDecay);
	};
	
	/**
	 * @param {number} pitchBend
	 */
	SynthesizerNote.prototype.updatePitchBend = function (pitchBend) {
	  this.computedPlaybackRate = this.playbackRate * Math.pow(Math.pow(2, 1 / 12), this.pitchBendSensitivity * (pitchBend / (pitchBend < 0 ? 8192 : 8191)) * this.instrument['scaleTuning']);
	  this.schedulePlaybackRate();
	};
	
	exports.default = SynthesizerNote;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2E3YTZiZGVkYmY2M2VlNWI1ZWQ/YTM4ZiIsIndlYnBhY2s6Ly8vLi9leHBvcnQvc3ludGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NmMi5qcz80M2ZhIiwid2VicGFjazovLy8uL3NyYy9yaWZmLmpzPzQyZDIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dtbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc291bmRfZm9udF9zeW50aC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc291bmRfZm9udF9zeW50aF9ub3RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEk7Ozs7Ozs7Ozs7OztBQ0FBOzs7Ozs7QUFFQTs7Ozs7QUFLQSxLQUFNLFNBQVMsU0FBVCxNQUFTLENBQVMsS0FBVCxFQUFnQixVQUFoQixFQUE0QjtBQUN6QyxnQkFBYSxjQUFjLEVBQTNCO0FBQ0E7QUFDQSxRQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0E7QUFDQSxRQUFLLFlBQUwsR0FBb0IsV0FBVyxjQUFYLENBQXBCOztBQUVBO0FBQ0EsUUFBSyxZQUFMO0FBQ0E7QUFDQSxRQUFLLFVBQUw7QUFDQTtBQUNBLFFBQUssbUJBQUw7QUFDQTtBQUNBLFFBQUssbUJBQUw7QUFDQTtBQUNBLFFBQUssVUFBTDtBQUNBO0FBQ0EsUUFBSyxjQUFMO0FBQ0E7QUFDQSxRQUFLLHVCQUFMO0FBQ0E7QUFDQSxRQUFLLHVCQUFMO0FBQ0E7QUFDQSxRQUFLLFlBQUw7QUFDRCxFQXpC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QUNBO0FBQ0EsT0FBSSxXQUFXLFlBQVksV0FBVyxVQUFYLENBQTNCO0FBQ0E7QUFDQSxPQUFJLFlBQVksV0FBVyxLQUFLLEdBQUwsQ0FDekIsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUUsRUFBZCxDQUR5QixFQUV6QixLQUFLLGFBQUwsR0FBcUIsS0FBSyxVQUFMLENBQWdCLGFBQWhCLENBRkksQ0FBM0I7O0FBS0EsZ0JBQWEscUJBQWIsQ0FBbUMsQ0FBbkM7QUFDQSxnQkFBYSxjQUFiLENBQTRCLFFBQTVCLEVBQXNDLEtBQXRDO0FBQ0EsZ0JBQWEsdUJBQWIsQ0FBcUMsU0FBckMsRUFBZ0QsU0FBaEQ7QUFDQSxnQkFBYSx1QkFBYixDQUFxQyxXQUFXLENBQUMsWUFBWSxRQUFiLEtBQTBCLElBQUksV0FBVyxZQUFYLENBQTlCLENBQWhELEVBQXlHLFFBQXpHO0FBQ0QsRUF0QkQ7O0FBd0JBOzs7QUFHQSxpQkFBZ0IsU0FBaEIsQ0FBMEIsZUFBMUIsR0FBNEMsVUFBUyxTQUFULEVBQW9CO0FBQzlELFFBQUssb0JBQUwsR0FBNEIsS0FBSyxZQUFMLEdBQW9CLEtBQUssR0FBTCxDQUM5QyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBRSxFQUFkLENBRDhDLEVBRzVDLEtBQUssb0JBQUwsSUFDRSxhQUFhLFlBQVksQ0FBWixHQUFnQixJQUFoQixHQUF1QixJQUFwQyxDQURGLENBREYsR0FJSSxLQUFLLFVBQUwsQ0FBZ0IsYUFBaEIsQ0FOMEMsQ0FBaEQ7QUFRQSxRQUFLLG9CQUFMO0FBQ0QsRUFWRDs7bUJBWWUsZSIsImZpbGUiOiJzZjIuc3ludGguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJzdGF0aWNcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDNhN2E2YmRlZGJmNjNlZTViNWVkXG4gKiovIiwiZXhwb3J0ICogZnJvbSBcIi4uL3NyYy93bWxcIlxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2V4cG9ydC9zeW50aC5qc1xuICoqLyIsImltcG9ydCBSaWZmIGZyb20gXCIuL3JpZmZcIlxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7Qnl0ZUFycmF5fSBpbnB1dFxyXG4gKiBAcGFyYW0ge09iamVjdD19IG9wdF9wYXJhbXNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5jb25zdCBQYXJzZXIgPSBmdW5jdGlvbihpbnB1dCwgb3B0X3BhcmFtcykge1xyXG4gIG9wdF9wYXJhbXMgPSBvcHRfcGFyYW1zIHx8IHt9O1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICAvKiogQHR5cGUgeyhPYmplY3R8dW5kZWZpbmVkKX0gKi9cclxuICB0aGlzLnBhcnNlck9wdGlvbiA9IG9wdF9wYXJhbXNbJ3BhcnNlck9wdGlvbiddO1xyXG5cclxuICAvKiogQHR5cGUge0FycmF5LjxPYmplY3Q+fSAqL1xyXG4gIHRoaXMucHJlc2V0SGVhZGVyO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5wcmVzZXRab25lO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5wcmVzZXRab25lTW9kdWxhdG9yO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5wcmVzZXRab25lR2VuZXJhdG9yO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5pbnN0cnVtZW50O1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5pbnN0cnVtZW50Wm9uZTtcclxuICAvKiogQHR5cGUge0FycmF5LjxPYmplY3Q+fSAqL1xyXG4gIHRoaXMuaW5zdHJ1bWVudFpvbmVNb2R1bGF0b3I7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB0aGlzLmluc3RydW1lbnRab25lR2VuZXJhdG9yO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdGhpcy5zYW1wbGVIZWFkZXI7XHJcbn07XHJcblxyXG5QYXJzZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oKSB7XHJcbiAgLyoqIEB0eXBlIHtSaWZmLlBhcnNlcn0gKi9cclxuICB2YXIgcGFyc2VyID0gbmV3IFJpZmYuUGFyc2VyKHRoaXMuaW5wdXQsIHRoaXMucGFyc2VyT3B0aW9uKTtcclxuICAvKiogQHR5cGUgez9SaWZmLkNodW5rfSAqL1xyXG4gIHZhciBjaHVuaztcclxuXHJcbiAgLy8gcGFyc2UgUklGRiBjaHVua1xyXG4gIHBhcnNlci5wYXJzZSgpO1xyXG4gIGlmIChwYXJzZXIuY2h1bmtMaXN0Lmxlbmd0aCAhPT0gMSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBjaHVuayBsZW5ndGgnKTtcclxuICB9XHJcblxyXG4gIGNodW5rID0gcGFyc2VyLmdldENodW5rKDApO1xyXG4gIGlmIChjaHVuayA9PT0gbnVsbCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjaHVuayBub3QgZm91bmQnKTtcclxuICB9XHJcblxyXG4gIHRoaXMucGFyc2VSaWZmQ2h1bmsoY2h1bmspO1xyXG4vL2NvbnNvbGUubG9nKHRoaXMuc2FtcGxlSGVhZGVyKTtcclxuICB0aGlzLmlucHV0ID0gbnVsbDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge1JpZmYuQ2h1bmt9IGNodW5rXHJcbiAqL1xyXG5QYXJzZXIucHJvdG90eXBlLnBhcnNlUmlmZkNodW5rID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvKiogQHR5cGUge1JpZmYuUGFyc2VyfSAqL1xyXG4gIHZhciBwYXJzZXI7XHJcbiAgLyoqIEB0eXBlIHtCeXRlQXJyYXl9ICovXHJcbiAgdmFyIGRhdGEgPSB0aGlzLmlucHV0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpcCA9IGNodW5rLm9mZnNldDtcclxuICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICB2YXIgc2lnbmF0dXJlO1xyXG5cclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ1JJRkYnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBzaWduYXR1cmVcclxuICBzaWduYXR1cmUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10pO1xyXG4gIGlmIChzaWduYXR1cmUgIT09ICdzZmJrJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKTtcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcGFyc2VyID0gbmV3IFJpZmYuUGFyc2VyKGRhdGEsIHsnaW5kZXgnOiBpcCwgJ2xlbmd0aCc6IGNodW5rLnNpemUgLSA0fSk7XHJcbiAgcGFyc2VyLnBhcnNlKCk7XHJcbiAgaWYgKHBhcnNlci5nZXROdW1iZXJPZkNodW5rcygpICE9PSAzKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgc2ZiayBzdHJ1Y3R1cmUnKTtcclxuICB9XHJcblxyXG4gIC8vIElORk8tbGlzdFxyXG4gIHRoaXMucGFyc2VJbmZvTGlzdCgvKiogQHR5cGUgeyFSaWZmLkNodW5rfSAqLyhwYXJzZXIuZ2V0Q2h1bmsoMCkpKTtcclxuXHJcbiAgLy8gc2R0YS1saXN0XHJcbiAgdGhpcy5wYXJzZVNkdGFMaXN0KC8qKiBAdHlwZSB7IVJpZmYuQ2h1bmt9ICovKHBhcnNlci5nZXRDaHVuaygxKSkpO1xyXG5cclxuICAvLyBwZHRhLWxpc3RcclxuICB0aGlzLnBhcnNlUGR0YUxpc3QoLyoqIEB0eXBlIHshUmlmZi5DaHVua30gKi8ocGFyc2VyLmdldENodW5rKDIpKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZUluZm9MaXN0ID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvKiogQHR5cGUge1JpZmYuUGFyc2VyfSAqL1xyXG4gIHZhciBwYXJzZXI7XHJcbiAgLyoqIEB0eXBlIHtCeXRlQXJyYXl9ICovXHJcbiAgdmFyIGRhdGEgPSB0aGlzLmlucHV0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpcCA9IGNodW5rLm9mZnNldDtcclxuICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICB2YXIgc2lnbmF0dXJlO1xyXG5cclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ0xJU1QnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBzaWduYXR1cmVcclxuICBzaWduYXR1cmUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10pO1xyXG4gIGlmIChzaWduYXR1cmUgIT09ICdJTkZPJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKTtcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcGFyc2VyID0gbmV3IFJpZmYuUGFyc2VyKGRhdGEsIHsnaW5kZXgnOiBpcCwgJ2xlbmd0aCc6IGNodW5rLnNpemUgLSA0fSk7XHJcbiAgcGFyc2VyLnBhcnNlKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVNkdGFMaXN0ID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvKiogQHR5cGUge1JpZmYuUGFyc2VyfSAqL1xyXG4gIHZhciBwYXJzZXI7XHJcbiAgLyoqIEB0eXBlIHtCeXRlQXJyYXl9ICovXHJcbiAgdmFyIGRhdGEgPSB0aGlzLmlucHV0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpcCA9IGNodW5rLm9mZnNldDtcclxuICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICB2YXIgc2lnbmF0dXJlO1xyXG5cclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ0xJU1QnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBzaWduYXR1cmVcclxuICBzaWduYXR1cmUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10sIGRhdGFbaXArK10pO1xyXG4gIGlmIChzaWduYXR1cmUgIT09ICdzZHRhJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHNpZ25hdHVyZTonICsgc2lnbmF0dXJlKTtcclxuICB9XHJcblxyXG4gIC8vIHJlYWQgc3RydWN0dXJlXHJcbiAgcGFyc2VyID0gbmV3IFJpZmYuUGFyc2VyKGRhdGEsIHsnaW5kZXgnOiBpcCwgJ2xlbmd0aCc6IGNodW5rLnNpemUgLSA0fSk7XHJcbiAgcGFyc2VyLnBhcnNlKCk7XHJcbiAgaWYgKHBhcnNlci5jaHVua0xpc3QubGVuZ3RoICE9PSAxKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RPRE8nKTtcclxuICB9XHJcbiAgdGhpcy5zYW1wbGluZ0RhdGEgPVxyXG4gICAgLyoqIEB0eXBlIHt7dHlwZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIG9mZnNldDogbnVtYmVyfX0gKi9cclxuICAgIChwYXJzZXIuZ2V0Q2h1bmsoMCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VQZHRhTGlzdCA9IGZ1bmN0aW9uKGNodW5rKSB7XHJcbiAgLyoqIEB0eXBlIHtSaWZmLlBhcnNlcn0gKi9cclxuICB2YXIgcGFyc2VyO1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXHJcbiAgdmFyIHNpZ25hdHVyZTtcclxuXHJcbiAgLy8gY2hlY2sgcGFyc2UgdGFyZ2V0XHJcbiAgaWYgKGNodW5rLnR5cGUgIT09ICdMSVNUJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNodW5rIHR5cGU6JyArIGNodW5rLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgc2lnbmF0dXJlXHJcbiAgc2lnbmF0dXJlID0gU3RyaW5nLmZyb21DaGFyQ29kZShkYXRhW2lwKytdLCBkYXRhW2lwKytdLCBkYXRhW2lwKytdLCBkYXRhW2lwKytdKTtcclxuICBpZiAoc2lnbmF0dXJlICE9PSAncGR0YScpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaWduYXR1cmU6JyArIHNpZ25hdHVyZSk7XHJcbiAgfVxyXG5cclxuICAvLyByZWFkIHN0cnVjdHVyZVxyXG4gIHBhcnNlciA9IG5ldyBSaWZmLlBhcnNlcihkYXRhLCB7J2luZGV4JzogaXAsICdsZW5ndGgnOiBjaHVuay5zaXplIC0gNH0pO1xyXG4gIHBhcnNlci5wYXJzZSgpO1xyXG5cclxuICAvLyBjaGVjayBudW1iZXIgb2YgY2h1bmtzXHJcbiAgaWYgKHBhcnNlci5nZXROdW1iZXJPZkNodW5rcygpICE9PSA5KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGR0YSBjaHVuaycpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5wYXJzZVBoZHIoLyoqIEB0eXBlIHtSaWZmLkNodW5rfSAqLyhwYXJzZXIuZ2V0Q2h1bmsoMCkpKTtcclxuICB0aGlzLnBhcnNlUGJhZygvKiogQHR5cGUge1JpZmYuQ2h1bmt9ICovKHBhcnNlci5nZXRDaHVuaygxKSkpO1xyXG4gIHRoaXMucGFyc2VQbW9kKC8qKiBAdHlwZSB7UmlmZi5DaHVua30gKi8ocGFyc2VyLmdldENodW5rKDIpKSk7XHJcbiAgdGhpcy5wYXJzZVBnZW4oLyoqIEB0eXBlIHtSaWZmLkNodW5rfSAqLyhwYXJzZXIuZ2V0Q2h1bmsoMykpKTtcclxuICB0aGlzLnBhcnNlSW5zdCgvKiogQHR5cGUge1JpZmYuQ2h1bmt9ICovKHBhcnNlci5nZXRDaHVuayg0KSkpO1xyXG4gIHRoaXMucGFyc2VJYmFnKC8qKiBAdHlwZSB7UmlmZi5DaHVua30gKi8ocGFyc2VyLmdldENodW5rKDUpKSk7XHJcbiAgdGhpcy5wYXJzZUltb2QoLyoqIEB0eXBlIHtSaWZmLkNodW5rfSAqLyhwYXJzZXIuZ2V0Q2h1bmsoNikpKTtcclxuICB0aGlzLnBhcnNlSWdlbigvKiogQHR5cGUge1JpZmYuQ2h1bmt9ICovKHBhcnNlci5nZXRDaHVuayg3KSkpO1xyXG4gIHRoaXMucGFyc2VTaGRyKC8qKiBAdHlwZSB7UmlmZi5DaHVua30gKi8ocGFyc2VyLmdldENodW5rKDgpKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVBoZHIgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgcHJlc2V0SGVhZGVyID0gdGhpcy5wcmVzZXRIZWFkZXIgPSBbXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemU7XHJcblxyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSAncGhkcicpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKTtcclxuICB9XHJcblxyXG4gIHdoaWxlIChpcCA8IHNpemUpIHtcclxuICAgIHByZXNldEhlYWRlci5wdXNoKHtcclxuICAgICAgcHJlc2V0TmFtZTogU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBkYXRhLnN1YmFycmF5KGlwLCBpcCArPSAyMCkpLFxyXG4gICAgICBwcmVzZXQ6IGRhdGFbaXArK10gfCAoZGF0YVtpcCsrXSA8PCA4KSxcclxuICAgICAgYmFuazogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpLFxyXG4gICAgICBwcmVzZXRCYWdJbmRleDogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpLFxyXG4gICAgICBsaWJyYXJ5OiAoZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpIHwgKGRhdGFbaXArK10gPDwgMTYpIHwgKGRhdGFbaXArK10gPDwgMjQpKSA+Pj4gMCxcclxuICAgICAgZ2VucmU6IChkYXRhW2lwKytdIHwgKGRhdGFbaXArK10gPDwgOCkgfCAoZGF0YVtpcCsrXSA8PCAxNikgfCAoZGF0YVtpcCsrXSA8PCAyNCkpID4+PiAwLFxyXG4gICAgICBtb3JwaG9sb2d5OiAoZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpIHwgKGRhdGFbaXArK10gPDwgMTYpIHwgKGRhdGFbaXArK10gPDwgMjQpKSA+Pj4gMFxyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VQYmFnID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvKiogQHR5cGUge0J5dGVBcnJheX0gKi9cclxuICB2YXIgZGF0YSA9IHRoaXMuaW5wdXQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGlwID0gY2h1bmsub2Zmc2V0O1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdmFyIHByZXNldFpvbmUgPSB0aGlzLnByZXNldFpvbmUgPSBbXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemU7XHJcblxyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSAncGJhZycpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICB3aGlsZSAoaXAgPCBzaXplKSB7XHJcbiAgICBwcmVzZXRab25lLnB1c2goe1xyXG4gICAgICBwcmVzZXRHZW5lcmF0b3JJbmRleDogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpLFxyXG4gICAgICBwcmVzZXRNb2R1bGF0b3JJbmRleDogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVBtb2QgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSAncG1vZCcpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKTtcclxuICB9XHJcblxyXG4gIHRoaXMucHJlc2V0Wm9uZU1vZHVsYXRvciA9IHRoaXMucGFyc2VNb2R1bGF0b3IoY2h1bmspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VQZ2VuID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ3BnZW4nKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG4gIHRoaXMucHJlc2V0Wm9uZUdlbmVyYXRvciA9IHRoaXMucGFyc2VHZW5lcmF0b3IoY2h1bmspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VJbnN0ID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvKiogQHR5cGUge0J5dGVBcnJheX0gKi9cclxuICB2YXIgZGF0YSA9IHRoaXMuaW5wdXQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGlwID0gY2h1bmsub2Zmc2V0O1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdmFyIGluc3RydW1lbnQgPSB0aGlzLmluc3RydW1lbnQgPSBbXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemU7XHJcblxyXG4gIC8vIGNoZWNrIHBhcnNlIHRhcmdldFxyXG4gIGlmIChjaHVuay50eXBlICE9PSAnaW5zdCcpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaHVuayB0eXBlOicgKyBjaHVuay50eXBlKTtcclxuICB9XHJcblxyXG4gIHdoaWxlIChpcCA8IHNpemUpIHtcclxuICAgIGluc3RydW1lbnQucHVzaCh7XHJcbiAgICAgIGluc3RydW1lbnROYW1lOiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGRhdGEuc3ViYXJyYXkoaXAsIGlwICs9IDIwKSksXHJcbiAgICAgIGluc3RydW1lbnRCYWdJbmRleDogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZUliYWcgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgaW5zdHJ1bWVudFpvbmUgPSB0aGlzLmluc3RydW1lbnRab25lID0gW107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHNpemUgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplO1xyXG5cclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ2liYWcnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgd2hpbGUgKGlwIDwgc2l6ZSkge1xyXG4gICAgaW5zdHJ1bWVudFpvbmUucHVzaCh7XHJcbiAgICAgIGluc3RydW1lbnRHZW5lcmF0b3JJbmRleDogZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpLFxyXG4gICAgICBpbnN0cnVtZW50TW9kdWxhdG9ySW5kZXg6IGRhdGFbaXArK10gfCAoZGF0YVtpcCsrXSA8PCA4KVxyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VJbW9kID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ2ltb2QnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICB0aGlzLmluc3RydW1lbnRab25lTW9kdWxhdG9yID0gdGhpcy5wYXJzZU1vZHVsYXRvcihjaHVuayk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7UmlmZi5DaHVua30gY2h1bmtcclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VJZ2VuID0gZnVuY3Rpb24oY2h1bmspIHtcclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ2lnZW4nKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICB0aGlzLmluc3RydW1lbnRab25lR2VuZXJhdG9yID0gdGhpcy5wYXJzZUdlbmVyYXRvcihjaHVuayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVNoZHIgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgc2FtcGxlcyA9IHRoaXMuc2FtcGxlID0gW107XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgc2FtcGxlSGVhZGVyID0gdGhpcy5zYW1wbGVIZWFkZXIgPSBbXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc2l6ZSA9IGNodW5rLm9mZnNldCArIGNodW5rLnNpemU7XHJcbiAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXHJcbiAgdmFyIHNhbXBsZU5hbWU7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHN0YXJ0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBlbmQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHN0YXJ0TG9vcDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgZW5kTG9vcDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc2FtcGxlUmF0ZTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgb3JpZ2luYWxQaXRjaDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgcGl0Y2hDb3JyZWN0aW9uO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBzYW1wbGVMaW5rO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBzYW1wbGVUeXBlO1xyXG5cclxuICAvLyBjaGVjayBwYXJzZSB0YXJnZXRcclxuICBpZiAoY2h1bmsudHlwZSAhPT0gJ3NoZHInKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2h1bmsgdHlwZTonICsgY2h1bmsudHlwZSk7XHJcbiAgfVxyXG5cclxuICB3aGlsZSAoaXAgPCBzaXplKSB7XHJcbiAgICBzYW1wbGVOYW1lID0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBkYXRhLnN1YmFycmF5KGlwLCBpcCArPSAyMCkpO1xyXG4gICAgc3RhcnQgPSAoXHJcbiAgICAgIChkYXRhW2lwKytdIDw8IDApIHwgKGRhdGFbaXArK10gPDwgOCkgfCAoZGF0YVtpcCsrXSA8PCAxNikgfCAoZGF0YVtpcCsrXSA8PCAyNClcclxuICAgICkgPj4+IDA7XHJcbiAgICBlbmQgPSAoXHJcbiAgICAgIChkYXRhW2lwKytdIDw8IDApIHwgKGRhdGFbaXArK10gPDwgOCkgfCAoZGF0YVtpcCsrXSA8PCAxNikgfCAoZGF0YVtpcCsrXSA8PCAyNClcclxuICAgICkgPj4+IDA7XHJcbiAgICBzdGFydExvb3AgPSAoXHJcbiAgICAgIChkYXRhW2lwKytdIDw8IDApIHwgKGRhdGFbaXArK10gPDwgOCkgfCAoZGF0YVtpcCsrXSA8PCAxNikgfCAoZGF0YVtpcCsrXSA8PCAyNClcclxuICAgICkgPj4+IDA7XHJcbiAgICBlbmRMb29wID0gIChcclxuICAgICAgKGRhdGFbaXArK10gPDwgMCkgfCAoZGF0YVtpcCsrXSA8PCA4KSB8IChkYXRhW2lwKytdIDw8IDE2KSB8IChkYXRhW2lwKytdIDw8IDI0KVxyXG4gICAgKSA+Pj4gMDtcclxuICAgIHNhbXBsZVJhdGUgPSAoXHJcbiAgICAgIChkYXRhW2lwKytdIDw8IDApIHwgKGRhdGFbaXArK10gPDwgOCkgfCAoZGF0YVtpcCsrXSA8PCAxNikgfCAoZGF0YVtpcCsrXSA8PCAyNClcclxuICAgICkgPj4+IDA7XHJcbiAgICBvcmlnaW5hbFBpdGNoID0gZGF0YVtpcCsrXTtcclxuICAgIHBpdGNoQ29ycmVjdGlvbiA9IChkYXRhW2lwKytdIDw8IDI0KSA+PiAyNDtcclxuICAgIHNhbXBsZUxpbmsgPSBkYXRhW2lwKytdIHwgKGRhdGFbaXArK10gPDwgOCk7XHJcbiAgICBzYW1wbGVUeXBlID0gZGF0YVtpcCsrXSB8IChkYXRhW2lwKytdIDw8IDgpO1xyXG5cclxuICAgIC8vKlxyXG4gICAgdmFyIHNhbXBsZSA9IG5ldyBJbnQxNkFycmF5KG5ldyBVaW50OEFycmF5KGRhdGEuc3ViYXJyYXkoXHJcbiAgICAgIHRoaXMuc2FtcGxpbmdEYXRhLm9mZnNldCArIHN0YXJ0ICogMixcclxuICAgICAgdGhpcy5zYW1wbGluZ0RhdGEub2Zmc2V0ICsgZW5kICAgKiAyXHJcbiAgICApKS5idWZmZXIpO1xyXG5cclxuICAgIHN0YXJ0TG9vcCAtPSBzdGFydDtcclxuICAgIGVuZExvb3AgLT0gc3RhcnQ7XHJcblxyXG4gICAgaWYgKHNhbXBsZVJhdGUgPiAwKSB7XHJcbiAgICAgIHZhciBhZGp1c3QgPSB0aGlzLmFkanVzdFNhbXBsZURhdGEoc2FtcGxlLCBzYW1wbGVSYXRlKTtcclxuICAgICAgc2FtcGxlID0gYWRqdXN0LnNhbXBsZTtcclxuICAgICAgc2FtcGxlUmF0ZSAqPSBhZGp1c3QubXVsdGlwbHk7XHJcbiAgICAgIHN0YXJ0TG9vcCAqPSBhZGp1c3QubXVsdGlwbHk7XHJcbiAgICAgIGVuZExvb3AgKj0gYWRqdXN0Lm11bHRpcGx5O1xyXG4gICAgfVxyXG5cclxuICAgIHNhbXBsZXMucHVzaChzYW1wbGUpO1xyXG4gICAgLy8qL1xyXG5cclxuICAgIHNhbXBsZUhlYWRlci5wdXNoKHtcclxuICAgICAgc2FtcGxlTmFtZTogc2FtcGxlTmFtZSxcclxuICAgICAgLypcclxuICAgICAgc3RhcnQ6IHN0YXJ0LFxyXG4gICAgICBlbmQ6IGVuZCxcclxuICAgICAgKi9cclxuICAgICAgc3RhcnRMb29wOiBzdGFydExvb3AsXHJcbiAgICAgIGVuZExvb3A6IGVuZExvb3AsXHJcbiAgICAgIHNhbXBsZVJhdGU6IHNhbXBsZVJhdGUsXHJcbiAgICAgIG9yaWdpbmFsUGl0Y2g6IG9yaWdpbmFsUGl0Y2gsXHJcbiAgICAgIHBpdGNoQ29ycmVjdGlvbjogcGl0Y2hDb3JyZWN0aW9uLFxyXG4gICAgICBzYW1wbGVMaW5rOiBzYW1wbGVMaW5rLFxyXG4gICAgICBzYW1wbGVUeXBlOiBzYW1wbGVUeXBlXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG5QYXJzZXIucHJvdG90eXBlLmFkanVzdFNhbXBsZURhdGEgPSBmdW5jdGlvbihzYW1wbGUsIHNhbXBsZVJhdGUpIHtcclxuICAvKiogQHR5cGUge0ludDE2QXJyYXl9ICovXHJcbiAgdmFyIG5ld1NhbXBsZTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaWw7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGo7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIG11bHRpcGx5ID0gMTtcclxuXHJcbiAgLy8gYnVmZmVyXHJcbiAgd2hpbGUgKHNhbXBsZVJhdGUgPCAyMjA1MCkge1xyXG4gICAgbmV3U2FtcGxlID0gbmV3IEludDE2QXJyYXkoc2FtcGxlLmxlbmd0aCAqIDIpO1xyXG4gICAgZm9yIChpID0gaiA9IDAsIGlsID0gc2FtcGxlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgICAgbmV3U2FtcGxlW2orK10gPSBzYW1wbGVbaV07XHJcbiAgICAgIG5ld1NhbXBsZVtqKytdID0gc2FtcGxlW2ldO1xyXG4gICAgfVxyXG4gICAgc2FtcGxlID0gbmV3U2FtcGxlO1xyXG4gICAgbXVsdGlwbHkgKj0gMjtcclxuICAgIHNhbXBsZVJhdGUgKj0gMjtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzYW1wbGU6IHNhbXBsZSxcclxuICAgIG11bHRpcGx5OiBtdWx0aXBseVxyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VNb2R1bGF0b3IgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHNpemUgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBjb2RlO1xyXG4gIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xyXG4gIHZhciBrZXk7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgb3V0cHV0ID0gW107XHJcblxyXG4gIHdoaWxlIChpcCA8IHNpemUpIHtcclxuICAgIC8vIFNyYyAgT3BlclxyXG4gICAgLy8gVE9ET1xyXG4gICAgaXAgKz0gMjtcclxuXHJcbiAgICAvLyBEZXN0IE9wZXJcclxuICAgIGNvZGUgPSBkYXRhW2lwKytdIHwgKGRhdGFbaXArK10gPDwgOCk7XHJcbiAgICBrZXkgPSBQYXJzZXIuR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW2NvZGVdO1xyXG4gICAgaWYgKGtleSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIC8vIEFtb3VudFxyXG4gICAgICBvdXRwdXQucHVzaCh7XHJcbiAgICAgICAgdHlwZToga2V5LFxyXG4gICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICBjb2RlOiBjb2RlLFxyXG4gICAgICAgICAgYW1vdW50OiBkYXRhW2lwXSB8IChkYXRhW2lwKzFdIDw8IDgpIDw8IDE2ID4+IDE2LFxyXG4gICAgICAgICAgbG86IGRhdGFbaXArK10sXHJcbiAgICAgICAgICBoaTogZGF0YVtpcCsrXVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBBbW91bnRcclxuICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICBjYXNlICdrZXlSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsUmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICAgIGNhc2UgJ2tleW51bSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgICAgY2FzZSAndmVsb2NpdHknOlxyXG4gICAgICAgICAgb3V0cHV0LnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBrZXksXHJcbiAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgbG86IGRhdGFbaXArK10sXHJcbiAgICAgICAgICAgICAgaGk6IGRhdGFbaXArK11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgb3V0cHV0LnB1c2goe1xyXG4gICAgICAgICAgICB0eXBlOiBrZXksXHJcbiAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgYW1vdW50OiBkYXRhW2lwKytdIHwgKGRhdGFbaXArK10gPDwgOCkgPDwgMTYgPj4gMTZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFtdFNyY09wZXJcclxuICAgIC8vIFRPRE9cclxuICAgIGlwICs9IDI7XHJcblxyXG4gICAgLy8gVHJhbnMgT3BlclxyXG4gICAgLy8gVE9ET1xyXG4gICAgaXAgKz0gMjtcclxuICB9XHJcblxyXG4gIHJldHVybiBvdXRwdXQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtSaWZmLkNodW5rfSBjaHVua1xyXG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cclxuICovXHJcblBhcnNlci5wcm90b3R5cGUucGFyc2VHZW5lcmF0b3IgPSBmdW5jdGlvbihjaHVuaykge1xyXG4gIC8qKiBAdHlwZSB7Qnl0ZUFycmF5fSAqL1xyXG4gIHZhciBkYXRhID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSBjaHVuay5vZmZzZXQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHNpemUgPSBjaHVuay5vZmZzZXQgKyBjaHVuay5zaXplO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBjb2RlO1xyXG4gIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xyXG4gIHZhciBrZXk7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgb3V0cHV0ID0gW107XHJcblxyXG4gIHdoaWxlIChpcCA8IHNpemUpIHtcclxuICAgIGNvZGUgPSBkYXRhW2lwKytdIHwgKGRhdGFbaXArK10gPDwgOCk7XHJcbiAgICBrZXkgPSBQYXJzZXIuR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlW2NvZGVdO1xyXG4gICAgaWYgKGtleSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIG91dHB1dC5wdXNoKHtcclxuICAgICAgICB0eXBlOiBrZXksXHJcbiAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgIGNvZGU6IGNvZGUsXHJcbiAgICAgICAgICBhbW91bnQ6IGRhdGFbaXBdIHwgKGRhdGFbaXArMV0gPDwgOCkgPDwgMTYgPj4gMTYsXHJcbiAgICAgICAgICBsbzogZGF0YVtpcCsrXSxcclxuICAgICAgICAgIGhpOiBkYXRhW2lwKytdXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgY2FzZSAna2V5bnVtJzogLyogRkFMTFRIUk9VR0ggKi9cclxuICAgICAgY2FzZSAna2V5UmFuZ2UnOiAvKiBGQUxMVEhST1VHSCAqL1xyXG4gICAgICBjYXNlICd2ZWxSYW5nZSc6IC8qIEZBTExUSFJPVUdIICovXHJcbiAgICAgIGNhc2UgJ3ZlbG9jaXR5JzpcclxuICAgICAgICBvdXRwdXQucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiBrZXksXHJcbiAgICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgICBsbzogZGF0YVtpcCsrXSxcclxuICAgICAgICAgICAgaGk6IGRhdGFbaXArK11cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBvdXRwdXQucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiBrZXksXHJcbiAgICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgICBhbW91bnQ6IGRhdGFbaXArK10gfCAoZGF0YVtpcCsrXSA8PCA4KSA8PCAxNiA+PiAxNlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG91dHB1dDtcclxufTtcclxuXHJcblBhcnNlci5wcm90b3R5cGUuY3JlYXRlSW5zdHJ1bWVudCA9IGZ1bmN0aW9uKCkge1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdmFyIGluc3RydW1lbnQgPSB0aGlzLmluc3RydW1lbnQ7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgem9uZSA9IHRoaXMuaW5zdHJ1bWVudFpvbmU7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgb3V0cHV0ID0gW107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGJhZ0luZGV4O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBiYWdJbmRleEVuZDtcclxuICAvKiogQHR5cGUge0FycmF5LjxPYmplY3Q+fSAqL1xyXG4gIHZhciB6b25lSW5mbztcclxuICAvKiogQHR5cGUge3tnZW5lcmF0b3I6IE9iamVjdCwgZ2VuZXJhdG9ySW5mbzogQXJyYXkuPE9iamVjdD59fSAqL1xyXG4gIHZhciBpbnN0cnVtZW50R2VuZXJhdG9yO1xyXG4gIC8qKiBAdHlwZSB7e21vZHVsYXRvcjogT2JqZWN0LCBtb2R1bGF0b3JJbmZvOiBBcnJheS48T2JqZWN0Pn19ICovXHJcbiAgdmFyIGluc3RydW1lbnRNb2R1bGF0b3I7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGk7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGlsO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBqO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBqbDtcclxuXHJcbiAgLy8gaW5zdHJ1bWVudCAtPiBpbnN0cnVtZW50IGJhZyAtPiBnZW5lcmF0b3IgLyBtb2R1bGF0b3JcclxuICBmb3IgKGkgPSAwLCBpbCA9IGluc3RydW1lbnQubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgYmFnSW5kZXggICAgPSBpbnN0cnVtZW50W2ldLmluc3RydW1lbnRCYWdJbmRleDtcclxuICAgIGJhZ0luZGV4RW5kID0gaW5zdHJ1bWVudFtpKzFdID8gaW5zdHJ1bWVudFtpKzFdLmluc3RydW1lbnRCYWdJbmRleCA6IHpvbmUubGVuZ3RoO1xyXG4gICAgem9uZUluZm8gPSBbXTtcclxuXHJcbiAgICAvLyBpbnN0cnVtZW50IGJhZ1xyXG4gICAgZm9yIChqID0gYmFnSW5kZXgsIGpsID0gYmFnSW5kZXhFbmQ7IGogPCBqbDsgKytqKSB7XHJcbiAgICAgIGluc3RydW1lbnRHZW5lcmF0b3IgPSB0aGlzLmNyZWF0ZUluc3RydW1lbnRHZW5lcmF0b3JfKHpvbmUsIGopO1xyXG4gICAgICBpbnN0cnVtZW50TW9kdWxhdG9yID0gdGhpcy5jcmVhdGVJbnN0cnVtZW50TW9kdWxhdG9yXyh6b25lLCBqKTtcclxuXHJcbiAgICAgIHpvbmVJbmZvLnB1c2goe1xyXG4gICAgICAgIGdlbmVyYXRvcjogaW5zdHJ1bWVudEdlbmVyYXRvci5nZW5lcmF0b3IsXHJcbiAgICAgICAgZ2VuZXJhdG9yU2VxdWVuY2U6IGluc3RydW1lbnRHZW5lcmF0b3IuZ2VuZXJhdG9ySW5mbyxcclxuICAgICAgICBtb2R1bGF0b3I6IGluc3RydW1lbnRNb2R1bGF0b3IubW9kdWxhdG9yLFxyXG4gICAgICAgIG1vZHVsYXRvclNlcXVlbmNlOiBpbnN0cnVtZW50TW9kdWxhdG9yLm1vZHVsYXRvckluZm9cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0LnB1c2goe1xyXG4gICAgICBuYW1lOiBpbnN0cnVtZW50W2ldLmluc3RydW1lbnROYW1lLFxyXG4gICAgICBpbmZvOiB6b25lSW5mb1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3V0cHV0O1xyXG59O1xyXG5cclxuUGFyc2VyLnByb3RvdHlwZS5jcmVhdGVQcmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAvKiogQHR5cGUge0FycmF5LjxPYmplY3Q+fSAqL1xyXG4gIHZhciBwcmVzZXQgICA9IHRoaXMucHJlc2V0SGVhZGVyO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdmFyIHpvbmUgPSB0aGlzLnByZXNldFpvbmU7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn0gKi9cclxuICB2YXIgb3V0cHV0ID0gW107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGJhZ0luZGV4O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBiYWdJbmRleEVuZDtcclxuICAvKiogQHR5cGUge0FycmF5LjxPYmplY3Q+fSAqL1xyXG4gIHZhciB6b25lSW5mbztcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaW5zdHJ1bWVudDtcclxuICAvKiogQHR5cGUge3tnZW5lcmF0b3I6IE9iamVjdCwgZ2VuZXJhdG9ySW5mbzogQXJyYXkuPE9iamVjdD59fSAqL1xyXG4gIHZhciBwcmVzZXRHZW5lcmF0b3I7XHJcbiAgLyoqIEB0eXBlIHt7bW9kdWxhdG9yOiBPYmplY3QsIG1vZHVsYXRvckluZm86IEFycmF5LjxPYmplY3Q+fX0gKi9cclxuICB2YXIgcHJlc2V0TW9kdWxhdG9yO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpbDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgajtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgamw7XHJcblxyXG4gIC8vIHByZXNldCAtPiBwcmVzZXQgYmFnIC0+IGdlbmVyYXRvciAvIG1vZHVsYXRvclxyXG4gIGZvciAoaSA9IDAsIGlsID0gcHJlc2V0Lmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgIGJhZ0luZGV4ICAgID0gcHJlc2V0W2ldLnByZXNldEJhZ0luZGV4O1xyXG4gICAgYmFnSW5kZXhFbmQgPSBwcmVzZXRbaSsxXSA/IHByZXNldFtpKzFdLnByZXNldEJhZ0luZGV4IDogem9uZS5sZW5ndGg7XHJcbiAgICB6b25lSW5mbyA9IFtdO1xyXG5cclxuICAgIC8vIHByZXNldCBiYWdcclxuICAgIGZvciAoaiA9IGJhZ0luZGV4LCBqbCA9IGJhZ0luZGV4RW5kOyBqIDwgamw7ICsraikge1xyXG4gICAgICBwcmVzZXRHZW5lcmF0b3IgPSB0aGlzLmNyZWF0ZVByZXNldEdlbmVyYXRvcl8oem9uZSwgaik7XHJcbiAgICAgIHByZXNldE1vZHVsYXRvciA9IHRoaXMuY3JlYXRlUHJlc2V0TW9kdWxhdG9yXyh6b25lLCBqKTtcclxuXHJcbiAgICAgIHpvbmVJbmZvLnB1c2goe1xyXG4gICAgICAgIGdlbmVyYXRvcjogcHJlc2V0R2VuZXJhdG9yLmdlbmVyYXRvcixcclxuICAgICAgICBnZW5lcmF0b3JTZXF1ZW5jZTogcHJlc2V0R2VuZXJhdG9yLmdlbmVyYXRvckluZm8sXHJcbiAgICAgICAgbW9kdWxhdG9yOiBwcmVzZXRNb2R1bGF0b3IubW9kdWxhdG9yLFxyXG4gICAgICAgIG1vZHVsYXRvclNlcXVlbmNlOiBwcmVzZXRNb2R1bGF0b3IubW9kdWxhdG9ySW5mb1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGluc3RydW1lbnQgPVxyXG4gICAgICAgIHByZXNldEdlbmVyYXRvci5nZW5lcmF0b3JbJ2luc3RydW1lbnQnXSAhPT0gdm9pZCAwID9cclxuICAgICAgICAgIHByZXNldEdlbmVyYXRvci5nZW5lcmF0b3JbJ2luc3RydW1lbnQnXS5hbW91bnQgOlxyXG4gICAgICAgIHByZXNldE1vZHVsYXRvci5tb2R1bGF0b3JbJ2luc3RydW1lbnQnXSAhPT0gdm9pZCAwID9cclxuICAgICAgICAgIHByZXNldE1vZHVsYXRvci5tb2R1bGF0b3JbJ2luc3RydW1lbnQnXS5hbW91bnQgOlxyXG4gICAgICAgIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgb3V0cHV0LnB1c2goe1xyXG4gICAgICBuYW1lOiBwcmVzZXRbaV0ucHJlc2V0TmFtZSxcclxuICAgICAgaW5mbzogem9uZUluZm8sXHJcbiAgICAgIGhlYWRlcjogcHJlc2V0W2ldLFxyXG4gICAgICBpbnN0cnVtZW50OiBpbnN0cnVtZW50XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvdXRwdXQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gem9uZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICogQHJldHVybnMge3tnZW5lcmF0b3I6IE9iamVjdCwgZ2VuZXJhdG9ySW5mbzogQXJyYXkuPE9iamVjdD59fVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5jcmVhdGVJbnN0cnVtZW50R2VuZXJhdG9yXyA9IGZ1bmN0aW9uKHpvbmUsIGluZGV4KSB7XHJcbiAgdmFyIG1vZGdlbiA9IHRoaXMuY3JlYXRlQmFnTW9kR2VuXyhcclxuICAgIHpvbmUsXHJcbiAgICB6b25lW2luZGV4XS5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXgsXHJcbiAgICB6b25lW2luZGV4KzFdID8gem9uZVtpbmRleCsxXS5pbnN0cnVtZW50R2VuZXJhdG9ySW5kZXg6IHRoaXMuaW5zdHJ1bWVudFpvbmVHZW5lcmF0b3IubGVuZ3RoLFxyXG4gICAgdGhpcy5pbnN0cnVtZW50Wm9uZUdlbmVyYXRvclxyXG4gICk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBnZW5lcmF0b3I6IG1vZGdlbi5tb2RnZW4sXHJcbiAgICBnZW5lcmF0b3JJbmZvOiBtb2RnZW4ubW9kZ2VuSW5mb1xyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gem9uZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICogQHJldHVybnMge3ttb2R1bGF0b3I6IE9iamVjdCwgbW9kdWxhdG9ySW5mbzogQXJyYXkuPE9iamVjdD59fVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuUGFyc2VyLnByb3RvdHlwZS5jcmVhdGVJbnN0cnVtZW50TW9kdWxhdG9yXyA9IGZ1bmN0aW9uKHpvbmUsIGluZGV4KSB7XHJcbiAgdmFyIG1vZGdlbiA9IHRoaXMuY3JlYXRlQmFnTW9kR2VuXyhcclxuICAgIHpvbmUsXHJcbiAgICB6b25lW2luZGV4XS5wcmVzZXRNb2R1bGF0b3JJbmRleCxcclxuICAgIHpvbmVbaW5kZXgrMV0gPyB6b25lW2luZGV4KzFdLmluc3RydW1lbnRNb2R1bGF0b3JJbmRleDogdGhpcy5pbnN0cnVtZW50Wm9uZU1vZHVsYXRvci5sZW5ndGgsXHJcbiAgICB0aGlzLmluc3RydW1lbnRab25lTW9kdWxhdG9yXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1vZHVsYXRvcjogbW9kZ2VuLm1vZGdlbixcclxuICAgIG1vZHVsYXRvckluZm86IG1vZGdlbi5tb2RnZW5JbmZvXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSB6b25lXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxyXG4gKiBAcmV0dXJucyB7e2dlbmVyYXRvcjogT2JqZWN0LCBnZW5lcmF0b3JJbmZvOiBBcnJheS48T2JqZWN0Pn19XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5QYXJzZXIucHJvdG90eXBlLmNyZWF0ZVByZXNldEdlbmVyYXRvcl8gPSBmdW5jdGlvbih6b25lLCBpbmRleCkge1xyXG4gIHZhciBtb2RnZW4gPSB0aGlzLmNyZWF0ZUJhZ01vZEdlbl8oXHJcbiAgICB6b25lLFxyXG4gICAgem9uZVtpbmRleF0ucHJlc2V0R2VuZXJhdG9ySW5kZXgsXHJcbiAgICB6b25lW2luZGV4KzFdID8gem9uZVtpbmRleCsxXS5wcmVzZXRHZW5lcmF0b3JJbmRleCA6IHRoaXMucHJlc2V0Wm9uZUdlbmVyYXRvci5sZW5ndGgsXHJcbiAgICB0aGlzLnByZXNldFpvbmVHZW5lcmF0b3JcclxuICApO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZ2VuZXJhdG9yOiBtb2RnZW4ubW9kZ2VuLFxyXG4gICAgZ2VuZXJhdG9ySW5mbzogbW9kZ2VuLm1vZGdlbkluZm9cclxuICB9O1xyXG59O1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSB6b25lXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAgICogQHJldHVybnMge3ttb2R1bGF0b3I6IE9iamVjdCwgbW9kdWxhdG9ySW5mbzogQXJyYXkuPE9iamVjdD59fVxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcblBhcnNlci5wcm90b3R5cGUuY3JlYXRlUHJlc2V0TW9kdWxhdG9yXyA9IGZ1bmN0aW9uKHpvbmUsIGluZGV4KSB7XHJcbiAgLyoqIEB0eXBlIHt7bW9kZ2VuOiBPYmplY3QsIG1vZGdlbkluZm86IEFycmF5LjxPYmplY3Q+fX0gKi9cclxuICB2YXIgbW9kZ2VuID0gdGhpcy5jcmVhdGVCYWdNb2RHZW5fKFxyXG4gICAgem9uZSxcclxuICAgIHpvbmVbaW5kZXhdLnByZXNldE1vZHVsYXRvckluZGV4LFxyXG4gICAgem9uZVtpbmRleCsxXSA/IHpvbmVbaW5kZXgrMV0ucHJlc2V0TW9kdWxhdG9ySW5kZXggOiB0aGlzLnByZXNldFpvbmVNb2R1bGF0b3IubGVuZ3RoLFxyXG4gICAgdGhpcy5wcmVzZXRab25lTW9kdWxhdG9yXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1vZHVsYXRvcjogbW9kZ2VuLm1vZGdlbixcclxuICAgIG1vZHVsYXRvckluZm86IG1vZGdlbi5tb2RnZW5JbmZvXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSB6b25lXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFN0YXJ0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleEVuZFxyXG4gKiBAcGFyYW0gem9uZU1vZEdlblxyXG4gKiBAcmV0dXJucyB7e21vZGdlbjogT2JqZWN0LCBtb2RnZW5JbmZvOiBBcnJheS48T2JqZWN0Pn19XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5QYXJzZXIucHJvdG90eXBlLmNyZWF0ZUJhZ01vZEdlbl8gPSBmdW5jdGlvbih6b25lLCBpbmRleFN0YXJ0LCBpbmRleEVuZCwgem9uZU1vZEdlbikge1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59ICovXHJcbiAgdmFyIG1vZGdlbkluZm8gPSBbXTtcclxuICAvKiogQHR5cGUge09iamVjdH0gKi9cclxuICB2YXIgbW9kZ2VuID0ge1xyXG4gICAgdW5rbm93bjogW10sXHJcbiAgICAna2V5UmFuZ2UnOiB7XHJcbiAgICAgIGhpOiAxMjcsXHJcbiAgICAgIGxvOiAwXHJcbiAgICB9XHJcbiAgfTsgLy8gVE9ET1xyXG4gIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG4gIHZhciBpbmZvO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpbDtcclxuXHJcbiAgZm9yIChpID0gaW5kZXhTdGFydCwgaWwgPSBpbmRleEVuZDsgaSA8IGlsOyArK2kpIHtcclxuICAgIGluZm8gPSB6b25lTW9kR2VuW2ldO1xyXG4gICAgbW9kZ2VuSW5mby5wdXNoKGluZm8pO1xyXG5cclxuICAgIGlmIChpbmZvLnR5cGUgPT09ICd1bmtub3duJykge1xyXG4gICAgICBtb2RnZW4udW5rbm93bi5wdXNoKGluZm8udmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbW9kZ2VuW2luZm8udHlwZV0gPSBpbmZvLnZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG1vZGdlbjogbW9kZ2VuLFxyXG4gICAgbW9kZ2VuSW5mbzogbW9kZ2VuSW5mb1xyXG4gIH07XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cclxuICogQGNvbnN0XHJcbiAqL1xyXG5QYXJzZXIuR2VuZXJhdG9yRW51bWVyYXRvclRhYmxlID0gW1xyXG4gICdzdGFydEFkZHJzT2Zmc2V0JyxcclxuICAnZW5kQWRkcnNPZmZzZXQnLFxyXG4gICdzdGFydGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ2VuZGxvb3BBZGRyc09mZnNldCcsXHJcbiAgJ3N0YXJ0QWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1BpdGNoJyxcclxuICAndmliTGZvVG9QaXRjaCcsXHJcbiAgJ21vZEVudlRvUGl0Y2gnLFxyXG4gICdpbml0aWFsRmlsdGVyRmMnLFxyXG4gICdpbml0aWFsRmlsdGVyUScsXHJcbiAgJ21vZExmb1RvRmlsdGVyRmMnLFxyXG4gICdtb2RFbnZUb0ZpbHRlckZjJyxcclxuICAnZW5kQWRkcnNDb2Fyc2VPZmZzZXQnLFxyXG4gICdtb2RMZm9Ub1ZvbHVtZScsXHJcbiAgLCAvLyAxNFxyXG4gICdjaG9ydXNFZmZlY3RzU2VuZCcsXHJcbiAgJ3JldmVyYkVmZmVjdHNTZW5kJyxcclxuICAncGFuJyxcclxuICAsLCwgLy8gMTgsMTksMjBcclxuICAnZGVsYXlNb2RMRk8nLFxyXG4gICdmcmVxTW9kTEZPJyxcclxuICAnZGVsYXlWaWJMRk8nLFxyXG4gICdmcmVxVmliTEZPJyxcclxuICAnZGVsYXlNb2RFbnYnLFxyXG4gICdhdHRhY2tNb2RFbnYnLFxyXG4gICdob2xkTW9kRW52JyxcclxuICAnZGVjYXlNb2RFbnYnLFxyXG4gICdzdXN0YWluTW9kRW52JyxcclxuICAncmVsZWFzZU1vZEVudicsXHJcbiAgJ2tleW51bVRvTW9kRW52SG9sZCcsXHJcbiAgJ2tleW51bVRvTW9kRW52RGVjYXknLFxyXG4gICdkZWxheVZvbEVudicsXHJcbiAgJ2F0dGFja1ZvbEVudicsXHJcbiAgJ2hvbGRWb2xFbnYnLFxyXG4gICdkZWNheVZvbEVudicsXHJcbiAgJ3N1c3RhaW5Wb2xFbnYnLFxyXG4gICdyZWxlYXNlVm9sRW52JyxcclxuICAna2V5bnVtVG9Wb2xFbnZIb2xkJyxcclxuICAna2V5bnVtVG9Wb2xFbnZEZWNheScsXHJcbiAgJ2luc3RydW1lbnQnLFxyXG4gICwgLy8gNDJcclxuICAna2V5UmFuZ2UnLFxyXG4gICd2ZWxSYW5nZScsXHJcbiAgJ3N0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAna2V5bnVtJyxcclxuICAndmVsb2NpdHknLFxyXG4gICdpbml0aWFsQXR0ZW51YXRpb24nLFxyXG4gICwgLy8gNDlcclxuICAnZW5kbG9vcEFkZHJzQ29hcnNlT2Zmc2V0JyxcclxuICAnY29hcnNlVHVuZScsXHJcbiAgJ2ZpbmVUdW5lJyxcclxuICAnc2FtcGxlSUQnLFxyXG4gICdzYW1wbGVNb2RlcycsXHJcbiAgLCAvLyA1NVxyXG4gICdzY2FsZVR1bmluZycsXHJcbiAgJ2V4Y2x1c2l2ZUNsYXNzJyxcclxuICAnb3ZlcnJpZGluZ1Jvb3RLZXknXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQYXJzZXJcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2YyLmpzXG4gKiovIiwiY29uc3QgUmlmZiA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7Qnl0ZUFycmF5fSBpbnB1dCBpbnB1dCBidWZmZXIuXHJcbiAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3BhcmFtcyBvcHRpb24gcGFyYW1ldGVycy5cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5SaWZmLlBhcnNlciA9IGZ1bmN0aW9uKGlucHV0LCBvcHRfcGFyYW1zKSB7XHJcbiAgb3B0X3BhcmFtcyA9IG9wdF9wYXJhbXMgfHwge307XHJcbiAgLyoqIEB0eXBlIHtCeXRlQXJyYXl9ICovXHJcbiAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMuaXAgPSBvcHRfcGFyYW1zWydpbmRleCddIHx8IDA7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdGhpcy5sZW5ndGggPSBvcHRfcGFyYW1zWydsZW5ndGgnXSB8fCBpbnB1dC5sZW5ndGggLSB0aGlzLmlwO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPFJpZmYuQ2h1bms+fSAqL1xyXG4gIHRoaXMuY2h1bmtMaXN0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMub2Zmc2V0ID0gdGhpcy5pcDtcclxuICAvKiogQHR5cGUge2Jvb2xlYW59ICovXHJcbiAgdGhpcy5wYWRkaW5nID1cclxuICAgIG9wdF9wYXJhbXNbJ3BhZGRpbmcnXSAhPT0gdm9pZCAwID8gb3B0X3BhcmFtc1sncGFkZGluZyddIDogdHJ1ZTtcclxuICAvKiogQHR5cGUge2Jvb2xlYW59ICovXHJcbiAgdGhpcy5iaWdFbmRpYW4gPVxyXG4gICAgb3B0X3BhcmFtc1snYmlnRW5kaWFuJ10gIT09IHZvaWQgMCA/IG9wdF9wYXJhbXNbJ2JpZ0VuZGlhbiddIDogZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICogQHBhcmFtIHtudW1iZXJ9IHNpemVcclxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldFxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcblJpZmYuQ2h1bmsgPSBmdW5jdGlvbih0eXBlLCBzaXplLCBvZmZzZXQpIHtcclxuICAvKiogQHR5cGUge3N0cmluZ30gKi9cclxuICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcbn07XHJcblxyXG5SaWZmLlBhcnNlci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbigpIHtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggKyB0aGlzLm9mZnNldDtcclxuXHJcbiAgdGhpcy5jaHVua0xpc3QgPSBbXTtcclxuXHJcbiAgd2hpbGUgKHRoaXMuaXAgPCBsZW5ndGgpIHtcclxuICAgIHRoaXMucGFyc2VDaHVuaygpO1xyXG4gIH1cclxufTtcclxuXHJcblJpZmYuUGFyc2VyLnByb3RvdHlwZS5wYXJzZUNodW5rID0gZnVuY3Rpb24oKSB7XHJcbiAgLyoqIEB0eXBlIHtCeXRlQXJyYXl9ICovXHJcbiAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaXAgPSB0aGlzLmlwO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBzaXplO1xyXG5cclxuICB0aGlzLmNodW5rTGlzdC5wdXNoKG5ldyBSaWZmLkNodW5rKFxyXG4gICAgU3RyaW5nLmZyb21DaGFyQ29kZShpbnB1dFtpcCsrXSwgaW5wdXRbaXArK10sIGlucHV0W2lwKytdLCBpbnB1dFtpcCsrXSksXHJcbiAgICAoc2l6ZSA9IHRoaXMuYmlnRW5kaWFuID9cclxuICAgICAgICgoaW5wdXRbaXArK10gPDwgMjQpIHwgKGlucHV0W2lwKytdIDw8IDE2KSB8XHJcbiAgICAgICAgKGlucHV0W2lwKytdIDw8ICA4KSB8IChpbnB1dFtpcCsrXSAgICAgICkpID4+PiAwIDpcclxuICAgICAgICgoaW5wdXRbaXArK10gICAgICApIHwgKGlucHV0W2lwKytdIDw8ICA4KSB8XHJcbiAgICAgICAgKGlucHV0W2lwKytdIDw8IDE2KSB8IChpbnB1dFtpcCsrXSA8PCAyNCkpID4+PiAwXHJcbiAgICApLFxyXG4gICAgaXBcclxuICApKTtcclxuXHJcbiAgaXAgKz0gc2l6ZTtcclxuXHJcbiAgLy8gcGFkZGluZ1xyXG4gIGlmICh0aGlzLnBhZGRpbmcgJiYgKChpcCAtIHRoaXMub2Zmc2V0KSAmIDEpID09PSAxKSB7XHJcbiAgICBpcCsrO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5pcCA9IGlwO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBjaHVuayBpbmRleC5cclxuICogQHJldHVybiB7P1JpZmYuQ2h1bmt9XHJcbiAqL1xyXG5SaWZmLlBhcnNlci5wcm90b3R5cGUuZ2V0Q2h1bmsgPSBmdW5jdGlvbihpbmRleCkge1xyXG4gIC8qKiBAdHlwZSB7UmlmZi5DaHVua30gKi9cclxuICB2YXIgY2h1bmsgPSB0aGlzLmNodW5rTGlzdFtpbmRleF07XHJcblxyXG4gIGlmIChjaHVuayA9PT0gdm9pZCAwKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHJldHVybiBjaHVuaztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAqL1xyXG5SaWZmLlBhcnNlci5wcm90b3R5cGUuZ2V0TnVtYmVyT2ZDaHVua3MgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5jaHVua0xpc3QubGVuZ3RoO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSaWZmXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JpZmYuanNcbiAqKi8iLCJpbXBvcnQgU3ludGhlc2l6ZXIgZnJvbSBcIi4vc291bmRfZm9udF9zeW50aFwiXHJcblxyXG4vKipcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5jb25zdCBXZWJNaWRpTGluayA9IGZ1bmN0aW9uKCkge1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPG51bWJlcj59ICovXHJcbiAgdGhpcy5ScG5Nc2IgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48bnVtYmVyPn0gKi9cclxuICB0aGlzLlJwbkxzYiA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcclxuICAvKiogQHR5cGUge2Jvb2xlYW59ICovXHJcbiAgdGhpcy5yZWFkeTtcclxuICAvKiogQHR5cGUge1N5bnRoZXNpemVyfSAqL1xyXG4gIHRoaXMuc3ludGg7XHJcbiAgLyoqIEB0eXBlIHtmdW5jdGlvbihBcnJheUJ1ZmZlcil9ICovXHJcbiAgdGhpcy5sb2FkQ2FsbGJhY2s7XHJcbiAgLyoqIEB0eXBlIHtGdW5jdGlvbn0gKi9cclxuICB0aGlzLm1lc3NhZ2VIYW5kbGVyID0gdGhpcy5vbm1lc3NhZ2UuYmluZCh0aGlzKTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMucmVhZHkgPSB0cnVlO1xyXG4gIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xyXG59O1xyXG5cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLnNldHVwID0gZnVuY3Rpb24odXJsKSB7XHJcbiAgaWYgKCF0aGlzLnJlYWR5KSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uIG9ubG9hZCgpIHtcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBvbmxvYWQsIGZhbHNlKTtcclxuICAgICAgdGhpcy5sb2FkKHVybCk7XHJcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5sb2FkKHVybCk7XHJcbiAgfVxyXG59O1xyXG5cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbih1cmwpIHtcclxuICAvKiogQHR5cGUge1hNTEh0dHBSZXF1ZXN0fSAqL1xyXG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcbiAgeGhyLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XHJcblxyXG4gIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oZXYpIHtcclxuICAgIC8qKiBAdHlwZSB7WE1MSHR0cFJlcXVlc3R9ICovXHJcbiAgICB2YXIgeGhyID0gZXYudGFyZ2V0O1xyXG5cclxuICAgIHRoaXMub25sb2FkKHhoci5yZXNwb25zZSk7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMubG9hZENhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHRoaXMubG9hZENhbGxiYWNrKHhoci5yZXNwb25zZSk7XHJcbiAgICB9XHJcbiAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XHJcblxyXG4gIHhoci5zZW5kKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gcmVzcG9uc2VcclxuICovXHJcbldlYk1pZGlMaW5rLnByb3RvdHlwZS5vbmxvYWQgPSBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gIC8qKiBAdHlwZSB7VWludDhBcnJheX0gKi9cclxuICB2YXIgaW5wdXQgPSBuZXcgVWludDhBcnJheShyZXNwb25zZSk7XHJcblxyXG4gIHRoaXMubG9hZFNvdW5kRm9udChpbnB1dCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtVaW50OEFycmF5fSBpbnB1dFxyXG4gKi9cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLmxvYWRTb3VuZEZvbnQgPSBmdW5jdGlvbihpbnB1dCkge1xyXG4gIC8qKiBAdHlwZSB7U3ludGhlc2l6ZXJ9ICovXHJcbiAgdmFyIHN5bnRoO1xyXG5cclxuICBpZiAoIXRoaXMuc3ludGgpIHtcclxuICAgIHN5bnRoID0gdGhpcy5zeW50aCA9IG5ldyBTeW50aGVzaXplcihpbnB1dCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN5bnRoLmRyYXdTeW50aCgpKTtcclxuICAgIHN5bnRoLmluaXQoKTtcclxuICAgIHN5bnRoLnN0YXJ0KCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMubWVzc2FnZUhhbmRsZXIsIGZhbHNlKTtcclxuICB9IGVsc2Uge1xyXG4gICAgc3ludGggPSB0aGlzLnN5bnRoO1xyXG4gICAgc3ludGgucmVmcmVzaEluc3RydW1lbnRzKGlucHV0KTtcclxuICB9XHJcblxyXG4gIC8vIGxpbmsgcmVhZHlcclxuICBpZiAod2luZG93Lm9wZW5lcikge1xyXG4gICAgd2luZG93Lm9wZW5lci5wb3N0TWVzc2FnZShcImxpbmsscmVhZHlcIiwgJyonKTtcclxuICB9IGVsc2UgaWYgKHdpbmRvdy5wYXJlbnQgIT09IHdpbmRvdykge1xyXG4gICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZShcImxpbmsscmVhZHlcIiwgJyonKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtFdmVudH0gZXZcclxuICovXHJcbldlYk1pZGlMaW5rLnByb3RvdHlwZS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldikge1xyXG4gIHZhciBtc2cgPSBldi5kYXRhLnNwbGl0KCcsJyk7XHJcbiAgdmFyIHR5cGUgPSBtc2cuc2hpZnQoKTtcclxuICB2YXIgY29tbWFuZDtcclxuXHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlICdtaWRpJzpcclxuICAgICAgdGhpcy5wcm9jZXNzTWlkaU1lc3NhZ2UoXHJcbiAgICAgICAgbXNnLm1hcChmdW5jdGlvbihoZXgpIHtcclxuICAgICAgICAgIHJldHVybiBwYXJzZUludChoZXgsIDE2KTtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2xpbmsnOlxyXG4gICAgICBjb21tYW5kID0gbXNnLnNoaWZ0KCk7XHJcbiAgICAgIHN3aXRjaCAoY29tbWFuZCkge1xyXG4gICAgICAgIGNhc2UgJ3JlcXBhdGNoJzpcclxuICAgICAgICAgIC8vIFRPRE86IGR1bW15IGRhdGFcclxuICAgICAgICAgIGlmICh3aW5kb3cub3BlbmVyKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuZXIucG9zdE1lc3NhZ2UoXCJsaW5rLHBhdGNoXCIsICcqJyk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5wYXJlbnQgIT09IHdpbmRvdykge1xyXG4gICAgICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKFwibGluayxwYXRjaFwiLCAnKicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2V0cGF0Y2gnOlxyXG4gICAgICAgICAgLy8gVE9ETzogTk9QXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgY29uc29sZS5lcnJvcigndW5rbm93biBsaW5rIG1lc3NhZ2U6JywgY29tbWFuZCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ3Vua25vd24gbWVzc2FnZSB0eXBlJyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oQXJyYXlCdWZmZXIpfSBjYWxsYmFja1xyXG4gKi9cclxuV2ViTWlkaUxpbmsucHJvdG90eXBlLnNldExvYWRDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdGhpcy5sb2FkQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBtZXNzYWdlXHJcbiAqL1xyXG5XZWJNaWRpTGluay5wcm90b3R5cGUucHJvY2Vzc01pZGlNZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSkge1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBjaGFubmVsID0gbWVzc2FnZVswXSAmIDB4MGY7XHJcbiAgLyoqIEB0eXBlIHtTeW50aGVzaXplcn0gKi9cclxuICB2YXIgc3ludGggPSB0aGlzLnN5bnRoO1xyXG5cclxuICBzd2l0Y2ggKG1lc3NhZ2VbMF0gJiAweGYwKSB7XHJcbiAgICBjYXNlIDB4ODA6IC8vIE5vdGVPZmY6IDhuIGtrIHZ2XHJcbiAgICAgIHN5bnRoLm5vdGVPZmYoY2hhbm5lbCwgbWVzc2FnZVsxXSwgbWVzc2FnZVsyXSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAweDkwOiAvLyBOb3RlT246IDluIGtrIHZ2XHJcbiAgICAgIGlmIChtZXNzYWdlWzJdID4gMCkge1xyXG4gICAgICAgIHN5bnRoLm5vdGVPbihjaGFubmVsLCBtZXNzYWdlWzFdLCBtZXNzYWdlWzJdKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzeW50aC5ub3RlT2ZmKGNoYW5uZWwsIG1lc3NhZ2VbMV0sIDApO1xyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAweEIwOiAvLyBDb250cm9sIENoYW5nZTogQm4gY2MgZGRcclxuICAgICAgc3dpdGNoIChtZXNzYWdlWzFdKSB7XHJcbiAgICAgICAgY2FzZSAweDA2OiAvLyBEYXRhIEVudHJ5OiBCbiAwNiBkZFxyXG4gICAgICAgICAgc3dpdGNoICh0aGlzLlJwbk1zYltjaGFubmVsXSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLlJwbkxzYltjaGFubmVsXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiAvLyBQaXRjaCBCZW5kIFNlbnNpdGl2aXR5XHJcbiAgICAgICAgICAgICAgICAgIHN5bnRoLnBpdGNoQmVuZFNlbnNpdGl2aXR5KGNoYW5uZWwsIG1lc3NhZ2VbMl0pO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDB4MDc6IC8vIFZvbHVtZSBDaGFuZ2U6IEJuIDA3IGRkXHJcbiAgICAgICAgICBzeW50aC52b2x1bWVDaGFuZ2UoY2hhbm5lbCwgbWVzc2FnZVsyXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDB4MEE6IC8vIFBhbnBvdCBDaGFuZ2U6IEJuIDBBIGRkXHJcbiAgICAgICAgICBzeW50aC5wYW5wb3RDaGFuZ2UoY2hhbm5lbCwgbWVzc2FnZVsyXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDB4Nzg6IC8vIEFsbCBTb3VuZCBPZmY6IEJuIDc4IDAwXHJcbiAgICAgICAgICBzeW50aC5hbGxTb3VuZE9mZihjaGFubmVsKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMHg3OTogLy8gUmVzZXQgQWxsIENvbnRyb2w6IEJuIDc5IDAwXHJcbiAgICAgICAgICBzeW50aC5yZXNldEFsbENvbnRyb2woY2hhbm5lbCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDB4MjA6IC8vIEJhbmtTZWxlY3RcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJiYW5rc2VsZWN0OlwiLCBjaGFubmVsLCBtZXNzYWdlWzJdKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMHg2NDogLy8gUlBOIE1TQlxyXG4gICAgICAgICAgdGhpcy5ScG5Nc2JbY2hhbm5lbF0gPSBtZXNzYWdlWzJdO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAweDY1OiAvLyBSUE4gTFNCXHJcbiAgICAgICAgICB0aGlzLlJwbkxzYltjaGFubmVsXSA9IG1lc3NhZ2VbMl07XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWRcclxuICAgICAgfVxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgMHhDMDogLy8gUHJvZ3JhbSBDaGFuZ2U6IENuIHBwXHJcbiAgICAgIHN5bnRoLnByb2dyYW1DaGFuZ2UoY2hhbm5lbCwgbWVzc2FnZVsxXSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAweEUwOiAvLyBQaXRjaCBCZW5kXHJcbiAgICAgIHN5bnRoLnBpdGNoQmVuZChjaGFubmVsLCBtZXNzYWdlWzFdLCBtZXNzYWdlWzJdKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDB4ZjA6IC8vIFN5c3RlbSBFeGNsdXNpdmUgTWVzc2FnZVxyXG4gICAgICAvLyBJRCBudW1iZXJcclxuICAgICAgc3dpdGNoIChtZXNzYWdlWzFdKSB7XHJcbiAgICAgICAgY2FzZSAweDdlOiAvLyBub24tcmVhbHRpbWVcclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMHg3ZjogLy8gcmVhbHRpbWVcclxuICAgICAgICAgIHZhciBkZXZpY2UgPSBtZXNzYWdlWzJdO1xyXG4gICAgICAgICAgLy8gc3ViIElEIDFcclxuICAgICAgICAgIHN3aXRjaCAobWVzc2FnZVszXSkge1xyXG4gICAgICAgICAgICBjYXNlIDB4MDQ6IC8vIGRldmljZSBjb250cm9sXHJcbiAgICAgICAgICAgICAgLy8gc3ViIElEIDJcclxuICAgICAgICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VbNF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMHgwMTogLy8gbWFzdGVyIHZvbHVtZVxyXG4gICAgICAgICAgICAgICAgICBzeW50aC5zZXRNYXN0ZXJWb2x1bWUobWVzc2FnZVs1XSArIChtZXNzYWdlWzZdIDw8IDcpKTtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OiAvLyBub3Qgc3VwcG9ydGVkXHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdlYk1pZGlMaW5rXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3dtbC5qc1xuICoqLyIsImltcG9ydCBTeW50aGVzaXplck5vdGUgZnJvbSBcIi4vc291bmRfZm9udF9zeW50aF9ub3RlXCJcclxuaW1wb3J0IFBhcnNlciBmcm9tIFwiLi9zZjJcIlxyXG5cclxuLyoqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuY29uc3QgU3ludGhlc2l6ZXIgPSBmdW5jdGlvbihpbnB1dCkge1xyXG4gIC8qKiBAdHlwZSB7VWludDhBcnJheX0gKi9cclxuICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgLyoqIEB0eXBlIHtQYXJzZXJ9ICovXHJcbiAgdGhpcy5wYXJzZXI7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdGhpcy5iYW5rID0gMDtcclxuICAvKiogQHR5cGUge0FycmF5LjxBcnJheS48T2JqZWN0Pj59ICovXHJcbiAgdGhpcy5iYW5rU2V0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMuYnVmZmVyU2l6ZSA9IDEwMjQ7XHJcbiAgLyoqIEB0eXBlIHtBdWRpb0NvbnRleHR9ICovXHJcbiAgdGhpcy5jdHggPSB0aGlzLmdldEF1ZGlvQ29udGV4dCgpO1xyXG4gIC8qKiBAdHlwZSB7QXVkaW9HYWluTm9kZX0gKi9cclxuICB0aGlzLmdhaW5NYXN0ZXIgPSB0aGlzLmN0eC5jcmVhdGVHYWluTm9kZSgpO1xyXG4gIC8qKiBAdHlwZSB7RHluYW1pY3NDb21wcmVzc29yTm9kZX0gKi9cclxuICB0aGlzLmNvbXByZXNzb3IgPSB0aGlzLmN0eC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcclxuICAvKiogQHR5cGUge0F1ZGlvQnVmZmVyU291cmNlTm9kZX0gKi9cclxuICB0aGlzLmJ1ZlNyYyA9IHRoaXMuY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPG51bWJlcj59ICovXHJcbiAgdGhpcy5jaGFubmVsSW5zdHJ1bWVudCA9XHJcbiAgICBbMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgMCwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNV07XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48bnVtYmVyPn0gKi9cclxuICB0aGlzLmNoYW5uZWxWb2x1bWUgPVxyXG4gICAgWzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPG51bWJlcj59ICovXHJcbiAgdGhpcy5jaGFubmVsUGFucG90ID1cclxuICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcclxuICAvKiogQHR5cGUge0FycmF5LjxudW1iZXI+fSAqL1xyXG4gIHRoaXMuY2hhbm5lbFBpdGNoQmVuZCA9XHJcbiAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XHJcbiAgdGhpcy5jaGFubmVsUGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPVxyXG4gICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPEFycmF5LjxTeW50aGVzaXplck5vdGU+Pn0gKi9cclxuICB0aGlzLmN1cnJlbnROb3RlT24gPSBbXHJcbiAgICBbXSwgW10sIFtdLCBbXSwgW10sIFtdLCBbXSwgW10sXHJcbiAgICBbXSwgW10sIFtdLCBbXSwgW10sIFtdLCBbXSwgW11cclxuICBdO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMuYmFzZVZvbHVtZSA9IDEgLyAweDgwMDA7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdGhpcy5tYXN0ZXJWb2x1bWUgPSAxNjM4NDtcclxuXHJcbiAgLyoqIEB0eXBlIHtIVE1MVGFibGVFbGVtZW50fSAqL1xyXG4gIHRoaXMudGFibGU7XHJcbn07XHJcbi8qKlxyXG4gKiBAcmV0dXJucyB7QXVkaW9Db250ZXh0fVxyXG4gKi9cclxuU3ludGhlc2l6ZXIucHJvdG90eXBlLmdldEF1ZGlvQ29udGV4dCA9IGZ1bmN0aW9uKCkge1xyXG4gIC8qKiBAdHlwZSB7QXVkaW9Db250ZXh0fSAqL1xyXG4gIHZhciBjdHg7XHJcblxyXG4gIGlmIChBdWRpb0NvbnRleHQgIT09IHZvaWQgMCkge1xyXG4gICAgY3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG4gIH0gZWxzZSBpZiAod2Via2l0QXVkaW9Db250ZXh0ICE9PSB2b2lkIDApIHtcclxuICAgIGN0eCA9IG5ldyB3ZWJraXRBdWRpb0NvbnRleHQoKTtcclxuICB9IGVsc2UgaWYgKG1vekF1ZGlvQ29udGV4dCAhPT0gdm9pZCAwKSB7XHJcbiAgICBjdHggPSBuZXcgbW96QXVkaW9Db250ZXh0KCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignV2ViIEF1ZGlvIG5vdCBzdXBwb3J0ZWQnKTtcclxuICB9XHJcblxyXG4gIGlmIChjdHguY3JlYXRlR2Fpbk5vZGUgPT09IHZvaWQgMCkge1xyXG4gICAgY3R4LmNyZWF0ZUdhaW5Ob2RlID0gY3R4LmNyZWF0ZUdhaW47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY3R4O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cclxuICogQGNvbnN0XHJcbiAqL1xyXG5TeW50aGVzaXplci5Qcm9ncmFtTmFtZXMgPSBbXHJcbiAgXCJBY291c3RpYyBQaWFub1wiLFxyXG4gIFwiQnJpZ2h0IFBpYW5vXCIsXHJcbiAgXCJFbGVjdHJpYyBHcmFuZCBQaWFub1wiLFxyXG4gIFwiSG9ua3ktdG9uayBQaWFub1wiLFxyXG4gIFwiRWxlY3RyaWMgUGlhbm9cIixcclxuICBcIkVsZWN0cmljIFBpYW5vIDJcIixcclxuICBcIkhhcnBzaWNob3JkXCIsXHJcbiAgXCJDbGF2aVwiLFxyXG4gIFwiQ2VsZXN0YVwiLFxyXG4gIFwiR2xvY2tlbnNwaWVsXCIsXHJcbiAgXCJNdXNpY2FsIGJveFwiLFxyXG4gIFwiVmlicmFwaG9uZVwiLFxyXG4gIFwiTWFyaW1iYVwiLFxyXG4gIFwiWHlsb3Bob25lXCIsXHJcbiAgXCJUdWJ1bGFyIEJlbGxcIixcclxuICBcIkR1bGNpbWVyXCIsXHJcbiAgXCJEcmF3YmFyIE9yZ2FuXCIsXHJcbiAgXCJQZXJjdXNzaXZlIE9yZ2FuXCIsXHJcbiAgXCJSb2NrIE9yZ2FuXCIsXHJcbiAgXCJDaHVyY2ggb3JnYW5cIixcclxuICBcIlJlZWQgb3JnYW5cIixcclxuICBcIkFjY29yZGlvblwiLFxyXG4gIFwiSGFybW9uaWNhXCIsXHJcbiAgXCJUYW5nbyBBY2NvcmRpb25cIixcclxuICBcIkFjb3VzdGljIEd1aXRhciAobnlsb24pXCIsXHJcbiAgXCJBY291c3RpYyBHdWl0YXIgKHN0ZWVsKVwiLFxyXG4gIFwiRWxlY3RyaWMgR3VpdGFyIChqYXp6KVwiLFxyXG4gIFwiRWxlY3RyaWMgR3VpdGFyIChjbGVhbilcIixcclxuICBcIkVsZWN0cmljIEd1aXRhciAobXV0ZWQpXCIsXHJcbiAgXCJPdmVyZHJpdmVuIEd1aXRhclwiLFxyXG4gIFwiRGlzdG9ydGlvbiBHdWl0YXJcIixcclxuICBcIkd1aXRhciBoYXJtb25pY3NcIixcclxuICBcIkFjb3VzdGljIEJhc3NcIixcclxuICBcIkVsZWN0cmljIEJhc3MgKGZpbmdlcilcIixcclxuICBcIkVsZWN0cmljIEJhc3MgKHBpY2spXCIsXHJcbiAgXCJGcmV0bGVzcyBCYXNzXCIsXHJcbiAgXCJTbGFwIEJhc3MgMVwiLFxyXG4gIFwiU2xhcCBCYXNzIDJcIixcclxuICBcIlN5bnRoIEJhc3MgMVwiLFxyXG4gIFwiU3ludGggQmFzcyAyXCIsXHJcbiAgXCJWaW9saW5cIixcclxuICBcIlZpb2xhXCIsXHJcbiAgXCJDZWxsb1wiLFxyXG4gIFwiRG91YmxlIGJhc3NcIixcclxuICBcIlRyZW1vbG8gU3RyaW5nc1wiLFxyXG4gIFwiUGl6emljYXRvIFN0cmluZ3NcIixcclxuICBcIk9yY2hlc3RyYWwgSGFycFwiLFxyXG4gIFwiVGltcGFuaVwiLFxyXG4gIFwiU3RyaW5nIEVuc2VtYmxlIDFcIixcclxuICBcIlN0cmluZyBFbnNlbWJsZSAyXCIsXHJcbiAgXCJTeW50aCBTdHJpbmdzIDFcIixcclxuICBcIlN5bnRoIFN0cmluZ3MgMlwiLFxyXG4gIFwiVm9pY2UgQWFoc1wiLFxyXG4gIFwiVm9pY2UgT29oc1wiLFxyXG4gIFwiU3ludGggVm9pY2VcIixcclxuICBcIk9yY2hlc3RyYSBIaXRcIixcclxuICBcIlRydW1wZXRcIixcclxuICBcIlRyb21ib25lXCIsXHJcbiAgXCJUdWJhXCIsXHJcbiAgXCJNdXRlZCBUcnVtcGV0XCIsXHJcbiAgXCJGcmVuY2ggaG9yblwiLFxyXG4gIFwiQnJhc3MgU2VjdGlvblwiLFxyXG4gIFwiU3ludGggQnJhc3MgMVwiLFxyXG4gIFwiU3ludGggQnJhc3MgMlwiLFxyXG4gIFwiU29wcmFubyBTYXhcIixcclxuICBcIkFsdG8gU2F4XCIsXHJcbiAgXCJUZW5vciBTYXhcIixcclxuICBcIkJhcml0b25lIFNheFwiLFxyXG4gIFwiT2JvZVwiLFxyXG4gIFwiRW5nbGlzaCBIb3JuXCIsXHJcbiAgXCJCYXNzb29uXCIsXHJcbiAgXCJDbGFyaW5ldFwiLFxyXG4gIFwiUGljY29sb1wiLFxyXG4gIFwiRmx1dGVcIixcclxuICBcIlJlY29yZGVyXCIsXHJcbiAgXCJQYW4gRmx1dGVcIixcclxuICBcIkJsb3duIEJvdHRsZVwiLFxyXG4gIFwiU2hha3VoYWNoaVwiLFxyXG4gIFwiV2hpc3RsZVwiLFxyXG4gIFwiT2NhcmluYVwiLFxyXG4gIFwiTGVhZCAxIChzcXVhcmUpXCIsXHJcbiAgXCJMZWFkIDIgKHNhd3Rvb3RoKVwiLFxyXG4gIFwiTGVhZCAzIChjYWxsaW9wZSlcIixcclxuICBcIkxlYWQgNCAoY2hpZmYpXCIsXHJcbiAgXCJMZWFkIDUgKGNoYXJhbmcpXCIsXHJcbiAgXCJMZWFkIDYgKHZvaWNlKVwiLFxyXG4gIFwiTGVhZCA3IChmaWZ0aHMpXCIsXHJcbiAgXCJMZWFkIDggKGJhc3MgKyBsZWFkKVwiLFxyXG4gIFwiUGFkIDEgKEZhbnRhc2lhKVwiLFxyXG4gIFwiUGFkIDIgKHdhcm0pXCIsXHJcbiAgXCJQYWQgMyAocG9seXN5bnRoKVwiLFxyXG4gIFwiUGFkIDQgKGNob2lyKVwiLFxyXG4gIFwiUGFkIDUgKGJvd2VkKVwiLFxyXG4gIFwiUGFkIDYgKG1ldGFsbGljKVwiLFxyXG4gIFwiUGFkIDcgKGhhbG8pXCIsXHJcbiAgXCJQYWQgOCAoc3dlZXApXCIsXHJcbiAgXCJGWCAxIChyYWluKVwiLFxyXG4gIFwiRlggMiAoc291bmR0cmFjaylcIixcclxuICBcIkZYIDMgKGNyeXN0YWwpXCIsXHJcbiAgXCJGWCA0IChhdG1vc3BoZXJlKVwiLFxyXG4gIFwiRlggNSAoYnJpZ2h0bmVzcylcIixcclxuICBcIkZYIDYgKGdvYmxpbnMpXCIsXHJcbiAgXCJGWCA3IChlY2hvZXMpXCIsXHJcbiAgXCJGWCA4IChzY2ktZmkpXCIsXHJcbiAgXCJTaXRhclwiLFxyXG4gIFwiQmFuam9cIixcclxuICBcIlNoYW1pc2VuXCIsXHJcbiAgXCJLb3RvXCIsXHJcbiAgXCJLYWxpbWJhXCIsXHJcbiAgXCJCYWdwaXBlXCIsXHJcbiAgXCJGaWRkbGVcIixcclxuICBcIlNoYW5haVwiLFxyXG4gIFwiVGlua2xlIEJlbGxcIixcclxuICBcIkFnb2dvXCIsXHJcbiAgXCJTdGVlbCBEcnVtc1wiLFxyXG4gIFwiV29vZGJsb2NrXCIsXHJcbiAgXCJUYWlrbyBEcnVtXCIsXHJcbiAgXCJNZWxvZGljIFRvbVwiLFxyXG4gIFwiU3ludGggRHJ1bVwiLFxyXG4gIFwiUmV2ZXJzZSBDeW1iYWxcIixcclxuICBcIkd1aXRhciBGcmV0IE5vaXNlXCIsXHJcbiAgXCJCcmVhdGggTm9pc2VcIixcclxuICBcIlNlYXNob3JlXCIsXHJcbiAgXCJCaXJkIFR3ZWV0XCIsXHJcbiAgXCJUZWxlcGhvbmUgUmluZ1wiLFxyXG4gIFwiSGVsaWNvcHRlclwiLFxyXG4gIFwiQXBwbGF1c2VcIixcclxuICBcIkd1bnNob3RcIlxyXG5dO1xyXG5cclxuU3ludGhlc2l6ZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaTtcclxuXHJcbiAgdGhpcy5wYXJzZXIgPSBuZXcgUGFyc2VyKHRoaXMuaW5wdXQpO1xyXG4gIHRoaXMuYmFua1NldCA9IHRoaXMuY3JlYXRlQWxsSW5zdHJ1bWVudHMoKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IDE2OyArK2kpIHtcclxuICAgIHRoaXMucHJvZ3JhbUNoYW5nZShpLCBpKTtcclxuICAgIHRoaXMudm9sdW1lQ2hhbmdlKGksIDB4NjQpO1xyXG4gICAgdGhpcy5wYW5wb3RDaGFuZ2UoaSwgMHg0MCk7XHJcbiAgICB0aGlzLnBpdGNoQmVuZChpLCAweDAwLCAweDQwKTsgLy8gODE5MlxyXG4gICAgdGhpcy5waXRjaEJlbmRTZW5zaXRpdml0eShpLCAyKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtVaW50OEFycmF5fSBpbnB1dFxyXG4gKi9cclxuU3ludGhlc2l6ZXIucHJvdG90eXBlLnJlZnJlc2hJbnN0cnVtZW50cyA9IGZ1bmN0aW9uKGlucHV0KSB7XHJcbiAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gIHRoaXMucGFyc2VyID0gbmV3IFBhcnNlcihpbnB1dCk7XHJcbiAgdGhpcy5iYW5rU2V0ID0gdGhpcy5jcmVhdGVBbGxJbnN0cnVtZW50cygpO1xyXG59O1xyXG5cclxuU3ludGhlc2l6ZXIucHJvdG90eXBlLmNyZWF0ZUFsbEluc3RydW1lbnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgLyoqIEB0eXBlIHtQYXJzZXJ9ICovXHJcbiAgdmFyIHBhcnNlciA9IHRoaXMucGFyc2VyO1xyXG4gIHBhcnNlci5wYXJzZSgpO1xyXG4gIC8qKiBAdHlwZSB7QXJyYXl9IFRPRE8gKi9cclxuICB2YXIgcHJlc2V0cyA9IHBhcnNlci5jcmVhdGVQcmVzZXQoKTtcclxuICAvKiogQHR5cGUge0FycmF5fSBUT0RPICovXHJcbiAgdmFyIGluc3RydW1lbnRzID0gcGFyc2VyLmNyZWF0ZUluc3RydW1lbnQoKTtcclxuICAvKiogQHR5cGUge09iamVjdH0gKi9cclxuICB2YXIgYmFua3MgPSBbXTtcclxuICAvKiogQHR5cGUge0FycmF5LjxBcnJheS48T2JqZWN0Pj59ICovXHJcbiAgdmFyIGJhbms7XHJcbiAgLyoqIEB0eXBlIHtPYmplY3R9IFRPRE8gKi9cclxuICB2YXIgcHJlc2V0O1xyXG4gIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG4gIHZhciBpbnN0cnVtZW50O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBwcmVzZXROdW1iZXI7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGk7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIGlsO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBqO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBqbDtcclxuXHJcbiAgZm9yIChpID0gMCwgaWwgPSBwcmVzZXRzLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgIHByZXNldCA9IHByZXNldHNbaV07XHJcbiAgICBwcmVzZXROdW1iZXIgPSBwcmVzZXQuaGVhZGVyLnByZXNldDtcclxuXHJcbiAgICBpZiAodHlwZW9mIHByZXNldC5pbnN0cnVtZW50ICE9PSAnbnVtYmVyJykge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBpbnN0cnVtZW50ID0gaW5zdHJ1bWVudHNbcHJlc2V0Lmluc3RydW1lbnRdO1xyXG4gICAgaWYgKGluc3RydW1lbnQubmFtZS5yZXBsYWNlKC9cXDAqJC8sICcnKSA9PT0gJ0VPSScpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2VsZWN0IGJhbmtcclxuICAgIGlmIChiYW5rc1twcmVzZXQuaGVhZGVyLmJhbmtdID09PSB2b2lkIDApIHtcclxuICAgICAgYmFua3NbcHJlc2V0LmhlYWRlci5iYW5rXSA9IFtdO1xyXG4gICAgfVxyXG4gICAgYmFuayA9IGJhbmtzW3ByZXNldC5oZWFkZXIuYmFua107XHJcbiAgICBiYW5rW3ByZXNldE51bWJlcl0gPSBbXTtcclxuICAgIGJhbmtbcHJlc2V0TnVtYmVyXS5uYW1lID0gcHJlc2V0Lm5hbWU7XHJcblxyXG4gICAgZm9yIChqID0gMCwgamwgPSBpbnN0cnVtZW50LmluZm8ubGVuZ3RoOyBqIDwgamw7ICsraikge1xyXG4gICAgICB0aGlzLmNyZWF0ZU5vdGVJbmZvKHBhcnNlciwgaW5zdHJ1bWVudC5pbmZvW2pdLCBiYW5rW3ByZXNldE51bWJlcl0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGJhbmtzO1xyXG59O1xyXG5cclxuU3ludGhlc2l6ZXIucHJvdG90eXBlLmNyZWF0ZU5vdGVJbmZvID0gZnVuY3Rpb24ocGFyc2VyLCBpbmZvLCBwcmVzZXQpIHtcclxuICB2YXIgZ2VuZXJhdG9yID0gaW5mby5nZW5lcmF0b3I7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHNhbXBsZUlkO1xyXG4gIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG4gIHZhciBzYW1wbGVIZWFkZXI7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHZvbEF0dGFjaztcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgdm9sRGVjYXk7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHZvbFN1c3RhaW47XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHZvbFJlbGVhc2U7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIG1vZEF0dGFjaztcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgbW9kRGVjYXk7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIG1vZFN1c3RhaW47XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIG1vZFJlbGVhc2U7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHR1bmU7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHNjYWxlO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBmcmVxVmliTEZPO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpbDtcclxuXHJcbiAgaWYgKGdlbmVyYXRvclsna2V5UmFuZ2UnXSA9PT0gdm9pZCAwIHx8IGdlbmVyYXRvclsnc2FtcGxlSUQnXSA9PT0gdm9pZCAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB2b2xBdHRhY2sgID0gdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnYXR0YWNrVm9sRW52JywgIC0xMjAwMCk7XHJcbiAgdm9sRGVjYXkgICA9IHRoaXMuZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2RlY2F5Vm9sRW52JywgICAtMTIwMDApO1xyXG4gIHZvbFN1c3RhaW4gPSB0aGlzLmdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzdXN0YWluVm9sRW52Jyk7XHJcbiAgdm9sUmVsZWFzZSA9IHRoaXMuZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3JlbGVhc2VWb2xFbnYnLCAtMTIwMDApO1xyXG4gIG1vZEF0dGFjayAgPSB0aGlzLmdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdhdHRhY2tNb2RFbnYnLCAgLTEyMDAwKTtcclxuICBtb2REZWNheSAgID0gdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZGVjYXlNb2RFbnYnLCAgIC0xMjAwMCk7XHJcbiAgbW9kU3VzdGFpbiA9IHRoaXMuZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3N1c3RhaW5Nb2RFbnYnKTtcclxuICBtb2RSZWxlYXNlID0gdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAncmVsZWFzZU1vZEVudicsIC0xMjAwMCk7XHJcblxyXG4gIHR1bmUgPSAoXHJcbiAgICB0aGlzLmdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdjb2Fyc2VUdW5lJykgK1xyXG4gICAgdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZmluZVR1bmUnKSAvIDEwMFxyXG4gICk7XHJcbiAgc2NhbGUgPSB0aGlzLmdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzY2FsZVR1bmluZycsIDEwMCkgLyAxMDA7XHJcbiAgZnJlcVZpYkxGTyA9IHRoaXMuZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2ZyZXFWaWJMRk8nKTtcclxuXHJcbiAgZm9yIChpID0gZ2VuZXJhdG9yWydrZXlSYW5nZSddLmxvLCBpbCA9IGdlbmVyYXRvclsna2V5UmFuZ2UnXS5oaTsgaSA8PSBpbDsgKytpKSAge1xyXG4gICAgaWYgKHByZXNldFtpXSkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBzYW1wbGVJZCA9IHRoaXMuZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3NhbXBsZUlEJyk7XHJcbiAgICBzYW1wbGVIZWFkZXIgPSBwYXJzZXIuc2FtcGxlSGVhZGVyW3NhbXBsZUlkXTtcclxuICAgIHByZXNldFtpXSA9IHtcclxuICAgICAgJ3NhbXBsZSc6IHBhcnNlci5zYW1wbGVbc2FtcGxlSWRdLFxyXG4gICAgICAnc2FtcGxlUmF0ZSc6IHNhbXBsZUhlYWRlci5zYW1wbGVSYXRlLFxyXG4gICAgICAnYmFzZVBsYXliYWNrUmF0ZSc6IE1hdGgucG93KFxyXG4gICAgICAgIE1hdGgucG93KDIsIDEvMTIpLFxyXG4gICAgICAgIChcclxuICAgICAgICAgIGkgLVxyXG4gICAgICAgICAgdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnb3ZlcnJpZGluZ1Jvb3RLZXknLCBzYW1wbGVIZWFkZXIub3JpZ2luYWxQaXRjaCkgK1xyXG4gICAgICAgICAgdHVuZSArIChzYW1wbGVIZWFkZXIucGl0Y2hDb3JyZWN0aW9uIC8gMTAwKVxyXG4gICAgICAgICkgKiBzY2FsZVxyXG4gICAgICApLFxyXG4gICAgICAnbW9kRW52VG9QaXRjaCc6IHRoaXMuZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ21vZEVudlRvUGl0Y2gnKSAvIDEwMCxcclxuICAgICAgJ3NjYWxlVHVuaW5nJzogc2NhbGUsXHJcbiAgICAgICdzdGFydCc6XHJcbiAgICAgICAgdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnc3RhcnRBZGRyc0NvYXJzZU9mZnNldCcpICogMzI3NjggK1xyXG4gICAgICAgICAgdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnc3RhcnRBZGRyc09mZnNldCcpLFxyXG4gICAgICAnZW5kJzpcclxuICAgICAgICB0aGlzLmdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdlbmRBZGRyc0NvYXJzZU9mZnNldCcpICogMzI3NjggK1xyXG4gICAgICAgICAgdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZW5kQWRkcnNPZmZzZXQnKSxcclxuICAgICAgJ2xvb3BTdGFydCc6IChcclxuICAgICAgICAvLyhzYW1wbGVIZWFkZXIuc3RhcnRMb29wIC0gc2FtcGxlSGVhZGVyLnN0YXJ0KSArXHJcbiAgICAgICAgKHNhbXBsZUhlYWRlci5zdGFydExvb3ApICtcclxuICAgICAgICAgIHRoaXMuZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ3N0YXJ0bG9vcEFkZHJzQ29hcnNlT2Zmc2V0JykgKiAzMjc2OCArXHJcbiAgICAgICAgICB0aGlzLmdldE1vZEdlbkFtb3VudChnZW5lcmF0b3IsICdzdGFydGxvb3BBZGRyc09mZnNldCcpXHJcbiAgICAgICAgKSxcclxuICAgICAgJ2xvb3BFbmQnOiAoXHJcbiAgICAgICAgLy8oc2FtcGxlSGVhZGVyLmVuZExvb3AgLSBzYW1wbGVIZWFkZXIuc3RhcnQpICtcclxuICAgICAgICAoc2FtcGxlSGVhZGVyLmVuZExvb3ApICtcclxuICAgICAgICAgIHRoaXMuZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ2VuZGxvb3BBZGRyc0NvYXJzZU9mZnNldCcpICogMzI3NjggK1xyXG4gICAgICAgICAgdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnZW5kbG9vcEFkZHJzT2Zmc2V0JylcclxuICAgICAgICApLFxyXG4gICAgICAndm9sQXR0YWNrJzogIE1hdGgucG93KDIsIHZvbEF0dGFjayAvIDEyMDApLFxyXG4gICAgICAndm9sRGVjYXknOiAgIE1hdGgucG93KDIsIHZvbERlY2F5IC8gMTIwMCksXHJcbiAgICAgICd2b2xTdXN0YWluJzogdm9sU3VzdGFpbiAvIDEwMDAsXHJcbiAgICAgICd2b2xSZWxlYXNlJzogTWF0aC5wb3coMiwgdm9sUmVsZWFzZSAvIDEyMDApLFxyXG4gICAgICAnbW9kQXR0YWNrJzogIE1hdGgucG93KDIsIG1vZEF0dGFjayAvIDEyMDApLFxyXG4gICAgICAnbW9kRGVjYXknOiAgIE1hdGgucG93KDIsIG1vZERlY2F5IC8gMTIwMCksXHJcbiAgICAgICdtb2RTdXN0YWluJzogbW9kU3VzdGFpbiAvIDEwMDAsXHJcbiAgICAgICdtb2RSZWxlYXNlJzogTWF0aC5wb3coMiwgbW9kUmVsZWFzZSAvIDEyMDApLFxyXG4gICAgICAnaW5pdGlhbEZpbHRlckZjJzogdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnaW5pdGlhbEZpbHRlckZjJywgMTM1MDApLFxyXG4gICAgICAnbW9kRW52VG9GaWx0ZXJGYyc6IHRoaXMuZ2V0TW9kR2VuQW1vdW50KGdlbmVyYXRvciwgJ21vZEVudlRvRmlsdGVyRmMnKSxcclxuICAgICAgJ2luaXRpYWxGaWx0ZXJRJzogdGhpcy5nZXRNb2RHZW5BbW91bnQoZ2VuZXJhdG9yLCAnaW5pdGlhbEZpbHRlclEnKSxcclxuICAgICAgJ2ZyZXFWaWJMRk8nOiBmcmVxVmliTEZPID8gTWF0aC5wb3coMiwgZnJlcVZpYkxGTyAvIDEyMDApICogOC4xNzYgOiB2b2lkIDBcclxuICAgIH07XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBnZW5lcmF0b3JcclxuICogQHBhcmFtIHtzdHJpbmd9IGVudW1lcmF0b3JUeXBlXHJcbiAqIEBwYXJhbSB7bnVtYmVyPX0gb3B0X2RlZmF1bHRcclxuICogQHJldHVybnMge251bWJlcn1cclxuICovXHJcblN5bnRoZXNpemVyLnByb3RvdHlwZS5nZXRNb2RHZW5BbW91bnQgPSBmdW5jdGlvbihnZW5lcmF0b3IsIGVudW1lcmF0b3JUeXBlLCBvcHRfZGVmYXVsdCkge1xyXG4gIGlmIChvcHRfZGVmYXVsdCA9PT0gdm9pZCAwKSB7XHJcbiAgICBvcHRfZGVmYXVsdCA9IDA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ2VuZXJhdG9yW2VudW1lcmF0b3JUeXBlXSA/IGdlbmVyYXRvcltlbnVtZXJhdG9yVHlwZV0uYW1vdW50IDogb3B0X2RlZmF1bHQ7XHJcbn07XHJcblxyXG5TeW50aGVzaXplci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLmJ1ZlNyYy5jb25uZWN0KHRoaXMuZ2Fpbk1hc3Rlcik7XHJcbiAgdGhpcy5nYWluTWFzdGVyLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xyXG4gIHRoaXMuYnVmU3JjLnN0YXJ0KDApO1xyXG5cclxuICB0aGlzLnNldE1hc3RlclZvbHVtZSgxNjM4Myk7XHJcbn07XHJcblxyXG5TeW50aGVzaXplci5wcm90b3R5cGUuc2V0TWFzdGVyVm9sdW1lID0gZnVuY3Rpb24odm9sdW1lKSB7XHJcbiAgdGhpcy5tYXN0ZXJWb2x1bWUgPSB2b2x1bWU7XHJcbiAgdGhpcy5nYWluTWFzdGVyLmdhaW4udmFsdWUgPSB0aGlzLmJhc2VWb2x1bWUgKiAodm9sdW1lIC8gMTYzODQpO1xyXG59O1xyXG5cclxuU3ludGhlc2l6ZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLmJ1ZlNyYy5kaXNjb25uZWN0KDApO1xyXG4gIHRoaXMuZ2Fpbk1hc3Rlci5kaXNjb25uZWN0KDApO1xyXG4gIHRoaXMuY29tcHJlc3Nvci5kaXNjb25uZWN0KDApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHshQXJyYXkuPHN0cmluZz59XHJcbiAqIEBjb25zdFxyXG4gKi9cclxuU3ludGhlc2l6ZXIuVGFibGVIZWFkZXIgPSBbJ0luc3RydW1lbnQnLCAnVm9sJywgJ1BhbicsICdCZW5kJywgJ1JhbmdlJ107XHJcblxyXG5TeW50aGVzaXplci5wcm90b3R5cGUuZHJhd1N5bnRoID0gZnVuY3Rpb24oKSB7XHJcbiAgLyoqIEB0eXBlIHtIVE1MVGFibGVFbGVtZW50fSAqL1xyXG4gIHZhciB0YWJsZSA9IHRoaXMudGFibGUgPVxyXG4gICAgLyoqIEB0eXBlIHtIVE1MVGFibGVFbGVtZW50fSAqLyhkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpKTtcclxuICAvKiogQHR5cGUge0hUTUxUYWJsZVNlY3Rpb25FbGVtZW50fSAqL1xyXG4gIHZhciBoZWFkID1cclxuICAgIC8qKiBAdHlwZSB7SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnR9ICovKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoZWFkJykpO1xyXG4gIC8qKiBAdHlwZSB7SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnR9ICovXHJcbiAgdmFyIGJvZHkgPVxyXG4gICAgLyoqIEB0eXBlIHtIVE1MVGFibGVTZWN0aW9uRWxlbWVudH0gKi9cclxuICAgIChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0Ym9keScpKTtcclxuICAvKiogQHR5cGUge0hUTUxUYWJsZVJvd0VsZW1lbnR9ICovXHJcbiAgdmFyIHRhYmxlTGluZTtcclxuICAvKiogQHR5cGUge05vZGVMaXN0fSAqL1xyXG4gIHZhciBub3RlcztcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgajtcclxuXHJcbiAgaGVhZC5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVRhYmxlTGluZShTeW50aGVzaXplci5UYWJsZUhlYWRlciwgdHJ1ZSkpO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgMTY7ICsraSkge1xyXG4gICAgdGFibGVMaW5lID0gdGhpcy5jcmVhdGVUYWJsZUxpbmUoU3ludGhlc2l6ZXIuVGFibGVIZWFkZXIubGVuZ3RoICsgMTI4LCBmYWxzZSk7XHJcbiAgICBib2R5LmFwcGVuZENoaWxkKHRhYmxlTGluZSk7XHJcblxyXG4gICAgaWYgKGkgIT09IDkpIHtcclxuICAgICAgdmFyIHNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xyXG4gICAgICB2YXIgb3B0aW9uO1xyXG4gICAgICBmb3IgKGogPSAwOyBqIDwgMTI4OyArK2opIHtcclxuICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBTeW50aGVzaXplci5Qcm9ncmFtTmFtZXNbal07XHJcbiAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgIH1cclxuICAgICAgdGFibGVMaW5lLnF1ZXJ5U2VsZWN0b3IoJ3RkOm50aC1jaGlsZCgxKScpLmFwcGVuZENoaWxkKHNlbGVjdCk7XHJcbiAgICAgIHNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZnVuY3Rpb24oc3ludGgsIGNoYW5uZWwpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgIHN5bnRoLnByb2dyYW1DaGFuZ2UoY2hhbm5lbCwgZXZlbnQudGFyZ2V0LnNlbGVjdGVkSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkodGhpcywgaSksIGZhbHNlKTtcclxuICAgICAgc2VsZWN0LnNlbGVjdGVkSW5kZXggPSB0aGlzLmNoYW5uZWxJbnN0cnVtZW50W2ldO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGFibGVMaW5lLnF1ZXJ5U2VsZWN0b3IoJ3RkOmZpcnN0LWNoaWxkJykudGV4dENvbnRlbnQgPSAnWyBSSFlUSE0gVFJBQ0sgXSc7XHJcbiAgICB9XHJcblxyXG4gICAgbm90ZXMgPSB0YWJsZUxpbmUucXVlcnlTZWxlY3RvckFsbCgndGQ6bnRoLWxhc3QtY2hpbGQoLW4rMTI4KScpO1xyXG4gICAgZm9yIChqID0gMDsgaiA8IDEyODsgKytqKSB7XHJcbiAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChmdW5jdGlvbihzeW50aCwgY2hhbm5lbCwga2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgc3ludGguZHJhZyA9IHRydWU7XHJcbiAgICAgICAgICBzeW50aC5ub3RlT24oY2hhbm5lbCwga2V5LCAxMjcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkodGhpcywgaSwgaikpO1xyXG4gICAgICBub3Rlc1tqXS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZnVuY3Rpb24oc3ludGgsIGNoYW5uZWwsIGtleSkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGlmIChzeW50aC5kcmFnKSB7XHJcbiAgICAgICAgICAgIHN5bnRoLm5vdGVPbihjaGFubmVsLCBrZXksIDEyNyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KSh0aGlzLCBpLCBqKSk7XHJcbiAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKGZ1bmN0aW9uKHN5bnRoLCBjaGFubmVsLCBrZXkpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBzeW50aC5ub3RlT2ZmKGNoYW5uZWwsIGtleSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KSh0aGlzLCBpLCBqKSk7XHJcbiAgICAgIG5vdGVzW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZnVuY3Rpb24oc3ludGgsIGNoYW5uZWwsIGtleSkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIHN5bnRoLmRyYWcgPSBmYWxzZTtcclxuICAgICAgICAgIHN5bnRoLm5vdGVPZmYoY2hhbm5lbCwga2V5LCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pKHRoaXMsIGksIGopKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRhYmxlLmFwcGVuZENoaWxkKGhlYWQpO1xyXG4gIHRhYmxlLmFwcGVuZENoaWxkKGJvZHkpO1xyXG5cclxuICByZXR1cm4gdGFibGU7XHJcbn07XHJcblxyXG5TeW50aGVzaXplci5wcm90b3R5cGUucmVtb3ZlU3ludGggPSBmdW5jdGlvbigpIHtcclxuICB2YXIgdGFibGUgPSB0aGlzLnRhYmxlO1xyXG5cclxuICBpZiAodGFibGUpIHtcclxuICAgIHRhYmxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFibGUpO1xyXG4gICAgdGhpcy50YWJsZSA9IG51bGw7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7IShBcnJheS48c3RyaW5nPnxudW1iZXIpfSBhcnJheVxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzVGl0bGVMaW5lXHJcbiAqIEByZXR1cm5zIHtIVE1MVGFibGVSb3dFbGVtZW50fVxyXG4gKi9cclxuU3ludGhlc2l6ZXIucHJvdG90eXBlLmNyZWF0ZVRhYmxlTGluZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1RpdGxlTGluZSkge1xyXG4gIC8qKiBAdHlwZSB7SFRNTFRhYmxlUm93RWxlbWVudH0gKi9cclxuICB2YXIgdHIgPSAvKiogQHR5cGUge0hUTUxUYWJsZVJvd0VsZW1lbnR9ICovKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJykpO1xyXG4gIC8qKiBAdHlwZSB7SFRNTFRhYmxlQ2VsbEVsZW1lbnR9ICovXHJcbiAgdmFyIGNlbGw7XHJcbiAgLyoqIEB0eXBlIHtib29sZWFufSAqL1xyXG4gIHZhciBpc0FycmF5ID0gYXJyYXkgaW5zdGFuY2VvZiBBcnJheTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaWwgPSBpc0FycmF5ID8gYXJyYXkubGVuZ3RoIDogLyoqIEB0eXBlIHtudW1iZXJ9ICovKGFycmF5KTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGlsOyArK2kpIHtcclxuICAgIGNlbGwgPVxyXG4gICAgICAvKiogQHR5cGUge0hUTUxUYWJsZUNlbGxFbGVtZW50fSAqL1xyXG4gICAgICAoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpc1RpdGxlTGluZSA/ICd0aCcgOiAndGQnKSk7XHJcbiAgICBjZWxsLnRleHRDb250ZW50ID0gKGlzQXJyYXkgJiYgYXJyYXlbaV0gIT09IHZvaWQgMCkgPyBhcnJheVtpXSA6ICcnO1xyXG4gICAgdHIuYXBwZW5kQ2hpbGQoY2VsbCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHI7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFubmVsIE5vdGVPbiDjgZnjgovjg4Hjg6Pjg7Pjg43jg6suXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBrZXkgTm90ZU9uIOOBmeOCi+OCreODvC5cclxuICogQHBhcmFtIHtudW1iZXJ9IHZlbG9jaXR5IOW8t+OBlS5cclxuICovXHJcblN5bnRoZXNpemVyLnByb3RvdHlwZS5ub3RlT24gPSBmdW5jdGlvbihjaGFubmVsLCBrZXksIHZlbG9jaXR5KSB7XHJcbiAgLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbiAgdmFyIGJhbmsgPSB0aGlzLmJhbmtTZXRbY2hhbm5lbCA9PT0gOSA/IDEyOCA6IHRoaXMuYmFua107XHJcbiAgLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbiAgdmFyIGluc3RydW1lbnQgPSBiYW5rW3RoaXMuY2hhbm5lbEluc3RydW1lbnRbY2hhbm5lbF1dO1xyXG4gIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG4gIHZhciBpbnN0cnVtZW50S2V5O1xyXG4gIC8qKiBAdHlwZSB7U3ludGhlc2l6ZXJOb3RlfSAqL1xyXG4gIHZhciBub3RlO1xyXG5cclxuICBpZiAodGhpcy50YWJsZSkge1xyXG4gICAgdGhpcy50YWJsZS5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAndGJvZHkgPiAnICtcclxuICAgICAgICAndHI6bnRoLWNoaWxkKCcgKyAoY2hhbm5lbCsxKSArICcpID4gJyArXHJcbiAgICAgICAgJ3RkOm50aC1jaGlsZCgnICsgKFN5bnRoZXNpemVyLlRhYmxlSGVhZGVyLmxlbmd0aCtrZXkrMSkgKyAnKSdcclxuICAgICkuY2xhc3NMaXN0LmFkZCgnbm90ZS1vbicpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFpbnN0cnVtZW50KSB7XHJcbiAgICAvLyBUT0RPXHJcbiAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgIFwiaW5zdHJ1bWVudCBub3QgZm91bmQ6IGJhbms9JXMgaW5zdHJ1bWVudD0lcyBjaGFubmVsPSVzXCIsXHJcbiAgICAgIGNoYW5uZWwgPT09IDkgPyAxMjggOiB0aGlzLmJhbmssXHJcbiAgICAgIHRoaXMuY2hhbm5lbEluc3RydW1lbnRbY2hhbm5lbF0sXHJcbiAgICAgIGNoYW5uZWxcclxuICAgICk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBpbnN0cnVtZW50S2V5ID0gaW5zdHJ1bWVudFtrZXldO1xyXG5cclxuICBpZiAoIShpbnN0cnVtZW50S2V5KSkge1xyXG4gICAgLy8gVE9ET1xyXG4gICAgY29uc29sZS53YXJuKFxyXG4gICAgICBcImluc3RydW1lbnQgbm90IGZvdW5kOiBiYW5rPSVzIGluc3RydW1lbnQ9JXMgY2hhbm5lbD0lcyBrZXk9JXNcIixcclxuICAgICAgY2hhbm5lbCA9PT0gOSA/IDEyOCA6IHRoaXMuYmFuayxcclxuICAgICAgdGhpcy5jaGFubmVsSW5zdHJ1bWVudFtjaGFubmVsXSxcclxuICAgICAgY2hhbm5lbCxcclxuICAgICAga2V5XHJcbiAgICApO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdmFyIHBhbnBvdCA9IHRoaXMuY2hhbm5lbFBhbnBvdFtjaGFubmVsXSAtIDY0O1xyXG4gIHBhbnBvdCAvPSBwYW5wb3QgPCAwID8gNjQgOiA2MztcclxuXHJcbiAgLy8gY3JlYXRlIG5vdGUgaW5mb3JtYXRpb25cclxuICBpbnN0cnVtZW50S2V5WydjaGFubmVsJ10gPSBjaGFubmVsO1xyXG4gIGluc3RydW1lbnRLZXlbJ2tleSddID0ga2V5O1xyXG4gIGluc3RydW1lbnRLZXlbJ3ZlbG9jaXR5J10gPSB2ZWxvY2l0eTtcclxuICBpbnN0cnVtZW50S2V5WydwYW5wb3QnXSA9IHBhbnBvdDtcclxuICBpbnN0cnVtZW50S2V5Wyd2b2x1bWUnXSA9IHRoaXMuY2hhbm5lbFZvbHVtZVtjaGFubmVsXSAvIDEyNztcclxuICBpbnN0cnVtZW50S2V5WydwaXRjaEJlbmQnXSA9IHRoaXMuY2hhbm5lbFBpdGNoQmVuZFtjaGFubmVsXSAtIDgxOTI7XHJcbiAgaW5zdHJ1bWVudEtleVsncGl0Y2hCZW5kU2Vuc2l0aXZpdHknXSA9IHRoaXMuY2hhbm5lbFBpdGNoQmVuZFNlbnNpdGl2aXR5W2NoYW5uZWxdO1xyXG5cclxuICAvLyBub3RlIG9uXHJcbiAgbm90ZSA9IG5ldyBTeW50aGVzaXplck5vdGUodGhpcy5jdHgsIHRoaXMuZ2Fpbk1hc3RlciwgaW5zdHJ1bWVudEtleSk7XHJcbiAgbm90ZS5ub3RlT24oKTtcclxuICB0aGlzLmN1cnJlbnROb3RlT25bY2hhbm5lbF0ucHVzaChub3RlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbm5lbCBOb3RlT2ZmIOOBmeOCi+ODgeODo+ODs+ODjeODqy5cclxuICogQHBhcmFtIHtudW1iZXJ9IGtleSBOb3RlT2ZmIOOBmeOCi+OCreODvC5cclxuICogQHBhcmFtIHtudW1iZXJ9IHZlbG9jaXR5IOW8t+OBlS5cclxuICovXHJcblN5bnRoZXNpemVyLnByb3RvdHlwZS5ub3RlT2ZmID0gZnVuY3Rpb24oY2hhbm5lbCwga2V5LCB2ZWxvY2l0eSkge1xyXG4gIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG4gIHZhciBiYW5rID0gdGhpcy5iYW5rU2V0W2NoYW5uZWwgPT09IDkgPyAxMjggOiB0aGlzLmJhbmtdO1xyXG4gIC8qKiBAdHlwZSB7T2JqZWN0fSAqL1xyXG4gIHZhciBpbnN0cnVtZW50ID0gYmFua1t0aGlzLmNoYW5uZWxJbnN0cnVtZW50W2NoYW5uZWxdXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgaWw7XHJcbiAgLyoqIEB0eXBlIHtBcnJheS48U3ludGhlc2l6ZXJOb3RlPn0gKi9cclxuICB2YXIgY3VycmVudE5vdGVPbiA9IHRoaXMuY3VycmVudE5vdGVPbltjaGFubmVsXTtcclxuICAvKiogQHR5cGUge1N5bnRoZXNpemVyTm90ZX0gKi9cclxuICB2YXIgbm90ZTtcclxuXHJcbiAgaWYgKHRoaXMudGFibGUpIHtcclxuICAgIHRoaXMudGFibGUucXVlcnlTZWxlY3RvcihcclxuICAgICAgJ3Rib2R5ID4gJyArXHJcbiAgICAgICd0cjpudGgtY2hpbGQoJyArIChjaGFubmVsKzEpICsgJykgPiAnICtcclxuICAgICAgJ3RkOm50aC1jaGlsZCgnICsgKGtleStTeW50aGVzaXplci5UYWJsZUhlYWRlci5sZW5ndGgrMSkgKyAnKSdcclxuICAgICkuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZS1vbicpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFpbnN0cnVtZW50KSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBmb3IgKGkgPSAwLCBpbCA9IGN1cnJlbnROb3RlT24ubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xyXG4gICAgbm90ZSA9IGN1cnJlbnROb3RlT25baV07XHJcbiAgICBpZiAobm90ZS5rZXkgPT09IGtleSkge1xyXG4gICAgICBub3RlLm5vdGVPZmYoKTtcclxuICAgICAgY3VycmVudE5vdGVPbi5zcGxpY2UoaSwgMSk7XHJcbiAgICAgIC0taTtcclxuICAgICAgLS1pbDtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5uZWwg6Z+z6Imy44KS5aSJ5pu044GZ44KL44OB44Oj44Oz44ON44OrLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gaW5zdHJ1bWVudCDpn7PoibLnlarlj7cuXHJcbiAqL1xyXG5TeW50aGVzaXplci5wcm90b3R5cGUucHJvZ3JhbUNoYW5nZSA9IGZ1bmN0aW9uKGNoYW5uZWwsIGluc3RydW1lbnQpIHtcclxuICBpZiAodGhpcy50YWJsZSkge1xyXG4gICAgaWYgKGNoYW5uZWwgIT09IDkpIHtcclxuICAgICAgdGhpcy50YWJsZS5xdWVyeVNlbGVjdG9yKCd0Ym9keSA+IHRyOm50aC1jaGlsZCgnICsgKGNoYW5uZWwrMSkgKyAnKSA+IHRkOmZpcnN0LWNoaWxkID4gc2VsZWN0Jykuc2VsZWN0ZWRJbmRleCA9IGluc3RydW1lbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIOODquOCuuODoOODiOODqeODg+OCr+OBr+eEoeimluOBmeOCi1xyXG4gIGlmIChjaGFubmVsID09PSA5KSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB0aGlzLmNoYW5uZWxJbnN0cnVtZW50W2NoYW5uZWxdID0gaW5zdHJ1bWVudDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbm5lbCDpn7Pph4/jgpLlpInmm7TjgZnjgovjg4Hjg6Pjg7Pjg43jg6suXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2b2x1bWUg6Z+z6YePKDAtMTI3KS5cclxuICovXHJcblN5bnRoZXNpemVyLnByb3RvdHlwZS52b2x1bWVDaGFuZ2UgPSBmdW5jdGlvbihjaGFubmVsLCB2b2x1bWUpIHtcclxuICBpZiAodGhpcy50YWJsZSkge1xyXG4gICAgdGhpcy50YWJsZS5xdWVyeVNlbGVjdG9yKCd0Ym9keSA+IHRyOm50aC1jaGlsZCgnICsgKGNoYW5uZWwrMSkgKyAnKSA+IHRkOm50aC1jaGlsZCgyKScpLnRleHRDb250ZW50ID0gdm9sdW1lO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5jaGFubmVsVm9sdW1lW2NoYW5uZWxdID0gdm9sdW1lO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFubmVsIHBhbnBvdCDjgpLlpInmm7TjgZnjgovjg4Hjg6Pjg7Pjg43jg6suXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYW5wb3QgcGFucG90KDAtMTI3KS5cclxuICovXHJcblN5bnRoZXNpemVyLnByb3RvdHlwZS5wYW5wb3RDaGFuZ2UgPSBmdW5jdGlvbihjaGFubmVsLCBwYW5wb3QpIHtcclxuICBpZiAodGhpcy50YWJsZSkge1xyXG4gICAgdGhpcy50YWJsZS5xdWVyeVNlbGVjdG9yKCd0Ym9keSA+IHRyOm50aC1jaGlsZCgnICsgKGNoYW5uZWwrMSkgKyAnKSA+IHRkOm50aC1jaGlsZCgzKScpLnRleHRDb250ZW50ID0gcGFucG90O1xyXG4gIH1cclxuXHJcbiAgdGhpcy5jaGFubmVsUGFucG90W2NoYW5uZWxdID0gcGFucG90O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFubmVsIHBhbnBvdCDjgpLlpInmm7TjgZnjgovjg4Hjg6Pjg7Pjg43jg6suXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb3dlckJ5dGVcclxuICogQHBhcmFtIHtudW1iZXJ9IGhpZ2hlckJ5dGVcclxuICovXHJcblN5bnRoZXNpemVyLnByb3RvdHlwZS5waXRjaEJlbmQgPSBmdW5jdGlvbihjaGFubmVsLCBsb3dlckJ5dGUsIGhpZ2hlckJ5dGUpIHtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgYmVuZCA9IChsb3dlckJ5dGUgJiAweDdmKSB8ICgoaGlnaGVyQnl0ZSAmIDB4N2YpIDw8IDcpO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBpbDtcclxuICAvKiogQHR5cGUge0FycmF5LjxTeW50aGVzaXplck5vdGU+fSAqL1xyXG4gIHZhciBjdXJyZW50Tm90ZU9uID0gdGhpcy5jdXJyZW50Tm90ZU9uW2NoYW5uZWxdO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBjYWxjdWxhdGVkID0gYmVuZCAtIDgxOTI7XHJcblxyXG4gIGlmICh0aGlzLnRhYmxlKSB7XHJcbiAgICB0aGlzLnRhYmxlLnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5ID4gdHI6bnRoLWNoaWxkKCcgKyAoY2hhbm5lbCsxKSArICcpID4gdGQ6bnRoLWNoaWxkKDQpJykudGV4dENvbnRlbnQgPSBjYWxjdWxhdGVkO1xyXG4gIH1cclxuXHJcbiAgZm9yIChpID0gMCwgaWwgPSBjdXJyZW50Tm90ZU9uLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcclxuICAgIGN1cnJlbnROb3RlT25baV0udXBkYXRlUGl0Y2hCZW5kKGNhbGN1bGF0ZWQpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5jaGFubmVsUGl0Y2hCZW5kW2NoYW5uZWxdID0gYmVuZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbm5lbCBwaXRjaCBiZW5kIHNlbnNpdGl2aXR5IOOCkuWkieabtOOBmeOCi+ODgeODo+ODs+ODjeODqy5cclxuICogQHBhcmFtIHtudW1iZXJ9IHNlbnNpdGl2aXR5XHJcbiAqL1xyXG5TeW50aGVzaXplci5wcm90b3R5cGUucGl0Y2hCZW5kU2Vuc2l0aXZpdHkgPSBmdW5jdGlvbihjaGFubmVsLCBzZW5zaXRpdml0eSkge1xyXG4gIGlmICh0aGlzLnRhYmxlKSB7XHJcbiAgICB0aGlzLnRhYmxlLnF1ZXJ5U2VsZWN0b3IoJ3Rib2R5ID4gdHI6bnRoLWNoaWxkKCcgKyAoY2hhbm5lbCsxKSArICcpID4gdGQ6bnRoLWNoaWxkKDUpJykudGV4dENvbnRlbnQgPSBzZW5zaXRpdml0eTtcclxuICB9XHJcblxyXG4gIHRoaXMuY2hhbm5lbFBpdGNoQmVuZFNlbnNpdGl2aXR5W2NoYW5uZWxdID0gc2Vuc2l0aXZpdHk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5uZWwg6Z+z44KS5raI44GZ44OB44Oj44Oz44ON44OrLlxyXG4gKi9cclxuU3ludGhlc2l6ZXIucHJvdG90eXBlLmFsbFNvdW5kT2ZmID0gZnVuY3Rpb24oY2hhbm5lbCkge1xyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPFN5bnRoZXNpemVyTm90ZT59ICovXHJcbiAgdmFyIGN1cnJlbnROb3RlT24gPSB0aGlzLmN1cnJlbnROb3RlT25bY2hhbm5lbF07XHJcblxyXG4gIHdoaWxlIChjdXJyZW50Tm90ZU9uLmxlbmd0aCA+IDApIHtcclxuICAgIHRoaXMubm90ZU9mZihjaGFubmVsLCBjdXJyZW50Tm90ZU9uWzBdLmtleSwgMCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFubmVsIOODquOCu+ODg+ODiOOBmeOCi+ODgeODo+ODs+ODjeODq1xyXG4gKi9cclxuU3ludGhlc2l6ZXIucHJvdG90eXBlLnJlc2V0QWxsQ29udHJvbCA9IGZ1bmN0aW9uKGNoYW5uZWwpIHtcclxuICB0aGlzLnBpdGNoQmVuZChjaGFubmVsLCAweDAwLCAweDQwKTsgLy8gODE5MlxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3ludGhlc2l6ZXJcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc291bmRfZm9udF9zeW50aC5qc1xuICoqLyIsIi8qKlxyXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY3R4XHJcbiAqIEBwYXJhbSB7QXVkaW9Ob2RlfSBkZXN0aW5hdGlvblxyXG4gKiBAcGFyYW0ge3tcclxuICogICBjaGFubmVsOiBudW1iZXIsXHJcbiAqICAga2V5OiBudW1iZXIsXHJcbiAqICAgc2FtcGxlOiBVaW50OEFycmF5LFxyXG4gKiAgIGJhc2VQbGF5YmFja1JhdGU6IG51bWJlcixcclxuICogICBsb29wU3RhcnQ6IG51bWJlcixcclxuICogICBsb29wRW5kOiBudW1iZXIsXHJcbiAqICAgdm9sdW1lOiBudW1iZXIsXHJcbiAqICAgcGFucG90OiBudW1iZXJcclxuICogfX0gaW5zdHJ1bWVudFxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmNvbnN0IFN5bnRoZXNpemVyTm90ZSA9IGZ1bmN0aW9uKGN0eCwgZGVzdGluYXRpb24sIGluc3RydW1lbnQpIHtcclxuICAvKiogQHR5cGUge0F1ZGlvQ29udGV4dH0gKi9cclxuICB0aGlzLmN0eCA9IGN0eDtcclxuICAvKiogQHR5cGUge0F1ZGlvTm9kZX0gKi9cclxuICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XHJcbiAgLyoqIEB0eXBlIHt7XHJcbiAgICogICBjaGFubmVsOiBudW1iZXIsXHJcbiAgICogICBrZXk6IG51bWJlcixcclxuICAgKiAgIHNhbXBsZTogVWludDhBcnJheSxcclxuICAgKiAgIGJhc2VQbGF5YmFja1JhdGU6IG51bWJlcixcclxuICAgKiAgIGxvb3BTdGFydDogbnVtYmVyLFxyXG4gICAqICAgbG9vcEVuZDogbnVtYmVyLFxyXG4gICAqICAgdm9sdW1lOiBudW1iZXIsXHJcbiAgICogICBwYW5wb3Q6IG51bWJlclxyXG4gICAqIH19XHJcbiAgICovXHJcbiAgdGhpcy5pbnN0cnVtZW50ID0gaW5zdHJ1bWVudDtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB0aGlzLmNoYW5uZWwgPSBpbnN0cnVtZW50WydjaGFubmVsJ107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdGhpcy5rZXkgPSBpbnN0cnVtZW50WydrZXknXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB0aGlzLnZlbG9jaXR5ID0gaW5zdHJ1bWVudFsndmVsb2NpdHknXTtcclxuICAvKiogQHR5cGUge0ludDE2QXJyYXl9ICovXHJcbiAgdGhpcy5idWZmZXIgPSBpbnN0cnVtZW50WydzYW1wbGUnXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB0aGlzLnBsYXliYWNrUmF0ZSA9IGluc3RydW1lbnRbJ2Jhc2VQbGF5YmFja1JhdGUnXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB0aGlzLnNhbXBsZVJhdGUgPSBpbnN0cnVtZW50WydzYW1wbGVSYXRlJ107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdGhpcy52b2x1bWUgPSBpbnN0cnVtZW50Wyd2b2x1bWUnXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB0aGlzLnBhbnBvdCA9IGluc3RydW1lbnRbJ3BhbnBvdCddO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMucGl0Y2hCZW5kID0gaW5zdHJ1bWVudFsncGl0Y2hCZW5kJ107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdGhpcy5waXRjaEJlbmRTZW5zaXRpdml0eSA9IGluc3RydW1lbnRbJ3BpdGNoQmVuZFNlbnNpdGl2aXR5J107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdGhpcy5tb2RFbnZUb1BpdGNoID0gaW5zdHJ1bWVudFsnbW9kRW52VG9QaXRjaCddO1xyXG5cclxuICAvLyBzdGF0ZVxyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMuc3RhcnRUaW1lID0gY3R4LmN1cnJlbnRUaW1lO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUgPSB0aGlzLnBsYXliYWNrUmF0ZTtcclxuXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAvLyBhdWRpbyBub2RlXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqIEB0eXBlIHtBdWRpb0J1ZmZlcn0gKi9cclxuICB0aGlzLmF1ZGlvQnVmZmVyO1xyXG4gIC8qKiBAdHlwZSB7QXVkaW9CdWZmZXJTb3VyY2VOb2RlfSAqL1xyXG4gIHRoaXMuYnVmZmVyU291cmNlO1xyXG4gIC8qKiBAdHlwZSB7QXVkaW9QYW5uZXJOb2RlfSAqL1xyXG4gIHRoaXMucGFubmVyO1xyXG4gIC8qKiBAdHlwZSB7QXVkaW9HYWluTm9kZX0gKi9cclxuICB0aGlzLmdhaW5PdXRwdXQ7XHJcblxyXG4gIC8vY29uc29sZS5sb2coaW5zdHJ1bWVudFsnbW9kQXR0YWNrJ10sIGluc3RydW1lbnRbJ21vZERlY2F5J10sIGluc3RydW1lbnRbJ21vZFN1c3RhaW4nXSwgaW5zdHJ1bWVudFsnbW9kUmVsZWFzZSddKTtcclxufTtcclxuXHJcblN5bnRoZXNpemVyTm90ZS5wcm90b3R5cGUubm90ZU9uID0gZnVuY3Rpb24oKSB7XHJcbiAgLyoqIEB0eXBlIHtBdWRpb0NvbnRleHR9ICovXHJcbiAgdmFyIGN0eCA9IHRoaXMuY3R4O1xyXG4gIC8qKiBAdHlwZSB7e1xyXG4gICAqICAgY2hhbm5lbDogbnVtYmVyLFxyXG4gICAqICAga2V5OiBudW1iZXIsXHJcbiAgICogICBzYW1wbGU6IFVpbnQ4QXJyYXksXHJcbiAgICogICBiYXNlUGxheWJhY2tSYXRlOiBudW1iZXIsXHJcbiAgICogICBsb29wU3RhcnQ6IG51bWJlcixcclxuICAgKiAgIGxvb3BFbmQ6IG51bWJlcixcclxuICAgKiAgIHZvbHVtZTogbnVtYmVyLFxyXG4gICAqICAgcGFucG90OiBudW1iZXJcclxuICAgKiB9fSAqL1xyXG4gIHZhciBpbnN0cnVtZW50ID0gdGhpcy5pbnN0cnVtZW50O1xyXG4gIC8qKiBAdHlwZSB7SW50MTZBcnJheX0gKi9cclxuICB2YXIgc2FtcGxlID0gdGhpcy5idWZmZXI7XHJcbiAgLyoqIEB0eXBlIHtBdWRpb0J1ZmZlcn0gKi9cclxuICB2YXIgYnVmZmVyO1xyXG4gIC8qKiBAdHlwZSB7RmxvYXQzMkFycmF5fSAqL1xyXG4gIHZhciBjaGFubmVsRGF0YTtcclxuICAvKiogQHR5cGUge0F1ZGlvQnVmZmVyU291cmNlTm9kZX0gKi9cclxuICB2YXIgYnVmZmVyU291cmNlO1xyXG4gIC8qKiBAdHlwZSB7QmlxdWFkRmlsdGVyTm9kZX0gKi9cclxuICB2YXIgZmlsdGVyO1xyXG4gIC8qKiBAdHlwZSB7QXVkaW9QYW5uZXJOb2RlfSAqL1xyXG4gIHZhciBwYW5uZXI7XHJcbiAgLyoqIEB0eXBlIHtBdWRpb0dhaW5Ob2RlfSAqL1xyXG4gIHZhciBvdXRwdXQ7XHJcbiAgLyoqIEB0eXBlIHtBdWRpb0dhaW59ICovXHJcbiAgdmFyIG91dHB1dEdhaW47XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIG5vdyA9IHRoaXMuY3R4LmN1cnJlbnRUaW1lO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciB2b2xBdHRhY2sgPSBub3cgKyBpbnN0cnVtZW50Wyd2b2xBdHRhY2snXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgbW9kQXR0YWNrID0gbm93ICsgaW5zdHJ1bWVudFsnbW9kQXR0YWNrJ107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHZvbERlY2F5ID0gdm9sQXR0YWNrICsgaW5zdHJ1bWVudFsndm9sRGVjYXknXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgbW9kRGVjYXkgPSBtb2RBdHRhY2sgKyBpbnN0cnVtZW50Wydtb2REZWNheSddO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBsb29wU3RhcnQgPSBpbnN0cnVtZW50Wydsb29wU3RhcnQnXSAvIHRoaXMuc2FtcGxlUmF0ZTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgbG9vcEVuZCA9IGluc3RydW1lbnRbJ2xvb3BFbmQnXSAvIHRoaXMuc2FtcGxlUmF0ZTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgc3RhcnRUaW1lID0gaW5zdHJ1bWVudFsnc3RhcnQnXSAvIHRoaXMuc2FtcGxlUmF0ZTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgYmFzZUZyZXE7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHBlZWtGcmVxO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBzdXN0YWluRnJlcTtcclxuXHJcbiAgc2FtcGxlID0gc2FtcGxlLnN1YmFycmF5KDAsIHNhbXBsZS5sZW5ndGggKyBpbnN0cnVtZW50WydlbmQnXSk7XHJcbiAgYnVmZmVyID0gdGhpcy5hdWRpb0J1ZmZlciA9IGN0eC5jcmVhdGVCdWZmZXIoMSwgc2FtcGxlLmxlbmd0aCwgdGhpcy5zYW1wbGVSYXRlKTtcclxuICBjaGFubmVsRGF0YSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcclxuICBjaGFubmVsRGF0YS5zZXQoc2FtcGxlKTtcclxuXHJcbiAgLy8gYnVmZmVyIHNvdXJjZVxyXG4gIGJ1ZmZlclNvdXJjZSA9IHRoaXMuYnVmZmVyU291cmNlID0gY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gIGJ1ZmZlclNvdXJjZS5idWZmZXIgPSBidWZmZXI7XHJcbiAgYnVmZmVyU291cmNlLmxvb3AgPSAodGhpcy5jaGFubmVsICE9PSA5KTtcclxuICBidWZmZXJTb3VyY2UubG9vcFN0YXJ0ID0gbG9vcFN0YXJ0O1xyXG4gIGJ1ZmZlclNvdXJjZS5sb29wRW5kICAgPSBsb29wRW5kO1xyXG4gIHRoaXMudXBkYXRlUGl0Y2hCZW5kKHRoaXMucGl0Y2hCZW5kKTtcclxuXHJcbiAgLy8gYXVkaW8gbm9kZVxyXG4gIHBhbm5lciA9IHRoaXMucGFubmVyID0gY3R4LmNyZWF0ZVBhbm5lcigpO1xyXG4gIG91dHB1dCA9IHRoaXMuZ2Fpbk91dHB1dCA9IGN0eC5jcmVhdGVHYWluTm9kZSgpO1xyXG4gIG91dHB1dEdhaW4gPSBvdXRwdXQuZ2FpbjtcclxuXHJcbiAgLy8gZmlsdGVyXHJcbiAgZmlsdGVyID0gdGhpcy5maWx0ZXIgPSBjdHguY3JlYXRlQmlxdWFkRmlsdGVyKCk7XHJcbiAgZmlsdGVyLnR5cGUgPSBmaWx0ZXIuTE9XUEFTUztcclxuXHJcbiAgLy8gcGFucG90XHJcbiAgcGFubmVyLnBhbm5pbmdNb2RlbCA9IDA7XHJcbiAgcGFubmVyLnNldFBvc2l0aW9uKFxyXG4gICAgTWF0aC5zaW4odGhpcy5wYW5wb3QgKiBNYXRoLlBJIC8gMiksXHJcbiAgICAwLFxyXG4gICAgTWF0aC5jb3ModGhpcy5wYW5wb3QgKiBNYXRoLlBJIC8gMilcclxuICApO1xyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIEF0dGFjaywgRGVjYXksIFN1c3RhaW5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIG91dHB1dEdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgbm93KTtcclxuICBvdXRwdXRHYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMudm9sdW1lICogKHRoaXMudmVsb2NpdHkgLyAxMjcpLCB2b2xBdHRhY2spO1xyXG4gIG91dHB1dEdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodGhpcy52b2x1bWUgKiAoMSAtIGluc3RydW1lbnRbJ3ZvbFN1c3RhaW4nXSksIHZvbERlY2F5KTtcclxuXHJcbiAgZmlsdGVyLlEuc2V0VmFsdWVBdFRpbWUoaW5zdHJ1bWVudFsnaW5pdGlhbEZpbHRlclEnXSAqIE1hdGgucG93KDEwLCAyMDApLCBub3cpO1xyXG4gIGJhc2VGcmVxID0gYW1vdW50VG9GcmVxKGluc3RydW1lbnRbJ2luaXRpYWxGaWx0ZXJGYyddKTtcclxuICBwZWVrRnJlcSA9IGFtb3VudFRvRnJlcShpbnN0cnVtZW50Wydpbml0aWFsRmlsdGVyRmMnXSArIGluc3RydW1lbnRbJ21vZEVudlRvRmlsdGVyRmMnXSk7XHJcbiAgc3VzdGFpbkZyZXEgPSBiYXNlRnJlcSArIChwZWVrRnJlcSAtIGJhc2VGcmVxKSAqICgxIC0gaW5zdHJ1bWVudFsnbW9kU3VzdGFpbiddKTtcclxuICBmaWx0ZXIuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGJhc2VGcmVxLCBub3cpO1xyXG4gIGZpbHRlci5mcmVxdWVuY3kubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUocGVla0ZyZXEsIG1vZEF0dGFjayk7XHJcbiAgZmlsdGVyLmZyZXF1ZW5jeS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShzdXN0YWluRnJlcSwgbW9kRGVjYXkpO1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsXHJcbiAgICogQHJldHVybnMge251bWJlcn1cclxuICAgKi9cclxuICBmdW5jdGlvbiBhbW91bnRUb0ZyZXEodmFsKSB7XHJcbiAgICByZXR1cm4gTWF0aC5wb3coMiwgKHZhbCAtIDY5MDApIC8gMTIwMCkgKiA0NDA7XHJcbiAgfVxyXG5cclxuICAvLyBjb25uZWN0XHJcbiAgYnVmZmVyU291cmNlLmNvbm5lY3QoZmlsdGVyKTtcclxuICBmaWx0ZXIuY29ubmVjdChwYW5uZXIpO1xyXG4gIHBhbm5lci5jb25uZWN0KG91dHB1dCk7XHJcbiAgb3V0cHV0LmNvbm5lY3QodGhpcy5kZXN0aW5hdGlvbik7XHJcblxyXG4gIC8vIGZpcmVcclxuICBidWZmZXJTb3VyY2Uuc3RhcnQoMCwgc3RhcnRUaW1lKTtcclxufTtcclxuXHJcblxyXG5cclxuU3ludGhlc2l6ZXJOb3RlLnByb3RvdHlwZS5ub3RlT2ZmID0gZnVuY3Rpb24oKSB7XHJcbiAgLyoqIEB0eXBlIHt7XHJcbiAgICogICBjaGFubmVsOiBudW1iZXIsXHJcbiAgICogICBrZXk6IG51bWJlcixcclxuICAgKiAgIHNhbXBsZTogVWludDhBcnJheSxcclxuICAgKiAgIGJhc2VQbGF5YmFja1JhdGU6IG51bWJlcixcclxuICAgKiAgIGxvb3BTdGFydDogbnVtYmVyLFxyXG4gICAqICAgbG9vcEVuZDogbnVtYmVyLFxyXG4gICAqICAgdm9sdW1lOiBudW1iZXIsXHJcbiAgICogICBwYW5wb3Q6IG51bWJlclxyXG4gICAqIH19ICovXHJcbiAgdmFyIGluc3RydW1lbnQgPSB0aGlzLmluc3RydW1lbnQ7XHJcbiAgLyoqIEB0eXBlIHtBdWRpb0J1ZmZlclNvdXJjZU5vZGV9ICovXHJcbiAgdmFyIGJ1ZmZlclNvdXJjZSA9IHRoaXMuYnVmZmVyU291cmNlO1xyXG4gIC8qKiBAdHlwZSB7QXVkaW9HYWluTm9kZX0gKi9cclxuICB2YXIgb3V0cHV0ID0gdGhpcy5nYWluT3V0cHV0O1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBub3cgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgdm9sRW5kVGltZSA9IG5vdyArIGluc3RydW1lbnRbJ3ZvbFJlbGVhc2UnXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgbW9kRW5kVGltZSA9IG5vdyArIGluc3RydW1lbnRbJ21vZFJlbGVhc2UnXTtcclxuXHJcbiAgaWYgKCF0aGlzLmF1ZGlvQnVmZmVyKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIFJlbGVhc2VcclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIG91dHB1dC5nYWluLmNhbmNlbFNjaGVkdWxlZFZhbHVlcygwKTtcclxuICBvdXRwdXQuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCB2b2xFbmRUaW1lKTtcclxuICBidWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLmNhbmNlbFNjaGVkdWxlZFZhbHVlcygwKTtcclxuICBidWZmZXJTb3VyY2UucGxheWJhY2tSYXRlLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUsIG1vZEVuZFRpbWUpO1xyXG5cclxuICBidWZmZXJTb3VyY2UubG9vcCA9IGZhbHNlO1xyXG4gIGJ1ZmZlclNvdXJjZS5zdG9wKHZvbEVuZFRpbWUpO1xyXG5cclxuICAvLyBkaXNjb25uZWN0XHJcbiAgLy8qXHJcbiAgc2V0VGltZW91dChcclxuICAgIChmdW5jdGlvbihub3RlKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICBub3RlLmJ1ZmZlclNvdXJjZS5kaXNjb25uZWN0KDApO1xyXG4gICAgICAgIG5vdGUucGFubmVyLmRpc2Nvbm5lY3QoMCk7XHJcbiAgICAgICAgbm90ZS5nYWluT3V0cHV0LmRpc2Nvbm5lY3QoMCk7XHJcbiAgICAgIH07XHJcbiAgICB9KSh0aGlzKSxcclxuICAgIGluc3RydW1lbnRbJ3ZvbFJlbGVhc2UnXSAqIDEwMDBcclxuICApO1xyXG4gIC8vKi9cclxufTtcclxuXHJcblN5bnRoZXNpemVyTm90ZS5wcm90b3R5cGUuc2NoZWR1bGVQbGF5YmFja1JhdGUgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgcGxheWJhY2tSYXRlID0gdGhpcy5idWZmZXJTb3VyY2UucGxheWJhY2tSYXRlO1xyXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xyXG4gIHZhciBjb21wdXRlZCA9IHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGU7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIHN0YXJ0ID0gdGhpcy5zdGFydFRpbWU7XHJcbiAgLyoqIEB0eXBlIHtPYmplY3R9ICovXHJcbiAgdmFyIGluc3RydW1lbnQgPSB0aGlzLmluc3RydW1lbnQ7XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIG1vZEF0dGFjayA9IHN0YXJ0ICsgaW5zdHJ1bWVudFsnbW9kQXR0YWNrJ107XHJcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXHJcbiAgdmFyIG1vZERlY2F5ID0gbW9kQXR0YWNrICsgaW5zdHJ1bWVudFsnbW9kRGVjYXknXTtcclxuICAvKiogQHR5cGUge251bWJlcn0gKi9cclxuICB2YXIgcGVla1BpdGNoID0gY29tcHV0ZWQgKiBNYXRoLnBvdyhcclxuICAgIE1hdGgucG93KDIsIDEvMTIpLFxyXG4gICAgdGhpcy5tb2RFbnZUb1BpdGNoICogdGhpcy5pbnN0cnVtZW50WydzY2FsZVR1bmluZyddXHJcbiAgKTtcclxuXHJcbiAgcGxheWJhY2tSYXRlLmNhbmNlbFNjaGVkdWxlZFZhbHVlcygwKTtcclxuICBwbGF5YmFja1JhdGUuc2V0VmFsdWVBdFRpbWUoY29tcHV0ZWQsIHN0YXJ0KTtcclxuICBwbGF5YmFja1JhdGUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUocGVla1BpdGNoLCBtb2RBdHRhY2spO1xyXG4gIHBsYXliYWNrUmF0ZS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZShjb21wdXRlZCArIChwZWVrUGl0Y2ggLSBjb21wdXRlZCkgKiAoMSAtIGluc3RydW1lbnRbJ21vZFN1c3RhaW4nXSksIG1vZERlY2F5KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcGl0Y2hCZW5kXHJcbiAqL1xyXG5TeW50aGVzaXplck5vdGUucHJvdG90eXBlLnVwZGF0ZVBpdGNoQmVuZCA9IGZ1bmN0aW9uKHBpdGNoQmVuZCkge1xyXG4gIHRoaXMuY29tcHV0ZWRQbGF5YmFja1JhdGUgPSB0aGlzLnBsYXliYWNrUmF0ZSAqIE1hdGgucG93KFxyXG4gICAgTWF0aC5wb3coMiwgMS8xMiksXHJcbiAgICAoXHJcbiAgICAgIHRoaXMucGl0Y2hCZW5kU2Vuc2l0aXZpdHkgKiAoXHJcbiAgICAgICAgcGl0Y2hCZW5kIC8gKHBpdGNoQmVuZCA8IDAgPyA4MTkyIDogODE5MSlcclxuICAgICAgKVxyXG4gICAgKSAqIHRoaXMuaW5zdHJ1bWVudFsnc2NhbGVUdW5pbmcnXVxyXG4gICk7XHJcbiAgdGhpcy5zY2hlZHVsZVBsYXliYWNrUmF0ZSgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3ludGhlc2l6ZXJOb3RlXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3NvdW5kX2ZvbnRfc3ludGhfbm90ZS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=