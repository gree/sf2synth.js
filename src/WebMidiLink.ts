import Synthesizer from "./Synthesizer"
import View from "./View"
import MidiMessageHandler from "./MidiMessageHandler"

export default class WebMidiLink {
  loadCallback: (ArrayBuffer) => void
  midiMessageHandler: MidiMessageHandler
  ready: boolean = false
  synth: Synthesizer
  view: View

  constructor() {
    this.midiMessageHandler = new MidiMessageHandler()

    window.addEventListener('DOMContentLoaded', function() {
      this.ready = true
    }.bind(this), false)
  }

  setup(url) {
    if (!this.ready) {
      window.addEventListener('DOMContentLoaded', function onload() {
        window.removeEventListener('DOMContentLoaded', onload, false)
        this.load(url)
      }.bind(this), false)
    } else {
      this.load(url)
    }
  }

  load(url) {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.responseType = 'arraybuffer'

    xhr.addEventListener('load', function(ev) {
      const xhr = ev.target as XMLHttpRequest

      this.onload(xhr.response)
      if (typeof this.loadCallback === 'function') {
        this.loadCallback(xhr.response)
      }
    }.bind(this), false)

    xhr.send()
  }

  onload(response: ArrayBuffer) {
    const input = new Uint8Array(response)
    this.loadSoundFont(input)
  }

  loadSoundFont(input: Uint8Array) {
    let synth: Synthesizer

    if (!this.synth) {
      const ctx = new AudioContext()
      synth = this.synth = new Synthesizer(ctx)
      synth.init()
      synth.refreshInstruments(input)
      synth.connect(ctx.destination)
      const view = this.view = new View()
      document.body.querySelector(".synth")!.appendChild(view.draw(synth))
      this.midiMessageHandler.synth = synth
      window.addEventListener('message', this.onmessage.bind(this), false)
    } else {
      synth = this.synth
      synth.refreshInstruments(input)
    }

    // link ready
    if (window.opener) {
      window.opener.postMessage("link,ready", '*')
    } else if (window.parent !== window) {
      window.parent.postMessage("link,ready", '*')
    }
  }

  onmessage(ev: MessageEvent) {
    const msg = ev.data.split(',')
    const type = msg.shift()

    switch (type) {
      case 'midi':
        this.midiMessageHandler.processMidiMessage(
          msg.map(function(hex) {
            return parseInt(hex, 16)
          })
        )
        break
      case 'link':
        const command = msg.shift()
        switch (command) {
          case 'reqpatch':
            // TODO: dummy data
            if (window.opener) {
              window.opener.postMessage("link,patch", '*')
            } else if (window.parent !== window) {
              window.parent.postMessage("link,patch", '*')
            }
            break
          case 'setpatch':
            // TODO: NOP
            break
          default:
            console.error('unknown link message:', command)
            break
        }
        break
      default:
        console.error('unknown message type')
    }
  }

  setLoadCallback(callback: (ArrayBuffer) => void) {
    this.loadCallback = callback
  }
}
