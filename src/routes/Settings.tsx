import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSettingsStore, themes } from '../store/settingsStore'

export function Settings() {
  const handedness = useSettingsStore((s) => s.handedness)
  const setHandedness = useSettingsStore((s) => s.setHandedness)
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled)
  const musicEnabled = useSettingsStore((s) => s.musicEnabled)
  const setMusicEnabled = useSettingsStore((s) => s.setMusicEnabled)
  const currentTheme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)

  const themeOptions = Object.values(themes)

  return (
    <div className="space-y-8">
      {/* Page header: no card */}
      <div>
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
          aria-label="Retour"
          title="Retour"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Retour</span>
        </Link>
        <h1 className="font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
          Configuration
        </h1>
      </div>

      {/* Contenu: single list row */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
        <Link
          to="/custom-categories"
          className="flex items-center justify-between gap-3 px-4 py-3 text-left text-secondary transition-colors hover:bg-white/5 active:bg-white/10 md:px-5 md:py-3.5"
          aria-label="Catégories personnalisées"
          title="Catégories personnalisées"
        >
          <div className="min-w-0">
            <p className="font-semibold">Catégories personnalisées</p>
            <p className="text-sm text-subtle">Ajoute tes propres catégories et mots</p>
          </div>
          <ChevronRight size={20} className="shrink-0 text-subtle" aria-hidden="true" />
        </Link>
      </div>

      {/* Mode de jeu: segmented control */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Mode de jeu</h2>
        <p className="mt-0.5 text-sm text-subtle">Position de la pioche</p>
        <div className="mt-3 flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-1">
          <button
            type="button"
            onClick={() => setHandedness('right')}
            className={[
              'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
              handedness === 'right'
                ? 'bg-[var(--color-accent)] text-black shadow-sm'
                : 'text-secondary hover:bg-white/5',
            ].join(' ')}
            aria-label="Mode droitier — Pioche à droite"
            title="Pioche à droite"
          >
            Droitier
          </button>
          <button
            type="button"
            onClick={() => setHandedness('left')}
            className={[
              'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
              handedness === 'left'
                ? 'bg-[var(--color-accent)] text-black shadow-sm'
                : 'text-secondary hover:bg-white/5',
            ].join(' ')}
            aria-label="Mode gaucher — Pioche à gauche"
            title="Pioche à gauche"
          >
            Gaucher
          </button>
        </div>
      </div>

      {/* Thème: horizontal scroll of chips */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Thème visuel</h2>
        <p className="mt-0.5 text-sm text-subtle">Apparence du tapis</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {themeOptions.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setTheme(theme.id)}
              className={[
                'flex shrink-0 flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors min-w-[100px]',
                currentTheme === theme.id
                  ? 'border-amber-400/50 bg-amber-400/15 text-amber-300'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-secondary hover:bg-white/5',
              ].join(' ')}
              aria-label={`Thème ${theme.name}`}
              title={theme.description}
            >
              <div
                className="h-10 w-14 rounded-lg border border-white/10"
                style={{
                  background: `linear-gradient(to bottom right, ${theme.feltBackground.from}, ${theme.feltBackground.to})`,
                }}
              />
              <span className="text-xs font-semibold leading-tight">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audio: compact list with two rows */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Audio</h2>
        <div className="mt-3 divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 active:bg-white/10 md:px-5"
            aria-label="Effets sonores"
            aria-pressed={soundEnabled}
            title="Effets sonores"
          >
            <div>
              <p className="font-semibold text-secondary">Effets sonores</p>
              <p className="text-xs text-subtle">Sons des actions de jeu</p>
            </div>
            <span
              className={[
                'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                soundEnabled ? 'bg-amber-400/20 text-amber-300' : 'bg-white/10 text-subtle',
              ].join(' ')}
            >
              {soundEnabled ? 'On' : 'Off'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMusicEnabled(!musicEnabled)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 active:bg-white/10 md:px-5"
            aria-label="Musique"
            aria-pressed={musicEnabled}
            title="Musique"
          >
            <div>
              <p className="font-semibold text-secondary">Musique</p>
              <p className="text-xs text-subtle">Musique de fond</p>
            </div>
            <span
              className={[
                'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                musicEnabled ? 'bg-amber-400/20 text-amber-300' : 'bg-white/10 text-subtle',
              ].join(' ')}
            >
              {musicEnabled ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
