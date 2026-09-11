import { useState } from 'react'
import TestModeSelector from '../components/TestModeSelector'
import WordDisplay from '../components/WordDisplay'
import { sampleWords } from '../data/sampleWords'
import { demoCharacterStates } from '../data/demoCharacterStates'
import type { TestSettings } from '../types/test'

export default function Home() {
  const [settings, setSettings] = useState<TestSettings>({
    mode: 'time',
    time: 30,
    words: 25,
  })

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
        <TestModeSelector settings={settings} onChange={setSettings} />
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[var(--color-text-secondary)]/20 p-6 sm:min-h-80 sm:p-10">
          <WordDisplay words={sampleWords} characterStates={demoCharacterStates} />
        </div>
      </section>
    </main>
  )
}
