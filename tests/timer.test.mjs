import assert from 'node:assert/strict'
import test from 'node:test'
import { updateTypingSession } from '../src/utils/typing.ts'
import { getRemainingSeconds } from '../src/utils/timer.ts'

const idle = () => ({ typedCharacters: [], startedAt: null })

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
