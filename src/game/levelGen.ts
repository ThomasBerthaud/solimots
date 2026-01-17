import type { Card, CardId, CategoryDef, LevelState } from './types'
import { WORD_BANK } from './wordBank'

// English comments per project rule.

const MIN_WORDS_PER_CATEGORY_IN_BANK = 8
const MIN_CATEGORIES_PER_LEVEL = 6
const MAX_CATEGORIES_PER_LEVEL = 12

function mulberry32(seed: number) {
  // Deterministic PRNG suitable for gameplay shuffles.
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickN<T>(arr: T[], n: number, rnd: () => number): T[] {
  if (arr.length < n) return shuffle(arr, rnd)
  return shuffle(arr, rnd).slice(0, n)
}

function randomIntInclusive(min: number, max: number, rnd: () => number): number {
  if (max < min) return min
  return min + Math.floor(rnd() * (max - min + 1))
}

export type GenerateLevelOptions = {
  seed?: number
  /** How many categories are included in the level (must be > 4 for slot gameplay). */
  categoryCount?: number
  /** Number of columns (3-5, randomly chosen if not specified). */
  tableauColumns?: number
  /**
   * Tableau deal pattern from left to right (top is last).
   * Auto-generated based on column count if not specified.
   */
  tableauDealPattern?: number[]
}

export function generateLevel(options: GenerateLevelOptions = {}): LevelState {
  const seed = options.seed ?? Date.now()
  const rnd = mulberry32(seed)

  // Randomly choose between 3, 4, or 5 columns if not specified
  const tableauColumns = options.tableauColumns ?? randomIntInclusive(3, 5, rnd)
  
  // Generate deal pattern based on column count: [4, 5, 6, ...] up to the number of columns
  const tableauDealPattern = options.tableauDealPattern ?? 
    Array.from({ length: tableauColumns }, (_, i) => 4 + i)

  validateWordBank(WORD_BANK)

  const playableCategories = WORD_BANK
  if (playableCategories.length < MIN_CATEGORIES_PER_LEVEL) {
    throw new Error(
      `WORD_BANK does not have enough playable categories (need >= ${MIN_CATEGORIES_PER_LEVEL}, got ${playableCategories.length}).`,
    )
  }

  const maxPick = Math.min(MAX_CATEGORIES_PER_LEVEL, playableCategories.length)
  let categoryCount: number
  if (options.categoryCount != null) {
    categoryCount = Math.floor(options.categoryCount)
    if (categoryCount < MIN_CATEGORIES_PER_LEVEL || categoryCount > maxPick) {
      throw new Error(
        `Invalid categoryCount "${options.categoryCount}". Must be between ${MIN_CATEGORIES_PER_LEVEL} and ${maxPick}.`,
      )
    }
  } else {
    categoryCount = randomIntInclusive(MIN_CATEGORIES_PER_LEVEL, maxPick, rnd)
  }

  const selectedCategories = pickN(playableCategories, categoryCount, rnd)

  const categories: CategoryDef[] = selectedCategories.map((c) => ({ id: c.id, label: c.label }))

  const cards: Card[] = []
  const requiredWordsByCategoryId: LevelState['requiredWordsByCategoryId'] = {}

  // New distribution logic: Majority of categories should have 3-4 words.
  // Between 0-3 categories can have 5 words (randomized for variety).
  const maxLargeCategories = 3
  const largeCategoriesToCreate = Math.min(
    maxLargeCategories,
    Math.floor(rnd() * (maxLargeCategories + 1)),
  )

  // Create an array of word counts for each category
  const wordCounts: number[] = []

  // Add large categories (5 words each)
  for (let i = 0; i < largeCategoriesToCreate; i++) {
    wordCounts.push(5)
  }

  // Add remaining small categories (3-4 words each)
  for (let i = largeCategoriesToCreate; i < categoryCount; i++) {
    // Randomly choose between 3 or 4 words
    wordCounts.push(rnd() < 0.5 ? 3 : 4)
  }

  // Shuffle the word counts to distribute them randomly among categories
  shuffle(wordCounts, rnd)

  const dealPattern =
    tableauColumns === tableauDealPattern.length
      ? tableauDealPattern.map((n) => Math.max(0, Math.floor(n)))
      : null

  for (let idx = 0; idx < selectedCategories.length; idx++) {
    const cat = selectedCategories[idx]
    const availableWords = uniqueWords(cat.words)
    const requiredRaw = wordCounts[idx]
    // Clamp required to not exceed the available unique words for that category.
    const required = Math.min(requiredRaw, availableWords.length)
    requiredWordsByCategoryId[cat.id] = required

    // The category itself is a card in the deck.
    cards.push({
      id: `card_${cards.length}`,
      word: cat.label,
      kind: 'category',
      categoryId: cat.id,
      faceUp: false,
    })

    const words = pickN(availableWords, required, rnd)
    for (const w of words) {
      cards.push({
        id: `card_${cards.length}`,
        word: w,
        kind: 'word',
        categoryId: cat.id,
        faceUp: false,
      })
    }
  }

  const cardsShuffled = shuffle(cards, rnd)
  const cardsById: Record<CardId, Card> = Object.fromEntries(cardsShuffled.map((c) => [c.id, c]))

  const tableau: CardId[][] = Array.from({ length: tableauColumns }, () => [])
  const tableauDealCount = dealPattern ? dealPattern.reduce((acc, n) => acc + n, 0) : tableauColumns * 3
  const dealt = cardsShuffled.slice(0, tableauDealCount)

  if (dealPattern) {
    let k = 0
    for (let col = 0; col < tableauColumns; col++) {
      const count = dealPattern[col] ?? 0
      for (let i = 0; i < count; i++) {
        const c = dealt[k++]
        if (!c) break
        tableau[col].push(c.id)
      }
    }
  } else {
    // Fallback: even distribution if pattern is invalid.
    dealt.forEach((c, idx) => {
      tableau[idx % tableauColumns].push(c.id)
    })
  }

  const stock = cardsShuffled.slice(tableauDealCount).map((c) => c.id)
  const waste: CardId[] = []

  // Reveal the top card of each tableau column (solitaire-like).
  for (let col = 0; col < tableau.length; col++) {
    const topId = tableau[col]?.at(-1)
    if (!topId) continue
    const top = cardsById[topId]
    if (top) top.faceUp = true
  }

  const slots: LevelState['slots'] = Array.from({ length: tableauColumns }, () => ({
    categoryCardId: null,
    pile: [],
  }))

  return {
    seed,
    categories,
    cardsById,
    requiredWordsByCategoryId,
    tableau,
    stock,
    waste,
    slots,
  }
}

function uniqueWords(words: string[]): string[] {
  return Array.from(new Set(words.map((w) => w.trim()).filter(Boolean)))
}

function validateWordBank(categories: Array<{ id: string; label: string; words: string[] }>): void {
  if (categories.length === 0) throw new Error('WORD_BANK is empty')

  const seen = new Set<string>()
  const bad: Array<{ id: string; label: string; uniqueWordCount: number }> = []

  for (const c of categories) {
    if (seen.has(c.id)) {
      throw new Error(`WORD_BANK has a duplicate category id "${c.id}".`)
    }
    seen.add(c.id)

    const uniqueCount = uniqueWords(c.words).length
    if (uniqueCount < MIN_WORDS_PER_CATEGORY_IN_BANK) {
      bad.push({ id: c.id, label: c.label, uniqueWordCount: uniqueCount })
    }
  }

  if (bad.length > 0) {
    const details = bad.map((c) => `${c.id} (${c.label}): ${c.uniqueWordCount}`).join(', ')
    throw new Error(
      `WORD_BANK categories must have at least ${MIN_WORDS_PER_CATEGORY_IN_BANK} unique words. Invalid: ${details}`,
    )
  }
}
