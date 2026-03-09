'use client'

import { useWindowStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'

interface StartMenuProps {
  onClose: () => void
}

export function StartMenu({ onClose }: StartMenuProps) {
  const { openWindow } = useWindowStore()
  
  const handleOpenApp = (component: string, title: string, icon: string) => {
    openWindow({
      id: component,
      title,
      icon,
      component,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 50 },
      size: { width: 600, height: 400 },
    })
    onClose()
  }
  
  const menuItems = [
    {
      id: 'programs',
      name: 'Programs',
      icon: W98_ICONS.folder,
      submenu: [
        { id: 'music', name: 'Music Player', icon: W98_ICONS.mediaPlayer },
        { id: 'photos', name: 'Photos', icon: W98_ICONS.folder },
        { id: 'videos', name: 'Videos', icon: W98_ICONS.mediaPlayer },
        { id: 'games', name: 'Games', icon: W98_ICONS.folder },
      ],
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: W98_ICONS.document,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: W98_ICONS.computer,
    },
  ]
  
  return (
    <div className="start-menu-overlay" onClick={onClose}>
      <div className="start-menu" onClick={e => e.stopPropagation()}>
        <div className="start-menu-sidebar">
          <div className="start-menu-sidebar-text">
            <span className="sidebar-line">alti</span>
            <span className="sidebar-line">.tune</span>
          </div>
        </div>
        <div className="start-menu-content">
          <div className="start-menu-items">
            <div className="start-menu-item" onClick={() => handleOpenApp('music', 'Music', W98_ICONS.mediaPlayer)}>
              <img src={W98_ICONS.mediaPlayer} alt="" className="menu-item-icon" />
              <span className="menu-item-text">Music</span>
              <span className="menu-item-arrow">▶</span>
            </div>
            <div className="start-menu-item" onClick={() => handleOpenApp('photos', 'Photos', W98_ICONS.folder)}>
              <img src={W98_ICONS.folder} alt="" className="menu-item-icon" />
              <span className="menu-item-text">Photos</span>
              <span className="menu-item-arrow">▶</span>
            </div>
            <div className="start-menu-item" onClick={() => handleOpenApp('videos', 'Videos', W98_ICONS.mediaPlayer)}>
              <img src={W98_ICONS.mediaPlayer} alt="" className="menu-item-icon" />
              <span className="menu-item-text">Videos</span>
              <span className="menu-item-arrow">▶</span>
            </div>
            <div className="start-menu-item" onClick={() => handleOpenApp('news', 'News', W98_ICONS.document)}>
              <img src={W98_ICONS.document} alt="" className="menu-item-icon" />
              <span className="menu-item-text">News</span>
            </div>
            <div className="start-menu-divider" />
            <div className="start-menu-item" onClick={() => handleOpenApp('notepad', 'Notepad', W98_ICONS.notepad)}>
              <img src={W98_ICONS.notepad} alt="" className="menu-item-icon" />
              <span className="menu-item-text">Notepad</span>
            </div>
            <div className="start-menu-item" onClick={() => handleOpenApp('calculator', 'Calculator', W98_ICONS.calculator)}>
              <img src={W98_ICONS.calculator} alt="" className="menu-item-icon" />
              <span className="menu-item-text">Calculator</span>
            </div>
            <div className="start-menu-item" onClick={() => handleOpenApp('paint', 'Paint', W98_ICONS.paint)}>
              <img src={W98_ICONS.paint} alt="" className="menu-item-icon" />
              <span className="menu-item-text">Paint</span>
            </div>
            <div className="start-menu-divider" />
            <div className="start-menu-item" onClick={() => handleOpenApp('explorer', 'My Computer', W98_ICONS.computer)}>
              <img src={W98_ICONS.computer} alt="" className="menu-item-icon" />
              <span className="menu-item-text">My Computer</span>
            </div>
            <div className="start-menu-item" onClick={() => handleOpenApp('minesweeper', 'Minesweeper', W98_ICONS.folder)}>
              <img src={W98_ICONS.folder} alt="" className="menu-item-icon" />
              <span className="menu-item-text">Minesweeper</span>
            </div>
            <div className="start-menu-item" onClick={() => handleOpenApp('snake', 'Snake', W98_ICONS.folder)}>
              <img src={W98_ICONS.folder} alt="" className="menu-item-icon" />
              <span className="menu-item-text">Snake</span>
            </div>
          </div>
          <div className="start-menu-footer">
            <div className="start-menu-item logout" onClick={() => window.location.reload()}>
              <img src={W98_ICONS.windows} alt="" className="menu-item-icon" />
              <span className="menu-item-text">Shut Down...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
