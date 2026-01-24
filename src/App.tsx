import { motion } from 'framer-motion'
import { GraduationCap, Play, ScrollText, Settings } from 'lucide-react'
import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { IconLabel } from './components/ui/IconLabel'
import { useGameStore } from './store/gameStore'
import { useStartupMusic } from './utils/useSoundEffects'
import { useTheme } from './utils/useTheme'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const newGame = useGameStore((s) => s.newGame)
  const isGame = location.pathname.startsWith('/game')

  useStartupMusic()
  useTheme()

  // Prevent scrolling on the game page only
  useEffect(() => {
    if (isGame) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isGame])

  const handlePlay = () => {
    newGame()
    navigate('/game')
  }

  return (
    <div className="min-h-dvh">
      {isGame ? null : (
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur">
          <div className="mx-auto flex max-w-screen-md items-center justify-between px-4 py-3 md:max-w-4xl">
            <Link to="/" className="text-lg font-semibold tracking-wide">
              Solimots
            </Link>
            <nav className="flex items-center gap-3 text-sm text-white/80">
              <button
                type="button"
                onClick={handlePlay}
                className="inline-flex items-center hover:text-white"
                aria-label="Jouer"
                title="Jouer"
              >
                <IconLabel icon={Play} label="Jouer" />
              </button>
              <Link
                className="inline-flex items-center hover:text-white"
                to="/tutorial"
                aria-label="Tutoriel"
                title="Tutoriel"
              >
                <IconLabel icon={GraduationCap} label="Tutoriel" />
              </Link>
              <Link
                className="inline-flex items-center hover:text-white"
                to="/how-to"
                aria-label="Règles"
                title="Règles"
              >
                <IconLabel icon={ScrollText} label="Règles" />
              </Link>
              <Link
                className="inline-flex items-center hover:text-white"
                to="/settings"
                aria-label="Configuration"
                title="Configuration"
              >
                <IconLabel icon={Settings} label="Config" />
              </Link>
            </nav>
          </div>
        </header>
      )}

      <main
        className={
          isGame
            ? 'mx-auto w-full max-w-none px-0 pb-0 pt-0'
            : 'mx-auto max-w-screen-md px-4 pb-24 pt-4 md:max-w-4xl md:pt-8'
        }
      >
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
