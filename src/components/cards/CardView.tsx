import type { Point } from 'framer-motion'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import type { Card } from '../../game/types'

export type CardViewProps = {
  card: Card
  draggable?: boolean
  onDrop?: (point: Point, draggedEl: HTMLElement | null) => void
  feedback?: 'error' | 'success'
  feedbackKey?: number
  className?: string
}

function getClientPoint(event: MouseEvent | TouchEvent | PointerEvent, fallback: Point): Point {
  // Prefer viewport/client coordinates for document.elementFromPoint().
  if ('clientX' in event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
    return { x: event.clientX, y: event.clientY }
  }

  if ('changedTouches' in event && event.changedTouches?.length) {
    const t = event.changedTouches[0]
    return { x: t.clientX, y: t.clientY }
  }

  return fallback
}

// English comments per project rule.
export function CardView({ card, draggable = false, onDrop, feedback, feedbackKey, className }: CardViewProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <motion.div
      ref={ref}
      key={`${card.id}-${feedbackKey ?? 0}`}
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.15}
      dragSnapToOrigin
      whileHover={draggable ? { y: -1 } : undefined}
      whileTap={draggable ? { scale: 0.98 } : undefined}
      whileDrag={{ scale: 1.03, rotate: -0.5 }}
      onDragEnd={(event, info) => {
        const point = getClientPoint(event, info.point)
        onDrop?.(point, ref.current)
      }}
      animate={
        feedback === 'error'
          ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
          : feedback === 'success'
            ? { y: [0, -2, 0] }
            : { x: 0, y: 0 }
      }
      transition={feedback ? { duration: 0.35, ease: 'easeOut' } : undefined}
      className={[
        'select-none rounded-2xl bg-white px-3 py-3 text-sm font-semibold text-slate-900 shadow',
        'ring-1 ring-black/5',
        draggable ? 'cursor-grab active:cursor-grabbing' : '',
        className ?? '',
      ].join(' ')}
      role="button"
      aria-label={`Carte: ${card.word}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate">{card.word}</span>
        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 ring-1 ring-amber-200">
          <span className="mr-1 align-middle text-[9px] text-amber-700">◇</span>
          <span className="align-middle">?</span>
        </span>
      </div>
    </motion.div>
  )
}
