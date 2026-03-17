import { AnimatePresence, motion } from 'framer-motion'
import { Award, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

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
  oldLevel: number
  oldPointsInLevel: number
}

// Reward-focused: celebration (level-up, title) + short points line, no dashboard.
export function ProgressionAnimation({
  cardCount,
  pointsEarned,
  newLevel,
  levelsGained,
  newTitle,
  onComplete,
  reduceMotion,
}: ProgressionAnimationProps) {
  const [showButton, setShowButton] = useState(false)
  const [fireworks, setFireworks] = useState<Array<{ id: number; x: number; y: number }>>([])
  const nextFireworkIdRef = useRef(0)
  const triggeredRef = useRef(false)

  // Fireworks when level-up; then reveal Continue button after a short delay
  useEffect(() => {
    if (triggeredRef.current) return
    triggeredRef.current = true

    if (levelsGained > 0 && !reduceMotion) {
      const positions = [
        { x: 20, y: 20 },
        { x: 80, y: 30 },
        { x: 50, y: 15 },
        { x: 35, y: 40 },
        { x: 65, y: 25 },
      ]
      positions.forEach((pos, index) => {
        setTimeout(() => {
          const id = nextFireworkIdRef.current++
          setFireworks((prev) => [...prev, { id, x: pos.x, y: pos.y }])
          setTimeout(() => setFireworks((prev) => prev.filter((f) => f.id !== id)), 1000)
        }, index * 150)
      })
    }

    const delay = reduceMotion ? 800 : 1800
    const t = setTimeout(() => setShowButton(true), delay)
    return () => clearTimeout(t)
  }, [levelsGained, reduceMotion])

  return (
    <div className="relative space-y-4">
      {fireworks.map((f) => (
        <Firework key={f.id} id={f.id} x={f.x} y={f.y} />
      ))}

      {levelsGained > 0 ? (
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <motion.div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent)] shadow-[0_4px_24px_rgba(251,191,36,0.4)]"
            animate={reduceMotion ? {} : { rotate: [0, 5, -5, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            <Award size={40} className="text-black" aria-hidden />
          </motion.div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
              {levelsGained > 1 ? `+${levelsGained} niveaux` : 'Niveau supérieur'}
            </p>
            <h3 className="mt-2 text-3xl font-bold text-primary">Niveau {newLevel}</h3>
          </div>

          {newTitle ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3"
            >
              <div className="flex items-center justify-center gap-2 text-amber-300">
                <Zap size={18} aria-hidden />
                <span className="text-lg font-bold">{newTitle}</span>
              </div>
              <p className="mt-1 text-sm text-muted">Nouveau titre débloqué !</p>
            </motion.div>
          ) : null}

          <p className="text-base text-muted">
            +{pointsEarned} points
            {cardCount > 0 && (
              <> · {cardCount} {cardCount === 1 ? 'carte rangée' : 'cartes rangées'}</>
            )}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <TrendingUp size={24} aria-hidden />
            <span className="text-2xl font-bold">+{pointsEarned} points</span>
          </div>
          <p className="text-base text-muted">
            {cardCount} {cardCount === 1 ? 'carte rangée' : 'cartes rangées'}
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {showButton && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onComplete}
            className="mt-4 min-h-[44px] w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-base font-bold text-black shadow-[0_4px_20px_rgba(251,191,36,0.35)] active:bg-amber-600"
            aria-label="Continuer"
          >
            Continuer
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function Firework({ x, y, id }: { x: number; y: number; id: number }) {
  const particleData = useMemo(() => {
    const seededRandom = (seed: number) => {
      const v = Math.sin(seed) * 10000
      return v - Math.floor(v)
    }
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2
      const seed = id * 100 + i
      const distance = 40 + seededRandom(seed) * 20
      return {
        i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        delay: seededRandom(seed + 1) * 0.1,
        hue: 45 + seededRandom(seed + 2) * 30,
        lightness: 50 + seededRandom(seed + 3) * 20,
        duration: 0.8 + seededRandom(seed + 4) * 0.4,
      }
    })
  }, [id])

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-hidden
    >
      {particleData.map(({ i, dx, dy, delay, hue, lightness, duration }) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{ background: `hsl(${hue}, 100%, ${lightness}%)` }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: dx, y: dy, opacity: 0, scale: 0 }}
          transition={{ duration, delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
