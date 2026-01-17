import { useEffect, useRef } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import { soundManager, type MusicTrack, type SoundEffect } from './soundManager'

export function useSoundEffects() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)
  const musicEnabled = useSettingsStore((s) => s.musicEnabled)

  const playSound = (effect: SoundEffect, volume = 0.5) => {
    if (!soundEnabled) return
    soundManager.playSound(effect, volume)
  }

  const playMusic = (track: MusicTrack, volume = 0.3) => {
    if (!musicEnabled) return
    soundManager.playMusic(track, volume)
  }

  const stopMusic = () => {
    soundManager.stopMusic()
  }

  const fadeOutMusic = (duration = 1000) => {
    soundManager.fadeOutMusic(duration)
  }

  return { playSound, playMusic, stopMusic, fadeOutMusic, soundEnabled, musicEnabled }
}

/**
 * Hook that automatically plays startup music when the component mounts.
 * The music will only play if musicEnabled is true in settings.
 * Note: Due to browser autoplay policies, the music may not play until
 * the user has interacted with the page (click, tap, etc).
 */
export function useStartupMusic() {
  const { playMusic, stopMusic, musicEnabled } = useSoundEffects()
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    if (musicEnabled && !hasPlayedRef.current) {
      // Delay slightly to ensure user interaction
      const timer = setTimeout(() => {
        playMusic('startup', 0.2)
        hasPlayedRef.current = true
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [musicEnabled, playMusic])

  useEffect(() => {
    return () => {
      stopMusic()
    }
  }, [stopMusic])
}
