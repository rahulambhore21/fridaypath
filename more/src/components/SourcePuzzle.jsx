import { useEffect, useRef, useState } from 'react'
import { Eye, Code, Search, Zap, Shield, Terminal, Cpu, Lock } from 'lucide-react'

const SourcePuzzle = ({ addWord }) => {
  const containerRef = useRef()
  const scanLineRef = useRef()
  const codeBlockRef = useRef()
  const matrixRef = useRef()
  const glitchRef = useRef()
  
  const [found, setFound] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [hackingProgress, setHackingProgress] = useState(0)
  const [showMatrix, setShowMatrix] = useState(true)
  const [pulseIntensity, setPulseIntensity] = useState(1)
  const [networkNodes, setNetworkNodes] = useState([])
  const [scanningTarget, setScanningTarget] = useState('')
  const [decryptionPhase, setDecryptionPhase] = useState(0)

  const hints = [
    "🔍 CLASSIFIED: Digital breadcrumbs often hide in the source architecture...",
    "🛡️ INTEL: Machine-readable comments contain the most sensitive data",
    "⚡ BREACH: Look beyond the visual layer - examine the DOM foundation"
  ]

  // Initialize network visualization
  useEffect(() => {
    const nodes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      connected: Math.random() > 0.5,
      pulse: Math.random() * 2
    }))
    setNetworkNodes(nodes)
  }, [])

  // Matrix rain effect
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.zIndex = '1'
    canvas.style.pointerEvents = 'none'
    canvas.style.opacity = '0.1'
    
    if (matrixRef.current) {
      matrixRef.current.appendChild(canvas)
    }

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const drops = Array(Math.floor(canvas.width / 20)).fill(0)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff41'
      ctx.font = '15px monospace'
      
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * 20, y)
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 20
      })
    }

    const interval = setInterval(draw, 50)
    return () => {
      clearInterval(interval)
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }, [])

  // Advanced scanning animation
  useEffect(() => {
    const scanTargets = [
      'Analyzing DOM structure...',
      'Scanning HTML headers...',
      'Probing comment blocks...',
      'Detecting hidden elements...',
      'BREACH DETECTED!'
    ]

    let index = 0
    const scanInterval = setInterval(() => {
      setScanningTarget(scanTargets[index])
      index = (index + 1) % scanTargets.length
    }, 2000)

    return () => clearInterval(scanInterval)
  }, [])

  // Dramatic entrance animation
  useEffect(() => {
    if (containerRef.current) {
      // Create spectacular entrance
      containerRef.current.style.transform = 'scale(0) rotateY(180deg)'
      containerRef.current.style.opacity = '0'
      
      setTimeout(() => {
        containerRef.current.style.transition = 'all 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        containerRef.current.style.transform = 'scale(1) rotateY(0deg)'
        containerRef.current.style.opacity = '1'
      }, 100)
    }

    // Add hidden comment to actual DOM
    const comment = document.createComment(' CLASSIFIED_PAYLOAD: unlock ')
    document.head.appendChild(comment)

    // Pulse effect
    const pulseInterval = setInterval(() => {
      setPulseIntensity(prev => prev === 1 ? 1.5 : 1)
    }, 2000)

    // Progressive typing with glitch effects
    setTimeout(() => {
      if (codeBlockRef.current) {
        initiateHackingSequence()
      }
    }, 2000)

    return () => {
      clearInterval(pulseInterval)
      if (document.head.contains(comment)) {
        document.head.removeChild(comment)
      }
    }
  }, [])

  const initiateHackingSequence = () => {
    const sequences = [
      `> INITIATING BREACH PROTOCOL...
> BYPASSING SECURITY LAYERS...
> ACCESSING SOURCE ARCHITECTURE...`,
      `<html>
  <head>
    <meta charset="utf-8">
    <title>CLASSIFIED SYSTEM</title>`,
      `    <!-- SCANNING FOR ANOMALIES... -->
    <!-- DETECTING HIDDEN PAYLOADS... -->
    <!-- CLASSIFIED_PAYLOAD: unlock -->`,
      `    <link rel="stylesheet" href="security.css">
  </head>
  <body class="encrypted">
    <div id="mainframe">
      <h1>🔒 SECURE TERMINAL ACCESS</h1>
    </div>
  </body>
</html>`
    ]

    let sequenceIndex = 0
    let charIndex = 0
    let currentText = ''

    const typeSequence = () => {
      if (sequenceIndex >= sequences.length) {
        setTimeout(highlightPayload, 1000)
        return
      }

      const currentSequence = sequences[sequenceIndex]
      
      if (charIndex < currentSequence.length) {
        currentText += currentSequence[charIndex]
        
        // Add glitch effect occasionally
        if (Math.random() < 0.02) {
          const glitchChars = '█▓▒░@#$%^&*'
          const glitch = glitchChars[Math.floor(Math.random() * glitchChars.length)]
          codeBlockRef.current.textContent = currentText + glitch
          setTimeout(() => {
            codeBlockRef.current.textContent = currentText + currentSequence[charIndex]
          }, 50)
        } else {
          codeBlockRef.current.textContent = currentText + currentSequence[charIndex]
        }
        
        charIndex++
        setTimeout(typeSequence, Math.random() * 50 + 20)
      } else {
        sequenceIndex++
        charIndex = 0
        currentText += '\n\n'
        setTimeout(typeSequence, 500)
      }
    }

    typeSequence()
  }

  const highlightPayload = () => {
    if (codeBlockRef.current) {
      const content = codeBlockRef.current.textContent
      const highlighted = content.replace(
        /(<!-- CLASSIFIED_PAYLOAD: unlock -->)/g,
        '<span class="bg-red-500 text-yellow-300 px-2 py-1 rounded font-bold animate-pulse shadow-lg border-2 border-yellow-400">🔥 $1 🔥</span>'
      )
      codeBlockRef.current.innerHTML = highlighted
      
      // Add dramatic pulsing effect
      const payloadElement = codeBlockRef.current.querySelector('span')
      if (payloadElement) {
        payloadElement.style.animation = 'pulse 0.5s infinite, glow 2s infinite'
      }
    }
  }

  const handleFoundWord = () => {
    if (!found) {
      setFound(true)
      addWord('unlock')
      setIsScanning(true)
      
      // Epic success sequence
      initiateSuccessSequence()
      createSpectacularConfetti()
      triggerScreenGlitch()
      
    } else {
      setAttempts(prev => prev + 1)
      triggerFailureEffect()
    }
  }

  const initiateSuccessSequence = () => {
    setDecryptionPhase(1)
    
    // Simulate hacking progress
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15 + 5
      setHackingProgress(Math.min(100, progress))
      
      if (progress >= 100) {
        clearInterval(progressInterval)
        setDecryptionPhase(2)
      }
    }, 100)
  }

  const createSpectacularConfetti = () => {
    const colors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff', '#ffff00']
    
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div')
        confetti.innerHTML = ['🔓', '💎', '⚡', '🔥', '✨', '💥'][Math.floor(Math.random() * 6)]
        confetti.style.cssText = `
          position: fixed;
          font-size: ${Math.random() * 20 + 15}px;
          top: ${Math.random() * 100}vh;
          left: ${Math.random() * 100}vw;
          pointer-events: none;
          z-index: 10000;
          animation: confetti-explosion ${2 + Math.random() * 2}s ease-out forwards;
        `
        
        document.body.appendChild(confetti)
        
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti)
          }
        }, 4000)
      }, i * 50)
    }
  }

  const triggerScreenGlitch = () => {
    if (glitchRef.current) {
      glitchRef.current.style.animation = 'screen-glitch 0.5s ease-in-out'
      setTimeout(() => {
        glitchRef.current.style.animation = ''
      }, 500)
    }
  }

  const triggerFailureEffect = () => {
    // Red flash effect
    document.body.style.animation = 'error-flash 0.3s ease-in-out'
    setTimeout(() => {
      document.body.style.animation = ''
    }, 300)
  }

  return (
    <>
      <style jsx>{`
        @keyframes confetti-explosion {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-200px) rotate(720deg); opacity: 0; }
        }
        @keyframes screen-glitch {
          0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
          20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
          40% { transform: translate(-2px, -2px); filter: hue-rotate(180deg); }
          60% { transform: translate(2px, 2px); filter: hue-rotate(270deg); }
          80% { transform: translate(2px, -2px); filter: hue-rotate(360deg); }
        }
        @keyframes error-flash {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(255, 0, 0, 0.1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px #ff0000; }
          50% { box-shadow: 0 0 40px #ff0000, 0 0 60px #ff4444; }
        }
        .network-node {
          transition: all 0.3s ease;
        }
        .network-node:hover {
          transform: scale(1.5);
          filter: brightness(2);
        }
      `}</style>

      <div ref={glitchRef} ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
        <div ref={matrixRef} className="absolute inset-0" />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400">
            <div 
              ref={scanLineRef} 
              className="w-20 h-full bg-white shadow-2xl"
              style={{
                animation: 'scanning 3s linear infinite',
                boxShadow: '0 0 30px rgba(255,255,255,0.8)'
              }}
            />
          </div>
        </div>

        {/* Network visualization background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            {networkNodes.map((node, i) => (
              <g key={node.id}>
                {networkNodes.slice(i + 1).map((otherNode, j) => (
                  Math.hypot(node.x - otherNode.x, node.y - otherNode.y) < 30 && (
                    <line
                      key={`${i}-${j}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${otherNode.x}%`}
                      y2={`${otherNode.y}%`}
                      stroke="cyan"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  )
                ))}
                <circle
                  className="network-node"
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={node.size}
                  fill={node.connected ? "#00ff88" : "#ff0088"}
                  opacity="0.6"
                  style={{
                    animation: `pulse ${2 + node.pulse}s infinite`
                  }}
                />
              </g>
            ))}
          </svg>
        </div>

        <div className="relative z-10 p-8">
          {/* Elite header */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
              <div className="relative bg-black/80 backdrop-blur-lg rounded-3xl p-8 border-2 border-cyan-500">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-red-500 mr-3 animate-spin" />
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                    BREACH PROTOCOL
                  </h1>
                  <Terminal className="w-8 h-8 text-green-500 ml-3 animate-pulse" />
                </div>
                <div className="text-xl text-gray-300 mb-4 font-mono">
                  🔴 CLASSIFIED SYSTEM ACCESS REQUIRED
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="bg-red-900/50 px-3 py-1 rounded-full border border-red-500">
                    <Cpu className="w-4 h-4 inline mr-1" />
                    ELITE LEVEL
                  </div>
                  <div className="bg-green-900/50 px-3 py-1 rounded-full border border-green-500">
                    <Code className="w-4 h-4 inline mr-1" />
                    SOURCE EXPLOITATION
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission Control */}
            <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500/50">
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-purple-400">INFILTRATION BRIEFING</h2>
              </div>
              
              <div className="space-y-6 text-gray-300">
                <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-red-400 mr-2" />
                    <span className="font-bold text-red-300">⚠️ MISSION CRITICAL</span>
                  </div>
                  <p className="text-red-200 text-sm">
                    Target system contains classified payload in source architecture. 
                    Breach detection imminent.
                  </p>
                </div>

                <div className="bg-cyan-900/30 border-l-4 border-cyan-500 p-4 rounded">
                  <div className="flex items-center mb-2">
                    <Search className="w-5 h-5 text-cyan-400 mr-2" />
                    <span className="font-bold text-cyan-300">🔍 EXPLOITATION VECTOR</span>
                  </div>
                  <div className="text-cyan-200 text-sm space-y-1">
                    <p>• Activate Developer Console (F12)</p>
                    <p>• Navigate to Elements/Inspector</p>
                    <p>• Examine &lt;head&gt; section for anomalies</p>
                    <p>• Locate CLASSIFIED_PAYLOAD marker</p>
                  </div>
                </div>

                <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex items-center mb-2">
                    <Lock className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="font-bold text-yellow-300">⚡ CURRENT SCAN</span>
                  </div>
                  <p className="text-yellow-200 text-sm font-mono">
                    {scanningTarget}
                  </p>
                </div>
              </div>
            </div>

            {/* Code Terminal */}
            <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-500/50">
              <div className="flex items-center mb-4">
                <Terminal className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-400 font-mono text-sm">root@breach-protocol:~$</span>
              </div>
              <div className="bg-black rounded-lg p-4 font-mono text-xs overflow-hidden h-80">
                <pre ref={codeBlockRef} className="text-green-300 whitespace-pre-wrap leading-relaxed"></pre>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  LIVE BREACH ANALYSIS
                </div>
                <div className="text-gray-400">
                  STATUS: {found ? '🔓 BREACHED' : '🔒 SECURED'}
                </div>
              </div>
            </div>
          </div>

          {/* Hacking Interface */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-8 border-2 border-red-500/50">
              <h3 className="text-2xl font-bold text-center mb-6 text-white">
                EXECUTE BREACH PROTOCOL
              </h3>
              
              {hackingProgress > 0 && !found && (
                <div className="mb-6">
                  <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-green-500 h-full transition-all duration-300"
                      style={{ width: `${hackingProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-green-400 mt-2 font-mono">
                    DECRYPTION: {Math.floor(hackingProgress)}%
                  </p>
                </div>
              )}
              
              <div className="text-center">
                <button
                  onClick={handleFoundWord}
                  className="group relative bg-gradient-to-r from-red-600 via-purple-600 to-cyan-600 px-12 py-6 rounded-xl font-black text-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl text-white border-2 border-white/30 overflow-hidden"
                  style={{
                    animation: found ? 'none' : 'pulse 2s infinite',
                    transform: `scale(${pulseIntensity})`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center">
                    {found ? '🔓' : '💥'} 
                    {found ? 'SYSTEM BREACHED!' : 'INITIATE BREACH'}
                    <span className="ml-2 group-hover:translate-x-2 transition-transform">
                      {found ? '✅' : '⚡'}
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {found && decryptionPhase >= 2 && (
              <div className="mt-8 p-8 bg-gradient-to-r from-green-900 via-cyan-900 to-purple-900 rounded-2xl border-4 border-green-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-400/10 animate-pulse" />
                <div className="relative text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400">
                    BREACH SUCCESSFUL!
                  </h3>
                  <p className="text-2xl text-green-300 mb-4">
                    CLASSIFIED PAYLOAD EXTRACTED: 
                    <span className="font-bold text-yellow-300 ml-2">"unlock"</span>
                  </p>
                  <div className="inline-block bg-black/50 px-6 py-3 rounded-full text-lg font-bold border-2 border-yellow-400">
                    ⚡ WORD 1/6 SECURED ⚡
                  </div>
                  <div className="mt-4 text-sm text-gray-300">
                    Elite hacker status: CONFIRMED 🔥
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 text-white border border-white/30">
              ← RETURN TO MAINFRAME
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanning {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(calc(100vw + 100%)); }
        }
      `}</style>
    </>
  )
}

export default SourcePuzzle