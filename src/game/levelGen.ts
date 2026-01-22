import type { Card, CardId, CategoryDef, ImageBankCategory, LevelState, WordBankCategory } from './types'
import { IMAGE_CATEGORIES, WORD_BANK } from './wordBank'

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

  // Generate an increasing sequence pattern with a random starting number.
  // Starting number ranges from 3 to 5, ensuring reasonable card distribution.
  // Examples: [3,4,5], [4,5,6], [5,6,7] for 3 columns
  let tableauDealPattern: number[]
  if (options.tableauDealPattern) {
    tableauDealPattern = options.tableauDealPattern
  } else {
    // Randomly choose a starting number between 3 and 5
    // This ensures all patterns remain within 3-9 cards per column range
    const startNum = randomIntInclusive(3, 5, rnd)
    tableauDealPattern = Array.from({ length: tableauColumns }, (_, i) => startNum + i)
  }

  // Validate both category banks
  validateWordBank(WORD_BANK)
  validateWordBank(IMAGE_CATEGORIES)

  const totalPlayableCategories = WORD_BANK.length + IMAGE_CATEGORIES.length
  if (totalPlayableCategories < MIN_CATEGORIES_PER_LEVEL) {
    throw new Error(
      `Combined category banks do not have enough playable categories (need >= ${MIN_CATEGORIES_PER_LEVEL}, got ${totalPlayableCategories}).`,
    )
  }

  // Max categories we can pick considering we need at least 67% from WORD_BANK
  // If WORD_BANK has 10 categories, we can have at most 10 / 0.67 ≈ 14 total categories
  const maxByWordBankSize = Math.floor(WORD_BANK.length / 0.67)
  const maxPick = Math.min(MAX_CATEGORIES_PER_LEVEL, totalPlayableCategories, maxByWordBankSize)

  let categoryCount: number
  if (options.categoryCount != null) {
    categoryCount = Math.floor(options.categoryCount)
    if (categoryCount < MIN_CATEGORIES_PER_LEVEL || categoryCount > maxPick) {
      categoryCount = Math.max(MIN_CATEGORIES_PER_LEVEL, Math.min(categoryCount, maxPick))
    }
  } else {
    categoryCount = randomIntInclusive(MIN_CATEGORIES_PER_LEVEL, maxPick, rnd)
  }

  // Mix word and image categories with majority being word categories
  // At least 2/3 (67%) should be word categories
  const minWordCategories = Math.ceil(categoryCount * 0.67)
  const maxImageCategories = categoryCount - minWordCategories

  // Ensure we have enough categories in each bank
  const wordCount = Math.min(minWordCategories, WORD_BANK.length)
  const availableImageCount = Math.min(maxImageCategories, IMAGE_CATEGORIES.length)

  // Randomly decide how many image categories to include (0 to availableImageCount)
  const imageCount = Math.floor(rnd() * (availableImageCount + 1))

  // Calculate actual category count based on available categories from both banks
  const actualCategoryCount = wordCount + imageCount

  // Select categories from each bank
  const selectedWordCategories = pickN(WORD_BANK, wordCount, rnd)
  const selectedImageCategories = pickN(IMAGE_CATEGORIES, imageCount, rnd)

  // Combine and shuffle all selected categories
  const selectedCategories = shuffle([...selectedWordCategories, ...selectedImageCategories], rnd)

  const categories: CategoryDef[] = selectedCategories.map((c) => ({ id: c.id, label: c.label }))

  const cards: Card[] = []
  const requiredWordsByCategoryId: LevelState['requiredWordsByCategoryId'] = {}

  // New distribution logic: Majority of categories should have 3-4 words.
  // Between 0-3 categories can have 5 words (randomized for variety).
  const maxLargeCategories = 3
  const largeCategoriesToCreate = Math.min(maxLargeCategories, Math.floor(rnd() * (maxLargeCategories + 1)))

  // Create an array of word counts for each category
  const wordCounts: number[] = []

  // Add large categories (5 words each)
  for (let i = 0; i < largeCategoriesToCreate; i++) {
    wordCounts.push(5)
  }

  // Add remaining small categories (3-4 words each)
  for (let i = largeCategoriesToCreate; i < actualCategoryCount; i++) {
    // Randomly choose between 3 or 4 words
    wordCounts.push(rnd() < 0.5 ? 3 : 4)
  }

  // Shuffle the word counts to distribute them randomly among categories
  shuffle(wordCounts, rnd)

  const dealPattern =
    tableauColumns === tableauDealPattern.length ? tableauDealPattern.map((n) => Math.max(0, Math.floor(n))) : null

  for (let idx = 0; idx < selectedCategories.length; idx++) {
    const cat = selectedCategories[idx]
    const isImageCategory = 'images' in cat
    const availableItems = isImageCategory
      ? uniqueWords((cat as ImageBankCategory).images)
      : uniqueWords((cat as WordBankCategory).words)
    const requiredRaw = wordCounts[idx]
    // Clamp required to not exceed the available unique items for that category.
    const required = Math.min(requiredRaw, availableItems.length)
    requiredWordsByCategoryId[cat.id] = required

    // The category itself is a card in the deck.
    cards.push({
      id: `card_${cards.length}`,
      word: cat.label,
      kind: 'category',
      categoryId: cat.id,
      faceUp: false,
    })

    const items = pickN(availableItems, required, rnd)
    for (const item of items) {
      cards.push({
        id: `card_${cards.length}`,
        word: item,
        kind: 'word',
        categoryId: cat.id,
        faceUp: false,
        imageUrl: isImageCategory ? item : undefined,
      })
    }
  }

  const cardsShuffled = shuffle(cards, rnd)
  const cardsById: Record<CardId, Card> = Object.fromEntries(cardsShuffled.map((c) => [c.id, c]))

  const tableau: CardId[][] = Array.from({ length: tableauColumns }, () => [])
  let tableauDealCount = dealPattern ? dealPattern.reduce((acc, n) => acc + n, 0) : tableauColumns * 3

  // Security: Ensure the majority of cards (>50%) remain in the stock at startup.
  // This prevents scenarios where too many cards are dealt to the tableau initially.
  const totalCards = cardsShuffled.length
  const maxTableauCards = Math.floor((totalCards - 1) / 2)
  if (tableauDealCount > maxTableauCards) {
    tableauDealCount = maxTableauCards
  }

  // Adjust the deal pattern if necessary to fit within available cards while maintaining
  // an increasing sequence. For N columns starting at S: total = N*S + N*(N-1)/2
  let adjustedDealPattern = dealPattern
  if (dealPattern && dealPattern.reduce((acc, n) => acc + n, 0) > tableauDealCount) {
    // Calculate the maximum starting number that fits within tableauDealCount
    // For N columns: N*S + (0+1+2+...+(N-1)) = N*S + N*(N-1)/2 <= tableauDealCount
    const sumOffset = (tableauColumns * (tableauColumns - 1)) / 2
    const maxStartNum = Math.floor((tableauDealCount - sumOffset) / tableauColumns)
    // Use the calculated start number, but prefer 3-5 range when possible
    const newStartNum = maxStartNum >= 3 ? Math.min(5, maxStartNum) : Math.max(2, maxStartNum)
    adjustedDealPattern = Array.from({ length: tableauColumns }, (_, i) => newStartNum + i)
    tableauDealCount = adjustedDealPattern.reduce((acc, n) => acc + n, 0)
  }

  const dealt = cardsShuffled.slice(0, tableauDealCount)

  if (adjustedDealPattern) {
    let k = 0
    for (let col = 0; col < tableauColumns; col++) {
      const count = adjustedDealPattern[col] ?? 0
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

function validateWordBank(categories: Array<{ id: string; label: string; words?: string[]; images?: string[] }>): void {
  if (categories.length === 0) throw new Error('Category bank is empty')

  const seen = new Set<string>()
  const bad: Array<{ id: string; label: string; uniqueWordCount: number }> = []

  for (const c of categories) {
    if (seen.has(c.id)) {
      throw new Error(`Category bank has a duplicate category id "${c.id}".`)
    }
    seen.add(c.id)

    const items = c.words || c.images || []
    const uniqueCount = uniqueWords(items).length
    if (uniqueCount < MIN_WORDS_PER_CATEGORY_IN_BANK) {
      bad.push({ id: c.id, label: c.label, uniqueWordCount: uniqueCount })
    }
  }

  if (bad.length > 0) {
    const details = bad.map((c) => `${c.id} (${c.label}): ${c.uniqueWordCount}`).join(', ')
    throw new Error(
      `Category bank categories must have at least ${MIN_WORDS_PER_CATEGORY_IN_BANK} unique items. Invalid: ${details}`,
    )
  }
}
