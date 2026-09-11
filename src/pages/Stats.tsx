import { useState } from 'react'
import type { TestResult } from '../utils/stats'

export default function Stats({ results, history, storageError }: {
  results: TestResult[]
  history: boolean
  storageError: boolean
}) {
  const [category, setCategory] = useState('all')
  const filtered = results.filter(result => category === 'all' || result.category === category)
  const average = (key: 'wpm' | 'accuracy') => filtered.length
    ? Math.round(filtered.reduce((sum, result) => sum + result[key], 0) / filtered.length) : 0
  const metrics = [
    ['Completed tests', filtered.length],
    ['Best WPM', Math.max(0, ...filtered.map(result => result.wpm))],
    ['Average WPM', average('wpm')],
    ['Average accuracy', `${average('accuracy')}%`],
  ]
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">{history ? 'Practice history' : 'Your stats'}</h1>
        <label className="flex items-center gap-3 text-sm">
          Category
          <select value={category} onChange={event => setCategory(event.target.value)}
            className="min-h-11 rounded-lg border border-[var(--color-text-secondary)]/30 bg-[var(--color-background)] px-3">
            <option value="all">All categories</option>
            <option value="english">English</option>
            <option value="numbers">Numbers</option>
          </select>
        </label>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)]">Based on your latest 100 completed tests, saved in this browser. Leaving a test before it finishes does not save a result.</p>
      {storageError && <p role="status">Browser storage is unavailable. Results will only last for this visit.</p>}
      {filtered.length === 0 ? (
        <div className="space-y-4 rounded-2xl border border-[var(--color-text-secondary)]/20 p-10 text-center">
          <p>No completed tests{category !== 'all' ? ` in ${category}` : ''} yet.</p>
          <a href="#type" className="inline-flex min-h-11 items-center text-[var(--color-accent)]">Start practicing →</a>
        </div>
      ) : <>
        {!history && <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map(([label, value]) => <div key={label} className="space-y-2 rounded-2xl border border-[var(--color-text-secondary)]/20 p-5">
            <dt className="text-sm text-[var(--color-text-secondary)]">{label}</dt>
            <dd className="text-3xl font-semibold text-[var(--color-accent)]">{value}</dd>
          </div>)}
        </dl>}
        <section aria-labelledby="recent-results" className="space-y-4">
          <h2 id="recent-results" className="text-xl font-semibold">{history ? 'Completed tests' : 'Recent results'}</h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--color-text-secondary)]/20">
            <table className="w-full whitespace-nowrap text-left text-sm">
              <thead><tr>{['Date', 'Category', 'Test', 'WPM', 'Accuracy', 'Elapsed'].map(label =>
                <th key={label} scope="col" className="p-4 font-medium text-[var(--color-text-secondary)]">{label}</th>)}</tr></thead>
              <tbody>{filtered.slice(0, history ? 100 : 10).map(result => <tr key={result.id} className="border-t border-[var(--color-text-secondary)]/20">
                <td className="p-4">{new Date(result.completedAt).toLocaleString()}</td>
                <td className="p-4 capitalize">{result.category}</td>
                <td className="p-4">{result.mode === 'time' ? `${result.time}s` : `${result.words} ${result.category === 'numbers' ? 'groups' : 'words'}`}</td>
                <td className="p-4 text-[var(--color-accent)]">{result.wpm}</td>
                <td className="p-4">{result.accuracy}%</td>
                <td className="p-4">{result.elapsedSeconds.toFixed(1)}s</td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
      </>}
      <p className="text-sm text-[var(--color-text-secondary)]">WPM uses correct characters divided by five per minute, including spaces. Accuracy measures the final typed text after corrections. Tests end when time runs out or all text is entered.</p>
    </main>
  )
}
