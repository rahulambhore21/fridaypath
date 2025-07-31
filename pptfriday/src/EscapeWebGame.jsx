import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, Terminal, Bug, Shield, Code, Globe, Zap, Key, Award, Eye, 
  AlertTriangle, FileText, Star, Sparkles, Rocket, Lock, Unlock, Database,
  Server, Wifi, Monitor, Layers, Users, TrendingUp, ArrowRight, Play, Pause,
  RotateCcw, Settings, Network, Cpu, HardDrive, Cloud
} from 'lucide-react';

// Enhanced animation utility with particle effects
const animateElement = (element, props, duration = 0.3) => {
  if (!element) return;
  
  const startTime = Date.now();
  const startProps = {};
  
  Object.keys(props).forEach(key => {
    if (key === 'opacity') {
      startProps[key] = parseFloat(getComputedStyle(element).opacity) || 0;
    } else if (key === 'x') {
      startProps[key] = element.offsetLeft || 0;
    } else if (key === 'y') {
      startProps[key] = element.offsetTop || 0;
    } else if (key === 'scale') {
      startProps[key] = 1;
    }
  });
  
  const animate = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    Object.keys(props).forEach(key => {
      const start = startProps[key] || 0;
      const end = props[key];
      const current = start + (end - start) * easeOut;
      
      if (key === 'opacity') {
        element.style.opacity = current;
      } else if (key === 'x') {
        element.style.transform = `translateX(${current}px) translateY(${element.style.transform.includes('translateY') ? element.style.transform.match(/translateY\(([^)]+)\)/)?.[1] || '0px' : '0px'}) scale(${element.style.transform.includes('scale') ? element.style.transform.match(/scale\(([^)]+)\)/)?.[1] || '1' : '1'})`;
      } else if (key === 'y') {
        element.style.transform = `translateY(${current}px) translateX(${element.style.transform.includes('translateX') ? element.style.transform.match(/translateX\(([^)]+)\)/)?.[1] || '0px' : '0px'}) scale(${element.style.transform.includes('scale') ? element.style.transform.match(/scale\(([^)]+)\)/)?.[1] || '1' : '1'})`;
      } else if (key === 'scale') {
        element.style.transform = `scale(${current}) translateX(${element.style.transform.includes('translateX') ? element.style.transform.match(/translateX\(([^)]+)\)/)?.[1] || '0px' : '0px'}) translateY(${element.style.transform.includes('translateY') ? element.style.transform.match(/translateY\(([^)]+)\)/)?.[1] || '0px' : '0px'})`;
      }
    });
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// Particle system for visual effects
const createParticles = (element, count = 10) => {
  if (!element) return;
  
  const rect = element.getBoundingClientRect();
  const colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = rect.left + rect.width / 2 + 'px';
    particle.style.top = rect.top + rect.height / 2 + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.boxShadow = `0 0 6px ${particle.style.backgroundColor}`;
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / count;
    const velocity = 2 + Math.random() * 3;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity;
    
    let opacity = 1;
    let x = 0;
    let y = 0;
    
    const animateParticle = () => {
      x += dx;
      y += dy;
      opacity -= 0.02;
      
      particle.style.transform = `translate(${x}px, ${y}px)`;
      particle.style.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(animateParticle);
      } else {
        document.body.removeChild(particle);
      }
    };
    
    requestAnimationFrame(animateParticle);
  }
};

// Sound effect simulation
const playSound = (type) => {
  // Create audio context for sound simulation
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  let frequency, duration;
  
  switch (type) {
    case 'success':
      frequency = 800;
      duration = 0.3;
      break;
    case 'error':
      frequency = 200;
      duration = 0.5;
      break;
    case 'click':
      frequency = 500;
      duration = 0.1;
      break;
    case 'level-complete':
      frequency = 1000;
      duration = 0.6;
      break;
    default:
      frequency = 400;
      duration = 0.2;
  }
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

// Game state management
const useGameState = () => {
  const [currentLevel, setCurrentLevel] = useState(() => {
    return parseInt(localStorage.getItem('escapeWeb_currentLevel') || '1');
  });
  
  const [score, setScore] = useState(() => {
    return parseInt(localStorage.getItem('escapeWeb_score') || '0');
  });
  
  const [hintsUsed, setHintsUsed] = useState(() => {
    return JSON.parse(localStorage.getItem('escapeWeb_hintsUsed') || '{}');
  });
  
  const [completedLevels, setCompletedLevels] = useState(() => {
    return JSON.parse(localStorage.getItem('escapeWeb_completedLevels') || '[]');
  });

  // Track level attempts to prevent multiple scoring
  const [levelAttempts, setLevelAttempts] = useState(() => {
    return JSON.parse(localStorage.getItem('escapeWeb_levelAttempts') || '{}');
  });

  // Track wrong answers for retry functionality
  const [wrongAnswers, setWrongAnswers] = useState(() => {
    return JSON.parse(localStorage.getItem('escapeWeb_wrongAnswers') || '{}');
  });

  const saveProgress = () => {
    localStorage.setItem('escapeWeb_currentLevel', currentLevel.toString());
    localStorage.setItem('escapeWeb_score', score.toString());
    localStorage.setItem('escapeWeb_hintsUsed', JSON.stringify(hintsUsed));
    localStorage.setItem('escapeWeb_completedLevels', JSON.stringify(completedLevels));
    localStorage.setItem('escapeWeb_levelAttempts', JSON.stringify(levelAttempts));
    localStorage.setItem('escapeWeb_wrongAnswers', JSON.stringify(wrongAnswers));
  };

  useEffect(() => {
    saveProgress();
  }, [currentLevel, score, hintsUsed, completedLevels, levelAttempts, wrongAnswers]);

  return {
    currentLevel,
    setCurrentLevel,
    score,
    setScore,
    hintsUsed,
    setHintsUsed,
    completedLevels,
    setCompletedLevels,
    levelAttempts,
    setLevelAttempts,
    wrongAnswers,
    setWrongAnswers
  };
};

// Main App Component
const EscapeWebGame = () => {
  const [currentPage, setCurrentPage] = useState('password');
  const gameState = useGameState();
  const pageRef = useRef(null);
  const matrixRef = useRef(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Single instructor/volunteer access password - only known by authorized personnel
  const INSTRUCTOR_PASSWORD = "INSTRUCTOR2025";
  
  const instructorAccess = {
    code: INSTRUCTOR_PASSWORD,
    hint: "Contact your instructor for the access code",
    description: "Restricted access for authorized volunteers/instructors only"
  };

  // Matrix background effect
  useEffect(() => {
    const canvas = matrixRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]()!@#$%^&*';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f4';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (page, level = null) => {
    playSound('click');
    if (pageRef.current) {
      animateElement(pageRef.current, { opacity: 0, scale: 0.95 }, 0.2);
      setTimeout(() => {
        setCurrentPage(level ? `level-${level}` : page);
        animateElement(pageRef.current, { opacity: 1, scale: 1 }, 0.3);
      }, 200);
    } else {
      setCurrentPage(level ? `level-${level}` : page);
    }
  };

  const renderCurrentPage = () => {
    if (!isUnlocked) {
      return <PasswordEntry instructorAccess={instructorAccess} onUnlock={() => setIsUnlocked(true)} navigateTo={navigateTo} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} gameState={gameState} />;
      case 'rules':
        return <RulesPage navigateTo={navigateTo} />;
      case 'level-1':
        return <Level1 navigateTo={navigateTo} gameState={gameState} />;
      case 'level-2':
        return <Level2 navigateTo={navigateTo} gameState={gameState} />;
      case 'level-3':
        return <Level3 navigateTo={navigateTo} gameState={gameState} />;
      case 'level-4':
        return <Level4 navigateTo={navigateTo} gameState={gameState} />;
      case 'level-5':
        return <Level5 navigateTo={navigateTo} gameState={gameState} />;
      case 'level-6':
        return <Level6 navigateTo={navigateTo} gameState={gameState} />;
      case 'level-7':
        return <Level7 navigateTo={navigateTo} gameState={gameState} />;
      case 'bonus':
        return <BonusPage navigateTo={navigateTo} gameState={gameState} />;
      case 'escape':
        return <EscapePage navigateTo={navigateTo} gameState={gameState} />;
      default:
        return <HomePage navigateTo={navigateTo} gameState={gameState} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Matrix Background */}
      <canvas 
        ref={matrixRef}
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      
      {/* Header */}
      <header className="border-b border-green-800 p-4 relative z-10 bg-black bg-opacity-80 backdrop-blur-sm">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-md transition-all duration-300 transform hover:scale-105 group"
              title="Return to Web Technology Hub"
            >
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-gray-400 group-hover:text-white text-sm font-medium transition-colors">HOME</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <Terminal className="w-6 h-6 animate-pulse" />
              <span className="text-xl font-bold text-green-400">
                [<span className="text-red-400 animate-pulse">ESCAPE_WEB.exe</span>]
              </span>
              <div className="flex space-x-1 ml-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping animation-delay-200"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-ping animation-delay-400"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="text-yellow-400">LEVEL:</span> 
              <span className="text-green-400 font-bold"> {gameState.currentLevel}/7</span>
            </div>
            <div className="text-sm">
              <span className="text-blue-400">SCORE:</span> 
              <span className="text-green-400 font-bold"> {gameState.score}</span>
            </div>
            <div className="text-sm">
              <span className="text-purple-400">STATUS:</span> 
              <span className="text-green-400 animate-pulse"> ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main ref={pageRef} className="max-w-6xl mx-auto p-4 relative z-10">
        {renderCurrentPage()}
      </main>

      {/* Floating particles for ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Password Entry Component - Restricted access for instructors/volunteers only
const PasswordEntry = ({ instructorAccess, onUnlock, navigateTo }) => {
  const [enteredPassword, setEnteredPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState([]);

  const handlePasswordSubmit = () => {
    playSound('click');
    const isCorrect = enteredPassword.toUpperCase() === instructorAccess.code;
    
    if (isCorrect) {
      playSound('level-complete');
      setIsUnlocking(true);
      
      // Dramatic unlock animation
      setTimeout(() => {
        onUnlock();
        navigateTo('home');
      }, 2000);
    } else {
      playSound('error');
      setAttempts(attempts + 1);
      setFailedAttempts([...failedAttempts, enteredPassword]);
      setEnteredPassword('');
    }
  };

  const showInstructorHint = () => {
    setShowHint(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-blue-900 animate-pulse"></div>
      
      {/* Matrix rain effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce text-green-400 opacity-20 font-mono text-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {!isUnlocking ? (
          <div className="bg-black/80 backdrop-blur-md border-2 border-red-500 rounded-2xl p-4 sm:p-8 shadow-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center mb-4">
                <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-red-400 mb-4 glitch-text">
                [SYSTEM LOCKED]
              </h1>
              <p className="text-green-300 text-lg leading-relaxed">
                🚨 <strong>RESTRICTED ACCESS SYSTEM!</strong> 🚨<br/>
                This educational gaming system is restricted to <span className="text-yellow-400 font-bold">authorized instructors and volunteers only</span>.<br/>
                Contact your instructor to obtain the access code.
              </p>
            </div>

            <div className="space-y-6">
              {/* Password Input */}
              <div>
                <label className="block text-green-400 font-bold mb-2 text-lg">
                  🔐 ACCESS CODE:
                </label>
                <input
                  type="text"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className="w-full bg-black border-2 border-green-600 focus:border-green-400 p-4 rounded-lg text-green-400 font-mono text-xl text-center uppercase tracking-widest"
                  placeholder="ENTER ACCESS CODE..."
                  maxLength={15}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handlePasswordSubmit}
                  disabled={!enteredPassword}
                  className="flex-1 bg-gradient-to-r from-green-700 to-green-500 hover:from-green-600 hover:to-green-400 disabled:from-gray-700 disabled:to-gray-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <Unlock className="w-5 h-5 mr-2" />
                  UNLOCK SYSTEM
                </button>

                <button
                  onClick={showInstructorHint}
                  className="bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-black px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  HELP
                </button>
              </div>

              {/* Instructor Hint Display */}
              {showHint && (
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-2 border-blue-500 p-4 rounded-lg animate-pulse">
                  <div className="text-center">
                    <h3 className="text-blue-400 font-bold mb-2">🔍 ACCESS INFORMATION:</h3>
                    <p className="text-white mb-2">"{instructorAccess.hint}"</p>
                    <p className="text-gray-300 text-sm">{instructorAccess.description}</p>
                  </div>
                </div>
              )}

              {/* Failed Attempts */}
              {attempts > 0 && (
                <div className="bg-gradient-to-r from-red-900 to-pink-900 border-2 border-red-500 p-4 rounded-lg">
                  <div className="text-center">
                    <h3 className="text-red-400 font-bold mb-2">⚠️ ACCESS DENIED!</h3>
                    <p className="text-white">Failed Attempts: {attempts}</p>
                    {failedAttempts.length > 0 && (
                      <div className="text-gray-300 text-sm mt-2">
                        Tried: {failedAttempts.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Instructor Access Information */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-600 p-4 rounded-lg">
                <h3 className="text-gray-400 font-bold mb-3 text-center">�‍🏫 INSTRUCTOR ACCESS ONLY:</h3>
                <p className="text-gray-300 text-sm text-center mb-3">
                  This educational gaming system is designed for instructors and authorized volunteers to demonstrate web security concepts to students.
                </p>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-red-900/30 border border-red-500 rounded-lg">
                    <Lock className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-red-400 font-bold">RESTRICTED ACCESS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black/80 backdrop-blur-md border-2 border-green-500 rounded-2xl p-8 shadow-2xl text-center">
            <div className="mb-6">
              <Unlock className="w-24 h-24 text-green-400 mx-auto animate-bounce" />
            </div>
            <h1 className="text-4xl font-bold text-green-400 mb-4 animate-pulse">
              [SYSTEM UNLOCKED]
            </h1>
            <p className="text-green-300 text-lg">
              🎉 Access Granted! Initializing Escape Web Game...
            </p>
            <div className="mt-6">
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Home Page
const HomePage = ({ navigateTo, gameState }) => {
  const titleRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      animateElement(titleRef.current, { opacity: 1, y: 0 }, 0.8);
    }
    if (buttonRef.current) {
      setTimeout(() => {
        animateElement(buttonRef.current, { opacity: 1, scale: 1 }, 0.5);
      }, 500);
    }
  }, []);

  const handleStartClick = () => {
    playSound('level-complete');
    createParticles(buttonRef.current, 15);
    navigateTo('level', gameState.currentLevel);
  };

  return (
    <div className="text-center py-12 relative">
      {/* Glitch effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-green-900/10 animate-pulse"></div>
      
      <div className="mb-8 relative z-10">
        <div 
          ref={titleRef}
          style={{ opacity: 0, transform: 'translateY(-20px)' }}
          className="mb-6"
        >
          <h1 className="text-7xl font-bold mb-4 text-red-400 relative">
            <span className="animate-pulse">&gt;</span>
            <span className="text-green-400 mx-2 glitch-text">ESCAPE_WEB</span>
            <span className="animate-pulse">&lt;</span>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
          </h1>
          <div className="text-yellow-400 text-sm font-bold animate-bounce mb-4">
            [ SYSTEM_CORRUPTION_DETECTED ]
          </div>
        </div>
        
        <div className="text-green-300 text-lg max-w-3xl mx-auto leading-relaxed bg-black/50 backdrop-blur-sm p-6 rounded-lg border border-green-800">
          <p className="mb-4 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400 animate-pulse" />
            [SYSTEM CORRUPTED] You are trapped inside a broken website system.
          </p>
          <p className="mb-4">
            The digital realm is collapsing around you, riddled with bugs and security flaws.
            Time is running out before total system shutdown!
          </p>
          <p className="mb-4 flex items-center justify-center">
            <Bug className="w-5 h-5 mr-2 text-yellow-400" />
            Your mission: Debug 7 critical system failures to escape before total system shutdown.
          </p>
          <p className="text-yellow-400 flex items-center justify-center">
            <Shield className="w-5 h-5 mr-2" />
            WARNING: Use hints sparingly - they reduce your escape score by 50% per level.
          </p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div 
          ref={buttonRef}
          style={{ opacity: 0, transform: 'scale(0.8)' }}
        >
          <button
            onClick={handleStartClick}
            className="bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 border border-green-400 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="relative flex items-center justify-center">
              <Rocket className="w-6 h-6 mr-2 animate-bounce" />
              {gameState.currentLevel > 1 ? 'CONTINUE ESCAPE SEQUENCE' : 'START ESCAPE SEQUENCE'}
              <Star className="w-6 h-6 ml-2 animate-spin text-yellow-400" />
            </div>
          </button>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigateTo('rules')}
            className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 border border-blue-400 flex items-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            Mission Briefing
          </button>
          
          {gameState.currentLevel >= 7 && (
            <button
              onClick={() => navigateTo('bonus')}
              className="bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 border border-purple-400 flex items-center animate-pulse"
            >
              <Award className="w-5 h-5 mr-2 animate-spin" />
              Bonus Challenges
              <span className="ml-2 text-yellow-400">NEW!</span>
            </button>
          )}
        </div>

        {/* Achievement badges */}
        <div className="mt-8 flex justify-center space-x-4">
          {gameState.completedLevels.map((level) => (
            <div
              key={level}
              className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-black font-bold text-sm animate-pulse"
            >
              {level}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Rules Page
const RulesPage = ({ navigateTo }) => {
  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
        [MISSION_BRIEFING.txt]
      </h2>
      
      <div className="bg-gray-900 border border-green-800 p-6 rounded-lg max-w-4xl mx-auto">
        <div className="space-y-4 text-green-300">
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-2">OBJECTIVE:</h3>
            <p>Navigate through 7 levels of system corruption. Each level contains a web development bug that must be fixed to proceed.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-2">SCORING:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Each level completed without hints: 100 points</li>
              <li>Each level completed with hints: 50 points</li>
              <li>Bonus challenges: 25 points each</li>
              <li className="text-yellow-400">⚠️ Each wrong attempt reduces points by 25% (minimum 10 points)</li>
              <li>Maximum possible score: 775 points</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-2">LEVEL TYPES:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>HTML Structure Bugs</li>
              <li>CSS Styling Issues</li>
              <li>JavaScript Function Errors</li>
              <li>Network & Security Problems</li>
              <li>Responsive Design Failures</li>
            </ul>
          </div>
          
          <div className="text-yellow-400">
            <p><strong>WARNING:</strong> Progress is auto-saved. Use hints wisely - they permanently reduce your level score.</p>
            <p><strong>PENALTY SYSTEM:</strong> Each wrong attempt will reduce your potential reward points by 25%. Think carefully before submitting!</p>
          </div>
        </div>
        
        <button
          onClick={() => navigateTo('home')}
          className="mt-6 bg-green-800 hover:bg-green-700 px-6 py-2 rounded transition-colors"
        >
          Return to Main Terminal
        </button>
      </div>
    </div>
  );
};

// Level Component Template
const LevelTemplate = ({ 
  levelNum, 
  title, 
  story, 
  codeExample, 
  question, 
  options, 
  correctAnswer, 
  hint, 
  navigateTo, 
  gameState,
  icon: Icon,
  isTextInput = false
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const successRef = useRef(null);

  const handleHint = () => {
    setShowHint(true);
    const newHintsUsed = { ...gameState.hintsUsed, [levelNum]: true };
    gameState.setHintsUsed(newHintsUsed);
  };

  const handleSubmit = () => {
    playSound('click');
    const correct = selectedAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      playSound('success');
      
      // Check if this level has already been completed to prevent double scoring
      const attemptKey = `level_${levelNum}`;
      if (!gameState.levelAttempts[attemptKey]) {
        // Calculate points with 25% deduction for each wrong attempt
        const wrongAttemptsForLevel = gameState.wrongAnswers[attemptKey] || 0;
        const basePoints = gameState.hintsUsed[levelNum] ? 50 : 100;
        const deductionMultiplier = Math.pow(0.75, wrongAttemptsForLevel); // 25% deduction per wrong attempt
        const finalPoints = Math.max(Math.floor(basePoints * deductionMultiplier), 10); // Minimum 10 points
        
        gameState.setScore(gameState.score + finalPoints);
        
        // Mark this level as attempted to prevent future scoring
        const newAttempts = { ...gameState.levelAttempts, [attemptKey]: true };
        gameState.setLevelAttempts(newAttempts);
        
        if (!gameState.completedLevels.includes(levelNum)) {
          gameState.setCompletedLevels([...gameState.completedLevels, levelNum]);
        }
      }

      // Show success button with animation and particles
      setTimeout(() => {
        if (successRef.current) {
          successRef.current.style.opacity = '1';
          successRef.current.style.transform = 'translateY(0px)';
          createParticles(successRef.current, 12);
        }
      }, 500);
    } else {
      playSound('error');
      // Track wrong answers and apply 25% point deduction rule
      const wrongKey = `level_${levelNum}`;
      const newWrongAnswers = { 
        ...gameState.wrongAnswers, 
        [wrongKey]: (gameState.wrongAnswers[wrongKey] || 0) + 1 
      };
      gameState.setWrongAnswers(newWrongAnswers);
    }
  };

  const resetAnswer = () => {
    playSound('click');
    setSelectedAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const nextLevel = () => {
    playSound('level-complete');
    if (levelNum < 7) {
      gameState.setCurrentLevel(levelNum + 1);
      navigateTo('level', levelNum + 1);
    } else {
      navigateTo('escape');
    }
  };

  return (
    <div className="py-4 sm:py-8 relative px-4">
      {/* Level header with enhanced styling */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 sm:w-10 sm:h-10 mr-2 sm:mr-3 text-red-400 animate-pulse" />
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-red-400 glitch-text">
            LEVEL {levelNum}: {title}
          </h2>
          <Icon className="w-6 h-6 sm:w-10 sm:h-10 ml-2 sm:ml-3 text-red-400 animate-pulse" />
        </div>
        
        {/* Enhanced progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-3 mt-4 border border-green-800 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full transition-all duration-500 relative"
            style={{ width: `${(levelNum / 7) * 100}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
        <p className="text-green-400 text-sm mt-2 font-bold">
          PROGRESS: {levelNum}/7 SYSTEMS DEBUGGED
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Enhanced Story & Code Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-green-800 p-6 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
            <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 animate-pulse" />
              SYSTEM LOG:
            </h3>
            <p className="text-green-300 leading-relaxed">{story}</p>
          </div>

          {codeExample && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-red-800 p-6 rounded-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
              <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-3 flex items-center">
                <Bug className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-bounce" />
                CORRUPTED CODE:
              </h3>
              <pre className="text-green-300 bg-black p-2 sm:p-4 rounded overflow-x-auto border border-red-700 font-mono text-xs sm:text-sm">
                <code>{codeExample}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Enhanced Challenge Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-blue-800 p-4 sm:p-6 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <h3 className="text-lg sm:text-xl font-bold text-blue-400 mb-4 flex items-center">
              <Code className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              DEBUG CHALLENGE:
            </h3>
            <p className="text-green-300 mb-4 text-base sm:text-lg">{question}</p>

            {/* Point Deduction Information */}
            <div className="bg-gradient-to-r from-purple-900/50 to-red-900/50 border border-purple-600 p-3 rounded-lg mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="text-white font-semibold">
                    Current Points Available: 
                  </span>
                  <span className="text-yellow-400 font-bold ml-1">
                    {(() => {
                      const wrongAttempts = gameState.wrongAnswers[`level_${levelNum}`] || 0;
                      const basePoints = gameState.hintsUsed[levelNum] ? 50 : 100;
                      const deductionMultiplier = Math.pow(0.75, wrongAttempts);
                      return Math.max(Math.floor(basePoints * deductionMultiplier), 10);
                    })()}
                  </span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-red-400" />
                  <span className="text-red-300">
                    Wrong Attempts: {gameState.wrongAnswers[`level_${levelNum}`] || 0}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-xs mt-2">
                ⚠️ Rule: Each wrong attempt reduces reward points by 25% (minimum 10 points)
              </p>
            </div>

            {isTextInput ? (
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="w-full bg-black border-2 border-green-800 focus:border-green-400 p-3 rounded text-green-400 font-mono text-lg transition-colors"
                placeholder="Enter your fix..."
              />
            ) : (
              <div className="space-y-3">
                {options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-3 rounded-lg transition-colors border border-transparent hover:border-green-800">
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="w-4 h-4 text-green-400"
                    />
                    <span className="text-green-300">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Controls */}
          <div className="space-y-4">
            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer || (showFeedback && isCorrect)}
                className="flex-1 bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-600 px-6 py-3 rounded-lg transition-all duration-300 font-bold transform hover:scale-105 border border-green-400 flex items-center justify-center"
              >
                <Zap className="w-5 h-5 mr-2" />
                Submit Fix
              </button>
              
              {showFeedback && !isCorrect && (
                <button
                  onClick={resetAnswer}
                  className="bg-gradient-to-r from-orange-800 to-orange-600 hover:from-orange-700 hover:to-orange-500 px-6 py-3 rounded-lg transition-all duration-300 font-bold transform hover:scale-105 border border-orange-400 flex items-center"
                >
                  <Bug className="w-5 h-5 mr-2" />
                  Try Again
                </button>
              )}
              
              {!showHint && !gameState.hintsUsed[levelNum] && !showFeedback && (
                <button
                  onClick={handleHint}
                  className="bg-gradient-to-r from-yellow-800 to-yellow-600 hover:from-yellow-700 hover:to-yellow-500 px-6 py-3 rounded-lg transition-all duration-300 font-bold transform hover:scale-105 border border-yellow-400 flex items-center"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Hint (-50%)
                </button>
              )}
            </div>

            {showHint && (
              <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 border-2 border-yellow-600 p-4 rounded-lg animate-pulse">
                <p className="text-yellow-300 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  <strong>HINT:</strong> {hint}
                </p>
              </div>
            )}

            {showFeedback && (
              <div className={`border-2 p-4 rounded-lg transition-all duration-300 ${
                isCorrect 
                  ? 'bg-gradient-to-r from-green-900 to-green-800 border-green-600' 
                  : 'bg-gradient-to-r from-red-900 to-red-800 border-red-600'
              }`}>
                <p className={`text-lg font-bold flex items-center ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                  {isCorrect ? (
                    <>
                      <span className="text-2xl mr-2">✅</span>
                      SYSTEM REPAIRED! Bug fixed successfully.
                      {gameState.levelAttempts[`level_${levelNum}`] && (
                        <span className="ml-2 text-yellow-400 text-sm">[Already completed - No bonus points]</span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-2xl mr-2">❌</span>
                      Fix failed. Check your answer and try again.
                      {gameState.wrongAnswers[`level_${levelNum}`] && (
                        <span className="ml-2 text-orange-400 text-sm">
                          (Attempt #{gameState.wrongAnswers[`level_${levelNum}`] + 1})
                        </span>
                      )}
                    </>
                  )}
                </p>
                
                {!isCorrect && (
                  <>
                    <div className="mt-3 p-3 bg-orange-900/50 rounded-lg border border-orange-700">
                      <p className="text-orange-300 text-sm flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <strong>Debug Tip:</strong> Review the code example carefully and consider what the error message would be.
                      </p>
                    </div>
                    
                    {gameState.wrongAnswers[`level_${levelNum}`] > 0 && (
                      <div className="mt-2 p-2 bg-red-900/50 rounded border border-red-700">
                        <p className="text-red-300 text-xs flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          <strong>Point Deduction Applied:</strong> Next correct answer will earn {(() => {
                            const wrongAttempts = gameState.wrongAnswers[`level_${levelNum}`] || 0;
                            const basePoints = gameState.hintsUsed[levelNum] ? 50 : 100;
                            const deductionMultiplier = Math.pow(0.75, wrongAttempts);
                            return Math.max(Math.floor(basePoints * deductionMultiplier), 10);
                          })()} points instead of {gameState.hintsUsed[levelNum] ? 50 : 100}
                        </p>
                      </div>
                    )}
                  </>
                )}
                
                {isCorrect && (
                  <div 
                    ref={successRef} 
                    style={{ 
                      opacity: 0, 
                      transform: 'translateY(10px)',
                      transition: 'all 0.5s ease'
                    }} 
                    className="mt-4 flex space-x-3"
                  >
                    <button
                      onClick={nextLevel}
                      className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 px-8 py-3 rounded-lg transition-all duration-300 font-bold transform hover:scale-105 border border-blue-400 flex items-center text-lg"
                    >
                      <Rocket className="w-6 h-6 mr-2 animate-bounce" />
                      {levelNum < 7 ? 'Next Level' : 'Escape System'} 
                      <ChevronRight className="w-6 h-6 ml-2" />
                    </button>
                    
                    {levelNum === 7 && (
                      <button
                        onClick={() => navigateTo('bonus')}
                        className="bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500 px-8 py-3 rounded-lg transition-all duration-300 font-bold transform hover:scale-105 border border-purple-400 flex items-center text-lg animate-pulse"
                      >
                        <Star className="w-6 h-6 mr-2 animate-spin" />
                        Bonus Challenges
                        <span className="ml-2 text-yellow-400">NEW!</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Level Components
const Level1 = ({ navigateTo, gameState }) => (
  <LevelTemplate
    levelNum={1}
    title="BROKEN NAVIGATION"
    icon={Bug}
    story="ALERT: Navigation system failure detected. Users are trapped in an infinite loop. The main navigation link leads nowhere, preventing access to critical system resources."
    codeExample={`<nav class="main-nav">
  <a href="#" class="nav-link">
    System Dashboard
  </a>
</nav>`}
    question="What should replace the '#' to fix the broken navigation?"
    options={[
      '/dashboard',
      'javascript:void(0)',
      '#dashboard',
      'dashboard.html'
    ]}
    correctAnswer="/dashboard"
    hint="URLs should point to actual pages or routes, not placeholder anchors."
    navigateTo={navigateTo}
    gameState={gameState}
  />
);

const Level2 = ({ navigateTo, gameState }) => (
  <LevelTemplate
    levelNum={2}
    title="CSS MALFUNCTION"
    icon={Code}
    story="CRITICAL: User interface corruption detected. The login button has vanished from the interface due to a CSS class naming error. Users cannot authenticate into the system."
    codeExample={`<button class="btn-primery">Login</button>

.btn-primary {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}`}
    question="What's wrong with the CSS class implementation?"
    options={[
      'The class name has a typo: "btn-primery" should be "btn-primary"',
      'Missing semicolon in CSS',
      'Wrong color code',
      'Button element is incorrect'
    ]}
    correctAnswer='The class name has a typo: "btn-primery" should be "btn-primary"'
    hint="Look carefully at the spelling of the class name in HTML vs CSS."
    navigateTo={navigateTo}
    gameState={gameState}
  />
);

const Level3 = ({ navigateTo, gameState }) => (
  <LevelTemplate
    levelNum={3}
    title="JAVASCRIPT ERROR"
    icon={Zap}
    story="SYSTEM FAILURE: Interactive elements are non-responsive. The emergency shutdown button has been programmed incorrectly and won't execute when clicked, leaving the system vulnerable."
    codeExample={`<button id="shutdown-btn" onclick="emergencyStop()">
  Emergency Shutdown
</button>

<script>
function emergencyShutdown() {
  console.log("System shutting down...");
  // Shutdown logic here
}
</script>`}
    question="Why isn't the button working when clicked?"
    options={[
      'Function name mismatch: onclick calls "emergencyStop()" but function is named "emergencyShutdown()"',
      'Missing event listener',
      'Button ID is wrong',
      'Console.log syntax error'
    ]}
   correctAnswer='Function name mismatch: onclick calls "emergencyStop()" but function is named "emergencyShutdown()"'
    hint="Compare the function name in the onclick attribute with the actual function definition."
    navigateTo={navigateTo}
    gameState={gameState}
  />
);

const Level4 = ({ navigateTo, gameState }) => (
  <LevelTemplate
    levelNum={4}
    title="DNS CORRUPTION"
    icon={Globe}
    story="NETWORK EMERGENCY: DNS resolution system compromised. Critical domain mappings have been scrambled. You must restore the correct IP address for the escape portal domain."
    codeExample={`CORRUPTED DNS TABLE:
escape-portal.web → ???
malware-site.evil → 192.168.1.100
system-backup.web → 10.0.0.1
safe-haven.secure → 172.16.0.1`}
    question="Which IP should escape-portal.web resolve to for safe passage?"
    options={[
      '172.16.0.1',
      '192.168.1.100',
      '10.0.0.1',
      '127.0.0.1'
    ]}
    correctAnswer="172.16.0.1"
    hint="The safe-haven.secure domain points to the trusted network range. That's your escape route."
    navigateTo={navigateTo}
    gameState={gameState}
  />
);

const Level5 = ({ navigateTo, gameState }) => (
  <LevelTemplate
    levelNum={5}
    title="MIXED CONTENT BREACH"
    icon={Shield}
    story="SECURITY VIOLATION: Mixed content detected! The secure HTTPS site is loading insecure HTTP resources, creating a vulnerability that attackers can exploit to intercept your escape route."
    codeExample={`<head>
  <link rel="stylesheet" href="http://fonts.example.com/css">
  <script src="https://cdn.secure.com/jquery.js"></script>
</head>
<body>
  <img src="http://images.unsecure.com/logo.png">
  <iframe src="https://secure-widget.com/embed"></iframe>
</body>`}
    question="Which resources need to be changed from HTTP to HTTPS?"
    options={[
      'Only the stylesheet link',
      'Only the image source',
      'Both the stylesheet link and image source',
      'All resources are already secure'
    ]}
    correctAnswer="Both the stylesheet link and image source"
    hint="Look for any URLs that start with 'http://' instead of 'https://' - all resources on an HTTPS page should be secure."
    navigateTo={navigateTo}
    gameState={gameState}
  />
);

const Level6 = ({ navigateTo, gameState }) => (
  <LevelTemplate
    levelNum={6}
    title="RESPONSIVE FAILURE"
    icon={FileText}
    story="DISPLAY MALFUNCTION: The escape interface is broken on mobile devices. Users accessing the system from phones cannot see the escape button due to a faulty media query."
    codeExample={`@media screen (max-width: 768px) {
  .escape-button {
    display: none;
  }
}

.escape-button {
  background: #ff0000;
  color: white;
  padding: 15px 30px;
  font-size: 18px;
}`}
    question="What's wrong with this CSS media query?"
    options={[
      'Missing "and" keyword: should be "@media screen and (max-width: 768px)"',
      'Wrong syntax for max-width',
      'Display none is incorrect',
      'Missing semicolon'
    ]}
    correctAnswer='Missing "and" keyword: should be "@media screen and (max-width: 768px)"'
    hint="Media query syntax requires 'and' to combine media type with conditions."
    navigateTo={navigateTo}
    gameState={gameState}
  />
);

const Level7 = ({ navigateTo, gameState }) => {
  const [passcode, setPasscode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const successRef = useRef(null);

  // Generate passcode from previous levels (simplified)
  const correctPasscode = "ESCAPE7"; // This would normally be derived from previous levels

  const handleHint = () => {
    setShowHint(true);
    const newHintsUsed = { ...gameState.hintsUsed, [7]: true };
    gameState.setHintsUsed(newHintsUsed);
  };

  const handleSubmit = () => {
    const correct = passcode.toUpperCase().trim() === correctPasscode;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      // Calculate points with 25% deduction for each wrong attempt
      const wrongAttemptsForLevel = gameState.wrongAnswers[`level_7`] || 0;
      const basePoints = gameState.hintsUsed[7] ? 50 : 100;
      const deductionMultiplier = Math.pow(0.75, wrongAttemptsForLevel); // 25% deduction per wrong attempt
      const finalPoints = Math.max(Math.floor(basePoints * deductionMultiplier), 10); // Minimum 10 points
      
      gameState.setScore(gameState.score + finalPoints);
      
      if (!gameState.completedLevels.includes(7)) {
        gameState.setCompletedLevels([...gameState.completedLevels, 7]);
      }

      if (successRef.current) {
        animateElement(successRef.current, { opacity: 1, y: 0 }, 0.5);
      }
    } else {
      // Track wrong answers and apply 25% point deduction rule
      const wrongKey = `level_7`;
      const newWrongAnswers = { 
        ...gameState.wrongAnswers, 
        [wrongKey]: (gameState.wrongAnswers[wrongKey] || 0) + 1 
      };
      gameState.setWrongAnswers(newWrongAnswers);
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Key className="w-8 h-8 mr-2 text-red-400" />
          <h2 className="text-3xl font-bold text-red-400">
            LEVEL 7: FINAL ESCAPE SEQUENCE
          </h2>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
          <div className="bg-green-600 h-2 rounded-full w-full"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-red-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">FINAL SYSTEM LOCK:</h3>
          <p className="text-green-300 leading-relaxed mb-4">
            CRITICAL: You've reached the core system firewall. To complete your escape, you must enter the master passcode. 
            This code has been assembled from clues hidden throughout your journey.
          </p>
          <p className="text-red-300">
            WARNING: Incorrect attempts will trigger security lockdown. You have learned enough to deduce the code.
          </p>
        </div>

        <div className="bg-gray-900 border border-blue-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-blue-400 mb-4">ENTER ESCAPE PASSCODE:</h3>
          
          {/* Point Deduction Information for Level 7 */}
          <div className="bg-gradient-to-r from-purple-900/50 to-red-900/50 border border-purple-600 p-3 rounded-lg mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="text-white font-semibold">
                  Current Points Available: 
                </span>
                <span className="text-yellow-400 font-bold ml-1">
                  {(() => {
                    const wrongAttempts = gameState.wrongAnswers[`level_7`] || 0;
                    const basePoints = gameState.hintsUsed[7] ? 50 : 100;
                    const deductionMultiplier = Math.pow(0.75, wrongAttempts);
                    return Math.max(Math.floor(basePoints * deductionMultiplier), 10);
                  })()}
                </span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1 text-red-400" />
                <span className="text-red-300">
                  Wrong Attempts: {gameState.wrongAnswers[`level_7`] || 0}
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-xs mt-2">
              ⚠️ Rule: Each wrong attempt reduces reward points by 25% (minimum 10 points)
            </p>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-black border border-green-800 p-4 rounded text-green-400 font-mono text-2xl text-center uppercase"
              placeholder="ENTER PASSCODE..."
              maxLength={10}
            />
          </div>

          <div className="space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                disabled={!passcode || showFeedback}
                className="flex-1 bg-green-800 hover:bg-green-700 disabled:bg-gray-700 px-4 py-2 rounded transition-colors"
              >
                INITIATE ESCAPE
              </button>
              
              {!showHint && !gameState.hintsUsed[7] && (
                <button
                  onClick={handleHint}
                  className="bg-yellow-800 hover:bg-yellow-700 px-4 py-2 rounded transition-colors"
                >
                  Emergency Hint (-50% points)
                </button>
              )}
            </div>

            {showHint && (
              <div className="bg-yellow-900 border border-yellow-600 p-3 rounded-lg">
                <p className="text-yellow-300">💡 EMERGENCY HINT: The passcode is "ESCAPE7" - a combination of your mission and final level number.</p>
              </div>
            )}

            {showFeedback && (
              <div className={`border p-3 rounded-lg ${isCorrect ? 'bg-green-900 border-green-600' : 'bg-red-900 border-red-600'}`}>
                <p className={isCorrect ? 'text-green-300' : 'text-red-300'}>
                  {isCorrect ? '✅ PASSCODE ACCEPTED! System unlocked. Escape route activated.' : '❌ ACCESS DENIED. Incorrect passcode.'}
                </p>
                
                {!isCorrect && gameState.wrongAnswers[`level_7`] > 0 && (
                  <div className="mt-2 p-2 bg-red-800/50 rounded border border-red-600">
                    <p className="text-red-200 text-xs flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      <strong>Security Alert:</strong> Wrong attempt #{gameState.wrongAnswers[`level_7`]}. Next correct attempt will earn {(() => {
                        const wrongAttempts = gameState.wrongAnswers[`level_7`] || 0;
                        const basePoints = gameState.hintsUsed[7] ? 50 : 100;
                        const deductionMultiplier = Math.pow(0.75, wrongAttempts);
                        return Math.max(Math.floor(basePoints * deductionMultiplier), 10);
                      })()} points instead of {gameState.hintsUsed[7] ? 50 : 100}
                    </p>
                  </div>
                )}
                
                {isCorrect && (
                  <div ref={successRef} style={{ opacity: 0, transform: 'translateY(10px)' }} className="mt-3">
                    <button
                      onClick={() => navigateTo('bonus')}
                      className="bg-purple-800 hover:bg-purple-700 px-6 py-2 rounded transition-colors flex items-center mr-3"
                    >
                      🎯 BONUS CHALLENGES <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Bonus Page
const BonusPage = ({ navigateTo, gameState }) => {
  const [activeBonus, setActiveBonus] = useState(null);
  const [bonusScores, setBonusScores] = useState({});

  const bonusChallenges = [
    {
      id: 1,
      title: "🎯 Phishing Detection Master",
      icon: Eye,
      description: "Identify suspicious domains that could be used for phishing attacks",
      question: "Which of these domains is most likely a phishing attempt for 'bankofamerica.com'?",
      options: [
        "bankofamerica.com",
        "bank0famerica.com (using zero instead of 'o')",
        "bankofamerica.org",
        "americanbank.com"
      ],
      correct: "bank0famerica.com (using zero instead of 'o')",
      hint: "Look for subtle character substitutions that mimic legitimate domains.",
      points: 50
    },
    {
      id: 2,
      title: "🕵️ DOM Inspector Challenge",
      icon: AlertTriangle,
      description: "Find hidden security tokens in HTML code",
      question: "What's the value of the hidden CSRF token in this form?",
      code: `<form action="/login" method="POST">
  <input type="text" name="username" placeholder="Username">
  <input type="password" name="password" placeholder="Password">
  <input type="hidden" name="csrf_token" value="abc123xyz789secure">
  <input type="hidden" name="session_id" value="sess_456def">
  <button type="submit">Login</button>
</form>`,
      options: [
        "csrf_token",
        "abc123xyz789secure",
        "sess_456def",
        "Login"
      ],
      correct: "abc123xyz789secure",
      hint: "Look for input elements with type='hidden' and name='csrf_token'.",
      points: 50
    },
    {
      id: 3,
      title: "⚡ XSS Payload Constructor",
      icon: Bug,
      description: "Create a basic XSS payload for educational purposes",
      question: "Enter the XSS payload that would show an alert with message 'HACKED':",
      isTextInput: true,
      correct: "<script>alert('HACKED')</script>",
      hint: "Use script tags with the alert() function containing the message 'HACKED'.",
      points: 75
    },
    {
      id: 4,
      title: "🔐 SQL Injection Detector",
      icon: Database,
      description: "Identify SQL injection vulnerabilities in code",
      question: "Which input would cause a SQL injection in this query: SELECT * FROM users WHERE username = '$input'",
      options: [
        "admin",
        "user123",
        "admin' OR '1'='1' --",
        "testuser"
      ],
      correct: "admin' OR '1'='1' --",
      hint: "Look for SQL syntax that breaks out of quotes and adds logic.",
      points: 75
    },
    {
      id: 5,
      title: "🌐 HTTP Header Security",
      icon: Shield,
      description: "Configure secure HTTP headers",
      question: "Which header prevents clickjacking attacks?",
      options: [
        "Content-Security-Policy",
        "X-Frame-Options",
        "Strict-Transport-Security",
        "X-XSS-Protection"
      ],
      correct: "X-Frame-Options",
      hint: "This header controls whether a page can be embedded in frames/iframes.",
      points: 50
    },
    {
      id: 6,
      title: "🚀 Performance Optimization",
      icon: Zap,
      description: "Optimize web performance",
      question: "What's the best way to reduce initial page load time?",
      options: [
        "Add more JavaScript",
        "Use code splitting and lazy loading",
        "Increase image sizes",
        "Remove CSS minification"
      ],
      correct: "Use code splitting and lazy loading",
      hint: "Think about loading only what's needed initially.",
      points: 50
    },
    {
      id: 7,
      title: "🎨 CSS Grid Master",
      icon: Layers,
      description: "Advanced CSS layout challenge",
      question: "How do you create a 3-column grid with equal spacing?",
      code: `.container {
  display: grid;
  /* Your answer here */
}`,
      isTextInput: true,
      correct: "grid-template-columns: 1fr 1fr 1fr",
      hint: "Use fractional units (fr) to create equal columns.",
      points: 75
    },
    {
      id: 8,
      title: "🔧 API Error Handler",
      icon: Terminal,
      description: "Handle API errors gracefully",
      question: "What HTTP status code indicates 'Resource Not Found'?",
      options: [
        "200",
        "404",
        "500",
        "403"
      ],
      correct: "404",
      hint: "This is probably the most famous HTTP status code!",
      points: 25
    }
  ];

  const handleBonusSubmit = (bonusId, answer) => {
    const challenge = bonusChallenges.find(c => c.id === bonusId);
    const isCorrect = answer.toLowerCase().trim() === challenge.correct.toLowerCase().trim();
    
    if (isCorrect && !bonusScores[bonusId]) {
      setBonusScores({...bonusScores, [bonusId]: 25});
      gameState.setScore(gameState.score + 25);
    }
    
    return isCorrect;
  };

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-purple-400 mb-4">
          [BONUS_CHALLENGES.exe]
        </h2>
        <p className="text-green-300 max-w-2xl mx-auto">
          Advanced security challenges for elite hackers. Each bonus worth 25 points.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {bonusChallenges.map((challenge) => (
          <BonusCard
            key={challenge.id}
            challenge={challenge}
            isActive={activeBonus === challenge.id}
            onClick={() => setActiveBonus(activeBonus === challenge.id ? null : challenge.id)}
            onSubmit={handleBonusSubmit}
            score={bonusScores[challenge.id] || 0}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-yellow-400 mb-4">
          Bonus Score: {Object.values(bonusScores).reduce((a, b) => a + b, 0)} / 75 points
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="bg-green-800 hover:bg-green-700 px-6 py-2 rounded transition-colors"
        >
          Return to Main Terminal
        </button>
      </div>
    </div>
  );
};

const BonusCard = ({ challenge, isActive, onClick, onSubmit, score }) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = () => {
    const correct = onSubmit(challenge.id, answer);
    setAttempts(attempts + 1);
    
    if (correct) {
      setFeedback(`🎉 Correct! +${challenge.points || 25} points`);
      playSound('success');
      createParticles(document.querySelector(`[data-challenge="${challenge.id}"]`), 15);
    } else {
      setFeedback(`❌ Incorrect. Try again! (Attempt ${attempts + 1})`);
      playSound('error');
    }
  };

  const resetChallenge = () => {
    setAnswer('');
    setFeedback('');
    setShowHint(false);
    setAttempts(0);
  };

  return (
    <div 
      data-challenge={challenge.id}
      className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-800 rounded-2xl p-6 relative overflow-hidden"
    >
      <div
        className="cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <challenge.icon className="w-8 h-8 mr-3 text-purple-400" />
            <h3 className="text-xl font-bold text-purple-400">{challenge.title}</h3>
          </div>
          {score > 0 && (
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              ✓ {score}pts
            </span>
          )}
        </div>
        <p className="text-green-300 text-sm mb-4">{challenge.description}</p>
      </div>

      {isActive && (
        <div className="mt-6 space-y-4 border-t border-purple-700 pt-4">
          <div className="bg-black/50 p-4 rounded-lg">
            <p className="text-green-300 mb-4">{challenge.question}</p>
            
            {challenge.code && (
              <pre className="bg-gray-900 border border-gray-700 p-4 rounded text-green-300 text-sm overflow-x-auto mb-4 font-mono">
                <code>{challenge.code}</code>
              </pre>
            )}

            {challenge.isTextInput ? (
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-black border-2 border-green-800 focus:border-green-400 p-3 rounded text-green-400 font-mono"
                placeholder="Enter your answer..."
                disabled={score > 0}
              />
            ) : (
              <div className="space-y-2">
                {challenge.options.map((option, index) => (
                  <label key={index} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-800/50 p-3 rounded transition-colors">
                    <input
                      type="radio"
                      name={`bonus-${challenge.id}`}
                      value={option}
                      checked={answer === option}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="mt-1 text-purple-400"
                      disabled={score > 0}
                    />
                    <span className="text-sm text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSubmit}
              disabled={!answer || score > 0}
              className="bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-600 px-4 py-2 rounded text-sm font-bold transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <Zap className="w-4 h-4 mr-1" />
              Submit
            </button>
            
            <button
              onClick={() => setShowHint(!showHint)}
              className="bg-gradient-to-r from-yellow-800 to-yellow-600 hover:from-yellow-700 hover:to-yellow-500 px-4 py-2 rounded text-sm font-bold transition-all duration-300 flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              Hint
            </button>

            {(feedback || attempts > 0) && (
              <button
                onClick={resetChallenge}
                className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 px-4 py-2 rounded text-sm font-bold transition-all duration-300 flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </button>
            )}
          </div>

          {showHint && (
            <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-600 p-3 rounded-lg">
              <p className="text-yellow-300 text-sm flex items-center">
                <span className="text-lg mr-2">💡</span>
                <strong>Hint:</strong> {challenge.hint}
              </p>
            </div>
          )}

          {feedback && (
            <div className={`border p-3 rounded-lg text-sm ${
              feedback.includes('Correct') 
                ? 'bg-green-900/50 border-green-600 text-green-300' 
                : 'bg-red-900/50 border-red-600 text-red-300'
            }`}>
              {feedback}
            </div>
          )}

          {/* Difficulty indicator */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Points: {challenge.points || 25}</span>
            <span>Attempts: {attempts}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Escape Success Page
const EscapePage = ({ navigateTo, gameState }) => {
  const maxScore = 700 + 75; // 7 levels * 100 + 3 bonus * 25
  const percentage = Math.round((gameState.score / maxScore) * 100);
  
  const getRank = () => {
    if (percentage >= 95) return { rank: "ELITE HACKER", color: "text-yellow-400" };
    if (percentage >= 85) return { rank: "SENIOR DEBUGGER", color: "text-green-400" };
    if (percentage >= 70) return { rank: "SYSTEM ANALYST", color: "text-blue-400" };
    if (percentage >= 50) return { rank: "JUNIOR DEVELOPER", color: "text-purple-400" };
    return { rank: "SCRIPT KIDDIE", color: "text-red-400" };
  };

  const resetGame = () => {
    localStorage.removeItem('escapeWeb_currentLevel');
    localStorage.removeItem('escapeWeb_score');
    localStorage.removeItem('escapeWeb_hintsUsed');
    localStorage.removeItem('escapeWeb_completedLevels');
    localStorage.removeItem('escapeWeb_levelAttempts');
    localStorage.removeItem('escapeWeb_wrongAnswers');
    navigateTo('home');
    window.location.reload();
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding debugging skills!";
    if (percentage >= 70) return "Good problem-solving abilities!";
    if (percentage >= 50) return "Basic understanding demonstrated.";
    return "Keep practicing your web development skills!";
  };

  const { rank, color } = getRank();

  return (
    <div className="py-12 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Award className="w-16 h-16 mx-auto mb-4 text-yellow-400 animate-pulse" />
          <h1 className="text-6xl font-bold text-green-400 mb-4 animate-pulse">
            ESCAPE SUCCESSFUL!
          </h1>
          <p className="text-2xl text-green-300 mb-6">
            System corruption eliminated. You have successfully debugged your way to freedom!
          </p>
        </div>

        <div className="bg-gray-900 border border-green-800 p-8 rounded-lg mb-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">MISSION REPORT</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">Performance Metrics:</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Levels Completed:</span>
                  <span className="text-green-400">{gameState.completedLevels.length}/7</span>
                </div>
                <div className="flex justify-between">
                  <span>Hints Used:</span>
                  <span className="text-yellow-400">{Object.keys(gameState.hintsUsed).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Final Score:</span>
                  <span className="text-green-400">{gameState.score}/{maxScore}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="text-green-400">{percentage}%</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-purple-400 mb-4">Achievement Unlocked:</h3>
              <div className="text-center">
                <div className={`text-4xl font-bold ${color} mb-2`}>
                  {rank}
                </div>
                <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
                  <div 
                    className="bg-green-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-green-300">
                  {getPerformanceMessage()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-green-300 max-w-2xl mx-auto">
            <p className="mb-4">
              Congratulations! You have successfully navigated through the corrupted web system, 
              fixing critical bugs and security vulnerabilities along the way.
            </p>
            <p>
              Your debugging journey has ended, but the skills you have demonstrated will serve 
              you well in real-world web development challenges.
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo('bonus')}
              className="bg-purple-800 hover:bg-purple-700 px-6 py-3 rounded transition-colors"
            >
              Try Bonus Challenges
            </button>
            <button
              onClick={resetGame}
              className="bg-red-800 hover:bg-red-700 px-6 py-3 rounded transition-colors"
            >
              Restart Mission
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="bg-green-800 hover:bg-green-700 px-6 py-3 rounded transition-colors"
            >
              Return to Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscapeWebGame;