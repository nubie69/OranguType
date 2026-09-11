import { useId } from 'react'
import type { PerformancePoint } from '../utils/stats'

function LineGraph({ points, metric, label, color }: {
  points: PerformancePoint[]
  metric: 'wpm' | 'accuracy'
  label: string
  color: string
}) {
  const titleId = useId()
  const maxY = metric === 'accuracy' ? 100 : Math.max(20, Math.ceil(Math.max(...points.map(point => point.wpm), 0) / 20) * 20)
  const duration = points.at(-1)?.seconds ?? 1
  const x = (seconds: number) => 48 + seconds / duration * 420
  const y = (value: number) => 190 - value / maxY * 160
  const coordinates = points.map(point => `${x(point.seconds)},${y(point[metric])}`).join(' ')
  return (
    <figure className="min-w-0 rounded-xl border border-[var(--color-text-secondary)]/20 p-3 sm:p-4">
      <figcaption id={titleId} className="text-sm font-medium">{label} over time</figcaption>
      <svg viewBox="0 0 500 240" role="img" aria-labelledby={titleId} className="mt-2 w-full">
        <desc>Cumulative {label.toLowerCase()} during the test. Exact values are available in the data table below.</desc>
        {[0, 0.5, 1].map(fraction => <g key={fraction}>
          <line x1="48" x2="468" y1={y(maxY * fraction)} y2={y(maxY * fraction)} stroke="var(--color-text-secondary)" opacity="0.2" />
          <text x="38" y={y(maxY * fraction) + 4} textAnchor="end" fill="var(--color-text-secondary)" fontSize="12">{maxY * fraction}{metric === 'accuracy' ? '%' : ''}</text>
        </g>)}
        {[0, 0.5, 1].map(fraction => <text key={fraction} x={x(duration * fraction)} y="211" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="12">{Number((duration * fraction).toFixed(1))}s</text>)}
        <text x="258" y="235" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="12">Elapsed time (seconds)</text>
        <polyline points={coordinates} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map(point => <circle key={point.seconds} cx={x(point.seconds)} cy={y(point[metric])} r={points.length === 1 ? 4 : 2} fill={color}>
          <title>{point.seconds.toFixed(1)}s: {point[metric]}{metric === 'accuracy' ? '%' : ' WPM'}</title>
        </circle>)}
      </svg>
    </figure>
  )
}

export default function TestResults({ wpm, accuracy, elapsedSeconds, points, timedOut, onTryAgain }: {
  wpm: number
  accuracy: number
  elapsedSeconds: number
  points: PerformancePoint[]
  timedOut: boolean
  onTryAgain: () => void
}) {
  return (
    <section aria-labelledby="test-results-heading" className="space-y-5 rounded-2xl border border-[var(--color-accent)]/30 p-5 sm:p-6">
      <h2 id="test-results-heading" className="text-xl font-semibold">Your results</h2>
      <p role="status" className="sr-only">{timedOut ? "Time's up." : 'Test finished.'} {wpm} WPM and {accuracy}% accuracy.</p>
      <dl className="grid grid-cols-2 gap-4 text-center">
        {[[`${wpm}`, 'WPM'], [`${accuracy}%`, 'Accuracy']].map(([value, label]) => <div key={label}>
          <dt className="text-sm text-[var(--color-text-secondary)]">{label}</dt>
          <dd className="mt-2 text-5xl font-semibold text-[var(--color-accent)] sm:text-7xl">{value}</dd>
        </div>)}
      </dl>
      <p className="text-center text-sm text-[var(--color-text-secondary)]">{Number(elapsedSeconds.toFixed(1))} seconds</p>
      <div className="flex justify-center">
        <button type="button" onClick={onTryAgain}
          className="min-h-11 cursor-pointer rounded-lg bg-[var(--color-accent)] px-8 py-3 font-semibold text-[var(--color-background)] transition-opacity hover:opacity-90">
          Try again
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <LineGraph points={points} metric="wpm" label="WPM" color="var(--color-accent)" />
        <LineGraph points={points} metric="accuracy" label="Accuracy" color="#a78bfa" />
      </div>
      <p className="text-xs text-[var(--color-text-secondary)]">Each point measures your overall performance up to that time. WPM uses five correct characters per word; accuracy reflects typed text after corrections.</p>
      <details className="text-sm">
        <summary className="cursor-pointer text-[var(--color-text-secondary)]">View graph data</summary>
        <div className="mt-3 max-h-60 overflow-auto">
          <table className="w-full text-left">
            <thead><tr>{['Elapsed', 'WPM', 'Accuracy'].map(label => <th key={label} scope="col" className="p-2">{label}</th>)}</tr></thead>
            <tbody>{points.map(point => <tr key={point.seconds}><td className="p-2">{Number(point.seconds.toFixed(3))}s</td><td className="p-2">{point.wpm}</td><td className="p-2">{point.accuracy}%</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </section>
  )
}
