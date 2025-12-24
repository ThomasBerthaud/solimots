import type { Point } from 'framer-motion'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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
  onDrop?: (point: Point, draggedEl: HTMLElement | null) => void
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
  const reduceMotion = useReducedMotion() ?? false
  const controls = useAnimationControls()
  const ref = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const isCategory = card.kind === 'category'

  useEffect(() => {
    const transition = { duration: 0.28, ease: 'easeOut' as const }

    if (feedback === 'error') {
      controls.start(
        reduceMotion ? { opacity: [1, 0.85, 1], transition } : { x: [0, -8, 8, -6, 6, -3, 3, 0], transition },
      )
      return
    }

    if (feedback === 'success') {
      controls.start(reduceMotion ? { opacity: 1 } : { y: [0, -2, 0], transition })
      return
    }

    if (selected) {
      controls.start(
        reduceMotion
          ? { y: -2, transition }
          : { y: -3, rotate: isCategory ? -0.4 : 0.25, transition },
      )
      return
    }

    controls.start({ x: 0, y: 0, rotate: 0 })
  }, [controls, feedback, feedbackKey, isCategory, reduceMotion, selected])

  const dragZIndex = 40

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
      dragSnapToOrigin
      whileTap={draggable || onClick ? { scale: 0.98 } : undefined}
      onDragStart={() => setIsDragging(true)}
      whileDrag={reduceMotion ? { zIndex: dragZIndex } : { scale: 1.03, rotate: -0.6, zIndex: dragZIndex }}
      onDragEnd={(event, info) => {
        setIsDragging(false)
        const point = getClientPoint(event, info.point)
        onDrop?.(point, ref.current)
      }}
      initial={false}
      animate={controls}
      className={[
        'relative select-none rounded-[18px] border shadow-[0_14px_34px_rgba(0,0,0,0.22)]',
        isCategory
          ? 'border-amber-200/60 bg-[linear-gradient(135deg,rgba(253,230,138,0.92),rgba(251,191,36,0.80))] text-amber-950'
          : 'border-black/5 bg-white text-slate-900',
        selected ? (isCategory ? 'ring-2 ring-amber-200/90' : 'ring-2 ring-white/80') : '',
        draggable ? 'cursor-grab active:cursor-grabbing' : '',
        className ?? '',
      ].join(' ')}
      style={{ ...style, zIndex: isDragging ? dragZIndex : style?.zIndex }}
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
          <span
            lang="fr"
            className="whitespace-normal break-words text-center font-extrabold leading-snug tracking-tight [font-size:clamp(9px,3.2vw,13px)] [hyphens:auto]"
          >
            {card.word}
          </span>
        </div>

        <div className="mt-2 flex items-end text-[9px] font-semibold text-black/40">
          <span className="truncate">{isCategory ? 'Catégorie' : 'Mot'}</span>
        </div>
      </div>
    </motion.div>
  )
}
