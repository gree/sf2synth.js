export default class SynthesizerNote {
    constructor(ctx, destination, noteInfo, instrument) {
        this.ctx = ctx;
        this.destination = destination;
        this.noteInfo = noteInfo;
        this.playbackRate = noteInfo.playbackRate(instrument.key);
        this.instrument = instrument;
        this.channel = instrument.channel;
        this.key = instrument.key;
        this.velocity = instrument.velocity;
        this.volume = instrument.volume;
        this.panpot = instrument.panpot;
        this.pitchBend = instrument.pitchBend;
        this.expression = instrument.expression;
        this.pitchBendSensitivity = instrument.pitchBendSensitivity;
        this.startTime = ctx.currentTime;
        this.computedPlaybackRate = this.playbackRate;
    }
    noteOn() {
        const { ctx, noteInfo } = this;
        const sample = noteInfo.sample.subarray(0, noteInfo.sample.length + noteInfo.end);
        this.audioBuffer = ctx.createBuffer(1, sample.length, noteInfo.sampleRate);
        const channelData = this.audioBuffer.getChannelData(0);
        channelData.set(sample);
        // buffer source
        const bufferSource = ctx.createBufferSource();
        bufferSource.buffer = this.audioBuffer;
        bufferSource.loop = this.sampleModes !== 0;
        bufferSource.loopStart = noteInfo.loopStart / noteInfo.sampleRate;
        bufferSource.loopEnd = noteInfo.loopEnd / noteInfo.sampleRate;
        bufferSource.onended = () => this.disconnect();
        this.bufferSource = bufferSource;
        this.updatePitchBend(this.pitchBend);
        // audio node
        const output = this.gainOutput = ctx.createGain();
        const outputGain = output.gain;
        // expression
        this.expressionGain = ctx.createGain();
        //this.expressionGain.gain.value = this.expression / 127;
        this.expressionGain.gain.setTargetAtTime(this.expression / 127, this.ctx.currentTime, 0.015);
        // Modulator
        const modulator = this.modulator = ctx.createBiquadFilter();
        // filter
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        this.filter = filter;
        // panpot
        // TODO: ドラムパートのPanが変化した場合、その計算をしなければならない
        // http://cpansearch.perl.org/src/PJB/MIDI-SoundFont-1.08/doc/sfspec21.html#8.4.6
        const pan = noteInfo.pan ? noteInfo.pan / 120 : this.panpot;
        const panner = this.panner = ctx.createPanner();
        panner.panningModel = "equalpower";
        panner.setPosition(Math.sin(pan * Math.PI / 2), 0, Math.cos(pan * Math.PI / 2));
        //---------------------------------------------------------------------------
        // Delay, Attack, Hold, Decay, Sustain
        //---------------------------------------------------------------------------
        let attackVolume = this.volume * (this.velocity / 127) * (1 - noteInfo.initialAttenuation / 1000);
        if (attackVolume < 0) {
            attackVolume = 0;
        }
        const now = this.ctx.currentTime;
        const volDelay = now + noteInfo.volDelay;
        const volAttack = volDelay + noteInfo.volAttack;
        const volHold = volAttack + noteInfo.volHold;
        const volDecay = volHold + noteInfo.volDecay;
        const modDelay = now + noteInfo.modDelay;
        const modAttack = volDelay + noteInfo.modAttack;
        const modHold = modAttack + noteInfo.modHold;
        const modDecay = modHold + noteInfo.modDecay;
        const startTime = noteInfo.start / noteInfo.sampleRate;
        // volume envelope
        outputGain
            .setValueAtTime(0, now)
            .setValueAtTime(0, volDelay)
            .setTargetAtTime(attackVolume, volDelay, noteInfo.volAttack)
            .setValueAtTime(attackVolume, volHold)
            .linearRampToValueAtTime(attackVolume * (1 - noteInfo.volSustain), volDecay);
        // modulation envelope
        const baseFreq = this.amountToFreq(noteInfo.initialFilterFc);
        const peekFreq = this.amountToFreq(noteInfo.initialFilterFc + noteInfo.modEnvToFilterFc);
        const sustainFreq = baseFreq + (peekFreq - baseFreq) * (1 - noteInfo.modSustain);
        modulator.Q.setValueAtTime(Math.pow(10, noteInfo.initialFilterQ / 200), now);
        //modulator.frequency.value = baseFreq;
        modulator.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.015);
        modulator.type = 'lowpass';
        modulator.frequency
            .setValueAtTime(baseFreq, now)
            .setValueAtTime(baseFreq, modDelay)
            .setTargetAtTime(peekFreq, modDelay, noteInfo.modAttack++) // For FireFox fix
            .setValueAtTime(peekFreq, modHold)
            .linearRampToValueAtTime(sustainFreq, modDecay);
        // connect
        bufferSource.connect(modulator);
        modulator.connect(panner);
        panner.connect(this.expressionGain);
        this.expressionGain.connect(output);
        if (!noteInfo.mute) {
            this.gainOutput.connect(this.destination);
        }
        // fire
        bufferSource.start(0, startTime);
    }
    amountToFreq(val) {
        return Math.pow(2, (val - 6900) / 1200) * 440;
    }
    noteOff() {
        const { noteInfo, bufferSource } = this;
        const output = this.gainOutput;
        const now = this.ctx.currentTime;
        const release = noteInfo.releaseTime - 64;
        //---------------------------------------------------------------------------
        // volume release time
        //---------------------------------------------------------------------------
        const volEndTimeTmp = noteInfo.volRelease * output.gain.value;
        const volEndTime = now + (volEndTimeTmp * (1 + release / (release < 0 ? 64 : 63)));
        //---------------------------------------------------------------------------
        // modulation release time
        //---------------------------------------------------------------------------
        const modulator = this.modulator;
        const baseFreq = this.amountToFreq(noteInfo.initialFilterFc);
        const peekFreq = this.amountToFreq(noteInfo.initialFilterFc + noteInfo.modEnvToFilterFc);
        const modEndTime = now + noteInfo.modRelease *
            (baseFreq === peekFreq ?
                1 :
                (modulator.frequency.value - baseFreq) / (peekFreq - baseFreq));
        //---------------------------------------------------------------------------
        // Release
        //---------------------------------------------------------------------------
        switch (noteInfo.sampleModes) {
            case 0:
                break;
            case 1:
                output.gain.cancelScheduledValues(0);
                output.gain.setValueAtTime(output.gain.value, now);
                output.gain.linearRampToValueAtTime(0, volEndTime);
                modulator.frequency.cancelScheduledValues(0);
                modulator.frequency.setValueAtTime(modulator.frequency.value, now);
                modulator.frequency.linearRampToValueAtTime(baseFreq, modEndTime);
                bufferSource.playbackRate.cancelScheduledValues(0);
                bufferSource.playbackRate.setValueAtTime(bufferSource.playbackRate.value, now);
                bufferSource.playbackRate.linearRampToValueAtTime(this.computedPlaybackRate, modEndTime);
                bufferSource.stop(volEndTime);
                break;
            case 2:
                console.log('detect unused sampleModes');
                break;
            case 3:
                bufferSource.loop = false;
                break;
        }
    }
    disconnect() {
        this.gainOutput.disconnect(0);
    }
    schedulePlaybackRate() {
        const { noteInfo } = this;
        const playbackRate = this.bufferSource.playbackRate;
        const computed = this.computedPlaybackRate;
        const start = this.startTime;
        const modAttack = start + noteInfo.modAttack;
        const modDecay = modAttack + noteInfo.modDecay;
        const peekPitch = computed * Math.pow(Math.pow(2, 1 / 12), noteInfo.modEnvToPitch * noteInfo.scaleTuning);
        playbackRate.cancelScheduledValues(0);
        playbackRate.setValueAtTime(computed, start);
        playbackRate.linearRampToValueAtTime(peekPitch, modAttack);
        playbackRate.linearRampToValueAtTime(computed + (peekPitch - computed) * (1 - noteInfo.modSustain), modDecay);
    }
    updateExpression(expression) {
        this.expressionGain.gain.value = (this.expression = expression) / 127;
    }
    ;
    updatePitchBend(pitchBend) {
        this.computedPlaybackRate = this.playbackRate * Math.pow(Math.pow(2, 1 / 12), (this.pitchBendSensitivity * (pitchBend / (pitchBend < 0 ? 8192 : 8191))) * this.noteInfo.scaleTuning);
        this.schedulePlaybackRate();
    }
}
//# sourceMappingURL=SynthesizerNote.js.map