/// <reference path="./worklet.d.ts" />

export {}

class Oscillator extends AudioWorkletProcessor {
  id: number
  notePropsLength: number
  commView: Int32Array
  notesView: Float64Array
  paramsView: Float64Array
  startIndex: number
  endIndex: number
  params: Float64Array
  globalParams: Float64Array
  peakVol: number[]
  prevVol: number[]
  state: (
    | ''
    | 'ATTACK'
    | 'REATTACK'
    | 'DECAY'
    | 'PRESS'
    | 'RELEASE'
    | 'RELEASED'
  )[]
  sustainDuration: number

  constructor({
    processorOptions: {
      id,
      notesSAB,
      paramsSAB,
      paramsLength,
      commSAB,
      notePropsLength,
      globalParamsStartIndex,
    },
  }: Omit<AudioWorkletNodeOptions, 'processorOptions'> & {
    processorOptions: ProcessorOptions
  }) {
    super()

    this.id = id

    this.notePropsLength = notePropsLength

    this.commView = new Int32Array(commSAB)
    this.notesView = new Float64Array(notesSAB)
    this.paramsView = new Float64Array(paramsSAB)

    this.startIndex = this.id * paramsLength
    this.endIndex = this.startIndex + paramsLength

    this.params = this.paramsView.subarray(
      this.startIndex,
      globalParamsStartIndex
    )

    this.globalParams = this.paramsView.subarray(globalParamsStartIndex)

    this.peakVol = new Array(this.notesView.length / notePropsLength).fill(0)

    this.prevVol = new Array(this.notesView.length / notePropsLength).fill(0)

    this.state = new Array(this.notesView.length / notePropsLength).fill('')

    this.sustainDuration = 10
  }

  calculateSlope(param: number, volume: number) {
    return param ? (-1 * volume) / Math.pow(param, 2) : 0
  }

  calculateVolume(v: number, a: number, x: number, h: number) {
    return a * Math.pow(x - h, 2) + v
  }

  process(_inputs: Float32Array[][], outputs: Float32Array[][]) {
    const output = outputs[0]

    if (!this.params[0] || this.commView[1] === 0) return true

    const attack = this.params[1]
    const decay = this.params[2]
    const detune = this.params[3]
    const octave = this.params[4]
    const release = this.params[5]
    const shape = this.params[6]
    const vibrato = this.params[7]
    const volume = this.params[8]

    const isSustaining = this.globalParams[0] === 1 ? true : false
    const sustainRelease = this.globalParams[1]

    output.forEach(channel => {
      for (let j = 0; j < channel.length; j++) {
        let wave = 0

        const globalTime = currentTime + j / sampleRate

        const period = 2 * Math.PI * globalTime

        const vib = Math.sin(period * vibrato) * 2

        for (let k = 0; k < this.notesView.length; k += this.notePropsLength) {
          if (this.notesView[k] === 0) {
            continue
          }

          const freq = this.notesView[k + 1] + detune
          const pressTime = this.notesView[k + 2]

          const releaseTime = Math.abs(this.notesView[k + 3])

          const maxReleaseEnd = this.notesView[k + 4]

          const releaseEnd = !releaseTime
            ? 0
            : isSustaining
            ? releaseTime + this.sustainDuration
            : releaseTime + release

          const isReleasing = releaseTime > 0 && globalTime > releaseTime

          let v = 0
          let a = 0
          let x = 0
          let h = 0

          let A: number

          const pitch = Math.sin(period * (freq * Math.pow(2, octave)) + vib)

          if (globalTime <= pressTime + attack) {
            if (this.state[k] === 'REATTACK' || this.state[k] === 'RELEASE') {
              a = this.calculateSlope(attack, this.prevVol[k])
              v = this.prevVol[k]
              h = 0

              this.state[k] = 'REATTACK'
            } else {
              a = this.calculateSlope(attack, volume)
              v = volume
              h = attack

              this.state[k] = 'ATTACK'
            }

            x = Math.max(0, globalTime - pressTime)
          } else if (decay > 0 && globalTime > pressTime + attack) {
            if (this.state[k] !== 'DECAY') {
              this.peakVol[k] = this.prevVol[k]

              this.state[k] = 'DECAY'
            }

            if (globalTime <= pressTime + attack + decay) {
              v = this.peakVol[k]
              a = this.calculateSlope(decay, this.peakVol[k])
            } else {
              v = 0
              a = 0
            }

            x = globalTime - pressTime + attack
            h = 0
          } else if (isReleasing) {
            if (releaseEnd > 0 && globalTime >= releaseEnd) {
              this.state[k] = 'RELEASED'
            } else {
              if (this.state[k] !== 'RELEASE') {
                this.peakVol[k] = this.prevVol[k]

                this.state[k] = 'RELEASE'
              }

              if (isSustaining || this.notesView[k + 3] < 0) {
                a = this.calculateSlope(this.sustainDuration, this.peakVol[k])
              } else {
                a = this.calculateSlope(release, this.peakVol[k])
              }

              v = this.peakVol[k]
              x = globalTime - releaseTime
              h = 0
            }
          } else if (!releaseTime) {
            this.state[k] = 'PRESS'
          }

          switch (this.state[k]) {
            case 'RELEASED':
              A = 0
              break
            case 'PRESS':
              A = volume
              break
            default:
              A = this.calculateVolume(v, a, x, h)
              break
          }

          if (
            this.state[k] === 'ATTACK' ||
            this.state[k] === 'REATTACK' ||
            this.state[k] === 'PRESS'
          ) {
            this.peakVol[k] = A
          }

          this.prevVol[k] = A

          switch (shape) {
            case 2:
              if (pitch > 0) {
                wave += pitch * A
              } else {
                wave += pitch * -1 * A
              }

              break
            case 3:
              wave += Math.asin(pitch) * A

              break
            default:
              wave += pitch * A

              break
          }

          if (isReleasing && globalTime > maxReleaseEnd) {
            this.peakVol[k] = 0
            this.prevVol[k] = 0
            this.state[k] = ''

            if (
              !isSustaining &&
              sustainRelease > 0 &&
              globalTime > sustainRelease
            ) {
              this.globalParams[1] = 0

              this.commView[0] = 300
            } else {
              this.commView[0] = 200 + k
            }

            Atomics.notify(this.commView, 0)
          }
        }

        channel[j] = wave
      }
    })
    return true
  }
}

registerProcessor('oscillator', Oscillator)
