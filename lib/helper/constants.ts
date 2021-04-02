/// <reference path="../../types/index.d.ts" />

export const paramValueList = [
  { name: 'volume', min: 0, max: 0.8, step: 0.008, unit: '%' },
  { name: 'vibrato', min: 0, max: 10, step: 1, unit: '%' },
  { name: 'attack', min: 0, max: 2, step: 0.01, unit: 'ms' },
  { name: 'release', min: 0, max: 1, step: 0.01, unit: 'ms' },
  { name: 'decay', min: 0, max: 1, step: 0.01, unit: 'ms' },
]

export const VOICES = 24

export const OSC_QTY = 4

export const NOTE_PROPS = [
  'MIDI',
  'FREQ',
  'PRESS_TIME',
  'RELEASE_TIME',
  'MAX_RELEASE_END',
]

export const PARAMS_LIST: (keyof OscillatorProps)[] = [
  'isOn',
  'attack',
  'decay',
  'detune',
  'octave',
  'release',
  'shape',
  'vibrato',
  'volume',
]

export const GLOBAL_PARAMS: string[] = ['SUSTAIN_IS_ON', 'SUSTAIN_START_TIME']
