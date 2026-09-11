import { useState } from 'react'
import RestartButton from '../components/RestartButton'
import TestModeSelector from '../components/TestModeSelector'
import TimerDisplay from '../components/TimerDisplay'
import WordDisplay from '../components/WordDisplay'
import { generateWords } from '../utils/generateWords'
import useTypingInput from '../hooks/useTypingInput'
import type { TestSettings } from '../types/test'

export default function Home() {
  const [settings, setSettings] = useState<TestSettings>({
    mode: 'time',
    time: 30,
    words: 25,
  })
  const [generatedWords] = useState(() => generateWords(100))
  const words = settings.mode === 'words'
    ? generatedWords.slice(0, settings.words)
    : generatedWords
  const { characterStates, resetInput } = useTypingInput(words)

  function handleSettingsChange(nextSettings: TestSettings) {
    setSettings(nextSettings)
    resetInput()
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6 py-12 sm:py-16">
      <section
        aria-labelledby="typing-test-heading"
        className="w-full min-w-0 max-w-4xl space-y-6 sm:space-y-8"
      >
        <h1
          id="typing-test-heading"
          className="text-center text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Typing test
        </h1>
        <TestModeSelector settings={settings} onChange={handleSettingsChange} />
        {settings.mode === 'time' && <TimerDisplay seconds={settings.time} />}
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[var(--color-text-secondary)]/20 p-6 sm:min-h-80 sm:p-10">
          <WordDisplay words={words} characterStates={characterStates} />
        </div>
        <div className="flex justify-center">
          <RestartButton />
        </div>
      </section>
    </main>
  )
}
