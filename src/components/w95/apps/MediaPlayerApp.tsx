'use client'

import { useState } from 'react'

export function MediaPlayerApp() {
  const [url, setUrl] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [progress, setProgress] = useState(0)
  
  return (
    <div className="media-player-app">
      <div className="media-menubar">
        <span className="menu-item">File</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Play</span>
        <span className="menu-item">Help</span>
      </div>
      
      <div className="media-content">
        <div className="media-screen">
          <div className="media-placeholder">
            <div className="media-icon">▶</div>
            <p>Windows Media Player</p>
            <p className="media-hint">Open a media file to play</p>
          </div>
        </div>
      </div>
      
      <div className="media-controls">
        <div className="media-progress">
          <div className="media-progress-bar">
            <div className="media-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="media-time">0:00 / 0:00</span>
        </div>
        
        <div className="media-buttons">
          <button className="media-btn">⏮</button>
          <button className="media-btn">⏹</button>
          <button className="media-btn play" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="media-btn">⏭</button>
          <button className="media-btn">🔁</button>
        </div>
        
        <div className="media-volume">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="media-volume-slider"
          />
        </div>
      </div>
      
      <div className="media-statusbar">
        <span>Ready</span>
      </div>
    </div>
  )
}
