import { GraduationCap, Play, RotateCcw, Settings, TrendingUp } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
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
  const pointsToNextLevel = pointsForNextLevel - pointsInCurrentLevel
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
      <section className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <p className="text-sm uppercase tracking-wider text-white/70">Solitaire d'associations</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight md:text-3xl">
          Associe les mots à la bonne catégorie.
        </h1>
        <p className="mt-2 text-white/75">Un feeling "solitaire", mais avec des mots. Déplace, teste, progresse.</p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {hasSavedGame ? (
            <button
              type="button"
              onClick={handleResume}
              className="inline-flex items-center justify-center rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-300 shadow hover:bg-amber-400/20 hover:border-amber-400/60 active:bg-amber-400/15"
              aria-label="Reprendre la partie"
              title="Reprendre la partie"
            >
              <IconLabel icon={RotateCcw} label="Reprendre la partie" hideLabelOnMobile={false} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={handlePlay}
            className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-black shadow hover:bg-amber-300 active:bg-amber-500"
            aria-label="Jouer une partie"
            title="Jouer une partie"
          >
            <IconLabel icon={Play} label="Jouer une partie" hideLabelOnMobile={false} />
          </button>
          <Link
            to="/tutorial"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 active:bg-white/15"
            aria-label="Mini tutoriel"
            title="Mini tutoriel"
          >
            <IconLabel icon={GraduationCap} label="Mini tutoriel" hideLabelOnMobile={false} />
          </Link>
          <Link
            to="/settings"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 active:bg-white/15"
            aria-label="Configuration"
            title="Configuration"
          >
            <IconLabel icon={Settings} label="Configuration" hideLabelOnMobile={false} />
          </Link>
        </div>
      </section>

      {/* Progression Section */}
      <section className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-orange-500/10 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400/90">
              <TrendingUp size={14} aria-hidden="true" />
              <span>Progression</span>
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              {currentTitle} • Niveau {currentLevel}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-400">{totalPoints.toLocaleString()}</p>
            <p className="text-xs text-white/60">Points totaux</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-white/70">
            <span>Niveau {currentLevel + 1}</span>
            <span>{pointsToNextLevel} points restants</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-center text-xs text-white/60">
            {pointsInCurrentLevel} / {pointsForNextLevel} points
          </div>
        </div>
      </section>
    </div>
  )
}
