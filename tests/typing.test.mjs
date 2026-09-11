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

test('marks each matching character correct, including spaces and the final character', () => {
  const words = ['cat', 'dog']
  const expected = Array.from(words.join(' '))
  let typed = []

  for (const character of expected) {
    typed = updateTypedCharacters(typed, character, expected.length)
    const { characterStates } = getTypingProgress(words, typed)
    assert.deepEqual(characterStates.slice(0, typed.length), Array(typed.length).fill('correct'))
    if (typed.length < expected.length) {
      assert.equal(characterStates[typed.length], 'current')
      assert.ok(characterStates.slice(typed.length + 1).every((state) => state === 'untyped'))
    }
  }
})

test('only exact matches are correct and an earlier mistake does not block later matches', () => {
  const { characterStates } = getTypingProgress(['cat'], Array.from('Cat'))
  assert.deepEqual(characterStates, ['incorrect', 'correct', 'correct'])
})

test('marks a mismatch at any position incorrect while preserving all matching characters', () => {
  const words = ['cat', 'dog']
  const expected = Array.from(words.join(' '))

  for (let mismatchIndex = 0; mismatchIndex < expected.length; mismatchIndex += 1) {
    const input = [...expected]
    input[mismatchIndex] = expected[mismatchIndex] === ' ' ? 'x' : ' '
    let typed = []
    for (const key of input) typed = updateTypedCharacters(typed, key, expected.length)

    assert.deepEqual(getTypingProgress(words, typed).characterStates,
      expected.map((_, index) => index === mismatchIndex ? 'incorrect' : 'correct'))
  }
})

test('consecutive wrong characters keep the caret moving and leave future characters untyped', () => {
  let typed = []
  for (const key of 'xyz') typed = updateTypedCharacters(typed, key, 7)
  const progress = getTypingProgress(['cat', 'dog'], typed)
  assert.deepEqual(progress.characterStates,
    ['incorrect', 'incorrect', 'incorrect', 'current', 'untyped', 'untyped', 'untyped'])
  assert.equal(progress.position, 3)
  assert.equal(progress.currentWordIndex, 0)
  assert.equal(progress.currentCharacterIndex, 3)
})

test('replacing a correct character with a wrong one removes its correct state', () => {
  let typed = Array.from('cat')
  typed = updateTypedCharacters(typed, 'Backspace', 3)
  typed = updateTypedCharacters(typed, 'x', 3)
  assert.deepEqual(getTypingProgress(['cat'], typed).characterStates,
    ['correct', 'correct', 'incorrect'])
  typed = updateTypedCharacters(typed, 'Backspace', 3)
  assert.deepEqual(getTypingProgress(['cat'], typed).characterStates,
    ['correct', 'correct', 'current'])
})

test('retyping a mistake correctly applies the correct state', () => {
  let typed = Array.from('cx')
  assert.equal(getTypingProgress(['cat'], typed).characterStates[1], 'incorrect')
  typed = updateTypedCharacters(typed, 'Backspace', 3)
  assert.equal(getTypingProgress(['cat'], typed).characterStates[1], 'current')
  typed = updateTypedCharacters(typed, 'a', 3)
  assert.deepEqual(getTypingProgress(['cat'], typed).characterStates,
    ['correct', 'correct', 'current'])
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
