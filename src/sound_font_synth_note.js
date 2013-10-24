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
  this.reverb = instrument['reverb'];

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
  /** @type {number} */
  var reverb = instrument['reverb'];

  var convolverGain;
  var convolver;

  sample = sample.subarray(0, sample.length + instrument['end']);
  buffer = this.audioBuffer = ctx.createBuffer(1, sample.length, this.sampleRate);
  channelData = buffer.getChannelData(0);
  channelData.set(sample);

  // buffer source
  bufferSource = this.bufferSource = ctx.createBufferSource();
  bufferSource.buffer = buffer;
  bufferSource.loop = (this.channel !== 9);
  bufferSource.loopStart = loopStart;
  bufferSource.loopEnd   = loopEnd;
  this.updatePitchBend(this.pitchBend);

  // Create convolver for effect
  convolver = ctx.createConvolver();
  convolver.buffer = this.impulseResponse();

  // Effect node
  convolverGain = ctx.createGain();
  convolverGain.gain.value = reverb / 127;
  convolver.connect(convolverGain);
  convolverGain.connect(this.destination);

  // audio node
  panner = this.panner = ctx.createPanner();
  output = this.gainOutput = ctx.createGainNode();
  outputGain = output.gain;

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
  // Attack, Decay, Sustain
  //---------------------------------------------------------------------------
  outputGain.setValueAtTime(0, now);
  outputGain.linearRampToValueAtTime(this.volume * (1 - instrument['volSustain']), volDecay);
  outputGain.linearRampToValueAtTime(this.volume * Math.pow(this.velocity/127, 2), volAttack);	// 指数関数使わないとカーブが急すぎる

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
//  output.connect(convolver);
  output.connect(this.destination);

  // fire
  bufferSource.start(0, startTime);
};



SoundFont.SynthesizerNote.prototype.noteOff = function() {
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
  setTimeout(
    (function(note) {
      return function() {
        note.bufferSource.disconnect(0);
        note.panner.disconnect(0);
        note.gainOutput.disconnect(0);
      };
    })(this),
    instrument['volRelease'] * 1000
  );
  //*/
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

/**
 * @param {number} pitchBend
 */
SoundFont.SynthesizerNote.prototype.updatePitchBend = function(pitchBend) {
  this.computedPlaybackRate = this.playbackRate * Math.pow(
    Math.pow(2, 1/12),
    (
      this.pitchBendSensitivity * (
        pitchBend / (pitchBend < 0 ? 8192 : 8191)
      )
    ) * this.instrument['scaleTuning']
  );
  this.schedulePlaybackRate();
};

/**
 * impulse responce
 */
SoundFont.SynthesizerNote.prototype.impulseResponse = function(){
  var source = window.atob('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');
  var array = new Uint8Array(new ArrayBuffer(source.length));
  for(var i = 0; i < source.length; i++) {
    array[i] = source.charCodeAt(i);
  }
  return array;
}