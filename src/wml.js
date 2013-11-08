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
        case 0x00: // Bank Select MSB: Bn 00 dd
          synth.bankSelectMsb(channel,message[2]);
          break;
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
        case 0x20: // BankSelect LSB: Bn 00 dd
          synth.bankSelectLsb(channel, message[2]);
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
          // GM Reset: 7F 09 01
          if (message[2] === 0x7f && message[3] === 0x09 && message[4] === 0x01) {
            synth.init();
          }
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

      // Vendor
      switch (message[2]) {
        case 0x43: // Yamaha XG
          switch (message[7]) {
            case 0x04:
              // XG Master Volume: FO 43 10 4C 00 00 04 [value] F7
              synth.setMasterVolume(message[8] << 7 );
              break;
            case 0x7E:
              // XG Reset: F0 43 10 4C 00 00 7E 00 F7
              synth.init();
              synth.isXG = true;
              break;
          }
          break;
        case 0x41: // Roland GS / TG300B Mode
          // TODO
          switch (message[8]) {
            case 0x04:
              // GS Master Volume: F0 41 [dev] 42 12 40 00 04 [value] 58 F7
                synth.setMasterVolume(message[9] << 7);
              break;
            case 0x7F:
              // GS Reset: F0 41 [dev] 42 12 40 00 7F 00 41 F7
              synth.init();
              synth.isGS = true;
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
