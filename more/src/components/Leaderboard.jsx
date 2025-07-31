import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { useCompetition } from '../context/CompetitionContext'

const Leaderboard = ({ isOpen, onClose }) => {
  const modalRef = useRef()
  const [filter, setFilter] = useState('all')
  const { leaderboard } = useCompetition()

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredLeaderboard = filter === 'all' 
    ? leaderboard 
    : leaderboard.filter(entry => entry.difficulty === filter)

  const getRankEmoji = (index) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return '🏅'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'normal': return 'text-blue-400'
      case 'hard': return 'text-orange-400'
      case 'expert': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const formatTime = (timeMs) => {
    const minutes = Math.floor(timeMs / 60000)
    const seconds = Math.floor((timeMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-4xl mr-4">🏆</span>
              <div>
                <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
                <p className="text-yellow-200">Top escape room champions</p>
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
          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-6 bg-gray-800 p-1 rounded-lg">
            {['all', 'easy', 'normal', 'hard', 'expert'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilter(diff)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  filter === diff
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {diff === 'all' ? 'All Difficulties' : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          {filteredLeaderboard.length > 0 ? (
            <div className="space-y-3">
              {filteredLeaderboard.map((entry, index) => (
                <div key={entry.id} className={`
                  bg-gray-800 rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02]
                  ${index < 3 ? 'border-yellow-500/50 bg-gradient-to-r from-gray-800 to-yellow-900/20' : 'border-gray-700'}
                `}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{getRankEmoji(index)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl font-bold text-white">
                            {entry.playerName}
                          </span>
                          <span className={`text-sm px-2 py-1 rounded-full ${getDifficultyColor(entry.difficulty)} bg-gray-700`}>
                            {entry.difficulty.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {new Date(entry.date).toLocaleDateString()} • 
                          {entry.completedPuzzles}/6 puzzles • 
                          {entry.hintsUsed} hints used
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        Time: {formatTime(entry.totalTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Lives: {entry.lives}/3
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Completion Progress</span>
                      <span>{Math.round((entry.completedPuzzles / 6) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${(entry.completedPuzzles / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Records Yet</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? 'Be the first to compete and claim your spot!' 
                  : `No records for ${filter} difficulty yet.`
                }
              </p>
            </div>
          )}

          {/* Stats Summary */}
          {leaderboard.length > 0 && (
            <div className="mt-8 bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Overall Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {leaderboard.length}
                  </div>
                  <div className="text-xs text-gray-400">Total Players</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.max(...leaderboard.map(e => e.score)).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Highest Score</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400">
                    {formatTime(Math.min(...leaderboard.map(e => e.totalTime)))}
                  </div>
                  <div className="text-xs text-gray-400">Fastest Time</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round(leaderboard.reduce((sum, e) => sum + e.completedPuzzles, 0) / leaderboard.length * 10) / 10}
                  </div>
                  <div className="text-xs text-gray-400">Avg. Completion</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Leaderboard
