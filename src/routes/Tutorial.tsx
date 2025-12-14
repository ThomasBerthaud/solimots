import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconLabel } from '../components/ui/IconLabel'

type Step = {
  title: string
  body: string
  hint: string
}

// English comments per project rule.
export function Tutorial() {
  const navigate = useNavigate()
  const steps = useMemo<Step[]>(
    () => [
      {
        title: '1) Tire une carte',
        body: 'Appuie sur la Pioche pour mettre une carte dans la Défausse.',
        hint: 'Astuce: si la Pioche est vide, la Défausse revient en Pioche.',
      },
      {
        title: '2) Déplace la carte du dessus',
        body: 'Tu peux déplacer la carte du dessus d’une colonne, ou celle de la Défausse.',
        hint: 'Dans ce MVP, le tableau est en empilement libre.',
      },
      {
        title: '3) Vise la bonne catégorie',
        body: 'Dépose une carte dans une pile Catégorie seulement si elle correspond.',
        hint: 'Si tu te trompes, la carte shake et revient.',
      },
      {
        title: '4) Gagne le niveau',
        body: 'Quand les 24 cartes sont rangées dans les catégories, c’est gagné.',
        hint: 'Tu peux utiliser Annuler et Réinitialiser si besoin.',
      },
    ],
    [],
  )

  const [idx, setIdx] = useState(0)
  const step = steps[idx]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold md:text-2xl">Tutoriel</h1>
        <button onClick={() => navigate(-1)} className="btn-ghost px-3 py-2 text-xs" aria-label="Fermer" title="Fermer">
          <IconLabel icon={X} label="Fermer" />
        </button>
      </div>

      <div className="surface p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Étape {idx + 1}/{steps.length}
          </p>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={['h-1.5 w-6 rounded-full', i <= idx ? 'bg-amber-300' : 'bg-white/15'].join(' ')}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mt-4 space-y-2"
          >
            <h2 className="text-lg font-semibold">{step.title}</h2>
            <p className="text-white/80">{step.body}</p>
            <p className="text-sm text-white/60">{step.hint}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => setIdx((v) => Math.max(0, v - 1))}
            disabled={idx === 0}
            className="btn-ghost w-28 px-3 py-2 text-sm disabled:opacity-40"
            aria-label="Précédent"
            title="Précédent"
          >
            <IconLabel icon={ChevronLeft} label="Précédent" />
          </button>

          {idx < steps.length - 1 ? (
            <button
              onClick={() => setIdx((v) => Math.min(steps.length - 1, v + 1))}
              className="btn-primary w-28"
              aria-label="Suivant"
              title="Suivant"
            >
              <IconLabel icon={ChevronRight} label="Suivant" />
            </button>
          ) : (
            <Link to="/game" className="btn-primary w-28" aria-label="Jouer" title="Jouer">
              <IconLabel icon={Play} label="Jouer" />
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/70">
        Tu peux relancer ce tutoriel depuis l’accueil.
      </div>
    </div>
  )
}
