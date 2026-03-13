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
    <div className="space-y-6">
      <section className="surface p-5">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
          aria-label="Retour"
          title="Retour"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Retour</span>
        </Link>
        <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Configuration</h1>
        <p className="mt-2 text-muted">Personnalise ton expérience de jeu.</p>
      </section>

      <section className="surface-subtle p-5">
        <h2 className="text-lg font-semibold">Contenu du jeu</h2>
        <p className="mt-1 text-sm text-muted">Personnalise les catégories et mots utilisés dans le jeu.</p>

        <div className="mt-4">
          <Link
            to="/custom-categories"
            className="flex w-full items-center justify-between rounded-xl border border-strong bg-surface-subtle px-4 py-3 text-left text-secondary transition-colors hover:bg-white/10"
            aria-label="Catégories personnalisées"
            title="Catégories personnalisées"
          >
            <div>
              <p className="font-semibold">Catégories personnalisées</p>
              <p className="text-sm text-subtle">Ajoute tes propres catégories et mots</p>
            </div>
            <ChevronRight size={20} className="text-subtle" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="surface-subtle p-5">
        <h2 className="text-lg font-semibold">Mode de jeu</h2>
        <p className="mt-1 text-sm text-muted">Choisis la position de la pioche selon ta main préférée.</p>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => setHandedness('right')}
            className={[
              'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors',
              handedness === 'right'
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                : 'border-border-strong bg-surface-subtle text-secondary hover:bg-white/10',
            ].join(' ')}
            aria-label="Mode droitier"
            title="Mode droitier"
          >
            <div>
              <p className="font-semibold">Droitier</p>
              <p className="text-sm text-subtle">Pioche à droite</p>
            </div>
            {handedness === 'right' ? (
              <div className="text-lg" aria-hidden="true">
                ✓
              </div>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setHandedness('left')}
            className={[
              'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors',
              handedness === 'left'
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                : 'border-border-strong bg-surface-subtle text-secondary hover:bg-white/10',
            ].join(' ')}
            aria-label="Mode gaucher"
            title="Mode gaucher"
          >
            <div>
              <p className="font-semibold">Gaucher</p>
              <p className="text-sm text-subtle">Pioche à gauche</p>
            </div>
            {handedness === 'left' ? (
              <div className="text-lg" aria-hidden="true">
                ✓
              </div>
            ) : null}
          </button>
        </div>
      </section>

      <section className="surface-subtle p-5">
        <h2 className="text-lg font-semibold">Thème visuel</h2>
        <p className="mt-1 text-sm text-muted">Personnalise l'apparence du jeu.</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {themeOptions.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setTheme(theme.id)}
              className={[
                'flex flex-col items-start rounded-xl border p-3 text-left transition-colors',
                currentTheme === theme.id
                  ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                  : 'border-border-strong bg-surface-subtle text-secondary hover:bg-white/10',
              ].join(' ')}
              aria-label={`Thème ${theme.name}`}
              title={`Thème ${theme.name}`}
            >
              <div
                className="mb-2 h-8 w-full rounded-lg shadow-sm"
                style={{
                  background: `linear-gradient(to bottom right, ${theme.feltBackground.from}, ${theme.feltBackground.to})`,
                }}
              />
              <div className="w-full">
                <p className="font-semibold">{theme.name}</p>
                <p className="text-xs text-subtle">{theme.description}</p>
              </div>
              {currentTheme === theme.id ? (
                <div className="ml-auto mt-1 text-lg" aria-hidden="true">
                  ✓
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </section>

      <section className="surface-subtle p-5">
        <h2 className="text-lg font-semibold">Audio</h2>
        <p className="mt-1 text-sm text-muted">Active ou désactive les sons et la musique.</p>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={[
              'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors',
              soundEnabled
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                : 'border-border-strong bg-surface-subtle text-secondary hover:bg-white/10',
            ].join(' ')}
            aria-label="Effets sonores"
            aria-pressed={soundEnabled}
            title="Effets sonores"
          >
            <div>
              <p className="font-semibold">Effets sonores</p>
              <p className="text-sm text-subtle">Sons des actions de jeu</p>
            </div>
            {soundEnabled ? (
              <div className="text-lg" aria-hidden="true">
                ✓
              </div>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={[
              'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors',
              musicEnabled
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                : 'border-border-strong bg-surface-subtle text-secondary hover:bg-white/10',
            ].join(' ')}
            aria-label="Musique"
            aria-pressed={musicEnabled}
            title="Musique"
          >
            <div>
              <p className="font-semibold">Musique</p>
              <p className="text-sm text-subtle">Musique de fond</p>
            </div>
            {musicEnabled ? (
              <div className="text-lg" aria-hidden="true">
                ✓
              </div>
            ) : null}
          </button>
        </div>
      </section>
    </div>
  )
}
