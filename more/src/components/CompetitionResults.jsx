import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { useCompetition } from '../context/CompetitionContext'
import soundManager from '../utils/soundManager'

const CompetitionResults = ({ isOpen, onClose }) => {
  const modalRef = useRef()
  const confettiRef = useRef()
  const [showDetails, setShowDetails] = useState(false)
  
  const { 
    totalTime, 
    scores, 
    hintsUsed, 
    lives, 
    leaderboard,
    currentPlayer,
    puzzleTimes 
  } = useCompetition()

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Celebration animation
      gsap.fromTo(modalRef.current,
        { scale: 0.5, opacity: 0, rotation: 10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.3)' }
      )
      
      // Play victory sound
      soundManager.playVictory()
      
      // Create confetti effect
      createConfetti()
    }
  }, [isOpen])

  const createConfetti = () => {
    if (!confettiRef.current) return
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        z-index: 1000;
      `
      
      confettiRef.current.appendChild(confetti)
      
      gsap.to(confetti, {
        y: window.innerHeight + 100,
        x: `+=${Math.random() * 200 - 100}`,
        rotation: Math.random() * 360,
        duration: Math.random() * 3 + 2,
        ease: 'power2.out',
        onComplete: () => confetti.remove()
      })
    }
  }

  if (!isOpen) return null

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
  const completedPuzzles = Object.keys(scores).length
  
  const formatTime = (timeMs) => {
    const minutes = Math.floor(timeMs / 60000)
    const seconds = Math.floor((timeMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getRank = () => {
    const sortedScores = [...leaderboard].sort((a, b) => b.score - a.score)
    const currentEntry = sortedScores.find(entry => entry.playerName === currentPlayer)
    return currentEntry ? sortedScores.indexOf(currentEntry) + 1 : null
  }

  const rank = getRank()

  return createPortal(
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div ref={confettiRef} className="absolute inset-0 pointer-events-none"></div>
      
      <div ref={modalRef} className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-8 rounded-t-3xl text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold text-white mb-2">Competition Complete!</h1>
          <div className="text-xl text-yellow-100">
            Well done, <span className="font-bold">{currentPlayer}</span>!
          </div>
        </div>

        <div className="p-8">
          {/* Main Score Display */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-6">
              <div className="text-5xl font-bold text-white mb-2">
                {totalScore.toLocaleString()}
              </div>
              <div className="text-purple-200">Final Score</div>
              {rank && (
                <div className="mt-3 text-yellow-300 font-semibold">
                  #{rank} on the leaderboard!
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-800/50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-300">{formatTime(totalTime)}</div>
              <div className="text-sm text-blue-200">Total Time</div>
            </div>
            <div className="bg-green-800/50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-300">{completedPuzzles}/6</div>
              <div className="text-sm text-green-200">Puzzles</div>
            </div>
            <div className="bg-red-800/50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-red-300">{lives}/3</div>
              <div className="text-sm text-red-200">Lives Left</div>
            </div>
            <div className="bg-yellow-800/50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-yellow-300">{hintsUsed}</div>
              <div className="text-sm text-yellow-200">Hints Used</div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Performance Analysis
            </h3>
            
            <div className="space-y-3">
              {Object.entries(puzzleTimes).map(([puzzleId, time]) => (
                <div key={puzzleId} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    <span className="font-medium text-white capitalize">{puzzleId} Puzzle</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{scores[puzzleId]?.toLocaleString() || 0}</div>
                    <div className="text-sm text-gray-400">{formatTime(time)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-semibold transition-colors"
            >
              {showDetails ? 'Hide' : 'Show'} Detailed Stats
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Continue Playing
            </button>
          </div>

          {/* Detailed Stats */}
          {showDetails && (
            <div className="mt-6 bg-gray-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Detailed Statistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-2">Score Breakdown:</div>
                  <ul className="space-y-1">
                    <li className="flex justify-between">
                      <span>Puzzle Points:</span>
                      <span className="text-green-400">{Object.values(scores).reduce((sum, score) => sum + score, 0).toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Time Bonus:</span>
                      <span className="text-blue-400">+{Math.max(2000 - (totalTime / (1000 * 60)) * 50, 0).toFixed(0)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Life Bonus:</span>
                      <span className="text-red-400">+{lives * 300}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Hint Penalty:</span>
                      <span className="text-yellow-400">-{hintsUsed * 100}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="text-gray-400 mb-2">Performance Metrics:</div>
                  <ul className="space-y-1">
                    <li className="flex justify-between">
                      <span>Avg. Puzzle Time:</span>
                      <span>{formatTime(totalTime / Math.max(completedPuzzles, 1))}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span>{Math.round((completedPuzzles / 6) * 100)}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Efficiency Score:</span>
                      <span className="text-purple-400">{Math.round(totalScore / (totalTime / 1000))}/sec</span>
                    </li>
                  </ul>
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

export default CompetitionResults
