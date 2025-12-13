import { motion } from 'framer-motion'
import type { Card, CategoryDef } from '../../game/types'
import { CardView } from '../cards/CardView'

export type FoundationPileProps = {
  category: CategoryDef
  count: number
  topCard?: Card
  placedAt?: number
}

// English comments per project rule.
export function FoundationPile({ category, count, topCard, placedAt }: FoundationPileProps) {
  return (
    <motion.div
      data-drop-target="foundation"
      data-category-id={category.id}
      className="rounded-2xl border border-white/10 bg-black/20 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
      animate={
        placedAt
          ? {
              boxShadow: [
                '0 10px 30px rgba(0,0,0,0.25)',
                '0 10px 40px rgba(251,191,36,0.25)',
                '0 10px 30px rgba(0,0,0,0.25)',
              ],
            }
          : undefined
      }
      transition={placedAt ? { duration: 0.5, ease: 'easeOut' } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{category.label}</p>
        <span className="text-xs font-semibold text-white/90">{count}/6</span>
      </div>

      <div className="mt-2 rounded-xl border border-dashed border-white/20 bg-white/5 p-2">
        {topCard ? (
          <CardView card={topCard} draggable={false} className="px-2 py-2 text-xs" />
        ) : (
          <div className="flex h-14 items-center justify-center text-xs text-white/50">Dépose ici</div>
        )}
      </div>
    </motion.div>
  )
}
