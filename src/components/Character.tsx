import type { CharacterState } from '../types/character'
import TypingCaret from './TypingCaret'

type CharacterProps = {
  character: string
  state?: CharacterState
}

const stateClasses: Record<CharacterState, string> = {
  untyped: 'text-[var(--color-text-secondary)]',
  correct: 'text-[var(--color-text-primary)]',
  incorrect:
    'bg-[var(--color-error)]/10 text-[var(--color-error)] underline decoration-2 underline-offset-4',
  current:
    'bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
}

export default function Character({ character, state = 'untyped' }: CharacterProps) {
  return (
    <span data-state={state} className={`relative ${stateClasses[state]}`}>
      {state === 'current' && <TypingCaret />}
      {character}
    </span>
  )
}
