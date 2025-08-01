import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useCompetition } from '../context/CompetitionContext'
import soundManager from '../utils/soundManager'
import CompetitionTimer from './CompetitionTimer'
import CompetitionHints from './CompetitionHints'

const TrickPuzzle = ({ addWord }) => {
  const containerRef = useRef()
  const puzzleAreaRef = useRef()
  const buttonRef = useRef()
  const trapButtonRef = useRef()
  const [found, setFound] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [trapClicks, setTrapClicks] = useState(0)
  const [showRealButton, setShowRealButton] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [buttonSize, setButtonSize] = useState(1)
  const [isInvisible, setIsInvisible] = useState(false)
  const [isFakeDisabled, setIsFakeDisabled] = useState(false)
  const [showDecoyButtons, setShowDecoyButtons] = useState(false)
  const [currentTrick, setCurrentTrick] = useState('normal')
  const [isSpinning, setIsSpinning] = useState(false)
  const [showSecretWin, setShowSecretWin] = useState(false)
  const [corneredCount, setCorneredCount] = useState(0)
  const [rapidClickCount, setRapidClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [waitingMode, setWaitingMode] = useState(false)
  const [waitingProgress, setWaitingProgress] = useState(0)
  
  const { startPuzzle, completePuzzle, loseLife, isCompetitionMode } = useCompetition()

  const hints = [
    "Not all buttons are created equal. Some are more... slippery than others.",
    "Sometimes patience wins over endless. Try different strategies!",
    "Corner the button systematically - it might give up eventually.",
    "What if you click really, really fast? Or maybe really, really slow?",
    "Try the konami code: ↑↑↓↓←→←→BA (arrow keys then B,A keys)",
    "Some challenges have secret solutions. Think outside the box!"
  ]

  const [konamiSequence, setKonamiSequence] = useState([])
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']

  const handleTimeUp = () => {
    if (!found) {
      loseLife()
    }
  }

  useEffect(() => {
    if (isCompetitionMode) {
      startPuzzle('trick')
    }

    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'back.out(1.7)' }
    )

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleKeyDown = (e) => {
      const newSequence = [...konamiSequence, e.code].slice(-10)
      setKonamiSequence(newSequence)
      
      if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
        handleSecretWin('konami')
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [konamiSequence, isCompetitionMode])

  // Progress-based reveals instead of attempt-based
  useEffect(() => {
    if (trapClicks >= 20) {
      // Ultimate fallback - always reveal after 20 attempts
      setShowRealButton(true)
      celebrateWin('endless')
    } else if (trapClicks >= 15) {
      setCurrentTrick('gigantic')
      setButtonSize(2) // Still big but not impossible
    } else if (trapClicks >= 12) {
      setCurrentTrick('multiplying')
      setShowDecoyButtons(true)
    } else if (trapClicks >= 9) {
      setCurrentTrick('disabled')
      setIsFakeDisabled(true)
    } else if (trapClicks >= 6) {
      setCurrentTrick('invisible')
      setIsInvisible(true)
    } else if (trapClicks >= 4) {
      setCurrentTrick('spinning')
      setIsSpinning(true)
    } else if (trapClicks >= 2) {
      setCurrentTrick('shrinking')
      setButtonSize(0.7) // Not too small
    }
  }, [trapClicks])

  // Waiting game mechanic
  useEffect(() => {
    let interval
    if (waitingMode) {
      interval = setInterval(() => {
        setWaitingProgress(prev => {
          if (prev >= 100) {
            setWaitingMode(false)
            handleSecretWin('patience')
            return 0
          }
          return prev + 1
        })
      }, 100) // 10 seconds total
    }
    return () => clearInterval(interval)
  }, [waitingMode])

  const moveButtonSafely = () => {
    if (!trapButtonRef.current || !puzzleAreaRef.current) return
    
    const puzzleArea = puzzleAreaRef.current
    const button = trapButtonRef.current
    const puzzleAreaStyle = window.getComputedStyle(puzzleArea)
    const paddingLeft = parseInt(puzzleAreaStyle.paddingLeft)
    const paddingTop = parseInt(puzzleAreaStyle.paddingTop)
    const paddingRight = parseInt(puzzleAreaStyle.paddingRight)
    const paddingBottom = parseInt(puzzleAreaStyle.paddingBottom)
    
    const containerWidth = puzzleArea.clientWidth - paddingLeft - paddingRight
    const containerHeight = puzzleArea.clientHeight - paddingTop - paddingBottom
    
    // Get actual button dimensions
    const buttonWidth = button.offsetWidth
    const buttonHeight = button.offsetHeight
    
    // Safe boundaries with extra margin
    const margin = 20
    const minX = margin
    const minY = margin
    const maxX = Math.max(margin, containerWidth - buttonWidth - margin)
    const maxY = Math.max(margin, containerHeight - buttonHeight - margin)
    
    // Ensure we have valid movement space
    if (maxX <= minX || maxY <= minY) {
      // If no space to move, just do a small shake
      gsap.to(button, {
        x: '+=10',
        duration: 0.1,
        yoyo: true,
        repeat: 3,
        ease: 'power2.inOut'
      })
      return
    }
    
    const newX = minX + Math.random() * (maxX - minX)
    const newY = minY + Math.random() * (maxY - minY)
    
    // Check if button is being cornered (near edges)
    const isNearEdge = newX < 50 || newX > containerWidth - buttonWidth - 50 || 
                      newY < 50 || newY > containerHeight - buttonHeight - 50
    
    if (isNearEdge) {
      setCorneredCount(prev => prev + 1)
      if (corneredCount >= 8) {
        handleSecretWin('cornering')
        return
      }
    }
    
    gsap.to(button, {
      x: newX,
      y: newY,
      duration: 0.2 + Math.random() * 0.3,
      ease: 'power2.out'
    })
    
    soundManager.playError?.()
  }

  const handleTrapButtonHover = () => {
    moveButtonSafely()
    setTrapClicks(prev => prev + 1)
    
    // Screen shake effect (mild)
    if (trapClicks > 10) {
      gsap.to(puzzleAreaRef.current, {
        x: Math.random() * 6 - 3,
        y: Math.random() * 6 - 3,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(puzzleAreaRef.current, { x: 0, y: 0 })
        }
      })
    }
  }

  const handleTrapButtonClick = (e) => {
    e.preventDefault()
    
    const currentTime = Date.now()
    if (currentTime - lastClickTime < 200) {
      setRapidClickCount(prev => prev + 1)
      if (rapidClickCount >= 10) {
        handleSecretWin('rapidfire')
        return
      }
    } else {
      setRapidClickCount(0)
    }
    setLastClickTime(currentTime)
    
    // Special click behavior for disabled state
    if (currentTrick === 'disabled') {
      gsap.to(trapButtonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      })
    }
    
    moveButtonSafely()
    setAttempts(prev => prev + 1)
    
    // Activate waiting mode after many failed attempts
    if (attempts >= 15 && !waitingMode && Math.random() < 0.3) {
      setWaitingMode(true)
      setWaitingProgress(0)
    }
    
    if (isCompetitionMode && attempts >= 25) {
      loseLife()
    }
  }

  const handleSecretWin = (method) => {
    if (!found) {
      setFound(true)
      setShowSecretWin(method)
      addWord('endless')
      
      if (isCompetitionMode) {
        completePuzzle('trick', 'genius')
        soundManager.playComplete?.()
      }
      
      celebrateWin(method)
    }
  }

  const celebrateWin = (method) => {
    gsap.fromTo('.success-message',
      { scale: 0, rotation: 360, opacity: 0 },
      { 
        scale: 1, 
        rotation: 0, 
        opacity: 1,
        duration: 1.5, 
        ease: 'elastic.out(1, 0.3)',
        onComplete: createCelebration
      }
    )
  }

  const handleRealButtonClick = () => {
    if (!found) {
      setFound(true)
      addWord('endless')
      
      if (isCompetitionMode) {
        completePuzzle('trick', 'master')
        soundManager.playComplete?.()
      }
      
      celebrateWin('traditional')
    }
  }

  const createCelebration = () => {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: fixed;
        width: ${4 + Math.random() * 8}px;
        height: ${4 + Math.random() * 8}px;
        background: ${['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726', '#AB47BC', '#66BB6A'][Math.floor(Math.random() * 6)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: 50%;
        top: 50%;
      `
      
      document.body.appendChild(particle)
      
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 720,
        duration: 2 + Math.random(),
        ease: 'power2.out',
        onComplete: () => particle.remove()
      })
    }
  }

  const getWinMethodMessage = () => {
    switch (showSecretWin) {
      case 'konami': return '🎮 KONAMI CODE MASTER! You found the secret cheat code!'
      case 'patience': return '🧘 ZEN MASTER! You won by doing absolutely nothing!'
      case 'cornering': return '🏹 STRATEGIC GENIUS! You cornered the button systematically!'
      case 'rapidfire': return '⚡ SPEED DEMON! Your rapid-fire clicking overwhelmed the button!'
      case 'endless': return '💪 ULTIMATE endless! You outlasted every trick!'
      default: return '🏆 CHAMPION! You conquered the trickster button!'
    }
  }

  const getTrickDescription = () => {
    if (waitingMode) return `Patience Test: ${waitingProgress}% - Stop clicking and wait! 🧘`
    
    switch (currentTrick) {
      case 'shrinking': return 'Button is smaller but still catchable! 🔍'
      case 'invisible': return 'Button is translucent! 👻'
      case 'spinning': return 'Button is spinning wildly! 🌪️'
      case 'disabled': return 'Button appears disabled! 🚫'
      case 'multiplying': return 'Multiple buttons appeared! 👥'
      case 'gigantic': return 'Button became large! 🦣'
      default: return 'Button is playing tricks! 🎭'
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-purple-900 via-red-900 to-pink-900 p-8 relative overflow-hidden">
      <CompetitionTimer 
        timeLimit={300} 
        onTimeUp={handleTimeUp}
        puzzleId="trick"
      />
      <CompetitionHints hints={hints} maxHints={4} />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-red-400 opacity-20 text-2xl animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {['⚠️', '😈', '🎭', '👻', '⚡', '🌪️', '🎮', '🧘'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <div className="inline-block bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 mb-6">
            <h1 className="text-6xl font-bold text-red-400 mb-4 drop-shadow-lg">
              🎭 The Multi-Solution Trickster
            </h1>
            <p className="text-2xl text-gray-300 mb-4 font-light">
              Multiple ways to win! endless, patience, strategy, or secrets!
            </p>
            <div className="text-sm text-red-300 bg-red-900/30 px-4 py-2 rounded-full inline-block">
              Status: {getTrickDescription()}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-3xl font-semibold mb-6 text-purple-400 flex items-center">
              <span className="mr-3">🎯</span>
              Multiple Win Conditions!
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                This button has multiple ways to defeat it! Try different strategies:
              </p>
              
              <div className="space-y-3">
                <div className="bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded">
                  <p className="text-blue-200 text-sm">
                    🏹 <strong>Corner Strategy:</strong> Force the button to edges systematically
                  </p>
                </div>
                
                <div className="bg-green-900/30 border-l-4 border-green-500 p-3 rounded">
                  <p className="text-green-200 text-sm">
                    ⚡ <strong>Rapid Fire:</strong> Click extremely fast to overwhelm it
                  </p>
                </div>
                
                <div className="bg-purple-900/30 border-l-4 border-purple-500 p-3 rounded">
                  <p className="text-purple-200 text-sm">
                    🧘 <strong>Zen Mode:</strong> Sometimes patience wins over endless
                  </p>
                </div>
                
                <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-3 rounded">
                  <p className="text-yellow-200 text-sm">
                    🎮 <strong>Secret Code:</strong> Try the Konami code!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-red-500/50">
            <h3 className="text-xl font-semibold mb-4 text-red-400 flex items-center">
              <span className="mr-2">📊</span>
              Challenge Progress
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Hover Attempts:</span>
                <span className="text-red-400 font-bold">{trapClicks}/20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Click Attempts:</span>
                <span className="text-orange-400 font-bold">{attempts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cornering Progress:</span>
                <span className="text-blue-400 font-bold">{corneredCount}/8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Rapid Clicks:</span>
                <span className="text-green-400 font-bold">{rapidClickCount}/10</span>
              </div>
              
              {waitingMode && (
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-purple-300">Patience Test:</span>
                    <span className="text-purple-400 font-bold">{waitingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${waitingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-400 text-center mt-1">
                    Stop clicking and wait! 🧘
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Puzzle Area with Safe Boundaries */}
        <div 
          ref={puzzleAreaRef}
          className="bg-gray-900/60 backdrop-blur-lg rounded-2xl p-16 border border-gray-700/50 mb-8 relative min-h-[500px] overflow-hidden"
        >
          <h3 className="text-2xl font-semibold mb-8 text-white text-center">
            Find Your Way to Victory!
          </h3>
          
          {/* Decoy Buttons - positioned safely */}
          {showDecoyButtons && !showRealButton && [...Array(3)].map((_, i) => (
            <button
              key={i}
              onClick={() => soundManager.playError?.()}
              className="absolute bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 px-4 py-2 rounded-lg font-bold text-sm text-white shadow-xl transform transition-all duration-200 hover:scale-105 cursor-pointer opacity-70"
              style={{ 
                left: `${25 + (i * 25)}%`, 
                top: `${25 + (i % 2) * 30}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              Decoy!
            </button>
          ))}
          
          {/* Main Trap Button - Always stays in bounds */}
          {!showRealButton && (
            <button
              ref={trapButtonRef}
              onMouseEnter={handleTrapButtonHover}
              onClick={handleTrapButtonClick}
              className={`absolute font-bold text-lg text-white shadow-2xl transform transition-all duration-200 cursor-pointer rounded-xl
                ${isFakeDisabled 
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:scale-105'
                }
                ${isSpinning ? 'animate-spin' : ''}
              `}
              style={{ 
                left: '50%', 
                top: '50%', 
                transform: `translate(-50%, -50%) scale(${buttonSize})`,
                opacity: isInvisible ? 0.3 : 1,
                padding: currentTrick === 'gigantic' ? '16px 24px' : '12px 20px',
                fontSize: currentTrick === 'gigantic' ? '1.25rem' : '1rem'
              }}
            >
              <span className="flex items-center justify-center whitespace-nowrap">
                <span className="mr-2">🎯</span>
                {currentTrick === 'disabled' ? 'Disabled' : 'Catch Me!'}
                <span className="ml-2">
                  {currentTrick === 'gigantic' ? '🦣' : 
                   currentTrick === 'invisible' ? '👻' :
                   currentTrick === 'spinning' ? '🌪️' : '→'}
                </span>
              </span>
            </button>
          )}

          {/* Real Button */}
          {showRealButton && (
            <button
              ref={buttonRef}
              onClick={handleRealButtonClick}
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl font-bold text-lg text-white shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-yellow-400"
            >
              <span className="flex items-center">
                <span className="mr-3">🏆</span>
                THE REAL BUTTON
                <span className="ml-3">✨</span>
              </span>
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center max-w-md">
            <p className="text-gray-400 text-sm">
              {!showRealButton 
                ? getTrickDescription()
                : "🎉 You found a way to win! Click the REAL button! 🎉"
              }
            </p>
          </div>
        </div>

        {/* Success Message */}
        {found && (
          <div className="success-message text-center mb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 shadow-2xl border-2 border-green-400">
              <div className="text-6xl mb-4">
                {showSecretWin === 'konami' ? '🎮' : 
                 showSecretWin === 'patience' ? '🧘' :
                 showSecretWin === 'cornering' ? '🏹' :
                 showSecretWin === 'rapidfire' ? '⚡' : '🏆'}
              </div>
              <h3 className="text-4xl font-bold mb-3 text-white">
                {getWinMethodMessage()}
              </h3>
              <p className="text-xl text-green-100 mb-4">
                You've earned the word: 
                <span className="font-bold text-yellow-300 text-2xl"> "endless"</span>
              </p>
              <div className="inline-block bg-green-800 px-6 py-3 rounded-full text-lg font-semibold">
                🎭 Victory Achieved! 🎭
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-white shadow-lg"
          >
            <span className="mr-2">←</span>
            Back to Hub
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TrickPuzzle