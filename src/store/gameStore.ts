import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { generateLevel } from '../game/levelGen'
import type { CardId, CategoryId, LevelState } from '../game/types'

export type GameStatus = 'idle' | 'inProgress' | 'won' | 'lost'

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
  /**
   * Tracks repeated draw/recycle states while no legal moves exist.
   * Not persisted; used to detect Klondike-like "loop" losses.
   */
  drawLoopSeen: Record<string, true>

  newGame: (seed?: number) => void
  resetLevel: () => void
  draw: () => void
  moveCard: (from: MoveSource, to: MoveTarget) => void
  finalizeSlotCompletion: (slotIndex: number, completedAt: number) => void
  undo: () => void
  clearError: () => void
}

let gameEpoch = 0
const slotFinalizeTimers: Record<number, number | undefined> = {}

function cancelAllSlotFinalizeTimers(): void {
  for (const timerId of Object.values(slotFinalizeTimers)) {
    if (timerId != null) window.clearTimeout(timerId)
  }
  for (const key of Object.keys(slotFinalizeTimers)) {
    delete slotFinalizeTimers[Number(key)]
  }
}

function bumpGameEpoch(): void {
  gameEpoch += 1
  cancelAllSlotFinalizeTimers()
}

function scheduleFinalizeSlot(
  get: () => GameStore,
  slotIndex: number,
  completedAt: number,
): void {
  const existing = slotFinalizeTimers[slotIndex]
  if (existing != null) window.clearTimeout(existing)

  const scheduledEpoch = gameEpoch
  slotFinalizeTimers[slotIndex] = window.setTimeout(() => {
    if (gameEpoch !== scheduledEpoch) return
    get().finalizeSlotCompletion(slotIndex, completedAt)
  }, 380)
}

// English comments per project rule.

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      level: null,
      status: 'idle',
      history: [],
      lastError: null,
      lastAction: null,
      drawLoopSeen: {},

      newGame: (seed) => {
        bumpGameEpoch()
        const level = generateLevel({ seed })
        set({
          level,
          status: 'inProgress',
          history: [],
          lastError: null,
          lastAction: null,
          drawLoopSeen: {},
        })
      },

      resetLevel: () => {
        bumpGameEpoch()
        const current = get().level
        const seed = current?.seed
        const level = generateLevel({ seed })
        set({
          level,
          status: 'inProgress',
          history: [],
          lastError: null,
          lastAction: null,
          drawLoopSeen: {},
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

          const nextLevel: LevelState = { ...state.level, stock, waste }
          const wonOrInProgress = computeStatus(nextLevel)

          // Klondike-like loss: only declare lost after the player loops through draw/recycle
          // states without any legal slot move becoming available.
          if (wonOrInProgress !== 'won') {
            const anySlotMove = hasAnySlotMove(nextLevel)
            if (anySlotMove) {
              return {
                ...state,
                history: [prev, ...state.history].slice(0, 200),
                level: nextLevel,
                status: 'inProgress',
                lastError: null,
                lastAction: null,
                drawLoopSeen: {},
              }
            }

            const key = computeDrawLoopKey(nextLevel)
            const alreadySeen = Boolean(state.drawLoopSeen[key])
            if (alreadySeen) {
              return {
                ...state,
                history: [prev, ...state.history].slice(0, 200),
                level: nextLevel,
                status: 'lost',
                lastError: null,
                lastAction: null,
                // Keep drawLoopSeen as-is for debugging/consistency (not persisted anyway).
                drawLoopSeen: state.drawLoopSeen,
              }
            }
            return {
              ...state,
              history: [prev, ...state.history].slice(0, 200),
              level: nextLevel,
              status: 'inProgress',
              lastError: null,
              lastAction: null,
              drawLoopSeen: { ...state.drawLoopSeen, [key]: true },
            }
          }

          return {
            ...state,
            history: [prev, ...state.history].slice(0, 200),
            level: nextLevel,
            status: wonOrInProgress,
            lastError: null,
            lastAction: null,
            drawLoopSeen: {},
          }
        })
      },

      moveCard: (from, to) => {
        const { level, status } = get()
        if (!level || status !== 'inProgress') return

        const current = get()
        if (!current.level) return

        const prev: HistoryEntry = { level: current.level, status: current.status }
        const next = cloneLevel(current.level)
        const cardId = popFrom(next, from)
        if (!cardId) {
          set({ lastError: { message: 'Aucune carte à déplacer', at: Date.now() } })
          return
        }

        const now = Date.now()
        const res = pushTo(next, cardId, to, now)
        if (!res.ok) {
          // Revert pop if invalid push.
          pushBack(next, cardId, from)
          set({ lastError: { message: 'Déplacement invalide', cardId, at: Date.now() }, lastAction: null })
          return
        }

        const nextStatus = computeStatus(next)
        const nextAction = res.action
        const nextHistory = [prev, ...current.history].slice(0, 200)

        set({
          history: nextHistory,
          level: next,
          status: nextStatus,
          lastError: null,
          lastAction: nextAction,
          // Only slot progress breaks a draw loop (tableau moves shouldn't prevent a loss).
          drawLoopSeen: to.type === 'slot' ? {} : current.drawLoopSeen,
        })

        if (res.completedSlotIndex != null) {
          const slotIndex = res.completedSlotIndex
          const completedAt = res.completedAt ?? now
          scheduleFinalizeSlot(get, slotIndex, completedAt)
        }
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
            drawLoopSeen: {},
          }
        })
      },

      undo: () => {
        bumpGameEpoch()
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
            drawLoopSeen: {},
          }
        })
      },

      clearError: () => set({ lastError: null }),
    }),
    {
      name: 'solimots-game-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Persist only what's needed to resume the current game.
      partialize: (state) => ({
        level: state.level,
        status: state.status,
      }),
    },
  ),
)

function cloneLevel(level: LevelState): LevelState {
  return {
    ...level,
    requiredWordsByCategoryId: { ...level.requiredWordsByCategoryId },
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
    const column = level.tableau[to.column]
    if (!column) return { ok: false, action: null }

    const card = level.cardsById[cardId]
    if (!card) return { ok: false, action: null }

    const topId = column.at(-1)
    const top = topId ? level.cardsById[topId] : undefined

    // Empty tableau piles accept any card (category or word).
    if (!top) {
      column.push(cardId)
      return { ok: true, action: null }
    }

    // Any category card can be placed on a non-empty pile.
    if (card.kind === 'category') {
      column.push(cardId)
      return { ok: true, action: null }
    }

    // Word card: can be placed if the top card is a category or word of the same category.
    if (top.kind !== 'category' && top.kind !== 'word') return { ok: false, action: null }
    if (top.categoryId !== card.categoryId) return { ok: false, action: null }

    column.push(cardId)
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
      const required = level.requiredWordsByCategoryId[card.categoryId] ?? 0
      // If a category requires 0 words, it completes immediately (avoids confusing UX).
      if (required <= 0) {
        slot.isCompleting = true
        return {
          ok: true,
          action: { type: 'slotCompleted', slotIndex: to.slotIndex, categoryId: card.categoryId, at: now },
          completedSlotIndex: to.slotIndex,
          completedAt: now,
        }
      }
      return { ok: true, action: { type: 'slotPlaced', cardId, slotIndex: to.slotIndex, at: now } }
    }

    const categoryCard = level.cardsById[slot.categoryCardId]
    if (!categoryCard || categoryCard.kind !== 'category') return { ok: false, action: null }
    if (card.kind !== 'word') return { ok: false, action: null }
    if (card.categoryId !== categoryCard.categoryId) return { ok: false, action: null }

    const required = level.requiredWordsByCategoryId[categoryCard.categoryId] ?? 0
    // Keep store validation consistent with UI messaging:
    // when required <= 0, the category is effectively already complete, so placing words is invalid.
    if (slot.pile.length >= required) return { ok: false, action: null }

    slot.pile.push(cardId)

    if (required > 0 && slot.pile.length >= required) {
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

function hasAnySlotMove(level: LevelState): boolean {
  const sources: Array<{ from: MoveSource; cardId: CardId }> = []
  const wasteTop = level.waste.at(-1)
  if (wasteTop) sources.push({ from: { type: 'waste' }, cardId: wasteTop })

  level.tableau.forEach((col, idx) => {
    const top = col.at(-1)
    if (top) sources.push({ from: { type: 'tableau', column: idx }, cardId: top })
  })

  for (const src of sources) {
    for (let slotIndex = 0; slotIndex < level.slots.length; slotIndex++) {
      if (canPlaceOnSlot(level, src.cardId, slotIndex)) return true
    }
  }

  return false
}

function canPlaceOnSlot(level: LevelState, cardId: CardId, slotIndex: number): boolean {
  const slot = level.slots[slotIndex]
  if (!slot) return false
  if (slot.isCompleting) return false
  const card = level.cardsById[cardId]
  if (!card) return false

  if (slot.categoryCardId == null) return card.kind === 'category'

  const categoryCard = level.cardsById[slot.categoryCardId]
  if (!categoryCard || categoryCard.kind !== 'category') return false
  if (card.kind !== 'word') return false
  if (card.categoryId !== categoryCard.categoryId) return false

  const required = level.requiredWordsByCategoryId[categoryCard.categoryId] ?? 0
  return slot.pile.length < required
}

function computeDrawLoopKey(level: LevelState): string {
  const tableauTops = level.tableau.map((col) => col.at(-1) ?? '').join(',')
  const slotsKey = level.slots
    .map((s) => `${s.categoryCardId ?? ''}:${s.pile.length}:${s.isCompleting ? 1 : 0}`)
    .join(',')
  return `stock:${level.stock.join(',')}|waste:${level.waste.join(',')}|tops:${tableauTops}|slots:${slotsKey}`
}
