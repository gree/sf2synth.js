export default class SynthesizerNote {
  /**
  * @param {AudioContext} ctx
  * @param {AudioNode} destination
  * @param {{
  *   channel: number,
  *   key: number,
  *   sample: Uint8Array,
  *   playbackRate: function,
  *   loopStart: number,
  *   loopEnd: number,
  *   volume: number,
  *   panpot: number
  * }} instrument
  * @constructor
  */
  constructor(ctx, destination, instrument) {
    /** @type {AudioContext} */
    this.ctx = ctx
    /** @type {AudioNode} */
    this.destination = destination
    /** @type {{
     *   channel: number,
     *   key: number,
     *   sample: Uint8Array,
     *   playbackRate: function,
     *   loopStart: number,
     *   loopEnd: number,
     *   volume: number,
     *   panpot: number
     * }}
     */
    this.instrument = instrument
    /** @type {number} */
    this.channel = instrument.channel
    /** @type {number} */
    this.key = instrument.key
    /** @type {number} */
    this.velocity = instrument.velocity
    /** @type {Int16Array} */
    this.buffer = instrument.sample
    /** @type {number} */
    this.playbackRate = instrument.playbackRate(instrument.key)
    /** @type {number} */
    this.sampleRate = instrument.sampleRate
    /** @type {number} */
    this.volume = instrument.volume
    /** @type {number} */
    this.panpot = instrument.panpot
    /** @type {number} */
    this.pitchBend = instrument.pitchBend
    /** @type {number} */
    this.pitchBendSensitivity = instrument.pitchBendSensitivity
    /** @type {number} */
    this.modEnvToPitch = instrument.modEnvToPitch

    // state
    /** @type {number} */
    this.startTime = ctx.currentTime
    /** @type {number} */
    this.computedPlaybackRate = this.playbackRate

    //---------------------------------------------------------------------------
    // audio node
    //---------------------------------------------------------------------------

    /** @type {AudioBuffer} */
    this.audioBuffer
    /** @type {AudioBufferSourceNode} */
    this.bufferSource
    /** @type {AudioPannerNode} */
    this.panner
    /** @type {AudioGainNode} */
    this.gainOutput
  }

  noteOn() {
    const { ctx, instrument, buffer } = this

    const sample = buffer.subarray(0, buffer.length + instrument.end)
    this.audioBuffer = ctx.createBuffer(1, sample.length, this.sampleRate)

    /** @type {Float32Array} */
    const channelData = this.audioBuffer.getChannelData(0)
    channelData.set(sample)

    // buffer source
    const bufferSource = ctx.createBufferSource()
    bufferSource.buffer = this.audioBuffer
    bufferSource.loop = (this.channel !== 9)
    bufferSource.loopStart = instrument.loopStart / this.sampleRate
    bufferSource.loopEnd   = instrument.loopEnd / this.sampleRate
    bufferSource.onended = () => this.disconnect()
    this.bufferSource = bufferSource
    this.updatePitchBend(this.pitchBend)

    // audio node
    const panner = this.panner = ctx.createPanner()
    const output = this.gainOutput = ctx.createGainNode()
    const outputGain = output.gain

    // filter
    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    this.filter = filter

    // panpot
    panner.panningModel = "equalpower"
    panner.setPosition(
      Math.sin(this.panpot * Math.PI / 2),
      0,
      Math.cos(this.panpot * Math.PI / 2)
    )

    //---------------------------------------------------------------------------
    // Attack, Decay, Sustain
    //---------------------------------------------------------------------------
    const now = this.ctx.currentTime
    /** @type {number} */
    const volAttack = now + instrument.volAttack
    /** @type {number} */
    const modAttack = now + instrument.modAttack
    /** @type {number} */
    const volDecay = volAttack + instrument.volDecay
    /** @type {number} */
    const modDecay = modAttack + instrument.modDecay
    /** @type {number} */
    const startTime = instrument.start / this.sampleRate

    outputGain.setValueAtTime(0, now)
    outputGain.linearRampToValueAtTime(this.volume * (this.velocity / 127), volAttack)
    outputGain.linearRampToValueAtTime(this.volume * (1 - instrument.volSustain), volDecay)

    filter.Q.setValueAtTime(instrument.initialFilterQ * Math.pow(10, 200), now)
    const baseFreq = amountToFreq(instrument.initialFilterFc)
    const peekFreq = amountToFreq(instrument.initialFilterFc + instrument.modEnvToFilterFc)
    const sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - instrument.modSustain)
    filter.frequency.setValueAtTime(baseFreq, now)
    filter.frequency.linearRampToValueAtTime(peekFreq, modAttack)
    filter.frequency.linearRampToValueAtTime(sustainFreq, modDecay)

    /**
     * @param {number} val
     * @returns {number}
     */
    function amountToFreq(val) {
      return Math.pow(2, (val - 6900) / 1200) * 440
    }

    // connect
    bufferSource.connect(filter)
    filter.connect(panner)
    panner.connect(output)
    output.connect(this.destination)

    // fire
    bufferSource.start(0, startTime)
  }

  noteOff() {
    const { instrument, bufferSource } = this
    /** @type {AudioGainNode} */
    const output = this.gainOutput
    /** @type {number} */
    const now = this.ctx.currentTime
    /** @type {number} */
    const volEndTime = now + instrument.volRelease
    /** @type {number} */
    const modEndTime = now + instrument.modRelease

    if (!this.audioBuffer) {
      return
    }

    // ignore note off for rhythm track
    if (this.channel === 9) {
      return
    }

    //---------------------------------------------------------------------------
    // Release
    //---------------------------------------------------------------------------
    output.gain.cancelScheduledValues(0)
    output.gain.linearRampToValueAtTime(0, volEndTime)
    bufferSource.playbackRate.cancelScheduledValues(0)
    bufferSource.playbackRate.linearRampToValueAtTime(this.computedPlaybackRate, modEndTime)

    bufferSource.loop = false
    bufferSource.stop(volEndTime)
  }

  disconnect() {
    this.bufferSource.disconnect(0)
    this.panner.disconnect(0)
    this.gainOutput.disconnect(0)
  }

  schedulePlaybackRate() {
    const playbackRate = this.bufferSource.playbackRate
    /** @type {number} */
    const computed = this.computedPlaybackRate
    /** @type {number} */
    const start = this.startTime
    /** @type {Object} */
    const instrument = this.instrument
    /** @type {number} */
    const modAttack = start + instrument.modAttack
    /** @type {number} */
    const modDecay = modAttack + instrument.modDecay
    /** @type {number} */
    const peekPitch = computed * Math.pow(
      Math.pow(2, 1/12),
      this.modEnvToPitch * this.instrument.scaleTuning
    )

    playbackRate.cancelScheduledValues(0)
    playbackRate.setValueAtTime(computed, start)
    playbackRate.linearRampToValueAtTime(peekPitch, modAttack)
    playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - instrument.modSustain), modDecay)
  }

  /**
   * @param {number} pitchBend
   */
  updatePitchBend(pitchBend) {
    this.computedPlaybackRate = this.playbackRate * Math.pow(
      Math.pow(2, 1/12),
      (
        this.pitchBendSensitivity * (
          pitchBend / (pitchBend < 0 ? 8192 : 8191)
        )
      ) * this.instrument.scaleTuning
    )
    this.schedulePlaybackRate()
  }
}
