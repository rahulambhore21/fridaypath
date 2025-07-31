import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

const NotFound = () => {
  const containerRef = useRef()
  const glitchRef = useRef()

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    )

    // Glitch effect animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
    tl.to(glitchRef.current, {
      x: 2,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: 'power2.inOut'
    })
    .to(glitchRef.current, {
      x: -2,
      duration: 0.1,
      repeat: 3,
      yoyo: true,
      ease: 'power2.inOut'
    })
    .to(glitchRef.current, {
      x: 0,
      duration: 0.1
    })
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h1 ref={glitchRef} className="text-8xl font-bold text-red-400 mb-4 font-mono">
            404
          </h1>
          <h2 className="text-4xl font-bold text-white mb-6">
            Lost in the Digital Void
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            The page you're looking for doesn't exist... or does it? 🤔
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-cyan-400">
            🚨 System Error Detected
          </h3>
          <div className="bg-black p-4 rounded font-mono text-left mb-6">
            <div className="text-red-400">ERROR 404: Page not found</div>
            <div className="text-yellow-400">Searching for: {window.location.pathname}</div>
            <div className="text-green-400">Status: Not found in database</div>
            <div className="text-blue-400">Suggestion: Return to safe zone</div>
          </div>
          
          <div className="text-gray-400 text-sm mb-6">
            💡 In the Routing Puzzle, sometimes the error page IS the right direction...
            but this one just means you took a wrong turn!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-700 p-6 rounded-lg">
            <h4 className="font-semibold text-purple-400 mb-2">🎮 Back to Game</h4>
            <p className="text-sm text-gray-300 mb-4">
              Return to the escape room hub and continue your puzzle-solving adventure.
            </p>
            <Link 
              to="/" 
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold transition-colors inline-block"
            >
              Return to Hub
            </Link>
          </div>
          
          <div className="bg-gray-700 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-400 mb-2">🔍 Lost Something?</h4>
            <p className="text-sm text-gray-300 mb-4">
              Check if you've collected all 6 words and formed the correct final URL.
            </p>
            <div className="text-xs text-yellow-400">
              Hint: /unlock-the-gate
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-block bg-red-800 p-4 rounded-lg">
            <div className="text-2xl mb-2">🌀</div>
            <div className="text-red-300 text-sm">
              "Not all who wander are lost, but you definitely are right now."
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
