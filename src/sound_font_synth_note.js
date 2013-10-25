goog.provide('SoundFont.SynthesizerNote');

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
SoundFont.SynthesizerNote = function(ctx, destination, instrument) {
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
  /** @type {number} */
  this.expression = instrument['expression'];

  // state
  /** @type {number} */
  this.startTime = ctx.currentTime;
  /** @type {number} */
  this.computedPlaybackRate = this.playbackRate;
  /** @type {boolean} */
  this.noteOffState = false;

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
  /** @type {AudioGainNode} */
  this.expressionGain;
  /** @type {BiquadFilterNode} */
  this.filter;
};

SoundFont.SynthesizerNote.prototype.noteOn = function() {
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
  var volDelay = now + instrument['volDelay'];
  /** @type {number} */
  var modDelay = now + instrument['modDelay'];
  /** @type {number} */
  var volAttack = volDelay + instrument['volAttack'];
  /** @type {number} */
  var modAttack = volDelay + instrument['modAttack'];
  /** @type {number} */
  var volHold = volAttack + instrument['volHold'];
  /** @type {number} */
  var modHold = modAttack + instrument['modHold'];
  /** @type {number} */
  var volDecay = volHold + instrument['volDecay'];
  /** @type {number} */
  var modDecay = modHold + instrument['modDecay'];
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
  /** @type {number} */
  var volume;

  sample = sample.subarray(0, sample.length + instrument['end']);
  buffer = this.audioBuffer = ctx.createBuffer(1, sample.length, this.sampleRate);
  channelData = buffer.getChannelData(0);
  channelData.set(sample);

  // buffer source
  bufferSource = this.bufferSource = ctx.createBufferSource();
  bufferSource.buffer = buffer;
  bufferSource.loop = (instrument['sampleModes'] & 1) === 1;
  bufferSource.loopStart = loopStart;
  bufferSource.loopEnd   = loopEnd;
  this.updatePitchBend(this.pitchBend);

  // audio node
  panner = this.panner = ctx.createPanner();
  output = this.gainOutput = ctx.createGainNode();
  outputGain = output.gain;
  this.expressionGain = ctx.createGainNode();
  this.expressionGain.gain.value = this.expression / 127;

    // filter
  filter = this.filter = ctx.createBiquadFilter();
  filter.type = filter.LOWPASS;

  // panpot
  panner.panningModel = 0;
  panner.setPosition(
    Math.sin(this.panpot * Math.PI / 2),
    0,
    Math.cos(this.panpot * Math.PI / 2)
  );

  //---------------------------------------------------------------------------
  // Delay, Attack, Hold, Decay, Sustain
  //---------------------------------------------------------------------------

  volume = this.volume * (this.velocity / 127) * (1 - instrument['initialAttenuation'] / 1000);
  if (volume < 0) {
    volume = 0;
  }

  // volume envelope
  outputGain.setValueAtTime(0, now);
  outputGain.setValueAtTime(0, volDelay);
  outputGain.setTargetValueAtTime(volume, volDelay, instrument['volAttack']);
  outputGain.setValueAtTime(volume, volHold);
  outputGain.linearRampToValueAtTime(volume * (1 - instrument['volSustain']), volDecay);

  // modulation envelope
  filter.Q.setValueAtTime(instrument['initialFilterQ'] * Math.pow(10, 200), now);
  baseFreq = this.amountToFreq(instrument['initialFilterFc']);
  peekFreq = this.amountToFreq(instrument['initialFilterFc'] + instrument['modEnvToFilterFc']);
  sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - instrument['modSustain']);
  filter.frequency.setValueAtTime(baseFreq, now);
  filter.frequency.setValueAtTime(baseFreq, modDelay);
  filter.frequency.setTargetValueAtTime(peekFreq, modDelay, instrument['modAttack']);
  filter.frequency.setValueAtTime(peekFreq, modHold);
  filter.frequency.linearRampToValueAtTime(sustainFreq, modDecay);

  // connect
  bufferSource.connect(filter);
  filter.connect(panner);
  panner.connect(this.expressionGain);
  this.expressionGain.connect(output);
  if (!instrument['mute']) {
    this.connect();
  }

  // fire
  bufferSource.start(0, startTime);
};

/**
 * @param {number} val
 * @returns {number}
 */
SoundFont.SynthesizerNote.prototype.amountToFreq = function(val) {
  return Math.pow(2, (val - 6900) / 1200) * 440;
};

SoundFont.SynthesizerNote.prototype.noteOff = function() {
  this.noteOffState = true;
};

SoundFont.SynthesizerNote.prototype.isNoteOff = function() {
  return this.noteOffState;
};

SoundFont.SynthesizerNote.prototype.release = function() {
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
  var release =  instrument['releaseTime'] - 64;

  //---------------------------------------------------------------------------
  // volume release time
  //---------------------------------------------------------------------------
  /** @type {number} */
  var volEndTimeTmp = instrument['volRelease'] * output.gain.value;
  /** @type {number} */
  var volEndTime = now + (volEndTimeTmp * (1 + release / (release < 0 ? 64 : 63)));
  //var volEndTime = now + instrument['volRelease'] * (1 - instrument['volSustain']);

  //---------------------------------------------------------------------------
  // modulation release time
  //---------------------------------------------------------------------------
  /** @type {BiquadFilterNode} */
  var filter = this.filter;
  /** @type {number} */
  var baseFreq = this.amountToFreq(instrument['initialFilterFc']);
  /** @type {number} */
  var peekFreq = this.amountToFreq(instrument['initialFilterFc'] + instrument['modEnvToFilterFc']);
  /** @type {number} */
  var modEndTime = now + instrument['modRelease'] *
    (
      baseFreq === peekFreq ?
      1 :
      (filter.frequency.value - baseFreq) / (peekFreq - baseFreq)
    );
  //var modEndTime = now + instrument['modRelease'] * (1 - instrument['modSustain']);

  if (!this.audioBuffer) {
    return;
  }

  //---------------------------------------------------------------------------
  // Release
  //---------------------------------------------------------------------------

  switch (instrument['sampleModes']) {
    case 0:
      break;
    case 1:
      output.gain.cancelScheduledValues(0);
      output.gain.setValueAtTime(output.gain.value, now);
      output.gain.linearRampToValueAtTime(0, volEndTime);

      filter.frequency.cancelScheduledValues(0);
      filter.frequency.setValueAtTime(filter.frequency.value, now);
      filter.frequency.linearRampToValueAtTime(baseFreq, modEndTime);

      bufferSource.playbackRate.cancelScheduledValues(0);
      bufferSource.playbackRate.setValueAtTime(bufferSource.playbackRate.value, now);
      bufferSource.playbackRate.linearRampToValueAtTime(this.computedPlaybackRate, modEndTime);

      bufferSource.stop(volEndTime);
      break;
    case 2:
      goog.global.console.log('detect unused sampleModes');
      break;
    case 3:
      bufferSource.loop = false;
      break;
  }
};

SoundFont.SynthesizerNote.prototype.connect = function() {
  this.gainOutput.connect(this.destination);
};

SoundFont.SynthesizerNote.prototype.disconnect = function() {
  this.gainOutput.disconnect(0);
};

SoundFont.SynthesizerNote.prototype.schedulePlaybackRate = function() {
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
  var peekPitch = computed * Math.pow(
    Math.pow(2, 1/12),
    this.modEnvToPitch * this.instrument['scaleTuning']
  );

  playbackRate.cancelScheduledValues(0);
  playbackRate.setValueAtTime(computed, start);
  playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
  playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - instrument['modSustain']), modDecay);
};

SoundFont.SynthesizerNote.prototype.updateExpression = function(expression) {
  this.expressionGain.gain.value = (this.expression = expression) / 127;
};

/**
 * @param {number} pitchBend
 */
SoundFont.SynthesizerNote.prototype.updatePitchBend = function(pitchBend) {
  this.computedPlaybackRate = this.playbackRate * Math.pow(
    Math.pow(2, 1/12),
    (pitchBend / (pitchBend < 0 ? 8192 : 8191)) *
    this.pitchBendSensitivity *
    this.instrument['scaleTuning']
  );
  this.schedulePlaybackRate();
};