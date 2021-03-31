import midiToFreq from './helper/midiToFreq'

type DataProps = {
  notesSAB: SharedArrayBuffer
  commSAB: Int32Array
  notePropsLength: number
}

let notesView: Float64Array
let commView: Int32Array

let notePropsLength: number

addEventListener('message', init)

function init({ data }: { data: DataProps }): void {
  notesView = new Float64Array(data.notesSAB)
  commView = new Int32Array(data.commSAB)
  notePropsLength = data.notePropsLength

  handleNotes()
}

function handleNotes() {
  Atomics.wait(commView, 0, 0)

  const code = commView[0]

  if (code >= 100 && code < 200) {
    const i = code - 100
    addNote(notesView[i], i)
  } else if (code >= 200 && code < 300) {
    deleteNote(code - 200)

    commView[1] -= 1
  } else if (code === 300) {
    let count = 0
    // Sustain release; using -1 as placeholder in the release position (i + 3)
    for (let i = 0; i < notesView.length; i += notePropsLength) {
      if (notesView[i + 3] < 0) {
        deleteNote(i)

        count++
      }
    }
    commView[1] -= count
  }

  findEmptySlot()

  commView[0] = 0

  Atomics.notify(commView, 0)

  handleNotes()
}

function deleteNote(index: number) {
  if (notesView[index] >= 0) {
    notesView[index] = 0
    notesView[index + 1] = 0
    notesView[index + 2] = 0
    notesView[index + 3] = 0
    notesView[index + 4] = 0
  }
}

function addNote(note: number, index: number) {
  if (!notesView[index + 1]) {
    notesView[index + 1] = midiToFreq(notesView[index]) // The freq
  }

  notesView[index + 3] = 0
  notesView[index + 4] = 0

  notesView[index + 1] = midiToFreq(note)

  commView[1] += 1
}

function findEmptySlot() {
  for (let i = 0; i < notesView.length; i += notePropsLength) {
    if (notesView[i] === 0) {
      commView[2] = i

      break
    }
  }
}
