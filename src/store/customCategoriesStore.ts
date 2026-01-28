import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
              id: `custom_${Date.now()}`,
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
          customCategories: state.customCategories.map((cat) =>
            cat.id === categoryId
              ? { ...cat, words: [...cat.words, word] }
              : cat
          ),
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
    }
  )
)
