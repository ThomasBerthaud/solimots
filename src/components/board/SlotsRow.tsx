import { LayoutGroup } from 'framer-motion'
import type { Card, CardId, LevelState } from '../../game/types'
import type { MoveSource, MoveTarget } from '../../store/gameStore'
import { SlotCell } from './SlotCell'

type Selected = { source: MoveSource; cardIds: CardId[] } | null

export type SlotsRowProps = {
  level: LevelState
  selected: Selected
  selectedCard: Card | null
  tryMoveTo: (target: MoveTarget) => void
  placedSlotIndex?: number
  completedSlotIndex?: number
  actionAt?: number
}

// English comments per project rule.
export function SlotsRow({
  level,
  selected,
  selectedCard,
  tryMoveTo,
  placedSlotIndex,
  completedSlotIndex,
  actionAt,
}: SlotsRowProps) {
  return (
    <section className="rounded-[24px] bg-black/15 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <LayoutGroup>
        <div className="grid grid-cols-5 gap-2">
          {level.slots.map((slot, idx) => (
            <SlotCell
              key={idx}
              level={level}
              slotIndex={idx}
              slot={slot}
              selected={selected}
              selectedCard={selectedCard}
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
