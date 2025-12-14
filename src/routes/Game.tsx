import { motion } from 'framer-motion'
import { Archive, Flag, Inbox, Layers, Palette, Play, RotateCcw, Trophy, Undo2 } from 'lucide-react'
import { useEffect } from 'react'
import { Tableau } from '../components/board/Tableau'
import { CardView } from '../components/cards/CardView'
import { Foundations } from '../components/foundations/Foundations'
import { IconLabel } from '../components/ui/IconLabel'
import { useGameStore } from '../store/gameStore'

export function Game() {
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

  const StatusIcon = status === 'won' ? Trophy : Flag

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Partie</h1>
        <div className="flex items-center gap-2">
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
      </div>

      <section className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-9">
          {/* Slots */}
          <Foundations
            level={level}
            placedSlotIndex={lastAction?.type === 'slotPlaced' ? lastAction.slotIndex : undefined}
            completedSlotIndex={lastAction?.type === 'slotCompleted' ? lastAction.slotIndex : undefined}
            actionAt={lastAction ? lastAction.at : undefined}
          />
        </div>

        {/* Stock / Waste (top-right) */}
        <div className="col-span-12 lg:col-span-3">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <button
              onClick={draw}
              className="rounded-2xl border border-white/10 bg-black/20 p-3 text-left hover:bg-black/30 active:bg-black/40"
              aria-label="Pioche"
              title="Pioche"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                <span className="inline-flex items-center gap-2">
                  <Layers aria-hidden="true" className="shrink-0 opacity-90" size={14} />
                  <span>Pioche</span>
                </span>
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-14 w-24 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-black/30" />
                <div className="text-xs text-white/70">
                  <div className="inline-flex items-center gap-1.5" aria-label={`Stock: ${level.stock.length}`}>
                    <Layers aria-hidden="true" className="shrink-0 opacity-90" size={14} />
                    <span className="hidden sm:inline">Stock</span>
                    <span className="sr-only sm:hidden">Stock</span>
                    <span className="tabular-nums">{level.stock.length}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5" aria-label={`Défausse: ${level.waste.length}`}>
                    <Archive aria-hidden="true" className="shrink-0 opacity-90" size={14} />
                    <span className="hidden sm:inline">Défausse</span>
                    <span className="sr-only sm:hidden">Défausse</span>
                    <span className="tabular-nums">{level.waste.length}</span>
                  </div>
                </div>
              </div>
            </button>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                <span className="inline-flex items-center gap-2">
                  <Archive aria-hidden="true" className="shrink-0 opacity-90" size={14} />
                  <span>Défausse</span>
                </span>
              </p>
              <div className="mt-2 min-h-14 rounded-xl border border-dashed border-white/20 bg-white/5 p-2">
                {level.waste.length ? (
                  <CardView
                    card={level.cardsById[level.waste[level.waste.length - 1]]}
                    draggable
                    onDrop={(point, draggedEl) => onDropCard({ type: 'waste' }, { x: point.x, y: point.y }, draggedEl)}
                    feedback={lastError?.cardId === level.waste[level.waste.length - 1] ? 'error' : undefined}
                    feedbackKey={lastError?.cardId === level.waste[level.waste.length - 1] ? lastError.at : undefined}
                  />
                ) : (
                  <div className="flex h-14 items-center justify-center text-xs text-white/50" aria-label="Vide">
                    <IconLabel icon={Inbox} label="Vide" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tableau */}
      <Tableau level={level} onDropCard={onDropCard} errorCardId={lastError?.cardId} errorAt={lastError?.at} />

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-white/75">
        <span className="inline-flex items-center gap-2" aria-label={`Thème: ${level.themeId}`}>
          <Palette aria-hidden="true" className="shrink-0 opacity-90" size={14} />
          <span className="hidden sm:inline">Thème</span>
          <span className="sr-only sm:hidden">Thème</span>
          <span className="tabular-nums">{level.themeId}</span>
        </span>
        <span
          className={['inline-flex items-center gap-2', status === 'won' ? 'text-amber-300' : ''].join(' ')}
          aria-label={`Statut: ${status}`}
        >
          <StatusIcon aria-hidden="true" className="shrink-0 opacity-90" size={14} />
          <span className="hidden sm:inline">Statut</span>
          <span className="sr-only sm:hidden">Statut</span>
          <span className="tabular-nums">{status}</span>
        </span>
      </div>

      {lastError ? (
        <motion.div
          key={lastError.at}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100"
        >
          {lastError.message}
        </motion.div>
      ) : null}

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
