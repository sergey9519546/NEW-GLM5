'use client'

import { useState, useCallback, useEffect } from 'react'

const GRID_SIZE = 10
const CELL_COUNT = GRID_SIZE * GRID_SIZE
const MINE_COUNT = 15

type CellState = 'hidden' | 'revealed' | 'flagged'
type CellValue = number | 'mine'

interface Cell {
  state: CellState
  value: CellValue
}

function createBoard(): Cell[] {
  const board: Cell[] = Array(CELL_COUNT).fill(null).map(() => ({
    state: 'hidden' as CellState,
    value: 0 as CellValue,
  }))
  
  // Place mines
  let minesPlaced = 0
  while (minesPlaced < MINE_COUNT) {
    const index = Math.floor(Math.random() * CELL_COUNT)
    if (board[index].value !== 'mine') {
      board[index].value = 'mine'
      minesPlaced++
    }
  }
  
  // Calculate numbers
  for (let i = 0; i < CELL_COUNT; i++) {
    if (board[i].value === 'mine') continue
    
    const neighbors = getNeighbors(i)
    const mineCount = neighbors.filter(n => board[n].value === 'mine').length
    board[i].value = mineCount
  }
  
  return board
}

function getNeighbors(index: number): number[] {
  const row = Math.floor(index / GRID_SIZE)
  const col = index % GRID_SIZE
  const neighbors: number[] = []
  
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        neighbors.push(nr * GRID_SIZE + nc)
      }
    }
  }
  
  return neighbors
}

export function MinesweeperApp() {
  const [board, setBoard] = useState<Cell[]>(() => createBoard())
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [flagCount, setFlagCount] = useState(0)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  useEffect(() => {
    if (!isPlaying || gameOver || gameWon) return
    
    const interval = setInterval(() => {
      setTime(t => Math.min(t + 1, 999))
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isPlaying, gameOver, gameWon])
  
  const revealCell = useCallback(function reveal(index: number, currentBoard: Cell[]): Cell[] {
    const cell = currentBoard[index]
    if (cell.state !== 'hidden') return currentBoard
    
    const newBoard = [...currentBoard]
    newBoard[index] = { ...cell, state: 'revealed' }
    
    if (cell.value === 0) {
      const neighbors = getNeighbors(index)
      neighbors.forEach(n => {
        reveal(n, newBoard)
      })
    }
    
    return newBoard
  }, [])
  
  const handleClick = (index: number) => {
    if (gameOver || gameWon) return
    
    const cell = board[index]
    if (cell.state !== 'hidden') return
    
    if (!isPlaying) setIsPlaying(true)
    
    if (cell.value === 'mine') {
      // Game over - reveal all mines
      const newBoard = board.map(c => 
        c.value === 'mine' ? { ...c, state: 'revealed' as CellState } : c
      )
      setBoard(newBoard)
      setGameOver(true)
      return
    }
    
    const newBoard = revealCell(index, [...board])
    setBoard(newBoard)
    
    // Check win
    const hiddenCells = newBoard.filter(c => c.state === 'hidden' || c.state === 'flagged')
    const hiddenNonMines = hiddenCells.filter(c => c.value !== 'mine')
    if (hiddenNonMines.length === 0) {
      setGameWon(true)
    }
  }
  
  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    if (gameOver || gameWon) return
    
    const cell = board[index]
    if (cell.state === 'revealed') return
    
    const newBoard = [...board]
    if (cell.state === 'hidden') {
      newBoard[index] = { ...cell, state: 'flagged' }
      setFlagCount(f => f + 1)
    } else {
      newBoard[index] = { ...cell, state: 'hidden' }
      setFlagCount(f => f - 1)
    }
    setBoard(newBoard)
  }
  
  const resetGame = () => {
    setBoard(createBoard())
    setGameOver(false)
    setGameWon(false)
    setFlagCount(0)
    setTime(0)
    setIsPlaying(false)
  }
  
  const renderCell = (index: number) => {
    const cell = board[index]
    
    let content = ''
    let className = 'mine-cell'
    
    if (cell.state === 'hidden') {
      className += ' hidden'
    } else if (cell.state === 'flagged') {
      className += ' flagged'
      content = '🚩'
    } else if (cell.value === 'mine') {
      className += ' mine'
      content = '💣'
    } else if (cell.value > 0) {
      className += ` num-${cell.value}`
      content = String(cell.value)
    } else {
      className += ' revealed'
    }
    
    return (
      <div
        key={index}
        className={className}
        onClick={() => handleClick(index)}
        onContextMenu={(e) => handleRightClick(e, index)}
      >
        {content}
      </div>
    )
  }
  
  return (
    <div className="minesweeper-app">
      <div className="mine-header">
        <div className="mine-counter">
          {String(MINE_COUNT - flagCount).padStart(3, '0')}
        </div>
        <button className="mine-reset" onClick={resetGame}>
          {gameOver ? '😵' : gameWon ? '😎' : '🙂'}
        </button>
        <div className="mine-timer">
          {String(time).padStart(3, '0')}
        </div>
      </div>
      
      <div className="mine-grid">
        {Array(CELL_COUNT).fill(null).map((_, i) => renderCell(i))}
      </div>
      
      {(gameOver || gameWon) && (
        <div className="mine-message">
          {gameWon ? 'You Win! 🎉' : 'Game Over! 💥'}
        </div>
      )}
    </div>
  )
}
