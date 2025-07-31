import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Eye, Clock, Trophy, Zap, Shield, Link, Code, Server, Lock, Unlock, RotateCcw, Home, Star, Flame, Sparkles, Crown, Target, Gamepad2 } from 'lucide-react';

const EscapeGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(1000);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [hintsUsed, setHintsUsed] = useState([]);
  const [levelCompleted, setLevelCompleted] = useState(Array(7).fill(false));
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [particles, setParticles] = useState([]);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  
  // Level-specific states
  const [draggedElements, setDraggedElements] = useState([]);
  const [selectedCSS, setSelectedCSS] = useState('');
  const [domainMatches, setDomainMatches] = useState({});
  const [loadingOrder, setLoadingOrder] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState('');
  const [fixedLinks, setFixedLinks] = useState({});
  const [decodeInput, setDecodeInput] = useState('');

  const gameRef = useRef(null);

  const levels = [
    {
      title: "🔧 Broken Layout Fix",
      description: "The HTML elements are all mixed up! Drag them to their correct positions to restore the webpage.",
      icon: <Code className="w-6 h-6" />,
      hint: "Headers go at the top, content in the middle, footer at the bottom!",
      difficulty: "Easy",
      points: 100,
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "🎨 CSS Bug Hunt",
      description: "Something's wrong with this styling. Find and eliminate the visual bug!",
      icon: <Eye className="w-6 h-6" />,
      hint: "Look for the color that doesn't match the design pattern.",
      difficulty: "Easy",
      points: 150,
      color: "from-green-500 to-blue-600"
    },
    {
      title: "🌐 DNS Resolution",
      description: "Match each domain to its correct IP address in this network challenge.",
      icon: <Server className="w-6 h-6" />,
      hint: "Popular sites often have memorable IP patterns or well-known addresses.",
      difficulty: "Medium",
      points: 200,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "⚡ Loading Sequence",
      description: "Arrange the web loading steps in the correct chronological order.",
      icon: <Zap className="w-6 h-6" />,
      hint: "DNS lookup happens first, then server connection, then content download.",
      difficulty: "Medium",
      points: 250,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "🔒 Security Protocol",
      description: "Choose the secure connection and protect user data from threats.",
      icon: <Shield className="w-6 h-6" />,
      hint: "Look for the lock icon and the 'S' in the protocol name.",
      difficulty: "Medium",
      points: 200,
      color: "from-red-500 to-purple-600"
    },
    {
      title: "🔗 Link Repair",
      description: "Fix the broken navigation links to restore website functionality.",
      icon: <Link className="w-6 h-6" />,
      hint: "Check the href attributes - they should match the intended destinations.",
      difficulty: "Hard",
      points: 300,
      color: "from-teal-500 to-blue-600"
    },
    {
      title: "🔐 Decode the Master Key",
      description: "Decode the final escape key to complete your mission and escape the digital maze.",
      icon: <Lock className="w-6 h-6" />,
      hint: "This looks like Base64 encoding. Try decoding: RXNjYXBlV2Vi",
      difficulty: "Hard",
      points: 500,
      color: "from-gold to-yellow-500"
    }
  ];

  // Achievement definitions
  const achievementList = [
    { id: 'no_hints', name: 'Hint-Free Hero', desc: 'Complete a level without using hints', icon: '🧠' },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete a level in under 30 seconds', icon: '⚡' },
    { id: 'perfect_score', name: 'Perfect Score', desc: 'Keep maximum score throughout', icon: '💯' },
    { id: 'combo_master', name: 'Combo Master', desc: 'Complete 3 levels in a row', icon: '🔥' },
    { id: 'escape_master', name: 'Escape Master', desc: 'Complete all 7 levels', icon: '👑' }
  ];

  // Particle system for visual effects
  const createParticles = (type = 'success') => {
    const newParticles = [];
    const colors = type === 'success' ? ['#10b981', '#3b82f6', '#8b5cf6'] : ['#ef4444', '#f59e0b', '#ec4899'];
    
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10
        },
        life: 1
      });
    }
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  useEffect(() => {
    if (gameStarted && !startTime) {
      setStartTime(Date.now());
    }
  }, [gameStarted, startTime]);

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    createParticles('success');
  };

  const useHint = (levelIndex) => {
    if (!hintsUsed.includes(levelIndex)) {
      setHintsUsed([...hintsUsed, levelIndex]);
      setScore(Math.max(0, score - 50));
      setComboMultiplier(1); // Reset combo on hint use
    }
  };

  const unlockAchievement = (achievementId) => {
    if (!achievements.includes(achievementId)) {
      setAchievements([...achievements, achievementId]);
      createParticles('success');
    }
  };

  const completeLevel = (levelIndex) => {
    const newCompleted = [...levelCompleted];
    newCompleted[levelIndex] = true;
    setLevelCompleted(newCompleted);
    
    // Calculate bonus points
    const levelPoints = levels[levelIndex].points * comboMultiplier;
    setScore(score + levelPoints);
    
    // Update streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    
    // Check for achievements
    if (!hintsUsed.includes(levelIndex)) {
      unlockAchievement('no_hints');
    }
    
    if (newStreak === 3) {
      unlockAchievement('combo_master');
      setComboMultiplier(comboMultiplier + 1);
    }
    
    // Show level complete animation
    setShowLevelComplete(true);
    createParticles('success');
    setTimeout(() => setShowLevelComplete(false), 2000);
    
    if (levelIndex === 6) {
      setGameCompleted(true);
      setEndTime(Date.now());
      unlockAchievement('escape_master');
      if (score >= 1000) unlockAchievement('perfect_score');
    } else {
      setTimeout(() => setCurrentLevel(levelIndex + 1), 1500);
    }
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setGameStarted(false);
    setGameCompleted(false);
    setScore(1000);
    setStartTime(null);
    setEndTime(null);
    setHintsUsed([]);
    setLevelCompleted(Array(7).fill(false));
    setStreak(0);
    setAchievements([]);
    setParticles([]);
    setShowLevelComplete(false);
    setComboMultiplier(1);
    setDraggedElements([]);
    setSelectedCSS('');
    setDomainMatches({});
    setLoadingOrder([]);
    setSelectedProtocol('');
    setFixedLinks({});
    setDecodeInput('');
  };

  const resetCurrentLevel = () => {
    // Reset level-specific states based on current level
    switch(currentLevel) {
      case 0:
        setDraggedElements([]);
        break;
      case 1:
        setSelectedCSS('');
        break;
      case 2:
        setDomainMatches({});
        break;
      case 3:
        setLoadingOrder([]);
        break;
      case 4:
        setSelectedProtocol('');
        break;
      case 5:
        setFixedLinks({});
        break;
      case 6:
        setDecodeInput('');
        break;
    }
  };

  // Enhanced Level Components
  const Level1BrokenLayout = () => {
    const elements = [
      { tag: '<header>', desc: 'Page header with logo and navigation', color: 'bg-red-600' },
      { tag: '<nav>', desc: 'Main navigation menu', color: 'bg-blue-600' },
      { tag: '<main>', desc: 'Primary content area', color: 'bg-green-600' },
      { tag: '<aside>', desc: 'Sidebar content', color: 'bg-yellow-600' },  
      { tag: '<footer>', desc: 'Page footer with links', color: 'bg-purple-600' }
    ];
    const correctOrder = ['<header>', '<nav>', '<main>', '<aside>', '<footer>'];
    
    const handleDrop = (e, position) => {
      e.preventDefault();
      const element = e.dataTransfer.getData('text/plain');
      const newElements = [...draggedElements];
      newElements[position] = element;
      setDraggedElements(newElements);
      
      // Visual feedback for correct placement
      e.target.classList.add('animate-pulse');
      setTimeout(() => e.target.classList.remove('animate-pulse'), 500);
      
      if (JSON.stringify(newElements) === JSON.stringify(correctOrder)) {
        createParticles('success');
        setTimeout(() => completeLevel(0), 500);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.target.classList.add('border-blue-400', 'bg-blue-900/20');
    };

    const handleDragLeave = (e) => {
      e.target.classList.remove('border-blue-400', 'bg-blue-900/20');
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-green-500 shadow-2xl shadow-green-500/20">
          <h3 className="text-green-400 mb-6 text-xl font-bold flex items-center">
            <Code className="w-6 h-6 mr-2" />
            Drag HTML elements to their correct positions:
          </h3>
          
          {/* Drop zones with semantic descriptions */}
          <div className="space-y-3 mb-6">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="relative h-16 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-400 transition-all duration-300 hover:border-gray-500 hover:bg-gray-800/50"
                onDrop={(e) => handleDrop(e, i)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="text-center">
                  <div className="font-mono text-lg">
                    {draggedElements[i] || `Position ${i + 1}`}
                  </div>
                  {!draggedElements[i] && (
                    <div className="text-xs text-gray-500 mt-1">
                      {i === 0 && "Top of page"}
                      {i === 1 && "Navigation area"}
                      {i === 2 && "Main content"}
                      {i === 3 && "Side content"}
                      {i === 4 && "Bottom of page"}
                    </div>
                  )}
                </div>
                {draggedElements[i] === correctOrder[i] && (
                  <div className="absolute -right-2 -top-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Visual webpage preview */}
          <div className="bg-white p-4 rounded-lg border border-gray-300 mb-4">
            <div className="text-black text-sm">
              <div className="text-gray-600 mb-2">📄 Webpage Preview:</div>
              {draggedElements.map((element, i) => (
                <div key={i} className={`p-2 mb-1 rounded text-xs ${
                  element === '<header>' ? 'bg-red-100 text-red-800' :
                  element === '<nav>' ? 'bg-blue-100 text-blue-800' :
                  element === '<main>' ? 'bg-green-100 text-green-800' :
                  element === '<aside>' ? 'bg-yellow-100 text-yellow-800' :
                  element === '<footer>' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {element || 'Empty slot'}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Draggable elements with enhanced styling */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {elements.map((el, index) => (
            <div
              key={el.tag}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', el.tag);
                e.target.style.opacity = '0.5';
              }}
              onDragEnd={(e) => {
                e.target.style.opacity = '1';
              }}
              className={`${el.color} px-4 py-3 rounded-xl cursor-move hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-bold text-center relative group overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="font-mono text-sm">{el.tag}</div>
                <div className="text-xs opacity-90 mt-1">{el.desc}</div>
              </div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Level2CSSBug = () => {
    const cssOptions = ['color: #ff0000', 'color: #00ff00', 'color: #0000ff', 'color: #ff69b4'];
    const correctCSS = 'color: #ff69b4';

    const handleCSSSelect = (css) => {
      setSelectedCSS(css);
      if (css === correctCSS) {
        completeLevel(1);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-green-500">
          <h3 className="text-green-400 mb-4">Find the CSS bug in this design:</h3>
          <div className="bg-white p-4 rounded text-black">
            <h1 style={{color: '#ff0000'}}>Red Header</h1>
            <p style={{color: '#00ff00'}}>Green paragraph text</p>
            <p style={{color: '#0000ff'}}>Blue paragraph text</p>
            <p style={{color: '#ff69b4'}}>Pink paragraph text - This one looks wrong!</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {cssOptions.map(css => (
            <button
              key={css}
              onClick={() => handleCSSSelect(css)}
              className={`p-3 rounded border ${
                selectedCSS === css 
                  ? 'border-green-500 bg-green-900' 
                  : 'border-gray-600 bg-gray-800'
              } hover:bg-gray-700 transition-colors`}
            >
              {css}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Level3DNS = () => {
    const domains = ['google.com', 'github.com', 'stackoverflow.com'];
    const ips = ['142.250.191.14', '140.82.114.4', '151.101.1.69'];
    const correctMatches = {
      'google.com': '142.250.191.14',
      'github.com': '140.82.114.4',
      'stackoverflow.com': '151.101.1.69'
    };

    const handleMatch = (domain, ip) => {
      const newMatches = {...domainMatches, [domain]: ip};
      setDomainMatches(newMatches);
      
      if (Object.keys(newMatches).length === 3) {
        let correct = true;
        for (let domain in correctMatches) {
          if (newMatches[domain] !== correctMatches[domain]) {
            correct = false;
            break;
          }
        }
        if (correct) completeLevel(2);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-green-500">
          <h3 className="text-green-400 mb-4">Match domains to their IP addresses:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-blue-400 mb-2">Domains:</h4>
              {domains.map(domain => (
                <div key={domain} className="bg-blue-900 p-2 rounded mb-2">
                  {domain} → {domainMatches[domain] || '?'}
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-yellow-400 mb-2">IP Addresses:</h4>
              {ips.map(ip => (
                <button
                  key={ip}
                  onClick={() => {
                    const nextDomain = domains.find(d => !domainMatches[d]);
                    if (nextDomain) handleMatch(nextDomain, ip);
                  }}
                  className="block w-full bg-yellow-900 p-2 rounded mb-2 hover:bg-yellow-800 transition-colors"
                >
                  {ip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Level4LoadingOrder = () => {
    const steps = ['DNS Lookup', 'TCP Connection', 'HTTP Request', 'Server Processing', 'HTTP Response', 'Render Page'];
    const correctOrder = ['DNS Lookup', 'TCP Connection', 'HTTP Request', 'Server Processing', 'HTTP Response', 'Render Page'];

    const handleStepClick = (step) => {
      if (!loadingOrder.includes(step)) {
        const newOrder = [...loadingOrder, step];
        setLoadingOrder(newOrder);
        
        if (newOrder.length === 6 && JSON.stringify(newOrder) === JSON.stringify(correctOrder)) {
          completeLevel(3);
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-green-500">
          <h3 className="text-green-400 mb-4">Click steps in the correct loading order:</h3>
          <div className="mb-4">
            <h4 className="text-blue-400 mb-2">Your Order:</h4>
            <div className="flex flex-wrap gap-2">
              {loadingOrder.map((step, i) => (
                <div key={i} className="bg-green-900 px-3 py-1 rounded text-sm">
                  {i + 1}. {step}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {steps.map(step => (
            <button
              key={step}
              onClick={() => handleStepClick(step)}
              disabled={loadingOrder.includes(step)}
              className={`p-3 rounded border ${
                loadingOrder.includes(step)
                  ? 'border-green-500 bg-green-900 opacity-50'
                  : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
              } transition-colors`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Level5Security = () => {
    const protocols = [
      { name: 'HTTP', url: 'http://example.com', secure: false },
      { name: 'HTTPS', url: 'https://example.com', secure: true }
    ];

    const handleProtocolSelect = (protocol) => {
      setSelectedProtocol(protocol.name);
      if (protocol.secure) {
        completeLevel(4);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-green-500">
          <h3 className="text-green-400 mb-4">Choose the secure protocol:</h3>
          <p className="text-gray-300 mb-4">You need to access sensitive user data. Which protocol should you use?</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {protocols.map(protocol => (
            <button
              key={protocol.name}
              onClick={() => handleProtocolSelect(protocol)}
              className={`p-4 rounded border flex items-center justify-between ${
                selectedProtocol === protocol.name
                  ? 'border-green-500 bg-green-900'
                  : 'border-gray-600 bg-gray-800'
              } hover:bg-gray-700 transition-colors`}
            >
              <div className="flex items-center gap-3">
                {protocol.secure ? <Lock className="w-5 h-5 text-green-400" /> : <Unlock className="w-5 h-5 text-red-400" />}
                <span className="font-mono">{protocol.url}</span>
              </div>
              <span className={protocol.secure ? 'text-green-400' : 'text-red-400'}>
                {protocol.secure ? 'Secure' : 'Insecure'}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Level6LinkRepair = () => {
    const links = [
      { text: 'Home', current: '/hom', correct: '/home' },
      { text: 'About', current: '/abot', correct: '/about' },
      { text: 'Contact', current: '/contac', correct: '/contact' }
    ];

    const handleLinkFix = (linkText, newHref) => {
      const newFixed = {...fixedLinks, [linkText]: newHref};
      setFixedLinks(newFixed);
      
      let allCorrect = true;
      links.forEach(link => {
        if (newFixed[link.text] !== link.correct) {
          allCorrect = false;
        }
      });
      
      if (allCorrect && Object.keys(newFixed).length === 3) {
        completeLevel(5);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-green-500">
          <h3 className="text-green-400 mb-4">Fix the broken navigation links:</h3>
          <nav className="bg-gray-800 p-3 rounded">
            {links.map(link => (
              <div key={link.text} className="flex items-center gap-4 mb-2">
                <span className="text-blue-400">{link.text}:</span>
                <input
                  type="text"
                  defaultValue={link.current}
                  onChange={(e) => handleLinkFix(link.text, e.target.value)}
                  className="bg-gray-700 px-2 py-1 rounded text-white border border-gray-600 focus:border-blue-500"
                  placeholder="Enter correct href"
                />
                <span className="text-xs text-gray-400">should be: {link.correct}</span>
              </div>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  const Level7Decode = () => {
    const encodedKey = 'RXNjYXBlV2Vi';
    const correctKey = 'EscapeWeb';
    const [attempts, setAttempts] = React.useState(0);
    const [showHint, setShowHint] = React.useState(false);

    const handleDecode = () => {
      setAttempts(attempts + 1);
      
      if (decodeInput.toLowerCase() === correctKey.toLowerCase()) {
        createParticles('success');
        setTimeout(() => completeLevel(6), 1000);
      } else if (attempts >= 2) {
        setShowHint(true);
      }
    };

    const decodeBase64Demo = () => {
      // Show step-by-step decoding animation
      const steps = [
        { step: 1, text: 'RXNjYXBlV2Vi', desc: 'Original Base64 string' },
        { step: 2, text: 'Converting...', desc: 'Base64 → Binary → ASCII' },
        { step: 3, text: 'EscapeWeb', desc: 'Decoded result!' }
      ];
      
      // This could trigger a step-by-step animation
      setDecodeInput('EscapeWeb');
    };

    return (
      <div className="space-y-8">
        {/* Main decode challenge */}
        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-green-500 shadow-2xl shadow-green-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
          <div className="relative z-10">
            <h3 className="text-green-400 mb-6 text-2xl font-bold flex items-center">
              <Lock className="w-8 h-8 mr-3 animate-pulse" />
              🔐 FINAL ESCAPE SEQUENCE 🔐
            </h3>
            
            {/* Matrix-style code display */}
            <div className="bg-black p-6 rounded-xl font-mono border border-green-400/50 mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent animate-pulse"></div>
              <div className="relative">
                <div className="text-green-400 text-lg mb-2 animate-pulse">
                  ENCRYPTED_KEY: <span className="text-yellow-400 text-xl font-bold bg-yellow-400/20 px-2 py-1 rounded">{encodedKey}</span>
                </div>
                <div className="text-gray-400 mt-3 text-sm">
                  📡 DECRYPTION PROTOCOL: Base64
                </div>
                <div className="text-gray-400 text-sm">
                  🎯 TARGET: ASCII String
                </div>
                <div className="text-red-400 text-sm mt-2 animate-blink">
                  ⚠️ ATTEMPTS: {attempts}/3
                </div>
              </div>
            </div>

            {/* Enhanced input area */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={decodeInput}
                  onChange={(e) => setDecodeInput(e.target.value)}
                  placeholder="Enter decoded key to escape..."
                  className="flex-1 bg-gray-800 px-4 py-3 rounded-xl border-2 border-gray-600 text-white text-lg focus:border-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400"
                  style={{ fontFamily: 'monospace' }}
                />
                <button
                  onClick={handleDecode}
                  className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-3 rounded-xl text-white font-bold hover:from-green-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30 flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  DECODE & ESCAPE
                </button>
              </div>
              
              {/* Demo decoder button */}
              <div className="text-center">
                <button
                  onClick={decodeBase64Demo}
                  className="text-yellow-400 hover:text-yellow-300 text-sm underline transition-colors"
                >
                  🔍 Need help? Click for Base64 demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progressive hints */}
        {showHint && (
          <div className="bg-yellow-900/30 border-2 border-yellow-500/50 rounded-xl p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-yellow-400 animate-pulse" />
              <span className="text-yellow-400 font-bold text-lg">DECRYPTION HINT ACTIVATED</span>
            </div>
            <div className="space-y-3 text-yellow-200">
              <p>🔑 <strong>Base64 Decoder:</strong> This is a common encoding method</p>
              <p>🌐 <strong>Online Tool:</strong> Try searching "Base64 decoder" online</p>
              <p>💡 <strong>Quick Tip:</strong> The decoded string is related to this game's name!</p>
              <div className="bg-yellow-800/30 p-3 rounded-lg mt-4">
                <p className="text-center font-mono text-lg">
                  {encodedKey} → <span className="text-green-400 font-bold">???????</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Base64 reference card */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <h4 className="text-blue-400 font-bold mb-3 flex items-center">
            <Server className="w-5 h-5 mr-2" />
            Base64 Encoding Reference
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-300 mb-2">🔤 <strong>What is Base64?</strong></p>
              <p className="text-gray-400">A method to encode binary data using ASCII characters (A-Z, a-z, 0-9, +, /)</p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">🎯 <strong>Common Uses:</strong></p>
              <p className="text-gray-400">Email attachments, web data transmission, storing binary data in text format</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const levelComponents = [
    Level1BrokenLayout,
    Level2CSSBug,
    Level3DNS,
    Level4LoadingOrder,
    Level5Security,
    Level6LinkRepair,
    Level7Decode
  ];

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div className="text-2xl opacity-20">
                {['💻', '🌐', '⚡', '🔒', '🎯', '🚀', '⭐'][Math.floor(Math.random() * 7)]}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-4xl relative z-10">
          {/* Epic title with glow effect */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-4 animate-pulse drop-shadow-2xl">
              🌟 ESCAPE WEB 🌟
            </h1>
            <div className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 font-bold animate-fade-in">
              The Ultimate Web Dev Challenge
            </div>
          </div>
          
          <p className="text-2xl text-gray-300 mb-12 animate-fade-in">
            🎮 Navigate through 7 mind-bending puzzles and become a web development master! 🎮
          </p>
          
          {/* Enhanced challenge preview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="group bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-md p-6 rounded-2xl border border-green-500/30 hover:border-green-400/60 transition-all duration-500 hover:scale-105 hover:-rotate-2 shadow-2xl hover:shadow-green-500/30">
              <div className="relative">
                <Code className="w-12 h-12 text-green-400 mx-auto mb-4 animate-bounce" />
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="text-green-400 font-bold text-xl mb-2">🔧 Code Fixing</h3>
              <p className="text-gray-300">Debug broken layouts and hunt down CSS bugs</p>
              <div className="mt-4 text-sm text-green-300 font-semibold">Levels 1-2 • Easy</div>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md p-6 rounded-2xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:rotate-2 shadow-2xl hover:shadow-blue-500/30">
              <div className="relative">
                <Server className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin-slow" />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="text-blue-400 font-bold text-xl mb-2">🌐 Web Mastery</h3>
              <p className="text-gray-300">Master DNS, HTTP protocols, and security</p>
              <div className="mt-4 text-sm text-blue-300 font-semibold">Levels 3-5 • Medium</div>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md p-6 rounded-2xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:-rotate-2 shadow-2xl hover:shadow-purple-500/30">
              <div className="relative">
                <Lock className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="text-purple-400 font-bold text-xl mb-2">🔐 Final Challenge</h3>
              <p className="text-gray-300">Crack codes and decode the escape key</p>
              <div className="mt-4 text-sm text-purple-300 font-semibold">Levels 6-7 • Hard</div>
            </div>
          </div>

          {/* Game features */}
          <div className="bg-black/30 backdrop-blur-md p-8 rounded-2xl border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">🏆 Game Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center text-yellow-400">
                <Trophy className="w-5 h-5 mr-3" />
                <span>Dynamic scoring system with combos</span>
              </div>
              <div className="flex items-center text-green-400">
                <Target className="w-5 h-5 mr-3" />
                <span>Achievement system to unlock</span>
              </div>
              <div className="flex items-center text-blue-400">
                <Zap className="w-5 h-5 mr-3" />
                <span>Real-time progress tracking</span>
              </div>
              <div className="flex items-center text-purple-400">
                <Crown className="w-5 h-5 mr-3" />
                <span>Performance rating system</span>
              </div>
            </div>
          </div>
          
          {/* Epic start button */}
          <button
            onClick={startGame}
            className="group relative bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 px-12 py-6 rounded-2xl text-white font-bold text-2xl hover:from-green-400 hover:via-blue-500 hover:to-purple-500 transition-all duration-500 transform hover:scale-110 shadow-2xl shadow-green-500/30 hover:shadow-blue-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 mr-3 animate-bounce" />
              🚀 BEGIN ESCAPE MISSION 🚀
            </div>
          </button>
          
          <div className="mt-6 text-gray-400 animate-pulse">
            Click to start your web development adventure!
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Floating particles background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300/30" />
            </div>
          ))}
        </div>

        <div className="text-center max-w-4xl relative z-10">
          {/* Epic victory animation */}
          <div className="animate-bounce mb-6">
            <div className="relative">
              <Crown className="w-32 h-32 text-yellow-400 mx-auto animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-16 h-16 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 mb-4 animate-pulse">
            🎉 ESCAPE COMPLETE! 🎉
          </h1>
          
          <div className="text-2xl text-green-300 mb-8 animate-fade-in">
            You've successfully navigated the digital maze and mastered web development!
          </div>

          {/* Enhanced stats display */}
          <div className="bg-black/50 backdrop-blur-md p-8 rounded-2xl border border-green-500/50 mb-8 shadow-2xl shadow-green-500/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="group hover:scale-110 transition-transform">
                <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3 animate-spin-slow" />
                <p className="text-3xl font-bold text-blue-400">{minutes}:{seconds.toString().padStart(2, '0')}</p>
                <p className="text-gray-400">Escape Time</p>
              </div>
              <div className="group hover:scale-110 transition-transform">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3 animate-bounce" />
                <p className="text-3xl font-bold text-yellow-400">{score}</p>
                <p className="text-gray-400">Final Score</p>
              </div>
              <div className="group hover:scale-110 transition-transform">
                <Flame className="w-12 h-12 text-red-400 mx-auto mb-3 animate-pulse" />
                <p className="text-3xl font-bold text-red-400">{streak}</p>
                <p className="text-gray-400">Max Streak</p>
              </div>
              <div className="group hover:scale-110 transition-transform">
                <Star className="w-12 h-12 text-purple-400 mx-auto mb-3 animate-spin" />
                <p className="text-3xl font-bold text-purple-400">{achievements.length}</p>
                <p className="text-gray-400">Achievements</p>
              </div>
            </div>
            
            {/* Achievements showcase */}
            {achievements.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-600">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center">
                  <Crown className="w-6 h-6 mr-2 text-yellow-400" />
                  Achievements Unlocked
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {achievements.map(achId => {
                    const ach = achievementList.find(a => a.id === achId);
                    return (
                      <div key={achId} className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-400/50 animate-pulse">
                        <span className="mr-2">{ach?.icon}</span>
                        <span className="text-sm font-semibold text-white">{ach?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Performance rating */}
            <div className="mt-6 pt-4 border-t border-gray-600">
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-400">Performance Rating:</span>
                {score >= 900 && (
                  <div className="flex items-center text-yellow-400 animate-bounce">
                    <Crown className="w-5 h-5 mr-1" />
                    <span className="font-bold">LEGENDARY</span>
                  </div>
                )}
                {score >= 700 && score < 900 && (
                  <div className="flex items-center text-green-400">
                    <Trophy className="w-5 h-5 mr-1" />
                    <span className="font-bold">EXPERT</span>
                  </div>
                )}
                {score >= 500 && score < 700 && (
                  <div className="flex items-center text-blue-400">
                    <Target className="w-5 h-5 mr-1" />
                    <span className="font-bold">SKILLED</span>
                  </div>
                )}
                {score < 500 && (
                  <div className="flex items-center text-gray-400">
                    <Gamepad2 className="w-5 h-5 mr-1" />
                    <span className="font-bold">NOVICE</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-green-500 to-blue-600 px-8 py-4 rounded-xl text-white font-bold text-lg hover:from-green-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
            >
              🚀 Challenge Again
            </button>
            <button
              onClick={() => {
                setGameCompleted(false);
                setGameStarted(false);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-xl text-white font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const CurrentLevel = levelComponents[currentLevel];

  return (
    <div ref={gameRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-ping"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              animation: `fadeOut 2s ease-out forwards`
            }}
          />
        ))}
      </div>

      {/* Level Complete Overlay */}
      {showLevelComplete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
              LEVEL COMPLETE!
            </h2>
            <div className="flex items-center justify-center gap-4 text-2xl">
              <div className="flex items-center text-yellow-400">
                <Trophy className="w-6 h-6 mr-2" />
                +{levels[currentLevel].points * comboMultiplier}
              </div>
              {comboMultiplier > 1 && (
                <div className="flex items-center text-red-400">
                  <Flame className="w-6 h-6 mr-2" />
                  x{comboMultiplier} Combo!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Progress Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-bold">{score}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400 font-bold">{streak} streak</span>
              </div>
            )}
            {comboMultiplier > 1 && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400 font-bold">x{comboMultiplier}</span>
              </div>
            )}
            <button
              onClick={resetGame}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-red-600 hover:bg-red-500 rounded transition-colors"
              title="Start over from beginning"
            >
              <Home className="w-3 h-3" />
              Start Over
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 relative"
            style={{ width: `${((currentLevel + 1) / 7) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          {levels.map((level, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                levelCompleted[i] 
                  ? 'bg-green-500 text-white' 
                  : i === currentLevel 
                    ? 'bg-blue-500 text-white animate-pulse' 
                    : 'bg-gray-600 text-gray-400'
              }`}>
                {i + 1}
              </span>
              <span className={`mt-1 text-xs ${
                levelCompleted[i] ? 'text-green-400' : i === currentLevel ? 'text-blue-400' : 'text-gray-500'
              }`}>
                {level.difficulty}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          {/* Level Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                {levels[currentLevel].icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Level {currentLevel + 1}</h2>
                <h3 className="text-lg text-blue-400">{levels[currentLevel].title}</h3>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetCurrentLevel}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                title="Reset this level"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Level
              </button>
              <button
                onClick={() => useHint(currentLevel)}
                disabled={hintsUsed.includes(currentLevel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  hintsUsed.includes(currentLevel)
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-600 hover:bg-yellow-500 text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                {hintsUsed.includes(currentLevel) ? 'Hint Used' : 'Use Hint (-50)'}
              </button>
            </div>
          </div>

          {/* Level Description */}
          <p className="text-gray-300 mb-6">{levels[currentLevel].description}</p>

          {/* Hint Display */}
          {hintsUsed.includes(currentLevel) && (
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Hint:</span>
              </div>
              <p className="text-yellow-200">{levels[currentLevel].hint}</p>
            </div>
          )}

          {/* Level Content */}
          <CurrentLevel />
        </div>
      </div>
    </div>
  );
};

export default EscapeGame;