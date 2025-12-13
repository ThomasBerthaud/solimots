import { Link } from 'react-router-dom'

export function HowTo() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold md:text-2xl">Règles (MVP)</h1>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <ul className="list-disc space-y-2 pl-5 text-white/85">
          <li>Tu as 4 catégories et 24 cartes-mots (4 × 6).</li>
          <li>Tu peux déplacer une carte visible vers n’importe quelle colonne du tableau.</li>
          <li>Pour marquer des points, dépose une carte dans la bonne pile Catégorie (si elle correspond).</li>
          <li>Si tu te trompes, la carte revient (feedback visuel).</li>
          <li>Le niveau est gagné quand toutes les cartes sont rangées dans les catégories.</li>
        </ul>
      </div>

      <Link
        to="/game"
        className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-black shadow hover:bg-amber-300 active:bg-amber-500"
      >
        Jouer
      </Link>
    </div>
  )
}
