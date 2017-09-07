/**
 * @type {Array.<string>}
 * @const
 */
const ProgramNames = { 0: [
  "Acoustic Piano",
  "Bright Piano",
  "Electric Grand Piano",
  "Honky-tonk Piano",
  "Electric Piano",
  "Electric Piano 2",
  "Harpsichord",
  "Clavi",
  "Celesta",
  "Glockenspiel",
  "Musical box",
  "Vibraphone",
  "Marimba",
  "Xylophone",
  "Tubular Bell",
  "Dulcimer",
  "Drawbar Organ",
  "Percussive Organ",
  "Rock Organ",
  "Church organ",
  "Reed organ",
  "Accordion",
  "Harmonica",
  "Tango Accordion",
  "Acoustic Guitar (nylon)",
  "Acoustic Guitar (steel)",
  "Electric Guitar (jazz)",
  "Electric Guitar (clean)",
  "Electric Guitar (muted)",
  "Overdriven Guitar",
  "Distortion Guitar",
  "Guitar harmonics",
  "Acoustic Bass",
  "Electric Bass (finger)",
  "Electric Bass (pick)",
  "Fretless Bass",
  "Slap Bass 1",
  "Slap Bass 2",
  "Synth Bass 1",
  "Synth Bass 2",
  "Violin",
  "Viola",
  "Cello",
  "Double bass",
  "Tremolo Strings",
  "Pizzicato Strings",
  "Orchestral Harp",
  "Timpani",
  "String Ensemble 1",
  "String Ensemble 2",
  "Synth Strings 1",
  "Synth Strings 2",
  "Voice Aahs",
  "Voice Oohs",
  "Synth Voice",
  "Orchestra Hit",
  "Trumpet",
  "Trombone",
  "Tuba",
  "Muted Trumpet",
  "French horn",
  "Brass Section",
  "Synth Brass 1",
  "Synth Brass 2",
  "Soprano Sax",
  "Alto Sax",
  "Tenor Sax",
  "Baritone Sax",
  "Oboe",
  "English Horn",
  "Bassoon",
  "Clarinet",
  "Piccolo",
  "Flute",
  "Recorder",
  "Pan Flute",
  "Blown Bottle",
  "Shakuhachi",
  "Whistle",
  "Ocarina",
  "Lead 1 (square)",
  "Lead 2 (sawtooth)",
  "Lead 3 (calliope)",
  "Lead 4 (chiff)",
  "Lead 5 (charang)",
  "Lead 6 (voice)",
  "Lead 7 (fifths)",
  "Lead 8 (bass + lead)",
  "Pad 1 (Fantasia)",
  "Pad 2 (warm)",
  "Pad 3 (polysynth)",
  "Pad 4 (choir)",
  "Pad 5 (bowed)",
  "Pad 6 (metallic)",
  "Pad 7 (halo)",
  "Pad 8 (sweep)",
  "FX 1 (rain)",
  "FX 2 (soundtrack)",
  "FX 3 (crystal)",
  "FX 4 (atmosphere)",
  "FX 5 (brightness)",
  "FX 6 (goblins)",
  "FX 7 (echoes)",
  "FX 8 (sci-fi)",
  "Sitar",
  "Banjo",
  "Shamisen",
  "Koto",
  "Kalimba",
  "Bagpipe",
  "Fiddle",
  "Shanai",
  "Tinkle Bell",
  "Agogo",
  "Steel Drums",
  "Woodblock",
  "Taiko Drum",
  "Melodic Tom",
  "Synth Drum",
  "Reverse Cymbal",
  "Guitar Fret Noise",
  "Breath Noise",
  "Seashore",
  "Bird Tweet",
  "Telephone Ring",
  "Helicopter",
  "Applause",
  "Gunshot"
], 128: ["Rhythm Track"]
};

function render(str) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = str.replace(/^\s+/, "");
  return wrapper.firstChild;
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

function mergeProgramNames(left, right) {
  function mergedKeys(a, b) {
    return new Set([...Object.keys(a) ,...Object.keys(b)])
  }
  const banks = mergedKeys(left, right)
  const result = {}
  for (let bank of banks) {
    const l = left[bank] || []
    const r = right[bank] || []
    const list = {}
    const programs = mergedKeys(l, r)
    for (let p of programs) {
      list[p] = `${l[p] || "None"} (${r[p] || "None"})`
    }
    result[bank] = list
  }
  return result
}

export default class View {
  draw(synth) {
    const element = this.element = render(`<div id="root"></div>`);
    const programNames = mergeProgramNames(programNamesFromBankSet(synth.soundFont.bankSet), ProgramNames)

    for (let i = 0; i < 16; ++i) {
      const bank = i !== 9 ? 0 : 128
      const program = renderProgramOptions(programNames, bank)
      const item = renderInstrument(program)

      const channel = i;
      const select = item.querySelector('select');
      if (select) {
        select.addEventListener('change', event => {
          synth.programChange(channel, parseInt(event.target.value, 10));
        }, false);
        select.selectedIndex = synth.channels[i].instrument;
      }

      const notes = item.querySelectorAll(".key");
      for (let j = 0; j < 128; ++j) {
        const key = j;

        notes[j].addEventListener('mousedown', event => {
          event.preventDefault();
          synth.drag = true;
          synth.noteOn(channel, key, 127);
        });
        notes[j].addEventListener('mouseover', event => {
          event.preventDefault();
          if (synth.drag) {
            synth.noteOn(channel, key, 127);
          }
        });
        notes[j].addEventListener('mouseout', event => {
          event.preventDefault();
          synth.noteOff(channel, key, 0);
        });
        notes[j].addEventListener('mouseup', event => {
          event.preventDefault();
          synth.drag = false;
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

    const select = this.getInstrumentElement(channel).querySelector(".program select")

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
