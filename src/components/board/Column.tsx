import type { LevelState } from '../../game/types'
import type { MoveSource } from '../../store/gameStore'
import { CardView } from '../cards/CardView'

export type ColumnProps = {
  level: LevelState
  columnIndex: number
  onDropCard: (from: MoveSource, point: { x: number; y: number }, draggedEl?: HTMLElement | null) => void
  errorCardId?: string
  errorAt?: number
}

// English comments per project rule.
export function Column({ level, columnIndex, onDropCard, errorCardId, errorAt }: ColumnProps) {
  const ids = level.tableau[columnIndex] ?? []
  const topId = ids.at(-1)
  const topCard = topId ? level.cardsById[topId] : undefined
  const hiddenCount = Math.max(0, ids.length - (topId ? 1 : 0))
  const backLayers = Math.min(4, hiddenCount)

  return (
    <div
      data-drop-target="tableau"
      data-column-index={columnIndex}
      className="w-[clamp(60px,22vw,110px)] max-w-full rounded-xl border border-white/10 bg-black/10 p-0.5 sm:rounded-2xl sm:p-1"
    >
      {topCard ? (
        <div className="relative">
          {/* Draw a few "card backs" behind the top card to hint at hidden cards. */}
          {Array.from({ length: backLayers }).map((_, i) => {
            // Solitaire-like stack: each card sits slightly lower.
            const offsetY = (i + 1) * 7
            const opacity = 0.75 - i * 0.12
            return (
              <div
                key={i}
                className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-white/20 via-black/25 to-black/70 ring-1 ring-white/15 shadow-[0_12px_34px_rgba(0,0,0,0.30)] sm:rounded-2xl"
                style={{ transform: `translateY(${offsetY}px)`, opacity }}
              />
            )
          })}

          <CardView
            card={topCard}
            draggable
            onDrop={(point, draggedEl) =>
              onDropCard({ type: 'tableau', column: columnIndex }, { x: point.x, y: point.y }, draggedEl)
            }
            feedback={errorCardId === topCard.id ? 'error' : undefined}
            feedbackKey={errorCardId === topCard.id ? errorAt : undefined}
          />
        </div>
      ) : (
        <div className="flex aspect-[63/88] w-[clamp(60px,22vw,110px)] max-w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/10 p-2 text-[10px] font-semibold text-white/50 sm:text-xs">
          Vide
        </div>
      )}
    </div>
  )
}
