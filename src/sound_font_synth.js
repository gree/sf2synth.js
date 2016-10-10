import SynthesizerNote from "./sound_font_synth_note"
import Parser from "./sf2"
import View from "./synth_view"

/**
 * @constructor
 */
const Synthesizer = function(input) {
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
  this.channelInstrument =
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 10, 11, 12, 13, 14, 15];
  /** @type {Array.<number>} */
  this.channelVolume =
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  /** @type {Array.<number>} */
  this.channelPanpot =
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  /** @type {Array.<number>} */
  this.channelPitchBend =
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.channelPitchBendSensitivity =
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  /** @type {Array.<Array.<SynthesizerNote>>} */
  this.currentNoteOn = [
    [], [], [], [], [], [], [], [],
    [], [], [], [], [], [], [], []
  ];
  /** @type {number} */
  this.baseVolume = 1 / 0x8000;
  /** @type {number} */
  this.masterVolume = 16384;

  /** @type {View} */
  this.view = new View();
};
/**
 * @returns {AudioContext}
 */
Synthesizer.prototype.getAudioContext = function() {
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

Synthesizer.prototype.init = function() {
  /** @type {number} */
  var i;

  this.parser = new Parser(this.input);
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
Synthesizer.prototype.refreshInstruments = function(input) {
  this.input = input;
  this.parser = new Parser(input);
  this.bankSet = this.createAllInstruments();
};

Synthesizer.prototype.createAllInstruments = function() {
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

Synthesizer.prototype.createNoteInfo = function(parser, info, preset) {
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

  volAttack  = this.getModGenAmount(generator, 'attackVolEnv',  -12000);
  volDecay   = this.getModGenAmount(generator, 'decayVolEnv',   -12000);
  volSustain = this.getModGenAmount(generator, 'sustainVolEnv');
  volRelease = this.getModGenAmount(generator, 'releaseVolEnv', -12000);
  modAttack  = this.getModGenAmount(generator, 'attackModEnv',  -12000);
  modDecay   = this.getModGenAmount(generator, 'decayModEnv',   -12000);
  modSustain = this.getModGenAmount(generator, 'sustainModEnv');
  modRelease = this.getModGenAmount(generator, 'releaseModEnv', -12000);

  tune = (
    this.getModGenAmount(generator, 'coarseTune') +
    this.getModGenAmount(generator, 'fineTune') / 100
  );
  scale = this.getModGenAmount(generator, 'scaleTuning', 100) / 100;
  freqVibLFO = this.getModGenAmount(generator, 'freqVibLFO');

  for (i = generator['keyRange'].lo, il = generator['keyRange'].hi; i <= il; ++i)  {
    if (preset[i]) {
      continue;
    }

    sampleId = this.getModGenAmount(generator, 'sampleID');
    sampleHeader = parser.sampleHeader[sampleId];
    preset[i] = {
      'sample': parser.sample[sampleId],
      'sampleRate': sampleHeader.sampleRate,
      'basePlaybackRate': Math.pow(
        Math.pow(2, 1/12),
        (
          i -
          this.getModGenAmount(generator, 'overridingRootKey', sampleHeader.originalPitch) +
          tune + (sampleHeader.pitchCorrection / 100)
        ) * scale
      ),
      'modEnvToPitch': this.getModGenAmount(generator, 'modEnvToPitch') / 100,
      'scaleTuning': scale,
      'start':
        this.getModGenAmount(generator, 'startAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'startAddrsOffset'),
      'end':
        this.getModGenAmount(generator, 'endAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'endAddrsOffset'),
      'loopStart': (
        //(sampleHeader.startLoop - sampleHeader.start) +
        (sampleHeader.startLoop) +
          this.getModGenAmount(generator, 'startloopAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'startloopAddrsOffset')
        ),
      'loopEnd': (
        //(sampleHeader.endLoop - sampleHeader.start) +
        (sampleHeader.endLoop) +
          this.getModGenAmount(generator, 'endloopAddrsCoarseOffset') * 32768 +
          this.getModGenAmount(generator, 'endloopAddrsOffset')
        ),
      'volAttack':  Math.pow(2, volAttack / 1200),
      'volDecay':   Math.pow(2, volDecay / 1200),
      'volSustain': volSustain / 1000,
      'volRelease': Math.pow(2, volRelease / 1200),
      'modAttack':  Math.pow(2, modAttack / 1200),
      'modDecay':   Math.pow(2, modDecay / 1200),
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
Synthesizer.prototype.getModGenAmount = function(generator, enumeratorType, opt_default) {
  if (opt_default === void 0) {
    opt_default = 0;
  }

  return generator[enumeratorType] ? generator[enumeratorType].amount : opt_default;
};

Synthesizer.prototype.start = function() {
  this.bufSrc.connect(this.gainMaster);
  this.gainMaster.connect(this.ctx.destination);
  this.bufSrc.start(0);

  this.setMasterVolume(16383);
};

Synthesizer.prototype.setMasterVolume = function(volume) {
  this.masterVolume = volume;
  this.gainMaster.gain.value = this.baseVolume * (volume / 16384);
};

Synthesizer.prototype.stop = function() {
  this.bufSrc.disconnect(0);
  this.gainMaster.disconnect(0);
  this.compressor.disconnect(0);
};

Synthesizer.prototype.drawSynth = function() {
  return this.view.draw(this);
}

Synthesizer.prototype.removeSynth = function() {
  this.view.remove();
};

/**
 * @param {number} channel NoteOn するチャンネル.
 * @param {number} key NoteOn するキー.
 * @param {number} velocity 強さ.
 */
Synthesizer.prototype.noteOn = function(channel, key, velocity) {
  /** @type {Object} */
  var bank = this.bankSet[channel === 9 ? 128 : this.bank];
  /** @type {Object} */
  var instrument = bank[this.channelInstrument[channel]];
  /** @type {Object} */
  var instrumentKey;
  /** @type {SynthesizerNote} */
  var note;

  this.view.noteOn(channel, key);

  if (!instrument) {
    // TODO
    console.warn(
      "instrument not found: bank=%s instrument=%s channel=%s",
      channel === 9 ? 128 : this.bank,
      this.channelInstrument[channel],
      channel
    );
    return;
  }

  instrumentKey = instrument[key];

  if (!(instrumentKey)) {
    // TODO
    console.warn(
      "instrument not found: bank=%s instrument=%s channel=%s key=%s",
      channel === 9 ? 128 : this.bank,
      this.channelInstrument[channel],
      channel,
      key
    );
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
  note = new SynthesizerNote(this.ctx, this.gainMaster, instrumentKey);
  note.noteOn();
  this.currentNoteOn[channel].push(note);
};

/**
 * @param {number} channel NoteOff するチャンネル.
 * @param {number} key NoteOff するキー.
 * @param {number} velocity 強さ.
 */
Synthesizer.prototype.noteOff = function(channel, key, velocity) {
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

  this.view.noteOff(channel, key);

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
Synthesizer.prototype.programChange = function(channel, instrument) {
  this.view.programChange(channel, instrument);

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
Synthesizer.prototype.volumeChange = function(channel, volume) {
  this.view.volumeChange(channel, volume);
  this.channelVolume[channel] = volume;
};

/**
 * @param {number} channel panpot を変更するチャンネル.
 * @param {number} panpot panpot(0-127).
 */
Synthesizer.prototype.panpotChange = function(channel, panpot) {
  this.view.panpotChange(channel, panpot);
  this.channelPanpot[channel] = panpot;
};

/**
 * @param {number} channel panpot を変更するチャンネル.
 * @param {number} lowerByte
 * @param {number} higherByte
 */
Synthesizer.prototype.pitchBend = function(channel, lowerByte, higherByte) {
  /** @type {number} */
  var bend = (lowerByte & 0x7f) | ((higherByte & 0x7f) << 7);
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {Array.<SynthesizerNote>} */
  var currentNoteOn = this.currentNoteOn[channel];
  /** @type {number} */
  var calculated = bend - 8192;

  this.view.pitchBend(channel, calculated)

  for (i = 0, il = currentNoteOn.length; i < il; ++i) {
    currentNoteOn[i].updatePitchBend(calculated);
  }

  this.channelPitchBend[channel] = bend;
};

/**
 * @param {number} channel pitch bend sensitivity を変更するチャンネル.
 * @param {number} sensitivity
 */
Synthesizer.prototype.pitchBendSensitivity = function(channel, sensitivity) {
  this.view.pitchBendSensitivity(channel, sensitivity)
  this.channelPitchBendSensitivity[channel] = sensitivity;
};

/**
 * @param {number} channel 音を消すチャンネル.
 */
Synthesizer.prototype.allSoundOff = function(channel) {
  /** @type {Array.<SynthesizerNote>} */
  var currentNoteOn = this.currentNoteOn[channel];

  while (currentNoteOn.length > 0) {
    this.noteOff(channel, currentNoteOn[0].key, 0);
  }
};

/**
 * @param {number} channel リセットするチャンネル
 */
Synthesizer.prototype.resetAllControl = function(channel) {
  this.pitchBend(channel, 0x00, 0x40); // 8192
};

export default Synthesizer
