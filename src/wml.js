goog.provide('SoundFont.WebMidiLink');

goog.require('SoundFont.Synthesizer');

goog.scope(function() {

/**
 * @constructor
 */
SoundFont.WebMidiLink = function() {
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
  var xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';

  xhr.addEventListener('load', function(ev) {
    /** @type {XMLHttpRequest} */
    var xhr = ev.target;

    this.onload(xhr.response);
    if (typeof this.loadCallback === 'function') {
      this.loadCallback(xhr.response);
    }
  }.bind(this), false);
  
  xhr.addEventListener('progress', function(ev){
    if (ev.lengthComputable) {
      var percentComplete = ev.loaded / ev.total;
      if (document.getElementById('message')){
        document.getElementById('message').firstChild.nodeValue = 'Now Loading...'+percentComplete+'%';
      }
    } else {
      // Unable to compute progress information since the total size is unknown
    }
  }, false);

  xhr.send();
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
          //console.log("BankSelect MSB:", channel, message[2]);
          synth.bankSelectMsb(channel,message[2]);
          break;
        case 0x01: // Modulation
          // TODO
          // synth.modulation(channel, message[2]);
          break;
        case 0x06: // Data Entry: Bn 06 dd
          switch (this.RpnMsb[channel]) {
            case 0:
              switch (this.RpnLsb[channel]) {
                case 0: // Pitch Bend Sensitivity
                  synth.pitchBendSensitivity(channel, message[2]);
                  break;
              }
              break;
          }
          break;
        case 0x07: // Volume Change: Bn 07 dd
          synth.volumeChange(channel, message[2]);
          break;
        case 0x0A: // Panpot Change: Bn 0A dd
          synth.panpotChange(channel, message[2]);
          break;
        case 0x0B: // Expression: Bn 0B dd
          synth.Expression(channel,message[2]);
          break;
        case 0x20: // BankSelect LSB: Bn 00 dd
          //console.log("BankSelect LSB:", channel, message[2]);
          synth.bankSelectLsb(channel, message[2]);
          break;
        case 0x40: // Hold Pedal: Bn 00 dd
          // ホールドペダルは0以外有効なのでbooleanで渡す
          //synth.holdPedal(channel, message[2] !== 0);
          break;
        case 0x41: // Portamento : Bn 00 dd
          //synth.portamento(channel, message[2]);
          break;
        case 0x78: // All Sound Off: Bn 78 00
          synth.allSoundOff(channel);
          break;
        case 0x79: // Reset All Control: Bn 79 00
          synth.resetAllControl(channel);
          break;
        case 0x7B: // All Note Off
          synth.allNoteOff(channel);
          break;
        case 0x64: // RPN MSB
          this.RpnMsb[channel] = message[2];
          break;
        case 0x65: // RPN LSB
          this.RpnLsb[channel] = message[2];
          break;
        default:
        // not supported
      }
      break;
    case 0xC0: // Program Change: Cn pp
      synth.programChange(channel, message[1]);
      break;
    case 0xE0: // Pitch Bend
      synth.pitchBend(channel, message[1], message[2]);
      break;
    case 0xf0: // System Exclusive Message
      // console.log(message[2].toString(16),message[3].toString(16),message[4].toString(16),message[5].toString(16),message[6].toString(16),message[7].toString(16));
      switch (message[2]) {
        case 0x43: // Yamaha XG
          switch (message[5]) {
            case 0x00:
              switch (message[7]) {
                case 0x04:
                  // XG Master Volume (FO 43 10 4C 00 00 04 [value] F7)
                  synth.setMasterVolume(message[8] << 7 );
                break;
                case 0x7E:
                  // XG Reset (F0 43 10 4C 00 00 7E 00 F7)
                  synth.init();
                  synth.isXG = true;
                break;
              }
              break;
            case 0x20:
              // TODO:
              // Reverb Effect (F0 43 10 4C 02 01 00 01 [effect type] F7)
              // Chorus Effect (F0 43 10 4C 02 01 00 43 [effect type] F7)
              // Variation Effect (F0 43 10 4C 02 01 00 05 [effect type] F7)
              break;
            case 0x08:
              // Drum mode (F0 43 10 4C 08 [channel] 07 [mode] F7)
              synth.bankSelectMsb(message[6],127);
              break;
          }
          break;
        case 0x41: // Roland GS / TG300B Mode
          // TODO
          switch (message[8]) {
            case 0x04:
              // GS Master Volume (F0 41 10 42 12 40 00 04 [value] 58 F7)
              synth.setMasterVolume(message[9] << 7);
              break;
            case 0x7F:
              // GS Reset (F0 41 10 42 12 40 00 7F 00 41 F7)
              synth.init();
              synth.isGS = true;
              break;
          }
          break;
        case 0x7e: // GM Reset (F0 7E 7F 09 01 F7)
          // TODO
          synth.init();
          break;
        case 0x7f: // GM Command
          // sub ID 1
          switch (message[3]) {
            case 0x04: // device control
              // sub ID 2
              switch (message[4]) {
                case 0x01: // master volume (F0 7F 7F 04 01 00 [value] F7)
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
