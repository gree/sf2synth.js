const fs = require("fs")
import Parser from "./Parser.ts"
import SoundFont from "./SoundFont.ts"

test('Parser', () => {
  const input = fs.readFileSync("./fixture/clarinet_angel_pure_v1.1.sf2")
  const parser = new Parser(input)
  parser.parse()
  expect(parser.instrument.length).toBe(2)
  expect(parser.sample.length).toBe(11)
  expect(parser.presetHeader.length).toBe(2)
  expect(parser.presetHeader[0].presetName).toBe("Clarinet")
})
