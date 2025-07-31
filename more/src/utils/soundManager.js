// Sound utility for enhanced user experience
class SoundManager {
  constructor() {
    this.audioContext = null
    this.sounds = new Map()
    this.enabled = true
    this.volume = 0.3
    
    // Initialize audio context
    this.initAudio()
  }

  async initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn('Audio not supported:', error)
      this.enabled = false
    }
  }

  // Create beep sound
  createBeep(frequency = 440, duration = 200, type = 'sine') {
    if (!this.enabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration / 1000)
  }

  // Success sound
  playSuccess() {
    this.createBeep(523, 150) // C5
    setTimeout(() => this.createBeep(659, 150), 150) // E5
    setTimeout(() => this.createBeep(784, 300), 300) // G5
  }

  // Error sound
  playError() {
    this.createBeep(200, 500, 'sawtooth')
  }

  // Click sound
  playClick() {
    this.createBeep(800, 50, 'square')
  }

  // Notification sound
  playNotification() {
    this.createBeep(440, 100)
    setTimeout(() => this.createBeep(550, 100), 100)
  }

  // Achievement sound
  playAchievement() {
    const notes = [261, 329, 392, 523, 659] // C4, E4, G4, C5, E5
    notes.forEach((note, index) => {
      setTimeout(() => this.createBeep(note, 200), index * 100)
    })
  }

  // Typing sound
  playTyping() {
    this.createBeep(800 + Math.random() * 200, 30, 'square')
  }

  // Hover sound
  playHover() {
    this.createBeep(600, 50, 'sine')
  }

  // Complete puzzle sound
  playComplete() {
    const melody = [
      { freq: 523, duration: 150 }, // C5
      { freq: 659, duration: 150 }, // E5
      { freq: 784, duration: 150 }, // G5
      { freq: 1047, duration: 300 }, // C6
    ]
    
    melody.forEach((note, index) => {
      setTimeout(() => this.createBeep(note.freq, note.duration), index * 150)
    })
  }

  // Final victory sound
  playVictory() {
    const fanfare = [
      { freq: 392, duration: 200 }, // G4
      { freq: 523, duration: 200 }, // C5
      { freq: 659, duration: 200 }, // E5
      { freq: 784, duration: 400 }, // G5
      { freq: 659, duration: 200 }, // E5
      { freq: 784, duration: 200 }, // G5
      { freq: 1047, duration: 600 }, // C6
    ]
    
    fanfare.forEach((note, index) => {
      setTimeout(() => this.createBeep(note.freq, note.duration), index * 200)
    })
  }

  // Toggle sound
  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }

  // Set volume (0-1)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }
}

// Create global instance
const soundManager = new SoundManager()

export default soundManager
