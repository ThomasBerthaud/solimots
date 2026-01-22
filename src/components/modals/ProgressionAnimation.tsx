import { AnimatePresence, motion } from 'framer-motion'
import { Award, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

type ProgressionAnimationProps = {
  cardCount: number
  pointsEarned: number
  newLevel: number
  oldPoints: number
  newPoints: number
  levelsGained: number
  newTitle: string | null
  onComplete: () => void
  reduceMotion: boolean
}

export function ProgressionAnimation({
  cardCount,
  pointsEarned,
  newLevel,
  oldPoints,
  newPoints,
  levelsGained,
  newTitle,
  onComplete,
  reduceMotion,
}: ProgressionAnimationProps) {
  const [stage, setStage] = useState<'points' | 'levelup' | 'done'>('points')
  const [displayPoints, setDisplayPoints] = useState(oldPoints)

  useEffect(() => {
    // Stage 1: Animate points counting up
    const duration = reduceMotion ? 300 : 1000
    const steps = reduceMotion ? 10 : 30
    const increment = pointsEarned / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayPoints(newPoints)
        clearInterval(interval)
        // Move to level-up stage if there were level-ups
        setTimeout(() => {
          if (levelsGained > 0) {
            setStage('levelup')
          } else {
            setStage('done')
          }
        }, reduceMotion ? 200 : 400)
      } else {
        setDisplayPoints(oldPoints + Math.floor(increment * currentStep))
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [oldPoints, newPoints, pointsEarned, levelsGained, reduceMotion])

  useEffect(() => {
    if (stage === 'levelup') {
      // Show level-up for a moment then complete
      const timer = setTimeout(() => {
        setStage('done')
      }, reduceMotion ? 1500 : 2500)
      return () => clearTimeout(timer)
    }
  }, [stage, reduceMotion])

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {stage === 'points' && (
          <motion.div
            key="points"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <TrendingUp size={24} />
              <span className="text-2xl font-bold">+{pointsEarned} points</span>
            </div>
            <p className="text-center text-sm text-white/70">
              {cardCount} {cardCount === 1 ? 'carte rangée' : 'cartes rangées'}
            </p>
            <div className="mt-4 text-center">
              <div className="text-3xl font-bold text-white">{displayPoints.toLocaleString()}</div>
              <div className="text-xs text-white/50">Points totaux</div>
            </div>
          </motion.div>
        )}

        {(stage === 'levelup' || stage === 'done') && levelsGained > 0 && (
          <motion.div
            key="levelup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="space-y-4 text-center"
          >
            <motion.div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500"
              animate={reduceMotion || stage === 'done' ? {} : { rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Award size={40} className="text-white" />
            </motion.div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                {levelsGained > 1 ? `+${levelsGained} niveaux` : 'Niveau supérieur'}
              </p>
              <h3 className="mt-2 text-3xl font-bold text-white">Niveau {newLevel}</h3>
            </div>

            {newTitle && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3"
              >
                <div className="flex items-center justify-center gap-2 text-amber-300">
                  <Zap size={18} />
                  <span className="text-lg font-bold">{newTitle}</span>
                </div>
                <p className="mt-1 text-xs text-white/60">Nouveau titre débloqué !</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {stage === 'done' && levelsGained === 0 && (
          <motion.div
            key="final-points"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <TrendingUp size={24} />
              <span className="text-2xl font-bold">+{pointsEarned} points</span>
            </div>
            <p className="text-center text-sm text-white/70">
              {cardCount} {cardCount === 1 ? 'carte rangée' : 'cartes rangées'}
            </p>
            <div className="mt-4 text-center">
              <div className="text-3xl font-bold text-white">{displayPoints.toLocaleString()}</div>
              <div className="text-xs text-white/50">Points totaux</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === 'done' && (
        <motion.button
          type="button"
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-bold text-black shadow active:bg-amber-500"
          aria-label="Continuer"
        >
          Continuer
        </motion.button>
      )}
    </div>
  )
}
