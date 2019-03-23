import Synthesizer from "./Synthesizer";
import View from "./View";
import MidiMessageHandler from "./MidiMessageHandler";
import delegateProxy from "./delegateProxy";
export default class WebMidiLink {
    constructor() {
        this.ready = false;
        this.midiMessageHandler = new MidiMessageHandler();
        window.addEventListener('DOMContentLoaded', function () {
            this.ready = true;
        }.bind(this), false);
    }
    setup(url) {
        if (!this.ready) {
            window.addEventListener('DOMContentLoaded', function onload() {
                window.removeEventListener('DOMContentLoaded', onload, false);
                this.load(url);
            }.bind(this), false);
        }
        else {
            this.load(url);
        }
    }
    load(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', function (ev) {
            const xhr = ev.target;
            this.onload(xhr.response);
            if (typeof this.loadCallback === 'function') {
                this.loadCallback(xhr.response);
            }
        }.bind(this), false);
        xhr.send();
    }
    onload(response) {
        const input = new Uint8Array(response);
        this.loadSoundFont(input);
    }
    loadSoundFont(input) {
        let synth;
        if (!this.synth) {
            const ctx = new AudioContext();
            synth = this.synth = new Synthesizer(ctx);
            synth.connect(ctx.destination);
            synth.loadSoundFont(input);
            const view = this.view = new View();
            document.body.querySelector(".synth").appendChild(view.draw(synth));
            this.midiMessageHandler.listener = delegateProxy([synth, view]);
            window.addEventListener('message', this.onmessage.bind(this), false);
        }
        else {
            synth = this.synth;
            synth.loadSoundFont(input);
        }
        // link ready
        if (window.opener) {
            window.opener.postMessage("link,ready", '*');
        }
        else if (window.parent !== window) {
            window.parent.postMessage("link,ready", '*');
        }
    }
    onmessage(ev) {
        const msg = ev.data.split(',');
        const type = msg.shift();
        switch (type) {
            case 'midi':
                this.midiMessageHandler.processMidiMessage(msg.map(function (hex) {
                    return parseInt(hex, 16);
                }));
                break;
            case 'link':
                const command = msg.shift();
                switch (command) {
                    case 'reqpatch':
                        // TODO: dummy data
                        if (window.opener) {
                            window.opener.postMessage("link,patch", '*');
                        }
                        else if (window.parent !== window) {
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
    }
    setLoadCallback(callback) {
        this.loadCallback = callback;
    }
}
//# sourceMappingURL=WebMidiLink.js.map