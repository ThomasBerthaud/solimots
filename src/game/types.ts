export type CategoryId = string

export type CategoryDef = {
  id: CategoryId
  label: string
}

export type WordBankCategory = {
  id: CategoryId
  label: string
  words: string[]
}

export type ImageBankCategory = {
  id: CategoryId
  label: string
  images: string[]
}

export type CardId = string

export type CardKind = 'word' | 'category'

export type Card = {
  id: CardId
  word: string
  kind: CardKind
  /**
   * For word cards: the category the word belongs to.
   * For category cards: the category this card represents.
   */
  categoryId: CategoryId
  /** All cards are face-up in the MVP for simplicity. */
  faceUp: boolean
  /** Optional image URL for image-based cards. */
  imageUrl?: string
}

export type SlotState = {
  /** The placed category card that unlocks the slot, or null if empty. */
  categoryCardId: CardId | null
  /** Word cards placed under the category (top is last). */
  pile: CardId[]
  /** When true, the slot is playing a completion animation and is temporarily locked. */
  isCompleting?: boolean
}

export type LevelState = {
  seed: number
  categories: CategoryDef[]
  cardsById: Record<CardId, Card>
  /**
   * Number of word cards required to complete each category.
   * This value is random per category for each level.
   */
  requiredWordsByCategoryId: Record<CategoryId, number>

  /** 4 columns for the MVP. Each column is a stack of card ids (top is last). */
  tableau: CardId[][]

  /** Stock and waste for a solitaire-like rhythm. */
  stock: CardId[]
  waste: CardId[]

  /** 4 free slots that accept a category card, then its matching words. */
  slots: SlotState[]
}
