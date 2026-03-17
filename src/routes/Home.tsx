import { Play, RotateCcw, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { IconLabel } from '../components/ui/IconLabel'
import { useGameStore } from '../store/gameStore'
import { getTitleForLevel, getPointsForLevel, useProgressionStore } from '../store/progressionStore'

export function Home() {
  const navigate = useNavigate()
  const newGame = useGameStore((s) => s.newGame)
  const level = useGameStore((s) => s.level)
  const status = useGameStore((s) => s.status)

  const currentLevel = useProgressionStore((s) => s.currentLevel)
  const pointsInCurrentLevel = useProgressionStore((s) => s.pointsInCurrentLevel)
  const totalPoints = useProgressionStore((s) => s.totalPoints)

  const hasSavedGame = level !== null && status === 'inProgress'

  const pointsForNextLevel = getPointsForLevel(currentLevel + 1)
  const progressPercentage = (pointsInCurrentLevel / pointsForNextLevel) * 100
  const currentTitle = getTitleForLevel(currentLevel)

  const handlePlay = () => {
    newGame()
    navigate('/game')
  }

  const handleResume = () => {
    navigate('/game')
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="surface p-6 md:p-8">
        <h1 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-tight tracking-tight">
          Associe les mots à la bonne catégorie.
        </h1>
        <p className="mt-3 text-muted md:mt-4">Déplace les cartes vers la bonne case.</p>

        <div className="mt-6 flex flex-col gap-3 md:mt-8">
          <button
            type="button"
            onClick={handlePlay}
            className="btn-primary inline-flex min-h-[52px] w-full items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold md:min-h-[56px] md:py-4"
            aria-label="Jouer une partie"
            title="Jouer une partie"
          >
            <IconLabel icon={Play} label="Jouer" hideLabelOnMobile={false} />
          </button>
          {hasSavedGame ? (
            <button
              type="button"
              onClick={handleResume}
              className="btn-ghost inline-flex min-h-[44px] w-full items-center justify-center rounded-xl text-sm font-semibold"
              aria-label="Reprendre la partie"
              title="Reprendre la partie"
            >
              <IconLabel icon={RotateCcw} label="Reprendre" hideLabelOnMobile={false} />
            </button>
          ) : null}
        </div>
      </section>

      {/* Progression: light strip, no card */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-3 md:px-5 md:py-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <TrendingUp size={16} aria-hidden="true" />
          <span>
            {currentTitle} · Niveau {currentLevel} ({totalPoints.toLocaleString()} pts)
          </span>
        </div>
        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between text-xs text-subtle">
            <span>Vers niveau {currentLevel + 1}</span>
            <span>
              {pointsInCurrentLevel} / {pointsForNextLevel}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-strong)]">
            <div
              className="h-full w-full origin-left rounded-full bg-[var(--color-accent)] opacity-90 transition-[transform] duration-500 ease-out"
              style={{ transform: `scaleX(${progressPercentage / 100})` }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  )
}
