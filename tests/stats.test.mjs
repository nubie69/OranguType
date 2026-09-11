import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateStats, parseResults } from '../src/utils/stats.ts'
import { createTypingSession, updateTypingSession } from '../src/utils/typing.ts'

test('WPM and accuracy count matching characters and spaces for words and numbers', () => {
  assert.deepEqual(calculateStats(['cat', 'dog'], Array.from('cat dxg'), 30),
    { correct: 6, incorrect: 1, wpm: 2, accuracy: 86 })
  assert.deepEqual(calculateStats(['123', '456'], Array.from('123 456'), 6),
    { correct: 7, incorrect: 0, wpm: 14, accuracy: 100 })
  assert.deepEqual(calculateStats(['cat'], [], 0),
    { correct: 0, incorrect: 0, wpm: 0, accuracy: 0 })
})

test('completed sessions retain the final keystroke time and reject subsequent edits', () => {
  for (const duration of [null, 30]) {
    let session = updateTypingSession(createTypingSession(), '1', 2, 1000, duration, true)
    session = updateTypingSession(session, '2', 2, 4000, duration, true)
    assert.equal(session.finishedAt, 4000)
    assert.equal(session.startedAt, 1000)
    assert.equal(updateTypingSession(session, 'Backspace', 2, 5000, duration, true), session)
    assert.equal(createTypingSession().finishedAt, undefined)
  }
})

test('storage parsing recovers from invalid data and retains valid results with a bounded history', () => {
  const result = { id: 'test', completedAt: '2026-09-11T00:00:00Z', category: 'numbers',
    mode: 'words', time: 30, words: 10, elapsedSeconds: 20,
    wpm: 30, accuracy: 95, correct: 50, incorrect: 3 }
  for (const raw of [null, 'broken', '{}', '[null,1,"text"]']) {
    assert.deepEqual(parseResults(raw), [])
  }
  assert.deepEqual(parseResults(JSON.stringify([result, { ...result, accuracy: 101 },
    { ...result, category: 'unknown' }, { ...result, elapsedSeconds: -1 }])), [result])
  assert.equal(parseResults(JSON.stringify(Array(110).fill(result))).length, 100)
})
