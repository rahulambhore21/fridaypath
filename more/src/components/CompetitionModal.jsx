import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { useCompetition } from '../context/CompetitionContext'
import soundManager from '../utils/soundManager'

const CompetitionModal = ({ isOpen, onClose, onStart }) => {
  const modalRef = useRef()
  const [playerName, setPlayerName] = useState('')
  const [difficulty, setDifficulty] = useState('normal')
  const [showRules, setShowRules] = useState(false)
  const { leaderboard } = useCompetition()

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )
    }
  }, [isOpen])

  const handleStart = () => {
    if (playerName.trim()) {
      onStart(playerName.trim(), difficulty)
      onClose()
      soundManager.playSuccess()
    } else {
      soundManager.playError()
    }
  }

  const difficulties = [
    { 
      id: 'easy', 
      name: 'Rookie', 
      description: 'Extended time limits, extra hints',
      multiplier: '1.0x',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      id: 'normal', 
      name: 'Professional', 
      description: 'Standard time limits, balanced scoring',
      multiplier: '1.2x',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      id: 'hard', 
      name: 'Expert', 
      description: 'Reduced time, limited hints',
      multiplier: '1.5x',
      color: 'from-orange-500 to-red-600'
    },
    { 
      id: 'expert', 
      name: 'Legendary', 
      description: 'Minimum time, no hints, maximum score',
      multiplier: '2.0x',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-4xl mr-4">🏆</span>
              <div>
                <h2 className="text-3xl font-bold text-white">Competition Mode</h2>
                <p className="text-purple-200">Compete for the top spot on the leaderboard!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-300 text-2xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showRules ? (
            <div className="space-y-6">
              {/* Player Setup */}
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">👤</span>
                  Player Setup
                </h3>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Player Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your name..."
                    maxLength={20}
                  />
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  Select Difficulty
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {difficulties.map((diff) => (
                    <div
                      key={diff.id}
                      onClick={() => setDifficulty(diff.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        difficulty === diff.id
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className={`text-lg font-semibold bg-gradient-to-r ${diff.color} bg-clip-text text-transparent mb-2`}>
                        {diff.name}
                      </div>
                      <div className="text-gray-300 text-sm mb-2">{diff.description}</div>
                      <div className="text-yellow-400 text-sm font-semibold">
                        Score Multiplier: {diff.multiplier}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">📊</span>
                  Current Leaderboard Top 5
                </h3>
                {leaderboard.length > 0 ? (
                  <div className="space-y-2">
                    {leaderboard.slice(0, 5).map((entry, index) => (
                      <div key={entry.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center">
                          <span className={`text-2xl mr-3 ${
                            index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'
                          }`}></span>
                          <div>
                            <div className="font-semibold text-white">{entry.playerName}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(entry.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold">{entry.score.toLocaleString()}</div>
                          <div className="text-sm text-gray-400">
                            {Math.floor(entry.totalTime / 60000)}:{String(Math.floor((entry.totalTime % 60000) / 1000)).padStart(2, '0')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    No records yet. Be the first to compete!
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRules(true)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-xl font-semibold transition-colors"
                >
                  📋 View Rules
                </button>
                <button
                  onClick={handleStart}
                  disabled={!playerName.trim()}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  🚀 Start Competition
                </button>
              </div>
            </div>
          ) : (
            /* Rules View */
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-3">📋</span>
                  Competition Rules
                </h3>
                
                <div className="space-y-4 text-gray-300">
                  <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
                    <h4 className="font-semibold text-blue-300 mb-2">🎯 Objective</h4>
                    <p>Complete all 6 puzzles as quickly as possible to earn the highest score!</p>
                  </div>

                  <div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded">
                    <h4 className="font-semibold text-green-300 mb-2">💯 Scoring System</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Base score per puzzle: 1000 points (decreases with time)</li>
                      <li>• Speed bonus: Complete under 30s (+500), 60s (+300), 120s (+100)</li>
                      <li>• Consecutive bonus: Score multiplier increases with each success</li>
                      <li>• Life bonus: 300 points per remaining life</li>
                      <li>• Completion bonus: 1000 points for finishing all puzzles</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded">
                    <h4 className="font-semibold text-yellow-300 mb-2">⚡ Lives & Penalties</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Start with 3 lives</li>
                      <li>• Lose 1 life for incorrect attempts</li>
                      <li>• Using hints reduces score multiplier</li>
                      <li>• Game ends when all lives are lost</li>
                    </ul>
                  </div>

                  <div className="bg-purple-900/30 border-l-4 border-purple-500 p-4 rounded">
                    <h4 className="font-semibold text-purple-300 mb-2">🏆 Leaderboard</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Top 10 scores are saved locally</li>
                      <li>• Scores include player name, total time, and difficulty</li>
                      <li>• Higher difficulty levels have score multipliers</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowRules(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold transition-colors"
              >
                ← Back to Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CompetitionModal
