'use client'

import { useCallback, useEffect, useState } from 'react'
import { useFileSystemStore, useWindowStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'
import { getApp } from '@/lib/appRegistry'
import type { VfsEntry } from '@/lib/personal-state'

function iconForEntry(entry: VfsEntry): string {
  if (entry.type === 'folder') return W98_ICONS.folder
  if (entry.mimeType?.startsWith('text/')) return W98_ICONS.notepadFile
  if (entry.mimeType?.startsWith('image/')) return W98_ICONS.paint
  if (entry.mimeType?.startsWith('audio/')) return W98_ICONS.mediaPlayer
  if (entry.mimeType?.startsWith('video/')) return W98_ICONS.mediaPlayer
  return W98_ICONS.document
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ExplorerApp() {
  const {
    currentFolder,
    entries,
    breadcrumb,
    selectedIds,
    viewMode,
    isLoading,
    error,
    navigateTo,
    navigateUp,
    refresh,
    select,
    clearSelection,
    createFolder,
    remove,
    rename,
    setViewMode,
  } = useFileSystemStore()

  const openWindow = useWindowStore((s) => s.openWindow)

  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  // Navigate to root on mount
  useEffect(() => {
    if (!currentFolder) {
      void navigateTo(null)
    }
  }, [currentFolder, navigateTo])

  const handleOpen = useCallback((entry: VfsEntry) => {
    if (entry.type === 'folder') {
      void navigateTo(entry.id)
    } else if (entry.mimeType?.startsWith('text/')) {
      // Open in notepad
      const app = getApp('notepad')
      if (app) {
        openWindow({
          id: `notepad-${entry.id}`,
          title: `${entry.name} - Notepad`,
          icon: app.icon,
          component: app.component,
          isMinimized: false,
          isMaximized: false,
          position: { x: 150 + Math.random() * 80, y: 100 + Math.random() * 40 },
          size: app.defaultSize,
          props: { fileId: entry.id },
        })
      }
    }
  }, [navigateTo, openWindow])

  const handleNewFolder = useCallback(async () => {
    try {
      await createFolder('New Folder')
    } catch {
      // error state handled by store
    }
  }, [createFolder])

  const handleDelete = useCallback(async () => {
    const ids = Array.from(selectedIds)
    for (const id of ids) {
      try {
        await remove(id)
      } catch {
        break
      }
    }
  }, [selectedIds, remove])

  const startRename = useCallback((entry: VfsEntry) => {
    setRenameId(entry.id)
    setRenameValue(entry.name)
  }, [])

  const commitRename = useCallback(async () => {
    if (!renameId || !renameValue.trim()) {
      setRenameId(null)
      return
    }
    try {
      await rename(renameId, renameValue.trim())
    } catch {
      // handled
    }
    setRenameId(null)
  }, [renameId, renameValue, rename])

  const addressPath = breadcrumb.map((e) => e.name).join('\\') || 'C:'

  return (
    <div className="explorer-app">
      <div className="explorer-menubar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>

      <div className="explorer-toolbar">
        <button
          className="win95-button small"
          onClick={() => void navigateUp()}
          disabled={!currentFolder?.parentId}
        >
          Up
        </button>
        <button className="win95-button small" onClick={() => void refresh()}>
          Refresh
        </button>
        <div className="toolbar-divider" />
        <button className="win95-button small" onClick={() => setViewMode('icons')}>
          Icons
        </button>
        <button className="win95-button small" onClick={() => setViewMode('list')}>
          List
        </button>
        <div className="toolbar-divider" />
        <button className="win95-button small" onClick={handleNewFolder}>
          New Folder
        </button>
        <button
          className="win95-button small"
          onClick={handleDelete}
          disabled={selectedIds.size === 0}
        >
          Delete
        </button>
      </div>

      <div className="explorer-addressbar">
        <span>Address</span>
        <input
          type="text"
          value={addressPath}
          readOnly
          className="explorer-address-input"
          aria-label="Current folder path"
        />
      </div>

      <div className="explorer-content">
        {/* Tree pane — breadcrumb items as clickable navigation */}
        <div className="explorer-tree">
          {breadcrumb.map((folder) => (
            <div key={folder.id} className="tree-item">
              <span className="tree-icon">📁</span>
              <button
                className={`tree-link ${folder.id === currentFolder?.id ? 'active' : ''}`}
                onClick={() => void navigateTo(folder.parentId)}
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>

        {/* File pane */}
        <div className={`explorer-files ${viewMode}`}>
          {isLoading && <div className="explorer-loading">Loading...</div>}
          {error && <div className="explorer-error">{error}</div>}

          {!isLoading && !error && viewMode === 'list' ? (
            <div className="files-details">
              <div className="details-header">
                <span>Name</span>
                <span>Size</span>
                <span>Modified</span>
              </div>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`details-row ${selectedIds.has(entry.id) ? 'selected' : ''}`}
                  onClick={(e) => select(entry.id, e.ctrlKey || e.metaKey)}
                  onDoubleClick={() => handleOpen(entry)}
                >
                  <span className="file-name">
                    <img src={iconForEntry(entry)} alt="" />
                    {renameId === entry.id ? (
                      <input
                        className="rename-input"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => void commitRename()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') void commitRename()
                          if (e.key === 'Escape') setRenameId(null)
                        }}
                        autoFocus
                      />
                    ) : (
                      <span onDoubleClick={(e) => { e.stopPropagation(); startRename(entry) }}>
                        {entry.name}
                      </span>
                    )}
                  </span>
                  <span>{entry.type === 'file' ? formatSize(entry.size) : '-'}</span>
                  <span>{new Date(entry.updatedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : !isLoading && !error ? (
            <div className="files-grid" onClick={() => clearSelection()}>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`file-item ${selectedIds.has(entry.id) ? 'selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); select(entry.id, e.ctrlKey || e.metaKey) }}
                  onDoubleClick={() => handleOpen(entry)}
                >
                  <img src={iconForEntry(entry)} alt="" className="file-icon" />
                  {renameId === entry.id ? (
                    <input
                      className="rename-input"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => void commitRename()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') void commitRename()
                        if (e.key === 'Escape') setRenameId(null)
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="file-name">{entry.name}</span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="explorer-statusbar">
        <span>{entries.length} object(s)</span>
        {selectedIds.size > 0 && <span>{selectedIds.size} object(s) selected</span>}
      </div>
    </div>
  )
}
