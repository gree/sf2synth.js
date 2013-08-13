goog.provide('SoundFont.WebMidiLink');

goog.require('SoundFont.Synthesizer');

goog.scope(function() {

/**
 * @constructor
 */
SoundFont.WebMidiLink = function() {
  /** @type {Array.<number>} */
  this.NrpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  /** @type {Array.<number>} */
  this.NrpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  /** @type {Array.<number>} */
  this.RpnMsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  /** @type {Array.<number>} */
  this.RpnLsb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  /** @type {boolean} */
  this.ready;
  /** @type {SoundFont.Synthesizer} */
  this.synth;
  /** @type {function(ArrayBuffer)} */
  this.loadCallback;
  /** @type {Function} */
  this.messageHandler = this.onmessage.bind(this);
  /** @type {XMLHttpRequest} */
  this.xhr;
  /** @type {boolean} */
  this.rpnMode = true;

  window.addEventListener('DOMContentLoaded', function() {
    this.ready = true;
  }.bind(this), false);
};

SoundFont.WebMidiLink.prototype.setup = function(url) {
  if (!this.ready) {
    window.addEventListener('DOMContentLoaded', function onload() {
      window.removeEventListener('DOMContentLoaded', onload, false);
      this.load(url);
    }.bind(this), false);
  } else {
    this.load(url);
  }
};

SoundFont.WebMidiLink.prototype.load = function(url) {
  /** @type {XMLHttpRequest} */
  var xhr;

  this.cancelLoading();

  xhr = this.xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';

  xhr.addEventListener('load', function(ev) {
    /** @type {XMLHttpRequest} */
    var xhr = ev.target;

    this.onload(xhr.response);
    if (typeof this.loadCallback === 'function') {
      this.loadCallback(xhr.response);
    }

    this.xhr = null;
  }.bind(this), false);

  xhr.send();
};

SoundFont.WebMidiLink.prototype.setReverb = function(reverb) {
  this.synth.setReverb(reverb);
};

SoundFont.WebMidiLink.prototype.loadIR = function(data) {
  this.synth.loadIR(data);
};

SoundFont.WebMidiLink.prototype.cancelLoading = function() {
  if (this.xhr) {
    this.xhr.abort();
    this.xhr = null;
  }
};

/**
 * @param {ArrayBuffer} response
 */
SoundFont.WebMidiLink.prototype.onload = function(response) {
  /** @type {Uint8Array} */
  var input = new Uint8Array(response);

  this.loadSoundFont(input);
};

/**
 * @param {Uint8Array} input
 */
SoundFont.WebMidiLink.prototype.loadSoundFont = function(input) {
  /** @type {SoundFont.Synthesizer} */
  var synth;

  this.cancelLoading();

  if (!this.synth) {
    synth = this.synth = new SoundFont.Synthesizer(input);
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
SoundFont.WebMidiLink.prototype.onmessage = function(ev) {
  var msg = ev.data.split(',');
  var type = msg.shift();
  var command;

  switch (type) {
    case 'midi':
      this.processMidiMessage(
        msg.map(function(hex) {
          return parseInt(hex, 16);
        })
      );
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
          goog.global.console.error('unknown link message:', command);
          break;
      }
      break;
    default:
      goog.global.console.error('unknown message type');
  }
};

/**
 * @param {function(ArrayBuffer)} callback
 */
SoundFont.WebMidiLink.prototype.setLoadCallback = function(callback) {
  this.loadCallback = callback;
};

/**
 * @param {Array.<number>} message
 */
SoundFont.WebMidiLink.prototype.processMidiMessage = function(message) {
  /** @type {number} */
  var channel = message[0] & 0x0f;
  /** @type {SoundFont.Synthesizer} */
  var synth = this.synth;

  switch (message[0] & 0xf0) {
    case 0x80: // NoteOff: 8n kk vv
      synth.noteOff(channel, message[1], message[2]);
      break;
    case 0x90: // NoteOn: 9n kk vv
      if (message[2] > 0) {
        synth.noteOn(channel, message[1], message[2]);
      } else {
        synth.noteOff(channel, message[1], 0);
      }
      break;
    case 0xB0: // Control Change: Bn cc dd
      switch (message[1]) {
        case 0x06: // Data Entry(MSB): Bn 06 dd
          if (this.rpnMode) {
            // RPN
            switch (this.RpnMsb[channel]) {
              case 0:
                switch (this.RpnLsb[channel]) {
                  case 0: // Pitch Bend Sensitivity
                    synth.pitchBendSensitivity(channel, message[2]);
                    break;
                  case 1:
                    //console.log("fine");
                    break;
                  case 2:
                    //console.log("coarse");
                    break;
                  default:
                    //console.log("default");
                    break;
                }
                break;
              default:
                //console.log("default:", this.RpnMsb[channel], this.RpnLsb[channel]);
                break;
            }
          } else {
            // NRPN
            switch (this.NrpnMsb[channel]) {
              case 26: // Drum Instrument Level
                synth.drumInstrumentLevel(this.NrpnLsb[channel], message[2]);
                break;
              default:
                //console.log("default:", this.RpnMsb[channel], this.RpnLsb[channel]);
                break;
            }
          }
          break;
        case 0x26: // Data Entry(LSB): Bn 26 dd
          if (this.rpnMode) {
            // RPN
            switch (this.RpnMsb[channel]) {
              case 0:
                switch (this.RpnLsb[channel]) {
                  case 0: // Pitch Bend Sensitivity
                    synth.pitchBendSensitivity(
                      channel,
                      synth.getPitchBendSensitivity(channel) + message[2] / 100
                    );
                    break;
                  case 1:
                    //console.log("fine");
                    break;
                  case 2:
                    //console.log("coarse");
                    break;
                }
                break;
            }
          }
          // NRPN で LSB が必要なものは今のところない
          break;
        case 0x07: // Volume Change: Bn 07 dd
          synth.volumeChange(channel, message[2]);
          break;
        case 0x0A: // Panpot Change: Bn 0A dd
          synth.panpotChange(channel, message[2]);
          break;
        case 0x78: // All Sound Off: Bn 78 00
          synth.allSoundOff(channel);
          break;
        case 0x79: // Reset All Control: Bn 79 00
          synth.resetAllControl(channel);
          break;
        case 0x20: // BankSelect
          //console.log("bankselect:", channel, message[2]);
          break;
        case 0x60: //
          //console.log(60);
          break;
        case 0x61: //
          //console.log(61);
          break;
        case 0x62: // NRPN LSB
          this.rpnMode = false;
          this.NrpnLsb[channel] = message[2];
          break;
        case 0x63: // NRPN MSB
          this.rpnMode = false;
          this.NrpnMsb[channel] = message[2];
          break;
        case 0x64: // RPN LSB
          this.rpnMode = true;
          this.RpnLsb[channel] = message[2];
          break;
        case 0x65: // RPN MSB
          this.rpnMode = true;
          this.RpnMsb[channel] = message[2];
          break;
        case 0x40: // Hold
          synth.hold(channel, message[2]);
          break;
        case 0x0b: // Expression
          synth.expression(channel, message[2]);
          break;
        case 0x4a: // ReleaseTime
          synth.releaseTime(channel, message[2]);
          break;
        default:
        // not supported
          break;
      }
      break;
    case 0xC0: // Program Change: Cn pp
      synth.programChange(channel, message[1]);
      break;
    case 0xE0: // Pitch Bend
      synth.pitchBend(channel, message[1], message[2]);
      break;
    case 0xf0: // System Exclusive Message
      // ID number
      switch (message[1]) {
        case 0x7e: // non-realtime
          // TODO
          break;
        case 0x7f: // realtime
          var device = message[2];
          // sub ID 1
          switch (message[3]) {
            case 0x04: // device control
              // sub ID 2
              switch (message[4]) {
                case 0x01: // master volume
                  synth.setMasterVolume(message[5] + (message[6] << 7));
                  break;
              }
              break;
          }
          break;
      }
      break;
    default: // not supported
      break;
  }
};

});
