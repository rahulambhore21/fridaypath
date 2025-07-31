import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import soundManager from '../utils/soundManager'
import { useCompetition } from '../context/CompetitionContext'
import CompetitionTimer from './CompetitionTimer'
import CompetitionHints from './CompetitionHints'

const HiddenPuzzle = ({ addWord }) => {
  const containerRef = useRef()
  const fakeButtonRef = useRef()
  const hiddenButtonRef = useRef()
  const [found, setFound] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const navigate = useNavigate()
  
  const { startPuzzle, completePuzzle, loseLife, isCompetitionMode } = useCompetition()

  const hints = [
    "Not all buttons are visible to the naked eye. Some blend into their surroundings.",
    "When the obvious doesn't work, look deeper into the structure.",
    "The background holds secrets. Examine the elements closely."
  ]

  const handleTimeUp = () => {
    if (isCompetitionMode) {
      loseLife()
      navigate('/')
    }
  }

  useEffect(() => {
    if (isCompetitionMode) {
      startPuzzle('hidden')
    }

    // Setup the initial animations
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      )
    }
  }, [isCompetitionMode, startPuzzle])

  const handleFakeButtonClick = () => {
    setAttempts(prev => prev + 1)
    soundManager.playError()
    
    // Add shake animation
    gsap.to(fakeButtonRef.current, {
      x: [-10, 10, -10, 10, 0],
      duration: 0.5,
      ease: 'power2.inOut'
    })
  }

  const handleHiddenButtonClick = () => {
    setFound(true)
    addWord('hidden')
    soundManager.playSuccess()
    
    if (isCompetitionMode) {
      completePuzzle('hidden')
    }
    
    createCelebration()
    
    setTimeout(() => {
      navigate('/')
    }, 3000)
  }

  const createCelebration = () => {
    // Celebration confetti effect
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.style.position = 'fixed'
      confetti.style.left = Math.random() * 100 + 'vw'
      confetti.style.top = '-10px'
      confetti.style.width = '10px'
      confetti.style.height = '10px'
      confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)]
      confetti.style.pointerEvents = 'none'
      confetti.style.borderRadius = '50%'
      confetti.style.zIndex = '9999'
      document.body.appendChild(confetti)
      
      gsap.to(confetti, {
        y: window.innerHeight + 100,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        duration: 3,
        ease: 'power2.out',
        onComplete: () => confetti.remove()
      })
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8 relative overflow-hidden">
      {isCompetitionMode && <CompetitionTimer timeLimit={120} onTimeUp={handleTimeUp} puzzleId="hidden" />}
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 gradient-text">
            👻 The Hidden Element
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Sometimes what you need is hiding in plain sight, camouflaged by design.
          </p>
        </div>

        <CompetitionHints hints={hints} />

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          <div className="text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Hidden Button Challenge</h3>
              <p className="text-gray-300 mb-6">
                Click the button below to continue. But something doesn't seem right...
              </p>
              
              <div className="relative min-h-[300px] bg-gray-800 rounded-2xl p-8 border border-gray-700 flex items-center justify-center">
                {/* Fake button that doesn't work */}
                <button
                  ref={fakeButtonRef}
                  onClick={handleFakeButtonClick}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  🎯 Click Me to Continue
                </button>
                
                {/* Hidden button with same background color */}
                <button
                  ref={hiddenButtonRef}
                  onClick={handleHiddenButtonClick}
                  className="absolute top-4 left-4 px-4 py-2 font-bold text-lg rounded-xl shadow-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgb(31, 41, 55)', // Same as bg-gray-800
                    color: 'rgb(31, 41, 55)', // Same as background, making text invisible
                    border: '2px solid rgb(31, 41, 55)' // Same border color
                  }}
                  title="Real Button"
                >
                  Hidden Button
                </button>
              </div>
              
              <div className="mt-6 text-sm text-gray-400">
                <p>Failed attempts: {attempts}</p>
                {attempts > 0 && !found && (
                  <p className="text-yellow-400 mt-2">
                    💡 That button doesn't seem to work. Maybe there's another one...
                  </p>
                )}
                {attempts > 2 && !found && (
                  <p className="text-orange-400 mt-2">
                    🔧 Try inspecting the element. Look for buttons with the same background color.
                  </p>
                )}
                {attempts > 4 && !found && (
                  <p className="text-red-400 mt-2">
                    ⚠️ Check the top-left area of the gray box in the inspector!
                  </p>
                )}
              </div>
            </div>

            {found && (
              <div className="mt-8 p-6 bg-green-900/30 border border-green-500/50 rounded-2xl">
                <h3 className="text-2xl font-bold text-green-400 mb-2">🎉 Found the Hidden Treasure!</h3>
                <p className="text-green-300">
                  You've discovered the art of finding hidden elements! The word "hidden" has been added to your collection.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default HiddenPuzzle
