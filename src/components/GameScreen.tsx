import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { HelpCircle, Undo2 } from 'lucide-react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CardId, LevelState } from '../game/types'
import { useGameStore, type MoveSource, type MoveTarget } from '../store/gameStore'
import { getTitleForLevel, POINTS_PER_CARD, useProgressionStore } from '../store/progressionStore'
import { useSoundEffects } from '../utils/useSoundEffects'
import { useTheme } from '../utils/useTheme'
import { SlotsRow } from './board/SlotsRow'
import { TableauRow } from './board/TableauRow'
import { ThumbDock } from './dock/ThumbDock'
import { HelpModal } from './modals/HelpModal'
import { ProgressionAnimation } from './modals/ProgressionAnimation'

type Selected = { source: MoveSource; cardIds: CardId[] } | null
type Toast = { key: number; message: string } | null

function isEventInside(el: EventTarget | null, selector: string): boolean {
  if (!(el instanceof Element)) return false
  return Boolean(el.closest(selector))
}

function computeContiguousSelection(level: LevelState, source: MoveSource, clickedId: CardId): CardId[] {
  if (source.type !== 'tableau') return [clickedId]
  const col = level.tableau[source.column] ?? []
  const idx = col.indexOf(clickedId)
  if (idx < 0) return [clickedId]
  const segment = col.slice(idx)
  // Only revealed cards can be selected/moved.
  const firstHidden = segment.findIndex((id) => !level.cardsById[id]?.faceUp)
  return firstHidden >= 0 ? segment.slice(0, firstHidden) : segment
}

function getCardsToMove(from: MoveSource, draggedCardId: CardId, level: LevelState): CardId[] {
  // For tableau, this includes all cards from the dragged card to the end of the column.
  // For waste, it's always just the single card.
  if (from.type === 'tableau') {
    return computeContiguousSelection(level, from, draggedCardId)
  }
  return [draggedCardId]
}

function explainInvalidMove(level: LevelState, cardId: CardId, to: MoveTarget): string | null {
  if (to.type === 'tableau') return null

  const slot = level.slots[to.slotIndex]
  if (!slot) return 'Ce slot n’existe pas.'
  if (slot.isCompleting) return 'Ce slot est en cours de validation.'

  const card = level.cardsById[cardId]
  if (!card) return 'Carte introuvable.'

  if (slot.categoryCardId == null) {
    if (card.kind !== 'category') return 'Pose d’abord une catégorie sur ce slot.'
    return null
  }

  const categoryCard = level.cardsById[slot.categoryCardId]
  if (!categoryCard || categoryCard.kind !== 'category') return 'Ce slot est invalide.'

  if (card.kind !== 'word') return 'Tu dois poser un mot sur ce slot.'
  const required = level.requiredWordsByCategoryId[categoryCard.categoryId] ?? 0
  if (slot.pile.length >= required) return 'Cette catégorie est déjà complétée.'
  if (card.categoryId !== categoryCard.categoryId) {
    return `Ce mot n’appartient pas à la catégorie “${categoryCard.word}”.`
  }

  return null
}

// English comments per project rule.
export function GameScreen() {
  const reduceMotion = useReducedMotion() ?? false
  const level = useGameStore((s) => s.level)
  const status = useGameStore((s) => s.status)
  const lastError = useGameStore((s) => s.lastError)
  const lastAction = useGameStore((s) => s.lastAction)
  const newGame = useGameStore((s) => s.newGame)
  const draw = useGameStore((s) => s.draw)
  const undo = useGameStore((s) => s.undo)
  const moveCard = useGameStore((s) => s.moveCard)
  const moveCards = useGameStore((s) => s.moveCards)

  const currentLevel = useProgressionStore((s) => s.currentLevel)
  const currentPoints = useProgressionStore((s) => s.totalPoints)
  const awardPoints = useProgressionStore((s) => s.awardPoints)

  const { playSound, playMusic } = useSoundEffects()
  const theme = useTheme()

  const [selected, setSelected] = useState<Selected>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [showProgression, setShowProgression] = useState(false)
  const [progressionData, setProgressionData] = useState<{
    cardCount: number
    pointsEarned: number
    newLevel: number
    oldPoints: number
    newPoints: number
    levelsGained: number
    newTitle: string | null
  } | null>(null)
  const lastAttemptRef = useRef<{ at: number; message: string | null } | null>(null)
  const progressionAwardedRef = useRef(false)

  const lastActionAt = lastAction?.at
  const placedSlotIndex = lastAction?.type === 'slotPlaced' ? lastAction.slotIndex : undefined
  const completedSlotIndex = lastAction?.type === 'slotCompleted' ? lastAction.slotIndex : undefined

  useEffect(() => {
    if (!level) newGame()
  }, [level, newGame])

  useEffect(() => {
    // Auto-clear selection after end of game.
    if (status === 'won' || status === 'lost') {
      setSelected(null)
    }
    // Reset progression awarded flag when leaving won state
    if (status !== 'won') {
      progressionAwardedRef.current = false
    }
  }, [status])

  useEffect(() => {
    // Award points and show progression when winning (only once per win)
    if (status === 'won' && level && !progressionAwardedRef.current) {
      // Calculate total cards in the game
      const cardCount = Object.keys(level.cardsById).length
      const oldPoints = currentPoints
      
      const result = awardPoints(cardCount)
      const pointsEarned = cardCount * POINTS_PER_CARD
      
      setProgressionData({
        cardCount,
        pointsEarned,
        newLevel: result.newLevel,
        oldPoints,
        newPoints: oldPoints + pointsEarned,
        levelsGained: result.levelsGained,
        newTitle: result.newTitle,
      })
      setShowProgression(true)
      progressionAwardedRef.current = true
    }
  }, [status, level, currentPoints, awardPoints])

  useEffect(() => {
    if (!lastError) return
    const now = Date.now()
    const attempt = lastAttemptRef.current
    const message = attempt && now - attempt.at < 600 && attempt.message ? attempt.message : lastError.message
    setToast({ key: lastError.at, message })
    playSound('error', 0.4)
    const t = window.setTimeout(() => setToast(null), 1800)
    return () => window.clearTimeout(t)
  }, [lastError, playSound])

  useEffect(() => {
    if (!lastAction) return
    if (lastAction.type === 'slotPlaced') {
      playSound('place', 0.5)
    } else if (lastAction.type === 'slotCompleted') {
      playSound('complete', 0.6)
    }
  }, [lastAction, playSound])

  useEffect(() => {
    if (status === 'won') {
      playSound('win', 0.6)
      playMusic('end', 0.25)
    } else if (status === 'lost') {
      playSound('lose', 0.5)
    }
  }, [status, playSound, playMusic])

  const resolveDropTarget = useMemo(() => {
    return (point: { x: number; y: number }, ignoreEl?: HTMLElement | null): MoveTarget | null => {
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
  }, [])

  const onDropCard = (
    from: MoveSource,
    draggedCardId: CardId,
    point: { x: number; y: number },
    draggedEl?: HTMLElement | null,
  ): boolean => {
    const to = resolveDropTarget(point, draggedEl)
    if (!to) return false
    // Dropping onto the same source is a no-op; treat it as invalid so the UI snaps back.
    if (from.type === 'tableau' && to.type === 'tableau' && from.column === to.column) return false

    const cardIdsToMove = getCardsToMove(from, draggedCardId, level!)
    const bottomId = cardIdsToMove[0]
    lastAttemptRef.current = { at: Date.now(), message: explainInvalidMove(level!, bottomId, to) }
    const ok = cardIdsToMove.length === 1 ? moveCard(from, to) : moveCards(from, to, cardIdsToMove)
    if (ok) {
      setSelected(null)
      playSound('move', 0.4)
    }
    return ok
  }

  const onSelectSource = (source: MoveSource, cardId: CardId) => {
    setSelected((prev) => {
      // Toggle off if same exact selection is clicked again.
      if (prev?.source.type === source.type) {
        if (
          source.type === 'waste' &&
          prev.source.type === 'waste' &&
          prev.cardIds.length === 1 &&
          prev.cardIds[0] === cardId
        ) {
          return null
        }
        if (source.type === 'tableau' && prev.source.type === 'tableau' && prev.source.column === source.column) {
          const nextIds = computeContiguousSelection(level!, source, cardId)
          if (prev.cardIds.length === nextIds.length && prev.cardIds.every((id, i) => id === nextIds[i])) return null
        }
      }
      const card = level!.cardsById[cardId]
      if (!card?.faceUp) return prev
      if (source.type === 'waste') return { source, cardIds: [cardId] }
      return { source, cardIds: computeContiguousSelection(level!, source, cardId) }
    })
  }

  const tryMoveTo = (target: MoveTarget) => {
    const sel = selected
    if (!sel) return
    const bottomId = sel.cardIds[0]
    lastAttemptRef.current = { at: Date.now(), message: explainInvalidMove(level!, bottomId, target) }
    const ok = sel.cardIds.length === 1 ? moveCard(sel.source, target) : moveCards(sel.source, target, sel.cardIds)
    if (ok) {
      setSelected(null)
      playSound('move', 0.4)
    }
  }

  const handleDraw = () => {
    draw()
    playSound('draw', 0.4)
  }

  const handleUndo = () => {
    undo()
    playSound('undo', 0.4)
  }

  const onPointerDownCapture = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!selected) return
    const t = e.target as EventTarget | null

    // Do not auto-deselect when interacting with cards, targets, or controls.
    if (isEventInside(t, '[data-card-interactive="true"]')) return
    if (isEventInside(t, '[data-tap-target="true"]')) return
    if (isEventInside(t, '[data-ui-control="true"]')) return

    setSelected(null)
  }

  if (!level) return null
  const selectedCard = selected ? level.cardsById[selected.cardIds[0]] : null

  const feltBackgroundStyle = {
    background: `linear-gradient(to bottom, ${theme.feltBackground.from}, ${theme.feltBackground.to})`,
  }

  return (
    <div
      className="mobile-game relative mx-auto flex h-dvh w-full max-w-screen-sm lg:max-w-4xl flex-col px-3 pb-3 lg:pb-8"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      onPointerDownCapture={onPointerDownCapture}
    >
      {/* Felt background panel */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] blur-[0.2px]"
        style={feltBackgroundStyle}
      />

      <header className="mb-3 flex shrink-0 items-center justify-between pt-3 lg:mb-4 lg:pt-4">
        <Link
          to="/"
          data-ui-control="true"
          className="inline-flex h-10 items-center gap-2 rounded-2xl bg-black/25 px-3 text-xs font-semibold text-white/85 active:bg-black/35 lg:h-12 lg:px-4 lg:text-sm"
          aria-label="Retour à l'accueil"
          title="Retour à l'accueil"
        >
          <span aria-hidden="true">←</span>
          <span>Accueil</span>
        </Link>

        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 lg:text-xs">
            {getTitleForLevel(currentLevel)} • Niv. {currentLevel}
          </p>
          <p className="text-sm font-semibold text-white/90 lg:text-base">Partie #{level.seed}</p>
        </div>

        <button
          type="button"
          data-ui-control="true"
          onClick={() => setHelpOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/25 text-white/85 active:bg-black/35 lg:h-12 lg:w-12"
          aria-label="Aide"
          title="Aide"
        >
          <HelpCircle size={18} className="lg:h-5 lg:w-5" aria-hidden="true" />
        </button>
      </header>

      <LayoutGroup>
        {/* Dock at top on desktop, bottom on mobile */}
        <div className="order-3 lg:order-1 lg:mb-4">
          <ThumbDock
            level={level}
            selected={selected}
            onSelectSource={onSelectSource}
            onDraw={handleDraw}
            onUndo={handleUndo}
            onDropCard={onDropCard}
            errorCardId={lastError?.cardId}
            errorAt={lastError?.at}
            undoIcon={<Undo2 size={18} className="lg:h-5 lg:w-5" aria-hidden="true" />}
            toast={toast}
          />
        </div>

        {/* Flex spacer to push game content to bottom on mobile, stays at top on desktop */}
        <div className="order-1 min-h-0 flex-1 lg:order-2 lg:hidden" />

        <div className="order-2 mb-3 shrink-0 space-y-3 lg:order-3 lg:mb-0 lg:space-y-4">
          <SlotsRow
            level={level}
            selected={selected}
            selectedCard={selectedCard}
            tryMoveTo={tryMoveTo}
            placedSlotIndex={placedSlotIndex}
            completedSlotIndex={completedSlotIndex}
            actionAt={lastActionAt}
          />

          <TableauRow
            level={level}
            selected={selected}
            selectedCard={selectedCard}
            onSelectSource={onSelectSource}
            tryMoveTo={tryMoveTo}
            onDropCard={onDropCard}
            errorCardId={lastError?.cardId}
            errorAt={lastError?.at}
          />
        </div>
      </LayoutGroup>

      <AnimatePresence>{helpOpen ? <HelpModal key="help" onClose={() => setHelpOpen(false)} /> : null}</AnimatePresence>

      <AnimatePresence>
        {status === 'won' && showProgression && progressionData ? (
          <WinOverlay
            key="win"
            reduceMotion={reduceMotion}
            showProgression={true}
            progressionData={progressionData}
            onProgressionComplete={() => setShowProgression(false)}
            onReplay={() => {
              setSelected(null)
              setShowProgression(false)
              setProgressionData(null)
              progressionAwardedRef.current = false
              newGame()
            }}
          />
        ) : status === 'won' && !showProgression ? (
          <WinOverlay
            key="win-final"
            reduceMotion={reduceMotion}
            showProgression={false}
            onReplay={() => {
              setSelected(null)
              progressionAwardedRef.current = false
              newGame()
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {status === 'lost' ? (
          <LostOverlay
            key="lost"
            reduceMotion={reduceMotion}
            onReplay={() => {
              setSelected(null)
              progressionAwardedRef.current = false
              newGame()
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function WinOverlay({
  reduceMotion,
  onReplay,
  showProgression = false,
  progressionData,
  onProgressionComplete,
}: {
  reduceMotion: boolean
  onReplay: () => void
  showProgression?: boolean
  progressionData?: {
    cardCount: number
    pointsEarned: number
    newLevel: number
    oldPoints: number
    newPoints: number
    levelsGained: number
    newTitle: string | null
  }
  onProgressionComplete?: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-black/60 p-5 text-center shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {showProgression && progressionData && onProgressionComplete ? (
          <ProgressionAnimation
            cardCount={progressionData.cardCount}
            pointsEarned={progressionData.pointsEarned}
            newLevel={progressionData.newLevel}
            oldPoints={progressionData.oldPoints}
            newPoints={progressionData.newPoints}
            levelsGained={progressionData.levelsGained}
            newTitle={progressionData.newTitle}
            onComplete={onProgressionComplete}
            reduceMotion={reduceMotion}
          />
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Victoire</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Bravo !</h2>
            <p className="mt-2 text-sm text-white/75">Toutes les cartes sont rangées.</p>

            <motion.div
              className="pointer-events-none mt-5 h-10"
              initial={false}
              animate={reduceMotion ? { opacity: 1 } : { opacity: [0.6, 1, 0.6] }}
              transition={reduceMotion ? undefined : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="mx-auto h-1.5 w-28 rounded-full bg-gradient-to-r from-amber-300/30 via-amber-300/90 to-amber-300/30" />
            </motion.div>

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                data-ui-control="true"
                onClick={onReplay}
                className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-bold text-black shadow active:bg-amber-500"
                aria-label="Rejouer"
                title="Rejouer"
              >
                Rejouer
              </button>

              <Link
                to="/"
                data-ui-control="true"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-black/35 px-4 py-3 text-sm font-bold text-white/90 shadow active:bg-black/45"
                aria-label="Retour à l'accueil"
                title="Retour à l'accueil"
              >
                Accueil
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

function LostOverlay({ reduceMotion, onReplay }: { reduceMotion: boolean; onReplay: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-black/60 p-5 text-center shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Défaite</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Bloqué…</h2>
        <p className="mt-2 text-sm text-white/75">Impossible de compléter une catégorie déjà posée.</p>

        <div className="mt-6 grid gap-2">
          <button
            type="button"
            data-ui-control="true"
            onClick={onReplay}
            className="w-full rounded-2xl bg-white/90 px-4 py-3 text-sm font-bold text-black shadow active:bg-white"
            aria-label="Rejouer"
            title="Rejouer"
          >
            Rejouer
          </button>

          <Link
            to="/"
            data-ui-control="true"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-black/35 px-4 py-3 text-sm font-bold text-white/90 shadow active:bg-black/45"
            aria-label="Retour à l’accueil"
            title="Retour à l'accueil"
          >
            Accueil
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
