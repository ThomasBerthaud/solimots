import { motion } from 'framer-motion'

export type CardBackProps = {
  className?: string
  style?: React.CSSProperties
}

// English comments per project rule.
export function CardBack({ className, style }: CardBackProps) {
  return (
    <motion.div
      className={[
        'rounded-[18px] border border-white/10 bg-[var(--theme-card-back-gradient)] shadow-[0_12px_30px_rgba(0,0,0,0.25)]',
        className ?? '',
      ].join(' ')}
      style={style}
      aria-label="Carte face cachée"
    >
      <div className="h-full w-full rounded-[16px] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.10),transparent_45%)] p-2">
        <div className="h-full w-full rounded-[12px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(0,0,0,0.10))]" />
      </div>
    </motion.div>
  )
}
