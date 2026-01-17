import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Handedness = 'right' | 'left'

export type ThemeId = 'classic' | 'ocean' | 'forest' | 'sunset' | 'night' | 'royal'

export type Theme = {
  id: ThemeId
  name: string
  description: string
  backgroundGradient: {
    from: string
    via?: string
    to: string
  }
  feltBackground: {
    from: string
    to: string
  }
  cardBack: {
    gradient: string
    image?: string
  }
}

export const themes: Record<ThemeId, Theme> = {
  classic: {
    id: 'classic',
    name: 'Classique',
    description: 'Vert émeraude traditionnel',
    backgroundGradient: {
      from: 'hsl(150 38% 16%)',
      to: 'hsl(150 45% 9%)',
    },
    feltBackground: {
      from: 'rgba(16, 185, 129, 0.35)',
      to: 'rgba(6, 78, 59, 0.35)',
    },
    cardBack: {
      gradient: 'from-sky-600 via-indigo-600 to-emerald-600',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Océan',
    description: 'Bleu profond apaisant',
    backgroundGradient: {
      from: 'hsl(210 45% 16%)',
      to: 'hsl(220 50% 8%)',
    },
    feltBackground: {
      from: 'rgba(59, 130, 246, 0.35)',
      to: 'rgba(29, 78, 216, 0.35)',
    },
    cardBack: {
      gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forêt',
    description: 'Vert sapin naturel',
    backgroundGradient: {
      from: 'hsl(140 40% 14%)',
      to: 'hsl(150 45% 7%)',
    },
    feltBackground: {
      from: 'rgba(34, 197, 94, 0.35)',
      to: 'rgba(21, 128, 61, 0.35)',
    },
    cardBack: {
      gradient: 'from-green-600 via-emerald-600 to-teal-700',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Coucher de soleil',
    description: 'Orange et rose chaleureux',
    backgroundGradient: {
      from: 'hsl(25 45% 16%)',
      to: 'hsl(340 40% 10%)',
    },
    feltBackground: {
      from: 'rgba(251, 146, 60, 0.35)',
      to: 'rgba(225, 29, 72, 0.35)',
    },
    cardBack: {
      gradient: 'from-orange-500 via-pink-600 to-rose-700',
    },
  },
  night: {
    id: 'night',
    name: 'Nuit étoilée',
    description: 'Violet nocturne mystérieux',
    backgroundGradient: {
      from: 'hsl(260 40% 12%)',
      to: 'hsl(270 45% 6%)',
    },
    feltBackground: {
      from: 'rgba(139, 92, 246, 0.35)',
      to: 'rgba(88, 28, 135, 0.35)',
    },
    cardBack: {
      gradient: 'from-violet-600 via-purple-600 to-fuchsia-700',
    },
  },
  royal: {
    id: 'royal',
    name: 'Royal',
    description: 'Pourpre et or élégant',
    backgroundGradient: {
      from: 'hsl(280 45% 14%)',
      to: 'hsl(260 50% 8%)',
    },
    feltBackground: {
      from: 'rgba(168, 85, 247, 0.35)',
      to: 'rgba(126, 34, 206, 0.35)',
    },
    cardBack: {
      gradient: 'from-purple-600 via-violet-700 to-indigo-800',
    },
  },
}

type SettingsStore = {
  handedness: Handedness
  soundEnabled: boolean
  musicEnabled: boolean
  theme: ThemeId
  setHandedness: (handedness: Handedness) => void
  setSoundEnabled: (enabled: boolean) => void
  setMusicEnabled: (enabled: boolean) => void
  setTheme: (theme: ThemeId) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      handedness: 'right',
      soundEnabled: true,
      musicEnabled: true,
      theme: 'classic',
      setHandedness: (handedness) => set({ handedness }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'solimots-settings-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
