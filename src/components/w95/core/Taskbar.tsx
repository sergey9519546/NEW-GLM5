'use client'

import { useState } from 'react'
import { useWindowStore, useSystemStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'
import { StartMenu } from './StartMenu'
import { SystemTray } from './SystemTray'

export function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useWindowStore()
  const { bootPhase } = useSystemStore()
  const [showStartMenu, setShowStartMenu] = useState(false)
  
  if (bootPhase !== 'desktop') return null
  
  return (
    <>
      <div className="taskbar" role="toolbar" aria-label="Taskbar">
        <div className="taskbar-inner">
          {/* Start Button */}
          <button 
            className={`start-button ${showStartMenu ? 'active' : ''}`}
            onClick={() => setShowStartMenu(!showStartMenu)}
            aria-expanded={showStartMenu}
            aria-haspopup="true"
          >
            <img src={W98_ICONS.windows} alt="" className="start-button-icon" />
            <span className="start-button-text">Start</span>
          </button>
          
          {/* Quick Launch */}
          <div className="quick-launch">
            <div className="quick-launch-divider" />
            <button className="quick-launch-btn" title="Internet Explorer">
              <img src={W98_ICONS.ie} alt="Internet Explorer" />
            </button>
            <button className="quick-launch-btn" title="Show Desktop">
              <img src={W98_ICONS.desktop} alt="Show Desktop" />
            </button>
            <button className="quick-launch-btn" title="Outlook Express">
              <img src={W98_ICONS.mail} alt="Outlook Express" />
            </button>
            <div className="quick-launch-divider" />
          </div>
          
          {/* Running Apps */}
          <div className="taskbar-apps">
            {windows.map(window => (
              <button
                key={window.id}
                className={`taskbar-app ${activeWindowId === window.id && !window.isMinimized ? 'active' : ''}`}
                onClick={() => {
                  if (activeWindowId === window.id && !window.isMinimized) {
                    minimizeWindow(window.id)
                    return
                  }

                  focusWindow(window.id)
                }}
              >
                <img src={window.icon} alt="" className="taskbar-app-icon" />
                <span className="taskbar-app-title">{window.title}</span>
              </button>
            ))}
          </div>
          
          {/* System Tray */}
          <SystemTray />
        </div>
      </div>
      
      {showStartMenu && (
        <StartMenu onClose={() => setShowStartMenu(false)} />
      )}
    </>
  )
}
