import { LayoutGroup } from 'framer-motion'
import type { CardId, LevelState } from '../../game/types'
import type { MoveSource, MoveTarget } from '../../store/gameStore'
import { SlotCell } from './SlotCell'

type Selected = { source: MoveSource; cardIds: CardId[] } | null

export type SlotsRowProps = {
  level: LevelState
  selected: Selected
  tryMoveTo: (target: MoveTarget) => void
  placedSlotIndex?: number
  completedSlotIndex?: number
  actionAt?: number
}

// English comments per project rule.
export function SlotsRow({
  level,
  selected,
  tryMoveTo,
  placedSlotIndex,
  completedSlotIndex,
  actionAt,
}: SlotsRowProps) {
  const columnCount = level.slots.length

  return (
    <section className="rounded-[24px] bg-black/15 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:rounded-[28px] lg:p-3">
      <LayoutGroup>
        <div className="grid gap-2 lg:gap-3" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
          {level.slots.map((slot, idx) => (
            <SlotCell
              key={idx}
              level={level}
              slotIndex={idx}
              slot={slot}
              selected={selected}
              tryMoveTo={tryMoveTo}
              placedAt={placedSlotIndex === idx ? actionAt : undefined}
              completedAt={completedSlotIndex === idx ? actionAt : undefined}
            />
          ))}
        </div>
      </LayoutGroup>
    </section>
  )
}
