import type { LevelState } from '../../game/types'
import type { MoveSource } from '../../store/gameStore'
import { CardView } from '../cards/CardView'

export type ColumnProps = {
  level: LevelState
  columnIndex: number
  onDropCard: (from: MoveSource, point: { x: number; y: number }) => void
  errorCardId?: string
  errorAt?: number
}

// English comments per project rule.
export function Column({ level, columnIndex, onDropCard, errorCardId, errorAt }: ColumnProps) {
  const ids = level.tableau[columnIndex] ?? []
  const visible = ids.slice(Math.max(0, ids.length - 6))

  return (
    <div
      data-drop-target="tableau"
      data-column-index={columnIndex}
      className="relative min-h-[220px] rounded-2xl border border-white/10 bg-black/10 p-2"
    >
      <div className="mb-2 h-9 rounded-xl border border-white/10 bg-black/20" />

      <div className="relative">
        {visible.map((id, idx) => {
          const card = level.cardsById[id]
          const isTop = id === ids.at(-1)
          const y = idx * 14
          return (
            <div key={id} className="absolute left-0 right-0" style={{ top: y }}>
              <CardView
                card={card}
                draggable={isTop}
                onDrop={(point) => onDropCard({ type: 'tableau', column: columnIndex }, { x: point.x, y: point.y })}
                feedback={isTop && errorCardId === id ? 'error' : undefined}
                feedbackKey={isTop && errorCardId === id ? errorAt : undefined}
                className={isTop ? '' : 'opacity-95'}
              />
            </div>
          )
        })}
        {/* Reserve height for the stack */}
        <div style={{ height: Math.max(1, visible.length) * 14 + 80 }} />
      </div>

      {ids.length > visible.length ? (
        <div className="mt-2 text-center text-[10px] font-semibold text-white/50">
          +{ids.length - visible.length} cartes
        </div>
      ) : null}
    </div>
  )
}
