import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useCompetition } from '../context/CompetitionContext'
import soundManager from '../utils/soundManager'

const FinalQuiz = () => {
  const containerRef = useRef()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answered, setAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizStarted, setQuizStarted] = useState(false)
  const timerRef = useRef()
  
  const { isCompetitionMode, endCompetition } = useCompetition()

const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Home Tool Markup Language",
      "Hyperlink Text Markup Language",
      "Hyper Text Markup Language",
      "High Tech Modern Language",
    ],
    correct: 2,
    difficulty: "Easy",
    explanation:
      "HTML stands for Hyper Text Markup Language - the standard markup language for creating web pages.",
  },
  {
    question: "Which CSS property is used to change text color?",
    options: ["color", "font-color", "text-style", "text-color"],
    correct: 0,
    difficulty: "Easy",
    explanation:
      "The 'color' property in CSS is used to set the color of text content.",
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<href>", "<a>", "<link>", "<url>"],
    correct: 1,
    difficulty: "Easy",
    explanation: "The <a> tag (anchor tag) is used to create hyperlinks in HTML.",
  },
  {
    question: "What is the correct CSS syntax to make text bold?",
    options: [
      "text-style: bold;",
      "font-weight: bold;",
      "text-weight: bold;",
      "font-style: bold;",
    ],
    correct: 1,
    difficulty: "Easy",
    explanation:
      "The font-weight property with value 'bold' is used to make text bold in CSS.",
  },
  {
    question:
      "Which JavaScript method is used to add an element to the end of an array?",
    options: ["add()", "append()", "insert()", "push()"],
    correct: 3,
    difficulty: "Easy",
    explanation:
      "The push() method adds one or more elements to the end of an array.",
  },
  {
    question: "What does the 'DOM' stand for in web development?",
    options: [
      "Dynamic Object Mapping",
      "Document Oriented Markup",
      "Data Object Management",
      "Document Object Model",
    ],
    correct: 3,
    difficulty: "Medium",
    explanation:
      "DOM stands for Document Object Model - a programming interface for web documents.",
  },
  {
    question: "Which HTTP method is typically used to retrieve data?",
    options: ["GET", "PUT", "POST", "DELETE"],
    correct: 0,
    difficulty: "Medium",
    explanation:
      "GET is the HTTP method used to retrieve data from a specified resource.",
  },
  {
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: [
      "=== is for strings, == is for numbers",
      "== checks type and value, === only checks value",
      "No difference",
      "=== checks type and value, == only checks value",
    ],
    correct: 3,
    difficulty: "Medium",
    explanation:
      "=== performs strict equality comparison (type and value), while == performs loose equality with type coercion.",
  },
  {
    question:
      "Which CSS display property makes an element behave like a table cell?",
    options: ["inline-table", "cell", "table", "table-cell"],
    correct: 3,
    difficulty: "Medium",
    explanation: "The 'table-cell' value makes an element behave like a <td> element.",
  },
  {
    question: "What is the purpose of the 'alt' attribute in HTML img tags?",
    options: [
      "To set image alignment",
      "To provide alternative text for accessibility",
      "To define image format",
      "To specify image size",
    ],
    correct: 1,
    difficulty: "Medium",
    explanation:
      "The 'alt' attribute provides alternative text for images, improving accessibility for screen readers.",
  },
  {
    question: "What is the purpose of CSS media queries?",
    options: [
      "To create responsive designs",
      "To include multimedia content",
      "To manage user sessions",
      "To query databases",
    ],
    correct: 0,
    difficulty: "Hard",
    explanation:
      "Media queries allow CSS to apply different styles for different media types and screen sizes, enabling responsive design.",
  },
  {
    question: "What is a JavaScript closure?",
    options: [
      "A method to terminate loops",
      "A way to close HTML tags",
      "A function that closes the browser",
      "A function that has access to variables in its outer scope",
    ],
    correct: 3,
    difficulty: "Hard",
    explanation:
      "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
  },
  {
    question: "Which CSS property is used to create a flexbox container?",
    options: ["display: flex;", "layout: flex;", "flex: container;", "display: flexbox;"],
    correct: 0,
    difficulty: "Hard",
    explanation:
      "The 'display: flex' property creates a flex container, enabling flexbox layout for its children.",
  },
  {
    question: "What is the purpose of the 'async' keyword in JavaScript?",
    options: [
      "To handle errors automatically",
      "To make functions run faster",
      "To create asynchronous functions that return promises",
      "To synchronize multiple functions",
    ],
    correct: 2,
    difficulty: "Hard",
    explanation:
      "The 'async' keyword creates asynchronous functions that implicitly return promises and can use 'await'.",
  },
  {
    question: "What is the CSS box model?",
    options: [
      "A way to create boxes in HTML",
      "A JavaScript object for styling",
      "The rectangular layout model including content, padding, border, and margin",
      "A method to organize CSS files",
    ],
    correct: 2,
    difficulty: "Hard",
    explanation:
      "The CSS box model describes the rectangular boxes generated for elements, consisting of content, padding, border, and margin areas.",
  },
];

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'back.out(1.7)' }
    )

    // Create floating particles
    createFloatingParticles()
  }, [])

  useEffect(() => {
    if (quizStarted && !answered && !showResult) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswer(-1) // Auto-submit as wrong
            return 30
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [quizStarted, answered, showResult, currentQuestion])

  useEffect(() => {
    if (currentQuestion < questions.length && quizStarted) {
      setTimeLeft(30)
      gsap.fromTo('.question-container',
        { x: 50, opacity: 0, rotationY: 45 },
        { x: 0, opacity: 1, rotationY: 0, duration: 0.8, ease: 'back.out(1.7)' }
      )
    }
  }, [currentQuestion, quizStarted])

  const createFloatingParticles = () => {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: linear-gradient(45deg, #ffd700, #ff6b6b);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.7;
      `
      document.body.appendChild(particle)

      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 20,
      })

      gsap.to(particle, {
        y: -20,
        x: `+=${Math.random() * 200 - 100}`,
        duration: Math.random() * 8 + 5,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 5
      })
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
    gsap.to('.start-screen', {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      onComplete: () => {
        document.querySelector('.start-screen').style.display = 'none'
      }
    })
  }

  const handleAnswer = (answerIndex) => {
    if (answered) return
    
    setSelectedAnswer(answerIndex)
    setAnswered(true)
    clearInterval(timerRef.current)
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
      // Correct answer animation
      gsap.to('.correct-answer', {
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 1
      })
    } else {
      // Wrong answer shake
      gsap.to('.wrong-answer', {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4
      })
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer('')
        setAnswered(false)
      } else {
        setShowResult(true)
        gsap.fromTo('.final-result',
          { scale: 0, rotation: 180, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.3)' }
        )
        createCelebration()
      }
    }, 2000)
  }

  const createCelebration = () => {
    // Fireworks effect
    for (let i = 0; i < 50; i++) {
      const firework = document.createElement('div')
      firework.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f'][Math.floor(Math.random() * 5)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        top: 50%;
        left: 50%;
      `
      document.body.appendChild(firework)

      gsap.to(firework, {
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        opacity: 0,
        duration: 3,
        ease: 'power2.out',
        onComplete: () => {
          document.body.removeChild(firework)
        }
      })
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage === 100) return "🏆 PERFECT! You're a web development master!"
    if (percentage >= 80) return "🎉 EXCELLENT! You know your stuff!"
    if (percentage >= 60) return "👍 GOOD JOB! Keep learning!"
    return "📚 KEEP STUDYING! Web development is a journey!"
  }

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return "text-green-400"
    if (percentage >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (!quizStarted) {
    return (
      <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="start-screen bg-gray-800/60 backdrop-blur-lg rounded-3xl p-12 border border-yellow-500/50">
            <div className="text-8xl mb-8 animate-bounce">🏆</div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-6">
              FINAL CHALLENGE
            </h1>
            <p className="text-2xl text-gray-300 mb-8">
              🎓 Test your web development knowledge!
            </p>
            
            <div className="bg-black/40 p-8 rounded-2xl mb-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">Quiz Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📝</span>
                    <span>15 challenging questions</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">⏱️</span>
                    <span>30 seconds per question</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <span>Multiple choice format</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔥</span>
                    <span>Increasing difficulty</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🏅</span>
                    <span>Instant feedback</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✨</span>
                    <span>Epic completion ceremony</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-12 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 text-black shadow-2xl"
            >
              <span className="flex items-center">
                🚀 START FINAL QUIZ
                <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
              </span>
            </button>

            <p className="text-gray-400 mt-6">
              You've collected all 6 words. Time to prove your mastery!
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (showResult) {
    return (
      <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="final-result bg-gray-800 rounded-lg p-8">
            <h1 className="text-6xl mb-6">🎊 CONGRATULATIONS! 🎊</h1>
            <h2 className="text-4xl font-bold text-yellow-400 mb-8">
              You've Escaped the Web!
            </h2>
            
            <div className="bg-black p-6 rounded-lg mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Final Score</h3>
              <div className={`text-5xl font-bold mb-4 ${getScoreColor()}`}>
                {score}/{questions.length}
              </div>
              <p className="text-xl text-gray-300">{getScoreMessage()}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-800 to-pink-800 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">🏅 Achievement Unlocked</h3>
              <p className="text-lg">
                You've successfully solved all 6 puzzles and completed the final quiz!
              </p>
              <div className="mt-4 text-yellow-300">
                ⭐ Master of Web Fundamentals ⭐
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="bg-green-700 p-3 rounded">✅ Source Code</div>
              <div className="bg-green-700 p-3 rounded">✅ Hover Interactions</div>
              <div className="bg-green-700 p-3 rounded">✅ Console Debugging</div>
              <div className="bg-green-700 p-3 rounded">✅ Encoding/Decoding</div>
              <div className="bg-green-700 p-3 rounded">✅ Navigation</div>
              <div className="bg-green-700 p-3 rounded">✅ Terminal Commands</div>
            </div>

            <Link 
              to="/" 
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold transition-colors text-xl"
            >
              🏠 Return to Hub
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400 opacity-20 text-lg animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            {['💡', '🎯', '🚀', '⚡', '🔥'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-8">
          <div className="inline-block bg-yellow-500/20 backdrop-blur-lg rounded-2xl p-6">
            <h1 className="text-5xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
              🏆 Final Challenge
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Test your web development knowledge!
            </p>
            <div className="flex items-center justify-center space-x-6 text-lg">
              <div className="text-cyan-400 font-semibold">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className={`font-bold ${getDifficultyColor(questions[currentQuestion].difficulty)} px-3 py-1 rounded-full text-white text-sm`}>
                {questions[currentQuestion].difficulty}
              </div>
              <div className={`font-bold px-3 py-1 rounded-full text-sm ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-500 text-white'}`}>
                ⏱️ {timeLeft}s
              </div>
            </div>
          </div>
        </header>

        <div className="question-container bg-gray-800/60 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-gray-700/50">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 font-semibold">Progress</span>
              <span className="text-gray-400">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Timer Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 linear ${timeLeft <= 10 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-3xl font-semibold mb-8 text-center text-cyan-400 leading-relaxed">
            {questions[currentQuestion].question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions[currentQuestion].options.map((option, index) => {
              let buttonClass = "group relative bg-gray-700/60 hover:bg-gray-600/60 p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-cyan-400"
              
              if (answered) {
                if (index === questions[currentQuestion].correct) {
                  buttonClass = "correct-answer group relative bg-green-600 p-6 rounded-2xl text-left border-2 border-green-400 shadow-2xl"
                } else if (index === selectedAnswer && index !== questions[currentQuestion].correct) {
                  buttonClass = "wrong-answer group relative bg-red-600 p-6 rounded-2xl text-left border-2 border-red-400"
                } else {
                  buttonClass = "group relative bg-gray-600/40 p-6 rounded-2xl text-left opacity-50 border border-gray-500"
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-white mr-4">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="font-semibold text-white text-lg flex-1">
                      {option}
                    </div>
                    {answered && index === questions[currentQuestion].correct && (
                      <div className="text-2xl ml-4">✅</div>
                    )}
                    {answered && index === selectedAnswer && index !== questions[currentQuestion].correct && (
                      <div className="text-2xl ml-4">❌</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {answered && (
            <div className="text-center mt-8 p-6 bg-black/40 rounded-2xl">
              <div className="mb-4">
                {selectedAnswer === questions[currentQuestion].correct ? (
                  <div className="text-green-400 text-2xl font-bold flex items-center justify-center">
                    <span className="text-4xl mr-3">🎉</span>
                    Correct!
                  </div>
                ) : (
                  <div className="text-red-400 text-2xl font-bold flex items-center justify-center">
                    <span className="text-4xl mr-3">💔</span>
                    Incorrect
                  </div>
                )}
              </div>
              <p className="text-gray-300 italic">
                💡 {questions[currentQuestion].explanation}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 mb-6">
            <div className="text-gray-400 text-lg font-semibold mb-2">
              Current Score: <span className={getScoreColor()}>{score}/{currentQuestion + (answered ? 1 : 0)}</span>
            </div>
            <div className="flex justify-center space-x-2">
              {[...Array(questions.length)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < currentQuestion + (answered ? 1 : 0)
                      ? (i < score + (answered && selectedAnswer === questions[currentQuestion].correct ? 1 : 0) ? 'bg-green-500' : 'bg-red-500')
                      : 'bg-gray-600'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-colors text-white"
          >
            ← Back to Hub
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FinalQuiz
