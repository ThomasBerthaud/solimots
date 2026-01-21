import type { Point } from 'framer-motion'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { Card as GameCard } from '../../game/types'

export type CardProps = {
  card: GameCard
  className?: string
  style?: React.CSSProperties
  selected?: boolean
  feedback?: 'error' | 'success'
  feedbackKey?: number
  draggable?: boolean
  onClick?: () => void
  onDrop?: (point: Point, draggedEl: HTMLElement | null) => boolean
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
export function Card({
  card,
  className,
  style,
  selected = false,
  feedback,
  feedbackKey,
  draggable = false,
  onClick,
  onDrop,
}: CardProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const isCategory = card.kind === 'category'
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
    // Shake while returning to origin. Keep x/y durations aligned to avoid "L-shaped" motion.
    x.stop()
    y.stop()
    const shakeDuration = 0.16
    const ease: [number, number, number, number] = [0.16, 1, 0.3, 1] // easeOut-like

    // Quick shake around the current position...
    const sx = animate(x, [cx, cx - 8, cx + 8, cx - 6, cx + 6, cx], { duration: shakeDuration, ease })
    const sy = animate(y, [cy, cy + 2, cy - 2, cy + 1, cy - 1, cy], { duration: shakeDuration, ease })

    // ...then a slower spring return to origin.
    void Promise.all([sx.finished, sy.finished]).then(() => {
      animate(x, 0, { type: 'spring', stiffness: 240, damping: 30 })
      animate(y, 0, { type: 'spring', stiffness: 240, damping: 30 })
    })
  }

  return (
    <motion.div
      ref={ref}
      data-card-interactive={draggable || onClick ? 'true' : 'false'}
      role="button"
      tabIndex={0}
      aria-label={`Carte: ${card.word}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.15}
      whileTap={draggable || onClick ? { scale: 0.98 } : undefined}
      onDragStart={() => setIsDragging(true)}
      whileDrag={reduceMotion ? { zIndex: 9999 } : { scale: 1.03, rotate: -0.6, zIndex: 9999 }}
      onDragEnd={(event, info) => {
        setIsDragging(false)
        const point = getClientPoint(event, info.point)
        const ok = onDrop ? onDrop(point, ref.current) : false
        if (ok) {
          // On valid drops, let the state update move/unmount the card.
          // Do not snap back or force-reset x/y here, otherwise it can create visual glitches.
          x.stop()
          y.stop()
        } else {
          shakeBack()
        }
      }}
      className={[
        'relative select-none rounded-[18px] border shadow-[0_14px_34px_rgba(0,0,0,0.22)]',
        isCategory
          ? 'border-amber-200/60 bg-[linear-gradient(135deg,rgba(253,230,138,0.92),rgba(251,191,36,0.80))] text-amber-950'
          : 'border-black/5 bg-white text-slate-900',
        selected ? (isCategory ? 'ring-2 ring-amber-200/90' : 'ring-2 ring-white/80') : '',
        draggable ? 'cursor-grab active:cursor-grabbing' : '',
        className ?? '',
      ].join(' ')}
      style={{ ...style, zIndex: isDragging ? 9999 : style?.zIndex, x, y }}
    >
      <motion.div
        key={`${card.id}-${feedbackKey ?? 0}`}
        className="relative h-full w-full"
        animate={
          feedback === 'error'
            ? reduceMotion
              ? { opacity: [1, 0.85, 1] }
              : { x: [0, -8, 8, -6, 6, -3, 3, 0] }
            : feedback === 'success'
              ? reduceMotion
                ? { opacity: [1, 1, 1] }
                : { y: [0, -2, 0] }
              : selected
                ? reduceMotion
                  ? { y: -2 }
                  : { y: -3, rotate: isCategory ? -0.4 : 0.25 }
                : { x: 0, y: 0, rotate: 0 }
        }
        transition={feedback || selected ? { duration: 0.28, ease: 'easeOut' } : undefined}
      >
        {/* Subtle “foil” sheen for category cards */}
        {isCategory ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]">
            <div className="absolute -left-12 -top-14 h-24 w-44 rotate-12 bg-white/30 blur-[0.5px]" />
            <div className="absolute -right-20 top-10 h-40 w-40 rounded-full bg-white/18 blur-2xl" />
          </div>
        ) : null}

        <div className="relative flex h-full w-full flex-col justify-between p-3">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            {card.imageUrl ? (
              <span className="text-center text-[clamp(24px,8vw,40px)]" role="img" aria-label={card.word}>
                {card.imageUrl}
              </span>
            ) : (
              <span
                lang="fr"
                className="whitespace-normal break-words text-center font-extrabold leading-snug tracking-tight [font-size:clamp(10px,3.5vw,14px)] [hyphens:auto]"
              >
                {card.word}
              </span>
            )}
          </div>

          {!card.imageUrl && (
            <div className="mt-2 flex items-end text-[10px] font-semibold text-black/40">
              <span className="truncate">{isCategory ? 'Catégorie' : 'Mot'}</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
