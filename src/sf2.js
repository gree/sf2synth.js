import Riff from "./riff"

/**
 * @param {ByteArray} input
 * @param {Object=} opt_params
 * @constructor
 */
const Parser = function(input, opt_params) {
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

Parser.prototype.parse = function() {
  /** @type {Riff.Parser} */
  var parser = new Riff.Parser(this.input, this.parserOption);
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
Parser.prototype.parseRiffChunk = function(chunk) {
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
  parser = new Riff.Parser(data, {'index': ip, 'length': chunk.size - 4});
  parser.parse();
  if (parser.getNumberOfChunks() !== 3) {
    throw new Error('invalid sfbk structure');
  }

  // INFO-list
  this.parseInfoList(/** @type {!Riff.Chunk} */(parser.getChunk(0)));

  // sdta-list
  this.parseSdtaList(/** @type {!Riff.Chunk} */(parser.getChunk(1)));

  // pdta-list
  this.parsePdtaList(/** @type {!Riff.Chunk} */(parser.getChunk(2)));
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parseInfoList = function(chunk) {
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
  parser = new Riff.Parser(data, {'index': ip, 'length': chunk.size - 4});
  parser.parse();
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parseSdtaList = function(chunk) {
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
  parser = new Riff.Parser(data, {'index': ip, 'length': chunk.size - 4});
  parser.parse();
  if (parser.chunkList.length !== 1) {
    throw new Error('TODO');
  }
  this.samplingData =
    /** @type {{type: string, size: number, offset: number}} */
    (parser.getChunk(0));
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parsePdtaList = function(chunk) {
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
  parser = new Riff.Parser(data, {'index': ip, 'length': chunk.size - 4});
  parser.parse();

  // check number of chunks
  if (parser.getNumberOfChunks() !== 9) {
    throw new Error('invalid pdta chunk');
  }

  this.parsePhdr(/** @type {Riff.Chunk} */(parser.getChunk(0)));
  this.parsePbag(/** @type {Riff.Chunk} */(parser.getChunk(1)));
  this.parsePmod(/** @type {Riff.Chunk} */(parser.getChunk(2)));
  this.parsePgen(/** @type {Riff.Chunk} */(parser.getChunk(3)));
  this.parseInst(/** @type {Riff.Chunk} */(parser.getChunk(4)));
  this.parseIbag(/** @type {Riff.Chunk} */(parser.getChunk(5)));
  this.parseImod(/** @type {Riff.Chunk} */(parser.getChunk(6)));
  this.parseIgen(/** @type {Riff.Chunk} */(parser.getChunk(7)));
  this.parseShdr(/** @type {Riff.Chunk} */(parser.getChunk(8)));
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parsePhdr = function(chunk) {
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
      preset: data[ip++] | (data[ip++] << 8),
      bank: data[ip++] | (data[ip++] << 8),
      presetBagIndex: data[ip++] | (data[ip++] << 8),
      library: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0,
      genre: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0,
      morphology: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0
    });
  }
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parsePbag = function(chunk) {
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
    throw new Error('invalid chunk type:'  + chunk.type);
  }

  while (ip < size) {
    presetZone.push({
      presetGeneratorIndex: data[ip++] | (data[ip++] << 8),
      presetModulatorIndex: data[ip++] | (data[ip++] << 8)
    });
  }
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parsePmod = function(chunk) {
  // check parse target
  if (chunk.type !== 'pmod') {
    throw new Error('invalid chunk type:' + chunk.type);
  }

  this.presetZoneModulator = this.parseModulator(chunk);
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parsePgen = function(chunk) {
  // check parse target
  if (chunk.type !== 'pgen') {
    throw new Error('invalid chunk type:' + chunk.type);
  }
  this.presetZoneGenerator = this.parseGenerator(chunk);
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parseInst = function(chunk) {
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
      instrumentBagIndex: data[ip++] | (data[ip++] << 8)
    });
  }
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parseIbag = function(chunk) {
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
      instrumentGeneratorIndex: data[ip++] | (data[ip++] << 8),
      instrumentModulatorIndex: data[ip++] | (data[ip++] << 8)
    });
  }
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parseImod = function(chunk) {
  // check parse target
  if (chunk.type !== 'imod') {
    throw new Error('invalid chunk type:' + chunk.type);
  }

  this.instrumentZoneModulator = this.parseModulator(chunk);
};


/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parseIgen = function(chunk) {
  // check parse target
  if (chunk.type !== 'igen') {
    throw new Error('invalid chunk type:' + chunk.type);
  }

  this.instrumentZoneGenerator = this.parseGenerator(chunk);
};

/**
 * @param {Riff.Chunk} chunk
 */
Parser.prototype.parseShdr = function(chunk) {
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
    start = (
      (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
    ) >>> 0;
    end = (
      (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
    ) >>> 0;
    startLoop = (
      (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
    ) >>> 0;
    endLoop =  (
      (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
    ) >>> 0;
    sampleRate = (
      (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
    ) >>> 0;
    originalPitch = data[ip++];
    pitchCorrection = (data[ip++] << 24) >> 24;
    sampleLink = data[ip++] | (data[ip++] << 8);
    sampleType = data[ip++] | (data[ip++] << 8);

    //*
    var sample = new Int16Array(new Uint8Array(data.subarray(
      this.samplingData.offset + start * 2,
      this.samplingData.offset + end   * 2
    )).buffer);

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

Parser.prototype.adjustSampleData = function(sample, sampleRate) {
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
Parser.prototype.parseModulator = function(chunk) {
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
    code = data[ip++] | (data[ip++] << 8);
    key = Parser.GeneratorEnumeratorTable[code];
    if (key === void 0) {
      // Amount
      output.push({
        type: key,
        value: {
          code: code,
          amount: data[ip] | (data[ip+1] << 8) << 16 >> 16,
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
              amount: data[ip++] | (data[ip++] << 8) << 16 >> 16
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
Parser.prototype.parseGenerator = function(chunk) {
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
    code = data[ip++] | (data[ip++] << 8);
    key = Parser.GeneratorEnumeratorTable[code];
    if (key === void 0) {
      output.push({
        type: key,
        value: {
          code: code,
          amount: data[ip] | (data[ip+1] << 8) << 16 >> 16,
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
            amount: data[ip++] | (data[ip++] << 8) << 16 >> 16
          }
        });
        break;
    }
  }

  return output;
};

Parser.prototype.createInstrument = function() {
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
    bagIndex    = instrument[i].instrumentBagIndex;
    bagIndexEnd = instrument[i+1] ? instrument[i+1].instrumentBagIndex : zone.length;
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

Parser.prototype.createPreset = function() {
  /** @type {Array.<Object>} */
  var preset   = this.presetHeader;
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
    bagIndex    = preset[i].presetBagIndex;
    bagIndexEnd = preset[i+1] ? preset[i+1].presetBagIndex : zone.length;
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

      instrument =
        presetGenerator.generator['instrument'] !== void 0 ?
          presetGenerator.generator['instrument'].amount :
        presetModulator.modulator['instrument'] !== void 0 ?
          presetModulator.modulator['instrument'].amount :
        null;
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
Parser.prototype.createInstrumentGenerator_ = function(zone, index) {
  var modgen = this.createBagModGen_(
    zone,
    zone[index].instrumentGeneratorIndex,
    zone[index+1] ? zone[index+1].instrumentGeneratorIndex: this.instrumentZoneGenerator.length,
    this.instrumentZoneGenerator
  );

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
Parser.prototype.createInstrumentModulator_ = function(zone, index) {
  var modgen = this.createBagModGen_(
    zone,
    zone[index].presetModulatorIndex,
    zone[index+1] ? zone[index+1].instrumentModulatorIndex: this.instrumentZoneModulator.length,
    this.instrumentZoneModulator
  );

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
Parser.prototype.createPresetGenerator_ = function(zone, index) {
  var modgen = this.createBagModGen_(
    zone,
    zone[index].presetGeneratorIndex,
    zone[index+1] ? zone[index+1].presetGeneratorIndex : this.presetZoneGenerator.length,
    this.presetZoneGenerator
  );

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
Parser.prototype.createPresetModulator_ = function(zone, index) {
  /** @type {{modgen: Object, modgenInfo: Array.<Object>}} */
  var modgen = this.createBagModGen_(
    zone,
    zone[index].presetModulatorIndex,
    zone[index+1] ? zone[index+1].presetModulatorIndex : this.presetZoneModulator.length,
    this.presetZoneModulator
  );

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
Parser.prototype.createBagModGen_ = function(zone, indexStart, indexEnd, zoneModGen) {
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
Parser.GeneratorEnumeratorTable = [
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
  , // 14
  'chorusEffectsSend',
  'reverbEffectsSend',
  'pan',
  ,,, // 18,19,20
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
  , // 42
  'keyRange',
  'velRange',
  'startloopAddrsCoarseOffset',
  'keynum',
  'velocity',
  'initialAttenuation',
  , // 49
  'endloopAddrsCoarseOffset',
  'coarseTune',
  'fineTune',
  'sampleID',
  'sampleModes',
  , // 55
  'scaleTuning',
  'exclusiveClass',
  'overridingRootKey'
];

export default Parser
