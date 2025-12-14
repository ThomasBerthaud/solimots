import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export type ErrorToastPayload = {
  at: number
  message: string
}

export type ErrorToastProps = {
  error?: ErrorToastPayload | null
  durationMs?: number
  className?: string
}

// English comments per project rule.
export function ErrorToast({ error, durationMs = 2200, className }: ErrorToastProps) {
  const [shown, setShown] = useState<ErrorToastPayload | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!error) return
    setShown({ at: error.at, message: error.message })

    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setShown((cur) => (cur?.at === error.at ? null : cur))
    }, durationMs)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [error, durationMs])

  return (
    <AnimatePresence>
      {shown ? (
        <motion.div
          key={shown.at}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={[
            'pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] left-1/2 z-40 w-[92vw] max-w-[520px] -translate-x-1/2 rounded-2xl border border-rose-400/40 bg-rose-950/85 px-4 py-3 text-sm font-semibold text-rose-50 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md',
            className ?? '',
          ].join(' ')}
          aria-live="polite"
        >
          <div className="text-center">{shown.message}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
