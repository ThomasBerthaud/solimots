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
  const isCategory = card.kind === 'category'
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
        'select-none rounded-2xl px-3 py-3 text-sm font-semibold shadow',
        isCategory
          ? 'bg-amber-100 text-amber-950 ring-1 ring-amber-200'
          : 'bg-white text-slate-900 ring-1 ring-black/5',
        draggable ? 'cursor-grab active:cursor-grabbing' : '',
        className ?? '',
      ].join(' ')}
      role="button"
      aria-label={`Carte: ${card.word}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate">{card.word}</span>
        <span
          className={[
            'shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ring-1',
            isCategory ? 'bg-amber-200 text-amber-900 ring-amber-300' : 'bg-slate-100 text-slate-700 ring-slate-200',
          ].join(' ')}
        >
          <span className="align-middle">{isCategory ? 'CAT' : 'MOT'}</span>
        </span>
      </div>
    </motion.div>
  )
}
