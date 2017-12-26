import { Instrument } from "./Structs.ts";

interface InstrumentState {
  channel: number
  key: number
  sample: Uint8Array
  sampleRate: number
  playbackRate: Function
  start: number
  end: number
  loopStart: number
  loopEnd: number
  volume: number
  panpot: number
  volAttack: number
  modAttack: number
  velocity: number
  pitchBend: number
  pitchBendSensitivity: number
  modEnvToPitch: number
  modEnvToFilterFc: number
  initialFilterFc: number
  initialFilterQ: number
  volDecay: number
  volSustain: number
  volRelease: number
  modDecay: number
  modSustain: number
  modRelease: number
  scaleTuning: number
}

export default class SynthesizerNote {

  //---------------------------------------------------------------------------
  // audio node
  //---------------------------------------------------------------------------

  audioBuffer: AudioBuffer
  bufferSource: AudioBufferSourceNode
  panner: PannerNode
  gainOutput: GainNode
  ctx: AudioContext
  destination: AudioNode
  filter: BiquadFilterNode
  instrument: InstrumentState
  channel: number
  key: number
  velocity: number
  buffer: Uint8Array
  playbackRate: number
  sampleRate: number
  volume: number
  panpot: number
  pitchBend: number
  pitchBendSensitivity: number
  modEnvToPitch: number

  // state
  startTime: number
  computedPlaybackRate: number

  constructor(ctx: AudioContext, destination: AudioNode, instrument: InstrumentState) {
    this.ctx = ctx
    this.destination = destination
    this.instrument = instrument
    this.channel = instrument.channel
    this.key = instrument.key
    this.velocity = instrument.velocity
    this.buffer = instrument.sample
    this.playbackRate = instrument.playbackRate(instrument.key)
    this.sampleRate = instrument.sampleRate
    this.volume = instrument.volume
    this.panpot = instrument.panpot
    this.pitchBend = instrument.pitchBend
    this.pitchBendSensitivity = instrument.pitchBendSensitivity
    this.modEnvToPitch = instrument.modEnvToPitch
    this.startTime = ctx.currentTime
    this.computedPlaybackRate = this.playbackRate
  }

  noteOn() {
    const { ctx, instrument, buffer } = this

    const sample = buffer.subarray(0, buffer.length + instrument.end)
    this.audioBuffer = ctx.createBuffer(1, sample.length, this.sampleRate)

    const channelData = this.audioBuffer.getChannelData(0)
    channelData.set(sample)

    // buffer source
    const bufferSource = ctx.createBufferSource()
    bufferSource.buffer = this.audioBuffer
    bufferSource.loop = (this.channel !== 9)
    bufferSource.loopStart = instrument.loopStart / this.sampleRate
    bufferSource.loopEnd = instrument.loopEnd / this.sampleRate
    bufferSource.onended = () => this.disconnect()
    this.bufferSource = bufferSource
    this.updatePitchBend(this.pitchBend)

    // audio node
    const panner = this.panner = ctx.createPanner()
    const output = this.gainOutput = ctx.createGain()
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
    const volAttackTime = now + instrument.volAttack
    const modAttackTime = now + instrument.modAttack
    const volDecay = volAttackTime + instrument.volDecay
    const modDecay = modAttackTime + instrument.modDecay
    const startTime = instrument.start / this.sampleRate

    const attackVolume = this.volume * (this.velocity / 127)
    outputGain.setValueAtTime(0, now)
    outputGain.linearRampToValueAtTime(attackVolume, volAttackTime)
    outputGain.linearRampToValueAtTime(attackVolume * (1 - instrument.volSustain), volDecay)

    filter.Q.setValueAtTime(instrument.initialFilterQ / 10, now)
    const baseFreq = amountToFreq(instrument.initialFilterFc)
    const peekFreq = amountToFreq(instrument.initialFilterFc + instrument.modEnvToFilterFc)
    const sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - instrument.modSustain)
    filter.frequency.setValueAtTime(baseFreq, now)
    filter.frequency.linearRampToValueAtTime(peekFreq, modAttackTime)
    filter.frequency.linearRampToValueAtTime(sustainFreq, modDecay)

    function amountToFreq(val: number): number {
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
    const output = this.gainOutput
    const now = this.ctx.currentTime
    const volEndTime = now + instrument.volRelease
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
    const computed = this.computedPlaybackRate
    const start = this.startTime
    const instrument = this.instrument
    const modAttack = start + instrument.modAttack
    const modDecay = modAttack + instrument.modDecay
    const peekPitch = computed * Math.pow(
      Math.pow(2, 1 / 12),
      this.modEnvToPitch * this.instrument.scaleTuning
    )

    playbackRate.cancelScheduledValues(0)
    playbackRate.setValueAtTime(computed, start)
    playbackRate.linearRampToValueAtTime(peekPitch, modAttack)
    playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - instrument.modSustain), modDecay)
  }

  updatePitchBend(pitchBend: number) {
    this.computedPlaybackRate = this.playbackRate * Math.pow(
      Math.pow(2, 1 / 12),
      (
        this.pitchBendSensitivity * (
          pitchBend / (pitchBend < 0 ? 8192 : 8191)
        )
      ) * this.instrument.scaleTuning
    )
    this.schedulePlaybackRate()
  }
}
