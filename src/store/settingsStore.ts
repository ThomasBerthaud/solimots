import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Handedness = 'right' | 'left'

type SettingsStore = {
  handedness: Handedness
  setHandedness: (handedness: Handedness) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      handedness: 'right',
      setHandedness: (handedness) => set({ handedness }),
    }),
    {
      name: 'solimots-settings-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
