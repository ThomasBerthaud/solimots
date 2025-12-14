import { create } from 'zustand'
import { generateLevel } from '../game/levelGen'
import type { CardId, CategoryId, LevelState } from '../game/types'

export type GameStatus = 'idle' | 'inProgress' | 'won'

export type MoveSource = { type: 'tableau'; column: number } | { type: 'waste' }

export type MoveTarget = { type: 'tableau'; column: number } | { type: 'slot'; slotIndex: number }

type HistoryEntry = {
  level: LevelState
  status: GameStatus
}

export type LastAction =
  | { type: 'slotPlaced'; cardId: CardId; slotIndex: number; at: number }
  | { type: 'slotCompleted'; slotIndex: number; categoryId: CategoryId; at: number }
  | null

type GameStore = {
  level: LevelState | null
  status: GameStatus
  history: HistoryEntry[]
  lastError: { message: string; cardId?: CardId; at: number } | null
  lastAction: LastAction

  newGame: (seed?: number) => void
  resetLevel: () => void
  draw: () => void
  moveCard: (from: MoveSource, to: MoveTarget) => void
  finalizeSlotCompletion: (slotIndex: number, completedAt: number) => void
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

      const now = Date.now()
      const res = pushTo(next, cardId, to, now)
      if (!res.ok) {
        // Revert pop if invalid push.
        pushBack(next, cardId, from)
        return {
          ...state,
          lastError: { message: 'Déplacement invalide', cardId, at: Date.now() },
          lastAction: null,
        }
      }

      const nextStatus = computeStatus(next)
      const nextAction = res.action

      if (res.completedSlotIndex != null) {
        const slotIndex = res.completedSlotIndex
        const completedAt = res.completedAt ?? now
        // Allow the UI to play a completion animation before clearing the slot.
        window.setTimeout(() => {
          get().finalizeSlotCompletion(slotIndex, completedAt)
        }, 380)
      }
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

  finalizeSlotCompletion: (slotIndex, _completedAt) => {
    // Kept for potential future use (timing / analytics); referenced to satisfy linting.
    void _completedAt
    const { level, status } = get()
    if (!level || status !== 'inProgress') return

    set((state) => {
      if (!state.level) return state
      const slot = state.level.slots[slotIndex]
      if (!slot?.isCompleting) return state

      const next = cloneLevel(state.level)
      const nextSlot = next.slots[slotIndex]
      if (!nextSlot) return state
      if (!nextSlot.isCompleting) return state

      nextSlot.categoryCardId = null
      nextSlot.pile = []
      delete nextSlot.isCompleting

      return {
        ...state,
        level: next,
        status: computeStatus(next),
        lastError: null,
        // Keep lastAction so the UI can still reference the completion timestamp if needed.
        lastAction: state.lastAction,
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
    slots: level.slots.map((s) => ({
      categoryCardId: s.categoryCardId,
      pile: s.pile.slice(),
      isCompleting: s.isCompleting,
    })),
  }
}

function popFrom(level: LevelState, from: MoveSource): CardId | null {
  if (from.type === 'waste') return level.waste.pop() ?? null
  if (from.type === 'tableau') return level.tableau[from.column]?.pop() ?? null
  return null
}

function pushBack(level: LevelState, cardId: CardId, from: MoveSource): void {
  if (from.type === 'waste') {
    level.waste.push(cardId)
    return
  }
  if (from.type === 'tableau') {
    level.tableau[from.column]?.push(cardId)
  }
}

function pushTo(
  level: LevelState,
  cardId: CardId,
  to: MoveTarget,
  now: number,
): { ok: boolean; action: LastAction; completedSlotIndex?: number; completedAt?: number } {
  if (to.type === 'tableau') {
    level.tableau[to.column]?.push(cardId)
    return { ok: true, action: null }
  }
  if (to.type === 'slot') {
    const slot = level.slots[to.slotIndex]
    if (!slot) return { ok: false, action: null }
    if (slot.isCompleting) return { ok: false, action: null }

    const card = level.cardsById[cardId]
    if (!card) return { ok: false, action: null }

    if (slot.categoryCardId == null) {
      if (card.kind !== 'category') return { ok: false, action: null }
      slot.categoryCardId = cardId
      slot.pile = []
      return { ok: true, action: { type: 'slotPlaced', cardId, slotIndex: to.slotIndex, at: now } }
    }

    const categoryCard = level.cardsById[slot.categoryCardId]
    if (!categoryCard || categoryCard.kind !== 'category') return { ok: false, action: null }
    if (card.kind !== 'word') return { ok: false, action: null }
    if (card.categoryId !== categoryCard.categoryId) return { ok: false, action: null }

    slot.pile.push(cardId)

    if (slot.pile.length >= level.wordsPerCategory) {
      slot.isCompleting = true
      return {
        ok: true,
        action: { type: 'slotCompleted', slotIndex: to.slotIndex, categoryId: categoryCard.categoryId, at: now },
        completedSlotIndex: to.slotIndex,
        completedAt: now,
      }
    }

    return { ok: true, action: null }
  }
  return { ok: false, action: null }
}

function computeStatus(level: LevelState): GameStatus {
  const tableauRemaining = level.tableau.reduce((acc, col) => acc + col.length, 0)
  const stockRemaining = level.stock.length
  const wasteRemaining = level.waste.length
  const slotsRemaining = level.slots.reduce(
    // isCompleting is a transient UI flag, not an actual card to count.
    (acc, s) => acc + (s.categoryCardId ? 1 : 0) + s.pile.length,
    0,
  )

  if (tableauRemaining + stockRemaining + wasteRemaining + slotsRemaining === 0) return 'won'
  return 'inProgress'
}
