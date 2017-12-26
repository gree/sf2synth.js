const fs = require("fs")
import Parser from "./sf2.ts"
import SoundFont from "./sound_font.ts"

test('Parser', () => {
  const input = fs.readFileSync("./fixture/clarinet_angel_pure_v1.1.sf2")
  const parser = new Parser(input)
  parser.parse()
  expect(parser.instrument.length).toBe(2)
  expect(parser.sample.length).toBe(11)
  expect(parser.presetHeader.length).toBe(2)
  expect(parser.presetHeader[0].presetName).toBe("Clarinet")
})
