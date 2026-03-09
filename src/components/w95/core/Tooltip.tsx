'use client'

import { useState, useEffect, useRef } from 'react'

interface TooltipProps {
  text: string
  children: React.ReactNode
}

export function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    timeoutRef.current = setTimeout(() => {
      setPosition({ x: rect.left, y: rect.bottom + 4 })
      setVisible(true)
    }, 500)
  }
  
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setVisible(false)
  }
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="tooltip-trigger"
    >
      {children}
      {visible && (
        <div
          className="w95-tooltip"
          style={{ left: position.x, top: position.y }}
        >
          {text}
        </div>
      )}
    </div>
  )
}
