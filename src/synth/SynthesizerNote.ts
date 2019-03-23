import { NoteInfo } from "../parser/SoundFont"

export interface InstrumentState {
  channel: number
  key: number
  volume: number
  panpot: number
  velocity: number
  pitchBend: number
  pitchBendSensitivity: number
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
  noteInfo: NoteInfo
  instrument: InstrumentState
  channel: number
  key: number
  velocity: number
  playbackRate: number
  volume: number
  panpot: number
  pitchBend: number
  pitchBendSensitivity: number

  // state
  startTime: number
  computedPlaybackRate: number

  constructor(ctx: AudioContext, destination: AudioNode, noteInfo: NoteInfo, instrument: InstrumentState) {
    this.ctx = ctx
    this.destination = destination
    this.noteInfo = noteInfo
    this.playbackRate = noteInfo.playbackRate(instrument.key)
    this.instrument = instrument
    this.channel = instrument.channel
    this.key = instrument.key
    this.velocity = instrument.velocity
    this.volume = instrument.volume
    this.panpot = instrument.panpot
    this.pitchBend = instrument.pitchBend
    this.pitchBendSensitivity = instrument.pitchBendSensitivity
    this.startTime = ctx.currentTime
    this.computedPlaybackRate = this.playbackRate
  }

  noteOn() {
    const { ctx, noteInfo } = this

    const sample = noteInfo.sample.subarray(0, noteInfo.sample.length + noteInfo.end)
    this.audioBuffer = ctx.createBuffer(1, sample.length, noteInfo.sampleRate)

    const channelData = this.audioBuffer.getChannelData(0)
    channelData.set(sample)

    // buffer source
    const bufferSource = ctx.createBufferSource()
    bufferSource.buffer = this.audioBuffer
    bufferSource.loop = (this.channel !== 9)
    bufferSource.loopStart = noteInfo.loopStart / noteInfo.sampleRate
    bufferSource.loopEnd = noteInfo.loopEnd / noteInfo.sampleRate
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
    const volAttackTime = now + noteInfo.volAttack
    const modAttackTime = now + noteInfo.modAttack
    const volDecay = volAttackTime + noteInfo.volDecay
    const modDecay = modAttackTime + noteInfo.modDecay
    const startTime = noteInfo.start / noteInfo.sampleRate

    const attackVolume = this.volume * (this.velocity / 127)
    outputGain.setValueAtTime(0, now)
    outputGain.linearRampToValueAtTime(attackVolume, volAttackTime)
    outputGain.linearRampToValueAtTime(attackVolume * (1 - noteInfo.volSustain), volDecay)

    filter.Q.setValueAtTime(noteInfo.initialFilterQ / 10, now)
    const baseFreq = amountToFreq(noteInfo.initialFilterFc)
    const peekFreq = amountToFreq(noteInfo.initialFilterFc + noteInfo.modEnvToFilterFc)
    const sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - noteInfo.modSustain)
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
    const { noteInfo, bufferSource } = this
    const output = this.gainOutput
    const now = this.ctx.currentTime
    const volEndTime = now + noteInfo.volRelease
    const modEndTime = now + noteInfo.modRelease

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
    const { noteInfo } = this
    const playbackRate = this.bufferSource.playbackRate
    const computed = this.computedPlaybackRate
    const start = this.startTime
    const modAttack = start + noteInfo.modAttack
    const modDecay = modAttack + noteInfo.modDecay
    const peekPitch = computed * Math.pow(
      Math.pow(2, 1 / 12),
      noteInfo.modEnvToPitch * noteInfo.scaleTuning
    )

    playbackRate.cancelScheduledValues(0)
    playbackRate.setValueAtTime(computed, start)
    playbackRate.linearRampToValueAtTime(peekPitch, modAttack)
    playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - noteInfo.modSustain), modDecay)
  }

  updatePitchBend(pitchBend: number) {
    this.computedPlaybackRate = this.playbackRate * Math.pow(
      Math.pow(2, 1 / 12),
      (
        this.pitchBendSensitivity * (
          pitchBend / (pitchBend < 0 ? 8192 : 8191)
        )
      ) * this.noteInfo.scaleTuning
    )
    this.schedulePlaybackRate()
  }
}
