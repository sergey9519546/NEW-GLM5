'use client'

import { useState, useCallback } from 'react'

interface Snapshot {
  available: boolean
  snapshotUrl?: string
  timestamp?: string
}

export function WaybackApp() {
  const [url, setUrl] = useState('')
  const [timestamp, setTimestamp] = useState('')
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [proxyHtml, setProxyHtml] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleResolve = useCallback(async () => {
    const trimmed = url.trim()
    if (!trimmed) return

    setIsLoading(true)
    setError(null)
    setProxyHtml(null)
    setSnapshot(null)

    try {
      const params = new URLSearchParams({ action: 'resolve', url: trimmed })
      if (timestamp) params.set('timestamp', timestamp)

      const res = await fetch(`/api/wayback?${params}`)
      if (!res.ok) throw new Error(`API error ${res.status}`)

      const data: Snapshot = await res.json()
      setSnapshot(data)

      if (data.available && data.snapshotUrl) {
        // Auto-load the snapshot
        const proxyParams = new URLSearchParams({
          action: 'proxy',
          url: data.snapshotUrl,
        })
        const proxyRes = await fetch(`/api/wayback?${proxyParams}`)
        if (proxyRes.ok) {
          setProxyHtml(await proxyRes.text())
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to look up URL')
    } finally {
      setIsLoading(false)
    }
  }, [url, timestamp])

  const formatTimestamp = (ts: string) => {
    if (ts.length < 8) return ts
    return `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`
  }

  return (
    <div className="wayback-app">
      <div className="wayback-toolbar">
        <div className="wayback-title">Wayback Machine</div>
      </div>

      <div className="wayback-address-bar">
        <label className="wayback-label">URL:</label>
        <input
          className="wayback-url-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleResolve()
          }}
        />
        <label className="wayback-label">Date:</label>
        <input
          className="wayback-date-input"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          placeholder="YYYYMMDD"
          maxLength={14}
        />
        <button
          className="wayback-go-btn"
          onClick={() => void handleResolve()}
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? '...' : 'Go'}
        </button>
      </div>

      <div className="wayback-content">
        {error && <div className="wayback-error">{error}</div>}

        {snapshot && !snapshot.available && (
          <div className="wayback-not-found">
            <div className="wayback-not-found-title">No snapshot found</div>
            <div>The Wayback Machine has no archived copy of this URL.</div>
          </div>
        )}

        {snapshot?.available && snapshot.timestamp && !proxyHtml && (
          <div className="wayback-info">
            Snapshot from {formatTimestamp(snapshot.timestamp)} — Loading...
          </div>
        )}

        {proxyHtml && (
          <div className="wayback-frame-wrapper">
            {snapshot?.timestamp && (
              <div className="wayback-snapshot-banner">
                Archived snapshot from {formatTimestamp(snapshot.timestamp)}
              </div>
            )}
            <iframe
              className="wayback-frame"
              srcDoc={proxyHtml}
              sandbox="allow-same-origin"
              title="Wayback Machine snapshot"
            />
          </div>
        )}

        {!snapshot && !error && !isLoading && (
          <div className="wayback-empty">
            <div className="wayback-empty-title">Wayback Machine Browser</div>
            <div>Enter a URL above to look up its archived snapshots on the Wayback Machine.</div>
          </div>
        )}
      </div>
    </div>
  )
}
