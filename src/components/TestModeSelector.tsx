import type { TestSettings } from '../types/test'

type TestModeSelectorProps = {
  settings: TestSettings
  onChange: (settings: TestSettings) => void
}

const timeOptions = [15, 30, 60, 120] as const
const wordOptions = [10, 25, 50, 100] as const
const optionClassName =
  'flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] peer-checked:bg-[var(--color-accent)]/10 peer-checked:text-[var(--color-accent)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)]'

export default function TestModeSelector({
  settings,
  onChange,
}: TestModeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
      <fieldset className="min-w-0">
        <legend className="sr-only">Test mode</legend>
        <div className="flex items-center gap-1">
          {(['time', 'words'] as const).map((mode) => (
            <label key={mode}>
              <input
                type="radio"
                name="test-mode"
                value={mode}
                checked={settings.mode === mode}
                onChange={() => onChange({ ...settings, mode })}
                className="peer sr-only"
              />
              <span className={optionClassName}>
                {mode === 'time' ? 'Time' : 'Words'}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <span
        aria-hidden="true"
        className="hidden h-6 w-px bg-[var(--color-text-secondary)]/20 sm:block"
      />

      <fieldset key={settings.mode} className="min-w-0">
        <legend className="sr-only">
          {settings.mode === 'time' ? 'Duration in seconds' : 'Word count'}
        </legend>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {settings.mode === 'time'
            ? timeOptions.map((time) => (
                <label key={time}>
                  <input
                    type="radio"
                    name="test-duration"
                    value={time}
                    checked={settings.time === time}
                    onChange={() => onChange({ ...settings, time })}
                    className="peer sr-only"
                  />
                  <span className={optionClassName}>
                    {time}<span className="sr-only"> seconds</span>
                  </span>
                </label>
              ))
            : wordOptions.map((words) => (
                <label key={words}>
                  <input
                    type="radio"
                    name="test-word-count"
                    value={words}
                    checked={settings.words === words}
                    onChange={() => onChange({ ...settings, words })}
                    className="peer sr-only"
                  />
                  <span className={optionClassName}>
                    {words}<span className="sr-only"> words</span>
                  </span>
                </label>
              ))}
        </div>
      </fieldset>
    </div>
  )
}
