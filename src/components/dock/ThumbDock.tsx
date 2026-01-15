import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { CardId, LevelState } from '../../game/types'
import type { MoveSource } from '../../store/gameStore'
import { StockWaste } from './StockWaste'

type Selected = { source: MoveSource; cardIds: CardId[] } | null
type Toast = { key: number; message: string } | null

export type ThumbDockProps = {
  level: LevelState
  selected: Selected
  onSelectSource: (source: MoveSource, cardId: CardId) => void
  onDraw: () => void
  onUndo: () => void
  onDropCard: (
    from: MoveSource,
    draggedCardId: CardId,
    point: { x: number; y: number },
    draggedEl?: HTMLElement | null,
  ) => boolean
  errorCardId?: string
  errorAt?: number
  undoIcon: ReactNode
  toast: Toast
}

// English comments per project rule.
export function ThumbDock({
  level,
  selected,
  onSelectSource,
  onDraw,
  onUndo,
  onDropCard,
  errorCardId,
  errorAt,
  undoIcon,
  toast,
}: ThumbDockProps) {
  const reduceMotion = useReducedMotion() ?? false

  return (
    <div className="pointer-events-none relative z-40">
      <div className="mx-auto w-full max-w-screen-sm pb-4">
        <div className="relative">
          <AnimatePresence>
            {toast ? (
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-[min(92vw,420px)] -translate-x-1/2">
                <motion.div
                  key={toast.key}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.99 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <div className="rounded-2xl border border-rose-300/25 bg-rose-500/10 px-4 py-3 text-center text-sm font-semibold text-rose-100 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur">
                    {toast.message}
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>

          <motion.div
            className="pointer-events-auto flex items-center justify-between rounded-[26px] border border-white/10 bg-black/55 px-4 py-3 shadow-[0_26px_80px_rgba(0,0,0,0.55)] backdrop-blur"
            initial={false}
            animate={reduceMotion ? undefined : { y: [6, 0] }}
            transition={reduceMotion ? undefined : { duration: 0.2, ease: 'easeOut' }}
            data-ui-control="true"
          >
            <StockWaste
              level={level}
              selected={selected}
              onSelectSource={onSelectSource}
              onDraw={onDraw}
              onDropCard={onDropCard}
              errorCardId={errorCardId}
              errorAt={errorAt}
            />

            <button
              type="button"
              data-ui-control="true"
              onClick={onUndo}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white/85 active:bg-white/10"
              aria-label="Annuler"
              title="Annuler"
            >
              {undoIcon}
              <span className="sr-only">Annuler</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
