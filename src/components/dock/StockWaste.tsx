import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { CardId, LevelState } from '../../game/types'
import type { MoveSource } from '../../store/gameStore'
import { Card } from '../cards/Card'
import { CardBack } from '../cards/CardBack'

type Selected = { source: MoveSource; cardIds: CardId[] } | null

export type StockWasteProps = {
  level: LevelState
  selected: Selected
  onSelectSource: (source: MoveSource, cardId: CardId) => void
  onDraw: () => void
  onDropCard: (from: MoveSource, point: { x: number; y: number }, draggedEl?: HTMLElement | null) => boolean
  errorCardId?: string
  errorAt?: number
}

// English comments per project rule.
export function StockWaste({
  level,
  selected,
  onSelectSource,
  onDraw,
  onDropCard,
  errorCardId,
  errorAt,
}: StockWasteProps) {
  const reduceMotion = useReducedMotion() ?? false
  const topWasteId = level.waste.at(-1)
  const topWasteCard = topWasteId ? level.cardsById[topWasteId] : undefined
  const wasteId = topWasteCard?.id
  const isStockEmpty = level.stock.length === 0
  const isWasteEmpty = level.waste.length === 0
  const canRecycle = isStockEmpty && !isWasteEmpty
  const isDeckEmpty = isStockEmpty && isWasteEmpty

  return (
    <div className="flex items-center gap-3">
      {/* Waste */}
      <div className="relative">
        <AnimatePresence mode="popLayout">
          {topWasteCard ? (
            <motion.div
              key={wasteId}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 18, y: -6, rotate: 0.8, scale: 0.98 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -10, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Card
                card={topWasteCard}
                draggable
                onDrop={(point, draggedEl) => onDropCard({ type: 'waste' }, { x: point.x, y: point.y }, draggedEl)}
                onClick={() => onSelectSource({ type: 'waste' }, topWasteCard.id)}
                selected={selected?.cardIds.length === 1 && selected.cardIds[0] === topWasteCard.id}
                feedback={errorCardId === topWasteCard.id ? 'error' : undefined}
                feedbackKey={errorCardId === topWasteCard.id ? errorAt : undefined}
                className="h-[var(--dockCardH)] w-[var(--dockCardW)]"
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty-waste"
              className="h-[var(--dockCardH)] w-[var(--dockCardW)] rounded-[16px] border border-dashed border-white/15 bg-black/15"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
        <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-2 py-1 text-[10px] font-bold text-white/75">
          {level.waste.length}
        </div>
      </div>

      {/* Stock */}
      <button
        type="button"
        data-ui-control="true"
        onClick={onDraw}
        disabled={isDeckEmpty}
        className={['relative rounded-[16px] active:scale-[0.99]', isDeckEmpty ? 'opacity-60' : ''].join(' ')}
        aria-label={canRecycle ? 'Recycler la défausse' : isDeckEmpty ? 'Pioche vide' : 'Stock'}
        title={canRecycle ? 'Recycler' : isDeckEmpty ? 'Pioche vide' : 'Stock'}
      >
        <motion.div
          key={level.stock.length}
          initial={reduceMotion ? { opacity: 1 } : { rotate: -1.2, scale: 0.995 }}
          animate={reduceMotion ? { opacity: 1 } : { rotate: 0, scale: 1 }}
          transition={reduceMotion ? undefined : { duration: 0.22, ease: 'easeOut' }}
        >
          <CardBack className="h-[var(--dockCardH)] w-[var(--dockCardW)]" />
        </motion.div>

        {/* Make stock state explicit when empty. */}
        {canRecycle ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/45 px-3 py-2 text-xs font-extrabold tracking-wide text-white/90">
              ↻ Recycler
            </div>
          </div>
        ) : isDeckEmpty ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/45 px-3 py-2 text-xs font-extrabold tracking-wide text-white/90">
              ∅ Vide
            </div>
          </div>
        ) : null}
        <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-2 py-1 text-[10px] font-bold text-white/75">
          {level.stock.length}
        </div>
      </button>
    </div>
  )
}
