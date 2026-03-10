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
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        void audioRef.current?.play()
        setIsPlaying(true)
      }
    } else {
      setCurrentTrack(track)
      setProgress(0)
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    if (!audioRef.current || !currentTrack) {
      return
    }

    audioRef.current.src = currentTrack.url
    audioRef.current.load()
    if (isPlaying) {
      void audioRef.current.play()
    }
  }, [currentTrack, isPlaying])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const handleTimeUpdate = () => {
      const nextProgress = audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0
      setProgress(nextProgress)
    }

    const handleEnded = () => {
      const currentIndex = tracks.findIndex((track) => track.id === currentTrack?.id)
      if (currentIndex >= 0 && currentIndex < tracks.length - 1) {
        setCurrentTrack(tracks[currentIndex + 1])
        return
      }

      setIsPlaying(false)
      setProgress(100)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrack, tracks])
  
  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      void audioRef.current.play()
      return
    }

    audioRef.current.pause()
  }, [isPlaying])
  
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
                <img src={currentTrack.coverUrl || W98_ICONS.mediaPlayer} alt={currentTrack.title} />
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
              setIsPlaying(true)
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
              setIsPlaying(true)
            }
          }}>⏭</button>
        </div>
        <div className="volume-control">
          <img src={W98_ICONS.volume} alt="" />
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="100"
            defaultValue="80"
            onChange={(e) => {
              if (audioRef.current) {
                audioRef.current.volume = Number(e.target.value) / 100
              }
            }}
          />
        </div>
      </div>
      
      <audio ref={audioRef} preload="metadata" />
    </div>
  )
}
