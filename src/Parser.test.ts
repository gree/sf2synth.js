const fs = require("fs")
import Parser from "./Parser"

test('Parser', () => {
  const input = fs.readFileSync("./fixture/TestSoundFont.sf2")
  const parser = new Parser(input)
  parser.parse()
  expect(parser.instrument.length).toBe(2)
  expect(parser.sample.length).toBe(20)
  expect(parser.presetHeader.length).toBe(2)
  expect(parser.presetHeader[0].presetName).toBe("tr909")
})
