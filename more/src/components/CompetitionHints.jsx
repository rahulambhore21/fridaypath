import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useCompetition } from '../context/CompetitionContext'
import soundManager from '../utils/soundManager'

const CompetitionHints = ({ hints, maxHints = 2 }) => {
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const hintRef = useRef()
  
  const { isCompetitionMode, useHint } = useCompetition()

  useEffect(() => {
    if (showHint && hintRef.current) {
      gsap.fromTo(hintRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )
    }
  }, [showHint])

  const handleHintRequest = () => {
    if (hintsUsed >= maxHints) {
      soundManager.playError()
      return
    }

    useHint()
    setHintsUsed(prev => prev + 1)
    setShowHint(true)
    soundManager.playNotification()

    // Auto-hide hint after 8 seconds
    setTimeout(() => {
      setShowHint(false)
      if (currentHintIndex < hints.length - 1) {
        setCurrentHintIndex(prev => prev + 1)
      }
    }, 8000)
  }

  const closeHint = () => {
    setShowHint(false)
  }

  if (!isCompetitionMode || !hints || hints.length === 0) return null

  const remainingHints = maxHints - hintsUsed
  const currentHint = hints[Math.min(currentHintIndex, hints.length - 1)]

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {/* Hint Button */}
      <button
        onClick={handleHintRequest}
        disabled={hintsUsed >= maxHints}
        className={`
          px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
          ${hintsUsed >= maxHints 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg'
          }
        `}
        title={hintsUsed >= maxHints ? 'No hints remaining' : `Get hint (${remainingHints} left)`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">💡</span>
          <div>
            <div className="text-sm">Hint</div>
            <div className="text-xs opacity-75">{remainingHints} left</div>
          </div>
        </div>
      </button>

      {/* Hint Cost Warning */}
      {hintsUsed < maxHints && (
        <div className="mt-2 text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">
          ⚠️ Reduces multiplier by 0.1x
        </div>
      )}

      {/* Hint Display */}
      {showHint && (
        <div 
          ref={hintRef}
          className="fixed bottom-20 left-4 max-w-sm bg-yellow-900/95 backdrop-blur-lg border border-yellow-500 rounded-xl p-4 shadow-2xl z-50"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <span className="text-xl mr-2">💡</span>
              <span className="font-semibold text-yellow-300">Hint {hintsUsed}</span>
            </div>
            <button
              onClick={closeHint}
              className="text-yellow-400 hover:text-yellow-200 text-lg transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="text-yellow-100 text-sm leading-relaxed">
            {currentHint}
          </div>
          
          <div className="mt-3 pt-3 border-t border-yellow-700">
            <div className="text-xs text-yellow-400">
              💰 Score multiplier reduced to reflect hint usage
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompetitionHints
