'use client'

import { useState } from 'react'
import { useWindowStore } from '@/store'
import { W98_ICONS } from '@/lib/icons'
import { WindowFrame } from '../core/WindowFrame'

export function NotepadApp() {
  const { getWindowById } = useWindowStore()
  const [content, setContent] = useState('')
  const [filename, setFilename] = useState('Untitled')
  const [wordWrap, setWordWrap] = useState(true)
  
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
        <button className="win95-button small">New</button>
        <button className="win95-button small">Open</button>
        <button className="win95-button small">Save</button>
        <div className="toolbar-divider" />
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
        <span>Lines: {lineCount}</span>
        <span>Words: {wordCount}</span>
        <span>Chars: {charCount}</span>
      </div>
    </div>
  )
}
