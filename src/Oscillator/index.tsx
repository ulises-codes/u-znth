/// <reference path="../types.d.ts" />

import { HTMLAttributes, useState } from 'react'

import Screen from '../Screen'
import { paramValueList } from '../helper/constants'
import styles from './styles.module.scss'
import WaveToggle from './WaveToggle'

interface OscillatorUI {
  isOn: boolean
  oscillators: { [key: string]: OscillatorProps }
  togglePower: () => void
  handleValueChange: (id: string, values: Partial<OscillatorProps>) => void
}

interface SliderProps
  extends Omit<HTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  effectName: string
  value: number
}

function Slider({ effectName, ...props }: SliderProps) {
  return (
    <div className={styles.meterWrapper}>
      <fieldset>
        <legend>{effectName.slice(0, 3)}</legend>
        <input type="range" {...props} />
      </fieldset>
    </div>
  )
}

export default function OscillatorUI({
  isOn,
  oscillators,
  handleValueChange,
  togglePower,
}: OscillatorUI) {
  const [osc, setOsc] = useState('0')

  const cents = 1
  const maxOctave = 2

  const handleDetune = (direction: number) => {
    const currentValue = oscillators[osc].detune

    if (currentValue * direction + cents > cents * 5) return

    handleValueChange(osc, { detune: currentValue + direction * cents })
  }

  const handleOctaveChange = (direction: number) => {
    const currentValue = oscillators[osc].octave

    if (currentValue * direction >= maxOctave) return

    handleValueChange(osc, {
      octave: currentValue + direction,
    })
  }

  return (
    <div className={styles.oscillator}>
      <div className={styles.title}>
        <h1>u-Znth 3000</h1>
      </div>
      <div className={styles.switch}>
        <div className={[styles.light, isOn ? styles.isOn : ''].join(' ')} />
        <div className={styles.btnWrapper}>
          <button
            className={[
              styles.btn,
              styles.powerBtn,
              isOn ? styles.isOn : '',
            ].join(' ')}
            onClick={() => togglePower()}
          />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.waveWrapper}>
          <WaveToggle wave={oscillators[osc].shape}>
            <div className={styles.btnWrapper}>
              <button
                className={styles.btn}
                onClick={() => {
                  const shape = oscillators[osc].shape
                  const newShape = shape === 3 ? 1 : shape + 1

                  handleValueChange(osc, { shape: newShape })
                }}
              />
            </div>
          </WaveToggle>
        </div>
        <fieldset className={styles.detuneBtns}>
          <legend>detune</legend>
          <div className={styles.btnWrapper}>
            <button className={styles.btn} onClick={() => handleDetune(1)}>
              ▲
            </button>
          </div>
          <div className={styles.btnWrapper}>
            <button className={styles.btn} onClick={() => handleDetune(-1)}>
              ▼
            </button>
          </div>
        </fieldset>
        <fieldset className={styles.octaveBtns}>
          <legend>octave</legend>
          <div className={styles.btnWrapper}>
            <button
              className={[
                styles.btn,
                styles.octaveBtn,
                oscillators[osc].octave >= maxOctave ? styles.maxOctave : '',
              ].join(' ')}
              name="octave-up"
              onClick={() => handleOctaveChange(1)}
            >
              ▲
            </button>
          </div>
          <div className={styles.btnWrapper}>
            <button
              className={[
                styles.btn,
                styles.octaveBtn,
                oscillators[osc].octave <= -maxOctave ? styles.maxOctave : '',
              ].join(' ')}
              name="octave-up"
              onClick={() => handleOctaveChange(-1)}
            >
              ▼
            </button>
          </div>
        </fieldset>
      </div>
      <div className={styles.meters}>
        {paramValueList.map(({ name, ...props }) => {
          return (
            <Slider
              key={`osc-effect-${name}`}
              effectName={name}
              onChange={e =>
                handleValueChange(osc, {
                  [name]: parseFloat(e.currentTarget.value),
                })
              }
              {...props}
              value={
                oscillators[osc][
                  name as keyof Omit<
                    OscillatorProps,
                    'settings' | 'isOn' | 'shape'
                  >
                ]
              }
            />
          )
        })}
      </div>
      <Screen oscillator={oscillators[osc]} isOn={isOn} currentOsc={osc} />
      <div className={styles.toggleBtns}>
        {Object.keys(oscillators).map(o => {
          const isActive = osc === o
          const isOn = oscillators[o].isOn

          return (
            <button
              key={`osc-toggle-btn-${o}`}
              className={[
                styles.oscToggleBtn,
                isOn ? styles.on : '',
                isActive ? styles.active : '',
              ].join(' ')}
              onClick={() => {
                isActive
                  ? handleValueChange(o, { isOn: isOn ? 0 : 1 })
                  : setOsc(o)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
