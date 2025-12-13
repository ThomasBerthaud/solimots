import { create } from 'zustand'
import { generateLevel } from '../game/levelGen'
import type { CardId, CategoryId, LevelState } from '../game/types'

export type GameStatus = 'idle' | 'inProgress' | 'won'

export type MoveSource =
  | { type: 'tableau'; column: number }
  | { type: 'waste' }
  | { type: 'foundation'; categoryId: CategoryId }

export type MoveTarget =
  | { type: 'tableau'; column: number }
  | { type: 'foundation'; categoryId: CategoryId }

type HistoryEntry = {
  level: LevelState
  status: GameStatus
}

type GameStore = {
  level: LevelState | null
  status: GameStatus
  history: HistoryEntry[]
  lastError: { message: string; cardId?: CardId; at: number } | null
  lastAction: { type: 'placed'; cardId: CardId; categoryId: CategoryId; at: number } | null

  newGame: (seed?: number) => void
  resetLevel: () => void
  draw: () => void
  moveCard: (from: MoveSource, to: MoveTarget) => void
  undo: () => void
  clearError: () => void
}

// English comments per project rule.

export const useGameStore = create<GameStore>((set, get) => ({
  level: null,
  status: 'idle',
  history: [],
  lastError: null,
  lastAction: null,

  newGame: (seed) => {
    const level = generateLevel({ seed })
    set({
      level,
      status: 'inProgress',
      history: [],
      lastError: null,
      lastAction: null,
    })
  },

  resetLevel: () => {
    const current = get().level
    const seed = current?.seed
    const level = generateLevel({ seed })
    set({
      level,
      status: 'inProgress',
      history: [],
      lastError: null,
      lastAction: null,
    })
  },

  draw: () => {
    const { level, status } = get()
    if (!level || status !== 'inProgress') return

    set((state) => {
      if (!state.level) return state
      const prev: HistoryEntry = { level: state.level, status: state.status }

      const stock = state.level.stock.slice()
      const waste = state.level.waste.slice()

      if (stock.length === 0) {
        // Recycle waste back into stock (solitaire-like).
        stock.push(...waste.reverse())
        waste.length = 0
      } else {
        const cardId = stock.pop()
        if (cardId) waste.push(cardId)
      }

      return {
        ...state,
        history: [prev, ...state.history].slice(0, 200),
        level: { ...state.level, stock, waste },
        lastError: null,
        lastAction: null,
      }
    })
  },

  moveCard: (from, to) => {
    const { level, status } = get()
    if (!level || status !== 'inProgress') return

    set((state) => {
      if (!state.level) return state
      const prev: HistoryEntry = { level: state.level, status: state.status }

      const next = cloneLevel(state.level)
      const cardId = popFrom(next, from)
      if (!cardId) {
        return {
          ...state,
          lastError: { message: 'Aucune carte à déplacer', at: Date.now() },
        }
      }

      const ok = pushTo(next, cardId, to)
      if (!ok) {
        // Revert pop if invalid push.
        pushTo(next, cardId, fromToTarget(from))
        return {
          ...state,
          lastError: { message: 'Déplacement invalide', cardId, at: Date.now() },
          lastAction: null,
        }
      }

      const nextStatus = computeStatus(next)
      const nextAction =
        to.type === 'foundation'
          ? { type: 'placed' as const, cardId, categoryId: to.categoryId, at: Date.now() }
          : null
      return {
        ...state,
        history: [prev, ...state.history].slice(0, 200),
        level: next,
        status: nextStatus,
        lastError: null,
        lastAction: nextAction,
      }
    })
  },

  undo: () => {
    set((state) => {
      const entry = state.history[0]
      if (!entry) return state
      return {
        ...state,
        level: entry.level,
        status: entry.status,
        history: state.history.slice(1),
        lastError: null,
        lastAction: null,
      }
    })
  },

  clearError: () => set({ lastError: null }),
}))

function cloneLevel(level: LevelState): LevelState {
  return {
    ...level,
    tableau: level.tableau.map((col) => col.slice()),
    stock: level.stock.slice(),
    waste: level.waste.slice(),
    foundations: Object.fromEntries(
      Object.entries(level.foundations).map(([k, v]) => [k, v.slice()]),
    ) as LevelState['foundations'],
  }
}

function popFrom(level: LevelState, from: MoveSource): CardId | null {
  if (from.type === 'waste') return level.waste.pop() ?? null
  if (from.type === 'tableau') return level.tableau[from.column]?.pop() ?? null
  if (from.type === 'foundation') return level.foundations[from.categoryId]?.pop() ?? null
  return null
}

function pushTo(level: LevelState, cardId: CardId, to: MoveTarget): boolean {
  if (to.type === 'tableau') {
    level.tableau[to.column]?.push(cardId)
    return true
  }
  if (to.type === 'foundation') {
    const card = level.cardsById[cardId]
    if (!card) return false
    if (card.categoryId !== to.categoryId) return false
    level.foundations[to.categoryId]?.push(cardId)
    return true
  }
  return false
}

function fromToTarget(from: MoveSource): MoveTarget {
  if (from.type === 'waste') return { type: 'tableau', column: 0 }
  if (from.type === 'tableau') return { type: 'tableau', column: from.column }
  return { type: 'foundation', categoryId: from.categoryId }
}

function computeStatus(level: LevelState): GameStatus {
  const totalPlaced = Object.values(level.foundations).reduce((acc, pile) => acc + pile.length, 0)
  const totalCards = Object.keys(level.cardsById).length
  if (totalPlaced === totalCards) return 'won'
  return 'inProgress'
}


