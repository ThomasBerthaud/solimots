import type { LevelState } from '../../game/types'
import type { MoveSource } from '../../store/gameStore'
import { Column } from './Column'

export type TableauProps = {
  level: LevelState
  onDropCard: (from: MoveSource, point: { x: number; y: number }, draggedEl?: HTMLElement | null) => void
  errorCardId?: string
  errorAt?: number
}

// English comments per project rule.
export function Tableau({ level, onDropCard, errorCardId, errorAt }: TableauProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/10 p-3">
      <div className="grid grid-cols-4 gap-3">
        {level.tableau.map((_, colIdx) => (
          <Column
            key={colIdx}
            level={level}
            columnIndex={colIdx}
            onDropCard={onDropCard}
            errorCardId={errorCardId}
            errorAt={errorAt}
          />
        ))}
      </div>
    </section>
  )
}
