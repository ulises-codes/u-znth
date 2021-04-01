/// <reference path="../types.d.ts" />

import styles from './styles.module.scss'
import type { ReactNode } from 'react'

type WaveToggleProps = {
  wave: OscillatorProps['shape']
  children: ReactNode
}

export default function WaveToggle({ children, wave }: WaveToggleProps) {
  const SineWave = () => (
    <svg
      className={[styles.wave, wave === 1 ? styles.active : ''].join(' ')}
      viewBox="0 -4 100 100"
      xmlns="http://www.w3.org/2000/svg"
      height="15"
      width="15"
    >
      <path d="M 0,100 Q 25,0 50,0 75,0 100,100" />
    </svg>
  )

  const SquareWave = () => (
    <svg
      className={[styles.wave, wave === 2 ? styles.active : ''].join(' ')}
      viewBox="0 -4 100 100"
      xmlns="http://www.w3.org/2000/svg"
      height="15"
      width="15"
    >
      <path d="M 0,100 L 0,0 100,0 100,100" />
    </svg>
  )

  const TriangleWave = () => (
    <svg
      className={[styles.wave, wave === 3 ? styles.active : ''].join(' ')}
      viewBox="0 -4 100 100"
      xmlns="http://www.w3.org/2000/svg"
      height="15"
      width="15"
    >
      <path d="M 0,100 L 50 0 100 100" />
    </svg>
  )

  return (
    <div className={styles.shapeWrapper}>
      <div className={styles.waves}>
        <div className={styles.wavesFilter} />
        <SineWave />
        <SquareWave />
        <TriangleWave />
      </div>
      {children}
    </div>
  )
}
