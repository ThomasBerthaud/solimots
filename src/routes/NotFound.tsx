import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Page introuvable</h1>
      <p className="text-white/75">Cette page n’existe pas.</p>
      <Link className="text-amber-300 hover:text-amber-200" to="/">
        Retour à l’accueil
      </Link>
    </div>
  )
}
