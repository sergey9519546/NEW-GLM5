'use client'

import { useState, useRef, useEffect } from 'react'
import { useAdminBiosStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'

export function MusicApp() {
  const { tracks } = useAdminBiosStore()
  const [currentTrack, setCurrentTrack] = useState<typeof tracks[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const handlePlayTrack = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
      setProgress(0)
    }
  }
  
  useEffect(() => {
    if (currentTrack && isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Play next track
            const currentIndex = tracks.findIndex(t => t.id === currentTrack.id)
            if (currentIndex < tracks.length - 1) {
              setCurrentTrack(tracks[currentIndex + 1])
              return 0
            } else {
              setIsPlaying(false)
              return 100
            }
          }
          return prev + (100 / currentTrack.duration)
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [currentTrack, isPlaying, tracks])
  
  return (
    <div className="music-app">
      <div className="music-header">
        <img src={W98_ICONS.mediaPlayer} alt="" className="music-header-icon" />
        <span>alti.tune - Music Player</span>
      </div>
      
      <div className="music-content">
        <div className="music-sidebar">
          <div className="music-cover">
            {currentTrack ? (
              <div className="cover-placeholder">
                <img src={W98_ICONS.mediaPlayer} alt="" />
              </div>
            ) : (
              <div className="cover-placeholder empty">
                <span>No Track</span>
              </div>
            )}
          </div>
          <div className="music-info">
            <div className="track-title">{currentTrack?.title || 'No track selected'}</div>
            <div className="track-artist">{currentTrack?.artist || '-'}</div>
            <div className="track-album">{currentTrack?.album || '-'}</div>
          </div>
        </div>
        
        <div className="music-main">
          <div className="music-playlist">
            <div className="playlist-header">
              <span>Playlist</span>
            </div>
            <div className="playlist-tracks">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`playlist-track ${currentTrack?.id === track.id ? 'active' : ''}`}
                  onClick={() => handlePlayTrack(track)}
                >
                  <span className="track-number">{index + 1}</span>
                  <span className="track-name">{track.title}</span>
                  <span className="track-duration">{formatDuration(track.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="music-controls">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="control-buttons">
          <button className="control-btn" onClick={() => {
            const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id)
            if (currentIndex > 0) {
              setCurrentTrack(tracks[currentIndex - 1])
              setProgress(0)
            }
          }}>⏮</button>
          <button className="control-btn play" onClick={() => currentTrack && setIsPlaying(!isPlaying)}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="control-btn" onClick={() => {
            const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id)
            if (currentIndex < tracks.length - 1) {
              setCurrentTrack(tracks[currentIndex + 1])
              setProgress(0)
            }
          }}>⏭</button>
        </div>
        <div className="volume-control">
          <img src={W98_ICONS.volume} alt="" />
          <input type="range" className="volume-slider" min="0" max="100" defaultValue="80" />
        </div>
      </div>
      
      <audio ref={audioRef} />
    </div>
  )
}
