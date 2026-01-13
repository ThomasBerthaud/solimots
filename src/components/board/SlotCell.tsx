import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Crown } from 'lucide-react'
import type { CardId, Card as GameCard, LevelState, SlotState } from '../../game/types'
import type { MoveSource, MoveTarget } from '../../store/gameStore'
import { Card } from '../cards/Card'

type Selected = { source: MoveSource; cardIds: CardId[] } | null

export type SlotCellProps = {
  level: LevelState
  slotIndex: number
  slot: SlotState
  selected: Selected
  selectedCard: GameCard | null
  tryMoveTo: (target: MoveTarget) => void
  placedAt?: number
  completedAt?: number
}

// English comments per project rule.
export function SlotCell({
  level,
  slotIndex,
  slot,
  selected,
  selectedCard,
  tryMoveTo,
  placedAt,
  completedAt,
}: SlotCellProps) {
  const reduceMotion = useReducedMotion()
  const categoryCard = slot.categoryCardId ? level.cardsById[slot.categoryCardId] : undefined
  const topWordId = slot.pile.at(-1)
  const topWordCard = topWordId ? level.cardsById[topWordId] : undefined

  const isLocked = Boolean(slot.isCompleting)
  const count = slot.pile.length
  const required = categoryCard ? (level.requiredWordsByCategoryId[categoryCard.categoryId] ?? 0) : 0
  const progress = categoryCard ? `${count}/${required}` : ''

  const hint =
    selectedCard && !isLocked
      ? selectedCard.kind === 'category'
        ? slot.categoryCardId == null
        : slot.categoryCardId != null &&
          (() => {
            const c = level.cardsById[slot.categoryCardId]
            return c?.kind === 'category' && c.categoryId === selectedCard.categoryId && slot.pile.length < required
          })()
      : false

  return (
    <motion.div
      data-drop-target="slot"
      data-slot-index={slotIndex}
      data-tap-target="true"
      className={['relative', hint ? 'rounded-[18px] ring-2 ring-emerald-300/60' : ''].join(' ')}
      onClick={() => {
        // Slot is a destination target.
        tryMoveTo({ type: 'slot', slotIndex })
      }}
      whileHover={reduceMotion || !hint ? undefined : { scale: 1.01 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      animate={
        completedAt
          ? reduceMotion
            ? { opacity: [1, 1, 1] }
            : { boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 0 8px rgba(251,191,36,0.18)', '0 0 0 rgba(0,0,0,0)'] }
          : placedAt
            ? reduceMotion
              ? { opacity: [1, 1, 1] }
              : { boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 0 6px rgba(251,191,36,0.14)', '0 0 0 rgba(0,0,0,0)'] }
            : undefined
      }
      transition={placedAt || completedAt ? { duration: 0.5, ease: 'easeOut' } : undefined}
    >
      {/* Category label tab (always visible once category is placed) */}
      <AnimatePresence>
        {categoryCard ? (
          <motion.div
            key={`slot-cat-${slotIndex}-${categoryCard.id}`}
            className="pointer-events-none absolute -top-2 inset-x-0 z-10 flex justify-center"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div
              className="w-[calc(var(--cardW)-12px)] whitespace-normal break-words rounded-2xl border border-amber-200/60 bg-amber-300 px-3 py-1 text-center text-[10px] font-extrabold leading-snug tracking-wide text-amber-950 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
              aria-label={`Catégorie: ${categoryCard.word}`}
            >
              {categoryCard.word}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative h-[var(--cardH)] w-[var(--cardW)]">
        {/* Empty */}
        {!categoryCard ? (
          <div className="h-full w-full rounded-[18px] border border-white/10 bg-black/20 shadow-[0_12px_26px_rgba(0,0,0,0.18)]">
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(0,0,0,0.10))]">
              <Crown size={18} className="text-white/35" aria-hidden="true" />
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Slot</div>
            </div>
          </div>
        ) : (
          <div
            className={['relative h-full w-full overflow-hidden rounded-[18px]', isLocked ? 'opacity-85' : ''].join(
              ' ',
            )}
          >
            {/* Category card is always visible as the base layer */}
            <div className="absolute inset-0">
              <Card
                card={categoryCard}
                draggable={false}
                selected={selected?.cardIds.includes(categoryCard.id) ?? false}
                className="h-full w-full"
              />
            </div>

            {/* Word on top (only last word visible) */}
            <AnimatePresence mode="popLayout">
              {topWordCard ? (
                <motion.div
                  key={topWordCard.id}
                  className="absolute inset-0 flex items-center justify-center p-2"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: -8 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <Card
                    card={topWordCard}
                    draggable={false}
                    selected={selected?.cardIds.includes(topWordCard.id) ?? false}
                    className="h-[calc(var(--cardH)-16px)] w-[calc(var(--cardW)-16px)]"
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Progress badge - centered at bottom */}
            <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-2 py-1 text-[10px] font-bold text-white/85">
              {progress}
            </div>

            {/* Completion burst */}
            <AnimatePresence>
              {slot.isCompleting ? (
                <motion.div
                  key={`burst-${slotIndex}`}
                  className="pointer-events-none absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={reduceMotion ? { opacity: 0.6 } : { opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Burst />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Burst() {
  // Simple particle burst using divs (no new dependencies).
  const particles = Array.from({ length: 6 }, (_, i) => i)
  return (
    <div className="relative h-full w-full">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-amber-300/90"
          initial={{ x: -5, y: -5, scale: 0.6, opacity: 0 }}
          animate={{
            x: -5 + Math.cos((i / particles.length) * Math.PI * 2) * 36,
            y: -5 + Math.sin((i / particles.length) * Math.PI * 2) * 36,
            scale: [0.6, 1, 0.2],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
