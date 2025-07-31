import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'
import './App.css'

// Import all puzzle components
import LoadingScreen from './components/LoadingScreen'
import HomePage from './components/HomePage'
import SourcePuzzle from './components/SourcePuzzle'
import HoverPuzzle from './components/HoverPuzzle'
import ConsolePuzzle from './components/ConsolePuzzle'
import EncodePuzzle from './components/EncodePuzzle'
import RoutingPuzzle from './components/RoutingPuzzle'
import TerminalPuzzle from './components/TerminalPuzzle'
import TrickPuzzle from './components/TrickPuzzle'
import HiddenPuzzle from './components/HiddenPuzzle'
import FinalQuiz from './components/FinalQuiz'
import NotFound from './components/NotFound'

// Competition components
import { CompetitionProvider, useCompetition } from './context/CompetitionContext'
import CompetitionHUD from './components/CompetitionHUD'
import CompetitionResults from './components/CompetitionResults'

function App() {
  const [collectedWords, setCollectedWords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  const addWord = (word) => {
    if (!collectedWords.includes(word)) {
      setCollectedWords(prev => [...prev, word])
    }
  }

  // Check if all 8 words are collected
  const isComplete = collectedWords.length === 8

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <CompetitionProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <CompetitionHUD />
          <Routes>
            <Route path="/" element={<HomePage collectedWords={collectedWords} />} />
            <Route path="/source" element={<SourcePuzzle addWord={addWord} />} />
            <Route path="/hover" element={<HoverPuzzle addWord={addWord} />} />
            <Route path="/console" element={<ConsolePuzzle addWord={addWord} />} />
            <Route path="/encode" element={<EncodePuzzle addWord={addWord} />} />
            <Route path="/routing" element={<RoutingPuzzle addWord={addWord} />} />
            <Route path="/terminal" element={<TerminalPuzzle addWord={addWord} />} />
            <Route path="/trick" element={<TrickPuzzle addWord={addWord} />} />
            <Route path="/hidden" element={<HiddenPuzzle addWord={addWord} />} />
            <Route path="/unlock-the-gate" element={
              isComplete ? <FinalQuiz /> : <Navigate to="/" />
            } />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </CompetitionProvider>
  )
}

export default App
