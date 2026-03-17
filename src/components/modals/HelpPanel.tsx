import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

const DESKTOP_BREAKPOINT = 1024

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= DESKTOP_BREAKPOINT : true
  )
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
    const handler = () => setIsDesktop(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

type HelpPanelProps = {
  isOpen: boolean
  onClose: () => void
  /** Ref to the trigger button; focus returns here when panel closes. */
  triggerRef?: React.RefObject<HTMLElement | null>
}

// Integrated help panel: slide-over from right on desktop, bottom sheet on mobile. Does not block the game.
export function HelpPanel({ isOpen, onClose, triggerRef }: HelpPanelProps) {
  const reduceMotion = useReducedMotion()
  const isDesktop = useIsDesktop()
  const panelRef = useRef<HTMLDivElement>(null)

  // Escape closes; return focus to trigger on close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      triggerRef?.current?.focus()
    }
  }, [isOpen, onClose, triggerRef])

  // Focus first focusable when open; trap focus inside panel
  useEffect(() => {
    if (!isOpen) return
    const panel = panelRef.current
    if (!panel) return
    const focusable = getFocusableElements(panel)
    focusable[0]?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const els = getFocusableElements(panel)
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
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
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* Optional dim overlay; click closes. Not full-screen block. */}
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/20 lg:bg-black/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onPointerDown={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="region"
            aria-label="Aide"
            className={
              isDesktop
                ? 'fixed right-0 top-0 z-[9999] flex h-full w-full max-w-[min(380px,92vw)] flex-col border-l border-[var(--color-border)] bg-[var(--color-surface-modal)] shadow-[var(--shadow-modal)]'
                : 'fixed bottom-0 left-0 right-0 z-[9999] flex max-h-[85vh] flex-col rounded-t-[24px] border-t border-[var(--color-border)] bg-[var(--color-surface-modal)] shadow-[var(--shadow-modal)]'
            }
            initial={
              reduceMotion
                ? { opacity: 0 }
                : isDesktop
                  ? { x: '100%' }
                  : { y: '100%' }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : isDesktop
                  ? { x: 0 }
                  : { y: 0 }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : isDesktop
                  ? { x: '100%' }
                  : { y: '100%' }
            }
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4 text-primary lg:p-5">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted">Aide</p>
                  <h2 className="mt-1 text-lg font-bold">Comment jouer</h2>
                </div>
                <button
                  type="button"
                  data-ui-control="true"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] active:bg-white/10"
                  aria-label="Fermer l'aide"
                  title="Fermer"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 min-w-0 space-y-3 overflow-hidden text-base text-muted">
                <p>
                  - <span className="font-semibold text-primary">Pioche</span> : appuie sur <strong>Stock</strong> pour
                  envoyer une carte vers la <strong>Défausse</strong>.
                </p>
                <p>
                  - <span className="font-semibold text-primary">Déplacer</span> : tape une carte du dessus (tableau ou
                  Défausse) pour la sélectionner, puis tape où la poser.
                </p>
                <p>
                  - <span className="font-semibold text-primary">Emplacements</span> : pose une catégorie sur un
                  emplacement vide, puis pose uniquement les mots qui vont avec cette catégorie.
                </p>
                <p className="text-muted">
                  Astuce : tape en dehors des cartes pour annuler la sélection.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
