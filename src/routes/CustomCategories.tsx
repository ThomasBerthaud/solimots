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
      {/* Header: no card */}
      <div>
        <Link
          to="/settings"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
          aria-label="Retour aux paramètres"
          title="Retour aux paramètres"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Retour</span>
        </Link>
        <h1 className="font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
          Catégories personnalisées
        </h1>
        <p className="mt-2 text-muted">Crée des catégories et ajoute des mots pour les utiliser en partie.</p>
      </div>

      {/* Add category: inline strip */}
      <form
        onSubmit={handleAddCategory}
        className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3 sm:flex-row sm:items-center md:p-4"
      >
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
          className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-board)] px-3 py-2.5 text-primary placeholder:text-subtle focus:border-amber-400/40 focus:bg-amber-400/5 focus:outline-none"
          aria-describedby="new-category-hint"
        />
        <p id="new-category-hint" className="sr-only">
          {MAX_CATEGORY_LABEL_LENGTH} caractères maximum.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-400/20"
          aria-label="Ajouter la catégorie"
          title="Ajouter la catégorie"
        >
          <Plus size={18} aria-hidden="true" />
          <span>Ajouter</span>
        </button>
      </form>

      {customCategories.length === 0 ? (
        <p className="py-8 text-center text-subtle">
          Aucune catégorie personnalisée. Ta première catégorie t’attend juste au-dessus.
        </p>
      ) : (
        <ul className="space-y-4 list-none pl-0">
          {customCategories.map((category) => (
            <li
              key={category.id}
              className="rounded-xl border border-[var(--color-border)] border-l-4 border-l-amber-400/50 bg-[var(--color-surface-subtle)] overflow-hidden"
            >
              <div className="flex min-w-0 items-start justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate text-primary" title={category.label}>
                    {category.label}
                  </h3>
                  <p className="text-sm text-subtle">
                    {category.words.length} mot{category.words.length !== 1 ? 's' : ''}
                    {category.words.length >= 8 ? ' (max)' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeCategory(category.id)}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-red-400/40 bg-red-400/10 px-2.5 py-1.5 text-sm text-red-300 transition-colors hover:bg-red-400/20"
                  aria-label="Supprimer la catégorie"
                  title="Supprimer la catégorie"
                >
                  <Trash2 size={14} aria-hidden="true" />
                  <span>Supprimer</span>
                </button>
              </div>

              {category.words.length > 0 && (
                <div className="flex min-w-0 flex-wrap gap-2 px-4 pb-3">
                  {category.words.map((word, index) => (
                    <span
                      key={index}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-board)] px-2.5 py-1 text-sm"
                    >
                      <span className="min-w-0 truncate" title={word}>
                        {word}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeWordFromCategory(category.id, index)}
                        className="shrink-0 text-subtle transition-colors hover:text-red-300"
                        aria-label={`Supprimer ${word}`}
                        title={`Supprimer ${word}`}
                      >
                        <X size={12} aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {category.words.length < 8 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAddWord(category.id)
                  }}
                  className="flex flex-col gap-2 border-t border-[var(--color-border)] p-4 sm:flex-row sm:items-center"
                >
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
                    className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-board)] px-3 py-2 text-sm text-primary placeholder:text-subtle focus:border-amber-400/40 focus:bg-amber-400/5 focus:outline-none"
                    aria-describedby={`add-word-hint-${category.id}`}
                  />
                  <p id={`add-word-hint-${category.id}`} className="sr-only">
                    {MAX_WORD_LENGTH} caractères maximum.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-400/20"
                    aria-label="Ajouter le mot"
                    title="Ajouter le mot"
                  >
                    <Plus size={14} aria-hidden="true" />
                    <span>Ajouter</span>
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
