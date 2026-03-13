// Sound manager for game audio (delight: balanced mix, smooth fades, empathetic error)

export type SoundEffect = 'draw' | 'move' | 'undo' | 'place' | 'complete' | 'error' | 'win' | 'lose'

export type MusicTrack = 'startup' | 'end'

export type PlayMusicOptions = {
  /** Fade in from 0 to target volume over this duration (ms). */
  fadeInMs?: number
  /** If current music is playing, fade it out over this duration before starting the new track. */
  fadeOutCurrentMs?: number
}

class SoundManager {
  private soundEffects: Map<SoundEffect, HTMLAudioElement> = new Map()
  private musicTracks: Map<MusicTrack, HTMLAudioElement> = new Map()
  private currentMusic: HTMLAudioElement | null = null
  private lastErrorSound: HTMLAudioElement | null = null
  private scheduledMusicTimeout: ReturnType<typeof setTimeout> | null = null

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

    // Stop previous error sound to prevent overlap
    if (effect === 'error' && this.lastErrorSound) {
      this.lastErrorSound.pause()
      this.lastErrorSound.currentTime = 0
      this.lastErrorSound = null
    }

    // Clone and play to allow overlapping sounds
    const clone = audio.cloneNode() as HTMLAudioElement
    clone.volume = volume

    // Track error sounds to prevent infinite playing
    if (effect === 'error') {
      this.lastErrorSound = clone
    }

    clone.play().catch(() => {})
  }

  /**
   * Play a music track. Optional fade-in (e.g. startup) and fade-out of current track (e.g. before end music).
   */
  playMusic(track: MusicTrack, volume = 0.3, options: PlayMusicOptions = {}) {
    const { fadeInMs, fadeOutCurrentMs } = options

    const startTrack = (targetVolume: number) => {
      const audio = this.musicTracks.get(track)
      if (!audio) return

      this.currentMusic = audio
      audio.currentTime = 0

      if (fadeInMs && fadeInMs > 0) {
        audio.volume = 0
        audio.play().catch(() => {})
        const startTime = Date.now()
        const fadeIn = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / fadeInMs, 1)
          audio.volume = targetVolume * progress
          if (progress < 1) requestAnimationFrame(fadeIn)
        }
        requestAnimationFrame(fadeIn)
      } else {
        audio.volume = targetVolume
        audio.play().catch(() => {})
      }
    }

    if (fadeOutCurrentMs && this.currentMusic) {
      if (this.scheduledMusicTimeout) {
        clearTimeout(this.scheduledMusicTimeout)
        this.scheduledMusicTimeout = null
      }
      const current = this.currentMusic
      const startVolume = current.volume
      const startTime = Date.now()
      this.currentMusic = null

      const fadeOut = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / fadeOutCurrentMs, 1)
        current.volume = startVolume * (1 - progress)
        if (progress < 1) {
          requestAnimationFrame(fadeOut)
        } else {
          current.pause()
          current.currentTime = 0
          this.scheduledMusicTimeout = setTimeout(() => {
            this.scheduledMusicTimeout = null
            startTrack(volume)
          }, 80)
        }
      }
      requestAnimationFrame(fadeOut)
    } else {
      this.stopMusic()
      startTrack(volume)
    }
  }

  stopMusic() {
    if (this.scheduledMusicTimeout) {
      clearTimeout(this.scheduledMusicTimeout)
      this.scheduledMusicTimeout = null
    }
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
