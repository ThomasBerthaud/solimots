import type { LevelState } from '../../game/types'
import { FoundationPile } from './FoundationPile'

export type FoundationsProps = {
  level: LevelState
  placedCategoryId?: string
  placedAt?: number
}

// English comments per project rule.
export function Foundations({ level, placedCategoryId, placedAt }: FoundationsProps) {
  return (
    <section className="grid grid-cols-2 gap-3">
      {level.categories.map((c) => (
        <FoundationPile
          key={c.id}
          category={c}
          count={level.foundations[c.id]?.length ?? 0}
          topCardId={level.foundations[c.id]?.at(-1)}
          placedAt={placedCategoryId === c.id ? placedAt : undefined}
        />
      ))}
    </section>
  )
}


