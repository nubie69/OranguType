import type { TestSettings } from '../types/test.ts'

export type TestResult = TestSettings & {
  id: string
  completedAt: string
  elapsedSeconds: number
  wpm: number
  accuracy: number
  correct: number
  incorrect: number
}

export function calculateStats(words: readonly string[], typed: readonly string[], elapsedSeconds: number) {
  const expected = Array.from(words.join(' '))
  const correct = typed.filter((character, index) => character === expected[index]).length
  return {
    correct,
    incorrect: typed.length - correct,
    wpm: elapsedSeconds > 0 ? Math.round(correct / 5 / (elapsedSeconds / 60)) : 0,
    accuracy: typed.length > 0 ? Math.round(correct / typed.length * 100) : 0,
  }
}

export const statsStorageKey = 'typelab-results-v1'

export function parseResults(raw: string | null): TestResult[] {
  try {
    const values: unknown = JSON.parse(raw ?? '[]')
    if (!Array.isArray(values)) return []
    return values.filter((value): value is TestResult => value !== null
      && typeof value === 'object'
      && typeof value.id === 'string'
      && typeof value.completedAt === 'string' && Number.isFinite(Date.parse(value.completedAt))
      && ['english', 'numbers'].includes(value.category)
      && ['time', 'words'].includes(value.mode)
      && [15, 30, 60, 120].includes(value.time)
      && [10, 25, 50, 100].includes(value.words)
      && ['elapsedSeconds', 'wpm', 'accuracy', 'correct', 'incorrect'].every(
        key => typeof value[key] === 'number' && Number.isFinite(value[key]) && value[key] >= 0)
      && value.accuracy <= 100).slice(0, 100)
  } catch {
    return []
  }
}
