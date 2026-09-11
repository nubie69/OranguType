import assert from 'node:assert/strict'
import test from 'node:test'
import { generateWords } from '../src/utils/generateWords.ts'
import { practiceCategories } from '../src/types/test.ts'
import { codeSnippets, practiceQuotes } from '../src/data/practiceTexts.ts'
import { parseResults } from '../src/utils/stats.ts'
import { createTypingSession, updateTypingSession, getTypingProgress } from '../src/utils/typing.ts'

test('all categories generate the selected number of complete, typeable units', () => {
  for (const category of practiceCategories) {
    for (const count of [0, 10, 25, 50, 100]) {
      const units = generateWords(count, category)
      assert.equal(units.length, count)
      assert.ok(units.every(unit => unit.length > 0 && !/[\n\r\t]/.test(unit)))
      if (category === 'code') assert.ok(units.every(unit => codeSnippets.includes(unit)))
      if (category === 'quotes') assert.ok(units.every(unit => practiceQuotes.includes(unit)))
      if (category === 'punctuation') assert.ok(units.every(unit => /[,.!?;:"()']/.test(unit)))
    }
  }
})

test('code and quotes complete through the typing engine including spaces and symbols', () => {
  for (const category of ['punctuation', 'code', 'quotes']) {
    const units = generateWords(2, category)
    const characters = Array.from(units.join(' '))
    let session = createTypingSession()
    characters.forEach((key, index) => {
      session = updateTypingSession(session, key, characters.length, 1000 + index * 100, null, true)
    })
    assert.ok(session.finishedAt)
    assert.ok(getTypingProgress(units, session.typedCharacters, true).characterStates.every(state => state === 'correct'))
  }
})

test('saved results retain new categories alongside existing categories', () => {
  const results = practiceCategories.map(category => ({ category, id: category,
    completedAt: '2026-09-11T00:00:00Z', mode: 'words', words: 10, time: 30,
    elapsedSeconds: 60, wpm: 45, accuracy: 98, correct: 225, incorrect: 5 }))
  assert.deepEqual(parseResults(JSON.stringify(results)), results)
})
