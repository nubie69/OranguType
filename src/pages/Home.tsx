import { useEffect, useRef, useState } from 'react'
import RestartButton from '../components/RestartButton'
import TestModeSelector from '../components/TestModeSelector'
import TimerDisplay from '../components/TimerDisplay'
import TestResults from '../components/TestResults'
import WordDisplay from '../components/WordDisplay'
import { generateWords } from '../utils/generateWords'
import useTypingInput from '../hooks/useTypingInput'
import type { TestSettings } from '../types/test'
import { calculateStats } from '../utils/stats'
import type { TestResult } from '../utils/stats'

export default function Home({ onComplete }: { onComplete: (result: TestResult) => void }) {
  const saved = useRef(false)
  const [settings, setSettings] = useState<TestSettings>({
    category: 'english',
    mode: 'time',
    time: 30,
    words: 25,
  })
  const [generatedWords, setGeneratedWords] = useState(() => generateWords(100))
  const wordDisplayRef = useRef<HTMLDivElement>(null)
  const words = settings.mode === 'words'
    ? generatedWords.slice(0, settings.words)
    : generatedWords
  const { characterStates, remainingSeconds, status, resetInput, typedCharacters, elapsedSeconds, performanceSeries } = useTypingInput(
    words,
    settings.mode === 'time' ? settings.time : null,
  )
  const result = calculateStats(words, typedCharacters, elapsedSeconds)

  useEffect(() => {
    if (status !== 'finished' || saved.current) return
    saved.current = true
    onComplete({ ...settings, ...calculateStats(words, typedCharacters, elapsedSeconds),
      id: crypto.randomUUID(), completedAt: new Date().toISOString(), elapsedSeconds })
  }, [status, settings, words, typedCharacters, elapsedSeconds, onComplete])

  function handleSettingsChange(nextSettings: TestSettings) {
    saved.current = false
    if (nextSettings.category !== settings.category) {
      setGeneratedWords(generateWords(100, nextSettings.category))
    }
    setSettings(nextSettings)
    resetInput()
  }

  function handleRestart() {
    saved.current = false
    setGeneratedWords(generateWords(100, settings.category))
    resetInput()
    wordDisplayRef.current?.focus({ preventScroll: true })
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6 py-12 sm:py-16">
      <section
        aria-labelledby="typing-test-heading"
        data-test-status={status}
        className="w-full min-w-0 max-w-4xl space-y-6 sm:space-y-8"
      >
        <h1
          id="typing-test-heading"
          className="text-center text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Typing test
        </h1>
        <TestModeSelector settings={settings} onChange={handleSettingsChange} />
        {remainingSeconds !== null && <TimerDisplay seconds={remainingSeconds} />}
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[var(--color-text-secondary)]/20 p-6 sm:min-h-80 sm:p-10">
          <WordDisplay ref={wordDisplayRef} words={words} characterStates={characterStates} isFinished={status === 'finished'} />
        </div>
        {status === 'finished' && (
          <TestResults wpm={result.wpm} accuracy={result.accuracy} elapsedSeconds={elapsedSeconds}
            points={performanceSeries} timedOut={settings.mode === 'time' && elapsedSeconds === settings.time} />
        )}
        <div className="flex justify-center">
          <RestartButton onRestart={handleRestart} />
        </div>
      </section>
    </main>
  )
}
