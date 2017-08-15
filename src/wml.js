import Synthesizer from "./sound_font_synth"
import MessageHandler from "./message_handler"

/**
 * @constructor
 */
const WebMidiLink = function() {
  /** @type {function(ArrayBuffer)} */
  this.loadCallback;
  /** @type {Function} */
  this.messageHandler = this.onmessage.bind(this);

  this.midiMessageHandler = new MidiMessageHandler();

  window.addEventListener('DOMContentLoaded', function() {
    this.ready = true;
  }.bind(this), false);
};

WebMidiLink.prototype.setup = function(url) {
  if (!this.ready) {
    window.addEventListener('DOMContentLoaded', function onload() {
      window.removeEventListener('DOMContentLoaded', onload, false);
      this.load(url);
    }.bind(this), false);
  } else {
    this.load(url);
  }
};

WebMidiLink.prototype.load = function(url) {
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

  xhr.send();
};

/**
 * @param {ArrayBuffer} response
 */
WebMidiLink.prototype.onload = function(response) {
  /** @type {Uint8Array} */
  var input = new Uint8Array(response);

  this.loadSoundFont(input);
};

/**
 * @param {Uint8Array} input
 */
WebMidiLink.prototype.loadSoundFont = function(input) {
  /** @type {Synthesizer} */
  var synth;

  if (!this.synth) {
    synth = this.synth = new Synthesizer(input);
    document.body.appendChild(synth.drawSynth());
    this.midiMessageHandler.synth = synth;
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
WebMidiLink.prototype.onmessage = function(ev) {
  var msg = ev.data.split(',');
  var type = msg.shift();
  var command;

  switch (type) {
    case 'midi':
      this.midiMessageHandler.processMidiMessage(
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
          console.error('unknown link message:', command);
          break;
      }
      break;
    default:
      console.error('unknown message type');
  }
};

/**
 * @param {function(ArrayBuffer)} callback
 */
WebMidiLink.prototype.setLoadCallback = function(callback) {
  this.loadCallback = callback;
};

export default WebMidiLink
