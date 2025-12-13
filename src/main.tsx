import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Game } from './routes/Game.tsx'
import { Home } from './routes/Home.tsx'
import { HowTo } from './routes/HowTo.tsx'
import { NotFound } from './routes/NotFound.tsx'
import { Tutorial } from './routes/Tutorial.tsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/game', element: <Game /> },
      { path: '/how-to', element: <HowTo /> },
      { path: '/tutorial', element: <Tutorial /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
