import { AnimatePresence, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { animate } from 'framer-motion'
import { useRef, useState } from 'react'
import type { Point } from 'framer-motion'
import type { CardId, Card as GameCard, LevelState } from '../../game/types'
import type { MoveSource, MoveTarget } from '../../store/gameStore'
import { Card } from '../cards/Card'
import { CardBack } from '../cards/CardBack'

type Selected = { source: MoveSource; cardIds: CardId[] } | null

function getClientPoint(event: MouseEvent | TouchEvent | PointerEvent, fallback: Point): Point {
  if ('clientX' in event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
    return { x: event.clientX, y: event.clientY }
  }
  if ('changedTouches' in event && event.changedTouches?.length) {
    const t = event.changedTouches[0]
    return { x: t.clientX, y: t.clientY }
  }
  return fallback
}

export type TableauCellProps = {
  level: LevelState
  columnIndex: number
  ids: CardId[]
  selected: Selected
  selectedCard: GameCard | null
  onSelectSource: (source: MoveSource, cardId: CardId) => void
  tryMoveTo: (target: MoveTarget) => void
  onDropCard: (
    from: MoveSource,
    draggedCardId: CardId,
    point: { x: number; y: number },
    draggedEl?: HTMLElement | null,
  ) => boolean
  errorCardId?: string
  errorAt?: number
}

// English comments per project rule.

// DraggableCardStack: A wrapper that makes a stack of cards draggable as a unit
type DraggableCardStackProps = {
  children: React.ReactNode
  onDrop: (point: Point, draggedEl: HTMLElement | null) => boolean
  reduceMotion: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
}

function DraggableCardStack({ children, onDrop, reduceMotion, onDragStart: onDragStartProp, onDragEnd: onDragEndProp }: DraggableCardStackProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const shakeBack = () => {
    if (reduceMotion) {
      x.set(0)
      y.set(0)
      return
    }
    const cx = x.get()
    const cy = y.get()
    x.stop()
    y.stop()
    const shakeDuration = 0.16
    const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

    const sx = animate(x, [cx, cx - 8, cx + 8, cx - 6, cx + 6, cx], { duration: shakeDuration, ease })
    const sy = animate(y, [cy, cy + 2, cy - 2, cy + 1, cy - 1, cy], { duration: shakeDuration, ease })

    void Promise.all([sx.finished, sy.finished]).then(() => {
      animate(x, 0, { type: 'spring', stiffness: 240, damping: 30 })
      animate(y, 0, { type: 'spring', stiffness: 240, damping: 30 })
    })
  }

  return (
    <motion.div
      ref={ref}
      className="relative pointer-events-auto"
      drag
      dragMomentum={true}
      dragElastic={0.15}
      onDragStart={() => {
        setIsDragging(true)
        onDragStartProp?.()
      }}
      whileDrag={reduceMotion ? { zIndex: 9999 } : { scale: 1.03, rotate: -0.6, zIndex: 9999 }}
      onDragEnd={(event, info) => {
        setIsDragging(false)
        onDragEndProp?.()
        const point = getClientPoint(event, info.point)
        const ok = onDrop(point, ref.current)
        if (ok) {
          x.stop()
          y.stop()
        } else {
          shakeBack()
        }
      }}
      style={{ x, y, zIndex: isDragging ? 9999 : undefined, cursor: 'grab', touchAction: 'none' }}
    >
      {children}
    </motion.div>
  )
}

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
  const visible = ids.slice(Math.max(0, ids.length - 10))
  const topId = ids.at(-1)
  const hint = Boolean(selectedCard)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

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
        'relative h-[calc(var(--cardH)+var(--stackStep)*9)] w-[var(--cardW)]',
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

            // For draggable cards, render as a stack with all cards above
            // For non-draggable cards (face-down), render individually
            if (isDraggable) {
              // Get all cards from this position to the end that should move together
              const cardsAbove = visible.slice(idx)
              
              // Hide this stack if a lower card is being dragged (to avoid duplicates)
              const shouldHide = draggingIndex !== null && idx > draggingIndex

              return (
                <div 
                  key={id} 
                  className="absolute left-0 right-0" 
                  style={{ 
                    top, 
                    zIndex: 100 + idx,
                    visibility: shouldHide ? 'hidden' : 'visible'
                  }}
                >
                  <DraggableCardStack
                    onDrop={(point, draggedEl) =>
                      onDropCard({ type: 'tableau', column: columnIndex }, id, { x: point.x, y: point.y }, draggedEl)
                    }
                    reduceMotion={reduceMotion ?? false}
                    onDragStart={() => setDraggingIndex(idx)}
                    onDragEnd={() => setDraggingIndex(null)}
                  >
                    {cardsAbove.map((stackId, stackIdx) => {
                      const stackCard = level.cardsById[stackId]
                      const stackTop = `calc(var(--stackStep) * ${stackIdx})`
                      // Only the first card (at this draggable position) should be interactive
                      const isInteractive = stackIdx === 0

                      return (
                        <div 
                          key={stackId} 
                          className="absolute left-0 right-0" 
                          style={{ 
                            top: stackTop,
                            pointerEvents: isInteractive ? 'auto' : 'none'
                          }}
                        >
                          {stackCard?.faceUp ? (
                            <Card
                              card={stackCard}
                              draggable={false}
                              onClick={() => onSelectSource({ type: 'tableau', column: columnIndex }, stackId)}
                              selected={selected?.cardIds.includes(stackId) ?? false}
                              feedback={errorCardId === stackId ? 'error' : undefined}
                              feedbackKey={errorCardId === stackId ? errorAt : undefined}
                              className="h-[var(--cardH)] w-[var(--cardW)]"
                            />
                          ) : (
                            <CardBack className="h-[var(--cardH)] w-[var(--cardW)]" />
                          )}
                        </div>
                      )
                    })}
                    {/* Reserve height for this stack */}
                    <div style={{ height: `calc(var(--cardH) + var(--stackStep) * ${cardsAbove.length - 1})` }} />
                  </DraggableCardStack>
                </div>
              )
            } else {
              // Render non-draggable card individually (face-down or can't be dragged)
              return (
                <div key={id} className="absolute left-0 right-0" style={{ top, zIndex: idx + 1 }}>
                  {card?.faceUp ? (
                    <Card
                      card={card}
                      draggable={false}
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
            }
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
