import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useCompetition } from '../context/CompetitionContext'
import soundManager from '../utils/soundManager'

const CompetitionTimer = ({ timeLimit = 120, onTimeUp, puzzleId }) => {
  const timerRef = useRef()
  const progressRef = useRef()
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isWarning, setIsWarning] = useState(false)
  const [isDanger, setIsDanger] = useState(false)
  
  const { isCompetitionMode, loseLife } = useCompetition()

  useEffect(() => {
    if (!isCompetitionMode) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1
        
        // Warning at 30 seconds
        if (newTime === 30 && !isWarning) {
          setIsWarning(true)
          soundManager.playNotification()
          // Warning animation
          gsap.fromTo(timerRef.current,
            { scale: 1 },
            { scale: 1.1, duration: 0.3, yoyo: true, repeat: 5 }
          )
        }
        
        // Danger at 10 seconds
        if (newTime === 10 && !isDanger) {
          setIsDanger(true)
          soundManager.playError()
          // Danger animation
          gsap.to(timerRef.current, {
            backgroundColor: '#dc2626',
            duration: 0.5,
            repeat: -1,
            yoyo: true
          })
        }
        
        // Time's up
        if (newTime <= 0) {
          loseLife()
          onTimeUp && onTimeUp()
          return 0
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isCompetitionMode, isWarning, isDanger, loseLife, onTimeUp])

  useEffect(() => {
    if (progressRef.current) {
      const percentage = (timeLeft / timeLimit) * 100
      gsap.to(progressRef.current, {
        width: `${percentage}%`,
        duration: 1,
        ease: 'power2.out'
      })
    }
  }, [timeLeft, timeLimit])

  if (!isCompetitionMode) return null

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (isDanger) return 'text-red-400 border-red-500'
    if (isWarning) return 'text-yellow-400 border-yellow-500'
    return 'text-green-400 border-green-500'
  }

  const getProgressColor = () => {
    if (isDanger) return 'bg-red-500'
    if (isWarning) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30">
      <div className={`bg-gray-900/95 backdrop-blur-lg border-2 rounded-2xl p-4 shadow-2xl ${getTimerColor()}`}>
        <div ref={timerRef} className="text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Time Remaining</div>
          <div className="text-3xl font-mono font-bold">{formatTime(timeLeft)}</div>
          <div className="w-32 bg-gray-700 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              ref={progressRef}
              className={`h-full transition-all duration-1000 ${getProgressColor()}`}
              style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
            ></div>
          </div>
          {isDanger && (
            <div className="text-xs text-red-400 mt-1 animate-pulse">
              ⚠️ TIME CRITICAL ⚠️
            </div>
          )}
          {isWarning && !isDanger && (
            <div className="text-xs text-yellow-400 mt-1">
              ⏰ Hurry up!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompetitionTimer
