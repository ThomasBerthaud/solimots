import type { Card, CardId, LevelState } from '../../game/types'
import type { MoveSource, MoveTarget } from '../../store/gameStore'
import { TableauCell } from './TableauCell'

type Selected = { source: MoveSource; cardIds: CardId[] } | null

export type TableauRowProps = {
  level: LevelState
  selected: Selected
  selectedCard: Card | null
  onSelectSource: (source: MoveSource, cardId: CardId) => void
  tryMoveTo: (target: MoveTarget) => void
  onDropCard: (
    from: MoveSource,
    draggedCardId: CardId,
    point: { x: number; y: number },
    draggedEl?: HTMLElement | null,
  ) => boolean
  errorCardId?: string
  errorAt?: number
}

// English comments per project rule.
export function TableauRow({
  level,
  selected,
  selectedCard,
  onSelectSource,
  tryMoveTo,
  onDropCard,
  errorCardId,
  errorAt,
}: TableauRowProps) {
  const columnCount = level.tableau.length

  return (
    <section className="rounded-[24px] bg-black/15 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
        {level.tableau.map((ids, colIdx) => (
          <TableauCell
            key={colIdx}
            level={level}
            columnIndex={colIdx}
            ids={ids}
            selected={selected}
            selectedCard={selectedCard}
            onSelectSource={onSelectSource}
            tryMoveTo={tryMoveTo}
            onDropCard={onDropCard}
            errorCardId={errorCardId}
            errorAt={errorAt}
          />
        ))}
      </div>
    </section>
  )
}
