import assert from 'node:assert/strict'
import test from 'node:test'
import { getTypingProgress, updateTypingSession } from '../src/utils/typing.ts'
import { getRemainingSeconds, getTestStatus } from '../src/utils/timer.ts'

const idle = () => ({ typedCharacters: [], startedAt: null })

test('timed tests become finished at the deadline without another keystroke', () => {
  for (const duration of [15, 30, 60, 120]) {
    const session = updateTypingSession(idle(), 'c', 7, 1000, duration)
    const deadline = 1000 + duration * 1000
    assert.equal(getTestStatus(null, duration), 'idle')
    assert.equal(getTestStatus(session.startedAt,
      getRemainingSeconds(duration, session.startedAt, deadline - 1)), 'running')
    assert.equal(getTestStatus(session.startedAt,
      getRemainingSeconds(duration, session.startedAt, deadline)), 'finished')
  }
})

test('the deadline blocks characters, spaces, and backspace even before the next timer callback', () => {
  const session = updateTypingSession(idle(), 'c', 7, 1000, 15)
  assert.deepEqual(updateTypingSession(session, 'a', 7, 15999, 15).typedCharacters, ['c', 'a'])
  for (const now of [16000, 16001, 100000]) {
    for (const key of ['a', ' ', 'Backspace']) {
      assert.equal(updateTypingSession(session, key, 7, now, 15), session)
    }
  }
})

test('finished display preserves feedback and position but removes the current caret', () => {
  const progress = getTypingProgress(['cat', 'dog'], Array.from('cx'), true)
  assert.deepEqual(progress.characterStates,
    ['correct', 'incorrect', 'untyped', 'untyped', 'untyped', 'untyped', 'untyped'])
  assert.equal(progress.position, 2)
  assert.equal(progress.currentWordIndex, 0)
  assert.equal(progress.currentCharacterIndex, 2)
})

test('Words mode remains untimed and a reset allows a fresh timed session', () => {
  const session = updateTypingSession(idle(), 'c', 7, 1000, null)
  assert.equal(getTestStatus(session.startedAt, null), 'running')
  assert.deepEqual(updateTypingSession(session, 'a', 7, 100000, null).typedCharacters, ['c', 'a'])
  const fresh = updateTypingSession(idle(), 'd', 7, 100000, 30)
  assert.equal(fresh.startedAt, 100000)
  assert.equal(getTestStatus(fresh.startedAt, getRemainingSeconds(30, fresh.startedAt, 100000)), 'running')
})

test('timer stays idle for every duration until a character is accepted', () => {
  for (const duration of [15, 30, 60, 120]) {
    assert.equal(getRemainingSeconds(duration, null, 900000), duration)
  }
  for (const key of ['Backspace', 'Shift', 'Tab', 'Enter', 'ArrowLeft', 'Dead']) {
    const session = idle()
    assert.equal(updateTypingSession(session, key, 10, 1000), session)
  }
  assert.equal(updateTypingSession(idle(), 'a', 0, 1000).startedAt, null)
})

test('first accepted character starts the clock, including mistakes and spaces', () => {
  for (const key of ['a', 'X', ' ', '!']) {
    const session = updateTypingSession(idle(), key, 10, 1000)
    assert.equal(session.startedAt, 1000)
    assert.deepEqual(session.typedCharacters, [key])
    assert.equal(getRemainingSeconds(30, session.startedAt, 1000), 30)
    assert.equal(getRemainingSeconds(30, session.startedAt, 2000), 29)
  }
})

test('typing and deleting all input never restart or pause an active timer', () => {
  let session = updateTypingSession(idle(), 'a', 10, 0)
  for (const key of ['b', 'Backspace', 'Backspace', 'Backspace', 'c']) {
    session = updateTypingSession(session, key, 10, 5000)
    assert.equal(session.startedAt, 0)
    assert.equal(getRemainingSeconds(30, session.startedAt, 5000), 25)
  }
})

test('countdown follows elapsed time, catches up after delays, and stops at zero', () => {
  assert.equal(getRemainingSeconds(30, 1000, 1999), 30)
  assert.equal(getRemainingSeconds(30, 1000, 2000), 29)
  assert.equal(getRemainingSeconds(30, 1000, 15500), 16)
  assert.equal(getRemainingSeconds(30, 1000, 31000), 0)
  assert.equal(getRemainingSeconds(30, 1000, 100000), 0)
  assert.equal(getRemainingSeconds(30, 1000, 500), 30)
})

test('resetting the session restores the selected duration and a fresh start', () => {
  let session = updateTypingSession(idle(), 'a', 10, 1000)
  assert.equal(getRemainingSeconds(30, session.startedAt, 6000), 25)
  session = idle()
  assert.equal(getRemainingSeconds(60, session.startedAt, 6000), 60)
  session = updateTypingSession(session, 'b', 10, 10000)
  assert.equal(getRemainingSeconds(60, session.startedAt, 11000), 59)
})
