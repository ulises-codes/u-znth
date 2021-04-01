import styles from './styles.module.scss'

type KeyboardProps = {
  onMouseDown: (note: number) => void
  onMouseUp: (note: number) => void
}

export default function Keyboard({ onMouseDown, onMouseUp }: KeyboardProps) {
  const keys = new Array(30).fill(null)

  return (
    <div className={styles.keyboard}>
      <div className={styles.keys}>
        {keys.map((_, i) => {
          return (
            <div className={styles.keyWrapper} key={`key-${i}`}>
              <div
                className={styles.key}
                data-midi-note={60 + i}
                onMouseDown={e => {
                  e.preventDefault()
                  onMouseDown(parseInt(e.currentTarget.dataset.midiNote ?? ''))
                  e.currentTarget.classList.add(styles.pressed)
                }}
                onMouseUp={e => {
                  e.preventDefault()
                  onMouseUp(parseInt(e.currentTarget.dataset.midiNote ?? ''))
                  e.currentTarget.classList.remove(styles.pressed)
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
