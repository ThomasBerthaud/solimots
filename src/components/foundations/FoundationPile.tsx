import { motion } from 'framer-motion'
import type { CategoryDef, CardId } from '../../game/types'

export type FoundationPileProps = {
  category: CategoryDef
  count: number
  topCardId?: CardId
  placedAt?: number
}

// English comments per project rule.
export function FoundationPile({ category, count, placedAt }: FoundationPileProps) {
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
      <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{category.label}</p>
      <div className="mt-2 flex h-12 items-center justify-between rounded-xl border border-dashed border-white/20 bg-white/5 px-3">
        <span className="text-xs text-white/70">Cartes</span>
        <span className="text-xs font-semibold text-white/90">{count}/6</span>
      </div>
    </motion.div>
  )
}
