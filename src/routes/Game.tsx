import { motion } from 'framer-motion'
import { ArrowLeft, Inbox, Layers, Play, RotateCcw, Undo2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Column } from '../components/board/Column'
import { CardView } from '../components/cards/CardView'
import { FoundationPile } from '../components/foundations/FoundationPile'
import { ErrorToast } from '../components/ui/ErrorToast'
import { IconLabel } from '../components/ui/IconLabel'
import { useGameStore } from '../store/gameStore'

export function Game() {
  const navigate = useNavigate()
  const level = useGameStore((s) => s.level)
  const status = useGameStore((s) => s.status)
  const lastError = useGameStore((s) => s.lastError)
  const lastAction = useGameStore((s) => s.lastAction)
  const newGame = useGameStore((s) => s.newGame)
  const resetLevel = useGameStore((s) => s.resetLevel)
  const draw = useGameStore((s) => s.draw)
  const undo = useGameStore((s) => s.undo)
  const moveCard = useGameStore((s) => s.moveCard)

  useEffect(() => {
    if (!level) newGame()
  }, [level, newGame])

  if (!level) return null

  const resolveDropTarget = (point: { x: number; y: number }, ignoreEl?: HTMLElement | null) => {
    // The dragged card can “block” hit-testing on some browsers. Temporarily
    // remove it from pointer hit-testing so we can reliably detect what is beneath.
    const prevPointerEvents = ignoreEl?.style.pointerEvents
    if (ignoreEl) ignoreEl.style.pointerEvents = 'none'

    try {
      const els = document.elementsFromPoint(point.x, point.y)
      for (const el of els) {
        const node = el as unknown as Node
        if (ignoreEl && (el === ignoreEl || ignoreEl.contains(node) || node.contains(ignoreEl))) continue

        const target = (el as HTMLElement).closest?.('[data-drop-target]') as HTMLElement | null
        if (!target) continue

        const kind = target.dataset.dropTarget
        if (kind === 'tableau') {
          const idx = Number(target.dataset.columnIndex)
          if (Number.isFinite(idx)) return { type: 'tableau' as const, column: idx }
        }
        if (kind === 'slot') {
          const idx = Number(target.dataset.slotIndex)
          if (Number.isFinite(idx)) return { type: 'slot' as const, slotIndex: idx }
        }
      }
      return null
    } finally {
      if (ignoreEl) ignoreEl.style.pointerEvents = prevPointerEvents ?? ''
    }
  }

  const onDropCard = (
    from: Parameters<typeof moveCard>[0],
    point: { x: number; y: number },
    draggedEl?: HTMLElement | null,
  ) => {
    const to = resolveDropTarget(point, draggedEl)
    if (!to) return
    moveCard(from, to)
  }

  const wasteTopId = level.waste.at(-1)
  const wasteTopCard = wasteTopId ? level.cardsById[wasteTopId] : undefined

  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col gap-1 [--card-w:clamp(60px,22vw,110px)] sm:gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 active:bg-white/15"
            aria-label="Retour"
            title="Retour"
          >
            <IconLabel icon={ArrowLeft} label="Retour" />
          </button>
          <button
            onClick={undo}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 active:bg-white/15"
            aria-label="Annuler"
            title="Annuler"
          >
            <IconLabel icon={Undo2} label="Annuler" />
          </button>
          <button
            onClick={resetLevel}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 active:bg-white/15"
            aria-label="Réinitialiser"
            title="Réinitialiser"
          >
            <IconLabel icon={RotateCcw} label="Réinitialiser" />
          </button>
        </div>

        {/* Stock / Waste (top-right), compact single block */}
        <div className="rounded-xl border border-white/10 bg-black/20 p-2 sm:rounded-2xl">
          <div className="grid grid-cols-2 gap-2">
            {/* Waste (left) */}
            <div className="relative w-[var(--card-w)] max-w-full" aria-label="Défausse">
              {wasteTopCard ? (
                <CardView
                  card={wasteTopCard}
                  draggable
                  onDrop={(point, draggedEl) => onDropCard({ type: 'waste' }, { x: point.x, y: point.y }, draggedEl)}
                  feedback={lastError?.cardId === wasteTopCard.id ? 'error' : undefined}
                  feedbackKey={lastError?.cardId === wasteTopCard.id ? lastError.at : undefined}
                />
              ) : (
                <div className="flex aspect-[63/88] w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/10 p-2 text-[10px] font-semibold text-white/50">
                  <span className="sr-only">Défausse vide</span>
                  <IconLabel icon={Inbox} label="Vide" />
                </div>
              )}
              <div
                className="pointer-events-none absolute -bottom-1 -right-1 rounded-full border border-white/15 bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white/80"
                aria-label={`Défausse: ${level.waste.length}`}
              >
                {level.waste.length}
              </div>
            </div>

            {/* Stock (right) */}
            <button
              onClick={draw}
              className="relative w-[var(--card-w)] max-w-full"
              aria-label={`Pioche: ${level.stock.length}`}
              title="Pioche"
            >
              <div className="aspect-[63/88] w-full rounded-xl bg-gradient-to-br from-white/10 to-black/40 ring-1 ring-white/10" />
              <div className="pointer-events-none absolute -bottom-1 -right-1 rounded-full border border-white/15 bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white/80">
                <span className="inline-flex items-center gap-1">
                  <Layers aria-hidden="true" size={12} className="opacity-90" />
                  <span className="tabular-nums">{level.stock.length}</span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 4 columns: category slot on top, tableau pile below */}
      <div className="min-h-0 flex-1">
        <section className="grid h-full grid-cols-4 justify-items-start gap-1 sm:gap-2">
          {level.slots.map((slot, idx) => (
            <div key={idx} className="flex min-h-0 flex-col items-start gap-1 sm:gap-2">
              <FoundationPile
                level={level}
                slotIndex={idx}
                slot={slot}
                placedAt={lastAction?.type === 'slotPlaced' && lastAction.slotIndex === idx ? lastAction.at : undefined}
                completedAt={
                  lastAction?.type === 'slotCompleted' && lastAction.slotIndex === idx ? lastAction.at : undefined
                }
              />
              <div className="min-h-0 flex-1">
                <Column
                  level={level}
                  columnIndex={idx}
                  onDropCard={onDropCard}
                  errorCardId={lastError?.cardId}
                  errorAt={lastError?.at}
                />
              </div>
            </div>
          ))}
        </section>
      </div>

      <ErrorToast error={lastError ? { at: lastError.at, message: lastError.message } : null} />

      {status === 'won' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/70 p-5 text-center shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            <p className="text-sm uppercase tracking-wider text-white/70">Victoire</p>
            <h2 className="mt-1 text-2xl font-semibold">Bravo !</h2>
            <p className="mt-2 text-sm text-white/75">Toutes les cartes sont rangées.</p>
            <div className="mt-5 flex flex-col gap-3">
              <button onClick={() => newGame()} className="btn-primary" aria-label="Rejouer" title="Rejouer">
                <IconLabel icon={Play} label="Rejouer" />
              </button>
              <button
                onClick={resetLevel}
                className="btn-ghost"
                aria-label="Refaire ce niveau"
                title="Refaire ce niveau"
              >
                <IconLabel icon={RotateCcw} label="Refaire ce niveau" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </div>
  )
}
