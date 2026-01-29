import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import './index.css'
import { CustomCategories } from './routes/CustomCategories.tsx'
import { Game } from './routes/Game.tsx'
import { Home } from './routes/Home.tsx'
import { HowTo } from './routes/HowTo.tsx'
import { NotFound } from './routes/NotFound.tsx'
import { Settings } from './routes/Settings.tsx'
import { Tutorial } from './routes/Tutorial.tsx'

// Register the service worker for offline support (PWA).
void registerSW({ immediate: true })

// Detect iOS standalone mode and add a class to html element for CSS targeting
if (window.navigator.standalone === true) {
  document.documentElement.classList.add('ios-standalone')
}

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/game', element: <Game /> },
      { path: '/how-to', element: <HowTo /> },
      { path: '/tutorial', element: <Tutorial /> },
      { path: '/settings', element: <Settings /> },
      { path: '/custom-categories', element: <CustomCategories /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
