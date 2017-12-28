const fs = require("fs")
import parse from "./Parser"

describe('Parser', () => {
  const input = fs.readFileSync("./fixture/TestSoundFont.sf2")
  const parser = parse(input)
  it("should parse instruments", () => {
    expect(parser.instrument.length).toBe(1)
    expect(parser.instrument[0].instrumentName).toBe("tr909")
  })
  it("should parse samples", () => {
    expect(parser.sample.length).toBe(19)
    expect(parser.sampleHeader.length).toBe(19)
    expect(parser.sampleHeader[0].sampleName).toBe("bassdrum1")
    expect(parser.sampleHeader[0].sampleRate).toBe(44100)
    expect(parser.sampleHeader[0].originalPitch).toBe(76)
    expect(parser.sampleHeader[0].pitchCorrection).toBe(6)
  })
  it("should parse presets", () => {
    expect(parser.presetHeader.length).toBe(1)
    expect(parser.presetHeader[0].presetName).toBe("tr909")
  })
})
