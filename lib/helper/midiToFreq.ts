// https://medium.com/swinginc/playing-with-midi-in-javascript-b6999f2913c3
export default function midiToFreq(key: number) {
  const a = Math.pow(2, (key - 69) / 12)

  return a * 440
}
