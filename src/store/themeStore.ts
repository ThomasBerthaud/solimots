import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Theme = {
  id: string
  name: string
  background: {
    gradient: string
    feltGradient: string
  }
  cards: {
    category: {
      gradient: string
      border: string
      text: string
      ring: string
    }
    word: {
      background: string
      border: string
      text: string
      ring: string
    }
    back: {
      gradient: string
    }
  }
  watermark?: {
    pattern: string
    opacity: number
  }
}

export const themes: Record<string, Theme> = {
  default: {
    id: 'default',
    name: 'Classique',
    background: {
      gradient: 'radial-gradient(1200px 600px at 30% 0%, hsl(150 38% 16%), hsl(150 45% 9%))',
      feltGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35), rgba(6, 78, 59, 0.35))',
    },
    cards: {
      category: {
        gradient: 'linear-gradient(135deg, rgba(253, 230, 138, 0.92), rgba(251, 191, 36, 0.80))',
        border: 'rgb(254 240 138 / 0.6)',
        text: 'rgb(69 26 3)',
        ring: 'rgb(254 240 138 / 0.9)',
      },
      word: {
        background: 'rgb(255 255 255)',
        border: 'rgb(0 0 0 / 0.05)',
        text: 'rgb(15 23 42)',
        ring: 'rgb(255 255 255 / 0.8)',
      },
      back: {
        gradient: 'linear-gradient(135deg, rgb(2, 132, 199), rgb(79, 70, 229), rgb(5, 150, 105))',
      },
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Océan',
    background: {
      gradient: 'radial-gradient(1200px 600px at 30% 0%, hsl(200 45% 18%), hsl(210 50% 8%))',
      feltGradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.35), rgba(3, 105, 161, 0.35))',
    },
    cards: {
      category: {
        gradient: 'linear-gradient(135deg, rgba(186, 230, 253, 0.92), rgba(56, 189, 248, 0.85))',
        border: 'rgb(186 230 253 / 0.6)',
        text: 'rgb(7 89 133)',
        ring: 'rgb(186 230 253 / 0.9)',
      },
      word: {
        background: 'rgb(240 249 255)',
        border: 'rgb(14 165 233 / 0.15)',
        text: 'rgb(7 89 133)',
        ring: 'rgb(186 230 253 / 0.8)',
      },
      back: {
        gradient: 'linear-gradient(135deg, rgb(14, 165, 233), rgb(59, 130, 246), rgb(6, 182, 212))',
      },
    },
    watermark: {
      pattern: '🌊',
      opacity: 0.08,
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Coucher de soleil',
    background: {
      gradient: 'radial-gradient(1200px 600px at 30% 0%, hsl(340 45% 18%), hsl(280 40% 10%))',
      feltGradient: 'linear-gradient(135deg, rgba(244, 114, 182, 0.35), rgba(139, 92, 246, 0.35))',
    },
    cards: {
      category: {
        gradient: 'linear-gradient(135deg, rgba(254, 205, 211, 0.92), rgba(251, 113, 133, 0.85))',
        border: 'rgb(254 205 211 / 0.6)',
        text: 'rgb(136 19 55)',
        ring: 'rgb(254 205 211 / 0.9)',
      },
      word: {
        background: 'rgb(255 241 242)',
        border: 'rgb(244 114 182 / 0.15)',
        text: 'rgb(136 19 55)',
        ring: 'rgb(254 205 211 / 0.8)',
      },
      back: {
        gradient: 'linear-gradient(135deg, rgb(244, 114, 182), rgb(168, 85, 247), rgb(251, 113, 133))',
      },
    },
    watermark: {
      pattern: '🌅',
      opacity: 0.08,
    },
  },
  forest: {
    id: 'forest',
    name: 'Forêt',
    background: {
      gradient: 'radial-gradient(1200px 600px at 30% 0%, hsl(140 35% 20%), hsl(145 40% 10%))',
      feltGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.35), rgba(21, 128, 61, 0.35))',
    },
    cards: {
      category: {
        gradient: 'linear-gradient(135deg, rgba(187, 247, 208, 0.92), rgba(74, 222, 128, 0.85))',
        border: 'rgb(187 247 208 / 0.6)',
        text: 'rgb(20 83 45)',
        ring: 'rgb(187 247 208 / 0.9)',
      },
      word: {
        background: 'rgb(240 253 244)',
        border: 'rgb(34 197 94 / 0.15)',
        text: 'rgb(20 83 45)',
        ring: 'rgb(187 247 208 / 0.8)',
      },
      back: {
        gradient: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74), rgb(21, 128, 61))',
      },
    },
    watermark: {
      pattern: '🌲',
      opacity: 0.08,
    },
  },
  lavender: {
    id: 'lavender',
    name: 'Lavande',
    background: {
      gradient: 'radial-gradient(1200px 600px at 30% 0%, hsl(260 40% 20%), hsl(270 45% 10%))',
      feltGradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.35), rgba(109, 40, 217, 0.35))',
    },
    cards: {
      category: {
        gradient: 'linear-gradient(135deg, rgba(221, 214, 254, 0.92), rgba(167, 139, 250, 0.85))',
        border: 'rgb(221 214 254 / 0.6)',
        text: 'rgb(76 29 149)',
        ring: 'rgb(221 214 254 / 0.9)',
      },
      word: {
        background: 'rgb(250 245 255)',
        border: 'rgb(167 139 250 / 0.15)',
        text: 'rgb(76 29 149)',
        ring: 'rgb(221 214 254 / 0.8)',
      },
      back: {
        gradient: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(139, 92, 246), rgb(109, 40, 217))',
      },
    },
    watermark: {
      pattern: '💜',
      opacity: 0.08,
    },
  },
  autumn: {
    id: 'autumn',
    name: 'Automne',
    background: {
      gradient: 'radial-gradient(1200px 600px at 30% 0%, hsl(25 45% 18%), hsl(15 50% 10%))',
      feltGradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.35), rgba(194, 65, 12, 0.35))',
    },
    cards: {
      category: {
        gradient: 'linear-gradient(135deg, rgba(254, 215, 170, 0.92), rgba(251, 146, 60, 0.85))',
        border: 'rgb(254 215 170 / 0.6)',
        text: 'rgb(124 45 18)',
        ring: 'rgb(254 215 170 / 0.9)',
      },
      word: {
        background: 'rgb(255 247 237)',
        border: 'rgb(251 146 60 / 0.15)',
        text: 'rgb(124 45 18)',
        ring: 'rgb(254 215 170 / 0.8)',
      },
      back: {
        gradient: 'linear-gradient(135deg, rgb(251, 146, 60), rgb(234, 88, 12), rgb(194, 65, 12))',
      },
    },
    watermark: {
      pattern: '🍂',
      opacity: 0.08,
    },
  },
}

type ThemeStore = {
  currentTheme: string
  setTheme: (themeId: string) => void
  getTheme: () => Theme
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: 'default',
      setTheme: (themeId: string) => {
        if (themes[themeId]) {
          set({ currentTheme: themeId })
        }
      },
      getTheme: () => themes[get().currentTheme] ?? themes.default,
    }),
    {
      name: 'solimots-theme-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
