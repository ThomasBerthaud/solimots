import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Handedness = 'right' | 'left'

type SettingsStore = {
  handedness: Handedness
  soundEnabled: boolean
  musicEnabled: boolean
  setHandedness: (handedness: Handedness) => void
  setSoundEnabled: (enabled: boolean) => void
  setMusicEnabled: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      handedness: 'right',
      soundEnabled: true,
      musicEnabled: true,
      setHandedness: (handedness) => set({ handedness }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
    }),
    {
      name: 'solimots-settings-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
