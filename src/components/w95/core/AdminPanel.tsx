'use client'

import { useState } from 'react'
import { useSystemStore, useAdminBiosStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'
import { WindowFrame } from './WindowFrame'

export function AdminPanel() {
  const { adminUnlocked, setAdminUnlocked } = useSystemStore()
  const { bandName, bandBio, setBandName, setBandBio, resetToDefaults } = useAdminBiosStore()
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'general' | 'content'>('general')
  
  const handleLogin = () => {
    if (password === 'altitune' || password === 'admin') {
      setAdminUnlocked(true)
      setPassword('')
    } else {
      alert('Invalid password')
    }
  }
  
  if (!adminUnlocked) {
    return (
      <div className="admin-login">
        <div className="admin-login-content">
          <img src={W98_ICONS.computer} alt="Admin" className="admin-login-icon" />
          <h2>Admin BIOS</h2>
          <p>Enter administrator password:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="admin-password-input"
            placeholder="Password"
            autoFocus
          />
          <div className="admin-login-buttons">
            <button className="win95-button" onClick={handleLogin}>OK</button>
            <button className="win95-button" onClick={() => setPassword('')}>Cancel</button>
          </div>
          <p className="admin-hint">Hint: altitune</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="admin-panel">
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button 
          className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'general' && (
          <div className="admin-section">
            <h3>Band Information</h3>
            <div className="admin-field">
              <label>Band Name:</label>
              <input
                type="text"
                value={bandName}
                onChange={(e) => setBandName(e.target.value)}
                className="win95-input"
              />
            </div>
            <div className="admin-field">
              <label>Biography:</label>
              <textarea
                value={bandBio}
                onChange={(e) => setBandBio(e.target.value)}
                className="win95-textarea"
                rows={4}
              />
            </div>
            <div className="admin-actions">
              <button className="win95-button" onClick={resetToDefaults}>
                Reset to Defaults
              </button>
              <button className="win95-button" onClick={() => setAdminUnlocked(false)}>
                Logout
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'content' && (
          <div className="admin-section">
            <h3>Content Management</h3>
            <p className="admin-info">
              Content is managed through the BIOS system. Changes are saved automatically.
            </p>
            <div className="admin-content-stats">
              <div className="stat-item">
                <span>Tracks:</span>
                <span>{useAdminBiosStore.getState().tracks.length}</span>
              </div>
              <div className="stat-item">
                <span>Photos:</span>
                <span>{useAdminBiosStore.getState().photos.length}</span>
              </div>
              <div className="stat-item">
                <span>Videos:</span>
                <span>{useAdminBiosStore.getState().videos.length}</span>
              </div>
              <div className="stat-item">
                <span>News:</span>
                <span>{useAdminBiosStore.getState().news.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
