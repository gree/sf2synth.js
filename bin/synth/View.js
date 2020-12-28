import ProgramNames from "./ProgramNames";
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
    return html;
}
function renderProgramOptions(programNames, bank) {
    let html = "";
    const names = programNames[bank];
    for (let i in names) {
        const name = names[i];
        if (name == "None (None)")
            continue;
        html += `<option value="${i}">${i}: ${name}</option>`;
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
  `);
}
function programNamesFromBankSet(bankSet) {
    //return objectMap(bankSet, bank => objectMap(bank, s => s.name))
    let result = {};
    Object.keys(bankSet).forEach(no => {
        result[no] = bankSet[no];
    });
    return result;
}
function mergeProgramNames(left, right) {
    function mergedKeys(a, b) {
        return new Set([...Object.keys(a), ...Object.keys(b)]);
    }
    const banks = mergedKeys(left, right);
    const result = {};
    banks.forEach(bank => {
        const l = left[bank] || [];
        const r = right[bank] || [];
        const list = {};
        const programs = mergedKeys(l, r);
        programs.forEach(p => {
            list[p] = `${l[p] || "None"} (${r[p] || "None"})`;
        });
        result[bank] = list;
    });
    return result;
}
export default class View {
    constructor() {
        this.drag = false;
    }
    draw(synth) {
        const element = this.element = render(`<div />`);
        const programNames = mergeProgramNames(programNamesFromBankSet(synth.soundFont.getPresetNames()), ProgramNames);
        for (let i = 0; i < 16; ++i) {
            const bank = i !== 9 ? 0 : 128;
            const program = renderProgramOptions(programNames, bank);
            const item = renderInstrument(program);
            const channel = i;
            const select = item.querySelector('select');
            if (select) {
                select.addEventListener('change', event => {
                    const target = event.target;
                    const program = parseInt(target.value, 10);
                    this.programChange(channel, program);
                    synth.programChange(channel, program);
                }, false);
                select.selectedIndex = synth.channels[i].instrument;
            }
            const notes = item.querySelectorAll(".key");
            for (let j = 0; j < 128; ++j) {
                const key = j;
                notes[j].addEventListener('mousedown', event => {
                    event.preventDefault();
                    this.drag = true;
                    this.noteOn(channel, key, 127);
                    synth.noteOn(channel, key, 127);
                    const onMouseUp = event => {
                        document.removeEventListener('mouseup', onMouseUp);
                        event.preventDefault();
                        this.drag = false;
                        this.noteOff(channel, key, 0);
                        synth.noteOff(channel, key, 0);
                    };
                    document.addEventListener('mouseup', onMouseUp);
                });
                notes[j].addEventListener('mouseover', event => {
                    event.preventDefault();
                    if (this.drag) {
                        this.noteOn(channel, key, 127);
                        synth.noteOn(channel, key, 127);
                    }
                });
                notes[j].addEventListener('mouseout', event => {
                    event.preventDefault();
                    this.noteOff(channel, key, 0);
                    synth.noteOff(channel, key, 0);
                });
            }
            element.appendChild(item);
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
        if (!this.element) {
            return null;
        }
        return this.element.querySelectorAll(".instrument")[channel];
    }
    getKeyElement(channel, key) {
        const elem = this.getInstrumentElement(channel);
        if (!elem) {
            return null;
        }
        return elem.querySelectorAll(".key")[key];
    }
    findInstrumentElement(channel, query) {
        const elem = this.getInstrumentElement(channel);
        if (!elem) {
            return null;
        }
        return elem.querySelector(query);
    }
    noteOn(channel, key, _velocity) {
        const element = this.getKeyElement(channel, key);
        if (element) {
            element.classList.add('note-on');
        }
    }
    noteOff(channel, key, _velocity) {
        const element = this.getKeyElement(channel, key);
        if (element) {
            element.classList.remove('note-on');
        }
    }
    programChange(channel, instrument) {
        const select = this.findInstrumentElement(channel, ".program select");
        if (select) {
            select.value = `${instrument}`;
        }
    }
    volumeChange(channel, volume) {
        const element = this.findInstrumentElement(channel, ".volume");
        if (element) {
            element.textContent = `${volume}`;
        }
    }
    panpotChange(channel, panpot) {
        const element = this.findInstrumentElement(channel, ".panpot");
        if (element) {
            element.textContent = `${panpot}`;
        }
    }
    pitchBend(channel, pitchBend) {
        const element = this.findInstrumentElement(channel, ".pitchBend");
        if (element) {
            element.textContent = `${pitchBend}`;
        }
    }
    pitchBendSensitivity(channel, sensitivity) {
        const element = this.findInstrumentElement(channel, ".pitchBendSensitivity");
        if (element) {
            element.textContent = `${sensitivity}`;
        }
    }
    allSoundOff(_channelNumber) {
    }
    setMasterVolume(_volume) {
    }
    resetAllControl(_channelNumber) {
    }
    init() {
    }
    expression(_value) {
    }
    setPercussionPart(_channelNumber, _sw) {
    }
    hold(_channelNumber, _sw) {
    }
    setReverbDepth(_channelNumber, _depth) {
    }
    releaseTime(_channelNumber, _value) {
    }
}
//# sourceMappingURL=View.js.map