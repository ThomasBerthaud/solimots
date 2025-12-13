import { AnimatePresence, motion } from 'framer-motion'
import type { LevelState, SlotState } from '../../game/types'
import { CardView } from '../cards/CardView'

export type FoundationPileProps = {
  level: LevelState
  slotIndex: number
  slot: SlotState
  placedAt?: number
  completedAt?: number
}

// English comments per project rule.
export function FoundationPile({ level, slotIndex, slot, placedAt, completedAt }: FoundationPileProps) {
  const categoryCard = slot.categoryCardId ? level.cardsById[slot.categoryCardId] : undefined
  const topWordId = slot.pile.at(-1)
  const topWordCard = topWordId ? level.cardsById[topWordId] : undefined
  const isLocked = Boolean(slot.isCompleting)
  const count = slot.pile.length

  return (
    <motion.div
      data-drop-target="slot"
      data-slot-index={slotIndex}
      className={[
        'rounded-2xl border border-white/10 bg-black/20 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)]',
        isLocked ? 'opacity-80' : '',
      ].join(' ')}
      animate={
        completedAt
          ? {
              scale: [1, 1.02, 0.98, 1],
              opacity: [1, 1, 1, 1],
              boxShadow: [
                '0 10px 30px rgba(0,0,0,0.25)',
                '0 14px 46px rgba(251,191,36,0.28)',
                '0 10px 30px rgba(0,0,0,0.25)',
              ],
            }
          : placedAt
            ? {
                boxShadow: [
                  '0 10px 30px rgba(0,0,0,0.25)',
                  '0 10px 40px rgba(251,191,36,0.25)',
                  '0 10px 30px rgba(0,0,0,0.25)',
                ],
              }
            : undefined
      }
      transition={placedAt || completedAt ? { duration: 0.5, ease: 'easeOut' } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Slot {slotIndex + 1}</p>
        {categoryCard ? (
          <span className="text-xs font-semibold text-white/90">
            {count}/{level.wordsPerCategory}
          </span>
        ) : null}
      </div>

      <div className="mt-2 space-y-2">
        <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-2">
          <AnimatePresence mode="popLayout">
            {categoryCard ? (
              <motion.div
                key={categoryCard.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={isLocked ? { opacity: 0, y: -6, scale: 0.985 } : { opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <CardView card={categoryCard} draggable={false} className="px-2 py-2 text-xs" />
              </motion.div>
            ) : (
              <motion.div
                key="empty-category"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex h-14 items-center justify-center text-xs text-white/50"
              >
                Dépose une catégorie
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-2">
          <AnimatePresence mode="popLayout">
            {topWordCard ? (
              <motion.div
                key={topWordCard.id}
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={isLocked ? { opacity: 0, y: -6, scale: 0.99 } : { opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <CardView card={topWordCard} draggable={false} className="px-2 py-2 text-xs" />
              </motion.div>
            ) : (
              <motion.div
                key="empty-word"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex h-10 items-center justify-center text-[11px] text-white/45"
              >
                {categoryCard ? 'Dépose les mots correspondants' : '—'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
