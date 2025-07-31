import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

const EncodePuzzle = ({ addWord }) => {
  const containerRef = useRef()
  const [userInput, setUserInput] = useState('')
  const [decoded, setDecoded] = useState(false)
  const [attempts, setAttempts] = useState(0)

  // Base64 encoded word "fire" = "ZmlyZQ=="
  const encodedMessage = "ZmlyZQ=="
  const correctAnswer = "fire"

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    )
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setAttempts(prev => prev + 1)
    
    if (userInput.toLowerCase().trim() === correctAnswer) {
      setDecoded(true)
      addWord('fire')
      gsap.fromTo('.success-message',
        { scale: 0, rotation: 180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' }
      )
    } else {
      // Shake animation for wrong answer
      gsap.to('.decode-input', {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: 'power2.inOut'
      })
    }
  }

  const giveHint = () => {
    alert("Hint: Try decoding the Base64 string using online tools or JavaScript's atob() function!")
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-400 mb-4">🔐 The Encrypted Message</h1>
          <p className="text-xl text-gray-300 mb-8">
            Only the right decoder sees the truth.
          </p>
        </header>

        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Cipher Challenge</h2>
          
          <div className="bg-black rounded-lg p-6 mb-6 font-mono text-center">
            <h3 className="text-yellow-400 mb-4 text-lg">🔓 Encrypted Message:</h3>
            <div className="text-3xl text-green-400 tracking-wider bg-gray-900 p-4 rounded border-2 border-green-500">
              {encodedMessage}
            </div>
            <p className="text-gray-400 mt-2 text-sm">Base64 Encoded String</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">🧩 Decoding Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-semibold text-blue-400 mb-2">Method 1: Online Decoder</h4>
                <p className="text-sm text-gray-300">Search for "Base64 decoder" and paste the string</p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-semibold text-blue-400 mb-2">Method 2: Browser Console</h4>
                <p className="text-sm text-gray-300">Use: atob("ZmlyZQ==")</p>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-semibold text-blue-400 mb-2">Method 3: Terminal</h4>
                <p className="text-sm text-gray-300">echo "ZmlyZQ==" | base64 -d</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">
                Enter the decoded message:
              </label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="decode-input w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                placeholder="Type the decoded word here..."
                disabled={decoded}
              />
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                disabled={decoded}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {decoded ? "✅ Decoded!" : "Submit Answer"}
              </button>
              
              {attempts >= 2 && !decoded && (
                <button
                  type="button"
                  onClick={giveHint}
                  className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  💡 Need a Hint?
                </button>
              )}
            </div>
          </form>

          {attempts > 0 && !decoded && (
            <div className="text-center text-red-400 mb-4">
              Attempts: {attempts} - Keep trying!
            </div>
          )}

          {decoded && (
            <div className="success-message text-center p-4 bg-green-600 rounded-lg">
              <h3 className="text-xl font-bold">🎉 Message Decoded!</h3>
              <p>You found the word: <strong>"fire"</strong></p>
              <p className="text-sm mt-2">Word 4/6 collected!</p>
            </div>
          )}

          <div className="bg-orange-900 p-4 rounded border-l-4 border-orange-500 mt-6">
            <p className="text-orange-300">
              💡 Hint: Base64 is a common encoding method used in web development. 
              The string above contains a 4-letter word when decoded!
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
            ← Back to Hub
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EncodePuzzle
