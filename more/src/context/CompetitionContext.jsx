import { createContext, useContext, useReducer, useEffect } from 'react'
import soundManager from '../utils/soundManager'

const CompetitionContext = createContext()

const initialState = {
  isCompetitionMode: false,
  currentPlayer: null,
  startTime: null,
  endTime: null,
  totalTime: 0,
  puzzleStartTimes: {},
  puzzleTimes: {},
  scores: {},
  leaderboard: [],
  currentSession: null,
  lives: 3,
  hintsUsed: 0,
  consecutiveCorrect: 0,
  multiplier: 1,
  achievements: []
}

const competitionReducer = (state, action) => {
  switch (action.type) {
    case 'START_COMPETITION':
      return {
        ...state,
        isCompetitionMode: true,
        currentPlayer: action.payload.playerName,
        startTime: Date.now(),
        endTime: null,
        totalTime: 0,
        puzzleStartTimes: {},
        puzzleTimes: {},
        lives: 3,
        hintsUsed: 0,
        consecutiveCorrect: 0,
        multiplier: 1,
        currentSession: {
          id: Date.now(),
          playerName: action.payload.playerName,
          startTime: Date.now(),
          difficulty: action.payload.difficulty || 'normal'
        }
      }

    case 'END_COMPETITION':
      const endTime = Date.now()
      const totalTime = endTime - state.startTime
      const finalScore = calculateFinalScore(state, totalTime)
      
      // Save to leaderboard
      const newEntry = {
        id: Date.now(),
        playerName: state.currentPlayer,
        score: finalScore,
        totalTime,
        completedPuzzles: Object.keys(state.puzzleTimes).length,
        hintsUsed: state.hintsUsed,
        lives: state.lives,
        date: new Date().toISOString(),
        difficulty: state.currentSession?.difficulty || 'normal'
      }
      
      const updatedLeaderboard = [...state.leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10) // Keep top 10
      
      // Save to localStorage
      localStorage.setItem('escapeWebLeaderboard', JSON.stringify(updatedLeaderboard))
      
      return {
        ...state,
        endTime,
        totalTime,
        leaderboard: updatedLeaderboard,
        isCompetitionMode: false
      }

    case 'START_PUZZLE':
      return {
        ...state,
        puzzleStartTimes: {
          ...state.puzzleStartTimes,
          [action.payload.puzzleId]: Date.now()
        }
      }

    case 'COMPLETE_PUZZLE':
      const puzzleEndTime = Date.now()
      const puzzleStartTime = state.puzzleStartTimes[action.payload.puzzleId]
      const puzzleTime = puzzleEndTime - puzzleStartTime
      const baseScore = calculatePuzzleScore(puzzleTime, action.payload.difficulty)
      const multipliedScore = Math.floor(baseScore * state.multiplier)
      
      return {
        ...state,
        puzzleTimes: {
          ...state.puzzleTimes,
          [action.payload.puzzleId]: puzzleTime
        },
        scores: {
          ...state.scores,
          [action.payload.puzzleId]: multipliedScore
        },
        consecutiveCorrect: state.consecutiveCorrect + 1,
        multiplier: Math.min(state.multiplier + 0.1, 3.0) // Max 3x multiplier
      }

    case 'USE_HINT':
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        multiplier: Math.max(state.multiplier - 0.1, 0.5) // Min 0.5x multiplier
      }

    case 'LOSE_LIFE':
      return {
        ...state,
        lives: Math.max(state.lives - 1, 0),
        consecutiveCorrect: 0,
        multiplier: Math.max(state.multiplier - 0.2, 0.5)
      }

    case 'LOAD_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.payload
      }

    case 'RESET_COMPETITION':
      return initialState

    default:
      return state
  }
}

const calculatePuzzleScore = (timeMs, difficulty = 'normal') => {
  const timeSec = timeMs / 1000
  const difficultyMultiplier = {
    easy: 1.0,
    normal: 1.2,
    hard: 1.5,
    expert: 2.0
  }[difficulty] || 1.0
  
  // Base score decreases with time, bonus for speed
  let baseScore = Math.max(1000 - (timeSec * 10), 100)
  
  // Speed bonuses
  if (timeSec < 30) baseScore += 500
  else if (timeSec < 60) baseScore += 300
  else if (timeSec < 120) baseScore += 100
  
  return Math.floor(baseScore * difficultyMultiplier)
}

const calculateFinalScore = (state, totalTimeMs) => {
  const puzzleScores = Object.values(state.scores)
  const baseScore = puzzleScores.reduce((sum, score) => sum + score, 0)
  
  // Time bonus (faster completion = higher score)
  const timeMinutes = totalTimeMs / (1000 * 60)
  const timeBonus = Math.max(2000 - (timeMinutes * 50), 0)
  
  // Life bonus
  const lifeBonus = state.lives * 300
  
  // Hint penalty
  const hintPenalty = state.hintsUsed * 100
  
  // Completion bonus
  const completionBonus = Object.keys(state.puzzleTimes).length === 6 ? 1000 : 0
  
  return Math.floor(baseScore + timeBonus + lifeBonus - hintPenalty + completionBonus)
}

export const CompetitionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(competitionReducer, initialState)

  useEffect(() => {
    // Load leaderboard from localStorage on mount
    const savedLeaderboard = localStorage.getItem('escapeWebLeaderboard')
    if (savedLeaderboard) {
      try {
        const leaderboard = JSON.parse(savedLeaderboard)
        dispatch({ type: 'LOAD_LEADERBOARD', payload: leaderboard })
      } catch (error) {
        console.warn('Failed to load leaderboard:', error)
      }
    }
  }, [])

  const startCompetition = (playerName, difficulty = 'normal') => {
    dispatch({ type: 'START_COMPETITION', payload: { playerName, difficulty } })
    soundManager.playAchievement()
  }

  const endCompetition = () => {
    dispatch({ type: 'END_COMPETITION' })
    soundManager.playVictory()
  }

  const startPuzzle = (puzzleId) => {
    if (state.isCompetitionMode) {
      dispatch({ type: 'START_PUZZLE', payload: { puzzleId } })
    }
  }

  const completePuzzle = (puzzleId, difficulty = 'normal') => {
    if (state.isCompetitionMode) {
      dispatch({ type: 'COMPLETE_PUZZLE', payload: { puzzleId, difficulty } })
      soundManager.playComplete()
    }
  }

  const useHint = () => {
    if (state.isCompetitionMode) {
      dispatch({ type: 'USE_HINT' })
      soundManager.playNotification()
    }
  }

  const loseLife = () => {
    if (state.isCompetitionMode) {
      dispatch({ type: 'LOSE_LIFE' })
      soundManager.playError()
    }
  }

  const resetCompetition = () => {
    dispatch({ type: 'RESET_COMPETITION' })
  }

  const value = {
    ...state,
    startCompetition,
    endCompetition,
    startPuzzle,
    completePuzzle,
    useHint,
    loseLife,
    resetCompetition
  }

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  )
}

export const useCompetition = () => {
  const context = useContext(CompetitionContext)
  if (!context) {
    throw new Error('useCompetition must be used within a CompetitionProvider')
  }
  return context
}

export default CompetitionContext
