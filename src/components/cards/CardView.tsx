import { motion } from 'framer-motion'
import type { Point } from 'framer-motion'
import type { Card } from '../../game/types'

export type CardViewProps = {
  card: Card
  draggable?: boolean
  onDrop?: (point: Point) => void
  feedback?: 'error' | 'success'
  feedbackKey?: number
  className?: string
}

// English comments per project rule.
export function CardView({
  card,
  draggable = false,
  onDrop,
  feedback,
  feedbackKey,
  className,
}: CardViewProps) {
  return (
    <motion.div
      key={`${card.id}-${feedbackKey ?? 0}`}
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.15}
      dragSnapToOrigin
      whileHover={draggable ? { y: -1 } : undefined}
      whileTap={draggable ? { scale: 0.98 } : undefined}
      whileDrag={{ scale: 1.03, rotate: -0.5 }}
      onDragEnd={(_, info) => onDrop?.(info.point)}
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
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
          ?
        </span>
      </div>
    </motion.div>
  )
}


