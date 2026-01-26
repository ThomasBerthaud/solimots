import type { Card, CardId, CategoryDef, ImageBankCategory, LevelState, WordBankCategory } from './types'
import { IMAGE_CATEGORIES, WORD_BANK } from './wordBank'

// English comments per project rule.

// ==================== CONFIGURABLE CONSTANTS ====================

// Stock pile configuration
const TARGET_STOCK_SIZE = 10 // Ideally around 10 cards in stock pile

// Tableau configuration
const COLUMN_OPTIONS = [3, 4, 5] // Randomly choose between 3, 4, or 5 columns

// Face-down card patterns (one will be randomly chosen per game)
const PATTERN_OPTIONS = [
  [3, 4, 5], // Pattern 1: starts at 3
  [4, 5, 6], // Pattern 2: starts at 4
  [5, 6, 7], // Pattern 3: starts at 5
]

// Category word count distribution
const WORDS_PER_CATEGORY_DISTRIBUTION = {
  // Majority of categories have 4 words
  fourWords: { weight: 0.6, count: 4 },
  // Some categories have 3 words
  threeWords: { weight: 0.3, count: 3 },
  // Maximum 2 categories with 5 words
  fiveWords: { maxCount: 2, count: 5 },
}

// Word bank validation
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

export type GenerateLevelOptions = {
  seed?: number
}

export function generateLevel(options: GenerateLevelOptions = {}): LevelState {
  const seed = options.seed ?? Date.now()
  const rnd = mulberry32(seed)

  // ==================== PRIORITY 1: Column count ====================
  // Randomly choose between 3, 4, or 5 columns
  const tableauColumns = COLUMN_OPTIONS[Math.floor(rnd() * COLUMN_OPTIONS.length)]

  // ==================== PRIORITY 2: Pattern selection ====================
  // Randomly select a pattern from available options
  const patternIndex = Math.floor(rnd() * PATTERN_OPTIONS.length)
  const basePattern = PATTERN_OPTIONS[patternIndex]
  
  // Extend or truncate pattern to match column count
  const tableauDealPattern: number[] = []
  for (let i = 0; i < tableauColumns; i++) {
    if (i < basePattern.length) {
      tableauDealPattern.push(basePattern[i])
    } else {
      // Continue the incrementing pattern
      tableauDealPattern.push(basePattern[basePattern.length - 1] + (i - basePattern.length + 1))
    }
  }

  // Calculate cards needed in tableau based on pattern
  const cardsInTableau = tableauDealPattern.reduce((acc, n) => acc + n, 0)

  // ==================== PRIORITY 3: Stock pile majority ====================
  // Calculate total cards needed to ensure stock has majority
  // Stock must have more cards than tableau (>50%)
  // Aim for TARGET_STOCK_SIZE cards in stock
  const minStockSize = cardsInTableau + 1 // Stock must have at least tableau + 1 to ensure majority
  const targetStockSize = Math.max(TARGET_STOCK_SIZE, minStockSize)
  const totalCardsNeeded = cardsInTableau + targetStockSize

  // ==================== Select categories and word counts ====================
  // Validate both category banks
  validateWordBank(WORD_BANK)
  validateWordBank(IMAGE_CATEGORIES)

  const totalPlayableCategories = WORD_BANK.length + IMAGE_CATEGORIES.length
  if (totalPlayableCategories < MIN_CATEGORIES_PER_LEVEL) {
    throw new Error(
      `Combined category banks do not have enough playable categories (need >= ${MIN_CATEGORIES_PER_LEVEL}, got ${totalPlayableCategories}).`,
    )
  }

  // Calculate how many categories we need to reach approximately totalCardsNeeded
  // Each category = 1 category card + N word cards (3-5 words per distribution)
  // Word distribution: 60% with 4 words, 30% with 3 words, up to 2 with 5 words
  // 
  // Weighted average calculation:
  // - For large sets: 0.6*4 + 0.3*3 + 0.1*5 = 2.4 + 0.9 + 0.5 = 3.8
  // - This is an approximation; actual card count may vary slightly
  const avgWordsPerCategory = 3.8 
  let estimatedCategories = Math.ceil(totalCardsNeeded / (avgWordsPerCategory + 1)) // +1 for category card
  estimatedCategories = Math.max(MIN_CATEGORIES_PER_LEVEL, Math.min(estimatedCategories, MAX_CATEGORIES_PER_LEVEL))
  
  // Mix word and image categories with majority being word categories
  const minWordCategories = Math.ceil(estimatedCategories * 0.67)
  const maxImageCategories = estimatedCategories - minWordCategories
  const wordCount = Math.min(minWordCategories, WORD_BANK.length)
  const availableImageCount = Math.min(maxImageCategories, IMAGE_CATEGORIES.length)
  const imageCount = Math.floor(rnd() * (availableImageCount + 1))
  const actualCategoryCount = wordCount + imageCount

  // Select categories from each bank
  const selectedWordCategories = pickN(WORD_BANK, wordCount, rnd)
  const selectedImageCategories = pickN(IMAGE_CATEGORIES, imageCount, rnd)
  const selectedCategories = shuffle([...selectedWordCategories, ...selectedImageCategories], rnd)

  const categories: CategoryDef[] = selectedCategories.map((c) => ({ id: c.id, label: c.label }))

  // ==================== Distribute word counts per category ====================
  // Rules: Majority have 4 words, some have 3 words, max 2 have 5 words
  const wordCounts: number[] = []
  
  // Determine how many categories get 5 words (max 2)
  const maxFiveWordCategories = Math.min(WORDS_PER_CATEGORY_DISTRIBUTION.fiveWords.maxCount, actualCategoryCount)
  const fiveWordCount = Math.floor(rnd() * (maxFiveWordCategories + 1))
  
  // Add categories with 5 words
  for (let i = 0; i < fiveWordCount; i++) {
    wordCounts.push(WORDS_PER_CATEGORY_DISTRIBUTION.fiveWords.count)
  }
  
  // For remaining categories, distribute between 3 and 4 words
  const remainingCategories = actualCategoryCount - fiveWordCount
  // Majority should have 4 words, some should have 3
  const fourWordCategories = Math.ceil(remainingCategories * WORDS_PER_CATEGORY_DISTRIBUTION.fourWords.weight)
  const threeWordCategories = remainingCategories - fourWordCategories
  
  for (let i = 0; i < fourWordCategories; i++) {
    wordCounts.push(WORDS_PER_CATEGORY_DISTRIBUTION.fourWords.count)
  }
  for (let i = 0; i < threeWordCategories; i++) {
    wordCounts.push(WORDS_PER_CATEGORY_DISTRIBUTION.threeWords.count)
  }
  
  // Shuffle word counts to distribute randomly
  shuffle(wordCounts, rnd)

  // ==================== Create cards ====================
  const cards: Card[] = []
  const requiredWordsByCategoryId: LevelState['requiredWordsByCategoryId'] = {}

  for (let idx = 0; idx < selectedCategories.length; idx++) {
    const cat = selectedCategories[idx]
    const isImageCategory = 'images' in cat
    const availableItems = isImageCategory
      ? uniqueWords((cat as ImageBankCategory).images)
      : uniqueWords((cat as WordBankCategory).words)
    const requiredRaw = wordCounts[idx]
    const required = Math.min(requiredRaw, availableItems.length)
    requiredWordsByCategoryId[cat.id] = required

    // Category card
    cards.push({
      id: `card_${cards.length}`,
      word: cat.label,
      kind: 'category',
      categoryId: cat.id,
      faceUp: false,
    })

    // Word cards
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

  // ==================== Distribute cards ====================
  const cardsShuffled = shuffle(cards, rnd)
  const cardsById: Record<CardId, Card> = Object.fromEntries(cardsShuffled.map((c) => [c.id, c]))

  const tableau: CardId[][] = Array.from({ length: tableauColumns }, () => [])
  
  // Distribute cards to tableau following the pattern
  // Note: Due to estimation, we may not have exactly totalCardsNeeded cards
  // Prioritize maintaining stock majority while filling the tableau pattern
  const actualTableauDealCount = Math.min(cardsInTableau, Math.max(0, cardsShuffled.length - targetStockSize))
  
  let k = 0
  for (let col = 0; col < tableauColumns; col++) {
    const targetCount = tableauDealPattern[col] ?? 0
    for (let i = 0; i < targetCount && k < actualTableauDealCount; i++) {
      const c = cardsShuffled[k++]
      if (!c) break
      tableau[col].push(c.id)
    }
  }

  // Remaining cards go to stock
  const stock = cardsShuffled.slice(k).map((c) => c.id)
  const waste: CardId[] = []

  // Reveal the top card of each tableau column
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
