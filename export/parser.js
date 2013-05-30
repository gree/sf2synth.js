goog.require("SoundFont.Parser");

/** @define {boolean} */
var SF2_PARSER_EXPORT = false;

if (SF2_PARSER_EXPORT) {
  goog.exportSymbol("SoundFont.Parser", SoundFont.Parser);
  goog.exportSymbol(
    "SoundFont.Parser.prototype.parse",
    SoundFont.Parser.prototype.parse
  );
}