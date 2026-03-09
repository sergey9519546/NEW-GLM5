'use client'

import { useState } from 'react'
import { useAdminBiosStore } from '@/store'

export function PhotosApp() {
  const { photos } = useAdminBiosStore()
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  return (
    <div className="photos-app">
      <div className="photos-toolbar">
        <button className="win95-button" onClick={() => setViewMode('grid')}>
          Grid
        </button>
        <button className="win95-button" onClick={() => setViewMode('list')}>
          List
        </button>
        <div className="toolbar-divider" />
        <span className="toolbar-info">{photos.length} photos</span>
      </div>
      
      <div className={`photos-content ${viewMode}`}>
        {selectedPhoto ? (
          <div className="photo-viewer">
            <div className="photo-viewer-header">
              <span>{selectedPhoto.title}</span>
              <button className="win95-button" onClick={() => setSelectedPhoto(null)}>
                Back
              </button>
            </div>
            <div className="photo-viewer-image">
              <img src={selectedPhoto.url} alt={selectedPhoto.title} />
            </div>
            {selectedPhoto.description && (
              <div className="photo-viewer-desc">
                {selectedPhoto.description}
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="photos-grid">
            {photos.map(photo => (
              <div
                key={photo.id}
                className="photo-item"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="photo-thumbnail">
                  <img src={photo.thumbnailUrl || photo.url} alt={photo.title} />
                </div>
                <div className="photo-title">{photo.title}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="photos-list">
            {photos.map(photo => (
              <div
                key={photo.id}
                className="photo-list-item"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo.thumbnailUrl || photo.url} alt={photo.title} className="photo-list-thumb" />
                <div className="photo-list-info">
                  <div className="photo-list-title">{photo.title}</div>
                  {photo.description && (
                    <div className="photo-list-desc">{photo.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
