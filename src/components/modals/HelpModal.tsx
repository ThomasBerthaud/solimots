import { motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

// English comments per project rule.
export function HelpModal({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  // Restore focus to trigger on unmount; handle Escape key
  useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement | null
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElementRef.current?.focus()
    }
  }, [onClose])

  // Focus first focusable (close button) when panel is visible; trap focus inside modal
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const focusFirst = () => {
      const focusable = getFocusableElements(panel)
      focusable[0]?.focus()
    }
    focusFirst()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = getFocusableElements(panel)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const current = document.activeElement as HTMLElement | null
      if (e.shiftKey) {
        if (current === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (current === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    panel.addEventListener('keydown', handleKeyDown)
    return () => panel.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <motion.div
      className="modal-backdrop"
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
        ref={panelRef}
        className="modal-panel text-primary"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted">Aide</p>
            <h2 className="mt-1 text-lg font-bold">Comment jouer</h2>
          </div>
          <button
            type="button"
            data-ui-control="true"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-subtle text-secondary active:bg-white/10"
            aria-label="Fermer l’aide"
            title="Fermer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 min-w-0 space-y-3 overflow-hidden text-base text-muted">
          <p>
            - <span className="font-semibold text-primary">Pioche</span>: appuie sur Stock pour tirer une carte dans la
            Défausse.
          </p>
          <p>
            - <span className="font-semibold text-primary">Déplacer</span>: tape une carte du dessus (tableau ou défausse)
            pour la sélectionner, puis tape une destination.
          </p>
          <p>
            - <span className="font-semibold text-primary">Slots</span>: pose une catégorie sur un slot vide, puis pose
            uniquement les mots de cette catégorie dessus.
          </p>
          <p className="text-muted">Astuce: tape sur le fond (en dehors des cartes) pour annuler la sélection.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
