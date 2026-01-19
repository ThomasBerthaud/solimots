#!/usr/bin/env node

// Script to generate simple audio files for game sounds
// This creates basic WAV files using pure Node.js without external dependencies

const fs = require('fs')
const path = require('path')

// WAV file helper
function createWavFile(sampleRate, channels, samples) {
  const bytesPerSample = 2
  const blockAlign = channels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = samples.length * bytesPerSample
  const fileSize = 44 + dataSize

  const buffer = Buffer.alloc(fileSize)
  let offset = 0

  // RIFF header
  buffer.write('RIFF', offset)
  offset += 4
  buffer.writeUInt32LE(fileSize - 8, offset)
  offset += 4
  buffer.write('WAVE', offset)
  offset += 4

  // fmt chunk
  buffer.write('fmt ', offset)
  offset += 4
  buffer.writeUInt32LE(16, offset)
  offset += 4 // Chunk size
  buffer.writeUInt16LE(1, offset)
  offset += 2 // Audio format (PCM)
  buffer.writeUInt16LE(channels, offset)
  offset += 2
  buffer.writeUInt32LE(sampleRate, offset)
  offset += 4
  buffer.writeUInt32LE(byteRate, offset)
  offset += 4
  buffer.writeUInt16LE(blockAlign, offset)
  offset += 2
  buffer.writeUInt16LE(bytesPerSample * 8, offset)
  offset += 2

  // data chunk
  buffer.write('data', offset)
  offset += 4
  buffer.writeUInt32LE(dataSize, offset)
  offset += 4

  // Write samples
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]))
    const intSample = Math.floor(sample * 32767)
    buffer.writeInt16LE(intSample, offset)
    offset += 2
  }

  return buffer
}

// Sound generators
function generateTone(frequency, duration, sampleRate = 44100, envelope = true) {
  const samples = []
  const numSamples = Math.floor(duration * sampleRate)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    let amplitude = 0.3

    // Apply envelope for smoother sound
    if (envelope) {
      const attack = 0.01
      const decay = 0.1
      const sustain = 0.7
      const release = duration - decay

      if (t < attack) {
        amplitude *= t / attack
      } else if (t > release) {
        amplitude *= (duration - t) / (duration - release)
      } else if (t < decay) {
        amplitude *= sustain + (1 - sustain) * (1 - (t - attack) / (decay - attack))
      } else {
        amplitude *= sustain
      }
    }

    const value = amplitude * Math.sin(2 * Math.PI * frequency * t)
    samples.push(value)
  }

  return samples
}

function generateDrawSound() {
  // Card flipping sound - short percussive click
  const samples = []
  const sampleRate = 44100
  const duration = 0.05
  const numSamples = Math.floor(duration * sampleRate)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    // White noise filtered with quick decay envelope
    const noise = (Math.random() * 2 - 1) * 0.3
    const envelope = Math.exp(-50 * t)
    samples.push(noise * envelope)
  }

  return samples
}

function generateMoveSound() {
  // Swoosh sound - short percussive sweep
  const samples = []
  const sampleRate = 44100
  const duration = 0.08
  const numSamples = Math.floor(duration * sampleRate)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    // Filtered noise sweep with quick decay
    const noise = (Math.random() * 2 - 1) * 0.25
    const envelope = Math.exp(-30 * t)
    const filter = Math.sin(2 * Math.PI * (800 - 600 * t / duration) * t)
    samples.push(noise * envelope * 0.5 + filter * envelope * 0.5)
  }

  return samples
}

function generateUndoSound() {
  // Reverse swoosh - percussive with rising pitch
  const samples = []
  const sampleRate = 44100
  const duration = 0.08
  const numSamples = Math.floor(duration * sampleRate)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    // Filtered noise with rising frequency
    const noise = (Math.random() * 2 - 1) * 0.25
    const envelope = Math.exp(-25 * t)
    const filter = Math.sin(2 * Math.PI * (400 + 600 * t / duration) * t)
    samples.push(noise * envelope * 0.5 + filter * envelope * 0.5)
  }

  return samples
}

function generatePlaceSound() {
  // Satisfying place sound - short percussive tap
  const samples = []
  const sampleRate = 44100
  const duration = 0.06
  const numSamples = Math.floor(duration * sampleRate)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    // Low frequency thump with quick decay
    const freq = 150
    const envelope = Math.exp(-40 * t)
    const value = envelope * Math.sin(2 * Math.PI * freq * t) * 0.4
    samples.push(value)
  }

  return samples
}

function generateCompleteSound() {
  // Success chord
  const samples = []
  const sampleRate = 44100
  const duration = 0.3
  const numSamples = Math.floor(duration * sampleRate)

  const freqs = [523, 659, 784] // C-E-G major chord

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const amplitude = 0.15 * Math.exp(-3 * t)

    let value = 0
    for (const freq of freqs) {
      value += amplitude * Math.sin(2 * Math.PI * freq * t)
    }

    samples.push(value / freqs.length)
  }

  return samples
}

function generateErrorSound() {
  // Error buzz - short and distinct
  const samples = []
  const sampleRate = 44100
  const duration = 0.15
  const numSamples = Math.floor(duration * sampleRate)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    // Two-tone buzz with clear ending
    const envelope = Math.exp(-8 * t)
    const buzz1 = Math.sin(2 * Math.PI * 200 * t)
    const buzz2 = Math.sin(2 * Math.PI * 150 * t)
    const value = envelope * (buzz1 + buzz2) * 0.15
    samples.push(value)
  }

  return samples
}

function generateWinSound() {
  // Victory fanfare
  const samples = []
  const sampleRate = 44100
  const notes = [
    { freq: 523, start: 0, duration: 0.15 }, // C5
    { freq: 659, start: 0.15, duration: 0.15 }, // E5
    { freq: 784, start: 0.3, duration: 0.15 }, // G5
    { freq: 1047, start: 0.45, duration: 0.3 }, // C6
  ]

  const totalDuration = 0.75
  const numSamples = Math.floor(totalDuration * sampleRate)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    let value = 0

    for (const note of notes) {
      if (t >= note.start && t < note.start + note.duration) {
        const noteT = t - note.start
        const amplitude = 0.2 * Math.exp(-3 * noteT)
        value += amplitude * Math.sin(2 * Math.PI * note.freq * noteT)
      }
    }

    samples.push(value)
  }

  return samples
}

function generateLoseSound() {
  // Sad trombone
  const samples = []
  const sampleRate = 44100
  const duration = 0.5
  const numSamples = Math.floor(duration * sampleRate)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const freq = 300 - 100 * (t / duration)
    const amplitude = 0.2 * (1 - t / duration)
    const value = amplitude * Math.sin(2 * Math.PI * freq * t)
    samples.push(value)
  }

  return samples
}

function generateStartupMusic() {
  // Simple pleasant melody loop
  const samples = []
  const sampleRate = 44100
  const notes = [
    { freq: 523, start: 0, duration: 0.4 }, // C
    { freq: 659, start: 0.4, duration: 0.4 }, // E
    { freq: 784, start: 0.8, duration: 0.4 }, // G
    { freq: 659, start: 1.2, duration: 0.4 }, // E
  ]

  const totalDuration = 1.6
  const numSamples = Math.floor(totalDuration * sampleRate)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    let value = 0

    for (const note of notes) {
      if (t >= note.start && t < note.start + note.duration) {
        const noteT = t - note.start
        const amplitude = 0.15 * Math.exp(-1.5 * noteT)
        value += amplitude * Math.sin(2 * Math.PI * note.freq * noteT)
      }
    }

    samples.push(value)
  }

  return samples
}

function generateEndMusic() {
  // End music - similar to win but longer
  const samples = []
  const sampleRate = 44100
  const notes = [
    { freq: 784, start: 0, duration: 0.3 }, // G
    { freq: 659, start: 0.3, duration: 0.3 }, // E
    { freq: 523, start: 0.6, duration: 0.6 }, // C (longer)
  ]

  const totalDuration = 1.2
  const numSamples = Math.floor(totalDuration * sampleRate)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    let value = 0

    for (const note of notes) {
      if (t >= note.start && t < note.start + note.duration) {
        const noteT = t - note.start
        const amplitude = 0.15 * Math.exp(-1 * noteT)
        value += amplitude * Math.sin(2 * Math.PI * note.freq * noteT)
      }
    }

    samples.push(value)
  }

  return samples
}

// Generate all sounds
const outputDir = path.join(__dirname, '..', 'public', 'sounds')
const musicDir = path.join(outputDir, 'music')

// Ensure directories exist
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir, { recursive: true })

const sounds = {
  draw: generateDrawSound(),
  move: generateMoveSound(),
  undo: generateUndoSound(),
  place: generatePlaceSound(),
  complete: generateCompleteSound(),
  error: generateErrorSound(),
  win: generateWinSound(),
  lose: generateLoseSound(),
}

const music = {
  startup: generateStartupMusic(),
  end: generateEndMusic(),
}

// Write sound files
for (const [name, samples] of Object.entries(sounds)) {
  const wav = createWavFile(44100, 1, samples)
  const filePath = path.join(outputDir, `${name}.wav`)
  fs.writeFileSync(filePath, wav)
  console.log(`Generated ${filePath}`)
}

// Write music files
for (const [name, samples] of Object.entries(music)) {
  const wav = createWavFile(44100, 1, samples)
  const filePath = path.join(musicDir, `${name}.wav`)
  fs.writeFileSync(filePath, wav)
  console.log(`Generated ${filePath}`)
}

console.log('All sound files generated successfully!')
