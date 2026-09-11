import { englishWords } from '../data/englishWords.ts'
import type { TestCategory } from '../types/test.ts'
import { codeSnippets, practiceQuotes } from '../data/practiceTexts.ts'

/** Generate complete practice units: words, digit groups, snippets, or sentences. */
export function generateWords(count: number, category: TestCategory = 'english'): string[] {
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new RangeError('Word count must be a non-negative safe integer.')
  }

  const words: string[] = []
  if (category === 'numbers') {
    for (let position = 0; position < count; position += 1) {
      const length = 2 + Math.floor(Math.random() * 5)
      let digits = ''
      for (let digit = 0; digit < length; digit += 1) {
        digits += Math.floor(Math.random() * 10)
      }
      words.push(digits)
    }
    return words
  }

  let previousIndex = -1
  const pool = category === 'code' ? codeSnippets : category === 'quotes' ? practiceQuotes : englishWords
  const punctuation = [',', '.', '!', '?', ';', ':']

  for (let position = 0; position < count; position += 1) {
    const availableCount = pool.length - (previousIndex === -1 ? 0 : 1)
    let index = Math.floor(Math.random() * availableCount)

    // Skip the previous entry instead of retrying random selections.
    if (previousIndex !== -1 && index >= previousIndex) index += 1

    let word = pool[index]
    if (category === 'punctuation') {
      const style = Math.floor(Math.random() * 9)
      word = style < 6 ? word + punctuation[style]
        : style === 6 ? `"${word}"` : style === 7 ? `(${word})` : `${word}'s`
    }
    words.push(word)
    previousIndex = index
  }

  return words
}
