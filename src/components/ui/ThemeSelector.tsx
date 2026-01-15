import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { themes, useThemeStore } from '../../store/themeStore'

export function ThemeSelector() {
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const setTheme = useThemeStore((s) => s.setTheme)

  const themeList = Object.values(themes)

  return (
    <section className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Thème visuel</h2>
      <p className="mt-1 text-sm text-white/75">Personnalise l'apparence du jeu</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {themeList.map((theme) => {
          const isSelected = currentTheme === theme.id
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setTheme(theme.id)}
              className={[
                'group relative overflow-hidden rounded-xl border p-3 text-left transition',
                isSelected
                  ? 'border-amber-400/60 bg-amber-400/10'
                  : 'border-white/10 bg-black/10 hover:border-white/20 hover:bg-black/20',
              ].join(' ')}
              aria-label={`Sélectionner le thème ${theme.name}`}
            >
              <div className="relative z-10">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{theme.name}</span>
                  {isSelected ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-black"
                    >
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                    </motion.div>
                  ) : null}
                </div>
                <div className="flex gap-1.5">
                  <div
                    className="h-6 w-6 rounded border border-white/20 shadow-sm"
                    style={{ background: theme.cards.category.gradient }}
                    aria-hidden="true"
                  />
                  <div
                    className="h-6 w-6 rounded border border-black/10 shadow-sm"
                    style={{ background: theme.cards.word.background }}
                    aria-hidden="true"
                  />
                  <div
                    className="h-6 w-6 rounded border border-white/20 shadow-sm"
                    style={{ background: theme.cards.back.gradient }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {theme.watermark ? (
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center text-4xl"
                  style={{ opacity: theme.watermark.opacity * 2 }} // Double opacity for better visibility in small preview
                  aria-hidden="true"
                >
                  {theme.watermark.pattern}
                </div>
              ) : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}
