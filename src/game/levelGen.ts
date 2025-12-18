import type { Card, CardId, CategoryDef, LevelState, ThemeDef } from './types'
import { WORD_BANK } from './wordBank'

// English comments per project rule.

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

export type GenerateLevelOptions = {
  seed?: number
  /** Min required words to complete a category (inclusive). */
  requiredWordsMin?: number
  /** Max required words to complete a category (inclusive). */
  requiredWordsMax?: number
  /** How many categories are included in the level (must be > 4 for slot gameplay). */
  categoryCount?: number
  /** Fixed MVP: 4 columns. */
  tableauColumns?: number
  /**
   * Tableau deal pattern from left to right (top is last).
   * Default: [2, 3, 4, 5].
   */
  tableauDealPattern?: number[]
  /** Optionally force a theme by id. */
  themeId?: string
}

export function generateLevel(options: GenerateLevelOptions = {}): LevelState {
  const seed = options.seed ?? Date.now()
  const rnd = mulberry32(seed)

  const requiredWordsMin = options.requiredWordsMin ?? 3
  const requiredWordsMax = options.requiredWordsMax ?? 6
  const categoryCount = options.categoryCount ?? 8
  const tableauColumns = options.tableauColumns ?? 4
  const tableauDealPattern = options.tableauDealPattern ?? [2, 3, 4, 5]

  const theme = pickTheme(options.themeId, rnd)
  const playableCategories = theme.categories.filter((c) => uniqueWords(c.words).length > 0)
  if (playableCategories.length < 5) {
    throw new Error(`Theme "${theme.id}" does not have enough categories with words (need >= 5).`)
  }
  const selectedCategories = pickN(playableCategories, Math.max(5, categoryCount), rnd)

  const categories: CategoryDef[] = selectedCategories.map((c) => ({ id: c.id, label: c.label }))

  const cards: Card[] = []
  const requiredWordsByCategoryId: LevelState['requiredWordsByCategoryId'] = {}

  const clampMin = Math.max(0, Math.floor(requiredWordsMin))
  const clampMax = Math.max(clampMin, Math.floor(requiredWordsMax))

  const dealPattern =
    tableauColumns === 4 && tableauDealPattern.length === 4
      ? tableauDealPattern.map((n) => Math.max(0, Math.floor(n)))
      : null

  for (const cat of selectedCategories) {
    const availableWords = uniqueWords(cat.words)
    const requiredRaw = clampMin + Math.floor(rnd() * (clampMax - clampMin + 1))
    // Clamp required to not exceed the available unique words for that category.
    const required = Math.min(requiredRaw, availableWords.length)
    requiredWordsByCategoryId[cat.id] = required

    // The category itself is a card in the deck.
    cards.push({
      id: `card_${cards.length}`,
      word: cat.label,
      kind: 'category',
      categoryId: cat.id,
      faceUp: true,
    })

    const words = pickN(availableWords, required, rnd)
    for (const w of words) {
      cards.push({
        id: `card_${cards.length}`,
        word: w,
        kind: 'word',
        categoryId: cat.id,
        faceUp: true,
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

  const slots: LevelState['slots'] = Array.from({ length: 4 }, () => ({
    categoryCardId: null,
    pile: [],
  }))

  return {
    seed,
    themeId: theme.id,
    categories,
    cardsById,
    requiredWordsByCategoryId,
    tableau,
    stock,
    waste,
    slots,
  }
}

function pickTheme(themeId: string | undefined, rnd: () => number): ThemeDef {
  if (themeId) {
    const found = WORD_BANK.find((t) => t.id === themeId)
    if (found) return found
  }
  if (WORD_BANK.length === 0) {
    throw new Error('WORD_BANK is empty')
  }
  return WORD_BANK[Math.floor(rnd() * WORD_BANK.length)]
}

function uniqueWords(words: string[]): string[] {
  return Array.from(new Set(words.map((w) => w.trim()).filter(Boolean)))
}
