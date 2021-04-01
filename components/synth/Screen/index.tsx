import { paramValueList } from '../helper/constants'
import styles from './styles.module.scss'

type ScreenProps = {
  isOn: boolean
  oscillator: OscillatorProps
  currentOsc: string
  hasMIDIPermission: boolean
  setMIDIPermission: (value: boolean) => void
}

export default function Screen({
  currentOsc,
  hasMIDIPermission,
  isOn,
  oscillator,
  setMIDIPermission,
}: ScreenProps) {
  return (
    <div className={styles.screenWrapper}>
      {!hasMIDIPermission ? (
        <div className={styles.permissionWrapper}>
          <span>
            Please grant this application access to your MIDI controller. Or,
            you may use your mouse to play the keys.
          </span>
          <div className={styles.permissionBtns}>
            <button onClick={() => setMIDIPermission(true)}>Allow</button>
            <button onClick={() => setMIDIPermission(false)}>Deny</button>
          </div>
        </div>
      ) : (
        <div
          className={[
            isOn ? styles.screenOn : styles.screenOff,
            styles.screen,
          ].join(' ')}
        >
          <div className={styles.titleWrapper}>
            <span>oscillator {Number(currentOsc) + 1}</span>
            <span>{oscillator.isOn ? 'on' : 'off'}</span>
          </div>
          <hr />
          <div className={styles.keyParams}>
            <div>
              <span>vol:</span>{' '}
              <span>{Math.round((oscillator.volume * 100) / 0.8)}%</span>
            </div>
            <div>
              <span>oct:</span>{' '}
              <span>
                {oscillator.octave > -1
                  ? `+${oscillator.octave}`
                  : oscillator.octave}
              </span>
            </div>
            <div>
              <span>det:</span>{' '}
              <span>
                {oscillator.detune > -1
                  ? `+${oscillator.detune}`
                  : oscillator.detune}
              </span>
            </div>
          </div>
          <ul className={styles.params}>
            {paramValueList.map(({ name, max, unit }) => {
              if (name === 'volume') return null
              const value =
                oscillator[
                  (name as unknown) as keyof Pick<
                    OscillatorProps,
                    'attack' | 'volume' | 'release' | 'vibrato'
                  >
                ]
              return (
                <li key={`screen-param-${name}`} className={styles.name}>
                  {name.slice(0, 3)}:{' '}
                  {unit === '%'
                    ? `${Math.round((value * 100) / max)}%`
                    : `${Math.round(value * 1000)}ms`}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}