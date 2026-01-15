import { useEffect } from 'react'
import { useThemeStore } from '../../store/themeStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.getTheme())

  useEffect(() => {
    const root = document.documentElement

    // Apply theme CSS variables
    root.style.setProperty('--theme-bg-gradient', theme.background.gradient)
    root.style.setProperty('--theme-felt-gradient', theme.background.feltGradient)
    root.style.setProperty('--theme-card-category-gradient', theme.cards.category.gradient)
    root.style.setProperty('--theme-card-category-border', theme.cards.category.border)
    root.style.setProperty('--theme-card-category-text', theme.cards.category.text)
    root.style.setProperty('--theme-card-category-ring', theme.cards.category.ring)
    root.style.setProperty('--theme-card-word-bg', theme.cards.word.background)
    root.style.setProperty('--theme-card-word-border', theme.cards.word.border)
    root.style.setProperty('--theme-card-word-text', theme.cards.word.text)
    root.style.setProperty('--theme-card-word-ring', theme.cards.word.ring)
    root.style.setProperty('--theme-card-back-gradient', theme.cards.back.gradient)

    // Update body background immediately
    document.body.style.background = theme.background.gradient
  }, [theme])

  return <>{children}</>
}
