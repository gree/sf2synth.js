export function readString(
  data: Uint8Array,
  start: number,
  end: number
): string {
  const str = String.fromCharCode.apply(null, data.subarray(start, end))
  const nullLocation = str.indexOf("\u0000")
  if (nullLocation > 0) {
    return str.substr(0, nullLocation)
  }
  return str
}
