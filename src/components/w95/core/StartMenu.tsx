'use client'

import { useWindowStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'
import { getStartMenuApps, type AppDefinition } from '@/lib/appRegistry'

interface StartMenuProps {
  onClose: () => void
}

const START_MENU_APPS = getStartMenuApps()

export function StartMenu({ onClose }: StartMenuProps) {
  const { openWindow } = useWindowStore()
  
  const handleOpenApp = (app: AppDefinition) => {
    openWindow({
      id: app.id,
      title: app.title,
      icon: app.icon,
      component: app.component,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 50 },
      size: app.defaultSize,
    })
    onClose()
  }
  
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
            {START_MENU_APPS.map((app, i) => {
              const prevCategory = i > 0 ? START_MENU_APPS[i - 1].category : null
              const showDivider = prevCategory !== null && prevCategory !== app.category
              return (
                <div key={app.id}>
                  {showDivider && <div className="start-menu-divider" />}
                  <div className="start-menu-item" onClick={() => handleOpenApp(app)}>
                    <img src={app.icon} alt="" className="menu-item-icon" />
                    <span className="menu-item-text">{app.title}</span>
                  </div>
                </div>
              )
            })}
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
