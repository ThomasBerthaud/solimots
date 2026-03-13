import { ArrowLeft, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useCustomCategoriesStore,
  MAX_CATEGORY_LABEL_LENGTH,
  MAX_WORD_LENGTH,
} from '../store/customCategoriesStore'

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
      <section className="surface p-5">
        <Link
          to="/settings"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
          aria-label="Retour aux paramètres"
          title="Retour aux paramètres"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Retour</span>
        </Link>
        <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Catégories personnalisées</h1>
        <p className="mt-2 text-muted">
          Crée des catégories et ajoute des mots pour les utiliser en partie.
        </p>
      </section>

      <section className="surface-subtle p-5">
        <h2 className="text-lg font-semibold">Ajouter une catégorie</h2>
        <form onSubmit={handleAddCategory} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="min-w-0 flex-1">
            <label htmlFor="new-category-name" className="sr-only">
              Nom de la catégorie
            </label>
            <input
              id="new-category-name"
              type="text"
              value={newCategoryLabel}
              onChange={(e) => setNewCategoryLabel(e.target.value.slice(0, MAX_CATEGORY_LABEL_LENGTH))}
              placeholder="Nom de la catégorie..."
              maxLength={MAX_CATEGORY_LABEL_LENGTH}
              autoComplete="off"
              className="w-full min-w-0 rounded-xl border border-strong bg-surface-subtle px-4 py-3 text-primary placeholder:text-subtle focus:border-amber-400/40 focus:bg-amber-400/5 focus:outline-none"
              aria-describedby="new-category-hint"
            />
            <p id="new-category-hint" className="sr-only">
              {MAX_CATEGORY_LABEL_LENGTH} caractères maximum.
            </p>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-amber-300 hover:bg-amber-400/20 transition-colors sm:justify-start"
            aria-label="Ajouter la catégorie"
            title="Ajouter la catégorie"
          >
            <Plus size={20} aria-hidden="true" />
            <span>Ajouter</span>
          </button>
        </form>
      </section>

      {customCategories.length === 0 ? (
        <section className="surface-subtle p-8 text-center">
          <p className="text-subtle">Aucune catégorie personnalisée.</p>
          <p className="mt-2 text-sm text-subtle">
            Ajoute une catégorie ci-dessus pour commencer.
          </p>
        </section>
      ) : (
        <div className="space-y-4">
          {customCategories.map((category) => (
            <section
              key={category.id}
              className="surface-subtle p-5"
            >
              <div className="flex min-w-0 items-start justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold truncate" title={category.label}>
                    {category.label}
                  </h3>
                  <p className="text-sm text-subtle">
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
                <div className="mb-4 flex min-w-0 flex-wrap gap-2">
                  {category.words.map((word, index) => (
                    <div
                      key={index}
                      className="flex max-w-full min-w-0 items-center gap-2 rounded-lg border border-strong bg-surface-subtle px-3 py-1.5"
                    >
                      <span className="min-w-0 truncate text-sm" title={word}>
                        {word}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeWordFromCategory(category.id, index)}
                        className="shrink-0 text-subtle hover:text-red-300 transition-colors"
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
                  className="flex min-w-0 flex-col gap-2 sm:flex-row"
                >
                  <div className="min-w-0 flex-1">
                    <label htmlFor={`add-word-${category.id}`} className="sr-only">
                      Ajouter un mot à {category.label}
                    </label>
                    <input
                      id={`add-word-${category.id}`}
                      type="text"
                      value={newWords[category.id] || ''}
                      onChange={(e) =>
                        setNewWords((prev) => ({
                          ...prev,
                          [category.id]: e.target.value.slice(0, MAX_WORD_LENGTH),
                        }))
                      }
                      placeholder="Ajouter un mot..."
                      maxLength={MAX_WORD_LENGTH}
                      autoComplete="off"
                      className="w-full min-w-0 rounded-lg border border-strong bg-surface-subtle px-3 py-2 text-sm text-primary placeholder:text-subtle focus:border-amber-400/40 focus:bg-amber-400/5 focus:outline-none"
                      aria-describedby={`add-word-hint-${category.id}`}
                    />
                    <p id={`add-word-hint-${category.id}`} className="sr-only">
                      {MAX_WORD_LENGTH} caractères maximum.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-300 hover:bg-amber-400/20 transition-colors sm:justify-start"
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
