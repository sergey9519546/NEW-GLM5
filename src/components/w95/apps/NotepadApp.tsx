'use client'

import { useState } from 'react'
import { useAdminBiosStore } from '@/store'

export function NotepadApp() {
  const { notes, saveNote, deleteNote } = useAdminBiosStore()
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [filename, setFilename] = useState('Untitled.txt')
  const [wordWrap, setWordWrap] = useState(true)
  const [statusMessage, setStatusMessage] = useState('Ready')

  const handleNew = () => {
    setSelectedNoteId(null)
    setFilename(`note-${notes.length + 1}.txt`)
    setContent('')
    setStatusMessage('New document')
  }

  const handleOpen = (noteId: string) => {
    const note = notes.find((entry) => entry.id === noteId)

    if (!note) {
      return
    }

    setSelectedNoteId(note.id)
    setFilename(note.title)
    setContent(note.content)
    setStatusMessage(`Opened ${note.title}`)
  }

  const handleSave = async () => {
    const saved = await saveNote({
      id: selectedNoteId ?? undefined,
      title: filename.trim() || 'Untitled.txt',
      content,
    })

    if (saved) {
      setSelectedNoteId(saved.id)
      setFilename(saved.title)
      setStatusMessage(`Saved ${saved.title}`)
      return
    }

    setStatusMessage('Save failed')
  }

  const handleDelete = async () => {
    if (!selectedNoteId) {
      handleNew()
      return
    }

    await deleteNote(selectedNoteId)
    setSelectedNoteId(null)
    setFilename('Untitled.txt')
    setContent('')
    setStatusMessage('Document deleted')
  }
  
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
          aria-label="Open saved note"
          value={selectedNoteId ?? ''}
          onChange={(e) => handleOpen(e.target.value)}
        >
          <option value="">Open...</option>
          {notes.map((note) => (
            <option key={note.id} value={note.id}>{note.title}</option>
          ))}
        </select>
        <button className="win95-button small" onClick={() => void handleSave()}>Save</button>
        <button className="win95-button small" onClick={() => void handleDelete()}>Delete</button>
        <div className="toolbar-divider" />
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
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
        onChange={(e) => setContent(e.target.value)}
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
