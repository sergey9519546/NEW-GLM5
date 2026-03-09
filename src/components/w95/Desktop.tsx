'use client'

import { useSystemStore, useWindowStore, useInputStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'
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

const DESKTOP_ICONS = [
  { id: 'music', title: 'Music', icon: W98_ICONS.mediaPlayer, position: { x: 20, y: 20 } },
  { id: 'photos', title: 'Photos', icon: W98_ICONS.folder, position: { x: 20, y: 100 } },
  { id: 'videos', title: 'Videos', icon: W98_ICONS.mediaPlayer, position: { x: 20, y: 180 } },
  { id: 'news', title: 'News', icon: W98_ICONS.document, position: { x: 20, y: 260 } },
  { id: 'notepad', title: 'Notepad', icon: W98_ICONS.notepad, position: { x: 20, y: 340 } },
  { id: 'calculator', title: 'Calculator', icon: W98_ICONS.calculator, position: { x: 120, y: 20 } },
  { id: 'paint', title: 'Paint', icon: W98_ICONS.paint, position: { x: 120, y: 100 } },
  { id: 'explorer', title: 'My Computer', icon: W98_ICONS.computer, position: { x: 120, y: 180 } },
  { id: 'minesweeper', title: 'Minesweeper', icon: W98_ICONS.folder, position: { x: 120, y: 260 } },
  { id: 'snake', title: 'Snake', icon: W98_ICONS.folder, position: { x: 120, y: 340 } },
  { id: 'admin', title: 'Admin BIOS', icon: W98_ICONS.computer, position: { x: 220, y: 20 } },
]

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
  const { windows, openWindow } = useWindowStore()
  const { contextMenuPosition, setContextMenu, clearSelection } = useInputStore()
  
  const handleIconDoubleClick = (id: string, title: string, icon: string) => {
    if (id === 'admin') {
      openWindow({
        id: 'admin',
        title: 'Admin BIOS',
        icon: W98_ICONS.computer,
        component: 'admin',
        isMinimized: false,
        isMaximized: false,
        position: { x: 150, y: 100 },
        size: { width: 500, height: 400 },
      })
    } else {
      openWindow({
        id,
        title,
        icon,
        component: id,
        isMinimized: false,
        isMaximized: false,
        position: { x: 100 + Math.random() * 100, y: 80 + Math.random() * 50 },
        size: getDefaultSize(id),
      })
    }
  }
  
  const getDefaultSize = (id: string): { width: number; height: number } => {
    switch (id) {
      case 'calculator':
        return { width: 240, height: 320 }
      case 'minesweeper':
        return { width: 220, height: 300 }
      case 'snake':
        return { width: 340, height: 400 }
      case 'notepad':
        return { width: 500, height: 400 }
      case 'paint':
        return { width: 600, height: 450 }
      default:
        return { width: 600, height: 400 }
    }
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
    { label: 'New Folder', action: () => {} },
    { label: 'New Shortcut', action: () => {} },
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
      
      {/* Desktop Icons */}
      {bootPhase === 'desktop' && (
        <div className="desktop-icons">
          {DESKTOP_ICONS.map(icon => (
            <DesktopIcon
              key={icon.id}
              id={icon.id}
              title={icon.title}
              icon={icon.icon}
              position={icon.position}
              onDoubleClick={() => handleIconDoubleClick(icon.id, icon.title, icon.icon)}
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
