import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { CardId, Card as GameCard, LevelState } from '../../game/types'
import type { MoveSource, MoveTarget } from '../../store/gameStore'
import { Card } from '../cards/Card'
import { CardBack } from '../cards/CardBack'

type Selected = { source: MoveSource; cardIds: CardId[] } | null

export type TableauCellProps = {
  level: LevelState
  columnIndex: number
  ids: CardId[]
  selected: Selected
  selectedCard: GameCard | null
  onSelectSource: (source: MoveSource, cardId: CardId) => void
  tryMoveTo: (target: MoveTarget) => void
  onDropCard: (from: MoveSource, point: { x: number; y: number }, draggedEl?: HTMLElement | null) => boolean
  errorCardId?: string
  errorAt?: number
}

// English comments per project rule.
export function TableauCell({
  level,
  columnIndex,
  ids,
  selected,
  selectedCard,
  onSelectSource,
  tryMoveTo,
  onDropCard,
  errorCardId,
  errorAt,
}: TableauCellProps) {
  const reduceMotion = useReducedMotion()
  const visible = ids.slice(Math.max(0, ids.length - 7))
  const topId = ids.at(-1)
  const hint = Boolean(selectedCard)

  // Helper to check if a card can be dragged (all cards from this one to the end must be face-up)
  const canDragCard = (cardId: CardId): boolean => {
    const colIdx = ids.indexOf(cardId)
    if (colIdx < 0) return false
    const segment = ids.slice(colIdx)
    return segment.every((id) => level.cardsById[id]?.faceUp)
  }

  return (
    <div
      data-drop-target="tableau"
      data-column-index={columnIndex}
      data-tap-target="true"
      className={[
        'relative h-[calc(var(--cardH)+var(--stackStep)*6)] w-[var(--cardW)]',
        hint ? 'rounded-[18px] ring-1 ring-white/15' : '',
      ].join(' ')}
      onClick={() => {
        // Tableau column is a destination target.
        tryMoveTo({ type: 'tableau', column: columnIndex })
      }}
    >
      <div className="relative">
        {visible.length ? (
          visible.map((id, idx) => {
            const card = level.cardsById[id]
            const top = `calc(var(--stackStep) * ${idx})`
            const isDraggable = card?.faceUp && canDragCard(id)
            return (
              <div key={id} className="absolute left-0 right-0" style={{ top, zIndex: idx }}>
                {card?.faceUp ? (
                  <Card
                    card={card}
                    draggable={isDraggable}
                    onDrop={
                      isDraggable
                        ? (point, draggedEl) =>
                            onDropCard({ type: 'tableau', column: columnIndex }, { x: point.x, y: point.y }, draggedEl)
                        : undefined
                    }
                    onClick={() => onSelectSource({ type: 'tableau', column: columnIndex }, id)}
                    selected={selected?.cardIds.includes(id) ?? false}
                    feedback={errorCardId === id ? 'error' : undefined}
                    feedbackKey={errorCardId === id ? errorAt : undefined}
                    className="h-[var(--cardH)] w-[var(--cardW)]"
                  />
                ) : (
                  <CardBack className="h-[var(--cardH)] w-[var(--cardW)]" />
                )}
              </div>
            )
          })
        ) : (
          <div className="h-[var(--cardH)] w-[var(--cardW)] rounded-[18px] border border-dashed border-white/15 bg-black/10" />
        )}
        {/* Reserve height for stack */}
        <div style={{ height: `calc(var(--cardH) + var(--stackStep) * ${Math.max(1, visible.length) - 1})` }} />
      </div>

      {/* Extra count indicator (subtle) */}
      {ids.length > visible.length ? (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-2 py-1 text-[10px] font-bold text-white/75">
          +{ids.length - visible.length}
        </div>
      ) : null}

      {/* Reveal accent when top changes (simple) */}
      <AnimatePresence>
        {reduceMotion ? null : topId ? (
          <motion.div
            key={`reveal-${columnIndex}-${topId}`}
            className="pointer-events-none absolute inset-0 rounded-[18px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
