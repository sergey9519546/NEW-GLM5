'use client'

import { useState, useCallback, useEffect, useRef, type ReactElement } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 15
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }

type Position = { x: number; y: number }
type Direction = { x: number; y: number }

export function SnakeApp() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>({ x: 15, y: 10 })
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highScore, setHighScore] = useState(0)
  
  const directionRef = useRef(direction)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (currentSnake.some(s => s.x === newFood.x && s.y === newFood.y))
    return newFood
  }, [])
  
  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    directionRef.current = INITIAL_DIRECTION
    setFood(generateFood(INITIAL_SNAKE))
    setGameOver(false)
    setScore(0)
    setIsPlaying(true)
  }, [generateFood])
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return
    
    const key = e.key.toLowerCase()
    const current = directionRef.current
    
    let newDirection: Direction | null = null
    
    if ((key === 'arrowup' || key === 'w') && current.y !== 1) {
      newDirection = { x: 0, y: -1 }
    } else if ((key === 'arrowdown' || key === 's') && current.y !== -1) {
      newDirection = { x: 0, y: 1 }
    } else if ((key === 'arrowleft' || key === 'a') && current.x !== 1) {
      newDirection = { x: -1, y: 0 }
    } else if ((key === 'arrowright' || key === 'd') && current.x !== -1) {
      newDirection = { x: 1, y: 0 }
    }
    
    if (newDirection) {
      setDirection(newDirection)
      directionRef.current = newDirection
    }
  }, [gameOver])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
  
  useEffect(() => {
    if (!isPlaying || gameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
      return
    }
    
    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0]
        const newHead: Position = {
          x: (head.x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + directionRef.current.y + GRID_SIZE) % GRID_SIZE,
        }
        
        // Check collision with self
        if (prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true)
          setIsPlaying(false)
          setHighScore(h => Math.max(h, score))
          return prevSnake
        }
        
        const newSnake = [newHead, ...prevSnake]
        
        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10)
          setFood(generateFood(newSnake))
        } else {
          newSnake.pop()
        }
        
        return newSnake
      })
    }, 150)
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [isPlaying, gameOver, food, generateFood, score])
  
  const renderGrid = () => {
    const cells: ReactElement[] = []
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(s => s.x === x && s.y === y)
        const isHead = snake[0].x === x && snake[0].y === y
        const isFood = food.x === x && food.y === y
        
        let className = 'snake-cell'
        if (isHead) className += ' head'
        else if (isSnake) className += ' body'
        else if (isFood) className += ' food'
        
        cells.push(<div key={`${x}-${y}`} className={className} />)
      }
    }
    return cells
  }
  
  return (
    <div className="snake-app">
      <div className="snake-header">
        <div className="snake-score">
          <span>Score: {score}</span>
          <span>High: {highScore}</span>
        </div>
        <button className="win95-button" onClick={resetGame}>
          {isPlaying ? 'Restart' : 'Start Game'}
        </button>
      </div>
      
      <div 
        className="snake-grid"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {renderGrid()}
      </div>
      
      {gameOver && (
        <div className="snake-overlay">
          <div className="snake-gameover">
            <p>Game Over!</p>
            <p>Score: {score}</p>
            <button className="win95-button" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
      
      <div className="snake-controls">
        <p>Use arrow keys or WASD to move</p>
      </div>
    </div>
  )
}
