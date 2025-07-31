import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import soundManager from '../utils/soundManager'

const SettingsPanel = ({ isOpen, onClose, collectedWords }) => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(30)
  const [theme, setTheme] = useState('default')

  const achievements = [
    { id: 'first_word', name: 'First Steps', description: 'Collect your first word', icon: '🌟', unlocked: collectedWords.length >= 1 },
    { id: 'half_way', name: 'Half Way There', description: 'Collect 4 words', icon: '🔥', unlocked: collectedWords.length >= 4 },
    { id: 'almost_done', name: 'Almost There', description: 'Collect 6 words', icon: '⚡', unlocked: collectedWords.length >= 6 },
    { id: 'master', name: 'Escape Master', description: 'Collect all 8 words', icon: '🏆', unlocked: collectedWords.length === 8 },
    { id: 'source_solver', name: 'Source Detective', description: 'Complete source puzzle', icon: '🔍', unlocked: collectedWords.includes('unlock') },
    { id: 'hover_master', name: 'Interaction Expert', description: 'Complete hover puzzle', icon: '✨', unlocked: collectedWords.includes('the') },
    { id: 'console_hacker', name: 'Console Hacker', description: 'Complete console puzzle', icon: '🖥️', unlocked: collectedWords.includes('gate') },
    { id: 'decoder', name: 'Master Decoder', description: 'Complete encoding puzzle', icon: '🔐', unlocked: collectedWords.includes('fire') },
    { id: 'navigator', name: 'Navigation Expert', description: 'Complete routing puzzle', icon: '🧭', unlocked: collectedWords.includes('web') },
    { id: 'terminal_master', name: 'Terminal Master', description: 'Complete terminal puzzle', icon: '⚡', unlocked: collectedWords.includes('escape') },
    { id: 'inspector', name: 'Element Inspector', description: 'Complete trick puzzle', icon: '🎯', unlocked: collectedWords.includes('inspect') },
    { id: 'ghost_hunter', name: 'Ghost Hunter', description: 'Find the hidden element', icon: '👻', unlocked: collectedWords.includes('hidden') },
  ]

  const toggleSound = () => {
    const enabled = soundManager.toggle()
    setSoundEnabled(enabled)
    if (enabled) soundManager.playClick()
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    soundManager.setVolume(newVolume / 100)
    soundManager.playClick()
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    soundManager.playClick()
    // You could implement theme switching here
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-3xl font-bold text-cyan-400">⚙️ Settings & Achievements</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Settings Section */}
          <section>
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-3">🔧</span>
              Game Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sound Settings */}
              <div className="bg-gray-700/50 p-6 rounded-2xl">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4">🔊 Audio</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Sound Effects</span>
                    <button
                      onClick={toggleSound}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        soundEnabled ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                          soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Volume: {volume}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      disabled={!soundEnabled}
                    />
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="bg-gray-700/50 p-6 rounded-2xl">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4">🎨 Theme</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {['Default', 'Dark', 'Neon', 'Classic'].map((themeName) => (
                    <button
                      key={themeName}
                      onClick={() => handleThemeChange(themeName.toLowerCase())}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        theme === themeName.toLowerCase()
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {themeName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Progress Section */}
          <section>
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Progress Overview
            </h3>
            
            <div className="bg-gray-700/50 p-6 rounded-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{collectedWords.length}</div>
                  <div className="text-sm text-gray-400">Words Collected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{achievements.filter(a => a.unlocked).length}</div>
                  <div className="text-sm text-gray-400">Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{Math.round((collectedWords.length / 6) * 100)}%</div>
                  <div className="text-sm text-gray-400">Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {collectedWords.length === 6 ? '🏆' : '⏳'}
                  </div>
                  <div className="text-sm text-gray-400">Status</div>
                </div>
              </div>

              <div className="w-full bg-gray-600 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${(collectedWords.length / 6) * 100}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {collectedWords.map((word, index) => (
                  <span
                    key={index}
                    className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section>
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-3">🏅</span>
              Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    achievement.unlocked
                      ? 'bg-green-900/30 border-green-500 shadow-lg'
                      : 'bg-gray-700/30 border-gray-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className={`font-semibold ${achievement.unlocked ? 'text-green-400' : 'text-gray-400'}`}>
                        {achievement.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-green-400 text-xl">✓</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tips Section */}
          <section>
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-3">💡</span>
              Pro Tips
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="font-semibold text-blue-400 mb-2">🔍 Source Puzzle</h4>
                <p className="text-sm text-gray-300">Open Developer Tools (F12) and look for HTML comments in the source code.</p>
              </div>
              <div className="bg-purple-900/30 border-l-4 border-purple-500 p-4 rounded">
                <h4 className="font-semibold text-purple-400 mb-2">✨ Hover Puzzle</h4>
                <p className="text-sm text-gray-300">Move your mouse over different elements to reveal hidden interactions.</p>
              </div>
              <div className="bg-cyan-900/30 border-l-4 border-cyan-500 p-4 rounded">
                <h4 className="font-semibold text-cyan-400 mb-2">🖥️ Console Puzzle</h4>
                <p className="text-sm text-gray-300">Check the browser console for developer messages and clues.</p>
              </div>
              <div className="bg-orange-900/30 border-l-4 border-orange-500 p-4 rounded">
                <h4 className="font-semibold text-orange-400 mb-2">🔐 Encode Puzzle</h4>
                <p className="text-sm text-gray-300">Use online Base64 decoders or the browser's atob() function.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default SettingsPanel
