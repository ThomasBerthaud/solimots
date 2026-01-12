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
  moveCard: (from: MoveSource, to: MoveTarget) => boolean
  moveCards: (from: MoveSource, to: MoveTarget, cardIds: CardId[]) => boolean
  finalizeSlotCompletion: (slotIndex: number, completedAt: number) => void
  undo: () => void
  clearError: () => void
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

          const nextLevel = cloneLevel(state.level)

          if (nextLevel.stock.length === 0) {
            // Recycle waste back into stock (solitaire-like, face-down).
            const recycled = nextLevel.waste.slice().reverse()
            nextLevel.stock.push(...recycled)
            nextLevel.waste.length = 0
            for (const id of recycled) {
              const c = nextLevel.cardsById[id]
              if (c) c.faceUp = false
            }
          } else {
            const cardId = nextLevel.stock.pop()
            if (cardId) {
              nextLevel.waste.push(cardId)
              const c = nextLevel.cardsById[cardId]
              if (c) c.faceUp = true
            }
          }

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
        if (!level || status !== 'inProgress') return false

        let ok = false
        set((state) => {
          if (!state.level) return state
          const prev: HistoryEntry = { level: state.level, status: state.status }

          const next = cloneLevel(state.level)
          const cardId = popFrom(next, from)
          if (!cardId) {
            ok = false
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
            ok = false
            return {
              ...state,
              lastError: { message: 'Déplacement invalide', cardId, at: Date.now() },
              lastAction: null,
            }
          }

          // Any moved card becomes revealed.
          const moved = next.cardsById[cardId]
          if (moved) moved.faceUp = true
          // Reveal the new tableau top after removing a card/stack.
          revealTopAfterMove(next, from)

          const nextStatus = computeStatus(next)
          const nextAction = res.action
          ok = true

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
            // Only slot progress breaks a draw loop (tableau moves shouldn't prevent a loss).
            drawLoopSeen: to.type === 'slot' ? {} : state.drawLoopSeen,
          }
        })
        return ok
      },

      moveCards: (from, to, cardIds) => {
        const { level, status } = get()
        if (!level || status !== 'inProgress') return false
        if (!cardIds.length) return false

        let ok = false
        set((state) => {
          if (!state.level) return state
          const prev: HistoryEntry = { level: state.level, status: state.status }
          const next = cloneLevel(state.level)

          const now = Date.now()

          // Validate and remove the segment from the source.
          if (from.type === 'waste') {
            const top = next.waste.at(-1)
            if (cardIds.length !== 1 || !top || top !== cardIds[0]) {
              ok = false
              return { ...state, lastError: { message: 'Déplacement invalide', at: now }, lastAction: null }
            }
            next.waste.pop()
          } else if (from.type === 'tableau') {
            const col = next.tableau[from.column]
            if (!col) {
              ok = false
              return { ...state, lastError: { message: 'Déplacement invalide', at: now }, lastAction: null }
            }
            const tail = col.slice(-cardIds.length)
            if (tail.length !== cardIds.length || tail.some((id, i) => id !== cardIds[i])) {
              ok = false
              return { ...state, lastError: { message: 'Déplacement invalide', at: now }, lastAction: null }
            }
            for (const id of cardIds) {
              const c = next.cardsById[id]
              if (!c?.faceUp) {
                ok = false
                return { ...state, lastError: { message: 'Déplacement invalide', at: now }, lastAction: null }
              }
            }
            // Remove cards
            col.splice(col.length - cardIds.length, cardIds.length)
          }

          // Apply move to destination.
          let action: LastAction = null
          let completedSlotIndex: number | undefined
          let completedAt: number | undefined

          if (to.type === 'tableau') {
            const dest = next.tableau[to.column]
            if (!dest) {
              // Revert source removal.
              pushBackMany(next, cardIds, from)
              ok = false
              return { ...state, lastError: { message: 'Déplacement invalide', at: now }, lastAction: null }
            }
            const bottomId = cardIds[0]
            if (!canPlaceOnTableau(next, bottomId, dest.at(-1) ?? null)) {
              pushBackMany(next, cardIds, from)
              ok = false
              return {
                ...state,
                lastError: { message: 'Déplacement invalide', cardId: bottomId, at: now },
                lastAction: null,
              }
            }
            dest.push(...cardIds)
            for (const id of cardIds) {
              const c = next.cardsById[id]
              if (c) c.faceUp = true
            }
          } else if (to.type === 'slot') {
            const slot = next.slots[to.slotIndex]
            if (!slot || slot.isCompleting) {
              pushBackMany(next, cardIds, from)
              ok = false
              return { ...state, lastError: { message: 'Déplacement invalide', at: now }, lastAction: null }
            }

            // Case A: placing a category onto an empty slot.
            if (slot.categoryCardId == null) {
              if (cardIds.length !== 1) {
                pushBackMany(next, cardIds, from)
                ok = false
                return { ...state, lastError: { message: 'Déplacement invalide', at: now }, lastAction: null }
              }
              const card = next.cardsById[cardIds[0]]
              if (!card || card.kind !== 'category') {
                pushBackMany(next, cardIds, from)
                ok = false
                return {
                  ...state,
                  lastError: { message: 'Déplacement invalide', cardId: cardIds[0], at: now },
                  lastAction: null,
                }
              }
              slot.categoryCardId = cardIds[0]
              slot.pile = []
              card.faceUp = true
              const required = next.requiredWordsByCategoryId[card.categoryId] ?? 0
              if (required <= 0) {
                slot.isCompleting = true
                action = { type: 'slotCompleted', slotIndex: to.slotIndex, categoryId: card.categoryId, at: now }
                completedSlotIndex = to.slotIndex
                completedAt = now
              } else {
                action = { type: 'slotPlaced', cardId: cardIds[0], slotIndex: to.slotIndex, at: now }
              }
            } else {
              // Case B: placing words onto an existing category slot.
              const categoryCard = next.cardsById[slot.categoryCardId]
              if (!categoryCard || categoryCard.kind !== 'category') {
                pushBackMany(next, cardIds, from)
                ok = false
                return { ...state, lastError: { message: 'Déplacement invalide', at: now }, lastAction: null }
              }
              const required = next.requiredWordsByCategoryId[categoryCard.categoryId] ?? 0
              if (required <= 0) {
                pushBackMany(next, cardIds, from)
                ok = false
                return { ...state, lastError: { message: 'Déplacement invalide', at: now }, lastAction: null }
              }
              if (slot.pile.length + cardIds.length > required) {
                pushBackMany(next, cardIds, from)
                ok = false
                return { ...state, lastError: { message: 'Déplacement invalide', at: now }, lastAction: null }
              }
              for (const id of cardIds) {
                const c = next.cardsById[id]
                if (!c || c.kind !== 'word' || c.categoryId !== categoryCard.categoryId) {
                  pushBackMany(next, cardIds, from)
                  ok = false
                  return {
                    ...state,
                    lastError: { message: 'Déplacement invalide', cardId: id, at: now },
                    lastAction: null,
                  }
                }
              }
              slot.pile.push(...cardIds)
              for (const id of cardIds) {
                const c = next.cardsById[id]
                if (c) c.faceUp = true
              }
              if (slot.pile.length >= required) {
                slot.isCompleting = true
                action = {
                  type: 'slotCompleted',
                  slotIndex: to.slotIndex,
                  categoryId: categoryCard.categoryId,
                  at: now,
                }
                completedSlotIndex = to.slotIndex
                completedAt = now
              }
            }
          }

          // Reveal the new tableau top after removing a card/stack.
          revealTopAfterMove(next, from)

          const nextStatus = computeStatus(next)
          ok = true

          if (completedSlotIndex != null) {
            const slotIndex = completedSlotIndex
            const when = completedAt ?? now
            window.setTimeout(() => {
              get().finalizeSlotCompletion(slotIndex, when)
            }, 380)
          }

          return {
            ...state,
            history: [prev, ...state.history].slice(0, 200),
            level: next,
            status: nextStatus,
            lastError: null,
            lastAction: action,
            drawLoopSeen: to.type === 'slot' ? {} : state.drawLoopSeen,
          }
        })

        return ok
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
    cardsById: Object.fromEntries(Object.entries(level.cardsById).map(([id, c]) => [id, { ...c }])),
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

function pushBackMany(level: LevelState, cardIds: CardId[], from: MoveSource): void {
  // Restore order exactly as it was (cardIds are ordered from bottom->top in our selection).
  if (from.type === 'waste') {
    for (const id of cardIds) level.waste.push(id)
    return
  }
  if (from.type === 'tableau') {
    const col = level.tableau[from.column]
    if (!col) return
    col.push(...cardIds)
  }
}

function revealTopAfterMove(level: LevelState, from: MoveSource): void {
  if (from.type !== 'tableau') return
  const col = level.tableau[from.column]
  const topId = col?.at(-1)
  if (!topId) return
  const top = level.cardsById[topId]
  if (top) top.faceUp = true
}

function canPlaceOnTableau(level: LevelState, movingId: CardId, destTopId: CardId | null): boolean {
  const card = level.cardsById[movingId]
  if (!card) return false

  // Empty tableau piles accept any card.
  if (!destTopId) return true
  const top = level.cardsById[destTopId]
  if (!top) return false

  // Category card: can be placed only on a word of the same category (rule update).
  if (card.kind === 'category') {
    return top.kind === 'word' && top.categoryId === card.categoryId
  }

  // Word card: can be placed if the top card is a category or word of the same category.
  if (top.kind !== 'category' && top.kind !== 'word') return false
  return top.categoryId === card.categoryId
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

    const topId = column.at(-1)
    if (!canPlaceOnTableau(level, cardId, topId ?? null)) return { ok: false, action: null }

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
