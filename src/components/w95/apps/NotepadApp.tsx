'use client'

import { useCallback, useEffect, useState } from 'react'
import { useWindowStore } from '@/store'
import {
  fetchVfsEntry,
  fetchVfsEntries,
  createVfsEntry,
  updateVfsEntry,
} from '@services/vfs'
import type { VfsEntry } from '@/lib/personal-state'

/**
 * NotepadApp — VFS-backed text editor.
 *
 * Props (optional, passed through WindowFrame → window.props):
 *   fileId  — open this VFS file on mount
 */
export function NotepadApp() {
  const activeWindowId = useWindowStore((s) => s.activeWindowId)
  const getWindowById = useWindowStore((s) => s.getWindowById)

  // Resolve fileId from the window that contains this Notepad instance
  // We look for the most recent notepad-* window that has a fileId prop
  const windows = useWindowStore((s) => s.windows)
  const notepadWindow = windows.find(
    (w) => w.component === 'notepad' && w.props?.fileId,
  )
  const initialFileId = notepadWindow?.props?.fileId as string | undefined

  const [fileId, setFileId] = useState<string | null>(initialFileId ?? null)
  const [content, setContent] = useState('')
  const [filename, setFilename] = useState('Untitled.txt')
  const [isDirty, setIsDirty] = useState(false)
  const [wordWrap, setWordWrap] = useState(true)
  const [statusMessage, setStatusMessage] = useState('Ready')
  const [recentFiles, setRecentFiles] = useState<VfsEntry[]>([])

  // Load file if opened with fileId
  useEffect(() => {
    if (!initialFileId) return
    void (async () => {
      try {
        const entry = await fetchVfsEntry(initialFileId)
        setFileId(entry.id)
        setFilename(entry.name)
        setContent(entry.content ?? '')
        setIsDirty(false)
        setStatusMessage(`Opened ${entry.name}`)
      } catch {
        setStatusMessage('Failed to open file')
      }
    })()
  }, [initialFileId])

  // Load recent .txt files from My Documents on mount
  useEffect(() => {
    void (async () => {
      try {
        const { entries } = await fetchVfsEntries(null)
        // Find My Documents folder
        const docs = entries.find((e) => e.name === 'My Documents' && e.type === 'folder')
        if (docs) {
          const { entries: docFiles } = await fetchVfsEntries(docs.id)
          setRecentFiles(docFiles.filter((e) => e.type === 'file'))
        }
      } catch {
        // non-critical
      }
    })()
  }, [])

  const handleNew = useCallback(() => {
    setFileId(null)
    setFilename('Untitled.txt')
    setContent('')
    setIsDirty(false)
    setStatusMessage('New document')
  }, [])

  const handleOpen = useCallback(async (id: string) => {
    try {
      const entry = await fetchVfsEntry(id)
      setFileId(entry.id)
      setFilename(entry.name)
      setContent(entry.content ?? '')
      setIsDirty(false)
      setStatusMessage(`Opened ${entry.name}`)
    } catch {
      setStatusMessage('Failed to open file')
    }
  }, [])

  const handleSave = useCallback(async () => {
    try {
      if (fileId) {
        // Update existing
        await updateVfsEntry(fileId, {
          name: filename.trim() || 'Untitled.txt',
          content,
        })
        setIsDirty(false)
        setStatusMessage(`Saved ${filename}`)
      } else {
        // Create new in My Documents
        const { entries } = await fetchVfsEntries(null)
        const docs = entries.find((e) => e.name === 'My Documents' && e.type === 'folder')

        const created = await createVfsEntry({
          parentId: docs?.id ?? null,
          name: filename.trim() || 'Untitled.txt',
          type: 'file',
          content,
          mimeType: 'text/plain',
        })
        setFileId(created.id)
        setFilename(created.name)
        setIsDirty(false)
        setStatusMessage(`Saved ${created.name}`)

        // Refresh recent files
        if (docs) {
          const { entries: docFiles } = await fetchVfsEntries(docs.id)
          setRecentFiles(docFiles.filter((e) => e.type === 'file'))
        }
      }
    } catch {
      setStatusMessage('Save failed')
    }
  }, [fileId, filename, content])

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length
  const lineCount = content.split('\n').length

  return (
    <div className="notepad-app">
      <div className="notepad-menubar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">Format</span>
        <span className="menu-item">Help</span>
      </div>

      <div className="notepad-toolbar">
        <button className="win95-button small" onClick={handleNew}>New</button>
        <select
          className="win95-input small"
          aria-label="Open saved file"
          value={fileId ?? ''}
          onChange={(e) => { if (e.target.value) void handleOpen(e.target.value) }}
        >
          <option value="">Open...</option>
          {recentFiles.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <button className="win95-button small" onClick={() => void handleSave()}>
          Save{isDirty ? ' *' : ''}
        </button>
        <div className="toolbar-divider" />
        <input
          type="text"
          value={filename}
          onChange={(e) => { setFilename(e.target.value); setIsDirty(true) }}
          className="win95-input small"
          aria-label="Document filename"
        />
        <label className="word-wrap-toggle">
          <input
            type="checkbox"
            checked={wordWrap}
            onChange={(e) => setWordWrap(e.target.checked)}
          />
          <span>Word Wrap</span>
        </label>
      </div>

      <textarea
        className={`notepad-textarea ${wordWrap ? 'wrap' : ''}`}
        value={content}
        onChange={(e) => { setContent(e.target.value); setIsDirty(true) }}
        placeholder="Start typing..."
        spellCheck={false}
      />

      <div className="notepad-statusbar">
        <span>{statusMessage}</span>
        <span>Lines: {lineCount}</span>
        <span>Words: {wordCount}</span>
        <span>Chars: {charCount}</span>
      </div>
    </div>
  )
}
