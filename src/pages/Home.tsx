import { useEffect, useRef, useState } from 'react'
import RestartButton from '../components/RestartButton'
import TestModeSelector from '../components/TestModeSelector'
import TimerDisplay from '../components/TimerDisplay'
import TestResults from '../components/TestResults'
import WordDisplay from '../components/WordDisplay'
import { generateWords } from '../utils/generateWords'
import useTypingInput from '../hooks/useTypingInput'
import type { TestSettings } from '../types/test'
import { categoryDetails } from '../types/test'
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
  const headingRef = useRef<HTMLHeadingElement>(null)
  const focusPractice = useRef(false)
  const words = settings.mode === 'words'
    ? generatedWords.slice(0, settings.words)
    : generatedWords
  const { characterStates, remainingSeconds, status, resetInput, typedCharacters, elapsedSeconds, performanceSeries } = useTypingInput(
    words,
    settings.mode === 'time' ? settings.time : null,
  )
  const result = calculateStats(words, typedCharacters, elapsedSeconds)
  const progress = settings.mode === 'time'
    ? Math.min(100, elapsedSeconds / settings.time * 100)
    : typedCharacters.length / Array.from(words.join(' ')).length * 100

  useEffect(() => {
    if (status === 'finished') headingRef.current?.focus()
    else if (focusPractice.current) {
      focusPractice.current = false
      wordDisplayRef.current?.focus({ preventScroll: true })
    }
  }, [status, generatedWords])

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
    focusPractice.current = true
    setGeneratedWords(generateWords(100, settings.category))
    resetInput()
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 justify-center px-4 py-8 sm:px-6 sm:py-12">
      <section
        aria-labelledby="typing-test-heading"
        data-test-status={status}
        className="w-full min-w-0 space-y-6 sm:space-y-8"
      >
        <div className="flex items-end justify-between gap-6">
        <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-chart-secondary)]">A little practice. A little progress.</p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          id="typing-test-heading"
          className="text-3xl font-semibold tracking-tight sm:text-5xl"
        >
          {status === 'finished' ? 'Nice work. Here’s your finish.' : 'Find your typing rhythm.'}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{status === 'finished' ? 'Every session is another step forward.' : 'Set your pace, settle in, and let your fingers do the work.'}</p>
        </div>
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="hidden size-24 rotate-3 rounded-3xl border-4 border-[var(--color-accent)]/20 object-cover shadow-xl sm:block" />
        </div>
        {status === 'finished' ? (
          <>
            <TestResults wpm={result.wpm} accuracy={result.accuracy} elapsedSeconds={elapsedSeconds}
              points={performanceSeries} timedOut={settings.mode === 'time' && elapsedSeconds === settings.time}
              onTryAgain={handleRestart} />
          </>
        ) : (
          <>
            <div className="practice-settings rounded-2xl border border-[var(--color-text-secondary)]/15 bg-[var(--color-surface)] p-4 sm:p-5">
              <TestModeSelector settings={settings} onChange={handleSettingsChange} />
              <p className="mt-3 text-center text-xs text-[var(--color-text-secondary)]">{categoryDetails[settings.category].description}{settings.mode === 'words' ? ` This test has ${settings.words} ${categoryDetails[settings.category].unit}.` : ''}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4" aria-live="off">
              <div className="metric-card"><span className="metric-label">{remainingSeconds !== null ? 'Seconds left' : 'Progress'}</span>{remainingSeconds !== null ? <TimerDisplay seconds={remainingSeconds} /> : <strong className="metric-value">{Math.round(progress)}<span className="text-lg">%</span></strong>}</div>
              <div className="metric-card"><span className="metric-label">Live WPM</span><strong className="metric-value">{elapsedSeconds >= 1 ? result.wpm : '—'}</strong></div>
              <div className="metric-card"><span className="metric-label">Accuracy</span><strong className="metric-value">{typedCharacters.length ? `${result.accuracy}%` : '—'}</strong></div>
            </div>
            <div className={`typing-stage overflow-hidden rounded-3xl border bg-[var(--color-surface)] transition-colors ${status === 'running' ? 'border-[var(--color-accent)]/50' : 'border-[var(--color-text-secondary)]/20'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-text-secondary)]/10 px-5 py-4 sm:px-8">
              <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest"><span className={`size-2 rounded-full ${status === 'running' ? 'bg-[var(--color-chart-secondary)]' : 'bg-[var(--color-accent)]'}`} />{status === 'running' ? 'In the flow' : 'Ready when you are'}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{categoryDetails[settings.category].label} practice · {settings.mode === 'time' ? `${settings.time} seconds` : `${settings.words} ${categoryDetails[settings.category].unit}`}</span>
            </div>
            <div className="flex min-h-60 items-center p-5 sm:min-h-72 sm:p-8">
              <WordDisplay ref={wordDisplayRef} words={words} characterStates={characterStates} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 sm:px-8">
              <p className="text-xs text-[var(--color-text-secondary)]">{status === 'idle' ? 'Click the text and start typing to begin.' : 'Keep a steady pace. Accuracy comes first.'}</p>
              <div className="flex items-center gap-2"><span className="text-xs text-[var(--color-text-secondary)]">Fresh start</span>
              <RestartButton onRestart={handleRestart} />
              </div>
            </div>
            <div role="progressbar" aria-label="Test progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} className="h-1 bg-[var(--color-text-secondary)]/10">
              <div className="h-full bg-[var(--color-accent)] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
            </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--color-text-secondary)]">
              <p><kbd className="keycap">Space</kbd> next word <span className="mx-2">·</span> <kbd className="keycap">Backspace</kbd> correct a mistake</p>
              <a href="#stats" className="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--color-accent)]/10">Explore your progress ↗</a>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
