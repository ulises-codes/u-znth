declare module '*-worklet.ts'
declare module '*.worklet.js'

declare module '*.module.scss'

declare interface OscillatorProps {
  isOn: number
  attack: number
  decay: number
  detune: number
  octave: number
  release: number
  shape: number
  vibrato: number
  volume: number
}

declare interface ProcessorProps {
  node?: AudioWorkletNode
  compressor?: DynamicsCompressorNode
  gain?: GainNode
}
