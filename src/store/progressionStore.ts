import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Points per card completed (can be adjusted for balance)
export const POINTS_PER_CARD = 4

// Base points needed for level 1->2
export const BASE_POINTS_PER_LEVEL = 100

// Points increase per level (5% growth rate)
export const POINTS_GROWTH_RATE = 0.05

// Title definitions: every 10 levels gets a new title
export const TITLES = [
  { minLevel: 0, name: 'Débutant' },
  { minLevel: 10, name: 'Amateur' },
  { minLevel: 20, name: 'Confirmé' },
  { minLevel: 30, name: 'Expert' },
  { minLevel: 40, name: 'Super fort' },
  { minLevel: 50, name: 'Champion' },
  { minLevel: 60, name: 'Maître' },
  { minLevel: 70, name: 'Légende' },
  { minLevel: 80, name: 'Mythique' },
  { minLevel: 90, name: 'Divin' },
]

// Calculate points needed to reach a specific level from level 1
export function getPointsForLevel(level: number): number {
  if (level <= 1) return 0
  
  // Progressive XP: each level requires slightly more XP than the previous
  // Formula: BASE_POINTS_PER_LEVEL * (1 + POINTS_GROWTH_RATE) ^ (level - 2)
  // This creates a gentle exponential curve
  return Math.floor(BASE_POINTS_PER_LEVEL * Math.pow(1 + POINTS_GROWTH_RATE, level - 2))
}

export function getTitleForLevel(level: number): string {
  // Find the highest title the player qualifies for
  let title = TITLES[0].name
  for (const t of TITLES) {
    if (level >= t.minLevel) {
      title = t.name
    } else {
      break
    }
  }
  return title
}

export type ProgressionState = {
  totalPoints: number
  currentLevel: number
  pointsInCurrentLevel: number // Progress towards next level
}

export type LevelUpResult = {
  levelsGained: number
  newLevel: number
  newTitle: string | null // null if title didn't change
}

type ProgressionStore = ProgressionState & {
  awardPoints: (cardCount: number) => LevelUpResult
  reset: () => void
}

const initialState: ProgressionState = {
  totalPoints: 0,
  currentLevel: 1,
  pointsInCurrentLevel: 0,
}

export const useProgressionStore = create<ProgressionStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      awardPoints: (cardCount) => {
        const points = cardCount * POINTS_PER_CARD
        const state = get()

        const newTotalPoints = state.totalPoints + points
        let newPointsInLevel = state.pointsInCurrentLevel + points
        let newLevel = state.currentLevel
        let levelsGained = 0

        // Calculate level-ups with progressive XP requirements
        while (newLevel < 1000) { // Safety cap to prevent infinite loops
          const pointsNeededForNextLevel = getPointsForLevel(newLevel + 1)
          if (newPointsInLevel >= pointsNeededForNextLevel) {
            newPointsInLevel -= pointsNeededForNextLevel
            newLevel++
            levelsGained++
          } else {
            break
          }
        }

        const oldTitle = getTitleForLevel(state.currentLevel)
        const newTitle = getTitleForLevel(newLevel)
        const titleChanged = oldTitle !== newTitle

        set({
          totalPoints: newTotalPoints,
          currentLevel: newLevel,
          pointsInCurrentLevel: newPointsInLevel,
        })

        return {
          levelsGained,
          newLevel,
          newTitle: titleChanged ? newTitle : null,
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'solimots-progression-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
