import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // We manually register the SW in `src/main.tsx`.
      injectRegister: null,
      workbox: {
        // SPA offline support: serve the app shell for navigation requests.
        navigateFallback: '/index.html',
      },
      // Enable SW in dev to validate offline behavior locally.
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
