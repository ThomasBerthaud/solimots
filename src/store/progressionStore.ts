import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Points per card completed (can be adjusted for balance)
export const POINTS_PER_CARD = 10

// Points needed for each level (simple linear progression)
export const POINTS_PER_LEVEL = 100

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

        // Calculate level-ups
        while (newPointsInLevel >= POINTS_PER_LEVEL) {
          newPointsInLevel -= POINTS_PER_LEVEL
          newLevel++
          levelsGained++
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
