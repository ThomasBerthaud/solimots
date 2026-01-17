import { useEffect } from 'react'
import { themes } from '../store/settingsStore'
import { useSettingsStore } from '../store/settingsStore'

export function useTheme() {
  const themeId = useSettingsStore((s) => s.theme)
  const theme = themes[themeId]

  useEffect(() => {
    if (!theme) return

    // Apply theme to document root for background gradient
    const root = document.documentElement
    root.style.setProperty('--theme-bg-from', theme.backgroundGradient.from)
    root.style.setProperty('--theme-bg-via', theme.backgroundGradient.via || theme.backgroundGradient.from)
    root.style.setProperty('--theme-bg-to', theme.backgroundGradient.to)

    // Apply theme for felt background
    root.style.setProperty('--theme-felt-from', theme.feltBackground.from)
    root.style.setProperty('--theme-felt-to', theme.feltBackground.to)
  }, [theme])

  return theme
}
