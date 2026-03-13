import { motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

// English comments per project rule.
export function HelpModal({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={(e) => {
        // Click outside closes.
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Aide"
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-black/70 p-4 text-white shadow-[0_40px_120px_rgba(0,0,0,0.65)] lg:p-5"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/80">Aide</p>
            <h2 className="mt-1 text-lg font-bold">Comment jouer</h2>
          </div>
          <button
            type="button"
            data-ui-control="true"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-white/90 active:bg-white/10"
            aria-label="Fermer l’aide"
            title="Fermer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 min-w-0 space-y-3 overflow-hidden text-base text-white/85">
          <p>
            - <span className="font-semibold text-white">Pioche</span>: appuie sur Stock pour tirer une carte dans la
            Défausse.
          </p>
          <p>
            - <span className="font-semibold text-white">Déplacer</span>: tape une carte du dessus (tableau ou défausse)
            pour la sélectionner, puis tape une destination.
          </p>
          <p>
            - <span className="font-semibold text-white">Slots</span>: pose une catégorie sur un slot vide, puis pose
            uniquement les mots de cette catégorie dessus.
          </p>
          <p className="text-white/80">Astuce: tape sur le fond (en dehors des cartes) pour annuler la sélection.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
