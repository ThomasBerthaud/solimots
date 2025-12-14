import { Dices, GraduationCap, Play, ScrollText, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IconLabel } from '../components/ui/IconLabel'

export function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <p className="text-sm uppercase tracking-wider text-white/70">Solitaire d’associations</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight md:text-3xl">
          Associe les mots à la bonne catégorie.
        </h1>
        <p className="mt-2 text-white/75">Un feeling “solitaire”, mais avec des mots. Déplace, teste, progresse.</p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/game"
            className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-black shadow hover:bg-amber-300 active:bg-amber-500"
            aria-label="Jouer une partie"
            title="Jouer une partie"
          >
            <IconLabel icon={Play} label="Jouer une partie" />
          </Link>
          <Link
            to="/tutorial"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 active:bg-white/15"
            aria-label="Mini tutoriel"
            title="Mini tutoriel"
          >
            <IconLabel icon={GraduationCap} label="Mini tutoriel" />
          </Link>
          <Link
            to="/how-to"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 active:bg-white/15"
            aria-label="Voir les règles"
            title="Voir les règles"
          >
            <IconLabel icon={ScrollText} label="Voir les règles" />
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <Smartphone aria-hidden="true" className="shrink-0 opacity-90" size={16} />
            <span>Mobile-first</span>
          </p>
          <p className="mt-1 text-sm text-white/75">
            Conçu pour être agréable au pouce, avec une mise en page claire sur desktop.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <Dices aria-hidden="true" className="shrink-0 opacity-90" size={16} />
            <span>Niveaux rejouables</span>
          </p>
          <p className="mt-1 text-sm text-white/75">Génération locale de niveaux (4 catégories × 6 mots).</p>
        </div>
      </section>
    </div>
  )
}
