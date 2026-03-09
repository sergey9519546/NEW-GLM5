'use client'

import { useState } from 'react'
import { useAdminBiosStore } from '@/store'

export function VideosApp() {
  const { videos } = useAdminBiosStore()
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null)
  
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
              onClick={() => setSelectedVideo(video)}
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
              <div className="video-placeholder">
                <div className="play-icon">▶</div>
                <span>Video Player</span>
                <span className="video-note">(Demo - no actual video)</span>
              </div>
            </div>
            <div className="video-player-controls">
              <div className="video-progress">
                <div className="video-progress-bar" />
              </div>
              <div className="video-buttons">
                <button className="win95-button">▶ Play</button>
                <button className="win95-button">⏸ Pause</button>
                <button className="win95-button">⏹ Stop</button>
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
