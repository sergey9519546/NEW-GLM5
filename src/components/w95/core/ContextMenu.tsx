'use client'

import { useInputStore } from '@/store'
import { useEffect, useRef } from 'react'

interface ContextMenuItem {
  label: string
  action?: () => void
  divider?: boolean
  disabled?: boolean
}

interface ContextMenuProps {
  items: ContextMenuItem[]
}

export function ContextMenu({ items }: ContextMenuProps) {
  const { contextMenuPosition, setContextMenu } = useInputStore()
  const menuRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [setContextMenu])
  
  if (!contextMenuPosition) return null
  
  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled || item.divider) return
    item.action?.()
    setContextMenu(null)
  }
  
  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        left: contextMenuPosition.x,
        top: contextMenuPosition.y,
      }}
    >
      {items.map((item, index) => (
        item.divider ? (
          <div key={index} className="context-menu-divider" />
        ) : (
          <div
            key={index}
            className={`context-menu-item ${item.disabled ? 'disabled' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item.label}
          </div>
        )
      ))}
    </div>
  )
}
