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
    <div className="space-y-6">
      <section className="surface p-5">
        <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
          Associe les mots à la bonne catégorie.
        </h1>
        <p className="mt-2 text-muted">Déplace les cartes vers la bonne case.</p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {hasSavedGame ? (
            <button
              type="button"
              onClick={handleResume}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-300 shadow hover:bg-amber-400/20 hover:border-amber-400/60 active:bg-amber-400/15"
              aria-label="Reprendre la partie"
              title="Reprendre la partie"
            >
              <IconLabel icon={RotateCcw} label="Reprendre" hideLabelOnMobile={false} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={handlePlay}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-black shadow hover:bg-amber-300 active:bg-amber-500"
            aria-label="Jouer une partie"
            title="Jouer une partie"
          >
            <IconLabel icon={Play} label="Jouer" hideLabelOnMobile={false} />
          </button>
        </div>
      </section>

      {/* Progression: compact block, no hero-metric layout */}
      <section className="surface p-5">
        <div className="flex items-center gap-2 text-sm text-muted">
          <TrendingUp size={14} aria-hidden="true" />
          <span>
            {currentTitle} · Niveau {currentLevel} ({totalPoints.toLocaleString()} pts)
          </span>
        </div>
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-subtle">
            <span>Vers niveau {currentLevel + 1}</span>
            <span>
              {pointsInCurrentLevel} / {pointsForNextLevel}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-strong">
            <div
              className="h-full w-full origin-left rounded-full bg-amber-400/90 transition-[transform] duration-500 ease-out"
              style={{ transform: `scaleX(${progressPercentage / 100})` }}
              aria-hidden
            />
          </div>
        </div>
      </section>
    </div>
  )
}
