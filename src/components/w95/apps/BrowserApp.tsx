'use client'

import { useState, useRef, useCallback } from 'react'
import { W98_ICONS } from '@/lib/icons'

export function BrowserApp() {
  const [url, setUrl] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const navigate = useCallback(
    (targetUrl: string) => {
      let normalized = targetUrl.trim()
      if (!normalized) return

      if (!/^https?:\/\//i.test(normalized)) {
        normalized = `https://${normalized}`
      }

      setCurrentUrl(normalized)
      setIsLoading(true)

      setHistory((prev) => {
        const newHistory = [...prev.slice(0, historyIndex + 1), normalized]
        setHistoryIndex(newHistory.length - 1)
        return newHistory
      })
    },
    [historyIndex],
  )

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCurrentUrl(history[newIndex])
      setUrl(history[newIndex])
      setIsLoading(true)
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCurrentUrl(history[newIndex])
      setUrl(history[newIndex])
      setIsLoading(true)
    }
  }

  const handleRefresh = () => {
    if (currentUrl && iframeRef.current) {
      setIsLoading(true)
      iframeRef.current.src = currentUrl
    }
  }

  return (
    <div className="browser-app">
      <div className="browser-toolbar">
        <button
          className="browser-nav-btn"
          onClick={goBack}
          disabled={historyIndex <= 0}
          title="Back"
        >
          ◀
        </button>
        <button
          className="browser-nav-btn"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          title="Forward"
        >
          ▶
        </button>
        <button className="browser-nav-btn" onClick={handleRefresh} title="Refresh">
          ↻
        </button>
      </div>

      <div className="browser-address-bar">
        <img src={W98_ICONS.ie} alt="" className="browser-address-icon" />
        <input
          className="browser-url-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate(url)
          }}
          placeholder="https://example.com"
        />
        <button className="browser-go-btn" onClick={() => navigate(url)}>
          Go
        </button>
      </div>

      <div className="browser-content">
        {currentUrl ? (
          <iframe
            ref={iframeRef}
            className="browser-frame"
            src={currentUrl}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Web page"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        ) : (
          <div className="browser-home">
            <img src={W98_ICONS.ie} alt="" className="browser-home-icon" />
            <div className="browser-home-title">Internet Explorer</div>
            <div className="browser-home-sub">Enter a URL above to browse the web.</div>
          </div>
        )}
        {isLoading && currentUrl && <div className="browser-loading">Loading...</div>}
      </div>

      <div className="browser-statusbar">
        <span>{isLoading ? 'Loading...' : currentUrl ? 'Done' : 'Ready'}</span>
      </div>
    </div>
  )
}
