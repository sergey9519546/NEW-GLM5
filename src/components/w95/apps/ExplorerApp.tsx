'use client'

import { useState } from 'react'
import { W98_ICONS } from '@/lib/icons'

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'file'
  icon: string
  size?: string
  modified?: string
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'My Documents', type: 'folder', icon: W98_ICONS.folder },
  { id: '2', name: 'My Computer', type: 'folder', icon: W98_ICONS.computer },
  { id: '3', name: 'Network Neighborhood', type: 'folder', icon: W98_ICONS.folder },
  { id: '4', name: 'Recycle Bin', type: 'folder', icon: W98_ICONS.folder },
  { id: '5', name: 'readme.txt', type: 'file', icon: W98_ICONS.notepadFile, size: '1 KB', modified: '1/15/2024' },
  { id: '6', name: 'song.mp3', type: 'file', icon: W98_ICONS.mediaPlayer, size: '4.2 MB', modified: '1/14/2024' },
  { id: '7', name: 'image.bmp', type: 'file', icon: W98_ICONS.paint, size: '2.1 MB', modified: '1/10/2024' },
]

export function ExplorerApp() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'icons' | 'list' | 'details'>('icons')
  const [currentPath, setCurrentPath] = useState('C:\\')
  
  return (
    <div className="explorer-app">
      <div className="explorer-menubar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>
      
      <div className="explorer-toolbar">
        <button className="win95-button small">Back</button>
        <button className="win95-button small">Forward</button>
        <button className="win95-button small">Up</button>
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
          onChange={(e) => setCurrentPath(e.target.value)}
          className="explorer-address-input"
        />
      </div>
      
      <div className="explorer-content">
        <div className="explorer-tree">
          <div className="tree-item">
            <span className="tree-icon">📁</span>
            <span>Desktop</span>
          </div>
          <div className="tree-item">
            <span className="tree-icon">📁</span>
            <span>My Documents</span>
          </div>
          <div className="tree-item">
            <span className="tree-icon">💾</span>
            <span>C:</span>
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
              {mockFiles.map(file => (
                <div
                  key={file.id}
                  className={`details-row ${selectedFile === file.id ? 'selected' : ''}`}
                  onClick={() => setSelectedFile(file.id)}
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
            mockFiles.map(file => (
              <div
                key={file.id}
                className={`file-item ${selectedFile === file.id ? 'selected' : ''}`}
                onClick={() => setSelectedFile(file.id)}
                onDoubleClick={() => file.type === 'folder' && setCurrentPath(currentPath + file.name + '\\')}
              >
                <img src={file.icon} alt="" className="file-icon" />
                <span className="file-name">{file.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="explorer-statusbar">
        <span>{mockFiles.length} object(s)</span>
        {selectedFile && <span>1 object(s) selected</span>}
      </div>
    </div>
  )
}
