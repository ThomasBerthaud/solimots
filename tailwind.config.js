/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        'surface-subtle': 'var(--color-surface-subtle)',
        'surface-strong': 'var(--color-surface-strong)',
        'surface-overlay': 'var(--color-surface-overlay)',
        'surface-modal': 'var(--color-surface-modal)',
        'surface-dock': 'var(--color-surface-dock)',
        'surface-board': 'var(--color-surface-board)',
        'surface-badge': 'var(--color-surface-badge)',
        'surface-badge-strong': 'var(--color-surface-badge-strong)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        /* Text colors: use as text-primary, text-muted, etc. */
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        subtle: 'var(--color-text-subtle)',
      },
      boxShadow: {
        surface: 'var(--shadow-surface)',
        modal: 'var(--shadow-modal)',
        card: 'var(--shadow-card)',
        'card-back': 'var(--shadow-card-back)',
        'slot-empty': 'var(--shadow-slot-empty)',
        'category-tab': 'var(--shadow-category-tab)',
        'inset-board': 'var(--shadow-inset-board)',
        dock: 'var(--shadow-dock)',
        toast: 'var(--shadow-toast)',
      },
    },
  },
  plugins: [],
}
