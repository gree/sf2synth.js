/**
 * @type {Array.<string>}
 * @const
 */
const ProgramNames = [
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
];

/**
 * @type {!Array.<string>}
 * @const
 */
const TableHeader = ['Instrument', 'Vol', 'Pan', 'Bend', 'Range'];

export default class View {
  draw(synth) {
    /** @type {HTMLTableElement} */
    var table = this.table =
      /** @type {HTMLTableElement} */(document.createElement('table'));
    /** @type {HTMLTableSectionElement} */
    var head =
      /** @type {HTMLTableSectionElement} */(document.createElement('thead'));
    /** @type {HTMLTableSectionElement} */
    var body =
      /** @type {HTMLTableSectionElement} */
      (document.createElement('tbody'));
    /** @type {HTMLTableRowElement} */
    var tableLine;
    /** @type {NodeList} */
    var notes;

    head.appendChild(this.createTableLine(TableHeader, true));

    for (let i = 0; i < 16; ++i) {
      tableLine = this.createTableLine(TableHeader.length + 128, false);
      body.appendChild(tableLine);

      const channel = i;

      if (i !== 9) {
        var select = document.createElement('select');
        var option;
        for (let j = 0; j < 128; ++j) {
          option = document.createElement('option');
          option.textContent = ProgramNames[j];
          select.appendChild(option);
        }
        tableLine.querySelector('td:nth-child(1)').appendChild(select);
        select.addEventListener('change', event => {
          synth.programChange(channel, event.target.selectedIndex);
        }, false);
        select.selectedIndex = synth.channelInstrument[i];
      } else {
        tableLine.querySelector('td:first-child').textContent = '[ RHYTHM TRACK ]';
      }

      notes = tableLine.querySelectorAll('td:nth-last-child(-n+128)');
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
    }

    table.appendChild(head);
    table.appendChild(body);

    return table;
  }

  /**
   * @param {!(Array.<string>|number)} array
   * @param {boolean} isTitleLine
   * @returns {HTMLTableRowElement}
   */
  createTableLine(array, isTitleLine) {
    /** @type {HTMLTableRowElement} */
    var tr = /** @type {HTMLTableRowElement} */(document.createElement('tr'));
    /** @type {HTMLTableCellElement} */
    var cell;
    /** @type {boolean} */
    var isArray = array instanceof Array;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il = isArray ? array.length : /** @type {number} */(array);

    for (i = 0; i < il; ++i) {
      cell =
        /** @type {HTMLTableCellElement} */
        (document.createElement(isTitleLine ? 'th' : 'td'));
      cell.textContent = (isArray && array[i] !== void 0) ? array[i] : '';
      tr.appendChild(cell);
    }

    return tr;
  }

  remove() {
    if (!this.table) {
      return;
    }

    this.table.parentNode.removeChild(this.table);
    this.table = null;
  }

  noteOn(channel, key) {
    if (!this.table) {
      return;
    }

    this.table.querySelector(
      'tbody > ' +
        'tr:nth-child(' + (channel+1) + ') > ' +
        'td:nth-child(' + (TableHeader.length+key+1) + ')'
    ).classList.add('note-on');
  }

  noteOff(channel, key) {
    if (!this.table) {
      return;
    }

    this.table.querySelector(
      'tbody > ' +
      'tr:nth-child(' + (channel+1) + ') > ' +
      'td:nth-child(' + (key+TableHeader.length+1) + ')'
    ).classList.remove('note-on');
  }

  programChange(channel, instrument) {
    if (!this.table) {
      return;
    }

    if (channel !== 9) {
      this.table.querySelector('tbody > tr:nth-child(' + (channel+1) + ') > td:first-child > select').selectedIndex = instrument;
    }
  }

  volumeChange(channel, volume) {
    if (!this.table) {
      return;
    }

    this.table.querySelector('tbody > tr:nth-child(' + (channel+1) + ') > td:nth-child(2)').textContent = volume;
  }

  panpotChange(channel, panpot) {
    if (!this.table) {
      return;
    }

    this.table.querySelector('tbody > tr:nth-child(' + (channel+1) + ') > td:nth-child(3)').textContent = panpot;
  }

  pitchBend(channel, calculatedPitch) {
    if (!this.table) {
      return;
    }

    this.table.querySelector('tbody > tr:nth-child(' + (channel+1) + ') > td:nth-child(4)').textContent = calculatedPitch;
  }

  pitchBendSensitivity(channel, sensitivity) {
    if (!this.table) {
      return;
    }

    this.table.querySelector('tbody > tr:nth-child(' + (channel+1) + ') > td:nth-child(5)').textContent = sensitivity;
  }
}
