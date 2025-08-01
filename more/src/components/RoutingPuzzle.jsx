import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

const RoutingPuzzle = ({ addWord }) => {
  const containerRef = useRef()
  const [showModal, setShowModal] = useState(false)
  const [found, setFound] = useState(false)
  const modalRef = useRef()

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    )
  }, [])

  const handleCorrectLink = () => {
    setShowModal(true)
    gsap.fromTo(modalRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )
  }

  const handleWrongLink = (linkName) => {
    // Redirect to 404 or show error
    window.location.href = '/404'
  }

  const collectWord = () => {
    if (!found) {
      setFound(true)
      addWord('to')
      setShowModal(false)
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-400 mb-4">🧭 Lost in Navigation</h1>
          <p className="text-xl text-gray-300 mb-8">
            Sometimes the error page is the right direction.
          </p>
        </header>

        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Navigation Maze</h2>
          
          <p className="text-gray-300 mb-8 text-center">
            Choose your path wisely. Only one of these links will lead you to the treasure. 
            The others will lead you astray...
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Wrong links */}
            <button
              onClick={() => handleWrongLink('docs')}
              className="bg-gray-700 hover:bg-red-700 p-6 rounded-lg transition-all transform hover:scale-105 text-left"
            >
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold text-blue-400">Documentation</h3>
              <p className="text-sm text-gray-400">Read the manual</p>
              <div className="text-xs text-purple-400 mt-2">→ /docs/guide</div>
            </button>

            <button
              onClick={() => handleWrongLink('api')}
              className="bg-gray-700 hover:bg-red-700 p-6 rounded-lg transition-all transform hover:scale-105 text-left"
            >
              <div className="text-3xl mb-2">🔌</div>
              <h3 className="font-semibold text-blue-400">API Reference</h3>
              <p className="text-sm text-gray-400">Explore endpoints</p>
              <div className="text-xs text-purple-400 mt-2">→ /api/v1</div>
            </button>

            <button
              onClick={() => handleWrongLink('about')}
              className="bg-gray-700 hover:bg-red-700 p-6 rounded-lg transition-all transform hover:scale-105 text-left"
            >
              <div className="text-3xl mb-2">ℹ️</div>
              <h3 className="font-semibold text-blue-400">About Us</h3>
              <p className="text-sm text-gray-400">Learn our story</p>
              <div className="text-xs text-purple-400 mt-2">→ /about</div>
            </button>

            <button
              onClick={() => handleWrongLink('contact')}
              className="bg-gray-700 hover:bg-red-700 p-6 rounded-lg transition-all transform hover:scale-105 text-left"
            >
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-semibold text-blue-400">Contact</h3>
              <p className="text-sm text-gray-400">Get in touch</p>
              <div className="text-xs text-purple-400 mt-2">→ /contact</div>
            </button>

            {/* Correct link */}
            <button
              onClick={handleCorrectLink}
              className="bg-gray-700 hover:bg-green-700 p-6 rounded-lg transition-all transform hover:scale-105 text-left border-2 border-yellow-500"
            >
              <div className="text-3xl mb-2">💀</div>
              <h3 className="font-semibold text-yellow-400">Error Page</h3>
              <p className="text-sm text-gray-400">Something went wrong</p>
              <div className="text-xs text-purple-400 mt-2">→ /404</div>
            </button>

            <button
              onClick={() => handleWrongLink('blog')}
              className="bg-gray-700 hover:bg-red-700 p-6 rounded-lg transition-all transform hover:scale-105 text-left"
            >
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-semibold text-blue-400">Blog</h3>
              <p className="text-sm text-gray-400">Latest updates</p>
              <div className="text-xs text-purple-400 mt-2">→ /blog</div>
            </button>
          </div>

          <div className="bg-purple-900 p-4 rounded border-l-4 border-purple-500">
            <p className="text-purple-300">
              💡 Hint: "Sometimes the error page is the right direction." 
              Which path would typically be considered an "error"?
            </p>
          </div>
        </div>

        {found && (
          <div className="text-center mb-8 p-4 bg-green-600 rounded-lg">
            <h3 className="text-xl font-bold">🎉 Perfect Navigation!</h3>
            <p>You found the word: <strong>"to"</strong></p>
            <p className="text-sm mt-2">Word 5/6 collected!</p>
          </div>
        )}

        <div className="text-center">
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
            ← Back to Hub
          </Link>
        </div>
      </div>

      {/* Modal for correct choice */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-gray-800 p-8 rounded-lg max-w-md mx-4">
            <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">
              🎉 Excellent Choice!
            </h3>
            <p className="text-gray-300 mb-4 text-center">
              You chose the error page - the path that others might avoid! 
              Sometimes the unconventional route leads to treasure.
            </p>
            <div className="bg-yellow-900 p-4 rounded mb-4">
              <p className="text-yellow-300 text-center font-bold">
                Hidden Word: "to"
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={collectWord}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Collect Word
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoutingPuzzle
