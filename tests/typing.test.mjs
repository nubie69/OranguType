import assert from 'node:assert/strict'
import test from 'node:test'
import { getTypingProgress, updateTypedCharacters } from '../src/utils/typing.ts'

test('starts at the first word and character with a current caret', () => {
  const progress = getTypingProgress(['cat', 'dog'], [])
  assert.equal(progress.currentWordIndex, 0)
  assert.equal(progress.currentCharacterIndex, 0)
  assert.equal(progress.isComplete, false)
  assert.deepEqual(progress.characterStates, ['current', ...Array(6).fill('untyped')])
})

test('tracks correct and incorrect input and advances across word separators', () => {
  let typed = []
  for (const key of 'cax ') typed = updateTypedCharacters(typed, key, 7)
  const progress = getTypingProgress(['cat', 'dog'], typed)
  assert.equal(progress.currentWordIndex, 1)
  assert.equal(progress.currentCharacterIndex, 0)
  assert.deepEqual(progress.characterStates,
    ['correct', 'correct', 'incorrect', 'correct', 'current', 'untyped', 'untyped'])
})

test('backspace crosses a word boundary and restores the previous character state', () => {
  const typed = updateTypedCharacters(Array.from('cat '), 'Backspace', 7)
  const progress = getTypingProgress(['cat', 'dog'], typed)
  assert.equal(progress.currentWordIndex, 0)
  assert.equal(progress.currentCharacterIndex, 3)
  assert.equal(progress.characterStates[3], 'current')
  assert.deepEqual(updateTypedCharacters([], 'Backspace', 7), [])
})

test('ignores navigation keys and limits input, but allows correcting completed text', () => {
  const typed = Array.from('cat')
  for (const key of ['Tab', 'Enter', 'ArrowLeft', 'Shift', 'Dead']) {
    assert.equal(updateTypedCharacters(typed, key, 7), typed)
  }
  assert.equal(updateTypedCharacters(typed, 'x', 3), typed)
  assert.equal(getTypingProgress(['cat'], typed).isComplete, true)
  const corrected = updateTypedCharacters(typed, 'Backspace', 3)
  assert.equal(getTypingProgress(['cat'], corrected).isComplete, false)
  assert.equal(getTypingProgress(['cat'], corrected).characterStates[2], 'current')
})

test('counts Unicode code points consistently and handles an empty word list', () => {
  const typed = updateTypedCharacters([], '😀', 3)
  assert.equal(typed.length, 1)
  assert.equal(getTypingProgress(['cat'], typed).characterStates[0], 'incorrect')
  assert.deepEqual(updateTypedCharacters([], 'a', 0), [])
  assert.equal(getTypingProgress([], []).isComplete, true)
})
