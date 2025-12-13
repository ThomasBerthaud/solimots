import type { LevelState } from '../../game/types'
import { FoundationPile } from './FoundationPile'

export type FoundationsProps = {
  level: LevelState
  placedSlotIndex?: number
  completedSlotIndex?: number
  actionAt?: number
}

// English comments per project rule.
export function Foundations({ level, placedSlotIndex, completedSlotIndex, actionAt }: FoundationsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {level.slots.map((slot, idx) => (
        <FoundationPile
          key={idx}
          level={level}
          slotIndex={idx}
          slot={slot}
          placedAt={placedSlotIndex === idx ? actionAt : undefined}
          completedAt={completedSlotIndex === idx ? actionAt : undefined}
        />
      ))}
    </section>
  )
}
