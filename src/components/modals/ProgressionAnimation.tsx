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
  oldLevel,
  oldPointsInLevel,
}: ProgressionAnimationProps) {
  const [stage, setStage] = useState<'points' | 'levelup' | 'done'>('points')
  const [displayPoints, setDisplayPoints] = useState(oldPoints)
  const [progressWidth, setProgressWidth] = useState(0)
  const [currentLevelBeingAnimated, setCurrentLevelBeingAnimated] = useState(oldLevel)
  const [currentLevelProgress, setCurrentLevelProgress] = useState(oldPointsInLevel)
  const [levelsAnimatedSoFar, setLevelsAnimatedSoFar] = useState(0)
  const [fireworks, setFireworks] = useState<Array<{ id: number; x: number; y: number }>>([])
  const nextFireworkIdRef = useRef(0)
  const fireworksTriggeredRef = useRef(false)

  useEffect(() => {
    // Stage 1: Animate points counting up and progress bar
    // This effect handles animating one level at a time
    if (stage !== 'points') return

    const duration = reduceMotion ? 300 : 800
    const steps = reduceMotion ? 10 : 30
    let currentStep = 0

    // Calculate how many points to animate for this level
    const pointsNeededForCurrentLevel = getPointsForLevel(currentLevelBeingAnimated + 1)
    const startProgress = pointsNeededForCurrentLevel > 0 ? (currentLevelProgress / pointsNeededForCurrentLevel) * 100 : 0
    
    // Check if we will level up during this animation
    const willLevelUpThisRound = levelsAnimatedSoFar < levelsGained
    
    // Calculate how many points to add during this animation cycle
    // Capture the current displayPoints at the start of the animation
    const startDisplayPoints = displayPoints
    let pointsToAddThisLevel = newPoints - startDisplayPoints
    
    if (willLevelUpThisRound) {
      // We're filling the bar to 100% for this level
      pointsToAddThisLevel = pointsNeededForCurrentLevel - currentLevelProgress
    }
    
    const targetProgress = willLevelUpThisRound ? 100 : 
      (pointsNeededForCurrentLevel > 0 ? ((currentLevelProgress + pointsToAddThisLevel) / pointsNeededForCurrentLevel) * 100 : 0)

    setProgressWidth(startProgress)
    const progressIncrement = (targetProgress - startProgress) / steps
    const pointIncrement = pointsToAddThisLevel / steps

    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        // Animation for this level complete
        setDisplayPoints(startDisplayPoints + pointsToAddThisLevel)
        setProgressWidth(targetProgress)
        clearInterval(interval)
        
        setTimeout(() => {
          if (willLevelUpThisRound) {
            // We just completed a level, move to next one
            const nextLevel = currentLevelBeingAnimated + 1
            const pointsOverflow = currentLevelProgress + pointsToAddThisLevel - pointsNeededForCurrentLevel
            const newLevelsAnimated = levelsAnimatedSoFar + 1
            
            setCurrentLevelBeingAnimated(nextLevel)
            setCurrentLevelProgress(pointsOverflow)
            setLevelsAnimatedSoFar(newLevelsAnimated)
            setProgressWidth(0) // Reset progress bar for next level
            
            // If there are more levels to animate, stay in 'points' stage
            // Otherwise, move to 'levelup' stage to show the celebration
            if (newLevelsAnimated >= levelsGained) {
              setStage('levelup')
            }
          } else {
            // No more level-ups, we're done with points animation
            setStage(levelsGained > 0 ? 'levelup' : 'done')
          }
        }, reduceMotion ? 100 : 300)
      } else {
        setDisplayPoints(startDisplayPoints + Math.floor(pointIncrement * currentStep))
        setProgressWidth(startProgress + progressIncrement * currentStep)
      }
    }, duration / steps)

    return () => clearInterval(interval)
    // Note: displayPoints is intentionally NOT in dependencies - we capture startDisplayPoints
    // at the beginning of each animation cycle and don't want changes to displayPoints during
    // the interval to trigger a new effect run. The effect correctly re-runs when stage changes
    // back to 'points' after each level animation completes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, currentLevelBeingAnimated, currentLevelProgress, levelsAnimatedSoFar, levelsGained, reduceMotion, newPoints])

  useEffect(() => {
    if (stage === 'levelup' && !fireworksTriggeredRef.current) {
      fireworksTriggeredRef.current = true
      
      // Trigger fireworks when level-up is shown
      if (!reduceMotion) {
        const fireworkPositions = [
          { x: 20, y: 20 },
          { x: 80, y: 30 },
          { x: 50, y: 15 },
          { x: 35, y: 40 },
          { x: 65, y: 25 },
        ]
        
        fireworkPositions.forEach((pos, index) => {
          setTimeout(() => {
            const id = nextFireworkIdRef.current++
            setFireworks(prev => [...prev, { id, x: pos.x, y: pos.y }])
            
            // Remove firework after animation
            setTimeout(() => {
              setFireworks(prev => prev.filter(f => f.id !== id))
            }, 1000)
          }, index * 150)
        })
      }
      
      // Show level-up for a moment then complete
      const timer = setTimeout(() => {
        setStage('done')
      }, reduceMotion ? 1500 : 2500)
      return () => clearTimeout(timer)
    }
  }, [stage, reduceMotion])

  return (
    <div className="space-y-4 relative">
      {/* Fireworks container */}
      {fireworks.map(firework => (
        <Firework key={firework.id} id={firework.id} x={firework.x} y={firework.y} />
      ))}
      
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
            
            {/* Progress bar */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Niveau {currentLevelBeingAnimated}</span>
                <span>Niveau {currentLevelBeingAnimated + 1}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                  style={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>
            
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

// Firework component for celebratory effect
function Firework({ x, y, id }: { x: number; y: number; id: number }) {
  // Generate deterministic "random" values based on id to avoid impure Math.random in render
  const particleData = useMemo(() => {
    // Simple seeded pseudo-random number generator
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }
    
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2
      const seed = id * 100 + i
      const distance = 40 + seededRandom(seed) * 20
      const dx = Math.cos(angle) * distance
      const dy = Math.sin(angle) * distance
      const delay = seededRandom(seed + 1) * 0.1
      const hue = 45 + seededRandom(seed + 2) * 30
      const lightness = 50 + seededRandom(seed + 3) * 20
      const duration = 0.8 + seededRandom(seed + 4) * 0.4
      
      return { i, dx, dy, delay, hue, lightness, duration }
    })
  }, [id])
  
  return (
    <div 
      className="absolute pointer-events-none z-50"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {particleData.map(({ i, dx, dy, delay, hue, lightness, duration }) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `hsl(${hue}, 100%, ${lightness}%)`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: dx,
            y: dy,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration,
            delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
