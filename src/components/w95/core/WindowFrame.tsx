'use client'

import { useRef, useState, useCallback, useEffect, ReactNode } from 'react'
import { useWindowStore } from '@/store'

/** Height of the taskbar in pixels — windows should not overlap it */
const TASKBAR_HEIGHT = 28

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
  
  const win = getWindowById(id)
  const isActive = activeWindowId === id
  
  const position = win?.position ?? initialPosition
  const size = win?.size ?? initialSize
  const isMaximized = win?.isMaximized ?? false
  const isMinimized = win?.isMinimized ?? false
  
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const dragRef = useRef({ offsetX: 0, offsetY: 0 })
  const resizeRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0 })
  
  const windowRef = useRef<HTMLDivElement>(null)

  // Clamp position so at least 40px of the title bar stays visible
  const clampPosition = useCallback((x: number, y: number) => {
    const maxX = globalThis.innerWidth - 40
    const maxY = globalThis.innerHeight - TASKBAR_HEIGHT - 20
    return {
      x: Math.max(-size.width + 40, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    }
  }, [size.width])

  // ── Drag handling ────────────────────────────────────────
  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return
    if ((e.target as HTMLElement).closest('.window-controls')) return
    
    e.preventDefault()
    setIsDragging(true)
    dragRef.current = {
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    }
    focusWindow(id)
  }, [isMaximized, position, focusWindow, id])

  const handleTitleDoubleClick = useCallback(() => {
    if (isMaximized) {
      restoreWindow(id)
    } else {
      maximizeWindow(id)
    }
  }, [isMaximized, id, maximizeWindow, restoreWindow])

  // ── Resize handling ──────────────────────────────────────
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized || !resizable) return
    
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: size.width,
      startH: size.height,
    }
    focusWindow(id)
  }, [isMaximized, resizable, size, focusWindow, id])

  // ── Global mouse move/up via useEffect ───────────────────
  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const raw = { x: e.clientX - dragRef.current.offsetX, y: e.clientY - dragRef.current.offsetY }
        updateWindowPosition(id, clampPosition(raw.x, raw.y))
      }
      if (isResizing) {
        const { startX, startY, startW, startH } = resizeRef.current
        const newWidth = Math.max(minWidth, startW + (e.clientX - startX))
        const newHeight = Math.max(minHeight, startH + (e.clientY - startY))
        updateWindowSize(id, { width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, id, minWidth, minHeight, clampPosition, updateWindowPosition, updateWindowSize])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return
    focusWindow(id)
  }, [focusWindow, id])

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
        height: isMaximized ? `calc(100% - ${TASKBAR_HEIGHT}px)` : size.height,
        zIndex: win?.zIndex ?? 1,
      }}
      onMouseDown={handleMouseDown}
      role="dialog"
      aria-label={title}
    >
      <div 
        className="window-titlebar"
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={handleTitleDoubleClick}
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
            aria-label="Minimize"
          >
            <span className="btn-content">_</span>
          </button>
          <button 
            className="window-btn maximize"
            onClick={handleMaximize}
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
          >
            <span className="btn-content">□</span>
          </button>
          <button 
            className="window-btn close"
            onClick={() => closeWindow(id)}
            aria-label="Close"
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
