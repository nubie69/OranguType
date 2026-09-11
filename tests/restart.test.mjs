import assert from 'node:assert/strict'
import test from 'node:test'
import { createTypingSession, getTypingProgress, updateTypingSession } from '../src/utils/typing.ts'
import { getRemainingSeconds, getTestStatus } from '../src/utils/timer.ts'
import { generateWords } from '../src/utils/generateWords.ts'

test('restart clears running and finished input, errors, positions, and timer', () => {
  for (const duration of [15, 30, 60, 120]) {
    for (const now of [3000, 200000]) {
      let session = createTypingSession()
      for (const key of 'cat dx') session = updateTypingSession(session, key, 7, 1000, duration)
      assert.equal(getTypingProgress(['cat', 'dog'], session.typedCharacters).characterStates[5], 'incorrect')
      session = createTypingSession()
      const remaining = getRemainingSeconds(duration, session.startedAt, now)
      assert.equal(remaining, duration)
      assert.equal(getTestStatus(session.startedAt, remaining), 'idle')
      const progress = getTypingProgress(['new', 'words'], session.typedCharacters)
      assert.equal(progress.position, 0)
      assert.equal(progress.currentWordIndex, 0)
      assert.equal(progress.currentCharacterIndex, 0)
      assert.deepEqual(progress.characterStates, ['current', ...Array(8).fill('untyped')])
      session = updateTypingSession(session, 'n', 9, now + 1000, duration)
      assert.equal(session.startedAt, now + 1000)
      assert.deepEqual(session.typedCharacters, ['n'])
    }
  }
})

test('fresh word generation replaces the set and preserves mode counts and duplicate prevention', () => {
  const random = Math.random
  try {
    Math.random = () => 0
    const previous = generateWords(100)
    Math.random = () => 0.5
    const fresh = generateWords(100)
    assert.notDeepEqual(fresh, previous)
    assert.equal(fresh.length, 100)
    for (const count of [10, 25, 50, 100]) {
      const words = fresh.slice(0, count)
      assert.equal(words.length, count)
      assert.ok(words.every((word, index) => index === 0 || word !== words[index - 1]))
    }
  } finally {
    Math.random = random
  }
})
