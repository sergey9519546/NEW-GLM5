'use client'

import { useMemo, useState } from 'react'
import { useAdminBiosStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'file'
  icon: string
  size?: string
  modified?: string
}

export function ExplorerApp() {
  const { notes, tracks, photos, videos, news } = useAdminBiosStore()
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'icons' | 'list' | 'details'>('icons')
  const [history, setHistory] = useState<string[]>(['Desktop'])
  const [historyIndex, setHistoryIndex] = useState(0)

  const currentPath = history[historyIndex]

  const fileSystem = useMemo<Record<string, FileItem[]>>(() => ({
    Desktop: [
      { id: 'folder-media', name: 'Media Library', type: 'folder', icon: W98_ICONS.folder },
      { id: 'folder-news', name: 'Newsroom', type: 'folder', icon: W98_ICONS.folder },
      { id: 'folder-notes', name: 'Notes', type: 'folder', icon: W98_ICONS.folder },
    ],
    'Desktop\\Media Library': [
      ...tracks.map((track) => ({ id: track.id, name: `${track.title}.mp3`, type: 'file' as const, icon: W98_ICONS.mediaPlayer, size: `${Math.max(1, Math.round(track.duration / 60))} MB`, modified: 'Today' })),
      ...photos.map((photo) => ({ id: photo.id, name: `${photo.title}.jpg`, type: 'file' as const, icon: W98_ICONS.paint, size: 'Image', modified: 'Today' })),
      ...videos.map((video) => ({ id: video.id, name: `${video.title}.mp4`, type: 'file' as const, icon: W98_ICONS.mediaPlayer, size: `${Math.max(1, Math.round(video.duration / 15))} MB`, modified: 'Today' })),
    ],
    'Desktop\\Newsroom': news.map((item) => ({
      id: item.id,
      name: `${item.title}.md`,
      type: 'file' as const,
      icon: W98_ICONS.document,
      size: `${Math.max(1, Math.ceil(item.content.length / 1200))} KB`,
      modified: item.date,
    })),
    'Desktop\\Notes': notes.map((note) => ({
      id: note.id,
      name: note.title,
      type: 'file' as const,
      icon: W98_ICONS.notepadFile,
      size: `${Math.max(1, Math.ceil(note.content.length / 1200))} KB`,
      modified: note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'Today',
    })),
  }), [news, notes, photos, tracks, videos])

  const currentFiles = fileSystem[currentPath] ?? []

  const navigateTo = (path: string) => {
    const nextHistory = history.slice(0, historyIndex + 1)
    nextHistory.push(path)
    setHistory(nextHistory)
    setHistoryIndex(nextHistory.length - 1)
    setSelectedFile(null)
  }

  const canGoBack = historyIndex > 0
  const canGoForward = historyIndex < history.length - 1
  const pathParts = currentPath.split('\\')
  const canGoUp = pathParts.length > 1

  const handleBack = () => {
    if (!canGoBack) {
      return
    }

    setHistoryIndex(historyIndex - 1)
    setSelectedFile(null)
  }

  const handleForward = () => {
    if (!canGoForward) {
      return
    }

    setHistoryIndex(historyIndex + 1)
    setSelectedFile(null)
  }

  const handleUp = () => {
    if (!canGoUp) {
      return
    }

    navigateTo(pathParts.slice(0, -1).join('\\'))
  }

  const handleOpenFile = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateTo(`${currentPath}\\${file.name}`)
    }
  }
  
  return (
    <div className="explorer-app">
      <div className="explorer-menubar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>
      
      <div className="explorer-toolbar">
        <button className="win95-button small" onClick={handleBack} disabled={!canGoBack}>Back</button>
        <button className="win95-button small" onClick={handleForward} disabled={!canGoForward}>Forward</button>
        <button className="win95-button small" onClick={handleUp} disabled={!canGoUp}>Up</button>
        <div className="toolbar-divider" />
        <button className="win95-button small" onClick={() => setViewMode('icons')}>Icons</button>
        <button className="win95-button small" onClick={() => setViewMode('list')}>List</button>
        <button className="win95-button small" onClick={() => setViewMode('details')}>Details</button>
      </div>
      
      <div className="explorer-addressbar">
        <span>Address</span>
        <input
          type="text"
          value={currentPath}
          onChange={(e) => {
            const nextPath = e.target.value
            if (fileSystem[nextPath]) {
              navigateTo(nextPath)
            }
          }}
          className="explorer-address-input"
        />
      </div>
      
      <div className="explorer-content">
        <div className="explorer-tree">
          <div className="tree-item">
            <span className="tree-icon">📁</span>
            <button className="tree-link" onClick={() => navigateTo('Desktop')}>Desktop</button>
          </div>
          <div className="tree-item">
            <span className="tree-icon">📁</span>
            <button className="tree-link" onClick={() => navigateTo('Desktop\\Notes')}>Notes</button>
          </div>
          <div className="tree-item">
            <span className="tree-icon">💾</span>
            <button className="tree-link" onClick={() => navigateTo('Desktop\\Media Library')}>Media Library</button>
          </div>
        </div>
        
        <div className={`explorer-files ${viewMode}`}>
          {viewMode === 'details' ? (
            <div className="files-details">
              <div className="details-header">
                <span>Name</span>
                <span>Size</span>
                <span>Modified</span>
              </div>
              {currentFiles.map(file => (
                <div
                  key={file.id}
                  className={`details-row ${selectedFile === file.id ? 'selected' : ''}`}
                  onClick={() => setSelectedFile(file.id)}
                  onDoubleClick={() => handleOpenFile(file)}
                >
                  <span className="file-name">
                    <img src={file.icon} alt="" />
                    {file.name}
                  </span>
                  <span>{file.size || '-'}</span>
                  <span>{file.modified || '-'}</span>
                </div>
              ))}
            </div>
          ) : (
            currentFiles.map(file => (
              <div
                key={file.id}
                className={`file-item ${selectedFile === file.id ? 'selected' : ''}`}
                onClick={() => setSelectedFile(file.id)}
                onDoubleClick={() => handleOpenFile(file)}
              >
                <img src={file.icon} alt="" className="file-icon" />
                <span className="file-name">{file.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="explorer-statusbar">
        <span>{currentFiles.length} object(s)</span>
        {selectedFile && <span>1 object(s) selected</span>}
      </div>
    </div>
  )
}
