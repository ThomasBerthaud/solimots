import type { LucideIcon } from 'lucide-react'

type IconLabelProps = {
  icon: LucideIcon
  label: string
  className?: string
  iconClassName?: string
  labelClassName?: string
  iconSize?: number
  /** Hide the visible label on mobile, keep it accessible for screen readers. */
  hideLabelOnMobile?: boolean
}

function cx(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ')
}

export function IconLabel({
  icon: Icon,
  label,
  className,
  iconClassName,
  labelClassName,
  iconSize = 16,
  hideLabelOnMobile = true,
}: IconLabelProps) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <Icon aria-hidden="true" className={cx('shrink-0', iconClassName)} size={iconSize} />
      {hideLabelOnMobile ? (
        <>
          <span className={cx('hidden sm:inline', labelClassName)}>{label}</span>
          <span className="sr-only sm:hidden">{label}</span>
        </>
      ) : (
        <span className={labelClassName}>{label}</span>
      )}
    </span>
  )
}
