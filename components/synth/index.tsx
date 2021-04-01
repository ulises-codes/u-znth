/// <reference path="./types.d.ts" />

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import Keyboard from './Keyboard'
import Oscillator from './Oscillator'
import {
  VOICES,
  OSC_QTY,
  NOTE_PROPS,
  PARAMS_LIST,
  GLOBAL_PARAMS,
} from './helper/constants'

// import worklet from '/worklets/audio-worklet'

const Worklet = new URL(
  '../../public/worklets/audio-worklet.js',
  import.meta.url
)

import styles from './styles.module.scss'

export default function Synth() {
  const [isReady, setIsReady] = useState(false)
  const [isOn, setIsOn] = useState(true)
  const [isSustaining, setIsSustaining] = useState(false)
  const [hasMIDIPermission, setHasMIDIPermission] = useState(false)

  const [oscillators, setOscillators] = useState<{
    [key: string]: OscillatorProps
  }>(() => {
    const obj: { [key: string]: OscillatorProps } = {}

    for (let i = 0; i < OSC_QTY; i++) {
      obj[i.toString()] = {
        isOn: i === 0 ? 1 : 0,
        attack: 0.01,
        decay: 0,
        detune: 0,
        octave: 0,
        release: 0.01,
        shape: 1,
        vibrato: 0,
        volume: 0.5,
      }
    }

    return obj
  })

  const audioRef = useRef() as MutableRefObject<HTMLAudioElement>

  const midiRef = useRef() as MutableRefObject<WebMidi.MIDIAccess>

  const worker = useMemo(
    () =>
      new Worker(new URL('./synth-worker.ts', import.meta.url), {
        name: 'synth-worker',
        credentials: 'same-origin',
      }),
    []
  )

  const commSAB = useRef(new SharedArrayBuffer(12))
  const commView = useRef(new Int32Array(commSAB.current))

  const notesSAB = useRef(new SharedArrayBuffer(VOICES * NOTE_PROPS.length * 8))
  const notesView = useRef(new Float64Array(notesSAB.current))

  const paramsSAB = useRef(
    new SharedArrayBuffer(
      (PARAMS_LIST.length * OSC_QTY + GLOBAL_PARAMS.length) * 8
    )
  )
  const paramsView = useRef(new Float64Array(paramsSAB.current))

  const globalParamsStartIndex = PARAMS_LIST.length * OSC_QTY

  const ctx = useRef(new AudioContext())

  const master = useRef({
    compressor: ctx.current.createDynamicsCompressor(),
    gain: ctx.current.createGain(),
  })

  const processors = useRef<{ [key: string]: ProcessorProps }>({})

  const updateParamsView = (oscId: number) => {
    PARAMS_LIST.forEach((param, i) => {
      paramsView.current[oscId * PARAMS_LIST.length + i] =
        oscillators[oscId][param]
    })
  }

  const maxReleaseParam = useMemo(() => {
    for (let i in oscillators) {
      updateParamsView(+i)
    }

    const releaseParams = new Array(OSC_QTY)
      .fill(null)
      .map((_, osc) => oscillators[osc].release)

    return Math.max(...releaseParams)
  }, [oscillators])

  const addNote = (note: number) => {
    const existingIndex = notesView.current.indexOf(note)
    if (existingIndex >= 0) {
      notesView.current[existingIndex + 2] = ctx.current.currentTime

      commView.current[0] = 100 + notesView.current.indexOf(note)
    } else {
      notesView.current[commView.current[2]] = note
      notesView.current[commView.current[2] + 2] = ctx.current.currentTime

      commView.current[0] = 100 + commView.current[2]
    }

    Atomics.notify(commView.current, 0)
  }

  const removeNote = (note: number) => {
    const index = notesView.current.indexOf(note)

    if (index < 0) return

    const currentTime = ctx.current.currentTime

    if (note > 20 && note < 128) {
      notesView.current[index + 4] = currentTime + maxReleaseParam

      if (isSustaining) {
        notesView.current[index + 3] = -1 * currentTime
      } else {
        notesView.current[index + 3] = currentTime
      }
    }
  }

  const handleMidi = useCallback(
    (e: WebMidi.MIDIMessageEvent) => {
      e.preventDefault()

      if (e.data.length < 3) return

      const velocity = e.data[2]

      switch (e.data[0]) {
        case 176: // Sustain
          setIsSustaining(velocity === 0 ? false : true)

          break
        default: {
          // Musical notes
          // If velocity isn't 0
          if (velocity !== 0) {
            addNote(e.data[1])
          } else {
            removeNote(e.data[1])
          }

          break
        }
      }
    },
    [addNote, removeNote, isSustaining]
  )

  useEffect(() => {
    if (ctx.current.state === 'running' && !isOn) {
      ctx.current.suspend()
    } else if (isReady && ctx.current.state === 'suspended' && isOn) {
      ctx.current.resume()
    }
  }, [isOn])

  useEffect(() => {
    if (typeof window === 'undefined') return

    worker.postMessage({
      action: 'init',
      notesSAB: notesSAB.current,
      commSAB: commSAB.current,
      paramsLength: PARAMS_LIST.length,
      notePropsLength: NOTE_PROPS.length,
    })

    async function init() {
      try {
        await ctx.current.audioWorklet.addModule('/worklets/audio-worklet.js', {
          credentials: 'same-origin',
        })

        const currentTime = ctx.current.currentTime
        const source = ctx.current.createMediaStreamDestination()

        const masterGain = master.current.gain
        const masterCompressor = master.current.compressor

        masterGain.gain.value = 0.3

        masterCompressor.threshold.setValueAtTime(-20, currentTime)
        masterCompressor.knee.setValueAtTime(40, currentTime)
        masterCompressor.ratio.setValueAtTime(5, currentTime)
        masterCompressor.attack.setValueAtTime(0.25, currentTime)
        masterCompressor.release.setValueAtTime(0.25, currentTime)

        for (let i in oscillators) {
          const node = new AudioWorkletNode(ctx.current, 'oscillator', {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [1],
            processorOptions: {
              notesSAB: notesSAB.current,
              paramsSAB: paramsSAB.current,
              commSAB: commSAB.current,
              id: +i,
              paramsLength: PARAMS_LIST.length,
              notePropsLength: NOTE_PROPS.length,
              globalParamsStartIndex,
            },
          })

          const gain = ctx.current.createGain()
          const compressor = ctx.current.createDynamicsCompressor()

          node.connect(compressor)
          compressor.connect(gain)
          gain.connect(masterCompressor)

          processors.current[i] = {
            node,
            gain,
            compressor,
          }
        }

        masterCompressor.connect(masterGain)
        masterGain.connect(ctx.current.destination)

        audioRef.current.srcObject = source.stream

        setIsReady(true)
      } catch (e) {
        console.error('UNABLE TO OBTAIN STREAM: ', e)
      }
    }

    init()

    return () => {
      for (let i in processors) {
        if (processors.current[i]) {
          processors.current[i].node?.disconnect()
        }
      }

      ctx.current.close()
      worker.terminate()
    }
  }, [])

  useEffect(() => {
    if (!midiRef.current) {
      async function initMidi() {
        const permissions = await navigator.permissions.query({ name: 'midi' })
        if (permissions.state === 'granted') {
          setHasMIDIPermission(true)
        }

        midiRef.current = await navigator.requestMIDIAccess({ sysex: true })

        midiRef.current.inputs.forEach(input => {
          input.addEventListener('midimessage', handleMidi)
        })
      }

      initMidi()
    }

    return () => {
      if (!midiRef.current) return
      midiRef.current.inputs.forEach(input => {
        input.removeEventListener('midimessage', handleMidi as EventListener)
      })
    }
  }, [handleMidi, hasMIDIPermission])

  useEffect(() => {
    if (!isReady) return

    if (isSustaining) {
      paramsView.current[globalParamsStartIndex] = 1
      paramsView.current[globalParamsStartIndex + 1] = ctx.current.currentTime
    } else if (paramsView.current[globalParamsStartIndex] > 0) {
      paramsView.current[globalParamsStartIndex] = 0
      paramsView.current[globalParamsStartIndex + 1] = ctx.current.currentTime

      // commView.current[0] = 300

      // Atomics.notify(commView.current, 0)
    }
  }, [isSustaining, isReady])

  return (
    <div className={styles.root}>
      <audio ref={audioRef}></audio>
      <div className={styles.synth}>
        <div className={styles.top}>
          <Oscillator
            hasMIDIPermission={hasMIDIPermission}
            setMIDIPermission={async (value: boolean) => {
              if (isReady && isOn && ctx.current.state === 'suspended') {
                await ctx.current.resume()
              }
              setHasMIDIPermission(value)
            }}
            isOn={isOn}
            togglePower={() => setIsOn(!isOn)}
            oscillators={oscillators}
            handleValueChange={(id, values) => {
              setOscillators({
                ...oscillators,
                [id]: { ...oscillators[id], ...values },
              })
            }}
          />
        </div>
        <div className={styles.bottom}>
          <div className={styles.divider} />
          <div className={[styles.edge, styles.leftEdge].join(' ')} />
          <Keyboard
            onMouseDown={addNote}
            onMouseUp={note => removeNote(note)}
          />
          <div className={[styles.edge, styles.rightEdge].join(' ')} />
        </div>
      </div>
    </div>
  )
}
