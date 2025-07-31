import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useCompetition } from '../context/CompetitionContext'

const CompetitionHUD = () => {
  const hudRef = useRef()
  const [timeDisplay, setTimeDisplay] = useState('00:00')
  const { 
    isCompetitionMode, 
    currentPlayer, 
    startTime, 
    lives, 
    multiplier, 
    scores,
    hintsUsed,
    consecutiveCorrect
  } = useCompetition()

  useEffect(() => {
    if (!isCompetitionMode) return

    const updateTimer = () => {
      if (startTime) {
        const elapsed = Date.now() - startTime
        const minutes = Math.floor(elapsed / 60000)
        const seconds = Math.floor((elapsed % 60000) / 1000)
        setTimeDisplay(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      }
    }

    const interval = setInterval(updateTimer, 100)
    return () => clearInterval(interval)
  }, [isCompetitionMode, startTime])

  useEffect(() => {
    if (isCompetitionMode && hudRef.current) {
      gsap.fromTo(hudRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
      )
    }
  }, [isCompetitionMode])

  if (!isCompetitionMode) return null

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
  const completedPuzzles = Object.keys(scores).length

  return (
    <div ref={hudRef} className="fixed top-4 left-4 right-4 z-40 pointer-events-none">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-2xl p-4 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
            {/* Player Info */}
            <div className="col-span-2 md:col-span-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Player</div>
              <div className="text-white font-bold truncate">{currentPlayer}</div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Time</div>
              <div className="text-2xl font-mono font-bold text-blue-400">{timeDisplay}</div>
            </div>

            {/* Score */}
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Score</div>
              <div className="text-xl font-bold text-yellow-400">{totalScore.toLocaleString()}</div>
            </div>

            {/* Lives */}
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Lives</div>
              <div className="flex justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < lives ? 'text-red-500' : 'text-gray-600'}`}>
                    ❤️
                  </span>
                ))}
              </div>
            </div>

            {/* Multiplier */}
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Multiplier</div>
              <div className={`text-lg font-bold ${
                multiplier >= 2 ? 'text-purple-400' : 
                multiplier >= 1.5 ? 'text-orange-400' : 
                multiplier >= 1 ? 'text-green-400' : 'text-red-400'
              }`}>
                {multiplier.toFixed(1)}x
              </div>
            </div>

            {/* Progress */}
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Progress</div>
              <div className="text-sm font-semibold text-cyan-400">
                {completedPuzzles}/6
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedPuzzles / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
            <div>Hints Used: <span className="text-orange-400">{hintsUsed}</span></div>
            <div>Streak: <span className="text-green-400">{consecutiveCorrect}</span></div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                lives > 0 ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`}></div>
              Competition Active
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompetitionHUD
