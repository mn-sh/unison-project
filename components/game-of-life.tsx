"use client"

import { useState, useEffect, useCallback, useRef, memo } from "react"
import { RefreshCw } from "lucide-react"

interface GameOfLifeProps {
  onReset: () => void
  isMobile?: boolean
  isVisible?: boolean
}

const GameOfLife = memo(({ onReset, isMobile = false, isVisible = true }: GameOfLifeProps) => {
  const [grid, setGrid] = useState<boolean[][]>([])
  // Reduce grid size for better performance
  const GRID_SIZE = isMobile ? 6 : 10
  const frameRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)
  // Slower updates for better performance
  const updateIntervalRef = useRef<number>(isMobile ? 500 : 400)

  // Initialize grid with random cells - optimized to run only once
  const initializeGrid = useCallback(() => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => Math.random() > 0.7),
      )
    setGrid(newGrid)
  }, [GRID_SIZE])

  // Count neighbors for a cell - optimized version
  const countNeighbors = useCallback(
    (grid: boolean[][], x: number, y: number) => {
      let count = 0
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue
          const newX = (x + i + GRID_SIZE) % GRID_SIZE
          const newY = (y + j + GRID_SIZE) % GRID_SIZE
          if (grid[newX][newY]) count++
        }
      }
      return count
    },
    [GRID_SIZE],
  )

  // Update grid based on Conway's Game of Life rules
  const updateGrid = useCallback(() => {
    setGrid((prevGrid) => {
      return prevGrid.map((row, x) =>
        row.map((cell, y) => {
          const neighbors = countNeighbors(prevGrid, x, y)
          return cell ? neighbors === 2 || neighbors === 3 : neighbors === 3
        }),
      )
    })
  }, [countNeighbors])

  // Optimize animation frame handling based on visibility
  const animateGrid = useCallback(
    (timestamp: number) => {
      if (!isVisible) {
        frameRef.current = null
        return
      }

      if (timestamp - lastUpdateRef.current > updateIntervalRef.current) {
        updateGrid()
        lastUpdateRef.current = timestamp
      }

      frameRef.current = requestAnimationFrame(animateGrid)
    },
    [updateGrid, isVisible],
  )

  // Setup and cleanup animation frame with visibility checks
  useEffect(() => {
    if (!grid.length) {
      initializeGrid()
    }

    // Only start animation if component is visible
    if (isVisible && !frameRef.current) {
      frameRef.current = requestAnimationFrame(animateGrid)
    } else if (!isVisible && frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [initializeGrid, animateGrid, isVisible, grid.length])

  const handleReset = useCallback(() => {
    initializeGrid()
    if (onReset) onReset()
  }, [initializeGrid, onReset])

  return (
    <div className={`w-full relative ${isMobile ? "h-[200px]" : "h-full"}`}>
      <button
        onClick={handleReset}
        className="absolute bottom-2 right-2 z-10 p-2 bg-transparent text-[#222222] opacity-30 hover:opacity-70 transition-opacity"
        aria-label="Reset"
      >
        <RefreshCw size={16} />
      </button>
      <div className="checkers-container" style={{ aspectRatio: "1 / 1", maxWidth: "100%", margin: "0 auto" }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`life-cell ${cell ? "alive" : "dead"}`}
              aria-hidden="true"
            />
          )),
        )}
      </div>
    </div>
  )
})

GameOfLife.displayName = "GameOfLife"

export default GameOfLife
