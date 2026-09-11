import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateStats, getPerformanceSeries, parseResults } from '../src/utils/stats.ts'
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

test('performance graphs include idle seconds and the exact timed deadline', () => {
  let session = createTypingSession()
  for (const [key, now] of [['1', 1000], ['2', 1200], ['3', 1400]]) {
    session = updateTypingSession(session, key, 7, now, 15, true)
  }
  const points = getPerformanceSeries(['123', '456'], session, 15)
  assert.equal(points.length, 15)
  assert.deepEqual(points[0], { seconds: 1, wpm: 36, accuracy: 100 })
  assert.deepEqual(points.at(-1), { seconds: 15, wpm: 2, accuracy: 100 })
  assert.equal(updateTypingSession(session, '9', 7, 16000, 15, true), session)
})

test('performance graphs replay mistakes and corrections with a fractional final point', () => {
  let session = createTypingSession()
  for (const [key, now] of [['1', 1000], ['x', 1200], ['Backspace', 2100], ['2', 2200], ['3', 3500]]) {
    session = updateTypingSession(session, key, 3, now, null, true)
  }
  const points = getPerformanceSeries(['123'], session, 2.5)
  assert.deepEqual(points.map(point => point.accuracy), [50, 100, 100])
  assert.equal(points.at(-1).seconds, 2.5)
  const final = calculateStats(['123'], session.typedCharacters, 2.5)
  assert.equal(points.at(-1).wpm, final.wpm)
  assert.equal(points.at(-1).accuracy, final.accuracy)
})

test('performance graphs handle resets, short tests, and long sessions', () => {
  assert.deepEqual(getPerformanceSeries(['12'], createTypingSession(), 0), [])
  let session = updateTypingSession(createTypingSession(), '1', 2, 1000, null, true)
  session = updateTypingSession(session, '2', 2, 1100, null, true)
  assert.deepEqual(getPerformanceSeries(['12'], session, 0.1), [{ seconds: 0.1, wpm: 240, accuracy: 100 }])
  const long = getPerformanceSeries(['12'], session, 3600)
  assert.ok(long.length <= 300)
  assert.equal(long.at(-1).seconds, 3600)
})
