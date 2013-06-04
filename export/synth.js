goog.require("SoundFont.WebMidiLink");

/** @define {boolean} */
var SF2_SYNTH_EXPORT = false;

if (SF2_SYNTH_EXPORT) {
  goog.exportSymbol("SoundFont.WebMidiLink", SoundFont.WebMidiLink);
  goog.exportSymbol(
    "SoundFont.WebMidiLink.prototype.setup",
    SoundFont.WebMidiLink.prototype.setup
  );
  goog.exportSymbol(
    "SoundFont.WebMidiLink.prototype.loadSoundFont",
    SoundFont.WebMidiLink.prototype.loadSoundFont
  );
  goog.exportSymbol(
    "SoundFont.WebMidiLink.prototype.cancelLoading",
    SoundFont.WebMidiLink.prototype.cancelLoading
  );
  goog.exportSymbol(
    "SoundFont.WebMidiLink.prototype.setLoadCallback",
    SoundFont.WebMidiLink.prototype.setLoadCallback
  );
}