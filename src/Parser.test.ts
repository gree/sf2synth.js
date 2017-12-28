const fs = require("fs")
import parse from "./Parser"

describe('Parser', () => {
  const input = fs.readFileSync("./fixture/TestSoundFont.sf2")
  const parser = parse(input)
  it("should parse instruments", () => {
    expect(parser.instruments.length).toBe(1)
    expect(parser.instruments[0].instrumentName).toBe("tr909")
  })
  it("should parse samples", () => {
    expect(parser.samples.length).toBe(19)
    expect(parser.sampleHeaders.length).toBe(19)
    expect(parser.sampleHeaders[0].sampleName).toBe("bassdrum1")
    expect(parser.sampleHeaders[0].sampleRate).toBe(44100)
    expect(parser.sampleHeaders[0].originalPitch).toBe(76)
    expect(parser.sampleHeaders[0].pitchCorrection).toBe(6)
  })
  it("should parse presets", () => {
    expect(parser.presetHeaders.length).toBe(1)
    expect(parser.presetHeaders[0].presetName).toBe("tr909")
  })
})
