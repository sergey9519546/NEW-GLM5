'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSystemStore, useAdminBiosStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'

type ContentTab = 'general' | 'tracks' | 'photos' | 'videos' | 'news' | 'wallpapers' | 'shows'

function createId(prefix: string) {
  return `${prefix}-${globalThis.crypto.randomUUID()}`
}

interface Show {
  id: string
  title: string
  venue: string
  date: string
  description?: string
  ticketUrl?: string
  posterUrl?: string
  status: string
}

export function AdminPanel() {
  const { adminUnlocked, setAdminUnlocked } = useSystemStore()
  const {
    bandName,
    bandBio,
    tracks,
    photos,
    videos,
    news,
    wallpapers,
    setBandName,
    setBandBio,
    addTrack,
    updateTrack,
    removeTrack,
    addPhoto,
    updatePhoto,
    removePhoto,
    addVideo,
    updateVideo,
    removeVideo,
    addNews,
    updateNews,
    removeNews,
    addWallpaper,
    updateWallpaper,
    removeWallpaper,
    saveContent,
    resetToDefaults,
    isSaving,
  } = useAdminBiosStore()
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<ContentTab>('general')
  
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Shows state (managed via /api/shows, not desktop-content)
  const [shows, setShows] = useState<Show[]>([])
  const [showsLoading, setShowsLoading] = useState(false)

  const fetchShows = useCallback(async () => {
    setShowsLoading(true)
    try {
      const res = await fetch('/api/shows')
      if (res.ok) {
        const data = await res.json()
        setShows(data.shows ?? [])
      }
    } catch { /* ignore */ } finally { setShowsLoading(false) }
  }, [])

  useEffect(() => {
    if (adminUnlocked) void fetchShows()
  }, [adminUnlocked, fetchShows])

  const addShow = async () => {
    try {
      const res = await fetch('/api/shows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Show',
          venue: 'TBD',
          date: new Date().toISOString(),
          status: 'upcoming',
        }),
      })
      if (res.ok) void fetchShows()
    } catch { /* ignore */ }
  }

  const deleteShow = async (id: string) => {
    try {
      await fetch(`/api/shows/${id}`, { method: 'DELETE' })
      setShows(prev => prev.filter(s => s.id !== id))
    } catch { /* ignore */ }
  }

  const handleLogin = async () => {
    setLoginError('')
    setIsLoggingIn(true)
    try {
      const res = await fetch('/api/auth/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase: password }),
      })
      if (res.ok) {
        setAdminUnlocked(true)
        setPassword('')
      } else {
        setLoginError('Invalid password')
      }
    } catch {
      setLoginError('Connection error')
    } finally {
      setIsLoggingIn(false)
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
            <button className="win95-button" onClick={handleLogin} disabled={isLoggingIn}>{isLoggingIn ? 'Verifying...' : 'OK'}</button>
            <button className="win95-button" onClick={() => setPassword('')}>Cancel</button>
          </div>
          {loginError && <p className="admin-hint" style={{ color: 'var(--w98-red, red)' }}>{loginError}</p>}
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
          className={`admin-tab ${activeTab === 'tracks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracks')}
        >
          Tracks
        </button>
        <button 
          className={`admin-tab ${activeTab === 'photos' ? 'active' : ''}`}
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </button>
        <button 
          className={`admin-tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
        <button 
          className={`admin-tab ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          News
        </button>
        <button 
          className={`admin-tab ${activeTab === 'wallpapers' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallpapers')}
        >
          Wallpapers
        </button>
        <button 
          className={`admin-tab ${activeTab === 'shows' ? 'active' : ''}`}
          onClick={() => setActiveTab('shows')}
        >
          Shows
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
              <button className="win95-button" onClick={() => void saveContent()} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="win95-button" onClick={resetToDefaults}>
                Reset to Defaults
              </button>
              <button className="win95-button" onClick={() => setAdminUnlocked(false)}>
                Logout
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tracks' && (
          <div className="admin-section">
            <div className="admin-actions">
              <button
                className="win95-button"
                onClick={() => addTrack({
                  id: createId('track'),
                  title: 'New Track',
                  artist: bandName,
                  album: 'Desktop Session',
                  duration: 180,
                  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                })}
              >
                Add Track
              </button>
              <button className="win95-button" onClick={() => void saveContent()} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Tracks'}
              </button>
            </div>
            {tracks.map((track) => (
              <div key={track.id} className="admin-field-group">
                <div className="admin-field">
                  <label>Title</label>
                  <input type="text" value={track.title} onChange={(e) => updateTrack(track.id, { title: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Artist</label>
                  <input type="text" value={track.artist} onChange={(e) => updateTrack(track.id, { artist: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Album</label>
                  <input type="text" value={track.album} onChange={(e) => updateTrack(track.id, { album: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Media URL</label>
                  <input type="text" value={track.url} onChange={(e) => updateTrack(track.id, { url: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field admin-inline-actions">
                  <button className="win95-button" onClick={() => removeTrack(track.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="admin-section">
            <div className="admin-actions">
              <button
                className="win95-button"
                onClick={() => addPhoto({
                  id: createId('photo'),
                  title: 'New Photo',
                  url: 'https://picsum.photos/1200/900?random=44',
                  thumbnailUrl: 'https://picsum.photos/320/240?random=44',
                })}
              >
                Add Photo
              </button>
              <button className="win95-button" onClick={() => void saveContent()} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Photos'}
              </button>
            </div>
            {photos.map((photo) => (
              <div key={photo.id} className="admin-field-group">
                <div className="admin-field">
                  <label>Title</label>
                  <input type="text" value={photo.title} onChange={(e) => updatePhoto(photo.id, { title: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Image URL</label>
                  <input type="text" value={photo.url} onChange={(e) => updatePhoto(photo.id, { url: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea value={photo.description || ''} onChange={(e) => updatePhoto(photo.id, { description: e.target.value })} className="win95-textarea" rows={3} />
                </div>
                <div className="admin-field admin-inline-actions">
                  <button className="win95-button" onClick={() => removePhoto(photo.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="admin-section">
            <div className="admin-actions">
              <button
                className="win95-button"
                onClick={() => addVideo({
                  id: createId('video'),
                  title: 'New Video',
                  url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                  duration: 30,
                })}
              >
                Add Video
              </button>
              <button className="win95-button" onClick={() => void saveContent()} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Videos'}
              </button>
            </div>
            {videos.map((video) => (
              <div key={video.id} className="admin-field-group">
                <div className="admin-field">
                  <label>Title</label>
                  <input type="text" value={video.title} onChange={(e) => updateVideo(video.id, { title: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Video URL</label>
                  <input type="text" value={video.url} onChange={(e) => updateVideo(video.id, { url: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea value={video.description || ''} onChange={(e) => updateVideo(video.id, { description: e.target.value })} className="win95-textarea" rows={3} />
                </div>
                <div className="admin-field admin-inline-actions">
                  <button className="win95-button" onClick={() => removeVideo(video.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="admin-section">
            <div className="admin-actions">
              <button
                className="win95-button"
                onClick={() => addNews({
                  id: createId('news'),
                  title: 'New Update',
                  content: 'Write your update here.',
                  date: new Date().toISOString().slice(0, 10),
                  author: 'Admin BIOS',
                })}
              >
                Add Article
              </button>
              <button className="win95-button" onClick={() => void saveContent()} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save News'}
              </button>
            </div>
            {news.map((item) => (
              <div key={item.id} className="admin-field-group">
                <div className="admin-field">
                  <label>Title</label>
                  <input type="text" value={item.title} onChange={(e) => updateNews(item.id, { title: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Content</label>
                  <textarea value={item.content} onChange={(e) => updateNews(item.id, { content: e.target.value })} className="win95-textarea" rows={6} />
                </div>
                <div className="admin-field admin-inline-actions">
                  <button className="win95-button" onClick={() => removeNews(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wallpapers' && (
          <div className="admin-section">
            <div className="admin-actions">
              <button
                className="win95-button"
                onClick={() => addWallpaper({
                  id: createId('wp'),
                  title: 'New Wallpaper',
                  url: 'https://picsum.photos/1920/1080?random=' + Date.now(),
                })}
              >
                Add Wallpaper
              </button>
              <button className="win95-button" onClick={() => void saveContent()} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Wallpapers'}
              </button>
            </div>
            {wallpapers.map((wp) => (
              <div key={wp.id} className="admin-field-group">
                <div className="admin-field">
                  <label>Title</label>
                  <input type="text" value={wp.title} onChange={(e) => updateWallpaper(wp.id, { title: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Image URL</label>
                  <input type="text" value={wp.url} onChange={(e) => updateWallpaper(wp.id, { url: e.target.value })} className="win95-input" />
                </div>
                <div className="admin-field admin-inline-actions">
                  <button className="win95-button" onClick={() => removeWallpaper(wp.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shows' && (
          <div className="admin-section">
            <div className="admin-actions">
              <button className="win95-button" onClick={() => void addShow()}>
                Add Show
              </button>
              <button className="win95-button" onClick={() => void fetchShows()} disabled={showsLoading}>
                {showsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            {shows.map((show) => (
              <div key={show.id} className="admin-field-group">
                <div className="admin-field">
                  <label>Title</label>
                  <input type="text" value={show.title} readOnly className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Venue</label>
                  <input type="text" value={show.venue} readOnly className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Date</label>
                  <input type="text" value={new Date(show.date).toLocaleDateString()} readOnly className="win95-input" />
                </div>
                <div className="admin-field">
                  <label>Status</label>
                  <input type="text" value={show.status} readOnly className="win95-input" />
                </div>
                <div className="admin-field admin-inline-actions">
                  <button className="win95-button" onClick={() => void deleteShow(show.id)}>Remove</button>
                </div>
              </div>
            ))}
            {shows.length === 0 && !showsLoading && (
              <p style={{ textAlign: 'center', color: 'var(--w98-dark-gray)', padding: '20px' }}>No shows yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
