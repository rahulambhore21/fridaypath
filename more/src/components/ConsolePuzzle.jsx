import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useCompetition } from '../context/CompetitionContext'
import soundManager from '../utils/soundManager'
import CompetitionTimer from './CompetitionTimer'
import CompetitionHints from './CompetitionHints'

const ConsolePuzzle = ({ addWord }) => {
  const containerRef = useRef()
  const cursorRef = useRef()
  const terminalRef = useRef()
  const matrixRef = useRef()
  const [found, setFound] = useState(false)
  const [hackingProgress, setHackingProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('scanning')
  const [terminalLines, setTerminalLines] = useState([])
  const [showHint, setShowHint] = useState(false)
  const [consoleChecked, setConsoleChecked] = useState(false)
  const [networkActivity, setNetworkActivity] = useState([])
  const [systemAlerts, setSystemAlerts] = useState([])
  const [decryptionProgress, setDecryptionProgress] = useState(0)
  
  const { startPuzzle, completePuzzle, loseLife, isCompetitionMode } = useCompetition()

  const hints = [
    "Real hackers always check the browser console first. Press F12!",
    "Look for colorful messages in the Console tab - they stand out for a reason.",
    "The system is trying to tell you something important. Listen carefully.",
    "Sometimes the most obvious place is the last place people look."
  ]

  const hackingPhrases = [
    'Scanning network topology...',
    'Bypassing firewall protocols...',
    'Injecting payload into system...',
    'Decrypting encrypted channels...',
    'Accessing restricted databases...',
    'Extracting sensitive information...',
    'Covering digital footprints...',
    'Mission accomplished.'
  ]

  const networkEvents = [
    { ip: '192.168.1.1', action: 'PING', status: 'SUCCESS' },
    { ip: '10.0.0.45', action: 'SSH_ATTEMPT', status: 'DENIED' },
    { ip: '172.16.0.1', action: 'PORT_SCAN', status: 'BLOCKED' },
    { ip: '203.0.113.1', action: 'DATA_PACKET', status: 'INTERCEPTED' },
    { ip: '198.51.100.1', action: 'HANDSHAKE', status: 'ESTABLISHED' }
  ]

  const handleTimeUp = () => {
    if (!found) {
      loseLife()
    }
  }

  useEffect(() => {
    if (isCompetitionMode) {
      startPuzzle('console')
    }

    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    )

    // Enhanced blinking cursor with glow effect
    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    })

    // Start the hacking simulation
    startHackingSequence()

    // Matrix rain effect
    createMatrixRain()

    // Initial console logs with dramatic effect
    setTimeout(() => {
      logSecretMessages()
    }, 2000)

  }, [isCompetitionMode])

  const startHackingSequence = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      setHackingProgress(Math.min(progress, 100))
      
      // Add terminal lines
      if (progress < 100) {
        const phrase = hackingPhrases[Math.floor((progress / 100) * hackingPhrases.length)]
        addTerminalLine(phrase, 'success')
        
        // Add network activity
        if (Math.random() < 0.3) {
          const event = networkEvents[Math.floor(Math.random() * networkEvents.length)]
          setNetworkActivity(prev => [...prev.slice(-4), {
            ...event,
            timestamp: new Date().toLocaleTimeString(),
            id: Date.now()
          }])
        }
        
        // Add system alerts
        if (Math.random() < 0.2) {
          const alerts = [
            'INTRUSION DETECTED',
            'SECURITY BREACH',
            'UNAUTHORIZED ACCESS',
            'FIREWALL BYPASSED',
            'DATA EXTRACTION IN PROGRESS'
          ]
          const alert = alerts[Math.floor(Math.random() * alerts.length)]
          setSystemAlerts(prev => [...prev.slice(-2), {
            message: alert,
            timestamp: new Date().toLocaleTimeString(),
            id: Date.now()
          }])
        }
      } else {
        addTerminalLine('SYSTEM COMPROMISED ✓', 'error')
        addTerminalLine('TARGET ACQUIRED: GATE PROTOCOL', 'warning')
        clearInterval(interval)
        setCurrentPhase('complete')
        setTimeout(() => setShowHint(true), 1000)
      }
    }, 800)
  }

  const addTerminalLine = (text, type = 'info') => {
    setTerminalLines(prev => [...prev.slice(-10), {
      text,
      type,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    }])
  }

  const createMatrixRain = () => {
    if (!matrixRef.current) return
    
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    
    for (let i = 0; i < 50; i++) {
      const drop = document.createElement('div')
      drop.textContent = characters[Math.floor(Math.random() * characters.length)]
      drop.style.cssText = `
        position: absolute;
        color: #00ff41;
        font-family: monospace;
        font-size: ${12 + Math.random() * 8}px;
        left: ${Math.random() * 100}%;
        top: -20px;
        opacity: ${0.3 + Math.random() * 0.7};
        pointer-events: none;
        z-index: 1;
      `
      
      matrixRef.current.appendChild(drop)
      
      gsap.to(drop, {
        y: window.innerHeight + 100,
        duration: 3 + Math.random() * 4,
        ease: 'none',
        delay: Math.random() * 2,
        repeat: -1,
        onRepeat: () => {
          drop.textContent = characters[Math.floor(Math.random() * characters.length)]
          drop.style.left = Math.random() * 100 + '%'
        }
      })
    }
  }

  const logSecretMessages = () => {
    // Clear previous logs
    console.clear()
    
    // ASCII Art Header
    console.log('%c╔══════════════════════════════════════╗', 'color: #00ff00; font-family: monospace;')
    console.log('%c║        🚨 SECURITY BREACH 🚨         ║', 'color: #ff0000; font-family: monospace; font-weight: bold;')
    console.log('%c╚══════════════════════════════════════╝', 'color: #00ff00; font-family: monospace;')
    
    // Fake system messages
    console.log('%c[SYSTEM] Unauthorized access detected...', 'color: #ff6b6b; background: #000; padding: 2px 5px;')
    console.log('%c[FIREWALL] Multiple intrusion attempts blocked', 'color: #ffa726; background: #000; padding: 2px 5px;')
    console.log('%c[DATABASE] Attempting to secure critical data...', 'color: #42a5f5; background: #000; padding: 2px 5px;')
    
    // The actual secret with dramatic reveal
    setTimeout(() => {
      console.log('%c🔓 ENCRYPTION KEY COMPROMISED 🔓', 'color: #00ff00; font-size: 18px; font-weight: bold; background: #000; padding: 5px;')
      console.log('%c🎯 TARGET ACQUIRED: "gate"', 'color: #ffff00; font-size: 16px; font-weight: bold; background: #ff0000; padding: 8px; border: 2px solid #ffff00;')
      console.log('%c📡 TRANSMISSION INTERCEPT: Word 3/6 located!', 'color: #00ffff; font-size: 14px; background: #000; padding: 5px;')
      
      // Extra misdirection
      console.log('%c[TRACE] Connection from: 127.0.0.1:8080', 'color: #666; font-size: 12px;')
      console.log('%c[DEBUG] Payload injection successful', 'color: #666; font-size: 12px;')
      console.log('%c[INFO] Clean exit protocol initiated', 'color: #666; font-size: 12px;')
      
      // Final message
      console.log('%c🎮 GAME TIP: Found the highlighted message? Click the button!', 'color: #9c27b0; font-size: 14px; font-weight: bold; background: #fff; padding: 5px;')
    }, 2000)
  }

  const handleFoundWord = () => {
    if (!found) {
      setFound(true)
      setConsoleChecked(true)
      addWord('gate')
      
      if (isCompetitionMode) {
        completePuzzle('console', 'detective')
        soundManager.playComplete?.()
      }
      
      // Epic success animation
      gsap.fromTo('.success-message',
        { scale: 0, rotation: 360, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.3)' }
      )
      
      // Terminal success messages
      addTerminalLine('MISSION ACCOMPLISHED ✓', 'success')
      addTerminalLine('GATE PROTOCOL ACQUIRED', 'success')
      addTerminalLine('AGENT STATUS: ELITE HACKER', 'success')
      
      // Celebration effect
      createHackingCelebration()
    }
  }

  const createHackingCelebration = () => {
    // Green matrix-style particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div')
      particle.textContent = ['0', '1', '🔓', '💻', '🎯'][Math.floor(Math.random() * 5)]
      particle.style.cssText = `
        position: fixed;
        color: #00ff00;
        font-family: monospace;
        font-size: ${16 + Math.random() * 10}px;
        font-weight: bold;
        left: 50%;
        top: 50%;
        pointer-events: none;
        z-index: 1000;
      `
      
      document.body.appendChild(particle)
      
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 400,
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 360,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      })
    }
  }

  const checkConsoleHint = () => {
    setShowHint(true)
    setTimeout(() => {
      console.log('%c🔍 HINT: Look above for the highlighted yellow message!', 'color: #ff9800; font-size: 16px; font-weight: bold; background: #000; padding: 5px;')
    }, 500)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 p-8 relative overflow-hidden">
      {/* Competition Mode Components */}
      <CompetitionTimer 
        timeLimit={240} 
        onTimeUp={handleTimeUp}
        puzzleId="console"
      />
      <CompetitionHints hints={hints} maxHints={3} />
      
      {/* Matrix Rain Effect */}
      <div ref={matrixRef} className="fixed inset-0 pointer-events-none opacity-20"></div>
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Floating code snippets */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 opacity-10 font-mono text-sm animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            {['console.log()', 'hack.exe', '127.0.0.1', 'sudo rm -rf', 'access granted', 'firewall.bypass()'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <div className="inline-block bg-black/60 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-green-500/30">
            <h1 className="text-6xl font-bold text-green-400 mb-4 drop-shadow-lg font-mono">
              🖥️ CYBER INFILTRATION
            </h1>
            <p className="text-2xl text-gray-300 mb-4 font-light">
              Breach the system. Extract the data. Leave no trace.
            </p>
            <div className="text-sm text-green-300 bg-green-900/30 px-4 py-2 rounded-full inline-block font-mono">
              STATUS: {currentPhase.toUpperCase()} | STEALTH MODE ACTIVE
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Hacking Terminal */}
          <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-6 border border-green-500/50">
            <h2 className="text-2xl font-semibold mb-4 text-green-400 flex items-center font-mono">
              <span className="mr-3">💻</span>
              TERMINAL ACCESS
            </h2>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-green-300 mb-2">
                <span>INFILTRATION PROGRESS</span>
                <span>{Math.round(hackingProgress)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${hackingProgress}%` }}
                >
                  <div className="h-full bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Terminal Output */}
            <div 
              ref={terminalRef}
              className="bg-black rounded-lg p-4 font-mono text-sm max-h-80 overflow-y-auto"
            >
              <div className="text-green-400 mb-2">
                root@hackbox:~$ ./infiltrate_system.sh
              </div>
              {terminalLines.map((line) => (
                <div 
                  key={line.id} 
                  className={`mb-1 ${
                    line.type === 'success' ? 'text-green-400' :
                    line.type === 'error' ? 'text-red-400' :
                    line.type === 'warning' ? 'text-yellow-400' :
                    'text-gray-300'
                  }`}
                >
                  <span className="text-gray-500">[{line.timestamp}]</span> {line.text}
                </div>
              ))}
              <div className="text-green-400 flex items-center">
                <span>root@hackbox:~$</span>
                <span ref={cursorRef} className="ml-1 bg-green-400 w-2 h-4 inline-block">_</span>
              </div>
            </div>
          </div>

          {/* System Monitor */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/50">
            <h3 className="text-2xl font-semibold mb-4 text-cyan-400 flex items-center font-mono">
              <span className="mr-3">📡</span>
              SYSTEM MONITOR
            </h3>
            
            {/* Network Activity */}
            <div className="mb-6">
              <h4 className="text-lg font-mono text-blue-400 mb-3">NETWORK ACTIVITY</h4>
              <div className="space-y-2">
                {networkActivity.map((event) => (
                  <div key={event.id} className="bg-black/50 p-2 rounded text-sm font-mono">
                    <span className="text-gray-400">{event.timestamp}</span>
                    <span className="text-yellow-400 mx-2">{event.ip}</span>
                    <span className="text-cyan-400">{event.action}</span>
                    <span className={`ml-2 ${
                      event.status === 'SUCCESS' ? 'text-green-400' :
                      event.status === 'DENIED' ? 'text-red-400' :
                      'text-orange-400'
                    }`}>
                      [{event.status}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Alerts */}
            <div>
              <h4 className="text-lg font-mono text-red-400 mb-3">SECURITY ALERTS</h4>
              <div className="space-y-2">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="bg-red-900/30 border border-red-500 p-2 rounded text-sm font-mono animate-pulse">
                    <span className="text-gray-400">{alert.timestamp}</span>
                    <span className="text-red-400 ml-2 font-bold">⚠️ {alert.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Investigation Panel */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-700/50">
          <h2 className="text-3xl font-semibold mb-6 text-yellow-400 flex items-center">
            <span className="mr-3">🔍</span>
            DIGITAL FORENSICS LAB
          </h2>
          
          <p className="text-gray-300 mb-6 text-lg leading-relaxed">
            The system has been compromised. Our infiltration is complete, but the target data needs to be extracted. 
            Intelligence suggests the hackers have left traces in the system's debug output. 
            <span className="text-yellow-400 font-semibold"> Check where developers log their secrets...</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-700/80 p-4 rounded-lg border border-gray-600">
              <h4 className="font-semibold text-blue-400 mb-2">🌐 Network</h4>
              <p className="text-sm text-gray-400">Packets intercepted</p>
              <div className="text-lg font-mono text-green-400">█████ 100%</div>
            </div>
            <div className="bg-gray-700/80 p-4 rounded-lg border border-gray-600">
              <h4 className="font-semibold text-blue-400 mb-2">🔧 Elements</h4>
              <p className="text-sm text-gray-400">DOM analyzed</p>
              <div className="text-lg font-mono text-green-400">█████ 100%</div>
            </div>
            <div className="bg-gray-700/80 p-4 rounded-lg border border-gray-600">
              <h4 className="font-semibold text-blue-400 mb-2">📁 Sources</h4>
              <p className="text-sm text-gray-400">Code examined</p>
              <div className="text-lg font-mono text-green-400">█████ 100%</div>
            </div>
            <div className="bg-yellow-900/80 p-4 rounded-lg border-2 border-yellow-500 animate-pulse">
              <h4 className="font-semibold text-yellow-400 mb-2">🖥️ Console</h4>
              <p className="text-sm text-yellow-300">TARGET LOCATED!</p>
              <div className="text-lg font-mono text-red-400">⚠️ CHECK NOW!</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-900/40 to-red-900/40 p-6 rounded-lg border-l-4 border-yellow-500 mb-6">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🚨</span>
              <h3 className="text-xl font-bold text-yellow-300">CRITICAL INTELLIGENCE</h3>
            </div>
            <p className="text-yellow-200 mb-4">
              Our cyber unit has detected suspicious activity. The target has left digital breadcrumbs in the 
              JavaScript console. Open your Browser Developer Tools (Press <kbd className="bg-black px-2 py-1 rounded font-mono">F12</kbd>) 
              and navigate to the <span className="font-bold text-white">Console</span> tab immediately!
            </p>
            <button
              onClick={checkConsoleHint}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-black"
            >
              🔍 Access Developer Console
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleFoundWord}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                showHint 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg animate-pulse' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!showHint}
            >
              <span className="flex items-center justify-center">
                <span className="mr-3">🎯</span>
                EXTRACT TARGET DATA
                <span className="ml-3">💾</span>
              </span>
            </button>
            
            {!showHint && (
              <p className="text-gray-500 text-sm mt-2">
                Complete the system scan first...
              </p>
            )}
          </div>

          {found && (
            <div className="success-message text-center mt-8">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 shadow-2xl border-2 border-green-400">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-4xl font-bold mb-3 text-white font-mono">MISSION ACCOMPLISHED!</h3>
                <p className="text-xl text-green-100 mb-4">
                  Elite hacker status achieved! You extracted the word: 
                  <span className="font-bold text-yellow-300 text-2xl font-mono"> "GATE"</span>
                </p>
                <div className="inline-block bg-green-800 px-6 py-3 rounded-full text-lg font-semibold font-mono">
                  💻 CYBER INFILTRATION COMPLETE 💻
                </div>
                <p className="mt-4 text-green-200 text-sm font-mono">
                  Word 3/6 collected | Security Level: BREACHED
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-white shadow-lg"
          >
            <span className="mr-2">←</span>
            Return to Command Center
          </Link>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm font-mono">
          <p>🔒 CLASSIFIED: This mission never happened. Agent clearance required.</p>
        </div>
      </div>
    </div>
  )
}

export default ConsolePuzzle