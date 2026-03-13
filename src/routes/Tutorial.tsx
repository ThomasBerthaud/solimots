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
        body: 'Appuie sur Stock pour envoyer une carte vers la Défausse.',
        hint: 'Si Stock est vide, les cartes de la Défausse reviennent dans Stock.',
      },
      {
        title: '2) Déplace la carte du dessus',
        body: 'Tu peux déplacer la carte du dessus d’une colonne du tableau, ou celle de la Défausse.',
        hint: 'Tu peux empiler les cartes librement sur le tableau.',
      },
      {
        title: '3) Vise la bonne catégorie',
        body: "Pose un mot sur un emplacement de catégorie seulement s'il correspond à cette catégorie.",
        hint: 'Si le mot ne va pas, la carte tremble et revient à sa place.',
      },
      {
        title: '4) Gagne le niveau',
        body: 'Quand les 24 cartes sont rangées dans les bonnes catégories, c’est gagné.',
        hint: 'Utilise Annuler pour annuler le dernier coup.',
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
            className="btn-ghost min-w-[7rem] px-3 py-2 text-sm disabled:opacity-40"
            aria-label="Précédent"
            title="Précédent"
          >
            <IconLabel icon={ChevronLeft} label="Précédent" />
          </button>

          {idx < steps.length - 1 ? (
            <button
              onClick={() => setIdx((v) => Math.min(steps.length - 1, v + 1))}
            className="btn-primary min-w-[7rem]"
            aria-label="Suivant"
              title="Suivant"
            >
              <IconLabel icon={ChevronRight} label="Suivant" />
            </button>
          ) : (
            <Link to="/game" className="btn-primary min-w-[7rem]" aria-label="Jouer" title="Jouer">
              <IconLabel icon={Play} label="Jouer" />
            </Link>
          )}
        </div>
      </div>

      <div className="surface-subtle p-4 text-sm text-muted">
        Tu peux revoir ce tutoriel depuis l’accueil à tout moment.
      </div>
    </div>
  )
}
