import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { WordBankCategory } from '../game/types'

export const MAX_CATEGORY_LABEL_LENGTH = 50
export const MAX_WORD_LENGTH = 30

interface CustomCategoriesState {
  customCategories: WordBankCategory[]
  addCategory: (label: string) => void
  removeCategory: (id: string) => void
  addWordToCategory: (categoryId: string, word: string) => void
  removeWordFromCategory: (categoryId: string, wordIndex: number) => void
  updateCategoryLabel: (categoryId: string, label: string) => void
}

export const useCustomCategoriesStore = create<CustomCategoriesState>()(
  persist(
    (set) => ({
      customCategories: [],
      
      addCategory: (label) =>
        set((state) => {
          const trimmed = label.trim().slice(0, MAX_CATEGORY_LABEL_LENGTH)
          if (!trimmed) return state
          return {
            customCategories: [
              ...state.customCategories,
              {
                id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                label: trimmed,
                words: [],
              },
            ],
          }
        }),
      
      removeCategory: (id) =>
        set((state) => ({
          customCategories: state.customCategories.filter((cat) => cat.id !== id),
        })),
      
      addWordToCategory: (categoryId, word) =>
        set((state) => ({
          customCategories: state.customCategories.map((cat) => {
            if (cat.id === categoryId) {
              const normalizedWord = word.trim().slice(0, MAX_WORD_LENGTH)
              if (!normalizedWord) return cat
              const wordExists = cat.words.some(
                (w) => w.toLowerCase() === normalizedWord.toLowerCase()
              )
              if (wordExists) return cat
              return { ...cat, words: [...cat.words, normalizedWord] }
            }
            return cat
          }),
        })),
      
      removeWordFromCategory: (categoryId, wordIndex) =>
        set((state) => ({
          customCategories: state.customCategories.map((cat) =>
            cat.id === categoryId
              ? { ...cat, words: cat.words.filter((_, i) => i !== wordIndex) }
              : cat
          ),
        })),
      
      updateCategoryLabel: (categoryId, label) =>
        set((state) => ({
          customCategories: state.customCategories.map((cat) =>
            cat.id === categoryId ? { ...cat, label: label.slice(0, MAX_CATEGORY_LABEL_LENGTH) } : cat
          ),
        })),
    }),
    {
      name: 'solimots-custom-categories',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Export a function to get custom categories for use in levelGen
export function getValidCustomCategories(): WordBankCategory[] {
  try {
    const state = useCustomCategoriesStore.getState()
    // Only return categories with at least 8 words (matching default word bank requirement)
    return state.customCategories.filter((cat) => cat.words.length >= 8)
  } catch (error) {
    console.error('Failed to load custom categories:', error)
    return []
  }
}
