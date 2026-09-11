import type { TestSettings } from '../types/test.ts'
import { practiceCategories } from '../types/test.ts'
import { updateTypedCharacters } from './typing.ts'
import type { TypingSession } from './typing.ts'

export type PerformancePoint = { seconds: number; wpm: number; accuracy: number }

/** Replay accepted input at one-second boundaries, including pauses and corrections. */
export function getPerformanceSeries(words: readonly string[], session: TypingSession, elapsedSeconds: number): PerformancePoint[] {
  if (session.startedAt === null || elapsedSeconds <= 0) return []
  const inputs = session.inputs ?? []
  const characterCount = Array.from(words.join(' ')).length
  const points: PerformancePoint[] = []
  let typed: readonly string[] = []
  let inputIndex = 0
  // Bound chart size for unusually long count-based sessions.
  const interval = Math.max(1, Math.ceil(elapsedSeconds / 300))
  for (let next = interval; ; next += interval) {
    const seconds = Math.min(next, elapsedSeconds)
    while (inputIndex < inputs.length && inputs[inputIndex].at - session.startedAt <= seconds * 1000) {
      typed = updateTypedCharacters(typed, inputs[inputIndex].key, characterCount)
      inputIndex += 1
    }
    const { wpm, accuracy } = calculateStats(words, typed, seconds)
    points.push({ seconds, wpm, accuracy })
    if (seconds === elapsedSeconds) break
  }
  return points
}

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
      && practiceCategories.includes(value.category)
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
