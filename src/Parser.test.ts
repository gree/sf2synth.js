const fs = require("fs")
import parse from "./Parser"

test('Parser', () => {
  const input = fs.readFileSync("./fixture/TestSoundFont.sf2")
  const parser = parse(input)
  expect(parser.instrument.length).toBe(1)
  expect(parser.sample.length).toBe(19)
  expect(parser.presetHeader.length).toBe(1)
  expect(parser.presetHeader[0].presetName).toBe("tr909")
})
