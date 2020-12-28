const fs = require("fs")
import parse from "./Parser"
import SoundFont, { convertTime } from "./SoundFont"

describe("SoundFont", () => {
  const input = fs.readFileSync("./fixture/TestSoundFont.sf2")
  const parsed = parse(input)
  const soundFont = new SoundFont(parsed)
  expect(soundFont).not.toBeNull()

  it("should create Preset Zone", () => {
    const zone = soundFont.getPresetZone(0)
    expect(zone).not.toBeNull()
  })

  it("should create Instrument Zone", () => {
    const ids = soundFont.getInstrumentZoneIndexes(1)
    {
      const zone = soundFont.getInstrumentZone(ids[0]) // 最初に Global Zone が入っている
      expect(zone.sampleID).toBeUndefined() // Global Zone は sample ID を持たない
      expect(convertTime(zone.volAttack)).toBeCloseTo(0.123)
      expect(convertTime(zone.volDecay)).toBeCloseTo(0.234)
    }
    {
      const zone = soundFont.getInstrumentZone(ids[1])
      expect(zone.sampleID).not.toBeUndefined() // Instrument Zone は sample ID を持つ
    }
  })

  it("should create InstrumentKey", () => {
    const key = soundFont.getInstrumentKey(0, 0, 40, 100)!
    expect(key).not.toBeNull()
    expect(key.sampleName).toBe("crash")
    expect(key.keyRange.lo).toBe(40)
    expect(key.keyRange.hi).toBe(40)

    expect(key.volAttack).toBeCloseTo(0.2)
    expect(key.volDecay).toBeCloseTo(0.4)
    // expect(key.volSustain).toBeCloseTo(0.5)
    expect(key.volRelease).toBeCloseTo(0.6)

    expect(key.modAttack).toBeCloseTo(0.2)
    expect(key.modDecay).toBeCloseTo(0.4)
    expect(key.modSustain).toBeCloseTo(0.5 / 100)
    expect(key.modRelease).toBeCloseTo(0.6)
    expect(key.modEnvToPitch).toBeCloseTo(1 / 100)
    expect(key.modEnvToFilterFc).toBeCloseTo(2)
  })

  it("should apply Global Instrument Zone", () => {
    const key = soundFont.getInstrumentKey(0, 1, 40, 100)!
    expect(key.volAttack).toBeCloseTo(0.123) // Global の値が使われている
    expect(key.volDecay).toBeCloseTo(0.345) // Global の値が上書きされている
  })
})
