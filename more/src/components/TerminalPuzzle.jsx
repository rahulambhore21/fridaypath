import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

const TerminalPuzzle = ({ addWord }) => {
  const containerRef = useRef()
  const cursorRef = useRef()
  const terminalRef = useRef()
  const [command, setCommand] = useState('')
  const [output, setOutput] = useState([
    '████████╗██████╗  ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     ',
    '╚══██╔══╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     ',
    '   ██║   ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     ',
    '   ██║   ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     ',
    '   ██║   ██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗',
    '   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝',
    '',
    '🚀 toWeb Terminal v2.1.0 - Quantum Edition',
    '⚡ System Status: ONLINE | Security Level: MAXIMUM',
    '🔐 Access Level: RESTRICTED | User: puzzle_solver',
    '',
    'Type "help" for available commands...',
    'Warning: Unauthorized access attempts are monitored 👀',
    ''
  ])
  const [solved, setSolved] = useState(false)
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)

  const correctCommand = 'unlock --access gateway'

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
    )

    // Enhanced blinking cursor
    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    })

    // Auto-scroll terminal to bottom with smooth animation
    if (terminalRef.current) {
      gsap.to(terminalRef.current, {
        scrollTop: terminalRef.current.scrollHeight,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    // Matrix-style background effect
    createMatrixRain()
  }, [output])

  const createMatrixRain = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    for (let i = 0; i < 15; i++) {
      const drop = document.createElement('div')
      drop.style.cssText = `
        position: fixed;
        color: #00ff41;
        font-family: monospace;
        font-size: 12px;
        pointer-events: none;
        z-index: 1;
        opacity: 0.3;
        left: ${Math.random() * 100}vw;
        top: -20px;
      `
      drop.textContent = chars[Math.floor(Math.random() * chars.length)]
      document.body.appendChild(drop)

      gsap.to(drop, {
        y: '100vh',
        duration: Math.random() * 3 + 2,
        ease: 'none',
        onComplete: () => {
          document.body.removeChild(drop)
        }
      })
    }
  }

  const typeWriter = (text, callback) => {
    setIsTyping(true)
    let i = 0
    const newOutput = [...output]
    const currentLineIndex = newOutput.length
    newOutput.push('')
    setOutput(newOutput)

    const timer = setInterval(() => {
      if (i < text.length) {
        newOutput[currentLineIndex] = text.substring(0, i + 1)
        setOutput([...newOutput])
        i++
      } else {
        clearInterval(timer)
        setIsTyping(false)
        if (callback) callback()
      }
    }, 30)
  }

  const executeCommand = (cmd) => {
    const newOutput = [...output, `user@toWeb:~$ ${cmd}`]
    
    // Add to command history
    if (cmd.trim()) {
      setCommandHistory(prev => [...prev, cmd.trim()])
      setHistoryIndex(-1)
    }
    
    switch (cmd.toLowerCase().trim()) {
      case 'help':
        newOutput.push(
          '📋 AVAILABLE COMMANDS:',
          '┌─────────────────────────────────────────────────────────┐',
          '│ help           - Show this help message                │',
          '│ ls             - List directory contents               │',
          '│ pwd            - Show current directory                │',
          '│ clear          - Clear terminal screen                 │',
          '│ whoami         - Display current user                  │',
          '│ date           - Show current date and time            │',
          '│ unlock         - Access restricted systems (try flags) │',
          '│ status         - Show system status                    │',
          '└─────────────────────────────────────────────────────────┘',
          '💡 Tip: Try "unlock --help" for advanced options',
          ''
        )
        break
      
      case 'ls':
        newOutput.push(
          '📁 Directory Contents:',
          'drwxr-xr-x  2 user user 4096 Jul 31 12:34 .secrets/',
          '-rw-r--r--  1 user user  156 Jul 31 12:30 gateway.lock',
          '-rw-r--r--  1 user user 1024 Jul 31 12:28 puzzle.js',
          '-rw-r--r--  1 user user  512 Jul 31 12:25 README.md',
          '-rw-r--r--  1 user user   42 Jul 31 12:20 .env',
          '🔒 Access to .secrets/ requires special permissions',
          ''
        )
        break
      
      case 'pwd':
        newOutput.push(
          '📍 Current Directory:',
          '/home/user/to-web/terminal-puzzle',
          ''
        )
        break
      
      case 'whoami':
        newOutput.push(
          '👤 Current User: puzzle_solver',
          '🔐 Access Level: RESTRICTED',
          '🎯 Mission: Find the hidden gateway key',
          ''
        )
        break
      
      case 'date':
        newOutput.push(
          `📅 ${new Date().toLocaleString()}`,
          '⏰ System uptime: 1337 days, 13:37:42',
          ''
        )
        break
      
      case 'status':
        newOutput.push(
          '🖥️  SYSTEM STATUS REPORT',
          '┌─────────────────────────────────────┐',
          '│ CPU Usage:    ████████░░ 80%       │',
          '│ Memory:       ████████░░ 85%       │',
          '│ Security:     ██████████ 100%      │',
          '│ Gateway:      ░░░░░░░░░░ LOCKED     │',
          '└─────────────────────────────────────┘',
          '⚠️  Gateway requires special unlock command',
          ''
        )
        break
      
      case 'clear':
        setOutput([
          '🚀 toWeb Terminal v2.1.0 - Quantum Edition',
          '⚡ Terminal cleared by user request',
          ''
        ])
        return
      
      case 'unlock':
        newOutput.push(
          '❌ ERROR: unlock command requires additional parameters',
          '💡 Usage: unlock [OPTIONS]',
          '🔍 Try: unlock --help for more information',
          ''
        )
        break
      
      case 'unlock --help':
        newOutput.push(
          '🔓 UNLOCK COMMAND REFERENCE',
          '┌─────────────────────────────────────────────────────────┐',
          '│ USAGE: unlock [OPTIONS]                                 │',
          '│                                                         │',
          '│ OPTIONS:                                                │',
          '│   --access <target>    Specify access target           │',
          '│   --key <keyname>      Use specific encryption key     │',
          '│   --force              Force unlock (dangerous!)       │',
          '│   --verbose            Show detailed output             │',
          '│                                                         │',
          '│ EXAMPLES:                                               │',
          '│   unlock --access gateway    # Unlock main gateway     │',
          '│   unlock --key master        # Use master key          │',
          '│   unlock --force             # Force access (risky)    │',
          '└─────────────────────────────────────────────────────────┘',
          '⚠️  Warning: Incorrect usage may trigger security alerts',
          ''
        )
        break
      
      case correctCommand:
        if (!solved) {
          setSolved(true)
          addWord('to')
          newOutput.push(
            '🔓 AUTHENTICATION SUCCESSFUL!',
            '████████████████████████████████████',
            '█ GATEWAY ACCESS GRANTED            █',
            '████████████████████████████████████',
            '',
            '🎉 CONGRATULATIONS! Security bypass complete!',
            '✨ Hidden word revealed: "to"',
            '� Progress: Word 6/6 collected!',
            '🏆 Achievement unlocked: Terminal Master',
            '',
            '� ALL WORDS FOUND! 🌟',
            '🚀 Navigate to: /unlock-the-gate for final challenge',
            '💎 You have proven your command-line mastery!',
            ''
          )
          
          // Epic success animation
          setTimeout(() => {
            createSuccessEffect()
          }, 500)
        } else {
          newOutput.push(
            '✅ Gateway already unlocked!',
            '🏆 Access level: MAXIMUM',
            ''
          )
        }
        break
      
      default:
        const suggestions = [
          'help', 'ls', 'pwd', 'unlock --help', 'status'
        ]
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
        
        newOutput.push(
          `❌ Command not found: ${cmd}`,
          `💡 Did you mean: ${randomSuggestion}?`,
          '📚 Type "help" for available commands',
          '🔍 Hint: The gateway needs a special unlock command...',
          ''
        )
        break
    }
    
    setOutput(newOutput)
  }

  const createSuccessEffect = () => {
    // Screen flash effect
    const flash = document.createElement('div')
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #00ff41;
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
    `
    document.body.appendChild(flash)

    gsap.to(flash, {
      opacity: 0.3,
      duration: 0.1,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        document.body.removeChild(flash)
      }
    })

    // Terminal glow effect
    gsap.to('.terminal-container', {
      boxShadow: '0 0 50px #00ff41',
      duration: 1,
      yoyo: true,
      repeat: 1
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (command.trim() && !isTyping) {
      executeCommand(command.trim())
      setCommand('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCommand('')
        } else {
          setHistoryIndex(newIndex)
          setCommand(commandHistory[newIndex])
        }
      }
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-green-400 p-8 font-mono relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-bg"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-8">
          <div className="inline-block bg-green-500/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
            <h1 className="text-5xl font-bold mb-4 text-green-400 drop-shadow-lg">
              ⚡ Command the Web
            </h1>
            <p className="text-xl text-gray-400 mb-4 font-light">
              The right command unlocks the next path.
            </p>
            <div className="text-sm text-green-300 bg-green-900/30 px-4 py-2 rounded-full inline-block">
              Difficulty: Hard | Terminal Mastery Required
            </div>
          </div>
        </header>

        <div className="terminal-container bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 mb-6 border-2 border-green-500/50 shadow-2xl">
          {/* Terminal Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-500/30">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-green-400 text-sm font-bold">
              🖥️ toWeb Terminal - Quantum Edition
            </div>
            <div className="text-green-400 text-xs">
              user@toWeb:~
            </div>
          </div>
          
          <div 
            ref={terminalRef}
            className="bg-black/60 p-6 rounded-lg min-h-96 max-h-96 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800"
          >
            {output.map((line, index) => (
              <div key={index} className="text-green-400 mb-1 leading-relaxed">
                {line}
              </div>
            ))}
            
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-green-400 mr-2 font-bold">user@toWeb:~$</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent text-green-400 outline-none flex-1 font-mono"
                placeholder="Type a command..."
                autoFocus
                disabled={isTyping}
              />
              <span ref={cursorRef} className="text-green-400 text-xl">▊</span>
            </form>
          </div>
          
          <div className="flex justify-between items-center text-xs text-green-600">
            <div className="flex items-center space-x-4">
              <span>💡 Use ↑↓ arrows for command history</span>
              <span>🔍 Try "help" to see commands</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>

        {solved && (
          <div className="terminal-success text-center mb-8 p-8 bg-gradient-to-r from-green-900/60 to-emerald-900/60 backdrop-blur-lg rounded-2xl border-2 border-green-400 shadow-2xl">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h3 className="text-4xl font-bold text-green-400 mb-3">TERMINAL MASTERY ACHIEVED!</h3>
            <p className="text-xl text-green-300 mb-3">
              Final word collected: <span className="font-bold text-yellow-300 text-2xl">"to"</span>
            </p>
            <div className="inline-block bg-yellow-600 text-black px-6 py-3 rounded-full font-bold text-lg animate-pulse">
              ✨ ALL 6 WORDS FOUND! Navigate to the final challenge! ✨
            </div>
          </div>
        )}

        <div className="text-center space-y-4">
          <Link 
            to="/" 
            className="inline-flex items-center bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 text-black shadow-lg"
          >
            <span className="mr-2">←</span>
            Back to Hub
          </Link>
          
          <div className="text-green-600 text-sm bg-green-900/20 p-4 rounded-lg">
            <p className="mb-2"> <strong>Cheat Code:</strong> unlock --access gateway</p>
            <p>� <strong>Pro Tip:</strong> Real terminals support command history and auto-completion!</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-green-500::-webkit-scrollbar-thumb {
          background-color: #10b981;
          border-radius: 3px;
        }
        .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background-color: #1f2937;
        }
        .matrix-bg {
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(16, 185, 129, 0.03) 2px,
            rgba(16, 185, 129, 0.03) 4px
          );
          height: 100%;
          animation: matrix-scroll 20s linear infinite;
        }
        @keyframes matrix-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(100px); }
        }
      `}</style>
    </div>
  )
}

export default TerminalPuzzle
