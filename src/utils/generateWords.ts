import { englishWords } from '../data/englishWords.ts'

/** Generate common English words without consecutive duplicates. */
export function generateWords(count: number): string[] {
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new RangeError('Word count must be a non-negative safe integer.')
  }

  const words: string[] = []
  let previousIndex = -1

  for (let position = 0; position < count; position += 1) {
    const availableCount = englishWords.length - (previousIndex === -1 ? 0 : 1)
    let index = Math.floor(Math.random() * availableCount)

    // Skip the previous entry instead of retrying random selections.
    if (previousIndex !== -1 && index >= previousIndex) index += 1

    words.push(englishWords[index])
    previousIndex = index
  }

  return words
}
