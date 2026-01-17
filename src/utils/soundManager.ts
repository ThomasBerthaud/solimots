// Simple sound manager for game audio effects

export type SoundEffect =
  | 'draw'
  | 'move'
  | 'undo'
  | 'place'
  | 'complete'
  | 'error'
  | 'win'
  | 'lose'

export type MusicTrack = 'startup' | 'end'

class SoundManager {
  private soundEffects: Map<SoundEffect, HTMLAudioElement> = new Map()
  private musicTracks: Map<MusicTrack, HTMLAudioElement> = new Map()
  private currentMusic: HTMLAudioElement | null = null

  constructor() {
    this.preloadSounds()
  }

  private preloadSounds() {
    // Preload sound effects
    const effects: SoundEffect[] = ['draw', 'move', 'undo', 'place', 'complete', 'error', 'win', 'lose']
    effects.forEach((effect) => {
      const audio = new Audio(`/sounds/${effect}.wav`)
      audio.preload = 'auto'
      this.soundEffects.set(effect, audio)
    })

    // Preload music tracks
    const tracks: MusicTrack[] = ['startup', 'end']
    tracks.forEach((track) => {
      const audio = new Audio(`/sounds/music/${track}.wav`)
      audio.preload = 'auto'
      audio.loop = track === 'startup' // Startup music loops
      this.musicTracks.set(track, audio)
    })
  }

  playSound(effect: SoundEffect, volume = 0.5) {
    const audio = this.soundEffects.get(effect)
    if (!audio) return

    // Clone and play to allow overlapping sounds
    const clone = audio.cloneNode() as HTMLAudioElement
    clone.volume = volume
    clone.play().catch(() => {
      // Silently fail if audio can't play (e.g., no user interaction yet)
    })
  }

  playMusic(track: MusicTrack, volume = 0.3) {
    // Stop current music
    this.stopMusic()

    const audio = this.musicTracks.get(track)
    if (!audio) return

    this.currentMusic = audio
    audio.volume = volume
    audio.currentTime = 0
    audio.play().catch(() => {
      // Silently fail if audio can't play
    })
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause()
      this.currentMusic.currentTime = 0
      this.currentMusic = null
    }
  }

  fadeOutMusic(duration = 1000) {
    if (!this.currentMusic) return

    const audio = this.currentMusic
    const startVolume = audio.volume
    const startTime = Date.now()

    const fade = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      audio.volume = startVolume * (1 - progress)

      if (progress < 1) {
        requestAnimationFrame(fade)
      } else {
        this.stopMusic()
      }
    }

    fade()
  }
}

// Singleton instance
export const soundManager = new SoundManager()
