import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const LoadingScreen = ({ onComplete }) => {
  const containerRef = useRef()
  const logoRef = useRef()
  const progressRef = useRef()
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing Escape Web...')

  const loadingSteps = [
    'Initializing Escape Web...',
    'Loading puzzle chambers...',
    'Encrypting secret words...',
    'Preparing challenges...',
    'Calibrating difficulty...',
    'Almost ready...',
    'Welcome to Escape Web!'
  ]

  useEffect(() => {
    // Animate the logo entrance
    gsap.fromTo(logoRef.current,
      { scale: 0, rotation: 180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.3)' }
    )

    // Progress simulation
    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStep])
        setProgress((currentStep + 1) * (100 / loadingSteps.length))
        currentStep++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          // Exit animation
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: onComplete
          })
        }, 500)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center z-[9999]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Logo */}
        <div ref={logoRef} className="mb-8">
          <div className="text-8xl mb-4 animate-bounce">🕳️</div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ESCAPE WEB
          </h1>
          <p className="text-xl text-gray-300 mt-4">A Gamified Digital Escape Room</p>
        </div>

        {/* Loading Progress */}
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="text-cyan-400 font-medium text-lg mb-2">{loadingText}</div>
            <div className="text-gray-400 text-sm">{Math.round(progress)}% Complete</div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
            <div 
              ref={progressRef}
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-3 rounded-full transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 max-w-lg mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">💡 Quick Tips</h3>
            <ul className="text-sm text-gray-300 space-y-1 text-left">
              <li>• Use F12 to open Developer Tools</li>
              <li>• Look for hidden comments in HTML source</li>
              <li>• Check the browser console for messages</li>
              <li>• Hover over elements to find interactions</li>
              <li>• Try different commands in the terminal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
