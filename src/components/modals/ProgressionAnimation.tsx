import { AnimatePresence, motion } from 'framer-motion'
import { Award, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getPointsForLevel } from '../../store/progressionStore'

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
  oldLevel,
  oldPointsInLevel,
}: ProgressionAnimationProps) {
  const [fireworks, setFireworks] = useState<Array<{ id: number; x: number; y: number }>>([])
  const nextFireworkIdRef = useRef(0)
  const triggeredRef = useRef(false)
  const fireworkTimeoutIdsRef = useRef<number[]>([])

  // Fireworks when level-up; then reveal Continue button after a short delay
  useEffect(() => {
    const clearFireworkTimeouts = (): void => {
      fireworkTimeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
      fireworkTimeoutIdsRef.current = []
    }

    if (triggeredRef.current) {
      return clearFireworkTimeouts
    }
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
        const outerId = window.setTimeout(() => {
          const id = nextFireworkIdRef.current++
          setFireworks((prev) => [...prev, { id, x: pos.x, y: pos.y }])
          const innerId = window.setTimeout(
            () => setFireworks((prev) => prev.filter((f) => f.id !== id)),
            1000,
          )
          fireworkTimeoutIdsRef.current = [...fireworkTimeoutIdsRef.current, innerId]
        }, index * 150)
        fireworkTimeoutIdsRef.current = [...fireworkTimeoutIdsRef.current, outerId]
      })
    }

    return clearFireworkTimeouts
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

          <XPBar
            oldLevel={oldLevel}
            oldPointsInLevel={oldPointsInLevel}
            newLevel={newLevel}
            pointsEarned={pointsEarned}
            reduceMotion={reduceMotion}
          />

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
              <>
                {' '}
                · {cardCount} {cardCount === 1 ? 'carte rangée' : 'cartes rangées'}
              </>
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
          <XPBar
            oldLevel={oldLevel}
            oldPointsInLevel={oldPointsInLevel}
            newLevel={newLevel}
            pointsEarned={pointsEarned}
            reduceMotion={reduceMotion}
          />
          <p className="text-base text-muted">
            {cardCount} {cardCount === 1 ? 'carte rangée' : 'cartes rangées'}
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        <motion.button
          type="button"
          data-ui-control="true"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut', delay: reduceMotion ? 0 : 0.15 }}
          onClick={onComplete}
          className="mt-4 min-h-[44px] w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-base font-bold text-black shadow-[0_4px_20px_rgba(251,191,36,0.35)] active:bg-amber-600"
          aria-label="Continuer"
        >
          Continuer
        </motion.button>
      </AnimatePresence>
    </div>
  )
}

type XPAnimationStep = {
  fromLevel: number
  toLevel: number
  maxPoints: number
  startPoints: number
  endPoints: number
  levelUp: boolean
}

type XPBarProps = {
  oldLevel: number
  oldPointsInLevel: number
  newLevel: number
  pointsEarned: number
  reduceMotion: boolean
}

type XPViewState = {
  level: number
  points: number
}

function buildXPAnimationSteps(
  level: number,
  pointsInLevel: number,
  remainingPoints: number,
  acc: XPAnimationStep[] = [],
): XPAnimationStep[] {
  if (remainingPoints <= 0) return acc

  const maxPoints = getPointsForLevel(level + 1)
  const availableSpace = Math.max(0, maxPoints - pointsInLevel)
  const earnedForStep = Math.min(remainingPoints, availableSpace)
  const endPoints = pointsInLevel + earnedForStep
  const levelUp = endPoints >= maxPoints
  const step: XPAnimationStep = {
    fromLevel: level,
    toLevel: levelUp ? level + 1 : level,
    maxPoints,
    startPoints: pointsInLevel,
    endPoints: levelUp ? maxPoints : endPoints,
    levelUp,
  }

  if (!levelUp) return [...acc, step]

  return buildXPAnimationSteps(level + 1, 0, remainingPoints - earnedForStep, [...acc, step])
}

function computeFinalXPState(level: number, pointsInLevel: number, remainingPoints: number): XPViewState {
  if (remainingPoints <= 0) {
    return { level, points: pointsInLevel }
  }

  const maxPoints = getPointsForLevel(level + 1)
  const availableSpace = Math.max(0, maxPoints - pointsInLevel)
  const earnedNow = Math.min(remainingPoints, availableSpace)
  const nextPoints = pointsInLevel + earnedNow

  if (nextPoints < maxPoints) {
    return { level, points: nextPoints }
  }

  return computeFinalXPState(level + 1, 0, remainingPoints - earnedNow)
}

function XPBar({ oldLevel, oldPointsInLevel, newLevel, pointsEarned, reduceMotion }: XPBarProps) {
  const steps = useMemo(
    () => buildXPAnimationSteps(oldLevel, oldPointsInLevel, pointsEarned),
    [oldLevel, oldPointsInLevel, pointsEarned],
  )

  const finalState = useMemo(
    () => computeFinalXPState(oldLevel, oldPointsInLevel, pointsEarned),
    [oldLevel, oldPointsInLevel, pointsEarned],
  )

  const [displayLevel, setDisplayLevel] = useState(oldLevel)
  const [displayPoints, setDisplayPoints] = useState(oldPointsInLevel)
  const [displayMax, setDisplayMax] = useState(Math.max(1, getPointsForLevel(oldLevel + 1)))
  const [phase, setPhase] = useState<'idle' | 'filling' | 'flash' | 'reset' | 'done'>('idle')
  const timeoutIdsRef = useRef<number[]>([])
  const animationFrameIdsRef = useRef<number[]>([])

  useEffect(() => {
    const clearScheduledEffects = (): void => {
      timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
      timeoutIdsRef.current = []
      animationFrameIdsRef.current.forEach((animationFrameId) => window.cancelAnimationFrame(animationFrameId))
      animationFrameIdsRef.current = []
    }

    clearScheduledEffects()

    if (reduceMotion || steps.length === 0) {
      const frameId = window.requestAnimationFrame(() => {
        setDisplayLevel(finalState.level)
        setDisplayPoints(finalState.points)
        setDisplayMax(Math.max(1, getPointsForLevel(finalState.level + 1)))
        setPhase('done')
      })
      animationFrameIdsRef.current = [...animationFrameIdsRef.current, frameId]
      return () => {
        clearScheduledEffects()
      }
    }

    const schedule = (callback: () => void, delay: number): void => {
      const timeoutId = window.setTimeout(callback, delay)
      timeoutIdsRef.current = [...timeoutIdsRef.current, timeoutId]
    }

    const runStep = (index: number): void => {
      const step = steps[index]
      if (!step) {
        setDisplayLevel(finalState.level)
        setDisplayPoints(finalState.points)
        setDisplayMax(Math.max(1, getPointsForLevel(finalState.level + 1)))
        setPhase('done')
        return
      }

      setDisplayLevel(step.fromLevel)
      setDisplayMax(Math.max(1, step.maxPoints))
      setDisplayPoints(step.startPoints)
      setPhase('filling')

      const frameId = window.requestAnimationFrame(() => {
        setDisplayPoints(step.endPoints)
      })
      animationFrameIdsRef.current = [...animationFrameIdsRef.current, frameId]

      // Delay must exceed modal `.progress-track--modal .progress-fill` transition (~1.3s)
      schedule(() => {
        if (!step.levelUp) {
          setPhase('done')
          return
        }

        setPhase('flash')
        schedule(() => {
          setPhase('reset')
          setDisplayLevel(step.toLevel)
          setDisplayMax(Math.max(1, getPointsForLevel(step.toLevel + 1)))
          setDisplayPoints(0)

          // Delay must exceed modal `.progress-track--modal .progress-fill` reset transition (~1.3s)
          schedule(() => {
            runStep(index + 1)
          }, 1400)
        }, 450)
      }, 1450)
    }

    runStep(0)

    return () => {
      clearScheduledEffects()
    }
  }, [steps, reduceMotion, finalState.level, finalState.points])

  const safeMax = Math.max(1, displayMax)
  const progressRatio = Math.min(1, Math.max(0, displayPoints / safeMax))
  const isAnimating = phase === 'filling'
  const isFlashing = phase === 'flash'
  const isComplete = displayPoints >= safeMax
  const levelLabel = newLevel > displayLevel ? `Niveau ${displayLevel} → ${newLevel}` : `Niveau ${displayLevel}`

  return (
    <motion.div
      className="space-y-1.5 text-left"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0, scale: isFlashing && !reduceMotion ? [1, 1.02, 1] : 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mb-1 flex items-center justify-between text-xs font-semibold">
        <span className="text-[var(--color-accent)]">{levelLabel}</span>
        <span className="tabular-nums text-subtle">
          {displayPoints} / {safeMax}
        </span>
      </div>
      <div
        className="progress-track progress-track--modal"
        role="progressbar"
        aria-valuenow={displayPoints}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={`Progression niveau ${displayLevel} : ${displayPoints} sur ${safeMax} points`}
      >
        <div
          className={[
            'progress-fill',
            isComplete ? 'progress-fill--complete' : '',
            isAnimating ? 'progress-fill--animating' : '',
            isFlashing ? 'progress-fill--flash' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ transform: `scaleX(${progressRatio})` }}
          aria-hidden
        />
      </div>
    </motion.div>
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
    <div className="absolute pointer-events-none z-50" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden>
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
