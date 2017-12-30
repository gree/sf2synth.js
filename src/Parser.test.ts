const fs = require("fs")
import parse from "./Parser"

describe('Parser', () => {
  const input = fs.readFileSync("./fixture/TestSoundFont.sf2")
  const parser = parse(input)

  it("should parse INFO", () => {
    expect(parser.info.comment).toBe("This is comment")
    expect(parser.info.copyright).toBe("Public Domain")
    expect(parser.info.creationDate).toBe("Nov 28, 2017")
    expect(parser.info.engineer).toBe("ryohey")
    expect(parser.info.name).toBe("TestSoundFont")
    expect(parser.info.product).toBe("PRDCT")
    expect(parser.info.software).toBe("Polyphone")
    expect(parser.info.soundEngine).toBe("EMU8000")
    expect(parser.info.version.major).toBe(2)
    expect(parser.info.version.minor).toBe(0)

    // FIXME: I don't know how to set these values to the soundfont
    // expect(parser.info.romName).toBe("")
    // expect(parser.info.romVersion).toBe("0.00")
  })

  it("should parse instruments", () => {
    expect(parser.instruments.length).toBe(2)
    expect(parser.instruments[0].instrumentName).toBe("tr909")
    expect(parser.instruments[1].instrumentName).toBe("tr909-mod")
  })

  it("should parse samples", () => {
    expect(parser.samples.length).toBe(5)
    expect(parser.sampleHeaders.length).toBe(5)
    expect(parser.sampleHeaders[0].sampleName).toBe("bassdrum1")
    expect(parser.sampleHeaders[0].sampleRate).toBe(44100)
    expect(parser.sampleHeaders[0].originalPitch).toBe(76)
    expect(parser.sampleHeaders[0].pitchCorrection).toBe(6)
  })

  it("should parse presets", () => {
    expect(parser.presetHeaders.length).toBe(2)
    expect(parser.presetHeaders[0].presetName).toBe("tr909")
    expect(parser.presetHeaders[1].presetName).toBe("tr909-mod")
  })
})
