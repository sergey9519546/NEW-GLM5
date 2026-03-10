'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAdminBiosStore } from '@/store'

export function MediaPlayerApp() {
  const { tracks, videos } = useAdminBiosStore()
  const library = useMemo(
    () => [
      ...tracks.map((track) => ({ id: track.id, label: `${track.title} (audio)`, kind: 'audio' as const, url: track.url })),
      ...videos.map((video) => ({ id: video.id, label: `${video.title} (video)`, kind: 'video' as const, url: video.url })),
    ],
    [tracks, videos],
  )
  const [url, setUrl] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeMediaId, setActiveMediaId] = useState('')
  const mediaRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!mediaRef.current) {
      return
    }

    mediaRef.current.volume = volume / 100
  }, [volume])

  const activeMedia = library.find((item) => item.id === activeMediaId) ?? library[0] ?? null

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return '0:00'
    }

    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const loadSelectedMedia = () => {
    if (!mediaRef.current || !url.trim()) {
      return
    }

    mediaRef.current.src = url.trim()
    mediaRef.current.load()
    setProgress(0)
    setDuration(0)
    setIsPlaying(false)
  }

  const togglePlayback = async () => {
    if (!mediaRef.current) {
      return
    }

    if (isPlaying) {
      mediaRef.current.pause()
      setIsPlaying(false)
      return
    }

    await mediaRef.current.play()
    setIsPlaying(true)
  }

  const stopPlayback = () => {
    if (!mediaRef.current) {
      return
    }

    mediaRef.current.pause()
    mediaRef.current.currentTime = 0
    setProgress(0)
    setIsPlaying(false)
  }
  
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
          <video
            ref={mediaRef}
            className="media-video"
            controls={false}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => {
              const currentDuration = e.currentTarget.duration || duration
              const nextProgress = currentDuration > 0
                ? (e.currentTarget.currentTime / currentDuration) * 100
                : 0
              setProgress(nextProgress)
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false)
              setProgress(100)
            }}
          />
        </div>
      </div>
      
      <div className="media-controls">
        <div className="media-volume">
          <select
            className="win95-input"
            value={activeMedia?.id ?? ''}
            onChange={(e) => {
              const nextMedia = library.find((item) => item.id === e.target.value)
              setActiveMediaId(e.target.value)
              setUrl(nextMedia?.url ?? '')
            }}
          >
            <option value="">Select media</option>
            {library.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={url || activeMedia?.url || ''}
            onChange={(e) => setUrl(e.target.value)}
            className="win95-input"
            aria-label="Media source URL"
            placeholder="Paste a media URL"
          />
          <button className="win95-button small" onClick={loadSelectedMedia}>Open</button>
        </div>
        <div className="media-progress">
          <div className="media-progress-bar">
            <div className="media-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="media-time">
            {formatTime((progress / 100) * duration)} / {formatTime(duration)}
          </span>
        </div>
        
        <div className="media-buttons">
          <button className="media-btn" onClick={() => mediaRef.current && (mediaRef.current.currentTime = Math.max(0, mediaRef.current.currentTime - 10))}>⏮</button>
          <button className="media-btn" onClick={stopPlayback}>⏹</button>
          <button className="media-btn play" onClick={() => void togglePlayback()}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="media-btn" onClick={() => mediaRef.current && (mediaRef.current.currentTime = Math.min(duration || 0, mediaRef.current.currentTime + 10))}>⏭</button>
          <button className="media-btn" onClick={() => {
            if (mediaRef.current) {
              mediaRef.current.loop = !mediaRef.current.loop
            }
          }}>🔁</button>
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
        <span>{activeMedia ? `Loaded: ${activeMedia.label}` : 'Ready'}</span>
      </div>
    </div>
  )
}
