export type CategoryId = string

export type CategoryDef = {
  id: CategoryId
  label: string
}

export type ThemeDef = {
  id: string
  title: string
  categories: Array<{
    id: CategoryId
    label: string
    words: string[]
  }>
}

export type CardId = string

export type Card = {
  id: CardId
  word: string
  categoryId: CategoryId
  /** All cards are face-up in the MVP for simplicity. */
  faceUp: boolean
}

export type LevelState = {
  seed: number
  themeId: string
  categories: CategoryDef[]
  cardsById: Record<CardId, Card>

  /** 4 columns for the MVP. Each column is a stack of card ids (top is last). */
  tableau: CardId[][]

  /** Stock and waste for a solitaire-like rhythm. */
  stock: CardId[]
  waste: CardId[]

  /** Final piles by category. */
  foundations: Record<CategoryId, CardId[]>
}


