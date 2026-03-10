'use client'

import { useEffect } from 'react'
import { useSystemStore, useWindowStore, useInputStore, useAdminBiosStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'
import { getApp, getDesktopApps } from '@/lib/appRegistry'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { BootScreen, Taskbar, WindowFrame, DesktopIcon, ContextMenu, AdminPanel } from './core'
import {
  MusicApp,
  PhotosApp,
  VideosApp,
  NewsApp,
  NotepadApp,
  CalculatorApp,
  PaintApp,
  MediaPlayerApp,
  ExplorerApp,
  MinesweeperApp,
  SnakeApp,
} from './apps'

const DESKTOP_ICONS = getDesktopApps()

const APP_COMPONENTS: Record<string, React.ComponentType> = {
  music: MusicApp,
  photos: PhotosApp,
  videos: VideosApp,
  news: NewsApp,
  notepad: NotepadApp,
  calculator: CalculatorApp,
  paint: PaintApp,
  mediaplayer: MediaPlayerApp,
  explorer: ExplorerApp,
  minesweeper: MinesweeperApp,
  snake: SnakeApp,
}

export function Desktop() {
  const { bootPhase, _hasHydrated } = useSystemStore()
  const {
    windows,
    openWindow,
    hydrate: hydrateWindows,
    sync: syncWindows,
    hasHydratedFromServer: hasHydratedWindows,
    isHydrating: isHydratingWindows,
  } = useWindowStore()
  const { bandName, bandBio, hydrate, hasLoaded, isHydrating, error, clearError } = useAdminBiosStore()
  const { contextMenuPosition, setContextMenu, clearSelection } = useInputStore()

  useKeyboardShortcuts()

  useEffect(() => {
    if (_hasHydrated && !hasLoaded && !isHydrating) {
      void hydrate()
    }
  }, [_hasHydrated, hasLoaded, hydrate, isHydrating])

  useEffect(() => {
    if (_hasHydrated && !hasHydratedWindows && !isHydratingWindows) {
      void hydrateWindows()
    }
  }, [_hasHydrated, hasHydratedWindows, hydrateWindows, isHydratingWindows])

  useEffect(() => {
    if (!_hasHydrated || !hasHydratedWindows || isHydratingWindows) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void syncWindows()
    }, 500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [_hasHydrated, hasHydratedWindows, isHydratingWindows, syncWindows, windows])
  
  const handleIconDoubleClick = (id: string) => {
    const app = getApp(id)
    if (!app) return
    openWindow({
      id: app.id,
      title: app.title,
      icon: app.icon,
      component: app.component,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + Math.random() * 100, y: 80 + Math.random() * 50 },
      size: app.defaultSize,
    })
  }
  
  const handleDesktopClick = () => {
    clearSelection()
    setContextMenu(null)
  }
  
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY }, 'desktop')
  }
  
  const contextMenuItems = [
    { label: 'Refresh', action: () => window.location.reload() },
    { divider: true, label: '' },
    { label: 'Open Admin BIOS', action: () => handleIconDoubleClick('admin') },
    { label: 'Open Notepad', action: () => handleIconDoubleClick('notepad') },
    { divider: true, label: '' },
    { label: 'Properties', action: () => {} },
  ]
  
  if (!_hasHydrated) {
    return (
      <div className="desktop-loading">
        <div className="loading-text">Loading...</div>
      </div>
    )
  }
  
  return (
    <div className="desktop" onClick={handleDesktopClick} onContextMenu={handleDesktopContextMenu}>
      {/* Boot Screen */}
      <BootScreen />

      {bootPhase === 'desktop' && error && (
        <div className="desktop-banner" role="status" aria-live="polite">
          <span>{error}</span>
          <button className="win95-button small" onClick={clearError}>Dismiss</button>
        </div>
      )}

      {bootPhase === 'desktop' && !error && (
        <section className="desktop-intro" aria-label="Desktop overview">
          <div className="desktop-intro-title-row">
            <img src={W98_ICONS.computer} alt="" aria-hidden="true" className="desktop-intro-icon" />
            <div>
              <h1 className="desktop-intro-title">{bandName}</h1>
              <p className="desktop-intro-subtitle">Production desktop for media, notes, and live content control.</p>
            </div>
          </div>
          <p className="desktop-intro-copy">{bandBio}</p>
          <div className="desktop-intro-actions">
            <button className="win95-button" onClick={() => handleIconDoubleClick('music')}>
              Open Music
            </button>
            <button className="win95-button" onClick={() => handleIconDoubleClick('news')}>
              Open News
            </button>
            <button className="win95-button" onClick={() => handleIconDoubleClick('admin')}>
              Open Admin BIOS
            </button>
          </div>
          <p className="desktop-intro-hint">Tip: right-click the desktop to open Admin BIOS or launch Notepad quickly.</p>
        </section>
      )}
      
      {/* Desktop Icons */}
      {bootPhase === 'desktop' && (
        <div className="desktop-icons">
          {DESKTOP_ICONS.map(app => (
            <DesktopIcon
              key={app.id}
              id={app.id}
              title={app.title}
              icon={app.icon}
              position={app.desktopPosition!}
              onDoubleClick={() => handleIconDoubleClick(app.id)}
            />
          ))}
        </div>
      )}
      
      {/* Windows */}
      {bootPhase === 'desktop' && windows.map(window => {
        const AppComponent = window.component === 'admin' ? AdminPanel : APP_COMPONENTS[window.component]
        
        if (!AppComponent) return null
        
        return (
          <WindowFrame
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.icon}
            initialPosition={window.position}
            initialSize={window.size}
          >
            <AppComponent />
          </WindowFrame>
        )
      })}
      
      {/* Taskbar */}
      <Taskbar />
      
      {/* Context Menu */}
      {contextMenuPosition && <ContextMenu items={contextMenuItems} />}
    </div>
  )
}
