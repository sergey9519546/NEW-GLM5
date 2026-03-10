'use client'

import { useEffect } from 'react'
import { useWindowStore, useInputStore, useSystemStore } from '@/store'
import { getApp } from '@/lib/appRegistry'

/**
 * Global keyboard shortcuts for the desktop shell.
 *
 * Escape      — close context menu, or close start menu (handled by overlay)
 * Alt+F4      — close focused window
 * Ctrl+Alt+B  — open Admin BIOS
 */
export function useKeyboardShortcuts() {
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const activeWindowId = useWindowStore((s) => s.activeWindowId)
  const openWindow = useWindowStore((s) => s.openWindow)
  const clearSelection = useInputStore((s) => s.clearSelection)
  const setContextMenu = useInputStore((s) => s.setContextMenu)
  const contextMenuPosition = useInputStore((s) => s.contextMenuPosition)
  const bootPhase = useSystemStore((s) => s.bootPhase)

  useEffect(() => {
    if (bootPhase !== 'desktop') return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape — dismiss context menu
      if (e.key === 'Escape') {
        if (contextMenuPosition) {
          setContextMenu(null)
          clearSelection()
          return
        }
      }

      // Alt+F4 — close active window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault()
        if (activeWindowId) {
          closeWindow(activeWindowId)
        }
      }

      // Ctrl+Alt+B — open Admin BIOS
      if (e.ctrlKey && e.altKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault()
        const app = getApp('admin')
        if (app) {
          openWindow({
            id: app.id,
            title: app.title,
            icon: app.icon,
            component: app.component,
            isMinimized: false,
            isMaximized: false,
            position: { x: 150, y: 100 },
            size: app.defaultSize,
          })
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [bootPhase, activeWindowId, contextMenuPosition, closeWindow, openWindow, clearSelection, setContextMenu])
}
