import { ArrowLeft, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCustomCategoriesStore } from '../store/customCategoriesStore'

export function CustomCategories() {
  const customCategories = useCustomCategoriesStore((s) => s.customCategories)
  const addCategory = useCustomCategoriesStore((s) => s.addCategory)
  const removeCategory = useCustomCategoriesStore((s) => s.removeCategory)
  const addWordToCategory = useCustomCategoriesStore((s) => s.addWordToCategory)
  const removeWordFromCategory = useCustomCategoriesStore((s) => s.removeWordFromCategory)

  const [newCategoryLabel, setNewCategoryLabel] = useState('')
  const [newWords, setNewWords] = useState<Record<string, string>>({})

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategoryLabel.trim()) {
      addCategory(newCategoryLabel.trim())
      setNewCategoryLabel('')
    }
  }

  const handleAddWord = (categoryId: string) => {
    const word = newWords[categoryId]?.trim()
    if (word) {
      addWordToCategory(categoryId, word)
      setNewWords((prev) => ({ ...prev, [categoryId]: '' }))
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <Link
          to="/settings"
          className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white mb-4"
          aria-label="Retour aux paramètres"
          title="Retour aux paramètres"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Retour</span>
        </Link>
        <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Catégories personnalisées</h1>
        <p className="mt-2 text-white/75">
          Ajoute tes propres catégories et mots pour personnaliser tes parties.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/10 p-5">
        <h2 className="text-lg font-semibold">Ajouter une catégorie</h2>
        <form onSubmit={handleAddCategory} className="mt-4 flex gap-3">
          <input
            type="text"
            value={newCategoryLabel}
            onChange={(e) => setNewCategoryLabel(e.target.value)}
            placeholder="Nom de la catégorie..."
            className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-400/40 focus:bg-amber-400/5 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-amber-300 hover:bg-amber-400/20 transition-colors"
            aria-label="Ajouter la catégorie"
            title="Ajouter la catégorie"
          >
            <Plus size={20} aria-hidden="true" />
            <span>Ajouter</span>
          </button>
        </form>
      </section>

      {customCategories.length === 0 ? (
        <section className="rounded-2xl border border-white/10 bg-black/10 p-8 text-center">
          <p className="text-white/60">Aucune catégorie personnalisée pour le moment.</p>
          <p className="mt-2 text-sm text-white/40">
            Commence par ajouter une catégorie ci-dessus !
          </p>
        </section>
      ) : (
        <div className="space-y-4">
          {customCategories.map((category) => (
            <section
              key={category.id}
              className="rounded-2xl border border-white/10 bg-black/10 p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{category.label}</h3>
                  <p className="text-sm text-white/60">
                    {category.words.length} mot{category.words.length !== 1 ? 's' : ''}
                    {category.words.length >= 8 ? ' (maximum atteint)' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeCategory(category.id)}
                  className="flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-300 hover:bg-red-400/20 transition-colors"
                  aria-label="Supprimer la catégorie"
                  title="Supprimer la catégorie"
                >
                  <Trash2 size={16} aria-hidden="true" />
                  <span>Supprimer</span>
                </button>
              </div>

              {category.words.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {category.words.map((word, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5"
                    >
                      <span className="text-sm">{word}</span>
                      <button
                        type="button"
                        onClick={() => removeWordFromCategory(category.id, index)}
                        className="text-white/40 hover:text-red-300 transition-colors"
                        aria-label={`Supprimer ${word}`}
                        title={`Supprimer ${word}`}
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {category.words.length < 8 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAddWord(category.id)
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={newWords[category.id] || ''}
                    onChange={(e) =>
                      setNewWords((prev) => ({ ...prev, [category.id]: e.target.value }))
                    }
                    placeholder="Ajouter un mot..."
                    className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-amber-400/40 focus:bg-amber-400/5 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-300 hover:bg-amber-400/20 transition-colors"
                    aria-label="Ajouter le mot"
                    title="Ajouter le mot"
                  >
                    <Plus size={16} aria-hidden="true" />
                    <span>Ajouter</span>
                  </button>
                </form>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
