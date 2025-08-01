import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import soundManager from '../utils/soundManager'
import SettingsPanel from './SettingsPanel'
import CompetitionModal from './CompetitionModal'
import { useCompetition } from '../context/CompetitionContext'

const HomePage = ({ collectedWords }) => {
  const containerRef = useRef()
  const titleRef = useRef()
  const cardsRef = useRef()
  const particlesRef = useRef()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showCompetition, setShowCompetition] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  
  const { startCompetition, isCompetitionMode, currentPlayer, endCompetition } = useCompetition()

  useEffect(() => {
    // Enhanced title animation with glow effect
    gsap.fromTo(titleRef.current, 
      { opacity: 0, y: -50, scale: 0.8 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 1.5,
        ease: 'elastic.out(1, 0.3)'
      }
    )
    
    // Staggered card animations with bounce effect
    gsap.fromTo(cardsRef.current.children,
      { opacity: 0, y: 50, scale: 0.8, rotationX: 45 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        rotationX: 0,
        duration: 1, 
        stagger: 0.15, 
        delay: 0.5,
        ease: 'back.out(1.7)'
      }
    )

    // Floating animation for title
    gsap.to(titleRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // Create floating particles
    createParticles()

    // Mouse move effect
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Play achievement sound when words are collected
  useEffect(() => {
    if (collectedWords.length > 0 && soundEnabled) {
      soundManager.playNotification()
    }
    if (collectedWords.length === 6 && soundEnabled) {
      setTimeout(() => soundManager.playAchievement(), 500)
    }
  }, [collectedWords.length, soundEnabled])

  const toggleSound = () => {
    const enabled = soundManager.toggle()
    setSoundEnabled(enabled)
    if (enabled) {
      soundManager.playClick()
    }
  }

  const handleCardHover = () => {
    if (soundEnabled) {
      soundManager.playHover()
    }
  }

  const handleCardClick = () => {
    if (soundEnabled) {
      soundManager.playClick()
    }
  }

  const openSettings = () => {
    setShowSettings(true)
    if (soundEnabled) {
      soundManager.playClick()
    }
  }

  const closeSettings = () => {
    setShowSettings(false)
    if (soundEnabled) {
      soundManager.playClick()
    }
  }

  const openCompetition = () => {
    setShowCompetition(true)
    if (soundEnabled) {
      soundManager.playClick()
    }
  }

  const closeCompetition = () => {
    setShowCompetition(false)
  }

  const openLeaderboard = () => {
    setShowLeaderboard(true)
    if (soundEnabled) {
      soundManager.playClick()
    }
  }

  const closeLeaderboard = () => {
    setShowLeaderboard(false)
  }

  const handleStartCompetition = (playerName, difficulty) => {
    startCompetition(playerName, difficulty)
  }

  const handleEndCompetition = () => {
    endCompetition()
  }

  const createParticles = () => {
    const particles = []
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: #64ffda;
        pointer-events: none;
        border-radius: 50%;
        opacity: 0.7;
        z-index: 1;
      `
      particlesRef.current?.appendChild(particle)
      particles.push(particle)

      // Animate particles
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      })

      gsap.to(particle, {
        y: '-=100vh',
        duration: Math.random() * 10 + 5,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 5
      })

      gsap.to(particle, {
        x: `+=${Math.random() * 100 - 50}`,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
  }

  const puzzles = [
    { 
      path: '/source', 
      name: 'The Source of Truth', 
      description: 'What you see isn\'t all there is', 
      icon: '🔍',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-900/20 to-emerald-900/20',
      difficulty: 'Easy'
    },
    { 
      path: '/console', 
      name: 'Debug the Web', 
      description: 'Where devs talk, secrets spill', 
      icon: '🖥️',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20',
      difficulty: 'Medium'
    },
    { 
      path: '/encode', 
      name: 'The Encrypted Message', 
      description: 'Only the right decoder sees truth', 
      icon: '🔐',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-orange-900/20 to-red-900/20',
      difficulty: 'Medium'
    },
    { 
      path: '/routing', 
      name: 'Lost in Navigation', 
      description: 'Sometimes errors lead to answers', 
      icon: '🧭',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20',
      difficulty: 'Hard'
    },
    { 
      path: '/terminal', 
      name: 'Command the Web', 
      description: 'The right command unlocks paths', 
      icon: '⚡',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20',
      difficulty: 'Hard'
    },
    { 
      path: '/trick', 
      name: 'The Elusive Target', 
      description: 'Some buttons have a mind of their own', 
      icon: '🎯',
      color: 'from-pink-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-pink-900/20 to-red-900/20',
      difficulty: 'Expert'
    },
    { 
      path: '/hidden', 
      name: 'The Invisible Button', 
      description: 'Sometimes what you seek is hiding in plain sight', 
      icon: '👻',
      color: 'from-gray-500 to-slate-600',
      bgColor: 'bg-gradient-to-br from-gray-900/20 to-slate-900/20',
      difficulty: 'Expert'
    }
  ]

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900/30'
      case 'Medium': return 'text-yellow-400 bg-yellow-900/30'
      case 'Hard': return 'text-red-400 bg-red-900/30'
      case 'Expert': return 'text-purple-400 bg-purple-900/30'
      default: return 'text-gray-400 bg-gray-900/30'
    }
  }

  const isCompleted = (path) => {
    const wordMap = {
      '/source': 'unlock',
      '/hover': 'the',
      '/console': 'gate',
      '/encode': 'fire',
      '/routing': 'web',
      '/terminal': 'escape',
      '/trick': 'inspect',
      '/hidden': 'hidden'
    }
    return collectedWords.includes(wordMap[path])
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 relative overflow-hidden">
      {/* Particles Container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Cursor Trail Effect */}
      <div 
        className="fixed w-6 h-6 bg-cyan-400/30 rounded-full pointer-events-none z-50 transition-all duration-100 blur-sm"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'scale(1)'
        }}
      ></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Controls */}
        <div className="fixed top-4 right-4 z-50 flex space-x-3">
          {isCompetitionMode && (
            <button
              onClick={handleEndCompetition}
              className="bg-red-600/80 backdrop-blur-lg p-3 rounded-full border border-red-400 hover:border-red-300 transition-all duration-300 transform hover:scale-110"
              title="End Competition"
            >
              <span className="text-xl">🏁</span>
            </button>
          )}
          
          <button
            onClick={openLeaderboard}
            className="bg-yellow-600/80 backdrop-blur-lg p-3 rounded-full border border-yellow-400 hover:border-yellow-300 transition-all duration-300 transform hover:scale-110"
            title="View Leaderboard"
          >
            <span className="text-xl">🏆</span>
          </button>
          
          {!isCompetitionMode && (
            <button
              onClick={openCompetition}
              className="bg-purple-600/80 backdrop-blur-lg p-3 rounded-full border border-purple-400 hover:border-purple-300 transition-all duration-300 transform hover:scale-110"
              title="Start Competition Mode"
            >
              <span className="text-xl">⚡</span>
            </button>
          )}
          
          <button
            onClick={openSettings}
            className="bg-gray-800/80 backdrop-blur-lg p-3 rounded-full border border-gray-600 hover:border-purple-400 transition-all duration-300 transform hover:scale-110"
            title="Settings & Achievements"
          >
            <span className="text-xl">⚙️</span>
          </button>
          
          <button
            onClick={toggleSound}
            className="bg-gray-800/80 backdrop-blur-lg p-3 rounded-full border border-gray-600 hover:border-cyan-400 transition-all duration-300 transform hover:scale-110"
            title={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
          >
            <span className="text-xl">
              {soundEnabled ? '🔊' : '🔇'}
            </span>
          </button>
        </div>

        <header className="text-center mb-12">
          <h1 ref={titleRef} className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 drop-shadow-2xl filter">
            🕳️ ESCAPE WEB
          </h1>
          <div className="text-2xl text-gray-300 mb-6 font-light tracking-wide">
            A Gamified Digital Escape Room
          </div>
          
          {/* Enhanced Progress Section */}
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-gray-700/50">
            <div className="text-xl text-yellow-400 mb-4 font-semibold">
              Progress: {collectedWords.length}/6 Words Collected
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${(collectedWords.length / 6) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>

            {collectedWords.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {collectedWords.map((word, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg transform hover:scale-105 transition-all duration-200 animate-bounce"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    ✨ {word}
                  </div>
                ))}
              </div>
            )}

            {collectedWords.length === 6 && (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black p-6 rounded-2xl font-bold text-xl animate-pulse shadow-2xl">
                🎉 ALL WORDS COLLECTED! 🎉
                <div className="text-lg mt-2">Navigate to: <code className="bg-black/20 px-2 py-1 rounded">/unlock-the-gate</code></div>
              </div>
            )}
          </div>
        </header>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {puzzles.map((puzzle, index) => {
            const completed = isCompleted(puzzle.path)
            return (
              <Link
                key={puzzle.path}
                to={puzzle.path}
                onClick={handleCardClick}
                onMouseEnter={handleCardHover}
                className={`group relative bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 hover:bg-gray-700/60 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl border border-gray-700/50 hover:border-cyan-400/50 ${puzzle.bgColor} overflow-hidden card-hover`}
              >
                {/* Completion Badge */}
                {completed && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    ✓ COMPLETED
                  </div>
                )}

                {/* Difficulty Badge */}
                <div className={`absolute top-4 left-4 text-xs px-2 py-1 rounded-full font-semibold ${getDifficultyColor(puzzle.difficulty)}`}>
                  {puzzle.difficulty}
                </div>

                {/* Icon with enhanced animation */}
                <div className="text-6xl mb-6 group-hover:animate-bounce transition-all duration-300 filter group-hover:drop-shadow-lg">
                  {puzzle.icon}
                </div>

                {/* Content */}
                <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${puzzle.color} bg-clip-text text-transparent`}>
                  {puzzle.name}
                </h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  {puzzle.description}
                </p>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div className={`bg-gradient-to-r ${puzzle.color} text-white px-4 py-2 rounded-lg font-medium text-sm group-hover:shadow-lg transition-all duration-300`}>
                    {completed ? 'Replay' : 'Enter'} Puzzle →
                  </div>
                  {completed && <div className="text-2xl">🏆</div>}
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </Link>
            )
          })}
        </div>

        <footer className="text-center mt-16 text-gray-400">
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/30">
            {isCompetitionMode ? (
              <div className="space-y-4">
                <div className="text-lg text-yellow-400 font-semibold">
                  🏆 Competition Mode Active
                </div>
                <div className="text-sm">
                  Player: <span className="text-white font-semibold">{currentPlayer}</span>
                </div>
                <div className="text-xs">
                  Complete puzzles quickly to maximize your score!
                </div>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-2">🎯 Solve each puzzle to collect hidden words</p>
                <p className="text-sm">Combine them to unlock the final challenge!</p>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <button
                    onClick={openCompetition}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-white"
                  >
                    🏆 Start Competition Mode
                  </button>
                </div>
              </div>
            )}
          </div>
        </footer>
      </div>

     
      {/* Competition Modal */}
      
    </div>
  )
}

export default HomePage
