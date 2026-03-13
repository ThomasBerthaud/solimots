import { Home as HomeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IconLabel } from '../components/ui/IconLabel'

export function NotFound() {
  return (
    <div className="space-y-3">
      <h1 className="font-display text-xl font-bold tracking-tight">Page introuvable</h1>
      <p className="text-muted">Cette page n’existe pas.</p>
      <Link
        className="inline-flex items-center text-amber-300 hover:text-amber-200"
        to="/"
        aria-label="Retour à l’accueil"
        title="Retour à l’accueil"
      >
        <IconLabel icon={HomeIcon} label="Retour à l’accueil" />
      </Link>
    </div>
  )
}
