/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// iOS standalone mode support
interface Navigator {
  standalone?: boolean
}
