import Synthesizer from "./sound_font_synth.ts"
import ProgramNames from "./program_names.ts"
import { DOMElement } from "react";

function render(str) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = str.replace(/^\s+/, "");
  return wrapper.firstElementChild;
}

function renderKeys() {
  let html = "";
  for (let i = 0; i < 128; i++) {
    const n = i % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(n);
    html += `<div class="key ${isBlack ? "black" : "white"}"></div>`;
  }
  return html
}

function renderProgramOptions(programNames, bank) {
  let html = ""
  const names = programNames[bank]
  for (let i in names) {
    const name = names[i]
    html += `<option value="${i}">${i}: ${name}</option>`
  }
  return `<select>${html}</select>`;
}

function renderInstrument(program) {
  return render(`
    <div class="instrument">
      <div class="program">${program}</div>
      <div class="volume"></div>
      <div class="panpot"></div>
      <div class="pitchBend"></div>
      <div class="pitchBendSensitivity"></div>
      <div class="keys">${renderKeys()}</div>
    </div>
  `)
}

function programNamesFromBankSet(bankSet) {
  return bankSet.map(bank => bank.map(s => s.name))
}

function mergeProgramNames(left: {[index: number]: string[]}, right: {[index: number]: string[]}) {
  function mergedKeys(a, b) {
    return new Set([...Object.keys(a), ...Object.keys(b)])
  }
  const banks = mergedKeys(left, right)
  const result = {}
  banks.forEach(bank => {
    const l = left[bank] || []
    const r = right[bank] || []
    const list: { [index: number]: string} = {}
    const programs = mergedKeys(l, r)
    programs.forEach(p => {
      list[p] = `${l[p] || "None"} (${r[p] || "None"})`
    })
    result[bank] = list
  })
  return result
}

export default class View {
  private element: Element
  private drag: boolean = false

  draw(synth: Synthesizer): Element {
    const element = this.element = render(`<div />`);
    const programNames = mergeProgramNames(programNamesFromBankSet(synth.soundFont.bankSet), ProgramNames)

    for (let i = 0; i < 16; ++i) {
      const bank = i !== 9 ? 0 : 128
      const program = renderProgramOptions(programNames, bank)
      const item = renderInstrument(program)

      const channel = i;
      const select = item.querySelector('select');
      if (select) {
        select.addEventListener('change', event => {
          const target = event.target as HTMLSelectElement
          synth.programChange(channel, parseInt(target.value, 10));
        }, false);
        select.selectedIndex = synth.channels[i].instrument;
      }

      const notes = item.querySelectorAll(".key");
      for (let j = 0; j < 128; ++j) {
        const key = j;

        notes[j].addEventListener('mousedown', event => {
          event.preventDefault();
          this.drag = true;
          synth.noteOn(channel, key, 127);
        });
        notes[j].addEventListener('mouseover', event => {
          event.preventDefault();
          if (this.drag) {
            synth.noteOn(channel, key, 127);
          }
        });
        notes[j].addEventListener('mouseout', event => {
          event.preventDefault();
          synth.noteOff(channel, key, 0);
        });
        notes[j].addEventListener('mouseup', event => {
          event.preventDefault();
          this.drag = false;
          synth.noteOff(channel, key, 0);
        });
      }

      element.appendChild(item)
    }

    return element;
  }

  remove() {
    if (!this.element) {
      return;
    }

    this.element.parentNode.removeChild(this.element);
    this.element = null;
  }

  getInstrumentElement(channel) {
    return this.element.querySelectorAll(".instrument")[channel]
  }

  getKeyElement(channel, key) {
    return this.getInstrumentElement(channel).querySelectorAll(".key")[key]
  }

  noteOn(channel, key) {
    if (!this.element) {
      return;
    }

    this.getKeyElement(channel, key).classList.add('note-on');
  }

  noteOff(channel, key) {
    if (!this.element) {
      return;
    }

    this.getKeyElement(channel, key).classList.remove('note-on');
  }

  programChange(channel, instrument) {
    if (!this.element) {
      return;
    }

    const select: HTMLSelectElement = this.getInstrumentElement(channel).querySelector(".program select")

    if (select) {
      select.value = instrument;
    }
  }

  volumeChange(channel, volume) {
    if (!this.element) {
      return;
    }

    this.getInstrumentElement(channel).querySelector(".volume").textContent = volume;
  }

  panpotChange(channel, panpot) {
    if (!this.element) {
      return;
    }

    this.getInstrumentElement(channel).querySelector(".panpot").textContent = panpot;
  }

  pitchBend(channel, calculatedPitch) {
    if (!this.element) {
      return;
    }

    this.getInstrumentElement(channel).querySelector(".pitchBend").textContent = calculatedPitch;
  }

  pitchBendSensitivity(channel, sensitivity) {
    if (!this.element) {
      return;
    }

    this.getInstrumentElement(channel).querySelector(".pitchBendSensitivity").textContent = sensitivity;
  }
}
