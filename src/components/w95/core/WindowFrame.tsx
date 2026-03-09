'use client'

import { useRef, useState, useCallback, ReactNode } from 'react'
import { useWindowStore } from '@/store'

interface WindowFrameProps {
  id: string
  title: string
  icon?: string
  children: ReactNode
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  minWidth?: number
  minHeight?: number
  resizable?: boolean
}

export function WindowFrame({
  id,
  title,
  icon,
  children,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 400, height: 300 },
  minWidth = 200,
  minHeight = 150,
  resizable = true,
}: WindowFrameProps) {
  const { 
    activeWindowId, 
    getWindowById, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore()
  
  const window = getWindowById(id)
  const isActive = activeWindowId === id
  
  const position = window?.position ?? initialPosition
  const size = window?.size ?? initialSize
  const isMaximized = window?.isMaximized ?? false
  const isMinimized = window?.isMinimized ?? false
  
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  
  const windowRef = useRef<HTMLDivElement>(null)
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return
    focusWindow(id)
  }, [focusWindow, id])
  
  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return
    if ((e.target as HTMLElement).closest('.window-controls')) return
    
    e.preventDefault()
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    focusWindow(id)
  }, [isMaximized, position, focusWindow, id])
  
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized || !resizable) return
    
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
    focusWindow(id)
  }, [isMaximized, resizable, size, focusWindow, id])
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, e.clientX - dragOffset.x)
      const newY = Math.max(0, e.clientY - dragOffset.y)
      updateWindowPosition(id, { x: newX, y: newY })
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      const newWidth = Math.max(minWidth, resizeStart.width + deltaX)
      const newHeight = Math.max(minHeight, resizeStart.height + deltaY)
      updateWindowSize(id, { width: newWidth, height: newHeight })
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, id, minWidth, minHeight, updateWindowPosition, updateWindowSize])
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])
  
  // Add global mouse handlers
  if (typeof window !== 'undefined') {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }
  
  const handleMaximize = () => {
    if (isMaximized) {
      restoreWindow(id)
    } else {
      maximizeWindow(id)
    }
  }
  
  if (isMinimized) return null
  
  return (
    <div
      ref={windowRef}
      className={`window-frame ${isActive ? 'active' : 'inactive'} ${isMaximized ? 'maximized' : ''}`}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? 'calc(100% - 28px)' : size.height,
        zIndex: window?.zIndex ?? 1,
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="window-titlebar"
        onMouseDown={handleTitleMouseDown}
      >
        <div className="window-title">
          {icon && (
            <img src={icon} alt="" className="window-title-icon" />
          )}
          <span className="window-title-text">{title}</span>
        </div>
        <div className="window-controls">
          <button 
            className="window-btn minimize"
            onClick={() => minimizeWindow(id)}
          >
            <span className="btn-content">_</span>
          </button>
          <button 
            className="window-btn maximize"
            onClick={handleMaximize}
          >
            <span className="btn-content">□</span>
          </button>
          <button 
            className="window-btn close"
            onClick={() => closeWindow(id)}
          >
            <span className="btn-content">×</span>
          </button>
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
      {resizable && !isMaximized && (
        <div 
          className="window-resize-handle"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  )
}
