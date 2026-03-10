'use client'

import { useRef, useState } from 'react'
import { useAdminBiosStore } from '@/store'

export function VideosApp() {
  const { videos } = useAdminBiosStore()
  const [selectedVideoId, setSelectedVideoId] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const selectedVideo = videos.find((video) => video.id === selectedVideoId) ?? videos[0] ?? null
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="videos-app">
      <div className="videos-sidebar">
        <div className="videos-list">
          {videos.map(video => (
            <div
              key={video.id}
              className={`video-item ${selectedVideo?.id === video.id ? 'active' : ''}`}
              onClick={() => setSelectedVideoId(video.id)}
            >
              <div className="video-thumb">
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} />
                ) : (
                  <div className="video-thumb-placeholder">▶</div>
                )}
              </div>
              <div className="video-info">
                <div className="video-title">{video.title}</div>
                <div className="video-duration">{formatDuration(video.duration)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="videos-main">
        {selectedVideo ? (
          <div className="video-player">
            <div className="video-player-header">
              {selectedVideo.title}
            </div>
            <div className="video-player-content">
              <video
                ref={videoRef}
                src={selectedVideo.url}
                className="video-surface"
                controls={false}
                poster={selectedVideo.thumbnailUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
            <div className="video-player-controls">
              <div className="video-progress">
                <div className="video-progress-bar">
                  <div className="video-progress-fill" style={{ width: isPlaying ? '100%' : '0%' }} />
                </div>
              </div>
              <div className="video-buttons">
                <button className="win95-button" onClick={() => void videoRef.current?.play()}>▶ Play</button>
                <button className="win95-button" onClick={() => videoRef.current?.pause()}>⏸ Pause</button>
                <button className="win95-button" onClick={() => {
                  if (!videoRef.current) {
                    return
                  }
                  videoRef.current.pause()
                  videoRef.current.currentTime = 0
                  setIsPlaying(false)
                }}>⏹ Stop</button>
              </div>
            </div>
            {selectedVideo.description && (
              <div className="video-description">
                {selectedVideo.description}
              </div>
            )}
          </div>
        ) : (
          <div className="videos-empty">
            <p>Select a video from the list</p>
          </div>
        )}
      </div>
    </div>
  )
}
