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
        // Compact slot: standard card for the category + a small strip for the top word.
        // Keep overflow visible so the category card can "hang" outside the slot like solitaire.
        'w-[clamp(60px,22vw,110px)] max-w-full rounded-xl border border-white/10 bg-black/15 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.25)] sm:rounded-2xl sm:p-1.5',
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
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60 sm:text-xs sm:text-white/70">
          <span className="hidden sm:inline">Slot </span>
          <span className="tabular-nums">{slotIndex + 1}</span>
        </p>
        <span className="text-[10px] font-semibold text-white/80 sm:text-xs sm:text-white/90">
          <span className="tabular-nums">{count}</span>
          <span className="opacity-70">/</span>
          <span className="tabular-nums">{level.wordsPerCategory}</span>
        </span>
      </div>

      <div className="grid gap-0.5">
        <AnimatePresence mode="popLayout">
          {categoryCard ? (
            <motion.div
              key={categoryCard.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={isLocked ? { opacity: 0, y: -6, scale: 0.985 } : { opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="-translate-x-1 -translate-y-1 sm:-translate-x-1.5 sm:-translate-y-1.5">
                <CardView card={categoryCard} draggable={false} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-category"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="-translate-x-1 -translate-y-1 flex aspect-[63/88] w-[clamp(60px,22vw,110px)] max-w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/10 p-2 text-[10px] font-semibold text-white/50 sm:-translate-x-1.5 sm:-translate-y-1.5 sm:text-xs"
            >
              Catégorie
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {topWordCard ? (
            <motion.div
              key={topWordCard.id}
              initial={{ opacity: 0, y: 4 }}
              animate={isLocked ? { opacity: 0, y: -4 } : { opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="rounded-lg border border-white/10 bg-black/25 px-1.5 py-0.5 text-[10px] font-semibold text-white/75 sm:text-[11px]"
              aria-label={`Mot du dessus: ${topWordCard.word}`}
            >
              <span className="block truncate">{topWordCard.word}</span>
            </motion.div>
          ) : (
            <motion.div
              key="empty-word"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="rounded-lg border border-dashed border-white/10 bg-black/10 px-1.5 py-0.5 text-[10px] font-semibold text-white/40 sm:text-[11px]"
              aria-label="Aucun mot"
            >
              {categoryCard ? 'Mots…' : '—'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
