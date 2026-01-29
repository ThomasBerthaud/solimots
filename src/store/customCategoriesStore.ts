import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { WordBankCategory } from '../game/types'

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
        set((state) => ({
          customCategories: [
            ...state.customCategories,
            {
              id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              label,
              words: [],
            },
          ],
        })),
      
      removeCategory: (id) =>
        set((state) => ({
          customCategories: state.customCategories.filter((cat) => cat.id !== id),
        })),
      
      addWordToCategory: (categoryId, word) =>
        set((state) => ({
          customCategories: state.customCategories.map((cat) => {
            if (cat.id === categoryId) {
              // Prevent duplicate words (case-insensitive comparison)
              const normalizedWord = word.trim()
              const wordExists = cat.words.some(
                (w) => w.toLowerCase() === normalizedWord.toLowerCase()
              )
              if (wordExists) {
                return cat
              }
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
            cat.id === categoryId ? { ...cat, label } : cat
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
