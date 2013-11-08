goog.provide('SoundFont.Synthesizer');

goog.require('SoundFont.SynthesizerNote');
goog.require('SoundFont.Parser');
goog.require('SoundFont.DefaultIR');


/**
 * @constructor
 */
SoundFont.Synthesizer = function(input) {
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;

  /** @type {Uint8Array} */
  this.input = input;
  /** @type {SoundFont.Parser} */
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
  this.channelExpression =
    [127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127];
  this.channelRelease =
    [64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64];
  this.channelHold = [
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false
  ];
  /** @type {Array.<number>} */
  this.channelBankMsb =
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0];
  /** @type {Array.<number>} */
  this.channelBankLsb =
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /** @type {boolean} */
  this.isGS = false;
  /** @type {boolean} */
  this.isXG = false;


  /** @type {Array.<boolean>} */
  this.channelMute = [
    false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false
  ];
  /** @type {Array.<Array.<SoundFont.SynthesizerNote>>} */
  this.currentNoteOn = [
    [], [], [], [], [], [], [], [],
    [], [], [], [], [], [], [], []
  ];
  /** @type {number} @const */
  this.baseVolume = 1 / 0xffff;
  /** @type {number} */
  this.masterVolume = 16384;

  this.percussionVolume = new Array(128);
  for (i = 0, il = this.percussionVolume.length; i < il; ++i) {
    this.percussionVolume[i] = 127;
  }

  /** @type {HTMLTableElement} */
  this.table;

  this.ir = SoundFont.Synthesizer.IR;
  /** @type {boolean} */
  this.reverb = true;
  /** @type {ConvolverNode} */
  this.reverbNode = this.ctx.createConvolver();
  /** @type {AudioGainNode} */
  this.reverbLevel = this.ctx.createGainNode();
};
/**
 * @returns {AudioContext}
 */
SoundFont.Synthesizer.prototype.getAudioContext = function() {
  /** @type {AudioContext} */
  var ctx;

  if (goog.global['AudioContext'] !== void 0) {
    ctx = new goog.global['AudioContext']();
  } else if (goog.global['webkitAudioContext'] !== void 0) {
    ctx = new goog.global['webkitAudioContext']();
  } else if (goog.global['mozAudioContext'] !== void 0) {
    ctx = new goog.global['mozAudioContext']();
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
SoundFont.Synthesizer.ProgramNames = [
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
];

SoundFont.Synthesizer.prototype.init = function() {
  /** @type {number} */
  var i;

  this.parser = new SoundFont.Parser(this.input);
  this.bankSet = this.createAllInstruments();

  // reverbNode
  this.reverbNode.buffer = this.ir;
  this.reverbLevel.gain.value = 1;

  this.isXG = false;
  this.isGS = false;

  for (i = 0; i < 16; ++i) {
    this.programChange(i, i);
    this.volumeChange(i, 0x64);
    this.panpotChange(i, 0x40);
    this.pitchBend(i, 0x00, 0x40); // 8192
    this.pitchBendSensitivity(i, 2);
    this.channelHold[i] = false;
    this.channelExpression[i] = 127;
    this.bankSelectMsb(i, i === 9 ? 128 : 0x00);
    this.bankSelectLsb(i, 0x00);
  }

  for (i = 0; i < 128; ++i) {
    this.percussionVolume[i] = 127;
  }
};

/**
 * @param {Uint8Array} input
 */
SoundFont.Synthesizer.prototype.refreshInstruments = function(input) {
  this.input = input;
  this.parser = new SoundFont.Parser(input);
  this.bankSet = this.createAllInstruments();
};

SoundFont.Synthesizer.prototype.createAllInstruments = function() {
  /** @type {SoundFont.Parser} */
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

SoundFont.Synthesizer.prototype.createNoteInfo = function(parser, info, preset) {
  var generator = info.generator;
  /** @type {number} */
  var sampleId;
  /** @type {Object} */
  var sampleHeader;
  /** @type {number} */
  var volDelay;
  /** @type {number} */
  var volAttack;
  /** @type {number} */
  var volHold;
  /** @type {number} */
  var volDecay;
  /** @type {number} */
  var volSustain;
  /** @type {number} */
  var volRelease;
  /** @type {number} */
  var modDelay;
  /** @type {number} */
  var modAttack;
  /** @type {number} */
  var modHold;
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

  volDelay   = this.getModGenAmount(generator, 'delayVolEnv',   -12000);
  volAttack  = this.getModGenAmount(generator, 'attackVolEnv',  -12000);
  volHold    = this.getModGenAmount(generator, 'holdVolEnv',    -12000);
  volDecay   = this.getModGenAmount(generator, 'decayVolEnv',   -12000);
  volSustain = this.getModGenAmount(generator, 'sustainVolEnv');
  volRelease = this.getModGenAmount(generator, 'releaseVolEnv', -12000);
  modDelay   = this.getModGenAmount(generator, 'delayModEnv',   -12000);
  modAttack  = this.getModGenAmount(generator, 'attackModEnv',  -12000);
  modHold    = this.getModGenAmount(generator, 'holdModEnv',    -12000);
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
      'sampleModes': this.getModGenAmount(generator, 'sampleModes'),
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
      'volDelay':   Math.pow(2, volDelay / 1200),
      'volAttack':  Math.pow(2, volAttack / 1200),
      'volHold':
        Math.pow(2, volHold / 1200) *
        Math.pow(2, (60 - i) * this.getModGenAmount(generator, 'keynumToVolEnvHold') / 1200),
      'volDecay':
        Math.pow(2, volDecay / 1200) *
        Math.pow(2, (60 - i) * this.getModGenAmount(generator, 'keynumToVolEnvDecay') / 1200),
      'volSustain': volSustain / 1000,
      'volRelease': Math.pow(2, volRelease / 1200),
      'modDelay':   Math.pow(2, modDelay / 1200),
      'modAttack':  Math.pow(2, modAttack / 1200),
      'modHold':
        Math.pow(2, modHold / 1200) *
        Math.pow(2, (60 - i) * this.getModGenAmount(generator, 'keynumToModEnvHold') / 1200),
      'modDecay':
        Math.pow(2, modDecay / 1200) *
        Math.pow(2, (60 - i) * this.getModGenAmount(generator, 'keynumToModEnvDecay') / 1200),
      'modSustain': modSustain / 1000,
      'modRelease': Math.pow(2, modRelease / 1200),
      'initialFilterFc': this.getModGenAmount(generator, 'initialFilterFc', 13500),
      'modEnvToFilterFc': this.getModGenAmount(generator, 'modEnvToFilterFc'),
      'initialFilterQ': this.getModGenAmount(generator, 'initialFilterQ'),
      'reverbEffectSend':  this.getModGenAmount(generator, 'reverbEffectSend'),
      'initialAttenuation':  this.getModGenAmount(generator, 'initialAttenuation'),
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
SoundFont.Synthesizer.prototype.getModGenAmount = function(generator, enumeratorType, opt_default) {
  if (opt_default === void 0) {
    opt_default = 0;
  }

  return generator[enumeratorType] ? generator[enumeratorType].amount : opt_default;
};

SoundFont.Synthesizer.StringToUint8Array = function(string) {
  var i;
  var il = string.length;
  var array = new Uint8Array(il);

  for (i = 0; i < il; ++i) {
    array[i] = string.charCodeAt(i);
  }

  return array;
};

/**
 * @type {AudioBuffer}
 */
SoundFont.Synthesizer.IR =
  SoundFont.Synthesizer.prototype.getAudioContext().createBuffer(
    SoundFont.Synthesizer.StringToUint8Array(
      window.atob(SoundFont.DefaultIR)
    ).buffer,
    false
  );

SoundFont.Synthesizer.prototype.connect = function() {
  this.bufSrc.connect(this.gainMaster);
  this.gainMaster.connect(this.ctx.destination);

  if (this.reverb) {
    this.connectReverb();
  }
};

SoundFont.Synthesizer.prototype.connectReverb = function() {
  this.gainMaster.connect(this.reverbNode);
  this.reverbNode.connect(this.reverbLevel);
  this.reverbLevel.connect(this.ctx.destination);
};

SoundFont.Synthesizer.prototype.start = function() {
  this.connect();
  this.bufSrc.start(0);


  this.setMasterVolume(16383);
};

SoundFont.Synthesizer.prototype.setMasterVolume = function(volume) {
  this.masterVolume = volume;
  this.gainMaster.gain.value = this.baseVolume * (volume / 16384);
};

/**
 * @param {AudioBuffer|ArrayBuffer} ir
 */
SoundFont.Synthesizer.prototype.loadIR = function(ir) {
  if (ir instanceof ArrayBuffer) {
    ir = this.ctx.createBuffer(ir, false);
  }
  this.ir = ir;
  this.reverbNode.buffer = ir;
};

SoundFont.Synthesizer.prototype.stop =
SoundFont.Synthesizer.prototype.disconnect = function() {
  this.bufSrc.disconnect(0);
  this.gainMaster.disconnect(0);
  this.disconnectReverb();
};

SoundFont.Synthesizer.prototype.disconnectReverb = function() {
  this.reverbNode.disconnect(0);
  this.reverbLevel.disconnect(0);
};

SoundFont.Synthesizer.prototype.setReverb = function(reverb) {
  if (this.reverb === reverb) {
    return;
  }

  this.disconnectReverb();
  this.reverb = reverb;
  if (reverb) {
    this.connectReverb();
  }
};

/**
 * @type {!Array.<string>}
 * @const
 */
SoundFont.Synthesizer.TableHeader = ['Instrument', 'Vol', 'Pan', 'Bend', 'Range'];

SoundFont.Synthesizer.prototype.drawSynth = function() {
  /** @type {HTMLTableElement} */
  var table = this.table =
    /** @type {HTMLTableElement} */(document.createElement('table'));
  /** @type {HTMLTableSectionElement} */
  var head =
    /** @type {HTMLTableSectionElement} */(document.createElement('thead'));
  /** @type {HTMLTableSectionElement} */
  var body =
    /** @type {HTMLTableSectionElement} */
    (document.createElement('tbody'));
  /** @type {HTMLTableRowElement} */
  var tableLine;
  /** @type {NodeList} */
  var notes;
  /** @type {Element} */
  var firstColumn;
  /** @type {Element} */
  var checkbox;
  /** @type {Element} */
  var select;
  /** @type {Element} */
  var option;
  /** @type {number} */
  var i;
  /** @type {number} */
  var j;

  head.appendChild(this.createTableLine(SoundFont.Synthesizer.TableHeader, true));

  for (i = 0; i < 16; ++i) {
    tableLine = this.createTableLine(SoundFont.Synthesizer.TableHeader.length + 128, false);
    body.appendChild(tableLine);

    // mute checkbox
    firstColumn = tableLine.querySelector('td:nth-child(1)');
    checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.addEventListener('change', (function (synth, channel) {
      return function(event) {
        synth.mute(channel, this.checked);
      }
    })(this, i), false);
    firstColumn.appendChild(checkbox);

    if (i !== 9) {
      // not percussion
      select = document.createElement('select');

      for (j = 0; j < 128; ++j) {
        option = document.createElement('option');
        option.textContent = SoundFont.Synthesizer.ProgramNames[j];
        select.appendChild(option);
      }
      firstColumn.appendChild(select);
      select.addEventListener('change', (function(synth, channel) {
        return function(event) {
          synth.programChange(channel, event.target.selectedIndex);
        }
      })(this, i), false);
      select.selectedIndex = this.channelInstrument[i];
    } else {
      // percussion
      firstColumn.appendChild(document.createTextNode('[ RHYTHM TRACK ]'));
    }

    notes = tableLine.querySelectorAll('td:nth-last-child(-n+128)');
    for (j = 0; j < 128; ++j) {
      notes[j].addEventListener('mousedown', (function(synth, channel, key) {
        return function(event) {
          event.preventDefault();
          synth.drag = true;
          synth.noteOn(channel, key, 127);
        }
      })(this, i, j));
      notes[j].addEventListener('mouseover', (function(synth, channel, key) {
        return function(event) {
          event.preventDefault();
          if (synth.drag) {
            synth.noteOn(channel, key, 127);
          }
        }
      })(this, i, j));
      notes[j].addEventListener('mouseout', (function(synth, channel, key) {
        return function(event) {
          event.preventDefault();
          synth.noteOff(channel, key, 0);
        }
      })(this, i, j));
      notes[j].addEventListener('mouseup', (function(synth, channel, key) {
        return function(event) {
          event.preventDefault();
          synth.drag = false;
          synth.noteOff(channel, key, 0);
        }
      })(this, i, j));
    }
  }

  table.appendChild(head);
  table.appendChild(body);

  return table;
};

SoundFont.Synthesizer.prototype.removeSynth = function() {
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
SoundFont.Synthesizer.prototype.createTableLine = function(array, isTitleLine) {
  /** @type {HTMLTableRowElement} */
  var tr = /** @type {HTMLTableRowElement} */(document.createElement('tr'));
  /** @type {HTMLTableCellElement} */
  var cell;
  /** @type {boolean} */
  var isArray = array instanceof Array;
  /** @type {number} */
  var i;
  /** @type {number} */
  var il = isArray ? array.length : /** @type {number} */(array);

  for (i = 0; i < il; ++i) {
    cell =
      /** @type {HTMLTableCellElement} */
      (document.createElement(isTitleLine ? 'th' : 'td'));
    cell.textContent = (isArray && array[i] !== void 0) ? array[i] : '';
    tr.appendChild(cell);
  }

  return tr;
};


/**
 * @param {number} channel NoteOn するチャンネル.
 * @param {number} key NoteOn するキー.
 * @param {number} velocity 強さ.
 */
SoundFont.Synthesizer.prototype.noteOn = function(channel, key, velocity) {
  /** @type {number} */
  var bankIndex = this.channelBankMsb[channel];
  /** @type {Object} */
  var bank = this.bankSet[bankIndex];
  /** @type {Object} */
  var instrument = bank[this.channelInstrument[channel]];
  /** @type {Object} */
  var instrumentKey;
  /** @type {SoundFont.SynthesizerNote} */
  var note;

  if (this.table) {
    this.table.querySelector(
      'tbody > ' +
        'tr:nth-child(' + (channel+1) + ') > ' +
        'td:nth-child(' + (SoundFont.Synthesizer.TableHeader.length+key+1) + ')'
    ).classList.add('note-on');
  }

  if (!instrument) {
    instrument = bank[bankIndex];
    /*
    // TODO
    goog.global.console.warn(
      "instrument not found: bank=%s instrument=%s channel=%s",
      channel === 9 ? 128 : this.bank,
      this.channelInstrument[channel],
      channel
    );
    return;
    */
  }

  instrumentKey = instrument[key] || bank[0];

  if (!(instrumentKey)) {
    // TODO
    goog.global.console.warn(
      "instrument not found: bank=%s instrument=%s channel=%s key=%s",
      bankIndex,
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
  instrumentKey['expression'] = this.channelExpression[channel];
  instrumentKey['pitchBendSensitivity'] = this.channelPitchBendSensitivity[channel];
  instrumentKey['mute'] = this.channelMute[channel];
  instrumentKey['releaseTime'] = this.channelRelease[channel];

  // percussion
  if (channel === 9) {
    instrument['volume'] *= this.percussionVolume[key] / 127;
  }

  // note on
  note = new SoundFont.SynthesizerNote(this.ctx, this.gainMaster, instrumentKey);
  note.noteOn();
  this.currentNoteOn[channel].push(note);
};

/**
 * @param {number} channel NoteOff するチャンネル.
 * @param {number} key NoteOff するキー.
 * @param {number} velocity 強さ.
 */
SoundFont.Synthesizer.prototype.noteOff = function(channel, key, velocity) {
  /** @type {number} */
  var bankIndex = this.channelBankMsb[channel];
  /** @type {Object} */
  var bank = this.bankSet[bankIndex];
  /** @type {Object} */
  var instrument = bank[this.channelInstrument[channel]];
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {Array.<SoundFont.SynthesizerNote>} */
  var currentNoteOn = this.currentNoteOn[channel];
  /** @type {SoundFont.SynthesizerNote} */
  var note;
  /** @type {boolean} */
  var hold = this.channelHold[channel];

  if (this.table) {
    this.table.querySelector(
      'tbody > ' +
      'tr:nth-child(' + (channel+1) + ') > ' +
      'td:nth-child(' + (key+SoundFont.Synthesizer.TableHeader.length+1) + ')'
    ).classList.remove('note-on');
  }

  if (!instrument) {
    return;
  }

  for (i = 0, il = currentNoteOn.length; i < il; ++i) {
    note = currentNoteOn[i];
    if (note.key === key) {
      note.noteOff();

      // hold している時は NoteOff にはするがリリースはしない
      if (!hold) {
        note.release();
        currentNoteOn.splice(i, 1);
        --i;
        --il;
      }
    }
  }
};

SoundFont.Synthesizer.prototype.hold = function(channel, value) {
  /** @type {Array.<SoundFont.SynthesizerNote>} */
  var currentNoteOn = this.currentNoteOn[channel];
  /** @type {boolean} */
  var hold = this.channelHold[channel] = !(value < 64);
  /** @type {SoundFont.SynthesizerNote} */
  var note;
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;

  if (!hold) {
    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
      note = currentNoteOn[i];
      if (note.isNoteOff()) {
        note.release();
        currentNoteOn.splice(i, 1);
        --i;
        --il;
      }
    }
  }
};

/**
 * @param {number} channel チャンネルのバンクセレクトMSB
 * @param {number} value 値
 */
SoundFont.Synthesizer.prototype.bankSelectMsb = function(channel, value) {
  // TODO: GS,XG の bank マッピングを実装したら bank 切り替えを有効にする
  if (false) {
  //if (this.isXG || this.isGS) {
    this.channelBankMsb[channel] = value;
  }
};

/**
 * @param {number} channel チャンネルのバンクセレクトLSB
 * @param {number} value 値
 */
SoundFont.Synthesizer.prototype.bankSelectLsb = function(channel, value) {
  // TODO: GS,XG の bank マッピングを実装したら bank 切り替えを有効にする
  if (false) {
  //if (this.isXG || this.isGS) {
    this.channelBankLsb[channel] = value;
  }
};

/**
 * @param {number} channel 音色を変更するチャンネル.
 * @param {number} instrument 音色番号.
 */
SoundFont.Synthesizer.prototype.programChange = function(channel, instrument) {
  if (this.table) {
    if (channel !== 9) {
      this.table.querySelector('tbody > tr:nth-child(' + (channel+1) + ') > td:first-child > select').selectedIndex = instrument;
    }
  }
  // GM音源の場合リズムトラックは無視する
  if (channel === 9 && !this.isXG && !this.isGS) {
    return;
  }

  this.channelInstrument[channel] = instrument;
};

/**
 * @param {number} channel 音量を変更するチャンネル.
 * @param {number} volume 音量(0-127).
 */
SoundFont.Synthesizer.prototype.volumeChange = function(channel, volume) {
  if (this.table) {
    this.table.querySelector('tbody > tr:nth-child(' + (channel+1) + ') > td:nth-child(2)').textContent = volume;
  }

  this.channelVolume[channel] = volume;
};

SoundFont.Synthesizer.prototype.expression = function(channel, expression) {
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {Array.<SoundFont.SynthesizerNote>} */
  var currentNoteOn = this.currentNoteOn[channel];

  for (i = 0, il = currentNoteOn.length; i < il; ++i) {
    currentNoteOn[i].updateExpression(expression);
  }

  this.channelExpression[channel] = expression;
};

/**
 * @param {number} channel panpot を変更するチャンネル.
 * @param {number} panpot panpot(0-127).
 */
SoundFont.Synthesizer.prototype.panpotChange = function(channel, panpot) {
  if (this.table) {
    this.table.querySelector('tbody > tr:nth-child(' + (channel+1) + ') > td:nth-child(3)').textContent = panpot;
  }

  this.channelPanpot[channel] = panpot;
};

/**
 * @param {number} channel panpot を変更するチャンネル.
 * @param {number} lowerByte
 * @param {number} higherByte
 */
SoundFont.Synthesizer.prototype.pitchBend = function(channel, lowerByte, higherByte) {
  /** @type {number} */
  var bend = (lowerByte & 0x7f) | ((higherByte & 0x7f) << 7);
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {Array.<SoundFont.SynthesizerNote>} */
  var currentNoteOn = this.currentNoteOn[channel];
  /** @type {number} */
  var calculated = bend - 8192;

  if (this.table) {
    this.table.querySelector('tbody > tr:nth-child(' + (channel+1) + ') > td:nth-child(4)').textContent = calculated;
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
SoundFont.Synthesizer.prototype.pitchBendSensitivity = function(channel, sensitivity) {
  if (this.table) {
    this.table.querySelector('tbody > tr:nth-child(' + (channel+1) + ') > td:nth-child(5)').textContent = sensitivity;
  }

  this.channelPitchBendSensitivity[channel] = sensitivity;
};

SoundFont.Synthesizer.prototype.releaseTime = function(channel, releaseTime) {
  this.channelRelease[channel] = releaseTime;
};

/**
 * @param {number} channel pitch bend sensitivity を取得するチャンネル.
 */
SoundFont.Synthesizer.prototype.getPitchBendSensitivity = function(channel) {
  return this.channelPitchBendSensitivity[channel];
};

SoundFont.Synthesizer.prototype.drumInstrumentLevel = function(key, volume) {
  this.percussionVolume[key] = volume;
};

/**
 * @param {number} channel NoteOff するチャンネル.
 */
SoundFont.Synthesizer.prototype.allNoteOff = function(channel) {
  /** @type {Array.<SoundFont.SynthesizerNote>} */
  var currentNoteOn = this.currentNoteOn[channel];

  while (currentNoteOn.length > 0) {
    this.noteOff(channel, currentNoteOn[0].key, 0);
  }
};

/**
 * @param {number} channel 音を消すチャンネル.
 */
SoundFont.Synthesizer.prototype.allSoundOff = function(channel) {
  /** @type {Array.<SoundFont.SynthesizerNote>} */
  var currentNoteOn = this.currentNoteOn[channel];
  /** @type {SoundFont.SynthesizerNote} */
  var note;

  while (currentNoteOn.length > 0) {
    note = currentNoteOn.shift();
    this.noteOff(channel, note.key, 0);
    note.release();
    note.disconnect();
  }
};

/**
 * @param {number} channel リセットするチャンネル
 */
SoundFont.Synthesizer.prototype.resetAllControl = function(channel) {
  this.expression(channel, 127);
  this.pitchBend(channel, 0x00, 0x40);
  this.hold(channel, 0);
};

/**
 * @param {number} channel ミュートの設定を変更するチャンネル.
 * @param {boolean} mute ミュートにするなら true.
 */
SoundFont.Synthesizer.prototype.mute = function(channel, mute) {
  /** @type {Array.<SoundFont.SynthesizerNote>} */
  var currentNoteOn = this.currentNoteOn[channel];
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;

  this.channelMute[channel] = mute;

  if (mute) {
    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
      currentNoteOn[i].disconnect();
    }
  } else {
    for (i = 0, il = currentNoteOn.length; i < il; ++i) {
      currentNoteOn[i].connect();
    }
  }
};
