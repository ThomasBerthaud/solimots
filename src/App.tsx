import { motion } from 'framer-motion'
import { Link, Outlet, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-screen-md items-center justify-between px-4 py-3 md:max-w-4xl">
          <Link to="/" className="text-lg font-semibold tracking-wide">
            Solimots
          </Link>
          <nav className="flex items-center gap-3 text-sm text-white/80">
            <Link className="hover:text-white" to="/game">
              Jouer
            </Link>
            <Link className="hover:text-white" to="/how-to">
              Règles
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-screen-md px-4 pb-24 pt-4 md:max-w-4xl md:pt-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}

export default App
